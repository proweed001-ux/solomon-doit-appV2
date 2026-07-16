const a = (n) => String(n || "").normalize("NFKC").replace(/\s+/g, " ").trim();
function i(n) {
  var S;
  const e = a(n).toUpperCase(), c = (((S = e.match(/(?:CLASS|กลุ่ม|ระดับ|ร้าน)\s*[:=-]?\s*([A-Z0-9][A-Z0-9/_ -]{1,30})/u)) == null ? void 0 : S[1]) || e).match(/[A-Z]+(?:[-/]?[A-Z0-9]+){1,5}/g) || [], o = /* @__PURE__ */ new Set(["PROMOTION", "PROMOTIONS", "PRICE", "MONTH", "CLASS", "PAGE", "CANVASS"]);
  for (const r of c) {
    const t = r.replace(/[^A-Z0-9]/g, "");
    if (!(o.has(t) || t.length < 3 || t.length > 20))
      return t === "HFSWH" ? "HFSM" : t === "HFSWSS" ? "HFSWS-S" : t === "HFSWSL" ? "HFSWS-L" : t;
  }
  return null;
}
export {
  i as n
};
