import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { memo, useLayoutEffect } from "react";
import { FlatList, type FlatListProps as RNFlatListProps } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { FlatListBoxProps } from "./FlatListBox";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { extractBoxTokens } from "./utils";

type RNProps<T> = RNFlatListProps<T>;

export type ScreenListProps<T> = Omit<FlatListBoxProps<T>, "edges"> &
	RNFlatListProps<T> & {
		ref?: React.RefObject<FlatList<T> | null>;
		options?: NativeStackNavigationOptions;
	};

// Define a properly typed version of the component
const FlatListUniStyle = memo(withUnistyles(FlatList)) as unknown as typeof FlatList;

export function ScreenList<T>({
	style,
	contentContainerStyle,
	backgroundColor,
	options,
	...props
}: ScreenListProps<T>) {
	const { boxProps, viewProps } = extractBoxTokens<RNProps<T>>({ backgroundColor, ...props });

	const navigation = useNavigation();

	useLayoutEffect(() => {
		if (options && Object.keys(options).length) {
			navigation.setOptions(options);
		}
	}, [navigation, options]);

	if (!backgroundColor) {
		return (
			<FlatListUniStyle<T>
				contentContainerStyle={[styles.contentContainer(boxProps), contentContainerStyle]}
				style={[styles.container(boxProps), style]}
				{...viewProps}
			/>
		);
	}
	return (
		<BackgroundContext.Provider value={backgroundColor}>
			<FlatListUniStyle<T>
				contentContainerStyle={[styles.contentContainer(boxProps), contentContainerStyle]}
				style={[styles.container(boxProps), style]}
				{...viewProps}
			/>
		</BackgroundContext.Provider>
	);
}

const styles = StyleSheet.create((theme) => ({
	contentContainer: (props: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles, paddingValues } = resolveBoxTokens({ ...theme.defaults.Screen, ...props }, theme);
		return {
			flexGrow: tokenStyles.flex,
			paddingValues,
		};
	},
	container: (props: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles } = resolveBoxTokens({ ...theme.defaults.Screen, ...props }, theme);
		const { flex, ...styles } = tokenStyles;
		return styles;
	},
}));

ScreenList.displayName = "Screen(FlatList)";
