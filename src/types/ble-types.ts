import { DeviceId, UUID } from '@sfourdrinier/react-native-ble-plx';

export { DeviceId, UUID, Device, State as AdapterState, BleError, Subscription } from '@sfourdrinier/react-native-ble-plx';

// ============================================================================
// Service Types
// ============================================================================

export enum ConnectionStatus {
	Disconnected = 'Disconnected',
	Connecting = 'Connecting',
	Connected = 'Connected',
	Disconnecting = 'Disconnecting',
}

export enum PermissionStatusEnum {
	Granted = 'granted',
	Denied = 'denied',
	NeverAskAgain = 'never_ask_again',
}

// ============================================================================
// UI Types
// ============================================================================

export interface TxNotification {
	id: string;
	rawData: string;
	decodedData: string;
	receivedAt: number;
	deviceId: DeviceId;
}

export interface FilterOptions {
	byServiceUUID: boolean;
	byName: string;
}

export interface ChatMessage {
	id: string;
	text: string;
	timestamp: number;
	isOutgoing: boolean;
}

export interface DeviceInfo {
	id: DeviceId;
	name: string | null;
	localName: string | null;
	rssi: number | null;
	mtu: number | null;
	isConnectable: boolean | null;
	serviceUUIDs: UUID[] | null;
}

export interface CharacteristicInfo {
	uuid: string;
	serviceUUID: string;
	isReadable: boolean;
	isWritableWithResponse: boolean;
	isWritableWithoutResponse: boolean;
	isNotifiable: boolean;
	isIndicatable: boolean;
}

export interface ServiceInfo {
	uuid: string;
	characteristics: CharacteristicInfo[];
}
