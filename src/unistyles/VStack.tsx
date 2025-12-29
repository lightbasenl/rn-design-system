import { createStack, type VStackProps } from "./createStack";

export type { VStackProps };

export const VStack = createStack({ direction: "vertical" });
