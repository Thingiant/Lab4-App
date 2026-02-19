import React, { useState } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';

import { MotiView } from 'moti';

import { Center } from '@/components/ui/Center';
import { HStack } from '@/components/ui/HStack';
import { PressableScale } from '@/components/ui/PressableScale';
import { VStack } from '@/components/ui/VStack';
import { DeviceInfo, ConnectionStatus } from '@/types/ble-types';

import { RssiIndicator } from './RssiIndicator';

type Props = {
	device: DeviceInfo;
	connectionStatus?: ConnectionStatus;
	onPress: () => void;
	disabled?: boolean;
};

export const DeviceCard = ({ device, connectionStatus, onPress, disabled = false }: Props): React.ReactElement => {
	const { theme } = useUnistyles();
	const displayName = device.name || device.localName || 'Unknown Device';
	const isUnknown = !device.name && !device.localName;
	const [isPressed, setIsPressed] = useState(false);
	const rssi = device.rssi;
	const isConnecting = connectionStatus === ConnectionStatus.Connecting;
	const isDisabled = disabled || isConnecting;

	return (
		<MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }}>
			<PressableScale
				disabled={isDisabled}
				onPress={onPress}
				onPressIn={() => setIsPressed(true)}
				onPressOut={() => setIsPressed(false)}
				animationConfig={{ scaleIn: 0.98 }}
				style={styles.pressable}>
				<HStack
					style={[
						styles.container,
						isPressed && styles.containerPressed,
						connectionStatus === ConnectionStatus.Connected && styles.containerConnected,
						connectionStatus === ConnectionStatus.Connecting && styles.containerConnecting,
					]}>
					<HStack style={styles.leftSection}>
						<Center style={styles.iconContainer}>
							{connectionStatus === ConnectionStatus.Connecting ? (
								<ActivityIndicator size="small" color={theme.colors.informativePrimary} />
							) : connectionStatus === ConnectionStatus.Connected ? (
								<Ionicons name="checkmark-circle" size={24} color={theme.colors.informativePrimary} />
							) : (
								<Ionicons name={device.isConnectable ? 'bluetooth' : 'bluetooth-outline'} size={24} color={styles.icon.color} />
							)}
						</Center>
						<VStack style={styles.infoSection}>
							<Text style={[styles.deviceName, isUnknown && styles.deviceNameUnknown]} numberOfLines={1}>
								{displayName}
							</Text>
						</VStack>
					</HStack>
					<HStack style={styles.rightSection}>
						<VStack style={styles.rssiContainer}>
							<RssiIndicator rssi={rssi} />
							{rssi !== null && <Text style={styles.rssiText}>{rssi} dBm</Text>}
						</VStack>
					</HStack>
				</HStack>
			</PressableScale>
		</MotiView>
	);
};

const styles = StyleSheet.create((theme) => ({
	pressable: {
		marginHorizontal: theme.spacing.medium,
		marginVertical: theme.spacing.xsmall,
	},
	container: {
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: theme.colors.backgroundScreenSecondary,
		borderRadius: theme.borderRadius.large,
		padding: theme.spacing.medium,
		borderWidth: 2,
		borderColor: 'transparent',
	},
	containerPressed: {
		opacity: 0.8,
	},
	containerConnected: {
		borderWidth: 1,
		borderColor: theme.colors.contentPrimary,
		backgroundColor: theme.colors.backgroundScreenSecondary,
	},
	containerConnecting: {
		// borderWidth: 1,
		// borderColor: theme.colors.contentPrimary,
	},
	leftSection: {
		flex: 1,
		alignItems: 'center',
	},
	iconContainer: {
		width: 44,
		height: 44,
		borderRadius: theme.borderRadius.medium,
		backgroundColor: theme.colors.backgroundNeutral,
		marginRight: theme.spacing.small,
	},
	icon: {
		color: theme.colors.interactivePrimary,
	},
	infoSection: {
		flex: 1,
		marginLeft: theme.spacing.large
	},
	deviceName: {
		...theme.textVariants.heading2,
		fontWeight: '600',
		color: theme.colors.contentPrimary,
		marginBottom: 2,
	},
	deviceNameUnknown: {
		fontStyle: 'italic',
		color: theme.colors.contentTertiary,
	},
	deviceId: {
		...theme.textVariants.body3,
		color: theme.colors.contentTertiary,
		fontFamily: 'monospace',
	},
	rightSection: {
		alignItems: 'center',
		marginLeft: theme.spacing.small,
	},
	rssiContainer: {
		alignItems: 'flex-end',
		marginLeft: theme.spacing.small,
	},
	rssiText: {
		...theme.textVariants.body3,
		color: theme.colors.contentTertiary,
		marginTop: 2,
	},
}));
