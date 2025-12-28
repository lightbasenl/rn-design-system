import type { ReactElement, ReactNode } from "react";
import { isValidElement } from "react";
import { type FlexAlignType, View } from "react-native";
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

const justifyContentValues = {
	center: "center",
	left: "flex-start",
	right: "flex-end",
	justify: "space-between",
	equal: "space-evenly",
} as const;

const alignItemsValues = {
	center: "center",
	left: "flex-start",
	right: "flex-end",
	stretch: "stretch",
} as const;

export const alignHorizontalToFlexAlign = {
	...justifyContentValues,
	stretch: "stretch",
} as const;

export const alignVerticalToFlexAlign = {
	top: "flex-start",
	center: "center",
	bottom: "flex-end",
} as const;

export type AlignHorizontal = keyof typeof alignHorizontalToFlexAlign;
export type AlignVertical = keyof typeof alignVerticalToFlexAlign;

type BaseStackProps = Omit<BoxProps, "justifyContent" | "alignItems"> & {
	children?: ReactNode;
	alignHorizontal?: AlignHorizontal;
	alignVertical?: AlignVertical;
	space?: Spacing;
	ref?: React.RefObject<View | null>;
};

export type VStackProps = BaseStackProps & {
	separator?: ReactElement;
};

export type HStackProps = BaseStackProps &
	({ separator?: undefined; wrap?: true } | { separator?: ReactElement; wrap?: false }) & {
		horizontalSpace?: Spacing;
		verticalSpace?: Spacing;
	};

type StackDirection = "horizontal" | "vertical";

type StackConfig<D extends StackDirection> = {
	direction: D;
	defaultAlignVertical?: AlignVertical;
};

type StackPropsForDirection<D extends StackDirection> = D extends "horizontal" ? HStackProps : VStackProps;

/**
 * Factory function to create VStack or HStack components.
 * @example
 * const VStack = createStack({ direction: "vertical" });
 * const HStack = createStack({ direction: "horizontal", defaultAlignVertical: "center" });
 */
export function createStack<D extends StackDirection>(config: StackConfig<D>) {
	const { direction, defaultAlignVertical } = config;
	const isHorizontal = direction === "horizontal";

	function Stack(props: StackPropsForDirection<D>) {
		const {
			children,
			style,
			backgroundColor,
			space,
			alignHorizontal,
			alignVertical = defaultAlignVertical,
			...rest
		} = props;

		const separator = "separator" in props ? props.separator : undefined;
		const wrap = isHorizontal && "wrap" in props ? props.wrap : undefined;
		const horizontalSpace = isHorizontal && "horizontalSpace" in props ? props.horizontalSpace : undefined;
		const verticalSpace = isHorizontal && "verticalSpace" in props ? props.verticalSpace : undefined;

		if (__DEV__ && separator && !isValidElement(separator)) {
			throw new Error("Stack: The 'separator' prop must be a React element");
		}

		const { boxProps, viewProps } = extractBoxTokens({ backgroundColor, ...rest });

		const styleProps = {
			...boxProps,
			space,
			alignHorizontal,
			alignVertical,
			wrap,
			horizontalSpace,
			verticalSpace,
			isHorizontal,
		};

		const renderedChildren = isValidElement(separator)
			? flattenChildren(intersperse(getValidChildren(children), separator))
			: children;

		if (!backgroundColor) {
			return (
				<View style={[styles.container(styleProps), style]} {...viewProps}>
					{renderedChildren}
				</View>
			);
		}

		return (
			<BackgroundContext.Provider value={backgroundColor}>
				<View style={[styles.container(styleProps), style]} {...viewProps}>
					{renderedChildren}
				</View>
			</BackgroundContext.Provider>
		);
	}

	return Stack;
}

type ContainerStyleProps = ReturnType<typeof extractBoxTokens>["boxProps"] & {
	space?: Spacing;
	alignHorizontal?: AlignHorizontal;
	alignVertical?: AlignVertical;
	wrap?: boolean;
	horizontalSpace?: Spacing;
	verticalSpace?: Spacing;
	isHorizontal: boolean;
};

const getJustifyContent = (
	isHorizontal: boolean,
	alignHorizontal?: AlignHorizontal,
	alignVertical?: AlignVertical
): "center" | "flex-start" | "flex-end" | "space-between" | "space-evenly" | undefined => {
	if (isHorizontal) {
		if (!alignHorizontal) return undefined;
		const value = justifyContentValues[alignHorizontal as keyof typeof justifyContentValues];
		return value;
	}
	return alignVertical ? alignVerticalToFlexAlign[alignVertical] : undefined;
};

const getAlignItems = (
	isHorizontal: boolean,
	wrap: boolean | undefined,
	alignHorizontal?: AlignHorizontal,
	alignVertical?: AlignVertical
): FlexAlignType | undefined => {
	if (isHorizontal) {
		return alignVertical && !wrap ? alignVerticalToFlexAlign[alignVertical] : undefined;
	}
	if (!alignHorizontal) return undefined;
	return alignItemsValues[alignHorizontal as keyof typeof alignItemsValues];
};

const styles = StyleSheet.create((theme, rt) => ({
	container: ({
		space,
		alignHorizontal,
		alignVertical,
		wrap,
		horizontalSpace,
		verticalSpace,
		isHorizontal,
		edges,
		...rest
	}: ContainerStyleProps) => {
		const { tokenStyles, paddingValues } = resolveBoxTokens(rest, theme);

		const rowGap = isHorizontal
			? verticalSpace || space
				? resolveSpace(verticalSpace ?? space, theme.spacing)
				: undefined
			: space
				? resolveSpace(space, theme.spacing)
				: undefined;

		const columnGap =
			isHorizontal && (horizontalSpace || space)
				? resolveSpace(horizontalSpace ?? space, theme.spacing)
				: undefined;

		return {
			...tokenStyles,
			...addInsetPadding({ paddingValues, edges, insets: rt.insets }),
			flexDirection: isHorizontal ? ("row" as const) : undefined,
			justifyContent: getJustifyContent(isHorizontal, alignHorizontal, alignVertical),
			alignItems: getAlignItems(isHorizontal, wrap, alignHorizontal, alignVertical),
			rowGap,
			columnGap,
			flexWrap: wrap ? ("wrap" as const) : undefined,
		};
	},
}));
