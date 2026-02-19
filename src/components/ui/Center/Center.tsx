import React, { forwardRef } from 'react';
import { View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export const Center = forwardRef<View, ViewProps>(({ children, style, ...viewProps }, ref) => {
	return (
		<View ref={ref} style={[styles.container, style]} {...viewProps}>
			{children}
		</View>
	);
});

Center.displayName = 'Center';

const styles = StyleSheet.create((theme) => ({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
}));
