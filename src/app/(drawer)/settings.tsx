import React from 'react';
import { Text, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import Constants from 'expo-constants';

import { ThemeSelector } from '@/components/settings/ThemeSelector';
import { Card } from '@/components/ui/Card';
import { HStack } from '@/components/ui/HStack';

export default function SettingsScreen(): React.ReactElement {
	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			{/* Theme */}
			<Text style={styles.sectionTitle}>Theme</Text>
			<ThemeSelector />

			{/* About */}
			<Text style={styles.sectionTitle}>About</Text>
			<Card style={styles.card}>
				<HStack style={styles.aboutRow}>
					<Text style={styles.aboutLabel}>Version</Text>
					<Text style={styles.aboutValue}>{Constants.expoConfig?.version ?? '0.0.0'}</Text>
				</HStack>
			</Card>
		</ScrollView>
	);
}

const styles = StyleSheet.create((theme) => ({
	sectionTitle: {
		...theme.textVariants.body2,
		fontWeight: '600',
		color: theme.colors.contentSecondary,
		marginTop: theme.spacing.large,
		marginBottom: theme.spacing.small,
		marginLeft: theme.spacing.xsmall,
	},
	card: {
		padding: theme.spacing.medium,
	},
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundScreen,
	},
	content: {
		paddingHorizontal: theme.spacing.medium,
	},
	aboutRow: {
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: theme.spacing.small,
	},
	aboutLabel: {
		...theme.textVariants.body2,
		color: theme.colors.contentPrimary,
	},
	aboutValue: {
		...theme.textVariants.body2,
		color: theme.colors.contentTertiary,
	},
}));
