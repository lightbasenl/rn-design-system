import { useContext, useMemo } from "react";

import { ThemeContext } from "../context/ThemeProvider";
import type { LBConfig } from "../types";

export function useInternalTheme(mode?: "light" | "dark"): {
	colors: LBConfig["colors"]["light"];
	typography: LBConfig["typography"];
	variants: LBConfig["variants"];
	spacing: LBConfig["spacing"];
	radius: LBConfig["radius"];
	defaults: LBConfig["defaults"];
	capsize: LBConfig["capsize"];
} {
	const theme = useContext(ThemeContext);

	if (!theme) {
		throw new Error("No Theme found");
	}
	const { colors, typography, variants, spacing, radius, defaults, capsize } = theme;

	const themeColors = colors[mode ?? "light"] as LBConfig["colors"]["light"];
	if (!themeColors) {
		throw new Error("No colors found");
	}

	return useMemo(
		() => ({ colors: themeColors, typography, variants, spacing, radius, defaults, capsize }),
		[typography, variants, spacing, radius, defaults, capsize, themeColors]
	);
}
