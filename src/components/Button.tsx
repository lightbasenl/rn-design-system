import { createContext, type ReactElement, useContext } from "react";
import { ActivityIndicator, Pressable, type ViewProps } from "react-native";
import Animated, {
	type AnimatedStyle,
	Easing,
	interpolate,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { StyleSheet, UnistylesRuntime, withUnistyles } from "react-native-unistyles";
import { runOnJS } from "react-native-worklets";
import { getButtonVariants } from "../tools/getButtonVariants";
import type { BoxProps, ButtonVariants, ColorThemeKeys } from "../types";
import { HStack, type HStackProps } from "../unistyles/HStack";
import { resolveBoxTokens } from "../unistyles/resolveBoxTokens";
import { Text, type TextProps } from "../unistyles/Text";
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
export type ButtonProps = Omit<ViewProps, "style"> &
	OmittedBoxProps &
	ButtonSpecificProps & { disabled?: boolean; onPress?: () => void };

const ButtonContext = createContext<Partial<ButtonProps> | null>(null);
function useButtonContext() {
	const variant = useContext(ButtonContext);
	if (!variant) {
		throw new Error("Button variant has not been defined");
	}
	return variant;
}

const UniActivityIndicator = withUnistyles(ActivityIndicator);

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

	const defaultVariant = variant ?? defaultButtonVariant ?? "solid";

	const variants = getButtonVariants({
		themeColor: themeColor ?? defaultButtonThemeColor,
		variant: defaultVariant,
		theme: UnistylesRuntime.getTheme(),
	});

	console.log(JSON.stringify({ variants }, null, 2));
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

	const bgColor = tokenStyles.backgroundColor ?? "transparent";
	const borderColor = tokenStyles.borderColor ?? "transparent";

	const pressColor = onPressColor ? resolveColor(onPressColor, theme.colors) : bgColor;
	const pressBorderColor = onPressBorderColor ? resolveColor(onPressBorderColor, theme.colors) : bgColor;

	const anim = useSharedValue(0);

	const animateTo = (toValue: number, duration: number) => {
		anim.set(withTiming(toValue, { duration, easing: Easing.inOut(Easing.quad) }));
	};

	const handlePressIn = () => {
		animateTo(1, 200);
	};

	const handlePressOut = () => {
		animateTo(0, 200);
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: interpolateColor(anim.get(), [0, 1], [bgColor, pressColor]),
			borderColor:
				onPressBorderColor !== null && borderColor && pressBorderColor
					? interpolateColor(anim.get(), [0, 1], [borderColor, pressBorderColor], "RGB", {
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
				color: combinedProps.textColor ? resolveColor(combinedProps.textColor, theme.colors) : undefined,
			})}
		/>
	);

	return (
		<ButtonContext.Provider value={combinedProps}>
			<Pressable
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onPress={onPress}
				disabled={disabled || isLoading || !onPress}
			>
				<Animated.View
					style={[animatedStyle, styles.container(remainingProps), style]}
					accessibilityRole="button"
					accessibilityState={{ disabled }}
					{...rest}
				>
					<HStack
						space={space}
						alignVertical={alignVertical}
						alignHorizontal={alignHorizontal}
						style={styles.hStack(remainingProps)}
					>
						{isLoading ? _LoadingComponent : children}
					</HStack>
				</Animated.View>
			</Pressable>
		</ButtonContext.Provider>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: (props) => {
		const { paddingValues, tokenStyles } = resolveBoxTokens(props, theme);
		return { ...paddingValues, ...tokenStyles };
	},
	hStack: (props) => {
		const { tokenStyles } = resolveBoxTokens(props, theme);
		return {
			height: tokenStyles.height ? "100%" : undefined,
			width: tokenStyles.width ? "100%" : undefined,
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
