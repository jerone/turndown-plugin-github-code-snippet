/* eslint-env node */

var Attendant = require("turndown-attendant");
var TurndownService = require("turndown");
var turndownPluginGitHubCodeSnippet = require("../src/turndown-plugin-github-code-snippet.js");

var attendant = new Attendant({
  file: __dirname + "/index.html",
  TurndownService: TurndownService,
  beforeEach: function (turndownService) {
    turndownService.use(turndownPluginGitHubCodeSnippet);
  },
});

attendant.run();
