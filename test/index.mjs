/* eslint-env node */

"use strict";

import Attendant from "turndown-attendant";
import TurndownService from "turndown";
import turndownPluginGitHubCodeSnippet from "../src/index.mjs";

/** @type { Attendant.Attendant.Options } */
const options = {
  file: "./test/index.html",
  TurndownService: TurndownService,
  beforeEach: function (turndownService) {
    turndownService.use(turndownPluginGitHubCodeSnippet);
  },
};

const attendant = new Attendant(options);

attendant.run();
