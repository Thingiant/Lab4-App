# React Native/Expo Project

## Code Style and Structure

- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Ensure components are modular, reusable, and maintainable

## Project Structure

```text
src/
  ├── app/              ## expo router screens (file-based routing)
  ├── components/
  │   └── ui/           ## custom/extended ui components
  ├── constants/        ## shared const vars
  ├── services/         ## API clients, business logic
  ├── hooks/            ## react hooks
  ├── store/            ## jotai atoms for state management
  ├── theme/            ## unistyles theme configuration
  └── types/            ## shared TypeScript types
assets/
  └── images/           ## image assets (icons, splash, etc.)
```

## Tools

- Use `bun` instead of `npm`
- Use `bun expo install <package-name>` for installing expo-compatible packages
- Use `bun tsc` for type checking

## Tech Stack

### Core

- Expo SDK 54
- React 19.1 / React Native 0.81 (New Architecture enabled, React Compiler enabled)
- TypeScript 5.9
- Expo Router v6 (file-based routing with typed routes)

### Styling

- react-native-unistyles (theming and styling)
- Light/Dark theme support with adaptive themes

### UI Components

- @expo/vector-icons (Ionicons)
- Use ui components in components/ui:
  - Avatar
  - Badge
  - BottomSheet
  - Button
  - ButtonRound
  - Card
  - Center
  - Checkbox
  - ContextMenu
  - Counter
  - Divider
  - HStack
  - InputOTP
  - InputSearch
  - InputText
  - ListItem
  - PasscodeEntry
  - PhotoCarousel
  - PressableScale
  - Radio
  - Slider
  - SliderDual
  - Switch
  - Text
  - VStack

### Animations & Gestures

- react-native-reanimated v4
- react-native-gesture-handler v2

### Navigation

- expo-router v6
- Drawer navigation (root level)
- Tab navigation (nested)
- @react-navigation/drawer
- @react-navigation/bottom-tabs

### Storage & Data

- react-native-mmkv (persistent storage)
- jotai (state management)

### Media

- expo-image
- expo-video

### Keyboard

- react-native-keyboard-controller (keyboard handling)

## Naming Conventions

- Favor named exports for components and utilities
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError)
- Use PascalCase for component files (e.g., `Button.tsx`, `Avatar.tsx`)
- Use kebab-case for all other files (e.g., `user-profile.tsx`)

## TypeScript Usage

- Prefer function syntax `function getItem() {}` over `const getItem = () => {}`
- Avoid enums; use const objects with 'as const' assertion
- Use functional components with TypeScript types
- Use `@/` for importing internal files

## UI and Styling with Unistyles

- Use `StyleSheet.create` from `react-native-unistyles` for all styles
- Access theme values via the style function parameter: `StyleSheet.create((theme) => ({ ... }))`
- Use `paddingBottom: rt.insets.bottom` for safearea
- Use theme tokens: `theme.colors`, `theme.spacing`, `theme.borderRadius`, `theme.textVariants`, `theme.fontSizes`
- Use `useUnistyles()` hook to access theme in components when needed but prefer to do all styling in StyleSheet

## State Management

- Use jotai for global/shared state management
- Keep atoms small and focused on a single piece of state
- Derive computed state using derived atoms
- Implement proper cleanup in useEffect hooks
- Use atomWithMMKV for persisted state when needed

## Error Handling

- Use neverthrow Result types for operations that can fail (API calls, parsing, etc.)
- Prefer Result pattern over try/catch for explicit error handling
- Log errors appropriately for debugging (use console.error())
- Provide user-friendly error messages (use Alert)
- Use ErrorBoundary components for UI error recovery

## Environment Variables

- Use `EXPO_PUBLIC_*` prefix for client-side environment variables

## Performance Best Practices

React Compiler is enabled and automatically handles memoization. You generally **don't need** manual `useMemo`, `useCallback`, or `React.memo` for preventing re-renders, but you may still use `useCallback` for passing stable references to child components or dependencies.
