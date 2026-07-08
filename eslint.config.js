// ESLint flat config — Habitrii
// Primary goal: catch undefined variables (no-undef) before they reach production.
// The June 21, 2026 outage (missing `legalDoc` useState declaration) would have
// been caught by this configuration at lint time.

import js from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...react.configs.recommended.rules,
      "no-undef": "error",
      "no-unused-vars": ["warn", { varsIgnorePattern: "^React$" }],
      // JSX runtime is automatic in Vite/React 18 — React import not required
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      // Apostrophes etc. in marketing copy are fine
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: ["api/**/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
    },
  },
];
