import { n as ff, i as cf, v as of } from "./main-CFLgEJrh.js";
import { b as Sa, j as lf } from "./api-DQv6TBEn.js";
import { c as Ca } from "./_commonjs-dynamic-modules-BpilXLfW.js";
/*! xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com */
var Ur = 1200, uf = [874, 932, 936, 949, 950, 1250, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1e4], On = {
  0: 1252,
  /* ANSI */
  1: 65001,
  /* DEFAULT */
  2: 65001,
  /* SYMBOL */
  77: 1e4,
  /* MAC */
  128: 932,
  /* SHIFTJIS */
  129: 949,
  /* HANGUL */
  130: 1361,
  /* JOHAB */
  134: 936,
  /* GB2312 */
  136: 950,
  /* CHINESEBIG5 */
  161: 1253,
  /* GREEK */
  162: 1254,
  /* TURKISH */
  163: 1258,
  /* VIETNAMESE */
  177: 1255,
  /* HEBREW */
  178: 1256,
  /* ARABIC */
  186: 1257,
  /* BALTIC */
  204: 1251,
  /* RUSSIAN */
  222: 874,
  /* THAI */
  238: 1250,
  /* EASTEUROPE */
  255: 1252,
  /* OEM */
  69: 6969
  /* MISC */
}, Dn = function(e) {
  uf.indexOf(e) != -1 && (On[0] = e);
};
function hf() {
  Dn(1252);
}
var Gr = function(e) {
  Ur = e, Dn(e);
};
function l0() {
  Gr(1200), hf();
}
function ri(e) {
  for (var t = [], r = 0, n = e.length; r < n; ++r) t[r] = e.charCodeAt(r);
  return t;
}
function u0(e) {
  for (var t = [], r = 0; r < e.length >> 1; ++r) t[r] = String.fromCharCode(e.charCodeAt(2 * r) + (e.charCodeAt(2 * r + 1) << 8));
  return t.join("");
}
function df(e) {
  for (var t = [], r = 0; r < e.length >> 1; ++r) t[r] = String.fromCharCode(e[2 * r] + (e[2 * r + 1] << 8));
  return t.join("");
}
function h0(e) {
  for (var t = [], r = 0; r < e.length >> 1; ++r) t[r] = String.fromCharCode(e.charCodeAt(2 * r + 1) + (e.charCodeAt(2 * r) << 8));
  return t.join("");
}
var jt = function(e) {
  var t = e.charCodeAt(0), r = e.charCodeAt(1);
  return t == 255 && r == 254 ? u0(e.slice(2)) : t == 254 && r == 255 ? h0(e.slice(2)) : t == 65279 ? e.slice(1) : e;
}, ba = function(t) {
  return String.fromCharCode(t);
}, ti = function(t) {
  return String.fromCharCode(t);
}, xf = null, ct = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function ai(e) {
  for (var t = "", r = 0, n = 0, a = 0, i = 0, f = 0, s = 0, c = 0, o = 0; o < e.length; )
    r = e.charCodeAt(o++), i = r >> 2, n = e.charCodeAt(o++), f = (r & 3) << 4 | n >> 4, a = e.charCodeAt(o++), s = (n & 15) << 2 | a >> 6, c = a & 63, isNaN(n) ? s = c = 64 : isNaN(a) && (c = 64), t += ct.charAt(i) + ct.charAt(f) + ct.charAt(s) + ct.charAt(c);
  return t;
}
function Rr(e) {
  var t = "", r = 0, n = 0, a = 0, i = 0, f = 0, s = 0, c = 0;
  if (e.slice(0, 5) == "data:") {
    var o = e.slice(0, 1024).indexOf(";base64,");
    o > -1 && (e = e.slice(o + 8));
  }
  e = e.replace(/[^\w\+\/\=]/g, "");
  for (var o = 0; o < e.length; )
    i = ct.indexOf(e.charAt(o++)), f = ct.indexOf(e.charAt(o++)), r = i << 2 | f >> 4, t += String.fromCharCode(r), s = ct.indexOf(e.charAt(o++)), n = (f & 15) << 4 | s >> 2, s !== 64 && (t += String.fromCharCode(n)), c = ct.indexOf(e.charAt(o++)), a = (s & 3) << 6 | c, c !== 64 && (t += String.fromCharCode(a));
  return t;
}
var Pe = /* @__PURE__ */ (function() {
  return typeof Buffer < "u" && typeof process < "u" && typeof process.versions < "u" && !!process.versions.node;
})(), dt = /* @__PURE__ */ (function() {
  if (typeof Buffer < "u") {
    var e = !Buffer.from;
    if (!e) try {
      Buffer.from("foo", "utf8");
    } catch {
      e = !0;
    }
    return e ? function(t, r) {
      return r ? new Buffer(t, r) : new Buffer(t);
    } : Buffer.from.bind(Buffer);
  }
  return function() {
  };
})(), ca = /* @__PURE__ */ (function() {
  if (typeof Buffer > "u") return !1;
  var e = dt([65, 0]);
  if (!e) return !1;
  var t = e.toString("utf16le");
  return t.length == 1;
})();
function lt(e) {
  return Pe ? Buffer.alloc ? Buffer.alloc(e) : new Buffer(e) : typeof Uint8Array < "u" ? new Uint8Array(e) : new Array(e);
}
function ni(e) {
  return Pe ? Buffer.allocUnsafe ? Buffer.allocUnsafe(e) : new Buffer(e) : typeof Uint8Array < "u" ? new Uint8Array(e) : new Array(e);
}
var Ir = function(t) {
  return Pe ? dt(t, "binary") : t.split("").map(function(r) {
    return r.charCodeAt(0) & 255;
  });
};
function nt(e) {
  if (Array.isArray(e)) return e.map(function(n) {
    return String.fromCharCode(n);
  }).join("");
  for (var t = [], r = 0; r < e.length; ++r) t[r] = String.fromCharCode(e[r]);
  return t.join("");
}
function Rn(e) {
  if (typeof ArrayBuffer > "u") throw new Error("Unsupported");
  if (e instanceof ArrayBuffer) return Rn(new Uint8Array(e));
  for (var t = new Array(e.length), r = 0; r < e.length; ++r) t[r] = e[r];
  return t;
}
var ft = Pe ? function(e) {
  return Buffer.concat(e.map(function(t) {
    return Buffer.isBuffer(t) ? t : dt(t);
  }));
} : function(e) {
  if (typeof Uint8Array < "u") {
    var t = 0, r = 0;
    for (t = 0; t < e.length; ++t) r += e[t].length;
    var n = new Uint8Array(r), a = 0;
    for (t = 0, r = 0; t < e.length; r += a, ++t)
      a = e[t].length, e[t] instanceof Uint8Array ? n.set(e[t], r) : typeof e[t] == "string" ? n.set(new Uint8Array(Ir(e[t])), r) : n.set(new Uint8Array(e[t]), r);
    return n;
  }
  return [].concat.apply([], e.map(function(i) {
    return Array.isArray(i) ? i : [].slice.call(i);
  }));
};
function pf(e) {
  for (var t = [], r = 0, n = e.length + 250, a = lt(e.length + 255), i = 0; i < e.length; ++i) {
    var f = e.charCodeAt(i);
    if (f < 128) a[r++] = f;
    else if (f < 2048)
      a[r++] = 192 | f >> 6 & 31, a[r++] = 128 | f & 63;
    else if (f >= 55296 && f < 57344) {
      f = (f & 1023) + 64;
      var s = e.charCodeAt(++i) & 1023;
      a[r++] = 240 | f >> 8 & 7, a[r++] = 128 | f >> 2 & 63, a[r++] = 128 | s >> 6 & 15 | (f & 3) << 4, a[r++] = 128 | s & 63;
    } else
      a[r++] = 224 | f >> 12 & 15, a[r++] = 128 | f >> 6 & 63, a[r++] = 128 | f & 63;
    r > n && (t.push(a.slice(0, r)), r = 0, a = lt(65535), n = 65530);
  }
  return t.push(a.slice(0, r)), ft(t);
}
var Fr = /\u0000/g, Kt = /[\u0001-\u0006]/g;
function Mt(e) {
  for (var t = "", r = e.length - 1; r >= 0; ) t += e.charAt(r--);
  return t;
}
function Xr(e, t) {
  var r = "" + e;
  return r.length >= t ? r : Me("0", t - r.length) + r;
}
function Nn(e, t) {
  var r = "" + e;
  return r.length >= t ? r : Me(" ", t - r.length) + r;
}
function Ha(e, t) {
  var r = "" + e;
  return r.length >= t ? r : r + Me(" ", t - r.length);
}
function mf(e, t) {
  var r = "" + Math.round(e);
  return r.length >= t ? r : Me("0", t - r.length) + r;
}
function vf(e, t) {
  var r = "" + e;
  return r.length >= t ? r : Me("0", t - r.length) + r;
}
var ii = /* @__PURE__ */ Math.pow(2, 32);
function Nt(e, t) {
  if (e > ii || e < -ii) return mf(e, t);
  var r = Math.round(e);
  return vf(r, t);
}
function Va(e, t) {
  return t = t || 0, e.length >= 7 + t && (e.charCodeAt(t) | 32) === 103 && (e.charCodeAt(t + 1) | 32) === 101 && (e.charCodeAt(t + 2) | 32) === 110 && (e.charCodeAt(t + 3) | 32) === 101 && (e.charCodeAt(t + 4) | 32) === 114 && (e.charCodeAt(t + 5) | 32) === 97 && (e.charCodeAt(t + 6) | 32) === 108;
}
var si = [
  ["Sun", "Sunday"],
  ["Mon", "Monday"],
  ["Tue", "Tuesday"],
  ["Wed", "Wednesday"],
  ["Thu", "Thursday"],
  ["Fri", "Friday"],
  ["Sat", "Saturday"]
], un = [
  ["J", "Jan", "January"],
  ["F", "Feb", "February"],
  ["M", "Mar", "March"],
  ["A", "Apr", "April"],
  ["M", "May", "May"],
  ["J", "Jun", "June"],
  ["J", "Jul", "July"],
  ["A", "Aug", "August"],
  ["S", "Sep", "September"],
  ["O", "Oct", "October"],
  ["N", "Nov", "November"],
  ["D", "Dec", "December"]
];
function gf(e) {
  return e || (e = {}), e[0] = "General", e[1] = "0", e[2] = "0.00", e[3] = "#,##0", e[4] = "#,##0.00", e[9] = "0%", e[10] = "0.00%", e[11] = "0.00E+00", e[12] = "# ?/?", e[13] = "# ??/??", e[14] = "m/d/yy", e[15] = "d-mmm-yy", e[16] = "d-mmm", e[17] = "mmm-yy", e[18] = "h:mm AM/PM", e[19] = "h:mm:ss AM/PM", e[20] = "h:mm", e[21] = "h:mm:ss", e[22] = "m/d/yy h:mm", e[37] = "#,##0 ;(#,##0)", e[38] = "#,##0 ;[Red](#,##0)", e[39] = "#,##0.00;(#,##0.00)", e[40] = "#,##0.00;[Red](#,##0.00)", e[45] = "mm:ss", e[46] = "[h]:mm:ss", e[47] = "mmss.0", e[48] = "##0.0E+0", e[49] = "@", e[56] = '"上午/下午 "hh"時"mm"分"ss"秒 "', e;
}
var be = {
  0: "General",
  1: "0",
  2: "0.00",
  3: "#,##0",
  4: "#,##0.00",
  9: "0%",
  10: "0.00%",
  11: "0.00E+00",
  12: "# ?/?",
  13: "# ??/??",
  14: "m/d/yy",
  15: "d-mmm-yy",
  16: "d-mmm",
  17: "mmm-yy",
  18: "h:mm AM/PM",
  19: "h:mm:ss AM/PM",
  20: "h:mm",
  21: "h:mm:ss",
  22: "m/d/yy h:mm",
  37: "#,##0 ;(#,##0)",
  38: "#,##0 ;[Red](#,##0)",
  39: "#,##0.00;(#,##0.00)",
  40: "#,##0.00;[Red](#,##0.00)",
  45: "mm:ss",
  46: "[h]:mm:ss",
  47: "mmss.0",
  48: "##0.0E+0",
  49: "@",
  56: '"上午/下午 "hh"時"mm"分"ss"秒 "'
}, fi = {
  5: 37,
  6: 38,
  7: 39,
  8: 40,
  //  5 -> 37 ...  8 -> 40
  23: 0,
  24: 0,
  25: 0,
  26: 0,
  // 23 ->  0 ... 26 ->  0
  27: 14,
  28: 14,
  29: 14,
  30: 14,
  31: 14,
  // 27 -> 14 ... 31 -> 14
  50: 14,
  51: 14,
  52: 14,
  53: 14,
  54: 14,
  // 50 -> 14 ... 58 -> 14
  55: 14,
  56: 14,
  57: 14,
  58: 14,
  59: 1,
  60: 2,
  61: 3,
  62: 4,
  // 59 ->  1 ... 62 ->  4
  67: 9,
  68: 10,
  // 67 ->  9 ... 68 -> 10
  69: 12,
  70: 13,
  71: 14,
  // 69 -> 12 ... 71 -> 14
  72: 14,
  73: 15,
  74: 16,
  75: 17,
  // 72 -> 14 ... 75 -> 17
  76: 20,
  77: 21,
  78: 22,
  // 76 -> 20 ... 78 -> 22
  79: 45,
  80: 46,
  81: 47,
  // 79 -> 45 ... 81 -> 47
  82: 0
  // 82 ->  0 ... 65536 -> 0 (omitted)
}, _f = {
  //  5 -- Currency,   0 decimal, black negative
  5: '"$"#,##0_);\\("$"#,##0\\)',
  63: '"$"#,##0_);\\("$"#,##0\\)',
  //  6 -- Currency,   0 decimal, red   negative
  6: '"$"#,##0_);[Red]\\("$"#,##0\\)',
  64: '"$"#,##0_);[Red]\\("$"#,##0\\)',
  //  7 -- Currency,   2 decimal, black negative
  7: '"$"#,##0.00_);\\("$"#,##0.00\\)',
  65: '"$"#,##0.00_);\\("$"#,##0.00\\)',
  //  8 -- Currency,   2 decimal, red   negative
  8: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
  66: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
  // 41 -- Accounting, 0 decimal, No Symbol
  41: '_(* #,##0_);_(* \\(#,##0\\);_(* "-"_);_(@_)',
  // 42 -- Accounting, 0 decimal, $  Symbol
  42: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
  // 43 -- Accounting, 2 decimal, No Symbol
  43: '_(* #,##0.00_);_(* \\(#,##0.00\\);_(* "-"??_);_(@_)',
  // 44 -- Accounting, 2 decimal, $  Symbol
  44: '_("$"* #,##0.00_);_("$"* \\(#,##0.00\\);_("$"* "-"??_);_(@_)'
};
function Ga(e, t, r) {
  for (var n = e < 0 ? -1 : 1, a = e * n, i = 0, f = 1, s = 0, c = 1, o = 0, u = 0, m = Math.floor(a); o < t && (m = Math.floor(a), s = m * f + i, u = m * o + c, !(a - m < 5e-8)); )
    a = 1 / (a - m), i = f, f = s, c = o, o = u;
  if (u > t && (o > t ? (u = c, s = i) : (u = o, s = f)), !r) return [0, n * s, u];
  var x = Math.floor(n * s / u);
  return [x, n * s - x * u, u];
}
function wf(e) {
  var t = e.toPrecision(16);
  if (t.indexOf("e") > -1) {
    var r = t.slice(0, t.indexOf("e"));
    return r = r.indexOf(".") > -1 ? r.slice(0, r.slice(0, 2) == "0." ? 17 : 16) : r.slice(0, 15) + Me("0", r.length - 15), r + t.slice(t.indexOf("e"));
  }
  var n = t.indexOf(".") > -1 ? t.slice(0, t.slice(0, 2) == "0." ? 17 : 16) : t.slice(0, 15) + Me("0", t.length - 15);
  return Number(n);
}
function qr(e, t, r) {
  if (e > 2958465 || e < 0) return null;
  e = wf(e);
  var n = e | 0, a = Math.floor(86400 * (e - n)), i = 0, f = [], s = { D: n, T: a, u: 86400 * (e - n) - a, y: 0, m: 0, d: 0, H: 0, M: 0, S: 0, q: 0 };
  if (Math.abs(s.u) < 1e-6 && (s.u = 0), t && t.date1904 && (n += 1462), s.u > 0.9999 && (s.u = 0, ++a == 86400 && (s.T = a = 0, ++n, ++s.D)), n === 60)
    f = r ? [1317, 10, 29] : [1900, 2, 29], i = 3;
  else if (n === 0)
    f = r ? [1317, 8, 29] : [1900, 1, 0], i = 6;
  else {
    n > 60 && --n;
    var c = new Date(1900, 0, 1);
    c.setDate(c.getDate() + n - 1), f = [c.getFullYear(), c.getMonth() + 1, c.getDate()], i = c.getDay(), n < 60 && (i = (i + 6) % 7), r && (i = yf(c, f));
  }
  return s.y = f[0], s.m = f[1], s.d = f[2], s.S = a % 60, a = Math.floor(a / 60), s.M = a % 60, a = Math.floor(a / 60), s.H = a, s.q = i, s;
}
function Pn(e) {
  return e.indexOf(".") == -1 ? e : e.replace(/(?:\.0*|(\.\d*[1-9])0+)$/, "$1");
}
function kf(e) {
  return e.indexOf("E") == -1 ? e : e.replace(/(?:\.0*|(\.\d*[1-9])0+)[Ee]/, "$1E").replace(/(E[+-])(\d)$/, "$10$2");
}
function Ef(e) {
  var t = e < 0 ? 12 : 11, r = Pn(e.toFixed(12));
  return r.length <= t || (r = e.toPrecision(10), r.length <= t) ? r : e.toExponential(5);
}
function Tf(e) {
  var t = Pn(e.toFixed(11));
  return t.length > (e < 0 ? 12 : 11) || t === "0" || t === "-0" ? e.toPrecision(6) : t;
}
function oa(e) {
  if (!isFinite(e)) return isNaN(e) ? "#NUM!" : "#DIV/0!";
  var t = Math.floor(Math.log(Math.abs(e)) * Math.LOG10E), r;
  return t >= -4 && t <= -1 ? r = e.toPrecision(10 + t) : Math.abs(t) <= 9 ? r = Ef(e) : t === 10 ? r = e.toFixed(10).substr(0, 12) : r = Tf(e), Pn(kf(r.toUpperCase()));
}
function At(e, t) {
  switch (typeof e) {
    case "string":
      return e;
    case "boolean":
      return e ? "TRUE" : "FALSE";
    case "number":
      return (e | 0) === e ? e.toString(10) : oa(e);
    case "undefined":
      return "";
    case "object":
      if (e == null) return "";
      if (e instanceof Date) return Nr(14, sr(e, t && t.date1904), t);
  }
  throw new Error("unsupported value in General format: " + e);
}
function yf(e, t) {
  t[0] -= 581;
  var r = e.getDay();
  return e < 60 && (r = (r + 6) % 7), r;
}
function Af(e, t, r, n) {
  var a = "", i = 0, f = 0, s = r.y, c, o = 0;
  switch (e) {
    case 98:
      s = r.y + 543;
    /* falls through */
    case 121:
      switch (t.length) {
        case 1:
        case 2:
          c = s % 100, o = 2;
          break;
        default:
          c = s % 1e4, o = 4;
          break;
      }
      break;
    case 109:
      switch (t.length) {
        case 1:
        case 2:
          c = r.m, o = t.length;
          break;
        case 3:
          return un[r.m - 1][1];
        case 5:
          return un[r.m - 1][0];
        default:
          return un[r.m - 1][2];
      }
      break;
    case 100:
      switch (t.length) {
        case 1:
        case 2:
          c = r.d, o = t.length;
          break;
        case 3:
          return si[r.q][0];
        default:
          return si[r.q][1];
      }
      break;
    case 104:
      switch (t.length) {
        case 1:
        case 2:
          c = 1 + (r.H + 11) % 12, o = t.length;
          break;
        default:
          throw "bad hour format: " + t;
      }
      break;
    case 72:
      switch (t.length) {
        case 1:
        case 2:
          c = r.H, o = t.length;
          break;
        default:
          throw "bad hour format: " + t;
      }
      break;
    case 77:
      switch (t.length) {
        case 1:
        case 2:
          c = r.M, o = t.length;
          break;
        default:
          throw "bad minute format: " + t;
      }
      break;
    case 115:
      if (t != "s" && t != "ss" && t != ".0" && t != ".00" && t != ".000") throw "bad second format: " + t;
      return r.u === 0 && (t == "s" || t == "ss") ? Xr(r.S, t.length) : (n >= 2 ? f = n === 3 ? 1e3 : 100 : f = n === 1 ? 10 : 1, i = Math.round(f * (r.S + r.u)), i >= 60 * f && (i = 0), t === "s" ? i === 0 ? "0" : "" + i / f : (a = Xr(i, 2 + n), t === "ss" ? a.substr(0, 2) : "." + a.substr(2, t.length - 1)));
    case 90:
      switch (t) {
        case "[h]":
        case "[hh]":
          c = r.D * 24 + r.H;
          break;
        case "[m]":
        case "[mm]":
          c = (r.D * 24 + r.H) * 60 + r.M;
          break;
        case "[s]":
        case "[ss]":
          c = ((r.D * 24 + r.H) * 60 + r.M) * 60 + (n == 0 ? Math.round(r.S + r.u) : r.S);
          break;
        default:
          throw "bad abstime format: " + t;
      }
      o = t.length === 3 ? 1 : 2;
      break;
    case 101:
      c = s, o = 1;
      break;
  }
  var u = o > 0 ? Xr(c, o) : "";
  return u;
}
function et(e) {
  var t = 3;
  if (e.length <= t) return e;
  for (var r = e.length % t, n = e.substr(0, r); r != e.length; r += t) n += (n.length > 0 ? "," : "") + e.substr(r, t);
  return n;
}
var d0 = /%/g;
function Ff(e, t, r) {
  var n = t.replace(d0, ""), a = t.length - n.length;
  return tt(e, n, r * Math.pow(10, 2 * a)) + Me("%", a);
}
function Sf(e, t, r) {
  for (var n = t.length - 1; t.charCodeAt(n - 1) === 44; ) --n;
  return tt(e, t.substr(0, n), r / Math.pow(10, 3 * (t.length - n)));
}
function x0(e, t) {
  var r, n = e.indexOf("E") - e.indexOf(".") - 1;
  if (e.match(/^#+0.0E\+0$/)) {
    if (t == 0) return "0.0E+0";
    if (t < 0) return "-" + x0(e, -t);
    var a = e.indexOf(".");
    a === -1 && (a = e.indexOf("E"));
    var i = Math.floor(Math.log(t) * Math.LOG10E) % a;
    if (i < 0 && (i += a), r = (t / Math.pow(10, i)).toPrecision(n + 1 + (a + i) % a), r.indexOf("e") === -1) {
      var f = Math.floor(Math.log(t) * Math.LOG10E);
      for (r.indexOf(".") === -1 ? r = r.charAt(0) + "." + r.substr(1) + "E+" + (f - r.length + i) : r += "E+" + (f - i); r.substr(0, 2) === "0."; )
        r = r.charAt(0) + r.substr(2, a) + "." + r.substr(2 + a), r = r.replace(/^0+([1-9])/, "$1").replace(/^0+\./, "0.");
      r = r.replace(/\+-/, "-");
    }
    r = r.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function(s, c, o, u) {
      return c + o + u.substr(0, (a + i) % a) + "." + u.substr(i) + "E";
    });
  } else r = t.toExponential(n);
  return e.match(/E\+00$/) && r.match(/e[+-]\d$/) && (r = r.substr(0, r.length - 1) + "0" + r.charAt(r.length - 1)), e.match(/E\-/) && r.match(/e\+/) && (r = r.replace(/e\+/, "e")), r.replace("e", "E");
}
var p0 = /# (\?+)( ?)\/( ?)(\d+)/;
function Cf(e, t, r) {
  var n = parseInt(e[4], 10), a = Math.round(t * n), i = Math.floor(a / n), f = a - i * n, s = n;
  return r + (i === 0 ? "" : "" + i) + " " + (f === 0 ? Me(" ", e[1].length + 1 + e[4].length) : Nn(f, e[1].length) + e[2] + "/" + e[3] + Xr(s, e[4].length));
}
function bf(e, t, r) {
  return r + (t === 0 ? "" : "" + t) + Me(" ", e[1].length + 2 + e[4].length);
}
var m0 = /^#*0*\.([0#]+)/, v0 = /\)[^)]*[0#]/, g0 = /\(###\) ###\\?-####/;
function Er(e) {
  for (var t = "", r, n = 0; n != e.length; ++n) switch (r = e.charCodeAt(n)) {
    case 35:
      break;
    case 63:
      t += " ";
      break;
    case 48:
      t += "0";
      break;
    default:
      t += String.fromCharCode(r);
  }
  return t;
}
function ci(e, t) {
  var r = Math.pow(10, t);
  return "" + Math.round(e * r) / r;
}
function oi(e, t) {
  var r = e - Math.floor(e), n = Math.pow(10, t);
  return t < ("" + Math.round(r * n)).length ? 0 : Math.round(r * n);
}
function If(e, t) {
  return t < ("" + Math.round((e - Math.floor(e)) * Math.pow(10, t))).length ? 1 : 0;
}
function Of(e) {
  return e < 2147483647 && e > -2147483648 ? "" + (e >= 0 ? e | 0 : e - 1 | 0) : "" + Math.floor(e);
}
function Br(e, t, r) {
  if (e.charCodeAt(0) === 40 && !t.match(v0)) {
    var n = t.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
    return r >= 0 ? Br("n", n, r) : "(" + Br("n", n, -r) + ")";
  }
  if (t.charCodeAt(t.length - 1) === 44) return Sf(e, t, r);
  if (t.indexOf("%") !== -1) return Ff(e, t, r);
  if (t.indexOf("E") !== -1) return x0(t, r);
  if (t.charCodeAt(0) === 36) return "$" + Br(e, t.substr(t.charAt(1) == " " ? 2 : 1), r);
  var a, i, f, s, c = Math.abs(r), o = r < 0 ? "-" : "";
  if (t.match(/^00+$/)) return o + Nt(c, t.length);
  if (t.match(/^[#?]+$/))
    return a = Nt(r, 0), a === "0" && (a = ""), a.length > t.length ? a : Er(t.substr(0, t.length - a.length)) + a;
  if (i = t.match(p0)) return Cf(i, c, o);
  if (t.match(/^#+0+$/)) return o + Nt(c, t.length - t.indexOf("0"));
  if (i = t.match(m0))
    return a = ci(r, i[1].length).replace(/^([^\.]+)$/, "$1." + Er(i[1])).replace(/\.$/, "." + Er(i[1])).replace(/\.(\d*)$/, function(v, p) {
      return "." + p + Me("0", Er(
        /*::(*/
        i[1]
      ).length - p.length);
    }), t.indexOf("0.") !== -1 ? a : a.replace(/^0\./, ".");
  if (t = t.replace(/^#+([0.])/, "$1"), i = t.match(/^(0*)\.(#*)$/))
    return o + ci(c, i[2].length).replace(/\.(\d*[1-9])0*$/, ".$1").replace(/^(-?\d*)$/, "$1.").replace(/^0\./, i[1].length ? "0." : ".");
  if (i = t.match(/^#{1,3},##0(\.?)$/)) return o + et(Nt(c, 0));
  if (i = t.match(/^#,##0\.([#0]*0)$/))
    return r < 0 ? "-" + Br(e, t, -r) : et("" + (Math.floor(r) + If(r, i[1].length))) + "." + Xr(oi(r, i[1].length), i[1].length);
  if (i = t.match(/^#,#*,#0/)) return Br(e, t.replace(/^#,#*,/, ""), r);
  if (i = t.match(/^([0#]+)(\\?-([0#]+))+$/))
    return a = Mt(Br(e, t.replace(/[\\-]/g, ""), r)), f = 0, Mt(Mt(t.replace(/\\/g, "")).replace(/[0#]/g, function(v) {
      return f < a.length ? a.charAt(f++) : v === "0" ? "0" : "";
    }));
  if (t.match(g0))
    return a = Br(e, "##########", r), "(" + a.substr(0, 3) + ") " + a.substr(3, 3) + "-" + a.substr(6);
  var u = "";
  if (i = t.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/))
    return f = Math.min(
      /*::String(*/
      i[4].length,
      7
    ), s = Ga(c, Math.pow(10, f) - 1, !1), a = "" + o, u = tt(
      "n",
      /*::String(*/
      i[1],
      s[1]
    ), u.charAt(u.length - 1) == " " && (u = u.substr(0, u.length - 1) + "0"), a += u + /*::String(*/
    i[2] + "/" + /*::String(*/
    i[3], u = Ha(s[2], f), u.length < i[4].length && (u = Er(i[4].substr(i[4].length - u.length)) + u), a += u, a;
  if (i = t.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/))
    return f = Math.min(Math.max(i[1].length, i[4].length), 7), s = Ga(c, Math.pow(10, f) - 1, !0), o + (s[0] || (s[1] ? "" : "0")) + " " + (s[1] ? Nn(s[1], f) + i[2] + "/" + i[3] + Ha(s[2], f) : Me(" ", 2 * f + 1 + i[2].length + i[3].length));
  if (i = t.match(/^[#0?]+$/))
    return a = Nt(r, 0), t.length <= a.length ? a : Er(t.substr(0, t.length - a.length)) + a;
  if (i = t.match(/^([#0?]+)\.([#0]+)$/)) {
    a = "" + r.toFixed(Math.min(i[2].length, 10)).replace(/([^0])0+$/, "$1"), f = a.indexOf(".");
    var m = t.indexOf(".") - f, x = t.length - a.length - m;
    return Er(t.substr(0, m) + a + t.substr(t.length - x));
  }
  if (i = t.match(/^00,000\.([#0]*0)$/))
    return f = oi(r, i[1].length), r < 0 ? "-" + Br(e, t, -r) : et(Of(r)).replace(/^\d,\d{3}$/, "0$&").replace(/^\d*$/, function(v) {
      return "00," + (v.length < 3 ? Xr(0, 3 - v.length) : "") + v;
    }) + "." + Xr(f, i[1].length);
  switch (t) {
    case "###,##0.00":
      return Br(e, "#,##0.00", r);
    case "###,###":
    case "##,###":
    case "#,###":
      var l = et(Nt(c, 0));
      return l !== "0" ? o + l : "";
    case "###,###.00":
      return Br(e, "###,##0.00", r).replace(/^0\./, ".");
    case "#,###.00":
      return Br(e, "#,##0.00", r).replace(/^0\./, ".");
  }
  throw new Error("unsupported format |" + t + "|");
}
function Df(e, t, r) {
  for (var n = t.length - 1; t.charCodeAt(n - 1) === 44; ) --n;
  return tt(e, t.substr(0, n), r / Math.pow(10, 3 * (t.length - n)));
}
function Rf(e, t, r) {
  var n = t.replace(d0, ""), a = t.length - n.length;
  return tt(e, n, r * Math.pow(10, 2 * a)) + Me("%", a);
}
function _0(e, t) {
  var r, n = e.indexOf("E") - e.indexOf(".") - 1;
  if (e.match(/^#+0.0E\+0$/)) {
    if (t == 0) return "0.0E+0";
    if (t < 0) return "-" + _0(e, -t);
    var a = e.indexOf(".");
    a === -1 && (a = e.indexOf("E"));
    var i = Math.floor(Math.log(t) * Math.LOG10E) % a;
    if (i < 0 && (i += a), r = (t / Math.pow(10, i)).toPrecision(n + 1 + (a + i) % a), !r.match(/[Ee]/)) {
      var f = Math.floor(Math.log(t) * Math.LOG10E);
      r.indexOf(".") === -1 ? r = r.charAt(0) + "." + r.substr(1) + "E+" + (f - r.length + i) : r += "E+" + (f - i), r = r.replace(/\+-/, "-");
    }
    r = r.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function(s, c, o, u) {
      return c + o + u.substr(0, (a + i) % a) + "." + u.substr(i) + "E";
    });
  } else r = t.toExponential(n);
  return e.match(/E\+00$/) && r.match(/e[+-]\d$/) && (r = r.substr(0, r.length - 1) + "0" + r.charAt(r.length - 1)), e.match(/E\-/) && r.match(/e\+/) && (r = r.replace(/e\+/, "e")), r.replace("e", "E");
}
function Zr(e, t, r) {
  if (e.charCodeAt(0) === 40 && !t.match(v0)) {
    var n = t.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
    return r >= 0 ? Zr("n", n, r) : "(" + Zr("n", n, -r) + ")";
  }
  if (t.charCodeAt(t.length - 1) === 44) return Df(e, t, r);
  if (t.indexOf("%") !== -1) return Rf(e, t, r);
  if (t.indexOf("E") !== -1) return _0(t, r);
  if (t.charCodeAt(0) === 36) return "$" + Zr(e, t.substr(t.charAt(1) == " " ? 2 : 1), r);
  var a, i, f, s, c = Math.abs(r), o = r < 0 ? "-" : "";
  if (t.match(/^00+$/)) return o + Xr(c, t.length);
  if (t.match(/^[#?]+$/))
    return a = "" + r, r === 0 && (a = ""), a.length > t.length ? a : Er(t.substr(0, t.length - a.length)) + a;
  if (i = t.match(p0)) return bf(i, c, o);
  if (t.match(/^#+0+$/)) return o + Xr(c, t.length - t.indexOf("0"));
  if (i = t.match(m0))
    return a = ("" + r).replace(/^([^\.]+)$/, "$1." + Er(i[1])).replace(/\.$/, "." + Er(i[1])), a = a.replace(/\.(\d*)$/, function(v, p) {
      return "." + p + Me("0", Er(i[1]).length - p.length);
    }), t.indexOf("0.") !== -1 ? a : a.replace(/^0\./, ".");
  if (t = t.replace(/^#+([0.])/, "$1"), i = t.match(/^(0*)\.(#*)$/))
    return o + ("" + c).replace(/\.(\d*[1-9])0*$/, ".$1").replace(/^(-?\d*)$/, "$1.").replace(/^0\./, i[1].length ? "0." : ".");
  if (i = t.match(/^#{1,3},##0(\.?)$/)) return o + et("" + c);
  if (i = t.match(/^#,##0\.([#0]*0)$/))
    return r < 0 ? "-" + Zr(e, t, -r) : et("" + r) + "." + Me("0", i[1].length);
  if (i = t.match(/^#,#*,#0/)) return Zr(e, t.replace(/^#,#*,/, ""), r);
  if (i = t.match(/^([0#]+)(\\?-([0#]+))+$/))
    return a = Mt(Zr(e, t.replace(/[\\-]/g, ""), r)), f = 0, Mt(Mt(t.replace(/\\/g, "")).replace(/[0#]/g, function(v) {
      return f < a.length ? a.charAt(f++) : v === "0" ? "0" : "";
    }));
  if (t.match(g0))
    return a = Zr(e, "##########", r), "(" + a.substr(0, 3) + ") " + a.substr(3, 3) + "-" + a.substr(6);
  var u = "";
  if (i = t.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/))
    return f = Math.min(
      /*::String(*/
      i[4].length,
      7
    ), s = Ga(c, Math.pow(10, f) - 1, !1), a = "" + o, u = tt(
      "n",
      /*::String(*/
      i[1],
      s[1]
    ), u.charAt(u.length - 1) == " " && (u = u.substr(0, u.length - 1) + "0"), a += u + /*::String(*/
    i[2] + "/" + /*::String(*/
    i[3], u = Ha(s[2], f), u.length < i[4].length && (u = Er(i[4].substr(i[4].length - u.length)) + u), a += u, a;
  if (i = t.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/))
    return f = Math.min(Math.max(i[1].length, i[4].length), 7), s = Ga(c, Math.pow(10, f) - 1, !0), o + (s[0] || (s[1] ? "" : "0")) + " " + (s[1] ? Nn(s[1], f) + i[2] + "/" + i[3] + Ha(s[2], f) : Me(" ", 2 * f + 1 + i[2].length + i[3].length));
  if (i = t.match(/^[#0?]+$/))
    return a = "" + r, t.length <= a.length ? a : Er(t.substr(0, t.length - a.length)) + a;
  if (i = t.match(/^([#0]+)\.([#0]+)$/)) {
    a = "" + r.toFixed(Math.min(i[2].length, 10)).replace(/([^0])0+$/, "$1"), f = a.indexOf(".");
    var m = t.indexOf(".") - f, x = t.length - a.length - m;
    return Er(t.substr(0, m) + a + t.substr(t.length - x));
  }
  if (i = t.match(/^00,000\.([#0]*0)$/))
    return r < 0 ? "-" + Zr(e, t, -r) : et("" + r).replace(/^\d,\d{3}$/, "0$&").replace(/^\d*$/, function(v) {
      return "00," + (v.length < 3 ? Xr(0, 3 - v.length) : "") + v;
    }) + "." + Xr(0, i[1].length);
  switch (t) {
    case "###,###":
    case "##,###":
    case "#,###":
      var l = et("" + c);
      return l !== "0" ? o + l : "";
    default:
      if (t.match(/\.[0#?]*$/)) return Zr(e, t.slice(0, t.lastIndexOf(".")), r) + Er(t.slice(t.lastIndexOf(".")));
  }
  throw new Error("unsupported format |" + t + "|");
}
function tt(e, t, r) {
  return (r | 0) === r ? Zr(e, t, r) : Br(e, t, r);
}
function Nf(e) {
  for (var t = [], r = !1, n = 0, a = 0; n < e.length; ++n) switch (
    /*cc=*/
    e.charCodeAt(n)
  ) {
    case 34:
      r = !r;
      break;
    case 95:
    case 42:
    case 92:
      ++n;
      break;
    case 59:
      t[t.length] = e.substr(a, n - a), a = n + 1;
  }
  if (t[t.length] = e.substr(a), r === !0) throw new Error("Format |" + e + "| unterminated string ");
  return t;
}
var w0 = /\[[HhMmSs\u0E0A\u0E19\u0E17]*\]/;
function $r(e) {
  for (var t = 0, r = "", n = ""; t < e.length; )
    switch (r = e.charAt(t)) {
      case "G":
        Va(e, t) && (t += 6), t++;
        break;
      case '"':
        for (
          ;
          /*cc=*/
          e.charCodeAt(++t) !== 34 && t < e.length;
        )
          ;
        ++t;
        break;
      case "\\":
        t += 2;
        break;
      case "_":
        t += 2;
        break;
      case "@":
        ++t;
        break;
      case "B":
      case "b":
        if (e.charAt(t + 1) === "1" || e.charAt(t + 1) === "2") return !0;
      /* falls through */
      case "M":
      case "D":
      case "Y":
      case "H":
      case "S":
      case "E":
      /* falls through */
      case "m":
      case "d":
      case "y":
      case "h":
      case "s":
      case "e":
      case "g":
        return !0;
      case "A":
      case "a":
      case "上":
        if (e.substr(t, 3).toUpperCase() === "A/P" || e.substr(t, 5).toUpperCase() === "AM/PM" || e.substr(t, 5).toUpperCase() === "上午/下午") return !0;
        ++t;
        break;
      case "[":
        for (n = r; e.charAt(t++) !== "]" && t < e.length; ) n += e.charAt(t);
        if (n.match(w0)) return !0;
        break;
      case ".":
      /* falls through */
      case "0":
      case "#":
        for (; t < e.length && ("0#?.,E+-%".indexOf(r = e.charAt(++t)) > -1 || r == "\\" && e.charAt(t + 1) == "-" && "0#".indexOf(e.charAt(t + 2)) > -1); )
          ;
        break;
      case "?":
        for (; e.charAt(++t) === r; )
          ;
        break;
      case "*":
        ++t, (e.charAt(t) == " " || e.charAt(t) == "*") && ++t;
        break;
      case "(":
      case ")":
        ++t;
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        for (; t < e.length && "0123456789".indexOf(e.charAt(++t)) > -1; )
          ;
        break;
      case " ":
        ++t;
        break;
      default:
        ++t;
        break;
    }
  return !1;
}
function Pf(e, t, r, n) {
  for (var a = [], i = "", f = 0, s = "", c = "t", o, u, m, x = "H"; f < e.length; )
    switch (s = e.charAt(f)) {
      case "G":
        if (!Va(e, f)) throw new Error("unrecognized character " + s + " in " + e);
        a[a.length] = { t: "G", v: "General" }, f += 7;
        break;
      case '"':
        for (i = ""; (m = e.charCodeAt(++f)) !== 34 && f < e.length; ) i += String.fromCharCode(m);
        a[a.length] = { t: "t", v: i }, ++f;
        break;
      case "\\":
        var l = e.charAt(++f), v = l === "(" || l === ")" ? l : "t";
        a[a.length] = { t: v, v: l }, ++f;
        break;
      case "_":
        a[a.length] = { t: "t", v: " " }, f += 2;
        break;
      case "@":
        a[a.length] = { t: "T", v: t }, ++f;
        break;
      case "B":
      case "b":
        if (e.charAt(f + 1) === "1" || e.charAt(f + 1) === "2") {
          if (o == null && (o = qr(t, r, e.charAt(f + 1) === "2"), o == null))
            return "";
          a[a.length] = { t: "X", v: e.substr(f, 2) }, c = s, f += 2;
          break;
        }
      /* falls through */
      case "M":
      case "D":
      case "Y":
      case "H":
      case "S":
      case "E":
        s = s.toLowerCase();
      /* falls through */
      case "m":
      case "d":
      case "y":
      case "h":
      case "s":
      case "e":
      case "g":
        if (t < 0 || o == null && (o = qr(t, r), o == null))
          return "";
        for (i = s; ++f < e.length && e.charAt(f).toLowerCase() === s; ) i += s;
        s === "m" && c.toLowerCase() === "h" && (s = "M"), s === "h" && (s = x), a[a.length] = { t: s, v: i }, c = s;
        break;
      case "A":
      case "a":
      case "上":
        var p = { t: s, v: s };
        if (o == null && (o = qr(t, r)), e.substr(f, 3).toUpperCase() === "A/P" ? (o != null && (p.v = o.H >= 12 ? e.charAt(f + 2) : s), p.t = "T", x = "h", f += 3) : e.substr(f, 5).toUpperCase() === "AM/PM" ? (o != null && (p.v = o.H >= 12 ? "PM" : "AM"), p.t = "T", f += 5, x = "h") : e.substr(f, 5).toUpperCase() === "上午/下午" ? (o != null && (p.v = o.H >= 12 ? "下午" : "上午"), p.t = "T", f += 5, x = "h") : (p.t = "t", ++f), o == null && p.t === "T") return "";
        a[a.length] = p, c = s;
        break;
      case "[":
        for (i = s; e.charAt(f++) !== "]" && f < e.length; ) i += e.charAt(f);
        if (i.slice(-1) !== "]") throw 'unterminated "[" block: |' + i + "|";
        if (i.match(w0)) {
          if (o == null && (o = qr(t, r), o == null))
            return "";
          a[a.length] = { t: "Z", v: i.toLowerCase() }, c = i.charAt(1);
        } else i.indexOf("$") > -1 && (i = (i.match(/\$([^-\[\]]*)/) || [])[1] || "$", $r(e) || (a[a.length] = { t: "t", v: i }));
        break;
      /* Numbers */
      case ".":
        if (o != null) {
          for (i = s; ++f < e.length && (s = e.charAt(f)) === "0"; ) i += s;
          a[a.length] = { t: "s", v: i };
          break;
        }
      /* falls through */
      case "0":
      case "#":
        for (i = s; ++f < e.length && "0#?.,E+-%".indexOf(s = e.charAt(f)) > -1; ) i += s;
        a[a.length] = { t: "n", v: i };
        break;
      case "?":
        for (i = s; e.charAt(++f) === s; ) i += s;
        a[a.length] = { t: s, v: i }, c = s;
        break;
      case "*":
        ++f, (e.charAt(f) == " " || e.charAt(f) == "*") && ++f;
        break;
      // **
      case "(":
      case ")":
        a[a.length] = { t: n === 1 ? "t" : s, v: s }, ++f;
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        for (i = s; f < e.length && "0123456789".indexOf(e.charAt(++f)) > -1; ) i += e.charAt(f);
        a[a.length] = { t: "D", v: i };
        break;
      case " ":
        a[a.length] = { t: s, v: s }, ++f;
        break;
      case "$":
        a[a.length] = { t: "t", v: "$" }, ++f;
        break;
      default:
        if (",$-+/():!^&'~{}<>=€acfijklopqrtuvwxzP".indexOf(s) === -1) throw new Error("unrecognized character " + s + " in " + e);
        a[a.length] = { t: "t", v: s }, ++f;
        break;
    }
  var d = 0, h = 0, _;
  for (f = a.length - 1, c = "t"; f >= 0; --f)
    switch (a[f].t) {
      case "h":
      case "H":
        a[f].t = x, c = "h", d < 1 && (d = 1);
        break;
      case "s":
        (_ = a[f].v.match(/\.0+$/)) && (h = Math.max(h, _[0].length - 1), d = 4), d < 3 && (d = 3);
      /* falls through */
      case "d":
      case "y":
      case "e":
        c = a[f].t;
        break;
      case "M":
        c = a[f].t, d < 2 && (d = 2);
        break;
      case "m":
        c === "s" && (a[f].t = "M", d < 2 && (d = 2));
        break;
      case "X":
        break;
      case "Z":
        d < 1 && a[f].v.match(/[Hh]/) && (d = 1), d < 2 && a[f].v.match(/[Mm]/) && (d = 2), d < 3 && a[f].v.match(/[Ss]/) && (d = 3);
    }
  var g;
  switch (d) {
    case 0:
      break;
    case 1:
    case 2:
    case 3:
      o.u >= 0.5 && (o.u = 0, ++o.S), o.S >= 60 && (o.S = 0, ++o.M), o.M >= 60 && (o.M = 0, ++o.H), o.H >= 24 && (o.H = 0, ++o.D, g = qr(o.D), g.u = o.u, g.S = o.S, g.M = o.M, g.H = o.H, o = g);
      break;
    case 4:
      switch (h) {
        case 1:
          o.u = Math.round(o.u * 10) / 10;
          break;
        case 2:
          o.u = Math.round(o.u * 100) / 100;
          break;
        case 3:
          o.u = Math.round(o.u * 1e3) / 1e3;
          break;
      }
      o.u >= 1 && (o.u = 0, ++o.S), o.S >= 60 && (o.S = 0, ++o.M), o.M >= 60 && (o.M = 0, ++o.H), o.H >= 24 && (o.H = 0, ++o.D, g = qr(o.D), g.u = o.u, g.S = o.S, g.M = o.M, g.H = o.H, o = g);
      break;
  }
  var E = "", A;
  for (f = 0; f < a.length; ++f)
    switch (a[f].t) {
      case "t":
      case "T":
      case " ":
      case "D":
        break;
      case "X":
        a[f].v = "", a[f].t = ";";
        break;
      case "d":
      case "m":
      case "y":
      case "h":
      case "H":
      case "M":
      case "s":
      case "e":
      case "b":
      case "Z":
        a[f].v = Af(a[f].t.charCodeAt(0), a[f].v, o, h), a[f].t = "t";
        break;
      case "n":
      case "?":
        for (A = f + 1; a[A] != null && ((s = a[A].t) === "?" || s === "D" || (s === " " || s === "t") && a[A + 1] != null && (a[A + 1].t === "?" || a[A + 1].t === "t" && a[A + 1].v === "/") || a[f].t === "(" && (s === " " || s === "n" || s === ")") || s === "t" && (a[A].v === "/" || a[A].v === " " && a[A + 1] != null && a[A + 1].t == "?")); )
          a[f].v += a[A].v, a[A] = { v: "", t: ";" }, ++A;
        E += a[f].v, f = A - 1;
        break;
      case "G":
        a[f].t = "t", a[f].v = At(t, r);
        break;
    }
  var P = "", S, R;
  if (E.length > 0) {
    E.charCodeAt(0) == 40 ? (S = t < 0 && E.charCodeAt(0) === 45 ? -t : t, R = tt("n", E, S)) : (S = t < 0 && n > 1 ? -t : t, R = tt("n", E, S), S < 0 && a[0] && a[0].t == "t" && (R = R.substr(1), a[0].v = "-" + a[0].v)), A = R.length - 1;
    var F = a.length;
    for (f = 0; f < a.length; ++f) if (a[f] != null && a[f].t != "t" && a[f].v.indexOf(".") > -1) {
      F = f;
      break;
    }
    var U = a.length;
    if (F === a.length && R.indexOf("E") === -1) {
      for (f = a.length - 1; f >= 0; --f)
        a[f] == null || "n?".indexOf(a[f].t) === -1 || (A >= a[f].v.length - 1 ? (A -= a[f].v.length, a[f].v = R.substr(A + 1, a[f].v.length)) : A < 0 ? a[f].v = "" : (a[f].v = R.substr(0, A + 1), A = -1), a[f].t = "t", U = f);
      A >= 0 && U < a.length && (a[U].v = R.substr(0, A + 1) + a[U].v);
    } else if (F !== a.length && R.indexOf("E") === -1) {
      for (A = R.indexOf(".") - 1, f = F; f >= 0; --f)
        if (!(a[f] == null || "n?".indexOf(a[f].t) === -1)) {
          for (u = a[f].v.indexOf(".") > -1 && f === F ? a[f].v.indexOf(".") - 1 : a[f].v.length - 1, P = a[f].v.substr(u + 1); u >= 0; --u)
            A >= 0 && (a[f].v.charAt(u) === "0" || a[f].v.charAt(u) === "#") && (P = R.charAt(A--) + P);
          a[f].v = P, a[f].t = "t", U = f;
        }
      for (A >= 0 && U < a.length && (a[U].v = R.substr(0, A + 1) + a[U].v), A = R.indexOf(".") + 1, f = F; f < a.length; ++f)
        if (!(a[f] == null || "n?(".indexOf(a[f].t) === -1 && f !== F)) {
          for (u = a[f].v.indexOf(".") > -1 && f === F ? a[f].v.indexOf(".") + 1 : 0, P = a[f].v.substr(0, u); u < a[f].v.length; ++u)
            A < R.length && (P += R.charAt(A++));
          a[f].v = P, a[f].t = "t", U = f;
        }
    }
  }
  for (f = 0; f < a.length; ++f) a[f] != null && "n?".indexOf(a[f].t) > -1 && (S = n > 1 && t < 0 && f > 0 && a[f - 1].v === "-" ? -t : t, a[f].v = tt(a[f].t, a[f].v, S), a[f].t = "t");
  var H = "";
  for (f = 0; f !== a.length; ++f) a[f] != null && (H += a[f].v);
  return H;
}
var li = /\[(=|>[=]?|<[>=]?)(-?\d+(?:\.\d*)?)\]/;
function ui(e, t) {
  if (t == null) return !1;
  var r = parseFloat(t[2]);
  switch (t[1]) {
    case "=":
      if (e == r) return !0;
      break;
    case ">":
      if (e > r) return !0;
      break;
    case "<":
      if (e < r) return !0;
      break;
    case "<>":
      if (e != r) return !0;
      break;
    case ">=":
      if (e >= r) return !0;
      break;
    case "<=":
      if (e <= r) return !0;
      break;
  }
  return !1;
}
function Bf(e, t) {
  var r = Nf(e), n = r.length, a = r[n - 1].indexOf("@");
  if (n < 4 && a > -1 && --n, r.length > 4) throw new Error("cannot find right format for |" + r.join("|") + "|");
  if (typeof t != "number") return [4, r.length === 4 || a > -1 ? r[r.length - 1] : "@"];
  switch (typeof t == "number" && !isFinite(t) && (t = 0), r.length) {
    case 1:
      r = a > -1 ? ["General", "General", "General", r[0]] : [r[0], r[0], r[0], "@"];
      break;
    case 2:
      r = a > -1 ? [r[0], r[0], r[0], r[1]] : [r[0], r[1], r[0], "@"];
      break;
    case 3:
      r = a > -1 ? [r[0], r[1], r[0], r[2]] : [r[0], r[1], r[2], "@"];
      break;
  }
  var i = t > 0 ? r[0] : t < 0 ? r[1] : r[2];
  if (r[0].indexOf("[") === -1 && r[1].indexOf("[") === -1) return [n, i];
  if (r[0].match(/\[[=<>]/) != null || r[1].match(/\[[=<>]/) != null) {
    var f = r[0].match(li), s = r[1].match(li);
    return ui(t, f) ? [n, r[0]] : ui(t, s) ? [n, r[1]] : [n, r[f != null && s != null ? 2 : 1]];
  }
  return [n, i];
}
function Nr(e, t, r) {
  r == null && (r = {});
  var n = "";
  switch (typeof e) {
    case "string":
      e == "m/d/yy" && r.dateNF ? n = r.dateNF : n = e;
      break;
    case "number":
      e == 14 && r.dateNF ? n = r.dateNF : n = (r.table != null ? r.table : be)[e], n == null && (n = r.table && r.table[fi[e]] || be[fi[e]]), n == null && (n = _f[e] || "General");
      break;
  }
  if (Va(n, 0)) return At(t, r);
  t instanceof Date && (t = sr(t, r.date1904));
  var a = Bf(n, t);
  if (Va(a[1])) return At(t, r);
  if (t === !0) t = "TRUE";
  else if (t === !1) t = "FALSE";
  else {
    if (t === "" || t == null) return "";
    if (isNaN(t) && a[1].indexOf("0") > -1) return "#NUM!";
    if (!isFinite(t) && a[1].indexOf("0") > -1) return "#DIV/0!";
  }
  return Pf(a[1], t, r, a[0]);
}
function Lf(e, t) {
  if (typeof t != "number") {
    t = +t || -1;
    for (var r = 0; r < 392; ++r) {
      if (be[r] == null) {
        t < 0 && (t = r);
        continue;
      }
      if (be[r] == e) {
        t = r;
        break;
      }
    }
    t < 0 && (t = 391);
  }
  return be[t] = e, t;
}
function k0() {
  be = gf();
}
var Mf = {
  5: '"$"#,##0_);\\("$"#,##0\\)',
  6: '"$"#,##0_);[Red]\\("$"#,##0\\)',
  7: '"$"#,##0.00_);\\("$"#,##0.00\\)',
  8: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
  23: "General",
  24: "General",
  25: "General",
  26: "General",
  27: "m/d/yy",
  28: "m/d/yy",
  29: "m/d/yy",
  30: "m/d/yy",
  31: "m/d/yy",
  32: "h:mm:ss",
  33: "h:mm:ss",
  34: "h:mm:ss",
  35: "h:mm:ss",
  36: "m/d/yy",
  41: '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)',
  42: '_("$"* #,##0_);_("$"* (#,##0);_("$"* "-"_);_(@_)',
  43: '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)',
  44: '_("$"* #,##0.00_);_("$"* (#,##0.00);_("$"* "-"??_);_(@_)',
  50: "m/d/yy",
  51: "m/d/yy",
  52: "m/d/yy",
  53: "m/d/yy",
  54: "m/d/yy",
  55: "m/d/yy",
  56: "m/d/yy",
  57: "m/d/yy",
  58: "m/d/yy",
  59: "0",
  60: "0.00",
  61: "#,##0",
  62: "#,##0.00",
  63: '"$"#,##0_);\\("$"#,##0\\)',
  64: '"$"#,##0_);[Red]\\("$"#,##0\\)',
  65: '"$"#,##0.00_);\\("$"#,##0.00\\)',
  66: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
  67: "0%",
  68: "0.00%",
  69: "# ?/?",
  70: "# ??/??",
  71: "m/d/yy",
  72: "m/d/yy",
  73: "d-mmm-yy",
  74: "d-mmm",
  75: "mmm-yy",
  76: "h:mm",
  77: "h:mm:ss",
  78: "m/d/yy h:mm",
  79: "mm:ss",
  80: "[h]:mm:ss",
  81: "mmss.0"
}, Xa = /[dD]+|[mM]+|[yYeE]+|[Hh]+|[Ss]+/g;
function Uf(e) {
  var t = typeof e == "number" ? be[e] : e;
  return t = t.replace(Xa, "(\\d+)"), Xa.lastIndex = 0, new RegExp("^" + t + "$");
}
function zf(e, t, r) {
  var n = -1, a = -1, i = -1, f = -1, s = -1, c = -1;
  (t.match(Xa) || []).forEach(function(m, x) {
    var l = parseInt(r[x + 1], 10);
    switch (m.toLowerCase().charAt(0)) {
      case "y":
        n = l;
        break;
      case "d":
        i = l;
        break;
      case "h":
        f = l;
        break;
      case "s":
        c = l;
        break;
      case "m":
        f >= 0 ? s = l : a = l;
        break;
    }
  }), Xa.lastIndex = 0, c >= 0 && s == -1 && a >= 0 && (s = a, a = -1);
  var o = ("" + (n >= 0 ? n : (/* @__PURE__ */ new Date()).getFullYear())).slice(-4) + "-" + ("00" + (a >= 1 ? a : 1)).slice(-2) + "-" + ("00" + (i >= 1 ? i : 1)).slice(-2);
  o.length == 7 && (o = "0" + o), o.length == 8 && (o = "20" + o);
  var u = ("00" + (f >= 0 ? f : 0)).slice(-2) + ":" + ("00" + (s >= 0 ? s : 0)).slice(-2) + ":" + ("00" + (c >= 0 ? c : 0)).slice(-2);
  return f == -1 && s == -1 && c == -1 ? o : n == -1 && a == -1 && i == -1 ? u : o + "T" + u;
}
var Wf = {
  "d.m": "d\\.m"
  // Issue #2571 Google Sheets writes invalid format 'd.m', correct format is 'd"."m' or 'd\\.m'
};
function wt(e, t) {
  return Lf(Wf[e] || e, t);
}
var hi = /* @__PURE__ */ (function() {
  var e = {};
  e.version = "1.2.0";
  function t() {
    for (var S = 0, R = new Array(256), F = 0; F != 256; ++F)
      S = F, S = S & 1 ? -306674912 ^ S >>> 1 : S >>> 1, S = S & 1 ? -306674912 ^ S >>> 1 : S >>> 1, S = S & 1 ? -306674912 ^ S >>> 1 : S >>> 1, S = S & 1 ? -306674912 ^ S >>> 1 : S >>> 1, S = S & 1 ? -306674912 ^ S >>> 1 : S >>> 1, S = S & 1 ? -306674912 ^ S >>> 1 : S >>> 1, S = S & 1 ? -306674912 ^ S >>> 1 : S >>> 1, S = S & 1 ? -306674912 ^ S >>> 1 : S >>> 1, R[F] = S;
    return typeof Int32Array < "u" ? new Int32Array(R) : R;
  }
  var r = t();
  function n(S) {
    var R = 0, F = 0, U = 0, H = typeof Int32Array < "u" ? new Int32Array(4096) : new Array(4096);
    for (U = 0; U != 256; ++U) H[U] = S[U];
    for (U = 0; U != 256; ++U)
      for (F = S[U], R = 256 + U; R < 4096; R += 256) F = H[R] = F >>> 8 ^ S[F & 255];
    var y = [];
    for (U = 1; U != 16; ++U) y[U - 1] = typeof Int32Array < "u" && typeof H.subarray == "function" ? H.subarray(U * 256, U * 256 + 256) : H.slice(U * 256, U * 256 + 256);
    return y;
  }
  var a = n(r), i = a[0], f = a[1], s = a[2], c = a[3], o = a[4], u = a[5], m = a[6], x = a[7], l = a[8], v = a[9], p = a[10], d = a[11], h = a[12], _ = a[13], g = a[14];
  function E(S, R) {
    for (var F = R ^ -1, U = 0, H = S.length; U < H; ) F = F >>> 8 ^ r[(F ^ S.charCodeAt(U++)) & 255];
    return ~F;
  }
  function A(S, R) {
    for (var F = R ^ -1, U = S.length - 15, H = 0; H < U; ) F = g[S[H++] ^ F & 255] ^ _[S[H++] ^ F >> 8 & 255] ^ h[S[H++] ^ F >> 16 & 255] ^ d[S[H++] ^ F >>> 24] ^ p[S[H++]] ^ v[S[H++]] ^ l[S[H++]] ^ x[S[H++]] ^ m[S[H++]] ^ u[S[H++]] ^ o[S[H++]] ^ c[S[H++]] ^ s[S[H++]] ^ f[S[H++]] ^ i[S[H++]] ^ r[S[H++]];
    for (U += 15; H < U; ) F = F >>> 8 ^ r[(F ^ S[H++]) & 255];
    return ~F;
  }
  function P(S, R) {
    for (var F = R ^ -1, U = 0, H = S.length, y = 0, W = 0; U < H; )
      y = S.charCodeAt(U++), y < 128 ? F = F >>> 8 ^ r[(F ^ y) & 255] : y < 2048 ? (F = F >>> 8 ^ r[(F ^ (192 | y >> 6 & 31)) & 255], F = F >>> 8 ^ r[(F ^ (128 | y & 63)) & 255]) : y >= 55296 && y < 57344 ? (y = (y & 1023) + 64, W = S.charCodeAt(U++) & 1023, F = F >>> 8 ^ r[(F ^ (240 | y >> 8 & 7)) & 255], F = F >>> 8 ^ r[(F ^ (128 | y >> 2 & 63)) & 255], F = F >>> 8 ^ r[(F ^ (128 | W >> 6 & 15 | (y & 3) << 4)) & 255], F = F >>> 8 ^ r[(F ^ (128 | W & 63)) & 255]) : (F = F >>> 8 ^ r[(F ^ (224 | y >> 12 & 15)) & 255], F = F >>> 8 ^ r[(F ^ (128 | y >> 6 & 63)) & 255], F = F >>> 8 ^ r[(F ^ (128 | y & 63)) & 255]);
    return ~F;
  }
  return e.table = r, e.bstr = E, e.buf = A, e.str = P, e;
})(), Ue = /* @__PURE__ */ (function() {
  var t = (
    /*::(*/
    {}
  );
  t.version = "1.2.2";
  function r(T, L) {
    for (var b = T.split("/"), D = L.split("/"), B = 0, M = 0, ae = Math.min(b.length, D.length); B < ae; ++B) {
      if (M = b[B].length - D[B].length) return M;
      if (b[B] != D[B]) return b[B] < D[B] ? -1 : 1;
    }
    return b.length - D.length;
  }
  function n(T) {
    if (T.charAt(T.length - 1) == "/") return T.slice(0, -1).indexOf("/") === -1 ? T : n(T.slice(0, -1));
    var L = T.lastIndexOf("/");
    return L === -1 ? T : T.slice(0, L + 1);
  }
  function a(T) {
    if (T.charAt(T.length - 1) == "/") return a(T.slice(0, -1));
    var L = T.lastIndexOf("/");
    return L === -1 ? T : T.slice(L + 1);
  }
  function i(T, L) {
    typeof L == "string" && (L = new Date(L));
    var b = L.getHours();
    b = b << 6 | L.getMinutes(), b = b << 5 | L.getSeconds() >>> 1, T.write_shift(2, b);
    var D = L.getFullYear() - 1980;
    D = D << 4 | L.getMonth() + 1, D = D << 5 | L.getDate(), T.write_shift(2, D);
  }
  function f(T) {
    var L = T.read_shift(2) & 65535, b = T.read_shift(2) & 65535, D = /* @__PURE__ */ new Date(), B = b & 31;
    b >>>= 5;
    var M = b & 15;
    b >>>= 4, D.setMilliseconds(0), D.setFullYear(b + 1980), D.setMonth(M - 1), D.setDate(B);
    var ae = L & 31;
    L >>>= 5;
    var ue = L & 63;
    return L >>>= 6, D.setHours(L), D.setMinutes(ue), D.setSeconds(ae << 1), D;
  }
  function s(T) {
    ir(T, 0);
    for (var L = (
      /*::(*/
      {}
    ), b = 0; T.l <= T.length - 4; ) {
      var D = T.read_shift(2), B = T.read_shift(2), M = T.l + B, ae = {};
      switch (D) {
        /* UNIX-style Timestamps */
        case 21589:
          b = T.read_shift(1), b & 1 && (ae.mtime = T.read_shift(4)), B > 5 && (b & 2 && (ae.atime = T.read_shift(4)), b & 4 && (ae.ctime = T.read_shift(4))), ae.mtime && (ae.mt = new Date(ae.mtime * 1e3));
          break;
        /* ZIP64 Extended Information Field */
        case 1:
          {
            var ue = T.read_shift(4), te = T.read_shift(4);
            ae.usz = te * Math.pow(2, 32) + ue, ue = T.read_shift(4), te = T.read_shift(4), ae.csz = te * Math.pow(2, 32) + ue;
          }
          break;
      }
      T.l = M, L[D] = ae;
    }
    return L;
  }
  var c;
  function o() {
    return c || (c = Hf);
  }
  function u(T, L) {
    if (T[0] == 80 && T[1] == 75) return Aa(T, L);
    if ((T[0] | 32) == 109 && (T[1] | 32) == 105) return ef(T, L);
    if (T.length < 512) throw new Error("CFB file size " + T.length + " < 512");
    var b = 3, D = 512, B = 0, M = 0, ae = 0, ue = 0, te = 0, ne = [], ie = (
      /*::(*/
      T.slice(0, 512)
    );
    ir(ie, 0);
    var ge = m(ie);
    switch (b = ge[0], b) {
      case 3:
        D = 512;
        break;
      case 4:
        D = 4096;
        break;
      case 0:
        if (ge[1] == 0) return Aa(T, L);
      /* falls through */
      default:
        throw new Error("Major Version: Expected 3 or 4 saw " + b);
    }
    D !== 512 && (ie = /*::(*/
    T.slice(0, D), ir(
      ie,
      28
      /* blob.l */
    ));
    var we = T.slice(0, D);
    x(ie, b);
    var ye = ie.read_shift(4, "i");
    if (b === 3 && ye !== 0) throw new Error("# Directory Sectors: Expected 0 saw " + ye);
    ie.l += 4, ae = ie.read_shift(4, "i"), ie.l += 4, ie.chk("00100000", "Mini Stream Cutoff Size: "), ue = ie.read_shift(4, "i"), B = ie.read_shift(4, "i"), te = ie.read_shift(4, "i"), M = ie.read_shift(4, "i");
    for (var _e = -1, Ee = 0; Ee < 109 && (_e = ie.read_shift(4, "i"), !(_e < 0)); ++Ee)
      ne[Ee] = _e;
    var Ie = l(T, D);
    d(te, M, Ie, D, ne);
    var Ke = _(Ie, ae, ne, D);
    ae < Ke.length && (Ke[ae].name = "!Directory"), B > 0 && ue !== W && (Ke[ue].name = "!MiniFAT"), Ke[ne[0]].name = "!FAT", Ke.fat_addrs = ne, Ke.ssz = D;
    var Ye = {}, pr = [], Gt = [], Xt = [];
    g(ae, Ke, Ie, pr, B, Ye, Gt, ue), v(Gt, Xt, pr), pr.shift();
    var $t = {
      FileIndex: Gt,
      FullPaths: Xt
    };
    return L && L.raw && ($t.raw = { header: we, sectors: Ie }), $t;
  }
  function m(T) {
    if (T[T.l] == 80 && T[T.l + 1] == 75) return [0, 0];
    T.chk(k, "Header Signature: "), T.l += 16;
    var L = T.read_shift(2, "u");
    return [T.read_shift(2, "u"), L];
  }
  function x(T, L) {
    var b = 9;
    switch (T.l += 2, b = T.read_shift(2)) {
      case 9:
        if (L != 3) throw new Error("Sector Shift: Expected 9 saw " + b);
        break;
      case 12:
        if (L != 4) throw new Error("Sector Shift: Expected 12 saw " + b);
        break;
      default:
        throw new Error("Sector Shift: Expected 9 or 12 saw " + b);
    }
    T.chk("0600", "Mini Sector Shift: "), T.chk("000000000000", "Reserved: ");
  }
  function l(T, L) {
    for (var b = Math.ceil(T.length / L) - 1, D = [], B = 1; B < b; ++B) D[B - 1] = T.slice(B * L, (B + 1) * L);
    return D[b - 1] = T.slice(b * L), D;
  }
  function v(T, L, b) {
    for (var D = 0, B = 0, M = 0, ae = 0, ue = 0, te = b.length, ne = [], ie = []; D < te; ++D)
      ne[D] = ie[D] = D, L[D] = b[D];
    for (; ue < ie.length; ++ue)
      D = ie[ue], B = T[D].L, M = T[D].R, ae = T[D].C, ne[D] === D && (B !== -1 && ne[B] !== B && (ne[D] = ne[B]), M !== -1 && ne[M] !== M && (ne[D] = ne[M])), ae !== -1 && (ne[ae] = D), B !== -1 && D != ne[D] && (ne[B] = ne[D], ie.lastIndexOf(B) < ue && ie.push(B)), M !== -1 && D != ne[D] && (ne[M] = ne[D], ie.lastIndexOf(M) < ue && ie.push(M));
    for (D = 1; D < te; ++D) ne[D] === D && (M !== -1 && ne[M] !== M ? ne[D] = ne[M] : B !== -1 && ne[B] !== B && (ne[D] = ne[B]));
    for (D = 1; D < te; ++D)
      if (T[D].type !== 0) {
        if (ue = D, ue != ne[ue]) do
          ue = ne[ue], L[D] = L[ue] + "/" + L[D];
        while (ue !== 0 && ne[ue] !== -1 && ue != ne[ue]);
        ne[D] = -1;
      }
    for (L[0] += "/", D = 1; D < te; ++D)
      T[D].type !== 2 && (L[D] += "/");
  }
  function p(T, L, b) {
    for (var D = T.start, B = T.size, M = [], ae = D; b && B > 0 && ae >= 0; )
      M.push(L.slice(ae * y, ae * y + y)), B -= y, ae = _t(b, ae * 4);
    return M.length === 0 ? ar(0) : ft(M).slice(0, T.size);
  }
  function d(T, L, b, D, B) {
    var M = W;
    if (T === W) {
      if (L !== 0) throw new Error("DIFAT chain shorter than expected");
    } else if (T !== -1) {
      var ae = b[T], ue = (D >>> 2) - 1;
      if (!ae) return;
      for (var te = 0; te < ue && (M = _t(ae, te * 4)) !== W; ++te)
        B.push(M);
      L >= 1 && d(_t(ae, D - 4), L - 1, b, D, B);
    }
  }
  function h(T, L, b, D, B) {
    var M = [], ae = [];
    B || (B = []);
    var ue = D - 1, te = 0, ne = 0;
    for (te = L; te >= 0; ) {
      B[te] = !0, M[M.length] = te, ae.push(T[te]);
      var ie = b[Math.floor(te * 4 / D)];
      if (ne = te * 4 & ue, D < 4 + ne) throw new Error("FAT boundary crossed: " + te + " 4 " + D);
      if (!T[ie]) break;
      te = _t(T[ie], ne);
    }
    return { nodes: M, data: wi([ae]) };
  }
  function _(T, L, b, D) {
    var B = T.length, M = [], ae = [], ue = [], te = [], ne = D - 1, ie = 0, ge = 0, we = 0, ye = 0;
    for (ie = 0; ie < B; ++ie)
      if (ue = [], we = ie + L, we >= B && (we -= B), !ae[we]) {
        te = [];
        var _e = [];
        for (ge = we; ge >= 0; ) {
          _e[ge] = !0, ae[ge] = !0, ue[ue.length] = ge, te.push(T[ge]);
          var Ee = b[Math.floor(ge * 4 / D)];
          if (ye = ge * 4 & ne, D < 4 + ye) throw new Error("FAT boundary crossed: " + ge + " 4 " + D);
          if (!T[Ee] || (ge = _t(T[Ee], ye), _e[ge])) break;
        }
        M[we] = { nodes: ue, data: wi([te]) };
      }
    return M;
  }
  function g(T, L, b, D, B, M, ae, ue) {
    for (var te = 0, ne = D.length ? 2 : 0, ie = L[T].data, ge = 0, we = 0, ye; ge < ie.length; ge += 128) {
      var _e = (
        /*::(*/
        ie.slice(ge, ge + 128)
      );
      ir(_e, 64), we = _e.read_shift(2), ye = zn(_e, 0, we - ne), D.push(ye);
      var Ee = {
        name: ye,
        type: _e.read_shift(1),
        color: _e.read_shift(1),
        L: _e.read_shift(4, "i"),
        R: _e.read_shift(4, "i"),
        C: _e.read_shift(4, "i"),
        clsid: _e.read_shift(16),
        state: _e.read_shift(4, "i"),
        start: 0,
        size: 0
      }, Ie = _e.read_shift(2) + _e.read_shift(2) + _e.read_shift(2) + _e.read_shift(2);
      Ie !== 0 && (Ee.ct = E(_e, _e.l - 8));
      var Ke = _e.read_shift(2) + _e.read_shift(2) + _e.read_shift(2) + _e.read_shift(2);
      Ke !== 0 && (Ee.mt = E(_e, _e.l - 8)), Ee.start = _e.read_shift(4, "i"), Ee.size = _e.read_shift(4, "i"), Ee.size < 0 && Ee.start < 0 && (Ee.size = Ee.type = 0, Ee.start = W, Ee.name = ""), Ee.type === 5 ? (te = Ee.start, B > 0 && te !== W && (L[te].name = "!StreamData")) : Ee.size >= 4096 ? (Ee.storage = "fat", L[Ee.start] === void 0 && (L[Ee.start] = h(b, Ee.start, L.fat_addrs, L.ssz)), L[Ee.start].name = Ee.name, Ee.content = L[Ee.start].data.slice(0, Ee.size)) : (Ee.storage = "minifat", Ee.size < 0 ? Ee.size = 0 : te !== W && Ee.start !== W && L[te] && (Ee.content = p(Ee, L[te].data, (L[ue] || {}).data))), Ee.content && ir(Ee.content, 0), M[ye] = Ee, ae.push(Ee);
    }
  }
  function E(T, L) {
    return new Date((Or(T, L + 4) / 1e7 * Math.pow(2, 32) + Or(T, L) / 1e7 - 11644473600) * 1e3);
  }
  function A(T, L) {
    return o(), u(c.readFileSync(T), L);
  }
  function P(T, L) {
    var b = L && L.type;
    switch (b || Pe && Buffer.isBuffer(T) && (b = "buffer"), b || "base64") {
      case "file":
        return A(T, L);
      case "base64":
        return u(Ir(Rr(T)), L);
      case "binary":
        return u(Ir(T), L);
    }
    return u(
      /*::typeof blob == 'string' ? new Buffer(blob, 'utf-8') : */
      T,
      L
    );
  }
  function S(T, L) {
    var b = L || {}, D = b.root || "Root Entry";
    if (T.FullPaths || (T.FullPaths = []), T.FileIndex || (T.FileIndex = []), T.FullPaths.length !== T.FileIndex.length) throw new Error("inconsistent CFB structure");
    T.FullPaths.length === 0 && (T.FullPaths[0] = D + "/", T.FileIndex[0] = { name: D, type: 5 }), b.CLSID && (T.FileIndex[0].clsid = b.CLSID), R(T);
  }
  function R(T) {
    var L = "Sh33tJ5";
    if (!Ue.find(T, "/" + L)) {
      var b = ar(4);
      b[0] = 55, b[1] = b[3] = 50, b[2] = 54, T.FileIndex.push({ name: L, type: 2, content: b, size: 4, L: 69, R: 69, C: 69 }), T.FullPaths.push(T.FullPaths[0] + L), F(T);
    }
  }
  function F(T, L) {
    S(T);
    for (var b = !1, D = !1, B = T.FullPaths.length - 1; B >= 0; --B) {
      var M = T.FileIndex[B];
      switch (M.type) {
        case 0:
          D ? b = !0 : (T.FileIndex.pop(), T.FullPaths.pop());
          break;
        case 1:
        case 2:
        case 5:
          D = !0, isNaN(M.R * M.L * M.C) && (b = !0), M.R > -1 && M.L > -1 && M.R == M.L && (b = !0);
          break;
        default:
          b = !0;
          break;
      }
    }
    if (!(!b && !L)) {
      var ae = new Date(1987, 1, 19), ue = 0, te = Object.create ? /* @__PURE__ */ Object.create(null) : {}, ne = [];
      for (B = 0; B < T.FullPaths.length; ++B)
        te[T.FullPaths[B]] = !0, T.FileIndex[B].type !== 0 && ne.push([T.FullPaths[B], T.FileIndex[B]]);
      for (B = 0; B < ne.length; ++B) {
        var ie = n(ne[B][0]);
        for (D = te[ie]; !D; ) {
          for (; n(ie) && !te[n(ie)]; ) ie = n(ie);
          ne.push([ie, {
            name: a(ie).replace("/", ""),
            type: 1,
            clsid: me,
            ct: ae,
            mt: ae,
            content: null
          }]), te[ie] = !0, ie = n(ne[B][0]), D = te[ie];
        }
      }
      for (ne.sort(function(ye, _e) {
        return r(ye[0], _e[0]);
      }), T.FullPaths = [], T.FileIndex = [], B = 0; B < ne.length; ++B)
        T.FullPaths[B] = ne[B][0], T.FileIndex[B] = ne[B][1];
      for (B = 0; B < ne.length; ++B) {
        var ge = T.FileIndex[B], we = T.FullPaths[B];
        if (ge.name = a(we).replace("/", ""), ge.L = ge.R = ge.C = -(ge.color = 1), ge.size = ge.content ? ge.content.length : 0, ge.start = 0, ge.clsid = ge.clsid || me, B === 0)
          ge.C = ne.length > 1 ? 1 : -1, ge.size = 0, ge.type = 5;
        else if (we.slice(-1) == "/") {
          for (ue = B + 1; ue < ne.length && n(T.FullPaths[ue]) != we; ++ue) ;
          for (ge.C = ue >= ne.length ? -1 : ue, ue = B + 1; ue < ne.length && n(T.FullPaths[ue]) != n(we); ++ue) ;
          ge.R = ue >= ne.length ? -1 : ue, ge.type = 1;
        } else
          n(T.FullPaths[B + 1] || "") == n(we) && (ge.R = B + 1), ge.type = 2;
      }
    }
  }
  function U(T, L) {
    var b = L || {};
    if (b.fileType == "mad") return rf(T, b);
    switch (F(T), b.fileType) {
      case "zip":
        return mt(T, b);
    }
    var D = (function(ye) {
      for (var _e = 0, Ee = 0, Ie = 0; Ie < ye.FileIndex.length; ++Ie) {
        var Ke = ye.FileIndex[Ie];
        if (Ke.content) {
          var Ye = Ke.content.length;
          Ye > 0 && (Ye < 4096 ? _e += Ye + 63 >> 6 : Ee += Ye + 511 >> 9);
        }
      }
      for (var pr = ye.FullPaths.length + 3 >> 2, Gt = _e + 7 >> 3, Xt = _e + 127 >> 7, $t = Gt + Ee + pr + Xt, vt = $t + 127 >> 7, ln = vt <= 109 ? 0 : Math.ceil((vt - 109) / 127); $t + vt + ln + 127 >> 7 > vt; ) ln = ++vt <= 109 ? 0 : Math.ceil((vt - 109) / 127);
      var Jr = [1, ln, vt, Xt, pr, Ee, _e, 0];
      return ye.FileIndex[0].size = _e << 6, Jr[7] = (ye.FileIndex[0].start = Jr[0] + Jr[1] + Jr[2] + Jr[3] + Jr[4] + Jr[5]) + (Jr[6] + 7 >> 3), Jr;
    })(T), B = ar(D[7] << 9), M = 0, ae = 0;
    {
      for (M = 0; M < 8; ++M) B.write_shift(1, j[M]);
      for (M = 0; M < 8; ++M) B.write_shift(2, 0);
      for (B.write_shift(2, 62), B.write_shift(2, 3), B.write_shift(2, 65534), B.write_shift(2, 9), B.write_shift(2, 6), M = 0; M < 3; ++M) B.write_shift(2, 0);
      for (B.write_shift(4, 0), B.write_shift(4, D[2]), B.write_shift(4, D[0] + D[1] + D[2] + D[3] - 1), B.write_shift(4, 0), B.write_shift(4, 4096), B.write_shift(4, D[3] ? D[0] + D[1] + D[2] - 1 : W), B.write_shift(4, D[3]), B.write_shift(-4, D[1] ? D[0] - 1 : W), B.write_shift(4, D[1]), M = 0; M < 109; ++M) B.write_shift(-4, M < D[2] ? D[1] + M : -1);
    }
    if (D[1])
      for (ae = 0; ae < D[1]; ++ae) {
        for (; M < 236 + ae * 127; ++M) B.write_shift(-4, M < D[2] ? D[1] + M : -1);
        B.write_shift(-4, ae === D[1] - 1 ? W : ae + 1);
      }
    var ue = function(ye) {
      for (ae += ye; M < ae - 1; ++M) B.write_shift(-4, M + 1);
      ye && (++M, B.write_shift(-4, W));
    };
    for (ae = M = 0, ae += D[1]; M < ae; ++M) B.write_shift(-4, Z.DIFSECT);
    for (ae += D[2]; M < ae; ++M) B.write_shift(-4, Z.FATSECT);
    ue(D[3]), ue(D[4]);
    for (var te = 0, ne = 0, ie = T.FileIndex[0]; te < T.FileIndex.length; ++te)
      ie = T.FileIndex[te], ie.content && (ne = ie.content.length, !(ne < 4096) && (ie.start = ae, ue(ne + 511 >> 9)));
    for (ue(D[6] + 7 >> 3); B.l & 511; ) B.write_shift(-4, Z.ENDOFCHAIN);
    for (ae = M = 0, te = 0; te < T.FileIndex.length; ++te)
      ie = T.FileIndex[te], ie.content && (ne = ie.content.length, !(!ne || ne >= 4096) && (ie.start = ae, ue(ne + 63 >> 6)));
    for (; B.l & 511; ) B.write_shift(-4, Z.ENDOFCHAIN);
    for (M = 0; M < D[4] << 2; ++M) {
      var ge = T.FullPaths[M];
      if (!ge || ge.length === 0) {
        for (te = 0; te < 17; ++te) B.write_shift(4, 0);
        for (te = 0; te < 3; ++te) B.write_shift(4, -1);
        for (te = 0; te < 12; ++te) B.write_shift(4, 0);
        continue;
      }
      ie = T.FileIndex[M], M === 0 && (ie.start = ie.size ? ie.start - 1 : W);
      var we = M === 0 && b.root || ie.name;
      if (we.length > 31 && (console.error("Name " + we + " will be truncated to " + we.slice(0, 31)), we = we.slice(0, 31)), ne = 2 * (we.length + 1), B.write_shift(64, we, "utf16le"), B.write_shift(2, ne), B.write_shift(1, ie.type), B.write_shift(1, ie.color), B.write_shift(-4, ie.L), B.write_shift(-4, ie.R), B.write_shift(-4, ie.C), ie.clsid) B.write_shift(16, ie.clsid, "hex");
      else for (te = 0; te < 4; ++te) B.write_shift(4, 0);
      B.write_shift(4, ie.state || 0), B.write_shift(4, 0), B.write_shift(4, 0), B.write_shift(4, 0), B.write_shift(4, 0), B.write_shift(4, ie.start), B.write_shift(4, ie.size), B.write_shift(4, 0);
    }
    for (M = 1; M < T.FileIndex.length; ++M)
      if (ie = T.FileIndex[M], ie.size >= 4096)
        if (B.l = ie.start + 1 << 9, Pe && Buffer.isBuffer(ie.content))
          ie.content.copy(B, B.l, 0, ie.size), B.l += ie.size + 511 & -512;
        else {
          for (te = 0; te < ie.size; ++te) B.write_shift(1, ie.content[te]);
          for (; te & 511; ++te) B.write_shift(1, 0);
        }
    for (M = 1; M < T.FileIndex.length; ++M)
      if (ie = T.FileIndex[M], ie.size > 0 && ie.size < 4096)
        if (Pe && Buffer.isBuffer(ie.content))
          ie.content.copy(B, B.l, 0, ie.size), B.l += ie.size + 63 & -64;
        else {
          for (te = 0; te < ie.size; ++te) B.write_shift(1, ie.content[te]);
          for (; te & 63; ++te) B.write_shift(1, 0);
        }
    if (Pe)
      B.l = B.length;
    else
      for (; B.l < B.length; ) B.write_shift(1, 0);
    return B;
  }
  function H(T, L) {
    var b = T.FullPaths.map(function(te) {
      return te.toUpperCase();
    }), D = b.map(function(te) {
      var ne = te.split("/");
      return ne[ne.length - (te.slice(-1) == "/" ? 2 : 1)];
    }), B = !1;
    L.charCodeAt(0) === 47 ? (B = !0, L = b[0].slice(0, -1) + L) : B = L.indexOf("/") !== -1;
    var M = L.toUpperCase(), ae = B === !0 ? b.indexOf(M) : D.indexOf(M);
    if (ae !== -1) return T.FileIndex[ae];
    var ue = !M.match(Kt);
    for (M = M.replace(Fr, ""), ue && (M = M.replace(Kt, "!")), ae = 0; ae < b.length; ++ae)
      if ((ue ? b[ae].replace(Kt, "!") : b[ae]).replace(Fr, "") == M || (ue ? D[ae].replace(Kt, "!") : D[ae]).replace(Fr, "") == M) return T.FileIndex[ae];
    return null;
  }
  var y = 64, W = -2, k = "d0cf11e0a1b11ae1", j = [208, 207, 17, 224, 161, 177, 26, 225], me = "00000000000000000000000000000000", Z = {
    /* 2.1 Compund File Sector Numbers and Types */
    MAXREGSECT: -6,
    DIFSECT: -4,
    FATSECT: -3,
    ENDOFCHAIN: W,
    FREESECT: -1,
    /* 2.2 Compound File Header */
    HEADER_SIGNATURE: k,
    HEADER_MINOR_VERSION: "3e00",
    MAXREGSID: -6,
    NOSTREAM: -1,
    HEADER_CLSID: me,
    /* 2.6.1 Compound File Directory Entry */
    EntryTypes: ["unknown", "storage", "stream", "lockbytes", "property", "root"]
  };
  function xe(T, L, b) {
    o();
    var D = U(T, b);
    c.writeFileSync(L, D);
  }
  function fe(T) {
    for (var L = new Array(T.length), b = 0; b < T.length; ++b) L[b] = String.fromCharCode(T[b]);
    return L.join("");
  }
  function q(T, L) {
    var b = U(T, L);
    switch (L && L.type || "buffer") {
      case "file":
        return o(), c.writeFileSync(L.filename, b), b;
      case "binary":
        return typeof b == "string" ? b : fe(b);
      case "base64":
        return ai(typeof b == "string" ? b : fe(b));
      case "buffer":
        if (Pe) return Buffer.isBuffer(b) ? b : dt(b);
      /* falls through */
      case "array":
        return typeof b == "string" ? Ir(b) : b;
    }
    return b;
  }
  var J;
  function Y(T) {
    try {
      var L = T.InflateRaw, b = new L();
      if (b._processChunk(new Uint8Array([3, 0]), b._finishFlushFlag), b.bytesRead) J = T;
      else throw new Error("zlib does not expose bytesRead");
    } catch (D) {
      console.error("cannot use native zlib: " + (D.message || D));
    }
  }
  function pe(T, L) {
    if (!J) return Ta(T, L);
    var b = J.InflateRaw, D = new b(), B = D._processChunk(T.slice(T.l), D._finishFlushFlag);
    return T.l += D.bytesRead, B;
  }
  function ce(T) {
    return J ? J.deflateRawSync(T) : qe(T);
  }
  var de = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], Te = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258], Ce = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  function O(T) {
    var L = (T << 1 | T << 11) & 139536 | (T << 5 | T << 15) & 558144;
    return (L >> 16 | L >> 8 | L) & 255;
  }
  for (var K = typeof Uint8Array < "u", X = K ? new Uint8Array(256) : [], z = 0; z < 256; ++z) X[z] = O(z);
  function he(T, L) {
    var b = X[T & 255];
    return L <= 8 ? b >>> 8 - L : (b = b << 8 | X[T >> 8 & 255], L <= 16 ? b >>> 16 - L : (b = b << 8 | X[T >> 16 & 255], b >>> 24 - L));
  }
  function N(T, L) {
    var b = L & 7, D = L >>> 3;
    return (T[D] | (b <= 6 ? 0 : T[D + 1] << 8)) >>> b & 3;
  }
  function w(T, L) {
    var b = L & 7, D = L >>> 3;
    return (T[D] | (b <= 5 ? 0 : T[D + 1] << 8)) >>> b & 7;
  }
  function Q(T, L) {
    var b = L & 7, D = L >>> 3;
    return (T[D] | (b <= 4 ? 0 : T[D + 1] << 8)) >>> b & 15;
  }
  function V(T, L) {
    var b = L & 7, D = L >>> 3;
    return (T[D] | (b <= 3 ? 0 : T[D + 1] << 8)) >>> b & 31;
  }
  function I(T, L) {
    var b = L & 7, D = L >>> 3;
    return (T[D] | (b <= 1 ? 0 : T[D + 1] << 8)) >>> b & 127;
  }
  function C(T, L, b) {
    var D = L & 7, B = L >>> 3, M = (1 << b) - 1, ae = T[B] >>> D;
    return b < 8 - D || (ae |= T[B + 1] << 8 - D, b < 16 - D) || (ae |= T[B + 2] << 16 - D, b < 24 - D) || (ae |= T[B + 3] << 24 - D), ae & M;
  }
  function G(T, L, b) {
    var D = L & 7, B = L >>> 3;
    return D <= 5 ? T[B] |= (b & 7) << D : (T[B] |= b << D & 255, T[B + 1] = (b & 7) >> 8 - D), L + 3;
  }
  function oe(T, L, b) {
    var D = L & 7, B = L >>> 3;
    return b = (b & 1) << D, T[B] |= b, L + 1;
  }
  function le(T, L, b) {
    var D = L & 7, B = L >>> 3;
    return b <<= D, T[B] |= b & 255, b >>>= 8, T[B + 1] = b, L + 8;
  }
  function ee(T, L, b) {
    var D = L & 7, B = L >>> 3;
    return b <<= D, T[B] |= b & 255, b >>>= 8, T[B + 1] = b & 255, T[B + 2] = b >>> 8, L + 16;
  }
  function se(T, L) {
    var b = T.length, D = 2 * b > L ? 2 * b : L + 5, B = 0;
    if (b >= L) return T;
    if (Pe) {
      var M = ni(D);
      if (T.copy) T.copy(M);
      else for (; B < T.length; ++B) M[B] = T[B];
      return M;
    } else if (K) {
      var ae = new Uint8Array(D);
      if (ae.set) ae.set(T);
      else for (; B < b; ++B) ae[B] = T[B];
      return ae;
    }
    return T.length = D, T;
  }
  function ve(T) {
    for (var L = new Array(T), b = 0; b < T; ++b) L[b] = 0;
    return L;
  }
  function re(T, L, b) {
    var D = 1, B = 0, M = 0, ae = 0, ue = 0, te = T.length, ne = K ? new Uint16Array(32) : ve(32);
    for (M = 0; M < 32; ++M) ne[M] = 0;
    for (M = te; M < b; ++M) T[M] = 0;
    te = T.length;
    var ie = K ? new Uint16Array(te) : ve(te);
    for (M = 0; M < te; ++M)
      ne[B = T[M]]++, D < B && (D = B), ie[M] = 0;
    for (ne[0] = 0, M = 1; M <= D; ++M) ne[M + 16] = ue = ue + ne[M - 1] << 1;
    for (M = 0; M < te; ++M)
      ue = T[M], ue != 0 && (ie[M] = ne[ue + 16]++);
    var ge = 0;
    for (M = 0; M < te; ++M)
      if (ge = T[M], ge != 0)
        for (ue = he(ie[M], D) >> D - ge, ae = (1 << D + 4 - ge) - 1; ae >= 0; --ae)
          L[ue | ae << ge] = ge & 15 | M << 4;
    return D;
  }
  var Fe = K ? new Uint16Array(512) : ve(512), Oe = K ? new Uint16Array(32) : ve(32);
  if (!K) {
    for (var Se = 0; Se < 512; ++Se) Fe[Se] = 0;
    for (Se = 0; Se < 32; ++Se) Oe[Se] = 0;
  }
  (function() {
    for (var T = [], L = 0; L < 32; L++) T.push(5);
    re(T, Oe, 32);
    var b = [];
    for (L = 0; L <= 143; L++) b.push(8);
    for (; L <= 255; L++) b.push(9);
    for (; L <= 279; L++) b.push(7);
    for (; L <= 287; L++) b.push(8);
    re(b, Fe, 288);
  })();
  var je = /* @__PURE__ */ (function() {
    for (var L = K ? new Uint8Array(32768) : [], b = 0, D = 0; b < Ce.length - 1; ++b)
      for (; D < Ce[b + 1]; ++D) L[D] = b;
    for (; D < 32768; ++D) L[D] = 29;
    var B = K ? new Uint8Array(259) : [];
    for (b = 0, D = 0; b < Te.length - 1; ++b)
      for (; D < Te[b + 1]; ++D) B[D] = b;
    function M(ue, te) {
      for (var ne = 0; ne < ue.length; ) {
        var ie = Math.min(65535, ue.length - ne), ge = ne + ie == ue.length;
        for (te.write_shift(1, +ge), te.write_shift(2, ie), te.write_shift(2, ~ie & 65535); ie-- > 0; ) te[te.l++] = ue[ne++];
      }
      return te.l;
    }
    function ae(ue, te) {
      for (var ne = 0, ie = 0, ge = K ? new Uint16Array(32768) : []; ie < ue.length; ) {
        var we = (
          /* data.length - boff; */
          Math.min(65535, ue.length - ie)
        );
        if (we < 10) {
          for (ne = G(te, ne, +(ie + we == ue.length)), ne & 7 && (ne += 8 - (ne & 7)), te.l = ne / 8 | 0, te.write_shift(2, we), te.write_shift(2, ~we & 65535); we-- > 0; ) te[te.l++] = ue[ie++];
          ne = te.l * 8;
          continue;
        }
        ne = G(te, ne, +(ie + we == ue.length) + 2);
        for (var ye = 0; we-- > 0; ) {
          var _e = ue[ie];
          ye = (ye << 5 ^ _e) & 32767;
          var Ee = -1, Ie = 0;
          if ((Ee = ge[ye]) && (Ee |= ie & -32768, Ee > ie && (Ee -= 32768), Ee < ie))
            for (; ue[Ee + Ie] == ue[ie + Ie] && Ie < 250; ) ++Ie;
          if (Ie > 2) {
            _e = B[Ie], _e <= 22 ? ne = le(te, ne, X[_e + 1] >> 1) - 1 : (le(te, ne, 3), ne += 5, le(te, ne, X[_e - 23] >> 5), ne += 3);
            var Ke = _e < 8 ? 0 : _e - 4 >> 2;
            Ke > 0 && (ee(te, ne, Ie - Te[_e]), ne += Ke), _e = L[ie - Ee], ne = le(te, ne, X[_e] >> 3), ne -= 3;
            var Ye = _e < 4 ? 0 : _e - 2 >> 1;
            Ye > 0 && (ee(te, ne, ie - Ee - Ce[_e]), ne += Ye);
            for (var pr = 0; pr < Ie; ++pr)
              ge[ye] = ie & 32767, ye = (ye << 5 ^ ue[ie]) & 32767, ++ie;
            we -= Ie - 1;
          } else
            _e <= 143 ? _e = _e + 48 : ne = oe(te, ne, 1), ne = le(te, ne, X[_e]), ge[ye] = ie & 32767, ++ie;
        }
        ne = le(te, ne, 0) - 1;
      }
      return te.l = (ne + 7) / 8 | 0, te.l;
    }
    return function(te, ne) {
      return te.length < 8 ? M(te, ne) : ae(te, ne);
    };
  })();
  function qe(T) {
    var L = ar(50 + Math.floor(T.length * 1.1)), b = je(T, L);
    return L.slice(0, b);
  }
  var ke = K ? new Uint16Array(32768) : ve(32768), Ne = K ? new Uint16Array(32768) : ve(32768), De = K ? new Uint16Array(128) : ve(128), $e = 1, Cr = 1;
  function lr(T, L) {
    var b = V(T, L) + 257;
    L += 5;
    var D = V(T, L) + 1;
    L += 5;
    var B = Q(T, L) + 4;
    L += 4;
    for (var M = 0, ae = K ? new Uint8Array(19) : ve(19), ue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], te = 1, ne = K ? new Uint8Array(8) : ve(8), ie = K ? new Uint8Array(8) : ve(8), ge = ae.length, we = 0; we < B; ++we)
      ae[de[we]] = M = w(T, L), te < M && (te = M), ne[M]++, L += 3;
    var ye = 0;
    for (ne[0] = 0, we = 1; we <= te; ++we) ie[we] = ye = ye + ne[we - 1] << 1;
    for (we = 0; we < ge; ++we) (ye = ae[we]) != 0 && (ue[we] = ie[ye]++);
    var _e = 0;
    for (we = 0; we < ge; ++we)
      if (_e = ae[we], _e != 0) {
        ye = X[ue[we]] >> 8 - _e;
        for (var Ee = (1 << 7 - _e) - 1; Ee >= 0; --Ee) De[ye | Ee << _e] = _e & 7 | we << 3;
      }
    var Ie = [];
    for (te = 1; Ie.length < b + D; )
      switch (ye = De[I(T, L)], L += ye & 7, ye >>>= 3) {
        case 16:
          for (M = 3 + N(T, L), L += 2, ye = Ie[Ie.length - 1]; M-- > 0; ) Ie.push(ye);
          break;
        case 17:
          for (M = 3 + w(T, L), L += 3; M-- > 0; ) Ie.push(0);
          break;
        case 18:
          for (M = 11 + I(T, L), L += 7; M-- > 0; ) Ie.push(0);
          break;
        default:
          Ie.push(ye), te < ye && (te = ye);
          break;
      }
    var Ke = Ie.slice(0, b), Ye = Ie.slice(b);
    for (we = b; we < 286; ++we) Ke[we] = 0;
    for (we = D; we < 30; ++we) Ye[we] = 0;
    return $e = re(Ke, ke, 286), Cr = re(Ye, Ne, 30), L;
  }
  function pt(T, L) {
    if (T[0] == 3 && !(T[1] & 3))
      return [lt(L), 2];
    for (var b = 0, D = 0, B = ni(L || 1 << 18), M = 0, ae = B.length >>> 0, ue = 0, te = 0; (D & 1) == 0; ) {
      if (D = w(T, b), b += 3, D >>> 1)
        D >> 1 == 1 ? (ue = 9, te = 5) : (b = lr(T, b), ue = $e, te = Cr);
      else {
        b & 7 && (b += 8 - (b & 7));
        var ne = T[b >>> 3] | T[(b >>> 3) + 1] << 8;
        if (b += 32, ne > 0)
          for (!L && ae < M + ne && (B = se(B, M + ne), ae = B.length); ne-- > 0; )
            B[M++] = T[b >>> 3], b += 8;
        continue;
      }
      for (; ; ) {
        !L && ae < M + 32767 && (B = se(B, M + 32767), ae = B.length);
        var ie = C(T, b, ue), ge = D >>> 1 == 1 ? Fe[ie] : ke[ie];
        if (b += ge & 15, ge >>>= 4, (ge >>> 8 & 255) === 0) B[M++] = ge;
        else {
          if (ge == 256) break;
          ge -= 257;
          var we = ge < 8 ? 0 : ge - 4 >> 2;
          we > 5 && (we = 0);
          var ye = M + Te[ge];
          we > 0 && (ye += C(T, b, we), b += we), ie = C(T, b, te), ge = D >>> 1 == 1 ? Oe[ie] : Ne[ie], b += ge & 15, ge >>>= 4;
          var _e = ge < 4 ? 0 : ge - 2 >> 1, Ee = Ce[ge];
          for (_e > 0 && (Ee += C(T, b, _e), b += _e), !L && ae < ye && (B = se(B, ye + 100), ae = B.length); M < ye; )
            B[M] = B[M - Ee], ++M;
        }
      }
    }
    return L ? [B, b + 7 >>> 3] : [B.slice(0, M), b + 7 >>> 3];
  }
  function Ta(T, L) {
    var b = T.slice(T.l || 0), D = pt(b, L);
    return T.l += D[1], D[0];
  }
  function ya(T, L) {
    if (T)
      typeof console < "u" && console.error(L);
    else throw new Error(L);
  }
  function Aa(T, L) {
    var b = (
      /*::(*/
      T
    );
    ir(b, 0);
    var D = [], B = [], M = {
      FileIndex: D,
      FullPaths: B
    };
    S(M, { root: L.root });
    for (var ae = b.length - 4; (b[ae] != 80 || b[ae + 1] != 75 || b[ae + 2] != 5 || b[ae + 3] != 6) && ae >= 0; ) --ae;
    b.l = ae + 4, b.l += 4;
    var ue = b.read_shift(2);
    b.l += 6;
    var te = b.read_shift(4);
    for (b.l = te, ae = 0; ae < ue; ++ae) {
      b.l += 20;
      var ne = b.read_shift(4), ie = b.read_shift(4), ge = b.read_shift(2), we = b.read_shift(2), ye = b.read_shift(2);
      b.l += 8;
      var _e = b.read_shift(4), Ee = s(
        /*::(*/
        b.slice(b.l + ge, b.l + ge + we)
        /*:: :any)*/
      );
      b.l += ge + we + ye;
      var Ie = b.l;
      b.l = _e + 4, Ee && Ee[1] && ((Ee[1] || {}).usz && (ie = Ee[1].usz), (Ee[1] || {}).csz && (ne = Ee[1].csz)), Fa(b, ne, ie, M, Ee), b.l = Ie;
    }
    return M;
  }
  function Fa(T, L, b, D, B) {
    T.l += 2;
    var M = T.read_shift(2), ae = T.read_shift(2), ue = f(T);
    if (M & 8257) throw new Error("Unsupported ZIP encryption");
    for (var te = T.read_shift(4), ne = T.read_shift(4), ie = T.read_shift(4), ge = T.read_shift(2), we = T.read_shift(2), ye = "", _e = 0; _e < ge; ++_e) ye += String.fromCharCode(T[T.l++]);
    if (we) {
      var Ee = s(
        /*::(*/
        T.slice(T.l, T.l + we)
        /*:: :any)*/
      );
      (Ee[21589] || {}).mt && (ue = Ee[21589].mt), (Ee[1] || {}).usz && (ie = Ee[1].usz), (Ee[1] || {}).csz && (ne = Ee[1].csz), B && ((B[21589] || {}).mt && (ue = B[21589].mt), (B[1] || {}).usz && (ie = B[1].usz), (B[1] || {}).csz && (ne = B[1].csz));
    }
    T.l += we;
    var Ie = T.slice(T.l, T.l + ne);
    switch (ae) {
      case 8:
        Ie = pe(T, ie);
        break;
      case 0:
        T.l += ne;
        break;
      // TODO: scan for magic number
      default:
        throw new Error("Unsupported ZIP Compression method " + ae);
    }
    var Ke = !1;
    M & 8 && (te = T.read_shift(4), te == 134695760 && (te = T.read_shift(4), Ke = !0), ne = T.read_shift(4), ie = T.read_shift(4)), ne != L && ya(Ke, "Bad compressed size: " + L + " != " + ne), ie != b && ya(Ke, "Bad uncompressed size: " + b + " != " + ie), on(D, ye, Ie, { unsafe: !0, mt: ue });
  }
  function mt(T, L) {
    var b = L || {}, D = [], B = [], M = ar(1), ae = b.compression ? 8 : 0, ue = 0, te = 0, ne = 0, ie = 0, ge = 0, we = T.FullPaths[0], ye = we, _e = T.FileIndex[0], Ee = [], Ie = 0;
    for (te = 1; te < T.FullPaths.length; ++te)
      if (ye = T.FullPaths[te].slice(we.length), _e = T.FileIndex[te], !(!_e.size || !_e.content || Array.isArray(_e.content) && _e.content.length == 0 || ye == "Sh33tJ5")) {
        var Ke = ie, Ye = ar(ye.length);
        for (ne = 0; ne < ye.length; ++ne) Ye.write_shift(1, ye.charCodeAt(ne) & 127);
        Ye = Ye.slice(0, Ye.l), Ee[ge] = typeof _e.content == "string" ? hi.bstr(_e.content, 0) : hi.buf(
          /*::((*/
          _e.content,
          0
        );
        var pr = typeof _e.content == "string" ? Ir(_e.content) : _e.content;
        ae == 8 && (pr = ce(pr)), M = ar(30), M.write_shift(4, 67324752), M.write_shift(2, 20), M.write_shift(2, ue), M.write_shift(2, ae), _e.mt ? i(M, _e.mt) : M.write_shift(4, 0), M.write_shift(-4, Ee[ge]), M.write_shift(4, pr.length), M.write_shift(
          4,
          /*::(*/
          _e.content.length
        ), M.write_shift(2, Ye.length), M.write_shift(2, 0), ie += M.length, D.push(M), ie += Ye.length, D.push(Ye), ie += pr.length, D.push(pr), M = ar(46), M.write_shift(4, 33639248), M.write_shift(2, 0), M.write_shift(2, 20), M.write_shift(2, ue), M.write_shift(2, ae), M.write_shift(4, 0), M.write_shift(-4, Ee[ge]), M.write_shift(4, pr.length), M.write_shift(
          4,
          /*::(*/
          _e.content.length
        ), M.write_shift(2, Ye.length), M.write_shift(2, 0), M.write_shift(2, 0), M.write_shift(2, 0), M.write_shift(2, 0), M.write_shift(4, 0), M.write_shift(4, Ke), Ie += M.l, B.push(M), Ie += Ye.length, B.push(Ye), ++ge;
      }
    return M = ar(22), M.write_shift(4, 101010256), M.write_shift(2, 0), M.write_shift(2, 0), M.write_shift(2, ge), M.write_shift(2, ge), M.write_shift(4, Ie), M.write_shift(4, ie), M.write_shift(2, 0), ft([ft(D), ft(B), M]);
  }
  var Qr = {
    htm: "text/html",
    xml: "text/xml",
    gif: "image/gif",
    jpg: "image/jpeg",
    png: "image/png",
    mso: "application/x-mso",
    thmx: "application/vnd.ms-officetheme",
    sh33tj5: "application/octet-stream"
  };
  function Ys(T, L) {
    if (T.ctype) return T.ctype;
    var b = T.name || "", D = b.match(/\.([^\.]+)$/);
    return D && Qr[D[1]] || L && (D = (b = L).match(/[\.\\]([^\.\\])+$/), D && Qr[D[1]]) ? Qr[D[1]] : "application/octet-stream";
  }
  function Zs(T) {
    for (var L = ai(T), b = [], D = 0; D < L.length; D += 76) b.push(L.slice(D, D + 76));
    return b.join(`\r
`) + `\r
`;
  }
  function Qs(T) {
    var L = T.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF=]/g, function(ne) {
      var ie = ne.charCodeAt(0).toString(16).toUpperCase();
      return "=" + (ie.length == 1 ? "0" + ie : ie);
    });
    L = L.replace(/ $/mg, "=20").replace(/\t$/mg, "=09"), L.charAt(0) == `
` && (L = "=0D" + L.slice(1)), L = L.replace(/\r(?!\n)/mg, "=0D").replace(/\n\n/mg, `
=0A`).replace(/([^\r\n])\n/mg, "$1=0A");
    for (var b = [], D = L.split(`\r
`), B = 0; B < D.length; ++B) {
      var M = D[B];
      if (M.length == 0) {
        b.push("");
        continue;
      }
      for (var ae = 0; ae < M.length; ) {
        var ue = 76, te = M.slice(ae, ae + ue);
        te.charAt(ue - 1) == "=" ? ue-- : te.charAt(ue - 2) == "=" ? ue -= 2 : te.charAt(ue - 3) == "=" && (ue -= 3), te = M.slice(ae, ae + ue), ae += ue, ae < M.length && (te += "="), b.push(te);
      }
    }
    return b.join(`\r
`);
  }
  function Js(T) {
    for (var L = [], b = 0; b < T.length; ++b) {
      for (var D = T[b]; b <= T.length && D.charAt(D.length - 1) == "="; ) D = D.slice(0, D.length - 1) + T[++b];
      L.push(D);
    }
    for (var B = 0; B < L.length; ++B) L[B] = L[B].replace(/[=][0-9A-Fa-f]{2}/g, function(M) {
      return String.fromCharCode(parseInt(M.slice(1), 16));
    });
    return Ir(L.join(`\r
`));
  }
  function qs(T, L, b) {
    for (var D = "", B = "", M = "", ae, ue = 0; ue < 10; ++ue) {
      var te = L[ue];
      if (!te || te.match(/^\s*$/)) break;
      var ne = te.match(/^([^:]*?):\s*([^\s].*)$/);
      if (ne) switch (ne[1].toLowerCase()) {
        case "content-location":
          D = ne[2].trim();
          break;
        case "content-type":
          M = ne[2].trim();
          break;
        case "content-transfer-encoding":
          B = ne[2].trim();
          break;
      }
    }
    switch (++ue, B.toLowerCase()) {
      case "base64":
        ae = Ir(Rr(L.slice(ue).join("")));
        break;
      case "quoted-printable":
        ae = Js(L.slice(ue));
        break;
      default:
        throw new Error("Unsupported Content-Transfer-Encoding " + B);
    }
    var ie = on(T, D.slice(b.length), ae, { unsafe: !0 });
    M && (ie.ctype = M);
  }
  function ef(T, L) {
    if (fe(T.slice(0, 13)).toLowerCase() != "mime-version:") throw new Error("Unsupported MAD header");
    var b = L && L.root || "", D = (Pe && Buffer.isBuffer(T) ? T.toString("binary") : fe(T)).split(`\r
`), B = 0, M = "";
    for (B = 0; B < D.length; ++B)
      if (M = D[B], !!/^Content-Location:/i.test(M) && (M = M.slice(M.indexOf("file")), b || (b = M.slice(0, M.lastIndexOf("/") + 1)), M.slice(0, b.length) != b))
        for (; b.length > 0 && (b = b.slice(0, b.length - 1), b = b.slice(0, b.lastIndexOf("/") + 1), M.slice(0, b.length) != b); )
          ;
    var ae = (D[1] || "").match(/boundary="(.*?)"/);
    if (!ae) throw new Error("MAD cannot find boundary");
    var ue = "--" + (ae[1] || ""), te = [], ne = [], ie = {
      FileIndex: te,
      FullPaths: ne
    };
    S(ie);
    var ge, we = 0;
    for (B = 0; B < D.length; ++B) {
      var ye = D[B];
      ye !== ue && ye !== ue + "--" || (we++ && qs(ie, D.slice(ge, B), b), ge = B);
    }
    return ie;
  }
  function rf(T, L) {
    var b = L || {}, D = b.boundary || "SheetJS";
    D = "------=" + D;
    for (var B = [
      "MIME-Version: 1.0",
      'Content-Type: multipart/related; boundary="' + D.slice(2) + '"',
      "",
      "",
      ""
    ], M = T.FullPaths[0], ae = M, ue = T.FileIndex[0], te = 1; te < T.FullPaths.length; ++te)
      if (ae = T.FullPaths[te].slice(M.length), ue = T.FileIndex[te], !(!ue.size || !ue.content || ae == "Sh33tJ5")) {
        ae = ae.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF]/g, function(Ie) {
          return "_x" + Ie.charCodeAt(0).toString(16) + "_";
        }).replace(/[\u0080-\uFFFF]/g, function(Ie) {
          return "_u" + Ie.charCodeAt(0).toString(16) + "_";
        });
        for (var ne = ue.content, ie = Pe && Buffer.isBuffer(ne) ? ne.toString("binary") : fe(ne), ge = 0, we = Math.min(1024, ie.length), ye = 0, _e = 0; _e <= we; ++_e) (ye = ie.charCodeAt(_e)) >= 32 && ye < 128 && ++ge;
        var Ee = ge >= we * 4 / 5;
        B.push(D), B.push("Content-Location: " + (b.root || "file:///C:/SheetJS/") + ae), B.push("Content-Transfer-Encoding: " + (Ee ? "quoted-printable" : "base64")), B.push("Content-Type: " + Ys(ue, ae)), B.push(""), B.push(Ee ? Qs(ie) : Zs(ie));
      }
    return B.push(D + `--\r
`), B.join(`\r
`);
  }
  function tf(T) {
    var L = {};
    return S(L, T), L;
  }
  function on(T, L, b, D) {
    var B = D && D.unsafe;
    B || S(T);
    var M = !B && Ue.find(T, L);
    if (!M) {
      var ae = T.FullPaths[0];
      L.slice(0, ae.length) == ae ? ae = L : (ae.slice(-1) != "/" && (ae += "/"), ae = (ae + L).replace("//", "/")), M = { name: a(L), type: 2 }, T.FileIndex.push(M), T.FullPaths.push(ae), B || Ue.utils.cfb_gc(T);
    }
    return M.content = b, M.size = b ? b.length : 0, D && (D.CLSID && (M.clsid = D.CLSID), D.mt && (M.mt = D.mt), D.ct && (M.ct = D.ct)), M;
  }
  function af(T, L) {
    S(T);
    var b = Ue.find(T, L);
    if (b) {
      for (var D = 0; D < T.FileIndex.length; ++D) if (T.FileIndex[D] == b)
        return T.FileIndex.splice(D, 1), T.FullPaths.splice(D, 1), !0;
    }
    return !1;
  }
  function nf(T, L, b) {
    S(T);
    var D = Ue.find(T, L);
    if (D) {
      for (var B = 0; B < T.FileIndex.length; ++B) if (T.FileIndex[B] == D)
        return T.FileIndex[B].name = a(b), T.FullPaths[B] = b, !0;
    }
    return !1;
  }
  function sf(T) {
    F(T, !0);
  }
  return t.find = H, t.read = P, t.parse = u, t.write = q, t.writeFile = xe, t.utils = {
    cfb_new: tf,
    cfb_add: on,
    cfb_del: af,
    cfb_mov: nf,
    cfb_gc: sf,
    ReadShift: Jt,
    CheckField: X0,
    prep_blob: ir,
    bconcat: ft,
    use_zlib: Y,
    _deflateRaw: qe,
    _inflateRaw: Ta,
    consts: Z
  }, t;
})(), Hf;
function Vf(e) {
  if (typeof Deno < "u") return Deno.readFileSync(e);
  if (typeof $ < "u" && typeof File < "u" && typeof Folder < "u") try {
    var t = File(e);
    t.open("r"), t.encoding = "binary";
    var r = t.read();
    return t.close(), r;
  } catch (n) {
    if (!n.message || n.message.indexOf("onstruct") == -1) throw n;
  }
  throw new Error("Cannot access file " + e);
}
function zr(e) {
  for (var t = Object.keys(e), r = [], n = 0; n < t.length; ++n) Object.prototype.hasOwnProperty.call(e, t[n]) && r.push(t[n]);
  return r;
}
function Bn(e) {
  for (var t = [], r = zr(e), n = 0; n !== r.length; ++n) t[e[r[n]]] = r[n];
  return t;
}
var E0 = /* @__PURE__ */ Date.UTC(1899, 11, 30, 0, 0, 0), Gf = /* @__PURE__ */ Date.UTC(1899, 11, 31, 0, 0, 0), Xf = /* @__PURE__ */ Date.UTC(1904, 0, 1, 0, 0, 0);
function sr(e, t) {
  var r = /* @__PURE__ */ e.getTime(), n = (r - E0) / (1440 * 60 * 1e3);
  return t ? (n -= 1462, n < -1402 ? n - 1 : n) : n < 60 ? n - 1 : n;
}
function ot(e) {
  if (e >= 60 && e < 61) return e;
  var t = /* @__PURE__ */ new Date();
  return t.setTime((e > 60 ? e : e + 1) * 24 * 60 * 60 * 1e3 + E0), t;
}
function $f(e) {
  var t = 0, r = 0, n = !1, a = e.match(/P([0-9\.]+Y)?([0-9\.]+M)?([0-9\.]+D)?T([0-9\.]+H)?([0-9\.]+M)?([0-9\.]+S)?/);
  if (!a) throw new Error("|" + e + "| is not an ISO8601 Duration");
  for (var i = 1; i != a.length; ++i)
    if (a[i]) {
      switch (r = 1, i > 3 && (n = !0), a[i].slice(a[i].length - 1)) {
        case "Y":
          throw new Error("Unsupported ISO Duration Field: " + a[i].slice(a[i].length - 1));
        case "D":
          r *= 24;
        /* falls through */
        case "H":
          r *= 60;
        /* falls through */
        case "M":
          if (n) r *= 60;
          else throw new Error("Unsupported ISO Duration Field: M");
      }
      t += r * parseInt(a[i], 10);
    }
  return t;
}
var jf = /^(\d+):(\d+)(:\d+)?(\.\d+)?$/, Kf = /^(\d+)-(\d+)-(\d+)$/, T0 = /^(\d+)-(\d+)-(\d+)[T ](\d+):(\d+)(:\d+)?(\.\d+)?$/;
function dr(e, t) {
  if (e instanceof Date) return e;
  var r = e.match(jf);
  if (r) return new Date((t ? Xf : Gf) + ((parseInt(r[1], 10) * 60 + parseInt(r[2], 10)) * 60 + (r[3] ? parseInt(r[3].slice(1), 10) : 0)) * 1e3 + (r[4] ? parseInt((r[4] + "000").slice(1, 4), 10) : 0));
  if (r = e.match(Kf), r) return new Date(Date.UTC(+r[1], +r[2] - 1, +r[3], 0, 0, 0, 0));
  if (r = e.match(T0), r) return new Date(Date.UTC(+r[1], +r[2] - 1, +r[3], +r[4], +r[5], r[6] && parseInt(r[6].slice(1), 10) || 0, r[7] && parseInt((r[7] + "0000").slice(1, 4), 10) || 0));
  var n = new Date(e);
  return n;
}
function Ft(e, t) {
  if (Pe && Buffer.isBuffer(e)) {
    if (t && ca) {
      if (e[0] == 255 && e[1] == 254) return Yt(e.slice(2).toString("utf16le"));
      if (e[1] == 254 && e[2] == 255) return Yt(h0(e.slice(2).toString("binary")));
    }
    return e.toString("binary");
  }
  if (typeof TextDecoder < "u") try {
    if (t) {
      if (e[0] == 255 && e[1] == 254) return Yt(new TextDecoder("utf-16le").decode(e.slice(2)));
      if (e[0] == 254 && e[1] == 255) return Yt(new TextDecoder("utf-16be").decode(e.slice(2)));
    }
    var r = {
      "€": "",
      "‚": "",
      ƒ: "",
      "„": "",
      "…": "",
      "†": "",
      "‡": "",
      "ˆ": "",
      "‰": "",
      Š: "",
      "‹": "",
      Œ: "",
      Ž: "",
      "‘": "",
      "’": "",
      "“": "",
      "”": "",
      "•": "",
      "–": "",
      "—": "",
      "˜": "",
      "™": "",
      š: "",
      "›": "",
      œ: "",
      ž: "",
      Ÿ: ""
    };
    return Array.isArray(e) && (e = new Uint8Array(e)), new TextDecoder("latin1").decode(e).replace(/[€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/g, function(i) {
      return r[i] || i;
    });
  } catch {
  }
  var n = [], a = 0;
  try {
    for (a = 0; a < e.length - 65536; a += 65536) n.push(String.fromCharCode.apply(0, e.slice(a, a + 65536)));
    n.push(String.fromCharCode.apply(0, e.slice(a)));
  } catch {
    try {
      for (; a < e.length - 16384; a += 16384) n.push(String.fromCharCode.apply(0, e.slice(a, a + 16384)));
      n.push(String.fromCharCode.apply(0, e.slice(a)));
    } catch {
      for (; a != e.length; ++a) n.push(String.fromCharCode(e[a]));
    }
  }
  return n.join("");
}
function nr(e) {
  if (typeof JSON < "u" && !Array.isArray(e)) return JSON.parse(JSON.stringify(e));
  if (typeof e != "object" || e == null) return e;
  if (e instanceof Date) return new Date(e.getTime());
  var t = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = nr(e[r]));
  return t;
}
function Me(e, t) {
  for (var r = ""; r.length < t; ) r += e;
  return r;
}
function Dr(e) {
  var t = Number(e);
  if (!isNaN(t)) return isFinite(t) ? t : NaN;
  if (!/\d/.test(e)) return t;
  var r = 1, n = e.replace(/([\d]),([\d])/g, "$1$2").replace(/[$]/g, "").replace(/[%]/g, function() {
    return r *= 100, "";
  });
  return !isNaN(t = Number(n)) || (n = n.replace(/[(]([^()]*)[)]/, function(a, i) {
    return r = -r, i;
  }), !isNaN(t = Number(n))) ? t / r : t;
}
var Yf = /^(0?\d|1[0-2])(?:|:([0-5]?\d)(?:|(\.\d+)(?:|:([0-5]?\d))|:([0-5]?\d)(|\.\d+)))\s+([ap])m?$/, Zf = /^([01]?\d|2[0-3])(?:|:([0-5]?\d)(?:|(\.\d+)(?:|:([0-5]?\d))|:([0-5]?\d)(|\.\d+)))$/, Qf = /^(\d+)-(\d+)-(\d+)[T ](\d+):(\d+)(:\d+)(\.\d+)?[Z]?$/, Jf = (/* @__PURE__ */ new Date("6/9/69 00:00 UTC")).valueOf() == -177984e5;
function qf(e) {
  return e[2] ? e[3] ? e[4] ? new Date(Date.UTC(1899, 11, 31, +e[1] % 12 + (e[7] == "p" ? 12 : 0), +e[2], +e[4], parseFloat(e[3]) * 1e3)) : new Date(Date.UTC(1899, 11, 31, e[7] == "p" ? 12 : 0, +e[1], +e[2], parseFloat(e[3]) * 1e3)) : e[5] ? new Date(Date.UTC(1899, 11, 31, +e[1] % 12 + (e[7] == "p" ? 12 : 0), +e[2], +e[5], e[6] ? parseFloat(e[6]) * 1e3 : 0)) : new Date(Date.UTC(1899, 11, 31, +e[1] % 12 + (e[7] == "p" ? 12 : 0), +e[2], 0, 0)) : new Date(Date.UTC(1899, 11, 31, +e[1] % 12 + (e[7] == "p" ? 12 : 0), 0, 0, 0));
}
function ec(e) {
  return e[2] ? e[3] ? e[4] ? new Date(Date.UTC(1899, 11, 31, +e[1], +e[2], +e[4], parseFloat(e[3]) * 1e3)) : new Date(Date.UTC(1899, 11, 31, 0, +e[1], +e[2], parseFloat(e[3]) * 1e3)) : e[5] ? new Date(Date.UTC(1899, 11, 31, +e[1], +e[2], +e[5], e[6] ? parseFloat(e[6]) * 1e3 : 0)) : new Date(Date.UTC(1899, 11, 31, +e[1], +e[2], 0, 0)) : new Date(Date.UTC(1899, 11, 31, +e[1], 0, 0, 0));
}
var rc = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
function la(e) {
  if (Qf.test(e)) return e.indexOf("Z") == -1 ? en(new Date(e)) : new Date(e);
  var t = e.toLowerCase(), r = t.replace(/\s+/g, " ").trim(), n = r.match(Yf);
  if (n) return qf(n);
  if (n = r.match(Zf), n) return ec(n);
  if (n = r.match(T0), n) return new Date(Date.UTC(+n[1], +n[2] - 1, +n[3], +n[4], +n[5], n[6] && parseInt(n[6].slice(1), 10) || 0, n[7] && parseInt((n[7] + "0000").slice(1, 4), 10) || 0));
  var a = new Date(Jf && e.indexOf("UTC") == -1 ? e + " UTC" : e), i = /* @__PURE__ */ new Date(NaN), f = a.getYear();
  a.getMonth();
  var s = a.getDate();
  if (isNaN(s)) return i;
  if (t.match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/)) {
    if (t = t.replace(/[^a-z]/g, "").replace(/([^a-z]|^)[ap]m?([^a-z]|$)/, ""), t.length > 3 && rc.indexOf(t) == -1) return i;
  } else if (t.replace(/[ap]m?/, "").match(/[a-z]/)) return i;
  return f < 0 || f > 8099 || e.match(/[^-0-9:,\/\\\ ]/) ? i : a;
}
var tc = /* @__PURE__ */ (function() {
  var e = "abacaba".split(/(:?b)/i).length == 5;
  return function(r, n, a) {
    if (e || typeof n == "string") return r.split(n);
    for (var i = r.split(n), f = [i[0]], s = 1; s < i.length; ++s)
      f.push(a), f.push(i[s]);
    return f;
  };
})();
function St(e) {
  return new Date(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds());
}
function en(e) {
  return new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate(), e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()));
}
function Ln(e) {
  var t = e.slice(0, 1024), r = t.indexOf("<!DOCTYPE");
  if (r == -1) return e;
  var n = e.match(/<[\w]/);
  return n ? e.slice(0, r) + e.slice(n.index) : e;
}
function Mn(e, t, r) {
  for (var n = [], a = e.indexOf(t); a > -1; ) {
    var i = e.indexOf(r, a + t.length);
    if (i == -1) break;
    n.push(e.slice(a, i + r.length)), a = e.indexOf(t, i + r.length);
  }
  return n.length > 0 ? n : null;
}
function ma(e, t, r) {
  var n = [], a = 0, i = e.indexOf(t);
  if (i == -1) return e;
  for (; i > -1; ) {
    n.push(e.slice(a, i));
    var f = e.indexOf(r, i + t.length);
    if (f == -1) break;
    (i = e.indexOf(t, a = f + r.length)) == -1 && n.push(e.slice(a));
  }
  return n.join("");
}
var ac = { " ": 1, "	": 1, "\r": 1, "\n": 1, ">": 1 };
function kt(e, t) {
  for (var r = e.indexOf("<" + t), n = t.length + 1, a = e.length; r >= 0 && r <= a - n && !ac[e.charAt(r + n)]; ) r = e.indexOf("<" + t, r + 1);
  if (r === -1) return null;
  var i = e.indexOf(">", r + t.length);
  if (i === -1) return null;
  var f = "</" + t + ">", s = e.indexOf(f, i);
  return s == -1 ? null : [e.slice(r, s + f.length), e.slice(i + 1, s)];
}
var or = /* @__PURE__ */ (function() {
  var e = {};
  return function(r, n) {
    var a = e[n];
    a || (e[n] = a = [
      new RegExp("<(?:\\w+:)?" + n + "\\b[^<>]*>", "g"),
      new RegExp("</(?:\\w+:)?" + n + ">", "g")
    ]), a[0].lastIndex = a[1].lastIndex = 0;
    var i = a[0].exec(r);
    if (!i) return null;
    var f = i.index, s = a[0].lastIndex;
    if (a[1].lastIndex = a[0].lastIndex, i = a[1].exec(r), !i) return null;
    var c = i.index, o = a[1].lastIndex;
    return [r.slice(f, o), r.slice(s, c)];
  };
})(), y0 = /* @__PURE__ */ (function() {
  var e = {};
  return function(r, n) {
    var a = [], i = e[n];
    i || (e[n] = i = [
      new RegExp("<(?:\\w+:)?" + n + "\\b[^<>]*>", "g"),
      new RegExp("</(?:\\w+:)?" + n + ">", "g")
    ]), i[0].lastIndex = i[1].lastIndex = 0;
    for (var f; f = i[0].exec(r); ) {
      var s = f.index;
      if (i[1].lastIndex = i[0].lastIndex, f = i[1].exec(r), !f) return null;
      var c = i[1].lastIndex;
      a.push(r.slice(s, c)), i[0].lastIndex = i[1].lastIndex;
    }
    return a.length == 0 ? null : a;
  };
})(), nc = /* @__PURE__ */ (function() {
  var e = {};
  return function(r, n) {
    var a = [], i = e[n];
    i || (e[n] = i = [
      new RegExp("<(?:\\w+:)?" + n + "\\b[^<>]*>", "g"),
      new RegExp("</(?:\\w+:)?" + n + ">", "g")
    ]), i[0].lastIndex = i[1].lastIndex = 0;
    for (var f, s = 0, c = 0; f = i[0].exec(r); ) {
      if (s = f.index, a.push(r.slice(c, s)), c = s, i[1].lastIndex = i[0].lastIndex, f = i[1].exec(r), !f) return null;
      c = i[1].lastIndex, i[0].lastIndex = i[1].lastIndex;
    }
    return a.push(r.slice(c)), a.length == 0 ? "" : a.join("");
  };
})(), ic = /* @__PURE__ */ (function() {
  var e = {};
  return function(r, n) {
    var a = [], i = e[n];
    i || (e[n] = i = [
      new RegExp("<" + n + "\\b[^<>]*>", "ig"),
      new RegExp("</" + n + ">", "ig")
    ]), i[0].lastIndex = i[1].lastIndex = 0;
    for (var f; f = i[0].exec(r); ) {
      var s = f.index;
      if (i[1].lastIndex = i[0].lastIndex, f = i[1].exec(r), !f) return null;
      var c = i[1].lastIndex;
      a.push(r.slice(s, c)), i[0].lastIndex = i[1].lastIndex;
    }
    return a.length == 0 ? null : a;
  };
})();
function A0(e) {
  return e ? e.content && e.type ? Ft(e.content, !0) : e.data ? jt(e.data) : e.asNodeBuffer && Pe ? jt(e.asNodeBuffer().toString("binary")) : e.asBinary ? jt(e.asBinary()) : e._data && e._data.getContent ? jt(Ft(Array.prototype.slice.call(e._data.getContent(), 0))) : null : null;
}
function F0(e) {
  if (!e) return null;
  if (e.data) return ri(e.data);
  if (e.asNodeBuffer && Pe) return e.asNodeBuffer();
  if (e._data && e._data.getContent) {
    var t = e._data.getContent();
    return typeof t == "string" ? ri(t) : Array.prototype.slice.call(t);
  }
  return e.content && e.type ? e.content : null;
}
function sc(e) {
  return e && e.name.slice(-4) === ".bin" ? F0(e) : A0(e);
}
function Lr(e, t) {
  for (var r = e.FullPaths || zr(e.files), n = t.toLowerCase().replace(/[\/]/g, "\\"), a = n.replace(/\\/g, "/"), i = 0; i < r.length; ++i) {
    var f = r[i].replace(/^Root Entry[\/]/, "").toLowerCase();
    if (n == f || a == f) return e.files ? e.files[r[i]] : e.FileIndex[i];
  }
  return null;
}
function Un(e, t) {
  var r = Lr(e, t);
  if (r == null) throw new Error("Cannot find file " + t + " in zip");
  return r;
}
function rr(e, t, r) {
  if (!r) return sc(Un(e, t));
  if (!t) return null;
  try {
    return rr(e, t);
  } catch {
    return null;
  }
}
function yr(e, t, r) {
  if (!r) return A0(Un(e, t));
  if (!t) return null;
  try {
    return yr(e, t);
  } catch {
    return null;
  }
}
function fc(e, t, r) {
  return F0(Un(e, t));
}
function di(e) {
  for (var t = e.FullPaths || zr(e.files), r = [], n = 0; n < t.length; ++n) t[n].slice(-1) != "/" && r.push(t[n].replace(/^Root Entry[\/]/, ""));
  return r.sort();
}
function cc(e, t, r) {
  if (e.FullPaths) {
    if (Array.isArray(r) && typeof r[0] == "string" && (r = r.join("")), typeof r == "string") {
      var n;
      return Pe ? n = dt(r) : n = pf(r), Ue.utils.cfb_add(e, t, n);
    }
    Ue.utils.cfb_add(e, t, r);
  } else e.file(t, r);
}
function S0(e, t) {
  switch (t.type) {
    case "base64":
      return Ue.read(e, { type: "base64" });
    case "binary":
      return Ue.read(e, { type: "binary" });
    case "buffer":
    case "array":
      return Ue.read(e, { type: "buffer" });
  }
  throw new Error("Unrecognized type " + t.type);
}
function Bt(e, t) {
  if (e.charAt(0) == "/") return e.slice(1);
  var r = t.split("/");
  t.slice(-1) != "/" && r.pop();
  for (var n = e.split("/"); n.length !== 0; ) {
    var a = n.shift();
    a === ".." ? r.pop() : a !== "." && r.push(a);
  }
  return r.join("/");
}
var C0 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r
`, b0 = /\s([^"\s?>\/]+)\s*=\s*((?:")([^"]*)(?:")|(?:')([^']*)(?:')|([^'">\s]+))/g, xi = /<[\/\?]?[a-zA-Z0-9:_-]+(?:\s+[^"\s?<>\/]+\s*=\s*(?:"[^"]*"|'[^']*'|[^'"<>\s=]+))*\s*[\/\?]?>/mg, oc = /<[^<>]*>/g, xr = /* @__PURE__ */ C0.match(xi) ? xi : oc, lc = /<\w*:/, uc = /<(\/?)\w+:/;
function Ae(e, t, r) {
  for (var n = {}, a = 0, i = 0; a !== e.length && !((i = e.charCodeAt(a)) === 32 || i === 10 || i === 13); ++a) ;
  if (t || (n[0] = e.slice(0, a)), a === e.length) return n;
  var f = e.match(b0), s = 0, c = "", o = 0, u = "", m = "", x = 1;
  if (f) for (o = 0; o != f.length; ++o) {
    for (m = f[o].slice(1), i = 0; i != m.length && m.charCodeAt(i) !== 61; ++i) ;
    for (u = m.slice(0, i).trim(); m.charCodeAt(i + 1) == 32; ) ++i;
    for (x = (a = m.charCodeAt(i + 1)) == 34 || a == 39 ? 1 : 0, c = m.slice(i + 1 + x, m.length - x), s = 0; s != u.length && u.charCodeAt(s) !== 58; ++s) ;
    if (s === u.length)
      u.indexOf("_") > 0 && (u = u.slice(0, u.indexOf("_"))), n[u] = c, n[u.toLowerCase()] = c;
    else {
      var l = (s === 5 && u.slice(0, 5) === "xmlns" ? "xmlns" : "") + u.slice(s + 1);
      if (n[l] && u.slice(s - 3, s) == "ext") continue;
      n[l] = c, n[l.toLowerCase()] = c;
    }
  }
  return n;
}
function hc(e, t, r) {
  for (var n = {}, a = 0, i = 0; a !== e.length && !((i = e.charCodeAt(a)) === 32 || i === 10 || i === 13); ++a) ;
  if (a === e.length) return n;
  var f = e.match(b0), s = "", c = 0, o = "", u = "", m = 1;
  if (f) for (c = 0; c != f.length; ++c) {
    for (u = f[c].slice(1), i = 0; i != u.length && u.charCodeAt(i) !== 61; ++i) ;
    for (o = u.slice(0, i).trim(); u.charCodeAt(i + 1) == 32; ) ++i;
    m = (a = u.charCodeAt(i + 1)) == 34 || a == 39 ? 1 : 0, s = u.slice(i + 1 + m, u.length - m), o.indexOf("_") > 0 && (o = o.slice(0, o.indexOf("_"))), n[o] = s, n[o.toLowerCase()] = s;
  }
  return n;
}
function Wr(e) {
  return e.replace(uc, "<$1");
}
var I0 = {
  "&quot;": '"',
  "&apos;": "'",
  "&gt;": ">",
  "&lt;": "<",
  "&amp;": "&"
}, dc = /* @__PURE__ */ Bn(I0), Be = /* @__PURE__ */ (function() {
  var e = /&(?:quot|apos|gt|lt|amp|#x?([\da-fA-F]+));/ig, t = /_x([\da-fA-F]{4})_/ig;
  function r(n) {
    var a = n + "", i = a.indexOf("<![CDATA[");
    if (i == -1) return a.replace(e, function(s, c) {
      return I0[s] || String.fromCharCode(parseInt(c, s.indexOf("x") > -1 ? 16 : 10)) || s;
    }).replace(t, function(s, c) {
      return String.fromCharCode(parseInt(c, 16));
    });
    var f = a.indexOf("]]>");
    return r(a.slice(0, i)) + a.slice(i + 9, f) + r(a.slice(f + 3));
  }
  return function(a, i) {
    var f = r(a);
    return i ? f.replace(/\r\n/g, `
`) : f;
  };
})(), xc = /[&<>'"]/g, pc = /[\u0000-\u001f]/g;
function Qt(e) {
  var t = e + "";
  return t.replace(xc, function(r) {
    return dc[r];
  }).replace(/\n/g, "<br/>").replace(pc, function(r) {
    return "&#x" + ("000" + r.charCodeAt(0).toString(16)).slice(-4) + ";";
  });
}
var pi = /* @__PURE__ */ (function() {
  var e = /&#(\d+);/g;
  function t(r, n) {
    return String.fromCharCode(parseInt(n, 10));
  }
  return function(n) {
    return n.replace(e, t);
  };
})();
function Ve(e) {
  switch (e) {
    case 1:
    case !0:
    case "1":
    case "true":
      return !0;
    case 0:
    case !1:
    case "0":
    case "false":
      return !1;
  }
  return !1;
}
function hn(e) {
  for (var t = "", r = 0, n = 0, a = 0, i = 0, f = 0, s = 0; r < e.length; ) {
    if (n = e.charCodeAt(r++), n < 128) {
      t += String.fromCharCode(n);
      continue;
    }
    if (a = e.charCodeAt(r++), n > 191 && n < 224) {
      f = (n & 31) << 6, f |= a & 63, t += String.fromCharCode(f);
      continue;
    }
    if (i = e.charCodeAt(r++), n < 240) {
      t += String.fromCharCode((n & 15) << 12 | (a & 63) << 6 | i & 63);
      continue;
    }
    f = e.charCodeAt(r++), s = ((n & 7) << 18 | (a & 63) << 12 | (i & 63) << 6 | f & 63) - 65536, t += String.fromCharCode(55296 + (s >>> 10 & 1023)), t += String.fromCharCode(56320 + (s & 1023));
  }
  return t;
}
function mi(e) {
  var t = lt(2 * e.length), r, n, a = 1, i = 0, f = 0, s;
  for (n = 0; n < e.length; n += a)
    a = 1, (s = e.charCodeAt(n)) < 128 ? r = s : s < 224 ? (r = (s & 31) * 64 + (e.charCodeAt(n + 1) & 63), a = 2) : s < 240 ? (r = (s & 15) * 4096 + (e.charCodeAt(n + 1) & 63) * 64 + (e.charCodeAt(n + 2) & 63), a = 3) : (a = 4, r = (s & 7) * 262144 + (e.charCodeAt(n + 1) & 63) * 4096 + (e.charCodeAt(n + 2) & 63) * 64 + (e.charCodeAt(n + 3) & 63), r -= 65536, f = 55296 + (r >>> 10 & 1023), r = 56320 + (r & 1023)), f !== 0 && (t[i++] = f & 255, t[i++] = f >>> 8, f = 0), t[i++] = r % 256, t[i++] = r >>> 8;
  return t.slice(0, i).toString("ucs2");
}
function vi(e) {
  return dt(e, "binary").toString("utf8");
}
var Ia = "foo bar bazâð£", Xe = Pe && (/* @__PURE__ */ vi(Ia) == /* @__PURE__ */ hn(Ia) && vi || /* @__PURE__ */ mi(Ia) == /* @__PURE__ */ hn(Ia) && mi) || hn, Yt = Pe ? function(e) {
  return dt(e, "utf8").toString("binary");
} : function(e) {
  for (var t = [], r = 0, n = 0, a = 0; r < e.length; )
    switch (n = e.charCodeAt(r++), !0) {
      case n < 128:
        t.push(String.fromCharCode(n));
        break;
      case n < 2048:
        t.push(String.fromCharCode(192 + (n >> 6))), t.push(String.fromCharCode(128 + (n & 63)));
        break;
      case (n >= 55296 && n < 57344):
        n -= 55296, a = e.charCodeAt(r++) - 56320 + (n << 10), t.push(String.fromCharCode(240 + (a >> 18 & 7))), t.push(String.fromCharCode(144 + (a >> 12 & 63))), t.push(String.fromCharCode(128 + (a >> 6 & 63))), t.push(String.fromCharCode(128 + (a & 63)));
        break;
      default:
        t.push(String.fromCharCode(224 + (n >> 12))), t.push(String.fromCharCode(128 + (n >> 6 & 63))), t.push(String.fromCharCode(128 + (n & 63)));
    }
  return t.join("");
}, O0 = /* @__PURE__ */ (function() {
  var e = [
    ["nbsp", " "],
    ["middot", "·"],
    ["quot", '"'],
    ["apos", "'"],
    ["gt", ">"],
    ["lt", "<"],
    ["amp", "&"]
  ].map(function(t) {
    return [new RegExp("&" + t[0] + ";", "ig"), t[1]];
  });
  return function(r) {
    for (var n = r.replace(/^[\t\n\r ]+/, "").replace(/(^|[^\t\n\r ])[\t\n\r ]+$/, "$1").replace(/>\s+/g, ">").replace(/\b\s+</g, "<").replace(/[\t\n\r ]+/g, " ").replace(/<\s*[bB][rR]\s*\/?>/g, `
`).replace(/<[^<>]*>/g, ""), a = 0; a < e.length; ++a) n = n.replace(e[a][0], e[a][1]);
    return n;
  };
})(), mc = /<\/?(?:vt:)?variant>/g, vc = /<(?:vt:)([^<"'>]*)>([\s\S]*)</;
function gi(e, t) {
  var r = Ae(e), n = y0(e, r.baseType) || [], a = [];
  if (n.length != r.size) {
    if (t.WTF) throw new Error("unexpected vector length " + n.length + " != " + r.size);
    return a;
  }
  return n.forEach(function(i) {
    var f = i.replace(mc, "").match(vc);
    f && a.push({ v: Xe(f[2]), t: f[1] });
  }), a;
}
var gc = /(^\s|\s$|\n)/;
function _c(e) {
  return zr(e).map(function(t) {
    return " " + t + '="' + e[t] + '"';
  }).join("");
}
function wc(e, t, r) {
  return "<" + e + (r != null ? _c(r) : "") + (t != null ? (t.match(gc) ? ' xml:space="preserve"' : "") + ">" + t + "</" + e : "/") + ">";
}
function rn(e) {
  if (Pe && /*::typeof Buffer !== "undefined" && d != null && d instanceof Buffer &&*/
  Buffer.isBuffer(e)) return e.toString("utf8");
  if (typeof e == "string") return e;
  if (typeof Uint8Array < "u" && e instanceof Uint8Array) return Xe(nt(Rn(e)));
  throw new Error("Bad input format: expected Buffer or string");
}
var tr = /<([\/]?)([^\s?><!\/:"]*:|)([^\s?<>:\/"]+)(?:\s+[^<>=?"'\s]+="[^"]*?")*\s*[\/]?>/mg, kc = {
  CT: "http://schemas.openxmlformats.org/package/2006/content-types"
}, Ec = [
  "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
  "http://purl.oclc.org/ooxml/spreadsheetml/main",
  "http://schemas.microsoft.com/office/excel/2006/main",
  "http://schemas.microsoft.com/office/excel/2006/2"
];
function Tc(e, t) {
  for (var r = 1 - 2 * (e[t + 7] >>> 7), n = ((e[t + 7] & 127) << 4) + (e[t + 6] >>> 4 & 15), a = e[t + 6] & 15, i = 5; i >= 0; --i) a = a * 256 + e[t + i];
  return n == 2047 ? a == 0 ? r * (1 / 0) : NaN : (n == 0 ? n = -1022 : (n -= 1023, a += Math.pow(2, 52)), r * Math.pow(2, n - 52) * a);
}
function yc(e, t, r) {
  var n = (t < 0 || 1 / t == -1 / 0 ? 1 : 0) << 7, a = 0, i = 0, f = n ? -t : t;
  isFinite(f) ? f == 0 ? a = i = 0 : (a = Math.floor(Math.log(f) / Math.LN2), i = f * Math.pow(2, 52 - a), a <= -1023 && (!isFinite(i) || i < Math.pow(2, 52)) ? a = -1022 : (i -= Math.pow(2, 52), a += 1023)) : (a = 2047, i = isNaN(t) ? 26985 : 0);
  for (var s = 0; s <= 5; ++s, i /= 256) e[r + s] = i & 255;
  e[r + 6] = (a & 15) << 4 | i & 15, e[r + 7] = a >> 4 | n;
}
var _i = function(e) {
  for (var t = [], r = 10240, n = 0; n < e[0].length; ++n) if (e[0][n]) for (var a = 0, i = e[0][n].length; a < i; a += r) t.push.apply(t, e[0][n].slice(a, a + r));
  return t;
}, wi = Pe ? function(e) {
  return e[0].length > 0 && Buffer.isBuffer(e[0][0]) ? Buffer.concat(e[0].map(function(t) {
    return Buffer.isBuffer(t) ? t : dt(t);
  })) : _i(e);
} : _i, ki = function(e, t, r) {
  for (var n = [], a = t; a < r; a += 2) n.push(String.fromCharCode(rt(e, a)));
  return n.join("").replace(Fr, "");
}, zn = Pe ? function(e, t, r) {
  return !Buffer.isBuffer(e) || !ca ? ki(e, t, r) : e.toString("utf16le", t, r).replace(Fr, "");
} : ki, Ei = function(e, t, r) {
  for (var n = [], a = t; a < t + r; ++a) n.push(("0" + e[a].toString(16)).slice(-2));
  return n.join("");
}, D0 = Pe ? function(e, t, r) {
  return Buffer.isBuffer(e) ? e.toString("hex", t, t + r) : Ei(e, t, r);
} : Ei, Ti = function(e, t, r) {
  for (var n = [], a = t; a < r; a++) n.push(String.fromCharCode(Pt(e, a)));
  return n.join("");
}, va = Pe ? function(t, r, n) {
  return Buffer.isBuffer(t) ? t.toString("utf8", r, n) : Ti(t, r, n);
} : Ti, R0 = function(e, t) {
  var r = Or(e, t);
  return r > 0 ? va(e, t + 4, t + 4 + r - 1) : "";
}, N0 = R0, P0 = function(e, t) {
  var r = Or(e, t);
  return r > 0 ? va(e, t + 4, t + 4 + r - 1) : "";
}, B0 = P0, L0 = function(e, t) {
  var r = 2 * Or(e, t);
  return r > 0 ? va(e, t + 4, t + 4 + r - 1) : "";
}, M0 = L0, U0 = function(t, r) {
  var n = Or(t, r);
  return n > 0 ? zn(t, r + 4, r + 4 + n) : "";
}, z0 = U0, W0 = function(e, t) {
  var r = Or(e, t);
  return r > 0 ? va(e, t + 4, t + 4 + r) : "";
}, H0 = W0, V0 = function(e, t) {
  return Tc(e, t);
}, $a = V0, G0 = function(t) {
  return Array.isArray(t) || typeof Uint8Array < "u" && t instanceof Uint8Array;
};
Pe && (N0 = function(t, r) {
  if (!Buffer.isBuffer(t)) return R0(t, r);
  var n = t.readUInt32LE(r);
  return n > 0 ? t.toString("utf8", r + 4, r + 4 + n - 1) : "";
}, B0 = function(t, r) {
  if (!Buffer.isBuffer(t)) return P0(t, r);
  var n = t.readUInt32LE(r);
  return n > 0 ? t.toString("utf8", r + 4, r + 4 + n - 1) : "";
}, M0 = function(t, r) {
  if (!Buffer.isBuffer(t) || !ca) return L0(t, r);
  var n = 2 * t.readUInt32LE(r);
  return t.toString("utf16le", r + 4, r + 4 + n - 1);
}, z0 = function(t, r) {
  if (!Buffer.isBuffer(t) || !ca) return U0(t, r);
  var n = t.readUInt32LE(r);
  return t.toString("utf16le", r + 4, r + 4 + n);
}, H0 = function(t, r) {
  if (!Buffer.isBuffer(t)) return W0(t, r);
  var n = t.readUInt32LE(r);
  return t.toString("utf8", r + 4, r + 4 + n);
}, $a = function(t, r) {
  return Buffer.isBuffer(t) ? t.readDoubleLE(r) : V0(t, r);
}, G0 = function(t) {
  return Buffer.isBuffer(t) || Array.isArray(t) || typeof Uint8Array < "u" && t instanceof Uint8Array;
});
var Pt = function(e, t) {
  return e[t];
}, rt = function(e, t) {
  return e[t + 1] * 256 + e[t];
}, Ac = function(e, t) {
  var r = e[t + 1] * 256 + e[t];
  return r < 32768 ? r : (65535 - r + 1) * -1;
}, Or = function(e, t) {
  return e[t + 3] * (1 << 24) + (e[t + 2] << 16) + (e[t + 1] << 8) + e[t];
}, _t = function(e, t) {
  return e[t + 3] << 24 | e[t + 2] << 16 | e[t + 1] << 8 | e[t];
}, Fc = function(e, t) {
  return e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3];
};
function Jt(e, t) {
  var r = "", n, a, i = [], f, s, c, o;
  switch (t) {
    case "dbcs":
      if (o = this.l, Pe && Buffer.isBuffer(this) && ca) r = this.slice(this.l, this.l + 2 * e).toString("utf16le");
      else for (c = 0; c < e; ++c)
        r += String.fromCharCode(rt(this, o)), o += 2;
      e *= 2;
      break;
    case "utf8":
      r = va(this, this.l, this.l + e);
      break;
    case "utf16le":
      e *= 2, r = zn(this, this.l, this.l + e);
      break;
    case "wstr":
      return Jt.call(this, e, "dbcs");
    /* [MS-OLEDS] 2.1.4 LengthPrefixedAnsiString */
    case "lpstr-ansi":
      r = N0(this, this.l), e = 4 + Or(this, this.l);
      break;
    case "lpstr-cp":
      r = B0(this, this.l), e = 4 + Or(this, this.l);
      break;
    /* [MS-OLEDS] 2.1.5 LengthPrefixedUnicodeString */
    case "lpwstr":
      r = M0(this, this.l), e = 4 + 2 * Or(this, this.l);
      break;
    /* [MS-OFFCRYPTO] 2.1.2 Length-Prefixed Padded Unicode String (UNICODE-LP-P4) */
    case "lpp4":
      e = 4 + Or(this, this.l), r = z0(this, this.l), e & 2 && (e += 2);
      break;
    /* [MS-OFFCRYPTO] 2.1.3 Length-Prefixed UTF-8 String (UTF-8-LP-P4) */
    case "8lpp4":
      e = 4 + Or(this, this.l), r = H0(this, this.l), e & 3 && (e += 4 - (e & 3));
      break;
    case "cstr":
      for (e = 0, r = ""; (f = Pt(this, this.l + e++)) !== 0; ) i.push(ba(f));
      r = i.join("");
      break;
    case "_wstr":
      for (e = 0, r = ""; (f = rt(this, this.l + e)) !== 0; )
        i.push(ba(f)), e += 2;
      e += 2, r = i.join("");
      break;
    /* sbcs and dbcs support continue records in the SST way TODO codepages */
    case "dbcs-cont":
      for (r = "", o = this.l, c = 0; c < e; ++c) {
        if (this.lens && this.lens.indexOf(o) !== -1)
          return f = Pt(this, o), this.l = o + 1, s = Jt.call(this, e - c, f ? "dbcs-cont" : "sbcs-cont"), i.join("") + s;
        i.push(ba(rt(this, o))), o += 2;
      }
      r = i.join(""), e *= 2;
      break;
    case "cpstr":
    /* falls through */
    case "sbcs-cont":
      for (r = "", o = this.l, c = 0; c != e; ++c) {
        if (this.lens && this.lens.indexOf(o) !== -1)
          return f = Pt(this, o), this.l = o + 1, s = Jt.call(this, e - c, f ? "dbcs-cont" : "sbcs-cont"), i.join("") + s;
        i.push(ba(Pt(this, o))), o += 1;
      }
      r = i.join("");
      break;
    default:
      switch (e) {
        case 1:
          return n = Pt(this, this.l), this.l++, n;
        case 2:
          return n = (t === "i" ? Ac : rt)(this, this.l), this.l += 2, n;
        case 4:
        case -4:
          return t === "i" || (this[this.l + 3] & 128) === 0 ? (n = (e > 0 ? _t : Fc)(this, this.l), this.l += 4, n) : (a = Or(this, this.l), this.l += 4, a);
        case 8:
        case -8:
          if (t === "f")
            return e == 8 ? a = $a(this, this.l) : a = $a([this[this.l + 7], this[this.l + 6], this[this.l + 5], this[this.l + 4], this[this.l + 3], this[this.l + 2], this[this.l + 1], this[this.l + 0]], 0), this.l += 8, a;
          e = 8;
        /* falls through */
        case 16:
          r = D0(this, this.l, e);
          break;
      }
  }
  return this.l += e, r;
}
var Sc = function(e, t, r) {
  e[r] = t & 255, e[r + 1] = t >>> 8 & 255, e[r + 2] = t >>> 16 & 255, e[r + 3] = t >>> 24 & 255;
}, Cc = function(e, t, r) {
  e[r] = t & 255, e[r + 1] = t >> 8 & 255, e[r + 2] = t >> 16 & 255, e[r + 3] = t >> 24 & 255;
}, bc = function(e, t, r) {
  e[r] = t & 255, e[r + 1] = t >>> 8 & 255;
};
function Ic(e, t, r) {
  var n = 0, a = 0;
  if (r === "dbcs") {
    for (a = 0; a != t.length; ++a) bc(this, t.charCodeAt(a), this.l + 2 * a);
    n = 2 * t.length;
  } else if (r === "sbcs" || r == "cpstr") {
    for (t = t.replace(/[^\x00-\x7F]/g, "_"), a = 0; a != t.length; ++a) this[this.l + a] = t.charCodeAt(a) & 255;
    n = t.length;
  } else if (r === "hex") {
    for (; a < e; ++a)
      this[this.l++] = parseInt(t.slice(2 * a, 2 * a + 2), 16) || 0;
    return this;
  } else if (r === "utf16le") {
    var i = Math.min(this.l + e, this.length);
    for (a = 0; a < Math.min(t.length, e); ++a) {
      var f = t.charCodeAt(a);
      this[this.l++] = f & 255, this[this.l++] = f >> 8;
    }
    for (; this.l < i; ) this[this.l++] = 0;
    return this;
  } else switch (e) {
    case 1:
      n = 1, this[this.l] = t & 255;
      break;
    case 2:
      n = 2, this[this.l] = t & 255, t >>>= 8, this[this.l + 1] = t & 255;
      break;
    case 3:
      n = 3, this[this.l] = t & 255, t >>>= 8, this[this.l + 1] = t & 255, t >>>= 8, this[this.l + 2] = t & 255;
      break;
    case 4:
      n = 4, Sc(this, t, this.l);
      break;
    case 8:
      if (n = 8, r === "f") {
        yc(this, t, this.l);
        break;
      }
    /* falls through */
    case 16:
      break;
    case -4:
      n = 4, Cc(this, t, this.l);
      break;
  }
  return this.l += n, this;
}
function X0(e, t) {
  var r = D0(this, this.l, e.length >> 1);
  if (r !== e) throw new Error(t + "Expected " + e + " saw " + r);
  this.l += e.length >> 1;
}
function ir(e, t) {
  e.l = t, e.read_shift = /*::(*/
  Jt, e.chk = X0, e.write_shift = Ic;
}
function kr(e, t) {
  e.l += t;
}
function ar(e) {
  var t = lt(e);
  return ir(t, 0), t;
}
function it(e, t, r) {
  if (e) {
    var n, a, i;
    ir(e, e.l || 0);
    for (var f = e.length, s = 0, c = 0; e.l < f; ) {
      s = e.read_shift(1), s & 128 && (s = (s & 127) + ((e.read_shift(1) & 127) << 7));
      var o = Ja[s] || Ja[65535];
      for (n = e.read_shift(1), i = n & 127, a = 1; a < 4 && n & 128; ++a) i += ((n = e.read_shift(1)) & 127) << 7 * a;
      c = e.l + i;
      var u = o.f && o.f(e, i, r);
      if (e.l = c, t(u, o, s)) return;
    }
  }
}
function Tn() {
  var e = [], t = Pe ? 16384 : 2048;
  Pe && ar(t).copy;
  var r = function(u) {
    var m = ar(u);
    return ir(m, 0), m;
  }, n = r(t), a = function() {
    n && (n.l && (n.length > n.l && (n = n.slice(0, n.l), n.l = n.length), n.length > 0 && e.push(n)), n = null);
  }, i = function(u) {
    return n && u < n.length - n.l ? n : (a(), n = r(Math.max(u + 1, t)));
  }, f = function() {
    return a(), ft(e);
  }, s = function() {
    return a(), e;
  }, c = function(u) {
    a(), n = u, n.l == null && (n.l = n.length), i(t);
  };
  return { next: i, push: c, end: f, _bufs: e, end2: s };
}
function qt(e, t, r) {
  var n = nr(e);
  if (t.s ? (n.cRel && (n.c += t.s.c), n.rRel && (n.r += t.s.r)) : (n.cRel && (n.c += t.c), n.rRel && (n.r += t.r)), !r || r.biff < 12) {
    for (; n.c >= 256; ) n.c -= 256;
    for (; n.r >= 65536; ) n.r -= 65536;
  }
  return n;
}
function yi(e, t, r) {
  var n = nr(e);
  return n.s = qt(n.s, t.s, r), n.e = qt(n.e, t.s, r), n;
}
function ea(e, t) {
  if (e.cRel && e.c < 0)
    for (e = nr(e); e.c < 0; ) e.c += t > 8 ? 16384 : 256;
  if (e.rRel && e.r < 0)
    for (e = nr(e); e.r < 0; ) e.r += t > 8 ? 1048576 : t > 5 ? 65536 : 16384;
  var r = We(e);
  return !e.cRel && e.cRel != null && (r = Rc(r)), !e.rRel && e.rRel != null && (r = Oc(r)), r;
}
function dn(e, t) {
  return e.s.r == 0 && !e.s.rRel && e.e.r == (t.biff >= 12 ? 1048575 : t.biff >= 8 ? 65536 : 16384) && !e.e.rRel ? (e.s.cRel ? "" : "$") + He(e.s.c) + ":" + (e.e.cRel ? "" : "$") + He(e.e.c) : e.s.c == 0 && !e.s.cRel && e.e.c == (t.biff >= 12 ? 16383 : 255) && !e.e.cRel ? (e.s.rRel ? "" : "$") + Ge(e.s.r) + ":" + (e.e.rRel ? "" : "$") + Ge(e.e.r) : ea(e.s, t.biff) + ":" + ea(e.e, t.biff);
}
function Wn(e) {
  return parseInt(Dc(e), 10) - 1;
}
function Ge(e) {
  return "" + (e + 1);
}
function Oc(e) {
  return e.replace(/([A-Z]|^)(\d+)$/, "$1$$$2");
}
function Dc(e) {
  return e.replace(/\$(\d+)$/, "$1");
}
function Hn(e) {
  for (var t = Nc(e), r = 0, n = 0; n !== t.length; ++n) r = 26 * r + t.charCodeAt(n) - 64;
  return r - 1;
}
function He(e) {
  if (e < 0) throw new Error("invalid column " + e);
  var t = "";
  for (++e; e; e = Math.floor((e - 1) / 26)) t = String.fromCharCode((e - 1) % 26 + 65) + t;
  return t;
}
function Rc(e) {
  return e.replace(/^([A-Z])/, "$$$1");
}
function Nc(e) {
  return e.replace(/^\$([A-Z])/, "$1");
}
function Pc(e) {
  return e.replace(/(\$?[A-Z]*)(\$?\d*)/, "$1,$2").split(",");
}
function _r(e) {
  for (var t = 0, r = 0, n = 0; n < e.length; ++n) {
    var a = e.charCodeAt(n);
    a >= 48 && a <= 57 ? t = 10 * t + (a - 48) : a >= 65 && a <= 90 && (r = 26 * r + (a - 64));
  }
  return { c: r - 1, r: t - 1 };
}
function We(e) {
  for (var t = e.c + 1, r = ""; t; t = (t - 1) / 26 | 0) r = String.fromCharCode((t - 1) % 26 + 65) + r;
  return r + (e.r + 1);
}
function It(e) {
  var t = e.indexOf(":");
  return t == -1 ? { s: _r(e), e: _r(e) } : { s: _r(e.slice(0, t)), e: _r(e.slice(t + 1)) };
}
function Le(e, t) {
  return typeof t > "u" || typeof t == "number" ? Le(e.s, e.e) : (typeof e != "string" && (e = We(e)), typeof t != "string" && (t = We(t)), e == t ? e : e + ":" + t);
}
function Bc(e, t) {
  if (!e && !(t && t.biff <= 5 && t.biff >= 2)) throw new Error("empty sheet name");
  return /[^\w\u4E00-\u9FFF\u3040-\u30FF]/.test(e) ? "'" + e.replace(/'/g, "''") + "'" : e;
}
function Je(e) {
  var t = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } }, r = 0, n = 0, a = 0, i = e.length;
  for (r = 0; n < i && !((a = e.charCodeAt(n) - 64) < 1 || a > 26); ++n)
    r = 26 * r + a;
  for (t.s.c = --r, r = 0; n < i && !((a = e.charCodeAt(n) - 48) < 0 || a > 9); ++n)
    r = 10 * r + a;
  if (t.s.r = --r, n === i || a != 10)
    return t.e.c = t.s.c, t.e.r = t.s.r, t;
  for (++n, r = 0; n != i && !((a = e.charCodeAt(n) - 64) < 1 || a > 26); ++n)
    r = 26 * r + a;
  for (t.e.c = --r, r = 0; n != i && !((a = e.charCodeAt(n) - 48) < 0 || a > 9); ++n)
    r = 10 * r + a;
  return t.e.r = --r, t;
}
function Ai(e, t) {
  var r = e.t == "d" && t instanceof Date;
  if (e.z != null) try {
    return e.w = Nr(e.z, r ? sr(t) : t);
  } catch {
  }
  try {
    return e.w = Nr((e.XF || {}).numFmtId || (r ? 14 : 0), r ? sr(t) : t);
  } catch {
    return "" + t;
  }
}
function ut(e, t, r) {
  return e == null || e.t == null || e.t == "z" ? "" : e.w !== void 0 ? e.w : (e.t == "d" && !e.z && r && r.dateNF && (e.z = r.dateNF), e.t == "e" ? Sr[e.v] || e.v : t == null ? Ai(e, e.v) : Ai(e, t));
}
function xt(e, t) {
  var r = t && t.sheet ? t.sheet : "Sheet1", n = {};
  return n[r] = e, { SheetNames: [r], Sheets: n };
}
function Lc(e) {
  var t = {}, r = e || {};
  return r.dense && (t["!data"] = []), t;
}
function $0(e, t, r) {
  var n = r || {}, a = e ? e["!data"] != null : n.dense, i = e || (a ? { "!data": [] } : {});
  a && !i["!data"] && (i["!data"] = []);
  var f = 0, s = 0;
  if (i && n.origin != null)
    if (typeof n.origin == "number") f = n.origin;
    else {
      var c = typeof n.origin == "string" ? _r(n.origin) : n.origin;
      f = c.r, s = c.c;
    }
  var o = { s: { c: 1e7, r: 1e7 }, e: { c: 0, r: 0 } };
  if (i["!ref"]) {
    var u = Je(i["!ref"]);
    o.s.c = u.s.c, o.s.r = u.s.r, o.e.c = Math.max(o.e.c, u.e.c), o.e.r = Math.max(o.e.r, u.e.r), f == -1 && (o.e.r = f = i["!ref"] ? u.e.r + 1 : 0);
  } else
    o.s.c = o.e.c = o.s.r = o.e.r = 0;
  for (var m = [], x = !1, l = 0; l != t.length; ++l)
    if (t[l]) {
      if (!Array.isArray(t[l])) throw new Error("aoa_to_sheet expects an array of arrays");
      var v = f + l;
      a && (i["!data"][v] || (i["!data"][v] = []), m = i["!data"][v]);
      for (var p = t[l], d = 0; d != p.length; ++d)
        if (!(typeof p[d] > "u")) {
          var h = { v: p[d], t: "" }, _ = s + d;
          if (o.s.r > v && (o.s.r = v), o.s.c > _ && (o.s.c = _), o.e.r < v && (o.e.r = v), o.e.c < _ && (o.e.c = _), x = !0, p[d] && typeof p[d] == "object" && !Array.isArray(p[d]) && !(p[d] instanceof Date)) h = p[d];
          else if (Array.isArray(h.v) && (h.f = p[d][1], h.v = h.v[0]), h.v === null)
            if (h.f) h.t = "n";
            else if (n.nullError)
              h.t = "e", h.v = 0;
            else if (n.sheetStubs) h.t = "z";
            else continue;
          else typeof h.v == "number" ? isFinite(h.v) ? h.t = "n" : isNaN(h.v) ? (h.t = "e", h.v = 15) : (h.t = "e", h.v = 7) : typeof h.v == "boolean" ? h.t = "b" : h.v instanceof Date ? (h.z = n.dateNF || be[14], n.UTC || (h.v = en(h.v)), n.cellDates ? (h.t = "d", h.w = Nr(h.z, sr(h.v, n.date1904))) : (h.t = "n", h.v = sr(h.v, n.date1904), h.w = Nr(h.z, h.v))) : h.t = "s";
          if (a)
            m[_] && m[_].z && (h.z = m[_].z), m[_] = h;
          else {
            var g = He(_) + (v + 1);
            i[g] && i[g].z && (h.z = i[g].z), i[g] = h;
          }
        }
    }
  return x && o.s.c < 104e5 && (i["!ref"] = Le(o)), i;
}
function Vt(e, t) {
  return $0(null, e, t);
}
function Mc(e) {
  return e.read_shift(4, "i");
}
function wr(e) {
  var t = e.read_shift(4);
  return t === 0 ? "" : e.read_shift(t, "dbcs");
}
function Uc(e) {
  return { ich: e.read_shift(2), ifnt: e.read_shift(2) };
}
function Vn(e, t) {
  var r = e.l, n = e.read_shift(1), a = wr(e), i = [], f = { t: a, h: a };
  if ((n & 1) !== 0) {
    for (var s = e.read_shift(4), c = 0; c != s; ++c) i.push(Uc(e));
    f.r = i;
  } else f.r = [{ ich: 0, ifnt: 0 }];
  return e.l = r + t, f;
}
var zc = Vn;
function Hr(e) {
  var t = e.read_shift(4), r = e.read_shift(2);
  return r += e.read_shift(1) << 16, e.l++, { c: t, iStyleRef: r };
}
function Ot(e) {
  var t = e.read_shift(2);
  return t += e.read_shift(1) << 16, e.l++, { c: -1, iStyleRef: t };
}
var Wc = wr;
function tn(e) {
  var t = e.read_shift(4);
  return t === 0 || t === 4294967295 ? "" : e.read_shift(t, "dbcs");
}
var Hc = wr, yn = tn;
function an(e) {
  var t = e.slice(e.l, e.l + 4), r = t[0] & 1, n = t[0] & 2;
  e.l += 4;
  var a = n === 0 ? $a([0, 0, 0, 0, t[0] & 252, t[1], t[2], t[3]], 0) : _t(t, 0) >> 2;
  return r ? a / 100 : a;
}
function j0(e) {
  var t = { s: {}, e: {} };
  return t.s.r = e.read_shift(4), t.e.r = e.read_shift(4), t.s.c = e.read_shift(4), t.e.c = e.read_shift(4), t;
}
var Dt = j0;
function gr(e) {
  if (e.length - e.l < 8) throw "XLS Xnum Buffer underflow";
  return e.read_shift(8, "f");
}
function Vc(e) {
  var t = {}, r = e.read_shift(1), n = r >>> 1, a = e.read_shift(1), i = e.read_shift(2, "i"), f = e.read_shift(1), s = e.read_shift(1), c = e.read_shift(1);
  switch (e.l++, n) {
    case 0:
      t.auto = 1;
      break;
    case 1:
      t.index = a;
      var o = Et[a];
      o && (t.rgb = ha(o));
      break;
    case 2:
      t.rgb = ha([f, s, c]);
      break;
    case 3:
      t.theme = a;
      break;
  }
  return i != 0 && (t.tint = i > 0 ? i / 32767 : i / 32768), t;
}
function Gc(e) {
  var t = e.read_shift(1);
  e.l++;
  var r = {
    fBold: t & 1,
    fItalic: t & 2,
    fUnderline: t & 4,
    fStrikeout: t & 8,
    fOutline: t & 16,
    fShadow: t & 32,
    fCondense: t & 64,
    fExtend: t & 128
  };
  return r;
}
function K0(e, t) {
  var r = { 2: "BITMAP", 3: "METAFILEPICT", 8: "DIB", 14: "ENHMETAFILE" }, n = e.read_shift(4);
  switch (n) {
    case 0:
      return "";
    case 4294967295:
    case 4294967294:
      return r[e.read_shift(4)] || "";
  }
  if (n > 400) throw new Error("Unsupported Clipboard: " + n.toString(16));
  return e.l -= 4, e.read_shift(0, t == 1 ? "lpstr" : "lpwstr");
}
function Xc(e) {
  return K0(e, 1);
}
function $c(e) {
  return K0(e, 2);
}
var Gn = 2, Ar = 3, Oa = 11, Fi = 12, ja = 19, Da = 64, jc = 65, Kc = 71, Yc = 4108, Zc = 4126, fr = 80, Y0 = 81, Qc = [fr, Y0], Jc = {
  1: { n: "CodePage", t: Gn },
  2: { n: "Category", t: fr },
  3: { n: "PresentationFormat", t: fr },
  4: { n: "ByteCount", t: Ar },
  5: { n: "LineCount", t: Ar },
  6: { n: "ParagraphCount", t: Ar },
  7: { n: "SlideCount", t: Ar },
  8: { n: "NoteCount", t: Ar },
  9: { n: "HiddenCount", t: Ar },
  10: { n: "MultimediaClipCount", t: Ar },
  11: { n: "ScaleCrop", t: Oa },
  12: {
    n: "HeadingPairs",
    t: Yc
    /* VT_VECTOR | VT_VARIANT */
  },
  13: {
    n: "TitlesOfParts",
    t: Zc
    /* VT_VECTOR | VT_LPSTR */
  },
  14: { n: "Manager", t: fr },
  15: { n: "Company", t: fr },
  16: { n: "LinksUpToDate", t: Oa },
  17: { n: "CharacterCount", t: Ar },
  19: { n: "SharedDoc", t: Oa },
  22: { n: "HyperlinksChanged", t: Oa },
  23: { n: "AppVersion", t: Ar, p: "version" },
  24: { n: "DigSig", t: jc },
  26: { n: "ContentType", t: fr },
  27: { n: "ContentStatus", t: fr },
  28: { n: "Language", t: fr },
  29: { n: "Version", t: fr },
  255: {},
  /* [MS-OLEPS] 2.18 */
  2147483648: { n: "Locale", t: ja },
  2147483651: { n: "Behavior", t: ja },
  1919054434: {}
}, qc = {
  1: { n: "CodePage", t: Gn },
  2: { n: "Title", t: fr },
  3: { n: "Subject", t: fr },
  4: { n: "Author", t: fr },
  5: { n: "Keywords", t: fr },
  6: { n: "Comments", t: fr },
  7: { n: "Template", t: fr },
  8: { n: "LastAuthor", t: fr },
  9: { n: "RevNumber", t: fr },
  10: { n: "EditTime", t: Da },
  11: { n: "LastPrinted", t: Da },
  12: { n: "CreatedDate", t: Da },
  13: { n: "ModifiedDate", t: Da },
  14: { n: "PageCount", t: Ar },
  15: { n: "WordCount", t: Ar },
  16: { n: "CharCount", t: Ar },
  17: { n: "Thumbnail", t: Kc },
  18: { n: "Application", t: fr },
  19: { n: "DocSecurity", t: Ar },
  255: {},
  /* [MS-OLEPS] 2.18 */
  2147483648: { n: "Locale", t: ja },
  2147483651: { n: "Behavior", t: ja },
  1919054434: {}
}, Si = {
  1: "US",
  // United States
  2: "CA",
  // Canada
  3: "",
  // Latin America (except Brazil)
  7: "RU",
  // Russia
  20: "EG",
  // Egypt
  30: "GR",
  // Greece
  31: "NL",
  // Netherlands
  32: "BE",
  // Belgium
  33: "FR",
  // France
  34: "ES",
  // Spain
  36: "HU",
  // Hungary
  39: "IT",
  // Italy
  41: "CH",
  // Switzerland
  43: "AT",
  // Austria
  44: "GB",
  // United Kingdom
  45: "DK",
  // Denmark
  46: "SE",
  // Sweden
  47: "NO",
  // Norway
  48: "PL",
  // Poland
  49: "DE",
  // Germany
  52: "MX",
  // Mexico
  55: "BR",
  // Brazil
  61: "AU",
  // Australia
  64: "NZ",
  // New Zealand
  66: "TH",
  // Thailand
  81: "JP",
  // Japan
  82: "KR",
  // Korea
  84: "VN",
  // Viet Nam
  86: "CN",
  // China
  90: "TR",
  // Turkey
  105: "JS",
  // Ramastan
  213: "DZ",
  // Algeria
  216: "MA",
  // Morocco
  218: "LY",
  // Libya
  351: "PT",
  // Portugal
  354: "IS",
  // Iceland
  358: "FI",
  // Finland
  420: "CZ",
  // Czech Republic
  886: "TW",
  // Taiwan
  961: "LB",
  // Lebanon
  962: "JO",
  // Jordan
  963: "SY",
  // Syria
  964: "IQ",
  // Iraq
  965: "KW",
  // Kuwait
  966: "SA",
  // Saudi Arabia
  971: "AE",
  // United Arab Emirates
  972: "IL",
  // Israel
  974: "QA",
  // Qatar
  981: "IR",
  // Iran
  65535: "US"
  // United States
}, eo = [
  null,
  "solid",
  "mediumGray",
  "darkGray",
  "lightGray",
  "darkHorizontal",
  "darkVertical",
  "darkDown",
  "darkUp",
  "darkGrid",
  "darkTrellis",
  "lightHorizontal",
  "lightVertical",
  "lightDown",
  "lightUp",
  "lightGrid",
  "lightTrellis",
  "gray125",
  "gray0625"
];
function ro(e) {
  return e.map(function(t) {
    return [t >> 16 & 255, t >> 8 & 255, t & 255];
  });
}
var to = /* @__PURE__ */ ro([
  /* Color Constants */
  0,
  16777215,
  16711680,
  65280,
  255,
  16776960,
  16711935,
  65535,
  /* Overridable Defaults */
  0,
  16777215,
  16711680,
  65280,
  255,
  16776960,
  16711935,
  65535,
  8388608,
  32768,
  128,
  8421376,
  8388736,
  32896,
  12632256,
  8421504,
  10066431,
  10040166,
  16777164,
  13434879,
  6684774,
  16744576,
  26316,
  13421823,
  128,
  16711935,
  16776960,
  65535,
  8388736,
  8388608,
  32896,
  255,
  52479,
  13434879,
  13434828,
  16777113,
  10079487,
  16751052,
  13408767,
  16764057,
  3368703,
  3394764,
  10079232,
  16763904,
  16750848,
  16737792,
  6710937,
  9868950,
  13158,
  3381606,
  13056,
  3355392,
  10040064,
  10040166,
  3355545,
  3355443,
  /* Other entries to appease BIFF8/12 */
  0,
  /* 0x40 icvForeground ?? */
  16777215,
  /* 0x41 icvBackground ?? */
  0,
  /* 0x42 icvFrame ?? */
  0,
  /* 0x43 icv3D ?? */
  0,
  /* 0x44 icv3DText ?? */
  0,
  /* 0x45 icv3DHilite ?? */
  0,
  /* 0x46 icv3DShadow ?? */
  0,
  /* 0x47 icvHilite ?? */
  0,
  /* 0x48 icvCtlText ?? */
  0,
  /* 0x49 icvCtlScrl ?? */
  0,
  /* 0x4A icvCtlInv ?? */
  0,
  /* 0x4B icvCtlBody ?? */
  0,
  /* 0x4C icvCtlFrame ?? */
  0,
  /* 0x4D icvCtlFore ?? */
  0,
  /* 0x4E icvCtlBack ?? */
  0,
  /* 0x4F icvCtlNeutral */
  0,
  /* 0x50 icvInfoBk ?? */
  0
  /* 0x51 icvInfoText ?? */
]), Et = /* @__PURE__ */ nr(to), Sr = {
  0: "#NULL!",
  7: "#DIV/0!",
  15: "#VALUE!",
  23: "#REF!",
  29: "#NAME?",
  36: "#NUM!",
  42: "#N/A",
  43: "#GETTING_DATA",
  255: "#WTF?"
}, ur = {
  "#NULL!": 0,
  "#DIV/0!": 7,
  "#VALUE!": 15,
  "#REF!": 23,
  "#NAME?": 29,
  "#NUM!": 36,
  "#N/A": 42,
  "#GETTING_DATA": 43,
  "#WTF?": 255
}, Z0 = [
  "_xlnm.Consolidate_Area",
  "_xlnm.Auto_Open",
  "_xlnm.Auto_Close",
  "_xlnm.Extract",
  "_xlnm.Database",
  "_xlnm.Criteria",
  "_xlnm.Print_Area",
  "_xlnm.Print_Titles",
  "_xlnm.Recorder",
  "_xlnm.Data_Form",
  "_xlnm.Auto_Activate",
  "_xlnm.Auto_Deactivate",
  "_xlnm.Sheet_Title",
  "_xlnm._FilterDatabase"
], Ci = {
  /* Workbook */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": "workbooks",
  "application/vnd.ms-excel.sheet.macroEnabled.main+xml": "workbooks",
  "application/vnd.ms-excel.sheet.binary.macroEnabled.main": "workbooks",
  "application/vnd.ms-excel.addin.macroEnabled.main+xml": "workbooks",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": "workbooks",
  /* Worksheet */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": "sheets",
  "application/vnd.ms-excel.worksheet": "sheets",
  "application/vnd.ms-excel.binIndexWs": "TODO",
  /* Binary Index */
  /* Chartsheet */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": "charts",
  "application/vnd.ms-excel.chartsheet": "charts",
  /* Macrosheet */
  "application/vnd.ms-excel.macrosheet+xml": "macros",
  "application/vnd.ms-excel.macrosheet": "macros",
  "application/vnd.ms-excel.intlmacrosheet": "TODO",
  "application/vnd.ms-excel.binIndexMs": "TODO",
  /* Binary Index */
  /* Dialogsheet */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": "dialogs",
  "application/vnd.ms-excel.dialogsheet": "dialogs",
  /* Shared Strings */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml": "strs",
  "application/vnd.ms-excel.sharedStrings": "strs",
  /* Styles */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": "styles",
  "application/vnd.ms-excel.styles": "styles",
  /* File Properties */
  "application/vnd.openxmlformats-package.core-properties+xml": "coreprops",
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": "custprops",
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": "extprops",
  /* Custom Data Properties */
  "application/vnd.openxmlformats-officedocument.customXmlProperties+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.customProperty": "TODO",
  /* Comments */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": "comments",
  "application/vnd.ms-excel.comments": "comments",
  "application/vnd.ms-excel.threadedcomments+xml": "threadedcomments",
  "application/vnd.ms-excel.person+xml": "people",
  /* Metadata (Stock/Geography and Dynamic Array) */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml": "metadata",
  "application/vnd.ms-excel.sheetMetadata": "metadata",
  /* PivotTable */
  "application/vnd.ms-excel.pivotTable": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml": "TODO",
  /* Chart Objects */
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": "TODO",
  /* Chart Colors */
  "application/vnd.ms-office.chartcolorstyle+xml": "TODO",
  /* Chart Style */
  "application/vnd.ms-office.chartstyle+xml": "TODO",
  /* Chart Advanced */
  "application/vnd.ms-office.chartex+xml": "TODO",
  /* Calculation Chain */
  "application/vnd.ms-excel.calcChain": "calcchains",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml": "calcchains",
  /* Printer Settings */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.printerSettings": "TODO",
  /* ActiveX */
  "application/vnd.ms-office.activeX": "TODO",
  "application/vnd.ms-office.activeX+xml": "TODO",
  /* Custom Toolbars */
  "application/vnd.ms-excel.attachedToolbars": "TODO",
  /* External Data Connections */
  "application/vnd.ms-excel.connections": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": "TODO",
  /* External Links */
  "application/vnd.ms-excel.externalLink": "links",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externalLink+xml": "links",
  /* PivotCache */
  "application/vnd.ms-excel.pivotCacheDefinition": "TODO",
  "application/vnd.ms-excel.pivotCacheRecords": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml": "TODO",
  /* Query Table */
  "application/vnd.ms-excel.queryTable": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.queryTable+xml": "TODO",
  /* Shared Workbook */
  "application/vnd.ms-excel.userNames": "TODO",
  "application/vnd.ms-excel.revisionHeaders": "TODO",
  "application/vnd.ms-excel.revisionLog": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionHeaders+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionLog+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.userNames+xml": "TODO",
  /* Single Cell Table */
  "application/vnd.ms-excel.tableSingleCells": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tableSingleCells+xml": "TODO",
  /* Slicer */
  "application/vnd.ms-excel.slicer": "TODO",
  "application/vnd.ms-excel.slicerCache": "TODO",
  "application/vnd.ms-excel.slicer+xml": "TODO",
  "application/vnd.ms-excel.slicerCache+xml": "TODO",
  /* Sort Map */
  "application/vnd.ms-excel.wsSortMap": "TODO",
  /* Table */
  "application/vnd.ms-excel.table": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": "TODO",
  /* Themes */
  "application/vnd.openxmlformats-officedocument.theme+xml": "themes",
  /* Theme Override */
  "application/vnd.openxmlformats-officedocument.themeOverride+xml": "TODO",
  /* Timeline */
  "application/vnd.ms-excel.Timeline+xml": "TODO",
  /* verify */
  "application/vnd.ms-excel.TimelineCache+xml": "TODO",
  /* verify */
  /* VBA */
  "application/vnd.ms-office.vbaProject": "vba",
  "application/vnd.ms-office.vbaProjectSignature": "TODO",
  /* Volatile Dependencies */
  "application/vnd.ms-office.volatileDependencies": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatileDependencies+xml": "TODO",
  /* Control Properties */
  "application/vnd.ms-excel.controlproperties+xml": "TODO",
  /* Data Model */
  "application/vnd.openxmlformats-officedocument.model+data": "TODO",
  /* Survey */
  "application/vnd.ms-excel.Survey+xml": "TODO",
  /* Drawing */
  "application/vnd.openxmlformats-officedocument.drawing+xml": "drawings",
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml": "TODO",
  /* VML */
  "application/vnd.openxmlformats-officedocument.vmlDrawing": "TODO",
  "application/vnd.openxmlformats-package.relationships+xml": "rels",
  "application/vnd.openxmlformats-officedocument.oleObject": "TODO",
  /* Image */
  "image/png": "TODO",
  sheet: "js"
};
function ao() {
  return {
    workbooks: [],
    sheets: [],
    charts: [],
    dialogs: [],
    macros: [],
    rels: [],
    strs: [],
    comments: [],
    threadedcomments: [],
    links: [],
    coreprops: [],
    extprops: [],
    custprops: [],
    themes: [],
    styles: [],
    calcchains: [],
    vba: [],
    drawings: [],
    metadata: [],
    people: [],
    TODO: [],
    xmlns: ""
  };
}
function no(e) {
  var t = ao();
  if (!e || !e.match) return t;
  var r = {};
  if ((e.match(xr) || []).forEach(function(n) {
    var a = Ae(n);
    switch (a[0].replace(lc, "<")) {
      case "<?xml":
        break;
      case "<Types":
        t.xmlns = a["xmlns" + (a[0].match(/<(\w+):/) || ["", ""])[1]];
        break;
      case "<Default":
        r[a.Extension.toLowerCase()] = a.ContentType;
        break;
      case "<Override":
        t[Ci[a.ContentType]] !== void 0 && t[Ci[a.ContentType]].push(a.PartName);
        break;
    }
  }), t.xmlns !== kc.CT) throw new Error("Unknown Namespace: " + t.xmlns);
  return t.calcchain = t.calcchains.length > 0 ? t.calcchains[0] : "", t.sst = t.strs.length > 0 ? t.strs[0] : "", t.style = t.styles.length > 0 ? t.styles[0] : "", t.defaults = r, delete t.calcchains, t;
}
var Lt = {
  WB: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
  SHEET: "http://sheetjs.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
  HLINK: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
  VML: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing",
  XPATH: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLinkPath",
  XMISS: "http://schemas.microsoft.com/office/2006/relationships/xlExternalLinkPath/xlPathMissing",
  XLINK: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLink",
  CXML: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml",
  CXMLP: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps",
  CMNT: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments",
  CORE_PROPS: "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties",
  EXT_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties",
  CUST_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties",
  SST: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings",
  STY: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
  THEME: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme",
  CHART: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart",
  CHARTEX: "http://schemas.microsoft.com/office/2014/relationships/chartEx",
  CS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartsheet",
  WS: [
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet",
    "http://purl.oclc.org/ooxml/officeDocument/relationships/worksheet"
  ],
  DS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/dialogsheet",
  MS: "http://schemas.microsoft.com/office/2006/relationships/xlMacrosheet",
  IMG: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
  DRAW: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing",
  XLMETA: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sheetMetadata",
  TCMNT: "http://schemas.microsoft.com/office/2017/10/relationships/threadedComment",
  PEOPLE: "http://schemas.microsoft.com/office/2017/10/relationships/person",
  CONN: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/connections",
  VBA: "http://schemas.microsoft.com/office/2006/relationships/vbaProject"
};
function An(e) {
  var t = e.lastIndexOf("/");
  return e.slice(0, t + 1) + "_rels/" + e.slice(t + 1) + ".rels";
}
function ra(e, t) {
  var r = { "!id": {} };
  if (!e) return r;
  t.charAt(0) !== "/" && (t = "/" + t);
  var n = {};
  return (e.match(xr) || []).forEach(function(a) {
    var i = Ae(a);
    if (i[0] === "<Relationship") {
      var f = {};
      f.Type = i.Type, f.Target = Be(i.Target), f.Id = i.Id, i.TargetMode && (f.TargetMode = i.TargetMode);
      var s = i.TargetMode === "External" ? i.Target : Bt(i.Target, t);
      r[s] = f, n[i.Id] = f;
    }
  }), r["!id"] = n, r;
}
var io = "application/vnd.oasis.opendocument.spreadsheet";
function so(e, t) {
  for (var r = rn(e), n, a; n = tr.exec(r); )
    switch (n[3]) {
      case "manifest":
        break;
      case "file-entry":
        if (a = Ae(n[0], !1), a.path == "/" && a.type !== io)
          throw new Error("This OpenDocument is not a spreadsheet");
        break;
      case "encryption-data":
      case "algorithm":
      case "start-key-generation":
      case "key-derivation":
        throw new Error("Unsupported ODS Encryption");
      default:
        if (t && t.WTF)
          throw n;
    }
}
var bi = [
  ["cp:category", "Category"],
  ["cp:contentStatus", "ContentStatus"],
  ["cp:keywords", "Keywords"],
  ["cp:lastModifiedBy", "LastAuthor"],
  ["cp:lastPrinted", "LastPrinted"],
  ["cp:revision", "RevNumber"],
  ["cp:version", "Version"],
  ["dc:creator", "Author"],
  ["dc:description", "Comments"],
  ["dc:identifier", "Identifier"],
  ["dc:language", "Language"],
  ["dc:subject", "Subject"],
  ["dc:title", "Title"],
  ["dcterms:created", "CreatedDate", "date"],
  ["dcterms:modified", "ModifiedDate", "date"]
];
function Q0(e) {
  var t = {};
  e = Xe(e);
  for (var r = 0; r < bi.length; ++r) {
    var n = bi[r], a = kt(e, n[0]);
    a != null && a.length > 0 && (t[n[1]] = Be(a[1])), n[2] === "date" && t[n[1]] && (t[n[1]] = dr(t[n[1]]));
  }
  return t;
}
var fo = [
  ["Application", "Application", "string"],
  ["AppVersion", "AppVersion", "string"],
  ["Company", "Company", "string"],
  ["DocSecurity", "DocSecurity", "string"],
  ["Manager", "Manager", "string"],
  ["HyperlinksChanged", "HyperlinksChanged", "bool"],
  ["SharedDoc", "SharedDoc", "bool"],
  ["LinksUpToDate", "LinksUpToDate", "bool"],
  ["ScaleCrop", "ScaleCrop", "bool"],
  ["HeadingPairs", "HeadingPairs", "raw"],
  ["TitlesOfParts", "TitlesOfParts", "raw"]
];
function J0(e, t, r, n) {
  var a = [];
  if (typeof e == "string") a = gi(e, n);
  else for (var i = 0; i < e.length; ++i) a = a.concat(e[i].map(function(u) {
    return { v: u };
  }));
  var f = typeof t == "string" ? gi(t, n).map(function(u) {
    return u.v;
  }) : t, s = 0, c = 0;
  if (f.length > 0) for (var o = 0; o !== a.length; o += 2) {
    switch (c = +a[o + 1].v, a[o].v) {
      case "Worksheets":
      case "工作表":
      case "Листы":
      case "أوراق العمل":
      case "ワークシート":
      case "גליונות עבודה":
      case "Arbeitsblätter":
      case "Çalışma Sayfaları":
      case "Feuilles de calcul":
      case "Fogli di lavoro":
      case "Folhas de cálculo":
      case "Planilhas":
      case "Regneark":
      case "Hojas de cálculo":
      case "Werkbladen":
        r.Worksheets = c, r.SheetNames = f.slice(s, s + c);
        break;
      case "Named Ranges":
      case "Rangos con nombre":
      case "名前付き一覧":
      case "Benannte Bereiche":
      case "Navngivne områder":
        r.NamedRanges = c, r.DefinedNames = f.slice(s, s + c);
        break;
      case "Charts":
      case "Diagramme":
        r.Chartsheets = c, r.ChartNames = f.slice(s, s + c);
        break;
    }
    s += c;
  }
}
function co(e, t, r) {
  var n = {};
  return t || (t = {}), e = Xe(e), fo.forEach(function(a) {
    var i = (or(e, a[0]) || [])[1];
    switch (a[2]) {
      case "string":
        i && (t[a[1]] = Be(i));
        break;
      case "bool":
        t[a[1]] = i === "true";
        break;
      case "raw":
        var f = kt(e, a[0]);
        f && f.length > 0 && (n[a[1]] = f[1]);
        break;
    }
  }), n.HeadingPairs && n.TitlesOfParts && J0(n.HeadingPairs, n.TitlesOfParts, t, r), t;
}
var oo = /<[^<>]+>[^<]*/g;
function lo(e, t) {
  var r = {}, n = "", a = e.match(oo);
  if (a) for (var i = 0; i != a.length; ++i) {
    var f = a[i], s = Ae(f);
    switch (Wr(s[0])) {
      case "<?xml":
        break;
      case "<Properties":
        break;
      case "<property":
        n = Be(s.name);
        break;
      case "</property>":
        n = null;
        break;
      default:
        if (f.indexOf("<vt:") === 0) {
          var c = f.split(">"), o = c[0].slice(4), u = c[1];
          switch (o) {
            case "lpstr":
            case "bstr":
            case "lpwstr":
              r[n] = Be(u);
              break;
            case "bool":
              r[n] = Ve(u);
              break;
            case "i1":
            case "i2":
            case "i4":
            case "i8":
            case "int":
            case "uint":
              r[n] = parseInt(u, 10);
              break;
            case "r4":
            case "r8":
            case "decimal":
              r[n] = parseFloat(u);
              break;
            case "filetime":
            case "date":
              r[n] = dr(u);
              break;
            case "cy":
            case "error":
              r[n] = Be(u);
              break;
            default:
              if (o.slice(-1) == "/") break;
              t.WTF && typeof console < "u" && console.warn("Unexpected", f, o, c);
          }
        } else if (f.slice(0, 2) !== "</") {
          if (t.WTF) throw new Error(f);
        }
    }
  }
  return r;
}
var uo = {
  Title: "Title",
  Subject: "Subject",
  Author: "Author",
  Keywords: "Keywords",
  Comments: "Description",
  LastAuthor: "LastAuthor",
  RevNumber: "Revision",
  Application: "AppName",
  /* TotalTime: 'TotalTime', */
  LastPrinted: "LastPrinted",
  CreatedDate: "Created",
  ModifiedDate: "LastSaved",
  /* Pages */
  /* Words */
  /* Characters */
  Category: "Category",
  /* PresentationFormat */
  Manager: "Manager",
  Company: "Company",
  /* Guid */
  /* HyperlinkBase */
  /* Bytes */
  /* Lines */
  /* Paragraphs */
  /* CharactersWithSpaces */
  AppVersion: "Version",
  ContentStatus: "ContentStatus",
  /* NOTE: missing from schema */
  Identifier: "Identifier",
  /* NOTE: missing from schema */
  Language: "Language"
  /* NOTE: missing from schema */
}, xn;
function ho(e, t, r) {
  xn || (xn = Bn(uo)), t = xn[t] || t, e[t] = r;
}
function Xn(e) {
  var t = e.read_shift(4), r = e.read_shift(4);
  return new Date((r / 1e7 * Math.pow(2, 32) + t / 1e7 - 11644473600) * 1e3).toISOString().replace(/\.000/, "");
}
function xo(e, t, r) {
  var n = e.l, a = e.read_shift(0, "lpstr-cp");
  if (r) for (; e.l - n & 3; ) ++e.l;
  return a;
}
function po(e, t, r) {
  var n = e.read_shift(0, "lpwstr");
  return n;
}
function q0(e, t, r) {
  return t === 31 ? po(e) : xo(e, t, r);
}
function ta(e, t, r) {
  return q0(e, t, r === !1 ? 0 : 4);
}
function mo(e, t) {
  if (!t) throw new Error("VtUnalignedString must have positive length");
  return q0(e, t, 0);
}
function vo(e) {
  for (var t = e.read_shift(4), r = [], n = 0; n != t; ++n) {
    var a = e.l;
    r[n] = e.read_shift(0, "lpwstr").replace(Fr, ""), e.l - a & 2 && (e.l += 2);
  }
  return r;
}
function go(e) {
  for (var t = e.read_shift(4), r = [], n = 0; n != t; ++n) r[n] = e.read_shift(0, "lpstr-cp").replace(Fr, "");
  return r;
}
function _o(e) {
  var t = e.l, r = Ka(e, Y0);
  e[e.l] == 0 && e[e.l + 1] == 0 && e.l - t & 2 && (e.l += 2);
  var n = Ka(e, Ar);
  return [r, n];
}
function wo(e) {
  for (var t = e.read_shift(4), r = [], n = 0; n < t / 2; ++n) r.push(_o(e));
  return r;
}
function Ii(e, t) {
  for (var r = e.read_shift(4), n = {}, a = 0; a != r; ++a) {
    var i = e.read_shift(4), f = e.read_shift(4);
    n[i] = e.read_shift(f, t === 1200 ? "utf16le" : "utf8").replace(Fr, "").replace(Kt, "!"), t === 1200 && f % 2 && (e.l += 2);
  }
  return e.l & 3 && (e.l = e.l >> 3 << 2), n;
}
function es(e) {
  var t = e.read_shift(4), r = e.slice(e.l, e.l + t);
  return e.l += t, (t & 3) > 0 && (e.l += 4 - (t & 3) & 3), r;
}
function ko(e) {
  var t = {};
  return t.Size = e.read_shift(4), e.l += t.Size + 3 - (t.Size - 1) % 4, t;
}
function Ka(e, t, r) {
  var n = e.read_shift(2), a, i = r || {};
  if (e.l += 2, t !== Fi && n !== t && Qc.indexOf(t) === -1 && !((t & 65534) == 4126 && (n & 65534) == 4126))
    throw new Error("Expected type " + t + " saw " + n);
  switch (t === Fi ? n : t) {
    case 2:
      return a = e.read_shift(2, "i"), i.raw || (e.l += 2), a;
    case 3:
      return a = e.read_shift(4, "i"), a;
    case 11:
      return e.read_shift(4) !== 0;
    case 19:
      return a = e.read_shift(4), a;
    case 30:
      e.l += 4, val = ta(e, e[e.l - 4]).replace(/(^|[^\u0000])\u0000+$/, "$1");
      break;
    case 31:
      e.l += 4, val = ta(e, e[e.l - 4]).replace(/(^|[^\u0000])\u0000+$/, "$1");
      break;
    case 64:
      return Xn(e);
    case 65:
      return es(e);
    case 71:
      return ko(e);
    case 80:
      return ta(e, n, !i.raw).replace(Fr, "");
    case 81:
      return mo(
        e,
        n
        /*, 4*/
      ).replace(Fr, "");
    case 4108:
      return wo(e);
    case 4126:
    case 4127:
      return n == 4127 ? vo(e) : go(e);
    default:
      throw new Error("TypedPropertyValue unrecognized type " + t + " " + n);
  }
}
function Oi(e, t) {
  var r = e.l, n = e.read_shift(4), a = e.read_shift(4), i = [], f = 0, s = 0, c = -1, o = {};
  for (f = 0; f != a; ++f) {
    var u = e.read_shift(4), m = e.read_shift(4);
    i[f] = [u, m + r];
  }
  i.sort(function(_, g) {
    return _[1] - g[1];
  });
  var x = {};
  for (f = 0; f != a; ++f) {
    if (e.l !== i[f][1]) {
      var l = !0;
      if (f > 0 && t) switch (t[i[f - 1][0]].t) {
        case 2:
          e.l + 2 === i[f][1] && (e.l += 2, l = !1);
          break;
        case 80:
          e.l <= i[f][1] && (e.l = i[f][1], l = !1);
          break;
        case 4108:
          e.l <= i[f][1] && (e.l = i[f][1], l = !1);
          break;
      }
      if ((!t || f == 0) && e.l <= i[f][1] && (l = !1, e.l = i[f][1]), l) throw new Error("Read Error: Expected address " + i[f][1] + " at " + e.l + " :" + f);
    }
    if (t) {
      if (i[f][0] == 0 && i.length > f + 1 && i[f][1] == i[f + 1][1]) continue;
      var v = t[i[f][0]];
      if (x[v.n] = Ka(e, v.t, { raw: !0 }), v.p === "version" && (x[v.n] = String(x[v.n] >> 16) + "." + ("0000" + String(x[v.n] & 65535)).slice(-4)), v.n == "CodePage") switch (x[v.n]) {
        case 0:
          x[v.n] = 1252;
        /* falls through */
        case 874:
        case 932:
        case 936:
        case 949:
        case 950:
        case 1250:
        case 1251:
        case 1253:
        case 1254:
        case 1255:
        case 1256:
        case 1257:
        case 1258:
        case 1e4:
        case 1200:
        case 1201:
        case 1252:
        case 65e3:
        case -536:
        case 65001:
        case -535:
          Gr(s = x[v.n] >>> 0 & 65535);
          break;
        default:
          throw new Error("Unsupported CodePage: " + x[v.n]);
      }
    } else if (i[f][0] === 1) {
      if (s = x.CodePage = Ka(e, Gn), Gr(s), c !== -1) {
        var p = e.l;
        e.l = i[c][1], o = Ii(e, s), e.l = p;
      }
    } else if (i[f][0] === 0) {
      if (s === 0) {
        c = f, e.l = i[f + 1][1];
        continue;
      }
      o = Ii(e, s);
    } else {
      var d = o[i[f][0]], h;
      switch (e[e.l]) {
        case 65:
          e.l += 4, h = es(e);
          break;
        case 30:
          e.l += 4, h = ta(e, e[e.l - 4]).replace(/(^|[^\u0000])\u0000+$/, "$1");
          break;
        case 31:
          e.l += 4, h = ta(e, e[e.l - 4]).replace(/(^|[^\u0000])\u0000+$/, "$1");
          break;
        case 3:
          e.l += 4, h = e.read_shift(4, "i");
          break;
        case 19:
          e.l += 4, h = e.read_shift(4);
          break;
        case 5:
          e.l += 4, h = e.read_shift(8, "f");
          break;
        case 11:
          e.l += 4, h = Qe(e, 4);
          break;
        case 64:
          e.l += 4, h = dr(Xn(e));
          break;
        default:
          throw new Error("unparsed value: " + e[e.l]);
      }
      x[d] = h;
    }
  }
  return e.l = r + n, x;
}
function Di(e, t, r) {
  var n = e.content;
  if (!n) return {};
  ir(n, 0);
  var a, i, f, s, c = 0;
  n.chk("feff", "Byte Order: "), n.read_shift(2);
  var o = n.read_shift(4), u = n.read_shift(16);
  if (u !== Ue.utils.consts.HEADER_CLSID && u !== r) throw new Error("Bad PropertySet CLSID " + u);
  if (a = n.read_shift(4), a !== 1 && a !== 2) throw new Error("Unrecognized #Sets: " + a);
  if (i = n.read_shift(16), s = n.read_shift(4), a === 1 && s !== n.l) throw new Error("Length mismatch: " + s + " !== " + n.l);
  a === 2 && (f = n.read_shift(16), c = n.read_shift(4));
  var m = Oi(n, t), x = { SystemIdentifier: o };
  for (var l in m) x[l] = m[l];
  if (x.FMTID = i, a === 1) return x;
  if (c - n.l == 2 && (n.l += 2), n.l !== c) throw new Error("Length mismatch 2: " + n.l + " !== " + c);
  var v;
  try {
    v = Oi(n, null);
  } catch {
  }
  for (l in v) x[l] = v[l];
  return x.FMTID = [i, f], x;
}
function st(e, t) {
  return e.read_shift(t), null;
}
function Eo(e, t, r) {
  for (var n = [], a = e.l + t; e.l < a; ) n.push(r(e, a - e.l));
  if (a !== e.l) throw new Error("Slurp error");
  return n;
}
function Qe(e, t) {
  return e.read_shift(t) === 1;
}
function Ze(e) {
  return e.read_shift(2, "u");
}
function rs(e, t) {
  return Eo(e, t, Ze);
}
function ts(e) {
  var t = e.read_shift(1), r = e.read_shift(1);
  return r === 1 ? t : t === 1;
}
function Wt(e, t, r) {
  var n = e.read_shift(r && r.biff >= 12 ? 2 : 1), a = "sbcs-cont", i = Ur;
  if (r && r.biff >= 8 && (Ur = 1200), !r || r.biff == 8) {
    var f = e.read_shift(1);
    f && (a = "dbcs-cont");
  } else r.biff == 12 && (a = "wstr");
  r.biff >= 2 && r.biff <= 5 && (a = "cpstr");
  var s = n ? e.read_shift(n, a) : "";
  return Ur = i, s;
}
function To(e) {
  var t = Ur;
  Ur = 1200;
  var r = e.read_shift(2), n = e.read_shift(1), a = n & 4, i = n & 8, f = 1 + (n & 1), s = 0, c, o = {};
  i && (s = e.read_shift(2)), a && (c = e.read_shift(4));
  var u = f == 2 ? "dbcs-cont" : "sbcs-cont", m = r === 0 ? "" : e.read_shift(r, u);
  return i && (e.l += 4 * s), a && (e.l += c), o.t = m, i || (o.raw = "<t>" + o.t + "</t>", o.r = o.t), Ur = t, o;
}
function Ct(e, t, r) {
  var n;
  if (r) {
    if (r.biff >= 2 && r.biff <= 5) return e.read_shift(t, "cpstr");
    if (r.biff >= 12) return e.read_shift(t, "dbcs-cont");
  }
  var a = e.read_shift(1);
  return a === 0 ? n = e.read_shift(t, "sbcs-cont") : n = e.read_shift(t, "dbcs-cont"), n;
}
function ga(e, t, r) {
  var n = e.read_shift(r && r.biff == 2 ? 1 : 2);
  return n === 0 ? (e.l++, "") : Ct(e, n, r);
}
function Rt(e, t, r) {
  if (r.biff > 5) return ga(e, t, r);
  var n = e.read_shift(1);
  return n === 0 ? (e.l++, "") : e.read_shift(n, r.biff <= 4 || !e.lens ? "cpstr" : "sbcs-cont");
}
function yo(e) {
  var t = e.read_shift(1);
  e.l++;
  var r = e.read_shift(2);
  return e.l += 2, [t, r];
}
function Ao(e) {
  var t = e.read_shift(4), r = e.l, n = !1;
  t > 24 && (e.l += t - 24, e.read_shift(16) === "795881f43b1d7f48af2c825dc4852763" && (n = !0), e.l = r);
  var a = e.read_shift((n ? t - 24 : t) >> 1, "utf16le").replace(Fr, "");
  return n && (e.l += 24), a;
}
function Fo(e) {
  for (var t = e.read_shift(2), r = ""; t-- > 0; ) r += "../";
  var n = e.read_shift(0, "lpstr-ansi");
  if (e.l += 2, e.read_shift(2) != 57005) throw new Error("Bad FileMoniker");
  var a = e.read_shift(4);
  if (a === 0) return r + n.replace(/\\/g, "/");
  var i = e.read_shift(4);
  if (e.read_shift(2) != 3) throw new Error("Bad FileMoniker");
  var f = e.read_shift(i >> 1, "utf16le").replace(Fr, "");
  return r + f;
}
function So(e, t) {
  var r = e.read_shift(16);
  switch (r) {
    case "e0c9ea79f9bace118c8200aa004ba90b":
      return Ao(e);
    case "0303000000000000c000000000000046":
      return Fo(e);
    default:
      throw new Error("Unsupported Moniker " + r);
  }
}
function Ra(e) {
  var t = e.read_shift(4), r = t > 0 ? e.read_shift(t, "utf16le").replace(Fr, "") : "";
  return r;
}
function Co(e, t) {
  var r = e.l + t, n = e.read_shift(4);
  if (n !== 2) throw new Error("Unrecognized streamVersion: " + n);
  var a = e.read_shift(2);
  e.l += 2;
  var i, f, s, c, o = "", u, m;
  a & 16 && (i = Ra(e, r - e.l)), a & 128 && (f = Ra(e, r - e.l)), (a & 257) === 257 && (s = Ra(e, r - e.l)), (a & 257) === 1 && (c = So(e, r - e.l)), a & 8 && (o = Ra(e, r - e.l)), a & 32 && (u = e.read_shift(16)), a & 64 && (m = Xn(
    e
    /*, 8*/
  )), e.l = r;
  var x = f || s || c || "";
  x && o && (x += "#" + o), x || (x = "#" + o), a & 2 && x.charAt(0) == "/" && x.charAt(1) != "/" && (x = "file://" + x);
  var l = { Target: x };
  return u && (l.guid = u), m && (l.time = m), i && (l.Tooltip = i), l;
}
function as(e) {
  var t = e.read_shift(1), r = e.read_shift(1), n = e.read_shift(1), a = e.read_shift(1);
  return [t, r, n, a];
}
function ns(e, t) {
  var r = as(e);
  return r[3] = 0, r;
}
function jr(e, t, r) {
  var n = e.read_shift(2), a = e.read_shift(2), i = { r: n, c: a, ixfe: 0 };
  if (r && r.biff == 2 || t == 7) {
    var f = e.read_shift(1);
    i.ixfe = f & 63, e.l += 2;
  } else i.ixfe = e.read_shift(2);
  return i;
}
function bo(e) {
  var t = e.read_shift(2), r = e.read_shift(2);
  return e.l += 8, { type: t, flags: r };
}
function Io(e, t, r) {
  return t === 0 ? "" : Rt(e, t, r);
}
function Oo(e, t, r) {
  var n = r.biff > 8 ? 4 : 2, a = e.read_shift(n), i = e.read_shift(n, "i"), f = e.read_shift(n, "i");
  return [a, i, f];
}
function is(e) {
  var t = e.read_shift(2), r = an(e);
  return [t, r];
}
function Do(e, t, r) {
  e.l += 4, t -= 4;
  var n = e.l + t, a = Wt(e, t, r), i = e.read_shift(2);
  if (n -= e.l, i !== n) throw new Error("Malformed AddinUdf: padding = " + n + " != " + i);
  return e.l += i, a;
}
function nn(e) {
  var t = e.read_shift(2), r = e.read_shift(2), n = e.read_shift(2), a = e.read_shift(2);
  return { s: { c: n, r: t }, e: { c: a, r } };
}
function ss(e) {
  var t = e.read_shift(2), r = e.read_shift(2), n = e.read_shift(1), a = e.read_shift(1);
  return { s: { c: n, r: t }, e: { c: a, r } };
}
var Ro = ss;
function fs(e) {
  e.l += 4;
  var t = e.read_shift(2), r = e.read_shift(2), n = e.read_shift(2);
  return e.l += 12, [r, t, n];
}
function No(e) {
  var t = {};
  return e.l += 4, e.l += 16, t.fSharedNote = e.read_shift(2), e.l += 4, t;
}
function Po(e) {
  var t = {};
  return e.l += 4, e.cf = e.read_shift(2), t;
}
function mr(e) {
  e.l += 2, e.l += e.read_shift(2);
}
var Bo = {
  0: mr,
  /* FtEnd */
  4: mr,
  /* FtMacro */
  5: mr,
  /* FtButton */
  6: mr,
  /* FtGmo */
  7: Po,
  /* FtCf */
  8: mr,
  /* FtPioGrbit */
  9: mr,
  /* FtPictFmla */
  10: mr,
  /* FtCbls */
  11: mr,
  /* FtRbo */
  12: mr,
  /* FtSbs */
  13: No,
  /* FtNts */
  14: mr,
  /* FtSbsFmla */
  15: mr,
  /* FtGboData */
  16: mr,
  /* FtEdoData */
  17: mr,
  /* FtRboData */
  18: mr,
  /* FtCblsData */
  19: mr,
  /* FtLbsData */
  20: mr,
  /* FtCblsFmla */
  21: fs
};
function Lo(e, t) {
  for (var r = e.l + t, n = []; e.l < r; ) {
    var a = e.read_shift(2);
    e.l -= 2;
    try {
      n[a] = Bo[a](e, r - e.l);
    } catch {
      return e.l = r, n;
    }
  }
  return e.l != r && (e.l = r), n;
}
function Na(e, t) {
  var r = { BIFFVer: 0, dt: 0 };
  switch (r.BIFFVer = e.read_shift(2), t -= 2, t >= 2 && (r.dt = e.read_shift(2), e.l -= 2), r.BIFFVer) {
    case 1536:
    /* BIFF8 */
    case 1280:
    /* BIFF5 */
    case 1024:
    /* BIFF4 */
    case 768:
    /* BIFF3 */
    case 512:
    /* BIFF2 */
    case 2:
    case 7:
      break;
    default:
      if (t > 6) throw new Error("Unexpected BIFF Ver " + r.BIFFVer);
  }
  return e.read_shift(t), r;
}
function Mo(e, t) {
  return t === 0 || e.read_shift(2), 1200;
}
function Uo(e, t, r) {
  if (r.enc)
    return e.l += t, "";
  var n = e.l, a = Rt(e, 0, r);
  return e.read_shift(t + n - e.l), a;
}
function zo(e, t, r) {
  var n = r && r.biff == 8 || t == 2 ? e.read_shift(2) : (e.l += t, 0);
  return { fDialog: n & 16, fBelow: n & 64, fRight: n & 128 };
}
function Wo(e, t, r) {
  var n = "";
  if (r.biff == 4)
    return n = Wt(e, 0, r), n.length === 0 && (n = "Sheet1"), { name: n };
  var a = e.read_shift(4), i = e.read_shift(1) & 3, f = e.read_shift(1);
  switch (f) {
    case 0:
      f = "Worksheet";
      break;
    case 1:
      f = "Macrosheet";
      break;
    case 2:
      f = "Chartsheet";
      break;
    case 6:
      f = "VBAModule";
      break;
  }
  return n = Wt(e, 0, r), n.length === 0 && (n = "Sheet1"), { pos: a, hs: i, dt: f, name: n };
}
function Ho(e, t) {
  for (var r = e.l + t, n = e.read_shift(4), a = e.read_shift(4), i = [], f = 0; f != a && e.l < r; ++f)
    i.push(To(e));
  return i.Count = n, i.Unique = a, i;
}
function Vo(e, t) {
  var r = {};
  return r.dsst = e.read_shift(2), e.l += t - 2, r;
}
function Go(e) {
  var t = {};
  t.r = e.read_shift(2), t.c = e.read_shift(2), t.cnt = e.read_shift(2) - t.c;
  var r = e.read_shift(2);
  e.l += 4;
  var n = e.read_shift(1);
  return e.l += 3, n & 7 && (t.level = n & 7), n & 32 && (t.hidden = !0), n & 64 && (t.hpt = r / 20), t;
}
function Xo(e) {
  var t = bo(e);
  if (t.type != 2211) throw new Error("Invalid Future Record " + t.type);
  var r = e.read_shift(4);
  return r !== 0;
}
function $o(e) {
  return e.read_shift(2), e.read_shift(4);
}
function Ri(e, t, r) {
  var n = 0;
  r && r.biff == 2 || (n = e.read_shift(2));
  var a = e.read_shift(2);
  r && r.biff == 2 && (n = 1 - (a >> 15), a &= 32767);
  var i = { Unsynced: n & 1, DyZero: (n & 2) >> 1, ExAsc: (n & 4) >> 2, ExDsc: (n & 8) >> 3 };
  return [i, a];
}
function jo(e) {
  var t = e.read_shift(2), r = e.read_shift(2), n = e.read_shift(2), a = e.read_shift(2), i = e.read_shift(2), f = e.read_shift(2), s = e.read_shift(2), c = e.read_shift(2), o = e.read_shift(2);
  return {
    Pos: [t, r],
    Dim: [n, a],
    Flags: i,
    CurTab: f,
    FirstTab: s,
    Selected: c,
    TabRatio: o
  };
}
function Ko(e, t, r) {
  if (r && r.biff >= 2 && r.biff < 5) return {};
  var n = e.read_shift(2);
  return { RTL: n & 64 };
}
function Yo() {
}
function Zo(e, t, r) {
  var n = {
    dyHeight: e.read_shift(2),
    fl: e.read_shift(2)
  };
  switch (r && r.biff || 8) {
    case 2:
      break;
    case 3:
    case 4:
      e.l += 2;
      break;
    default:
      e.l += 10;
      break;
  }
  return n.name = Wt(e, 0, r), n;
}
function Qo(e, t, r) {
  var n = jr(e, t, r);
  return n.isst = e.read_shift(4), n;
}
function Jo(e, t, r) {
  r.biffguess && r.biff == 2 && (r.biff = 5);
  var n = e.l + t, a = jr(e, t, r), i = ga(e, n - e.l, r);
  return a.val = i, a;
}
function qo(e, t, r) {
  var n = e.read_shift(2), a = Rt(e, 0, r);
  return [n, a];
}
var el = Rt;
function Ni(e, t, r) {
  var n = e.l + t, a = r.biff == 8 || !r.biff ? 4 : 2, i = e.read_shift(a), f = e.read_shift(a), s = e.read_shift(2), c = e.read_shift(2);
  return e.l = n, { s: { r: i, c: s }, e: { r: f, c } };
}
function rl(e) {
  var t = e.read_shift(2), r = e.read_shift(2), n = is(e);
  return { r: t, c: r, ixfe: n[0], rknum: n[1] };
}
function tl(e, t) {
  for (var r = e.l + t - 2, n = e.read_shift(2), a = e.read_shift(2), i = []; e.l < r; ) i.push(is(e));
  if (e.l !== r) throw new Error("MulRK read error");
  var f = e.read_shift(2);
  if (i.length != f - a + 1) throw new Error("MulRK length mismatch");
  return { r: n, c: a, C: f, rkrec: i };
}
function al(e, t) {
  for (var r = e.l + t - 2, n = e.read_shift(2), a = e.read_shift(2), i = []; e.l < r; ) i.push(e.read_shift(2));
  if (e.l !== r) throw new Error("MulBlank read error");
  var f = e.read_shift(2);
  if (i.length != f - a + 1) throw new Error("MulBlank length mismatch");
  return { r: n, c: a, C: f, ixfe: i };
}
function nl(e, t, r, n) {
  var a = {}, i = e.read_shift(4), f = e.read_shift(4), s = e.read_shift(4), c = e.read_shift(2);
  return a.patternType = eo[s >> 26], n.cellStyles && (a.alc = i & 7, a.fWrap = i >> 3 & 1, a.alcV = i >> 4 & 7, a.fJustLast = i >> 7 & 1, a.trot = i >> 8 & 255, a.cIndent = i >> 16 & 15, a.fShrinkToFit = i >> 20 & 1, a.iReadOrder = i >> 22 & 2, a.fAtrNum = i >> 26 & 1, a.fAtrFnt = i >> 27 & 1, a.fAtrAlc = i >> 28 & 1, a.fAtrBdr = i >> 29 & 1, a.fAtrPat = i >> 30 & 1, a.fAtrProt = i >> 31 & 1, a.dgLeft = f & 15, a.dgRight = f >> 4 & 15, a.dgTop = f >> 8 & 15, a.dgBottom = f >> 12 & 15, a.icvLeft = f >> 16 & 127, a.icvRight = f >> 23 & 127, a.grbitDiag = f >> 30 & 3, a.icvTop = s & 127, a.icvBottom = s >> 7 & 127, a.icvDiag = s >> 14 & 127, a.dgDiag = s >> 21 & 15, a.icvFore = c & 127, a.icvBack = c >> 7 & 127, a.fsxButton = c >> 14 & 1), a;
}
function il(e, t, r) {
  var n = {};
  return n.ifnt = e.read_shift(2), n.numFmtId = e.read_shift(2), n.flags = e.read_shift(2), n.fStyle = n.flags >> 2 & 1, t -= 6, n.data = nl(e, t, n.fStyle, r), n;
}
function sl(e) {
  var t = {};
  return t.ifnt = e.read_shift(1), e.l++, t.flags = e.read_shift(1), t.numFmtId = t.flags & 63, t.flags >>= 6, t.fStyle = 0, t.data = {}, t;
}
function fl(e) {
  var t = {};
  return t.ifnt = e.read_shift(1), t.numFmtId = e.read_shift(1), t.flags = e.read_shift(2), t.fStyle = t.flags >> 2 & 1, t.data = {}, t;
}
function cl(e) {
  var t = {};
  return t.ifnt = e.read_shift(1), t.numFmtId = e.read_shift(1), t.flags = e.read_shift(2), t.fStyle = t.flags >> 2 & 1, t.data = {}, t;
}
function ol(e) {
  e.l += 4;
  var t = [e.read_shift(2), e.read_shift(2)];
  if (t[0] !== 0 && t[0]--, t[1] !== 0 && t[1]--, t[0] > 7 || t[1] > 7) throw new Error("Bad Gutters: " + t.join("|"));
  return t;
}
function ll(e, t, r) {
  var n = jr(e, 6, r), a = ts(e);
  return n.val = a, n.t = a === !0 || a === !1 ? "b" : "e", n;
}
function ul(e, t, r) {
  r.biffguess && r.biff == 2 && (r.biff = 5);
  var n = jr(e, 6, r), a = gr(e);
  return n.val = a, n;
}
var Pi = Io;
function hl(e, t, r) {
  var n = e.l + t, a = e.read_shift(2), i = e.read_shift(2);
  if (r.sbcch = i, i == 1025 || i == 14849) return [i, a];
  if (i < 1 || i > 255) throw new Error("Unexpected SupBook type: " + i);
  for (var f = Ct(e, i), s = []; n > e.l; ) s.push(ga(e));
  return [i, a, f, s];
}
function Bi(e, t, r) {
  var n = e.read_shift(2), a, i = {
    fBuiltIn: n & 1,
    fWantAdvise: n >>> 1 & 1,
    fWantPict: n >>> 2 & 1,
    fOle: n >>> 3 & 1,
    fOleLink: n >>> 4 & 1,
    cf: n >>> 5 & 1023,
    fIcon: n >>> 15 & 1
  };
  return r.sbcch === 14849 && (a = Do(e, t - 2, r)), i.body = a || e.read_shift(t - 2), typeof a == "string" && (i.Name = a), i;
}
function Li(e, t, r) {
  var n = e.l + t, a = e.read_shift(2), i = e.read_shift(1), f = e.read_shift(1), s = e.read_shift(r && r.biff == 2 ? 1 : 2), c = 0;
  (!r || r.biff >= 5) && (r.biff != 5 && (e.l += 2), c = e.read_shift(2), r.biff == 5 && (e.l += 2), e.l += 4);
  var o = Ct(e, f, r);
  a & 32 && (o = Z0[o.charCodeAt(0)]);
  var u = n - e.l;
  r && r.biff == 2 && --u;
  var m = n == e.l || s === 0 || !(u > 0) ? [] : W1(e, u, r, s);
  return {
    chKey: i,
    Name: o,
    itab: c,
    rgce: m
  };
}
function cs(e, t, r) {
  if (r.biff < 8 || !(r.biff > 8) && t == e[e.l] + (e[e.l + 1] == 3 ? 1 : 0) + 1) return Mi(e, t, r);
  for (var n = [], a = e.l + t, i = e.read_shift(r.biff > 8 ? 4 : 2); i-- !== 0; ) n.push(Oo(e, r.biff > 8 ? 12 : 6, r));
  if (e.l != a) throw new Error("Bad ExternSheet: " + e.l + " != " + a);
  return n;
}
function Mi(e, t, r) {
  e[e.l + 1] == 3 && e[e.l]++;
  var n = Wt(e, t, r);
  return n.charCodeAt(0) == 3 ? n.slice(1) : n;
}
function dl(e, t, r) {
  if (r.biff < 8) {
    e.l += t;
    return;
  }
  var n = e.read_shift(2), a = e.read_shift(2), i = Ct(e, n, r), f = Ct(e, a, r);
  return [i, f];
}
function xl(e, t, r) {
  var n = ss(e);
  e.l++;
  var a = e.read_shift(1);
  return t -= 8, [H1(e, t, r), a, n];
}
function Ui(e, t, r) {
  var n = Ro(e);
  switch (r.biff) {
    case 2:
      e.l++, t -= 7;
      break;
    case 3:
    case 4:
      e.l += 2, t -= 8;
      break;
    default:
      e.l += 6, t -= 12;
  }
  return [n, U1(e, t, r)];
}
function pl(e) {
  var t = e.read_shift(4) !== 0, r = e.read_shift(4) !== 0, n = e.read_shift(4);
  return [t, r, n];
}
function ml(e, t, r) {
  var n = e.read_shift(2), a = e.read_shift(2), i = e.read_shift(2), f = e.read_shift(2), s = Rt(e, 0, r);
  return [{ r: n, c: a }, s, f, i];
}
function vl(e, t, r) {
  if (r && r.biff < 8) {
    var n = e.read_shift(2), a = e.read_shift(2);
    if (n == 65535 || n == -1) return;
    var i = e.read_shift(2), f = e.read_shift(Math.min(i, 2048), "cpstr");
    return [{ r: n, c: a }, f];
  }
  return ml(e, t, r);
}
function gl(e, t) {
  for (var r = [], n = e.read_shift(2); n--; ) r.push(nn(e));
  return r;
}
function _l(e, t, r) {
  if (r && r.biff < 8) return kl(e, t, r);
  var n = fs(e), a = Lo(e, t - 22, n[1]);
  return { cmo: n, ft: a };
}
var wl = {
  8: function(e, t) {
    var r = e.l + t;
    e.l += 10;
    var n = e.read_shift(2);
    e.l += 4, e.l += 2, e.l += 2, e.l += 2, e.l += 4;
    var a = e.read_shift(1);
    return e.l += a, e.l = r, { fmt: n };
  }
};
function kl(e, t, r) {
  e.l += 4;
  var n = e.read_shift(2), a = e.read_shift(2), i = e.read_shift(2);
  e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 6, t -= 36;
  var f = [];
  return f.push((wl[n] || kr)(e, t, r)), { cmo: [a, n, i], ft: f };
}
function El(e, t, r) {
  var n = e.l, a = "";
  try {
    e.l += 4;
    var i = (r.lastobj || { cmo: [0, 0] }).cmo[1], f;
    [0, 5, 7, 11, 12, 14].indexOf(i) == -1 ? e.l += 6 : f = yo(e, 6, r);
    var s = e.read_shift(2);
    e.read_shift(2), Ze(e, 2);
    var c = e.read_shift(2);
    e.l += c;
    for (var o = 1; o < e.lens.length - 1; ++o) {
      if (e.l - n != e.lens[o]) throw new Error("TxO: bad continue record");
      var u = e[e.l], m = Ct(e, e.lens[o + 1] - e.lens[o] - 1);
      if (a += m, a.length >= (u ? s : 2 * s)) break;
    }
    if (a.length !== s && a.length !== s * 2)
      throw new Error("cchText: " + s + " != " + a.length);
    return e.l = n + t, { t: a };
  } catch {
    return e.l = n + t, { t: a };
  }
}
function Tl(e, t) {
  var r = nn(e);
  e.l += 16;
  var n = Co(e, t - 24);
  return [r, n];
}
function yl(e, t) {
  e.read_shift(2);
  var r = nn(e), n = e.read_shift((t - 10) / 2, "dbcs-cont");
  return n = n.replace(Fr, ""), [r, n];
}
function Al(e) {
  var t = [0, 0], r;
  return r = e.read_shift(2), t[0] = Si[r] || r, r = e.read_shift(2), t[1] = Si[r] || r, t;
}
function Fl(e) {
  for (var t = e.read_shift(2), r = []; t-- > 0; ) r.push(ns(e));
  return r;
}
function Sl(e) {
  for (var t = e.read_shift(2), r = []; t-- > 0; ) r.push(ns(e));
  return r;
}
function Cl(e) {
  e.l += 2;
  var t = { cxfs: 0, crc: 0 };
  return t.cxfs = e.read_shift(2), t.crc = e.read_shift(4), t;
}
function os(e, t, r) {
  if (!r.cellStyles) return kr(e, t);
  var n = r && r.biff >= 12 ? 4 : 2, a = e.read_shift(n), i = e.read_shift(n), f = e.read_shift(n), s = e.read_shift(n), c = e.read_shift(2);
  n == 2 && (e.l += 2);
  var o = { s: a, e: i, w: f, ixfe: s, flags: c };
  return (r.biff >= 5 || !r.biff) && (o.level = c >> 8 & 7), o;
}
function bl(e, t) {
  var r = {};
  return t < 32 || (e.l += 16, r.header = gr(e), r.footer = gr(e), e.l += 2), r;
}
function Il(e, t, r) {
  var n = { area: !1 };
  if (r.biff != 5)
    return e.l += t, n;
  var a = e.read_shift(1);
  return e.l += 3, a & 16 && (n.area = !0), n;
}
var Ol = jr, Dl = rs, Rl = ga;
function Nl(e) {
  var t = e.read_shift(2), r = e.read_shift(2), n = e.read_shift(4), a = { fmt: t, env: r, len: n, data: e.slice(e.l, e.l + n) };
  return e.l += n, a;
}
function Pl(e, t, r) {
  r.biffguess && r.biff == 5 && (r.biff = 2);
  var n = jr(e, 7, r), a = Rt(e, t - 7, r);
  return n.t = "str", n.val = a, n;
}
function Bl(e, t, r) {
  var n = jr(e, 7, r), a = gr(e);
  return n.t = "n", n.val = a, n;
}
function Ll(e, t, r) {
  var n = jr(e, 7, r), a = e.read_shift(2);
  return n.t = "n", n.val = a, n;
}
function Ml(e) {
  var t = e.read_shift(1);
  return t === 0 ? (e.l++, "") : e.read_shift(t, "sbcs-cont");
}
function Ul(e, t, r) {
  var n = e.l + 7, a = jr(e, 6, r);
  e.l = n;
  var i = ts(e);
  return a.val = i, a.t = i === !0 || i === !1 ? "b" : "e", a;
}
function zl(e, t) {
  e.l += 6, e.l += 2, e.l += 1, e.l += 3, e.l += 1, e.l += t - 13;
}
function Wl(e, t, r) {
  var n = e.l + t, a = jr(e, 6, r), i = e.read_shift(2), f = Ct(e, i, r);
  return e.l = n, a.t = "str", a.val = f, a;
}
function Hl(e) {
  var t = e.read_shift(4), r = e.read_shift(1), n = e.read_shift(r, "sbcs");
  return n.length === 0 && (n = "Sheet1"), { flags: t, name: n };
}
var Vl = [2, 3, 48, 49, 131, 139, 140, 245], zi = /* @__PURE__ */ (function() {
  var e = {
    /* Code Pages Supported by Visual FoxPro */
    1: 437,
    2: 850,
    3: 1252,
    4: 1e4,
    100: 852,
    101: 866,
    102: 865,
    103: 861,
    104: 895,
    105: 620,
    106: 737,
    107: 857,
    120: 950,
    121: 949,
    122: 936,
    123: 932,
    124: 874,
    125: 1255,
    126: 1256,
    150: 10007,
    151: 10029,
    152: 10006,
    200: 1250,
    201: 1251,
    202: 1254,
    203: 1253,
    /* shapefile DBF extension */
    0: 20127,
    8: 865,
    9: 437,
    10: 850,
    11: 437,
    13: 437,
    14: 850,
    15: 437,
    16: 850,
    17: 437,
    18: 850,
    19: 932,
    20: 850,
    21: 437,
    22: 850,
    23: 865,
    24: 437,
    25: 437,
    26: 850,
    27: 437,
    28: 863,
    29: 850,
    31: 852,
    34: 852,
    35: 852,
    36: 860,
    37: 850,
    38: 866,
    55: 850,
    64: 852,
    77: 936,
    78: 949,
    79: 950,
    80: 874,
    87: 1252,
    88: 1252,
    89: 1252,
    108: 863,
    134: 737,
    135: 852,
    136: 857,
    204: 1257,
    255: 16969
  }, t = Bn({
    1: 437,
    2: 850,
    3: 1252,
    4: 1e4,
    100: 852,
    101: 866,
    102: 865,
    103: 861,
    104: 895,
    105: 620,
    106: 737,
    107: 857,
    120: 950,
    121: 949,
    122: 936,
    123: 932,
    124: 874,
    125: 1255,
    126: 1256,
    150: 10007,
    151: 10029,
    152: 10006,
    200: 1250,
    201: 1251,
    202: 1254,
    203: 1253,
    0: 20127
  });
  function r(s, c) {
    var o = [], u = lt(1);
    switch (c.type) {
      case "base64":
        u = Ir(Rr(s));
        break;
      case "binary":
        u = Ir(s);
        break;
      case "buffer":
      case "array":
        u = s;
        break;
    }
    ir(u, 0);
    var m = u.read_shift(1), x = !!(m & 136), l = !1, v = !1;
    switch (m) {
      case 2:
        break;
      // dBASE II
      case 3:
        break;
      // dBASE III
      case 48:
        l = !0, x = !0;
        break;
      // VFP
      case 49:
        l = !0, x = !0;
        break;
      // VFP with autoincrement
      // 0x43 dBASE IV SQL table files
      // 0x63 dBASE IV SQL system files
      case 131:
        break;
      // dBASE III with memo
      case 139:
        break;
      // dBASE IV with memo
      case 140:
        v = !0;
        break;
      // dBASE Level 7 with memo
      // case 0xCB dBASE IV SQL table files with memo
      case 245:
        break;
      // FoxPro 2.x with memo
      // case 0xFB FoxBASE
      default:
        throw new Error("DBF Unsupported Version: " + m.toString(16));
    }
    var p = 0, d = 521;
    m == 2 && (p = u.read_shift(2)), u.l += 3, m != 2 && (p = u.read_shift(4)), p > 1048576 && (p = 1e6), m != 2 && (d = u.read_shift(2));
    var h = u.read_shift(2);
    c.codepage, m != 2 && (u.l += 16, u.read_shift(1), u[u.l] !== 0 && e[u[u.l]], u.l += 1, u.l += 2), v && (u.l += 36);
    for (var _ = [], g = {}, E = Math.min(u.length, m == 2 ? 521 : d - 10 - (l ? 264 : 0)), A = v ? 32 : 11; u.l < E && u[u.l] != 13; )
      switch (g = {}, g.name = nt(u.slice(u.l, u.l + A)).replace(/[\u0000\r\n][\S\s]*$/g, ""), u.l += A, g.type = String.fromCharCode(u.read_shift(1)), m != 2 && !v && (g.offset = u.read_shift(4)), g.len = u.read_shift(1), m == 2 && (g.offset = u.read_shift(2)), g.dec = u.read_shift(1), g.name.length && _.push(g), m != 2 && (u.l += v ? 13 : 14), g.type) {
        case "B":
          (!l || g.len != 8) && c.WTF && console.log("Skipping " + g.name + ":" + g.type);
          break;
        case "G":
        // General (FoxPro and dBASE L7)
        case "P":
          c.WTF && console.log("Skipping " + g.name + ":" + g.type);
          break;
        case "+":
        // Autoincrement (dBASE L7 only)
        case "0":
        // _NullFlags (VFP only)
        case "@":
        // Timestamp (dBASE L7 only)
        case "C":
        // Character (dBASE II)
        case "D":
        // Date (dBASE III)
        case "F":
        // Float (dBASE IV)
        case "I":
        // Long (VFP and dBASE L7)
        case "L":
        // Logical (dBASE II)
        case "M":
        // Memo (dBASE III)
        case "N":
        // Number (dBASE II)
        case "O":
        // Double (dBASE L7 only)
        case "T":
        // Datetime (VFP only)
        case "Y":
          break;
        default:
          throw new Error("Unknown Field Type: " + g.type);
      }
    if (u[u.l] !== 13 && (u.l = d - 1), u.read_shift(1) !== 13) throw new Error("DBF Terminator not found " + u.l + " " + u[u.l]);
    u.l = d;
    var P = 0, S = 0;
    for (o[0] = [], S = 0; S != _.length; ++S) o[0][S] = _[S].name;
    for (; p-- > 0; ) {
      if (u[u.l] === 42) {
        u.l += h;
        continue;
      }
      for (++u.l, o[++P] = [], S = 0, S = 0; S != _.length; ++S) {
        var R = u.slice(u.l, u.l + _[S].len);
        u.l += _[S].len, ir(R, 0);
        var F = nt(R);
        switch (_[S].type) {
          case "C":
            F.trim().length && (o[P][S] = F.replace(/([^\s])\s+$/, "$1"));
            break;
          case "D":
            F.length === 8 ? (o[P][S] = new Date(Date.UTC(+F.slice(0, 4), +F.slice(4, 6) - 1, +F.slice(6, 8), 0, 0, 0, 0)), c && c.UTC || (o[P][S] = St(o[P][S]))) : o[P][S] = F;
            break;
          case "F":
            o[P][S] = parseFloat(F.trim());
            break;
          case "+":
          case "I":
            o[P][S] = v ? R.read_shift(-4, "i") ^ 2147483648 : R.read_shift(4, "i");
            break;
          case "L":
            switch (F.trim().toUpperCase()) {
              case "Y":
              case "T":
                o[P][S] = !0;
                break;
              case "N":
              case "F":
                o[P][S] = !1;
                break;
              case "":
              case "\0":
              case "?":
                break;
              default:
                throw new Error("DBF Unrecognized L:|" + F + "|");
            }
            break;
          case "M":
            if (!x) throw new Error("DBF Unexpected MEMO for type " + m.toString(16));
            o[P][S] = "##MEMO##" + (v ? parseInt(F.trim(), 10) : R.read_shift(4));
            break;
          case "N":
            F = F.replace(/\u0000/g, "").trim(), F && F != "." && (o[P][S] = +F || 0);
            break;
          case "@":
            o[P][S] = new Date(R.read_shift(-8, "f") - 621356832e5);
            break;
          case "T":
            {
              var U = R.read_shift(4), H = R.read_shift(4);
              if (U == 0 && H == 0) break;
              o[P][S] = new Date((U - 2440588) * 864e5 + H), c && c.UTC || (o[P][S] = St(o[P][S]));
            }
            break;
          case "Y":
            o[P][S] = R.read_shift(4, "i") / 1e4 + R.read_shift(4, "i") / 1e4 * Math.pow(2, 32);
            break;
          case "O":
            o[P][S] = -R.read_shift(-8, "f");
            break;
          case "B":
            if (l && _[S].len == 8) {
              o[P][S] = R.read_shift(8, "f");
              break;
            }
          /* falls through */
          case "G":
          case "P":
            R.l += _[S].len;
            break;
          case "0":
            if (_[S].name === "_NullFlags") break;
          /* falls through */
          default:
            throw new Error("DBF Unsupported data type " + _[S].type);
        }
      }
    }
    if (m != 2 && u.l < u.length && u[u.l++] != 26) throw new Error("DBF EOF Marker missing " + (u.l - 1) + " of " + u.length + " " + u[u.l - 1].toString(16));
    return c && c.sheetRows && (o = o.slice(0, c.sheetRows)), c.DBF = _, o;
  }
  function n(s, c) {
    var o = c || {};
    o.dateNF || (o.dateNF = "yyyymmdd");
    var u = Vt(r(s, o), o);
    return u["!cols"] = o.DBF.map(function(m) {
      return {
        wch: m.len,
        DBF: m
      };
    }), delete o.DBF, u;
  }
  function a(s, c) {
    try {
      var o = xt(n(s, c), c);
      return o.bookType = "dbf", o;
    } catch (u) {
      if (c && c.WTF) throw u;
    }
    return { SheetNames: [], Sheets: {} };
  }
  var i = { B: 8, C: 250, L: 1, D: 8, "?": 0, "": 0 };
  function f(s, c) {
    if (!s["!ref"]) throw new Error("Cannot export empty sheet to DBF");
    var o = c || {}, u = Ur;
    if (+o.codepage >= 0 && Gr(+o.codepage), o.type == "string") throw new Error("Cannot write DBF to JS string");
    var m = Tn(), x = bn(s, { header: 1, raw: !0, cellDates: !0 }), l = x[0], v = x.slice(1), p = s["!cols"] || [], d = 0, h = 0, _ = 0, g = 1;
    for (d = 0; d < l.length; ++d) {
      if (((p[d] || {}).DBF || {}).name) {
        l[d] = p[d].DBF.name, ++_;
        continue;
      }
      if (l[d] != null) {
        if (++_, typeof l[d] == "number" && (l[d] = l[d].toString(10)), typeof l[d] != "string") throw new Error("DBF Invalid column name " + l[d] + " |" + typeof l[d] + "|");
        if (l.indexOf(l[d]) !== d) {
          for (h = 0; h < 1024; ++h)
            if (l.indexOf(l[d] + "_" + h) == -1) {
              l[d] += "_" + h;
              break;
            }
        }
      }
    }
    var E = Je(s["!ref"]), A = [], P = [], S = [];
    for (d = 0; d <= E.e.c - E.s.c; ++d) {
      var R = "", F = "", U = 0, H = [];
      for (h = 0; h < v.length; ++h)
        v[h][d] != null && H.push(v[h][d]);
      if (H.length == 0 || l[d] == null) {
        A[d] = "?";
        continue;
      }
      for (h = 0; h < H.length; ++h) {
        switch (typeof H[h]) {
          /* TODO: check if L2 compat is desired */
          case "number":
            F = "B";
            break;
          case "string":
            F = "C";
            break;
          case "boolean":
            F = "L";
            break;
          case "object":
            F = H[h] instanceof Date ? "D" : "C";
            break;
          default:
            F = "C";
        }
        U = Math.max(U, String(H[h]).length), R = R && R != F ? "C" : F;
      }
      U > 250 && (U = 250), F = ((p[d] || {}).DBF || {}).type, F == "C" && p[d].DBF.len > U && (U = p[d].DBF.len), R == "B" && F == "N" && (R = "N", S[d] = p[d].DBF.dec, U = p[d].DBF.len), P[d] = R == "C" || F == "N" ? U : i[R] || 0, g += P[d], A[d] = R;
    }
    var y = m.next(32);
    for (y.write_shift(4, 318902576), y.write_shift(4, v.length), y.write_shift(2, 296 + 32 * _), y.write_shift(2, g), d = 0; d < 4; ++d) y.write_shift(4, 0);
    var W = +t[
      /*::String(*/
      Ur
      /*::)*/
    ] || 3;
    for (y.write_shift(4, 0 | W << 8), e[W] != +o.codepage && (o.codepage && console.error("DBF Unsupported codepage " + Ur + ", using 1252"), Ur = 1252), d = 0, h = 0; d < l.length; ++d)
      if (l[d] != null) {
        var k = m.next(32), j = (l[d].slice(-10) + "\0\0\0\0\0\0\0\0\0\0\0").slice(0, 11);
        k.write_shift(1, j, "sbcs"), k.write_shift(1, A[d] == "?" ? "C" : A[d], "sbcs"), k.write_shift(4, h), k.write_shift(1, P[d] || i[A[d]] || 0), k.write_shift(1, S[d] || 0), k.write_shift(1, 2), k.write_shift(4, 0), k.write_shift(1, 0), k.write_shift(4, 0), k.write_shift(4, 0), h += P[d] || i[A[d]] || 0;
      }
    var me = m.next(264);
    for (me.write_shift(4, 13), d = 0; d < 65; ++d) me.write_shift(4, 0);
    for (d = 0; d < v.length; ++d) {
      var Z = m.next(g);
      for (Z.write_shift(1, 0), h = 0; h < l.length; ++h)
        if (l[h] != null)
          switch (A[h]) {
            case "L":
              Z.write_shift(1, v[d][h] == null ? 63 : v[d][h] ? 84 : 70);
              break;
            case "B":
              Z.write_shift(8, v[d][h] || 0, "f");
              break;
            case "N":
              var xe = "0";
              for (typeof v[d][h] == "number" && (xe = v[d][h].toFixed(S[h] || 0)), xe.length > P[h] && (xe = xe.slice(0, P[h])), _ = 0; _ < P[h] - xe.length; ++_) Z.write_shift(1, 32);
              Z.write_shift(1, xe, "sbcs");
              break;
            case "D":
              v[d][h] ? (Z.write_shift(4, ("0000" + v[d][h].getFullYear()).slice(-4), "sbcs"), Z.write_shift(2, ("00" + (v[d][h].getMonth() + 1)).slice(-2), "sbcs"), Z.write_shift(2, ("00" + v[d][h].getDate()).slice(-2), "sbcs")) : Z.write_shift(8, "00000000", "sbcs");
              break;
            case "C":
              var fe = Z.l, q = String(v[d][h] != null ? v[d][h] : "").slice(0, P[h]);
              for (Z.write_shift(1, q, "cpstr"), fe += P[h] - Z.l, _ = 0; _ < fe; ++_) Z.write_shift(1, 32);
              break;
          }
    }
    return Ur = u, m.next(1).write_shift(1, 26), m.end();
  }
  return {
    to_workbook: a,
    to_sheet: n,
    from_sheet: f
  };
})(), Gl = /* @__PURE__ */ (function() {
  var e = {
    AA: "À",
    BA: "Á",
    CA: "Â",
    DA: 195,
    HA: "Ä",
    JA: 197,
    AE: "È",
    BE: "É",
    CE: "Ê",
    HE: "Ë",
    AI: "Ì",
    BI: "Í",
    CI: "Î",
    HI: "Ï",
    AO: "Ò",
    BO: "Ó",
    CO: "Ô",
    DO: 213,
    HO: "Ö",
    AU: "Ù",
    BU: "Ú",
    CU: "Û",
    HU: "Ü",
    Aa: "à",
    Ba: "á",
    Ca: "â",
    Da: 227,
    Ha: "ä",
    Ja: 229,
    Ae: "è",
    Be: "é",
    Ce: "ê",
    He: "ë",
    Ai: "ì",
    Bi: "í",
    Ci: "î",
    Hi: "ï",
    Ao: "ò",
    Bo: "ó",
    Co: "ô",
    Do: 245,
    Ho: "ö",
    Au: "ù",
    Bu: "ú",
    Cu: "û",
    Hu: "ü",
    KC: "Ç",
    Kc: "ç",
    q: "æ",
    z: "œ",
    a: "Æ",
    j: "Œ",
    DN: 209,
    Dn: 241,
    Hy: 255,
    S: 169,
    c: 170,
    R: 174,
    "B ": 180,
    0: 176,
    1: 177,
    2: 178,
    3: 179,
    5: 181,
    6: 182,
    7: 183,
    Q: 185,
    k: 186,
    b: 208,
    i: 216,
    l: 222,
    s: 240,
    y: 248,
    "!": 161,
    '"': 162,
    "#": 163,
    "(": 164,
    "%": 165,
    "'": 167,
    "H ": 168,
    "+": 171,
    ";": 187,
    "<": 188,
    "=": 189,
    ">": 190,
    "?": 191,
    "{": 223
  }, t = new RegExp("\x1BN(" + zr(e).join("|").replace(/\|\|\|/, "|\\||").replace(/([?()+])/g, "\\$1").replace("{", "\\{") + "|\\|)", "gm");
  try {
    t = new RegExp("\x1BN(" + zr(e).join("|").replace(/\|\|\|/, "|\\||").replace(/([?()+])/g, "\\$1") + "|\\|)", "gm");
  } catch {
  }
  var r = function(l, v) {
    var p = e[v];
    return typeof p == "number" ? ti(p) : p;
  }, n = function(l, v, p) {
    var d = v.charCodeAt(0) - 32 << 4 | p.charCodeAt(0) - 48;
    return d == 59 ? l : ti(d);
  };
  e["|"] = 254;
  var a = function(l) {
    return l.replace(/\n/g, "\x1B :").replace(/\r/g, "\x1B =");
  };
  function i(l, v) {
    switch (v.type) {
      case "base64":
        return f(Rr(l), v);
      case "binary":
        return f(l, v);
      case "buffer":
        return f(Pe && Buffer.isBuffer(l) ? l.toString("binary") : nt(l), v);
      case "array":
        return f(Ft(l), v);
    }
    throw new Error("Unrecognized type " + v.type);
  }
  function f(l, v) {
    var p = l.split(/[\n\r]+/), d = -1, h = -1, _ = 0, g = 0, E = [], A = [], P = null, S = {}, R = [], F = [], U = [], H = 0, y, W = { Workbook: { WBProps: {}, Names: [] } };
    for (+v.codepage >= 0 && Gr(+v.codepage); _ !== p.length; ++_) {
      H = 0;
      var k = p[_].trim().replace(/\x1B([\x20-\x2F])([\x30-\x3F])/g, n).replace(t, r), j = k.replace(/;;/g, "\0").split(";").map(function(z) {
        return z.replace(/\u0000/g, ";");
      }), me = j[0], Z;
      if (k.length > 0) switch (me) {
        case "ID":
          break;
        /* header */
        case "E":
          break;
        /* EOF */
        case "B":
          break;
        /* dimensions */
        case "O":
          for (g = 1; g < j.length; ++g) switch (j[g].charAt(0)) {
            case "V":
              {
                var xe = parseInt(j[g].slice(1), 10);
                xe >= 1 && xe <= 4 && (W.Workbook.WBProps.date1904 = !0);
              }
              break;
          }
          break;
        case "W":
          break;
        /* window */
        case "P":
          switch (j[1].charAt(0)) {
            case "P":
              A.push(k.slice(3).replace(/;;/g, ";"));
              break;
          }
          break;
        case "NN":
          {
            var fe = { Sheet: 0 };
            for (g = 1; g < j.length; ++g) switch (j[g].charAt(0)) {
              case "N":
                fe.Name = j[g].slice(1);
                break;
              case "E":
                fe.Ref = (v && v.sheet || "Sheet1") + "!" + Tt(j[g].slice(1));
                break;
            }
            W.Workbook.Names.push(fe);
          }
          break;
        // case 'NE': // ??
        // case 'NU': // ??
        case "C":
          var q = !1, J = !1, Y = !1, pe = !1, ce = -1, de = -1, Te = "", Ce = "z", O = "";
          for (g = 1; g < j.length; ++g) switch (j[g].charAt(0)) {
            case "A":
              O = j[g].slice(1);
              break;
            // TODO: comment
            case "X":
              h = parseInt(j[g].slice(1), 10) - 1, J = !0;
              break;
            case "Y":
              for (d = parseInt(j[g].slice(1), 10) - 1, J || (h = 0), y = E.length; y <= d; ++y) E[y] = [];
              break;
            case "K":
              Z = j[g].slice(1), Z.charAt(0) === '"' ? (Z = Z.slice(1, Z.length - 1), Ce = "s") : Z === "TRUE" || Z === "FALSE" ? (Z = Z === "TRUE", Ce = "b") : Z.charAt(0) == "#" && ur[Z] != null ? (Ce = "e", Z = ur[Z]) : isNaN(Dr(Z)) || (Z = Dr(Z), Ce = "n", P !== null && $r(P) && v.cellDates && (Z = ot(W.Workbook.WBProps.date1904 ? Z + 1462 : Z), Ce = typeof Z == "number" ? "n" : "d")), q = !0;
              break;
            case "E":
              pe = !0, Te = Tt(j[g].slice(1), { r: d, c: h });
              break;
            case "S":
              Y = !0;
              break;
            case "G":
              break;
            // unknown
            case "R":
              ce = parseInt(j[g].slice(1), 10) - 1;
              break;
            case "C":
              de = parseInt(j[g].slice(1), 10) - 1;
              break;
            // case 'P': // ??
            // case 'D': // ??
            default:
              if (v && v.WTF) throw new Error("SYLK bad record " + k);
          }
          if (q && (E[d][h] ? (E[d][h].t = Ce, E[d][h].v = Z) : E[d][h] = { t: Ce, v: Z }, P && (E[d][h].z = P), v.cellText !== !1 && P && (E[d][h].w = Nr(E[d][h].z, E[d][h].v, { date1904: W.Workbook.WBProps.date1904 })), P = null), Y) {
            if (pe) throw new Error("SYLK shared formula cannot have own formula");
            var K = ce > -1 && E[ce][de];
            if (!K || !K[1]) throw new Error("SYLK shared formula cannot find base");
            Te = gs(K[1], { r: d - ce, c: h - de });
          }
          Te && (E[d][h] ? E[d][h].f = Te : E[d][h] = { t: "n", f: Te }), O && (E[d][h] || (E[d][h] = { t: "z" }), E[d][h].c = [{ a: "SheetJSYLK", t: O }]);
          break;
        case "F":
          var X = 0;
          for (g = 1; g < j.length; ++g) switch (j[g].charAt(0)) {
            case "X":
              h = parseInt(j[g].slice(1), 10) - 1, ++X;
              break;
            case "Y":
              for (d = parseInt(j[g].slice(1), 10) - 1, y = E.length; y <= d; ++y) E[y] = [];
              break;
            case "M":
              H = parseInt(j[g].slice(1), 10) / 20;
              break;
            case "F":
              break;
            /* ??? */
            case "G":
              break;
            /* hide grid */
            case "P":
              P = A[parseInt(j[g].slice(1), 10)];
              break;
            case "S":
              break;
            /* cell style */
            case "D":
              break;
            /* column */
            case "N":
              break;
            /* font */
            case "W":
              for (U = j[g].slice(1).split(" "), y = parseInt(U[0], 10); y <= parseInt(U[1], 10); ++y)
                H = parseInt(U[2], 10), F[y - 1] = H === 0 ? { hidden: !0 } : { wch: H };
              break;
            case "C":
              h = parseInt(j[g].slice(1), 10) - 1, F[h] || (F[h] = {});
              break;
            case "R":
              d = parseInt(j[g].slice(1), 10) - 1, R[d] || (R[d] = {}), H > 0 ? (R[d].hpt = H, R[d].hpx = da(H)) : H === 0 && (R[d].hidden = !0);
              break;
            // case 'K': // ??
            // case 'E': // ??
            default:
              if (v && v.WTF) throw new Error("SYLK bad record " + k);
          }
          X < 1 && (P = null);
          break;
        default:
          if (v && v.WTF) throw new Error("SYLK bad record " + k);
      }
    }
    return R.length > 0 && (S["!rows"] = R), F.length > 0 && (S["!cols"] = F), F.forEach(function(z) {
      Ht(z);
    }), v && v.sheetRows && (E = E.slice(0, v.sheetRows)), [E, S, W];
  }
  function s(l, v) {
    var p = i(l, v), d = p[0], h = p[1], _ = p[2], g = nr(v);
    g.date1904 = (((_ || {}).Workbook || {}).WBProps || {}).date1904;
    var E = Vt(d, g);
    zr(h).forEach(function(P) {
      E[P] = h[P];
    });
    var A = xt(E, v);
    return zr(_).forEach(function(P) {
      A[P] = _[P];
    }), A.bookType = "sylk", A;
  }
  function c(l, v, p, d, h, _) {
    var g = "C;Y" + (p + 1) + ";X" + (d + 1) + ";K";
    switch (l.t) {
      case "n":
        g += isFinite(l.v) ? l.v || 0 : Sr[isNaN(l.v) ? 36 : 7], l.f && !l.F && (g += ";E" + yh(l.f, { r: p, c: d }));
        break;
      case "b":
        g += l.v ? "TRUE" : "FALSE";
        break;
      case "e":
        g += l.w || Sr[l.v] || l.v;
        break;
      case "d":
        g += sr(dr(l.v, _), _);
        break;
      case "s":
        g += '"' + (l.v == null ? "" : String(l.v)).replace(/"/g, "").replace(/;/g, ";;") + '"';
        break;
    }
    return g;
  }
  function o(l, v, p) {
    var d = "C;Y" + (v + 1) + ";X" + (p + 1) + ";A";
    return d += a(l.map(function(h) {
      return h.t;
    }).join("")), d;
  }
  function u(l, v) {
    v.forEach(function(p, d) {
      var h = "F;W" + (d + 1) + " " + (d + 1) + " ";
      p.hidden ? h += "0" : (typeof p.width == "number" && !p.wpx && (p.wpx = Za(p.width)), typeof p.wpx == "number" && !p.wch && (p.wch = Qa(p.wpx)), typeof p.wch == "number" && (h += Math.round(p.wch))), h.charAt(h.length - 1) != " " && l.push(h);
    });
  }
  function m(l, v) {
    v.forEach(function(p, d) {
      var h = "F;";
      p.hidden ? h += "M0;" : p.hpt ? h += "M" + 20 * p.hpt + ";" : p.hpx && (h += "M" + 20 * ms(p.hpx) + ";"), h.length > 2 && l.push(h + "R" + (d + 1));
    });
  }
  function x(l, v, p) {
    v || (v = {}), v._formats = ["General"];
    var d = ["ID;PSheetJS;N;E"], h = [], _ = Je(l["!ref"] || "A1"), g, E = l["!data"] != null, A = `\r
`, P = (((p || {}).Workbook || {}).WBProps || {}).date1904, S = "General";
    d.push("P;PGeneral");
    var R = _.s.r, F = _.s.c, U = [];
    if (l["!ref"]) {
      for (R = _.s.r; R <= _.e.r; ++R)
        if (!(E && !l["!data"][R])) {
          for (U = [], F = _.s.c; F <= _.e.c; ++F)
            g = E ? l["!data"][R][F] : l[He(F) + Ge(R)], !(!g || !g.c) && U.push(o(g.c, R, F));
          U.length && h.push(U.join(A));
        }
    }
    if (l["!ref"]) {
      for (R = _.s.r; R <= _.e.r; ++R)
        if (!(E && !l["!data"][R])) {
          for (U = [], F = _.s.c; F <= _.e.c; ++F)
            if (g = E ? l["!data"][R][F] : l[He(F) + Ge(R)], !(!g || g.v == null && (!g.f || g.F))) {
              if ((g.z || (g.t == "d" ? be[14] : "General")) != S) {
                var H = v._formats.indexOf(g.z);
                H == -1 && (v._formats.push(g.z), H = v._formats.length - 1, d.push("P;P" + g.z.replace(/;/g, ";;"))), U.push("F;P" + H + ";Y" + (R + 1) + ";X" + (F + 1));
              }
              U.push(c(g, l, R, F, v, P));
            }
          h.push(U.join(A));
        }
    }
    return d.push("F;P0;DG0G8;M255"), l["!cols"] && u(d, l["!cols"]), l["!rows"] && m(d, l["!rows"]), l["!ref"] && d.push("B;Y" + (_.e.r - _.s.r + 1) + ";X" + (_.e.c - _.s.c + 1) + ";D" + [_.s.c, _.s.r, _.e.c, _.e.r].join(" ")), d.push("O;L;D;B" + (P ? ";V4" : "") + ";K47;G100 0.001"), delete v._formats, d.join(A) + A + h.join(A) + A + "E" + A;
  }
  return {
    to_workbook: s,
    from_sheet: x
  };
})(), Xl = /* @__PURE__ */ (function() {
  function e(s, c) {
    switch (c.type) {
      case "base64":
        return t(Rr(s), c);
      case "binary":
        return t(s, c);
      case "buffer":
        return t(Pe && Buffer.isBuffer(s) ? s.toString("binary") : nt(s), c);
      case "array":
        return t(Ft(s), c);
    }
    throw new Error("Unrecognized type " + c.type);
  }
  function t(s, c) {
    for (var o = s.split(`
`), u = -1, m = -1, x = 0, l = []; x !== o.length; ++x) {
      if (o[x].trim() === "BOT") {
        l[++u] = [], m = 0;
        continue;
      }
      if (!(u < 0)) {
        var v = o[x].trim().split(","), p = v[0], d = v[1];
        ++x;
        for (var h = o[x] || ""; (h.match(/["]/g) || []).length & 1 && x < o.length - 1; ) h += `
` + o[++x];
        switch (h = h.trim(), +p) {
          case -1:
            if (h === "BOT") {
              l[++u] = [], m = 0;
              continue;
            } else if (h !== "EOD") throw new Error("Unrecognized DIF special command " + h);
            break;
          case 0:
            h === "TRUE" ? l[u][m] = !0 : h === "FALSE" ? l[u][m] = !1 : isNaN(Dr(d)) ? isNaN(la(d).getDate()) ? l[u][m] = d : (l[u][m] = dr(d), c && c.UTC || (l[u][m] = St(l[u][m]))) : l[u][m] = Dr(d), ++m;
            break;
          case 1:
            h = h.slice(1, h.length - 1), h = h.replace(/""/g, '"'), h && h.match(/^=".*"$/) && (h = h.slice(2, -1)), l[u][m++] = h !== "" ? h : null;
            break;
        }
        if (h === "EOD") break;
      }
    }
    return c && c.sheetRows && (l = l.slice(0, c.sheetRows)), l;
  }
  function r(s, c) {
    return Vt(e(s, c), c);
  }
  function n(s, c) {
    var o = xt(r(s, c), c);
    return o.bookType = "dif", o;
  }
  function a(s, c) {
    return "0," + String(s) + `\r
` + c;
  }
  function i(s) {
    return `1,0\r
"` + s.replace(/"/g, '""') + '"';
  }
  function f(s) {
    if (!s["!ref"]) throw new Error("Cannot export empty sheet to DIF");
    for (var c = Je(s["!ref"]), o = s["!data"] != null, u = [
      `TABLE\r
0,1\r
"sheetjs"\r
`,
      `VECTORS\r
0,` + (c.e.r - c.s.r + 1) + `\r
""\r
`,
      `TUPLES\r
0,` + (c.e.c - c.s.c + 1) + `\r
""\r
`,
      `DATA\r
0,0\r
""\r
`
    ], m = c.s.r; m <= c.e.r; ++m) {
      for (var x = o ? s["!data"][m] : [], l = `-1,0\r
BOT\r
`, v = c.s.c; v <= c.e.c; ++v) {
        var p = o ? x && x[v] : s[We({ r: m, c: v })];
        if (p == null) {
          l += `1,0\r
""\r
`;
          continue;
        }
        switch (p.t) {
          case "n":
            p.w != null ? l += "0," + p.w + `\r
V` : p.v != null ? l += a(p.v, "V") : p.f != null && !p.F ? l += i("=" + p.f) : l += `1,0\r
""`;
            break;
          case "b":
            l += p.v ? a(1, "TRUE") : a(0, "FALSE");
            break;
          case "s":
            l += i(isNaN(+p.v) ? p.v : '="' + p.v + '"');
            break;
          case "d":
            p.w || (p.w = Nr(p.z || be[14], sr(dr(p.v)))), l += a(p.w, "V");
            break;
          default:
            l += `1,0\r
""`;
        }
        l += `\r
`;
      }
      u.push(l);
    }
    return u.join("") + `-1,0\r
EOD`;
  }
  return {
    to_workbook: n,
    to_sheet: r,
    from_sheet: f
  };
})(), $l = /* @__PURE__ */ (function() {
  function e(m) {
    return m.replace(/\\b/g, "\\").replace(/\\c/g, ":").replace(/\\n/g, `
`);
  }
  function t(m) {
    return m.replace(/\\/g, "\\b").replace(/:/g, "\\c").replace(/\n/g, "\\n");
  }
  function r(m, x) {
    for (var l = m.split(`
`), v = -1, p = -1, d = 0, h = []; d !== l.length; ++d) {
      var _ = l[d].trim().split(":");
      if (_[0] === "cell") {
        var g = _r(_[1]);
        if (h.length <= g.r) for (v = h.length; v <= g.r; ++v) h[v] || (h[v] = []);
        switch (v = g.r, p = g.c, _[2]) {
          case "t":
            h[v][p] = e(_[3]);
            break;
          case "v":
            h[v][p] = +_[3];
            break;
          case "vtf":
            var E = _[_.length - 1];
          /* falls through */
          case "vtc":
            switch (_[3]) {
              case "nl":
                h[v][p] = !!+_[4];
                break;
              default:
                h[v][p] = _[_.length - 1].charAt(0) == "#" ? { t: "e", v: ur[_[_.length - 1]] } : +_[4];
                break;
            }
            _[2] == "vtf" && (h[v][p] = [h[v][p], E]);
        }
      }
    }
    return x && x.sheetRows && (h = h.slice(0, x.sheetRows)), h;
  }
  function n(m, x) {
    return Vt(r(m, x), x);
  }
  function a(m, x) {
    return xt(n(m, x), x);
  }
  var i = [
    "socialcalc:version:1.5",
    "MIME-Version: 1.0",
    "Content-Type: multipart/mixed; boundary=SocialCalcSpreadsheetControlSave"
  ].join(`
`), f = [
    "--SocialCalcSpreadsheetControlSave",
    "Content-type: text/plain; charset=UTF-8"
  ].join(`
`) + `
`, s = [
    "# SocialCalc Spreadsheet Control Save",
    "part:sheet"
  ].join(`
`), c = "--SocialCalcSpreadsheetControlSave--";
  function o(m) {
    if (!m || !m["!ref"]) return "";
    for (var x = [], l = [], v, p = "", d = It(m["!ref"]), h = m["!data"] != null, _ = d.s.r; _ <= d.e.r; ++_)
      for (var g = d.s.c; g <= d.e.c; ++g)
        if (p = We({ r: _, c: g }), v = h ? (m["!data"][_] || [])[g] : m[p], !(!v || v.v == null || v.t === "z")) {
          switch (l = ["cell", p, "t"], v.t) {
            case "s":
              l.push(t(v.v));
              break;
            case "b":
              l[2] = "vt" + (v.f ? "f" : "c"), l[3] = "nl", l[4] = v.v ? "1" : "0", l[5] = t(v.f || (v.v ? "TRUE" : "FALSE"));
              break;
            case "d":
              var E = sr(dr(v.v));
              l[2] = "vtc", l[3] = "nd", l[4] = "" + E, l[5] = v.w || Nr(v.z || be[14], E);
              break;
            case "n":
              isFinite(v.v) ? v.f ? (l[2] = "vtf", l[3] = "n", l[4] = v.v, l[5] = t(v.f)) : (l[2] = "v", l[3] = v.v) : (l[2] = "vt" + (v.f ? "f" : "c"), l[3] = "e" + Sr[isNaN(v.v) ? 36 : 7], l[4] = "0", l[5] = v.f || l[3].slice(1), l[6] = "e", l[7] = l[3].slice(1));
              break;
            case "e":
              continue;
          }
          x.push(l.join(":"));
        }
    return x.push("sheet:c:" + (d.e.c - d.s.c + 1) + ":r:" + (d.e.r - d.s.r + 1) + ":tvf:1"), x.push("valueformat:1:text-wiki"), x.join(`
`);
  }
  function u(m) {
    return [i, f, s, f, o(m), c].join(`
`);
  }
  return {
    to_workbook: a,
    to_sheet: n,
    from_sheet: u
  };
})(), ua = /* @__PURE__ */ (function() {
  function e(u, m, x, l, v) {
    v.raw ? m[x][l] = u : u === "" || (u === "TRUE" ? m[x][l] = !0 : u === "FALSE" ? m[x][l] = !1 : isNaN(Dr(u)) ? isNaN(la(u).getDate()) ? u.charCodeAt(0) == 35 && ur[u] != null ? m[x][l] = { t: "e", v: ur[u], w: u } : m[x][l] = u : m[x][l] = dr(u) : m[x][l] = Dr(u));
  }
  function t(u, m) {
    var x = m || {}, l = [];
    if (!u || u.length === 0) return l;
    for (var v = u.split(/[\r\n]/), p = v.length - 1; p >= 0 && v[p].length === 0; ) --p;
    for (var d = 10, h = 0, _ = 0; _ <= p; ++_)
      h = v[_].indexOf(" "), h == -1 ? h = v[_].length : h++, d = Math.max(d, h);
    for (_ = 0; _ <= p; ++_) {
      l[_] = [];
      var g = 0;
      for (e(v[_].slice(0, d).trim(), l, _, g, x), g = 1; g <= (v[_].length - d) / 10 + 1; ++g)
        e(v[_].slice(d + (g - 1) * 10, d + g * 10).trim(), l, _, g, x);
    }
    return x.sheetRows && (l = l.slice(0, x.sheetRows)), l;
  }
  var r = {
    44: ",",
    9: "	",
    59: ";",
    124: "|"
  }, n = {
    44: 3,
    9: 2,
    59: 1,
    124: 0
  };
  function a(u) {
    for (var m = {}, x = !1, l = 0, v = 0; l < u.length; ++l)
      (v = u.charCodeAt(l)) == 34 ? x = !x : !x && v in r && (m[v] = (m[v] || 0) + 1);
    v = [];
    for (l in m) Object.prototype.hasOwnProperty.call(m, l) && v.push([m[l], l]);
    if (!v.length) {
      m = n;
      for (l in m) Object.prototype.hasOwnProperty.call(m, l) && v.push([m[l], l]);
    }
    return v.sort(function(p, d) {
      return p[0] - d[0] || n[p[1]] - n[d[1]];
    }), r[v.pop()[1]] || 44;
  }
  function i(u, m) {
    var x = m || {}, l = "", v = {};
    x.dense && (v["!data"] = []);
    var p = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } };
    u.slice(0, 4) == "sep=" ? u.charCodeAt(5) == 13 && u.charCodeAt(6) == 10 ? (l = u.charAt(4), u = u.slice(7)) : u.charCodeAt(5) == 13 || u.charCodeAt(5) == 10 ? (l = u.charAt(4), u = u.slice(6)) : l = a(u.slice(0, 1024)) : x && x.FS ? l = x.FS : l = a(u.slice(0, 1024));
    var d = 0, h = 0, _ = 0, g = 0, E = 0, A = l.charCodeAt(0), P = !1, S = 0, R = u.charCodeAt(0), F = x.dateNF != null ? Uf(x.dateNF) : null;
    function U() {
      var H = u.slice(g, E);
      H.slice(-1) == "\r" && (H = H.slice(0, -1));
      var y = {};
      if (H.charAt(0) == '"' && H.charAt(H.length - 1) == '"' && (H = H.slice(1, -1).replace(/""/g, '"')), x.cellText !== !1 && (y.w = H), H.length === 0) y.t = "z";
      else if (x.raw)
        y.t = "s", y.v = H;
      else if (H.trim().length === 0)
        y.t = "s", y.v = H;
      else if (H.charCodeAt(0) == 61)
        H.charCodeAt(1) == 34 && H.charCodeAt(H.length - 1) == 34 ? (y.t = "s", y.v = H.slice(2, -1).replace(/""/g, '"')) : Ah(H) ? (y.t = "s", y.f = H.slice(1), y.v = H) : (y.t = "s", y.v = H);
      else if (H == "TRUE")
        y.t = "b", y.v = !0;
      else if (H == "FALSE")
        y.t = "b", y.v = !1;
      else if (!isNaN(_ = Dr(H)))
        y.t = "n", y.v = _;
      else if (!isNaN((_ = la(H)).getDate()) || F && H.match(F)) {
        if (y.z = x.dateNF || be[14], F && H.match(F)) {
          var W = zf(H, x.dateNF, H.match(F) || []);
          _ = dr(W), x && x.UTC === !1 && (_ = St(_));
        } else x && x.UTC === !1 ? _ = St(_) : x.cellText !== !1 && x.dateNF && (y.w = Nr(y.z, _));
        x.cellDates ? (y.t = "d", y.v = _) : (y.t = "n", y.v = sr(_)), x.cellNF || delete y.z;
      } else H.charCodeAt(0) == 35 && ur[H] != null ? (y.t = "e", y.w = H, y.v = ur[H]) : (y.t = "s", y.v = H);
      if (y.t == "z" || (x.dense ? (v["!data"][d] || (v["!data"][d] = []), v["!data"][d][h] = y) : v[We({ c: h, r: d })] = y), g = E + 1, R = u.charCodeAt(g), p.e.c < h && (p.e.c = h), p.e.r < d && (p.e.r = d), S == A) ++h;
      else if (h = 0, ++d, x.sheetRows && x.sheetRows <= d) return !0;
    }
    e: for (; E < u.length; ++E) switch (S = u.charCodeAt(E)) {
      case 34:
        R === 34 && (P = !P);
        break;
      case 13:
        if (P) break;
        u.charCodeAt(E + 1) == 10 && ++E;
      /* falls through */
      case A:
      case 10:
        if (!P && U()) break e;
        break;
    }
    return E - g > 0 && U(), v["!ref"] = Le(p), v;
  }
  function f(u, m) {
    return !(m && m.PRN) || m.FS || u.slice(0, 4) == "sep=" || u.indexOf("	") >= 0 || u.indexOf(",") >= 0 || u.indexOf(";") >= 0 ? i(u, m) : Vt(t(u, m), m);
  }
  function s(u, m) {
    var x = "", l = m.type == "string" ? [0, 0, 0, 0] : Jn(u, m);
    switch (m.type) {
      case "base64":
        x = Rr(u);
        break;
      case "binary":
        x = u;
        break;
      case "buffer":
        m.codepage == 65001 ? x = u.toString("utf8") : (m.codepage, x = Pe && Buffer.isBuffer(u) ? u.toString("binary") : nt(u));
        break;
      case "array":
        x = Ft(u);
        break;
      case "string":
        x = u;
        break;
      default:
        throw new Error("Unrecognized type " + m.type);
    }
    return l[0] == 239 && l[1] == 187 && l[2] == 191 ? x = Xe(x.slice(3)) : m.type != "string" && m.type != "buffer" && m.codepage == 65001 ? x = Xe(x) : m.type == "binary", x.slice(0, 19) == "socialcalc:version:" ? $l.to_sheet(m.type == "string" ? x : Xe(x), m) : f(x, m);
  }
  function c(u, m) {
    return xt(s(u, m), m);
  }
  function o(u) {
    var m = [];
    if (!u["!ref"]) return "";
    for (var x = Je(u["!ref"]), l, v = u["!data"] != null, p = x.s.r; p <= x.e.r; ++p) {
      for (var d = [], h = x.s.c; h <= x.e.c; ++h) {
        var _ = We({ r: p, c: h });
        if (l = v ? (u["!data"][p] || [])[h] : u[_], !l || l.v == null) {
          d.push("          ");
          continue;
        }
        for (var g = (l.w || (ut(l), l.w) || "").slice(0, 10); g.length < 10; ) g += " ";
        d.push(g + (h === 0 ? " " : ""));
      }
      m.push(d.join(""));
    }
    return m.join(`
`);
  }
  return {
    to_workbook: c,
    to_sheet: s,
    from_sheet: o
  };
})();
function jl(e, t) {
  var r = t || {}, n = !!r.WTF;
  r.WTF = !0;
  try {
    var a = Gl.to_workbook(e, r);
    return r.WTF = n, a;
  } catch (i) {
    if (r.WTF = n, i.message.indexOf("SYLK bad record ID") == -1 && n) throw i;
    return ua.to_workbook(e, t);
  }
}
var aa = /* @__PURE__ */ (function() {
  function e(O, K, X) {
    if (O) {
      ir(O, O.l || 0);
      for (var z = X.Enum || pe; O.l < O.length; ) {
        var he = O.read_shift(2), N = z[he] || z[65535], w = O.read_shift(2), Q = O.l + w, V = N.f && N.f(O, w, X);
        if (O.l = Q, K(V, N, he)) return;
      }
    }
  }
  function t(O, K) {
    switch (K.type) {
      case "base64":
        return n(Ir(Rr(O)), K);
      case "binary":
        return n(Ir(O), K);
      case "buffer":
      case "array":
        return n(O, K);
    }
    throw "Unsupported type " + K.type;
  }
  var r = [
    "mmmm",
    "dd-mmm-yyyy",
    "dd-mmm",
    "mmm-yyyy",
    "@",
    // "text"?
    "mm/dd",
    "hh:mm:ss AM/PM",
    // 7
    "hh:mm AM/PM",
    "mm/dd/yyyy",
    "mm/dd",
    "hh:mm:ss",
    "hh:mm"
    // 12
  ];
  function n(O, K) {
    if (!O) return O;
    var X = K || {}, z = {}, he = "Sheet1", N = "", w = 0, Q = {}, V = [], I = [], C = [];
    X.dense && (C = z["!data"] = []);
    var G = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }, oe = X.sheetRows || 0, le = {};
    if (O[4] == 81 && O[5] == 80 && O[6] == 87) return Ce(O, K);
    if (O[2] == 0 && (O[3] == 8 || O[3] == 9) && O.length >= 16 && O[14] == 5 && O[15] === 108)
      throw new Error("Unsupported Works 3 for Mac file");
    if (O[2] == 2)
      X.Enum = pe, e(O, function(re, Fe, Oe) {
        switch (Oe) {
          case 0:
            X.vers = re, re >= 4096 && (X.qpro = !0);
            break;
          case 255:
            X.vers = re, X.works = !0;
            break;
          case 6:
            G = re;
            break;
          /* RANGE */
          case 204:
            re && (N = re);
            break;
          /* SHEETNAMECS */
          case 222:
            N = re;
            break;
          /* SHEETNAMELP */
          case 15:
          /* LABEL */
          case 51:
            (!X.qpro && !X.works || Oe == 51) && re[1].v.charCodeAt(0) < 48 && (re[1].v = re[1].v.slice(1)), (X.works || X.works2) && (re[1].v = re[1].v.replace(/\r\n/g, `
`));
          /* falls through */
          case 13:
          /* INTEGER */
          case 14:
          /* NUMBER */
          case 16:
            (re[2] & 112) == 112 && (re[2] & 15) > 1 && (re[2] & 15) < 15 && (re[1].z = X.dateNF || r[(re[2] & 15) - 1] || be[14], X.cellDates && (re[1].v = ot(re[1].v), re[1].t = typeof re[1].v == "number" ? "n" : "d")), X.qpro && re[3] > w && (z["!ref"] = Le(G), Q[he] = z, V.push(he), z = {}, X.dense && (C = z["!data"] = []), G = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }, w = re[3], he = N || "Sheet" + (w + 1), N = "");
            var Se = X.dense ? (C[re[0].r] || [])[re[0].c] : z[We(re[0])];
            if (Se) {
              Se.t = re[1].t, Se.v = re[1].v, re[1].z != null && (Se.z = re[1].z), re[1].f != null && (Se.f = re[1].f), le = Se;
              break;
            }
            X.dense ? (C[re[0].r] || (C[re[0].r] = []), C[re[0].r][re[0].c] = re[1]) : z[We(re[0])] = re[1], le = re[1];
            break;
          case 21509:
            X.works2 = !0;
            break;
          case 21506:
            re == 5281 && (le.z = "hh:mm:ss", X.cellDates && le.t == "n" && (le.v = ot(le.v), le.t = typeof le.v == "number" ? "n" : "d"));
            break;
        }
      }, X);
    else if (O[2] == 26 || O[2] == 14)
      X.Enum = ce, O[2] == 14 && (X.qpro = !0, O.l = 0), e(O, function(re, Fe, Oe) {
        switch (Oe) {
          case 204:
            he = re;
            break;
          /* SHEETNAMECS */
          case 22:
            re[1].v.charCodeAt(0) < 48 && (re[1].v = re[1].v.slice(1)), re[1].v = re[1].v.replace(/\x0F./g, function(Se) {
              return String.fromCharCode(Se.charCodeAt(1) - 32);
            }).replace(/\r\n/g, `
`);
          /* falls through */
          case 23:
          /* NUMBER17 */
          case 24:
          /* NUMBER18 */
          case 25:
          /* FORMULA19 */
          case 37:
          /* NUMBER25 */
          case 39:
          /* NUMBER27 */
          case 40:
            if (re[3] > w && (z["!ref"] = Le(G), Q[he] = z, V.push(he), z = {}, X.dense && (C = z["!data"] = []), G = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }, w = re[3], he = "Sheet" + (w + 1)), oe > 0 && re[0].r >= oe) break;
            X.dense ? (C[re[0].r] || (C[re[0].r] = []), C[re[0].r][re[0].c] = re[1]) : z[We(re[0])] = re[1], G.e.c < re[0].c && (G.e.c = re[0].c), G.e.r < re[0].r && (G.e.r = re[0].r);
            break;
          case 27:
            re[14e3] && (I[re[14e3][0]] = re[14e3][1]);
            break;
          case 1537:
            I[re[0]] = re[1], re[0] == w && (he = re[1]);
            break;
        }
      }, X);
    else throw new Error("Unrecognized LOTUS BOF " + O[2]);
    if (z["!ref"] = Le(G), Q[N || he] = z, V.push(N || he), !I.length) return { SheetNames: V, Sheets: Q };
    for (var ee = {}, se = [], ve = 0; ve < I.length; ++ve) Q[V[ve]] ? (se.push(I[ve] || V[ve]), ee[I[ve]] = Q[I[ve]] || Q[V[ve]]) : (se.push(I[ve]), ee[I[ve]] = { "!ref": "A1" });
    return { SheetNames: se, Sheets: ee };
  }
  function a(O, K) {
    var X = K || {};
    if (+X.codepage >= 0 && Gr(+X.codepage), X.type == "string") throw new Error("Cannot write WK1 to JS string");
    var z = Tn();
    if (!O["!ref"]) throw new Error("Cannot export empty sheet to WK1");
    var he = Je(O["!ref"]), N = O["!data"] != null, w = [];
    br(z, 0, f(1030)), br(z, 6, o(he));
    for (var Q = Math.min(he.e.r, 8191), V = he.s.c; V <= he.e.c; ++V) w[V] = He(V);
    for (var I = he.s.r; I <= Q; ++I) {
      var C = Ge(I);
      for (V = he.s.c; V <= he.e.c; ++V) {
        var G = N ? (O["!data"][I] || [])[V] : O[w[V] + C];
        if (!(!G || G.t == "z"))
          switch (G.t) {
            case "n":
              (G.v | 0) == G.v && G.v >= -32768 && G.v <= 32767 ? br(z, 13, d(I, V, G)) : br(z, 14, _(I, V, G));
              break;
            case "d":
              var oe = sr(G.v);
              (oe | 0) == oe && oe >= -32768 && oe <= 32767 ? br(z, 13, d(I, V, { v: oe, z: G.z || be[14] })) : br(z, 14, _(I, V, { v: oe, z: G.z || be[14] }));
              break;
            default:
              var le = ut(G);
              br(z, 15, l(I, V, le.slice(0, 239)));
          }
      }
    }
    return br(z, 1), z.end();
  }
  function i(O, K) {
    var X = K || {};
    if (+X.codepage >= 0 && Gr(+X.codepage), X.type == "string") throw new Error("Cannot write WK3 to JS string");
    var z = Tn();
    br(z, 0, s(O));
    for (var he = 0, N = 0; he < O.SheetNames.length; ++he) (O.Sheets[O.SheetNames[he]] || {})["!ref"] && br(z, 27, Y(O.SheetNames[he], N++));
    var w = 0;
    for (he = 0; he < O.SheetNames.length; ++he) {
      var Q = O.Sheets[O.SheetNames[he]];
      if (!(!Q || !Q["!ref"])) {
        for (var V = Je(Q["!ref"]), I = Q["!data"] != null, C = [], G = Math.min(V.e.r, 8191), oe = V.s.r; oe <= G; ++oe)
          for (var le = Ge(oe), ee = V.s.c; ee <= V.e.c; ++ee) {
            oe === V.s.r && (C[ee] = He(ee));
            var se = C[ee] + le, ve = I ? (Q["!data"][oe] || [])[ee] : Q[se];
            if (!(!ve || ve.t == "z"))
              if (ve.t == "n")
                br(z, 23, W(oe, ee, w, ve.v));
              else {
                var re = ut(ve);
                br(z, 22, U(oe, ee, w, re.slice(0, 239)));
              }
          }
        ++w;
      }
    }
    return br(z, 1), z.end();
  }
  function f(O) {
    var K = ar(2);
    return K.write_shift(2, O), K;
  }
  function s(O) {
    var K = ar(26);
    K.write_shift(2, 4096), K.write_shift(2, 4), K.write_shift(4, 0);
    for (var X = 0, z = 0, he = 0, N = 0; N < O.SheetNames.length; ++N) {
      var w = O.SheetNames[N], Q = O.Sheets[w];
      if (!(!Q || !Q["!ref"])) {
        ++he;
        var V = It(Q["!ref"]);
        X < V.e.r && (X = V.e.r), z < V.e.c && (z = V.e.c);
      }
    }
    return X > 8191 && (X = 8191), K.write_shift(2, X), K.write_shift(1, he), K.write_shift(1, z), K.write_shift(2, 0), K.write_shift(2, 0), K.write_shift(1, 1), K.write_shift(1, 2), K.write_shift(4, 0), K.write_shift(4, 0), K;
  }
  function c(O, K, X) {
    var z = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } };
    return K == 8 && X.qpro ? (z.s.c = O.read_shift(1), O.l++, z.s.r = O.read_shift(2), z.e.c = O.read_shift(1), O.l++, z.e.r = O.read_shift(2), z) : (z.s.c = O.read_shift(2), z.s.r = O.read_shift(2), K == 12 && X.qpro && (O.l += 2), z.e.c = O.read_shift(2), z.e.r = O.read_shift(2), K == 12 && X.qpro && (O.l += 2), z.s.c == 65535 && (z.s.c = z.e.c = z.s.r = z.e.r = 0), z);
  }
  function o(O) {
    var K = ar(8);
    return K.write_shift(2, O.s.c), K.write_shift(2, O.s.r), K.write_shift(2, O.e.c), K.write_shift(2, O.e.r), K;
  }
  function u(O, K, X) {
    var z = [{ c: 0, r: 0 }, { t: "n", v: 0 }, 0, 0];
    return X.qpro && X.vers != 20768 ? (z[0].c = O.read_shift(1), z[3] = O.read_shift(1), z[0].r = O.read_shift(2), O.l += 2) : X.works ? (z[0].c = O.read_shift(2), z[0].r = O.read_shift(2), z[2] = O.read_shift(2)) : (z[2] = O.read_shift(1), z[0].c = O.read_shift(2), z[0].r = O.read_shift(2)), z;
  }
  function m(O) {
    return O.z && $r(O.z) ? 240 | (r.indexOf(O.z) + 1 || 2) : 255;
  }
  function x(O, K, X) {
    var z = O.l + K, he = u(O, K, X);
    if (he[1].t = "s", (X.vers & 65534) == 20768) {
      O.l++;
      var N = O.read_shift(1);
      return he[1].v = O.read_shift(N, "utf8"), he;
    }
    return X.qpro && O.l++, he[1].v = O.read_shift(z - O.l, "cstr"), he;
  }
  function l(O, K, X) {
    var z = ar(7 + X.length);
    z.write_shift(1, 255), z.write_shift(2, K), z.write_shift(2, O), z.write_shift(1, 39);
    for (var he = 0; he < z.length; ++he) {
      var N = X.charCodeAt(he);
      z.write_shift(1, N >= 128 ? 95 : N);
    }
    return z.write_shift(1, 0), z;
  }
  function v(O, K, X) {
    var z = O.l + K, he = u(O, K, X);
    if (he[1].t = "s", X.vers == 20768) {
      var N = O.read_shift(1);
      return he[1].v = O.read_shift(N, "utf8"), he;
    }
    return he[1].v = O.read_shift(z - O.l, "cstr"), he;
  }
  function p(O, K, X) {
    var z = u(O, K, X);
    return z[1].v = O.read_shift(2, "i"), z;
  }
  function d(O, K, X) {
    var z = ar(7);
    return z.write_shift(1, m(X)), z.write_shift(2, K), z.write_shift(2, O), z.write_shift(2, X.v, "i"), z;
  }
  function h(O, K, X) {
    var z = u(O, K, X);
    return z[1].v = O.read_shift(8, "f"), z;
  }
  function _(O, K, X) {
    var z = ar(13);
    return z.write_shift(1, m(X)), z.write_shift(2, K), z.write_shift(2, O), z.write_shift(8, X.v, "f"), z;
  }
  function g(O, K, X) {
    var z = O.l + K, he = u(O, K, X);
    if (he[1].v = O.read_shift(8, "f"), X.qpro) O.l = z;
    else {
      var N = O.read_shift(2);
      S(O.slice(O.l, O.l + N), he), O.l += N;
    }
    return he;
  }
  function E(O, K, X) {
    var z = K & 32768;
    return K &= -32769, K = (z ? O : 0) + (K >= 8192 ? K - 16384 : K), (z ? "" : "$") + (X ? He(K) : Ge(K));
  }
  var A = {
    31: ["NA", 0],
    // 0x20: ["ERR", 0],
    33: ["ABS", 1],
    34: ["TRUNC", 1],
    35: ["SQRT", 1],
    36: ["LOG", 1],
    37: ["LN", 1],
    38: ["PI", 0],
    39: ["SIN", 1],
    40: ["COS", 1],
    41: ["TAN", 1],
    42: ["ATAN2", 2],
    43: ["ATAN", 1],
    44: ["ASIN", 1],
    45: ["ACOS", 1],
    46: ["EXP", 1],
    47: ["MOD", 2],
    // 0x30
    49: ["ISNA", 1],
    50: ["ISERR", 1],
    51: ["FALSE", 0],
    52: ["TRUE", 0],
    53: ["RAND", 0],
    54: ["DATE", 3],
    // 0x37 NOW
    // 0x38 PMT
    // 0x39 PV
    // 0x3A FV
    // 0x3B IF
    // 0x3C DAY
    // 0x3D MONTH
    // 0x3E YEAR
    63: ["ROUND", 2],
    64: ["TIME", 3],
    // 0x41 HOUR
    // 0x42 MINUTE
    // 0x43 SECOND
    68: ["ISNUMBER", 1],
    69: ["ISTEXT", 1],
    70: ["LEN", 1],
    71: ["VALUE", 1],
    // 0x48: ["FIXED", ?? 1],
    73: ["MID", 3],
    74: ["CHAR", 1],
    // 0x4B
    // 0x4C FIND
    // 0x4D DATEVALUE
    // 0x4E TIMEVALUE
    // 0x4F CELL
    80: ["SUM", 69],
    81: ["AVERAGEA", 69],
    82: ["COUNTA", 69],
    83: ["MINA", 69],
    84: ["MAXA", 69],
    // 0x55 VLOOKUP
    // 0x56 NPV
    // 0x57 VAR
    // 0x58 STD
    // 0x59 IRR
    // 0x5A HLOOKUP
    // 0x5B DSUM
    // 0x5C DAVERAGE
    // 0x5D DCOUNTA
    // 0x5E DMIN
    // 0x5F DMAX
    // 0x60 DVARP
    // 0x61 DSTDEVP
    // 0x62 INDEX
    // 0x63 COLS
    // 0x64 ROWS
    // 0x65 REPEAT
    102: ["UPPER", 1],
    103: ["LOWER", 1],
    // 0x68 LEFT
    // 0x69 RIGHT
    // 0x6A REPLACE
    107: ["PROPER", 1],
    // 0x6C CELL
    109: ["TRIM", 1],
    // 0x6E CLEAN
    111: ["T", 1]
    // 0x70 V
  }, P = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    // eslint-disable-line no-mixed-spaces-and-tabs
    "",
    "+",
    "-",
    "*",
    "/",
    "^",
    "=",
    "<>",
    // eslint-disable-line no-mixed-spaces-and-tabs
    "<=",
    ">=",
    "<",
    ">",
    "",
    "",
    "",
    "",
    // eslint-disable-line no-mixed-spaces-and-tabs
    "&",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
    // eslint-disable-line no-mixed-spaces-and-tabs
  ];
  function S(O, K) {
    ir(O, 0);
    for (var X = [], z = 0, he = "", N = "", w = "", Q = ""; O.l < O.length; ) {
      var V = O[O.l++];
      switch (V) {
        case 0:
          X.push(O.read_shift(8, "f"));
          break;
        case 1:
          N = E(K[0].c, O.read_shift(2), !0), he = E(K[0].r, O.read_shift(2), !1), X.push(N + he);
          break;
        case 2:
          {
            var I = E(K[0].c, O.read_shift(2), !0), C = E(K[0].r, O.read_shift(2), !1);
            N = E(K[0].c, O.read_shift(2), !0), he = E(K[0].r, O.read_shift(2), !1), X.push(I + C + ":" + N + he);
          }
          break;
        case 3:
          if (O.l < O.length) {
            console.error("WK1 premature formula end");
            return;
          }
          break;
        case 4:
          X.push("(" + X.pop() + ")");
          break;
        case 5:
          X.push(O.read_shift(2));
          break;
        case 6:
          {
            for (var G = ""; V = O[O.l++]; ) G += String.fromCharCode(V);
            X.push('"' + G.replace(/"/g, '""') + '"');
          }
          break;
        case 8:
          X.push("-" + X.pop());
          break;
        case 23:
          X.push("+" + X.pop());
          break;
        case 22:
          X.push("NOT(" + X.pop() + ")");
          break;
        case 20:
        case 21:
          Q = X.pop(), w = X.pop(), X.push(["AND", "OR"][V - 20] + "(" + w + "," + Q + ")");
          break;
        default:
          if (V < 32 && P[V])
            Q = X.pop(), w = X.pop(), X.push(w + P[V] + Q);
          else if (A[V]) {
            if (z = A[V][1], z == 69 && (z = O[O.l++]), z > X.length) {
              console.error("WK1 bad formula parse 0x" + V.toString(16) + ":|" + X.join("|") + "|");
              return;
            }
            var oe = X.slice(-z);
            X.length -= z, X.push(A[V][0] + "(" + oe.join(",") + ")");
          } else return V <= 7 ? console.error("WK1 invalid opcode " + V.toString(16)) : V <= 24 ? console.error("WK1 unsupported op " + V.toString(16)) : V <= 30 ? console.error("WK1 invalid opcode " + V.toString(16)) : V <= 115 ? console.error("WK1 unsupported function opcode " + V.toString(16)) : console.error("WK1 unrecognized opcode " + V.toString(16));
      }
    }
    X.length == 1 ? K[1].f = "" + X[0] : console.error("WK1 bad formula parse |" + X.join("|") + "|");
  }
  function R(O) {
    var K = [{ c: 0, r: 0 }, { t: "n", v: 0 }, 0];
    return K[0].r = O.read_shift(2), K[3] = O[O.l++], K[0].c = O[O.l++], K;
  }
  function F(O, K) {
    var X = R(O);
    return X[1].t = "s", X[1].v = O.read_shift(K - 4, "cstr"), X;
  }
  function U(O, K, X, z) {
    var he = ar(6 + z.length);
    he.write_shift(2, O), he.write_shift(1, X), he.write_shift(1, K), he.write_shift(1, 39);
    for (var N = 0; N < z.length; ++N) {
      var w = z.charCodeAt(N);
      he.write_shift(1, w >= 128 ? 95 : w);
    }
    return he.write_shift(1, 0), he;
  }
  function H(O, K) {
    var X = R(O);
    X[1].v = O.read_shift(2);
    var z = X[1].v >> 1;
    if (X[1].v & 1)
      switch (z & 7) {
        case 0:
          z = (z >> 3) * 5e3;
          break;
        case 1:
          z = (z >> 3) * 500;
          break;
        case 2:
          z = (z >> 3) / 20;
          break;
        case 3:
          z = (z >> 3) / 200;
          break;
        case 4:
          z = (z >> 3) / 2e3;
          break;
        case 5:
          z = (z >> 3) / 2e4;
          break;
        case 6:
          z = (z >> 3) / 16;
          break;
        case 7:
          z = (z >> 3) / 64;
          break;
      }
    return X[1].v = z, X;
  }
  function y(O, K) {
    var X = R(O), z = O.read_shift(4), he = O.read_shift(4), N = O.read_shift(2);
    if (N == 65535)
      return z === 0 && he === 3221225472 ? (X[1].t = "e", X[1].v = 15) : z === 0 && he === 3489660928 ? (X[1].t = "e", X[1].v = 42) : X[1].v = 0, X;
    var w = N & 32768;
    return N = (N & 32767) - 16446, X[1].v = (1 - w * 2) * (he * Math.pow(2, N + 32) + z * Math.pow(2, N)), X;
  }
  function W(O, K, X, z) {
    var he = ar(14);
    if (he.write_shift(2, O), he.write_shift(1, X), he.write_shift(1, K), z == 0)
      return he.write_shift(4, 0), he.write_shift(4, 0), he.write_shift(2, 65535), he;
    var N = 0, w = 0, Q = 0, V = 0;
    return z < 0 && (N = 1, z = -z), w = Math.log2(z) | 0, z /= Math.pow(2, w - 31), V = z >>> 0, (V & 2147483648) == 0 && (z /= 2, ++w, V = z >>> 0), z -= V, V |= 2147483648, V >>>= 0, z *= Math.pow(2, 32), Q = z >>> 0, he.write_shift(4, Q), he.write_shift(4, V), w += 16383 + (N ? 32768 : 0), he.write_shift(2, w), he;
  }
  function k(O, K) {
    var X = y(O);
    return O.l += K - 14, X;
  }
  function j(O, K) {
    var X = R(O), z = O.read_shift(4);
    return X[1].v = z >> 6, X;
  }
  function me(O, K) {
    var X = R(O), z = O.read_shift(8, "f");
    return X[1].v = z, X;
  }
  function Z(O, K) {
    var X = me(O);
    return O.l += K - 12, X;
  }
  function xe(O, K) {
    return O[O.l + K - 1] == 0 ? O.read_shift(K, "cstr") : "";
  }
  function fe(O, K) {
    var X = O[O.l++];
    X > K - 1 && (X = K - 1);
    for (var z = ""; z.length < X; ) z += String.fromCharCode(O[O.l++]);
    return z;
  }
  function q(O, K, X) {
    if (!(!X.qpro || K < 21)) {
      var z = O.read_shift(1);
      O.l += 17, O.l += 1, O.l += 2;
      var he = O.read_shift(K - 21, "cstr");
      return [z, he];
    }
  }
  function J(O, K) {
    for (var X = {}, z = O.l + K; O.l < z; ) {
      var he = O.read_shift(2);
      if (he == 14e3) {
        for (X[he] = [0, ""], X[he][0] = O.read_shift(2); O[O.l]; )
          X[he][1] += String.fromCharCode(O[O.l]), O.l++;
        O.l++;
      }
    }
    return X;
  }
  function Y(O, K) {
    var X = ar(5 + O.length);
    X.write_shift(2, 14e3), X.write_shift(2, K);
    for (var z = 0; z < O.length; ++z) {
      var he = O.charCodeAt(z);
      X[X.l++] = he > 127 ? 95 : he;
    }
    return X[X.l++] = 0, X;
  }
  var pe = {
    0: { n: "BOF", f: Ze },
    1: { n: "EOF" },
    2: { n: "CALCMODE" },
    3: { n: "CALCORDER" },
    4: { n: "SPLIT" },
    5: { n: "SYNC" },
    6: { n: "RANGE", f: c },
    7: { n: "WINDOW1" },
    8: { n: "COLW1" },
    9: { n: "WINTWO" },
    10: { n: "COLW2" },
    11: { n: "NAME" },
    12: { n: "BLANK" },
    13: { n: "INTEGER", f: p },
    14: { n: "NUMBER", f: h },
    15: { n: "LABEL", f: x },
    16: { n: "FORMULA", f: g },
    24: { n: "TABLE" },
    25: { n: "ORANGE" },
    26: { n: "PRANGE" },
    27: { n: "SRANGE" },
    28: { n: "FRANGE" },
    29: { n: "KRANGE1" },
    32: { n: "HRANGE" },
    35: { n: "KRANGE2" },
    36: { n: "PROTEC" },
    37: { n: "FOOTER" },
    38: { n: "HEADER" },
    39: { n: "SETUP" },
    40: { n: "MARGINS" },
    41: { n: "LABELFMT" },
    42: { n: "TITLES" },
    43: { n: "SHEETJS" },
    45: { n: "GRAPH" },
    46: { n: "NGRAPH" },
    47: { n: "CALCCOUNT" },
    48: { n: "UNFORMATTED" },
    49: { n: "CURSORW12" },
    50: { n: "WINDOW" },
    51: { n: "STRING", f: v },
    55: { n: "PASSWORD" },
    56: { n: "LOCKED" },
    60: { n: "QUERY" },
    61: { n: "QUERYNAME" },
    62: { n: "PRINT" },
    63: { n: "PRINTNAME" },
    64: { n: "GRAPH2" },
    65: { n: "GRAPHNAME" },
    66: { n: "ZOOM" },
    67: { n: "SYMSPLIT" },
    68: { n: "NSROWS" },
    69: { n: "NSCOLS" },
    70: { n: "RULER" },
    71: { n: "NNAME" },
    72: { n: "ACOMM" },
    73: { n: "AMACRO" },
    74: { n: "PARSE" },
    // 0x0064
    102: { n: "PRANGES??" },
    103: { n: "RRANGES??" },
    104: { n: "FNAME??" },
    105: { n: "MRANGES??" },
    // 0x0096
    // 0x0099
    // 0x009A
    // 0x009B
    // 0x009C
    // 0x00C0
    // 0x00C7
    // 0x00C9
    204: { n: "SHEETNAMECS", f: xe },
    // 0x00CD
    222: { n: "SHEETNAMELP", f: fe },
    255: { n: "BOF", f: Ze },
    21506: { n: "WKSNF", f: Ze },
    65535: { n: "" }
  }, ce = {
    0: { n: "BOF" },
    1: { n: "EOF" },
    2: { n: "PASSWORD" },
    3: { n: "CALCSET" },
    4: { n: "WINDOWSET" },
    5: { n: "SHEETCELLPTR" },
    6: { n: "SHEETLAYOUT" },
    7: { n: "COLUMNWIDTH" },
    8: { n: "HIDDENCOLUMN" },
    9: { n: "USERRANGE" },
    10: { n: "SYSTEMRANGE" },
    11: { n: "ZEROFORCE" },
    12: { n: "SORTKEYDIR" },
    13: { n: "FILESEAL" },
    14: { n: "DATAFILLNUMS" },
    15: { n: "PRINTMAIN" },
    16: { n: "PRINTSTRING" },
    17: { n: "GRAPHMAIN" },
    18: { n: "GRAPHSTRING" },
    19: { n: "??" },
    20: { n: "ERRCELL" },
    21: { n: "NACELL" },
    22: { n: "LABEL16", f: F },
    23: { n: "NUMBER17", f: y },
    24: { n: "NUMBER18", f: H },
    25: { n: "FORMULA19", f: k },
    26: { n: "FORMULA1A" },
    27: { n: "XFORMAT", f: J },
    28: { n: "DTLABELMISC" },
    29: { n: "DTLABELCELL" },
    30: { n: "GRAPHWINDOW" },
    31: { n: "CPA" },
    32: { n: "LPLAUTO" },
    33: { n: "QUERY" },
    34: { n: "HIDDENSHEET" },
    35: { n: "??" },
    37: { n: "NUMBER25", f: j },
    38: { n: "??" },
    39: { n: "NUMBER27", f: me },
    40: { n: "FORMULA28", f: Z },
    142: { n: "??" },
    147: { n: "??" },
    150: { n: "??" },
    151: { n: "??" },
    152: { n: "??" },
    153: { n: "??" },
    154: { n: "??" },
    155: { n: "??" },
    156: { n: "??" },
    163: { n: "??" },
    174: { n: "??" },
    175: { n: "??" },
    176: { n: "??" },
    177: { n: "??" },
    184: { n: "??" },
    185: { n: "??" },
    186: { n: "??" },
    187: { n: "??" },
    188: { n: "??" },
    195: { n: "??" },
    201: { n: "??" },
    204: { n: "SHEETNAMECS", f: xe },
    205: { n: "??" },
    206: { n: "??" },
    207: { n: "??" },
    208: { n: "??" },
    256: { n: "??" },
    259: { n: "??" },
    260: { n: "??" },
    261: { n: "??" },
    262: { n: "??" },
    263: { n: "??" },
    265: { n: "??" },
    266: { n: "??" },
    267: { n: "??" },
    268: { n: "??" },
    270: { n: "??" },
    271: { n: "??" },
    384: { n: "??" },
    389: { n: "??" },
    390: { n: "??" },
    393: { n: "??" },
    396: { n: "??" },
    512: { n: "??" },
    514: { n: "??" },
    513: { n: "??" },
    516: { n: "??" },
    517: { n: "??" },
    640: { n: "??" },
    641: { n: "??" },
    642: { n: "??" },
    643: { n: "??" },
    644: { n: "??" },
    645: { n: "??" },
    646: { n: "??" },
    647: { n: "??" },
    648: { n: "??" },
    658: { n: "??" },
    659: { n: "??" },
    660: { n: "??" },
    661: { n: "??" },
    662: { n: "??" },
    665: { n: "??" },
    666: { n: "??" },
    768: { n: "??" },
    772: { n: "??" },
    1537: { n: "SHEETINFOQP", f: q },
    1600: { n: "??" },
    1602: { n: "??" },
    1793: { n: "??" },
    1794: { n: "??" },
    1795: { n: "??" },
    1796: { n: "??" },
    1920: { n: "??" },
    2048: { n: "??" },
    2049: { n: "??" },
    2052: { n: "??" },
    2688: { n: "??" },
    10998: { n: "??" },
    12849: { n: "??" },
    28233: { n: "??" },
    28484: { n: "??" },
    65535: { n: "" }
  }, de = {
    5: "dd-mmm-yy",
    6: "dd-mmm",
    7: "mmm-yy",
    8: "mm/dd/yy",
    // Long Date Intl
    10: "hh:mm:ss AM/PM",
    11: "hh:mm AM/PM",
    14: "dd-mmm-yyyy",
    15: "mmm-yyyy",
    /* It is suspected that the the low nybble specifies decimal places */
    34: "0.00",
    50: "0.00;[Red]0.00",
    66: "0.00;(0.00)",
    82: "0.00;[Red](0.00)",
    162: '"$"#,##0.00;\\("$"#,##0.00\\)',
    288: "0%",
    304: "0E+00",
    320: "# ?/?"
  };
  function Te(O) {
    var K = O.read_shift(2), X = O.read_shift(1);
    if (X != 0) throw "unsupported QPW string type " + X.toString(16);
    return O.read_shift(K, "sbcs-cont");
  }
  function Ce(O, K) {
    ir(O, 0);
    var X = K || {}, z = {};
    X.dense && (z["!data"] = []);
    var he = [], N = "", w = { s: { r: -1, c: -1 }, e: { r: -1, c: -1 } }, Q = 0, V = 0, I = 0, C = 0, G = { SheetNames: [], Sheets: {} }, oe = [];
    e: for (; O.l < O.length; ) {
      var le = O.read_shift(2), ee = O.read_shift(2), se = O.slice(O.l, O.l + ee);
      switch (ir(se, 0), le) {
        case 1:
          if (se.read_shift(4) != 962023505) throw "Bad QPW9 BOF!";
          break;
        case 2:
          break e;
        case 8:
          break;
        // TODO: this is tied to custom number formats
        case 10:
          for (var ve = se.read_shift(4), re = (se.length - se.l) / ve | 0, Fe = 0; Fe < ve; ++Fe) {
            var Oe = se.l + re, Se = {};
            se.l += 2, Se.numFmtId = se.read_shift(2), de[Se.numFmtId] && (Se.z = de[Se.numFmtId]), se.l = Oe, oe.push(Se);
          }
          break;
        /* TODO: The behavior here should be consistent with Numbers: QP Notebook ~ .TN.SheetArchive, QP Sheet ~ .TST.TableModelArchive */
        case 1025:
          break;
        case 1026:
          break;
        case 1031:
          for (se.l += 12; se.l < se.length; )
            Q = se.read_shift(2), V = se.read_shift(1), he.push(se.read_shift(Q, "cstr"));
          break;
        case 1032:
          break;
        case 1537:
          {
            var je = se.read_shift(2);
            z = {}, X.dense && (z["!data"] = []), w.s.c = se.read_shift(2), w.e.c = se.read_shift(2), w.s.r = se.read_shift(4), w.e.r = se.read_shift(4), se.l += 4, se.l + 2 < se.length && (Q = se.read_shift(2), V = se.read_shift(1), N = Q == 0 ? "" : se.read_shift(Q, "cstr")), N || (N = He(je));
          }
          break;
        case 1538:
          {
            if (w.s.c > 255 || w.s.r > 999999) break;
            w.e.c < w.s.c && (w.e.c = w.s.c), w.e.r < w.s.r && (w.e.r = w.s.r), z["!ref"] = Le(w), Ea(G, z, N);
          }
          break;
        case 2561:
          I = se.read_shift(2), w.e.c < I && (w.e.c = I), w.s.c > I && (w.s.c = I), C = se.read_shift(4), w.s.r > C && (w.s.r = C), C = se.read_shift(4), w.e.r < C && (w.e.r = C);
          break;
        case 3073:
          {
            C = se.read_shift(4), Q = se.read_shift(4), w.s.r > C && (w.s.r = C), w.e.r < C + Q - 1 && (w.e.r = C + Q - 1);
            for (var qe = He(I); se.l < se.length; ) {
              var ke = { t: "z" }, Ne = se.read_shift(1), De = -1;
              Ne & 128 && (De = se.read_shift(2));
              var $e = Ne & 64 ? se.read_shift(2) - 1 : 0;
              switch (Ne & 31) {
                case 0:
                  break;
                case 1:
                  break;
                case 2:
                  ke = { t: "n", v: se.read_shift(2) };
                  break;
                case 3:
                  ke = { t: "n", v: se.read_shift(2, "i") };
                  break;
                case 4:
                  ke = { t: "n", v: an(se) };
                  break;
                case 5:
                  ke = { t: "n", v: se.read_shift(8, "f") };
                  break;
                case 7:
                  ke = { t: "s", v: he[V = se.read_shift(4) - 1] };
                  break;
                case 8:
                  ke = { t: "n", v: se.read_shift(8, "f") }, se.l += 2, se.l += 4, isNaN(ke.v) && (ke = { t: "e", v: 15 });
                  break;
                default:
                  throw "Unrecognized QPW cell type " + (Ne & 31);
              }
              De != -1 && (oe[De - 1] || {}).z && (ke.z = oe[De - 1].z);
              var Cr = 0;
              if (Ne & 32) switch (Ne & 31) {
                case 2:
                  Cr = se.read_shift(2);
                  break;
                case 3:
                  Cr = se.read_shift(2, "i");
                  break;
                case 7:
                  Cr = se.read_shift(2);
                  break;
                default:
                  throw "Unsupported delta for QPW cell type " + (Ne & 31);
              }
              if (!(!X.sheetStubs && ke.t == "z")) {
                var lr = nr(ke);
                ke.t == "n" && ke.z && $r(ke.z) && X.cellDates && (lr.v = ot(ke.v), lr.t = typeof lr.v == "number" ? "n" : "d"), z["!data"] != null ? (z["!data"][C] || (z["!data"][C] = []), z["!data"][C][I] = lr) : z[qe + Ge(C)] = lr;
              }
              for (++C, --Q; $e-- > 0 && Q >= 0; ) {
                if (Ne & 32) switch (Ne & 31) {
                  case 2:
                    ke = { t: "n", v: ke.v + Cr & 65535 };
                    break;
                  case 3:
                    ke = { t: "n", v: ke.v + Cr & 65535 }, ke.v > 32767 && (ke.v -= 65536);
                    break;
                  case 7:
                    ke = { t: "s", v: he[V = V + Cr >>> 0] };
                    break;
                  default:
                    throw "Cannot apply delta for QPW cell type " + (Ne & 31);
                }
                else switch (Ne & 31) {
                  case 1:
                    ke = { t: "z" };
                    break;
                  case 2:
                    ke = { t: "n", v: se.read_shift(2) };
                    break;
                  case 7:
                    ke = { t: "s", v: he[V = se.read_shift(4) - 1] };
                    break;
                  default:
                    throw "Cannot apply repeat for QPW cell type " + (Ne & 31);
                }
                !X.sheetStubs && ke.t == "z" || (z["!data"] != null ? (z["!data"][C] || (z["!data"][C] = []), z["!data"][C][I] = ke) : z[qe + Ge(C)] = ke), ++C, --Q;
              }
            }
          }
          break;
        case 3074:
          {
            I = se.read_shift(2), C = se.read_shift(4);
            var pt = Te(se);
            z["!data"] != null ? (z["!data"][C] || (z["!data"][C] = []), z["!data"][C][I] = { t: "s", v: pt }) : z[He(I) + Ge(C)] = { t: "s", v: pt };
          }
          break;
      }
      O.l += ee;
    }
    return G;
  }
  return {
    sheet_to_wk1: a,
    book_to_wk3: i,
    to_workbook: t
  };
})();
function Kl(e) {
  var t = {}, r = e.match(xr), n = 0, a = !1;
  if (r) for (; n != r.length; ++n) {
    var i = Ae(r[n]);
    switch (i[0].replace(/<\w*:/g, "<")) {
      /* 18.8.12 condense CT_BooleanProperty */
      /* ** not required . */
      case "<condense":
        break;
      /* 18.8.17 extend CT_BooleanProperty */
      /* ** not required . */
      case "<extend":
        break;
      /* 18.8.36 shadow CT_BooleanProperty */
      /* ** not required . */
      case "<shadow":
        if (!i.val) break;
      /* falls through */
      case "<shadow>":
      case "<shadow/>":
        t.shadow = 1;
        break;
      case "</shadow>":
        break;
      /* 18.4.1 charset CT_IntProperty TODO */
      case "<charset":
        if (i.val == "1") break;
        t.cp = On[parseInt(i.val, 10)];
        break;
      /* 18.4.2 outline CT_BooleanProperty TODO */
      case "<outline":
        if (!i.val) break;
      /* falls through */
      case "<outline>":
      case "<outline/>":
        t.outline = 1;
        break;
      case "</outline>":
        break;
      /* 18.4.5 rFont CT_FontName */
      case "<rFont":
        t.name = i.val;
        break;
      /* 18.4.11 sz CT_FontSize */
      case "<sz":
        t.sz = i.val;
        break;
      /* 18.4.10 strike CT_BooleanProperty */
      case "<strike":
        if (!i.val) break;
      /* falls through */
      case "<strike>":
      case "<strike/>":
        t.strike = 1;
        break;
      case "</strike>":
        break;
      /* 18.4.13 u CT_UnderlineProperty */
      case "<u":
        if (!i.val) break;
        switch (i.val) {
          case "double":
            t.uval = "double";
            break;
          case "singleAccounting":
            t.uval = "single-accounting";
            break;
          case "doubleAccounting":
            t.uval = "double-accounting";
            break;
        }
      /* falls through */
      case "<u>":
      case "<u/>":
        t.u = 1;
        break;
      case "</u>":
        break;
      /* 18.8.2 b */
      case "<b":
        if (i.val == "0") break;
      /* falls through */
      case "<b>":
      case "<b/>":
        t.b = 1;
        break;
      case "</b>":
        break;
      /* 18.8.26 i */
      case "<i":
        if (i.val == "0") break;
      /* falls through */
      case "<i>":
      case "<i/>":
        t.i = 1;
        break;
      case "</i>":
        break;
      /* 18.3.1.15 color CT_Color TODO: tint, theme, auto, indexed */
      case "<color":
        i.rgb && (t.color = i.rgb.slice(2, 8));
        break;
      case "<color>":
      case "<color/>":
      case "</color>":
        break;
      /* 18.8.18 family ST_FontFamily */
      case "<family":
        t.family = i.val;
        break;
      case "<family>":
      case "<family/>":
      case "</family>":
        break;
      /* 18.4.14 vertAlign CT_VerticalAlignFontProperty TODO */
      case "<vertAlign":
        t.valign = i.val;
        break;
      case "<vertAlign>":
      case "<vertAlign/>":
      case "</vertAlign>":
        break;
      /* 18.8.35 scheme CT_FontScheme TODO */
      case "<scheme":
        break;
      case "<scheme>":
      case "<scheme/>":
      case "</scheme>":
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
        break;
      case "<ext":
        a = !0;
        break;
      case "</ext>":
        a = !1;
        break;
      default:
        if (i[0].charCodeAt(1) !== 47 && !a) throw new Error("Unrecognized rich format " + i[0]);
    }
  }
  return t;
}
var Yl = /* @__PURE__ */ (function() {
  function e(n) {
    var a = or(n, "t");
    if (!a) return { t: "s", v: "" };
    var i = { t: "s", v: Be(a[1]) }, f = or(n, "rPr");
    return f && (i.s = Kl(f[1])), i;
  }
  var t = /<(?:\w+:)?r>/g, r = /<\/(?:\w+:)?r>/;
  return function(a) {
    return a.replace(t, "").split(r).map(e).filter(function(i) {
      return i.v;
    });
  };
})(), Zl = /* @__PURE__ */ (function() {
  var t = /(\r\n|\n)/g;
  function r(a, i, f) {
    var s = [];
    a.u && s.push("text-decoration: underline;"), a.uval && s.push("text-underline-style:" + a.uval + ";"), a.sz && s.push("font-size:" + a.sz + "pt;"), a.outline && s.push("text-effect: outline;"), a.shadow && s.push("text-shadow: auto;"), i.push('<span style="' + s.join("") + '">'), a.b && (i.push("<b>"), f.push("</b>")), a.i && (i.push("<i>"), f.push("</i>")), a.strike && (i.push("<s>"), f.push("</s>"));
    var c = a.valign || "";
    return c == "superscript" || c == "super" ? c = "sup" : c == "subscript" && (c = "sub"), c != "" && (i.push("<" + c + ">"), f.push("</" + c + ">")), f.push("</span>"), a;
  }
  function n(a) {
    var i = [[], a.v, []];
    return a.v ? (a.s && r(a.s, i[0], i[2]), i[0].join("") + i[1].replace(t, "<br/>") + i[2].join("")) : "";
  }
  return function(i) {
    return i.map(n).join("");
  };
})(), Ql = /<(?:\w+:)?t\b[^<>]*>([^<]*)<\/(?:\w+:)?t>/g, Jl = /<(?:\w+:)?r\b[^<>]*>/;
function $n(e, t) {
  var r = t ? t.cellHTML : !0, n = {};
  return e ? (e.match(/^\s*<(?:\w+:)?t[^>]*>/) ? (n.t = Be(Xe(e.slice(e.indexOf(">") + 1).split(/<\/(?:\w+:)?t>/)[0] || ""), !0), n.r = Xe(e), r && (n.h = Qt(n.t))) : (
    /*y = */
    e.match(Jl) && (n.r = Xe(e), n.t = Be(Xe((nc(e, "rPh").match(Ql) || []).join("").replace(xr, "")), !0), r && (n.h = Zl(Yl(n.r))))
  ), n) : { t: "" };
}
var ql = /<(?:\w+:)?(?:si|sstItem)>/g, eu = /<\/(?:\w+:)?(?:si|sstItem)>/;
function ru(e, t) {
  var r = [], n = "";
  if (!e) return r;
  var a = or(e, "sst");
  if (a) {
    n = a[1].replace(ql, "").split(eu);
    for (var i = 0; i != n.length; ++i) {
      var f = $n(n[i].trim(), t);
      f != null && (r[r.length] = f);
    }
    a = Ae(a[0].slice(0, a[0].indexOf(">"))), r.Count = a.count, r.Unique = a.uniqueCount;
  }
  return r;
}
function tu(e) {
  return [e.read_shift(4), e.read_shift(4)];
}
function au(e, t) {
  var r = [], n = !1;
  return it(e, function(i, f, s) {
    switch (s) {
      case 159:
        r.Count = i[0], r.Unique = i[1];
        break;
      case 19:
        r.push(i);
        break;
      case 160:
        return !0;
      case 35:
        n = !0;
        break;
      case 36:
        n = !1;
        break;
      default:
        if (f.T, !n || t.WTF) throw new Error("Unexpected record 0x" + s.toString(16));
    }
  }), r;
}
function ls(e) {
  for (var t = [], r = e.split(""), n = 0; n < r.length; ++n) t[n] = r[n].charCodeAt(0);
  return t;
}
function at(e, t) {
  var r = {};
  return r.Major = e.read_shift(2), r.Minor = e.read_shift(2), t >= 4 && (e.l += t - 4), r;
}
function nu(e) {
  var t = {};
  return t.id = e.read_shift(0, "lpp4"), t.R = at(e, 4), t.U = at(e, 4), t.W = at(e, 4), t;
}
function iu(e) {
  for (var t = e.read_shift(4), r = e.l + t - 4, n = {}, a = e.read_shift(4), i = []; a-- > 0; ) i.push({ t: e.read_shift(4), v: e.read_shift(0, "lpp4") });
  if (n.name = e.read_shift(0, "lpp4"), n.comps = i, e.l != r) throw new Error("Bad DataSpaceMapEntry: " + e.l + " != " + r);
  return n;
}
function su(e) {
  var t = [];
  e.l += 4;
  for (var r = e.read_shift(4); r-- > 0; ) t.push(iu(e));
  return t;
}
function fu(e) {
  var t = [];
  e.l += 4;
  for (var r = e.read_shift(4); r-- > 0; ) t.push(e.read_shift(0, "lpp4"));
  return t;
}
function cu(e) {
  var t = {};
  return e.read_shift(4), e.l += 4, t.id = e.read_shift(0, "lpp4"), t.name = e.read_shift(0, "lpp4"), t.R = at(e, 4), t.U = at(e, 4), t.W = at(e, 4), t;
}
function ou(e) {
  var t = cu(e);
  if (t.ename = e.read_shift(0, "8lpp4"), t.blksz = e.read_shift(4), t.cmode = e.read_shift(4), e.read_shift(4) != 4) throw new Error("Bad !Primary record");
  return t;
}
function us(e, t) {
  var r = e.l + t, n = {};
  n.Flags = e.read_shift(4) & 63, e.l += 4, n.AlgID = e.read_shift(4);
  var a = !1;
  switch (n.AlgID) {
    case 26126:
    case 26127:
    case 26128:
      a = n.Flags == 36;
      break;
    case 26625:
      a = n.Flags == 4;
      break;
    case 0:
      a = n.Flags == 16 || n.Flags == 4 || n.Flags == 36;
      break;
    default:
      throw "Unrecognized encryption algorithm: " + n.AlgID;
  }
  if (!a) throw new Error("Encryption Flags/AlgID mismatch");
  return n.AlgIDHash = e.read_shift(4), n.KeySize = e.read_shift(4), n.ProviderType = e.read_shift(4), e.l += 8, n.CSPName = e.read_shift(r - e.l >> 1, "utf16le"), e.l = r, n;
}
function hs(e, t) {
  var r = {}, n = e.l + t;
  return e.l += 4, r.Salt = e.slice(e.l, e.l + 16), e.l += 16, r.Verifier = e.slice(e.l, e.l + 16), e.l += 16, e.read_shift(4), r.VerifierHash = e.slice(e.l, n), e.l = n, r;
}
function lu(e) {
  var t = at(e);
  switch (t.Minor) {
    case 2:
      return [t.Minor, uu(e)];
    case 3:
      return [t.Minor, hu()];
    case 4:
      return [t.Minor, du(e)];
  }
  throw new Error("ECMA-376 Encrypted file unrecognized Version: " + t.Minor);
}
function uu(e) {
  var t = e.read_shift(4);
  if ((t & 63) != 36) throw new Error("EncryptionInfo mismatch");
  var r = e.read_shift(4), n = us(e, r), a = hs(e, e.length - e.l);
  return { t: "Std", h: n, v: a };
}
function hu() {
  throw new Error("File is password-protected: ECMA-376 Extensible");
}
function du(e) {
  var t = ["saltSize", "blockSize", "keyBits", "hashSize", "cipherAlgorithm", "cipherChaining", "hashAlgorithm", "saltValue"];
  e.l += 4;
  var r = e.read_shift(e.length - e.l, "utf8"), n = {};
  return r.replace(xr, function(i) {
    var f = Ae(i);
    switch (Wr(f[0])) {
      case "<?xml":
        break;
      case "<encryption":
      case "</encryption>":
        break;
      case "<keyData":
        t.forEach(function(s) {
          n[s] = f[s];
        });
        break;
      case "<dataIntegrity":
        n.encryptedHmacKey = f.encryptedHmacKey, n.encryptedHmacValue = f.encryptedHmacValue;
        break;
      case "<keyEncryptors>":
      case "<keyEncryptors":
        n.encs = [];
        break;
      case "</keyEncryptors>":
        break;
      case "<keyEncryptor":
        n.uri = f.uri;
        break;
      case "</keyEncryptor>":
        break;
      case "<encryptedKey":
        n.encs.push(f);
        break;
      default:
        throw f[0];
    }
  }), n;
}
function xu(e, t) {
  var r = {}, n = r.EncryptionVersionInfo = at(e, 4);
  if (t -= 4, n.Minor != 2) throw new Error("unrecognized minor version code: " + n.Minor);
  if (n.Major > 4 || n.Major < 2) throw new Error("unrecognized major version code: " + n.Major);
  r.Flags = e.read_shift(4), t -= 4;
  var a = e.read_shift(4);
  return t -= 4, r.EncryptionHeader = us(e, a), t -= a, r.EncryptionVerifier = hs(e, t), r;
}
function pu(e) {
  var t = {}, r = t.EncryptionVersionInfo = at(e, 4);
  if (r.Major != 1 || r.Minor != 1) throw "unrecognized version code " + r.Major + " : " + r.Minor;
  return t.Salt = e.read_shift(16), t.EncryptedVerifier = e.read_shift(16), t.EncryptedVerifierHash = e.read_shift(16), t;
}
function mu(e) {
  var t = 0, r, n = ls(e), a = n.length + 1, i, f, s, c, o;
  for (r = lt(a), r[0] = n.length, i = 1; i != a; ++i) r[i] = n[i - 1];
  for (i = a - 1; i >= 0; --i)
    f = r[i], s = (t & 16384) === 0 ? 0 : 1, c = t << 1 & 32767, o = s | c, t = o ^ f;
  return t ^ 52811;
}
var ds = /* @__PURE__ */ (function() {
  var e = [187, 255, 255, 186, 255, 255, 185, 128, 0, 190, 15, 0, 191, 15, 0], t = [57840, 7439, 52380, 33984, 4364, 3600, 61902, 12606, 6258, 57657, 54287, 34041, 10252, 43370, 20163], r = [44796, 19929, 39858, 10053, 20106, 40212, 10761, 31585, 63170, 64933, 60267, 50935, 40399, 11199, 17763, 35526, 1453, 2906, 5812, 11624, 23248, 885, 1770, 3540, 7080, 14160, 28320, 56640, 55369, 41139, 20807, 41614, 21821, 43642, 17621, 28485, 56970, 44341, 19019, 38038, 14605, 29210, 60195, 50791, 40175, 10751, 21502, 43004, 24537, 18387, 36774, 3949, 7898, 15796, 31592, 63184, 47201, 24803, 49606, 37805, 14203, 28406, 56812, 17824, 35648, 1697, 3394, 6788, 13576, 27152, 43601, 17539, 35078, 557, 1114, 2228, 4456, 30388, 60776, 51953, 34243, 7079, 14158, 28316, 14128, 28256, 56512, 43425, 17251, 34502, 7597, 13105, 26210, 52420, 35241, 883, 1766, 3532, 4129, 8258, 16516, 33032, 4657, 9314, 18628], n = function(f) {
    return (f / 2 | f * 128) & 255;
  }, a = function(f, s) {
    return n(f ^ s);
  }, i = function(f) {
    for (var s = t[f.length - 1], c = 104, o = f.length - 1; o >= 0; --o)
      for (var u = f[o], m = 0; m != 7; ++m)
        u & 64 && (s ^= r[c]), u *= 2, --c;
    return s;
  };
  return function(f) {
    for (var s = ls(f), c = i(s), o = s.length, u = lt(16), m = 0; m != 16; ++m) u[m] = 0;
    var x, l, v;
    for ((o & 1) === 1 && (x = c >> 8, u[o] = a(e[0], x), --o, x = c & 255, l = s[s.length - 1], u[o] = a(l, x)); o > 0; )
      --o, x = c >> 8, u[o] = a(s[o], x), --o, x = c & 255, u[o] = a(s[o], x);
    for (o = 15, v = 15 - s.length; v > 0; )
      x = c >> 8, u[o] = a(e[v], x), --o, --v, x = c & 255, u[o] = a(s[o], x), --o, --v;
    return u;
  };
})(), vu = function(e, t, r, n, a) {
  a || (a = t), n || (n = ds(e));
  var i, f;
  for (i = 0; i != t.length; ++i)
    f = t[i], f ^= n[r], f = (f >> 5 | f << 3) & 255, a[i] = f, ++r;
  return [a, r, n];
}, gu = function(e) {
  var t = 0, r = ds(e);
  return function(n) {
    var a = vu("", n, t, r);
    return t = a[1], a[0];
  };
};
function _u(e, t, r, n) {
  var a = { key: Ze(e), verificationBytes: Ze(e) };
  return r.password && (a.verifier = mu(r.password)), n.valid = a.verificationBytes === a.verifier, n.valid && (n.insitu = gu(r.password)), a;
}
function wu(e, t, r) {
  var n = r || {};
  return n.Info = e.read_shift(2), e.l -= 2, n.Info === 1 ? n.Data = pu(e) : n.Data = xu(e, t), n;
}
function ku(e, t, r) {
  var n = { Type: r.biff >= 8 ? e.read_shift(2) : 0 };
  return n.Type ? wu(e, t - 2, n) : _u(e, r.biff >= 8 ? t : t - 2, r, n), n;
}
function Eu(e, t) {
  switch (t.type) {
    case "base64":
      return Pa(Rr(e), t);
    case "binary":
      return Pa(e, t);
    case "buffer":
      return Pa(Pe && Buffer.isBuffer(e) ? e.toString("binary") : nt(e), t);
    case "array":
      return Pa(Ft(e), t);
  }
  throw new Error("Unrecognized type " + t.type);
}
function Pa(e, t) {
  var r = t || {}, n = {}, a = r.dense;
  a && (n["!data"] = []);
  var i = Mn(e, "\\trowd", "\\row");
  if (!i)
    throw new Error("RTF missing table");
  var f = { s: { c: 0, r: 0 }, e: { c: 0, r: i.length - 1 } }, s = [];
  return i.forEach(function(c, o) {
    a && (s = n["!data"][o] = []);
    for (var u = /\\[\w\-]+\b/g, m = 0, x, l = -1, v = []; (x = u.exec(c)) != null; ) {
      var p = c.slice(m, u.lastIndex - x[0].length);
      switch (p.charCodeAt(0) == 32 && (p = p.slice(1)), p.length && v.push(p), x[0]) {
        case "\\cell":
          if (++l, v.length) {
            var d = { v: v.join(""), t: "s" };
            d.v == "TRUE" || d.v == "FALSE" ? (d.v = d.v == "TRUE", d.t = "b") : isNaN(Dr(d.v)) ? ur[d.v] != null && (d.t = "e", d.w = d.v, d.v = ur[d.v]) : (d.t = "n", r.cellText !== !1 && (d.w = d.v), d.v = Dr(d.v)), a ? s[l] = d : n[We({ r: o, c: l })] = d;
          }
          v = [];
          break;
        case "\\par":
          v.push(`
`);
          break;
      }
      m = u.lastIndex;
    }
    l > f.e.c && (f.e.c = l);
  }), n["!ref"] = Le(f), n;
}
function Tu(e, t) {
  var r = xt(Eu(e, t), t);
  return r.bookType = "rtf", r;
}
function yu(e) {
  var t = e.slice(e[0] === "#" ? 1 : 0).slice(0, 6);
  return [parseInt(t.slice(0, 2), 16), parseInt(t.slice(2, 4), 16), parseInt(t.slice(4, 6), 16)];
}
function ha(e) {
  for (var t = 0, r = 1; t != 3; ++t) r = r * 256 + (e[t] > 255 ? 255 : e[t] < 0 ? 0 : e[t]);
  return r.toString(16).toUpperCase().slice(1);
}
function Au(e) {
  var t = e[0] / 255, r = e[1] / 255, n = e[2] / 255, a = Math.max(t, r, n), i = Math.min(t, r, n), f = a - i;
  if (f === 0) return [0, 0, t];
  var s = 0, c = 0, o = a + i;
  switch (c = f / (o > 1 ? 2 - o : o), a) {
    case t:
      s = ((r - n) / f + 6) % 6;
      break;
    case r:
      s = (n - t) / f + 2;
      break;
    case n:
      s = (t - r) / f + 4;
      break;
  }
  return [s / 6, c, o / 2];
}
function Fu(e) {
  var t = e[0], r = e[1], n = e[2], a = r * 2 * (n < 0.5 ? n : 1 - n), i = n - a / 2, f = [i, i, i], s = 6 * t, c;
  if (r !== 0) switch (s | 0) {
    case 0:
    case 6:
      c = a * s, f[0] += a, f[1] += c;
      break;
    case 1:
      c = a * (2 - s), f[0] += c, f[1] += a;
      break;
    case 2:
      c = a * (s - 2), f[1] += a, f[2] += c;
      break;
    case 3:
      c = a * (4 - s), f[1] += c, f[2] += a;
      break;
    case 4:
      c = a * (s - 4), f[2] += a, f[0] += c;
      break;
    case 5:
      c = a * (6 - s), f[2] += c, f[0] += a;
      break;
  }
  for (var o = 0; o != 3; ++o) f[o] = Math.round(f[o] * 255);
  return f;
}
function Ya(e, t) {
  if (t === 0) return e;
  var r = Au(yu(e));
  return t < 0 ? r[2] = r[2] * (1 + t) : r[2] = 1 - (1 - r[2]) * (1 - t), ha(Fu(r));
}
var xs = 6, Su = 15, Cu = 1, Tr = xs;
function Za(e) {
  return Math.floor((e + Math.round(128 / Tr) / 256) * Tr);
}
function Qa(e) {
  return Math.floor((e - 5) / Tr * 100 + 0.5) / 100;
}
function Fn(e) {
  return Math.round((e * Tr + 5) / Tr * 256) / 256;
}
function pn(e) {
  return Fn(Qa(Za(e)));
}
function jn(e) {
  var t = Math.abs(e - pn(e)), r = Tr;
  if (t > 5e-3) for (Tr = Cu; Tr < Su; ++Tr) Math.abs(e - pn(e)) <= t && (t = Math.abs(e - pn(e)), r = Tr);
  Tr = r;
}
function Ht(e) {
  e.width ? (e.wpx = Za(e.width), e.wch = Qa(e.wpx), e.MDW = Tr) : e.wpx ? (e.wch = Qa(e.wpx), e.width = Fn(e.wch), e.MDW = Tr) : typeof e.wch == "number" && (e.width = Fn(e.wch), e.wpx = Za(e.width), e.MDW = Tr), e.customWidth && delete e.customWidth;
}
var bu = 96, ps = bu;
function ms(e) {
  return e * 96 / ps;
}
function da(e) {
  return e * ps / 96;
}
var Iu = {
  None: "none",
  Solid: "solid",
  Gray50: "mediumGray",
  Gray75: "darkGray",
  Gray25: "lightGray",
  HorzStripe: "darkHorizontal",
  VertStripe: "darkVertical",
  ReverseDiagStripe: "darkDown",
  DiagStripe: "darkUp",
  DiagCross: "darkGrid",
  ThickDiagCross: "darkTrellis",
  ThinHorzStripe: "lightHorizontal",
  ThinVertStripe: "lightVertical",
  ThinReverseDiagStripe: "lightDown",
  ThinHorzCross: "lightGrid"
};
function Ou(e, t, r, n) {
  t.Borders = [];
  var a = {}, i = !1;
  (e.match(xr) || []).forEach(function(f) {
    var s = Ae(f);
    switch (Wr(s[0])) {
      case "<borders":
      case "<borders>":
      case "</borders>":
        break;
      /* 18.8.4 border CT_Border */
      case "<border":
      case "<border>":
      case "<border/>":
        a = /*::(*/
        {}, s.diagonalUp && (a.diagonalUp = Ve(s.diagonalUp)), s.diagonalDown && (a.diagonalDown = Ve(s.diagonalDown)), t.Borders.push(a);
        break;
      case "</border>":
        break;
      /* note: not in spec, appears to be CT_BorderPr */
      case "<left/>":
        break;
      case "<left":
      case "<left>":
        break;
      case "</left>":
        break;
      /* note: not in spec, appears to be CT_BorderPr */
      case "<right/>":
        break;
      case "<right":
      case "<right>":
        break;
      case "</right>":
        break;
      /* 18.8.43 top CT_BorderPr */
      case "<top/>":
        break;
      case "<top":
      case "<top>":
        break;
      case "</top>":
        break;
      /* 18.8.6 bottom CT_BorderPr */
      case "<bottom/>":
        break;
      case "<bottom":
      case "<bottom>":
        break;
      case "</bottom>":
        break;
      /* 18.8.13 diagonal CT_BorderPr */
      case "<diagonal":
      case "<diagonal>":
      case "<diagonal/>":
        break;
      case "</diagonal>":
        break;
      /* 18.8.25 horizontal CT_BorderPr */
      case "<horizontal":
      case "<horizontal>":
      case "<horizontal/>":
        break;
      case "</horizontal>":
        break;
      /* 18.8.44 vertical CT_BorderPr */
      case "<vertical":
      case "<vertical>":
      case "<vertical/>":
        break;
      case "</vertical>":
        break;
      /* 18.8.37 start CT_BorderPr */
      case "<start":
      case "<start>":
      case "<start/>":
        break;
      case "</start>":
        break;
      /* 18.8.16 end CT_BorderPr */
      case "<end":
      case "<end>":
      case "<end/>":
        break;
      case "</end>":
        break;
      /* 18.8.? color CT_Color */
      case "<color":
      case "<color>":
        break;
      case "<color/>":
      case "</color>":
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
        break;
      case "<ext":
        i = !0;
        break;
      case "</ext>":
        i = !1;
        break;
      default:
        if (n && n.WTF && !i)
          throw new Error("unrecognized " + s[0] + " in borders");
    }
  });
}
function Du(e, t, r, n) {
  t.Fills = [];
  var a = {}, i = !1;
  (e.match(xr) || []).forEach(function(f) {
    var s = Ae(f);
    switch (Wr(s[0])) {
      case "<fills":
      case "<fills>":
      case "</fills>":
        break;
      /* 18.8.20 fill CT_Fill */
      case "<fill>":
      case "<fill":
      case "<fill/>":
        a = {}, t.Fills.push(a);
        break;
      case "</fill>":
        break;
      /* 18.8.24 gradientFill CT_GradientFill */
      case "<gradientFill>":
        break;
      case "<gradientFill":
      case "</gradientFill>":
        t.Fills.push(a), a = {};
        break;
      /* 18.8.32 patternFill CT_PatternFill */
      case "<patternFill":
      case "<patternFill>":
        s.patternType && (a.patternType = s.patternType);
        break;
      case "<patternFill/>":
      case "</patternFill>":
        break;
      /* 18.8.3 bgColor CT_Color */
      case "<bgColor":
        a.bgColor || (a.bgColor = {}), s.indexed && (a.bgColor.indexed = parseInt(s.indexed, 10)), s.theme && (a.bgColor.theme = parseInt(s.theme, 10)), s.tint && (a.bgColor.tint = parseFloat(s.tint)), s.rgb && (a.bgColor.rgb = s.rgb.slice(-6));
        break;
      case "<bgColor/>":
      case "</bgColor>":
        break;
      /* 18.8.19 fgColor CT_Color */
      case "<fgColor":
        a.fgColor || (a.fgColor = {}), s.theme && (a.fgColor.theme = parseInt(s.theme, 10)), s.tint && (a.fgColor.tint = parseFloat(s.tint)), s.rgb != null && (a.fgColor.rgb = s.rgb.slice(-6));
        break;
      case "<fgColor/>":
      case "</fgColor>":
        break;
      /* 18.8.38 stop CT_GradientStop */
      case "<stop":
      case "<stop/>":
        break;
      case "</stop>":
        break;
      /* 18.8.? color CT_Color */
      case "<color":
      case "<color/>":
        break;
      case "</color>":
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
        break;
      case "<ext":
        i = !0;
        break;
      case "</ext>":
        i = !1;
        break;
      default:
        if (n && n.WTF && !i)
          throw new Error("unrecognized " + s[0] + " in fills");
    }
  });
}
function Ru(e, t, r, n) {
  t.Fonts = [];
  var a = {}, i = !1;
  (e.match(xr) || []).forEach(function(f) {
    var s = Ae(f);
    switch (Wr(s[0])) {
      case "<fonts":
      case "<fonts>":
      case "</fonts>":
        break;
      /* 18.8.22 font CT_Font */
      case "<font":
      case "<font>":
        break;
      case "</font>":
      case "<font/>":
        t.Fonts.push(a), a = {};
        break;
      /* 18.8.29 name CT_FontName */
      case "<name":
        s.val && (a.name = Xe(s.val));
        break;
      case "<name/>":
      case "</name>":
        break;
      /* 18.8.2  b CT_BooleanProperty */
      case "<b":
        a.bold = s.val ? Ve(s.val) : 1;
        break;
      case "<b/>":
        a.bold = 1;
        break;
      case "</b>":
      case "</b":
        break;
      /* 18.8.26 i CT_BooleanProperty */
      case "<i":
        a.italic = s.val ? Ve(s.val) : 1;
        break;
      case "<i/>":
        a.italic = 1;
        break;
      case "</i>":
      case "</i":
        break;
      /* 18.4.13 u CT_UnderlineProperty */
      case "<u":
        switch (s.val) {
          case "none":
            a.underline = 0;
            break;
          case "single":
            a.underline = 1;
            break;
          case "double":
            a.underline = 2;
            break;
          case "singleAccounting":
            a.underline = 33;
            break;
          case "doubleAccounting":
            a.underline = 34;
            break;
        }
        break;
      case "<u/>":
        a.underline = 1;
        break;
      case "</u>":
      case "</u":
        break;
      /* 18.4.10 strike CT_BooleanProperty */
      case "<strike":
        a.strike = s.val ? Ve(s.val) : 1;
        break;
      case "<strike/>":
        a.strike = 1;
        break;
      case "</strike>":
      case "</strike":
        break;
      /* 18.4.2  outline CT_BooleanProperty */
      case "<outline":
        a.outline = s.val ? Ve(s.val) : 1;
        break;
      case "<outline/>":
        a.outline = 1;
        break;
      case "</outline>":
      case "</outline":
        break;
      /* 18.8.36 shadow CT_BooleanProperty */
      case "<shadow":
        a.shadow = s.val ? Ve(s.val) : 1;
        break;
      case "<shadow/>":
        a.shadow = 1;
        break;
      case "</shadow>":
      case "</shadow":
        break;
      /* 18.8.12 condense CT_BooleanProperty */
      case "<condense":
        a.condense = s.val ? Ve(s.val) : 1;
        break;
      case "<condense/>":
        a.condense = 1;
        break;
      case "</condense>":
      case "</condense":
        break;
      /* 18.8.17 extend CT_BooleanProperty */
      case "<extend":
        a.extend = s.val ? Ve(s.val) : 1;
        break;
      case "<extend/>":
        a.extend = 1;
        break;
      case "</extend>":
      case "</extend":
        break;
      /* 18.4.11 sz CT_FontSize */
      case "<sz":
        s.val && (a.sz = +s.val);
        break;
      case "<sz/>":
      case "</sz>":
      case "</sz":
        break;
      /* 18.4.14 vertAlign CT_VerticalAlignFontProperty */
      case "<vertAlign":
        s.val && (a.vertAlign = s.val);
        break;
      case "<vertAlign/>":
      case "</vertAlign>":
      case "</vertAlign":
        break;
      /* 18.8.18 family CT_FontFamily */
      case "<family":
        s.val && (a.family = parseInt(s.val, 10));
        break;
      case "<family/>":
      case "</family>":
      case "</family":
        break;
      /* 18.8.35 scheme CT_FontScheme */
      case "<scheme":
        s.val && (a.scheme = s.val);
        break;
      case "<scheme/>":
      case "</scheme>":
      case "</scheme":
        break;
      /* 18.4.1 charset CT_IntProperty */
      case "<charset":
        if (s.val == "1") break;
        s.codepage = On[parseInt(s.val, 10)];
        break;
      case "<charset/>":
      case "</charset>":
      case "</charset":
        break;
      /* 18.?.? color CT_Color */
      case "<color":
        if (a.color || (a.color = {}), s.auto && (a.color.auto = Ve(s.auto)), s.rgb) a.color.rgb = s.rgb.slice(-6);
        else if (s.indexed) {
          a.color.index = parseInt(s.indexed, 10);
          var c = Et[a.color.index];
          a.color.index == 81 && (c = Et[1]), c || (c = Et[1]), a.color.rgb = c[0].toString(16) + c[1].toString(16) + c[2].toString(16);
        } else s.theme && (a.color.theme = parseInt(s.theme, 10), s.tint && (a.color.tint = parseFloat(s.tint)), s.theme && r.themeElements && r.themeElements.clrScheme && (a.color.rgb = Ya(r.themeElements.clrScheme[a.color.theme].rgb, a.color.tint || 0)));
        break;
      case "<color/>":
      case "</color>":
      case "</color":
        break;
      /* note: sometimes mc:AlternateContent appears bare */
      case "<AlternateContent":
        i = !0;
        break;
      case "</AlternateContent>":
      case "</AlternateContent":
        i = !1;
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
        break;
      case "<ext":
        i = !0;
        break;
      case "</ext>":
        i = !1;
        break;
      default:
        if (n && n.WTF && !i)
          throw new Error("unrecognized " + s[0] + " in fonts");
    }
  });
}
function Nu(e, t, r) {
  t.NumberFmt = [];
  for (var n = zr(be), a = 0; a < n.length; ++a) t.NumberFmt[n[a]] = be[n[a]];
  var i = e.match(xr);
  if (i)
    for (a = 0; a < i.length; ++a) {
      var f = Ae(i[a]);
      switch (Wr(f[0])) {
        case "<numFmts":
        case "</numFmts>":
        case "<numFmts/>":
        case "<numFmts>":
          break;
        case "<numFmt":
          {
            var s = Be(Xe(f.formatCode)), c = parseInt(f.numFmtId, 10);
            if (t.NumberFmt[c] = s, c > 0) {
              if (c > 392) {
                for (c = 392; c > 60 && t.NumberFmt[c] != null; --c) ;
                t.NumberFmt[c] = s;
              }
              wt(s, c);
            }
          }
          break;
        case "</numFmt>":
          break;
        default:
          if (r.WTF) throw new Error("unrecognized " + f[0] + " in numFmts");
      }
    }
}
var Ba = ["numFmtId", "fillId", "fontId", "borderId", "xfId"], La = ["applyAlignment", "applyBorder", "applyFill", "applyFont", "applyNumberFormat", "applyProtection", "pivotButton", "quotePrefix"];
function Pu(e, t, r) {
  t.CellXf = [];
  var n, a = !1;
  (e.match(xr) || []).forEach(function(i) {
    var f = Ae(i), s = 0;
    switch (Wr(f[0])) {
      case "<cellXfs":
      case "<cellXfs>":
      case "<cellXfs/>":
      case "</cellXfs>":
        break;
      /* 18.8.45 xf CT_Xf */
      case "<xf":
      case "<xf/>":
      case "<xf>":
        for (n = f, delete n[0], s = 0; s < Ba.length; ++s) n[Ba[s]] && (n[Ba[s]] = parseInt(n[Ba[s]], 10));
        for (s = 0; s < La.length; ++s) n[La[s]] && (n[La[s]] = Ve(n[La[s]]));
        if (t.NumberFmt && n.numFmtId > 392) {
          for (s = 392; s > 60; --s) if (t.NumberFmt[n.numFmtId] == t.NumberFmt[s]) {
            n.numFmtId = s;
            break;
          }
        }
        t.CellXf.push(n);
        break;
      case "</xf>":
        break;
      /* 18.8.1 alignment CT_CellAlignment */
      case "<alignment":
      case "<alignment/>":
      case "<alignment>":
        var c = {};
        f.vertical && (c.vertical = f.vertical), f.horizontal && (c.horizontal = f.horizontal), f.textRotation != null && (c.textRotation = f.textRotation), f.indent && (c.indent = f.indent), f.wrapText && (c.wrapText = Ve(f.wrapText)), n.alignment = c;
        break;
      case "</alignment>":
        break;
      /* 18.8.33 protection CT_CellProtection */
      case "<protection":
      case "<protection>":
        break;
      case "</protection>":
      case "<protection/>":
        break;
      /* note: sometimes mc:AlternateContent appears bare */
      case "<AlternateContent":
      case "<AlternateContent>":
        a = !0;
        break;
      case "</AlternateContent>":
        a = !1;
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
        break;
      case "<ext":
        a = !0;
        break;
      case "</ext>":
        a = !1;
        break;
      default:
        if (r && r.WTF && !a)
          throw new Error("unrecognized " + f[0] + " in cellXfs");
    }
  });
}
var Bu = /* @__PURE__ */ (function() {
  return function(r, n, a) {
    var i = {};
    if (!r) return i;
    r = Ln(ma(r, "<!--", "-->"));
    var f;
    return (f = or(r, "numFmts")) && Nu(f[0], i, a), (f = or(r, "fonts")) && Ru(f[0], i, n, a), (f = or(r, "fills")) && Du(f[0], i, n, a), (f = or(r, "borders")) && Ou(f[0], i, n, a), (f = or(r, "cellXfs")) && Pu(f[0], i, a), i;
  };
})();
function Lu(e, t) {
  var r = e.read_shift(2), n = wr(e);
  return [r, n];
}
function Mu(e, t, r) {
  var n = {};
  n.sz = e.read_shift(2) / 20;
  var a = Gc(e);
  a.fItalic && (n.italic = 1), a.fCondense && (n.condense = 1), a.fExtend && (n.extend = 1), a.fShadow && (n.shadow = 1), a.fOutline && (n.outline = 1), a.fStrikeout && (n.strike = 1);
  var i = e.read_shift(2);
  switch (i === 700 && (n.bold = 1), e.read_shift(2)) {
    /* case 0: out.vertAlign = "baseline"; break; */
    case 1:
      n.vertAlign = "superscript";
      break;
    case 2:
      n.vertAlign = "subscript";
      break;
  }
  var f = e.read_shift(1);
  f != 0 && (n.underline = f);
  var s = e.read_shift(1);
  s > 0 && (n.family = s);
  var c = e.read_shift(1);
  switch (c > 0 && (n.charset = c), e.l++, n.color = Vc(e), e.read_shift(1)) {
    /* case 0: out.scheme = "none": break; */
    case 1:
      n.scheme = "major";
      break;
    case 2:
      n.scheme = "minor";
      break;
  }
  return n.name = wr(e), n;
}
var Uu = kr;
function zu(e, t) {
  var r = e.l + t, n = e.read_shift(2), a = e.read_shift(2);
  return e.l = r, { ixfe: n, numFmtId: a };
}
var Wu = kr;
function Hu(e, t, r) {
  var n = {};
  n.NumberFmt = [];
  for (var a in be) n.NumberFmt[a] = be[a];
  n.CellXf = [], n.Fonts = [];
  var i = [], f = !1;
  return it(e, function(c, o, u) {
    switch (u) {
      case 44:
        n.NumberFmt[c[0]] = c[1], wt(c[1], c[0]);
        break;
      case 43:
        n.Fonts.push(c), c.color.theme != null && t && t.themeElements && t.themeElements.clrScheme && (c.color.rgb = Ya(t.themeElements.clrScheme[c.color.theme].rgb, c.color.tint || 0));
        break;
      case 1025:
        break;
      case 45:
        break;
      case 46:
        break;
      case 47:
        i[i.length - 1] == 617 && n.CellXf.push(c);
        break;
      case 48:
      /* BrtStyle */
      case 507:
      /* BrtDXF */
      case 572:
      /* BrtMRUColor */
      case 475:
        break;
      case 1171:
      /* BrtDXF14 */
      case 2102:
      /* BrtDXF15 */
      case 1130:
      /* BrtSlicerStyleElement */
      case 512:
      /* BrtTableStyleElement */
      case 2095:
      /* BrtTimelineStyleElement */
      case 3072:
        break;
      case 35:
        f = !0;
        break;
      case 36:
        f = !1;
        break;
      case 37:
        i.push(u), f = !0;
        break;
      case 38:
        i.pop(), f = !1;
        break;
      default:
        if (o.T > 0) i.push(u);
        else if (o.T < 0) i.pop();
        else if (!f || r.WTF && i[i.length - 1] != 37) throw new Error("Unexpected record 0x" + u.toString(16));
    }
  }), n;
}
var Vu = [
  "</a:lt1>",
  "</a:dk1>",
  "</a:lt2>",
  "</a:dk2>",
  "</a:accent1>",
  "</a:accent2>",
  "</a:accent3>",
  "</a:accent4>",
  "</a:accent5>",
  "</a:accent6>",
  "</a:hlink>",
  "</a:folHlink>"
];
function Gu(e, t, r) {
  t.themeElements.clrScheme = [];
  var n = {};
  (e[0].match(xr) || []).forEach(function(a) {
    var i = Ae(a);
    switch (i[0]) {
      /* 20.1.6.2 clrScheme (Color Scheme) CT_ColorScheme */
      case "<a:clrScheme":
      case "</a:clrScheme>":
        break;
      /* 20.1.2.3.32 srgbClr CT_SRgbColor */
      case "<a:srgbClr":
        n.rgb = i.val;
        break;
      case "</a:srgbClr>":
        break;
      /* 20.1.2.3.33 sysClr CT_SystemColor */
      case "<a:sysClr":
        n.rgb = i.lastClr;
        break;
      case "</a:sysClr>":
        break;
      /* 20.1.4.1.1 accent1 (Accent 1) */
      /* 20.1.4.1.2 accent2 (Accent 2) */
      /* 20.1.4.1.3 accent3 (Accent 3) */
      /* 20.1.4.1.4 accent4 (Accent 4) */
      /* 20.1.4.1.5 accent5 (Accent 5) */
      /* 20.1.4.1.6 accent6 (Accent 6) */
      /* 20.1.4.1.9 dk1 (Dark 1) */
      /* 20.1.4.1.10 dk2 (Dark 2) */
      /* 20.1.4.1.15 folHlink (Followed Hyperlink) */
      /* 20.1.4.1.19 hlink (Hyperlink) */
      /* 20.1.4.1.22 lt1 (Light 1) */
      /* 20.1.4.1.23 lt2 (Light 2) */
      case "</a:dk1>":
      case "</a:lt1>":
      case "<a:dk1>":
      case "<a:lt1>":
      case "<a:dk2>":
      case "</a:dk2>":
      case "<a:lt2>":
      case "</a:lt2>":
      case "<a:accent1>":
      case "</a:accent1>":
      case "<a:accent2>":
      case "</a:accent2>":
      case "<a:accent3>":
      case "</a:accent3>":
      case "<a:accent4>":
      case "</a:accent4>":
      case "<a:accent5>":
      case "</a:accent5>":
      case "<a:accent6>":
      case "</a:accent6>":
      case "<a:hlink>":
      case "</a:hlink>":
      case "<a:folHlink>":
      case "</a:folHlink>":
        i[0].charAt(1) === "/" ? (t.themeElements.clrScheme[Vu.indexOf(i[0])] = n, n = {}) : n.name = i[0].slice(3, i[0].length - 1);
        break;
      default:
        if (r && r.WTF) throw new Error("Unrecognized " + i[0] + " in clrScheme");
    }
  });
}
function Xu(e, t, r) {
  t.themeElements = {};
  var n;
  if (!(n = kt(e, "a:clrScheme"))) throw new Error("clrScheme not found in themeElements");
  if (Gu(n, t, r), !(n = kt(e, "a:fontScheme"))) throw new Error("fontScheme not found in themeElements");
  if (!(n = kt(e, "a:fmtScheme"))) throw new Error("fmtScheme not found in themeElements");
}
function vs(e, t) {
  (!e || e.length === 0) && (e = $u());
  var r, n = {};
  if (!(r = kt(e, "a:themeElements"))) throw new Error("themeElements not found in theme");
  return Xu(r[0], n, t), n.raw = e, n;
}
function $u(e, t) {
  var r = [C0];
  return r[r.length] = '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">', r[r.length] = "<a:themeElements>", r[r.length] = '<a:clrScheme name="Office">', r[r.length] = '<a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>', r[r.length] = '<a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>', r[r.length] = '<a:dk2><a:srgbClr val="1F497D"/></a:dk2>', r[r.length] = '<a:lt2><a:srgbClr val="EEECE1"/></a:lt2>', r[r.length] = '<a:accent1><a:srgbClr val="4F81BD"/></a:accent1>', r[r.length] = '<a:accent2><a:srgbClr val="C0504D"/></a:accent2>', r[r.length] = '<a:accent3><a:srgbClr val="9BBB59"/></a:accent3>', r[r.length] = '<a:accent4><a:srgbClr val="8064A2"/></a:accent4>', r[r.length] = '<a:accent5><a:srgbClr val="4BACC6"/></a:accent5>', r[r.length] = '<a:accent6><a:srgbClr val="F79646"/></a:accent6>', r[r.length] = '<a:hlink><a:srgbClr val="0000FF"/></a:hlink>', r[r.length] = '<a:folHlink><a:srgbClr val="800080"/></a:folHlink>', r[r.length] = "</a:clrScheme>", r[r.length] = '<a:fontScheme name="Office">', r[r.length] = "<a:majorFont>", r[r.length] = '<a:latin typeface="Cambria"/>', r[r.length] = '<a:ea typeface=""/>', r[r.length] = '<a:cs typeface=""/>', r[r.length] = '<a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/>', r[r.length] = '<a:font script="Hang" typeface="맑은 고딕"/>', r[r.length] = '<a:font script="Hans" typeface="宋体"/>', r[r.length] = '<a:font script="Hant" typeface="新細明體"/>', r[r.length] = '<a:font script="Arab" typeface="Times New Roman"/>', r[r.length] = '<a:font script="Hebr" typeface="Times New Roman"/>', r[r.length] = '<a:font script="Thai" typeface="Tahoma"/>', r[r.length] = '<a:font script="Ethi" typeface="Nyala"/>', r[r.length] = '<a:font script="Beng" typeface="Vrinda"/>', r[r.length] = '<a:font script="Gujr" typeface="Shruti"/>', r[r.length] = '<a:font script="Khmr" typeface="MoolBoran"/>', r[r.length] = '<a:font script="Knda" typeface="Tunga"/>', r[r.length] = '<a:font script="Guru" typeface="Raavi"/>', r[r.length] = '<a:font script="Cans" typeface="Euphemia"/>', r[r.length] = '<a:font script="Cher" typeface="Plantagenet Cherokee"/>', r[r.length] = '<a:font script="Yiii" typeface="Microsoft Yi Baiti"/>', r[r.length] = '<a:font script="Tibt" typeface="Microsoft Himalaya"/>', r[r.length] = '<a:font script="Thaa" typeface="MV Boli"/>', r[r.length] = '<a:font script="Deva" typeface="Mangal"/>', r[r.length] = '<a:font script="Telu" typeface="Gautami"/>', r[r.length] = '<a:font script="Taml" typeface="Latha"/>', r[r.length] = '<a:font script="Syrc" typeface="Estrangelo Edessa"/>', r[r.length] = '<a:font script="Orya" typeface="Kalinga"/>', r[r.length] = '<a:font script="Mlym" typeface="Kartika"/>', r[r.length] = '<a:font script="Laoo" typeface="DokChampa"/>', r[r.length] = '<a:font script="Sinh" typeface="Iskoola Pota"/>', r[r.length] = '<a:font script="Mong" typeface="Mongolian Baiti"/>', r[r.length] = '<a:font script="Viet" typeface="Times New Roman"/>', r[r.length] = '<a:font script="Uigh" typeface="Microsoft Uighur"/>', r[r.length] = '<a:font script="Geor" typeface="Sylfaen"/>', r[r.length] = "</a:majorFont>", r[r.length] = "<a:minorFont>", r[r.length] = '<a:latin typeface="Calibri"/>', r[r.length] = '<a:ea typeface=""/>', r[r.length] = '<a:cs typeface=""/>', r[r.length] = '<a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/>', r[r.length] = '<a:font script="Hang" typeface="맑은 고딕"/>', r[r.length] = '<a:font script="Hans" typeface="宋体"/>', r[r.length] = '<a:font script="Hant" typeface="新細明體"/>', r[r.length] = '<a:font script="Arab" typeface="Arial"/>', r[r.length] = '<a:font script="Hebr" typeface="Arial"/>', r[r.length] = '<a:font script="Thai" typeface="Tahoma"/>', r[r.length] = '<a:font script="Ethi" typeface="Nyala"/>', r[r.length] = '<a:font script="Beng" typeface="Vrinda"/>', r[r.length] = '<a:font script="Gujr" typeface="Shruti"/>', r[r.length] = '<a:font script="Khmr" typeface="DaunPenh"/>', r[r.length] = '<a:font script="Knda" typeface="Tunga"/>', r[r.length] = '<a:font script="Guru" typeface="Raavi"/>', r[r.length] = '<a:font script="Cans" typeface="Euphemia"/>', r[r.length] = '<a:font script="Cher" typeface="Plantagenet Cherokee"/>', r[r.length] = '<a:font script="Yiii" typeface="Microsoft Yi Baiti"/>', r[r.length] = '<a:font script="Tibt" typeface="Microsoft Himalaya"/>', r[r.length] = '<a:font script="Thaa" typeface="MV Boli"/>', r[r.length] = '<a:font script="Deva" typeface="Mangal"/>', r[r.length] = '<a:font script="Telu" typeface="Gautami"/>', r[r.length] = '<a:font script="Taml" typeface="Latha"/>', r[r.length] = '<a:font script="Syrc" typeface="Estrangelo Edessa"/>', r[r.length] = '<a:font script="Orya" typeface="Kalinga"/>', r[r.length] = '<a:font script="Mlym" typeface="Kartika"/>', r[r.length] = '<a:font script="Laoo" typeface="DokChampa"/>', r[r.length] = '<a:font script="Sinh" typeface="Iskoola Pota"/>', r[r.length] = '<a:font script="Mong" typeface="Mongolian Baiti"/>', r[r.length] = '<a:font script="Viet" typeface="Arial"/>', r[r.length] = '<a:font script="Uigh" typeface="Microsoft Uighur"/>', r[r.length] = '<a:font script="Geor" typeface="Sylfaen"/>', r[r.length] = "</a:minorFont>", r[r.length] = "</a:fontScheme>", r[r.length] = '<a:fmtScheme name="Office">', r[r.length] = "<a:fillStyleLst>", r[r.length] = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>', r[r.length] = '<a:gradFill rotWithShape="1">', r[r.length] = "<a:gsLst>", r[r.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs>', r[r.length] = "</a:gsLst>", r[r.length] = '<a:lin ang="16200000" scaled="1"/>', r[r.length] = "</a:gradFill>", r[r.length] = '<a:gradFill rotWithShape="1">', r[r.length] = "<a:gsLst>", r[r.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="100000"/><a:shade val="100000"/><a:satMod val="130000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="50000"/><a:shade val="100000"/><a:satMod val="350000"/></a:schemeClr></a:gs>', r[r.length] = "</a:gsLst>", r[r.length] = '<a:lin ang="16200000" scaled="0"/>', r[r.length] = "</a:gradFill>", r[r.length] = "</a:fillStyleLst>", r[r.length] = "<a:lnStyleLst>", r[r.length] = '<a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln>', r[r.length] = '<a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>', r[r.length] = '<a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>', r[r.length] = "</a:lnStyleLst>", r[r.length] = "<a:effectStyleLst>", r[r.length] = "<a:effectStyle>", r[r.length] = "<a:effectLst>", r[r.length] = '<a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw>', r[r.length] = "</a:effectLst>", r[r.length] = "</a:effectStyle>", r[r.length] = "<a:effectStyle>", r[r.length] = "<a:effectLst>", r[r.length] = '<a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw>', r[r.length] = "</a:effectLst>", r[r.length] = "</a:effectStyle>", r[r.length] = "<a:effectStyle>", r[r.length] = "<a:effectLst>", r[r.length] = '<a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw>', r[r.length] = "</a:effectLst>", r[r.length] = '<a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d>', r[r.length] = '<a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d>', r[r.length] = "</a:effectStyle>", r[r.length] = "</a:effectStyleLst>", r[r.length] = "<a:bgFillStyleLst>", r[r.length] = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>', r[r.length] = '<a:gradFill rotWithShape="1">', r[r.length] = "<a:gsLst>", r[r.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs>', r[r.length] = "</a:gsLst>", r[r.length] = '<a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path>', r[r.length] = "</a:gradFill>", r[r.length] = '<a:gradFill rotWithShape="1">', r[r.length] = "<a:gsLst>", r[r.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs>', r[r.length] = "</a:gsLst>", r[r.length] = '<a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path>', r[r.length] = "</a:gradFill>", r[r.length] = "</a:bgFillStyleLst>", r[r.length] = "</a:fmtScheme>", r[r.length] = "</a:themeElements>", r[r.length] = "<a:objectDefaults>", r[r.length] = "<a:spDef>", r[r.length] = '<a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx="1"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="3"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="2"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></a:style>', r[r.length] = "</a:spDef>", r[r.length] = "<a:lnDef>", r[r.length] = '<a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx="2"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="0"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="1"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></a:style>', r[r.length] = "</a:lnDef>", r[r.length] = "</a:objectDefaults>", r[r.length] = "<a:extraClrSchemeLst/>", r[r.length] = "</a:theme>", r.join("");
}
function ju(e, t, r) {
  var n = e.l + t, a = e.read_shift(4);
  if (a !== 124226) {
    if (!r.cellStyles) {
      e.l = n;
      return;
    }
    var i = e.slice(e.l);
    e.l = n;
    var f;
    try {
      f = S0(i, { type: "array" });
    } catch {
      return;
    }
    var s = yr(f, "theme/theme/theme1.xml", !0);
    if (s)
      return vs(s, r);
  }
}
function Ku(e) {
  return e.read_shift(4);
}
function Yu(e) {
  var t = {};
  switch (t.xclrType = e.read_shift(2), t.nTintShade = e.read_shift(2), t.xclrType) {
    case 0:
      e.l += 4;
      break;
    case 1:
      t.xclrValue = Zu(e, 4);
      break;
    case 2:
      t.xclrValue = as(e);
      break;
    case 3:
      t.xclrValue = Ku(e);
      break;
    case 4:
      e.l += 4;
      break;
  }
  return e.l += 8, t;
}
function Zu(e, t) {
  return kr(e, t);
}
function Qu(e, t) {
  return kr(e, t);
}
function Ju(e) {
  var t = e.read_shift(2), r = e.read_shift(2) - 4, n = [t];
  switch (t) {
    case 4:
    case 5:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 13:
      n[1] = Yu(e);
      break;
    case 6:
      n[1] = Qu(e, r);
      break;
    case 14:
    case 15:
      n[1] = e.read_shift(r === 1 ? 1 : 2);
      break;
    default:
      throw new Error("Unrecognized ExtProp type: " + t + " " + r);
  }
  return n;
}
function qu(e, t) {
  var r = e.l + t;
  e.l += 2;
  var n = e.read_shift(2);
  e.l += 2;
  for (var a = e.read_shift(2), i = []; a-- > 0; ) i.push(Ju(e, r - e.l));
  return { ixfe: n, ext: i };
}
function eh(e, t) {
  t.forEach(function(r) {
    r[0];
  });
}
function rh(e, t) {
  return {
    flags: e.read_shift(4),
    version: e.read_shift(4),
    name: wr(e)
  };
}
function th(e) {
  for (var t = [], r = e.read_shift(4); r-- > 0; )
    t.push([e.read_shift(4), e.read_shift(4)]);
  return t;
}
function ah(e) {
  return e.l += 4, e.read_shift(4) != 0;
}
function nh(e, t, r) {
  var n = { Types: [], Cell: [], Value: [] }, a = r || {}, i = [], f = !1, s = 2;
  return it(e, function(c, o, u) {
    switch (u) {
      case 335:
        n.Types.push({ name: c.name });
        break;
      case 51:
        c.forEach(function(m) {
          s == 1 ? n.Cell.push({ type: n.Types[m[0] - 1].name, index: m[1] }) : s == 0 && n.Value.push({ type: n.Types[m[0] - 1].name, index: m[1] });
        });
        break;
      case 337:
        s = c ? 1 : 0;
        break;
      case 338:
        s = 2;
        break;
      case 35:
        i.push(u), f = !0;
        break;
      case 36:
        i.pop(), f = !1;
        break;
      default:
        if (!o.T) {
          if (!f || a.WTF && i[i.length - 1] != 35)
            throw new Error("Unexpected record 0x" + u.toString(16));
        }
    }
  }), n;
}
function ih(e, t, r) {
  var n = { Types: [], Cell: [], Value: [] };
  if (!e)
    return n;
  var a = !1, i = 2, f;
  return e.replace(xr, function(s) {
    var c = Ae(s);
    switch (Wr(c[0])) {
      case "<?xml":
        break;
      case "<metadata":
      case "</metadata>":
        break;
      case "<metadataTypes":
      case "</metadataTypes>":
        break;
      case "<metadataType":
        n.Types.push({ name: c.name });
        break;
      case "</metadataType>":
        break;
      case "<futureMetadata":
        for (var o = 0; o < n.Types.length; ++o)
          n.Types[o].name == c.name && (f = n.Types[o]);
        break;
      case "</futureMetadata>":
        break;
      case "<bk>":
        break;
      case "</bk>":
        break;
      case "<rc":
        i == 1 ? n.Cell.push({ type: n.Types[c.t - 1].name, index: +c.v }) : i == 0 && n.Value.push({ type: n.Types[c.t - 1].name, index: +c.v });
        break;
      case "</rc>":
        break;
      case "<cellMetadata":
        i = 1;
        break;
      case "</cellMetadata>":
        i = 2;
        break;
      case "<valueMetadata":
        i = 0;
        break;
      case "</valueMetadata>":
        i = 2;
        break;
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
      case "<extLst/>":
        break;
      case "<ext":
        a = !0;
        break;
      case "</ext>":
        a = !1;
        break;
      case "<rvb":
        if (!f)
          break;
        f.offsets || (f.offsets = []), f.offsets.push(+c.i);
        break;
      default:
        if (!a && (r != null && r.WTF))
          throw new Error("unrecognized " + c[0] + " in metadata");
    }
    return s;
  }), n;
}
function sh(e) {
  var t = [];
  if (!e) return t;
  var r = 1;
  return (e.match(xr) || []).forEach(function(n) {
    var a = Ae(n);
    switch (a[0]) {
      case "<?xml":
        break;
      /* 18.6.2  calcChain CT_CalcChain 1 */
      case "<calcChain":
      case "<calcChain>":
      case "</calcChain>":
        break;
      /* 18.6.1  c CT_CalcCell 1 */
      case "<c":
        delete a[0], a.i ? r = a.i : a.i = r, t.push(a);
        break;
    }
  }), t;
}
function fh(e) {
  var t = {};
  t.i = e.read_shift(4);
  var r = {};
  r.r = e.read_shift(4), r.c = e.read_shift(4), t.r = We(r);
  var n = e.read_shift(1);
  return n & 2 && (t.l = "1"), n & 8 && (t.a = "1"), t;
}
function ch(e, t, r) {
  var n = [];
  return it(e, function(i, f, s) {
    switch (s) {
      case 63:
        n.push(i);
        break;
      default:
        if (!f.T) throw new Error("Unexpected record 0x" + s.toString(16));
    }
  }), n;
}
function oh(e, t, r, n) {
  if (!e) return e;
  var a = n || {}, i = !1;
  it(e, function(s, c, o) {
    switch (o) {
      case 359:
      /* 'BrtSupTabs' */
      case 363:
      /* 'BrtExternTableStart' */
      case 364:
      /* 'BrtExternTableEnd' */
      case 366:
      /* 'BrtExternRowHdr' */
      case 367:
      /* 'BrtExternCellBlank' */
      case 368:
      /* 'BrtExternCellReal' */
      case 369:
      /* 'BrtExternCellBool' */
      case 370:
      /* 'BrtExternCellError' */
      case 371:
      /* 'BrtExternCellString' */
      case 472:
      /* 'BrtExternValueMeta' */
      case 577:
      /* 'BrtSupNameStart' */
      case 578:
      /* 'BrtSupNameValueStart' */
      case 579:
      /* 'BrtSupNameValueEnd' */
      case 580:
      /* 'BrtSupNameNum' */
      case 581:
      /* 'BrtSupNameErr' */
      case 582:
      /* 'BrtSupNameSt' */
      case 583:
      /* 'BrtSupNameNil' */
      case 584:
      /* 'BrtSupNameBool' */
      case 585:
      /* 'BrtSupNameFmla' */
      case 586:
      /* 'BrtSupNameBits' */
      case 587:
        break;
      case 35:
        i = !0;
        break;
      case 36:
        i = !1;
        break;
      default:
        if (!c.T) {
          if (!i || a.WTF) throw new Error("Unexpected record 0x" + o.toString(16));
        }
    }
  }, a);
}
function lh(e, t) {
  if (!e) return "??";
  var r = (e.match(/<c:chart [^<>]*r:id="([^<>"]*)"/) || ["", ""])[1];
  return t["!id"][r].Target;
}
function uh(e, t, r) {
  var n = 0;
  (y0(e, "shape") || []).forEach(function(a) {
    var i = "", f = !0, s = -1, c = -1, o = -1;
    switch (a.replace(xr, function(m, x) {
      var l = Ae(m);
      switch (Wr(l[0])) {
        case "<ClientData":
          l.ObjectType && (i = l.ObjectType);
          break;
        case "<Visible":
        case "<Visible/>":
          f = !1;
          break;
        case "<Row":
        case "<Row>":
          s = x + m.length;
          break;
        case "</Row>":
          c = +a.slice(s, x).trim();
          break;
        case "<Column":
        case "<Column>":
          s = x + m.length;
          break;
        case "</Column>":
          o = +a.slice(s, x).trim();
          break;
      }
      return "";
    }), i) {
      case "Note":
        var u = pa(t, c >= 0 && o >= 0 ? We({ r: c, c: o }) : r[n].ref);
        u.c && (u.c.hidden = f), ++n;
        break;
    }
  });
}
function Wi(e, t, r, n) {
  var a = e["!data"] != null, i;
  t.forEach(function(f) {
    var s = _r(f.ref);
    if (!(s.r < 0 || s.c < 0)) {
      if (a ? (e["!data"][s.r] || (e["!data"][s.r] = []), i = e["!data"][s.r][s.c]) : i = e[f.ref], !i) {
        i = { t: "z" }, a ? e["!data"][s.r][s.c] = i : e[f.ref] = i;
        var c = Je(e["!ref"] || "BDWGO1000001:A1");
        c.s.r > s.r && (c.s.r = s.r), c.e.r < s.r && (c.e.r = s.r), c.s.c > s.c && (c.s.c = s.c), c.e.c < s.c && (c.e.c = s.c);
        var o = Le(c);
        e["!ref"] = o;
      }
      i.c || (i.c = []);
      var u = { a: f.author, t: f.t, r: f.r, T: r };
      f.h && (u.h = f.h);
      for (var m = i.c.length - 1; m >= 0; --m) {
        if (!r && i.c[m].T) return;
        r && !i.c[m].T && i.c.splice(m, 1);
      }
      if (r && n) {
        for (m = 0; m < n.length; ++m)
          if (u.a == n[m].id) {
            u.a = n[m].name || u.a;
            break;
          }
      }
      i.c.push(u);
    }
  });
}
function hh(e, t) {
  if (e.match(/<(?:\w+:)?comments *\/>/)) return [];
  var r = [], n = [], a = or(e, "authors");
  a && a[1] && a[1].split(/<\/\w*:?author>/).forEach(function(f) {
    if (!(f === "" || f.trim() === "")) {
      var s = f.match(/<(?:\w+:)?author[^<>]*>(.*)/);
      s && r.push(s[1]);
    }
  });
  var i = or(e, "commentList");
  return i && i[1] && i[1].split(/<\/\w*:?comment>/).forEach(function(f) {
    if (!(f === "" || f.trim() === "")) {
      var s = f.match(/<(?:\w+:)?comment[^<>]*>/);
      if (s) {
        var c = Ae(s[0]), o = { author: c.authorId && r[c.authorId] || "sheetjsghost", ref: c.ref, guid: c.guid }, u = _r(c.ref);
        if (!(t.sheetRows && t.sheetRows <= u.r)) {
          var m = or(f, "text"), x = !!m && !!m[1] && $n(m[1]) || { r: "", t: "", h: "" };
          o.r = x.r, x.r == "<t></t>" && (x.t = x.h = ""), o.t = (x.t || "").replace(/\r\n/g, `
`).replace(/\r/g, `
`), t.cellHTML && (o.h = x.h), n.push(o);
        }
      }
    }
  }), n;
}
function dh(e, t) {
  var r = [], n = !1, a = {}, i = 0;
  return e.replace(xr, function(s, c) {
    var o = Ae(s);
    switch (Wr(o[0])) {
      case "<?xml":
        break;
      /* 2.6.207 ThreadedComments CT_ThreadedComments */
      case "<ThreadedComments":
        break;
      case "</ThreadedComments>":
        break;
      /* 2.6.205 threadedComment CT_ThreadedComment */
      case "<threadedComment":
        a = { author: o.personId, guid: o.id, ref: o.ref, T: 1 };
        break;
      case "</threadedComment>":
        a.t != null && r.push(a);
        break;
      case "<text>":
      case "<text":
        i = c + s.length;
        break;
      case "</text>":
        a.t = e.slice(i, c).replace(/\r\n/g, `
`).replace(/\r/g, `
`);
        break;
      /* 2.6.206 mentions CT_ThreadedCommentMentions TODO */
      case "<mentions":
      case "<mentions>":
        n = !0;
        break;
      case "</mentions>":
        n = !1;
        break;
      /* 2.6.202 mention CT_Mention TODO */
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
      case "<extLst/>":
        break;
      /* 18.2.7  ext CT_Extension + */
      case "<ext":
        n = !0;
        break;
      case "</ext>":
        n = !1;
        break;
      default:
        if (!n && t.WTF) throw new Error("unrecognized " + o[0] + " in threaded comments");
    }
    return s;
  }), r;
}
function xh(e, t) {
  var r = [], n = !1;
  return e.replace(xr, function(i) {
    var f = Ae(i);
    switch (Wr(f[0])) {
      case "<?xml":
        break;
      /* 2.4.85 personList CT_PersonList */
      case "<personList":
        break;
      case "</personList>":
        break;
      /* 2.6.203 person CT_Person TODO: providers */
      case "<person":
        r.push({ name: f.displayname, id: f.id });
        break;
      case "</person>":
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
      case "<extLst/>":
        break;
      /* 18.2.7  ext CT_Extension + */
      case "<ext":
        n = !0;
        break;
      case "</ext>":
        n = !1;
        break;
      default:
        if (!n && t.WTF) throw new Error("unrecognized " + f[0] + " in threaded comments");
    }
    return i;
  }), r;
}
function ph(e) {
  var t = {};
  t.iauthor = e.read_shift(4);
  var r = Dt(e);
  return t.rfx = r.s, t.ref = We(r.s), e.l += 16, t;
}
var mh = wr;
function vh(e, t) {
  var r = [], n = [], a = {}, i = !1;
  return it(e, function(s, c, o) {
    switch (o) {
      case 632:
        n.push(s);
        break;
      case 635:
        a = s;
        break;
      case 637:
        a.t = s.t, a.h = s.h, a.r = s.r;
        break;
      case 636:
        if (a.author = n[a.iauthor], delete a.iauthor, t.sheetRows && a.rfx && t.sheetRows <= a.rfx.r) break;
        a.t || (a.t = ""), delete a.rfx, r.push(a);
        break;
      case 3072:
        break;
      case 35:
        i = !0;
        break;
      case 36:
        i = !1;
        break;
      case 37:
        break;
      case 38:
        break;
      default:
        if (!c.T) {
          if (!i || t.WTF) throw new Error("Unexpected record 0x" + o.toString(16));
        }
    }
  }), r;
}
var gh = "application/vnd.ms-office.vbaProject";
function _h(e) {
  var t = Ue.utils.cfb_new({ root: "R" });
  return e.FullPaths.forEach(function(r, n) {
    if (!(r.slice(-1) === "/" || !r.match(/_VBA_PROJECT_CUR/))) {
      var a = r.replace(/^[^\/]*/, "R").replace(/\/_VBA_PROJECT_CUR\u0000*/, "");
      Ue.utils.cfb_add(t, a, e.FileIndex[n].content);
    }
  }), Ue.write(t);
}
function wh() {
  return { "!type": "dialog" };
}
function kh() {
  return { "!type": "dialog" };
}
function Eh() {
  return { "!type": "macro" };
}
function Th() {
  return { "!type": "macro" };
}
var Tt = /* @__PURE__ */ (function() {
  var e = /(^|[^A-Za-z_])R(\[?-?\d+\]|[1-9]\d*|)C(\[?-?\d+\]|[1-9]\d*|)(?![A-Za-z0-9_])/g, t = { r: 0, c: 0 };
  function r(n, a, i, f) {
    var s = !1, c = !1;
    i.length == 0 ? c = !0 : i.charAt(0) == "[" && (c = !0, i = i.slice(1, -1)), f.length == 0 ? s = !0 : f.charAt(0) == "[" && (s = !0, f = f.slice(1, -1));
    var o = i.length > 0 ? parseInt(i, 10) | 0 : 0, u = f.length > 0 ? parseInt(f, 10) | 0 : 0;
    return s ? u += t.c : --u, c ? o += t.r : --o, a + (s ? "" : "$") + He(u) + (c ? "" : "$") + Ge(o);
  }
  return function(a, i) {
    return t = i, a.replace(e, r);
  };
})(), Kn = /(^|[^._A-Z0-9])(\$?)([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])(\$?)(\d{1,7})(?![_.\(A-Za-z0-9])/g;
try {
  Kn = /(^|[^._A-Z0-9])([$]?)([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])([$]?)(10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6]|[1-9]\d{0,5})(?![_.\(A-Za-z0-9])/g;
} catch {
}
var yh = /* @__PURE__ */ (function() {
  return function(t, r) {
    return t.replace(Kn, function(n, a, i, f, s, c) {
      var o = Hn(f) - (i ? 0 : r.c), u = Wn(c) - (s ? 0 : r.r), m = s == "$" ? u + 1 : u == 0 ? "" : "[" + u + "]", x = i == "$" ? o + 1 : o == 0 ? "" : "[" + o + "]";
      return a + "R" + m + "C" + x;
    });
  };
})();
function gs(e, t) {
  return e.replace(Kn, function(r, n, a, i, f, s) {
    return n + (a == "$" ? a + i : He(Hn(i) + t.c)) + (f == "$" ? f + s : Ge(Wn(s) + t.r));
  });
}
function Hi(e, t, r) {
  var n = It(t), a = n.s, i = _r(r), f = { r: i.r - a.r, c: i.c - a.c };
  return gs(e, f);
}
function Ah(e) {
  return e.length != 1;
}
function Vi(e) {
  return e.replace(/_xlfn\./g, "");
}
function er(e) {
  e.l += 1;
}
function ht(e, t) {
  var r = e.read_shift(2);
  return [r & 16383, r >> 14 & 1, r >> 15 & 1];
}
function _s(e, t, r) {
  var n = 2;
  if (r) {
    if (r.biff >= 2 && r.biff <= 5) return ws(e);
    r.biff == 12 && (n = 4);
  }
  var a = e.read_shift(n), i = e.read_shift(n), f = ht(e), s = ht(e);
  return { s: { r: a, c: f[0], cRel: f[1], rRel: f[2] }, e: { r: i, c: s[0], cRel: s[1], rRel: s[2] } };
}
function ws(e) {
  var t = ht(e), r = ht(e), n = e.read_shift(1), a = e.read_shift(1);
  return { s: { r: t[0], c: n, cRel: t[1], rRel: t[2] }, e: { r: r[0], c: a, cRel: r[1], rRel: r[2] } };
}
function Fh(e, t, r) {
  if (r.biff < 8) return ws(e);
  var n = e.read_shift(r.biff == 12 ? 4 : 2), a = e.read_shift(r.biff == 12 ? 4 : 2), i = ht(e), f = ht(e);
  return { s: { r: n, c: i[0], cRel: i[1], rRel: i[2] }, e: { r: a, c: f[0], cRel: f[1], rRel: f[2] } };
}
function ks(e, t, r) {
  if (r && r.biff >= 2 && r.biff <= 5) return Sh(e);
  var n = e.read_shift(r && r.biff == 12 ? 4 : 2), a = ht(e);
  return { r: n, c: a[0], cRel: a[1], rRel: a[2] };
}
function Sh(e) {
  var t = ht(e), r = e.read_shift(1);
  return { r: t[0], c: r, cRel: t[1], rRel: t[2] };
}
function Ch(e) {
  var t = e.read_shift(2), r = e.read_shift(2);
  return { r: t, c: r & 255, fQuoted: !!(r & 16384), cRel: r >> 15, rRel: r >> 15 };
}
function bh(e, t, r) {
  var n = r && r.biff ? r.biff : 8;
  if (n >= 2 && n <= 5) return Ih(e);
  var a = e.read_shift(n >= 12 ? 4 : 2), i = e.read_shift(2), f = (i & 16384) >> 14, s = (i & 32768) >> 15;
  if (i &= 16383, s == 1) for (; a > 524287; ) a -= 1048576;
  if (f == 1) for (; i > 8191; ) i = i - 16384;
  return { r: a, c: i, cRel: f, rRel: s };
}
function Ih(e) {
  var t = e.read_shift(2), r = e.read_shift(1), n = (t & 32768) >> 15, a = (t & 16384) >> 14;
  return t &= 16383, n == 1 && t >= 8192 && (t = t - 16384), a == 1 && r >= 128 && (r = r - 256), { r: t, c: r, cRel: a, rRel: n };
}
function Oh(e, t, r) {
  var n = (e[e.l++] & 96) >> 5, a = _s(e, r.biff >= 2 && r.biff <= 5 ? 6 : 8, r);
  return [n, a];
}
function Dh(e, t, r) {
  var n = (e[e.l++] & 96) >> 5, a = e.read_shift(2, "i"), i = 8;
  if (r) switch (r.biff) {
    case 5:
      e.l += 12, i = 6;
      break;
    case 12:
      i = 12;
      break;
  }
  var f = _s(e, i, r);
  return [n, a, f];
}
function Rh(e, t, r) {
  var n = (e[e.l++] & 96) >> 5;
  return e.l += r && r.biff > 8 ? 12 : r.biff < 8 ? 6 : 8, [n];
}
function Nh(e, t, r) {
  var n = (e[e.l++] & 96) >> 5, a = e.read_shift(2), i = 8;
  if (r) switch (r.biff) {
    case 5:
      e.l += 12, i = 6;
      break;
    case 12:
      i = 12;
      break;
  }
  return e.l += i, [n, a];
}
function Ph(e, t, r) {
  var n = (e[e.l++] & 96) >> 5, a = Fh(e, t - 1, r);
  return [n, a];
}
function Bh(e, t, r) {
  var n = (e[e.l++] & 96) >> 5;
  return e.l += r.biff == 2 ? 6 : r.biff == 12 ? 14 : 7, [n];
}
function Gi(e) {
  var t = e[e.l + 1] & 1, r = 1;
  return e.l += 4, [t, r];
}
function Lh(e, t, r) {
  e.l += 2;
  for (var n = e.read_shift(r && r.biff == 2 ? 1 : 2), a = [], i = 0; i <= n; ++i) a.push(e.read_shift(r && r.biff == 2 ? 1 : 2));
  return a;
}
function Mh(e, t, r) {
  var n = e[e.l + 1] & 255 ? 1 : 0;
  return e.l += 2, [n, e.read_shift(r && r.biff == 2 ? 1 : 2)];
}
function Uh(e, t, r) {
  var n = e[e.l + 1] & 255 ? 1 : 0;
  return e.l += 2, [n, e.read_shift(r && r.biff == 2 ? 1 : 2)];
}
function zh(e) {
  var t = e[e.l + 1] & 255 ? 1 : 0;
  return e.l += 2, [t, e.read_shift(2)];
}
function Wh(e, t, r) {
  var n = e[e.l + 1] & 255 ? 1 : 0;
  return e.l += r && r.biff == 2 ? 3 : 4, [n];
}
function Es(e) {
  var t = e.read_shift(1), r = e.read_shift(1);
  return [t, r];
}
function Hh(e) {
  return e.read_shift(2), Es(e);
}
function Vh(e) {
  return e.read_shift(2), Es(e);
}
function Gh(e, t, r) {
  var n = (e[e.l] & 96) >> 5;
  e.l += 1;
  var a = ks(e, 0, r);
  return [n, a];
}
function Xh(e, t, r) {
  var n = (e[e.l] & 96) >> 5;
  e.l += 1;
  var a = bh(e, 0, r);
  return [n, a];
}
function $h(e, t, r) {
  var n = (e[e.l] & 96) >> 5;
  e.l += 1;
  var a = e.read_shift(2);
  r && r.biff == 5 && (e.l += 12);
  var i = ks(e, 0, r);
  return [n, a, i];
}
function jh(e, t, r) {
  var n = (e[e.l] & 96) >> 5;
  e.l += 1;
  var a = e.read_shift(r && r.biff <= 3 ? 1 : 2);
  return [K1[a], As[a], n];
}
function Kh(e, t, r) {
  var n = e[e.l++], a = e.read_shift(1), i = r && r.biff <= 3 ? [n == 88 ? -1 : 0, e.read_shift(1)] : Yh(e);
  return [a, (i[0] === 0 ? As : j1)[i[1]]];
}
function Yh(e) {
  return [e[e.l + 1] >> 7, e.read_shift(2) & 32767];
}
function Zh(e, t, r) {
  e.l += r && r.biff == 2 ? 3 : 4;
}
function Qh(e, t, r) {
  if (e.l++, r && r.biff == 12) return [e.read_shift(4, "i"), 0];
  var n = e.read_shift(2), a = e.read_shift(r && r.biff == 2 ? 1 : 2);
  return [n, a];
}
function Jh(e) {
  return e.l++, Sr[e.read_shift(1)];
}
function qh(e) {
  return e.l++, e.read_shift(2);
}
function e1(e) {
  return e.l++, e.read_shift(1) !== 0;
}
function r1(e) {
  return e.l++, gr(e);
}
function t1(e, t, r) {
  return e.l++, Wt(e, t - 1, r);
}
function a1(e, t) {
  var r = [e.read_shift(1)];
  if (t == 12) switch (r[0]) {
    case 2:
      r[0] = 4;
      break;
    /* SerBool */
    case 4:
      r[0] = 16;
      break;
    /* SerErr */
    case 0:
      r[0] = 1;
      break;
    /* SerNum */
    case 1:
      r[0] = 2;
      break;
  }
  switch (r[0]) {
    case 4:
      r[1] = Qe(e, 1) ? "TRUE" : "FALSE", t != 12 && (e.l += 7);
      break;
    case 37:
    /* appears to be an alias */
    case 16:
      r[1] = Sr[e[e.l]], e.l += t == 12 ? 4 : 8;
      break;
    case 0:
      e.l += 8;
      break;
    case 1:
      r[1] = gr(e);
      break;
    case 2:
      r[1] = Rt(e, 0, { biff: t > 0 && t < 8 ? 2 : t });
      break;
    default:
      throw new Error("Bad SerAr: " + r[0]);
  }
  return r;
}
function n1(e, t, r) {
  for (var n = e.read_shift(r.biff == 12 ? 4 : 2), a = [], i = 0; i != n; ++i) a.push((r.biff == 12 ? Dt : nn)(e));
  return a;
}
function i1(e, t, r) {
  var n = 0, a = 0;
  r.biff == 12 ? (n = e.read_shift(4), a = e.read_shift(4)) : (a = 1 + e.read_shift(1), n = 1 + e.read_shift(2)), r.biff >= 2 && r.biff < 8 && (--n, --a == 0 && (a = 256));
  for (var i = 0, f = []; i != n && (f[i] = []); ++i)
    for (var s = 0; s != a; ++s) f[i][s] = a1(e, r.biff);
  return f;
}
function s1(e, t, r) {
  var n = e.read_shift(1) >>> 5 & 3, a = !r || r.biff >= 8 ? 4 : 2, i = e.read_shift(a);
  switch (r.biff) {
    case 2:
      e.l += 5;
      break;
    case 3:
    case 4:
      e.l += 8;
      break;
    case 5:
      e.l += 12;
      break;
  }
  return [n, 0, i];
}
function f1(e, t, r) {
  if (r.biff == 5) return c1(e);
  var n = e.read_shift(1) >>> 5 & 3, a = e.read_shift(2), i = e.read_shift(4);
  return [n, a, i];
}
function c1(e) {
  var t = e.read_shift(1) >>> 5 & 3, r = e.read_shift(2, "i");
  e.l += 8;
  var n = e.read_shift(2);
  return e.l += 12, [t, r, n];
}
function o1(e, t, r) {
  var n = e.read_shift(1) >>> 5 & 3;
  e.l += r && r.biff == 2 ? 3 : 4;
  var a = e.read_shift(r && r.biff == 2 ? 1 : 2);
  return [n, a];
}
function l1(e, t, r) {
  var n = e.read_shift(1) >>> 5 & 3, a = e.read_shift(r && r.biff == 2 ? 1 : 2);
  return [n, a];
}
function u1(e, t, r) {
  var n = e.read_shift(1) >>> 5 & 3;
  return e.l += 4, r.biff < 8 && e.l--, r.biff == 12 && (e.l += 2), [n];
}
function h1(e, t, r) {
  var n = (e[e.l++] & 96) >> 5, a = e.read_shift(2), i = 4;
  if (r) switch (r.biff) {
    case 5:
      i = 15;
      break;
    case 12:
      i = 6;
      break;
  }
  return e.l += i, [n, a];
}
var d1 = kr, x1 = kr, p1 = kr;
function _a(e, t, r) {
  return e.l += 2, [Ch(e)];
}
function Yn(e) {
  return e.l += 6, [];
}
var m1 = _a, v1 = Yn, g1 = Yn, _1 = _a;
function Ts(e) {
  return e.l += 2, [Ze(e), e.read_shift(2) & 1];
}
var w1 = _a, k1 = Ts, E1 = Yn, T1 = _a, y1 = _a, A1 = [
  "Data",
  "All",
  "Headers",
  "??",
  "?Data2",
  "??",
  "?DataHeaders",
  "??",
  "Totals",
  "??",
  "??",
  "??",
  "?DataTotals",
  "??",
  "??",
  "??",
  "?Current"
];
function F1(e) {
  e.l += 2;
  var t = e.read_shift(2), r = e.read_shift(2), n = e.read_shift(4), a = e.read_shift(2), i = e.read_shift(2), f = A1[r >> 2 & 31];
  return { ixti: t, coltype: r & 3, rt: f, idx: n, c: a, C: i };
}
function S1(e) {
  return e.l += 2, [e.read_shift(4)];
}
function C1(e, t, r) {
  return e.l += 5, e.l += 2, e.l += r.biff == 2 ? 1 : 4, ["PTGSHEET"];
}
function b1(e, t, r) {
  return e.l += r.biff == 2 ? 4 : 5, ["PTGENDSHEET"];
}
function I1(e) {
  var t = e.read_shift(1) >>> 5 & 3, r = e.read_shift(2);
  return [t, r];
}
function O1(e) {
  var t = e.read_shift(1) >>> 5 & 3, r = e.read_shift(2);
  return [t, r];
}
function D1(e) {
  return e.l += 4, [0, 0];
}
var Xi = {
  1: { n: "PtgExp", f: Qh },
  2: { n: "PtgTbl", f: p1 },
  3: { n: "PtgAdd", f: er },
  4: { n: "PtgSub", f: er },
  5: { n: "PtgMul", f: er },
  6: { n: "PtgDiv", f: er },
  7: { n: "PtgPower", f: er },
  8: { n: "PtgConcat", f: er },
  9: { n: "PtgLt", f: er },
  10: { n: "PtgLe", f: er },
  11: { n: "PtgEq", f: er },
  12: { n: "PtgGe", f: er },
  13: { n: "PtgGt", f: er },
  14: { n: "PtgNe", f: er },
  15: { n: "PtgIsect", f: er },
  16: { n: "PtgUnion", f: er },
  17: { n: "PtgRange", f: er },
  18: { n: "PtgUplus", f: er },
  19: { n: "PtgUminus", f: er },
  20: { n: "PtgPercent", f: er },
  21: { n: "PtgParen", f: er },
  22: { n: "PtgMissArg", f: er },
  23: { n: "PtgStr", f: t1 },
  26: { n: "PtgSheet", f: C1 },
  27: { n: "PtgEndSheet", f: b1 },
  28: { n: "PtgErr", f: Jh },
  29: { n: "PtgBool", f: e1 },
  30: { n: "PtgInt", f: qh },
  31: { n: "PtgNum", f: r1 },
  32: { n: "PtgArray", f: Bh },
  33: { n: "PtgFunc", f: jh },
  34: { n: "PtgFuncVar", f: Kh },
  35: { n: "PtgName", f: s1 },
  36: { n: "PtgRef", f: Gh },
  37: { n: "PtgArea", f: Oh },
  38: { n: "PtgMemArea", f: o1 },
  39: { n: "PtgMemErr", f: d1 },
  40: { n: "PtgMemNoMem", f: x1 },
  41: { n: "PtgMemFunc", f: l1 },
  42: { n: "PtgRefErr", f: u1 },
  43: { n: "PtgAreaErr", f: Rh },
  44: { n: "PtgRefN", f: Xh },
  45: { n: "PtgAreaN", f: Ph },
  46: { n: "PtgMemAreaN", f: I1 },
  47: { n: "PtgMemNoMemN", f: O1 },
  57: { n: "PtgNameX", f: f1 },
  58: { n: "PtgRef3d", f: $h },
  59: { n: "PtgArea3d", f: Dh },
  60: { n: "PtgRefErr3d", f: h1 },
  61: { n: "PtgAreaErr3d", f: Nh },
  255: {}
}, R1 = {
  64: 32,
  96: 32,
  65: 33,
  97: 33,
  66: 34,
  98: 34,
  67: 35,
  99: 35,
  68: 36,
  100: 36,
  69: 37,
  101: 37,
  70: 38,
  102: 38,
  71: 39,
  103: 39,
  72: 40,
  104: 40,
  73: 41,
  105: 41,
  74: 42,
  106: 42,
  75: 43,
  107: 43,
  76: 44,
  108: 44,
  77: 45,
  109: 45,
  78: 46,
  110: 46,
  79: 47,
  111: 47,
  88: 34,
  120: 34,
  89: 57,
  121: 57,
  90: 58,
  122: 58,
  91: 59,
  123: 59,
  92: 60,
  124: 60,
  93: 61,
  125: 61
}, N1 = {
  1: { n: "PtgElfLel", f: Ts },
  2: { n: "PtgElfRw", f: T1 },
  3: { n: "PtgElfCol", f: m1 },
  6: { n: "PtgElfRwV", f: y1 },
  7: { n: "PtgElfColV", f: _1 },
  10: { n: "PtgElfRadical", f: w1 },
  11: { n: "PtgElfRadicalS", f: E1 },
  13: { n: "PtgElfColS", f: v1 },
  15: { n: "PtgElfColSV", f: g1 },
  16: { n: "PtgElfRadicalLel", f: k1 },
  25: { n: "PtgList", f: F1 },
  29: { n: "PtgSxName", f: S1 },
  255: {}
}, P1 = {
  0: { n: "PtgAttrNoop", f: D1 },
  1: { n: "PtgAttrSemi", f: Wh },
  2: { n: "PtgAttrIf", f: Uh },
  4: { n: "PtgAttrChoose", f: Lh },
  8: { n: "PtgAttrGoto", f: Mh },
  16: { n: "PtgAttrSum", f: Zh },
  32: { n: "PtgAttrBaxcel", f: Gi },
  33: { n: "PtgAttrBaxcel", f: Gi },
  64: { n: "PtgAttrSpace", f: Hh },
  65: { n: "PtgAttrSpaceSemi", f: Vh },
  128: { n: "PtgAttrIfError", f: zh },
  255: {}
};
function wa(e, t, r, n) {
  if (n.biff < 8) return kr(e, t);
  for (var a = e.l + t, i = [], f = 0; f !== r.length; ++f)
    switch (r[f][0]) {
      case "PtgArray":
        r[f][1] = i1(e, 0, n), i.push(r[f][1]);
        break;
      case "PtgMemArea":
        r[f][2] = n1(e, r[f][1], n), i.push(r[f][2]);
        break;
      case "PtgExp":
        n && n.biff == 12 && (r[f][1][1] = e.read_shift(4), i.push(r[f][1]));
        break;
      case "PtgList":
      /* TODO: PtgList -> PtgExtraList */
      case "PtgElfRadicalS":
      /* TODO: PtgElfRadicalS -> PtgExtraElf */
      case "PtgElfColS":
      /* TODO: PtgElfColS -> PtgExtraElf */
      case "PtgElfColSV":
        throw "Unsupported " + r[f][0];
    }
  return t = a - e.l, t !== 0 && i.push(kr(e, t)), i;
}
function ka(e, t, r) {
  for (var n = e.l + t, a, i, f = []; n != e.l; )
    t = n - e.l, i = e[e.l], a = Xi[i] || Xi[R1[i]], (i === 24 || i === 25) && (a = (i === 24 ? N1 : P1)[e[e.l + 1]]), !a || !a.f ? kr(e, t) : f.push([a.n, a.f(e, t, r)]);
  return f;
}
function B1(e) {
  for (var t = [], r = 0; r < e.length; ++r) {
    for (var n = e[r], a = [], i = 0; i < n.length; ++i) {
      var f = n[i];
      if (f) switch (f[0]) {
        // TODO: handle embedded quotes
        case 2:
          a.push('"' + f[1].replace(/"/g, '""') + '"');
          break;
        default:
          a.push(f[1]);
      }
      else a.push("");
    }
    t.push(a.join(","));
  }
  return t.join(";");
}
var L1 = {
  PtgAdd: "+",
  PtgConcat: "&",
  PtgDiv: "/",
  PtgEq: "=",
  PtgGe: ">=",
  PtgGt: ">",
  PtgLe: "<=",
  PtgLt: "<",
  PtgMul: "*",
  PtgNe: "<>",
  PtgPower: "^",
  PtgSub: "-"
};
function M1(e, t) {
  var r = e.lastIndexOf("!"), n = t.lastIndexOf("!");
  return r == -1 && n == -1 ? e + ":" + t : r > 0 && n > 0 && e.slice(0, r).toLowerCase() == t.slice(0, n).toLowerCase() ? e + ":" + t.slice(n + 1) : (console.error("Cannot hydrate range", e, t), e + ":" + t);
}
function ys(e, t, r) {
  if (!e) return "SH33TJSERR0";
  if (r.biff > 8 && (!e.XTI || !e.XTI[t])) return e.SheetNames[t];
  if (!e.XTI) return "SH33TJSERR6";
  var n = e.XTI[t];
  if (r.biff < 8)
    return t > 1e4 && (t -= 65536), t < 0 && (t = -t), t == 0 ? "" : e.XTI[t - 1];
  if (!n) return "SH33TJSERR1";
  var a = "";
  if (r.biff > 8) switch (e[n[0]][0]) {
    case 357:
      return a = n[1] == -1 ? "#REF" : e.SheetNames[n[1]], n[1] == n[2] ? a : a + ":" + e.SheetNames[n[2]];
    case 358:
      return r.SID != null ? e.SheetNames[r.SID] : "SH33TJSSAME" + e[n[0]][0];
    case 355:
    /* 'BrtSupBookSrc' */
    /* falls through */
    default:
      return "SH33TJSSRC" + e[n[0]][0];
  }
  switch (e[n[0]][0][0]) {
    case 1025:
      return a = n[1] == -1 ? "#REF" : e.SheetNames[n[1]] || "SH33TJSERR3", n[1] == n[2] ? a : a + ":" + e.SheetNames[n[2]];
    case 14849:
      return e[n[0]].slice(1).map(function(i) {
        return i.Name;
      }).join(";;");
    //return "SH33TJSERR8";
    default:
      return e[n[0]][0][3] ? (a = n[1] == -1 ? "#REF" : e[n[0]][0][3][n[1]] || "SH33TJSERR4", n[1] == n[2] ? a : a + ":" + e[n[0]][0][3][n[2]]) : "SH33TJSERR2";
  }
}
function $i(e, t, r) {
  var n = ys(e, t, r);
  return n == "#REF" ? n : Bc(n, r);
}
function vr(e, t, r, n, a) {
  var i = a && a.biff || 8, f = (
    /*range != null ? range :*/
    { s: { c: 0, r: 0 } }
  ), s = [], c, o, u, m = 0, x = 0, l, v = "";
  if (!e[0] || !e[0][0]) return "";
  for (var p = -1, d = "", h = 0, _ = e[0].length; h < _; ++h) {
    var g = e[0][h];
    switch (g[0]) {
      case "PtgUminus":
        s.push("-" + s.pop());
        break;
      case "PtgUplus":
        s.push("+" + s.pop());
        break;
      case "PtgPercent":
        s.push(s.pop() + "%");
        break;
      case "PtgAdd":
      /* [MS-XLS] 2.5.198.26 */
      case "PtgConcat":
      /* [MS-XLS] 2.5.198.43 */
      case "PtgDiv":
      /* [MS-XLS] 2.5.198.45 */
      case "PtgEq":
      /* [MS-XLS] 2.5.198.56 */
      case "PtgGe":
      /* [MS-XLS] 2.5.198.64 */
      case "PtgGt":
      /* [MS-XLS] 2.5.198.65 */
      case "PtgLe":
      /* [MS-XLS] 2.5.198.68 */
      case "PtgLt":
      /* [MS-XLS] 2.5.198.69 */
      case "PtgMul":
      /* [MS-XLS] 2.5.198.75 */
      case "PtgNe":
      /* [MS-XLS] 2.5.198.78 */
      case "PtgPower":
      /* [MS-XLS] 2.5.198.82 */
      case "PtgSub":
        if (c = s.pop(), o = s.pop(), p >= 0) {
          switch (e[0][p][1][0]) {
            case 0:
              d = Me(" ", e[0][p][1][1]);
              break;
            case 1:
              d = Me("\r", e[0][p][1][1]);
              break;
            default:
              if (d = "", a.WTF) throw new Error("Unexpected PtgAttrSpaceType " + e[0][p][1][0]);
          }
          o = o + d, p = -1;
        }
        s.push(o + L1[g[0]] + c);
        break;
      case "PtgIsect":
        c = s.pop(), o = s.pop(), s.push(o + " " + c);
        break;
      case "PtgUnion":
        c = s.pop(), o = s.pop(), s.push(o + "," + c);
        break;
      case "PtgRange":
        c = s.pop(), o = s.pop(), s.push(M1(o, c));
        break;
      case "PtgAttrChoose":
        break;
      case "PtgAttrGoto":
        break;
      case "PtgAttrIf":
        break;
      case "PtgAttrIfError":
        break;
      case "PtgRef":
        u = qt(g[1][1], f, a), s.push(ea(u, i));
        break;
      case "PtgRefN":
        u = r ? qt(g[1][1], r, a) : g[1][1], s.push(ea(u, i));
        break;
      case "PtgRef3d":
        m = /*::Number(*/
        g[1][1], u = qt(g[1][2], f, a), v = $i(n, m, a), s.push(v + "!" + ea(u, i));
        break;
      case "PtgFunc":
      /* [MS-XLS] 2.5.198.62 */
      case "PtgFuncVar":
        var E = g[1][0], A = g[1][1];
        E || (E = 0), E &= 127;
        var P = E == 0 ? [] : s.slice(-E);
        s.length -= E, A === "User" && (A = P.shift()), s.push(A + "(" + P.join(",") + ")");
        break;
      case "PtgBool":
        s.push(g[1] ? "TRUE" : "FALSE");
        break;
      case "PtgInt":
        s.push(
          /*::String(*/
          g[1]
          /*::)*/
        );
        break;
      case "PtgNum":
        s.push(String(g[1]));
        break;
      case "PtgStr":
        s.push('"' + g[1].replace(/"/g, '""') + '"');
        break;
      case "PtgErr":
        s.push(
          /*::String(*/
          g[1]
          /*::)*/
        );
        break;
      case "PtgAreaN":
        l = yi(g[1][1], r ? { s: r } : f, a), s.push(dn(l, a));
        break;
      case "PtgArea":
        l = yi(g[1][1], f, a), s.push(dn(l, a));
        break;
      case "PtgArea3d":
        m = /*::Number(*/
        g[1][1], l = g[1][2], v = $i(n, m, a), s.push(v + "!" + dn(l, a));
        break;
      case "PtgAttrSum":
        s.push("SUM(" + s.pop() + ")");
        break;
      case "PtgAttrBaxcel":
      /* [MS-XLS] 2.5.198.33 */
      case "PtgAttrSemi":
        break;
      case "PtgName":
        x = g[1][2];
        var S = (n.names || [])[x - 1] || (n[0] || [])[x], R = S ? S.Name : "SH33TJSNAME" + String(x);
        R && R.slice(0, 6) == "_xlfn." && !a.xlfn && (R = R.slice(6)), s.push(R);
        break;
      case "PtgNameX":
        var F = g[1][1];
        x = g[1][2];
        var U;
        if (a.biff <= 5)
          F < 0 && (F = -F), n[F] && (U = n[F][x]);
        else {
          var H = "";
          if (((n[F] || [])[0] || [])[0] == 14849 || (((n[F] || [])[0] || [])[0] == 1025 ? n[F][x] && n[F][x].itab > 0 && (H = n.SheetNames[n[F][x].itab - 1] + "!") : H = n.SheetNames[x - 1] + "!"), n[F] && n[F][x]) H += n[F][x].Name;
          else if (n[0] && n[0][x]) H += n[0][x].Name;
          else {
            var y = (ys(n, F, a) || "").split(";;");
            y[x - 1] ? H = y[x - 1] : H += "SH33TJSERRX";
          }
          s.push(H);
          break;
        }
        U || (U = { Name: "SH33TJSERRY" }), s.push(U.Name);
        break;
      case "PtgParen":
        var W = "(", k = ")";
        if (p >= 0) {
          switch (d = "", e[0][p][1][0]) {
            // $FlowIgnore
            case 2:
              W = Me(" ", e[0][p][1][1]) + W;
              break;
            // $FlowIgnore
            case 3:
              W = Me("\r", e[0][p][1][1]) + W;
              break;
            // $FlowIgnore
            case 4:
              k = Me(" ", e[0][p][1][1]) + k;
              break;
            // $FlowIgnore
            case 5:
              k = Me("\r", e[0][p][1][1]) + k;
              break;
            default:
              if (a.WTF) throw new Error("Unexpected PtgAttrSpaceType " + e[0][p][1][0]);
          }
          p = -1;
        }
        s.push(W + s.pop() + k);
        break;
      case "PtgRefErr":
        s.push("#REF!");
        break;
      case "PtgRefErr3d":
        s.push("#REF!");
        break;
      case "PtgExp":
        u = { c: g[1][1], r: g[1][0] };
        var j = { c: r.c, r: r.r };
        if (n.sharedf[We(u)]) {
          var me = n.sharedf[We(u)];
          s.push(vr(me, f, j, n, a));
        } else {
          var Z = !1;
          for (c = 0; c != n.arrayf.length; ++c)
            if (o = n.arrayf[c], !(u.c < o[0].s.c || u.c > o[0].e.c) && !(u.r < o[0].s.r || u.r > o[0].e.r)) {
              s.push(vr(o[1], f, j, n, a)), Z = !0;
              break;
            }
          Z || s.push(
            /*::String(*/
            g[1]
            /*::)*/
          );
        }
        break;
      case "PtgArray":
        s.push("{" + B1(
          /*::(*/
          g[1]
          /*:: :any)*/
        ) + "}");
        break;
      case "PtgMemArea":
        break;
      case "PtgAttrSpace":
      /* [MS-XLS] 2.5.198.38 */
      case "PtgAttrSpaceSemi":
        p = h;
        break;
      case "PtgTbl":
        break;
      case "PtgMemErr":
        break;
      case "PtgMissArg":
        s.push("");
        break;
      case "PtgAreaErr":
        s.push("#REF!");
        break;
      case "PtgAreaErr3d":
        s.push("#REF!");
        break;
      case "PtgList":
        s.push("Table" + g[1].idx + "[#" + g[1].rt + "]");
        break;
      case "PtgMemAreaN":
      case "PtgMemNoMemN":
      case "PtgAttrNoop":
      case "PtgSheet":
      case "PtgEndSheet":
        break;
      case "PtgMemFunc":
        break;
      case "PtgMemNoMem":
        break;
      case "PtgElfCol":
      /* [MS-XLS] 2.5.198.46 */
      case "PtgElfColS":
      /* [MS-XLS] 2.5.198.47 */
      case "PtgElfColSV":
      /* [MS-XLS] 2.5.198.48 */
      case "PtgElfColV":
      /* [MS-XLS] 2.5.198.49 */
      case "PtgElfLel":
      /* [MS-XLS] 2.5.198.50 */
      case "PtgElfRadical":
      /* [MS-XLS] 2.5.198.51 */
      case "PtgElfRadicalLel":
      /* [MS-XLS] 2.5.198.52 */
      case "PtgElfRadicalS":
      /* [MS-XLS] 2.5.198.53 */
      case "PtgElfRw":
      /* [MS-XLS] 2.5.198.54 */
      case "PtgElfRwV":
        throw new Error("Unsupported ELFs");
      case "PtgSxName":
        throw new Error("Unrecognized Formula Token: " + String(g));
      default:
        throw new Error("Unrecognized Formula Token: " + String(g));
    }
    var xe = ["PtgAttrSpace", "PtgAttrSpaceSemi", "PtgAttrGoto"];
    if (a.biff != 3 && p >= 0 && xe.indexOf(e[0][h][0]) == -1) {
      g = e[0][p];
      var fe = !0;
      switch (g[1][0]) {
        /* note: some bad XLSB files omit the PtgParen */
        case 4:
          fe = !1;
        /* falls through */
        case 0:
          d = Me(" ", g[1][1]);
          break;
        case 5:
          fe = !1;
        /* falls through */
        case 1:
          d = Me("\r", g[1][1]);
          break;
        default:
          if (d = "", a.WTF) throw new Error("Unexpected PtgAttrSpaceType " + g[1][0]);
      }
      s.push((fe ? d : "") + s.pop() + (fe ? "" : d)), p = -1;
    }
  }
  if (s.length > 1 && a.WTF) throw new Error("bad formula stack");
  return s[0] == "TRUE" ? !0 : s[0] == "FALSE" ? !1 : s[0];
}
function U1(e, t, r) {
  var n = e.l + t, a = r.biff == 2 ? 1 : 2, i, f = e.read_shift(a);
  if (f == 65535) return [[], kr(e, t - 2)];
  var s = ka(e, f, r);
  return t !== f + a && (i = wa(e, t - f - a, s, r)), e.l = n, [s, i];
}
function z1(e, t, r) {
  var n = e.l + t, a = r.biff == 2 ? 1 : 2, i, f = e.read_shift(a);
  if (f == 65535) return [[], kr(e, t - 2)];
  var s = ka(e, f, r);
  return t !== f + a && (i = wa(e, t - f - a, s, r)), e.l = n, [s, i];
}
function W1(e, t, r, n) {
  var a = e.l + t, i = ka(e, n, r), f;
  return a !== e.l && (f = wa(e, a - e.l, i, r)), [i, f];
}
function H1(e, t, r) {
  var n = e.l + t, a, i = e.read_shift(2), f = ka(e, i, r);
  return i == 65535 ? [[], kr(e, t - 2)] : (t !== i + 2 && (a = wa(e, n - i - 2, f, r)), [f, a]);
}
function V1(e) {
  var t;
  if (rt(e, e.l + 6) !== 65535) return [gr(e), "n"];
  switch (e[e.l]) {
    case 0:
      return e.l += 8, ["String", "s"];
    case 1:
      return t = e[e.l + 2] === 1, e.l += 8, [t, "b"];
    case 2:
      return t = e[e.l + 2], e.l += 8, [t, "e"];
    case 3:
      return e.l += 8, ["", "s"];
  }
  return [];
}
function mn(e, t, r) {
  var n = e.l + t, a = jr(e, 6, r), i = V1(e), f = e.read_shift(1);
  r.biff != 2 && (e.read_shift(1), r.biff >= 5 && e.read_shift(4));
  var s = z1(e, n - e.l, r);
  return { cell: a, val: i[0], formula: s, shared: f >> 3 & 1, tt: i[1] };
}
function sn(e, t, r) {
  var n = e.read_shift(4), a = ka(e, n, r), i = e.read_shift(4), f = i > 0 ? wa(e, i, a, r) : null;
  return [a, f];
}
var G1 = sn, fn = sn, X1 = sn, $1 = sn, j1 = {
  0: "BEEP",
  1: "OPEN",
  2: "OPEN.LINKS",
  3: "CLOSE.ALL",
  4: "SAVE",
  5: "SAVE.AS",
  6: "FILE.DELETE",
  7: "PAGE.SETUP",
  8: "PRINT",
  9: "PRINTER.SETUP",
  10: "QUIT",
  11: "NEW.WINDOW",
  12: "ARRANGE.ALL",
  13: "WINDOW.SIZE",
  14: "WINDOW.MOVE",
  15: "FULL",
  16: "CLOSE",
  17: "RUN",
  22: "SET.PRINT.AREA",
  23: "SET.PRINT.TITLES",
  24: "SET.PAGE.BREAK",
  25: "REMOVE.PAGE.BREAK",
  26: "FONT",
  27: "DISPLAY",
  28: "PROTECT.DOCUMENT",
  29: "PRECISION",
  30: "A1.R1C1",
  31: "CALCULATE.NOW",
  32: "CALCULATION",
  34: "DATA.FIND",
  35: "EXTRACT",
  36: "DATA.DELETE",
  37: "SET.DATABASE",
  38: "SET.CRITERIA",
  39: "SORT",
  40: "DATA.SERIES",
  41: "TABLE",
  42: "FORMAT.NUMBER",
  43: "ALIGNMENT",
  44: "STYLE",
  45: "BORDER",
  46: "CELL.PROTECTION",
  47: "COLUMN.WIDTH",
  48: "UNDO",
  49: "CUT",
  50: "COPY",
  51: "PASTE",
  52: "CLEAR",
  53: "PASTE.SPECIAL",
  54: "EDIT.DELETE",
  55: "INSERT",
  56: "FILL.RIGHT",
  57: "FILL.DOWN",
  61: "DEFINE.NAME",
  62: "CREATE.NAMES",
  63: "FORMULA.GOTO",
  64: "FORMULA.FIND",
  65: "SELECT.LAST.CELL",
  66: "SHOW.ACTIVE.CELL",
  67: "GALLERY.AREA",
  68: "GALLERY.BAR",
  69: "GALLERY.COLUMN",
  70: "GALLERY.LINE",
  71: "GALLERY.PIE",
  72: "GALLERY.SCATTER",
  73: "COMBINATION",
  74: "PREFERRED",
  75: "ADD.OVERLAY",
  76: "GRIDLINES",
  77: "SET.PREFERRED",
  78: "AXES",
  79: "LEGEND",
  80: "ATTACH.TEXT",
  81: "ADD.ARROW",
  82: "SELECT.CHART",
  83: "SELECT.PLOT.AREA",
  84: "PATTERNS",
  85: "MAIN.CHART",
  86: "OVERLAY",
  87: "SCALE",
  88: "FORMAT.LEGEND",
  89: "FORMAT.TEXT",
  90: "EDIT.REPEAT",
  91: "PARSE",
  92: "JUSTIFY",
  93: "HIDE",
  94: "UNHIDE",
  95: "WORKSPACE",
  96: "FORMULA",
  97: "FORMULA.FILL",
  98: "FORMULA.ARRAY",
  99: "DATA.FIND.NEXT",
  100: "DATA.FIND.PREV",
  101: "FORMULA.FIND.NEXT",
  102: "FORMULA.FIND.PREV",
  103: "ACTIVATE",
  104: "ACTIVATE.NEXT",
  105: "ACTIVATE.PREV",
  106: "UNLOCKED.NEXT",
  107: "UNLOCKED.PREV",
  108: "COPY.PICTURE",
  109: "SELECT",
  110: "DELETE.NAME",
  111: "DELETE.FORMAT",
  112: "VLINE",
  113: "HLINE",
  114: "VPAGE",
  115: "HPAGE",
  116: "VSCROLL",
  117: "HSCROLL",
  118: "ALERT",
  119: "NEW",
  120: "CANCEL.COPY",
  121: "SHOW.CLIPBOARD",
  122: "MESSAGE",
  124: "PASTE.LINK",
  125: "APP.ACTIVATE",
  126: "DELETE.ARROW",
  127: "ROW.HEIGHT",
  128: "FORMAT.MOVE",
  129: "FORMAT.SIZE",
  130: "FORMULA.REPLACE",
  131: "SEND.KEYS",
  132: "SELECT.SPECIAL",
  133: "APPLY.NAMES",
  134: "REPLACE.FONT",
  135: "FREEZE.PANES",
  136: "SHOW.INFO",
  137: "SPLIT",
  138: "ON.WINDOW",
  139: "ON.DATA",
  140: "DISABLE.INPUT",
  142: "OUTLINE",
  143: "LIST.NAMES",
  144: "FILE.CLOSE",
  145: "SAVE.WORKBOOK",
  146: "DATA.FORM",
  147: "COPY.CHART",
  148: "ON.TIME",
  149: "WAIT",
  150: "FORMAT.FONT",
  151: "FILL.UP",
  152: "FILL.LEFT",
  153: "DELETE.OVERLAY",
  155: "SHORT.MENUS",
  159: "SET.UPDATE.STATUS",
  161: "COLOR.PALETTE",
  162: "DELETE.STYLE",
  163: "WINDOW.RESTORE",
  164: "WINDOW.MAXIMIZE",
  166: "CHANGE.LINK",
  167: "CALCULATE.DOCUMENT",
  168: "ON.KEY",
  169: "APP.RESTORE",
  170: "APP.MOVE",
  171: "APP.SIZE",
  172: "APP.MINIMIZE",
  173: "APP.MAXIMIZE",
  174: "BRING.TO.FRONT",
  175: "SEND.TO.BACK",
  185: "MAIN.CHART.TYPE",
  186: "OVERLAY.CHART.TYPE",
  187: "SELECT.END",
  188: "OPEN.MAIL",
  189: "SEND.MAIL",
  190: "STANDARD.FONT",
  191: "CONSOLIDATE",
  192: "SORT.SPECIAL",
  193: "GALLERY.3D.AREA",
  194: "GALLERY.3D.COLUMN",
  195: "GALLERY.3D.LINE",
  196: "GALLERY.3D.PIE",
  197: "VIEW.3D",
  198: "GOAL.SEEK",
  199: "WORKGROUP",
  200: "FILL.GROUP",
  201: "UPDATE.LINK",
  202: "PROMOTE",
  203: "DEMOTE",
  204: "SHOW.DETAIL",
  206: "UNGROUP",
  207: "OBJECT.PROPERTIES",
  208: "SAVE.NEW.OBJECT",
  209: "SHARE",
  210: "SHARE.NAME",
  211: "DUPLICATE",
  212: "APPLY.STYLE",
  213: "ASSIGN.TO.OBJECT",
  214: "OBJECT.PROTECTION",
  215: "HIDE.OBJECT",
  216: "SET.EXTRACT",
  217: "CREATE.PUBLISHER",
  218: "SUBSCRIBE.TO",
  219: "ATTRIBUTES",
  220: "SHOW.TOOLBAR",
  222: "PRINT.PREVIEW",
  223: "EDIT.COLOR",
  224: "SHOW.LEVELS",
  225: "FORMAT.MAIN",
  226: "FORMAT.OVERLAY",
  227: "ON.RECALC",
  228: "EDIT.SERIES",
  229: "DEFINE.STYLE",
  240: "LINE.PRINT",
  243: "ENTER.DATA",
  249: "GALLERY.RADAR",
  250: "MERGE.STYLES",
  251: "EDITION.OPTIONS",
  252: "PASTE.PICTURE",
  253: "PASTE.PICTURE.LINK",
  254: "SPELLING",
  256: "ZOOM",
  259: "INSERT.OBJECT",
  260: "WINDOW.MINIMIZE",
  265: "SOUND.NOTE",
  266: "SOUND.PLAY",
  267: "FORMAT.SHAPE",
  268: "EXTEND.POLYGON",
  269: "FORMAT.AUTO",
  272: "GALLERY.3D.BAR",
  273: "GALLERY.3D.SURFACE",
  274: "FILL.AUTO",
  276: "CUSTOMIZE.TOOLBAR",
  277: "ADD.TOOL",
  278: "EDIT.OBJECT",
  279: "ON.DOUBLECLICK",
  280: "ON.ENTRY",
  281: "WORKBOOK.ADD",
  282: "WORKBOOK.MOVE",
  283: "WORKBOOK.COPY",
  284: "WORKBOOK.OPTIONS",
  285: "SAVE.WORKSPACE",
  288: "CHART.WIZARD",
  289: "DELETE.TOOL",
  290: "MOVE.TOOL",
  291: "WORKBOOK.SELECT",
  292: "WORKBOOK.ACTIVATE",
  293: "ASSIGN.TO.TOOL",
  295: "COPY.TOOL",
  296: "RESET.TOOL",
  297: "CONSTRAIN.NUMERIC",
  298: "PASTE.TOOL",
  302: "WORKBOOK.NEW",
  305: "SCENARIO.CELLS",
  306: "SCENARIO.DELETE",
  307: "SCENARIO.ADD",
  308: "SCENARIO.EDIT",
  309: "SCENARIO.SHOW",
  310: "SCENARIO.SHOW.NEXT",
  311: "SCENARIO.SUMMARY",
  312: "PIVOT.TABLE.WIZARD",
  313: "PIVOT.FIELD.PROPERTIES",
  314: "PIVOT.FIELD",
  315: "PIVOT.ITEM",
  316: "PIVOT.ADD.FIELDS",
  318: "OPTIONS.CALCULATION",
  319: "OPTIONS.EDIT",
  320: "OPTIONS.VIEW",
  321: "ADDIN.MANAGER",
  322: "MENU.EDITOR",
  323: "ATTACH.TOOLBARS",
  324: "VBAActivate",
  325: "OPTIONS.CHART",
  328: "VBA.INSERT.FILE",
  330: "VBA.PROCEDURE.DEFINITION",
  336: "ROUTING.SLIP",
  338: "ROUTE.DOCUMENT",
  339: "MAIL.LOGON",
  342: "INSERT.PICTURE",
  343: "EDIT.TOOL",
  344: "GALLERY.DOUGHNUT",
  350: "CHART.TREND",
  352: "PIVOT.ITEM.PROPERTIES",
  354: "WORKBOOK.INSERT",
  355: "OPTIONS.TRANSITION",
  356: "OPTIONS.GENERAL",
  370: "FILTER.ADVANCED",
  373: "MAIL.ADD.MAILER",
  374: "MAIL.DELETE.MAILER",
  375: "MAIL.REPLY",
  376: "MAIL.REPLY.ALL",
  377: "MAIL.FORWARD",
  378: "MAIL.NEXT.LETTER",
  379: "DATA.LABEL",
  380: "INSERT.TITLE",
  381: "FONT.PROPERTIES",
  382: "MACRO.OPTIONS",
  383: "WORKBOOK.HIDE",
  384: "WORKBOOK.UNHIDE",
  385: "WORKBOOK.DELETE",
  386: "WORKBOOK.NAME",
  388: "GALLERY.CUSTOM",
  390: "ADD.CHART.AUTOFORMAT",
  391: "DELETE.CHART.AUTOFORMAT",
  392: "CHART.ADD.DATA",
  393: "AUTO.OUTLINE",
  394: "TAB.ORDER",
  395: "SHOW.DIALOG",
  396: "SELECT.ALL",
  397: "UNGROUP.SHEETS",
  398: "SUBTOTAL.CREATE",
  399: "SUBTOTAL.REMOVE",
  400: "RENAME.OBJECT",
  412: "WORKBOOK.SCROLL",
  413: "WORKBOOK.NEXT",
  414: "WORKBOOK.PREV",
  415: "WORKBOOK.TAB.SPLIT",
  416: "FULL.SCREEN",
  417: "WORKBOOK.PROTECT",
  420: "SCROLLBAR.PROPERTIES",
  421: "PIVOT.SHOW.PAGES",
  422: "TEXT.TO.COLUMNS",
  423: "FORMAT.CHARTTYPE",
  424: "LINK.FORMAT",
  425: "TRACER.DISPLAY",
  430: "TRACER.NAVIGATE",
  431: "TRACER.CLEAR",
  432: "TRACER.ERROR",
  433: "PIVOT.FIELD.GROUP",
  434: "PIVOT.FIELD.UNGROUP",
  435: "CHECKBOX.PROPERTIES",
  436: "LABEL.PROPERTIES",
  437: "LISTBOX.PROPERTIES",
  438: "EDITBOX.PROPERTIES",
  439: "PIVOT.REFRESH",
  440: "LINK.COMBO",
  441: "OPEN.TEXT",
  442: "HIDE.DIALOG",
  443: "SET.DIALOG.FOCUS",
  444: "ENABLE.OBJECT",
  445: "PUSHBUTTON.PROPERTIES",
  446: "SET.DIALOG.DEFAULT",
  447: "FILTER",
  448: "FILTER.SHOW.ALL",
  449: "CLEAR.OUTLINE",
  450: "FUNCTION.WIZARD",
  451: "ADD.LIST.ITEM",
  452: "SET.LIST.ITEM",
  453: "REMOVE.LIST.ITEM",
  454: "SELECT.LIST.ITEM",
  455: "SET.CONTROL.VALUE",
  456: "SAVE.COPY.AS",
  458: "OPTIONS.LISTS.ADD",
  459: "OPTIONS.LISTS.DELETE",
  460: "SERIES.AXES",
  461: "SERIES.X",
  462: "SERIES.Y",
  463: "ERRORBAR.X",
  464: "ERRORBAR.Y",
  465: "FORMAT.CHART",
  466: "SERIES.ORDER",
  467: "MAIL.LOGOFF",
  468: "CLEAR.ROUTING.SLIP",
  469: "APP.ACTIVATE.MICROSOFT",
  470: "MAIL.EDIT.MAILER",
  471: "ON.SHEET",
  472: "STANDARD.WIDTH",
  473: "SCENARIO.MERGE",
  474: "SUMMARY.INFO",
  475: "FIND.FILE",
  476: "ACTIVE.CELL.FONT",
  477: "ENABLE.TIPWIZARD",
  478: "VBA.MAKE.ADDIN",
  480: "INSERTDATATABLE",
  481: "WORKGROUP.OPTIONS",
  482: "MAIL.SEND.MAILER",
  485: "AUTOCORRECT",
  489: "POST.DOCUMENT",
  491: "PICKLIST",
  493: "VIEW.SHOW",
  494: "VIEW.DEFINE",
  495: "VIEW.DELETE",
  509: "SHEET.BACKGROUND",
  510: "INSERT.MAP.OBJECT",
  511: "OPTIONS.MENONO",
  517: "MSOCHECKS",
  518: "NORMAL",
  519: "LAYOUT",
  520: "RM.PRINT.AREA",
  521: "CLEAR.PRINT.AREA",
  522: "ADD.PRINT.AREA",
  523: "MOVE.BRK",
  545: "HIDECURR.NOTE",
  546: "HIDEALL.NOTES",
  547: "DELETE.NOTE",
  548: "TRAVERSE.NOTES",
  549: "ACTIVATE.NOTES",
  620: "PROTECT.REVISIONS",
  621: "UNPROTECT.REVISIONS",
  647: "OPTIONS.ME",
  653: "WEB.PUBLISH",
  667: "NEWWEBQUERY",
  673: "PIVOT.TABLE.CHART",
  753: "OPTIONS.SAVE",
  755: "OPTIONS.SPELL",
  808: "HIDEALL.INKANNOTS"
}, As = {
  0: "COUNT",
  1: "IF",
  2: "ISNA",
  3: "ISERROR",
  4: "SUM",
  5: "AVERAGE",
  6: "MIN",
  7: "MAX",
  8: "ROW",
  9: "COLUMN",
  10: "NA",
  11: "NPV",
  12: "STDEV",
  13: "DOLLAR",
  14: "FIXED",
  15: "SIN",
  16: "COS",
  17: "TAN",
  18: "ATAN",
  19: "PI",
  20: "SQRT",
  21: "EXP",
  22: "LN",
  23: "LOG10",
  24: "ABS",
  25: "INT",
  26: "SIGN",
  27: "ROUND",
  28: "LOOKUP",
  29: "INDEX",
  30: "REPT",
  31: "MID",
  32: "LEN",
  33: "VALUE",
  34: "TRUE",
  35: "FALSE",
  36: "AND",
  37: "OR",
  38: "NOT",
  39: "MOD",
  40: "DCOUNT",
  41: "DSUM",
  42: "DAVERAGE",
  43: "DMIN",
  44: "DMAX",
  45: "DSTDEV",
  46: "VAR",
  47: "DVAR",
  48: "TEXT",
  49: "LINEST",
  50: "TREND",
  51: "LOGEST",
  52: "GROWTH",
  53: "GOTO",
  54: "HALT",
  55: "RETURN",
  56: "PV",
  57: "FV",
  58: "NPER",
  59: "PMT",
  60: "RATE",
  61: "MIRR",
  62: "IRR",
  63: "RAND",
  64: "MATCH",
  65: "DATE",
  66: "TIME",
  67: "DAY",
  68: "MONTH",
  69: "YEAR",
  70: "WEEKDAY",
  71: "HOUR",
  72: "MINUTE",
  73: "SECOND",
  74: "NOW",
  75: "AREAS",
  76: "ROWS",
  77: "COLUMNS",
  78: "OFFSET",
  79: "ABSREF",
  80: "RELREF",
  81: "ARGUMENT",
  82: "SEARCH",
  83: "TRANSPOSE",
  84: "ERROR",
  85: "STEP",
  86: "TYPE",
  87: "ECHO",
  88: "SET.NAME",
  89: "CALLER",
  90: "DEREF",
  91: "WINDOWS",
  92: "SERIES",
  93: "DOCUMENTS",
  94: "ACTIVE.CELL",
  95: "SELECTION",
  96: "RESULT",
  97: "ATAN2",
  98: "ASIN",
  99: "ACOS",
  100: "CHOOSE",
  101: "HLOOKUP",
  102: "VLOOKUP",
  103: "LINKS",
  104: "INPUT",
  105: "ISREF",
  106: "GET.FORMULA",
  107: "GET.NAME",
  108: "SET.VALUE",
  109: "LOG",
  110: "EXEC",
  111: "CHAR",
  112: "LOWER",
  113: "UPPER",
  114: "PROPER",
  115: "LEFT",
  116: "RIGHT",
  117: "EXACT",
  118: "TRIM",
  119: "REPLACE",
  120: "SUBSTITUTE",
  121: "CODE",
  122: "NAMES",
  123: "DIRECTORY",
  124: "FIND",
  125: "CELL",
  126: "ISERR",
  127: "ISTEXT",
  128: "ISNUMBER",
  129: "ISBLANK",
  130: "T",
  131: "N",
  132: "FOPEN",
  133: "FCLOSE",
  134: "FSIZE",
  135: "FREADLN",
  136: "FREAD",
  137: "FWRITELN",
  138: "FWRITE",
  139: "FPOS",
  140: "DATEVALUE",
  141: "TIMEVALUE",
  142: "SLN",
  143: "SYD",
  144: "DDB",
  145: "GET.DEF",
  146: "REFTEXT",
  147: "TEXTREF",
  148: "INDIRECT",
  149: "REGISTER",
  150: "CALL",
  151: "ADD.BAR",
  152: "ADD.MENU",
  153: "ADD.COMMAND",
  154: "ENABLE.COMMAND",
  155: "CHECK.COMMAND",
  156: "RENAME.COMMAND",
  157: "SHOW.BAR",
  158: "DELETE.MENU",
  159: "DELETE.COMMAND",
  160: "GET.CHART.ITEM",
  161: "DIALOG.BOX",
  162: "CLEAN",
  163: "MDETERM",
  164: "MINVERSE",
  165: "MMULT",
  166: "FILES",
  167: "IPMT",
  168: "PPMT",
  169: "COUNTA",
  170: "CANCEL.KEY",
  171: "FOR",
  172: "WHILE",
  173: "BREAK",
  174: "NEXT",
  175: "INITIATE",
  176: "REQUEST",
  177: "POKE",
  178: "EXECUTE",
  179: "TERMINATE",
  180: "RESTART",
  181: "HELP",
  182: "GET.BAR",
  183: "PRODUCT",
  184: "FACT",
  185: "GET.CELL",
  186: "GET.WORKSPACE",
  187: "GET.WINDOW",
  188: "GET.DOCUMENT",
  189: "DPRODUCT",
  190: "ISNONTEXT",
  191: "GET.NOTE",
  192: "NOTE",
  193: "STDEVP",
  194: "VARP",
  195: "DSTDEVP",
  196: "DVARP",
  197: "TRUNC",
  198: "ISLOGICAL",
  199: "DCOUNTA",
  200: "DELETE.BAR",
  201: "UNREGISTER",
  204: "USDOLLAR",
  205: "FINDB",
  206: "SEARCHB",
  207: "REPLACEB",
  208: "LEFTB",
  209: "RIGHTB",
  210: "MIDB",
  211: "LENB",
  212: "ROUNDUP",
  213: "ROUNDDOWN",
  214: "ASC",
  215: "DBCS",
  216: "RANK",
  219: "ADDRESS",
  220: "DAYS360",
  221: "TODAY",
  222: "VDB",
  223: "ELSE",
  224: "ELSE.IF",
  225: "END.IF",
  226: "FOR.CELL",
  227: "MEDIAN",
  228: "SUMPRODUCT",
  229: "SINH",
  230: "COSH",
  231: "TANH",
  232: "ASINH",
  233: "ACOSH",
  234: "ATANH",
  235: "DGET",
  236: "CREATE.OBJECT",
  237: "VOLATILE",
  238: "LAST.ERROR",
  239: "CUSTOM.UNDO",
  240: "CUSTOM.REPEAT",
  241: "FORMULA.CONVERT",
  242: "GET.LINK.INFO",
  243: "TEXT.BOX",
  244: "INFO",
  245: "GROUP",
  246: "GET.OBJECT",
  247: "DB",
  248: "PAUSE",
  251: "RESUME",
  252: "FREQUENCY",
  253: "ADD.TOOLBAR",
  254: "DELETE.TOOLBAR",
  255: "User",
  256: "RESET.TOOLBAR",
  257: "EVALUATE",
  258: "GET.TOOLBAR",
  259: "GET.TOOL",
  260: "SPELLING.CHECK",
  261: "ERROR.TYPE",
  262: "APP.TITLE",
  263: "WINDOW.TITLE",
  264: "SAVE.TOOLBAR",
  265: "ENABLE.TOOL",
  266: "PRESS.TOOL",
  267: "REGISTER.ID",
  268: "GET.WORKBOOK",
  269: "AVEDEV",
  270: "BETADIST",
  271: "GAMMALN",
  272: "BETAINV",
  273: "BINOMDIST",
  274: "CHIDIST",
  275: "CHIINV",
  276: "COMBIN",
  277: "CONFIDENCE",
  278: "CRITBINOM",
  279: "EVEN",
  280: "EXPONDIST",
  281: "FDIST",
  282: "FINV",
  283: "FISHER",
  284: "FISHERINV",
  285: "FLOOR",
  286: "GAMMADIST",
  287: "GAMMAINV",
  288: "CEILING",
  289: "HYPGEOMDIST",
  290: "LOGNORMDIST",
  291: "LOGINV",
  292: "NEGBINOMDIST",
  293: "NORMDIST",
  294: "NORMSDIST",
  295: "NORMINV",
  296: "NORMSINV",
  297: "STANDARDIZE",
  298: "ODD",
  299: "PERMUT",
  300: "POISSON",
  301: "TDIST",
  302: "WEIBULL",
  303: "SUMXMY2",
  304: "SUMX2MY2",
  305: "SUMX2PY2",
  306: "CHITEST",
  307: "CORREL",
  308: "COVAR",
  309: "FORECAST",
  310: "FTEST",
  311: "INTERCEPT",
  312: "PEARSON",
  313: "RSQ",
  314: "STEYX",
  315: "SLOPE",
  316: "TTEST",
  317: "PROB",
  318: "DEVSQ",
  319: "GEOMEAN",
  320: "HARMEAN",
  321: "SUMSQ",
  322: "KURT",
  323: "SKEW",
  324: "ZTEST",
  325: "LARGE",
  326: "SMALL",
  327: "QUARTILE",
  328: "PERCENTILE",
  329: "PERCENTRANK",
  330: "MODE",
  331: "TRIMMEAN",
  332: "TINV",
  334: "MOVIE.COMMAND",
  335: "GET.MOVIE",
  336: "CONCATENATE",
  337: "POWER",
  338: "PIVOT.ADD.DATA",
  339: "GET.PIVOT.TABLE",
  340: "GET.PIVOT.FIELD",
  341: "GET.PIVOT.ITEM",
  342: "RADIANS",
  343: "DEGREES",
  344: "SUBTOTAL",
  345: "SUMIF",
  346: "COUNTIF",
  347: "COUNTBLANK",
  348: "SCENARIO.GET",
  349: "OPTIONS.LISTS.GET",
  350: "ISPMT",
  351: "DATEDIF",
  352: "DATESTRING",
  353: "NUMBERSTRING",
  354: "ROMAN",
  355: "OPEN.DIALOG",
  356: "SAVE.DIALOG",
  357: "VIEW.GET",
  358: "GETPIVOTDATA",
  359: "HYPERLINK",
  360: "PHONETIC",
  361: "AVERAGEA",
  362: "MAXA",
  363: "MINA",
  364: "STDEVPA",
  365: "VARPA",
  366: "STDEVA",
  367: "VARA",
  368: "BAHTTEXT",
  369: "THAIDAYOFWEEK",
  370: "THAIDIGIT",
  371: "THAIMONTHOFYEAR",
  372: "THAINUMSOUND",
  373: "THAINUMSTRING",
  374: "THAISTRINGLENGTH",
  375: "ISTHAIDIGIT",
  376: "ROUNDBAHTDOWN",
  377: "ROUNDBAHTUP",
  378: "THAIYEAR",
  379: "RTD",
  380: "CUBEVALUE",
  381: "CUBEMEMBER",
  382: "CUBEMEMBERPROPERTY",
  383: "CUBERANKEDMEMBER",
  384: "HEX2BIN",
  385: "HEX2DEC",
  386: "HEX2OCT",
  387: "DEC2BIN",
  388: "DEC2HEX",
  389: "DEC2OCT",
  390: "OCT2BIN",
  391: "OCT2HEX",
  392: "OCT2DEC",
  393: "BIN2DEC",
  394: "BIN2OCT",
  395: "BIN2HEX",
  396: "IMSUB",
  397: "IMDIV",
  398: "IMPOWER",
  399: "IMABS",
  400: "IMSQRT",
  401: "IMLN",
  402: "IMLOG2",
  403: "IMLOG10",
  404: "IMSIN",
  405: "IMCOS",
  406: "IMEXP",
  407: "IMARGUMENT",
  408: "IMCONJUGATE",
  409: "IMAGINARY",
  410: "IMREAL",
  411: "COMPLEX",
  412: "IMSUM",
  413: "IMPRODUCT",
  414: "SERIESSUM",
  415: "FACTDOUBLE",
  416: "SQRTPI",
  417: "QUOTIENT",
  418: "DELTA",
  419: "GESTEP",
  420: "ISEVEN",
  421: "ISODD",
  422: "MROUND",
  423: "ERF",
  424: "ERFC",
  425: "BESSELJ",
  426: "BESSELK",
  427: "BESSELY",
  428: "BESSELI",
  429: "XIRR",
  430: "XNPV",
  431: "PRICEMAT",
  432: "YIELDMAT",
  433: "INTRATE",
  434: "RECEIVED",
  435: "DISC",
  436: "PRICEDISC",
  437: "YIELDDISC",
  438: "TBILLEQ",
  439: "TBILLPRICE",
  440: "TBILLYIELD",
  441: "PRICE",
  442: "YIELD",
  443: "DOLLARDE",
  444: "DOLLARFR",
  445: "NOMINAL",
  446: "EFFECT",
  447: "CUMPRINC",
  448: "CUMIPMT",
  449: "EDATE",
  450: "EOMONTH",
  451: "YEARFRAC",
  452: "COUPDAYBS",
  453: "COUPDAYS",
  454: "COUPDAYSNC",
  455: "COUPNCD",
  456: "COUPNUM",
  457: "COUPPCD",
  458: "DURATION",
  459: "MDURATION",
  460: "ODDLPRICE",
  461: "ODDLYIELD",
  462: "ODDFPRICE",
  463: "ODDFYIELD",
  464: "RANDBETWEEN",
  465: "WEEKNUM",
  466: "AMORDEGRC",
  467: "AMORLINC",
  468: "CONVERT",
  724: "SHEETJS",
  469: "ACCRINT",
  470: "ACCRINTM",
  471: "WORKDAY",
  472: "NETWORKDAYS",
  473: "GCD",
  474: "MULTINOMIAL",
  475: "LCM",
  476: "FVSCHEDULE",
  477: "CUBEKPIMEMBER",
  478: "CUBESET",
  479: "CUBESETCOUNT",
  480: "IFERROR",
  481: "COUNTIFS",
  482: "SUMIFS",
  483: "AVERAGEIF",
  484: "AVERAGEIFS"
}, K1 = {
  2: 1,
  3: 1,
  10: 0,
  15: 1,
  16: 1,
  17: 1,
  18: 1,
  19: 0,
  20: 1,
  21: 1,
  22: 1,
  23: 1,
  24: 1,
  25: 1,
  26: 1,
  27: 2,
  30: 2,
  31: 3,
  32: 1,
  33: 1,
  34: 0,
  35: 0,
  38: 1,
  39: 2,
  40: 3,
  41: 3,
  42: 3,
  43: 3,
  44: 3,
  45: 3,
  47: 3,
  48: 2,
  53: 1,
  61: 3,
  63: 0,
  65: 3,
  66: 3,
  67: 1,
  68: 1,
  69: 1,
  70: 1,
  71: 1,
  72: 1,
  73: 1,
  74: 0,
  75: 1,
  76: 1,
  77: 1,
  79: 2,
  80: 2,
  83: 1,
  85: 0,
  86: 1,
  89: 0,
  90: 1,
  94: 0,
  95: 0,
  97: 2,
  98: 1,
  99: 1,
  101: 3,
  102: 3,
  105: 1,
  106: 1,
  108: 2,
  111: 1,
  112: 1,
  113: 1,
  114: 1,
  117: 2,
  118: 1,
  119: 4,
  121: 1,
  126: 1,
  127: 1,
  128: 1,
  129: 1,
  130: 1,
  131: 1,
  133: 1,
  134: 1,
  135: 1,
  136: 2,
  137: 2,
  138: 2,
  140: 1,
  141: 1,
  142: 3,
  143: 4,
  144: 4,
  161: 1,
  162: 1,
  163: 1,
  164: 1,
  165: 2,
  172: 1,
  175: 2,
  176: 2,
  177: 3,
  178: 2,
  179: 1,
  184: 1,
  186: 1,
  189: 3,
  190: 1,
  195: 3,
  196: 3,
  197: 1,
  198: 1,
  199: 3,
  201: 1,
  207: 4,
  210: 3,
  211: 1,
  212: 2,
  213: 2,
  214: 1,
  215: 1,
  225: 0,
  229: 1,
  230: 1,
  231: 1,
  232: 1,
  233: 1,
  234: 1,
  235: 3,
  244: 1,
  247: 4,
  252: 2,
  257: 1,
  261: 1,
  271: 1,
  273: 4,
  274: 2,
  275: 2,
  276: 2,
  277: 3,
  278: 3,
  279: 1,
  280: 3,
  281: 3,
  282: 3,
  283: 1,
  284: 1,
  285: 2,
  286: 4,
  287: 3,
  288: 2,
  289: 4,
  290: 3,
  291: 3,
  292: 3,
  293: 4,
  294: 1,
  295: 3,
  296: 1,
  297: 3,
  298: 1,
  299: 2,
  300: 3,
  301: 3,
  302: 4,
  303: 2,
  304: 2,
  305: 2,
  306: 2,
  307: 2,
  308: 2,
  309: 3,
  310: 2,
  311: 2,
  312: 2,
  313: 2,
  314: 2,
  315: 2,
  316: 4,
  325: 2,
  326: 2,
  327: 2,
  328: 2,
  331: 2,
  332: 2,
  337: 2,
  342: 1,
  343: 1,
  346: 2,
  347: 1,
  350: 4,
  351: 3,
  352: 1,
  353: 2,
  360: 1,
  368: 1,
  369: 1,
  370: 1,
  371: 1,
  372: 1,
  373: 1,
  374: 1,
  375: 1,
  376: 1,
  377: 1,
  378: 1,
  382: 3,
  385: 1,
  392: 1,
  393: 1,
  396: 2,
  397: 2,
  398: 2,
  399: 1,
  400: 1,
  401: 1,
  402: 1,
  403: 1,
  404: 1,
  405: 1,
  406: 1,
  407: 1,
  408: 1,
  409: 1,
  410: 1,
  414: 4,
  415: 1,
  416: 1,
  417: 2,
  420: 1,
  421: 1,
  422: 2,
  424: 1,
  425: 2,
  426: 2,
  427: 2,
  428: 2,
  430: 3,
  438: 3,
  439: 3,
  440: 3,
  443: 2,
  444: 2,
  445: 2,
  446: 2,
  447: 6,
  448: 6,
  449: 2,
  450: 2,
  464: 2,
  468: 3,
  476: 2,
  479: 1,
  480: 2,
  65535: 0
};
function ji(e) {
  return e.slice(0, 3) == "of:" && (e = e.slice(3)), e.charCodeAt(0) == 61 && (e = e.slice(1), e.charCodeAt(0) == 61 && (e = e.slice(1))), e = e.replace(/COM\.MICROSOFT\./g, ""), e = e.replace(/\[((?:\.[A-Z]+[0-9]+)(?::\.[A-Z]+[0-9]+)?)\]/g, function(t, r) {
    return r.replace(/\./g, "");
  }), e = e.replace(/\$'([^']|'')+'/g, function(t) {
    return t.slice(1);
  }), e = e.replace(/\$([^\]\. #$]+)/g, function(t, r) {
    return r.match(/^([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])?(10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6]|[1-9]\d{0,5})?$/) ? t : r;
  }), e = e.replace(/\[.(#[A-Z]*[?!])\]/g, "$1"), e.replace(/[;~]/g, ",").replace(/\|/g, ";");
}
function vn(e) {
  e = e.replace(/\$'([^']|'')+'/g, function(n) {
    return n.slice(1);
  }), e = e.replace(/\$([^\]\. #$]+)/g, function(n, a) {
    return a.match(/^([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])?(10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6]|[1-9]\d{0,5})?$/) ? n : a;
  });
  var t = e.split(":"), r = t[0].split(".")[0];
  return [r, t[0].split(".")[1] + (t.length > 1 ? ":" + (t[1].split(".")[1] || t[1].split(".")[0]) : "")];
}
var na = {}, Ut = {};
function ia(e, t) {
  if (e) {
    var r = [0.7, 0.7, 0.75, 0.75, 0.3, 0.3];
    t == "xlml" && (r = [1, 1, 1, 1, 0.5, 0.5]), e.left == null && (e.left = r[0]), e.right == null && (e.right = r[1]), e.top == null && (e.top = r[2]), e.bottom == null && (e.bottom = r[3]), e.header == null && (e.header = r[4]), e.footer == null && (e.footer = r[5]);
  }
}
function Fs(e, t, r, n, a, i, f) {
  try {
    n.cellNF && (e.z = be[t]);
  } catch (c) {
    if (n.WTF) throw c;
  }
  if (!(e.t === "z" && !n.cellStyles)) {
    if (e.t === "d" && typeof e.v == "string" && (e.v = dr(e.v)), (!n || n.cellText !== !1) && e.t !== "z") try {
      if (be[t] == null && wt(Mf[t] || "General", t), e.t === "e") e.w = e.w || Sr[e.v];
      else if (t === 0)
        if (e.t === "n")
          (e.v | 0) === e.v ? e.w = e.v.toString(10) : e.w = oa(e.v);
        else if (e.t === "d") {
          var s = sr(e.v, !!f);
          (s | 0) === s ? e.w = s.toString(10) : e.w = oa(s);
        } else {
          if (e.v === void 0) return "";
          e.w = At(e.v, Ut);
        }
      else e.t === "d" ? e.w = Nr(t, sr(e.v, !!f), Ut) : e.w = Nr(t, e.v, Ut);
    } catch (c) {
      if (n.WTF) throw c;
    }
    if (n.cellStyles && r != null)
      try {
        e.s = i.Fills[r], e.s.fgColor && e.s.fgColor.theme && !e.s.fgColor.rgb && (e.s.fgColor.rgb = Ya(a.themeElements.clrScheme[e.s.fgColor.theme].rgb, e.s.fgColor.tint || 0), n.WTF && (e.s.fgColor.raw_rgb = a.themeElements.clrScheme[e.s.fgColor.theme].rgb)), e.s.bgColor && e.s.bgColor.theme && (e.s.bgColor.rgb = Ya(a.themeElements.clrScheme[e.s.bgColor.theme].rgb, e.s.bgColor.tint || 0), n.WTF && (e.s.bgColor.raw_rgb = a.themeElements.clrScheme[e.s.bgColor.theme].rgb));
      } catch (c) {
        if (n.WTF && i.Fills) throw c;
      }
  }
}
function Y1(e, t) {
  var r = Je(t);
  r.s.r <= r.e.r && r.s.c <= r.e.c && r.s.r >= 0 && r.s.c >= 0 && (e["!ref"] = Le(r));
}
var Z1 = /<(?:\w+:)?mergeCell ref=["'][A-Z0-9:]+['"]\s*[\/]?>/g, Q1 = /<(?:\w+:)?hyperlink [^<>]*>/mg, J1 = /"(\w*:\w*)"/, q1 = /<(?:\w+:)?col\b[^<>]*[\/]?>/g, ed = /<(?:\w+:)?autoFilter[^>]*/g, rd = /<(?:\w+:)?pageMargins[^<>]*\/>/g, Ss = /<(?:\w+:)?sheetPr\b[^<>]*?\/>/;
function td(e, t, r, n, a, i, f) {
  if (!e) return e;
  n || (n = { "!id": {} });
  var s = {};
  t.dense && (s["!data"] = []);
  var c = { s: { r: 2e6, c: 2e6 }, e: { r: 0, c: 0 } }, o = "", u = "", m = or(e, "sheetData");
  m ? (o = e.slice(0, m.index), u = e.slice(m.index + m[0].length)) : o = u = e;
  var x = o.match(Ss);
  x ? Zn(x[0], s, a, r) : (x = or(o, "sheetPr")) && ad(x[0], x[1] || "", s, a, r);
  var l = (o.match(/<(?:\w*:)?dimension/) || { index: -1 }).index;
  if (l > 0) {
    var v = o.slice(l, l + 50).match(J1);
    v && !(t && t.nodim) && Y1(s, v[1]);
  }
  var p = or(o, "sheetViews");
  p && p[1] && od(p[1], a);
  var d = [];
  if (t.cellStyles) {
    var h = o.match(q1);
    h && sd(d, h);
  }
  m && ld(m[1], s, t, c, i, f, a);
  var _ = u.match(ed);
  _ && (s["!autofilter"] = fd(_[0]));
  var g = [], E = u.match(Z1);
  if (E) for (l = 0; l != E.length; ++l)
    g[l] = Je(E[l].slice(E[l].indexOf("=") + 2));
  var A = u.match(Q1);
  A && nd(s, A, n);
  var P = u.match(rd);
  P && (s["!margins"] = id(Ae(P[0])));
  var S;
  if ((S = u.match(/legacyDrawing r:id="(.*?)"/)) && (s["!legrel"] = S[1]), t && t.nodim && (c.s.c = c.s.r = 0), !s["!ref"] && c.e.c >= c.s.c && c.e.r >= c.s.r && (s["!ref"] = Le(c)), t.sheetRows > 0 && s["!ref"]) {
    var R = Je(s["!ref"]);
    t.sheetRows <= +R.e.r && (R.e.r = t.sheetRows - 1, R.e.r > c.e.r && (R.e.r = c.e.r), R.e.r < R.s.r && (R.s.r = R.e.r), R.e.c > c.e.c && (R.e.c = c.e.c), R.e.c < R.s.c && (R.s.c = R.e.c), s["!fullref"] = s["!ref"], s["!ref"] = Le(R));
  }
  return d.length > 0 && (s["!cols"] = d), g.length > 0 && (s["!merges"] = g), n["!id"][s["!legrel"]] && (s["!legdrawel"] = n["!id"][s["!legrel"]]), s;
}
function Zn(e, t, r, n) {
  var a = Ae(e);
  r.Sheets[n] || (r.Sheets[n] = {}), a.codeName && (r.Sheets[n].CodeName = Be(Xe(a.codeName)));
}
function ad(e, t, r, n, a) {
  Zn(e.slice(0, e.indexOf(">")), r, n, a);
}
function nd(e, t, r) {
  for (var n = e["!data"] != null, a = 0; a != t.length; ++a) {
    var i = Ae(Xe(t[a]), !0);
    if (!i.ref) return;
    var f = ((r || {})["!id"] || [])[i.id];
    f ? (i.Target = f.Target, i.location && (i.Target += "#" + Be(i.location))) : (i.Target = "#" + Be(i.location), f = { Target: i.Target, TargetMode: "Internal" }), i.Rel = f, i.tooltip && (i.Tooltip = i.tooltip, delete i.tooltip);
    for (var s = Je(i.ref), c = s.s.r; c <= s.e.r; ++c) for (var o = s.s.c; o <= s.e.c; ++o) {
      var u = He(o) + Ge(c);
      n ? (e["!data"][c] || (e["!data"][c] = []), e["!data"][c][o] || (e["!data"][c][o] = { t: "z", v: void 0 }), e["!data"][c][o].l = i) : (e[u] || (e[u] = { t: "z", v: void 0 }), e[u].l = i);
    }
  }
}
function id(e) {
  var t = {};
  return ["left", "right", "top", "bottom", "header", "footer"].forEach(function(r) {
    e[r] && (t[r] = parseFloat(e[r]));
  }), t;
}
function sd(e, t) {
  for (var r = !1, n = 0; n != t.length; ++n) {
    var a = Ae(t[n], !0);
    a.hidden && (a.hidden = Ve(a.hidden));
    var i = parseInt(a.min, 10) - 1, f = parseInt(a.max, 10) - 1;
    for (a.outlineLevel && (a.level = +a.outlineLevel || 0), delete a.min, delete a.max, a.width = +a.width, !r && a.width && (r = !0, jn(a.width)), Ht(a); i <= f; ) e[i++] = nr(a);
  }
}
function fd(e) {
  var t = { ref: (e.match(/ref="([^"]*)"/) || [])[1] };
  return t;
}
var cd = /<(?:\w:)?sheetView(?:[^<>a-z][^<>]*)?\/?>/g;
function od(e, t) {
  t.Views || (t.Views = [{}]), (e.match(cd) || []).forEach(function(r, n) {
    var a = Ae(r);
    t.Views[n] || (t.Views[n] = {}), +a.zoomScale && (t.Views[n].zoom = +a.zoomScale), a.rightToLeft && Ve(a.rightToLeft) && (t.Views[n].RTL = !0);
  });
}
var ld = /* @__PURE__ */ (function() {
  var e = /<(?:\w+:)?c[ \/>]/, t = /<\/(?:\w+:)?row>/, r = /r=["']([^"']*)["']/, n = /ref=["']([^"']*)["']/;
  return function(i, f, s, c, o, u, m) {
    for (var x = 0, l = "", v = [], p = [], d = 0, h = 0, _ = 0, g = "", E, A, P = 0, S = 0, R, F, U = 0, H = 0, y = Array.isArray(u.CellXf), W, k = [], j = [], me = f["!data"] != null, Z = [], xe = {}, fe = !1, q = !!s.sheetStubs, J = !!((m || {}).WBProps || {}).date1904, Y = i.split(t), pe = 0, ce = Y.length; pe != ce; ++pe) {
      l = Y[pe].trim();
      var de = l.length;
      if (de !== 0) {
        var Te = 0;
        e: for (x = 0; x < de; ++x) switch (
          /*x.charCodeAt(ri)*/
          l[x]
        ) {
          case ">":
            if (
              /*x.charCodeAt(ri-1) != 47*/
              l[x - 1] != "/"
            ) {
              ++x;
              break e;
            }
            if (s && s.cellStyles) {
              if (A = Ae(l.slice(Te, x), !0), P = A.r != null ? parseInt(A.r, 10) : P + 1, S = -1, s.sheetRows && s.sheetRows < P) continue;
              xe = {}, fe = !1, A.ht && (fe = !0, xe.hpt = parseFloat(A.ht), xe.hpx = da(xe.hpt)), A.hidden && Ve(A.hidden) && (fe = !0, xe.hidden = !0), A.outlineLevel != null && (fe = !0, xe.level = +A.outlineLevel), fe && (Z[P - 1] = xe);
            }
            break;
          case "<":
            Te = x;
            break;
        }
        if (Te >= x) break;
        if (A = Ae(l.slice(Te, x), !0), P = A.r != null ? parseInt(A.r, 10) : P + 1, S = -1, !(s.sheetRows && s.sheetRows < P)) {
          s.nodim || (c.s.r > P - 1 && (c.s.r = P - 1), c.e.r < P - 1 && (c.e.r = P - 1)), s && s.cellStyles && (xe = {}, fe = !1, A.ht && (fe = !0, xe.hpt = parseFloat(A.ht), xe.hpx = da(xe.hpt)), A.hidden && Ve(A.hidden) && (fe = !0, xe.hidden = !0), A.outlineLevel != null && (fe = !0, xe.level = +A.outlineLevel), fe && (Z[P - 1] = xe)), v = l.slice(x).split(e);
          for (var Ce = 0; Ce != v.length && v[Ce].trim().charAt(0) == "<"; ++Ce) ;
          for (v = v.slice(Ce), x = 0; x != v.length; ++x)
            if (l = v[x].trim(), l.length !== 0) {
              if (p = l.match(r), d = x, h = 0, _ = 0, l = "<c " + (l.slice(0, 1) == "<" ? ">" : "") + l, p != null && p.length === 2) {
                for (d = 0, g = p[1], h = 0; h != g.length && !((_ = g.charCodeAt(h) - 64) < 1 || _ > 26); ++h)
                  d = 26 * d + _;
                --d, S = d;
              } else ++S;
              for (h = 0; h != l.length && l.charCodeAt(h) !== 62; ++h) ;
              if (++h, A = Ae(l.slice(0, h), !0), A.r || (A.r = We({ r: P - 1, c: S })), g = l.slice(h), E = { t: "" }, (p = or(g, "v")) != null && /*::cref != null && */
              p[1] !== "" && (E.v = Be(p[1])), s.cellFormula) {
                if ((p = or(g, "f")) != null) {
                  if (p[1] == "")
                    /*::cref != null && cref[0] != null && */
                    p[0].indexOf('t="shared"') > -1 && (F = Ae(p[0]), j[F.si] && (E.f = Hi(j[F.si][1], j[F.si][2], A.r)));
                  else if (E.f = Be(Xe(p[1]), !0), s.xlfn || (E.f = Vi(E.f)), /*::cref != null && cref[0] != null && */
                  p[0].indexOf('t="array"') > -1)
                    E.F = (g.match(n) || [])[1], E.F.indexOf(":") > -1 && k.push([Je(E.F), E.F]);
                  else if (
                    /*::cref != null && cref[0] != null && */
                    p[0].indexOf('t="shared"') > -1
                  ) {
                    F = Ae(p[0]);
                    var O = Be(Xe(p[1]));
                    s.xlfn || (O = Vi(O)), j[parseInt(F.si, 10)] = [F, O, A.r];
                  }
                } else (p = g.match(/<f[^<>]*\/>/)) && (F = Ae(p[0]), j[F.si] && (E.f = Hi(j[F.si][1], j[F.si][2], A.r)));
                var K = _r(A.r);
                for (h = 0; h < k.length; ++h)
                  K.r >= k[h][0].s.r && K.r <= k[h][0].e.r && K.c >= k[h][0].s.c && K.c <= k[h][0].e.c && (E.F = k[h][1]);
              }
              if (A.t == null && E.v === void 0)
                if (E.f || E.F)
                  E.v = 0, E.t = "n";
                else if (q) E.t = "z";
                else continue;
              else E.t = A.t || "n";
              switch (c.s.c > S && (c.s.c = S), c.e.c < S && (c.e.c = S), E.t) {
                case "n":
                  if (E.v == "" || E.v == null) {
                    if (!q) continue;
                    E.t = "z";
                  } else E.v = parseFloat(E.v);
                  break;
                case "s":
                  if (typeof E.v > "u") {
                    if (!q) continue;
                    E.t = "z";
                  } else
                    R = na[parseInt(E.v, 10)], E.v = R.t, E.r = R.r, s.cellHTML && (E.h = R.h);
                  break;
                case "str":
                  E.t = "s", E.v = E.v != null ? Be(Xe(E.v), !0) : "", s.cellHTML && (E.h = Qt(E.v));
                  break;
                case "inlineStr":
                  p = or(g, "is"), E.t = "s", p != null && (R = $n(p[1])) ? (E.v = R.t, s.cellHTML && (E.h = R.h)) : E.v = "";
                  break;
                case "b":
                  E.v = Ve(E.v);
                  break;
                case "d":
                  s.cellDates ? E.v = dr(E.v, J) : (E.v = sr(dr(E.v, J), J), E.t = "n");
                  break;
                /* error string in .w, number in .v */
                case "e":
                  (!s || s.cellText !== !1) && (E.w = E.v), E.v = ur[E.v];
                  break;
              }
              if (U = H = 0, W = null, y && A.s !== void 0 && (W = u.CellXf[A.s], W != null && (W.numFmtId != null && (U = W.numFmtId), s.cellStyles && W.fillId != null && (H = W.fillId))), Fs(E, U, H, s, o, u, J), s.cellDates && y && E.t == "n" && $r(be[U]) && (E.v = ot(E.v + (J ? 1462 : 0)), E.t = typeof E.v == "number" ? "n" : "d"), A.cm && s.xlmeta) {
                var X = (s.xlmeta.Cell || [])[+A.cm - 1];
                X && X.type == "XLDAPR" && (E.D = !0);
              }
              var z;
              s.nodim && (z = _r(A.r), c.s.r > z.r && (c.s.r = z.r), c.e.r < z.r && (c.e.r = z.r)), me ? (z = _r(A.r), f["!data"][z.r] || (f["!data"][z.r] = []), f["!data"][z.r][z.c] = E) : f[A.r] = E;
            }
        }
      }
    }
    Z.length > 0 && (f["!rows"] = Z);
  };
})();
function ud(e, t) {
  var r = {}, n = e.l + t;
  r.r = e.read_shift(4), e.l += 4;
  var a = e.read_shift(2);
  e.l += 1;
  var i = e.read_shift(1);
  return e.l = n, i & 7 && (r.level = i & 7), i & 16 && (r.hidden = !0), i & 32 && (r.hpt = a / 20), r;
}
var hd = Dt;
function dd() {
}
function xd(e, t) {
  var r = {}, n = e[e.l];
  return ++e.l, r.above = !(n & 64), r.left = !(n & 128), e.l += 18, r.name = Wc(e), r;
}
function pd(e) {
  var t = Hr(e);
  return [t];
}
function md(e) {
  var t = Ot(e);
  return [t];
}
function vd(e) {
  var t = Hr(e), r = e.read_shift(1);
  return [t, r, "b"];
}
function gd(e) {
  var t = Ot(e), r = e.read_shift(1);
  return [t, r, "b"];
}
function _d(e) {
  var t = Hr(e), r = e.read_shift(1);
  return [t, r, "e"];
}
function wd(e) {
  var t = Ot(e), r = e.read_shift(1);
  return [t, r, "e"];
}
function kd(e) {
  var t = Hr(e), r = e.read_shift(4);
  return [t, r, "s"];
}
function Ed(e) {
  var t = Ot(e), r = e.read_shift(4);
  return [t, r, "s"];
}
function Td(e) {
  var t = Hr(e), r = gr(e);
  return [t, r, "n"];
}
function Cs(e) {
  var t = Ot(e), r = gr(e);
  return [t, r, "n"];
}
function yd(e) {
  var t = Hr(e), r = an(e);
  return [t, r, "n"];
}
function Ad(e) {
  var t = Ot(e), r = an(e);
  return [t, r, "n"];
}
function Fd(e) {
  var t = Hr(e), r = Vn(e);
  return [t, r, "is"];
}
function Sd(e) {
  var t = Hr(e), r = wr(e);
  return [t, r, "str"];
}
function Cd(e) {
  var t = Ot(e), r = wr(e);
  return [t, r, "str"];
}
function bd(e, t, r) {
  var n = e.l + t, a = Hr(e);
  a.r = r["!row"];
  var i = e.read_shift(1), f = [a, i, "b"];
  if (r.cellFormula) {
    e.l += 2;
    var s = fn(e, n - e.l, r);
    f[3] = vr(s, null, a, r.supbooks, r);
  } else e.l = n;
  return f;
}
function Id(e, t, r) {
  var n = e.l + t, a = Hr(e);
  a.r = r["!row"];
  var i = e.read_shift(1), f = [a, i, "e"];
  if (r.cellFormula) {
    e.l += 2;
    var s = fn(e, n - e.l, r);
    f[3] = vr(s, null, a, r.supbooks, r);
  } else e.l = n;
  return f;
}
function Od(e, t, r) {
  var n = e.l + t, a = Hr(e);
  a.r = r["!row"];
  var i = gr(e), f = [a, i, "n"];
  if (r.cellFormula) {
    e.l += 2;
    var s = fn(e, n - e.l, r);
    f[3] = vr(s, null, a, r.supbooks, r);
  } else e.l = n;
  return f;
}
function Dd(e, t, r) {
  var n = e.l + t, a = Hr(e);
  a.r = r["!row"];
  var i = wr(e), f = [a, i, "str"];
  if (r.cellFormula) {
    e.l += 2;
    var s = fn(e, n - e.l, r);
    f[3] = vr(s, null, a, r.supbooks, r);
  } else e.l = n;
  return f;
}
var Rd = Dt;
function Nd(e, t) {
  var r = e.l + t, n = Dt(e), a = tn(e), i = wr(e), f = wr(e), s = wr(e);
  e.l = r;
  var c = { rfx: n, relId: a, loc: i, display: s };
  return f && (c.Tooltip = f), c;
}
function Pd() {
}
function Bd(e, t, r) {
  var n = e.l + t, a = j0(e), i = e.read_shift(1), f = [a];
  if (f[2] = i, r.cellFormula) {
    var s = G1(e, n - e.l, r);
    f[1] = s;
  } else e.l = n;
  return f;
}
function Ld(e, t, r) {
  var n = e.l + t, a = Dt(e), i = [a];
  if (r.cellFormula) {
    var f = $1(e, n - e.l, r);
    i[1] = f, e.l = n;
  } else e.l = n;
  return i;
}
var Md = ["left", "right", "top", "bottom", "header", "footer"];
function Ud(e) {
  var t = {};
  return Md.forEach(function(r) {
    t[r] = gr(e);
  }), t;
}
function zd(e) {
  var t = e.read_shift(2);
  return e.l += 28, { RTL: t & 32 };
}
function Wd() {
}
function Hd() {
}
function Vd(e, t, r, n, a, i, f) {
  if (!e) return e;
  var s = t || {};
  n || (n = { "!id": {} });
  var c = {};
  s.dense && (c["!data"] = []);
  var o, u = { s: { r: 2e6, c: 2e6 }, e: { r: 0, c: 0 } }, m = !1, x = !1, l, v, p, d, h, _, g, E, A, P = [];
  s.biff = 12, s["!row"] = 0;
  var S = 0, R = !1, F = [], U = {}, H = s.supbooks || /*::(*/
  a.supbooks || [[]];
  if (H.sharedf = U, H.arrayf = F, H.SheetNames = a.SheetNames || a.Sheets.map(function(fe) {
    return fe.name;
  }), !s.supbooks && (s.supbooks = H, a.Names))
    for (var y = 0; y < a.Names.length; ++y) H[0][y + 1] = a.Names[y];
  var W = [], k = [], j = !1;
  Ja[16] = { n: "BrtShortReal", f: Cs };
  var me, Z = 1462 * +!!((a || {}).WBProps || {}).date1904;
  if (it(e, function(q, J, Y) {
    if (!x)
      switch (Y) {
        case 148:
          o = q;
          break;
        case 0:
          l = q, s.sheetRows && s.sheetRows <= l.r && (x = !0), E = Ge(d = l.r), s["!row"] = l.r, (q.hidden || q.hpt || q.level != null) && (q.hpt && (q.hpx = da(q.hpt)), k[q.r] = q);
          break;
        case 2:
        /* 'BrtCellRk' */
        case 3:
        /* 'BrtCellError' */
        case 4:
        /* 'BrtCellBool' */
        case 5:
        /* 'BrtCellReal' */
        case 6:
        /* 'BrtCellSt' */
        case 7:
        /* 'BrtCellIsst' */
        case 8:
        /* 'BrtFmlaString' */
        case 9:
        /* 'BrtFmlaNum' */
        case 10:
        /* 'BrtFmlaBool' */
        case 11:
        /* 'BrtFmlaError' */
        case 13:
        /* 'BrtShortRk' */
        case 14:
        /* 'BrtShortError' */
        case 15:
        /* 'BrtShortBool' */
        case 16:
        /* 'BrtShortReal' */
        case 17:
        /* 'BrtShortSt' */
        case 18:
        /* 'BrtShortIsst' */
        case 62:
          switch (v = { t: q[2] }, q[2]) {
            case "n":
              v.v = q[1];
              break;
            case "s":
              g = na[q[1]], v.v = g.t, v.r = g.r;
              break;
            case "b":
              v.v = !!q[1];
              break;
            case "e":
              v.v = q[1], s.cellText !== !1 && (v.w = Sr[v.v]);
              break;
            case "str":
              v.t = "s", v.v = q[1];
              break;
            case "is":
              v.t = "s", v.v = q[1].t;
              break;
          }
          if ((p = f.CellXf[q[0].iStyleRef]) && Fs(v, p.numFmtId, null, s, i, f, Z > 0), h = q[0].c == -1 ? h + 1 : q[0].c, s.dense ? (c["!data"][d] || (c["!data"][d] = []), c["!data"][d][h] = v) : c[He(h) + E] = v, s.cellFormula) {
            for (R = !1, S = 0; S < F.length; ++S) {
              var pe = F[S];
              l.r >= pe[0].s.r && l.r <= pe[0].e.r && h >= pe[0].s.c && h <= pe[0].e.c && (v.F = Le(pe[0]), R = !0);
            }
            !R && q.length > 3 && (v.f = q[3]);
          }
          if (u.s.r > l.r && (u.s.r = l.r), u.s.c > h && (u.s.c = h), u.e.r < l.r && (u.e.r = l.r), u.e.c < h && (u.e.c = h), s.cellDates && p && v.t == "n" && $r(be[p.numFmtId])) {
            var ce = qr(v.v + Z);
            ce && (v.t = "d", v.v = new Date(Date.UTC(ce.y, ce.m - 1, ce.d, ce.H, ce.M, ce.S, ce.u)));
          }
          me && (me.type == "XLDAPR" && (v.D = !0), me = void 0);
          break;
        case 1:
        /* 'BrtCellBlank' */
        case 12:
          if (!s.sheetStubs || m) break;
          v = { t: "z", v: void 0 }, h = q[0].c == -1 ? h + 1 : q[0].c, s.dense ? (c["!data"][d] || (c["!data"][d] = []), c["!data"][d][h] = v) : c[He(h) + E] = v, u.s.r > l.r && (u.s.r = l.r), u.s.c > h && (u.s.c = h), u.e.r < l.r && (u.e.r = l.r), u.e.c < h && (u.e.c = h), me && (me.type == "XLDAPR" && (v.D = !0), me = void 0);
          break;
        case 176:
          P.push(q);
          break;
        case 49:
          me = ((s.xlmeta || {}).Cell || [])[q - 1];
          break;
        case 494:
          var de = n["!id"][q.relId];
          for (de ? (q.Target = de.Target, q.loc && (q.Target += "#" + q.loc), q.Rel = de) : q.relId == "" && (q.Target = "#" + q.loc), d = q.rfx.s.r; d <= q.rfx.e.r; ++d) for (h = q.rfx.s.c; h <= q.rfx.e.c; ++h)
            s.dense ? (c["!data"][d] || (c["!data"][d] = []), c["!data"][d][h] || (c["!data"][d][h] = { t: "z", v: void 0 }), c["!data"][d][h].l = q) : (_ = He(h) + Ge(d), c[_] || (c[_] = { t: "z", v: void 0 }), c[_].l = q);
          break;
        case 426:
          if (!s.cellFormula) break;
          F.push(q), A = s.dense ? c["!data"][d][h] : c[He(h) + E], A.f = vr(q[1], u, { r: l.r, c: h }, H, s), A.F = Le(q[0]);
          break;
        case 427:
          if (!s.cellFormula) break;
          U[We(q[0].s)] = q[1], A = s.dense ? c["!data"][d][h] : c[He(h) + E], A.f = vr(q[1], u, { r: l.r, c: h }, H, s);
          break;
        /* identical to 'ColInfo' in XLS */
        case 60:
          if (!s.cellStyles) break;
          for (; q.e >= q.s; )
            W[q.e--] = { width: q.w / 256, hidden: !!(q.flags & 1), level: q.level }, j || (j = !0, jn(q.w / 256)), Ht(W[q.e + 1]);
          break;
        case 551:
          q && (c["!legrel"] = q);
          break;
        case 161:
          c["!autofilter"] = { ref: Le(q) };
          break;
        case 476:
          c["!margins"] = q;
          break;
        case 147:
          a.Sheets[r] || (a.Sheets[r] = {}), q.name && (a.Sheets[r].CodeName = q.name), (q.above || q.left) && (c["!outline"] = { above: q.above, left: q.left });
          break;
        case 137:
          a.Views || (a.Views = [{}]), a.Views[0] || (a.Views[0] = {}), q.RTL && (a.Views[0].RTL = !0);
          break;
        case 485:
          break;
        case 64:
        /* 'BrtDVal' */
        case 1053:
          break;
        case 151:
          break;
        case 152:
        /* 'BrtSel' */
        case 175:
        /* 'BrtAFilterDateGroupItem' */
        case 644:
        /* 'BrtActiveX' */
        case 625:
        /* 'BrtBigName' */
        case 562:
        /* 'BrtBkHim' */
        case 396:
        /* 'BrtBrk' */
        case 1112:
        /* 'BrtCFIcon' */
        case 1146:
        /* 'BrtCFRuleExt' */
        case 471:
        /* 'BrtCFVO' */
        case 1050:
        /* 'BrtCFVO14' */
        case 649:
        /* 'BrtCellIgnoreEC' */
        case 1105:
        /* 'BrtCellIgnoreEC14' */
        case 589:
        /* 'BrtCellSmartTagProperty' */
        case 607:
        /* 'BrtCellWatch' */
        case 564:
        /* 'BrtColor' */
        case 1055:
        /* 'BrtColor14' */
        case 168:
        /* 'BrtColorFilter' */
        case 174:
        /* 'BrtCustomFilter' */
        case 1180:
        /* 'BrtCustomFilter14' */
        case 499:
        /* 'BrtDRef' */
        case 507:
        /* 'BrtDXF' */
        case 550:
        /* 'BrtDrawing' */
        case 171:
        /* 'BrtDynamicFilter' */
        case 167:
        /* 'BrtFilter' */
        case 1177:
        /* 'BrtFilter14' */
        case 169:
        /* 'BrtIconFilter' */
        case 1181:
        /* 'BrtIconFilter14' */
        case 552:
        /* 'BrtLegacyDrawingHF' */
        case 661:
        /* 'BrtListPart' */
        case 639:
        /* 'BrtOleObject' */
        case 478:
        /* 'BrtPageSetup' */
        case 537:
        /* 'BrtPhoneticInfo' */
        case 477:
        /* 'BrtPrintOptions' */
        case 536:
        /* 'BrtRangeProtection' */
        case 1103:
        /* 'BrtRangeProtection14' */
        case 680:
        /* 'BrtRangeProtectionIso' */
        case 1104:
        /* 'BrtRangeProtectionIso14' */
        case 1024:
        /* 'BrtRwDescent' */
        case 663:
        /* 'BrtSheetCalcProp' */
        case 535:
        /* 'BrtSheetProtection' */
        case 678:
        /* 'BrtSheetProtectionIso' */
        case 504:
        /* 'BrtSlc' */
        case 1043:
        /* 'BrtSparkline' */
        case 428:
        /* 'BrtTable' */
        case 170:
        /* 'BrtTop10Filter' */
        case 3072:
        /* 'BrtUid' */
        case 50:
        /* 'BrtValueMeta' */
        case 2070:
        /* 'BrtWebExtension' */
        case 1045:
          break;
        case 35:
          m = !0;
          break;
        case 36:
          m = !1;
          break;
        case 37:
          m = !0;
          break;
        case 38:
          m = !1;
          break;
        default:
          if (!J.T) {
            if (!m || s.WTF) throw new Error("Unexpected record 0x" + Y.toString(16));
          }
      }
  }, s), delete s.supbooks, delete s["!row"], !c["!ref"] && (u.s.r < 2e6 || o && (o.e.r > 0 || o.e.c > 0 || o.s.r > 0 || o.s.c > 0)) && (c["!ref"] = Le(o || u)), s.sheetRows && c["!ref"]) {
    var xe = Je(c["!ref"]);
    s.sheetRows <= +xe.e.r && (xe.e.r = s.sheetRows - 1, xe.e.r > u.e.r && (xe.e.r = u.e.r), xe.e.r < xe.s.r && (xe.s.r = xe.e.r), xe.e.c > u.e.c && (xe.e.c = u.e.c), xe.e.c < xe.s.c && (xe.s.c = xe.e.c), c["!fullref"] = c["!ref"], c["!ref"] = Le(xe));
  }
  return P.length > 0 && (c["!merges"] = P), W.length > 0 && (c["!cols"] = W), k.length > 0 && (c["!rows"] = k), n["!id"][c["!legrel"]] && (c["!legdrawel"] = n["!id"][c["!legrel"]]), c;
}
function Gd(e) {
  var t = [], r = e.match(/^<c:numCache>/), n;
  (e.match(/<c:pt idx="(\d*)"[^<>\/]*><c:v>([^<])<\/c:v><\/c:pt>/mg) || []).forEach(function(i) {
    var f = i.match(/<c:pt idx="(\d*)"[^<>\/]*><c:v>([^<]*)<\/c:v><\/c:pt>/);
    f && (t[+f[1]] = r ? +f[2] : f[2]);
  });
  var a = Be((kt(e, "c:formatCode") || ["", "General"])[1]);
  return (Mn(e, "<c:f>", "</c:f>") || []).forEach(function(i) {
    n = i.replace(/<[^<>]*>/g, "");
  }), [t, a, n];
}
function Xd(e, t, r, n, a, i) {
  var f = i || { "!type": "chart" };
  if (!e) return i;
  var s = 0, c = 0, o = "A", u = { s: { r: 2e6, c: 2e6 }, e: { r: 0, c: 0 } };
  return (Mn(e, "<c:numCache>", "</c:numCache>") || []).forEach(function(m) {
    var x = Gd(m);
    u.s.r = u.s.c = 0, u.e.c = s, o = He(s), x[0].forEach(function(l, v) {
      f["!data"] ? (f["!data"][v] || (f["!data"][v] = []), f["!data"][v][s] = { t: "n", v: l, z: x[1] }) : f[o + Ge(v)] = { t: "n", v: l, z: x[1] }, c = v;
    }), u.e.r < c && (u.e.r = c), ++s;
  }), s > 0 && (f["!ref"] = Le(u)), f;
}
function $d(e, t, r, n, a) {
  if (!e) return e;
  n || (n = { "!id": {} });
  var i = { "!type": "chart", "!drawel": null, "!rel": "" }, f, s = e.match(Ss);
  return s && Zn(s[0], i, a, r), (f = e.match(/drawing r:id="(.*?)"/)) && (i["!rel"] = f[1]), n["!id"][i["!rel"]] && (i["!drawel"] = n["!id"][i["!rel"]]), i;
}
function jd(e, t) {
  e.l += 10;
  var r = wr(e);
  return { name: r };
}
function Kd(e, t, r, n, a) {
  if (!e) return e;
  n || (n = { "!id": {} });
  var i = { "!type": "chart", "!drawel": null, "!rel": "" }, f = !1;
  return it(e, function(c, o, u) {
    switch (u) {
      case 550:
        i["!rel"] = c;
        break;
      case 651:
        a.Sheets[r] || (a.Sheets[r] = {}), c.name && (a.Sheets[r].CodeName = c.name);
        break;
      case 562:
      /* 'BrtBkHim' */
      case 652:
      /* 'BrtCsPageSetup' */
      case 669:
      /* 'BrtCsProtection' */
      case 679:
      /* 'BrtCsProtectionIso' */
      case 551:
      /* 'BrtLegacyDrawing' */
      case 552:
      /* 'BrtLegacyDrawingHF' */
      case 476:
      /* 'BrtMargins' */
      case 3072:
        break;
      case 35:
        f = !0;
        break;
      case 36:
        f = !1;
        break;
      case 37:
        break;
      case 38:
        break;
      default:
        if (!(o.T > 0)) {
          if (!(o.T < 0)) {
            if (!f || t.WTF) throw new Error("Unexpected record 0x" + u.toString(16));
          }
        }
    }
  }, t), n["!id"][i["!rel"]] && (i["!drawel"] = n["!id"][i["!rel"]]), i;
}
var bs = [
  ["allowRefreshQuery", !1, "bool"],
  ["autoCompressPictures", !0, "bool"],
  ["backupFile", !1, "bool"],
  ["checkCompatibility", !1, "bool"],
  ["CodeName", ""],
  ["date1904", !1, "bool"],
  ["defaultThemeVersion", 0, "int"],
  ["filterPrivacy", !1, "bool"],
  ["hidePivotFieldList", !1, "bool"],
  ["promptedSolutions", !1, "bool"],
  ["publishItems", !1, "bool"],
  ["refreshAllConnections", !1, "bool"],
  ["saveExternalLinkValues", !0, "bool"],
  ["showBorderUnselectedTables", !0, "bool"],
  ["showInkAnnotation", !0, "bool"],
  ["showObjects", "all"],
  ["showPivotChartFilter", !1, "bool"],
  ["updateLinks", "userSet"]
], Yd = [
  ["activeTab", 0, "int"],
  ["autoFilterDateGrouping", !0, "bool"],
  ["firstSheet", 0, "int"],
  ["minimized", !1, "bool"],
  ["showHorizontalScroll", !0, "bool"],
  ["showSheetTabs", !0, "bool"],
  ["showVerticalScroll", !0, "bool"],
  ["tabRatio", 600, "int"],
  ["visibility", "visible"]
  //window{Height,Width}, {x,y}Window
], Zd = [
  //['state', 'visible']
], Qd = [
  ["calcCompleted", "true"],
  ["calcMode", "auto"],
  ["calcOnSave", "true"],
  ["concurrentCalc", "true"],
  ["fullCalcOnLoad", "false"],
  ["fullPrecision", "true"],
  ["iterate", "false"],
  ["iterateCount", "100"],
  ["iterateDelta", "0.001"],
  ["refMode", "A1"]
];
function Ki(e, t) {
  for (var r = 0; r != e.length; ++r)
    for (var n = e[r], a = 0; a != t.length; ++a) {
      var i = t[a];
      if (n[i[0]] == null) n[i[0]] = i[1];
      else switch (i[2]) {
        case "bool":
          typeof n[i[0]] == "string" && (n[i[0]] = Ve(n[i[0]]));
          break;
        case "int":
          typeof n[i[0]] == "string" && (n[i[0]] = parseInt(n[i[0]], 10));
          break;
      }
    }
}
function Yi(e, t) {
  for (var r = 0; r != t.length; ++r) {
    var n = t[r];
    if (e[n[0]] == null) e[n[0]] = n[1];
    else switch (n[2]) {
      case "bool":
        typeof e[n[0]] == "string" && (e[n[0]] = Ve(e[n[0]]));
        break;
      case "int":
        typeof e[n[0]] == "string" && (e[n[0]] = parseInt(e[n[0]], 10));
        break;
    }
  }
}
function Is(e) {
  Yi(e.WBProps, bs), Yi(e.CalcPr, Qd), Ki(e.WBView, Yd), Ki(e.Sheets, Zd), Ut.date1904 = Ve(e.WBProps.date1904);
}
var Jd = /* @__PURE__ */ ":][*?/\\".split("");
function qd(e, t) {
  try {
    if (e == "") throw new Error("Sheet name cannot be blank");
    if (e.length > 31) throw new Error("Sheet name cannot exceed 31 chars");
    if (e.charCodeAt(0) == 39 || e.charCodeAt(e.length - 1) == 39) throw new Error("Sheet name cannot start or end with apostrophe (')");
    if (e.toLowerCase() == "history") throw new Error("Sheet name cannot be 'History'");
    Jd.forEach(function(r) {
      if (e.indexOf(r) != -1)
        throw new Error("Sheet name cannot contain : \\ / ? * [ ]");
    });
  } catch (r) {
    throw r;
  }
  return !0;
}
var ex = /<\w+:workbook/;
function rx(e, t) {
  if (!e) throw new Error("Could not find file");
  var r = (
    /*::(*/
    { AppVersion: {}, WBProps: {}, WBView: [], Sheets: [], CalcPr: {}, Names: [], xmlns: "" }
  ), n = !1, a = "xmlns", i = {}, f = 0;
  if (e.replace(xr, function(c, o) {
    var u = Ae(c);
    switch (Wr(u[0])) {
      case "<?xml":
        break;
      /* 18.2.27 workbook CT_Workbook 1 */
      case "<workbook":
        c.match(ex) && (a = "xmlns" + c.match(/<(\w+):/)[1]), r.xmlns = u[a];
        break;
      case "</workbook>":
        break;
      /* 18.2.13 fileVersion CT_FileVersion ? */
      case "<fileVersion":
        delete u[0], r.AppVersion = u;
        break;
      case "<fileVersion/>":
      case "</fileVersion>":
        break;
      /* 18.2.12 fileSharing CT_FileSharing ? */
      case "<fileSharing":
        break;
      case "<fileSharing/>":
        break;
      /* 18.2.28 workbookPr CT_WorkbookPr ? */
      case "<workbookPr":
      case "<workbookPr/>":
        bs.forEach(function(m) {
          if (u[m[0]] != null)
            switch (m[2]) {
              case "bool":
                r.WBProps[m[0]] = Ve(u[m[0]]);
                break;
              case "int":
                r.WBProps[m[0]] = parseInt(u[m[0]], 10);
                break;
              default:
                r.WBProps[m[0]] = u[m[0]];
            }
        }), u.codeName && (r.WBProps.CodeName = Xe(u.codeName));
        break;
      case "</workbookPr>":
        break;
      /* 18.2.29 workbookProtection CT_WorkbookProtection ? */
      case "<workbookProtection":
        break;
      case "<workbookProtection/>":
        break;
      /* 18.2.1  bookViews CT_BookViews ? */
      case "<bookViews":
      case "<bookViews>":
      case "</bookViews>":
        break;
      /* 18.2.30   workbookView CT_BookView + */
      case "<workbookView":
      case "<workbookView/>":
        delete u[0], r.WBView.push(u);
        break;
      case "</workbookView>":
        break;
      /* 18.2.20 sheets CT_Sheets 1 */
      case "<sheets":
      case "<sheets>":
      case "</sheets>":
        break;
      // aggregate sheet
      /* 18.2.19   sheet CT_Sheet + */
      case "<sheet":
        switch (u.state) {
          case "hidden":
            u.Hidden = 1;
            break;
          case "veryHidden":
            u.Hidden = 2;
            break;
          default:
            u.Hidden = 0;
        }
        delete u.state, u.name = Be(Xe(u.name)), delete u[0], r.Sheets.push(u);
        break;
      case "</sheet>":
        break;
      /* 18.2.15 functionGroups CT_FunctionGroups ? */
      case "<functionGroups":
      case "<functionGroups/>":
        break;
      /* 18.2.14   functionGroup CT_FunctionGroup + */
      case "<functionGroup":
        break;
      /* 18.2.9  externalReferences CT_ExternalReferences ? */
      case "<externalReferences":
      case "</externalReferences>":
      case "<externalReferences>":
        break;
      /* 18.2.8    externalReference CT_ExternalReference + */
      case "<externalReference":
        break;
      /* 18.2.6  definedNames CT_DefinedNames ? */
      case "<definedNames/>":
        break;
      case "<definedNames>":
      case "<definedNames":
        n = !0;
        break;
      case "</definedNames>":
        n = !1;
        break;
      /* 18.2.5    definedName CT_DefinedName + */
      case "<definedName":
        i = {}, i.Name = Xe(u.name), u.comment && (i.Comment = u.comment), u.localSheetId && (i.Sheet = +u.localSheetId), Ve(u.hidden || "0") && (i.Hidden = !0), f = o + c.length;
        break;
      case "</definedName>":
        i.Ref = Be(Xe(e.slice(f, o))), r.Names.push(i);
        break;
      case "<definedName/>":
        break;
      /* 18.2.2  calcPr CT_CalcPr ? */
      case "<calcPr":
        delete u[0], r.CalcPr = u;
        break;
      case "<calcPr/>":
        delete u[0], r.CalcPr = u;
        break;
      case "</calcPr>":
        break;
      /* 18.2.16 oleSize CT_OleSize ? (ref required) */
      case "<oleSize":
        break;
      /* 18.2.4  customWorkbookViews CT_CustomWorkbookViews ? */
      case "<customWorkbookViews>":
      case "</customWorkbookViews>":
      case "<customWorkbookViews":
        break;
      /* 18.2.3  customWorkbookView CT_CustomWorkbookView + */
      case "<customWorkbookView":
      case "</customWorkbookView>":
        break;
      /* 18.2.18 pivotCaches CT_PivotCaches ? */
      case "<pivotCaches>":
      case "</pivotCaches>":
      case "<pivotCaches":
        break;
      /* 18.2.17 pivotCache CT_PivotCache ? */
      case "<pivotCache":
        break;
      /* 18.2.21 smartTagPr CT_SmartTagPr ? */
      case "<smartTagPr":
      case "<smartTagPr/>":
        break;
      /* 18.2.23 smartTagTypes CT_SmartTagTypes ? */
      case "<smartTagTypes":
      case "<smartTagTypes>":
      case "</smartTagTypes>":
        break;
      /* 18.2.22 smartTagType CT_SmartTagType ? */
      case "<smartTagType":
        break;
      /* 18.2.24 webPublishing CT_WebPublishing ? */
      case "<webPublishing":
      case "<webPublishing/>":
        break;
      /* 18.2.11 fileRecoveryPr CT_FileRecoveryPr ? */
      case "<fileRecoveryPr":
      case "<fileRecoveryPr/>":
        break;
      /* 18.2.26 webPublishObjects CT_WebPublishObjects ? */
      case "<webPublishObjects>":
      case "<webPublishObjects":
      case "</webPublishObjects>":
        break;
      /* 18.2.25 webPublishObject CT_WebPublishObject ? */
      case "<webPublishObject":
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
      case "<extLst/>":
        break;
      /* 18.2.7  ext CT_Extension + */
      case "<ext":
        n = !0;
        break;
      //TODO: check with versions of excel
      case "</ext>":
        n = !1;
        break;
      /* Others */
      case "<ArchID":
        break;
      case "<AlternateContent":
      case "<AlternateContent>":
        n = !0;
        break;
      case "</AlternateContent>":
        n = !1;
        break;
      /* TODO */
      case "<revisionPtr":
        break;
      default:
        if (!n && t.WTF) throw new Error("unrecognized " + u[0] + " in workbook");
    }
    return c;
  }), Ec.indexOf(r.xmlns) === -1) throw new Error("Unknown Namespace: " + r.xmlns);
  return Is(r), r;
}
function tx(e, t) {
  var r = {};
  return r.Hidden = e.read_shift(4), r.iTabID = e.read_shift(4), r.strRelID = yn(e), r.name = wr(e), r;
}
function ax(e, t) {
  var r = {}, n = e.read_shift(4);
  r.defaultThemeVersion = e.read_shift(4);
  var a = t > 8 ? wr(e) : "";
  return a.length > 0 && (r.CodeName = a), r.autoCompressPictures = !!(n & 65536), r.backupFile = !!(n & 64), r.checkCompatibility = !!(n & 4096), r.date1904 = !!(n & 1), r.filterPrivacy = !!(n & 8), r.hidePivotFieldList = !!(n & 1024), r.promptedSolutions = !!(n & 16), r.publishItems = !!(n & 2048), r.refreshAllConnections = !!(n & 262144), r.saveExternalLinkValues = !!(n & 128), r.showBorderUnselectedTables = !!(n & 4), r.showInkAnnotation = !!(n & 32), r.showObjects = ["all", "placeholders", "none"][n >> 13 & 3], r.showPivotChartFilter = !!(n & 32768), r.updateLinks = ["userSet", "never", "always"][n >> 8 & 3], r;
}
function nx(e, t) {
  var r = {};
  return e.read_shift(4), r.ArchID = e.read_shift(4), e.l += t - 8, r;
}
function ix(e, t, r) {
  var n = e.l + t, a = e.read_shift(4);
  e.l += 1;
  var i = e.read_shift(4), f = Hc(e), s, c = "";
  try {
    s = X1(e, 0, r);
    try {
      c = tn(e);
    } catch {
    }
  } catch {
    console.error("Could not parse defined name " + f);
  }
  a & 32 && (f = "_xlnm." + f), e.l = n;
  var o = { Name: f, Ptg: s, Flags: a };
  return i < 268435455 && (o.Sheet = i), c && (o.Comment = c), o;
}
function sx(e, t) {
  var r = { AppVersion: {}, WBProps: {}, WBView: [], Sheets: [], CalcPr: {}, xmlns: "" }, n = [], a = !1;
  t || (t = {}), t.biff = 12;
  var i = [], f = [[]];
  return f.SheetNames = [], f.XTI = [], Ja[16] = { n: "BrtFRTArchID$", f: nx }, it(e, function(c, o, u) {
    switch (u) {
      case 156:
        f.SheetNames.push(c.name), r.Sheets.push(c);
        break;
      case 153:
        r.WBProps = c;
        break;
      case 39:
        c.Sheet != null && (t.SID = c.Sheet), c.Ref = c.Ptg ? vr(c.Ptg, null, null, f, t) : "#REF!", delete t.SID, delete c.Ptg, i.push(c);
        break;
      case 1036:
        break;
      case 357:
      /* 'BrtSupSelf' */
      case 358:
      /* 'BrtSupSame' */
      case 355:
      /* 'BrtSupBookSrc' */
      case 667:
        f[0].length ? f.push([u, c]) : f[0] = [u, c], f[f.length - 1].XTI = [];
        break;
      case 362:
        f.length === 0 && (f[0] = [], f[0].XTI = []), f[f.length - 1].XTI = f[f.length - 1].XTI.concat(c), f.XTI = f.XTI.concat(c);
        break;
      case 361:
        break;
      case 2071:
      /* 'BrtAbsPath15' */
      case 158:
      /* 'BrtBookView' */
      case 143:
      /* 'BrtBeginBundleShs' */
      case 664:
      /* 'BrtBeginFnGroup' */
      case 353:
        break;
      /* case 'BrtModelTimeGroupingCalcCol' */
      case 3072:
      /* 'BrtUid' */
      case 3073:
      /* 'BrtRevisionPtr' */
      case 534:
      /* 'BrtBookProtection' */
      case 677:
      /* 'BrtBookProtectionIso' */
      case 157:
      /* 'BrtCalcProp' */
      case 610:
      /* 'BrtCrashRecErr' */
      case 2050:
      /* 'BrtDecoupledPivotCacheID' */
      case 155:
      /* 'BrtFileRecover' */
      case 548:
      /* 'BrtFileSharing' */
      case 676:
      /* 'BrtFileSharingIso' */
      case 128:
      /* 'BrtFileVersion' */
      case 665:
      /* 'BrtFnGroup' */
      case 2128:
      /* 'BrtModelRelationship' */
      case 2125:
      /* 'BrtModelTable' */
      case 549:
      /* 'BrtOleSize' */
      case 2053:
      /* 'BrtPivotTableRef' */
      case 596:
      /* 'BrtSmartTagType' */
      case 2076:
      /* 'BrtTableSlicerCacheID' */
      case 2075:
      /* 'BrtTableSlicerCacheIDs' */
      case 2082:
      /* 'BrtTimelineCachePivotCacheID' */
      case 397:
      /* 'BrtUserBookView' */
      case 154:
      /* 'BrtWbFactoid' */
      case 1117:
      /* 'BrtWbProp14' */
      case 553:
      /* 'BrtWebOpt' */
      case 2091:
        break;
      case 35:
        n.push(u), a = !0;
        break;
      case 36:
        n.pop(), a = !1;
        break;
      case 37:
        n.push(u), a = !0;
        break;
      case 38:
        n.pop(), a = !1;
        break;
      case 16:
        break;
      default:
        if (!o.T) {
          if (!a || t.WTF && n[n.length - 1] != 37 && n[n.length - 1] != 35) throw new Error("Unexpected record 0x" + u.toString(16));
        }
    }
  }, t), Is(r), r.Names = i, r.supbooks = f, r;
}
function fx(e, t, r) {
  return t.slice(-4) === ".bin" ? sx(e, r) : rx(e, r);
}
function cx(e, t, r, n, a, i, f, s) {
  return t.slice(-4) === ".bin" ? Vd(e, n, r, a, i, f, s) : td(e, n, r, a, i, f, s);
}
function ox(e, t, r, n, a, i, f, s) {
  return t.slice(-4) === ".bin" ? Kd(e, n, r, a, i) : $d(e, n, r, a, i);
}
function lx(e, t, r, n, a, i, f, s) {
  return t.slice(-4) === ".bin" ? Eh() : Th();
}
function ux(e, t, r, n, a, i, f, s) {
  return t.slice(-4) === ".bin" ? wh() : kh();
}
function hx(e, t, r, n) {
  return t.slice(-4) === ".bin" ? Hu(e, r, n) : Bu(e, r, n);
}
function dx(e, t, r) {
  return t.slice(-4) === ".bin" ? au(e, r) : ru(e, r);
}
function xx(e, t, r) {
  return t.slice(-4) === ".bin" ? vh(e, r) : hh(e, r);
}
function px(e, t, r) {
  return t.slice(-4) === ".bin" ? ch(e) : sh(e);
}
function mx(e, t, r, n) {
  return r.slice(-4) === ".bin" ? oh(e, t, r, n) : void 0;
}
function vx(e, t, r) {
  return t.slice(-4) === ".bin" ? nh(e, t, r) : ih(e, t, r);
}
var Os = /\b((?:\w+:)?[\w]+)=((?:")([^"]*)(?:")|(?:')([^']*)(?:'))/g, Ds = /\b((?:\w+:)?[\w]+)=((?:")(?:[^"]*)(?:")|(?:')(?:[^']*)(?:'))/;
function Vr(e, t) {
  var r = e.split(/\s+/), n = [];
  if (n[0] = r[0], r.length === 1) return n;
  var a = e.match(Os), i, f, s, c;
  if (a) for (c = 0; c != a.length; ++c)
    i = a[c].match(Ds), (f = i[1].indexOf(":")) === -1 ? n[i[1]] = i[2].slice(1, i[2].length - 1) : (i[1].slice(0, 6) === "xmlns:" ? s = "xmlns" + i[1].slice(6) : s = i[1].slice(f + 1), n[s] = i[2].slice(1, i[2].length - 1));
  return n;
}
function gx(e) {
  var t = e.split(/\s+/), r = {};
  if (t.length === 1) return r;
  var n = e.match(Os), a, i, f, s;
  if (n) for (s = 0; s != n.length; ++s)
    a = n[s].match(Ds), (i = a[1].indexOf(":")) === -1 ? r[a[1]] = a[2].slice(1, a[2].length - 1) : (a[1].slice(0, 6) === "xmlns:" ? f = "xmlns" + a[1].slice(6) : f = a[1].slice(i + 1), r[f] = a[2].slice(1, a[2].length - 1));
  return r;
}
var sa;
function _x(e, t, r) {
  var n = sa[e] || Be(e);
  return n === "General" ? At(t) : Nr(n, t, { date1904: !!r });
}
function wx(e, t, r, n) {
  var a = n;
  switch ((r[0].match(/dt:dt="([\w.]+)"/) || ["", ""])[1]) {
    case "boolean":
      a = Ve(n);
      break;
    case "i2":
    case "int":
      a = parseInt(n, 10);
      break;
    case "r4":
    case "float":
      a = parseFloat(n);
      break;
    case "date":
    case "dateTime.tz":
      a = dr(n);
      break;
    case "i8":
    case "string":
    case "fixed":
    case "uuid":
    case "bin.base64":
      break;
    default:
      throw new Error("bad custprop:" + r[0]);
  }
  e[Be(t)] = a;
}
function kx(e, t, r, n) {
  if (e.t !== "z") {
    if (!r || r.cellText !== !1) try {
      e.t === "e" ? e.w = e.w || Sr[e.v] : t === "General" ? e.t === "n" ? (e.v | 0) === e.v ? e.w = e.v.toString(10) : e.w = oa(e.v) : e.w = At(e.v) : e.w = _x(t || "General", e.v, n);
    } catch (f) {
      if (r.WTF) throw f;
    }
    try {
      var a = sa[t] || t || "General";
      if (r.cellNF && (e.z = a), r.cellDates && e.t == "n" && $r(a)) {
        var i = qr(e.v + (n ? 1462 : 0));
        i && (e.t = "d", e.v = new Date(Date.UTC(i.y, i.m - 1, i.d, i.H, i.M, i.S, i.u)));
      }
    } catch (f) {
      if (r.WTF) throw f;
    }
  }
}
function Ex(e, t, r) {
  if (r.cellStyles && t.Interior) {
    var n = t.Interior;
    n.Pattern && (n.patternType = Iu[n.Pattern] || n.Pattern);
  }
  e[t.ID] = t;
}
function Tx(e, t, r, n, a, i, f, s, c, o, u) {
  var m = "General", x = n.StyleID, l = {};
  o = o || {};
  var v = [], p = 0;
  for (x === void 0 && s && (x = s.StyleID), x === void 0 && f && (x = f.StyleID); i[x] !== void 0; ) {
    var d = i[x];
    if (d.nf && (m = d.nf), d.Interior && v.push(d.Interior), !d.Parent) break;
    x = d.Parent;
  }
  switch (r.Type) {
    case "Boolean":
      n.t = "b", n.v = Ve(e);
      break;
    case "String":
      n.t = "s", n.r = pi(Be(e)), n.v = e.indexOf("<") > -1 ? Be(t || e).replace(/<[^<>]*>/g, "") : n.r;
      break;
    case "DateTime":
      e.slice(-1) != "Z" && (e += "Z"), n.v = sr(dr(e, u), u), n.v !== n.v && (n.v = Be(e)), (!m || m == "General") && (m = "yyyy-mm-dd");
    /* falls through */
    case "Number":
      n.v === void 0 && (n.v = +e), n.t || (n.t = "n");
      break;
    case "Error":
      n.t = "e", n.v = ur[e], o.cellText !== !1 && (n.w = e);
      break;
    default:
      e == "" && t == "" ? n.t = "z" : (n.t = "s", n.v = pi(t || e));
      break;
  }
  if (kx(n, m, o, u), o.cellFormula !== !1)
    if (n.Formula) {
      var h = Be(n.Formula);
      h.charCodeAt(0) == 61 && (h = h.slice(1)), n.f = Tt(h, a), delete n.Formula, n.ArrayRange == "RC" ? n.F = Tt("RC:RC", a) : n.ArrayRange && (n.F = Tt(n.ArrayRange, a), c.push([Je(n.F), n.F]));
    } else
      for (p = 0; p < c.length; ++p)
        a.r >= c[p][0].s.r && a.r <= c[p][0].e.r && a.c >= c[p][0].s.c && a.c <= c[p][0].e.c && (n.F = c[p][1]);
  o.cellStyles && (v.forEach(function(_) {
    !l.patternType && _.patternType && (l.patternType = _.patternType);
  }), n.s = l), n.StyleID !== void 0 && (n.ixfe = n.StyleID);
}
function yx(e) {
  return Z0.indexOf("_xlnm." + e) > -1 ? "_xlnm." + e : e;
}
function Ax(e) {
  e.t = e.v || "", e.t = e.t.replace(/\r\n/g, `
`).replace(/\r/g, `
`), e.v = e.w = e.ixfe = void 0;
}
function gn(e, t) {
  var r = t || {};
  k0();
  var n = jt(rn(e));
  (r.type == "binary" || r.type == "array" || r.type == "base64") && (n = Xe(n));
  var a = n.slice(0, 1024).toLowerCase(), i = !1;
  if (a = a.replace(/".*?"/g, ""), (a.indexOf(">") & 1023) > Math.min(a.indexOf(",") & 1023, a.indexOf(";") & 1023)) {
    var f = nr(r);
    return f.type = "string", ua.to_workbook(n, f);
  }
  if (a.indexOf("<?xml") == -1 && ["html", "table", "head", "meta", "script", "style", "div"].forEach(function(C) {
    a.indexOf("<" + C) >= 0 && (i = !0);
  }), i) return Nx(n, r);
  sa = {
    "General Number": "General",
    "General Date": be[22],
    "Long Date": "dddd, mmmm dd, yyyy",
    "Medium Date": be[15],
    "Short Date": be[14],
    "Long Time": be[19],
    "Medium Time": be[18],
    "Short Time": be[20],
    Currency: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
    Fixed: be[2],
    Standard: be[4],
    Percent: be[10],
    Scientific: be[11],
    "Yes/No": '"Yes";"Yes";"No";@',
    "True/False": '"True";"True";"False";@',
    "On/Off": '"Yes";"Yes";"No";@'
  };
  var s, c = [], o, u = {}, m = [], x = {}, l = "";
  r.dense && (x["!data"] = []);
  var v = {}, p = {}, d = Vr('<Data ss:Type="String">'), h = 0, _ = 0, g = 0, E = { s: { r: 2e6, c: 2e6 }, e: { r: 0, c: 0 } }, A = {}, P = {}, S = "", R = 0, F = [], U = {}, H = {}, y = 0, W = [], k = [], j = {}, me = [], Z, xe = !1, fe = [], q = [], J = {}, Y = 0, pe = 0, ce = { Sheets: [], WBProps: { date1904: !1 } }, de = {};
  tr.lastIndex = 0, n = ma(n, "<!--", "-->");
  for (var Te = ""; s = tr.exec(n); ) switch (s[3] = (Te = s[3]).toLowerCase()) {
    case "data":
      if (Te == "data") {
        if (s[1] === "/") {
          if ((o = c.pop())[0] !== s[3]) throw new Error("Bad state: " + o.join("|"));
        } else s[0].charAt(s[0].length - 2) !== "/" && c.push([s[3], !0]);
        break;
      }
      if (c[c.length - 1][1]) break;
      s[1] === "/" ? Tx(n.slice(h, s.index), S, d, c[c.length - 1][0] == /*"Comment"*/
      "comment" ? j : v, { c: _, r: g }, A, me[_], p, fe, r, ce.WBProps.date1904) : (S = "", d = Vr(s[0]), h = s.index + s[0].length);
      break;
    case "cell":
      if (s[1] === "/")
        if (k.length > 0 && (v.c = k), (!r.sheetRows || r.sheetRows > g) && v.v !== void 0 && (r.dense ? (x["!data"][g] || (x["!data"][g] = []), x["!data"][g][_] = v) : x[He(_) + Ge(g)] = v), v.HRef && (v.l = { Target: Be(v.HRef) }, v.HRefScreenTip && (v.l.Tooltip = v.HRefScreenTip), delete v.HRef, delete v.HRefScreenTip), (v.MergeAcross || v.MergeDown) && (Y = _ + (parseInt(v.MergeAcross, 10) | 0), pe = g + (parseInt(v.MergeDown, 10) | 0), (Y > _ || pe > g) && F.push({ s: { c: _, r: g }, e: { c: Y, r: pe } })), !r.sheetStubs)
          v.MergeAcross ? _ = Y + 1 : ++_;
        else if (v.MergeAcross || v.MergeDown) {
          for (var Ce = _; Ce <= Y; ++Ce)
            for (var O = g; O <= pe; ++O)
              (Ce > _ || O > g) && (r.dense ? (x["!data"][O] || (x["!data"][O] = []), x["!data"][O][Ce] = { t: "z" }) : x[He(Ce) + Ge(O)] = { t: "z" });
          _ = Y + 1;
        } else ++_;
      else
        v = gx(s[0]), v.Index && (_ = +v.Index - 1), _ < E.s.c && (E.s.c = _), _ > E.e.c && (E.e.c = _), s[0].slice(-2) === "/>" && ++_, k = [];
      break;
    case "row":
      s[1] === "/" || s[0].slice(-2) === "/>" ? (g < E.s.r && (E.s.r = g), g > E.e.r && (E.e.r = g), s[0].slice(-2) === "/>" && (p = Vr(s[0]), p.Index && (g = +p.Index - 1)), _ = 0, ++g) : (p = Vr(s[0]), p.Index && (g = +p.Index - 1), J = {}, (p.AutoFitHeight == "0" || p.Height) && (J.hpx = parseInt(p.Height, 10), J.hpt = ms(J.hpx), q[g] = J), p.Hidden == "1" && (J.hidden = !0, q[g] = J));
      break;
    case "worksheet":
      if (s[1] === "/") {
        if ((o = c.pop())[0] !== s[3]) throw new Error("Bad state: " + o.join("|"));
        m.push(l), E.s.r <= E.e.r && E.s.c <= E.e.c && (x["!ref"] = Le(E), r.sheetRows && r.sheetRows <= E.e.r && (x["!fullref"] = x["!ref"], E.e.r = r.sheetRows - 1, x["!ref"] = Le(E))), F.length && (x["!merges"] = F), me.length > 0 && (x["!cols"] = me), q.length > 0 && (x["!rows"] = q), u[l] = x;
      } else
        E = { s: { r: 2e6, c: 2e6 }, e: { r: 0, c: 0 } }, g = _ = 0, c.push([s[3], !1]), o = Vr(s[0]), l = Be(o.Name), x = {}, r.dense && (x["!data"] = []), F = [], fe = [], q = [], de = { name: l, Hidden: 0 }, ce.Sheets.push(de);
      break;
    case "table":
      if (s[1] === "/") {
        if ((o = c.pop())[0] !== s[3]) throw new Error("Bad state: " + o.join("|"));
      } else {
        if (s[0].slice(-2) == "/>") break;
        c.push([s[3], !1]), me = [], xe = !1;
      }
      break;
    case "style":
      s[1] === "/" ? Ex(A, P, r) : P = Vr(s[0]);
      break;
    case "numberformat":
      P.nf = Be(Vr(s[0]).Format || "General"), sa[P.nf] && (P.nf = sa[P.nf]);
      for (var K = 0; K != 392 && be[K] != P.nf; ++K) ;
      if (K == 392) {
        for (K = 57; K != 392; ++K) if (be[K] == null) {
          wt(P.nf, K);
          break;
        }
      }
      break;
    case "column":
      if (c[c.length - 1][0] !== /*'Table'*/
      "table" || s[1] === "/") break;
      if (Z = Vr(s[0]), Z.Hidden && (Z.hidden = !0, delete Z.Hidden), Z.Width && (Z.wpx = parseInt(Z.Width, 10)), !xe && Z.wpx > 10) {
        xe = !0, Tr = xs;
        for (var X = 0; X < me.length; ++X) me[X] && Ht(me[X]);
      }
      xe && Ht(Z), me[Z.Index - 1 || me.length] = Z;
      for (var z = 0; z < +Z.Span; ++z) me[me.length] = nr(Z);
      break;
    case "namedrange":
      if (s[1] === "/") break;
      ce.Names || (ce.Names = []);
      var he = Ae(s[0]), N = {
        Name: yx(he.Name),
        Ref: Tt(he.RefersTo.slice(1), { r: 0, c: 0 })
      };
      ce.Sheets.length > 0 && (N.Sheet = ce.Sheets.length - 1), ce.Names.push(N);
      break;
    case "namedcell":
      break;
    case "b":
      break;
    case "i":
      break;
    case "u":
      break;
    case "s":
      break;
    case "em":
      break;
    case "h2":
      break;
    case "h3":
      break;
    case "sub":
      break;
    case "sup":
      break;
    case "span":
      break;
    case "alignment":
      break;
    case "borders":
      break;
    case "border":
      break;
    case "font":
      if (s[0].slice(-2) === "/>") break;
      s[1] === "/" ? S += n.slice(R, s.index) : R = s.index + s[0].length;
      break;
    case "interior":
      if (!r.cellStyles) break;
      P.Interior = Vr(s[0]);
      break;
    case "protection":
      break;
    case "author":
    case "title":
    case "description":
    case "created":
    case "keywords":
    case "subject":
    case "category":
    case "company":
    case "lastauthor":
    case "lastsaved":
    case "lastprinted":
    case "version":
    case "revision":
    case "totaltime":
    case "hyperlinkbase":
    case "manager":
    case "contentstatus":
    case "identifier":
    case "language":
    case "appname":
      if (s[0].slice(-2) === "/>") break;
      s[1] === "/" ? ho(U, Te, n.slice(y, s.index)) : y = s.index + s[0].length;
      break;
    case "paragraphs":
      break;
    case "styles":
    case "workbook":
      if (s[1] === "/") {
        if ((o = c.pop())[0] !== s[3]) throw new Error("Bad state: " + o.join("|"));
      } else c.push([s[3], !1]);
      break;
    case "comment":
      if (s[1] === "/") {
        if ((o = c.pop())[0] !== s[3]) throw new Error("Bad state: " + o.join("|"));
        Ax(j), k.push(j);
      } else
        c.push([s[3], !1]), o = Vr(s[0]), Ve(o.ShowAlways || "0") || (k.hidden = !0), j = { a: o.Author };
      break;
    case "autofilter":
      if (s[1] === "/") {
        if ((o = c.pop())[0] !== s[3]) throw new Error("Bad state: " + o.join("|"));
      } else if (s[0].charAt(s[0].length - 2) !== "/") {
        var w = Vr(s[0]);
        x["!autofilter"] = { ref: Tt(w.Range).replace(/\$/g, "") }, c.push([s[3], !0]);
      }
      break;
    case "name":
      break;
    case "datavalidation":
      if (s[1] === "/") {
        if ((o = c.pop())[0] !== s[3]) throw new Error("Bad state: " + o.join("|"));
      } else
        s[0].charAt(s[0].length - 2) !== "/" && c.push([s[3], !0]);
      break;
    case "pixelsperinch":
      break;
    case "componentoptions":
    case "documentproperties":
    case "customdocumentproperties":
    case "officedocumentsettings":
    case "pivottable":
    case "pivotcache":
    case "names":
    case "mapinfo":
    case "pagebreaks":
    case "querytable":
    case "sorting":
    case "schema":
    //case 'data' /*case 'data'*/:
    case "conditionalformatting":
    case "smarttagtype":
    case "smarttags":
    case "excelworkbook":
    case "workbookoptions":
    case "worksheetoptions":
      if (s[1] === "/") {
        if ((o = c.pop())[0] !== s[3]) throw new Error("Bad state: " + o.join("|"));
      } else s[0].charAt(s[0].length - 2) !== "/" && c.push([s[3], !0]);
      break;
    case "null":
      break;
    default:
      if (c.length == 0 && s[3] == "document" || c.length == 0 && s[3] == "uof") return e0(n, r);
      var Q = !0;
      switch (c[c.length - 1][0]) {
        /* OfficeDocumentSettings */
        case "officedocumentsettings":
          switch (s[3]) {
            case "allowpng":
              break;
            case "removepersonalinformation":
              break;
            case "downloadcomponents":
              break;
            case "locationofcomponents":
              break;
            case "colors":
              break;
            case "color":
              break;
            case "index":
              break;
            case "rgb":
              break;
            case "targetscreensize":
              break;
            case "readonlyrecommended":
              break;
            default:
              Q = !1;
          }
          break;
        /* ComponentOptions */
        case "componentoptions":
          switch (s[3]) {
            case "toolbar":
              break;
            case "hideofficelogo":
              break;
            case "spreadsheetautofit":
              break;
            case "label":
              break;
            case "caption":
              break;
            case "maxheight":
              break;
            case "maxwidth":
              break;
            case "nextsheetnumber":
              break;
            default:
              Q = !1;
          }
          break;
        /* ExcelWorkbook */
        case "excelworkbook":
          switch (s[3]) {
            case "date1904":
              ce.WBProps.date1904 = !0;
              break;
            case "hidehorizontalscrollbar":
              break;
            case "hideverticalscrollbar":
              break;
            case "hideworkbooktabs":
              break;
            case "windowheight":
              break;
            case "windowwidth":
              break;
            case "windowtopx":
              break;
            case "windowtopy":
              break;
            case "tabratio":
              break;
            case "protectstructure":
              break;
            case "protectwindow":
              break;
            case "protectwindows":
              break;
            case "activesheet":
              break;
            case "displayinknotes":
              break;
            case "firstvisiblesheet":
              break;
            case "supbook":
              break;
            case "sheetname":
              break;
            case "sheetindex":
              break;
            case "sheetindexfirst":
              break;
            case "sheetindexlast":
              break;
            case "dll":
              break;
            case "acceptlabelsinformulas":
              break;
            case "donotsavelinkvalues":
              break;
            case "iteration":
              break;
            case "maxiterations":
              break;
            case "maxchange":
              break;
            case "path":
              break;
            case "xct":
              break;
            case "count":
              break;
            case "selectedsheets":
              break;
            case "calculation":
              break;
            case "uncalced":
              break;
            case "startupprompt":
              break;
            case "crn":
              break;
            case "externname":
              break;
            case "formula":
              break;
            case "colfirst":
              break;
            case "collast":
              break;
            case "wantadvise":
              break;
            case "boolean":
              break;
            case "error":
              break;
            case "text":
              break;
            case "ole":
              break;
            case "noautorecover":
              break;
            case "publishobjects":
              break;
            case "donotcalculatebeforesave":
              break;
            case "number":
              break;
            case "refmoder1c1":
              break;
            case "embedsavesmarttags":
              break;
            default:
              Q = !1;
          }
          break;
        /* WorkbookOptions */
        case "workbookoptions":
          switch (s[3]) {
            case "owcversion":
              break;
            case "height":
              break;
            case "width":
              break;
            default:
              Q = !1;
          }
          break;
        /* WorksheetOptions */
        case "worksheetoptions":
          switch (s[3]) {
            case "visible":
              if (s[0].slice(-2) !== "/>") if (s[1] === "/") switch (n.slice(y, s.index)) {
                case "SheetHidden":
                  de.Hidden = 1;
                  break;
                case "SheetVeryHidden":
                  de.Hidden = 2;
                  break;
              }
              else y = s.index + s[0].length;
              break;
            case "header":
              x["!margins"] || ia(x["!margins"] = {}, "xlml"), isNaN(+Ae(s[0]).Margin) || (x["!margins"].header = +Ae(s[0]).Margin);
              break;
            case "footer":
              x["!margins"] || ia(x["!margins"] = {}, "xlml"), isNaN(+Ae(s[0]).Margin) || (x["!margins"].footer = +Ae(s[0]).Margin);
              break;
            case "pagemargins":
              var V = Ae(s[0]);
              x["!margins"] || ia(x["!margins"] = {}, "xlml"), isNaN(+V.Top) || (x["!margins"].top = +V.Top), isNaN(+V.Left) || (x["!margins"].left = +V.Left), isNaN(+V.Right) || (x["!margins"].right = +V.Right), isNaN(+V.Bottom) || (x["!margins"].bottom = +V.Bottom);
              break;
            case "displayrighttoleft":
              ce.Views || (ce.Views = []), ce.Views[0] || (ce.Views[0] = {}), ce.Views[0].RTL = !0;
              break;
            case "freezepanes":
              break;
            case "frozennosplit":
              break;
            case "splithorizontal":
            case "splitvertical":
              break;
            case "donotdisplaygridlines":
              break;
            case "activerow":
              break;
            case "activecol":
              break;
            case "toprowbottompane":
              break;
            case "leftcolumnrightpane":
              break;
            case "unsynced":
              break;
            case "print":
              break;
            case "printerrors":
              break;
            case "panes":
              break;
            case "scale":
              break;
            case "pane":
              break;
            case "number":
              break;
            case "layout":
              break;
            case "pagesetup":
              break;
            case "selected":
              break;
            case "protectobjects":
              break;
            case "enableselection":
              break;
            case "protectscenarios":
              break;
            case "validprinterinfo":
              break;
            case "horizontalresolution":
              break;
            case "verticalresolution":
              break;
            case "numberofcopies":
              break;
            case "activepane":
              break;
            case "toprowvisible":
              break;
            case "leftcolumnvisible":
              break;
            case "fittopage":
              break;
            case "rangeselection":
              break;
            case "papersizeindex":
              break;
            case "pagelayoutzoom":
              break;
            case "pagebreakzoom":
              break;
            case "filteron":
              break;
            case "fitwidth":
              break;
            case "fitheight":
              break;
            case "commentslayout":
              break;
            case "zoom":
              break;
            case "lefttoright":
              break;
            case "gridlines":
              break;
            case "allowsort":
              break;
            case "allowfilter":
              break;
            case "allowinsertrows":
              break;
            case "allowdeleterows":
              break;
            case "allowinsertcols":
              break;
            case "allowdeletecols":
              break;
            case "allowinserthyperlinks":
              break;
            case "allowformatcells":
              break;
            case "allowsizecols":
              break;
            case "allowsizerows":
              break;
            case "nosummaryrowsbelowdetail":
              x["!outline"] || (x["!outline"] = {}), x["!outline"].above = !0;
              break;
            case "tabcolorindex":
              break;
            case "donotdisplayheadings":
              break;
            case "showpagelayoutzoom":
              break;
            case "nosummarycolumnsrightdetail":
              x["!outline"] || (x["!outline"] = {}), x["!outline"].left = !0;
              break;
            case "blackandwhite":
              break;
            case "donotdisplayzeros":
              break;
            case "displaypagebreak":
              break;
            case "rowcolheadings":
              break;
            case "donotdisplayoutline":
              break;
            case "noorientation":
              break;
            case "allowusepivottables":
              break;
            case "zeroheight":
              break;
            case "viewablerange":
              break;
            case "selection":
              break;
            case "protectcontents":
              break;
            default:
              Q = !1;
          }
          break;
        /* PivotTable */
        case "pivottable":
        case "pivotcache":
          switch (s[3]) {
            case "immediateitemsondrop":
              break;
            case "showpagemultipleitemlabel":
              break;
            case "compactrowindent":
              break;
            case "location":
              break;
            case "pivotfield":
              break;
            case "orientation":
              break;
            case "layoutform":
              break;
            case "layoutsubtotallocation":
              break;
            case "layoutcompactrow":
              break;
            case "position":
              break;
            case "pivotitem":
              break;
            case "datatype":
              break;
            case "datafield":
              break;
            case "sourcename":
              break;
            case "parentfield":
              break;
            case "ptlineitems":
              break;
            case "ptlineitem":
              break;
            case "countofsameitems":
              break;
            case "item":
              break;
            case "itemtype":
              break;
            case "ptsource":
              break;
            case "cacheindex":
              break;
            case "consolidationreference":
              break;
            case "filename":
              break;
            case "reference":
              break;
            case "nocolumngrand":
              break;
            case "norowgrand":
              break;
            case "blanklineafteritems":
              break;
            case "hidden":
              break;
            case "subtotal":
              break;
            case "basefield":
              break;
            case "mapchilditems":
              break;
            case "function":
              break;
            case "refreshonfileopen":
              break;
            case "printsettitles":
              break;
            case "mergelabels":
              break;
            case "defaultversion":
              break;
            case "refreshname":
              break;
            case "refreshdate":
              break;
            case "refreshdatecopy":
              break;
            case "versionlastrefresh":
              break;
            case "versionlastupdate":
              break;
            case "versionupdateablemin":
              break;
            case "versionrefreshablemin":
              break;
            case "calculation":
              break;
            default:
              Q = !1;
          }
          break;
        /* PageBreaks */
        case "pagebreaks":
          switch (s[3]) {
            case "colbreaks":
              break;
            case "colbreak":
              break;
            case "rowbreaks":
              break;
            case "rowbreak":
              break;
            case "colstart":
              break;
            case "colend":
              break;
            case "rowend":
              break;
            default:
              Q = !1;
          }
          break;
        /* AutoFilter */
        case "autofilter":
          switch (s[3]) {
            case "autofiltercolumn":
              break;
            case "autofiltercondition":
              break;
            case "autofilterand":
              break;
            case "autofilteror":
              break;
            default:
              Q = !1;
          }
          break;
        /* QueryTable */
        case "querytable":
          switch (s[3]) {
            case "id":
              break;
            case "autoformatfont":
              break;
            case "autoformatpattern":
              break;
            case "querysource":
              break;
            case "querytype":
              break;
            case "enableredirections":
              break;
            case "refreshedinxl9":
              break;
            case "urlstring":
              break;
            case "htmltables":
              break;
            case "connection":
              break;
            case "commandtext":
              break;
            case "refreshinfo":
              break;
            case "notitles":
              break;
            case "nextid":
              break;
            case "columninfo":
              break;
            case "overwritecells":
              break;
            case "donotpromptforfile":
              break;
            case "textwizardsettings":
              break;
            case "source":
              break;
            case "number":
              break;
            case "decimal":
              break;
            case "thousandseparator":
              break;
            case "trailingminusnumbers":
              break;
            case "formatsettings":
              break;
            case "fieldtype":
              break;
            case "delimiters":
              break;
            case "tab":
              break;
            case "comma":
              break;
            case "autoformatname":
              break;
            case "versionlastedit":
              break;
            case "versionlastrefresh":
              break;
            default:
              Q = !1;
          }
          break;
        case "datavalidation":
          switch (s[3]) {
            case "range":
              break;
            case "type":
              break;
            case "min":
              break;
            case "max":
              break;
            case "sort":
              break;
            case "descending":
              break;
            case "order":
              break;
            case "casesensitive":
              break;
            case "value":
              break;
            case "errorstyle":
              break;
            case "errormessage":
              break;
            case "errortitle":
              break;
            case "inputmessage":
              break;
            case "inputtitle":
              break;
            case "combohide":
              break;
            case "inputhide":
              break;
            case "condition":
              break;
            case "qualifier":
              break;
            case "useblank":
              break;
            case "value1":
              break;
            case "value2":
              break;
            case "format":
              break;
            case "cellrangelist":
              break;
            default:
              Q = !1;
          }
          break;
        case "sorting":
        case "conditionalformatting":
          switch (s[3]) {
            case "range":
              break;
            case "type":
              break;
            case "min":
              break;
            case "max":
              break;
            case "sort":
              break;
            case "descending":
              break;
            case "order":
              break;
            case "casesensitive":
              break;
            case "value":
              break;
            case "errorstyle":
              break;
            case "errormessage":
              break;
            case "errortitle":
              break;
            case "cellrangelist":
              break;
            case "inputmessage":
              break;
            case "inputtitle":
              break;
            case "combohide":
              break;
            case "inputhide":
              break;
            case "condition":
              break;
            case "qualifier":
              break;
            case "useblank":
              break;
            case "value1":
              break;
            case "value2":
              break;
            case "format":
              break;
            default:
              Q = !1;
          }
          break;
        /* MapInfo (schema) */
        case "mapinfo":
        case "schema":
        case "data":
          switch (s[3]) {
            case "map":
              break;
            case "entry":
              break;
            case "range":
              break;
            case "xpath":
              break;
            case "field":
              break;
            case "xsdtype":
              break;
            case "filteron":
              break;
            case "aggregate":
              break;
            case "elementtype":
              break;
            case "attributetype":
              break;
            /* These are from xsd (XML Schema Definition) */
            case "schema":
            case "element":
            case "complextype":
            case "datatype":
            case "all":
            case "attribute":
            case "extends":
              break;
            case "row":
              break;
            default:
              Q = !1;
          }
          break;
        /* SmartTags (can be anything) */
        case "smarttags":
          break;
        default:
          Q = !1;
          break;
      }
      if (Q || s[3].match(/!\[CDATA/)) break;
      if (!c[c.length - 1][1]) throw "Unrecognized tag: " + s[3] + "|" + c.join("|");
      if (c[c.length - 1][0] === /*'CustomDocumentProperties'*/
      "customdocumentproperties") {
        if (s[0].slice(-2) === "/>") break;
        s[1] === "/" ? wx(H, Te, W, n.slice(y, s.index)) : (W = s, y = s.index + s[0].length);
        break;
      }
      if (r.WTF) throw "Unrecognized tag: " + s[3] + "|" + c.join("|");
  }
  var I = {};
  return !r.bookSheets && !r.bookProps && (I.Sheets = u), I.SheetNames = m, I.Workbook = ce, I.SSF = nr(be), I.Props = U, I.Custprops = H, I.bookType = "xlml", I;
}
function Sn(e, t) {
  switch (Qn(t = t || {}), t.type || "base64") {
    case "base64":
      return gn(Rr(e), t);
    case "binary":
    case "buffer":
    case "file":
      return gn(e, t);
    case "array":
      return gn(nt(e), t);
  }
}
function Fx(e) {
  var t = {}, r = e.content;
  if (r.l = 28, t.AnsiUserType = r.read_shift(0, "lpstr-ansi"), t.AnsiClipboardFormat = Xc(r), r.length - r.l <= 4) return t;
  var n = r.read_shift(4);
  if (n == 0 || n > 40 || (r.l -= 4, t.Reserved1 = r.read_shift(0, "lpstr-ansi"), r.length - r.l <= 4) || (n = r.read_shift(4), n !== 1907505652) || (t.UnicodeClipboardFormat = $c(r), n = r.read_shift(4), n == 0 || n > 40)) return t;
  r.l -= 4, t.Reserved2 = r.read_shift(0, "lpwstr");
}
var Sx = [60, 1084, 2066, 2165, 2175];
function Cx(e, t, r, n, a) {
  var i = n, f = [], s = r.slice(r.l, r.l + i);
  if (a && a.enc && a.enc.insitu && s.length > 0) switch (e) {
    case 9:
    case 521:
    case 1033:
    case 2057:
    case 47:
    case 405:
    case 225:
    case 406:
    case 312:
    case 404:
    case 10:
      break;
    case 133:
      break;
    default:
      a.enc.insitu(s);
  }
  f.push(s), r.l += i;
  for (var c = rt(r, r.l), o = Cn[c], u = 0; o != null && Sx.indexOf(c) > -1; )
    i = rt(r, r.l + 2), u = r.l + 4, c == 2066 ? u += 4 : (c == 2165 || c == 2175) && (u += 12), s = r.slice(u, r.l + 4 + i), f.push(s), r.l += 4 + i, o = Cn[c = rt(r, r.l)];
  var m = ft(f);
  ir(m, 0);
  var x = 0;
  m.lens = [];
  for (var l = 0; l < f.length; ++l)
    m.lens.push(x), x += f[l].length;
  if (m.length < n) throw "XLS Record 0x" + e.toString(16) + " Truncated: " + m.length + " < " + n;
  return t.f(m, m.length, a);
}
function Kr(e, t, r) {
  if (e.t !== "z" && e.XF) {
    var n = 0;
    try {
      n = e.z || e.XF.numFmtId || 0, t.cellNF && e.z == null && (e.z = be[n]);
    } catch (i) {
      if (t.WTF) throw i;
    }
    if (!t || t.cellText !== !1) try {
      e.t === "e" ? e.w = e.w || Sr[e.v] : n === 0 || n == "General" ? e.t === "n" ? (e.v | 0) === e.v ? e.w = e.v.toString(10) : e.w = oa(e.v) : e.w = At(e.v) : e.w = Nr(n, e.v, { date1904: !!r, dateNF: t && t.dateNF });
    } catch (i) {
      if (t.WTF) throw i;
    }
    if (t.cellDates && n && e.t == "n" && $r(be[n] || String(n))) {
      var a = qr(e.v + (r ? 1462 : 0));
      a && (e.t = "d", e.v = new Date(Date.UTC(a.y, a.m - 1, a.d, a.H, a.M, a.S, a.u)));
    }
  }
}
function Ma(e, t, r) {
  return { v: e, ixfe: t, t: r };
}
function bx(e, t) {
  var r = { opts: {} }, n = {}, a = {};
  t.dense && (a["!data"] = []);
  var i = {}, f = {}, s = null, c = [], o = "", u = {}, m, x = "", l, v, p, d, h = {}, _ = [], g, E, A = [], P = [], S = { Sheets: [], WBProps: { date1904: !1 }, Views: [{}] }, R = {}, F = !1, U = function(ke) {
    return ke < 8 ? Et[ke] : ke < 64 && P[ke - 8] || Et[ke];
  }, H = function(ke, Ne) {
    var De = ke.XF.data;
    if (!(!De || !De.patternType || !Ne || !Ne.cellStyles)) {
      ke.s = {}, ke.s.patternType = De.patternType;
      var $e;
      ($e = ha(U(De.icvFore))) && (ke.s.fgColor = { rgb: $e }), ($e = ha(U(De.icvBack))) && (ke.s.bgColor = { rgb: $e });
    }
  }, y = function(ke, Ne, De) {
    if (!(!F && Y > 1) && !(De.sheetRows && ke.r >= De.sheetRows)) {
      if (De.cellStyles && Ne.XF && Ne.XF.data && H(Ne, De), delete Ne.ixfe, delete Ne.XF, m = ke, x = We(ke), (!f || !f.s || !f.e) && (f = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }), ke.r < f.s.r && (f.s.r = ke.r), ke.c < f.s.c && (f.s.c = ke.c), ke.r + 1 > f.e.r && (f.e.r = ke.r + 1), ke.c + 1 > f.e.c && (f.e.c = ke.c + 1), De.cellFormula && Ne.f) {
        for (var $e = 0; $e < _.length; ++$e)
          if (!(_[$e][0].s.c > ke.c || _[$e][0].s.r > ke.r) && !(_[$e][0].e.c < ke.c || _[$e][0].e.r < ke.r)) {
            Ne.F = Le(_[$e][0]), (_[$e][0].s.c != ke.c || _[$e][0].s.r != ke.r) && delete Ne.f, Ne.f && (Ne.f = "" + vr(_[$e][1], f, ke, q, W));
            break;
          }
      }
      De.dense ? (a["!data"][ke.r] || (a["!data"][ke.r] = []), a["!data"][ke.r][ke.c] = Ne) : a[x] = Ne;
    }
  }, W = {
    enc: !1,
    // encrypted
    sbcch: 0,
    // cch in the preceding SupBook
    snames: [],
    // sheetnames
    sharedf: h,
    // shared formulae by address
    arrayf: _,
    // array formulae array
    rrtabid: [],
    // RRTabId
    lastuser: "",
    // Last User from WriteAccess
    biff: 8,
    // BIFF version
    codepage: 0,
    // CP from CodePage record
    winlocked: 0,
    // fLockWn from WinProtect
    cellStyles: !!t && !!t.cellStyles,
    WTF: !!t && !!t.wtf
  };
  t.password && (W.password = t.password);
  var k, j = [], me = [], Z = [], xe = [], fe = !1, q = [];
  q.SheetNames = W.snames, q.sharedf = W.sharedf, q.arrayf = W.arrayf, q.names = [], q.XTI = [];
  var J = 0, Y = 0, pe = 0, ce = [], de = [], Te;
  W.codepage = 1200, Gr(1200);
  for (var Ce = !1; e.l < e.length - 1; ) {
    var O = e.l, K = e.read_shift(2);
    if (K === 0 && J === 10) break;
    var X = e.l === e.length ? 0 : e.read_shift(2), z = Cn[K];
    if (Y == 0 && [9, 521, 1033, 2057].indexOf(K) == -1) break;
    if (z && z.f) {
      if (t.bookSheets && J === 133 && K !== 133)
        break;
      if (J = K, z.r === 2 || z.r == 12) {
        var he = e.read_shift(2);
        if (X -= 2, !W.enc && he !== K && ((he & 255) << 8 | he >> 8) !== K) throw new Error("rt mismatch: " + he + "!=" + K);
        z.r == 12 && (e.l += 10, X -= 10);
      }
      var N = {};
      if (K === 10 ? N = /*::(*/
      z.f(e, X, W) : N = /*::(*/
      Cx(K, z, e, X, W), Y == 0 && [9, 521, 1033, 2057].indexOf(J) === -1) continue;
      switch (K) {
        case 34:
          r.opts.Date1904 = S.WBProps.date1904 = N;
          break;
        case 134:
          r.opts.WriteProtect = !0;
          break;
        case 47:
          if (W.enc || (e.l = 0), W.enc = N, !t.password) throw new Error("File is password-protected");
          if (N.valid == null) throw new Error("Encryption scheme unsupported");
          if (!N.valid) throw new Error("Password is incorrect");
          break;
        case 92:
          W.lastuser = N;
          break;
        case 66:
          var w = Number(N);
          switch (w) {
            case 21010:
              w = 1200;
              break;
            case 32768:
              w = 1e4;
              break;
            case 32769:
              w = 1252;
              break;
          }
          Gr(W.codepage = w), Ce = !0;
          break;
        case 317:
          W.rrtabid = N;
          break;
        case 25:
          W.winlocked = N;
          break;
        case 439:
          r.opts.RefreshAll = N;
          break;
        case 12:
          r.opts.CalcCount = N;
          break;
        case 16:
          r.opts.CalcDelta = N;
          break;
        case 17:
          r.opts.CalcIter = N;
          break;
        case 13:
          r.opts.CalcMode = N;
          break;
        case 14:
          r.opts.CalcPrecision = N;
          break;
        case 95:
          r.opts.CalcSaveRecalc = N;
          break;
        case 15:
          W.CalcRefMode = N;
          break;
        // TODO: implement R1C1
        case 2211:
          r.opts.FullCalc = N;
          break;
        case 129:
          N.fDialog && (a["!type"] = "dialog"), N.fBelow || ((a["!outline"] || (a["!outline"] = {})).above = !0), N.fRight || ((a["!outline"] || (a["!outline"] = {})).left = !0);
          break;
        // TODO
        case 67:
        /* BIFF2XF */
        case 579:
        /* BIFF3XF */
        case 1091:
        /* BIFF4XF */
        case 224:
          A.push(N);
          break;
        case 430:
          q.push([N]), q[q.length - 1].XTI = [];
          break;
        case 35:
        case 547:
          q[q.length - 1].push(N);
          break;
        case 24:
        case 536:
          Te = {
            Name: N.Name,
            Ref: vr(N.rgce, f, null, q, W)
          }, N.itab > 0 && (Te.Sheet = N.itab - 1), q.names.push(Te), q[0] || (q[0] = [], q[0].XTI = []), q[q.length - 1].push(N), N.Name == "_xlnm._FilterDatabase" && N.itab > 0 && N.rgce && N.rgce[0] && N.rgce[0][0] && N.rgce[0][0][0] == "PtgArea3d" && (de[N.itab - 1] = { ref: Le(N.rgce[0][0][1][2]) });
          break;
        case 22:
          W.ExternCount = N;
          break;
        case 23:
          q.length == 0 && (q[0] = [], q[0].XTI = []), q[q.length - 1].XTI = q[q.length - 1].XTI.concat(N), q.XTI = q.XTI.concat(N);
          break;
        case 2196:
          if (W.biff < 8) break;
          Te != null && (Te.Comment = N[1]);
          break;
        case 18:
          a["!protect"] = N;
          break;
        /* for sheet or book */
        case 19:
          N !== 0 && W.WTF && console.error("Password verifier: " + N);
          break;
        case 133:
          i[W.biff == 4 ? W.snames.length : N.pos] = N, W.snames.push(N.name);
          break;
        case 10:
          {
            if (--Y ? !F : F) break;
            if (f.e) {
              if (f.e.r > 0 && f.e.c > 0) {
                if (f.e.r--, f.e.c--, a["!ref"] = Le(f), t.sheetRows && t.sheetRows <= f.e.r) {
                  var Q = f.e.r;
                  f.e.r = t.sheetRows - 1, a["!fullref"] = a["!ref"], a["!ref"] = Le(f), f.e.r = Q;
                }
                f.e.r++, f.e.c++;
              }
              j.length > 0 && (a["!merges"] = j), me.length > 0 && (a["!objects"] = me), Z.length > 0 && (a["!cols"] = Z), xe.length > 0 && (a["!rows"] = xe), S.Sheets.push(R);
            }
            o === "" ? u = a : n[o] = a, a = {}, t.dense && (a["!data"] = []);
          }
          break;
        case 9:
        case 521:
        case 1033:
        case 2057:
          {
            if (W.biff === 8 && (W.biff = {
              9: 2,
              521: 3,
              1033: 4
            }[K] || {
              512: 2,
              768: 3,
              1024: 4,
              1280: 5,
              1536: 8,
              2: 2,
              7: 2
            }[N.BIFFVer] || 8), W.biffguess = N.BIFFVer == 0, N.BIFFVer == 0 && N.dt == 4096 && (W.biff = 5, Ce = !0, Gr(W.codepage = 28591)), W.biff == 4 && N.dt & 256 && (F = !0), W.biff == 8 && N.BIFFVer == 0 && N.dt == 16 && (W.biff = 2), Y++ && !F) break;
            if (a = {}, t.dense && (a["!data"] = []), W.biff < 8 && !Ce && (Ce = !0, Gr(W.codepage = t.codepage || 1252)), W.biff == 4 && F)
              o = (i[W.snames.indexOf(o) + 1] || { name: "" }).name;
            else if (W.biff < 5 || N.BIFFVer == 0 && N.dt == 4096) {
              o === "" && (o = "Sheet1"), f = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
              var V = { pos: e.l - X, name: o };
              i[V.pos] = V, W.snames.push(o);
            } else o = (i[O] || { name: "" }).name;
            N.dt == 32 && (a["!type"] = "chart"), N.dt == 64 && (a["!type"] = "macro"), j = [], me = [], W.arrayf = _ = [], Z = [], xe = [], fe = !1, R = { Hidden: (i[O] || { hs: 0 }).hs, name: o };
          }
          break;
        case 515:
        case 3:
        case 2:
          a["!type"] == "chart" && (t.dense ? (a["!data"][N.r] || [])[N.c] : a[He(N.c) + Ge(N.r)]) && ++N.c, g = { ixfe: N.ixfe, XF: A[N.ixfe] || {}, v: N.val, t: "n" }, pe > 0 && (g.z = g.XF && g.XF.numFmtId && ce[g.XF.numFmtId] || ce[g.ixfe >> 8 & 63]), Kr(g, t, r.opts.Date1904), y({ c: N.c, r: N.r }, g, t);
          break;
        case 5:
        case 517:
          g = { ixfe: N.ixfe, XF: A[N.ixfe], v: N.val, t: N.t }, pe > 0 && (g.z = g.XF && g.XF.numFmtId && ce[g.XF.numFmtId] || ce[g.ixfe >> 8 & 63]), Kr(g, t, r.opts.Date1904), y({ c: N.c, r: N.r }, g, t);
          break;
        case 638:
          g = { ixfe: N.ixfe, XF: A[N.ixfe], v: N.rknum, t: "n" }, pe > 0 && (g.z = g.XF && g.XF.numFmtId && ce[g.XF.numFmtId] || ce[g.ixfe >> 8 & 63]), Kr(g, t, r.opts.Date1904), y({ c: N.c, r: N.r }, g, t);
          break;
        case 189:
          for (var I = N.c; I <= N.C; ++I) {
            var C = N.rkrec[I - N.c][0];
            g = { ixfe: C, XF: A[C], v: N.rkrec[I - N.c][1], t: "n" }, pe > 0 && (g.z = g.XF && g.XF.numFmtId && ce[g.XF.numFmtId] || ce[g.ixfe >> 8 & 63]), Kr(g, t, r.opts.Date1904), y({ c: I, r: N.r }, g, t);
          }
          break;
        case 6:
        case 518:
        case 1030:
          {
            if (N.val == "String") {
              s = N;
              break;
            }
            if (g = Ma(N.val, N.cell.ixfe, N.tt), g.XF = A[g.ixfe], t.cellFormula) {
              var G = N.formula;
              if (G && G[0] && G[0][0] && G[0][0][0] == "PtgExp") {
                var oe = G[0][0][1][0], le = G[0][0][1][1], ee = We({ r: oe, c: le });
                h[ee] ? g.f = "" + vr(N.formula, f, N.cell, q, W) : g.F = ((t.dense ? (a["!data"][oe] || [])[le] : a[ee]) || {}).F;
              } else g.f = "" + vr(N.formula, f, N.cell, q, W);
            }
            pe > 0 && (g.z = g.XF && g.XF.numFmtId && ce[g.XF.numFmtId] || ce[g.ixfe >> 8 & 63]), Kr(g, t, r.opts.Date1904), y(N.cell, g, t), s = N;
          }
          break;
        case 7:
        case 519:
          if (s)
            s.val = N, g = Ma(N, s.cell.ixfe, "s"), g.XF = A[g.ixfe], t.cellFormula && (g.f = "" + vr(s.formula, f, s.cell, q, W)), pe > 0 && (g.z = g.XF && g.XF.numFmtId && ce[g.XF.numFmtId] || ce[g.ixfe >> 8 & 63]), Kr(g, t, r.opts.Date1904), y(s.cell, g, t), s = null;
          else throw new Error("String record expects Formula");
          break;
        case 33:
        case 545:
          {
            _.push(N);
            var se = We(N[0].s);
            if (l = t.dense ? (a["!data"][N[0].s.r] || [])[N[0].s.c] : a[se], t.cellFormula && l) {
              if (!s || !se || !l) break;
              l.f = "" + vr(N[1], f, N[0], q, W), l.F = Le(N[0]);
            }
          }
          break;
        case 1212:
          {
            if (!t.cellFormula) break;
            if (x) {
              if (!s) break;
              h[We(s.cell)] = N[0], l = t.dense ? (a["!data"][s.cell.r] || [])[s.cell.c] : a[We(s.cell)], (l || {}).f = "" + vr(N[0], f, m, q, W);
            }
          }
          break;
        case 253:
          g = Ma(c[N.isst].t, N.ixfe, "s"), c[N.isst].h && (g.h = c[N.isst].h), g.XF = A[g.ixfe], pe > 0 && (g.z = g.XF && g.XF.numFmtId && ce[g.XF.numFmtId] || ce[g.ixfe >> 8 & 63]), Kr(g, t, r.opts.Date1904), y({ c: N.c, r: N.r }, g, t);
          break;
        case 513:
          t.sheetStubs && (g = { ixfe: N.ixfe, XF: A[N.ixfe], t: "z" }, pe > 0 && (g.z = g.XF && g.XF.numFmtId && ce[g.XF.numFmtId] || ce[g.ixfe >> 8 & 63]), Kr(g, t, r.opts.Date1904), y({ c: N.c, r: N.r }, g, t));
          break;
        case 190:
          if (t.sheetStubs)
            for (var ve = N.c; ve <= N.C; ++ve) {
              var re = N.ixfe[ve - N.c];
              g = { ixfe: re, XF: A[re], t: "z" }, pe > 0 && (g.z = g.XF && g.XF.numFmtId && ce[g.XF.numFmtId] || ce[g.ixfe >> 8 & 63]), Kr(g, t, r.opts.Date1904), y({ c: ve, r: N.r }, g, t);
            }
          break;
        case 214:
        case 516:
        case 4:
          g = Ma(N.val, N.ixfe, "s"), g.XF = A[g.ixfe], pe > 0 && (g.z = g.XF && g.XF.numFmtId && ce[g.XF.numFmtId] || ce[g.ixfe >> 8 & 63]), Kr(g, t, r.opts.Date1904), y({ c: N.c, r: N.r }, g, t);
          break;
        case 0:
        case 512:
          Y === 1 && (f = N);
          break;
        case 252:
          c = N;
          break;
        case 1054:
          if (W.biff >= 3 && W.biff <= 4) {
            ce[pe++] = N[1];
            for (var Fe = 0; Fe < pe + 163 && be[Fe] != N[1]; ++Fe) ;
            Fe >= 163 && wt(N[1], pe + 163);
          } else wt(N[1], N[0]);
          break;
        case 30:
          {
            ce[pe++] = N;
            for (var Oe = 0; Oe < pe + 163 && be[Oe] != N; ++Oe) ;
            Oe >= 163 && wt(N, pe + 163);
          }
          break;
        case 229:
          j = j.concat(N);
          break;
        case 93:
          me[N.cmo[0]] = W.lastobj = N;
          break;
        case 438:
          W.lastobj.TxO = N;
          break;
        case 127:
          W.lastobj.ImData = N;
          break;
        case 440:
          for (d = N[0].s.r; d <= N[0].e.r; ++d)
            for (p = N[0].s.c; p <= N[0].e.c; ++p)
              l = t.dense ? (a["!data"][d] || [])[p] : a[We({ c: p, r: d })], l && (l.l = N[1]);
          break;
        case 2048:
          for (d = N[0].s.r; d <= N[0].e.r; ++d)
            for (p = N[0].s.c; p <= N[0].e.c; ++p)
              l = t.dense ? (a["!data"][d] || [])[p] : a[We({ c: p, r: d })], l && l.l && (l.l.Tooltip = N[1]);
          break;
        case 28:
          {
            if (l = t.dense ? (a["!data"][N[0].r] || [])[N[0].c] : a[We(N[0])], l || (t.dense ? (a["!data"][N[0].r] || (a["!data"][N[0].r] = []), l = a["!data"][N[0].r][N[0].c] = { t: "z" }) : l = a[We(N[0])] = { t: "z" }, f.e.r = Math.max(f.e.r, N[0].r), f.s.r = Math.min(f.s.r, N[0].r), f.e.c = Math.max(f.e.c, N[0].c), f.s.c = Math.min(f.s.c, N[0].c)), l.c || (l.c = []), W.biff <= 5 && W.biff >= 2) v = { a: "SheetJ5", t: N[1] };
            else {
              var Se = me[N[2]];
              v = { a: N[1], t: Se.TxO.t }, N[3] != null && !(N[3] & 2) && (l.c.hidden = !0);
            }
            l.c.push(v);
          }
          break;
        case 2173:
          eh(A[N.ixfe], N.ext);
          break;
        case 125:
          {
            if (!W.cellStyles) break;
            for (; N.e >= N.s; )
              Z[N.e--] = { width: N.w / 256, level: N.level || 0, hidden: !!(N.flags & 1) }, fe || (fe = !0, jn(N.w / 256)), Ht(Z[N.e + 1]);
          }
          break;
        case 520:
          {
            var je = {};
            N.level != null && (xe[N.r] = je, je.level = N.level), N.hidden && (xe[N.r] = je, je.hidden = !0), N.hpt && (xe[N.r] = je, je.hpt = N.hpt, je.hpx = da(N.hpt));
          }
          break;
        case 38:
        case 39:
        case 40:
        case 41:
          a["!margins"] || ia(a["!margins"] = {}), a["!margins"][{ 38: "left", 39: "right", 40: "top", 41: "bottom" }[K]] = N;
          break;
        case 161:
          a["!margins"] || ia(a["!margins"] = {}), a["!margins"].header = N.header, a["!margins"].footer = N.footer;
          break;
        case 574:
          N.RTL && (S.Views[0].RTL = !0);
          break;
        case 146:
          P = N;
          break;
        case 2198:
          k = N;
          break;
        case 140:
          E = N;
          break;
        case 442:
          o ? R.CodeName = N || R.name : S.WBProps.CodeName = N || "ThisWorkbook";
          break;
      }
    } else
      z || console.error("Missing Info for XLS Record 0x" + K.toString(16)), e.l += X;
  }
  return r.SheetNames = zr(i).sort(function(qe, ke) {
    return Number(qe) - Number(ke);
  }).map(function(qe) {
    return i[qe].name;
  }), t.bookSheets || (r.Sheets = n), !r.SheetNames.length && u["!ref"] ? (r.SheetNames.push("Sheet1"), r.Sheets && (r.Sheets.Sheet1 = u)) : r.Preamble = u, r.Sheets && de.forEach(function(qe, ke) {
    r.Sheets[r.SheetNames[ke]]["!autofilter"] = qe;
  }), r.Strings = c, r.SSF = nr(be), W.enc && (r.Encryption = W.enc), k && (r.Themes = k), r.Metadata = {}, E !== void 0 && (r.Metadata.Country = E), q.names.length > 0 && (S.Names = q.names), r.Workbook = S, r;
}
var Zi = {
  SI: "e0859ff2f94f6810ab9108002b27b3d9",
  DSI: "02d5cdd59c2e1b10939708002b2cf9ae",
  UDI: "05d5cdd59c2e1b10939708002b2cf9ae"
};
function Ix(e, t, r) {
  var n = Ue.find(e, "/!DocumentSummaryInformation");
  if (n && n.size > 0) try {
    var a = Di(n, Jc, Zi.DSI);
    for (var i in a) t[i] = a[i];
  } catch (o) {
    if (r.WTF) throw o;
  }
  var f = Ue.find(e, "/!SummaryInformation");
  if (f && f.size > 0) try {
    var s = Di(f, qc, Zi.SI);
    for (var c in s) t[c] == null && (t[c] = s[c]);
  } catch (o) {
    if (r.WTF) throw o;
  }
  t.HeadingPairs && t.TitlesOfParts && (J0(t.HeadingPairs, t.TitlesOfParts, t, r), delete t.HeadingPairs, delete t.TitlesOfParts);
}
function Rs(e, t) {
  t || (t = {}), Qn(t), l0(), t.codepage && Dn(t.codepage);
  var r, n;
  if (e.FullPaths) {
    if (Ue.find(e, "/encryption")) throw new Error("File is password-protected");
    r = Ue.find(e, "!CompObj"), n = Ue.find(e, "/Workbook") || Ue.find(e, "/Book");
  } else {
    switch (t.type) {
      case "base64":
        e = Ir(Rr(e));
        break;
      case "binary":
        e = Ir(e);
        break;
      case "buffer":
        break;
      case "array":
        Array.isArray(e) || (e = Array.prototype.slice.call(e));
        break;
    }
    ir(e, 0), n = { content: e };
  }
  var a, i;
  if (r && Fx(r), t.bookProps && !t.bookSheets) a = {};
  else {
    var f = Pe ? "buffer" : "array";
    if (n && n.content) a = bx(n.content, t);
    else if ((i = Ue.find(e, "PerfectOffice_MAIN")) && i.content) a = aa.to_workbook(i.content, (t.type = f, t));
    else if ((i = Ue.find(e, "NativeContent_MAIN")) && i.content) a = aa.to_workbook(i.content, (t.type = f, t));
    else throw (i = Ue.find(e, "MN0")) && i.content ? new Error("Unsupported Works 4 for Mac file") : new Error("Cannot find Workbook stream");
    t.bookVBA && e.FullPaths && Ue.find(e, "/_VBA_PROJECT_CUR/VBA/dir") && (a.vbaraw = _h(e));
  }
  var s = {};
  return e.FullPaths && Ix(
    /*::((*/
    e,
    s,
    t
  ), a.Props = a.Custprops = s, t.bookFiles && (a.cfb = e), a;
}
var Ja = {
  0: {
    /* n:"BrtRowHdr", */
    f: ud
  },
  1: {
    /* n:"BrtCellBlank", */
    f: pd
  },
  2: {
    /* n:"BrtCellRk", */
    f: yd
  },
  3: {
    /* n:"BrtCellError", */
    f: _d
  },
  4: {
    /* n:"BrtCellBool", */
    f: vd
  },
  5: {
    /* n:"BrtCellReal", */
    f: Td
  },
  6: {
    /* n:"BrtCellSt", */
    f: Sd
  },
  7: {
    /* n:"BrtCellIsst", */
    f: kd
  },
  8: {
    /* n:"BrtFmlaString", */
    f: Dd
  },
  9: {
    /* n:"BrtFmlaNum", */
    f: Od
  },
  10: {
    /* n:"BrtFmlaBool", */
    f: bd
  },
  11: {
    /* n:"BrtFmlaError", */
    f: Id
  },
  12: {
    /* n:"BrtShortBlank", */
    f: md
  },
  13: {
    /* n:"BrtShortRk", */
    f: Ad
  },
  14: {
    /* n:"BrtShortError", */
    f: wd
  },
  15: {
    /* n:"BrtShortBool", */
    f: gd
  },
  16: {
    /* n:"BrtShortReal", */
    f: Cs
  },
  17: {
    /* n:"BrtShortSt", */
    f: Cd
  },
  18: {
    /* n:"BrtShortIsst", */
    f: Ed
  },
  19: {
    /* n:"BrtSSTItem", */
    f: Vn
  },
  20: {
    /* n:"BrtPCDIMissing" */
  },
  21: {
    /* n:"BrtPCDINumber" */
  },
  22: {
    /* n:"BrtPCDIBoolean" */
  },
  23: {
    /* n:"BrtPCDIError" */
  },
  24: {
    /* n:"BrtPCDIString" */
  },
  25: {
    /* n:"BrtPCDIDatetime" */
  },
  26: {
    /* n:"BrtPCDIIndex" */
  },
  27: {
    /* n:"BrtPCDIAMissing" */
  },
  28: {
    /* n:"BrtPCDIANumber" */
  },
  29: {
    /* n:"BrtPCDIABoolean" */
  },
  30: {
    /* n:"BrtPCDIAError" */
  },
  31: {
    /* n:"BrtPCDIAString" */
  },
  32: {
    /* n:"BrtPCDIADatetime" */
  },
  33: {
    /* n:"BrtPCRRecord" */
  },
  34: {
    /* n:"BrtPCRRecordDt" */
  },
  35: {
    /* n:"BrtFRTBegin", */
    T: 1
  },
  36: {
    /* n:"BrtFRTEnd", */
    T: -1
  },
  37: {
    /* n:"BrtACBegin", */
    T: 1
  },
  38: {
    /* n:"BrtACEnd", */
    T: -1
  },
  39: {
    /* n:"BrtName", */
    f: ix
  },
  40: {
    /* n:"BrtIndexRowBlock" */
  },
  42: {
    /* n:"BrtIndexBlock" */
  },
  43: {
    /* n:"BrtFont", */
    f: Mu
  },
  44: {
    /* n:"BrtFmt", */
    f: Lu
  },
  45: {
    /* n:"BrtFill", */
    f: Uu
  },
  46: {
    /* n:"BrtBorder", */
    f: Wu
  },
  47: {
    /* n:"BrtXF", */
    f: zu
  },
  48: {
    /* n:"BrtStyle" */
  },
  49: {
    /* n:"BrtCellMeta", */
    f: Mc
  },
  50: {
    /* n:"BrtValueMeta" */
  },
  51: {
    /* n:"BrtMdb" */
    f: th
  },
  52: {
    /* n:"BrtBeginFmd", */
    T: 1
  },
  53: {
    /* n:"BrtEndFmd", */
    T: -1
  },
  54: {
    /* n:"BrtBeginMdx", */
    T: 1
  },
  55: {
    /* n:"BrtEndMdx", */
    T: -1
  },
  56: {
    /* n:"BrtBeginMdxTuple", */
    T: 1
  },
  57: {
    /* n:"BrtEndMdxTuple", */
    T: -1
  },
  58: {
    /* n:"BrtMdxMbrIstr" */
  },
  59: {
    /* n:"BrtStr" */
  },
  60: {
    /* n:"BrtColInfo", */
    f: os
  },
  62: {
    /* n:"BrtCellRString", */
    f: Fd
  },
  63: {
    /* n:"BrtCalcChainItem$", */
    f: fh
  },
  64: {
    /* n:"BrtDVal", */
    f: Wd
  },
  65: {
    /* n:"BrtSxvcellNum" */
  },
  66: {
    /* n:"BrtSxvcellStr" */
  },
  67: {
    /* n:"BrtSxvcellBool" */
  },
  68: {
    /* n:"BrtSxvcellErr" */
  },
  69: {
    /* n:"BrtSxvcellDate" */
  },
  70: {
    /* n:"BrtSxvcellNil" */
  },
  128: {
    /* n:"BrtFileVersion" */
  },
  129: {
    /* n:"BrtBeginSheet", */
    T: 1
  },
  130: {
    /* n:"BrtEndSheet", */
    T: -1
  },
  131: {
    /* n:"BrtBeginBook", */
    T: 1,
    f: kr,
    p: 0
  },
  132: {
    /* n:"BrtEndBook", */
    T: -1
  },
  133: {
    /* n:"BrtBeginWsViews", */
    T: 1
  },
  134: {
    /* n:"BrtEndWsViews", */
    T: -1
  },
  135: {
    /* n:"BrtBeginBookViews", */
    T: 1
  },
  136: {
    /* n:"BrtEndBookViews", */
    T: -1
  },
  137: {
    /* n:"BrtBeginWsView", */
    T: 1,
    f: zd
  },
  138: {
    /* n:"BrtEndWsView", */
    T: -1
  },
  139: {
    /* n:"BrtBeginCsViews", */
    T: 1
  },
  140: {
    /* n:"BrtEndCsViews", */
    T: -1
  },
  141: {
    /* n:"BrtBeginCsView", */
    T: 1
  },
  142: {
    /* n:"BrtEndCsView", */
    T: -1
  },
  143: {
    /* n:"BrtBeginBundleShs", */
    T: 1
  },
  144: {
    /* n:"BrtEndBundleShs", */
    T: -1
  },
  145: {
    /* n:"BrtBeginSheetData", */
    T: 1
  },
  146: {
    /* n:"BrtEndSheetData", */
    T: -1
  },
  147: {
    /* n:"BrtWsProp", */
    f: xd
  },
  148: {
    /* n:"BrtWsDim", */
    f: hd,
    p: 16
  },
  151: {
    /* n:"BrtPane", */
    f: Pd
  },
  152: {
    /* n:"BrtSel" */
  },
  153: {
    /* n:"BrtWbProp", */
    f: ax
  },
  154: {
    /* n:"BrtWbFactoid" */
  },
  155: {
    /* n:"BrtFileRecover" */
  },
  156: {
    /* n:"BrtBundleSh", */
    f: tx
  },
  157: {
    /* n:"BrtCalcProp" */
  },
  158: {
    /* n:"BrtBookView" */
  },
  159: {
    /* n:"BrtBeginSst", */
    T: 1,
    f: tu
  },
  160: {
    /* n:"BrtEndSst", */
    T: -1
  },
  161: {
    /* n:"BrtBeginAFilter", */
    T: 1,
    f: Dt
  },
  162: {
    /* n:"BrtEndAFilter", */
    T: -1
  },
  163: {
    /* n:"BrtBeginFilterColumn", */
    T: 1
  },
  164: {
    /* n:"BrtEndFilterColumn", */
    T: -1
  },
  165: {
    /* n:"BrtBeginFilters", */
    T: 1
  },
  166: {
    /* n:"BrtEndFilters", */
    T: -1
  },
  167: {
    /* n:"BrtFilter" */
  },
  168: {
    /* n:"BrtColorFilter" */
  },
  169: {
    /* n:"BrtIconFilter" */
  },
  170: {
    /* n:"BrtTop10Filter" */
  },
  171: {
    /* n:"BrtDynamicFilter" */
  },
  172: {
    /* n:"BrtBeginCustomFilters", */
    T: 1
  },
  173: {
    /* n:"BrtEndCustomFilters", */
    T: -1
  },
  174: {
    /* n:"BrtCustomFilter" */
  },
  175: {
    /* n:"BrtAFilterDateGroupItem" */
  },
  176: {
    /* n:"BrtMergeCell", */
    f: Rd
  },
  177: {
    /* n:"BrtBeginMergeCells", */
    T: 1
  },
  178: {
    /* n:"BrtEndMergeCells", */
    T: -1
  },
  179: {
    /* n:"BrtBeginPivotCacheDef", */
    T: 1
  },
  180: {
    /* n:"BrtEndPivotCacheDef", */
    T: -1
  },
  181: {
    /* n:"BrtBeginPCDFields", */
    T: 1
  },
  182: {
    /* n:"BrtEndPCDFields", */
    T: -1
  },
  183: {
    /* n:"BrtBeginPCDField", */
    T: 1
  },
  184: {
    /* n:"BrtEndPCDField", */
    T: -1
  },
  185: {
    /* n:"BrtBeginPCDSource", */
    T: 1
  },
  186: {
    /* n:"BrtEndPCDSource", */
    T: -1
  },
  187: {
    /* n:"BrtBeginPCDSRange", */
    T: 1
  },
  188: {
    /* n:"BrtEndPCDSRange", */
    T: -1
  },
  189: {
    /* n:"BrtBeginPCDFAtbl", */
    T: 1
  },
  190: {
    /* n:"BrtEndPCDFAtbl", */
    T: -1
  },
  191: {
    /* n:"BrtBeginPCDIRun", */
    T: 1
  },
  192: {
    /* n:"BrtEndPCDIRun", */
    T: -1
  },
  193: {
    /* n:"BrtBeginPivotCacheRecords", */
    T: 1
  },
  194: {
    /* n:"BrtEndPivotCacheRecords", */
    T: -1
  },
  195: {
    /* n:"BrtBeginPCDHierarchies", */
    T: 1
  },
  196: {
    /* n:"BrtEndPCDHierarchies", */
    T: -1
  },
  197: {
    /* n:"BrtBeginPCDHierarchy", */
    T: 1
  },
  198: {
    /* n:"BrtEndPCDHierarchy", */
    T: -1
  },
  199: {
    /* n:"BrtBeginPCDHFieldsUsage", */
    T: 1
  },
  200: {
    /* n:"BrtEndPCDHFieldsUsage", */
    T: -1
  },
  201: {
    /* n:"BrtBeginExtConnection", */
    T: 1
  },
  202: {
    /* n:"BrtEndExtConnection", */
    T: -1
  },
  203: {
    /* n:"BrtBeginECDbProps", */
    T: 1
  },
  204: {
    /* n:"BrtEndECDbProps", */
    T: -1
  },
  205: {
    /* n:"BrtBeginECOlapProps", */
    T: 1
  },
  206: {
    /* n:"BrtEndECOlapProps", */
    T: -1
  },
  207: {
    /* n:"BrtBeginPCDSConsol", */
    T: 1
  },
  208: {
    /* n:"BrtEndPCDSConsol", */
    T: -1
  },
  209: {
    /* n:"BrtBeginPCDSCPages", */
    T: 1
  },
  210: {
    /* n:"BrtEndPCDSCPages", */
    T: -1
  },
  211: {
    /* n:"BrtBeginPCDSCPage", */
    T: 1
  },
  212: {
    /* n:"BrtEndPCDSCPage", */
    T: -1
  },
  213: {
    /* n:"BrtBeginPCDSCPItem", */
    T: 1
  },
  214: {
    /* n:"BrtEndPCDSCPItem", */
    T: -1
  },
  215: {
    /* n:"BrtBeginPCDSCSets", */
    T: 1
  },
  216: {
    /* n:"BrtEndPCDSCSets", */
    T: -1
  },
  217: {
    /* n:"BrtBeginPCDSCSet", */
    T: 1
  },
  218: {
    /* n:"BrtEndPCDSCSet", */
    T: -1
  },
  219: {
    /* n:"BrtBeginPCDFGroup", */
    T: 1
  },
  220: {
    /* n:"BrtEndPCDFGroup", */
    T: -1
  },
  221: {
    /* n:"BrtBeginPCDFGItems", */
    T: 1
  },
  222: {
    /* n:"BrtEndPCDFGItems", */
    T: -1
  },
  223: {
    /* n:"BrtBeginPCDFGRange", */
    T: 1
  },
  224: {
    /* n:"BrtEndPCDFGRange", */
    T: -1
  },
  225: {
    /* n:"BrtBeginPCDFGDiscrete", */
    T: 1
  },
  226: {
    /* n:"BrtEndPCDFGDiscrete", */
    T: -1
  },
  227: {
    /* n:"BrtBeginPCDSDTupleCache", */
    T: 1
  },
  228: {
    /* n:"BrtEndPCDSDTupleCache", */
    T: -1
  },
  229: {
    /* n:"BrtBeginPCDSDTCEntries", */
    T: 1
  },
  230: {
    /* n:"BrtEndPCDSDTCEntries", */
    T: -1
  },
  231: {
    /* n:"BrtBeginPCDSDTCEMembers", */
    T: 1
  },
  232: {
    /* n:"BrtEndPCDSDTCEMembers", */
    T: -1
  },
  233: {
    /* n:"BrtBeginPCDSDTCEMember", */
    T: 1
  },
  234: {
    /* n:"BrtEndPCDSDTCEMember", */
    T: -1
  },
  235: {
    /* n:"BrtBeginPCDSDTCQueries", */
    T: 1
  },
  236: {
    /* n:"BrtEndPCDSDTCQueries", */
    T: -1
  },
  237: {
    /* n:"BrtBeginPCDSDTCQuery", */
    T: 1
  },
  238: {
    /* n:"BrtEndPCDSDTCQuery", */
    T: -1
  },
  239: {
    /* n:"BrtBeginPCDSDTCSets", */
    T: 1
  },
  240: {
    /* n:"BrtEndPCDSDTCSets", */
    T: -1
  },
  241: {
    /* n:"BrtBeginPCDSDTCSet", */
    T: 1
  },
  242: {
    /* n:"BrtEndPCDSDTCSet", */
    T: -1
  },
  243: {
    /* n:"BrtBeginPCDCalcItems", */
    T: 1
  },
  244: {
    /* n:"BrtEndPCDCalcItems", */
    T: -1
  },
  245: {
    /* n:"BrtBeginPCDCalcItem", */
    T: 1
  },
  246: {
    /* n:"BrtEndPCDCalcItem", */
    T: -1
  },
  247: {
    /* n:"BrtBeginPRule", */
    T: 1
  },
  248: {
    /* n:"BrtEndPRule", */
    T: -1
  },
  249: {
    /* n:"BrtBeginPRFilters", */
    T: 1
  },
  250: {
    /* n:"BrtEndPRFilters", */
    T: -1
  },
  251: {
    /* n:"BrtBeginPRFilter", */
    T: 1
  },
  252: {
    /* n:"BrtEndPRFilter", */
    T: -1
  },
  253: {
    /* n:"BrtBeginPNames", */
    T: 1
  },
  254: {
    /* n:"BrtEndPNames", */
    T: -1
  },
  255: {
    /* n:"BrtBeginPName", */
    T: 1
  },
  256: {
    /* n:"BrtEndPName", */
    T: -1
  },
  257: {
    /* n:"BrtBeginPNPairs", */
    T: 1
  },
  258: {
    /* n:"BrtEndPNPairs", */
    T: -1
  },
  259: {
    /* n:"BrtBeginPNPair", */
    T: 1
  },
  260: {
    /* n:"BrtEndPNPair", */
    T: -1
  },
  261: {
    /* n:"BrtBeginECWebProps", */
    T: 1
  },
  262: {
    /* n:"BrtEndECWebProps", */
    T: -1
  },
  263: {
    /* n:"BrtBeginEcWpTables", */
    T: 1
  },
  264: {
    /* n:"BrtEndECWPTables", */
    T: -1
  },
  265: {
    /* n:"BrtBeginECParams", */
    T: 1
  },
  266: {
    /* n:"BrtEndECParams", */
    T: -1
  },
  267: {
    /* n:"BrtBeginECParam", */
    T: 1
  },
  268: {
    /* n:"BrtEndECParam", */
    T: -1
  },
  269: {
    /* n:"BrtBeginPCDKPIs", */
    T: 1
  },
  270: {
    /* n:"BrtEndPCDKPIs", */
    T: -1
  },
  271: {
    /* n:"BrtBeginPCDKPI", */
    T: 1
  },
  272: {
    /* n:"BrtEndPCDKPI", */
    T: -1
  },
  273: {
    /* n:"BrtBeginDims", */
    T: 1
  },
  274: {
    /* n:"BrtEndDims", */
    T: -1
  },
  275: {
    /* n:"BrtBeginDim", */
    T: 1
  },
  276: {
    /* n:"BrtEndDim", */
    T: -1
  },
  277: {
    /* n:"BrtIndexPartEnd" */
  },
  278: {
    /* n:"BrtBeginStyleSheet", */
    T: 1
  },
  279: {
    /* n:"BrtEndStyleSheet", */
    T: -1
  },
  280: {
    /* n:"BrtBeginSXView", */
    T: 1
  },
  281: {
    /* n:"BrtEndSXVI", */
    T: -1
  },
  282: {
    /* n:"BrtBeginSXVI", */
    T: 1
  },
  283: {
    /* n:"BrtBeginSXVIs", */
    T: 1
  },
  284: {
    /* n:"BrtEndSXVIs", */
    T: -1
  },
  285: {
    /* n:"BrtBeginSXVD", */
    T: 1
  },
  286: {
    /* n:"BrtEndSXVD", */
    T: -1
  },
  287: {
    /* n:"BrtBeginSXVDs", */
    T: 1
  },
  288: {
    /* n:"BrtEndSXVDs", */
    T: -1
  },
  289: {
    /* n:"BrtBeginSXPI", */
    T: 1
  },
  290: {
    /* n:"BrtEndSXPI", */
    T: -1
  },
  291: {
    /* n:"BrtBeginSXPIs", */
    T: 1
  },
  292: {
    /* n:"BrtEndSXPIs", */
    T: -1
  },
  293: {
    /* n:"BrtBeginSXDI", */
    T: 1
  },
  294: {
    /* n:"BrtEndSXDI", */
    T: -1
  },
  295: {
    /* n:"BrtBeginSXDIs", */
    T: 1
  },
  296: {
    /* n:"BrtEndSXDIs", */
    T: -1
  },
  297: {
    /* n:"BrtBeginSXLI", */
    T: 1
  },
  298: {
    /* n:"BrtEndSXLI", */
    T: -1
  },
  299: {
    /* n:"BrtBeginSXLIRws", */
    T: 1
  },
  300: {
    /* n:"BrtEndSXLIRws", */
    T: -1
  },
  301: {
    /* n:"BrtBeginSXLICols", */
    T: 1
  },
  302: {
    /* n:"BrtEndSXLICols", */
    T: -1
  },
  303: {
    /* n:"BrtBeginSXFormat", */
    T: 1
  },
  304: {
    /* n:"BrtEndSXFormat", */
    T: -1
  },
  305: {
    /* n:"BrtBeginSXFormats", */
    T: 1
  },
  306: {
    /* n:"BrtEndSxFormats", */
    T: -1
  },
  307: {
    /* n:"BrtBeginSxSelect", */
    T: 1
  },
  308: {
    /* n:"BrtEndSxSelect", */
    T: -1
  },
  309: {
    /* n:"BrtBeginISXVDRws", */
    T: 1
  },
  310: {
    /* n:"BrtEndISXVDRws", */
    T: -1
  },
  311: {
    /* n:"BrtBeginISXVDCols", */
    T: 1
  },
  312: {
    /* n:"BrtEndISXVDCols", */
    T: -1
  },
  313: {
    /* n:"BrtEndSXLocation", */
    T: -1
  },
  314: {
    /* n:"BrtBeginSXLocation", */
    T: 1
  },
  315: {
    /* n:"BrtEndSXView", */
    T: -1
  },
  316: {
    /* n:"BrtBeginSXTHs", */
    T: 1
  },
  317: {
    /* n:"BrtEndSXTHs", */
    T: -1
  },
  318: {
    /* n:"BrtBeginSXTH", */
    T: 1
  },
  319: {
    /* n:"BrtEndSXTH", */
    T: -1
  },
  320: {
    /* n:"BrtBeginISXTHRws", */
    T: 1
  },
  321: {
    /* n:"BrtEndISXTHRws", */
    T: -1
  },
  322: {
    /* n:"BrtBeginISXTHCols", */
    T: 1
  },
  323: {
    /* n:"BrtEndISXTHCols", */
    T: -1
  },
  324: {
    /* n:"BrtBeginSXTDMPS", */
    T: 1
  },
  325: {
    /* n:"BrtEndSXTDMPs", */
    T: -1
  },
  326: {
    /* n:"BrtBeginSXTDMP", */
    T: 1
  },
  327: {
    /* n:"BrtEndSXTDMP", */
    T: -1
  },
  328: {
    /* n:"BrtBeginSXTHItems", */
    T: 1
  },
  329: {
    /* n:"BrtEndSXTHItems", */
    T: -1
  },
  330: {
    /* n:"BrtBeginSXTHItem", */
    T: 1
  },
  331: {
    /* n:"BrtEndSXTHItem", */
    T: -1
  },
  332: {
    /* n:"BrtBeginMetadata", */
    T: 1
  },
  333: {
    /* n:"BrtEndMetadata", */
    T: -1
  },
  334: {
    /* n:"BrtBeginEsmdtinfo", */
    T: 1
  },
  335: {
    /* n:"BrtMdtinfo", */
    f: rh
  },
  336: {
    /* n:"BrtEndEsmdtinfo", */
    T: -1
  },
  337: {
    /* n:"BrtBeginEsmdb", */
    f: ah,
    T: 1
  },
  338: {
    /* n:"BrtEndEsmdb", */
    T: -1
  },
  339: {
    /* n:"BrtBeginEsfmd", */
    T: 1
  },
  340: {
    /* n:"BrtEndEsfmd", */
    T: -1
  },
  341: {
    /* n:"BrtBeginSingleCells", */
    T: 1
  },
  342: {
    /* n:"BrtEndSingleCells", */
    T: -1
  },
  343: {
    /* n:"BrtBeginList", */
    T: 1
  },
  344: {
    /* n:"BrtEndList", */
    T: -1
  },
  345: {
    /* n:"BrtBeginListCols", */
    T: 1
  },
  346: {
    /* n:"BrtEndListCols", */
    T: -1
  },
  347: {
    /* n:"BrtBeginListCol", */
    T: 1
  },
  348: {
    /* n:"BrtEndListCol", */
    T: -1
  },
  349: {
    /* n:"BrtBeginListXmlCPr", */
    T: 1
  },
  350: {
    /* n:"BrtEndListXmlCPr", */
    T: -1
  },
  351: {
    /* n:"BrtListCCFmla" */
  },
  352: {
    /* n:"BrtListTrFmla" */
  },
  353: {
    /* n:"BrtBeginExternals", */
    T: 1
  },
  354: {
    /* n:"BrtEndExternals", */
    T: -1
  },
  355: {
    /* n:"BrtSupBookSrc", */
    f: yn
  },
  357: {
    /* n:"BrtSupSelf" */
  },
  358: {
    /* n:"BrtSupSame" */
  },
  359: {
    /* n:"BrtSupTabs" */
  },
  360: {
    /* n:"BrtBeginSupBook", */
    T: 1
  },
  361: {
    /* n:"BrtPlaceholderName" */
  },
  362: {
    /* n:"BrtExternSheet", */
    f: cs
  },
  363: {
    /* n:"BrtExternTableStart" */
  },
  364: {
    /* n:"BrtExternTableEnd" */
  },
  366: {
    /* n:"BrtExternRowHdr" */
  },
  367: {
    /* n:"BrtExternCellBlank" */
  },
  368: {
    /* n:"BrtExternCellReal" */
  },
  369: {
    /* n:"BrtExternCellBool" */
  },
  370: {
    /* n:"BrtExternCellError" */
  },
  371: {
    /* n:"BrtExternCellString" */
  },
  372: {
    /* n:"BrtBeginEsmdx", */
    T: 1
  },
  373: {
    /* n:"BrtEndEsmdx", */
    T: -1
  },
  374: {
    /* n:"BrtBeginMdxSet", */
    T: 1
  },
  375: {
    /* n:"BrtEndMdxSet", */
    T: -1
  },
  376: {
    /* n:"BrtBeginMdxMbrProp", */
    T: 1
  },
  377: {
    /* n:"BrtEndMdxMbrProp", */
    T: -1
  },
  378: {
    /* n:"BrtBeginMdxKPI", */
    T: 1
  },
  379: {
    /* n:"BrtEndMdxKPI", */
    T: -1
  },
  380: {
    /* n:"BrtBeginEsstr", */
    T: 1
  },
  381: {
    /* n:"BrtEndEsstr", */
    T: -1
  },
  382: {
    /* n:"BrtBeginPRFItem", */
    T: 1
  },
  383: {
    /* n:"BrtEndPRFItem", */
    T: -1
  },
  384: {
    /* n:"BrtBeginPivotCacheIDs", */
    T: 1
  },
  385: {
    /* n:"BrtEndPivotCacheIDs", */
    T: -1
  },
  386: {
    /* n:"BrtBeginPivotCacheID", */
    T: 1
  },
  387: {
    /* n:"BrtEndPivotCacheID", */
    T: -1
  },
  388: {
    /* n:"BrtBeginISXVIs", */
    T: 1
  },
  389: {
    /* n:"BrtEndISXVIs", */
    T: -1
  },
  390: {
    /* n:"BrtBeginColInfos", */
    T: 1
  },
  391: {
    /* n:"BrtEndColInfos", */
    T: -1
  },
  392: {
    /* n:"BrtBeginRwBrk", */
    T: 1
  },
  393: {
    /* n:"BrtEndRwBrk", */
    T: -1
  },
  394: {
    /* n:"BrtBeginColBrk", */
    T: 1
  },
  395: {
    /* n:"BrtEndColBrk", */
    T: -1
  },
  396: {
    /* n:"BrtBrk" */
  },
  397: {
    /* n:"BrtUserBookView" */
  },
  398: {
    /* n:"BrtInfo" */
  },
  399: {
    /* n:"BrtCUsr" */
  },
  400: {
    /* n:"BrtUsr" */
  },
  401: {
    /* n:"BrtBeginUsers", */
    T: 1
  },
  403: {
    /* n:"BrtEOF" */
  },
  404: {
    /* n:"BrtUCR" */
  },
  405: {
    /* n:"BrtRRInsDel" */
  },
  406: {
    /* n:"BrtRREndInsDel" */
  },
  407: {
    /* n:"BrtRRMove" */
  },
  408: {
    /* n:"BrtRREndMove" */
  },
  409: {
    /* n:"BrtRRChgCell" */
  },
  410: {
    /* n:"BrtRREndChgCell" */
  },
  411: {
    /* n:"BrtRRHeader" */
  },
  412: {
    /* n:"BrtRRUserView" */
  },
  413: {
    /* n:"BrtRRRenSheet" */
  },
  414: {
    /* n:"BrtRRInsertSh" */
  },
  415: {
    /* n:"BrtRRDefName" */
  },
  416: {
    /* n:"BrtRRNote" */
  },
  417: {
    /* n:"BrtRRConflict" */
  },
  418: {
    /* n:"BrtRRTQSIF" */
  },
  419: {
    /* n:"BrtRRFormat" */
  },
  420: {
    /* n:"BrtRREndFormat" */
  },
  421: {
    /* n:"BrtRRAutoFmt" */
  },
  422: {
    /* n:"BrtBeginUserShViews", */
    T: 1
  },
  423: {
    /* n:"BrtBeginUserShView", */
    T: 1
  },
  424: {
    /* n:"BrtEndUserShView", */
    T: -1
  },
  425: {
    /* n:"BrtEndUserShViews", */
    T: -1
  },
  426: {
    /* n:"BrtArrFmla", */
    f: Bd
  },
  427: {
    /* n:"BrtShrFmla", */
    f: Ld
  },
  428: {
    /* n:"BrtTable" */
  },
  429: {
    /* n:"BrtBeginExtConnections", */
    T: 1
  },
  430: {
    /* n:"BrtEndExtConnections", */
    T: -1
  },
  431: {
    /* n:"BrtBeginPCDCalcMems", */
    T: 1
  },
  432: {
    /* n:"BrtEndPCDCalcMems", */
    T: -1
  },
  433: {
    /* n:"BrtBeginPCDCalcMem", */
    T: 1
  },
  434: {
    /* n:"BrtEndPCDCalcMem", */
    T: -1
  },
  435: {
    /* n:"BrtBeginPCDHGLevels", */
    T: 1
  },
  436: {
    /* n:"BrtEndPCDHGLevels", */
    T: -1
  },
  437: {
    /* n:"BrtBeginPCDHGLevel", */
    T: 1
  },
  438: {
    /* n:"BrtEndPCDHGLevel", */
    T: -1
  },
  439: {
    /* n:"BrtBeginPCDHGLGroups", */
    T: 1
  },
  440: {
    /* n:"BrtEndPCDHGLGroups", */
    T: -1
  },
  441: {
    /* n:"BrtBeginPCDHGLGroup", */
    T: 1
  },
  442: {
    /* n:"BrtEndPCDHGLGroup", */
    T: -1
  },
  443: {
    /* n:"BrtBeginPCDHGLGMembers", */
    T: 1
  },
  444: {
    /* n:"BrtEndPCDHGLGMembers", */
    T: -1
  },
  445: {
    /* n:"BrtBeginPCDHGLGMember", */
    T: 1
  },
  446: {
    /* n:"BrtEndPCDHGLGMember", */
    T: -1
  },
  447: {
    /* n:"BrtBeginQSI", */
    T: 1
  },
  448: {
    /* n:"BrtEndQSI", */
    T: -1
  },
  449: {
    /* n:"BrtBeginQSIR", */
    T: 1
  },
  450: {
    /* n:"BrtEndQSIR", */
    T: -1
  },
  451: {
    /* n:"BrtBeginDeletedNames", */
    T: 1
  },
  452: {
    /* n:"BrtEndDeletedNames", */
    T: -1
  },
  453: {
    /* n:"BrtBeginDeletedName", */
    T: 1
  },
  454: {
    /* n:"BrtEndDeletedName", */
    T: -1
  },
  455: {
    /* n:"BrtBeginQSIFs", */
    T: 1
  },
  456: {
    /* n:"BrtEndQSIFs", */
    T: -1
  },
  457: {
    /* n:"BrtBeginQSIF", */
    T: 1
  },
  458: {
    /* n:"BrtEndQSIF", */
    T: -1
  },
  459: {
    /* n:"BrtBeginAutoSortScope", */
    T: 1
  },
  460: {
    /* n:"BrtEndAutoSortScope", */
    T: -1
  },
  461: {
    /* n:"BrtBeginConditionalFormatting", */
    T: 1
  },
  462: {
    /* n:"BrtEndConditionalFormatting", */
    T: -1
  },
  463: {
    /* n:"BrtBeginCFRule", */
    T: 1
  },
  464: {
    /* n:"BrtEndCFRule", */
    T: -1
  },
  465: {
    /* n:"BrtBeginIconSet", */
    T: 1
  },
  466: {
    /* n:"BrtEndIconSet", */
    T: -1
  },
  467: {
    /* n:"BrtBeginDatabar", */
    T: 1
  },
  468: {
    /* n:"BrtEndDatabar", */
    T: -1
  },
  469: {
    /* n:"BrtBeginColorScale", */
    T: 1
  },
  470: {
    /* n:"BrtEndColorScale", */
    T: -1
  },
  471: {
    /* n:"BrtCFVO" */
  },
  472: {
    /* n:"BrtExternValueMeta" */
  },
  473: {
    /* n:"BrtBeginColorPalette", */
    T: 1
  },
  474: {
    /* n:"BrtEndColorPalette", */
    T: -1
  },
  475: {
    /* n:"BrtIndexedColor" */
  },
  476: {
    /* n:"BrtMargins", */
    f: Ud
  },
  477: {
    /* n:"BrtPrintOptions" */
  },
  478: {
    /* n:"BrtPageSetup" */
  },
  479: {
    /* n:"BrtBeginHeaderFooter", */
    T: 1
  },
  480: {
    /* n:"BrtEndHeaderFooter", */
    T: -1
  },
  481: {
    /* n:"BrtBeginSXCrtFormat", */
    T: 1
  },
  482: {
    /* n:"BrtEndSXCrtFormat", */
    T: -1
  },
  483: {
    /* n:"BrtBeginSXCrtFormats", */
    T: 1
  },
  484: {
    /* n:"BrtEndSXCrtFormats", */
    T: -1
  },
  485: {
    /* n:"BrtWsFmtInfo", */
    f: dd
  },
  486: {
    /* n:"BrtBeginMgs", */
    T: 1
  },
  487: {
    /* n:"BrtEndMGs", */
    T: -1
  },
  488: {
    /* n:"BrtBeginMGMaps", */
    T: 1
  },
  489: {
    /* n:"BrtEndMGMaps", */
    T: -1
  },
  490: {
    /* n:"BrtBeginMG", */
    T: 1
  },
  491: {
    /* n:"BrtEndMG", */
    T: -1
  },
  492: {
    /* n:"BrtBeginMap", */
    T: 1
  },
  493: {
    /* n:"BrtEndMap", */
    T: -1
  },
  494: {
    /* n:"BrtHLink", */
    f: Nd
  },
  495: {
    /* n:"BrtBeginDCon", */
    T: 1
  },
  496: {
    /* n:"BrtEndDCon", */
    T: -1
  },
  497: {
    /* n:"BrtBeginDRefs", */
    T: 1
  },
  498: {
    /* n:"BrtEndDRefs", */
    T: -1
  },
  499: {
    /* n:"BrtDRef" */
  },
  500: {
    /* n:"BrtBeginScenMan", */
    T: 1
  },
  501: {
    /* n:"BrtEndScenMan", */
    T: -1
  },
  502: {
    /* n:"BrtBeginSct", */
    T: 1
  },
  503: {
    /* n:"BrtEndSct", */
    T: -1
  },
  504: {
    /* n:"BrtSlc" */
  },
  505: {
    /* n:"BrtBeginDXFs", */
    T: 1
  },
  506: {
    /* n:"BrtEndDXFs", */
    T: -1
  },
  507: {
    /* n:"BrtDXF" */
  },
  508: {
    /* n:"BrtBeginTableStyles", */
    T: 1
  },
  509: {
    /* n:"BrtEndTableStyles", */
    T: -1
  },
  510: {
    /* n:"BrtBeginTableStyle", */
    T: 1
  },
  511: {
    /* n:"BrtEndTableStyle", */
    T: -1
  },
  512: {
    /* n:"BrtTableStyleElement" */
  },
  513: {
    /* n:"BrtTableStyleClient" */
  },
  514: {
    /* n:"BrtBeginVolDeps", */
    T: 1
  },
  515: {
    /* n:"BrtEndVolDeps", */
    T: -1
  },
  516: {
    /* n:"BrtBeginVolType", */
    T: 1
  },
  517: {
    /* n:"BrtEndVolType", */
    T: -1
  },
  518: {
    /* n:"BrtBeginVolMain", */
    T: 1
  },
  519: {
    /* n:"BrtEndVolMain", */
    T: -1
  },
  520: {
    /* n:"BrtBeginVolTopic", */
    T: 1
  },
  521: {
    /* n:"BrtEndVolTopic", */
    T: -1
  },
  522: {
    /* n:"BrtVolSubtopic" */
  },
  523: {
    /* n:"BrtVolRef" */
  },
  524: {
    /* n:"BrtVolNum" */
  },
  525: {
    /* n:"BrtVolErr" */
  },
  526: {
    /* n:"BrtVolStr" */
  },
  527: {
    /* n:"BrtVolBool" */
  },
  528: {
    /* n:"BrtBeginCalcChain$", */
    T: 1
  },
  529: {
    /* n:"BrtEndCalcChain$", */
    T: -1
  },
  530: {
    /* n:"BrtBeginSortState", */
    T: 1
  },
  531: {
    /* n:"BrtEndSortState", */
    T: -1
  },
  532: {
    /* n:"BrtBeginSortCond", */
    T: 1
  },
  533: {
    /* n:"BrtEndSortCond", */
    T: -1
  },
  534: {
    /* n:"BrtBookProtection" */
  },
  535: {
    /* n:"BrtSheetProtection" */
  },
  536: {
    /* n:"BrtRangeProtection" */
  },
  537: {
    /* n:"BrtPhoneticInfo" */
  },
  538: {
    /* n:"BrtBeginECTxtWiz", */
    T: 1
  },
  539: {
    /* n:"BrtEndECTxtWiz", */
    T: -1
  },
  540: {
    /* n:"BrtBeginECTWFldInfoLst", */
    T: 1
  },
  541: {
    /* n:"BrtEndECTWFldInfoLst", */
    T: -1
  },
  542: {
    /* n:"BrtBeginECTwFldInfo", */
    T: 1
  },
  548: {
    /* n:"BrtFileSharing" */
  },
  549: {
    /* n:"BrtOleSize" */
  },
  550: {
    /* n:"BrtDrawing", */
    f: yn
  },
  551: {
    /* n:"BrtLegacyDrawing", */
    f: tn
  },
  552: {
    /* n:"BrtLegacyDrawingHF" */
  },
  553: {
    /* n:"BrtWebOpt" */
  },
  554: {
    /* n:"BrtBeginWebPubItems", */
    T: 1
  },
  555: {
    /* n:"BrtEndWebPubItems", */
    T: -1
  },
  556: {
    /* n:"BrtBeginWebPubItem", */
    T: 1
  },
  557: {
    /* n:"BrtEndWebPubItem", */
    T: -1
  },
  558: {
    /* n:"BrtBeginSXCondFmt", */
    T: 1
  },
  559: {
    /* n:"BrtEndSXCondFmt", */
    T: -1
  },
  560: {
    /* n:"BrtBeginSXCondFmts", */
    T: 1
  },
  561: {
    /* n:"BrtEndSXCondFmts", */
    T: -1
  },
  562: {
    /* n:"BrtBkHim" */
  },
  564: {
    /* n:"BrtColor" */
  },
  565: {
    /* n:"BrtBeginIndexedColors", */
    T: 1
  },
  566: {
    /* n:"BrtEndIndexedColors", */
    T: -1
  },
  569: {
    /* n:"BrtBeginMRUColors", */
    T: 1
  },
  570: {
    /* n:"BrtEndMRUColors", */
    T: -1
  },
  572: {
    /* n:"BrtMRUColor" */
  },
  573: {
    /* n:"BrtBeginDVals", */
    T: 1
  },
  574: {
    /* n:"BrtEndDVals", */
    T: -1
  },
  577: {
    /* n:"BrtSupNameStart" */
  },
  578: {
    /* n:"BrtSupNameValueStart" */
  },
  579: {
    /* n:"BrtSupNameValueEnd" */
  },
  580: {
    /* n:"BrtSupNameNum" */
  },
  581: {
    /* n:"BrtSupNameErr" */
  },
  582: {
    /* n:"BrtSupNameSt" */
  },
  583: {
    /* n:"BrtSupNameNil" */
  },
  584: {
    /* n:"BrtSupNameBool" */
  },
  585: {
    /* n:"BrtSupNameFmla" */
  },
  586: {
    /* n:"BrtSupNameBits" */
  },
  587: {
    /* n:"BrtSupNameEnd" */
  },
  588: {
    /* n:"BrtEndSupBook", */
    T: -1
  },
  589: {
    /* n:"BrtCellSmartTagProperty" */
  },
  590: {
    /* n:"BrtBeginCellSmartTag", */
    T: 1
  },
  591: {
    /* n:"BrtEndCellSmartTag", */
    T: -1
  },
  592: {
    /* n:"BrtBeginCellSmartTags", */
    T: 1
  },
  593: {
    /* n:"BrtEndCellSmartTags", */
    T: -1
  },
  594: {
    /* n:"BrtBeginSmartTags", */
    T: 1
  },
  595: {
    /* n:"BrtEndSmartTags", */
    T: -1
  },
  596: {
    /* n:"BrtSmartTagType" */
  },
  597: {
    /* n:"BrtBeginSmartTagTypes", */
    T: 1
  },
  598: {
    /* n:"BrtEndSmartTagTypes", */
    T: -1
  },
  599: {
    /* n:"BrtBeginSXFilters", */
    T: 1
  },
  600: {
    /* n:"BrtEndSXFilters", */
    T: -1
  },
  601: {
    /* n:"BrtBeginSXFILTER", */
    T: 1
  },
  602: {
    /* n:"BrtEndSXFilter", */
    T: -1
  },
  603: {
    /* n:"BrtBeginFills", */
    T: 1
  },
  604: {
    /* n:"BrtEndFills", */
    T: -1
  },
  605: {
    /* n:"BrtBeginCellWatches", */
    T: 1
  },
  606: {
    /* n:"BrtEndCellWatches", */
    T: -1
  },
  607: {
    /* n:"BrtCellWatch" */
  },
  608: {
    /* n:"BrtBeginCRErrs", */
    T: 1
  },
  609: {
    /* n:"BrtEndCRErrs", */
    T: -1
  },
  610: {
    /* n:"BrtCrashRecErr" */
  },
  611: {
    /* n:"BrtBeginFonts", */
    T: 1
  },
  612: {
    /* n:"BrtEndFonts", */
    T: -1
  },
  613: {
    /* n:"BrtBeginBorders", */
    T: 1
  },
  614: {
    /* n:"BrtEndBorders", */
    T: -1
  },
  615: {
    /* n:"BrtBeginFmts", */
    T: 1
  },
  616: {
    /* n:"BrtEndFmts", */
    T: -1
  },
  617: {
    /* n:"BrtBeginCellXFs", */
    T: 1
  },
  618: {
    /* n:"BrtEndCellXFs", */
    T: -1
  },
  619: {
    /* n:"BrtBeginStyles", */
    T: 1
  },
  620: {
    /* n:"BrtEndStyles", */
    T: -1
  },
  625: {
    /* n:"BrtBigName" */
  },
  626: {
    /* n:"BrtBeginCellStyleXFs", */
    T: 1
  },
  627: {
    /* n:"BrtEndCellStyleXFs", */
    T: -1
  },
  628: {
    /* n:"BrtBeginComments", */
    T: 1
  },
  629: {
    /* n:"BrtEndComments", */
    T: -1
  },
  630: {
    /* n:"BrtBeginCommentAuthors", */
    T: 1
  },
  631: {
    /* n:"BrtEndCommentAuthors", */
    T: -1
  },
  632: {
    /* n:"BrtCommentAuthor", */
    f: mh
  },
  633: {
    /* n:"BrtBeginCommentList", */
    T: 1
  },
  634: {
    /* n:"BrtEndCommentList", */
    T: -1
  },
  635: {
    /* n:"BrtBeginComment", */
    T: 1,
    f: ph
  },
  636: {
    /* n:"BrtEndComment", */
    T: -1
  },
  637: {
    /* n:"BrtCommentText", */
    f: zc
  },
  638: {
    /* n:"BrtBeginOleObjects", */
    T: 1
  },
  639: {
    /* n:"BrtOleObject" */
  },
  640: {
    /* n:"BrtEndOleObjects", */
    T: -1
  },
  641: {
    /* n:"BrtBeginSxrules", */
    T: 1
  },
  642: {
    /* n:"BrtEndSxRules", */
    T: -1
  },
  643: {
    /* n:"BrtBeginActiveXControls", */
    T: 1
  },
  644: {
    /* n:"BrtActiveX" */
  },
  645: {
    /* n:"BrtEndActiveXControls", */
    T: -1
  },
  646: {
    /* n:"BrtBeginPCDSDTCEMembersSortBy", */
    T: 1
  },
  648: {
    /* n:"BrtBeginCellIgnoreECs", */
    T: 1
  },
  649: {
    /* n:"BrtCellIgnoreEC" */
  },
  650: {
    /* n:"BrtEndCellIgnoreECs", */
    T: -1
  },
  651: {
    /* n:"BrtCsProp", */
    f: jd
  },
  652: {
    /* n:"BrtCsPageSetup" */
  },
  653: {
    /* n:"BrtBeginUserCsViews", */
    T: 1
  },
  654: {
    /* n:"BrtEndUserCsViews", */
    T: -1
  },
  655: {
    /* n:"BrtBeginUserCsView", */
    T: 1
  },
  656: {
    /* n:"BrtEndUserCsView", */
    T: -1
  },
  657: {
    /* n:"BrtBeginPcdSFCIEntries", */
    T: 1
  },
  658: {
    /* n:"BrtEndPCDSFCIEntries", */
    T: -1
  },
  659: {
    /* n:"BrtPCDSFCIEntry" */
  },
  660: {
    /* n:"BrtBeginListParts", */
    T: 1
  },
  661: {
    /* n:"BrtListPart" */
  },
  662: {
    /* n:"BrtEndListParts", */
    T: -1
  },
  663: {
    /* n:"BrtSheetCalcProp" */
  },
  664: {
    /* n:"BrtBeginFnGroup", */
    T: 1
  },
  665: {
    /* n:"BrtFnGroup" */
  },
  666: {
    /* n:"BrtEndFnGroup", */
    T: -1
  },
  667: {
    /* n:"BrtSupAddin" */
  },
  668: {
    /* n:"BrtSXTDMPOrder" */
  },
  669: {
    /* n:"BrtCsProtection" */
  },
  671: {
    /* n:"BrtBeginWsSortMap", */
    T: 1
  },
  672: {
    /* n:"BrtEndWsSortMap", */
    T: -1
  },
  673: {
    /* n:"BrtBeginRRSort", */
    T: 1
  },
  674: {
    /* n:"BrtEndRRSort", */
    T: -1
  },
  675: {
    /* n:"BrtRRSortItem" */
  },
  676: {
    /* n:"BrtFileSharingIso" */
  },
  677: {
    /* n:"BrtBookProtectionIso" */
  },
  678: {
    /* n:"BrtSheetProtectionIso" */
  },
  679: {
    /* n:"BrtCsProtectionIso" */
  },
  680: {
    /* n:"BrtRangeProtectionIso" */
  },
  681: {
    /* n:"BrtDValList" */
  },
  1024: {
    /* n:"BrtRwDescent" */
  },
  1025: {
    /* n:"BrtKnownFonts" */
  },
  1026: {
    /* n:"BrtBeginSXTupleSet", */
    T: 1
  },
  1027: {
    /* n:"BrtEndSXTupleSet", */
    T: -1
  },
  1028: {
    /* n:"BrtBeginSXTupleSetHeader", */
    T: 1
  },
  1029: {
    /* n:"BrtEndSXTupleSetHeader", */
    T: -1
  },
  1030: {
    /* n:"BrtSXTupleSetHeaderItem" */
  },
  1031: {
    /* n:"BrtBeginSXTupleSetData", */
    T: 1
  },
  1032: {
    /* n:"BrtEndSXTupleSetData", */
    T: -1
  },
  1033: {
    /* n:"BrtBeginSXTupleSetRow", */
    T: 1
  },
  1034: {
    /* n:"BrtEndSXTupleSetRow", */
    T: -1
  },
  1035: {
    /* n:"BrtSXTupleSetRowItem" */
  },
  1036: {
    /* n:"BrtNameExt" */
  },
  1037: {
    /* n:"BrtPCDH14" */
  },
  1038: {
    /* n:"BrtBeginPCDCalcMem14", */
    T: 1
  },
  1039: {
    /* n:"BrtEndPCDCalcMem14", */
    T: -1
  },
  1040: {
    /* n:"BrtSXTH14" */
  },
  1041: {
    /* n:"BrtBeginSparklineGroup", */
    T: 1
  },
  1042: {
    /* n:"BrtEndSparklineGroup", */
    T: -1
  },
  1043: {
    /* n:"BrtSparkline" */
  },
  1044: {
    /* n:"BrtSXDI14" */
  },
  1045: {
    /* n:"BrtWsFmtInfoEx14" */
  },
  1046: {
    /* n:"BrtBeginConditionalFormatting14", */
    T: 1
  },
  1047: {
    /* n:"BrtEndConditionalFormatting14", */
    T: -1
  },
  1048: {
    /* n:"BrtBeginCFRule14", */
    T: 1
  },
  1049: {
    /* n:"BrtEndCFRule14", */
    T: -1
  },
  1050: {
    /* n:"BrtCFVO14" */
  },
  1051: {
    /* n:"BrtBeginDatabar14", */
    T: 1
  },
  1052: {
    /* n:"BrtBeginIconSet14", */
    T: 1
  },
  1053: {
    /* n:"BrtDVal14", */
    f: Hd
  },
  1054: {
    /* n:"BrtBeginDVals14", */
    T: 1
  },
  1055: {
    /* n:"BrtColor14" */
  },
  1056: {
    /* n:"BrtBeginSparklines", */
    T: 1
  },
  1057: {
    /* n:"BrtEndSparklines", */
    T: -1
  },
  1058: {
    /* n:"BrtBeginSparklineGroups", */
    T: 1
  },
  1059: {
    /* n:"BrtEndSparklineGroups", */
    T: -1
  },
  1061: {
    /* n:"BrtSXVD14" */
  },
  1062: {
    /* n:"BrtBeginSXView14", */
    T: 1
  },
  1063: {
    /* n:"BrtEndSXView14", */
    T: -1
  },
  1064: {
    /* n:"BrtBeginSXView16", */
    T: 1
  },
  1065: {
    /* n:"BrtEndSXView16", */
    T: -1
  },
  1066: {
    /* n:"BrtBeginPCD14", */
    T: 1
  },
  1067: {
    /* n:"BrtEndPCD14", */
    T: -1
  },
  1068: {
    /* n:"BrtBeginExtConn14", */
    T: 1
  },
  1069: {
    /* n:"BrtEndExtConn14", */
    T: -1
  },
  1070: {
    /* n:"BrtBeginSlicerCacheIDs", */
    T: 1
  },
  1071: {
    /* n:"BrtEndSlicerCacheIDs", */
    T: -1
  },
  1072: {
    /* n:"BrtBeginSlicerCacheID", */
    T: 1
  },
  1073: {
    /* n:"BrtEndSlicerCacheID", */
    T: -1
  },
  1075: {
    /* n:"BrtBeginSlicerCache", */
    T: 1
  },
  1076: {
    /* n:"BrtEndSlicerCache", */
    T: -1
  },
  1077: {
    /* n:"BrtBeginSlicerCacheDef", */
    T: 1
  },
  1078: {
    /* n:"BrtEndSlicerCacheDef", */
    T: -1
  },
  1079: {
    /* n:"BrtBeginSlicersEx", */
    T: 1
  },
  1080: {
    /* n:"BrtEndSlicersEx", */
    T: -1
  },
  1081: {
    /* n:"BrtBeginSlicerEx", */
    T: 1
  },
  1082: {
    /* n:"BrtEndSlicerEx", */
    T: -1
  },
  1083: {
    /* n:"BrtBeginSlicer", */
    T: 1
  },
  1084: {
    /* n:"BrtEndSlicer", */
    T: -1
  },
  1085: {
    /* n:"BrtSlicerCachePivotTables" */
  },
  1086: {
    /* n:"BrtBeginSlicerCacheOlapImpl", */
    T: 1
  },
  1087: {
    /* n:"BrtEndSlicerCacheOlapImpl", */
    T: -1
  },
  1088: {
    /* n:"BrtBeginSlicerCacheLevelsData", */
    T: 1
  },
  1089: {
    /* n:"BrtEndSlicerCacheLevelsData", */
    T: -1
  },
  1090: {
    /* n:"BrtBeginSlicerCacheLevelData", */
    T: 1
  },
  1091: {
    /* n:"BrtEndSlicerCacheLevelData", */
    T: -1
  },
  1092: {
    /* n:"BrtBeginSlicerCacheSiRanges", */
    T: 1
  },
  1093: {
    /* n:"BrtEndSlicerCacheSiRanges", */
    T: -1
  },
  1094: {
    /* n:"BrtBeginSlicerCacheSiRange", */
    T: 1
  },
  1095: {
    /* n:"BrtEndSlicerCacheSiRange", */
    T: -1
  },
  1096: {
    /* n:"BrtSlicerCacheOlapItem" */
  },
  1097: {
    /* n:"BrtBeginSlicerCacheSelections", */
    T: 1
  },
  1098: {
    /* n:"BrtSlicerCacheSelection" */
  },
  1099: {
    /* n:"BrtEndSlicerCacheSelections", */
    T: -1
  },
  1100: {
    /* n:"BrtBeginSlicerCacheNative", */
    T: 1
  },
  1101: {
    /* n:"BrtEndSlicerCacheNative", */
    T: -1
  },
  1102: {
    /* n:"BrtSlicerCacheNativeItem" */
  },
  1103: {
    /* n:"BrtRangeProtection14" */
  },
  1104: {
    /* n:"BrtRangeProtectionIso14" */
  },
  1105: {
    /* n:"BrtCellIgnoreEC14" */
  },
  1111: {
    /* n:"BrtList14" */
  },
  1112: {
    /* n:"BrtCFIcon" */
  },
  1113: {
    /* n:"BrtBeginSlicerCachesPivotCacheIDs", */
    T: 1
  },
  1114: {
    /* n:"BrtEndSlicerCachesPivotCacheIDs", */
    T: -1
  },
  1115: {
    /* n:"BrtBeginSlicers", */
    T: 1
  },
  1116: {
    /* n:"BrtEndSlicers", */
    T: -1
  },
  1117: {
    /* n:"BrtWbProp14" */
  },
  1118: {
    /* n:"BrtBeginSXEdit", */
    T: 1
  },
  1119: {
    /* n:"BrtEndSXEdit", */
    T: -1
  },
  1120: {
    /* n:"BrtBeginSXEdits", */
    T: 1
  },
  1121: {
    /* n:"BrtEndSXEdits", */
    T: -1
  },
  1122: {
    /* n:"BrtBeginSXChange", */
    T: 1
  },
  1123: {
    /* n:"BrtEndSXChange", */
    T: -1
  },
  1124: {
    /* n:"BrtBeginSXChanges", */
    T: 1
  },
  1125: {
    /* n:"BrtEndSXChanges", */
    T: -1
  },
  1126: {
    /* n:"BrtSXTupleItems" */
  },
  1128: {
    /* n:"BrtBeginSlicerStyle", */
    T: 1
  },
  1129: {
    /* n:"BrtEndSlicerStyle", */
    T: -1
  },
  1130: {
    /* n:"BrtSlicerStyleElement" */
  },
  1131: {
    /* n:"BrtBeginStyleSheetExt14", */
    T: 1
  },
  1132: {
    /* n:"BrtEndStyleSheetExt14", */
    T: -1
  },
  1133: {
    /* n:"BrtBeginSlicerCachesPivotCacheID", */
    T: 1
  },
  1134: {
    /* n:"BrtEndSlicerCachesPivotCacheID", */
    T: -1
  },
  1135: {
    /* n:"BrtBeginConditionalFormattings", */
    T: 1
  },
  1136: {
    /* n:"BrtEndConditionalFormattings", */
    T: -1
  },
  1137: {
    /* n:"BrtBeginPCDCalcMemExt", */
    T: 1
  },
  1138: {
    /* n:"BrtEndPCDCalcMemExt", */
    T: -1
  },
  1139: {
    /* n:"BrtBeginPCDCalcMemsExt", */
    T: 1
  },
  1140: {
    /* n:"BrtEndPCDCalcMemsExt", */
    T: -1
  },
  1141: {
    /* n:"BrtPCDField14" */
  },
  1142: {
    /* n:"BrtBeginSlicerStyles", */
    T: 1
  },
  1143: {
    /* n:"BrtEndSlicerStyles", */
    T: -1
  },
  1144: {
    /* n:"BrtBeginSlicerStyleElements", */
    T: 1
  },
  1145: {
    /* n:"BrtEndSlicerStyleElements", */
    T: -1
  },
  1146: {
    /* n:"BrtCFRuleExt" */
  },
  1147: {
    /* n:"BrtBeginSXCondFmt14", */
    T: 1
  },
  1148: {
    /* n:"BrtEndSXCondFmt14", */
    T: -1
  },
  1149: {
    /* n:"BrtBeginSXCondFmts14", */
    T: 1
  },
  1150: {
    /* n:"BrtEndSXCondFmts14", */
    T: -1
  },
  1152: {
    /* n:"BrtBeginSortCond14", */
    T: 1
  },
  1153: {
    /* n:"BrtEndSortCond14", */
    T: -1
  },
  1154: {
    /* n:"BrtEndDVals14", */
    T: -1
  },
  1155: {
    /* n:"BrtEndIconSet14", */
    T: -1
  },
  1156: {
    /* n:"BrtEndDatabar14", */
    T: -1
  },
  1157: {
    /* n:"BrtBeginColorScale14", */
    T: 1
  },
  1158: {
    /* n:"BrtEndColorScale14", */
    T: -1
  },
  1159: {
    /* n:"BrtBeginSxrules14", */
    T: 1
  },
  1160: {
    /* n:"BrtEndSxrules14", */
    T: -1
  },
  1161: {
    /* n:"BrtBeginPRule14", */
    T: 1
  },
  1162: {
    /* n:"BrtEndPRule14", */
    T: -1
  },
  1163: {
    /* n:"BrtBeginPRFilters14", */
    T: 1
  },
  1164: {
    /* n:"BrtEndPRFilters14", */
    T: -1
  },
  1165: {
    /* n:"BrtBeginPRFilter14", */
    T: 1
  },
  1166: {
    /* n:"BrtEndPRFilter14", */
    T: -1
  },
  1167: {
    /* n:"BrtBeginPRFItem14", */
    T: 1
  },
  1168: {
    /* n:"BrtEndPRFItem14", */
    T: -1
  },
  1169: {
    /* n:"BrtBeginCellIgnoreECs14", */
    T: 1
  },
  1170: {
    /* n:"BrtEndCellIgnoreECs14", */
    T: -1
  },
  1171: {
    /* n:"BrtDxf14" */
  },
  1172: {
    /* n:"BrtBeginDxF14s", */
    T: 1
  },
  1173: {
    /* n:"BrtEndDxf14s", */
    T: -1
  },
  1177: {
    /* n:"BrtFilter14" */
  },
  1178: {
    /* n:"BrtBeginCustomFilters14", */
    T: 1
  },
  1180: {
    /* n:"BrtCustomFilter14" */
  },
  1181: {
    /* n:"BrtIconFilter14" */
  },
  1182: {
    /* n:"BrtPivotCacheConnectionName" */
  },
  2048: {
    /* n:"BrtBeginDecoupledPivotCacheIDs", */
    T: 1
  },
  2049: {
    /* n:"BrtEndDecoupledPivotCacheIDs", */
    T: -1
  },
  2050: {
    /* n:"BrtDecoupledPivotCacheID" */
  },
  2051: {
    /* n:"BrtBeginPivotTableRefs", */
    T: 1
  },
  2052: {
    /* n:"BrtEndPivotTableRefs", */
    T: -1
  },
  2053: {
    /* n:"BrtPivotTableRef" */
  },
  2054: {
    /* n:"BrtSlicerCacheBookPivotTables" */
  },
  2055: {
    /* n:"BrtBeginSxvcells", */
    T: 1
  },
  2056: {
    /* n:"BrtEndSxvcells", */
    T: -1
  },
  2057: {
    /* n:"BrtBeginSxRow", */
    T: 1
  },
  2058: {
    /* n:"BrtEndSxRow", */
    T: -1
  },
  2060: {
    /* n:"BrtPcdCalcMem15" */
  },
  2067: {
    /* n:"BrtQsi15" */
  },
  2068: {
    /* n:"BrtBeginWebExtensions", */
    T: 1
  },
  2069: {
    /* n:"BrtEndWebExtensions", */
    T: -1
  },
  2070: {
    /* n:"BrtWebExtension" */
  },
  2071: {
    /* n:"BrtAbsPath15" */
  },
  2072: {
    /* n:"BrtBeginPivotTableUISettings", */
    T: 1
  },
  2073: {
    /* n:"BrtEndPivotTableUISettings", */
    T: -1
  },
  2075: {
    /* n:"BrtTableSlicerCacheIDs" */
  },
  2076: {
    /* n:"BrtTableSlicerCacheID" */
  },
  2077: {
    /* n:"BrtBeginTableSlicerCache", */
    T: 1
  },
  2078: {
    /* n:"BrtEndTableSlicerCache", */
    T: -1
  },
  2079: {
    /* n:"BrtSxFilter15" */
  },
  2080: {
    /* n:"BrtBeginTimelineCachePivotCacheIDs", */
    T: 1
  },
  2081: {
    /* n:"BrtEndTimelineCachePivotCacheIDs", */
    T: -1
  },
  2082: {
    /* n:"BrtTimelineCachePivotCacheID" */
  },
  2083: {
    /* n:"BrtBeginTimelineCacheIDs", */
    T: 1
  },
  2084: {
    /* n:"BrtEndTimelineCacheIDs", */
    T: -1
  },
  2085: {
    /* n:"BrtBeginTimelineCacheID", */
    T: 1
  },
  2086: {
    /* n:"BrtEndTimelineCacheID", */
    T: -1
  },
  2087: {
    /* n:"BrtBeginTimelinesEx", */
    T: 1
  },
  2088: {
    /* n:"BrtEndTimelinesEx", */
    T: -1
  },
  2089: {
    /* n:"BrtBeginTimelineEx", */
    T: 1
  },
  2090: {
    /* n:"BrtEndTimelineEx", */
    T: -1
  },
  2091: {
    /* n:"BrtWorkBookPr15" */
  },
  2092: {
    /* n:"BrtPCDH15" */
  },
  2093: {
    /* n:"BrtBeginTimelineStyle", */
    T: 1
  },
  2094: {
    /* n:"BrtEndTimelineStyle", */
    T: -1
  },
  2095: {
    /* n:"BrtTimelineStyleElement" */
  },
  2096: {
    /* n:"BrtBeginTimelineStylesheetExt15", */
    T: 1
  },
  2097: {
    /* n:"BrtEndTimelineStylesheetExt15", */
    T: -1
  },
  2098: {
    /* n:"BrtBeginTimelineStyles", */
    T: 1
  },
  2099: {
    /* n:"BrtEndTimelineStyles", */
    T: -1
  },
  2100: {
    /* n:"BrtBeginTimelineStyleElements", */
    T: 1
  },
  2101: {
    /* n:"BrtEndTimelineStyleElements", */
    T: -1
  },
  2102: {
    /* n:"BrtDxf15" */
  },
  2103: {
    /* n:"BrtBeginDxfs15", */
    T: 1
  },
  2104: {
    /* n:"BrtEndDxfs15", */
    T: -1
  },
  2105: {
    /* n:"BrtSlicerCacheHideItemsWithNoData" */
  },
  2106: {
    /* n:"BrtBeginItemUniqueNames", */
    T: 1
  },
  2107: {
    /* n:"BrtEndItemUniqueNames", */
    T: -1
  },
  2108: {
    /* n:"BrtItemUniqueName" */
  },
  2109: {
    /* n:"BrtBeginExtConn15", */
    T: 1
  },
  2110: {
    /* n:"BrtEndExtConn15", */
    T: -1
  },
  2111: {
    /* n:"BrtBeginOledbPr15", */
    T: 1
  },
  2112: {
    /* n:"BrtEndOledbPr15", */
    T: -1
  },
  2113: {
    /* n:"BrtBeginDataFeedPr15", */
    T: 1
  },
  2114: {
    /* n:"BrtEndDataFeedPr15", */
    T: -1
  },
  2115: {
    /* n:"BrtTextPr15" */
  },
  2116: {
    /* n:"BrtRangePr15" */
  },
  2117: {
    /* n:"BrtDbCommand15" */
  },
  2118: {
    /* n:"BrtBeginDbTables15", */
    T: 1
  },
  2119: {
    /* n:"BrtEndDbTables15", */
    T: -1
  },
  2120: {
    /* n:"BrtDbTable15" */
  },
  2121: {
    /* n:"BrtBeginDataModel", */
    T: 1
  },
  2122: {
    /* n:"BrtEndDataModel", */
    T: -1
  },
  2123: {
    /* n:"BrtBeginModelTables", */
    T: 1
  },
  2124: {
    /* n:"BrtEndModelTables", */
    T: -1
  },
  2125: {
    /* n:"BrtModelTable" */
  },
  2126: {
    /* n:"BrtBeginModelRelationships", */
    T: 1
  },
  2127: {
    /* n:"BrtEndModelRelationships", */
    T: -1
  },
  2128: {
    /* n:"BrtModelRelationship" */
  },
  2129: {
    /* n:"BrtBeginECTxtWiz15", */
    T: 1
  },
  2130: {
    /* n:"BrtEndECTxtWiz15", */
    T: -1
  },
  2131: {
    /* n:"BrtBeginECTWFldInfoLst15", */
    T: 1
  },
  2132: {
    /* n:"BrtEndECTWFldInfoLst15", */
    T: -1
  },
  2133: {
    /* n:"BrtBeginECTWFldInfo15", */
    T: 1
  },
  2134: {
    /* n:"BrtFieldListActiveItem" */
  },
  2135: {
    /* n:"BrtPivotCacheIdVersion" */
  },
  2136: {
    /* n:"BrtSXDI15" */
  },
  2137: {
    /* n:"BrtBeginModelTimeGroupings", */
    T: 1
  },
  2138: {
    /* n:"BrtEndModelTimeGroupings", */
    T: -1
  },
  2139: {
    /* n:"BrtBeginModelTimeGrouping", */
    T: 1
  },
  2140: {
    /* n:"BrtEndModelTimeGrouping", */
    T: -1
  },
  2141: {
    /* n:"BrtModelTimeGroupingCalcCol" */
  },
  3072: {
    /* n:"BrtUid" */
  },
  3073: {
    /* n:"BrtRevisionPtr" */
  },
  4096: {
    /* n:"BrtBeginDynamicArrayPr", */
    T: 1
  },
  4097: {
    /* n:"BrtEndDynamicArrayPr", */
    T: -1
  },
  5002: {
    /* n:"BrtBeginRichValueBlock", */
    T: 1
  },
  5003: {
    /* n:"BrtEndRichValueBlock", */
    T: -1
  },
  5081: {
    /* n:"BrtBeginRichFilters", */
    T: 1
  },
  5082: {
    /* n:"BrtEndRichFilters", */
    T: -1
  },
  5083: {
    /* n:"BrtRichFilter" */
  },
  5084: {
    /* n:"BrtBeginRichFilterColumn", */
    T: 1
  },
  5085: {
    /* n:"BrtEndRichFilterColumn", */
    T: -1
  },
  5086: {
    /* n:"BrtBeginCustomRichFilters", */
    T: 1
  },
  5087: {
    /* n:"BrtEndCustomRichFilters", */
    T: -1
  },
  5088: {
    /* n:"BrtCustomRichFilter" */
  },
  5089: {
    /* n:"BrtTop10RichFilter" */
  },
  5090: {
    /* n:"BrtDynamicRichFilter" */
  },
  5092: {
    /* n:"BrtBeginRichSortCondition", */
    T: 1
  },
  5093: {
    /* n:"BrtEndRichSortCondition", */
    T: -1
  },
  5094: {
    /* n:"BrtRichFilterDateGroupItem" */
  },
  5095: {
    /* n:"BrtBeginCalcFeatures", */
    T: 1
  },
  5096: {
    /* n:"BrtEndCalcFeatures", */
    T: -1
  },
  5097: {
    /* n:"BrtCalcFeature" */
  },
  5099: {
    /* n:"BrtExternalLinksPr" */
  },
  65535: { n: "" }
}, Cn = {
  /* [MS-XLS] 2.3 Record Enumeration 2021-08-17 */
  6: {
    /* n:"Formula", */
    f: mn
  },
  10: {
    /* n:"EOF", */
    f: st
  },
  12: {
    /* n:"CalcCount", */
    f: Ze
  },
  //
  13: {
    /* n:"CalcMode", */
    f: Ze
  },
  //
  14: {
    /* n:"CalcPrecision", */
    f: Qe
  },
  //
  15: {
    /* n:"CalcRefMode", */
    f: Qe
  },
  //
  16: {
    /* n:"CalcDelta", */
    f: gr
  },
  //
  17: {
    /* n:"CalcIter", */
    f: Qe
  },
  //
  18: {
    /* n:"Protect", */
    f: Qe
  },
  19: {
    /* n:"Password", */
    f: Ze
  },
  20: {
    /* n:"Header", */
    f: Pi
  },
  21: {
    /* n:"Footer", */
    f: Pi
  },
  23: {
    /* n:"ExternSheet", */
    f: cs
  },
  24: {
    /* n:"Lbl", */
    f: Li
  },
  25: {
    /* n:"WinProtect", */
    f: Qe
  },
  26: {
    /* n:"VerticalPageBreaks", */
  },
  27: {
    /* n:"HorizontalPageBreaks", */
  },
  28: {
    /* n:"Note", */
    f: vl
  },
  29: {
    /* n:"Selection", */
  },
  34: {
    /* n:"Date1904", */
    f: Qe
  },
  35: {
    /* n:"ExternName", */
    f: Bi
  },
  38: {
    /* n:"LeftMargin", */
    f: gr
  },
  // *
  39: {
    /* n:"RightMargin", */
    f: gr
  },
  // *
  40: {
    /* n:"TopMargin", */
    f: gr
  },
  // *
  41: {
    /* n:"BottomMargin", */
    f: gr
  },
  // *
  42: {
    /* n:"PrintRowCol", */
    f: Qe
  },
  43: {
    /* n:"PrintGrid", */
    f: Qe
  },
  47: {
    /* n:"FilePass", */
    f: ku
  },
  49: {
    /* n:"Font", */
    f: Zo
  },
  51: {
    /* n:"PrintSize", */
    f: Ze
  },
  60: {
    /* n:"Continue", */
  },
  61: {
    /* n:"Window1", */
    f: jo
  },
  64: {
    /* n:"Backup", */
    f: Qe
  },
  65: {
    /* n:"Pane", */
    f: Yo
  },
  66: {
    /* n:"CodePage", */
    f: Ze
  },
  77: {
    /* n:"Pls", */
  },
  80: {
    /* n:"DCon", */
  },
  81: {
    /* n:"DConRef", */
  },
  82: {
    /* n:"DConName", */
  },
  85: {
    /* n:"DefColWidth", */
    f: Ze
  },
  89: {
    /* n:"XCT", */
  },
  90: {
    /* n:"CRN", */
  },
  91: {
    /* n:"FileSharing", */
  },
  92: {
    /* n:"WriteAccess", */
    f: Uo
  },
  93: {
    /* n:"Obj", */
    f: _l
  },
  94: {
    /* n:"Uncalced", */
  },
  95: {
    /* n:"CalcSaveRecalc", */
    f: Qe
  },
  //
  96: {
    /* n:"Template", */
  },
  97: {
    /* n:"Intl", */
  },
  99: {
    /* n:"ObjProtect", */
    f: Qe
  },
  125: {
    /* n:"ColInfo", */
    f: os
  },
  128: {
    /* n:"Guts", */
    f: ol
  },
  129: {
    /* n:"WsBool", */
    f: zo
  },
  130: {
    /* n:"GridSet", */
    f: Ze
  },
  131: {
    /* n:"HCenter", */
    f: Qe
  },
  132: {
    /* n:"VCenter", */
    f: Qe
  },
  133: {
    /* n:"BoundSheet8", */
    f: Wo
  },
  134: {
    /* n:"WriteProtect", */
  },
  140: {
    /* n:"Country", */
    f: Al
  },
  141: {
    /* n:"HideObj", */
    f: Ze
  },
  144: {
    /* n:"Sort", */
  },
  146: {
    /* n:"Palette", */
    f: Sl
  },
  151: {
    /* n:"Sync", */
  },
  152: {
    /* n:"LPr", */
  },
  153: {
    /* n:"DxGCol", */
  },
  154: {
    /* n:"FnGroupName", */
  },
  155: {
    /* n:"FilterMode", */
  },
  156: {
    /* n:"BuiltInFnGroupCount", */
    f: Ze
  },
  157: {
    /* n:"AutoFilterInfo", */
  },
  158: {
    /* n:"AutoFilter", */
  },
  160: {
    /* n:"Scl", */
    f: Dl
  },
  161: {
    /* n:"Setup", */
    f: bl
  },
  174: {
    /* n:"ScenMan", */
  },
  175: {
    /* n:"SCENARIO", */
  },
  176: {
    /* n:"SxView", */
  },
  177: {
    /* n:"Sxvd", */
  },
  178: {
    /* n:"SXVI", */
  },
  180: {
    /* n:"SxIvd", */
  },
  181: {
    /* n:"SXLI", */
  },
  182: {
    /* n:"SXPI", */
  },
  184: {
    /* n:"DocRoute", */
  },
  185: {
    /* n:"RecipName", */
  },
  189: {
    /* n:"MulRk", */
    f: tl
  },
  190: {
    /* n:"MulBlank", */
    f: al
  },
  193: {
    /* n:"Mms", */
    f: st
  },
  197: {
    /* n:"SXDI", */
  },
  198: {
    /* n:"SXDB", */
  },
  199: {
    /* n:"SXFDB", */
  },
  200: {
    /* n:"SXDBB", */
  },
  201: {
    /* n:"SXNum", */
  },
  202: {
    /* n:"SxBool", */
    f: Qe
  },
  203: {
    /* n:"SxErr", */
  },
  204: {
    /* n:"SXInt", */
  },
  205: {
    /* n:"SXString", */
  },
  206: {
    /* n:"SXDtr", */
  },
  207: {
    /* n:"SxNil", */
  },
  208: {
    /* n:"SXTbl", */
  },
  209: {
    /* n:"SXTBRGIITM", */
  },
  210: {
    /* n:"SxTbpg", */
  },
  211: {
    /* n:"ObProj", */
  },
  213: {
    /* n:"SXStreamID", */
  },
  215: {
    /* n:"DBCell", */
  },
  216: {
    /* n:"SXRng", */
  },
  217: {
    /* n:"SxIsxoper", */
  },
  218: {
    /* n:"BookBool", */
    f: Ze
  },
  220: {
    /* n:"DbOrParamQry", */
  },
  221: {
    /* n:"ScenarioProtect", */
    f: Qe
  },
  222: {
    /* n:"OleObjectSize", */
  },
  224: {
    /* n:"XF", */
    f: il
  },
  225: {
    /* n:"InterfaceHdr", */
    f: Mo
  },
  226: {
    /* n:"InterfaceEnd", */
    f: st
  },
  227: {
    /* n:"SXVS", */
  },
  229: {
    /* n:"MergeCells", */
    f: gl
  },
  233: {
    /* n:"BkHim", */
  },
  235: {
    /* n:"MsoDrawingGroup", */
  },
  236: {
    /* n:"MsoDrawing", */
  },
  237: {
    /* n:"MsoDrawingSelection", */
  },
  239: {
    /* n:"PhoneticInfo", */
  },
  240: {
    /* n:"SxRule", */
  },
  241: {
    /* n:"SXEx", */
  },
  242: {
    /* n:"SxFilt", */
  },
  244: {
    /* n:"SxDXF", */
  },
  245: {
    /* n:"SxItm", */
  },
  246: {
    /* n:"SxName", */
  },
  247: {
    /* n:"SxSelect", */
  },
  248: {
    /* n:"SXPair", */
  },
  249: {
    /* n:"SxFmla", */
  },
  251: {
    /* n:"SxFormat", */
  },
  252: {
    /* n:"SST", */
    f: Ho
  },
  253: {
    /* n:"LabelSst", */
    f: Qo
  },
  255: {
    /* n:"ExtSST", */
    f: Vo
  },
  256: {
    /* n:"SXVDEx", */
  },
  259: {
    /* n:"SXFormula", */
  },
  290: {
    /* n:"SXDBEx", */
  },
  311: {
    /* n:"RRDInsDel", */
  },
  312: {
    /* n:"RRDHead", */
  },
  315: {
    /* n:"RRDChgCell", */
  },
  317: {
    /* n:"RRTabId", */
    f: rs
  },
  318: {
    /* n:"RRDRenSheet", */
  },
  319: {
    /* n:"RRSort", */
  },
  320: {
    /* n:"RRDMove", */
  },
  330: {
    /* n:"RRFormat", */
  },
  331: {
    /* n:"RRAutoFmt", */
  },
  333: {
    /* n:"RRInsertSh", */
  },
  334: {
    /* n:"RRDMoveBegin", */
  },
  335: {
    /* n:"RRDMoveEnd", */
  },
  336: {
    /* n:"RRDInsDelBegin", */
  },
  337: {
    /* n:"RRDInsDelEnd", */
  },
  338: {
    /* n:"RRDConflict", */
  },
  339: {
    /* n:"RRDDefName", */
  },
  340: {
    /* n:"RRDRstEtxp", */
  },
  351: {
    /* n:"LRng", */
  },
  352: {
    /* n:"UsesELFs", */
    f: Qe
  },
  353: {
    /* n:"DSF", */
    f: st
  },
  401: {
    /* n:"CUsr", */
  },
  402: {
    /* n:"CbUsr", */
  },
  403: {
    /* n:"UsrInfo", */
  },
  404: {
    /* n:"UsrExcl", */
  },
  405: {
    /* n:"FileLock", */
  },
  406: {
    /* n:"RRDInfo", */
  },
  407: {
    /* n:"BCUsrs", */
  },
  408: {
    /* n:"UsrChk", */
  },
  425: {
    /* n:"UserBView", */
  },
  426: {
    /* n:"UserSViewBegin", */
  },
  427: {
    /* n:"UserSViewEnd", */
  },
  428: {
    /* n:"RRDUserView", */
  },
  429: {
    /* n:"Qsi", */
  },
  430: {
    /* n:"SupBook", */
    f: hl
  },
  431: {
    /* n:"Prot4Rev", */
    f: Qe
  },
  432: {
    /* n:"CondFmt", */
  },
  433: {
    /* n:"CF", */
  },
  434: {
    /* n:"DVal", */
  },
  437: {
    /* n:"DConBin", */
  },
  438: {
    /* n:"TxO", */
    f: El
  },
  439: {
    /* n:"RefreshAll", */
    f: Qe
  },
  //
  440: {
    /* n:"HLink", */
    f: Tl
  },
  441: {
    /* n:"Lel", */
  },
  442: {
    /* n:"CodeName", */
    f: ga
  },
  443: {
    /* n:"SXFDBType", */
  },
  444: {
    /* n:"Prot4RevPass", */
    f: Ze
  },
  445: {
    /* n:"ObNoMacros", */
  },
  446: {
    /* n:"Dv", */
  },
  448: {
    /* n:"Excel9File", */
    f: st
  },
  449: {
    /* n:"RecalcId", */
    f: $o,
    r: 2
  },
  450: {
    /* n:"EntExU2", */
    f: st
  },
  512: {
    /* n:"Dimensions", */
    f: Ni
  },
  513: {
    /* n:"Blank", */
    f: Ol
  },
  515: {
    /* n:"Number", */
    f: ul
  },
  516: {
    /* n:"Label", */
    f: Jo
  },
  517: {
    /* n:"BoolErr", */
    f: ll
  },
  519: {
    /* n:"String", */
    f: Rl
  },
  520: {
    /* n:"Row", */
    f: Go
  },
  523: {
    /* n:"Index", */
  },
  545: {
    /* n:"Array", */
    f: Ui
  },
  549: {
    /* n:"DefaultRowHeight", */
    f: Ri
  },
  566: {
    /* n:"Table", */
  },
  574: {
    /* n:"Window2", */
    f: Ko
  },
  638: {
    /* n:"RK", */
    f: rl
  },
  659: {
    /* n:"Style", */
  },
  1048: {
    /* n:"BigName", */
  },
  1054: {
    /* n:"Format", */
    f: qo
  },
  1084: {
    /* n:"ContinueBigName", */
  },
  1212: {
    /* n:"ShrFmla", */
    f: xl
  },
  2048: {
    /* n:"HLinkTooltip", */
    f: yl
  },
  2049: {
    /* n:"WebPub", */
  },
  2050: {
    /* n:"QsiSXTag", */
  },
  2051: {
    /* n:"DBQueryExt", */
  },
  2052: {
    /* n:"ExtString", */
  },
  2053: {
    /* n:"TxtQry", */
  },
  2054: {
    /* n:"Qsir", */
  },
  2055: {
    /* n:"Qsif", */
  },
  2056: {
    /* n:"RRDTQSIF", */
  },
  2057: {
    /* n:"BOF", */
    f: Na
  },
  2058: {
    /* n:"OleDbConn", */
  },
  2059: {
    /* n:"WOpt", */
  },
  2060: {
    /* n:"SXViewEx", */
  },
  2061: {
    /* n:"SXTH", */
  },
  2062: {
    /* n:"SXPIEx", */
  },
  2063: {
    /* n:"SXVDTEx", */
  },
  2064: {
    /* n:"SXViewEx9", */
  },
  2066: {
    /* n:"ContinueFrt", */
  },
  2067: {
    /* n:"RealTimeData", */
  },
  2128: {
    /* n:"ChartFrtInfo", */
  },
  2129: {
    /* n:"FrtWrapper", */
  },
  2130: {
    /* n:"StartBlock", */
  },
  2131: {
    /* n:"EndBlock", */
  },
  2132: {
    /* n:"StartObject", */
  },
  2133: {
    /* n:"EndObject", */
  },
  2134: {
    /* n:"CatLab", */
  },
  2135: {
    /* n:"YMult", */
  },
  2136: {
    /* n:"SXViewLink", */
  },
  2137: {
    /* n:"PivotChartBits", */
  },
  2138: {
    /* n:"FrtFontList", */
  },
  2146: {
    /* n:"SheetExt", */
  },
  2147: {
    /* n:"BookExt", */
    r: 12
  },
  2148: {
    /* n:"SXAddl", */
  },
  2149: {
    /* n:"CrErr", */
  },
  2150: {
    /* n:"HFPicture", */
  },
  2151: {
    /* n:"FeatHdr", */
    f: st
  },
  2152: {
    /* n:"Feat", */
  },
  2154: {
    /* n:"DataLabExt", */
  },
  2155: {
    /* n:"DataLabExtContents", */
  },
  2156: {
    /* n:"CellWatch", */
  },
  2161: {
    /* n:"FeatHdr11", */
  },
  2162: {
    /* n:"Feature11", */
  },
  2164: {
    /* n:"DropDownObjIds", */
  },
  2165: {
    /* n:"ContinueFrt11", */
  },
  2166: {
    /* n:"DConn", */
  },
  2167: {
    /* n:"List12", */
  },
  2168: {
    /* n:"Feature12", */
  },
  2169: {
    /* n:"CondFmt12", */
  },
  2170: {
    /* n:"CF12", */
  },
  2171: {
    /* n:"CFEx", */
  },
  2172: {
    /* n:"XFCRC", */
    f: Cl,
    r: 12
  },
  2173: {
    /* n:"XFExt", */
    f: qu,
    r: 12
  },
  2174: {
    /* n:"AutoFilter12", */
  },
  2175: {
    /* n:"ContinueFrt12", */
  },
  2180: {
    /* n:"MDTInfo", */
  },
  2181: {
    /* n:"MDXStr", */
  },
  2182: {
    /* n:"MDXTuple", */
  },
  2183: {
    /* n:"MDXSet", */
  },
  2184: {
    /* n:"MDXProp", */
  },
  2185: {
    /* n:"MDXKPI", */
  },
  2186: {
    /* n:"MDB", */
  },
  2187: {
    /* n:"PLV", */
  },
  2188: {
    /* n:"Compat12", */
    f: Qe,
    r: 12
  },
  2189: {
    /* n:"DXF", */
  },
  2190: {
    /* n:"TableStyles", */
    r: 12
  },
  2191: {
    /* n:"TableStyle", */
  },
  2192: {
    /* n:"TableStyleElement", */
  },
  2194: {
    /* n:"StyleExt", */
  },
  2195: {
    /* n:"NamePublish", */
  },
  2196: {
    /* n:"NameCmt", */
    f: dl,
    r: 12
  },
  2197: {
    /* n:"SortData", */
  },
  2198: {
    /* n:"Theme", */
    f: ju,
    r: 12
  },
  2199: {
    /* n:"GUIDTypeLib", */
  },
  2200: {
    /* n:"FnGrp12", */
  },
  2201: {
    /* n:"NameFnGrp12", */
  },
  2202: {
    /* n:"MTRSettings", */
    f: pl,
    r: 12
  },
  2203: {
    /* n:"CompressPictures", */
    f: st
  },
  2204: {
    /* n:"HeaderFooter", */
  },
  2205: {
    /* n:"CrtLayout12", */
  },
  2206: {
    /* n:"CrtMlFrt", */
  },
  2207: {
    /* n:"CrtMlFrtContinue", */
  },
  2211: {
    /* n:"ForceFullCalculation", */
    f: Xo
  },
  2212: {
    /* n:"ShapePropsStream", */
  },
  2213: {
    /* n:"TextPropsStream", */
  },
  2214: {
    /* n:"RichTextStream", */
  },
  2215: {
    /* n:"CrtLayout12A", */
  },
  4097: {
    /* n:"Units", */
  },
  4098: {
    /* n:"Chart", */
  },
  4099: {
    /* n:"Series", */
  },
  4102: {
    /* n:"DataFormat", */
  },
  4103: {
    /* n:"LineFormat", */
  },
  4105: {
    /* n:"MarkerFormat", */
  },
  4106: {
    /* n:"AreaFormat", */
  },
  4107: {
    /* n:"PieFormat", */
  },
  4108: {
    /* n:"AttachedLabel", */
  },
  4109: {
    /* n:"SeriesText", */
  },
  4116: {
    /* n:"ChartFormat", */
  },
  4117: {
    /* n:"Legend", */
  },
  4118: {
    /* n:"SeriesList", */
  },
  4119: {
    /* n:"Bar", */
  },
  4120: {
    /* n:"Line", */
  },
  4121: {
    /* n:"Pie", */
  },
  4122: {
    /* n:"Area", */
  },
  4123: {
    /* n:"Scatter", */
  },
  4124: {
    /* n:"CrtLine", */
  },
  4125: {
    /* n:"Axis", */
  },
  4126: {
    /* n:"Tick", */
  },
  4127: {
    /* n:"ValueRange", */
  },
  4128: {
    /* n:"CatSerRange", */
  },
  4129: {
    /* n:"AxisLine", */
  },
  4130: {
    /* n:"CrtLink", */
  },
  4132: {
    /* n:"DefaultText", */
  },
  4133: {
    /* n:"Text", */
  },
  4134: {
    /* n:"FontX", */
    f: Ze
  },
  4135: {
    /* n:"ObjectLink", */
  },
  4146: {
    /* n:"Frame", */
  },
  4147: {
    /* n:"Begin", */
  },
  4148: {
    /* n:"End", */
  },
  4149: {
    /* n:"PlotArea", */
  },
  4154: {
    /* n:"Chart3d", */
  },
  4156: {
    /* n:"PicF", */
  },
  4157: {
    /* n:"DropBar", */
  },
  4158: {
    /* n:"Radar", */
  },
  4159: {
    /* n:"Surf", */
  },
  4160: {
    /* n:"RadarArea", */
  },
  4161: {
    /* n:"AxisParent", */
  },
  4163: {
    /* n:"LegendException", */
  },
  4164: {
    /* n:"ShtProps", */
    f: Il
  },
  4165: {
    /* n:"SerToCrt", */
  },
  4166: {
    /* n:"AxesUsed", */
  },
  4168: {
    /* n:"SBaseRef", */
  },
  4170: {
    /* n:"SerParent", */
  },
  4171: {
    /* n:"SerAuxTrend", */
  },
  4174: {
    /* n:"IFmtRecord", */
  },
  4175: {
    /* n:"Pos", */
  },
  4176: {
    /* n:"AlRuns", */
  },
  4177: {
    /* n:"BRAI", */
  },
  4187: {
    /* n:"SerAuxErrBar", */
  },
  4188: {
    /* n:"ClrtClient", */
    f: Fl
  },
  4189: {
    /* n:"SerFmt", */
  },
  4191: {
    /* n:"Chart3DBarShape", */
  },
  4192: {
    /* n:"Fbi", */
  },
  4193: {
    /* n:"BopPop", */
  },
  4194: {
    /* n:"AxcExt", */
  },
  4195: {
    /* n:"Dat", */
  },
  4196: {
    /* n:"PlotGrowth", */
  },
  4197: {
    /* n:"SIIndex", */
  },
  4198: {
    /* n:"GelFrame", */
  },
  4199: {
    /* n:"BopPopCustom", */
  },
  4200: {
    /* n:"Fbi2", */
  },
  0: {
    /* n:"Dimensions", */
    f: Ni
  },
  1: {
    /* n:"BIFF2BLANK", */
  },
  2: {
    /* n:"BIFF2INT", */
    f: Ll
  },
  3: {
    /* n:"BIFF2NUM", */
    f: Bl
  },
  4: {
    /* n:"BIFF2STR", */
    f: Pl
  },
  5: {
    /* n:"BIFF2BOOLERR", */
    f: Ul
  },
  7: {
    /* n:"String", */
    f: Ml
  },
  8: {
    /* n:"BIFF2ROW", */
  },
  9: {
    /* n:"BOF", */
    f: Na
  },
  11: {
    /* n:"Index", */
  },
  22: {
    /* n:"ExternCount", */
    f: Ze
  },
  30: {
    /* n:"BIFF2FORMAT", */
    f: el
  },
  31: {
    /* n:"BIFF2FMTCNT", */
  },
  /* 16-bit cnt of BIFF2FORMAT records */
  32: {
    /* n:"BIFF2COLINFO", */
  },
  33: {
    /* n:"Array", */
    f: Ui
  },
  36: {
    /* n:"COLWIDTH", */
  },
  37: {
    /* n:"DefaultRowHeight", */
    f: Ri
  },
  // 0x002c ??
  // 0x002d ??
  // 0x002e ??
  // 0x0030 FONTCOUNT: number of fonts
  50: {
    /* n:"BIFF2FONTXTRA", */
    f: zl
  },
  // 0x0035: INFOOPTS
  // 0x0036: TABLE (BIFF2 only)
  // 0x0037: TABLE2 (BIFF2 only)
  // 0x0038: WNDESK
  // 0x0039 ??
  // 0x003a: BEGINPREF
  // 0x003b: ENDPREF
  62: {
    /* n:"BIFF2WINDOW2", */
  },
  // 0x003f ??
  // 0x0046: SHOWSCROLL
  // 0x0047: SHOWFORMULA
  // 0x0048: STATUSBAR
  // 0x0049: SHORTMENUS
  // 0x004A:
  // 0x004B:
  // 0x004C:
  // 0x004E:
  // 0x004F:
  // 0x0058: TOOLBAR (BIFF3)
  /* - - - */
  52: {
    /* n:"DDEObjName", */
  },
  67: {
    /* n:"BIFF2XF", */
    f: sl
  },
  68: {
    /* n:"BIFF2XFINDEX", */
    f: Ze
  },
  69: {
    /* n:"BIFF2FONTCLR", */
  },
  86: {
    /* n:"BIFF4FMTCNT", */
  },
  /* 16-bit cnt, similar to BIFF2 */
  126: {
    /* n:"RK", */
  },
  /* Not necessarily same as 0x027e */
  127: {
    /* n:"ImData", */
    f: Nl
  },
  135: {
    /* n:"Addin", */
  },
  136: {
    /* n:"Edg", */
  },
  137: {
    /* n:"Pub", */
  },
  // 0x8A
  // 0x8B LH: alternate menu key flag (BIFF3/4)
  // 0x8E
  143: {
    /* n:"BIFF4SheetInfo", */
    f: Hl
  },
  145: {
    /* n:"Sub", */
  },
  // 0x93 STYLE
  148: {
    /* n:"LHRecord", */
  },
  149: {
    /* n:"LHNGraph", */
  },
  150: {
    /* n:"Sound", */
  },
  // 0xA2 FNPROTO: function prototypes (BIFF4)
  // 0xA3
  // 0xA8
  169: {
    /* n:"CoordList", */
  },
  171: {
    /* n:"GCW", */
  },
  188: {
    /* n:"ShrFmla", */
  },
  /* Not necessarily same as 0x04bc */
  191: {
    /* n:"ToolbarHdr", */
  },
  192: {
    /* n:"ToolbarEnd", */
  },
  194: {
    /* n:"AddMenu", */
  },
  195: {
    /* n:"DelMenu", */
  },
  214: {
    /* n:"RString", */
    f: Wl
  },
  223: {
    /* n:"UDDesc", */
  },
  234: {
    /* n:"TabIdConf", */
  },
  354: {
    /* n:"XL5Modify", */
  },
  421: {
    /* n:"FileSharing2", */
  },
  518: {
    /* n:"Formula", */
    f: mn
  },
  521: {
    /* n:"BOF", */
    f: Na
  },
  536: {
    /* n:"Lbl", */
    f: Li
  },
  547: {
    /* n:"ExternName", */
    f: Bi
  },
  561: {
    /* n:"Font", */
  },
  579: {
    /* n:"BIFF3XF", */
    f: fl
  },
  1030: {
    /* n:"Formula", */
    f: mn
  },
  1033: {
    /* n:"BOF", */
    f: Na
  },
  1091: {
    /* n:"BIFF4XF", */
    f: cl
  },
  2157: {
    /* n:"FeatInfo", */
  },
  2163: {
    /* n:"FeatInfo11", */
  },
  2177: {
    /* n:"SXAddl12", */
  },
  2240: {
    /* n:"AutoWebPub", */
  },
  2241: {
    /* n:"ListObj", */
  },
  2242: {
    /* n:"ListField", */
  },
  2243: {
    /* n:"ListDV", */
  },
  2244: {
    /* n:"ListCondFmt", */
  },
  2245: {
    /* n:"ListCF", */
  },
  2246: {
    /* n:"FMQry", */
  },
  2247: {
    /* n:"FMSQry", */
  },
  2248: {
    /* n:"PLV", */
  },
  2249: {
    /* n:"LnExt", */
  },
  2250: {
    /* n:"MkrExt", */
  },
  2251: {
    /* n:"CrtCoopt", */
  },
  2262: {
    /* n:"FRTArchId$", */
    r: 12
  },
  /* --- multiplan 4 records --- */
  101: {
    /* n:"", */
  },
  // one per window
  102: {
    /* n:"", */
  },
  // calc settings
  105: {
    /* n:"", */
  },
  // print header
  106: {
    /* n:"", */
  },
  // print footer
  107: {
    /* n:"", */
  },
  // print settings
  109: {
    /* n:"", */
  },
  // one per window
  112: {
    /* n:"", */
  },
  // includes default col width
  114: {
    /* n:"", */
  },
  // includes selected cell
  29282: {}
};
function br(e, t, r, n) {
  var a = t;
  if (!isNaN(a)) {
    var i = (r || []).length || 0, f = e.next(4);
    f.write_shift(2, a), f.write_shift(2, i), /*:: len != null &&*/
    i > 0 && G0(r) && e.push(r);
  }
}
function Qi(e, t) {
  var r = t || {}, n = r.dense != null ? r.dense : xf, a = {};
  n && (a["!data"] = []), e = ma(e, "<!--", "-->");
  var i = e.match(/<table/i);
  if (!i) throw new Error("Invalid HTML: could not find <table>");
  var f = e.match(/<\/table/i), s = i.index, c = f && f.index || e.length, o = tc(e.slice(s, c), /(:?<tr[^<>]*>)/i, "<tr>"), u = -1, m = 0, x = 0, l = 0, v = { s: { r: 1e7, c: 1e7 }, e: { r: 0, c: 0 } }, p = [];
  for (s = 0; s < o.length; ++s) {
    var d = o[s].trim(), h = d.slice(0, 3).toLowerCase();
    if (h == "<tr") {
      if (++u, r.sheetRows && r.sheetRows <= u) {
        --u;
        break;
      }
      m = 0;
      continue;
    }
    if (!(h != "<td" && h != "<th")) {
      var _ = d.split(/<\/t[dh]>/i);
      for (c = 0; c < _.length; ++c) {
        var g = _[c].trim();
        if (g.match(/<t[dh]/i)) {
          for (var E = g, A = 0; E.charAt(0) == "<" && (A = E.indexOf(">")) > -1; ) E = E.slice(A + 1);
          for (var P = 0; P < p.length; ++P) {
            var S = p[P];
            S.s.c == m && S.s.r < u && u <= S.e.r && (m = S.e.c + 1, P = -1);
          }
          var R = Ae(g.slice(0, g.indexOf(">")));
          l = R.colspan ? +R.colspan : 1, ((x = +R.rowspan) > 1 || l > 1) && p.push({ s: { r: u, c: m }, e: { r: u + (x || 1) - 1, c: m + l - 1 } });
          var F = R.t || R["data-t"] || "";
          if (!E.length) {
            m += l;
            continue;
          }
          if (E = O0(E), v.s.r > u && (v.s.r = u), v.e.r < u && (v.e.r = u), v.s.c > m && (v.s.c = m), v.e.c < m && (v.e.c = m), !E.length) {
            m += l;
            continue;
          }
          var U = { t: "s", v: E };
          r.raw || !E.trim().length || F == "s" || (E === "TRUE" ? U = { t: "b", v: !0 } : E === "FALSE" ? U = { t: "b", v: !1 } : isNaN(Dr(E)) ? isNaN(la(E).getDate()) ? E.charCodeAt(0) == 35 && ur[E] != null && (U.t = "e", U.w = E, U.v = ur[E]) : (U = { t: "d", v: dr(E) }, r.UTC === !1 && (U.v = St(U.v)), r.cellDates || (U = { t: "n", v: sr(U.v) }), U.z = r.dateNF || be[14]) : U = { t: "n", v: Dr(E) }), U.cellText !== !1 && (U.w = E), n ? (a["!data"][u] || (a["!data"][u] = []), a["!data"][u][m] = U) : a[We({ r: u, c: m })] = U, m += l;
        }
      }
    }
  }
  return a["!ref"] = Le(v), p.length && (a["!merges"] = p), a;
}
function Ox(e, t, r, n) {
  for (var a = e["!merges"] || [], i = [], f = {}, s = e["!data"] != null, c = t.s.c; c <= t.e.c; ++c) {
    for (var o = 0, u = 0, m = 0; m < a.length; ++m)
      if (!(a[m].s.r > r || a[m].s.c > c) && !(a[m].e.r < r || a[m].e.c < c)) {
        if (a[m].s.r < r || a[m].s.c < c) {
          o = -1;
          break;
        }
        o = a[m].e.r - a[m].s.r + 1, u = a[m].e.c - a[m].s.c + 1;
        break;
      }
    if (!(o < 0)) {
      var x = He(c) + Ge(r), l = s ? (e["!data"][r] || [])[c] : e[x];
      l && l.t == "n" && l.v != null && !isFinite(l.v) && (isNaN(l.v) ? l = { t: "e", v: 36, w: Sr[36] } : l = { t: "e", v: 7, w: Sr[7] });
      var v = l && l.v != null && (l.h || Qt(l.w || (ut(l), l.w) || "")) || "";
      f = {}, o > 1 && (f.rowspan = o), u > 1 && (f.colspan = u), n.editable ? v = '<span contenteditable="true">' + v + "</span>" : l && (f["data-t"] = l && l.t || "z", l.v != null && (f["data-v"] = Qt(l.v instanceof Date ? l.v.toISOString() : l.v)), l.z != null && (f["data-z"] = l.z), l.l && (l.l.Target || "#").charAt(0) != "#" && (v = '<a href="' + Qt(l.l.Target) + '">' + v + "</a>")), f.id = (n.id || "sjs") + "-" + x, i.push(wc("td", v, f));
    }
  }
  var p = "<tr>";
  return p + i.join("") + "</tr>";
}
var Dx = '<html><head><meta charset="utf-8"/><title>SheetJS Table Export</title></head><body>', Rx = "</body></html>";
function Nx(e, t) {
  var r = ic(e, "table");
  if (!r || r.length == 0) throw new Error("Invalid HTML: could not find <table>");
  if (r.length == 1) {
    var n = xt(Qi(r[0], t), t);
    return n.bookType = "html", n;
  }
  var a = qn();
  return r.forEach(function(i, f) {
    Ea(a, Qi(i, t), "Sheet" + (f + 1));
  }), a.bookType = "html", a;
}
function Px(e, t, r) {
  var n = [];
  return n.join("") + "<table" + (r && r.id ? ' id="' + r.id + '"' : "") + ">";
}
function Bx(e, t) {
  var r = t || {}, n = r.header != null ? r.header : Dx, a = r.footer != null ? r.footer : Rx, i = [n], f = It(e["!ref"] || "A1");
  if (i.push(Px(e, f, r)), e["!ref"]) for (var s = f.s.r; s <= f.e.r; ++s) i.push(Ox(e, f, s, r));
  return i.push("</table>" + a), i.join("");
}
function Ns(e, t, r) {
  var n = t.rows;
  if (!n)
    throw "Unsupported origin when " + t.tagName + " is not a TABLE";
  var a = r || {}, i = e["!data"] != null, f = 0, s = 0;
  if (a.origin != null)
    if (typeof a.origin == "number") f = a.origin;
    else {
      var c = typeof a.origin == "string" ? _r(a.origin) : a.origin;
      f = c.r, s = c.c;
    }
  var o = Math.min(a.sheetRows || 1e7, n.length), u = { s: { r: 0, c: 0 }, e: { r: f, c: s } };
  if (e["!ref"]) {
    var m = It(e["!ref"]);
    u.s.r = Math.min(u.s.r, m.s.r), u.s.c = Math.min(u.s.c, m.s.c), u.e.r = Math.max(u.e.r, m.e.r), u.e.c = Math.max(u.e.c, m.e.c), f == -1 && (u.e.r = f = m.e.r + 1);
  }
  var x = [], l = 0, v = e["!rows"] || (e["!rows"] = []), p = 0, d = 0, h = 0, _ = 0, g = 0, E = 0;
  for (e["!cols"] || (e["!cols"] = []); p < n.length && d < o; ++p) {
    var A = n[p];
    if (Ji(A)) {
      if (a.display) continue;
      v[d] = { hidden: !0 };
    }
    var P = A.cells;
    for (h = _ = 0; h < P.length; ++h) {
      var S = P[h];
      if (!(a.display && Ji(S))) {
        var R = S.hasAttribute("data-v") ? S.getAttribute("data-v") : S.hasAttribute("v") ? S.getAttribute("v") : O0(S.innerHTML), F = S.getAttribute("data-z") || S.getAttribute("z");
        for (l = 0; l < x.length; ++l) {
          var U = x[l];
          U.s.c == _ + s && U.s.r < d + f && d + f <= U.e.r && (_ = U.e.c + 1 - s, l = -1);
        }
        E = +S.getAttribute("colspan") || 1, ((g = +S.getAttribute("rowspan") || 1) > 1 || E > 1) && x.push({ s: { r: d + f, c: _ + s }, e: { r: d + f + (g || 1) - 1, c: _ + s + (E || 1) - 1 } });
        var H = { t: "s", v: R }, y = S.getAttribute("data-t") || S.getAttribute("t") || "";
        R != null && (R.length == 0 ? H.t = y || "z" : a.raw || R.trim().length == 0 || y == "s" || (y == "e" && Sr[+R] ? H = { t: "e", v: +R, w: Sr[+R] } : R === "TRUE" ? H = { t: "b", v: !0 } : R === "FALSE" ? H = { t: "b", v: !1 } : isNaN(Dr(R)) ? isNaN(la(R).getDate()) ? R.charCodeAt(0) == 35 && ur[R] != null && (H = { t: "e", v: ur[R], w: R }) : (H = { t: "d", v: dr(R) }, a.UTC && (H.v = en(H.v)), a.cellDates || (H = { t: "n", v: sr(H.v) }), H.z = a.dateNF || be[14]) : H = { t: "n", v: Dr(R) })), H.z === void 0 && F != null && (H.z = F);
        var W = "", k = S.getElementsByTagName("A");
        if (k && k.length) for (var j = 0; j < k.length && !(k[j].hasAttribute("href") && (W = k[j].getAttribute("href"), W.charAt(0) != "#")); ++j) ;
        W && W.charAt(0) != "#" && W.slice(0, 11).toLowerCase() != "javascript:" && (H.l = { Target: W }), i ? (e["!data"][d + f] || (e["!data"][d + f] = []), e["!data"][d + f][_ + s] = H) : e[We({ c: _ + s, r: d + f })] = H, u.e.c < _ + s && (u.e.c = _ + s), _ += E;
      }
    }
    ++d;
  }
  return x.length && (e["!merges"] = (e["!merges"] || []).concat(x)), u.e.r = Math.max(u.e.r, d - 1 + f), e["!ref"] = Le(u), d >= o && (e["!fullref"] = Le((u.e.r = n.length - p + d - 1 + f, u))), e;
}
function Ps(e, t) {
  var r = t || {}, n = {};
  return r.dense && (n["!data"] = []), Ns(n, e, t);
}
function Lx(e, t) {
  var r = xt(Ps(e, t), t);
  return r;
}
function Ji(e) {
  var t = "", r = Mx(e);
  return r && (t = r(e).getPropertyValue("display")), t || (t = e.style && e.style.display), t === "none";
}
function Mx(e) {
  return e.ownerDocument.defaultView && typeof e.ownerDocument.defaultView.getComputedStyle == "function" ? e.ownerDocument.defaultView.getComputedStyle : typeof getComputedStyle == "function" ? getComputedStyle : null;
}
function Ux(e) {
  var t = e.replace(/[\t\r\n]/g, " ").trim().replace(/ +/g, " ").replace(/<text:s\/>/g, " ").replace(/<text:s text:c="(\d+)"\/>/g, function(n, a) {
    return Array(parseInt(a, 10) + 1).join(" ");
  }).replace(/<text:tab[^<>]*\/>/g, "	").replace(/<text:line-break\/>/g, `
`), r = Be(t.replace(/<[^<>]*>/g, ""));
  return [r];
}
function Bs(e, t, r) {
  var n = r || {}, a = rn(e);
  tr.lastIndex = 0, a = Ln(ma(a, "<!--", "-->"));
  for (var i, f, s = "", c = "", o, u = 0, m = -1, x = ""; i = tr.exec(a); )
    switch (i[3] = i[3].replace(/_[\s\S]*$/, "")) {
      /* Number Format Definitions */
      case "number-style":
      // <number:number-style> 16.29.2
      case "currency-style":
      // <number:currency-style> 16.29.8
      case "percentage-style":
      // <number:percentage-style> 16.29.10
      case "date-style":
      // <number:date-style> 16.29.11
      case "time-style":
      // <number:time-style> 16.29.19
      case "text-style":
        i[1] === "/" ? (f["truncate-on-overflow"] == "false" && (s.match(/h/) ? s = s.replace(/h+/, "[$&]") : s.match(/m/) ? s = s.replace(/m+/, "[$&]") : s.match(/s/) && (s = s.replace(/s+/, "[$&]"))), n[f.name] = s, s = "") : i[0].charAt(i[0].length - 2) !== "/" && (s = "", f = Ae(i[0], !1));
        break;
      // LibreOffice bug https://bugs.documentfoundation.org/show_bug.cgi?id=149484
      case "boolean-style":
        i[1] === "/" ? (n[f.name] = "General", s = "") : i[0].charAt(i[0].length - 2) !== "/" && (s = "", f = Ae(i[0], !1));
        break;
      /* Number Format Elements */
      case "boolean":
        s += "General";
        break;
      case "text":
        i[1] === "/" ? (x = a.slice(m, tr.lastIndex - i[0].length), x == "%" && f[0] == "<number:percentage-style" ? s += "%" : s += '"' + x.replace(/"/g, '""') + '"') : i[0].charAt(i[0].length - 2) !== "/" && (m = tr.lastIndex);
        break;
      case "day":
        switch (o = Ae(i[0], !1), o.style) {
          case "short":
            s += "d";
            break;
          case "long":
            s += "dd";
            break;
          default:
            s += "dd";
            break;
        }
        break;
      case "day-of-week":
        switch (o = Ae(i[0], !1), o.style) {
          case "short":
            s += "ddd";
            break;
          case "long":
            s += "dddd";
            break;
          default:
            s += "ddd";
            break;
        }
        break;
      case "era":
        switch (o = Ae(i[0], !1), o.style) {
          case "short":
            s += "ee";
            break;
          case "long":
            s += "eeee";
            break;
          default:
            s += "eeee";
            break;
        }
        break;
      case "hours":
        switch (o = Ae(i[0], !1), o.style) {
          case "short":
            s += "h";
            break;
          case "long":
            s += "hh";
            break;
          default:
            s += "hh";
            break;
        }
        break;
      case "minutes":
        switch (o = Ae(i[0], !1), o.style) {
          case "short":
            s += "m";
            break;
          case "long":
            s += "mm";
            break;
          default:
            s += "mm";
            break;
        }
        break;
      case "month":
        switch (o = Ae(i[0], !1), o.textual && (s += "mm"), o.style) {
          case "short":
            s += "m";
            break;
          case "long":
            s += "mm";
            break;
          default:
            s += "m";
            break;
        }
        break;
      case "seconds":
        {
          switch (o = Ae(i[0], !1), o.style) {
            case "short":
              s += "s";
              break;
            case "long":
              s += "ss";
              break;
            default:
              s += "ss";
              break;
          }
          o["decimal-places"] && (s += "." + Me("0", +o["decimal-places"]));
        }
        break;
      case "year":
        switch (o = Ae(i[0], !1), o.style) {
          case "short":
            s += "yy";
            break;
          case "long":
            s += "yyyy";
            break;
          default:
            s += "yy";
            break;
        }
        break;
      case "am-pm":
        s += "AM/PM";
        break;
      case "week-of-year":
      // <number:week-of-year> 16.29.17
      case "quarter":
        console.error("Excel does not support ODS format token " + i[3]);
        break;
      case "fill-character":
        i[1] === "/" ? (x = a.slice(m, tr.lastIndex - i[0].length), s += '"' + x.replace(/"/g, '""') + '"*') : i[0].charAt(i[0].length - 2) !== "/" && (m = tr.lastIndex);
        break;
      case "scientific-number":
        o = Ae(i[0], !1), s += "0." + Me("0", +o["min-decimal-places"] || +o["decimal-places"] || 2) + Me("?", +o["decimal-places"] - +o["min-decimal-places"] || 0) + "E" + (Ve(o["forced-exponent-sign"]) ? "+" : "") + Me("0", +o["min-exponent-digits"] || 2);
        break;
      case "fraction":
        o = Ae(i[0], !1), +o["min-integer-digits"] ? s += Me("0", +o["min-integer-digits"]) : s += "#", s += " ", s += Me("?", +o["min-numerator-digits"] || 1), s += "/", +o["denominator-value"] ? s += o["denominator-value"] : s += Me("?", +o["min-denominator-digits"] || 1);
        break;
      case "currency-symbol":
        i[1] === "/" ? s += '"' + a.slice(m, tr.lastIndex - i[0].length).replace(/"/g, '""') + '"' : i[0].charAt(i[0].length - 2) !== "/" ? m = tr.lastIndex : s += "$";
        break;
      case "text-properties":
        switch (o = Ae(i[0], !1), (o.color || "").toLowerCase().replace("#", "")) {
          case "ff0000":
          case "red":
            s = "[Red]" + s;
            break;
        }
        break;
      case "text-content":
        s += "@";
        break;
      case "map":
        o = Ae(i[0], !1), Be(o.condition) == "value()>=0" ? s = n[o["apply-style-name"]] + ";" + s : console.error("ODS number format may be incorrect: " + o.condition);
        break;
      case "number":
        if (i[1] === "/") break;
        o = Ae(i[0], !1), c = "", c += Me("0", +o["min-integer-digits"] || 1), Ve(o.grouping) && (c = et(Me("#", Math.max(0, 4 - c.length)) + c)), (+o["min-decimal-places"] || +o["decimal-places"]) && (c += "."), +o["min-decimal-places"] && (c += Me("0", +o["min-decimal-places"] || 1)), +o["decimal-places"] - (+o["min-decimal-places"] || 0) && (c += Me("0", +o["decimal-places"] - (+o["min-decimal-places"] || 0))), s += c;
        break;
      case "embedded-text":
        i[1] === "/" ? u == 0 ? s += '"' + a.slice(m, tr.lastIndex - i[0].length).replace(/"/g, '""') + '"' : s = s.slice(0, u) + '"' + a.slice(m, tr.lastIndex - i[0].length).replace(/"/g, '""') + '"' + s.slice(u) : i[0].charAt(i[0].length - 2) !== "/" && (m = tr.lastIndex, u = -+Ae(i[0], !1).position || 0);
        break;
    }
  return n;
}
function Ls(e, t, r) {
  var n = t || {}, a = rn(e), i = [], f, s, c, o = "", u = 0, m, x, l = {}, v = [], p = {};
  n.dense && (p["!data"] = []);
  var d, h, _ = { value: "" }, g = {}, E = "", A = 0, P = "", S = 0, R = [], F = [], U = -1, H = -1, y = { s: { r: 1e6, c: 1e7 }, e: { r: 0, c: 0 } }, W = 0, k = r || {}, j = {}, me = [], Z = {}, xe = 0, fe = 0, q = [], J = 1, Y = 1, pe = [], ce = { Names: [], WBProps: {} }, de = {}, Te = ["", ""], Ce = [], O = {}, K = "", X = 0, z = !1, he = !1, N = 0;
  for (tr.lastIndex = 0, a = Ln(ma(a, "<!--", "-->")); d = tr.exec(a); ) switch (d[3] = d[3].replace(/_[\s\S]*$/, "")) {
    case "table":
    case "工作表":
      d[1] === "/" ? (y.e.c >= y.s.c && y.e.r >= y.s.r ? p["!ref"] = Le(y) : p["!ref"] = "A1:A1", n.sheetRows > 0 && n.sheetRows <= y.e.r && (p["!fullref"] = p["!ref"], y.e.r = n.sheetRows - 1, p["!ref"] = Le(y)), me.length && (p["!merges"] = me), q.length && (p["!rows"] = q), m.name = m.名称 || m.name, typeof JSON < "u" && JSON.stringify(m), v.push(m.name), l[m.name] = p, he = !1) : d[0].charAt(d[0].length - 2) !== "/" && (m = Ae(d[0], !1), U = H = -1, y.s.r = y.s.c = 1e7, y.e.r = y.e.c = 0, p = {}, n.dense && (p["!data"] = []), me = [], q = [], he = !0);
      break;
    case "table-row-group":
      d[1] === "/" ? --W : ++W;
      break;
    case "table-row":
    case "行":
      if (d[1] === "/") {
        U += J, J = 1;
        break;
      }
      if (x = Ae(d[0], !1), x.行号 ? U = x.行号 - 1 : U == -1 && (U = 0), J = +x["number-rows-repeated"] || 1, J < 10) for (N = 0; N < J; ++N) W > 0 && (q[U + N] = { level: W });
      H = -1;
      break;
    case "covered-table-cell":
      if (d[1] !== "/")
        if (++H, _ = Ae(d[0], !1), Y = parseInt(_["number-columns-repeated"] || "1", 10) || 1, n.sheetStubs) {
          for (; Y-- > 0; )
            n.dense ? (p["!data"][U] || (p["!data"][U] = []), p["!data"][U][H] = { t: "z" }) : p[We({ r: U, c: H })] = { t: "z" }, ++H;
          --H;
        } else H += Y - 1;
      E = "", R = [];
      break;
    /* stub */
    case "table-cell":
    case "数据":
      if (d[0].charAt(d[0].length - 2) === "/")
        ++H, _ = Ae(d[0], !1), Y = parseInt(_["number-columns-repeated"] || "1", 10) || 1, h = {
          t: "z",
          v: null
          /*:: , z:null, w:"",c:[]*/
        }, _.formula && n.cellFormula != !1 && (h.f = ji(Be(_.formula))), _["style-name"] && j[_["style-name"]] && (h.z = j[_["style-name"]]), (_.数据类型 || _["value-type"]) == "string" && (h.t = "s", h.v = Be(_["string-value"] || ""), n.dense ? (p["!data"][U] || (p["!data"][U] = []), p["!data"][U][H] = h) : p[He(H) + Ge(U)] = h), H += Y - 1;
      else if (d[1] !== "/") {
        ++H, E = P = "", A = S = 0, R = [], F = [], Y = 1;
        var w = J ? U + J - 1 : U;
        if (H > y.e.c && (y.e.c = H), H < y.s.c && (y.s.c = H), U < y.s.r && (y.s.r = U), w > y.e.r && (y.e.r = w), _ = Ae(d[0], !1), g = hc(d[0]), Ce = [], O = {}, h = {
          t: _.数据类型 || _["value-type"],
          v: null
          /*:: , z:null, w:"",c:[]*/
        }, _["style-name"] && j[_["style-name"]] && (h.z = j[_["style-name"]]), n.cellFormula)
          if (_.formula && (_.formula = Be(_.formula)), _["number-matrix-columns-spanned"] && _["number-matrix-rows-spanned"] && (xe = parseInt(_["number-matrix-rows-spanned"], 10) || 0, fe = parseInt(_["number-matrix-columns-spanned"], 10) || 0, Z = { s: { r: U, c: H }, e: { r: U + xe - 1, c: H + fe - 1 } }, h.F = Le(Z), pe.push([Z, h.F])), _.formula) h.f = ji(_.formula);
          else for (N = 0; N < pe.length; ++N)
            U >= pe[N][0].s.r && U <= pe[N][0].e.r && H >= pe[N][0].s.c && H <= pe[N][0].e.c && (h.F = pe[N][1]);
        switch ((_["number-columns-spanned"] || _["number-rows-spanned"]) && (xe = parseInt(_["number-rows-spanned"] || "1", 10) || 1, fe = parseInt(_["number-columns-spanned"] || "1", 10) || 1, xe * fe > 1 && (Z = { s: { r: U, c: H }, e: { r: U + xe - 1, c: H + fe - 1 } }, me.push(Z))), _["number-columns-repeated"] && (Y = parseInt(_["number-columns-repeated"], 10)), h.t) {
          case "boolean":
            h.t = "b", h.v = Ve(_["boolean-value"]) || +_["boolean-value"] >= 1;
            break;
          case "float":
            h.t = "n", h.v = parseFloat(_.value), n.cellDates && h.z && $r(h.z) && (h.v = ot(h.v + (ce.WBProps.date1904 ? 1462 : 0)), h.t = typeof h.v == "number" ? "n" : "d");
            break;
          case "percentage":
            h.t = "n", h.v = parseFloat(_.value);
            break;
          case "currency":
            h.t = "n", h.v = parseFloat(_.value);
            break;
          case "date":
            h.t = "d", h.v = dr(_["date-value"], ce.WBProps.date1904), n.cellDates || (h.t = "n", h.v = sr(h.v, ce.WBProps.date1904)), h.z || (h.z = "m/d/yy");
            break;
          /* NOTE: for `time`, Excel ODS export incorrectly uses durations relative to 1900 epoch even if 1904 is specified */
          case "time":
            h.t = "n", h.v = $f(_["time-value"]) / 86400, n.cellDates && (h.v = ot(h.v), h.t = typeof h.v == "number" ? "n" : "d"), h.z || (h.z = "HH:MM:SS");
            break;
          case "number":
            h.t = "n", h.v = parseFloat(_.数据数值);
            break;
          default:
            if (h.t === "string" || h.t === "text" || !h.t)
              h.t = "s", _["string-value"] != null && (E = Be(_["string-value"]), R = []);
            else throw new Error("Unsupported value type " + h.t);
        }
      } else {
        if (z = !1, g["calcext:value-type"] == "error" && ur[E] != null && (h.t = "e", h.w = E, h.v = ur[E]), h.t === "s" && (h.v = E || "", R.length && (h.R = R), z = A == 0), de.Target && (h.l = de), Ce.length > 0 && (h.c = Ce, Ce = []), E && n.cellText !== !1 && (h.w = E), z && (h.t = "z", delete h.v), (!z || n.sheetStubs) && !(n.sheetRows && n.sheetRows <= U))
          for (var Q = 0; Q < J; ++Q) {
            if (Y = parseInt(_["number-columns-repeated"] || "1", 10), n.dense)
              for (p["!data"][U + Q] || (p["!data"][U + Q] = []), p["!data"][U + Q][H] = Q == 0 ? h : nr(h); --Y > 0; ) p["!data"][U + Q][H + Y] = nr(h);
            else
              for (p[We({ r: U + Q, c: H })] = h; --Y > 0; ) p[We({ r: U + Q, c: H + Y })] = nr(h);
            y.e.c <= H && (y.e.c = H);
          }
        Y = parseInt(_["number-columns-repeated"] || "1", 10), H += Y - 1, Y = 0, h = {
          /*:: t:"", v:null, z:null, w:"",c:[]*/
        }, E = "", R = [];
      }
      de = {};
      break;
    // 9.1.4 <table:table-cell>
    /* pure state */
    case "document":
    // TODO: <office:document> is the root for FODS
    case "document-content":
    case "电子表格文档":
    // 3.1.3.2 <office:document-content>
    case "spreadsheet":
    case "主体":
    // 3.7 <office:spreadsheet>
    case "scripts":
    // 3.12 <office:scripts>
    case "styles":
    // TODO <office:styles>
    case "font-face-decls":
    // 3.14 <office:font-face-decls>
    case "master-styles":
      if (d[1] === "/") {
        if ((f = i.pop())[0] !== d[3]) throw "Bad state: " + f;
      } else d[0].charAt(d[0].length - 2) !== "/" && i.push([d[3], !0]);
      break;
    case "annotation":
      if (d[1] === "/") {
        if ((f = i.pop())[0] !== d[3]) throw "Bad state: " + f;
        O.t = E, R.length && (O.R = R), O.a = K, Ce.push(O), E = P, A = S, R = F;
      } else if (d[0].charAt(d[0].length - 2) !== "/") {
        i.push([d[3], !1]);
        var V = Ae(d[0], !0);
        V.display && Ve(V.display) || (Ce.hidden = !0), P = E, S = A, F = R, E = "", A = 0, R = [];
      }
      K = "", X = 0;
      break;
    case "creator":
      d[1] === "/" ? K = a.slice(X, d.index) : X = d.index + d[0].length;
      break;
    /* ignore state */
    case "meta":
    case "元数据":
    // TODO: <office:meta> <uof:元数据> FODS/UOF
    case "settings":
    // TODO: <office:settings>
    case "config-item-set":
    // TODO: <office:config-item-set>
    case "config-item-map-indexed":
    // TODO: <office:config-item-map-indexed>
    case "config-item-map-entry":
    // TODO: <office:config-item-map-entry>
    case "config-item-map-named":
    // TODO: <office:config-item-map-entry>
    case "shapes":
    // 9.2.8 <table:shapes>
    case "frame":
    // 10.4.2 <draw:frame>
    case "text-box":
    // 10.4.3 <draw:text-box>
    case "image":
    // 10.4.4 <draw:image>
    case "data-pilot-tables":
    // 9.6.2 <table:data-pilot-tables>
    case "list-style":
    // 16.30 <text:list-style>
    case "form":
    // 13.13 <form:form>
    case "dde-links":
    // 9.8 <table:dde-links>
    case "event-listeners":
    // TODO
    case "chart":
      if (d[1] === "/") {
        if ((f = i.pop())[0] !== d[3]) throw "Bad state: " + f;
      } else d[0].charAt(d[0].length - 2) !== "/" && i.push([d[3], !1]);
      E = "", A = 0, R = [];
      break;
    case "scientific-number":
    // <number:scientific-number>
    case "currency-symbol":
    // <number:currency-symbol>
    case "fill-character":
      break;
    case "text-style":
    // 16.27.25 <number:text-style>
    case "boolean-style":
    // 16.27.23 <number:boolean-style>
    case "number-style":
    // 16.27.2 <number:number-style>
    case "currency-style":
    // 16.29.8 <number:currency-style>
    case "percentage-style":
    // 16.27.9 <number:percentage-style>
    case "date-style":
    // 16.27.10 <number:date-style>
    case "time-style":
      if (d[1] === "/") {
        var I = tr.lastIndex;
        Bs(a.slice(c, tr.lastIndex), t, k), tr.lastIndex = I;
      } else d[0].charAt(d[0].length - 2) !== "/" && (c = tr.lastIndex - d[0].length);
      break;
    case "script":
      break;
    // 3.13 <office:script>
    case "libraries":
      break;
    // TODO: <ooo:libraries>
    case "automatic-styles":
      break;
    // 3.15.3 <office:automatic-styles>
    case "default-style":
    // TODO: <style:default-style>
    case "page-layout":
      break;
    // TODO: <style:page-layout>
    case "style":
      {
        var C = Ae(d[0], !1);
        C.family == "table-cell" && k[C["data-style-name"]] && (j[C.name] = k[C["data-style-name"]]);
      }
      break;
    case "map":
      break;
    // 16.3 <style:map>
    case "font-face":
      break;
    // 16.21 <style:font-face>
    case "paragraph-properties":
      break;
    // 17.6 <style:paragraph-properties>
    case "table-properties":
      break;
    // 17.15 <style:table-properties>
    case "table-column-properties":
      break;
    // 17.16 <style:table-column-properties>
    case "table-row-properties":
      break;
    // 17.17 <style:table-row-properties>
    case "table-cell-properties":
      break;
    // 17.18 <style:table-cell-properties>
    case "number":
      break;
    case "fraction":
      break;
    // TODO 16.27.6 <number:fraction>
    case "day":
    // 16.27.11 <number:day>
    case "month":
    // 16.27.12 <number:month>
    case "year":
    // 16.27.13 <number:year>
    case "era":
    // 16.27.14 <number:era>
    case "day-of-week":
    // 16.27.15 <number:day-of-week>
    case "week-of-year":
    // 16.27.16 <number:week-of-year>
    case "quarter":
    // 16.27.17 <number:quarter>
    case "hours":
    // 16.27.19 <number:hours>
    case "minutes":
    // 16.27.20 <number:minutes>
    case "seconds":
    // 16.27.21 <number:seconds>
    case "am-pm":
      break;
    case "boolean":
      break;
    // 16.27.24 <number:boolean>
    case "text":
      if (d[0].slice(-2) === "/>") break;
      if (d[1] === "/") switch (i[i.length - 1][0]) {
        case "number-style":
        case "date-style":
        case "time-style":
          o += a.slice(u, d.index);
          break;
      }
      else u = d.index + d[0].length;
      break;
    case "named-range":
      s = Ae(d[0], !1), Te = vn(s["cell-range-address"]);
      var G = { Name: s.name, Ref: Te[0] + "!" + Te[1] };
      he && (G.Sheet = v.length), ce.Names.push(G);
      break;
    case "text-content":
      break;
    // 16.27.27 <number:text-content>
    case "text-properties":
      break;
    // 16.27.27 <style:text-properties>
    case "embedded-text":
      break;
    // 16.27.4 <number:embedded-text>
    case "body":
    case "电子表格":
      break;
    // 3.3 16.9.6 19.726.3
    case "forms":
      break;
    // 12.25.2 13.2
    case "table-column":
      break;
    // 9.1.6 <table:table-column>
    case "table-header-rows":
      break;
    // 9.1.7 <table:table-header-rows>
    case "table-rows":
      break;
    // 9.1.12 <table:table-rows>
    /* TODO: outline levels */
    case "table-column-group":
      break;
    // 9.1.10 <table:table-column-group>
    case "table-header-columns":
      break;
    // 9.1.11 <table:table-header-columns>
    case "table-columns":
      break;
    // 9.1.12 <table:table-columns>
    case "null-date":
      switch (s = Ae(d[0], !1), s["date-value"]) {
        case "1904-01-01":
          ce.WBProps.date1904 = !0;
          break;
      }
      break;
    case "graphic-properties":
      break;
    // 17.21 <style:graphic-properties>
    case "calculation-settings":
      break;
    // 9.4.1 <table:calculation-settings>
    case "named-expressions":
      break;
    // 9.4.11 <table:named-expressions>
    case "label-range":
      break;
    // 9.4.9 <table:label-range>
    case "label-ranges":
      break;
    // 9.4.10 <table:label-ranges>
    case "named-expression":
      break;
    // 9.4.13 <table:named-expression>
    case "sort":
      break;
    // 9.4.19 <table:sort>
    case "sort-by":
      break;
    // 9.4.20 <table:sort-by>
    case "sort-groups":
      break;
    // 9.4.22 <table:sort-groups>
    case "tab":
      break;
    // 6.1.4 <text:tab>
    case "line-break":
      break;
    // 6.1.5 <text:line-break>
    case "span":
      break;
    // 6.1.7 <text:span>
    case "p":
    case "文本串":
      if (["master-styles"].indexOf(i[i.length - 1][0]) > -1) break;
      if (d[1] === "/" && (!_ || !_["string-value"])) {
        var oe = Ux(a.slice(A, d.index));
        E = (E.length > 0 ? E + `
` : "") + oe[0];
      } else d[0].slice(-2) == "/>" ? E += `
` : (Ae(d[0], !1), A = d.index + d[0].length);
      break;
    // <text:p>
    case "s":
      break;
    // <text:s>
    case "database-range":
      if (d[1] === "/") break;
      try {
        Te = vn(Ae(d[0])["target-range-address"]), l[Te[0]]["!autofilter"] = { ref: Te[1] };
      } catch {
      }
      break;
    case "date":
      break;
    // <*:date>
    case "object":
      break;
    // 10.4.6.2 <draw:object>
    case "title":
    case "标题":
      break;
    // <*:title> OR <uof:标题>
    case "desc":
      break;
    // <*:desc>
    case "binary-data":
      break;
    // 10.4.5 TODO: b64 blob
    /* 9.2 Advanced Tables */
    case "table-source":
      break;
    // 9.2.6
    case "scenario":
      break;
    // 9.2.6
    case "iteration":
      break;
    // 9.4.3 <table:iteration>
    case "content-validations":
      break;
    // 9.4.4 <table:
    case "content-validation":
      break;
    // 9.4.5 <table:
    case "help-message":
      break;
    // 9.4.6 <table:
    case "error-message":
      break;
    // 9.4.7 <table:
    case "database-ranges":
      break;
    // 9.4.14 <table:database-ranges>
    /* 9.5 Filters */
    case "filter":
      break;
    // 9.5.2 <table:filter>
    case "filter-and":
      break;
    // 9.5.3 <table:filter-and>
    case "filter-or":
      break;
    // 9.5.4 <table:filter-or>
    case "filter-condition":
      break;
    // 9.5.5 <table:filter-condition>
    case "filter-set-item":
      break;
    // 9.5.6 <table:filter-condition>
    case "list-level-style-bullet":
      break;
    // 16.31 <text:
    case "list-level-style-number":
      break;
    // 16.32 <text:
    case "list-level-properties":
      break;
    // 17.19 <style:
    /* 7.3 Document Fields */
    case "sender-firstname":
    // 7.3.6.2
    case "sender-lastname":
    // 7.3.6.3
    case "sender-initials":
    // 7.3.6.4
    case "sender-title":
    // 7.3.6.5
    case "sender-position":
    // 7.3.6.6
    case "sender-email":
    // 7.3.6.7
    case "sender-phone-private":
    // 7.3.6.8
    case "sender-fax":
    // 7.3.6.9
    case "sender-company":
    // 7.3.6.10
    case "sender-phone-work":
    // 7.3.6.11
    case "sender-street":
    // 7.3.6.12
    case "sender-city":
    // 7.3.6.13
    case "sender-postal-code":
    // 7.3.6.14
    case "sender-country":
    // 7.3.6.15
    case "sender-state-or-province":
    // 7.3.6.16
    case "author-name":
    // 7.3.7.1
    case "author-initials":
    // 7.3.7.2
    case "chapter":
    // 7.3.8
    case "file-name":
    // 7.3.9
    case "template-name":
    // 7.3.9
    case "sheet-name":
      break;
    case "event-listener":
      break;
    /* TODO: FODS Properties */
    case "initial-creator":
    case "creation-date":
    case "print-date":
    case "generator":
    case "document-statistic":
    case "user-defined":
    case "editing-duration":
    case "editing-cycles":
      break;
    /* TODO: FODS Config */
    case "config-item":
      break;
    /* TODO: style tokens */
    case "page-number":
      break;
    // TODO <text:page-number>
    case "page-count":
      break;
    // TODO <text:page-count>
    case "time":
      break;
    // TODO <text:time>
    /* 9.3 Advanced Table Cells */
    case "cell-range-source":
      break;
    // 9.3.1 <table:
    case "detective":
      break;
    // 9.3.2 <table:
    case "operation":
      break;
    // 9.3.3 <table:
    case "highlighted-range":
      break;
    // 9.3.4 <table:
    /* 9.6 Data Pilot Tables <table: */
    case "data-pilot-table":
    // 9.6.3
    case "source-cell-range":
    // 9.6.5
    case "source-service":
    // 9.6.6
    case "data-pilot-field":
    // 9.6.7
    case "data-pilot-level":
    // 9.6.8
    case "data-pilot-subtotals":
    // 9.6.9
    case "data-pilot-subtotal":
    // 9.6.10
    case "data-pilot-members":
    // 9.6.11
    case "data-pilot-member":
    // 9.6.12
    case "data-pilot-display-info":
    // 9.6.13
    case "data-pilot-sort-info":
    // 9.6.14
    case "data-pilot-layout-info":
    // 9.6.15
    case "data-pilot-field-reference":
    // 9.6.16
    case "data-pilot-groups":
    // 9.6.17
    case "data-pilot-group":
    // 9.6.18
    case "data-pilot-group-member":
      break;
    /* 10.3 Drawing Shapes */
    case "rect":
      break;
    /* 14.6 DDE Connections */
    case "dde-connection-decls":
    // 14.6.2 <text:
    case "dde-connection-decl":
    // 14.6.3 <text:
    case "dde-link":
    // 14.6.4 <table:
    case "dde-source":
      break;
    case "properties":
      break;
    // 13.7 <form:properties>
    case "property":
      break;
    // 13.8 <form:property>
    case "a":
      if (d[1] !== "/") {
        if (de = Ae(d[0], !1), !de.href) break;
        de.Target = Be(de.href), delete de.href, de.Target.charAt(0) == "#" && de.Target.indexOf(".") > -1 ? (Te = vn(de.Target.slice(1)), de.Target = "#" + Te[0] + "!" + Te[1]) : de.Target.match(/^\.\.[\\\/]/) && (de.Target = de.Target.slice(3));
      }
      break;
    /* non-standard */
    case "table-protection":
      break;
    case "data-pilot-grand-total":
      break;
    // <table:
    case "office-document-common-attrs":
      break;
    // bare
    default:
      switch (d[2]) {
        case "dc:":
        // TODO: properties
        case "calcext:":
        // ignore undocumented extensions
        case "loext:":
        // ignore undocumented extensions
        case "ooo:":
        // ignore undocumented extensions
        case "chartooo:":
        // ignore undocumented extensions
        case "draw:":
        // TODO: drawing
        case "style:":
        // TODO: styles
        case "chart:":
        // TODO: charts
        case "form:":
        // TODO: forms
        case "uof:":
        // TODO: uof
        case "表:":
        // TODO: uof
        case "字:":
          break;
        default:
          if (n.WTF) throw new Error(d);
      }
  }
  var le = {
    Sheets: l,
    SheetNames: v,
    Workbook: ce
  };
  return n.bookSheets && delete /*::(*/
  le.Sheets, le;
}
function qi(e, t) {
  t = t || {}, Lr(e, "META-INF/manifest.xml") && so(rr(e, "META-INF/manifest.xml"), t);
  var r = yr(e, "styles.xml"), n = r && Bs(Xe(r)), a = yr(e, "content.xml");
  if (!a) throw new Error("Missing content.xml in ODS / UOF file");
  var i = Ls(Xe(a), t, n);
  return Lr(e, "meta.xml") && (i.Props = Q0(rr(e, "meta.xml"))), i.bookType = "ods", i;
}
function e0(e, t) {
  var r = Ls(e, t);
  return r.bookType = "fods", r;
}
/*! sheetjs (C) 2013-present SheetJS -- http://sheetjs.com */
var hr = (function() {
  try {
    return typeof Uint8Array > "u" || typeof Uint8Array.prototype.subarray > "u" ? "slice" : typeof Buffer < "u" ? typeof Buffer.prototype.subarray > "u" ? "slice" : (typeof Buffer.from == "function" ? Buffer.from([72, 62]) : new Buffer([72, 62])) instanceof Uint8Array ? "subarray" : "slice" : "subarray";
  } catch {
    return "slice";
  }
})();
function xa(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function zt(e) {
  return typeof TextDecoder < "u" ? new TextDecoder().decode(e) : Xe(nt(e));
}
function Ms(e) {
  for (var t = 0, r = 0; r < e.length; ++r)
    t += e[r].length;
  var n = new Uint8Array(t), a = 0;
  for (r = 0; r < e.length; ++r) {
    var i = e[r], f = i.length;
    if (f < 250)
      for (var s = 0; s < f; ++s)
        n[a++] = i[s];
    else
      n.set(i, a), a += f;
  }
  return n;
}
function fa(e) {
  return e -= e >> 1 & 1431655765, e = (e & 858993459) + (e >> 2 & 858993459), (e + (e >> 4) & 252645135) * 16843009 >>> 24;
}
function zx(e, t) {
  for (var r = (e[t + 15] & 127) << 7 | e[t + 14] >> 1, n = e[t + 14] & 1, a = t + 13; a >= t; --a)
    n = n * 256 + e[a];
  return (e[t + 15] & 128 ? -n : n) * Math.pow(10, r - 6176);
}
function qa(e, t) {
  var r = t.l, n = e[r] & 127;
  e:
    if (e[r++] >= 128 && (n |= (e[r] & 127) << 7, e[r++] < 128 || (n |= (e[r] & 127) << 14, e[r++] < 128) || (n |= (e[r] & 127) << 21, e[r++] < 128) || (n += (e[r] & 127) * Math.pow(2, 28), ++r, e[r++] < 128) || (n += (e[r] & 127) * Math.pow(2, 35), ++r, e[r++] < 128) || (n += (e[r] & 127) * Math.pow(2, 42), ++r, e[r++] < 128)))
      break e;
  return t.l = r, n;
}
function ze(e) {
  var t = 0, r = e[t] & 127;
  return e[t++] < 128 || (r |= (e[t] & 127) << 7, e[t++] < 128) || (r |= (e[t] & 127) << 14, e[t++] < 128) || (r |= (e[t] & 127) << 21, e[t++] < 128) || (r |= (e[t] & 15) << 28), r;
}
function Re(e) {
  for (var t = [], r = { l: 0 }; r.l < e.length; ) {
    var n = r.l, a = qa(e, r), i = a & 7;
    a = a / 8 | 0;
    var f, s = r.l;
    switch (i) {
      case 0:
        {
          for (; e[s++] >= 128; )
            ;
          f = e[hr](r.l, s), r.l = s;
        }
        break;
      case 1:
        f = e[hr](s, s + 8), r.l = s + 8;
        break;
      case 2:
        {
          var c = qa(e, r);
          f = e[hr](r.l, r.l + c), r.l += c;
        }
        break;
      case 5:
        f = e[hr](s, s + 4), r.l = s + 4;
        break;
      default:
        throw new Error("PB Type ".concat(i, " for Field ").concat(a, " at offset ").concat(n));
    }
    var o = { data: f, type: i };
    t[a] == null && (t[a] = []), t[a].push(o);
  }
  return t;
}
function cn(e, t) {
  return (e == null ? void 0 : e.map(function(r) {
    return t(r.data);
  })) || [];
}
function Wx(e) {
  for (var t, r = [], n = { l: 0 }; n.l < e.length; ) {
    var a = qa(e, n), i = Re(e[hr](n.l, n.l + a));
    n.l += a;
    var f = {
      id: ze(i[1][0].data),
      messages: []
    };
    i[2].forEach(function(s) {
      var c = Re(s.data), o = ze(c[3][0].data);
      f.messages.push({
        meta: c,
        data: e[hr](n.l, n.l + o)
      }), n.l += o;
    }), (t = i[3]) != null && t[0] && (f.merge = ze(i[3][0].data) >>> 0 > 0), r.push(f);
  }
  return r;
}
function Hx(e, t) {
  if (e != 0)
    throw new Error("Unexpected Snappy chunk type ".concat(e));
  for (var r = { l: 0 }, n = qa(t, r), a = [], i = r.l; i < t.length; ) {
    var f = t[i] & 3;
    if (f == 0) {
      var s = t[i++] >> 2;
      if (s < 60)
        ++s;
      else {
        var c = s - 59;
        s = t[i], c > 1 && (s |= t[i + 1] << 8), c > 2 && (s |= t[i + 2] << 16), c > 3 && (s |= t[i + 3] << 24), s >>>= 0, s++, i += c;
      }
      a.push(t[hr](i, i + s)), i += s;
      continue;
    } else {
      var o = 0, u = 0;
      if (f == 1 ? (u = (t[i] >> 2 & 7) + 4, o = (t[i++] & 224) << 3, o |= t[i++]) : (u = (t[i++] >> 2) + 1, f == 2 ? (o = t[i] | t[i + 1] << 8, i += 2) : (o = (t[i] | t[i + 1] << 8 | t[i + 2] << 16 | t[i + 3] << 24) >>> 0, i += 4)), o == 0)
        throw new Error("Invalid offset 0");
      for (var m = a.length - 1, x = o; m >= 0 && x >= a[m].length; )
        x -= a[m].length, --m;
      if (m < 0)
        if (x == 0)
          x = a[m = 0].length;
        else
          throw new Error("Invalid offset beyond length");
      if (u < x)
        a.push(a[m][hr](a[m].length - x, a[m].length - x + u));
      else {
        for (x > 0 && (a.push(a[m][hr](a[m].length - x)), u -= x), ++m; u >= a[m].length; )
          a.push(a[m]), u -= a[m].length, ++m;
        u && a.push(a[m][hr](0, u));
      }
      a.length > 25 && (a = [Ms(a)]);
    }
  }
  for (var l = 0, v = 0; v < a.length; ++v)
    l += a[v].length;
  if (l != n)
    throw new Error("Unexpected length: ".concat(l, " != ").concat(n));
  return a;
}
function Vx(e) {
  Array.isArray(e) && (e = new Uint8Array(e));
  for (var t = [], r = 0; r < e.length; ) {
    var n = e[r++], a = e[r] | e[r + 1] << 8 | e[r + 2] << 16;
    r += 3, t.push.apply(t, Hx(n, e[hr](r, r + a))), r += a;
  }
  if (r !== e.length)
    throw new Error("data is not a valid framed stream!");
  return t.length == 1 ? t[0] : Ms(t);
}
var Gx = function() {
  return { sst: [], rsst: [], ofmt: [], nfmt: [], fmla: [], ferr: [], cmnt: [] };
};
function Us(e, t, r, n, a) {
  var i, f, s, c, o = t & 255, u = t >> 8, m = u >= 5 ? a : n;
  e:
    if (r & (u > 4 ? 8 : 4) && e.t == "n" && o == 7) {
      var x = (i = m[7]) != null && i[0] ? ze(m[7][0].data) : -1;
      if (x == -1)
        break e;
      var l = (f = m[15]) != null && f[0] ? ze(m[15][0].data) : -1, v = (s = m[16]) != null && s[0] ? ze(m[16][0].data) : -1, p = (c = m[40]) != null && c[0] ? ze(m[40][0].data) : -1, d = e.v, h = d;
      r:
        if (p) {
          if (d == 0) {
            l = v = 2;
            break r;
          }
          d >= 604800 ? l = 1 : d >= 86400 ? l = 2 : d >= 3600 ? l = 4 : d >= 60 ? l = 8 : d >= 1 ? l = 16 : l = 32, Math.floor(d) != d ? v = 32 : d % 60 ? v = 16 : d % 3600 ? v = 8 : d % 86400 ? v = 4 : d % 604800 && (v = 2), v < l && (v = l);
        }
      if (l == -1 || v == -1)
        break e;
      var _ = [], g = [];
      l == 1 && (h = d / 604800, v == 1 ? g.push('d"d"') : (h |= 0, d -= 604800 * h), _.push(h + (x == 2 ? " week" + (h == 1 ? "" : "s") : x == 1 ? "w" : ""))), l <= 2 && v >= 2 && (h = d / 86400, v > 2 && (h |= 0, d -= 86400 * h), g.push('d"d"'), _.push(h + (x == 2 ? " day" + (h == 1 ? "" : "s") : x == 1 ? "d" : ""))), l <= 4 && v >= 4 && (h = d / 3600, v > 4 && (h |= 0, d -= 3600 * h), g.push((l >= 4 ? "[h]" : "h") + '"h"'), _.push(h + (x == 2 ? " hour" + (h == 1 ? "" : "s") : x == 1 ? "h" : ""))), l <= 8 && v >= 8 && (h = d / 60, v > 8 && (h |= 0, d -= 60 * h), g.push((l >= 8 ? "[m]" : "m") + '"m"'), x == 0 ? _.push((l == 8 && v == 8 || h >= 10 ? "" : "0") + h) : _.push(h + (x == 2 ? " minute" + (h == 1 ? "" : "s") : x == 1 ? "m" : ""))), l <= 16 && v >= 16 && (h = d, v > 16 && (h |= 0, d -= h), g.push((l >= 16 ? "[s]" : "s") + '"s"'), x == 0 ? _.push((v == 16 && l == 16 || h >= 10 ? "" : "0") + h) : _.push(h + (x == 2 ? " second" + (h == 1 ? "" : "s") : x == 1 ? "s" : ""))), v >= 32 && (h = Math.round(1e3 * d), l < 32 && g.push('.000"ms"'), x == 0 ? _.push((h >= 100 ? "" : h >= 10 ? "0" : "00") + h) : _.push(h + (x == 2 ? " millisecond" + (h == 1 ? "" : "s") : x == 1 ? "ms" : ""))), e.w = _.join(x == 0 ? ":" : " "), e.z = g.join(x == 0 ? '":"' : " "), x == 0 && (e.w = e.w.replace(/:(\d\d\d)$/, ".$1"));
    }
}
function Xx(e, t, r, n) {
  var a = xa(e), i = a.getUint32(4, !0), f = -1, s = -1, c = -1, o = NaN, u = 0, m = new Date(Date.UTC(2001, 0, 1)), x = r > 1 ? 12 : 8;
  i & 2 && (c = a.getUint32(x, !0), x += 4), x += fa(i & (r > 1 ? 3468 : 396)) * 4, i & 512 && (f = a.getUint32(x, !0), x += 4), x += fa(i & (r > 1 ? 12288 : 4096)) * 4, i & 16 && (s = a.getUint32(x, !0), x += 4), i & 32 && (o = a.getFloat64(x, !0), x += 8), i & 64 && (m.setTime(m.getTime() + (u = a.getFloat64(x, !0)) * 1e3), x += 8), r > 1 && (i = a.getUint32(8, !0) >>> 16, i & 255 && (c == -1 && (c = a.getUint32(x, !0)), x += 4));
  var l, v = e[r >= 4 ? 1 : 2];
  switch (v) {
    case 0:
      return;
    case 2:
      l = { t: "n", v: o };
      break;
    case 3:
      l = { t: "s", v: t.sst[s] };
      break;
    case 5:
      n != null && n.cellDates ? l = { t: "d", v: m } : l = { t: "n", v: u / 86400 + 35430, z: be[14] };
      break;
    case 6:
      l = { t: "b", v: o > 0 };
      break;
    case 7:
      l = { t: "n", v: o };
      break;
    case 8:
      l = { t: "e", v: 0 };
      break;
    case 9:
      if (f > -1) {
        var p = t.rsst[f];
        l = { t: "s", v: p.v }, p.l && (l.l = { Target: p.l });
      } else
        throw new Error("Unsupported cell type ".concat(e[hr](0, 4)));
      break;
    default:
      throw new Error("Unsupported cell type ".concat(e[hr](0, 4)));
  }
  return c > -1 && Us(l, v | r << 8, i, t.ofmt[c], t.nfmt[c]), v == 7 && (l.v /= 86400), l;
}
function $x(e, t, r) {
  var n = xa(e);
  n.getUint32(4, !0);
  var a = n.getUint32(8, !0), i = 12, f = -1, s = -1, c = -1, o = NaN, u = NaN, m = 0, x = new Date(Date.UTC(2001, 0, 1));
  a & 1 && (o = zx(e, i), i += 16), a & 2 && (u = n.getFloat64(i, !0), i += 8), a & 4 && (x.setTime(x.getTime() + (m = n.getFloat64(i, !0)) * 1e3), i += 8), a & 8 && (s = n.getUint32(i, !0), i += 4), a & 16 && (f = n.getUint32(i, !0), i += 4), i += fa(a & 480) * 4, a & 512 && (n.getUint32(i, !0), i += 4), i += fa(a & 1024) * 4, a & 2048 && (n.getUint32(i, !0), i += 4);
  var l, v = e[1];
  switch (v) {
    case 0:
      l = { t: "z" };
      break;
    case 2:
      l = { t: "n", v: o };
      break;
    case 3:
      l = { t: "s", v: t.sst[s] };
      break;
    case 5:
      r != null && r.cellDates ? l = { t: "d", v: x } : l = { t: "n", v: m / 86400 + 35430, z: be[14] };
      break;
    case 6:
      l = { t: "b", v: u > 0 };
      break;
    case 7:
      l = { t: "n", v: u };
      break;
    case 8:
      l = { t: "e", v: 0 };
      break;
    case 9:
      if (f > -1) {
        var p = t.rsst[f];
        l = { t: "s", v: p.v }, p.l && (l.l = { Target: p.l });
      } else
        throw new Error("Unsupported cell type ".concat(e[1], " : ").concat(a & 31, " : ").concat(e[hr](0, 4)));
      break;
    case 10:
      l = { t: "n", v: o };
      break;
    default:
      throw new Error("Unsupported cell type ".concat(e[1], " : ").concat(a & 31, " : ").concat(e[hr](0, 4)));
  }
  if (i += fa(a & 4096) * 4, a & 516096 && (c == -1 && (c = n.getUint32(i, !0)), i += 4), a & 524288) {
    var d = n.getUint32(i, !0);
    i += 4, t.cmnt[d] && (l.c = Zx(t.cmnt[d]));
  }
  return c > -1 && Us(l, v | 1280, a >> 13, t.ofmt[c], t.nfmt[c]), v == 7 && (l.v /= 86400), l;
}
function jx(e, t, r) {
  switch (e[0]) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
      return Xx(e, t, e[0], r);
    case 5:
      return $x(e, t, r);
    default:
      throw new Error("Unsupported payload version ".concat(e[0]));
  }
}
function cr(e) {
  var t = Re(e);
  return ze(t[1][0].data);
}
function gt(e, t) {
  var r = Re(t.data), n = ze(r[1][0].data), a = r[3], i = [];
  return (a || []).forEach(function(f) {
    var s, c, o = Re(f.data);
    if (o[1]) {
      var u = ze(o[1][0].data) >>> 0;
      switch (n) {
        case 1:
          i[u] = zt(o[3][0].data);
          break;
        case 8:
          {
            var m = e[cr(o[9][0].data)][0], x = Re(m.data), l = e[cr(x[1][0].data)][0], v = ze(l.meta[1][0].data);
            if (v != 2001)
              throw new Error("2000 unexpected reference to ".concat(v));
            var p = Re(l.data), d = { v: p[3].map(function(g) {
              return zt(g.data);
            }).join("") };
            i[u] = d;
            e:
              if ((s = p == null ? void 0 : p[11]) != null && s[0]) {
                var h = (c = Re(p[11][0].data)) == null ? void 0 : c[1];
                if (!h)
                  break e;
                h.forEach(function(g) {
                  var E, A, P, S = Re(g.data);
                  if ((E = S[2]) != null && E[0]) {
                    var R = e[cr((A = S[2]) == null ? void 0 : A[0].data)][0], F = ze(R.meta[1][0].data);
                    switch (F) {
                      case 2032:
                        var U = Re(R.data);
                        (P = U == null ? void 0 : U[2]) != null && P[0] && !d.l && (d.l = zt(U[2][0].data));
                        break;
                      case 2039:
                        break;
                      default:
                        console.log("unrecognized ObjectAttribute type ".concat(F));
                    }
                  }
                });
              }
          }
          break;
        case 2:
          i[u] = Re(o[6][0].data);
          break;
        case 3:
          i[u] = Re(o[5][0].data);
          break;
        case 10:
          {
            var _ = e[cr(o[10][0].data)][0];
            i[u] = zs(e, _.data);
          }
          break;
        default:
          throw n;
      }
    }
  }), i;
}
function Kx(e, t) {
  var r, n, a, i, f, s, c, o, u, m, x, l, v, p, d = Re(e), h = ze(d[1][0].data) >>> 0, _ = ze(d[2][0].data) >>> 0, g = ((n = (r = d[8]) == null ? void 0 : r[0]) == null ? void 0 : n.data) && ze(d[8][0].data) > 0 || !1, E, A;
  if ((i = (a = d[7]) == null ? void 0 : a[0]) != null && i.data && t != 0)
    E = (s = (f = d[7]) == null ? void 0 : f[0]) == null ? void 0 : s.data, A = (o = (c = d[6]) == null ? void 0 : c[0]) == null ? void 0 : o.data;
  else if ((m = (u = d[4]) == null ? void 0 : u[0]) != null && m.data && t != 1)
    E = (l = (x = d[4]) == null ? void 0 : x[0]) == null ? void 0 : l.data, A = (p = (v = d[3]) == null ? void 0 : v[0]) == null ? void 0 : p.data;
  else
    throw "NUMBERS Tile missing ".concat(t, " cell storage");
  for (var P = g ? 4 : 1, S = xa(E), R = [], F = 0; F < E.length / 2; ++F) {
    var U = S.getUint16(F * 2, !0);
    U < 65535 && R.push([F, U]);
  }
  if (R.length != _)
    throw "Expected ".concat(_, " cells, found ").concat(R.length);
  var H = [];
  for (F = 0; F < R.length - 1; ++F)
    H[R[F][0]] = A[hr](R[F][1] * P, R[F + 1][1] * P);
  return R.length >= 1 && (H[R[R.length - 1][0]] = A[hr](R[R.length - 1][1] * P)), { R: h, cells: H };
}
function Yx(e, t) {
  var r, n = Re(t.data), a = -1;
  (r = n == null ? void 0 : n[7]) != null && r[0] && (ze(n[7][0].data) >>> 0 ? a = 1 : a = 0);
  var i = cn(n[5], function(f) {
    return Kx(f, a);
  });
  return {
    nrows: ze(n[4][0].data) >>> 0,
    data: i.reduce(function(f, s) {
      return f[s.R] || (f[s.R] = []), s.cells.forEach(function(c, o) {
        if (f[s.R][o])
          throw new Error("Duplicate cell r=".concat(s.R, " c=").concat(o));
        f[s.R][o] = c;
      }), f;
    }, [])
  };
}
function zs(e, t) {
  var r, n, a, i, f, s, c, o, u, m, x = { t: "", a: "" }, l = Re(t);
  if ((n = (r = l == null ? void 0 : l[1]) == null ? void 0 : r[0]) != null && n.data && (x.t = zt((i = (a = l == null ? void 0 : l[1]) == null ? void 0 : a[0]) == null ? void 0 : i.data) || ""), (s = (f = l == null ? void 0 : l[3]) == null ? void 0 : f[0]) != null && s.data) {
    var v = e[cr((o = (c = l == null ? void 0 : l[3]) == null ? void 0 : c[0]) == null ? void 0 : o.data)][0], p = Re(v.data);
    (m = (u = p[1]) == null ? void 0 : u[0]) != null && m.data && (x.a = zt(p[1][0].data));
  }
  return l != null && l[4] && (x.replies = [], l[4].forEach(function(d) {
    var h = e[cr(d.data)][0];
    x.replies.push(zs(e, h.data));
  })), x;
}
function Zx(e) {
  var t = [];
  return t.push({ t: e.t || "", a: e.a, T: e.replies && e.replies.length > 0 }), e.replies && e.replies.forEach(function(r) {
    t.push({ t: r.t || "", a: r.a, T: !0 });
  }), t;
}
function Qx(e, t, r, n) {
  var a, i, f, s, c, o, u, m, x, l, v, p, d, h, _ = Re(t.data), g = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
  if (g.e.r = (ze(_[6][0].data) >>> 0) - 1, g.e.r < 0)
    throw new Error("Invalid row varint ".concat(_[6][0].data));
  if (g.e.c = (ze(_[7][0].data) >>> 0) - 1, g.e.c < 0)
    throw new Error("Invalid col varint ".concat(_[7][0].data));
  r["!ref"] = Le(g);
  var E = r["!data"] != null, A = r, P = Re(_[4][0].data), S = Gx();
  (a = P[4]) != null && a[0] && (S.sst = gt(e, e[cr(P[4][0].data)][0])), (i = P[6]) != null && i[0] && (S.fmla = gt(e, e[cr(P[6][0].data)][0])), (f = P[11]) != null && f[0] && (S.ofmt = gt(e, e[cr(P[11][0].data)][0])), (s = P[12]) != null && s[0] && (S.ferr = gt(e, e[cr(P[12][0].data)][0])), (c = P[17]) != null && c[0] && (S.rsst = gt(e, e[cr(P[17][0].data)][0])), (o = P[19]) != null && o[0] && (S.cmnt = gt(e, e[cr(P[19][0].data)][0])), (u = P[22]) != null && u[0] && (S.nfmt = gt(e, e[cr(P[22][0].data)][0]));
  var R = Re(P[3][0].data), F = 0;
  if (!((m = P[9]) != null && m[0]))
    throw "NUMBERS file missing row tree";
  var U = Re(P[9][0].data)[1].map(function(j) {
    return Re(j.data);
  });
  if (U.forEach(function(j) {
    F = ze(j[1][0].data);
    var me = ze(j[2][0].data), Z = R[1][me];
    if (!Z)
      throw "NUMBERS missing tile " + me;
    var xe = Re(Z.data), fe = e[cr(xe[2][0].data)][0], q = ze(fe.meta[1][0].data);
    if (q != 6002)
      throw new Error("6001 unexpected reference to ".concat(q));
    var J = Yx(e, fe);
    J.data.forEach(function(Y, pe) {
      Y.forEach(function(ce, de) {
        var Te = jx(ce, S, n);
        Te && (E ? (A["!data"][F + pe] || (A["!data"][F + pe] = []), A["!data"][F + pe][de] = Te) : r[He(de) + Ge(F + pe)] = Te);
      });
    }), F += J.nrows;
  }), (x = P[13]) != null && x[0]) {
    var H = e[cr(P[13][0].data)][0], y = ze(H.meta[1][0].data);
    if (y != 6144)
      throw new Error("Expected merge type 6144, found ".concat(y));
    r["!merges"] = (l = Re(H.data)) == null ? void 0 : l[1].map(function(j) {
      var me = Re(j.data), Z = xa(Re(me[1][0].data)[1][0].data), xe = xa(Re(me[2][0].data)[1][0].data);
      return {
        s: { r: Z.getUint16(0, !0), c: Z.getUint16(2, !0) },
        e: {
          r: Z.getUint16(0, !0) + xe.getUint16(0, !0) - 1,
          c: Z.getUint16(2, !0) + xe.getUint16(2, !0) - 1
        }
      };
    });
  }
  if (!((v = r["!merges"]) != null && v.length) && ((p = _[47]) != null && p[0])) {
    var W = Re(_[47][0].data);
    if ((d = W[2]) != null && d[0]) {
      var k = Re(W[2][0].data);
      (h = k[3]) != null && h[0] && (r["!merges"] = cn(k[3], function(j) {
        var me, Z, xe, fe, q, J = Re(j), Y = Re(J[2][0].data), pe = Re(Y[1][0].data);
        if ((me = pe[1]) != null && me[0]) {
          var ce = Re(pe[1][0].data), de = ze(ce[1][0].data);
          if (de == 67) {
            var Te = Re(ce[40][0].data);
            if (!(!((Z = Te[3]) != null && Z[0]) || !((xe = Te[4]) != null && xe[0]))) {
              var Ce = Re(Te[3][0].data), O = Re(Te[4][0].data), K = ze(Ce[1][0].data), X = (fe = Ce[2]) != null && fe[0] ? ze(Ce[2][0].data) : K, z = ze(O[1][0].data), he = (q = O[2]) != null && q[0] ? ze(O[2][0].data) : z;
              return { s: { r: z, c: K }, e: { r: he, c: X } };
            }
          }
        }
      }).filter(function(j) {
        return j != null;
      }));
    }
  }
}
function Jx(e, t, r) {
  var n = Re(t.data), a = { "!ref": "A1" };
  r != null && r.dense && (a["!data"] = []);
  var i = e[cr(n[2][0].data)], f = ze(i[0].meta[1][0].data);
  if (f != 6001)
    throw new Error("6000 unexpected reference to ".concat(f));
  return Qx(e, i[0], a, r), a;
}
function qx(e, t, r) {
  var n, a = Re(t.data), i = {
    name: (n = a[1]) != null && n[0] ? zt(a[1][0].data) : "",
    sheets: []
  }, f = cn(a[2], cr);
  return f.forEach(function(s) {
    e[s].forEach(function(c) {
      var o = ze(c.meta[1][0].data);
      o == 6e3 && i.sheets.push(Jx(e, c, r));
    });
  }), i;
}
function ep(e, t, r) {
  var n, a = qn();
  a.Workbook = { WBProps: { date1904: !0 } };
  var i = Re(t.data);
  if ((n = i[2]) != null && n[0])
    throw new Error("Keynote presentations are not supported");
  var f = cn(i[1], cr);
  if (f.forEach(function(s) {
    e[s].forEach(function(c) {
      var o = ze(c.meta[1][0].data);
      if (o == 2) {
        var u = qx(e, c, r);
        u.sheets.forEach(function(m, x) {
          Ea(a, m, x == 0 ? u.name : u.name + "_" + x, !0);
        });
      }
    });
  }), a.SheetNames.length == 0)
    throw new Error("Empty NUMBERS file");
  return a.bookType = "numbers", a;
}
function _n(e, t) {
  var r, n, a, i, f, s, c, o = {}, u = [];
  if (e.FullPaths.forEach(function(x) {
    if (x.match(/\.iwpv2/))
      throw new Error("Unsupported password protection");
  }), e.FileIndex.forEach(function(x) {
    if (x.name.match(/\.iwa$/) && x.content[0] == 0) {
      var l;
      try {
        l = Vx(x.content);
      } catch (p) {
        return console.log("?? " + x.content.length + " " + (p.message || p));
      }
      var v;
      try {
        v = Wx(l);
      } catch (p) {
        return console.log("## " + (p.message || p));
      }
      v.forEach(function(p) {
        o[p.id] = p.messages, u.push(p.id);
      });
    }
  }), !u.length)
    throw new Error("File has no messages");
  if ((a = (n = (r = o == null ? void 0 : o[1]) == null ? void 0 : r[0].meta) == null ? void 0 : n[1]) != null && a[0].data && ze(o[1][0].meta[1][0].data) == 1e4)
    throw new Error("Pages documents are not supported");
  var m = ((c = (s = (f = (i = o == null ? void 0 : o[1]) == null ? void 0 : i[0]) == null ? void 0 : f.meta) == null ? void 0 : s[1]) == null ? void 0 : c[0].data) && ze(o[1][0].meta[1][0].data) == 1 && o[1][0];
  if (m || u.forEach(function(x) {
    o[x].forEach(function(l) {
      var v = ze(l.meta[1][0].data) >>> 0;
      if (v == 1)
        if (!m)
          m = l;
        else
          throw new Error("Document has multiple roots");
    });
  }), !m)
    throw new Error("Cannot find Document root");
  return ep(o, m, t);
}
function rp(e) {
  return function(r) {
    for (var n = 0; n != e.length; ++n) {
      var a = e[n];
      r[a[0]] === void 0 && (r[a[0]] = a[1]), a[2] === "n" && (r[a[0]] = Number(r[a[0]]));
    }
  };
}
function Qn(e) {
  rp([
    ["cellNF", !1],
    /* emit cell number format string as .z */
    ["cellHTML", !0],
    /* emit html string as .h */
    ["cellFormula", !0],
    /* emit formulae as .f */
    ["cellStyles", !1],
    /* emits style/theme as .s */
    ["cellText", !0],
    /* emit formatted text as .w */
    ["cellDates", !1],
    /* emit date cells with type `d` */
    ["sheetStubs", !1],
    /* emit empty cells */
    ["sheetRows", 0, "n"],
    /* read n rows (0 = read all rows) */
    ["bookDeps", !1],
    /* parse calculation chains */
    ["bookSheets", !1],
    /* only try to get sheet names (no Sheets) */
    ["bookProps", !1],
    /* only try to get properties (no Sheets) */
    ["bookFiles", !1],
    /* include raw file structure (keys, files, cfb) */
    ["bookVBA", !1],
    /* include vba raw data (vbaraw) */
    ["password", ""],
    /* password */
    ["WTF", !1]
    /* WTF mode (throws errors) */
  ])(e);
}
function tp(e) {
  return Lt.WS.indexOf(e) > -1 ? "sheet" : e == Lt.CS ? "chart" : e == Lt.DS ? "dialog" : e == Lt.MS ? "macro" : e && e.length ? e : "sheet";
}
function ap(e, t) {
  if (!e) return 0;
  try {
    e = t.map(function(n) {
      return n.id || (n.id = n.strRelID), [n.name, e["!id"][n.id].Target, tp(e["!id"][n.id].Type)];
    });
  } catch {
    return null;
  }
  return !e || e.length === 0 ? null : e;
}
function np(e, t, r, n, a, i, f, s) {
  if (!(!e || !e["!legdrawel"])) {
    var c = Bt(e["!legdrawel"].Target, n), o = yr(r, c, !0);
    o && uh(Xe(o), e, s || []);
  }
}
function ip(e, t, r, n, a, i, f, s, c, o, u, m) {
  try {
    i[n] = ra(yr(e, r, !0), t);
    var x = rr(e, t), l;
    switch (s) {
      case "sheet":
        l = cx(x, t, a, c, i[n], o, u, m);
        break;
      case "chart":
        if (l = ox(x, t, a, c, i[n], o, u, m), !l || !l["!drawel"]) break;
        var v = Bt(l["!drawel"].Target, t), p = An(v), d = lh(yr(e, v, !0), ra(yr(e, p, !0), v)), h = Bt(d, v), _ = An(h);
        l = Xd(yr(e, h, !0), h, c, ra(yr(e, _, !0), h), o, l);
        break;
      case "macro":
        l = lx(x, t, a, c, i[n], o, u, m);
        break;
      case "dialog":
        l = ux(x, t, a, c, i[n], o, u, m);
        break;
      default:
        throw new Error("Unrecognized sheet type " + s);
    }
    f[n] = l;
    var g = [], E = [];
    i && i[n] && zr(i[n]).forEach(function(A) {
      var P = "";
      if (i[n][A].Type == Lt.CMNT) {
        if (P = Bt(i[n][A].Target, t), g = xx(rr(e, P, !0), P, c), !g || !g.length) return;
        Wi(l, g, !1);
      }
      i[n][A].Type == Lt.TCMNT && (P = Bt(i[n][A].Target, t), E = E.concat(dh(rr(e, P, !0), c)));
    }), E && E.length && Wi(l, E, !0, c.people || []), np(l, s, e, t, a, c, o, g);
  } catch (A) {
    if (c.WTF) throw A;
  }
}
function Pr(e) {
  return e.charAt(0) == "/" ? e.slice(1) : e;
}
function sp(e, t) {
  if (k0(), t = t || {}, Qn(t), Lr(e, "META-INF/manifest.xml") || Lr(e, "objectdata.xml")) return qi(e, t);
  if (Lr(e, "Index/Document.iwa")) {
    if (typeof Uint8Array > "u") throw new Error("NUMBERS file parsing requires Uint8Array support");
    if (typeof _n < "u") {
      if (e.FileIndex) return _n(e, t);
      var r = Ue.utils.cfb_new();
      return di(e).forEach(function(j) {
        cc(r, j, fc(e, j));
      }), _n(r, t);
    }
    throw new Error("Unsupported NUMBERS file");
  }
  if (!Lr(e, "[Content_Types].xml")) {
    if (Lr(e, "index.xml.gz")) throw new Error("Unsupported NUMBERS 08 file");
    if (Lr(e, "index.xml")) throw new Error("Unsupported NUMBERS 09 file");
    var n = Ue.find(e, "Index.zip");
    if (n)
      return t = nr(t), delete t.type, typeof n.content == "string" && (t.type = "binary"), typeof Bun < "u" && Buffer.isBuffer(n.content) ? yt(new Uint8Array(n.content), t) : yt(n.content, t);
    throw new Error("Unsupported ZIP file");
  }
  var a = di(e), i = no(yr(e, "[Content_Types].xml")), f = !1, s, c;
  if (i.workbooks.length === 0 && (c = "xl/workbook.xml", rr(e, c, !0) && i.workbooks.push(c)), i.workbooks.length === 0) {
    if (c = "xl/workbook.bin", !rr(e, c, !0)) throw new Error("Could not find workbook");
    i.workbooks.push(c), f = !0;
  }
  i.workbooks[0].slice(-3) == "bin" && (f = !0);
  var o = {}, u = {};
  if (!t.bookSheets && !t.bookProps) {
    if (na = [], i.sst) try {
      na = dx(rr(e, Pr(i.sst)), i.sst, t);
    } catch (j) {
      if (t.WTF) throw j;
    }
    t.cellStyles && i.themes.length && (o = vs(yr(e, i.themes[0].replace(/^\//, ""), !0) || "", t)), i.style && (u = hx(rr(e, Pr(i.style)), i.style, o, t));
  }
  i.links.map(function(j) {
    try {
      var me = ra(yr(e, An(Pr(j))), j);
      return mx(rr(e, Pr(j)), me, j, t);
    } catch {
    }
  });
  var m = fx(rr(e, Pr(i.workbooks[0])), i.workbooks[0], t), x = {}, l = "";
  i.coreprops.length && (l = rr(e, Pr(i.coreprops[0]), !0), l && (x = Q0(l)), i.extprops.length !== 0 && (l = rr(e, Pr(i.extprops[0]), !0), l && co(l, x, t)));
  var v = {};
  (!t.bookSheets || t.bookProps) && i.custprops.length !== 0 && (l = yr(e, Pr(i.custprops[0]), !0), l && (v = lo(l, t)));
  var p = {};
  if ((t.bookSheets || t.bookProps) && (m.Sheets ? s = m.Sheets.map(function(me) {
    return me.name;
  }) : x.Worksheets && x.SheetNames.length > 0 && (s = x.SheetNames), t.bookProps && (p.Props = x, p.Custprops = v), t.bookSheets && typeof s < "u" && (p.SheetNames = s), t.bookSheets ? p.SheetNames : t.bookProps))
    return p;
  s = {};
  var d = {};
  t.bookDeps && i.calcchain && (d = px(rr(e, Pr(i.calcchain)), i.calcchain));
  var h = 0, _ = {}, g, E;
  {
    var A = m.Sheets;
    x.Worksheets = A.length, x.SheetNames = [];
    for (var P = 0; P != A.length; ++P)
      x.SheetNames[P] = A[P].name;
  }
  var S = f ? "bin" : "xml", R = i.workbooks[0].lastIndexOf("/"), F = (i.workbooks[0].slice(0, R + 1) + "_rels/" + i.workbooks[0].slice(R + 1) + ".rels").replace(/^\//, "");
  Lr(e, F) || (F = "xl/_rels/workbook." + S + ".rels");
  var U = ra(yr(e, F, !0), F.replace(/_rels.*/, "s5s"));
  (i.metadata || []).length >= 1 && (t.xlmeta = vx(rr(e, Pr(i.metadata[0])), i.metadata[0], t)), (i.people || []).length >= 1 && (t.people = xh(rr(e, Pr(i.people[0])), t)), U && (U = ap(U, m.Sheets));
  var H = rr(e, "xl/worksheets/sheet.xml", !0) ? 1 : 0;
  e: for (h = 0; h != x.Worksheets; ++h) {
    var y = "sheet";
    if (U && U[h] ? (g = "xl/" + U[h][1].replace(/[\/]?xl\//, ""), Lr(e, g) || (g = U[h][1]), Lr(e, g) || (g = F.replace(/_rels\/[\S\s]*$/, "") + U[h][1]), y = U[h][2]) : (g = "xl/worksheets/sheet" + (h + 1 - H) + "." + S, g = g.replace(/sheet0\./, "sheet.")), E = g.replace(/^(.*)(\/)([^\/]*)$/, "$1/_rels/$3.rels"), t && t.sheets != null) switch (typeof t.sheets) {
      case "number":
        if (h != t.sheets) continue e;
        break;
      case "string":
        if (x.SheetNames[h].toLowerCase() != t.sheets.toLowerCase()) continue e;
        break;
      default:
        if (Array.isArray && Array.isArray(t.sheets)) {
          for (var W = !1, k = 0; k != t.sheets.length; ++k)
            typeof t.sheets[k] == "number" && t.sheets[k] == h && (W = 1), typeof t.sheets[k] == "string" && t.sheets[k].toLowerCase() == x.SheetNames[h].toLowerCase() && (W = 1);
          if (!W) continue e;
        }
    }
    ip(e, g, E, x.SheetNames[h], h, _, s, y, t, m, o, u);
  }
  return p = {
    Directory: i,
    Workbook: m,
    Props: x,
    Custprops: v,
    Deps: d,
    Sheets: s,
    SheetNames: x.SheetNames,
    Strings: na,
    Styles: u,
    Themes: o,
    SSF: nr(be)
  }, t && t.bookFiles && (e.files ? (p.keys = a, p.files = e.files) : (p.keys = [], p.files = {}, e.FullPaths.forEach(function(j, me) {
    j = j.replace(/^Root Entry[\/]/, ""), p.keys.push(j), p.files[j] = e.FileIndex[me];
  }))), t && t.bookVBA && (i.vba.length > 0 ? p.vbaraw = rr(e, Pr(i.vba[0]), !0) : i.defaults && i.defaults.bin === gh && (p.vbaraw = rr(e, "xl/vbaProject.bin", !0))), p.bookType = f ? "xlsb" : "xlsx", p;
}
function fp(e, t) {
  var r = t || {}, n = "Workbook", a = Ue.find(e, n);
  try {
    if (n = "/!DataSpaces/Version", a = Ue.find(e, n), !a || !a.content) throw new Error("ECMA-376 Encrypted file missing " + n);
    if (nu(a.content), n = "/!DataSpaces/DataSpaceMap", a = Ue.find(e, n), !a || !a.content) throw new Error("ECMA-376 Encrypted file missing " + n);
    var i = su(a.content);
    if (i.length !== 1 || i[0].comps.length !== 1 || i[0].comps[0].t !== 0 || i[0].name !== "StrongEncryptionDataSpace" || i[0].comps[0].v !== "EncryptedPackage")
      throw new Error("ECMA-376 Encrypted file bad " + n);
    if (n = "/!DataSpaces/DataSpaceInfo/StrongEncryptionDataSpace", a = Ue.find(e, n), !a || !a.content) throw new Error("ECMA-376 Encrypted file missing " + n);
    var f = fu(a.content);
    if (f.length != 1 || f[0] != "StrongEncryptionTransform")
      throw new Error("ECMA-376 Encrypted file bad " + n);
    if (n = "/!DataSpaces/TransformInfo/StrongEncryptionTransform/!Primary", a = Ue.find(e, n), !a || !a.content) throw new Error("ECMA-376 Encrypted file missing " + n);
    ou(a.content);
  } catch {
  }
  if (n = "/EncryptionInfo", a = Ue.find(e, n), !a || !a.content) throw new Error("ECMA-376 Encrypted file missing " + n);
  var s = lu(a.content);
  if (n = "/EncryptedPackage", a = Ue.find(e, n), !a || !a.content) throw new Error("ECMA-376 Encrypted file missing " + n);
  if (s[0] == 4 && typeof decrypt_agile < "u") return decrypt_agile(s[1], a.content, r.password || "", r);
  if (s[0] == 2 && typeof decrypt_std76 < "u") return decrypt_std76(s[1], a.content, r.password || "", r);
  throw new Error("File is password-protected");
}
function Jn(e, t) {
  var r = "";
  switch ((t || {}).type || "base64") {
    case "buffer":
      return [e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7]];
    case "base64":
      r = Rr(e.slice(0, 12));
      break;
    case "binary":
      r = e;
      break;
    case "array":
      return [e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7]];
    default:
      throw new Error("Unrecognized type " + (t && t.type || "undefined"));
  }
  return [r.charCodeAt(0), r.charCodeAt(1), r.charCodeAt(2), r.charCodeAt(3), r.charCodeAt(4), r.charCodeAt(5), r.charCodeAt(6), r.charCodeAt(7)];
}
function cp(e, t) {
  return Ue.find(e, "EncryptedPackage") ? fp(e, t) : Rs(e, t);
}
function op(e, t) {
  var r, n = e, a = t || {};
  return a.type || (a.type = Pe && Buffer.isBuffer(e) ? "buffer" : "base64"), r = S0(n, a), sp(r, a);
}
function Ws(e, t) {
  var r = 0;
  e: for (; r < e.length; ) switch (e.charCodeAt(r)) {
    case 10:
    case 13:
    case 32:
      ++r;
      break;
    case 60:
      return Sn(e.slice(r), t);
    default:
      break e;
  }
  return ua.to_workbook(e, t);
}
function lp(e, t) {
  var r = "", n = Jn(e, t);
  switch (t.type) {
    case "base64":
      r = Rr(e);
      break;
    case "binary":
      r = e;
      break;
    case "buffer":
      r = e.toString("binary");
      break;
    case "array":
      r = Ft(e);
      break;
    default:
      throw new Error("Unrecognized type " + t.type);
  }
  return n[0] == 239 && n[1] == 187 && n[2] == 191 && (r = Xe(r)), t.type = "binary", Ws(r, t);
}
function up(e, t) {
  var r = e;
  return t.type == "base64" && (r = Rr(r)), typeof ArrayBuffer < "u" && e instanceof ArrayBuffer && (r = new Uint8Array(e)), r = Pe && Buffer.isBuffer(e) ? e.slice(2).toString("utf16le") : typeof Uint8Array < "u" && r instanceof Uint8Array ? typeof TextDecoder < "u" ? new TextDecoder("utf-16le").decode(r.slice(2)) : df(r.slice(2)) : u0(r.slice(2)), t.type = "binary", Ws(r, t);
}
function hp(e) {
  return e.match(/[^\x00-\x7F]/) ? Yt(e) : e;
}
function wn(e, t, r, n) {
  return n ? (r.type = "string", ua.to_workbook(e, r)) : ua.to_workbook(t, r);
}
function yt(e, t) {
  l0();
  var r = t || {};
  if (r.codepage && console.error("Codepage tables are not loaded.  Non-ASCII characters may not give expected results"), typeof ArrayBuffer < "u" && e instanceof ArrayBuffer) return yt(new Uint8Array(e), (r = nr(r), r.type = "array", r));
  if (typeof Int8Array < "u" && e instanceof Int8Array) return yt(new Uint8Array(e.buffer, e.byteOffset, e.length), r);
  typeof Uint8Array < "u" && e instanceof Uint8Array && !r.type && (r.type = typeof Deno < "u" ? "buffer" : "array");
  var n = e, a = [0, 0, 0, 0], i = !1;
  if (r.cellStyles && (r.cellNF = !0, r.sheetStubs = !0), Ut = {}, r.dateNF && (Ut.dateNF = r.dateNF), r.type || (r.type = Pe && Buffer.isBuffer(e) ? "buffer" : "base64"), r.type == "file" && (r.type = Pe ? "buffer" : "binary", n = Vf(e), typeof Uint8Array < "u" && !Pe && (r.type = "array")), r.type == "string" && (i = !0, r.type = "binary", r.codepage = 65001, n = hp(e)), r.type == "array" && typeof Uint8Array < "u" && e instanceof Uint8Array && typeof ArrayBuffer < "u") {
    var f = new ArrayBuffer(3), s = new Uint8Array(f);
    if (s.foo = "bar", !s.foo)
      return r = nr(r), r.type = "array", yt(Rn(n), r);
  }
  switch ((a = Jn(n, r))[0]) {
    case 208:
      if (a[1] === 207 && a[2] === 17 && a[3] === 224 && a[4] === 161 && a[5] === 177 && a[6] === 26 && a[7] === 225) return cp(Ue.read(n, r), r);
      break;
    case 9:
      if (a[1] <= 8) return Rs(n, r);
      break;
    case 60:
      return Sn(n, r);
    case 73:
      if (a[1] === 73 && a[2] === 42 && a[3] === 0) throw new Error("TIFF Image File is not a spreadsheet");
      if (a[1] === 68) return jl(n, r);
      break;
    case 84:
      if (a[1] === 65 && a[2] === 66 && a[3] === 76) return Xl.to_workbook(n, r);
      break;
    case 80:
      return a[1] === 75 && a[2] < 9 && a[3] < 9 ? op(n, r) : wn(e, n, r, i);
    case 239:
      return a[3] === 60 ? Sn(n, r) : wn(e, n, r, i);
    case 255:
      if (a[1] === 254)
        return up(n, r);
      if (a[1] === 0 && a[2] === 2 && a[3] === 0) return aa.to_workbook(n, r);
      break;
    case 0:
      if (a[1] === 0 && (a[2] >= 2 && a[3] === 0 || a[2] === 0 && (a[3] === 8 || a[3] === 9)))
        return aa.to_workbook(n, r);
      break;
    case 3:
    case 131:
    case 139:
    case 140:
      return zi.to_workbook(n, r);
    case 123:
      if (a[1] === 92 && a[2] === 114 && a[3] === 116) return Tu(n, r);
      break;
    case 10:
    case 13:
    case 32:
      return lp(n, r);
    case 137:
      if (a[1] === 80 && a[2] === 78 && a[3] === 71) throw new Error("PNG Image File is not a spreadsheet");
      break;
    case 8:
      if (a[1] === 231) throw new Error("Unsupported Multiplan 1.x file!");
      break;
    case 12:
      if (a[1] === 236) throw new Error("Unsupported Multiplan 2.x file!");
      if (a[1] === 237) throw new Error("Unsupported Multiplan 3.x file!");
      break;
  }
  return Vl.indexOf(a[0]) > -1 && a[2] <= 12 && a[3] <= 31 ? zi.to_workbook(n, r) : wn(e, n, r, i);
}
function dp(e, t, r, n, a, i, f) {
  var s = Ge(r), c = f.defval, o = f.raw || !Object.prototype.hasOwnProperty.call(f, "raw"), u = !0, m = e["!data"] != null, x = a === 1 ? [] : {};
  if (a !== 1)
    if (Object.defineProperty) try {
      Object.defineProperty(x, "__rowNum__", { value: r, enumerable: !1 });
    } catch {
      x.__rowNum__ = r;
    }
    else x.__rowNum__ = r;
  if (!m || e["!data"][r]) for (var l = t.s.c; l <= t.e.c; ++l) {
    var v = m ? (e["!data"][r] || [])[l] : e[n[l] + s];
    if (v == null || v.t === void 0) {
      if (c === void 0) continue;
      i[l] != null && (x[i[l]] = c);
      continue;
    }
    var p = v.v;
    switch (v.t) {
      case "z":
        if (p == null) break;
        continue;
      case "e":
        p = p == 0 ? null : void 0;
        break;
      case "s":
      case "b":
      case "n":
        if (!v.z || !$r(v.z) || (p = ot(p), typeof p == "number")) break;
      /* falls through */
      case "d":
        f && (f.UTC || f.raw === !1) || (p = St(new Date(p)));
        break;
      default:
        throw new Error("unrecognized type " + v.t);
    }
    if (i[l] != null) {
      if (p == null)
        if (v.t == "e" && p === null) x[i[l]] = null;
        else if (c !== void 0) x[i[l]] = c;
        else if (o && p === null) x[i[l]] = null;
        else continue;
      else
        x[i[l]] = (v.t === "n" && typeof f.rawNumbers == "boolean" ? f.rawNumbers : o) ? p : ut(v, p, f);
      p != null && (u = !1);
    }
  }
  return { row: x, isempty: u };
}
function bn(e, t) {
  if (e == null || e["!ref"] == null) return [];
  var r = { t: "n", v: 0 }, n = 0, a = 1, i = [], f = 0, s = "", c = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }, o = t || {}, u = o.range != null ? o.range : e["!ref"];
  switch (o.header === 1 ? n = 1 : o.header === "A" ? n = 2 : Array.isArray(o.header) ? n = 3 : o.header == null && (n = 0), typeof u) {
    case "string":
      c = Je(u);
      break;
    case "number":
      c = Je(e["!ref"]), c.s.r = u;
      break;
    default:
      c = u;
  }
  n > 0 && (a = 0);
  var m = Ge(c.s.r), x = [], l = [], v = 0, p = 0, d = e["!data"] != null, h = c.s.r, _ = 0, g = {};
  d && !e["!data"][h] && (e["!data"][h] = []);
  var E = o.skipHidden && e["!cols"] || [], A = o.skipHidden && e["!rows"] || [];
  for (_ = c.s.c; _ <= c.e.c; ++_)
    if (!(E[_] || {}).hidden)
      switch (x[_] = He(_), r = d ? e["!data"][h][_] : e[x[_] + m], n) {
        case 1:
          i[_] = _ - c.s.c;
          break;
        case 2:
          i[_] = x[_];
          break;
        case 3:
          i[_] = o.header[_ - c.s.c];
          break;
        default:
          if (r == null && (r = { w: "__EMPTY", t: "s" }), s = f = ut(r, null, o), p = g[f] || 0, !p) g[f] = 1;
          else {
            do
              s = f + "_" + p++;
            while (g[s]);
            g[f] = p, g[s] = 1;
          }
          i[_] = s;
      }
  for (h = c.s.r + a; h <= c.e.r; ++h)
    if (!(A[h] || {}).hidden) {
      var P = dp(e, c, h, x, n, i, o);
      (P.isempty === !1 || (n === 1 ? o.blankrows !== !1 : o.blankrows)) && (l[v++] = P.row);
    }
  return l.length = v, l;
}
var r0 = /"/g;
function xp(e, t, r, n, a, i, f, s, c) {
  for (var o = !0, u = [], m = "", x = Ge(r), l = e["!data"] != null, v = l && e["!data"][r] || [], p = t.s.c; p <= t.e.c; ++p)
    if (n[p]) {
      var d = l ? v[p] : e[n[p] + x];
      if (d == null) m = "";
      else if (d.v != null) {
        o = !1, m = "" + (c.rawNumbers && d.t == "n" ? d.v : ut(d, null, c));
        for (var h = 0, _ = 0; h !== m.length; ++h) if ((_ = m.charCodeAt(h)) === a || _ === i || _ === 34 || c.forceQuotes) {
          m = '"' + m.replace(r0, '""') + '"';
          break;
        }
        m == "ID" && s == 0 && u.length == 0 && (m = '"ID"');
      } else d.f != null && !d.F ? (o = !1, m = "=" + d.f, m.indexOf(",") >= 0 && (m = '"' + m.replace(r0, '""') + '"')) : m = "";
      u.push(m);
    }
  if (c.strip) for (; u[u.length - 1] === ""; ) --u.length;
  return c.blankrows === !1 && o ? null : u.join(f);
}
function Hs(e, t) {
  var r = [], n = t ?? {};
  if (e == null || e["!ref"] == null) return "";
  for (var a = Je(e["!ref"]), i = n.FS !== void 0 ? n.FS : ",", f = i.charCodeAt(0), s = n.RS !== void 0 ? n.RS : `
`, c = s.charCodeAt(0), o = "", u = [], m = n.skipHidden && e["!cols"] || [], x = n.skipHidden && e["!rows"] || [], l = a.s.c; l <= a.e.c; ++l) (m[l] || {}).hidden || (u[l] = He(l));
  for (var v = 0, p = a.s.r; p <= a.e.r; ++p)
    (x[p] || {}).hidden || (o = xp(e, a, p, u, f, c, i, v, n), o != null && (o || n.blankrows !== !1) && r.push((v++ ? s : "") + o));
  return r.join("");
}
function pp(e, t) {
  t || (t = {}), t.FS = "	", t.RS = `
`;
  var r = Hs(e, t);
  return r;
}
function mp(e, t) {
  var r = "", n, a = "";
  if (e == null || e["!ref"] == null) return [];
  var i = Je(e["!ref"]), f = "", s = [], c, o = [], u = e["!data"] != null;
  for (c = i.s.c; c <= i.e.c; ++c) s[c] = He(c);
  for (var m = i.s.r; m <= i.e.r; ++m)
    for (f = Ge(m), c = i.s.c; c <= i.e.c; ++c)
      if (r = s[c] + f, n = u ? (e["!data"][m] || [])[c] : e[r], a = "", n !== void 0) {
        if (n.F != null) {
          if (r = n.F, !n.f) continue;
          a = n.f, r.indexOf(":") == -1 && (r = r + ":" + r);
        }
        if (n.f != null) a = n.f;
        else {
          if (t && t.values === !1) continue;
          if (n.t == "z") continue;
          if (n.t == "n" && n.v != null) a = "" + n.v;
          else if (n.t == "b") a = n.v ? "TRUE" : "FALSE";
          else if (n.w !== void 0) a = "'" + n.w;
          else {
            if (n.v === void 0) continue;
            n.t == "s" ? a = "'" + n.v : a = "" + n.v;
          }
        }
        o[o.length] = r + "=" + a;
      }
  return o;
}
function Vs(e, t, r) {
  var n = r || {}, a = e ? e["!data"] != null : n.dense, i = +!n.skipHeader, f = e || {};
  !e && a && (f["!data"] = []);
  var s = 0, c = 0;
  if (f && n.origin != null)
    if (typeof n.origin == "number") s = n.origin;
    else {
      var o = typeof n.origin == "string" ? _r(n.origin) : n.origin;
      s = o.r, c = o.c;
    }
  var u = { s: { c: 0, r: 0 }, e: { c, r: s + t.length - 1 + i } };
  if (f["!ref"]) {
    var m = Je(f["!ref"]);
    u.e.c = Math.max(u.e.c, m.e.c), u.e.r = Math.max(u.e.r, m.e.r), s == -1 && (s = m.e.r + 1, u.e.r = s + t.length - 1 + i);
  } else
    s == -1 && (s = 0, u.e.r = t.length - 1 + i);
  var x = n.header || [], l = 0, v = [];
  t.forEach(function(d, h) {
    a && !f["!data"][s + h + i] && (f["!data"][s + h + i] = []), a && (v = f["!data"][s + h + i]), zr(d).forEach(function(_) {
      (l = x.indexOf(_)) == -1 && (x[l = x.length] = _);
      var g = d[_], E = "z", A = "", P = a ? "" : He(c + l) + Ge(s + h + i), S = a ? v[c + l] : f[P];
      g && typeof g == "object" && !(g instanceof Date) ? a ? v[c + l] = g : f[P] = g : (typeof g == "number" ? E = "n" : typeof g == "boolean" ? E = "b" : typeof g == "string" ? E = "s" : g instanceof Date ? (E = "d", n.UTC || (g = en(g)), n.cellDates || (E = "n", g = sr(g)), A = S != null && S.z && $r(S.z) ? S.z : n.dateNF || be[14]) : g === null && n.nullError && (E = "e", g = 0), S ? (S.t = E, S.v = g, delete S.w, delete S.R, A && (S.z = A)) : a ? v[c + l] = S = { t: E, v: g } : f[P] = S = { t: E, v: g }, A && (S.z = A));
    });
  }), u.e.c = Math.max(u.e.c, c + x.length - 1);
  var p = Ge(s);
  if (a && !f["!data"][s] && (f["!data"][s] = []), i) for (l = 0; l < x.length; ++l)
    a ? f["!data"][s][l + c] = { t: "s", v: x[l] } : f[He(l + c) + p] = { t: "s", v: x[l] };
  return f["!ref"] = Le(u), f;
}
function vp(e, t) {
  return Vs(null, e, t);
}
function pa(e, t, r) {
  if (typeof t == "string") {
    if (e["!data"] != null) {
      var n = _r(t);
      return e["!data"][n.r] || (e["!data"][n.r] = []), e["!data"][n.r][n.c] || (e["!data"][n.r][n.c] = { t: "z" });
    }
    return e[t] || (e[t] = { t: "z" });
  }
  return typeof t != "number" ? pa(e, We(t)) : pa(e, He(r || 0) + Ge(t));
}
function gp(e, t) {
  if (typeof t == "number") {
    if (t >= 0 && e.SheetNames.length > t) return t;
    throw new Error("Cannot find sheet # " + t);
  } else if (typeof t == "string") {
    var r = e.SheetNames.indexOf(t);
    if (r > -1) return r;
    throw new Error("Cannot find sheet name |" + t + "|");
  } else throw new Error("Cannot find sheet |" + t + "|");
}
function qn(e, t) {
  var r = { SheetNames: [], Sheets: {} };
  return e && Ea(r, e, t || "Sheet1"), r;
}
function Ea(e, t, r, n) {
  var a = 1;
  if (!r) for (; a <= 65535 && e.SheetNames.indexOf(r = "Sheet" + a) != -1; ++a, r = void 0) ;
  if (!r || e.SheetNames.length >= 65535) throw new Error("Too many worksheets");
  if (n && e.SheetNames.indexOf(r) >= 0 && r.length < 32) {
    var i = r.match(/\d+$/);
    a = i && +i[0] || 0;
    var f = i && r.slice(0, i.index) || r;
    for (++a; a <= 65535 && e.SheetNames.indexOf(r = f + a) != -1; ++a) ;
  }
  if (qd(r), e.SheetNames.indexOf(r) >= 0) throw new Error("Worksheet with name |" + r + "| already exists!");
  return e.SheetNames.push(r), e.Sheets[r] = t, r;
}
function _p(e, t, r) {
  e.Workbook || (e.Workbook = {}), e.Workbook.Sheets || (e.Workbook.Sheets = []);
  var n = gp(e, t);
  switch (e.Workbook.Sheets[n] || (e.Workbook.Sheets[n] = {}), r) {
    case 0:
    case 1:
    case 2:
      break;
    default:
      throw new Error("Bad sheet visibility setting " + r);
  }
  e.Workbook.Sheets[n].Hidden = r;
}
function wp(e, t) {
  return e.z = t, e;
}
function Gs(e, t, r) {
  return t ? (e.l = { Target: t }, r && (e.l.Tooltip = r)) : delete e.l, e;
}
function kp(e, t, r) {
  return Gs(e, "#" + t, r);
}
function Ep(e, t, r) {
  e.c || (e.c = []), e.c.push({ t, a: r || "SheetJS" });
}
function Tp(e, t, r, n) {
  for (var a = typeof t != "string" ? t : Je(t), i = typeof t == "string" ? t : Le(t), f = a.s.r; f <= a.e.r; ++f) for (var s = a.s.c; s <= a.e.c; ++s) {
    var c = pa(e, f, s);
    c.t = "n", c.F = i, delete c.v, f == a.s.r && s == a.s.c && (c.f = r, n && (c.D = !0));
  }
  var o = It(e["!ref"]);
  return o.s.r > a.s.r && (o.s.r = a.s.r), o.s.c > a.s.c && (o.s.c = a.s.c), o.e.r < a.e.r && (o.e.r = a.e.r), o.e.c < a.e.c && (o.e.c = a.e.c), e["!ref"] = Le(o), e;
}
var Xs = {
  encode_col: He,
  encode_row: Ge,
  encode_cell: We,
  encode_range: Le,
  decode_col: Hn,
  decode_row: Wn,
  split_cell: Pc,
  decode_cell: _r,
  decode_range: It,
  format_cell: ut,
  sheet_new: Lc,
  sheet_add_aoa: $0,
  sheet_add_json: Vs,
  sheet_add_dom: Ns,
  aoa_to_sheet: Vt,
  json_to_sheet: vp,
  table_to_sheet: Ps,
  table_to_book: Lx,
  sheet_to_csv: Hs,
  sheet_to_txt: pp,
  sheet_to_json: bn,
  sheet_to_html: Bx,
  sheet_to_formulae: mp,
  sheet_to_row_object_array: bn,
  sheet_get_cell: pa,
  book_new: qn,
  book_append_sheet: Ea,
  book_set_sheet_visibility: _p,
  cell_set_number_format: wp,
  cell_set_hyperlink: Gs,
  cell_set_internal_link: kp,
  cell_add_comment: Ep,
  sheet_set_array_formula: Tp,
  consts: {
    SHEET_VISIBLE: 0,
    SHEET_HIDDEN: 1,
    SHEET_VERY_HIDDEN: 2
  }
};
const yp = {
  "๐": "0",
  "๑": "1",
  "๒": "2",
  "๓": "3",
  "๔": "4",
  "๕": "5",
  "๖": "6",
  "๗": "7",
  "๘": "8",
  "๙": "9"
};
function Ap(e) {
  return String(e || "").normalize("NFKC").replace(/\u0E4D\u0E32/gu, "ำ").replace(/[๐-๙]/g, (t) => yp[t] || t).replace(/\r?\n+/g, "; ").replace(/[|；]+/g, "; ").replace(/[—–]/g, "-").replace(/ซ\s*ื\s*้\s*อ/g, "ซื้อ").replace(/ฟ\s*ร\s*ี/g, "ฟรี").replace(/ล\s*ด/g, "ลด").replace(/เปอร์เซ็นต์/gi, "%").replace(/\s+/g, " ").replace(/(?:;\s*){2,}/g, "; ").trim();
}
function Yr(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : null;
}
function Fp(e, t) {
  return Number((t / (e + t) * 100).toFixed(2));
}
function t0(e, t) {
  const r = JSON.stringify({
    type: t.type,
    minQuantity: t.minQuantity,
    maxQuantity: t.maxQuantity,
    discountPercent: t.discountPercent,
    freeQuantity: t.freeQuantity,
    purchaseUnit: t.purchaseUnit,
    rewardUnit: t.rewardUnit
  });
  e.some((n) => JSON.stringify({
    type: n.type,
    minQuantity: n.minQuantity,
    maxQuantity: n.maxQuantity,
    discountPercent: n.discountPercent,
    freeQuantity: n.freeQuantity,
    purchaseUnit: n.purchaseUnit,
    rewardUnit: n.rewardUnit
  }) === r) || e.push(t);
}
function Sp(e, t = "ชิ้น") {
  const r = Ap(e), n = [], a = [], i = "ขวด|ชิ้น|แพ็ค|แพค|กล่อง|ลัง|ซอง|ถุง|ชุด|ด้าม|piece|pcs?|pack|box", f = `(${i})`, s = `(?:\\s*\\(\\s*\\d+(?:\\.\\d+)?\\s*(?:${i})\\s*\\))?`, c = "(?:\\s*เท่านั้น)?", o = [
    {
      regex: new RegExp(`(?:เมื่อ\\s*)?(?:ซื้อ(?:ขั้นต่ำ)?|ขั้นต่ำ)\\s*(\\d+(?:\\.\\d+)?)\\s*${f}${s}${c}\\s*(?:แถม|ฟรี)\\s*(\\d+(?:\\.\\d+)?)\\s*${f}?`, "giu"),
      build: (m) => {
        const x = Yr(m[1]), l = Yr(m[3]);
        return !x || !l ? null : {
          tierNo: 0,
          type: "free_goods",
          minQuantity: x,
          maxQuantity: null,
          purchaseUnit: m[2] || t,
          discountPercent: null,
          freeQuantity: l,
          rewardUnit: m[4] || m[2] || t,
          bundlePrice: null,
          effectivePercent: Fp(x, l),
          effectivePercentUsage: "display_only",
          sourceText: m[0].trim()
        };
      }
    },
    {
      regex: new RegExp(`(?:ซื้อ|ขั้นต่ำ)?\\s*(\\d+(?:\\.\\d+)?)\\s*-\\s*(\\d+(?:\\.\\d+)?)\\s*${f}${s}${c}\\s*ลด\\s*(\\d+(?:\\.\\d+)?)\\s*%`, "giu"),
      build: (m) => {
        const x = Yr(m[1]), l = Yr(m[2]), v = Yr(m[4]);
        return !x || !l || !v || l < x || v > 100 ? null : {
          tierNo: 0,
          type: "cash_discount",
          minQuantity: x,
          maxQuantity: l,
          purchaseUnit: m[3] || t,
          discountPercent: v,
          freeQuantity: 0,
          rewardUnit: null,
          bundlePrice: null,
          effectivePercent: null,
          effectivePercentUsage: null,
          sourceText: m[0].trim()
        };
      }
    },
    {
      regex: new RegExp(`(?:(?:เมื่อ\\s*)?(?:ซื้อ(?:ขั้นต่ำ)?|ขั้นต่ำ)\\s*)?(\\d+(?:\\.\\d+)?)\\s*${f}${s}${c}\\s*ลด\\s*(\\d+(?:\\.\\d+)?)\\s*%`, "giu"),
      build: (m) => {
        const x = Yr(m[1]), l = Yr(m[3]);
        return !x || !l || l > 100 ? null : {
          tierNo: 0,
          type: "cash_discount",
          minQuantity: x,
          maxQuantity: null,
          purchaseUnit: m[2] || t,
          discountPercent: l,
          freeQuantity: 0,
          rewardUnit: null,
          bundlePrice: null,
          effectivePercent: null,
          effectivePercentUsage: null,
          sourceText: m[0].trim()
        };
      }
    },
    {
      regex: new RegExp(`(?:ซื้อ\\s*)?(\\d+(?:\\.\\d+)?)\\s*${f}${s}\\s*(?:ในราคา|ราคา)\\s*(\\d+(?:\\.\\d+)?)\\s*บาท`, "giu"),
      build: (m) => {
        const x = Yr(m[1]), l = Yr(m[3]);
        return !x || !l ? null : {
          tierNo: 0,
          type: "bundle_price",
          minQuantity: x,
          maxQuantity: null,
          purchaseUnit: m[2] || t,
          discountPercent: null,
          freeQuantity: 0,
          rewardUnit: null,
          bundlePrice: { amount: l, currency: "THB" },
          effectivePercent: null,
          effectivePercentUsage: null,
          sourceText: m[0].trim()
        };
      }
    }
  ];
  for (const m of o)
    for (const x of r.matchAll(m.regex)) {
      const l = x.index ?? 0, v = l + x[0].length;
      if (a.some((d) => l < d.end && v > d.start)) continue;
      const p = m.build(x);
      p && (t0(n, p), a.push({ start: l, end: v }));
    }
  if (!n.length) {
    const m = [...r.matchAll(/(?:^|;\s*)ลด\s*(\d+(?:\.\d+)?)\s*%/giu)];
    for (const x of m) {
      const l = Yr(x[1]);
      !l || l > 100 || t0(n, {
        tierNo: 0,
        type: "cash_discount",
        minQuantity: 1,
        maxQuantity: null,
        purchaseUnit: t,
        discountPercent: l,
        freeQuantity: 0,
        rewardUnit: null,
        bundlePrice: null,
        effectivePercent: null,
        effectivePercentUsage: null,
        sourceText: x[0].replace(/^;\s*/, "").trim()
      });
    }
  }
  n.sort((m, x) => m.minQuantity - x.minQuantity || (m.maxQuantity ?? Number.MAX_SAFE_INTEGER) - (x.maxQuantity ?? Number.MAX_SAFE_INTEGER)), n.forEach((m, x) => {
    m.tierNo = x + 1;
  });
  const u = [];
  return r || u.push("promotion_text_missing"), r && !n.length && u.push("promotion_tiers_unparsed"), { tiers: n, failureReasons: u, normalizedText: r };
}
function $s(e) {
  const n = String(e || "").toUpperCase().replace(/[,+&]/g, "/").split("/").map((a) => a.trim()).filter(Boolean).map((a) => ff(a)).filter((a) => !!a);
  return [...new Set(n)];
}
var kn = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
var a0;
function Cp() {
  return a0 || (a0 = 1, (function(e, t) {
    (function(r) {
      e.exports = r();
    })(function() {
      return (function r(n, a, i) {
        function f(o, u) {
          if (!a[o]) {
            if (!n[o]) {
              var m = typeof Ca == "function" && Ca;
              if (!u && m) return m(o, !0);
              if (s) return s(o, !0);
              var x = new Error("Cannot find module '" + o + "'");
              throw x.code = "MODULE_NOT_FOUND", x;
            }
            var l = a[o] = { exports: {} };
            n[o][0].call(l.exports, function(v) {
              var p = n[o][1][v];
              return f(p || v);
            }, l, l.exports, r, n, a, i);
          }
          return a[o].exports;
        }
        for (var s = typeof Ca == "function" && Ca, c = 0; c < i.length; c++) f(i[c]);
        return f;
      })({ 1: [function(r, n, a) {
        var i = r("./utils"), f = r("./support"), s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        a.encode = function(c) {
          for (var o, u, m, x, l, v, p, d = [], h = 0, _ = c.length, g = _, E = i.getTypeOf(c) !== "string"; h < c.length; ) g = _ - h, m = E ? (o = c[h++], u = h < _ ? c[h++] : 0, h < _ ? c[h++] : 0) : (o = c.charCodeAt(h++), u = h < _ ? c.charCodeAt(h++) : 0, h < _ ? c.charCodeAt(h++) : 0), x = o >> 2, l = (3 & o) << 4 | u >> 4, v = 1 < g ? (15 & u) << 2 | m >> 6 : 64, p = 2 < g ? 63 & m : 64, d.push(s.charAt(x) + s.charAt(l) + s.charAt(v) + s.charAt(p));
          return d.join("");
        }, a.decode = function(c) {
          var o, u, m, x, l, v, p = 0, d = 0, h = "data:";
          if (c.substr(0, h.length) === h) throw new Error("Invalid base64 input, it looks like a data url.");
          var _, g = 3 * (c = c.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (c.charAt(c.length - 1) === s.charAt(64) && g--, c.charAt(c.length - 2) === s.charAt(64) && g--, g % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (_ = f.uint8array ? new Uint8Array(0 | g) : new Array(0 | g); p < c.length; ) o = s.indexOf(c.charAt(p++)) << 2 | (x = s.indexOf(c.charAt(p++))) >> 4, u = (15 & x) << 4 | (l = s.indexOf(c.charAt(p++))) >> 2, m = (3 & l) << 6 | (v = s.indexOf(c.charAt(p++))), _[d++] = o, l !== 64 && (_[d++] = u), v !== 64 && (_[d++] = m);
          return _;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(r, n, a) {
        var i = r("./external"), f = r("./stream/DataWorker"), s = r("./stream/Crc32Probe"), c = r("./stream/DataLengthProbe");
        function o(u, m, x, l, v) {
          this.compressedSize = u, this.uncompressedSize = m, this.crc32 = x, this.compression = l, this.compressedContent = v;
        }
        o.prototype = { getContentWorker: function() {
          var u = new f(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new c("data_length")), m = this;
          return u.on("end", function() {
            if (this.streamInfo.data_length !== m.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), u;
        }, getCompressedWorker: function() {
          return new f(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, o.createWorkerFrom = function(u, m, x) {
          return u.pipe(new s()).pipe(new c("uncompressedSize")).pipe(m.compressWorker(x)).pipe(new c("compressedSize")).withStreamInfo("compression", m);
        }, n.exports = o;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(r, n, a) {
        var i = r("./stream/GenericWorker");
        a.STORE = { magic: "\0\0", compressWorker: function() {
          return new i("STORE compression");
        }, uncompressWorker: function() {
          return new i("STORE decompression");
        } }, a.DEFLATE = r("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(r, n, a) {
        var i = r("./utils"), f = (function() {
          for (var s, c = [], o = 0; o < 256; o++) {
            s = o;
            for (var u = 0; u < 8; u++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
            c[o] = s;
          }
          return c;
        })();
        n.exports = function(s, c) {
          return s !== void 0 && s.length ? i.getTypeOf(s) !== "string" ? (function(o, u, m, x) {
            var l = f, v = x + m;
            o ^= -1;
            for (var p = x; p < v; p++) o = o >>> 8 ^ l[255 & (o ^ u[p])];
            return -1 ^ o;
          })(0 | c, s, s.length, 0) : (function(o, u, m, x) {
            var l = f, v = x + m;
            o ^= -1;
            for (var p = x; p < v; p++) o = o >>> 8 ^ l[255 & (o ^ u.charCodeAt(p))];
            return -1 ^ o;
          })(0 | c, s, s.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(r, n, a) {
        a.base64 = !1, a.binary = !1, a.dir = !1, a.createFolders = !0, a.date = null, a.compression = null, a.compressionOptions = null, a.comment = null, a.unixPermissions = null, a.dosPermissions = null;
      }, {}], 6: [function(r, n, a) {
        var i = null;
        i = typeof Promise < "u" ? Promise : r("lie"), n.exports = { Promise: i };
      }, { lie: 37 }], 7: [function(r, n, a) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", f = r("pako"), s = r("./utils"), c = r("./stream/GenericWorker"), o = i ? "uint8array" : "array";
        function u(m, x) {
          c.call(this, "FlateWorker/" + m), this._pako = null, this._pakoAction = m, this._pakoOptions = x, this.meta = {};
        }
        a.magic = "\b\0", s.inherits(u, c), u.prototype.processChunk = function(m) {
          this.meta = m.meta, this._pako === null && this._createPako(), this._pako.push(s.transformTo(o, m.data), !1);
        }, u.prototype.flush = function() {
          c.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, u.prototype.cleanUp = function() {
          c.prototype.cleanUp.call(this), this._pako = null;
        }, u.prototype._createPako = function() {
          this._pako = new f[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var m = this;
          this._pako.onData = function(x) {
            m.push({ data: x, meta: m.meta });
          };
        }, a.compressWorker = function(m) {
          return new u("Deflate", m);
        }, a.uncompressWorker = function() {
          return new u("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(r, n, a) {
        function i(l, v) {
          var p, d = "";
          for (p = 0; p < v; p++) d += String.fromCharCode(255 & l), l >>>= 8;
          return d;
        }
        function f(l, v, p, d, h, _) {
          var g, E, A = l.file, P = l.compression, S = _ !== o.utf8encode, R = s.transformTo("string", _(A.name)), F = s.transformTo("string", o.utf8encode(A.name)), U = A.comment, H = s.transformTo("string", _(U)), y = s.transformTo("string", o.utf8encode(U)), W = F.length !== A.name.length, k = y.length !== U.length, j = "", me = "", Z = "", xe = A.dir, fe = A.date, q = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          v && !p || (q.crc32 = l.crc32, q.compressedSize = l.compressedSize, q.uncompressedSize = l.uncompressedSize);
          var J = 0;
          v && (J |= 8), S || !W && !k || (J |= 2048);
          var Y = 0, pe = 0;
          xe && (Y |= 16), h === "UNIX" ? (pe = 798, Y |= (function(de, Te) {
            var Ce = de;
            return de || (Ce = Te ? 16893 : 33204), (65535 & Ce) << 16;
          })(A.unixPermissions, xe)) : (pe = 20, Y |= (function(de) {
            return 63 & (de || 0);
          })(A.dosPermissions)), g = fe.getUTCHours(), g <<= 6, g |= fe.getUTCMinutes(), g <<= 5, g |= fe.getUTCSeconds() / 2, E = fe.getUTCFullYear() - 1980, E <<= 4, E |= fe.getUTCMonth() + 1, E <<= 5, E |= fe.getUTCDate(), W && (me = i(1, 1) + i(u(R), 4) + F, j += "up" + i(me.length, 2) + me), k && (Z = i(1, 1) + i(u(H), 4) + y, j += "uc" + i(Z.length, 2) + Z);
          var ce = "";
          return ce += `
\0`, ce += i(J, 2), ce += P.magic, ce += i(g, 2), ce += i(E, 2), ce += i(q.crc32, 4), ce += i(q.compressedSize, 4), ce += i(q.uncompressedSize, 4), ce += i(R.length, 2), ce += i(j.length, 2), { fileRecord: m.LOCAL_FILE_HEADER + ce + R + j, dirRecord: m.CENTRAL_FILE_HEADER + i(pe, 2) + ce + i(H.length, 2) + "\0\0\0\0" + i(Y, 4) + i(d, 4) + R + j + H };
        }
        var s = r("../utils"), c = r("../stream/GenericWorker"), o = r("../utf8"), u = r("../crc32"), m = r("../signature");
        function x(l, v, p, d) {
          c.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = v, this.zipPlatform = p, this.encodeFileName = d, this.streamFiles = l, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        s.inherits(x, c), x.prototype.push = function(l) {
          var v = l.meta.percent || 0, p = this.entriesCount, d = this._sources.length;
          this.accumulate ? this.contentBuffer.push(l) : (this.bytesWritten += l.data.length, c.prototype.push.call(this, { data: l.data, meta: { currentFile: this.currentFile, percent: p ? (v + 100 * (p - d - 1)) / p : 100 } }));
        }, x.prototype.openedSource = function(l) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = l.file.name;
          var v = this.streamFiles && !l.file.dir;
          if (v) {
            var p = f(l, v, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: p.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, x.prototype.closedSource = function(l) {
          this.accumulate = !1;
          var v = this.streamFiles && !l.file.dir, p = f(l, v, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(p.dirRecord), v) this.push({ data: (function(d) {
            return m.DATA_DESCRIPTOR + i(d.crc32, 4) + i(d.compressedSize, 4) + i(d.uncompressedSize, 4);
          })(l), meta: { percent: 100 } });
          else for (this.push({ data: p.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, x.prototype.flush = function() {
          for (var l = this.bytesWritten, v = 0; v < this.dirRecords.length; v++) this.push({ data: this.dirRecords[v], meta: { percent: 100 } });
          var p = this.bytesWritten - l, d = (function(h, _, g, E, A) {
            var P = s.transformTo("string", A(E));
            return m.CENTRAL_DIRECTORY_END + "\0\0\0\0" + i(h, 2) + i(h, 2) + i(_, 4) + i(g, 4) + i(P.length, 2) + P;
          })(this.dirRecords.length, p, l, this.zipComment, this.encodeFileName);
          this.push({ data: d, meta: { percent: 100 } });
        }, x.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, x.prototype.registerPrevious = function(l) {
          this._sources.push(l);
          var v = this;
          return l.on("data", function(p) {
            v.processChunk(p);
          }), l.on("end", function() {
            v.closedSource(v.previous.streamInfo), v._sources.length ? v.prepareNextSource() : v.end();
          }), l.on("error", function(p) {
            v.error(p);
          }), this;
        }, x.prototype.resume = function() {
          return !!c.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, x.prototype.error = function(l) {
          var v = this._sources;
          if (!c.prototype.error.call(this, l)) return !1;
          for (var p = 0; p < v.length; p++) try {
            v[p].error(l);
          } catch {
          }
          return !0;
        }, x.prototype.lock = function() {
          c.prototype.lock.call(this);
          for (var l = this._sources, v = 0; v < l.length; v++) l[v].lock();
        }, n.exports = x;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(r, n, a) {
        var i = r("../compressions"), f = r("./ZipFileWorker");
        a.generateWorker = function(s, c, o) {
          var u = new f(c.streamFiles, o, c.platform, c.encodeFileName), m = 0;
          try {
            s.forEach(function(x, l) {
              m++;
              var v = (function(_, g) {
                var E = _ || g, A = i[E];
                if (!A) throw new Error(E + " is not a valid compression method !");
                return A;
              })(l.options.compression, c.compression), p = l.options.compressionOptions || c.compressionOptions || {}, d = l.dir, h = l.date;
              l._compressWorker(v, p).withStreamInfo("file", { name: x, dir: d, date: h, comment: l.comment || "", unixPermissions: l.unixPermissions, dosPermissions: l.dosPermissions }).pipe(u);
            }), u.entriesCount = m;
          } catch (x) {
            u.error(x);
          }
          return u;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(r, n, a) {
        function i() {
          if (!(this instanceof i)) return new i();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var f = new i();
            for (var s in this) typeof this[s] != "function" && (f[s] = this[s]);
            return f;
          };
        }
        (i.prototype = r("./object")).loadAsync = r("./load"), i.support = r("./support"), i.defaults = r("./defaults"), i.version = "3.10.1", i.loadAsync = function(f, s) {
          return new i().loadAsync(f, s);
        }, i.external = r("./external"), n.exports = i;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(r, n, a) {
        var i = r("./utils"), f = r("./external"), s = r("./utf8"), c = r("./zipEntries"), o = r("./stream/Crc32Probe"), u = r("./nodejsUtils");
        function m(x) {
          return new f.Promise(function(l, v) {
            var p = x.decompressed.getContentWorker().pipe(new o());
            p.on("error", function(d) {
              v(d);
            }).on("end", function() {
              p.streamInfo.crc32 !== x.decompressed.crc32 ? v(new Error("Corrupted zip : CRC32 mismatch")) : l();
            }).resume();
          });
        }
        n.exports = function(x, l) {
          var v = this;
          return l = i.extend(l || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: s.utf8decode }), u.isNode && u.isStream(x) ? f.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : i.prepareContent("the loaded zip file", x, !0, l.optimizedBinaryString, l.base64).then(function(p) {
            var d = new c(l);
            return d.load(p), d;
          }).then(function(p) {
            var d = [f.Promise.resolve(p)], h = p.files;
            if (l.checkCRC32) for (var _ = 0; _ < h.length; _++) d.push(m(h[_]));
            return f.Promise.all(d);
          }).then(function(p) {
            for (var d = p.shift(), h = d.files, _ = 0; _ < h.length; _++) {
              var g = h[_], E = g.fileNameStr, A = i.resolve(g.fileNameStr);
              v.file(A, g.decompressed, { binary: !0, optimizedBinaryString: !0, date: g.date, dir: g.dir, comment: g.fileCommentStr.length ? g.fileCommentStr : null, unixPermissions: g.unixPermissions, dosPermissions: g.dosPermissions, createFolders: l.createFolders }), g.dir || (v.file(A).unsafeOriginalName = E);
            }
            return d.zipComment.length && (v.comment = d.zipComment), v;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(r, n, a) {
        var i = r("../utils"), f = r("../stream/GenericWorker");
        function s(c, o) {
          f.call(this, "Nodejs stream input adapter for " + c), this._upstreamEnded = !1, this._bindStream(o);
        }
        i.inherits(s, f), s.prototype._bindStream = function(c) {
          var o = this;
          (this._stream = c).pause(), c.on("data", function(u) {
            o.push({ data: u, meta: { percent: 0 } });
          }).on("error", function(u) {
            o.isPaused ? this.generatedError = u : o.error(u);
          }).on("end", function() {
            o.isPaused ? o._upstreamEnded = !0 : o.end();
          });
        }, s.prototype.pause = function() {
          return !!f.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, s.prototype.resume = function() {
          return !!f.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, n.exports = s;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(r, n, a) {
        var i = r("readable-stream").Readable;
        function f(s, c, o) {
          i.call(this, c), this._helper = s;
          var u = this;
          s.on("data", function(m, x) {
            u.push(m) || u._helper.pause(), o && o(x);
          }).on("error", function(m) {
            u.emit("error", m);
          }).on("end", function() {
            u.push(null);
          });
        }
        r("../utils").inherits(f, i), f.prototype._read = function() {
          this._helper.resume();
        }, n.exports = f;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(r, n, a) {
        n.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(i, f) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(i, f);
          if (typeof i == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(i, f);
        }, allocBuffer: function(i) {
          if (Buffer.alloc) return Buffer.alloc(i);
          var f = new Buffer(i);
          return f.fill(0), f;
        }, isBuffer: function(i) {
          return Buffer.isBuffer(i);
        }, isStream: function(i) {
          return i && typeof i.on == "function" && typeof i.pause == "function" && typeof i.resume == "function";
        } };
      }, {}], 15: [function(r, n, a) {
        function i(A, P, S) {
          var R, F = s.getTypeOf(P), U = s.extend(S || {}, u);
          U.date = U.date || /* @__PURE__ */ new Date(), U.compression !== null && (U.compression = U.compression.toUpperCase()), typeof U.unixPermissions == "string" && (U.unixPermissions = parseInt(U.unixPermissions, 8)), U.unixPermissions && 16384 & U.unixPermissions && (U.dir = !0), U.dosPermissions && 16 & U.dosPermissions && (U.dir = !0), U.dir && (A = h(A)), U.createFolders && (R = d(A)) && _.call(this, R, !0);
          var H = F === "string" && U.binary === !1 && U.base64 === !1;
          S && S.binary !== void 0 || (U.binary = !H), (P instanceof m && P.uncompressedSize === 0 || U.dir || !P || P.length === 0) && (U.base64 = !1, U.binary = !0, P = "", U.compression = "STORE", F = "string");
          var y = null;
          y = P instanceof m || P instanceof c ? P : v.isNode && v.isStream(P) ? new p(A, P) : s.prepareContent(A, P, U.binary, U.optimizedBinaryString, U.base64);
          var W = new x(A, y, U);
          this.files[A] = W;
        }
        var f = r("./utf8"), s = r("./utils"), c = r("./stream/GenericWorker"), o = r("./stream/StreamHelper"), u = r("./defaults"), m = r("./compressedObject"), x = r("./zipObject"), l = r("./generate"), v = r("./nodejsUtils"), p = r("./nodejs/NodejsStreamInputAdapter"), d = function(A) {
          A.slice(-1) === "/" && (A = A.substring(0, A.length - 1));
          var P = A.lastIndexOf("/");
          return 0 < P ? A.substring(0, P) : "";
        }, h = function(A) {
          return A.slice(-1) !== "/" && (A += "/"), A;
        }, _ = function(A, P) {
          return P = P !== void 0 ? P : u.createFolders, A = h(A), this.files[A] || i.call(this, A, null, { dir: !0, createFolders: P }), this.files[A];
        };
        function g(A) {
          return Object.prototype.toString.call(A) === "[object RegExp]";
        }
        var E = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(A) {
          var P, S, R;
          for (P in this.files) R = this.files[P], (S = P.slice(this.root.length, P.length)) && P.slice(0, this.root.length) === this.root && A(S, R);
        }, filter: function(A) {
          var P = [];
          return this.forEach(function(S, R) {
            A(S, R) && P.push(R);
          }), P;
        }, file: function(A, P, S) {
          if (arguments.length !== 1) return A = this.root + A, i.call(this, A, P, S), this;
          if (g(A)) {
            var R = A;
            return this.filter(function(U, H) {
              return !H.dir && R.test(U);
            });
          }
          var F = this.files[this.root + A];
          return F && !F.dir ? F : null;
        }, folder: function(A) {
          if (!A) return this;
          if (g(A)) return this.filter(function(F, U) {
            return U.dir && A.test(F);
          });
          var P = this.root + A, S = _.call(this, P), R = this.clone();
          return R.root = S.name, R;
        }, remove: function(A) {
          A = this.root + A;
          var P = this.files[A];
          if (P || (A.slice(-1) !== "/" && (A += "/"), P = this.files[A]), P && !P.dir) delete this.files[A];
          else for (var S = this.filter(function(F, U) {
            return U.name.slice(0, A.length) === A;
          }), R = 0; R < S.length; R++) delete this.files[S[R].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(A) {
          var P, S = {};
          try {
            if ((S = s.extend(A || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: f.utf8encode })).type = S.type.toLowerCase(), S.compression = S.compression.toUpperCase(), S.type === "binarystring" && (S.type = "string"), !S.type) throw new Error("No output type specified.");
            s.checkSupport(S.type), S.platform !== "darwin" && S.platform !== "freebsd" && S.platform !== "linux" && S.platform !== "sunos" || (S.platform = "UNIX"), S.platform === "win32" && (S.platform = "DOS");
            var R = S.comment || this.comment || "";
            P = l.generateWorker(this, S, R);
          } catch (F) {
            (P = new c("error")).error(F);
          }
          return new o(P, S.type || "string", S.mimeType);
        }, generateAsync: function(A, P) {
          return this.generateInternalStream(A).accumulate(P);
        }, generateNodeStream: function(A, P) {
          return (A = A || {}).type || (A.type = "nodebuffer"), this.generateInternalStream(A).toNodejsStream(P);
        } };
        n.exports = E;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(r, n, a) {
        n.exports = r("stream");
      }, { stream: void 0 }], 17: [function(r, n, a) {
        var i = r("./DataReader");
        function f(s) {
          i.call(this, s);
          for (var c = 0; c < this.data.length; c++) s[c] = 255 & s[c];
        }
        r("../utils").inherits(f, i), f.prototype.byteAt = function(s) {
          return this.data[this.zero + s];
        }, f.prototype.lastIndexOfSignature = function(s) {
          for (var c = s.charCodeAt(0), o = s.charCodeAt(1), u = s.charCodeAt(2), m = s.charCodeAt(3), x = this.length - 4; 0 <= x; --x) if (this.data[x] === c && this.data[x + 1] === o && this.data[x + 2] === u && this.data[x + 3] === m) return x - this.zero;
          return -1;
        }, f.prototype.readAndCheckSignature = function(s) {
          var c = s.charCodeAt(0), o = s.charCodeAt(1), u = s.charCodeAt(2), m = s.charCodeAt(3), x = this.readData(4);
          return c === x[0] && o === x[1] && u === x[2] && m === x[3];
        }, f.prototype.readData = function(s) {
          if (this.checkOffset(s), s === 0) return [];
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, c;
        }, n.exports = f;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(r, n, a) {
        var i = r("../utils");
        function f(s) {
          this.data = s, this.length = s.length, this.index = 0, this.zero = 0;
        }
        f.prototype = { checkOffset: function(s) {
          this.checkIndex(this.index + s);
        }, checkIndex: function(s) {
          if (this.length < this.zero + s || s < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + s + "). Corrupted zip ?");
        }, setIndex: function(s) {
          this.checkIndex(s), this.index = s;
        }, skip: function(s) {
          this.setIndex(this.index + s);
        }, byteAt: function() {
        }, readInt: function(s) {
          var c, o = 0;
          for (this.checkOffset(s), c = this.index + s - 1; c >= this.index; c--) o = (o << 8) + this.byteAt(c);
          return this.index += s, o;
        }, readString: function(s) {
          return i.transformTo("string", this.readData(s));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var s = this.readInt(4);
          return new Date(Date.UTC(1980 + (s >> 25 & 127), (s >> 21 & 15) - 1, s >> 16 & 31, s >> 11 & 31, s >> 5 & 63, (31 & s) << 1));
        } }, n.exports = f;
      }, { "../utils": 32 }], 19: [function(r, n, a) {
        var i = r("./Uint8ArrayReader");
        function f(s) {
          i.call(this, s);
        }
        r("../utils").inherits(f, i), f.prototype.readData = function(s) {
          this.checkOffset(s);
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, c;
        }, n.exports = f;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(r, n, a) {
        var i = r("./DataReader");
        function f(s) {
          i.call(this, s);
        }
        r("../utils").inherits(f, i), f.prototype.byteAt = function(s) {
          return this.data.charCodeAt(this.zero + s);
        }, f.prototype.lastIndexOfSignature = function(s) {
          return this.data.lastIndexOf(s) - this.zero;
        }, f.prototype.readAndCheckSignature = function(s) {
          return s === this.readData(4);
        }, f.prototype.readData = function(s) {
          this.checkOffset(s);
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, c;
        }, n.exports = f;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(r, n, a) {
        var i = r("./ArrayReader");
        function f(s) {
          i.call(this, s);
        }
        r("../utils").inherits(f, i), f.prototype.readData = function(s) {
          if (this.checkOffset(s), s === 0) return new Uint8Array(0);
          var c = this.data.subarray(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, c;
        }, n.exports = f;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(r, n, a) {
        var i = r("../utils"), f = r("../support"), s = r("./ArrayReader"), c = r("./StringReader"), o = r("./NodeBufferReader"), u = r("./Uint8ArrayReader");
        n.exports = function(m) {
          var x = i.getTypeOf(m);
          return i.checkSupport(x), x !== "string" || f.uint8array ? x === "nodebuffer" ? new o(m) : f.uint8array ? new u(i.transformTo("uint8array", m)) : new s(i.transformTo("array", m)) : new c(m);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(r, n, a) {
        a.LOCAL_FILE_HEADER = "PK", a.CENTRAL_FILE_HEADER = "PK", a.CENTRAL_DIRECTORY_END = "PK", a.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", a.ZIP64_CENTRAL_DIRECTORY_END = "PK", a.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(r, n, a) {
        var i = r("./GenericWorker"), f = r("../utils");
        function s(c) {
          i.call(this, "ConvertWorker to " + c), this.destType = c;
        }
        f.inherits(s, i), s.prototype.processChunk = function(c) {
          this.push({ data: f.transformTo(this.destType, c.data), meta: c.meta });
        }, n.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(r, n, a) {
        var i = r("./GenericWorker"), f = r("../crc32");
        function s() {
          i.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        r("../utils").inherits(s, i), s.prototype.processChunk = function(c) {
          this.streamInfo.crc32 = f(c.data, this.streamInfo.crc32 || 0), this.push(c);
        }, n.exports = s;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(r, n, a) {
        var i = r("../utils"), f = r("./GenericWorker");
        function s(c) {
          f.call(this, "DataLengthProbe for " + c), this.propName = c, this.withStreamInfo(c, 0);
        }
        i.inherits(s, f), s.prototype.processChunk = function(c) {
          if (c) {
            var o = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = o + c.data.length;
          }
          f.prototype.processChunk.call(this, c);
        }, n.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(r, n, a) {
        var i = r("../utils"), f = r("./GenericWorker");
        function s(c) {
          f.call(this, "DataWorker");
          var o = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, c.then(function(u) {
            o.dataIsReady = !0, o.data = u, o.max = u && u.length || 0, o.type = i.getTypeOf(u), o.isPaused || o._tickAndRepeat();
          }, function(u) {
            o.error(u);
          });
        }
        i.inherits(s, f), s.prototype.cleanUp = function() {
          f.prototype.cleanUp.call(this), this.data = null;
        }, s.prototype.resume = function() {
          return !!f.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, i.delay(this._tickAndRepeat, [], this)), !0);
        }, s.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (i.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, s.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var c = null, o = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              c = this.data.substring(this.index, o);
              break;
            case "uint8array":
              c = this.data.subarray(this.index, o);
              break;
            case "array":
            case "nodebuffer":
              c = this.data.slice(this.index, o);
          }
          return this.index = o, this.push({ data: c, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, n.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(r, n, a) {
        function i(f) {
          this.name = f || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        i.prototype = { push: function(f) {
          this.emit("data", f);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (f) {
            this.emit("error", f);
          }
          return !0;
        }, error: function(f) {
          return !this.isFinished && (this.isPaused ? this.generatedError = f : (this.isFinished = !0, this.emit("error", f), this.previous && this.previous.error(f), this.cleanUp()), !0);
        }, on: function(f, s) {
          return this._listeners[f].push(s), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(f, s) {
          if (this._listeners[f]) for (var c = 0; c < this._listeners[f].length; c++) this._listeners[f][c].call(this, s);
        }, pipe: function(f) {
          return f.registerPrevious(this);
        }, registerPrevious: function(f) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = f.streamInfo, this.mergeStreamInfo(), this.previous = f;
          var s = this;
          return f.on("data", function(c) {
            s.processChunk(c);
          }), f.on("end", function() {
            s.end();
          }), f.on("error", function(c) {
            s.error(c);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var f = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), f = !0), this.previous && this.previous.resume(), !f;
        }, flush: function() {
        }, processChunk: function(f) {
          this.push(f);
        }, withStreamInfo: function(f, s) {
          return this.extraStreamInfo[f] = s, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var f in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, f) && (this.streamInfo[f] = this.extraStreamInfo[f]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var f = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + f : f;
        } }, n.exports = i;
      }, {}], 29: [function(r, n, a) {
        var i = r("../utils"), f = r("./ConvertWorker"), s = r("./GenericWorker"), c = r("../base64"), o = r("../support"), u = r("../external"), m = null;
        if (o.nodestream) try {
          m = r("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function x(v, p) {
          return new u.Promise(function(d, h) {
            var _ = [], g = v._internalType, E = v._outputType, A = v._mimeType;
            v.on("data", function(P, S) {
              _.push(P), p && p(S);
            }).on("error", function(P) {
              _ = [], h(P);
            }).on("end", function() {
              try {
                var P = (function(S, R, F) {
                  switch (S) {
                    case "blob":
                      return i.newBlob(i.transformTo("arraybuffer", R), F);
                    case "base64":
                      return c.encode(R);
                    default:
                      return i.transformTo(S, R);
                  }
                })(E, (function(S, R) {
                  var F, U = 0, H = null, y = 0;
                  for (F = 0; F < R.length; F++) y += R[F].length;
                  switch (S) {
                    case "string":
                      return R.join("");
                    case "array":
                      return Array.prototype.concat.apply([], R);
                    case "uint8array":
                      for (H = new Uint8Array(y), F = 0; F < R.length; F++) H.set(R[F], U), U += R[F].length;
                      return H;
                    case "nodebuffer":
                      return Buffer.concat(R);
                    default:
                      throw new Error("concat : unsupported type '" + S + "'");
                  }
                })(g, _), A);
                d(P);
              } catch (S) {
                h(S);
              }
              _ = [];
            }).resume();
          });
        }
        function l(v, p, d) {
          var h = p;
          switch (p) {
            case "blob":
            case "arraybuffer":
              h = "uint8array";
              break;
            case "base64":
              h = "string";
          }
          try {
            this._internalType = h, this._outputType = p, this._mimeType = d, i.checkSupport(h), this._worker = v.pipe(new f(h)), v.lock();
          } catch (_) {
            this._worker = new s("error"), this._worker.error(_);
          }
        }
        l.prototype = { accumulate: function(v) {
          return x(this, v);
        }, on: function(v, p) {
          var d = this;
          return v === "data" ? this._worker.on(v, function(h) {
            p.call(d, h.data, h.meta);
          }) : this._worker.on(v, function() {
            i.delay(p, arguments, d);
          }), this;
        }, resume: function() {
          return i.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(v) {
          if (i.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new m(this, { objectMode: this._outputType !== "nodebuffer" }, v);
        } }, n.exports = l;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(r, n, a) {
        if (a.base64 = !0, a.array = !0, a.string = !0, a.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", a.nodebuffer = typeof Buffer < "u", a.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") a.blob = !1;
        else {
          var i = new ArrayBuffer(0);
          try {
            a.blob = new Blob([i], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var f = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              f.append(i), a.blob = f.getBlob("application/zip").size === 0;
            } catch {
              a.blob = !1;
            }
          }
        }
        try {
          a.nodestream = !!r("readable-stream").Readable;
        } catch {
          a.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(r, n, a) {
        for (var i = r("./utils"), f = r("./support"), s = r("./nodejsUtils"), c = r("./stream/GenericWorker"), o = new Array(256), u = 0; u < 256; u++) o[u] = 252 <= u ? 6 : 248 <= u ? 5 : 240 <= u ? 4 : 224 <= u ? 3 : 192 <= u ? 2 : 1;
        o[254] = o[254] = 1;
        function m() {
          c.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function x() {
          c.call(this, "utf-8 encode");
        }
        a.utf8encode = function(l) {
          return f.nodebuffer ? s.newBufferFrom(l, "utf-8") : (function(v) {
            var p, d, h, _, g, E = v.length, A = 0;
            for (_ = 0; _ < E; _++) (64512 & (d = v.charCodeAt(_))) == 55296 && _ + 1 < E && (64512 & (h = v.charCodeAt(_ + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (h - 56320), _++), A += d < 128 ? 1 : d < 2048 ? 2 : d < 65536 ? 3 : 4;
            for (p = f.uint8array ? new Uint8Array(A) : new Array(A), _ = g = 0; g < A; _++) (64512 & (d = v.charCodeAt(_))) == 55296 && _ + 1 < E && (64512 & (h = v.charCodeAt(_ + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (h - 56320), _++), d < 128 ? p[g++] = d : (d < 2048 ? p[g++] = 192 | d >>> 6 : (d < 65536 ? p[g++] = 224 | d >>> 12 : (p[g++] = 240 | d >>> 18, p[g++] = 128 | d >>> 12 & 63), p[g++] = 128 | d >>> 6 & 63), p[g++] = 128 | 63 & d);
            return p;
          })(l);
        }, a.utf8decode = function(l) {
          return f.nodebuffer ? i.transformTo("nodebuffer", l).toString("utf-8") : (function(v) {
            var p, d, h, _, g = v.length, E = new Array(2 * g);
            for (p = d = 0; p < g; ) if ((h = v[p++]) < 128) E[d++] = h;
            else if (4 < (_ = o[h])) E[d++] = 65533, p += _ - 1;
            else {
              for (h &= _ === 2 ? 31 : _ === 3 ? 15 : 7; 1 < _ && p < g; ) h = h << 6 | 63 & v[p++], _--;
              1 < _ ? E[d++] = 65533 : h < 65536 ? E[d++] = h : (h -= 65536, E[d++] = 55296 | h >> 10 & 1023, E[d++] = 56320 | 1023 & h);
            }
            return E.length !== d && (E.subarray ? E = E.subarray(0, d) : E.length = d), i.applyFromCharCode(E);
          })(l = i.transformTo(f.uint8array ? "uint8array" : "array", l));
        }, i.inherits(m, c), m.prototype.processChunk = function(l) {
          var v = i.transformTo(f.uint8array ? "uint8array" : "array", l.data);
          if (this.leftOver && this.leftOver.length) {
            if (f.uint8array) {
              var p = v;
              (v = new Uint8Array(p.length + this.leftOver.length)).set(this.leftOver, 0), v.set(p, this.leftOver.length);
            } else v = this.leftOver.concat(v);
            this.leftOver = null;
          }
          var d = (function(_, g) {
            var E;
            for ((g = g || _.length) > _.length && (g = _.length), E = g - 1; 0 <= E && (192 & _[E]) == 128; ) E--;
            return E < 0 || E === 0 ? g : E + o[_[E]] > g ? E : g;
          })(v), h = v;
          d !== v.length && (f.uint8array ? (h = v.subarray(0, d), this.leftOver = v.subarray(d, v.length)) : (h = v.slice(0, d), this.leftOver = v.slice(d, v.length))), this.push({ data: a.utf8decode(h), meta: l.meta });
        }, m.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: a.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, a.Utf8DecodeWorker = m, i.inherits(x, c), x.prototype.processChunk = function(l) {
          this.push({ data: a.utf8encode(l.data), meta: l.meta });
        }, a.Utf8EncodeWorker = x;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(r, n, a) {
        var i = r("./support"), f = r("./base64"), s = r("./nodejsUtils"), c = r("./external");
        function o(p) {
          return p;
        }
        function u(p, d) {
          for (var h = 0; h < p.length; ++h) d[h] = 255 & p.charCodeAt(h);
          return d;
        }
        r("setimmediate"), a.newBlob = function(p, d) {
          a.checkSupport("blob");
          try {
            return new Blob([p], { type: d });
          } catch {
            try {
              var h = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return h.append(p), h.getBlob(d);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var m = { stringifyByChunk: function(p, d, h) {
          var _ = [], g = 0, E = p.length;
          if (E <= h) return String.fromCharCode.apply(null, p);
          for (; g < E; ) d === "array" || d === "nodebuffer" ? _.push(String.fromCharCode.apply(null, p.slice(g, Math.min(g + h, E)))) : _.push(String.fromCharCode.apply(null, p.subarray(g, Math.min(g + h, E)))), g += h;
          return _.join("");
        }, stringifyByChar: function(p) {
          for (var d = "", h = 0; h < p.length; h++) d += String.fromCharCode(p[h]);
          return d;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return i.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return i.nodebuffer && String.fromCharCode.apply(null, s.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function x(p) {
          var d = 65536, h = a.getTypeOf(p), _ = !0;
          if (h === "uint8array" ? _ = m.applyCanBeUsed.uint8array : h === "nodebuffer" && (_ = m.applyCanBeUsed.nodebuffer), _) for (; 1 < d; ) try {
            return m.stringifyByChunk(p, h, d);
          } catch {
            d = Math.floor(d / 2);
          }
          return m.stringifyByChar(p);
        }
        function l(p, d) {
          for (var h = 0; h < p.length; h++) d[h] = p[h];
          return d;
        }
        a.applyFromCharCode = x;
        var v = {};
        v.string = { string: o, array: function(p) {
          return u(p, new Array(p.length));
        }, arraybuffer: function(p) {
          return v.string.uint8array(p).buffer;
        }, uint8array: function(p) {
          return u(p, new Uint8Array(p.length));
        }, nodebuffer: function(p) {
          return u(p, s.allocBuffer(p.length));
        } }, v.array = { string: x, array: o, arraybuffer: function(p) {
          return new Uint8Array(p).buffer;
        }, uint8array: function(p) {
          return new Uint8Array(p);
        }, nodebuffer: function(p) {
          return s.newBufferFrom(p);
        } }, v.arraybuffer = { string: function(p) {
          return x(new Uint8Array(p));
        }, array: function(p) {
          return l(new Uint8Array(p), new Array(p.byteLength));
        }, arraybuffer: o, uint8array: function(p) {
          return new Uint8Array(p);
        }, nodebuffer: function(p) {
          return s.newBufferFrom(new Uint8Array(p));
        } }, v.uint8array = { string: x, array: function(p) {
          return l(p, new Array(p.length));
        }, arraybuffer: function(p) {
          return p.buffer;
        }, uint8array: o, nodebuffer: function(p) {
          return s.newBufferFrom(p);
        } }, v.nodebuffer = { string: x, array: function(p) {
          return l(p, new Array(p.length));
        }, arraybuffer: function(p) {
          return v.nodebuffer.uint8array(p).buffer;
        }, uint8array: function(p) {
          return l(p, new Uint8Array(p.length));
        }, nodebuffer: o }, a.transformTo = function(p, d) {
          if (d = d || "", !p) return d;
          a.checkSupport(p);
          var h = a.getTypeOf(d);
          return v[h][p](d);
        }, a.resolve = function(p) {
          for (var d = p.split("/"), h = [], _ = 0; _ < d.length; _++) {
            var g = d[_];
            g === "." || g === "" && _ !== 0 && _ !== d.length - 1 || (g === ".." ? h.pop() : h.push(g));
          }
          return h.join("/");
        }, a.getTypeOf = function(p) {
          return typeof p == "string" ? "string" : Object.prototype.toString.call(p) === "[object Array]" ? "array" : i.nodebuffer && s.isBuffer(p) ? "nodebuffer" : i.uint8array && p instanceof Uint8Array ? "uint8array" : i.arraybuffer && p instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, a.checkSupport = function(p) {
          if (!i[p.toLowerCase()]) throw new Error(p + " is not supported by this platform");
        }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(p) {
          var d, h, _ = "";
          for (h = 0; h < (p || "").length; h++) _ += "\\x" + ((d = p.charCodeAt(h)) < 16 ? "0" : "") + d.toString(16).toUpperCase();
          return _;
        }, a.delay = function(p, d, h) {
          setImmediate(function() {
            p.apply(h || null, d || []);
          });
        }, a.inherits = function(p, d) {
          function h() {
          }
          h.prototype = d.prototype, p.prototype = new h();
        }, a.extend = function() {
          var p, d, h = {};
          for (p = 0; p < arguments.length; p++) for (d in arguments[p]) Object.prototype.hasOwnProperty.call(arguments[p], d) && h[d] === void 0 && (h[d] = arguments[p][d]);
          return h;
        }, a.prepareContent = function(p, d, h, _, g) {
          return c.Promise.resolve(d).then(function(E) {
            return i.blob && (E instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(E)) !== -1) && typeof FileReader < "u" ? new c.Promise(function(A, P) {
              var S = new FileReader();
              S.onload = function(R) {
                A(R.target.result);
              }, S.onerror = function(R) {
                P(R.target.error);
              }, S.readAsArrayBuffer(E);
            }) : E;
          }).then(function(E) {
            var A = a.getTypeOf(E);
            return A ? (A === "arraybuffer" ? E = a.transformTo("uint8array", E) : A === "string" && (g ? E = f.decode(E) : h && _ !== !0 && (E = (function(P) {
              return u(P, i.uint8array ? new Uint8Array(P.length) : new Array(P.length));
            })(E))), E) : c.Promise.reject(new Error("Can't read the data of '" + p + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(r, n, a) {
        var i = r("./reader/readerFor"), f = r("./utils"), s = r("./signature"), c = r("./zipEntry"), o = r("./support");
        function u(m) {
          this.files = [], this.loadOptions = m;
        }
        u.prototype = { checkSignature: function(m) {
          if (!this.reader.readAndCheckSignature(m)) {
            this.reader.index -= 4;
            var x = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + f.pretty(x) + ", expected " + f.pretty(m) + ")");
          }
        }, isSignature: function(m, x) {
          var l = this.reader.index;
          this.reader.setIndex(m);
          var v = this.reader.readString(4) === x;
          return this.reader.setIndex(l), v;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var m = this.reader.readData(this.zipCommentLength), x = o.uint8array ? "uint8array" : "array", l = f.transformTo(x, m);
          this.zipComment = this.loadOptions.decodeFileName(l);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var m, x, l, v = this.zip64EndOfCentralSize - 44; 0 < v; ) m = this.reader.readInt(2), x = this.reader.readInt(4), l = this.reader.readData(x), this.zip64ExtensibleData[m] = { id: m, length: x, value: l };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var m, x;
          for (m = 0; m < this.files.length; m++) x = this.files[m], this.reader.setIndex(x.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), x.readLocalPart(this.reader), x.handleUTF8(), x.processAttributes();
        }, readCentralDir: function() {
          var m;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (m = new c({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(m);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var m = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
          if (m < 0) throw this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(m);
          var x = m;
          if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === f.MAX_VALUE_16BITS || this.diskWithCentralDirStart === f.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === f.MAX_VALUE_16BITS || this.centralDirRecords === f.MAX_VALUE_16BITS || this.centralDirSize === f.MAX_VALUE_32BITS || this.centralDirOffset === f.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (m = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(m), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var l = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (l += 20, l += 12 + this.zip64EndOfCentralSize);
          var v = x - l;
          if (0 < v) this.isSignature(x, s.CENTRAL_FILE_HEADER) || (this.reader.zero = v);
          else if (v < 0) throw new Error("Corrupted zip: missing " + Math.abs(v) + " bytes.");
        }, prepareReader: function(m) {
          this.reader = i(m);
        }, load: function(m) {
          this.prepareReader(m), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, n.exports = u;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(r, n, a) {
        var i = r("./reader/readerFor"), f = r("./utils"), s = r("./compressedObject"), c = r("./crc32"), o = r("./utf8"), u = r("./compressions"), m = r("./support");
        function x(l, v) {
          this.options = l, this.loadOptions = v;
        }
        x.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(l) {
          var v, p;
          if (l.skip(22), this.fileNameLength = l.readInt(2), p = l.readInt(2), this.fileName = l.readData(this.fileNameLength), l.skip(p), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((v = (function(d) {
            for (var h in u) if (Object.prototype.hasOwnProperty.call(u, h) && u[h].magic === d) return u[h];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + f.pretty(this.compressionMethod) + " unknown (inner file : " + f.transformTo("string", this.fileName) + ")");
          this.decompressed = new s(this.compressedSize, this.uncompressedSize, this.crc32, v, l.readData(this.compressedSize));
        }, readCentralPart: function(l) {
          this.versionMadeBy = l.readInt(2), l.skip(2), this.bitFlag = l.readInt(2), this.compressionMethod = l.readString(2), this.date = l.readDate(), this.crc32 = l.readInt(4), this.compressedSize = l.readInt(4), this.uncompressedSize = l.readInt(4);
          var v = l.readInt(2);
          if (this.extraFieldsLength = l.readInt(2), this.fileCommentLength = l.readInt(2), this.diskNumberStart = l.readInt(2), this.internalFileAttributes = l.readInt(2), this.externalFileAttributes = l.readInt(4), this.localHeaderOffset = l.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          l.skip(v), this.readExtraFields(l), this.parseZIP64ExtraField(l), this.fileComment = l.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var l = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), l == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), l == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var l = i(this.extraFields[1].value);
            this.uncompressedSize === f.MAX_VALUE_32BITS && (this.uncompressedSize = l.readInt(8)), this.compressedSize === f.MAX_VALUE_32BITS && (this.compressedSize = l.readInt(8)), this.localHeaderOffset === f.MAX_VALUE_32BITS && (this.localHeaderOffset = l.readInt(8)), this.diskNumberStart === f.MAX_VALUE_32BITS && (this.diskNumberStart = l.readInt(4));
          }
        }, readExtraFields: function(l) {
          var v, p, d, h = l.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); l.index + 4 < h; ) v = l.readInt(2), p = l.readInt(2), d = l.readData(p), this.extraFields[v] = { id: v, length: p, value: d };
          l.setIndex(h);
        }, handleUTF8: function() {
          var l = m.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
          else {
            var v = this.findExtraFieldUnicodePath();
            if (v !== null) this.fileNameStr = v;
            else {
              var p = f.transformTo(l, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(p);
            }
            var d = this.findExtraFieldUnicodeComment();
            if (d !== null) this.fileCommentStr = d;
            else {
              var h = f.transformTo(l, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(h);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var l = this.extraFields[28789];
          if (l) {
            var v = i(l.value);
            return v.readInt(1) !== 1 || c(this.fileName) !== v.readInt(4) ? null : o.utf8decode(v.readData(l.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var l = this.extraFields[25461];
          if (l) {
            var v = i(l.value);
            return v.readInt(1) !== 1 || c(this.fileComment) !== v.readInt(4) ? null : o.utf8decode(v.readData(l.length - 5));
          }
          return null;
        } }, n.exports = x;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(r, n, a) {
        function i(v, p, d) {
          this.name = v, this.dir = d.dir, this.date = d.date, this.comment = d.comment, this.unixPermissions = d.unixPermissions, this.dosPermissions = d.dosPermissions, this._data = p, this._dataBinary = d.binary, this.options = { compression: d.compression, compressionOptions: d.compressionOptions };
        }
        var f = r("./stream/StreamHelper"), s = r("./stream/DataWorker"), c = r("./utf8"), o = r("./compressedObject"), u = r("./stream/GenericWorker");
        i.prototype = { internalStream: function(v) {
          var p = null, d = "string";
          try {
            if (!v) throw new Error("No output type specified.");
            var h = (d = v.toLowerCase()) === "string" || d === "text";
            d !== "binarystring" && d !== "text" || (d = "string"), p = this._decompressWorker();
            var _ = !this._dataBinary;
            _ && !h && (p = p.pipe(new c.Utf8EncodeWorker())), !_ && h && (p = p.pipe(new c.Utf8DecodeWorker()));
          } catch (g) {
            (p = new u("error")).error(g);
          }
          return new f(p, d, "");
        }, async: function(v, p) {
          return this.internalStream(v).accumulate(p);
        }, nodeStream: function(v, p) {
          return this.internalStream(v || "nodebuffer").toNodejsStream(p);
        }, _compressWorker: function(v, p) {
          if (this._data instanceof o && this._data.compression.magic === v.magic) return this._data.getCompressedWorker();
          var d = this._decompressWorker();
          return this._dataBinary || (d = d.pipe(new c.Utf8EncodeWorker())), o.createWorkerFrom(d, v, p);
        }, _decompressWorker: function() {
          return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof u ? this._data : new s(this._data);
        } };
        for (var m = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], x = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, l = 0; l < m.length; l++) i.prototype[m[l]] = x;
        n.exports = i;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(r, n, a) {
        (function(i) {
          var f, s, c = i.MutationObserver || i.WebKitMutationObserver;
          if (c) {
            var o = 0, u = new c(v), m = i.document.createTextNode("");
            u.observe(m, { characterData: !0 }), f = function() {
              m.data = o = ++o % 2;
            };
          } else if (i.setImmediate || i.MessageChannel === void 0) f = "document" in i && "onreadystatechange" in i.document.createElement("script") ? function() {
            var p = i.document.createElement("script");
            p.onreadystatechange = function() {
              v(), p.onreadystatechange = null, p.parentNode.removeChild(p), p = null;
            }, i.document.documentElement.appendChild(p);
          } : function() {
            setTimeout(v, 0);
          };
          else {
            var x = new i.MessageChannel();
            x.port1.onmessage = v, f = function() {
              x.port2.postMessage(0);
            };
          }
          var l = [];
          function v() {
            var p, d;
            s = !0;
            for (var h = l.length; h; ) {
              for (d = l, l = [], p = -1; ++p < h; ) d[p]();
              h = l.length;
            }
            s = !1;
          }
          n.exports = function(p) {
            l.push(p) !== 1 || s || f();
          };
        }).call(this, typeof Sa < "u" ? Sa : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(r, n, a) {
        var i = r("immediate");
        function f() {
        }
        var s = {}, c = ["REJECTED"], o = ["FULFILLED"], u = ["PENDING"];
        function m(h) {
          if (typeof h != "function") throw new TypeError("resolver must be a function");
          this.state = u, this.queue = [], this.outcome = void 0, h !== f && p(this, h);
        }
        function x(h, _, g) {
          this.promise = h, typeof _ == "function" && (this.onFulfilled = _, this.callFulfilled = this.otherCallFulfilled), typeof g == "function" && (this.onRejected = g, this.callRejected = this.otherCallRejected);
        }
        function l(h, _, g) {
          i(function() {
            var E;
            try {
              E = _(g);
            } catch (A) {
              return s.reject(h, A);
            }
            E === h ? s.reject(h, new TypeError("Cannot resolve promise with itself")) : s.resolve(h, E);
          });
        }
        function v(h) {
          var _ = h && h.then;
          if (h && (typeof h == "object" || typeof h == "function") && typeof _ == "function") return function() {
            _.apply(h, arguments);
          };
        }
        function p(h, _) {
          var g = !1;
          function E(S) {
            g || (g = !0, s.reject(h, S));
          }
          function A(S) {
            g || (g = !0, s.resolve(h, S));
          }
          var P = d(function() {
            _(A, E);
          });
          P.status === "error" && E(P.value);
        }
        function d(h, _) {
          var g = {};
          try {
            g.value = h(_), g.status = "success";
          } catch (E) {
            g.status = "error", g.value = E;
          }
          return g;
        }
        (n.exports = m).prototype.finally = function(h) {
          if (typeof h != "function") return this;
          var _ = this.constructor;
          return this.then(function(g) {
            return _.resolve(h()).then(function() {
              return g;
            });
          }, function(g) {
            return _.resolve(h()).then(function() {
              throw g;
            });
          });
        }, m.prototype.catch = function(h) {
          return this.then(null, h);
        }, m.prototype.then = function(h, _) {
          if (typeof h != "function" && this.state === o || typeof _ != "function" && this.state === c) return this;
          var g = new this.constructor(f);
          return this.state !== u ? l(g, this.state === o ? h : _, this.outcome) : this.queue.push(new x(g, h, _)), g;
        }, x.prototype.callFulfilled = function(h) {
          s.resolve(this.promise, h);
        }, x.prototype.otherCallFulfilled = function(h) {
          l(this.promise, this.onFulfilled, h);
        }, x.prototype.callRejected = function(h) {
          s.reject(this.promise, h);
        }, x.prototype.otherCallRejected = function(h) {
          l(this.promise, this.onRejected, h);
        }, s.resolve = function(h, _) {
          var g = d(v, _);
          if (g.status === "error") return s.reject(h, g.value);
          var E = g.value;
          if (E) p(h, E);
          else {
            h.state = o, h.outcome = _;
            for (var A = -1, P = h.queue.length; ++A < P; ) h.queue[A].callFulfilled(_);
          }
          return h;
        }, s.reject = function(h, _) {
          h.state = c, h.outcome = _;
          for (var g = -1, E = h.queue.length; ++g < E; ) h.queue[g].callRejected(_);
          return h;
        }, m.resolve = function(h) {
          return h instanceof this ? h : s.resolve(new this(f), h);
        }, m.reject = function(h) {
          var _ = new this(f);
          return s.reject(_, h);
        }, m.all = function(h) {
          var _ = this;
          if (Object.prototype.toString.call(h) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var g = h.length, E = !1;
          if (!g) return this.resolve([]);
          for (var A = new Array(g), P = 0, S = -1, R = new this(f); ++S < g; ) F(h[S], S);
          return R;
          function F(U, H) {
            _.resolve(U).then(function(y) {
              A[H] = y, ++P !== g || E || (E = !0, s.resolve(R, A));
            }, function(y) {
              E || (E = !0, s.reject(R, y));
            });
          }
        }, m.race = function(h) {
          var _ = this;
          if (Object.prototype.toString.call(h) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var g = h.length, E = !1;
          if (!g) return this.resolve([]);
          for (var A = -1, P = new this(f); ++A < g; ) S = h[A], _.resolve(S).then(function(R) {
            E || (E = !0, s.resolve(P, R));
          }, function(R) {
            E || (E = !0, s.reject(P, R));
          });
          var S;
          return P;
        };
      }, { immediate: 36 }], 38: [function(r, n, a) {
        var i = {};
        (0, r("./lib/utils/common").assign)(i, r("./lib/deflate"), r("./lib/inflate"), r("./lib/zlib/constants")), n.exports = i;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(r, n, a) {
        var i = r("./zlib/deflate"), f = r("./utils/common"), s = r("./utils/strings"), c = r("./zlib/messages"), o = r("./zlib/zstream"), u = Object.prototype.toString, m = 0, x = -1, l = 0, v = 8;
        function p(h) {
          if (!(this instanceof p)) return new p(h);
          this.options = f.assign({ level: x, method: v, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: l, to: "" }, h || {});
          var _ = this.options;
          _.raw && 0 < _.windowBits ? _.windowBits = -_.windowBits : _.gzip && 0 < _.windowBits && _.windowBits < 16 && (_.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new o(), this.strm.avail_out = 0;
          var g = i.deflateInit2(this.strm, _.level, _.method, _.windowBits, _.memLevel, _.strategy);
          if (g !== m) throw new Error(c[g]);
          if (_.header && i.deflateSetHeader(this.strm, _.header), _.dictionary) {
            var E;
            if (E = typeof _.dictionary == "string" ? s.string2buf(_.dictionary) : u.call(_.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(_.dictionary) : _.dictionary, (g = i.deflateSetDictionary(this.strm, E)) !== m) throw new Error(c[g]);
            this._dict_set = !0;
          }
        }
        function d(h, _) {
          var g = new p(_);
          if (g.push(h, !0), g.err) throw g.msg || c[g.err];
          return g.result;
        }
        p.prototype.push = function(h, _) {
          var g, E, A = this.strm, P = this.options.chunkSize;
          if (this.ended) return !1;
          E = _ === ~~_ ? _ : _ === !0 ? 4 : 0, typeof h == "string" ? A.input = s.string2buf(h) : u.call(h) === "[object ArrayBuffer]" ? A.input = new Uint8Array(h) : A.input = h, A.next_in = 0, A.avail_in = A.input.length;
          do {
            if (A.avail_out === 0 && (A.output = new f.Buf8(P), A.next_out = 0, A.avail_out = P), (g = i.deflate(A, E)) !== 1 && g !== m) return this.onEnd(g), !(this.ended = !0);
            A.avail_out !== 0 && (A.avail_in !== 0 || E !== 4 && E !== 2) || (this.options.to === "string" ? this.onData(s.buf2binstring(f.shrinkBuf(A.output, A.next_out))) : this.onData(f.shrinkBuf(A.output, A.next_out)));
          } while ((0 < A.avail_in || A.avail_out === 0) && g !== 1);
          return E === 4 ? (g = i.deflateEnd(this.strm), this.onEnd(g), this.ended = !0, g === m) : E !== 2 || (this.onEnd(m), !(A.avail_out = 0));
        }, p.prototype.onData = function(h) {
          this.chunks.push(h);
        }, p.prototype.onEnd = function(h) {
          h === m && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = f.flattenChunks(this.chunks)), this.chunks = [], this.err = h, this.msg = this.strm.msg;
        }, a.Deflate = p, a.deflate = d, a.deflateRaw = function(h, _) {
          return (_ = _ || {}).raw = !0, d(h, _);
        }, a.gzip = function(h, _) {
          return (_ = _ || {}).gzip = !0, d(h, _);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(r, n, a) {
        var i = r("./zlib/inflate"), f = r("./utils/common"), s = r("./utils/strings"), c = r("./zlib/constants"), o = r("./zlib/messages"), u = r("./zlib/zstream"), m = r("./zlib/gzheader"), x = Object.prototype.toString;
        function l(p) {
          if (!(this instanceof l)) return new l(p);
          this.options = f.assign({ chunkSize: 16384, windowBits: 0, to: "" }, p || {});
          var d = this.options;
          d.raw && 0 <= d.windowBits && d.windowBits < 16 && (d.windowBits = -d.windowBits, d.windowBits === 0 && (d.windowBits = -15)), !(0 <= d.windowBits && d.windowBits < 16) || p && p.windowBits || (d.windowBits += 32), 15 < d.windowBits && d.windowBits < 48 && (15 & d.windowBits) == 0 && (d.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new u(), this.strm.avail_out = 0;
          var h = i.inflateInit2(this.strm, d.windowBits);
          if (h !== c.Z_OK) throw new Error(o[h]);
          this.header = new m(), i.inflateGetHeader(this.strm, this.header);
        }
        function v(p, d) {
          var h = new l(d);
          if (h.push(p, !0), h.err) throw h.msg || o[h.err];
          return h.result;
        }
        l.prototype.push = function(p, d) {
          var h, _, g, E, A, P, S = this.strm, R = this.options.chunkSize, F = this.options.dictionary, U = !1;
          if (this.ended) return !1;
          _ = d === ~~d ? d : d === !0 ? c.Z_FINISH : c.Z_NO_FLUSH, typeof p == "string" ? S.input = s.binstring2buf(p) : x.call(p) === "[object ArrayBuffer]" ? S.input = new Uint8Array(p) : S.input = p, S.next_in = 0, S.avail_in = S.input.length;
          do {
            if (S.avail_out === 0 && (S.output = new f.Buf8(R), S.next_out = 0, S.avail_out = R), (h = i.inflate(S, c.Z_NO_FLUSH)) === c.Z_NEED_DICT && F && (P = typeof F == "string" ? s.string2buf(F) : x.call(F) === "[object ArrayBuffer]" ? new Uint8Array(F) : F, h = i.inflateSetDictionary(this.strm, P)), h === c.Z_BUF_ERROR && U === !0 && (h = c.Z_OK, U = !1), h !== c.Z_STREAM_END && h !== c.Z_OK) return this.onEnd(h), !(this.ended = !0);
            S.next_out && (S.avail_out !== 0 && h !== c.Z_STREAM_END && (S.avail_in !== 0 || _ !== c.Z_FINISH && _ !== c.Z_SYNC_FLUSH) || (this.options.to === "string" ? (g = s.utf8border(S.output, S.next_out), E = S.next_out - g, A = s.buf2string(S.output, g), S.next_out = E, S.avail_out = R - E, E && f.arraySet(S.output, S.output, g, E, 0), this.onData(A)) : this.onData(f.shrinkBuf(S.output, S.next_out)))), S.avail_in === 0 && S.avail_out === 0 && (U = !0);
          } while ((0 < S.avail_in || S.avail_out === 0) && h !== c.Z_STREAM_END);
          return h === c.Z_STREAM_END && (_ = c.Z_FINISH), _ === c.Z_FINISH ? (h = i.inflateEnd(this.strm), this.onEnd(h), this.ended = !0, h === c.Z_OK) : _ !== c.Z_SYNC_FLUSH || (this.onEnd(c.Z_OK), !(S.avail_out = 0));
        }, l.prototype.onData = function(p) {
          this.chunks.push(p);
        }, l.prototype.onEnd = function(p) {
          p === c.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = f.flattenChunks(this.chunks)), this.chunks = [], this.err = p, this.msg = this.strm.msg;
        }, a.Inflate = l, a.inflate = v, a.inflateRaw = function(p, d) {
          return (d = d || {}).raw = !0, v(p, d);
        }, a.ungzip = v;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(r, n, a) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        a.assign = function(c) {
          for (var o = Array.prototype.slice.call(arguments, 1); o.length; ) {
            var u = o.shift();
            if (u) {
              if (typeof u != "object") throw new TypeError(u + "must be non-object");
              for (var m in u) u.hasOwnProperty(m) && (c[m] = u[m]);
            }
          }
          return c;
        }, a.shrinkBuf = function(c, o) {
          return c.length === o ? c : c.subarray ? c.subarray(0, o) : (c.length = o, c);
        };
        var f = { arraySet: function(c, o, u, m, x) {
          if (o.subarray && c.subarray) c.set(o.subarray(u, u + m), x);
          else for (var l = 0; l < m; l++) c[x + l] = o[u + l];
        }, flattenChunks: function(c) {
          var o, u, m, x, l, v;
          for (o = m = 0, u = c.length; o < u; o++) m += c[o].length;
          for (v = new Uint8Array(m), o = x = 0, u = c.length; o < u; o++) l = c[o], v.set(l, x), x += l.length;
          return v;
        } }, s = { arraySet: function(c, o, u, m, x) {
          for (var l = 0; l < m; l++) c[x + l] = o[u + l];
        }, flattenChunks: function(c) {
          return [].concat.apply([], c);
        } };
        a.setTyped = function(c) {
          c ? (a.Buf8 = Uint8Array, a.Buf16 = Uint16Array, a.Buf32 = Int32Array, a.assign(a, f)) : (a.Buf8 = Array, a.Buf16 = Array, a.Buf32 = Array, a.assign(a, s));
        }, a.setTyped(i);
      }, {}], 42: [function(r, n, a) {
        var i = r("./common"), f = !0, s = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          f = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          s = !1;
        }
        for (var c = new i.Buf8(256), o = 0; o < 256; o++) c[o] = 252 <= o ? 6 : 248 <= o ? 5 : 240 <= o ? 4 : 224 <= o ? 3 : 192 <= o ? 2 : 1;
        function u(m, x) {
          if (x < 65537 && (m.subarray && s || !m.subarray && f)) return String.fromCharCode.apply(null, i.shrinkBuf(m, x));
          for (var l = "", v = 0; v < x; v++) l += String.fromCharCode(m[v]);
          return l;
        }
        c[254] = c[254] = 1, a.string2buf = function(m) {
          var x, l, v, p, d, h = m.length, _ = 0;
          for (p = 0; p < h; p++) (64512 & (l = m.charCodeAt(p))) == 55296 && p + 1 < h && (64512 & (v = m.charCodeAt(p + 1))) == 56320 && (l = 65536 + (l - 55296 << 10) + (v - 56320), p++), _ += l < 128 ? 1 : l < 2048 ? 2 : l < 65536 ? 3 : 4;
          for (x = new i.Buf8(_), p = d = 0; d < _; p++) (64512 & (l = m.charCodeAt(p))) == 55296 && p + 1 < h && (64512 & (v = m.charCodeAt(p + 1))) == 56320 && (l = 65536 + (l - 55296 << 10) + (v - 56320), p++), l < 128 ? x[d++] = l : (l < 2048 ? x[d++] = 192 | l >>> 6 : (l < 65536 ? x[d++] = 224 | l >>> 12 : (x[d++] = 240 | l >>> 18, x[d++] = 128 | l >>> 12 & 63), x[d++] = 128 | l >>> 6 & 63), x[d++] = 128 | 63 & l);
          return x;
        }, a.buf2binstring = function(m) {
          return u(m, m.length);
        }, a.binstring2buf = function(m) {
          for (var x = new i.Buf8(m.length), l = 0, v = x.length; l < v; l++) x[l] = m.charCodeAt(l);
          return x;
        }, a.buf2string = function(m, x) {
          var l, v, p, d, h = x || m.length, _ = new Array(2 * h);
          for (l = v = 0; l < h; ) if ((p = m[l++]) < 128) _[v++] = p;
          else if (4 < (d = c[p])) _[v++] = 65533, l += d - 1;
          else {
            for (p &= d === 2 ? 31 : d === 3 ? 15 : 7; 1 < d && l < h; ) p = p << 6 | 63 & m[l++], d--;
            1 < d ? _[v++] = 65533 : p < 65536 ? _[v++] = p : (p -= 65536, _[v++] = 55296 | p >> 10 & 1023, _[v++] = 56320 | 1023 & p);
          }
          return u(_, v);
        }, a.utf8border = function(m, x) {
          var l;
          for ((x = x || m.length) > m.length && (x = m.length), l = x - 1; 0 <= l && (192 & m[l]) == 128; ) l--;
          return l < 0 || l === 0 ? x : l + c[m[l]] > x ? l : x;
        };
      }, { "./common": 41 }], 43: [function(r, n, a) {
        n.exports = function(i, f, s, c) {
          for (var o = 65535 & i | 0, u = i >>> 16 & 65535 | 0, m = 0; s !== 0; ) {
            for (s -= m = 2e3 < s ? 2e3 : s; u = u + (o = o + f[c++] | 0) | 0, --m; ) ;
            o %= 65521, u %= 65521;
          }
          return o | u << 16 | 0;
        };
      }, {}], 44: [function(r, n, a) {
        n.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(r, n, a) {
        var i = (function() {
          for (var f, s = [], c = 0; c < 256; c++) {
            f = c;
            for (var o = 0; o < 8; o++) f = 1 & f ? 3988292384 ^ f >>> 1 : f >>> 1;
            s[c] = f;
          }
          return s;
        })();
        n.exports = function(f, s, c, o) {
          var u = i, m = o + c;
          f ^= -1;
          for (var x = o; x < m; x++) f = f >>> 8 ^ u[255 & (f ^ s[x])];
          return -1 ^ f;
        };
      }, {}], 46: [function(r, n, a) {
        var i, f = r("../utils/common"), s = r("./trees"), c = r("./adler32"), o = r("./crc32"), u = r("./messages"), m = 0, x = 4, l = 0, v = -2, p = -1, d = 4, h = 2, _ = 8, g = 9, E = 286, A = 30, P = 19, S = 2 * E + 1, R = 15, F = 3, U = 258, H = U + F + 1, y = 42, W = 113, k = 1, j = 2, me = 3, Z = 4;
        function xe(w, Q) {
          return w.msg = u[Q], Q;
        }
        function fe(w) {
          return (w << 1) - (4 < w ? 9 : 0);
        }
        function q(w) {
          for (var Q = w.length; 0 <= --Q; ) w[Q] = 0;
        }
        function J(w) {
          var Q = w.state, V = Q.pending;
          V > w.avail_out && (V = w.avail_out), V !== 0 && (f.arraySet(w.output, Q.pending_buf, Q.pending_out, V, w.next_out), w.next_out += V, Q.pending_out += V, w.total_out += V, w.avail_out -= V, Q.pending -= V, Q.pending === 0 && (Q.pending_out = 0));
        }
        function Y(w, Q) {
          s._tr_flush_block(w, 0 <= w.block_start ? w.block_start : -1, w.strstart - w.block_start, Q), w.block_start = w.strstart, J(w.strm);
        }
        function pe(w, Q) {
          w.pending_buf[w.pending++] = Q;
        }
        function ce(w, Q) {
          w.pending_buf[w.pending++] = Q >>> 8 & 255, w.pending_buf[w.pending++] = 255 & Q;
        }
        function de(w, Q) {
          var V, I, C = w.max_chain_length, G = w.strstart, oe = w.prev_length, le = w.nice_match, ee = w.strstart > w.w_size - H ? w.strstart - (w.w_size - H) : 0, se = w.window, ve = w.w_mask, re = w.prev, Fe = w.strstart + U, Oe = se[G + oe - 1], Se = se[G + oe];
          w.prev_length >= w.good_match && (C >>= 2), le > w.lookahead && (le = w.lookahead);
          do
            if (se[(V = Q) + oe] === Se && se[V + oe - 1] === Oe && se[V] === se[G] && se[++V] === se[G + 1]) {
              G += 2, V++;
              do
                ;
              while (se[++G] === se[++V] && se[++G] === se[++V] && se[++G] === se[++V] && se[++G] === se[++V] && se[++G] === se[++V] && se[++G] === se[++V] && se[++G] === se[++V] && se[++G] === se[++V] && G < Fe);
              if (I = U - (Fe - G), G = Fe - U, oe < I) {
                if (w.match_start = Q, le <= (oe = I)) break;
                Oe = se[G + oe - 1], Se = se[G + oe];
              }
            }
          while ((Q = re[Q & ve]) > ee && --C != 0);
          return oe <= w.lookahead ? oe : w.lookahead;
        }
        function Te(w) {
          var Q, V, I, C, G, oe, le, ee, se, ve, re = w.w_size;
          do {
            if (C = w.window_size - w.lookahead - w.strstart, w.strstart >= re + (re - H)) {
              for (f.arraySet(w.window, w.window, re, re, 0), w.match_start -= re, w.strstart -= re, w.block_start -= re, Q = V = w.hash_size; I = w.head[--Q], w.head[Q] = re <= I ? I - re : 0, --V; ) ;
              for (Q = V = re; I = w.prev[--Q], w.prev[Q] = re <= I ? I - re : 0, --V; ) ;
              C += re;
            }
            if (w.strm.avail_in === 0) break;
            if (oe = w.strm, le = w.window, ee = w.strstart + w.lookahead, se = C, ve = void 0, ve = oe.avail_in, se < ve && (ve = se), V = ve === 0 ? 0 : (oe.avail_in -= ve, f.arraySet(le, oe.input, oe.next_in, ve, ee), oe.state.wrap === 1 ? oe.adler = c(oe.adler, le, ve, ee) : oe.state.wrap === 2 && (oe.adler = o(oe.adler, le, ve, ee)), oe.next_in += ve, oe.total_in += ve, ve), w.lookahead += V, w.lookahead + w.insert >= F) for (G = w.strstart - w.insert, w.ins_h = w.window[G], w.ins_h = (w.ins_h << w.hash_shift ^ w.window[G + 1]) & w.hash_mask; w.insert && (w.ins_h = (w.ins_h << w.hash_shift ^ w.window[G + F - 1]) & w.hash_mask, w.prev[G & w.w_mask] = w.head[w.ins_h], w.head[w.ins_h] = G, G++, w.insert--, !(w.lookahead + w.insert < F)); ) ;
          } while (w.lookahead < H && w.strm.avail_in !== 0);
        }
        function Ce(w, Q) {
          for (var V, I; ; ) {
            if (w.lookahead < H) {
              if (Te(w), w.lookahead < H && Q === m) return k;
              if (w.lookahead === 0) break;
            }
            if (V = 0, w.lookahead >= F && (w.ins_h = (w.ins_h << w.hash_shift ^ w.window[w.strstart + F - 1]) & w.hash_mask, V = w.prev[w.strstart & w.w_mask] = w.head[w.ins_h], w.head[w.ins_h] = w.strstart), V !== 0 && w.strstart - V <= w.w_size - H && (w.match_length = de(w, V)), w.match_length >= F) if (I = s._tr_tally(w, w.strstart - w.match_start, w.match_length - F), w.lookahead -= w.match_length, w.match_length <= w.max_lazy_match && w.lookahead >= F) {
              for (w.match_length--; w.strstart++, w.ins_h = (w.ins_h << w.hash_shift ^ w.window[w.strstart + F - 1]) & w.hash_mask, V = w.prev[w.strstart & w.w_mask] = w.head[w.ins_h], w.head[w.ins_h] = w.strstart, --w.match_length != 0; ) ;
              w.strstart++;
            } else w.strstart += w.match_length, w.match_length = 0, w.ins_h = w.window[w.strstart], w.ins_h = (w.ins_h << w.hash_shift ^ w.window[w.strstart + 1]) & w.hash_mask;
            else I = s._tr_tally(w, 0, w.window[w.strstart]), w.lookahead--, w.strstart++;
            if (I && (Y(w, !1), w.strm.avail_out === 0)) return k;
          }
          return w.insert = w.strstart < F - 1 ? w.strstart : F - 1, Q === x ? (Y(w, !0), w.strm.avail_out === 0 ? me : Z) : w.last_lit && (Y(w, !1), w.strm.avail_out === 0) ? k : j;
        }
        function O(w, Q) {
          for (var V, I, C; ; ) {
            if (w.lookahead < H) {
              if (Te(w), w.lookahead < H && Q === m) return k;
              if (w.lookahead === 0) break;
            }
            if (V = 0, w.lookahead >= F && (w.ins_h = (w.ins_h << w.hash_shift ^ w.window[w.strstart + F - 1]) & w.hash_mask, V = w.prev[w.strstart & w.w_mask] = w.head[w.ins_h], w.head[w.ins_h] = w.strstart), w.prev_length = w.match_length, w.prev_match = w.match_start, w.match_length = F - 1, V !== 0 && w.prev_length < w.max_lazy_match && w.strstart - V <= w.w_size - H && (w.match_length = de(w, V), w.match_length <= 5 && (w.strategy === 1 || w.match_length === F && 4096 < w.strstart - w.match_start) && (w.match_length = F - 1)), w.prev_length >= F && w.match_length <= w.prev_length) {
              for (C = w.strstart + w.lookahead - F, I = s._tr_tally(w, w.strstart - 1 - w.prev_match, w.prev_length - F), w.lookahead -= w.prev_length - 1, w.prev_length -= 2; ++w.strstart <= C && (w.ins_h = (w.ins_h << w.hash_shift ^ w.window[w.strstart + F - 1]) & w.hash_mask, V = w.prev[w.strstart & w.w_mask] = w.head[w.ins_h], w.head[w.ins_h] = w.strstart), --w.prev_length != 0; ) ;
              if (w.match_available = 0, w.match_length = F - 1, w.strstart++, I && (Y(w, !1), w.strm.avail_out === 0)) return k;
            } else if (w.match_available) {
              if ((I = s._tr_tally(w, 0, w.window[w.strstart - 1])) && Y(w, !1), w.strstart++, w.lookahead--, w.strm.avail_out === 0) return k;
            } else w.match_available = 1, w.strstart++, w.lookahead--;
          }
          return w.match_available && (I = s._tr_tally(w, 0, w.window[w.strstart - 1]), w.match_available = 0), w.insert = w.strstart < F - 1 ? w.strstart : F - 1, Q === x ? (Y(w, !0), w.strm.avail_out === 0 ? me : Z) : w.last_lit && (Y(w, !1), w.strm.avail_out === 0) ? k : j;
        }
        function K(w, Q, V, I, C) {
          this.good_length = w, this.max_lazy = Q, this.nice_length = V, this.max_chain = I, this.func = C;
        }
        function X() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = _, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new f.Buf16(2 * S), this.dyn_dtree = new f.Buf16(2 * (2 * A + 1)), this.bl_tree = new f.Buf16(2 * (2 * P + 1)), q(this.dyn_ltree), q(this.dyn_dtree), q(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new f.Buf16(R + 1), this.heap = new f.Buf16(2 * E + 1), q(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new f.Buf16(2 * E + 1), q(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function z(w) {
          var Q;
          return w && w.state ? (w.total_in = w.total_out = 0, w.data_type = h, (Q = w.state).pending = 0, Q.pending_out = 0, Q.wrap < 0 && (Q.wrap = -Q.wrap), Q.status = Q.wrap ? y : W, w.adler = Q.wrap === 2 ? 0 : 1, Q.last_flush = m, s._tr_init(Q), l) : xe(w, v);
        }
        function he(w) {
          var Q = z(w);
          return Q === l && (function(V) {
            V.window_size = 2 * V.w_size, q(V.head), V.max_lazy_match = i[V.level].max_lazy, V.good_match = i[V.level].good_length, V.nice_match = i[V.level].nice_length, V.max_chain_length = i[V.level].max_chain, V.strstart = 0, V.block_start = 0, V.lookahead = 0, V.insert = 0, V.match_length = V.prev_length = F - 1, V.match_available = 0, V.ins_h = 0;
          })(w.state), Q;
        }
        function N(w, Q, V, I, C, G) {
          if (!w) return v;
          var oe = 1;
          if (Q === p && (Q = 6), I < 0 ? (oe = 0, I = -I) : 15 < I && (oe = 2, I -= 16), C < 1 || g < C || V !== _ || I < 8 || 15 < I || Q < 0 || 9 < Q || G < 0 || d < G) return xe(w, v);
          I === 8 && (I = 9);
          var le = new X();
          return (w.state = le).strm = w, le.wrap = oe, le.gzhead = null, le.w_bits = I, le.w_size = 1 << le.w_bits, le.w_mask = le.w_size - 1, le.hash_bits = C + 7, le.hash_size = 1 << le.hash_bits, le.hash_mask = le.hash_size - 1, le.hash_shift = ~~((le.hash_bits + F - 1) / F), le.window = new f.Buf8(2 * le.w_size), le.head = new f.Buf16(le.hash_size), le.prev = new f.Buf16(le.w_size), le.lit_bufsize = 1 << C + 6, le.pending_buf_size = 4 * le.lit_bufsize, le.pending_buf = new f.Buf8(le.pending_buf_size), le.d_buf = 1 * le.lit_bufsize, le.l_buf = 3 * le.lit_bufsize, le.level = Q, le.strategy = G, le.method = V, he(w);
        }
        i = [new K(0, 0, 0, 0, function(w, Q) {
          var V = 65535;
          for (V > w.pending_buf_size - 5 && (V = w.pending_buf_size - 5); ; ) {
            if (w.lookahead <= 1) {
              if (Te(w), w.lookahead === 0 && Q === m) return k;
              if (w.lookahead === 0) break;
            }
            w.strstart += w.lookahead, w.lookahead = 0;
            var I = w.block_start + V;
            if ((w.strstart === 0 || w.strstart >= I) && (w.lookahead = w.strstart - I, w.strstart = I, Y(w, !1), w.strm.avail_out === 0) || w.strstart - w.block_start >= w.w_size - H && (Y(w, !1), w.strm.avail_out === 0)) return k;
          }
          return w.insert = 0, Q === x ? (Y(w, !0), w.strm.avail_out === 0 ? me : Z) : (w.strstart > w.block_start && (Y(w, !1), w.strm.avail_out), k);
        }), new K(4, 4, 8, 4, Ce), new K(4, 5, 16, 8, Ce), new K(4, 6, 32, 32, Ce), new K(4, 4, 16, 16, O), new K(8, 16, 32, 32, O), new K(8, 16, 128, 128, O), new K(8, 32, 128, 256, O), new K(32, 128, 258, 1024, O), new K(32, 258, 258, 4096, O)], a.deflateInit = function(w, Q) {
          return N(w, Q, _, 15, 8, 0);
        }, a.deflateInit2 = N, a.deflateReset = he, a.deflateResetKeep = z, a.deflateSetHeader = function(w, Q) {
          return w && w.state ? w.state.wrap !== 2 ? v : (w.state.gzhead = Q, l) : v;
        }, a.deflate = function(w, Q) {
          var V, I, C, G;
          if (!w || !w.state || 5 < Q || Q < 0) return w ? xe(w, v) : v;
          if (I = w.state, !w.output || !w.input && w.avail_in !== 0 || I.status === 666 && Q !== x) return xe(w, w.avail_out === 0 ? -5 : v);
          if (I.strm = w, V = I.last_flush, I.last_flush = Q, I.status === y) if (I.wrap === 2) w.adler = 0, pe(I, 31), pe(I, 139), pe(I, 8), I.gzhead ? (pe(I, (I.gzhead.text ? 1 : 0) + (I.gzhead.hcrc ? 2 : 0) + (I.gzhead.extra ? 4 : 0) + (I.gzhead.name ? 8 : 0) + (I.gzhead.comment ? 16 : 0)), pe(I, 255 & I.gzhead.time), pe(I, I.gzhead.time >> 8 & 255), pe(I, I.gzhead.time >> 16 & 255), pe(I, I.gzhead.time >> 24 & 255), pe(I, I.level === 9 ? 2 : 2 <= I.strategy || I.level < 2 ? 4 : 0), pe(I, 255 & I.gzhead.os), I.gzhead.extra && I.gzhead.extra.length && (pe(I, 255 & I.gzhead.extra.length), pe(I, I.gzhead.extra.length >> 8 & 255)), I.gzhead.hcrc && (w.adler = o(w.adler, I.pending_buf, I.pending, 0)), I.gzindex = 0, I.status = 69) : (pe(I, 0), pe(I, 0), pe(I, 0), pe(I, 0), pe(I, 0), pe(I, I.level === 9 ? 2 : 2 <= I.strategy || I.level < 2 ? 4 : 0), pe(I, 3), I.status = W);
          else {
            var oe = _ + (I.w_bits - 8 << 4) << 8;
            oe |= (2 <= I.strategy || I.level < 2 ? 0 : I.level < 6 ? 1 : I.level === 6 ? 2 : 3) << 6, I.strstart !== 0 && (oe |= 32), oe += 31 - oe % 31, I.status = W, ce(I, oe), I.strstart !== 0 && (ce(I, w.adler >>> 16), ce(I, 65535 & w.adler)), w.adler = 1;
          }
          if (I.status === 69) if (I.gzhead.extra) {
            for (C = I.pending; I.gzindex < (65535 & I.gzhead.extra.length) && (I.pending !== I.pending_buf_size || (I.gzhead.hcrc && I.pending > C && (w.adler = o(w.adler, I.pending_buf, I.pending - C, C)), J(w), C = I.pending, I.pending !== I.pending_buf_size)); ) pe(I, 255 & I.gzhead.extra[I.gzindex]), I.gzindex++;
            I.gzhead.hcrc && I.pending > C && (w.adler = o(w.adler, I.pending_buf, I.pending - C, C)), I.gzindex === I.gzhead.extra.length && (I.gzindex = 0, I.status = 73);
          } else I.status = 73;
          if (I.status === 73) if (I.gzhead.name) {
            C = I.pending;
            do {
              if (I.pending === I.pending_buf_size && (I.gzhead.hcrc && I.pending > C && (w.adler = o(w.adler, I.pending_buf, I.pending - C, C)), J(w), C = I.pending, I.pending === I.pending_buf_size)) {
                G = 1;
                break;
              }
              G = I.gzindex < I.gzhead.name.length ? 255 & I.gzhead.name.charCodeAt(I.gzindex++) : 0, pe(I, G);
            } while (G !== 0);
            I.gzhead.hcrc && I.pending > C && (w.adler = o(w.adler, I.pending_buf, I.pending - C, C)), G === 0 && (I.gzindex = 0, I.status = 91);
          } else I.status = 91;
          if (I.status === 91) if (I.gzhead.comment) {
            C = I.pending;
            do {
              if (I.pending === I.pending_buf_size && (I.gzhead.hcrc && I.pending > C && (w.adler = o(w.adler, I.pending_buf, I.pending - C, C)), J(w), C = I.pending, I.pending === I.pending_buf_size)) {
                G = 1;
                break;
              }
              G = I.gzindex < I.gzhead.comment.length ? 255 & I.gzhead.comment.charCodeAt(I.gzindex++) : 0, pe(I, G);
            } while (G !== 0);
            I.gzhead.hcrc && I.pending > C && (w.adler = o(w.adler, I.pending_buf, I.pending - C, C)), G === 0 && (I.status = 103);
          } else I.status = 103;
          if (I.status === 103 && (I.gzhead.hcrc ? (I.pending + 2 > I.pending_buf_size && J(w), I.pending + 2 <= I.pending_buf_size && (pe(I, 255 & w.adler), pe(I, w.adler >> 8 & 255), w.adler = 0, I.status = W)) : I.status = W), I.pending !== 0) {
            if (J(w), w.avail_out === 0) return I.last_flush = -1, l;
          } else if (w.avail_in === 0 && fe(Q) <= fe(V) && Q !== x) return xe(w, -5);
          if (I.status === 666 && w.avail_in !== 0) return xe(w, -5);
          if (w.avail_in !== 0 || I.lookahead !== 0 || Q !== m && I.status !== 666) {
            var le = I.strategy === 2 ? (function(ee, se) {
              for (var ve; ; ) {
                if (ee.lookahead === 0 && (Te(ee), ee.lookahead === 0)) {
                  if (se === m) return k;
                  break;
                }
                if (ee.match_length = 0, ve = s._tr_tally(ee, 0, ee.window[ee.strstart]), ee.lookahead--, ee.strstart++, ve && (Y(ee, !1), ee.strm.avail_out === 0)) return k;
              }
              return ee.insert = 0, se === x ? (Y(ee, !0), ee.strm.avail_out === 0 ? me : Z) : ee.last_lit && (Y(ee, !1), ee.strm.avail_out === 0) ? k : j;
            })(I, Q) : I.strategy === 3 ? (function(ee, se) {
              for (var ve, re, Fe, Oe, Se = ee.window; ; ) {
                if (ee.lookahead <= U) {
                  if (Te(ee), ee.lookahead <= U && se === m) return k;
                  if (ee.lookahead === 0) break;
                }
                if (ee.match_length = 0, ee.lookahead >= F && 0 < ee.strstart && (re = Se[Fe = ee.strstart - 1]) === Se[++Fe] && re === Se[++Fe] && re === Se[++Fe]) {
                  Oe = ee.strstart + U;
                  do
                    ;
                  while (re === Se[++Fe] && re === Se[++Fe] && re === Se[++Fe] && re === Se[++Fe] && re === Se[++Fe] && re === Se[++Fe] && re === Se[++Fe] && re === Se[++Fe] && Fe < Oe);
                  ee.match_length = U - (Oe - Fe), ee.match_length > ee.lookahead && (ee.match_length = ee.lookahead);
                }
                if (ee.match_length >= F ? (ve = s._tr_tally(ee, 1, ee.match_length - F), ee.lookahead -= ee.match_length, ee.strstart += ee.match_length, ee.match_length = 0) : (ve = s._tr_tally(ee, 0, ee.window[ee.strstart]), ee.lookahead--, ee.strstart++), ve && (Y(ee, !1), ee.strm.avail_out === 0)) return k;
              }
              return ee.insert = 0, se === x ? (Y(ee, !0), ee.strm.avail_out === 0 ? me : Z) : ee.last_lit && (Y(ee, !1), ee.strm.avail_out === 0) ? k : j;
            })(I, Q) : i[I.level].func(I, Q);
            if (le !== me && le !== Z || (I.status = 666), le === k || le === me) return w.avail_out === 0 && (I.last_flush = -1), l;
            if (le === j && (Q === 1 ? s._tr_align(I) : Q !== 5 && (s._tr_stored_block(I, 0, 0, !1), Q === 3 && (q(I.head), I.lookahead === 0 && (I.strstart = 0, I.block_start = 0, I.insert = 0))), J(w), w.avail_out === 0)) return I.last_flush = -1, l;
          }
          return Q !== x ? l : I.wrap <= 0 ? 1 : (I.wrap === 2 ? (pe(I, 255 & w.adler), pe(I, w.adler >> 8 & 255), pe(I, w.adler >> 16 & 255), pe(I, w.adler >> 24 & 255), pe(I, 255 & w.total_in), pe(I, w.total_in >> 8 & 255), pe(I, w.total_in >> 16 & 255), pe(I, w.total_in >> 24 & 255)) : (ce(I, w.adler >>> 16), ce(I, 65535 & w.adler)), J(w), 0 < I.wrap && (I.wrap = -I.wrap), I.pending !== 0 ? l : 1);
        }, a.deflateEnd = function(w) {
          var Q;
          return w && w.state ? (Q = w.state.status) !== y && Q !== 69 && Q !== 73 && Q !== 91 && Q !== 103 && Q !== W && Q !== 666 ? xe(w, v) : (w.state = null, Q === W ? xe(w, -3) : l) : v;
        }, a.deflateSetDictionary = function(w, Q) {
          var V, I, C, G, oe, le, ee, se, ve = Q.length;
          if (!w || !w.state || (G = (V = w.state).wrap) === 2 || G === 1 && V.status !== y || V.lookahead) return v;
          for (G === 1 && (w.adler = c(w.adler, Q, ve, 0)), V.wrap = 0, ve >= V.w_size && (G === 0 && (q(V.head), V.strstart = 0, V.block_start = 0, V.insert = 0), se = new f.Buf8(V.w_size), f.arraySet(se, Q, ve - V.w_size, V.w_size, 0), Q = se, ve = V.w_size), oe = w.avail_in, le = w.next_in, ee = w.input, w.avail_in = ve, w.next_in = 0, w.input = Q, Te(V); V.lookahead >= F; ) {
            for (I = V.strstart, C = V.lookahead - (F - 1); V.ins_h = (V.ins_h << V.hash_shift ^ V.window[I + F - 1]) & V.hash_mask, V.prev[I & V.w_mask] = V.head[V.ins_h], V.head[V.ins_h] = I, I++, --C; ) ;
            V.strstart = I, V.lookahead = F - 1, Te(V);
          }
          return V.strstart += V.lookahead, V.block_start = V.strstart, V.insert = V.lookahead, V.lookahead = 0, V.match_length = V.prev_length = F - 1, V.match_available = 0, w.next_in = le, w.input = ee, w.avail_in = oe, V.wrap = G, l;
        }, a.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(r, n, a) {
        n.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(r, n, a) {
        n.exports = function(i, f) {
          var s, c, o, u, m, x, l, v, p, d, h, _, g, E, A, P, S, R, F, U, H, y, W, k, j;
          s = i.state, c = i.next_in, k = i.input, o = c + (i.avail_in - 5), u = i.next_out, j = i.output, m = u - (f - i.avail_out), x = u + (i.avail_out - 257), l = s.dmax, v = s.wsize, p = s.whave, d = s.wnext, h = s.window, _ = s.hold, g = s.bits, E = s.lencode, A = s.distcode, P = (1 << s.lenbits) - 1, S = (1 << s.distbits) - 1;
          e: do {
            g < 15 && (_ += k[c++] << g, g += 8, _ += k[c++] << g, g += 8), R = E[_ & P];
            r: for (; ; ) {
              if (_ >>>= F = R >>> 24, g -= F, (F = R >>> 16 & 255) === 0) j[u++] = 65535 & R;
              else {
                if (!(16 & F)) {
                  if ((64 & F) == 0) {
                    R = E[(65535 & R) + (_ & (1 << F) - 1)];
                    continue r;
                  }
                  if (32 & F) {
                    s.mode = 12;
                    break e;
                  }
                  i.msg = "invalid literal/length code", s.mode = 30;
                  break e;
                }
                U = 65535 & R, (F &= 15) && (g < F && (_ += k[c++] << g, g += 8), U += _ & (1 << F) - 1, _ >>>= F, g -= F), g < 15 && (_ += k[c++] << g, g += 8, _ += k[c++] << g, g += 8), R = A[_ & S];
                t: for (; ; ) {
                  if (_ >>>= F = R >>> 24, g -= F, !(16 & (F = R >>> 16 & 255))) {
                    if ((64 & F) == 0) {
                      R = A[(65535 & R) + (_ & (1 << F) - 1)];
                      continue t;
                    }
                    i.msg = "invalid distance code", s.mode = 30;
                    break e;
                  }
                  if (H = 65535 & R, g < (F &= 15) && (_ += k[c++] << g, (g += 8) < F && (_ += k[c++] << g, g += 8)), l < (H += _ & (1 << F) - 1)) {
                    i.msg = "invalid distance too far back", s.mode = 30;
                    break e;
                  }
                  if (_ >>>= F, g -= F, (F = u - m) < H) {
                    if (p < (F = H - F) && s.sane) {
                      i.msg = "invalid distance too far back", s.mode = 30;
                      break e;
                    }
                    if (W = h, (y = 0) === d) {
                      if (y += v - F, F < U) {
                        for (U -= F; j[u++] = h[y++], --F; ) ;
                        y = u - H, W = j;
                      }
                    } else if (d < F) {
                      if (y += v + d - F, (F -= d) < U) {
                        for (U -= F; j[u++] = h[y++], --F; ) ;
                        if (y = 0, d < U) {
                          for (U -= F = d; j[u++] = h[y++], --F; ) ;
                          y = u - H, W = j;
                        }
                      }
                    } else if (y += d - F, F < U) {
                      for (U -= F; j[u++] = h[y++], --F; ) ;
                      y = u - H, W = j;
                    }
                    for (; 2 < U; ) j[u++] = W[y++], j[u++] = W[y++], j[u++] = W[y++], U -= 3;
                    U && (j[u++] = W[y++], 1 < U && (j[u++] = W[y++]));
                  } else {
                    for (y = u - H; j[u++] = j[y++], j[u++] = j[y++], j[u++] = j[y++], 2 < (U -= 3); ) ;
                    U && (j[u++] = j[y++], 1 < U && (j[u++] = j[y++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (c < o && u < x);
          c -= U = g >> 3, _ &= (1 << (g -= U << 3)) - 1, i.next_in = c, i.next_out = u, i.avail_in = c < o ? o - c + 5 : 5 - (c - o), i.avail_out = u < x ? x - u + 257 : 257 - (u - x), s.hold = _, s.bits = g;
        };
      }, {}], 49: [function(r, n, a) {
        var i = r("../utils/common"), f = r("./adler32"), s = r("./crc32"), c = r("./inffast"), o = r("./inftrees"), u = 1, m = 2, x = 0, l = -2, v = 1, p = 852, d = 592;
        function h(y) {
          return (y >>> 24 & 255) + (y >>> 8 & 65280) + ((65280 & y) << 8) + ((255 & y) << 24);
        }
        function _() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new i.Buf16(320), this.work = new i.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function g(y) {
          var W;
          return y && y.state ? (W = y.state, y.total_in = y.total_out = W.total = 0, y.msg = "", W.wrap && (y.adler = 1 & W.wrap), W.mode = v, W.last = 0, W.havedict = 0, W.dmax = 32768, W.head = null, W.hold = 0, W.bits = 0, W.lencode = W.lendyn = new i.Buf32(p), W.distcode = W.distdyn = new i.Buf32(d), W.sane = 1, W.back = -1, x) : l;
        }
        function E(y) {
          var W;
          return y && y.state ? ((W = y.state).wsize = 0, W.whave = 0, W.wnext = 0, g(y)) : l;
        }
        function A(y, W) {
          var k, j;
          return y && y.state ? (j = y.state, W < 0 ? (k = 0, W = -W) : (k = 1 + (W >> 4), W < 48 && (W &= 15)), W && (W < 8 || 15 < W) ? l : (j.window !== null && j.wbits !== W && (j.window = null), j.wrap = k, j.wbits = W, E(y))) : l;
        }
        function P(y, W) {
          var k, j;
          return y ? (j = new _(), (y.state = j).window = null, (k = A(y, W)) !== x && (y.state = null), k) : l;
        }
        var S, R, F = !0;
        function U(y) {
          if (F) {
            var W;
            for (S = new i.Buf32(512), R = new i.Buf32(32), W = 0; W < 144; ) y.lens[W++] = 8;
            for (; W < 256; ) y.lens[W++] = 9;
            for (; W < 280; ) y.lens[W++] = 7;
            for (; W < 288; ) y.lens[W++] = 8;
            for (o(u, y.lens, 0, 288, S, 0, y.work, { bits: 9 }), W = 0; W < 32; ) y.lens[W++] = 5;
            o(m, y.lens, 0, 32, R, 0, y.work, { bits: 5 }), F = !1;
          }
          y.lencode = S, y.lenbits = 9, y.distcode = R, y.distbits = 5;
        }
        function H(y, W, k, j) {
          var me, Z = y.state;
          return Z.window === null && (Z.wsize = 1 << Z.wbits, Z.wnext = 0, Z.whave = 0, Z.window = new i.Buf8(Z.wsize)), j >= Z.wsize ? (i.arraySet(Z.window, W, k - Z.wsize, Z.wsize, 0), Z.wnext = 0, Z.whave = Z.wsize) : (j < (me = Z.wsize - Z.wnext) && (me = j), i.arraySet(Z.window, W, k - j, me, Z.wnext), (j -= me) ? (i.arraySet(Z.window, W, k - j, j, 0), Z.wnext = j, Z.whave = Z.wsize) : (Z.wnext += me, Z.wnext === Z.wsize && (Z.wnext = 0), Z.whave < Z.wsize && (Z.whave += me))), 0;
        }
        a.inflateReset = E, a.inflateReset2 = A, a.inflateResetKeep = g, a.inflateInit = function(y) {
          return P(y, 15);
        }, a.inflateInit2 = P, a.inflate = function(y, W) {
          var k, j, me, Z, xe, fe, q, J, Y, pe, ce, de, Te, Ce, O, K, X, z, he, N, w, Q, V, I, C = 0, G = new i.Buf8(4), oe = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!y || !y.state || !y.output || !y.input && y.avail_in !== 0) return l;
          (k = y.state).mode === 12 && (k.mode = 13), xe = y.next_out, me = y.output, q = y.avail_out, Z = y.next_in, j = y.input, fe = y.avail_in, J = k.hold, Y = k.bits, pe = fe, ce = q, Q = x;
          e: for (; ; ) switch (k.mode) {
            case v:
              if (k.wrap === 0) {
                k.mode = 13;
                break;
              }
              for (; Y < 16; ) {
                if (fe === 0) break e;
                fe--, J += j[Z++] << Y, Y += 8;
              }
              if (2 & k.wrap && J === 35615) {
                G[k.check = 0] = 255 & J, G[1] = J >>> 8 & 255, k.check = s(k.check, G, 2, 0), Y = J = 0, k.mode = 2;
                break;
              }
              if (k.flags = 0, k.head && (k.head.done = !1), !(1 & k.wrap) || (((255 & J) << 8) + (J >> 8)) % 31) {
                y.msg = "incorrect header check", k.mode = 30;
                break;
              }
              if ((15 & J) != 8) {
                y.msg = "unknown compression method", k.mode = 30;
                break;
              }
              if (Y -= 4, w = 8 + (15 & (J >>>= 4)), k.wbits === 0) k.wbits = w;
              else if (w > k.wbits) {
                y.msg = "invalid window size", k.mode = 30;
                break;
              }
              k.dmax = 1 << w, y.adler = k.check = 1, k.mode = 512 & J ? 10 : 12, Y = J = 0;
              break;
            case 2:
              for (; Y < 16; ) {
                if (fe === 0) break e;
                fe--, J += j[Z++] << Y, Y += 8;
              }
              if (k.flags = J, (255 & k.flags) != 8) {
                y.msg = "unknown compression method", k.mode = 30;
                break;
              }
              if (57344 & k.flags) {
                y.msg = "unknown header flags set", k.mode = 30;
                break;
              }
              k.head && (k.head.text = J >> 8 & 1), 512 & k.flags && (G[0] = 255 & J, G[1] = J >>> 8 & 255, k.check = s(k.check, G, 2, 0)), Y = J = 0, k.mode = 3;
            case 3:
              for (; Y < 32; ) {
                if (fe === 0) break e;
                fe--, J += j[Z++] << Y, Y += 8;
              }
              k.head && (k.head.time = J), 512 & k.flags && (G[0] = 255 & J, G[1] = J >>> 8 & 255, G[2] = J >>> 16 & 255, G[3] = J >>> 24 & 255, k.check = s(k.check, G, 4, 0)), Y = J = 0, k.mode = 4;
            case 4:
              for (; Y < 16; ) {
                if (fe === 0) break e;
                fe--, J += j[Z++] << Y, Y += 8;
              }
              k.head && (k.head.xflags = 255 & J, k.head.os = J >> 8), 512 & k.flags && (G[0] = 255 & J, G[1] = J >>> 8 & 255, k.check = s(k.check, G, 2, 0)), Y = J = 0, k.mode = 5;
            case 5:
              if (1024 & k.flags) {
                for (; Y < 16; ) {
                  if (fe === 0) break e;
                  fe--, J += j[Z++] << Y, Y += 8;
                }
                k.length = J, k.head && (k.head.extra_len = J), 512 & k.flags && (G[0] = 255 & J, G[1] = J >>> 8 & 255, k.check = s(k.check, G, 2, 0)), Y = J = 0;
              } else k.head && (k.head.extra = null);
              k.mode = 6;
            case 6:
              if (1024 & k.flags && (fe < (de = k.length) && (de = fe), de && (k.head && (w = k.head.extra_len - k.length, k.head.extra || (k.head.extra = new Array(k.head.extra_len)), i.arraySet(k.head.extra, j, Z, de, w)), 512 & k.flags && (k.check = s(k.check, j, de, Z)), fe -= de, Z += de, k.length -= de), k.length)) break e;
              k.length = 0, k.mode = 7;
            case 7:
              if (2048 & k.flags) {
                if (fe === 0) break e;
                for (de = 0; w = j[Z + de++], k.head && w && k.length < 65536 && (k.head.name += String.fromCharCode(w)), w && de < fe; ) ;
                if (512 & k.flags && (k.check = s(k.check, j, de, Z)), fe -= de, Z += de, w) break e;
              } else k.head && (k.head.name = null);
              k.length = 0, k.mode = 8;
            case 8:
              if (4096 & k.flags) {
                if (fe === 0) break e;
                for (de = 0; w = j[Z + de++], k.head && w && k.length < 65536 && (k.head.comment += String.fromCharCode(w)), w && de < fe; ) ;
                if (512 & k.flags && (k.check = s(k.check, j, de, Z)), fe -= de, Z += de, w) break e;
              } else k.head && (k.head.comment = null);
              k.mode = 9;
            case 9:
              if (512 & k.flags) {
                for (; Y < 16; ) {
                  if (fe === 0) break e;
                  fe--, J += j[Z++] << Y, Y += 8;
                }
                if (J !== (65535 & k.check)) {
                  y.msg = "header crc mismatch", k.mode = 30;
                  break;
                }
                Y = J = 0;
              }
              k.head && (k.head.hcrc = k.flags >> 9 & 1, k.head.done = !0), y.adler = k.check = 0, k.mode = 12;
              break;
            case 10:
              for (; Y < 32; ) {
                if (fe === 0) break e;
                fe--, J += j[Z++] << Y, Y += 8;
              }
              y.adler = k.check = h(J), Y = J = 0, k.mode = 11;
            case 11:
              if (k.havedict === 0) return y.next_out = xe, y.avail_out = q, y.next_in = Z, y.avail_in = fe, k.hold = J, k.bits = Y, 2;
              y.adler = k.check = 1, k.mode = 12;
            case 12:
              if (W === 5 || W === 6) break e;
            case 13:
              if (k.last) {
                J >>>= 7 & Y, Y -= 7 & Y, k.mode = 27;
                break;
              }
              for (; Y < 3; ) {
                if (fe === 0) break e;
                fe--, J += j[Z++] << Y, Y += 8;
              }
              switch (k.last = 1 & J, Y -= 1, 3 & (J >>>= 1)) {
                case 0:
                  k.mode = 14;
                  break;
                case 1:
                  if (U(k), k.mode = 20, W !== 6) break;
                  J >>>= 2, Y -= 2;
                  break e;
                case 2:
                  k.mode = 17;
                  break;
                case 3:
                  y.msg = "invalid block type", k.mode = 30;
              }
              J >>>= 2, Y -= 2;
              break;
            case 14:
              for (J >>>= 7 & Y, Y -= 7 & Y; Y < 32; ) {
                if (fe === 0) break e;
                fe--, J += j[Z++] << Y, Y += 8;
              }
              if ((65535 & J) != (J >>> 16 ^ 65535)) {
                y.msg = "invalid stored block lengths", k.mode = 30;
                break;
              }
              if (k.length = 65535 & J, Y = J = 0, k.mode = 15, W === 6) break e;
            case 15:
              k.mode = 16;
            case 16:
              if (de = k.length) {
                if (fe < de && (de = fe), q < de && (de = q), de === 0) break e;
                i.arraySet(me, j, Z, de, xe), fe -= de, Z += de, q -= de, xe += de, k.length -= de;
                break;
              }
              k.mode = 12;
              break;
            case 17:
              for (; Y < 14; ) {
                if (fe === 0) break e;
                fe--, J += j[Z++] << Y, Y += 8;
              }
              if (k.nlen = 257 + (31 & J), J >>>= 5, Y -= 5, k.ndist = 1 + (31 & J), J >>>= 5, Y -= 5, k.ncode = 4 + (15 & J), J >>>= 4, Y -= 4, 286 < k.nlen || 30 < k.ndist) {
                y.msg = "too many length or distance symbols", k.mode = 30;
                break;
              }
              k.have = 0, k.mode = 18;
            case 18:
              for (; k.have < k.ncode; ) {
                for (; Y < 3; ) {
                  if (fe === 0) break e;
                  fe--, J += j[Z++] << Y, Y += 8;
                }
                k.lens[oe[k.have++]] = 7 & J, J >>>= 3, Y -= 3;
              }
              for (; k.have < 19; ) k.lens[oe[k.have++]] = 0;
              if (k.lencode = k.lendyn, k.lenbits = 7, V = { bits: k.lenbits }, Q = o(0, k.lens, 0, 19, k.lencode, 0, k.work, V), k.lenbits = V.bits, Q) {
                y.msg = "invalid code lengths set", k.mode = 30;
                break;
              }
              k.have = 0, k.mode = 19;
            case 19:
              for (; k.have < k.nlen + k.ndist; ) {
                for (; K = (C = k.lencode[J & (1 << k.lenbits) - 1]) >>> 16 & 255, X = 65535 & C, !((O = C >>> 24) <= Y); ) {
                  if (fe === 0) break e;
                  fe--, J += j[Z++] << Y, Y += 8;
                }
                if (X < 16) J >>>= O, Y -= O, k.lens[k.have++] = X;
                else {
                  if (X === 16) {
                    for (I = O + 2; Y < I; ) {
                      if (fe === 0) break e;
                      fe--, J += j[Z++] << Y, Y += 8;
                    }
                    if (J >>>= O, Y -= O, k.have === 0) {
                      y.msg = "invalid bit length repeat", k.mode = 30;
                      break;
                    }
                    w = k.lens[k.have - 1], de = 3 + (3 & J), J >>>= 2, Y -= 2;
                  } else if (X === 17) {
                    for (I = O + 3; Y < I; ) {
                      if (fe === 0) break e;
                      fe--, J += j[Z++] << Y, Y += 8;
                    }
                    Y -= O, w = 0, de = 3 + (7 & (J >>>= O)), J >>>= 3, Y -= 3;
                  } else {
                    for (I = O + 7; Y < I; ) {
                      if (fe === 0) break e;
                      fe--, J += j[Z++] << Y, Y += 8;
                    }
                    Y -= O, w = 0, de = 11 + (127 & (J >>>= O)), J >>>= 7, Y -= 7;
                  }
                  if (k.have + de > k.nlen + k.ndist) {
                    y.msg = "invalid bit length repeat", k.mode = 30;
                    break;
                  }
                  for (; de--; ) k.lens[k.have++] = w;
                }
              }
              if (k.mode === 30) break;
              if (k.lens[256] === 0) {
                y.msg = "invalid code -- missing end-of-block", k.mode = 30;
                break;
              }
              if (k.lenbits = 9, V = { bits: k.lenbits }, Q = o(u, k.lens, 0, k.nlen, k.lencode, 0, k.work, V), k.lenbits = V.bits, Q) {
                y.msg = "invalid literal/lengths set", k.mode = 30;
                break;
              }
              if (k.distbits = 6, k.distcode = k.distdyn, V = { bits: k.distbits }, Q = o(m, k.lens, k.nlen, k.ndist, k.distcode, 0, k.work, V), k.distbits = V.bits, Q) {
                y.msg = "invalid distances set", k.mode = 30;
                break;
              }
              if (k.mode = 20, W === 6) break e;
            case 20:
              k.mode = 21;
            case 21:
              if (6 <= fe && 258 <= q) {
                y.next_out = xe, y.avail_out = q, y.next_in = Z, y.avail_in = fe, k.hold = J, k.bits = Y, c(y, ce), xe = y.next_out, me = y.output, q = y.avail_out, Z = y.next_in, j = y.input, fe = y.avail_in, J = k.hold, Y = k.bits, k.mode === 12 && (k.back = -1);
                break;
              }
              for (k.back = 0; K = (C = k.lencode[J & (1 << k.lenbits) - 1]) >>> 16 & 255, X = 65535 & C, !((O = C >>> 24) <= Y); ) {
                if (fe === 0) break e;
                fe--, J += j[Z++] << Y, Y += 8;
              }
              if (K && (240 & K) == 0) {
                for (z = O, he = K, N = X; K = (C = k.lencode[N + ((J & (1 << z + he) - 1) >> z)]) >>> 16 & 255, X = 65535 & C, !(z + (O = C >>> 24) <= Y); ) {
                  if (fe === 0) break e;
                  fe--, J += j[Z++] << Y, Y += 8;
                }
                J >>>= z, Y -= z, k.back += z;
              }
              if (J >>>= O, Y -= O, k.back += O, k.length = X, K === 0) {
                k.mode = 26;
                break;
              }
              if (32 & K) {
                k.back = -1, k.mode = 12;
                break;
              }
              if (64 & K) {
                y.msg = "invalid literal/length code", k.mode = 30;
                break;
              }
              k.extra = 15 & K, k.mode = 22;
            case 22:
              if (k.extra) {
                for (I = k.extra; Y < I; ) {
                  if (fe === 0) break e;
                  fe--, J += j[Z++] << Y, Y += 8;
                }
                k.length += J & (1 << k.extra) - 1, J >>>= k.extra, Y -= k.extra, k.back += k.extra;
              }
              k.was = k.length, k.mode = 23;
            case 23:
              for (; K = (C = k.distcode[J & (1 << k.distbits) - 1]) >>> 16 & 255, X = 65535 & C, !((O = C >>> 24) <= Y); ) {
                if (fe === 0) break e;
                fe--, J += j[Z++] << Y, Y += 8;
              }
              if ((240 & K) == 0) {
                for (z = O, he = K, N = X; K = (C = k.distcode[N + ((J & (1 << z + he) - 1) >> z)]) >>> 16 & 255, X = 65535 & C, !(z + (O = C >>> 24) <= Y); ) {
                  if (fe === 0) break e;
                  fe--, J += j[Z++] << Y, Y += 8;
                }
                J >>>= z, Y -= z, k.back += z;
              }
              if (J >>>= O, Y -= O, k.back += O, 64 & K) {
                y.msg = "invalid distance code", k.mode = 30;
                break;
              }
              k.offset = X, k.extra = 15 & K, k.mode = 24;
            case 24:
              if (k.extra) {
                for (I = k.extra; Y < I; ) {
                  if (fe === 0) break e;
                  fe--, J += j[Z++] << Y, Y += 8;
                }
                k.offset += J & (1 << k.extra) - 1, J >>>= k.extra, Y -= k.extra, k.back += k.extra;
              }
              if (k.offset > k.dmax) {
                y.msg = "invalid distance too far back", k.mode = 30;
                break;
              }
              k.mode = 25;
            case 25:
              if (q === 0) break e;
              if (de = ce - q, k.offset > de) {
                if ((de = k.offset - de) > k.whave && k.sane) {
                  y.msg = "invalid distance too far back", k.mode = 30;
                  break;
                }
                Te = de > k.wnext ? (de -= k.wnext, k.wsize - de) : k.wnext - de, de > k.length && (de = k.length), Ce = k.window;
              } else Ce = me, Te = xe - k.offset, de = k.length;
              for (q < de && (de = q), q -= de, k.length -= de; me[xe++] = Ce[Te++], --de; ) ;
              k.length === 0 && (k.mode = 21);
              break;
            case 26:
              if (q === 0) break e;
              me[xe++] = k.length, q--, k.mode = 21;
              break;
            case 27:
              if (k.wrap) {
                for (; Y < 32; ) {
                  if (fe === 0) break e;
                  fe--, J |= j[Z++] << Y, Y += 8;
                }
                if (ce -= q, y.total_out += ce, k.total += ce, ce && (y.adler = k.check = k.flags ? s(k.check, me, ce, xe - ce) : f(k.check, me, ce, xe - ce)), ce = q, (k.flags ? J : h(J)) !== k.check) {
                  y.msg = "incorrect data check", k.mode = 30;
                  break;
                }
                Y = J = 0;
              }
              k.mode = 28;
            case 28:
              if (k.wrap && k.flags) {
                for (; Y < 32; ) {
                  if (fe === 0) break e;
                  fe--, J += j[Z++] << Y, Y += 8;
                }
                if (J !== (4294967295 & k.total)) {
                  y.msg = "incorrect length check", k.mode = 30;
                  break;
                }
                Y = J = 0;
              }
              k.mode = 29;
            case 29:
              Q = 1;
              break e;
            case 30:
              Q = -3;
              break e;
            case 31:
              return -4;
            case 32:
            default:
              return l;
          }
          return y.next_out = xe, y.avail_out = q, y.next_in = Z, y.avail_in = fe, k.hold = J, k.bits = Y, (k.wsize || ce !== y.avail_out && k.mode < 30 && (k.mode < 27 || W !== 4)) && H(y, y.output, y.next_out, ce - y.avail_out) ? (k.mode = 31, -4) : (pe -= y.avail_in, ce -= y.avail_out, y.total_in += pe, y.total_out += ce, k.total += ce, k.wrap && ce && (y.adler = k.check = k.flags ? s(k.check, me, ce, y.next_out - ce) : f(k.check, me, ce, y.next_out - ce)), y.data_type = k.bits + (k.last ? 64 : 0) + (k.mode === 12 ? 128 : 0) + (k.mode === 20 || k.mode === 15 ? 256 : 0), (pe == 0 && ce === 0 || W === 4) && Q === x && (Q = -5), Q);
        }, a.inflateEnd = function(y) {
          if (!y || !y.state) return l;
          var W = y.state;
          return W.window && (W.window = null), y.state = null, x;
        }, a.inflateGetHeader = function(y, W) {
          var k;
          return y && y.state ? (2 & (k = y.state).wrap) == 0 ? l : ((k.head = W).done = !1, x) : l;
        }, a.inflateSetDictionary = function(y, W) {
          var k, j = W.length;
          return y && y.state ? (k = y.state).wrap !== 0 && k.mode !== 11 ? l : k.mode === 11 && f(1, W, j, 0) !== k.check ? -3 : H(y, W, j, j) ? (k.mode = 31, -4) : (k.havedict = 1, x) : l;
        }, a.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(r, n, a) {
        var i = r("../utils/common"), f = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], s = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], c = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], o = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        n.exports = function(u, m, x, l, v, p, d, h) {
          var _, g, E, A, P, S, R, F, U, H = h.bits, y = 0, W = 0, k = 0, j = 0, me = 0, Z = 0, xe = 0, fe = 0, q = 0, J = 0, Y = null, pe = 0, ce = new i.Buf16(16), de = new i.Buf16(16), Te = null, Ce = 0;
          for (y = 0; y <= 15; y++) ce[y] = 0;
          for (W = 0; W < l; W++) ce[m[x + W]]++;
          for (me = H, j = 15; 1 <= j && ce[j] === 0; j--) ;
          if (j < me && (me = j), j === 0) return v[p++] = 20971520, v[p++] = 20971520, h.bits = 1, 0;
          for (k = 1; k < j && ce[k] === 0; k++) ;
          for (me < k && (me = k), y = fe = 1; y <= 15; y++) if (fe <<= 1, (fe -= ce[y]) < 0) return -1;
          if (0 < fe && (u === 0 || j !== 1)) return -1;
          for (de[1] = 0, y = 1; y < 15; y++) de[y + 1] = de[y] + ce[y];
          for (W = 0; W < l; W++) m[x + W] !== 0 && (d[de[m[x + W]]++] = W);
          if (S = u === 0 ? (Y = Te = d, 19) : u === 1 ? (Y = f, pe -= 257, Te = s, Ce -= 257, 256) : (Y = c, Te = o, -1), y = k, P = p, xe = W = J = 0, E = -1, A = (q = 1 << (Z = me)) - 1, u === 1 && 852 < q || u === 2 && 592 < q) return 1;
          for (; ; ) {
            for (R = y - xe, U = d[W] < S ? (F = 0, d[W]) : d[W] > S ? (F = Te[Ce + d[W]], Y[pe + d[W]]) : (F = 96, 0), _ = 1 << y - xe, k = g = 1 << Z; v[P + (J >> xe) + (g -= _)] = R << 24 | F << 16 | U | 0, g !== 0; ) ;
            for (_ = 1 << y - 1; J & _; ) _ >>= 1;
            if (_ !== 0 ? (J &= _ - 1, J += _) : J = 0, W++, --ce[y] == 0) {
              if (y === j) break;
              y = m[x + d[W]];
            }
            if (me < y && (J & A) !== E) {
              for (xe === 0 && (xe = me), P += k, fe = 1 << (Z = y - xe); Z + xe < j && !((fe -= ce[Z + xe]) <= 0); ) Z++, fe <<= 1;
              if (q += 1 << Z, u === 1 && 852 < q || u === 2 && 592 < q) return 1;
              v[E = J & A] = me << 24 | Z << 16 | P - p | 0;
            }
          }
          return J !== 0 && (v[P + J] = y - xe << 24 | 64 << 16 | 0), h.bits = me, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(r, n, a) {
        n.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(r, n, a) {
        var i = r("../utils/common"), f = 0, s = 1;
        function c(C) {
          for (var G = C.length; 0 <= --G; ) C[G] = 0;
        }
        var o = 0, u = 29, m = 256, x = m + 1 + u, l = 30, v = 19, p = 2 * x + 1, d = 15, h = 16, _ = 7, g = 256, E = 16, A = 17, P = 18, S = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], R = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], F = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], U = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], H = new Array(2 * (x + 2));
        c(H);
        var y = new Array(2 * l);
        c(y);
        var W = new Array(512);
        c(W);
        var k = new Array(256);
        c(k);
        var j = new Array(u);
        c(j);
        var me, Z, xe, fe = new Array(l);
        function q(C, G, oe, le, ee) {
          this.static_tree = C, this.extra_bits = G, this.extra_base = oe, this.elems = le, this.max_length = ee, this.has_stree = C && C.length;
        }
        function J(C, G) {
          this.dyn_tree = C, this.max_code = 0, this.stat_desc = G;
        }
        function Y(C) {
          return C < 256 ? W[C] : W[256 + (C >>> 7)];
        }
        function pe(C, G) {
          C.pending_buf[C.pending++] = 255 & G, C.pending_buf[C.pending++] = G >>> 8 & 255;
        }
        function ce(C, G, oe) {
          C.bi_valid > h - oe ? (C.bi_buf |= G << C.bi_valid & 65535, pe(C, C.bi_buf), C.bi_buf = G >> h - C.bi_valid, C.bi_valid += oe - h) : (C.bi_buf |= G << C.bi_valid & 65535, C.bi_valid += oe);
        }
        function de(C, G, oe) {
          ce(C, oe[2 * G], oe[2 * G + 1]);
        }
        function Te(C, G) {
          for (var oe = 0; oe |= 1 & C, C >>>= 1, oe <<= 1, 0 < --G; ) ;
          return oe >>> 1;
        }
        function Ce(C, G, oe) {
          var le, ee, se = new Array(d + 1), ve = 0;
          for (le = 1; le <= d; le++) se[le] = ve = ve + oe[le - 1] << 1;
          for (ee = 0; ee <= G; ee++) {
            var re = C[2 * ee + 1];
            re !== 0 && (C[2 * ee] = Te(se[re]++, re));
          }
        }
        function O(C) {
          var G;
          for (G = 0; G < x; G++) C.dyn_ltree[2 * G] = 0;
          for (G = 0; G < l; G++) C.dyn_dtree[2 * G] = 0;
          for (G = 0; G < v; G++) C.bl_tree[2 * G] = 0;
          C.dyn_ltree[2 * g] = 1, C.opt_len = C.static_len = 0, C.last_lit = C.matches = 0;
        }
        function K(C) {
          8 < C.bi_valid ? pe(C, C.bi_buf) : 0 < C.bi_valid && (C.pending_buf[C.pending++] = C.bi_buf), C.bi_buf = 0, C.bi_valid = 0;
        }
        function X(C, G, oe, le) {
          var ee = 2 * G, se = 2 * oe;
          return C[ee] < C[se] || C[ee] === C[se] && le[G] <= le[oe];
        }
        function z(C, G, oe) {
          for (var le = C.heap[oe], ee = oe << 1; ee <= C.heap_len && (ee < C.heap_len && X(G, C.heap[ee + 1], C.heap[ee], C.depth) && ee++, !X(G, le, C.heap[ee], C.depth)); ) C.heap[oe] = C.heap[ee], oe = ee, ee <<= 1;
          C.heap[oe] = le;
        }
        function he(C, G, oe) {
          var le, ee, se, ve, re = 0;
          if (C.last_lit !== 0) for (; le = C.pending_buf[C.d_buf + 2 * re] << 8 | C.pending_buf[C.d_buf + 2 * re + 1], ee = C.pending_buf[C.l_buf + re], re++, le === 0 ? de(C, ee, G) : (de(C, (se = k[ee]) + m + 1, G), (ve = S[se]) !== 0 && ce(C, ee -= j[se], ve), de(C, se = Y(--le), oe), (ve = R[se]) !== 0 && ce(C, le -= fe[se], ve)), re < C.last_lit; ) ;
          de(C, g, G);
        }
        function N(C, G) {
          var oe, le, ee, se = G.dyn_tree, ve = G.stat_desc.static_tree, re = G.stat_desc.has_stree, Fe = G.stat_desc.elems, Oe = -1;
          for (C.heap_len = 0, C.heap_max = p, oe = 0; oe < Fe; oe++) se[2 * oe] !== 0 ? (C.heap[++C.heap_len] = Oe = oe, C.depth[oe] = 0) : se[2 * oe + 1] = 0;
          for (; C.heap_len < 2; ) se[2 * (ee = C.heap[++C.heap_len] = Oe < 2 ? ++Oe : 0)] = 1, C.depth[ee] = 0, C.opt_len--, re && (C.static_len -= ve[2 * ee + 1]);
          for (G.max_code = Oe, oe = C.heap_len >> 1; 1 <= oe; oe--) z(C, se, oe);
          for (ee = Fe; oe = C.heap[1], C.heap[1] = C.heap[C.heap_len--], z(C, se, 1), le = C.heap[1], C.heap[--C.heap_max] = oe, C.heap[--C.heap_max] = le, se[2 * ee] = se[2 * oe] + se[2 * le], C.depth[ee] = (C.depth[oe] >= C.depth[le] ? C.depth[oe] : C.depth[le]) + 1, se[2 * oe + 1] = se[2 * le + 1] = ee, C.heap[1] = ee++, z(C, se, 1), 2 <= C.heap_len; ) ;
          C.heap[--C.heap_max] = C.heap[1], (function(Se, je) {
            var qe, ke, Ne, De, $e, Cr, lr = je.dyn_tree, pt = je.max_code, Ta = je.stat_desc.static_tree, ya = je.stat_desc.has_stree, Aa = je.stat_desc.extra_bits, Fa = je.stat_desc.extra_base, mt = je.stat_desc.max_length, Qr = 0;
            for (De = 0; De <= d; De++) Se.bl_count[De] = 0;
            for (lr[2 * Se.heap[Se.heap_max] + 1] = 0, qe = Se.heap_max + 1; qe < p; qe++) mt < (De = lr[2 * lr[2 * (ke = Se.heap[qe]) + 1] + 1] + 1) && (De = mt, Qr++), lr[2 * ke + 1] = De, pt < ke || (Se.bl_count[De]++, $e = 0, Fa <= ke && ($e = Aa[ke - Fa]), Cr = lr[2 * ke], Se.opt_len += Cr * (De + $e), ya && (Se.static_len += Cr * (Ta[2 * ke + 1] + $e)));
            if (Qr !== 0) {
              do {
                for (De = mt - 1; Se.bl_count[De] === 0; ) De--;
                Se.bl_count[De]--, Se.bl_count[De + 1] += 2, Se.bl_count[mt]--, Qr -= 2;
              } while (0 < Qr);
              for (De = mt; De !== 0; De--) for (ke = Se.bl_count[De]; ke !== 0; ) pt < (Ne = Se.heap[--qe]) || (lr[2 * Ne + 1] !== De && (Se.opt_len += (De - lr[2 * Ne + 1]) * lr[2 * Ne], lr[2 * Ne + 1] = De), ke--);
            }
          })(C, G), Ce(se, Oe, C.bl_count);
        }
        function w(C, G, oe) {
          var le, ee, se = -1, ve = G[1], re = 0, Fe = 7, Oe = 4;
          for (ve === 0 && (Fe = 138, Oe = 3), G[2 * (oe + 1) + 1] = 65535, le = 0; le <= oe; le++) ee = ve, ve = G[2 * (le + 1) + 1], ++re < Fe && ee === ve || (re < Oe ? C.bl_tree[2 * ee] += re : ee !== 0 ? (ee !== se && C.bl_tree[2 * ee]++, C.bl_tree[2 * E]++) : re <= 10 ? C.bl_tree[2 * A]++ : C.bl_tree[2 * P]++, se = ee, Oe = (re = 0) === ve ? (Fe = 138, 3) : ee === ve ? (Fe = 6, 3) : (Fe = 7, 4));
        }
        function Q(C, G, oe) {
          var le, ee, se = -1, ve = G[1], re = 0, Fe = 7, Oe = 4;
          for (ve === 0 && (Fe = 138, Oe = 3), le = 0; le <= oe; le++) if (ee = ve, ve = G[2 * (le + 1) + 1], !(++re < Fe && ee === ve)) {
            if (re < Oe) for (; de(C, ee, C.bl_tree), --re != 0; ) ;
            else ee !== 0 ? (ee !== se && (de(C, ee, C.bl_tree), re--), de(C, E, C.bl_tree), ce(C, re - 3, 2)) : re <= 10 ? (de(C, A, C.bl_tree), ce(C, re - 3, 3)) : (de(C, P, C.bl_tree), ce(C, re - 11, 7));
            se = ee, Oe = (re = 0) === ve ? (Fe = 138, 3) : ee === ve ? (Fe = 6, 3) : (Fe = 7, 4);
          }
        }
        c(fe);
        var V = !1;
        function I(C, G, oe, le) {
          ce(C, (o << 1) + (le ? 1 : 0), 3), (function(ee, se, ve, re) {
            K(ee), pe(ee, ve), pe(ee, ~ve), i.arraySet(ee.pending_buf, ee.window, se, ve, ee.pending), ee.pending += ve;
          })(C, G, oe);
        }
        a._tr_init = function(C) {
          V || ((function() {
            var G, oe, le, ee, se, ve = new Array(d + 1);
            for (ee = le = 0; ee < u - 1; ee++) for (j[ee] = le, G = 0; G < 1 << S[ee]; G++) k[le++] = ee;
            for (k[le - 1] = ee, ee = se = 0; ee < 16; ee++) for (fe[ee] = se, G = 0; G < 1 << R[ee]; G++) W[se++] = ee;
            for (se >>= 7; ee < l; ee++) for (fe[ee] = se << 7, G = 0; G < 1 << R[ee] - 7; G++) W[256 + se++] = ee;
            for (oe = 0; oe <= d; oe++) ve[oe] = 0;
            for (G = 0; G <= 143; ) H[2 * G + 1] = 8, G++, ve[8]++;
            for (; G <= 255; ) H[2 * G + 1] = 9, G++, ve[9]++;
            for (; G <= 279; ) H[2 * G + 1] = 7, G++, ve[7]++;
            for (; G <= 287; ) H[2 * G + 1] = 8, G++, ve[8]++;
            for (Ce(H, x + 1, ve), G = 0; G < l; G++) y[2 * G + 1] = 5, y[2 * G] = Te(G, 5);
            me = new q(H, S, m + 1, x, d), Z = new q(y, R, 0, l, d), xe = new q(new Array(0), F, 0, v, _);
          })(), V = !0), C.l_desc = new J(C.dyn_ltree, me), C.d_desc = new J(C.dyn_dtree, Z), C.bl_desc = new J(C.bl_tree, xe), C.bi_buf = 0, C.bi_valid = 0, O(C);
        }, a._tr_stored_block = I, a._tr_flush_block = function(C, G, oe, le) {
          var ee, se, ve = 0;
          0 < C.level ? (C.strm.data_type === 2 && (C.strm.data_type = (function(re) {
            var Fe, Oe = 4093624447;
            for (Fe = 0; Fe <= 31; Fe++, Oe >>>= 1) if (1 & Oe && re.dyn_ltree[2 * Fe] !== 0) return f;
            if (re.dyn_ltree[18] !== 0 || re.dyn_ltree[20] !== 0 || re.dyn_ltree[26] !== 0) return s;
            for (Fe = 32; Fe < m; Fe++) if (re.dyn_ltree[2 * Fe] !== 0) return s;
            return f;
          })(C)), N(C, C.l_desc), N(C, C.d_desc), ve = (function(re) {
            var Fe;
            for (w(re, re.dyn_ltree, re.l_desc.max_code), w(re, re.dyn_dtree, re.d_desc.max_code), N(re, re.bl_desc), Fe = v - 1; 3 <= Fe && re.bl_tree[2 * U[Fe] + 1] === 0; Fe--) ;
            return re.opt_len += 3 * (Fe + 1) + 5 + 5 + 4, Fe;
          })(C), ee = C.opt_len + 3 + 7 >>> 3, (se = C.static_len + 3 + 7 >>> 3) <= ee && (ee = se)) : ee = se = oe + 5, oe + 4 <= ee && G !== -1 ? I(C, G, oe, le) : C.strategy === 4 || se === ee ? (ce(C, 2 + (le ? 1 : 0), 3), he(C, H, y)) : (ce(C, 4 + (le ? 1 : 0), 3), (function(re, Fe, Oe, Se) {
            var je;
            for (ce(re, Fe - 257, 5), ce(re, Oe - 1, 5), ce(re, Se - 4, 4), je = 0; je < Se; je++) ce(re, re.bl_tree[2 * U[je] + 1], 3);
            Q(re, re.dyn_ltree, Fe - 1), Q(re, re.dyn_dtree, Oe - 1);
          })(C, C.l_desc.max_code + 1, C.d_desc.max_code + 1, ve + 1), he(C, C.dyn_ltree, C.dyn_dtree)), O(C), le && K(C);
        }, a._tr_tally = function(C, G, oe) {
          return C.pending_buf[C.d_buf + 2 * C.last_lit] = G >>> 8 & 255, C.pending_buf[C.d_buf + 2 * C.last_lit + 1] = 255 & G, C.pending_buf[C.l_buf + C.last_lit] = 255 & oe, C.last_lit++, G === 0 ? C.dyn_ltree[2 * oe]++ : (C.matches++, G--, C.dyn_ltree[2 * (k[oe] + m + 1)]++, C.dyn_dtree[2 * Y(G)]++), C.last_lit === C.lit_bufsize - 1;
        }, a._tr_align = function(C) {
          ce(C, 2, 3), de(C, g, H), (function(G) {
            G.bi_valid === 16 ? (pe(G, G.bi_buf), G.bi_buf = 0, G.bi_valid = 0) : 8 <= G.bi_valid && (G.pending_buf[G.pending++] = 255 & G.bi_buf, G.bi_buf >>= 8, G.bi_valid -= 8);
          })(C);
        };
      }, { "../utils/common": 41 }], 53: [function(r, n, a) {
        n.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(r, n, a) {
        (function(i) {
          (function(f, s) {
            if (!f.setImmediate) {
              var c, o, u, m, x = 1, l = {}, v = !1, p = f.document, d = Object.getPrototypeOf && Object.getPrototypeOf(f);
              d = d && d.setTimeout ? d : f, c = {}.toString.call(f.process) === "[object process]" ? function(E) {
                process.nextTick(function() {
                  _(E);
                });
              } : (function() {
                if (f.postMessage && !f.importScripts) {
                  var E = !0, A = f.onmessage;
                  return f.onmessage = function() {
                    E = !1;
                  }, f.postMessage("", "*"), f.onmessage = A, E;
                }
              })() ? (m = "setImmediate$" + Math.random() + "$", f.addEventListener ? f.addEventListener("message", g, !1) : f.attachEvent("onmessage", g), function(E) {
                f.postMessage(m + E, "*");
              }) : f.MessageChannel ? ((u = new MessageChannel()).port1.onmessage = function(E) {
                _(E.data);
              }, function(E) {
                u.port2.postMessage(E);
              }) : p && "onreadystatechange" in p.createElement("script") ? (o = p.documentElement, function(E) {
                var A = p.createElement("script");
                A.onreadystatechange = function() {
                  _(E), A.onreadystatechange = null, o.removeChild(A), A = null;
                }, o.appendChild(A);
              }) : function(E) {
                setTimeout(_, 0, E);
              }, d.setImmediate = function(E) {
                typeof E != "function" && (E = new Function("" + E));
                for (var A = new Array(arguments.length - 1), P = 0; P < A.length; P++) A[P] = arguments[P + 1];
                var S = { callback: E, args: A };
                return l[x] = S, c(x), x++;
              }, d.clearImmediate = h;
            }
            function h(E) {
              delete l[E];
            }
            function _(E) {
              if (v) setTimeout(_, 0, E);
              else {
                var A = l[E];
                if (A) {
                  v = !0;
                  try {
                    (function(P) {
                      var S = P.callback, R = P.args;
                      switch (R.length) {
                        case 0:
                          S();
                          break;
                        case 1:
                          S(R[0]);
                          break;
                        case 2:
                          S(R[0], R[1]);
                          break;
                        case 3:
                          S(R[0], R[1], R[2]);
                          break;
                        default:
                          S.apply(s, R);
                      }
                    })(A);
                  } finally {
                    h(E), v = !1;
                  }
                }
              }
            }
            function g(E) {
              E.source === f && typeof E.data == "string" && E.data.indexOf(m) === 0 && _(+E.data.slice(m.length));
            }
          })(typeof self > "u" ? i === void 0 ? this : i : self);
        }).call(this, typeof Sa < "u" ? Sa : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(kn)), kn.exports;
}
var bp = Cp();
const Ip = /* @__PURE__ */ lf(bp), n0 = 40, In = 2e4, i0 = 256, s0 = 5e5, f0 = 5e3, c0 = 200 * 1024 * 1024, En = 300;
function Op(e) {
  return e.replace(/^\uFEFF/u, "");
}
function Ua(e) {
  const t = Op(e);
  if (!t.trim()) throw new Error("promotion_csv_empty");
  if (t.includes("\0")) throw new Error("promotion_csv_binary_content");
  if (t.includes("�")) throw new Error("promotion_csv_encoding_invalid");
  return t;
}
function za(e, t) {
  return new TextDecoder(e, { fatal: !0 }).decode(t);
}
function Dp(e) {
  const t = e instanceof Uint8Array ? e : new Uint8Array(e);
  if (!t.byteLength) throw new Error("promotion_csv_empty");
  if (t[0] === 255 && t[1] === 254)
    return { text: Ua(za("utf-16le", t.subarray(2))), encoding: "utf-16le", warnings: [] };
  if (t[0] === 254 && t[1] === 255)
    return { text: Ua(za("utf-16be", t.subarray(2))), encoding: "utf-16be", warnings: [] };
  try {
    const r = t[0] === 239 && t[1] === 187 && t[2] === 191 ? 3 : 0;
    return { text: Ua(za("utf-8", t.subarray(r))), encoding: "utf-8", warnings: [] };
  } catch (r) {
    try {
      return { text: Ua(za("windows-874", t)), encoding: "windows-874", warnings: ["csv_decoded_windows_874"] };
    } catch {
      throw r instanceof Error ? new Error("promotion_csv_encoding_unsupported") : new Error("promotion_csv_encoding_unsupported");
    }
  }
}
function Rp(e) {
  if (!Number.isInteger(e.entryCount) || e.entryCount < 1 || e.entryCount > f0)
    throw new Error(`promotion_workbook_zip_entry_limit:${e.entryCount}/${f0}`);
  if (!Number.isFinite(e.uncompressedBytes) || e.uncompressedBytes < 1 || e.uncompressedBytes > c0)
    throw new Error(`promotion_workbook_uncompressed_limit:${e.uncompressedBytes}/${c0}`);
  const t = e.uncompressedBytes / Math.max(1, e.compressedBytes);
  if (!Number.isFinite(e.maximumEntryRatio) || e.maximumEntryRatio > En || t > En)
    throw new Error(`promotion_workbook_compression_ratio:${Math.max(e.maximumEntryRatio, t).toFixed(1)}/${En}`);
}
async function Np(e) {
  const t = e instanceof Uint8Array ? e : new Uint8Array(e), r = await Ip.loadAsync(t, { createFolders: !1, checkCRC32: !1 });
  let n = 0, a = 0, i = 0, f = 0;
  for (const c of Object.values(r.files)) {
    if (c.dir) continue;
    const o = c._data, u = Number(o == null ? void 0 : o.compressedSize), m = Number(o == null ? void 0 : o.uncompressedSize);
    if (!Number.isFinite(u) || u < 0 || !Number.isFinite(m) || m < 0)
      throw new Error("promotion_workbook_zip_metadata_invalid");
    n += 1, a += u, i += m, f = Math.max(f, m / Math.max(1, u));
  }
  const s = { entryCount: n, compressedBytes: a, uncompressedBytes: i, maximumEntryRatio: f };
  return Rp(s), s;
}
function Pp(e) {
  return e["!fullref"] || e["!ref"] || null;
}
function Bp(e) {
  if (!Array.isArray(e.SheetNames) || !e.SheetNames.length) throw new Error("promotion_workbook_no_worksheets");
  if (e.SheetNames.length > n0)
    throw new Error(`promotion_workbook_sheet_limit:${e.SheetNames.length}/${n0}`);
  let t = 0;
  for (const r of e.SheetNames) {
    const n = e.Sheets[r];
    if (!n) throw new Error(`promotion_workbook_sheet_missing:${r}`);
    const a = Pp(n);
    if (!a) continue;
    let i;
    try {
      i = Xs.decode_range(a);
    } catch {
      throw new Error(`promotion_workbook_range_invalid:${r}`);
    }
    const f = i.e.r - i.s.r + 1, s = i.e.c - i.s.c + 1;
    if (f > In)
      throw new Error(`promotion_workbook_row_limit:${r}:${f}/${In}`);
    if (s > i0)
      throw new Error(`promotion_workbook_column_limit:${r}:${s}/${i0}`);
    if (t += f * s, t > s0)
      throw new Error(`promotion_workbook_cell_limit:${t}/${s0}`);
  }
}
const o0 = {
  cellDates: !0,
  dense: !0,
  cellFormula: !1,
  cellHTML: !1,
  cellStyles: !1,
  bookVBA: !1,
  bookDeps: !1,
  sheetRows: In + 1
}, Lp = /* @__PURE__ */ new Set(["HFSS", "HFSM", "HFSL", "HFSXL", "HFSWS-S", "HFSWS-L"]), js = (e) => String(e ?? "").normalize("NFKC").replace(/\u0E4D\u0E32/gu, "ำ"), Zt = (e) => js(e).toUpperCase().replace(/\s+/g, " ").trim(), bt = (e) => Zt(e).replace(/[^A-Z0-9ก-๙]/gu, "");
function Mp(e) {
  let t = 2166136261;
  for (let r = 0; r < e.length; r += 1)
    t ^= e.charCodeAt(r), t = Math.imul(t, 16777619);
  return (t >>> 0).toString(36).toUpperCase().padStart(7, "0");
}
const ei = {
  familyId: ["PROMOTIONFAMILY", "FAMILYID", "PROMOTIONGROUP", "PROMOGROUP", "รหัสกลุ่มโปรโมชั่น", "กลุ่มโปรโมชั่น"],
  name: ["FAMILYNAME", "PROMOTIONNAME", "PROMONAME", "ชื่อโปรโมชั่น", "ชื่อกลุ่ม"],
  scope: ["PRODUCTSCOPE", "PRODUCTDESCRIPTION", "DESCRIPTION", "ITEMDESCRIPTION", "สินค้า", "รายละเอียดสินค้า", "ขอบเขตสินค้า"],
  classId: ["CLASS", "CLASSID", "CUSTOMERCLASS", "STORECLASS", "คลาส", "ระดับร้าน"],
  promotion: ["PROMOTION", "PROMOTIONTIER", "CONDITION", "MECHANIC", "FUNCTION", "เงื่อนไข", "รายการส่งเสริม", "โปรโมชั่น"],
  minQuantity: ["MINQTY", "MINQUANTITY", "BUYQTY", "QTYFROM", "ซื้อขั้นต่ำ", "จำนวนซื้อ"],
  maxQuantity: ["MAXQTY", "MAXQUANTITY", "QTYTO", "ซื้อสูงสุด"],
  discountPercent: ["DISCOUNTPERCENT", "DISCOUNT", "PERCENT", "ส่วนลดเปอร์เซ็นต์", "ลด"],
  freeQuantity: ["FREEQTY", "FREEQUANTITY", "จำนวนแถม", "ของแถม"],
  unit: ["UNIT", "PURCHASEUNIT", "หน่วย", "หน่วยซื้อ"]
};
function Up(e) {
  const t = e.map(bt).filter(Boolean);
  return Object.values(ei).reduce((r, n) => r + (n.some((a) => t.includes(bt(a))) ? 1 : 0), 0);
}
function zp(e) {
  let t = { index: -1, score: 0 };
  if (e.slice(0, 40).forEach((i, f) => {
    const s = Up(i);
    s > t.score && (t = { index: f, score: s });
  }), t.score >= 2) return t.index;
  const n = (e[t.index] || []).map(bt).filter(Boolean), a = ei.scope.map(bt);
  return t.score === 1 && n.length === 1 && a.includes(n[0]) ? t.index : -1;
}
function Wp(e) {
  const t = e.map(bt), r = (n) => {
    const a = ei[n].map(bt), i = t.findIndex((s) => a.includes(s));
    if (i >= 0) return i;
    const f = t.findIndex((s) => s.length >= 4 && a.some((c) => s.includes(c)));
    return f >= 0 ? f : null;
  };
  return {
    familyId: r("familyId"),
    name: r("name"),
    scope: r("scope"),
    classId: r("classId"),
    promotion: r("promotion"),
    minQuantity: r("minQuantity"),
    maxQuantity: r("maxQuantity"),
    discountPercent: r("discountPercent"),
    freeQuantity: r("freeQuantity"),
    unit: r("unit")
  };
}
function Mr(e, t) {
  return t == null ? null : e[t];
}
function Wa(e) {
  const t = Number(String(e ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(t) && t > 0 ? t : null;
}
function Hp(e, t, r) {
  const n = Wa(Mr(e, t.minQuantity)), a = Wa(Mr(e, t.maxQuantity)), i = Wa(Mr(e, t.discountPercent)), f = Wa(Mr(e, t.freeQuantity)), s = String(Mr(e, t.unit) || "ชิ้น").trim();
  return n && f ? [{
    tierNo: 1,
    type: "free_goods",
    minQuantity: n,
    maxQuantity: a,
    purchaseUnit: s,
    discountPercent: null,
    freeQuantity: f,
    rewardUnit: s,
    bundlePrice: null,
    effectivePercent: Number((f / (n + f) * 100).toFixed(2)),
    effectivePercentUsage: "display_only",
    sourceText: r
  }] : n && i && i <= 100 ? [{
    tierNo: 1,
    type: "cash_discount",
    minQuantity: n,
    maxQuantity: a,
    purchaseUnit: s,
    discountPercent: i,
    freeQuantity: 0,
    rewardUnit: null,
    bundlePrice: null,
    effectivePercent: null,
    effectivePercentUsage: null,
    sourceText: r
  }] : [];
}
function Ks(e, t) {
  const r = /* @__PURE__ */ new Map();
  [...e, ...t].forEach((a) => {
    const i = `${a.type}|${a.minQuantity}|${a.maxQuantity ?? ""}|${a.discountPercent ?? ""}|${a.freeQuantity}|${a.purchaseUnit}`;
    r.set(i, a);
  });
  const n = [...r.values()].sort((a, i) => a.minQuantity - i.minQuantity);
  return n.forEach((a, i) => {
    a.tierNo = i + 1;
  }), n;
}
function Vp(e) {
  const t = js(e).replace(/\s+/g, " ").trim(), r = t.match(/\[\s*(?:เฉพาะช่องทาง|CHANNEL|CLASS)\s*[:=-]?\s*([^\]]+)\]/iu), n = $s((r == null ? void 0 : r[1]) || ""), a = t.replace((r == null ? void 0 : r[0]) || "", "").trim(), i = a.search(/(?:^|\s)(?:ขั้นต่ำ\s*\d|(?:เมื่อ\s*)?ซื้อ(?:ขั้นต่ำ)?\s*\d)/iu);
  return i < 0 ? { scope: a, promotion: a, classIds: n } : {
    scope: a.slice(0, i).replace(/[,:;\s]+$/u, "").trim(),
    promotion: a.slice(i).trim(),
    classIds: n
  };
}
function Gp(e, t) {
  const r = zp(e);
  if (r < 0) return { families: [], headerRow: -1, acceptedRows: 0, warnings: [`sheet:${t}:header_not_found`] };
  const n = Wp(e[r]), a = n.scope != null && n.classId == null && n.promotion == null, i = [];
  n.classId == null && !a && i.push(`sheet:${t}:class_column_missing`), n.promotion == null && n.minQuantity == null && !a && i.push(`sheet:${t}:promotion_columns_missing`);
  const f = /* @__PURE__ */ new Map();
  let s = "", c = "", o = "", u = 0;
  return e.slice(r + 1).forEach((m, x) => {
    const l = r + x + 2;
    if (!m.some((F) => Zt(F))) {
      s = "", c = "", o = "";
      return;
    }
    const v = a ? Vp(Mr(m, n.scope)) : null, p = Zt(Mr(m, n.familyId)), d = Zt(Mr(m, n.name)), h = Zt((v == null ? void 0 : v.scope) || Mr(m, n.scope));
    p && (s = p), d && (c = d), h && (o = h);
    const _ = s || o || c, g = (v == null ? void 0 : v.classIds) || $s(Mr(m, n.classId)), E = (v == null ? void 0 : v.promotion) || String(Mr(m, n.promotion) || "").trim();
    if (!_ && !g.length && !E) return;
    if (!_) {
      i.push(`sheet:${t}:row:${l}:family_scope_missing`);
      return;
    }
    const A = `PF-${Mp(bt(_))}`, P = f.get(A) || {
      id: `family:${A}`,
      familyKey: A,
      name: c || o || s,
      scopeText: o || c || s,
      sourceRows: [],
      tiersByClass: {},
      failureReasons: []
    };
    P.sourceRows.push(l), g.length || P.failureReasons.push(`row:${l}:class_missing`);
    const S = Sp(E, String(Mr(m, n.unit) || "ชิ้น")), R = S.tiers.length ? S.tiers : Hp(m, n, E || `row ${l}`);
    R.length || P.failureReasons.push(`row:${l}:tiers_missing`), g.forEach((F) => {
      P.tiersByClass[F] = Ks(P.tiersByClass[F] || [], R);
    }), P.failureReasons.push(...S.failureReasons.filter((F) => F !== "promotion_text_missing" || !R.length).map((F) => `row:${l}:${F}`)), P.failureReasons = [...new Set(P.failureReasons)], P.sourceRows = [...new Set(P.sourceRows)], f.set(A, P), u += 1;
  }), { families: [...f.values()], headerRow: r, acceptedRows: u, warnings: i };
}
async function Kp(e) {
  const t = cf(e);
  if (!t.kind || t.error) throw new Error(t.error || "ชนิดไฟล์ตารางโปรโมชั่นไม่ถูกต้อง");
  const r = await e.arrayBuffer(), n = of(t.kind, r);
  if (n) throw new Error(n);
  const a = [];
  let i;
  try {
    if (t.kind === "csv") {
      const x = Dp(r);
      a.push(...x.warnings), i = yt(x.text, { ...o0, type: "string" });
    } else
      (t.kind === "xlsx" || t.kind === "xlsm") && await Np(r), i = yt(r, { ...o0, type: "array" });
    Bp(i);
  } catch (x) {
    throw (x instanceof Error ? x.message : String(x)).startsWith("promotion_") ? x : new Error(`อ่านไฟล์ ${t.label} ไม่สำเร็จ กรุณาเปิดใน Excel แล้ว Save As ใหม่โดยไม่ตั้งรหัสผ่าน`);
  }
  const f = /* @__PURE__ */ new Map(), s = [];
  for (const x of i.SheetNames) {
    const l = Xs.sheet_to_json(i.Sheets[x], { header: 1, raw: !1, defval: null }), v = Gp(l, x);
    s.push({ name: x, headerRow: v.headerRow + 1, rows: l.length, acceptedRows: v.acceptedRows, warnings: v.warnings }), a.push(...v.warnings);
    for (const p of v.families) {
      const d = f.get(p.familyKey);
      if (!d) {
        f.set(p.familyKey, p);
        continue;
      }
      d.sourceRows = [.../* @__PURE__ */ new Set([...d.sourceRows, ...p.sourceRows])], d.failureReasons = [.../* @__PURE__ */ new Set([...d.failureReasons, ...p.failureReasons])], Object.entries(p.tiersByClass).forEach(([h, _]) => {
        d.tiersByClass[h] = Ks(d.tiersByClass[h] || [], _);
      });
    }
  }
  const c = [...f.values()].sort((x, l) => x.name.localeCompare(l.name, "th"));
  if (!c.length) throw new Error("promotion_family_not_found_in_workbook");
  const o = c.flatMap((x) => Object.keys(x.tiersByClass)), u = [...new Set(o.filter((x) => !Lp.has(x)))];
  if (u.length) throw new Error(`promotion_workbook_unsupported_class:${u.join(",")}`);
  if (!c.reduce((x, l) => x + Object.values(l.tiersByClass).reduce((v, p) => v + p.length, 0), 0)) throw new Error("promotion_tiers_not_found_in_workbook");
  return { families: c, sheets: s, warnings: [...new Set(a)] };
}
export {
  Gp as parsePromotionMatrix,
  Kp as parsePromotionWorkbook
};
