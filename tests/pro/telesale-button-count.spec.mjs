import { expect, test } from "@playwright/test";

const ACTIVE_ENDPOINT =
  "https://saodmeoilixfdqentofp.supabase.co/functions/v1/doit-active";

test("shows the Telesale bill count before opening the drawer", async ({ page }) => {
  await page.route(`${ACTIVE_ENDPOINT}?mode=data`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        mode: "inline",
        payload: { rows: [] },
        active: {
          id: "telesale-count-test",
          file_name: "telesale-count-test.json",
          row_count: 0,
          store_count: 0,
          ps_count: 0,
          telesale_bill_count: 0,
        },
      }),
    });
  });

  await page.goto("/pro.html?t=telesale-count-visible");

  const button = page.locator("#teleBtn");
  const label = button.locator(".teleBtnLabel");
  const count = button.locator(".teleBtnCount");

  await expect(label).toHaveText("บิล Telesale");
  await expect(count).toHaveText("(0)");
  await expect(count).toBeVisible();
  expect(await count.evaluate((element) => getComputedStyle(element).display)).not.toBe(
    "none",
  );

  await page.waitForTimeout(400);
  const teamModal = page.locator("#devTeamModal");
  if (await teamModal.evaluate((element) => element.classList.contains("on"))) {
    await teamModal.locator(".devClose").click();
  }

  const beforeChildren = await button.evaluate((element) =>
    [...element.children].map((child) => child.className),
  );
  expect(beforeChildren).toEqual(["teleBtnLabel", "teleBtnCount"]);

  await button.click();
  await expect(page.locator("#teleDrawer")).toHaveClass(/on/);
  await expect(label).toHaveText("บิล Telesale");
  await expect(count).toHaveText("(0)");
  await expect(count).toBeVisible();
  expect(await count.evaluate((element) => getComputedStyle(element).display)).not.toBe(
    "none",
  );

  const afterChildren = await button.evaluate((element) =>
    [...element.children].map((child) => child.className),
  );
  expect(afterChildren).toEqual(beforeChildren);
});
