import { PixelRatio } from "react-native";

import { createTextSize } from "../theme/typography";
import type {
	AppThemes,
	ButtonVariant,
	CapSizeConfig,
	CapsizeCon,
	CreateLBConfig,
	FontMetrics,
	GenericFontSizes,
	LightColors,
	SpacingConfig,
	TextVariant,
} from "../types";

type ThemeType<
	T extends LightColors,
	K extends FontMetrics,
	S extends GenericFontSizes,
	Spacing extends SpacingConfig,
	Radius extends SpacingConfig,
	TTextVariant extends TextVariant<K, S, T>,
	TButtonVariant extends ButtonVariant<K, T, S, TTextVariant, Spacing, Radius>,
> = Omit<CreateLBConfig<K, T, S, Spacing, Radius, TTextVariant, TButtonVariant>, "colors"> & {
	capsize: CapSizeConfig<S, K>;
	colors: T;
};

declare module "react-native-unistyles" {
	export interface UnistylesThemes extends AppThemes {}
}

export function createtheme<
	T extends LightColors,
	K extends FontMetrics,
	S extends GenericFontSizes,
	Spacing extends SpacingConfig,
	Radius extends SpacingConfig,
	TTextVariant extends TextVariant<K, S, T>,
	TButtonVariant extends ButtonVariant<K, T, S, TTextVariant, Spacing, Radius>,
>(
	config: Omit<CreateLBConfig<K, T, S, Spacing, Radius, TTextVariant, TButtonVariant>, "capsize">
): {
	light: ThemeType<T, K, S, Spacing, Radius, TTextVariant, TButtonVariant>;
	dark: ThemeType<T, K, S, Spacing, Radius, TTextVariant, TButtonVariant>;
} {
	const themeColors = {
		light: config.colors.light,
		dark: { ...config.colors.light, ...config.colors.dark } as T,
	};

	const fonts = Object.entries(config.typography.sizes).reduce(
		(prev, cur) => {
			// biome-ignore lint/complexity/noForEach: <explanation>
			Object.entries(config.typography.fonts).forEach(([fontKey, fontValue]) => {
				const [key, value] = cur;
				const { marginBottom, marginTop } = createTextSize({
					fontMetrics: fontValue,
					fontSize: PixelRatio.roundToNearestPixel(value.fontSize),
					lineHeight: PixelRatio.roundToNearestPixel(value.lineHeight),
				});
				prev[key as keyof S] = {
					...prev[key],
					[fontKey]: { marginTop, marginBottom },
				} as CapsizeCon<K>;
			});
			return prev;
		},
		{} as CapSizeConfig<S, K>
	);

	const lightTheme = { ...config, capsize: fonts, colors: themeColors.light };
	const darkTheme = { ...config, capsize: fonts, colors: themeColors.dark };

	return { light: lightTheme, dark: darkTheme };
}
