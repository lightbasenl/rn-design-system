import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { ComponentType, ReactNode } from "react";
import { Children, useLayoutEffect } from "react";
import { type ScrollViewProps, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import type { BoxProps } from "../types";
import { Slot, isSlottable } from "./Slot";
import { VStack } from "./VStack";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { addInsetPadding, extractBoxTokens } from "./utils";

export type ScreenProps = {
	options?: NativeStackNavigationOptions;
	contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
} & BoxProps;

// const UISlot = withUnistyles(Slot);
export type AsChildProps<DefaultElementProps> =
	| ({ asChild?: false } & DefaultElementProps & ScreenProps)
	| ({ asChild: true; children: ReactNode } & ScreenProps);

export function Screen({
	asChild,
	children,
	options,
	style,
	contentContainerStyle,
	...props
}: AsChildProps<BoxProps>) {
	const navigation = useNavigation();

	useLayoutEffect(() => {
		if (options && Object.keys(options).length) {
			navigation.setOptions(options);
		}
	}, [navigation, options]);

	const Comp = asChild ? Slot : VStack;

	const childrenArray = Children.toArray(children);
	const slottable = childrenArray.findIndex(isSlottable);
	const { viewProps, boxProps } = extractBoxTokens(props);

	// @ts-ignore
	const displayName = asChild ? children?.type?.displayName : "";

	if (slottable === -1) {
		if (displayName?.includes("ScrollableBox")) {
			const ScrollComponent = Comp as ComponentType<ScrollViewProps>;
			return (
				<ScrollComponent
					contentContainerStyle={[styles.contentContainer(boxProps), contentContainerStyle]}
					style={[styles.scrollContainer(boxProps), style]}
					{...viewProps}
				>
					{children}
				</ScrollComponent>
			);
		}
		return (
			<Comp style={[styles.flex, styles.container(boxProps), style]} {...viewProps}>
				{children}
			</Comp>
		);
	}

	const childrenBeforeSlottable = childrenArray.slice(0, slottable);
	const childrenAfterSlottable = childrenArray.slice(slottable + 1);

	if (displayName?.includes("ScrollableBox")) {
		const ScrollComponent = Comp as ComponentType<ScrollViewProps>;

		return (
			<View style={styles.flex}>
				{!!childrenBeforeSlottable.length && <View>{childrenBeforeSlottable}</View>}
				<ScrollComponent
					contentContainerStyle={[styles.contentContainer(boxProps), contentContainerStyle]}
					style={[styles.scrollContainer(boxProps), style]}
					{...viewProps}
				>
					{children}
				</ScrollComponent>
				{!!childrenAfterSlottable.length && <View>{childrenAfterSlottable}</View>}
			</View>
		);
	}

	return (
		<View style={styles.flex}>
			{!!childrenBeforeSlottable.length && <View>{childrenBeforeSlottable}</View>}
			<Comp style={[styles.flex, styles.container(boxProps), style]} {...viewProps}>
				{children}
			</Comp>
			{!!childrenAfterSlottable.length && <View>{childrenAfterSlottable}</View>}
		</View>
	);
}

const styles = StyleSheet.create((theme, rt) => {
	return {
		flex: { flex: 1 },
		container: (props: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
			const { tokenStyles, paddingValues, edges } = resolveBoxTokens(
				{ ...theme.defaults.Screen, ...props },
				theme
			);
			return {
				...tokenStyles,
				...addInsetPadding({ paddingValues, edges, insets: rt.insets }),
			};
		},

		contentContainer: (props: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
			const { tokenStyles, paddingValues, edges } = resolveBoxTokens(
				{ ...theme.defaults.Screen, ...props },
				theme
			);
			return {
				flexGrow: tokenStyles.flex,
				...addInsetPadding({ paddingValues, edges, insets: rt.insets }),
			};
		},
		scrollContainer: (props: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
			const { tokenStyles } = resolveBoxTokens({ ...theme.defaults.Screen, ...props }, theme);
			const { flex, ...styles } = tokenStyles;
			return styles;
		},
	};
});
