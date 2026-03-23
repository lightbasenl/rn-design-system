import type { NavigationProp, ParamListBase } from "@react-navigation/native";

let cachedUseNavigation: (() => NavigationProp<ParamListBase>) | null = null;

function resolveUseNavigation(): () => NavigationProp<ParamListBase> {
	if (cachedUseNavigation) return cachedUseNavigation;

	// Try expo-router first (more common in modern Expo projects)
	try {
		const expoRouter = require("expo-router");
		if (expoRouter.useNavigation) {
			cachedUseNavigation = expoRouter.useNavigation;
			if (!cachedUseNavigation) {
				throw new Error(
					"No navigation library found. Install either expo-router or @react-navigation/native."
				);
			}
			return cachedUseNavigation;
		}
	} catch {}

	// Fallback to react-navigation
	try {
		const reactNavigation = require("@react-navigation/native");
		cachedUseNavigation = reactNavigation.useNavigation;
		if (!cachedUseNavigation) {
			throw new Error("No navigation library found. Install either expo-router or @react-navigation/native.");
		}
		return cachedUseNavigation;
	} catch {}

	throw new Error("No navigation library found. Install either expo-router or @react-navigation/native.");
}

export function useNavigation() {
	const hook = resolveUseNavigation();
	return hook();
}
