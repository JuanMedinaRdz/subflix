import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";

test.describe("Dashboard", () => {
  test("renders all 4 metric cards with non-empty values", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const cards = [
      dashboard.metricMonthly,
      dashboard.metricYearly,
      dashboard.metricActive,
      dashboard.metricRenewals
    ];

    for (const card of cards) {
      await expect(card).toBeVisible();
      const text = (await card.textContent()) ?? "";
      expect(text.trim().length).toBeGreaterThan(2);
    }
  });

  test("hero section shows a featured renewal", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await expect(dashboard.featuredHeading).toBeVisible();
    await expect(page.getByRole("button", { name: /Pause|Resume/ }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Edit/ }).first()).toBeVisible();
  });

  test("subscription tiles are rendered in rows", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const tileCount = await dashboard.tiles.count();
    // Seed has 14 subs, but multiple rows show the same sub. Expect many tiles.
    expect(tileCount).toBeGreaterThan(10);
  });
});
