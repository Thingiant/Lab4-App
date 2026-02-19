# Lab4 App

> React Native Expo App

## 🛠 Tech Stack

| Category   | Technology                                                                             |
| ---------- | -------------------------------------------------------------------------------------- |
| Framework  | Expo SDK 54, React 19.1, React Native 0.81 (New Architecture & React Compiler enabled) |
| Language   | TypeScript 5.9                                                                         |
| Routing    | Expo Router 6 (File-based, Typed)                                                      |
| Styling    | react-native-unistyles 3 (Theming & Responsive styles)                                 |
| State      | Jotai (Atomic state)                                                                   |
| Storage    | react-native-mmkv (High-performance persistent storage)                                |
| Animations | Reanimated 4, Moti                                                                     |
| Gestures   | react-native-gesture-handler 2                                                         |
| Keyboard   | react-native-keyboard-controller                                                       |
| Media      | expo-image, expo-video, expo-blur                                                      |
| Icons      | @expo/vector-icons (Ionicons)                                                          |
| Utils      | neverthrow (Result type), React Pacer                  |
| Components | Craft UI (20+ pre-built modular components)                                            |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 24+ (required for Expo)
- [Bun](https://bun.sh/) (recommended)
- [Expo Go](https://expo.dev/go) or [Development Build](https://docs.expo.dev/development/introduction/)
- [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/) or [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)

### Installation

1. **Clone the Repo**

   On Windows ensure the project is in the shorts folder path possible. If path is too long Android builds will error due to Windows 255 char path limit.

   Using this directory `C:/RN/Lab4-App` is recommended.

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Check installation**

   ```bash
   bun run doctor
   ```

4. **Generate native projects (Required for some packages)**

   ```bash
   bun run prebuild
   ```

5. **Start the development server**

   ```bash
   # Run on Android
   bun run android

   # Run on iOS
   bun run ios

   # Run on Web
   bun run web
   ```

**Note:** The development server will not work on RRCWireless. If your PC is on RRCWireless and your phone is on Robot_2dot4GHz it will not be able to connect and show the following error on boot.

```bash
java.net.ConnectException: Failed to connect to /<IP>`
```

Make sure both devices are on a `Robot_*` network.


## 📁 Project Structure

```text
src/
├── app/              # Expo Router screens (file-based routing)
│   ├── _layout.tsx   # Root layout with providers
│   └── index.tsx     # Initial route
├── components/
│   └── ui/           # UI base components
├── constants/        # Shared constants
├── hooks/            # Custom React hooks
├── services/         # Custom services
├── store/            # Jotai atoms for state management
├── theme/            # Unistyles configuration & theme tokens
└── types/            # Shared TypeScript definitions
assets/
└── images/           # App icons, splash screen, etc.
```

## 📜 Available Scripts

| Command               | Description                               |
| --------------------- | ----------------------------------------- |
| `bun run start`       | Start dev server with dev client          |
| `bun run android`     | Run locally on Android device/emulator    |
| `bun run ios`         | Run locally on iOS simulator              |
| `bun run web`         | Run on web browser                        |
| `bun run prebuild`    | Generate native projects (clean prebuild) |
| `bun run tsc`         | Type check the project                    |
| `bun run lint`        | Check for linting errors                  |
| `bun run format`      | Auto-fix linting and formatting           |
| `bun run install-fix` | Fix Expo dependency versions              |
| `bun run doctor`      | Run Expo doctor diagnostics               |
| `bun run clean`       | Remove build artifacts and node_modules   |

## 🎨 Theme & Styling

This project uses **react-native-unistyles** for theming.

- **Tokens**: Defined in `src/theme/`, including `colors`, `spacing`, `radius`, `fonts`, and `breakpoints`.
- **Adaptive**: Supports Light/Dark themes and system preference.
- **Usage**:
- ```tsx
  const stylesheet = StyleSheet.create((theme) => ({
  	container: {
  		flex: 1,
  		backgroundColor: theme.colors.background,
  		padding: theme.spacing.md,
  	},
  }));
  ```

## Ble Library

This project uses a fork of the popular react-native-ble-plx library as the original is no longer actively maintained. There is a known critital bug in the latest version of the original package that causes crashes on Android. Until and official fix is release the following fork will be used:

`@sfourdrinier/react-native-ble-plx`

## 🧩 Craft UI Components

A collection of pre-built, highly customizable components located in `src/components/ui/`:

- **Layout**: `HStack`, `VStack`, `Center`, `Divider`
- **Feedback**: `Badge`, `BottomSheet`, `ContextMenu`, `Modal`
- **Inputs**: `Button`, `ButtonRound`, `Checkbox`, `Radio`, `Switch`, `Slider`, `SliderDual`, `InputText`, `InputSearch`, `InputOTP`, `Counter`, `PasscodeEntry`
- **Display**: `Avatar`, `Card`, `ListItem`, `Text`, `PhotoCarousel`
- **Interactions**: `PressableScale`

## 📦 State Management

- **Jotai**: Used for atomic, decoupled state management. Atoms are located in `src/store/`.
- **MMKV**: Persistent storage integrated with Jotai using `atomWithMMKV`.

## 📱 Building for Production

### EAS Build

```bash
# Install EAS CLI
npm install --global eas-cli

# Configure EAS
eas build:configure

# Build for development/production
eas build --platform android
eas build --platform ios

# Run development build
eas build:run --profile development --platform android --latest
eas build:run --profile development --platform ios --latest
```
