import React, { useMemo } from 'react';
import { Text as RNText, View, ViewProps, TextProps } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { colors as palette } from '@/theme/colors';

type BadgeAction = 'error' | 'warning' | 'success' | 'info' | 'muted';
type BadgeVariant = 'solid' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

type BadgeContextType = {
	action: BadgeAction;
	variant: BadgeVariant;
	size: BadgeSize;
	colors: {
		background: string;
		border: string;
		text: string;
	};
};

const BadgeContext = React.createContext<BadgeContextType | undefined>(undefined);

const useBadgeContext = () => {
	const context = React.useContext(BadgeContext);
	if (!context) {
		throw new Error('Badge compound components must be used within a Badge component');
	}
	return context;
};

export type BadgeProps = ViewProps & {
	action?: BadgeAction;
	variant?: BadgeVariant;
	size?: BadgeSize;
	children?: React.ReactNode;
};

export const Badge = ({ children, action = 'info', variant = 'solid', size = 'md', style, ...props }: BadgeProps) => {
	const { theme } = useUnistyles();

	const badgeColors = useMemo(() => {
		const isSolid = variant === 'solid';

		// Helper to get colors based on action
		const getActionColors = () => {
			switch (action) {
				case 'error':
					return {
						solidBg: theme.colors.sentimentSecondaryNegative,
						solidText: theme.colors.sentimentNegative,
						outlineBorder: theme.colors.sentimentNegative,
					};
				case 'success':
					return {
						solidBg: theme.colors.sentimentSecondaryPositive,
						solidText: theme.colors.sentimentPositive,
						outlineBorder: theme.colors.sentimentPositive,
					};
				case 'warning':
					return {
						solidBg: palette.brightOrange100,
						solidText: palette.darkOrange700,
						outlineBorder: palette.darkOrange600,
					};
				case 'info':
					return {
						solidBg: theme.colors.informativePrimary + '20', // 20% opacity
						solidText: theme.colors.typography,
						outlineBorder: theme.colors.informativePrimary,
					};
				case 'muted':
				default:
					return {
						solidBg: theme.colors.backgroundNeutral,
						solidText: theme.colors.typography + '80', // 80% opacity
						outlineBorder: theme.colors.borderNeutral,
					};
			}
		};

		const c = getActionColors();

		if (isSolid) {
			return {
				background: c.solidBg,
				border: 'transparent',
				text: c.solidText,
			};
		} else {
			return {
				background: 'transparent',
				border: c.outlineBorder,
				text: c.solidText, // Text matches border in outline
			};
		}
	}, [action, variant, theme]);

	return (
		<BadgeContext.Provider value={{ action, variant, size, colors: badgeColors }}>
			<View
				style={[
					styles.badge(size),
					{
						backgroundColor: badgeColors.background,
						borderColor: badgeColors.border,
						borderRadius: theme.borderRadius.large,
						borderWidth: variant === 'outline' ? 1 : 0,
					},
					style,
				]}
				{...props}>
				{children}
			</View>
		</BadgeContext.Provider>
	);
};

export type BadgeTextProps = TextProps;

export const BadgeText = ({ style, ...props }: BadgeTextProps) => {
	const { size, colors } = useBadgeContext();
	return <RNText style={[styles.text(size), { color: colors.text }, style]} {...props} />;
};

export type BadgeIconProps = {
	children: React.ReactElement;
} & ViewProps;

export const BadgeIcon = ({ children, ...props }: BadgeIconProps) => {
	const { size, colors } = useBadgeContext();

	// Map size to icon size
	const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

	return React.cloneElement(children as React.ReactElement<any>, {
		color: colors.text,
		size: iconSize,
		...props,
	});
};

const styles = StyleSheet.create((theme) => ({
	badge: (size: BadgeSize) => ({
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.xsmall,
		paddingHorizontal: size === 'sm' ? theme.spacing.xsmall : theme.spacing.small,
		paddingVertical: size === 'sm' ? 2 : 4,
	}),
	text: (size: BadgeSize) => ({
		// Use body1 font family but adjust size/weight
		fontFamily: 'Inter_500Medium',
		fontWeight: '500',
		fontSize: size === 'sm' ? 10 : size === 'md' ? 12 : 14,
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	}),
}));
