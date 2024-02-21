/**
 * @fileoverview One file for all linters.
 * @author Jeroen van Warmerdam
 */

/* eslint-env node */

"use strict";

const util = require("node:util");
const { exec, spawn } = require("node:child_process");
const execP = util.promisify(exec);

const enableDebug = false;

const red = "\x1b[31;1m";
const green = "\x1b[32;1m";
const yellow = "\x1b[33;1m";
const gray = "\x1b[90m";
const reset = "\x1b[0m";
const underscore = "\x1b[4m";

const error = "✖";
const warning = "⚡";
const success = "✔";

const pad = (n, s) => String(n).padStart(s, " ");

function assert(linter, condition, output) {
  if (condition) {
    const msg =
      " lint.js unexpectedly failed. Something has probably changed with ";
    console.error(yellow + warning + msg + linter + "." + reset);
    console.error(output);
    console.log("");
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
function failure(linter, exception, output) {
  if (enableDebug) {
    console.log(linter + " exception:", exception);
  }

  console.log(red + error + " " + linter + " failed:\n" + reset);
  console.log(
    output
      .trim()
      .split(/\n\r?/g)
      .map((line) => "  " + line)
      .join("\n")
      // eslint-disable-next-line no-control-regex
      .replace(/\s+\x1b[[]0m$/g, reset), // Remove empty lines with only color reset code.
  );
  console.log("");
}

function successful(linter) {
  console.log(
    green + success + " " + linter + " detected no issues.\n" + reset,
  );
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
  try {
    console.log(`  1/1 ${gray}./package-lock.json${reset}`);
    const output = await execP(cmd);
    assert(
      linter,
      !output.stdout ||
        (output.stdout && !output.stdout.includes("No issues detected")) ||
        output.stderr ||
        output.error,
      output,
    );
    successful(linter);
  } catch (exception) {
    failure(linter, exception, exception.stderr);
  }
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
  try {
    const dryRun = await execP(cmd + " --dry-run");
    console.log(
      dryRun.stdout
        .trim()
        .split(/\n\r?/g)
        .map((line, index, arr) => {
          const l = arr.length;
          return `  ${pad(index + 1, String(l).length)}/${l} ${gray}./${line}${reset}`;
        })
        .join("\n"),
    );
    const output = await execP(cmd);
    assert(linter, output.stdout || output.stderr || output.error, output);
    successful(linter);
  } catch (exception) {
    failure(linter, exception, exception.stdout);
  }
}

/**
 * CSpell
 * https://cspell.org
 *
 * Uses `spawn` to get files during progress.
 */
function cspell() {
  const linter = "CSpell";
  const cmd = "cspell.cmd";

  return new Promise(function (resolve, reject) {
    // Spawn is needed to get the progress.
    // Spawn (without stdio "process.*") makes the colors disappear. Force colors with flag.
    const output = spawn(cmd, ["--color", "."], {
      shell: false,
    });

    console.log(`${linter} started:`);

    // First comes the index & filename.
    // Next run comes the time & conditional failure char.
    // This is repeated until all files are processed.
    // Last iteration contains the summary.
    let previousData = "  ";
    let summary = "";
    output.stderr?.on("data", (data) => {
      const str = data.toString();
      if (str.includes("Files checked:")) {
        summary = str;
        return;
      }
      const eol = str.endsWith("\n");
      if (eol) {
        console.log(previousData + data.toString().replace(/[\n\r]*/g, ""));
        previousData = "  ";
      } else {
        previousData += str.replace(/[\n\r]*/g, "");
      }
    });

    // Stdout returns the error message.
    output.stdout?.on("data", (data) => {
      console.log("  " + data.toString().replace(/[\n\r]*/g, ""));
    });

    // Spawn finishes.
    output.on("close", (code) => {
      if (enableDebug) {
        console.log(`${linter} exited with code ${code}`);
      }

      if (!summary) {
        console.log(
          "\n" +
            yellow +
            warning +
            linter +
            " unexpectedly stopped without a summary.",
        );
      }

      if (code == 0) {
        console.log("\n" + green + success + " " + summary + reset);
      } else {
        console.log("\n" + red + error + " " + summary + reset);
      }
      resolve();
    });

    // Spawn failed.
    output.on("error", (code) => {
      console.log(
        "\n" +
          yellow +
          warning +
          linter +
          " unexpectedly failed with error " +
          code.toString(),
      );
      reject();
    });
  });
}

// TODO: ESLint
Promise.all([lockfileLint(), editorconfigChecker()]).then(cspell);
