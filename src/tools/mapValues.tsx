import type { MarginValues, SpaceKey, PaddingValues } from "../types";

type ObjectMapper<T, U> = (value: T) => U;

export function mapValues<T extends object, U>(
  object: T,
  mapper: ObjectMapper<T[keyof T], U>
): { [K in keyof T]: U } {
  const result = {} as { [K in keyof T]: U };

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = mapper(object[key]);
    }
  }

  return result;
}

export const mapMarginValue = (margins: MarginValues, spacingConfig: Record<string, number>) =>
  mapValues(margins, (value) => {
    if (!value) {
      return undefined;
    }
    if (spacingConfig == null) {
      throw new Error("Spacing not configured in theme");
    }
    if (typeof value === "object") {
      if (value.custom == null) {
        return;
      }
      if (typeof value.custom === "number" && value.custom > 0) {
        console.warn(
          "Only negative margins are supported for the Box Component, use padding props, or utilise the Stack or Row components"
        );
        return;
      }
      return value.custom;
    }

    const spaceValue = value?.replace("-", "") as SpaceKey;
    const spaceReturn = spacingConfig[spaceValue];

    if (typeof spaceReturn !== "number") {
      throw new Error("Invalid spacing value");
    }
    return -1 * spaceReturn;
  });

export const mapPaddingValues = (paddingValues: PaddingValues, spacingConfig: Record<string, number>) => {
  return mapValues(paddingValues, (value) => {
    if (typeof value === "object") {
      return value.custom;
    }
    if (typeof value === "string") {
      if (spacingConfig[value] == null) {
        throw new Error(`Padding value: ${value} is not included in the current theme configuration`);
      }
      return spacingConfig[value];
    }
    return undefined;
  });
};
