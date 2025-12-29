import type { ReactElement } from "react";
import { FlatList, type FlatListProps } from "react-native";
import type { ScrollableBoxProps } from "../types";
import { createBox } from "./createBox";

export type FlatListBoxProps<T> = ScrollableBoxProps &
	FlatListProps<T> & {
		ref?: React.RefObject<FlatList<T> | null>;
	};

// Type assertion to preserve generic parameter at call site
export const FlatListBox = createBox(FlatList, { scrollable: true }) as <T>(
	props: FlatListBoxProps<T>
) => ReactElement;
