import type { Component, RefObject } from "react";
import React, { useContext } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { useKeyboardHandler, useResizeMode } from "react-native-keyboard-controller";
import type { MeasuredDimensions } from "react-native-reanimated";
import Reanimated, {
  Easing,
  interpolate,
  measure,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  useWorkletCallback,
  withTiming,
} from "react-native-reanimated";

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
  const scrollPosition = useSharedValue(0);
  const position = useSharedValue(0);
  const layout = useSharedValue<MeasuredDimensions | null>(null);
  const fakeViewHeight = useSharedValue(0);
  const keyboardHeight = useSharedValue(0);
  const tag = useSharedValue(-1);

  const { height } = useWindowDimensions();

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        position.value = e.contentOffset.y;
      },
    },
    []
  );
  const measureByTag = useWorkletCallback((viewTag: number) => {
    return measure((() => viewTag) as unknown as RefObject<Component<object, object, any>>);
  }, []);

  /**
   * Function that will scroll a ScrollView as keyboard gets moving
   */
  const maybeScroll = useWorkletCallback(
    (e: number) => {
      "worklet";

      fakeViewHeight.value = e;

      const visibleRect = height - keyboardHeight.value;
      const point = (layout.value?.pageY ?? 0) + (layout.value?.height ?? 0);

      if (visibleRect - point <= bottomOffset) {
        const interpolatedScrollTo = interpolate(
          e,
          [0, keyboardHeight.value],
          [0, keyboardHeight.value - (height - point) + bottomOffset]
        );
        const targetScrollY = Math.max(interpolatedScrollTo, 0) + scrollPosition.value;

        scrollTo(scrollViewAnimatedRef, 0, targetScrollY, false);
      }
    },
    [
      bottomOffset,
      fakeViewHeight,
      height,
      keyboardHeight.value,
      layout.value?.height,
      layout.value?.pageY,
      scrollPosition.value,
      scrollViewAnimatedRef,
    ]
  );

  useSmoothKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        // keyboard will appear
        if (e.height > 0 && keyboardHeight.value === 0) {
          // persist scroll value
          scrollPosition.value = position.value;
        }

        // focus was changed
        if (tag.value !== e.target || (keyboardHeight.value !== e.height && e.height > 0)) {
          tag.value = e.target;

          if (tag.value !== -1) {
            // save position of focused text input when keyboard starts to move
            layout.value = measureByTag(e.target);
          }
        }

        // keyboard will appear or change its size
        if (e.height > 0) {
          // just persist height - later will be used in interpolation
          keyboardHeight.value = e.height;
        }
      },
      onMove: (e) => {
        "worklet";

        maybeScroll(e.height);
      },
      onEnd: (e) => {
        "worklet";

        keyboardHeight.value = e.height;
      },
    },
    [height]
  );

  const view = useAnimatedStyle(
    () => ({
      height: fakeViewHeight.value,
    }),
    [fakeViewHeight.value]
  );

  return (
    <BackgroundContext.Provider value={styles.backgroundColor ?? color}>
      {/* @ts-ignore */}
      <Reanimated.ScrollView
        ref={scrollViewAnimatedRef}
        contentContainerStyle={[contentContainerStyles, contentContainerStyle]}
        style={[styles, style]}
        keyboardShouldPersistTaps="handled"
        {...rest}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {children}
        <Reanimated.View style={view} />
      </Reanimated.ScrollView>
    </BackgroundContext.Provider>
  );
}

const IS_ANDROID_ELEVEN_OR_HIGHER = Platform.OS === "android" && Platform.Version >= 30;
// on these platforms keyboard transitions will be smooth
const IS_ANDROID_ELEVEN_OR_HIGHER_OR_IOS = IS_ANDROID_ELEVEN_OR_HIGHER || Platform.OS === "ios";
// on Android Telegram is not using androidx.core values and uses custom interpolation
// duration is taken from here: https://github.com/DrKLO/Telegram/blob/e9a35cea54c06277c69d41b8e25d94b5d7ede065/TMessagesProj/src/main/java/org/telegram/ui/ActionBar/AdjustPanLayoutHelper.java#L39
// and bezier is taken from: https://github.com/DrKLO/Telegram/blob/e9a35cea54c06277c69d41b8e25d94b5d7ede065/TMessagesProj/src/main/java/androidx/recyclerview/widget/ChatListItemAnimator.java#L40
const TELEGRAM_ANDROID_TIMING_CONFIG = {
  duration: 250,
  easing: Easing.bezier(0.19919472913616398, 0.010644531250000006, 0.27920937042459737, 0.91025390625),
};

/**
 * Hook that uses default transitions for iOS and Android > 11, and uses
 * custom interpolation on Android < 11 to achieve more smooth animation
 */
export const useSmoothKeyboardHandler: typeof useKeyboardHandler = (handler, deps) => {
  const target = useSharedValue(-1);
  const persistedHeight = useSharedValue(0);
  const animatedKeyboardHeight = useSharedValue(0);

  useDerivedValue(() => {
    if (!IS_ANDROID_ELEVEN_OR_HIGHER_OR_IOS) {
      const event = {
        // it'll be always 250, since we're running animation via `withTiming` where
        // duration in config (TELEGRAM_ANDROID_TIMING_CONFIG.duration) = 250ms
        duration: 250,
        target: target.value,
        height: animatedKeyboardHeight.value,
        progress: animatedKeyboardHeight.value / persistedHeight.value,
      };
      handler.onMove?.(event);

      // dispatch `onEnd`
      if (animatedKeyboardHeight.value === persistedHeight.value) {
        handler.onEnd?.(event);
      }
    }
  }, [animatedKeyboardHeight.value, handler, persistedHeight.value, target.value]);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";
        // immediately dispatch onStart/onEnd events if onStart dispatched with the same height
        // and don't wait for animation 250ms
        if (!IS_ANDROID_ELEVEN_OR_HIGHER_OR_IOS && e.height === persistedHeight.value) {
          handler.onStart?.(e);
          handler.onEnd?.(e);

          return;
        }

        target.value = e.target;

        if (e.height > 0) {
          persistedHeight.value = e.height;
        }
        // if we are running on Android < 9, then we are using custom interpolation
        // to achieve smoother animation and use `animatedKeyboardHeight` as animation
        // driver
        if (!IS_ANDROID_ELEVEN_OR_HIGHER_OR_IOS) {
          animatedKeyboardHeight.value = withTiming(e.height, TELEGRAM_ANDROID_TIMING_CONFIG);
        }

        handler.onStart?.(e);
      },
      onMove: (e) => {
        "worklet";

        if (IS_ANDROID_ELEVEN_OR_HIGHER_OR_IOS) {
          handler.onMove?.(e);
        }
      },
      onEnd: (e) => {
        "worklet";

        if (IS_ANDROID_ELEVEN_OR_HIGHER_OR_IOS) {
          handler.onEnd?.(e);
        }

        persistedHeight.value = e.height;
      },
    },
    deps
  );
};
