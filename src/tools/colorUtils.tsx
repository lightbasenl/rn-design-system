import { TinyColor } from "@ctrl/tinycolor";

export const transparentize = (color: string, opacity: number) => {
  return new TinyColor(color).setAlpha(opacity).toRgbString();
};

export const getActiveColor = (x: string) => {
  const activeColor = new TinyColor(x);
  return activeColor.isLight()
    ? activeColor.darken(10).toHex8String()
    : activeColor.lighten(10).toHex8String();
};
