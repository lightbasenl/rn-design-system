import { TinyColor } from "@ctrl/tinycolor";

import { type ReactElement, createContext, useContext } from "react";
import { ActivityIndicator, Pressable, type PressableProps } from "react-native";
import Animated, {
	type AnimatedStyle,
	Easing,
	interpolate,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { useBackgroundColor } from "../hooks/useBackgroundColor";

import { StyleSheet, UnistylesRuntime, withUnistyles } from "react-native-unistyles";
import { getActiveColor } from "../tools/colorUtils";
import { getButtonVariants } from "../tools/getButtonVariants";
import type { BoxProps, ButtonVariants, ColorThemeKeys } from "../types";
import { HStack, type HStackProps } from "../unistyles/HStack";
import { Text, type TextProps } from "../unistyles/Text";
import { resolveBoxTokens } from "../unistyles/resolveBoxTokens";
import { resolveColor } from "../unistyles/utils";

type OmittedBoxProps = Omit<
	BoxProps,
	"alignItems" | "alignSelf" | "flexDirection" | "flexWrap" | "justifyContent" | "style"
>;

type ButtonSpecificProps = {
	variant?: ButtonVariants;
	textColor?: TextProps["color"];
	onPressBorderColor?: ColorThemeKeys | null;
	onPressColor?: ColorThemeKeys | null;
	themeColor?: ColorThemeKeys | null;
	textVariant?: TextProps["variant"];
	/**
	 * Row Props
	 */
	space?: HStackProps["space"];
	alignVertical?: HStackProps["alignVertical"];
	alignHorizontal?: HStackProps["alignHorizontal"];
	/**
	 * ReanimatedV2 value representing the scale of the Button when onPressIn is trigger
	 * @default 0.99
	 */
	onPressAnimatedScale?: number;
	/**
	 * If true, the button will show a spinner instead of the children components
	 */
	isLoading?: boolean;
	LoadingComponent?: ReactElement;
	style?: AnimatedStyle;
};
export type ButtonProps = Omit<PressableProps, "style"> & OmittedBoxProps & ButtonSpecificProps;

const ButtonContext = createContext<Partial<ButtonProps> | null>(null);
function useButtonContext() {
	const variant = useContext(ButtonContext);
	if (!variant) {
		throw new Error("Button variant has not been defined");
	}
	return variant;
}

const UniActivityIndicator = withUnistyles(ActivityIndicator);
const UniPressable = withUnistyles(Pressable);

export function Button({
	variant,
	themeColor,
	isLoading,
	children,
	LoadingComponent,
	...props
}: ButtonProps) {
	const theme = UnistylesRuntime.getTheme();
	const defaultButtonVariant = theme.defaults.Button.variant;
	const defaultButtonThemeColor = theme.defaults.Button.themeColor;

	const parentBackGroundColor = useBackgroundColor();

	const defaultVariant = variant ?? defaultButtonVariant ?? "solid";

	const variants = getButtonVariants({
		themeColor: themeColor ?? defaultButtonThemeColor,
		parentBackGroundColor,
		variant: defaultVariant,
		theme: UnistylesRuntime.getTheme(),
	});

	const combinedProps = { ...variants, ...props };

	const {
		onPressAnimatedScale,
		onPress,
		disabled,
		onPressColor,
		onPressBorderColor,
		style,
		space,
		alignVertical = "center",
		alignHorizontal = "center",
		...remainingProps
	} = combinedProps;

	const { tokenStyles, paddingValues, ...rest } = resolveBoxTokens(remainingProps, theme);

	const pressColor = onPressColor
		? resolveColor(onPressColor, theme.colors)
		: getActiveColor(tokenStyles.backgroundColor ?? parentBackGroundColor);

	const pressBorderColor = resolveColor(
		onPressBorderColor ?? (pressColor ? { custom: pressColor } : undefined),
		theme.colors
	);
	const resolvedBackgroundColor = tokenStyles.backgroundColor ?? parentBackGroundColor;
	const resolvedBorderColor = tokenStyles.borderColor ?? resolvedBackgroundColor;

	const anim = useSharedValue(0);
	const animateTo = (toValue: number, duration: number) => {
		anim.set(
			withTiming(toValue, {
				duration,
				easing: Easing.inOut(Easing.quad),
			})
		);
	};

	const handlePressIn = () => {
		animateTo(1, 200);
	};

	const handlePressOut = () => {
		animateTo(0, 200);
	};

	const endBackgroundColor = pressColor ? new TinyColor(pressColor).toHexString() : undefined;
	const startBackgroundColor =
		resolvedBackgroundColor === "transparent"
			? pressColor
				? new TinyColor(pressColor).setAlpha(0).toHexString()
				: undefined
			: resolvedBackgroundColor;

	const animatedStyle = useAnimatedStyle(() => {
		return {
			backgroundColor:
				onPressColor !== null && startBackgroundColor && endBackgroundColor
					? interpolateColor(anim.get(), [0, 1], [startBackgroundColor, endBackgroundColor], "RGB", {
							gamma: 2.1,
						})
					: undefined,
			borderColor:
				onPressBorderColor !== null && resolvedBorderColor && pressBorderColor
					? interpolateColor(anim.get(), [0, 1], [resolvedBorderColor, pressBorderColor], "RGB", {
							gamma: 2.1,
						})
					: undefined,
			overflow: "hidden",
			transform:
				onPressAnimatedScale != null
					? [{ scale: interpolate(anim.get(), [0, 1], [1, onPressAnimatedScale]) }]
					: undefined,
		};
	});

	const _LoadingComponent = LoadingComponent ?? (
		<UniActivityIndicator
			uniProps={(theme) => ({
				color: resolveColor(combinedProps.textColor, theme.colors),
			})}
		/>
	);

	return (
		<ButtonContext.Provider value={combinedProps}>
			<UniPressable
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				uniProps={(theme) => {
					const { tokenStyles } = resolveBoxTokens(remainingProps, theme);
					return {
						android_ripple: {
							color: pressColor === "transparent" ? undefined : pressColor,
							radius: tokenStyles.borderRadius,
						},
					};
				}}
				onPress={onPress}
				disabled={!!isLoading || !!disabled}
				style={styles.button(remainingProps)}
				{...rest}
			>
				<Animated.View style={[animatedStyle, styles.container(remainingProps), style]}>
					<HStack
						space={space}
						alignVertical={alignVertical}
						alignHorizontal={alignHorizontal}
						style={styles.hStack(remainingProps)}
					>
						{isLoading ? _LoadingComponent : children}
					</HStack>
				</Animated.View>
			</UniPressable>
		</ButtonContext.Provider>
	);
}

const styles = StyleSheet.create((theme) => ({
	button: (props) => {
		const { tokenStyles } = resolveBoxTokens(props, theme);
		return { flex: tokenStyles.flex, width: tokenStyles.width, height: tokenStyles.height };
	},
	container: (props) => {
		const { paddingValues, tokenStyles } = resolveBoxTokens(props, theme);
		return { ...paddingValues, ...tokenStyles };
	},
	hStack: (props) => {
		const { tokenStyles } = resolveBoxTokens(props, theme);
		return {
			height: tokenStyles.height ?? "100%",
			width: tokenStyles.width ?? "100%",
		};
	},
}));

function ButtonText({ children, variant: textVariant, ...props }: Omit<TextProps, "family">) {
	const variant = useButtonContext();
	const defaults = UnistylesRuntime.getTheme().defaults;
	const variants = UnistylesRuntime.getTheme().variants;

	const variantText = textVariant ?? variant.textVariant ?? defaults.Button.textVariant;
	const textVariants = variants.Text;

	const variantTextColor =
		variantText && textVariants[variantText]?.color ? textVariants[variantText]?.color : undefined;

	return (
		<Text textAlign="center" color={variant.textColor ?? variantTextColor} variant={variantText} {...props}>
			{children}
		</Text>
	);
}

Button.Text = ButtonText;
