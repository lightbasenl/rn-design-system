import { type ReactNode, createContext } from "react";

import type { LBConfig } from "../types";

export const ThemeContext = createContext<LBConfig | null>(null);

type Props<T extends LBConfig> = {
	theme: T;
	children: ReactNode;
};
export function ThemeProvider<T extends LBConfig>({ theme, children }: Props<T>) {
	return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
