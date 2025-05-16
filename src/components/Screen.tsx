import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { ReactElement, ReactNode, RefObject } from "react";
import { useLayoutEffect } from "react";
import type { FlatList, ScrollView, SectionList, View } from "react-native";
import { StyleSheet } from "react-native";
import type Animated from "react-native-reanimated";
import type { Edge, SafeAreaViewProps } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGetBottomTabBarHeight, useGetHeaderHeight } from "../hooks/useGetNavigationHeights";
import { useInternalTheme } from "../hooks/useInternalTheme";
import type { AnimatedFlatListBoxProps } from "../primitives/Box/AnimatedFlatListBox";
import { AnimatedFlatListBox } from "../primitives/Box/AnimatedFlatListBox";
import type { AnimatedScrollViewBoxProps } from "../primitives/Box/AnimatedScrollViewBox";
import { AnimatedScrollViewBox } from "../primitives/Box/AnimatedScrollViewBox";
import type { BoxProps } from "../primitives/Box/Box";
import { Box } from "../primitives/Box/Box";
import type { FlatListBoxProps } from "../primitives/Box/FlatListBox";
import { FlatListBox } from "../primitives/Box/FlatListBox";
import type { KeyboardAwareScrollViewBoxProps } from "../primitives/Box/KeyboardAwareScrollViewBox";
import { KeyboardAwareScrollViewBox } from "../primitives/Box/KeyboardAwareScrollViewBox";
import { SafeAreaBox } from "../primitives/Box/SafeAreaBox";
import type { ScrollViewBoxProps } from "../primitives/Box/ScrollViewBox";
import { ScrollViewBox } from "../primitives/Box/ScrollViewBox";
import type { SectionListBoxProps } from "../primitives/Box/SectionListBox";
import { SectionListBox } from "../primitives/Box/SectionListBox";

export type ScreenBaseProps = {
	options?: NativeStackNavigationOptions;
	mode?: SafeAreaViewProps["mode"];
	edges?: Edge[];
	backgroundComponent?: ReactElement | null;
	absolutePositionedTabBar?: boolean;
};

export type ScreenProps<T, S> = ScreenBaseProps &
	(
		| ({ as?: "View"; ref?: RefObject<View> } & BoxProps)
		| ({ as: "ScrollView"; ref?: RefObject<ScrollView> } & ScrollViewBoxProps)
		| ({ as: "AnimatedScrollView"; ref?: RefObject<Animated.ScrollView> } & AnimatedScrollViewBoxProps)
		| ({ as: "FlatList"; ref?: RefObject<FlatList> } & FlatListBoxProps<T>)
		| ({ as: "AnimatedFlatList"; ref?: RefObject<Animated.FlatList<T>> } & AnimatedFlatListBoxProps<T>)
		| ({ as: "SectionList"; ref?: RefObject<SectionList<T, S>> } & SectionListBoxProps<T, S>)
		| ({ as: "KeyboardAwareScrollView"; ref?: RefObject<ScrollView> } & KeyboardAwareScrollViewBoxProps)
	);

export function Screen<T, S = any>(p: ScreenProps<T, S>) {
	const { defaults } = useInternalTheme();
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();

	const combinedProps = { ...defaults.Screen, ...p, options: { ...defaults.Screen.options, ...p.options } };
	const { options, mode, edges, backgroundComponent, backgroundColor, absolutePositionedTabBar, ...props } =
		combinedProps;

	useLayoutEffect(() => {
		if (options) {
			navigation.setOptions(options);
		}
	}, [navigation, options]);

	let headerHeight = useGetHeaderHeight();
	let bottomTabHeight = useGetBottomTabBarHeight();

	const customEdges = ["left", "right"] as Edge[];
	const containerprops = { backgroundColor, backgroundComponent } as BoxProps & {
		backgroundComponent?: ReactElement | null;
	};

	if (headerHeight === 0) {
		if (mode === "margin") {
			containerprops.paddingTop = { custom: insets.top };
		} else {
			customEdges.push("top");
		}
	}

	if (options?.headerTransparent !== true) {
		headerHeight = 0;
	}

	if (bottomTabHeight === 0 || absolutePositionedTabBar) {
		customEdges.push("bottom");
	}

	if (!absolutePositionedTabBar) {
		bottomTabHeight = 0;
	}

	const edgeArray = edges ?? customEdges;

	if (props.as === "ScrollView") {
		const { children, ...rest } = props;
		return (
			<ScreenContainer {...containerprops}>
				<ScrollViewBox flex={1} {...rest}>
					<SafeAreaBox
						edges={edgeArray}
						paddingTop={{ custom: headerHeight }}
						paddingBottom={{ custom: bottomTabHeight }}
						flex={1}
					>
						{children}
					</SafeAreaBox>
				</ScrollViewBox>
			</ScreenContainer>
		);
	}

	if (props.as === "KeyboardAwareScrollView") {
		const { children, ...rest } = props;
		return (
			<ScreenContainer backgroundColor={backgroundColor}>
				<KeyboardAwareScrollViewBox
					flex={1}
					paddingTop={{ custom: headerHeight }}
					paddingBottom={{ custom: bottomTabHeight }}
					{...rest}
				>
					<SafeAreaBox edges={edgeArray} flex={1}>
						{children}
					</SafeAreaBox>
				</KeyboardAwareScrollViewBox>
			</ScreenContainer>
		);
	}

	if (props.as === "AnimatedScrollView") {
		const { children, ...rest } = props;
		return (
			<ScreenContainer {...containerprops}>
				<AnimatedScrollViewBox flex={1} {...rest}>
					<SafeAreaBox
						edges={edgeArray}
						paddingTop={{ custom: headerHeight }}
						paddingBottom={{ custom: bottomTabHeight }}
						flex={1}
					>
						{children as ReactNode}
					</SafeAreaBox>
				</AnimatedScrollViewBox>
			</ScreenContainer>
		);
	}

	if (props.as === "FlatList") {
		const { children, ListHeaderComponent, ListFooterComponent, ...rest } = props;
		return (
			<ScreenContainer {...containerprops}>
				<FlatListBox
					flex={1}
					ListHeaderComponent={
						<SafeAreaBox
							edges={edgeArray.includes("top") ? ["top"] : ["left", "right"]}
							paddingTop={{ custom: headerHeight }}
						>
							{/* biome-ignore lint/complexity/noUselessFragments: <explanation> */}
							<>{ListHeaderComponent}</>
						</SafeAreaBox>
					}
					ListFooterComponent={
						<SafeAreaBox
							edges={edgeArray.includes("bottom") ? ["bottom"] : ["left", "right"]}
							paddingBottom={{ custom: bottomTabHeight }}
						>
							{/* biome-ignore lint/complexity/noUselessFragments: <explanation> */}
							<>{ListFooterComponent}</>
						</SafeAreaBox>
					}
					{...rest}
				/>
			</ScreenContainer>
		);
	}

	if (props.as === "AnimatedFlatList") {
		const { children, ListHeaderComponent, ListFooterComponent, ...rest } = props;
		return (
			<ScreenContainer {...containerprops}>
				<AnimatedFlatListBox
					flex={1}
					ListHeaderComponent={
						<SafeAreaBox
							edges={edgeArray.includes("top") ? ["top"] : ["left", "right"]}
							paddingTop={{ custom: headerHeight }}
						>
							{/* biome-ignore lint/complexity/noUselessFragments: <explanation> */}
							<>{ListHeaderComponent}</>
						</SafeAreaBox>
					}
					ListFooterComponent={
						<SafeAreaBox
							edges={edgeArray.includes("bottom") ? ["bottom"] : ["left", "right"]}
							paddingBottom={{ custom: bottomTabHeight }}
						>
							{/* biome-ignore lint/complexity/noUselessFragments: <explanation> */}
							<>{ListFooterComponent}</>
						</SafeAreaBox>
					}
					{...rest}
				/>
			</ScreenContainer>
		);
	}

	if (props.as === "SectionList") {
		const { children, ListHeaderComponent, ListFooterComponent, ...rest } = props;
		return (
			<ScreenContainer {...containerprops}>
				<SectionListBox
					flex={1}
					ListHeaderComponent={
						<SafeAreaBox
							edges={edgeArray.includes("top") ? ["top"] : ["left", "right"]}
							paddingTop={{ custom: headerHeight }}
						>
							{/* biome-ignore lint/complexity/noUselessFragments: <explanation> */}
							<>{ListHeaderComponent}</>
						</SafeAreaBox>
					}
					ListFooterComponent={
						<SafeAreaBox
							edges={edgeArray.includes("bottom") ? ["bottom"] : ["left", "right"]}
							paddingBottom={{ custom: bottomTabHeight }}
						>
							{/* biome-ignore lint/complexity/noUselessFragments: <explanation> */}
							<>{ListFooterComponent}</>
						</SafeAreaBox>
					}
					{...rest}
				/>
			</ScreenContainer>
		);
	}

	if (!edgeArray?.length) {
		const { children, ...rest } = props;
		return (
			<ScreenContainer
				paddingTop={{ custom: headerHeight }}
				paddingBottom={{ custom: bottomTabHeight }}
				{...containerprops}
			>
				<Box flex={1} {...rest}>
					{children}
				</Box>
			</ScreenContainer>
		);
	}

	const { children, ...rest } = props;
	return (
		<ScreenContainer
			paddingTop={{ custom: headerHeight }}
			paddingBottom={{ custom: bottomTabHeight }}
			{...containerprops}
		>
			<SafeAreaBox edges={edgeArray} flex={1} {...rest}>
				{children}
			</SafeAreaBox>
		</ScreenContainer>
	);
}

function ScreenContainer({
	backgroundColor,
	backgroundComponent,
	children,
	...rest
}: {
	backgroundComponent?: ReactElement | null;
} & BoxProps) {
	return (
		<Box flex={1} backgroundColor={backgroundColor} {...rest}>
			{!!backgroundComponent && <Box style={StyleSheet.absoluteFill}>{backgroundComponent}</Box>}
			{children}
		</Box>
	);
}
