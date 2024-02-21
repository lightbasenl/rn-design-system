import type { ConfigPlugin } from "@expo/config-plugins";
import {
  IOSConfig,
  withDangerousMod,
  withInfoPlist,
  withXcodeProject,
  AndroidConfig,
  withMainApplication,
} from "@expo/config-plugins";
import chalk from "chalk";
import fs from "fs";
import mime from "mime";
import opentype from "opentype.js";
import path from "path";

type FontMetric = {
  descent: number;
  ascent: number;
  lineGap: number;
  capHeight: number;
  unitsPerEm: number;
};

const addImport = (stringContents: string) => {
  const importRegex = /^import [a-zA-Z.]/m;
  const addedImport = "import com.facebook.react.common.assets.ReactFontManager";

  const match = stringContents.match(importRegex);
  if (match?.index === undefined) {
    throw new Error('Unable to match "import" in MainActivity');
  }
  const indexOfFirstImport = match.index;

  stringContents = [
    stringContents.slice(0, indexOfFirstImport),
    addedImport,
    stringContents.slice(indexOfFirstImport),
  ].join("\n");

  return stringContents;
};

const addToOnCreate = (stringContents: string, addedLines: string[]) => {
  const onCreateRegex = /(fun onCreate\(.*\)(.|\n)*super.onCreate\(.*\)\s*\n)/;

  const match = stringContents.match(onCreateRegex);
  const fullMatch = match?.[1];

  if (match?.index === undefined || fullMatch === undefined) {
    throw new Error('Unable to match "fun onCreate" in MainActivity');
  }

  const indexOfMatch = match.index;
  const indexAfterMatch = indexOfMatch + fullMatch.length;

  stringContents = [
    stringContents.slice(0, indexAfterMatch),
    addedLines.map((line) => `    ${line}`).join("\n"),
    stringContents.slice(indexAfterMatch),
  ].join("\n");

  return stringContents;
};

function groupFilesByType(assets: string[]) {
  return groupBy(assets, (type) => (mime.getType(type) || "").split("/")[0]);
}

function groupBy<T>(arr: T[], block: (v: T) => any): Record<string, T[]> {
  const out: Record<string, T[]> = {};

  for (const i of arr) {
    const key = block(i);
    if (!(key in out)) {
      out[key] = [];
    }
    out[key]?.push(i);
  }

  return out;
}

const withAndroidLinkedAsset: ConfigPlugin<{ font?: string[][]; image?: string[]; src?: string }> = (
  config,
  { font, src }
) => {
  const fontWeights: Record<string, number[]> = {};
  const fontMetrics: Record<string, FontMetric | null> = {};
  const fontImports: Record<string, string[]> = {};
  let importStrings: string[] = [];
  withDangerousMod(config, [
    "android",
    async (config) => {
      font?.forEach(async (assets) => {
        let xmlContent = `<?xml version="1.0" encoding="utf-8"?>\n<font-family xmlns:app="http://schemas.android.com/apk/res-auto">`;
        assets?.forEach(async (asset, index) => {
          const font = opentype.loadSync(asset);

          if (font.tables.fvar) {
            const postScriptName = font.names.postScriptName.en;
            console.log(
              chalk.red(
                `✖ ${chalk.red.bold(
                  postScriptName
                )} variable fonts are currently not supported, please use a static font`
              )
            );
            return;
          }
          const postScriptName = font.names.postScriptName.en?.replace(/-/g, "_").toLowerCase();
          if (!postScriptName) {
            console.log(
              chalk.red(
                `✖ ${chalk.red.bold(asset)} font is invalid, please check the font file and try again`
              )
            );
            return;
          }
          const fontStyle = font.tables.post?.italicAngle !== 0 ? "italic" : "normal";
          let fontWeight: number = font.tables.os2?.usWeightClass;
          // @ts-expect-error preferredSubfamily exists
          const subFamily = font.names.preferredSubfamily?.en.toLowerCase() as string | undefined;

          // some fonts have incorrect weights added and will crash android if repeated weights are added

          if (fontWeight === 400) {
            if (subFamily?.includes("book")) {
              fontWeight = 300;
            }
            if (subFamily?.includes("bold")) {
              fontWeight = 700;
            }
            if (subFamily?.includes("demibold")) {
              fontWeight = 600;
            }
          }

          if (fontWeight === 300 && subFamily?.includes("thin")) {
            // some fonts have incorrect weights added and will crash android if repeated weights are added
            fontWeight = 100;
          }

          // font weight needs to be 100, 200, 300, 400, 500, 600, 700, 800, 900 so check the 250 weights to distiguish between 200 and 100
          if (fontWeight === 250) {
            fontWeight = subFamily?.includes("extralight") ? 200 : 100;
          }
          // CHECK IF BAD FILE NAME IS PARSED CORRECTLY CHANGE A FONT NAME TO SOMETHING RANDOM
          xmlContent += `\n  <font app:fontStyle="${fontStyle}" app:fontWeight="${fontWeight}" app:font="@font/${postScriptName}" />`;

          const fontsDir = path.join(config.modRequest.platformProjectRoot, "app/src/main/res/font");
          fs.mkdirSync(fontsDir, { recursive: true });

          const fileName = postScriptName?.replace(/-/g, "_").toLowerCase();
          const pathName = `${fileName}${path.extname(asset)}`;

          // @ts-expect-error preferredFamily exists
          const fontName: string = font.names.preferredFamily?.en ?? font.names.fontFamily?.en;

          if (!fontWeights[fontName]) {
            fontWeights[fontName] = [fontWeight];
          } else {
            if (!fontWeights[fontName]?.includes(fontWeight)) {
              fontWeights[fontName]?.push(fontWeight);
            }
          }

          const importedFontName = postScriptName.split("_")[0];

          if (!importedFontName) {
            console.log(
              chalk.red(
                `✖ ${chalk.red.bold(asset)} font is invalid, please check the font file and try again`
              )
            );
            return;
          }

          if (!fontImports[fontName]) {
            fontImports[fontName] = [importedFontName];
          } else {
            if (!fontImports[fontName]?.includes(importedFontName)) {
              fontImports[fontName]?.push(importedFontName);
            }
          }

          if (!fontMetrics[fontName]) {
            const validMetric = (obj: FontMetric) => {
              for (const key in obj) {
                // @ts-ignore
                if (typeof obj[key] !== "number") {
                  return false; // Found a number value, return false
                }
              }
              return true; // No number values found, return true
            };
            const fontMetric: FontMetric = {
              descent: font.tables.hhea?.descender,
              ascent: font.tables.hhea?.ascender,
              lineGap: font.tables.hhea?.lineGap,
              capHeight: font.tables.os2?.sCapHeight,
              unitsPerEm: font.unitsPerEm,
            };

            if (!validMetric(fontMetric)) {
              console.log(
                chalk.red(
                  `✖ ${chalk.red.bold(fontName)} font is invalid, using null value for capsize metrics`
                )
              );
            }
            fontMetrics[fontName] = validMetric(fontMetric) ? fontMetric : null;
          }

          const output = path.join(fontsDir, pathName);

          fs.copyFileSync(asset, output);

          if (index === assets.length - 1) {
            xmlContent += `\n</font-family>`;
            const projectRoot = config.modRequest.projectRoot;
            const filePath = await AndroidConfig.Paths.getResourceXMLPathAsync(projectRoot, {
              name: `font_${postScriptName.split("_")[0]}`,
              // @ts-ignore
              kind: "font",
            });

            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
            await fs.promises.writeFile(filePath, xmlContent);
          }
        });
      });

      importStrings = Object.entries(fontImports).map(
        ([key, value]) =>
          `ReactFontManager.getInstance().addCustomFont(this, "${key}", R.font.font_${value});`
      );

      const typographyFileString = JSON.stringify(fontMetrics);

      const formattedContent = `
        // This file is codegenerated as part of the link-assets expo config plugin
        type FontWeightsArray = ${JSON.stringify(fontWeights)};
        export type FontWeights = {[K in keyof FontWeightsArray]: \`\${FontWeightsArray[K][number]}\`;};
        export const fontConfig = ${typographyFileString}`;

      fs.writeFileSync(`${src}/theme.typography.tsx`, formattedContent);

      console.log(
        chalk.green("» ") +
          chalk.green.bold("Theming: ") +
          chalk.green("theme.typograhy.tsx has been created, import it as part of the theme.config.tsx file")
      );

      return config;
    },
  ]);

  config = withMainApplication(config, (config) => {
    let stringContents = config.modResults.contents;

    stringContents = addImport(stringContents);
    stringContents = addToOnCreate(stringContents, importStrings);

    config.modResults.contents = stringContents;

    return config;
  });

  return config;
};

const withIosLinkedAsset: ConfigPlugin<Record<string, string[]>> = (config, { font, image }) => {
  config = withXcodeProject(config, (config) => {
    const project = config.modResults;
    IOSConfig.XcodeUtils.ensureGroupRecursively(project, "Resources");

    function addResourceFile(f?: string[]) {
      return (f ?? [])
        .map((asset) => {
          const absoluteAssetPath = path.relative(config.modRequest.platformProjectRoot, asset);
          return project.addResourceFile(absoluteAssetPath, {
            target: project.getFirstTarget().uuid,
          });
        })
        .filter(Boolean) // xcode returns false if file is already there
        .map((file) => file.basename);
    }

    addResourceFile(font);
    addResourceFile(image);

    return config;
  });

  config = withInfoPlist(config, (config) => {
    const existingFonts = config.modResults.UIAppFonts ?? [];

    const fontList = font?.map((font) => path.basename(font)) ?? [];

    const allFonts = [
      // @ts-expect-error
      ...existingFonts,
      ...fontList,
    ];
    config.modResults.UIAppFonts = Array.from(new Set(allFonts));

    return config;
  });

  return config;
};

const withLinkedAsset: ConfigPlugin<{ folders: string[]; src?: string }> = (config, props) => {
  const expanded = props.folders
    .map((filePath) => {
      const resolved = path.resolve(config._internal?.projectRoot, filePath);
      if (fs.statSync(resolved).isDirectory()) {
        return fs.readdirSync(resolved).map((file) => path.join(resolved, file));
      }
      return [resolved];
    })
    .flat();

  const assets = groupFilesByType(expanded);

  withIosLinkedAsset(config, assets);

  // android
  const regroupedAssets: { assets: { font: string[][] } } = { assets: { font: [] } };

  const fontMap: { [family: string]: string[] } = {};

  assets.font?.forEach((font) => {
    const check = opentype.loadSync(font);

    const postScriptName = check.names.postScriptName.en?.split("-")[0];
    if (!postScriptName) {
      console.log(
        chalk.red(`✖ ${chalk.red.bold(font)} font is invalid, please check the font file and try again`)
      );
      return;
    }
    if (!fontMap[postScriptName]) {
      fontMap[postScriptName] = [];
    }
    fontMap[postScriptName]?.push(font);
  });

  for (const family in fontMap) {
    const fontFamilyMap = fontMap[family];
    if (fontFamilyMap) {
      regroupedAssets.assets.font.push(fontFamilyMap);
    }
  }

  withAndroidLinkedAsset(config, { ...regroupedAssets.assets, src: props.src ?? "./" });
  return config;
};

export default withLinkedAsset;
