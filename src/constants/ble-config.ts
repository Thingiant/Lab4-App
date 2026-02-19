import { UUID } from '@/types/ble-types';

// ============================================================================
// Service and Characteristic UUIDs
// ============================================================================

export const BLE_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e" as UUID;
export const BLE_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e" as UUID;
export const BLE_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e" as UUID;
export const BLE_MTU = 247;


// ============================================================================
// Timeouts
// ============================================================================

export const SCAN_TIMEOUT_MS = 30000;
export const CONNECTION_TIMEOUT_MS = 10000;
export const ADAPTER_READY_TIMEOUT_MS = 5000;
export const WRITE_TIMEOUT_MS = 5000;
export const RSSI_UPDATE_INTERVAL = 2000;