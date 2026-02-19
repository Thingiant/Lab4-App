import React, { useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, TextInput, Pressable, Alert, FlatList } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';

import { useAtomValue, useSetAtom } from 'jotai';

import { NotConnected } from '@/components/common/NotConnected';
import { HStack } from '@/components/ui/HStack';
import { useBleDevice } from '@/hooks/ble';
import { addChatMessageAtom, chatMessagesAtom, isConnectedAtom } from '@/store/ble-atoms';
import type { ChatMessage } from '@/types/ble-types';

export default function ChatScreen() {
	const isConnected = useAtomValue(isConnectedAtom);

	if (!isConnected) {
		return <NotConnected />;
	}
	return <ChatConnected />;
}

function ChatConnected() {
	const { theme } = useUnistyles();
	const { writeToRx, notificationHistory } = useBleDevice();
	const outgoingMessages = useAtomValue(chatMessagesAtom);
	const addChatMessage = useSetAtom(addChatMessageAtom);
	const [inputText, setInputText] = useState('');
	const listRef = useRef<FlatList<ChatMessage>>(null);

	const allMessages = useMemo(() => {
		const incomingMessages: ChatMessage[] = notificationHistory.map((notification) => ({
			id: notification.id,
			text: notification.decodedData,
			timestamp: notification.receivedAt,
			isOutgoing: false,
		}));

		const combined = [...outgoingMessages, ...incomingMessages];
		return combined.sort((a, b) => a.timestamp - b.timestamp);
	}, [outgoingMessages, notificationHistory]);

	const handleSend = useCallback(async () => {
		if (!inputText.trim()) return;

		const textToSend = inputText.trim();
		setInputText('');

		const outgoingMessage: ChatMessage = {
			id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
			text: textToSend,
			timestamp: Date.now(),
			isOutgoing: true,
		};
		addChatMessage(outgoingMessage);

		const success = await writeToRx(textToSend);
		if (!success) {
			Alert.alert('Send Failed', 'Could not send message to device');
		}
	}, [inputText, writeToRx, addChatMessage]);

	const renderMessage = useCallback(({ item }: { item: ChatMessage }) => {
		return (
			<View style={[styles.messageBubble, item.isOutgoing ? styles.messageOutgoing : styles.messageIncoming]}>
				<Text style={[styles.messageText, item.isOutgoing ? styles.messageTextOutgoing : styles.messageTextIncoming]}>{item.text}</Text>
			</View>
		);
	}, []);

	const isSendDisabled = inputText.trim().length === 0;

	return (
		<KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={100}>
			{/* Messages List */}
			<FlatList
				ref={listRef}
				data={allMessages}
				renderItem={renderMessage}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
			/>

			{/* Input Area */}
			<View style={styles.inputContainer}>
				<HStack style={styles.composer}>
					<TextInput
						style={styles.input}
						value={inputText}
						onChangeText={setInputText}
						placeholder="Message"
						placeholderTextColor={theme.colors.contentTertiary}
						returnKeyType="send"
						blurOnSubmit={false}
						onSubmitEditing={handleSend}
						selectionColor={theme.colors.interactivePrimary}
					/>

					<Pressable
						style={({ pressed }) => [
							styles.sendButton,
							isSendDisabled && styles.sendButtonDisabled,
							pressed && !isSendDisabled && styles.sendButtonPressed,
						]}
						onPress={handleSend}
						disabled={isSendDisabled}
						accessibilityRole="button"
						accessibilityLabel="Send message">
						<Ionicons name="send" size={18} color={isSendDisabled ? theme.colors.contentTertiary : theme.colors.baseLight} />
					</Pressable>
				</HStack>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundScreen,
	},
	listContent: {
		padding: theme.spacing.small,
		flexGrow: 1,
	},
	messageBubble: {
		maxWidth: '80%',
		padding: theme.spacing.medium,
		borderRadius: theme.borderRadius.large,
		marginBottom: theme.spacing.small,
	},
	messageIncoming: {
		alignSelf: 'flex-start',
		backgroundColor: theme.colors.backgroundElevated,
		borderBottomLeftRadius: 4,
	},
	messageOutgoing: {
		alignSelf: 'flex-end',
		backgroundColor: theme.colors.interactivePrimary,
		borderBottomRightRadius: 4,
	},
	messageText: {
		...theme.textVariants.body1,
	},
	messageTextIncoming: {
		color: theme.colors.contentPrimary,
	},
	messageTextOutgoing: {
		color: theme.colors.baseLight,
	},
	inputContainer: {
		padding: theme.spacing.small,
		paddingBottom: theme.spacing.small,
		backgroundColor: theme.colors.backgroundScreen,
	},
	composer: {
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundElevated,
		borderWidth: 1,
		borderColor: theme.colors.borderNeutral,
		borderRadius: 999,
		paddingLeft: theme.spacing.medium,
		paddingRight: theme.spacing.small,
		minHeight: 48,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 6 },
		elevation: 3,
	},
	input: {
		flex: 1,
		paddingVertical: theme.spacing.small,
		color: theme.colors.contentPrimary,
		...theme.textVariants.body1,
		maxHeight: 100,
	},
	sendButton: {
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: theme.colors.interactivePrimary,
		justifyContent: 'center',
		alignItems: 'center',
	},
	sendButtonDisabled: {
		backgroundColor: theme.colors.backgroundElevated,
	},
	sendButtonPressed: {
		opacity: 0.9,
		transform: [{ scale: 0.98 }],
	},
}));
