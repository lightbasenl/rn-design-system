import type { BoxProps } from "@lightbase/rn-design-system";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { ReactNode } from "react";
import { Children, useLayoutEffect } from "react";
import { View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { Slot, isSlottable } from "./Slot";
import { VStack } from "./VStack";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { extractBoxTokens } from "./utils";

export type ScreenBaseProps = {
	options?: NativeStackNavigationOptions;
} & BoxProps;

const UISlot = withUnistyles(Slot);
export type AsChildProps<DefaultElementProps> =
	| ({ asChild?: false } & DefaultElementProps & ScreenBaseProps)
	| ({ asChild: true; children: ReactNode } & ScreenBaseProps);

export function Screen({ asChild, children, options, ...props }: AsChildProps<BoxProps>) {
	const navigation = useNavigation();

	useLayoutEffect(() => {
		if (options && Object.keys(options).length) {
			navigation.setOptions(options);
		}
	}, [navigation, options]);

	const Comp = asChild ? UISlot : VStack;

	const childrenArray = Children.toArray(children);
	const slottable = childrenArray.findIndex(isSlottable);
	const { boxProps } = extractBoxTokens(props);

	if (slottable === -1) {
		return (
			<Comp style={styles.container(boxProps)} {...props}>
				{children}
			</Comp>
		);
	}

	const childrenBeforeSlottable = childrenArray.slice(0, slottable);
	const childrenAfterSlottable = childrenArray.slice(slottable + 1);
	return (
		<View style={{ flex: 1 }}>
			{!!childrenBeforeSlottable.length && <View>{childrenBeforeSlottable}</View>}
			<Comp {...props}>{children}</Comp>
			{!!childrenAfterSlottable.length && <View>{childrenAfterSlottable}</View>}
		</View>
	);
}

const styles = StyleSheet.create((theme, rt) => {
	return {
		container: (props: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
			const { tokenStyles, paddingValues, edges } = resolveBoxTokens(
				{ ...theme.defaults.Screen, ...props },
				theme
			);
			return {
				...tokenStyles,
				...paddingValues,
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
	};
});
