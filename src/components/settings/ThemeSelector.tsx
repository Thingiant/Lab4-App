import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Card } from '@/components/ui/Card';
import { HStack } from '@/components/ui/HStack';
import { Radio } from '@/components/ui/Radio';
import { Text } from '@/components/ui/Text';
import { VStack } from '@/components/ui/VStack';
import { useTheme } from '@/hooks/use-theme';

type ThemeValue = 'light' | 'dark' | 'system';

function ThemeRadioOption({ value: theme }: { value: ThemeValue }) {
	const { storedTheme, setStoredTheme } = useTheme();
	const isSelected = storedTheme === theme;

	return (
		<Pressable onPress={() => setStoredTheme(theme)}>
			<View style={[styles.optionContainer, isSelected && styles.optionContainerSelected]}>
				<HStack style={styles.optionContent}>
					<VStack space="xsmall" style={styles.optionTextContainer}>
						<Text style={styles.optionLabel}>{theme}</Text>
					</VStack>
					<View pointerEvents="none" style={styles.radioContainer}>
						<Radio checked={isSelected} />
					</View>
				</HStack>
			</View>
		</Pressable>
	);
}

export function ThemeSelector({ style }: { style?: StyleProp<ViewStyle> }) {
	return (
		<Card style={[styles.card, style]}>
			<VStack space="medium">
				<ThemeRadioOption value="system" />
				<ThemeRadioOption value="light" />
				<ThemeRadioOption value="dark" />
			</VStack>
		</Card>
	);
}

const styles = StyleSheet.create((theme) => ({
	card: {
		padding: theme.spacing.medium,
		borderWidth: 1,
		borderColor: theme.colors.borderNeutral,
	},
	title: {
		fontSize: theme.fontSizes.medium.fontSize,
		fontWeight: '500',
		marginBottom: theme.spacing.medium,
		paddingLeft: theme.spacing.xxsmall,
	},
	optionContainer: {
		borderWidth: 1,
		borderColor: theme.colors.borderNeutralSecondary,
		borderRadius: theme.borderRadius.medium,
		padding: theme.spacing.medium,
		backgroundColor: theme.colors.background,
	},
	optionContainerSelected: {
		borderColor: theme.colors.contentAccentSecondary,
		backgroundColor: theme.colors.background,
	},
	optionContent: {
		alignItems: 'flex-start',
		justifyContent: 'space-between',
	},
	optionTextContainer: {
		flex: 1,
		paddingRight: theme.spacing.medium,
	},
	optionLabel: {
		textTransform: 'capitalize',
	},
	radioContainer: {
		marginTop: theme.spacing.xxsmall,
	},
}));
