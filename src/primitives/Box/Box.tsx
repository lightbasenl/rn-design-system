import { forwardRef, useContext } from "react";
import { View } from "react-native";
import type { SafeAreaViewProps } from "react-native-safe-area-context";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import type { BoxTokens } from "../../hooks/useResolveBoxTokens";
import { useResolveBoxTokens } from "../../hooks/useResolveBoxTokens";

export type BoxProps = BoxTokens & Omit<SafeAreaViewProps, "style">;
export const Box = forwardRef<View, BoxProps>(({ style, children, ...props }, ref) => {
	const { tokenStyles, style: updatedStyle, paddingValues, ...rest } = useResolveBoxTokens(props);
	const color = useContext(BackgroundContext);
	return (
		<BackgroundContext.Provider value={tokenStyles.backgroundColor ?? color}>
			<View ref={ref} style={[tokenStyles, style, paddingValues, updatedStyle]} {...rest}>
				{children}
			</View>
		</BackgroundContext.Provider>
	);
});
