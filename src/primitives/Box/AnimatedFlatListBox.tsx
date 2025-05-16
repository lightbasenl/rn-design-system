import { useContext } from "react";
import type { FlatListPropsWithLayout } from "react-native-reanimated";
import Animated from "react-native-reanimated";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import type { ScrollableBoxProps } from "../../hooks/useResolveBoxListTokens";
import { useResolveBoxListTokens } from "../../hooks/useResolveBoxListTokens";

export type AnimatedFlatListBoxProps<T> = ScrollableBoxProps & FlatListPropsWithLayout<T>;

export function AnimatedFlatListBox<T>({
	style,
	contentContainerStyle,
	...props
}: AnimatedFlatListBoxProps<T>) {
	const { contentContainerStyles, styles, ...rest } = useResolveBoxListTokens(props);
	const color = useContext(BackgroundContext);

	return (
		<BackgroundContext.Provider value={styles.backgroundColor ?? color}>
			<Animated.FlatList<T>
				contentContainerStyle={[contentContainerStyles, contentContainerStyle]}
				style={[styles, style]}
				{...rest}
			/>
		</BackgroundContext.Provider>
	);
}
