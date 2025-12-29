import type { ReactElement } from "react";
import { SectionList, type SectionListProps } from "react-native";
import type { ScrollableBoxProps } from "../types";
import { createBox } from "./createBox";

export type SectionListBoxProps<T> = ScrollableBoxProps &
	SectionListProps<T> & {
		ref?: React.RefObject<SectionList<T> | null>;
	};

// Type assertion to preserve generic parameter at call site
export const SectionListBox = createBox(SectionList, { scrollable: true }) as <T>(
	props: SectionListBoxProps<T>
) => ReactElement;
