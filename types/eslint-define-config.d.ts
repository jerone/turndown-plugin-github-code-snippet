/**
 * Module Augmentation
 * @link https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 *
 * This file contains typings for other packages.
 */

import "eslint-define-config";

/**
 * Typings for ESLint rules with "eslint-define-config".
 */
declare module "eslint-define-config" {
  export interface CustomExtends {}
  export interface CustomPlugins {}
  export interface CustomRuleOptions
    extends JsonFilesRuleOptions,
      MarkdownlintRuleOptions {}
}

/**
 * Typings for ESLint rules in "eslint-plugin-json-files".
 */
interface JsonFilesRuleOptions {
  "json-files/ensure-repository-directory": void;
  "json-files/ensure-volta-extends": void;
  "json-files/eol-last": ["always" | "never" | "unix" | "windows"];
  "json-files/no-branch-in-dependencies": [
    { keys: Array<string>; ignore: Array<string> },
  ];
  "json-files/require-engines": ["node-only" | "require-npm"];
  "json-files/require-license": ["always" | "allow-unlicensed"];
  "json-files/require-unique-dependency-names": void;
  "json-files/restrict-ranges": any;
  "json-files/sort-package-json": [{ sortOrder: Array<string> }];
  "json-files/validate-schema": [{ schema: string; prettyErrors: boolean }];
}

/**
 * Typings for ESLint rules in "eslint-plugin-markdownlint".
 */
interface MarkdownlintRuleOptions {
  "markdownlint/md001": void;
  "markdownlint/md002": [
    {
      level: number;
    },
  ];
  "markdownlint/md003": [
    {
      style:
        | "consistent"
        | "atx"
        | "atx_closed"
        | "setext"
        | "setext_with_atx"
        | "setext_with_atx_closed";
    },
  ];
  "markdownlint/md004": [
    {
      style: "consistent" | "asterisk" | "plus" | "dash" | "sublist";
    },
  ];
  "markdownlint/md005": void;
  "markdownlint/md006": void;
  "markdownlint/md007": [
    {
      indent: number;
      start_indented: boolean;
    },
  ];
  "markdownlint/md008": void;
  "markdownlint/md009": [
    {
      br_spaces: number;
      list_item_empty_lines: boolean;
      strict: boolean;
    },
  ];
  "markdownlint/md010": [
    {
      code_blocks: boolean;
      spaces_per_tab: boolean;
    },
  ];
  "markdownlint/md011": void;
  "markdownlint/md012": [
    {
      maximum: number;
    },
  ];
  /** line length */
  "markdownlint/md013": [
    {
      line_length: number;
      heading_line_length: number;
      code_block_line_length: number;
      code_blocks: boolean;
      tables: boolean;
      headings: boolean;
      strict: boolean;
      stern: boolean;
    },
  ];
  "markdownlint/md014": void;
  "markdownlint/md015": void;
  "markdownlint/md016": void;
  "markdownlint/md017": void;
  "markdownlint/md018": void;
  "markdownlint/md019": void;
  "markdownlint/md020": void;
  "markdownlint/md021": void;
  "markdownlint/md022": [
    {
      lines_above: number;
      lines_below: number;
    },
  ];
  "markdownlint/md023": void;
  "markdownlint/md024": [
    {
      siblings_only: boolean;
      allow_different_nesting: boolean;
    },
  ];
  "markdownlint/md025": [
    {
      level: number;
      front_matter_title: string;
    },
  ];
  "markdownlint/md026": [
    {
      punctuation: string;
    },
  ];
  "markdownlint/md027": void;
  "markdownlint/md028": void;
  "markdownlint/md029": [
    {
      style: "one" | "ordered" | "one_or_ordered" | "zero";
    },
  ];
  "markdownlint/md030": [
    {
      ul_single: number;
      ol_single: number;
      ul_multi: number;
      ol_multi: number;
    },
  ];
  "markdownlint/md031": [
    {
      list_items: boolean;
    },
  ];
  "markdownlint/md032": void;
  /** inline HTML */
  "markdownlint/md033": [
    {
      allowed_elements: Array<string>;
    },
  ];
  "markdownlint/md034": void;
  "markdownlint/md035": [
    {
      style: "consistent" | "---" | "***";
    },
  ];
  "markdownlint/md036": [
    {
      punctuation: string;
    },
  ];
  "markdownlint/md037": void;
  "markdownlint/md038": void;
  "markdownlint/md039": void;
  "markdownlint/md040": void;
  "markdownlint/md041": [
    {
      level: number;
      front_matter_title: string;
    },
  ];
  "markdownlint/md042": void;
  "markdownlint/md043": [
    {
      headings: Array<string>;
    },
  ];
  "markdownlint/md044": [
    {
      names: Array<string>;
      code_blocks: boolean;
    },
  ];
  "markdownlint/md045": void;
  "markdownlint/md046": [
    {
      style: "consistent" | "fenced" | "indented";
    },
  ];
  "markdownlint/md047": void;
  "markdownlint/md048": [
    {
      style: "consistent" | "tilde" | "backtick";
    },
  ];
  "markdownlint/md049": [
    {
      style: "consistent" | "asterisk" | "underscore";
    },
  ];
  "markdownlint/md050": [
    {
      style: "consistent" | "asterisk" | "underscore";
    },
  ];
}
