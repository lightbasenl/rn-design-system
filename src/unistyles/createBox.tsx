import type { Component, ComponentType, FunctionComponent, Ref } from "react";
import type { ScrollViewProps, ViewProps } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { BoxProps, ScrollableBoxProps } from "../types";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { addInsetPadding, extractBoxTokens } from "./utils";

interface InitialComponentProps<T extends ViewProps> extends Record<string, unknown> {
	ref?: Ref<Component<T>>;
	collapsable?: boolean;
}

type BoxOptions = {
	scrollable?: boolean;
};

// Overload 1: Non-scrollable (default)
export function createBox<T extends ViewProps>(
	component: FunctionComponent<BoxProps & T>
): FunctionComponent<BoxProps & T>;

// Overload 2: Non-scrollable with explicit options
export function createBox<T extends ViewProps>(
	component: ComponentType<InitialComponentProps<T>>,
	options?: { scrollable?: false }
): FunctionComponent<BoxProps & T>;

// Overload 3: Scrollable component (accepts any component type to handle FlatList, SectionList, etc.)
export function createBox<T extends ScrollViewProps>(
	component: ComponentType<T>,
	options: { scrollable: true }
): FunctionComponent<ScrollableBoxProps & T>;

// Implementation
export function createBox(
	Component: ComponentType<any>,
	options?: BoxOptions
): FunctionComponent<BoxProps & ViewProps> | FunctionComponent<ScrollableBoxProps & ScrollViewProps> {
	const ComponentWithUnistyles = withUnistyles(Component);
	const isScrollable = options?.scrollable === true;

	if (isScrollable) {
		const ScrollableBox = ({
			style,
			contentContainerStyle,
			backgroundColor,
			...props
		}: ScrollableBoxProps & ScrollViewProps) => {
			const { viewProps, boxProps } = extractBoxTokens<ScrollViewProps>({ backgroundColor, ...props });
			if (!backgroundColor) {
				return (
					<ComponentWithUnistyles
						contentContainerStyle={[scrollableStyles.contentContainer(boxProps), contentContainerStyle]}
						style={[scrollableStyles.container(boxProps), style]}
						{...viewProps}
					/>
				);
			}
			return (
				<BackgroundContext.Provider value={backgroundColor}>
					<ComponentWithUnistyles
						contentContainerStyle={[scrollableStyles.contentContainer(boxProps), contentContainerStyle]}
						style={[scrollableStyles.container(boxProps), style]}
						{...viewProps}
					/>
				</BackgroundContext.Provider>
			);
		};
		ScrollableBox.displayName = `ScrollableBox(${Component.displayName || Component.name})`;
		return ScrollableBox;
	}

	const Box = ({ style, backgroundColor, ...props }: BoxProps & ViewProps) => {
		const { viewProps, boxProps } = extractBoxTokens<ViewProps>({ backgroundColor, ...props });
		if (!backgroundColor) {
			return <ComponentWithUnistyles style={[boxStyles.container(boxProps), style]} {...viewProps} />;
		}
		return (
			<BackgroundContext.Provider value={backgroundColor}>
				<ComponentWithUnistyles style={[boxStyles.container(boxProps), style]} {...viewProps} />
			</BackgroundContext.Provider>
		);
	};
	return Box;
}

const boxStyles = StyleSheet.create((theme, rt) => ({
	container: ({
		edges,
		...rest
	}: ReturnType<typeof extractBoxTokens>["boxProps"] & Omit<BoxProps, "children">) => {
		const { tokenStyles, paddingValues } = resolveBoxTokens(rest, theme);
		return {
			...tokenStyles,
			...addInsetPadding({ paddingValues, edges, insets: rt.insets }),
		};
	},
}));

const scrollableStyles = StyleSheet.create((theme, rt) => ({
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
