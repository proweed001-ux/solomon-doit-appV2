import { expect, test } from "@playwright/test";

const STORAGE = "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/doit-files/";
const KEYS = ["sales", "giv", "moq", "dc1", "dc2", "dc3", "cd123", "bills", "gps", "dgp"];

function psRow(ps, overrides = {}) {
  const row = {
    ps,
    ads: "AYAADS01",
    name: `พนักงาน ${ps}`,
    sales: { target: 1000, actual: 800, index: 80 },
    giv: { target: 100, actual: 80, index: 80 },
    moq: { target: 100, actual: 80, index: 80 },
    dc1: { target: 100, actual: 80, index: 80 },
    dc2: { target: 100, actual: 75, index: 75 },
    dc3: { target: 100, actual: 70, index: 70 },
    cd123: { target: 300, actual: 225, index: 75 },
    bills: { target: 50, actual: 40, index: 80 },
    // Production shape: GPS has target 0 and stores the percentage in actual/index.
    gps: { target: 0, actual: 90, index: 90 },
    dgp: { target: 100, actual: 80, index: 80 },
  };
  for (const [key, value] of Object.entries(overrides)) row[key] = value;
  return row;
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
    const rowIndex = Number(value.index || 0);
    if (rowIndex > 0) {
      indexTotal += rowIndex;
      indexCount += 1;
    }
  }
  return {
    target,
    actual,
    index: target ? (actual / target) * 100 : (indexCount ? indexTotal / indexCount : 0),
  };
}

function pack({ day = 18, rows, cd4Flag = false, includePeriod = true } = {}) {
  const ps = rows || [psRow("AYAPS001"), psRow("AYAPS002")];
  const ads = [{ ads: "AYAADS01", name: "AYAADS01" }];
  const ds = { code: "DS", name: "DS" };
  for (const key of KEYS) {
    ads[0][key] = aggregate(ps, key);
    ds[key] = aggregate(ps, key);
  }
  return {
    meta: {
      reportDate: `2026-08-${String(day).padStart(2, "0")}`,
      reportKey: `202608-WD${String(day).padStart(2, "0")}`,
      ...(includePeriod ? { period: "202608" } : {}),
      workdayNo: day,
      totalWorkdays: 24,
      daysLeft: 24 - day,
      cd4OlCombinedIntoDc3: cd4Flag,
    },
    ps,
    ads,
    ds,
    ms: [],
  };
}

function fullSource(base, { cd4 = "none" } = {}) {
  return {
    reportDate: base.meta.reportDate,
    ps: base.ps.map((row) => {
      const sellerReport = {
        "เป้าหมาย CD1 RJ SH RH JJ 70ML": row.dc1.target,
        "การกระจาย CD1 RJ SH RH JJ 70ML": row.dc1.actual,
        "Index CD1 RJ SH RH JJ 70ML": row.dc1.index,
        "เป้าหมาย CD2 DN FE SF 450ML": row.dc2.target,
        "การกระจาย CD2 DN FE SF 450ML": row.dc2.actual,
        "Index CD2 DN FE SF 450ML": row.dc2.index,
        "เป้าหมาย CD3 GL Blue2 Flexi": row.dc3.target,
        "การกระจาย CD3 GL Blue2 Flexi": row.dc3.actual,
        "Index CD3 GL Blue2 Flexi": row.dc3.index,
        "Target CD1+2+3": row.cd123.target,
        "การกระจาย CD1+2+3": row.cd123.actual,
        "Index CD1+2+3": row.cd123.index,
      };
      if (cd4 === "both" || cd4 === "target-only") sellerReport["เป้าหมาย CD4 OL"] = 20;
      if (cd4 === "both") sellerReport["การกระจาย CD4 OL"] = 10;
      return { psCode: row.ps, adsCode: row.ads, psName: row.name, sellerReport };
    }),
  };
}

async function routeStorage(page, handler) {
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route(`${STORAGE}**`, async (route) => {
    const path = new URL(route.request().url()).pathname.split("/doit-files/")[1];
    const result = await handler(path);
    if (!result) {
      await route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
      return;
    }
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(result) });
  });
  return requests;
}

test("uses the full snapshot matching current.min instead of mixing an older active day", async ({ page }) => {
  const currentRows = [
    psRow("AYAPS001", { dc1: { target: 0, actual: 0, index: 0 } }),
    psRow("AYAPS002", { dc1: { target: 100, actual: 60, index: 60 } }),
  ];
  const current = pack({ rows: currentRows, cd4Flag: false });
  const matchingFullBase = pack({ rows: [
    psRow("AYAPS001", { dc1: { target: 100, actual: 80, index: 80 } }),
    psRow("AYAPS002", { dc1: { target: 100, actual: 60, index: 60 } }),
  ], cd4Flag: false });
  const olderFullBase = pack({ day: 17, rows: [
    psRow("AYAPS001", { dc1: { target: 100, actual: 10, index: 10 } }),
    psRow("AYAPS002", { dc1: { target: 100, actual: 60, index: 60 } }),
  ], cd4Flag: false });

  const requests = await routeStorage(page, async (path) => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/active.json") return {
      reportDate: "2026-08-17",
      reportKey: "202608-WD17",
      dataPath: "performance/live/wd17-full.json",
      history: [{ reportDate: "2026-08-18", reportKey: "202608-WD18", dataPath: "performance/live/wd18-full.json" }],
    };
    if (path === "performance/live/wd18-full.json") return fullSource(matchingFullBase);
    if (path === "performance/live/wd17-full.json") return fullSource(olderFullBase);
    return null;
  });

  await page.goto("/performance.html?mode=ds");
  await page.locator('[data-metric-key="dc1"]').click();
  await expect(page.locator(".metric-hero-values")).toContainText("140");
  expect(requests.some((url) => url.endsWith("/performance/live/wd18-full.json"))).toBe(true);
  expect(requests.some((url) => url.endsWith("/performance/live/wd17-full.json"))).toBe(false);
});

test("recovers a CD value missing for only one PS", async ({ page }) => {
  const current = pack({ rows: [
    psRow("AYAPS001", { dc3: { target: 0, actual: 0, index: 0 } }),
    psRow("AYAPS002", { dc3: { target: 100, actual: 70, index: 70 } }),
  ], cd4Flag: false });
  const fullBase = pack({ rows: [
    psRow("AYAPS001", { dc3: { target: 100, actual: 90, index: 90 } }),
    psRow("AYAPS002", { dc3: { target: 100, actual: 70, index: 70 } }),
  ], cd4Flag: false });

  await routeStorage(page, async (path) => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/active.json") return { reportDate: "2026-08-18", reportKey: "202608-WD18", dataPath: "performance/live/wd18-full.json" };
    if (path === "performance/live/wd18-full.json") return fullSource(fullBase);
    return null;
  });

  await page.goto("/performance.html?mode=ds");
  await page.locator('[data-metric-key="dc3"]').click();
  await expect(page.locator(".metric-hero-values")).toContainText("160");
  await expect(page.locator(".metric-hero-values")).toContainText("200");
  await expect(page.locator(".metric-hero-stats")).toContainText("80.0%");
});

test("keeps GPS percentage when PS summary has target zero like Production", async ({ page }) => {
  const current = pack({ rows: [
    psRow("AYAPS001", { gps: { target: 0, actual: 90, index: 90 } }),
    psRow("AYAPS002", { gps: { target: 0, actual: 95, index: 95 } }),
  ], cd4Flag: false });

  await routeStorage(page, async (path) => path === "performance/current.min.json" ? current : null);
  await page.goto("/performance.html?mode=ps&ads=AYAADS01");
  await page.locator('[data-metric-key="gps"]').click();
  await expect(page.locator(".metric-hero-stats")).toContainText("92.5%");
  await expect(page.locator(".metric-hero-stats")).not.toContainText("0.0%");
});

test("blocks CD3 compare when current and history use different CD4 OL rules", async ({ page }) => {
  const current = pack({ cd4Flag: true });
  const old = pack({ day: 17, cd4Flag: false });
  delete old.meta.cd4OlCombinedIntoDc3;

  await routeStorage(page, async (path) => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/history-index.json") return [{ reportDate: "2026-08-17", reportKey: "202608-WD17", workdayNo: 17, path: "performance/compare/202608-WD17.json" }];
    if (path === "performance/compare/202608-WD17.json") return old;
    return null;
  });

  await page.goto("/performance.html?mode=compare&cat=dc3");
  await expect(page.locator("#app")).toContainText("CD3 ของสองช่วงใช้สูตรไม่เหมือนกัน");
  await expect(page.locator(".delta-hero")).toHaveCount(0);
});

test("Top Movers ranks by Index change rather than raw actual increase", async ({ page }) => {
  const current = pack({ rows: [
    psRow("AYAPS-A", { sales: { target: 1000, actual: 900, index: 90 } }),
    psRow("AYAPS-B", { sales: { target: 100, actual: 90, index: 90 } }),
  ], cd4Flag: false });
  const old = pack({ day: 17, rows: [
    psRow("AYAPS-A", { sales: { target: 1000, actual: 800, index: 80 } }),
    psRow("AYAPS-B", { sales: { target: 100, actual: 60, index: 60 } }),
  ], cd4Flag: false });

  await routeStorage(page, async (path) => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/history-index.json") return [{ reportDate: "2026-08-17", reportKey: "202608-WD17", workdayNo: 17, path: "performance/compare/202608-WD17.json" }];
    if (path === "performance/compare/202608-WD17.json") return old;
    return null;
  });

  await page.goto("/performance.html?mode=compare&cat=sales");
  const firstImproved = page.locator(".good-group .mover-row").first();
  await expect(firstImproved).toContainText("AYAPS-B");
  await expect(firstImproved).toContainText("+30.0 pt");
});

test("warns and does not merge CD4 OL when only one monthly column exists", async ({ page }) => {
  const current = pack({ cd4Flag: false });
  delete current.meta.cd4OlCombinedIntoDc3;
  const full = fullSource(current, { cd4: "target-only" });

  await routeStorage(page, async (path) => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/active.json") return { reportDate: "2026-08-18", reportKey: "202608-WD18", dataPath: "performance/live/wd18-full.json" };
    if (path === "performance/live/wd18-full.json") return full;
    return null;
  });

  await page.goto("/performance.html?mode=ds");
  await expect(page.locator("#app")).toContainText("พบหัวข้อ CD4 OL ไม่ครบทั้งเป้าหมายและการกระจาย");
  await page.locator('[data-metric-key="dc3"]').click();
  await expect(page.locator('.metric-chip[data-metric-key="dc3"]')).not.toContainText("CD4 OL");
});
