import { TinyColor } from "@ctrl/tinycolor";

import type { UnistylesThemes } from "react-native-unistyles";
import type { ButtonProps } from "../components/Button";
import type { ButtonVariants, ColorThemeKeys } from "../types";
import type { TextProps } from "../unistyles/Text";
import { mergeDeepRight } from "./merge";
import { getActiveColor } from "./colorUtils";

type ButtonVariantType = Partial<ButtonProps> & {
	backgroundColor?: ColorThemeKeys;
	borderColor?: ColorThemeKeys;
	textVariant?: TextProps["variant"];
};

export type ButtonVariantProps = Record<ButtonVariants, ButtonVariantType>;

type Props = {
	themeColor: ColorThemeKeys;
	variant: ButtonVariants;
	theme: UnistylesThemes[keyof UnistylesThemes];
};
export function getButtonVariants({ themeColor: buttonThemeColor, variant: buttonVariant, theme }: Props) {
	const overrides = theme.variants.Button;
	const defaultProps = theme.defaults.Button;
	const colors = theme.colors;

	const variant = buttonVariant ?? defaultProps.variant ?? "solid";
	const themeColor = buttonThemeColor ?? defaultProps.themeColor ?? "primary";
	const resolveThemeColor = (color: ColorThemeKeys) => {
		if (typeof color === "object") {
			return color.custom;
		}
		return colors[color] as string;
	};

	const variants: ButtonVariantProps = {
		solid: {
			backgroundColor: themeColor,
			borderColor: themeColor,
			onPressColor: { custom: getActiveColor(resolveThemeColor(themeColor)) },
			onPressBorderColor: { custom: getActiveColor(resolveThemeColor(themeColor)) },
			borderWidth: 1,
			width: "100%",
		},
		outline: {
			backgroundColor: { custom: new TinyColor(resolveThemeColor(themeColor)).setAlpha(0).toHexString() },
			onPressColor: { custom: new TinyColor(resolveThemeColor(themeColor)).toHexString() },
			borderColor: themeColor,
			onPressBorderColor: themeColor,
			textColor: themeColor,
			borderWidth: 1,
			width: "100%",
		},
		ghost: {
			backgroundColor: { custom: new TinyColor(resolveThemeColor(themeColor)).setAlpha(0).toHexString() },
			borderColor: { custom: new TinyColor(resolveThemeColor(themeColor)).setAlpha(0).toHexString() },
			onPressColor: { custom: new TinyColor(resolveThemeColor(themeColor)).mix("#fff", 92).toHexString() },
			textColor: themeColor,
			borderWidth: 0,
			width: "100%",
		},
	};
	return mergeDeepRight<Omit<ButtonVariantType, "children">>(
		defaultProps,
		variants[variant],
		overrides[variant] ?? {}
	);
}
