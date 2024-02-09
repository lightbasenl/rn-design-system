import type { DependencyList } from "react";
import { useMemo } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type RemoveStyle<T> = Omit<T, "style">;

export const useStyle = <TStyle extends ViewStyle, T extends StyleProp<TStyle>>(
  styleFactory: () => T,
  deps: DependencyList
): T => useMemo(styleFactory, deps);
