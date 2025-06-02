import type { Component, ComponentType, FunctionComponent, Ref } from "react";
import type { ScrollViewProps } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { ScrollableBoxProps } from "../types";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { addInsetPadding, extractBoxTokens } from "./utils";

interface InitialComponentProps<T extends ScrollViewProps> extends Record<string, unknown> {
	ref?: Ref<Component<T>>;
	collapsable?: boolean;
}

// Don't change the order of overloads, since such a change breaks current behavior
export function createScrollableBox<T extends ScrollViewProps>(
	component: FunctionComponent<ScrollableBoxProps & T>
): FunctionComponent<ScrollableBoxProps & T>;

export function createScrollableBox<T extends ScrollViewProps>(
	Component: ComponentType<InitialComponentProps<T>>
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
	ScrollableBox.displayName = `ScrollableBox(${Component.displayName || Component.name})`;
	return ScrollableBox;
}

const styles = StyleSheet.create((theme, rt) => ({
	contentContainer: (rest: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles, paddingValues, edges } = resolveBoxTokens(rest, theme);
		return {
			flexGrow: tokenStyles.flex,
			...addInsetPadding({ paddingValues, edges, insets: rt.insets }),
		};
	},
	container: (rest: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles } = resolveBoxTokens(rest, theme);
		const { flex, ...styles } = tokenStyles;
		return styles;
	},
}));
