declare module "turndown-plugin-github-code-snippet" {
  import type TurndownService from "@types/turndown";

  /**
   * Turndown plugin to convert GitHub code snippet in comments back into normal links.
   * @param {TurndownService} turndownService - Turndown service
   * @returns {TurndownService} Turndown service
   */
  export default function turndownPluginGitHubCodeSnippet(
    turndownService: TurndownService,
  ): TurndownService;

  export = turndownPluginGitHubCodeSnippet;
}
