import type { ForwardedRef, ReactElement } from "react";
import { forwardRef, useContext } from "react";
import type { FlatList } from "react-native";
import type { FlatListPropsWithLayout } from "react-native-reanimated";
import Animated from "react-native-reanimated";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import type { ScrollableBoxProps } from "../../hooks/useResolveBoxListTokens";
import { useResolveBoxListTokens } from "../../hooks/useResolveBoxListTokens";

export type AnimatedFlatListBoxProps<T> = ScrollableBoxProps & FlatListPropsWithLayout<T>;
type AnimatedFlatListComponentType = <T>(
	props: AnimatedFlatListBoxProps<T>,
	ref: ForwardedRef<FlatList>
) => ReactElement;

export const AnimatedFlatListBox = forwardRef(function FlatListBox<T>(
	{ style, contentContainerStyle, ...props }: AnimatedFlatListBoxProps<T>,
	ref: ForwardedRef<FlatList>
) {
	const { contentContainerStyles, styles, ...rest } = useResolveBoxListTokens(props);
	const color = useContext(BackgroundContext);

	return (
		<BackgroundContext.Provider value={styles.backgroundColor ?? color}>
			<Animated.FlatList<T>
				ref={ref}
				contentContainerStyle={[contentContainerStyles, contentContainerStyle]}
				style={[styles, style]}
				{...rest}
			/>
		</BackgroundContext.Provider>
	);
}) as AnimatedFlatListComponentType;
