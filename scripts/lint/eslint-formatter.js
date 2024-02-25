/**
 * @fileoverview An ESLint formatter with list style.
 * @author Jeroen van Warmerdam
 */

/* eslint-env node */

"use strict";

const {
  prefixes,
  error,
  warning,
  success,
  dim,
  linkify,
  pad,
  pluralize,
  toRelativePath,
} = require("./utils");

function reportFile(result, index, length, path) {
  let prefix;
  if (result.errorCount > 0) {
    prefix = error(prefixes.error);
  } else if (result.warningCount > 0) {
    prefix = warning(prefixes.warning);
  } else {
    prefix = success(prefixes.success);
  }
  const indexer = dim(`${pad(index, String(length).length)}/${length}`);
  return `${indexer} ${prefix} ${path}`;
}

function reportMessage(result, path) {
  let prefix;
  switch (result.severity) {
    case 2:
      prefix = error(prefixes.error);
      break;
    case 1:
      prefix = warning(prefixes.warning);
      break;
  }
  const rule = dim(`[${result.ruleId}]`);
  const link = linkify(path, result.line, result.column);
  // TODO: spaces should be calculated.
  return `      ${prefix} ${result.message} ${rule} ${link}`;
}

function reportSummary(result) {
  let p, s;
  if (result.errorCount > 0) {
    p = prefixes.error;
    s = error("Error!");
  } else if (result.warningCount > 0) {
    p = prefixes.warning;
    s = warning("Warning!");
  } else {
    p = prefixes.success;
    s = success("Ok!");
  }

  const eC = result.errorCount;
  const eT = pluralize("error", result.errorCount);
  const wC = result.warningCount;
  const wT = pluralize("warning", result.warningCount);
  const fC = result.fileCount;
  const fT = pluralize("file", result.fileCount);

  return `${p} ${s} » ${eC} ${eT} and ${wC} ${wT} in ${fC} ${fT}`;
}

function formatter(results, context) {
  const output = [];

  const summary = results.reduce(
    (sum, result) => {
      sum.errorCount += result.errorCount;
      sum.warningCount += result.warningCount;
      return sum;
    },
    { errorCount: 0, warningCount: 0, fileCount: results.length },
  );

  results.forEach((result, index) => {
    const path = toRelativePath(result.filePath, context.cwd);
    output.push(reportFile(result, index + 1, results.length, path));
    result.messages.forEach((msg) => output.push(reportMessage(msg, path)));
  });

  output.push("");
  output.push(reportSummary(summary));

  return output.join("\n");
}

module.exports = formatter;
