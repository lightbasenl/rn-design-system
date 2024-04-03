import type { ForwardedRef, ReactElement, RefAttributes } from "react";
import { forwardRef, useContext } from "react";
import type { FlatListProps as RNFlatListProps } from "react-native";
import { FlatList } from "react-native";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import type { FilterStyles, RemoveStyles, ScrollableBoxProps } from "../../hooks/useResolveBoxListTokens";
import { useResolveBoxListTokens } from "../../hooks/useResolveBoxListTokens";

type FlatListProps<T> = RemoveStyles<RNFlatListProps<T>> & {
	contentContainerStyle?: FilterStyles<RNFlatListProps<T>["contentContainerStyle"]>;
	style?: FilterStyles<RNFlatListProps<T>["style"]>;
};

export type FlatListBoxProps<T> = ScrollableBoxProps & FlatListProps<T> & RefAttributes<FlatList<T>>;

type FlatListComponentType = <T>(
	props: FlatListBoxProps<T>,
	ref: ForwardedRef<FlatList<T>>
) => ReactElement | null;

export const FlatListBox = forwardRef(function FlatListBox<T>(
	{ style, contentContainerStyle, ...props }: FlatListBoxProps<T>,
	ref: ForwardedRef<FlatList<T>>
) {
	const { contentContainerStyles, styles, ...rest } = useResolveBoxListTokens(props);
	const color = useContext(BackgroundContext);

	return (
		<BackgroundContext.Provider value={styles.backgroundColor ?? color}>
			<FlatList<T>
				ref={ref}
				contentContainerStyle={[contentContainerStyles, contentContainerStyle]}
				style={[styles, style]}
				{...rest}
			/>
		</BackgroundContext.Provider>
	);
}) as FlatListComponentType;
