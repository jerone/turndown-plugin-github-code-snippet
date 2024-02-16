var Attendant = require('turndown-attendant');
var TurndownService = require('turndown');
var turndownPluginGithubCodeSnippet = require('../src/turndown-plugin-github-code-snippet.js');

var attendant = new Attendant({
	file: __dirname + '/index.html',
	TurndownService: TurndownService,
	beforeEach: function(turndownService) {
		turndownService.use(turndownPluginGithubCodeSnippet);
	}
});

attendant.run();