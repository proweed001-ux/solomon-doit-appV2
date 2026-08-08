import { expect, test } from "@playwright/test";

const STORAGE = "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/doit-files/";
const PIXEL = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");

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
    meta:{reportDate:"2026-08-08",reportKey:"202608-WD06",workdayNo:6,totalWorkdays:24,daysLeft:18,cd4OlCombinedIntoDc3:false},
    labels:{},
    ps: rows,
    ads:[
      ads("AYAADS02","หัวหน้าทีม 02",rows.filter(r=>r.ads==="AYAADS02")),
      ads("AYAADS01","หัวหน้าทีม 01",rows.filter(r=>r.ads==="AYAADS01")),
    ]
  };
}
function fullSnapshot(data) {
  return {
    reportDate:data.meta.reportDate,
    ads:[
      {adsCode:"AYAADS01",adsName:"หัวหน้าทีม อยุธยา 01"},
      {adsCode:"AYAADS02",adsName:"หัวหน้าทีม อยุธยา 02"},
    ],
    ps:data.ps.map(row=>({
      psCode:row.ps,
      adsCode:row.ads,
      psName:row.name,
      sellerReport:{
        "เป้าหมาย CD1 RJ SH RH JJ 70ML":100,
        "การกระจาย CD1 RJ SH RH JJ 70ML":85,
        "Index CD1 RJ SH RH JJ 70ML":85,
        "เป้าหมาย CD2 DN FE SF 450ML":100,
        "การกระจาย CD2 DN FE SF 450ML":70,
        "Index CD2 DN FE SF 450ML":70,
        "เป้าหมาย CD3 GL Blue2 Flexi":100,
        "การกระจาย CD3 GL Blue2 Flexi":65,
        "Index CD3 GL Blue2 Flexi":65,
        "Target CD1+2+3":300,
        "การกระจาย CD1+2+3":220,
        "Index CD1+2+3":73.333,
      }
    }))
  };
}
async function mock(page,{compact=pack(),full=null,imageOk=false,currentDelay=0}={}) {
  await page.route(`${STORAGE}**`, async route => {
    const path = new URL(route.request().url()).pathname.split("/doit-files/")[1];
    if (path === "performance/current.min.json") {
      if (currentDelay) await new Promise(resolve=>setTimeout(resolve,currentDelay));
      await route.fulfill({contentType:"application/json",body:JSON.stringify(compact)});
      return;
    }
    if (full && path === "performance/active.json") {
      await route.fulfill({contentType:"application/json",body:JSON.stringify({
        reportDate:compact.meta.reportDate,
        reportKey:compact.meta.reportKey,
        dataPath:"performance/live/current-full.json"
      })});
      return;
    }
    if (full && path === "performance/live/current-full.json") {
      await route.fulfill({contentType:"application/json",body:JSON.stringify(full)});
      return;
    }
    await route.fulfill({status:404,contentType:"application/json",body:"{}"});
  });
  await page.route("https://ik.imagekit.io/AYAPS/**", route => imageOk
    ? route.fulfill({status:200,contentType:"image/png",body:PIXEL})
    : route.fulfill({status:404,body:""}));
}

test("profile shell and requested photo path render before metric data returns", async ({ page }) => {
  await mock(page,{currentDelay:900,imageOk:true});
  await page.goto("/performance-profile.html?type=ps&code=AYAPS021");
  await expect(page.locator(".profile-layout")).toBeVisible();
  await expect(page.locator(".code")).toHaveText("AYAPS021");
  await expect(page.locator(".sync-label")).toContainText("กำลังอัปเดตตัวเลข");
  await expect(page.locator("[data-profile-photo]")).toHaveAttribute("src","https://ik.imagekit.io/AYAPS/AYAPS021.webp?updatedAt=1785290365097");
  await expect(page.locator(".primary-card")).toContainText("Volume NIP");
  await expect(page.locator(".identity-main h1")).toHaveText("สมชาย 21");
});

test("successful ImageKit photo is visible even when it loads immediately", async ({ page }) => {
  await mock(page,{imageOk:true});
  await page.goto("/performance-profile.html?type=ps&code=AYAPS021");
  const photo = page.locator("[data-profile-photo]");
  await expect(photo).toBeVisible();
  await expect(photo).toHaveCSS("opacity","1");
  await expect(page.locator(".photo-fallback")).toBeHidden();
});

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
  await expect(page.locator(".photo-fallback")).toContainText("ไม่มีรูป");
  await expect(page.locator(".photo-fallback")).not.toContainText("21");
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

test("previous and next profile navigation does not reload the document", async ({ page }) => {
  await mock(page);
  let documents = 0;
  page.on("request",request=>{if(request.resourceType()==="document"&&request.url().includes("performance-profile.html"))documents+=1});
  await page.goto("/performance-profile.html?type=ps&code=AYAPS011");
  await expect(page.locator(".code")).toHaveText("AYAPS011");
  await page.getByRole("button",{name:"โปรไฟล์ถัดไป"}).click();
  await expect(page).toHaveURL(/code=AYAPS021/);
  await expect(page.locator(".code")).toHaveText("AYAPS021");
  expect(documents).toBe(1);
});

test("profile target planner keeps the Production workday formula", async ({ page }) => {
  await mock(page);
  await page.goto("/performance-profile.html?type=ps&code=AYAPS021");
  await expect(page.locator(".workday-card")).toContainText("18 วัน");
  const primary = page.locator(".primary-card");
  await primary.locator("summary").click();
  const input = primary.locator('[data-pct-key="sales"]');
  await input.fill("95");
  await expect(primary.locator('[data-plan-result="sales"]')).toContainText("950");
  await expect(primary.locator('[data-plan-result="sales"]')).toContainText("50");
  await expect(primary.locator('[data-plan-result="sales"]')).toContainText("3 / วัน");
  await input.blur();
  await expect.poll(async()=>page.evaluate(()=>localStorage.getItem("perf-kpi-pct-v1:AYAPS021:sales"))).toBe("95");
});

test("profile recovers CD and ADS name from the matching full snapshot", async ({ page }) => {
  const compact = pack();
  compact.ads.forEach(a=>{a.name=a.ads; delete a.adsName});
  compact.ps.forEach(row=>{
    row.adsName="";
    row.dc1=metric(0,0,0);
    row.dc2=metric(0,0,0);
    row.dc3=metric(0,0,0);
    row.cd123=metric(0,0,0);
  });
  await mock(page,{compact,full:fullSnapshot(compact)});
  await page.goto("/performance-profile.html?type=ps&code=AYAPS021");
  await expect(page.locator(".team-block")).toContainText("หัวหน้าทีม อยุธยา 01");
  const cards = page.locator(".metric-card");
  const cd1 = cards.filter({hasText:"CD1"}).first();
  await expect(cd1).toContainText("85.0%");
  await expect(cd1).toContainText("Actual 85");
  await expect(cd1).toContainText("Target 100");

  await page.goto("/performance-profile.html?type=ads&code=AYAADS01");
  await expect(page.locator(".identity-main h1")).toHaveText("หัวหน้าทีม อยุธยา 01");
});
