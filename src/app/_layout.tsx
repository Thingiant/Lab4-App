import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/hooks/use-theme';

export default function RootLayout(): React.ReactElement {
	const { theme, rt } = useUnistyles();
	const { storedTheme } = useTheme();

	const navigationTheme = {
		...(rt.themeName === 'dark' ? DarkTheme : DefaultTheme),
		colors: {
			...(rt.themeName === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
			primary: theme.colors.interactivePrimary,
			background: theme.colors.backgroundScreen,
			text: theme.colors.typography,
			border: theme.colors.borderNeutral,
		},
	};

	return (
		<GestureHandlerRootView style={styles.container}>
			<KeyboardProvider>
				<Stack
					screenOptions={{
						headerShown: false,
					}}>
					<Stack.Screen name="(drawer)" />
					<Stack.Screen name="+not-found" />
				</Stack>
				{/* <StatusBar style="auto" backgroundColor={theme.colors.backgroundScreen} /> */}
				<StatusBar style={storedTheme === 'system' ? 'auto' : storedTheme === 'dark' ? 'light' : 'dark'} />
			</KeyboardProvider>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundScreen,
	},
}));
