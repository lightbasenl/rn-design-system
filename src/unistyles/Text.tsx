import type { TextProps as RNTextProps, TextStyle } from "react-native";
import { Text as RNText } from "react-native";

import { StyleSheet } from "react-native-unistyles";
import type { ColorThemeKeys, FontFamily, FontSizes, FontVariant, FontWeights } from "../types";
import { getTextDecoration, resolveColor, WEIGHTS } from "./utils";

type CustomTextProps = {
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
	fontScale?: number;
};
export type TextProps = RNTextProps & CustomTextProps;

export function Text({ selectable, style, children, ...props }: TextProps) {
	const {
		underline,
		strikeThrough,
		color,
		size,
		weight,
		family,
		italic,
		textTransform,
		textAlign,
		flex,
		variant,
		fontScale,
		...textProps
	} = props;

	const extractedStyles = {
		underline,
		strikeThrough,
		color,
		size,
		weight,
		family,
		italic,
		textTransform,
		textAlign,
		flex,
		variant,
		fontScale,
	};

	return (
		<RNText style={[styles.container(extractedStyles), style]} selectable={selectable} {...textProps}>
			{children}
		</RNText>
	);
}
const styles = StyleSheet.create((theme) => ({
	container: ({
		variant,
		underline,
		strikeThrough,
		color,
		size,
		weight,
		family,
		italic,
		textTransform,
		textAlign,
		flex,
		fontScale = 1,
	}: CustomTextProps) => {
		const variantKey = variant ?? theme.defaults.Text.variant;

		const variantType = variantKey ? theme.variants.Text[variantKey] : null;
		const themedSize = size ?? variantType?.size ?? theme.defaults.Text.size;
		const fontFamily = family ?? variantType?.family ?? theme.defaults.Text.family;
		const variantWeight = weight ?? variantType?.weight ?? theme.defaults.Text.weight;
		const variantColor = color ?? variantType?.color ?? theme.defaults.Text.color;

		const fontWeight = variantWeight ? WEIGHTS[variantWeight] : undefined;
		const fontStyle = italic ? "italic" : "normal";
		const fontSize = themedSize ? theme.typography.sizes[themedSize]?.fontSize : undefined;
		const lineHeight = themedSize ? theme.typography.sizes[themedSize]?.lineHeight : undefined;

		const capsizeAdjustments = fontFamily && themedSize ? theme.capsize?.[themedSize]?.[fontFamily] : {};
		const marginTop = capsizeAdjustments?.marginTop;
		const marginBottom = capsizeAdjustments?.marginBottom;

		return {
			marginTop,
			marginBottom,
			fontWeight,
			fontStyle,
			fontSize: fontSize ? fontSize * fontScale : fontSize,
			lineHeight: lineHeight ? lineHeight * fontScale : lineHeight,
			textDecorationLine: getTextDecoration({ underline, strikeThrough }),
			color: resolveColor(variantColor, theme.colors),
			fontFamily: fontFamily as string,
			textTransform,
			textAlign,
			flex,
		};
	},
}));
