import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CalendarPage extends BasePage {
  readonly path = "/calendar";
  readonly readyLocator: Locator = this.page.getByRole("heading", {
    name: "Renewals calendar"
  });

  get prevMonth() {
    return this.page.getByRole("button", { name: "Previous month" });
  }
  get nextMonth() {
    return this.page.getByRole("button", { name: "Next month" });
  }
  get todayButton() {
    return this.page.getByRole("button", { name: "Today", exact: true });
  }
}
