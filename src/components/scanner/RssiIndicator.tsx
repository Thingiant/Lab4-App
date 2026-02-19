import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { HStack } from '@/components/ui/HStack';

type Props = {
	rssi: number | null;
	size?: 'small' | 'medium' | 'large';
};

const getSignalStrength = (rssi: number | null): number => {
	if (rssi === null) return 0;
	if (rssi >= -50) return 4;
	if (rssi >= -60) return 3;
	if (rssi >= -70) return 2;
	if (rssi >= -80) return 1;
	return 1;
};

export const RssiIndicator = ({ rssi, size = 'medium' }: Props): React.ReactElement => {
	const strength = getSignalStrength(rssi);
	const barHeights = size === 'small' ? [4, 8, 12, 16] : size === 'large' ? [8, 14, 20, 26] : [6, 11, 16, 21];
	const barWidth = size === 'small' ? 3 : size === 'large' ? 5 : 4;
	const gap = size === 'small' ? 2 : size === 'large' ? 4 : 3;

	return (
		<HStack style={styles.container}>
			{barHeights.map((height, index) => (
				<View
					key={index}
					style={[
						styles.bar,
						{
							height,
							width: barWidth,
							marginLeft: index > 0 ? gap : 0,
						},
						index < strength ? styles.barActive : styles.barInactive,
					]}
				/>
			))}
		</HStack>
	);
};

const styles = StyleSheet.create((theme) => ({
	container: {
		alignItems: 'flex-end',
	},
	bar: {
		borderRadius: 2,
	},
	barActive: {
		backgroundColor: theme.colors.sentimentPositive,
	},
	barInactive: {
		backgroundColor: theme.colors.borderNeutralSecondary,
	},
}));
