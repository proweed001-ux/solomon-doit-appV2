function n1(S) {
  return S && S.__esModule && Object.prototype.hasOwnProperty.call(S, "default") ? S.default : S;
}
var ic = { exports: {} }, be = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ro;
function f1() {
  if (ro) return be;
  ro = 1;
  var S = Symbol.for("react.transitional.element"), O = Symbol.for("react.fragment");
  function _(o, q, N) {
    var k = null;
    if (N !== void 0 && (k = "" + N), q.key !== void 0 && (k = "" + q.key), "key" in q) {
      N = {};
      for (var x in q)
        x !== "key" && (N[x] = q[x]);
    } else N = q;
    return q = N.ref, {
      $$typeof: S,
      type: o,
      key: k,
      ref: q !== void 0 ? q : null,
      props: N
    };
  }
  return be.Fragment = O, be.jsx = _, be.jsxs = _, be;
}
var bo;
function i1() {
  return bo || (bo = 1, ic.exports = f1()), ic.exports;
}
var B1 = i1(), cc = { exports: {} }, Q = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Eo;
function c1() {
  if (Eo) return Q;
  Eo = 1;
  var S = Symbol.for("react.transitional.element"), O = Symbol.for("react.portal"), _ = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), q = Symbol.for("react.profiler"), N = Symbol.for("react.consumer"), k = Symbol.for("react.context"), x = Symbol.for("react.forward_ref"), U = Symbol.for("react.suspense"), T = Symbol.for("react.memo"), L = Symbol.for("react.lazy"), B = Symbol.for("react.activity"), el = Symbol.iterator;
  function jl(y) {
    return y === null || typeof y != "object" ? null : (y = el && y[el] || y["@@iterator"], typeof y == "function" ? y : null);
  }
  var Yl = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, Ml = Object.assign, yt = {};
  function Xl(y, A, M) {
    this.props = y, this.context = A, this.refs = yt, this.updater = M || Yl;
  }
  Xl.prototype.isReactComponent = {}, Xl.prototype.setState = function(y, A) {
    if (typeof y != "object" && typeof y != "function" && y != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, y, A, "setState");
  }, Xl.prototype.forceUpdate = function(y) {
    this.updater.enqueueForceUpdate(this, y, "forceUpdate");
  };
  function Il() {
  }
  Il.prototype = Xl.prototype;
  function gl(y, A, M) {
    this.props = y, this.context = A, this.refs = yt, this.updater = M || Yl;
  }
  var Gl = gl.prototype = new Il();
  Gl.constructor = gl, Ml(Gl, Xl.prototype), Gl.isPureReactComponent = !0;
  var Ll = Array.isArray;
  function _l() {
  }
  var V = { H: null, A: null, T: null, S: null }, Dl = Object.prototype.hasOwnProperty;
  function sl(y, A, M) {
    var R = M.ref;
    return {
      $$typeof: S,
      type: y,
      key: A,
      ref: R !== void 0 ? R : null,
      props: M
    };
  }
  function Pl(y, A) {
    return sl(y.type, A, y.props);
  }
  function _t(y) {
    return typeof y == "object" && y !== null && y.$$typeof === S;
  }
  function Vl(y) {
    var A = { "=": "=0", ":": "=2" };
    return "$" + y.replace(/[=:]/g, function(M) {
      return A[M];
    });
  }
  var Ea = /\/+/g;
  function Rt(y, A) {
    return typeof y == "object" && y !== null && y.key != null ? Vl("" + y.key) : A.toString(36);
  }
  function zt(y) {
    switch (y.status) {
      case "fulfilled":
        return y.value;
      case "rejected":
        throw y.reason;
      default:
        switch (typeof y.status == "string" ? y.then(_l, _l) : (y.status = "pending", y.then(
          function(A) {
            y.status === "pending" && (y.status = "fulfilled", y.value = A);
          },
          function(A) {
            y.status === "pending" && (y.status = "rejected", y.reason = A);
          }
        )), y.status) {
          case "fulfilled":
            return y.value;
          case "rejected":
            throw y.reason;
        }
    }
    throw y;
  }
  function b(y, A, M, R, j) {
    var K = typeof y;
    (K === "undefined" || K === "boolean") && (y = null);
    var tl = !1;
    if (y === null) tl = !0;
    else
      switch (K) {
        case "bigint":
        case "string":
        case "number":
          tl = !0;
          break;
        case "object":
          switch (y.$$typeof) {
            case S:
            case O:
              tl = !0;
              break;
            case L:
              return tl = y._init, b(
                tl(y._payload),
                A,
                M,
                R,
                j
              );
          }
      }
    if (tl)
      return j = j(y), tl = R === "" ? "." + Rt(y, 0) : R, Ll(j) ? (M = "", tl != null && (M = tl.replace(Ea, "$&/") + "/"), b(j, A, M, "", function(pu) {
        return pu;
      })) : j != null && (_t(j) && (j = Pl(
        j,
        M + (j.key == null || y && y.key === j.key ? "" : ("" + j.key).replace(
          Ea,
          "$&/"
        ) + "/") + tl
      )), A.push(j)), 1;
    tl = 0;
    var Zl = R === "" ? "." : R + ":";
    if (Ll(y))
      for (var rl = 0; rl < y.length; rl++)
        R = y[rl], K = Zl + Rt(R, rl), tl += b(
          R,
          A,
          M,
          K,
          j
        );
    else if (rl = jl(y), typeof rl == "function")
      for (y = rl.call(y), rl = 0; !(R = y.next()).done; )
        R = R.value, K = Zl + Rt(R, rl++), tl += b(
          R,
          A,
          M,
          K,
          j
        );
    else if (K === "object") {
      if (typeof y.then == "function")
        return b(
          zt(y),
          A,
          M,
          R,
          j
        );
      throw A = String(y), Error(
        "Objects are not valid as a React child (found: " + (A === "[object Object]" ? "object with keys {" + Object.keys(y).join(", ") + "}" : A) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return tl;
  }
  function p(y, A, M) {
    if (y == null) return y;
    var R = [], j = 0;
    return b(y, R, "", "", function(K) {
      return A.call(M, K, j++);
    }), R;
  }
  function G(y) {
    if (y._status === -1) {
      var A = y._result;
      A = A(), A.then(
        function(M) {
          (y._status === 0 || y._status === -1) && (y._status = 1, y._result = M);
        },
        function(M) {
          (y._status === 0 || y._status === -1) && (y._status = 2, y._result = M);
        }
      ), y._status === -1 && (y._status = 0, y._result = A);
    }
    if (y._status === 1) return y._result.default;
    throw y._result;
  }
  var nl = typeof reportError == "function" ? reportError : function(y) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var A = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof y == "object" && y !== null && typeof y.message == "string" ? String(y.message) : String(y),
        error: y
      });
      if (!window.dispatchEvent(A)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", y);
      return;
    }
    console.error(y);
  }, yl = {
    map: p,
    forEach: function(y, A, M) {
      p(
        y,
        function() {
          A.apply(this, arguments);
        },
        M
      );
    },
    count: function(y) {
      var A = 0;
      return p(y, function() {
        A++;
      }), A;
    },
    toArray: function(y) {
      return p(y, function(A) {
        return A;
      }) || [];
    },
    only: function(y) {
      if (!_t(y))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return y;
    }
  };
  return Q.Activity = B, Q.Children = yl, Q.Component = Xl, Q.Fragment = _, Q.Profiler = q, Q.PureComponent = gl, Q.StrictMode = o, Q.Suspense = U, Q.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = V, Q.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(y) {
      return V.H.useMemoCache(y);
    }
  }, Q.cache = function(y) {
    return function() {
      return y.apply(null, arguments);
    };
  }, Q.cacheSignal = function() {
    return null;
  }, Q.cloneElement = function(y, A, M) {
    if (y == null)
      throw Error(
        "The argument must be a React element, but you passed " + y + "."
      );
    var R = Ml({}, y.props), j = y.key;
    if (A != null)
      for (K in A.key !== void 0 && (j = "" + A.key), A)
        !Dl.call(A, K) || K === "key" || K === "__self" || K === "__source" || K === "ref" && A.ref === void 0 || (R[K] = A[K]);
    var K = arguments.length - 2;
    if (K === 1) R.children = M;
    else if (1 < K) {
      for (var tl = Array(K), Zl = 0; Zl < K; Zl++)
        tl[Zl] = arguments[Zl + 2];
      R.children = tl;
    }
    return sl(y.type, j, R);
  }, Q.createContext = function(y) {
    return y = {
      $$typeof: k,
      _currentValue: y,
      _currentValue2: y,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, y.Provider = y, y.Consumer = {
      $$typeof: N,
      _context: y
    }, y;
  }, Q.createElement = function(y, A, M) {
    var R, j = {}, K = null;
    if (A != null)
      for (R in A.key !== void 0 && (K = "" + A.key), A)
        Dl.call(A, R) && R !== "key" && R !== "__self" && R !== "__source" && (j[R] = A[R]);
    var tl = arguments.length - 2;
    if (tl === 1) j.children = M;
    else if (1 < tl) {
      for (var Zl = Array(tl), rl = 0; rl < tl; rl++)
        Zl[rl] = arguments[rl + 2];
      j.children = Zl;
    }
    if (y && y.defaultProps)
      for (R in tl = y.defaultProps, tl)
        j[R] === void 0 && (j[R] = tl[R]);
    return sl(y, K, j);
  }, Q.createRef = function() {
    return { current: null };
  }, Q.forwardRef = function(y) {
    return { $$typeof: x, render: y };
  }, Q.isValidElement = _t, Q.lazy = function(y) {
    return {
      $$typeof: L,
      _payload: { _status: -1, _result: y },
      _init: G
    };
  }, Q.memo = function(y, A) {
    return {
      $$typeof: T,
      type: y,
      compare: A === void 0 ? null : A
    };
  }, Q.startTransition = function(y) {
    var A = V.T, M = {};
    V.T = M;
    try {
      var R = y(), j = V.S;
      j !== null && j(M, R), typeof R == "object" && R !== null && typeof R.then == "function" && R.then(_l, nl);
    } catch (K) {
      nl(K);
    } finally {
      A !== null && M.types !== null && (A.types = M.types), V.T = A;
    }
  }, Q.unstable_useCacheRefresh = function() {
    return V.H.useCacheRefresh();
  }, Q.use = function(y) {
    return V.H.use(y);
  }, Q.useActionState = function(y, A, M) {
    return V.H.useActionState(y, A, M);
  }, Q.useCallback = function(y, A) {
    return V.H.useCallback(y, A);
  }, Q.useContext = function(y) {
    return V.H.useContext(y);
  }, Q.useDebugValue = function() {
  }, Q.useDeferredValue = function(y, A) {
    return V.H.useDeferredValue(y, A);
  }, Q.useEffect = function(y, A) {
    return V.H.useEffect(y, A);
  }, Q.useEffectEvent = function(y) {
    return V.H.useEffectEvent(y);
  }, Q.useId = function() {
    return V.H.useId();
  }, Q.useImperativeHandle = function(y, A, M) {
    return V.H.useImperativeHandle(y, A, M);
  }, Q.useInsertionEffect = function(y, A) {
    return V.H.useInsertionEffect(y, A);
  }, Q.useLayoutEffect = function(y, A) {
    return V.H.useLayoutEffect(y, A);
  }, Q.useMemo = function(y, A) {
    return V.H.useMemo(y, A);
  }, Q.useOptimistic = function(y, A) {
    return V.H.useOptimistic(y, A);
  }, Q.useReducer = function(y, A, M) {
    return V.H.useReducer(y, A, M);
  }, Q.useRef = function(y) {
    return V.H.useRef(y);
  }, Q.useState = function(y) {
    return V.H.useState(y);
  }, Q.useSyncExternalStore = function(y, A, M) {
    return V.H.useSyncExternalStore(
      y,
      A,
      M
    );
  }, Q.useTransition = function() {
    return V.H.useTransition();
  }, Q.version = "19.2.6", Q;
}
var zo;
function hc() {
  return zo || (zo = 1, cc.exports = c1()), cc.exports;
}
var _u = hc();
const q1 = /* @__PURE__ */ n1(_u);
var sc = { exports: {} }, Ee = {}, yc = { exports: {} }, oc = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var To;
function s1() {
  return To || (To = 1, (function(S) {
    function O(b, p) {
      var G = b.length;
      b.push(p);
      l: for (; 0 < G; ) {
        var nl = G - 1 >>> 1, yl = b[nl];
        if (0 < q(yl, p))
          b[nl] = p, b[G] = yl, G = nl;
        else break l;
      }
    }
    function _(b) {
      return b.length === 0 ? null : b[0];
    }
    function o(b) {
      if (b.length === 0) return null;
      var p = b[0], G = b.pop();
      if (G !== p) {
        b[0] = G;
        l: for (var nl = 0, yl = b.length, y = yl >>> 1; nl < y; ) {
          var A = 2 * (nl + 1) - 1, M = b[A], R = A + 1, j = b[R];
          if (0 > q(M, G))
            R < yl && 0 > q(j, M) ? (b[nl] = j, b[R] = G, nl = R) : (b[nl] = M, b[A] = G, nl = A);
          else if (R < yl && 0 > q(j, G))
            b[nl] = j, b[R] = G, nl = R;
          else break l;
        }
      }
      return p;
    }
    function q(b, p) {
      var G = b.sortIndex - p.sortIndex;
      return G !== 0 ? G : b.id - p.id;
    }
    if (S.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var N = performance;
      S.unstable_now = function() {
        return N.now();
      };
    } else {
      var k = Date, x = k.now();
      S.unstable_now = function() {
        return k.now() - x;
      };
    }
    var U = [], T = [], L = 1, B = null, el = 3, jl = !1, Yl = !1, Ml = !1, yt = !1, Xl = typeof setTimeout == "function" ? setTimeout : null, Il = typeof clearTimeout == "function" ? clearTimeout : null, gl = typeof setImmediate < "u" ? setImmediate : null;
    function Gl(b) {
      for (var p = _(T); p !== null; ) {
        if (p.callback === null) o(T);
        else if (p.startTime <= b)
          o(T), p.sortIndex = p.expirationTime, O(U, p);
        else break;
        p = _(T);
      }
    }
    function Ll(b) {
      if (Ml = !1, Gl(b), !Yl)
        if (_(U) !== null)
          Yl = !0, _l || (_l = !0, Vl());
        else {
          var p = _(T);
          p !== null && zt(Ll, p.startTime - b);
        }
    }
    var _l = !1, V = -1, Dl = 5, sl = -1;
    function Pl() {
      return yt ? !0 : !(S.unstable_now() - sl < Dl);
    }
    function _t() {
      if (yt = !1, _l) {
        var b = S.unstable_now();
        sl = b;
        var p = !0;
        try {
          l: {
            Yl = !1, Ml && (Ml = !1, Il(V), V = -1), jl = !0;
            var G = el;
            try {
              t: {
                for (Gl(b), B = _(U); B !== null && !(B.expirationTime > b && Pl()); ) {
                  var nl = B.callback;
                  if (typeof nl == "function") {
                    B.callback = null, el = B.priorityLevel;
                    var yl = nl(
                      B.expirationTime <= b
                    );
                    if (b = S.unstable_now(), typeof yl == "function") {
                      B.callback = yl, Gl(b), p = !0;
                      break t;
                    }
                    B === _(U) && o(U), Gl(b);
                  } else o(U);
                  B = _(U);
                }
                if (B !== null) p = !0;
                else {
                  var y = _(T);
                  y !== null && zt(
                    Ll,
                    y.startTime - b
                  ), p = !1;
                }
              }
              break l;
            } finally {
              B = null, el = G, jl = !1;
            }
            p = void 0;
          }
        } finally {
          p ? Vl() : _l = !1;
        }
      }
    }
    var Vl;
    if (typeof gl == "function")
      Vl = function() {
        gl(_t);
      };
    else if (typeof MessageChannel < "u") {
      var Ea = new MessageChannel(), Rt = Ea.port2;
      Ea.port1.onmessage = _t, Vl = function() {
        Rt.postMessage(null);
      };
    } else
      Vl = function() {
        Xl(_t, 0);
      };
    function zt(b, p) {
      V = Xl(function() {
        b(S.unstable_now());
      }, p);
    }
    S.unstable_IdlePriority = 5, S.unstable_ImmediatePriority = 1, S.unstable_LowPriority = 4, S.unstable_NormalPriority = 3, S.unstable_Profiling = null, S.unstable_UserBlockingPriority = 2, S.unstable_cancelCallback = function(b) {
      b.callback = null;
    }, S.unstable_forceFrameRate = function(b) {
      0 > b || 125 < b ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Dl = 0 < b ? Math.floor(1e3 / b) : 5;
    }, S.unstable_getCurrentPriorityLevel = function() {
      return el;
    }, S.unstable_next = function(b) {
      switch (el) {
        case 1:
        case 2:
        case 3:
          var p = 3;
          break;
        default:
          p = el;
      }
      var G = el;
      el = p;
      try {
        return b();
      } finally {
        el = G;
      }
    }, S.unstable_requestPaint = function() {
      yt = !0;
    }, S.unstable_runWithPriority = function(b, p) {
      switch (b) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          b = 3;
      }
      var G = el;
      el = b;
      try {
        return p();
      } finally {
        el = G;
      }
    }, S.unstable_scheduleCallback = function(b, p, G) {
      var nl = S.unstable_now();
      switch (typeof G == "object" && G !== null ? (G = G.delay, G = typeof G == "number" && 0 < G ? nl + G : nl) : G = nl, b) {
        case 1:
          var yl = -1;
          break;
        case 2:
          yl = 250;
          break;
        case 5:
          yl = 1073741823;
          break;
        case 4:
          yl = 1e4;
          break;
        default:
          yl = 5e3;
      }
      return yl = G + yl, b = {
        id: L++,
        callback: p,
        priorityLevel: b,
        startTime: G,
        expirationTime: yl,
        sortIndex: -1
      }, G > nl ? (b.sortIndex = G, O(T, b), _(U) === null && b === _(T) && (Ml ? (Il(V), V = -1) : Ml = !0, zt(Ll, G - nl))) : (b.sortIndex = yl, O(U, b), Yl || jl || (Yl = !0, _l || (_l = !0, Vl()))), b;
    }, S.unstable_shouldYield = Pl, S.unstable_wrapCallback = function(b) {
      var p = el;
      return function() {
        var G = el;
        el = p;
        try {
          return b.apply(this, arguments);
        } finally {
          el = G;
        }
      };
    };
  })(oc)), oc;
}
var Ao;
function y1() {
  return Ao || (Ao = 1, yc.exports = s1()), yc.exports;
}
var vc = { exports: {} }, Ql = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Oo;
function o1() {
  if (Oo) return Ql;
  Oo = 1;
  var S = hc();
  function O(U) {
    var T = "https://react.dev/errors/" + U;
    if (1 < arguments.length) {
      T += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var L = 2; L < arguments.length; L++)
        T += "&args[]=" + encodeURIComponent(arguments[L]);
    }
    return "Minified React error #" + U + "; visit " + T + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function _() {
  }
  var o = {
    d: {
      f: _,
      r: function() {
        throw Error(O(522));
      },
      D: _,
      C: _,
      L: _,
      m: _,
      X: _,
      S: _,
      M: _
    },
    p: 0,
    findDOMNode: null
  }, q = Symbol.for("react.portal");
  function N(U, T, L) {
    var B = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: q,
      key: B == null ? null : "" + B,
      children: U,
      containerInfo: T,
      implementation: L
    };
  }
  var k = S.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function x(U, T) {
    if (U === "font") return "";
    if (typeof T == "string")
      return T === "use-credentials" ? T : "";
  }
  return Ql.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Ql.createPortal = function(U, T) {
    var L = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!T || T.nodeType !== 1 && T.nodeType !== 9 && T.nodeType !== 11)
      throw Error(O(299));
    return N(U, T, null, L);
  }, Ql.flushSync = function(U) {
    var T = k.T, L = o.p;
    try {
      if (k.T = null, o.p = 2, U) return U();
    } finally {
      k.T = T, o.p = L, o.d.f();
    }
  }, Ql.preconnect = function(U, T) {
    typeof U == "string" && (T ? (T = T.crossOrigin, T = typeof T == "string" ? T === "use-credentials" ? T : "" : void 0) : T = null, o.d.C(U, T));
  }, Ql.prefetchDNS = function(U) {
    typeof U == "string" && o.d.D(U);
  }, Ql.preinit = function(U, T) {
    if (typeof U == "string" && T && typeof T.as == "string") {
      var L = T.as, B = x(L, T.crossOrigin), el = typeof T.integrity == "string" ? T.integrity : void 0, jl = typeof T.fetchPriority == "string" ? T.fetchPriority : void 0;
      L === "style" ? o.d.S(
        U,
        typeof T.precedence == "string" ? T.precedence : void 0,
        {
          crossOrigin: B,
          integrity: el,
          fetchPriority: jl
        }
      ) : L === "script" && o.d.X(U, {
        crossOrigin: B,
        integrity: el,
        fetchPriority: jl,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0
      });
    }
  }, Ql.preinitModule = function(U, T) {
    if (typeof U == "string")
      if (typeof T == "object" && T !== null) {
        if (T.as == null || T.as === "script") {
          var L = x(
            T.as,
            T.crossOrigin
          );
          o.d.M(U, {
            crossOrigin: L,
            integrity: typeof T.integrity == "string" ? T.integrity : void 0,
            nonce: typeof T.nonce == "string" ? T.nonce : void 0
          });
        }
      } else T == null && o.d.M(U);
  }, Ql.preload = function(U, T) {
    if (typeof U == "string" && typeof T == "object" && T !== null && typeof T.as == "string") {
      var L = T.as, B = x(L, T.crossOrigin);
      o.d.L(U, L, {
        crossOrigin: B,
        integrity: typeof T.integrity == "string" ? T.integrity : void 0,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0,
        type: typeof T.type == "string" ? T.type : void 0,
        fetchPriority: typeof T.fetchPriority == "string" ? T.fetchPriority : void 0,
        referrerPolicy: typeof T.referrerPolicy == "string" ? T.referrerPolicy : void 0,
        imageSrcSet: typeof T.imageSrcSet == "string" ? T.imageSrcSet : void 0,
        imageSizes: typeof T.imageSizes == "string" ? T.imageSizes : void 0,
        media: typeof T.media == "string" ? T.media : void 0
      });
    }
  }, Ql.preloadModule = function(U, T) {
    if (typeof U == "string")
      if (T) {
        var L = x(T.as, T.crossOrigin);
        o.d.m(U, {
          as: typeof T.as == "string" && T.as !== "script" ? T.as : void 0,
          crossOrigin: L,
          integrity: typeof T.integrity == "string" ? T.integrity : void 0
        });
      } else o.d.m(U);
  }, Ql.requestFormReset = function(U) {
    o.d.r(U);
  }, Ql.unstable_batchedUpdates = function(U, T) {
    return U(T);
  }, Ql.useFormState = function(U, T, L) {
    return k.H.useFormState(U, T, L);
  }, Ql.useFormStatus = function() {
    return k.H.useHostTransitionStatus();
  }, Ql.version = "19.2.6", Ql;
}
var _o;
function v1() {
  if (_o) return vc.exports;
  _o = 1;
  function S() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(S);
      } catch (O) {
        console.error(O);
      }
  }
  return S(), vc.exports = o1(), vc.exports;
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
var po;
function m1() {
  if (po) return Ee;
  po = 1;
  var S = y1(), O = hc(), _ = v1();
  function o(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var a = 2; a < arguments.length; a++)
        t += "&args[]=" + encodeURIComponent(arguments[a]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function q(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function N(l) {
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
  function k(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function x(l) {
    if (l.tag === 31) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function U(l) {
    if (N(l) !== l)
      throw Error(o(188));
  }
  function T(l) {
    var t = l.alternate;
    if (!t) {
      if (t = N(l), t === null) throw Error(o(188));
      return t !== l ? null : l;
    }
    for (var a = l, u = t; ; ) {
      var e = a.return;
      if (e === null) break;
      var n = e.alternate;
      if (n === null) {
        if (u = e.return, u !== null) {
          a = u;
          continue;
        }
        break;
      }
      if (e.child === n.child) {
        for (n = e.child; n; ) {
          if (n === a) return U(e), l;
          if (n === u) return U(e), t;
          n = n.sibling;
        }
        throw Error(o(188));
      }
      if (a.return !== u.return) a = e, u = n;
      else {
        for (var f = !1, i = e.child; i; ) {
          if (i === a) {
            f = !0, a = e, u = n;
            break;
          }
          if (i === u) {
            f = !0, u = e, a = n;
            break;
          }
          i = i.sibling;
        }
        if (!f) {
          for (i = n.child; i; ) {
            if (i === a) {
              f = !0, a = n, u = e;
              break;
            }
            if (i === u) {
              f = !0, u = n, a = e;
              break;
            }
            i = i.sibling;
          }
          if (!f) throw Error(o(189));
        }
      }
      if (a.alternate !== u) throw Error(o(190));
    }
    if (a.tag !== 3) throw Error(o(188));
    return a.stateNode.current === a ? l : t;
  }
  function L(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (t = L(l), t !== null) return t;
      l = l.sibling;
    }
    return null;
  }
  var B = Object.assign, el = Symbol.for("react.element"), jl = Symbol.for("react.transitional.element"), Yl = Symbol.for("react.portal"), Ml = Symbol.for("react.fragment"), yt = Symbol.for("react.strict_mode"), Xl = Symbol.for("react.profiler"), Il = Symbol.for("react.consumer"), gl = Symbol.for("react.context"), Gl = Symbol.for("react.forward_ref"), Ll = Symbol.for("react.suspense"), _l = Symbol.for("react.suspense_list"), V = Symbol.for("react.memo"), Dl = Symbol.for("react.lazy"), sl = Symbol.for("react.activity"), Pl = Symbol.for("react.memo_cache_sentinel"), _t = Symbol.iterator;
  function Vl(l) {
    return l === null || typeof l != "object" ? null : (l = _t && l[_t] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var Ea = Symbol.for("react.client.reference");
  function Rt(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === Ea ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case Ml:
        return "Fragment";
      case Xl:
        return "Profiler";
      case yt:
        return "StrictMode";
      case Ll:
        return "Suspense";
      case _l:
        return "SuspenseList";
      case sl:
        return "Activity";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case Yl:
          return "Portal";
        case gl:
          return l.displayName || "Context";
        case Il:
          return (l._context.displayName || "Context") + ".Consumer";
        case Gl:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case V:
          return t = l.displayName || null, t !== null ? t : Rt(l.type) || "Memo";
        case Dl:
          t = l._payload, l = l._init;
          try {
            return Rt(l(t));
          } catch {
          }
      }
    return null;
  }
  var zt = Array.isArray, b = O.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, p = _.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, G = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, nl = [], yl = -1;
  function y(l) {
    return { current: l };
  }
  function A(l) {
    0 > yl || (l.current = nl[yl], nl[yl] = null, yl--);
  }
  function M(l, t) {
    yl++, nl[yl] = l.current, l.current = t;
  }
  var R = y(null), j = y(null), K = y(null), tl = y(null);
  function Zl(l, t) {
    switch (M(K, t), M(j, l), M(R, null), t.nodeType) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? Xy(l) : 0;
        break;
      default:
        if (l = t.tagName, t = t.namespaceURI)
          t = Xy(t), l = Zy(t, l);
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
    A(R), M(R, l);
  }
  function rl() {
    A(R), A(j), A(K);
  }
  function pu(l) {
    l.memoizedState !== null && M(tl, l);
    var t = R.current, a = Zy(t, l.type);
    t !== a && (M(j, l), M(R, a));
  }
  function Te(l) {
    j.current === l && (A(R), A(j)), tl.current === l && (A(tl), he._currentValue = G);
  }
  var xn, Sc;
  function za(l) {
    if (xn === void 0)
      try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        xn = t && t[1] || "", Sc = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + xn + l + Sc;
  }
  var Ln = !1;
  function Vn(l, t) {
    if (!l || Ln) return "";
    Ln = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var u = {
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
                } catch (g) {
                  var h = g;
                }
                Reflect.construct(l, [], z);
              } else {
                try {
                  z.call();
                } catch (g) {
                  h = g;
                }
                l.call(z.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (g) {
                h = g;
              }
              (z = l()) && typeof z.catch == "function" && z.catch(function() {
              });
            }
          } catch (g) {
            if (g && h && typeof g.stack == "string")
              return [g.stack, h.stack];
          }
          return [null, null];
        }
      };
      u.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var e = Object.getOwnPropertyDescriptor(
        u.DetermineComponentFrameRoot,
        "name"
      );
      e && e.configurable && Object.defineProperty(
        u.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var n = u.DetermineComponentFrameRoot(), f = n[0], i = n[1];
      if (f && i) {
        var c = f.split(`
`), d = i.split(`
`);
        for (e = u = 0; u < c.length && !c[u].includes("DetermineComponentFrameRoot"); )
          u++;
        for (; e < d.length && !d[e].includes(
          "DetermineComponentFrameRoot"
        ); )
          e++;
        if (u === c.length || e === d.length)
          for (u = c.length - 1, e = d.length - 1; 1 <= u && 0 <= e && c[u] !== d[e]; )
            e--;
        for (; 1 <= u && 0 <= e; u--, e--)
          if (c[u] !== d[e]) {
            if (u !== 1 || e !== 1)
              do
                if (u--, e--, 0 > e || c[u] !== d[e]) {
                  var r = `
` + c[u].replace(" at new ", " at ");
                  return l.displayName && r.includes("<anonymous>") && (r = r.replace("<anonymous>", l.displayName)), r;
                }
              while (1 <= u && 0 <= e);
            break;
          }
      }
    } finally {
      Ln = !1, Error.prepareStackTrace = a;
    }
    return (a = l ? l.displayName || l.name : "") ? za(a) : "";
  }
  function Yo(l, t) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return za(l.type);
      case 16:
        return za("Lazy");
      case 13:
        return l.child !== t && t !== null ? za("Suspense Fallback") : za("Suspense");
      case 19:
        return za("SuspenseList");
      case 0:
      case 15:
        return Vn(l.type, !1);
      case 11:
        return Vn(l.type.render, !1);
      case 1:
        return Vn(l.type, !0);
      case 31:
        return za("Activity");
      default:
        return "";
    }
  }
  function gc(l) {
    try {
      var t = "", a = null;
      do
        t += Yo(l, a), a = l, l = l.return;
      while (l);
      return t;
    } catch (u) {
      return `
Error generating stack: ` + u.message + `
` + u.stack;
    }
  }
  var Kn = Object.prototype.hasOwnProperty, Jn = S.unstable_scheduleCallback, wn = S.unstable_cancelCallback, Go = S.unstable_shouldYield, Qo = S.unstable_requestPaint, lt = S.unstable_now, jo = S.unstable_getCurrentPriorityLevel, rc = S.unstable_ImmediatePriority, bc = S.unstable_UserBlockingPriority, Ae = S.unstable_NormalPriority, Xo = S.unstable_LowPriority, Ec = S.unstable_IdlePriority, Zo = S.log, xo = S.unstable_setDisableYieldValue, Mu = null, tt = null;
  function Wt(l) {
    if (typeof Zo == "function" && xo(l), tt && typeof tt.setStrictMode == "function")
      try {
        tt.setStrictMode(Mu, l);
      } catch {
      }
  }
  var at = Math.clz32 ? Math.clz32 : Ko, Lo = Math.log, Vo = Math.LN2;
  function Ko(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (Lo(l) / Vo | 0) | 0;
  }
  var Oe = 256, _e = 262144, pe = 4194304;
  function Ta(l) {
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
  function Me(l, t, a) {
    var u = l.pendingLanes;
    if (u === 0) return 0;
    var e = 0, n = l.suspendedLanes, f = l.pingedLanes;
    l = l.warmLanes;
    var i = u & 134217727;
    return i !== 0 ? (u = i & ~n, u !== 0 ? e = Ta(u) : (f &= i, f !== 0 ? e = Ta(f) : a || (a = i & ~l, a !== 0 && (e = Ta(a))))) : (i = u & ~n, i !== 0 ? e = Ta(i) : f !== 0 ? e = Ta(f) : a || (a = u & ~l, a !== 0 && (e = Ta(a)))), e === 0 ? 0 : t !== 0 && t !== e && (t & n) === 0 && (n = e & -e, a = t & -t, n >= a || n === 32 && (a & 4194048) !== 0) ? t : e;
  }
  function Du(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function Jo(l, t) {
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
  function zc() {
    var l = pe;
    return pe <<= 1, (pe & 62914560) === 0 && (pe = 4194304), l;
  }
  function $n(l) {
    for (var t = [], a = 0; 31 > a; a++) t.push(l);
    return t;
  }
  function Uu(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function wo(l, t, a, u, e, n) {
    var f = l.pendingLanes;
    l.pendingLanes = a, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= a, l.entangledLanes &= a, l.errorRecoveryDisabledLanes &= a, l.shellSuspendCounter = 0;
    var i = l.entanglements, c = l.expirationTimes, d = l.hiddenUpdates;
    for (a = f & ~a; 0 < a; ) {
      var r = 31 - at(a), z = 1 << r;
      i[r] = 0, c[r] = -1;
      var h = d[r];
      if (h !== null)
        for (d[r] = null, r = 0; r < h.length; r++) {
          var g = h[r];
          g !== null && (g.lane &= -536870913);
        }
      a &= ~z;
    }
    u !== 0 && Tc(l, u, 0), n !== 0 && e === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(f & ~t));
  }
  function Tc(l, t, a) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var u = 31 - at(t);
    l.entangledLanes |= t, l.entanglements[u] = l.entanglements[u] | 1073741824 | a & 261930;
  }
  function Ac(l, t) {
    var a = l.entangledLanes |= t;
    for (l = l.entanglements; a; ) {
      var u = 31 - at(a), e = 1 << u;
      e & t | l[u] & t && (l[u] |= t), a &= ~e;
    }
  }
  function Oc(l, t) {
    var a = t & -t;
    return a = (a & 42) !== 0 ? 1 : Wn(a), (a & (l.suspendedLanes | t)) !== 0 ? 0 : a;
  }
  function Wn(l) {
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
  function Fn(l) {
    return l &= -l, 2 < l ? 8 < l ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function _c() {
    var l = p.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : yo(l.type));
  }
  function pc(l, t) {
    var a = p.p;
    try {
      return p.p = l, t();
    } finally {
      p.p = a;
    }
  }
  var Ft = Math.random().toString(36).slice(2), Hl = "__reactFiber$" + Ft, Kl = "__reactProps$" + Ft, Za = "__reactContainer$" + Ft, kn = "__reactEvents$" + Ft, $o = "__reactListeners$" + Ft, Wo = "__reactHandles$" + Ft, Mc = "__reactResources$" + Ft, Ru = "__reactMarker$" + Ft;
  function In(l) {
    delete l[Hl], delete l[Kl], delete l[kn], delete l[$o], delete l[Wo];
  }
  function xa(l) {
    var t = l[Hl];
    if (t) return t;
    for (var a = l.parentNode; a; ) {
      if (t = a[Za] || a[Hl]) {
        if (a = t.alternate, t.child !== null || a !== null && a.child !== null)
          for (l = $y(l); l !== null; ) {
            if (a = l[Hl]) return a;
            l = $y(l);
          }
        return t;
      }
      l = a, a = l.parentNode;
    }
    return null;
  }
  function La(l) {
    if (l = l[Hl] || l[Za]) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return l;
    }
    return null;
  }
  function Hu(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(o(33));
  }
  function Va(l) {
    var t = l[Mc];
    return t || (t = l[Mc] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Ul(l) {
    l[Ru] = !0;
  }
  var Dc = /* @__PURE__ */ new Set(), Uc = {};
  function Aa(l, t) {
    Ka(l, t), Ka(l + "Capture", t);
  }
  function Ka(l, t) {
    for (Uc[l] = t, l = 0; l < t.length; l++)
      Dc.add(t[l]);
  }
  var Fo = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Rc = {}, Hc = {};
  function ko(l) {
    return Kn.call(Hc, l) ? !0 : Kn.call(Rc, l) ? !1 : Fo.test(l) ? Hc[l] = !0 : (Rc[l] = !0, !1);
  }
  function De(l, t, a) {
    if (ko(t))
      if (a === null) l.removeAttribute(t);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(t);
            return;
          case "boolean":
            var u = t.toLowerCase().slice(0, 5);
            if (u !== "data-" && u !== "aria-") {
              l.removeAttribute(t);
              return;
            }
        }
        l.setAttribute(t, "" + a);
      }
  }
  function Ue(l, t, a) {
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
  function Ht(l, t, a, u) {
    if (u === null) l.removeAttribute(a);
    else {
      switch (typeof u) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(a);
          return;
      }
      l.setAttributeNS(t, a, "" + u);
    }
  }
  function ot(l) {
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
  function Nc(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Io(l, t, a) {
    var u = Object.getOwnPropertyDescriptor(
      l.constructor.prototype,
      t
    );
    if (!l.hasOwnProperty(t) && typeof u < "u" && typeof u.get == "function" && typeof u.set == "function") {
      var e = u.get, n = u.set;
      return Object.defineProperty(l, t, {
        configurable: !0,
        get: function() {
          return e.call(this);
        },
        set: function(f) {
          a = "" + f, n.call(this, f);
        }
      }), Object.defineProperty(l, t, {
        enumerable: u.enumerable
      }), {
        getValue: function() {
          return a;
        },
        setValue: function(f) {
          a = "" + f;
        },
        stopTracking: function() {
          l._valueTracker = null, delete l[t];
        }
      };
    }
  }
  function Pn(l) {
    if (!l._valueTracker) {
      var t = Nc(l) ? "checked" : "value";
      l._valueTracker = Io(
        l,
        t,
        "" + l[t]
      );
    }
  }
  function Cc(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var a = t.getValue(), u = "";
    return l && (u = Nc(l) ? l.checked ? "true" : "false" : l.value), l = u, l !== a ? (t.setValue(l), !0) : !1;
  }
  function Re(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  var Po = /[\n"\\]/g;
  function vt(l) {
    return l.replace(
      Po,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function lf(l, t, a, u, e, n, f, i) {
    l.name = "", f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? l.type = f : l.removeAttribute("type"), t != null ? f === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + ot(t)) : l.value !== "" + ot(t) && (l.value = "" + ot(t)) : f !== "submit" && f !== "reset" || l.removeAttribute("value"), t != null ? tf(l, f, ot(t)) : a != null ? tf(l, f, ot(a)) : u != null && l.removeAttribute("value"), e == null && n != null && (l.defaultChecked = !!n), e != null && (l.checked = e && typeof e != "function" && typeof e != "symbol"), i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? l.name = "" + ot(i) : l.removeAttribute("name");
  }
  function Bc(l, t, a, u, e, n, f, i) {
    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (l.type = n), t != null || a != null) {
      if (!(n !== "submit" && n !== "reset" || t != null)) {
        Pn(l);
        return;
      }
      a = a != null ? "" + ot(a) : "", t = t != null ? "" + ot(t) : a, i || t === l.value || (l.value = t), l.defaultValue = t;
    }
    u = u ?? e, u = typeof u != "function" && typeof u != "symbol" && !!u, l.checked = i ? l.checked : !!u, l.defaultChecked = !!u, f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" && (l.name = f), Pn(l);
  }
  function tf(l, t, a) {
    t === "number" && Re(l.ownerDocument) === l || l.defaultValue === "" + a || (l.defaultValue = "" + a);
  }
  function Ja(l, t, a, u) {
    if (l = l.options, t) {
      t = {};
      for (var e = 0; e < a.length; e++)
        t["$" + a[e]] = !0;
      for (a = 0; a < l.length; a++)
        e = t.hasOwnProperty("$" + l[a].value), l[a].selected !== e && (l[a].selected = e), e && u && (l[a].defaultSelected = !0);
    } else {
      for (a = "" + ot(a), t = null, e = 0; e < l.length; e++) {
        if (l[e].value === a) {
          l[e].selected = !0, u && (l[e].defaultSelected = !0);
          return;
        }
        t !== null || l[e].disabled || (t = l[e]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function qc(l, t, a) {
    if (t != null && (t = "" + ot(t), t !== l.value && (l.value = t), a == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = a != null ? "" + ot(a) : "";
  }
  function Yc(l, t, a, u) {
    if (t == null) {
      if (u != null) {
        if (a != null) throw Error(o(92));
        if (zt(u)) {
          if (1 < u.length) throw Error(o(93));
          u = u[0];
        }
        a = u;
      }
      a == null && (a = ""), t = a;
    }
    a = ot(t), l.defaultValue = a, u = l.textContent, u === a && u !== "" && u !== null && (l.value = u), Pn(l);
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
  var lv = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Gc(l, t, a) {
    var u = t.indexOf("--") === 0;
    a == null || typeof a == "boolean" || a === "" ? u ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : u ? l.setProperty(t, a) : typeof a != "number" || a === 0 || lv.has(t) ? t === "float" ? l.cssFloat = a : l[t] = ("" + a).trim() : l[t] = a + "px";
  }
  function Qc(l, t, a) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (l = l.style, a != null) {
      for (var u in a)
        !a.hasOwnProperty(u) || t != null && t.hasOwnProperty(u) || (u.indexOf("--") === 0 ? l.setProperty(u, "") : u === "float" ? l.cssFloat = "" : l[u] = "");
      for (var e in t)
        u = t[e], t.hasOwnProperty(e) && a[e] !== u && Gc(l, e, u);
    } else
      for (var n in t)
        t.hasOwnProperty(n) && Gc(l, n, t[n]);
  }
  function af(l) {
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
  var tv = /* @__PURE__ */ new Map([
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
  ]), av = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function He(l) {
    return av.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  function Nt() {
  }
  var uf = null;
  function ef(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var $a = null, Wa = null;
  function jc(l) {
    var t = La(l);
    if (t && (l = t.stateNode)) {
      var a = l[Kl] || null;
      l: switch (l = t.stateNode, t.type) {
        case "input":
          if (lf(
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
              'input[name="' + vt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < a.length; t++) {
              var u = a[t];
              if (u !== l && u.form === l.form) {
                var e = u[Kl] || null;
                if (!e) throw Error(o(90));
                lf(
                  u,
                  e.value,
                  e.defaultValue,
                  e.defaultValue,
                  e.checked,
                  e.defaultChecked,
                  e.type,
                  e.name
                );
              }
            }
            for (t = 0; t < a.length; t++)
              u = a[t], u.form === l.form && Cc(u);
          }
          break l;
        case "textarea":
          qc(l, a.value, a.defaultValue);
          break l;
        case "select":
          t = a.value, t != null && Ja(l, !!a.multiple, t, !1);
      }
    }
  }
  var nf = !1;
  function Xc(l, t, a) {
    if (nf) return l(t, a);
    nf = !0;
    try {
      var u = l(t);
      return u;
    } finally {
      if (nf = !1, ($a !== null || Wa !== null) && (bn(), $a && (t = $a, l = Wa, Wa = $a = null, jc(t), l)))
        for (t = 0; t < l.length; t++) jc(l[t]);
    }
  }
  function Nu(l, t) {
    var a = l.stateNode;
    if (a === null) return null;
    var u = a[Kl] || null;
    if (u === null) return null;
    a = u[t];
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
        (u = !u.disabled) || (l = l.type, u = !(l === "button" || l === "input" || l === "select" || l === "textarea")), l = !u;
        break l;
      default:
        l = !1;
    }
    if (l) return null;
    if (a && typeof a != "function")
      throw Error(
        o(231, t, typeof a)
      );
    return a;
  }
  var Ct = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ff = !1;
  if (Ct)
    try {
      var Cu = {};
      Object.defineProperty(Cu, "passive", {
        get: function() {
          ff = !0;
        }
      }), window.addEventListener("test", Cu, Cu), window.removeEventListener("test", Cu, Cu);
    } catch {
      ff = !1;
    }
  var kt = null, cf = null, Ne = null;
  function Zc() {
    if (Ne) return Ne;
    var l, t = cf, a = t.length, u, e = "value" in kt ? kt.value : kt.textContent, n = e.length;
    for (l = 0; l < a && t[l] === e[l]; l++) ;
    var f = a - l;
    for (u = 1; u <= f && t[a - u] === e[n - u]; u++) ;
    return Ne = e.slice(l, 1 < u ? 1 - u : void 0);
  }
  function Ce(l) {
    var t = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function Be() {
    return !0;
  }
  function xc() {
    return !1;
  }
  function Jl(l) {
    function t(a, u, e, n, f) {
      this._reactName = a, this._targetInst = e, this.type = u, this.nativeEvent = n, this.target = f, this.currentTarget = null;
      for (var i in l)
        l.hasOwnProperty(i) && (a = l[i], this[i] = a ? a(n) : n[i]);
      return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? Be : xc, this.isPropagationStopped = xc, this;
    }
    return B(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var a = this.nativeEvent;
        a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Be);
      },
      stopPropagation: function() {
        var a = this.nativeEvent;
        a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Be);
      },
      persist: function() {
      },
      isPersistent: Be
    }), t;
  }
  var Oa = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, qe = Jl(Oa), Bu = B({}, Oa, { view: 0, detail: 0 }), uv = Jl(Bu), sf, yf, qu, Ye = B({}, Bu, {
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
    getModifierState: vf,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
      return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
    },
    movementX: function(l) {
      return "movementX" in l ? l.movementX : (l !== qu && (qu && l.type === "mousemove" ? (sf = l.screenX - qu.screenX, yf = l.screenY - qu.screenY) : yf = sf = 0, qu = l), sf);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : yf;
    }
  }), Lc = Jl(Ye), ev = B({}, Ye, { dataTransfer: 0 }), nv = Jl(ev), fv = B({}, Bu, { relatedTarget: 0 }), of = Jl(fv), iv = B({}, Oa, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), cv = Jl(iv), sv = B({}, Oa, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), yv = Jl(sv), ov = B({}, Oa, { data: 0 }), Vc = Jl(ov), vv = {
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
  }, mv = {
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
  }, dv = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function hv(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = dv[l]) ? !!t[l] : !1;
  }
  function vf() {
    return hv;
  }
  var Sv = B({}, Bu, {
    key: function(l) {
      if (l.key) {
        var t = vv[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = Ce(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? mv[l.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: vf,
    charCode: function(l) {
      return l.type === "keypress" ? Ce(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? Ce(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), gv = Jl(Sv), rv = B({}, Ye, {
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
  }), Kc = Jl(rv), bv = B({}, Bu, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: vf
  }), Ev = Jl(bv), zv = B({}, Oa, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Tv = Jl(zv), Av = B({}, Ye, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Ov = Jl(Av), _v = B({}, Oa, {
    newState: 0,
    oldState: 0
  }), pv = Jl(_v), Mv = [9, 13, 27, 32], mf = Ct && "CompositionEvent" in window, Yu = null;
  Ct && "documentMode" in document && (Yu = document.documentMode);
  var Dv = Ct && "TextEvent" in window && !Yu, Jc = Ct && (!mf || Yu && 8 < Yu && 11 >= Yu), wc = " ", $c = !1;
  function Wc(l, t) {
    switch (l) {
      case "keyup":
        return Mv.indexOf(t.keyCode) !== -1;
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
  function Fc(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var Fa = !1;
  function Uv(l, t) {
    switch (l) {
      case "compositionend":
        return Fc(t);
      case "keypress":
        return t.which !== 32 ? null : ($c = !0, wc);
      case "textInput":
        return l = t.data, l === wc && $c ? null : l;
      default:
        return null;
    }
  }
  function Rv(l, t) {
    if (Fa)
      return l === "compositionend" || !mf && Wc(l, t) ? (l = Zc(), Ne = cf = kt = null, Fa = !1, l) : null;
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
        return Jc && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Hv = {
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
  function kc(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!Hv[l.type] : t === "textarea";
  }
  function Ic(l, t, a, u) {
    $a ? Wa ? Wa.push(u) : Wa = [u] : $a = u, t = pn(t, "onChange"), 0 < t.length && (a = new qe(
      "onChange",
      "change",
      null,
      a,
      u
    ), l.push({ event: a, listeners: t }));
  }
  var Gu = null, Qu = null;
  function Nv(l) {
    By(l, 0);
  }
  function Ge(l) {
    var t = Hu(l);
    if (Cc(t)) return l;
  }
  function Pc(l, t) {
    if (l === "change") return t;
  }
  var ls = !1;
  if (Ct) {
    var df;
    if (Ct) {
      var hf = "oninput" in document;
      if (!hf) {
        var ts = document.createElement("div");
        ts.setAttribute("oninput", "return;"), hf = typeof ts.oninput == "function";
      }
      df = hf;
    } else df = !1;
    ls = df && (!document.documentMode || 9 < document.documentMode);
  }
  function as() {
    Gu && (Gu.detachEvent("onpropertychange", us), Qu = Gu = null);
  }
  function us(l) {
    if (l.propertyName === "value" && Ge(Qu)) {
      var t = [];
      Ic(
        t,
        Qu,
        l,
        ef(l)
      ), Xc(Nv, t);
    }
  }
  function Cv(l, t, a) {
    l === "focusin" ? (as(), Gu = t, Qu = a, Gu.attachEvent("onpropertychange", us)) : l === "focusout" && as();
  }
  function Bv(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return Ge(Qu);
  }
  function qv(l, t) {
    if (l === "click") return Ge(t);
  }
  function Yv(l, t) {
    if (l === "input" || l === "change")
      return Ge(t);
  }
  function Gv(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var ut = typeof Object.is == "function" ? Object.is : Gv;
  function ju(l, t) {
    if (ut(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var a = Object.keys(l), u = Object.keys(t);
    if (a.length !== u.length) return !1;
    for (u = 0; u < a.length; u++) {
      var e = a[u];
      if (!Kn.call(t, e) || !ut(l[e], t[e]))
        return !1;
    }
    return !0;
  }
  function es(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function ns(l, t) {
    var a = es(l);
    l = 0;
    for (var u; a; ) {
      if (a.nodeType === 3) {
        if (u = l + a.textContent.length, l <= t && u >= t)
          return { node: a, offset: t - l };
        l = u;
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
      a = es(a);
    }
  }
  function fs(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? fs(l, t.parentNode) : "contains" in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function is(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var t = Re(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var a = typeof t.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) l = t.contentWindow;
      else break;
      t = Re(l.document);
    }
    return t;
  }
  function Sf(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true");
  }
  var Qv = Ct && "documentMode" in document && 11 >= document.documentMode, ka = null, gf = null, Xu = null, rf = !1;
  function cs(l, t, a) {
    var u = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    rf || ka == null || ka !== Re(u) || (u = ka, "selectionStart" in u && Sf(u) ? u = { start: u.selectionStart, end: u.selectionEnd } : (u = (u.ownerDocument && u.ownerDocument.defaultView || window).getSelection(), u = {
      anchorNode: u.anchorNode,
      anchorOffset: u.anchorOffset,
      focusNode: u.focusNode,
      focusOffset: u.focusOffset
    }), Xu && ju(Xu, u) || (Xu = u, u = pn(gf, "onSelect"), 0 < u.length && (t = new qe(
      "onSelect",
      "select",
      null,
      t,
      a
    ), l.push({ event: t, listeners: u }), t.target = ka)));
  }
  function _a(l, t) {
    var a = {};
    return a[l.toLowerCase()] = t.toLowerCase(), a["Webkit" + l] = "webkit" + t, a["Moz" + l] = "moz" + t, a;
  }
  var Ia = {
    animationend: _a("Animation", "AnimationEnd"),
    animationiteration: _a("Animation", "AnimationIteration"),
    animationstart: _a("Animation", "AnimationStart"),
    transitionrun: _a("Transition", "TransitionRun"),
    transitionstart: _a("Transition", "TransitionStart"),
    transitioncancel: _a("Transition", "TransitionCancel"),
    transitionend: _a("Transition", "TransitionEnd")
  }, bf = {}, ss = {};
  Ct && (ss = document.createElement("div").style, "AnimationEvent" in window || (delete Ia.animationend.animation, delete Ia.animationiteration.animation, delete Ia.animationstart.animation), "TransitionEvent" in window || delete Ia.transitionend.transition);
  function pa(l) {
    if (bf[l]) return bf[l];
    if (!Ia[l]) return l;
    var t = Ia[l], a;
    for (a in t)
      if (t.hasOwnProperty(a) && a in ss)
        return bf[l] = t[a];
    return l;
  }
  var ys = pa("animationend"), os = pa("animationiteration"), vs = pa("animationstart"), jv = pa("transitionrun"), Xv = pa("transitionstart"), Zv = pa("transitioncancel"), ms = pa("transitionend"), ds = /* @__PURE__ */ new Map(), Ef = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Ef.push("scrollEnd");
  function Tt(l, t) {
    ds.set(l, t), Aa(t, [l]);
  }
  var Qe = typeof reportError == "function" ? reportError : function(l) {
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
  }, mt = [], Pa = 0, zf = 0;
  function je() {
    for (var l = Pa, t = zf = Pa = 0; t < l; ) {
      var a = mt[t];
      mt[t++] = null;
      var u = mt[t];
      mt[t++] = null;
      var e = mt[t];
      mt[t++] = null;
      var n = mt[t];
      if (mt[t++] = null, u !== null && e !== null) {
        var f = u.pending;
        f === null ? e.next = e : (e.next = f.next, f.next = e), u.pending = e;
      }
      n !== 0 && hs(a, e, n);
    }
  }
  function Xe(l, t, a, u) {
    mt[Pa++] = l, mt[Pa++] = t, mt[Pa++] = a, mt[Pa++] = u, zf |= u, l.lanes |= u, l = l.alternate, l !== null && (l.lanes |= u);
  }
  function Tf(l, t, a, u) {
    return Xe(l, t, a, u), Ze(l);
  }
  function Ma(l, t) {
    return Xe(l, null, null, t), Ze(l);
  }
  function hs(l, t, a) {
    l.lanes |= a;
    var u = l.alternate;
    u !== null && (u.lanes |= a);
    for (var e = !1, n = l.return; n !== null; )
      n.childLanes |= a, u = n.alternate, u !== null && (u.childLanes |= a), n.tag === 22 && (l = n.stateNode, l === null || l._visibility & 1 || (e = !0)), l = n, n = n.return;
    return l.tag === 3 ? (n = l.stateNode, e && t !== null && (e = 31 - at(a), l = n.hiddenUpdates, u = l[e], u === null ? l[e] = [t] : u.push(t), t.lane = a | 536870912), n) : null;
  }
  function Ze(l) {
    if (50 < ce)
      throw ce = 0, Hi = null, Error(o(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var lu = {};
  function xv(l, t, a, u) {
    this.tag = l, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = u, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function et(l, t, a, u) {
    return new xv(l, t, a, u);
  }
  function Af(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function Bt(l, t) {
    var a = l.alternate;
    return a === null ? (a = et(
      l.tag,
      t,
      l.key,
      l.mode
    ), a.elementType = l.elementType, a.type = l.type, a.stateNode = l.stateNode, a.alternate = l, l.alternate = a) : (a.pendingProps = t, a.type = l.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = l.flags & 65011712, a.childLanes = l.childLanes, a.lanes = l.lanes, a.child = l.child, a.memoizedProps = l.memoizedProps, a.memoizedState = l.memoizedState, a.updateQueue = l.updateQueue, t = l.dependencies, a.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, a.sibling = l.sibling, a.index = l.index, a.ref = l.ref, a.refCleanup = l.refCleanup, a;
  }
  function Ss(l, t) {
    l.flags &= 65011714;
    var a = l.alternate;
    return a === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = a.childLanes, l.lanes = a.lanes, l.child = a.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = a.memoizedProps, l.memoizedState = a.memoizedState, l.updateQueue = a.updateQueue, l.type = a.type, t = a.dependencies, l.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), l;
  }
  function xe(l, t, a, u, e, n) {
    var f = 0;
    if (u = l, typeof l == "function") Af(l) && (f = 1);
    else if (typeof l == "string")
      f = wm(
        l,
        a,
        R.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (l) {
        case sl:
          return l = et(31, a, t, e), l.elementType = sl, l.lanes = n, l;
        case Ml:
          return Da(a.children, e, n, t);
        case yt:
          f = 8, e |= 24;
          break;
        case Xl:
          return l = et(12, a, t, e | 2), l.elementType = Xl, l.lanes = n, l;
        case Ll:
          return l = et(13, a, t, e), l.elementType = Ll, l.lanes = n, l;
        case _l:
          return l = et(19, a, t, e), l.elementType = _l, l.lanes = n, l;
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case gl:
                f = 10;
                break l;
              case Il:
                f = 9;
                break l;
              case Gl:
                f = 11;
                break l;
              case V:
                f = 14;
                break l;
              case Dl:
                f = 16, u = null;
                break l;
            }
          f = 29, a = Error(
            o(130, l === null ? "null" : typeof l, "")
          ), u = null;
      }
    return t = et(f, a, t, e), t.elementType = l, t.type = u, t.lanes = n, t;
  }
  function Da(l, t, a, u) {
    return l = et(7, l, u, t), l.lanes = a, l;
  }
  function Of(l, t, a) {
    return l = et(6, l, null, t), l.lanes = a, l;
  }
  function gs(l) {
    var t = et(18, null, null, 0);
    return t.stateNode = l, t;
  }
  function _f(l, t, a) {
    return t = et(
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
  var rs = /* @__PURE__ */ new WeakMap();
  function dt(l, t) {
    if (typeof l == "object" && l !== null) {
      var a = rs.get(l);
      return a !== void 0 ? a : (t = {
        value: l,
        source: t,
        stack: gc(t)
      }, rs.set(l, t), t);
    }
    return {
      value: l,
      source: t,
      stack: gc(t)
    };
  }
  var tu = [], au = 0, Le = null, Zu = 0, ht = [], St = 0, It = null, pt = 1, Mt = "";
  function qt(l, t) {
    tu[au++] = Zu, tu[au++] = Le, Le = l, Zu = t;
  }
  function bs(l, t, a) {
    ht[St++] = pt, ht[St++] = Mt, ht[St++] = It, It = l;
    var u = pt;
    l = Mt;
    var e = 32 - at(u) - 1;
    u &= ~(1 << e), a += 1;
    var n = 32 - at(t) + e;
    if (30 < n) {
      var f = e - e % 5;
      n = (u & (1 << f) - 1).toString(32), u >>= f, e -= f, pt = 1 << 32 - at(t) + e | a << e | u, Mt = n + l;
    } else
      pt = 1 << n | a << e | u, Mt = l;
  }
  function pf(l) {
    l.return !== null && (qt(l, 1), bs(l, 1, 0));
  }
  function Mf(l) {
    for (; l === Le; )
      Le = tu[--au], tu[au] = null, Zu = tu[--au], tu[au] = null;
    for (; l === It; )
      It = ht[--St], ht[St] = null, Mt = ht[--St], ht[St] = null, pt = ht[--St], ht[St] = null;
  }
  function Es(l, t) {
    ht[St++] = pt, ht[St++] = Mt, ht[St++] = It, pt = t.id, Mt = t.overflow, It = l;
  }
  var Nl = null, vl = null, F = !1, Pt = null, gt = !1, Df = Error(o(519));
  function la(l) {
    var t = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw xu(dt(t, l)), Df;
  }
  function zs(l) {
    var t = l.stateNode, a = l.type, u = l.memoizedProps;
    switch (t[Hl] = l, t[Kl] = u, a) {
      case "dialog":
        w("cancel", t), w("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        w("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < ye.length; a++)
          w(ye[a], t);
        break;
      case "source":
        w("error", t);
        break;
      case "img":
      case "image":
      case "link":
        w("error", t), w("load", t);
        break;
      case "details":
        w("toggle", t);
        break;
      case "input":
        w("invalid", t), Bc(
          t,
          u.value,
          u.defaultValue,
          u.checked,
          u.defaultChecked,
          u.type,
          u.name,
          !0
        );
        break;
      case "select":
        w("invalid", t);
        break;
      case "textarea":
        w("invalid", t), Yc(t, u.value, u.defaultValue, u.children);
    }
    a = u.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || u.suppressHydrationWarning === !0 || Qy(t.textContent, a) ? (u.popover != null && (w("beforetoggle", t), w("toggle", t)), u.onScroll != null && w("scroll", t), u.onScrollEnd != null && w("scrollend", t), u.onClick != null && (t.onclick = Nt), t = !0) : t = !1, t || la(l, !0);
  }
  function Ts(l) {
    for (Nl = l.return; Nl; )
      switch (Nl.tag) {
        case 5:
        case 31:
        case 13:
          gt = !1;
          return;
        case 27:
        case 3:
          gt = !0;
          return;
        default:
          Nl = Nl.return;
      }
  }
  function uu(l) {
    if (l !== Nl) return !1;
    if (!F) return Ts(l), F = !0, !1;
    var t = l.tag, a;
    if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = l.type, a = !(a !== "form" && a !== "button") || Ji(l.type, l.memoizedProps)), a = !a), a && vl && la(l), Ts(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(o(317));
      vl = wy(l);
    } else if (t === 31) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(o(317));
      vl = wy(l);
    } else
      t === 27 ? (t = vl, da(l.type) ? (l = ki, ki = null, vl = l) : vl = t) : vl = Nl ? bt(l.stateNode.nextSibling) : null;
    return !0;
  }
  function Ua() {
    vl = Nl = null, F = !1;
  }
  function Uf() {
    var l = Pt;
    return l !== null && (Fl === null ? Fl = l : Fl.push.apply(
      Fl,
      l
    ), Pt = null), l;
  }
  function xu(l) {
    Pt === null ? Pt = [l] : Pt.push(l);
  }
  var Rf = y(null), Ra = null, Yt = null;
  function ta(l, t, a) {
    M(Rf, t._currentValue), t._currentValue = a;
  }
  function Gt(l) {
    l._currentValue = Rf.current, A(Rf);
  }
  function Hf(l, t, a) {
    for (; l !== null; ) {
      var u = l.alternate;
      if ((l.childLanes & t) !== t ? (l.childLanes |= t, u !== null && (u.childLanes |= t)) : u !== null && (u.childLanes & t) !== t && (u.childLanes |= t), l === a) break;
      l = l.return;
    }
  }
  function Nf(l, t, a, u) {
    var e = l.child;
    for (e !== null && (e.return = l); e !== null; ) {
      var n = e.dependencies;
      if (n !== null) {
        var f = e.child;
        n = n.firstContext;
        l: for (; n !== null; ) {
          var i = n;
          n = e;
          for (var c = 0; c < t.length; c++)
            if (i.context === t[c]) {
              n.lanes |= a, i = n.alternate, i !== null && (i.lanes |= a), Hf(
                n.return,
                a,
                l
              ), u || (f = null);
              break l;
            }
          n = i.next;
        }
      } else if (e.tag === 18) {
        if (f = e.return, f === null) throw Error(o(341));
        f.lanes |= a, n = f.alternate, n !== null && (n.lanes |= a), Hf(f, a, l), f = null;
      } else f = e.child;
      if (f !== null) f.return = e;
      else
        for (f = e; f !== null; ) {
          if (f === l) {
            f = null;
            break;
          }
          if (e = f.sibling, e !== null) {
            e.return = f.return, f = e;
            break;
          }
          f = f.return;
        }
      e = f;
    }
  }
  function eu(l, t, a, u) {
    l = null;
    for (var e = t, n = !1; e !== null; ) {
      if (!n) {
        if ((e.flags & 524288) !== 0) n = !0;
        else if ((e.flags & 262144) !== 0) break;
      }
      if (e.tag === 10) {
        var f = e.alternate;
        if (f === null) throw Error(o(387));
        if (f = f.memoizedProps, f !== null) {
          var i = e.type;
          ut(e.pendingProps.value, f.value) || (l !== null ? l.push(i) : l = [i]);
        }
      } else if (e === tl.current) {
        if (f = e.alternate, f === null) throw Error(o(387));
        f.memoizedState.memoizedState !== e.memoizedState.memoizedState && (l !== null ? l.push(he) : l = [he]);
      }
      e = e.return;
    }
    l !== null && Nf(
      t,
      l,
      a,
      u
    ), t.flags |= 262144;
  }
  function Ve(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!ut(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function Ha(l) {
    Ra = l, Yt = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function Cl(l) {
    return As(Ra, l);
  }
  function Ke(l, t) {
    return Ra === null && Ha(l), As(l, t);
  }
  function As(l, t) {
    var a = t._currentValue;
    if (t = { context: t, memoizedValue: a, next: null }, Yt === null) {
      if (l === null) throw Error(o(308));
      Yt = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else Yt = Yt.next = t;
    return a;
  }
  var Lv = typeof AbortController < "u" ? AbortController : function() {
    var l = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(a, u) {
        l.push(u);
      }
    };
    this.abort = function() {
      t.aborted = !0, l.forEach(function(a) {
        return a();
      });
    };
  }, Vv = S.unstable_scheduleCallback, Kv = S.unstable_NormalPriority, zl = {
    $$typeof: gl,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Cf() {
    return {
      controller: new Lv(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Lu(l) {
    l.refCount--, l.refCount === 0 && Vv(Kv, function() {
      l.controller.abort();
    });
  }
  var Vu = null, Bf = 0, nu = 0, fu = null;
  function Jv(l, t) {
    if (Vu === null) {
      var a = Vu = [];
      Bf = 0, nu = Gi(), fu = {
        status: "pending",
        value: void 0,
        then: function(u) {
          a.push(u);
        }
      };
    }
    return Bf++, t.then(Os, Os), t;
  }
  function Os() {
    if (--Bf === 0 && Vu !== null) {
      fu !== null && (fu.status = "fulfilled");
      var l = Vu;
      Vu = null, nu = 0, fu = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function wv(l, t) {
    var a = [], u = {
      status: "pending",
      value: null,
      reason: null,
      then: function(e) {
        a.push(e);
      }
    };
    return l.then(
      function() {
        u.status = "fulfilled", u.value = t;
        for (var e = 0; e < a.length; e++) (0, a[e])(t);
      },
      function(e) {
        for (u.status = "rejected", u.reason = e, e = 0; e < a.length; e++)
          (0, a[e])(void 0);
      }
    ), u;
  }
  var _s = b.S;
  b.S = function(l, t) {
    cy = lt(), typeof t == "object" && t !== null && typeof t.then == "function" && Jv(l, t), _s !== null && _s(l, t);
  };
  var Na = y(null);
  function qf() {
    var l = Na.current;
    return l !== null ? l : ol.pooledCache;
  }
  function Je(l, t) {
    t === null ? M(Na, Na.current) : M(Na, t.pool);
  }
  function ps() {
    var l = qf();
    return l === null ? null : { parent: zl._currentValue, pool: l };
  }
  var iu = Error(o(460)), Yf = Error(o(474)), we = Error(o(542)), $e = { then: function() {
  } };
  function Ms(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function Ds(l, t, a) {
    switch (a = l[a], a === void 0 ? l.push(t) : a !== t && (t.then(Nt, Nt), t = a), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw l = t.reason, Rs(l), l;
      default:
        if (typeof t.status == "string") t.then(Nt, Nt);
        else {
          if (l = ol, l !== null && 100 < l.shellSuspendCounter)
            throw Error(o(482));
          l = t, l.status = "pending", l.then(
            function(u) {
              if (t.status === "pending") {
                var e = t;
                e.status = "fulfilled", e.value = u;
              }
            },
            function(u) {
              if (t.status === "pending") {
                var e = t;
                e.status = "rejected", e.reason = u;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw l = t.reason, Rs(l), l;
        }
        throw Ba = t, iu;
    }
  }
  function Ca(l) {
    try {
      var t = l._init;
      return t(l._payload);
    } catch (a) {
      throw a !== null && typeof a == "object" && typeof a.then == "function" ? (Ba = a, iu) : a;
    }
  }
  var Ba = null;
  function Us() {
    if (Ba === null) throw Error(o(459));
    var l = Ba;
    return Ba = null, l;
  }
  function Rs(l) {
    if (l === iu || l === we)
      throw Error(o(483));
  }
  var cu = null, Ku = 0;
  function We(l) {
    var t = Ku;
    return Ku += 1, cu === null && (cu = []), Ds(cu, l, t);
  }
  function Ju(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  }
  function Fe(l, t) {
    throw t.$$typeof === el ? Error(o(525)) : (l = Object.prototype.toString.call(t), Error(
      o(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : l
      )
    ));
  }
  function Hs(l) {
    function t(v, s) {
      if (l) {
        var m = v.deletions;
        m === null ? (v.deletions = [s], v.flags |= 16) : m.push(s);
      }
    }
    function a(v, s) {
      if (!l) return null;
      for (; s !== null; )
        t(v, s), s = s.sibling;
      return null;
    }
    function u(v) {
      for (var s = /* @__PURE__ */ new Map(); v !== null; )
        v.key !== null ? s.set(v.key, v) : s.set(v.index, v), v = v.sibling;
      return s;
    }
    function e(v, s) {
      return v = Bt(v, s), v.index = 0, v.sibling = null, v;
    }
    function n(v, s, m) {
      return v.index = m, l ? (m = v.alternate, m !== null ? (m = m.index, m < s ? (v.flags |= 67108866, s) : m) : (v.flags |= 67108866, s)) : (v.flags |= 1048576, s);
    }
    function f(v) {
      return l && v.alternate === null && (v.flags |= 67108866), v;
    }
    function i(v, s, m, E) {
      return s === null || s.tag !== 6 ? (s = Of(m, v.mode, E), s.return = v, s) : (s = e(s, m), s.return = v, s);
    }
    function c(v, s, m, E) {
      var C = m.type;
      return C === Ml ? r(
        v,
        s,
        m.props.children,
        E,
        m.key
      ) : s !== null && (s.elementType === C || typeof C == "object" && C !== null && C.$$typeof === Dl && Ca(C) === s.type) ? (s = e(s, m.props), Ju(s, m), s.return = v, s) : (s = xe(
        m.type,
        m.key,
        m.props,
        null,
        v.mode,
        E
      ), Ju(s, m), s.return = v, s);
    }
    function d(v, s, m, E) {
      return s === null || s.tag !== 4 || s.stateNode.containerInfo !== m.containerInfo || s.stateNode.implementation !== m.implementation ? (s = _f(m, v.mode, E), s.return = v, s) : (s = e(s, m.children || []), s.return = v, s);
    }
    function r(v, s, m, E, C) {
      return s === null || s.tag !== 7 ? (s = Da(
        m,
        v.mode,
        E,
        C
      ), s.return = v, s) : (s = e(s, m), s.return = v, s);
    }
    function z(v, s, m) {
      if (typeof s == "string" && s !== "" || typeof s == "number" || typeof s == "bigint")
        return s = Of(
          "" + s,
          v.mode,
          m
        ), s.return = v, s;
      if (typeof s == "object" && s !== null) {
        switch (s.$$typeof) {
          case jl:
            return m = xe(
              s.type,
              s.key,
              s.props,
              null,
              v.mode,
              m
            ), Ju(m, s), m.return = v, m;
          case Yl:
            return s = _f(
              s,
              v.mode,
              m
            ), s.return = v, s;
          case Dl:
            return s = Ca(s), z(v, s, m);
        }
        if (zt(s) || Vl(s))
          return s = Da(
            s,
            v.mode,
            m,
            null
          ), s.return = v, s;
        if (typeof s.then == "function")
          return z(v, We(s), m);
        if (s.$$typeof === gl)
          return z(
            v,
            Ke(v, s),
            m
          );
        Fe(v, s);
      }
      return null;
    }
    function h(v, s, m, E) {
      var C = s !== null ? s.key : null;
      if (typeof m == "string" && m !== "" || typeof m == "number" || typeof m == "bigint")
        return C !== null ? null : i(v, s, "" + m, E);
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case jl:
            return m.key === C ? c(v, s, m, E) : null;
          case Yl:
            return m.key === C ? d(v, s, m, E) : null;
          case Dl:
            return m = Ca(m), h(v, s, m, E);
        }
        if (zt(m) || Vl(m))
          return C !== null ? null : r(v, s, m, E, null);
        if (typeof m.then == "function")
          return h(
            v,
            s,
            We(m),
            E
          );
        if (m.$$typeof === gl)
          return h(
            v,
            s,
            Ke(v, m),
            E
          );
        Fe(v, m);
      }
      return null;
    }
    function g(v, s, m, E, C) {
      if (typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint")
        return v = v.get(m) || null, i(s, v, "" + E, C);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case jl:
            return v = v.get(
              E.key === null ? m : E.key
            ) || null, c(s, v, E, C);
          case Yl:
            return v = v.get(
              E.key === null ? m : E.key
            ) || null, d(s, v, E, C);
          case Dl:
            return E = Ca(E), g(
              v,
              s,
              m,
              E,
              C
            );
        }
        if (zt(E) || Vl(E))
          return v = v.get(m) || null, r(s, v, E, C, null);
        if (typeof E.then == "function")
          return g(
            v,
            s,
            m,
            We(E),
            C
          );
        if (E.$$typeof === gl)
          return g(
            v,
            s,
            m,
            Ke(s, E),
            C
          );
        Fe(s, E);
      }
      return null;
    }
    function D(v, s, m, E) {
      for (var C = null, I = null, H = s, Z = s = 0, W = null; H !== null && Z < m.length; Z++) {
        H.index > Z ? (W = H, H = null) : W = H.sibling;
        var P = h(
          v,
          H,
          m[Z],
          E
        );
        if (P === null) {
          H === null && (H = W);
          break;
        }
        l && H && P.alternate === null && t(v, H), s = n(P, s, Z), I === null ? C = P : I.sibling = P, I = P, H = W;
      }
      if (Z === m.length)
        return a(v, H), F && qt(v, Z), C;
      if (H === null) {
        for (; Z < m.length; Z++)
          H = z(v, m[Z], E), H !== null && (s = n(
            H,
            s,
            Z
          ), I === null ? C = H : I.sibling = H, I = H);
        return F && qt(v, Z), C;
      }
      for (H = u(H); Z < m.length; Z++)
        W = g(
          H,
          v,
          Z,
          m[Z],
          E
        ), W !== null && (l && W.alternate !== null && H.delete(
          W.key === null ? Z : W.key
        ), s = n(
          W,
          s,
          Z
        ), I === null ? C = W : I.sibling = W, I = W);
      return l && H.forEach(function(ba) {
        return t(v, ba);
      }), F && qt(v, Z), C;
    }
    function Y(v, s, m, E) {
      if (m == null) throw Error(o(151));
      for (var C = null, I = null, H = s, Z = s = 0, W = null, P = m.next(); H !== null && !P.done; Z++, P = m.next()) {
        H.index > Z ? (W = H, H = null) : W = H.sibling;
        var ba = h(v, H, P.value, E);
        if (ba === null) {
          H === null && (H = W);
          break;
        }
        l && H && ba.alternate === null && t(v, H), s = n(ba, s, Z), I === null ? C = ba : I.sibling = ba, I = ba, H = W;
      }
      if (P.done)
        return a(v, H), F && qt(v, Z), C;
      if (H === null) {
        for (; !P.done; Z++, P = m.next())
          P = z(v, P.value, E), P !== null && (s = n(P, s, Z), I === null ? C = P : I.sibling = P, I = P);
        return F && qt(v, Z), C;
      }
      for (H = u(H); !P.done; Z++, P = m.next())
        P = g(H, v, Z, P.value, E), P !== null && (l && P.alternate !== null && H.delete(P.key === null ? Z : P.key), s = n(P, s, Z), I === null ? C = P : I.sibling = P, I = P);
      return l && H.forEach(function(e1) {
        return t(v, e1);
      }), F && qt(v, Z), C;
    }
    function cl(v, s, m, E) {
      if (typeof m == "object" && m !== null && m.type === Ml && m.key === null && (m = m.props.children), typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case jl:
            l: {
              for (var C = m.key; s !== null; ) {
                if (s.key === C) {
                  if (C = m.type, C === Ml) {
                    if (s.tag === 7) {
                      a(
                        v,
                        s.sibling
                      ), E = e(
                        s,
                        m.props.children
                      ), E.return = v, v = E;
                      break l;
                    }
                  } else if (s.elementType === C || typeof C == "object" && C !== null && C.$$typeof === Dl && Ca(C) === s.type) {
                    a(
                      v,
                      s.sibling
                    ), E = e(s, m.props), Ju(E, m), E.return = v, v = E;
                    break l;
                  }
                  a(v, s);
                  break;
                } else t(v, s);
                s = s.sibling;
              }
              m.type === Ml ? (E = Da(
                m.props.children,
                v.mode,
                E,
                m.key
              ), E.return = v, v = E) : (E = xe(
                m.type,
                m.key,
                m.props,
                null,
                v.mode,
                E
              ), Ju(E, m), E.return = v, v = E);
            }
            return f(v);
          case Yl:
            l: {
              for (C = m.key; s !== null; ) {
                if (s.key === C)
                  if (s.tag === 4 && s.stateNode.containerInfo === m.containerInfo && s.stateNode.implementation === m.implementation) {
                    a(
                      v,
                      s.sibling
                    ), E = e(s, m.children || []), E.return = v, v = E;
                    break l;
                  } else {
                    a(v, s);
                    break;
                  }
                else t(v, s);
                s = s.sibling;
              }
              E = _f(m, v.mode, E), E.return = v, v = E;
            }
            return f(v);
          case Dl:
            return m = Ca(m), cl(
              v,
              s,
              m,
              E
            );
        }
        if (zt(m))
          return D(
            v,
            s,
            m,
            E
          );
        if (Vl(m)) {
          if (C = Vl(m), typeof C != "function") throw Error(o(150));
          return m = C.call(m), Y(
            v,
            s,
            m,
            E
          );
        }
        if (typeof m.then == "function")
          return cl(
            v,
            s,
            We(m),
            E
          );
        if (m.$$typeof === gl)
          return cl(
            v,
            s,
            Ke(v, m),
            E
          );
        Fe(v, m);
      }
      return typeof m == "string" && m !== "" || typeof m == "number" || typeof m == "bigint" ? (m = "" + m, s !== null && s.tag === 6 ? (a(v, s.sibling), E = e(s, m), E.return = v, v = E) : (a(v, s), E = Of(m, v.mode, E), E.return = v, v = E), f(v)) : a(v, s);
    }
    return function(v, s, m, E) {
      try {
        Ku = 0;
        var C = cl(
          v,
          s,
          m,
          E
        );
        return cu = null, C;
      } catch (H) {
        if (H === iu || H === we) throw H;
        var I = et(29, H, null, v.mode);
        return I.lanes = E, I.return = v, I;
      } finally {
      }
    };
  }
  var qa = Hs(!0), Ns = Hs(!1), aa = !1;
  function Gf(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Qf(l, t) {
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
  function ea(l, t, a) {
    var u = l.updateQueue;
    if (u === null) return null;
    if (u = u.shared, (ll & 2) !== 0) {
      var e = u.pending;
      return e === null ? t.next = t : (t.next = e.next, e.next = t), u.pending = t, t = Ze(l), hs(l, null, a), t;
    }
    return Xe(l, u, t, a), Ze(l);
  }
  function wu(l, t, a) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (a & 4194048) !== 0)) {
      var u = t.lanes;
      u &= l.pendingLanes, a |= u, t.lanes = a, Ac(l, a);
    }
  }
  function jf(l, t) {
    var a = l.updateQueue, u = l.alternate;
    if (u !== null && (u = u.updateQueue, a === u)) {
      var e = null, n = null;
      if (a = a.firstBaseUpdate, a !== null) {
        do {
          var f = {
            lane: a.lane,
            tag: a.tag,
            payload: a.payload,
            callback: null,
            next: null
          };
          n === null ? e = n = f : n = n.next = f, a = a.next;
        } while (a !== null);
        n === null ? e = n = t : n = n.next = t;
      } else e = n = t;
      a = {
        baseState: u.baseState,
        firstBaseUpdate: e,
        lastBaseUpdate: n,
        shared: u.shared,
        callbacks: u.callbacks
      }, l.updateQueue = a;
      return;
    }
    l = a.lastBaseUpdate, l === null ? a.firstBaseUpdate = t : l.next = t, a.lastBaseUpdate = t;
  }
  var Xf = !1;
  function $u() {
    if (Xf) {
      var l = fu;
      if (l !== null) throw l;
    }
  }
  function Wu(l, t, a, u) {
    Xf = !1;
    var e = l.updateQueue;
    aa = !1;
    var n = e.firstBaseUpdate, f = e.lastBaseUpdate, i = e.shared.pending;
    if (i !== null) {
      e.shared.pending = null;
      var c = i, d = c.next;
      c.next = null, f === null ? n = d : f.next = d, f = c;
      var r = l.alternate;
      r !== null && (r = r.updateQueue, i = r.lastBaseUpdate, i !== f && (i === null ? r.firstBaseUpdate = d : i.next = d, r.lastBaseUpdate = c));
    }
    if (n !== null) {
      var z = e.baseState;
      f = 0, r = d = c = null, i = n;
      do {
        var h = i.lane & -536870913, g = h !== i.lane;
        if (g ? ($ & h) === h : (u & h) === h) {
          h !== 0 && h === nu && (Xf = !0), r !== null && (r = r.next = {
            lane: 0,
            tag: i.tag,
            payload: i.payload,
            callback: null,
            next: null
          });
          l: {
            var D = l, Y = i;
            h = t;
            var cl = a;
            switch (Y.tag) {
              case 1:
                if (D = Y.payload, typeof D == "function") {
                  z = D.call(cl, z, h);
                  break l;
                }
                z = D;
                break l;
              case 3:
                D.flags = D.flags & -65537 | 128;
              case 0:
                if (D = Y.payload, h = typeof D == "function" ? D.call(cl, z, h) : D, h == null) break l;
                z = B({}, z, h);
                break l;
              case 2:
                aa = !0;
            }
          }
          h = i.callback, h !== null && (l.flags |= 64, g && (l.flags |= 8192), g = e.callbacks, g === null ? e.callbacks = [h] : g.push(h));
        } else
          g = {
            lane: h,
            tag: i.tag,
            payload: i.payload,
            callback: i.callback,
            next: null
          }, r === null ? (d = r = g, c = z) : r = r.next = g, f |= h;
        if (i = i.next, i === null) {
          if (i = e.shared.pending, i === null)
            break;
          g = i, i = g.next, g.next = null, e.lastBaseUpdate = g, e.shared.pending = null;
        }
      } while (!0);
      r === null && (c = z), e.baseState = c, e.firstBaseUpdate = d, e.lastBaseUpdate = r, n === null && (e.shared.lanes = 0), sa |= f, l.lanes = f, l.memoizedState = z;
    }
  }
  function Cs(l, t) {
    if (typeof l != "function")
      throw Error(o(191, l));
    l.call(t);
  }
  function Bs(l, t) {
    var a = l.callbacks;
    if (a !== null)
      for (l.callbacks = null, l = 0; l < a.length; l++)
        Cs(a[l], t);
  }
  var su = y(null), ke = y(0);
  function qs(l, t) {
    l = Jt, M(ke, l), M(su, t), Jt = l | t.baseLanes;
  }
  function Zf() {
    M(ke, Jt), M(su, su.current);
  }
  function xf() {
    Jt = ke.current, A(su), A(ke);
  }
  var nt = y(null), rt = null;
  function na(l) {
    var t = l.alternate;
    M(bl, bl.current & 1), M(nt, l), rt === null && (t === null || su.current !== null || t.memoizedState !== null) && (rt = l);
  }
  function Lf(l) {
    M(bl, bl.current), M(nt, l), rt === null && (rt = l);
  }
  function Ys(l) {
    l.tag === 22 ? (M(bl, bl.current), M(nt, l), rt === null && (rt = l)) : fa();
  }
  function fa() {
    M(bl, bl.current), M(nt, nt.current);
  }
  function ft(l) {
    A(nt), rt === l && (rt = null), A(bl);
  }
  var bl = y(0);
  function Ie(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var a = t.memoizedState;
        if (a !== null && (a = a.dehydrated, a === null || Wi(a) || Fi(a)))
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
  var Qt = 0, X = null, fl = null, Tl = null, Pe = !1, yu = !1, Ya = !1, ln = 0, Fu = 0, ou = null, $v = 0;
  function hl() {
    throw Error(o(321));
  }
  function Vf(l, t) {
    if (t === null) return !1;
    for (var a = 0; a < t.length && a < l.length; a++)
      if (!ut(l[a], t[a])) return !1;
    return !0;
  }
  function Kf(l, t, a, u, e, n) {
    return Qt = n, X = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, b.H = l === null || l.memoizedState === null ? b0 : fi, Ya = !1, n = a(u, e), Ya = !1, yu && (n = Qs(
      t,
      a,
      u,
      e
    )), Gs(l), n;
  }
  function Gs(l) {
    b.H = Pu;
    var t = fl !== null && fl.next !== null;
    if (Qt = 0, Tl = fl = X = null, Pe = !1, Fu = 0, ou = null, t) throw Error(o(300));
    l === null || Al || (l = l.dependencies, l !== null && Ve(l) && (Al = !0));
  }
  function Qs(l, t, a, u) {
    X = l;
    var e = 0;
    do {
      if (yu && (ou = null), Fu = 0, yu = !1, 25 <= e) throw Error(o(301));
      if (e += 1, Tl = fl = null, l.updateQueue != null) {
        var n = l.updateQueue;
        n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
      }
      b.H = E0, n = t(a, u);
    } while (yu);
    return n;
  }
  function Wv() {
    var l = b.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? ku(t) : t, l = l.useState()[0], (fl !== null ? fl.memoizedState : null) !== l && (X.flags |= 1024), t;
  }
  function Jf() {
    var l = ln !== 0;
    return ln = 0, l;
  }
  function wf(l, t, a) {
    t.updateQueue = l.updateQueue, t.flags &= -2053, l.lanes &= ~a;
  }
  function $f(l) {
    if (Pe) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        t !== null && (t.pending = null), l = l.next;
      }
      Pe = !1;
    }
    Qt = 0, Tl = fl = X = null, yu = !1, Fu = ln = 0, ou = null;
  }
  function xl() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Tl === null ? X.memoizedState = Tl = l : Tl = Tl.next = l, Tl;
  }
  function El() {
    if (fl === null) {
      var l = X.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = fl.next;
    var t = Tl === null ? X.memoizedState : Tl.next;
    if (t !== null)
      Tl = t, fl = l;
    else {
      if (l === null)
        throw X.alternate === null ? Error(o(467)) : Error(o(310));
      fl = l, l = {
        memoizedState: fl.memoizedState,
        baseState: fl.baseState,
        baseQueue: fl.baseQueue,
        queue: fl.queue,
        next: null
      }, Tl === null ? X.memoizedState = Tl = l : Tl = Tl.next = l;
    }
    return Tl;
  }
  function tn() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function ku(l) {
    var t = Fu;
    return Fu += 1, ou === null && (ou = []), l = Ds(ou, l, t), t = X, (Tl === null ? t.memoizedState : Tl.next) === null && (t = t.alternate, b.H = t === null || t.memoizedState === null ? b0 : fi), l;
  }
  function an(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return ku(l);
      if (l.$$typeof === gl) return Cl(l);
    }
    throw Error(o(438, String(l)));
  }
  function Wf(l) {
    var t = null, a = X.updateQueue;
    if (a !== null && (t = a.memoCache), t == null) {
      var u = X.alternate;
      u !== null && (u = u.updateQueue, u !== null && (u = u.memoCache, u != null && (t = {
        data: u.data.map(function(e) {
          return e.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), a === null && (a = tn(), X.updateQueue = a), a.memoCache = t, a = t.data[t.index], a === void 0)
      for (a = t.data[t.index] = Array(l), u = 0; u < l; u++)
        a[u] = Pl;
    return t.index++, a;
  }
  function jt(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function un(l) {
    var t = El();
    return Ff(t, fl, l);
  }
  function Ff(l, t, a) {
    var u = l.queue;
    if (u === null) throw Error(o(311));
    u.lastRenderedReducer = a;
    var e = l.baseQueue, n = u.pending;
    if (n !== null) {
      if (e !== null) {
        var f = e.next;
        e.next = n.next, n.next = f;
      }
      t.baseQueue = e = n, u.pending = null;
    }
    if (n = l.baseState, e === null) l.memoizedState = n;
    else {
      t = e.next;
      var i = f = null, c = null, d = t, r = !1;
      do {
        var z = d.lane & -536870913;
        if (z !== d.lane ? ($ & z) === z : (Qt & z) === z) {
          var h = d.revertLane;
          if (h === 0)
            c !== null && (c = c.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: d.action,
              hasEagerState: d.hasEagerState,
              eagerState: d.eagerState,
              next: null
            }), z === nu && (r = !0);
          else if ((Qt & h) === h) {
            d = d.next, h === nu && (r = !0);
            continue;
          } else
            z = {
              lane: 0,
              revertLane: d.revertLane,
              gesture: null,
              action: d.action,
              hasEagerState: d.hasEagerState,
              eagerState: d.eagerState,
              next: null
            }, c === null ? (i = c = z, f = n) : c = c.next = z, X.lanes |= h, sa |= h;
          z = d.action, Ya && a(n, z), n = d.hasEagerState ? d.eagerState : a(n, z);
        } else
          h = {
            lane: z,
            revertLane: d.revertLane,
            gesture: d.gesture,
            action: d.action,
            hasEagerState: d.hasEagerState,
            eagerState: d.eagerState,
            next: null
          }, c === null ? (i = c = h, f = n) : c = c.next = h, X.lanes |= z, sa |= z;
        d = d.next;
      } while (d !== null && d !== t);
      if (c === null ? f = n : c.next = i, !ut(n, l.memoizedState) && (Al = !0, r && (a = fu, a !== null)))
        throw a;
      l.memoizedState = n, l.baseState = f, l.baseQueue = c, u.lastRenderedState = n;
    }
    return e === null && (u.lanes = 0), [l.memoizedState, u.dispatch];
  }
  function kf(l) {
    var t = El(), a = t.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = l;
    var u = a.dispatch, e = a.pending, n = t.memoizedState;
    if (e !== null) {
      a.pending = null;
      var f = e = e.next;
      do
        n = l(n, f.action), f = f.next;
      while (f !== e);
      ut(n, t.memoizedState) || (Al = !0), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), a.lastRenderedState = n;
    }
    return [n, u];
  }
  function js(l, t, a) {
    var u = X, e = El(), n = F;
    if (n) {
      if (a === void 0) throw Error(o(407));
      a = a();
    } else a = t();
    var f = !ut(
      (fl || e).memoizedState,
      a
    );
    if (f && (e.memoizedState = a, Al = !0), e = e.queue, li(xs.bind(null, u, e, l), [
      l
    ]), e.getSnapshot !== t || f || Tl !== null && Tl.memoizedState.tag & 1) {
      if (u.flags |= 2048, vu(
        9,
        { destroy: void 0 },
        Zs.bind(
          null,
          u,
          e,
          a,
          t
        ),
        null
      ), ol === null) throw Error(o(349));
      n || (Qt & 127) !== 0 || Xs(u, t, a);
    }
    return a;
  }
  function Xs(l, t, a) {
    l.flags |= 16384, l = { getSnapshot: t, value: a }, t = X.updateQueue, t === null ? (t = tn(), X.updateQueue = t, t.stores = [l]) : (a = t.stores, a === null ? t.stores = [l] : a.push(l));
  }
  function Zs(l, t, a, u) {
    t.value = a, t.getSnapshot = u, Ls(t) && Vs(l);
  }
  function xs(l, t, a) {
    return a(function() {
      Ls(t) && Vs(l);
    });
  }
  function Ls(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var a = t();
      return !ut(l, a);
    } catch {
      return !0;
    }
  }
  function Vs(l) {
    var t = Ma(l, 2);
    t !== null && kl(t, l, 2);
  }
  function If(l) {
    var t = xl();
    if (typeof l == "function") {
      var a = l;
      if (l = a(), Ya) {
        Wt(!0);
        try {
          a();
        } finally {
          Wt(!1);
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
  function Ks(l, t, a, u) {
    return l.baseState = a, Ff(
      l,
      fl,
      typeof u == "function" ? u : jt
    );
  }
  function Fv(l, t, a, u, e) {
    if (fn(l)) throw Error(o(485));
    if (l = t.action, l !== null) {
      var n = {
        payload: e,
        action: l,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(f) {
          n.listeners.push(f);
        }
      };
      b.T !== null ? a(!0) : n.isTransition = !1, u(n), a = t.pending, a === null ? (n.next = t.pending = n, Js(t, n)) : (n.next = a.next, t.pending = a.next = n);
    }
  }
  function Js(l, t) {
    var a = t.action, u = t.payload, e = l.state;
    if (t.isTransition) {
      var n = b.T, f = {};
      b.T = f;
      try {
        var i = a(e, u), c = b.S;
        c !== null && c(f, i), ws(l, t, i);
      } catch (d) {
        Pf(l, t, d);
      } finally {
        n !== null && f.types !== null && (n.types = f.types), b.T = n;
      }
    } else
      try {
        n = a(e, u), ws(l, t, n);
      } catch (d) {
        Pf(l, t, d);
      }
  }
  function ws(l, t, a) {
    a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(
      function(u) {
        $s(l, t, u);
      },
      function(u) {
        return Pf(l, t, u);
      }
    ) : $s(l, t, a);
  }
  function $s(l, t, a) {
    t.status = "fulfilled", t.value = a, Ws(t), l.state = a, t = l.pending, t !== null && (a = t.next, a === t ? l.pending = null : (a = a.next, t.next = a, Js(l, a)));
  }
  function Pf(l, t, a) {
    var u = l.pending;
    if (l.pending = null, u !== null) {
      u = u.next;
      do
        t.status = "rejected", t.reason = a, Ws(t), t = t.next;
      while (t !== u);
    }
    l.action = null;
  }
  function Ws(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function Fs(l, t) {
    return t;
  }
  function ks(l, t) {
    if (F) {
      var a = ol.formState;
      if (a !== null) {
        l: {
          var u = X;
          if (F) {
            if (vl) {
              t: {
                for (var e = vl, n = gt; e.nodeType !== 8; ) {
                  if (!n) {
                    e = null;
                    break t;
                  }
                  if (e = bt(
                    e.nextSibling
                  ), e === null) {
                    e = null;
                    break t;
                  }
                }
                n = e.data, e = n === "F!" || n === "F" ? e : null;
              }
              if (e) {
                vl = bt(
                  e.nextSibling
                ), u = e.data === "F!";
                break l;
              }
            }
            la(u);
          }
          u = !1;
        }
        u && (t = a[0]);
      }
    }
    return a = xl(), a.memoizedState = a.baseState = t, u = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Fs,
      lastRenderedState: t
    }, a.queue = u, a = S0.bind(
      null,
      X,
      u
    ), u.dispatch = a, u = If(!1), n = ni.bind(
      null,
      X,
      !1,
      u.queue
    ), u = xl(), e = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, u.queue = e, a = Fv.bind(
      null,
      X,
      e,
      n,
      a
    ), e.dispatch = a, u.memoizedState = l, [t, a, !1];
  }
  function Is(l) {
    var t = El();
    return Ps(t, fl, l);
  }
  function Ps(l, t, a) {
    if (t = Ff(
      l,
      t,
      Fs
    )[0], l = un(jt)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var u = ku(t);
      } catch (f) {
        throw f === iu ? we : f;
      }
    else u = t;
    t = El();
    var e = t.queue, n = e.dispatch;
    return a !== t.memoizedState && (X.flags |= 2048, vu(
      9,
      { destroy: void 0 },
      kv.bind(null, e, a),
      null
    )), [u, n, l];
  }
  function kv(l, t) {
    l.action = t;
  }
  function l0(l) {
    var t = El(), a = fl;
    if (a !== null)
      return Ps(t, a, l);
    El(), t = t.memoizedState, a = El();
    var u = a.queue.dispatch;
    return a.memoizedState = l, [t, u, !1];
  }
  function vu(l, t, a, u) {
    return l = { tag: l, create: a, deps: u, inst: t, next: null }, t = X.updateQueue, t === null && (t = tn(), X.updateQueue = t), a = t.lastEffect, a === null ? t.lastEffect = l.next = l : (u = a.next, a.next = l, l.next = u, t.lastEffect = l), l;
  }
  function t0() {
    return El().memoizedState;
  }
  function en(l, t, a, u) {
    var e = xl();
    X.flags |= l, e.memoizedState = vu(
      1 | t,
      { destroy: void 0 },
      a,
      u === void 0 ? null : u
    );
  }
  function nn(l, t, a, u) {
    var e = El();
    u = u === void 0 ? null : u;
    var n = e.memoizedState.inst;
    fl !== null && u !== null && Vf(u, fl.memoizedState.deps) ? e.memoizedState = vu(t, n, a, u) : (X.flags |= l, e.memoizedState = vu(
      1 | t,
      n,
      a,
      u
    ));
  }
  function a0(l, t) {
    en(8390656, 8, l, t);
  }
  function li(l, t) {
    nn(2048, 8, l, t);
  }
  function Iv(l) {
    X.flags |= 4;
    var t = X.updateQueue;
    if (t === null)
      t = tn(), X.updateQueue = t, t.events = [l];
    else {
      var a = t.events;
      a === null ? t.events = [l] : a.push(l);
    }
  }
  function u0(l) {
    var t = El().memoizedState;
    return Iv({ ref: t, nextImpl: l }), function() {
      if ((ll & 2) !== 0) throw Error(o(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function e0(l, t) {
    return nn(4, 2, l, t);
  }
  function n0(l, t) {
    return nn(4, 4, l, t);
  }
  function f0(l, t) {
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
  function i0(l, t, a) {
    a = a != null ? a.concat([l]) : null, nn(4, 4, f0.bind(null, t, l), a);
  }
  function ti() {
  }
  function c0(l, t) {
    var a = El();
    t = t === void 0 ? null : t;
    var u = a.memoizedState;
    return t !== null && Vf(t, u[1]) ? u[0] : (a.memoizedState = [l, t], l);
  }
  function s0(l, t) {
    var a = El();
    t = t === void 0 ? null : t;
    var u = a.memoizedState;
    if (t !== null && Vf(t, u[1]))
      return u[0];
    if (u = l(), Ya) {
      Wt(!0);
      try {
        l();
      } finally {
        Wt(!1);
      }
    }
    return a.memoizedState = [u, t], u;
  }
  function ai(l, t, a) {
    return a === void 0 || (Qt & 1073741824) !== 0 && ($ & 261930) === 0 ? l.memoizedState = t : (l.memoizedState = a, l = yy(), X.lanes |= l, sa |= l, a);
  }
  function y0(l, t, a, u) {
    return ut(a, t) ? a : su.current !== null ? (l = ai(l, a, u), ut(l, t) || (Al = !0), l) : (Qt & 42) === 0 || (Qt & 1073741824) !== 0 && ($ & 261930) === 0 ? (Al = !0, l.memoizedState = a) : (l = yy(), X.lanes |= l, sa |= l, t);
  }
  function o0(l, t, a, u, e) {
    var n = p.p;
    p.p = n !== 0 && 8 > n ? n : 8;
    var f = b.T, i = {};
    b.T = i, ni(l, !1, t, a);
    try {
      var c = e(), d = b.S;
      if (d !== null && d(i, c), c !== null && typeof c == "object" && typeof c.then == "function") {
        var r = wv(
          c,
          u
        );
        Iu(
          l,
          t,
          r,
          st(l)
        );
      } else
        Iu(
          l,
          t,
          u,
          st(l)
        );
    } catch (z) {
      Iu(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: z },
        st()
      );
    } finally {
      p.p = n, f !== null && i.types !== null && (f.types = i.types), b.T = f;
    }
  }
  function Pv() {
  }
  function ui(l, t, a, u) {
    if (l.tag !== 5) throw Error(o(476));
    var e = v0(l).queue;
    o0(
      l,
      e,
      t,
      G,
      a === null ? Pv : function() {
        return m0(l), a(u);
      }
    );
  }
  function v0(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: G,
      baseState: G,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: jt,
        lastRenderedState: G
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
  function m0(l) {
    var t = v0(l);
    t.next === null && (t = l.alternate.memoizedState), Iu(
      l,
      t.next.queue,
      {},
      st()
    );
  }
  function ei() {
    return Cl(he);
  }
  function d0() {
    return El().memoizedState;
  }
  function h0() {
    return El().memoizedState;
  }
  function lm(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var a = st();
          l = ua(a);
          var u = ea(t, l, a);
          u !== null && (kl(u, t, a), wu(u, t, a)), t = { cache: Cf() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function tm(l, t, a) {
    var u = st();
    a = {
      lane: u,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, fn(l) ? g0(t, a) : (a = Tf(l, t, a, u), a !== null && (kl(a, l, u), r0(a, t, u)));
  }
  function S0(l, t, a) {
    var u = st();
    Iu(l, t, a, u);
  }
  function Iu(l, t, a, u) {
    var e = {
      lane: u,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (fn(l)) g0(t, e);
    else {
      var n = l.alternate;
      if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null))
        try {
          var f = t.lastRenderedState, i = n(f, a);
          if (e.hasEagerState = !0, e.eagerState = i, ut(i, f))
            return Xe(l, t, e, 0), ol === null && je(), !1;
        } catch {
        } finally {
        }
      if (a = Tf(l, t, e, u), a !== null)
        return kl(a, l, u), r0(a, t, u), !0;
    }
    return !1;
  }
  function ni(l, t, a, u) {
    if (u = {
      lane: 2,
      revertLane: Gi(),
      gesture: null,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, fn(l)) {
      if (t) throw Error(o(479));
    } else
      t = Tf(
        l,
        a,
        u,
        2
      ), t !== null && kl(t, l, 2);
  }
  function fn(l) {
    var t = l.alternate;
    return l === X || t !== null && t === X;
  }
  function g0(l, t) {
    yu = Pe = !0;
    var a = l.pending;
    a === null ? t.next = t : (t.next = a.next, a.next = t), l.pending = t;
  }
  function r0(l, t, a) {
    if ((a & 4194048) !== 0) {
      var u = t.lanes;
      u &= l.pendingLanes, a |= u, t.lanes = a, Ac(l, a);
    }
  }
  var Pu = {
    readContext: Cl,
    use: an,
    useCallback: hl,
    useContext: hl,
    useEffect: hl,
    useImperativeHandle: hl,
    useLayoutEffect: hl,
    useInsertionEffect: hl,
    useMemo: hl,
    useReducer: hl,
    useRef: hl,
    useState: hl,
    useDebugValue: hl,
    useDeferredValue: hl,
    useTransition: hl,
    useSyncExternalStore: hl,
    useId: hl,
    useHostTransitionStatus: hl,
    useFormState: hl,
    useActionState: hl,
    useOptimistic: hl,
    useMemoCache: hl,
    useCacheRefresh: hl
  };
  Pu.useEffectEvent = hl;
  var b0 = {
    readContext: Cl,
    use: an,
    useCallback: function(l, t) {
      return xl().memoizedState = [
        l,
        t === void 0 ? null : t
      ], l;
    },
    useContext: Cl,
    useEffect: a0,
    useImperativeHandle: function(l, t, a) {
      a = a != null ? a.concat([l]) : null, en(
        4194308,
        4,
        f0.bind(null, t, l),
        a
      );
    },
    useLayoutEffect: function(l, t) {
      return en(4194308, 4, l, t);
    },
    useInsertionEffect: function(l, t) {
      en(4, 2, l, t);
    },
    useMemo: function(l, t) {
      var a = xl();
      t = t === void 0 ? null : t;
      var u = l();
      if (Ya) {
        Wt(!0);
        try {
          l();
        } finally {
          Wt(!1);
        }
      }
      return a.memoizedState = [u, t], u;
    },
    useReducer: function(l, t, a) {
      var u = xl();
      if (a !== void 0) {
        var e = a(t);
        if (Ya) {
          Wt(!0);
          try {
            a(t);
          } finally {
            Wt(!1);
          }
        }
      } else e = t;
      return u.memoizedState = u.baseState = e, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: e
      }, u.queue = l, l = l.dispatch = tm.bind(
        null,
        X,
        l
      ), [u.memoizedState, l];
    },
    useRef: function(l) {
      var t = xl();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = If(l);
      var t = l.queue, a = S0.bind(null, X, t);
      return t.dispatch = a, [l.memoizedState, a];
    },
    useDebugValue: ti,
    useDeferredValue: function(l, t) {
      var a = xl();
      return ai(a, l, t);
    },
    useTransition: function() {
      var l = If(!1);
      return l = o0.bind(
        null,
        X,
        l.queue,
        !0,
        !1
      ), xl().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, a) {
      var u = X, e = xl();
      if (F) {
        if (a === void 0)
          throw Error(o(407));
        a = a();
      } else {
        if (a = t(), ol === null)
          throw Error(o(349));
        ($ & 127) !== 0 || Xs(u, t, a);
      }
      e.memoizedState = a;
      var n = { value: a, getSnapshot: t };
      return e.queue = n, a0(xs.bind(null, u, n, l), [
        l
      ]), u.flags |= 2048, vu(
        9,
        { destroy: void 0 },
        Zs.bind(
          null,
          u,
          n,
          a,
          t
        ),
        null
      ), a;
    },
    useId: function() {
      var l = xl(), t = ol.identifierPrefix;
      if (F) {
        var a = Mt, u = pt;
        a = (u & ~(1 << 32 - at(u) - 1)).toString(32) + a, t = "_" + t + "R_" + a, a = ln++, 0 < a && (t += "H" + a.toString(32)), t += "_";
      } else
        a = $v++, t = "_" + t + "r_" + a.toString(32) + "_";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: ei,
    useFormState: ks,
    useActionState: ks,
    useOptimistic: function(l) {
      var t = xl();
      t.memoizedState = t.baseState = l;
      var a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = a, t = ni.bind(
        null,
        X,
        !0,
        a
      ), a.dispatch = t, [l, t];
    },
    useMemoCache: Wf,
    useCacheRefresh: function() {
      return xl().memoizedState = lm.bind(
        null,
        X
      );
    },
    useEffectEvent: function(l) {
      var t = xl(), a = { impl: l };
      return t.memoizedState = a, function() {
        if ((ll & 2) !== 0)
          throw Error(o(440));
        return a.impl.apply(void 0, arguments);
      };
    }
  }, fi = {
    readContext: Cl,
    use: an,
    useCallback: c0,
    useContext: Cl,
    useEffect: li,
    useImperativeHandle: i0,
    useInsertionEffect: e0,
    useLayoutEffect: n0,
    useMemo: s0,
    useReducer: un,
    useRef: t0,
    useState: function() {
      return un(jt);
    },
    useDebugValue: ti,
    useDeferredValue: function(l, t) {
      var a = El();
      return y0(
        a,
        fl.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = un(jt)[0], t = El().memoizedState;
      return [
        typeof l == "boolean" ? l : ku(l),
        t
      ];
    },
    useSyncExternalStore: js,
    useId: d0,
    useHostTransitionStatus: ei,
    useFormState: Is,
    useActionState: Is,
    useOptimistic: function(l, t) {
      var a = El();
      return Ks(a, fl, l, t);
    },
    useMemoCache: Wf,
    useCacheRefresh: h0
  };
  fi.useEffectEvent = u0;
  var E0 = {
    readContext: Cl,
    use: an,
    useCallback: c0,
    useContext: Cl,
    useEffect: li,
    useImperativeHandle: i0,
    useInsertionEffect: e0,
    useLayoutEffect: n0,
    useMemo: s0,
    useReducer: kf,
    useRef: t0,
    useState: function() {
      return kf(jt);
    },
    useDebugValue: ti,
    useDeferredValue: function(l, t) {
      var a = El();
      return fl === null ? ai(a, l, t) : y0(
        a,
        fl.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = kf(jt)[0], t = El().memoizedState;
      return [
        typeof l == "boolean" ? l : ku(l),
        t
      ];
    },
    useSyncExternalStore: js,
    useId: d0,
    useHostTransitionStatus: ei,
    useFormState: l0,
    useActionState: l0,
    useOptimistic: function(l, t) {
      var a = El();
      return fl !== null ? Ks(a, fl, l, t) : (a.baseState = l, [l, a.queue.dispatch]);
    },
    useMemoCache: Wf,
    useCacheRefresh: h0
  };
  E0.useEffectEvent = u0;
  function ii(l, t, a, u) {
    t = l.memoizedState, a = a(u, t), a = a == null ? t : B({}, t, a), l.memoizedState = a, l.lanes === 0 && (l.updateQueue.baseState = a);
  }
  var ci = {
    enqueueSetState: function(l, t, a) {
      l = l._reactInternals;
      var u = st(), e = ua(u);
      e.payload = t, a != null && (e.callback = a), t = ea(l, e, u), t !== null && (kl(t, l, u), wu(t, l, u));
    },
    enqueueReplaceState: function(l, t, a) {
      l = l._reactInternals;
      var u = st(), e = ua(u);
      e.tag = 1, e.payload = t, a != null && (e.callback = a), t = ea(l, e, u), t !== null && (kl(t, l, u), wu(t, l, u));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var a = st(), u = ua(a);
      u.tag = 2, t != null && (u.callback = t), t = ea(l, u, a), t !== null && (kl(t, l, a), wu(t, l, a));
    }
  };
  function z0(l, t, a, u, e, n, f) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(u, n, f) : t.prototype && t.prototype.isPureReactComponent ? !ju(a, u) || !ju(e, n) : !0;
  }
  function T0(l, t, a, u) {
    l = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, u), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, u), t.state !== l && ci.enqueueReplaceState(t, t.state, null);
  }
  function Ga(l, t) {
    var a = t;
    if ("ref" in t) {
      a = {};
      for (var u in t)
        u !== "ref" && (a[u] = t[u]);
    }
    if (l = l.defaultProps) {
      a === t && (a = B({}, a));
      for (var e in l)
        a[e] === void 0 && (a[e] = l[e]);
    }
    return a;
  }
  function A0(l) {
    Qe(l);
  }
  function O0(l) {
    console.error(l);
  }
  function _0(l) {
    Qe(l);
  }
  function cn(l, t) {
    try {
      var a = l.onUncaughtError;
      a(t.value, { componentStack: t.stack });
    } catch (u) {
      setTimeout(function() {
        throw u;
      });
    }
  }
  function p0(l, t, a) {
    try {
      var u = l.onCaughtError;
      u(a.value, {
        componentStack: a.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (e) {
      setTimeout(function() {
        throw e;
      });
    }
  }
  function si(l, t, a) {
    return a = ua(a), a.tag = 3, a.payload = { element: null }, a.callback = function() {
      cn(l, t);
    }, a;
  }
  function M0(l) {
    return l = ua(l), l.tag = 3, l;
  }
  function D0(l, t, a, u) {
    var e = a.type.getDerivedStateFromError;
    if (typeof e == "function") {
      var n = u.value;
      l.payload = function() {
        return e(n);
      }, l.callback = function() {
        p0(t, a, u);
      };
    }
    var f = a.stateNode;
    f !== null && typeof f.componentDidCatch == "function" && (l.callback = function() {
      p0(t, a, u), typeof e != "function" && (ya === null ? ya = /* @__PURE__ */ new Set([this]) : ya.add(this));
      var i = u.stack;
      this.componentDidCatch(u.value, {
        componentStack: i !== null ? i : ""
      });
    });
  }
  function am(l, t, a, u, e) {
    if (a.flags |= 32768, u !== null && typeof u == "object" && typeof u.then == "function") {
      if (t = a.alternate, t !== null && eu(
        t,
        a,
        e,
        !0
      ), a = nt.current, a !== null) {
        switch (a.tag) {
          case 31:
          case 13:
            return rt === null ? En() : a.alternate === null && Sl === 0 && (Sl = 3), a.flags &= -257, a.flags |= 65536, a.lanes = e, u === $e ? a.flags |= 16384 : (t = a.updateQueue, t === null ? a.updateQueue = /* @__PURE__ */ new Set([u]) : t.add(u), Bi(l, u, e)), !1;
          case 22:
            return a.flags |= 65536, u === $e ? a.flags |= 16384 : (t = a.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([u])
            }, a.updateQueue = t) : (a = t.retryQueue, a === null ? t.retryQueue = /* @__PURE__ */ new Set([u]) : a.add(u)), Bi(l, u, e)), !1;
        }
        throw Error(o(435, a.tag));
      }
      return Bi(l, u, e), En(), !1;
    }
    if (F)
      return t = nt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = e, u !== Df && (l = Error(o(422), { cause: u }), xu(dt(l, a)))) : (u !== Df && (t = Error(o(423), {
        cause: u
      }), xu(
        dt(t, a)
      )), l = l.current.alternate, l.flags |= 65536, e &= -e, l.lanes |= e, u = dt(u, a), e = si(
        l.stateNode,
        u,
        e
      ), jf(l, e), Sl !== 4 && (Sl = 2)), !1;
    var n = Error(o(520), { cause: u });
    if (n = dt(n, a), ie === null ? ie = [n] : ie.push(n), Sl !== 4 && (Sl = 2), t === null) return !0;
    u = dt(u, a), a = t;
    do {
      switch (a.tag) {
        case 3:
          return a.flags |= 65536, l = e & -e, a.lanes |= l, l = si(a.stateNode, u, l), jf(a, l), !1;
        case 1:
          if (t = a.type, n = a.stateNode, (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (ya === null || !ya.has(n))))
            return a.flags |= 65536, e &= -e, a.lanes |= e, e = M0(e), D0(
              e,
              l,
              a,
              u
            ), jf(a, e), !1;
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var yi = Error(o(461)), Al = !1;
  function Bl(l, t, a, u) {
    t.child = l === null ? Ns(t, null, a, u) : qa(
      t,
      l.child,
      a,
      u
    );
  }
  function U0(l, t, a, u, e) {
    a = a.render;
    var n = t.ref;
    if ("ref" in u) {
      var f = {};
      for (var i in u)
        i !== "ref" && (f[i] = u[i]);
    } else f = u;
    return Ha(t), u = Kf(
      l,
      t,
      a,
      f,
      n,
      e
    ), i = Jf(), l !== null && !Al ? (wf(l, t, e), Xt(l, t, e)) : (F && i && pf(t), t.flags |= 1, Bl(l, t, u, e), t.child);
  }
  function R0(l, t, a, u, e) {
    if (l === null) {
      var n = a.type;
      return typeof n == "function" && !Af(n) && n.defaultProps === void 0 && a.compare === null ? (t.tag = 15, t.type = n, H0(
        l,
        t,
        n,
        u,
        e
      )) : (l = xe(
        a.type,
        null,
        u,
        t,
        t.mode,
        e
      ), l.ref = t.ref, l.return = t, t.child = l);
    }
    if (n = l.child, !ri(l, e)) {
      var f = n.memoizedProps;
      if (a = a.compare, a = a !== null ? a : ju, a(f, u) && l.ref === t.ref)
        return Xt(l, t, e);
    }
    return t.flags |= 1, l = Bt(n, u), l.ref = t.ref, l.return = t, t.child = l;
  }
  function H0(l, t, a, u, e) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (ju(n, u) && l.ref === t.ref)
        if (Al = !1, t.pendingProps = u = n, ri(l, e))
          (l.flags & 131072) !== 0 && (Al = !0);
        else
          return t.lanes = l.lanes, Xt(l, t, e);
    }
    return oi(
      l,
      t,
      a,
      u,
      e
    );
  }
  function N0(l, t, a, u) {
    var e = u.children, n = l !== null ? l.memoizedState : null;
    if (l === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), u.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (n = n !== null ? n.baseLanes | a : a, l !== null) {
          for (u = t.child = l.child, e = 0; u !== null; )
            e = e | u.lanes | u.childLanes, u = u.sibling;
          u = e & ~n;
        } else u = 0, t.child = null;
        return C0(
          l,
          t,
          n,
          a,
          u
        );
      }
      if ((a & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && Je(
          t,
          n !== null ? n.cachePool : null
        ), n !== null ? qs(t, n) : Zf(), Ys(t);
      else
        return u = t.lanes = 536870912, C0(
          l,
          t,
          n !== null ? n.baseLanes | a : a,
          a,
          u
        );
    } else
      n !== null ? (Je(t, n.cachePool), qs(t, n), fa(), t.memoizedState = null) : (l !== null && Je(t, null), Zf(), fa());
    return Bl(l, t, e, a), t.child;
  }
  function le(l, t) {
    return l !== null && l.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function C0(l, t, a, u, e) {
    var n = qf();
    return n = n === null ? null : { parent: zl._currentValue, pool: n }, t.memoizedState = {
      baseLanes: a,
      cachePool: n
    }, l !== null && Je(t, null), Zf(), Ys(t), l !== null && eu(l, t, u, !0), t.childLanes = e, null;
  }
  function sn(l, t) {
    return t = on(
      { mode: t.mode, children: t.children },
      l.mode
    ), t.ref = l.ref, l.child = t, t.return = l, t;
  }
  function B0(l, t, a) {
    return qa(t, l.child, null, a), l = sn(t, t.pendingProps), l.flags |= 2, ft(t), t.memoizedState = null, l;
  }
  function um(l, t, a) {
    var u = t.pendingProps, e = (t.flags & 128) !== 0;
    if (t.flags &= -129, l === null) {
      if (F) {
        if (u.mode === "hidden")
          return l = sn(t, u), t.lanes = 536870912, le(null, l);
        if (Lf(t), (l = vl) ? (l = Jy(
          l,
          gt
        ), l = l !== null && l.data === "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: It !== null ? { id: pt, overflow: Mt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = gs(l), a.return = t, t.child = a, Nl = t, vl = null)) : l = null, l === null) throw la(t);
        return t.lanes = 536870912, null;
      }
      return sn(t, u);
    }
    var n = l.memoizedState;
    if (n !== null) {
      var f = n.dehydrated;
      if (Lf(t), e)
        if (t.flags & 256)
          t.flags &= -257, t = B0(
            l,
            t,
            a
          );
        else if (t.memoizedState !== null)
          t.child = l.child, t.flags |= 128, t = null;
        else throw Error(o(558));
      else if (Al || eu(l, t, a, !1), e = (a & l.childLanes) !== 0, Al || e) {
        if (u = ol, u !== null && (f = Oc(u, a), f !== 0 && f !== n.retryLane))
          throw n.retryLane = f, Ma(l, f), kl(u, l, f), yi;
        En(), t = B0(
          l,
          t,
          a
        );
      } else
        l = n.treeContext, vl = bt(f.nextSibling), Nl = t, F = !0, Pt = null, gt = !1, l !== null && Es(t, l), t = sn(t, u), t.flags |= 4096;
      return t;
    }
    return l = Bt(l.child, {
      mode: u.mode,
      children: u.children
    }), l.ref = t.ref, t.child = l, l.return = t, l;
  }
  function yn(l, t) {
    var a = t.ref;
    if (a === null)
      l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof a != "function" && typeof a != "object")
        throw Error(o(284));
      (l === null || l.ref !== a) && (t.flags |= 4194816);
    }
  }
  function oi(l, t, a, u, e) {
    return Ha(t), a = Kf(
      l,
      t,
      a,
      u,
      void 0,
      e
    ), u = Jf(), l !== null && !Al ? (wf(l, t, e), Xt(l, t, e)) : (F && u && pf(t), t.flags |= 1, Bl(l, t, a, e), t.child);
  }
  function q0(l, t, a, u, e, n) {
    return Ha(t), t.updateQueue = null, a = Qs(
      t,
      u,
      a,
      e
    ), Gs(l), u = Jf(), l !== null && !Al ? (wf(l, t, n), Xt(l, t, n)) : (F && u && pf(t), t.flags |= 1, Bl(l, t, a, n), t.child);
  }
  function Y0(l, t, a, u, e) {
    if (Ha(t), t.stateNode === null) {
      var n = lu, f = a.contextType;
      typeof f == "object" && f !== null && (n = Cl(f)), n = new a(u, n), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = ci, t.stateNode = n, n._reactInternals = t, n = t.stateNode, n.props = u, n.state = t.memoizedState, n.refs = {}, Gf(t), f = a.contextType, n.context = typeof f == "object" && f !== null ? Cl(f) : lu, n.state = t.memoizedState, f = a.getDerivedStateFromProps, typeof f == "function" && (ii(
        t,
        a,
        f,
        u
      ), n.state = t.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (f = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), f !== n.state && ci.enqueueReplaceState(n, n.state, null), Wu(t, u, n, e), $u(), n.state = t.memoizedState), typeof n.componentDidMount == "function" && (t.flags |= 4194308), u = !0;
    } else if (l === null) {
      n = t.stateNode;
      var i = t.memoizedProps, c = Ga(a, i);
      n.props = c;
      var d = n.context, r = a.contextType;
      f = lu, typeof r == "object" && r !== null && (f = Cl(r));
      var z = a.getDerivedStateFromProps;
      r = typeof z == "function" || typeof n.getSnapshotBeforeUpdate == "function", i = t.pendingProps !== i, r || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (i || d !== f) && T0(
        t,
        n,
        u,
        f
      ), aa = !1;
      var h = t.memoizedState;
      n.state = h, Wu(t, u, n, e), $u(), d = t.memoizedState, i || h !== d || aa ? (typeof z == "function" && (ii(
        t,
        a,
        z,
        u
      ), d = t.memoizedState), (c = aa || z0(
        t,
        a,
        c,
        u,
        h,
        d,
        f
      )) ? (r || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = u, t.memoizedState = d), n.props = u, n.state = d, n.context = f, u = c) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), u = !1);
    } else {
      n = t.stateNode, Qf(l, t), f = t.memoizedProps, r = Ga(a, f), n.props = r, z = t.pendingProps, h = n.context, d = a.contextType, c = lu, typeof d == "object" && d !== null && (c = Cl(d)), i = a.getDerivedStateFromProps, (d = typeof i == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (f !== z || h !== c) && T0(
        t,
        n,
        u,
        c
      ), aa = !1, h = t.memoizedState, n.state = h, Wu(t, u, n, e), $u();
      var g = t.memoizedState;
      f !== z || h !== g || aa || l !== null && l.dependencies !== null && Ve(l.dependencies) ? (typeof i == "function" && (ii(
        t,
        a,
        i,
        u
      ), g = t.memoizedState), (r = aa || z0(
        t,
        a,
        r,
        u,
        h,
        g,
        c
      ) || l !== null && l.dependencies !== null && Ve(l.dependencies)) ? (d || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(u, g, c), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(
        u,
        g,
        c
      )), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || f === l.memoizedProps && h === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || f === l.memoizedProps && h === l.memoizedState || (t.flags |= 1024), t.memoizedProps = u, t.memoizedState = g), n.props = u, n.state = g, n.context = c, u = r) : (typeof n.componentDidUpdate != "function" || f === l.memoizedProps && h === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || f === l.memoizedProps && h === l.memoizedState || (t.flags |= 1024), u = !1);
    }
    return n = u, yn(l, t), u = (t.flags & 128) !== 0, n || u ? (n = t.stateNode, a = u && typeof a.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, l !== null && u ? (t.child = qa(
      t,
      l.child,
      null,
      e
    ), t.child = qa(
      t,
      null,
      a,
      e
    )) : Bl(l, t, a, e), t.memoizedState = n.state, l = t.child) : l = Xt(
      l,
      t,
      e
    ), l;
  }
  function G0(l, t, a, u) {
    return Ua(), t.flags |= 256, Bl(l, t, a, u), t.child;
  }
  var vi = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function mi(l) {
    return { baseLanes: l, cachePool: ps() };
  }
  function di(l, t, a) {
    return l = l !== null ? l.childLanes & ~a : 0, t && (l |= ct), l;
  }
  function Q0(l, t, a) {
    var u = t.pendingProps, e = !1, n = (t.flags & 128) !== 0, f;
    if ((f = n) || (f = l !== null && l.memoizedState === null ? !1 : (bl.current & 2) !== 0), f && (e = !0, t.flags &= -129), f = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (F) {
        if (e ? na(t) : fa(), (l = vl) ? (l = Jy(
          l,
          gt
        ), l = l !== null && l.data !== "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: It !== null ? { id: pt, overflow: Mt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = gs(l), a.return = t, t.child = a, Nl = t, vl = null)) : l = null, l === null) throw la(t);
        return Fi(l) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var i = u.children;
      return u = u.fallback, e ? (fa(), e = t.mode, i = on(
        { mode: "hidden", children: i },
        e
      ), u = Da(
        u,
        e,
        a,
        null
      ), i.return = t, u.return = t, i.sibling = u, t.child = i, u = t.child, u.memoizedState = mi(a), u.childLanes = di(
        l,
        f,
        a
      ), t.memoizedState = vi, le(null, u)) : (na(t), hi(t, i));
    }
    var c = l.memoizedState;
    if (c !== null && (i = c.dehydrated, i !== null)) {
      if (n)
        t.flags & 256 ? (na(t), t.flags &= -257, t = Si(
          l,
          t,
          a
        )) : t.memoizedState !== null ? (fa(), t.child = l.child, t.flags |= 128, t = null) : (fa(), i = u.fallback, e = t.mode, u = on(
          { mode: "visible", children: u.children },
          e
        ), i = Da(
          i,
          e,
          a,
          null
        ), i.flags |= 2, u.return = t, i.return = t, u.sibling = i, t.child = u, qa(
          t,
          l.child,
          null,
          a
        ), u = t.child, u.memoizedState = mi(a), u.childLanes = di(
          l,
          f,
          a
        ), t.memoizedState = vi, t = le(null, u));
      else if (na(t), Fi(i)) {
        if (f = i.nextSibling && i.nextSibling.dataset, f) var d = f.dgst;
        f = d, u = Error(o(419)), u.stack = "", u.digest = f, xu({ value: u, source: null, stack: null }), t = Si(
          l,
          t,
          a
        );
      } else if (Al || eu(l, t, a, !1), f = (a & l.childLanes) !== 0, Al || f) {
        if (f = ol, f !== null && (u = Oc(f, a), u !== 0 && u !== c.retryLane))
          throw c.retryLane = u, Ma(l, u), kl(f, l, u), yi;
        Wi(i) || En(), t = Si(
          l,
          t,
          a
        );
      } else
        Wi(i) ? (t.flags |= 192, t.child = l.child, t = null) : (l = c.treeContext, vl = bt(
          i.nextSibling
        ), Nl = t, F = !0, Pt = null, gt = !1, l !== null && Es(t, l), t = hi(
          t,
          u.children
        ), t.flags |= 4096);
      return t;
    }
    return e ? (fa(), i = u.fallback, e = t.mode, c = l.child, d = c.sibling, u = Bt(c, {
      mode: "hidden",
      children: u.children
    }), u.subtreeFlags = c.subtreeFlags & 65011712, d !== null ? i = Bt(
      d,
      i
    ) : (i = Da(
      i,
      e,
      a,
      null
    ), i.flags |= 2), i.return = t, u.return = t, u.sibling = i, t.child = u, le(null, u), u = t.child, i = l.child.memoizedState, i === null ? i = mi(a) : (e = i.cachePool, e !== null ? (c = zl._currentValue, e = e.parent !== c ? { parent: c, pool: c } : e) : e = ps(), i = {
      baseLanes: i.baseLanes | a,
      cachePool: e
    }), u.memoizedState = i, u.childLanes = di(
      l,
      f,
      a
    ), t.memoizedState = vi, le(l.child, u)) : (na(t), a = l.child, l = a.sibling, a = Bt(a, {
      mode: "visible",
      children: u.children
    }), a.return = t, a.sibling = null, l !== null && (f = t.deletions, f === null ? (t.deletions = [l], t.flags |= 16) : f.push(l)), t.child = a, t.memoizedState = null, a);
  }
  function hi(l, t) {
    return t = on(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function on(l, t) {
    return l = et(22, l, null, t), l.lanes = 0, l;
  }
  function Si(l, t, a) {
    return qa(t, l.child, null, a), l = hi(
      t,
      t.pendingProps.children
    ), l.flags |= 2, t.memoizedState = null, l;
  }
  function j0(l, t, a) {
    l.lanes |= t;
    var u = l.alternate;
    u !== null && (u.lanes |= t), Hf(l.return, t, a);
  }
  function gi(l, t, a, u, e, n) {
    var f = l.memoizedState;
    f === null ? l.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: u,
      tail: a,
      tailMode: e,
      treeForkCount: n
    } : (f.isBackwards = t, f.rendering = null, f.renderingStartTime = 0, f.last = u, f.tail = a, f.tailMode = e, f.treeForkCount = n);
  }
  function X0(l, t, a) {
    var u = t.pendingProps, e = u.revealOrder, n = u.tail;
    u = u.children;
    var f = bl.current, i = (f & 2) !== 0;
    if (i ? (f = f & 1 | 2, t.flags |= 128) : f &= 1, M(bl, f), Bl(l, t, u, a), u = F ? Zu : 0, !i && l !== null && (l.flags & 128) !== 0)
      l: for (l = t.child; l !== null; ) {
        if (l.tag === 13)
          l.memoizedState !== null && j0(l, a, t);
        else if (l.tag === 19)
          j0(l, a, t);
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
    switch (e) {
      case "forwards":
        for (a = t.child, e = null; a !== null; )
          l = a.alternate, l !== null && Ie(l) === null && (e = a), a = a.sibling;
        a = e, a === null ? (e = t.child, t.child = null) : (e = a.sibling, a.sibling = null), gi(
          t,
          !1,
          e,
          a,
          n,
          u
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (a = null, e = t.child, t.child = null; e !== null; ) {
          if (l = e.alternate, l !== null && Ie(l) === null) {
            t.child = e;
            break;
          }
          l = e.sibling, e.sibling = a, a = e, e = l;
        }
        gi(
          t,
          !0,
          a,
          null,
          n,
          u
        );
        break;
      case "together":
        gi(
          t,
          !1,
          null,
          null,
          void 0,
          u
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Xt(l, t, a) {
    if (l !== null && (t.dependencies = l.dependencies), sa |= t.lanes, (a & t.childLanes) === 0)
      if (l !== null) {
        if (eu(
          l,
          t,
          a,
          !1
        ), (a & t.childLanes) === 0)
          return null;
      } else return null;
    if (l !== null && t.child !== l.child)
      throw Error(o(153));
    if (t.child !== null) {
      for (l = t.child, a = Bt(l, l.pendingProps), t.child = a, a.return = t; l.sibling !== null; )
        l = l.sibling, a = a.sibling = Bt(l, l.pendingProps), a.return = t;
      a.sibling = null;
    }
    return t.child;
  }
  function ri(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && Ve(l)));
  }
  function em(l, t, a) {
    switch (t.tag) {
      case 3:
        Zl(t, t.stateNode.containerInfo), ta(t, zl, l.memoizedState.cache), Ua();
        break;
      case 27:
      case 5:
        pu(t);
        break;
      case 4:
        Zl(t, t.stateNode.containerInfo);
        break;
      case 10:
        ta(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, Lf(t), null;
        break;
      case 13:
        var u = t.memoizedState;
        if (u !== null)
          return u.dehydrated !== null ? (na(t), t.flags |= 128, null) : (a & t.child.childLanes) !== 0 ? Q0(l, t, a) : (na(t), l = Xt(
            l,
            t,
            a
          ), l !== null ? l.sibling : null);
        na(t);
        break;
      case 19:
        var e = (l.flags & 128) !== 0;
        if (u = (a & t.childLanes) !== 0, u || (eu(
          l,
          t,
          a,
          !1
        ), u = (a & t.childLanes) !== 0), e) {
          if (u)
            return X0(
              l,
              t,
              a
            );
          t.flags |= 128;
        }
        if (e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null, e.lastEffect = null), M(bl, bl.current), u) break;
        return null;
      case 22:
        return t.lanes = 0, N0(
          l,
          t,
          a,
          t.pendingProps
        );
      case 24:
        ta(t, zl, l.memoizedState.cache);
    }
    return Xt(l, t, a);
  }
  function Z0(l, t, a) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        Al = !0;
      else {
        if (!ri(l, a) && (t.flags & 128) === 0)
          return Al = !1, em(
            l,
            t,
            a
          );
        Al = (l.flags & 131072) !== 0;
      }
    else
      Al = !1, F && (t.flags & 1048576) !== 0 && bs(t, Zu, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          var u = t.pendingProps;
          if (l = Ca(t.elementType), t.type = l, typeof l == "function")
            Af(l) ? (u = Ga(l, u), t.tag = 1, t = Y0(
              null,
              t,
              l,
              u,
              a
            )) : (t.tag = 0, t = oi(
              null,
              t,
              l,
              u,
              a
            ));
          else {
            if (l != null) {
              var e = l.$$typeof;
              if (e === Gl) {
                t.tag = 11, t = U0(
                  null,
                  t,
                  l,
                  u,
                  a
                );
                break l;
              } else if (e === V) {
                t.tag = 14, t = R0(
                  null,
                  t,
                  l,
                  u,
                  a
                );
                break l;
              }
            }
            throw t = Rt(l) || l, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return oi(
          l,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 1:
        return u = t.type, e = Ga(
          u,
          t.pendingProps
        ), Y0(
          l,
          t,
          u,
          e,
          a
        );
      case 3:
        l: {
          if (Zl(
            t,
            t.stateNode.containerInfo
          ), l === null) throw Error(o(387));
          u = t.pendingProps;
          var n = t.memoizedState;
          e = n.element, Qf(l, t), Wu(t, u, null, a);
          var f = t.memoizedState;
          if (u = f.cache, ta(t, zl, u), u !== n.cache && Nf(
            t,
            [zl],
            a,
            !0
          ), $u(), u = f.element, n.isDehydrated)
            if (n = {
              element: u,
              isDehydrated: !1,
              cache: f.cache
            }, t.updateQueue.baseState = n, t.memoizedState = n, t.flags & 256) {
              t = G0(
                l,
                t,
                u,
                a
              );
              break l;
            } else if (u !== e) {
              e = dt(
                Error(o(424)),
                t
              ), xu(e), t = G0(
                l,
                t,
                u,
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
              for (vl = bt(l.firstChild), Nl = t, F = !0, Pt = null, gt = !0, a = Ns(
                t,
                null,
                u,
                a
              ), t.child = a; a; )
                a.flags = a.flags & -3 | 4096, a = a.sibling;
            }
          else {
            if (Ua(), u === e) {
              t = Xt(
                l,
                t,
                a
              );
              break l;
            }
            Bl(l, t, u, a);
          }
          t = t.child;
        }
        return t;
      case 26:
        return yn(l, t), l === null ? (a = Iy(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = a : F || (a = t.type, l = t.pendingProps, u = Mn(
          K.current
        ).createElement(a), u[Hl] = t, u[Kl] = l, ql(u, a, l), Ul(u), t.stateNode = u) : t.memoizedState = Iy(
          t.type,
          l.memoizedProps,
          t.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return pu(t), l === null && F && (u = t.stateNode = Wy(
          t.type,
          t.pendingProps,
          K.current
        ), Nl = t, gt = !0, e = vl, da(t.type) ? (ki = e, vl = bt(u.firstChild)) : vl = e), Bl(
          l,
          t,
          t.pendingProps.children,
          a
        ), yn(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && F && ((e = u = vl) && (u = Bm(
          u,
          t.type,
          t.pendingProps,
          gt
        ), u !== null ? (t.stateNode = u, Nl = t, vl = bt(u.firstChild), gt = !1, e = !0) : e = !1), e || la(t)), pu(t), e = t.type, n = t.pendingProps, f = l !== null ? l.memoizedProps : null, u = n.children, Ji(e, n) ? u = null : f !== null && Ji(e, f) && (t.flags |= 32), t.memoizedState !== null && (e = Kf(
          l,
          t,
          Wv,
          null,
          null,
          a
        ), he._currentValue = e), yn(l, t), Bl(l, t, u, a), t.child;
      case 6:
        return l === null && F && ((l = a = vl) && (a = qm(
          a,
          t.pendingProps,
          gt
        ), a !== null ? (t.stateNode = a, Nl = t, vl = null, l = !0) : l = !1), l || la(t)), null;
      case 13:
        return Q0(l, t, a);
      case 4:
        return Zl(
          t,
          t.stateNode.containerInfo
        ), u = t.pendingProps, l === null ? t.child = qa(
          t,
          null,
          u,
          a
        ) : Bl(l, t, u, a), t.child;
      case 11:
        return U0(
          l,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 7:
        return Bl(
          l,
          t,
          t.pendingProps,
          a
        ), t.child;
      case 8:
        return Bl(
          l,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 12:
        return Bl(
          l,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 10:
        return u = t.pendingProps, ta(t, t.type, u.value), Bl(l, t, u.children, a), t.child;
      case 9:
        return e = t.type._context, u = t.pendingProps.children, Ha(t), e = Cl(e), u = u(e), t.flags |= 1, Bl(l, t, u, a), t.child;
      case 14:
        return R0(
          l,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 15:
        return H0(
          l,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 19:
        return X0(l, t, a);
      case 31:
        return um(l, t, a);
      case 22:
        return N0(
          l,
          t,
          a,
          t.pendingProps
        );
      case 24:
        return Ha(t), u = Cl(zl), l === null ? (e = qf(), e === null && (e = ol, n = Cf(), e.pooledCache = n, n.refCount++, n !== null && (e.pooledCacheLanes |= a), e = n), t.memoizedState = { parent: u, cache: e }, Gf(t), ta(t, zl, e)) : ((l.lanes & a) !== 0 && (Qf(l, t), Wu(t, null, null, a), $u()), e = l.memoizedState, n = t.memoizedState, e.parent !== u ? (e = { parent: u, cache: u }, t.memoizedState = e, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = e), ta(t, zl, u)) : (u = n.cache, ta(t, zl, u), u !== e.cache && Nf(
          t,
          [zl],
          a,
          !0
        ))), Bl(
          l,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(o(156, t.tag));
  }
  function Zt(l) {
    l.flags |= 4;
  }
  function bi(l, t, a, u, e) {
    if ((t = (l.mode & 32) !== 0) && (t = !1), t) {
      if (l.flags |= 16777216, (e & 335544128) === e)
        if (l.stateNode.complete) l.flags |= 8192;
        else if (dy()) l.flags |= 8192;
        else
          throw Ba = $e, Yf;
    } else l.flags &= -16777217;
  }
  function x0(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !uo(t))
      if (dy()) l.flags |= 8192;
      else
        throw Ba = $e, Yf;
  }
  function vn(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? zc() : 536870912, l.lanes |= t, Su |= t);
  }
  function te(l, t) {
    if (!F)
      switch (l.tailMode) {
        case "hidden":
          t = l.tail;
          for (var a = null; t !== null; )
            t.alternate !== null && (a = t), t = t.sibling;
          a === null ? l.tail = null : a.sibling = null;
          break;
        case "collapsed":
          a = l.tail;
          for (var u = null; a !== null; )
            a.alternate !== null && (u = a), a = a.sibling;
          u === null ? t || l.tail === null ? l.tail = null : l.tail.sibling = null : u.sibling = null;
      }
  }
  function ml(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, a = 0, u = 0;
    if (t)
      for (var e = l.child; e !== null; )
        a |= e.lanes | e.childLanes, u |= e.subtreeFlags & 65011712, u |= e.flags & 65011712, e.return = l, e = e.sibling;
    else
      for (e = l.child; e !== null; )
        a |= e.lanes | e.childLanes, u |= e.subtreeFlags, u |= e.flags, e.return = l, e = e.sibling;
    return l.subtreeFlags |= u, l.childLanes = a, t;
  }
  function nm(l, t, a) {
    var u = t.pendingProps;
    switch (Mf(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return ml(t), null;
      case 1:
        return ml(t), null;
      case 3:
        return a = t.stateNode, u = null, l !== null && (u = l.memoizedState.cache), t.memoizedState.cache !== u && (t.flags |= 2048), Gt(zl), rl(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (l === null || l.child === null) && (uu(t) ? Zt(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Uf())), ml(t), null;
      case 26:
        var e = t.type, n = t.memoizedState;
        return l === null ? (Zt(t), n !== null ? (ml(t), x0(t, n)) : (ml(t), bi(
          t,
          e,
          null,
          u,
          a
        ))) : n ? n !== l.memoizedState ? (Zt(t), ml(t), x0(t, n)) : (ml(t), t.flags &= -16777217) : (l = l.memoizedProps, l !== u && Zt(t), ml(t), bi(
          t,
          e,
          l,
          u,
          a
        )), null;
      case 27:
        if (Te(t), a = K.current, e = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== u && Zt(t);
        else {
          if (!u) {
            if (t.stateNode === null)
              throw Error(o(166));
            return ml(t), null;
          }
          l = R.current, uu(t) ? zs(t) : (l = Wy(e, u, a), t.stateNode = l, Zt(t));
        }
        return ml(t), null;
      case 5:
        if (Te(t), e = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== u && Zt(t);
        else {
          if (!u) {
            if (t.stateNode === null)
              throw Error(o(166));
            return ml(t), null;
          }
          if (n = R.current, uu(t))
            zs(t);
          else {
            var f = Mn(
              K.current
            );
            switch (n) {
              case 1:
                n = f.createElementNS(
                  "http://www.w3.org/2000/svg",
                  e
                );
                break;
              case 2:
                n = f.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  e
                );
                break;
              default:
                switch (e) {
                  case "svg":
                    n = f.createElementNS(
                      "http://www.w3.org/2000/svg",
                      e
                    );
                    break;
                  case "math":
                    n = f.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      e
                    );
                    break;
                  case "script":
                    n = f.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(
                      n.firstChild
                    );
                    break;
                  case "select":
                    n = typeof u.is == "string" ? f.createElement("select", {
                      is: u.is
                    }) : f.createElement("select"), u.multiple ? n.multiple = !0 : u.size && (n.size = u.size);
                    break;
                  default:
                    n = typeof u.is == "string" ? f.createElement(e, { is: u.is }) : f.createElement(e);
                }
            }
            n[Hl] = t, n[Kl] = u;
            l: for (f = t.child; f !== null; ) {
              if (f.tag === 5 || f.tag === 6)
                n.appendChild(f.stateNode);
              else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
                f.child.return = f, f = f.child;
                continue;
              }
              if (f === t) break l;
              for (; f.sibling === null; ) {
                if (f.return === null || f.return === t)
                  break l;
                f = f.return;
              }
              f.sibling.return = f.return, f = f.sibling;
            }
            t.stateNode = n;
            l: switch (ql(n, e, u), e) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                u = !!u.autoFocus;
                break l;
              case "img":
                u = !0;
                break l;
              default:
                u = !1;
            }
            u && Zt(t);
          }
        }
        return ml(t), bi(
          t,
          t.type,
          l === null ? null : l.memoizedProps,
          t.pendingProps,
          a
        ), null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== u && Zt(t);
        else {
          if (typeof u != "string" && t.stateNode === null)
            throw Error(o(166));
          if (l = K.current, uu(t)) {
            if (l = t.stateNode, a = t.memoizedProps, u = null, e = Nl, e !== null)
              switch (e.tag) {
                case 27:
                case 5:
                  u = e.memoizedProps;
              }
            l[Hl] = t, l = !!(l.nodeValue === a || u !== null && u.suppressHydrationWarning === !0 || Qy(l.nodeValue, a)), l || la(t, !0);
          } else
            l = Mn(l).createTextNode(
              u
            ), l[Hl] = t, t.stateNode = l;
        }
        return ml(t), null;
      case 31:
        if (a = t.memoizedState, l === null || l.memoizedState !== null) {
          if (u = uu(t), a !== null) {
            if (l === null) {
              if (!u) throw Error(o(318));
              if (l = t.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(o(557));
              l[Hl] = t;
            } else
              Ua(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            ml(t), l = !1;
          } else
            a = Uf(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = a), l = !0;
          if (!l)
            return t.flags & 256 ? (ft(t), t) : (ft(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(o(558));
        }
        return ml(t), null;
      case 13:
        if (u = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (e = uu(t), u !== null && u.dehydrated !== null) {
            if (l === null) {
              if (!e) throw Error(o(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
              e[Hl] = t;
            } else
              Ua(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            ml(t), e = !1;
          } else
            e = Uf(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = e), e = !0;
          if (!e)
            return t.flags & 256 ? (ft(t), t) : (ft(t), null);
        }
        return ft(t), (t.flags & 128) !== 0 ? (t.lanes = a, t) : (a = u !== null, l = l !== null && l.memoizedState !== null, a && (u = t.child, e = null, u.alternate !== null && u.alternate.memoizedState !== null && u.alternate.memoizedState.cachePool !== null && (e = u.alternate.memoizedState.cachePool.pool), n = null, u.memoizedState !== null && u.memoizedState.cachePool !== null && (n = u.memoizedState.cachePool.pool), n !== e && (u.flags |= 2048)), a !== l && a && (t.child.flags |= 8192), vn(t, t.updateQueue), ml(t), null);
      case 4:
        return rl(), l === null && Zi(t.stateNode.containerInfo), ml(t), null;
      case 10:
        return Gt(t.type), ml(t), null;
      case 19:
        if (A(bl), u = t.memoizedState, u === null) return ml(t), null;
        if (e = (t.flags & 128) !== 0, n = u.rendering, n === null)
          if (e) te(u, !1);
          else {
            if (Sl !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (n = Ie(l), n !== null) {
                  for (t.flags |= 128, te(u, !1), l = n.updateQueue, t.updateQueue = l, vn(t, l), t.subtreeFlags = 0, l = a, a = t.child; a !== null; )
                    Ss(a, l), a = a.sibling;
                  return M(
                    bl,
                    bl.current & 1 | 2
                  ), F && qt(t, u.treeForkCount), t.child;
                }
                l = l.sibling;
              }
            u.tail !== null && lt() > gn && (t.flags |= 128, e = !0, te(u, !1), t.lanes = 4194304);
          }
        else {
          if (!e)
            if (l = Ie(n), l !== null) {
              if (t.flags |= 128, e = !0, l = l.updateQueue, t.updateQueue = l, vn(t, l), te(u, !0), u.tail === null && u.tailMode === "hidden" && !n.alternate && !F)
                return ml(t), null;
            } else
              2 * lt() - u.renderingStartTime > gn && a !== 536870912 && (t.flags |= 128, e = !0, te(u, !1), t.lanes = 4194304);
          u.isBackwards ? (n.sibling = t.child, t.child = n) : (l = u.last, l !== null ? l.sibling = n : t.child = n, u.last = n);
        }
        return u.tail !== null ? (l = u.tail, u.rendering = l, u.tail = l.sibling, u.renderingStartTime = lt(), l.sibling = null, a = bl.current, M(
          bl,
          e ? a & 1 | 2 : a & 1
        ), F && qt(t, u.treeForkCount), l) : (ml(t), null);
      case 22:
      case 23:
        return ft(t), xf(), u = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== u && (t.flags |= 8192) : u && (t.flags |= 8192), u ? (a & 536870912) !== 0 && (t.flags & 128) === 0 && (ml(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : ml(t), a = t.updateQueue, a !== null && vn(t, a.retryQueue), a = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (a = l.memoizedState.cachePool.pool), u = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (u = t.memoizedState.cachePool.pool), u !== a && (t.flags |= 2048), l !== null && A(Na), null;
      case 24:
        return a = null, l !== null && (a = l.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Gt(zl), ml(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function fm(l, t) {
    switch (Mf(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return Gt(zl), rl(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Te(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (ft(t), t.alternate === null)
            throw Error(o(340));
          Ua();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 13:
        if (ft(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          Ua();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return A(bl), null;
      case 4:
        return rl(), null;
      case 10:
        return Gt(t.type), null;
      case 22:
      case 23:
        return ft(t), xf(), l !== null && A(Na), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return Gt(zl), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function L0(l, t) {
    switch (Mf(t), t.tag) {
      case 3:
        Gt(zl), rl();
        break;
      case 26:
      case 27:
      case 5:
        Te(t);
        break;
      case 4:
        rl();
        break;
      case 31:
        t.memoizedState !== null && ft(t);
        break;
      case 13:
        ft(t);
        break;
      case 19:
        A(bl);
        break;
      case 10:
        Gt(t.type);
        break;
      case 22:
      case 23:
        ft(t), xf(), l !== null && A(Na);
        break;
      case 24:
        Gt(zl);
    }
  }
  function ae(l, t) {
    try {
      var a = t.updateQueue, u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var e = u.next;
        a = e;
        do {
          if ((a.tag & l) === l) {
            u = void 0;
            var n = a.create, f = a.inst;
            u = n(), f.destroy = u;
          }
          a = a.next;
        } while (a !== e);
      }
    } catch (i) {
      ul(t, t.return, i);
    }
  }
  function ia(l, t, a) {
    try {
      var u = t.updateQueue, e = u !== null ? u.lastEffect : null;
      if (e !== null) {
        var n = e.next;
        u = n;
        do {
          if ((u.tag & l) === l) {
            var f = u.inst, i = f.destroy;
            if (i !== void 0) {
              f.destroy = void 0, e = t;
              var c = a, d = i;
              try {
                d();
              } catch (r) {
                ul(
                  e,
                  c,
                  r
                );
              }
            }
          }
          u = u.next;
        } while (u !== n);
      }
    } catch (r) {
      ul(t, t.return, r);
    }
  }
  function V0(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var a = l.stateNode;
      try {
        Bs(t, a);
      } catch (u) {
        ul(l, l.return, u);
      }
    }
  }
  function K0(l, t, a) {
    a.props = Ga(
      l.type,
      l.memoizedProps
    ), a.state = l.memoizedState;
    try {
      a.componentWillUnmount();
    } catch (u) {
      ul(l, t, u);
    }
  }
  function ue(l, t) {
    try {
      var a = l.ref;
      if (a !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var u = l.stateNode;
            break;
          case 30:
            u = l.stateNode;
            break;
          default:
            u = l.stateNode;
        }
        typeof a == "function" ? l.refCleanup = a(u) : a.current = u;
      }
    } catch (e) {
      ul(l, t, e);
    }
  }
  function Dt(l, t) {
    var a = l.ref, u = l.refCleanup;
    if (a !== null)
      if (typeof u == "function")
        try {
          u();
        } catch (e) {
          ul(l, t, e);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      else if (typeof a == "function")
        try {
          a(null);
        } catch (e) {
          ul(l, t, e);
        }
      else a.current = null;
  }
  function J0(l) {
    var t = l.type, a = l.memoizedProps, u = l.stateNode;
    try {
      l: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && u.focus();
          break l;
        case "img":
          a.src ? u.src = a.src : a.srcSet && (u.srcset = a.srcSet);
      }
    } catch (e) {
      ul(l, l.return, e);
    }
  }
  function Ei(l, t, a) {
    try {
      var u = l.stateNode;
      Dm(u, l.type, a, t), u[Kl] = t;
    } catch (e) {
      ul(l, l.return, e);
    }
  }
  function w0(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && da(l.type) || l.tag === 4;
  }
  function zi(l) {
    l: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || w0(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && da(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue l;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function Ti(l, t, a) {
    var u = l.tag;
    if (u === 5 || u === 6)
      l = l.stateNode, t ? (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(l, t) : (t = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, t.appendChild(l), a = a._reactRootContainer, a != null || t.onclick !== null || (t.onclick = Nt));
    else if (u !== 4 && (u === 27 && da(l.type) && (a = l.stateNode, t = null), l = l.child, l !== null))
      for (Ti(l, t, a), l = l.sibling; l !== null; )
        Ti(l, t, a), l = l.sibling;
  }
  function mn(l, t, a) {
    var u = l.tag;
    if (u === 5 || u === 6)
      l = l.stateNode, t ? a.insertBefore(l, t) : a.appendChild(l);
    else if (u !== 4 && (u === 27 && da(l.type) && (a = l.stateNode), l = l.child, l !== null))
      for (mn(l, t, a), l = l.sibling; l !== null; )
        mn(l, t, a), l = l.sibling;
  }
  function $0(l) {
    var t = l.stateNode, a = l.memoizedProps;
    try {
      for (var u = l.type, e = t.attributes; e.length; )
        t.removeAttributeNode(e[0]);
      ql(t, u, a), t[Hl] = l, t[Kl] = a;
    } catch (n) {
      ul(l, l.return, n);
    }
  }
  var xt = !1, Ol = !1, Ai = !1, W0 = typeof WeakSet == "function" ? WeakSet : Set, Rl = null;
  function im(l, t) {
    if (l = l.containerInfo, Vi = Bn, l = is(l), Sf(l)) {
      if ("selectionStart" in l)
        var a = {
          start: l.selectionStart,
          end: l.selectionEnd
        };
      else
        l: {
          a = (a = l.ownerDocument) && a.defaultView || window;
          var u = a.getSelection && a.getSelection();
          if (u && u.rangeCount !== 0) {
            a = u.anchorNode;
            var e = u.anchorOffset, n = u.focusNode;
            u = u.focusOffset;
            try {
              a.nodeType, n.nodeType;
            } catch {
              a = null;
              break l;
            }
            var f = 0, i = -1, c = -1, d = 0, r = 0, z = l, h = null;
            t: for (; ; ) {
              for (var g; z !== a || e !== 0 && z.nodeType !== 3 || (i = f + e), z !== n || u !== 0 && z.nodeType !== 3 || (c = f + u), z.nodeType === 3 && (f += z.nodeValue.length), (g = z.firstChild) !== null; )
                h = z, z = g;
              for (; ; ) {
                if (z === l) break t;
                if (h === a && ++d === e && (i = f), h === n && ++r === u && (c = f), (g = z.nextSibling) !== null) break;
                z = h, h = z.parentNode;
              }
              z = g;
            }
            a = i === -1 || c === -1 ? null : { start: i, end: c };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (Ki = { focusedElem: l, selectionRange: a }, Bn = !1, Rl = t; Rl !== null; )
      if (t = Rl, l = t.child, (t.subtreeFlags & 1028) !== 0 && l !== null)
        l.return = t, Rl = l;
      else
        for (; Rl !== null; ) {
          switch (t = Rl, n = t.alternate, l = t.flags, t.tag) {
            case 0:
              if ((l & 4) !== 0 && (l = t.updateQueue, l = l !== null ? l.events : null, l !== null))
                for (a = 0; a < l.length; a++)
                  e = l[a], e.ref.impl = e.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((l & 1024) !== 0 && n !== null) {
                l = void 0, a = t, e = n.memoizedProps, n = n.memoizedState, u = a.stateNode;
                try {
                  var D = Ga(
                    a.type,
                    e
                  );
                  l = u.getSnapshotBeforeUpdate(
                    D,
                    n
                  ), u.__reactInternalSnapshotBeforeUpdate = l;
                } catch (Y) {
                  ul(
                    a,
                    a.return,
                    Y
                  );
                }
              }
              break;
            case 3:
              if ((l & 1024) !== 0) {
                if (l = t.stateNode.containerInfo, a = l.nodeType, a === 9)
                  $i(l);
                else if (a === 1)
                  switch (l.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      $i(l);
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
              if ((l & 1024) !== 0) throw Error(o(163));
          }
          if (l = t.sibling, l !== null) {
            l.return = t.return, Rl = l;
            break;
          }
          Rl = t.return;
        }
  }
  function F0(l, t, a) {
    var u = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        Vt(l, a), u & 4 && ae(5, a);
        break;
      case 1:
        if (Vt(l, a), u & 4)
          if (l = a.stateNode, t === null)
            try {
              l.componentDidMount();
            } catch (f) {
              ul(a, a.return, f);
            }
          else {
            var e = Ga(
              a.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              l.componentDidUpdate(
                e,
                t,
                l.__reactInternalSnapshotBeforeUpdate
              );
            } catch (f) {
              ul(
                a,
                a.return,
                f
              );
            }
          }
        u & 64 && V0(a), u & 512 && ue(a, a.return);
        break;
      case 3:
        if (Vt(l, a), u & 64 && (l = a.updateQueue, l !== null)) {
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
            Bs(l, t);
          } catch (f) {
            ul(a, a.return, f);
          }
        }
        break;
      case 27:
        t === null && u & 4 && $0(a);
      case 26:
      case 5:
        Vt(l, a), t === null && u & 4 && J0(a), u & 512 && ue(a, a.return);
        break;
      case 12:
        Vt(l, a);
        break;
      case 31:
        Vt(l, a), u & 4 && P0(l, a);
        break;
      case 13:
        Vt(l, a), u & 4 && ly(l, a), u & 64 && (l = a.memoizedState, l !== null && (l = l.dehydrated, l !== null && (a = Sm.bind(
          null,
          a
        ), Ym(l, a))));
        break;
      case 22:
        if (u = a.memoizedState !== null || xt, !u) {
          t = t !== null && t.memoizedState !== null || Ol, e = xt;
          var n = Ol;
          xt = u, (Ol = t) && !n ? Kt(
            l,
            a,
            (a.subtreeFlags & 8772) !== 0
          ) : Vt(l, a), xt = e, Ol = n;
        }
        break;
      case 30:
        break;
      default:
        Vt(l, a);
    }
  }
  function k0(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null, k0(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && In(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var dl = null, wl = !1;
  function Lt(l, t, a) {
    for (a = a.child; a !== null; )
      I0(l, t, a), a = a.sibling;
  }
  function I0(l, t, a) {
    if (tt && typeof tt.onCommitFiberUnmount == "function")
      try {
        tt.onCommitFiberUnmount(Mu, a);
      } catch {
      }
    switch (a.tag) {
      case 26:
        Ol || Dt(a, t), Lt(
          l,
          t,
          a
        ), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
        break;
      case 27:
        Ol || Dt(a, t);
        var u = dl, e = wl;
        da(a.type) && (dl = a.stateNode, wl = !1), Lt(
          l,
          t,
          a
        ), ve(a.stateNode), dl = u, wl = e;
        break;
      case 5:
        Ol || Dt(a, t);
      case 6:
        if (u = dl, e = wl, dl = null, Lt(
          l,
          t,
          a
        ), dl = u, wl = e, dl !== null)
          if (wl)
            try {
              (dl.nodeType === 9 ? dl.body : dl.nodeName === "HTML" ? dl.ownerDocument.body : dl).removeChild(a.stateNode);
            } catch (n) {
              ul(
                a,
                t,
                n
              );
            }
          else
            try {
              dl.removeChild(a.stateNode);
            } catch (n) {
              ul(
                a,
                t,
                n
              );
            }
        break;
      case 18:
        dl !== null && (wl ? (l = dl, Vy(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          a.stateNode
        ), Ou(l)) : Vy(dl, a.stateNode));
        break;
      case 4:
        u = dl, e = wl, dl = a.stateNode.containerInfo, wl = !0, Lt(
          l,
          t,
          a
        ), dl = u, wl = e;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ia(2, a, t), Ol || ia(4, a, t), Lt(
          l,
          t,
          a
        );
        break;
      case 1:
        Ol || (Dt(a, t), u = a.stateNode, typeof u.componentWillUnmount == "function" && K0(
          a,
          t,
          u
        )), Lt(
          l,
          t,
          a
        );
        break;
      case 21:
        Lt(
          l,
          t,
          a
        );
        break;
      case 22:
        Ol = (u = Ol) || a.memoizedState !== null, Lt(
          l,
          t,
          a
        ), Ol = u;
        break;
      default:
        Lt(
          l,
          t,
          a
        );
    }
  }
  function P0(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null))) {
      l = l.dehydrated;
      try {
        Ou(l);
      } catch (a) {
        ul(t, t.return, a);
      }
    }
  }
  function ly(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        Ou(l);
      } catch (a) {
        ul(t, t.return, a);
      }
  }
  function cm(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new W0()), t;
      case 22:
        return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new W0()), t;
      default:
        throw Error(o(435, l.tag));
    }
  }
  function dn(l, t) {
    var a = cm(l);
    t.forEach(function(u) {
      if (!a.has(u)) {
        a.add(u);
        var e = gm.bind(null, l, u);
        u.then(e, e);
      }
    });
  }
  function $l(l, t) {
    var a = t.deletions;
    if (a !== null)
      for (var u = 0; u < a.length; u++) {
        var e = a[u], n = l, f = t, i = f;
        l: for (; i !== null; ) {
          switch (i.tag) {
            case 27:
              if (da(i.type)) {
                dl = i.stateNode, wl = !1;
                break l;
              }
              break;
            case 5:
              dl = i.stateNode, wl = !1;
              break l;
            case 3:
            case 4:
              dl = i.stateNode.containerInfo, wl = !0;
              break l;
          }
          i = i.return;
        }
        if (dl === null) throw Error(o(160));
        I0(n, f, e), dl = null, wl = !1, n = e.alternate, n !== null && (n.return = null), e.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        ty(t, l), t = t.sibling;
  }
  var At = null;
  function ty(l, t) {
    var a = l.alternate, u = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        $l(t, l), Wl(l), u & 4 && (ia(3, l, l.return), ae(3, l), ia(5, l, l.return));
        break;
      case 1:
        $l(t, l), Wl(l), u & 512 && (Ol || a === null || Dt(a, a.return)), u & 64 && xt && (l = l.updateQueue, l !== null && (u = l.callbacks, u !== null && (a = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = a === null ? u : a.concat(u))));
        break;
      case 26:
        var e = At;
        if ($l(t, l), Wl(l), u & 512 && (Ol || a === null || Dt(a, a.return)), u & 4) {
          var n = a !== null ? a.memoizedState : null;
          if (u = l.memoizedState, a === null)
            if (u === null)
              if (l.stateNode === null) {
                l: {
                  u = l.type, a = l.memoizedProps, e = e.ownerDocument || e;
                  t: switch (u) {
                    case "title":
                      n = e.getElementsByTagName("title")[0], (!n || n[Ru] || n[Hl] || n.namespaceURI === "http://www.w3.org/2000/svg" || n.hasAttribute("itemprop")) && (n = e.createElement(u), e.head.insertBefore(
                        n,
                        e.querySelector("head > title")
                      )), ql(n, u, a), n[Hl] = l, Ul(n), u = n;
                      break l;
                    case "link":
                      var f = to(
                        "link",
                        "href",
                        e
                      ).get(u + (a.href || ""));
                      if (f) {
                        for (var i = 0; i < f.length; i++)
                          if (n = f[i], n.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && n.getAttribute("rel") === (a.rel == null ? null : a.rel) && n.getAttribute("title") === (a.title == null ? null : a.title) && n.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                            f.splice(i, 1);
                            break t;
                          }
                      }
                      n = e.createElement(u), ql(n, u, a), e.head.appendChild(n);
                      break;
                    case "meta":
                      if (f = to(
                        "meta",
                        "content",
                        e
                      ).get(u + (a.content || ""))) {
                        for (i = 0; i < f.length; i++)
                          if (n = f[i], n.getAttribute("content") === (a.content == null ? null : "" + a.content) && n.getAttribute("name") === (a.name == null ? null : a.name) && n.getAttribute("property") === (a.property == null ? null : a.property) && n.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && n.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                            f.splice(i, 1);
                            break t;
                          }
                      }
                      n = e.createElement(u), ql(n, u, a), e.head.appendChild(n);
                      break;
                    default:
                      throw Error(o(468, u));
                  }
                  n[Hl] = l, Ul(n), u = n;
                }
                l.stateNode = u;
              } else
                ao(
                  e,
                  l.type,
                  l.stateNode
                );
            else
              l.stateNode = lo(
                e,
                u,
                l.memoizedProps
              );
          else
            n !== u ? (n === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : n.count--, u === null ? ao(
              e,
              l.type,
              l.stateNode
            ) : lo(
              e,
              u,
              l.memoizedProps
            )) : u === null && l.stateNode !== null && Ei(
              l,
              l.memoizedProps,
              a.memoizedProps
            );
        }
        break;
      case 27:
        $l(t, l), Wl(l), u & 512 && (Ol || a === null || Dt(a, a.return)), a !== null && u & 4 && Ei(
          l,
          l.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if ($l(t, l), Wl(l), u & 512 && (Ol || a === null || Dt(a, a.return)), l.flags & 32) {
          e = l.stateNode;
          try {
            wa(e, "");
          } catch (D) {
            ul(l, l.return, D);
          }
        }
        u & 4 && l.stateNode != null && (e = l.memoizedProps, Ei(
          l,
          e,
          a !== null ? a.memoizedProps : e
        )), u & 1024 && (Ai = !0);
        break;
      case 6:
        if ($l(t, l), Wl(l), u & 4) {
          if (l.stateNode === null)
            throw Error(o(162));
          u = l.memoizedProps, a = l.stateNode;
          try {
            a.nodeValue = u;
          } catch (D) {
            ul(l, l.return, D);
          }
        }
        break;
      case 3:
        if (Rn = null, e = At, At = Dn(t.containerInfo), $l(t, l), At = e, Wl(l), u & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            Ou(t.containerInfo);
          } catch (D) {
            ul(l, l.return, D);
          }
        Ai && (Ai = !1, ay(l));
        break;
      case 4:
        u = At, At = Dn(
          l.stateNode.containerInfo
        ), $l(t, l), Wl(l), At = u;
        break;
      case 12:
        $l(t, l), Wl(l);
        break;
      case 31:
        $l(t, l), Wl(l), u & 4 && (u = l.updateQueue, u !== null && (l.updateQueue = null, dn(l, u)));
        break;
      case 13:
        $l(t, l), Wl(l), l.child.flags & 8192 && l.memoizedState !== null != (a !== null && a.memoizedState !== null) && (Sn = lt()), u & 4 && (u = l.updateQueue, u !== null && (l.updateQueue = null, dn(l, u)));
        break;
      case 22:
        e = l.memoizedState !== null;
        var c = a !== null && a.memoizedState !== null, d = xt, r = Ol;
        if (xt = d || e, Ol = r || c, $l(t, l), Ol = r, xt = d, Wl(l), u & 8192)
          l: for (t = l.stateNode, t._visibility = e ? t._visibility & -2 : t._visibility | 1, e && (a === null || c || xt || Ol || Qa(l)), a = null, t = l; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                c = a = t;
                try {
                  if (n = c.stateNode, e)
                    f = n.style, typeof f.setProperty == "function" ? f.setProperty("display", "none", "important") : f.display = "none";
                  else {
                    i = c.stateNode;
                    var z = c.memoizedProps.style, h = z != null && z.hasOwnProperty("display") ? z.display : null;
                    i.style.display = h == null || typeof h == "boolean" ? "" : ("" + h).trim();
                  }
                } catch (D) {
                  ul(c, c.return, D);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                c = t;
                try {
                  c.stateNode.nodeValue = e ? "" : c.memoizedProps;
                } catch (D) {
                  ul(c, c.return, D);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                c = t;
                try {
                  var g = c.stateNode;
                  e ? Ky(g, !0) : Ky(c.stateNode, !1);
                } catch (D) {
                  ul(c, c.return, D);
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
        u & 4 && (u = l.updateQueue, u !== null && (a = u.retryQueue, a !== null && (u.retryQueue = null, dn(l, a))));
        break;
      case 19:
        $l(t, l), Wl(l), u & 4 && (u = l.updateQueue, u !== null && (l.updateQueue = null, dn(l, u)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        $l(t, l), Wl(l);
    }
  }
  function Wl(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var a, u = l.return; u !== null; ) {
          if (w0(u)) {
            a = u;
            break;
          }
          u = u.return;
        }
        if (a == null) throw Error(o(160));
        switch (a.tag) {
          case 27:
            var e = a.stateNode, n = zi(l);
            mn(l, n, e);
            break;
          case 5:
            var f = a.stateNode;
            a.flags & 32 && (wa(f, ""), a.flags &= -33);
            var i = zi(l);
            mn(l, i, f);
            break;
          case 3:
          case 4:
            var c = a.stateNode.containerInfo, d = zi(l);
            Ti(
              l,
              d,
              c
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (r) {
        ul(l, l.return, r);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function ay(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        ay(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), l = l.sibling;
      }
  }
  function Vt(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        F0(l, t.alternate, t), t = t.sibling;
  }
  function Qa(l) {
    for (l = l.child; l !== null; ) {
      var t = l;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ia(4, t, t.return), Qa(t);
          break;
        case 1:
          Dt(t, t.return);
          var a = t.stateNode;
          typeof a.componentWillUnmount == "function" && K0(
            t,
            t.return,
            a
          ), Qa(t);
          break;
        case 27:
          ve(t.stateNode);
        case 26:
        case 5:
          Dt(t, t.return), Qa(t);
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
  function Kt(l, t, a) {
    for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var u = t.alternate, e = l, n = t, f = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Kt(
            e,
            n,
            a
          ), ae(4, n);
          break;
        case 1:
          if (Kt(
            e,
            n,
            a
          ), u = n, e = u.stateNode, typeof e.componentDidMount == "function")
            try {
              e.componentDidMount();
            } catch (d) {
              ul(u, u.return, d);
            }
          if (u = n, e = u.updateQueue, e !== null) {
            var i = u.stateNode;
            try {
              var c = e.shared.hiddenCallbacks;
              if (c !== null)
                for (e.shared.hiddenCallbacks = null, e = 0; e < c.length; e++)
                  Cs(c[e], i);
            } catch (d) {
              ul(u, u.return, d);
            }
          }
          a && f & 64 && V0(n), ue(n, n.return);
          break;
        case 27:
          $0(n);
        case 26:
        case 5:
          Kt(
            e,
            n,
            a
          ), a && u === null && f & 4 && J0(n), ue(n, n.return);
          break;
        case 12:
          Kt(
            e,
            n,
            a
          );
          break;
        case 31:
          Kt(
            e,
            n,
            a
          ), a && f & 4 && P0(e, n);
          break;
        case 13:
          Kt(
            e,
            n,
            a
          ), a && f & 4 && ly(e, n);
          break;
        case 22:
          n.memoizedState === null && Kt(
            e,
            n,
            a
          ), ue(n, n.return);
          break;
        case 30:
          break;
        default:
          Kt(
            e,
            n,
            a
          );
      }
      t = t.sibling;
    }
  }
  function Oi(l, t) {
    var a = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (a = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== a && (l != null && l.refCount++, a != null && Lu(a));
  }
  function _i(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Lu(l));
  }
  function Ot(l, t, a, u) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        uy(
          l,
          t,
          a,
          u
        ), t = t.sibling;
  }
  function uy(l, t, a, u) {
    var e = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Ot(
          l,
          t,
          a,
          u
        ), e & 2048 && ae(9, t);
        break;
      case 1:
        Ot(
          l,
          t,
          a,
          u
        );
        break;
      case 3:
        Ot(
          l,
          t,
          a,
          u
        ), e & 2048 && (l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Lu(l)));
        break;
      case 12:
        if (e & 2048) {
          Ot(
            l,
            t,
            a,
            u
          ), l = t.stateNode;
          try {
            var n = t.memoizedProps, f = n.id, i = n.onPostCommit;
            typeof i == "function" && i(
              f,
              t.alternate === null ? "mount" : "update",
              l.passiveEffectDuration,
              -0
            );
          } catch (c) {
            ul(t, t.return, c);
          }
        } else
          Ot(
            l,
            t,
            a,
            u
          );
        break;
      case 31:
        Ot(
          l,
          t,
          a,
          u
        );
        break;
      case 13:
        Ot(
          l,
          t,
          a,
          u
        );
        break;
      case 23:
        break;
      case 22:
        n = t.stateNode, f = t.alternate, t.memoizedState !== null ? n._visibility & 2 ? Ot(
          l,
          t,
          a,
          u
        ) : ee(l, t) : n._visibility & 2 ? Ot(
          l,
          t,
          a,
          u
        ) : (n._visibility |= 2, mu(
          l,
          t,
          a,
          u,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), e & 2048 && Oi(f, t);
        break;
      case 24:
        Ot(
          l,
          t,
          a,
          u
        ), e & 2048 && _i(t.alternate, t);
        break;
      default:
        Ot(
          l,
          t,
          a,
          u
        );
    }
  }
  function mu(l, t, a, u, e) {
    for (e = e && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var n = l, f = t, i = a, c = u, d = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          mu(
            n,
            f,
            i,
            c,
            e
          ), ae(8, f);
          break;
        case 23:
          break;
        case 22:
          var r = f.stateNode;
          f.memoizedState !== null ? r._visibility & 2 ? mu(
            n,
            f,
            i,
            c,
            e
          ) : ee(
            n,
            f
          ) : (r._visibility |= 2, mu(
            n,
            f,
            i,
            c,
            e
          )), e && d & 2048 && Oi(
            f.alternate,
            f
          );
          break;
        case 24:
          mu(
            n,
            f,
            i,
            c,
            e
          ), e && d & 2048 && _i(f.alternate, f);
          break;
        default:
          mu(
            n,
            f,
            i,
            c,
            e
          );
      }
      t = t.sibling;
    }
  }
  function ee(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var a = l, u = t, e = u.flags;
        switch (u.tag) {
          case 22:
            ee(a, u), e & 2048 && Oi(
              u.alternate,
              u
            );
            break;
          case 24:
            ee(a, u), e & 2048 && _i(u.alternate, u);
            break;
          default:
            ee(a, u);
        }
        t = t.sibling;
      }
  }
  var ne = 8192;
  function du(l, t, a) {
    if (l.subtreeFlags & ne)
      for (l = l.child; l !== null; )
        ey(
          l,
          t,
          a
        ), l = l.sibling;
  }
  function ey(l, t, a) {
    switch (l.tag) {
      case 26:
        du(
          l,
          t,
          a
        ), l.flags & ne && l.memoizedState !== null && $m(
          a,
          At,
          l.memoizedState,
          l.memoizedProps
        );
        break;
      case 5:
        du(
          l,
          t,
          a
        );
        break;
      case 3:
      case 4:
        var u = At;
        At = Dn(l.stateNode.containerInfo), du(
          l,
          t,
          a
        ), At = u;
        break;
      case 22:
        l.memoizedState === null && (u = l.alternate, u !== null && u.memoizedState !== null ? (u = ne, ne = 16777216, du(
          l,
          t,
          a
        ), ne = u) : du(
          l,
          t,
          a
        ));
        break;
      default:
        du(
          l,
          t,
          a
        );
    }
  }
  function ny(l) {
    var t = l.alternate;
    if (t !== null && (l = t.child, l !== null)) {
      t.child = null;
      do
        t = l.sibling, l.sibling = null, l = t;
      while (l !== null);
    }
  }
  function fe(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var u = t[a];
          Rl = u, iy(
            u,
            l
          );
        }
      ny(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        fy(l), l = l.sibling;
  }
  function fy(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        fe(l), l.flags & 2048 && ia(9, l, l.return);
        break;
      case 3:
        fe(l);
        break;
      case 12:
        fe(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, hn(l)) : fe(l);
        break;
      default:
        fe(l);
    }
  }
  function hn(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var u = t[a];
          Rl = u, iy(
            u,
            l
          );
        }
      ny(l);
    }
    for (l = l.child; l !== null; ) {
      switch (t = l, t.tag) {
        case 0:
        case 11:
        case 15:
          ia(8, t, t.return), hn(t);
          break;
        case 22:
          a = t.stateNode, a._visibility & 2 && (a._visibility &= -3, hn(t));
          break;
        default:
          hn(t);
      }
      l = l.sibling;
    }
  }
  function iy(l, t) {
    for (; Rl !== null; ) {
      var a = Rl;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          ia(8, a, t);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var u = a.memoizedState.cachePool.pool;
            u != null && u.refCount++;
          }
          break;
        case 24:
          Lu(a.memoizedState.cache);
      }
      if (u = a.child, u !== null) u.return = a, Rl = u;
      else
        l: for (a = l; Rl !== null; ) {
          u = Rl;
          var e = u.sibling, n = u.return;
          if (k0(u), u === a) {
            Rl = null;
            break l;
          }
          if (e !== null) {
            e.return = n, Rl = e;
            break l;
          }
          Rl = n;
        }
    }
  }
  var sm = {
    getCacheForType: function(l) {
      var t = Cl(zl), a = t.data.get(l);
      return a === void 0 && (a = l(), t.data.set(l, a)), a;
    },
    cacheSignal: function() {
      return Cl(zl).controller.signal;
    }
  }, ym = typeof WeakMap == "function" ? WeakMap : Map, ll = 0, ol = null, J = null, $ = 0, al = 0, it = null, ca = !1, hu = !1, pi = !1, Jt = 0, Sl = 0, sa = 0, ja = 0, Mi = 0, ct = 0, Su = 0, ie = null, Fl = null, Di = !1, Sn = 0, cy = 0, gn = 1 / 0, rn = null, ya = null, pl = 0, oa = null, gu = null, wt = 0, Ui = 0, Ri = null, sy = null, ce = 0, Hi = null;
  function st() {
    return (ll & 2) !== 0 && $ !== 0 ? $ & -$ : b.T !== null ? Gi() : _c();
  }
  function yy() {
    if (ct === 0)
      if (($ & 536870912) === 0 || F) {
        var l = _e;
        _e <<= 1, (_e & 3932160) === 0 && (_e = 262144), ct = l;
      } else ct = 536870912;
    return l = nt.current, l !== null && (l.flags |= 32), ct;
  }
  function kl(l, t, a) {
    (l === ol && (al === 2 || al === 9) || l.cancelPendingCommit !== null) && (ru(l, 0), va(
      l,
      $,
      ct,
      !1
    )), Uu(l, a), ((ll & 2) === 0 || l !== ol) && (l === ol && ((ll & 2) === 0 && (ja |= a), Sl === 4 && va(
      l,
      $,
      ct,
      !1
    )), Ut(l));
  }
  function oy(l, t, a) {
    if ((ll & 6) !== 0) throw Error(o(327));
    var u = !a && (t & 127) === 0 && (t & l.expiredLanes) === 0 || Du(l, t), e = u ? mm(l, t) : Ci(l, t, !0), n = u;
    do {
      if (e === 0) {
        hu && !u && va(l, t, 0, !1);
        break;
      } else {
        if (a = l.current.alternate, n && !om(a)) {
          e = Ci(l, t, !1), n = !1;
          continue;
        }
        if (e === 2) {
          if (n = t, l.errorRecoveryDisabledLanes & n)
            var f = 0;
          else
            f = l.pendingLanes & -536870913, f = f !== 0 ? f : f & 536870912 ? 536870912 : 0;
          if (f !== 0) {
            t = f;
            l: {
              var i = l;
              e = ie;
              var c = i.current.memoizedState.isDehydrated;
              if (c && (ru(i, f).flags |= 256), f = Ci(
                i,
                f,
                !1
              ), f !== 2) {
                if (pi && !c) {
                  i.errorRecoveryDisabledLanes |= n, ja |= n, e = 4;
                  break l;
                }
                n = Fl, Fl = e, n !== null && (Fl === null ? Fl = n : Fl.push.apply(
                  Fl,
                  n
                ));
              }
              e = f;
            }
            if (n = !1, e !== 2) continue;
          }
        }
        if (e === 1) {
          ru(l, 0), va(l, t, 0, !0);
          break;
        }
        l: {
          switch (u = l, n = e, n) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              va(
                u,
                t,
                ct,
                !ca
              );
              break l;
            case 2:
              Fl = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (e = Sn + 300 - lt(), 10 < e)) {
            if (va(
              u,
              t,
              ct,
              !ca
            ), Me(u, 0, !0) !== 0) break l;
            wt = t, u.timeoutHandle = xy(
              vy.bind(
                null,
                u,
                a,
                Fl,
                rn,
                Di,
                t,
                ct,
                ja,
                Su,
                ca,
                n,
                "Throttled",
                -0,
                0
              ),
              e
            );
            break l;
          }
          vy(
            u,
            a,
            Fl,
            rn,
            Di,
            t,
            ct,
            ja,
            Su,
            ca,
            n,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Ut(l);
  }
  function vy(l, t, a, u, e, n, f, i, c, d, r, z, h, g) {
    if (l.timeoutHandle = -1, z = t.subtreeFlags, z & 8192 || (z & 16785408) === 16785408) {
      z = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Nt
      }, ey(
        t,
        n,
        z
      );
      var D = (n & 62914560) === n ? Sn - lt() : (n & 4194048) === n ? cy - lt() : 0;
      if (D = Wm(
        z,
        D
      ), D !== null) {
        wt = n, l.cancelPendingCommit = D(
          Ey.bind(
            null,
            l,
            t,
            n,
            a,
            u,
            e,
            f,
            i,
            c,
            r,
            z,
            null,
            h,
            g
          )
        ), va(l, n, f, !d);
        return;
      }
    }
    Ey(
      l,
      t,
      n,
      a,
      u,
      e,
      f,
      i,
      c
    );
  }
  function om(l) {
    for (var t = l; ; ) {
      var a = t.tag;
      if ((a === 0 || a === 11 || a === 15) && t.flags & 16384 && (a = t.updateQueue, a !== null && (a = a.stores, a !== null)))
        for (var u = 0; u < a.length; u++) {
          var e = a[u], n = e.getSnapshot;
          e = e.value;
          try {
            if (!ut(n(), e)) return !1;
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
  function va(l, t, a, u) {
    t &= ~Mi, t &= ~ja, l.suspendedLanes |= t, l.pingedLanes &= ~t, u && (l.warmLanes |= t), u = l.expirationTimes;
    for (var e = t; 0 < e; ) {
      var n = 31 - at(e), f = 1 << n;
      u[n] = -1, e &= ~f;
    }
    a !== 0 && Tc(l, a, t);
  }
  function bn() {
    return (ll & 6) === 0 ? (se(0), !1) : !0;
  }
  function Ni() {
    if (J !== null) {
      if (al === 0)
        var l = J.return;
      else
        l = J, Yt = Ra = null, $f(l), cu = null, Ku = 0, l = J;
      for (; l !== null; )
        L0(l.alternate, l), l = l.return;
      J = null;
    }
  }
  function ru(l, t) {
    var a = l.timeoutHandle;
    a !== -1 && (l.timeoutHandle = -1, Hm(a)), a = l.cancelPendingCommit, a !== null && (l.cancelPendingCommit = null, a()), wt = 0, Ni(), ol = l, J = a = Bt(l.current, null), $ = t, al = 0, it = null, ca = !1, hu = Du(l, t), pi = !1, Su = ct = Mi = ja = sa = Sl = 0, Fl = ie = null, Di = !1, (t & 8) !== 0 && (t |= t & 32);
    var u = l.entangledLanes;
    if (u !== 0)
      for (l = l.entanglements, u &= t; 0 < u; ) {
        var e = 31 - at(u), n = 1 << e;
        t |= l[e], u &= ~n;
      }
    return Jt = t, je(), a;
  }
  function my(l, t) {
    X = null, b.H = Pu, t === iu || t === we ? (t = Us(), al = 3) : t === Yf ? (t = Us(), al = 4) : al = t === yi ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, it = t, J === null && (Sl = 1, cn(
      l,
      dt(t, l.current)
    ));
  }
  function dy() {
    var l = nt.current;
    return l === null ? !0 : ($ & 4194048) === $ ? rt === null : ($ & 62914560) === $ || ($ & 536870912) !== 0 ? l === rt : !1;
  }
  function hy() {
    var l = b.H;
    return b.H = Pu, l === null ? Pu : l;
  }
  function Sy() {
    var l = b.A;
    return b.A = sm, l;
  }
  function En() {
    Sl = 4, ca || ($ & 4194048) !== $ && nt.current !== null || (hu = !0), (sa & 134217727) === 0 && (ja & 134217727) === 0 || ol === null || va(
      ol,
      $,
      ct,
      !1
    );
  }
  function Ci(l, t, a) {
    var u = ll;
    ll |= 2;
    var e = hy(), n = Sy();
    (ol !== l || $ !== t) && (rn = null, ru(l, t)), t = !1;
    var f = Sl;
    l: do
      try {
        if (al !== 0 && J !== null) {
          var i = J, c = it;
          switch (al) {
            case 8:
              Ni(), f = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              nt.current === null && (t = !0);
              var d = al;
              if (al = 0, it = null, bu(l, i, c, d), a && hu) {
                f = 0;
                break l;
              }
              break;
            default:
              d = al, al = 0, it = null, bu(l, i, c, d);
          }
        }
        vm(), f = Sl;
        break;
      } catch (r) {
        my(l, r);
      }
    while (!0);
    return t && l.shellSuspendCounter++, Yt = Ra = null, ll = u, b.H = e, b.A = n, J === null && (ol = null, $ = 0, je()), f;
  }
  function vm() {
    for (; J !== null; ) gy(J);
  }
  function mm(l, t) {
    var a = ll;
    ll |= 2;
    var u = hy(), e = Sy();
    ol !== l || $ !== t ? (rn = null, gn = lt() + 500, ru(l, t)) : hu = Du(
      l,
      t
    );
    l: do
      try {
        if (al !== 0 && J !== null) {
          t = J;
          var n = it;
          t: switch (al) {
            case 1:
              al = 0, it = null, bu(l, t, n, 1);
              break;
            case 2:
            case 9:
              if (Ms(n)) {
                al = 0, it = null, ry(t);
                break;
              }
              t = function() {
                al !== 2 && al !== 9 || ol !== l || (al = 7), Ut(l);
              }, n.then(t, t);
              break l;
            case 3:
              al = 7;
              break l;
            case 4:
              al = 5;
              break l;
            case 7:
              Ms(n) ? (al = 0, it = null, ry(t)) : (al = 0, it = null, bu(l, t, n, 7));
              break;
            case 5:
              var f = null;
              switch (J.tag) {
                case 26:
                  f = J.memoizedState;
                case 5:
                case 27:
                  var i = J;
                  if (f ? uo(f) : i.stateNode.complete) {
                    al = 0, it = null;
                    var c = i.sibling;
                    if (c !== null) J = c;
                    else {
                      var d = i.return;
                      d !== null ? (J = d, zn(d)) : J = null;
                    }
                    break t;
                  }
              }
              al = 0, it = null, bu(l, t, n, 5);
              break;
            case 6:
              al = 0, it = null, bu(l, t, n, 6);
              break;
            case 8:
              Ni(), Sl = 6;
              break l;
            default:
              throw Error(o(462));
          }
        }
        dm();
        break;
      } catch (r) {
        my(l, r);
      }
    while (!0);
    return Yt = Ra = null, b.H = u, b.A = e, ll = a, J !== null ? 0 : (ol = null, $ = 0, je(), Sl);
  }
  function dm() {
    for (; J !== null && !Go(); )
      gy(J);
  }
  function gy(l) {
    var t = Z0(l.alternate, l, Jt);
    l.memoizedProps = l.pendingProps, t === null ? zn(l) : J = t;
  }
  function ry(l) {
    var t = l, a = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = q0(
          a,
          t,
          t.pendingProps,
          t.type,
          void 0,
          $
        );
        break;
      case 11:
        t = q0(
          a,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          $
        );
        break;
      case 5:
        $f(t);
      default:
        L0(a, t), t = J = Ss(t, Jt), t = Z0(a, t, Jt);
    }
    l.memoizedProps = l.pendingProps, t === null ? zn(l) : J = t;
  }
  function bu(l, t, a, u) {
    Yt = Ra = null, $f(t), cu = null, Ku = 0;
    var e = t.return;
    try {
      if (am(
        l,
        e,
        t,
        a,
        $
      )) {
        Sl = 1, cn(
          l,
          dt(a, l.current)
        ), J = null;
        return;
      }
    } catch (n) {
      if (e !== null) throw J = e, n;
      Sl = 1, cn(
        l,
        dt(a, l.current)
      ), J = null;
      return;
    }
    t.flags & 32768 ? (F || u === 1 ? l = !0 : hu || ($ & 536870912) !== 0 ? l = !1 : (ca = l = !0, (u === 2 || u === 9 || u === 3 || u === 6) && (u = nt.current, u !== null && u.tag === 13 && (u.flags |= 16384))), by(t, l)) : zn(t);
  }
  function zn(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        by(
          t,
          ca
        );
        return;
      }
      l = t.return;
      var a = nm(
        t.alternate,
        t,
        Jt
      );
      if (a !== null) {
        J = a;
        return;
      }
      if (t = t.sibling, t !== null) {
        J = t;
        return;
      }
      J = t = l;
    } while (t !== null);
    Sl === 0 && (Sl = 5);
  }
  function by(l, t) {
    do {
      var a = fm(l.alternate, l);
      if (a !== null) {
        a.flags &= 32767, J = a;
        return;
      }
      if (a = l.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !t && (l = l.sibling, l !== null)) {
        J = l;
        return;
      }
      J = l = a;
    } while (l !== null);
    Sl = 6, J = null;
  }
  function Ey(l, t, a, u, e, n, f, i, c) {
    l.cancelPendingCommit = null;
    do
      Tn();
    while (pl !== 0);
    if ((ll & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === l.current) throw Error(o(177));
      if (n = t.lanes | t.childLanes, n |= zf, wo(
        l,
        a,
        n,
        f,
        i,
        c
      ), l === ol && (J = ol = null, $ = 0), gu = t, oa = l, wt = a, Ui = n, Ri = e, sy = u, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, rm(Ae, function() {
        return _y(), null;
      })) : (l.callbackNode = null, l.callbackPriority = 0), u = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || u) {
        u = b.T, b.T = null, e = p.p, p.p = 2, f = ll, ll |= 4;
        try {
          im(l, t, a);
        } finally {
          ll = f, p.p = e, b.T = u;
        }
      }
      pl = 1, zy(), Ty(), Ay();
    }
  }
  function zy() {
    if (pl === 1) {
      pl = 0;
      var l = oa, t = gu, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = b.T, b.T = null;
        var u = p.p;
        p.p = 2;
        var e = ll;
        ll |= 4;
        try {
          ty(t, l);
          var n = Ki, f = is(l.containerInfo), i = n.focusedElem, c = n.selectionRange;
          if (f !== i && i && i.ownerDocument && fs(
            i.ownerDocument.documentElement,
            i
          )) {
            if (c !== null && Sf(i)) {
              var d = c.start, r = c.end;
              if (r === void 0 && (r = d), "selectionStart" in i)
                i.selectionStart = d, i.selectionEnd = Math.min(
                  r,
                  i.value.length
                );
              else {
                var z = i.ownerDocument || document, h = z && z.defaultView || window;
                if (h.getSelection) {
                  var g = h.getSelection(), D = i.textContent.length, Y = Math.min(c.start, D), cl = c.end === void 0 ? Y : Math.min(c.end, D);
                  !g.extend && Y > cl && (f = cl, cl = Y, Y = f);
                  var v = ns(
                    i,
                    Y
                  ), s = ns(
                    i,
                    cl
                  );
                  if (v && s && (g.rangeCount !== 1 || g.anchorNode !== v.node || g.anchorOffset !== v.offset || g.focusNode !== s.node || g.focusOffset !== s.offset)) {
                    var m = z.createRange();
                    m.setStart(v.node, v.offset), g.removeAllRanges(), Y > cl ? (g.addRange(m), g.extend(s.node, s.offset)) : (m.setEnd(s.node, s.offset), g.addRange(m));
                  }
                }
              }
            }
            for (z = [], g = i; g = g.parentNode; )
              g.nodeType === 1 && z.push({
                element: g,
                left: g.scrollLeft,
                top: g.scrollTop
              });
            for (typeof i.focus == "function" && i.focus(), i = 0; i < z.length; i++) {
              var E = z[i];
              E.element.scrollLeft = E.left, E.element.scrollTop = E.top;
            }
          }
          Bn = !!Vi, Ki = Vi = null;
        } finally {
          ll = e, p.p = u, b.T = a;
        }
      }
      l.current = t, pl = 2;
    }
  }
  function Ty() {
    if (pl === 2) {
      pl = 0;
      var l = oa, t = gu, a = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || a) {
        a = b.T, b.T = null;
        var u = p.p;
        p.p = 2;
        var e = ll;
        ll |= 4;
        try {
          F0(l, t.alternate, t);
        } finally {
          ll = e, p.p = u, b.T = a;
        }
      }
      pl = 3;
    }
  }
  function Ay() {
    if (pl === 4 || pl === 3) {
      pl = 0, Qo();
      var l = oa, t = gu, a = wt, u = sy;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? pl = 5 : (pl = 0, gu = oa = null, Oy(l, l.pendingLanes));
      var e = l.pendingLanes;
      if (e === 0 && (ya = null), Fn(a), t = t.stateNode, tt && typeof tt.onCommitFiberRoot == "function")
        try {
          tt.onCommitFiberRoot(
            Mu,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (u !== null) {
        t = b.T, e = p.p, p.p = 2, b.T = null;
        try {
          for (var n = l.onRecoverableError, f = 0; f < u.length; f++) {
            var i = u[f];
            n(i.value, {
              componentStack: i.stack
            });
          }
        } finally {
          b.T = t, p.p = e;
        }
      }
      (wt & 3) !== 0 && Tn(), Ut(l), e = l.pendingLanes, (a & 261930) !== 0 && (e & 42) !== 0 ? l === Hi ? ce++ : (ce = 0, Hi = l) : ce = 0, se(0);
    }
  }
  function Oy(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, Lu(t)));
  }
  function Tn() {
    return zy(), Ty(), Ay(), _y();
  }
  function _y() {
    if (pl !== 5) return !1;
    var l = oa, t = Ui;
    Ui = 0;
    var a = Fn(wt), u = b.T, e = p.p;
    try {
      p.p = 32 > a ? 32 : a, b.T = null, a = Ri, Ri = null;
      var n = oa, f = wt;
      if (pl = 0, gu = oa = null, wt = 0, (ll & 6) !== 0) throw Error(o(331));
      var i = ll;
      if (ll |= 4, fy(n.current), uy(
        n,
        n.current,
        f,
        a
      ), ll = i, se(0, !1), tt && typeof tt.onPostCommitFiberRoot == "function")
        try {
          tt.onPostCommitFiberRoot(Mu, n);
        } catch {
        }
      return !0;
    } finally {
      p.p = e, b.T = u, Oy(l, t);
    }
  }
  function py(l, t, a) {
    t = dt(a, t), t = si(l.stateNode, t, 2), l = ea(l, t, 2), l !== null && (Uu(l, 2), Ut(l));
  }
  function ul(l, t, a) {
    if (l.tag === 3)
      py(l, l, a);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          py(
            t,
            l,
            a
          );
          break;
        } else if (t.tag === 1) {
          var u = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof u.componentDidCatch == "function" && (ya === null || !ya.has(u))) {
            l = dt(a, l), a = M0(2), u = ea(t, a, 2), u !== null && (D0(
              a,
              u,
              t,
              l
            ), Uu(u, 2), Ut(u));
            break;
          }
        }
        t = t.return;
      }
  }
  function Bi(l, t, a) {
    var u = l.pingCache;
    if (u === null) {
      u = l.pingCache = new ym();
      var e = /* @__PURE__ */ new Set();
      u.set(t, e);
    } else
      e = u.get(t), e === void 0 && (e = /* @__PURE__ */ new Set(), u.set(t, e));
    e.has(a) || (pi = !0, e.add(a), l = hm.bind(null, l, t, a), t.then(l, l));
  }
  function hm(l, t, a) {
    var u = l.pingCache;
    u !== null && u.delete(t), l.pingedLanes |= l.suspendedLanes & a, l.warmLanes &= ~a, ol === l && ($ & a) === a && (Sl === 4 || Sl === 3 && ($ & 62914560) === $ && 300 > lt() - Sn ? (ll & 2) === 0 && ru(l, 0) : Mi |= a, Su === $ && (Su = 0)), Ut(l);
  }
  function My(l, t) {
    t === 0 && (t = zc()), l = Ma(l, t), l !== null && (Uu(l, t), Ut(l));
  }
  function Sm(l) {
    var t = l.memoizedState, a = 0;
    t !== null && (a = t.retryLane), My(l, a);
  }
  function gm(l, t) {
    var a = 0;
    switch (l.tag) {
      case 31:
      case 13:
        var u = l.stateNode, e = l.memoizedState;
        e !== null && (a = e.retryLane);
        break;
      case 19:
        u = l.stateNode;
        break;
      case 22:
        u = l.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    u !== null && u.delete(t), My(l, a);
  }
  function rm(l, t) {
    return Jn(l, t);
  }
  var An = null, Eu = null, qi = !1, On = !1, Yi = !1, ma = 0;
  function Ut(l) {
    l !== Eu && l.next === null && (Eu === null ? An = Eu = l : Eu = Eu.next = l), On = !0, qi || (qi = !0, Em());
  }
  function se(l, t) {
    if (!Yi && On) {
      Yi = !0;
      do
        for (var a = !1, u = An; u !== null; ) {
          if (l !== 0) {
            var e = u.pendingLanes;
            if (e === 0) var n = 0;
            else {
              var f = u.suspendedLanes, i = u.pingedLanes;
              n = (1 << 31 - at(42 | l) + 1) - 1, n &= e & ~(f & ~i), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
            }
            n !== 0 && (a = !0, Hy(u, n));
          } else
            n = $, n = Me(
              u,
              u === ol ? n : 0,
              u.cancelPendingCommit !== null || u.timeoutHandle !== -1
            ), (n & 3) === 0 || Du(u, n) || (a = !0, Hy(u, n));
          u = u.next;
        }
      while (a);
      Yi = !1;
    }
  }
  function bm() {
    Dy();
  }
  function Dy() {
    On = qi = !1;
    var l = 0;
    ma !== 0 && Rm() && (l = ma);
    for (var t = lt(), a = null, u = An; u !== null; ) {
      var e = u.next, n = Uy(u, t);
      n === 0 ? (u.next = null, a === null ? An = e : a.next = e, e === null && (Eu = a)) : (a = u, (l !== 0 || (n & 3) !== 0) && (On = !0)), u = e;
    }
    pl !== 0 && pl !== 5 || se(l), ma !== 0 && (ma = 0);
  }
  function Uy(l, t) {
    for (var a = l.suspendedLanes, u = l.pingedLanes, e = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
      var f = 31 - at(n), i = 1 << f, c = e[f];
      c === -1 ? ((i & a) === 0 || (i & u) !== 0) && (e[f] = Jo(i, t)) : c <= t && (l.expiredLanes |= i), n &= ~i;
    }
    if (t = ol, a = $, a = Me(
      l,
      l === t ? a : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), u = l.callbackNode, a === 0 || l === t && (al === 2 || al === 9) || l.cancelPendingCommit !== null)
      return u !== null && u !== null && wn(u), l.callbackNode = null, l.callbackPriority = 0;
    if ((a & 3) === 0 || Du(l, a)) {
      if (t = a & -a, t === l.callbackPriority) return t;
      switch (u !== null && wn(u), Fn(a)) {
        case 2:
        case 8:
          a = bc;
          break;
        case 32:
          a = Ae;
          break;
        case 268435456:
          a = Ec;
          break;
        default:
          a = Ae;
      }
      return u = Ry.bind(null, l), a = Jn(a, u), l.callbackPriority = t, l.callbackNode = a, t;
    }
    return u !== null && u !== null && wn(u), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function Ry(l, t) {
    if (pl !== 0 && pl !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var a = l.callbackNode;
    if (Tn() && l.callbackNode !== a)
      return null;
    var u = $;
    return u = Me(
      l,
      l === ol ? u : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), u === 0 ? null : (oy(l, u, t), Uy(l, lt()), l.callbackNode != null && l.callbackNode === a ? Ry.bind(null, l) : null);
  }
  function Hy(l, t) {
    if (Tn()) return null;
    oy(l, t, !0);
  }
  function Em() {
    Nm(function() {
      (ll & 6) !== 0 ? Jn(
        rc,
        bm
      ) : Dy();
    });
  }
  function Gi() {
    if (ma === 0) {
      var l = nu;
      l === 0 && (l = Oe, Oe <<= 1, (Oe & 261888) === 0 && (Oe = 256)), ma = l;
    }
    return ma;
  }
  function Ny(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : He("" + l);
  }
  function Cy(l, t) {
    var a = t.ownerDocument.createElement("input");
    return a.name = t.name, a.value = t.value, l.id && a.setAttribute("form", l.id), t.parentNode.insertBefore(a, t), l = new FormData(l), a.parentNode.removeChild(a), l;
  }
  function zm(l, t, a, u, e) {
    if (t === "submit" && a && a.stateNode === e) {
      var n = Ny(
        (e[Kl] || null).action
      ), f = u.submitter;
      f && (t = (t = f[Kl] || null) ? Ny(t.formAction) : f.getAttribute("formAction"), t !== null && (n = t, f = null));
      var i = new qe(
        "action",
        "action",
        null,
        u,
        e
      );
      l.push({
        event: i,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (u.defaultPrevented) {
                if (ma !== 0) {
                  var c = f ? Cy(e, f) : new FormData(e);
                  ui(
                    a,
                    {
                      pending: !0,
                      data: c,
                      method: e.method,
                      action: n
                    },
                    null,
                    c
                  );
                }
              } else
                typeof n == "function" && (i.preventDefault(), c = f ? Cy(e, f) : new FormData(e), ui(
                  a,
                  {
                    pending: !0,
                    data: c,
                    method: e.method,
                    action: n
                  },
                  n,
                  c
                ));
            },
            currentTarget: e
          }
        ]
      });
    }
  }
  for (var Qi = 0; Qi < Ef.length; Qi++) {
    var ji = Ef[Qi], Tm = ji.toLowerCase(), Am = ji[0].toUpperCase() + ji.slice(1);
    Tt(
      Tm,
      "on" + Am
    );
  }
  Tt(ys, "onAnimationEnd"), Tt(os, "onAnimationIteration"), Tt(vs, "onAnimationStart"), Tt("dblclick", "onDoubleClick"), Tt("focusin", "onFocus"), Tt("focusout", "onBlur"), Tt(jv, "onTransitionRun"), Tt(Xv, "onTransitionStart"), Tt(Zv, "onTransitionCancel"), Tt(ms, "onTransitionEnd"), Ka("onMouseEnter", ["mouseout", "mouseover"]), Ka("onMouseLeave", ["mouseout", "mouseover"]), Ka("onPointerEnter", ["pointerout", "pointerover"]), Ka("onPointerLeave", ["pointerout", "pointerover"]), Aa(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Aa(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Aa("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Aa(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Aa(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Aa(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var ye = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Om = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ye)
  );
  function By(l, t) {
    t = (t & 4) !== 0;
    for (var a = 0; a < l.length; a++) {
      var u = l[a], e = u.event;
      u = u.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var f = u.length - 1; 0 <= f; f--) {
            var i = u[f], c = i.instance, d = i.currentTarget;
            if (i = i.listener, c !== n && e.isPropagationStopped())
              break l;
            n = i, e.currentTarget = d;
            try {
              n(e);
            } catch (r) {
              Qe(r);
            }
            e.currentTarget = null, n = c;
          }
        else
          for (f = 0; f < u.length; f++) {
            if (i = u[f], c = i.instance, d = i.currentTarget, i = i.listener, c !== n && e.isPropagationStopped())
              break l;
            n = i, e.currentTarget = d;
            try {
              n(e);
            } catch (r) {
              Qe(r);
            }
            e.currentTarget = null, n = c;
          }
      }
    }
  }
  function w(l, t) {
    var a = t[kn];
    a === void 0 && (a = t[kn] = /* @__PURE__ */ new Set());
    var u = l + "__bubble";
    a.has(u) || (qy(t, l, 2, !1), a.add(u));
  }
  function Xi(l, t, a) {
    var u = 0;
    t && (u |= 4), qy(
      a,
      l,
      u,
      t
    );
  }
  var _n = "_reactListening" + Math.random().toString(36).slice(2);
  function Zi(l) {
    if (!l[_n]) {
      l[_n] = !0, Dc.forEach(function(a) {
        a !== "selectionchange" && (Om.has(a) || Xi(a, !1, l), Xi(a, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[_n] || (t[_n] = !0, Xi("selectionchange", !1, t));
    }
  }
  function qy(l, t, a, u) {
    switch (yo(t)) {
      case 2:
        var e = Im;
        break;
      case 8:
        e = Pm;
        break;
      default:
        e = ac;
    }
    a = e.bind(
      null,
      t,
      a,
      l
    ), e = void 0, !ff || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (e = !0), u ? e !== void 0 ? l.addEventListener(t, a, {
      capture: !0,
      passive: e
    }) : l.addEventListener(t, a, !0) : e !== void 0 ? l.addEventListener(t, a, {
      passive: e
    }) : l.addEventListener(t, a, !1);
  }
  function xi(l, t, a, u, e) {
    var n = u;
    if ((t & 1) === 0 && (t & 2) === 0 && u !== null)
      l: for (; ; ) {
        if (u === null) return;
        var f = u.tag;
        if (f === 3 || f === 4) {
          var i = u.stateNode.containerInfo;
          if (i === e) break;
          if (f === 4)
            for (f = u.return; f !== null; ) {
              var c = f.tag;
              if ((c === 3 || c === 4) && f.stateNode.containerInfo === e)
                return;
              f = f.return;
            }
          for (; i !== null; ) {
            if (f = xa(i), f === null) return;
            if (c = f.tag, c === 5 || c === 6 || c === 26 || c === 27) {
              u = n = f;
              continue l;
            }
            i = i.parentNode;
          }
        }
        u = u.return;
      }
    Xc(function() {
      var d = n, r = ef(a), z = [];
      l: {
        var h = ds.get(l);
        if (h !== void 0) {
          var g = qe, D = l;
          switch (l) {
            case "keypress":
              if (Ce(a) === 0) break l;
            case "keydown":
            case "keyup":
              g = gv;
              break;
            case "focusin":
              D = "focus", g = of;
              break;
            case "focusout":
              D = "blur", g = of;
              break;
            case "beforeblur":
            case "afterblur":
              g = of;
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
              g = Lc;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              g = nv;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              g = Ev;
              break;
            case ys:
            case os:
            case vs:
              g = cv;
              break;
            case ms:
              g = Tv;
              break;
            case "scroll":
            case "scrollend":
              g = uv;
              break;
            case "wheel":
              g = Ov;
              break;
            case "copy":
            case "cut":
            case "paste":
              g = yv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              g = Kc;
              break;
            case "toggle":
            case "beforetoggle":
              g = pv;
          }
          var Y = (t & 4) !== 0, cl = !Y && (l === "scroll" || l === "scrollend"), v = Y ? h !== null ? h + "Capture" : null : h;
          Y = [];
          for (var s = d, m; s !== null; ) {
            var E = s;
            if (m = E.stateNode, E = E.tag, E !== 5 && E !== 26 && E !== 27 || m === null || v === null || (E = Nu(s, v), E != null && Y.push(
              oe(s, E, m)
            )), cl) break;
            s = s.return;
          }
          0 < Y.length && (h = new g(
            h,
            D,
            null,
            a,
            r
          ), z.push({ event: h, listeners: Y }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (h = l === "mouseover" || l === "pointerover", g = l === "mouseout" || l === "pointerout", h && a !== uf && (D = a.relatedTarget || a.fromElement) && (xa(D) || D[Za]))
            break l;
          if ((g || h) && (h = r.window === r ? r : (h = r.ownerDocument) ? h.defaultView || h.parentWindow : window, g ? (D = a.relatedTarget || a.toElement, g = d, D = D ? xa(D) : null, D !== null && (cl = N(D), Y = D.tag, D !== cl || Y !== 5 && Y !== 27 && Y !== 6) && (D = null)) : (g = null, D = d), g !== D)) {
            if (Y = Lc, E = "onMouseLeave", v = "onMouseEnter", s = "mouse", (l === "pointerout" || l === "pointerover") && (Y = Kc, E = "onPointerLeave", v = "onPointerEnter", s = "pointer"), cl = g == null ? h : Hu(g), m = D == null ? h : Hu(D), h = new Y(
              E,
              s + "leave",
              g,
              a,
              r
            ), h.target = cl, h.relatedTarget = m, E = null, xa(r) === d && (Y = new Y(
              v,
              s + "enter",
              D,
              a,
              r
            ), Y.target = m, Y.relatedTarget = cl, E = Y), cl = E, g && D)
              t: {
                for (Y = _m, v = g, s = D, m = 0, E = v; E; E = Y(E))
                  m++;
                E = 0;
                for (var C = s; C; C = Y(C))
                  E++;
                for (; 0 < m - E; )
                  v = Y(v), m--;
                for (; 0 < E - m; )
                  s = Y(s), E--;
                for (; m--; ) {
                  if (v === s || s !== null && v === s.alternate) {
                    Y = v;
                    break t;
                  }
                  v = Y(v), s = Y(s);
                }
                Y = null;
              }
            else Y = null;
            g !== null && Yy(
              z,
              h,
              g,
              Y,
              !1
            ), D !== null && cl !== null && Yy(
              z,
              cl,
              D,
              Y,
              !0
            );
          }
        }
        l: {
          if (h = d ? Hu(d) : window, g = h.nodeName && h.nodeName.toLowerCase(), g === "select" || g === "input" && h.type === "file")
            var I = Pc;
          else if (kc(h))
            if (ls)
              I = Yv;
            else {
              I = Bv;
              var H = Cv;
            }
          else
            g = h.nodeName, !g || g.toLowerCase() !== "input" || h.type !== "checkbox" && h.type !== "radio" ? d && af(d.elementType) && (I = Pc) : I = qv;
          if (I && (I = I(l, d))) {
            Ic(
              z,
              I,
              a,
              r
            );
            break l;
          }
          H && H(l, h, d), l === "focusout" && d && h.type === "number" && d.memoizedProps.value != null && tf(h, "number", h.value);
        }
        switch (H = d ? Hu(d) : window, l) {
          case "focusin":
            (kc(H) || H.contentEditable === "true") && (ka = H, gf = d, Xu = null);
            break;
          case "focusout":
            Xu = gf = ka = null;
            break;
          case "mousedown":
            rf = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            rf = !1, cs(z, a, r);
            break;
          case "selectionchange":
            if (Qv) break;
          case "keydown":
          case "keyup":
            cs(z, a, r);
        }
        var Z;
        if (mf)
          l: {
            switch (l) {
              case "compositionstart":
                var W = "onCompositionStart";
                break l;
              case "compositionend":
                W = "onCompositionEnd";
                break l;
              case "compositionupdate":
                W = "onCompositionUpdate";
                break l;
            }
            W = void 0;
          }
        else
          Fa ? Wc(l, a) && (W = "onCompositionEnd") : l === "keydown" && a.keyCode === 229 && (W = "onCompositionStart");
        W && (Jc && a.locale !== "ko" && (Fa || W !== "onCompositionStart" ? W === "onCompositionEnd" && Fa && (Z = Zc()) : (kt = r, cf = "value" in kt ? kt.value : kt.textContent, Fa = !0)), H = pn(d, W), 0 < H.length && (W = new Vc(
          W,
          l,
          null,
          a,
          r
        ), z.push({ event: W, listeners: H }), Z ? W.data = Z : (Z = Fc(a), Z !== null && (W.data = Z)))), (Z = Dv ? Uv(l, a) : Rv(l, a)) && (W = pn(d, "onBeforeInput"), 0 < W.length && (H = new Vc(
          "onBeforeInput",
          "beforeinput",
          null,
          a,
          r
        ), z.push({
          event: H,
          listeners: W
        }), H.data = Z)), zm(
          z,
          l,
          d,
          a,
          r
        );
      }
      By(z, t);
    });
  }
  function oe(l, t, a) {
    return {
      instance: l,
      listener: t,
      currentTarget: a
    };
  }
  function pn(l, t) {
    for (var a = t + "Capture", u = []; l !== null; ) {
      var e = l, n = e.stateNode;
      if (e = e.tag, e !== 5 && e !== 26 && e !== 27 || n === null || (e = Nu(l, a), e != null && u.unshift(
        oe(l, e, n)
      ), e = Nu(l, t), e != null && u.push(
        oe(l, e, n)
      )), l.tag === 3) return u;
      l = l.return;
    }
    return [];
  }
  function _m(l) {
    if (l === null) return null;
    do
      l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function Yy(l, t, a, u, e) {
    for (var n = t._reactName, f = []; a !== null && a !== u; ) {
      var i = a, c = i.alternate, d = i.stateNode;
      if (i = i.tag, c !== null && c === u) break;
      i !== 5 && i !== 26 && i !== 27 || d === null || (c = d, e ? (d = Nu(a, n), d != null && f.unshift(
        oe(a, d, c)
      )) : e || (d = Nu(a, n), d != null && f.push(
        oe(a, d, c)
      ))), a = a.return;
    }
    f.length !== 0 && l.push({ event: t, listeners: f });
  }
  var pm = /\r\n?/g, Mm = /\u0000|\uFFFD/g;
  function Gy(l) {
    return (typeof l == "string" ? l : "" + l).replace(pm, `
`).replace(Mm, "");
  }
  function Qy(l, t) {
    return t = Gy(t), Gy(l) === t;
  }
  function il(l, t, a, u, e, n) {
    switch (a) {
      case "children":
        typeof u == "string" ? t === "body" || t === "textarea" && u === "" || wa(l, u) : (typeof u == "number" || typeof u == "bigint") && t !== "body" && wa(l, "" + u);
        break;
      case "className":
        Ue(l, "class", u);
        break;
      case "tabIndex":
        Ue(l, "tabindex", u);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ue(l, a, u);
        break;
      case "style":
        Qc(l, u, n);
        break;
      case "data":
        if (t !== "object") {
          Ue(l, "data", u);
          break;
        }
      case "src":
      case "href":
        if (u === "" && (t !== "a" || a !== "href")) {
          l.removeAttribute(a);
          break;
        }
        if (u == null || typeof u == "function" || typeof u == "symbol" || typeof u == "boolean") {
          l.removeAttribute(a);
          break;
        }
        u = He("" + u), l.setAttribute(a, u);
        break;
      case "action":
      case "formAction":
        if (typeof u == "function") {
          l.setAttribute(
            a,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof n == "function" && (a === "formAction" ? (t !== "input" && il(l, t, "name", e.name, e, null), il(
            l,
            t,
            "formEncType",
            e.formEncType,
            e,
            null
          ), il(
            l,
            t,
            "formMethod",
            e.formMethod,
            e,
            null
          ), il(
            l,
            t,
            "formTarget",
            e.formTarget,
            e,
            null
          )) : (il(l, t, "encType", e.encType, e, null), il(l, t, "method", e.method, e, null), il(l, t, "target", e.target, e, null)));
        if (u == null || typeof u == "symbol" || typeof u == "boolean") {
          l.removeAttribute(a);
          break;
        }
        u = He("" + u), l.setAttribute(a, u);
        break;
      case "onClick":
        u != null && (l.onclick = Nt);
        break;
      case "onScroll":
        u != null && w("scroll", l);
        break;
      case "onScrollEnd":
        u != null && w("scrollend", l);
        break;
      case "dangerouslySetInnerHTML":
        if (u != null) {
          if (typeof u != "object" || !("__html" in u))
            throw Error(o(61));
          if (a = u.__html, a != null) {
            if (e.children != null) throw Error(o(60));
            l.innerHTML = a;
          }
        }
        break;
      case "multiple":
        l.multiple = u && typeof u != "function" && typeof u != "symbol";
        break;
      case "muted":
        l.muted = u && typeof u != "function" && typeof u != "symbol";
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
        if (u == null || typeof u == "function" || typeof u == "boolean" || typeof u == "symbol") {
          l.removeAttribute("xlink:href");
          break;
        }
        a = He("" + u), l.setAttributeNS(
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
        u != null && typeof u != "function" && typeof u != "symbol" ? l.setAttribute(a, "" + u) : l.removeAttribute(a);
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
        u && typeof u != "function" && typeof u != "symbol" ? l.setAttribute(a, "") : l.removeAttribute(a);
        break;
      case "capture":
      case "download":
        u === !0 ? l.setAttribute(a, "") : u !== !1 && u != null && typeof u != "function" && typeof u != "symbol" ? l.setAttribute(a, u) : l.removeAttribute(a);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        u != null && typeof u != "function" && typeof u != "symbol" && !isNaN(u) && 1 <= u ? l.setAttribute(a, u) : l.removeAttribute(a);
        break;
      case "rowSpan":
      case "start":
        u == null || typeof u == "function" || typeof u == "symbol" || isNaN(u) ? l.removeAttribute(a) : l.setAttribute(a, u);
        break;
      case "popover":
        w("beforetoggle", l), w("toggle", l), De(l, "popover", u);
        break;
      case "xlinkActuate":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          u
        );
        break;
      case "xlinkArcrole":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          u
        );
        break;
      case "xlinkRole":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          u
        );
        break;
      case "xlinkShow":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          u
        );
        break;
      case "xlinkTitle":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          u
        );
        break;
      case "xlinkType":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          u
        );
        break;
      case "xmlBase":
        Ht(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          u
        );
        break;
      case "xmlLang":
        Ht(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          u
        );
        break;
      case "xmlSpace":
        Ht(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          u
        );
        break;
      case "is":
        De(l, "is", u);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = tv.get(a) || a, De(l, a, u));
    }
  }
  function Li(l, t, a, u, e, n) {
    switch (a) {
      case "style":
        Qc(l, u, n);
        break;
      case "dangerouslySetInnerHTML":
        if (u != null) {
          if (typeof u != "object" || !("__html" in u))
            throw Error(o(61));
          if (a = u.__html, a != null) {
            if (e.children != null) throw Error(o(60));
            l.innerHTML = a;
          }
        }
        break;
      case "children":
        typeof u == "string" ? wa(l, u) : (typeof u == "number" || typeof u == "bigint") && wa(l, "" + u);
        break;
      case "onScroll":
        u != null && w("scroll", l);
        break;
      case "onScrollEnd":
        u != null && w("scrollend", l);
        break;
      case "onClick":
        u != null && (l.onclick = Nt);
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
        if (!Uc.hasOwnProperty(a))
          l: {
            if (a[0] === "o" && a[1] === "n" && (e = a.endsWith("Capture"), t = a.slice(2, e ? a.length - 7 : void 0), n = l[Kl] || null, n = n != null ? n[a] : null, typeof n == "function" && l.removeEventListener(t, n, e), typeof u == "function")) {
              typeof n != "function" && n !== null && (a in l ? l[a] = null : l.hasAttribute(a) && l.removeAttribute(a)), l.addEventListener(t, u, e);
              break l;
            }
            a in l ? l[a] = u : u === !0 ? l.setAttribute(a, "") : De(l, a, u);
          }
    }
  }
  function ql(l, t, a) {
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
        w("error", l), w("load", l);
        var u = !1, e = !1, n;
        for (n in a)
          if (a.hasOwnProperty(n)) {
            var f = a[n];
            if (f != null)
              switch (n) {
                case "src":
                  u = !0;
                  break;
                case "srcSet":
                  e = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  il(l, t, n, f, a, null);
              }
          }
        e && il(l, t, "srcSet", a.srcSet, a, null), u && il(l, t, "src", a.src, a, null);
        return;
      case "input":
        w("invalid", l);
        var i = n = f = e = null, c = null, d = null;
        for (u in a)
          if (a.hasOwnProperty(u)) {
            var r = a[u];
            if (r != null)
              switch (u) {
                case "name":
                  e = r;
                  break;
                case "type":
                  f = r;
                  break;
                case "checked":
                  c = r;
                  break;
                case "defaultChecked":
                  d = r;
                  break;
                case "value":
                  n = r;
                  break;
                case "defaultValue":
                  i = r;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (r != null)
                    throw Error(o(137, t));
                  break;
                default:
                  il(l, t, u, r, a, null);
              }
          }
        Bc(
          l,
          n,
          i,
          c,
          d,
          f,
          e,
          !1
        );
        return;
      case "select":
        w("invalid", l), u = f = n = null;
        for (e in a)
          if (a.hasOwnProperty(e) && (i = a[e], i != null))
            switch (e) {
              case "value":
                n = i;
                break;
              case "defaultValue":
                f = i;
                break;
              case "multiple":
                u = i;
              default:
                il(l, t, e, i, a, null);
            }
        t = n, a = f, l.multiple = !!u, t != null ? Ja(l, !!u, t, !1) : a != null && Ja(l, !!u, a, !0);
        return;
      case "textarea":
        w("invalid", l), n = e = u = null;
        for (f in a)
          if (a.hasOwnProperty(f) && (i = a[f], i != null))
            switch (f) {
              case "value":
                u = i;
                break;
              case "defaultValue":
                e = i;
                break;
              case "children":
                n = i;
                break;
              case "dangerouslySetInnerHTML":
                if (i != null) throw Error(o(91));
                break;
              default:
                il(l, t, f, i, a, null);
            }
        Yc(l, u, e, n);
        return;
      case "option":
        for (c in a)
          if (a.hasOwnProperty(c) && (u = a[c], u != null))
            switch (c) {
              case "selected":
                l.selected = u && typeof u != "function" && typeof u != "symbol";
                break;
              default:
                il(l, t, c, u, a, null);
            }
        return;
      case "dialog":
        w("beforetoggle", l), w("toggle", l), w("cancel", l), w("close", l);
        break;
      case "iframe":
      case "object":
        w("load", l);
        break;
      case "video":
      case "audio":
        for (u = 0; u < ye.length; u++)
          w(ye[u], l);
        break;
      case "image":
        w("error", l), w("load", l);
        break;
      case "details":
        w("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        w("error", l), w("load", l);
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
        for (d in a)
          if (a.hasOwnProperty(d) && (u = a[d], u != null))
            switch (d) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                il(l, t, d, u, a, null);
            }
        return;
      default:
        if (af(t)) {
          for (r in a)
            a.hasOwnProperty(r) && (u = a[r], u !== void 0 && Li(
              l,
              t,
              r,
              u,
              a,
              void 0
            ));
          return;
        }
    }
    for (i in a)
      a.hasOwnProperty(i) && (u = a[i], u != null && il(l, t, i, u, a, null));
  }
  function Dm(l, t, a, u) {
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
        var e = null, n = null, f = null, i = null, c = null, d = null, r = null;
        for (g in a) {
          var z = a[g];
          if (a.hasOwnProperty(g) && z != null)
            switch (g) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                c = z;
              default:
                u.hasOwnProperty(g) || il(l, t, g, null, u, z);
            }
        }
        for (var h in u) {
          var g = u[h];
          if (z = a[h], u.hasOwnProperty(h) && (g != null || z != null))
            switch (h) {
              case "type":
                n = g;
                break;
              case "name":
                e = g;
                break;
              case "checked":
                d = g;
                break;
              case "defaultChecked":
                r = g;
                break;
              case "value":
                f = g;
                break;
              case "defaultValue":
                i = g;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (g != null)
                  throw Error(o(137, t));
                break;
              default:
                g !== z && il(
                  l,
                  t,
                  h,
                  g,
                  u,
                  z
                );
            }
        }
        lf(
          l,
          f,
          i,
          c,
          d,
          r,
          n,
          e
        );
        return;
      case "select":
        g = f = i = h = null;
        for (n in a)
          if (c = a[n], a.hasOwnProperty(n) && c != null)
            switch (n) {
              case "value":
                break;
              case "multiple":
                g = c;
              default:
                u.hasOwnProperty(n) || il(
                  l,
                  t,
                  n,
                  null,
                  u,
                  c
                );
            }
        for (e in u)
          if (n = u[e], c = a[e], u.hasOwnProperty(e) && (n != null || c != null))
            switch (e) {
              case "value":
                h = n;
                break;
              case "defaultValue":
                i = n;
                break;
              case "multiple":
                f = n;
              default:
                n !== c && il(
                  l,
                  t,
                  e,
                  n,
                  u,
                  c
                );
            }
        t = i, a = f, u = g, h != null ? Ja(l, !!a, h, !1) : !!u != !!a && (t != null ? Ja(l, !!a, t, !0) : Ja(l, !!a, a ? [] : "", !1));
        return;
      case "textarea":
        g = h = null;
        for (i in a)
          if (e = a[i], a.hasOwnProperty(i) && e != null && !u.hasOwnProperty(i))
            switch (i) {
              case "value":
                break;
              case "children":
                break;
              default:
                il(l, t, i, null, u, e);
            }
        for (f in u)
          if (e = u[f], n = a[f], u.hasOwnProperty(f) && (e != null || n != null))
            switch (f) {
              case "value":
                h = e;
                break;
              case "defaultValue":
                g = e;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (e != null) throw Error(o(91));
                break;
              default:
                e !== n && il(l, t, f, e, u, n);
            }
        qc(l, h, g);
        return;
      case "option":
        for (var D in a)
          if (h = a[D], a.hasOwnProperty(D) && h != null && !u.hasOwnProperty(D))
            switch (D) {
              case "selected":
                l.selected = !1;
                break;
              default:
                il(
                  l,
                  t,
                  D,
                  null,
                  u,
                  h
                );
            }
        for (c in u)
          if (h = u[c], g = a[c], u.hasOwnProperty(c) && h !== g && (h != null || g != null))
            switch (c) {
              case "selected":
                l.selected = h && typeof h != "function" && typeof h != "symbol";
                break;
              default:
                il(
                  l,
                  t,
                  c,
                  h,
                  u,
                  g
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
        for (var Y in a)
          h = a[Y], a.hasOwnProperty(Y) && h != null && !u.hasOwnProperty(Y) && il(l, t, Y, null, u, h);
        for (d in u)
          if (h = u[d], g = a[d], u.hasOwnProperty(d) && h !== g && (h != null || g != null))
            switch (d) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (h != null)
                  throw Error(o(137, t));
                break;
              default:
                il(
                  l,
                  t,
                  d,
                  h,
                  u,
                  g
                );
            }
        return;
      default:
        if (af(t)) {
          for (var cl in a)
            h = a[cl], a.hasOwnProperty(cl) && h !== void 0 && !u.hasOwnProperty(cl) && Li(
              l,
              t,
              cl,
              void 0,
              u,
              h
            );
          for (r in u)
            h = u[r], g = a[r], !u.hasOwnProperty(r) || h === g || h === void 0 && g === void 0 || Li(
              l,
              t,
              r,
              h,
              u,
              g
            );
          return;
        }
    }
    for (var v in a)
      h = a[v], a.hasOwnProperty(v) && h != null && !u.hasOwnProperty(v) && il(l, t, v, null, u, h);
    for (z in u)
      h = u[z], g = a[z], !u.hasOwnProperty(z) || h === g || h == null && g == null || il(l, t, z, h, u, g);
  }
  function jy(l) {
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
  function Um() {
    if (typeof performance.getEntriesByType == "function") {
      for (var l = 0, t = 0, a = performance.getEntriesByType("resource"), u = 0; u < a.length; u++) {
        var e = a[u], n = e.transferSize, f = e.initiatorType, i = e.duration;
        if (n && i && jy(f)) {
          for (f = 0, i = e.responseEnd, u += 1; u < a.length; u++) {
            var c = a[u], d = c.startTime;
            if (d > i) break;
            var r = c.transferSize, z = c.initiatorType;
            r && jy(z) && (c = c.responseEnd, f += r * (c < i ? 1 : (i - d) / (c - d)));
          }
          if (--u, t += 8 * (n + f) / (e.duration / 1e3), l++, 10 < l) break;
        }
      }
      if (0 < l) return t / l / 1e6;
    }
    return navigator.connection && (l = navigator.connection.downlink, typeof l == "number") ? l : 5;
  }
  var Vi = null, Ki = null;
  function Mn(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function Xy(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Zy(l, t) {
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
  function Ji(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var wi = null;
  function Rm() {
    var l = window.event;
    return l && l.type === "popstate" ? l === wi ? !1 : (wi = l, !0) : (wi = null, !1);
  }
  var xy = typeof setTimeout == "function" ? setTimeout : void 0, Hm = typeof clearTimeout == "function" ? clearTimeout : void 0, Ly = typeof Promise == "function" ? Promise : void 0, Nm = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ly < "u" ? function(l) {
    return Ly.resolve(null).then(l).catch(Cm);
  } : xy;
  function Cm(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function da(l) {
    return l === "head";
  }
  function Vy(l, t) {
    var a = t, u = 0;
    do {
      var e = a.nextSibling;
      if (l.removeChild(a), e && e.nodeType === 8)
        if (a = e.data, a === "/$" || a === "/&") {
          if (u === 0) {
            l.removeChild(e), Ou(t);
            return;
          }
          u--;
        } else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&")
          u++;
        else if (a === "html")
          ve(l.ownerDocument.documentElement);
        else if (a === "head") {
          a = l.ownerDocument.head, ve(a);
          for (var n = a.firstChild; n; ) {
            var f = n.nextSibling, i = n.nodeName;
            n[Ru] || i === "SCRIPT" || i === "STYLE" || i === "LINK" && n.rel.toLowerCase() === "stylesheet" || a.removeChild(n), n = f;
          }
        } else
          a === "body" && ve(l.ownerDocument.body);
      a = e;
    } while (a);
    Ou(t);
  }
  function Ky(l, t) {
    var a = l;
    l = 0;
    do {
      var u = a.nextSibling;
      if (a.nodeType === 1 ? t ? (a._stashedDisplay = a.style.display, a.style.display = "none") : (a.style.display = a._stashedDisplay || "", a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (t ? (a._stashedText = a.nodeValue, a.nodeValue = "") : a.nodeValue = a._stashedText || ""), u && u.nodeType === 8)
        if (a = u.data, a === "/$") {
          if (l === 0) break;
          l--;
        } else
          a !== "$" && a !== "$?" && a !== "$~" && a !== "$!" || l++;
      a = u;
    } while (a);
  }
  function $i(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var a = t;
      switch (t = t.nextSibling, a.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          $i(a), In(a);
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
  function Bm(l, t, a, u) {
    for (; l.nodeType === 1; ) {
      var e = a;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!u && (l.nodeName !== "INPUT" || l.type !== "hidden"))
          break;
      } else if (u) {
        if (!l[Ru])
          switch (t) {
            case "meta":
              if (!l.hasAttribute("itemprop")) break;
              return l;
            case "link":
              if (n = l.getAttribute("rel"), n === "stylesheet" && l.hasAttribute("data-precedence"))
                break;
              if (n !== e.rel || l.getAttribute("href") !== (e.href == null || e.href === "" ? null : e.href) || l.getAttribute("crossorigin") !== (e.crossOrigin == null ? null : e.crossOrigin) || l.getAttribute("title") !== (e.title == null ? null : e.title))
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (n = l.getAttribute("src"), (n !== (e.src == null ? null : e.src) || l.getAttribute("type") !== (e.type == null ? null : e.type) || l.getAttribute("crossorigin") !== (e.crossOrigin == null ? null : e.crossOrigin)) && n && l.hasAttribute("async") && !l.hasAttribute("itemprop"))
                break;
              return l;
            default:
              return l;
          }
      } else if (t === "input" && l.type === "hidden") {
        var n = e.name == null ? null : "" + e.name;
        if (e.type === "hidden" && l.getAttribute("name") === n)
          return l;
      } else return l;
      if (l = bt(l.nextSibling), l === null) break;
    }
    return null;
  }
  function qm(l, t, a) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !a || (l = bt(l.nextSibling), l === null)) return null;
    return l;
  }
  function Jy(l, t) {
    for (; l.nodeType !== 8; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !t || (l = bt(l.nextSibling), l === null)) return null;
    return l;
  }
  function Wi(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function Fi(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState !== "loading";
  }
  function Ym(l, t) {
    var a = l.ownerDocument;
    if (l.data === "$~") l._reactRetry = t;
    else if (l.data !== "$?" || a.readyState !== "loading")
      t();
    else {
      var u = function() {
        t(), a.removeEventListener("DOMContentLoaded", u);
      };
      a.addEventListener("DOMContentLoaded", u), l._reactRetry = u;
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
  var ki = null;
  function wy(l) {
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
  function $y(l) {
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
  function Wy(l, t, a) {
    switch (t = Mn(a), l) {
      case "html":
        if (l = t.documentElement, !l) throw Error(o(452));
        return l;
      case "head":
        if (l = t.head, !l) throw Error(o(453));
        return l;
      case "body":
        if (l = t.body, !l) throw Error(o(454));
        return l;
      default:
        throw Error(o(451));
    }
  }
  function ve(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    In(l);
  }
  var Et = /* @__PURE__ */ new Map(), Fy = /* @__PURE__ */ new Set();
  function Dn(l) {
    return typeof l.getRootNode == "function" ? l.getRootNode() : l.nodeType === 9 ? l : l.ownerDocument;
  }
  var $t = p.d;
  p.d = {
    f: Gm,
    r: Qm,
    D: jm,
    C: Xm,
    L: Zm,
    m: xm,
    X: Vm,
    S: Lm,
    M: Km
  };
  function Gm() {
    var l = $t.f(), t = bn();
    return l || t;
  }
  function Qm(l) {
    var t = La(l);
    t !== null && t.tag === 5 && t.type === "form" ? m0(t) : $t.r(l);
  }
  var zu = typeof document > "u" ? null : document;
  function ky(l, t, a) {
    var u = zu;
    if (u && typeof t == "string" && t) {
      var e = vt(t);
      e = 'link[rel="' + l + '"][href="' + e + '"]', typeof a == "string" && (e += '[crossorigin="' + a + '"]'), Fy.has(e) || (Fy.add(e), l = { rel: l, crossOrigin: a, href: t }, u.querySelector(e) === null && (t = u.createElement("link"), ql(t, "link", l), Ul(t), u.head.appendChild(t)));
    }
  }
  function jm(l) {
    $t.D(l), ky("dns-prefetch", l, null);
  }
  function Xm(l, t) {
    $t.C(l, t), ky("preconnect", l, t);
  }
  function Zm(l, t, a) {
    $t.L(l, t, a);
    var u = zu;
    if (u && l && t) {
      var e = 'link[rel="preload"][as="' + vt(t) + '"]';
      t === "image" && a && a.imageSrcSet ? (e += '[imagesrcset="' + vt(
        a.imageSrcSet
      ) + '"]', typeof a.imageSizes == "string" && (e += '[imagesizes="' + vt(
        a.imageSizes
      ) + '"]')) : e += '[href="' + vt(l) + '"]';
      var n = e;
      switch (t) {
        case "style":
          n = Tu(l);
          break;
        case "script":
          n = Au(l);
      }
      Et.has(n) || (l = B(
        {
          rel: "preload",
          href: t === "image" && a && a.imageSrcSet ? void 0 : l,
          as: t
        },
        a
      ), Et.set(n, l), u.querySelector(e) !== null || t === "style" && u.querySelector(me(n)) || t === "script" && u.querySelector(de(n)) || (t = u.createElement("link"), ql(t, "link", l), Ul(t), u.head.appendChild(t)));
    }
  }
  function xm(l, t) {
    $t.m(l, t);
    var a = zu;
    if (a && l) {
      var u = t && typeof t.as == "string" ? t.as : "script", e = 'link[rel="modulepreload"][as="' + vt(u) + '"][href="' + vt(l) + '"]', n = e;
      switch (u) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = Au(l);
      }
      if (!Et.has(n) && (l = B({ rel: "modulepreload", href: l }, t), Et.set(n, l), a.querySelector(e) === null)) {
        switch (u) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (a.querySelector(de(n)))
              return;
        }
        u = a.createElement("link"), ql(u, "link", l), Ul(u), a.head.appendChild(u);
      }
    }
  }
  function Lm(l, t, a) {
    $t.S(l, t, a);
    var u = zu;
    if (u && l) {
      var e = Va(u).hoistableStyles, n = Tu(l);
      t = t || "default";
      var f = e.get(n);
      if (!f) {
        var i = { loading: 0, preload: null };
        if (f = u.querySelector(
          me(n)
        ))
          i.loading = 5;
        else {
          l = B(
            { rel: "stylesheet", href: l, "data-precedence": t },
            a
          ), (a = Et.get(n)) && Ii(l, a);
          var c = f = u.createElement("link");
          Ul(c), ql(c, "link", l), c._p = new Promise(function(d, r) {
            c.onload = d, c.onerror = r;
          }), c.addEventListener("load", function() {
            i.loading |= 1;
          }), c.addEventListener("error", function() {
            i.loading |= 2;
          }), i.loading |= 4, Un(f, t, u);
        }
        f = {
          type: "stylesheet",
          instance: f,
          count: 1,
          state: i
        }, e.set(n, f);
      }
    }
  }
  function Vm(l, t) {
    $t.X(l, t);
    var a = zu;
    if (a && l) {
      var u = Va(a).hoistableScripts, e = Au(l), n = u.get(e);
      n || (n = a.querySelector(de(e)), n || (l = B({ src: l, async: !0 }, t), (t = Et.get(e)) && Pi(l, t), n = a.createElement("script"), Ul(n), ql(n, "link", l), a.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, u.set(e, n));
    }
  }
  function Km(l, t) {
    $t.M(l, t);
    var a = zu;
    if (a && l) {
      var u = Va(a).hoistableScripts, e = Au(l), n = u.get(e);
      n || (n = a.querySelector(de(e)), n || (l = B({ src: l, async: !0, type: "module" }, t), (t = Et.get(e)) && Pi(l, t), n = a.createElement("script"), Ul(n), ql(n, "link", l), a.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, u.set(e, n));
    }
  }
  function Iy(l, t, a, u) {
    var e = (e = K.current) ? Dn(e) : null;
    if (!e) throw Error(o(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof a.precedence == "string" && typeof a.href == "string" ? (t = Tu(a.href), a = Va(
          e
        ).hoistableStyles, u = a.get(t), u || (u = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, u)), u) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
          l = Tu(a.href);
          var n = Va(
            e
          ).hoistableStyles, f = n.get(l);
          if (f || (e = e.ownerDocument || e, f = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, n.set(l, f), (n = e.querySelector(
            me(l)
          )) && !n._p && (f.instance = n, f.state.loading = 5), Et.has(l) || (a = {
            rel: "preload",
            as: "style",
            href: a.href,
            crossOrigin: a.crossOrigin,
            integrity: a.integrity,
            media: a.media,
            hrefLang: a.hrefLang,
            referrerPolicy: a.referrerPolicy
          }, Et.set(l, a), n || Jm(
            e,
            l,
            a,
            f.state
          ))), t && u === null)
            throw Error(o(528, ""));
          return f;
        }
        if (t && u !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return t = a.async, a = a.src, typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Au(a), a = Va(
          e
        ).hoistableScripts, u = a.get(t), u || (u = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, u)), u) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, l));
    }
  }
  function Tu(l) {
    return 'href="' + vt(l) + '"';
  }
  function me(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function Py(l) {
    return B({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function Jm(l, t, a, u) {
    l.querySelector('link[rel="preload"][as="style"][' + t + "]") ? u.loading = 1 : (t = l.createElement("link"), u.preload = t, t.addEventListener("load", function() {
      return u.loading |= 1;
    }), t.addEventListener("error", function() {
      return u.loading |= 2;
    }), ql(t, "link", a), Ul(t), l.head.appendChild(t));
  }
  function Au(l) {
    return '[src="' + vt(l) + '"]';
  }
  function de(l) {
    return "script[async]" + l;
  }
  function lo(l, t, a) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var u = l.querySelector(
            'style[data-href~="' + vt(a.href) + '"]'
          );
          if (u)
            return t.instance = u, Ul(u), u;
          var e = B({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null
          });
          return u = (l.ownerDocument || l).createElement(
            "style"
          ), Ul(u), ql(u, "style", e), Un(u, a.precedence, l), t.instance = u;
        case "stylesheet":
          e = Tu(a.href);
          var n = l.querySelector(
            me(e)
          );
          if (n)
            return t.state.loading |= 4, t.instance = n, Ul(n), n;
          u = Py(a), (e = Et.get(e)) && Ii(u, e), n = (l.ownerDocument || l).createElement("link"), Ul(n);
          var f = n;
          return f._p = new Promise(function(i, c) {
            f.onload = i, f.onerror = c;
          }), ql(n, "link", u), t.state.loading |= 4, Un(n, a.precedence, l), t.instance = n;
        case "script":
          return n = Au(a.src), (e = l.querySelector(
            de(n)
          )) ? (t.instance = e, Ul(e), e) : (u = a, (e = Et.get(n)) && (u = B({}, a), Pi(u, e)), l = l.ownerDocument || l, e = l.createElement("script"), Ul(e), ql(e, "link", u), l.head.appendChild(e), t.instance = e);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (u = t.instance, t.state.loading |= 4, Un(u, a.precedence, l));
    return t.instance;
  }
  function Un(l, t, a) {
    for (var u = a.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), e = u.length ? u[u.length - 1] : null, n = e, f = 0; f < u.length; f++) {
      var i = u[f];
      if (i.dataset.precedence === t) n = i;
      else if (n !== e) break;
    }
    n ? n.parentNode.insertBefore(l, n.nextSibling) : (t = a.nodeType === 9 ? a.head : a, t.insertBefore(l, t.firstChild));
  }
  function Ii(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  }
  function Pi(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  }
  var Rn = null;
  function to(l, t, a) {
    if (Rn === null) {
      var u = /* @__PURE__ */ new Map(), e = Rn = /* @__PURE__ */ new Map();
      e.set(a, u);
    } else
      e = Rn, u = e.get(a), u || (u = /* @__PURE__ */ new Map(), e.set(a, u));
    if (u.has(l)) return u;
    for (u.set(l, null), a = a.getElementsByTagName(l), e = 0; e < a.length; e++) {
      var n = a[e];
      if (!(n[Ru] || n[Hl] || l === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
        var f = n.getAttribute(t) || "";
        f = l + f;
        var i = u.get(f);
        i ? i.push(n) : u.set(f, [n]);
      }
    }
    return u;
  }
  function ao(l, t, a) {
    l = l.ownerDocument || l, l.head.insertBefore(
      a,
      t === "title" ? l.querySelector("head > title") : null
    );
  }
  function wm(l, t, a) {
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
  function uo(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function $m(l, t, a, u) {
    if (a.type === "stylesheet" && (typeof u.media != "string" || matchMedia(u.media).matches !== !1) && (a.state.loading & 4) === 0) {
      if (a.instance === null) {
        var e = Tu(u.href), n = t.querySelector(
          me(e)
        );
        if (n) {
          t = n._p, t !== null && typeof t == "object" && typeof t.then == "function" && (l.count++, l = Hn.bind(l), t.then(l, l)), a.state.loading |= 4, a.instance = n, Ul(n);
          return;
        }
        n = t.ownerDocument || t, u = Py(u), (e = Et.get(e)) && Ii(u, e), n = n.createElement("link"), Ul(n);
        var f = n;
        f._p = new Promise(function(i, c) {
          f.onload = i, f.onerror = c;
        }), ql(n, "link", u), a.instance = n;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(a, t), (t = a.state.preload) && (a.state.loading & 3) === 0 && (l.count++, a = Hn.bind(l), t.addEventListener("load", a), t.addEventListener("error", a));
    }
  }
  var lc = 0;
  function Wm(l, t) {
    return l.stylesheets && l.count === 0 && Cn(l, l.stylesheets), 0 < l.count || 0 < l.imgCount ? function(a) {
      var u = setTimeout(function() {
        if (l.stylesheets && Cn(l, l.stylesheets), l.unsuspend) {
          var n = l.unsuspend;
          l.unsuspend = null, n();
        }
      }, 6e4 + t);
      0 < l.imgBytes && lc === 0 && (lc = 62500 * Um());
      var e = setTimeout(
        function() {
          if (l.waitingForImages = !1, l.count === 0 && (l.stylesheets && Cn(l, l.stylesheets), l.unsuspend)) {
            var n = l.unsuspend;
            l.unsuspend = null, n();
          }
        },
        (l.imgBytes > lc ? 50 : 800) + t
      );
      return l.unsuspend = a, function() {
        l.unsuspend = null, clearTimeout(u), clearTimeout(e);
      };
    } : null;
  }
  function Hn() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Cn(this, this.stylesheets);
      else if (this.unsuspend) {
        var l = this.unsuspend;
        this.unsuspend = null, l();
      }
    }
  }
  var Nn = null;
  function Cn(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Nn = /* @__PURE__ */ new Map(), t.forEach(Fm, l), Nn = null, Hn.call(l));
  }
  function Fm(l, t) {
    if (!(t.state.loading & 4)) {
      var a = Nn.get(l);
      if (a) var u = a.get(null);
      else {
        a = /* @__PURE__ */ new Map(), Nn.set(l, a);
        for (var e = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), n = 0; n < e.length; n++) {
          var f = e[n];
          (f.nodeName === "LINK" || f.getAttribute("media") !== "not all") && (a.set(f.dataset.precedence, f), u = f);
        }
        u && a.set(null, u);
      }
      e = t.instance, f = e.getAttribute("data-precedence"), n = a.get(f) || u, n === u && a.set(null, e), a.set(f, e), this.count++, u = Hn.bind(this), e.addEventListener("load", u), e.addEventListener("error", u), n ? n.parentNode.insertBefore(e, n.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(e, l.firstChild)), t.state.loading |= 4;
    }
  }
  var he = {
    $$typeof: gl,
    Provider: null,
    Consumer: null,
    _currentValue: G,
    _currentValue2: G,
    _threadCount: 0
  };
  function km(l, t, a, u, e, n, f, i, c) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = $n(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = $n(0), this.hiddenUpdates = $n(null), this.identifierPrefix = u, this.onUncaughtError = e, this.onCaughtError = n, this.onRecoverableError = f, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function eo(l, t, a, u, e, n, f, i, c, d, r, z) {
    return l = new km(
      l,
      t,
      a,
      f,
      c,
      d,
      r,
      z,
      i
    ), t = 1, n === !0 && (t |= 24), n = et(3, null, null, t), l.current = n, n.stateNode = l, t = Cf(), t.refCount++, l.pooledCache = t, t.refCount++, n.memoizedState = {
      element: u,
      isDehydrated: a,
      cache: t
    }, Gf(n), l;
  }
  function no(l) {
    return l ? (l = lu, l) : lu;
  }
  function fo(l, t, a, u, e, n) {
    e = no(e), u.context === null ? u.context = e : u.pendingContext = e, u = ua(t), u.payload = { element: a }, n = n === void 0 ? null : n, n !== null && (u.callback = n), a = ea(l, u, t), a !== null && (kl(a, l, t), wu(a, l, t));
  }
  function io(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var a = l.retryLane;
      l.retryLane = a !== 0 && a < t ? a : t;
    }
  }
  function tc(l, t) {
    io(l, t), (l = l.alternate) && io(l, t);
  }
  function co(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = Ma(l, 67108864);
      t !== null && kl(t, l, 67108864), tc(l, 67108864);
    }
  }
  function so(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = st();
      t = Wn(t);
      var a = Ma(l, t);
      a !== null && kl(a, l, t), tc(l, t);
    }
  }
  var Bn = !0;
  function Im(l, t, a, u) {
    var e = b.T;
    b.T = null;
    var n = p.p;
    try {
      p.p = 2, ac(l, t, a, u);
    } finally {
      p.p = n, b.T = e;
    }
  }
  function Pm(l, t, a, u) {
    var e = b.T;
    b.T = null;
    var n = p.p;
    try {
      p.p = 8, ac(l, t, a, u);
    } finally {
      p.p = n, b.T = e;
    }
  }
  function ac(l, t, a, u) {
    if (Bn) {
      var e = uc(u);
      if (e === null)
        xi(
          l,
          t,
          u,
          qn,
          a
        ), oo(l, u);
      else if (t1(
        e,
        l,
        t,
        a,
        u
      ))
        u.stopPropagation();
      else if (oo(l, u), t & 4 && -1 < l1.indexOf(l)) {
        for (; e !== null; ) {
          var n = La(e);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                  var f = Ta(n.pendingLanes);
                  if (f !== 0) {
                    var i = n;
                    for (i.pendingLanes |= 2, i.entangledLanes |= 2; f; ) {
                      var c = 1 << 31 - at(f);
                      i.entanglements[1] |= c, f &= ~c;
                    }
                    Ut(n), (ll & 6) === 0 && (gn = lt() + 500, se(0));
                  }
                }
                break;
              case 31:
              case 13:
                i = Ma(n, 2), i !== null && kl(i, n, 2), bn(), tc(n, 2);
            }
          if (n = uc(u), n === null && xi(
            l,
            t,
            u,
            qn,
            a
          ), n === e) break;
          e = n;
        }
        e !== null && u.stopPropagation();
      } else
        xi(
          l,
          t,
          u,
          null,
          a
        );
    }
  }
  function uc(l) {
    return l = ef(l), ec(l);
  }
  var qn = null;
  function ec(l) {
    if (qn = null, l = xa(l), l !== null) {
      var t = N(l);
      if (t === null) l = null;
      else {
        var a = t.tag;
        if (a === 13) {
          if (l = k(t), l !== null) return l;
          l = null;
        } else if (a === 31) {
          if (l = x(t), l !== null) return l;
          l = null;
        } else if (a === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return qn = l, null;
  }
  function yo(l) {
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
        switch (jo()) {
          case rc:
            return 2;
          case bc:
            return 8;
          case Ae:
          case Xo:
            return 32;
          case Ec:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var nc = !1, ha = null, Sa = null, ga = null, Se = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new Map(), ra = [], l1 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function oo(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        ha = null;
        break;
      case "dragenter":
      case "dragleave":
        Sa = null;
        break;
      case "mouseover":
      case "mouseout":
        ga = null;
        break;
      case "pointerover":
      case "pointerout":
        Se.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ge.delete(t.pointerId);
    }
  }
  function re(l, t, a, u, e, n) {
    return l === null || l.nativeEvent !== n ? (l = {
      blockedOn: t,
      domEventName: a,
      eventSystemFlags: u,
      nativeEvent: n,
      targetContainers: [e]
    }, t !== null && (t = La(t), t !== null && co(t)), l) : (l.eventSystemFlags |= u, t = l.targetContainers, e !== null && t.indexOf(e) === -1 && t.push(e), l);
  }
  function t1(l, t, a, u, e) {
    switch (t) {
      case "focusin":
        return ha = re(
          ha,
          l,
          t,
          a,
          u,
          e
        ), !0;
      case "dragenter":
        return Sa = re(
          Sa,
          l,
          t,
          a,
          u,
          e
        ), !0;
      case "mouseover":
        return ga = re(
          ga,
          l,
          t,
          a,
          u,
          e
        ), !0;
      case "pointerover":
        var n = e.pointerId;
        return Se.set(
          n,
          re(
            Se.get(n) || null,
            l,
            t,
            a,
            u,
            e
          )
        ), !0;
      case "gotpointercapture":
        return n = e.pointerId, ge.set(
          n,
          re(
            ge.get(n) || null,
            l,
            t,
            a,
            u,
            e
          )
        ), !0;
    }
    return !1;
  }
  function vo(l) {
    var t = xa(l.target);
    if (t !== null) {
      var a = N(t);
      if (a !== null) {
        if (t = a.tag, t === 13) {
          if (t = k(a), t !== null) {
            l.blockedOn = t, pc(l.priority, function() {
              so(a);
            });
            return;
          }
        } else if (t === 31) {
          if (t = x(a), t !== null) {
            l.blockedOn = t, pc(l.priority, function() {
              so(a);
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
  function Yn(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var a = uc(l.nativeEvent);
      if (a === null) {
        a = l.nativeEvent;
        var u = new a.constructor(
          a.type,
          a
        );
        uf = u, a.target.dispatchEvent(u), uf = null;
      } else
        return t = La(a), t !== null && co(t), l.blockedOn = a, !1;
      t.shift();
    }
    return !0;
  }
  function mo(l, t, a) {
    Yn(l) && a.delete(t);
  }
  function a1() {
    nc = !1, ha !== null && Yn(ha) && (ha = null), Sa !== null && Yn(Sa) && (Sa = null), ga !== null && Yn(ga) && (ga = null), Se.forEach(mo), ge.forEach(mo);
  }
  function Gn(l, t) {
    l.blockedOn === t && (l.blockedOn = null, nc || (nc = !0, S.unstable_scheduleCallback(
      S.unstable_NormalPriority,
      a1
    )));
  }
  var Qn = null;
  function ho(l) {
    Qn !== l && (Qn = l, S.unstable_scheduleCallback(
      S.unstable_NormalPriority,
      function() {
        Qn === l && (Qn = null);
        for (var t = 0; t < l.length; t += 3) {
          var a = l[t], u = l[t + 1], e = l[t + 2];
          if (typeof u != "function") {
            if (ec(u || a) === null)
              continue;
            break;
          }
          var n = La(a);
          n !== null && (l.splice(t, 3), t -= 3, ui(
            n,
            {
              pending: !0,
              data: e,
              method: a.method,
              action: u
            },
            u,
            e
          ));
        }
      }
    ));
  }
  function Ou(l) {
    function t(c) {
      return Gn(c, l);
    }
    ha !== null && Gn(ha, l), Sa !== null && Gn(Sa, l), ga !== null && Gn(ga, l), Se.forEach(t), ge.forEach(t);
    for (var a = 0; a < ra.length; a++) {
      var u = ra[a];
      u.blockedOn === l && (u.blockedOn = null);
    }
    for (; 0 < ra.length && (a = ra[0], a.blockedOn === null); )
      vo(a), a.blockedOn === null && ra.shift();
    if (a = (l.ownerDocument || l).$$reactFormReplay, a != null)
      for (u = 0; u < a.length; u += 3) {
        var e = a[u], n = a[u + 1], f = e[Kl] || null;
        if (typeof n == "function")
          f || ho(a);
        else if (f) {
          var i = null;
          if (n && n.hasAttribute("formAction")) {
            if (e = n, f = n[Kl] || null)
              i = f.formAction;
            else if (ec(e) !== null) continue;
          } else i = f.action;
          typeof i == "function" ? a[u + 1] = i : (a.splice(u, 3), u -= 3), ho(a);
        }
      }
  }
  function So() {
    function l(n) {
      n.canIntercept && n.info === "react-transition" && n.intercept({
        handler: function() {
          return new Promise(function(f) {
            return e = f;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      e !== null && (e(), e = null), u || setTimeout(a, 20);
    }
    function a() {
      if (!u && !navigation.transition) {
        var n = navigation.currentEntry;
        n && n.url != null && navigation.navigate(n.url, {
          state: n.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var u = !1, e = null;
      return navigation.addEventListener("navigate", l), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(a, 100), function() {
        u = !0, navigation.removeEventListener("navigate", l), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), e !== null && (e(), e = null);
      };
    }
  }
  function fc(l) {
    this._internalRoot = l;
  }
  jn.prototype.render = fc.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var a = t.current, u = st();
    fo(a, u, l, t, null, null);
  }, jn.prototype.unmount = fc.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      fo(l.current, 2, null, l, null, null), bn(), t[Za] = null;
    }
  };
  function jn(l) {
    this._internalRoot = l;
  }
  jn.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = _c();
      l = { blockedOn: null, target: l, priority: t };
      for (var a = 0; a < ra.length && t !== 0 && t < ra[a].priority; a++) ;
      ra.splice(a, 0, l), a === 0 && vo(l);
    }
  };
  var go = O.version;
  if (go !== "19.2.6")
    throw Error(
      o(
        527,
        go,
        "19.2.6"
      )
    );
  p.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(o(188)) : (l = Object.keys(l).join(","), Error(o(268, l)));
    return l = T(t), l = l !== null ? L(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var u1 = {
    bundleType: 0,
    version: "19.2.6",
    rendererPackageName: "react-dom",
    currentDispatcherRef: b,
    reconcilerVersion: "19.2.6"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Xn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Xn.isDisabled && Xn.supportsFiber)
      try {
        Mu = Xn.inject(
          u1
        ), tt = Xn;
      } catch {
      }
  }
  return Ee.createRoot = function(l, t) {
    if (!q(l)) throw Error(o(299));
    var a = !1, u = "", e = A0, n = O0, f = _0;
    return t != null && (t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onUncaughtError !== void 0 && (e = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (f = t.onRecoverableError)), t = eo(
      l,
      1,
      !1,
      null,
      null,
      a,
      u,
      null,
      e,
      n,
      f,
      So
    ), l[Za] = t.current, Zi(l), new fc(t);
  }, Ee.hydrateRoot = function(l, t, a) {
    if (!q(l)) throw Error(o(299));
    var u = !1, e = "", n = A0, f = O0, i = _0, c = null;
    return a != null && (a.unstable_strictMode === !0 && (u = !0), a.identifierPrefix !== void 0 && (e = a.identifierPrefix), a.onUncaughtError !== void 0 && (n = a.onUncaughtError), a.onCaughtError !== void 0 && (f = a.onCaughtError), a.onRecoverableError !== void 0 && (i = a.onRecoverableError), a.formState !== void 0 && (c = a.formState)), t = eo(
      l,
      1,
      !0,
      t,
      a ?? null,
      u,
      e,
      c,
      n,
      f,
      i,
      So
    ), t.context = no(null), a = t.current, u = st(), u = Wn(u), e = ua(u), e.callback = null, ea(a, e, u), a = u, t.current.lanes = a, Uu(t, a), Ut(t), l[Za] = t.current, Zi(l), new jn(t);
  }, Ee.version = "19.2.6", Ee;
}
var Mo;
function d1() {
  if (Mo) return sc.exports;
  Mo = 1;
  function S() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(S);
      } catch (O) {
        console.error(O);
      }
  }
  return S(), sc.exports = m1(), sc.exports;
}
var Y1 = d1();
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const h1 = (S) => S.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), S1 = (S) => S.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (O, _, o) => o ? o.toUpperCase() : _.toLowerCase()
), Do = (S) => {
  const O = S1(S);
  return O.charAt(0).toUpperCase() + O.slice(1);
}, Ho = (...S) => S.filter((O, _, o) => !!O && O.trim() !== "" && o.indexOf(O) === _).join(" ").trim(), g1 = (S) => {
  for (const O in S)
    if (O.startsWith("aria-") || O === "role" || O === "title")
      return !0;
};
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var r1 = {
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
const b1 = _u.forwardRef(
  ({
    color: S = "currentColor",
    size: O = 24,
    strokeWidth: _ = 2,
    absoluteStrokeWidth: o,
    className: q = "",
    children: N,
    iconNode: k,
    ...x
  }, U) => _u.createElement(
    "svg",
    {
      ref: U,
      ...r1,
      width: O,
      height: O,
      stroke: S,
      strokeWidth: o ? Number(_) * 24 / Number(O) : _,
      className: Ho("lucide", q),
      ...!N && !g1(x) && { "aria-hidden": "true" },
      ...x
    },
    [
      ...k.map(([T, L]) => _u.createElement(T, L)),
      ...Array.isArray(N) ? N : [N]
    ]
  )
);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const E1 = (S, O) => {
  const _ = _u.forwardRef(
    ({ className: o, ...q }, N) => _u.createElement(b1, {
      ref: N,
      iconNode: O,
      className: Ho(
        `lucide-${h1(Do(S))}`,
        `lucide-${S}`,
        o
      ),
      ...q
    })
  );
  return _.displayName = Do(S), _;
};
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const z1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], G1 = E1("search", z1), T1 = [
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
  "OLAY",
  "ORAL-B",
  "PAMPERS",
  "TIDE",
  "WHISPER",
  "LENOR",
  "JOY"
], A1 = [
  { canonical: "แชมพู", patterns: [/แชมพู/iu, /SHAMPOO/iu] },
  { canonical: "ครีมนวด", patterns: [/ครีมนวด/iu, /CONDITIONER/iu] },
  { canonical: "ผงซักฟอก", patterns: [/ผงซักฟอก/iu, /POWDER\s*DETERGENT/iu] },
  { canonical: "น้ำยาซักผ้า", patterns: [/น้ำยาซักผ้า/iu, /LIQUID\s*DETERGENT|LAUNDRY\s*LIQUID/iu] },
  { canonical: "ปรับผ้านุ่ม", patterns: [/ปรับผ้านุ่ม/iu, /FABRIC\s*SOFTENER/iu] },
  { canonical: "ผลิตภัณฑ์ล้างจาน", patterns: [/ล้างจาน/iu, /DISHWASH/iu] },
  { canonical: "สบู่", patterns: [/สบู่/iu, /SOAP|BODY\s*WASH/iu] },
  { canonical: "ยาสีฟัน", patterns: [/ยาสีฟัน/iu, /TOOTHPASTE/iu] },
  { canonical: "แปรงสีฟัน", patterns: [/แปรงสีฟัน/iu, /TOOTHBRUSH/iu] },
  { canonical: "มีดโกน", patterns: [/มีดโกน|ใบมีดโกน/iu, /RAZOR|BLADES?/iu] },
  { canonical: "สกินแคร์", patterns: [/ครีมบ[ำํ]ารุง|เซรั่ม|มอยส์เจอไรเซอร์/iu, /SERUM|CREAM|MOISTURI[ZS]ER/iu] },
  { canonical: "ผ้าอ้อม", patterns: [/ผ้าอ้อม/iu, /DIAPERS?/iu] },
  { canonical: "ยาอม", patterns: [/ยาอม/iu, /LOZENGES?/iu] },
  { canonical: "ยาดม", patterns: [/ยาดม/iu, /INHALER/iu] },
  { canonical: "ผลิตภัณฑ์ระงับกลิ่น", patterns: [/ระงับกลิ่น|โรลออน/iu, /DEODORANT/iu] }
], Uo = {
  ML: "มล.",
  มล: "มล.",
  "มล.": "มล.",
  L: "ลิตร",
  LT: "ลิตร",
  ลิตร: "ลิตร",
  G: "กรัม",
  GM: "กรัม",
  กรัม: "กรัม",
  KG: "กก.",
  กก: "กก.",
  "กก.": "กก.",
  CM: "ซม.",
  ซม: "ซม.",
  "ซม.": "ซม."
}, No = ["ขวด", "ชิ้น", "ซอง", "ถุง", "กล่อง", "แพ็ค", "แพค", "ด้าม", "หลอด", "กระปุก", "ชุด"];
function Co(S) {
  return String(S || "").normalize("NFKC").replace(/[×✕]/g, "x").replace(/\s+/g, " ").trim();
}
function O1(S) {
  return S.split(/(?:เมื่อ)?\s*ซื้อ|ลด\s*\d|แถม|ฟรี/iu)[0].trim();
}
function _1(S) {
  var q, N;
  const O = S.toUpperCase(), _ = [...T1].sort((k, x) => x.length - k.length).find((k) => O.includes(k));
  return _ === "HEAD AND SHOULDERS" || _ === "HEAD & SHOULDERS" ? "H&S" : _ === "ORAL B" ? "ORAL-B" : _ || ((N = (q = S.match(/^([A-Z][A-Z0-9&' -]{1,28})(?=\s|$)/)) == null ? void 0 : q[1]) == null ? void 0 : N.trim()) || null;
}
function p1(S) {
  for (const O of A1)
    for (const _ of O.patterns) {
      const o = S.match(_);
      if (o) return { canonical: O.canonical, raw: o[0] };
    }
  return null;
}
function M1(S) {
  const O = [...S.matchAll(/(\d+(?:[.,]\d+)?)\s*(ML|มล\.?|L|LT|ลิตร|G|GM|กรัม|KG|กก\.?|CM|ซม\.?)(?![A-Zก-๙])/giu)];
  if (!O.length) return { value: null, unit: null, raw: null };
  const _ = O[0], o = Number(_[1].replace(",", ".")), q = _[2].toUpperCase().replace(/\.$/, ""), N = Uo[q] || Uo[_[2]] || _[2];
  return { value: Number.isFinite(o) && o > 0 ? o : null, unit: N, raw: _[0] };
}
function D1(S) {
  const O = [
    /(?:แพ็ค|แพค|PACK)\s*(?:ละ|X)?\s*(\d{1,3})\s*(?:ชิ้น|ขวด|ซอง|ถุง|ด้าม|หลอด)?/iu,
    /(\d{1,3})\s*(?:ชิ้น|ขวด|ซอง|ถุง|ด้าม|หลอด)\s*\/(?:แพ็ค|แพค|PACK)/iu,
    /(?:^|\s)[Xx]\s*(\d{1,3})(?:\s|$)/u
  ];
  for (const _ of O) {
    const o = S.match(_), q = Number(o == null ? void 0 : o[1]);
    if (o && Number.isInteger(q) && q > 0) return { quantity: q, raw: o[0] };
  }
  return { quantity: 1, raw: null };
}
function U1(S) {
  const O = No.find((_) => new RegExp(_, "iu").test(S));
  return O === "แพค" ? "แพ็ค" : O || "ชิ้น";
}
function Ro(S) {
  let O = 2166136261;
  for (let _ = 0; _ < S.length; _ += 1)
    O ^= S.charCodeAt(_), O = Math.imul(O, 16777619);
  return (O >>> 0).toString(36).toUpperCase().padStart(7, "0");
}
function ze(S) {
  return Co(S).toUpperCase().replace(/[^A-Z0-9ก-๙]+/gu, " ").trim();
}
function Bo(S) {
  return [
    ze(S.brand),
    ze(S.productType),
    ze(S.variant || ""),
    Number(S.sizeValue).toFixed(3),
    ze(S.sizeUnit),
    ze(S.salesUnit),
    String(S.packQuantity)
  ].join("|");
}
function R1(S, O, _, o, q) {
  let N = S;
  for (const k of [O, _, o, q].filter((x) => !!x))
    N = N.replace(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "giu"), " ");
  for (const k of No) N = N.replace(new RegExp(k, "giu"), " ");
  return N = N.replace(/\s+/g, " ").trim(), N || null;
}
function Q1(S) {
  const O = O1(Co(S)), _ = _1(O), o = p1(O), q = M1(O), N = D1(O), k = U1(O), x = R1(O, _, (o == null ? void 0 : o.raw) || null, q.raw, N.raw), U = [
    ..._ ? [] : ["brand_missing"],
    ...o ? [] : ["product_type_missing"],
    ...q.value ? [] : ["size_missing"],
    ...q.unit ? [] : ["size_unit_missing"]
  ], T = {
    brand: _ || "",
    productType: (o == null ? void 0 : o.canonical) || "",
    variant: x,
    sizeValue: q.value || 0,
    sizeUnit: q.unit || "",
    salesUnit: k,
    packQuantity: N.quantity
  }, L = Bo(T), B = `SKU-${Ro(L)}`;
  return {
    id: `sku:${Ro(L)}`,
    code: B,
    canonicalName: O || "สินค้าใหม่ที่ยังอ่านชื่อไม่ครบ",
    identityKey: L,
    identity: T,
    status: U.length ? "quarantine" : "candidate",
    evidence: O ? [O] : [],
    failureReasons: U
  };
}
function j1(S) {
  if (S.failureReasons.length) throw new Error(`sku_evidence_incomplete:${S.failureReasons.join(",")}`);
  return { ...S, status: "active" };
}
const Zn = "DEMO-2026-01", mc = ["HFSS", "HFSM"], H1 = [
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
function N1(S, O) {
  const o = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="500"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#eef4ff"/><stop offset="1" stop-color="#fff7ed"/></linearGradient></defs><rect width="640" height="500" rx="30" fill="url(#g)"/><rect x="26" y="26" width="588" height="448" rx="24" fill="#fff" stroke="#c7d2fe" stroke-width="4"/><text x="48" y="90" font-family="Arial" font-size="28" font-weight="700" fill="#1d4ed8">${`${S} ${O}`.replace(/[&<>"']/g, "")}</text><text x="48" y="390" font-family="Arial" font-size="38" font-weight="800" fill="#059669">PROMOTION</text><text x="48" y="440" font-family="Arial" font-size="25" fill="#334155">Preview fixture</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(o)}`;
}
function C1(S, O) {
  return O && S === "HFSM" ? [{
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
function X1(S = "published") {
  const O = [], _ = [], o = [], q = [], N = [];
  return H1.forEach((k, x) => {
    const [U, T, L, B, el, jl, Yl, Ml] = k, yt = { brand: U, productType: T, variant: L, sizeValue: B, sizeUnit: el, salesUnit: jl, packQuantity: Yl }, Xl = Bo(yt), Il = `sku:demo:${x + 1}`, gl = {
      id: Il,
      code: `SKU-DEMO-${String(x + 1).padStart(3, "0")}`,
      canonicalName: `${U} ${T} ${L} ${B} ${el}`,
      identityKey: Xl,
      identity: yt,
      status: "active",
      evidence: ["preview_fixture"],
      failureReasons: []
    }, Gl = {
      skuId: Il,
      pdfSourcePrice: null,
      centralOverridePrice: { amount: Ml, currency: "THB" },
      effectivePrice: { amount: Ml, currency: "THB" },
      source: "central_override",
      sourceReference: "preview_fixture",
      updatedAt: "2026-01-01T00:00:00.000Z"
    }, Ll = `family:demo:${x + 1}`, _l = {
      id: Ll,
      familyKey: `PF-DEMO-${String(x + 1).padStart(3, "0")}`,
      name: x < 3 ? "Hair Care 60–70 ml" : `${U} ${T}`,
      scopeText: x < 3 ? "H&S / Pantene / Rejoice 60–70 ml" : `${U} ${T}`,
      sourceRows: [x + 2],
      tiersByClass: Object.fromEntries(mc.map((sl) => [sl, C1(sl, x === 3)])),
      failureReasons: []
    }, V = `group:demo:${x + 1}`, Dl = mc.map((sl, Pl) => ({
      id: `CARD-${Zn}-${sl}-P${String(x + 1).padStart(3, "0")}-C${String(Pl + 1).padStart(3, "0")}`,
      monthKey: Zn,
      page: x + 1,
      sequence: Pl + 1,
      classId: sl,
      imageUrl: N1(`${U} ${T} ${B} ${el}`, sl),
      skuId: Il,
      productGroupId: V,
      promotionFamilyId: Ll,
      promotionTiers: _l.tiersByClass[sl],
      price: Gl,
      status: "ready",
      evidence: { rawText: gl.canonicalName, productText: gl.canonicalName, pageClassText: sl, confidence: 1, method: "manual", cropBounds: null },
      failureReasons: []
    }));
    if (O.push(gl), _.push(Gl), o.push(...Dl), q.push({ id: V, monthKey: Zn, skuId: Il, sku: gl, cardIds: Dl.map((sl) => sl.id), classIds: [...mc], promotionFamilyId: Ll, price: Gl, status: "ready", failureReasons: [] }), !N.some((sl) => sl.name === _l.name)) N.push(_l);
    else if (x < 3) {
      const sl = N.find((Pl) => Pl.name === _l.name);
      sl && (q[q.length - 1].promotionFamilyId = sl.id, Dl.forEach((Pl) => {
        Pl.promotionFamilyId = sl.id;
      }));
    }
  }), {
    schema: "promo-system-rebuild-v1",
    version: {
      id: "00000000-0000-4000-8000-000000000001",
      monthKey: Zn,
      revision: 1,
      status: S,
      previousVersionId: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      createdBy: "preview-fixture",
      publishedAt: S === "published" ? "2026-01-01T00:00:00.000Z" : null,
      source: { pdfName: "preview-fixture.pdf", workbookName: "preview-fixture.xlsx", pdfHash: null, workbookHash: null }
    },
    skus: O,
    prices: _,
    cards: o,
    productGroups: q,
    promotionFamilies: N,
    warnings: ["preview_fixture_only"]
  };
}
const dc = "promo-new-admin-session-v1";
async function Xa(S, O = {}, _ = {}) {
  const o = new URL("/api/promo-new", window.location.origin);
  o.searchParams.set("action", S), Object.entries(_).forEach(([k, x]) => {
    x && o.searchParams.set(k, x);
  });
  const q = await fetch(o, {
    ...O,
    headers: {
      ...O.body ? { "Content-Type": "application/json" } : {},
      ...O.headers
    }
  }), N = await q.json().catch(() => ({ ok: !1, error: `http_${q.status}` }));
  if (!q.ok || (N == null ? void 0 : N.ok) === !1) throw new Error((N == null ? void 0 : N.error) || `http_${q.status}`);
  return N;
}
function Z1() {
  try {
    return JSON.parse(sessionStorage.getItem(dc) || "null");
  } catch {
    return null;
  }
}
function qo(S) {
  S ? sessionStorage.setItem(dc, JSON.stringify(S)) : sessionStorage.removeItem(dc);
}
async function x1(S, O) {
  const _ = await Xa("login", { method: "POST", body: JSON.stringify({ email: S, password: O }) });
  return qo(_.session), _.session;
}
async function L1(S) {
  return await Xa("session", { headers: { Authorization: `Bearer ${S.accessToken}` } }), S;
}
async function V1(S) {
  try {
    S && await Xa("logout", { method: "POST", headers: { Authorization: `Bearer ${S.accessToken}` } });
  } finally {
    qo(null);
  }
}
async function K1(S, O) {
  return Xa("draft", {
    method: "POST",
    headers: { Authorization: `Bearer ${O.accessToken}` },
    body: JSON.stringify({ dataset: S })
  });
}
async function J1(S, O, _, o) {
  return (await Xa("card-image", {
    method: "POST",
    headers: { Authorization: `Bearer ${o.accessToken}` },
    body: JSON.stringify({ versionId: S, cardId: O, dataUrl: _ })
  })).path;
}
async function w1(S, O) {
  return Xa("publish", {
    method: "POST",
    headers: { Authorization: `Bearer ${O.accessToken}` },
    body: JSON.stringify({ versionId: S })
  });
}
async function $1(S = "") {
  return (await Xa("published", {}, { month: S })).data;
}
export {
  q1 as R,
  G1 as S,
  j1 as a,
  X1 as b,
  Y1 as c,
  E1 as d,
  Q1 as e,
  $1 as f,
  x1 as g,
  V1 as h,
  B1 as j,
  Z1 as l,
  w1 as p,
  _u as r,
  K1 as s,
  J1 as u,
  L1 as v
};
