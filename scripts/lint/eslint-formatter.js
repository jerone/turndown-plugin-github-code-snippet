/**
 * @fileoverview An ESLint formatter with checklist style.
 * @author Jeroen van Warmerdam
 */

/* eslint-env node */

"use strict";

/**
 * List of ANSI colors.
 */
const color = {
  red: "\x1b[31;1m",
  green: "\x1b[32;1m",
  yellow: "\x1b[33;1m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
  reset: "\x1b[0m",
};

/** Print message as error. */
const error = function (msg) {
  return color.red + msg + color.reset;
};

/** Print message as warning. */
const warning = function (msg) {
  return color.yellow + msg + color.reset;
};

/** Print message as success. */
const success = function (msg) {
  return color.green + msg + color.reset;
};

/** Print dimmed message. */
function dim(msg) {
  return color.gray + msg + color.reset;
}

/**
 * Linkify path with line and column.
 * @param {string} path File path.
 * @param {number} line Line of file.
 * @param {number} column Column of line.
 */
function linkify(path, line, column) {
  return `${color.blue}${path}:${line}:${column}${color.reset}`;
}

/**
 * List of prefixes for messages.
 */
const prefixes = {
  error: "✖",
  warning: "⚡",
  success: "✔",
};

/**
 * Pluralize a word.
 * @param {string} word Word to pluralize.
 * @param {number} count Amount.
 * @returns Pluralized word.
 */
const pluralize = function (word, count) {
  return count === 1 ? word : word + "s";
};

/**
 * Convert absolute file path to relative file path.
 * @param {string} filePath Absolute file path.
 * @param {string} root Root path.
 * @returns Relative file path.
 */
function toRelativePath(filePath, root) {
  return filePath.replace(root, ".");
}

function reportFile(result, index, length, path) {
  let prefix;
  if (result.errorCount > 0) {
    prefix = error(prefixes.error);
  } else if (result.warningCount > 0) {
    prefix = warning(prefixes.warning);
  } else {
    prefix = success(prefixes.success);
  }
  const indexer = dim(`${index}/${length}`);
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
  return `    ${prefix} ${result.message} ${rule} ${link}`;
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
