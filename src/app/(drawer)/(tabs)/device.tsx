import React, { useCallback, useState } from 'react';
import { Text, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useAtomValue } from 'jotai';

import { DeviceHeader } from '@/components/device/DeviceHeader';
import { NotConnected } from '@/components/common/NotConnected';
import { ServiceItem, StatCard } from '@/components/device';
import { RssiIndicator } from '@/components/scanner';
import { Card } from '@/components/ui/Card';
import { HStack } from '@/components/ui/HStack';
import { useBleDevice } from '@/hooks/ble';
import { discoveredServicesAtom, isConnectedAtom } from '@/store/ble-atoms';
import { useBleConnection } from '@/hooks/ble';

type ExpandedSections = Record<string, boolean>;

export default function DeviceScreen(): React.ReactElement {
	const isConnected = useAtomValue(isConnectedAtom);

	if (!isConnected) {
		return <NotConnected />;
	}
	return <DeviceContent />;
}

function DeviceContent(): React.ReactElement {
	const { device } = useBleDevice();

	if (!device) {
		return <NotConnected />;
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<DeviceHeader device={device}/>
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
}));
