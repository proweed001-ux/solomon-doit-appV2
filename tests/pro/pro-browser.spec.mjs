import { expect, test } from "@playwright/test";
import path from "node:path";
import XLSX from "xlsx";
import {
  browserFixtureRows,
  createBrowserFixtureFiles,
  cutStoreFixtureMeta,
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
const fixtureRowsCache = new Map();

function rowsFromFixture(file) {
  if (!fixtureRowsCache.has(file)) {
    const workbook = XLSX.readFile(file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    fixtureRowsCache.set(
      file,
      XLSX.utils.sheet_to_json(sheet, { defval: "" }),
    );
  }
  return fixtureRowsCache.get(file);
}

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
      const active = {
        id: "browser-fixture",
        file_name: "pro-browser-fixture.xlsx",
        row_count: fixtureMeta.totalRows,
        store_count: 22,
        ps_count: 1,
        telesale_bill_count: fixtureMeta.telesaleBills,
      };
      const mode = new URL(url).searchParams.get("mode");
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          mode === "data"
            ? {
                active,
                mode: "inline",
                row_count: fixtureMeta.totalRows,
                payload: { rows: browserFixtureRows() },
              }
            : { active },
        ),
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
  await expect(page.locator("#cloudState")).toHaveText("พร้อม");
  await expect(page.locator("#msg")).toContainText(
    `โหลดสำเร็จ ${fixtureMeta.totalRows.toLocaleString("th-TH")} แถว`,
  );
  return { errors, requests };
}

async function loadFixture(
  page,
  file,
  {
    rows = fixtureMeta.totalRows,
    teleRows = fixtureMeta.teleRows,
  } = {},
) {
  await page.evaluate(
    ({ fixtureRows, fileName }) => {
      window.DOIT_CORE_APP.load(fixtureRows, {
        id: fileName,
        file_name: fileName,
        row_count: fixtureRows.length,
      });
    },
    { fixtureRows: rowsFromFixture(file), fileName: path.basename(file) },
  );
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
  const item =
    kind === "dates"
      ? page.locator(".pickItem", { hasText: visibleLabel })
      : page.locator(`.pickItem[data-v="${label}"]`);
  await item.click();
  await page.locator("#pickOk").click();
  await expect(page.locator(`[data-pick="${kind}"]`)).toContainText(visibleLabel);
}

async function quantitySnapshot(page, map, index = 0) {
  return page.evaluate(
    async ({ mapName, inputIndex }) => {
      const stateModule = await import("/assets/pro/state.js");
      const inputs = [
        ...document.querySelectorAll(
          `#table input.jdata[data-map="${mapName}"]`,
        ),
      ];
      const input = inputs[inputIndex] || null;
      const key = input?.dataset.k || "";
      const stored = JSON.parse(
        localStorage.getItem(stateModule.sk()) || "{}",
      );
      const sendInputs = [
        ...document.querySelectorAll(
          '#table input.jdata[data-map="send"]',
        ),
      ];
      const quantityInputs = [
        ...document.querySelectorAll("#table input.jdata[data-map]"),
      ];
      const activeQuantity = document.activeElement?.matches?.(
        "#table input.jdata[data-map]",
      )
        ? document.activeElement
        : null;
      return {
        dom: input?.value ?? null,
        key,
        stateValue: key ? stateModule.state[mapName][key] ?? null : null,
        storedValue: key ? stored[mapName]?.[key] ?? null : null,
        stateHasKey: key
          ? Object.prototype.hasOwnProperty.call(stateModule.state[mapName], key)
          : false,
        storedHasKey: key
          ? Object.prototype.hasOwnProperty.call(stored[mapName] || {}, key)
          : false,
        receivers: [...stateModule.state.sel.receivers],
        storedReceivers: [...(stored.sel?.receivers || [])],
        history: stateModule.state.hist.length,
        redo: stateModule.state.redoStack.length,
        pending: window.DOIT_CORE_APP.health().pendingQuantityEdit,
        activeSendIndex: sendInputs.indexOf(document.activeElement),
        activeQuantityIndex: quantityInputs.indexOf(document.activeElement),
        activeQuantityMap: activeQuantity?.dataset.map || null,
        activeQuantityKey: activeQuantity?.dataset.k || null,
        remaining: input
          ?.closest("tr")
          ?.querySelector(".remainCell")?.textContent,
        doneAmount: document.querySelector("#doneAmount")?.textContent,
        mode: stateModule.state.mode,
        page: stateModule.state.page,
        storageKey: stateModule.sk(),
      };
    },
    { mapName: map, inputIndex: index },
  );
}

async function quantityByKey(page, map, key) {
  return page.evaluate(
    async ({ mapName, stateKey }) => {
      const stateModule = await import("/assets/pro/state.js");
      const stored = JSON.parse(
        localStorage.getItem(stateModule.sk()) || "{}",
      );
      return {
        stateValue: stateModule.state[mapName][stateKey] ?? null,
        storedValue: stored[mapName]?.[stateKey] ?? null,
        receivers: [...stateModule.state.sel.receivers],
        storedReceivers: [...(stored.sel?.receivers || [])],
        history: stateModule.state.hist.length,
        redo: stateModule.state.redoStack.length,
        pending: window.DOIT_CORE_APP.health().pendingQuantityEdit,
        mode: stateModule.state.mode,
        page: stateModule.state.page,
        storageKey: stateModule.sk(),
      };
    },
    { mapName: map, stateKey: key },
  );
}

async function settleAnimationFrames(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}

async function activateRealBillTabMeasured(page) {
  return page.evaluate(() => {
    const tab = [...document.querySelectorAll(".tabs .tab")].find(
      (item) => item.textContent?.trim() === "บิลจริง",
    );
    if (!tab) throw new Error("Real Bill tab not found");
    tab.scrollIntoView({ block: "center", inline: "nearest" });
    const started = performance.now();
    tab.click();
    const eventHandlerMs = performance.now() - started;
    const metrics =
      window.DOIT_CORE_APP.health().realBillPerformance;
    return {
      eventHandlerMs,
      lastFullRenderMs: metrics.lastFullRenderMs,
      mode: window.DOIT_CORE_APP.currentState().mode,
    };
  });
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

test("auto-loads the latest Cloud data without manual file controls", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await expect(page.locator("#amount")).toContainText("2,951.00");
  await expect(page.locator("#amount")).toContainText("2,691.00");
  await expect(page.locator("#amount")).toContainText("2,879.37");
  await expect(page.locator("#table tbody tr[data-pool-key]")).toHaveCount(
    fixtureMeta.normalRows,
  );
  await expect(page.locator("#cloudMsg")).toContainText(
    "pro-browser-fixture.xlsx",
  );
  await expect(
    page.locator("#choose,#file,#fileLabel,#cloudCheckBtn,#cloudLoadBtn"),
  ).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText("ตรวจไฟล์ล่าสุด");
  await expect(page.locator("body")).not.toContainText(
    "โหลดไฟล์ล่าสุดจาก Cloud",
  );
  await expect
    .poll(() => page.evaluate(() => typeof globalThis.XLSX))
    .toBe("undefined");
  const cloudRequests = runtime.requests.filter((url) =>
    url.includes("/doit-active"),
  );
  expect(cloudRequests).toHaveLength(1);
  expect(new URL(cloudRequests[0]).searchParams.get("mode")).toBe("data");
  expect(runtime.requests.some((url) => /cdn\.jsdelivr|unpkg\.com/i.test(url))).toBe(
    false,
  );
  expect(runtime.errors).toEqual([]);
});

test("rebuilds print quantities from current Pro state while retaining price edits", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await chooseOnly(page, "dates", fixtureMeta.date);
  await chooseOnly(page, "ps", fixtureMeta.ps);
  await chooseOnly(page, "receivers", fixtureMeta.receiver);

  const sendInput = page.locator('#table input.jdata[data-map="send"]').first();
  await sendInput.fill("5");
  await sendInput.press("Tab");
  await expect(sendInput).toHaveValue("5");

  await page.locator("#prepPrint").click();
  let overlay = page.locator(".printOverlay.printMobileSafeA4");
  await expect(overlay).toBeVisible();
  await expect(overlay.locator("tr[data-line] .rq").first()).toHaveText("5");

  const unitCell = overlay.locator("tr[data-line] .ru").first();
  await unitCell.fill("123.45");
  await unitCell.press("Tab");
  const savedPriceEdit = await page.evaluate(() => {
    const edits = JSON.parse(
      localStorage.getItem("doit-pro-print-price-edits-v1") || "{}",
    );
    return Object.values(edits)[0] || null;
  });
  expect(savedPriceEdit).toMatchObject({ unit: 123.45 });
  expect(savedPriceEdit).not.toHaveProperty("qty");

  await page.evaluate(() => {
    const key = "doit-pro-print-price-edits-v1";
    const edits = JSON.parse(localStorage.getItem(key) || "{}");
    const firstKey = Object.keys(edits)[0];
    edits[firstKey] = { ...edits[firstKey], qty: 5 };
    localStorage.setItem(key, JSON.stringify(edits));
  });
  await overlay.locator("[data-print-close]").click();

  await sendInput.fill("2");
  await sendInput.press("Tab");
  const currentQuantity = await quantitySnapshot(page, "send");
  expect(currentQuantity.dom).toBe("2");
  expect(currentQuantity.stateValue).toBe(2);
  expect(currentQuantity.storedValue).toBe(2);

  await page.locator("#prepPrint").click();
  overlay = page.locator(".printOverlay.printMobileSafeA4");
  await expect(overlay).toBeVisible();
  await expect(overlay.locator("tr[data-line] .rq").first()).toHaveText("2");
  await expect(overlay.locator("tr[data-line] .ru").first()).toHaveText(
    "123.45",
  );
  await expect(overlay.locator("tr[data-line] .rt").first()).toHaveText(
    "246.90",
  );

  expect(runtime.errors).toEqual([]);
});

test("commits send, add and pull as one authoritative edit session", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);
  await chooseOnly(page, "receivers", fixtureMeta.receiver);

  const sendInputs = page.locator(
    '#table input.jdata[data-map="send"]',
  );
  expect(await sendInputs.count()).toBe(fixtureMeta.normalRows);
  const firstSend = sendInputs.nth(0);
  const baseline = await quantitySnapshot(page, "send", 0);

  await firstSend.focus();
  await firstSend.fill("1");
  const afterInput = await quantitySnapshot(page, "send", 0);
  expect(afterInput.dom).toBe("1");
  expect(afterInput.stateValue).toBe(1);
  expect(afterInput.storedValue).toBeNull();
  expect(afterInput.history).toBe(baseline.history + 1);
  expect(afterInput.pending).toBe(true);
  expect(afterInput.remaining).toBe("9");

  await firstSend.press("Enter");
  const afterEnter = await quantitySnapshot(page, "send", 0);
  expect(afterEnter.dom).toBe("1");
  expect(afterEnter.stateValue).toBe(1);
  expect(afterEnter.storedValue).toBe(1);
  expect(afterEnter.history).toBe(afterInput.history);
  expect(afterEnter.pending).toBe(false);
  expect(afterEnter.doneAmount).toBe("1");
  expect(afterEnter.activeSendIndex).toBe(1);

  await page.locator("#undo").click();
  const afterUndo = await quantitySnapshot(page, "send", 0);
  expect(afterUndo.dom).toBe("");
  expect(afterUndo.stateValue).toBeNull();
  expect(afterUndo.receivers).toEqual([fixtureMeta.receiver]);
  expect(afterUndo.history).toBe(baseline.history);
  expect(afterUndo.redo).toBe(1);
  expect(afterUndo.doneAmount).toBe("0");

  await page.locator("#redo").click();
  const afterRedo = await quantitySnapshot(page, "send", 0);
  expect(afterRedo.dom).toBe("1");
  expect(afterRedo.stateValue).toBe(1);
  expect(afterRedo.receivers).toEqual([fixtureMeta.receiver]);
  expect(afterRedo.history).toBe(afterInput.history);
  expect(afterRedo.redo).toBe(0);

  const beforeMultiDigit = await quantitySnapshot(page, "send", 0);
  await firstSend.focus();
  await firstSend.fill("1");
  await firstSend.type("2");
  const duringMultiDigit = await quantitySnapshot(page, "send", 0);
  expect(duringMultiDigit.dom).toBe("12");
  expect(duringMultiDigit.stateValue).toBe(12);
  expect(duringMultiDigit.history).toBe(beforeMultiDigit.history + 1);
  await firstSend.press("Tab");
  const afterMultiDigit = await quantitySnapshot(page, "send", 0);
  expect(afterMultiDigit.storedValue).toBe(12);
  expect(afterMultiDigit.history).toBe(duringMultiDigit.history);
  expect(afterMultiDigit.activeSendIndex).toBe(1);

  const secondSend = sendInputs.nth(1);
  const beforeDuplicateEvents = await quantitySnapshot(page, "send", 1);
  await secondSend.focus();
  await secondSend.fill("3");
  const duringDuplicateEvents = await quantitySnapshot(page, "send", 1);
  expect(duringDuplicateEvents.history).toBe(
    beforeDuplicateEvents.history + 1,
  );
  await secondSend.evaluate((input) => {
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.dispatchEvent(new FocusEvent("blur"));
  });
  const afterDuplicateEvents = await quantitySnapshot(page, "send", 1);
  expect(afterDuplicateEvents.stateValue).toBe(3);
  expect(afterDuplicateEvents.storedValue).toBe(3);
  expect(afterDuplicateEvents.history).toBe(duringDuplicateEvents.history);
  expect(afterDuplicateEvents.pending).toBe(false);

  const thirdSend = sendInputs.nth(2);
  const beforeOutsideClick = await quantitySnapshot(page, "send", 2);
  await thirdSend.focus();
  await thirdSend.fill("4");
  await page.locator("#modeHeading").click();
  const afterOutsideClick = await quantitySnapshot(page, "send", 2);
  expect(afterOutsideClick.stateValue).toBe(4);
  expect(afterOutsideClick.storedValue).toBe(4);
  expect(afterOutsideClick.history).toBe(beforeOutsideClick.history + 1);
  expect(afterOutsideClick.pending).toBe(false);

  const fourthSend = sendInputs.nth(3);
  const beforeBlur = await quantitySnapshot(page, "send", 3);
  await fourthSend.focus();
  await fourthSend.fill("5");
  await fourthSend.evaluate((input) => {
    input.dispatchEvent(new FocusEvent("blur"));
  });
  const afterBlur = await quantitySnapshot(page, "send", 3);
  expect(afterBlur.stateValue).toBe(5);
  expect(afterBlur.storedValue).toBe(5);
  expect(afterBlur.history).toBe(beforeBlur.history + 1);
  expect(afterBlur.pending).toBe(false);

  const addInputs = page.locator('#table input.jdata[data-map="add"]');
  const pullInputs = page.locator('#table input.jdata[data-map="pull"]');
  expect(await addInputs.count()).toBe(fixtureMeta.normalRows);
  expect(await pullInputs.count()).toBe(fixtureMeta.normalRows);
  await addInputs.nth(0).focus();
  await addInputs.nth(0).fill("2");
  await addInputs.nth(0).press("Tab");
  const afterAdd = await quantitySnapshot(page, "add", 0);
  expect(afterAdd.dom).toBe("2");
  expect(afterAdd.stateValue).toBe(2);
  expect(afterAdd.storedValue).toBe(2);
  expect(afterAdd.remaining).toBe("0");

  await pullInputs.nth(0).focus();
  await pullInputs.nth(0).fill("1");
  await pullInputs.nth(0).press("Tab");
  const afterPull = await quantitySnapshot(page, "pull", 0);
  expect(afterPull.dom).toBe("1");
  expect(afterPull.stateValue).toBe(1);
  expect(afterPull.storedValue).toBe(1);
  expect(afterPull.remaining).toBe("-1");

  const beforeClear = await quantitySnapshot(page, "send", 0);
  await firstSend.focus();
  await firstSend.fill("");
  await firstSend.press("Tab");
  const afterClear = await quantitySnapshot(page, "send", 0);
  expect(afterClear.dom).toBe("");
  expect(afterClear.stateValue).toBeNull();
  expect(afterClear.storedValue).toBeNull();
  expect(afterClear.stateHasKey).toBe(false);
  expect(afterClear.storedHasKey).toBe(false);
  expect(afterClear.history).toBe(beforeClear.history + 1);
  await page.locator("#undo").click();
  await expect(firstSend).toHaveValue("12");
  await page.locator("#redo").click();
  await expect(firstSend).toHaveValue("");
  const afterClearRedo = await quantitySnapshot(page, "send", 0);
  expect(afterClearRedo.stateHasKey).toBe(false);
  expect(afterClearRedo.storedHasKey).toBe(false);
  await expect(page.locator('[data-pick="receivers"]')).toContainText(
    fixtureMeta.receiver,
  );

  expect(runtime.errors).toEqual([]);
});

test("moves changed and unchanged quantity inputs exactly once", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);
  await chooseOnly(page, "receivers", fixtureMeta.receiver);

  const sendInputs = page.locator(
    '#table input.jdata[data-map="send"]',
  );
  const addInputs = page.locator('#table input.jdata[data-map="add"]');
  const pullInputs = page.locator('#table input.jdata[data-map="pull"]');
  expect(await sendInputs.count()).toBe(fixtureMeta.normalRows);
  expect(await addInputs.count()).toBe(fixtureMeta.normalRows);
  expect(await pullInputs.count()).toBe(fixtureMeta.normalRows);

  await sendInputs.nth(0).focus();
  const beforeSendTab = await quantitySnapshot(page, "send", 0);
  await sendInputs.nth(0).press("Tab");
  const afterSendTab = await quantitySnapshot(page, "send", 0);
  expect(afterSendTab.activeSendIndex).toBe(1);
  expect(afterSendTab.history).toBe(beforeSendTab.history);
  expect(afterSendTab.dom).toBe("");
  expect(afterSendTab.stateValue).toBeNull();
  expect(afterSendTab.storedValue).toBeNull();

  const beforeSendEnter = await quantitySnapshot(page, "send", 1);
  await sendInputs.nth(1).press("Enter");
  const afterSendEnter = await quantitySnapshot(page, "send", 1);
  expect(afterSendEnter.activeSendIndex).toBe(2);
  expect(afterSendEnter.history).toBe(beforeSendEnter.history);
  expect(afterSendEnter.stateValue).toBeNull();
  expect(afterSendEnter.storedValue).toBeNull();

  const beforeSendBack = await quantitySnapshot(page, "send", 2);
  await sendInputs.nth(2).press("Shift+Tab");
  const afterSendBack = await quantitySnapshot(page, "send", 2);
  expect(afterSendBack.activeSendIndex).toBe(1);
  expect(afterSendBack.history).toBe(beforeSendBack.history);
  expect(afterSendBack.stateValue).toBeNull();
  expect(afterSendBack.storedValue).toBeNull();

  await addInputs.nth(0).focus();
  const beforeAddTab = await quantitySnapshot(page, "add", 0);
  await addInputs.nth(0).press("Tab");
  const afterAddTab = await quantitySnapshot(page, "add", 0);
  expect(afterAddTab.activeQuantityIndex).toBe(
    beforeAddTab.activeQuantityIndex + 1,
  );
  expect(afterAddTab.activeQuantityMap).toBe("pull");
  expect(afterAddTab.history).toBe(beforeAddTab.history);
  expect(afterAddTab.stateValue).toBeNull();
  expect(afterAddTab.storedValue).toBeNull();

  await pullInputs.nth(0).focus();
  const beforePullTab = await quantitySnapshot(page, "pull", 0);
  await pullInputs.nth(0).press("Tab");
  const afterPullTab = await quantitySnapshot(page, "pull", 0);
  expect(afterPullTab.activeQuantityIndex).toBe(
    beforePullTab.activeQuantityIndex + 1,
  );
  expect(afterPullTab.activeQuantityMap).toBe("send");
  expect(afterPullTab.history).toBe(beforePullTab.history);
  expect(afterPullTab.stateValue).toBeNull();
  expect(afterPullTab.storedValue).toBeNull();

  await addInputs.nth(1).focus();
  const beforeChangedAdd = await quantitySnapshot(page, "add", 1);
  await addInputs.nth(1).fill("2");
  const duringChangedAdd = await quantitySnapshot(page, "add", 1);
  expect(duringChangedAdd.stateValue).toBe(2);
  expect(duringChangedAdd.storedValue).toBeNull();
  expect(duringChangedAdd.history).toBe(beforeChangedAdd.history + 1);
  await addInputs.nth(1).press("Tab");
  const afterChangedAdd = await quantitySnapshot(page, "add", 1);
  expect(afterChangedAdd.activeQuantityIndex).toBe(
    beforeChangedAdd.activeQuantityIndex + 1,
  );
  expect(afterChangedAdd.activeQuantityMap).toBe("pull");
  expect(afterChangedAdd.dom).toBe("2");
  expect(afterChangedAdd.stateValue).toBe(2);
  expect(afterChangedAdd.storedValue).toBe(2);
  expect(afterChangedAdd.history).toBe(duringChangedAdd.history);

  await pullInputs.nth(1).focus();
  const beforeChangedPull = await quantitySnapshot(page, "pull", 1);
  await pullInputs.nth(1).fill("1");
  const duringChangedPull = await quantitySnapshot(page, "pull", 1);
  expect(duringChangedPull.stateValue).toBe(1);
  expect(duringChangedPull.storedValue).toBeNull();
  expect(duringChangedPull.history).toBe(beforeChangedPull.history + 1);
  await pullInputs.nth(1).press("Tab");
  const afterChangedPull = await quantitySnapshot(page, "pull", 1);
  expect(afterChangedPull.activeQuantityIndex).toBe(
    beforeChangedPull.activeQuantityIndex + 1,
  );
  expect(afterChangedPull.activeQuantityMap).toBe("send");
  expect(afterChangedPull.dom).toBe("1");
  expect(afterChangedPull.stateValue).toBe(1);
  expect(afterChangedPull.storedValue).toBe(1);
  expect(afterChangedPull.history).toBe(duringChangedPull.history);

  await addInputs.nth(2).focus();
  const beforeAddEnter = await quantitySnapshot(page, "add", 2);
  await addInputs.nth(2).fill("3");
  const duringAddEnter = await quantitySnapshot(page, "add", 2);
  await addInputs.nth(2).press("Enter");
  const afterAddEnter = await quantitySnapshot(page, "add", 2);
  expect(afterAddEnter.activeQuantityIndex).toBe(
    beforeAddEnter.activeQuantityIndex + 1,
  );
  expect(afterAddEnter.dom).toBe("3");
  expect(afterAddEnter.stateValue).toBe(3);
  expect(afterAddEnter.storedValue).toBe(3);
  expect(afterAddEnter.history).toBe(duringAddEnter.history);

  await pullInputs.nth(2).focus();
  const beforePullEnter = await quantitySnapshot(page, "pull", 2);
  await pullInputs.nth(2).press("Enter");
  const afterPullEnter = await quantitySnapshot(page, "pull", 2);
  expect(afterPullEnter.activeQuantityIndex).toBe(
    beforePullEnter.activeQuantityIndex + 1,
  );
  expect(afterPullEnter.history).toBe(beforePullEnter.history);
  expect(afterPullEnter.dom).toBe("");
  expect(afterPullEnter.stateValue).toBeNull();
  expect(afterPullEnter.storedValue).toBeNull();

  await sendInputs.first().focus();
  await sendInputs.first().press("Shift+Tab");
  expect(await page.evaluate(() => document.activeElement?.id)).toBe(
    "showDetailBtn",
  );

  await sendInputs.last().focus();
  await sendInputs.last().press("Tab");
  expect(await page.evaluate(() => document.activeElement?.id)).toBe("undo");

  await pullInputs.last().focus();
  await pullInputs.last().press("Tab");
  expect(await page.evaluate(() => document.activeElement?.id)).toBe("undo");

  expect(runtime.errors).toEqual([]);
});

test("keeps the native mobile Next focus target connected after a changed send value", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);
  await chooseOnly(page, "receivers", fixtureMeta.receiver);

  const sendInputs = page.locator(
    '#table input.jdata[data-map="send"]',
  );
  const firstSend = sendInputs.nth(0);
  const baseline = await quantitySnapshot(page, "send", 0);
  await firstSend.focus();
  await firstSend.fill("7");

  const nativeNext = await firstSend.evaluate((input) => {
    const inputs = [
      ...document.querySelectorAll(
        '#table input.jdata[data-map="send"]:not(:disabled)',
      ),
    ];
    const next = inputs[inputs.indexOf(input) + 1];
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.blur();
    next.focus();
    return {
      currentConnected: input.isConnected,
      nextConnected: next.isConnected,
      nextFocused: document.activeElement === next,
      nextIndex: inputs.indexOf(document.activeElement),
    };
  });

  expect(nativeNext).toEqual({
    currentConnected: true,
    nextConnected: true,
    nextFocused: true,
    nextIndex: 1,
  });
  const committed = await quantitySnapshot(page, "send", 0);
  expect(committed.dom).toBe("7");
  expect(committed.stateValue).toBe(7);
  expect(committed.storedValue).toBe(7);
  expect(committed.history).toBe(baseline.history + 1);
  expect(committed.pending).toBe(false);
  expect(committed.doneAmount).toBe("7");
  expect(committed.activeSendIndex).toBe(1);
  expect(runtime.errors).toEqual([]);
});

test("keeps Pro quantities visible while cut-store filtering reduces the order", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.cutStoreXlsx, {
    rows: cutStoreFixtureMeta.rows,
    teleRows: 0,
  });
  await chooseOnly(page, "receivers", cutStoreFixtureMeta.receiver);

  const sendInput = page.locator(
    '#table input.jdata[data-map="send"]',
  ).first();
  await expect(sendInput).toHaveValue("");
  await expect(page.locator("#remainAmount")).toHaveText(
    String(cutStoreFixtureMeta.originalQty),
  );
  await sendInput.fill("3");
  await sendInput.press("Tab");
  const beforeFilter = await quantitySnapshot(page, "send", 0);
  expect(beforeFilter.dom).toBe("3");
  expect(beforeFilter.stateValue).toBe(3);
  expect(beforeFilter.storedValue).toBe(3);
  expect(beforeFilter.doneAmount).toBe("3");
  expect(beforeFilter.remaining).toBe("11");

  await chooseOnly(page, "orderStores", cutStoreFixtureMeta.receiver);
  const afterFilter = await quantitySnapshot(page, "send", 0);
  expect(afterFilter.key).toBe(beforeFilter.key);
  expect(afterFilter.dom).toBe("3");
  expect(afterFilter.stateValue).toBe(3);
  expect(afterFilter.storedValue).toBe(3);
  expect(afterFilter.receivers).toEqual([cutStoreFixtureMeta.receiver]);
  expect(afterFilter.doneAmount).toBe("3");
  expect(afterFilter.remaining).toBe("1");
  await expect(page.locator("#remainAmount")).toHaveText("1");
  await expect(page.locator("#table tbody tr").first()).toContainText(
    `${cutStoreFixtureMeta.filteredQty} ชิ้น · 1 ร้าน · 1 บิล`,
  );

  await page.locator("#undo").click();
  const afterUndo = await quantitySnapshot(page, "send", 0);
  expect(afterUndo.dom).toBe("3");
  expect(afterUndo.doneAmount).toBe("3");
  expect(afterUndo.remaining).toBe("11");

  await page.locator("#redo").click();
  const afterRedo = await quantitySnapshot(page, "send", 0);
  expect(afterRedo.dom).toBe("3");
  expect(afterRedo.doneAmount).toBe("3");
  expect(afterRedo.remaining).toBe("1");
  expect(runtime.errors).toEqual([]);
});

test("drops a no-op edit history entry when a quantity returns to its original value", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);
  await chooseOnly(page, "receivers", fixtureMeta.receiver);

  const sendInputs = page.locator(
    '#table input.jdata[data-map="send"]',
  );
  const firstSend = sendInputs.nth(0);
  await firstSend.focus();
  await firstSend.fill("1");
  await firstSend.press("Tab");
  const committed = await quantitySnapshot(page, "send", 0);
  expect(committed.stateValue).toBe(1);
  expect(committed.storedValue).toBe(1);

  await firstSend.focus();
  await firstSend.fill("12");
  await firstSend.fill("1");
  await firstSend.press("Tab");
  const reverted = await quantitySnapshot(page, "send", 0);
  expect(reverted.dom).toBe("1");
  expect(reverted.stateValue).toBe(1);
  expect(reverted.storedValue).toBe(1);
  expect(reverted.history).toBe(committed.history);
  expect(reverted.redo).toBe(committed.redo);
  expect(reverted.activeSendIndex).toBe(1);

  await firstSend.focus();
  await firstSend.fill("1.0");
  await firstSend.press("Tab");
  const numericEquivalent = await quantitySnapshot(page, "send", 0);
  expect(numericEquivalent.dom).toBe("1");
  expect(numericEquivalent.stateValue).toBe(1);
  expect(numericEquivalent.storedValue).toBe(1);
  expect(numericEquivalent.history).toBe(committed.history);
  expect(numericEquivalent.redo).toBe(committed.redo);

  await page.locator("#undo").click();
  const undone = await quantitySnapshot(page, "send", 0);
  expect(undone.dom).toBe("");
  expect(undone.stateValue).toBeNull();
  expect(undone.redo).toBe(1);

  await firstSend.focus();
  await firstSend.fill("2");
  await firstSend.fill("");
  await firstSend.press("Tab");
  const secondRevert = await quantitySnapshot(page, "send", 0);
  expect(secondRevert.dom).toBe("");
  expect(secondRevert.stateValue).toBeNull();
  expect(secondRevert.storedValue).toBeNull();
  expect(secondRevert.stateHasKey).toBe(false);
  expect(secondRevert.storedHasKey).toBe(false);
  expect(secondRevert.history).toBe(undone.history);
  expect(secondRevert.redo).toBe(1);

  await page.locator("#redo").click();
  const redone = await quantitySnapshot(page, "send", 0);
  expect(redone.dom).toBe("1");
  expect(redone.stateValue).toBe(1);
  expect(redone.redo).toBe(0);
  expect(runtime.errors).toEqual([]);
});

test("does not add history or clear redo when a picker is applied without changes", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);
  await chooseOnly(page, "receivers", fixtureMeta.receiver);

  const firstSend = page
    .locator('#table input.jdata[data-map="send"]')
    .first();
  await firstSend.fill("1");
  await firstSend.press("Tab");
  await page.locator("#undo").click();

  const beforeNoOp = await page.evaluate(async () => {
    const stateModule = await import("/assets/pro/state.js");
    return {
      history: stateModule.state.hist.length,
      redo: stateModule.state.redoStack.length,
      brands: [...stateModule.state.sel.brands],
    };
  });
  expect(beforeNoOp.redo).toBe(1);

  await page.locator('[data-pick="brands"]').click();
  await expect(page.locator("#pickShade")).toHaveClass(/on/);
  await page.locator("#pickOk").click();

  const afterNoOp = await page.evaluate(async () => {
    const stateModule = await import("/assets/pro/state.js");
    return {
      history: stateModule.state.hist.length,
      redo: stateModule.state.redoStack.length,
      brands: [...stateModule.state.sel.brands],
    };
  });
  expect(afterNoOp).toEqual(beforeNoOp);

  await page.locator("#redo").click();
  const redone = await quantitySnapshot(page, "send", 0);
  expect(redone.dom).toBe("1");
  expect(redone.stateValue).toBe(1);
  expect(redone.redo).toBe(0);
  expect(runtime.errors).toEqual([]);
});

test("does not add history or clear redo for no-op commands and cancelled prompts", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);
  await chooseOnly(page, "receivers", fixtureMeta.receiver);

  const firstSend = page
    .locator('#table input.jdata[data-map="send"]')
    .first();
  await firstSend.fill("1");
  await firstSend.press("Tab");
  await page.locator("#undo").click();

  const historyState = () =>
    page.evaluate(async () => {
      const stateModule = await import("/assets/pro/state.js");
      return {
        history: stateModule.state.hist.length,
        redo: stateModule.state.redoStack.length,
      };
    });
  const beforeNoOps = await historyState();
  expect(beforeNoOps.redo).toBe(1);

  await page.locator(".tabs .tab").first().click();
  await page.locator("#searchBtn").click();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.locator("#displayBtn").click();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.locator("#insertBtn").click();

  expect(await historyState()).toEqual(beforeNoOps);
  await page.locator("#redo").click();
  await expect(firstSend).toHaveValue("1");
  expect(runtime.errors).toEqual([]);
});

test("validates page size without corrupting pagination", async ({ page }) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);

  const pageState = () =>
    page.evaluate(async () => {
      const stateModule = await import("/assets/pro/state.js");
      return {
        pageSize: stateModule.state.pageSize,
        history: stateModule.state.hist.length,
      };
    });
  const baseline = await pageState();

  page.once("dialog", (dialog) => dialog.accept("-1"));
  await page.locator("#displayBtn").click();
  await expect(page.locator("#msg")).toContainText(
    "จำนวนแถวต้องเป็นเลขจำนวนเต็ม",
  );
  expect(await pageState()).toEqual(baseline);

  page.once("dialog", (dialog) => dialog.accept("201"));
  await page.locator("#displayBtn").click();
  expect(await pageState()).toEqual(baseline);

  page.once("dialog", (dialog) => dialog.accept("12"));
  await page.locator("#displayBtn").click();
  const changed = await pageState();
  expect(changed.pageSize).toBe(12);
  expect(changed.history).toBe(baseline.history + 1);
  await expect(page.locator("#table tbody tr[data-pool-key]")).toHaveCount(12);
  expect(runtime.errors).toEqual([]);
});

test("reports LocalStorage failures without page errors", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);

  await page.evaluate(() => {
    const originalSetItem = Storage.prototype.setItem;
    window.__restoreStorageSetItem = () => {
      Storage.prototype.setItem = originalSetItem;
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("fixture quota", "QuotaExceededError");
    };
  });
  await page.locator("#autosaveBtn").click();
  await expect(page.locator("#msg")).toContainText("บันทึกไม่สำเร็จ");
  await expect(page.locator("#msg")).toContainText("fixture quota");
  await page.evaluate(() => window.__restoreStorageSetItem());
  expect(runtime.errors).toEqual([]);
});

test("keeps the directly tapped quantity focused without replacing the table", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);
  await chooseOnly(page, "receivers", fixtureMeta.receiver);

  const sendInputs = page.locator(
    '#table input.jdata[data-map="send"]',
  );
  const addInputs = page.locator('#table input.jdata[data-map="add"]');
  const pullInputs = page.locator('#table input.jdata[data-map="pull"]');

  const firstSend = sendInputs.nth(0);
  await firstSend.focus();
  const beforeSend = await quantitySnapshot(page, "send", 0);
  await firstSend.fill("1");
  const addBox = await addInputs.nth(0).boundingBox();
  expect(addBox).not.toBeNull();
  await page.mouse.click(
    addBox.x + addBox.width / 2,
    addBox.y + addBox.height / 2,
  );
  await expect
    .poll(() =>
      page.evaluate(() => ({
        map: document.activeElement?.dataset?.map || "",
        key: document.activeElement?.dataset?.k || "",
      })),
    )
    .toEqual({
      map: "add",
      key: await addInputs.nth(0).getAttribute("data-k"),
    });
  const afterSend = await quantitySnapshot(page, "send", 0);
  expect(afterSend.stateValue).toBe(1);
  expect(afterSend.storedValue).toBe(1);
  expect(afterSend.history).toBe(beforeSend.history + 1);

  const firstAdd = addInputs.nth(0);
  await firstAdd.fill("2");
  const pullBox = await pullInputs.nth(0).boundingBox();
  expect(pullBox).not.toBeNull();
  await page.mouse.click(
    pullBox.x + pullBox.width / 2,
    pullBox.y + pullBox.height / 2,
  );
  await expect
    .poll(() =>
      page.evaluate(() => ({
        map: document.activeElement?.dataset?.map || "",
        key: document.activeElement?.dataset?.k || "",
      })),
    )
    .toEqual({
      map: "pull",
      key: await pullInputs.nth(0).getAttribute("data-k"),
    });
  const afterAdd = await quantitySnapshot(page, "add", 0);
  expect(afterAdd.stateValue).toBe(2);
  expect(afterAdd.storedValue).toBe(2);
  expect(runtime.errors).toEqual([]);
});

test("flushes a focused quantity before autosave and state-changing commands", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);
  await chooseOnly(page, "receivers", fixtureMeta.receiver);

  const sendInputs = page.locator(
    '#table input.jdata[data-map="send"]',
  );
  expect(await sendInputs.count()).toBe(fixtureMeta.normalRows);
  const firstSend = sendInputs.nth(0);
  await firstSend.focus();
  await firstSend.fill("1");
  const focused = await quantitySnapshot(page, "send", 0);
  expect(focused.stateValue).toBe(1);
  expect(focused.storedValue).toBeNull();
  expect(focused.pending).toBe(true);

  await page.evaluate(() => document.querySelector("#autosaveBtn").click());
  const afterAutosave = await quantitySnapshot(page, "send", 0);
  expect(afterAutosave.stateValue).toBe(1);
  expect(afterAutosave.storedValue).toBe(1);
  expect(afterAutosave.receivers).toEqual([fixtureMeta.receiver]);
  expect(afterAutosave.storedReceivers).toEqual([fixtureMeta.receiver]);
  expect(afterAutosave.pending).toBe(false);
  expect(afterAutosave.history).toBe(focused.history);

  await page.evaluate(() => document.querySelector("#undo").click());
  const afterUndo = await quantitySnapshot(page, "send", 0);
  expect(afterUndo.dom).toBe("");
  expect(afterUndo.stateValue).toBeNull();
  expect(afterUndo.receivers).toEqual([fixtureMeta.receiver]);
  expect(afterUndo.redo).toBe(1);

  await page.evaluate(() => document.querySelector("#redo").click());
  const afterRedo = await quantitySnapshot(page, "send", 0);
  expect(afterRedo.dom).toBe("1");
  expect(afterRedo.stateValue).toBe(1);
  expect(afterRedo.receivers).toEqual([fixtureMeta.receiver]);
  expect(afterRedo.redo).toBe(0);

  await page.reload();
  await expect(page.locator("#devTeamModal")).toHaveClass(/on/);
  await page.locator("#devTeamModal .devClose").click();
  await loadFixture(page, fixtureFiles.xlsx);
  const afterReload = await quantitySnapshot(page, "send", 0);
  expect(afterReload.dom).toBe("1");
  expect(afterReload.stateValue).toBe(1);
  expect(afterReload.storedValue).toBe(1);
  expect(afterReload.receivers).toEqual([fixtureMeta.receiver]);
  expect(afterReload.storageKey).toBe(
    "doit-core-unified-v1:pro-browser-fixture.xlsx",
  );

  const secondSend = sendInputs.nth(1);
  await secondSend.focus();
  await secondSend.fill("2");
  const beforeMode = await quantitySnapshot(page, "send", 1);
  await page.evaluate(() => {
    const tab = [...document.querySelectorAll(".tab")].find(
      (button) => button.textContent.trim() === "กระจายสินค้า",
    );
    tab.click();
  });
  const inMode = await quantityByKey(page, "send", beforeMode.key);
  expect(inMode.stateValue).toBe(2);
  expect(inMode.storedValue).toBe(2);
  expect(inMode.pending).toBe(false);
  expect(inMode.mode).toBe("dist");
  await page.evaluate(() => {
    const tab = [...document.querySelectorAll(".tab")].find(
      (button) => button.textContent.trim() === "ถอดของ Pro",
    );
    tab.click();
  });
  await expect(secondSend).toHaveValue("2");

  page.once("dialog", (dialog) => dialog.accept("1"));
  await page.locator("#displayBtn").click();
  await expect(page.locator("#pager")).toContainText("1/");
  const beforePage = await quantitySnapshot(page, "send", 0);
  await firstSend.focus();
  await firstSend.fill("5");
  await page.evaluate(() =>
    document.querySelector('[data-p="2"]').click(),
  );
  const pageTwo = await quantityByKey(page, "send", beforePage.key);
  expect(pageTwo.stateValue).toBe(5);
  expect(pageTwo.storedValue).toBe(5);
  expect(pageTwo.pending).toBe(false);
  expect(pageTwo.page).toBe(2);
  await page.evaluate(() =>
    document.querySelector('[data-p="1"]').click(),
  );
  await expect(firstSend).toHaveValue("5");

  await firstSend.focus();
  await firstSend.fill("6");
  const beforeFilter = await quantitySnapshot(page, "send", 0);
  await page.evaluate(() =>
    document.querySelector('[data-pick="brands"]').click(),
  );
  const afterFilter = await quantityByKey(page, "send", beforeFilter.key);
  expect(afterFilter.stateValue).toBe(6);
  expect(afterFilter.storedValue).toBe(6);
  expect(afterFilter.pending).toBe(false);
  await expect(page.locator("#pickShade")).toHaveClass(/on/);
  await page.locator("#pickClose").click();

  await firstSend.fill("7");
  const beforeSearch = await quantitySnapshot(page, "send", 0);
  await page.evaluate(() => {
    document.querySelector("#q").value = "SKU-001";
    document.querySelector("#searchBtn").click();
  });
  const afterSearch = await quantityByKey(page, "send", beforeSearch.key);
  expect(afterSearch.stateValue).toBe(7);
  expect(afterSearch.storedValue).toBe(7);
  expect(afterSearch.pending).toBe(false);
  await expect(firstSend).toHaveValue("7");
  await expect(page.locator("#table")).toContainText("สินค้า Fixture 001");

  expect(runtime.errors).toEqual([]);
});

test("keeps the browser history at 80 entries and 2 MiB", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);
  const stats = await page.evaluate(async () => {
    const stateModule = await import("/assets/pro/state.js");
    stateModule.state.hist = [];
    stateModule.state.redoStack = [];
    stateModule.state.sel.billStores = Array.from(
      { length: 7106 },
      (_, index) => `ร้าน ${index}`,
    );
    for (let index = 0; index < 100; index += 1) {
      stateModule.state.q = `history-${index}`;
      stateModule.push();
    }
    for (let index = 0; index < 20; index += 1) {
      stateModule.state.q = `${index}:${"x".repeat(300_000)}`;
      stateModule.push();
    }
    return stateModule.historyStats();
  });
  expect(stats.historyEntries).toBeLessThanOrEqual(80);
  expect(stats.totalBytes).toBeLessThanOrEqual(2 * 1024 * 1024);
  expect(stats.historyEntries).toBeGreaterThan(0);
  expect(runtime.errors).toEqual([]);
});

test("combines PS and Telesale in the real Combined Order tab for XLSX and XLSM", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  for (const file of [fixtureFiles.xlsx, fixtureFiles.xlsm]) {
    await loadFixture(page, file);
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

test("searches Telesale drawer by product while preserving the full bill", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);

  await page.locator("#q").fill("TSKU-001");
  await page.locator("#searchBtn").click();
  await page.locator("#teleBtn").click();
  await expect(page.locator("#teleDrawer")).toHaveClass(/on/);
  await expect(page.locator("#drawerBody .teleBill")).toHaveCount(1);
  await expect(page.locator("#drawerBody")).toContainText(
    "สินค้า Telesale 001",
  );
  await expect(page.locator("#drawerBody")).toContainText(
    fixtureMeta.numericProductName,
  );
  await expect(page.locator("#teleBtn")).toContainText("(1)");

  await page.locator("#closeDrawer").click();
  await page.locator("#q").fill(fixtureMeta.realTsStore);
  await page.locator("#searchBtn").click();
  await page.locator("#teleBtn").click();
  await expect(page.locator("#drawerBody .teleBill")).toHaveCount(2);
  expect(runtime.errors).toEqual([]);
});

test("paginates Combined Order while printing every filtered product", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);
  await page.evaluate(async () => {
    const stateModule = await import("/assets/pro/state.js");
    stateModule.state.pageSize = 10;
    stateModule.state.page = 1;
  });
  await openOrderMode(page);
  const productRows = page.locator(
    "#table tbody tr:not(.nativeOrderTotal)",
  );
  await expect(productRows).toHaveCount(10);
  await expect(page.locator("#pager")).toContainText("1/5");
  const firstPageProduct = await productRows
    .first()
    .locator("[data-print-value]")
    .getAttribute("data-print-value");

  await page.locator('#pager [data-p="2"]').click();
  await expect(page.locator("#pager")).toContainText("2/5");
  await expect(productRows).toHaveCount(10);
  expect(
    await productRows
      .first()
      .locator("[data-print-value]")
      .getAttribute("data-print-value"),
  ).not.toBe(firstPageProduct);

  await page.locator("#prepPrint").click();
  const overlay = page.locator(".printOverlay.orderPrint");
  await expect(overlay).toBeVisible();
  await expect(
    overlay.locator(".receiptTable tbody tr:not(.totalRow)"),
  ).toHaveCount(fixtureMeta.orderGroups);
  await expect(overlay).toContainText("สินค้า Telesale 001");
  await expect(overlay).toContainText(fixtureMeta.numericProductName);
  await overlay.locator("[data-print-close]").click();
  expect(runtime.errors).toEqual([]);
});

test("restores Pro filters and quantities after Real Bill search", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);
  await chooseOnly(page, "receivers", fixtureMeta.receiver);
  await chooseOnly(page, "brands", "Fixture Brand");
  const firstSend = page
    .locator('#table input.jdata[data-map="send"]')
    .first();
  await firstSend.fill("1");
  await firstSend.press("Tab");
  const originalAmount = await page.locator("#amount").textContent();
  const originalCount = await page.locator("#tableCount").textContent();

  await page.locator(".tabs .tab").nth(2).click();
  await page.locator("#clearFilter").click();
  await page.locator("#q").fill(fixtureMeta.realTsStore);
  await page.locator("#searchBtn").click();
  await expect(page.locator("#realBills .realBill")).toHaveCount(2);

  await page.locator(".tabs .tab").first().click();
  await expect(page.locator("#q")).toHaveValue("");
  await expect(page.locator('[data-pick="brands"]')).toContainText(
    "Fixture Brand",
  );
  await expect(page.locator('[data-pick="receivers"]')).toContainText(
    fixtureMeta.receiver,
  );
  await expect(page.locator("#tableCount")).toHaveText(originalCount);
  await expect(page.locator("#amount")).toHaveText(originalAmount);
  await expect(
    page.locator('#table input.jdata[data-map="send"]').first(),
  ).toHaveValue("1");

  await page.locator(".tabs .tab").nth(2).click();
  await expect(page.locator("#q")).toHaveValue(fixtureMeta.realTsStore);
  await expect(page.locator("#realBills .realBill")).toHaveCount(2);
  expect(runtime.errors).toEqual([]);
});

test("shows and prints real PS and Telesale bills without changing send-to-store state", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  for (const file of [fixtureFiles.xlsx, fixtureFiles.xlsm]) {
    await loadFixture(page, file);
    await expect(page.locator("#tableCount")).toHaveText(
      `ถอดของ Pro ${fixtureMeta.normalRows.toLocaleString("th-TH")} รายการ`,
    );
    await chooseOnly(page, "dates", fixtureMeta.date);
    await chooseOnly(page, "ps", fixtureMeta.ps);
    await chooseOnly(page, "receivers", fixtureMeta.receiver);
    const legacyAmount = await page.locator("#amount").textContent();
    await expect(page.locator(".summaryHead")).toBeVisible();
    await expect(page.locator(".summary")).toBeVisible();

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
    await expect(page.locator(".summaryHead")).toBeHidden();
    await expect(page.locator(".summary")).toBeHidden();
    await expect(page.locator("#amount")).toBeHidden();
    await expect(page.locator("#table")).toBeHidden();
    await expect(page.locator("#pager")).toBeHidden();
    for (const [kind, expectedText] of [
      ["ps", fixtureMeta.ps],
      ["orderStores", fixtureMeta.receiver],
      ["brands", "Fixture Brand"],
      ["types", "INVC"],
    ]) {
      await page.locator(`[data-pick="${kind}"]`).click();
      await expect(
        page.locator("#pickList .pickItem", { hasText: expectedText }).first(),
      ).toBeVisible();
      const visibleTexts = await page
        .locator("#pickList .pickItem")
        .allTextContents();
      expect(visibleTexts.some((text) => text.includes(expectedText))).toBe(
        true,
      );
      expect(
        visibleTexts.every((text, index) => text.trim() !== String(index)),
      ).toBe(true);
      await page.locator("#pickClose").click();
    }

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
    expect(
      await page
        .locator(".realBillTableWrap")
        .first()
        .evaluate((element) => getComputedStyle(element).overflowX),
    ).toBe("auto");
    await page.locator('[data-real-page="2"]').click();
    await expect(page.locator("#realBills .realBill")).toHaveCount(5);
    const psSharedInvoice = page.locator(
      `.realBill[data-real-source="PS"][data-real-store="${fixtureMeta.realPsTsStore}"][data-real-inv="${fixtureMeta.realBulkInvoice}"]`,
    );
    await expect(psSharedInvoice).toHaveCount(1);
    await expect(psSharedInvoice).toContainText("15/07/2026");
    await expect(psSharedInvoice.locator("tbody tr:not(.realBillTotal)")).toHaveCount(
      13,
    );
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
    await page.locator('[data-pick="brands"]').click();
    await expect(page.locator("#pickList .pickItem")).toHaveCount(1);
    await expect(
      page.locator('.pickItem[data-v="Fixture Tele Brand"]'),
    ).toBeVisible();
    await page.locator("#pickClose").click();
    await page.locator('[data-pick="receivers"]').click();
    await expect(page.locator("#pickList .pickItem")).toHaveCount(1);
    await expect(
      page.locator(
        `.pickItem[data-v="${fixtureMeta.realTsStore}"]`,
      ),
    ).toContainText("(TS)");
    await page.locator("#pickClose").click();
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
    await page.evaluate(() => document.querySelector("#prepPrint").click());
    await expect(page.locator(".printOverlay.realBillPrint")).toHaveCount(1);
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
    await page.emulateMedia({ media: "print" });
    await expect(overlay).toBeVisible();
    await expect(overlay.locator(".realBillReceipt")).toHaveCount(3);
    await expect(overlay.locator(".realBillReceipt").first()).toBeVisible();
    await expect(
      overlay.locator(".realBillReceipt").first().locator("[data-real-line]"),
    ).toHaveCount(12);
    await expect(
      overlay.locator(".realBillReceipt").nth(1).locator("[data-real-line]"),
    ).toHaveCount(1);
    await expect(overlay.locator('[data-real-part="2/2"]')).toContainText(
      "1,391.00",
    );
    await page.emulateMedia({ media: "screen" });
    expect(
      await page.evaluate(() =>
        localStorage.getItem("doit-pro-print-price-edits-v1"),
      ),
    ).toBe(printEditBefore);
    await overlay.locator("[data-print-close]").click();

    await page.locator("#q").fill("");
    await page.locator("#searchBtn").click();
    await page.locator(".tabs .tab").first().click();
    await expect(page.locator(".summaryHead")).toBeVisible();
    await expect(page.locator(".summary")).toBeVisible();
    await expect(page.locator("#pager")).toBeVisible();
    await expect(page.locator("#tableCount")).toHaveText(
      `ถอดของ Pro ${fixtureMeta.normalRows.toLocaleString("th-TH")} รายการ`,
    );
    await expect(page.locator("#amount")).toHaveText(legacyAmount || "");
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
    await expect(
      page.locator('.pickItem[data-v="Fixture Tele Brand"]'),
    ).toHaveCount(0);
    expect(
      await page.evaluate(() =>
        window.DOIT_CORE_APP.currentState().sel.brands.includes(
          "Fixture Tele Brand",
        ),
      ),
    ).toBe(false);
    await page.locator("#pickAll").click();
    expect(
      await page.evaluate(() =>
        window.DOIT_CORE_APP.currentState().sel.brands.includes(
          "Fixture Tele Brand",
        ),
      ),
    ).toBe(false);
    await page.locator("#pickClear").click();
    await page.locator("#pickOk").click();
    selectedState = await page.evaluate(() =>
      window.DOIT_CORE_APP.currentState(),
    );
    expect(selectedState.sel.brands).toEqual([]);
    expect(selectedState.sel.receivers).toEqual([fixtureMeta.receiver]);
    await realBillTab.click();
    selectedState = await page.evaluate(() =>
      window.DOIT_CORE_APP.currentState(),
    );
    expect(selectedState.sel.brands).toEqual(["Fixture Tele Brand"]);

    await page.locator("#q").fill("");
    await page.locator("#searchBtn").click();
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
  await loadFixture(page, fixtureFiles.largeXlsx, {
    rows: fixtureMeta.largeRows,
    teleRows: fixtureMeta.largeTeleRows,
  });

  const beforeTab = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  const tabTiming = await activateRealBillTabMeasured(page);
  await expect(page.locator("#modeHeading")).toHaveText("บิลจริง");
  await expect(page.locator("#realBills")).toContainText(
    "เลือกร้านหรือพิมพ์ชื่อร้าน เพื่อดูบิลจริง",
  );
  const tabElapsed = tabTiming.eventHandlerMs;
  expect(tabElapsed).toBeLessThan(500);
  expect(tabTiming.lastFullRenderMs).toBeLessThan(500);
  expect(tabTiming.mode).toBe("ship");
  let metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.candidateBuilds).toBe(0);
  expect(metrics.renderedBills).toBe(0);
  expect(metrics.pickPoolCalls).toBe(beforeTab.pickPoolCalls);
  expect(metrics.groupCalls).toBe(beforeTab.groupCalls);
  expect(metrics.summaryBuilds).toBe(beforeTab.summaryBuilds);
  expect(metrics.telesaleModelBuilds).toBe(
    beforeTab.telesaleModelBuilds,
  );
  expect(metrics.telesaleDrawerRenders).toBe(
    beforeTab.telesaleDrawerRenders,
  );
  expect(metrics.lastFullRenderMs).toBeLessThan(500);

  const popupStart = Date.now();
  await page.locator('[data-pick="receivers"]').click();
  await expect(page.locator("#pickShade")).toHaveClass(/on/);
  await expect(page.locator("#pickList .pickItem")).toHaveCount(
    fixtureMeta.largeStores,
  );
  const coldPopupElapsed = Date.now() - popupStart;
  expect(coldPopupElapsed).toBeLessThan(1500);
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  const pickerOptionsCalls = metrics.pickerOptionsCalls;
  const pickerListRenders = metrics.pickerListRenders;
  const pickerOptionsBuilds = metrics.pickerOptionsBuilds;
  expect(pickerOptionsCalls).toBe(1);
  expect(pickerListRenders).toBe(1);
  expect(pickerOptionsBuilds).toBe(1);
  expect(metrics.candidateBuilds).toBe(0);
  expect(metrics.facetIndexBuilds).toBe(1);
  expect(metrics.moneyFormatCalls).toBe(0);

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

  await page.locator("#pickClose").click();
  const cachedPopupStart = Date.now();
  await page.locator('[data-pick="receivers"]').click();
  await expect(page.locator("#pickList .pickItem")).toHaveCount(
    fixtureMeta.largeStores,
  );
  const cachedPopupElapsed = Date.now() - cachedPopupStart;
  expect(cachedPopupElapsed).toBeLessThan(500);
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.candidateBuilds).toBe(0);
  expect(metrics.pickerOptionsBuilds).toBe(pickerOptionsBuilds);
  expect(metrics.pickerOptionsCacheHits).toBeGreaterThanOrEqual(1);
  const cachedPickerOptionsCalls = metrics.pickerOptionsCalls;
  const cachedPickerListRenders = metrics.pickerListRenders;
  expect(cachedPickerOptionsCalls).toBe(pickerOptionsCalls + 1);
  expect(cachedPickerListRenders).toBe(pickerListRenders + 1);
  const selectAllElapsed = await page.evaluate(() => {
    const started = performance.now();
    document.querySelector("#pickAll").click();
    return performance.now() - started;
  });
  expect(selectAllElapsed).toBeLessThan(100);
  await expect(page.locator("#pickList .pickItem.on")).toHaveCount(
    fixtureMeta.largeStores,
  );
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.pickerOptionsCalls).toBe(cachedPickerOptionsCalls);
  expect(metrics.pickerListRenders).toBe(cachedPickerListRenders);

  const applyStart = Date.now();
  await page.locator("#pickOk").click();
  await expect(page.locator("#tableCount")).toContainText(
    `${fixtureMeta.largeBills} บิล`,
  );
  await expect(page.locator("#realBills .realBill")).toHaveCount(12);
  const applyElapsed = Date.now() - applyStart;
  expect(applyElapsed).toBeLessThan(1500);
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

  const beforePage = metrics;
  const pageStart = Date.now();
  await page.locator('[data-real-page="2"]').click();
  await expect(page.locator(".realBillPager")).toContainText("หน้า 2/");
  await expect(page.locator("#realBills .realBill")).toHaveCount(12);
  const pageElapsed = Date.now() - pageStart;
  expect(pageElapsed).toBeLessThan(500);
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.fullRenderCalls).toBe(beforePage.fullRenderCalls);
  expect(metrics.candidateBuilds).toBe(beforePage.candidateBuilds);
  expect(metrics.groupCalls).toBe(beforePage.groupCalls);
  expect(metrics.realBillPageRenders).toBe(
    beforePage.realBillPageRenders + 1,
  );
  await page.locator("#undo").click();
  await expect(page.locator("#realBills")).toContainText(
    "เลือกร้านหรือพิมพ์ชื่อร้าน เพื่อดูบิลจริง",
  );
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.page).toBe(1);
  await page.locator("#redo").click();
  await expect(page.locator("#tableCount")).toContainText(
    `${fixtureMeta.largeBills} บิล`,
  );
  await expect(page.locator("#realBills .realBill")).toHaveCount(12);
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.page).toBe(1);
  expect(metrics.candidateBuilds).toBe(1);

  await page.locator('[data-pick="receivers"]').click();
  await page.locator("#pickClear").click();
  await page.locator("#pickOk").click();
  const crossFilterStart = Date.now();
  await chooseOnly(page, "brands", "PERF-BRAND-0");
  await chooseOnly(page, "types", "PERF-TYPE-4");
  await page.locator('[data-pick="receivers"]').click();
  await page.locator("#pickAll").click();
  await page.locator("#pickOk").click();
  await expect(page.locator("#realBills .realBill").first()).toBeVisible();
  const crossFilterElapsed = Date.now() - crossFilterStart;
  expect(crossFilterElapsed).toBeLessThan(2500);
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

  const searchStart = Date.now();
  await page.locator("#q").fill("  perf-inv-0000  ");
  await page.locator("#searchBtn").click();
  await expect(page.locator("#tableCount")).toContainText("1 บิล");
  const searchElapsed = Date.now() - searchStart;
  expect(searchElapsed).toBeLessThan(1500);
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.candidateBuilds).toBe(1);
  await page.locator('[data-pick="brands"]').click();
  await expect(page.locator("#pickList .pickItem")).toHaveCount(5);
  await page.locator("#pickClose").click();

  await page.locator("#q").fill("");
  await page.locator("#searchBtn").click();
  const beforeDrawer = metrics;
  const drawerStart = Date.now();
  await page.locator("#teleBtn").click();
  await expect(page.locator("#teleDrawer")).toHaveClass(/on/);
  await expect(page.locator("#drawerBody .teleBill")).toHaveCount(20);
  const drawerElapsed = Date.now() - drawerStart;
  expect(drawerElapsed).toBeLessThan(500);
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.telesaleModelBuilds).toBe(
    beforeDrawer.telesaleModelBuilds + 1,
  );
  expect(metrics.telesaleDrawerRenders).toBe(
    beforeDrawer.telesaleDrawerRenders + 1,
  );
  await page.locator('[data-tele-page="2"]').click();
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.telesaleModelBuilds).toBe(
    beforeDrawer.telesaleModelBuilds + 1,
  );
  expect(metrics.telesaleDrawerRenders).toBe(
    beforeDrawer.telesaleDrawerRenders + 2,
  );
  await page.locator("#closeDrawer").click();

  console.log("Real Bill browser performance:", {
    viewport: page.viewportSize(),
    rows: fixtureMeta.largeRows,
    bills: fixtureMeta.largeBills,
    tabElapsed,
    coldPopupElapsed,
    cachedPopupElapsed,
    toggleElapsed: toggleResult.elapsed,
    selectAllElapsed,
    applyElapsed,
    crossFilterElapsed,
    searchElapsed,
    pageElapsed,
    drawerElapsed,
    metrics,
  });

  expect(
    runtime.requests
      .map(requestBasename)
      .filter((name) => forbiddenRequestNames.includes(name)),
  ).toEqual([]);
  expect(runtime.errors).toEqual([]);
});

test("bounds the production-scale store picker and keeps whole-set actions", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  const rowCount = 93_328;
  const storeCount = 7_106;
  await page.evaluate(({ rows: count, stores }) => {
    const data = Array.from({ length: count }, (_, index) => ({
      InvoiceDate: "2026-07-25",
      InvoiceNo: `SCALE-INV-${String(index).padStart(5, "0")}`,
      SOTypeID: "INVC",
      SO_SalespersonID: `PS-${String(index % 28).padStart(2, "0")}`,
      TelesaleID:
        index < 1_397 ? `TELE-${String(index).padStart(4, "0")}` : "",
      CustomerName: `ร้าน Scale ${String(index % stores).padStart(4, "0")}`,
      SKUCode: `SCALE-${index}`,
      SKUDescription: `สินค้า Scale ${index}`,
      GroupBrand: `BRAND-${index % 16}`,
      TAS_SizeGroup: `TYPE-${index % 9}`,
      ShipQtyPCS: 1,
      LineAmtBeforeDisc: 10.005,
      InvoiceAmt: 9.005,
    }));
    window.DOIT_CORE_APP.load(data, {
      file_name: "synthetic-production-scale.xlsx",
      id: "synthetic-production-scale",
    });
  }, { rows: rowCount, stores: storeCount });
  await expect(page.locator("#msg")).toContainText("โหลดสำเร็จ 93,328 แถว");
  const tabTiming = await activateRealBillTabMeasured(page);
  await expect(page.locator("#realBills")).toContainText(
    "เลือกร้านหรือพิมพ์ชื่อร้าน เพื่อดูบิลจริง",
  );
  const tabElapsed = tabTiming.eventHandlerMs;
  expect(tabElapsed).toBeLessThan(500);
  expect(tabTiming.lastFullRenderMs).toBeLessThan(500);
  expect(tabTiming.mode).toBe("ship");
  const beforePopup = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(beforePopup.fullBillBuilds).toBe(0);
  const popupStart = Date.now();
  await page.locator('[data-pick="receivers"]').click();
  await expect(page.locator("#pickList .pickItem")).toHaveCount(120);
  await expect(page.locator(".realBillPickerPager")).toContainText(
    "7,106 รายการ",
  );
  const coldPopupElapsed = Date.now() - popupStart;
  const firstPageValue = await page
    .locator("#pickList .pickItem")
    .first()
    .getAttribute("data-v");
  await page.locator('[data-picker-page="2"]').click();
  await expect(page.locator("#pickList .pickItem")).toHaveCount(120);
  expect(
    await page.locator("#pickList .pickItem").first().getAttribute("data-v"),
  ).not.toBe(firstPageValue);
  const toggle = await page.evaluate(() => {
    const list = document.querySelector("#pickList");
    const item = list.querySelector(".pickItem");
    const started = performance.now();
    item.click();
    return {
      elapsed: performance.now() - started,
      sameNode: item === list.querySelector(".pickItem"),
      visibleItems: list.querySelectorAll(".pickItem").length,
    };
  });
  expect(toggle.elapsed).toBeLessThan(100);
  expect(toggle.sameNode).toBe(true);
  expect(toggle.visibleItems).toBe(120);
  await page.locator("#pickClose").click();
  await page.locator('[data-pick="receivers"]').click();
  const selectAllStart = Date.now();
  await page.locator("#pickAll").click();
  const selectAllElapsed = Date.now() - selectAllStart;
  const applyStart = Date.now();
  await page.locator("#pickOk").click();
  await expect(page.locator("#realBills .realBill")).toHaveCount(12);
  const applyElapsed = Date.now() - applyStart;
  expect(applyElapsed).toBeLessThan(1500);
  expect(
    await page.evaluate(
      () => window.DOIT_CORE_APP.currentState().sel.billStores.length,
    ),
  ).toBe(storeCount);
  let metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.pickerDomMax).toBeLessThanOrEqual(120);
  expect(metrics.candidateBuilds).toBe(1);
  expect(metrics.moneyFormatCalls).toBe(0);
  expect(metrics.facetIndexBuilds).toBe(1);
  expect(metrics.matchedLightBills).toBe(rowCount);
  expect(metrics.fullBillRowsBuilt).toBe(12);
  expect(metrics.fullBillPageBuilds).toBe(1);
  expect(metrics.fullBillPrintBuilds).toBe(0);
  expect(metrics.facetIndexCacheValues).toBeLessThanOrEqual(20_000);
  expect(metrics.optionCacheValues).toBeLessThanOrEqual(20_000);
  expect(metrics.pickerToggleDomScans).toBeLessThan(storeCount);
  expect(metrics.pickPoolCalls).toBe(beforePopup.pickPoolCalls);
  expect(metrics.groupCalls).toBe(beforePopup.groupCalls);
  const historyHealth = await page.evaluate(
    () => window.DOIT_CORE_APP.health().history,
  );
  expect(historyHealth.totalBytes).toBeLessThanOrEqual(2 * 1024 * 1024);
  expect(historyHealth.historyEntries).toBeLessThanOrEqual(80);

  const beforePage = metrics;
  const pageStart = Date.now();
  await page.locator('[data-real-page="2"]').click();
  await expect(page.locator(".realBillPager")).toContainText("หน้า 2/");
  await expect(page.locator("#realBills .realBill")).toHaveCount(12);
  const pageElapsed = Date.now() - pageStart;
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.candidateBuilds).toBe(beforePage.candidateBuilds);
  expect(metrics.fullBillPageBuilds).toBe(
    beforePage.fullBillPageBuilds + 1,
  );
  expect(metrics.fullBillRowsBuilt).toBe(
    beforePage.fullBillRowsBuilt + 12,
  );

  await page.evaluate(() => {
    window.__realBillPrintCalls = 0;
    window.print = () => {
      window.__realBillPrintCalls += 1;
    };
  });
  let printLimitMessage = "";
  page.once("dialog", async (dialog) => {
    printLimitMessage = dialog.message();
    await dialog.accept();
  });
  const printStart = Date.now();
  await page.locator("#prepPrint").click();
  const printPreflightElapsed = Date.now() - printStart;
  expect(printLimitMessage).toContain(
    "มีบิลสำหรับปริ้นมากเกินไป",
  );
  expect(printLimitMessage).toContain("200 ส่วน");
  expect(printLimitMessage).toContain("100 หน้า A4");
  await expect(page.locator(".printOverlay.realBillPrint")).toHaveCount(0);
  expect(
    await page.evaluate(() => window.__realBillPrintCalls),
  ).toBe(0);
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.fullBillPrintBuilds).toBe(0);

  await page.locator('[data-pick="receivers"]').click();
  await page.locator("#pickClear").click();
  await page.locator("#pickOk").click();
  await expect(page.locator("#realBills")).toContainText(
    "เลือกร้านหรือพิมพ์ชื่อร้าน เพื่อดูบิลจริง",
  );
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.pickerDomMax).toBeLessThanOrEqual(120);
  console.log("7,106-store Real Bill apply:", {
    rows: rowCount,
    tabElapsed,
    coldPopupElapsed,
    selectAllElapsed,
    applyElapsed,
    pageElapsed,
    printPreflightElapsed,
    bills: rowCount,
    renderedBills: metrics.renderedBills,
    fullBillBuilds: metrics.fullBillBuilds,
    candidateBuilds: metrics.candidateBuilds,
  });
  expect(runtime.errors).toEqual([]);
});

test("cancels stale real-bill picker work without applying partial options", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);
  await page.locator(".tabs .tab").nth(2).click();
  const baseline = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );

  const loadingState = await page.evaluate(() => {
    document.querySelector('[data-pick="receivers"]').click();
    const pending = {
      okDisabled: document.querySelector("#pickOk").disabled,
      allDisabled: document.querySelector("#pickAll").disabled,
    };
    document.querySelector("#pickAll").click();
    document.querySelector("#pickOk").click();
    const billStores = [
      ...window.DOIT_CORE_APP.currentState().sel.billStores,
    ];
    document.querySelector("#pickClose").click();
    return { ...pending, billStores };
  });
  expect(loadingState).toEqual({
    okDisabled: true,
    allDisabled: true,
    billStores: [],
  });
  await settleAnimationFrames(page);
  let metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.pickerListRenders).toBe(baseline.pickerListRenders);
  expect(metrics.candidateBuilds).toBe(baseline.candidateBuilds);

  await page.evaluate(() => {
    document.querySelector('[data-pick="dates"]').click();
    document.querySelector('[data-pick="ps"]').click();
  });
  await expect(page.locator("#pickTitle")).toHaveText("PS");
  await expect(page.locator("#pickList .pickItem")).toHaveCount(1);
  await settleAnimationFrames(page);
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.pickerListRenders).toBe(
    baseline.pickerListRenders + 1,
  );
  await page.locator("#pickClose").click();

  await page.evaluate(() => {
    document.querySelector('[data-pick="brands"]').click();
    document.querySelector("#clearFilter").click();
  });
  await settleAnimationFrames(page);
  await expect(page.locator("#pickShade")).not.toHaveClass(/on/);

  await page.evaluate(() => {
    document.querySelector('[data-pick="brands"]').click();
    document.querySelector(".tabs .tab").click();
  });
  await settleAnimationFrames(page);
  await expect(page.locator("#pickShade")).not.toHaveClass(/on/);
  await expect
    .poll(() =>
      page.evaluate(() => window.DOIT_CORE_APP.currentState().mode),
    )
    .toBe("pick");
  metrics = await page.evaluate(
    () => window.DOIT_CORE_APP.health().realBillPerformance,
  );
  expect(metrics.pickerListRenders).toBe(
    baseline.pickerListRenders + 1,
  );

  await page.locator(".tabs .tab").nth(2).click();
  await page.evaluate(() => {
    document.querySelector('[data-pick="receivers"]').click();
  });
  await loadFixture(page, fixtureFiles.xlsm);
  await settleAnimationFrames(page);
  await expect(page.locator("#pickShade")).not.toHaveClass(/on/);
  await expect
    .poll(() =>
      page.evaluate(() => window.DOIT_CORE_APP.currentState().mode),
    )
    .toBe("pick");

  expect(runtime.errors).toEqual([]);
});

test("keeps the active Pro flow, state, mobile layout and print contract", async ({
  page,
}) => {
  const runtime = await preparePage(page);
  await loadFixture(page, fixtureFiles.xlsx);

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
  await loadFixture(page, fixtureFiles.xlsx);
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
    await page.locator(".cloudStatusTitle").click();
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

test("keeps the Pro shell inside Android WebView widths above 390px", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390x844");
  await page.setViewportSize({ width: 412, height: 915 });
  const runtime = await preparePage(page);

  const layout = await page.evaluate(() => {
    const selectors = [
      ".topbar",
      ".cloudStatusCard",
      "#resultsModeBtn",
      ".devTeamBtn",
      ".topGrid .card:nth-child(2)",
      "#work > .card",
    ];
    const boxes = selectors.map((selector) => {
      const element = document.querySelector(selector);
      const box = element.getBoundingClientRect();
      return { selector, left: box.left, right: box.right, width: box.width };
    });
    return {
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      mobileLayout: matchMedia("(max-width: 720px)").matches,
      narrowLayout: matchMedia("(max-width: 390px)").matches,
      cloudTitlePaddingRight: getComputedStyle(
        document.querySelector(".cloudStatusTitle"),
      ).paddingRight,
      boxes,
    };
  });

  expect(layout.mobileLayout).toBe(true);
  expect(layout.narrowLayout).toBe(false);
  expect(layout.cloudTitlePaddingRight).toBe("226px");
  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
  for (const box of layout.boxes) {
    expect(box.left, `${box.selector} left edge`).toBeGreaterThanOrEqual(-1);
    expect(box.right, `${box.selector} right edge`).toBeLessThanOrEqual(
      layout.viewportWidth + 1,
    );
  }
  expect(runtime.errors).toEqual([]);
});

test("auto-loads v7 multipart Cloud data in order", async ({
  page,
}) => {
  const errors = [];
  const partRequests = [];
  let releaseSecondPart;
  const secondPartGate = new Promise((resolve) => {
    releaseSecondPart = resolve;
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  const active = {
    id: "cloud-version",
    file_name: "cloud-multipart.xlsx",
    row_count: 3,
    store_count: 3,
    ps_count: 1,
    telesale_bill_count: 0,
  };
  const rows = [
    { date: "2026-07-30", ps: "PS1", store: "S1", sku: "SKU-1", qty: 1 },
    { date: "2026-07-30", ps: "PS1", store: "S2", sku: "SKU-2", qty: 2 },
    { date: "2026-07-30", ps: "PS1", store: "S3", sku: "SKU-3", qty: 3 },
  ];

  await page.route("https://parts.example/**", async (route) => {
    const partIndex = route.request().url().endsWith("part-0.json") ? 0 : 1;
    partRequests.push(partIndex);
    if (partIndex === 1) await secondPartGate;
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        schema: "doit-json-part-v1",
        version_id: active.id,
        part_index: partIndex,
        row_start: partIndex === 0 ? 0 : 2,
        rows: partIndex === 0 ? rows.slice(0, 2) : rows.slice(2),
      }),
    });
  });
  await page.route(
    "https://saodmeoilixfdqentofp.supabase.co/**",
    async (route) => {
      expect(route.request().method()).toBe("GET");
      const url = new URL(route.request().url());
      if (url.pathname.includes("/doit-active")) {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify(
            url.searchParams.get("mode") === "data"
              ? {
                  active,
                  mode: "json_parts",
                  schema: "doit-json-manifest-v1",
                  payload_schema: "doit-json-v1",
                  data_schema_version: 4,
                  version_id: active.id,
                  row_count: 3,
                  part_count: 2,
                  parts: [
                    {
                      part_index: 0,
                      row_start: 0,
                      row_count: 2,
                      url: "https://parts.example/part-0.json",
                    },
                    {
                      part_index: 1,
                      row_start: 2,
                      row_count: 1,
                      url: "https://parts.example/part-1.json",
                    },
                  ],
                }
              : { active },
          ),
        });
        return;
      }
      await route.fulfill({ contentType: "image/png", body: transparentPng });
    },
  );

  await page.goto("/pro.html?t=1028");
  await expect(page.locator("#devTeamModal")).toHaveClass(/on/);
  await page.locator("#devTeamModal .devClose").click();
  await expect.poll(() => partRequests.length).toBe(2);
  await expect(page.locator("#cloudState")).toHaveText("กำลังโหลด 2/2");
  await expect(page.locator("#cloudMsg")).toContainText("กำลังโหลดส่วน 2/2");

  releaseSecondPart();
  await expect(page.locator("#msg")).toContainText("โหลดสำเร็จ 3 แถว");
  await expect(page.locator("#cloudMsg")).toContainText("cloud-multipart.xlsx");
  await expect(page.locator("#cloudState")).toHaveText("พร้อม");
  await expect(
    page.locator("#choose,#file,#fileLabel,#cloudCheckBtn,#cloudLoadBtn"),
  ).toHaveCount(0);
  expect(partRequests).toEqual([0, 1]);
  expect(errors).toEqual([]);
});

test("shows a clear error when automatic multipart Cloud loading fails", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (
      text.includes("Failed to load resource") &&
      text.includes("500 (Internal Server Error)")
    ) {
      return;
    }
    errors.push(text);
  });

  const active = {
    id: "cloud-broken",
    file_name: "cloud-broken.xlsx",
    row_count: 2,
    store_count: 2,
    ps_count: 1,
    telesale_bill_count: 0,
  };
  await page.route("https://parts.example/broken.json", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "fixture_part_failure" }),
    });
  });
  await page.route(
    "https://saodmeoilixfdqentofp.supabase.co/**",
    async (route) => {
      expect(route.request().method()).toBe("GET");
      const url = new URL(route.request().url());
      if (url.pathname.includes("/doit-active")) {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify(
            url.searchParams.get("mode") === "data"
              ? {
                  active,
                  mode: "json_parts",
                  schema: "doit-json-manifest-v1",
                  payload_schema: "doit-json-v1",
                  data_schema_version: 4,
                  version_id: active.id,
                  row_count: 2,
                  part_count: 1,
                  parts: [
                    {
                      part_index: 0,
                      row_start: 0,
                      row_count: 2,
                      url: "https://parts.example/broken.json",
                    },
                  ],
                }
              : { active },
          ),
        });
        return;
      }
      await route.fulfill({ contentType: "image/png", body: transparentPng });
    },
  );

  await page.goto("/pro.html?t=1028");
  await expect(page.locator("#devTeamModal")).toHaveClass(/on/);
  await page.locator("#devTeamModal .devClose").click();

  await expect(page.locator("#cloudMsg")).toContainText(
    "โหลด Cloud ไม่สำเร็จ: JSON ส่วน 1/1 โหลดไม่สำเร็จ (HTTP 500)",
  );
  await expect(page.locator("#cloudMsg")).toContainText(
    "fixture_part_failure",
  );
  await expect(page.locator("#cloudState")).toHaveText("ผิดพลาด");
  await expect(page.locator("#msg")).toContainText(
    "โหลด Cloud ไม่สำเร็จ: JSON ส่วน 1/1 โหลดไม่สำเร็จ (HTTP 500)",
  );
  await expect(
    page.locator("#choose,#file,#fileLabel,#cloudCheckBtn,#cloudLoadBtn"),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});
