import { colors } from './colors';
import { fontSizes, textVariants } from './fonts';
import { borderRadius } from './radius';
import { spacing } from './spacing';

const baseTheme = {
	borderRadius: borderRadius,
	fontSizes: fontSizes,
	spacing: spacing,
	textVariants: textVariants,
	colors: {
		transparent: 'transparent',
		white: colors.stone10,
		black: colors.stone900,
		purple: colors.purple600,
		maroon: colors.maroon600,
		steel: colors.steel600,
		forest: colors.forest600,
		sunshine: colors.sunshine200,
		red: colors.negative500,
		green: colors.positive500,
		blue: colors.blue700,
		azureRadiance: '#007AFF',
		limedSpruce: '#38434D',
		cornflowerBlue: '#6366F1',
		astral: '#2E78B7',
	},
} as const;

export const lightTheme = {
	...baseTheme,
	colors: {
		...baseTheme.colors,

		background: colors.stone10,
		typography: colors.stone990,

		informativePrimary: colors.blue700,

		sentimentNegative: colors.negative400,
		sentimentNegativePress: colors.negative500,

		sentimentSecondaryNegative: colors.negative50,
		sentimentSecondaryNegativePress: colors.negative100,

		sentimentPositive: colors.positive400,
		sentimentPositivePress: colors.positive500,

		sentimentSecondaryPositive: colors.positive50,
		sentimentSecondaryPositivePress: colors.positive100,

		interactivePrimary: colors.sage300,
		interactivePrimaryPress: colors.sage400,
		interactivePrimaryContent: colors.sage900,
		interactivePrimaryContentPress: colors.sage950,

		interactiveSecondary: colors.brightTeal100,
		interactiveSecondaryPress: colors.brightTeal200,
		interactiveSecondaryContent: colors.darkTeal800,
		interactiveSecondaryContentPress: colors.darkTeal900,

		interactiveNeutral: colors.slate100,
		interactiveNeutralPress: colors.slate200,
		interactiveNeutralContent: colors.slate900,
		interactiveNeutralContentPress: colors.slate990,

		interactiveNeutralSecondary: colors.slate10,
		interactiveNeutralSecondaryPress: colors.slate200,

		interactiveNeutralReversed: colors.slate990,
		interactiveNeutralReversedPress: colors.slate900,
		interactiveNeutralReversedContent: colors.slate50,
		interactiveNeutralReversedContentPress: colors.slate10,

		backgroundScreen: colors.slate100,
		backgroundScreenSecondary: colors.slate10,
		backgroundElevated: colors.slate10,
		backgroundNeutral: `${colors.slate950}15`,
		backgroundOverlay: `${colors.slate950}80`,

		baseLight: colors.slate10,
		baseDark: colors.slate990,

		borderNeutral: `${colors.slate950}10`,
		borderNeutralSecondary: `${colors.slate950}30`,

		contentPrimary: colors.slate990,
		contentSecondary: colors.slate900,
		contentTertiary: colors.slate700,
		contentAccent: colors.darkTeal800,
		contentAccentSecondary: colors.darkTeal500,
	},
} as const;

export const darkTheme = {
	...baseTheme,
	colors: {
		...baseTheme.colors,

		background: colors.slate990,
		typography: colors.slate10,

		informativePrimary: colors.blue300,

		sentimentNegative: colors.negative200,
		sentimentNegativePress: colors.negative100,

		sentimentSecondaryNegative: colors.negative950,
		sentimentSecondaryNegativePress: colors.negative900,

		sentimentPositive: colors.positive200,
		sentimentPositivePress: colors.positive500,

		sentimentSecondaryPositive: colors.positive950,
		sentimentSecondaryPositivePress: colors.positive900,

		interactivePrimary: colors.sage400,
		interactivePrimaryPress: colors.sage300,
		interactivePrimaryContent: colors.sage900,
		interactivePrimaryContentPress: colors.sage800,

		interactiveSecondary: colors.darkTeal800,
		interactiveSecondaryPress: colors.darkTeal600,
		interactiveSecondaryContent: colors.brightTeal300,
		interactiveSecondaryContentPress: colors.brightTeal100,

		interactiveNeutral: colors.slate900,
		interactiveNeutralPress: colors.slate800,
		interactiveNeutralContent: colors.slate100,
		interactiveNeutralContentPress: colors.slate50,

		interactiveNeutralSecondary: colors.slate950,
		interactiveNeutralSecondaryPress: colors.slate900,

		interactiveNeutralReversed: colors.slate10,
		interactiveNeutralReversedPress: colors.slate100,
		interactiveNeutralReversedContent: colors.slate900,
		interactiveNeutralReversedContentPress: colors.slate990,

		backgroundScreen: colors.slate990,
		backgroundScreenSecondary: colors.slate950,
		backgroundElevated: `${colors.slate950}`,
		backgroundNeutral: `${colors.slate200}15`,
		backgroundOverlay: `${colors.slate100}80`,

		borderNeutral: `${colors.slate10}10`,
		borderNeutralSecondary: `${colors.slate10}30`,

		baseLight: colors.slate10,
		baseDark: colors.slate990,

		contentPrimary: colors.slate10,
		contentSecondary: colors.slate100,
		contentTertiary: colors.slate300,
		contentAccent: colors.brightTeal200,
		contentAccentSecondary: colors.brightTeal400,
	},
} as const;

export type Theme = typeof lightTheme | typeof darkTheme;
