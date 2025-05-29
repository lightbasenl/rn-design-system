import type { ReactElement } from "react";
import { isValidElement } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import type { BoxProps } from "../types";
import type { Spacing } from "../types";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { extractBoxTokens, flattenChildren, getValidChildren, intersperse, resolveSpace } from "./utils";

export const alignHorizontalToFlexAlign = {
	center: "center",
	justify: "space-between",
	equal: "space-evenly",
	left: "flex-start",
	right: "flex-end",
} as const;
type AlignHorizontal = keyof typeof alignHorizontalToFlexAlign;

export const alignVerticalToFlexAlign = {
	bottom: "flex-end",
	center: "center",
	top: "flex-start",
} as const;
type AlignVertical = keyof typeof alignVerticalToFlexAlign;

export type RowPropAlignments = {
	alignHorizontal?: AlignHorizontal;
	alignVertical?: AlignVertical;
	space?: Spacing;
	horizontalSpace?: Spacing;
	verticalSpace?: Spacing;
};
export type HStackProps = Omit<BoxProps, "justifyContent" | "alignItems"> &
	RowPropAlignments &
	({ separator?: undefined; wrap?: true } | { separator?: ReactElement<any>; wrap?: false }) & {
		ref?: React.RefObject<View | null>;
	};

/**
 * @description Arranges child nodes horizontally with equal spacing between
 * them, plus an optional `separator` element. Items can optionally be aligned
 * horizontally and/or vertically with `alignHorizontal` and `alignVertical`.
 */
export function HStack({
	children,
	separator,
	style,
	space,
	alignHorizontal,
	alignVertical = "center",
	horizontalSpace,
	verticalSpace,
	backgroundColor,
	wrap,
	...rest
}: HStackProps) {
	const { boxProps, viewProps } = extractBoxTokens({ backgroundColor, ...rest });

	if (!backgroundColor) {
		return (
			<View
				style={[
					styles.container({
						...boxProps,
						space,
						alignHorizontal,
						alignVertical,
						horizontalSpace,
						verticalSpace,
						wrap,
					}),
					style,
				]}
				{...viewProps}
			>
				{isValidElement(separator)
					? flattenChildren(intersperse(getValidChildren(children), separator))
					: children}
			</View>
		);
	}
	return (
		<BackgroundContext.Provider value={backgroundColor}>
			<View
				style={[
					styles.container({
						...boxProps,
						space,
						alignHorizontal,
						alignVertical,
						horizontalSpace,
						verticalSpace,
						wrap,
					}),
					style,
				]}
				{...viewProps}
			>
				{isValidElement(separator)
					? flattenChildren(intersperse(getValidChildren(children), separator))
					: children}
			</View>
		</BackgroundContext.Provider>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	container: ({
		space,
		alignHorizontal,
		alignVertical,
		horizontalSpace,
		verticalSpace,
		wrap,
		edges,
		...rest
	}: ReturnType<typeof extractBoxTokens>["boxProps"] & RowPropAlignments & { wrap?: boolean }) => {
		const { tokenStyles, paddingValues } = resolveBoxTokens(rest, theme);

		return {
			...tokenStyles,
			...paddingValues,
			paddingTop: edges?.includes("top")
				? (paddingValues.paddingTop ?? 0) + rt.insets.top
				: paddingValues.paddingTop,
			paddingBottom: edges?.includes("bottom")
				? (paddingValues.paddingBottom ?? 0) + rt.insets.bottom
				: paddingValues.paddingBottom,
			paddingLeft: edges?.includes("left")
				? (paddingValues.paddingLeft ?? 0) + rt.insets.left
				: paddingValues.paddingLeft,
			paddingRight: edges?.includes("right")
				? (paddingValues.paddingRight ?? 0) + rt.insets.right
				: paddingValues.paddingRight,
			flexDirection: "row",
			justifyContent: alignHorizontal ? alignHorizontalToFlexAlign[alignHorizontal] : undefined,
			alignItems: alignVertical && !wrap ? alignVerticalToFlexAlign[alignVertical] : undefined,
			rowGap: verticalSpace || space ? resolveSpace(verticalSpace ?? space, theme.spacing) : undefined,
			columnGap: horizontalSpace || space ? resolveSpace(horizontalSpace ?? space, theme.spacing) : undefined,
			flexWrap: wrap ? "wrap" : undefined,
		};
	},
}));

/** @deprecated Use HStack instead */
export const Row = HStack;
