import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // Base JS rules
  js.configs.recommended,

  // TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        fetch: "readonly",
        AbortController: "readonly",
        Response: "readonly",
        Headers: "readonly",
        URL: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        console: "readonly",
        document: "readonly",
        window: "readonly",
        requestAnimationFrame: "readonly",
        IntersectionObserver: "readonly",
        HTMLElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLButtonElement: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
      },
    },
    rules: {
      ...tsPlugin.configs["recommended"].rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "import/no-self-import": "error",
    },
  },

  // React files
  {
    files: ["**/*.{tsx,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },

  // media-core MUST NOT import React or DOM rendering APIs
  {
    files: ["packages/media-core/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["react", "react-dom", "react-native"], message: "media-core must be framework-agnostic" },
          ],
        },
      ],
    },
  },

  // media-ui-react MUST NOT import media-core or media-react
  {
    files: ["packages/media-ui-react/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@headless-media/core"], message: "media-ui-react must not import media-core" },
            { group: ["@headless-media/react"], message: "media-ui-react must not import media-react" },
          ],
        },
      ],
    },
  },

  // Prettier must be last — disables formatting rules
  prettierConfig,

  // Global ignores
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/storybook-static/**",
      "**/.storybook/**",
      "**/*.d.ts",
      "**/*.config.ts",
      "**/*.config.mjs",
      "**/*.config.js",
    ],
  },
];
