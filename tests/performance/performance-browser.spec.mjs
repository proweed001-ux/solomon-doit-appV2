import { expect, test } from "@playwright/test";

const STORAGE = "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/doit-files/";
const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+Xw4xAAAAAElFTkSuQmCC",
  "base64",
);

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

function aggregate(rows, key) {
  const target = rows.reduce((sum, item) => sum + Number(item[key]?.target || 0), 0);
  const actual = rows.reduce((sum, item) => sum + Number(item[key]?.actual || 0), 0);
  return { target, actual, index: target ? (actual / target) * 100 : 0 };
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
  const keys = ["sales", "giv", "moq", "dc1", "dc2", "dc3", "cd123", "bills", "gps", "dgp"];
  const ads = ["AYAADS01", "AYAADS02", "AYAADS03", "AYAADS04"].map((code) => {
    const members = ps.filter((item) => item.ads === code);
    const result = { ads: code, name: code };
    keys.forEach((key) => { result[key] = aggregate(members, key); });
    return result;
  });
  const ds = { code: "DS", name: "DS" };
  keys.forEach((key) => { ds[key] = aggregate(ps, key); });
  return {
    meta: {
      reportDate: `2026-08-${String(day).padStart(2, "0")}`,
      reportKey: `202608-WD${String(day).padStart(2, "0")}`,
      workdayNo: day,
      totalWorkdays: 24,
      daysLeft: 24 - day,
    },
    ps,
    ads,
    ds,
    ms: [],
  };
}

async function mockPerformance(page, currentDay = 18) {
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  const latest = snapshot(currentDay, 1);
  const historyDays = (currentDay >= 14
    ? [currentDay - 1, currentDay - 2, currentDay - 3, currentDay - 12, currentDay - 13]
    : Array.from({ length: Math.min(5, currentDay - 1) }, (_, index) => currentDay - index - 1))
    .filter((day) => day > 0);
  const history = historyDays.map((day) => ({
    reportDate: `2026-08-${String(day).padStart(2, "0")}`,
    reportKey: `202608-WD${String(day).padStart(2, "0")}`,
    workdayNo: day,
    path: `performance/compare/202608-WD${String(day).padStart(2, "0")}.json`,
  }));

  await page.route("https://ik.imagekit.io/AYAPS/**", async (route) => {
    await route.fulfill({ contentType: "image/png", body: TRANSPARENT_PNG });
  });
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
      await new Promise((resolve) => setTimeout(resolve, 120));
      const day = Number(match[1]);
      await route.fulfill({ contentType: "application/json", body: JSON.stringify(snapshot(day, 0.55 + day * 0.02)) });
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
  const requests = await mockPerformance(page, 6);

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

test("uses one-metric accordion drill-down and preserves person and compare flows", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const requests = await mockPerformance(page);

  await page.goto("/performance.html?mode=ds");
  await expect(page.locator("#app")).toContainText("DS ภาพรวม");
  await expect(page.locator(".performance-metric-switcher .metric-chip")).toHaveCount(10);
  await expect(page.locator(".performance-metric-switcher .metric-chip").first()).toHaveClass(/on/);
  await expect(page.locator(".metric-hero")).toHaveCount(1);
  await expect(page.locator(".ads-accordion-item")).toHaveCount(4);

  const first = page.locator(".ads-accordion-item").first();
  const second = page.locator(".ads-accordion-item").nth(1);
  await first.locator(".ads-accordion-head").click();
  await expect(first).toHaveClass(/open/);
  await second.locator(".ads-accordion-head").click();
  await expect(second).toHaveClass(/open/);
  await expect(first).toHaveClass(/open/);

  const firstTeamPs = first.locator(".ps-row");
  await expect(firstTeamPs.first()).toContainText("AYAPS002");
  await firstTeamPs.first().click();
  await expect(page.locator(".person-card")).toBeVisible();
  await expect(page.locator(".progress-ring")).toBeVisible();
  await expect(page.locator(".person-metric-card")).toHaveCount(9);

  const mini = page.locator(".person-metric-card").first();
  await mini.locator(".person-metric-toggle").click();
  await expect(mini).toHaveClass(/open/);
  await expect(mini.locator("[data-pct]")).toBeVisible();
  await mini.locator("[data-pct]").fill("92");
  await mini.locator("[data-pct]").press("Tab");
  await expect(page.locator(".person-metric-card").first()).toHaveClass(/open/);

  await page.locator('.nav [data-mode="compare"]').click();
  await expect(page.locator(".compare-nav .compare-chip")).toHaveCount(4);
  await expect(page.locator(".delta-hero")).toBeVisible();
  await expect(page.locator(".metric-delta-list .cmpCatCard")).toHaveCount(10);
  await expect(page.locator(".top-movers .movers-group")).toHaveCount(2);

  expect(requests.some((url) => url.includes("performance-cd-adapter"))).toBe(false);
  expect(requests.some((url) => /cdn\.tailwindcss/i.test(url))).toBe(false);
  expect(errors).toEqual([]);
});

test("keeps legacy Performance Board deep links renderable", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await mockPerformance(page);

  await page.goto("/performance.html?mode=ads");
  await expect(page.locator(".ads-accordion-item")).toHaveCount(4);

  await page.goto("/performance.html?mode=ps&ads=AYAADS01");
  await expect(page.locator(".ads-accordion-item")).toHaveCount(1);
  await expect(page.locator(".ads-accordion-item")).toHaveClass(/open/);

  await page.goto("/performance.html?mode=person&ads=AYAADS01&ps=AYAPS002");
  await expect(page.locator(".person-card")).toContainText("AYAPS002");

  await page.goto("/performance.html?mode=compare&cat=sales&cmp=same");
  await expect(page.locator(".compare-drill")).toBeVisible();
  await expect(page.locator("#app")).not.toContainText("ยังไม่มีข้อมูลตลาดเดิม");

  expect(errors).toEqual([]);
});
