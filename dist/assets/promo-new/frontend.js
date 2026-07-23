import { f as P, c as _, k as e, R as S, r as h, e as I, i as E, S as $, P as D, X as z } from "./chunks/api-DQv6TBEn.js";
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const L = [
  ["rect", { x: "3", y: "8", width: "18", height: "4", rx: "1", key: "bkv52" }],
  ["path", { d: "M12 8v13", key: "1c76mn" }],
  ["path", { d: "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7", key: "6wjy6b" }],
  [
    "path",
    {
      d: "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",
      key: "1ihvrl"
    }
  ]
], A = P("gift", L);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const R = [["path", { d: "M5 12h14", key: "1ays0h" }]], F = P("minus", R);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const q = [
  ["path", { d: "m15 11-1 9", key: "5wnq3a" }],
  ["path", { d: "m19 11-4-7", key: "cnml18" }],
  ["path", { d: "M2 11h20", key: "3eubbj" }],
  ["path", { d: "m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4", key: "yiazzp" }],
  ["path", { d: "M4.5 15.5h15", key: "13mye1" }],
  ["path", { d: "m5 11 4-7", key: "116ra9" }],
  ["path", { d: "m9 11 1 9", key: "1ojof7" }]
], B = P("shopping-basket", q), N = (i) => Math.round((Number(i) + Number.EPSILON) * 100) / 100;
function G(i, d) {
  const u = [...i].sort((o, c) => o.minQuantity - c.minQuantity || o.tierNo - c.tierNo);
  let n = null;
  for (const o of u) {
    const c = o.maxQuantity == null || d <= o.maxQuantity;
    d >= o.minQuantity && c && (n = o);
  }
  const a = u.find((o) => o.minQuantity > d) || null;
  return { active: n, next: a };
}
function K(i, d, u) {
  if (!Number.isFinite(i) || i <= 0) throw new Error("unit_price_invalid");
  const n = Math.max(1, Math.floor(Number(d) || 1)), { active: a, next: o } = G(u, n), c = N(i * n);
  let t = 0, x = 0, r = null, m = c;
  if ((a == null ? void 0 : a.type) === "cash_discount") {
    const p = Math.max(0, Math.min(100, Number(a.discountPercent || 0)));
    t = N(Math.min(c, c * p / 100)), m = N(Math.max(0, c - t));
  } else if ((a == null ? void 0 : a.type) === "free_goods")
    x = Math.floor(n / a.minQuantity) * a.freeQuantity, r = a.rewardUnit || a.purchaseUnit, t = 0, m = c;
  else if ((a == null ? void 0 : a.type) === "bundle_price" && a.bundlePrice) {
    if (!Number.isFinite(a.bundlePrice.amount) || a.bundlePrice.amount <= 0) throw new Error("bundle_price_invalid");
    const p = Math.floor(n / a.minQuantity), b = n % a.minQuantity, j = N(p * a.bundlePrice.amount + b * i);
    m = Math.min(c, j), t = N(c - m);
  }
  return {
    quantity: n,
    unitPrice: N(i),
    grossAmount: c,
    activeTier: a,
    nextTier: o,
    cashDiscount: t,
    giftQuantity: x,
    giftUnit: r,
    netAmount: m,
    purchasedUnitPrice: N(m / n),
    effectiveUnitPriceIncludingGifts: N(m / Math.max(1, n + x))
  };
}
const y = (i) => i.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }), C = (i) => i.sourceText || (i.type === "free_goods" ? `ซื้อ ${i.minQuantity} ${i.purchaseUnit} ฟรี ${i.freeQuantity} ${i.rewardUnit || i.purchaseUnit}` : `ซื้อ ${i.minQuantity} ${i.purchaseUnit} ลด ${i.discountPercent}%`);
function H({ card: i, name: d, sku: u, onClose: n }) {
  var x;
  const [a, o] = h.useState(1), c = ((x = i.price.effectivePrice) == null ? void 0 : x.amount) || 0, t = c > 0 ? K(c, a, i.promotionTiers) : null;
  return /* @__PURE__ */ e.jsx("div", { className: "detail-overlay", role: "presentation", onMouseDown: (r) => {
    r.target === r.currentTarget && n();
  }, children: /* @__PURE__ */ e.jsxs("section", { className: "detail-panel", role: "dialog", "aria-modal": "true", "aria-label": d, children: [
    i.imageUrl && /* @__PURE__ */ e.jsx("img", { src: i.imageUrl, alt: d }),
    /* @__PURE__ */ e.jsx("h2", { className: "detail-title", children: d }),
    /* @__PURE__ */ e.jsxs("div", { className: "promo-pills", children: [
      /* @__PURE__ */ e.jsx("span", { className: "promo-pill", children: u }),
      /* @__PURE__ */ e.jsx("span", { className: "promo-pill", children: i.classId }),
      /* @__PURE__ */ e.jsx("span", { className: "promo-pill ready", children: "พร้อมคำนวณ" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "detail-metrics", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "detail-metric", children: [
        /* @__PURE__ */ e.jsx("span", { children: "ราคา/ชิ้น" }),
        /* @__PURE__ */ e.jsx("b", { children: c ? `฿${y(c)}` : "-" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "detail-metric", children: [
        /* @__PURE__ */ e.jsx("span", { children: "จำนวน Tier" }),
        /* @__PURE__ */ e.jsx("b", { children: i.promotionTiers.length })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "detail-metric", children: [
        /* @__PURE__ */ e.jsx("span", { children: "Class" }),
        /* @__PURE__ */ e.jsx("b", { children: i.classId })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "quantity-row", children: [
      /* @__PURE__ */ e.jsx("button", { "aria-label": "ลดจำนวน", onClick: () => o((r) => Math.max(1, r - 1)), children: /* @__PURE__ */ e.jsx(F, { size: 20 }) }),
      /* @__PURE__ */ e.jsx("input", { "aria-label": "จำนวนซื้อ", type: "number", min: "1", step: "1", value: a, onChange: (r) => o(Math.max(1, Math.floor(Number(r.target.value) || 1))) }),
      /* @__PURE__ */ e.jsx("button", { "aria-label": "เพิ่มจำนวน", onClick: () => o((r) => r + 1), children: /* @__PURE__ */ e.jsx(D, { size: 20 }) })
    ] }),
    i.promotionTiers.map((r) => {
      var m;
      return /* @__PURE__ */ e.jsxs("div", { className: `detail-tier ${((m = t == null ? void 0 : t.activeTier) == null ? void 0 : m.tierNo) === r.tierNo ? "active" : ""}`, children: [
        /* @__PURE__ */ e.jsx("span", { children: C(r) }),
        /* @__PURE__ */ e.jsx("span", { className: "tier-kind", children: r.type === "cash_discount" ? "ลดเงิน" : r.type === "free_goods" ? "ของแถม" : "ราคาเหมา" })
      ] }, `${r.tierNo}-${r.type}`);
    }),
    (t == null ? void 0 : t.nextTier) && /* @__PURE__ */ e.jsxs("div", { className: "next-tier", children: [
      "ซื้อเพิ่มอีก ",
      Math.max(0, t.nextTier.minQuantity - t.quantity),
      " ",
      t.nextTier.purchaseUnit,
      " ถึง Tier ถัดไป"
    ] }),
    t && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "result-card", children: [
        /* @__PURE__ */ e.jsxs("h3", { children: [
          /* @__PURE__ */ e.jsx(B, { size: 15 }),
          " สรุปราคา"
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "result-row", children: [
          /* @__PURE__ */ e.jsx("span", { children: "ยอดก่อนส่วนลด" }),
          /* @__PURE__ */ e.jsxs("b", { children: [
            "฿",
            y(t.grossAmount)
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "result-row", children: [
          /* @__PURE__ */ e.jsx("span", { children: "ส่วนลดเงินสด" }),
          /* @__PURE__ */ e.jsxs("b", { children: [
            "− ฿",
            y(t.cashDiscount)
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "result-row total", children: [
          /* @__PURE__ */ e.jsx("span", { children: "ยอดสุทธิ" }),
          /* @__PURE__ */ e.jsxs("b", { children: [
            "฿",
            y(t.netAmount)
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "result-row", children: [
          /* @__PURE__ */ e.jsx("span", { children: "ราคาต่อหน่วยซื้อ" }),
          /* @__PURE__ */ e.jsxs("b", { children: [
            "฿",
            y(t.purchasedUnitPrice)
          ] })
        ] }),
        t.giftQuantity > 0 && /* @__PURE__ */ e.jsxs("div", { className: "result-row", children: [
          /* @__PURE__ */ e.jsx("span", { children: "ราคาต่อหน่วยรวมของแถม" }),
          /* @__PURE__ */ e.jsxs("b", { children: [
            "฿",
            y(t.effectiveUnitPriceIncludingGifts)
          ] })
        ] })
      ] }),
      t.giftQuantity > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gift-row", children: [
        /* @__PURE__ */ e.jsx(A, { size: 16 }),
        " ได้ของแถม ",
        t.giftQuantity,
        " ",
        t.giftUnit,
        " — ไม่ถูกนำไปหักเป็นส่วนลดเงินสด"
      ] })
    ] }),
    !t && /* @__PURE__ */ e.jsx("div", { className: "next-tier", children: "การ์ดนี้ยังไม่มีราคากลาง จึงยังคำนวณไม่ได้" }),
    /* @__PURE__ */ e.jsxs("button", { className: "detail-close", onClick: n, children: [
      /* @__PURE__ */ e.jsx(z, { size: 16 }),
      " ปิด"
    ] })
  ] }) });
}
function O() {
  const i = new URLSearchParams(location.search), d = i.get("demo") === "1", u = i.get("month") || "", [n, a] = h.useState(d ? I("published") : null), [o, c] = h.useState(!d), [t, x] = h.useState(""), [r, m] = h.useState(""), [p, b] = h.useState(""), [j, T] = h.useState(null);
  h.useEffect(() => {
    d || E(u).then((s) => {
      if (s && s.version.status !== "published") throw new Error("frontend_rejected_non_published_version");
      a(s);
    }).catch((s) => x(String(s.message || s))).finally(() => c(!1));
  }, [d, u]);
  const f = h.useMemo(() => new Map((n == null ? void 0 : n.skus.map((s) => [s.id, s])) || []), [n]), g = h.useMemo(() => ((n == null ? void 0 : n.cards) || []).filter((s) => {
    var l;
    return s.status === "ready" && s.failureReasons.length === 0 && Number((l = s.price.effectivePrice) == null ? void 0 : l.amount) > 0 && s.promotionTiers.length > 0 && !!(s.skuId && f.has(s.skuId));
  }), [n, f]), v = h.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    return g.forEach((l) => {
      l.classId && s.set(l.classId, (s.get(l.classId) || 0) + 1);
    }), [...s.entries()].sort(([l], [k]) => l.localeCompare(k));
  }, [g]);
  h.useEffect(() => {
    (!r || !v.some(([s]) => s === r)) && v.length && m(v[0][0]);
  }, [v, r]);
  const M = h.useMemo(() => g.filter((s) => s.classId === r).filter((s) => {
    const l = s.skuId ? f.get(s.skuId) : null, k = [s.id, l == null ? void 0 : l.canonicalName, l == null ? void 0 : l.code, ...s.promotionTiers.map((U) => U.sourceText)].join(" ").toLowerCase();
    return !p || k.includes(p.toLowerCase());
  }), [g, r, p, f]), w = j != null && j.skuId ? f.get(j.skuId) : null, Q = (n == null ? void 0 : n.version.monthKey) || u || "-";
  return /* @__PURE__ */ e.jsxs("div", { className: "customer-shell", children: [
    /* @__PURE__ */ e.jsx("header", { className: "customer-hero", children: /* @__PURE__ */ e.jsxs("div", { className: "customer-hero-inner", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "customer-row", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "eyebrow", children: [
            "โปรโมชัน ",
            d ? "· PREVIEW DEMO" : ""
          ] }),
          /* @__PURE__ */ e.jsx("h1", { children: "คุ้มเวอร์!" }),
          /* @__PURE__ */ e.jsx("div", { className: "customer-sub", children: "เลือกรายการ ปรับจำนวน และดู Tier ที่ถึงทันที" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "month-badge", children: [
          /* @__PURE__ */ e.jsx("small", { children: "เดือนโปรโมชั่น" }),
          Q
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("nav", { className: "class-tabs", "aria-label": "Class โปรโมชั่น", children: v.map(([s, l]) => /* @__PURE__ */ e.jsxs("button", { className: `class-tab ${r === s ? "active" : ""}`, onClick: () => m(s), children: [
        s,
        /* @__PURE__ */ e.jsx("small", { children: l })
      ] }, s)) })
    ] }) }),
    /* @__PURE__ */ e.jsxs("main", { className: "customer-main", children: [
      d && /* @__PURE__ */ e.jsxs("div", { className: "customer-notice", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("b", { children: "Preview แบบสาธิต" }),
          /* @__PURE__ */ e.jsx("span", { children: "ข้อมูลนี้ใช้ตรวจหน้าจอและสูตร ยังไม่ใช่ Production" })
        ] }),
        /* @__PURE__ */ e.jsx("span", { children: "Published fixture" })
      ] }),
      o && /* @__PURE__ */ e.jsx("div", { className: "customer-empty", children: "กำลังโหลดเวอร์ชัน Published..." }),
      t && /* @__PURE__ */ e.jsxs("div", { className: "customer-error", children: [
        "โหลดโปรโมชั่นไม่สำเร็จ: ",
        t
      ] }),
      !o && !t && !n && /* @__PURE__ */ e.jsx("div", { className: "customer-empty", children: "ยังไม่มีโปรโมชั่น Published" }),
      n && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "customer-notice", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsxs("b", { children: [
              r || "ยังไม่มี Class",
              " · ",
              M.length,
              " การ์ด"
            ] }),
            /* @__PURE__ */ e.jsx("span", { children: "แสดงเฉพาะการ์ด Published ที่ผ่าน ready, ราคา และ Promotion Tier" })
          ] }),
          /* @__PURE__ */ e.jsxs("span", { children: [
            "Revision ",
            n.version.revision
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "customer-filter", children: [
          /* @__PURE__ */ e.jsxs("label", { style: { position: "relative" }, children: [
            /* @__PURE__ */ e.jsx($, { size: 16, style: { position: "absolute", left: 12, top: 14, color: "#64748b" } }),
            /* @__PURE__ */ e.jsx("input", { style: { paddingLeft: 36, width: "100%" }, value: p, onChange: (s) => b(s.target.value), placeholder: "ค้นหาชื่อสินค้า เงื่อนไข SKU หรือ Card ID" })
          ] }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => b(""), children: "ล้าง" })
        ] }),
        /* @__PURE__ */ e.jsx("section", { className: "promo-grid", children: M.map((s) => {
          const l = s.skuId ? f.get(s.skuId) : null;
          return /* @__PURE__ */ e.jsxs("button", { className: "promo-card", onClick: () => T(s), children: [
            s.imageUrl ? /* @__PURE__ */ e.jsx("img", { src: s.imageUrl, alt: (l == null ? void 0 : l.canonicalName) || s.id, loading: "lazy" }) : /* @__PURE__ */ e.jsx("div", { className: "customer-empty", children: "ไม่มีรูป" }),
            /* @__PURE__ */ e.jsxs("div", { className: "promo-card-body", children: [
              /* @__PURE__ */ e.jsx("h3", { children: (l == null ? void 0 : l.canonicalName) || s.id }),
              /* @__PURE__ */ e.jsxs("div", { className: "promo-pills", children: [
                /* @__PURE__ */ e.jsx("span", { className: "promo-pill ready", children: "พร้อมคำนวณ" }),
                /* @__PURE__ */ e.jsx("span", { className: "promo-pill", children: (l == null ? void 0 : l.code) || "ไม่มี SKU" })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "promo-function", children: s.promotionTiers.map(C).join(" · ") }),
              /* @__PURE__ */ e.jsxs("div", { className: "promo-price", children: [
                "ราคา/ชิ้น ",
                /* @__PURE__ */ e.jsxs("b", { children: [
                  "฿",
                  y(s.price.effectivePrice.amount)
                ] })
              ] })
            ] })
          ] }, s.id);
        }) }),
        !M.length && /* @__PURE__ */ e.jsx("div", { className: "customer-empty", children: "ไม่พบการ์ดพร้อมใช้ใน Class/คำค้นนี้" }),
        /* @__PURE__ */ e.jsxs("div", { className: "published-note", children: [
          "Version ",
          n.version.id,
          " · Published ",
          n.version.publishedAt || "-"
        ] })
      ] }),
      j && w && /* @__PURE__ */ e.jsx(H, { card: j, name: w.canonicalName, sku: w.code, onClose: () => T(null) })
    ] })
  ] });
}
_.createRoot(document.getElementById("promo-new-root")).render(/* @__PURE__ */ e.jsx(S.StrictMode, { children: /* @__PURE__ */ e.jsx(O, {}) }));
