import { FlatList, type FlatListProps, type FlatListProps as RNFlatListProps } from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { ScrollableBoxProps } from "../types";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { extractBoxTokens } from "./utils";

type RNProps<T> = RNFlatListProps<T>;

export type FlatListBoxProps<T> = ScrollableBoxProps &
	FlatListProps<T> & {
		ref?: React.RefObject<FlatList<T> | null>;
	};

// Define a properly typed version of the component
const FlatListUniStyle = withUnistyles(FlatList) as unknown as typeof FlatList;

export function FlatListBox<T>({
	style,
	contentContainerStyle,
	backgroundColor,
	...props
}: FlatListBoxProps<T>) {
	const { boxProps, viewProps } = extractBoxTokens<RNProps<T>>({ backgroundColor, ...props });

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

/** @deprecated Use FlatListBox instead */
export const AnimatedFlatListBox = Animated.createAnimatedComponent(FlatListBox) as typeof FlatListBox;
