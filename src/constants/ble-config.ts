import { UUID } from '@/types/ble-types';

// ============================================================================
// Service and Characteristic UUIDs
// ============================================================================

export const BLE_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E" as UUID;
export const BLE_RX_CHARACTERISTIC_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E" as UUID;
export const BLE_TX_CHARACTERISTIC_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E" as UUID;
export const BLE_MTU = 517;


// ============================================================================
// Timeouts
// ============================================================================

export const SCAN_TIMEOUT_MS = 30000;
export const CONNECTION_TIMEOUT_MS = 10000;
export const ADAPTER_READY_TIMEOUT_MS = 5000;
export const WRITE_TIMEOUT_MS = 5000;
export const RSSI_UPDATE_INTERVAL = 2000;