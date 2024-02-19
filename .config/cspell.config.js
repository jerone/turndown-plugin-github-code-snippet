// This config file does not work.
/* eslint-env node */

"use strict";

/** @type { import("@cspell/cspell-types").CSpellUserSettings } */
const cspell = {
  language: "en",
  dictionaryDefinitions: [
    {
      name: "workspace-words",
      path: "./cspell-words.txt",
      addWords: true,
    },
  ],
  dictionaries: ["workspace-words"],
  ignorePaths: [
    ".git", // Because `enableGlobDot` is enabled.
    "node_modules", // Because `enableGlobDot` is enabled.
    ".gitignore", // Generated file and contains many pathnames.
  ],
  enableGlobDot: true,
};

module.exports = cspell;
