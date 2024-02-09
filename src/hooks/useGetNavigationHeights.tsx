import { useContext } from "react";

export const useGetBottomTabBarHeight = () => {
  const BottomTabBarHeightContext = require("@react-navigation/bottom-tabs")?.BottomTabBarHeightContext;
  const bottom: number | undefined = useContext?.(BottomTabBarHeightContext);
  return bottom ?? 0;
};

export const useGetHeaderHeight = () => {
  const useHeaderHeight = require("@react-navigation/elements")?.useHeaderHeight;
  const header: number | undefined = useHeaderHeight?.();
  return header ?? 0;
};
