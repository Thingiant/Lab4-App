import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { State as AdapterState } from '@sfourdrinier/react-native-ble-plx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { Ble } from '@/services/ble-service';
import { adapterStateAtom, connectedDeviceAtom, connectionStatusAtom, isAdapterReadyAtom, } from '@/store/ble-atoms';
import { ConnectionStatus, PermissionStatusEnum } from '@/types/ble-types';

import { useBlePermissions } from './use-ble-permissions';


export function useBleAdapter() {
	const { permissionState, requestBlePermission } = useBlePermissions();
	const [adapterState, setAdapterState] = useAtom(adapterStateAtom);
	const isAdapterReady = useAtomValue(isAdapterReadyAtom);
	const setConnectionStatus = useSetAtom(connectionStatusAtom);
	const setConnectedDevice = useSetAtom(connectedDeviceAtom);
	const isInitializedRef = useRef(false);

	const onStateChange = useCallback((state: AdapterState) => {
		setAdapterState(state);

		if (state === AdapterState.PoweredOn) {
			console.debug('Adapter powered on');
		}
		else if (state === AdapterState.Unauthorized) {
			console.debug('Adapter unauthorized');
			if (Platform.OS === 'android') {
				requestBlePermission();
			}
		}
		else {
			setConnectionStatus(ConnectionStatus.Disconnected);
			setConnectedDevice(null);
		}
	}, [requestBlePermission, setAdapterState, setConnectedDevice, setConnectionStatus]);

	const initAdapterStateChange = useCallback(() => {
		if (isInitializedRef.current)
			return;

		isInitializedRef.current = true;
		Ble.onAdapterStateChange(onStateChange);

		if (Platform.OS === 'android') {
			requestBlePermission();
			if (permissionState !== PermissionStatusEnum.Granted) {
			}
		}

		isInitializedRef.current = true;
	}, [onStateChange, permissionState, requestBlePermission]);

	const destroy = () => {
		if (!isInitializedRef.current)
			return;

		Ble.destroy();
		isInitializedRef.current = false;
		setAdapterState(AdapterState.Unknown);
	};

	useEffect(() => {
		initAdapterStateChange();

		return () => {
			// Don't destroy on unmount - we want service to persist
		};
	}, [initAdapterStateChange]);



	return {
		adapterState,
		isAdapterReady,
		initialize: initAdapterStateChange,
		destroy,
	};
}
