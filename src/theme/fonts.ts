export const fontSizes = {
	xxlarge: {
		fontSize: 32,
		lineHeight: 32,
	},
	xlarge: {
		fontSize: 24,
		lineHeight: 30,
	},
	large: {
		fontSize: 18,
		lineHeight: 25,
	},
	medium: {
		fontSize: 16,
		lineHeight: 20,
	},
	small: {
		fontSize: 14,
		lineHeight: 18,
	},
	xsmall: {
		fontSize: 12,
		lineHeight: 15,
	},
} as const;

export const textVariants = {
	heading1: {
		...fontSizes.xxlarge,
		fontWeight: '900' as const,
		letterSpacing: -1,
	},
	heading2: {
		...fontSizes.xlarge,
		fontWeight: '800' as const,
	},
	heading3: {
		...fontSizes.large,
		fontWeight: '700' as const,
	},
	body1: {
		...fontSizes.medium,
		fontWeight: '400' as const,
	},
	body2: {
		...fontSizes.small,
		fontWeight: '400' as const,
	},
	body3: {
		...fontSizes.xsmall,
		fontWeight: '400' as const,
	},
} as const;
