import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import astroPlugin from "eslint-plugin-astro";

const scriptGlobals = {
  console: "readonly",
  process: "readonly",
  fetch: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  URL: "readonly",
  document: "readonly",
  window: "readonly",
  getComputedStyle: "readonly",
};

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astroPlugin.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**", ".work/**", "tests/fixtures/**"],
  },
  {
    files: ["scripts/**/*.{mjs,ts}"],
    languageOptions: {
      globals: scriptGlobals,
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
