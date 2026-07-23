var Sv = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ey(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var mf = { exports: {} }, bu = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Hr;
function Ay() {
  if (Hr) return bu;
  Hr = 1;
  var s = Symbol.for("react.transitional.element"), d = Symbol.for("react.fragment");
  function v(f, E, U) {
    var H = null;
    if (U !== void 0 && (H = "" + U), E.key !== void 0 && (H = "" + E.key), "key" in E) {
      U = {};
      for (var B in E)
        B !== "key" && (U[B] = E[B]);
    } else U = E;
    return E = U.ref, {
      $$typeof: s,
      type: f,
      key: H,
      ref: E !== void 0 ? E : null,
      props: U
    };
  }
  return bu.Fragment = d, bu.jsx = v, bu.jsxs = v, bu;
}
var Cr;
function py() {
  return Cr || (Cr = 1, mf.exports = Ay()), mf.exports;
}
var _v = py(), df = { exports: {} }, L = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Br;
function Ty() {
  if (Br) return L;
  Br = 1;
  var s = Symbol.for("react.transitional.element"), d = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), f = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), U = Symbol.for("react.consumer"), H = Symbol.for("react.context"), B = Symbol.for("react.forward_ref"), M = Symbol.for("react.suspense"), b = Symbol.for("react.memo"), N = Symbol.for("react.lazy"), D = Symbol.for("react.activity"), X = Symbol.iterator;
  function _l(m) {
    return m === null || typeof m != "object" ? null : (m = X && m[X] || m["@@iterator"], typeof m == "function" ? m : null);
  }
  var Rl = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, vl = Object.assign, xl = {};
  function Hl(m, O, C) {
    this.props = m, this.context = O, this.refs = xl, this.updater = C || Rl;
  }
  Hl.prototype.isReactComponent = {}, Hl.prototype.setState = function(m, O) {
    if (typeof m != "object" && typeof m != "function" && m != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, m, O, "setState");
  }, Hl.prototype.forceUpdate = function(m) {
    this.updater.enqueueForceUpdate(this, m, "forceUpdate");
  };
  function Zl() {
  }
  Zl.prototype = Hl.prototype;
  function hl(m, O, C) {
    this.props = m, this.context = O, this.refs = xl, this.updater = C || Rl;
  }
  var Cl = hl.prototype = new Zl();
  Cl.constructor = hl, vl(Cl, Hl.prototype), Cl.isPureReactComponent = !0;
  var Dl = Array.isArray;
  function Ul() {
  }
  var J = { H: null, A: null, T: null, S: null }, Bl = Object.prototype.hasOwnProperty;
  function sl(m, O, C) {
    var Y = C.ref;
    return {
      $$typeof: s,
      type: m,
      key: O,
      ref: Y !== void 0 ? Y : null,
      props: C
    };
  }
  function tt(m, O) {
    return sl(m.type, O, m.props);
  }
  function Ot(m) {
    return typeof m == "object" && m !== null && m.$$typeof === s;
  }
  function wl(m) {
    var O = { "=": "=0", ":": "=2" };
    return "$" + m.replace(/[=:]/g, function(C) {
      return O[C];
    });
  }
  var Ea = /\/+/g;
  function Rt(m, O) {
    return typeof m == "object" && m !== null && m.key != null ? wl("" + m.key) : O.toString(36);
  }
  function At(m) {
    switch (m.status) {
      case "fulfilled":
        return m.value;
      case "rejected":
        throw m.reason;
      default:
        switch (typeof m.status == "string" ? m.then(Ul, Ul) : (m.status = "pending", m.then(
          function(O) {
            m.status === "pending" && (m.status = "fulfilled", m.value = O);
          },
          function(O) {
            m.status === "pending" && (m.status = "rejected", m.reason = O);
          }
        )), m.status) {
          case "fulfilled":
            return m.value;
          case "rejected":
            throw m.reason;
        }
    }
    throw m;
  }
  function p(m, O, C, Y, Z) {
    var w = typeof m;
    (w === "undefined" || w === "boolean") && (m = null);
    var al = !1;
    if (m === null) al = !0;
    else
      switch (w) {
        case "bigint":
        case "string":
        case "number":
          al = !0;
          break;
        case "object":
          switch (m.$$typeof) {
            case s:
            case d:
              al = !0;
              break;
            case N:
              return al = m._init, p(
                al(m._payload),
                O,
                C,
                Y,
                Z
              );
          }
      }
    if (al)
      return Z = Z(m), al = Y === "" ? "." + Rt(m, 0) : Y, Dl(Z) ? (C = "", al != null && (C = al.replace(Ea, "$&/") + "/"), p(Z, O, C, "", function(Me) {
        return Me;
      })) : Z != null && (Ot(Z) && (Z = tt(
        Z,
        C + (Z.key == null || m && m.key === Z.key ? "" : ("" + Z.key).replace(
          Ea,
          "$&/"
        ) + "/") + al
      )), O.push(Z)), 1;
    al = 0;
    var Kl = Y === "" ? "." : Y + ":";
    if (Dl(m))
      for (var bl = 0; bl < m.length; bl++)
        Y = m[bl], w = Kl + Rt(Y, bl), al += p(
          Y,
          O,
          C,
          w,
          Z
        );
    else if (bl = _l(m), typeof bl == "function")
      for (m = bl.call(m), bl = 0; !(Y = m.next()).done; )
        Y = Y.value, w = Kl + Rt(Y, bl++), al += p(
          Y,
          O,
          C,
          w,
          Z
        );
    else if (w === "object") {
      if (typeof m.then == "function")
        return p(
          At(m),
          O,
          C,
          Y,
          Z
        );
      throw O = String(m), Error(
        "Objects are not valid as a React child (found: " + (O === "[object Object]" ? "object with keys {" + Object.keys(m).join(", ") + "}" : O) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return al;
  }
  function R(m, O, C) {
    if (m == null) return m;
    var Y = [], Z = 0;
    return p(m, Y, "", "", function(w) {
      return O.call(C, w, Z++);
    }), Y;
  }
  function j(m) {
    if (m._status === -1) {
      var O = m._result;
      O = O(), O.then(
        function(C) {
          (m._status === 0 || m._status === -1) && (m._status = 1, m._result = C);
        },
        function(C) {
          (m._status === 0 || m._status === -1) && (m._status = 2, m._result = C);
        }
      ), m._status === -1 && (m._status = 0, m._result = O);
    }
    if (m._status === 1) return m._result.default;
    throw m._result;
  }
  var nl = typeof reportError == "function" ? reportError : function(m) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var O = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof m == "object" && m !== null && typeof m.message == "string" ? String(m.message) : String(m),
        error: m
      });
      if (!window.dispatchEvent(O)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", m);
      return;
    }
    console.error(m);
  }, ol = {
    map: R,
    forEach: function(m, O, C) {
      R(
        m,
        function() {
          O.apply(this, arguments);
        },
        C
      );
    },
    count: function(m) {
      var O = 0;
      return R(m, function() {
        O++;
      }), O;
    },
    toArray: function(m) {
      return R(m, function(O) {
        return O;
      }) || [];
    },
    only: function(m) {
      if (!Ot(m))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return m;
    }
  };
  return L.Activity = D, L.Children = ol, L.Component = Hl, L.Fragment = v, L.Profiler = E, L.PureComponent = hl, L.StrictMode = f, L.Suspense = M, L.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = J, L.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(m) {
      return J.H.useMemoCache(m);
    }
  }, L.cache = function(m) {
    return function() {
      return m.apply(null, arguments);
    };
  }, L.cacheSignal = function() {
    return null;
  }, L.cloneElement = function(m, O, C) {
    if (m == null)
      throw Error(
        "The argument must be a React element, but you passed " + m + "."
      );
    var Y = vl({}, m.props), Z = m.key;
    if (O != null)
      for (w in O.key !== void 0 && (Z = "" + O.key), O)
        !Bl.call(O, w) || w === "key" || w === "__self" || w === "__source" || w === "ref" && O.ref === void 0 || (Y[w] = O[w]);
    var w = arguments.length - 2;
    if (w === 1) Y.children = C;
    else if (1 < w) {
      for (var al = Array(w), Kl = 0; Kl < w; Kl++)
        al[Kl] = arguments[Kl + 2];
      Y.children = al;
    }
    return sl(m.type, Z, Y);
  }, L.createContext = function(m) {
    return m = {
      $$typeof: H,
      _currentValue: m,
      _currentValue2: m,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, m.Provider = m, m.Consumer = {
      $$typeof: U,
      _context: m
    }, m;
  }, L.createElement = function(m, O, C) {
    var Y, Z = {}, w = null;
    if (O != null)
      for (Y in O.key !== void 0 && (w = "" + O.key), O)
        Bl.call(O, Y) && Y !== "key" && Y !== "__self" && Y !== "__source" && (Z[Y] = O[Y]);
    var al = arguments.length - 2;
    if (al === 1) Z.children = C;
    else if (1 < al) {
      for (var Kl = Array(al), bl = 0; bl < al; bl++)
        Kl[bl] = arguments[bl + 2];
      Z.children = Kl;
    }
    if (m && m.defaultProps)
      for (Y in al = m.defaultProps, al)
        Z[Y] === void 0 && (Z[Y] = al[Y]);
    return sl(m, w, Z);
  }, L.createRef = function() {
    return { current: null };
  }, L.forwardRef = function(m) {
    return { $$typeof: B, render: m };
  }, L.isValidElement = Ot, L.lazy = function(m) {
    return {
      $$typeof: N,
      _payload: { _status: -1, _result: m },
      _init: j
    };
  }, L.memo = function(m, O) {
    return {
      $$typeof: b,
      type: m,
      compare: O === void 0 ? null : O
    };
  }, L.startTransition = function(m) {
    var O = J.T, C = {};
    J.T = C;
    try {
      var Y = m(), Z = J.S;
      Z !== null && Z(C, Y), typeof Y == "object" && Y !== null && typeof Y.then == "function" && Y.then(Ul, nl);
    } catch (w) {
      nl(w);
    } finally {
      O !== null && C.types !== null && (O.types = C.types), J.T = O;
    }
  }, L.unstable_useCacheRefresh = function() {
    return J.H.useCacheRefresh();
  }, L.use = function(m) {
    return J.H.use(m);
  }, L.useActionState = function(m, O, C) {
    return J.H.useActionState(m, O, C);
  }, L.useCallback = function(m, O) {
    return J.H.useCallback(m, O);
  }, L.useContext = function(m) {
    return J.H.useContext(m);
  }, L.useDebugValue = function() {
  }, L.useDeferredValue = function(m, O) {
    return J.H.useDeferredValue(m, O);
  }, L.useEffect = function(m, O) {
    return J.H.useEffect(m, O);
  }, L.useEffectEvent = function(m) {
    return J.H.useEffectEvent(m);
  }, L.useId = function() {
    return J.H.useId();
  }, L.useImperativeHandle = function(m, O, C) {
    return J.H.useImperativeHandle(m, O, C);
  }, L.useInsertionEffect = function(m, O) {
    return J.H.useInsertionEffect(m, O);
  }, L.useLayoutEffect = function(m, O) {
    return J.H.useLayoutEffect(m, O);
  }, L.useMemo = function(m, O) {
    return J.H.useMemo(m, O);
  }, L.useOptimistic = function(m, O) {
    return J.H.useOptimistic(m, O);
  }, L.useReducer = function(m, O, C) {
    return J.H.useReducer(m, O, C);
  }, L.useRef = function(m) {
    return J.H.useRef(m);
  }, L.useState = function(m) {
    return J.H.useState(m);
  }, L.useSyncExternalStore = function(m, O, C) {
    return J.H.useSyncExternalStore(
      m,
      O,
      C
    );
  }, L.useTransition = function() {
    return J.H.useTransition();
  }, L.version = "19.2.6", L;
}
var qr;
function Tf() {
  return qr || (qr = 1, df.exports = Ty()), df.exports;
}
var ze = Tf();
const bv = /* @__PURE__ */ Ey(ze);
var yf = { exports: {} }, Eu = {}, vf = { exports: {} }, hf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Yr;
function zy() {
  return Yr || (Yr = 1, (function(s) {
    function d(p, R) {
      var j = p.length;
      p.push(R);
      l: for (; 0 < j; ) {
        var nl = j - 1 >>> 1, ol = p[nl];
        if (0 < E(ol, R))
          p[nl] = R, p[j] = ol, j = nl;
        else break l;
      }
    }
    function v(p) {
      return p.length === 0 ? null : p[0];
    }
    function f(p) {
      if (p.length === 0) return null;
      var R = p[0], j = p.pop();
      if (j !== R) {
        p[0] = j;
        l: for (var nl = 0, ol = p.length, m = ol >>> 1; nl < m; ) {
          var O = 2 * (nl + 1) - 1, C = p[O], Y = O + 1, Z = p[Y];
          if (0 > E(C, j))
            Y < ol && 0 > E(Z, C) ? (p[nl] = Z, p[Y] = j, nl = Y) : (p[nl] = C, p[O] = j, nl = O);
          else if (Y < ol && 0 > E(Z, j))
            p[nl] = Z, p[Y] = j, nl = Y;
          else break l;
        }
      }
      return R;
    }
    function E(p, R) {
      var j = p.sortIndex - R.sortIndex;
      return j !== 0 ? j : p.id - R.id;
    }
    if (s.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var U = performance;
      s.unstable_now = function() {
        return U.now();
      };
    } else {
      var H = Date, B = H.now();
      s.unstable_now = function() {
        return H.now() - B;
      };
    }
    var M = [], b = [], N = 1, D = null, X = 3, _l = !1, Rl = !1, vl = !1, xl = !1, Hl = typeof setTimeout == "function" ? setTimeout : null, Zl = typeof clearTimeout == "function" ? clearTimeout : null, hl = typeof setImmediate < "u" ? setImmediate : null;
    function Cl(p) {
      for (var R = v(b); R !== null; ) {
        if (R.callback === null) f(b);
        else if (R.startTime <= p)
          f(b), R.sortIndex = R.expirationTime, d(M, R);
        else break;
        R = v(b);
      }
    }
    function Dl(p) {
      if (vl = !1, Cl(p), !Rl)
        if (v(M) !== null)
          Rl = !0, Ul || (Ul = !0, wl());
        else {
          var R = v(b);
          R !== null && At(Dl, R.startTime - p);
        }
    }
    var Ul = !1, J = -1, Bl = 5, sl = -1;
    function tt() {
      return xl ? !0 : !(s.unstable_now() - sl < Bl);
    }
    function Ot() {
      if (xl = !1, Ul) {
        var p = s.unstable_now();
        sl = p;
        var R = !0;
        try {
          l: {
            Rl = !1, vl && (vl = !1, Zl(J), J = -1), _l = !0;
            var j = X;
            try {
              t: {
                for (Cl(p), D = v(M); D !== null && !(D.expirationTime > p && tt()); ) {
                  var nl = D.callback;
                  if (typeof nl == "function") {
                    D.callback = null, X = D.priorityLevel;
                    var ol = nl(
                      D.expirationTime <= p
                    );
                    if (p = s.unstable_now(), typeof ol == "function") {
                      D.callback = ol, Cl(p), R = !0;
                      break t;
                    }
                    D === v(M) && f(M), Cl(p);
                  } else f(M);
                  D = v(M);
                }
                if (D !== null) R = !0;
                else {
                  var m = v(b);
                  m !== null && At(
                    Dl,
                    m.startTime - p
                  ), R = !1;
                }
              }
              break l;
            } finally {
              D = null, X = j, _l = !1;
            }
            R = void 0;
          }
        } finally {
          R ? wl() : Ul = !1;
        }
      }
    }
    var wl;
    if (typeof hl == "function")
      wl = function() {
        hl(Ot);
      };
    else if (typeof MessageChannel < "u") {
      var Ea = new MessageChannel(), Rt = Ea.port2;
      Ea.port1.onmessage = Ot, wl = function() {
        Rt.postMessage(null);
      };
    } else
      wl = function() {
        Hl(Ot, 0);
      };
    function At(p, R) {
      J = Hl(function() {
        p(s.unstable_now());
      }, R);
    }
    s.unstable_IdlePriority = 5, s.unstable_ImmediatePriority = 1, s.unstable_LowPriority = 4, s.unstable_NormalPriority = 3, s.unstable_Profiling = null, s.unstable_UserBlockingPriority = 2, s.unstable_cancelCallback = function(p) {
      p.callback = null;
    }, s.unstable_forceFrameRate = function(p) {
      0 > p || 125 < p ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Bl = 0 < p ? Math.floor(1e3 / p) : 5;
    }, s.unstable_getCurrentPriorityLevel = function() {
      return X;
    }, s.unstable_next = function(p) {
      switch (X) {
        case 1:
        case 2:
        case 3:
          var R = 3;
          break;
        default:
          R = X;
      }
      var j = X;
      X = R;
      try {
        return p();
      } finally {
        X = j;
      }
    }, s.unstable_requestPaint = function() {
      xl = !0;
    }, s.unstable_runWithPriority = function(p, R) {
      switch (p) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          p = 3;
      }
      var j = X;
      X = p;
      try {
        return R();
      } finally {
        X = j;
      }
    }, s.unstable_scheduleCallback = function(p, R, j) {
      var nl = s.unstable_now();
      switch (typeof j == "object" && j !== null ? (j = j.delay, j = typeof j == "number" && 0 < j ? nl + j : nl) : j = nl, p) {
        case 1:
          var ol = -1;
          break;
        case 2:
          ol = 250;
          break;
        case 5:
          ol = 1073741823;
          break;
        case 4:
          ol = 1e4;
          break;
        default:
          ol = 5e3;
      }
      return ol = j + ol, p = {
        id: N++,
        callback: R,
        priorityLevel: p,
        startTime: j,
        expirationTime: ol,
        sortIndex: -1
      }, j > nl ? (p.sortIndex = j, d(b, p), v(M) === null && p === v(b) && (vl ? (Zl(J), J = -1) : vl = !0, At(Dl, j - nl))) : (p.sortIndex = ol, d(M, p), Rl || _l || (Rl = !0, Ul || (Ul = !0, wl()))), p;
    }, s.unstable_shouldYield = tt, s.unstable_wrapCallback = function(p) {
      var R = X;
      return function() {
        var j = X;
        X = R;
        try {
          return p.apply(this, arguments);
        } finally {
          X = j;
        }
      };
    };
  })(hf)), hf;
}
var xr;
function Oy() {
  return xr || (xr = 1, vf.exports = zy()), vf.exports;
}
var gf = { exports: {} }, Vl = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gr;
function My() {
  if (Gr) return Vl;
  Gr = 1;
  var s = Tf();
  function d(M) {
    var b = "https://react.dev/errors/" + M;
    if (1 < arguments.length) {
      b += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var N = 2; N < arguments.length; N++)
        b += "&args[]=" + encodeURIComponent(arguments[N]);
    }
    return "Minified React error #" + M + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function v() {
  }
  var f = {
    d: {
      f: v,
      r: function() {
        throw Error(d(522));
      },
      D: v,
      C: v,
      L: v,
      m: v,
      X: v,
      S: v,
      M: v
    },
    p: 0,
    findDOMNode: null
  }, E = Symbol.for("react.portal");
  function U(M, b, N) {
    var D = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: E,
      key: D == null ? null : "" + D,
      children: M,
      containerInfo: b,
      implementation: N
    };
  }
  var H = s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function B(M, b) {
    if (M === "font") return "";
    if (typeof b == "string")
      return b === "use-credentials" ? b : "";
  }
  return Vl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = f, Vl.createPortal = function(M, b) {
    var N = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!b || b.nodeType !== 1 && b.nodeType !== 9 && b.nodeType !== 11)
      throw Error(d(299));
    return U(M, b, null, N);
  }, Vl.flushSync = function(M) {
    var b = H.T, N = f.p;
    try {
      if (H.T = null, f.p = 2, M) return M();
    } finally {
      H.T = b, f.p = N, f.d.f();
    }
  }, Vl.preconnect = function(M, b) {
    typeof M == "string" && (b ? (b = b.crossOrigin, b = typeof b == "string" ? b === "use-credentials" ? b : "" : void 0) : b = null, f.d.C(M, b));
  }, Vl.prefetchDNS = function(M) {
    typeof M == "string" && f.d.D(M);
  }, Vl.preinit = function(M, b) {
    if (typeof M == "string" && b && typeof b.as == "string") {
      var N = b.as, D = B(N, b.crossOrigin), X = typeof b.integrity == "string" ? b.integrity : void 0, _l = typeof b.fetchPriority == "string" ? b.fetchPriority : void 0;
      N === "style" ? f.d.S(
        M,
        typeof b.precedence == "string" ? b.precedence : void 0,
        {
          crossOrigin: D,
          integrity: X,
          fetchPriority: _l
        }
      ) : N === "script" && f.d.X(M, {
        crossOrigin: D,
        integrity: X,
        fetchPriority: _l,
        nonce: typeof b.nonce == "string" ? b.nonce : void 0
      });
    }
  }, Vl.preinitModule = function(M, b) {
    if (typeof M == "string")
      if (typeof b == "object" && b !== null) {
        if (b.as == null || b.as === "script") {
          var N = B(
            b.as,
            b.crossOrigin
          );
          f.d.M(M, {
            crossOrigin: N,
            integrity: typeof b.integrity == "string" ? b.integrity : void 0,
            nonce: typeof b.nonce == "string" ? b.nonce : void 0
          });
        }
      } else b == null && f.d.M(M);
  }, Vl.preload = function(M, b) {
    if (typeof M == "string" && typeof b == "object" && b !== null && typeof b.as == "string") {
      var N = b.as, D = B(N, b.crossOrigin);
      f.d.L(M, N, {
        crossOrigin: D,
        integrity: typeof b.integrity == "string" ? b.integrity : void 0,
        nonce: typeof b.nonce == "string" ? b.nonce : void 0,
        type: typeof b.type == "string" ? b.type : void 0,
        fetchPriority: typeof b.fetchPriority == "string" ? b.fetchPriority : void 0,
        referrerPolicy: typeof b.referrerPolicy == "string" ? b.referrerPolicy : void 0,
        imageSrcSet: typeof b.imageSrcSet == "string" ? b.imageSrcSet : void 0,
        imageSizes: typeof b.imageSizes == "string" ? b.imageSizes : void 0,
        media: typeof b.media == "string" ? b.media : void 0
      });
    }
  }, Vl.preloadModule = function(M, b) {
    if (typeof M == "string")
      if (b) {
        var N = B(b.as, b.crossOrigin);
        f.d.m(M, {
          as: typeof b.as == "string" && b.as !== "script" ? b.as : void 0,
          crossOrigin: N,
          integrity: typeof b.integrity == "string" ? b.integrity : void 0
        });
      } else f.d.m(M);
  }, Vl.requestFormReset = function(M) {
    f.d.r(M);
  }, Vl.unstable_batchedUpdates = function(M, b) {
    return M(b);
  }, Vl.useFormState = function(M, b, N) {
    return H.H.useFormState(M, b, N);
  }, Vl.useFormStatus = function() {
    return H.H.useHostTransitionStatus();
  }, Vl.version = "19.2.6", Vl;
}
var Qr;
function Dy() {
  if (Qr) return gf.exports;
  Qr = 1;
  function s() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s);
      } catch (d) {
        console.error(d);
      }
  }
  return s(), gf.exports = My(), gf.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var jr;
function Uy() {
  if (jr) return Eu;
  jr = 1;
  var s = Oy(), d = Tf(), v = Dy();
  function f(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var a = 2; a < arguments.length; a++)
        t += "&args[]=" + encodeURIComponent(arguments[a]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function E(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function U(l) {
    var t = l, a = l;
    if (l.alternate) for (; t.return; ) t = t.return;
    else {
      l = t;
      do
        t = l, (t.flags & 4098) !== 0 && (a = t.return), l = t.return;
      while (l);
    }
    return t.tag === 3 ? a : null;
  }
  function H(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function B(l) {
    if (l.tag === 31) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function M(l) {
    if (U(l) !== l)
      throw Error(f(188));
  }
  function b(l) {
    var t = l.alternate;
    if (!t) {
      if (t = U(l), t === null) throw Error(f(188));
      return t !== l ? null : l;
    }
    for (var a = l, e = t; ; ) {
      var u = a.return;
      if (u === null) break;
      var n = u.alternate;
      if (n === null) {
        if (e = u.return, e !== null) {
          a = e;
          continue;
        }
        break;
      }
      if (u.child === n.child) {
        for (n = u.child; n; ) {
          if (n === a) return M(u), l;
          if (n === e) return M(u), t;
          n = n.sibling;
        }
        throw Error(f(188));
      }
      if (a.return !== e.return) a = u, e = n;
      else {
        for (var i = !1, c = u.child; c; ) {
          if (c === a) {
            i = !0, a = u, e = n;
            break;
          }
          if (c === e) {
            i = !0, e = u, a = n;
            break;
          }
          c = c.sibling;
        }
        if (!i) {
          for (c = n.child; c; ) {
            if (c === a) {
              i = !0, a = n, e = u;
              break;
            }
            if (c === e) {
              i = !0, e = n, a = u;
              break;
            }
            c = c.sibling;
          }
          if (!i) throw Error(f(189));
        }
      }
      if (a.alternate !== e) throw Error(f(190));
    }
    if (a.tag !== 3) throw Error(f(188));
    return a.stateNode.current === a ? l : t;
  }
  function N(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (t = N(l), t !== null) return t;
      l = l.sibling;
    }
    return null;
  }
  var D = Object.assign, X = Symbol.for("react.element"), _l = Symbol.for("react.transitional.element"), Rl = Symbol.for("react.portal"), vl = Symbol.for("react.fragment"), xl = Symbol.for("react.strict_mode"), Hl = Symbol.for("react.profiler"), Zl = Symbol.for("react.consumer"), hl = Symbol.for("react.context"), Cl = Symbol.for("react.forward_ref"), Dl = Symbol.for("react.suspense"), Ul = Symbol.for("react.suspense_list"), J = Symbol.for("react.memo"), Bl = Symbol.for("react.lazy"), sl = Symbol.for("react.activity"), tt = Symbol.for("react.memo_cache_sentinel"), Ot = Symbol.iterator;
  function wl(l) {
    return l === null || typeof l != "object" ? null : (l = Ot && l[Ot] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var Ea = Symbol.for("react.client.reference");
  function Rt(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === Ea ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case vl:
        return "Fragment";
      case Hl:
        return "Profiler";
      case xl:
        return "StrictMode";
      case Dl:
        return "Suspense";
      case Ul:
        return "SuspenseList";
      case sl:
        return "Activity";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case Rl:
          return "Portal";
        case hl:
          return l.displayName || "Context";
        case Zl:
          return (l._context.displayName || "Context") + ".Consumer";
        case Cl:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case J:
          return t = l.displayName || null, t !== null ? t : Rt(l.type) || "Memo";
        case Bl:
          t = l._payload, l = l._init;
          try {
            return Rt(l(t));
          } catch {
          }
      }
    return null;
  }
  var At = Array.isArray, p = d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, R = v.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, j = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, nl = [], ol = -1;
  function m(l) {
    return { current: l };
  }
  function O(l) {
    0 > ol || (l.current = nl[ol], nl[ol] = null, ol--);
  }
  function C(l, t) {
    ol++, nl[ol] = l.current, l.current = t;
  }
  var Y = m(null), Z = m(null), w = m(null), al = m(null);
  function Kl(l, t) {
    switch (C(w, t), C(Z, l), C(Y, null), t.nodeType) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? tr(l) : 0;
        break;
      default:
        if (l = t.tagName, t = t.namespaceURI)
          t = tr(t), l = ar(t, l);
        else
          switch (l) {
            case "svg":
              l = 1;
              break;
            case "math":
              l = 2;
              break;
            default:
              l = 0;
          }
    }
    O(Y), C(Y, l);
  }
  function bl() {
    O(Y), O(Z), O(w);
  }
  function Me(l) {
    l.memoizedState !== null && C(al, l);
    var t = Y.current, a = ar(t, l.type);
    t !== a && (C(Z, l), C(Y, a));
  }
  function Tu(l) {
    Z.current === l && (O(Y), O(Z)), al.current === l && (O(al), hu._currentValue = j);
  }
  var wn, Nf;
  function Aa(l) {
    if (wn === void 0)
      try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        wn = t && t[1] || "", Nf = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + wn + l + Nf;
  }
  var $n = !1;
  function Wn(l, t) {
    if (!l || $n) return "";
    $n = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var e = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var z = function() {
                throw Error();
              };
              if (Object.defineProperty(z.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(z, []);
                } catch (_) {
                  var S = _;
                }
                Reflect.construct(l, [], z);
              } else {
                try {
                  z.call();
                } catch (_) {
                  S = _;
                }
                l.call(z.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (_) {
                S = _;
              }
              (z = l()) && typeof z.catch == "function" && z.catch(function() {
              });
            }
          } catch (_) {
            if (_ && S && typeof _.stack == "string")
              return [_.stack, S.stack];
          }
          return [null, null];
        }
      };
      e.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var u = Object.getOwnPropertyDescriptor(
        e.DetermineComponentFrameRoot,
        "name"
      );
      u && u.configurable && Object.defineProperty(
        e.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var n = e.DetermineComponentFrameRoot(), i = n[0], c = n[1];
      if (i && c) {
        var o = i.split(`
`), g = c.split(`
`);
        for (u = e = 0; e < o.length && !o[e].includes("DetermineComponentFrameRoot"); )
          e++;
        for (; u < g.length && !g[u].includes(
          "DetermineComponentFrameRoot"
        ); )
          u++;
        if (e === o.length || u === g.length)
          for (e = o.length - 1, u = g.length - 1; 1 <= e && 0 <= u && o[e] !== g[u]; )
            u--;
        for (; 1 <= e && 0 <= u; e--, u--)
          if (o[e] !== g[u]) {
            if (e !== 1 || u !== 1)
              do
                if (e--, u--, 0 > u || o[e] !== g[u]) {
                  var A = `
` + o[e].replace(" at new ", " at ");
                  return l.displayName && A.includes("<anonymous>") && (A = A.replace("<anonymous>", l.displayName)), A;
                }
              while (1 <= e && 0 <= u);
            break;
          }
      }
    } finally {
      $n = !1, Error.prepareStackTrace = a;
    }
    return (a = l ? l.displayName || l.name : "") ? Aa(a) : "";
  }
  function Ir(l, t) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return Aa(l.type);
      case 16:
        return Aa("Lazy");
      case 13:
        return l.child !== t && t !== null ? Aa("Suspense Fallback") : Aa("Suspense");
      case 19:
        return Aa("SuspenseList");
      case 0:
      case 15:
        return Wn(l.type, !1);
      case 11:
        return Wn(l.type.render, !1);
      case 1:
        return Wn(l.type, !0);
      case 31:
        return Aa("Activity");
      default:
        return "";
    }
  }
  function Rf(l) {
    try {
      var t = "", a = null;
      do
        t += Ir(l, a), a = l, l = l.return;
      while (l);
      return t;
    } catch (e) {
      return `
Error generating stack: ` + e.message + `
` + e.stack;
    }
  }
  var kn = Object.prototype.hasOwnProperty, Fn = s.unstable_scheduleCallback, In = s.unstable_cancelCallback, Pr = s.unstable_shouldYield, lm = s.unstable_requestPaint, at = s.unstable_now, tm = s.unstable_getCurrentPriorityLevel, Hf = s.unstable_ImmediatePriority, Cf = s.unstable_UserBlockingPriority, zu = s.unstable_NormalPriority, am = s.unstable_LowPriority, Bf = s.unstable_IdlePriority, em = s.log, um = s.unstable_setDisableYieldValue, De = null, et = null;
  function kt(l) {
    if (typeof em == "function" && um(l), et && typeof et.setStrictMode == "function")
      try {
        et.setStrictMode(De, l);
      } catch {
      }
  }
  var ut = Math.clz32 ? Math.clz32 : cm, nm = Math.log, im = Math.LN2;
  function cm(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (nm(l) / im | 0) | 0;
  }
  var Ou = 256, Mu = 262144, Du = 4194304;
  function pa(l) {
    var t = l & 42;
    if (t !== 0) return t;
    switch (l & -l) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return l & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return l & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return l & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return l;
    }
  }
  function Uu(l, t, a) {
    var e = l.pendingLanes;
    if (e === 0) return 0;
    var u = 0, n = l.suspendedLanes, i = l.pingedLanes;
    l = l.warmLanes;
    var c = e & 134217727;
    return c !== 0 ? (e = c & ~n, e !== 0 ? u = pa(e) : (i &= c, i !== 0 ? u = pa(i) : a || (a = c & ~l, a !== 0 && (u = pa(a))))) : (c = e & ~n, c !== 0 ? u = pa(c) : i !== 0 ? u = pa(i) : a || (a = e & ~l, a !== 0 && (u = pa(a)))), u === 0 ? 0 : t !== 0 && t !== u && (t & n) === 0 && (n = u & -u, a = t & -t, n >= a || n === 32 && (a & 4194048) !== 0) ? t : u;
  }
  function Ue(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function fm(l, t) {
    switch (l) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function qf() {
    var l = Du;
    return Du <<= 1, (Du & 62914560) === 0 && (Du = 4194304), l;
  }
  function Pn(l) {
    for (var t = [], a = 0; 31 > a; a++) t.push(l);
    return t;
  }
  function Ne(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function sm(l, t, a, e, u, n) {
    var i = l.pendingLanes;
    l.pendingLanes = a, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= a, l.entangledLanes &= a, l.errorRecoveryDisabledLanes &= a, l.shellSuspendCounter = 0;
    var c = l.entanglements, o = l.expirationTimes, g = l.hiddenUpdates;
    for (a = i & ~a; 0 < a; ) {
      var A = 31 - ut(a), z = 1 << A;
      c[A] = 0, o[A] = -1;
      var S = g[A];
      if (S !== null)
        for (g[A] = null, A = 0; A < S.length; A++) {
          var _ = S[A];
          _ !== null && (_.lane &= -536870913);
        }
      a &= ~z;
    }
    e !== 0 && Yf(l, e, 0), n !== 0 && u === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(i & ~t));
  }
  function Yf(l, t, a) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var e = 31 - ut(t);
    l.entangledLanes |= t, l.entanglements[e] = l.entanglements[e] | 1073741824 | a & 261930;
  }
  function xf(l, t) {
    var a = l.entangledLanes |= t;
    for (l = l.entanglements; a; ) {
      var e = 31 - ut(a), u = 1 << e;
      u & t | l[e] & t && (l[e] |= t), a &= ~u;
    }
  }
  function Gf(l, t) {
    var a = t & -t;
    return a = (a & 42) !== 0 ? 1 : li(a), (a & (l.suspendedLanes | t)) !== 0 ? 0 : a;
  }
  function li(l) {
    switch (l) {
      case 2:
        l = 1;
        break;
      case 8:
        l = 4;
        break;
      case 32:
        l = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        l = 128;
        break;
      case 268435456:
        l = 134217728;
        break;
      default:
        l = 0;
    }
    return l;
  }
  function ti(l) {
    return l &= -l, 2 < l ? 8 < l ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Qf() {
    var l = R.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : zr(l.type));
  }
  function jf(l, t) {
    var a = R.p;
    try {
      return R.p = l, t();
    } finally {
      R.p = a;
    }
  }
  var Ft = Math.random().toString(36).slice(2), Gl = "__reactFiber$" + Ft, $l = "__reactProps$" + Ft, Xa = "__reactContainer$" + Ft, ai = "__reactEvents$" + Ft, om = "__reactListeners$" + Ft, rm = "__reactHandles$" + Ft, Xf = "__reactResources$" + Ft, Re = "__reactMarker$" + Ft;
  function ei(l) {
    delete l[Gl], delete l[$l], delete l[ai], delete l[om], delete l[rm];
  }
  function La(l) {
    var t = l[Gl];
    if (t) return t;
    for (var a = l.parentNode; a; ) {
      if (t = a[Xa] || a[Gl]) {
        if (a = t.alternate, t.child !== null || a !== null && a.child !== null)
          for (l = sr(l); l !== null; ) {
            if (a = l[Gl]) return a;
            l = sr(l);
          }
        return t;
      }
      l = a, a = l.parentNode;
    }
    return null;
  }
  function Za(l) {
    if (l = l[Gl] || l[Xa]) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return l;
    }
    return null;
  }
  function He(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(f(33));
  }
  function Va(l) {
    var t = l[Xf];
    return t || (t = l[Xf] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function ql(l) {
    l[Re] = !0;
  }
  var Lf = /* @__PURE__ */ new Set(), Zf = {};
  function Ta(l, t) {
    Ka(l, t), Ka(l + "Capture", t);
  }
  function Ka(l, t) {
    for (Zf[l] = t, l = 0; l < t.length; l++)
      Lf.add(t[l]);
  }
  var mm = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Vf = {}, Kf = {};
  function dm(l) {
    return kn.call(Kf, l) ? !0 : kn.call(Vf, l) ? !1 : mm.test(l) ? Kf[l] = !0 : (Vf[l] = !0, !1);
  }
  function Nu(l, t, a) {
    if (dm(t))
      if (a === null) l.removeAttribute(t);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(t);
            return;
          case "boolean":
            var e = t.toLowerCase().slice(0, 5);
            if (e !== "data-" && e !== "aria-") {
              l.removeAttribute(t);
              return;
            }
        }
        l.setAttribute(t, "" + a);
      }
  }
  function Ru(l, t, a) {
    if (a === null) l.removeAttribute(t);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(t);
          return;
      }
      l.setAttribute(t, "" + a);
    }
  }
  function Ht(l, t, a, e) {
    if (e === null) l.removeAttribute(a);
    else {
      switch (typeof e) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(a);
          return;
      }
      l.setAttributeNS(t, a, "" + e);
    }
  }
  function mt(l) {
    switch (typeof l) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return l;
      case "object":
        return l;
      default:
        return "";
    }
  }
  function Jf(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function ym(l, t, a) {
    var e = Object.getOwnPropertyDescriptor(
      l.constructor.prototype,
      t
    );
    if (!l.hasOwnProperty(t) && typeof e < "u" && typeof e.get == "function" && typeof e.set == "function") {
      var u = e.get, n = e.set;
      return Object.defineProperty(l, t, {
        configurable: !0,
        get: function() {
          return u.call(this);
        },
        set: function(i) {
          a = "" + i, n.call(this, i);
        }
      }), Object.defineProperty(l, t, {
        enumerable: e.enumerable
      }), {
        getValue: function() {
          return a;
        },
        setValue: function(i) {
          a = "" + i;
        },
        stopTracking: function() {
          l._valueTracker = null, delete l[t];
        }
      };
    }
  }
  function ui(l) {
    if (!l._valueTracker) {
      var t = Jf(l) ? "checked" : "value";
      l._valueTracker = ym(
        l,
        t,
        "" + l[t]
      );
    }
  }
  function wf(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var a = t.getValue(), e = "";
    return l && (e = Jf(l) ? l.checked ? "true" : "false" : l.value), l = e, l !== a ? (t.setValue(l), !0) : !1;
  }
  function Hu(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  var vm = /[\n"\\]/g;
  function dt(l) {
    return l.replace(
      vm,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function ni(l, t, a, e, u, n, i, c) {
    l.name = "", i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? l.type = i : l.removeAttribute("type"), t != null ? i === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + mt(t)) : l.value !== "" + mt(t) && (l.value = "" + mt(t)) : i !== "submit" && i !== "reset" || l.removeAttribute("value"), t != null ? ii(l, i, mt(t)) : a != null ? ii(l, i, mt(a)) : e != null && l.removeAttribute("value"), u == null && n != null && (l.defaultChecked = !!n), u != null && (l.checked = u && typeof u != "function" && typeof u != "symbol"), c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? l.name = "" + mt(c) : l.removeAttribute("name");
  }
  function $f(l, t, a, e, u, n, i, c) {
    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (l.type = n), t != null || a != null) {
      if (!(n !== "submit" && n !== "reset" || t != null)) {
        ui(l);
        return;
      }
      a = a != null ? "" + mt(a) : "", t = t != null ? "" + mt(t) : a, c || t === l.value || (l.value = t), l.defaultValue = t;
    }
    e = e ?? u, e = typeof e != "function" && typeof e != "symbol" && !!e, l.checked = c ? l.checked : !!e, l.defaultChecked = !!e, i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (l.name = i), ui(l);
  }
  function ii(l, t, a) {
    t === "number" && Hu(l.ownerDocument) === l || l.defaultValue === "" + a || (l.defaultValue = "" + a);
  }
  function Ja(l, t, a, e) {
    if (l = l.options, t) {
      t = {};
      for (var u = 0; u < a.length; u++)
        t["$" + a[u]] = !0;
      for (a = 0; a < l.length; a++)
        u = t.hasOwnProperty("$" + l[a].value), l[a].selected !== u && (l[a].selected = u), u && e && (l[a].defaultSelected = !0);
    } else {
      for (a = "" + mt(a), t = null, u = 0; u < l.length; u++) {
        if (l[u].value === a) {
          l[u].selected = !0, e && (l[u].defaultSelected = !0);
          return;
        }
        t !== null || l[u].disabled || (t = l[u]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Wf(l, t, a) {
    if (t != null && (t = "" + mt(t), t !== l.value && (l.value = t), a == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = a != null ? "" + mt(a) : "";
  }
  function kf(l, t, a, e) {
    if (t == null) {
      if (e != null) {
        if (a != null) throw Error(f(92));
        if (At(e)) {
          if (1 < e.length) throw Error(f(93));
          e = e[0];
        }
        a = e;
      }
      a == null && (a = ""), t = a;
    }
    a = mt(t), l.defaultValue = a, e = l.textContent, e === a && e !== "" && e !== null && (l.value = e), ui(l);
  }
  function wa(l, t) {
    if (t) {
      var a = l.firstChild;
      if (a && a === l.lastChild && a.nodeType === 3) {
        a.nodeValue = t;
        return;
      }
    }
    l.textContent = t;
  }
  var hm = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Ff(l, t, a) {
    var e = t.indexOf("--") === 0;
    a == null || typeof a == "boolean" || a === "" ? e ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : e ? l.setProperty(t, a) : typeof a != "number" || a === 0 || hm.has(t) ? t === "float" ? l.cssFloat = a : l[t] = ("" + a).trim() : l[t] = a + "px";
  }
  function If(l, t, a) {
    if (t != null && typeof t != "object")
      throw Error(f(62));
    if (l = l.style, a != null) {
      for (var e in a)
        !a.hasOwnProperty(e) || t != null && t.hasOwnProperty(e) || (e.indexOf("--") === 0 ? l.setProperty(e, "") : e === "float" ? l.cssFloat = "" : l[e] = "");
      for (var u in t)
        e = t[u], t.hasOwnProperty(u) && a[u] !== e && Ff(l, u, e);
    } else
      for (var n in t)
        t.hasOwnProperty(n) && Ff(l, n, t[n]);
  }
  function ci(l) {
    if (l.indexOf("-") === -1) return !1;
    switch (l) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var gm = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), Sm = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Cu(l) {
    return Sm.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  function Ct() {
  }
  var fi = null;
  function si(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var $a = null, Wa = null;
  function Pf(l) {
    var t = Za(l);
    if (t && (l = t.stateNode)) {
      var a = l[$l] || null;
      l: switch (l = t.stateNode, t.type) {
        case "input":
          if (ni(
            l,
            a.value,
            a.defaultValue,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name
          ), t = a.name, a.type === "radio" && t != null) {
            for (a = l; a.parentNode; ) a = a.parentNode;
            for (a = a.querySelectorAll(
              'input[name="' + dt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < a.length; t++) {
              var e = a[t];
              if (e !== l && e.form === l.form) {
                var u = e[$l] || null;
                if (!u) throw Error(f(90));
                ni(
                  e,
                  u.value,
                  u.defaultValue,
                  u.defaultValue,
                  u.checked,
                  u.defaultChecked,
                  u.type,
                  u.name
                );
              }
            }
            for (t = 0; t < a.length; t++)
              e = a[t], e.form === l.form && wf(e);
          }
          break l;
        case "textarea":
          Wf(l, a.value, a.defaultValue);
          break l;
        case "select":
          t = a.value, t != null && Ja(l, !!a.multiple, t, !1);
      }
    }
  }
  var oi = !1;
  function ls(l, t, a) {
    if (oi) return l(t, a);
    oi = !0;
    try {
      var e = l(t);
      return e;
    } finally {
      if (oi = !1, ($a !== null || Wa !== null) && (En(), $a && (t = $a, l = Wa, Wa = $a = null, Pf(t), l)))
        for (t = 0; t < l.length; t++) Pf(l[t]);
    }
  }
  function Ce(l, t) {
    var a = l.stateNode;
    if (a === null) return null;
    var e = a[$l] || null;
    if (e === null) return null;
    a = e[t];
    l: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (e = !e.disabled) || (l = l.type, e = !(l === "button" || l === "input" || l === "select" || l === "textarea")), l = !e;
        break l;
      default:
        l = !1;
    }
    if (l) return null;
    if (a && typeof a != "function")
      throw Error(
        f(231, t, typeof a)
      );
    return a;
  }
  var Bt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ri = !1;
  if (Bt)
    try {
      var Be = {};
      Object.defineProperty(Be, "passive", {
        get: function() {
          ri = !0;
        }
      }), window.addEventListener("test", Be, Be), window.removeEventListener("test", Be, Be);
    } catch {
      ri = !1;
    }
  var It = null, mi = null, Bu = null;
  function ts() {
    if (Bu) return Bu;
    var l, t = mi, a = t.length, e, u = "value" in It ? It.value : It.textContent, n = u.length;
    for (l = 0; l < a && t[l] === u[l]; l++) ;
    var i = a - l;
    for (e = 1; e <= i && t[a - e] === u[n - e]; e++) ;
    return Bu = u.slice(l, 1 < e ? 1 - e : void 0);
  }
  function qu(l) {
    var t = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function Yu() {
    return !0;
  }
  function as() {
    return !1;
  }
  function Wl(l) {
    function t(a, e, u, n, i) {
      this._reactName = a, this._targetInst = u, this.type = e, this.nativeEvent = n, this.target = i, this.currentTarget = null;
      for (var c in l)
        l.hasOwnProperty(c) && (a = l[c], this[c] = a ? a(n) : n[c]);
      return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? Yu : as, this.isPropagationStopped = as, this;
    }
    return D(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var a = this.nativeEvent;
        a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Yu);
      },
      stopPropagation: function() {
        var a = this.nativeEvent;
        a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Yu);
      },
      persist: function() {
      },
      isPersistent: Yu
    }), t;
  }
  var za = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, xu = Wl(za), qe = D({}, za, { view: 0, detail: 0 }), _m = Wl(qe), di, yi, Ye, Gu = D({}, qe, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: hi,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
      return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
    },
    movementX: function(l) {
      return "movementX" in l ? l.movementX : (l !== Ye && (Ye && l.type === "mousemove" ? (di = l.screenX - Ye.screenX, yi = l.screenY - Ye.screenY) : yi = di = 0, Ye = l), di);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : yi;
    }
  }), es = Wl(Gu), bm = D({}, Gu, { dataTransfer: 0 }), Em = Wl(bm), Am = D({}, qe, { relatedTarget: 0 }), vi = Wl(Am), pm = D({}, za, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Tm = Wl(pm), zm = D({}, za, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), Om = Wl(zm), Mm = D({}, za, { data: 0 }), us = Wl(Mm), Dm = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Um = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Nm = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Rm(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = Nm[l]) ? !!t[l] : !1;
  }
  function hi() {
    return Rm;
  }
  var Hm = D({}, qe, {
    key: function(l) {
      if (l.key) {
        var t = Dm[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = qu(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? Um[l.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: hi,
    charCode: function(l) {
      return l.type === "keypress" ? qu(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? qu(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), Cm = Wl(Hm), Bm = D({}, Gu, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), ns = Wl(Bm), qm = D({}, qe, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: hi
  }), Ym = Wl(qm), xm = D({}, za, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Gm = Wl(xm), Qm = D({}, Gu, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), jm = Wl(Qm), Xm = D({}, za, {
    newState: 0,
    oldState: 0
  }), Lm = Wl(Xm), Zm = [9, 13, 27, 32], gi = Bt && "CompositionEvent" in window, xe = null;
  Bt && "documentMode" in document && (xe = document.documentMode);
  var Vm = Bt && "TextEvent" in window && !xe, is = Bt && (!gi || xe && 8 < xe && 11 >= xe), cs = " ", fs = !1;
  function ss(l, t) {
    switch (l) {
      case "keyup":
        return Zm.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function os(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var ka = !1;
  function Km(l, t) {
    switch (l) {
      case "compositionend":
        return os(t);
      case "keypress":
        return t.which !== 32 ? null : (fs = !0, cs);
      case "textInput":
        return l = t.data, l === cs && fs ? null : l;
      default:
        return null;
    }
  }
  function Jm(l, t) {
    if (ka)
      return l === "compositionend" || !gi && ss(l, t) ? (l = ts(), Bu = mi = It = null, ka = !1, l) : null;
    switch (l) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return is && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var wm = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function rs(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!wm[l.type] : t === "textarea";
  }
  function ms(l, t, a, e) {
    $a ? Wa ? Wa.push(e) : Wa = [e] : $a = e, t = Dn(t, "onChange"), 0 < t.length && (a = new xu(
      "onChange",
      "change",
      null,
      a,
      e
    ), l.push({ event: a, listeners: t }));
  }
  var Ge = null, Qe = null;
  function $m(l) {
    W0(l, 0);
  }
  function Qu(l) {
    var t = He(l);
    if (wf(t)) return l;
  }
  function ds(l, t) {
    if (l === "change") return t;
  }
  var ys = !1;
  if (Bt) {
    var Si;
    if (Bt) {
      var _i = "oninput" in document;
      if (!_i) {
        var vs = document.createElement("div");
        vs.setAttribute("oninput", "return;"), _i = typeof vs.oninput == "function";
      }
      Si = _i;
    } else Si = !1;
    ys = Si && (!document.documentMode || 9 < document.documentMode);
  }
  function hs() {
    Ge && (Ge.detachEvent("onpropertychange", gs), Qe = Ge = null);
  }
  function gs(l) {
    if (l.propertyName === "value" && Qu(Qe)) {
      var t = [];
      ms(
        t,
        Qe,
        l,
        si(l)
      ), ls($m, t);
    }
  }
  function Wm(l, t, a) {
    l === "focusin" ? (hs(), Ge = t, Qe = a, Ge.attachEvent("onpropertychange", gs)) : l === "focusout" && hs();
  }
  function km(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return Qu(Qe);
  }
  function Fm(l, t) {
    if (l === "click") return Qu(t);
  }
  function Im(l, t) {
    if (l === "input" || l === "change")
      return Qu(t);
  }
  function Pm(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var nt = typeof Object.is == "function" ? Object.is : Pm;
  function je(l, t) {
    if (nt(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var a = Object.keys(l), e = Object.keys(t);
    if (a.length !== e.length) return !1;
    for (e = 0; e < a.length; e++) {
      var u = a[e];
      if (!kn.call(t, u) || !nt(l[u], t[u]))
        return !1;
    }
    return !0;
  }
  function Ss(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function _s(l, t) {
    var a = Ss(l);
    l = 0;
    for (var e; a; ) {
      if (a.nodeType === 3) {
        if (e = l + a.textContent.length, l <= t && e >= t)
          return { node: a, offset: t - l };
        l = e;
      }
      l: {
        for (; a; ) {
          if (a.nextSibling) {
            a = a.nextSibling;
            break l;
          }
          a = a.parentNode;
        }
        a = void 0;
      }
      a = Ss(a);
    }
  }
  function bs(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? bs(l, t.parentNode) : "contains" in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Es(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var t = Hu(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var a = typeof t.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) l = t.contentWindow;
      else break;
      t = Hu(l.document);
    }
    return t;
  }
  function bi(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true");
  }
  var ld = Bt && "documentMode" in document && 11 >= document.documentMode, Fa = null, Ei = null, Xe = null, Ai = !1;
  function As(l, t, a) {
    var e = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    Ai || Fa == null || Fa !== Hu(e) || (e = Fa, "selectionStart" in e && bi(e) ? e = { start: e.selectionStart, end: e.selectionEnd } : (e = (e.ownerDocument && e.ownerDocument.defaultView || window).getSelection(), e = {
      anchorNode: e.anchorNode,
      anchorOffset: e.anchorOffset,
      focusNode: e.focusNode,
      focusOffset: e.focusOffset
    }), Xe && je(Xe, e) || (Xe = e, e = Dn(Ei, "onSelect"), 0 < e.length && (t = new xu(
      "onSelect",
      "select",
      null,
      t,
      a
    ), l.push({ event: t, listeners: e }), t.target = Fa)));
  }
  function Oa(l, t) {
    var a = {};
    return a[l.toLowerCase()] = t.toLowerCase(), a["Webkit" + l] = "webkit" + t, a["Moz" + l] = "moz" + t, a;
  }
  var Ia = {
    animationend: Oa("Animation", "AnimationEnd"),
    animationiteration: Oa("Animation", "AnimationIteration"),
    animationstart: Oa("Animation", "AnimationStart"),
    transitionrun: Oa("Transition", "TransitionRun"),
    transitionstart: Oa("Transition", "TransitionStart"),
    transitioncancel: Oa("Transition", "TransitionCancel"),
    transitionend: Oa("Transition", "TransitionEnd")
  }, pi = {}, ps = {};
  Bt && (ps = document.createElement("div").style, "AnimationEvent" in window || (delete Ia.animationend.animation, delete Ia.animationiteration.animation, delete Ia.animationstart.animation), "TransitionEvent" in window || delete Ia.transitionend.transition);
  function Ma(l) {
    if (pi[l]) return pi[l];
    if (!Ia[l]) return l;
    var t = Ia[l], a;
    for (a in t)
      if (t.hasOwnProperty(a) && a in ps)
        return pi[l] = t[a];
    return l;
  }
  var Ts = Ma("animationend"), zs = Ma("animationiteration"), Os = Ma("animationstart"), td = Ma("transitionrun"), ad = Ma("transitionstart"), ed = Ma("transitioncancel"), Ms = Ma("transitionend"), Ds = /* @__PURE__ */ new Map(), Ti = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Ti.push("scrollEnd");
  function pt(l, t) {
    Ds.set(l, t), Ta(t, [l]);
  }
  var ju = typeof reportError == "function" ? reportError : function(l) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof l == "object" && l !== null && typeof l.message == "string" ? String(l.message) : String(l),
        error: l
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", l);
      return;
    }
    console.error(l);
  }, yt = [], Pa = 0, zi = 0;
  function Xu() {
    for (var l = Pa, t = zi = Pa = 0; t < l; ) {
      var a = yt[t];
      yt[t++] = null;
      var e = yt[t];
      yt[t++] = null;
      var u = yt[t];
      yt[t++] = null;
      var n = yt[t];
      if (yt[t++] = null, e !== null && u !== null) {
        var i = e.pending;
        i === null ? u.next = u : (u.next = i.next, i.next = u), e.pending = u;
      }
      n !== 0 && Us(a, u, n);
    }
  }
  function Lu(l, t, a, e) {
    yt[Pa++] = l, yt[Pa++] = t, yt[Pa++] = a, yt[Pa++] = e, zi |= e, l.lanes |= e, l = l.alternate, l !== null && (l.lanes |= e);
  }
  function Oi(l, t, a, e) {
    return Lu(l, t, a, e), Zu(l);
  }
  function Da(l, t) {
    return Lu(l, null, null, t), Zu(l);
  }
  function Us(l, t, a) {
    l.lanes |= a;
    var e = l.alternate;
    e !== null && (e.lanes |= a);
    for (var u = !1, n = l.return; n !== null; )
      n.childLanes |= a, e = n.alternate, e !== null && (e.childLanes |= a), n.tag === 22 && (l = n.stateNode, l === null || l._visibility & 1 || (u = !0)), l = n, n = n.return;
    return l.tag === 3 ? (n = l.stateNode, u && t !== null && (u = 31 - ut(a), l = n.hiddenUpdates, e = l[u], e === null ? l[u] = [t] : e.push(t), t.lane = a | 536870912), n) : null;
  }
  function Zu(l) {
    if (50 < su)
      throw su = 0, qc = null, Error(f(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var le = {};
  function ud(l, t, a, e) {
    this.tag = l, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = e, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function it(l, t, a, e) {
    return new ud(l, t, a, e);
  }
  function Mi(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function qt(l, t) {
    var a = l.alternate;
    return a === null ? (a = it(
      l.tag,
      t,
      l.key,
      l.mode
    ), a.elementType = l.elementType, a.type = l.type, a.stateNode = l.stateNode, a.alternate = l, l.alternate = a) : (a.pendingProps = t, a.type = l.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = l.flags & 65011712, a.childLanes = l.childLanes, a.lanes = l.lanes, a.child = l.child, a.memoizedProps = l.memoizedProps, a.memoizedState = l.memoizedState, a.updateQueue = l.updateQueue, t = l.dependencies, a.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, a.sibling = l.sibling, a.index = l.index, a.ref = l.ref, a.refCleanup = l.refCleanup, a;
  }
  function Ns(l, t) {
    l.flags &= 65011714;
    var a = l.alternate;
    return a === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = a.childLanes, l.lanes = a.lanes, l.child = a.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = a.memoizedProps, l.memoizedState = a.memoizedState, l.updateQueue = a.updateQueue, l.type = a.type, t = a.dependencies, l.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), l;
  }
  function Vu(l, t, a, e, u, n) {
    var i = 0;
    if (e = l, typeof l == "function") Mi(l) && (i = 1);
    else if (typeof l == "string")
      i = sy(
        l,
        a,
        Y.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (l) {
        case sl:
          return l = it(31, a, t, u), l.elementType = sl, l.lanes = n, l;
        case vl:
          return Ua(a.children, u, n, t);
        case xl:
          i = 8, u |= 24;
          break;
        case Hl:
          return l = it(12, a, t, u | 2), l.elementType = Hl, l.lanes = n, l;
        case Dl:
          return l = it(13, a, t, u), l.elementType = Dl, l.lanes = n, l;
        case Ul:
          return l = it(19, a, t, u), l.elementType = Ul, l.lanes = n, l;
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case hl:
                i = 10;
                break l;
              case Zl:
                i = 9;
                break l;
              case Cl:
                i = 11;
                break l;
              case J:
                i = 14;
                break l;
              case Bl:
                i = 16, e = null;
                break l;
            }
          i = 29, a = Error(
            f(130, l === null ? "null" : typeof l, "")
          ), e = null;
      }
    return t = it(i, a, t, u), t.elementType = l, t.type = e, t.lanes = n, t;
  }
  function Ua(l, t, a, e) {
    return l = it(7, l, e, t), l.lanes = a, l;
  }
  function Di(l, t, a) {
    return l = it(6, l, null, t), l.lanes = a, l;
  }
  function Rs(l) {
    var t = it(18, null, null, 0);
    return t.stateNode = l, t;
  }
  function Ui(l, t, a) {
    return t = it(
      4,
      l.children !== null ? l.children : [],
      l.key,
      t
    ), t.lanes = a, t.stateNode = {
      containerInfo: l.containerInfo,
      pendingChildren: null,
      implementation: l.implementation
    }, t;
  }
  var Hs = /* @__PURE__ */ new WeakMap();
  function vt(l, t) {
    if (typeof l == "object" && l !== null) {
      var a = Hs.get(l);
      return a !== void 0 ? a : (t = {
        value: l,
        source: t,
        stack: Rf(t)
      }, Hs.set(l, t), t);
    }
    return {
      value: l,
      source: t,
      stack: Rf(t)
    };
  }
  var te = [], ae = 0, Ku = null, Le = 0, ht = [], gt = 0, Pt = null, Mt = 1, Dt = "";
  function Yt(l, t) {
    te[ae++] = Le, te[ae++] = Ku, Ku = l, Le = t;
  }
  function Cs(l, t, a) {
    ht[gt++] = Mt, ht[gt++] = Dt, ht[gt++] = Pt, Pt = l;
    var e = Mt;
    l = Dt;
    var u = 32 - ut(e) - 1;
    e &= ~(1 << u), a += 1;
    var n = 32 - ut(t) + u;
    if (30 < n) {
      var i = u - u % 5;
      n = (e & (1 << i) - 1).toString(32), e >>= i, u -= i, Mt = 1 << 32 - ut(t) + u | a << u | e, Dt = n + l;
    } else
      Mt = 1 << n | a << u | e, Dt = l;
  }
  function Ni(l) {
    l.return !== null && (Yt(l, 1), Cs(l, 1, 0));
  }
  function Ri(l) {
    for (; l === Ku; )
      Ku = te[--ae], te[ae] = null, Le = te[--ae], te[ae] = null;
    for (; l === Pt; )
      Pt = ht[--gt], ht[gt] = null, Dt = ht[--gt], ht[gt] = null, Mt = ht[--gt], ht[gt] = null;
  }
  function Bs(l, t) {
    ht[gt++] = Mt, ht[gt++] = Dt, ht[gt++] = Pt, Mt = t.id, Dt = t.overflow, Pt = l;
  }
  var Ql = null, ml = null, I = !1, la = null, St = !1, Hi = Error(f(519));
  function ta(l) {
    var t = Error(
      f(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Ze(vt(t, l)), Hi;
  }
  function qs(l) {
    var t = l.stateNode, a = l.type, e = l.memoizedProps;
    switch (t[Gl] = l, t[$l] = e, a) {
      case "dialog":
        W("cancel", t), W("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        W("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < ru.length; a++)
          W(ru[a], t);
        break;
      case "source":
        W("error", t);
        break;
      case "img":
      case "image":
      case "link":
        W("error", t), W("load", t);
        break;
      case "details":
        W("toggle", t);
        break;
      case "input":
        W("invalid", t), $f(
          t,
          e.value,
          e.defaultValue,
          e.checked,
          e.defaultChecked,
          e.type,
          e.name,
          !0
        );
        break;
      case "select":
        W("invalid", t);
        break;
      case "textarea":
        W("invalid", t), kf(t, e.value, e.defaultValue, e.children);
    }
    a = e.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || e.suppressHydrationWarning === !0 || P0(t.textContent, a) ? (e.popover != null && (W("beforetoggle", t), W("toggle", t)), e.onScroll != null && W("scroll", t), e.onScrollEnd != null && W("scrollend", t), e.onClick != null && (t.onclick = Ct), t = !0) : t = !1, t || ta(l, !0);
  }
  function Ys(l) {
    for (Ql = l.return; Ql; )
      switch (Ql.tag) {
        case 5:
        case 31:
        case 13:
          St = !1;
          return;
        case 27:
        case 3:
          St = !0;
          return;
        default:
          Ql = Ql.return;
      }
  }
  function ee(l) {
    if (l !== Ql) return !1;
    if (!I) return Ys(l), I = !0, !1;
    var t = l.tag, a;
    if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = l.type, a = !(a !== "form" && a !== "button") || kc(l.type, l.memoizedProps)), a = !a), a && ml && ta(l), Ys(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(f(317));
      ml = fr(l);
    } else if (t === 31) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(f(317));
      ml = fr(l);
    } else
      t === 27 ? (t = ml, va(l.type) ? (l = tf, tf = null, ml = l) : ml = t) : ml = Ql ? bt(l.stateNode.nextSibling) : null;
    return !0;
  }
  function Na() {
    ml = Ql = null, I = !1;
  }
  function Ci() {
    var l = la;
    return l !== null && (Pl === null ? Pl = l : Pl.push.apply(
      Pl,
      l
    ), la = null), l;
  }
  function Ze(l) {
    la === null ? la = [l] : la.push(l);
  }
  var Bi = m(null), Ra = null, xt = null;
  function aa(l, t, a) {
    C(Bi, t._currentValue), t._currentValue = a;
  }
  function Gt(l) {
    l._currentValue = Bi.current, O(Bi);
  }
  function qi(l, t, a) {
    for (; l !== null; ) {
      var e = l.alternate;
      if ((l.childLanes & t) !== t ? (l.childLanes |= t, e !== null && (e.childLanes |= t)) : e !== null && (e.childLanes & t) !== t && (e.childLanes |= t), l === a) break;
      l = l.return;
    }
  }
  function Yi(l, t, a, e) {
    var u = l.child;
    for (u !== null && (u.return = l); u !== null; ) {
      var n = u.dependencies;
      if (n !== null) {
        var i = u.child;
        n = n.firstContext;
        l: for (; n !== null; ) {
          var c = n;
          n = u;
          for (var o = 0; o < t.length; o++)
            if (c.context === t[o]) {
              n.lanes |= a, c = n.alternate, c !== null && (c.lanes |= a), qi(
                n.return,
                a,
                l
              ), e || (i = null);
              break l;
            }
          n = c.next;
        }
      } else if (u.tag === 18) {
        if (i = u.return, i === null) throw Error(f(341));
        i.lanes |= a, n = i.alternate, n !== null && (n.lanes |= a), qi(i, a, l), i = null;
      } else i = u.child;
      if (i !== null) i.return = u;
      else
        for (i = u; i !== null; ) {
          if (i === l) {
            i = null;
            break;
          }
          if (u = i.sibling, u !== null) {
            u.return = i.return, i = u;
            break;
          }
          i = i.return;
        }
      u = i;
    }
  }
  function ue(l, t, a, e) {
    l = null;
    for (var u = t, n = !1; u !== null; ) {
      if (!n) {
        if ((u.flags & 524288) !== 0) n = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var i = u.alternate;
        if (i === null) throw Error(f(387));
        if (i = i.memoizedProps, i !== null) {
          var c = u.type;
          nt(u.pendingProps.value, i.value) || (l !== null ? l.push(c) : l = [c]);
        }
      } else if (u === al.current) {
        if (i = u.alternate, i === null) throw Error(f(387));
        i.memoizedState.memoizedState !== u.memoizedState.memoizedState && (l !== null ? l.push(hu) : l = [hu]);
      }
      u = u.return;
    }
    l !== null && Yi(
      t,
      l,
      a,
      e
    ), t.flags |= 262144;
  }
  function Ju(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!nt(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function Ha(l) {
    Ra = l, xt = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function jl(l) {
    return xs(Ra, l);
  }
  function wu(l, t) {
    return Ra === null && Ha(l), xs(l, t);
  }
  function xs(l, t) {
    var a = t._currentValue;
    if (t = { context: t, memoizedValue: a, next: null }, xt === null) {
      if (l === null) throw Error(f(308));
      xt = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else xt = xt.next = t;
    return a;
  }
  var nd = typeof AbortController < "u" ? AbortController : function() {
    var l = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(a, e) {
        l.push(e);
      }
    };
    this.abort = function() {
      t.aborted = !0, l.forEach(function(a) {
        return a();
      });
    };
  }, id = s.unstable_scheduleCallback, cd = s.unstable_NormalPriority, pl = {
    $$typeof: hl,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function xi() {
    return {
      controller: new nd(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ve(l) {
    l.refCount--, l.refCount === 0 && id(cd, function() {
      l.controller.abort();
    });
  }
  var Ke = null, Gi = 0, ne = 0, ie = null;
  function fd(l, t) {
    if (Ke === null) {
      var a = Ke = [];
      Gi = 0, ne = Xc(), ie = {
        status: "pending",
        value: void 0,
        then: function(e) {
          a.push(e);
        }
      };
    }
    return Gi++, t.then(Gs, Gs), t;
  }
  function Gs() {
    if (--Gi === 0 && Ke !== null) {
      ie !== null && (ie.status = "fulfilled");
      var l = Ke;
      Ke = null, ne = 0, ie = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function sd(l, t) {
    var a = [], e = {
      status: "pending",
      value: null,
      reason: null,
      then: function(u) {
        a.push(u);
      }
    };
    return l.then(
      function() {
        e.status = "fulfilled", e.value = t;
        for (var u = 0; u < a.length; u++) (0, a[u])(t);
      },
      function(u) {
        for (e.status = "rejected", e.reason = u, u = 0; u < a.length; u++)
          (0, a[u])(void 0);
      }
    ), e;
  }
  var Qs = p.S;
  p.S = function(l, t) {
    p0 = at(), typeof t == "object" && t !== null && typeof t.then == "function" && fd(l, t), Qs !== null && Qs(l, t);
  };
  var Ca = m(null);
  function Qi() {
    var l = Ca.current;
    return l !== null ? l : rl.pooledCache;
  }
  function $u(l, t) {
    t === null ? C(Ca, Ca.current) : C(Ca, t.pool);
  }
  function js() {
    var l = Qi();
    return l === null ? null : { parent: pl._currentValue, pool: l };
  }
  var ce = Error(f(460)), ji = Error(f(474)), Wu = Error(f(542)), ku = { then: function() {
  } };
  function Xs(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function Ls(l, t, a) {
    switch (a = l[a], a === void 0 ? l.push(t) : a !== t && (t.then(Ct, Ct), t = a), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw l = t.reason, Vs(l), l;
      default:
        if (typeof t.status == "string") t.then(Ct, Ct);
        else {
          if (l = rl, l !== null && 100 < l.shellSuspendCounter)
            throw Error(f(482));
          l = t, l.status = "pending", l.then(
            function(e) {
              if (t.status === "pending") {
                var u = t;
                u.status = "fulfilled", u.value = e;
              }
            },
            function(e) {
              if (t.status === "pending") {
                var u = t;
                u.status = "rejected", u.reason = e;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw l = t.reason, Vs(l), l;
        }
        throw qa = t, ce;
    }
  }
  function Ba(l) {
    try {
      var t = l._init;
      return t(l._payload);
    } catch (a) {
      throw a !== null && typeof a == "object" && typeof a.then == "function" ? (qa = a, ce) : a;
    }
  }
  var qa = null;
  function Zs() {
    if (qa === null) throw Error(f(459));
    var l = qa;
    return qa = null, l;
  }
  function Vs(l) {
    if (l === ce || l === Wu)
      throw Error(f(483));
  }
  var fe = null, Je = 0;
  function Fu(l) {
    var t = Je;
    return Je += 1, fe === null && (fe = []), Ls(fe, l, t);
  }
  function we(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  }
  function Iu(l, t) {
    throw t.$$typeof === X ? Error(f(525)) : (l = Object.prototype.toString.call(t), Error(
      f(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : l
      )
    ));
  }
  function Ks(l) {
    function t(y, r) {
      if (l) {
        var h = y.deletions;
        h === null ? (y.deletions = [r], y.flags |= 16) : h.push(r);
      }
    }
    function a(y, r) {
      if (!l) return null;
      for (; r !== null; )
        t(y, r), r = r.sibling;
      return null;
    }
    function e(y) {
      for (var r = /* @__PURE__ */ new Map(); y !== null; )
        y.key !== null ? r.set(y.key, y) : r.set(y.index, y), y = y.sibling;
      return r;
    }
    function u(y, r) {
      return y = qt(y, r), y.index = 0, y.sibling = null, y;
    }
    function n(y, r, h) {
      return y.index = h, l ? (h = y.alternate, h !== null ? (h = h.index, h < r ? (y.flags |= 67108866, r) : h) : (y.flags |= 67108866, r)) : (y.flags |= 1048576, r);
    }
    function i(y) {
      return l && y.alternate === null && (y.flags |= 67108866), y;
    }
    function c(y, r, h, T) {
      return r === null || r.tag !== 6 ? (r = Di(h, y.mode, T), r.return = y, r) : (r = u(r, h), r.return = y, r);
    }
    function o(y, r, h, T) {
      var G = h.type;
      return G === vl ? A(
        y,
        r,
        h.props.children,
        T,
        h.key
      ) : r !== null && (r.elementType === G || typeof G == "object" && G !== null && G.$$typeof === Bl && Ba(G) === r.type) ? (r = u(r, h.props), we(r, h), r.return = y, r) : (r = Vu(
        h.type,
        h.key,
        h.props,
        null,
        y.mode,
        T
      ), we(r, h), r.return = y, r);
    }
    function g(y, r, h, T) {
      return r === null || r.tag !== 4 || r.stateNode.containerInfo !== h.containerInfo || r.stateNode.implementation !== h.implementation ? (r = Ui(h, y.mode, T), r.return = y, r) : (r = u(r, h.children || []), r.return = y, r);
    }
    function A(y, r, h, T, G) {
      return r === null || r.tag !== 7 ? (r = Ua(
        h,
        y.mode,
        T,
        G
      ), r.return = y, r) : (r = u(r, h), r.return = y, r);
    }
    function z(y, r, h) {
      if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint")
        return r = Di(
          "" + r,
          y.mode,
          h
        ), r.return = y, r;
      if (typeof r == "object" && r !== null) {
        switch (r.$$typeof) {
          case _l:
            return h = Vu(
              r.type,
              r.key,
              r.props,
              null,
              y.mode,
              h
            ), we(h, r), h.return = y, h;
          case Rl:
            return r = Ui(
              r,
              y.mode,
              h
            ), r.return = y, r;
          case Bl:
            return r = Ba(r), z(y, r, h);
        }
        if (At(r) || wl(r))
          return r = Ua(
            r,
            y.mode,
            h,
            null
          ), r.return = y, r;
        if (typeof r.then == "function")
          return z(y, Fu(r), h);
        if (r.$$typeof === hl)
          return z(
            y,
            wu(y, r),
            h
          );
        Iu(y, r);
      }
      return null;
    }
    function S(y, r, h, T) {
      var G = r !== null ? r.key : null;
      if (typeof h == "string" && h !== "" || typeof h == "number" || typeof h == "bigint")
        return G !== null ? null : c(y, r, "" + h, T);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case _l:
            return h.key === G ? o(y, r, h, T) : null;
          case Rl:
            return h.key === G ? g(y, r, h, T) : null;
          case Bl:
            return h = Ba(h), S(y, r, h, T);
        }
        if (At(h) || wl(h))
          return G !== null ? null : A(y, r, h, T, null);
        if (typeof h.then == "function")
          return S(
            y,
            r,
            Fu(h),
            T
          );
        if (h.$$typeof === hl)
          return S(
            y,
            r,
            wu(y, h),
            T
          );
        Iu(y, h);
      }
      return null;
    }
    function _(y, r, h, T, G) {
      if (typeof T == "string" && T !== "" || typeof T == "number" || typeof T == "bigint")
        return y = y.get(h) || null, c(r, y, "" + T, G);
      if (typeof T == "object" && T !== null) {
        switch (T.$$typeof) {
          case _l:
            return y = y.get(
              T.key === null ? h : T.key
            ) || null, o(r, y, T, G);
          case Rl:
            return y = y.get(
              T.key === null ? h : T.key
            ) || null, g(r, y, T, G);
          case Bl:
            return T = Ba(T), _(
              y,
              r,
              h,
              T,
              G
            );
        }
        if (At(T) || wl(T))
          return y = y.get(h) || null, A(r, y, T, G, null);
        if (typeof T.then == "function")
          return _(
            y,
            r,
            h,
            Fu(T),
            G
          );
        if (T.$$typeof === hl)
          return _(
            y,
            r,
            h,
            wu(r, T),
            G
          );
        Iu(r, T);
      }
      return null;
    }
    function q(y, r, h, T) {
      for (var G = null, P = null, x = r, K = r = 0, F = null; x !== null && K < h.length; K++) {
        x.index > K ? (F = x, x = null) : F = x.sibling;
        var ll = S(
          y,
          x,
          h[K],
          T
        );
        if (ll === null) {
          x === null && (x = F);
          break;
        }
        l && x && ll.alternate === null && t(y, x), r = n(ll, r, K), P === null ? G = ll : P.sibling = ll, P = ll, x = F;
      }
      if (K === h.length)
        return a(y, x), I && Yt(y, K), G;
      if (x === null) {
        for (; K < h.length; K++)
          x = z(y, h[K], T), x !== null && (r = n(
            x,
            r,
            K
          ), P === null ? G = x : P.sibling = x, P = x);
        return I && Yt(y, K), G;
      }
      for (x = e(x); K < h.length; K++)
        F = _(
          x,
          y,
          K,
          h[K],
          T
        ), F !== null && (l && F.alternate !== null && x.delete(
          F.key === null ? K : F.key
        ), r = n(
          F,
          r,
          K
        ), P === null ? G = F : P.sibling = F, P = F);
      return l && x.forEach(function(ba) {
        return t(y, ba);
      }), I && Yt(y, K), G;
    }
    function Q(y, r, h, T) {
      if (h == null) throw Error(f(151));
      for (var G = null, P = null, x = r, K = r = 0, F = null, ll = h.next(); x !== null && !ll.done; K++, ll = h.next()) {
        x.index > K ? (F = x, x = null) : F = x.sibling;
        var ba = S(y, x, ll.value, T);
        if (ba === null) {
          x === null && (x = F);
          break;
        }
        l && x && ba.alternate === null && t(y, x), r = n(ba, r, K), P === null ? G = ba : P.sibling = ba, P = ba, x = F;
      }
      if (ll.done)
        return a(y, x), I && Yt(y, K), G;
      if (x === null) {
        for (; !ll.done; K++, ll = h.next())
          ll = z(y, ll.value, T), ll !== null && (r = n(ll, r, K), P === null ? G = ll : P.sibling = ll, P = ll);
        return I && Yt(y, K), G;
      }
      for (x = e(x); !ll.done; K++, ll = h.next())
        ll = _(x, y, K, ll.value, T), ll !== null && (l && ll.alternate !== null && x.delete(ll.key === null ? K : ll.key), r = n(ll, r, K), P === null ? G = ll : P.sibling = ll, P = ll);
      return l && x.forEach(function(by) {
        return t(y, by);
      }), I && Yt(y, K), G;
    }
    function fl(y, r, h, T) {
      if (typeof h == "object" && h !== null && h.type === vl && h.key === null && (h = h.props.children), typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case _l:
            l: {
              for (var G = h.key; r !== null; ) {
                if (r.key === G) {
                  if (G = h.type, G === vl) {
                    if (r.tag === 7) {
                      a(
                        y,
                        r.sibling
                      ), T = u(
                        r,
                        h.props.children
                      ), T.return = y, y = T;
                      break l;
                    }
                  } else if (r.elementType === G || typeof G == "object" && G !== null && G.$$typeof === Bl && Ba(G) === r.type) {
                    a(
                      y,
                      r.sibling
                    ), T = u(r, h.props), we(T, h), T.return = y, y = T;
                    break l;
                  }
                  a(y, r);
                  break;
                } else t(y, r);
                r = r.sibling;
              }
              h.type === vl ? (T = Ua(
                h.props.children,
                y.mode,
                T,
                h.key
              ), T.return = y, y = T) : (T = Vu(
                h.type,
                h.key,
                h.props,
                null,
                y.mode,
                T
              ), we(T, h), T.return = y, y = T);
            }
            return i(y);
          case Rl:
            l: {
              for (G = h.key; r !== null; ) {
                if (r.key === G)
                  if (r.tag === 4 && r.stateNode.containerInfo === h.containerInfo && r.stateNode.implementation === h.implementation) {
                    a(
                      y,
                      r.sibling
                    ), T = u(r, h.children || []), T.return = y, y = T;
                    break l;
                  } else {
                    a(y, r);
                    break;
                  }
                else t(y, r);
                r = r.sibling;
              }
              T = Ui(h, y.mode, T), T.return = y, y = T;
            }
            return i(y);
          case Bl:
            return h = Ba(h), fl(
              y,
              r,
              h,
              T
            );
        }
        if (At(h))
          return q(
            y,
            r,
            h,
            T
          );
        if (wl(h)) {
          if (G = wl(h), typeof G != "function") throw Error(f(150));
          return h = G.call(h), Q(
            y,
            r,
            h,
            T
          );
        }
        if (typeof h.then == "function")
          return fl(
            y,
            r,
            Fu(h),
            T
          );
        if (h.$$typeof === hl)
          return fl(
            y,
            r,
            wu(y, h),
            T
          );
        Iu(y, h);
      }
      return typeof h == "string" && h !== "" || typeof h == "number" || typeof h == "bigint" ? (h = "" + h, r !== null && r.tag === 6 ? (a(y, r.sibling), T = u(r, h), T.return = y, y = T) : (a(y, r), T = Di(h, y.mode, T), T.return = y, y = T), i(y)) : a(y, r);
    }
    return function(y, r, h, T) {
      try {
        Je = 0;
        var G = fl(
          y,
          r,
          h,
          T
        );
        return fe = null, G;
      } catch (x) {
        if (x === ce || x === Wu) throw x;
        var P = it(29, x, null, y.mode);
        return P.lanes = T, P.return = y, P;
      } finally {
      }
    };
  }
  var Ya = Ks(!0), Js = Ks(!1), ea = !1;
  function Xi(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Li(l, t) {
    l = l.updateQueue, t.updateQueue === l && (t.updateQueue = {
      baseState: l.baseState,
      firstBaseUpdate: l.firstBaseUpdate,
      lastBaseUpdate: l.lastBaseUpdate,
      shared: l.shared,
      callbacks: null
    });
  }
  function ua(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function na(l, t, a) {
    var e = l.updateQueue;
    if (e === null) return null;
    if (e = e.shared, (tl & 2) !== 0) {
      var u = e.pending;
      return u === null ? t.next = t : (t.next = u.next, u.next = t), e.pending = t, t = Zu(l), Us(l, null, a), t;
    }
    return Lu(l, e, t, a), Zu(l);
  }
  function $e(l, t, a) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (a & 4194048) !== 0)) {
      var e = t.lanes;
      e &= l.pendingLanes, a |= e, t.lanes = a, xf(l, a);
    }
  }
  function Zi(l, t) {
    var a = l.updateQueue, e = l.alternate;
    if (e !== null && (e = e.updateQueue, a === e)) {
      var u = null, n = null;
      if (a = a.firstBaseUpdate, a !== null) {
        do {
          var i = {
            lane: a.lane,
            tag: a.tag,
            payload: a.payload,
            callback: null,
            next: null
          };
          n === null ? u = n = i : n = n.next = i, a = a.next;
        } while (a !== null);
        n === null ? u = n = t : n = n.next = t;
      } else u = n = t;
      a = {
        baseState: e.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: n,
        shared: e.shared,
        callbacks: e.callbacks
      }, l.updateQueue = a;
      return;
    }
    l = a.lastBaseUpdate, l === null ? a.firstBaseUpdate = t : l.next = t, a.lastBaseUpdate = t;
  }
  var Vi = !1;
  function We() {
    if (Vi) {
      var l = ie;
      if (l !== null) throw l;
    }
  }
  function ke(l, t, a, e) {
    Vi = !1;
    var u = l.updateQueue;
    ea = !1;
    var n = u.firstBaseUpdate, i = u.lastBaseUpdate, c = u.shared.pending;
    if (c !== null) {
      u.shared.pending = null;
      var o = c, g = o.next;
      o.next = null, i === null ? n = g : i.next = g, i = o;
      var A = l.alternate;
      A !== null && (A = A.updateQueue, c = A.lastBaseUpdate, c !== i && (c === null ? A.firstBaseUpdate = g : c.next = g, A.lastBaseUpdate = o));
    }
    if (n !== null) {
      var z = u.baseState;
      i = 0, A = g = o = null, c = n;
      do {
        var S = c.lane & -536870913, _ = S !== c.lane;
        if (_ ? (k & S) === S : (e & S) === S) {
          S !== 0 && S === ne && (Vi = !0), A !== null && (A = A.next = {
            lane: 0,
            tag: c.tag,
            payload: c.payload,
            callback: null,
            next: null
          });
          l: {
            var q = l, Q = c;
            S = t;
            var fl = a;
            switch (Q.tag) {
              case 1:
                if (q = Q.payload, typeof q == "function") {
                  z = q.call(fl, z, S);
                  break l;
                }
                z = q;
                break l;
              case 3:
                q.flags = q.flags & -65537 | 128;
              case 0:
                if (q = Q.payload, S = typeof q == "function" ? q.call(fl, z, S) : q, S == null) break l;
                z = D({}, z, S);
                break l;
              case 2:
                ea = !0;
            }
          }
          S = c.callback, S !== null && (l.flags |= 64, _ && (l.flags |= 8192), _ = u.callbacks, _ === null ? u.callbacks = [S] : _.push(S));
        } else
          _ = {
            lane: S,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null
          }, A === null ? (g = A = _, o = z) : A = A.next = _, i |= S;
        if (c = c.next, c === null) {
          if (c = u.shared.pending, c === null)
            break;
          _ = c, c = _.next, _.next = null, u.lastBaseUpdate = _, u.shared.pending = null;
        }
      } while (!0);
      A === null && (o = z), u.baseState = o, u.firstBaseUpdate = g, u.lastBaseUpdate = A, n === null && (u.shared.lanes = 0), oa |= i, l.lanes = i, l.memoizedState = z;
    }
  }
  function ws(l, t) {
    if (typeof l != "function")
      throw Error(f(191, l));
    l.call(t);
  }
  function $s(l, t) {
    var a = l.callbacks;
    if (a !== null)
      for (l.callbacks = null, l = 0; l < a.length; l++)
        ws(a[l], t);
  }
  var se = m(null), Pu = m(0);
  function Ws(l, t) {
    l = wt, C(Pu, l), C(se, t), wt = l | t.baseLanes;
  }
  function Ki() {
    C(Pu, wt), C(se, se.current);
  }
  function Ji() {
    wt = Pu.current, O(se), O(Pu);
  }
  var ct = m(null), _t = null;
  function ia(l) {
    var t = l.alternate;
    C(El, El.current & 1), C(ct, l), _t === null && (t === null || se.current !== null || t.memoizedState !== null) && (_t = l);
  }
  function wi(l) {
    C(El, El.current), C(ct, l), _t === null && (_t = l);
  }
  function ks(l) {
    l.tag === 22 ? (C(El, El.current), C(ct, l), _t === null && (_t = l)) : ca();
  }
  function ca() {
    C(El, El.current), C(ct, ct.current);
  }
  function ft(l) {
    O(ct), _t === l && (_t = null), O(El);
  }
  var El = m(0);
  function ln(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var a = t.memoizedState;
        if (a !== null && (a = a.dehydrated, a === null || Pc(a) || lf(a)))
          return t;
      } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === l) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === l) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Qt = 0, V = null, il = null, Tl = null, tn = !1, oe = !1, xa = !1, an = 0, Fe = 0, re = null, od = 0;
  function gl() {
    throw Error(f(321));
  }
  function $i(l, t) {
    if (t === null) return !1;
    for (var a = 0; a < t.length && a < l.length; a++)
      if (!nt(l[a], t[a])) return !1;
    return !0;
  }
  function Wi(l, t, a, e, u, n) {
    return Qt = n, V = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, p.H = l === null || l.memoizedState === null ? Bo : oc, xa = !1, n = a(e, u), xa = !1, oe && (n = Is(
      t,
      a,
      e,
      u
    )), Fs(l), n;
  }
  function Fs(l) {
    p.H = lu;
    var t = il !== null && il.next !== null;
    if (Qt = 0, Tl = il = V = null, tn = !1, Fe = 0, re = null, t) throw Error(f(300));
    l === null || zl || (l = l.dependencies, l !== null && Ju(l) && (zl = !0));
  }
  function Is(l, t, a, e) {
    V = l;
    var u = 0;
    do {
      if (oe && (re = null), Fe = 0, oe = !1, 25 <= u) throw Error(f(301));
      if (u += 1, Tl = il = null, l.updateQueue != null) {
        var n = l.updateQueue;
        n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
      }
      p.H = qo, n = t(a, e);
    } while (oe);
    return n;
  }
  function rd() {
    var l = p.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? Ie(t) : t, l = l.useState()[0], (il !== null ? il.memoizedState : null) !== l && (V.flags |= 1024), t;
  }
  function ki() {
    var l = an !== 0;
    return an = 0, l;
  }
  function Fi(l, t, a) {
    t.updateQueue = l.updateQueue, t.flags &= -2053, l.lanes &= ~a;
  }
  function Ii(l) {
    if (tn) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        t !== null && (t.pending = null), l = l.next;
      }
      tn = !1;
    }
    Qt = 0, Tl = il = V = null, oe = !1, Fe = an = 0, re = null;
  }
  function Jl() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Tl === null ? V.memoizedState = Tl = l : Tl = Tl.next = l, Tl;
  }
  function Al() {
    if (il === null) {
      var l = V.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = il.next;
    var t = Tl === null ? V.memoizedState : Tl.next;
    if (t !== null)
      Tl = t, il = l;
    else {
      if (l === null)
        throw V.alternate === null ? Error(f(467)) : Error(f(310));
      il = l, l = {
        memoizedState: il.memoizedState,
        baseState: il.baseState,
        baseQueue: il.baseQueue,
        queue: il.queue,
        next: null
      }, Tl === null ? V.memoizedState = Tl = l : Tl = Tl.next = l;
    }
    return Tl;
  }
  function en() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Ie(l) {
    var t = Fe;
    return Fe += 1, re === null && (re = []), l = Ls(re, l, t), t = V, (Tl === null ? t.memoizedState : Tl.next) === null && (t = t.alternate, p.H = t === null || t.memoizedState === null ? Bo : oc), l;
  }
  function un(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return Ie(l);
      if (l.$$typeof === hl) return jl(l);
    }
    throw Error(f(438, String(l)));
  }
  function Pi(l) {
    var t = null, a = V.updateQueue;
    if (a !== null && (t = a.memoCache), t == null) {
      var e = V.alternate;
      e !== null && (e = e.updateQueue, e !== null && (e = e.memoCache, e != null && (t = {
        data: e.data.map(function(u) {
          return u.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), a === null && (a = en(), V.updateQueue = a), a.memoCache = t, a = t.data[t.index], a === void 0)
      for (a = t.data[t.index] = Array(l), e = 0; e < l; e++)
        a[e] = tt;
    return t.index++, a;
  }
  function jt(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function nn(l) {
    var t = Al();
    return lc(t, il, l);
  }
  function lc(l, t, a) {
    var e = l.queue;
    if (e === null) throw Error(f(311));
    e.lastRenderedReducer = a;
    var u = l.baseQueue, n = e.pending;
    if (n !== null) {
      if (u !== null) {
        var i = u.next;
        u.next = n.next, n.next = i;
      }
      t.baseQueue = u = n, e.pending = null;
    }
    if (n = l.baseState, u === null) l.memoizedState = n;
    else {
      t = u.next;
      var c = i = null, o = null, g = t, A = !1;
      do {
        var z = g.lane & -536870913;
        if (z !== g.lane ? (k & z) === z : (Qt & z) === z) {
          var S = g.revertLane;
          if (S === 0)
            o !== null && (o = o.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: g.action,
              hasEagerState: g.hasEagerState,
              eagerState: g.eagerState,
              next: null
            }), z === ne && (A = !0);
          else if ((Qt & S) === S) {
            g = g.next, S === ne && (A = !0);
            continue;
          } else
            z = {
              lane: 0,
              revertLane: g.revertLane,
              gesture: null,
              action: g.action,
              hasEagerState: g.hasEagerState,
              eagerState: g.eagerState,
              next: null
            }, o === null ? (c = o = z, i = n) : o = o.next = z, V.lanes |= S, oa |= S;
          z = g.action, xa && a(n, z), n = g.hasEagerState ? g.eagerState : a(n, z);
        } else
          S = {
            lane: z,
            revertLane: g.revertLane,
            gesture: g.gesture,
            action: g.action,
            hasEagerState: g.hasEagerState,
            eagerState: g.eagerState,
            next: null
          }, o === null ? (c = o = S, i = n) : o = o.next = S, V.lanes |= z, oa |= z;
        g = g.next;
      } while (g !== null && g !== t);
      if (o === null ? i = n : o.next = c, !nt(n, l.memoizedState) && (zl = !0, A && (a = ie, a !== null)))
        throw a;
      l.memoizedState = n, l.baseState = i, l.baseQueue = o, e.lastRenderedState = n;
    }
    return u === null && (e.lanes = 0), [l.memoizedState, e.dispatch];
  }
  function tc(l) {
    var t = Al(), a = t.queue;
    if (a === null) throw Error(f(311));
    a.lastRenderedReducer = l;
    var e = a.dispatch, u = a.pending, n = t.memoizedState;
    if (u !== null) {
      a.pending = null;
      var i = u = u.next;
      do
        n = l(n, i.action), i = i.next;
      while (i !== u);
      nt(n, t.memoizedState) || (zl = !0), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), a.lastRenderedState = n;
    }
    return [n, e];
  }
  function Ps(l, t, a) {
    var e = V, u = Al(), n = I;
    if (n) {
      if (a === void 0) throw Error(f(407));
      a = a();
    } else a = t();
    var i = !nt(
      (il || u).memoizedState,
      a
    );
    if (i && (u.memoizedState = a, zl = !0), u = u.queue, uc(ao.bind(null, e, u, l), [
      l
    ]), u.getSnapshot !== t || i || Tl !== null && Tl.memoizedState.tag & 1) {
      if (e.flags |= 2048, me(
        9,
        { destroy: void 0 },
        to.bind(
          null,
          e,
          u,
          a,
          t
        ),
        null
      ), rl === null) throw Error(f(349));
      n || (Qt & 127) !== 0 || lo(e, t, a);
    }
    return a;
  }
  function lo(l, t, a) {
    l.flags |= 16384, l = { getSnapshot: t, value: a }, t = V.updateQueue, t === null ? (t = en(), V.updateQueue = t, t.stores = [l]) : (a = t.stores, a === null ? t.stores = [l] : a.push(l));
  }
  function to(l, t, a, e) {
    t.value = a, t.getSnapshot = e, eo(t) && uo(l);
  }
  function ao(l, t, a) {
    return a(function() {
      eo(t) && uo(l);
    });
  }
  function eo(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var a = t();
      return !nt(l, a);
    } catch {
      return !0;
    }
  }
  function uo(l) {
    var t = Da(l, 2);
    t !== null && lt(t, l, 2);
  }
  function ac(l) {
    var t = Jl();
    if (typeof l == "function") {
      var a = l;
      if (l = a(), xa) {
        kt(!0);
        try {
          a();
        } finally {
          kt(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = l, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: jt,
      lastRenderedState: l
    }, t;
  }
  function no(l, t, a, e) {
    return l.baseState = a, lc(
      l,
      il,
      typeof e == "function" ? e : jt
    );
  }
  function md(l, t, a, e, u) {
    if (sn(l)) throw Error(f(485));
    if (l = t.action, l !== null) {
      var n = {
        payload: u,
        action: l,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(i) {
          n.listeners.push(i);
        }
      };
      p.T !== null ? a(!0) : n.isTransition = !1, e(n), a = t.pending, a === null ? (n.next = t.pending = n, io(t, n)) : (n.next = a.next, t.pending = a.next = n);
    }
  }
  function io(l, t) {
    var a = t.action, e = t.payload, u = l.state;
    if (t.isTransition) {
      var n = p.T, i = {};
      p.T = i;
      try {
        var c = a(u, e), o = p.S;
        o !== null && o(i, c), co(l, t, c);
      } catch (g) {
        ec(l, t, g);
      } finally {
        n !== null && i.types !== null && (n.types = i.types), p.T = n;
      }
    } else
      try {
        n = a(u, e), co(l, t, n);
      } catch (g) {
        ec(l, t, g);
      }
  }
  function co(l, t, a) {
    a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(
      function(e) {
        fo(l, t, e);
      },
      function(e) {
        return ec(l, t, e);
      }
    ) : fo(l, t, a);
  }
  function fo(l, t, a) {
    t.status = "fulfilled", t.value = a, so(t), l.state = a, t = l.pending, t !== null && (a = t.next, a === t ? l.pending = null : (a = a.next, t.next = a, io(l, a)));
  }
  function ec(l, t, a) {
    var e = l.pending;
    if (l.pending = null, e !== null) {
      e = e.next;
      do
        t.status = "rejected", t.reason = a, so(t), t = t.next;
      while (t !== e);
    }
    l.action = null;
  }
  function so(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function oo(l, t) {
    return t;
  }
  function ro(l, t) {
    if (I) {
      var a = rl.formState;
      if (a !== null) {
        l: {
          var e = V;
          if (I) {
            if (ml) {
              t: {
                for (var u = ml, n = St; u.nodeType !== 8; ) {
                  if (!n) {
                    u = null;
                    break t;
                  }
                  if (u = bt(
                    u.nextSibling
                  ), u === null) {
                    u = null;
                    break t;
                  }
                }
                n = u.data, u = n === "F!" || n === "F" ? u : null;
              }
              if (u) {
                ml = bt(
                  u.nextSibling
                ), e = u.data === "F!";
                break l;
              }
            }
            ta(e);
          }
          e = !1;
        }
        e && (t = a[0]);
      }
    }
    return a = Jl(), a.memoizedState = a.baseState = t, e = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: oo,
      lastRenderedState: t
    }, a.queue = e, a = Ro.bind(
      null,
      V,
      e
    ), e.dispatch = a, e = ac(!1), n = sc.bind(
      null,
      V,
      !1,
      e.queue
    ), e = Jl(), u = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, e.queue = u, a = md.bind(
      null,
      V,
      u,
      n,
      a
    ), u.dispatch = a, e.memoizedState = l, [t, a, !1];
  }
  function mo(l) {
    var t = Al();
    return yo(t, il, l);
  }
  function yo(l, t, a) {
    if (t = lc(
      l,
      t,
      oo
    )[0], l = nn(jt)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var e = Ie(t);
      } catch (i) {
        throw i === ce ? Wu : i;
      }
    else e = t;
    t = Al();
    var u = t.queue, n = u.dispatch;
    return a !== t.memoizedState && (V.flags |= 2048, me(
      9,
      { destroy: void 0 },
      dd.bind(null, u, a),
      null
    )), [e, n, l];
  }
  function dd(l, t) {
    l.action = t;
  }
  function vo(l) {
    var t = Al(), a = il;
    if (a !== null)
      return yo(t, a, l);
    Al(), t = t.memoizedState, a = Al();
    var e = a.queue.dispatch;
    return a.memoizedState = l, [t, e, !1];
  }
  function me(l, t, a, e) {
    return l = { tag: l, create: a, deps: e, inst: t, next: null }, t = V.updateQueue, t === null && (t = en(), V.updateQueue = t), a = t.lastEffect, a === null ? t.lastEffect = l.next = l : (e = a.next, a.next = l, l.next = e, t.lastEffect = l), l;
  }
  function ho() {
    return Al().memoizedState;
  }
  function cn(l, t, a, e) {
    var u = Jl();
    V.flags |= l, u.memoizedState = me(
      1 | t,
      { destroy: void 0 },
      a,
      e === void 0 ? null : e
    );
  }
  function fn(l, t, a, e) {
    var u = Al();
    e = e === void 0 ? null : e;
    var n = u.memoizedState.inst;
    il !== null && e !== null && $i(e, il.memoizedState.deps) ? u.memoizedState = me(t, n, a, e) : (V.flags |= l, u.memoizedState = me(
      1 | t,
      n,
      a,
      e
    ));
  }
  function go(l, t) {
    cn(8390656, 8, l, t);
  }
  function uc(l, t) {
    fn(2048, 8, l, t);
  }
  function yd(l) {
    V.flags |= 4;
    var t = V.updateQueue;
    if (t === null)
      t = en(), V.updateQueue = t, t.events = [l];
    else {
      var a = t.events;
      a === null ? t.events = [l] : a.push(l);
    }
  }
  function So(l) {
    var t = Al().memoizedState;
    return yd({ ref: t, nextImpl: l }), function() {
      if ((tl & 2) !== 0) throw Error(f(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function _o(l, t) {
    return fn(4, 2, l, t);
  }
  function bo(l, t) {
    return fn(4, 4, l, t);
  }
  function Eo(l, t) {
    if (typeof t == "function") {
      l = l();
      var a = t(l);
      return function() {
        typeof a == "function" ? a() : t(null);
      };
    }
    if (t != null)
      return l = l(), t.current = l, function() {
        t.current = null;
      };
  }
  function Ao(l, t, a) {
    a = a != null ? a.concat([l]) : null, fn(4, 4, Eo.bind(null, t, l), a);
  }
  function nc() {
  }
  function po(l, t) {
    var a = Al();
    t = t === void 0 ? null : t;
    var e = a.memoizedState;
    return t !== null && $i(t, e[1]) ? e[0] : (a.memoizedState = [l, t], l);
  }
  function To(l, t) {
    var a = Al();
    t = t === void 0 ? null : t;
    var e = a.memoizedState;
    if (t !== null && $i(t, e[1]))
      return e[0];
    if (e = l(), xa) {
      kt(!0);
      try {
        l();
      } finally {
        kt(!1);
      }
    }
    return a.memoizedState = [e, t], e;
  }
  function ic(l, t, a) {
    return a === void 0 || (Qt & 1073741824) !== 0 && (k & 261930) === 0 ? l.memoizedState = t : (l.memoizedState = a, l = z0(), V.lanes |= l, oa |= l, a);
  }
  function zo(l, t, a, e) {
    return nt(a, t) ? a : se.current !== null ? (l = ic(l, a, e), nt(l, t) || (zl = !0), l) : (Qt & 42) === 0 || (Qt & 1073741824) !== 0 && (k & 261930) === 0 ? (zl = !0, l.memoizedState = a) : (l = z0(), V.lanes |= l, oa |= l, t);
  }
  function Oo(l, t, a, e, u) {
    var n = R.p;
    R.p = n !== 0 && 8 > n ? n : 8;
    var i = p.T, c = {};
    p.T = c, sc(l, !1, t, a);
    try {
      var o = u(), g = p.S;
      if (g !== null && g(c, o), o !== null && typeof o == "object" && typeof o.then == "function") {
        var A = sd(
          o,
          e
        );
        Pe(
          l,
          t,
          A,
          rt(l)
        );
      } else
        Pe(
          l,
          t,
          e,
          rt(l)
        );
    } catch (z) {
      Pe(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: z },
        rt()
      );
    } finally {
      R.p = n, i !== null && c.types !== null && (i.types = c.types), p.T = i;
    }
  }
  function vd() {
  }
  function cc(l, t, a, e) {
    if (l.tag !== 5) throw Error(f(476));
    var u = Mo(l).queue;
    Oo(
      l,
      u,
      t,
      j,
      a === null ? vd : function() {
        return Do(l), a(e);
      }
    );
  }
  function Mo(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: j,
      baseState: j,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: jt,
        lastRenderedState: j
      },
      next: null
    };
    var a = {};
    return t.next = {
      memoizedState: a,
      baseState: a,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: jt,
        lastRenderedState: a
      },
      next: null
    }, l.memoizedState = t, l = l.alternate, l !== null && (l.memoizedState = t), t;
  }
  function Do(l) {
    var t = Mo(l);
    t.next === null && (t = l.alternate.memoizedState), Pe(
      l,
      t.next.queue,
      {},
      rt()
    );
  }
  function fc() {
    return jl(hu);
  }
  function Uo() {
    return Al().memoizedState;
  }
  function No() {
    return Al().memoizedState;
  }
  function hd(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var a = rt();
          l = ua(a);
          var e = na(t, l, a);
          e !== null && (lt(e, t, a), $e(e, t, a)), t = { cache: xi() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function gd(l, t, a) {
    var e = rt();
    a = {
      lane: e,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, sn(l) ? Ho(t, a) : (a = Oi(l, t, a, e), a !== null && (lt(a, l, e), Co(a, t, e)));
  }
  function Ro(l, t, a) {
    var e = rt();
    Pe(l, t, a, e);
  }
  function Pe(l, t, a, e) {
    var u = {
      lane: e,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (sn(l)) Ho(t, u);
    else {
      var n = l.alternate;
      if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null))
        try {
          var i = t.lastRenderedState, c = n(i, a);
          if (u.hasEagerState = !0, u.eagerState = c, nt(c, i))
            return Lu(l, t, u, 0), rl === null && Xu(), !1;
        } catch {
        } finally {
        }
      if (a = Oi(l, t, u, e), a !== null)
        return lt(a, l, e), Co(a, t, e), !0;
    }
    return !1;
  }
  function sc(l, t, a, e) {
    if (e = {
      lane: 2,
      revertLane: Xc(),
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, sn(l)) {
      if (t) throw Error(f(479));
    } else
      t = Oi(
        l,
        a,
        e,
        2
      ), t !== null && lt(t, l, 2);
  }
  function sn(l) {
    var t = l.alternate;
    return l === V || t !== null && t === V;
  }
  function Ho(l, t) {
    oe = tn = !0;
    var a = l.pending;
    a === null ? t.next = t : (t.next = a.next, a.next = t), l.pending = t;
  }
  function Co(l, t, a) {
    if ((a & 4194048) !== 0) {
      var e = t.lanes;
      e &= l.pendingLanes, a |= e, t.lanes = a, xf(l, a);
    }
  }
  var lu = {
    readContext: jl,
    use: un,
    useCallback: gl,
    useContext: gl,
    useEffect: gl,
    useImperativeHandle: gl,
    useLayoutEffect: gl,
    useInsertionEffect: gl,
    useMemo: gl,
    useReducer: gl,
    useRef: gl,
    useState: gl,
    useDebugValue: gl,
    useDeferredValue: gl,
    useTransition: gl,
    useSyncExternalStore: gl,
    useId: gl,
    useHostTransitionStatus: gl,
    useFormState: gl,
    useActionState: gl,
    useOptimistic: gl,
    useMemoCache: gl,
    useCacheRefresh: gl
  };
  lu.useEffectEvent = gl;
  var Bo = {
    readContext: jl,
    use: un,
    useCallback: function(l, t) {
      return Jl().memoizedState = [
        l,
        t === void 0 ? null : t
      ], l;
    },
    useContext: jl,
    useEffect: go,
    useImperativeHandle: function(l, t, a) {
      a = a != null ? a.concat([l]) : null, cn(
        4194308,
        4,
        Eo.bind(null, t, l),
        a
      );
    },
    useLayoutEffect: function(l, t) {
      return cn(4194308, 4, l, t);
    },
    useInsertionEffect: function(l, t) {
      cn(4, 2, l, t);
    },
    useMemo: function(l, t) {
      var a = Jl();
      t = t === void 0 ? null : t;
      var e = l();
      if (xa) {
        kt(!0);
        try {
          l();
        } finally {
          kt(!1);
        }
      }
      return a.memoizedState = [e, t], e;
    },
    useReducer: function(l, t, a) {
      var e = Jl();
      if (a !== void 0) {
        var u = a(t);
        if (xa) {
          kt(!0);
          try {
            a(t);
          } finally {
            kt(!1);
          }
        }
      } else u = t;
      return e.memoizedState = e.baseState = u, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: u
      }, e.queue = l, l = l.dispatch = gd.bind(
        null,
        V,
        l
      ), [e.memoizedState, l];
    },
    useRef: function(l) {
      var t = Jl();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = ac(l);
      var t = l.queue, a = Ro.bind(null, V, t);
      return t.dispatch = a, [l.memoizedState, a];
    },
    useDebugValue: nc,
    useDeferredValue: function(l, t) {
      var a = Jl();
      return ic(a, l, t);
    },
    useTransition: function() {
      var l = ac(!1);
      return l = Oo.bind(
        null,
        V,
        l.queue,
        !0,
        !1
      ), Jl().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, a) {
      var e = V, u = Jl();
      if (I) {
        if (a === void 0)
          throw Error(f(407));
        a = a();
      } else {
        if (a = t(), rl === null)
          throw Error(f(349));
        (k & 127) !== 0 || lo(e, t, a);
      }
      u.memoizedState = a;
      var n = { value: a, getSnapshot: t };
      return u.queue = n, go(ao.bind(null, e, n, l), [
        l
      ]), e.flags |= 2048, me(
        9,
        { destroy: void 0 },
        to.bind(
          null,
          e,
          n,
          a,
          t
        ),
        null
      ), a;
    },
    useId: function() {
      var l = Jl(), t = rl.identifierPrefix;
      if (I) {
        var a = Dt, e = Mt;
        a = (e & ~(1 << 32 - ut(e) - 1)).toString(32) + a, t = "_" + t + "R_" + a, a = an++, 0 < a && (t += "H" + a.toString(32)), t += "_";
      } else
        a = od++, t = "_" + t + "r_" + a.toString(32) + "_";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: fc,
    useFormState: ro,
    useActionState: ro,
    useOptimistic: function(l) {
      var t = Jl();
      t.memoizedState = t.baseState = l;
      var a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = a, t = sc.bind(
        null,
        V,
        !0,
        a
      ), a.dispatch = t, [l, t];
    },
    useMemoCache: Pi,
    useCacheRefresh: function() {
      return Jl().memoizedState = hd.bind(
        null,
        V
      );
    },
    useEffectEvent: function(l) {
      var t = Jl(), a = { impl: l };
      return t.memoizedState = a, function() {
        if ((tl & 2) !== 0)
          throw Error(f(440));
        return a.impl.apply(void 0, arguments);
      };
    }
  }, oc = {
    readContext: jl,
    use: un,
    useCallback: po,
    useContext: jl,
    useEffect: uc,
    useImperativeHandle: Ao,
    useInsertionEffect: _o,
    useLayoutEffect: bo,
    useMemo: To,
    useReducer: nn,
    useRef: ho,
    useState: function() {
      return nn(jt);
    },
    useDebugValue: nc,
    useDeferredValue: function(l, t) {
      var a = Al();
      return zo(
        a,
        il.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = nn(jt)[0], t = Al().memoizedState;
      return [
        typeof l == "boolean" ? l : Ie(l),
        t
      ];
    },
    useSyncExternalStore: Ps,
    useId: Uo,
    useHostTransitionStatus: fc,
    useFormState: mo,
    useActionState: mo,
    useOptimistic: function(l, t) {
      var a = Al();
      return no(a, il, l, t);
    },
    useMemoCache: Pi,
    useCacheRefresh: No
  };
  oc.useEffectEvent = So;
  var qo = {
    readContext: jl,
    use: un,
    useCallback: po,
    useContext: jl,
    useEffect: uc,
    useImperativeHandle: Ao,
    useInsertionEffect: _o,
    useLayoutEffect: bo,
    useMemo: To,
    useReducer: tc,
    useRef: ho,
    useState: function() {
      return tc(jt);
    },
    useDebugValue: nc,
    useDeferredValue: function(l, t) {
      var a = Al();
      return il === null ? ic(a, l, t) : zo(
        a,
        il.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = tc(jt)[0], t = Al().memoizedState;
      return [
        typeof l == "boolean" ? l : Ie(l),
        t
      ];
    },
    useSyncExternalStore: Ps,
    useId: Uo,
    useHostTransitionStatus: fc,
    useFormState: vo,
    useActionState: vo,
    useOptimistic: function(l, t) {
      var a = Al();
      return il !== null ? no(a, il, l, t) : (a.baseState = l, [l, a.queue.dispatch]);
    },
    useMemoCache: Pi,
    useCacheRefresh: No
  };
  qo.useEffectEvent = So;
  function rc(l, t, a, e) {
    t = l.memoizedState, a = a(e, t), a = a == null ? t : D({}, t, a), l.memoizedState = a, l.lanes === 0 && (l.updateQueue.baseState = a);
  }
  var mc = {
    enqueueSetState: function(l, t, a) {
      l = l._reactInternals;
      var e = rt(), u = ua(e);
      u.payload = t, a != null && (u.callback = a), t = na(l, u, e), t !== null && (lt(t, l, e), $e(t, l, e));
    },
    enqueueReplaceState: function(l, t, a) {
      l = l._reactInternals;
      var e = rt(), u = ua(e);
      u.tag = 1, u.payload = t, a != null && (u.callback = a), t = na(l, u, e), t !== null && (lt(t, l, e), $e(t, l, e));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var a = rt(), e = ua(a);
      e.tag = 2, t != null && (e.callback = t), t = na(l, e, a), t !== null && (lt(t, l, a), $e(t, l, a));
    }
  };
  function Yo(l, t, a, e, u, n, i) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(e, n, i) : t.prototype && t.prototype.isPureReactComponent ? !je(a, e) || !je(u, n) : !0;
  }
  function xo(l, t, a, e) {
    l = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, e), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, e), t.state !== l && mc.enqueueReplaceState(t, t.state, null);
  }
  function Ga(l, t) {
    var a = t;
    if ("ref" in t) {
      a = {};
      for (var e in t)
        e !== "ref" && (a[e] = t[e]);
    }
    if (l = l.defaultProps) {
      a === t && (a = D({}, a));
      for (var u in l)
        a[u] === void 0 && (a[u] = l[u]);
    }
    return a;
  }
  function Go(l) {
    ju(l);
  }
  function Qo(l) {
    console.error(l);
  }
  function jo(l) {
    ju(l);
  }
  function on(l, t) {
    try {
      var a = l.onUncaughtError;
      a(t.value, { componentStack: t.stack });
    } catch (e) {
      setTimeout(function() {
        throw e;
      });
    }
  }
  function Xo(l, t, a) {
    try {
      var e = l.onCaughtError;
      e(a.value, {
        componentStack: a.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (u) {
      setTimeout(function() {
        throw u;
      });
    }
  }
  function dc(l, t, a) {
    return a = ua(a), a.tag = 3, a.payload = { element: null }, a.callback = function() {
      on(l, t);
    }, a;
  }
  function Lo(l) {
    return l = ua(l), l.tag = 3, l;
  }
  function Zo(l, t, a, e) {
    var u = a.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var n = e.value;
      l.payload = function() {
        return u(n);
      }, l.callback = function() {
        Xo(t, a, e);
      };
    }
    var i = a.stateNode;
    i !== null && typeof i.componentDidCatch == "function" && (l.callback = function() {
      Xo(t, a, e), typeof u != "function" && (ra === null ? ra = /* @__PURE__ */ new Set([this]) : ra.add(this));
      var c = e.stack;
      this.componentDidCatch(e.value, {
        componentStack: c !== null ? c : ""
      });
    });
  }
  function Sd(l, t, a, e, u) {
    if (a.flags |= 32768, e !== null && typeof e == "object" && typeof e.then == "function") {
      if (t = a.alternate, t !== null && ue(
        t,
        a,
        u,
        !0
      ), a = ct.current, a !== null) {
        switch (a.tag) {
          case 31:
          case 13:
            return _t === null ? An() : a.alternate === null && Sl === 0 && (Sl = 3), a.flags &= -257, a.flags |= 65536, a.lanes = u, e === ku ? a.flags |= 16384 : (t = a.updateQueue, t === null ? a.updateQueue = /* @__PURE__ */ new Set([e]) : t.add(e), Gc(l, e, u)), !1;
          case 22:
            return a.flags |= 65536, e === ku ? a.flags |= 16384 : (t = a.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([e])
            }, a.updateQueue = t) : (a = t.retryQueue, a === null ? t.retryQueue = /* @__PURE__ */ new Set([e]) : a.add(e)), Gc(l, e, u)), !1;
        }
        throw Error(f(435, a.tag));
      }
      return Gc(l, e, u), An(), !1;
    }
    if (I)
      return t = ct.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = u, e !== Hi && (l = Error(f(422), { cause: e }), Ze(vt(l, a)))) : (e !== Hi && (t = Error(f(423), {
        cause: e
      }), Ze(
        vt(t, a)
      )), l = l.current.alternate, l.flags |= 65536, u &= -u, l.lanes |= u, e = vt(e, a), u = dc(
        l.stateNode,
        e,
        u
      ), Zi(l, u), Sl !== 4 && (Sl = 2)), !1;
    var n = Error(f(520), { cause: e });
    if (n = vt(n, a), fu === null ? fu = [n] : fu.push(n), Sl !== 4 && (Sl = 2), t === null) return !0;
    e = vt(e, a), a = t;
    do {
      switch (a.tag) {
        case 3:
          return a.flags |= 65536, l = u & -u, a.lanes |= l, l = dc(a.stateNode, e, l), Zi(a, l), !1;
        case 1:
          if (t = a.type, n = a.stateNode, (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (ra === null || !ra.has(n))))
            return a.flags |= 65536, u &= -u, a.lanes |= u, u = Lo(u), Zo(
              u,
              l,
              a,
              e
            ), Zi(a, u), !1;
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var yc = Error(f(461)), zl = !1;
  function Xl(l, t, a, e) {
    t.child = l === null ? Js(t, null, a, e) : Ya(
      t,
      l.child,
      a,
      e
    );
  }
  function Vo(l, t, a, e, u) {
    a = a.render;
    var n = t.ref;
    if ("ref" in e) {
      var i = {};
      for (var c in e)
        c !== "ref" && (i[c] = e[c]);
    } else i = e;
    return Ha(t), e = Wi(
      l,
      t,
      a,
      i,
      n,
      u
    ), c = ki(), l !== null && !zl ? (Fi(l, t, u), Xt(l, t, u)) : (I && c && Ni(t), t.flags |= 1, Xl(l, t, e, u), t.child);
  }
  function Ko(l, t, a, e, u) {
    if (l === null) {
      var n = a.type;
      return typeof n == "function" && !Mi(n) && n.defaultProps === void 0 && a.compare === null ? (t.tag = 15, t.type = n, Jo(
        l,
        t,
        n,
        e,
        u
      )) : (l = Vu(
        a.type,
        null,
        e,
        t,
        t.mode,
        u
      ), l.ref = t.ref, l.return = t, t.child = l);
    }
    if (n = l.child, !Ac(l, u)) {
      var i = n.memoizedProps;
      if (a = a.compare, a = a !== null ? a : je, a(i, e) && l.ref === t.ref)
        return Xt(l, t, u);
    }
    return t.flags |= 1, l = qt(n, e), l.ref = t.ref, l.return = t, t.child = l;
  }
  function Jo(l, t, a, e, u) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (je(n, e) && l.ref === t.ref)
        if (zl = !1, t.pendingProps = e = n, Ac(l, u))
          (l.flags & 131072) !== 0 && (zl = !0);
        else
          return t.lanes = l.lanes, Xt(l, t, u);
    }
    return vc(
      l,
      t,
      a,
      e,
      u
    );
  }
  function wo(l, t, a, e) {
    var u = e.children, n = l !== null ? l.memoizedState : null;
    if (l === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), e.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (n = n !== null ? n.baseLanes | a : a, l !== null) {
          for (e = t.child = l.child, u = 0; e !== null; )
            u = u | e.lanes | e.childLanes, e = e.sibling;
          e = u & ~n;
        } else e = 0, t.child = null;
        return $o(
          l,
          t,
          n,
          a,
          e
        );
      }
      if ((a & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && $u(
          t,
          n !== null ? n.cachePool : null
        ), n !== null ? Ws(t, n) : Ki(), ks(t);
      else
        return e = t.lanes = 536870912, $o(
          l,
          t,
          n !== null ? n.baseLanes | a : a,
          a,
          e
        );
    } else
      n !== null ? ($u(t, n.cachePool), Ws(t, n), ca(), t.memoizedState = null) : (l !== null && $u(t, null), Ki(), ca());
    return Xl(l, t, u, a), t.child;
  }
  function tu(l, t) {
    return l !== null && l.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function $o(l, t, a, e, u) {
    var n = Qi();
    return n = n === null ? null : { parent: pl._currentValue, pool: n }, t.memoizedState = {
      baseLanes: a,
      cachePool: n
    }, l !== null && $u(t, null), Ki(), ks(t), l !== null && ue(l, t, e, !0), t.childLanes = u, null;
  }
  function rn(l, t) {
    return t = dn(
      { mode: t.mode, children: t.children },
      l.mode
    ), t.ref = l.ref, l.child = t, t.return = l, t;
  }
  function Wo(l, t, a) {
    return Ya(t, l.child, null, a), l = rn(t, t.pendingProps), l.flags |= 2, ft(t), t.memoizedState = null, l;
  }
  function _d(l, t, a) {
    var e = t.pendingProps, u = (t.flags & 128) !== 0;
    if (t.flags &= -129, l === null) {
      if (I) {
        if (e.mode === "hidden")
          return l = rn(t, e), t.lanes = 536870912, tu(null, l);
        if (wi(t), (l = ml) ? (l = cr(
          l,
          St
        ), l = l !== null && l.data === "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: Pt !== null ? { id: Mt, overflow: Dt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = Rs(l), a.return = t, t.child = a, Ql = t, ml = null)) : l = null, l === null) throw ta(t);
        return t.lanes = 536870912, null;
      }
      return rn(t, e);
    }
    var n = l.memoizedState;
    if (n !== null) {
      var i = n.dehydrated;
      if (wi(t), u)
        if (t.flags & 256)
          t.flags &= -257, t = Wo(
            l,
            t,
            a
          );
        else if (t.memoizedState !== null)
          t.child = l.child, t.flags |= 128, t = null;
        else throw Error(f(558));
      else if (zl || ue(l, t, a, !1), u = (a & l.childLanes) !== 0, zl || u) {
        if (e = rl, e !== null && (i = Gf(e, a), i !== 0 && i !== n.retryLane))
          throw n.retryLane = i, Da(l, i), lt(e, l, i), yc;
        An(), t = Wo(
          l,
          t,
          a
        );
      } else
        l = n.treeContext, ml = bt(i.nextSibling), Ql = t, I = !0, la = null, St = !1, l !== null && Bs(t, l), t = rn(t, e), t.flags |= 4096;
      return t;
    }
    return l = qt(l.child, {
      mode: e.mode,
      children: e.children
    }), l.ref = t.ref, t.child = l, l.return = t, l;
  }
  function mn(l, t) {
    var a = t.ref;
    if (a === null)
      l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof a != "function" && typeof a != "object")
        throw Error(f(284));
      (l === null || l.ref !== a) && (t.flags |= 4194816);
    }
  }
  function vc(l, t, a, e, u) {
    return Ha(t), a = Wi(
      l,
      t,
      a,
      e,
      void 0,
      u
    ), e = ki(), l !== null && !zl ? (Fi(l, t, u), Xt(l, t, u)) : (I && e && Ni(t), t.flags |= 1, Xl(l, t, a, u), t.child);
  }
  function ko(l, t, a, e, u, n) {
    return Ha(t), t.updateQueue = null, a = Is(
      t,
      e,
      a,
      u
    ), Fs(l), e = ki(), l !== null && !zl ? (Fi(l, t, n), Xt(l, t, n)) : (I && e && Ni(t), t.flags |= 1, Xl(l, t, a, n), t.child);
  }
  function Fo(l, t, a, e, u) {
    if (Ha(t), t.stateNode === null) {
      var n = le, i = a.contextType;
      typeof i == "object" && i !== null && (n = jl(i)), n = new a(e, n), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = mc, t.stateNode = n, n._reactInternals = t, n = t.stateNode, n.props = e, n.state = t.memoizedState, n.refs = {}, Xi(t), i = a.contextType, n.context = typeof i == "object" && i !== null ? jl(i) : le, n.state = t.memoizedState, i = a.getDerivedStateFromProps, typeof i == "function" && (rc(
        t,
        a,
        i,
        e
      ), n.state = t.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (i = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), i !== n.state && mc.enqueueReplaceState(n, n.state, null), ke(t, e, n, u), We(), n.state = t.memoizedState), typeof n.componentDidMount == "function" && (t.flags |= 4194308), e = !0;
    } else if (l === null) {
      n = t.stateNode;
      var c = t.memoizedProps, o = Ga(a, c);
      n.props = o;
      var g = n.context, A = a.contextType;
      i = le, typeof A == "object" && A !== null && (i = jl(A));
      var z = a.getDerivedStateFromProps;
      A = typeof z == "function" || typeof n.getSnapshotBeforeUpdate == "function", c = t.pendingProps !== c, A || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (c || g !== i) && xo(
        t,
        n,
        e,
        i
      ), ea = !1;
      var S = t.memoizedState;
      n.state = S, ke(t, e, n, u), We(), g = t.memoizedState, c || S !== g || ea ? (typeof z == "function" && (rc(
        t,
        a,
        z,
        e
      ), g = t.memoizedState), (o = ea || Yo(
        t,
        a,
        o,
        e,
        S,
        g,
        i
      )) ? (A || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = e, t.memoizedState = g), n.props = e, n.state = g, n.context = i, e = o) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), e = !1);
    } else {
      n = t.stateNode, Li(l, t), i = t.memoizedProps, A = Ga(a, i), n.props = A, z = t.pendingProps, S = n.context, g = a.contextType, o = le, typeof g == "object" && g !== null && (o = jl(g)), c = a.getDerivedStateFromProps, (g = typeof c == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (i !== z || S !== o) && xo(
        t,
        n,
        e,
        o
      ), ea = !1, S = t.memoizedState, n.state = S, ke(t, e, n, u), We();
      var _ = t.memoizedState;
      i !== z || S !== _ || ea || l !== null && l.dependencies !== null && Ju(l.dependencies) ? (typeof c == "function" && (rc(
        t,
        a,
        c,
        e
      ), _ = t.memoizedState), (A = ea || Yo(
        t,
        a,
        A,
        e,
        S,
        _,
        o
      ) || l !== null && l.dependencies !== null && Ju(l.dependencies)) ? (g || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(e, _, o), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(
        e,
        _,
        o
      )), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || i === l.memoizedProps && S === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || i === l.memoizedProps && S === l.memoizedState || (t.flags |= 1024), t.memoizedProps = e, t.memoizedState = _), n.props = e, n.state = _, n.context = o, e = A) : (typeof n.componentDidUpdate != "function" || i === l.memoizedProps && S === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || i === l.memoizedProps && S === l.memoizedState || (t.flags |= 1024), e = !1);
    }
    return n = e, mn(l, t), e = (t.flags & 128) !== 0, n || e ? (n = t.stateNode, a = e && typeof a.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, l !== null && e ? (t.child = Ya(
      t,
      l.child,
      null,
      u
    ), t.child = Ya(
      t,
      null,
      a,
      u
    )) : Xl(l, t, a, u), t.memoizedState = n.state, l = t.child) : l = Xt(
      l,
      t,
      u
    ), l;
  }
  function Io(l, t, a, e) {
    return Na(), t.flags |= 256, Xl(l, t, a, e), t.child;
  }
  var hc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function gc(l) {
    return { baseLanes: l, cachePool: js() };
  }
  function Sc(l, t, a) {
    return l = l !== null ? l.childLanes & ~a : 0, t && (l |= ot), l;
  }
  function Po(l, t, a) {
    var e = t.pendingProps, u = !1, n = (t.flags & 128) !== 0, i;
    if ((i = n) || (i = l !== null && l.memoizedState === null ? !1 : (El.current & 2) !== 0), i && (u = !0, t.flags &= -129), i = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (I) {
        if (u ? ia(t) : ca(), (l = ml) ? (l = cr(
          l,
          St
        ), l = l !== null && l.data !== "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: Pt !== null ? { id: Mt, overflow: Dt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = Rs(l), a.return = t, t.child = a, Ql = t, ml = null)) : l = null, l === null) throw ta(t);
        return lf(l) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var c = e.children;
      return e = e.fallback, u ? (ca(), u = t.mode, c = dn(
        { mode: "hidden", children: c },
        u
      ), e = Ua(
        e,
        u,
        a,
        null
      ), c.return = t, e.return = t, c.sibling = e, t.child = c, e = t.child, e.memoizedState = gc(a), e.childLanes = Sc(
        l,
        i,
        a
      ), t.memoizedState = hc, tu(null, e)) : (ia(t), _c(t, c));
    }
    var o = l.memoizedState;
    if (o !== null && (c = o.dehydrated, c !== null)) {
      if (n)
        t.flags & 256 ? (ia(t), t.flags &= -257, t = bc(
          l,
          t,
          a
        )) : t.memoizedState !== null ? (ca(), t.child = l.child, t.flags |= 128, t = null) : (ca(), c = e.fallback, u = t.mode, e = dn(
          { mode: "visible", children: e.children },
          u
        ), c = Ua(
          c,
          u,
          a,
          null
        ), c.flags |= 2, e.return = t, c.return = t, e.sibling = c, t.child = e, Ya(
          t,
          l.child,
          null,
          a
        ), e = t.child, e.memoizedState = gc(a), e.childLanes = Sc(
          l,
          i,
          a
        ), t.memoizedState = hc, t = tu(null, e));
      else if (ia(t), lf(c)) {
        if (i = c.nextSibling && c.nextSibling.dataset, i) var g = i.dgst;
        i = g, e = Error(f(419)), e.stack = "", e.digest = i, Ze({ value: e, source: null, stack: null }), t = bc(
          l,
          t,
          a
        );
      } else if (zl || ue(l, t, a, !1), i = (a & l.childLanes) !== 0, zl || i) {
        if (i = rl, i !== null && (e = Gf(i, a), e !== 0 && e !== o.retryLane))
          throw o.retryLane = e, Da(l, e), lt(i, l, e), yc;
        Pc(c) || An(), t = bc(
          l,
          t,
          a
        );
      } else
        Pc(c) ? (t.flags |= 192, t.child = l.child, t = null) : (l = o.treeContext, ml = bt(
          c.nextSibling
        ), Ql = t, I = !0, la = null, St = !1, l !== null && Bs(t, l), t = _c(
          t,
          e.children
        ), t.flags |= 4096);
      return t;
    }
    return u ? (ca(), c = e.fallback, u = t.mode, o = l.child, g = o.sibling, e = qt(o, {
      mode: "hidden",
      children: e.children
    }), e.subtreeFlags = o.subtreeFlags & 65011712, g !== null ? c = qt(
      g,
      c
    ) : (c = Ua(
      c,
      u,
      a,
      null
    ), c.flags |= 2), c.return = t, e.return = t, e.sibling = c, t.child = e, tu(null, e), e = t.child, c = l.child.memoizedState, c === null ? c = gc(a) : (u = c.cachePool, u !== null ? (o = pl._currentValue, u = u.parent !== o ? { parent: o, pool: o } : u) : u = js(), c = {
      baseLanes: c.baseLanes | a,
      cachePool: u
    }), e.memoizedState = c, e.childLanes = Sc(
      l,
      i,
      a
    ), t.memoizedState = hc, tu(l.child, e)) : (ia(t), a = l.child, l = a.sibling, a = qt(a, {
      mode: "visible",
      children: e.children
    }), a.return = t, a.sibling = null, l !== null && (i = t.deletions, i === null ? (t.deletions = [l], t.flags |= 16) : i.push(l)), t.child = a, t.memoizedState = null, a);
  }
  function _c(l, t) {
    return t = dn(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function dn(l, t) {
    return l = it(22, l, null, t), l.lanes = 0, l;
  }
  function bc(l, t, a) {
    return Ya(t, l.child, null, a), l = _c(
      t,
      t.pendingProps.children
    ), l.flags |= 2, t.memoizedState = null, l;
  }
  function l0(l, t, a) {
    l.lanes |= t;
    var e = l.alternate;
    e !== null && (e.lanes |= t), qi(l.return, t, a);
  }
  function Ec(l, t, a, e, u, n) {
    var i = l.memoizedState;
    i === null ? l.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: e,
      tail: a,
      tailMode: u,
      treeForkCount: n
    } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = e, i.tail = a, i.tailMode = u, i.treeForkCount = n);
  }
  function t0(l, t, a) {
    var e = t.pendingProps, u = e.revealOrder, n = e.tail;
    e = e.children;
    var i = El.current, c = (i & 2) !== 0;
    if (c ? (i = i & 1 | 2, t.flags |= 128) : i &= 1, C(El, i), Xl(l, t, e, a), e = I ? Le : 0, !c && l !== null && (l.flags & 128) !== 0)
      l: for (l = t.child; l !== null; ) {
        if (l.tag === 13)
          l.memoizedState !== null && l0(l, a, t);
        else if (l.tag === 19)
          l0(l, a, t);
        else if (l.child !== null) {
          l.child.return = l, l = l.child;
          continue;
        }
        if (l === t) break l;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === t)
            break l;
          l = l.return;
        }
        l.sibling.return = l.return, l = l.sibling;
      }
    switch (u) {
      case "forwards":
        for (a = t.child, u = null; a !== null; )
          l = a.alternate, l !== null && ln(l) === null && (u = a), a = a.sibling;
        a = u, a === null ? (u = t.child, t.child = null) : (u = a.sibling, a.sibling = null), Ec(
          t,
          !1,
          u,
          a,
          n,
          e
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (a = null, u = t.child, t.child = null; u !== null; ) {
          if (l = u.alternate, l !== null && ln(l) === null) {
            t.child = u;
            break;
          }
          l = u.sibling, u.sibling = a, a = u, u = l;
        }
        Ec(
          t,
          !0,
          a,
          null,
          n,
          e
        );
        break;
      case "together":
        Ec(
          t,
          !1,
          null,
          null,
          void 0,
          e
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Xt(l, t, a) {
    if (l !== null && (t.dependencies = l.dependencies), oa |= t.lanes, (a & t.childLanes) === 0)
      if (l !== null) {
        if (ue(
          l,
          t,
          a,
          !1
        ), (a & t.childLanes) === 0)
          return null;
      } else return null;
    if (l !== null && t.child !== l.child)
      throw Error(f(153));
    if (t.child !== null) {
      for (l = t.child, a = qt(l, l.pendingProps), t.child = a, a.return = t; l.sibling !== null; )
        l = l.sibling, a = a.sibling = qt(l, l.pendingProps), a.return = t;
      a.sibling = null;
    }
    return t.child;
  }
  function Ac(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && Ju(l)));
  }
  function bd(l, t, a) {
    switch (t.tag) {
      case 3:
        Kl(t, t.stateNode.containerInfo), aa(t, pl, l.memoizedState.cache), Na();
        break;
      case 27:
      case 5:
        Me(t);
        break;
      case 4:
        Kl(t, t.stateNode.containerInfo);
        break;
      case 10:
        aa(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, wi(t), null;
        break;
      case 13:
        var e = t.memoizedState;
        if (e !== null)
          return e.dehydrated !== null ? (ia(t), t.flags |= 128, null) : (a & t.child.childLanes) !== 0 ? Po(l, t, a) : (ia(t), l = Xt(
            l,
            t,
            a
          ), l !== null ? l.sibling : null);
        ia(t);
        break;
      case 19:
        var u = (l.flags & 128) !== 0;
        if (e = (a & t.childLanes) !== 0, e || (ue(
          l,
          t,
          a,
          !1
        ), e = (a & t.childLanes) !== 0), u) {
          if (e)
            return t0(
              l,
              t,
              a
            );
          t.flags |= 128;
        }
        if (u = t.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), C(El, El.current), e) break;
        return null;
      case 22:
        return t.lanes = 0, wo(
          l,
          t,
          a,
          t.pendingProps
        );
      case 24:
        aa(t, pl, l.memoizedState.cache);
    }
    return Xt(l, t, a);
  }
  function a0(l, t, a) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        zl = !0;
      else {
        if (!Ac(l, a) && (t.flags & 128) === 0)
          return zl = !1, bd(
            l,
            t,
            a
          );
        zl = (l.flags & 131072) !== 0;
      }
    else
      zl = !1, I && (t.flags & 1048576) !== 0 && Cs(t, Le, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          var e = t.pendingProps;
          if (l = Ba(t.elementType), t.type = l, typeof l == "function")
            Mi(l) ? (e = Ga(l, e), t.tag = 1, t = Fo(
              null,
              t,
              l,
              e,
              a
            )) : (t.tag = 0, t = vc(
              null,
              t,
              l,
              e,
              a
            ));
          else {
            if (l != null) {
              var u = l.$$typeof;
              if (u === Cl) {
                t.tag = 11, t = Vo(
                  null,
                  t,
                  l,
                  e,
                  a
                );
                break l;
              } else if (u === J) {
                t.tag = 14, t = Ko(
                  null,
                  t,
                  l,
                  e,
                  a
                );
                break l;
              }
            }
            throw t = Rt(l) || l, Error(f(306, t, ""));
          }
        }
        return t;
      case 0:
        return vc(
          l,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 1:
        return e = t.type, u = Ga(
          e,
          t.pendingProps
        ), Fo(
          l,
          t,
          e,
          u,
          a
        );
      case 3:
        l: {
          if (Kl(
            t,
            t.stateNode.containerInfo
          ), l === null) throw Error(f(387));
          e = t.pendingProps;
          var n = t.memoizedState;
          u = n.element, Li(l, t), ke(t, e, null, a);
          var i = t.memoizedState;
          if (e = i.cache, aa(t, pl, e), e !== n.cache && Yi(
            t,
            [pl],
            a,
            !0
          ), We(), e = i.element, n.isDehydrated)
            if (n = {
              element: e,
              isDehydrated: !1,
              cache: i.cache
            }, t.updateQueue.baseState = n, t.memoizedState = n, t.flags & 256) {
              t = Io(
                l,
                t,
                e,
                a
              );
              break l;
            } else if (e !== u) {
              u = vt(
                Error(f(424)),
                t
              ), Ze(u), t = Io(
                l,
                t,
                e,
                a
              );
              break l;
            } else {
              switch (l = t.stateNode.containerInfo, l.nodeType) {
                case 9:
                  l = l.body;
                  break;
                default:
                  l = l.nodeName === "HTML" ? l.ownerDocument.body : l;
              }
              for (ml = bt(l.firstChild), Ql = t, I = !0, la = null, St = !0, a = Js(
                t,
                null,
                e,
                a
              ), t.child = a; a; )
                a.flags = a.flags & -3 | 4096, a = a.sibling;
            }
          else {
            if (Na(), e === u) {
              t = Xt(
                l,
                t,
                a
              );
              break l;
            }
            Xl(l, t, e, a);
          }
          t = t.child;
        }
        return t;
      case 26:
        return mn(l, t), l === null ? (a = dr(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = a : I || (a = t.type, l = t.pendingProps, e = Un(
          w.current
        ).createElement(a), e[Gl] = t, e[$l] = l, Ll(e, a, l), ql(e), t.stateNode = e) : t.memoizedState = dr(
          t.type,
          l.memoizedProps,
          t.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return Me(t), l === null && I && (e = t.stateNode = or(
          t.type,
          t.pendingProps,
          w.current
        ), Ql = t, St = !0, u = ml, va(t.type) ? (tf = u, ml = bt(e.firstChild)) : ml = u), Xl(
          l,
          t,
          t.pendingProps.children,
          a
        ), mn(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && I && ((u = e = ml) && (e = kd(
          e,
          t.type,
          t.pendingProps,
          St
        ), e !== null ? (t.stateNode = e, Ql = t, ml = bt(e.firstChild), St = !1, u = !0) : u = !1), u || ta(t)), Me(t), u = t.type, n = t.pendingProps, i = l !== null ? l.memoizedProps : null, e = n.children, kc(u, n) ? e = null : i !== null && kc(u, i) && (t.flags |= 32), t.memoizedState !== null && (u = Wi(
          l,
          t,
          rd,
          null,
          null,
          a
        ), hu._currentValue = u), mn(l, t), Xl(l, t, e, a), t.child;
      case 6:
        return l === null && I && ((l = a = ml) && (a = Fd(
          a,
          t.pendingProps,
          St
        ), a !== null ? (t.stateNode = a, Ql = t, ml = null, l = !0) : l = !1), l || ta(t)), null;
      case 13:
        return Po(l, t, a);
      case 4:
        return Kl(
          t,
          t.stateNode.containerInfo
        ), e = t.pendingProps, l === null ? t.child = Ya(
          t,
          null,
          e,
          a
        ) : Xl(l, t, e, a), t.child;
      case 11:
        return Vo(
          l,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 7:
        return Xl(
          l,
          t,
          t.pendingProps,
          a
        ), t.child;
      case 8:
        return Xl(
          l,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 12:
        return Xl(
          l,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 10:
        return e = t.pendingProps, aa(t, t.type, e.value), Xl(l, t, e.children, a), t.child;
      case 9:
        return u = t.type._context, e = t.pendingProps.children, Ha(t), u = jl(u), e = e(u), t.flags |= 1, Xl(l, t, e, a), t.child;
      case 14:
        return Ko(
          l,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 15:
        return Jo(
          l,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 19:
        return t0(l, t, a);
      case 31:
        return _d(l, t, a);
      case 22:
        return wo(
          l,
          t,
          a,
          t.pendingProps
        );
      case 24:
        return Ha(t), e = jl(pl), l === null ? (u = Qi(), u === null && (u = rl, n = xi(), u.pooledCache = n, n.refCount++, n !== null && (u.pooledCacheLanes |= a), u = n), t.memoizedState = { parent: e, cache: u }, Xi(t), aa(t, pl, u)) : ((l.lanes & a) !== 0 && (Li(l, t), ke(t, null, null, a), We()), u = l.memoizedState, n = t.memoizedState, u.parent !== e ? (u = { parent: e, cache: e }, t.memoizedState = u, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u), aa(t, pl, e)) : (e = n.cache, aa(t, pl, e), e !== u.cache && Yi(
          t,
          [pl],
          a,
          !0
        ))), Xl(
          l,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(f(156, t.tag));
  }
  function Lt(l) {
    l.flags |= 4;
  }
  function pc(l, t, a, e, u) {
    if ((t = (l.mode & 32) !== 0) && (t = !1), t) {
      if (l.flags |= 16777216, (u & 335544128) === u)
        if (l.stateNode.complete) l.flags |= 8192;
        else if (U0()) l.flags |= 8192;
        else
          throw qa = ku, ji;
    } else l.flags &= -16777217;
  }
  function e0(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !Sr(t))
      if (U0()) l.flags |= 8192;
      else
        throw qa = ku, ji;
  }
  function yn(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? qf() : 536870912, l.lanes |= t, he |= t);
  }
  function au(l, t) {
    if (!I)
      switch (l.tailMode) {
        case "hidden":
          t = l.tail;
          for (var a = null; t !== null; )
            t.alternate !== null && (a = t), t = t.sibling;
          a === null ? l.tail = null : a.sibling = null;
          break;
        case "collapsed":
          a = l.tail;
          for (var e = null; a !== null; )
            a.alternate !== null && (e = a), a = a.sibling;
          e === null ? t || l.tail === null ? l.tail = null : l.tail.sibling = null : e.sibling = null;
      }
  }
  function dl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, a = 0, e = 0;
    if (t)
      for (var u = l.child; u !== null; )
        a |= u.lanes | u.childLanes, e |= u.subtreeFlags & 65011712, e |= u.flags & 65011712, u.return = l, u = u.sibling;
    else
      for (u = l.child; u !== null; )
        a |= u.lanes | u.childLanes, e |= u.subtreeFlags, e |= u.flags, u.return = l, u = u.sibling;
    return l.subtreeFlags |= e, l.childLanes = a, t;
  }
  function Ed(l, t, a) {
    var e = t.pendingProps;
    switch (Ri(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return dl(t), null;
      case 1:
        return dl(t), null;
      case 3:
        return a = t.stateNode, e = null, l !== null && (e = l.memoizedState.cache), t.memoizedState.cache !== e && (t.flags |= 2048), Gt(pl), bl(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (l === null || l.child === null) && (ee(t) ? Lt(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ci())), dl(t), null;
      case 26:
        var u = t.type, n = t.memoizedState;
        return l === null ? (Lt(t), n !== null ? (dl(t), e0(t, n)) : (dl(t), pc(
          t,
          u,
          null,
          e,
          a
        ))) : n ? n !== l.memoizedState ? (Lt(t), dl(t), e0(t, n)) : (dl(t), t.flags &= -16777217) : (l = l.memoizedProps, l !== e && Lt(t), dl(t), pc(
          t,
          u,
          l,
          e,
          a
        )), null;
      case 27:
        if (Tu(t), a = w.current, u = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== e && Lt(t);
        else {
          if (!e) {
            if (t.stateNode === null)
              throw Error(f(166));
            return dl(t), null;
          }
          l = Y.current, ee(t) ? qs(t) : (l = or(u, e, a), t.stateNode = l, Lt(t));
        }
        return dl(t), null;
      case 5:
        if (Tu(t), u = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== e && Lt(t);
        else {
          if (!e) {
            if (t.stateNode === null)
              throw Error(f(166));
            return dl(t), null;
          }
          if (n = Y.current, ee(t))
            qs(t);
          else {
            var i = Un(
              w.current
            );
            switch (n) {
              case 1:
                n = i.createElementNS(
                  "http://www.w3.org/2000/svg",
                  u
                );
                break;
              case 2:
                n = i.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  u
                );
                break;
              default:
                switch (u) {
                  case "svg":
                    n = i.createElementNS(
                      "http://www.w3.org/2000/svg",
                      u
                    );
                    break;
                  case "math":
                    n = i.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      u
                    );
                    break;
                  case "script":
                    n = i.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(
                      n.firstChild
                    );
                    break;
                  case "select":
                    n = typeof e.is == "string" ? i.createElement("select", {
                      is: e.is
                    }) : i.createElement("select"), e.multiple ? n.multiple = !0 : e.size && (n.size = e.size);
                    break;
                  default:
                    n = typeof e.is == "string" ? i.createElement(u, { is: e.is }) : i.createElement(u);
                }
            }
            n[Gl] = t, n[$l] = e;
            l: for (i = t.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6)
                n.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                i.child.return = i, i = i.child;
                continue;
              }
              if (i === t) break l;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === t)
                  break l;
                i = i.return;
              }
              i.sibling.return = i.return, i = i.sibling;
            }
            t.stateNode = n;
            l: switch (Ll(n, u, e), u) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                e = !!e.autoFocus;
                break l;
              case "img":
                e = !0;
                break l;
              default:
                e = !1;
            }
            e && Lt(t);
          }
        }
        return dl(t), pc(
          t,
          t.type,
          l === null ? null : l.memoizedProps,
          t.pendingProps,
          a
        ), null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== e && Lt(t);
        else {
          if (typeof e != "string" && t.stateNode === null)
            throw Error(f(166));
          if (l = w.current, ee(t)) {
            if (l = t.stateNode, a = t.memoizedProps, e = null, u = Ql, u !== null)
              switch (u.tag) {
                case 27:
                case 5:
                  e = u.memoizedProps;
              }
            l[Gl] = t, l = !!(l.nodeValue === a || e !== null && e.suppressHydrationWarning === !0 || P0(l.nodeValue, a)), l || ta(t, !0);
          } else
            l = Un(l).createTextNode(
              e
            ), l[Gl] = t, t.stateNode = l;
        }
        return dl(t), null;
      case 31:
        if (a = t.memoizedState, l === null || l.memoizedState !== null) {
          if (e = ee(t), a !== null) {
            if (l === null) {
              if (!e) throw Error(f(318));
              if (l = t.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(f(557));
              l[Gl] = t;
            } else
              Na(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            dl(t), l = !1;
          } else
            a = Ci(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = a), l = !0;
          if (!l)
            return t.flags & 256 ? (ft(t), t) : (ft(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(f(558));
        }
        return dl(t), null;
      case 13:
        if (e = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (u = ee(t), e !== null && e.dehydrated !== null) {
            if (l === null) {
              if (!u) throw Error(f(318));
              if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(f(317));
              u[Gl] = t;
            } else
              Na(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            dl(t), u = !1;
          } else
            u = Ci(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = u), u = !0;
          if (!u)
            return t.flags & 256 ? (ft(t), t) : (ft(t), null);
        }
        return ft(t), (t.flags & 128) !== 0 ? (t.lanes = a, t) : (a = e !== null, l = l !== null && l.memoizedState !== null, a && (e = t.child, u = null, e.alternate !== null && e.alternate.memoizedState !== null && e.alternate.memoizedState.cachePool !== null && (u = e.alternate.memoizedState.cachePool.pool), n = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), n !== u && (e.flags |= 2048)), a !== l && a && (t.child.flags |= 8192), yn(t, t.updateQueue), dl(t), null);
      case 4:
        return bl(), l === null && Kc(t.stateNode.containerInfo), dl(t), null;
      case 10:
        return Gt(t.type), dl(t), null;
      case 19:
        if (O(El), e = t.memoizedState, e === null) return dl(t), null;
        if (u = (t.flags & 128) !== 0, n = e.rendering, n === null)
          if (u) au(e, !1);
          else {
            if (Sl !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (n = ln(l), n !== null) {
                  for (t.flags |= 128, au(e, !1), l = n.updateQueue, t.updateQueue = l, yn(t, l), t.subtreeFlags = 0, l = a, a = t.child; a !== null; )
                    Ns(a, l), a = a.sibling;
                  return C(
                    El,
                    El.current & 1 | 2
                  ), I && Yt(t, e.treeForkCount), t.child;
                }
                l = l.sibling;
              }
            e.tail !== null && at() > _n && (t.flags |= 128, u = !0, au(e, !1), t.lanes = 4194304);
          }
        else {
          if (!u)
            if (l = ln(n), l !== null) {
              if (t.flags |= 128, u = !0, l = l.updateQueue, t.updateQueue = l, yn(t, l), au(e, !0), e.tail === null && e.tailMode === "hidden" && !n.alternate && !I)
                return dl(t), null;
            } else
              2 * at() - e.renderingStartTime > _n && a !== 536870912 && (t.flags |= 128, u = !0, au(e, !1), t.lanes = 4194304);
          e.isBackwards ? (n.sibling = t.child, t.child = n) : (l = e.last, l !== null ? l.sibling = n : t.child = n, e.last = n);
        }
        return e.tail !== null ? (l = e.tail, e.rendering = l, e.tail = l.sibling, e.renderingStartTime = at(), l.sibling = null, a = El.current, C(
          El,
          u ? a & 1 | 2 : a & 1
        ), I && Yt(t, e.treeForkCount), l) : (dl(t), null);
      case 22:
      case 23:
        return ft(t), Ji(), e = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== e && (t.flags |= 8192) : e && (t.flags |= 8192), e ? (a & 536870912) !== 0 && (t.flags & 128) === 0 && (dl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : dl(t), a = t.updateQueue, a !== null && yn(t, a.retryQueue), a = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (a = l.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== a && (t.flags |= 2048), l !== null && O(Ca), null;
      case 24:
        return a = null, l !== null && (a = l.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Gt(pl), dl(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(f(156, t.tag));
  }
  function Ad(l, t) {
    switch (Ri(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return Gt(pl), bl(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Tu(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (ft(t), t.alternate === null)
            throw Error(f(340));
          Na();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 13:
        if (ft(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(f(340));
          Na();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return O(El), null;
      case 4:
        return bl(), null;
      case 10:
        return Gt(t.type), null;
      case 22:
      case 23:
        return ft(t), Ji(), l !== null && O(Ca), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return Gt(pl), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function u0(l, t) {
    switch (Ri(t), t.tag) {
      case 3:
        Gt(pl), bl();
        break;
      case 26:
      case 27:
      case 5:
        Tu(t);
        break;
      case 4:
        bl();
        break;
      case 31:
        t.memoizedState !== null && ft(t);
        break;
      case 13:
        ft(t);
        break;
      case 19:
        O(El);
        break;
      case 10:
        Gt(t.type);
        break;
      case 22:
      case 23:
        ft(t), Ji(), l !== null && O(Ca);
        break;
      case 24:
        Gt(pl);
    }
  }
  function eu(l, t) {
    try {
      var a = t.updateQueue, e = a !== null ? a.lastEffect : null;
      if (e !== null) {
        var u = e.next;
        a = u;
        do {
          if ((a.tag & l) === l) {
            e = void 0;
            var n = a.create, i = a.inst;
            e = n(), i.destroy = e;
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (c) {
      ul(t, t.return, c);
    }
  }
  function fa(l, t, a) {
    try {
      var e = t.updateQueue, u = e !== null ? e.lastEffect : null;
      if (u !== null) {
        var n = u.next;
        e = n;
        do {
          if ((e.tag & l) === l) {
            var i = e.inst, c = i.destroy;
            if (c !== void 0) {
              i.destroy = void 0, u = t;
              var o = a, g = c;
              try {
                g();
              } catch (A) {
                ul(
                  u,
                  o,
                  A
                );
              }
            }
          }
          e = e.next;
        } while (e !== n);
      }
    } catch (A) {
      ul(t, t.return, A);
    }
  }
  function n0(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var a = l.stateNode;
      try {
        $s(t, a);
      } catch (e) {
        ul(l, l.return, e);
      }
    }
  }
  function i0(l, t, a) {
    a.props = Ga(
      l.type,
      l.memoizedProps
    ), a.state = l.memoizedState;
    try {
      a.componentWillUnmount();
    } catch (e) {
      ul(l, t, e);
    }
  }
  function uu(l, t) {
    try {
      var a = l.ref;
      if (a !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var e = l.stateNode;
            break;
          case 30:
            e = l.stateNode;
            break;
          default:
            e = l.stateNode;
        }
        typeof a == "function" ? l.refCleanup = a(e) : a.current = e;
      }
    } catch (u) {
      ul(l, t, u);
    }
  }
  function Ut(l, t) {
    var a = l.ref, e = l.refCleanup;
    if (a !== null)
      if (typeof e == "function")
        try {
          e();
        } catch (u) {
          ul(l, t, u);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      else if (typeof a == "function")
        try {
          a(null);
        } catch (u) {
          ul(l, t, u);
        }
      else a.current = null;
  }
  function c0(l) {
    var t = l.type, a = l.memoizedProps, e = l.stateNode;
    try {
      l: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          break l;
        case "img":
          a.src ? e.src = a.src : a.srcSet && (e.srcset = a.srcSet);
      }
    } catch (u) {
      ul(l, l.return, u);
    }
  }
  function Tc(l, t, a) {
    try {
      var e = l.stateNode;
      Vd(e, l.type, a, t), e[$l] = t;
    } catch (u) {
      ul(l, l.return, u);
    }
  }
  function f0(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && va(l.type) || l.tag === 4;
  }
  function zc(l) {
    l: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || f0(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && va(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue l;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function Oc(l, t, a) {
    var e = l.tag;
    if (e === 5 || e === 6)
      l = l.stateNode, t ? (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(l, t) : (t = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, t.appendChild(l), a = a._reactRootContainer, a != null || t.onclick !== null || (t.onclick = Ct));
    else if (e !== 4 && (e === 27 && va(l.type) && (a = l.stateNode, t = null), l = l.child, l !== null))
      for (Oc(l, t, a), l = l.sibling; l !== null; )
        Oc(l, t, a), l = l.sibling;
  }
  function vn(l, t, a) {
    var e = l.tag;
    if (e === 5 || e === 6)
      l = l.stateNode, t ? a.insertBefore(l, t) : a.appendChild(l);
    else if (e !== 4 && (e === 27 && va(l.type) && (a = l.stateNode), l = l.child, l !== null))
      for (vn(l, t, a), l = l.sibling; l !== null; )
        vn(l, t, a), l = l.sibling;
  }
  function s0(l) {
    var t = l.stateNode, a = l.memoizedProps;
    try {
      for (var e = l.type, u = t.attributes; u.length; )
        t.removeAttributeNode(u[0]);
      Ll(t, e, a), t[Gl] = l, t[$l] = a;
    } catch (n) {
      ul(l, l.return, n);
    }
  }
  var Zt = !1, Ol = !1, Mc = !1, o0 = typeof WeakSet == "function" ? WeakSet : Set, Yl = null;
  function pd(l, t) {
    if (l = l.containerInfo, $c = Yn, l = Es(l), bi(l)) {
      if ("selectionStart" in l)
        var a = {
          start: l.selectionStart,
          end: l.selectionEnd
        };
      else
        l: {
          a = (a = l.ownerDocument) && a.defaultView || window;
          var e = a.getSelection && a.getSelection();
          if (e && e.rangeCount !== 0) {
            a = e.anchorNode;
            var u = e.anchorOffset, n = e.focusNode;
            e = e.focusOffset;
            try {
              a.nodeType, n.nodeType;
            } catch {
              a = null;
              break l;
            }
            var i = 0, c = -1, o = -1, g = 0, A = 0, z = l, S = null;
            t: for (; ; ) {
              for (var _; z !== a || u !== 0 && z.nodeType !== 3 || (c = i + u), z !== n || e !== 0 && z.nodeType !== 3 || (o = i + e), z.nodeType === 3 && (i += z.nodeValue.length), (_ = z.firstChild) !== null; )
                S = z, z = _;
              for (; ; ) {
                if (z === l) break t;
                if (S === a && ++g === u && (c = i), S === n && ++A === e && (o = i), (_ = z.nextSibling) !== null) break;
                z = S, S = z.parentNode;
              }
              z = _;
            }
            a = c === -1 || o === -1 ? null : { start: c, end: o };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (Wc = { focusedElem: l, selectionRange: a }, Yn = !1, Yl = t; Yl !== null; )
      if (t = Yl, l = t.child, (t.subtreeFlags & 1028) !== 0 && l !== null)
        l.return = t, Yl = l;
      else
        for (; Yl !== null; ) {
          switch (t = Yl, n = t.alternate, l = t.flags, t.tag) {
            case 0:
              if ((l & 4) !== 0 && (l = t.updateQueue, l = l !== null ? l.events : null, l !== null))
                for (a = 0; a < l.length; a++)
                  u = l[a], u.ref.impl = u.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((l & 1024) !== 0 && n !== null) {
                l = void 0, a = t, u = n.memoizedProps, n = n.memoizedState, e = a.stateNode;
                try {
                  var q = Ga(
                    a.type,
                    u
                  );
                  l = e.getSnapshotBeforeUpdate(
                    q,
                    n
                  ), e.__reactInternalSnapshotBeforeUpdate = l;
                } catch (Q) {
                  ul(
                    a,
                    a.return,
                    Q
                  );
                }
              }
              break;
            case 3:
              if ((l & 1024) !== 0) {
                if (l = t.stateNode.containerInfo, a = l.nodeType, a === 9)
                  Ic(l);
                else if (a === 1)
                  switch (l.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Ic(l);
                      break;
                    default:
                      l.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((l & 1024) !== 0) throw Error(f(163));
          }
          if (l = t.sibling, l !== null) {
            l.return = t.return, Yl = l;
            break;
          }
          Yl = t.return;
        }
  }
  function r0(l, t, a) {
    var e = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        Kt(l, a), e & 4 && eu(5, a);
        break;
      case 1:
        if (Kt(l, a), e & 4)
          if (l = a.stateNode, t === null)
            try {
              l.componentDidMount();
            } catch (i) {
              ul(a, a.return, i);
            }
          else {
            var u = Ga(
              a.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              l.componentDidUpdate(
                u,
                t,
                l.__reactInternalSnapshotBeforeUpdate
              );
            } catch (i) {
              ul(
                a,
                a.return,
                i
              );
            }
          }
        e & 64 && n0(a), e & 512 && uu(a, a.return);
        break;
      case 3:
        if (Kt(l, a), e & 64 && (l = a.updateQueue, l !== null)) {
          if (t = null, a.child !== null)
            switch (a.child.tag) {
              case 27:
              case 5:
                t = a.child.stateNode;
                break;
              case 1:
                t = a.child.stateNode;
            }
          try {
            $s(l, t);
          } catch (i) {
            ul(a, a.return, i);
          }
        }
        break;
      case 27:
        t === null && e & 4 && s0(a);
      case 26:
      case 5:
        Kt(l, a), t === null && e & 4 && c0(a), e & 512 && uu(a, a.return);
        break;
      case 12:
        Kt(l, a);
        break;
      case 31:
        Kt(l, a), e & 4 && y0(l, a);
        break;
      case 13:
        Kt(l, a), e & 4 && v0(l, a), e & 64 && (l = a.memoizedState, l !== null && (l = l.dehydrated, l !== null && (a = Hd.bind(
          null,
          a
        ), Id(l, a))));
        break;
      case 22:
        if (e = a.memoizedState !== null || Zt, !e) {
          t = t !== null && t.memoizedState !== null || Ol, u = Zt;
          var n = Ol;
          Zt = e, (Ol = t) && !n ? Jt(
            l,
            a,
            (a.subtreeFlags & 8772) !== 0
          ) : Kt(l, a), Zt = u, Ol = n;
        }
        break;
      case 30:
        break;
      default:
        Kt(l, a);
    }
  }
  function m0(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null, m0(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && ei(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var yl = null, kl = !1;
  function Vt(l, t, a) {
    for (a = a.child; a !== null; )
      d0(l, t, a), a = a.sibling;
  }
  function d0(l, t, a) {
    if (et && typeof et.onCommitFiberUnmount == "function")
      try {
        et.onCommitFiberUnmount(De, a);
      } catch {
      }
    switch (a.tag) {
      case 26:
        Ol || Ut(a, t), Vt(
          l,
          t,
          a
        ), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
        break;
      case 27:
        Ol || Ut(a, t);
        var e = yl, u = kl;
        va(a.type) && (yl = a.stateNode, kl = !1), Vt(
          l,
          t,
          a
        ), du(a.stateNode), yl = e, kl = u;
        break;
      case 5:
        Ol || Ut(a, t);
      case 6:
        if (e = yl, u = kl, yl = null, Vt(
          l,
          t,
          a
        ), yl = e, kl = u, yl !== null)
          if (kl)
            try {
              (yl.nodeType === 9 ? yl.body : yl.nodeName === "HTML" ? yl.ownerDocument.body : yl).removeChild(a.stateNode);
            } catch (n) {
              ul(
                a,
                t,
                n
              );
            }
          else
            try {
              yl.removeChild(a.stateNode);
            } catch (n) {
              ul(
                a,
                t,
                n
              );
            }
        break;
      case 18:
        yl !== null && (kl ? (l = yl, nr(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          a.stateNode
        ), Te(l)) : nr(yl, a.stateNode));
        break;
      case 4:
        e = yl, u = kl, yl = a.stateNode.containerInfo, kl = !0, Vt(
          l,
          t,
          a
        ), yl = e, kl = u;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        fa(2, a, t), Ol || fa(4, a, t), Vt(
          l,
          t,
          a
        );
        break;
      case 1:
        Ol || (Ut(a, t), e = a.stateNode, typeof e.componentWillUnmount == "function" && i0(
          a,
          t,
          e
        )), Vt(
          l,
          t,
          a
        );
        break;
      case 21:
        Vt(
          l,
          t,
          a
        );
        break;
      case 22:
        Ol = (e = Ol) || a.memoizedState !== null, Vt(
          l,
          t,
          a
        ), Ol = e;
        break;
      default:
        Vt(
          l,
          t,
          a
        );
    }
  }
  function y0(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null))) {
      l = l.dehydrated;
      try {
        Te(l);
      } catch (a) {
        ul(t, t.return, a);
      }
    }
  }
  function v0(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        Te(l);
      } catch (a) {
        ul(t, t.return, a);
      }
  }
  function Td(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new o0()), t;
      case 22:
        return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new o0()), t;
      default:
        throw Error(f(435, l.tag));
    }
  }
  function hn(l, t) {
    var a = Td(l);
    t.forEach(function(e) {
      if (!a.has(e)) {
        a.add(e);
        var u = Cd.bind(null, l, e);
        e.then(u, u);
      }
    });
  }
  function Fl(l, t) {
    var a = t.deletions;
    if (a !== null)
      for (var e = 0; e < a.length; e++) {
        var u = a[e], n = l, i = t, c = i;
        l: for (; c !== null; ) {
          switch (c.tag) {
            case 27:
              if (va(c.type)) {
                yl = c.stateNode, kl = !1;
                break l;
              }
              break;
            case 5:
              yl = c.stateNode, kl = !1;
              break l;
            case 3:
            case 4:
              yl = c.stateNode.containerInfo, kl = !0;
              break l;
          }
          c = c.return;
        }
        if (yl === null) throw Error(f(160));
        d0(n, i, u), yl = null, kl = !1, n = u.alternate, n !== null && (n.return = null), u.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        h0(t, l), t = t.sibling;
  }
  var Tt = null;
  function h0(l, t) {
    var a = l.alternate, e = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Fl(t, l), Il(l), e & 4 && (fa(3, l, l.return), eu(3, l), fa(5, l, l.return));
        break;
      case 1:
        Fl(t, l), Il(l), e & 512 && (Ol || a === null || Ut(a, a.return)), e & 64 && Zt && (l = l.updateQueue, l !== null && (e = l.callbacks, e !== null && (a = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = a === null ? e : a.concat(e))));
        break;
      case 26:
        var u = Tt;
        if (Fl(t, l), Il(l), e & 512 && (Ol || a === null || Ut(a, a.return)), e & 4) {
          var n = a !== null ? a.memoizedState : null;
          if (e = l.memoizedState, a === null)
            if (e === null)
              if (l.stateNode === null) {
                l: {
                  e = l.type, a = l.memoizedProps, u = u.ownerDocument || u;
                  t: switch (e) {
                    case "title":
                      n = u.getElementsByTagName("title")[0], (!n || n[Re] || n[Gl] || n.namespaceURI === "http://www.w3.org/2000/svg" || n.hasAttribute("itemprop")) && (n = u.createElement(e), u.head.insertBefore(
                        n,
                        u.querySelector("head > title")
                      )), Ll(n, e, a), n[Gl] = l, ql(n), e = n;
                      break l;
                    case "link":
                      var i = hr(
                        "link",
                        "href",
                        u
                      ).get(e + (a.href || ""));
                      if (i) {
                        for (var c = 0; c < i.length; c++)
                          if (n = i[c], n.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && n.getAttribute("rel") === (a.rel == null ? null : a.rel) && n.getAttribute("title") === (a.title == null ? null : a.title) && n.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                            i.splice(c, 1);
                            break t;
                          }
                      }
                      n = u.createElement(e), Ll(n, e, a), u.head.appendChild(n);
                      break;
                    case "meta":
                      if (i = hr(
                        "meta",
                        "content",
                        u
                      ).get(e + (a.content || ""))) {
                        for (c = 0; c < i.length; c++)
                          if (n = i[c], n.getAttribute("content") === (a.content == null ? null : "" + a.content) && n.getAttribute("name") === (a.name == null ? null : a.name) && n.getAttribute("property") === (a.property == null ? null : a.property) && n.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && n.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                            i.splice(c, 1);
                            break t;
                          }
                      }
                      n = u.createElement(e), Ll(n, e, a), u.head.appendChild(n);
                      break;
                    default:
                      throw Error(f(468, e));
                  }
                  n[Gl] = l, ql(n), e = n;
                }
                l.stateNode = e;
              } else
                gr(
                  u,
                  l.type,
                  l.stateNode
                );
            else
              l.stateNode = vr(
                u,
                e,
                l.memoizedProps
              );
          else
            n !== e ? (n === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : n.count--, e === null ? gr(
              u,
              l.type,
              l.stateNode
            ) : vr(
              u,
              e,
              l.memoizedProps
            )) : e === null && l.stateNode !== null && Tc(
              l,
              l.memoizedProps,
              a.memoizedProps
            );
        }
        break;
      case 27:
        Fl(t, l), Il(l), e & 512 && (Ol || a === null || Ut(a, a.return)), a !== null && e & 4 && Tc(
          l,
          l.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (Fl(t, l), Il(l), e & 512 && (Ol || a === null || Ut(a, a.return)), l.flags & 32) {
          u = l.stateNode;
          try {
            wa(u, "");
          } catch (q) {
            ul(l, l.return, q);
          }
        }
        e & 4 && l.stateNode != null && (u = l.memoizedProps, Tc(
          l,
          u,
          a !== null ? a.memoizedProps : u
        )), e & 1024 && (Mc = !0);
        break;
      case 6:
        if (Fl(t, l), Il(l), e & 4) {
          if (l.stateNode === null)
            throw Error(f(162));
          e = l.memoizedProps, a = l.stateNode;
          try {
            a.nodeValue = e;
          } catch (q) {
            ul(l, l.return, q);
          }
        }
        break;
      case 3:
        if (Hn = null, u = Tt, Tt = Nn(t.containerInfo), Fl(t, l), Tt = u, Il(l), e & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            Te(t.containerInfo);
          } catch (q) {
            ul(l, l.return, q);
          }
        Mc && (Mc = !1, g0(l));
        break;
      case 4:
        e = Tt, Tt = Nn(
          l.stateNode.containerInfo
        ), Fl(t, l), Il(l), Tt = e;
        break;
      case 12:
        Fl(t, l), Il(l);
        break;
      case 31:
        Fl(t, l), Il(l), e & 4 && (e = l.updateQueue, e !== null && (l.updateQueue = null, hn(l, e)));
        break;
      case 13:
        Fl(t, l), Il(l), l.child.flags & 8192 && l.memoizedState !== null != (a !== null && a.memoizedState !== null) && (Sn = at()), e & 4 && (e = l.updateQueue, e !== null && (l.updateQueue = null, hn(l, e)));
        break;
      case 22:
        u = l.memoizedState !== null;
        var o = a !== null && a.memoizedState !== null, g = Zt, A = Ol;
        if (Zt = g || u, Ol = A || o, Fl(t, l), Ol = A, Zt = g, Il(l), e & 8192)
          l: for (t = l.stateNode, t._visibility = u ? t._visibility & -2 : t._visibility | 1, u && (a === null || o || Zt || Ol || Qa(l)), a = null, t = l; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                o = a = t;
                try {
                  if (n = o.stateNode, u)
                    i = n.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none";
                  else {
                    c = o.stateNode;
                    var z = o.memoizedProps.style, S = z != null && z.hasOwnProperty("display") ? z.display : null;
                    c.style.display = S == null || typeof S == "boolean" ? "" : ("" + S).trim();
                  }
                } catch (q) {
                  ul(o, o.return, q);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                o = t;
                try {
                  o.stateNode.nodeValue = u ? "" : o.memoizedProps;
                } catch (q) {
                  ul(o, o.return, q);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                o = t;
                try {
                  var _ = o.stateNode;
                  u ? ir(_, !0) : ir(o.stateNode, !1);
                } catch (q) {
                  ul(o, o.return, q);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === l) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === l) break l;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === l) break l;
              a === t && (a = null), t = t.return;
            }
            a === t && (a = null), t.sibling.return = t.return, t = t.sibling;
          }
        e & 4 && (e = l.updateQueue, e !== null && (a = e.retryQueue, a !== null && (e.retryQueue = null, hn(l, a))));
        break;
      case 19:
        Fl(t, l), Il(l), e & 4 && (e = l.updateQueue, e !== null && (l.updateQueue = null, hn(l, e)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Fl(t, l), Il(l);
    }
  }
  function Il(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var a, e = l.return; e !== null; ) {
          if (f0(e)) {
            a = e;
            break;
          }
          e = e.return;
        }
        if (a == null) throw Error(f(160));
        switch (a.tag) {
          case 27:
            var u = a.stateNode, n = zc(l);
            vn(l, n, u);
            break;
          case 5:
            var i = a.stateNode;
            a.flags & 32 && (wa(i, ""), a.flags &= -33);
            var c = zc(l);
            vn(l, c, i);
            break;
          case 3:
          case 4:
            var o = a.stateNode.containerInfo, g = zc(l);
            Oc(
              l,
              g,
              o
            );
            break;
          default:
            throw Error(f(161));
        }
      } catch (A) {
        ul(l, l.return, A);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function g0(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        g0(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), l = l.sibling;
      }
  }
  function Kt(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        r0(l, t.alternate, t), t = t.sibling;
  }
  function Qa(l) {
    for (l = l.child; l !== null; ) {
      var t = l;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          fa(4, t, t.return), Qa(t);
          break;
        case 1:
          Ut(t, t.return);
          var a = t.stateNode;
          typeof a.componentWillUnmount == "function" && i0(
            t,
            t.return,
            a
          ), Qa(t);
          break;
        case 27:
          du(t.stateNode);
        case 26:
        case 5:
          Ut(t, t.return), Qa(t);
          break;
        case 22:
          t.memoizedState === null && Qa(t);
          break;
        case 30:
          Qa(t);
          break;
        default:
          Qa(t);
      }
      l = l.sibling;
    }
  }
  function Jt(l, t, a) {
    for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var e = t.alternate, u = l, n = t, i = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Jt(
            u,
            n,
            a
          ), eu(4, n);
          break;
        case 1:
          if (Jt(
            u,
            n,
            a
          ), e = n, u = e.stateNode, typeof u.componentDidMount == "function")
            try {
              u.componentDidMount();
            } catch (g) {
              ul(e, e.return, g);
            }
          if (e = n, u = e.updateQueue, u !== null) {
            var c = e.stateNode;
            try {
              var o = u.shared.hiddenCallbacks;
              if (o !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < o.length; u++)
                  ws(o[u], c);
            } catch (g) {
              ul(e, e.return, g);
            }
          }
          a && i & 64 && n0(n), uu(n, n.return);
          break;
        case 27:
          s0(n);
        case 26:
        case 5:
          Jt(
            u,
            n,
            a
          ), a && e === null && i & 4 && c0(n), uu(n, n.return);
          break;
        case 12:
          Jt(
            u,
            n,
            a
          );
          break;
        case 31:
          Jt(
            u,
            n,
            a
          ), a && i & 4 && y0(u, n);
          break;
        case 13:
          Jt(
            u,
            n,
            a
          ), a && i & 4 && v0(u, n);
          break;
        case 22:
          n.memoizedState === null && Jt(
            u,
            n,
            a
          ), uu(n, n.return);
          break;
        case 30:
          break;
        default:
          Jt(
            u,
            n,
            a
          );
      }
      t = t.sibling;
    }
  }
  function Dc(l, t) {
    var a = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (a = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== a && (l != null && l.refCount++, a != null && Ve(a));
  }
  function Uc(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Ve(l));
  }
  function zt(l, t, a, e) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        S0(
          l,
          t,
          a,
          e
        ), t = t.sibling;
  }
  function S0(l, t, a, e) {
    var u = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        zt(
          l,
          t,
          a,
          e
        ), u & 2048 && eu(9, t);
        break;
      case 1:
        zt(
          l,
          t,
          a,
          e
        );
        break;
      case 3:
        zt(
          l,
          t,
          a,
          e
        ), u & 2048 && (l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Ve(l)));
        break;
      case 12:
        if (u & 2048) {
          zt(
            l,
            t,
            a,
            e
          ), l = t.stateNode;
          try {
            var n = t.memoizedProps, i = n.id, c = n.onPostCommit;
            typeof c == "function" && c(
              i,
              t.alternate === null ? "mount" : "update",
              l.passiveEffectDuration,
              -0
            );
          } catch (o) {
            ul(t, t.return, o);
          }
        } else
          zt(
            l,
            t,
            a,
            e
          );
        break;
      case 31:
        zt(
          l,
          t,
          a,
          e
        );
        break;
      case 13:
        zt(
          l,
          t,
          a,
          e
        );
        break;
      case 23:
        break;
      case 22:
        n = t.stateNode, i = t.alternate, t.memoizedState !== null ? n._visibility & 2 ? zt(
          l,
          t,
          a,
          e
        ) : nu(l, t) : n._visibility & 2 ? zt(
          l,
          t,
          a,
          e
        ) : (n._visibility |= 2, de(
          l,
          t,
          a,
          e,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), u & 2048 && Dc(i, t);
        break;
      case 24:
        zt(
          l,
          t,
          a,
          e
        ), u & 2048 && Uc(t.alternate, t);
        break;
      default:
        zt(
          l,
          t,
          a,
          e
        );
    }
  }
  function de(l, t, a, e, u) {
    for (u = u && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var n = l, i = t, c = a, o = e, g = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          de(
            n,
            i,
            c,
            o,
            u
          ), eu(8, i);
          break;
        case 23:
          break;
        case 22:
          var A = i.stateNode;
          i.memoizedState !== null ? A._visibility & 2 ? de(
            n,
            i,
            c,
            o,
            u
          ) : nu(
            n,
            i
          ) : (A._visibility |= 2, de(
            n,
            i,
            c,
            o,
            u
          )), u && g & 2048 && Dc(
            i.alternate,
            i
          );
          break;
        case 24:
          de(
            n,
            i,
            c,
            o,
            u
          ), u && g & 2048 && Uc(i.alternate, i);
          break;
        default:
          de(
            n,
            i,
            c,
            o,
            u
          );
      }
      t = t.sibling;
    }
  }
  function nu(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var a = l, e = t, u = e.flags;
        switch (e.tag) {
          case 22:
            nu(a, e), u & 2048 && Dc(
              e.alternate,
              e
            );
            break;
          case 24:
            nu(a, e), u & 2048 && Uc(e.alternate, e);
            break;
          default:
            nu(a, e);
        }
        t = t.sibling;
      }
  }
  var iu = 8192;
  function ye(l, t, a) {
    if (l.subtreeFlags & iu)
      for (l = l.child; l !== null; )
        _0(
          l,
          t,
          a
        ), l = l.sibling;
  }
  function _0(l, t, a) {
    switch (l.tag) {
      case 26:
        ye(
          l,
          t,
          a
        ), l.flags & iu && l.memoizedState !== null && oy(
          a,
          Tt,
          l.memoizedState,
          l.memoizedProps
        );
        break;
      case 5:
        ye(
          l,
          t,
          a
        );
        break;
      case 3:
      case 4:
        var e = Tt;
        Tt = Nn(l.stateNode.containerInfo), ye(
          l,
          t,
          a
        ), Tt = e;
        break;
      case 22:
        l.memoizedState === null && (e = l.alternate, e !== null && e.memoizedState !== null ? (e = iu, iu = 16777216, ye(
          l,
          t,
          a
        ), iu = e) : ye(
          l,
          t,
          a
        ));
        break;
      default:
        ye(
          l,
          t,
          a
        );
    }
  }
  function b0(l) {
    var t = l.alternate;
    if (t !== null && (l = t.child, l !== null)) {
      t.child = null;
      do
        t = l.sibling, l.sibling = null, l = t;
      while (l !== null);
    }
  }
  function cu(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var e = t[a];
          Yl = e, A0(
            e,
            l
          );
        }
      b0(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        E0(l), l = l.sibling;
  }
  function E0(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        cu(l), l.flags & 2048 && fa(9, l, l.return);
        break;
      case 3:
        cu(l);
        break;
      case 12:
        cu(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, gn(l)) : cu(l);
        break;
      default:
        cu(l);
    }
  }
  function gn(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var e = t[a];
          Yl = e, A0(
            e,
            l
          );
        }
      b0(l);
    }
    for (l = l.child; l !== null; ) {
      switch (t = l, t.tag) {
        case 0:
        case 11:
        case 15:
          fa(8, t, t.return), gn(t);
          break;
        case 22:
          a = t.stateNode, a._visibility & 2 && (a._visibility &= -3, gn(t));
          break;
        default:
          gn(t);
      }
      l = l.sibling;
    }
  }
  function A0(l, t) {
    for (; Yl !== null; ) {
      var a = Yl;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          fa(8, a, t);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var e = a.memoizedState.cachePool.pool;
            e != null && e.refCount++;
          }
          break;
        case 24:
          Ve(a.memoizedState.cache);
      }
      if (e = a.child, e !== null) e.return = a, Yl = e;
      else
        l: for (a = l; Yl !== null; ) {
          e = Yl;
          var u = e.sibling, n = e.return;
          if (m0(e), e === a) {
            Yl = null;
            break l;
          }
          if (u !== null) {
            u.return = n, Yl = u;
            break l;
          }
          Yl = n;
        }
    }
  }
  var zd = {
    getCacheForType: function(l) {
      var t = jl(pl), a = t.data.get(l);
      return a === void 0 && (a = l(), t.data.set(l, a)), a;
    },
    cacheSignal: function() {
      return jl(pl).controller.signal;
    }
  }, Od = typeof WeakMap == "function" ? WeakMap : Map, tl = 0, rl = null, $ = null, k = 0, el = 0, st = null, sa = !1, ve = !1, Nc = !1, wt = 0, Sl = 0, oa = 0, ja = 0, Rc = 0, ot = 0, he = 0, fu = null, Pl = null, Hc = !1, Sn = 0, p0 = 0, _n = 1 / 0, bn = null, ra = null, Nl = 0, ma = null, ge = null, $t = 0, Cc = 0, Bc = null, T0 = null, su = 0, qc = null;
  function rt() {
    return (tl & 2) !== 0 && k !== 0 ? k & -k : p.T !== null ? Xc() : Qf();
  }
  function z0() {
    if (ot === 0)
      if ((k & 536870912) === 0 || I) {
        var l = Mu;
        Mu <<= 1, (Mu & 3932160) === 0 && (Mu = 262144), ot = l;
      } else ot = 536870912;
    return l = ct.current, l !== null && (l.flags |= 32), ot;
  }
  function lt(l, t, a) {
    (l === rl && (el === 2 || el === 9) || l.cancelPendingCommit !== null) && (Se(l, 0), da(
      l,
      k,
      ot,
      !1
    )), Ne(l, a), ((tl & 2) === 0 || l !== rl) && (l === rl && ((tl & 2) === 0 && (ja |= a), Sl === 4 && da(
      l,
      k,
      ot,
      !1
    )), Nt(l));
  }
  function O0(l, t, a) {
    if ((tl & 6) !== 0) throw Error(f(327));
    var e = !a && (t & 127) === 0 && (t & l.expiredLanes) === 0 || Ue(l, t), u = e ? Ud(l, t) : xc(l, t, !0), n = e;
    do {
      if (u === 0) {
        ve && !e && da(l, t, 0, !1);
        break;
      } else {
        if (a = l.current.alternate, n && !Md(a)) {
          u = xc(l, t, !1), n = !1;
          continue;
        }
        if (u === 2) {
          if (n = t, l.errorRecoveryDisabledLanes & n)
            var i = 0;
          else
            i = l.pendingLanes & -536870913, i = i !== 0 ? i : i & 536870912 ? 536870912 : 0;
          if (i !== 0) {
            t = i;
            l: {
              var c = l;
              u = fu;
              var o = c.current.memoizedState.isDehydrated;
              if (o && (Se(c, i).flags |= 256), i = xc(
                c,
                i,
                !1
              ), i !== 2) {
                if (Nc && !o) {
                  c.errorRecoveryDisabledLanes |= n, ja |= n, u = 4;
                  break l;
                }
                n = Pl, Pl = u, n !== null && (Pl === null ? Pl = n : Pl.push.apply(
                  Pl,
                  n
                ));
              }
              u = i;
            }
            if (n = !1, u !== 2) continue;
          }
        }
        if (u === 1) {
          Se(l, 0), da(l, t, 0, !0);
          break;
        }
        l: {
          switch (e = l, n = u, n) {
            case 0:
            case 1:
              throw Error(f(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              da(
                e,
                t,
                ot,
                !sa
              );
              break l;
            case 2:
              Pl = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(f(329));
          }
          if ((t & 62914560) === t && (u = Sn + 300 - at(), 10 < u)) {
            if (da(
              e,
              t,
              ot,
              !sa
            ), Uu(e, 0, !0) !== 0) break l;
            $t = t, e.timeoutHandle = er(
              M0.bind(
                null,
                e,
                a,
                Pl,
                bn,
                Hc,
                t,
                ot,
                ja,
                he,
                sa,
                n,
                "Throttled",
                -0,
                0
              ),
              u
            );
            break l;
          }
          M0(
            e,
            a,
            Pl,
            bn,
            Hc,
            t,
            ot,
            ja,
            he,
            sa,
            n,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Nt(l);
  }
  function M0(l, t, a, e, u, n, i, c, o, g, A, z, S, _) {
    if (l.timeoutHandle = -1, z = t.subtreeFlags, z & 8192 || (z & 16785408) === 16785408) {
      z = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Ct
      }, _0(
        t,
        n,
        z
      );
      var q = (n & 62914560) === n ? Sn - at() : (n & 4194048) === n ? p0 - at() : 0;
      if (q = ry(
        z,
        q
      ), q !== null) {
        $t = n, l.cancelPendingCommit = q(
          q0.bind(
            null,
            l,
            t,
            n,
            a,
            e,
            u,
            i,
            c,
            o,
            A,
            z,
            null,
            S,
            _
          )
        ), da(l, n, i, !g);
        return;
      }
    }
    q0(
      l,
      t,
      n,
      a,
      e,
      u,
      i,
      c,
      o
    );
  }
  function Md(l) {
    for (var t = l; ; ) {
      var a = t.tag;
      if ((a === 0 || a === 11 || a === 15) && t.flags & 16384 && (a = t.updateQueue, a !== null && (a = a.stores, a !== null)))
        for (var e = 0; e < a.length; e++) {
          var u = a[e], n = u.getSnapshot;
          u = u.value;
          try {
            if (!nt(n(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (a = t.child, t.subtreeFlags & 16384 && a !== null)
        a.return = t, t = a;
      else {
        if (t === l) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === l) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function da(l, t, a, e) {
    t &= ~Rc, t &= ~ja, l.suspendedLanes |= t, l.pingedLanes &= ~t, e && (l.warmLanes |= t), e = l.expirationTimes;
    for (var u = t; 0 < u; ) {
      var n = 31 - ut(u), i = 1 << n;
      e[n] = -1, u &= ~i;
    }
    a !== 0 && Yf(l, a, t);
  }
  function En() {
    return (tl & 6) === 0 ? (ou(0), !1) : !0;
  }
  function Yc() {
    if ($ !== null) {
      if (el === 0)
        var l = $.return;
      else
        l = $, xt = Ra = null, Ii(l), fe = null, Je = 0, l = $;
      for (; l !== null; )
        u0(l.alternate, l), l = l.return;
      $ = null;
    }
  }
  function Se(l, t) {
    var a = l.timeoutHandle;
    a !== -1 && (l.timeoutHandle = -1, wd(a)), a = l.cancelPendingCommit, a !== null && (l.cancelPendingCommit = null, a()), $t = 0, Yc(), rl = l, $ = a = qt(l.current, null), k = t, el = 0, st = null, sa = !1, ve = Ue(l, t), Nc = !1, he = ot = Rc = ja = oa = Sl = 0, Pl = fu = null, Hc = !1, (t & 8) !== 0 && (t |= t & 32);
    var e = l.entangledLanes;
    if (e !== 0)
      for (l = l.entanglements, e &= t; 0 < e; ) {
        var u = 31 - ut(e), n = 1 << u;
        t |= l[u], e &= ~n;
      }
    return wt = t, Xu(), a;
  }
  function D0(l, t) {
    V = null, p.H = lu, t === ce || t === Wu ? (t = Zs(), el = 3) : t === ji ? (t = Zs(), el = 4) : el = t === yc ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, st = t, $ === null && (Sl = 1, on(
      l,
      vt(t, l.current)
    ));
  }
  function U0() {
    var l = ct.current;
    return l === null ? !0 : (k & 4194048) === k ? _t === null : (k & 62914560) === k || (k & 536870912) !== 0 ? l === _t : !1;
  }
  function N0() {
    var l = p.H;
    return p.H = lu, l === null ? lu : l;
  }
  function R0() {
    var l = p.A;
    return p.A = zd, l;
  }
  function An() {
    Sl = 4, sa || (k & 4194048) !== k && ct.current !== null || (ve = !0), (oa & 134217727) === 0 && (ja & 134217727) === 0 || rl === null || da(
      rl,
      k,
      ot,
      !1
    );
  }
  function xc(l, t, a) {
    var e = tl;
    tl |= 2;
    var u = N0(), n = R0();
    (rl !== l || k !== t) && (bn = null, Se(l, t)), t = !1;
    var i = Sl;
    l: do
      try {
        if (el !== 0 && $ !== null) {
          var c = $, o = st;
          switch (el) {
            case 8:
              Yc(), i = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              ct.current === null && (t = !0);
              var g = el;
              if (el = 0, st = null, _e(l, c, o, g), a && ve) {
                i = 0;
                break l;
              }
              break;
            default:
              g = el, el = 0, st = null, _e(l, c, o, g);
          }
        }
        Dd(), i = Sl;
        break;
      } catch (A) {
        D0(l, A);
      }
    while (!0);
    return t && l.shellSuspendCounter++, xt = Ra = null, tl = e, p.H = u, p.A = n, $ === null && (rl = null, k = 0, Xu()), i;
  }
  function Dd() {
    for (; $ !== null; ) H0($);
  }
  function Ud(l, t) {
    var a = tl;
    tl |= 2;
    var e = N0(), u = R0();
    rl !== l || k !== t ? (bn = null, _n = at() + 500, Se(l, t)) : ve = Ue(
      l,
      t
    );
    l: do
      try {
        if (el !== 0 && $ !== null) {
          t = $;
          var n = st;
          t: switch (el) {
            case 1:
              el = 0, st = null, _e(l, t, n, 1);
              break;
            case 2:
            case 9:
              if (Xs(n)) {
                el = 0, st = null, C0(t);
                break;
              }
              t = function() {
                el !== 2 && el !== 9 || rl !== l || (el = 7), Nt(l);
              }, n.then(t, t);
              break l;
            case 3:
              el = 7;
              break l;
            case 4:
              el = 5;
              break l;
            case 7:
              Xs(n) ? (el = 0, st = null, C0(t)) : (el = 0, st = null, _e(l, t, n, 7));
              break;
            case 5:
              var i = null;
              switch ($.tag) {
                case 26:
                  i = $.memoizedState;
                case 5:
                case 27:
                  var c = $;
                  if (i ? Sr(i) : c.stateNode.complete) {
                    el = 0, st = null;
                    var o = c.sibling;
                    if (o !== null) $ = o;
                    else {
                      var g = c.return;
                      g !== null ? ($ = g, pn(g)) : $ = null;
                    }
                    break t;
                  }
              }
              el = 0, st = null, _e(l, t, n, 5);
              break;
            case 6:
              el = 0, st = null, _e(l, t, n, 6);
              break;
            case 8:
              Yc(), Sl = 6;
              break l;
            default:
              throw Error(f(462));
          }
        }
        Nd();
        break;
      } catch (A) {
        D0(l, A);
      }
    while (!0);
    return xt = Ra = null, p.H = e, p.A = u, tl = a, $ !== null ? 0 : (rl = null, k = 0, Xu(), Sl);
  }
  function Nd() {
    for (; $ !== null && !Pr(); )
      H0($);
  }
  function H0(l) {
    var t = a0(l.alternate, l, wt);
    l.memoizedProps = l.pendingProps, t === null ? pn(l) : $ = t;
  }
  function C0(l) {
    var t = l, a = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = ko(
          a,
          t,
          t.pendingProps,
          t.type,
          void 0,
          k
        );
        break;
      case 11:
        t = ko(
          a,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          k
        );
        break;
      case 5:
        Ii(t);
      default:
        u0(a, t), t = $ = Ns(t, wt), t = a0(a, t, wt);
    }
    l.memoizedProps = l.pendingProps, t === null ? pn(l) : $ = t;
  }
  function _e(l, t, a, e) {
    xt = Ra = null, Ii(t), fe = null, Je = 0;
    var u = t.return;
    try {
      if (Sd(
        l,
        u,
        t,
        a,
        k
      )) {
        Sl = 1, on(
          l,
          vt(a, l.current)
        ), $ = null;
        return;
      }
    } catch (n) {
      if (u !== null) throw $ = u, n;
      Sl = 1, on(
        l,
        vt(a, l.current)
      ), $ = null;
      return;
    }
    t.flags & 32768 ? (I || e === 1 ? l = !0 : ve || (k & 536870912) !== 0 ? l = !1 : (sa = l = !0, (e === 2 || e === 9 || e === 3 || e === 6) && (e = ct.current, e !== null && e.tag === 13 && (e.flags |= 16384))), B0(t, l)) : pn(t);
  }
  function pn(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        B0(
          t,
          sa
        );
        return;
      }
      l = t.return;
      var a = Ed(
        t.alternate,
        t,
        wt
      );
      if (a !== null) {
        $ = a;
        return;
      }
      if (t = t.sibling, t !== null) {
        $ = t;
        return;
      }
      $ = t = l;
    } while (t !== null);
    Sl === 0 && (Sl = 5);
  }
  function B0(l, t) {
    do {
      var a = Ad(l.alternate, l);
      if (a !== null) {
        a.flags &= 32767, $ = a;
        return;
      }
      if (a = l.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !t && (l = l.sibling, l !== null)) {
        $ = l;
        return;
      }
      $ = l = a;
    } while (l !== null);
    Sl = 6, $ = null;
  }
  function q0(l, t, a, e, u, n, i, c, o) {
    l.cancelPendingCommit = null;
    do
      Tn();
    while (Nl !== 0);
    if ((tl & 6) !== 0) throw Error(f(327));
    if (t !== null) {
      if (t === l.current) throw Error(f(177));
      if (n = t.lanes | t.childLanes, n |= zi, sm(
        l,
        a,
        n,
        i,
        c,
        o
      ), l === rl && ($ = rl = null, k = 0), ge = t, ma = l, $t = a, Cc = n, Bc = u, T0 = e, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, Bd(zu, function() {
        return j0(), null;
      })) : (l.callbackNode = null, l.callbackPriority = 0), e = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || e) {
        e = p.T, p.T = null, u = R.p, R.p = 2, i = tl, tl |= 4;
        try {
          pd(l, t, a);
        } finally {
          tl = i, R.p = u, p.T = e;
        }
      }
      Nl = 1, Y0(), x0(), G0();
    }
  }
  function Y0() {
    if (Nl === 1) {
      Nl = 0;
      var l = ma, t = ge, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = p.T, p.T = null;
        var e = R.p;
        R.p = 2;
        var u = tl;
        tl |= 4;
        try {
          h0(t, l);
          var n = Wc, i = Es(l.containerInfo), c = n.focusedElem, o = n.selectionRange;
          if (i !== c && c && c.ownerDocument && bs(
            c.ownerDocument.documentElement,
            c
          )) {
            if (o !== null && bi(c)) {
              var g = o.start, A = o.end;
              if (A === void 0 && (A = g), "selectionStart" in c)
                c.selectionStart = g, c.selectionEnd = Math.min(
                  A,
                  c.value.length
                );
              else {
                var z = c.ownerDocument || document, S = z && z.defaultView || window;
                if (S.getSelection) {
                  var _ = S.getSelection(), q = c.textContent.length, Q = Math.min(o.start, q), fl = o.end === void 0 ? Q : Math.min(o.end, q);
                  !_.extend && Q > fl && (i = fl, fl = Q, Q = i);
                  var y = _s(
                    c,
                    Q
                  ), r = _s(
                    c,
                    fl
                  );
                  if (y && r && (_.rangeCount !== 1 || _.anchorNode !== y.node || _.anchorOffset !== y.offset || _.focusNode !== r.node || _.focusOffset !== r.offset)) {
                    var h = z.createRange();
                    h.setStart(y.node, y.offset), _.removeAllRanges(), Q > fl ? (_.addRange(h), _.extend(r.node, r.offset)) : (h.setEnd(r.node, r.offset), _.addRange(h));
                  }
                }
              }
            }
            for (z = [], _ = c; _ = _.parentNode; )
              _.nodeType === 1 && z.push({
                element: _,
                left: _.scrollLeft,
                top: _.scrollTop
              });
            for (typeof c.focus == "function" && c.focus(), c = 0; c < z.length; c++) {
              var T = z[c];
              T.element.scrollLeft = T.left, T.element.scrollTop = T.top;
            }
          }
          Yn = !!$c, Wc = $c = null;
        } finally {
          tl = u, R.p = e, p.T = a;
        }
      }
      l.current = t, Nl = 2;
    }
  }
  function x0() {
    if (Nl === 2) {
      Nl = 0;
      var l = ma, t = ge, a = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || a) {
        a = p.T, p.T = null;
        var e = R.p;
        R.p = 2;
        var u = tl;
        tl |= 4;
        try {
          r0(l, t.alternate, t);
        } finally {
          tl = u, R.p = e, p.T = a;
        }
      }
      Nl = 3;
    }
  }
  function G0() {
    if (Nl === 4 || Nl === 3) {
      Nl = 0, lm();
      var l = ma, t = ge, a = $t, e = T0;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Nl = 5 : (Nl = 0, ge = ma = null, Q0(l, l.pendingLanes));
      var u = l.pendingLanes;
      if (u === 0 && (ra = null), ti(a), t = t.stateNode, et && typeof et.onCommitFiberRoot == "function")
        try {
          et.onCommitFiberRoot(
            De,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (e !== null) {
        t = p.T, u = R.p, R.p = 2, p.T = null;
        try {
          for (var n = l.onRecoverableError, i = 0; i < e.length; i++) {
            var c = e[i];
            n(c.value, {
              componentStack: c.stack
            });
          }
        } finally {
          p.T = t, R.p = u;
        }
      }
      ($t & 3) !== 0 && Tn(), Nt(l), u = l.pendingLanes, (a & 261930) !== 0 && (u & 42) !== 0 ? l === qc ? su++ : (su = 0, qc = l) : su = 0, ou(0);
    }
  }
  function Q0(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, Ve(t)));
  }
  function Tn() {
    return Y0(), x0(), G0(), j0();
  }
  function j0() {
    if (Nl !== 5) return !1;
    var l = ma, t = Cc;
    Cc = 0;
    var a = ti($t), e = p.T, u = R.p;
    try {
      R.p = 32 > a ? 32 : a, p.T = null, a = Bc, Bc = null;
      var n = ma, i = $t;
      if (Nl = 0, ge = ma = null, $t = 0, (tl & 6) !== 0) throw Error(f(331));
      var c = tl;
      if (tl |= 4, E0(n.current), S0(
        n,
        n.current,
        i,
        a
      ), tl = c, ou(0, !1), et && typeof et.onPostCommitFiberRoot == "function")
        try {
          et.onPostCommitFiberRoot(De, n);
        } catch {
        }
      return !0;
    } finally {
      R.p = u, p.T = e, Q0(l, t);
    }
  }
  function X0(l, t, a) {
    t = vt(a, t), t = dc(l.stateNode, t, 2), l = na(l, t, 2), l !== null && (Ne(l, 2), Nt(l));
  }
  function ul(l, t, a) {
    if (l.tag === 3)
      X0(l, l, a);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          X0(
            t,
            l,
            a
          );
          break;
        } else if (t.tag === 1) {
          var e = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof e.componentDidCatch == "function" && (ra === null || !ra.has(e))) {
            l = vt(a, l), a = Lo(2), e = na(t, a, 2), e !== null && (Zo(
              a,
              e,
              t,
              l
            ), Ne(e, 2), Nt(e));
            break;
          }
        }
        t = t.return;
      }
  }
  function Gc(l, t, a) {
    var e = l.pingCache;
    if (e === null) {
      e = l.pingCache = new Od();
      var u = /* @__PURE__ */ new Set();
      e.set(t, u);
    } else
      u = e.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), e.set(t, u));
    u.has(a) || (Nc = !0, u.add(a), l = Rd.bind(null, l, t, a), t.then(l, l));
  }
  function Rd(l, t, a) {
    var e = l.pingCache;
    e !== null && e.delete(t), l.pingedLanes |= l.suspendedLanes & a, l.warmLanes &= ~a, rl === l && (k & a) === a && (Sl === 4 || Sl === 3 && (k & 62914560) === k && 300 > at() - Sn ? (tl & 2) === 0 && Se(l, 0) : Rc |= a, he === k && (he = 0)), Nt(l);
  }
  function L0(l, t) {
    t === 0 && (t = qf()), l = Da(l, t), l !== null && (Ne(l, t), Nt(l));
  }
  function Hd(l) {
    var t = l.memoizedState, a = 0;
    t !== null && (a = t.retryLane), L0(l, a);
  }
  function Cd(l, t) {
    var a = 0;
    switch (l.tag) {
      case 31:
      case 13:
        var e = l.stateNode, u = l.memoizedState;
        u !== null && (a = u.retryLane);
        break;
      case 19:
        e = l.stateNode;
        break;
      case 22:
        e = l.stateNode._retryCache;
        break;
      default:
        throw Error(f(314));
    }
    e !== null && e.delete(t), L0(l, a);
  }
  function Bd(l, t) {
    return Fn(l, t);
  }
  var zn = null, be = null, Qc = !1, On = !1, jc = !1, ya = 0;
  function Nt(l) {
    l !== be && l.next === null && (be === null ? zn = be = l : be = be.next = l), On = !0, Qc || (Qc = !0, Yd());
  }
  function ou(l, t) {
    if (!jc && On) {
      jc = !0;
      do
        for (var a = !1, e = zn; e !== null; ) {
          if (l !== 0) {
            var u = e.pendingLanes;
            if (u === 0) var n = 0;
            else {
              var i = e.suspendedLanes, c = e.pingedLanes;
              n = (1 << 31 - ut(42 | l) + 1) - 1, n &= u & ~(i & ~c), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
            }
            n !== 0 && (a = !0, J0(e, n));
          } else
            n = k, n = Uu(
              e,
              e === rl ? n : 0,
              e.cancelPendingCommit !== null || e.timeoutHandle !== -1
            ), (n & 3) === 0 || Ue(e, n) || (a = !0, J0(e, n));
          e = e.next;
        }
      while (a);
      jc = !1;
    }
  }
  function qd() {
    Z0();
  }
  function Z0() {
    On = Qc = !1;
    var l = 0;
    ya !== 0 && Jd() && (l = ya);
    for (var t = at(), a = null, e = zn; e !== null; ) {
      var u = e.next, n = V0(e, t);
      n === 0 ? (e.next = null, a === null ? zn = u : a.next = u, u === null && (be = a)) : (a = e, (l !== 0 || (n & 3) !== 0) && (On = !0)), e = u;
    }
    Nl !== 0 && Nl !== 5 || ou(l), ya !== 0 && (ya = 0);
  }
  function V0(l, t) {
    for (var a = l.suspendedLanes, e = l.pingedLanes, u = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
      var i = 31 - ut(n), c = 1 << i, o = u[i];
      o === -1 ? ((c & a) === 0 || (c & e) !== 0) && (u[i] = fm(c, t)) : o <= t && (l.expiredLanes |= c), n &= ~c;
    }
    if (t = rl, a = k, a = Uu(
      l,
      l === t ? a : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), e = l.callbackNode, a === 0 || l === t && (el === 2 || el === 9) || l.cancelPendingCommit !== null)
      return e !== null && e !== null && In(e), l.callbackNode = null, l.callbackPriority = 0;
    if ((a & 3) === 0 || Ue(l, a)) {
      if (t = a & -a, t === l.callbackPriority) return t;
      switch (e !== null && In(e), ti(a)) {
        case 2:
        case 8:
          a = Cf;
          break;
        case 32:
          a = zu;
          break;
        case 268435456:
          a = Bf;
          break;
        default:
          a = zu;
      }
      return e = K0.bind(null, l), a = Fn(a, e), l.callbackPriority = t, l.callbackNode = a, t;
    }
    return e !== null && e !== null && In(e), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function K0(l, t) {
    if (Nl !== 0 && Nl !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var a = l.callbackNode;
    if (Tn() && l.callbackNode !== a)
      return null;
    var e = k;
    return e = Uu(
      l,
      l === rl ? e : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), e === 0 ? null : (O0(l, e, t), V0(l, at()), l.callbackNode != null && l.callbackNode === a ? K0.bind(null, l) : null);
  }
  function J0(l, t) {
    if (Tn()) return null;
    O0(l, t, !0);
  }
  function Yd() {
    $d(function() {
      (tl & 6) !== 0 ? Fn(
        Hf,
        qd
      ) : Z0();
    });
  }
  function Xc() {
    if (ya === 0) {
      var l = ne;
      l === 0 && (l = Ou, Ou <<= 1, (Ou & 261888) === 0 && (Ou = 256)), ya = l;
    }
    return ya;
  }
  function w0(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : Cu("" + l);
  }
  function $0(l, t) {
    var a = t.ownerDocument.createElement("input");
    return a.name = t.name, a.value = t.value, l.id && a.setAttribute("form", l.id), t.parentNode.insertBefore(a, t), l = new FormData(l), a.parentNode.removeChild(a), l;
  }
  function xd(l, t, a, e, u) {
    if (t === "submit" && a && a.stateNode === u) {
      var n = w0(
        (u[$l] || null).action
      ), i = e.submitter;
      i && (t = (t = i[$l] || null) ? w0(t.formAction) : i.getAttribute("formAction"), t !== null && (n = t, i = null));
      var c = new xu(
        "action",
        "action",
        null,
        e,
        u
      );
      l.push({
        event: c,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (e.defaultPrevented) {
                if (ya !== 0) {
                  var o = i ? $0(u, i) : new FormData(u);
                  cc(
                    a,
                    {
                      pending: !0,
                      data: o,
                      method: u.method,
                      action: n
                    },
                    null,
                    o
                  );
                }
              } else
                typeof n == "function" && (c.preventDefault(), o = i ? $0(u, i) : new FormData(u), cc(
                  a,
                  {
                    pending: !0,
                    data: o,
                    method: u.method,
                    action: n
                  },
                  n,
                  o
                ));
            },
            currentTarget: u
          }
        ]
      });
    }
  }
  for (var Lc = 0; Lc < Ti.length; Lc++) {
    var Zc = Ti[Lc], Gd = Zc.toLowerCase(), Qd = Zc[0].toUpperCase() + Zc.slice(1);
    pt(
      Gd,
      "on" + Qd
    );
  }
  pt(Ts, "onAnimationEnd"), pt(zs, "onAnimationIteration"), pt(Os, "onAnimationStart"), pt("dblclick", "onDoubleClick"), pt("focusin", "onFocus"), pt("focusout", "onBlur"), pt(td, "onTransitionRun"), pt(ad, "onTransitionStart"), pt(ed, "onTransitionCancel"), pt(Ms, "onTransitionEnd"), Ka("onMouseEnter", ["mouseout", "mouseover"]), Ka("onMouseLeave", ["mouseout", "mouseover"]), Ka("onPointerEnter", ["pointerout", "pointerover"]), Ka("onPointerLeave", ["pointerout", "pointerover"]), Ta(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Ta(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Ta("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Ta(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Ta(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Ta(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var ru = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), jd = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ru)
  );
  function W0(l, t) {
    t = (t & 4) !== 0;
    for (var a = 0; a < l.length; a++) {
      var e = l[a], u = e.event;
      e = e.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var i = e.length - 1; 0 <= i; i--) {
            var c = e[i], o = c.instance, g = c.currentTarget;
            if (c = c.listener, o !== n && u.isPropagationStopped())
              break l;
            n = c, u.currentTarget = g;
            try {
              n(u);
            } catch (A) {
              ju(A);
            }
            u.currentTarget = null, n = o;
          }
        else
          for (i = 0; i < e.length; i++) {
            if (c = e[i], o = c.instance, g = c.currentTarget, c = c.listener, o !== n && u.isPropagationStopped())
              break l;
            n = c, u.currentTarget = g;
            try {
              n(u);
            } catch (A) {
              ju(A);
            }
            u.currentTarget = null, n = o;
          }
      }
    }
  }
  function W(l, t) {
    var a = t[ai];
    a === void 0 && (a = t[ai] = /* @__PURE__ */ new Set());
    var e = l + "__bubble";
    a.has(e) || (k0(t, l, 2, !1), a.add(e));
  }
  function Vc(l, t, a) {
    var e = 0;
    t && (e |= 4), k0(
      a,
      l,
      e,
      t
    );
  }
  var Mn = "_reactListening" + Math.random().toString(36).slice(2);
  function Kc(l) {
    if (!l[Mn]) {
      l[Mn] = !0, Lf.forEach(function(a) {
        a !== "selectionchange" && (jd.has(a) || Vc(a, !1, l), Vc(a, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[Mn] || (t[Mn] = !0, Vc("selectionchange", !1, t));
    }
  }
  function k0(l, t, a, e) {
    switch (zr(t)) {
      case 2:
        var u = yy;
        break;
      case 8:
        u = vy;
        break;
      default:
        u = cf;
    }
    a = u.bind(
      null,
      t,
      a,
      l
    ), u = void 0, !ri || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (u = !0), e ? u !== void 0 ? l.addEventListener(t, a, {
      capture: !0,
      passive: u
    }) : l.addEventListener(t, a, !0) : u !== void 0 ? l.addEventListener(t, a, {
      passive: u
    }) : l.addEventListener(t, a, !1);
  }
  function Jc(l, t, a, e, u) {
    var n = e;
    if ((t & 1) === 0 && (t & 2) === 0 && e !== null)
      l: for (; ; ) {
        if (e === null) return;
        var i = e.tag;
        if (i === 3 || i === 4) {
          var c = e.stateNode.containerInfo;
          if (c === u) break;
          if (i === 4)
            for (i = e.return; i !== null; ) {
              var o = i.tag;
              if ((o === 3 || o === 4) && i.stateNode.containerInfo === u)
                return;
              i = i.return;
            }
          for (; c !== null; ) {
            if (i = La(c), i === null) return;
            if (o = i.tag, o === 5 || o === 6 || o === 26 || o === 27) {
              e = n = i;
              continue l;
            }
            c = c.parentNode;
          }
        }
        e = e.return;
      }
    ls(function() {
      var g = n, A = si(a), z = [];
      l: {
        var S = Ds.get(l);
        if (S !== void 0) {
          var _ = xu, q = l;
          switch (l) {
            case "keypress":
              if (qu(a) === 0) break l;
            case "keydown":
            case "keyup":
              _ = Cm;
              break;
            case "focusin":
              q = "focus", _ = vi;
              break;
            case "focusout":
              q = "blur", _ = vi;
              break;
            case "beforeblur":
            case "afterblur":
              _ = vi;
              break;
            case "click":
              if (a.button === 2) break l;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              _ = es;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              _ = Em;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              _ = Ym;
              break;
            case Ts:
            case zs:
            case Os:
              _ = Tm;
              break;
            case Ms:
              _ = Gm;
              break;
            case "scroll":
            case "scrollend":
              _ = _m;
              break;
            case "wheel":
              _ = jm;
              break;
            case "copy":
            case "cut":
            case "paste":
              _ = Om;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              _ = ns;
              break;
            case "toggle":
            case "beforetoggle":
              _ = Lm;
          }
          var Q = (t & 4) !== 0, fl = !Q && (l === "scroll" || l === "scrollend"), y = Q ? S !== null ? S + "Capture" : null : S;
          Q = [];
          for (var r = g, h; r !== null; ) {
            var T = r;
            if (h = T.stateNode, T = T.tag, T !== 5 && T !== 26 && T !== 27 || h === null || y === null || (T = Ce(r, y), T != null && Q.push(
              mu(r, T, h)
            )), fl) break;
            r = r.return;
          }
          0 < Q.length && (S = new _(
            S,
            q,
            null,
            a,
            A
          ), z.push({ event: S, listeners: Q }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (S = l === "mouseover" || l === "pointerover", _ = l === "mouseout" || l === "pointerout", S && a !== fi && (q = a.relatedTarget || a.fromElement) && (La(q) || q[Xa]))
            break l;
          if ((_ || S) && (S = A.window === A ? A : (S = A.ownerDocument) ? S.defaultView || S.parentWindow : window, _ ? (q = a.relatedTarget || a.toElement, _ = g, q = q ? La(q) : null, q !== null && (fl = U(q), Q = q.tag, q !== fl || Q !== 5 && Q !== 27 && Q !== 6) && (q = null)) : (_ = null, q = g), _ !== q)) {
            if (Q = es, T = "onMouseLeave", y = "onMouseEnter", r = "mouse", (l === "pointerout" || l === "pointerover") && (Q = ns, T = "onPointerLeave", y = "onPointerEnter", r = "pointer"), fl = _ == null ? S : He(_), h = q == null ? S : He(q), S = new Q(
              T,
              r + "leave",
              _,
              a,
              A
            ), S.target = fl, S.relatedTarget = h, T = null, La(A) === g && (Q = new Q(
              y,
              r + "enter",
              q,
              a,
              A
            ), Q.target = h, Q.relatedTarget = fl, T = Q), fl = T, _ && q)
              t: {
                for (Q = Xd, y = _, r = q, h = 0, T = y; T; T = Q(T))
                  h++;
                T = 0;
                for (var G = r; G; G = Q(G))
                  T++;
                for (; 0 < h - T; )
                  y = Q(y), h--;
                for (; 0 < T - h; )
                  r = Q(r), T--;
                for (; h--; ) {
                  if (y === r || r !== null && y === r.alternate) {
                    Q = y;
                    break t;
                  }
                  y = Q(y), r = Q(r);
                }
                Q = null;
              }
            else Q = null;
            _ !== null && F0(
              z,
              S,
              _,
              Q,
              !1
            ), q !== null && fl !== null && F0(
              z,
              fl,
              q,
              Q,
              !0
            );
          }
        }
        l: {
          if (S = g ? He(g) : window, _ = S.nodeName && S.nodeName.toLowerCase(), _ === "select" || _ === "input" && S.type === "file")
            var P = ds;
          else if (rs(S))
            if (ys)
              P = Im;
            else {
              P = km;
              var x = Wm;
            }
          else
            _ = S.nodeName, !_ || _.toLowerCase() !== "input" || S.type !== "checkbox" && S.type !== "radio" ? g && ci(g.elementType) && (P = ds) : P = Fm;
          if (P && (P = P(l, g))) {
            ms(
              z,
              P,
              a,
              A
            );
            break l;
          }
          x && x(l, S, g), l === "focusout" && g && S.type === "number" && g.memoizedProps.value != null && ii(S, "number", S.value);
        }
        switch (x = g ? He(g) : window, l) {
          case "focusin":
            (rs(x) || x.contentEditable === "true") && (Fa = x, Ei = g, Xe = null);
            break;
          case "focusout":
            Xe = Ei = Fa = null;
            break;
          case "mousedown":
            Ai = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Ai = !1, As(z, a, A);
            break;
          case "selectionchange":
            if (ld) break;
          case "keydown":
          case "keyup":
            As(z, a, A);
        }
        var K;
        if (gi)
          l: {
            switch (l) {
              case "compositionstart":
                var F = "onCompositionStart";
                break l;
              case "compositionend":
                F = "onCompositionEnd";
                break l;
              case "compositionupdate":
                F = "onCompositionUpdate";
                break l;
            }
            F = void 0;
          }
        else
          ka ? ss(l, a) && (F = "onCompositionEnd") : l === "keydown" && a.keyCode === 229 && (F = "onCompositionStart");
        F && (is && a.locale !== "ko" && (ka || F !== "onCompositionStart" ? F === "onCompositionEnd" && ka && (K = ts()) : (It = A, mi = "value" in It ? It.value : It.textContent, ka = !0)), x = Dn(g, F), 0 < x.length && (F = new us(
          F,
          l,
          null,
          a,
          A
        ), z.push({ event: F, listeners: x }), K ? F.data = K : (K = os(a), K !== null && (F.data = K)))), (K = Vm ? Km(l, a) : Jm(l, a)) && (F = Dn(g, "onBeforeInput"), 0 < F.length && (x = new us(
          "onBeforeInput",
          "beforeinput",
          null,
          a,
          A
        ), z.push({
          event: x,
          listeners: F
        }), x.data = K)), xd(
          z,
          l,
          g,
          a,
          A
        );
      }
      W0(z, t);
    });
  }
  function mu(l, t, a) {
    return {
      instance: l,
      listener: t,
      currentTarget: a
    };
  }
  function Dn(l, t) {
    for (var a = t + "Capture", e = []; l !== null; ) {
      var u = l, n = u.stateNode;
      if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || n === null || (u = Ce(l, a), u != null && e.unshift(
        mu(l, u, n)
      ), u = Ce(l, t), u != null && e.push(
        mu(l, u, n)
      )), l.tag === 3) return e;
      l = l.return;
    }
    return [];
  }
  function Xd(l) {
    if (l === null) return null;
    do
      l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function F0(l, t, a, e, u) {
    for (var n = t._reactName, i = []; a !== null && a !== e; ) {
      var c = a, o = c.alternate, g = c.stateNode;
      if (c = c.tag, o !== null && o === e) break;
      c !== 5 && c !== 26 && c !== 27 || g === null || (o = g, u ? (g = Ce(a, n), g != null && i.unshift(
        mu(a, g, o)
      )) : u || (g = Ce(a, n), g != null && i.push(
        mu(a, g, o)
      ))), a = a.return;
    }
    i.length !== 0 && l.push({ event: t, listeners: i });
  }
  var Ld = /\r\n?/g, Zd = /\u0000|\uFFFD/g;
  function I0(l) {
    return (typeof l == "string" ? l : "" + l).replace(Ld, `
`).replace(Zd, "");
  }
  function P0(l, t) {
    return t = I0(t), I0(l) === t;
  }
  function cl(l, t, a, e, u, n) {
    switch (a) {
      case "children":
        typeof e == "string" ? t === "body" || t === "textarea" && e === "" || wa(l, e) : (typeof e == "number" || typeof e == "bigint") && t !== "body" && wa(l, "" + e);
        break;
      case "className":
        Ru(l, "class", e);
        break;
      case "tabIndex":
        Ru(l, "tabindex", e);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ru(l, a, e);
        break;
      case "style":
        If(l, e, n);
        break;
      case "data":
        if (t !== "object") {
          Ru(l, "data", e);
          break;
        }
      case "src":
      case "href":
        if (e === "" && (t !== "a" || a !== "href")) {
          l.removeAttribute(a);
          break;
        }
        if (e == null || typeof e == "function" || typeof e == "symbol" || typeof e == "boolean") {
          l.removeAttribute(a);
          break;
        }
        e = Cu("" + e), l.setAttribute(a, e);
        break;
      case "action":
      case "formAction":
        if (typeof e == "function") {
          l.setAttribute(
            a,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof n == "function" && (a === "formAction" ? (t !== "input" && cl(l, t, "name", u.name, u, null), cl(
            l,
            t,
            "formEncType",
            u.formEncType,
            u,
            null
          ), cl(
            l,
            t,
            "formMethod",
            u.formMethod,
            u,
            null
          ), cl(
            l,
            t,
            "formTarget",
            u.formTarget,
            u,
            null
          )) : (cl(l, t, "encType", u.encType, u, null), cl(l, t, "method", u.method, u, null), cl(l, t, "target", u.target, u, null)));
        if (e == null || typeof e == "symbol" || typeof e == "boolean") {
          l.removeAttribute(a);
          break;
        }
        e = Cu("" + e), l.setAttribute(a, e);
        break;
      case "onClick":
        e != null && (l.onclick = Ct);
        break;
      case "onScroll":
        e != null && W("scroll", l);
        break;
      case "onScrollEnd":
        e != null && W("scrollend", l);
        break;
      case "dangerouslySetInnerHTML":
        if (e != null) {
          if (typeof e != "object" || !("__html" in e))
            throw Error(f(61));
          if (a = e.__html, a != null) {
            if (u.children != null) throw Error(f(60));
            l.innerHTML = a;
          }
        }
        break;
      case "multiple":
        l.multiple = e && typeof e != "function" && typeof e != "symbol";
        break;
      case "muted":
        l.muted = e && typeof e != "function" && typeof e != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (e == null || typeof e == "function" || typeof e == "boolean" || typeof e == "symbol") {
          l.removeAttribute("xlink:href");
          break;
        }
        a = Cu("" + e), l.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          a
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        e != null && typeof e != "function" && typeof e != "symbol" ? l.setAttribute(a, "" + e) : l.removeAttribute(a);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        e && typeof e != "function" && typeof e != "symbol" ? l.setAttribute(a, "") : l.removeAttribute(a);
        break;
      case "capture":
      case "download":
        e === !0 ? l.setAttribute(a, "") : e !== !1 && e != null && typeof e != "function" && typeof e != "symbol" ? l.setAttribute(a, e) : l.removeAttribute(a);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        e != null && typeof e != "function" && typeof e != "symbol" && !isNaN(e) && 1 <= e ? l.setAttribute(a, e) : l.removeAttribute(a);
        break;
      case "rowSpan":
      case "start":
        e == null || typeof e == "function" || typeof e == "symbol" || isNaN(e) ? l.removeAttribute(a) : l.setAttribute(a, e);
        break;
      case "popover":
        W("beforetoggle", l), W("toggle", l), Nu(l, "popover", e);
        break;
      case "xlinkActuate":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          e
        );
        break;
      case "xlinkArcrole":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          e
        );
        break;
      case "xlinkRole":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          e
        );
        break;
      case "xlinkShow":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          e
        );
        break;
      case "xlinkTitle":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          e
        );
        break;
      case "xlinkType":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          e
        );
        break;
      case "xmlBase":
        Ht(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          e
        );
        break;
      case "xmlLang":
        Ht(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          e
        );
        break;
      case "xmlSpace":
        Ht(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          e
        );
        break;
      case "is":
        Nu(l, "is", e);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = gm.get(a) || a, Nu(l, a, e));
    }
  }
  function wc(l, t, a, e, u, n) {
    switch (a) {
      case "style":
        If(l, e, n);
        break;
      case "dangerouslySetInnerHTML":
        if (e != null) {
          if (typeof e != "object" || !("__html" in e))
            throw Error(f(61));
          if (a = e.__html, a != null) {
            if (u.children != null) throw Error(f(60));
            l.innerHTML = a;
          }
        }
        break;
      case "children":
        typeof e == "string" ? wa(l, e) : (typeof e == "number" || typeof e == "bigint") && wa(l, "" + e);
        break;
      case "onScroll":
        e != null && W("scroll", l);
        break;
      case "onScrollEnd":
        e != null && W("scrollend", l);
        break;
      case "onClick":
        e != null && (l.onclick = Ct);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!Zf.hasOwnProperty(a))
          l: {
            if (a[0] === "o" && a[1] === "n" && (u = a.endsWith("Capture"), t = a.slice(2, u ? a.length - 7 : void 0), n = l[$l] || null, n = n != null ? n[a] : null, typeof n == "function" && l.removeEventListener(t, n, u), typeof e == "function")) {
              typeof n != "function" && n !== null && (a in l ? l[a] = null : l.hasAttribute(a) && l.removeAttribute(a)), l.addEventListener(t, e, u);
              break l;
            }
            a in l ? l[a] = e : e === !0 ? l.setAttribute(a, "") : Nu(l, a, e);
          }
    }
  }
  function Ll(l, t, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        W("error", l), W("load", l);
        var e = !1, u = !1, n;
        for (n in a)
          if (a.hasOwnProperty(n)) {
            var i = a[n];
            if (i != null)
              switch (n) {
                case "src":
                  e = !0;
                  break;
                case "srcSet":
                  u = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(f(137, t));
                default:
                  cl(l, t, n, i, a, null);
              }
          }
        u && cl(l, t, "srcSet", a.srcSet, a, null), e && cl(l, t, "src", a.src, a, null);
        return;
      case "input":
        W("invalid", l);
        var c = n = i = u = null, o = null, g = null;
        for (e in a)
          if (a.hasOwnProperty(e)) {
            var A = a[e];
            if (A != null)
              switch (e) {
                case "name":
                  u = A;
                  break;
                case "type":
                  i = A;
                  break;
                case "checked":
                  o = A;
                  break;
                case "defaultChecked":
                  g = A;
                  break;
                case "value":
                  n = A;
                  break;
                case "defaultValue":
                  c = A;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (A != null)
                    throw Error(f(137, t));
                  break;
                default:
                  cl(l, t, e, A, a, null);
              }
          }
        $f(
          l,
          n,
          c,
          o,
          g,
          i,
          u,
          !1
        );
        return;
      case "select":
        W("invalid", l), e = i = n = null;
        for (u in a)
          if (a.hasOwnProperty(u) && (c = a[u], c != null))
            switch (u) {
              case "value":
                n = c;
                break;
              case "defaultValue":
                i = c;
                break;
              case "multiple":
                e = c;
              default:
                cl(l, t, u, c, a, null);
            }
        t = n, a = i, l.multiple = !!e, t != null ? Ja(l, !!e, t, !1) : a != null && Ja(l, !!e, a, !0);
        return;
      case "textarea":
        W("invalid", l), n = u = e = null;
        for (i in a)
          if (a.hasOwnProperty(i) && (c = a[i], c != null))
            switch (i) {
              case "value":
                e = c;
                break;
              case "defaultValue":
                u = c;
                break;
              case "children":
                n = c;
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(f(91));
                break;
              default:
                cl(l, t, i, c, a, null);
            }
        kf(l, e, u, n);
        return;
      case "option":
        for (o in a)
          if (a.hasOwnProperty(o) && (e = a[o], e != null))
            switch (o) {
              case "selected":
                l.selected = e && typeof e != "function" && typeof e != "symbol";
                break;
              default:
                cl(l, t, o, e, a, null);
            }
        return;
      case "dialog":
        W("beforetoggle", l), W("toggle", l), W("cancel", l), W("close", l);
        break;
      case "iframe":
      case "object":
        W("load", l);
        break;
      case "video":
      case "audio":
        for (e = 0; e < ru.length; e++)
          W(ru[e], l);
        break;
      case "image":
        W("error", l), W("load", l);
        break;
      case "details":
        W("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        W("error", l), W("load", l);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (g in a)
          if (a.hasOwnProperty(g) && (e = a[g], e != null))
            switch (g) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(f(137, t));
              default:
                cl(l, t, g, e, a, null);
            }
        return;
      default:
        if (ci(t)) {
          for (A in a)
            a.hasOwnProperty(A) && (e = a[A], e !== void 0 && wc(
              l,
              t,
              A,
              e,
              a,
              void 0
            ));
          return;
        }
    }
    for (c in a)
      a.hasOwnProperty(c) && (e = a[c], e != null && cl(l, t, c, e, a, null));
  }
  function Vd(l, t, a, e) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var u = null, n = null, i = null, c = null, o = null, g = null, A = null;
        for (_ in a) {
          var z = a[_];
          if (a.hasOwnProperty(_) && z != null)
            switch (_) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                o = z;
              default:
                e.hasOwnProperty(_) || cl(l, t, _, null, e, z);
            }
        }
        for (var S in e) {
          var _ = e[S];
          if (z = a[S], e.hasOwnProperty(S) && (_ != null || z != null))
            switch (S) {
              case "type":
                n = _;
                break;
              case "name":
                u = _;
                break;
              case "checked":
                g = _;
                break;
              case "defaultChecked":
                A = _;
                break;
              case "value":
                i = _;
                break;
              case "defaultValue":
                c = _;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (_ != null)
                  throw Error(f(137, t));
                break;
              default:
                _ !== z && cl(
                  l,
                  t,
                  S,
                  _,
                  e,
                  z
                );
            }
        }
        ni(
          l,
          i,
          c,
          o,
          g,
          A,
          n,
          u
        );
        return;
      case "select":
        _ = i = c = S = null;
        for (n in a)
          if (o = a[n], a.hasOwnProperty(n) && o != null)
            switch (n) {
              case "value":
                break;
              case "multiple":
                _ = o;
              default:
                e.hasOwnProperty(n) || cl(
                  l,
                  t,
                  n,
                  null,
                  e,
                  o
                );
            }
        for (u in e)
          if (n = e[u], o = a[u], e.hasOwnProperty(u) && (n != null || o != null))
            switch (u) {
              case "value":
                S = n;
                break;
              case "defaultValue":
                c = n;
                break;
              case "multiple":
                i = n;
              default:
                n !== o && cl(
                  l,
                  t,
                  u,
                  n,
                  e,
                  o
                );
            }
        t = c, a = i, e = _, S != null ? Ja(l, !!a, S, !1) : !!e != !!a && (t != null ? Ja(l, !!a, t, !0) : Ja(l, !!a, a ? [] : "", !1));
        return;
      case "textarea":
        _ = S = null;
        for (c in a)
          if (u = a[c], a.hasOwnProperty(c) && u != null && !e.hasOwnProperty(c))
            switch (c) {
              case "value":
                break;
              case "children":
                break;
              default:
                cl(l, t, c, null, e, u);
            }
        for (i in e)
          if (u = e[i], n = a[i], e.hasOwnProperty(i) && (u != null || n != null))
            switch (i) {
              case "value":
                S = u;
                break;
              case "defaultValue":
                _ = u;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(f(91));
                break;
              default:
                u !== n && cl(l, t, i, u, e, n);
            }
        Wf(l, S, _);
        return;
      case "option":
        for (var q in a)
          if (S = a[q], a.hasOwnProperty(q) && S != null && !e.hasOwnProperty(q))
            switch (q) {
              case "selected":
                l.selected = !1;
                break;
              default:
                cl(
                  l,
                  t,
                  q,
                  null,
                  e,
                  S
                );
            }
        for (o in e)
          if (S = e[o], _ = a[o], e.hasOwnProperty(o) && S !== _ && (S != null || _ != null))
            switch (o) {
              case "selected":
                l.selected = S && typeof S != "function" && typeof S != "symbol";
                break;
              default:
                cl(
                  l,
                  t,
                  o,
                  S,
                  e,
                  _
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var Q in a)
          S = a[Q], a.hasOwnProperty(Q) && S != null && !e.hasOwnProperty(Q) && cl(l, t, Q, null, e, S);
        for (g in e)
          if (S = e[g], _ = a[g], e.hasOwnProperty(g) && S !== _ && (S != null || _ != null))
            switch (g) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (S != null)
                  throw Error(f(137, t));
                break;
              default:
                cl(
                  l,
                  t,
                  g,
                  S,
                  e,
                  _
                );
            }
        return;
      default:
        if (ci(t)) {
          for (var fl in a)
            S = a[fl], a.hasOwnProperty(fl) && S !== void 0 && !e.hasOwnProperty(fl) && wc(
              l,
              t,
              fl,
              void 0,
              e,
              S
            );
          for (A in e)
            S = e[A], _ = a[A], !e.hasOwnProperty(A) || S === _ || S === void 0 && _ === void 0 || wc(
              l,
              t,
              A,
              S,
              e,
              _
            );
          return;
        }
    }
    for (var y in a)
      S = a[y], a.hasOwnProperty(y) && S != null && !e.hasOwnProperty(y) && cl(l, t, y, null, e, S);
    for (z in e)
      S = e[z], _ = a[z], !e.hasOwnProperty(z) || S === _ || S == null && _ == null || cl(l, t, z, S, e, _);
  }
  function lr(l) {
    switch (l) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function Kd() {
    if (typeof performance.getEntriesByType == "function") {
      for (var l = 0, t = 0, a = performance.getEntriesByType("resource"), e = 0; e < a.length; e++) {
        var u = a[e], n = u.transferSize, i = u.initiatorType, c = u.duration;
        if (n && c && lr(i)) {
          for (i = 0, c = u.responseEnd, e += 1; e < a.length; e++) {
            var o = a[e], g = o.startTime;
            if (g > c) break;
            var A = o.transferSize, z = o.initiatorType;
            A && lr(z) && (o = o.responseEnd, i += A * (o < c ? 1 : (c - g) / (o - g)));
          }
          if (--e, t += 8 * (n + i) / (u.duration / 1e3), l++, 10 < l) break;
        }
      }
      if (0 < l) return t / l / 1e6;
    }
    return navigator.connection && (l = navigator.connection.downlink, typeof l == "number") ? l : 5;
  }
  var $c = null, Wc = null;
  function Un(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function tr(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function ar(l, t) {
    if (l === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return l === 1 && t === "foreignObject" ? 0 : l;
  }
  function kc(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Fc = null;
  function Jd() {
    var l = window.event;
    return l && l.type === "popstate" ? l === Fc ? !1 : (Fc = l, !0) : (Fc = null, !1);
  }
  var er = typeof setTimeout == "function" ? setTimeout : void 0, wd = typeof clearTimeout == "function" ? clearTimeout : void 0, ur = typeof Promise == "function" ? Promise : void 0, $d = typeof queueMicrotask == "function" ? queueMicrotask : typeof ur < "u" ? function(l) {
    return ur.resolve(null).then(l).catch(Wd);
  } : er;
  function Wd(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function va(l) {
    return l === "head";
  }
  function nr(l, t) {
    var a = t, e = 0;
    do {
      var u = a.nextSibling;
      if (l.removeChild(a), u && u.nodeType === 8)
        if (a = u.data, a === "/$" || a === "/&") {
          if (e === 0) {
            l.removeChild(u), Te(t);
            return;
          }
          e--;
        } else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&")
          e++;
        else if (a === "html")
          du(l.ownerDocument.documentElement);
        else if (a === "head") {
          a = l.ownerDocument.head, du(a);
          for (var n = a.firstChild; n; ) {
            var i = n.nextSibling, c = n.nodeName;
            n[Re] || c === "SCRIPT" || c === "STYLE" || c === "LINK" && n.rel.toLowerCase() === "stylesheet" || a.removeChild(n), n = i;
          }
        } else
          a === "body" && du(l.ownerDocument.body);
      a = u;
    } while (a);
    Te(t);
  }
  function ir(l, t) {
    var a = l;
    l = 0;
    do {
      var e = a.nextSibling;
      if (a.nodeType === 1 ? t ? (a._stashedDisplay = a.style.display, a.style.display = "none") : (a.style.display = a._stashedDisplay || "", a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (t ? (a._stashedText = a.nodeValue, a.nodeValue = "") : a.nodeValue = a._stashedText || ""), e && e.nodeType === 8)
        if (a = e.data, a === "/$") {
          if (l === 0) break;
          l--;
        } else
          a !== "$" && a !== "$?" && a !== "$~" && a !== "$!" || l++;
      a = e;
    } while (a);
  }
  function Ic(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var a = t;
      switch (t = t.nextSibling, a.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Ic(a), ei(a);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (a.rel.toLowerCase() === "stylesheet") continue;
      }
      l.removeChild(a);
    }
  }
  function kd(l, t, a, e) {
    for (; l.nodeType === 1; ) {
      var u = a;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!e && (l.nodeName !== "INPUT" || l.type !== "hidden"))
          break;
      } else if (e) {
        if (!l[Re])
          switch (t) {
            case "meta":
              if (!l.hasAttribute("itemprop")) break;
              return l;
            case "link":
              if (n = l.getAttribute("rel"), n === "stylesheet" && l.hasAttribute("data-precedence"))
                break;
              if (n !== u.rel || l.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || l.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || l.getAttribute("title") !== (u.title == null ? null : u.title))
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (n = l.getAttribute("src"), (n !== (u.src == null ? null : u.src) || l.getAttribute("type") !== (u.type == null ? null : u.type) || l.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && n && l.hasAttribute("async") && !l.hasAttribute("itemprop"))
                break;
              return l;
            default:
              return l;
          }
      } else if (t === "input" && l.type === "hidden") {
        var n = u.name == null ? null : "" + u.name;
        if (u.type === "hidden" && l.getAttribute("name") === n)
          return l;
      } else return l;
      if (l = bt(l.nextSibling), l === null) break;
    }
    return null;
  }
  function Fd(l, t, a) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !a || (l = bt(l.nextSibling), l === null)) return null;
    return l;
  }
  function cr(l, t) {
    for (; l.nodeType !== 8; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !t || (l = bt(l.nextSibling), l === null)) return null;
    return l;
  }
  function Pc(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function lf(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState !== "loading";
  }
  function Id(l, t) {
    var a = l.ownerDocument;
    if (l.data === "$~") l._reactRetry = t;
    else if (l.data !== "$?" || a.readyState !== "loading")
      t();
    else {
      var e = function() {
        t(), a.removeEventListener("DOMContentLoaded", e);
      };
      a.addEventListener("DOMContentLoaded", e), l._reactRetry = e;
    }
  }
  function bt(l) {
    for (; l != null; l = l.nextSibling) {
      var t = l.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = l.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return l;
  }
  var tf = null;
  function fr(l) {
    l = l.nextSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var a = l.data;
        if (a === "/$" || a === "/&") {
          if (t === 0)
            return bt(l.nextSibling);
          t--;
        } else
          a !== "$" && a !== "$!" && a !== "$?" && a !== "$~" && a !== "&" || t++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function sr(l) {
    l = l.previousSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var a = l.data;
        if (a === "$" || a === "$!" || a === "$?" || a === "$~" || a === "&") {
          if (t === 0) return l;
          t--;
        } else a !== "/$" && a !== "/&" || t++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function or(l, t, a) {
    switch (t = Un(a), l) {
      case "html":
        if (l = t.documentElement, !l) throw Error(f(452));
        return l;
      case "head":
        if (l = t.head, !l) throw Error(f(453));
        return l;
      case "body":
        if (l = t.body, !l) throw Error(f(454));
        return l;
      default:
        throw Error(f(451));
    }
  }
  function du(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    ei(l);
  }
  var Et = /* @__PURE__ */ new Map(), rr = /* @__PURE__ */ new Set();
  function Nn(l) {
    return typeof l.getRootNode == "function" ? l.getRootNode() : l.nodeType === 9 ? l : l.ownerDocument;
  }
  var Wt = R.d;
  R.d = {
    f: Pd,
    r: ly,
    D: ty,
    C: ay,
    L: ey,
    m: uy,
    X: iy,
    S: ny,
    M: cy
  };
  function Pd() {
    var l = Wt.f(), t = En();
    return l || t;
  }
  function ly(l) {
    var t = Za(l);
    t !== null && t.tag === 5 && t.type === "form" ? Do(t) : Wt.r(l);
  }
  var Ee = typeof document > "u" ? null : document;
  function mr(l, t, a) {
    var e = Ee;
    if (e && typeof t == "string" && t) {
      var u = dt(t);
      u = 'link[rel="' + l + '"][href="' + u + '"]', typeof a == "string" && (u += '[crossorigin="' + a + '"]'), rr.has(u) || (rr.add(u), l = { rel: l, crossOrigin: a, href: t }, e.querySelector(u) === null && (t = e.createElement("link"), Ll(t, "link", l), ql(t), e.head.appendChild(t)));
    }
  }
  function ty(l) {
    Wt.D(l), mr("dns-prefetch", l, null);
  }
  function ay(l, t) {
    Wt.C(l, t), mr("preconnect", l, t);
  }
  function ey(l, t, a) {
    Wt.L(l, t, a);
    var e = Ee;
    if (e && l && t) {
      var u = 'link[rel="preload"][as="' + dt(t) + '"]';
      t === "image" && a && a.imageSrcSet ? (u += '[imagesrcset="' + dt(
        a.imageSrcSet
      ) + '"]', typeof a.imageSizes == "string" && (u += '[imagesizes="' + dt(
        a.imageSizes
      ) + '"]')) : u += '[href="' + dt(l) + '"]';
      var n = u;
      switch (t) {
        case "style":
          n = Ae(l);
          break;
        case "script":
          n = pe(l);
      }
      Et.has(n) || (l = D(
        {
          rel: "preload",
          href: t === "image" && a && a.imageSrcSet ? void 0 : l,
          as: t
        },
        a
      ), Et.set(n, l), e.querySelector(u) !== null || t === "style" && e.querySelector(yu(n)) || t === "script" && e.querySelector(vu(n)) || (t = e.createElement("link"), Ll(t, "link", l), ql(t), e.head.appendChild(t)));
    }
  }
  function uy(l, t) {
    Wt.m(l, t);
    var a = Ee;
    if (a && l) {
      var e = t && typeof t.as == "string" ? t.as : "script", u = 'link[rel="modulepreload"][as="' + dt(e) + '"][href="' + dt(l) + '"]', n = u;
      switch (e) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = pe(l);
      }
      if (!Et.has(n) && (l = D({ rel: "modulepreload", href: l }, t), Et.set(n, l), a.querySelector(u) === null)) {
        switch (e) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (a.querySelector(vu(n)))
              return;
        }
        e = a.createElement("link"), Ll(e, "link", l), ql(e), a.head.appendChild(e);
      }
    }
  }
  function ny(l, t, a) {
    Wt.S(l, t, a);
    var e = Ee;
    if (e && l) {
      var u = Va(e).hoistableStyles, n = Ae(l);
      t = t || "default";
      var i = u.get(n);
      if (!i) {
        var c = { loading: 0, preload: null };
        if (i = e.querySelector(
          yu(n)
        ))
          c.loading = 5;
        else {
          l = D(
            { rel: "stylesheet", href: l, "data-precedence": t },
            a
          ), (a = Et.get(n)) && af(l, a);
          var o = i = e.createElement("link");
          ql(o), Ll(o, "link", l), o._p = new Promise(function(g, A) {
            o.onload = g, o.onerror = A;
          }), o.addEventListener("load", function() {
            c.loading |= 1;
          }), o.addEventListener("error", function() {
            c.loading |= 2;
          }), c.loading |= 4, Rn(i, t, e);
        }
        i = {
          type: "stylesheet",
          instance: i,
          count: 1,
          state: c
        }, u.set(n, i);
      }
    }
  }
  function iy(l, t) {
    Wt.X(l, t);
    var a = Ee;
    if (a && l) {
      var e = Va(a).hoistableScripts, u = pe(l), n = e.get(u);
      n || (n = a.querySelector(vu(u)), n || (l = D({ src: l, async: !0 }, t), (t = Et.get(u)) && ef(l, t), n = a.createElement("script"), ql(n), Ll(n, "link", l), a.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, e.set(u, n));
    }
  }
  function cy(l, t) {
    Wt.M(l, t);
    var a = Ee;
    if (a && l) {
      var e = Va(a).hoistableScripts, u = pe(l), n = e.get(u);
      n || (n = a.querySelector(vu(u)), n || (l = D({ src: l, async: !0, type: "module" }, t), (t = Et.get(u)) && ef(l, t), n = a.createElement("script"), ql(n), Ll(n, "link", l), a.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, e.set(u, n));
    }
  }
  function dr(l, t, a, e) {
    var u = (u = w.current) ? Nn(u) : null;
    if (!u) throw Error(f(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof a.precedence == "string" && typeof a.href == "string" ? (t = Ae(a.href), a = Va(
          u
        ).hoistableStyles, e = a.get(t), e || (e = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, e)), e) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
          l = Ae(a.href);
          var n = Va(
            u
          ).hoistableStyles, i = n.get(l);
          if (i || (u = u.ownerDocument || u, i = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, n.set(l, i), (n = u.querySelector(
            yu(l)
          )) && !n._p && (i.instance = n, i.state.loading = 5), Et.has(l) || (a = {
            rel: "preload",
            as: "style",
            href: a.href,
            crossOrigin: a.crossOrigin,
            integrity: a.integrity,
            media: a.media,
            hrefLang: a.hrefLang,
            referrerPolicy: a.referrerPolicy
          }, Et.set(l, a), n || fy(
            u,
            l,
            a,
            i.state
          ))), t && e === null)
            throw Error(f(528, ""));
          return i;
        }
        if (t && e !== null)
          throw Error(f(529, ""));
        return null;
      case "script":
        return t = a.async, a = a.src, typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = pe(a), a = Va(
          u
        ).hoistableScripts, e = a.get(t), e || (e = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, e)), e) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(f(444, l));
    }
  }
  function Ae(l) {
    return 'href="' + dt(l) + '"';
  }
  function yu(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function yr(l) {
    return D({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function fy(l, t, a, e) {
    l.querySelector('link[rel="preload"][as="style"][' + t + "]") ? e.loading = 1 : (t = l.createElement("link"), e.preload = t, t.addEventListener("load", function() {
      return e.loading |= 1;
    }), t.addEventListener("error", function() {
      return e.loading |= 2;
    }), Ll(t, "link", a), ql(t), l.head.appendChild(t));
  }
  function pe(l) {
    return '[src="' + dt(l) + '"]';
  }
  function vu(l) {
    return "script[async]" + l;
  }
  function vr(l, t, a) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var e = l.querySelector(
            'style[data-href~="' + dt(a.href) + '"]'
          );
          if (e)
            return t.instance = e, ql(e), e;
          var u = D({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null
          });
          return e = (l.ownerDocument || l).createElement(
            "style"
          ), ql(e), Ll(e, "style", u), Rn(e, a.precedence, l), t.instance = e;
        case "stylesheet":
          u = Ae(a.href);
          var n = l.querySelector(
            yu(u)
          );
          if (n)
            return t.state.loading |= 4, t.instance = n, ql(n), n;
          e = yr(a), (u = Et.get(u)) && af(e, u), n = (l.ownerDocument || l).createElement("link"), ql(n);
          var i = n;
          return i._p = new Promise(function(c, o) {
            i.onload = c, i.onerror = o;
          }), Ll(n, "link", e), t.state.loading |= 4, Rn(n, a.precedence, l), t.instance = n;
        case "script":
          return n = pe(a.src), (u = l.querySelector(
            vu(n)
          )) ? (t.instance = u, ql(u), u) : (e = a, (u = Et.get(n)) && (e = D({}, a), ef(e, u)), l = l.ownerDocument || l, u = l.createElement("script"), ql(u), Ll(u, "link", e), l.head.appendChild(u), t.instance = u);
        case "void":
          return null;
        default:
          throw Error(f(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (e = t.instance, t.state.loading |= 4, Rn(e, a.precedence, l));
    return t.instance;
  }
  function Rn(l, t, a) {
    for (var e = a.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), u = e.length ? e[e.length - 1] : null, n = u, i = 0; i < e.length; i++) {
      var c = e[i];
      if (c.dataset.precedence === t) n = c;
      else if (n !== u) break;
    }
    n ? n.parentNode.insertBefore(l, n.nextSibling) : (t = a.nodeType === 9 ? a.head : a, t.insertBefore(l, t.firstChild));
  }
  function af(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  }
  function ef(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  }
  var Hn = null;
  function hr(l, t, a) {
    if (Hn === null) {
      var e = /* @__PURE__ */ new Map(), u = Hn = /* @__PURE__ */ new Map();
      u.set(a, e);
    } else
      u = Hn, e = u.get(a), e || (e = /* @__PURE__ */ new Map(), u.set(a, e));
    if (e.has(l)) return e;
    for (e.set(l, null), a = a.getElementsByTagName(l), u = 0; u < a.length; u++) {
      var n = a[u];
      if (!(n[Re] || n[Gl] || l === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
        var i = n.getAttribute(t) || "";
        i = l + i;
        var c = e.get(i);
        c ? c.push(n) : e.set(i, [n]);
      }
    }
    return e;
  }
  function gr(l, t, a) {
    l = l.ownerDocument || l, l.head.insertBefore(
      a,
      t === "title" ? l.querySelector("head > title") : null
    );
  }
  function sy(l, t, a) {
    if (a === 1 || t.itemProp != null) return !1;
    switch (l) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        switch (t.rel) {
          case "stylesheet":
            return l = t.disabled, typeof t.precedence == "string" && l == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function Sr(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function oy(l, t, a, e) {
    if (a.type === "stylesheet" && (typeof e.media != "string" || matchMedia(e.media).matches !== !1) && (a.state.loading & 4) === 0) {
      if (a.instance === null) {
        var u = Ae(e.href), n = t.querySelector(
          yu(u)
        );
        if (n) {
          t = n._p, t !== null && typeof t == "object" && typeof t.then == "function" && (l.count++, l = Cn.bind(l), t.then(l, l)), a.state.loading |= 4, a.instance = n, ql(n);
          return;
        }
        n = t.ownerDocument || t, e = yr(e), (u = Et.get(u)) && af(e, u), n = n.createElement("link"), ql(n);
        var i = n;
        i._p = new Promise(function(c, o) {
          i.onload = c, i.onerror = o;
        }), Ll(n, "link", e), a.instance = n;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(a, t), (t = a.state.preload) && (a.state.loading & 3) === 0 && (l.count++, a = Cn.bind(l), t.addEventListener("load", a), t.addEventListener("error", a));
    }
  }
  var uf = 0;
  function ry(l, t) {
    return l.stylesheets && l.count === 0 && qn(l, l.stylesheets), 0 < l.count || 0 < l.imgCount ? function(a) {
      var e = setTimeout(function() {
        if (l.stylesheets && qn(l, l.stylesheets), l.unsuspend) {
          var n = l.unsuspend;
          l.unsuspend = null, n();
        }
      }, 6e4 + t);
      0 < l.imgBytes && uf === 0 && (uf = 62500 * Kd());
      var u = setTimeout(
        function() {
          if (l.waitingForImages = !1, l.count === 0 && (l.stylesheets && qn(l, l.stylesheets), l.unsuspend)) {
            var n = l.unsuspend;
            l.unsuspend = null, n();
          }
        },
        (l.imgBytes > uf ? 50 : 800) + t
      );
      return l.unsuspend = a, function() {
        l.unsuspend = null, clearTimeout(e), clearTimeout(u);
      };
    } : null;
  }
  function Cn() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) qn(this, this.stylesheets);
      else if (this.unsuspend) {
        var l = this.unsuspend;
        this.unsuspend = null, l();
      }
    }
  }
  var Bn = null;
  function qn(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Bn = /* @__PURE__ */ new Map(), t.forEach(my, l), Bn = null, Cn.call(l));
  }
  function my(l, t) {
    if (!(t.state.loading & 4)) {
      var a = Bn.get(l);
      if (a) var e = a.get(null);
      else {
        a = /* @__PURE__ */ new Map(), Bn.set(l, a);
        for (var u = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), n = 0; n < u.length; n++) {
          var i = u[n];
          (i.nodeName === "LINK" || i.getAttribute("media") !== "not all") && (a.set(i.dataset.precedence, i), e = i);
        }
        e && a.set(null, e);
      }
      u = t.instance, i = u.getAttribute("data-precedence"), n = a.get(i) || e, n === e && a.set(null, u), a.set(i, u), this.count++, e = Cn.bind(this), u.addEventListener("load", e), u.addEventListener("error", e), n ? n.parentNode.insertBefore(u, n.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(u, l.firstChild)), t.state.loading |= 4;
    }
  }
  var hu = {
    $$typeof: hl,
    Provider: null,
    Consumer: null,
    _currentValue: j,
    _currentValue2: j,
    _threadCount: 0
  };
  function dy(l, t, a, e, u, n, i, c, o) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Pn(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Pn(0), this.hiddenUpdates = Pn(null), this.identifierPrefix = e, this.onUncaughtError = u, this.onCaughtError = n, this.onRecoverableError = i, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = o, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function _r(l, t, a, e, u, n, i, c, o, g, A, z) {
    return l = new dy(
      l,
      t,
      a,
      i,
      o,
      g,
      A,
      z,
      c
    ), t = 1, n === !0 && (t |= 24), n = it(3, null, null, t), l.current = n, n.stateNode = l, t = xi(), t.refCount++, l.pooledCache = t, t.refCount++, n.memoizedState = {
      element: e,
      isDehydrated: a,
      cache: t
    }, Xi(n), l;
  }
  function br(l) {
    return l ? (l = le, l) : le;
  }
  function Er(l, t, a, e, u, n) {
    u = br(u), e.context === null ? e.context = u : e.pendingContext = u, e = ua(t), e.payload = { element: a }, n = n === void 0 ? null : n, n !== null && (e.callback = n), a = na(l, e, t), a !== null && (lt(a, l, t), $e(a, l, t));
  }
  function Ar(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var a = l.retryLane;
      l.retryLane = a !== 0 && a < t ? a : t;
    }
  }
  function nf(l, t) {
    Ar(l, t), (l = l.alternate) && Ar(l, t);
  }
  function pr(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = Da(l, 67108864);
      t !== null && lt(t, l, 67108864), nf(l, 67108864);
    }
  }
  function Tr(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = rt();
      t = li(t);
      var a = Da(l, t);
      a !== null && lt(a, l, t), nf(l, t);
    }
  }
  var Yn = !0;
  function yy(l, t, a, e) {
    var u = p.T;
    p.T = null;
    var n = R.p;
    try {
      R.p = 2, cf(l, t, a, e);
    } finally {
      R.p = n, p.T = u;
    }
  }
  function vy(l, t, a, e) {
    var u = p.T;
    p.T = null;
    var n = R.p;
    try {
      R.p = 8, cf(l, t, a, e);
    } finally {
      R.p = n, p.T = u;
    }
  }
  function cf(l, t, a, e) {
    if (Yn) {
      var u = ff(e);
      if (u === null)
        Jc(
          l,
          t,
          e,
          xn,
          a
        ), Or(l, e);
      else if (gy(
        u,
        l,
        t,
        a,
        e
      ))
        e.stopPropagation();
      else if (Or(l, e), t & 4 && -1 < hy.indexOf(l)) {
        for (; u !== null; ) {
          var n = Za(u);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                  var i = pa(n.pendingLanes);
                  if (i !== 0) {
                    var c = n;
                    for (c.pendingLanes |= 2, c.entangledLanes |= 2; i; ) {
                      var o = 1 << 31 - ut(i);
                      c.entanglements[1] |= o, i &= ~o;
                    }
                    Nt(n), (tl & 6) === 0 && (_n = at() + 500, ou(0));
                  }
                }
                break;
              case 31:
              case 13:
                c = Da(n, 2), c !== null && lt(c, n, 2), En(), nf(n, 2);
            }
          if (n = ff(e), n === null && Jc(
            l,
            t,
            e,
            xn,
            a
          ), n === u) break;
          u = n;
        }
        u !== null && e.stopPropagation();
      } else
        Jc(
          l,
          t,
          e,
          null,
          a
        );
    }
  }
  function ff(l) {
    return l = si(l), sf(l);
  }
  var xn = null;
  function sf(l) {
    if (xn = null, l = La(l), l !== null) {
      var t = U(l);
      if (t === null) l = null;
      else {
        var a = t.tag;
        if (a === 13) {
          if (l = H(t), l !== null) return l;
          l = null;
        } else if (a === 31) {
          if (l = B(t), l !== null) return l;
          l = null;
        } else if (a === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return xn = l, null;
  }
  function zr(l) {
    switch (l) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (tm()) {
          case Hf:
            return 2;
          case Cf:
            return 8;
          case zu:
          case am:
            return 32;
          case Bf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var of = !1, ha = null, ga = null, Sa = null, gu = /* @__PURE__ */ new Map(), Su = /* @__PURE__ */ new Map(), _a = [], hy = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Or(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        ha = null;
        break;
      case "dragenter":
      case "dragleave":
        ga = null;
        break;
      case "mouseover":
      case "mouseout":
        Sa = null;
        break;
      case "pointerover":
      case "pointerout":
        gu.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Su.delete(t.pointerId);
    }
  }
  function _u(l, t, a, e, u, n) {
    return l === null || l.nativeEvent !== n ? (l = {
      blockedOn: t,
      domEventName: a,
      eventSystemFlags: e,
      nativeEvent: n,
      targetContainers: [u]
    }, t !== null && (t = Za(t), t !== null && pr(t)), l) : (l.eventSystemFlags |= e, t = l.targetContainers, u !== null && t.indexOf(u) === -1 && t.push(u), l);
  }
  function gy(l, t, a, e, u) {
    switch (t) {
      case "focusin":
        return ha = _u(
          ha,
          l,
          t,
          a,
          e,
          u
        ), !0;
      case "dragenter":
        return ga = _u(
          ga,
          l,
          t,
          a,
          e,
          u
        ), !0;
      case "mouseover":
        return Sa = _u(
          Sa,
          l,
          t,
          a,
          e,
          u
        ), !0;
      case "pointerover":
        var n = u.pointerId;
        return gu.set(
          n,
          _u(
            gu.get(n) || null,
            l,
            t,
            a,
            e,
            u
          )
        ), !0;
      case "gotpointercapture":
        return n = u.pointerId, Su.set(
          n,
          _u(
            Su.get(n) || null,
            l,
            t,
            a,
            e,
            u
          )
        ), !0;
    }
    return !1;
  }
  function Mr(l) {
    var t = La(l.target);
    if (t !== null) {
      var a = U(t);
      if (a !== null) {
        if (t = a.tag, t === 13) {
          if (t = H(a), t !== null) {
            l.blockedOn = t, jf(l.priority, function() {
              Tr(a);
            });
            return;
          }
        } else if (t === 31) {
          if (t = B(a), t !== null) {
            l.blockedOn = t, jf(l.priority, function() {
              Tr(a);
            });
            return;
          }
        } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function Gn(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var a = ff(l.nativeEvent);
      if (a === null) {
        a = l.nativeEvent;
        var e = new a.constructor(
          a.type,
          a
        );
        fi = e, a.target.dispatchEvent(e), fi = null;
      } else
        return t = Za(a), t !== null && pr(t), l.blockedOn = a, !1;
      t.shift();
    }
    return !0;
  }
  function Dr(l, t, a) {
    Gn(l) && a.delete(t);
  }
  function Sy() {
    of = !1, ha !== null && Gn(ha) && (ha = null), ga !== null && Gn(ga) && (ga = null), Sa !== null && Gn(Sa) && (Sa = null), gu.forEach(Dr), Su.forEach(Dr);
  }
  function Qn(l, t) {
    l.blockedOn === t && (l.blockedOn = null, of || (of = !0, s.unstable_scheduleCallback(
      s.unstable_NormalPriority,
      Sy
    )));
  }
  var jn = null;
  function Ur(l) {
    jn !== l && (jn = l, s.unstable_scheduleCallback(
      s.unstable_NormalPriority,
      function() {
        jn === l && (jn = null);
        for (var t = 0; t < l.length; t += 3) {
          var a = l[t], e = l[t + 1], u = l[t + 2];
          if (typeof e != "function") {
            if (sf(e || a) === null)
              continue;
            break;
          }
          var n = Za(a);
          n !== null && (l.splice(t, 3), t -= 3, cc(
            n,
            {
              pending: !0,
              data: u,
              method: a.method,
              action: e
            },
            e,
            u
          ));
        }
      }
    ));
  }
  function Te(l) {
    function t(o) {
      return Qn(o, l);
    }
    ha !== null && Qn(ha, l), ga !== null && Qn(ga, l), Sa !== null && Qn(Sa, l), gu.forEach(t), Su.forEach(t);
    for (var a = 0; a < _a.length; a++) {
      var e = _a[a];
      e.blockedOn === l && (e.blockedOn = null);
    }
    for (; 0 < _a.length && (a = _a[0], a.blockedOn === null); )
      Mr(a), a.blockedOn === null && _a.shift();
    if (a = (l.ownerDocument || l).$$reactFormReplay, a != null)
      for (e = 0; e < a.length; e += 3) {
        var u = a[e], n = a[e + 1], i = u[$l] || null;
        if (typeof n == "function")
          i || Ur(a);
        else if (i) {
          var c = null;
          if (n && n.hasAttribute("formAction")) {
            if (u = n, i = n[$l] || null)
              c = i.formAction;
            else if (sf(u) !== null) continue;
          } else c = i.action;
          typeof c == "function" ? a[e + 1] = c : (a.splice(e, 3), e -= 3), Ur(a);
        }
      }
  }
  function Nr() {
    function l(n) {
      n.canIntercept && n.info === "react-transition" && n.intercept({
        handler: function() {
          return new Promise(function(i) {
            return u = i;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      u !== null && (u(), u = null), e || setTimeout(a, 20);
    }
    function a() {
      if (!e && !navigation.transition) {
        var n = navigation.currentEntry;
        n && n.url != null && navigation.navigate(n.url, {
          state: n.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var e = !1, u = null;
      return navigation.addEventListener("navigate", l), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(a, 100), function() {
        e = !0, navigation.removeEventListener("navigate", l), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), u !== null && (u(), u = null);
      };
    }
  }
  function rf(l) {
    this._internalRoot = l;
  }
  Xn.prototype.render = rf.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(f(409));
    var a = t.current, e = rt();
    Er(a, e, l, t, null, null);
  }, Xn.prototype.unmount = rf.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      Er(l.current, 2, null, l, null, null), En(), t[Xa] = null;
    }
  };
  function Xn(l) {
    this._internalRoot = l;
  }
  Xn.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = Qf();
      l = { blockedOn: null, target: l, priority: t };
      for (var a = 0; a < _a.length && t !== 0 && t < _a[a].priority; a++) ;
      _a.splice(a, 0, l), a === 0 && Mr(l);
    }
  };
  var Rr = d.version;
  if (Rr !== "19.2.6")
    throw Error(
      f(
        527,
        Rr,
        "19.2.6"
      )
    );
  R.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(f(188)) : (l = Object.keys(l).join(","), Error(f(268, l)));
    return l = b(t), l = l !== null ? N(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var _y = {
    bundleType: 0,
    version: "19.2.6",
    rendererPackageName: "react-dom",
    currentDispatcherRef: p,
    reconcilerVersion: "19.2.6"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ln = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ln.isDisabled && Ln.supportsFiber)
      try {
        De = Ln.inject(
          _y
        ), et = Ln;
      } catch {
      }
  }
  return Eu.createRoot = function(l, t) {
    if (!E(l)) throw Error(f(299));
    var a = !1, e = "", u = Go, n = Qo, i = jo;
    return t != null && (t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (e = t.identifierPrefix), t.onUncaughtError !== void 0 && (u = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (i = t.onRecoverableError)), t = _r(
      l,
      1,
      !1,
      null,
      null,
      a,
      e,
      null,
      u,
      n,
      i,
      Nr
    ), l[Xa] = t.current, Kc(l), new rf(t);
  }, Eu.hydrateRoot = function(l, t, a) {
    if (!E(l)) throw Error(f(299));
    var e = !1, u = "", n = Go, i = Qo, c = jo, o = null;
    return a != null && (a.unstable_strictMode === !0 && (e = !0), a.identifierPrefix !== void 0 && (u = a.identifierPrefix), a.onUncaughtError !== void 0 && (n = a.onUncaughtError), a.onCaughtError !== void 0 && (i = a.onCaughtError), a.onRecoverableError !== void 0 && (c = a.onRecoverableError), a.formState !== void 0 && (o = a.formState)), t = _r(
      l,
      1,
      !0,
      t,
      a ?? null,
      e,
      u,
      o,
      n,
      i,
      c,
      Nr
    ), t.context = br(null), a = t.current, e = rt(), e = li(e), u = ua(e), u.callback = null, na(a, u, e), a = e, t.current.lanes = a, Ne(t, a), Nt(t), l[Xa] = t.current, Kc(l), new Xn(t);
  }, Eu.version = "19.2.6", Eu;
}
var Xr;
function Ny() {
  if (Xr) return yf.exports;
  Xr = 1;
  function s() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s);
      } catch (d) {
        console.error(d);
      }
  }
  return s(), yf.exports = Uy(), yf.exports;
}
var Ev = Ny();
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ry = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Hy = (s) => s.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (d, v, f) => f ? f.toUpperCase() : v.toLowerCase()
), Lr = (s) => {
  const d = Hy(s);
  return d.charAt(0).toUpperCase() + d.slice(1);
}, wr = (...s) => s.filter((d, v, f) => !!d && d.trim() !== "" && f.indexOf(d) === v).join(" ").trim(), Cy = (s) => {
  for (const d in s)
    if (d.startsWith("aria-") || d === "role" || d === "title")
      return !0;
};
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var By = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qy = ze.forwardRef(
  ({
    color: s = "currentColor",
    size: d = 24,
    strokeWidth: v = 2,
    absoluteStrokeWidth: f,
    className: E = "",
    children: U,
    iconNode: H,
    ...B
  }, M) => ze.createElement(
    "svg",
    {
      ref: M,
      ...By,
      width: d,
      height: d,
      stroke: s,
      strokeWidth: f ? Number(v) * 24 / Number(d) : v,
      className: wr("lucide", E),
      ...!U && !Cy(B) && { "aria-hidden": "true" },
      ...B
    },
    [
      ...H.map(([b, N]) => ze.createElement(b, N)),
      ...Array.isArray(U) ? U : [U]
    ]
  )
);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zf = (s, d) => {
  const v = ze.forwardRef(
    ({ className: f, ...E }, U) => ze.createElement(qy, {
      ref: U,
      iconNode: d,
      className: wr(
        `lucide-${Ry(Lr(s))}`,
        `lucide-${s}`,
        f
      ),
      ...E
    })
  );
  return v.displayName = Lr(s), v;
};
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yy = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], Av = zf("plus", Yy);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xy = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], pv = zf("search", xy);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gy = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], Tv = zf("x", Gy), Qy = [
  "HEAD & SHOULDERS",
  "HEAD AND SHOULDERS",
  "H&S",
  "ORAL-B",
  "ORAL B",
  "OLD SPICE",
  "PANTENE",
  "REJOICE",
  "DOWNY",
  "OLAY",
  "GILLETTE",
  "SAFEGUARD",
  "VICKS",
  "ARIEL",
  "FEBREZE",
  "AMBI PUR",
  "BRAUN",
  "CREST",
  "DASH",
  "FAIRY",
  "GAIN",
  "HERBAL ESSENCES",
  "PAMPERS",
  "TIDE",
  "WHISPER",
  "LENOR",
  "JOY"
], jy = [
  { canonical: "H&S", aliases: ["เฮดแอนด์โชว์เดอร์", "เฮดแอนด์โชว์เตอร์"], maxDistance: 4 },
  { canonical: "PANTENE", aliases: ["แพนทีน"], maxDistance: 2 },
  { canonical: "REJOICE", aliases: ["รีจอยส์", "รีออยส์"], maxDistance: 2 },
  { canonical: "DOWNY", aliases: ["ดาวน์นี่"], maxDistance: 2 },
  { canonical: "OLAY", aliases: ["โอเลย์", "โอเอย์"], maxDistance: 1 },
  { canonical: "ORAL-B", aliases: ["ออรัลบี", "ออรัลบ"], maxDistance: 2 },
  { canonical: "GILLETTE", aliases: ["กิลเลตต์", "ยิลเลตต์", "ยิลเลตส์"], maxDistance: 2 },
  { canonical: "SAFEGUARD", aliases: ["เซฟการ์ด"], maxDistance: 2 },
  { canonical: "VICKS", aliases: ["วิคส์"], maxDistance: 1 },
  { canonical: "AMBI PUR", aliases: ["แอมบิเพอร์", "แอมบิเพอร์เอลเฟรชมิน"], maxDistance: 3 }
], Xy = [
  { canonical: "แชมพู", patterns: [/แชมพู/iu, /SHAMPOO/iu], aliases: [{ value: "แชมพู", maxDistance: 2 }] },
  { canonical: "ครีมนวด", patterns: [/ครีมนวด/iu, /CONDITIONER/iu], aliases: [{ value: "ครีมนวด", maxDistance: 2 }] },
  { canonical: "ผงซักฟอก", patterns: [/ผงซักฟอก/iu, /POWDER\s*DETERGENT/iu] },
  { canonical: "น้ำยาซักผ้า", patterns: [/น้ำยาซักผ้า/iu, /LIQUID\s*DETERGENT|LAUNDRY\s*LIQUID/iu] },
  { canonical: "ปรับผ้านุ่ม", patterns: [/ปรับผ้านุ่ม/iu, /FABRIC\s*SOFTENER/iu], aliases: [{ value: "ปรับผ้านุ่ม", maxDistance: 2 }] },
  { canonical: "ผลิตภัณฑ์ล้างจาน", patterns: [/ล้างจาน/iu, /DISHWASH/iu] },
  { canonical: "สบู่", patterns: [/สบู่/iu, /SOAP|BODY\s*WASH/iu], aliases: [{ value: "สบู่", maxDistance: 1 }] },
  { canonical: "ยาสีฟัน", patterns: [/ยาสีฟัน/iu, /TOOTHPASTE/iu] },
  { canonical: "แปรงสีฟัน", patterns: [/แปรงสีฟัน/iu, /TOOTHBRUSH/iu], aliases: [{ value: "แปรงสีฟัน", maxDistance: 2 }] },
  { canonical: "มีดโกน", patterns: [/มีดโกน|ใบมีดโกน|ด้ามมีด|ใบมีด/iu, /RAZOR|BLADES?/iu] },
  { canonical: "สกินแคร์", patterns: [/ครีมบ[ำํ]ารุง|เซรั่ม|มอยส์เจอไรเซอร์|โททัลไวท์|โททัลเอฟเฟ็คส์|ไวท์เรเดียนซ์/iu, /SERUM|CREAM|MOISTURI[ZS]ER|TOTAL\s*(?:WHITE|EFFECTS)/iu] },
  { canonical: "ผ้าอ้อม", patterns: [/ผ้าอ้อม/iu, /DIAPERS?/iu] },
  { canonical: "ยาอม", patterns: [/ยาอม/iu, /LOZENGES?/iu] },
  { canonical: "ยาดม", patterns: [/ยาดม/iu, /INHALER/iu] },
  { canonical: "ผลิตภัณฑ์ระงับกลิ่น", patterns: [/ระงับกลิ่น|โรลออน/iu, /DEODORANT/iu] }
], Zr = {
  ML: "มล.",
  มล: "มล.",
  "มล.": "มล.",
  บล: "มล.",
  "บล.": "มล.",
  L: "ลิตร",
  LT: "ลิตร",
  ลิตร: "ลิตร",
  G: "กรัม",
  GM: "กรัม",
  กรัม: "กรัม",
  กรับ: "กรัม",
  KG: "กก.",
  กก: "กก.",
  "กก.": "กก.",
  CM: "ซม.",
  ซม: "ซม.",
  "ซม.": "ซม.",
  ด้าม: "ด้าม",
  ใบ: "ใบ"
}, $r = ["ขวด", "ชิ้น", "ซอง", "ถุง", "กล่อง", "แพ็ค", "แพค", "ด้าม", "หลอด", "กระปุก", "ก้อน", "ชุด"], Ly = { "๐": "0", "๑": "1", "๒": "2", "๓": "3", "๔": "4", "๕": "5", "๖": "6", "๗": "7", "๘": "8", "๙": "9" };
function Wr(s) {
  return String(s || "").normalize("NFKC").replace(/[๐-๙]/g, (d) => Ly[d]).replace(/[×✕]/g, "x").replace(/\s+/g, " ").replace(/\s+([.,])/g, "$1").trim();
}
function Zy(s) {
  return s.split(/(?:เมื่อ)?\s*ซื้อ|ลด\s*\d|แถม|ฟรี/iu)[0].trim();
}
function Ml(s) {
  return s.toUpperCase().replace(/[^A-Z0-9ก-๙&]+/gu, "");
}
function Vy(s, d) {
  const v = Array.from({ length: d.length + 1 }, (f, E) => E);
  for (let f = 1; f <= s.length; f += 1) {
    const E = [f];
    for (let U = 1; U <= d.length; U += 1)
      E[U] = Math.min(
        E[U - 1] + 1,
        v[U] + 1,
        v[U - 1] + (s[f - 1] === d[U - 1] ? 0 : 1)
      );
    v.splice(0, v.length, ...E);
  }
  return v[d.length];
}
function Of(s, d, v) {
  const f = Ml(s), E = Ml(d);
  if (!f || !E) return null;
  const U = f.indexOf(E);
  if (U >= 0) return { index: U, length: E.length, raw: f.slice(U, U + E.length), distance: 0 };
  let H = null;
  const B = Math.max(1, E.length - v), M = Math.min(f.length, E.length + v);
  for (let b = B; b <= M; b += 1)
    for (let N = 0; N + b <= f.length; N += 1) {
      const D = f.slice(N, N + b), X = Vy(D, E);
      (!H || X < H.distance || X === H.distance && Math.abs(b - E.length) < Math.abs(H.length - E.length)) && (H = { index: N, length: b, raw: D, distance: X });
    }
  return H && H.distance <= v ? H : null;
}
function Ky(s) {
  var U, H;
  const d = Ml(s), v = [...Qy].sort((B, M) => M.length - B.length).find((B) => d.includes(Ml(B)));
  if (v) {
    const B = Ml(v);
    return { canonical: v === "HEAD AND SHOULDERS" || v === "HEAD & SHOULDERS" ? "H&S" : v === "ORAL B" ? "ORAL-B" : v, raw: B, index: d.indexOf(B) };
  }
  const f = jy.flatMap((B) => B.aliases.flatMap((M) => {
    const b = Of(d, M, B.maxDistance);
    return b ? [{ ...b, canonical: B.canonical }] : [];
  })).sort((B, M) => B.distance - M.distance || M.length - B.length);
  if (f.length) {
    const B = f[0], M = f.find((b) => b.canonical !== B.canonical);
    if (!M || M.distance >= B.distance + 1) return { canonical: B.canonical, raw: B.raw, index: B.index };
  }
  const E = (H = (U = s.match(/^([A-Z][A-Z0-9&' -]{1,28})(?=\s|$)/)) == null ? void 0 : U[1]) == null ? void 0 : H.trim();
  return E ? { canonical: E, raw: Ml(E), index: d.indexOf(Ml(E)) } : null;
}
function Jy(s, d, v) {
  var M;
  const f = Ml(s), E = Math.max(0, (d == null ? void 0 : d.index) || 0), U = v.index > E ? v.index : f.length, H = f.slice(E, U), B = /* @__PURE__ */ new Map();
  for (const b of Xy) {
    for (const N of b.patterns) {
      const D = s.match(N);
      if (D) {
        const X = Ml(D[0]);
        B.set(b.canonical, { canonical: b.canonical, raw: X, index: f.indexOf(X) });
        break;
      }
    }
    if (!B.has(b.canonical)) {
      const N = (M = b.aliases) == null ? void 0 : M.map((D) => Of(H, D.value, D.maxDistance)).find(Boolean);
      N && B.set(b.canonical, { canonical: b.canonical, raw: N.raw, index: N.index + E });
    }
  }
  return [...B.values()];
}
function Vr(s) {
  const d = s.toUpperCase().replace(/[.\s]/g, "");
  return Zr[d] || Zr[s] || null;
}
function wy(s) {
  const d = "(?:ML|มล\\.?|บล\\.?|L|LT|ลิตร|G|GM|กรัม|กรับ|KG|กก\\.?|CM|ซม\\.?|ด้าม|ใบ)", v = s.replace(/\s+/g, ""), f = v.match(new RegExp(`(\\d+(?:[.,]\\d+)?)([-–+])(\\d+(?:[.,]\\d+)?)(${d})`, "iu"));
  if (f && (f[2] === "+" || Number(f[1].replace(",", ".")) !== Number(f[3].replace(",", "."))))
    return { value: null, unit: Vr(f[4]), raw: f[0], index: Ml(s).indexOf(Ml(f[0])), failureReason: f[2] === "+" ? "multi_component_size" : "size_range_ambiguous" };
  const E = [...v.matchAll(new RegExp(`(\\d+(?:[.,]\\d+)?)(${d})`, "giu"))];
  if (!E.length) return { value: null, unit: null, raw: null, index: -1, failureReason: null };
  const U = E[0], H = Number(U[1].replace(",", "."));
  return {
    value: Number.isFinite(H) && H > 0 ? H : null,
    unit: Vr(U[2]),
    raw: U[0],
    index: Ml(s).indexOf(Ml(U[0])),
    failureReason: null
  };
}
function $y(s) {
  const d = [
    /(?:แพ็ค|แพค|PACK)\s*(?:ละ|X)?\s*(\d{1,3})\s*(?:ชิ้น|ขวด|ซอง|ถุง|ด้าม|หลอด)?/iu,
    /(\d{1,3})\s*(?:ชิ้น|ขวด|ซอง|ถุง|ด้าม|หลอด)\s*\/(?:แพ็ค|แพค|PACK)/iu,
    /(?:^|\s)[Xx]\s*(\d{1,3})(?:\s|$)/u
  ];
  for (const v of d) {
    const f = s.match(v), E = Number(f == null ? void 0 : f[1]);
    if (f && Number.isInteger(E) && E > 0) return { quantity: E, raw: f[0] };
  }
  return { quantity: 1, raw: null };
}
function Wy(s, d) {
  const v = $r.find((E) => new RegExp(E, "iu").test(s));
  return v ? v === "แพค" ? "แพ็ค" : v : d && {
    แชมพู: "ขวด",
    ครีมนวด: "ขวด",
    น้ำยาซักผ้า: "ขวด",
    ปรับผ้านุ่ม: "ขวด",
    สบู่: "ก้อน",
    แปรงสีฟัน: "ด้าม",
    มีดโกน: "ชิ้น",
    ยาบาล์ม: "กระปุก",
    สกินแคร์: "ชิ้น",
    ผลิตภัณฑ์ปรับอากาศ: "ชิ้น"
  }[d] || "ชิ้น";
}
function ky(s, d) {
  return !d.value || !d.unit || !s ? !0 : (s === "แชมพู" || s === "ครีมนวด") && d.unit === "มล." ? d.value >= 10 && d.value <= 2e3 : s === "ปรับผ้านุ่ม" && d.unit === "มล." ? d.value >= 10 && d.value <= 1e4 : s === "สกินแคร์" ? d.value <= 1e3 : s === "สบู่" && d.unit === "กรัม" ? d.value <= 500 : s === "ยาบาล์ม" && d.unit === "กรัม" ? d.value <= 100 : d.value <= 1e4;
}
function Kr(s) {
  let d = 2166136261;
  for (let v = 0; v < s.length; v += 1)
    d ^= s.charCodeAt(v), d = Math.imul(d, 16777619);
  return (d >>> 0).toString(36).toUpperCase().padStart(7, "0");
}
function Au(s) {
  return Wr(s).toUpperCase().replace(/[^A-Z0-9ก-๙]+/gu, " ").trim();
}
function kr(s) {
  return [
    Au(s.brand),
    Au(s.productType),
    Au(s.variant || ""),
    Number(s.sizeValue).toFixed(3),
    Au(s.sizeUnit),
    Au(s.salesUnit),
    String(s.packQuantity)
  ].join("|");
}
function Sf(s, d, v) {
  const f = Ml(s), E = Of(f, d, v);
  return E ? `${f.slice(0, E.index)}${f.slice(E.index + E.length)}` : f;
}
function Fy(s, d, v, f, E) {
  const U = Ml(s), H = (d == null ? void 0 : d.index) ?? 0, B = f.raw && f.index >= H ? f.index + Ml(f.raw).length : U.length;
  let M = U.slice(H, B);
  for (const b of [d == null ? void 0 : d.raw, v == null ? void 0 : v.raw, f.raw ? Ml(f.raw) : null, E ? Ml(E) : null].filter((N) => !!N))
    M = M.replace(b, "");
  M = Sf(M, "ทุกสูตร", 3);
  for (const b of ["กุกตู", "กุกรูส", "กุกสูต", "กุกจ", "ทุกฮูตร", "ทุกสูร", "ทุกสูดร"])
    M = Sf(M, b, 1);
  M = Sf(M, "ขนาด", 3);
  for (const b of $r) M = M.replace(Ml(b), "");
  return M = M.replace(/(?:ราคาขายปลีก|ราคาแนะนำขายปลีก|ปลีก)/giu, " "), M = M.replace(/[^A-Zก-๙]+/giu, " ").replace(/\s+/g, " ").trim(), Ml(M).length >= 3 ? M : null;
}
function zv(s) {
  const d = Zy(Wr(s)), v = d, f = Ky(v), E = wy(v), U = Jy(v, f, E);
  let H = U[0] || null;
  (f == null ? void 0 : f.canonical) === "VICKS" && E.unit === "กรัม" && (H = { canonical: "ยาบาล์ม", raw: "", index: f.index }), (f == null ? void 0 : f.canonical) === "AMBI PUR" && (H = { canonical: "ผลิตภัณฑ์ปรับอากาศ", raw: "", index: f.index }), (f == null ? void 0 : f.canonical) === "OLAY" && (H = { canonical: "สกินแคร์", raw: "", index: f.index });
  const B = $y(v), M = Wy(v, (H == null ? void 0 : H.canonical) || null), b = Fy(v, f, H, E, B.raw), N = [
    ...f ? [] : ["brand_missing"],
    ...H ? [] : ["product_type_missing"],
    ...U.length > 1 ? ["multiple_product_types"] : [],
    ...E.failureReason ? [E.failureReason] : [],
    ...E.value ? [] : ["size_missing"],
    ...E.unit ? [] : ["size_unit_missing"],
    ...ky((H == null ? void 0 : H.canonical) || null, E) ? [] : ["size_out_of_range"]
  ], D = {
    brand: (f == null ? void 0 : f.canonical) || "",
    productType: (H == null ? void 0 : H.canonical) || "",
    variant: b,
    sizeValue: E.value || 0,
    sizeUnit: E.unit || "",
    salesUnit: M,
    packQuantity: B.quantity
  }, X = kr(D), _l = `SKU-${Kr(X)}`;
  return {
    id: `sku:${Kr(X)}`,
    code: _l,
    canonicalName: d || "สินค้าใหม่ที่ยังอ่านชื่อไม่ครบ",
    identityKey: X,
    identity: D,
    status: N.length ? "quarantine" : "candidate",
    evidence: d ? [d] : [],
    failureReasons: [...new Set(N)]
  };
}
function Ov(s) {
  if (s.failureReasons.length) throw new Error(`sku_evidence_incomplete:${s.failureReasons.join(",")}`);
  return { ...s, status: "active" };
}
const Zn = "DEMO-2026-01", _f = ["HFSS", "HFSM"], Iy = [
  ["Pantene", "แชมพู", "Micellar", 70, "มล.", "ขวด", 1, 18.5],
  ["H&S", "แชมพู", "Cool Menthol", 65, "มล.", "ขวด", 1, 19],
  ["Rejoice", "แชมพู", "Rich", 70, "มล.", "ขวด", 1, 17.75],
  ["Downy", "ปรับผ้านุ่ม", "Mystique", 330, "มล.", "ถุง", 1, 34],
  ["Olay", "สกินแคร์", "Total Effects", 50, "กรัม", "กระปุก", 1, 399],
  ["Oral-B", "แปรงสีฟัน", "Pro Health", 1, "ชิ้น", "ด้าม", 1, 42],
  ["Gillette", "มีดโกน", "Vector", 2, "ชิ้น", "แพ็ค", 1, 89],
  ["Safeguard", "สบู่", "Pure White", 100, "กรัม", "ชิ้น", 1, 28],
  ["Vicks", "ยาอม", "Honey Lemon", 20, "กรัม", "ซอง", 1, 25],
  ["Ariel", "ผลิตภัณฑ์ซักผ้า", "Sunrise Fresh", 700, "กรัม", "ถุง", 1, 115]
];
function Py(s, d) {
  const f = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="500"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#eef4ff"/><stop offset="1" stop-color="#fff7ed"/></linearGradient></defs><rect width="640" height="500" rx="30" fill="url(#g)"/><rect x="26" y="26" width="588" height="448" rx="24" fill="#fff" stroke="#c7d2fe" stroke-width="4"/><text x="48" y="90" font-family="Arial" font-size="28" font-weight="700" fill="#1d4ed8">${`${s} ${d}`.replace(/[&<>"']/g, "")}</text><text x="48" y="390" font-family="Arial" font-size="38" font-weight="800" fill="#059669">PROMOTION</text><text x="48" y="440" font-family="Arial" font-size="25" fill="#334155">Preview fixture</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(f)}`;
}
function lv(s, d) {
  return d && s === "HFSM" ? [{
    tierNo: 1,
    type: "free_goods",
    minQuantity: 3,
    maxQuantity: null,
    purchaseUnit: "ชิ้น",
    discountPercent: null,
    freeQuantity: 1,
    rewardUnit: "ชิ้น",
    bundlePrice: null,
    effectivePercent: 25,
    effectivePercentUsage: "display_only",
    sourceText: "ซื้อ 3 ชิ้น ฟรี 1 ชิ้น"
  }] : [
    { tierNo: 1, type: "cash_discount", minQuantity: 3, maxQuantity: 5, purchaseUnit: "ชิ้น", discountPercent: 5, freeQuantity: 0, rewardUnit: null, bundlePrice: null, effectivePercent: null, effectivePercentUsage: null, sourceText: "ซื้อ 3-5 ชิ้น ลด 5%" },
    { tierNo: 2, type: "cash_discount", minQuantity: 6, maxQuantity: null, purchaseUnit: "ชิ้น", discountPercent: 10, freeQuantity: 0, rewardUnit: null, bundlePrice: null, effectivePercent: null, effectivePercentUsage: null, sourceText: "ซื้อ 6 ชิ้น ลด 10%" }
  ];
}
function Mv(s = "published") {
  const d = [], v = [], f = [], E = [], U = [];
  return Iy.forEach((H, B) => {
    const [M, b, N, D, X, _l, Rl, vl] = H, xl = { brand: M, productType: b, variant: N, sizeValue: D, sizeUnit: X, salesUnit: _l, packQuantity: Rl }, Hl = kr(xl), Zl = `sku:demo:${B + 1}`, hl = {
      id: Zl,
      code: `SKU-DEMO-${String(B + 1).padStart(3, "0")}`,
      canonicalName: `${M} ${b} ${N} ${D} ${X}`,
      identityKey: Hl,
      identity: xl,
      status: "active",
      evidence: ["preview_fixture"],
      failureReasons: []
    }, Cl = {
      skuId: Zl,
      pdfSourcePrice: null,
      centralOverridePrice: { amount: vl, currency: "THB" },
      effectivePrice: { amount: vl, currency: "THB" },
      source: "central_override",
      sourceReference: "preview_fixture",
      updatedAt: "2026-01-01T00:00:00.000Z"
    }, Dl = `family:demo:${B + 1}`, Ul = {
      id: Dl,
      familyKey: `PF-DEMO-${String(B + 1).padStart(3, "0")}`,
      name: B < 3 ? "Hair Care 60–70 ml" : `${M} ${b}`,
      scopeText: B < 3 ? "H&S / Pantene / Rejoice 60–70 ml" : `${M} ${b}`,
      sourceRows: [B + 2],
      tiersByClass: Object.fromEntries(_f.map((sl) => [sl, lv(sl, B === 3)])),
      failureReasons: []
    }, J = `group:demo:${B + 1}`, Bl = _f.map((sl, tt) => ({
      id: `CARD-${Zn}-${sl}-P${String(B + 1).padStart(3, "0")}-C${String(tt + 1).padStart(3, "0")}`,
      monthKey: Zn,
      page: B + 1,
      sequence: tt + 1,
      classId: sl,
      imageUrl: Py(`${M} ${b} ${D} ${X}`, sl),
      skuId: Zl,
      productGroupId: J,
      promotionFamilyId: Dl,
      promotionTiers: Ul.tiersByClass[sl],
      price: Cl,
      status: "ready",
      evidence: { rawText: hl.canonicalName, productText: hl.canonicalName, pageClassText: sl, confidence: 1, method: "manual", cropBounds: null },
      failureReasons: []
    }));
    if (d.push(hl), v.push(Cl), f.push(...Bl), E.push({ id: J, monthKey: Zn, skuId: Zl, sku: hl, cardIds: Bl.map((sl) => sl.id), classIds: [..._f], promotionFamilyId: Dl, price: Cl, status: "ready", failureReasons: [] }), !U.some((sl) => sl.name === Ul.name)) U.push(Ul);
    else if (B < 3) {
      const sl = U.find((tt) => tt.name === Ul.name);
      sl && (E[E.length - 1].promotionFamilyId = sl.id, Bl.forEach((tt) => {
        tt.promotionFamilyId = sl.id;
      }));
    }
  }), {
    schema: "promo-system-rebuild-v1",
    version: {
      id: "00000000-0000-4000-8000-000000000001",
      monthKey: Zn,
      revision: 1,
      status: s,
      previousVersionId: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      createdBy: "preview-fixture",
      publishedAt: s === "published" ? "2026-01-01T00:00:00.000Z" : null,
      source: { pdfName: "preview-fixture.pdf", workbookName: "preview-fixture.xlsx", pdfHash: null, workbookHash: null }
    },
    skus: d,
    prices: v,
    cards: f,
    productGroups: E,
    promotionFamilies: U,
    warnings: ["preview_fixture_only"]
  };
}
const tv = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"], av = {
  HFSS: "HFSS",
  HFSM: "HFSM",
  HFSL: "HFSL",
  HFSXL: "HFSXL",
  "HFSWS-S": "HFSWSS",
  "HFSWS-L": "HFSWSL"
}, ev = /* @__PURE__ */ new Set(["ขวด", "ชิ้น", "แพ็ค", "กล่อง", "ลัง", "ซอง", "ถุง", "ชุด", "ด้าม"]), Oe = (s) => String(s || "").normalize("NFKC").replace(/\s+/g, " ").trim();
function uv(s) {
  const d = Oe(s).toUpperCase();
  if (/^[A-Z]{3}\d{2}$/u.test(d)) return d;
  const v = d.match(/^(?:PROMO-)?(\d{4})-(\d{2})$/u);
  if (!v) throw new Error(`legacy_month_invalid:${s}`);
  const f = Number(v[2]);
  if (f < 1 || f > 12) throw new Error(`legacy_month_invalid:${s}`);
  return `${tv[f - 1]}${v[1].slice(-2)}`;
}
function nv(s) {
  const d = Oe(s).toUpperCase(), v = av[d];
  if (!v) throw new Error(`legacy_class_invalid:${s || "missing"}`);
  return v;
}
function bf(s) {
  return Oe(s).toLowerCase().replace(/[๐-๙]/g, (d) => ({ "๐": "0", "๑": "1", "๒": "2", "๓": "3", "๔": "4", "๕": "5", "๖": "6", "๗": "7", "๘": "8", "๙": "9" })[d] || d).replace(/ราคาแนะนําขายปลีก|ราคาแนะนำขายปลีก|ทุกสูตร|ขนาด|ปกติ|เฉลี่ย|เมื่อซื้อ|บาท|ชุด/giu, "").replace(/มล\.?/giu, "ml").replace(/กรัม/giu, "g").replace(/[^a-z0-9ก-๙]/gu, "").slice(0, 240);
}
async function iv(s) {
  const d = new TextEncoder().encode(s), v = await crypto.subtle.digest("SHA-256", d);
  return [...new Uint8Array(v)].map((f) => f.toString(16).padStart(2, "0")).join("");
}
async function cv(s) {
  const d = bf(s);
  if (d.length < 5) throw new Error("legacy_master_key_too_short");
  const v = (await iv(`promo-product-master|${d}`)).slice(0, 32).split("");
  v[12] = "5", v[16] = (Number.parseInt(v[16], 16) & 3 | 8).toString(16);
  const f = v.join("");
  return `${f.slice(0, 8)}-${f.slice(8, 12)}-${f.slice(12, 16)}-${f.slice(16, 20)}-${f.slice(20)}`;
}
function Ef(s) {
  const d = Oe(s).replace("แพค", "แพ็ค");
  return ev.has(d) ? d : "ชิ้น";
}
function Af(s) {
  const d = Number(s);
  return Number.isFinite(d) ? Math.max(0, Math.min(100, d <= 1 ? d * 100 : d)) : 100;
}
function pu(s) {
  const d = Number(s);
  return Number.isFinite(d) ? Number.isInteger(d) ? String(d) : String(Math.round(d * 100) / 100) : "";
}
function fv(s) {
  if (!s.promotionTiers.length) throw new Error(`legacy_tiers_missing:${s.id}`);
  return s.promotionTiers.map((d) => {
    const v = Ef(d.purchaseUnit), f = pu(d.minQuantity);
    if (!f) throw new Error(`legacy_tier_min_invalid:${s.id}:${d.tierNo}`);
    if (d.type === "cash_discount") {
      const E = pu(d.discountPercent);
      if (!E) throw new Error(`legacy_discount_invalid:${s.id}:${d.tierNo}`);
      const U = d.maxQuantity == null ? "" : pu(d.maxQuantity);
      return U && Number(U) > Number(f) ? `${f}-${U} ${v} ลด ${E}%` : `${f} ${v} ลด ${E}%`;
    }
    if (d.type === "free_goods") {
      const E = pu(d.freeQuantity);
      if (!E) throw new Error(`legacy_free_goods_invalid:${s.id}:${d.tierNo}`);
      const U = Ef(d.rewardUnit || v), H = d.effectivePercent == null ? "" : pu(d.effectivePercent);
      return `${f} ${v} ฟรี ${E} ${U}${H ? ` (${H}%)` : ""}`;
    }
    throw new Error(`legacy_bundle_price_not_supported:${s.id}:${d.tierNo}`);
  }).join("; ");
}
async function sv(s) {
  const d = String(s.id || "").match(/^MASTER-([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/iu), v = bf(s.canonicalName || s.identityKey);
  if (d) return { id: d[1].toLowerCase(), isNew: !1, key: v };
  if (s.status !== "active" || s.failureReasons.length) throw new Error(`legacy_master_not_confirmed:${s.id}`);
  const f = Oe(s.identityKey);
  if (!f) throw new Error(`legacy_master_identity_missing:${s.id}`);
  const E = bf(`sku-identity|${f}`);
  return { id: await cv(E), isNew: !0, key: E };
}
function ov(s, d) {
  if (d) return { score: 100, margin: 100, method: "new_sku" };
  const v = Number(s.evidence.masterMatchScore), f = Number(s.evidence.masterMatchMargin), E = Oe(s.evidence.masterMatchMethod);
  if (!Number.isFinite(v) || !Number.isFinite(f) || !E)
    throw new Error(`legacy_master_match_evidence_missing:${s.id}`);
  const U = Af(v), H = Af(f);
  if (U < 34 || H < 3)
    throw new Error(`legacy_master_match_evidence_below_edge_gate:${s.id}:${U}:${H}`);
  return { score: U, margin: H, method: E };
}
async function rv(s) {
  var B, M, b;
  if (!(s != null && s.cards.length)) throw new Error("legacy_dataset_empty");
  const d = uv(s.version.monthKey), v = new Map(s.productGroups.map((N) => [N.id, N])), f = [...s.cards].sort((N, D) => N.page - D.page || N.sequence - D.sequence || N.id.localeCompare(D.id)), E = /* @__PURE__ */ new Map(), U = [], H = [];
  for (const N of f) {
    if (N.status !== "ready" || N.failureReasons.length) throw new Error(`legacy_card_not_ready:${N.id}`);
    const D = v.get(N.productGroupId || "");
    if (!D || D.status !== "ready" || D.failureReasons.length) throw new Error(`legacy_group_not_ready:${N.productGroupId || N.id}`);
    const X = nv(N.classId), _l = E.get(X) || 1;
    E.set(X, _l + 1);
    const Rl = `${X}-${String(_l).padStart(3, "0")}-p${String(N.page).padStart(2, "0")}.webp`, vl = await sv(D.sku), xl = ov(N, vl.isNew), Hl = Number(((B = N.price.effectivePrice) == null ? void 0 : B.amount) || ((M = D.price.effectivePrice) == null ? void 0 : M.amount));
    if (!(Hl > 0)) throw new Error(`legacy_price_missing:${N.id}`);
    const Zl = fv(N), hl = Ef(D.sku.identity.salesUnit || ((b = N.promotionTiers[0]) == null ? void 0 : b.purchaseUnit)), Cl = Af(N.evidence.confidence), Dl = String(N.imageUrl || "");
    if (!Dl.startsWith("data:image/") && !Dl.startsWith("http")) throw new Error(`legacy_image_invalid:${N.id}`);
    U.push({
      file_name: Rl,
      ...Dl.startsWith("data:image/") ? { data_url: Dl } : {},
      detected_function_label: Zl,
      benefit_text: Zl,
      detection_status: "auto_ok",
      detection_method: `promo_system_rebuild_${xl.method}`,
      benefit_confidence: Cl,
      price_status: "auto_ok",
      title_status: "auto_ok",
      master_status: "auto_ok",
      base_unit_price: Hl,
      unit_label: hl,
      master_product_id: vl.id,
      master_match_score: xl.score,
      master_match_margin: xl.margin,
      title_consensus_score: xl.score,
      master_is_new: vl.isNew,
      master_canonical_name: D.sku.canonicalName,
      master_normalized_key: vl.key,
      title_ocr: D.sku.canonicalName,
      price_group_support: D.cardIds.length
    }), H.push(`${d}-${X}-${String(_l).padStart(3, "0")}`);
  }
  if (new Set(H).size !== H.length) throw new Error("legacy_card_id_duplicate");
  return {
    promoMonthId: d,
    sourceFile: s.version.source.pdfName,
    workbookFile: s.version.source.workbookName,
    cards: U,
    cardIds: H
  };
}
function mv(s, d = 20) {
  const v = [];
  for (let f = 0; f < s.length; f += d) v.push(s.slice(f, f + d));
  return v;
}
const Mf = "promo-new-product-master-ready-v1";
function dv(s) {
  if (!Number.isInteger(s) || s < 1) throw new Error("product_master_empty");
  if (typeof sessionStorage > "u") return;
  const d = { count: s, loadedAt: (/* @__PURE__ */ new Date()).toISOString() };
  sessionStorage.setItem(Mf, JSON.stringify(d));
}
function Vn() {
  typeof sessionStorage > "u" || sessionStorage.removeItem(Mf);
}
function yv() {
  if (typeof sessionStorage > "u") return null;
  try {
    const s = JSON.parse(sessionStorage.getItem(Mf) || "null");
    return s && Number.isInteger(s.count) && s.count > 0 ? s : null;
  } catch {
    return null;
  }
}
function Dv() {
  const s = yv();
  if (!s) throw new Error("product_master_required_before_pdf");
  return s;
}
const pf = "promo-new-admin-session-v1", Kn = "promo-new-legacy-draft-v1", vv = "https://saodmeoilixfdqentofp.supabase.co", Jr = "sb_publishable_JThYwAl_-askk_cIaCd75w_TCWK2BTT", hv = "promo-image-upload-v2-preview";
function Df() {
  throw new Error("legacy_write_disabled_pending_atomic_revision_staging");
}
async function Jn(s, d = {}) {
  const v = new URL("/api/promo-legacy-auth", window.location.origin);
  v.searchParams.set("action", s);
  const f = await fetch(v, {
    ...d,
    headers: {
      ...d.body ? { "Content-Type": "application/json" } : {},
      ...d.headers
    }
  }), E = await f.json().catch(() => ({ ok: !1, error: `http_${f.status}` }));
  if (!f.ok || (E == null ? void 0 : E.ok) === !1) throw new Error((E == null ? void 0 : E.error) || `http_${f.status}`);
  return E;
}
async function Fr(s, d) {
  Df();
  const v = await fetch(`${vv}/functions/v1/${hv}`, {
    method: "POST",
    headers: {
      apikey: Jr,
      Authorization: `Bearer ${Jr}`,
      "Content-Type": "application/json",
      "x-promo-admin-key": d
    },
    body: JSON.stringify(s)
  }), f = await v.text();
  let E = null;
  try {
    E = f ? JSON.parse(f) : null;
  } catch {
    E = { ok: !1, error: f || `http_${v.status}` };
  }
  if (!v.ok || (E == null ? void 0 : E.ok) === !1) {
    const U = (E == null ? void 0 : E.detail) || (E == null ? void 0 : E.error) || f || `http_${v.status}`;
    throw new Error(String(U));
  }
  return E;
}
function gv(s) {
  const d = String(s || "").toUpperCase().match(/^(?:PROMO-)?(\d{4})-(\d{2})$/u);
  return d ? `${d[1]}-${d[2]}` : "";
}
function Uv() {
  try {
    return JSON.parse(sessionStorage.getItem(pf) || "null");
  } catch {
    return null;
  }
}
function Uf(s) {
  s ? sessionStorage.setItem(pf, JSON.stringify(s)) : (sessionStorage.removeItem(pf), Vn());
}
async function Nv(s, d) {
  Vn();
  const v = String(d || s || "").trim(), f = await Jn("login", {
    method: "POST",
    body: JSON.stringify({ adminKey: v })
  });
  return Uf(f.session), f.session;
}
async function Rv(s) {
  try {
    return await Jn("session", { headers: { "x-promo-admin-key": s.accessToken } }), s;
  } catch (d) {
    throw Uf(null), typeof window < "u" && window.setTimeout(() => window.location.reload(), 0), d;
  }
}
async function Hv(s) {
  try {
    await Jn("logout", { method: "POST" });
  } finally {
    Uf(null), sessionStorage.removeItem(Kn), window.location.reload();
  }
}
async function Cv(s) {
  const v = (await Jn("master-data", {
    headers: { "x-promo-admin-key": s.accessToken }
  })).data;
  if (!v || !Array.isArray(v.skus) || !Array.isArray(v.prices))
    throw Vn(), new Error("product_master_payload_invalid");
  if (!v.skus.length)
    throw Vn(), new Error("product_master_empty");
  return dv(v.skus.length), v;
}
async function Bv(s, d) {
  Df();
  const v = await rv(s), f = mv(v.cards, 20), E = [];
  for (let H = 0; H < f.length; H += 1) {
    const B = await Fr({
      action: "batch_upload",
      promo_month_id: v.promoMonthId,
      source_file: v.sourceFile,
      source_workbook: v.workbookFile,
      year_month: gv(s.version.monthKey),
      month_label: `โปรโมชัน ${v.promoMonthId}`,
      skip_existing_images: !0,
      cards: f[H]
    }, d.accessToken);
    E.push(...Array.isArray(B.card_ids) ? B.card_ids : []);
  }
  if (E.length !== v.cardIds.length || new Set(E).size !== v.cardIds.length)
    throw new Error(`legacy_upload_incomplete:${E.length}/${v.cardIds.length}`);
  const U = { promoMonthId: v.promoMonthId, cardIds: v.cardIds, savedAt: (/* @__PURE__ */ new Date()).toISOString() };
  return sessionStorage.setItem(Kn, JSON.stringify(U)), {
    ok: !0,
    data: {
      version_id: v.promoMonthId,
      revision: 1,
      status: "draft",
      uploaded_cards: v.cardIds.length,
      batches: f.length
    }
  };
}
async function qv(s, d, v, f) {
  return v;
}
async function Yv(s, d) {
  Df();
  let v = null;
  try {
    v = JSON.parse(sessionStorage.getItem(Kn) || "null");
  } catch {
    v = null;
  }
  if (!v || v.promoMonthId !== s || !v.cardIds.length) throw new Error("legacy_saved_draft_not_found");
  if (!window.confirm(`Publish ${v.promoMonthId} เป็นเดือนล่าสุดหรือไม่? ระบบเดิมจะลบข้อมูลและรูปของเดือนเก่าออกหลังตรวจครบทุกการ์ด`)) throw new Error("publish_cancelled");
  const E = await Fr({
    action: "finalize_latest",
    promo_month_id: v.promoMonthId,
    expected_cards: v.cardIds.length,
    card_ids: v.cardIds,
    confirm_latest_only: !0
  }, d.accessToken);
  return sessionStorage.removeItem(Kn), E;
}
async function xv(s = "") {
  const d = new URL("/api/promo-new", window.location.origin);
  d.searchParams.set("action", "published"), s && d.searchParams.set("month", s);
  const v = await fetch(d), f = await v.json().catch(() => ({ ok: !1, error: `http_${v.status}` }));
  if (!v.ok || (f == null ? void 0 : f.ok) === !1) throw new Error((f == null ? void 0 : f.error) || `http_${v.status}`);
  return f.data;
}
export {
  Av as P,
  bv as R,
  pv as S,
  Tv as X,
  Dv as a,
  Sv as b,
  Ev as c,
  Ov as d,
  Mv as e,
  zf as f,
  zv as g,
  Cv as h,
  xv as i,
  Ey as j,
  _v as k,
  Uv as l,
  Nv as m,
  Hv as n,
  Wr as o,
  Yv as p,
  Uf as q,
  ze as r,
  Bv as s,
  qv as u,
  Rv as v
};
