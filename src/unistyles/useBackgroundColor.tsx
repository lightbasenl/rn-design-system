import { createContext, useContext } from "react";
import type { ColorThemeKeys } from "../types";

export const BackgroundContext = createContext<ColorThemeKeys | null>(null);
export function useBackgroundColor() {
	const color = useContext(BackgroundContext);
	if (!color) {
		return "rgba(255,255,255,0.0)";
	}
	return color;
}
