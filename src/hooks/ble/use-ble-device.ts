import { useAtomValue, useSetAtom } from 'jotai';

import { Ble } from '@/services/ble-service';
import {
	clearTxNotificationHistoryAtom,
	connectedDeviceAtom,
	connectedDeviceRssiAtom,
	isConnectedAtom,
	txNotificationHistoryAtom,
} from '@/store/ble-atoms';

export function useBleDevice() {
	const device = useAtomValue(connectedDeviceAtom);
	const isConnected = useAtomValue(isConnectedAtom);
	const rssi = useAtomValue(connectedDeviceRssiAtom);
	const notificationHistory = useAtomValue(txNotificationHistoryAtom);
	const clearHistory = useSetAtom(clearTxNotificationHistoryAtom);

	async function writeToRx(data: string): Promise<boolean> {
		if (!device || !isConnected) return false;

		const result = await Ble.writeToRx(device.id, data);
		return result.isOk();
	}

	return {
		device,
		rssi,
		isConnected,
		writeToRx,
		notificationHistory,
		clearHistory,
	};
}
