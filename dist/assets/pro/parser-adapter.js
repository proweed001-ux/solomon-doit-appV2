import { K, N, T, cleanPs } from "./utils.js";

const TELE_KEYS = [
  "tele",
  "telesale",
  "telesales",
  "teleid",
  "telesaleid",
  "telesalesid",
  "telename",
  "telesalename",
  "telesalesname",
  "sotelesaleid",
  "sotelesalesid",
];
const TELE_FLAG_KEYS = [
  "istele",
  "istelesale",
  "istelesales",
  "teleflag",
  "telesaleflag",
];

function objectsOf(row) {
  const objects = [];
  if (row && typeof row === "object") objects.push(row);
  ["raw", "original", "source", "sourceRow", "row", "data"].forEach((key) => {
    const value = row?.[key];
    if (value && typeof value === "object" && !Array.isArray(value))
      objects.push(value);
  });
  return objects;
}

function textByKey(row, keys) {
  for (const object of objectsOf(row)) {
    for (const key of Object.keys(object)) {
      if (keys.includes(K(key)) && T(object[key])) return T(object[key]);
    }
  }
  return "";
}

function truthyFlag(value) {
  const text = T(value).toLowerCase();
  return Boolean(text) && !["0", "false", "no", "n", "ไม่"].includes(text);
}

function hasTeleFlag(row) {
  for (const object of objectsOf(row)) {
    for (const key of Object.keys(object)) {
      if (TELE_FLAG_KEYS.includes(K(key)) && truthyFlag(object[key]))
        return true;
    }
  }
  return false;
}

function valueAt(row, ...paths) {
  for (const path of paths) {
    const value = path.split(".").reduce((object, part) => object?.[part], row);
    if (T(value)) return value;
  }
  return "";
}

function moneyValue(row, keys) {
  for (const object of objectsOf(row)) {
    for (const key of Object.keys(object)) {
      if (!keys.includes(K(key))) continue;
      const value = N(object[key]);
      if (value !== 0) return value;
    }
  }
  return 0;
}

function salespersonOf(row) {
  return cleanPs(
    row.ps ||
      row.PS ||
      row.personKey ||
      row.salespersonId ||
      row.SO_SalespersonID ||
      row.SalespersonID ||
      row.raw?.SO_SalespersonID ||
      row.raw?.SalespersonID ||
      row.raw?.Salesperson_Name ||
      row.raw?.["Salesperson Name"],
  );
}

function typeOf(row) {
  return (
    T(
      row.type ||
        row.SOTypeID ||
        row.soTypeID ||
        row.DocType ||
        row.raw?.SOTypeID ||
        "INVC",
    ) || "INVC"
  );
}

function sameText(left, right) {
  return Boolean(K(left)) && K(left) === K(right);
}

function isTelesaleType(row) {
  return ["tele", "telesale", "telesales", "tsale"].includes(K(typeOf(row)));
}

export function norm(row) {
  const ps = salespersonOf(row) || "ไม่ระบุ PS";
  const tele = cleanPs(textByKey(row, TELE_KEYS));
  const type = typeOf(row);
  const isTele =
    Boolean(tele && !sameText(tele, ps)) ||
    hasTeleFlag(row) ||
    isTelesaleType(row);
  const qty = N(
    row.qty ??
      row.qtyPcs ??
      row.ShipQtyPCS ??
      row.QtyShipPCS ??
      row.raw?.ShipQtyPCS ??
      row.raw?.QtyShipPCS ??
      row.raw?.Qty,
  );
  const rawAmount =
    moneyValue(row, [
      "lineamtbeforedisc",
      "lineamountbeforedisc",
      "lineamtbeforediscount",
      "rawamount",
      "grossamount",
      "grossamt",
    ]) || N(row.rawAmt ?? row.rawAmount);
  const netAmount =
    moneyValue(row, [
      "invoiceamt",
      "invoiceamount",
      "invamt",
      "netamount",
      "netamt",
    ]) || N(row.netAmt ?? row.netAmount ?? row.correctAmount);
  const fallback = N(
    row.amt ??
      row.amount ??
      row.correctAmount ??
      row.InvoiceAmt ??
      row.raw?.InvoiceAmt ??
      row.raw?.Amount,
  );
  const raw = rawAmount || fallback;
  const net = netAmount || raw || fallback;

  return {
    date: T(
      valueAt(
        row,
        "date",
        "invoiceDate",
        "InvoiceDate",
        "InvcDate",
        "raw.date",
        "raw.InvoiceDate",
        "raw.InvcDate",
      ),
    ),
    inv: T(
      valueAt(
        row,
        "inv",
        "invoiceNo",
        "InvoiceNo",
        "raw.InvoiceNo",
        "raw.Invoice Number",
      ),
    ),
    type,
    ps,
    store:
      T(
        valueAt(
          row,
          "store",
          "customerName",
          "storeName",
          "CustomerName",
          "Customer Name",
          "raw.CustomerName",
          "raw.Customer Name",
          "raw.StoreName",
          "raw.ShipName",
          "raw.ShipToName",
        ),
      ) || "ไม่ระบุร้าน",
    tele: isTele ? tele || ps || "Telesale" : "",
    isTele,
    code: T(
      valueAt(
        row,
        "code",
        "skuCode",
        "SKUCode",
        "ItemCode",
        "raw.SKUCode",
        "raw.ItemCode",
      ),
    ),
    sku:
      T(
        valueAt(
          row,
          "sku",
          "productName",
          "SKUDescription",
          "SKU Description",
          "SKU_Desc",
          "ItemName",
          "raw.SKUDescription",
          "raw.SKU Description",
          "raw.SKU_Desc",
          "raw.ItemName",
        ),
      ) || "ไม่ระบุสินค้า",
    brand:
      T(
        valueAt(
          row,
          "brand",
          "GroupBrand",
          "Group Brand",
          "raw.GroupBrand",
          "raw.Group Brand",
        ),
      ) || "ไม่ระบุแบรนด์",
    size:
      T(
        valueAt(
          row,
          "size",
          "TAS_SizeGroup",
          "SizeGroup",
          "raw.TAS_SizeGroup",
          "raw.SizeGroup",
        ),
      ) || "ไม่ระบุไซซ์",
    qty,
    amt: raw,
    rawAmt: raw,
    netAmt: net,
    unit: qty ? raw / qty : N(row.unit),
    netUnit: qty ? net / qty : 0,
  };
}

export function arr(payload) {
  return Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.rows)
      ? payload.rows
      : [];
}

export async function parseDoitFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = globalThis.XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return globalThis.XLSX.utils.sheet_to_json(sheet, { defval: "" });
}
