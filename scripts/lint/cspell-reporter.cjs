/* eslint-env node */

"use strict";

const path = require("node:path");
const {
  prefixes,
  error,
  success,
  dim,
  linkify,
  pad,
  pluralize,
  toRelativePath,
} = require("./utils.cjs");

module.exports.getReporter = function getReporter(settings, _config) {
  const root = path.resolve(settings?.root || process.cwd());

  let counterLength;

  return {
    progress: (progress) => {
      if (progress.type === "ProgressFileComplete") {
        const prefix =
          progress.numErrors === 0
            ? success(prefixes.success)
            : error(prefixes.error);
        const counter = `${pad(progress.fileNum, String(progress.fileCount).length)}/${progress.fileCount}`;
        counterLength ??= counter.length;
        const filename = toRelativePath(progress.filename, root);
        const duration = dim(progress.elapsedTimeMs.toFixed(2) + "ms");
        console.log(`${dim(counter)} ${prefix} ${filename} - ${duration}`);
      }
    },
    issue: (issue) => {
      const counterPadding = " ".repeat(counterLength);
      const prefix = error(prefixes.error);
      const msg =
        issue.message ||
        (issue.isFlagged
          ? `"${issue.text}" is a forbidden word.`
          : `"${issue.text}" is an unknown word.`);
      const filename = toRelativePath(issue.uri, root);
      const link = linkify(filename, issue.row, issue.col);
      console.log(`${counterPadding} ${prefix} ${msg} ${link}`);
    },
    result: (result) => {
      let p, s;
      if (result.issues > 0) {
        p = prefixes.error;
        s = error("Error!");
      } else {
        p = prefixes.success;
        s = success("Ok!");
      }
      const iC = result.issues;
      const iT = pluralize("issue", result.issues);
      const fC = result.files;
      const fT = pluralize("file", result.files);
      console.log(`\n${p} ${s} » ${iC} ${iT} in ${fC} ${fT}`);
    },
  };
};
