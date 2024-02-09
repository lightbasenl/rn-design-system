import { TinyColor } from "@ctrl/tinycolor";

import { mergeDeepRight } from "./merge";
import type { ButtonProps } from "../components/Button";
import type { TextProps } from "../components/Text";
import type { ButtonVariants, ColorThemeKeys, DefaultButton } from "../types";

type ButtonVariantType = Partial<ButtonProps> & {
  backgroundColor?: ColorThemeKeys;
  borderColor?: ColorThemeKeys;
  textVariant?: TextProps["variant"];
};

export type ButtonVariantProps = Record<ButtonVariants, ButtonVariantType>;

type Props = {
  themeColor: ColorThemeKeys;
  parentBackGroundColor: string;
  resolveThemeColor: (color: ColorThemeKeys) => string;
  overrides: Partial<ButtonVariantProps>;
  defaultProps: DefaultButton;
  variant: ButtonVariants;
};
export function getButtonVariants({
  themeColor,
  parentBackGroundColor,
  resolveThemeColor,
  overrides,
  defaultProps,
  variant,
}: Props) {
  const variants: ButtonVariantProps = {
    solid: {
      backgroundColor: themeColor,
      borderColor: themeColor,
      textColor: "text-contrast",
      borderWidth: 1,
      width: "100%",
    },
    outline: {
      borderColor: themeColor,
      onPressBorderColor: themeColor,
      textColor: themeColor,
      borderWidth: 1,
      width: "100%",
    },
    soft: {
      onPressColor: { custom: new TinyColor(resolveThemeColor(themeColor)).tint(85).toHexString() },
      textColor: themeColor,
      borderWidth: 1,
      width: "100%",
    },
    ghost: {
      backgroundColor: { custom: parentBackGroundColor },
      borderColor: { custom: parentBackGroundColor },
      onPressColor: { custom: new TinyColor(resolveThemeColor(themeColor)).mix("#fff", 92).toHexString() },
      textColor: themeColor,
      borderWidth: 0,
      width: "100%",
    },
    link: {
      height: 30,
      textColor: themeColor,
      borderWidth: 0,
      themeColor: { custom: parentBackGroundColor },
    },
    icon: {
      backgroundColor: themeColor,
      borderColor: themeColor,
      paddingHorizontal: { custom: 0 },
      width: 30,
      height: 30,
      borderRadius: { custom: 30 },
    },
    unstyled: {
      onPressAnimatedScale: 1,
      themeColor: { custom: parentBackGroundColor },
      backgroundColor: { custom: "transparent" },
      borderRadius: { custom: 0 },
      paddingHorizontal: { custom: 0 },
      paddingVertical: { custom: 0 },
      onPressColor: { custom: "transparent" },
    },
  };
  return mergeDeepRight<Omit<ButtonVariantType, "children">>(
    defaultProps,
    variants[variant],
    overrides[variant] ?? {}
  );
}
