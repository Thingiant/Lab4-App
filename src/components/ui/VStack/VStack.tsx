import { forwardRef } from 'react';
import { View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type Props = {
	/**
	 * Custom gap value in pixels.
	 * If provided, it overrides the `space` prop.
	 */
	gap?: number;
	/**
	 * Spacing variant from theme.
	 */
	space?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
} & ViewProps;

export const VStack = forwardRef<View, Props>(({ children, gap, space, style, ...viewProps }, ref) => {
	return (
		<View ref={ref} style={[styles.container({ space }), style, gap !== undefined && { gap }]} {...viewProps}>
			{children}
		</View>
	);
});

VStack.displayName = 'VStack';

const styles = StyleSheet.create((theme) => ({
	container: ({ space }: { space?: Props['space'] }) => ({
		flexDirection: 'column',
		gap: space ? theme.spacing[space] : undefined,
	}),
}));
