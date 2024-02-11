// This file is codegenerated as part of the link-assets expo config plugin
type FontWeightsArray = {
  Dia: [900, 700];
  Roboto: [900, 700, 400, 300, 500, 100];
};
export type FontWeights = {
  [K in keyof FontWeightsArray]: `${FontWeightsArray[K][number]}`;
};
export const fontConfig = {
  Dia: {
    descent: -200,
    ascent: 800,
    lineGap: 203,
    capHeight: 627,
    unitsPerEm: 1000,
  },
  Roboto: {
    descent: -500,
    ascent: 1900,
    lineGap: 0,
    capHeight: 1456,
    unitsPerEm: 2048,
  },
};
