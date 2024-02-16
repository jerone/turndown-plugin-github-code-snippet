# [turndown-plugin-github-code-snippet](https://github.com/jerone/turndown-plugin-github-code-snippet/)

A [Turndown](https://github.com/domchristie/turndown) plugin to convert [GitHub code snippet in comments](https://help.github.com/articles/creating-a-permanent-link-to-a-code-snippet/) back into normal links. Useful for UserScripts.

## Requirements

- [Turndown](https://github.com/domchristie/turndown) - version 4 or higher.

## Installation

In an UserScript:

```js
// @require  https://unpkg.com/turndown/dist/turndown.js
// @require  https://unpkg.com/turndown-plugin-github-code-snippet/turndown-plugin-github-code-snippet.js
```

## Usage

```js
var turndownService = new TurndownService();
turndownService.use(turndownPluginGithubCodeSnippet);
var markdown = turndownService.turndown(document.querySelector(".comment"));
console.log(markdown);
```

## License

turndown-plugin-github-code-snippet is copyright &#169; 2019+ Jeroen van Warmerdam and released under the [GNU General Public License v3.0 license](https://github.com/jerone/turndown-plugin-github-code-snippet/blob/master/LICENSE).
