import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { memo, useLayoutEffect } from "react";
import { type ScrollViewProps as RNScrollViewProps, ScrollView } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { ScrollableBoxProps } from "../types";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { extractBoxTokens } from "./utils";

export type ScrenNewProps = Omit<ScrollableBoxProps, "edges"> &
	RNScrollViewProps & {
		ref?: React.RefObject<ScrollView | null>;
		options?: NativeStackNavigationOptions;
	};

const ScrollViewUniStyle = memo(withUnistyles(ScrollView));

export function ScreenScroll({
	style,
	contentContainerStyle,
	backgroundColor,
	options,
	...props
}: ScrenNewProps) {
	const { viewProps, boxProps } = extractBoxTokens<RNScrollViewProps>({ backgroundColor, ...props });
	const navigation = useNavigation();

	useLayoutEffect(() => {
		if (options && Object.keys(options).length) {
			navigation.setOptions(options);
		}
	}, [navigation, options]);

	if (!backgroundColor) {
		return (
			<ScrollViewUniStyle
				contentContainerStyle={[styles.contentContainer(boxProps), contentContainerStyle]}
				style={[styles.container(boxProps), style]}
				contentInsetAdjustmentBehavior="automatic"
				{...viewProps}
			/>
		);
	}
	return (
		<BackgroundContext.Provider value={backgroundColor}>
			<ScrollViewUniStyle
				contentContainerStyle={[styles.contentContainer(boxProps), contentContainerStyle]}
				style={[styles.container(boxProps), style]}
				contentInsetAdjustmentBehavior="automatic"
				{...viewProps}
			/>
		</BackgroundContext.Provider>
	);
}

ScreenScroll.displayName = "Screen(ScrollView)";

const styles = StyleSheet.create((theme) => ({
	contentContainer: (props: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles, paddingValues } = resolveBoxTokens({ ...theme.defaults.Screen, ...props }, theme);
		return {
			flexGrow: tokenStyles.flex,
			...paddingValues,
		};
	},
	container: (props: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles } = resolveBoxTokens({ ...theme.defaults.Screen, ...props }, theme);
		const { flex, ...styles } = tokenStyles;
		return styles;
	},
}));
