import React from 'react';
import { Easing } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';

import { MotiView, AnimatePresence } from 'moti';

import { ButtonRound } from '@/components/ui/ButtonRound';
import { Center } from '@/components/ui/Center';

type Props = {
	isScanning: boolean;
	onPress: () => void;
};

export const ScanButton = ({ isScanning, onPress }: Props): React.ReactElement => {
	const { theme } = useUnistyles();

	return (
		<Center style={styles.container}>
			<AnimatePresence>
				{isScanning && (
					<MotiView
						key="scan-ring"
						from={{ opacity: 0.5, scale: 1 }}
						animate={{ opacity: 0, scale: 1.5 }}
						exit={{ opacity: 0, scale: 0.5 }}
						transition={{
							type: 'timing',
							duration: 2000,
							loop: true,
							repeatReverse: false,
							easing: Easing.out(Easing.ease),
						}}
						style={[
							StyleSheet.absoluteFillObject,
							{
								backgroundColor: theme.colors.interactiveSecondary,
								borderRadius: theme.borderRadius.full,
							},
						]}
					/>
				)}
			</AnimatePresence>
			<MotiView
				animate={{
					scale: isScanning ? 1.1 : 1,
				}}
				transition={{
					type: 'timing',
					duration: 1000,
					loop: isScanning,
					repeatReverse: true,
					easing: Easing.inOut(Easing.ease),
				}}>
				<ButtonRound
					onPress={onPress}
					variant={isScanning ? 'secondary' : 'primary'}
					size="medium"
					animationConfig={{
						scaleIn: 1.1,
						durationIn: 150,
						durationOut: 150,
						easing: Easing.out(Easing.linear),
					}}
					renderContent={({ iconSize, iconColor }) => (
						<AnimatePresence exitBeforeEnter>
							<MotiView
								key={isScanning ? 'stop' : 'search'}
								from={{ opacity: 0, scale: 0.5 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.5 }}
								transition={{
									type: 'timing',
									duration: 150,
								}}>
								<Ionicons name={isScanning ? 'stop' : 'search'} size={iconSize} color={iconColor} />
							</MotiView>
						</AnimatePresence>
					)}
				/>
			</MotiView>
		</Center>
	);
};

const styles = StyleSheet.create((theme) => ({
	container: {
		marginRight: theme.spacing.medium,
	},
}));
