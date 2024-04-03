import type { ReactElement } from "react";
import { Fragment } from "react";

import { useInternalTheme } from "../hooks/useInternalTheme";
import { getValidChildren } from "../tools/getValidChildren";
import { useStyle } from "../tools/useStyle";
import type { Spacing } from "../types";
import type { BoxProps } from "./Box/Box";
import { Box } from "./Box/Box";

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

export type RowProps = Omit<BoxProps, "justifyContent" | "alignItems"> & {
	alignHorizontal?: AlignHorizontal;
	alignVertical?: AlignVertical;
	space?: Spacing;
	horizontalSpace?: Spacing;
	verticalSpace?: Spacing;
} & (
		| {
				separator?: undefined;
				wrap?: true;
		  }
		| {
				separator?: ReactElement;
				wrap?: false;
		  }
	);

/**
 * @description Arranges child nodes horizontally with equal spacing between
 * them, plus an optional `separator` element. Items can optionally be aligned
 * horizontally and/or vertically with `alignHorizontal` and `alignVertical`.
 */
export function Row({
	children,
	alignHorizontal,
	alignVertical = "center",
	space,
	horizontalSpace: horizontalSpaceProp,
	verticalSpace: verticalSpaceProp,
	wrap,
	separator,
	style,
	...rest
}: RowProps) {
	const validChildren = getValidChildren(children);

	const theme = useInternalTheme();

	const spaceMap = (value: Spacing) => {
		if (typeof value === "object") {
			return value.custom as number;
		}
		if (typeof value === "string") {
			if (theme.spacing[value] == null) {
				throw new Error(`Spacing value: ${value} is not included in the current theme configuration`);
			}
			return theme.spacing[value];
		}
		return undefined;
	};

	const verticalSpace = verticalSpaceProp ?? space;
	const horizontalSpace = horizontalSpaceProp ?? space;
	const rowGap = spaceMap(verticalSpace);
	const columnGap = spaceMap(horizontalSpace);
	const rowStyle = useStyle(() => ({ rowGap, columnGap }), [rowGap, columnGap]);

	return (
		<Box
			flexDirection="row"
			alignItems={alignVertical && !wrap ? alignVerticalToFlexAlign[alignVertical] : undefined}
			justifyContent={alignHorizontal ? alignHorizontalToFlexAlign[alignHorizontal] : undefined}
			flexWrap={wrap ? "wrap" : undefined}
			style={[rowStyle, style]}
			{...rest}
		>
			{validChildren.map((child, index) => {
				const key = typeof child.key !== "undefined" ? child.key : index;
				const isLast = index + 1 === validChildren.length;

				return (
					<Fragment key={`${key}fragment`}>
						{child}
						{!!separator && !isLast && <Box>{separator}</Box>}
					</Fragment>
				);
			})}
		</Box>
	);
}
