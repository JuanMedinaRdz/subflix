import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly path = "/login";
  readonly readyLocator: Locator = this.page.getByRole("heading", { name: "Sign in" });

  get email() {
    return this.page.getByTestId("login-email");
  }
  get submit() {
    return this.page.getByTestId("login-submit");
  }
  get demoLink() {
    return this.page.getByRole("link", { name: /Try the demo without signing in/i });
  }
  get checkInboxMessage() {
    return this.page.getByRole("heading", { name: "Check your inbox" });
  }

  async submitEmail(email: string) {
    await this.email.fill(email);
    await this.submit.click();
  }
}
