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
