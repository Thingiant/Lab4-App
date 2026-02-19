import React from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/components/ui/Card';
import { VStack } from '@/components/ui/VStack';

type Props = {
	icon?: keyof typeof Ionicons.glyphMap;
	customIcon?: React.ReactNode;
	value: string | number;
	label: string;
};

export const StatCard = ({ icon, customIcon, value, label }: Props): React.ReactElement => {
	return (
		<Card style={styles.statCard}>
			<VStack style={styles.statContent}>
				{customIcon || (icon && <Ionicons name={icon} size={28} color={styles.statIcon.color} />)}
				<Text style={styles.statValue}>{value}</Text>
				<Text style={styles.statLabel}>{label}</Text>
			</VStack>
		</Card>
	);
};

const styles = StyleSheet.create((theme) => ({
	statCard: {
		width: '45%',
		margin: theme.spacing.xsmall,
	},
	statContent: {
		padding: theme.spacing.medium,
		alignItems: 'center',
	},
	statIcon: {
		color: theme.colors.interactivePrimary,
	},
	statValue: {
		...theme.textVariants.heading3,
		color: theme.colors.contentPrimary,
		fontWeight: '700',
		marginTop: theme.spacing.xsmall,
	},
	statLabel: {
		...theme.textVariants.body3,
		color: theme.colors.contentTertiary,
	},
}));
