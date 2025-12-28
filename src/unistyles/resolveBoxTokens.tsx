import type { ViewProps } from "react-native";

import type { UnistylesThemes } from "react-native-unistyles";
import type { BoxTokens, MarginValues, PaddingValues, SpaceKey } from "../types";

export function resolveBoxTokens<T = ViewProps>(
	props: BoxTokens & T,
	theme: UnistylesThemes[keyof UnistylesThemes]
) {
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

		boxShadow,

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
		...remainingProps
	} = props;

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

	const colorValues = mapValues(
		{
			borderColor,
			borderBottomColor,
			borderLeftColor,
			borderRightColor,
			borderTopColor,
			backgroundColor,
		},
		(value) => {
			if (typeof value === "object") {
				return value.custom;
			}
			if (typeof value === "string") {
				return theme.colors[value];
			}
			return undefined;
		}
	);

	const shadowValues = mapValues({ boxShadow }, (value) => {
		if (typeof value === "object") {
			return value.custom;
		}
		if (typeof value === "string") {
			return theme.shadows[value];
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
			borderRadius,
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

	const tokenStyles = {
		alignItems,
		alignSelf,
		flexDirection,
		flex,
		flexWrap,
		justifyContent,
		borderBottomWidth,
		borderLeftWidth,
		borderRightWidth,
		borderTopWidth,
		borderWidth,
		width,
		height,
		...shadowValues,
		...marginValues,
		...colorValues,
		...borderRadiusValues,
	};

	return {
		tokenStyles: JSON.parse(JSON.stringify(tokenStyles)) as typeof tokenStyles,
		paddingValues: JSON.parse(JSON.stringify(paddingValues)) as typeof paddingValues,
		...remainingProps,
	};
}

type ObjectMapper<T, U> = (value: T) => U;

export function mapValues<T extends object, U>(
	object: T,
	mapper: ObjectMapper<T[keyof T], U>
): { [K in keyof T]: U } {
	const result = {} as { [K in keyof T]: U };

	for (const key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			result[key] = mapper(object[key]);
		}
	}

	return result;
}

export const mapMarginValue = (margins: MarginValues, spacingConfig: Record<string, number>) =>
	mapValues(margins, (value) => {
		if (!value) {
			return undefined;
		}
		if (spacingConfig == null) {
			throw new Error("Spacing not configured in theme");
		}
		if (typeof value === "object") {
			if (value.custom == null) {
				return;
			}
			if (typeof value.custom === "number" && value.custom > 0) {
				console.warn(
					"Only negative margins are supported for the Box Component, use padding props, or utilise the Stack or Row components"
				);
				return;
			}
			return value.custom;
		}

		const spaceValue = value?.replace("-", "") as SpaceKey;
		const spaceReturn = spacingConfig[spaceValue];

		if (typeof spaceReturn !== "number") {
			throw new Error("Invalid spacing value");
		}
		return -1 * spaceReturn;
	});

export const mapPaddingValues = (paddingValues: PaddingValues, spacingConfig: Record<string, number>) => {
	return mapValues(paddingValues, (value) => {
		if (typeof value === "object") {
			return value.custom;
		}
		if (typeof value === "string") {
			if (spacingConfig[value] == null) {
				throw new Error(`Padding value: ${value} is not included in the current theme configuration`);
			}
			return spacingConfig[value];
		}
		return undefined;
	});
};
