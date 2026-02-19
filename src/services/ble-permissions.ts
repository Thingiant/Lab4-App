import { Alert, Linking, PermissionsAndroid, Platform, type PermissionStatus } from 'react-native';

import { PermissionStatusEnum } from '@/types/ble-types';

// ============================================================================
// Android Permissions Only
// ============================================================================

const mapStatusToState = (status: PermissionStatus): PermissionStatusEnum => {
	if (status === PermissionsAndroid.RESULTS.GRANTED) {
		return PermissionStatusEnum.Granted;
	}
	if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
		return PermissionStatusEnum.NeverAskAgain;
	}
	return PermissionStatusEnum.Denied;
};

export async function requestPermissions(): Promise<PermissionStatusEnum> {
	if (Platform.OS !== 'android') {
		return PermissionStatusEnum.Granted;
	}

	const apiLevel = parseInt(Platform.Version.toString(), 10);
	if (apiLevel < 31) {
		const result = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
		);
		return mapStatusToState(result);
	}

	const result = await PermissionsAndroid.requestMultiple([
		PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
		PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
	]);
	const statuses = Object.values(result);
	if (statuses.some((status) => status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)) {
		return PermissionStatusEnum.NeverAskAgain;
	}
	const allGranted = statuses.every((status) => status === PermissionsAndroid.RESULTS.GRANTED);
	return allGranted ? PermissionStatusEnum.Granted : PermissionStatusEnum.Denied;
}

export function openSettings() {
	if (Platform.OS === "android") {
		// await Linking.openSettings(); // Opens app settings
		Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS'); // Opens app settings – user must enable BT manually
	} else {
		Linking.openURL("App-Prefs:Bluetooth"); // iOS deep link (may vary per version)
	}
};