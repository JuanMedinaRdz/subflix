import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export interface SubscriptionFormInput {
  name: string;
  price: number;
}

export class SubscriptionsPage extends BasePage {
  readonly path = "/subscriptions";
  readonly readyLocator: Locator = this.page.getByTestId("add-subscription");

  get searchInput() {
    return this.page.getByTestId("sub-search");
  }
  get newButton() {
    return this.page.getByTestId("add-subscription");
  }
  get cards() {
    return this.page.getByTestId("subscription-card");
  }
  cardByName(name: string) {
    return this.cards.filter({ hasText: name });
  }

  // Form (inside dialog)
  get formName() {
    return this.page.getByTestId("form-name");
  }
  get formPrice() {
    return this.page.getByTestId("form-price");
  }
  get formSubmit() {
    return this.page.getByTestId("form-submit");
  }

  async openNewForm() {
    await this.newButton.click();
    await this.page.getByTestId("subscription-form").waitFor({ state: "visible" });
  }

  async fillAndSubmit(data: SubscriptionFormInput) {
    await this.formName.fill(data.name);
    await this.formPrice.fill(String(data.price));
    await this.formSubmit.click();
    await this.page
      .getByTestId("subscription-form")
      .waitFor({ state: "hidden" });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }
}
