import type { RefAttributes } from "react";
import { useContext } from "react";
import type { ScrollViewProps as RNScrollViewProps } from "react-native";
import type { AnimatedProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import type { FilterStyles, RemoveStyles, ScrollableBoxProps } from "../../hooks/useResolveBoxListTokens";
import { useResolveBoxListTokens } from "../../hooks/useResolveBoxListTokens";

type ScrollViewProps = RemoveStyles<RNScrollViewProps> & {
	contentContainerStyle?: FilterStyles<RNScrollViewProps["contentContainerStyle"]>;
	style?: FilterStyles<RNScrollViewProps["style"]>;
};

export type AnimatedScrollViewBoxProps = ScrollableBoxProps &
	AnimatedProps<ScrollViewProps> &
	RefAttributes<Animated.ScrollView>;

export function AnimatedScrollViewBox({
	style,
	contentContainerStyle,
	...props
}: AnimatedScrollViewBoxProps) {
	const { contentContainerStyles, styles, ...rest } = useResolveBoxListTokens(props);
	const color = useContext(BackgroundContext);

	return (
		<BackgroundContext.Provider value={styles.backgroundColor ?? color}>
			<Animated.ScrollView
				contentContainerStyle={[contentContainerStyles, contentContainerStyle]}
				style={[styles, style]}
				{...rest}
			/>
		</BackgroundContext.Provider>
	);
}
