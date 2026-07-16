import { d as N, c as U, j as e, R as C, r as h, b as S, f as $, S as I } from "./chunks/api-C6gqF9Y8.js";
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const E = [
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
], D = N("gift", E);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const z = [["path", { d: "M5 12h14", key: "1ays0h" }]], L = N("minus", z);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const A = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], R = N("plus", A);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const F = [
  ["path", { d: "m15 11-1 9", key: "5wnq3a" }],
  ["path", { d: "m19 11-4-7", key: "cnml18" }],
  ["path", { d: "M2 11h20", key: "3eubbj" }],
  ["path", { d: "m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4", key: "yiazzp" }],
  ["path", { d: "M4.5 15.5h15", key: "13mye1" }],
  ["path", { d: "m5 11 4-7", key: "116ra9" }],
  ["path", { d: "m9 11 1 9", key: "1ojof7" }]
], q = N("shopping-basket", F);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const B = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], G = N("x", B), p = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
function K(n, d) {
  const u = [...n].sort((c, o) => c.minQuantity - o.minQuantity || c.tierNo - o.tierNo);
  let i = null, a = null;
  for (const c of u) {
    const o = c.maxQuantity == null || d <= c.maxQuantity;
    d >= c.minQuantity && o ? i = c : d < c.minQuantity && !a && (a = c);
  }
  if (!i) {
    const c = u.filter((o) => d >= o.minQuantity);
    i = c[c.length - 1] || null;
  }
  return i && (a = u.find((c) => c.minQuantity > i.minQuantity) || null), { active: i, next: a };
}
function H(n, d, u) {
  if (!Number.isFinite(n) || n <= 0) throw new Error("unit_price_invalid");
  const i = Math.max(1, Math.floor(Number(d) || 1)), { active: a, next: c } = K(u, i), o = p(n * i);
  let t = 0, x = 0, l = null, m = o;
  if ((a == null ? void 0 : a.type) === "cash_discount")
    t = p(o * Number(a.discountPercent || 0) / 100), m = p(o - t);
  else if ((a == null ? void 0 : a.type) === "free_goods")
    x = Math.floor(i / a.minQuantity) * a.freeQuantity, l = a.rewardUnit || a.purchaseUnit, t = 0, m = o;
  else if ((a == null ? void 0 : a.type) === "bundle_price" && a.bundlePrice) {
    const v = Math.floor(i / a.minQuantity), b = i % a.minQuantity;
    m = p(v * a.bundlePrice.amount + b * n), t = p(o - m);
  }
  return {
    quantity: i,
    unitPrice: p(n),
    grossAmount: o,
    activeTier: a,
    nextTier: c,
    cashDiscount: t,
    giftQuantity: x,
    giftUnit: l,
    netAmount: m,
    purchasedUnitPrice: p(m / i),
    effectiveUnitPriceIncludingGifts: p(m / Math.max(1, i + x))
  };
}
const y = (n) => n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }), Q = (n) => n.sourceText || (n.type === "free_goods" ? `ซื้อ ${n.minQuantity} ${n.purchaseUnit} ฟรี ${n.freeQuantity} ${n.rewardUnit || n.purchaseUnit}` : `ซื้อ ${n.minQuantity} ${n.purchaseUnit} ลด ${n.discountPercent}%`);
function O({ card: n, name: d, sku: u, onClose: i }) {
  var x;
  const [a, c] = h.useState(1), o = ((x = n.price.effectivePrice) == null ? void 0 : x.amount) || 0, t = o > 0 ? H(o, a, n.promotionTiers) : null;
  return /* @__PURE__ */ e.jsx("div", { className: "detail-overlay", role: "presentation", onMouseDown: (l) => {
    l.target === l.currentTarget && i();
  }, children: /* @__PURE__ */ e.jsxs("section", { className: "detail-panel", role: "dialog", "aria-modal": "true", "aria-label": d, children: [
    n.imageUrl && /* @__PURE__ */ e.jsx("img", { src: n.imageUrl, alt: d }),
    /* @__PURE__ */ e.jsx("h2", { className: "detail-title", children: d }),
    /* @__PURE__ */ e.jsxs("div", { className: "promo-pills", children: [
      /* @__PURE__ */ e.jsx("span", { className: "promo-pill", children: u }),
      /* @__PURE__ */ e.jsx("span", { className: "promo-pill", children: n.classId }),
      /* @__PURE__ */ e.jsx("span", { className: `promo-pill ${n.status === "ready" ? "ready" : "review"}`, children: n.status === "ready" ? "พร้อมคำนวณ" : "ต้องตรวจ" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "detail-metrics", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "detail-metric", children: [
        /* @__PURE__ */ e.jsx("span", { children: "ราคา/ชิ้น" }),
        /* @__PURE__ */ e.jsx("b", { children: o ? `฿${y(o)}` : "-" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "detail-metric", children: [
        /* @__PURE__ */ e.jsx("span", { children: "จำนวน Tier" }),
        /* @__PURE__ */ e.jsx("b", { children: n.promotionTiers.length })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "detail-metric", children: [
        /* @__PURE__ */ e.jsx("span", { children: "Class" }),
        /* @__PURE__ */ e.jsx("b", { children: n.classId })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "quantity-row", children: [
      /* @__PURE__ */ e.jsx("button", { "aria-label": "ลดจำนวน", onClick: () => c((l) => Math.max(1, l - 1)), children: /* @__PURE__ */ e.jsx(L, { size: 20 }) }),
      /* @__PURE__ */ e.jsx("input", { "aria-label": "จำนวนซื้อ", type: "number", min: "1", step: "1", value: a, onChange: (l) => c(Math.max(1, Math.floor(Number(l.target.value) || 1))) }),
      /* @__PURE__ */ e.jsx("button", { "aria-label": "เพิ่มจำนวน", onClick: () => c((l) => l + 1), children: /* @__PURE__ */ e.jsx(R, { size: 20 }) })
    ] }),
    n.promotionTiers.map((l) => {
      var m;
      return /* @__PURE__ */ e.jsxs("div", { className: `detail-tier ${((m = t == null ? void 0 : t.activeTier) == null ? void 0 : m.tierNo) === l.tierNo ? "active" : ""}`, children: [
        /* @__PURE__ */ e.jsx("span", { children: Q(l) }),
        /* @__PURE__ */ e.jsx("span", { className: "tier-kind", children: l.type === "cash_discount" ? "ลดเงิน" : l.type === "free_goods" ? "ของแถม" : "ราคาเหมา" })
      ] }, `${l.tierNo}-${l.type}`);
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
          /* @__PURE__ */ e.jsx(q, { size: 15 }),
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
        /* @__PURE__ */ e.jsx(D, { size: 16 }),
        " ได้ของแถม ",
        t.giftQuantity,
        " ",
        t.giftUnit,
        " — ไม่ถูกนำไปหักเป็นส่วนลดเงินสด"
      ] })
    ] }),
    !t && /* @__PURE__ */ e.jsx("div", { className: "next-tier", children: "การ์ดนี้ยังไม่มีราคากลาง จึงยังคำนวณไม่ได้" }),
    /* @__PURE__ */ e.jsxs("button", { className: "detail-close", onClick: i, children: [
      /* @__PURE__ */ e.jsx(G, { size: 16 }),
      " ปิด"
    ] })
  ] }) });
}
function V() {
  const n = new URLSearchParams(location.search), d = n.get("demo") === "1", u = n.get("month") || "", [i, a] = h.useState(d ? S("published") : null), [c, o] = h.useState(!d), [t, x] = h.useState(""), [l, m] = h.useState(""), [v, b] = h.useState(""), [f, P] = h.useState(null);
  h.useEffect(() => {
    d || $(u).then((s) => {
      if (s && s.version.status !== "published") throw new Error("frontend_rejected_non_published_version");
      a(s);
    }).catch((s) => x(String(s.message || s))).finally(() => o(!1));
  }, [d, u]);
  const g = h.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    return i == null || i.cards.forEach((r) => {
      r.classId && s.set(r.classId, (s.get(r.classId) || 0) + 1);
    }), [...s.entries()].sort(([r], [j]) => r.localeCompare(j));
  }, [i]);
  h.useEffect(() => {
    !l && g.length && m(g[0][0]);
  }, [g, l]);
  const M = h.useMemo(() => new Map((i == null ? void 0 : i.skus.map((s) => [s.id, s])) || []), [i]), w = h.useMemo(() => ((i == null ? void 0 : i.cards) || []).filter((s) => s.classId === l).filter((s) => {
    const r = s.skuId ? M.get(s.skuId) : null, j = [s.id, r == null ? void 0 : r.canonicalName, r == null ? void 0 : r.code, ...s.promotionTiers.map((T) => T.sourceText)].join(" ").toLowerCase();
    return !v || j.includes(v.toLowerCase());
  }), [i, l, v, M]), k = f != null && f.skuId ? M.get(f.skuId) : null, _ = (i == null ? void 0 : i.version.monthKey) || u || "-";
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
          _
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("nav", { className: "class-tabs", "aria-label": "Class โปรโมชั่น", children: g.map(([s, r]) => /* @__PURE__ */ e.jsxs("button", { className: `class-tab ${l === s ? "active" : ""}`, onClick: () => m(s), children: [
        s,
        /* @__PURE__ */ e.jsx("small", { children: r })
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
      c && /* @__PURE__ */ e.jsx("div", { className: "customer-empty", children: "กำลังโหลดเวอร์ชัน Published..." }),
      t && /* @__PURE__ */ e.jsxs("div", { className: "customer-error", children: [
        "โหลดโปรโมชั่นไม่สำเร็จ: ",
        t
      ] }),
      !c && !t && !i && /* @__PURE__ */ e.jsx("div", { className: "customer-empty", children: "ยังไม่มีโปรโมชั่น Published" }),
      i && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "customer-notice", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsxs("b", { children: [
              l || "ยังไม่มี Class",
              " · ",
              w.length,
              " การ์ด"
            ] }),
            /* @__PURE__ */ e.jsx("span", { children: "Frontend อ่านเฉพาะ version สถานะ Published" })
          ] }),
          /* @__PURE__ */ e.jsxs("span", { children: [
            "Revision ",
            i.version.revision
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "customer-filter", children: [
          /* @__PURE__ */ e.jsxs("label", { style: { position: "relative" }, children: [
            /* @__PURE__ */ e.jsx(I, { size: 16, style: { position: "absolute", left: 12, top: 14, color: "#64748b" } }),
            /* @__PURE__ */ e.jsx("input", { style: { paddingLeft: 36, width: "100%" }, value: v, onChange: (s) => b(s.target.value), placeholder: "ค้นหาชื่อสินค้า เงื่อนไข SKU หรือ Card ID" })
          ] }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => b(""), children: "ล้าง" })
        ] }),
        /* @__PURE__ */ e.jsx("section", { className: "promo-grid", children: w.map((s) => {
          const r = s.skuId ? M.get(s.skuId) : null, j = s.status === "ready" && !!s.price.effectivePrice && s.promotionTiers.length > 0;
          return /* @__PURE__ */ e.jsxs("button", { className: "promo-card", disabled: !j, onClick: () => P(s), children: [
            s.imageUrl ? /* @__PURE__ */ e.jsx("img", { src: s.imageUrl, alt: (r == null ? void 0 : r.canonicalName) || s.id, loading: "lazy" }) : /* @__PURE__ */ e.jsx("div", { className: "customer-empty", children: "ไม่มีรูป" }),
            /* @__PURE__ */ e.jsxs("div", { className: "promo-card-body", children: [
              /* @__PURE__ */ e.jsx("h3", { children: (r == null ? void 0 : r.canonicalName) || s.id }),
              /* @__PURE__ */ e.jsxs("div", { className: "promo-pills", children: [
                /* @__PURE__ */ e.jsx("span", { className: `promo-pill ${j ? "ready" : "review"}`, children: j ? "พร้อมคำนวณ" : "ยังไม่พร้อม" }),
                /* @__PURE__ */ e.jsx("span", { className: "promo-pill", children: (r == null ? void 0 : r.code) || "ไม่มี SKU" })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "promo-function", children: s.promotionTiers.map(Q).join(" · ") || "ยังไม่มี Promotion tiers" }),
              /* @__PURE__ */ e.jsxs("div", { className: "promo-price", children: [
                "ราคา/ชิ้น ",
                /* @__PURE__ */ e.jsx("b", { children: s.price.effectivePrice ? `฿${y(s.price.effectivePrice.amount)}` : "-" })
              ] })
            ] })
          ] }, s.id);
        }) }),
        !w.length && /* @__PURE__ */ e.jsx("div", { className: "customer-empty", children: "ไม่พบการ์ดใน Class/คำค้นนี้" }),
        /* @__PURE__ */ e.jsxs("div", { className: "published-note", children: [
          "Version ",
          i.version.id,
          " · Published ",
          i.version.publishedAt || "-"
        ] })
      ] }),
      f && k && /* @__PURE__ */ e.jsx(O, { card: f, name: k.canonicalName, sku: k.code, onClose: () => P(null) })
    ] })
  ] });
}
U.createRoot(document.getElementById("promo-new-root")).render(/* @__PURE__ */ e.jsx(C.StrictMode, { children: /* @__PURE__ */ e.jsx(V, {}) }));
