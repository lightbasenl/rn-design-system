import { createtheme } from "@lightbase/rn-design-system";

import { fontConfig } from "./theme.typography";

// declare module "@lightbase/rn-design-system" {
//   export interface LBCustomConfig extends CustomTheme {}
//   // function useInternalTheme(mode?: "light" | "dark"): {
//   //   colors: LBCustomConfig["colors"]["light"];
//   //   typography: LBCustomConfig["typography"];
//   //   variants: LBCustomConfig["variants"];
//   //   spacing: LBCustomConfig["spacing"];
//   //   radius: LBCustomConfig["radius"];
//   //   defaults: LBCustomConfig["defaults"];
//   // };
// }

const colors = {
	"red-800": "#570600",
	"red-700": "#820A01",
	"red-600": "#AE0D01",
	"red-500": "#D91001",
	"red-400": "#E14034",
	"red-300": "#E87067",
	"red-250": "#EC8780",
	"red-200": "#F09F99",
	"red-100": "#F7CFCC",
	"red-50": "#FBE7E6",
	"red-25": "#FEF5F5",

	"blue-900": "#112F58",
	"blue-800": "#234A82",
	"blue-700": "#3466AB",
	"blue-600": "#4681D5",
	"blue-500": "#579DFF",
	"blue-400": "#79B1FF",
	"blue-300": "#9AC4FF",
	"blue-200": "#BCD8FF",
	"blue-100": "#CCE0FF",
	"blue-50": "#DDEBFF",
	"blue-25": "#EEF5FF",

	"green-800": "#009F38",
	"green-700": "#255D24",
	"green-600": "#30732E",
	"green-500": "#3D8D3C",
	"green-400": "#60B778",
	"green-300": "#96D7B5",
	"green-200": "#BAE6D2",
	"green-100": "#CCECD7",
	"green-50": "#F0FAF6",

	"grey-800": "#2D2D2E",
	"grey-700": "#464646",
	"grey-600": "#5E5E5E",
	"grey-500": "#757575",
	"grey-400": "#919191",
	"grey-300": "#ACACAC",
	"grey-200": "#C8C8C8",
	"grey-100": "#E0E0E0",
	"grey-50": "#F4F4F4",

	"blue-grey-800": "#373D41",
	"blue-grey-700": "#525C62",
	"blue-grey-600": "#6D7A82",
	"blue-grey-500": "#8798A2",
	"blue-grey-400": "#9FADB5",
	"blue-grey-300": "#B7C1C7",
	"blue-grey-250": "#DAE1E4",
	"blue-grey-200": "#E7EAEC",
	"blue-grey-100": "#E9EEF1",
	"blue-grey-50": "#F3F5F6",

	white: "#FFFFFF",
	black: "#2D2D2E",
	"light-grey": "#F4F4F4",
	"dark-grey": "#757575",
	"green-grey": "#DCE1DC",
	"standard-grey": "#E0E0E0",
	"blue-grey": "#E9EEF1",
};

export type CustomTheme = typeof customTheme;
export const customTheme = createtheme({
	colors: {
		light: {
			white: colors.white,
			black: colors.black,
			"jaarbeurs-red": colors["red-500"],
			"jaarbeurs-green": colors["green-500"],
			info: colors["blue-500"],
			danger: colors["red-500"],
			positive: colors["green-400"],
			primary: colors["red-500"],
			secondary: colors["green-500"],
			tertiary: colors["green-grey"],
			canvas: colors["blue-grey-200"],

			"card-background": colors.white,
			"card-background-press": colors["grey-50"],

			"text-base": colors["grey-700"],
			"text-header": colors["grey-800"],
			"text-inactive": colors["blue-grey-400"],
			"text-caption": colors["blue-grey-600"],

			"text-error": colors["red-700"],
			tabBorder: colors["grey-100"],
			divider: colors["grey-100"],

			icon: colors["blue-grey-500"],
			"icon-faded": colors["blue-grey-300"],
			"icon-info": colors["red-250"],
			"icon-button": colors["grey-800"],
			"icon-selected": colors["blue-600"],

			"button-primary": colors["red-500"],
			"button-primary-text": colors.white,

			"button-secondary": colors["red-50"],
			"button-secondary-text": colors["red-600"],

			"input-border-focussed": colors["blue-600"],
			"input-border-error": colors["red-600"],
			"input-background": colors["blue-grey-200"],
			"input-icon": colors["grey-800"],

			"input-text": colors["grey-700"],
			"input-text-placeholder": colors["blue-grey-700"],
		},
		dark: {},
	},
	spacing: {
		"0px": 0,
		"4px": 4,
		"8px": 8,

		"12px": 12,
		"20px": 20,
		"24px": 24,
		"32px": 32,
		"40px": 40,

		"16px": 16,
	},
	radius: {
		"0px": 0,
		"4px": 4,

		"6px": 6,
		"12px": 12,
		"16px": 16,
		"40px": 40,
		full: 9999,
	},
	defaults: {
		Button: {
			variant: "solid",
			themeColor: "primary",
			borderRadius: "40px",
			paddingHorizontal: "20px",
			height: 48,
			textVariant: "button",
			textColor: "button-primary-text",
		},
		Text: {
			variant: "body",
		},
		Screen: {
			paddingHorizontal: "20px",
			paddingVertical: "20px",
			backgroundColor: "canvas",
		},
	},
	typography: {
		fonts: fontConfig,
		sizes: {
			"44px": { fontSize: 44, lineHeight: 44 },
			"30px": { fontSize: 30, lineHeight: 38 },
			"24px": { fontSize: 24, lineHeight: 30 },
			"20px": { fontSize: 20, lineHeight: 25 },
			"16px": { fontSize: 16, lineHeight: 24 },
			"14px": { fontSize: 14, lineHeight: 18 },
			"12px": { fontSize: 12, lineHeight: 14 },
			"10px": { fontSize: 10, lineHeight: 14 },
		},
	},
	variants: {
		Text: {
			title: { size: "44px", weight: "black", family: "Dia", color: "text-header" },
			h1: { size: "30px", weight: "bold", family: "Dia", color: "text-header" },
			h2: { size: "24px", weight: "bold", family: "Dia", color: "text-header" },
			h3: { size: "20px", weight: "bold", family: "Dia", color: "text-header" },
			h4: { size: "16px", weight: "bold", family: "Dia", color: "text-header" },
			caption: { size: "12px", weight: "bold", family: "Roboto", color: "text-caption" },
			button: { size: "16px", weight: "medium", family: "Roboto", color: "button-primary-text" },
			body: { size: "16px", weight: "regular", family: "Roboto", color: "text-base" },
			small: { size: "14px", weight: "regular", family: "Roboto", color: "text-base" },
		},
		Button: {
			link: { paddingVertical: "4px", backgroundColor: { custom: "transparent" } },
			icon: {
				width: 40,
				height: 40,
				borderRadius: "full",
				backgroundColor: { custom: "rgba(255,255,255,0.76)" },
			},
			solid: { textColor: "button-primary-text" },
		},
	},
});
