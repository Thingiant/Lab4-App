import { atom } from 'jotai';

import {
	ChatMessage,
	ConnectionStatus,
	FilterOptions,
	PermissionStatusEnum,
	ServiceInfo,
	TxNotification,
	AdapterState,
	Device,
	DeviceId,
} from '@/types/ble-types';

// ============================================================================
// Adapter State
// ============================================================================

export const adapterStateAtom = atom<AdapterState>(AdapterState.Unknown);

export const isAdapterReadyAtom = atom<boolean>((get) => {
	return get(adapterStateAtom) === AdapterState.PoweredOn;
});

// ============================================================================
// Permission State
// ============================================================================

export const permissionStateAtom = atom<PermissionStatusEnum>(PermissionStatusEnum.Denied);

// ============================================================================
// Scanning State
// ============================================================================

export const isScanningAtom = atom<boolean>(false);

export const discoveredDevicesMapAtom = atom<Map<DeviceId, Device>>(new Map());
export const discoveredDeviceRssiMapAtom = atom<Map<DeviceId, number>>(new Map());

export const discoveredDevicesListAtom = atom<Device[]>((get) => {
	// Sort by RSSI (higher/closer first), null values last, and filter out unknown devices
	const devicesMap = get(discoveredDevicesMapAtom);
	return Array.from(devicesMap.values())
		.sort((a, b) => {
			const rssiA = a.rssi ?? -Infinity;
			const rssiB = b.rssi ?? -Infinity;
			return rssiB - rssiA;
		})
		.filter((device) => device.name !== null || device.localName !== null);
});

export const addDiscoveredDeviceAtom = atom(null, (get, set, device: Device) => {
	const devicesMap = get(discoveredDevicesMapAtom);
	const rssiMap = get(discoveredDeviceRssiMapAtom);
	const newMap = new Map(devicesMap);
	newMap.set(device.id, device);
	set(discoveredDevicesMapAtom, newMap);

	if (device.rssi !== null) {
		const newRssiMap = new Map(rssiMap);
		newRssiMap.set(device.id, device.rssi);
		set(discoveredDeviceRssiMapAtom, newRssiMap);
	}
});

export const removeDiscoveredDeviceAtom = atom(null, (get, set, deviceId: DeviceId) => {
	const devicesMap = get(discoveredDevicesMapAtom);
	const rssiMap = get(discoveredDeviceRssiMapAtom);
	const newMap = new Map(devicesMap);
	newMap.delete(deviceId);
	set(discoveredDevicesMapAtom, newMap);

	const newRssiMap = new Map(rssiMap);
	newRssiMap.delete(deviceId);
	set(discoveredDeviceRssiMapAtom, newRssiMap);
});

export const clearDiscoveredDevicesAtom = atom(null, (_get, set) => {
	set(discoveredDevicesMapAtom, new Map());
	set(discoveredDeviceRssiMapAtom, new Map());
});

// ============================================================================
// Connection State
// ============================================================================

export const connectedDeviceAtom = atom<Device | null>(null);

export const connectedDeviceRssiAtom = atom<number | null>(null);

export const connectionStatusAtom = atom<ConnectionStatus>(ConnectionStatus.Disconnected);

export const isConnectedAtom = atom<boolean>((get) => {
	return get(connectionStatusAtom) === ConnectionStatus.Connected;
});

export const isConnectingAtom = atom<boolean>((get) => {
	return get(connectionStatusAtom) === ConnectionStatus.Connecting;
});

// ============================================================================
// TX Notifications
// ============================================================================

export const txNotificationAtom = atom<TxNotification | null>(null);

const MAX_NOTIFICATION_HISTORY = 100;
export const txNotificationHistoryAtom = atom<TxNotification[]>([]);

export const addTxNotificationAtom = atom(null, (get, set, notification: TxNotification) => {
	set(txNotificationAtom, notification);
	const history = get(txNotificationHistoryAtom);
	const newHistory = [notification, ...history].slice(0, MAX_NOTIFICATION_HISTORY);
	set(txNotificationHistoryAtom, newHistory);
});

export const clearTxNotificationHistoryAtom = atom(null, (_get, set) => {
	set(txNotificationAtom, null);
	set(txNotificationHistoryAtom, []);
});

// ============================================================================
// Discovered Services
// ============================================================================

export const discoveredServicesAtom = atom<ServiceInfo[]>([]);

export const setDiscoveredServicesAtom = atom(null, (_get, set, services: ServiceInfo[]) => {
	set(discoveredServicesAtom, services);
});

export const clearDiscoveredServicesAtom = atom(null, (_get, set) => {
	set(discoveredServicesAtom, []);
});

// ============================================================================
// Chat Messages (outgoing messages)
// ============================================================================

export const chatMessagesAtom = atom<ChatMessage[]>([]);

export const addChatMessageAtom = atom(null, (get, set, message: ChatMessage) => {
	const messages = get(chatMessagesAtom);
	set(chatMessagesAtom, [...messages, message]);
});

export const clearChatMessagesAtom = atom(null, (_get, set) => {
	set(chatMessagesAtom, []);
});
