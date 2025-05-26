import { TinyColor } from "@ctrl/tinycolor";

import { useCallback } from "react";
import { UnistylesRuntime } from "react-native-unistyles";
import type { ButtonProps } from "../components/Button";
import type { ButtonVariants, ColorThemeKeys } from "../types";
import type { TextProps } from "../unistyles/Text";
import { mergeDeepRight } from "./merge";

type ButtonVariantType = Partial<ButtonProps> & {
	backgroundColor?: ColorThemeKeys;
	borderColor?: ColorThemeKeys;
	textVariant?: TextProps["variant"];
};

export type ButtonVariantProps = Record<ButtonVariants, ButtonVariantType>;

type Props = {
	themeColor: ColorThemeKeys;
	parentBackGroundColor: string;
	variant: ButtonVariants;
};
export function getButtonVariants({
	themeColor = UnistylesRuntime.getTheme().defaults.Button.themeColor,
	parentBackGroundColor,
	variant = UnistylesRuntime.getTheme().defaults.Button.variant ?? "solid",
}: Props) {
	const overrides = UnistylesRuntime.getTheme().variants.Button;
	const defaultProps = UnistylesRuntime.getTheme().defaults.Button;
	const colors = UnistylesRuntime.getTheme().colors;
	const resolveThemeColor = useCallback(
		(color: ColorThemeKeys) => {
			if (typeof color === "object") {
				return color.custom;
			}
			return colors[color] as string;
		},
		[colors]
	);

	const variants: ButtonVariantProps = {
		solid: {
			backgroundColor: themeColor,
			borderColor: themeColor,
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
