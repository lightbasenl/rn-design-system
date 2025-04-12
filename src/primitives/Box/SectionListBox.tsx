import type { ForwardedRef, ReactElement } from "react";
import { forwardRef, useContext } from "react";
import type { SectionListProps as RNSectionListProps } from "react-native";
import { SectionList } from "react-native";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import type { FilterStyles, RemoveStyles, ScrollableBoxProps } from "../../hooks/useResolveBoxListTokens";
import { useResolveBoxListTokens } from "../../hooks/useResolveBoxListTokens";

type SectionListProps<T, S> = RemoveStyles<RNSectionListProps<T, S>> & {
	contentContainerStyle?: FilterStyles<RNSectionListProps<T, S>["contentContainerStyle"]>;
	style?: FilterStyles<RNSectionListProps<T, S>["style"]>;
};

export type SectionListBoxProps<T, S> = ScrollableBoxProps & SectionListProps<T, S>;

type SectionComponentFunctionType = <T, S>(
	props: SectionListBoxProps<T, S>,
	ref: ForwardedRef<SectionList<T, S>>
) => ReactElement;

export const SectionListBox = forwardRef(function SectionListBox<T, S>(
	{ style, contentContainerStyle, ...props }: SectionListBoxProps<T, S>,
	ref: ForwardedRef<SectionList<T, S>>
) {
	const { contentContainerStyles, styles, ...rest } = useResolveBoxListTokens(props);
	const color = useContext(BackgroundContext);

	return (
		<BackgroundContext.Provider value={styles.backgroundColor ?? color}>
			<SectionList<T, S>
				ref={ref}
				contentContainerStyle={[contentContainerStyles, contentContainerStyle]}
				style={[styles, style]}
				{...rest}
			/>
		</BackgroundContext.Provider>
	);
}) as SectionComponentFunctionType;
