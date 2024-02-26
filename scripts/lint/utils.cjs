/**
 * @fileoverview Utilities.
 * @author Jeroen van Warmerdam
 */

/* eslint-env node */

"use strict";

const path = require("node:path");

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
  return wrapLines(msg, color.red, color.reset);
};

/** Print message as warning. */
exports.warning = function (msg) {
  return wrapLines(msg, color.yellow, color.reset);
};

/** Print message as success. */
exports.success = function (msg) {
  return wrapLines(msg, color.green, color.reset);
};

/** Print dimmed message. */
exports.dim = function (msg) {
  return wrapLines(msg, color.gray, color.reset);
};

/**
 * ANSI codes cannot wrap over multiple lines.
 * @param {string} msg Message with optional new lines.
 * @param {string} ansiOpen ANSI open code.
 * @param {string} ansiClose ANSI close code.
 * @returns Message with correctly wrapped ANSI codes.
 */
function wrapLines(msg, ansiOpen, ansiClose) {
  return (
    ansiOpen + msg.replace(/\r?\n/g, ansiClose + "$&" + ansiOpen) + ansiClose
  );
}

/**
 * Linkify path with line and column.
 * @param {string} path File path.
 * @param {number} line Line of file.
 * @param {number} column Column of line.
 */
exports.linkify = function (path, line, column) {
  return wrapLines(`${path}:${line}:${column}`, color.blue, color.reset);
};

/**
 * ANSI styles.
 */
const styles = {
  underline: "\x1b[4m",
  underlineReset: "\x1b[24m",
};

/**
 * Print underlined message.
 * @param {string} msg Message
 * @returns Underlined message.
 */
exports.underline = function (msg) {
  return wrapLines(msg, styles.underline, styles.underlineReset);
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
  const uri = filePath.replace("file:///", "");
  const rel = path.relative(root, uri);
  if (rel.startsWith("..")) return uri;
  return "." + path.sep + rel;
};
