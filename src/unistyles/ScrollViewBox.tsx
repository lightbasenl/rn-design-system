import { type ScrollViewProps as RNScrollViewProps, ScrollView } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { FilterStyles, ScrollableBoxProps } from "../types";
import type { RemoveStyles } from "../types";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { extractBoxTokens } from "./utils";

type RNProps = RNScrollViewProps;

type ScrollViewProps = RemoveStyles<RNProps> & {
	contentContainerStyle?: FilterStyles<RNProps["contentContainerStyle"]>;
	style?: FilterStyles<RNProps["style"]>;
};

export type ScrollViewBoxProps = ScrollableBoxProps & ScrollViewProps;

const ScrollViewUniStyle = withUnistyles(ScrollView);
export function ScrollViewBox({
	style,
	contentContainerStyle,
	backgroundColor,
	...props
}: ScrollViewBoxProps) {
	const { viewProps, boxProps } = extractBoxTokens<RNProps>({ backgroundColor, ...props });

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

const styles = StyleSheet.create((theme) => ({
	contentContainer: (rest: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles, paddingValues } = resolveBoxTokens(rest, theme);
		return {
			flexGrow: tokenStyles.flex,
			...paddingValues,
		};
	},
	container: (rest: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles } = resolveBoxTokens(rest, theme);
		const { flex, ...styles } = tokenStyles;
		return styles;
	},
}));
