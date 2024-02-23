/* eslint-env node */

"use strict";

/**
 * ANSI colors.
 */
const color = {
  red: "\x1b[31;1m",
  green: "\x1b[32;1m",
  yellow: "\x1b[33;1m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
  reset: "\x1b[0m",
};
exports.colorReset = color.reset;

/** Print message as error. */
exports.error = function (msg) {
  return color.red + msg + color.reset;
};

/** Print message as warning. */
exports.warning = function (msg) {
  return color.yellow + msg + color.reset;
};

/** Print message as success. */
exports.success = function (msg) {
  return color.green + msg + color.reset;
};

/** Print dimmed message. */
exports.dim = function (msg) {
  return color.gray + msg + color.reset;
};

/**
 * Linkify path with line and column.
 * @param {string} path File path.
 * @param {number} line Line of file.
 * @param {number} column Column of line.
 */
exports.linkify = function (path, line, column) {
  return `${color.blue}${path}:${line}:${column}${color.reset}`;
};

/**
 * ANSI styles.
 */
exports.styles = {
  underline: "\x1b[4m",
  underlineReset: "\x1b[24m",
};

/**
 * List of prefixes for messages.
 */
exports.prefixes = {
  error: "✖",
  warning: "⚡",
  success: "✔",
};

/**
 * Pad value with spaces.
 * @param {number} value Value.
 * @param {number} size Size.
 * @returns Returns value with leading spaces.
 */
exports.pad = (value, size) => String(value).padStart(size, " ");

/**
 * Pluralize a word.
 * @param {string} word Word to pluralize.
 * @param {number} count Amount.
 * @returns Pluralized word.
 */
exports.pluralize = function (word, count) {
  return count === 1 ? word : word + "s";
};

/**
 * Convert absolute file path to relative file path.
 * @param {string} filePath Absolute file path.
 * @param {string} root Root path.
 * @returns Relative file path.
 */
exports.toRelativePath = function (filePath, root) {
  return filePath.replace(root, ".");
};
