(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define([], factory);
	} else if (typeof exports === 'object') {
		// Node, CommonJS-like
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.turndownPluginGithubCodeSnippet = factory();
	}
}(this, function () {

	function turndownPluginGithubCodeSnippet(turndownService) {
		return turndownService.addRule("code-snippet", {
			filter: function (node, options) {
				return node.nodeName.toUpperCase() === "DIV" && !!node.querySelector('a[href^="https://github.com"][href*="#L"]');
			},
			replacement: function (content, node, options) {
				return node.querySelector('a[href^="https://github.com"][href*="#L"]').getAttribute('href');
			}
		});
	}

	return turndownPluginGithubCodeSnippet;
}));
