import { useCallback } from "react";

import { useInternalTheme } from "./useInternalTheme";
import type { ColorThemeKeys } from "../types";

export function useResolveColorToken() {
  const { colors } = useInternalTheme();
  return useCallback(
    (color: ColorThemeKeys) => {
      if (typeof color === "object") {
        return color.custom;
      }

      return colors[color] as string;
    },
    [colors]
  );
}
