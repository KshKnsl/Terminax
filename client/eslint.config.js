import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "curly": ["error", "multi-line"],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "object-curly-newline": [
        "error",
        {
          ObjectExpression: { multiline: true, consistent: true },
          ObjectPattern: { multiline: true, consistent: true },
          ImportDeclaration: { multiline: false, consistent: true },
          ExportDeclaration: { multiline: true, minProperties: 3 },
        },
      ],
      "object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-newline": ["error", { multiline: true }],
      "array-element-newline": ["error", "consistent"],
    },
  },
]);
