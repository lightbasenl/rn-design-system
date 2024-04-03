import type { TextProps as RNTextProps, TextStyle } from "react-native";
import { Platform, Text as RNText } from "react-native";
import { UITextView } from "react-native-uitextview";

import { useInternalTheme } from "../hooks/useInternalTheme";
import { getTextDecoration, weights } from "../theme/typography";
import { useStyle } from "../tools/useStyle";
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
		selectable,
		...rest
	} = combined;
	if (!size) {
		throw new Error("Font size has not been defined as a variant or prop");
	}
	const sizes = typography.sizes[size];
	if (!sizes) {
		throw new Error("Font size has not been defined as a variant or prop");
	}

	let customColor: string | undefined;
	if (typeof color === "object") {
		customColor = color.custom;
	}
	if (typeof color === "string") {
		customColor = colors[color];
	}

	const fontFamily = family as string;
	const textDecorationLine = getTextDecoration({ underline, strikeThrough });
	const capsizeAdjustments = capsize?.[size as string]?.[fontFamily];
	const marginTop = capsizeAdjustments?.marginTop;
	const marginBottom = capsizeAdjustments?.marginBottom;

	const fontWeight = weights[weight ?? "regular"];
	const fontStyle = italic ? "italic" : "normal";
	const fontSize = sizes.fontSize;
	const lineHeight = sizes.lineHeight;

	const styles = useStyle(() => {
		return [
			{
				textTransform,
				textDecorationLine,
				textAlign,
				color: customColor,
				flex,
				fontWeight,
				fontStyle,
				fontFamily,
				fontSize,
				lineHeight,
				marginTop,
				marginBottom,
			},
			style,
		] as TextStyle[];
	}, [
		textTransform,
		textDecorationLine,
		textAlign,
		customColor,
		flex,
		fontWeight,
		fontStyle,
		fontFamily,
		fontSize,
		lineHeight,
		marginTop,
		marginBottom,
		style,
	]);

	if (Platform.OS === "ios") {
		return (
			<UITextView uiTextView={selectable} selectable={selectable} style={styles} {...rest}>
				{children}
			</UITextView>
		);
	}
	return (
		<RNText style={styles} selectable={selectable} {...rest}>
			{children}
			{/* https://github.com/facebook/react-native/issues/29232#issuecomment-889767516 */}
			{Platform.OS === "android" && "lineHeight" in sizes && !!sizes.lineHeight && (
				<RNText style={{ lineHeight: sizes?.lineHeight + 0.001 }} />
			)}
		</RNText>
	);
}
