# @lightbase/rn-design-system

A modern, type-safe React Native design system built with performance and developer experience in mind. Features theme-based components, smooth animations, and pixel-perfect typography.

## Features

- 🎨 **Theme System**: Light/dark themes with full TypeScript support
- ⚡ **Performance**: Built on react-native-unistyles for optimal rendering
- 🎬 **Animations**: Smooth animations powered by react-native-reanimated
- 📝 **Typography**: Pixel-perfect text with Capsize integration
- ♿ **Accessibility**: Full accessibility support out of the box
- 🔧 **Type Safety**: Complete TypeScript coverage with theme augmentation
- 📱 **React Navigation**: Integrated components for navigation

## Installation

```sh
npm install @lightbase/rn-design-system
```

### Peer Dependencies

This package requires the following peer dependencies:

```sh
npm install react-native-unistyles react-native-reanimated react-native-safe-area-context react-native-gesture-handler react-native-keyboard-controller
```

For navigation integration:
```sh
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/elements
```

## Quick Start

### 1. Create a Theme

```tsx
import { createtheme } from '@lightbase/rn-design-system';

export const theme = createtheme({
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontFamily: 'Inter',
    variants: {
      heading: { fontSize: 24, fontWeight: '700' },
      body: { fontSize: 16, fontWeight: '400' },
      caption: { fontSize: 12, fontWeight: '400' },
    }
  }
});
```

### 2. Configure Unistyles

```tsx
// App.tsx or your root component
import { UnistylesRegistry } from 'react-native-unistyles';
import { theme } from './theme';

UnistylesRegistry.addThemes({
  light: theme.light,
  dark: theme.dark,
}).addConfig({
  adaptiveThemes: true,
});
```

### 3. Use Components

```tsx
import React from 'react';
import { Screen, VStack, Text, Button } from '@lightbase/rn-design-system';

export default function HomeScreen() {
  return (
    <Screen>
      <VStack spacing="lg" padding="md">
        <Text variant="heading" color="primary">
          Welcome to Design System
        </Text>
        
        <Text variant="body" color="text">
          A modern React Native design system with excellent performance.
        </Text>
        
        <Button variant="solid" color="primary" onPress={() => {}}>
          <Button.Text>Get Started</Button.Text>
        </Button>
      </VStack>
    </Screen>
  );
}
```

## Core Components

### Layout Components

#### Screen
Top-level screen container with safe area handling and navigation integration.

```tsx
<Screen safeAreaEdges={['top', 'bottom']}>
  {/* Your screen content */}
</Screen>
```

#### VStack / HStack
Layout containers for vertical and horizontal arrangements with spacing.

```tsx
<VStack spacing="md" align="center">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</VStack>

<HStack spacing="sm" align="center" justify="space-between">
  <Text>Left</Text>
  <Text>Right</Text>
</HStack>
```

### Typography

#### Text
Themeable text component with variant support and Capsize integration.

```tsx
<Text variant="heading" color="primary">
  Heading Text
</Text>

<Text fontSize={16} fontWeight="600" color="text">
  Custom Text
</Text>
```

### Interactive Components

#### Button
Animated button with multiple variants and loading states.

```tsx
<Button variant="solid" color="primary" loading={isLoading}>
  <Button.Text>Submit</Button.Text>
</Button>

<Button variant="outline" size="sm">
  <Button.Text>Cancel</Button.Text>
</Button>
```

## Theme Customization

### Extending Theme Types

```tsx
// types/theme.ts
declare module '@lightbase/rn-design-system' {
  interface CustomColors {
    brand: string;
    accent: string;
  }
  
  interface CustomSpacing {
    xxs: number;
    xxl: number;
  }
}
```

### Custom Theme

```tsx
const customTheme = createtheme({
  colors: {
    // Standard colors
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    
    // Custom colors
    brand: '#FF6B6B',
    accent: '#4ECDC4',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    
    // Custom spacing
    xxs: 2,
    xxl: 48,
  },
  typography: {
    fontFamily: 'Inter',
    variants: {
      heading: { fontSize: 24, fontWeight: '700' },
      subheading: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: '400' },
      caption: { fontSize: 12, fontWeight: '400' },
    }
  }
});
```

## Advanced Usage

### Custom Components with Theme

```tsx
import { createBox } from '@lightbase/rn-design-system';

const Card = createBox<'Pressable'>({
  component: 'Pressable',
  variants: {
    elevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }
  }
});

// Usage
<Card variant="elevated" backgroundColor="surface" padding="md">
  <Text>Card content</Text>
</Card>
```

### Navigation Integration

```tsx
import { Screen } from '@lightbase/rn-design-system';

function ProfileScreen({ navigation }) {
  return (
    <Screen
      navigationOptions={{
        title: 'Profile',
        headerRight: () => (
          <Button variant="link" onPress={() => navigation.navigate('Settings')}>
            <Button.Text>Settings</Button.Text>
          </Button>
        ),
      }}
    >
      {/* Screen content */}
    </Screen>
  );
}
```

## API Reference

### Component Props

All components support theme-based props for consistent styling:

- `color`: Theme color tokens
- `backgroundColor`: Theme color tokens  
- `padding`, `margin`: Theme spacing tokens
- `borderRadius`: Theme border radius tokens

### Common Props

```tsx
interface ThemeProps {
  color?: ColorTokens;
  backgroundColor?: ColorTokens;
  padding?: SpacingTokens | SpacingObject;
  margin?: SpacingTokens | SpacingObject;
  borderRadius?: BorderRadiusTokens;
}
```

## Performance

This design system is built for performance:

- **Unistyles**: Compile-time style optimization
- **Reanimated**: 60fps animations on the UI thread
- **Capsize**: Efficient font rendering with minimal layout shifts
- **Token-based**: Consistent theming with minimal runtime overhead

## Contributing

Contributions are welcome! This is an internal design system for Lightbase, but we appreciate feedback and suggestions.

## License

MIT

## Author

Oliver Winter <owinter86@gmail.com>

GitHub: [@owinter86](https://github.com/owinter86)