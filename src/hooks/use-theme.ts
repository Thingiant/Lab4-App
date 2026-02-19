import { useEffect } from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';

import { useAtom } from 'jotai';

import { themeAtom } from '@/store/theme';

export function useTheme() {
	const [storedTheme, setStoredTheme] = useAtom(themeAtom);

	useEffect(() => {
		if (storedTheme === 'system') {
			UnistylesRuntime.setAdaptiveThemes(true);
		} else {
			UnistylesRuntime.setAdaptiveThemes(false);
			UnistylesRuntime.setTheme(storedTheme);
		}
	}, [storedTheme]);

	function getColorScheme(): 'light' | 'dark' {
		const colorScheme = UnistylesRuntime.themeName as 'light' | 'dark';
		return colorScheme;
	}

	function isDarkMode(): boolean {
		return getColorScheme() === 'dark';
	}

	return { storedTheme, setStoredTheme, getColorScheme, isDarkMode };
}
