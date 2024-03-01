/* eslint-env node */

import Attendant from "turndown-attendant";
import TurndownService from "turndown";
import turndownPluginGitHubCodeSnippet from "../src/index.mjs";

const attendant = new Attendant({
  file: "./test/index.html",
  TurndownService: TurndownService,
  beforeEach: function (turndownService) {
    turndownService.use(turndownPluginGitHubCodeSnippet);
  },
});

attendant.run();
