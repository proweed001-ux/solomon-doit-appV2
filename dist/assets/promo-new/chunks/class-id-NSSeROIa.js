const a = (e) => String(e || "").normalize("NFKC").replace(/\s+/g, " ").trim();
function l(e) {
  var o;
  const c = a(e).toUpperCase(), r = (((o = c.match(/(?:CLASS|กลุ่ม|ระดับ|ร้าน)\s*[:=-]?\s*([A-Z0-9][A-Z0-9/_ -]{1,30})/u)) == null ? void 0 : o[1]) || c).match(/[A-Z]+(?:[-/]?[A-Z0-9]+){1,5}/g) || [], S = /* @__PURE__ */ new Set(["PROMOTION", "PROMOTIONS", "PRICE", "MONTH", "CLASS", "PAGE", "CANVASS"]), s = (n) => {
    const t = n.replace(/[^A-Z0-9]/g, "");
    return /^HFS(?:S|M|L|XL|WH|WSS|WSL)$/.test(t) ? t === "HFSWH" ? "HFSM" : t === "HFSWSS" ? "HFSWS-S" : t === "HFSWSL" ? "HFSWS-L" : t : null;
  };
  for (const n of r) {
    const t = s(n);
    if (t) return t;
  }
  for (const n of r) {
    const t = n.replace(/[^A-Z0-9]/g, "");
    if (!(S.has(t) || t.startsWith("HFS") || t.length < 3 || t.length > 20))
      return t;
  }
  return null;
}
export {
  l as n
};
