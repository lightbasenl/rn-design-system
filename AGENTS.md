# AGENTS.md - AI Coding Agent Instructions

This document provides instructions for AI coding agents working in this repository.

## Project Overview

`@lightbase/rn-design-system` is an internal React Native design system library built on `react-native-unistyles`. It provides theme-aware UI components with token-based styling for React Native applications.

## Build & Development Commands

```bash
# Install dependencies
npm install

# Build the library (CommonJS, ESM, TypeScript types)
npm run prepare

# Type checking
npm run typecheck

# Lint and format (auto-fix)
npm run check

# Run tests
npm run test

# Run a single test file
npm run test -- path/to/test.ts

# Run tests matching a pattern
npm run test -- -t "pattern"

# Check for dependency updates
npm run updates

# Release (conventional changelog + npm publish)
npm run release
```

## Code Style Guidelines

### Formatting (Biome)

- Line width: 110 characters
- Quote style: Double quotes (`"`) for both JS and JSX
- Trailing commas: ES5 style
- Organize imports: Enabled (auto-sorted)
- Indentation: Tabs

### TypeScript Configuration

- **Strict mode**: Enabled with all strict checks
- **noUncheckedIndexedAccess**: true - always check array/object index access
- **verbatimModuleSyntax**: true - use `import type` for type-only imports
- **noUnusedLocals/Parameters**: true - no dead code
- **noImplicitReturns**: true - all code paths must return

### Import Organization

1. External packages first (React, React Native, third-party)
2. Internal modules second (relative imports)
3. Use `import type` for type-only imports

```typescript
// Good
import { TinyColor } from "@ctrl/tinycolor";
import type { ReactElement } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import type { BoxProps } from "../types";
import { resolveColor } from "./utils";
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `Button`, `VStack`, `Screen` |
| Functions | camelCase | `createBox`, `resolveColor` |
| Types/Interfaces | PascalCase | `BoxProps`, `ColorThemeKeys` |
| Constants | UPPER_SNAKE_CASE or camelCase | `WEIGHTS`, `alignHorizontalToFlexAlign` |
| Files | PascalCase for components, camelCase for utilities | `Button.tsx`, `colorUtils.tsx` |

### Component Structure

```typescript
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import type { BoxProps } from "../types";

// 1. Types first
type ComponentProps = BoxProps & {
  customProp?: string;
};

// 2. Component definition
export function Component({ children, customProp, ...props }: ComponentProps) {
  return (
    <View style={styles.container} {...props}>
      {children}
    </View>
  );
}

// 3. Styles at the bottom using StyleSheet.create
const styles = StyleSheet.create((theme, rt) => ({
  container: {
    // Use theme tokens
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
}));
```

### Styling with Unistyles

- Use `StyleSheet.create` from `react-native-unistyles`
- Access theme via the callback: `StyleSheet.create((theme, rt) => ({...}))`
- `rt` (runtime) provides `insets`, `breakpoint`, etc.
- For dynamic styles, use function-based styles:

```typescript
const styles = StyleSheet.create((theme) => ({
  container: (props: SomeProps) => ({
    backgroundColor: resolveColor(props.color, theme.colors),
  }),
}));

// Usage
<View style={styles.container(props)} />
```

### Theme Tokens

- **Colors**: Use `ColorThemeKeys` type, resolve via `resolveColor()`
- **Spacing**: Use `Spacing` type, resolve via `resolveSpace()`
- **Radius**: Use `Radius` type, resolve via theme.radius
- Custom values: `{ custom: value }` pattern

### Error Handling

- Throw descriptive errors for invalid theme tokens:
```typescript
throw new Error(`color value: ${color} is not included in the current theme configuration`);
```
- Use `__DEV__` checks for development-only validation
- Avoid `any` types - use `warn` level for `noExplicitAny`

### React Hooks

- Follow exhaustive-deps rule (error level)
- Custom hook config for Reanimated hooks (`useAnimatedStyle`, `useDerivedValue`)

## Project Structure

```
src/
├── components/        # Complex UI components (Button)
├── config/           # Theme configuration exports
├── hooks/            # Custom React hooks
├── theme/            # Typography configuration
├── tools/            # Utility functions
├── unistyles/        # Unistyles-based primitive components
├── index.ts          # Main barrel export
├── types.tsx         # Type definitions
└── expo.ts           # Expo plugin exports
```

## Key Patterns

### Factory Functions for Components

Use `createBox` and `createScrollableBox` to create styled primitives:

```typescript
import { createBox } from "./createBox";
import { View } from "react-native";

const Box = createBox(View);
```

### Background Color Context

Components that set `backgroundColor` provide it via context for child components:

```typescript
<BackgroundContext.Provider value={backgroundColor}>
  {children}
</BackgroundContext.Provider>
```

### Type Augmentation

Users extend types via module augmentation:

```typescript
declare module '@lightbase/rn-design-system' {
  export interface LBCustomAppThemes extends CustomTheme {}
}
```

## Git Commit Guidelines

Uses [Conventional Commits](https://conventionalcommits.org/) with Angular preset:

- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks
- `docs:` - Documentation
- `refactor:` - Code refactoring

Example: `chore: release 2.5.3`

## Pre-commit Hooks (Lefthook)

- **lint**: ESLint on staged JS/TS files
- **types**: TypeScript type checking
- **commit-msg**: Commitlint validation
