import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

import { BleErrorCode } from '@sfourdrinier/react-native-ble-plx';
import { decode } from 'base-64';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Result } from 'neverthrow';

import { RSSI_UPDATE_INTERVAL } from '@/constants/ble-config';
import { Ble, printBleError } from '@/services/ble-service';
import {
	addTxNotificationAtom,
	clearDiscoveredServicesAtom,
	connectedDeviceAtom,
	connectedDeviceRssiAtom,
	connectionStatusAtom,
	discoveredServicesAtom,
	isConnectedAtom,
	isConnectingAtom,
	removeDiscoveredDeviceAtom,
} from '@/store/ble-atoms';
import { ConnectionStatus, Device, DeviceId, ServiceInfo, TxNotification, BleError } from '@/types/ble-types';

export function useBleConnection() {
	const [connectionStatus, setConnectionStatus] = useAtom(connectionStatusAtom);
	const [connectedDevice, setConnectedDevice] = useAtom(connectedDeviceAtom);
	const [discoveredServices, setDiscoveredServices] = useAtom(discoveredServicesAtom);
	const setConnectedDeviceRssi = useSetAtom(connectedDeviceRssiAtom);
	const isConnected = useAtomValue(isConnectedAtom);
	const isConnecting = useAtomValue(isConnectingAtom);
	const clearDiscoveredServices = useSetAtom(clearDiscoveredServicesAtom);
	const removeDiscoveredDevice = useSetAtom(removeDiscoveredDeviceAtom);
	const addNotification = useSetAtom(addTxNotificationAtom);
	const rssiIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const navigator = useRouter();

	// Start RSSI monitoring whenever connected (keeps scanner updated)
	useEffect(() => {
		if (!isConnected || !connectedDevice) {
			setConnectedDeviceRssi(null);
			if (rssiIntervalRef.current) {
				clearInterval(rssiIntervalRef.current);
				rssiIntervalRef.current = null;
			}
			return;
		}

		if (connectedDevice.rssi !== null) {
			setConnectedDeviceRssi(connectedDevice.rssi);
		}

		async function updateRssi() {
			if (!connectedDevice) return;
			const result = await Ble.readRSSI(connectedDevice.id);
			if (result.isOk()) {
				setConnectedDeviceRssi(result.value);
			}
		}

		updateRssi(); // Initial read
		rssiIntervalRef.current = setInterval(updateRssi, RSSI_UPDATE_INTERVAL); // Subsequent reads

		return () => {
			if (rssiIntervalRef.current) {
				clearInterval(rssiIntervalRef.current);
				rssiIntervalRef.current = null;
			}
		};
	}, [isConnected, connectedDevice, setConnectedDeviceRssi]);

	function handleOnDisconnect(error: BleError | null, device: Device) {
		setConnectionStatus(ConnectionStatus.Disconnected);
		setConnectedDevice(null);
		setConnectedDeviceRssi(null);
		clearDiscoveredServices();
		removeDiscoveredDevice(device.id);
		navigator.push("/");
	}

	async function connect(deviceId: DeviceId): Promise<Device | null> {
		setConnectionStatus(ConnectionStatus.Connecting);

		const result = await Ble.connect(deviceId, handleOnDisconnect);

		if (result.isOk()) {
			const device = result.value;

			const services = await device.services();
			const serviceInfos: ServiceInfo[] = await Promise.all(
				services.map(async (service) => {
					const characteristics = await service.characteristics();
					return {
						uuid: service.uuid,
						characteristics: characteristics.map((char) => ({
							uuid: char.uuid,
							serviceUUID: service.uuid,
							isReadable: char.isReadable,
							isWritableWithResponse: char.isWritableWithResponse,
							isWritableWithoutResponse: char.isWritableWithoutResponse,
							isNotifiable: char.isNotifiable,
							isIndicatable: char.isIndicatable,
						})),
					};
				}),
			);

			Ble.startTxMonitor(device.id, (notificationResult) => {
				if (notificationResult.isErr()) {
					const error = notificationResult.error;
					if (
						error.errorCode === BleErrorCode.OperationCancelled ||
						error.errorCode === BleErrorCode.DeviceDisconnected ||
						error.errorCode === BleErrorCode.UnknownError // Often happens during forced disconnect
					) {
						return;
					}

					printBleError(error);
					return;
				}

				const characteristic = notificationResult.value;
				const notification: TxNotification = {
					id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
					rawData: characteristic.value || '',
					decodedData: characteristic.value ? decode(characteristic.value) : '',
					receivedAt: Date.now(),
					deviceId: characteristic.deviceID,
				};
				addNotification(notification);
			});

			setConnectedDevice(device);
			setConnectionStatus(ConnectionStatus.Connected);
			setDiscoveredServices(serviceInfos);
			return device;
		} else {
			console.error('Connection failed:', result.error);
			setConnectionStatus(ConnectionStatus.Disconnected);
			return null;
		}
	}

	async function disconnect(): Promise<void> {
		if (!connectedDevice) {
			return;
		}

		setConnectionStatus(ConnectionStatus.Disconnecting);

		const result = await Ble.disconnect(connectedDevice.id);

		if (result.isErr()) {
			console.error('Disconnect failed:', result.error);
		}

		setConnectionStatus(ConnectionStatus.Disconnected);
		setConnectedDevice(null);
		clearDiscoveredServices();
	}

	return {
		connectionStatus,
		connectedDevice,
		discoveredServices,
		isConnected,
		isConnecting,
		connect,
		disconnect,
		setConnectionStatus,
		setConnectedDevice,
	};
}
