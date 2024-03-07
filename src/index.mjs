/**
 * Turndown plugin to convert GitHub code snippet in comments back into normal links.
 * @param {TurndownService} turndownService - Turndown service
 * @returns {TurndownService} Turndown service
 */
export default function turndownPluginGitHubCodeSnippet(turndownService) {
  return turndownService.addRule("code-snippet", {
    filter: function (node, _options) {
      return (
        node.nodeName.toUpperCase() === "DIV" &&
        !!node.querySelector('a[href^="https://github.com"][href*="#L"]')
      );
    },
    replacement: function (_content, node, _options) {
      return node
        .querySelector('a[href^="https://github.com"][href*="#L"]')
        .getAttribute("href");
    },
  });
}

/**
 * @typedef {import('@types/turndown')} TurndownService
 */
