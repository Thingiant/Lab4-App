import { useRef } from 'react';

import { useDebouncedCallback, useThrottledCallback } from '@tanstack/react-pacer';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Result } from 'neverthrow';

import { SCAN_TIMEOUT_MS } from '@/constants/ble-config';
import { Ble } from '@/services/ble-service';
import {
	addDiscoveredDeviceAtom,
	clearDiscoveredDevicesAtom,
	isScanningAtom,
	isAdapterReadyAtom,
	discoveredDevicesListAtom,
} from '@/store/ble-atoms';
import { Device, BleError } from '@/types/ble-types';


export function useBleScanner() {
	const [isScanning, setIsScanning] = useAtom(isScanningAtom);
	const isAdapterReady = useAtomValue(isAdapterReadyAtom);
	const addDiscoveredDevice = useSetAtom(addDiscoveredDeviceAtom);
	const clearDiscoveredDevices = useSetAtom(clearDiscoveredDevicesAtom);
	const discoveredDevicesList = useAtomValue(discoveredDevicesListAtom);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	function clearScanTimeout() {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}

	async function stopScan() {
		if (!isScanning)
			return;

		if ((await Ble.stopScan()).isOk()) {
			clearScanTimeout();
			setIsScanning(false);
		}
	}

	async function startScan(timeout: number = SCAN_TIMEOUT_MS) {
		if (isScanning) {
			await stopScan();
		}

		clearDiscoveredDevices();
		const result = await Ble.startScan((scanResult: Result<Device, BleError>) => {
			if (scanResult.isOk()) {
				addDiscoveredDevice(scanResult.value);
			} else {
				setIsScanning(false);
			}
		}, true);

		if (result.isErr()) {
			console.error('Error starting scan', result.error);
			setIsScanning(false);
			return;
		}

		setIsScanning(true);
		clearScanTimeout();

		if (timeout > 0) {
			timeoutRef.current = setTimeout(() => {
				stopScan();
			}, timeout);
		}
	};



	return {
		isScanning,
		isAdapterReady,
		discoveredDevicesList,
		startScan,
		stopScan,
		clearDiscoveredDevices,
	};
}
