import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";

test.describe("Sidebar navigation", () => {
  test("navigates through all sections", async ({ page, isMobile }) => {
    test.skip(isMobile, "Sidebar is hidden on mobile viewports by design");
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await dashboard.navLink("subscriptions").click();
    await expect(page).toHaveURL(/\/subscriptions$/);
    await expect(page.getByTestId("add-subscription")).toBeVisible();

    await dashboard.navLink("analytics").click();
    await expect(page).toHaveURL(/\/analytics$/);
    await expect(page.getByText("Monthly spend trend").first()).toBeVisible();

    await dashboard.navLink("calendar").click();
    await expect(page).toHaveURL(/\/calendar$/);

    await dashboard.navLink("settings").click();
    await expect(page).toHaveURL(/\/settings$/);

    await dashboard.navLink("dashboard").click();
    await expect(page).toHaveURL(/\/$/);
    await expect(dashboard.metricMonthly).toBeVisible();
  });
});
