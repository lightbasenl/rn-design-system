import Animated from "react-native-reanimated";
import { createStack, type VStackProps } from "./createStack";

export type { VStackProps };

export const VStack = createStack({ direction: "vertical" });

/** @deprecated Use VStack instead */
export const AnimatedBox = Animated.createAnimatedComponent(VStack);

/** @deprecated Use VStack instead */
export const Box = VStack;

/** @deprecated Use VStack instead */
export const SafeAreaBox = VStack;

/** @deprecated Use VStack instead */
export const Stack = VStack;
