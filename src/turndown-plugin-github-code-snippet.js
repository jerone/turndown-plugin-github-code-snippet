(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === "object") {
    // Node, CommonJS-like
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.turndownPluginGitHubCodeSnippet = factory();
  }
})(this, function () {
  function turndownPluginGitHubCodeSnippet(turndownService) {
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

  return turndownPluginGitHubCodeSnippet;
});
