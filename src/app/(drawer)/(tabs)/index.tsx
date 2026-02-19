import React, { useLayoutEffect, useState, useRef } from 'react';
import { View, Text, RefreshControl, Alert, FlatList } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useRouter, useNavigation } from 'expo-router';

import { useAtomValue } from 'jotai';
import { useTimeout } from 'usehooks-ts';

import { DeviceCard, ScanButton } from '@/components/scanner';
import { Center } from '@/components/ui/Center';
import { useBleConnection, useBleScanner } from '@/hooks/ble';
import { adapterStateAtom, connectedDeviceRssiAtom, discoveredDevicesListAtom } from '@/store/ble-atoms';
import { AdapterState, ConnectionStatus, DeviceId, DeviceInfo } from '@/types/ble-types';

const getDisplayedDevices = (discoveredDevices: DeviceInfo[], connectedDevice: DeviceInfo | null): DeviceInfo[] => {
	if (!connectedDevice) return discoveredDevices;

	const connectedId = connectedDevice.id;
	const existing = discoveredDevices.find((d) => d.id === connectedId);
	const rest = existing ? discoveredDevices.filter((d) => d.id !== connectedId) : discoveredDevices;

	return [connectedDevice, ...rest];
};

export default function ScannerScreen(): React.ReactElement {
	const router = useRouter();
	const navigation = useNavigation();
	const { isScanning, startScan, stopScan } = useBleScanner();
	const { connectedDevice, connect, disconnect, isConnecting, connectionStatus } = useBleConnection();
	const filteredDevices = useAtomValue(discoveredDevicesListAtom);
	const adapterState = useAtomValue(adapterStateAtom);
	const connectedDeviceRssi = useAtomValue(connectedDeviceRssiAtom);
	const [connectingDeviceId, setConnectingDeviceId] = useState<DeviceId | null>(null);

	const displayedDevices = getDisplayedDevices(filteredDevices, connectedDevice);

	async function handleRefreshScan() {
		if (adapterState !== AdapterState.PoweredOn) {
			Alert.alert('Bluetooth Off', 'Please enable Bluetooth to scan for devices.');
			return;
		}

		startScan();
	}

	function handleDisconnect(): void {
		if (!connectedDevice) return;
		if (isConnecting) return;

		Alert.alert('Disconnect?', 'Disconnect from the currently connected device?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Disconnect',
				style: 'destructive',
				onPress: async () => {
					try {
						stopScan();
						await disconnect();
					} catch (error) {
						console.error('Disconnect error:', error);
						Alert.alert('Error', 'Failed to disconnect from device');
					}
				},
			},
		]);
	}

	async function connectToDevice(deviceId: DeviceId, shouldDisconnect: boolean) {
		stopScan();
		setConnectingDeviceId(deviceId);

		try {
			if (shouldDisconnect && connectedDevice) {
				await disconnect();
			}

			await connect(deviceId);
			setConnectingDeviceId(null);
			router.push('/device');
		} catch (error) {
			console.error('Connection error:', error);
			setConnectingDeviceId(null);
			Alert.alert('Connection Failed', error instanceof Error ? error.message : 'Failed to connect to device');
		}
	}

	async function handleDevicePress(device: DeviceInfo) {
		if (isConnecting) {
			return;
		}

		if (connectedDevice?.id === device.id) {
			handleDisconnect();
			return;
		}

		if (!device.isConnectable) {
			Alert.alert('Not Connectable', 'This device does not support connections.');
			return;
		}

		if (connectedDevice) {
			Alert.alert(
				'Connect to new device?',
				'Disconnect from the current device and connect to the selected device?',
				[
					{ text: 'Cancel', style: 'cancel' },
					{
						text: 'Connect',
						style: 'destructive',
						onPress: async () => {
							await connectToDevice(device.id, true);
						},
					},
				]
			);
			return;
		}

		await connectToDevice(device.id, false);
	}

	function renderDevice({ item }: { item: DeviceInfo }) {
		const isConnectedDevice = connectedDevice?.id === item.id;
		const status = isConnectedDevice
			? connectingDeviceId && connectingDeviceId !== item.id
				? ConnectionStatus.Connected
				: connectionStatus
			: connectingDeviceId === item.id
				? ConnectionStatus.Connecting
				: ConnectionStatus.Disconnected;
		const deviceForCard =
			isConnectedDevice && connectedDeviceRssi !== null
				? {
						...item,
						rssi: connectedDeviceRssi,
					}
				: item;
		return <DeviceCard device={deviceForCard} connectionStatus={status} onPress={() => handleDevicePress(item)} disabled={isConnecting} />;
	}

	const ListEmpty = () => (
		<Center style={styles.emptyContainer}>
			<Text style={styles.emptyText}>{isScanning ? '' : 'No devices found.'}</Text>
		</Center>
	);

	useLayoutEffect(() => {
		function handleScanPressed() {
			if (isScanning) {
				stopScan();
			} else {
				if (adapterState !== AdapterState.PoweredOn) {
					Alert.alert('Bluetooth Off', 'Please enable Bluetooth to scan for devices.');
					return;
				}
				startScan();
			}
		}

		navigation.setOptions({
			headerRight: () => <ScanButton isScanning={isScanning} onPress={handleScanPressed} />,
		});
	}, [navigation, isScanning, stopScan, adapterState, startScan]);

	return (
		<View style={styles.container}>
			<FlatList
				data={displayedDevices}
				renderItem={renderDevice}
				keyExtractor={(item) => item.id}
				ListEmptyComponent={ListEmpty}
				refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefreshScan} tintColor={styles.refreshTint.color} />}
				contentContainerStyle={styles.listContent}
			/>
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		paddingTop: theme.spacing.xsmall,
		backgroundColor: theme.colors.backgroundScreen,
	},
	listHeader: {
		paddingTop: theme.spacing.xsmall,
		paddingBottom: theme.spacing.xsmall,
	},
	scanningText: {
		...theme.textVariants.body3,
		color: theme.colors.contentAccent,
		textAlign: 'center',
	},
	listContent: {
		flex: 1,
		backgroundColor: theme.colors.backgroundScreen,
		paddingBottom: theme.spacing.xlarge,
	},
	emptyContainer: {
		flex: 1,
		paddingVertical: theme.spacing.xxlarge,
		paddingHorizontal: theme.spacing.large,
	},
	emptyText: {
		...theme.textVariants.body1,
		color: theme.colors.contentTertiary,
		textAlign: 'center',
	},
	refreshTint: {
		color: theme.colors.interactivePrimary,
	},
}));
