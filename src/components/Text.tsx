import * as React from "react";
import type { TextProps as RNTextProps, TextStyle } from "react-native";
import { Platform, Text as RNText } from "react-native";

import { useInternalTheme } from "../hooks/useInternalTheme";
import { weights, getTextDecoration } from "../theme/typography";
import type { ColorThemeKeys, FontFamily, FontSizes, FontVariant, FontWeights } from "../types";

export type TextProps = RNTextProps & {
  color?: ColorThemeKeys;
  italic?: boolean;
  textAlign?: TextStyle["textAlign"];
  underline?: boolean;
  strikeThrough?: boolean;
  children?: React.ReactNode;
  textTransform?: TextStyle["textTransform"];
  size?: FontSizes;
  flex?: TextStyle["flex"];
  family?: FontFamily;
  weight?: FontWeights;
  variant?: FontVariant;
};

export function Text({ variant, ...props }: TextProps) {
  const { variants, colors, defaults, typography, capsize } = useInternalTheme();
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
    textTransform,
    flex,
    ...rest
  } = combined;
  if (!size) {
    throw new Error("Font size has not been defined as a variant or prop");
  }
  const sizes = typography.sizes[size];
  if (!sizes) {
    throw new Error("Font size has not been defined as a variant or prop");
  }

  let customColor;
  if (typeof color === "object") {
    customColor = color.custom;
  }
  if (typeof color === "string") {
    customColor = colors[color];
  }

  const capsizeAdjustments = capsize?.[size as string]?.[family as string];

  return (
    <RNText
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
          fontSize: sizes.fontSize,
          lineHeight: sizes.lineHeight,
        },
        capsizeAdjustments,
        style,
      ]}
      {...rest}
    >
      {children}
      {/* https://github.com/facebook/react-native/issues/29232#issuecomment-889767516 */}
      {Platform.OS === "android" && "lineHeight" in sizes && !!sizes.lineHeight && (
        <RNText style={{ lineHeight: sizes?.lineHeight + 0.001 }} />
      )}
    </RNText>
  );
}
