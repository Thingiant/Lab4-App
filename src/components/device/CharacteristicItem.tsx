import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { HStack } from '@/components/ui/HStack';
import type { CharacteristicInfo } from '@/types/ble-types';

type Props = {
	char: CharacteristicInfo;
};

export const CharacteristicItem = ({ char }: Props): React.ReactElement => {
	const properties: string[] = [];
	if (char.isReadable) properties.push('Read');
	if (char.isWritableWithResponse) properties.push('Write');
	if (char.isWritableWithoutResponse) properties.push('WriteNoResp');
	if (char.isNotifiable) properties.push('Notify');
	if (char.isIndicatable) properties.push('Indicate');

	return (
		<View style={styles.container}>
			<HStack style={styles.header}>
				<Text style={styles.uuid} numberOfLines={1}>
					{char.uuid}
				</Text>
			</HStack>
			<HStack style={styles.properties}>
				{properties.map((prop) => (
					<View key={prop} style={styles.propertyBadge}>
						<Text style={styles.propertyText}>{prop}</Text>
					</View>
				))}
			</HStack>
		</View>
	);
};

const styles = StyleSheet.create((theme) => ({
	container: {
		paddingVertical: theme.spacing.xsmall,
		borderLeftWidth: 2,
		borderLeftColor: theme.colors.borderNeutralSecondary,
		paddingLeft: theme.spacing.small,
		marginBottom: theme.spacing.xsmall,
	},
	header: {
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	uuid: {
		...theme.textVariants.body3,
		color: theme.colors.contentSecondary,
		fontFamily: 'monospace',
		flex: 1,
	},
	properties: {
		flexWrap: 'wrap',
		marginTop: 4,
		gap: 4,
	},
	propertyBadge: {
		backgroundColor: theme.colors.interactiveSecondary,
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: theme.borderRadius.small,
	},
	propertyText: {
		...theme.textVariants.body3,
		color: theme.colors.interactiveSecondaryContent,
		fontSize: 10,
		fontWeight: '500',
	},
}));
