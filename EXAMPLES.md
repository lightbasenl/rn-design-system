# Usage Examples

This document provides practical examples of how to use the design system components in real-world scenarios.

## Basic Setup

First, set up your theme and configure Unistyles:

```tsx
// theme.ts
import { createtheme } from '@lightbase/rn-design-system';

export const theme = createtheme({
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    fontFamily: 'Inter',
    variants: {
      largeTitle: { fontSize: 34, fontWeight: '700' },
      title1: { fontSize: 28, fontWeight: '700' },
      title2: { fontSize: 22, fontWeight: '700' },
      title3: { fontSize: 20, fontWeight: '600' },
      headline: { fontSize: 17, fontWeight: '600' },
      body: { fontSize: 17, fontWeight: '400' },
      callout: { fontSize: 16, fontWeight: '400' },
      subhead: { fontSize: 15, fontWeight: '400' },
      footnote: { fontSize: 13, fontWeight: '400' },
      caption1: { fontSize: 12, fontWeight: '400' },
      caption2: { fontSize: 11, fontWeight: '400' },
    }
  }
});
```

```tsx
// App.tsx
import React from 'react';
import { UnistylesRegistry } from 'react-native-unistyles';
import { theme } from './theme';

UnistylesRegistry
  .addThemes({
    light: theme.light,
    dark: theme.dark,
  })
  .addConfig({
    adaptiveThemes: true,
  });

export default function App() {
  return <YourAppContent />;
}
```

## Screen Examples

### Login Screen

```tsx
import React, { useState } from 'react';
import { Screen, VStack, Text, Button } from '@lightbase/rn-design-system';
import { TextInput, KeyboardAvoidingView, Platform } from 'react-native';

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Login logic here
    setLoading(false);
  };

  return (
    <Screen 
      backgroundColor="background" 
      safeAreaEdges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <VStack 
          flex={1} 
          padding="lg" 
          justify="center" 
          spacing="xl"
        >
          <VStack spacing="md" align="center">
            <Text variant="largeTitle" color="primary">
              Welcome Back
            </Text>
            <Text variant="body" color="textSecondary" textAlign="center">
              Sign in to continue to your account
            </Text>
          </VStack>

          <VStack spacing="md">
            <VStack spacing="xs">
              <Text variant="subhead" color="text">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: '#C6C6C8',
                  borderRadius: 8,
                  padding: 16,
                  fontSize: 17,
                }}
              />
            </VStack>

            <VStack spacing="xs">
              <Text variant="subhead" color="text">
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                style={{
                  borderWidth: 1,
                  borderColor: '#C6C6C8',
                  borderRadius: 8,
                  padding: 16,
                  fontSize: 17,
                }}
              />
            </VStack>
          </VStack>

          <VStack spacing="md">
            <Button 
              variant="solid" 
              color="primary" 
              loading={loading}
              onPress={handleLogin}
            >
              <Button.Text>Sign In</Button.Text>
            </Button>

            <Button 
              variant="link" 
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Button.Text>Forgot Password?</Button.Text>
            </Button>
          </VStack>

          <VStack spacing="sm" align="center">
            <Text variant="footnote" color="textSecondary">
              Don't have an account?
            </Text>
            <Button 
              variant="link" 
              onPress={() => navigation.navigate('Register')}
            >
              <Button.Text>Create Account</Button.Text>
            </Button>
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </Screen>
  );
}
```

### Profile Screen

```tsx
import React from 'react';
import { Screen, VStack, HStack, Text, Button } from '@lightbase/rn-design-system';
import { Image, ScrollView } from 'react-native';

export function ProfileScreen({ navigation }) {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
    joinDate: 'January 2024',
  };

  return (
    <Screen
      backgroundColor="background"
      navigationOptions={{
        title: 'Profile',
        headerRight: () => (
          <Button variant="link" onPress={() => navigation.navigate('EditProfile')}>
            <Button.Text>Edit</Button.Text>
          </Button>
        ),
      }}
    >
      <ScrollView>
        <VStack spacing="xl" padding="lg">
          {/* Profile Header */}
          <VStack spacing="md" align="center">
            <Image
              source={{ uri: user.avatar }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
            />
            <VStack spacing="xs" align="center">
              <Text variant="title1" color="text">
                {user.name}
              </Text>
              <Text variant="subhead" color="textSecondary">
                {user.email}
              </Text>
              <Text variant="caption1" color="textSecondary">
                Member since {user.joinDate}
              </Text>
            </VStack>
          </VStack>

          {/* Stats */}
          <HStack spacing="md" justify="equal">
            <VStack 
              backgroundColor="surface" 
              padding="md" 
              borderRadius="md" 
              align="center" 
              spacing="xs"
              flex={1}
            >
              <Text variant="title2" color="primary">
                24
              </Text>
              <Text variant="caption1" color="textSecondary">
                Projects
              </Text>
            </VStack>

            <VStack 
              backgroundColor="surface" 
              padding="md" 
              borderRadius="md" 
              align="center" 
              spacing="xs"
              flex={1}
            >
              <Text variant="title2" color="success">
                18
              </Text>
              <Text variant="caption1" color="textSecondary">
                Completed
              </Text>
            </VStack>

            <VStack 
              backgroundColor="surface" 
              padding="md" 
              borderRadius="md" 
              align="center" 
              spacing="xs"
              flex={1}
            >
              <Text variant="title2" color="warning">
                6
              </Text>
              <Text variant="caption1" color="textSecondary">
                In Progress
              </Text>
            </VStack>
          </HStack>

          {/* Menu Items */}
          <VStack spacing="sm">
            <Text variant="headline" color="text">
              Settings
            </Text>

            <VStack backgroundColor="surface" borderRadius="md" overflow="hidden">
              <MenuItem 
                title="Notifications"
                onPress={() => navigation.navigate('Notifications')}
              />
              <MenuItem 
                title="Privacy & Security"
                onPress={() => navigation.navigate('Privacy')}
              />
              <MenuItem 
                title="Help & Support"
                onPress={() => navigation.navigate('Support')}
              />
              <MenuItem 
                title="About"
                onPress={() => navigation.navigate('About')}
                showSeparator={false}
              />
            </VStack>
          </VStack>

          {/* Logout Button */}
          <Button variant="soft" color="error">
            <Button.Text>Sign Out</Button.Text>
          </Button>
        </VStack>
      </ScrollView>
    </Screen>
  );
}

function MenuItem({ title, onPress, showSeparator = true }) {
  return (
    <>
      <Button variant="unstyled" onPress={onPress}>
        <HStack padding="md" justify="space-between" align="center">
          <Text variant="body" color="text">
            {title}
          </Text>
          <Text variant="body" color="textSecondary">
            →
          </Text>
        </HStack>
      </Button>
      {showSeparator && (
        <VStack height={1} backgroundColor="border" marginHorizontal="md" />
      )}
    </>
  );
}
```

## Layout Patterns

### Card Layout

```tsx
import { VStack, HStack, Text, Button, createBox } from '@lightbase/rn-design-system';

const Card = createBox<'View'>({
  component: 'View',
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

export function ProductCard({ product }) {
  return (
    <Card 
      variant="elevated"
      backgroundColor="surface"
      borderRadius="md"
      padding="md"
      margin="sm"
    >
      <VStack spacing="sm">
        <HStack justify="space-between" align="center">
          <Text variant="headline" color="text" numberOfLines={1}>
            {product.name}
          </Text>
          <Text variant="title3" color="primary">
            ${product.price}
          </Text>
        </HStack>

        <Text variant="subhead" color="textSecondary" numberOfLines={3}>
          {product.description}
        </Text>

        <HStack spacing="sm" justify="space-between">
          <Button variant="outline" color="primary" flex={1}>
            <Button.Text>View Details</Button.Text>
          </Button>
          <Button variant="solid" color="primary" flex={1}>
            <Button.Text>Add to Cart</Button.Text>
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
}
```

### List with Separators

```tsx
import { VStack, HStack, Text } from '@lightbase/rn-design-system';

export function SettingsList() {
  const settings = [
    { title: 'Notifications', subtitle: 'Push notifications and alerts' },
    { title: 'Privacy', subtitle: 'Data and privacy settings' },
    { title: 'Account', subtitle: 'Manage your account' },
    { title: 'About', subtitle: 'App information and support' },
  ];

  return (
    <VStack 
      backgroundColor="surface" 
      borderRadius="md" 
      overflow="hidden"
    >
      {settings.map((setting, index) => (
        <VStack key={setting.title}>
          <HStack padding="md" spacing="md" align="center">
            <VStack flex={1} spacing="xs">
              <Text variant="body" color="text">
                {setting.title}
              </Text>
              <Text variant="caption1" color="textSecondary">
                {setting.subtitle}
              </Text>
            </VStack>
            <Text variant="body" color="textSecondary">
              →
            </Text>
          </HStack>
          {index < settings.length - 1 && (
            <VStack height={1} backgroundColor="border" marginHorizontal="md" />
          )}
        </VStack>
      ))}
    </VStack>
  );
}
```

### Grid Layout

```tsx
import { VStack, HStack, Text } from '@lightbase/rn-design-system';

export function IconGrid() {
  const icons = [
    { name: 'Calendar', icon: '📅' },
    { name: 'Messages', icon: '💬' },
    { name: 'Photos', icon: '📷' },
    { name: 'Settings', icon: '⚙️' },
    { name: 'Music', icon: '🎵' },
    { name: 'Maps', icon: '🗺️' },
  ];

  const rows = [];
  for (let i = 0; i < icons.length; i += 3) {
    rows.push(icons.slice(i, i + 3));
  }

  return (
    <VStack spacing="md">
      {rows.map((row, rowIndex) => (
        <HStack key={rowIndex} spacing="md" justify="space-evenly">
          {row.map((item) => (
            <VStack 
              key={item.name}
              align="center" 
              spacing="xs" 
              padding="md"
              backgroundColor="surface"
              borderRadius="md"
              flex={1}
            >
              <Text variant="title1">{item.icon}</Text>
              <Text variant="caption1" color="textSecondary">
                {item.name}
              </Text>
            </VStack>
          ))}
        </HStack>
      ))}
    </VStack>
  );
}
```

## Form Examples

### Contact Form

```tsx
import React, { useState } from 'react';
import { VStack, HStack, Text, Button } from '@lightbase/rn-design-system';
import { TextInput, Alert } from 'react-native';

export function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    // Submit logic here
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <VStack spacing="lg" padding="lg">
      <VStack spacing="xs">
        <Text variant="title2" color="text">
          Get in Touch
        </Text>
        <Text variant="subhead" color="textSecondary">
          We'd love to hear from you. Send us a message!
        </Text>
      </VStack>

      <VStack spacing="md">
        <FormField
          label="Name"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
          placeholder="Your full name"
          required
        />

        <FormField
          label="Email"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />

        <FormField
          label="Message"
          value={form.message}
          onChangeText={(text) => setForm({ ...form, message: text })}
          placeholder="Your message..."
          multiline
          numberOfLines={4}
          required
        />
      </VStack>

      <Button 
        variant="solid" 
        color="primary" 
        loading={loading}
        onPress={handleSubmit}
      >
        <Button.Text>Send Message</Button.Text>
      </Button>
    </VStack>
  );
}

function FormField({ 
  label, 
  required = false, 
  multiline = false, 
  numberOfLines = 1,
  ...textInputProps 
}) {
  return (
    <VStack spacing="xs">
      <HStack spacing="xs" align="center">
        <Text variant="subhead" color="text">
          {label}
        </Text>
        {required && (
          <Text variant="subhead" color="error">
            *
          </Text>
        )}
      </HStack>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#C6C6C8',
          borderRadius: 8,
          padding: 12,
          fontSize: 17,
          textAlignVertical: multiline ? 'top' : 'center',
          height: multiline ? numberOfLines * 20 + 24 : 44,
        }}
        multiline={multiline}
        numberOfLines={numberOfLines}
        {...textInputProps}
      />
    </VStack>
  );
}
```

## Loading States

### Loading Screen

```tsx
import { Screen, VStack, Text } from '@lightbase/rn-design-system';
import { ActivityIndicator } from 'react-native';

export function LoadingScreen() {
  return (
    <Screen backgroundColor="background">
      <VStack flex={1} justify="center" align="center" spacing="md">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text variant="subhead" color="textSecondary">
          Loading...
        </Text>
      </VStack>
    </Screen>
  );
}
```

### Skeleton Loading

```tsx
import { VStack, HStack } from '@lightbase/rn-design-system';
import { useEffect, useState } from 'react';
import { Animated } from 'react-native';

export function SkeletonCard() {
  const [opacity] = useState(new Animated.Value(0.3));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <VStack 
      backgroundColor="surface" 
      padding="md" 
      borderRadius="md" 
      spacing="sm"
    >
      <HStack spacing="sm" align="center">
        <Animated.View
          style={{
            width: 60,
            height: 60,
            backgroundColor: '#C6C6C8',
            borderRadius: 30,
            opacity,
          }}
        />
        <VStack flex={1} spacing="xs">
          <Animated.View
            style={{
              width: '70%',
              height: 20,
              backgroundColor: '#C6C6C8',
              borderRadius: 4,
              opacity,
            }}
          />
          <Animated.View
            style={{
              width: '90%',
              height: 16,
              backgroundColor: '#C6C6C8',
              borderRadius: 4,
              opacity,
            }}
          />
        </VStack>
      </HStack>
      
      <VStack spacing="xs">
        <Animated.View
          style={{
            width: '100%',
            height: 16,
            backgroundColor: '#C6C6C8',
            borderRadius: 4,
            opacity,
          }}
        />
        <Animated.View
          style={{
            width: '80%',
            height: 16,
            backgroundColor: '#C6C6C8',
            borderRadius: 4,
            opacity,
          }}
        />
      </VStack>
    </VStack>
  );
}
```

## Dark Theme Examples

All components automatically adapt to dark/light themes when using `adaptiveThemes: true` in Unistyles configuration. You can also manually switch themes:

```tsx
import { useStyles } from 'react-native-unistyles';

export function ThemeToggle() {
  const { theme, setTheme } = useStyles();

  const toggleTheme = () => {
    setTheme(theme.name === 'light' ? 'dark' : 'light');
  };

  return (
    <Button variant="outline" onPress={toggleTheme}>
      <Button.Text>
        Switch to {theme.name === 'light' ? 'Dark' : 'Light'} Theme
      </Button.Text>
    </Button>
  );
}
```