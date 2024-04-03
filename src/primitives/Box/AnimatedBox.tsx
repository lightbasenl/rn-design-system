import { forwardRef, useContext } from "react";
import Animated from "react-native-reanimated";
import type { SafeAreaViewProps } from "react-native-safe-area-context";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import type { BoxTokens } from "../../hooks/useResolveBoxTokens";
import { useResolveBoxTokens } from "../../hooks/useResolveBoxTokens";

// Make sure to use the default style prop to allow any animation
export type AnimatedBoxProps = Omit<BoxTokens, "style"> & SafeAreaViewProps;
export const AnimatedBox = forwardRef<Animated.View, AnimatedBoxProps>(
	({ style, children, ...props }, ref) => {
		const { tokenStyles, paddingValues, ...rest } = useResolveBoxTokens(props);
		const color = useContext(BackgroundContext);

		return (
			<BackgroundContext.Provider value={tokenStyles.backgroundColor ?? color}>
				<Animated.View ref={ref} style={[tokenStyles, paddingValues, style]} {...rest}>
					{children}
				</Animated.View>
			</BackgroundContext.Provider>
		);
	}
);
