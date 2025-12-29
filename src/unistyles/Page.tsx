import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { ComponentPropsWithoutRef, ComponentType, ReactElement } from "react";
import { memo, useLayoutEffect } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { ScrollableBoxProps } from "../types";
import { resolveBoxTokens } from "./resolveBoxTokens";
import { BackgroundContext } from "./useBackgroundColor";
import { extractBoxTokens } from "./utils";

type BasePageProps = Omit<ScrollableBoxProps, "edges"> & {
	options?: NativeStackNavigationOptions;
};

type PageProps<T extends ComponentType<ScrollViewProps>> = BasePageProps &
	Omit<ComponentPropsWithoutRef<T>, keyof BasePageProps> & {
		scrollComponent?: T;
	};

const ScrollViewWithUnistyles = memo(withUnistyles(ScrollView));

function PageInner<T extends ComponentType<ScrollViewProps> = typeof ScrollView>(
	props: PageProps<T>
): ReactElement {
	const { scrollComponent, style, contentContainerStyle, backgroundColor, options, ...rest } = props;

	const navigation = useNavigation();

	useLayoutEffect(() => {
		if (options && Object.keys(options).length) {
			navigation.setOptions(options);
		}
	}, [navigation, options]);

	const { viewProps, boxProps } = extractBoxTokens<ScrollViewProps>({ backgroundColor, ...rest });

	// Use the provided component or default to ScrollView
	const ScrollComponent = scrollComponent
		? (memo(withUnistyles(scrollComponent)) as unknown as typeof ScrollView)
		: ScrollViewWithUnistyles;

	// Apply contentInsetAdjustmentBehavior only for ScrollView (default or explicit)
	const isScrollView = !scrollComponent || (scrollComponent as ComponentType<ScrollViewProps>) === ScrollView;
	const defaultProps = isScrollView ? { contentInsetAdjustmentBehavior: "automatic" as const } : {};

	if (!backgroundColor) {
		return (
			<ScrollComponent
				{...defaultProps}
				contentContainerStyle={[styles.contentContainer(boxProps), contentContainerStyle]}
				style={[styles.container(boxProps), style]}
				{...viewProps}
			/>
		);
	}

	return (
		<BackgroundContext.Provider value={backgroundColor}>
			<ScrollComponent
				{...defaultProps}
				contentContainerStyle={[styles.contentContainer(boxProps), contentContainerStyle]}
				style={[styles.container(boxProps), style]}
				{...viewProps}
			/>
		</BackgroundContext.Provider>
	);
}

PageInner.displayName = "Page";

// Export with proper generic typing
export const Page = PageInner as <T extends ComponentType<ScrollViewProps> = typeof ScrollView>(
	props: PageProps<T>
) => ReactElement;

const styles = StyleSheet.create((theme) => ({
	contentContainer: (props: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles, paddingValues } = resolveBoxTokens({ ...theme.defaults.Screen, ...props }, theme);
		return {
			flexGrow: tokenStyles.flex,
			...paddingValues,
		};
	},
	container: (props: ReturnType<typeof extractBoxTokens>["boxProps"]) => {
		const { tokenStyles } = resolveBoxTokens({ ...theme.defaults.Screen, ...props }, theme);
		const { flex, ...styles } = tokenStyles;
		return styles;
	},
}));
