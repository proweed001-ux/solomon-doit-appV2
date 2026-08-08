import { expect, test } from "@playwright/test";

const STORAGE = "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/doit-files/";

function metric(target, actual) {
  return { target, actual, index: target ? (actual / target) * 100 : 0 };
}

function currentSnapshot() {
  const metrics = {
    sales: metric(1000, 850),
    giv: metric(1000, 820),
    moq: metric(100, 80),
    dc1: metric(100, 75),
    dc2: metric(100, 72),
    dc3: metric(100, 68),
    cd123: metric(300, 215),
    bills: metric(50, 40),
    gps: { target: 0, actual: 92, index: 92 },
    dgp: metric(100, 88),
  };
  return {
    meta: {
      reportDate: "2026-08-08",
      reportKey: "202608-WD06",
      workdayNo: 6,
      totalWorkdays: 24,
      daysLeft: 18,
    },
    ps: [{ ps: "AYAPS001", ads: "AYAADS01", name: "PS 001", ...structuredClone(metrics) }],
    ads: [{ ads: "AYAADS01", name: "ADS 01", ...structuredClone(metrics) }],
    ds: { code: "DS", name: "DS", ...structuredClone(metrics) },
  };
}

async function routeRevealData(page, { delayMs = 0, failFirst = false } = {}) {
  let currentAttempts = 0;
  await page.route(`${STORAGE}**`, async (route) => {
    const path = new URL(route.request().url()).pathname.split("/doit-files/")[1];
    if (path === "performance/current.min.json") {
      currentAttempts += 1;
      if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs));
      if (failFirst && currentAttempts === 1) {
        await route.fulfill({ status: 503, contentType: "application/json", body: "{}" });
        return;
      }
      await route.fulfill({ contentType: "application/json", body: JSON.stringify(currentSnapshot()) });
      return;
    }
    if (path === "performance/history-index.json") {
      await route.fulfill({ contentType: "application/json", body: "[]" });
      return;
    }
    await route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
  });
  return () => currentAttempts;
}

test("Reveal shows all award cards immediately while latest Performance data is still loading", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const attempts = await routeRevealData(page, { delayMs: 900 });

  await page.goto("/performance-reveal-v2.html?test=1");

  await expect(page.locator("#slides-ps [data-award-slide]")).toHaveCount(6);
  await expect(page.locator("#slides-ads [data-award-slide]")).toHaveCount(6);
  const loadingCover = page.locator("#slides-ps .award-slide.active [data-reveal-loading]");
  await expect(loadingCover).toBeVisible();
  await expect(loadingCover).toBeDisabled();
  await expect(loadingCover).toContainText("TOP VOLUME");
  await expect(loadingCover).toContainText("กำลังโหลดข้อมูล");

  const readyCover = page.locator("#slides-ps .award-slide.active [data-start-race]");
  await expect(readyCover).toBeVisible();
  await expect(readyCover).toBeEnabled();
  await expect(readyCover).toContainText("START THE RACE");
  expect(attempts()).toBe(1);
  expect(errors).toEqual([]);
});

test("Reveal keeps the stage visible and offers retry when latest Performance data fails", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const attempts = await routeRevealData(page, { failFirst: true });

  await page.goto("/performance-reveal-v2.html?test=1");

  await expect(page.locator("#status")).toHaveClass(/error/);
  await expect(page.locator("#slides-ps [data-award-slide]")).toHaveCount(6);
  const retry = page.locator("#slides-ps .award-slide.active [data-retry-reveal]");
  await expect(retry).toBeVisible();
  await expect(retry).toContainText("โหลดข้อมูลไม่สำเร็จ");

  await Promise.all([
    page.waitForNavigation(),
    retry.click(),
  ]);

  const readyCover = page.locator("#slides-ps .award-slide.active [data-start-race]");
  await expect(readyCover).toBeVisible();
  await expect(readyCover).toContainText("START THE RACE");
  expect(attempts()).toBeGreaterThanOrEqual(2);
  expect(errors).toEqual([]);
});
