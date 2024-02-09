import React, { useContext } from "react";

export const BackgroundContext = React.createContext<string | null>(null);
export function useBackgroundColor() {
  const color = useContext(BackgroundContext);
  if (!color) {
    return "rgba(255,255,255,0.0)";
  }
  return color;
}
