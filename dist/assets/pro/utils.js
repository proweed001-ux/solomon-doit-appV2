export const SEP = "\u001f";
export const TITLE = "AYA By.พี่ฐาสั่งลุยย";

export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => [...document.querySelectorAll(selector)];
export const T = (value) => String(value ?? "").trim();
export const N = (value) =>
  Number(
    String(value ?? "")
      .replace(/,/g, "")
      .replace(/[^0-9.\-]/g, ""),
  ) || 0;
export const F = (value) => N(value).toLocaleString("th-TH");
export const B = (value) =>
  N(value).toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
export const E = (value) =>
  T(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
export const K = (value) =>
  T(value)
    .toLowerCase()
    .replace(/[^a-z0-9ก-ฮ]+/g, "");

export function uniq(values) {
  return [...new Set((values || []).map(T).filter(Boolean))];
}

export function cleanPs(value) {
  const normalized = T(value).replace(/\s+/g, " ");
  if (!normalized) return "";
  const parts = normalized.split(" ").filter(Boolean);
  const unique = [];
  parts.forEach((part) => {
    if (!unique.includes(part)) unique.push(part);
  });
  return unique.length === 2 && unique[0] === unique[1]
    ? unique[0]
    : unique.join(" ");
}

export function dlabel(value) {
  const parts = T(value).split("-");
  return parts.length === 3
    ? parts[2] + "/" + parts[1] + "/" + parts[0]
    : value || "ทั้งหมด";
}

export function parseIso(value) {
  const text = T(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const date = new Date(text + "T00:00:00+07:00");
  return Number.isNaN(date.getTime()) ? null : date;
}

export function thaiDate(date = new Date()) {
  return date
    ? date.toLocaleDateString("th-TH", {
        timeZone: "Asia/Bangkok",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";
}

export function prevDay(date) {
  const previous = new Date(date.getTime());
  previous.setDate(previous.getDate() - 1);
  return previous;
}
