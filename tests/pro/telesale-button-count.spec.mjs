import { expect, test } from "@playwright/test";

const ACTIVE_ENDPOINT =
  "https://saodmeoilixfdqentofp.supabase.co/functions/v1/doit-active";

async function mockEmptyCloud(page) {
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
}

async function closeTeamModal(page) {
  await page.waitForTimeout(400);
  const teamModal = page.locator("#devTeamModal");
  if (await teamModal.evaluate((element) => element.classList.contains("on"))) {
    await teamModal.locator(".devClose").click();
  }
}

test("shows the Telesale bill count before opening the drawer", async ({ page }) => {
  await mockEmptyCloud(page);
  await page.goto("/pro.html?t=telesale-count-visible");

  const button = page.locator("#teleBtn");
  const label = button.locator(".teleBtnLabel");
  const count = button.locator(".teleBtnCount");

  await expect(label).toHaveText("บิล Telesale");
  await expect(count).toHaveText("(0)");
  await expect(count).toBeVisible();
  const beforeStyle = await count.evaluate((element) => ({
    display: element.style.display,
    marginLeft: element.style.marginLeft,
  }));
  expect(beforeStyle).toEqual({ display: "inline", marginLeft: "3px" });

  await closeTeamModal(page);
  const beforeChildren = await button.evaluate((element) =>
    [...element.children].map((child) => child.className),
  );
  expect(beforeChildren).toEqual(["teleBtnLabel", "teleBtnCount"]);

  await button.click();
  await expect(page.locator("#teleDrawer")).toHaveClass(/on/);
  await expect(label).toHaveText("บิล Telesale");
  await expect(count).toHaveText("(0)");
  await expect(count).toBeVisible();

  const afterStyle = await count.evaluate((element) => ({
    display: element.style.display,
    marginLeft: element.style.marginLeft,
  }));
  expect(afterStyle).toEqual(beforeStyle);
  const afterChildren = await button.evaluate((element) =>
    [...element.children].map((child) => child.className),
  );
  expect(afterChildren).toEqual(beforeChildren);
});

test("blocks a second print preview while one is already open", async ({ page }) => {
  await mockEmptyCloud(page);
  const dialogs = [];
  page.on("dialog", async (dialog) => {
    dialogs.push(dialog.message());
    await dialog.dismiss();
  });
  await page.goto("/pro.html?t=single-print-overlay");
  await closeTeamModal(page);

  await page.evaluate(() => {
    const overlay = document.createElement("div");
    overlay.className = "printOverlay";
    document.body.appendChild(overlay);
  });
  await expect(page.locator(".printOverlay")).toHaveCount(1);

  await page.locator("#prepPrint").click();
  await expect(page.locator(".printOverlay")).toHaveCount(1);
  expect(dialogs).toEqual([]);
});
