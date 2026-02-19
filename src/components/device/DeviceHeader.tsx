import React from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';

import { Center } from '@/components/ui/Center';
import { HStack } from '@/components/ui/HStack';
import { VStack } from '@/components/ui/VStack';
import { DeviceInfo } from '@/types/ble-types';

type Props = {
	device: DeviceInfo;
};

export const DeviceHeader = ({ device }: Props): React.ReactElement => {
	const displayName = device.name || device.localName || 'Unknown Device';
	const isUnknown = !device.name && !device.localName;

	return (
		<HStack	style={[styles.container]}>
			<HStack style={styles.header}>
				<Center style={styles.iconContainer}>					
						<Ionicons name={device.isConnectable ? 'bluetooth' : 'bluetooth-outline'} size={24} color={styles.icon.color} />
				</Center>
				<VStack style={styles.infoSection}>
					<Text style={[styles.deviceName, isUnknown && styles.deviceNameUnknown]} numberOfLines={1}>
						{displayName}
					</Text>
				</VStack>
			</HStack>
		</HStack>
	);
};

const styles = StyleSheet.create((theme) => ({
	container: {
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: theme.colors.backgroundScreenSecondary,
		borderRadius: theme.borderRadius.large,
		padding: theme.spacing.medium,
		borderWidth: 2,
		borderColor: 'transparent',
	},
	header: {
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
}));
