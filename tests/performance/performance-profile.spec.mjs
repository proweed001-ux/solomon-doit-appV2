import { expect, test } from "@playwright/test";

const STORAGE = "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/doit-files/";

function metric(target, actual, index = null) {
  return { target, actual, index: index ?? (target ? (actual / target) * 100 : actual) };
}
function ps(ps, ads, name, salesActual) {
  return {
    ps, ads, name,
    sales: metric(1000, salesActual),
    giv: metric(100, 80),
    moq: metric(100, 75),
    dc1: metric(100, 85),
    dc2: metric(100, 70),
    dc3: metric(100, 65),
    cd123: metric(300, 220),
    bills: metric(50, 40),
    gps: metric(0, 92, 92),
    dgp: metric(100, 88),
  };
}
function ads(adsCode, name, rows) {
  const out = { ads: adsCode, name };
  for (const key of ["sales","giv","moq","dc1","dc2","dc3","cd123","bills","gps","dgp"]) {
    const values = rows.map(r => r[key]);
    const target = values.reduce((s,v)=>s+Number(v.target||0),0);
    const actual = values.reduce((s,v)=>s+Number(v.actual||0),0);
    const idx = target ? actual/target*100 : values.reduce((s,v)=>s+Number(v.index||0),0)/values.length;
    out[key] = { target, actual, index: idx };
  }
  return out;
}
function pack() {
  const rows = [
    ps("AYAPS021","AYAADS01","สมชาย 21",900),
    ps("AYAPS003","AYAADS01","สมชาย 03",700),
    ps("AYAPS011","AYAADS02","สมชาย 11",800),
  ];
  return {
    meta:{reportDate:"2026-08-08",reportKey:"202608-WD08",workdayNo:8,totalWorkdays:24},
    labels:{dc3:"CD3 + CD4 OL"},
    ps: rows,
    ads:[
      ads("AYAADS02","หัวหน้าทีม 02",rows.filter(r=>r.ads==="AYAADS02")),
      ads("AYAADS01","หัวหน้าทีม 01",rows.filter(r=>r.ads==="AYAADS01")),
    ]
  };
}
async function mock(page) {
  const data = pack();
  await page.route(`${STORAGE}**`, async route => {
    const path = new URL(route.request().url()).pathname.split("/doit-files/")[1];
    if (path === "performance/current.min.json") {
      await route.fulfill({contentType:"application/json",body:JSON.stringify(data)});
      return;
    }
    await route.fulfill({status:404,contentType:"application/json",body:"{}"});
  });
  await page.route("https://ik.imagekit.io/AYAPS/**", route => route.fulfill({status:404,body:""}));
}

test("PS profile sorts codes naturally and uses the code-based ImageKit photo path", async ({ page }) => {
  await mock(page);
  await page.goto("/performance-profile.html?type=ps");
  await expect(page.locator(".code")).toHaveText("AYAPS003");
  const options = await page.locator("[data-profile-select] option").allTextContents();
  expect(options.map(x=>x.split(" · ")[0])).toEqual(["AYAPS003","AYAPS011","AYAPS021"]);

  await page.locator("[data-profile-select]").selectOption("AYAPS021");
  await expect(page).toHaveURL(/type=ps&code=AYAPS021/);
  await expect(page.locator(".code")).toHaveText("AYAPS021");
  await expect(page.locator("[data-profile-photo]")).toHaveAttribute(
    "src",
    "https://ik.imagekit.io/AYAPS/AYAPS021.webp?updatedAt=1785290365097"
  );
  await expect(page.locator(".photo-fallback")).toBeVisible();
  await expect(page.locator(".metrics-grid")).toContainText("CD3 + CD4 OL");
  await expect(page.locator(".metrics-grid")).toContainText("GPS");
});

test("ADS profiles sort by code and use AYAADS code photos", async ({ page }) => {
  await mock(page);
  await page.goto("/performance-profile.html?type=ads&code=AYAADS01");
  await expect(page.locator(".code")).toHaveText("AYAADS01");
  const options = await page.locator("[data-profile-select] option").allTextContents();
  expect(options.map(x=>x.split(" · ")[0])).toEqual(["AYAADS01","AYAADS02"]);
  await expect(page.locator("[data-profile-photo]")).toHaveAttribute(
    "src",
    "https://ik.imagekit.io/AYAPS/AYAADS01.webp?updatedAt=1785207752600"
  );
  await expect(page.locator(".role-badge")).toHaveText("ADS");
  await expect(page.locator(".rank-line")).toContainText("อันดับ ADS");
});

test("previous and next navigation follows the sorted PS code order", async ({ page }) => {
  await mock(page);
  await page.goto("/performance-profile.html?type=ps&code=AYAPS011");
  await expect(page.locator(".code")).toHaveText("AYAPS011");
  await page.getByRole("button",{name:"โปรไฟล์ถัดไป"}).click();
  await expect(page).toHaveURL(/code=AYAPS021/);
  await expect(page.locator(".code")).toHaveText("AYAPS021");
});
