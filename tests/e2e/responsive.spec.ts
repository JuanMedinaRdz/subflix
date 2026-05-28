import { test, expect } from "@playwright/test";

test.describe("Responsive behavior", () => {
  test("dashboard hides the sidebar on mobile viewports", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile-only assertion");

    await page.goto("/");
    await expect(page.locator("aside")).toBeHidden();
    await expect(page.getByText("Featured renewal")).toBeVisible();
  });

  test("dashboard shows the sidebar on desktop viewports", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop-only assertion");

    await page.goto("/");
    await expect(page.locator("aside")).toBeVisible();
  });

  test("subscriptions grid is browseable on mobile", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile-only assertion");

    await page.goto("/subscriptions");
    await expect(page.getByTestId("subscription-card").first()).toBeVisible();
  });
});
