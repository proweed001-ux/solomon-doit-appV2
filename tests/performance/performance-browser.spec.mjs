import { expect, test } from "@playwright/test";

const STORAGE = "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/doit-files/";

function row(ps, ads, multiplier = 1) {
  return {
    ps,
    ads,
    name: `พนักงาน ${ps}`,
    sales: { target: 1000, actual: 900 * multiplier },
    giv: { target: 100, actual: 90 * multiplier },
    moq: { target: 100, actual: 85 * multiplier },
    dc1: { target: 100, actual: 80 * multiplier },
    dc2: { target: 100, actual: 75 * multiplier },
    dc3: { target: 100, actual: 70 * multiplier },
    cd123: { target: 300, actual: 225 * multiplier },
    bills: { target: 50, actual: 45 * multiplier },
    gps: { target: 100, actual: 95 * multiplier },
    dgp: { target: 100, actual: 88 * multiplier },
  };
}

function snapshot(day, factor = 1) {
  const ps = [
    row("AYAPS001", "AYAADS01", factor),
    row("AYAPS002", "AYAADS01", factor * 0.95),
    row("AYAPS003", "AYAADS02", factor * 0.9),
    row("AYAPS004", "AYAADS02", factor * 0.85),
    row("AYAPS005", "AYAADS03", factor * 0.8),
    row("AYAPS006", "AYAADS04", factor * 0.75),
  ];
  return {
    meta: { reportDate: `2026-08-${String(day).padStart(2, "0")}`, reportKey: `202608-WD${String(day).padStart(2, "0")}` },
    ps,
    ads: ["AYAADS01", "AYAADS02", "AYAADS03", "AYAADS04"].map((ads) => ({ ads, name: ads })),
    ds: { code: "DS", name: "DS" },
  };
}

async function mockPerformance(page) {
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  const latest = snapshot(6, 1);
  const history = [1, 2, 3, 4, 5].map((day) => ({
    reportDate: `2026-08-${String(day).padStart(2, "0")}`,
    reportKey: `202608-WD${String(day).padStart(2, "0")}`,
    path: `performance/compare/202608-WD${String(day).padStart(2, "0")}.json`,
  }));

  await page.route(`${STORAGE}**`, async (route) => {
    const path = new URL(route.request().url()).pathname.split("/doit-files/")[1];
    if (path === "performance/current.min.json") {
      await route.fulfill({ contentType: "application/json", body: JSON.stringify(latest) });
      return;
    }
    if (path === "performance/history-index.json") {
      await route.fulfill({ contentType: "application/json", body: JSON.stringify(history) });
      return;
    }
    const match = path.match(/performance\/compare\/202608-WD(\d+)\.json/);
    if (match) {
      await new Promise((resolve) => setTimeout(resolve, 180));
      const day = Number(match[1]);
      await route.fulfill({ contentType: "application/json", body: JSON.stringify(snapshot(day, 0.55 + day * 0.07)) });
      return;
    }
    await route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
  });
  return requests;
}

test("shows latest reveal before history and keeps the award flow usable", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const requests = await mockPerformance(page);

  await page.goto("/performance-reveal-v2.html?test=1");
  await expect(page.locator("#period")).toContainText("AUGUST 2026");
  await expect(page.locator("#slides-ps .race-cover")).toHaveCount(6);
  await expect(page.locator("#status")).toContainText("กำลังโหลดประวัติ");

  await expect(page.locator("#status")).toContainText("ใช้การแข่งขัน 6 ช่วง");
  const compareRequests = requests.filter((url) => url.includes("/performance/compare/"));
  expect(compareRequests).toHaveLength(5);
  expect(requests.some((url) => /cdn\.tailwindcss|fonts\.googleapis/i.test(url))).toBe(false);

  await page.locator('[data-mode="ads"]').click();
  await expect(page.locator('[data-panel="ads"]')).toBeVisible();
  await page.locator('[data-mode="ps"]').click();

  const activeCard = page.locator("#slides-ps .race-card.active");
  await activeCard.locator(".race-cover").click();
  await expect(activeCard).toHaveClass(/winner-ready/);
  await expect(activeCard.locator(".race-row")).toHaveCount(5);
  await activeCard.click({ position: { x: 8, y: 8 } });
  await expect(activeCard.locator(".winner-reveal")).toHaveClass(/visible/);
  await expect(activeCard.locator(".winner-percent")).toContainText(/\.\d{2}%$/);
  await activeCard.locator(".winner-back").click();
  await expect(activeCard.locator(".winner-reveal")).not.toHaveClass(/visible/);

  await page.locator("#fullscreen-toggle").click();
  await expect(page.locator("body")).toHaveClass(/presentation-mode/);
  await expect(page.locator("#presentation-next")).toBeVisible();
  expect(errors).toEqual([]);
});

test("loads the direct board without the legacy adapter", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const requests = await mockPerformance(page);

  await page.goto("/performance-v2.html?mode=ds");
  await expect(page.locator("#performance-status")).toContainText("ข้อมูลล่าสุด");
  await expect(page.locator("#app")).toContainText("DS ภาพรวม");
  await page.locator('[data-mode="ads"]').click();
  await expect(page.locator("#app")).toContainText("ADS ทั้งหมด");
  await page.locator('[data-mode="compare"]').click();
  await expect(page.locator("#app")).toContainText("เทียบย้อนหลัง");
  await expect(page.locator("#performance-status")).toContainText("ประวัติ 5 ช่วง");
  expect(requests.some((url) => url.includes("performance-cd-adapter"))).toBe(false);
  expect(requests.some((url) => /cdn\.tailwindcss|fonts\.googleapis/i.test(url))).toBe(false);
  expect(errors).toEqual([]);
});
