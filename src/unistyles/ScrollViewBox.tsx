import type { ScrollViewProps as RNScrollViewProps, ScrollView } from "react-native";
import { ScrollView as RNScrollView } from "react-native";
import type { ScrollableBoxProps } from "../types";
import { createBox } from "./createBox";

export type ScrollViewBoxProps = ScrollableBoxProps &
	RNScrollViewProps & {
		ref?: React.RefObject<ScrollView | null>;
	};

export const ScrollViewBox = createBox(RNScrollView, { scrollable: true });
