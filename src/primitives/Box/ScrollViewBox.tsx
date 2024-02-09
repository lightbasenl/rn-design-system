import type { ForwardedRef } from "react";
import React, { forwardRef, useContext } from "react";
import type { ScrollViewProps as RNScrollViewProps } from "react-native";
import { ScrollView } from "react-native";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import type { FilterStyles, RemoveStyles, ScrollableBoxProps } from "../../hooks/useResolveBoxListTokens";
import { useResolveBoxListTokens } from "../../hooks/useResolveBoxListTokens";

type ScrollViewProps = RemoveStyles<RNScrollViewProps> & {
  contentContainerStyle?: FilterStyles<RNScrollViewProps["contentContainerStyle"]>;
  style?: FilterStyles<RNScrollViewProps["style"]>;
};

export type ScrollViewBoxProps = ScrollableBoxProps & ScrollViewProps;

export const ScrollViewBox = forwardRef(function ScrollViewBox(
  { style, contentContainerStyle, ...props }: ScrollViewBoxProps,
  ref: ForwardedRef<ScrollView>
) {
  const { contentContainerStyles, styles, ...rest } = useResolveBoxListTokens(props);
  const color = useContext(BackgroundContext);

  return (
    <BackgroundContext.Provider value={styles.backgroundColor ?? color}>
      <ScrollView
        ref={ref as ForwardedRef<ScrollView>}
        contentContainerStyle={[contentContainerStyles, contentContainerStyle]}
        style={[styles, style]}
        {...rest}
      />
    </BackgroundContext.Provider>
  );
});
