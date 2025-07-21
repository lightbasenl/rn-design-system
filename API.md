# API Reference

## Components

### Screen

Top-level container component with safe area handling and React Navigation integration.

```tsx
interface ScreenProps extends BoxProps {
  children?: React.ReactNode;
  safeAreaEdges?: Edge[];
  navigationOptions?: NativeStackNavigationOptions;
}
```

**Props:**
- `safeAreaEdges` - Array of edges to apply safe area insets (`'top' | 'bottom' | 'left' | 'right'`)
- `navigationOptions` - React Navigation screen options
- All `BoxProps` for styling

**Example:**
```tsx
<Screen 
  safeAreaEdges={['top', 'bottom']} 
  backgroundColor="background"
  navigationOptions={{ title: 'Home' }}
>
  <Text>Screen content</Text>
</Screen>
```

### VStack

Vertical layout container with consistent spacing between children.

```tsx
interface VStackProps extends BoxProps {
  children?: React.ReactNode;
  spacing?: SpacingTokens;
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  separator?: React.ReactElement;
  reversed?: boolean;
}
```

**Props:**
- `spacing` - Space between child elements using theme tokens
- `align` - Horizontal alignment of children
- `justify` - Vertical distribution of children
- `separator` - Element to render between children
- `reversed` - Reverse the order of children

**Example:**
```tsx
<VStack spacing="md" align="center">
  <Text>First item</Text>
  <Text>Second item</Text>
  <Text>Third item</Text>
</VStack>
```

### HStack

Horizontal layout container with advanced alignment options.

```tsx
interface HStackProps extends BoxProps {
  children?: React.ReactNode;
  spacing?: SpacingTokens;
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'equal';
  separator?: React.ReactElement;
  reversed?: boolean;
  wrap?: boolean;
  rowGap?: SpacingTokens;
  columnGap?: SpacingTokens;
}
```

**Props:**
- `spacing` - Space between child elements
- `align` - Vertical alignment of children
- `justify` - Horizontal distribution of children (`'equal'` makes all children equal width)
- `separator` - Element to render between children (disabled when `wrap` is true)
- `wrap` - Allow children to wrap to new lines
- `rowGap`/`columnGap` - Gap between rows/columns when wrapping

**Example:**
```tsx
<HStack spacing="sm" align="center" justify="space-between">
  <Text>Left</Text>
  <Text>Center</Text>
  <Text>Right</Text>
</HStack>
```

### Text

Typography component with theme variants and Capsize integration.

```tsx
interface TextProps extends Omit<RNTextProps, 'style'>, ThemeProps {
  variant?: TextVariants;
  fontSize?: number;
  fontWeight?: FontWeight;
  fontStyle?: 'normal' | 'italic';
  fontFamily?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  numberOfLines?: number;
}
```

**Props:**
- `variant` - Predefined text style from theme
- `fontSize` - Text size in pixels
- `fontWeight` - Font weight ('100' to '900', 'normal', 'bold')
- `color` - Text color using theme tokens
- All standard React Native Text props

**Example:**
```tsx
<Text variant="heading" color="primary">
  Main Heading
</Text>

<Text fontSize={16} fontWeight="600" color="text" numberOfLines={2}>
  Custom styled text with truncation
</Text>
```

### Button

Animated button component with variants and loading states.

```tsx
interface ButtonProps extends Omit<PressableProps, 'style' | 'children'>, ThemeProps {
  variant?: ButtonVariants;
  size?: ButtonSizes;
  loading?: boolean;
  disabled?: boolean;
  loadingComponent?: React.ReactElement;
  children?: React.ReactNode;
}
```

**Props:**
- `variant` - Button style variant (`'solid' | 'soft' | 'outline' | 'link' | 'icon' | 'unstyled' | 'ghost'`)
- `size` - Button size (`'xs' | 'sm' | 'md' | 'lg' | 'xl'`)
- `loading` - Show loading state with spinner
- `loadingComponent` - Custom loading component
- `color` - Button color using theme tokens

**Subcomponents:**
- `Button.Text` - Text component optimized for buttons

**Example:**
```tsx
<Button variant="solid" color="primary" loading={isSubmitting}>
  <Button.Text>Submit Form</Button.Text>
</Button>

<Button variant="outline" size="sm" onPress={handleCancel}>
  <Button.Text>Cancel</Button.Text>
</Button>
```

## Utilities

### createtheme

Factory function for creating light/dark theme pairs with automatic font metrics.

```tsx
function createtheme<T extends ThemeConfig>(config: T): {
  light: Theme & T;
  dark: Theme & T;
}
```

**Parameters:**
- `config` - Theme configuration object

**Returns:**
- Object with `light` and `dark` theme variants

**Example:**
```tsx
const theme = createtheme({
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

### createBox

Factory function for creating custom themed components.

```tsx
function createBox<T extends keyof ComponentMap>(config: {
  component: T;
  variants?: Record<string, StyleProps>;
}): React.ComponentType<BoxProps & ComponentMap[T] & VariantProps>
```

**Parameters:**
- `config.component` - React Native component type
- `config.variants` - Predefined style variants

**Example:**
```tsx
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

// Usage
<Card variant="elevated" backgroundColor="surface" padding="md">
  <Text>Card content</Text>
</Card>
```

### resolveBoxTokens

Utility function for resolving theme tokens to actual values.

```tsx
function resolveBoxTokens(props: BoxProps, theme: Theme): ResolvedStyles
```

## Types

### BoxProps

Base props interface for all layout components.

```tsx
interface BoxProps extends ThemeProps {
  flex?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | string;
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  
  position?: 'absolute' | 'relative';
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: number;
  
  padding?: SpacingTokens | SpacingObject;
  paddingTop?: SpacingTokens;
  paddingRight?: SpacingTokens;
  paddingBottom?: SpacingTokens;
  paddingLeft?: SpacingTokens;
  paddingHorizontal?: SpacingTokens;
  paddingVertical?: SpacingTokens;
  
  margin?: SpacingTokens | SpacingObject;
  marginTop?: SpacingTokens;
  marginRight?: SpacingTokens;
  marginBottom?: SpacingTokens;
  marginLeft?: SpacingTokens;
  marginHorizontal?: SpacingTokens;
  marginVertical?: SpacingTokens;
  
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderColor?: ColorTokens;
  borderRadius?: BorderRadiusTokens | BorderRadiusObject;
  borderTopLeftRadius?: BorderRadiusTokens;
  borderTopRightRadius?: BorderRadiusTokens;
  borderBottomRightRadius?: BorderRadiusTokens;
  borderBottomLeftRadius?: BorderRadiusTokens;
  
  backgroundColor?: ColorTokens;
  opacity?: number;
  overflow?: 'visible' | 'hidden' | 'scroll';
}
```

### ThemeProps

Base theme properties for components.

```tsx
interface ThemeProps {
  color?: ColorTokens;
  backgroundColor?: ColorTokens;
}
```

### SpacingObject

Object form of spacing for precise control.

```tsx
interface SpacingObject {
  top?: SpacingTokens;
  right?: SpacingTokens;
  bottom?: SpacingTokens;
  left?: SpacingTokens;
}
```

### BorderRadiusObject

Object form of border radius for precise control.

```tsx
interface BorderRadiusObject {
  topLeft?: BorderRadiusTokens;
  topRight?: BorderRadiusTokens;
  bottomRight?: BorderRadiusTokens;
  bottomLeft?: BorderRadiusTokens;
}
```

## Theme Tokens

### Color Tokens

```tsx
type ColorTokens = 
  | 'primary' 
  | 'secondary' 
  | 'background' 
  | 'surface' 
  | 'text'
  | keyof CustomColors; // Extended via module augmentation
```

### Spacing Tokens

```tsx
type SpacingTokens = 
  | 'xs' 
  | 'sm' 
  | 'md' 
  | 'lg' 
  | 'xl'
  | keyof CustomSpacing; // Extended via module augmentation
```

### Border Radius Tokens

```tsx
type BorderRadiusTokens = 
  | 'xs' 
  | 'sm' 
  | 'md' 
  | 'lg' 
  | 'xl'
  | keyof CustomBorderRadius; // Extended via module augmentation
```

## Module Augmentation

Extend theme types by declaring module augmentation:

```tsx
declare module '@lightbase/rn-design-system' {
  interface CustomColors {
    brand: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  }
  
  interface CustomSpacing {
    xxs: number;
    xxl: number;
  }
  
  interface CustomTextVariants {
    title: TypographyStyle;
    subtitle: TypographyStyle;
  }
  
  interface CustomButtonVariants {
    destructive: ButtonVariantStyle;
  }
}
```