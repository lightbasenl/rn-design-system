import { useContext } from "react";
import { View } from "react-native";
import type { Edge, SafeAreaViewProps } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import type { BoxTokens } from "../../hooks/useResolveBoxTokens";
import { useResolveBoxTokens } from "../../hooks/useResolveBoxTokens";

// If an emtpy SafeAreaView is placed to handle insets then its ignored, this ensures the insets area always applied
const styleFix = { minHeight: 1 };
export type SafeAreaBoxProps = BoxTokens & Omit<SafeAreaViewProps, "style">;
export const SafeAreaBox = ({
	children,
	edges,
	...props
}: Omit<SafeAreaBoxProps, "edges"> & { edges?: Edge[] }) => {
	const { tokenStyles, paddingValues, style, ...rest } = useResolveBoxTokens(props);
	const color = useContext(BackgroundContext);

	// SafeAreaView cannot be used as it causes flickering of insets for nested navigators
	// https://reactnavigation.org/docs/handling-safe-area/#summary
	const insets = useSafeAreaInsets();
	if (edges?.includes("top")) {
		const top = paddingValues.paddingTop ?? paddingValues.paddingVertical ?? paddingValues.padding ?? 0;
		if (typeof top !== "number") {
			throw new Error("vertical padding must be a number when used within a safe area");
		}
		paddingValues.paddingTop = insets.top + top;
	}
	if (edges?.includes("bottom")) {
		const bottom = paddingValues.paddingBottom ?? paddingValues.paddingVertical ?? paddingValues.padding ?? 0;
		if (typeof bottom !== "number") {
			throw new Error("vertical padding must be a number when used within a safe area");
		}
		paddingValues.paddingBottom = insets.bottom + bottom;
	}
	return (
		<BackgroundContext.Provider value={tokenStyles.backgroundColor ?? color}>
			<View style={[tokenStyles, paddingValues, styleFix, style]} {...rest}>
				{children}
			</View>
		</BackgroundContext.Provider>
	);
};
