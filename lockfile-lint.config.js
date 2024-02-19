/* eslint-env node */

"use strict";

/** @type {import("lockfile-lint").Config} */
const config = {
  allowedHosts: ["npm"],
  allowedPackageNameAliases: [
    "string-width-cjs:string-width",
    "strip-ansi-cjs:strip-ansi",
    "wrap-ansi-cjs:wrap-ansi",
  ],
  path: "package-lock.json",
  type: "npm",
  validateHttps: true,
  validatePackageNames: true,
};

module.exports = config;
