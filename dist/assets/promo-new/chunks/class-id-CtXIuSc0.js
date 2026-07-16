const r = (n) => String(n || "").normalize("NFKC").replace(/\s+/g, " ").trim();
function i(n) {
  var c;
  const e = r(n).toUpperCase(), o = (((c = e.match(/(?:CLASS|กลุ่ม|ระดับ|ร้าน)\s*[:=-]?\s*([A-Z0-9][A-Z0-9/_ -]{1,30})/u)) == null ? void 0 : c[1]) || e).match(/[A-Z]+(?:[-/]?[A-Z0-9]+){1,5}/g) || [], a = /* @__PURE__ */ new Set(["PROMOTION", "PROMOTIONS", "PRICE", "MONTH", "CLASS", "PAGE", "CANVASS"]);
  for (const s of o) {
    const t = s.replace(/[^A-Z0-9]/g, "");
    if (!(a.has(t) || t.length < 3 || t.length > 20))
      return t === "HFSWH" ? "HFSM" : t;
  }
  return null;
}
export {
  i as n
};
