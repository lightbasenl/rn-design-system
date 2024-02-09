import type { ForwardedRef, RefAttributes } from "react";
import React, { forwardRef, useContext } from "react";
import type { ScrollViewProps as RNScrollViewProps } from "react-native";
import type { AnimateProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import type { FilterStyles, RemoveStyles, ScrollableBoxProps } from "../../hooks/useResolveBoxListTokens";
import { useResolveBoxListTokens } from "../../hooks/useResolveBoxListTokens";

type ScrollViewProps = RemoveStyles<RNScrollViewProps> & {
  contentContainerStyle?: FilterStyles<RNScrollViewProps["contentContainerStyle"]>;
  style?: FilterStyles<RNScrollViewProps["style"]>;
};

export type AnimatedScrollViewBoxProps = ScrollableBoxProps &
  AnimateProps<ScrollViewProps> &
  RefAttributes<Animated.ScrollView>;

interface AnimatedScrollViewComponentType {
  (props: AnimatedScrollViewBoxProps, ref: ForwardedRef<Animated.ScrollView>): JSX.Element;
}

export const AnimatedScrollViewBox = forwardRef(function ScrollViewBox(
  { style, contentContainerStyle, ...props }: AnimatedScrollViewBoxProps,
  ref: ForwardedRef<Animated.ScrollView>
) {
  const { contentContainerStyles, styles, ...rest } = useResolveBoxListTokens(props);
  const color = useContext(BackgroundContext);

  return (
    <BackgroundContext.Provider value={styles.backgroundColor ?? color}>
      <Animated.ScrollView
        ref={ref as ForwardedRef<Animated.ScrollView>}
        contentContainerStyle={[contentContainerStyles, contentContainerStyle]}
        style={[styles, style]}
        {...rest}
      />
    </BackgroundContext.Provider>
  );
}) as AnimatedScrollViewComponentType;
