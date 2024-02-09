import type { ReactNode } from "react";
import { Children, isValidElement } from "react";
import flattenChildren from "react-keyed-flatten-children";

/**
 * Gets only the valid children of a component,
 * and ignores any nullish or falsy child.
 *
 * @param children the children
 */
export function getValidChildren(children: ReactNode) {
  return Children.toArray(flattenChildren(children)).filter((child) =>
    isValidElement(child)
  ) as React.ReactElement[];
}
