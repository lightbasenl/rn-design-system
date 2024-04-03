import type { ReactElement, ReactNode } from "react";
import { Fragment, isValidElement, useMemo } from "react";

import { useInternalTheme } from "../hooks/useInternalTheme";
import { getValidChildren } from "../tools/getValidChildren";
import type { Spacing } from "../types";
import type { BoxProps } from "./Box/Box";
import { Box } from "./Box/Box";

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

export type StackProps = {
	children: ReactNode;
	alignHorizontal?: AlignHorizontal;
	alignVertical?: AlignVertical;
	space?: Spacing;
	separator?: ReactElement;
} & Omit<BoxProps, "justifyContent" | "alignItems">;

/**
 * @description Arranges child nodes vertically with equal spacing between
 * them, plus an optional `separator` element. Items can optionally be aligned
 * horizontally and/or vertically.
 */
export function Stack({
	children,
	alignHorizontal,
	alignVertical,
	separator,
	space,
	style,
	...rest
}: StackProps) {
	if (__DEV__ && separator && !isValidElement(separator)) {
		throw new Error(`Stack: The 'separator' prop must be a React element`);
	}
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

	const validChildren = getValidChildren(children);
	const rowGap = spaceMap(space);

	const gapStyles = useMemo(() => ({ rowGap }), [rowGap]);

	const clones = validChildren.map((child, index) => {
		const key = typeof child.key !== "undefined" ? child.key : index;
		const isLast = index + 1 === validChildren.length;

		return (
			<Fragment key={`${key}fragment`}>
				{child}
				{!!separator && !isLast && (
					<Box
						alignItems={alignHorizontal ? alignHorizontalToFlexAlign[alignHorizontal] : undefined}
						width="100%"
					>
						{separator}
					</Box>
				)}
			</Fragment>
		);
	});

	return (
		<Box
			alignItems={alignHorizontal ? alignHorizontalToFlexAlign[alignHorizontal] : undefined}
			justifyContent={alignVertical ? alignVerticalToFlexAlign[alignVertical] : undefined}
			style={[gapStyles, style]}
			{...rest}
		>
			{clones}
		</Box>
	);
}
