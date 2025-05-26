import type { ColorThemeKeys } from "@lightbase/rn-design-system";
import { createContext, useContext } from "react";

export const BackgroundContext = createContext<ColorThemeKeys | null>(null);
export function useBackgroundColor() {
	const color = useContext(BackgroundContext);
	if (!color) {
		return "rgba(255,255,255,0.0)";
	}
	return color;
}
