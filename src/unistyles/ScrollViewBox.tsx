import { type ScrollViewProps as RNScrollViewProps, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { ScrollableBoxProps } from "../types";
import { createScrollableBox } from "./createScrollableBox";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { addInsetPadding, extractBoxTokens } from "./utils";

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

ScrollViewBox.displayName = "ScrollableBox(ScrollView)";

const styles = StyleSheet.create((theme, rt) => ({
	contentContainer: (rest: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles, paddingValues, edges } = resolveBoxTokens(rest, theme);
		return {
			flexGrow: tokenStyles.flex,
			boxShadow: tokenStyles.boxShadow,
			...addInsetPadding({ paddingValues, edges, insets: rt.insets }),
		};
	},
	container: (rest: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles } = resolveBoxTokens(rest, theme);
		const { flex, boxShadow, ...styles } = tokenStyles;
		return styles;
	},
}));
