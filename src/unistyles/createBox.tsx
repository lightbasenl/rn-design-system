import type { Component, ComponentType, FunctionComponent, Ref } from "react";
import type { ViewProps } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { BoxProps } from "../types";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { addInsetPadding, extractBoxTokens } from "./utils";

interface InitialComponentProps<T extends ViewProps> extends Record<string, unknown> {
	ref?: Ref<Component<T>>;
	collapsable?: boolean;
}

export function createBox<T extends ViewProps>(
	component: FunctionComponent<BoxProps & T>
): FunctionComponent<BoxProps & T>;

export function createBox<T extends ViewProps>(Component: ComponentType<InitialComponentProps<T>>) {
	const ComponentWithUnistyles = withUnistyles(Component);
	const Box = ({ style, backgroundColor, ...props }: BoxProps & T) => {
		const { viewProps, boxProps } = extractBoxTokens<ViewProps>({ backgroundColor, ...props });
		if (!backgroundColor) {
			return <ComponentWithUnistyles style={[styles.container(boxProps), style]} {...viewProps} />;
		}
		return (
			<BackgroundContext.Provider value={backgroundColor}>
				<ComponentWithUnistyles style={[styles.container(boxProps), style]} {...viewProps} />
			</BackgroundContext.Provider>
		);
	};
	return Box;
}

const styles = StyleSheet.create((theme, rt) => ({
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
