import { FlatList, type FlatListProps, type FlatListProps as RNFlatListProps } from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { ScrollableBoxProps } from "../types";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { addInsetPadding, extractBoxTokens } from "./utils";

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
			...addInsetPadding({ paddingValues, edges, insets: rt.insets }),
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
