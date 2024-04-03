import type { StyleProp } from "react-native";

import { useInternalTheme } from "../hooks/useInternalTheme";
import type { BoxProps } from "../primitives/Box/Box";
import { mapMarginValue, mapPaddingValues, mapValues } from "../tools/mapValues";
import type { MarginStyles, PaddingStyles, RadiusStyles } from "../types";

export type RemoveStyles<T> = Omit<T, "contentContainerStyle" | "style">;
export type FilterStyles<T> = StyleProp<
	Omit<T, MarginStyles | PaddingStyles | RadiusStyles | "backgroundColor">
>;

export type ScrollableBoxProps = Pick<
	BoxProps,
	"flex" | "backgroundColor" | RadiusStyles | PaddingStyles | MarginStyles
>;

export function useResolveBoxListTokens<T extends ScrollableBoxProps>(props: T) {
	const {
		flex,
		backgroundColor,

		borderTopLeftRadius,
		borderBottomLeftRadius,
		borderBottomRadius,
		borderBottomRightRadius,
		borderLeftRadius,
		borderRadius,
		borderRightRadius,
		borderTopRadius,
		borderTopRightRadius,

		padding,
		paddingBottom,
		paddingHorizontal,
		paddingLeft,
		paddingRight,
		paddingTop,
		paddingVertical,

		// margins
		margin,
		marginBottom,
		marginHorizontal,
		marginLeft,
		marginRight,
		marginTop,
		marginVertical,
		...rest
	} = props;

	const theme = useInternalTheme();
	const paddingValues = mapPaddingValues(
		{
			padding,
			paddingBottom,
			paddingHorizontal,
			paddingLeft,
			paddingRight,
			paddingTop,
			paddingVertical,
		},
		theme.spacing
	);

	const marginValues = mapMarginValue(
		{
			margin,
			marginBottom,
			marginHorizontal,
			marginLeft,
			marginRight,
			marginTop,
			marginVertical,
		},
		theme.spacing
	);

	const colorValues = mapValues({ backgroundColor }, (value) => {
		if (typeof value === "object") {
			return value.custom;
		}
		if (typeof value === "string") {
			return theme.colors[value];
		}
		return undefined;
	});

	const borderRadiusValues = mapValues(
		{
			borderBottomLeftRadius:
				borderBottomLeftRadius ?? borderBottomRadius ?? borderLeftRadius ?? borderRadius,
			borderBottomRightRadius:
				borderBottomRightRadius ?? borderBottomRadius ?? borderRightRadius ?? borderRadius,
			borderTopLeftRadius: borderTopLeftRadius ?? borderTopRadius ?? borderLeftRadius ?? borderRadius,
			borderTopRightRadius: borderTopRightRadius ?? borderTopRadius ?? borderRightRadius ?? borderRadius,
		},
		(value) => {
			if (typeof value === "object") {
				return value.custom;
			}
			if (typeof value === "string") {
				return theme.radius[value];
			}
			return undefined;
		}
	);

	const contentContainerStyles = { flexGrow: flex, ...paddingValues };
	const styles = { flex, ...borderRadiusValues, ...colorValues, ...marginValues };

	return { contentContainerStyles, styles, ...rest };
}
