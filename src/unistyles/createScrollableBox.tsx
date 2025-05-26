import type { Component, ComponentType, FunctionComponent, Ref } from "react";
import type { ScrollViewProps } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { ScrollableBoxProps } from "../types";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { extractBoxTokens } from "./utils";

export interface InitialComponentProps extends Record<string, unknown> {
	ref?: Ref<Component>;
	collapsable?: boolean;
}

// Don't change the order of overloads, since such a change breaks current behavior
export function createScrollableBox<P extends ScrollViewProps>(
	component: FunctionComponent<P>
): FunctionComponent<P>;

export function createScrollableBox<T extends ScrollViewProps>(
	Component: ComponentType<InitialComponentProps>
) {
	const ComponentWithUnistyles = withUnistyles(Component);
	const ScrollableBox = ({
		style,
		contentContainerStyle,
		backgroundColor,
		...props
	}: ScrollableBoxProps & T) => {
		const { viewProps, boxProps } = extractBoxTokens<ScrollViewProps>({ backgroundColor, ...props });

		if (!backgroundColor) {
			return (
				<ComponentWithUnistyles
					contentContainerStyle={[styles.contentContainer(boxProps), contentContainerStyle]}
					style={[styles.container(boxProps), style]}
					{...viewProps}
				/>
			);
		}
		return (
			<BackgroundContext.Provider value={backgroundColor}>
				<ComponentWithUnistyles
					contentContainerStyle={[styles.contentContainer(boxProps), contentContainerStyle]}
					style={[styles.container(boxProps), style]}
					{...viewProps}
				/>
			</BackgroundContext.Provider>
		);
	};
	return ScrollableBox;
}

const styles = StyleSheet.create((theme, rt) => ({
	contentContainer: (rest: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles, paddingValues, edges } = resolveBoxTokens(rest, theme);
		return {
			flexGrow: tokenStyles.flex,
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
		};
	},
	container: (rest: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles } = resolveBoxTokens(rest, theme);
		const { flex, ...styles } = tokenStyles;
		return styles;
	},
}));
