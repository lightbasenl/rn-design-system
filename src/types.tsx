// this is the "main" typed object, which users re-define
// (internal) keep all types directly on this object and reference them from elsewhere
//
// const theme = createTheme(...)
// type MyConfig = typeof theme
// declare module '@lightbase/rn-design-system' {
//   export interface LBCustomConfig extends MyConfig {}
// }
// now your whole app/kit should be typed correctly
//

import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { ReactElement, ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import type { SafeAreaViewProps } from "react-native-safe-area-context";

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface LBCustomConfig {}
export interface LBConfig extends Omit<GenericLBConfig, keyof LBCustomConfig>, LBCustomConfig {}

// CONFIG

export type CreateLBConfig<
	TMetrics extends FontMetrics,
	TColors extends LightColors,
	TFontSizes extends GenericFontSizes,
	TSpacing extends SpacingConfig,
	TRadius extends SpacingConfig,
	TTextVariant extends TextVariant<TMetrics, TFontSizes, TColors>,
	TButtonVariant extends ButtonVariant<TMetrics, TColors, TFontSizes, TTextVariant, TSpacing, TRadius>,
> = {
	typography: Typography<TMetrics, TFontSizes>;
	variants: Variants<TMetrics, TColors, TFontSizes, TTextVariant, TSpacing, TRadius, TButtonVariant>;
	colors: ThemeColors<TColors>;
	spacing: TSpacing;
	radius: TRadius;
	defaults: Defaults<TMetrics, TFontSizes, TColors, TSpacing, TTextVariant, TRadius>;
	capsize: CapSizeConfig<TFontSizes, TMetrics>;
};

export type GenericLBConfig = CreateLBConfig<
	FontMetrics,
	LightColors,
	GenericFontSizes,
	SpacingConfig,
	SpacingConfig,
	TextVariant<FontMetrics, GenericFontSizes, LightColors>,
	ButtonVariant<
		FontMetrics,
		LightColors,
		GenericFontSizes,
		TextVariant<FontMetrics, GenericFontSizes, LightColors>,
		SpacingConfig,
		SpacingConfig
	>
>;

export type CapSizeConfig<S extends GenericFontSizes, K extends FontMetrics> = {
	[sizeToken in keyof S]: CapsizeCon<K>;
};

export type CapsizeCon<K extends FontMetrics> = {
	[family in keyof K]: { marginTop?: number; marginBottom?: number };
};

export type FontVariant = keyof LBConfig["variants"]["Text"];
export type FontFamily = keyof LBConfig["typography"]["fonts"];
export type FontSizes = keyof LBConfig["typography"]["sizes"];
export type FontWeights =
	| "thin"
	| "extraLight"
	| "light"
	| "regular"
	| "medium"
	| "semiBold"
	| "bold"
	| "extraBold"
	| "black"
	| "100"
	| "200"
	| "300"
	| "400"
	| "500"
	| "600"
	| "700"
	| "800"
	| "900";

export type ColorConfig = LBConfig["colors"]["light"];
export type ColorThemeKeys = keyof ColorConfig | { custom: string };

export type SpaceKey = keyof LBConfig["spacing"];
export type Spacing = SpaceKey | { custom: ViewStyle["margin"] } | undefined;
export type NegativeSpace = `-${SpaceKey}` | { custom: ViewStyle["margin"] } | undefined;
export type Radius = keyof LBConfig["radius"] | { custom: number };

export type DefaultButton = LBConfig["defaults"]["Button"];

export type FontMetric = {
	capHeight: number;
	unitsPerEm: number;
	descent: number;
	ascent: number;
	lineGap: number;
};

export type MarginValues = {
	margin?: NegativeSpace;
	marginBottom?: NegativeSpace;
	marginHorizontal?: NegativeSpace;
	marginLeft?: NegativeSpace;
	marginRight?: NegativeSpace;
	marginTop?: NegativeSpace;
	marginVertical?: NegativeSpace;
};
export type ColorValues = {
	backgroundColor?: ColorThemeKeys;
	borderBottomColor?: ColorThemeKeys;
	borderColor?: ColorThemeKeys;
	borderLeftColor?: ColorThemeKeys;
	borderRightColor?: ColorThemeKeys;
	borderTopColor?: ColorThemeKeys;
};
export type BorderRadiusValues = {
	borderBottomLeftRadius?: Radius;
	borderBottomRadius?: Radius;
	borderBottomRightRadius?: Radius;
	borderLeftRadius?: Radius;
	borderRadius?: Radius;
	borderRightRadius?: Radius;
	borderTopLeftRadius?: Radius;
	borderTopRadius?: Radius;
	borderTopRightRadius?: Radius;
};
export type PaddingValues = {
	padding?: Spacing;
	paddingBottom?: Spacing;
	paddingHorizontal?: Spacing;
	paddingLeft?: Spacing;
	paddingRight?: Spacing;
	paddingTop?: Spacing;
	paddingVertical?: Spacing;
};
export type BorderValues = {
	borderBottomWidth?: number;
	borderLeftWidth?: number;
	borderRightWidth?: number;
	borderTopWidth?: number;
	borderWidth?: number;
};

export type AlignmentValues = {
	flex?: number;
	alignItems?: ViewStyle["alignItems"];
	alignSelf?: ViewStyle["alignSelf"];
	flexDirection?: ViewStyle["flexDirection"];
	flexWrap?: ViewStyle["flexWrap"];
	justifyContent?: ViewStyle["justifyContent"];
};

export type SpacingStyles = PaddingStyles | MarginStyles;

export type ColorStyles =
	| "backgroundColor"
	| "borderBottomColor"
	| "borderColor"
	| "borderLeftColor"
	| "borderRightColor"
	| "borderTopColor";

export type RadiusStyles =
	| "borderBottomLeftRadius"
	| "borderBottomRadius"
	| "borderBottomRightRadius"
	| "borderLeftRadius"
	| "borderRadius"
	| "borderRightRadius"
	| "borderTopLeftRadius"
	| "borderTopRadius"
	| "borderTopRightRadius";

export type PaddingStyles =
	| "padding"
	| "paddingBottom"
	| "paddingHorizontal"
	| "paddingLeft"
	| "paddingRight"
	| "paddingTop"
	| "paddingVertical";

export type MarginStyles =
	| "margin"
	| "marginBottom"
	| "marginHorizontal"
	| "marginLeft"
	| "marginRight"
	| "marginTop"
	| "marginVertical";

export type BorderStyles =
	| "borderBottomColor"
	| "borderBottomWidth"
	| "borderColor"
	| "borderLeftColor"
	| "borderLeftWidth"
	| "borderRightColor"
	| "borderRightWidth"
	| "borderTopColor"
	| "borderTopWidth";

// Private types
export type ButtonVariants = "solid" | "soft" | "outline" | "link" | "icon" | "unstyled" | "ghost";
export type LightColors = { [colorToken: string]: string };
export type ThemeColors<T extends LightColors> = { light: T; dark: Partial<T> };
export type CustomColor<T extends LightColors> = keyof T | { custom: string };
export type GenericFontSizes = { [sizeToken: string]: { fontSize: number; lineHeight: number } };
export type FontMetrics = { [family: string]: FontMetric | null };
export type SpacingConfig = { [sizeToken: string]: number };
export type TextVariant<
	TMetrics extends FontMetrics,
	TFontSizes extends GenericFontSizes,
	TColors extends LightColors,
> = {
	[variant: string]: {
		family: keyof TMetrics;
		weight: FontWeights;
		size: keyof TFontSizes;
		color: CustomColor<TColors>;
	};
};

export type ButtonVariant<
	TMetrics extends FontMetrics,
	TColors extends LightColors,
	TFontSizes extends GenericFontSizes,
	TTextVariant extends TextVariant<TMetrics, TFontSizes, TColors>,
	TSpacing extends SpacingConfig,
	TRadius extends SpacingConfig,
> = {
	[variant in ButtonVariants]: {
		backgroundColor?: CustomColor<TColors>;
		borderColor?: CustomColor<TColors>;
		textColor?: CustomColor<TColors>;
		onPressBorderColor?: CustomColor<TColors>;
		onPressColor?: CustomColor<TColors>;
		textVariant?: keyof TTextVariant;
		onPressAnimatedScale?: number;
		height?: number;
		width?: number;
		borderWidth?: number;
		borderRadius?: keyof TRadius;
		paddingHorizontal?: keyof TSpacing;
		paddingLeft?: keyof TSpacing;
		paddingRight?: keyof TSpacing;
		padding?: keyof TSpacing;
		paddingVertical?: keyof TSpacing;
		paddingBottom?: keyof TSpacing;
		paddingTop?: keyof TSpacing;
	};
};

export type Typography<TMetrics extends FontMetrics, TFontSizes extends GenericFontSizes> = {
	fonts: TMetrics;
	sizes: TFontSizes;
};

export type Variants<
	TMetrics extends FontMetrics,
	TColors extends LightColors,
	TFontSizes extends GenericFontSizes,
	TTextVariant extends TextVariant<TMetrics, TFontSizes, TColors>,
	TSpacing extends SpacingConfig,
	TRadius extends SpacingConfig,
	TButtonVariant extends ButtonVariant<TMetrics, TColors, TFontSizes, TTextVariant, TSpacing, TRadius>,
> = {
	Text: TTextVariant;
	Button: Partial<TButtonVariant>;
};

export type Defaults<
	TMetrics extends FontMetrics,
	TFontSizes extends GenericFontSizes,
	TColors extends LightColors,
	TSpacing extends SpacingConfig,
	TTextVariant extends TextVariant<TMetrics, TFontSizes, TColors>,
	TRadius extends SpacingConfig,
> = {
	Text:
		| {
				variant: keyof TTextVariant;
				family?: never;
				weight?: never;
				size?: never;
				color?: never;
		  }
		| {
				variant?: never;
				family: keyof TMetrics;
				weight?: FontWeights;
				size?: keyof TFontSizes;
				color?: CustomColor<TColors>;
		  };
	Button: {
		themeColor: CustomColor<TColors>;
		variant?: ButtonVariants;
		textColor?: CustomColor<TColors>;
		onPressBorderColor?: CustomColor<TColors>;
		onPressColor?: CustomColor<TColors>;
		textVariant?: keyof TTextVariant;
		onPressAnimatedScale?: number;
		height?: number;
		width?: number;
		borderWidth?: number;
		borderRadius?: keyof TRadius;
		paddingHorizontal?: keyof TSpacing;
		paddingLeft?: keyof TSpacing;
		paddingRight?: keyof TSpacing;
		padding?: keyof TSpacing;
		paddingVertical?: keyof TSpacing;
		paddingBottom?: keyof TSpacing;
		paddingTop?: keyof TSpacing;
	};
	Screen: {
		backgroundColor?: keyof TColors;
		paddingHorizontal?: keyof TSpacing;
		paddingLeft?: keyof TSpacing;
		paddingRight?: keyof TSpacing;
		padding?: keyof TSpacing;
		paddingVertical?: keyof TSpacing;
		paddingBottom?: keyof TSpacing;
		paddingTop?: keyof TSpacing;
		backgroundComponent?: ReactElement;
		absolutePositionedTabBar?: boolean;
		edges?: ("top" | "bottom")[];
		options?: NativeStackNavigationOptions;
		mode?: SafeAreaViewProps["mode"];
	};
};

type BoxStyleTokens = SpacingStyles | RadiusStyles | ColorStyles | "shadow";
type ViewStyleModded = StyleProp<Omit<ViewStyle, BoxStyleTokens>>;

export type BoxTokens = {
	style?: ViewStyleModded;
	children?: ReactNode;
	testID?: string;
	width?: ViewStyle["width"];
	height?: ViewStyle["height"];
} & MarginValues &
	ColorValues &
	BorderRadiusValues &
	PaddingValues &
	BorderValues &
	AlignmentValues;

export type BoxProps = BoxTokens & Omit<ViewProps, "style">;

export type RemoveStyles<T> = Omit<T, "contentContainerStyle" | "style">;
export type FilterStyles<T> = StyleProp<
	Omit<T, MarginStyles | PaddingStyles | RadiusStyles | "backgroundColor">
>;

export type ScrollableBoxProps = Pick<
	BoxProps,
	"flex" | "backgroundColor" | RadiusStyles | PaddingStyles | MarginStyles
>;
