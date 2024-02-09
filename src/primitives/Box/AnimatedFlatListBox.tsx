import type { ForwardedRef, RefAttributes } from "react";
import React, { forwardRef, useContext } from "react";
import type { FlatListProps as RNFlatListProps } from "react-native";
import type { AnimateProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import type { FilterStyles, RemoveStyles, ScrollableBoxProps } from "../../hooks/useResolveBoxListTokens";
import { useResolveBoxListTokens } from "../../hooks/useResolveBoxListTokens";

type FlatListProps<T> = RemoveStyles<RNFlatListProps<T>> & {
  contentContainerStyle?: FilterStyles<RNFlatListProps<T>["contentContainerStyle"]>;
  style?: FilterStyles<RNFlatListProps<T>["style"]>;
};

export type AnimatedFlatListBoxProps<T> = ScrollableBoxProps &
  AnimateProps<FlatListProps<T>> &
  RefAttributes<Animated.FlatList<T>>;

interface AnimatedFlatListComponentType {
  <T>(props: AnimatedFlatListBoxProps<T>, ref: ForwardedRef<Animated.FlatList<T>>): JSX.Element;
}

export const AnimatedFlatListBox = forwardRef(function FlatListBox<T>(
  { style, contentContainerStyle, ...props }: AnimatedFlatListBoxProps<T>,
  ref: ForwardedRef<Animated.FlatList<T>>
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
