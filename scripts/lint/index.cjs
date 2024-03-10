/**
 * @fileoverview One file for all linters.
 * @author Jeroen van Warmerdam
 */

/* eslint-env node */

"use strict";

const path = require("node:path");
const util = require("node:util");
const { exec } = require("node:child_process");
const execP = util.promisify(exec);
const {
  colorReset,
  prefixes,
  error,
  warning,
  success,
  dim,
  underline,
  pad,
} = require("./utils.cjs");

const enableDebug = false;

function assert(linter, condition, output) {
  if (condition) {
    warn(`Linter ${linter} unexpectedly failed. Maybe changed it's output.`);
    console.error(output);
  } else if (enableDebug) {
    console.log(linter, output);
  }
}

/**
 * Log the failure.
 * @param {string} linter Name of the linter.
 * @param {Error} exception Exception.
 * @param {string} output Command output.
 */
function unsuccessful(linter, exception, output) {
  if (enableDebug) {
    console.log(`${linter} exception:`, exception);
  }

  console.log(error(`\n${prefixes.error} ${linter} failed:\n`));
  console.log(
    output
      .trim()
      .split(/\n\r?/g)
      .map((line) => `  ${line}`)
      .join("\n")
      // eslint-disable-next-line no-control-regex
      .replace(/\s+\x1b[[]0m$/g, colorReset), // Remove empty lines with only color reset code.
  );
}

function warn(msg) {
  console.warn(warning(`\n${prefixes.warning} ${msg}`));
}

function successful(msg, output = undefined) {
  if (output) {
    console.log(
      output
        .trim()
        .split(/\n\r?/g)
        .map((line) => `  ${line}`)
        .join("\n")
        // eslint-disable-next-line no-control-regex
        .replace(/\s+\x1b[[]0m$/g, colorReset), // Remove empty lines with only color reset code.
    );
  }
  console.log(success(`\n${prefixes.success} ${msg}`));
}

function header(linter) {
  console.log("\n" + underline(linter));
}

function footer() {
  console.log("");
}

/**
 * Lockfile-lint
 * https://github.com/lirantal/lockfile-lint#readme
 *
 * Comes back with "✔ No issues detected" when successful.
 * Throws exception with `stderr`.
 */
async function lockfileLint() {
  const linter = "Lockfile-lint";
  const cmd = "lockfile-lint";
  header(linter);
  try {
    console.log(`  ${dim("1/1")} .${path.sep}package-lock.json`);
    const output = await execP(cmd);
    assert(
      linter,
      !output.stdout ||
        (output.stdout && !output.stdout.includes("No issues detected")) ||
        output.stderr ||
        output.error,
      output,
    );
    successful(`${linter} detected no issues.`);
  } catch (exception) {
    unsuccessful(linter, exception, exception.stderr);
  }
  footer();
}

/**
 * EditorConfig-checker
 * https://github.com/editorconfig-checker/editorconfig-checker#readme
 *
 * Comes back with nothing when successful.
 * Throws exception with `stdout`.
 */
async function editorconfigChecker() {
  const linter = "EditorConfig-checker";
  const cmd =
    'editorconfig-checker --config ".config/editorconfig-checker.config.json"';
  header(linter);
  try {
    const dryRun = await execP(cmd + " --dry-run");
    const lines = dryRun.stdout.trim().split(/\n\r?/g);
    // EC logs when new exe is downloaded.
    // See https://github.com/editorconfig-checker/editorconfig-checker.javascript/blob/922e3680544a7a8783c759995e9facb94ba79511/src/index.ts#L12
    if (lines[0].startsWith("Downloading ")) {
      console.log(`  ${lines.shift()}`);
    }
    console.log(
      lines
        .map((line, index, arr) => {
          const l = arr.length;
          const counter = `${pad(index + 1, String(l).length)}/${l}`;
          const filePath = "." + path.sep + path.normalize(line);
          return `  ${dim(counter)} ${filePath}`;
        })
        .join("\n"),
    );
    const output = await execP(cmd);
    assert(linter, output.stdout || output.stderr || output.error, output);
    successful(`${linter} detected no issues.`);
  } catch (exception) {
    unsuccessful(linter, exception, exception.stdout);
  }
  footer();
}

/**
 * CSpell
 * https://cspell.org
 *
 * Comes back with `stdout` when successful.
 * Throws exception with `stdout`.
 */
async function cspell() {
  const linter = "CSpell";
  const cmd = "cspell --reporter ./scripts/lint/cspell-reporter.cjs .";
  header(linter);
  try {
    const output = await execP(cmd);
    assert(linter, !output.stdout || output.stderr || output.error, output);
    successful(`${linter} detected no issues.`, output.stdout);
  } catch (exception) {
    unsuccessful(linter, exception, exception.stdout);
  }
  footer();
}

/**
 * ESLint
 *
 * Comes back with `stdout` when successful.
 * Throws exception with `stdout`.
 */
async function eslint() {
  const linter = "ESLint";
  const cmd =
    "eslint --format ./scripts/lint/eslint-formatter.cjs --report-unused-disable-directives .";
  header(linter);
  try {
    const output = await execP(cmd);
    assert(
      linter,
      !output.stdout ||
        (output.stderr && !output.stderr.includes("punycode")) || // DeprecationWarning: The `punycode` module is deprecated.
        output.error,
      output,
    );
    successful(`${linter} detected no issues.`, output.stdout);
  } catch (exception) {
    unsuccessful(linter, exception, exception.stdout);
  }
  footer();
}

(async () => {
  await lockfileLint();
  await editorconfigChecker();
  await cspell();
  await eslint();
})();
