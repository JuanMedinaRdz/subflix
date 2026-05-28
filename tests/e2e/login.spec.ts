import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

/**
 * The login form's happy path requires a real magic-link email, which we
 * can't (and shouldn't) hit from CI. These tests cover the UI contract:
 * the form renders, the disabled-when-unconfigured state behaves correctly,
 * and the "demo without signing in" escape hatch always works.
 */

test.describe("Login page", () => {
  test("renders the sign-in form", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await expect(login.email).toBeVisible();
    await expect(login.submit).toBeVisible();
    await expect(login.demoLink).toBeVisible();
  });

  test("disables submission when Supabase env vars are missing", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    // Without NEXT_PUBLIC_SUPABASE_* env vars the auth provider runs in
    // demo mode and the submit button stays disabled so users can't
    // attempt a magic link that would never arrive.
    await expect(login.submit).toBeDisabled();
    await expect(
      page.getByText(/Auth is not configured on this deploy/i)
    ).toBeVisible();
  });

  test("'try the demo' link returns to the dashboard", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.demoLink.click();
    await expect(page).toHaveURL(/\/$/);
  });
});
