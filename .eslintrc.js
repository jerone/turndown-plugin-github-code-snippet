/* eslint-env node */

// @ts-check
const { defineConfig } = require("eslint-define-config");
const { sortOrder: defaultSortOrder } = require("sort-package-json");

/// <reference types="@eslint-types/prettier" />

// Make sure that the `userscript` dist target is near other dist targets (main, module, browser).
const index = defaultSortOrder.indexOf("browser");
const sortOrder = defaultSortOrder.splice(index + 1, 0, "userscript");

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:security/recommended-legacy",

    // Display Prettier errors as ESLint errors.
    // Enables eslint-plugin-prettier and eslint-config-prettier.
    "plugin:prettier/recommended",

    //! Prettier should always be the last configuration in the extends array.
  ],
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // Ignore variables whose names begin with an underscore.
  },
  overrides: [
    /*
     * JavaScript (ESM & CommonJS) files.
     */
    {
      files: ["*.mjs", "*.cjs"],
      extends: [
        "eslint:recommended",
        "plugin:security/recommended-legacy",

        // Display Prettier errors as ESLint errors.
        // Enables eslint-plugin-prettier and eslint-config-prettier.
        "plugin:prettier/recommended",

        //! Prettier should always be the last configuration in the extends array.
      ],
    },

    /*
     * JSON files.
     */
    {
      files: ["*.json"],
      extends: [
        "plugin:json/recommended-with-comments",

        // Display Prettier errors as ESLint errors.
        // Enables eslint-plugin-prettier and eslint-config-prettier.
        "plugin:prettier/recommended",

        //! Prettier should always be the last configuration in the extends array.
      ],
    },

    /*
     * `package.json` file.
     * This needs it's own configuration, because it doesn't work together with `plugin:json`.
     * See https://github.com/kellyselden/eslint-plugin-json-files/issues/40
     * Must be after `*.json`.
     */
    {
      files: ["package.json"],
      plugins: ["json-files"],
      extends: [
        // Display Prettier errors as ESLint errors.
        // Enables eslint-plugin-prettier and eslint-config-prettier.
        "plugin:prettier/recommended",

        //! Prettier should always be the last configuration in the extends array.
      ],
      rules: {
        "json-files/ensure-repository-directory": "error",
        "json-files/no-branch-in-dependencies": "error",
        "json-files/require-engines": "error",
        "json-files/require-license": "error",
        "json-files/require-unique-dependency-names": "error",
        "json-files/sort-package-json": ["error", { sortOrder }],
      },
    },

    /*
     * Markdown files.
     */
    {
      files: ["*.md"],
      parser: "eslint-plugin-markdownlint/parser",
      extends: [
        "plugin:markdownlint/recommended",

        // Display Prettier errors as ESLint errors.
        // Enables eslint-plugin-prettier and eslint-config-prettier.
        "plugin:prettier/recommended",

        //! Prettier should always be the last configuration in the extends array.
      ],
      rules: {
        "markdownlint/md013": "off", // Disable line length.
        "markdownlint/md033": [
          "error",
          { allowed_elements: ["br", "sup", "kbd"] },
        ],
        "prettier/prettier": ["error", { parser: "markdown" }],
      },
    },
  ],
});
