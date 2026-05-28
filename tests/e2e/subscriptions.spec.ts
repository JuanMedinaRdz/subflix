import { test, expect } from "@playwright/test";
import { SubscriptionsPage } from "../pages/SubscriptionsPage";

test.describe("Subscriptions CRUD (demo mode)", () => {
  // Clear localStorage once per test at boot. We deliberately avoid
  // page.addInitScript because that would also fire on page.reload(),
  // wiping out subscriptions we want to assert persist.
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("lists the 14 seed subscriptions", async ({ page }) => {
    const subs = new SubscriptionsPage(page);
    await subs.goto();
    await expect(subs.cards).toHaveCount(14);
  });

  test("creates a new subscription and shows it in the grid", async ({ page }) => {
    const subs = new SubscriptionsPage(page);
    await subs.goto();
    await expect(subs.cards.first()).toBeVisible();

    await subs.openNewForm();
    await subs.fillAndSubmit({ name: "YouTube Premium", price: 13.99 });

    await expect(subs.cardByName("YouTube Premium")).toBeVisible();
    await expect(subs.cards).toHaveCount(15);
  });

  test("created subscription persists across reload", async ({ page }) => {
    const subs = new SubscriptionsPage(page);
    await subs.goto();
    await expect(subs.cards.first()).toBeVisible();

    await subs.openNewForm();
    await subs.fillAndSubmit({ name: "Persisted Sub", price: 9.99 });
    await expect(subs.cardByName("Persisted Sub")).toBeVisible();

    await page.reload();
    await subs.readyLocator.waitFor({ state: "visible" });
    await expect(subs.cardByName("Persisted Sub")).toBeVisible();
  });

  test("filters the grid by name with the search input", async ({ page }) => {
    const subs = new SubscriptionsPage(page);
    await subs.goto();
    // Wait until React has hydrated and rendered the seed cards before typing
    // into the controlled input, otherwise the keystrokes get dropped.
    await expect(subs.cards).toHaveCount(14);

    await subs.search("netflix");
    await expect(subs.cards).toHaveCount(1);
    await expect(subs.cardByName("Netflix")).toBeVisible();

    await subs.search("");
    await expect(subs.cards).toHaveCount(14);
  });

  test("deletes a subscription via the card menu", async ({ page }) => {
    const subs = new SubscriptionsPage(page);
    await subs.goto();
    await expect(subs.cards).toHaveCount(14);

    const target = subs.cardByName("Linear").first();
    await target.getByRole("button", { name: "Actions" }).click();
    await page.getByRole("menuitem", { name: /Delete/i }).click();

    await expect(subs.cardByName("Linear")).toHaveCount(0);
    await expect(subs.cards).toHaveCount(13);
  });
});
