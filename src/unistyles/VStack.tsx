import type { ReactElement, ReactNode } from "react";
import { isValidElement } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import type { BoxProps, Spacing } from "../types";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import {
	addInsetPadding,
	extractBoxTokens,
	flattenChildren,
	getValidChildren,
	intersperse,
	resolveSpace,
} from "./utils";

const alignHorizontalToFlexAlign = {
	center: "center",
	left: "flex-start",
	right: "flex-end",
	stretch: "stretch",
} as const;
type AlignHorizontal = keyof typeof alignHorizontalToFlexAlign;

const alignVerticalToFlexAlign = {
	bottom: "flex-end",
	center: "center",
	top: "flex-start",
} as const;

type AlignVertical = keyof typeof alignVerticalToFlexAlign;

export type VStackProps = Omit<BoxProps, "justifyContent" | "alignItems"> & {
	children?: ReactNode;
	alignHorizontal?: AlignHorizontal;
	alignVertical?: AlignVertical;
	space?: Spacing;
	separator?: ReactElement;
} & {
	ref?: React.RefObject<View | null>;
};

/**
 * @description Arranges child nodes vertically with equal spacing between
 * them, plus an optional `separator` element. Items can optionally be aligned
 * horizontally and/or vertically.
 */
export function VStack({
	children,
	separator,
	style,
	backgroundColor,
	space,
	alignHorizontal,
	alignVertical,
	...rest
}: VStackProps & Omit<BoxProps, "justifyContent" | "alignItems">) {
	if (__DEV__ && separator && !isValidElement(separator)) {
		throw new Error(`Stack: The 'separator' prop must be a React element`);
	}
	const { viewProps, boxProps } = extractBoxTokens({ backgroundColor, ...rest });

	if (!backgroundColor) {
		return (
			<View
				style={[styles.container({ ...boxProps, space, alignHorizontal, alignVertical }), style]}
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
				style={[styles.container({ ...boxProps, space, alignHorizontal, alignVertical }), style]}
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
		edges,
		...rest
	}: ReturnType<typeof extractBoxTokens>["boxProps"] & Omit<VStackProps, "children" | "separator">) => {
		const { tokenStyles, paddingValues } = resolveBoxTokens(rest, theme);
		return {
			...tokenStyles,
			...addInsetPadding({ paddingValues, edges, insets: rt.insets }),
			alignItems: alignHorizontal ? alignHorizontalToFlexAlign[alignHorizontal] : undefined,
			justifyContent: alignVertical ? alignVerticalToFlexAlign[alignVertical] : undefined,
			rowGap: space ? resolveSpace(space, theme.spacing) : undefined,
		};
	},
}));

/** @deprecated Use VStack instead */
export const AnimatedBox = Animated.createAnimatedComponent(VStack);

/** @deprecated Use VStack instead */
export const Box = VStack;

/** @deprecated Use VStack instead */
export const SafeAreaBox = VStack;

/** @deprecated Use VStack instead */
export const Stack = VStack;
