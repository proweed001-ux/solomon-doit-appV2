import { expect, test } from "@playwright/test";

const STORAGE = "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/doit-files/";
const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+Xw4xAAAAAElFTkSuQmCC",
  "base64",
);

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
      cd4OlCombinedIntoDc3: false,
    },
    ps: [{ ps: "AYAPS001", ads: "AYAADS01", name: "PS 001", ...structuredClone(metrics) }],
    ads: [{ ads: "AYAADS01", name: "ADS 01", ...structuredClone(metrics) }],
    ds: { code: "DS", name: "DS", ...structuredClone(metrics) },
  };
}

async function routeRevealData(page, { delayMs = 0, failFirst = false } = {}) {
  let currentAttempts = 0;
  await page.route("https://ik.imagekit.io/AYAPS/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "image/png", body: TRANSPARENT_PNG });
  });
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

test("Reveal race uses the full stage height and shows competitors after GO", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await routeRevealData(page);

  await page.goto("/performance-reveal-v2.html?test=1");
  const activeCard = page.locator("#slides-ps .race-card.active");
  const track = activeCard.locator(".race-track");
  await expect(activeCard.locator("[data-start-race]")).toBeVisible();

  const stageBox = await page.locator("#stage-ps").boundingBox();
  const cardBox = await activeCard.boundingBox();
  const trackBox = await track.boundingBox();
  expect(stageBox?.height || 0).toBeGreaterThan(500);
  expect(cardBox?.height || 0).toBeGreaterThan(500);
  expect(trackBox?.height || 0).toBeGreaterThan(350);

  await expect(page.locator('#slides-ps [data-category="moq"] .race-badge')).toContainText("TOP DGP");

  await activeCard.locator("[data-start-race]").click();
  await expect(activeCard).toHaveClass(/winner-ready/);
  await expect(activeCard.locator(".race-row")).toHaveCount(1);
  await expect(activeCard.locator(".race-avatar")).toBeVisible();
  const finalBarHeight = await activeCard.locator(".race-bar").evaluate((element) => parseFloat(getComputedStyle(element).height));
  expect(finalBarHeight).toBeGreaterThan(40);
  expect(errors).toEqual([]);
});

test("Reveal pseudo fullscreen fills the viewport and keeps an exit control visible", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    for (const key of ["requestFullscreen", "webkitRequestFullscreen"]) {
      try { Object.defineProperty(Element.prototype, key, { value: undefined, configurable: true }); } catch {}
    }
  });
  await routeRevealData(page);

  await page.goto("/performance-reveal-v2.html?test=1");
  await expect(page.locator("#slides-ps .race-card.active [data-start-race]")).toBeVisible();

  const toggle = page.locator("#fullscreen-toggle");
  await toggle.click();
  await expect(page.locator("body")).toHaveClass(/pseudo-fullscreen/);
  await expect(page.locator("body")).toHaveClass(/presentation-mode/);
  await expect(toggle).toBeVisible();
  await expect(page.locator(".header")).toBeHidden();
  await expect(page.locator(".mode-tabs")).toBeHidden();
  await expect(page.locator(".award-controls").first()).toBeHidden();
  await expect(page.locator("#presentation-next")).toBeVisible();

  const viewport = page.viewportSize();
  const mainBox = await page.locator("main").boundingBox();
  const panelBox = await page.locator('.mode-panel[data-panel="ps"]').boundingBox();
  const stageBox = await page.locator("#stage-ps").boundingBox();
  const cardBox = await page.locator("#slides-ps .race-card.active").boundingBox();
  expect(viewport).not.toBeNull();
  expect(Math.abs((mainBox?.height || 0) - viewport.height)).toBeLessThanOrEqual(2);
  expect(Math.abs((panelBox?.height || 0) - viewport.height)).toBeLessThanOrEqual(2);
  expect(Math.abs((stageBox?.height || 0) - viewport.height)).toBeLessThanOrEqual(2);
  expect(Math.abs((cardBox?.height || 0) - viewport.height)).toBeLessThanOrEqual(2);
  const exitLabel = await toggle.evaluate((element) => getComputedStyle(element, "::before").content);
  expect(exitLabel).toContain("ออกเต็มจอ");

  await toggle.click();
  await expect(page.locator("body")).not.toHaveClass(/pseudo-fullscreen/);
  await expect(page.locator("body")).not.toHaveClass(/presentation-mode/);
  await expect(page.locator(".header")).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/performance-reveal-v2.html");
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
