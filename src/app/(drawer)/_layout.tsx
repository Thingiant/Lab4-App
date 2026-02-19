import React from 'react';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';

import { Drawer } from 'expo-router/drawer';

import { useBleAdapter } from '@/hooks/ble';

export default function DrawerLayout(): React.ReactElement {
	const { theme } = useUnistyles();
	useBleAdapter(); // useEffect for BLE adapter state listener

	return (
		<Drawer
			screenOptions={{
				headerShown: true,
				drawerType: 'front',
				drawerStyle: styles.drawer,
				drawerLabelStyle: styles.drawerLabel,
				drawerActiveBackgroundColor: styles.drawerActiveItem.backgroundColor,
				drawerActiveTintColor: styles.drawerActiveItem.color,
				drawerInactiveTintColor: styles.drawerInactiveItem.color,
			}}>
			<Drawer.Screen
				name="(tabs)"
				options={{
					headerShown: false,
					drawerLabel: 'Scanner',
					drawerIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="bluetooth" size={size} color={color} />,
				}}
			/>
			<Drawer.Screen
				name="settings"
				options={{
					headerStyle: {
						backgroundColor: theme.colors.background,
					},
					headerTitleStyle: {
						color: theme.colors.contentPrimary,
					},
					headerTintColor: theme.colors.contentPrimary,
					title: 'Settings',
					drawerLabel: 'Settings',
					drawerIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="settings-outline" size={size} color={color} />,
				}}
			/>
		</Drawer>
	);
}

const styles = StyleSheet.create((theme) => ({
	drawer: {
		backgroundColor: theme.colors.backgroundScreen,
		width: 280,
	},
	drawerLabel: {
		fontSize: theme.fontSizes.medium.fontSize,
	},
	drawerActiveItem: {
		backgroundColor: theme.colors.interactivePrimary,
		color: theme.colors.interactiveNeutralReversedContent,
	},
	drawerInactiveItem: {
		color: theme.colors.contentPrimary,
	},
}));
