import { PixelRatio } from "react-native";

import { createTextSize } from "../theme/typography";
import type {
  ButtonVariant,
  CreateLBConfig,
  FontMetrics,
  GenericFontSizes,
  LightColors,
  SpacingConfig,
  TextVariant,
} from "../types";

export function createtheme<
  T extends LightColors,
  K extends FontMetrics,
  S extends GenericFontSizes,
  Spacing extends SpacingConfig,
  Radius extends SpacingConfig,
  TTextVariant extends TextVariant<K, S, T>,
  TButtonVariant extends ButtonVariant<K, T, S, TTextVariant, Spacing, Radius>,
>(
  config: CreateLBConfig<K, T, S, Spacing, Radius, TTextVariant, TButtonVariant>
): CreateLBConfig<K, T, S, Spacing, Radius, TTextVariant, TButtonVariant> {
  const themeColors = {
    light: config.colors.light,
    dark: { ...config.colors.light, ...config.colors.dark } as T,
  };

  config.colors = themeColors;

  const fonts = Object.entries(config.typography.sizes).reduce((prev, cur) => {
    Object.entries(config.typography.fonts).forEach(([fontKey, fontValue]) => {
      const [key, value] = cur;
      const { fontSize, lineHeight, marginBottom, marginTop } = createTextSize({
        fontMetrics: fontValue,
        fontSize: PixelRatio.roundToNearestPixel(value.fontSize),
        lineHeight: PixelRatio.roundToNearestPixel(value.lineHeight),
      });
      prev[key] = {
        fontSize,
        lineHeight,
        [fontKey]: { marginTop, marginBottom },
      };
    });
    return prev;
  }, {} as any);

  config.typography.sizes = fonts;

  return config;
}
