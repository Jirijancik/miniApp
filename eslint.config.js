// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");

module.exports = defineConfig([
  // ── Base: Expo (TS, React, React Hooks, Import) ──────────────
  expoConfig,

  // ── Prettier (must come after expo to override formatting rules) ─
  prettierConfig,

  // ── Global ignores ────────────────────────────────────────────
  {
    ignores: ["dist/*", "src/api/generated/*", "node_modules/*", ".expo/*"],
  },

  // ── TypeScript strict rules ───────────────────────────────────
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // --- TypeScript ---
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-require-imports": "off",

      // --- React ---
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/self-closing-comp": ["warn", { component: true, html: true }],
      "react/jsx-curly-brace-presence": ["warn", { props: "never", children: "never" }],
      "react/jsx-boolean-value": ["warn", "never"],
      "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],
      "react/no-unstable-nested-components": ["warn", { allowAsProps: true }],

      // --- React Hooks ---
      "react-hooks/exhaustive-deps": "warn",

      // --- Imports ---
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "type",
          ],
          pathGroups: [
            { pattern: "react", group: "builtin", position: "before" },
            { pattern: "react-native", group: "builtin", position: "before" },
            { pattern: "expo-**", group: "external", position: "before" },
            { pattern: "@/**", group: "internal", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["react", "react-native"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "warn",
      "import/no-unresolved": "off",

      // --- Unused imports (auto-fixable) ---
      "unused-imports/no-unused-imports": "warn",

      // --- Prettier ---
      "prettier/prettier": "warn",

      // --- General ---
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-var": "error",
      eqeqeq: ["error", "always"],
    },
  },

  // ── Plugin registrations ──────────────────────────────────────
  {
    plugins: {
      prettier: prettierPlugin,
      "unused-imports": unusedImportsPlugin,
    },
  },

  // ── Test file overrides ───────────────────────────────────────
  {
    files: ["__tests__/**/*.{ts,tsx}", "**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
]);
