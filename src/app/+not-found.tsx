import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Link, Stack } from 'expo-router';

import { Center } from '@/components/ui/Center';

export default function NotFoundScreen() {
	return (
		<Center style={styles.container}>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<Center>
				<Text style={styles.title}>{"This screen doesn't exist."}</Text>
				<Link href="/" style={styles.link}>
					<Text style={styles.linkText}>Go to home screen!</Text>
				</Link>
			</Center>
		</Center>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundScreen,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: theme.colors.typography,
	},
	link: {
		marginTop: 16,
		paddingVertical: 16,
	},
	linkText: {
		fontSize: 14,
		color: theme.colors.astral,
	},
}));
