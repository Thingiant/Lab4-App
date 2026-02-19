import React from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';

import { Center } from '@/components/ui/Center';
import { VStack } from '@/components/ui/VStack';

interface NotConnectedProps {
	title?: string;
	description?: string;
}

export function NotConnected({ title = 'Not Connected', description = 'Connect to a device to continue' }: NotConnectedProps): React.ReactElement {
	return (
		<Center style={styles.container}>
			<Center style={styles.iconContainer}>
				<Ionicons name="bluetooth-outline" size={48} style={styles.icon} />
			</Center>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.description}>{description}</Text>
		</Center>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundScreen,
		padding: theme.spacing.large,
	},
	iconContainer: {
		width: 96,
		height: 96,
		borderRadius: 48,
		backgroundColor: theme.colors.backgroundNeutral,
		marginBottom: theme.spacing.large,
	},
	icon: {
		color: theme.colors.contentTertiary,
	},
	title: {
		...theme.textVariants.heading2,
		color: theme.colors.contentPrimary,
		fontWeight: '600',
		marginBottom: theme.spacing.small,
		textAlign: 'center',
	},
	description: {
		...theme.textVariants.body1,
		color: theme.colors.contentSecondary,
		textAlign: 'center',
	},
}));
