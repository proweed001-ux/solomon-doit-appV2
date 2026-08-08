import { expect, test } from "@playwright/test";

const STORAGE = "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/doit-files/";
const PIXEL = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");

function metric(target, actual) {
  return { target, actual, index: target ? actual / target * 100 : 0 };
}

function psRow(index, actual = 700 + index * 40) {
  return {
    ps: `AYAPS00${index}`,
    ads: "AYAADS01",
    name: `PS ${index}`,
    sales: metric(1000, actual),
    giv: metric(100, 70 + index),
    moq: metric(100, 65 + index),
    dc1: metric(100, 60 + index),
    dc2: metric(100, 58 + index),
    dc3: metric(100, 55 + index),
    cd123: metric(300, 173 + index * 3),
    bills: metric(50, 35 + index),
    gps: { target: 0, actual: 90, index: 90 },
    dgp: metric(100, 75 + index),
  };
}

function snapshot({ period, workdayNo, reportDate, salesOffset = 0 }) {
  const ps = [1, 2, 3, 4, 5].map((index) => psRow(index, 680 + index * 45 + salesOffset));
  const keys = ["sales", "giv", "moq", "dc1", "dc2", "dc3", "cd123", "bills", "gps", "dgp"];
  const aggregate = (key) => {
    const rows = ps.map((row) => row[key]);
    const target = rows.reduce((sum, value) => sum + Number(value.target || 0), 0);
    if (target > 0) {
      const actual = rows.reduce((sum, value) => sum + Number(value.actual || 0), 0);
      return { target, actual, index: actual / target * 100 };
    }
    const index = rows.reduce((sum, value) => sum + Number(value.index || 0), 0) / rows.length;
    return { target: 0, actual: index, index };
  };
  const ads = { ads: "AYAADS01", name: "ADS 01", adsName: "ADS 01" };
  const ds = { code: "DS", name: "DS" };
  keys.forEach((key) => {
    ads[key] = aggregate(key);
    ds[key] = aggregate(key);
  });
  return {
    meta: {
      reportDate,
      reportKey: `${period}-WD${String(workdayNo).padStart(2, "0")}`,
      period,
      workdayNo,
      totalWorkdays: 24,
      daysLeft: Math.max(24 - workdayNo, 0),
      updatedAt: `${reportDate}T12:00:00.000Z`,
      cd4OlCombinedIntoDc3: false,
    },
    ps,
    ads: [ads],
    ds,
    ms: [],
  };
}

async function mockImages(page) {
  await page.route("https://ik.imagekit.io/AYAPS/**", (route) => route.fulfill({ status: 200, contentType: "image/png", body: PIXEL }));
}

async function mockStorage(page, { current, index, snapshots, slowPath = "" }) {
  const requests = [];
  page.on("request", (request) => {
    if (request.url().startsWith(STORAGE)) requests.push(new URL(request.url()).pathname.split("/doit-files/")[1]);
  });
  await page.route(`${STORAGE}**`, async (route) => {
    const path = new URL(route.request().url()).pathname.split("/doit-files/")[1];
    if (path === "performance/current.min.json") return route.fulfill({ contentType: "application/json", body: JSON.stringify(current) });
    if (path === "performance/history-index.json") return route.fulfill({ contentType: "application/json", body: JSON.stringify(index) });
    if (path === slowPath) await new Promise((resolve) => setTimeout(resolve, 500));
    if (snapshots.has(path)) return route.fulfill({ contentType: "application/json", body: JSON.stringify(snapshots.get(path)) });
    return route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
  });
  return requests;
}

test("Reveal uses WD04 WD06 WD07 from the real current month, waits for history, and gives five unique random colors", async ({ page }) => {
  const current = snapshot({ period: "202608", workdayNo: 7, reportDate: "2026-08-08", salesOffset: 80 });
  const wd04 = snapshot({ period: "202608", workdayNo: 4, reportDate: "2026-08-06", salesOffset: -80 });
  const wd06 = snapshot({ period: "202608", workdayNo: 6, reportDate: "2026-08-07", salesOffset: 0 });
  const paths = {
    wd04: "performance/compare/202608-WD04.json",
    wd06: "performance/compare/202608-WD06.json",
    wd07: "performance/compare/202608-WD07.json",
  };
  const index = [
    { reportKey: "202608-WD07", workdayNo: 7, path: paths.wd07 },
    { reportKey: "202608-WD06", workdayNo: 6, path: paths.wd06 },
    { reportKey: "202608-WD04", workdayNo: 4, path: paths.wd04 },
    { reportKey: "202607-WD24", workdayNo: 24, path: "performance/compare/202607-WD24.json" },
  ];
  await mockImages(page);
  const requests = await mockStorage(page, {
    current,
    index,
    snapshots: new Map([[paths.wd04, wd04], [paths.wd06, wd06]]),
    slowPath: paths.wd06,
  });

  await page.goto("/performance-reveal-v2.html?test=1");
  const start = page.locator('#slides-ps .race-card.active [data-start-race]');
  await expect(start).toBeDisabled();
  await expect(start).toContainText("กำลังเตรียมช่วงการแข่งขัน");
  await expect(page.locator("#status")).toContainText("ใช้การแข่งขัน 3 ช่วง");
  await expect(start).toBeEnabled();
  await expect(page.locator("#status")).not.toContainText("cache");
  await expect(page.locator("#status")).not.toContainText("โหลดใหม่");
  expect(requests).toContain(paths.wd04);
  expect(requests).toContain(paths.wd06);
  expect(requests).not.toContain(paths.wd07);
  expect(requests).not.toContain("performance/compare/202607-WD24.json");

  await start.click();
  const card = page.locator("#slides-ps .race-card.active");
  await expect(card).toHaveClass(/winner-ready/);
  await expect(card.locator(".race-row")).toHaveCount(5);
  const colors = await card.locator(".race-row").evaluateAll((rows) => rows.map((row) => row.dataset.raceColor));
  expect(colors.every(Boolean)).toBe(true);
  expect(new Set(colors).size).toBe(5);
});

test("Reveal automatically rolls to the next month and includes later workdays without mixing the previous month", async ({ page }) => {
  const current = snapshot({ period: "202609", workdayNo: 3, reportDate: "2026-09-03", salesOffset: 90 });
  const wd01 = snapshot({ period: "202609", workdayNo: 1, reportDate: "2026-09-01", salesOffset: -60 });
  const wd02 = snapshot({ period: "202609", workdayNo: 2, reportDate: "2026-09-02", salesOffset: 0 });
  const p1 = "performance/compare/202609-WD01.json";
  const p2 = "performance/compare/202609-WD02.json";
  const p3 = "performance/compare/202609-WD03.json";
  const august = "performance/compare/202608-WD07.json";
  const index = [
    { period: "202609", reportKey: "202609-WD03", workdayNo: 3, path: p3 },
    { period: "202609", reportKey: "202609-WD02", workdayNo: 2, path: p2 },
    { period: "202609", reportKey: "202609-WD01", workdayNo: 1, path: p1 },
    { period: "202608", reportKey: "202608-WD07", workdayNo: 7, path: august },
  ];
  await mockImages(page);
  const requests = await mockStorage(page, {
    current,
    index,
    snapshots: new Map([[p1, wd01], [p2, wd02]]),
  });

  await page.goto("/performance-reveal-v2.html?test=1");
  await expect(page.locator("#period")).toHaveText("CHAMPIONS OF SEPTEMBER 2026");
  await expect(page.locator("#status")).toContainText("ใช้การแข่งขัน 3 ช่วง");
  expect(requests).toContain(p1);
  expect(requests).toContain(p2);
  expect(requests).not.toContain(p3);
  expect(requests).not.toContain(august);
});
