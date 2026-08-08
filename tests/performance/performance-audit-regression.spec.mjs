import { expect, test } from "@playwright/test";

const STORAGE = "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/doit-files/";
const PIXEL = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
const KEYS = ["sales","giv","moq","dc1","dc2","dc3","cd123","bills","gps","dgp"];

function metric(target, actual, index = null) {
  return { target, actual, index: index ?? (target ? actual / target * 100 : actual) };
}

function row(ps, overrides = {}) {
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
  let target = 0, actual = 0, indexTotal = 0, indexCount = 0;
  for (const item of rows) {
    const value = item[key] || {};
    const t = Number(value.target || 0);
    if (key === "cd123" && t <= 0) continue;
    target += t;
    actual += Number(value.actual || 0);
    if (value && typeof value === "object" && ("target" in value || "actual" in value || "index" in value)) {
      indexTotal += Number(value.index || 0);
      indexCount += 1;
    }
  }
  return { target, actual, index: target ? actual / target * 100 : (indexCount ? indexTotal / indexCount : 0) };
}

function pack(rows = [row("AYAPS001"), row("AYAPS002")], { day = 18, cd4Flag = false, updatedAt = "2026-08-08T12:00:00.000Z" } = {}) {
  const ads = [{ ads: "AYAADS01", adsName: "หัวหน้าทีม 01", name: "หัวหน้าทีม 01" }];
  const ds = { code: "DS", name: "DS" };
  for (const key of KEYS) {
    ads[0][key] = aggregate(rows, key);
    ds[key] = aggregate(rows, key);
  }
  return {
    meta: {
      reportDate: `2026-08-${String(day).padStart(2,"0")}`,
      reportKey: `202608-WD${String(day).padStart(2,"0")}`,
      period: "202608",
      workdayNo: day,
      totalWorkdays: 24,
      daysLeft: 24 - day,
      updatedAt,
      cd4OlCombinedIntoDc3: cd4Flag,
    },
    labels: {}, ps: rows, ads, ds, ms: [],
  };
}

function fullFrom(base, { reportKey = null, cd4 = false, adsName = "หัวหน้าทีม 01" } = {}) {
  const full = {
    reportDate: base.meta.reportDate,
    ads: [{ adsCode: "AYAADS01", adsName }],
    ps: base.ps.map((item) => {
      const sellerReport = {
        "เป้าหมาย CD1 RJ SH RH JJ 70ML": Number(item.dc1?.target || 0),
        "การกระจาย CD1 RJ SH RH JJ 70ML": Number(item.dc1?.actual || 0),
        "Index CD1 RJ SH RH JJ 70ML": Number(item.dc1?.index || 0),
        "เป้าหมาย CD2 DN FE SF 450ML": Number(item.dc2?.target || 0),
        "การกระจาย CD2 DN FE SF 450ML": Number(item.dc2?.actual || 0),
        "Index CD2 DN FE SF 450ML": Number(item.dc2?.index || 0),
        "เป้าหมาย CD3 GL Blue2 Flexi": Number(item.dc3?.target || 0),
        "การกระจาย CD3 GL Blue2 Flexi": Number(item.dc3?.actual || 0),
        "Index CD3 GL Blue2 Flexi": Number(item.dc3?.index || 0),
        "Target CD1+2+3": Number(item.cd123?.target || 0),
        "การกระจาย CD1+2+3": Number(item.cd123?.actual || 0),
        "Index CD1+2+3": Number(item.cd123?.index || 0),
      };
      if (cd4) {
        sellerReport["เป้าหมาย CD4 OL"] = 20;
        sellerReport["การกระจาย CD4 OL"] = 10;
      }
      return { psCode: item.ps, adsCode: item.ads, psName: item.name, sellerReport };
    }),
  };
  if (reportKey) full.meta = { reportDate: base.meta.reportDate, reportKey };
  return full;
}

async function images(page) {
  await page.route("https://ik.imagekit.io/AYAPS/**", (route) => route.fulfill({ status: 200, contentType: "image/png", body: PIXEL }));
}

async function storage(page, handler) {
  const requests = [];
  page.on("request", request => { if (request.url().startsWith(STORAGE)) requests.push(request.url()); });
  await page.route(`${STORAGE}**`, async route => {
    const path = new URL(route.request().url()).pathname.split("/doit-files/")[1];
    const result = await handler(path);
    if (result?.status) return route.fulfill(result);
    if (result !== undefined && result !== null) return route.fulfill({ contentType: "application/json", body: JSON.stringify(result) });
    return route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
  });
  return requests;
}

test("Board averages target-zero GPS including a real 0 percent PS", async ({ page }) => {
  const current = pack([
    row("AYAPS001", { gps: metric(0,0,0) }),
    row("AYAPS002", { gps: metric(0,90,90) }),
  ]);
  current.ds.gps = metric(0,90,90);
  current.ads[0].gps = metric(0,90,90);
  await storage(page, path => path === "performance/current.min.json" ? current : null);
  await page.goto("/performance.html?mode=ds");
  await page.locator('[data-metric-key="gps"]').click();
  await expect(page.locator(".metric-hero-stats")).toContainText("45.0%");
});

test("Compare excludes a PS that has no matching historical row", async ({ page }) => {
  const current = pack([
    row("AYAPS001", { sales: metric(1000,900) }),
    row("AYAPS-NEW", { sales: metric(1000,1000) }),
  ]);
  const old = pack([row("AYAPS001", { sales: metric(1000,700) })], { day:17 });
  await storage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/history-index.json") return [{ reportDate:old.meta.reportDate, reportKey:old.meta.reportKey, workdayNo:17, path:"performance/compare/old.json" }];
    if (path === "performance/compare/old.json") return old;
    return null;
  });
  await page.goto("/performance.html?mode=compare&cat=sales");
  await expect(page.locator(".top-movers")).not.toContainText("AYAPS-NEW");
  await expect(page.locator(".top-movers")).toContainText("AYAPS001");
});

test("CD3 compare blocks a same-period legacy history snapshot with unknown formula", async ({ page }) => {
  const current = pack(undefined, { cd4Flag:false });
  const old = pack(undefined, { day:17, cd4Flag:false });
  delete old.meta.cd4OlCombinedIntoDc3;
  await storage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/history-index.json") return [{ reportDate:old.meta.reportDate, reportKey:old.meta.reportKey, workdayNo:17, path:"performance/compare/old.json" }];
    if (path === "performance/compare/old.json") return old;
    return null;
  });
  await page.goto("/performance.html?mode=compare&cat=dc3");
  await expect(page.locator("#app")).toContainText("ไม่มีข้อมูลยืนยันสูตร");
  await expect(page.locator(".delta-hero")).toHaveCount(0);
});

test("Compare sorts history and chooses the nearest previous report instead of array order", async ({ page }) => {
  const current = pack(undefined, { day:18 });
  const old15 = pack(undefined, { day:15 });
  const old16 = pack(undefined, { day:16 });
  const old17 = pack(undefined, { day:17 });
  const map = new Map([[15,old15],[16,old16],[17,old17]]);
  await storage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/history-index.json") return [15,17,16].map(day => ({ reportDate:map.get(day).meta.reportDate, reportKey:map.get(day).meta.reportKey, workdayNo:day, path:`performance/compare/${day}.json` }));
    const match = path.match(/performance\/compare\/(\d+)\.json/);
    if (match) return map.get(Number(match[1]));
    return null;
  });
  await page.goto("/performance.html?mode=compare&cat=sales");
  await expect(page.locator(".board-head")).toContainText("202608-WD17");
});

test("Board refuses an unidentified active manifest instead of mixing a full snapshot", async ({ page }) => {
  const current = pack([row("AYAPS001", { dc1:metric(0,0,0) })]);
  delete current.meta.cd4OlCombinedIntoDc3;
  const fullBase = pack([row("AYAPS001", { dc1:metric(100,90) })]);
  const requests = await storage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/active.json") return { dataPath:"performance/live/unidentified.json" };
    if (path === "performance/live/unidentified.json") return fullFrom(fullBase);
    return null;
  });
  await page.goto("/performance.html?mode=ds");
  await expect(page.locator("#app")).toContainText("ไม่พบ full snapshot ที่ยืนยัน");
  expect(requests.some(url => url.endsWith("/performance/live/unidentified.json"))).toBe(false);
});

test("Board still renders when sessionStorage quota write fails", async ({ page }) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === "perf-v5") throw new DOMException("quota", "QuotaExceededError");
      return original.call(this, key, value);
    };
  });
  await storage(page, path => path === "performance/current.min.json" ? pack() : null);
  await page.goto("/performance.html?mode=ds");
  await expect(page.locator("#app")).toContainText("DS ภาพรวม");
});

test("Profile ignores a stale same-WD Board session revision", async ({ page }) => {
  const current = pack([row("AYAPS001", { sales:metric(1000,900) })], { updatedAt:"2026-08-08T12:00:00.000Z" });
  const cached = pack([row("AYAPS001", { sales:metric(1000,100) })], { updatedAt:"2026-08-08T11:00:00.000Z" });
  await page.addInitScript(value => sessionStorage.setItem("perf-v5", JSON.stringify(value)), cached);
  await images(page);
  await storage(page, path => path === "performance/current.min.json" ? current : null);
  await page.goto("/performance-profile.html?type=ps&code=AYAPS001");
  await expect(page.locator(".primary-values")).toContainText("900");
  await expect(page.locator(".primary-values")).not.toContainText("100\n");
});

test("Profile rejects a full snapshot with a different reportKey even on the same date", async ({ page }) => {
  const current = pack([row("AYAPS001", { dc1:metric(0,0,0) })]);
  const wrong = pack([row("AYAPS001", { dc1:metric(100,99) })], { day:18 });
  const full = fullFrom(wrong, { reportKey:"202608-WD17", adsName:"ชื่อจากไฟล์ผิด revision" });
  await images(page);
  await storage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/active.json") return { reportDate:current.meta.reportDate, reportKey:current.meta.reportKey, dataPath:"performance/live/full.json" };
    if (path === "performance/live/full.json") return full;
    return null;
  });
  await page.goto("/performance-profile.html?type=ps&code=AYAPS001");
  await expect.poll(() => page.evaluate(() => window.__PERF_PROFILE_DATA?.ps?.[0]?.dc1?.actual)).toBe(0);
  await expect(page.locator(".team-block")).not.toContainText("ชื่อจากไฟล์ผิด revision");
});

test("Profile validates CD4 OL even when compact CD values are already present", async ({ page }) => {
  const current = pack([row("AYAPS001", { dc3:metric(100,70) })]);
  delete current.meta.cd4OlCombinedIntoDc3;
  const full = fullFrom(current, { cd4:true });
  await images(page);
  await storage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/active.json") return { reportDate:current.meta.reportDate, reportKey:current.meta.reportKey, dataPath:"performance/live/full.json" };
    if (path === "performance/live/full.json") return full;
    return null;
  });
  await page.goto("/performance-profile.html?type=ps&code=AYAPS001");
  const cd3 = page.locator(".metric-card").filter({ hasText:"CD3 + CD4 OL" });
  await expect(cd3).toContainText("66.7%");
  await expect(cd3).toContainText("Actual 80");
  await expect(cd3).toContainText("Target 120");
});

test("Profile uses adsName when compact ADS name is only the code", async ({ page }) => {
  const current = pack();
  current.ads[0].name = "AYAADS01";
  current.ads[0].adsName = "หัวหน้าทีมชื่อจริง";
  await images(page);
  await storage(page, path => path === "performance/current.min.json" ? current : null);
  await page.goto("/performance-profile.html?type=ads&code=AYAADS01");
  await expect(page.locator(".identity-main h1")).toHaveText("หัวหน้าทีมชื่อจริง");
});

test("Reveal does not create a winner when an award metric is zero for everyone", async ({ page }) => {
  const current = pack([
    row("AYAPS001", { dc1:metric(0,0,0) }),
    row("AYAPS002", { dc1:metric(0,0,0) }),
  ]);
  await images(page);
  await storage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/history-index.json") return [];
    return null;
  });
  await page.goto("/performance-reveal-v2.html?test=1");
  await expect(page.locator("#slides-ps .race-card.active [data-start-race]")).toBeVisible();
  await page.locator("#next-ps").click();
  await page.locator("#next-ps").click();
  const card = page.locator('#slides-ps [data-category="dc1"]');
  await expect(card).toHaveClass(/active/);
  await card.locator("[data-start-race]").click();
  await expect(card.locator(".race-cover")).toContainText("ไม่มีข้อมูล");
  await expect(card).not.toHaveClass(/winner-ready/);
  await expect(card.locator(".winner-reveal")).toHaveCount(0);
});

test("Reveal cancels a countdown when the user changes award", async ({ page }) => {
  const current = pack();
  await images(page);
  await storage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/history-index.json") return [];
    return null;
  });
  await page.goto("/performance-reveal-v2.html?test=1");
  const first = page.locator('#slides-ps [data-category="sales"]');
  await first.locator("[data-start-race]").click();
  await page.locator("#next-ps").click();
  await page.waitForTimeout(400);
  await expect(first).not.toHaveClass(/winner-ready/);
  await expect(first.locator(".race-row")).toHaveCount(0);
});

test("Escape exits Reveal pseudo fullscreen when no winner overlay is open", async ({ page }) => {
  await page.addInitScript(() => {
    for (const key of ["requestFullscreen","webkitRequestFullscreen"]) {
      try { Object.defineProperty(Element.prototype, key, { value:undefined, configurable:true }); } catch {}
    }
  });
  await images(page);
  await storage(page, path => {
    if (path === "performance/current.min.json") return pack();
    if (path === "performance/history-index.json") return [];
    return null;
  });
  await page.goto("/performance-reveal-v2.html?test=1");
  await page.locator("#fullscreen-toggle").click();
  await expect(page.locator("body")).toHaveClass(/pseudo-fullscreen/);
  await page.keyboard.press("Escape");
  await expect(page.locator("body")).not.toHaveClass(/pseudo-fullscreen/);
  await expect(page.locator("body")).not.toHaveClass(/presentation-mode/);
});

test("Reveal recovers current CD from the verified full snapshot before racing", async ({ page }) => {
  const source = pack([row("AYAPS001", { dc1:metric(100,85) })]);
  const current = structuredClone(source);
  current.ps[0].dc1 = metric(0,0,0);
  current.ads[0].dc1 = metric(0,0,0);
  current.ds.dc1 = metric(0,0,0);
  const full = fullFrom(source);
  await images(page);
  await storage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/active.json") return { reportDate:current.meta.reportDate, reportKey:current.meta.reportKey, dataPath:"performance/live/full.json" };
    if (path === "performance/live/full.json") return full;
    if (path === "performance/history-index.json") return [];
    return null;
  });
  await page.goto("/performance-reveal-v2.html?test=1");
  await page.locator("#next-ps").click();
  await page.locator("#next-ps").click();
  const card = page.locator('#slides-ps [data-category="dc1"]');
  await card.locator("[data-start-race]").click();
  await expect(card).toHaveClass(/winner-ready/);
  await expect(card.locator(".race-percent")).toContainText("85.00%");
});

test("Performance history cache is network-first and does not override a fresh revision", async ({ page }) => {
  const current = pack();
  await storage(page, path => {
    if (path === "performance/current.min.json") return current;
    if (path === "performance/compare/audit-cache.json") return { source:"network", value:2 };
    return null;
  });
  await page.goto("/performance.html?mode=ds");
  const result = await page.evaluate(async () => {
    const mod = await import('/assets/performance-data-v1.js?v=audit-cache');
    const path = 'performance/compare/audit-cache.json';
    const url = mod.performanceObjectUrl(path);
    const cache = await caches.open(mod.PERFORMANCE_HISTORY_CACHE);
    await cache.put(url, new Response(JSON.stringify({ source:'stale-cache', value:1 }), { headers:{ 'content-type':'application/json' } }));
    const stats = { remembered:0, downloaded:0 };
    const data = await mod.fetchPerformanceJson(path, { remember:true, stats });
    return { data, stats };
  });
  expect(result.data.source).toBe("network");
  expect(result.data.value).toBe(2);
  expect(result.stats.downloaded).toBe(1);
  expect(result.stats.remembered).toBe(0);
});
