import { PixelRatio } from "react-native";

import { createTextSize } from "../theme/typography";
import type {
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
): CreateLBConfig<K, T, S, Spacing, Radius, TTextVariant, TButtonVariant> & {
	capsize: CapSizeConfig<S, K>;
} {
	const themeColors = {
		light: config.colors.light,
		dark: { ...config.colors.light, ...config.colors.dark } as T,
	};

	config.colors = themeColors;

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

	return { ...config, capsize: fonts };
}
