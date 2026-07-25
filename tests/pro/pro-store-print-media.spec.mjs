import { expect, test } from "@playwright/test";

test("keeps Pro store bills visible in print media", async ({ page }) => {
  await page.goto("/pro.html?t=1028");

  const printSource = await page.evaluate(async () => {
    const response = await fetch("/assets/pro/print.js");
    if (!response.ok) throw new Error(`print.js returned ${response.status}`);
    return response.text();
  });
  expect(printSource).toContain(
    'overlay.className = "printOverlay printMobileSafeA4";',
  );
  expect(printSource).toContain(
    'overlay.style.setProperty("display", "block", "important");',
  );

  await page.evaluate(() => {
    const overlay = document.createElement("div");
    overlay.className = "printOverlay printMobileSafeA4";
    overlay.style.setProperty("display", "block", "important");
    overlay.innerHTML =
      '<div class="a4Sheet"><section class="receiptPage"><h1>บิลสินค้า/ ใบเสร็จ</h1><table class="receiptTable"><tbody><tr><td>สินค้าทดสอบ</td></tr></tbody></table></section></div>';
    document.body.appendChild(overlay);
  });

  await page.emulateMedia({ media: "print" });
  const overlay = page.locator("body > .printMobileSafeA4");
  await expect(overlay).toBeVisible();
  await expect(overlay.locator(".receiptPage")).toHaveCount(1);
  await expect(overlay).toContainText("บิลสินค้า/ ใบเสร็จ");
  await expect(overlay).toContainText("สินค้าทดสอบ");
});
