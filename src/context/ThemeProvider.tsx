import type { ReactNode } from "react";
import React from "react";

import type { LBConfig } from "../types";

export const ThemeContext = React.createContext<LBConfig | null>(null);

type Props<T extends LBConfig> = {
  theme: T;
  children: ReactNode;
};
export function ThemeProvider<T extends LBConfig>({ theme, children }: Props<T>) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
