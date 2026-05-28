import type { Locator, Page } from "@playwright/test";

/**
 * Shared building blocks for every page object.
 *
 * Children only declare locators and high-level actions specific to their page;
 * navigation and common waits live here.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Absolute URL path this page lives at (e.g. "/subscriptions"). */
  abstract readonly path: string;

  /** A locator that, when visible, signals the page is ready to be tested. */
  abstract readonly readyLocator: Locator;

  async goto() {
    await this.page.goto(this.path, { waitUntil: "domcontentloaded" });
    await this.readyLocator.waitFor({ state: "visible" });
  }

  // Layout helpers shared across pages
  get sidebar() {
    return this.page.locator("aside");
  }

  navLink(label: "dashboard" | "subscriptions" | "analytics" | "calendar" | "settings") {
    return this.page.getByTestId(`nav-${label}`);
  }

  get topbarSignIn() {
    return this.page.getByTestId("topbar-signin");
  }

  get topbarUser() {
    return this.page.getByTestId("topbar-user");
  }
}
