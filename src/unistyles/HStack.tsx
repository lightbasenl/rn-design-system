import {
	type AlignHorizontal,
	type AlignVertical,
	alignHorizontalToFlexAlign,
	alignVerticalToFlexAlign,
	createStack,
	type HStackProps,
} from "./createStack";

export type { AlignHorizontal, AlignVertical, HStackProps };
export { alignHorizontalToFlexAlign, alignVerticalToFlexAlign };

export type RowPropAlignments = {
	alignHorizontal?: AlignHorizontal;
	alignVertical?: AlignVertical;
	space?: HStackProps["space"];
	horizontalSpace?: HStackProps["space"];
	verticalSpace?: HStackProps["space"];
};

export const HStack = createStack({ direction: "horizontal", defaultAlignVertical: "center" });
