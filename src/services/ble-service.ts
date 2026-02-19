import {
	BleManager,
	Device,
	State as AdapterState,
	Subscription,
	BleError,
	DeviceId,
	UUID,
	BleErrorCode,
	LogLevel,
	Characteristic,
} from '@sfourdrinier/react-native-ble-plx';
import { encode, decode } from 'base-64';
import { err, ok, Result } from 'neverthrow';

import { BLE_MTU, BLE_RX_CHARACTERISTIC_UUID, BLE_SERVICE_UUID, BLE_TX_CHARACTERISTIC_UUID } from '@/constants/ble-config';

export function printBleError(error: unknown): void {
	if (error instanceof BleError) {
		console.error('BLE Error:', {
			code: error.errorCode,
			message: error.message,
		});
	} else if (error instanceof Error) {
		console.error('System Error:', {
			name: error.name,
			message: error.message,
			stack: error.stack,
		});
	} else {
		console.error('Unknown error:', error);
	}
}

function toBleErr<T>(error: unknown): Result<T, BleError> {
	printBleError(error);
	return err(error as BleError);
}

export class BleService {
	private static instance: BleService;
	private manager: BleManager;
	private stateSubscription: Subscription | null = null;
	private disconnectSubscription: Subscription | null = null;
	private txMonitorSubscription: Subscription | null = null;

	private constructor() {
		this.manager = new BleManager();
		this.manager.setLogLevel(LogLevel.Info); // Turn off in production
	}

	public static getInstance(): BleService {
		if (!BleService.instance) {
			BleService.instance = new BleService();
		}
		return BleService.instance;
	}

	// ==========================================================================
	// Lifecycle Methods
	// ==========================================================================

	public async destroy() {
		await this.stopScan();
		this.stopTxMonitor();
		this.stopDisconnectSubscription();
		this.stopStateSubscription();
		this.manager.destroy();
	}

	public onAdapterStateChange(onStateChange: (state: AdapterState) => void): void {
		this.stopStateSubscription();
		// The second parameter `true` tells onStateChange to emit the current state immediately
		this.stateSubscription = this.manager.onStateChange((state) => {
			if (state !== AdapterState.PoweredOn) {
				this.stopTxMonitor();
				this.stopDisconnectSubscription();
				console.debug('Bluetooth turned off');
			}
			onStateChange(state as AdapterState);
		}, true);
	}

	public getAdapterState() {
		return this.manager.state();
	}

	// ==========================================================================
	// Scanning Methods
	// ==========================================================================

	public async startScan(onDeviceScanned: (result: Result<Device, BleError>) => void,	filterByServiceUUID: boolean = false): Promise<Result<void, BleError>> {
		const serviceUUIDs = filterByServiceUUID ? [BLE_SERVICE_UUID] : null;
		try {
			await this.manager.startDeviceScan(serviceUUIDs, null, (error, device) => {
				if (error) {
					onDeviceScanned(err(error));
				} else if (device) {
					onDeviceScanned(ok(device));
				}
			});
			return ok(undefined);
		} catch (error) {
			return toBleErr(error);
		}
	}

	public async stopScan(): Promise<Result<void, BleError>> {
		try {
			await this.manager.stopDeviceScan();
			return ok(undefined);
		} catch (error) {
			return toBleErr(error);
		}
	}

	// ==========================================================================
	// Connection Methods
	// ==========================================================================

	public async connect(deviceId: DeviceId, onDisconnect: (error: BleError | null, device: Device) => void): Promise<Result<Device, BleError>> {
		try {
			await this.manager.stopDeviceScan();

			let device = await this.manager.connectToDevice(deviceId);
			device = await device.discoverAllServicesAndCharacteristics();
			device = await this.requestMtu(device);

			this.setupDisconnectListener(deviceId, onDisconnect);

			return ok(device);
		} catch (error) {
			return toBleErr(error);
		}
	}
	public async cancelConnection(deviceId: DeviceId): Promise<Result<Device, BleError>> {
		try {
			const device = await this.manager.cancelDeviceConnection(deviceId);
			this.stopTxMonitor();
			this.stopDisconnectSubscription();
			return ok(device);
		} catch (error) {
			return toBleErr(error);
		}
	}

	public async disconnect(deviceId: DeviceId): Promise<Result<void, BleError>> {
		try {
			this.stopTxMonitor();
			this.stopDisconnectSubscription();

			await this.manager.cancelDeviceConnection(deviceId);

			return ok(undefined);
		} catch (error) {
			return toBleErr(error);
		}
	}

	public isConnected(deviceId: DeviceId) {
		return this.manager.isDeviceConnected(deviceId);
	}

	// ==========================================================================
	// Read/Write Methods
	// ==========================================================================

	public async readRSSI(deviceId: DeviceId): Promise<Result<number, BleError>> {
		try {
			const device = await this.manager.readRSSIForDevice(deviceId);
			return ok(device.rssi ?? 0);
		} catch (error) {
			return toBleErr(error);
		}
	}

	public async writeCharacteristicWithoutResponse(
		deviceId: DeviceId,
		serviceUUID: UUID,
		characteristicUUID: UUID,
		data: string,
	): Promise<Result<Characteristic, BleError>> {
		try {
			const base64Data = encode(data);
			const characteristic = await this.manager.writeCharacteristicWithoutResponseForDevice(deviceId, serviceUUID, characteristicUUID, base64Data);
			return ok(characteristic);
		} catch (error) {
			return toBleErr(error);
		}
	}

	public async writeToRx(deviceId: DeviceId, data: string) {
		return await this.writeCharacteristicWithoutResponse(deviceId, BLE_SERVICE_UUID, BLE_RX_CHARACTERISTIC_UUID, data);
	}

	public startTxMonitor(
		deviceId: DeviceId,
		onCharacteristicNotification: (result: Result<Characteristic, BleError>) => void,
	): Result<void, BleError> {
		try {
			this.stopTxMonitor();

			this.txMonitorSubscription = this.manager.monitorCharacteristicForDevice(
				deviceId,
				BLE_SERVICE_UUID,
				BLE_TX_CHARACTERISTIC_UUID,
				(error, characteristic) => {
					if (error) {
						onCharacteristicNotification(err(error));
					} else if (characteristic) {
						onCharacteristicNotification(ok(characteristic));
					}
				},
			);

			return ok(undefined);
		} catch (error) {
			return toBleErr(error);
		}
	}

	// ==========================================================================
	// Utility Methods
	// ==========================================================================

	public async requestMtu(device: Device): Promise<Device> {
		try {
			const oldMtu = device.mtu;
			const updatedDevice = await device.requestMTU(BLE_MTU);
			// console.debug(`MTU: ${oldMtu} -> ${updatedDevice.mtu}`);
			return updatedDevice;
		} catch (error) {
			console.warn('MTU request failed', error);
			return device;
		}
	}

	public stopTxMonitor() {
		this.txMonitorSubscription?.remove();
		this.txMonitorSubscription = null;
	}

	public stopDisconnectSubscription() {
		this.disconnectSubscription?.remove();
		this.disconnectSubscription = null;
	}

	public stopStateSubscription() {
		this.stateSubscription?.remove();
		this.stateSubscription = null;
	}

	private setupDisconnectListener(deviceId: DeviceId, onDisconnect: (error: BleError | null, device: Device) => void): void {
		this.disconnectSubscription?.remove();
		this.disconnectSubscription = this.manager.onDeviceDisconnected(deviceId, (error: BleError | null, device: Device) => {
			this.stopTxMonitor();
			onDisconnect(error, device);
		});
	}
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const Ble = BleService.getInstance();
