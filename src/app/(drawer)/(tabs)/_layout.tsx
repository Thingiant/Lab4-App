import React, { useCallback } from 'react';
import { Pressable, Alert } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Tabs, useRouter } from 'expo-router';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { Ble } from '@/services/ble-service';
import {
  clearChatMessagesAtom,
  clearTxNotificationHistoryAtom,
  isConnectedAtom,
  connectedDeviceAtom,
} from '@/store/ble-atoms';

function DrawerToggle(): React.ReactElement {
  const navigation = useNavigation();
  const { theme } = useUnistyles();
  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginLeft: 16 }}>
      <Ionicons name="menu" size={24} color={theme.colors.contentPrimary} />
    </Pressable>
  );
}

function DisconnectButton({ onPress }: { onPress: () => void }): React.ReactElement {
  const { theme } = useUnistyles();
  return (
    <Pressable
      onPress={onPress}
      style={styles.disconnectButton}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Ionicons name="power" size={22} color={theme.colors.sentimentNegative} />
    </Pressable>
  );
}

export default function TabsLayout(): React.ReactElement {
  const { theme } = useUnistyles();
  const router = useRouter();
  const isConnected = useAtomValue(isConnectedAtom);
  const [connectedDevice, setConnectedDevice] = useAtom(connectedDeviceAtom);
  const clearChatMessages = useSetAtom(clearChatMessagesAtom);
  const clearNotificationHistory = useSetAtom(clearTxNotificationHistoryAtom);

  const handleClearMessages = useCallback(() => {
    clearChatMessages();
    clearNotificationHistory();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [clearChatMessages, clearNotificationHistory]);

  async function handleDisconnect() {
      if (!connectedDevice)
      {
        Alert.alert('Error', 'No device connected');
        return;
      }

      const result = await Ble.disconnect(connectedDevice?.id);
      if (result.isErr()) {
        Alert.alert('Error', 'Failed to disconnect from device');
      }

      setConnectedDevice(null);
      router.push('/');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundScreen,
          borderTopColor: theme.colors.borderNeutral,
        },
        tabBarActiveTintColor: theme.colors.interactivePrimary,
        tabBarInactiveTintColor: theme.colors.contentTertiary,
        headerStyle: {
          backgroundColor: theme.colors.backgroundScreen,
        },
        headerTintColor: theme.colors.contentPrimary,
        headerLeft: () => <DrawerToggle />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color, size }) => <Ionicons name="wifi" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          title: 'Device',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={isConnected ? 'bluetooth-outline' : 'bluetooth'}
              size={size}
              color={color}
            />
          ),
          tabBarBadge: isConnected ? undefined : undefined,
          tabBarStyle: {
            backgroundColor: theme.colors.backgroundScreen,
            borderTopColor: theme.colors.borderNeutral,
            opacity: 1,
          },
          headerRight: isConnected
            ? () => <DisconnectButton onPress={handleDisconnect} />
            : undefined,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
          tabBarStyle: {
            backgroundColor: theme.colors.backgroundScreen,
            borderTopColor: theme.colors.borderNeutral,
            opacity: 1,
          },
          headerRight: isConnected
            ? () => (
                <Pressable
                  onPress={handleClearMessages}
                  hitSlop={10}
                  style={{ marginRight: 16 }}>
                  <Ionicons name="trash-outline" size={22} color={theme.colors.contentPrimary} />
                </Pressable>
              )
            : undefined,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create((theme) => ({
  disconnectButton: {
    marginRight: theme.spacing.medium,
    padding: theme.spacing.xsmall,
  },
}));
