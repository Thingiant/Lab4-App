import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

import { HStack } from '@/components/ui/HStack';
import { CharacteristicItem } from './CharacteristicItem';
import type { ServiceInfo } from '@/types/ble-types';

type Props = {
	service: ServiceInfo;
	isExpanded: boolean;
	onToggle: () => void;
};

export const ServiceItem = ({ service, isExpanded, onToggle }: Props): React.ReactElement => {
	return (
		<View style={styles.container}>
			<Pressable style={styles.header} onPress={onToggle}>
				<HStack style={styles.headerLeft}>
					<Ionicons name={isExpanded ? 'chevron-down' : 'chevron-forward'} size={18} color={styles.chevron.color} />
					<Text style={styles.uuid} numberOfLines={1}>
						{service.uuid}
					</Text>
				</HStack>
				<View style={styles.badge}>
					<Text style={styles.badgeText}>{service.characteristics.length}</Text>
				</View>
			</Pressable>
			{isExpanded && (
				<MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 200 }}>
					<View style={styles.characteristics}>
						{service.characteristics.map((char) => (
							<CharacteristicItem key={char.uuid} char={char} />
						))}
					</View>
				</MotiView>
			)}
		</View>
	);
};

const styles = StyleSheet.create((theme) => ({
	container: {
		borderBottomColor: theme.colors.borderNeutral,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.spacing.small,
	},
	headerLeft: {
		alignItems: 'center',
		flex: 1,
	},
	chevron: {
		color: theme.colors.contentTertiary,
	},
	uuid: {
		...theme.textVariants.body3,
		fontSize: 11,
		color: theme.colors.contentPrimary,
		fontFamily: 'monospace',
		marginLeft: theme.spacing.xsmall,
		flex: 1,
	},
	badge: {
		backgroundColor: theme.colors.backgroundNeutral,
		paddingHorizontal: theme.spacing.small,
		paddingVertical: 2,
		borderRadius: theme.borderRadius.full,
	},
	badgeText: {
		...theme.textVariants.body3,
		color: theme.colors.contentSecondary,
		fontWeight: '600',
	},
	characteristics: {
		paddingLeft: theme.spacing.large,
		paddingBottom: theme.spacing.small,
	},
}));
