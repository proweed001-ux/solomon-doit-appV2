import { expect, test } from "@playwright/test";
import path from "node:path";
import {
  createBrowserFixtureFiles,
  fixtureMeta,
} from "../../scripts/fixtures/pro-browser-fixture.mjs";

const fixtureFiles = createBrowserFixtureFiles(
  path.resolve("test-results/pro-fixtures"),
);
const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+Xw4xAAAAAElFTkSuQmCC",
  "base64",
);
const forbiddenRequestNames = [
  "pro-shell-v1028.html",
  "pro-core-v4.js",
  "pro-native-core.js",
  "pro-native-core-overrides.js",
  "pro-print-store-bills.js",
  "pro-print-mode-fixes.js",
  "pro-print-column-widths.js",
  "pro-print-a4-pro-fix.js",
  "pro-print.css",
  "pro-team-single.js",
  "pro-results-mode.js",
  "pro-native-test.html",
  "pro-native-phase4.html",
  "pro-native-ui.html",
  "pro-action-dump.txt",
];

async function preparePage(page) {
  const errors = [];
  const requests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => requests.push(request.url()));
  await page.route("https://saodmeoilixfdqentofp.supabase.co/**", async (route) => {
    const request = route.request();
    expect(request.method()).toBe("GET");
    const url = request.url();
    if (url.includes("/doit-active")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          active: {
            id: "browser-fixture",
            file_name: "pro-browser-fixture.xlsx",
            row_count: fixtureMeta.totalRows,
            store_count: 22,
            ps_count: 1,
            telesale_bill_count: fixtureMeta.teleRows,
          },
        }),
      });
      return;
    }
    if (url.includes("/dev-qr") && url.includes("action=config")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          enabled: true,
          top_text: "CNR SDO HFSAYA",
          brand_text: "AYA DOIT",
          bottom_text: "Scan QR Code",
          image_url:
            "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><rect width='32' height='32'/></svg>",
        }),
      });
      return;
    }
    await route.fulfill({ contentType: "image/png", body: transparentPng });
  });
  await page.goto("/pro.html?t=1028");
  await expect(page.locator("script[src='/assets/pro/app.js']")).toHaveCount(1);
  await expect(page.locator("#devTeamModal")).toHaveClass(/on/);
  await page.locator("#devTeamModal .devClose").click();
  return { errors, requests };
}

async function uploadFixture(
  page,
  file,
  {
    rows = fixtureMeta.totalRows,
    teleRows = fixtureMeta.teleRows,
  } = {},
) {
  await page.locator("#file").setInputFiles(file);
  await expect(page.locator("#fileLabel")).toHaveText(path.basename(file));
  await expect(page.locator("#msg")).toContainText(
    `โหลดสำเร็จ ${rows.toLocaleString("th-TH")} แถว`,
  );
  await expect(page.locator("#msg")).toContainText(
    `Tele ${teleRows.toLocaleString("th-TH")} แถว`,
  );
}

async function chooseOnly(page, kind, label) {
  const visibleLabel =
    kind === "dates" ? label.split("-").reverse().join("/") : label;
  await page.locator(`[data-pick="${kind}"]`).click();
  await expect(page.locator("#pickShade")).toHaveClass(/on/);
  await page.locator(".pickItem", { hasText: visibleLabel }).click();
  await page.locator("#pickOk").click();
  await expect(page.locator(`[data-pick="${kind}"]`)).toContainText(visibleLabel);
}

async function openOrderMode(page) {
  await page.locator(".orderTab").click();
  await expect(page.locator("#tableCount")).toContainText(
    "รวม order PS + Telesale",
  );
}

async function expectCombinedOrder(page) {
  await expect(page.locator("#tableCount")).toContainText(
    `${fixtureMeta.orderGroups.toLocaleString("th-TH")} รายการ`,
  );
  await expect(page.locator("#table tbody tr:not(.nativeOrderTotal)")).toHaveCount(
    fixtureMeta.orderGroups,
  );
  await expect(page.locator("#table")).toContainText("TSKU-001");
  const total = page.locator("#table .nativeOrderTotal");
  await expect(total).toContainText(
    fixtureMeta.orderQty.toLocaleString("th-TH"),
  );
  await expect(total).toContainText(
    fixtureMeta.orderRawAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    }),
  );
  await expect(total).toContainText(
    fixtureMeta.orderNetAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    }),
  );
  await expect(total).toContainText(
    fixtureMeta.orderVatAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    }),
  );
}

async function expectOrderPrintNamesOnly(page) {
  const telesaleCell = page.locator(
    '#table td[data-print-value="สินค้า Telesale 001"]',
  );
  await expect(telesaleCell).toHaveCount(1);
  await expect(telesaleCell).toContainText("สินค้า Telesale 001");
  await expect(telesaleCell).toContainText("TSKU-001");
  await expect(telesaleCell).toHaveAttribute(
    "data-print-value",
    "สินค้า Telesale 001",
  );

  const numericNameCell = page.locator(
    `#table td[data-print-value="${fixtureMeta.numericProductName}"]`,
  );
  await expect(numericNameCell).toHaveCount(1);
  await expect(numericNameCell).toContainText(fixtureMeta.numericProductName);
  await expect(numericNameCell).toContainText(fixtureMeta.numericProductCode);

  await page.locator("#prepPrint").click();
  const overlay = page.locator(".printOverlay.orderPrint");
  await expect(overlay).toBeVisible();
  await expect(overlay).toContainText("สินค้า Telesale 001");
  await expect(overlay).not.toContainText("TSKU-001");
  await expect(overlay).toContainText(fixtureMeta.numericProductName);
  await expect(overlay).not.toContainText(fixtureMeta.numericProductCode);

  await overlay.locator("[data-print-close]").click();
  await expect(overlay).toHaveCount(0);
  await expect(page.locator("#table")).toContainText("TSKU-001");
  await expect(page.locator("#table")).toContainText(fixtureMeta.numericProductCode);
}

function requestBasename(url) {
  try {
    return new URL(url).pathname.split("/").pop();
  } catch {
    return url;
  }
}

test("uploads real XLSX and XLSM fixtures through the file input", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  for (const file of [fixtureFiles.xlsx, fixtureFiles.xlsm]) {
    await uploadFixture(page, file);
    await expect(page.locator("#amount")).toContainText("2,951.00");
    await expect(page.locator("#amount")).toContainText("2,691.00");
    await expect(page.locator("#amount")).toContainText("2,879.37");
    await expect(page.locator("#table tbody tr[data-pool-key]")).toHaveCount(
      fixtureMeta.normalRows,
    );
    await page.locator('[data-pick="dates"]').click();
    await expect(
      page.locator(".pickItem", {
        hasText: fixtureMeta.date.split("-").reverse().join("/"),
      }),
    ).toBeVisible();
    await page.locator("#pickClose").click();
    await page.locator('[data-pick="ps"]').click();
    await expect(page.locator(".pickItem", { hasText: fixtureMeta.ps })).toBeVisible();
    await page.locator("#pickClose").click();
    await expect
      .poll(() => page.evaluate(() => typeof globalThis.XLSX))
      .toBe("object");
  }
  expect(runtime.requests.some((url) => /cdn\.jsdelivr|unpkg\.com/i.test(url))).toBe(
    false,
  );
  expect(runtime.errors).toEqual([]);
});

test("combines PS and Telesale in the real Combined Order tab for XLSX and XLSM", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  for (const file of [fixtureFiles.xlsx, fixtureFiles.xlsm]) {
    await uploadFixture(page, file);
    await openOrderMode(page);
    await expectCombinedOrder(page);
    await expectOrderPrintNamesOnly(page);

    await chooseOnly(page, "dates", fixtureMeta.date);
    await expectCombinedOrder(page);
    await chooseOnly(page, "ps", fixtureMeta.ps);
    await expectCombinedOrder(page);

    await chooseOnly(page, "orderStores", fixtureMeta.receiver);
    await expect(page.locator("#tableCount")).toContainText(
      `${(fixtureMeta.teleRows - 1).toLocaleString("th-TH")} รายการ`,
    );
    await expect(page.locator("#table")).toContainText("TSKU-001");

    await page.locator("#clearFilter").click();
    await openOrderMode(page);
    await chooseOnly(page, "brands", "Fixture Brand");
    await expect(page.locator("#tableCount")).toContainText(
      `${fixtureMeta.normalRows.toLocaleString("th-TH")} รายการ`,
    );
    await expect(page.locator("#table")).not.toContainText("สินค้า Telesale 001");

    await page.locator("#clearFilter").click();
    await openOrderMode(page);
    await chooseOnly(page, "types", "INVC");
    await expectCombinedOrder(page);

    await page.locator("#q").fill("TSKU-001");
    await page.locator("#searchBtn").click();
    await expect(page.locator("#tableCount")).toContainText("1 รายการ");
    await expect(page.locator("#table")).toContainText("TSKU-001");

    await page.locator("#clearFilter").click();
  }
  expect(runtime.errors).toEqual([]);
});

test("shows and prints real PS and Telesale bills without changing send-to-store state", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  for (const file of [fixtureFiles.xlsx, fixtureFiles.xlsm]) {
    await uploadFixture(page, file);
    await chooseOnly(page, "dates", fixtureMeta.date);
    await chooseOnly(page, "ps", fixtureMeta.ps);
    await chooseOnly(page, "receivers", fixtureMeta.receiver);

    const realBillTab = page.locator(".tabs .tab").nth(2);
    await expect(realBillTab).toHaveText("บิลจริง");
    await realBillTab.click();
    await expect(page.locator("#modeHeading")).toHaveText("บิลจริง");
    await expect(page.locator("#sendLabelText")).toHaveText("เลือกร้านบิลจริง:");
    await expect(page.locator("body")).not.toContainText("ใบส่งร้านจริง");
    await expect
      .poll(() =>
        page.evaluate(() => window.DOIT_CORE_APP.currentState().mode),
      )
      .toBe("ship");
    await expect(page.locator("#realBills")).toContainText(
      "เลือกร้านหรือพิมพ์ชื่อร้าน เพื่อดูบิลจริง",
    );
    await expect(page.locator("#table")).toBeHidden();

    await page.locator('[data-pick="receivers"]').click();
    const psTsOption = page.locator(
      `.pickItem[data-v="${fixtureMeta.realPsTsStore}"]`,
    );
    const tsOption = page.locator(
      `.pickItem[data-v="${fixtureMeta.realTsStore}"]`,
    );
    await expect(psTsOption).toContainText(
      `${fixtureMeta.realPsTsStore} (PS+TS)`,
    );
    await expect(tsOption).toContainText(`${fixtureMeta.realTsStore} (TS)`);
    await psTsOption.click();
    await tsOption.click();
    await page.locator("#pickOk").click();

    let selectedState = await page.evaluate(() =>
      window.DOIT_CORE_APP.currentState(),
    );
    expect(selectedState.sel.receivers).toEqual([fixtureMeta.receiver]);
    expect(selectedState.sel.billStores).toEqual([
      fixtureMeta.realPsTsStore,
      fixtureMeta.realTsStore,
    ]);
    expect(
      selectedState.sel.billStores.some((store) => /\((?:TS|PS\+TS)\)/.test(store)),
    ).toBe(false);

    await page.locator("#undo").click();
    await expect
      .poll(() =>
        page.evaluate(
          () => window.DOIT_CORE_APP.currentState().sel.billStores.length,
        ),
      )
      .toBe(0);
    await page.locator("#redo").click();
    await expect
      .poll(() =>
        page.evaluate(
          () => window.DOIT_CORE_APP.currentState().sel.billStores.length,
        ),
      )
      .toBe(2);

    await expect(page.locator("#realBills")).toHaveAttribute(
      "data-total-bills",
      "17",
    );
    await expect(page.locator("#realBills .realBill")).toHaveCount(12);
    await expect(page.locator(".realBillPager")).toContainText("17 บิล");
    const psSharedInvoice = page.locator(
      `.realBill[data-real-source="PS"][data-real-store="${fixtureMeta.realPsTsStore}"][data-real-inv="${fixtureMeta.realBulkInvoice}"]`,
    );
    await expect(psSharedInvoice).toHaveCount(1);
    await expect(psSharedInvoice).toContainText("15/07/2026");
    await expect(psSharedInvoice.locator("tbody tr:not(.realBillTotal)")).toHaveCount(
      13,
    );
    expect(
      await page
        .locator(".realBillTableWrap")
        .first()
        .evaluate((element) => getComputedStyle(element).overflowX),
    ).toBe("auto");
    await page.locator('[data-real-page="2"]').click();
    await expect(page.locator("#realBills .realBill")).toHaveCount(5);
    await expect(
      page.locator(`.realBill[data-real-store="${fixtureMeta.realTsStore}"]`),
    ).toHaveCount(2);
    const tsSharedInvoice = page.locator(
      `.realBill[data-real-source="TS"][data-real-store="${fixtureMeta.realPsTsStore}"][data-real-inv="${fixtureMeta.realBulkInvoice}"]`,
    );
    await expect(tsSharedInvoice).toHaveCount(1);
    await expect(tsSharedInvoice).toContainText("Telesale (TS)");
    await expect(tsSharedInvoice).toContainText("TELE-PS-TS");

    await page.locator('[data-pick="receivers"]').click();
    await page.locator("#pickClear").click();
    await page.locator("#pickOk").click();
    await page.locator("#q").fill(fixtureMeta.realTsStore);
    await page.locator("#searchBtn").click();
    await expect(page.locator("#realBills .realBill")).toHaveCount(2);
    const searchedTsBill = page.locator(
      `.realBill[data-real-inv="${fixtureMeta.realTsInvoice}"]`,
    );
    await expect(searchedTsBill.locator("tbody tr:not(.realBillTotal)")).toHaveCount(
      2,
    );
    await expect(searchedTsBill.locator(".realBillTotal")).toContainText("2");
    await expect(searchedTsBill.locator(".realBillTotal")).toContainText("43.00");
    await expect(searchedTsBill.locator(".realBillTotal")).toContainText("41.73");

    const printEditBefore = await page.evaluate(() =>
      localStorage.getItem("doit-pro-print-price-edits-v1"),
    );
    await page.locator("#prepPrint").click();
    let overlay = page.locator(".printOverlay.realBillPrint");
    await expect(overlay).toBeVisible();
    await expect(overlay.locator(".printBar")).toContainText(
      "ตรวจ/แก้ไขก่อนปริ้น — บิลจริง",
    );
    await expect(overlay.locator(".a4Sheet")).toHaveCount(1);
    await expect(overlay.locator(".realBillReceipt")).toHaveCount(2);
    await expect(overlay).toContainText(fixtureMeta.realTsInvoice);
    await expect(overlay).toContainText("15/07/2026");
    await expect(overlay).toContainText("Telesale (TS)");
    await expect(overlay).toContainText(fixtureMeta.realTsTele);
    await expect(overlay.locator("[data-edit-key]")).toHaveCount(0);
    expect(
      await page.evaluate(() =>
        localStorage.getItem("doit-pro-print-price-edits-v1"),
      ),
    ).toBe(printEditBefore);
    await overlay.locator("[data-print-close]").click();

    await page.locator("#q").fill(fixtureMeta.realBulkInvoice);
    await page.locator("#searchBtn").click();
    await expect(page.locator("#realBills .realBill")).toHaveCount(2);
    await page.locator("#prepPrint").click();
    overlay = page.locator(".printOverlay.realBillPrint");
    await expect(overlay.locator(".a4Sheet")).toHaveCount(2);
    await expect(overlay.locator(".realBillReceipt")).toHaveCount(3);
    await expect(overlay.locator(".realBillReceipt").nth(0).locator("[data-real-line]")).toHaveCount(
      12,
    );
    await expect(overlay.locator(".realBillReceipt").nth(1).locator("[data-real-line]")).toHaveCount(
      1,
    );
    await expect(overlay.locator(".realBillReceipt").nth(2).locator("[data-real-line]")).toHaveCount(
      1,
    );
    await expect(overlay.locator('[data-real-part="1/2"]')).toContainText(
      "ต่อใบถัดไป",
    );
    await expect(overlay.locator('[data-real-part="2/2"]')).toContainText(
      "1,391.00",
    );
    await expect(overlay.locator(".realBillPrintTotal").first()).toContainText(
      /\d+\.\d{2}/,
    );
    expect(
      await page.evaluate(() =>
        localStorage.getItem("doit-pro-print-price-edits-v1"),
      ),
    ).toBe(printEditBefore);
    await overlay.locator("[data-print-close]").click();

    await page.locator(".tabs .tab").first().click();
    await expect(page.locator("#sendLabelText")).toHaveText("ส่งให้ร้าน:");
    await expect(page.locator('[data-pick="receivers"]')).toContainText(
      fixtureMeta.receiver,
    );
    selectedState = await page.evaluate(() =>
      window.DOIT_CORE_APP.currentState(),
    );
    expect(selectedState.sel.receivers).toEqual([fixtureMeta.receiver]);
    expect(selectedState.sel.billStores).toEqual([]);

    await realBillTab.click();
    await chooseOnly(page, "brands", "Fixture Tele Brand");
    await page.locator(".tabs .tab").first().click();
    await page.locator('[data-pick="brands"]').click();
    const hiddenFilterOption = page.locator(
      '.pickItem[data-v="Fixture Tele Brand"]',
    );
    await expect(hiddenFilterOption).toContainText(
      "เลือกอยู่ — ไม่มีในชุดปัจจุบัน",
    );
    await hiddenFilterOption.click();
    await page.locator("#pickOk").click();
    selectedState = await page.evaluate(() =>
      window.DOIT_CORE_APP.currentState(),
    );
    expect(selectedState.sel.brands).toEqual([]);
    expect(selectedState.sel.receivers).toEqual([fixtureMeta.receiver]);

    await realBillTab.click();
    await page.locator('[data-pick="receivers"]').click();
    await page.locator(
      `.pickItem[data-v="${fixtureMeta.realTsStore}"]`,
    ).click();
    await page.locator("#pickOk").click();
    await page.locator("#clearFilter").click();
    await expect
      .poll(() =>
        page.evaluate(
          () => window.DOIT_CORE_APP.currentState().sel.billStores.length,
        ),
      )
      .toBe(0);
  }
  expect(runtime.errors).toEqual([]);
});

test("keeps large real-bill tabs, pickers and pagination responsive", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await uploadFixture(page, fixtureFiles.largeXlsx, {
    rows: fixtureMeta.largeRows,
    teleRows: fixtureMeta.largeTeleRows,
  });

  const tabStart = Date.now();
  await page.locator(".tabs .tab").nth(2).click();
  await expect(page.locator("#modeHeading")).toHaveText("บิลจริง");
  await expect(page.locator("#realBills")).toContainText(
    "เลือกร้านหรือพิมพ์ชื่อร้าน เพื่อดูบิลจริง",
  );
  expect(Date.now() - tabStart).toBeLessThan(500);
  let metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.candidateBuilds).toBe(0);
  expect(metrics.renderedBills).toBe(0);

  const popupStart = Date.now();
  await page.locator('[data-pick="receivers"]').click();
  await expect(page.locator("#pickShade")).toHaveClass(/on/);
  await expect(page.locator("#pickList .pickItem")).toHaveCount(
    fixtureMeta.largeStores,
  );
  expect(Date.now() - popupStart).toBeLessThan(1500);
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  const pickerOptionsCalls = metrics.pickerOptionsCalls;
  const pickerListRenders = metrics.pickerListRenders;
  expect(pickerOptionsCalls).toBe(1);
  expect(pickerListRenders).toBe(1);
  expect(metrics.candidateBuilds).toBe(1);

  const toggleResult = await page.evaluate(() => {
    const list = document.querySelector("#pickList");
    const item = list.querySelectorAll(".pickItem")[20];
    list.scrollTop = 180;
    const scrollTop = list.scrollTop;
    const started = performance.now();
    item.click();
    return {
      elapsed: performance.now() - started,
      sameNode: item === list.querySelectorAll(".pickItem")[20],
      scrollTop,
      nextScrollTop: list.scrollTop,
    };
  });
  expect(toggleResult.elapsed).toBeLessThan(100);
  expect(toggleResult.sameNode).toBe(true);
  expect(toggleResult.nextScrollTop).toBe(toggleResult.scrollTop);
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.pickerOptionsCalls).toBe(pickerOptionsCalls);
  expect(metrics.pickerListRenders).toBe(pickerListRenders);

  await page.locator("#pickAll").click();
  await expect(page.locator("#pickList .pickItem.on")).toHaveCount(
    fixtureMeta.largeStores,
  );
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.pickerOptionsCalls).toBe(pickerOptionsCalls);
  expect(metrics.pickerListRenders).toBe(pickerListRenders);

  const applyStart = Date.now();
  await page.locator("#pickOk").click();
  await expect(page.locator("#tableCount")).toContainText(
    `${fixtureMeta.largeBills} บิล`,
  );
  await expect(page.locator("#realBills .realBill")).toHaveCount(12);
  expect(Date.now() - applyStart).toBeLessThan(1500);
  await expect(page.locator("#realBills")).toHaveAttribute(
    "data-total-bills",
    String(fixtureMeta.largeBills),
  );
  await expect(page.locator(".realBillPager")).toContainText(
    `${fixtureMeta.largeBills} บิล`,
  );
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.candidateBuilds).toBe(1);
  expect(metrics.totalBills).toBe(fixtureMeta.largeBills);
  expect(metrics.renderedBills).toBe(12);
  expect(metrics.renderedRows).toBe(
    12 * fixtureMeta.largeLinesPerBill,
  );

  await page.locator('[data-real-page="2"]').click();
  await expect(page.locator(".realBillPager")).toContainText("หน้า 2/");
  await expect(page.locator("#realBills .realBill")).toHaveCount(12);

  await chooseOnly(page, "brands", "PERF-BRAND-0");
  await chooseOnly(page, "types", "PERF-TYPE-4");
  await expect(page.locator("#realBills .realBill").first()).toBeVisible();
  await expect(
    page
      .locator("#realBills .realBill")
      .first()
      .locator("tbody tr:not(.realBillTotal)"),
  ).toHaveCount(fixtureMeta.largeLinesPerBill);
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.candidateBuilds).toBe(1);

  expect(
    runtime.requests
      .map(requestBasename)
      .filter((name) => forbiddenRequestNames.includes(name)),
  ).toEqual([]);
  expect(runtime.errors).toEqual([]);
});

test("keeps the active Pro flow, state, mobile layout and print contract", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await uploadFixture(page, fixtureFiles.xlsx);

  const scriptEntries = await page.locator("script[src]").evaluateAll((scripts) =>
    scripts.map((script) => script.getAttribute("src")),
  );
  expect(scriptEntries).toEqual(["/assets/pro/app.js"]);
  expect(
    runtime.requests
      .map(requestBasename)
      .filter((name) => forbiddenRequestNames.includes(name)),
  ).toEqual([]);

  await page.locator('[data-pick="brands"]').click();
  await expect(page.locator("#pickShade")).toHaveClass(/on/);
  await page.locator("#pickClose").click();
  await expect(page.locator("#pickShade")).not.toHaveClass(/on/);

  await chooseOnly(page, "dates", fixtureMeta.date);
  await chooseOnly(page, "ps", fixtureMeta.ps);
  await chooseOnly(page, "receivers", fixtureMeta.receiver);

  await page.locator("#q").fill("SKU-025");
  await page.locator("#searchBtn").click();
  await expect(page.locator("#table tbody tr[data-pool-key]")).toHaveCount(1);
  await expect(page.locator("#table")).toContainText("สินค้า Fixture 025");
  await page.locator("#q").fill("");
  await page.locator("#searchBtn").click();

  const sendInputs = page.locator('#table input.jdata[data-map="send"]');
  await expect(sendInputs).toHaveCount(fixtureMeta.normalRows);
  await sendInputs.nth(0).fill("2");
  await sendInputs.nth(0).press("Enter");
  await page.waitForTimeout(220);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const inputs = [
          ...document.querySelectorAll('#table input.jdata[data-map="send"]'),
        ];
        return inputs.indexOf(document.activeElement);
      }),
    )
    .toBe(1);
  await page.locator("#undo").click();
  await expect(sendInputs.nth(0)).toHaveValue("");
  await page.locator("#redo").click();
  await expect(sendInputs.nth(0)).toHaveValue("2");

  for (let index = 0; index < fixtureMeta.sentRows; index += 1) {
    const input = sendInputs.nth(index);
    await input.fill("1");
    await input.press("Enter");
    await page.waitForTimeout(180);
    await expect(sendInputs.nth(index)).toHaveValue("1");
  }
  await expect(page.locator("#doneAmount")).toHaveText(String(fixtureMeta.sentQty));
  await expect(sendInputs.nth(fixtureMeta.normalRows - 1)).toHaveValue("");

  await page.reload();
  await expect(page.locator("#devTeamModal")).toHaveClass(/on/);
  await page.locator("#devTeamModal .devClose").click();
  await uploadFixture(page, fixtureFiles.xlsx);
  await expect(page.locator('[data-pick="receivers"]')).toContainText(
    fixtureMeta.receiver,
  );
  await expect(page.locator("#doneAmount")).toHaveText(String(fixtureMeta.sentQty));

  await page.locator(".devTeamBtn").click();
  await expect(page.locator("#devTeamModal")).toHaveClass(/on/);
  await expect(page.locator("#devQrBlock")).toBeVisible();
  await expect(page.locator("#devQrBlock img")).toHaveCount(1);
  await page.locator("#devTeamModal .devClose").click();

  for (let index = 0; index < 5; index += 1) {
    await page.locator(".uploadCard h3").click();
  }
  await expect(page.locator("#fuelBillBtn")).toBeVisible();

  await page.locator("#teleBtn").click();
  await expect(page.locator("#teleDrawer")).toHaveClass(/on/);
  await expect(page.locator(".teleBill")).toHaveCount(fixtureMeta.telesaleBills);
  await expect(page.locator(".telePager .page.on")).toHaveText("1/1");
  await page.locator("#closeDrawer").click();

  await page.locator("#prepPrint").click();
  const overlay = page.locator(".printOverlay.printMobileSafeA4");
  await expect(overlay).toBeVisible();
  await expect(overlay.locator(".a4Sheet")).toHaveCount(fixtureMeta.a4Sheets);
  await expect(overlay.locator(".receiptPage:not(.emptyBill)")).toHaveCount(
    fixtureMeta.printBills,
  );
  await expect(overlay.locator("tr[data-line]")).toHaveCount(fixtureMeta.sentRows);
  await expect(overlay.locator(".receiptTable thead")).toHaveCount(
    fixtureMeta.printBills,
  );
  await expect(overlay.locator(".receiptTable thead").first()).toContainText("รหัส");
  await expect(overlay.locator("tr[data-line]").first()).toContainText("SKU-001");
  await expect(overlay).not.toContainText("สินค้า Fixture 026");
  const printShape = await overlay.evaluate((element) => {
    const pages = [...element.querySelectorAll(".receiptPage:not(.emptyBill)")];
    const qty = [...element.querySelectorAll("tr[data-line] .rq")].reduce(
      (sum, cell) => sum + Number(cell.textContent || 0),
      0,
    );
    const total = [...element.querySelectorAll("[data-page-total='1']")]
      .map((cell) => Number((cell.textContent || "").replaceAll(",", "")) || 0)
      .reduce((sum, value) => sum + value, 0);
    return {
      rowsPerBill: pages.map(
        (page) => page.querySelectorAll("tr[data-line]").length,
      ),
      qty,
      total,
      width: element.getBoundingClientRect().width,
      viewport: window.innerWidth,
    };
  });
  expect(printShape.rowsPerBill).toEqual([12, 12, 1]);
  expect(printShape.qty).toBe(fixtureMeta.sentQty);
  expect(printShape.total).toBe(fixtureMeta.printStoreTotal);
  expect(printShape.width).toBeLessThanOrEqual(printShape.viewport);

  const css = await (await page.request.get("/assets/pro/pro.css")).text();
  expect(css).toMatch(/@page\s*\{[\s\S]*?size:\s*A4 portrait/);
  expect(css).toMatch(/grid-template-rows:\s*repeat\(2,\s*138\.5mm\)/);

  await overlay.locator("[data-print-close]").click();
  const layout = await page.evaluate(() => {
    const visibleButtons = [...document.querySelectorAll("button")].filter((button) => {
      const style = getComputedStyle(button);
      const box = button.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        box.width > 0 &&
        box.height > 0
      );
    });
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      controlsInsideViewport: visibleButtons.every((button) => {
        const box = button.getBoundingClientRect();
        return box.left >= -1 && box.right <= window.innerWidth + 1;
      }),
      tableOverflow: getComputedStyle(
        document.querySelector(".tableWrap"),
      ).overflowX,
    };
  });
  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.controlsInsideViewport).toBe(true);
  expect(["auto", "scroll"]).toContain(layout.tableOverflow);
  expect(runtime.errors).toEqual([]);
});
