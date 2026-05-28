import { test, expect } from "@playwright/test";

/**
 * Sanity-check that every public route boots without runtime errors and
 * renders an expected piece of content.
 */

const routes = [
  { path: "/", expect: /Featured renewal/i },
  { path: "/subscriptions", expect: /tracked subscriptions/i },
  { path: "/analytics", expect: /Monthly cost/i },
  { path: "/calendar", expect: /Renewals calendar/i },
  { path: "/settings", expect: /Customize your Subflix experience/i },
  { path: "/login", expect: /Sign in/i }
];

for (const route of routes) {
  test(`smoke: ${route.path} renders`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(route.path);
    await expect(page.getByText(route.expect).first()).toBeVisible();

    expect(errors, `Unhandled errors on ${route.path}`).toEqual([]);
  });
}
