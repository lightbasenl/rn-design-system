export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export function mergeDeepRight<T>(...objects: T[]): T {
  if (objects.length < 2) {
    throw new Error("At least two objects are required for merging.");
  }

  const isObject = (obj: any): obj is object => obj !== null && typeof obj === "object";

  return objects.reduce<T>((merged, obj) => {
    if (!isObject(obj)) {
      throw new Error("Invalid argument. Only objects can be merged.");
    }

    Object.keys(obj).forEach((key) => {
      const typedKey = key as keyof T;
      if (isObject(obj[typedKey]) && isObject(merged[typedKey])) {
        merged[typedKey] = mergeDeepRight(merged[typedKey], obj[typedKey]);
      } else {
        merged[typedKey] = obj[typedKey];
      }
    });

    return merged;
  }, {} as T);
}
