import {
	type SectionListProps as RNSectionListProps,
	SectionList,
	type SectionListProps,
} from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { ScrollableBoxProps } from "../types";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { addInsetPadding, extractBoxTokens } from "./utils";

type RNProps<T> = RNSectionListProps<T>;

export type SectionListBoxProps<T> = ScrollableBoxProps &
	SectionListProps<T> & {
		ref?: React.RefObject<SectionList<T> | null>;
	};

// Define a properly typed version of the component
const SectionListUniStyle = withUnistyles(SectionList) as unknown as typeof SectionList;

export function SectionListBox<T>({
	style,
	contentContainerStyle,
	backgroundColor,
	...props
}: SectionListBoxProps<T>) {
	const { boxProps, viewProps } = extractBoxTokens<RNProps<T>>({ backgroundColor, ...props });

	if (!backgroundColor) {
		return (
			<SectionListUniStyle<T>
				contentContainerStyle={[styles.contentContainer(boxProps), contentContainerStyle]}
				style={[styles.container(boxProps), style]}
				{...viewProps}
			/>
		);
	}
	return (
		<BackgroundContext.Provider value={backgroundColor}>
			<SectionListUniStyle<T>
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
SectionListBox.displayName = "ScrollableBox(SectionList)";
