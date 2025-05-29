import { type UnistylesThemes, useUnistyles } from "react-native-unistyles";

/** @deprecated this is used for migration, use unistyles stylesheet instead, or worst case use unistyles import directly*/
export const useInternalTheme = (): UnistylesThemes[keyof UnistylesThemes] => {
	const { theme } = useUnistyles();
	return theme;
};
