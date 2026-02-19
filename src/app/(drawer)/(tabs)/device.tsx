import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';

import { useAtomValue } from 'jotai';

import { NotConnected } from '@/components/common/NotConnected';
import { CharacteristicItem, ServiceItem, StatCard } from '@/components/device';
import { RssiIndicator } from '@/components/scanner';
import { Card } from '@/components/ui/Card';
import { Center } from '@/components/ui/Center';
import { HStack } from '@/components/ui/HStack';
import { VStack } from '@/components/ui/VStack';
import { useBleDevice } from '@/hooks/ble';
import { discoveredServicesAtom, isConnectedAtom } from '@/store/ble-atoms';
import type { ServiceInfo } from '@/types/ble-types';

type ExpandedSections = Record<string, boolean>;

export default function DeviceScreen(): React.ReactElement {
	const isConnected = useAtomValue(isConnectedAtom);

	if (!isConnected) {
		return <NotConnected />;
	}
	return <DeviceContent />;
}

function DeviceContent(): React.ReactElement {
	const { device, rssi } = useBleDevice();
	const services = useAtomValue(discoveredServicesAtom);
	const [expandedServices, setExpandedServices] = useState<ExpandedSections>({});

	const toggleService = useCallback((uuid: string) => {
		setExpandedServices((prev) => ({
			...prev,
			[uuid]: !prev[uuid],
		}));
	}, []);

	if (!device) {
		return <NotConnected />;
	}

	const displayName = device.name || device.localName || 'Unknown Device';
	const mtu = device.mtu ?? 0;
	const totalCharacteristics = services.reduce((acc, s) => acc + s.characteristics.length, 0);

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			{/* Device Header */}
			<Card style={styles.headerCard}>
				<HStack style={styles.deviceHeader}>
					<Center style={styles.deviceIconContainer}>
						<Ionicons name="bluetooth" size={32} color={styles.deviceIcon.color} />
					</Center>
					<VStack style={styles.deviceInfo}>
						<Text style={styles.deviceName}>{displayName}</Text>
						<Text style={styles.deviceId}>{device.id.toString()}</Text>
					</VStack>
					<HStack style={styles.connectionBadge}>
						<View style={styles.connectionDot} />
						<Text style={styles.connectionText}>Connected</Text>
					</HStack>
				</HStack>
			</Card>

			{/* Device Stats */}
			<HStack style={styles.statsGrid}>
				<StatCard customIcon={<RssiIndicator rssi={rssi} size="large" />} value={`${rssi ?? '--'} dBm`} label="Signal" />
				<StatCard icon="swap-horizontal" value={mtu} label="MTU" />
				<StatCard icon="layers-outline" value={services.length} label="Services" />
				<StatCard icon="git-branch-outline" value={totalCharacteristics} label="Characteristics" />
			</HStack>

			{/* Services List */}
			<Text style={styles.sectionTitle}>Services & Characteristics</Text>
			<Card style={styles.servicesCard}>
				{services.length === 0 ? (
					<Text style={styles.noServices}>No services discovered</Text>
				) : (
					services.map((service) => (
						<ServiceItem
							key={service.uuid}
							service={service}
							isExpanded={expandedServices[service.uuid] ?? false}
							onToggle={() => toggleService(service.uuid)}
						/>
					))
				)}
			</Card>
		</ScrollView>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundScreen,
	},
	content: {
		padding: theme.spacing.medium,
		paddingBottom: theme.spacing.xxlarge,
	},
	headerCard: {
		padding: theme.spacing.medium,
	},
	deviceHeader: {
		alignItems: 'center',
	},
	deviceIconContainer: {
		width: 56,
		height: 56,
		borderRadius: theme.borderRadius.large,
		backgroundColor: theme.colors.backgroundNeutral,
		marginRight: theme.spacing.medium,
	},
	deviceIcon: {
		color: theme.colors.interactivePrimary,
	},
	deviceInfo: {
		flex: 1,
	},
	deviceName: {
		...theme.textVariants.heading3,
		color: theme.colors.contentPrimary,
		fontWeight: '600',
	},
	deviceId: {
		...theme.textVariants.body3,
		color: theme.colors.contentTertiary,
		fontFamily: 'monospace',
		marginTop: 2,
	},
	connectionBadge: {
		alignItems: 'center',
		backgroundColor: theme.colors.sentimentSecondaryPositive,
		paddingHorizontal: theme.spacing.small,
		paddingVertical: theme.spacing.xsmall,
		borderRadius: theme.borderRadius.full,
	},
	connectionDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: theme.colors.sentimentPositive,
		marginRight: theme.spacing.xsmall,
	},
	connectionText: {
		...theme.textVariants.body3,
		color: theme.colors.sentimentPositive,
		fontWeight: '600',
	},
	statsGrid: {
		flexWrap: 'wrap',
		justifyContent: 'center',
		marginTop: theme.spacing.medium,
		marginHorizontal: -theme.spacing.xsmall,
	},
	sectionTitle: {
		...theme.textVariants.body2,
		fontWeight: '600',
		color: theme.colors.contentSecondary,
		marginTop: theme.spacing.large,
		marginBottom: theme.spacing.small,
		marginLeft: theme.spacing.xsmall,
	},
	servicesCard: {
		padding: theme.spacing.small,
	},
	noServices: {
		...theme.textVariants.body2,
		color: theme.colors.contentTertiary,
		textAlign: 'center',
		padding: theme.spacing.large,
	},
}));
