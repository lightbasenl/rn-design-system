import { precomputeValues } from "@capsizecss/core";
import type { TextStyle } from "react-native";
import { PixelRatio } from "react-native";

import type { FontMetric, FontWeights } from "../types";

const capsize = (options: Parameters<typeof precomputeValues>[0]) => {
	const values = precomputeValues(options);
	const fontSize = Number.parseFloat(values.fontSize);
	const baselineTrimEm = Number.parseFloat(values.baselineTrim);
	const capHeightTrimEm = Number.parseFloat(values.capHeightTrim);
	const fontScale = PixelRatio.getFontScale();

	return {
		fontSize,
		lineHeight: values.lineHeight !== "normal" ? Number.parseFloat(values.lineHeight) : undefined,
		marginBottom: baselineTrimEm * fontSize * fontScale,
		marginTop: capHeightTrimEm * fontSize * fontScale,
	} as const;
};

type CreateTextSizeProps = {
	fontMetrics: FontMetric | null | undefined;
	fontSize: number;
	lineHeight: number;
};
export const createTextSize = ({ fontMetrics, fontSize, lineHeight: leading }: CreateTextSizeProps) => {
	if (!fontMetrics) {
		return { fontSize, lineHeight: leading, marginTop: 0, marginBottom: 0 };
	}
	const sizes = capsize({ fontMetrics, fontSize, leading });

	return {
		fontSize: PixelRatio.roundToNearestPixel(sizes.fontSize),
		lineHeight: PixelRatio.roundToNearestPixel(sizes.lineHeight ?? sizes.fontSize),
		marginTop: PixelRatio.roundToNearestPixel(sizes.marginTop),
		marginBottom: PixelRatio.roundToNearestPixel(sizes.marginBottom),
	} as const;
};

export const weights: { [T in FontWeights]: TextStyle["fontWeight"] } = {
	thin: "100",
	extraLight: "200",
	light: "300",
	regular: "400",
	medium: "500",
	semiBold: "600",
	bold: "700",
	extraBold: "800",
	black: "900",
	"100": "100",
	"200": "200",
	"300": "300",
	"400": "400",
	"500": "500",
	"600": "600",
	"700": "700",
	"800": "800",
	"900": "900",
};

export function getTextDecoration({
	underline,
	strikeThrough,
}: {
	strikeThrough?: boolean;
	underline?: boolean;
}) {
	let textDecorationLine = "none" as TextStyle["textDecorationLine"];
	if (underline && strikeThrough) {
		textDecorationLine = "underline line-through";
	} else if (underline) {
		textDecorationLine = "underline";
	} else if (strikeThrough) {
		textDecorationLine = "line-through";
	}
	return textDecorationLine;
}
