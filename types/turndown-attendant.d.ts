declare module "turndown-attendant" {
  import type TurndownService from "@types/turndown";

  export = Attendant;

  /**
   * Test runner for HTML to Markdown conversions with Turndown.
   */
  export declare namespace Attendant {
    /** Turndown attendant options. */
    interface Options {
      /** Location of the HTML file. */
      file?: string | undefined;
      /** Turndown service. */
      TurndownService: TurndownService;
      /**
       * Method called before every test.
       * @param {TurndownService} turndownService - Turndown service
       */
      beforeEach?: (options: TurndownService) => void;
    }
  }

  type TestRunner = (
    name: string,
    cb: (t: {
      plan: (n: number) => void;
      equal(actual: any, expected: any): void;
    }) => void,
  ) => void;

  /**
   * Test runner for HTML to Markdown conversions with Turndown.
   * @param options Turndown attendant options.
   */
  export declare class Attendant {
    /**
     * Test runner for HTML to Markdown conversions with Turndown.
     * @param options Turndown attendant options.
     */
    constructor(options: Attendant.Options);
    /**
     * Tape - TAP-producing test harness for node and browsers.
     * @see https://www.npmjs.com/package/tape
     */
    test: TestRunner;
    /** Browser document. */
    document: typeof Document;
    /** Turndown service. */
    TurndownService: typeof TurndownService;
    /**
     * Method called before every test.
     * @param {TurndownService} turndownService - Turndown service
     */
    beforeEach: (TurndownService: TurndownService) => void;
    /** Run test cases. */
    run: () => void;
  }
}
