import { useAtom } from 'jotai';

import { requestPermissions, openSettings } from '@/services/ble-permissions';
import { permissionStateAtom } from '@/store/ble-atoms';
import { PermissionStatusEnum } from '@/types/ble-types';


export function useBlePermissions() {
	const [permissionState, setPermissionState] = useAtom(permissionStateAtom);

	const isGranted = permissionState === PermissionStatusEnum.Granted;
	const isNeverAskAgain = permissionState === PermissionStatusEnum.NeverAskAgain;
	async function requestBlePermission() {
		const state = await requestPermissions();
		setPermissionState(state);
	}

	function openBleSettings() {
		openSettings();
	}

	return {
		permissionState,
		isGranted,
		isNeverAskAgain,
		requestPermissions: requestBlePermission,
		requestBlePermission,
		openBleSettings,
	};
}
