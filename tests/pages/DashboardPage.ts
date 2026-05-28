import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  readonly path = "/";
  readonly readyLocator: Locator = this.page.getByTestId("metric-monthly");

  get metricMonthly() {
    return this.page.getByTestId("metric-monthly");
  }
  get metricYearly() {
    return this.page.getByTestId("metric-yearly");
  }
  get metricActive() {
    return this.page.getByTestId("metric-active");
  }
  get metricRenewals() {
    return this.page.getByTestId("metric-renewals");
  }

  get featuredHeading() {
    return this.page.getByText("Featured renewal");
  }

  get tiles() {
    return this.page.getByTestId("subscription-tile");
  }
}
