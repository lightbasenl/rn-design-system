import { useCallback } from "react";

import type { ColorThemeKeys } from "../types";
import { useInternalTheme } from "./useInternalTheme";

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
