import * as React from "react";
import type { TextProps as RNTextProps, TextStyle } from "react-native";
import { Platform, Text as RNText } from "react-native";
import Animated from "react-native-reanimated";

import { useInternalTheme } from "../hooks/useInternalTheme";
import { weights, createTextSize, getTextDecoration } from "../theme/typography";
import type { ColorThemeKeys, FontFamily, FontSizes, FontVariant, FontWeights } from "../types";

export type TextProps = RNTextProps & {
  color?: ColorThemeKeys;
  italic?: boolean;
  textAlign?: TextStyle["textAlign"];
  underline?: boolean;
  strikeThrough?: boolean;
  animated?: boolean;
  children?: React.ReactNode;
  textTransform?: TextStyle["textTransform"];
  size?: FontSizes;
  flex?: TextStyle["flex"];
  family?: FontFamily;
  weight?: FontWeights;
  variant?: FontVariant;
};

export function Text({ variant, ...props }: TextProps) {
  const { variants, colors, defaults, typography } = useInternalTheme();
  const variantKey = (variant ?? defaults.Text.variant) as string | undefined;
  const variantType = variantKey ? variants.Text[variantKey] : null;
  const combined = { ...variantType, ...props };
  const {
    family,
    size,
    weight,
    color,
    italic,
    textAlign,
    underline,
    strikeThrough,
    children,
    style,
    animated,
    textTransform,
    flex,
    ...rest
  } = combined;
  if (!size) {
    throw new Error("Font size has not been defined as a variant or prop");
  }
  const defaultFamily = (defaults.Text.family ?? variants.Text[defaults.Text.variant]?.["family"]) as string;
  const metrics = typography.fonts[family ?? defaultFamily];
  const sizes = typography.sizes[size];
  if (!sizes) {
    throw new Error("Font size has not been defined as a variant or prop");
  }
  const fontSizes = createTextSize({
    fontMetrics: metrics,
    ...sizes,
  });

  let Component = RNText as typeof RNText;
  if (animated) {
    Component = Animated.Text as typeof RNText;
  }
  let customColor;
  if (typeof color === "object") {
    customColor = color.custom;
  }
  if (typeof color === "string") {
    customColor = colors[color];
  }

  return (
    <Component
      style={[
        {
          textTransform,
          textDecorationLine: getTextDecoration({ underline, strikeThrough }),
          textAlign,
          color: customColor,
          flex,
          fontWeight: weights[weight ?? "regular"],
          fontStyle: italic ? "italic" : "normal",
          fontFamily: family as string,
        },
        fontSizes,
        style,
      ]}
      {...rest}
    >
      {children}
      {/* https://github.com/facebook/react-native/issues/29232#issuecomment-889767516 */}
      {Platform.OS === "android" && "lineHeight" in fontSizes && !!fontSizes.lineHeight && (
        <RNText style={{ lineHeight: fontSizes?.lineHeight + 0.001 }} />
      )}
    </Component>
  );
}
