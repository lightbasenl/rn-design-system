import type { RefAttributes } from "react";
import { useContext } from "react";
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

export function FlatListBox<T>({ style, contentContainerStyle, ...props }: FlatListBoxProps<T>) {
	const { contentContainerStyles, styles, ...rest } = useResolveBoxListTokens(props);
	const color = useContext(BackgroundContext);

	return (
		<BackgroundContext.Provider value={styles.backgroundColor ?? color}>
			<FlatList<T>
				contentContainerStyle={[contentContainerStyles, contentContainerStyle]}
				style={[styles, style]}
				{...rest}
			/>
		</BackgroundContext.Provider>
	);
}
