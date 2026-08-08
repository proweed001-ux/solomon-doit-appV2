import { expect, test } from "@playwright/test";

const STORAGE = "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/doit-files/";
const PIXEL = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");

function metric(target, actual, index = null) {
  return { target, actual, index: index ?? (target ? actual / target * 100 : 0) };
}

function person(ps, overrides = {}) {
  return {
    ps,
    ads: "AYAADS01",
    adsName: "หัวหน้าทีม 01",
    name: `พนักงาน ${ps}`,
    sales: metric(1000, 800),
    giv: metric(100, 80),
    moq: metric(100, 80),
    dc1: metric(100, 80),
    dc2: metric(100, 75),
    dc3: metric(100, 70),
    cd123: metric(300, 225),
    bills: metric(50, 40),
    gps: metric(0, 90, 90),
    dgp: metric(100, 80),
    ...overrides,
  };
}

function aggregate(rows, key) {
  let target = 0;
  let actual = 0;
  let indexTotal = 0;
  let indexCount = 0;
  for (const row of rows) {
    const value = row[key] || {};
    const rowTarget = Number(value.target || 0);
    if (key === "cd123" && rowTarget <= 0) continue;
    target += rowTarget;
    actual += Number(value.actual || 0);
    if (value && typeof value === "object" && ("target" in value || "actual" in value || "index" in value)) {
      indexTotal += Number(value.index || 0);
      indexCount += 1;
    }
  }
  if (target > 0) return { target, actual, index: actual / target * 100 };
  const average = indexCount ? indexTotal / indexCount : 0;
  return { target, actual: key === "gps" ? average : actual, index: average };
}

function pack(rows = [person("AYAPS001"), person("AYAPS002")], options = {}) {
  const updatedAt = options.updatedAt || "2026-08-08T12:00:00.000Z";
  const day = options.day || 8;
  const ads = [{ ads: "AYAADS01", adsName: "หัวหน้าทีม 01", name: "หัวหน้าทีม 01" }];
  const ds = { code: "DS", name: "DS" };
  const keys = ["sales","giv","moq","dc1","dc2","dc3","cd123","bills","gps","dgp"];
  for (const key of keys) {
    ads[0][key] = aggregate(rows, key);
    ds[key] = aggregate(rows, key);
  }
  return {
    meta: {
      schema: "performance-min-v5",
      reportDate: `2026-08-${String(day).padStart(2,"0")}`,
      reportKey: `202608-WD${String(day).padStart(2,"0")}`,
      workdayNo: day,
      totalWorkdays: 24,
      daysLeft: Math.max(24 - day, 0),
      updatedAt,
      cd4OlCombinedIntoDc3: false,
    },
    labels: {},
    ps: rows,
    ads,
    ds,
    ms: [],
  };
}

function separatorFull(current) {
  return {
    meta: { source:"full-performance-fixture" },
    reportDate: current.meta.reportDate,
    ads: [{ adsCode:"AYAADS01", adsName:"หัวหน้าทีม 01" }],
    ps: [{
      psCode:"AYAPS001",
      adsCode:"AYAADS01",
      psName:"พนักงาน AYAPS001",
      sellerReport: {
        "เป้าหมาย CD3 GL Blue2 Flexi":100,
        "การกระจาย CD3 GL Blue2 Flexi":70,
        "Index CD3 GL Blue2 Flexi":70,
        "เป้าหมาย CD4-OL":20,
        "การกระจาย CD4_OL":10,
      },
    }],
  };
}

async function mockImages(page) {
  await page.route("https://ik.imagekit.io/AYAPS/**", route => route.fulfill({ status: 200, contentType: "image/png", body: PIXEL }));
}

async function mockStorage(page, handler) {
  await page.route(`${STORAGE}**`, async route => {
    const path = new URL(route.request().url()).pathname.split("/doit-files/")[1];
    const value = await handler(path);
    if (value?.status) return route.fulfill(value);
    if (value !== undefined && value !== null) return route.fulfill({ contentType: "application/json", body: JSON.stringify(value) });
    return route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
  });
}

async function openCd1Award(page) {
  await expect(page.locator("#status")).toContainText("ข้อมูลล่าสุด");
  await page.locator("#next-ps").click();
  await page.locator("#next-ps").click();
  const card = page.locator('#slides-ps [data-category="dc1"]');
  await expect(card).toHaveClass(/active/);
  return card;
}

test("Reveal uses the exact verified Performance Board snapshot for CD competition", async ({ page }) => {
  const current = pack([person("AYAPS001", { dc1: metric(0,0,0) }), person("AYAPS002", { dc1: metric(0,0,0) })]);
  const board = structuredClone(current);
  board.ps[0].dc1 = metric(100, 85);
  board.ps[1].dc1 = metric(100, 75);
  board.ads[0].dc1 = aggregate(board.ps, "dc1");
  board.ds.dc1 = aggregate(board.ps, "dc1");
  board.meta.boardSchema = 7;
  board.meta.cdRecoveryChecked = true;
  board.meta.cd4OlValidated = true;

  await page.addInitScript(value => sessionStorage.setItem("perf-v5", JSON.stringify(value)), board);
  await mockImages(page);
  await mockStorage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/history-index.json") return [];
    return null;
  });

  await page.goto("/performance-reveal-v2.html?test=1");
  const card = await openCd1Award(page);
  await card.locator("[data-start-race]").click();
  await expect(card).toHaveClass(/winner-ready/);
  await expect(card.locator(".race-percent").first()).toHaveText("85.00%");
  await expect(card.locator(".race-row")).toHaveCount(2);
  const firstBarHeight = await card.locator(".race-bar").first().evaluate(element => parseFloat(element.style.height));
  expect(firstBarHeight).toBeGreaterThan(0);
});

test("Reveal rejects an older Performance Board session revision", async ({ page }) => {
  const current = pack([person("AYAPS001", { dc1: metric(0,0,0) })], { updatedAt:"2026-08-08T12:00:00.000Z" });
  const stale = pack([person("AYAPS001", { dc1: metric(100,99) })], { updatedAt:"2026-08-08T11:00:00.000Z" });
  stale.meta.boardSchema = 7;
  stale.meta.cdRecoveryChecked = true;
  stale.meta.cd4OlValidated = true;

  await page.addInitScript(value => sessionStorage.setItem("perf-v5", JSON.stringify(value)), stale);
  await mockImages(page);
  await mockStorage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/active.json") return { status:404, contentType:"application/json", body:"{}" };
    if (path === "performance/history-index.json") return [];
    return null;
  });

  await page.goto("/performance-reveal-v2.html?test=1");
  const card = await openCd1Award(page);
  await card.locator("[data-start-race]").click();
  await expect(card.locator(".race-cover")).toContainText("ไม่มีข้อมูล");
  await expect(card).not.toHaveClass(/winner-ready/);
});

test("Board does not render stale session data before current.min finishes", async ({ page }) => {
  const stale = pack([person("AYAPS001", { sales:metric(1000,100) })], { day:7, updatedAt:"2026-08-07T12:00:00.000Z" });
  stale.meta.boardSchema = 7;
  stale.meta.cdRecoveryChecked = true;
  stale.meta.cd4OlValidated = true;
  const current = pack([person("AYAPS001", { sales:metric(1000,900) })], { day:8, updatedAt:"2026-08-08T12:00:00.000Z" });

  await page.addInitScript(value => sessionStorage.setItem("perf-v5", JSON.stringify(value)), stale);
  await mockStorage(page, async path => {
    if (path === "performance/current.min.json") {
      await new Promise(resolve => setTimeout(resolve, 600));
      return current;
    }
    return null;
  });

  await page.goto("/performance.html?mode=ds", { waitUntil:"domcontentloaded" });
  await page.waitForTimeout(120);
  await expect(page.locator("#app")).toContainText("กำลังโหลดข้อมูล");
  await expect(page.locator("#app")).not.toContainText("202608-WD07");
  await expect(page.locator(".metric-hero")).toHaveCount(0);
  await expect(page.locator(".metric-hero-values > div").first().locator("strong")).toHaveText("900");
});

test("Board recovers CD from a verified Full snapshot with root reportDate and separator variants", async ({ page }) => {
  const current = pack([person("AYAPS001", { dc3:metric(100,70) })]);
  delete current.meta.cd4OlCombinedIntoDc3;
  const full = separatorFull(current);

  await mockStorage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/active.json") return {
      reportDate:current.meta.reportDate,
      reportKey:current.meta.reportKey,
      updatedAt:"2026-08-08T12:01:00.000Z",
      dataPath:"performance/live/full.json",
    };
    if (path === "performance/live/full.json") return full;
    return null;
  });

  await page.goto("/performance.html?mode=ds");
  await page.locator('[data-metric-key="dc3"]').click();
  await expect(page.locator(".metric-hero h2")).toContainText("CD3 + CD4 OL");
  await expect(page.locator(".metric-hero-values")).toContainText("80");
  await expect(page.locator(".metric-hero-values")).toContainText("120");
  await expect(page.locator(".metric-hero-stats")).toContainText("66.7%");
});

test("shared Performance CD enrichment accepts root reportDate and separator variants", async ({ page }) => {
  const current = pack([person("AYAPS001", { dc3:metric(100,70) })]);
  delete current.meta.cd4OlCombinedIntoDc3;
  const full = separatorFull(current);

  await mockStorage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/active.json") return {
      reportDate:current.meta.reportDate,
      reportKey:current.meta.reportKey,
      updatedAt:"2026-08-08T12:01:00.000Z",
      dataPath:"performance/live/full.json",
    };
    if (path === "performance/live/full.json") return full;
    return null;
  });

  await page.goto("/performance.html?mode=ds");
  const result = await page.evaluate(async () => {
    sessionStorage.removeItem("perf-v5");
    const mod = await import('/assets/performance-data-v1.js?v=source-consistency');
    const data = await mod.loadLatestPerformance();
    return { dc3:data.ps[0].dc3, flag:data.meta.cd4OlCombinedIntoDc3, label:data.labels?.dc3 };
  });
  expect(result.flag).toBe(true);
  expect(result.dc3.target).toBe(120);
  expect(result.dc3.actual).toBe(80);
  expect(result.dc3.index).toBeCloseTo(66.666, 2);
  expect(result.label).toBe("CD3 + CD4 OL");
});

test("Profile uses the same root snapshot identity and CD separator rules", async ({ page }) => {
  const current = pack([person("AYAPS001", { dc3:metric(100,70) })]);
  delete current.meta.cd4OlCombinedIntoDc3;
  const full = separatorFull(current);

  await mockImages(page);
  await mockStorage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/active.json") return {
      reportDate:current.meta.reportDate,
      reportKey:current.meta.reportKey,
      updatedAt:"2026-08-08T12:01:00.000Z",
      dataPath:"performance/live/full.json",
    };
    if (path === "performance/live/full.json") return full;
    return null;
  });

  await page.goto("/performance-profile.html?type=ps&code=AYAPS001");
  await expect.poll(() => page.evaluate(() => ({
    target:window.__PERF_PROFILE_DATA?.ps?.[0]?.dc3?.target,
    actual:window.__PERF_PROFILE_DATA?.ps?.[0]?.dc3?.actual,
    flag:window.__PERF_PROFILE_DATA?.meta?.cd4OlCombinedIntoDc3,
  }))).toEqual({ target:120, actual:80, flag:true });
  const cd3 = page.locator(".metric-card").filter({ hasText:"CD3 + CD4 OL" });
  await expect(cd3).toContainText("66.7%");
});