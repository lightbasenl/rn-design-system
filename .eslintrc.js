module.exports = {
  root: true,
  extends: ["universe/native", "universe/shared/typescript-analysis", "plugin:prettier/recommended"],
  env: { jest: true, node: true },
  ignorePatterns: ["**/generated/**", "lib/**/**"],
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.d.ts"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  ],

  rules: {
    curly: "error",
    "@typescript-eslint/consistent-type-imports": "error",
  },
};
