import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { useInternalTheme } from "../hooks/useInternalTheme";
import { mapMarginValue, mapPaddingValues, mapValues } from "../tools/mapValues";
import type {
  SpacingStyles,
  RadiusStyles,
  ColorStyles,
  MarginValues,
  ColorValues,
  BorderRadiusValues,
  PaddingValues,
  BorderValues,
  AlignmentValues,
} from "../types";

type BoxStyleTokens = SpacingStyles | RadiusStyles | ColorStyles | "shadow";
type ViewStyleModded = StyleProp<Omit<ViewStyle, BoxStyleTokens>>;

export type BoxTokens = {
  style?: ViewStyleModded;
  children?: ReactNode;
  testID?: string;
  width?: ViewStyle["width"];
  height?: ViewStyle["height"];
} & MarginValues &
  ColorValues &
  BorderRadiusValues &
  PaddingValues &
  BorderValues &
  AlignmentValues;

export function useResolveBoxTokens(props: BoxTokens) {
  const {
    backgroundColor,
    borderBottomColor,
    borderBottomLeftRadius,
    borderBottomRadius,
    borderBottomRightRadius,
    borderBottomWidth,
    borderColor,
    borderLeftColor,
    borderLeftRadius,
    borderLeftWidth,
    borderRadius,
    borderRightColor,
    borderRightRadius,
    borderRightWidth,
    borderTopColor,
    borderTopLeftRadius,
    borderTopRadius,
    borderTopRightRadius,
    borderTopWidth,
    borderWidth,

    flex,
    alignItems,
    alignSelf,
    flexDirection,
    flexWrap,
    justifyContent,

    padding,
    paddingBottom,
    paddingHorizontal,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingVertical,

    margin,
    marginBottom,
    marginHorizontal,
    marginLeft,
    marginRight,
    marginTop,
    marginVertical,

    width,
    height,

    ...rest
  } = props;

  const theme = useInternalTheme();
  const marginValues = mapMarginValue(
    {
      margin,
      marginBottom,
      marginHorizontal,
      marginLeft,
      marginRight,
      marginTop,
      marginVertical,
    },
    theme.spacing
  );

  const paddingValues = mapPaddingValues(
    {
      padding,
      paddingBottom,
      paddingHorizontal,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingVertical,
    },
    theme.spacing
  );

  const colorValues = mapValues(
    {
      borderColor,
      borderBottomColor,
      borderLeftColor,
      borderRightColor,
      borderTopColor,
      backgroundColor,
    },
    (value) => {
      if (typeof value === "object") {
        return value.custom;
      }
      if (typeof value === "string") {
        return theme.colors[value];
      }
      return undefined;
    }
  );

  const borderRadiusValues = mapValues(
    {
      borderBottomLeftRadius:
        borderBottomLeftRadius ?? borderBottomRadius ?? borderLeftRadius ?? borderRadius,
      borderBottomRightRadius:
        borderBottomRightRadius ?? borderBottomRadius ?? borderRightRadius ?? borderRadius,
      borderTopLeftRadius: borderTopLeftRadius ?? borderTopRadius ?? borderLeftRadius ?? borderRadius,
      borderTopRightRadius: borderTopRightRadius ?? borderTopRadius ?? borderRightRadius ?? borderRadius,
      borderRadius,
    },
    (value) => {
      if (typeof value === "object") {
        return value.custom;
      }
      if (typeof value === "string") {
        return theme.radius[value];
      }
      return undefined;
    }
  );

  return {
    tokenStyles: {
      alignItems,
      alignSelf,
      flexDirection,
      flex,
      flexWrap,
      justifyContent,
      borderBottomWidth,
      borderLeftWidth,
      borderRightWidth,
      borderTopWidth,
      borderWidth,
      width,
      height,
      ...marginValues,
      ...colorValues,
      ...borderRadiusValues,
    },
    paddingValues,
    ...rest,
  };
}
