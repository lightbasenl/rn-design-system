import { type ScrollViewProps as RNScrollViewProps, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { ScrollableBoxProps } from "../types";
import { createScrollableBox } from "./createScrollableBox";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { extractBoxTokens } from "./utils";

export type ScrollViewBoxProps = ScrollableBoxProps &
	RNScrollViewProps & {
		ref?: React.RefObject<ScrollView | null>;
	};

const ScrollViewUniStyle = withUnistyles(ScrollView);
export function ScrollViewBox({
	style,
	contentContainerStyle,
	backgroundColor,
	...props
}: ScrollViewBoxProps) {
	const { viewProps, boxProps } = extractBoxTokens<RNScrollViewProps>({ backgroundColor, ...props });
	if (!backgroundColor) {
		return (
			<ScrollViewUniStyle
				contentContainerStyle={[styles.contentContainer(boxProps), contentContainerStyle]}
				style={[styles.container(boxProps), style]}
				{...viewProps}
			/>
		);
	}
	return (
		<BackgroundContext.Provider value={backgroundColor}>
			<ScrollViewUniStyle
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

/** @deprecated Use ScrollViewBox instead */
export const AnimatedScrollViewBox = Animated.createAnimatedComponent(ScrollViewBox);

/** @deprecated Use createScrollableBox at project level instead */
export const KeyboardAwareScrollViewBox = createScrollableBox(KeyboardAwareScrollView);
