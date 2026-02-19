const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactCompiler = require('eslint-plugin-react-compiler');

module.exports = defineConfig([
	expoConfig,
	reactCompiler.configs.recommended,
	{
		ignores: ['node_modules/**', 'ios/**', 'android/**', '.expo/**', '.vscode/**'],
	},
	{
		rules: {
			// react
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'react-compiler/react-compiler': 'error',
			'react/display-name': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			// react native
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'react-native',
							importNames: ['SafeAreaView'],
							message: "Use the SafeAreaView from 'react-native-safe-area-context' instead.",
						},
					],
				},
			],
			// eslint-import
			'import/order': [
				'warn',
				{
					'alphabetize': {
						order: 'asc',
						caseInsensitive: true,
					},
					'newlines-between': 'always',
					'groups': ['builtin', 'external', 'internal'],
					'pathGroups': [
						// Group 1: React ecosystem (comes first in builtin)
						{ pattern: 'react', group: 'builtin', position: 'before' },
						{ pattern: 'react-dom', group: 'builtin', position: 'before' },
						{ pattern: 'react-native', group: 'builtin', position: 'before' },
						{ pattern: 'react-native-**', group: 'builtin', position: 'before' },
						{ pattern: '@react-*/**', group: 'builtin', position: 'before' },
						{ pattern: 'expo', group: 'builtin' },
						{ pattern: 'expo-**', group: 'builtin' },
						{ pattern: '@expo/**', group: 'builtin' },
						// Group 2: Internal (@/**) - must come BEFORE @expo to avoid conflicts
						{ pattern: '@/**', group: 'internal' },
					],
					'pathGroupsExcludedImportTypes': [],
					'distinctGroup': false,
				},
			],
			'import/newline-after-import': 1,
		},
	},
]);
