import React, { useContext } from "react";
import { useResizeMode, KeyboardAwareScrollView } from "react-native-keyboard-controller";
import type Reanimated from "react-native-reanimated";
import { useAnimatedRef } from "react-native-reanimated";

import type { ScrollViewBoxProps } from "./ScrollViewBox";
import { BackgroundContext } from "../../hooks/useBackgroundColor";
import { useResolveBoxListTokens } from "../../hooks/useResolveBoxListTokens";

export type KeyboardAwareScrollViewBoxProps = ScrollViewBoxProps & { bottomOffset?: number };
export function KeyboardAwareScrollViewBox({
  children,
  bottomOffset = 20,
  style,
  contentContainerStyle,
  ...props
}: KeyboardAwareScrollViewBoxProps) {
  useResizeMode();

  const { contentContainerStyles, styles, ...rest } = useResolveBoxListTokens(props);
  const color = useContext(BackgroundContext);

  const scrollViewAnimatedRef = useAnimatedRef<Reanimated.ScrollView>();

  return (
    <BackgroundContext.Provider value={styles.backgroundColor ?? color}>
      {/* @ts-ignore */}
      <KeyboardAwareScrollView
        ref={scrollViewAnimatedRef}
        contentContainerStyle={[contentContainerStyles, contentContainerStyle]}
        style={[styles, style]}
        keyboardShouldPersistTaps="handled"
        {...rest}
      >
        {children}
      </KeyboardAwareScrollView>
    </BackgroundContext.Provider>
  );
}
