import type React from "react";
import { Children, type ReactNode, cloneElement, isValidElement } from "react";
import type { TextStyle, ViewProps } from "react-native";
import type { UnistylesThemes } from "react-native-unistyles";
import type { BoxTokens, ColorThemeKeys, FontWeights, Spacing } from "../types";

export function isFragment(value: any): value is React.ReactElement<{ children: ReactNode } | null>;
export function isFragment(object: any): boolean {
	if (typeof object === "object" && object !== null) {
		if (object.type === Symbol.for("react.fragment")) {
			return true;
		}
	}
	return false;
}

/**
 * Gets only the valid children of a component,
 * and ignores any nullish or falsy child.
 *
 * @param children the children
 */
export function getValidChildren(children: ReactNode) {
	return Children.toArray(flattenChildren(children)).filter((child) =>
		isValidElement(child)
	) as React.ReactElement<any>[];
}

export function flattenChildren(children: ReactNode, depth = 0, keys: (string | number)[] = []): ReactNode[] {
	return Children.toArray(children).reduce((acc: ReactNode[], node, nodeIndex) => {
		if (isFragment(node)) {
			acc.push.apply(
				acc,
				flattenChildren(node.props?.children, depth + 1, keys.concat(node.key || nodeIndex))
			);
		} else {
			if (isValidElement(node)) {
				acc.push(
					cloneElement(node, {
						key: keys.concat(String(node.key)).join("."),
					})
				);
			} else if (typeof node === "string" || typeof node === "number") {
				acc.push(node);
			}
		}
		return acc;
	}, []);
}

const reduceWithIndex = <A, B>(
	arr: readonly A[],
	initialValue: B,
	fn: (acc: B, element: A, index: number) => B
): B => {
	let e = initialValue;

	for (let t = 0, v = arr.length; t < v; ++t) {
		// @ts-ignore
		e = fn(e, arr[t], t);
	}

	return e;
};

export function intersperse<A>(arr: readonly A[], delimiter: A) {
	// eslint-disable-next-line functional/prefer-readonly-type
	return reduceWithIndex(arr, [] as A[], (acc, element, index) => {
		if (((arr.length - 1) | 0) === index) {
			acc.push(element);
		} else {
			acc.push(element, delimiter);
		}
		return acc;
	});
}

export const resolveSpace = (space: Spacing, spacing: UnistylesThemes[keyof UnistylesThemes]["spacing"]) => {
	if (typeof space === "object") {
		return space.custom as number;
	}
	if (typeof space === "string") {
		if (spacing[space] == null) {
			throw new Error(`Spacing value: ${space} is not included in the current theme configuration`);
		}
		return spacing[space];
	}
	throw new Error(`Spacing value: ${space} is not included in the current theme configuration`);
};

export const resolveColor = (
	color: ColorThemeKeys | undefined,
	themeColors: UnistylesThemes[keyof UnistylesThemes]["colors"]
) => {
	if (typeof color === "object") {
		return color.custom;
	}
	if (typeof color === "string") {
		if (themeColors[color] == null) {
			throw new Error(`color value: ${color} is not included in the current theme configuration`);
		}
		return themeColors[color];
	}
	throw new Error(`color value: ${color} is not included in the current theme configuration`);
};

export const WEIGHTS: { [T in FontWeights]: TextStyle["fontWeight"] } = {
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

export function extractBoxTokens<T = ViewProps>(props: BoxTokens & T) {
	const {
		backgroundColor,
		borderBottomColor,
		borderBottomLeftRadius,
		borderBottomRadius,
		borderBottomRightRadius,
		borderBottomWidth,
		borderColor,
		borderLeftColor,
		borderLeftRadius,
		borderLeftWidth,
		borderRadius,
		borderRightColor,
		borderRightRadius,
		borderRightWidth,
		borderTopColor,
		borderTopLeftRadius,
		borderTopRadius,
		borderTopRightRadius,
		borderTopWidth,
		borderWidth,

		flex,
		alignItems,
		alignSelf,
		flexDirection,
		flexWrap,
		justifyContent,

		padding,
		paddingBottom,
		paddingHorizontal,
		paddingLeft,
		paddingRight,
		paddingTop,
		paddingVertical,

		margin,
		marginBottom,
		marginHorizontal,
		marginLeft,
		marginRight,
		marginTop,
		marginVertical,

		width,
		height,
		edges,

		...remainingProps
	} = props;

	return {
		boxProps: {
			backgroundColor,
			borderBottomColor,
			borderBottomLeftRadius,
			borderBottomRadius,
			borderBottomRightRadius,
			borderBottomWidth,
			borderColor,
			borderLeftColor,
			borderLeftRadius,
			borderLeftWidth,
			borderRadius,
			borderRightColor,
			borderRightRadius,
			borderRightWidth,
			borderTopColor,
			borderTopLeftRadius,
			borderTopRadius,
			borderTopRightRadius,
			borderTopWidth,
			borderWidth,

			flex,
			alignItems,
			alignSelf,
			flexDirection,
			flexWrap,
			justifyContent,

			padding,
			paddingBottom,
			paddingHorizontal,
			paddingLeft,
			paddingRight,
			paddingTop,
			paddingVertical,

			margin,
			marginBottom,
			marginHorizontal,
			marginLeft,
			marginRight,
			marginTop,
			marginVertical,

			width,
			height,
			edges,
		},
		viewProps: remainingProps,
	};
}

export const addInsetPadding = ({
	paddingValues,
	edges,
	insets,
}: {
	paddingValues: {
		paddingTop?: number;
		paddingBottom?: number;
		paddingLeft?: number;
		paddingRight?: number;
		paddingVertical?: number;
		paddingHorizontal?: number;
		padding?: number;
	};
	edges: BoxTokens["edges"];
	insets: { top: number; bottom: number; left: number; right: number };
}) => {
	const top = paddingValues.paddingTop ?? paddingValues.paddingVertical ?? paddingValues.padding ?? 0;
	const bottom = paddingValues.paddingBottom ?? paddingValues.paddingVertical ?? paddingValues.padding ?? 0;
	const left = paddingValues.paddingLeft ?? paddingValues.paddingHorizontal ?? paddingValues.padding ?? 0;
	const right = paddingValues.paddingRight ?? paddingValues.paddingHorizontal ?? paddingValues.padding ?? 0;
	return {
		paddingTop: edges?.includes("top") ? top + insets.top : top,
		paddingBottom: edges?.includes("bottom") ? bottom + insets.bottom : bottom,
		paddingLeft: edges?.includes("left") ? left + insets.left : left,
		paddingRight: edges?.includes("right") ? right + insets.right : right,
	};
};
