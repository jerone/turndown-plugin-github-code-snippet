/**
 * @fileoverview One file for all linters.
 * @author Jeroen van Warmerdam
 */

/* eslint-env node */

"use strict";

const util = require("node:util");
const { exec, spawn } = require("node:child_process");
const execP = util.promisify(exec);
const {
  colorReset,
  styles,
  prefixes,
  error,
  warning,
  success,
  dim,
  pad,
} = require("./utils");

const enableDebug = false;

function assert(linter, condition, output) {
  if (condition) {
    warn(`lint.js unexpectedly failed. Maybe ${linter} changed it's output.`);
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
  console.log(`\n${styles.underline}${linter}${styles.underlineReset}`);
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
 * Uses `spawn` to get files during progress.
 */
function cspell() {
  const linter = "CSpell";
  const cmd = "cspell.cmd";

  return new Promise(function (resolve, reject) {
    header(linter);

    // Spawn is needed to get the progress.
    // Spawn (without stdio "process.*") makes the colors disappear. Force colors with flag.
    const output = spawn(cmd, ["--color", "."], {
      shell: false,
    });

    let previousData = "  ";
    let summary = "";
    // First comes the index & filename.
    // Next run comes the time & conditional failure char.
    // This is repeated until all files are processed.
    // Last iteration contains the summary.
    // TODO: replace \ with /. But I'm afraid of ASCII codes.
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
        warn(`${linter} unexpectedly stopped without a summary.`);
      }

      if (code == 0) {
        successful(summary);
      } else {
        console.log(error(`\n${prefixes.error} ${summary}`));
      }
      footer();
      resolve();
    });

    // Spawn failed.
    output.on("error", (code) => {
      warn(`${linter} unexpectedly failed with error ${code}.`);
      footer();
      reject(code);
    });
  });
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
    "eslint --format ./scripts/lint/eslint-formatter.js --report-unused-disable-directives .";
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
