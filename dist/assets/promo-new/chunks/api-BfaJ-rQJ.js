function DT(C) {
  return C && C.__esModule && Object.prototype.hasOwnProperty.call(C, "default") ? C.default : C;
}
var Qv = { exports: {} }, y0 = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var B2;
function _T() {
  if (B2) return y0;
  B2 = 1;
  var C = Symbol.for("react.transitional.element"), Q = Symbol.for("react.fragment");
  function ne(M, ie, ce) {
    var we = null;
    if (ce !== void 0 && (we = "" + ce), ie.key !== void 0 && (we = "" + ie.key), "key" in ie) {
      ce = {};
      for (var F in ie)
        F !== "key" && (ce[F] = ie[F]);
    } else ce = ie;
    return ie = ce.ref, {
      $$typeof: C,
      type: M,
      key: we,
      ref: ie !== void 0 ? ie : null,
      props: ce
    };
  }
  return y0.Fragment = Q, y0.jsx = ne, y0.jsxs = ne, y0;
}
var p0 = {}, Vv = { exports: {} }, Ke = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Y2;
function MT() {
  if (Y2) return Ke;
  Y2 = 1;
  var C = Symbol.for("react.transitional.element"), Q = Symbol.for("react.portal"), ne = Symbol.for("react.fragment"), M = Symbol.for("react.strict_mode"), ie = Symbol.for("react.profiler"), ce = Symbol.for("react.consumer"), we = Symbol.for("react.context"), F = Symbol.for("react.forward_ref"), le = Symbol.for("react.suspense"), K = Symbol.for("react.memo"), Ae = Symbol.for("react.lazy"), w = Symbol.for("react.activity"), N = Symbol.iterator;
  function fe(S) {
    return S === null || typeof S != "object" ? null : (S = N && S[N] || S["@@iterator"], typeof S == "function" ? S : null);
  }
  var Ze = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, bt = Object.assign, it = {};
  function Fe(S, Y, P) {
    this.props = S, this.context = Y, this.refs = it, this.updater = P || Ze;
  }
  Fe.prototype.isReactComponent = {}, Fe.prototype.setState = function(S, Y) {
    if (typeof S != "object" && typeof S != "function" && S != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, S, Y, "setState");
  }, Fe.prototype.forceUpdate = function(S) {
    this.updater.enqueueForceUpdate(this, S, "forceUpdate");
  };
  function kt() {
  }
  kt.prototype = Fe.prototype;
  function yt(S, Y, P) {
    this.props = S, this.context = Y, this.refs = it, this.updater = P || Ze;
  }
  var Mt = yt.prototype = new kt();
  Mt.constructor = yt, bt(Mt, Fe.prototype), Mt.isPureReactComponent = !0;
  var jt = Array.isArray;
  function qt() {
  }
  var De = { H: null, A: null, T: null, S: null }, Ge = Object.prototype.hasOwnProperty;
  function Ye(S, Y, P) {
    var I = P.ref;
    return {
      $$typeof: C,
      type: S,
      key: Y,
      ref: I !== void 0 ? I : null,
      props: P
    };
  }
  function re(S, Y) {
    return Ye(S.type, Y, S.props);
  }
  function xt(S) {
    return typeof S == "object" && S !== null && S.$$typeof === C;
  }
  function ve(S) {
    var Y = { "=": "=0", ":": "=2" };
    return "$" + S.replace(/[=:]/g, function(P) {
      return Y[P];
    });
  }
  var Le = /\/+/g;
  function Zt(S, Y) {
    return typeof S == "object" && S !== null && S.key != null ? ve("" + S.key) : Y.toString(36);
  }
  function wt(S) {
    switch (S.status) {
      case "fulfilled":
        return S.value;
      case "rejected":
        throw S.reason;
      default:
        switch (typeof S.status == "string" ? S.then(qt, qt) : (S.status = "pending", S.then(
          function(Y) {
            S.status === "pending" && (S.status = "fulfilled", S.value = Y);
          },
          function(Y) {
            S.status === "pending" && (S.status = "rejected", S.reason = Y);
          }
        )), S.status) {
          case "fulfilled":
            return S.value;
          case "rejected":
            throw S.reason;
        }
    }
    throw S;
  }
  function D(S, Y, P, I, Ee) {
    var Xe = typeof S;
    (Xe === "undefined" || Xe === "boolean") && (S = null);
    var Re = !1;
    if (S === null) Re = !0;
    else
      switch (Xe) {
        case "bigint":
        case "string":
        case "number":
          Re = !0;
          break;
        case "object":
          switch (S.$$typeof) {
            case C:
            case Q:
              Re = !0;
              break;
            case Ae:
              return Re = S._init, D(
                Re(S._payload),
                Y,
                P,
                I,
                Ee
              );
          }
      }
    if (Re)
      return Ee = Ee(S), Re = I === "" ? "." + Zt(S, 0) : I, jt(Ee) ? (P = "", Re != null && (P = Re.replace(Le, "$&/") + "/"), D(Ee, Y, P, "", function(qa) {
        return qa;
      })) : Ee != null && (xt(Ee) && (Ee = re(
        Ee,
        P + (Ee.key == null || S && S.key === Ee.key ? "" : ("" + Ee.key).replace(
          Le,
          "$&/"
        ) + "/") + Re
      )), Y.push(Ee)), 1;
    Re = 0;
    var Jt = I === "" ? "." : I + ":";
    if (jt(S))
      for (var pt = 0; pt < S.length; pt++)
        I = S[pt], Xe = Jt + Zt(I, pt), Re += D(
          I,
          Y,
          P,
          Xe,
          Ee
        );
    else if (pt = fe(S), typeof pt == "function")
      for (S = pt.call(S), pt = 0; !(I = S.next()).done; )
        I = I.value, Xe = Jt + Zt(I, pt++), Re += D(
          I,
          Y,
          P,
          Xe,
          Ee
        );
    else if (Xe === "object") {
      if (typeof S.then == "function")
        return D(
          wt(S),
          Y,
          P,
          I,
          Ee
        );
      throw Y = String(S), Error(
        "Objects are not valid as a React child (found: " + (Y === "[object Object]" ? "object with keys {" + Object.keys(S).join(", ") + "}" : Y) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return Re;
  }
  function Z(S, Y, P) {
    if (S == null) return S;
    var I = [], Ee = 0;
    return D(S, I, "", "", function(Xe) {
      return Y.call(P, Xe, Ee++);
    }), I;
  }
  function te(S) {
    if (S._status === -1) {
      var Y = S._result;
      Y = Y(), Y.then(
        function(P) {
          (S._status === 0 || S._status === -1) && (S._status = 1, S._result = P);
        },
        function(P) {
          (S._status === 0 || S._status === -1) && (S._status = 2, S._result = P);
        }
      ), S._status === -1 && (S._status = 0, S._result = Y);
    }
    if (S._status === 1) return S._result.default;
    throw S._result;
  }
  var Se = typeof reportError == "function" ? reportError : function(S) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var Y = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof S == "object" && S !== null && typeof S.message == "string" ? String(S.message) : String(S),
        error: S
      });
      if (!window.dispatchEvent(Y)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", S);
      return;
    }
    console.error(S);
  }, _e = {
    map: Z,
    forEach: function(S, Y, P) {
      Z(
        S,
        function() {
          Y.apply(this, arguments);
        },
        P
      );
    },
    count: function(S) {
      var Y = 0;
      return Z(S, function() {
        Y++;
      }), Y;
    },
    toArray: function(S) {
      return Z(S, function(Y) {
        return Y;
      }) || [];
    },
    only: function(S) {
      if (!xt(S))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return S;
    }
  };
  return Ke.Activity = w, Ke.Children = _e, Ke.Component = Fe, Ke.Fragment = ne, Ke.Profiler = ie, Ke.PureComponent = yt, Ke.StrictMode = M, Ke.Suspense = le, Ke.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = De, Ke.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(S) {
      return De.H.useMemoCache(S);
    }
  }, Ke.cache = function(S) {
    return function() {
      return S.apply(null, arguments);
    };
  }, Ke.cacheSignal = function() {
    return null;
  }, Ke.cloneElement = function(S, Y, P) {
    if (S == null)
      throw Error(
        "The argument must be a React element, but you passed " + S + "."
      );
    var I = bt({}, S.props), Ee = S.key;
    if (Y != null)
      for (Xe in Y.key !== void 0 && (Ee = "" + Y.key), Y)
        !Ge.call(Y, Xe) || Xe === "key" || Xe === "__self" || Xe === "__source" || Xe === "ref" && Y.ref === void 0 || (I[Xe] = Y[Xe]);
    var Xe = arguments.length - 2;
    if (Xe === 1) I.children = P;
    else if (1 < Xe) {
      for (var Re = Array(Xe), Jt = 0; Jt < Xe; Jt++)
        Re[Jt] = arguments[Jt + 2];
      I.children = Re;
    }
    return Ye(S.type, Ee, I);
  }, Ke.createContext = function(S) {
    return S = {
      $$typeof: we,
      _currentValue: S,
      _currentValue2: S,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, S.Provider = S, S.Consumer = {
      $$typeof: ce,
      _context: S
    }, S;
  }, Ke.createElement = function(S, Y, P) {
    var I, Ee = {}, Xe = null;
    if (Y != null)
      for (I in Y.key !== void 0 && (Xe = "" + Y.key), Y)
        Ge.call(Y, I) && I !== "key" && I !== "__self" && I !== "__source" && (Ee[I] = Y[I]);
    var Re = arguments.length - 2;
    if (Re === 1) Ee.children = P;
    else if (1 < Re) {
      for (var Jt = Array(Re), pt = 0; pt < Re; pt++)
        Jt[pt] = arguments[pt + 2];
      Ee.children = Jt;
    }
    if (S && S.defaultProps)
      for (I in Re = S.defaultProps, Re)
        Ee[I] === void 0 && (Ee[I] = Re[I]);
    return Ye(S, Xe, Ee);
  }, Ke.createRef = function() {
    return { current: null };
  }, Ke.forwardRef = function(S) {
    return { $$typeof: F, render: S };
  }, Ke.isValidElement = xt, Ke.lazy = function(S) {
    return {
      $$typeof: Ae,
      _payload: { _status: -1, _result: S },
      _init: te
    };
  }, Ke.memo = function(S, Y) {
    return {
      $$typeof: K,
      type: S,
      compare: Y === void 0 ? null : Y
    };
  }, Ke.startTransition = function(S) {
    var Y = De.T, P = {};
    De.T = P;
    try {
      var I = S(), Ee = De.S;
      Ee !== null && Ee(P, I), typeof I == "object" && I !== null && typeof I.then == "function" && I.then(qt, Se);
    } catch (Xe) {
      Se(Xe);
    } finally {
      Y !== null && P.types !== null && (Y.types = P.types), De.T = Y;
    }
  }, Ke.unstable_useCacheRefresh = function() {
    return De.H.useCacheRefresh();
  }, Ke.use = function(S) {
    return De.H.use(S);
  }, Ke.useActionState = function(S, Y, P) {
    return De.H.useActionState(S, Y, P);
  }, Ke.useCallback = function(S, Y) {
    return De.H.useCallback(S, Y);
  }, Ke.useContext = function(S) {
    return De.H.useContext(S);
  }, Ke.useDebugValue = function() {
  }, Ke.useDeferredValue = function(S, Y) {
    return De.H.useDeferredValue(S, Y);
  }, Ke.useEffect = function(S, Y) {
    return De.H.useEffect(S, Y);
  }, Ke.useEffectEvent = function(S) {
    return De.H.useEffectEvent(S);
  }, Ke.useId = function() {
    return De.H.useId();
  }, Ke.useImperativeHandle = function(S, Y, P) {
    return De.H.useImperativeHandle(S, Y, P);
  }, Ke.useInsertionEffect = function(S, Y) {
    return De.H.useInsertionEffect(S, Y);
  }, Ke.useLayoutEffect = function(S, Y) {
    return De.H.useLayoutEffect(S, Y);
  }, Ke.useMemo = function(S, Y) {
    return De.H.useMemo(S, Y);
  }, Ke.useOptimistic = function(S, Y) {
    return De.H.useOptimistic(S, Y);
  }, Ke.useReducer = function(S, Y, P) {
    return De.H.useReducer(S, Y, P);
  }, Ke.useRef = function(S) {
    return De.H.useRef(S);
  }, Ke.useState = function(S) {
    return De.H.useState(S);
  }, Ke.useSyncExternalStore = function(S, Y, P) {
    return De.H.useSyncExternalStore(
      S,
      Y,
      P
    );
  }, Ke.useTransition = function() {
    return De.H.useTransition();
  }, Ke.version = "19.2.6", Ke;
}
var b0 = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
b0.exports;
var j2;
function CT() {
  return j2 || (j2 = 1, (function(C, Q) {
    process.env.NODE_ENV !== "production" && (function() {
      function ne(g, U) {
        Object.defineProperty(ce.prototype, g, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              U[0],
              U[1]
            );
          }
        });
      }
      function M(g) {
        return g === null || typeof g != "object" ? null : (g = zi && g[zi] || g["@@iterator"], typeof g == "function" ? g : null);
      }
      function ie(g, U) {
        g = (g = g.constructor) && (g.displayName || g.name) || "ReactClass";
        var ee = g + "." + U;
        Di[ee] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          U,
          g
        ), Di[ee] = !0);
      }
      function ce(g, U, ee) {
        this.props = g, this.context = U, this.refs = gt, this.updater = ee || xa;
      }
      function we() {
      }
      function F(g, U, ee) {
        this.props = g, this.context = U, this.refs = gt, this.updater = ee || xa;
      }
      function le() {
      }
      function K(g) {
        return "" + g;
      }
      function Ae(g) {
        try {
          K(g);
          var U = !1;
        } catch {
          U = !0;
        }
        if (U) {
          U = console;
          var ee = U.error, ae = typeof Symbol == "function" && Symbol.toStringTag && g[Symbol.toStringTag] || g.constructor.name || "Object";
          return ee.call(
            U,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            ae
          ), K(g);
        }
      }
      function w(g) {
        if (g == null) return null;
        if (typeof g == "function")
          return g.$$typeof === rr ? null : g.displayName || g.name || null;
        if (typeof g == "string") return g;
        switch (g) {
          case S:
            return "Fragment";
          case P:
            return "Profiler";
          case Y:
            return "StrictMode";
          case Re:
            return "Suspense";
          case Jt:
            return "SuspenseList";
          case se:
            return "Activity";
        }
        if (typeof g == "object")
          switch (typeof g.tag == "number" && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), g.$$typeof) {
            case _e:
              return "Portal";
            case Ee:
              return g.displayName || "Context";
            case I:
              return (g._context.displayName || "Context") + ".Consumer";
            case Xe:
              var U = g.render;
              return g = g.displayName, g || (g = U.displayName || U.name || "", g = g !== "" ? "ForwardRef(" + g + ")" : "ForwardRef"), g;
            case pt:
              return U = g.displayName || null, U !== null ? U : w(g.type) || "Memo";
            case qa:
              U = g._payload, g = g._init;
              try {
                return w(g(U));
              } catch {
              }
          }
        return null;
      }
      function N(g) {
        if (g === S) return "<>";
        if (typeof g == "object" && g !== null && g.$$typeof === qa)
          return "<...>";
        try {
          var U = w(g);
          return U ? "<" + U + ">" : "<...>";
        } catch {
          return "<...>";
        }
      }
      function fe() {
        var g = me.A;
        return g === null ? null : g.getOwner();
      }
      function Ze() {
        return Error("react-stack-top-frame");
      }
      function bt(g) {
        if (_i.call(g, "key")) {
          var U = Object.getOwnPropertyDescriptor(g, "key").get;
          if (U && U.isReactWarning) return !1;
        }
        return g.key !== void 0;
      }
      function it(g, U) {
        function ee() {
          vc || (vc = !0, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            U
          ));
        }
        ee.isReactWarning = !0, Object.defineProperty(g, "key", {
          get: ee,
          configurable: !0
        });
      }
      function Fe() {
        var g = w(this.type);
        return Fs[g] || (Fs[g] = !0, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        )), g = this.props.ref, g !== void 0 ? g : null;
      }
      function kt(g, U, ee, ae, ye, Ce) {
        var pe = ee.ref;
        return g = {
          $$typeof: Se,
          type: g,
          key: U,
          props: ee,
          _owner: ae
        }, (pe !== void 0 ? pe : null) !== null ? Object.defineProperty(g, "ref", {
          enumerable: !1,
          get: Fe
        }) : Object.defineProperty(g, "ref", { enumerable: !1, value: null }), g._store = {}, Object.defineProperty(g._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: 0
        }), Object.defineProperty(g, "_debugInfo", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: null
        }), Object.defineProperty(g, "_debugStack", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: ye
        }), Object.defineProperty(g, "_debugTask", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: Ce
        }), Object.freeze && (Object.freeze(g.props), Object.freeze(g)), g;
      }
      function yt(g, U) {
        return U = kt(
          g.type,
          U,
          g.props,
          g._owner,
          g._debugStack,
          g._debugTask
        ), g._store && (U._store.validated = g._store.validated), U;
      }
      function Mt(g) {
        jt(g) ? g._store && (g._store.validated = 1) : typeof g == "object" && g !== null && g.$$typeof === qa && (g._payload.status === "fulfilled" ? jt(g._payload.value) && g._payload.value._store && (g._payload.value._store.validated = 1) : g._store && (g._store.validated = 1));
      }
      function jt(g) {
        return typeof g == "object" && g !== null && g.$$typeof === Se;
      }
      function qt(g) {
        var U = { "=": "=0", ":": "=2" };
        return "$" + g.replace(/[=:]/g, function(ee) {
          return U[ee];
        });
      }
      function De(g, U) {
        return typeof g == "object" && g !== null && g.key != null ? (Ae(g.key), qt("" + g.key)) : U.toString(36);
      }
      function Ge(g) {
        switch (g.status) {
          case "fulfilled":
            return g.value;
          case "rejected":
            throw g.reason;
          default:
            switch (typeof g.status == "string" ? g.then(le, le) : (g.status = "pending", g.then(
              function(U) {
                g.status === "pending" && (g.status = "fulfilled", g.value = U);
              },
              function(U) {
                g.status === "pending" && (g.status = "rejected", g.reason = U);
              }
            )), g.status) {
              case "fulfilled":
                return g.value;
              case "rejected":
                throw g.reason;
            }
        }
        throw g;
      }
      function Ye(g, U, ee, ae, ye) {
        var Ce = typeof g;
        (Ce === "undefined" || Ce === "boolean") && (g = null);
        var pe = !1;
        if (g === null) pe = !0;
        else
          switch (Ce) {
            case "bigint":
            case "string":
            case "number":
              pe = !0;
              break;
            case "object":
              switch (g.$$typeof) {
                case Se:
                case _e:
                  pe = !0;
                  break;
                case qa:
                  return pe = g._init, Ye(
                    pe(g._payload),
                    U,
                    ee,
                    ae,
                    ye
                  );
              }
          }
        if (pe) {
          pe = g, ye = ye(pe);
          var lt = ae === "" ? "." + De(pe, 0) : ae;
          return gc(ye) ? (ee = "", lt != null && (ee = lt.replace(Is, "$&/") + "/"), Ye(ye, U, ee, "", function(ea) {
            return ea;
          })) : ye != null && (jt(ye) && (ye.key != null && (pe && pe.key === ye.key || Ae(ye.key)), ee = yt(
            ye,
            ee + (ye.key == null || pe && pe.key === ye.key ? "" : ("" + ye.key).replace(
              Is,
              "$&/"
            ) + "/") + lt
          ), ae !== "" && pe != null && jt(pe) && pe.key == null && pe._store && !pe._store.validated && (ee._store.validated = 2), ye = ee), U.push(ye)), 1;
        }
        if (pe = 0, lt = ae === "" ? "." : ae + ":", gc(g))
          for (var Qe = 0; Qe < g.length; Qe++)
            ae = g[Qe], Ce = lt + De(ae, Qe), pe += Ye(
              ae,
              U,
              ee,
              Ce,
              ye
            );
        else if (Qe = M(g), typeof Qe == "function")
          for (Qe === g.entries && (Mn || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), Mn = !0), g = Qe.call(g), Qe = 0; !(ae = g.next()).done; )
            ae = ae.value, Ce = lt + De(ae, Qe++), pe += Ye(
              ae,
              U,
              ee,
              Ce,
              ye
            );
        else if (Ce === "object") {
          if (typeof g.then == "function")
            return Ye(
              Ge(g),
              U,
              ee,
              ae,
              ye
            );
          throw U = String(g), Error(
            "Objects are not valid as a React child (found: " + (U === "[object Object]" ? "object with keys {" + Object.keys(g).join(", ") + "}" : U) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return pe;
      }
      function re(g, U, ee) {
        if (g == null) return g;
        var ae = [], ye = 0;
        return Ye(g, ae, "", "", function(Ce) {
          return U.call(ee, Ce, ye++);
        }), ae;
      }
      function xt(g) {
        if (g._status === -1) {
          var U = g._ioInfo;
          U != null && (U.start = U.end = performance.now()), U = g._result;
          var ee = U();
          if (ee.then(
            function(ye) {
              if (g._status === 0 || g._status === -1) {
                g._status = 1, g._result = ye;
                var Ce = g._ioInfo;
                Ce != null && (Ce.end = performance.now()), ee.status === void 0 && (ee.status = "fulfilled", ee.value = ye);
              }
            },
            function(ye) {
              if (g._status === 0 || g._status === -1) {
                g._status = 2, g._result = ye;
                var Ce = g._ioInfo;
                Ce != null && (Ce.end = performance.now()), ee.status === void 0 && (ee.status = "rejected", ee.reason = ye);
              }
            }
          ), U = g._ioInfo, U != null) {
            U.value = ee;
            var ae = ee.displayName;
            typeof ae == "string" && (U.name = ae);
          }
          g._status === -1 && (g._status = 0, g._result = ee);
        }
        if (g._status === 1)
          return U = g._result, U === void 0 && console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`,
            U
          ), "default" in U || console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`,
            U
          ), U.default;
        throw g._result;
      }
      function ve() {
        var g = me.H;
        return g === null && console.error(
          `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
        ), g;
      }
      function Le() {
        me.asyncTransitions--;
      }
      function Zt(g) {
        if (Sc === null)
          try {
            var U = ("require" + Math.random()).slice(0, 7);
            Sc = (C && C[U]).call(
              C,
              "timers"
            ).setImmediate;
          } catch {
            Sc = function(ae) {
              sr === !1 && (sr = !0, typeof MessageChannel > "u" && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var ye = new MessageChannel();
              ye.port1.onmessage = ae, ye.port2.postMessage(void 0);
            };
          }
        return Sc(g);
      }
      function wt(g) {
        return 1 < g.length && typeof AggregateError == "function" ? new AggregateError(g) : g[0];
      }
      function D(g, U) {
        U !== sn - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        ), sn = U;
      }
      function Z(g, U, ee) {
        var ae = me.actQueue;
        if (ae !== null)
          if (ae.length !== 0)
            try {
              te(ae), Zt(function() {
                return Z(g, U, ee);
              });
              return;
            } catch (ye) {
              me.thrownErrors.push(ye);
            }
          else me.actQueue = null;
        0 < me.thrownErrors.length ? (ae = wt(me.thrownErrors), me.thrownErrors.length = 0, ee(ae)) : U(g);
      }
      function te(g) {
        if (!wa) {
          wa = !0;
          var U = 0;
          try {
            for (; U < g.length; U++) {
              var ee = g[U];
              do {
                me.didUsePromise = !1;
                var ae = ee(!1);
                if (ae !== null) {
                  if (me.didUsePromise) {
                    g[U] = ee, g.splice(0, U);
                    return;
                  }
                  ee = ae;
                } else break;
              } while (!0);
            }
            g.length = 0;
          } catch (ye) {
            g.splice(0, U + 1), me.thrownErrors.push(ye);
          } finally {
            wa = !1;
          }
        }
      }
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var Se = Symbol.for("react.transitional.element"), _e = Symbol.for("react.portal"), S = Symbol.for("react.fragment"), Y = Symbol.for("react.strict_mode"), P = Symbol.for("react.profiler"), I = Symbol.for("react.consumer"), Ee = Symbol.for("react.context"), Xe = Symbol.for("react.forward_ref"), Re = Symbol.for("react.suspense"), Jt = Symbol.for("react.suspense_list"), pt = Symbol.for("react.memo"), qa = Symbol.for("react.lazy"), se = Symbol.for("react.activity"), zi = Symbol.iterator, Di = {}, xa = {
        isMounted: function() {
          return !1;
        },
        enqueueForceUpdate: function(g) {
          ie(g, "forceUpdate");
        },
        enqueueReplaceState: function(g) {
          ie(g, "replaceState");
        },
        enqueueSetState: function(g) {
          ie(g, "setState");
        }
      }, uu = Object.assign, gt = {};
      Object.freeze(gt), ce.prototype.isReactComponent = {}, ce.prototype.setState = function(g, U) {
        if (typeof g != "object" && typeof g != "function" && g != null)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, g, U, "setState");
      }, ce.prototype.forceUpdate = function(g) {
        this.updater.enqueueForceUpdate(this, g, "forceUpdate");
      };
      var Pl = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (Mi in Pl)
        Pl.hasOwnProperty(Mi) && ne(Mi, Pl[Mi]);
      we.prototype = ce.prototype, Pl = F.prototype = new we(), Pl.constructor = F, uu(Pl, ce.prototype), Pl.isPureReactComponent = !0;
      var gc = Array.isArray, rr = Symbol.for("react.client.reference"), me = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1,
        didUsePromise: !1,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, _i = Object.prototype.hasOwnProperty, iu = console.createTask ? console.createTask : function() {
        return null;
      };
      Pl = {
        react_stack_bottom_frame: function(g) {
          return g();
        }
      };
      var vc, vl, Fs = {}, Mo = Pl.react_stack_bottom_frame.bind(
        Pl,
        Ze
      )(), Co = iu(N(Ze)), Mn = !1, Is = /\/+/g, Uo = typeof reportError == "function" ? reportError : function(g) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
          var U = new window.ErrorEvent("error", {
            bubbles: !0,
            cancelable: !0,
            message: typeof g == "object" && g !== null && typeof g.message == "string" ? String(g.message) : String(g),
            error: g
          });
          if (!window.dispatchEvent(U)) return;
        } else if (typeof process == "object" && typeof process.emit == "function") {
          process.emit("uncaughtException", g);
          return;
        }
        console.error(g);
      }, sr = !1, Sc = null, sn = 0, Al = !1, wa = !1, Ul = typeof queueMicrotask == "function" ? function(g) {
        queueMicrotask(function() {
          return queueMicrotask(g);
        });
      } : Zt;
      Pl = Object.freeze({
        __proto__: null,
        c: function(g) {
          return ve().useMemoCache(g);
        }
      });
      var Mi = {
        map: re,
        forEach: function(g, U, ee) {
          re(
            g,
            function() {
              U.apply(this, arguments);
            },
            ee
          );
        },
        count: function(g) {
          var U = 0;
          return re(g, function() {
            U++;
          }), U;
        },
        toArray: function(g) {
          return re(g, function(U) {
            return U;
          }) || [];
        },
        only: function(g) {
          if (!jt(g))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return g;
        }
      };
      Q.Activity = se, Q.Children = Mi, Q.Component = ce, Q.Fragment = S, Q.Profiler = P, Q.PureComponent = F, Q.StrictMode = Y, Q.Suspense = Re, Q.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = me, Q.__COMPILER_RUNTIME = Pl, Q.act = function(g) {
        var U = me.actQueue, ee = sn;
        sn++;
        var ae = me.actQueue = U !== null ? U : [], ye = !1;
        try {
          var Ce = g();
        } catch (Qe) {
          me.thrownErrors.push(Qe);
        }
        if (0 < me.thrownErrors.length)
          throw D(U, ee), g = wt(me.thrownErrors), me.thrownErrors.length = 0, g;
        if (Ce !== null && typeof Ce == "object" && typeof Ce.then == "function") {
          var pe = Ce;
          return Ul(function() {
            ye || Al || (Al = !0, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          }), {
            then: function(Qe, ea) {
              ye = !0, pe.then(
                function(dn) {
                  if (D(U, ee), ee === 0) {
                    try {
                      te(ae), Zt(function() {
                        return Z(
                          dn,
                          Qe,
                          ea
                        );
                      });
                    } catch (Ho) {
                      me.thrownErrors.push(Ho);
                    }
                    if (0 < me.thrownErrors.length) {
                      var Ci = wt(
                        me.thrownErrors
                      );
                      me.thrownErrors.length = 0, ea(Ci);
                    }
                  } else Qe(dn);
                },
                function(dn) {
                  D(U, ee), 0 < me.thrownErrors.length && (dn = wt(
                    me.thrownErrors
                  ), me.thrownErrors.length = 0), ea(dn);
                }
              );
            }
          };
        }
        var lt = Ce;
        if (D(U, ee), ee === 0 && (te(ae), ae.length !== 0 && Ul(function() {
          ye || Al || (Al = !0, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), me.actQueue = null), 0 < me.thrownErrors.length)
          throw g = wt(me.thrownErrors), me.thrownErrors.length = 0, g;
        return {
          then: function(Qe, ea) {
            ye = !0, ee === 0 ? (me.actQueue = ae, Zt(function() {
              return Z(
                lt,
                Qe,
                ea
              );
            })) : Qe(lt);
          }
        };
      }, Q.cache = function(g) {
        return function() {
          return g.apply(null, arguments);
        };
      }, Q.cacheSignal = function() {
        return null;
      }, Q.captureOwnerStack = function() {
        var g = me.getCurrentStack;
        return g === null ? null : g();
      }, Q.cloneElement = function(g, U, ee) {
        if (g == null)
          throw Error(
            "The argument must be a React element, but you passed " + g + "."
          );
        var ae = uu({}, g.props), ye = g.key, Ce = g._owner;
        if (U != null) {
          var pe;
          e: {
            if (_i.call(U, "ref") && (pe = Object.getOwnPropertyDescriptor(
              U,
              "ref"
            ).get) && pe.isReactWarning) {
              pe = !1;
              break e;
            }
            pe = U.ref !== void 0;
          }
          pe && (Ce = fe()), bt(U) && (Ae(U.key), ye = "" + U.key);
          for (lt in U)
            !_i.call(U, lt) || lt === "key" || lt === "__self" || lt === "__source" || lt === "ref" && U.ref === void 0 || (ae[lt] = U[lt]);
        }
        var lt = arguments.length - 2;
        if (lt === 1) ae.children = ee;
        else if (1 < lt) {
          pe = Array(lt);
          for (var Qe = 0; Qe < lt; Qe++)
            pe[Qe] = arguments[Qe + 2];
          ae.children = pe;
        }
        for (ae = kt(
          g.type,
          ye,
          ae,
          Ce,
          g._debugStack,
          g._debugTask
        ), ye = 2; ye < arguments.length; ye++)
          Mt(arguments[ye]);
        return ae;
      }, Q.createContext = function(g) {
        return g = {
          $$typeof: Ee,
          _currentValue: g,
          _currentValue2: g,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        }, g.Provider = g, g.Consumer = {
          $$typeof: I,
          _context: g
        }, g._currentRenderer = null, g._currentRenderer2 = null, g;
      }, Q.createElement = function(g, U, ee) {
        for (var ae = 2; ae < arguments.length; ae++)
          Mt(arguments[ae]);
        ae = {};
        var ye = null;
        if (U != null)
          for (Qe in vl || !("__self" in U) || "key" in U || (vl = !0, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), bt(U) && (Ae(U.key), ye = "" + U.key), U)
            _i.call(U, Qe) && Qe !== "key" && Qe !== "__self" && Qe !== "__source" && (ae[Qe] = U[Qe]);
        var Ce = arguments.length - 2;
        if (Ce === 1) ae.children = ee;
        else if (1 < Ce) {
          for (var pe = Array(Ce), lt = 0; lt < Ce; lt++)
            pe[lt] = arguments[lt + 2];
          Object.freeze && Object.freeze(pe), ae.children = pe;
        }
        if (g && g.defaultProps)
          for (Qe in Ce = g.defaultProps, Ce)
            ae[Qe] === void 0 && (ae[Qe] = Ce[Qe]);
        ye && it(
          ae,
          typeof g == "function" ? g.displayName || g.name || "Unknown" : g
        );
        var Qe = 1e4 > me.recentlyCreatedOwnerStacks++;
        return kt(
          g,
          ye,
          ae,
          fe(),
          Qe ? Error("react-stack-top-frame") : Mo,
          Qe ? iu(N(g)) : Co
        );
      }, Q.createRef = function() {
        var g = { current: null };
        return Object.seal(g), g;
      }, Q.forwardRef = function(g) {
        g != null && g.$$typeof === pt ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : typeof g != "function" ? console.error(
          "forwardRef requires a render function but was given %s.",
          g === null ? "null" : typeof g
        ) : g.length !== 0 && g.length !== 2 && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          g.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        ), g != null && g.defaultProps != null && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var U = { $$typeof: Xe, render: g }, ee;
        return Object.defineProperty(U, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: function() {
            return ee;
          },
          set: function(ae) {
            ee = ae, g.name || g.displayName || (Object.defineProperty(g, "name", { value: ae }), g.displayName = ae);
          }
        }), U;
      }, Q.isValidElement = jt, Q.lazy = function(g) {
        g = { _status: -1, _result: g };
        var U = {
          $$typeof: qa,
          _payload: g,
          _init: xt
        }, ee = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        return g._ioInfo = ee, U._debugInfo = [{ awaited: ee }], U;
      }, Q.memo = function(g, U) {
        g == null && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          g === null ? "null" : typeof g
        ), U = {
          $$typeof: pt,
          type: g,
          compare: U === void 0 ? null : U
        };
        var ee;
        return Object.defineProperty(U, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: function() {
            return ee;
          },
          set: function(ae) {
            ee = ae, g.name || g.displayName || (Object.defineProperty(g, "name", { value: ae }), g.displayName = ae);
          }
        }), U;
      }, Q.startTransition = function(g) {
        var U = me.T, ee = {};
        ee._updatedFibers = /* @__PURE__ */ new Set(), me.T = ee;
        try {
          var ae = g(), ye = me.S;
          ye !== null && ye(ee, ae), typeof ae == "object" && ae !== null && typeof ae.then == "function" && (me.asyncTransitions++, ae.then(Le, Le), ae.then(le, Uo));
        } catch (Ce) {
          Uo(Ce);
        } finally {
          U === null && ee._updatedFibers && (g = ee._updatedFibers.size, ee._updatedFibers.clear(), 10 < g && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), U !== null && ee.types !== null && (U.types !== null && U.types !== ee.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), U.types = ee.types), me.T = U;
        }
      }, Q.unstable_useCacheRefresh = function() {
        return ve().useCacheRefresh();
      }, Q.use = function(g) {
        return ve().use(g);
      }, Q.useActionState = function(g, U, ee) {
        return ve().useActionState(
          g,
          U,
          ee
        );
      }, Q.useCallback = function(g, U) {
        return ve().useCallback(g, U);
      }, Q.useContext = function(g) {
        var U = ve();
        return g.$$typeof === I && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        ), U.useContext(g);
      }, Q.useDebugValue = function(g, U) {
        return ve().useDebugValue(g, U);
      }, Q.useDeferredValue = function(g, U) {
        return ve().useDeferredValue(g, U);
      }, Q.useEffect = function(g, U) {
        return g == null && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), ve().useEffect(g, U);
      }, Q.useEffectEvent = function(g) {
        return ve().useEffectEvent(g);
      }, Q.useId = function() {
        return ve().useId();
      }, Q.useImperativeHandle = function(g, U, ee) {
        return ve().useImperativeHandle(g, U, ee);
      }, Q.useInsertionEffect = function(g, U) {
        return g == null && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), ve().useInsertionEffect(g, U);
      }, Q.useLayoutEffect = function(g, U) {
        return g == null && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), ve().useLayoutEffect(g, U);
      }, Q.useMemo = function(g, U) {
        return ve().useMemo(g, U);
      }, Q.useOptimistic = function(g, U) {
        return ve().useOptimistic(g, U);
      }, Q.useReducer = function(g, U, ee) {
        return ve().useReducer(g, U, ee);
      }, Q.useRef = function(g) {
        return ve().useRef(g);
      }, Q.useState = function(g) {
        return ve().useState(g);
      }, Q.useSyncExternalStore = function(g, U, ee) {
        return ve().useSyncExternalStore(
          g,
          U,
          ee
        );
      }, Q.useTransition = function() {
        return ve().useTransition();
      }, Q.version = "19.2.6", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  })(b0, b0.exports)), b0.exports;
}
var q2;
function Sm() {
  return q2 || (q2 = 1, process.env.NODE_ENV === "production" ? Vv.exports = MT() : Vv.exports = CT()), Vv.exports;
}
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var x2;
function UT() {
  return x2 || (x2 = 1, process.env.NODE_ENV !== "production" && (function() {
    function C(S) {
      if (S == null) return null;
      if (typeof S == "function")
        return S.$$typeof === xt ? null : S.displayName || S.name || null;
      if (typeof S == "string") return S;
      switch (S) {
        case it:
          return "Fragment";
        case kt:
          return "Profiler";
        case Fe:
          return "StrictMode";
        case qt:
          return "Suspense";
        case De:
          return "SuspenseList";
        case re:
          return "Activity";
      }
      if (typeof S == "object")
        switch (typeof S.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), S.$$typeof) {
          case bt:
            return "Portal";
          case Mt:
            return S.displayName || "Context";
          case yt:
            return (S._context.displayName || "Context") + ".Consumer";
          case jt:
            var Y = S.render;
            return S = S.displayName, S || (S = Y.displayName || Y.name || "", S = S !== "" ? "ForwardRef(" + S + ")" : "ForwardRef"), S;
          case Ge:
            return Y = S.displayName || null, Y !== null ? Y : C(S.type) || "Memo";
          case Ye:
            Y = S._payload, S = S._init;
            try {
              return C(S(Y));
            } catch {
            }
        }
      return null;
    }
    function Q(S) {
      return "" + S;
    }
    function ne(S) {
      try {
        Q(S);
        var Y = !1;
      } catch {
        Y = !0;
      }
      if (Y) {
        Y = console;
        var P = Y.error, I = typeof Symbol == "function" && Symbol.toStringTag && S[Symbol.toStringTag] || S.constructor.name || "Object";
        return P.call(
          Y,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          I
        ), Q(S);
      }
    }
    function M(S) {
      if (S === it) return "<>";
      if (typeof S == "object" && S !== null && S.$$typeof === Ye)
        return "<...>";
      try {
        var Y = C(S);
        return Y ? "<" + Y + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function ie() {
      var S = ve.A;
      return S === null ? null : S.getOwner();
    }
    function ce() {
      return Error("react-stack-top-frame");
    }
    function we(S) {
      if (Le.call(S, "key")) {
        var Y = Object.getOwnPropertyDescriptor(S, "key").get;
        if (Y && Y.isReactWarning) return !1;
      }
      return S.key !== void 0;
    }
    function F(S, Y) {
      function P() {
        D || (D = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          Y
        ));
      }
      P.isReactWarning = !0, Object.defineProperty(S, "key", {
        get: P,
        configurable: !0
      });
    }
    function le() {
      var S = C(this.type);
      return Z[S] || (Z[S] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), S = this.props.ref, S !== void 0 ? S : null;
    }
    function K(S, Y, P, I, Ee, Xe) {
      var Re = P.ref;
      return S = {
        $$typeof: Ze,
        type: S,
        key: Y,
        props: P,
        _owner: I
      }, (Re !== void 0 ? Re : null) !== null ? Object.defineProperty(S, "ref", {
        enumerable: !1,
        get: le
      }) : Object.defineProperty(S, "ref", { enumerable: !1, value: null }), S._store = {}, Object.defineProperty(S._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(S, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(S, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: Ee
      }), Object.defineProperty(S, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: Xe
      }), Object.freeze && (Object.freeze(S.props), Object.freeze(S)), S;
    }
    function Ae(S, Y, P, I, Ee, Xe) {
      var Re = Y.children;
      if (Re !== void 0)
        if (I)
          if (Zt(Re)) {
            for (I = 0; I < Re.length; I++)
              w(Re[I]);
            Object.freeze && Object.freeze(Re);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else w(Re);
      if (Le.call(Y, "key")) {
        Re = C(S);
        var Jt = Object.keys(Y).filter(function(qa) {
          return qa !== "key";
        });
        I = 0 < Jt.length ? "{key: someKey, " + Jt.join(": ..., ") + ": ...}" : "{key: someKey}", _e[Re + I] || (Jt = 0 < Jt.length ? "{" + Jt.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          I,
          Re,
          Jt,
          Re
        ), _e[Re + I] = !0);
      }
      if (Re = null, P !== void 0 && (ne(P), Re = "" + P), we(Y) && (ne(Y.key), Re = "" + Y.key), "key" in Y) {
        P = {};
        for (var pt in Y)
          pt !== "key" && (P[pt] = Y[pt]);
      } else P = Y;
      return Re && F(
        P,
        typeof S == "function" ? S.displayName || S.name || "Unknown" : S
      ), K(
        S,
        Re,
        P,
        ie(),
        Ee,
        Xe
      );
    }
    function w(S) {
      N(S) ? S._store && (S._store.validated = 1) : typeof S == "object" && S !== null && S.$$typeof === Ye && (S._payload.status === "fulfilled" ? N(S._payload.value) && S._payload.value._store && (S._payload.value._store.validated = 1) : S._store && (S._store.validated = 1));
    }
    function N(S) {
      return typeof S == "object" && S !== null && S.$$typeof === Ze;
    }
    var fe = Sm(), Ze = Symbol.for("react.transitional.element"), bt = Symbol.for("react.portal"), it = Symbol.for("react.fragment"), Fe = Symbol.for("react.strict_mode"), kt = Symbol.for("react.profiler"), yt = Symbol.for("react.consumer"), Mt = Symbol.for("react.context"), jt = Symbol.for("react.forward_ref"), qt = Symbol.for("react.suspense"), De = Symbol.for("react.suspense_list"), Ge = Symbol.for("react.memo"), Ye = Symbol.for("react.lazy"), re = Symbol.for("react.activity"), xt = Symbol.for("react.client.reference"), ve = fe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Le = Object.prototype.hasOwnProperty, Zt = Array.isArray, wt = console.createTask ? console.createTask : function() {
      return null;
    };
    fe = {
      react_stack_bottom_frame: function(S) {
        return S();
      }
    };
    var D, Z = {}, te = fe.react_stack_bottom_frame.bind(
      fe,
      ce
    )(), Se = wt(M(ce)), _e = {};
    p0.Fragment = it, p0.jsx = function(S, Y, P) {
      var I = 1e4 > ve.recentlyCreatedOwnerStacks++;
      return Ae(
        S,
        Y,
        P,
        !1,
        I ? Error("react-stack-top-frame") : te,
        I ? wt(M(S)) : Se
      );
    }, p0.jsxs = function(S, Y, P) {
      var I = 1e4 > ve.recentlyCreatedOwnerStacks++;
      return Ae(
        S,
        Y,
        P,
        !0,
        I ? Error("react-stack-top-frame") : te,
        I ? wt(M(S)) : Se
      );
    };
  })()), p0;
}
var w2;
function HT() {
  return w2 || (w2 = 1, process.env.NODE_ENV === "production" ? Qv.exports = _T() : Qv.exports = UT()), Qv.exports;
}
var uA = HT(), vm = Sm();
const iA = /* @__PURE__ */ DT(vm);
var Zv = { exports: {} }, g0 = {}, Jv = { exports: {} }, bS = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var G2;
function NT() {
  return G2 || (G2 = 1, (function(C) {
    function Q(D, Z) {
      var te = D.length;
      D.push(Z);
      e: for (; 0 < te; ) {
        var Se = te - 1 >>> 1, _e = D[Se];
        if (0 < ie(_e, Z))
          D[Se] = Z, D[te] = _e, te = Se;
        else break e;
      }
    }
    function ne(D) {
      return D.length === 0 ? null : D[0];
    }
    function M(D) {
      if (D.length === 0) return null;
      var Z = D[0], te = D.pop();
      if (te !== Z) {
        D[0] = te;
        e: for (var Se = 0, _e = D.length, S = _e >>> 1; Se < S; ) {
          var Y = 2 * (Se + 1) - 1, P = D[Y], I = Y + 1, Ee = D[I];
          if (0 > ie(P, te))
            I < _e && 0 > ie(Ee, P) ? (D[Se] = Ee, D[I] = te, Se = I) : (D[Se] = P, D[Y] = te, Se = Y);
          else if (I < _e && 0 > ie(Ee, te))
            D[Se] = Ee, D[I] = te, Se = I;
          else break e;
        }
      }
      return Z;
    }
    function ie(D, Z) {
      var te = D.sortIndex - Z.sortIndex;
      return te !== 0 ? te : D.id - Z.id;
    }
    if (C.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var ce = performance;
      C.unstable_now = function() {
        return ce.now();
      };
    } else {
      var we = Date, F = we.now();
      C.unstable_now = function() {
        return we.now() - F;
      };
    }
    var le = [], K = [], Ae = 1, w = null, N = 3, fe = !1, Ze = !1, bt = !1, it = !1, Fe = typeof setTimeout == "function" ? setTimeout : null, kt = typeof clearTimeout == "function" ? clearTimeout : null, yt = typeof setImmediate < "u" ? setImmediate : null;
    function Mt(D) {
      for (var Z = ne(K); Z !== null; ) {
        if (Z.callback === null) M(K);
        else if (Z.startTime <= D)
          M(K), Z.sortIndex = Z.expirationTime, Q(le, Z);
        else break;
        Z = ne(K);
      }
    }
    function jt(D) {
      if (bt = !1, Mt(D), !Ze)
        if (ne(le) !== null)
          Ze = !0, qt || (qt = !0, ve());
        else {
          var Z = ne(K);
          Z !== null && wt(jt, Z.startTime - D);
        }
    }
    var qt = !1, De = -1, Ge = 5, Ye = -1;
    function re() {
      return it ? !0 : !(C.unstable_now() - Ye < Ge);
    }
    function xt() {
      if (it = !1, qt) {
        var D = C.unstable_now();
        Ye = D;
        var Z = !0;
        try {
          e: {
            Ze = !1, bt && (bt = !1, kt(De), De = -1), fe = !0;
            var te = N;
            try {
              t: {
                for (Mt(D), w = ne(le); w !== null && !(w.expirationTime > D && re()); ) {
                  var Se = w.callback;
                  if (typeof Se == "function") {
                    w.callback = null, N = w.priorityLevel;
                    var _e = Se(
                      w.expirationTime <= D
                    );
                    if (D = C.unstable_now(), typeof _e == "function") {
                      w.callback = _e, Mt(D), Z = !0;
                      break t;
                    }
                    w === ne(le) && M(le), Mt(D);
                  } else M(le);
                  w = ne(le);
                }
                if (w !== null) Z = !0;
                else {
                  var S = ne(K);
                  S !== null && wt(
                    jt,
                    S.startTime - D
                  ), Z = !1;
                }
              }
              break e;
            } finally {
              w = null, N = te, fe = !1;
            }
            Z = void 0;
          }
        } finally {
          Z ? ve() : qt = !1;
        }
      }
    }
    var ve;
    if (typeof yt == "function")
      ve = function() {
        yt(xt);
      };
    else if (typeof MessageChannel < "u") {
      var Le = new MessageChannel(), Zt = Le.port2;
      Le.port1.onmessage = xt, ve = function() {
        Zt.postMessage(null);
      };
    } else
      ve = function() {
        Fe(xt, 0);
      };
    function wt(D, Z) {
      De = Fe(function() {
        D(C.unstable_now());
      }, Z);
    }
    C.unstable_IdlePriority = 5, C.unstable_ImmediatePriority = 1, C.unstable_LowPriority = 4, C.unstable_NormalPriority = 3, C.unstable_Profiling = null, C.unstable_UserBlockingPriority = 2, C.unstable_cancelCallback = function(D) {
      D.callback = null;
    }, C.unstable_forceFrameRate = function(D) {
      0 > D || 125 < D ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Ge = 0 < D ? Math.floor(1e3 / D) : 5;
    }, C.unstable_getCurrentPriorityLevel = function() {
      return N;
    }, C.unstable_next = function(D) {
      switch (N) {
        case 1:
        case 2:
        case 3:
          var Z = 3;
          break;
        default:
          Z = N;
      }
      var te = N;
      N = Z;
      try {
        return D();
      } finally {
        N = te;
      }
    }, C.unstable_requestPaint = function() {
      it = !0;
    }, C.unstable_runWithPriority = function(D, Z) {
      switch (D) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          D = 3;
      }
      var te = N;
      N = D;
      try {
        return Z();
      } finally {
        N = te;
      }
    }, C.unstable_scheduleCallback = function(D, Z, te) {
      var Se = C.unstable_now();
      switch (typeof te == "object" && te !== null ? (te = te.delay, te = typeof te == "number" && 0 < te ? Se + te : Se) : te = Se, D) {
        case 1:
          var _e = -1;
          break;
        case 2:
          _e = 250;
          break;
        case 5:
          _e = 1073741823;
          break;
        case 4:
          _e = 1e4;
          break;
        default:
          _e = 5e3;
      }
      return _e = te + _e, D = {
        id: Ae++,
        callback: Z,
        priorityLevel: D,
        startTime: te,
        expirationTime: _e,
        sortIndex: -1
      }, te > Se ? (D.sortIndex = te, Q(K, D), ne(le) === null && D === ne(K) && (bt ? (kt(De), De = -1) : bt = !0, wt(jt, te - Se))) : (D.sortIndex = _e, Q(le, D), Ze || fe || (Ze = !0, qt || (qt = !0, ve()))), D;
    }, C.unstable_shouldYield = re, C.unstable_wrapCallback = function(D) {
      var Z = N;
      return function() {
        var te = N;
        N = Z;
        try {
          return D.apply(this, arguments);
        } finally {
          N = te;
        }
      };
    };
  })(bS)), bS;
}
var ES = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var L2;
function BT() {
  return L2 || (L2 = 1, (function(C) {
    process.env.NODE_ENV !== "production" && (function() {
      function Q() {
        if (jt = !1, Ye) {
          var D = C.unstable_now();
          ve = D;
          var Z = !0;
          try {
            e: {
              yt = !1, Mt && (Mt = !1, De(re), re = -1), kt = !0;
              var te = Fe;
              try {
                t: {
                  for (we(D), it = M(fe); it !== null && !(it.expirationTime > D && le()); ) {
                    var Se = it.callback;
                    if (typeof Se == "function") {
                      it.callback = null, Fe = it.priorityLevel;
                      var _e = Se(
                        it.expirationTime <= D
                      );
                      if (D = C.unstable_now(), typeof _e == "function") {
                        it.callback = _e, we(D), Z = !0;
                        break t;
                      }
                      it === M(fe) && ie(fe), we(D);
                    } else ie(fe);
                    it = M(fe);
                  }
                  if (it !== null) Z = !0;
                  else {
                    var S = M(Ze);
                    S !== null && K(
                      F,
                      S.startTime - D
                    ), Z = !1;
                  }
                }
                break e;
              } finally {
                it = null, Fe = te, kt = !1;
              }
              Z = void 0;
            }
          } finally {
            Z ? Le() : Ye = !1;
          }
        }
      }
      function ne(D, Z) {
        var te = D.length;
        D.push(Z);
        e: for (; 0 < te; ) {
          var Se = te - 1 >>> 1, _e = D[Se];
          if (0 < ce(_e, Z))
            D[Se] = Z, D[te] = _e, te = Se;
          else break e;
        }
      }
      function M(D) {
        return D.length === 0 ? null : D[0];
      }
      function ie(D) {
        if (D.length === 0) return null;
        var Z = D[0], te = D.pop();
        if (te !== Z) {
          D[0] = te;
          e: for (var Se = 0, _e = D.length, S = _e >>> 1; Se < S; ) {
            var Y = 2 * (Se + 1) - 1, P = D[Y], I = Y + 1, Ee = D[I];
            if (0 > ce(P, te))
              I < _e && 0 > ce(Ee, P) ? (D[Se] = Ee, D[I] = te, Se = I) : (D[Se] = P, D[Y] = te, Se = Y);
            else if (I < _e && 0 > ce(Ee, te))
              D[Se] = Ee, D[I] = te, Se = I;
            else break e;
          }
        }
        return Z;
      }
      function ce(D, Z) {
        var te = D.sortIndex - Z.sortIndex;
        return te !== 0 ? te : D.id - Z.id;
      }
      function we(D) {
        for (var Z = M(Ze); Z !== null; ) {
          if (Z.callback === null) ie(Ze);
          else if (Z.startTime <= D)
            ie(Ze), Z.sortIndex = Z.expirationTime, ne(fe, Z);
          else break;
          Z = M(Ze);
        }
      }
      function F(D) {
        if (Mt = !1, we(D), !yt)
          if (M(fe) !== null)
            yt = !0, Ye || (Ye = !0, Le());
          else {
            var Z = M(Ze);
            Z !== null && K(
              F,
              Z.startTime - D
            );
          }
      }
      function le() {
        return jt ? !0 : !(C.unstable_now() - ve < xt);
      }
      function K(D, Z) {
        re = qt(function() {
          D(C.unstable_now());
        }, Z);
      }
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error()), C.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
        var Ae = performance;
        C.unstable_now = function() {
          return Ae.now();
        };
      } else {
        var w = Date, N = w.now();
        C.unstable_now = function() {
          return w.now() - N;
        };
      }
      var fe = [], Ze = [], bt = 1, it = null, Fe = 3, kt = !1, yt = !1, Mt = !1, jt = !1, qt = typeof setTimeout == "function" ? setTimeout : null, De = typeof clearTimeout == "function" ? clearTimeout : null, Ge = typeof setImmediate < "u" ? setImmediate : null, Ye = !1, re = -1, xt = 5, ve = -1;
      if (typeof Ge == "function")
        var Le = function() {
          Ge(Q);
        };
      else if (typeof MessageChannel < "u") {
        var Zt = new MessageChannel(), wt = Zt.port2;
        Zt.port1.onmessage = Q, Le = function() {
          wt.postMessage(null);
        };
      } else
        Le = function() {
          qt(Q, 0);
        };
      C.unstable_IdlePriority = 5, C.unstable_ImmediatePriority = 1, C.unstable_LowPriority = 4, C.unstable_NormalPriority = 3, C.unstable_Profiling = null, C.unstable_UserBlockingPriority = 2, C.unstable_cancelCallback = function(D) {
        D.callback = null;
      }, C.unstable_forceFrameRate = function(D) {
        0 > D || 125 < D ? console.error(
          "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
        ) : xt = 0 < D ? Math.floor(1e3 / D) : 5;
      }, C.unstable_getCurrentPriorityLevel = function() {
        return Fe;
      }, C.unstable_next = function(D) {
        switch (Fe) {
          case 1:
          case 2:
          case 3:
            var Z = 3;
            break;
          default:
            Z = Fe;
        }
        var te = Fe;
        Fe = Z;
        try {
          return D();
        } finally {
          Fe = te;
        }
      }, C.unstable_requestPaint = function() {
        jt = !0;
      }, C.unstable_runWithPriority = function(D, Z) {
        switch (D) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            D = 3;
        }
        var te = Fe;
        Fe = D;
        try {
          return Z();
        } finally {
          Fe = te;
        }
      }, C.unstable_scheduleCallback = function(D, Z, te) {
        var Se = C.unstable_now();
        switch (typeof te == "object" && te !== null ? (te = te.delay, te = typeof te == "number" && 0 < te ? Se + te : Se) : te = Se, D) {
          case 1:
            var _e = -1;
            break;
          case 2:
            _e = 250;
            break;
          case 5:
            _e = 1073741823;
            break;
          case 4:
            _e = 1e4;
            break;
          default:
            _e = 5e3;
        }
        return _e = te + _e, D = {
          id: bt++,
          callback: Z,
          priorityLevel: D,
          startTime: te,
          expirationTime: _e,
          sortIndex: -1
        }, te > Se ? (D.sortIndex = te, ne(Ze, D), M(fe) === null && D === M(Ze) && (Mt ? (De(re), re = -1) : Mt = !0, K(F, te - Se))) : (D.sortIndex = _e, ne(fe, D), yt || kt || (yt = !0, Ye || (Ye = !0, Le()))), D;
      }, C.unstable_shouldYield = le, C.unstable_wrapCallback = function(D) {
        var Z = Fe;
        return function() {
          var te = Fe;
          Fe = Z;
          try {
            return D.apply(this, arguments);
          } finally {
            Fe = te;
          }
        };
      }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  })(ES)), ES;
}
var X2;
function I2() {
  return X2 || (X2 = 1, process.env.NODE_ENV === "production" ? Jv.exports = NT() : Jv.exports = BT()), Jv.exports;
}
var Kv = { exports: {} }, Ya = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Q2;
function YT() {
  if (Q2) return Ya;
  Q2 = 1;
  var C = Sm();
  function Q(le) {
    var K = "https://react.dev/errors/" + le;
    if (1 < arguments.length) {
      K += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var Ae = 2; Ae < arguments.length; Ae++)
        K += "&args[]=" + encodeURIComponent(arguments[Ae]);
    }
    return "Minified React error #" + le + "; visit " + K + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function ne() {
  }
  var M = {
    d: {
      f: ne,
      r: function() {
        throw Error(Q(522));
      },
      D: ne,
      C: ne,
      L: ne,
      m: ne,
      X: ne,
      S: ne,
      M: ne
    },
    p: 0,
    findDOMNode: null
  }, ie = Symbol.for("react.portal");
  function ce(le, K, Ae) {
    var w = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: ie,
      key: w == null ? null : "" + w,
      children: le,
      containerInfo: K,
      implementation: Ae
    };
  }
  var we = C.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function F(le, K) {
    if (le === "font") return "";
    if (typeof K == "string")
      return K === "use-credentials" ? K : "";
  }
  return Ya.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = M, Ya.createPortal = function(le, K) {
    var Ae = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!K || K.nodeType !== 1 && K.nodeType !== 9 && K.nodeType !== 11)
      throw Error(Q(299));
    return ce(le, K, null, Ae);
  }, Ya.flushSync = function(le) {
    var K = we.T, Ae = M.p;
    try {
      if (we.T = null, M.p = 2, le) return le();
    } finally {
      we.T = K, M.p = Ae, M.d.f();
    }
  }, Ya.preconnect = function(le, K) {
    typeof le == "string" && (K ? (K = K.crossOrigin, K = typeof K == "string" ? K === "use-credentials" ? K : "" : void 0) : K = null, M.d.C(le, K));
  }, Ya.prefetchDNS = function(le) {
    typeof le == "string" && M.d.D(le);
  }, Ya.preinit = function(le, K) {
    if (typeof le == "string" && K && typeof K.as == "string") {
      var Ae = K.as, w = F(Ae, K.crossOrigin), N = typeof K.integrity == "string" ? K.integrity : void 0, fe = typeof K.fetchPriority == "string" ? K.fetchPriority : void 0;
      Ae === "style" ? M.d.S(
        le,
        typeof K.precedence == "string" ? K.precedence : void 0,
        {
          crossOrigin: w,
          integrity: N,
          fetchPriority: fe
        }
      ) : Ae === "script" && M.d.X(le, {
        crossOrigin: w,
        integrity: N,
        fetchPriority: fe,
        nonce: typeof K.nonce == "string" ? K.nonce : void 0
      });
    }
  }, Ya.preinitModule = function(le, K) {
    if (typeof le == "string")
      if (typeof K == "object" && K !== null) {
        if (K.as == null || K.as === "script") {
          var Ae = F(
            K.as,
            K.crossOrigin
          );
          M.d.M(le, {
            crossOrigin: Ae,
            integrity: typeof K.integrity == "string" ? K.integrity : void 0,
            nonce: typeof K.nonce == "string" ? K.nonce : void 0
          });
        }
      } else K == null && M.d.M(le);
  }, Ya.preload = function(le, K) {
    if (typeof le == "string" && typeof K == "object" && K !== null && typeof K.as == "string") {
      var Ae = K.as, w = F(Ae, K.crossOrigin);
      M.d.L(le, Ae, {
        crossOrigin: w,
        integrity: typeof K.integrity == "string" ? K.integrity : void 0,
        nonce: typeof K.nonce == "string" ? K.nonce : void 0,
        type: typeof K.type == "string" ? K.type : void 0,
        fetchPriority: typeof K.fetchPriority == "string" ? K.fetchPriority : void 0,
        referrerPolicy: typeof K.referrerPolicy == "string" ? K.referrerPolicy : void 0,
        imageSrcSet: typeof K.imageSrcSet == "string" ? K.imageSrcSet : void 0,
        imageSizes: typeof K.imageSizes == "string" ? K.imageSizes : void 0,
        media: typeof K.media == "string" ? K.media : void 0
      });
    }
  }, Ya.preloadModule = function(le, K) {
    if (typeof le == "string")
      if (K) {
        var Ae = F(K.as, K.crossOrigin);
        M.d.m(le, {
          as: typeof K.as == "string" && K.as !== "script" ? K.as : void 0,
          crossOrigin: Ae,
          integrity: typeof K.integrity == "string" ? K.integrity : void 0
        });
      } else M.d.m(le);
  }, Ya.requestFormReset = function(le) {
    M.d.r(le);
  }, Ya.unstable_batchedUpdates = function(le, K) {
    return le(K);
  }, Ya.useFormState = function(le, K, Ae) {
    return we.H.useFormState(le, K, Ae);
  }, Ya.useFormStatus = function() {
    return we.H.useHostTransitionStatus();
  }, Ya.version = "19.2.6", Ya;
}
var ja = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var V2;
function jT() {
  return V2 || (V2 = 1, process.env.NODE_ENV !== "production" && (function() {
    function C() {
    }
    function Q(w) {
      return "" + w;
    }
    function ne(w, N, fe) {
      var Ze = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      try {
        Q(Ze);
        var bt = !1;
      } catch {
        bt = !0;
      }
      return bt && (console.error(
        "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
        typeof Symbol == "function" && Symbol.toStringTag && Ze[Symbol.toStringTag] || Ze.constructor.name || "Object"
      ), Q(Ze)), {
        $$typeof: K,
        key: Ze == null ? null : "" + Ze,
        children: w,
        containerInfo: N,
        implementation: fe
      };
    }
    function M(w, N) {
      if (w === "font") return "";
      if (typeof N == "string")
        return N === "use-credentials" ? N : "";
    }
    function ie(w) {
      return w === null ? "`null`" : w === void 0 ? "`undefined`" : w === "" ? "an empty string" : 'something with type "' + typeof w + '"';
    }
    function ce(w) {
      return w === null ? "`null`" : w === void 0 ? "`undefined`" : w === "" ? "an empty string" : typeof w == "string" ? JSON.stringify(w) : typeof w == "number" ? "`" + w + "`" : 'something with type "' + typeof w + '"';
    }
    function we() {
      var w = Ae.H;
      return w === null && console.error(
        `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
      ), w;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var F = Sm(), le = {
      d: {
        f: C,
        r: function() {
          throw Error(
            "Invalid form element. requestFormReset must be passed a form that was rendered by React."
          );
        },
        D: C,
        C,
        L: C,
        m: C,
        X: C,
        S: C,
        M: C
      },
      p: 0,
      findDOMNode: null
    }, K = Symbol.for("react.portal"), Ae = F.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    typeof Map == "function" && Map.prototype != null && typeof Map.prototype.forEach == "function" && typeof Set == "function" && Set.prototype != null && typeof Set.prototype.clear == "function" && typeof Set.prototype.forEach == "function" || console.error(
      "React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"
    ), ja.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = le, ja.createPortal = function(w, N) {
      var fe = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!N || N.nodeType !== 1 && N.nodeType !== 9 && N.nodeType !== 11)
        throw Error("Target container is not a DOM element.");
      return ne(w, N, null, fe);
    }, ja.flushSync = function(w) {
      var N = Ae.T, fe = le.p;
      try {
        if (Ae.T = null, le.p = 2, w)
          return w();
      } finally {
        Ae.T = N, le.p = fe, le.d.f() && console.error(
          "flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."
        );
      }
    }, ja.preconnect = function(w, N) {
      typeof w == "string" && w ? N != null && typeof N != "object" ? console.error(
        "ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.",
        ce(N)
      ) : N != null && typeof N.crossOrigin != "string" && console.error(
        "ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.",
        ie(N.crossOrigin)
      ) : console.error(
        "ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
        ie(w)
      ), typeof w == "string" && (N ? (N = N.crossOrigin, N = typeof N == "string" ? N === "use-credentials" ? N : "" : void 0) : N = null, le.d.C(w, N));
    }, ja.prefetchDNS = function(w) {
      if (typeof w != "string" || !w)
        console.error(
          "ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
          ie(w)
        );
      else if (1 < arguments.length) {
        var N = arguments[1];
        typeof N == "object" && N.hasOwnProperty("crossOrigin") ? console.error(
          "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
          ce(N)
        ) : console.error(
          "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
          ce(N)
        );
      }
      typeof w == "string" && le.d.D(w);
    }, ja.preinit = function(w, N) {
      if (typeof w == "string" && w ? N == null || typeof N != "object" ? console.error(
        "ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.",
        ce(N)
      ) : N.as !== "style" && N.as !== "script" && console.error(
        'ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are "style" and "script".',
        ce(N.as)
      ) : console.error(
        "ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
        ie(w)
      ), typeof w == "string" && N && typeof N.as == "string") {
        var fe = N.as, Ze = M(fe, N.crossOrigin), bt = typeof N.integrity == "string" ? N.integrity : void 0, it = typeof N.fetchPriority == "string" ? N.fetchPriority : void 0;
        fe === "style" ? le.d.S(
          w,
          typeof N.precedence == "string" ? N.precedence : void 0,
          {
            crossOrigin: Ze,
            integrity: bt,
            fetchPriority: it
          }
        ) : fe === "script" && le.d.X(w, {
          crossOrigin: Ze,
          integrity: bt,
          fetchPriority: it,
          nonce: typeof N.nonce == "string" ? N.nonce : void 0
        });
      }
    }, ja.preinitModule = function(w, N) {
      var fe = "";
      if (typeof w == "string" && w || (fe += " The `href` argument encountered was " + ie(w) + "."), N !== void 0 && typeof N != "object" ? fe += " The `options` argument encountered was " + ie(N) + "." : N && "as" in N && N.as !== "script" && (fe += " The `as` option encountered was " + ce(N.as) + "."), fe)
        console.error(
          "ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s",
          fe
        );
      else
        switch (fe = N && typeof N.as == "string" ? N.as : "script", fe) {
          case "script":
            break;
          default:
            fe = ce(fe), console.error(
              'ReactDOM.preinitModule(): Currently the only supported "as" type for this function is "script" but received "%s" instead. This warning was generated for `href` "%s". In the future other module types will be supported, aligning with the import-attributes proposal. Learn more here: (https://github.com/tc39/proposal-import-attributes)',
              fe,
              w
            );
        }
      typeof w == "string" && (typeof N == "object" && N !== null ? (N.as == null || N.as === "script") && (fe = M(
        N.as,
        N.crossOrigin
      ), le.d.M(w, {
        crossOrigin: fe,
        integrity: typeof N.integrity == "string" ? N.integrity : void 0,
        nonce: typeof N.nonce == "string" ? N.nonce : void 0
      })) : N == null && le.d.M(w));
    }, ja.preload = function(w, N) {
      var fe = "";
      if (typeof w == "string" && w || (fe += " The `href` argument encountered was " + ie(w) + "."), N == null || typeof N != "object" ? fe += " The `options` argument encountered was " + ie(N) + "." : typeof N.as == "string" && N.as || (fe += " The `as` option encountered was " + ie(N.as) + "."), fe && console.error(
        'ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel="preload" as="..." />` tag.%s',
        fe
      ), typeof w == "string" && typeof N == "object" && N !== null && typeof N.as == "string") {
        fe = N.as;
        var Ze = M(
          fe,
          N.crossOrigin
        );
        le.d.L(w, fe, {
          crossOrigin: Ze,
          integrity: typeof N.integrity == "string" ? N.integrity : void 0,
          nonce: typeof N.nonce == "string" ? N.nonce : void 0,
          type: typeof N.type == "string" ? N.type : void 0,
          fetchPriority: typeof N.fetchPriority == "string" ? N.fetchPriority : void 0,
          referrerPolicy: typeof N.referrerPolicy == "string" ? N.referrerPolicy : void 0,
          imageSrcSet: typeof N.imageSrcSet == "string" ? N.imageSrcSet : void 0,
          imageSizes: typeof N.imageSizes == "string" ? N.imageSizes : void 0,
          media: typeof N.media == "string" ? N.media : void 0
        });
      }
    }, ja.preloadModule = function(w, N) {
      var fe = "";
      typeof w == "string" && w || (fe += " The `href` argument encountered was " + ie(w) + "."), N !== void 0 && typeof N != "object" ? fe += " The `options` argument encountered was " + ie(N) + "." : N && "as" in N && typeof N.as != "string" && (fe += " The `as` option encountered was " + ie(N.as) + "."), fe && console.error(
        'ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel="modulepreload" as="..." />` tag.%s',
        fe
      ), typeof w == "string" && (N ? (fe = M(
        N.as,
        N.crossOrigin
      ), le.d.m(w, {
        as: typeof N.as == "string" && N.as !== "script" ? N.as : void 0,
        crossOrigin: fe,
        integrity: typeof N.integrity == "string" ? N.integrity : void 0
      })) : le.d.m(w));
    }, ja.requestFormReset = function(w) {
      le.d.r(w);
    }, ja.unstable_batchedUpdates = function(w, N) {
      return w(N);
    }, ja.useFormState = function(w, N, fe) {
      return we().useFormState(w, N, fe);
    }, ja.useFormStatus = function() {
      return we().useHostTransitionStatus();
    }, ja.version = "19.2.6", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), ja;
}
var Z2;
function P2() {
  if (Z2) return Kv.exports;
  Z2 = 1;
  function C() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("^_^");
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(C);
      } catch (Q) {
        console.error(Q);
      }
    }
  }
  return process.env.NODE_ENV === "production" ? (C(), Kv.exports = YT()) : Kv.exports = jT(), Kv.exports;
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
var J2;
function qT() {
  if (J2) return g0;
  J2 = 1;
  var C = I2(), Q = Sm(), ne = P2();
  function M(l) {
    var n = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      n += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var u = 2; u < arguments.length; u++)
        n += "&args[]=" + encodeURIComponent(arguments[u]);
    }
    return "Minified React error #" + l + "; visit " + n + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function ie(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function ce(l) {
    var n = l, u = l;
    if (l.alternate) for (; n.return; ) n = n.return;
    else {
      l = n;
      do
        n = l, (n.flags & 4098) !== 0 && (u = n.return), l = n.return;
      while (l);
    }
    return n.tag === 3 ? u : null;
  }
  function we(l) {
    if (l.tag === 13) {
      var n = l.memoizedState;
      if (n === null && (l = l.alternate, l !== null && (n = l.memoizedState)), n !== null) return n.dehydrated;
    }
    return null;
  }
  function F(l) {
    if (l.tag === 31) {
      var n = l.memoizedState;
      if (n === null && (l = l.alternate, l !== null && (n = l.memoizedState)), n !== null) return n.dehydrated;
    }
    return null;
  }
  function le(l) {
    if (ce(l) !== l)
      throw Error(M(188));
  }
  function K(l) {
    var n = l.alternate;
    if (!n) {
      if (n = ce(l), n === null) throw Error(M(188));
      return n !== l ? null : l;
    }
    for (var u = l, c = n; ; ) {
      var r = u.return;
      if (r === null) break;
      var s = r.alternate;
      if (s === null) {
        if (c = r.return, c !== null) {
          u = c;
          continue;
        }
        break;
      }
      if (r.child === s.child) {
        for (s = r.child; s; ) {
          if (s === u) return le(r), l;
          if (s === c) return le(r), n;
          s = s.sibling;
        }
        throw Error(M(188));
      }
      if (u.return !== c.return) u = r, c = s;
      else {
        for (var m = !1, v = r.child; v; ) {
          if (v === u) {
            m = !0, u = r, c = s;
            break;
          }
          if (v === c) {
            m = !0, c = r, u = s;
            break;
          }
          v = v.sibling;
        }
        if (!m) {
          for (v = s.child; v; ) {
            if (v === u) {
              m = !0, u = s, c = r;
              break;
            }
            if (v === c) {
              m = !0, c = s, u = r;
              break;
            }
            v = v.sibling;
          }
          if (!m) throw Error(M(189));
        }
      }
      if (u.alternate !== c) throw Error(M(190));
    }
    if (u.tag !== 3) throw Error(M(188));
    return u.stateNode.current === u ? l : n;
  }
  function Ae(l) {
    var n = l.tag;
    if (n === 5 || n === 26 || n === 27 || n === 6) return l;
    for (l = l.child; l !== null; ) {
      if (n = Ae(l), n !== null) return n;
      l = l.sibling;
    }
    return null;
  }
  var w = Object.assign, N = Symbol.for("react.element"), fe = Symbol.for("react.transitional.element"), Ze = Symbol.for("react.portal"), bt = Symbol.for("react.fragment"), it = Symbol.for("react.strict_mode"), Fe = Symbol.for("react.profiler"), kt = Symbol.for("react.consumer"), yt = Symbol.for("react.context"), Mt = Symbol.for("react.forward_ref"), jt = Symbol.for("react.suspense"), qt = Symbol.for("react.suspense_list"), De = Symbol.for("react.memo"), Ge = Symbol.for("react.lazy"), Ye = Symbol.for("react.activity"), re = Symbol.for("react.memo_cache_sentinel"), xt = Symbol.iterator;
  function ve(l) {
    return l === null || typeof l != "object" ? null : (l = xt && l[xt] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var Le = Symbol.for("react.client.reference");
  function Zt(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === Le ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case bt:
        return "Fragment";
      case Fe:
        return "Profiler";
      case it:
        return "StrictMode";
      case jt:
        return "Suspense";
      case qt:
        return "SuspenseList";
      case Ye:
        return "Activity";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case Ze:
          return "Portal";
        case yt:
          return l.displayName || "Context";
        case kt:
          return (l._context.displayName || "Context") + ".Consumer";
        case Mt:
          var n = l.render;
          return l = l.displayName, l || (l = n.displayName || n.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case De:
          return n = l.displayName || null, n !== null ? n : Zt(l.type) || "Memo";
        case Ge:
          n = l._payload, l = l._init;
          try {
            return Zt(l(n));
          } catch {
          }
      }
    return null;
  }
  var wt = Array.isArray, D = Q.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Z = ne.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, te = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Se = [], _e = -1;
  function S(l) {
    return { current: l };
  }
  function Y(l) {
    0 > _e || (l.current = Se[_e], Se[_e] = null, _e--);
  }
  function P(l, n) {
    _e++, Se[_e] = l.current, l.current = n;
  }
  var I = S(null), Ee = S(null), Xe = S(null), Re = S(null);
  function Jt(l, n) {
    switch (P(Xe, n), P(Ee, l), P(I, null), n.nodeType) {
      case 9:
      case 11:
        l = (l = n.documentElement) && (l = l.namespaceURI) ? Bg(l) : 0;
        break;
      default:
        if (l = n.tagName, n = n.namespaceURI)
          n = Bg(n), l = rp(n, l);
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
    Y(I), P(I, l);
  }
  function pt() {
    Y(I), Y(Ee), Y(Xe);
  }
  function qa(l) {
    l.memoizedState !== null && P(Re, l);
    var n = I.current, u = rp(n, l.type);
    n !== u && (P(Ee, l), P(I, u));
  }
  function se(l) {
    Ee.current === l && (Y(I), Y(Ee)), Re.current === l && (Y(Re), Os._currentValue = te);
  }
  var zi, Di;
  function xa(l) {
    if (zi === void 0)
      try {
        throw Error();
      } catch (u) {
        var n = u.stack.trim().match(/\n( *(at )?)/);
        zi = n && n[1] || "", Di = -1 < u.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < u.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + zi + l + Di;
  }
  var uu = !1;
  function gt(l, n) {
    if (!l || uu) return "";
    uu = !0;
    var u = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var c = {
        DetermineComponentFrameRoot: function() {
          try {
            if (n) {
              var k = function() {
                throw Error();
              };
              if (Object.defineProperty(k.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(k, []);
                } catch (X) {
                  var q = X;
                }
                Reflect.construct(l, [], k);
              } else {
                try {
                  k.call();
                } catch (X) {
                  q = X;
                }
                l.call(k.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (X) {
                q = X;
              }
              (k = l()) && typeof k.catch == "function" && k.catch(function() {
              });
            }
          } catch (X) {
            if (X && q && typeof X.stack == "string")
              return [X.stack, q.stack];
          }
          return [null, null];
        }
      };
      c.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var r = Object.getOwnPropertyDescriptor(
        c.DetermineComponentFrameRoot,
        "name"
      );
      r && r.configurable && Object.defineProperty(
        c.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var s = c.DetermineComponentFrameRoot(), m = s[0], v = s[1];
      if (m && v) {
        var A = m.split(`
`), j = v.split(`
`);
        for (r = c = 0; c < A.length && !A[c].includes("DetermineComponentFrameRoot"); )
          c++;
        for (; r < j.length && !j[r].includes(
          "DetermineComponentFrameRoot"
        ); )
          r++;
        if (c === A.length || r === j.length)
          for (c = A.length - 1, r = j.length - 1; 1 <= c && 0 <= r && A[c] !== j[r]; )
            r--;
        for (; 1 <= c && 0 <= r; c--, r--)
          if (A[c] !== j[r]) {
            if (c !== 1 || r !== 1)
              do
                if (c--, r--, 0 > r || A[c] !== j[r]) {
                  var V = `
` + A[c].replace(" at new ", " at ");
                  return l.displayName && V.includes("<anonymous>") && (V = V.replace("<anonymous>", l.displayName)), V;
                }
              while (1 <= c && 0 <= r);
            break;
          }
      }
    } finally {
      uu = !1, Error.prepareStackTrace = u;
    }
    return (u = l ? l.displayName || l.name : "") ? xa(u) : "";
  }
  function Pl(l, n) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return xa(l.type);
      case 16:
        return xa("Lazy");
      case 13:
        return l.child !== n && n !== null ? xa("Suspense Fallback") : xa("Suspense");
      case 19:
        return xa("SuspenseList");
      case 0:
      case 15:
        return gt(l.type, !1);
      case 11:
        return gt(l.type.render, !1);
      case 1:
        return gt(l.type, !0);
      case 31:
        return xa("Activity");
      default:
        return "";
    }
  }
  function gc(l) {
    try {
      var n = "", u = null;
      do
        n += Pl(l, u), u = l, l = l.return;
      while (l);
      return n;
    } catch (c) {
      return `
Error generating stack: ` + c.message + `
` + c.stack;
    }
  }
  var rr = Object.prototype.hasOwnProperty, me = C.unstable_scheduleCallback, _i = C.unstable_cancelCallback, iu = C.unstable_shouldYield, vc = C.unstable_requestPaint, vl = C.unstable_now, Fs = C.unstable_getCurrentPriorityLevel, Mo = C.unstable_ImmediatePriority, Co = C.unstable_UserBlockingPriority, Mn = C.unstable_NormalPriority, Is = C.unstable_LowPriority, Uo = C.unstable_IdlePriority, sr = C.log, Sc = C.unstable_setDisableYieldValue, sn = null, Al = null;
  function wa(l) {
    if (typeof sr == "function" && Sc(l), Al && typeof Al.setStrictMode == "function")
      try {
        Al.setStrictMode(sn, l);
      } catch {
      }
  }
  var Ul = Math.clz32 ? Math.clz32 : U, Mi = Math.log, g = Math.LN2;
  function U(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (Mi(l) / g | 0) | 0;
  }
  var ee = 256, ae = 262144, ye = 4194304;
  function Ce(l) {
    var n = l & 42;
    if (n !== 0) return n;
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
  function pe(l, n, u) {
    var c = l.pendingLanes;
    if (c === 0) return 0;
    var r = 0, s = l.suspendedLanes, m = l.pingedLanes;
    l = l.warmLanes;
    var v = c & 134217727;
    return v !== 0 ? (c = v & ~s, c !== 0 ? r = Ce(c) : (m &= v, m !== 0 ? r = Ce(m) : u || (u = v & ~l, u !== 0 && (r = Ce(u))))) : (v = c & ~s, v !== 0 ? r = Ce(v) : m !== 0 ? r = Ce(m) : u || (u = c & ~l, u !== 0 && (r = Ce(u)))), r === 0 ? 0 : n !== 0 && n !== r && (n & s) === 0 && (s = r & -r, u = n & -n, s >= u || s === 32 && (u & 4194048) !== 0) ? n : r;
  }
  function lt(l, n) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & n) === 0;
  }
  function Qe(l, n) {
    switch (l) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return n + 250;
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
        return n + 5e3;
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
  function ea() {
    var l = ye;
    return ye <<= 1, (ye & 62914560) === 0 && (ye = 4194304), l;
  }
  function dn(l) {
    for (var n = [], u = 0; 31 > u; u++) n.push(l);
    return n;
  }
  function Ci(l, n) {
    l.pendingLanes |= n, n !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function Ho(l, n, u, c, r, s) {
    var m = l.pendingLanes;
    l.pendingLanes = u, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= u, l.entangledLanes &= u, l.errorRecoveryDisabledLanes &= u, l.shellSuspendCounter = 0;
    var v = l.entanglements, A = l.expirationTimes, j = l.hiddenUpdates;
    for (u = m & ~u; 0 < u; ) {
      var V = 31 - Ul(u), k = 1 << V;
      v[V] = 0, A[V] = -1;
      var q = j[V];
      if (q !== null)
        for (j[V] = null, V = 0; V < q.length; V++) {
          var X = q[V];
          X !== null && (X.lane &= -536870913);
        }
      u &= ~k;
    }
    c !== 0 && dr(l, c, 0), s !== 0 && r === 0 && l.tag !== 0 && (l.suspendedLanes |= s & ~(m & ~n));
  }
  function dr(l, n, u) {
    l.pendingLanes |= n, l.suspendedLanes &= ~n;
    var c = 31 - Ul(n);
    l.entangledLanes |= n, l.entanglements[c] = l.entanglements[c] | 1073741824 | u & 261930;
  }
  function cu(l, n) {
    var u = l.entangledLanes |= n;
    for (l = l.entanglements; u; ) {
      var c = 31 - Ul(u), r = 1 << c;
      r & n | l[c] & n && (l[c] |= n), u &= ~r;
    }
  }
  function Ga(l, n) {
    var u = n & -n;
    return u = (u & 42) !== 0 ? 1 : Ps(u), (u & (l.suspendedLanes | n)) !== 0 ? 0 : u;
  }
  function Ps(l) {
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
  function bm(l) {
    return l &= -l, 2 < l ? 8 < l ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function ed() {
    var l = Z.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : Rs(l.type));
  }
  function Em(l, n) {
    var u = Z.p;
    try {
      return Z.p = l, n();
    } finally {
      Z.p = u;
    }
  }
  var Cn = Math.random().toString(36).slice(2), Ct = "__reactFiber$" + Cn, fa = "__reactProps$" + Cn, Ui = "__reactContainer$" + Cn, td = "__reactEvents$" + Cn, Tm = "__reactListeners$" + Cn, T0 = "__reactHandles$" + Cn, Am = "__reactResources$" + Cn, ou = "__reactMarker$" + Cn;
  function ld(l) {
    delete l[Ct], delete l[fa], delete l[td], delete l[Tm], delete l[T0];
  }
  function bc(l) {
    var n = l[Ct];
    if (n) return n;
    for (var u = l.parentNode; u; ) {
      if (n = u[Ui] || u[Ct]) {
        if (u = n.alternate, n.child !== null || u !== null && u.child !== null)
          for (l = Fn(l); l !== null; ) {
            if (u = l[Ct]) return u;
            l = Fn(l);
          }
        return n;
      }
      l = u, u = l.parentNode;
    }
    return null;
  }
  function Ec(l) {
    if (l = l[Ct] || l[Ui]) {
      var n = l.tag;
      if (n === 5 || n === 6 || n === 13 || n === 31 || n === 26 || n === 27 || n === 3)
        return l;
    }
    return null;
  }
  function No(l) {
    var n = l.tag;
    if (n === 5 || n === 26 || n === 27 || n === 6) return l.stateNode;
    throw Error(M(33));
  }
  function Tc(l) {
    var n = l[Am];
    return n || (n = l[Am] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), n;
  }
  function Ot(l) {
    l[ou] = !0;
  }
  var Ac = /* @__PURE__ */ new Set(), Hi = {};
  function Ni(l, n) {
    fu(l, n), fu(l + "Capture", n);
  }
  function fu(l, n) {
    for (Hi[l] = n, l = 0; l < n.length; l++)
      Ac.add(n[l]);
  }
  var ad = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), nd = {}, Bo = {};
  function Yo(l) {
    return rr.call(Bo, l) ? !0 : rr.call(nd, l) ? !1 : ad.test(l) ? Bo[l] = !0 : (nd[l] = !0, !1);
  }
  function jo(l, n, u) {
    if (Yo(n))
      if (u === null) l.removeAttribute(n);
      else {
        switch (typeof u) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(n);
            return;
          case "boolean":
            var c = n.toLowerCase().slice(0, 5);
            if (c !== "data-" && c !== "aria-") {
              l.removeAttribute(n);
              return;
            }
        }
        l.setAttribute(n, "" + u);
      }
  }
  function ud(l, n, u) {
    if (u === null) l.removeAttribute(n);
    else {
      switch (typeof u) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(n);
          return;
      }
      l.setAttribute(n, "" + u);
    }
  }
  function Fu(l, n, u, c) {
    if (c === null) l.removeAttribute(u);
    else {
      switch (typeof c) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(u);
          return;
      }
      l.setAttributeNS(n, u, "" + c);
    }
  }
  function La(l) {
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
  function id(l) {
    var n = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (n === "checkbox" || n === "radio");
  }
  function Om(l, n, u) {
    var c = Object.getOwnPropertyDescriptor(
      l.constructor.prototype,
      n
    );
    if (!l.hasOwnProperty(n) && typeof c < "u" && typeof c.get == "function" && typeof c.set == "function") {
      var r = c.get, s = c.set;
      return Object.defineProperty(l, n, {
        configurable: !0,
        get: function() {
          return r.call(this);
        },
        set: function(m) {
          u = "" + m, s.call(this, m);
        }
      }), Object.defineProperty(l, n, {
        enumerable: c.enumerable
      }), {
        getValue: function() {
          return u;
        },
        setValue: function(m) {
          u = "" + m;
        },
        stopTracking: function() {
          l._valueTracker = null, delete l[n];
        }
      };
    }
  }
  function cd(l) {
    if (!l._valueTracker) {
      var n = id(l) ? "checked" : "value";
      l._valueTracker = Om(
        l,
        n,
        "" + l[n]
      );
    }
  }
  function Rm(l) {
    if (!l) return !1;
    var n = l._valueTracker;
    if (!n) return !0;
    var u = n.getValue(), c = "";
    return l && (c = id(l) ? l.checked ? "true" : "false" : l.value), l = c, l !== u ? (n.setValue(l), !0) : !1;
  }
  function hr(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  var kv = /[\n"\\]/g;
  function Xa(l) {
    return l.replace(
      kv,
      function(n) {
        return "\\" + n.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function mr(l, n, u, c, r, s, m, v) {
    l.name = "", m != null && typeof m != "function" && typeof m != "symbol" && typeof m != "boolean" ? l.type = m : l.removeAttribute("type"), n != null ? m === "number" ? (n === 0 && l.value === "" || l.value != n) && (l.value = "" + La(n)) : l.value !== "" + La(n) && (l.value = "" + La(n)) : m !== "submit" && m !== "reset" || l.removeAttribute("value"), n != null ? Oc(l, m, La(n)) : u != null ? Oc(l, m, La(u)) : c != null && l.removeAttribute("value"), r == null && s != null && (l.defaultChecked = !!s), r != null && (l.checked = r && typeof r != "function" && typeof r != "symbol"), v != null && typeof v != "function" && typeof v != "symbol" && typeof v != "boolean" ? l.name = "" + La(v) : l.removeAttribute("name");
  }
  function yr(l, n, u, c, r, s, m, v) {
    if (s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (l.type = s), n != null || u != null) {
      if (!(s !== "submit" && s !== "reset" || n != null)) {
        cd(l);
        return;
      }
      u = u != null ? "" + La(u) : "", n = n != null ? "" + La(n) : u, v || n === l.value || (l.value = n), l.defaultValue = n;
    }
    c = c ?? r, c = typeof c != "function" && typeof c != "symbol" && !!c, l.checked = v ? l.checked : !!c, l.defaultChecked = !!c, m != null && typeof m != "function" && typeof m != "symbol" && typeof m != "boolean" && (l.name = m), cd(l);
  }
  function Oc(l, n, u) {
    n === "number" && hr(l.ownerDocument) === l || l.defaultValue === "" + u || (l.defaultValue = "" + u);
  }
  function qo(l, n, u, c) {
    if (l = l.options, n) {
      n = {};
      for (var r = 0; r < u.length; r++)
        n["$" + u[r]] = !0;
      for (u = 0; u < l.length; u++)
        r = n.hasOwnProperty("$" + l[u].value), l[u].selected !== r && (l[u].selected = r), r && c && (l[u].defaultSelected = !0);
    } else {
      for (u = "" + La(u), n = null, r = 0; r < l.length; r++) {
        if (l[r].value === u) {
          l[r].selected = !0, c && (l[r].defaultSelected = !0);
          return;
        }
        n !== null || l[r].disabled || (n = l[r]);
      }
      n !== null && (n.selected = !0);
    }
  }
  function zm(l, n, u) {
    if (n != null && (n = "" + La(n), n !== l.value && (l.value = n), u == null)) {
      l.defaultValue !== n && (l.defaultValue = n);
      return;
    }
    l.defaultValue = u != null ? "" + La(u) : "";
  }
  function Dm(l, n, u, c) {
    if (n == null) {
      if (c != null) {
        if (u != null) throw Error(M(92));
        if (wt(c)) {
          if (1 < c.length) throw Error(M(93));
          c = c[0];
        }
        u = c;
      }
      u == null && (u = ""), n = u;
    }
    u = La(n), l.defaultValue = u, c = l.textContent, c === u && c !== "" && c !== null && (l.value = c), cd(l);
  }
  function ru(l, n) {
    if (n) {
      var u = l.firstChild;
      if (u && u === l.lastChild && u.nodeType === 3) {
        u.nodeValue = n;
        return;
      }
    }
    l.textContent = n;
  }
  var A0 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function O0(l, n, u) {
    var c = n.indexOf("--") === 0;
    u == null || typeof u == "boolean" || u === "" ? c ? l.setProperty(n, "") : n === "float" ? l.cssFloat = "" : l[n] = "" : c ? l.setProperty(n, u) : typeof u != "number" || u === 0 || A0.has(n) ? n === "float" ? l.cssFloat = u : l[n] = ("" + u).trim() : l[n] = u + "px";
  }
  function R0(l, n, u) {
    if (n != null && typeof n != "object")
      throw Error(M(62));
    if (l = l.style, u != null) {
      for (var c in u)
        !u.hasOwnProperty(c) || n != null && n.hasOwnProperty(c) || (c.indexOf("--") === 0 ? l.setProperty(c, "") : c === "float" ? l.cssFloat = "" : l[c] = "");
      for (var r in n)
        c = n[r], n.hasOwnProperty(r) && u[r] !== c && O0(l, r, c);
    } else
      for (var s in n)
        n.hasOwnProperty(s) && O0(l, s, n[s]);
  }
  function _m(l) {
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
  var Wv = /* @__PURE__ */ new Map([
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
  ]), pr = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function hn(l) {
    return pr.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  function Un() {
  }
  var od = null;
  function fd(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var su = null, Rc = null;
  function gr(l) {
    var n = Ec(l);
    if (n && (l = n.stateNode)) {
      var u = l[fa] || null;
      e: switch (l = n.stateNode, n.type) {
        case "input":
          if (mr(
            l,
            u.value,
            u.defaultValue,
            u.defaultValue,
            u.checked,
            u.defaultChecked,
            u.type,
            u.name
          ), n = u.name, u.type === "radio" && n != null) {
            for (u = l; u.parentNode; ) u = u.parentNode;
            for (u = u.querySelectorAll(
              'input[name="' + Xa(
                "" + n
              ) + '"][type="radio"]'
            ), n = 0; n < u.length; n++) {
              var c = u[n];
              if (c !== l && c.form === l.form) {
                var r = c[fa] || null;
                if (!r) throw Error(M(90));
                mr(
                  c,
                  r.value,
                  r.defaultValue,
                  r.defaultValue,
                  r.checked,
                  r.defaultChecked,
                  r.type,
                  r.name
                );
              }
            }
            for (n = 0; n < u.length; n++)
              c = u[n], c.form === l.form && Rm(c);
          }
          break e;
        case "textarea":
          zm(l, u.value, u.defaultValue);
          break e;
        case "select":
          n = u.value, n != null && qo(l, !!u.multiple, n, !1);
      }
    }
  }
  var xo = !1;
  function Mm(l, n, u) {
    if (xo) return l(n, u);
    xo = !0;
    try {
      var c = l(n);
      return c;
    } finally {
      if (xo = !1, (su !== null || Rc !== null) && (Ef(), su && (n = su, l = Rc, Rc = su = null, gr(n), l)))
        for (n = 0; n < l.length; n++) gr(l[n]);
    }
  }
  function Hl(l, n) {
    var u = l.stateNode;
    if (u === null) return null;
    var c = u[fa] || null;
    if (c === null) return null;
    u = c[n];
    e: switch (n) {
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
        (c = !c.disabled) || (l = l.type, c = !(l === "button" || l === "input" || l === "select" || l === "textarea")), l = !c;
        break e;
      default:
        l = !1;
    }
    if (l) return null;
    if (u && typeof u != "function")
      throw Error(
        M(231, n, typeof u)
      );
    return u;
  }
  var Iu = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), vr = !1;
  if (Iu)
    try {
      var wo = {};
      Object.defineProperty(wo, "passive", {
        get: function() {
          vr = !0;
        }
      }), window.addEventListener("test", wo, wo), window.removeEventListener("test", wo, wo);
    } catch {
      vr = !1;
    }
  var Pu = null, Cm = null, rd = null;
  function Um() {
    if (rd) return rd;
    var l, n = Cm, u = n.length, c, r = "value" in Pu ? Pu.value : Pu.textContent, s = r.length;
    for (l = 0; l < u && n[l] === r[l]; l++) ;
    var m = u - l;
    for (c = 1; c <= m && n[u - c] === r[s - c]; c++) ;
    return rd = r.slice(l, 1 < c ? 1 - c : void 0);
  }
  function sd(l) {
    var n = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && n === 13 && (l = 13)) : l = n, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function Sr() {
    return !0;
  }
  function z0() {
    return !1;
  }
  function Kl(l) {
    function n(u, c, r, s, m) {
      this._reactName = u, this._targetInst = r, this.type = c, this.nativeEvent = s, this.target = m, this.currentTarget = null;
      for (var v in l)
        l.hasOwnProperty(v) && (u = l[v], this[v] = u ? u(s) : s[v]);
      return this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1) ? Sr : z0, this.isPropagationStopped = z0, this;
    }
    return w(n.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var u = this.nativeEvent;
        u && (u.preventDefault ? u.preventDefault() : typeof u.returnValue != "unknown" && (u.returnValue = !1), this.isDefaultPrevented = Sr);
      },
      stopPropagation: function() {
        var u = this.nativeEvent;
        u && (u.stopPropagation ? u.stopPropagation() : typeof u.cancelBubble != "unknown" && (u.cancelBubble = !0), this.isPropagationStopped = Sr);
      },
      persist: function() {
      },
      isPersistent: Sr
    }), n;
  }
  var Bi = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, br = Kl(Bi), Go = w({}, Bi, { view: 0, detail: 0 }), Fv = Kl(Go), Hm, Nm, Er, dd = w({}, Go, {
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
    getModifierState: mn,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
      return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
    },
    movementX: function(l) {
      return "movementX" in l ? l.movementX : (l !== Er && (Er && l.type === "mousemove" ? (Hm = l.screenX - Er.screenX, Nm = l.screenY - Er.screenY) : Nm = Hm = 0, Er = l), Hm);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : Nm;
    }
  }), Lo = Kl(dd), D0 = w({}, dd, { dataTransfer: 0 }), _0 = Kl(D0), M0 = w({}, Go, { relatedTarget: 0 }), hd = Kl(M0), Bm = w({}, Bi, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), C0 = Kl(Bm), zc = w({}, Bi, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), Dc = Kl(zc), Hn = w({}, Bi, { data: 0 }), U0 = Kl(Hn), Ym = {
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
  }, du = {
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
  }, H0 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Nn(l) {
    var n = this.nativeEvent;
    return n.getModifierState ? n.getModifierState(l) : (l = H0[l]) ? !!n[l] : !1;
  }
  function mn() {
    return Nn;
  }
  var md = w({}, Go, {
    key: function(l) {
      if (l.key) {
        var n = Ym[l.key] || l.key;
        if (n !== "Unidentified") return n;
      }
      return l.type === "keypress" ? (l = sd(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? du[l.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: mn,
    charCode: function(l) {
      return l.type === "keypress" ? sd(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? sd(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), yd = Kl(md), jm = w({}, dd, {
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
  }), Bn = Kl(jm), Iv = w({}, Go, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: mn
  }), N0 = Kl(Iv), B0 = w({}, Bi, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Pv = Kl(B0), qm = w({}, dd, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), e1 = Kl(qm), Y0 = w({}, Bi, {
    newState: 0,
    oldState: 0
  }), xm = Kl(Y0), pd = [9, 13, 27, 32], Xo = Iu && "CompositionEvent" in window, _c = null;
  Iu && "documentMode" in document && (_c = document.documentMode);
  var ta = Iu && "TextEvent" in window && !_c, wm = Iu && (!Xo || _c && 8 < _c && 11 >= _c), Tr = " ", Yi = !1;
  function gd(l, n) {
    switch (l) {
      case "keyup":
        return pd.indexOf(n.keyCode) !== -1;
      case "keydown":
        return n.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Gm(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var Mc = !1;
  function j0(l, n) {
    switch (l) {
      case "compositionend":
        return Gm(n);
      case "keypress":
        return n.which !== 32 ? null : (Yi = !0, Tr);
      case "textInput":
        return l = n.data, l === Tr && Yi ? null : l;
      default:
        return null;
    }
  }
  function t1(l, n) {
    if (Mc)
      return l === "compositionend" || !Xo && gd(l, n) ? (l = Um(), rd = Cm = Pu = null, Mc = !1, l) : null;
    switch (l) {
      case "paste":
        return null;
      case "keypress":
        if (!(n.ctrlKey || n.altKey || n.metaKey) || n.ctrlKey && n.altKey) {
          if (n.char && 1 < n.char.length)
            return n.char;
          if (n.which) return String.fromCharCode(n.which);
        }
        return null;
      case "compositionend":
        return wm && n.locale !== "ko" ? null : n.data;
      default:
        return null;
    }
  }
  var Lm = {
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
  function hu(l) {
    var n = l && l.nodeName && l.nodeName.toLowerCase();
    return n === "input" ? !!Lm[l.type] : n === "textarea";
  }
  function Xm(l, n, u, c) {
    su ? Rc ? Rc.push(c) : Rc = [c] : su = c, n = vs(n, "onChange"), 0 < n.length && (u = new br(
      "onChange",
      "change",
      null,
      u,
      c
    ), l.push({ event: u, listeners: n }));
  }
  var Cc = null, ji = null;
  function Uc(l) {
    Ug(l, 0);
  }
  function Qo(l) {
    var n = No(l);
    if (Rm(n)) return l;
  }
  function Qm(l, n) {
    if (l === "change") return n;
  }
  var vd = !1;
  if (Iu) {
    var ra;
    if (Iu) {
      var Yn = "oninput" in document;
      if (!Yn) {
        var Vm = document.createElement("div");
        Vm.setAttribute("oninput", "return;"), Yn = typeof Vm.oninput == "function";
      }
      ra = Yn;
    } else ra = !1;
    vd = ra && (!document.documentMode || 9 < document.documentMode);
  }
  function Sd() {
    Cc && (Cc.detachEvent("onpropertychange", bd), ji = Cc = null);
  }
  function bd(l) {
    if (l.propertyName === "value" && Qo(ji)) {
      var n = [];
      Xm(
        n,
        ji,
        l,
        fd(l)
      ), Mm(Uc, n);
    }
  }
  function q0(l, n, u) {
    l === "focusin" ? (Sd(), Cc = n, ji = u, Cc.attachEvent("onpropertychange", bd)) : l === "focusout" && Sd();
  }
  function x0(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return Qo(ji);
  }
  function qi(l, n) {
    if (l === "click") return Qo(n);
  }
  function Hc(l, n) {
    if (l === "input" || l === "change")
      return Qo(n);
  }
  function w0(l, n) {
    return l === n && (l !== 0 || 1 / l === 1 / n) || l !== l && n !== n;
  }
  var la = typeof Object.is == "function" ? Object.is : w0;
  function yn(l, n) {
    if (la(l, n)) return !0;
    if (typeof l != "object" || l === null || typeof n != "object" || n === null)
      return !1;
    var u = Object.keys(l), c = Object.keys(n);
    if (u.length !== c.length) return !1;
    for (c = 0; c < u.length; c++) {
      var r = u[c];
      if (!rr.call(n, r) || !la(l[r], n[r]))
        return !1;
    }
    return !0;
  }
  function Zm(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function Jm(l, n) {
    var u = Zm(l);
    l = 0;
    for (var c; u; ) {
      if (u.nodeType === 3) {
        if (c = l + u.textContent.length, l <= n && c >= n)
          return { node: u, offset: n - l };
        l = c;
      }
      e: {
        for (; u; ) {
          if (u.nextSibling) {
            u = u.nextSibling;
            break e;
          }
          u = u.parentNode;
        }
        u = void 0;
      }
      u = Zm(u);
    }
  }
  function Nc(l, n) {
    return l && n ? l === n ? !0 : l && l.nodeType === 3 ? !1 : n && n.nodeType === 3 ? Nc(l, n.parentNode) : "contains" in l ? l.contains(n) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(n) & 16) : !1 : !1;
  }
  function xi(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var n = hr(l.document); n instanceof l.HTMLIFrameElement; ) {
      try {
        var u = typeof n.contentWindow.location.href == "string";
      } catch {
        u = !1;
      }
      if (u) l = n.contentWindow;
      else break;
      n = hr(l.document);
    }
    return n;
  }
  function Ar(l) {
    var n = l && l.nodeName && l.nodeName.toLowerCase();
    return n && (n === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || n === "textarea" || l.contentEditable === "true");
  }
  var Or = Iu && "documentMode" in document && 11 >= document.documentMode, wi = null, Vo = null, pn = null, jn = !1;
  function Ed(l, n, u) {
    var c = u.window === u ? u.document : u.nodeType === 9 ? u : u.ownerDocument;
    jn || wi == null || wi !== hr(c) || (c = wi, "selectionStart" in c && Ar(c) ? c = { start: c.selectionStart, end: c.selectionEnd } : (c = (c.ownerDocument && c.ownerDocument.defaultView || window).getSelection(), c = {
      anchorNode: c.anchorNode,
      anchorOffset: c.anchorOffset,
      focusNode: c.focusNode,
      focusOffset: c.focusOffset
    }), pn && yn(pn, c) || (pn = c, c = vs(Vo, "onSelect"), 0 < c.length && (n = new br(
      "onSelect",
      "select",
      null,
      n,
      u
    ), l.push({ event: n, listeners: c }), n.target = wi)));
  }
  function ei(l, n) {
    var u = {};
    return u[l.toLowerCase()] = n.toLowerCase(), u["Webkit" + l] = "webkit" + n, u["Moz" + l] = "moz" + n, u;
  }
  var qn = {
    animationend: ei("Animation", "AnimationEnd"),
    animationiteration: ei("Animation", "AnimationIteration"),
    animationstart: ei("Animation", "AnimationStart"),
    transitionrun: ei("Transition", "TransitionRun"),
    transitionstart: ei("Transition", "TransitionStart"),
    transitioncancel: ei("Transition", "TransitionCancel"),
    transitionend: ei("Transition", "TransitionEnd")
  }, Zo = {}, Gi = {};
  Iu && (Gi = document.createElement("div").style, "AnimationEvent" in window || (delete qn.animationend.animation, delete qn.animationiteration.animation, delete qn.animationstart.animation), "TransitionEvent" in window || delete qn.transitionend.transition);
  function Et(l) {
    if (Zo[l]) return Zo[l];
    if (!qn[l]) return l;
    var n = qn[l], u;
    for (u in n)
      if (n.hasOwnProperty(u) && u in Gi)
        return Zo[l] = n[u];
    return l;
  }
  var Rr = Et("animationend"), Km = Et("animationiteration"), Td = Et("animationstart"), Bc = Et("transitionrun"), zr = Et("transitionstart"), mu = Et("transitioncancel"), G0 = Et("transitionend"), yu = /* @__PURE__ */ new Map(), Jo = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Jo.push("scrollEnd");
  function sa(l, n) {
    yu.set(l, n), Ni(n, [l]);
  }
  var Yc = typeof reportError == "function" ? reportError : function(l) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var n = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof l == "object" && l !== null && typeof l.message == "string" ? String(l.message) : String(l),
        error: l
      });
      if (!window.dispatchEvent(n)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", l);
      return;
    }
    console.error(l);
  }, Wt = [], Nl = 0, gn = 0;
  function Qa() {
    for (var l = Nl, n = gn = Nl = 0; n < l; ) {
      var u = Wt[n];
      Wt[n++] = null;
      var c = Wt[n];
      Wt[n++] = null;
      var r = Wt[n];
      Wt[n++] = null;
      var s = Wt[n];
      if (Wt[n++] = null, c !== null && r !== null) {
        var m = c.pending;
        m === null ? r.next = r : (r.next = m.next, m.next = r), c.pending = r;
      }
      s !== 0 && Ad(u, r, s);
    }
  }
  function Va(l, n, u, c) {
    Wt[Nl++] = l, Wt[Nl++] = n, Wt[Nl++] = u, Wt[Nl++] = c, gn |= c, l.lanes |= c, l = l.alternate, l !== null && (l.lanes |= c);
  }
  function vn(l, n, u, c) {
    return Va(l, n, u, c), Dr(l);
  }
  function ti(l, n) {
    return Va(l, null, null, n), Dr(l);
  }
  function Ad(l, n, u) {
    l.lanes |= u;
    var c = l.alternate;
    c !== null && (c.lanes |= u);
    for (var r = !1, s = l.return; s !== null; )
      s.childLanes |= u, c = s.alternate, c !== null && (c.childLanes |= u), s.tag === 22 && (l = s.stateNode, l === null || l._visibility & 1 || (r = !0)), l = s, s = s.return;
    return l.tag === 3 ? (s = l.stateNode, r && n !== null && (r = 31 - Ul(u), l = s.hiddenUpdates, c = l[r], c === null ? l[r] = [n] : c.push(n), n.lane = u | 536870912), s) : null;
  }
  function Dr(l) {
    if (50 < bf)
      throw bf = 0, fs = null, Error(M(185));
    for (var n = l.return; n !== null; )
      l = n, n = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var da = {};
  function L0(l, n, u, c) {
    this.tag = l, this.key = u, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = n, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = c, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function cl(l, n, u, c) {
    return new L0(l, n, u, c);
  }
  function jc(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function li(l, n) {
    var u = l.alternate;
    return u === null ? (u = cl(
      l.tag,
      n,
      l.key,
      l.mode
    ), u.elementType = l.elementType, u.type = l.type, u.stateNode = l.stateNode, u.alternate = l, l.alternate = u) : (u.pendingProps = n, u.type = l.type, u.flags = 0, u.subtreeFlags = 0, u.deletions = null), u.flags = l.flags & 65011712, u.childLanes = l.childLanes, u.lanes = l.lanes, u.child = l.child, u.memoizedProps = l.memoizedProps, u.memoizedState = l.memoizedState, u.updateQueue = l.updateQueue, n = l.dependencies, u.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }, u.sibling = l.sibling, u.index = l.index, u.ref = l.ref, u.refCleanup = l.refCleanup, u;
  }
  function $m(l, n) {
    l.flags &= 65011714;
    var u = l.alternate;
    return u === null ? (l.childLanes = 0, l.lanes = n, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = u.childLanes, l.lanes = u.lanes, l.child = u.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = u.memoizedProps, l.memoizedState = u.memoizedState, l.updateQueue = u.updateQueue, l.type = u.type, n = u.dependencies, l.dependencies = n === null ? null : {
      lanes: n.lanes,
      firstContext: n.firstContext
    }), l;
  }
  function Od(l, n, u, c, r, s) {
    var m = 0;
    if (c = l, typeof l == "function") jc(l) && (m = 1);
    else if (typeof l == "string")
      m = gp(
        l,
        u,
        I.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      e: switch (l) {
        case Ye:
          return l = cl(31, u, n, r), l.elementType = Ye, l.lanes = s, l;
        case bt:
          return ai(u.children, r, s, n);
        case it:
          m = 8, r |= 24;
          break;
        case Fe:
          return l = cl(12, u, n, r | 2), l.elementType = Fe, l.lanes = s, l;
        case jt:
          return l = cl(13, u, n, r), l.elementType = jt, l.lanes = s, l;
        case qt:
          return l = cl(19, u, n, r), l.elementType = qt, l.lanes = s, l;
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case yt:
                m = 10;
                break e;
              case kt:
                m = 9;
                break e;
              case Mt:
                m = 11;
                break e;
              case De:
                m = 14;
                break e;
              case Ge:
                m = 16, c = null;
                break e;
            }
          m = 29, u = Error(
            M(130, l === null ? "null" : typeof l, "")
          ), c = null;
      }
    return n = cl(m, u, n, r), n.elementType = l, n.type = c, n.lanes = s, n;
  }
  function ai(l, n, u, c) {
    return l = cl(7, l, c, n), l.lanes = u, l;
  }
  function Ko(l, n, u) {
    return l = cl(6, l, null, n), l.lanes = u, l;
  }
  function km(l) {
    var n = cl(18, null, null, 0);
    return n.stateNode = l, n;
  }
  function Rd(l, n, u) {
    return n = cl(
      4,
      l.children !== null ? l.children : [],
      l.key,
      n
    ), n.lanes = u, n.stateNode = {
      containerInfo: l.containerInfo,
      pendingChildren: null,
      implementation: l.implementation
    }, n;
  }
  var Wm = /* @__PURE__ */ new WeakMap();
  function Za(l, n) {
    if (typeof l == "object" && l !== null) {
      var u = Wm.get(l);
      return u !== void 0 ? u : (n = {
        value: l,
        source: n,
        stack: gc(n)
      }, Wm.set(l, n), n);
    }
    return {
      value: l,
      source: n,
      stack: gc(n)
    };
  }
  var Ja = [], qc = 0, _r = null, dl = 0, za = [], ha = 0, xn = null, Da = 1, wn = "";
  function Sn(l, n) {
    Ja[qc++] = dl, Ja[qc++] = _r, _r = l, dl = n;
  }
  function Fm(l, n, u) {
    za[ha++] = Da, za[ha++] = wn, za[ha++] = xn, xn = l;
    var c = Da;
    l = wn;
    var r = 32 - Ul(c) - 1;
    c &= ~(1 << r), u += 1;
    var s = 32 - Ul(n) + r;
    if (30 < s) {
      var m = r - r % 5;
      s = (c & (1 << m) - 1).toString(32), c >>= m, r -= m, Da = 1 << 32 - Ul(n) + r | u << r | c, wn = s + l;
    } else
      Da = 1 << s | u << r | c, wn = l;
  }
  function $o(l) {
    l.return !== null && (Sn(l, 1), Fm(l, 1, 0));
  }
  function zd(l) {
    for (; l === _r; )
      _r = Ja[--qc], Ja[qc] = null, dl = Ja[--qc], Ja[qc] = null;
    for (; l === xn; )
      xn = za[--ha], za[ha] = null, wn = za[--ha], za[ha] = null, Da = za[--ha], za[ha] = null;
  }
  function Mr(l, n) {
    za[ha++] = Da, za[ha++] = wn, za[ha++] = xn, Da = n.id, wn = n.overflow, xn = l;
  }
  var Bl = null, Gt = null, ct = !1, pu = null, Ol = !1, gu = Error(M(519));
  function bn(l) {
    var n = Error(
      M(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Wo(Za(n, l)), gu;
  }
  function Cr(l) {
    var n = l.stateNode, u = l.type, c = l.memoizedProps;
    switch (n[Ct] = l, n[fa] = c, u) {
      case "dialog":
        ut("cancel", n), ut("close", n);
        break;
      case "iframe":
      case "object":
      case "embed":
        ut("load", n);
        break;
      case "video":
      case "audio":
        for (u = 0; u < zf.length; u++)
          ut(zf[u], n);
        break;
      case "source":
        ut("error", n);
        break;
      case "img":
      case "image":
      case "link":
        ut("error", n), ut("load", n);
        break;
      case "details":
        ut("toggle", n);
        break;
      case "input":
        ut("invalid", n), yr(
          n,
          c.value,
          c.defaultValue,
          c.checked,
          c.defaultChecked,
          c.type,
          c.name,
          !0
        );
        break;
      case "select":
        ut("invalid", n);
        break;
      case "textarea":
        ut("invalid", n), Dm(n, c.value, c.defaultValue, c.children);
    }
    u = c.children, typeof u != "string" && typeof u != "number" && typeof u != "bigint" || n.textContent === "" + u || c.suppressHydrationWarning === !0 || ip(n.textContent, u) ? (c.popover != null && (ut("beforetoggle", n), ut("toggle", n)), c.onScroll != null && ut("scroll", n), c.onScrollEnd != null && ut("scrollend", n), c.onClick != null && (n.onclick = Un), n = !0) : n = !1, n || bn(l, !0);
  }
  function ko(l) {
    for (Bl = l.return; Bl; )
      switch (Bl.tag) {
        case 5:
        case 31:
        case 13:
          Ol = !1;
          return;
        case 27:
        case 3:
          Ol = !0;
          return;
        default:
          Bl = Bl.return;
      }
  }
  function vu(l) {
    if (l !== Bl) return !1;
    if (!ct) return ko(l), ct = !0, !1;
    var n = l.tag, u;
    if ((u = n !== 3 && n !== 27) && ((u = n === 5) && (u = l.type, u = !(u !== "form" && u !== "button") || _f(l.type, l.memoizedProps)), u = !u), u && Gt && bn(l), ko(l), n === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(M(317));
      Gt = Mh(l);
    } else if (n === 31) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(M(317));
      Gt = Mh(l);
    } else
      n === 27 ? (n = Gt, Wn(l.type) ? (l = Es, Es = null, Gt = l) : Gt = n) : Gt = Bl ? Aa(l.stateNode.nextSibling) : null;
    return !0;
  }
  function Li() {
    Gt = Bl = null, ct = !1;
  }
  function Im() {
    var l = pu;
    return l !== null && (ul === null ? ul = l : ul.push.apply(
      ul,
      l
    ), pu = null), l;
  }
  function Wo(l) {
    pu === null ? pu = [l] : pu.push(l);
  }
  var Dd = S(null), ni = null, Gn = null;
  function ma(l, n, u) {
    P(Dd, n._currentValue), n._currentValue = u;
  }
  function Ln(l) {
    l._currentValue = Dd.current, Y(Dd);
  }
  function _d(l, n, u) {
    for (; l !== null; ) {
      var c = l.alternate;
      if ((l.childLanes & n) !== n ? (l.childLanes |= n, c !== null && (c.childLanes |= n)) : c !== null && (c.childLanes & n) !== n && (c.childLanes |= n), l === u) break;
      l = l.return;
    }
  }
  function Su(l, n, u, c) {
    var r = l.child;
    for (r !== null && (r.return = l); r !== null; ) {
      var s = r.dependencies;
      if (s !== null) {
        var m = r.child;
        s = s.firstContext;
        e: for (; s !== null; ) {
          var v = s;
          s = r;
          for (var A = 0; A < n.length; A++)
            if (v.context === n[A]) {
              s.lanes |= u, v = s.alternate, v !== null && (v.lanes |= u), _d(
                s.return,
                u,
                l
              ), c || (m = null);
              break e;
            }
          s = v.next;
        }
      } else if (r.tag === 18) {
        if (m = r.return, m === null) throw Error(M(341));
        m.lanes |= u, s = m.alternate, s !== null && (s.lanes |= u), _d(m, u, l), m = null;
      } else m = r.child;
      if (m !== null) m.return = r;
      else
        for (m = r; m !== null; ) {
          if (m === l) {
            m = null;
            break;
          }
          if (r = m.sibling, r !== null) {
            r.return = m.return, m = r;
            break;
          }
          m = m.return;
        }
      r = m;
    }
  }
  function Yl(l, n, u, c) {
    l = null;
    for (var r = n, s = !1; r !== null; ) {
      if (!s) {
        if ((r.flags & 524288) !== 0) s = !0;
        else if ((r.flags & 262144) !== 0) break;
      }
      if (r.tag === 10) {
        var m = r.alternate;
        if (m === null) throw Error(M(387));
        if (m = m.memoizedProps, m !== null) {
          var v = r.type;
          la(r.pendingProps.value, m.value) || (l !== null ? l.push(v) : l = [v]);
        }
      } else if (r === Re.current) {
        if (m = r.alternate, m === null) throw Error(M(387));
        m.memoizedState.memoizedState !== r.memoizedState.memoizedState && (l !== null ? l.push(Os) : l = [Os]);
      }
      r = r.return;
    }
    l !== null && Su(
      n,
      l,
      u,
      c
    ), n.flags |= 262144;
  }
  function xc(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!la(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function je(l) {
    ni = l, Gn = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function W(l) {
    return Ur(ni, l);
  }
  function ui(l, n) {
    return ni === null && je(l), Ur(l, n);
  }
  function Ur(l, n) {
    var u = n._currentValue;
    if (n = { context: n, memoizedValue: u, next: null }, Gn === null) {
      if (l === null) throw Error(M(308));
      Gn = n, l.dependencies = { lanes: 0, firstContext: n }, l.flags |= 524288;
    } else Gn = Gn.next = n;
    return u;
  }
  var ol = typeof AbortController < "u" ? AbortController : function() {
    var l = [], n = this.signal = {
      aborted: !1,
      addEventListener: function(u, c) {
        l.push(c);
      }
    };
    this.abort = function() {
      n.aborted = !0, l.forEach(function(u) {
        return u();
      });
    };
  }, Pm = C.unstable_scheduleCallback, ey = C.unstable_NormalPriority, hl = {
    $$typeof: yt,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Hr() {
    return {
      controller: new ol(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Nr(l) {
    l.refCount--, l.refCount === 0 && Pm(ey, function() {
      l.controller.abort();
    });
  }
  var wc = null, Br = 0, Xi = 0, Sl = null;
  function Rt(l, n) {
    if (wc === null) {
      var u = wc = [];
      Br = 0, Xi = Eh(), Sl = {
        status: "pending",
        value: void 0,
        then: function(c) {
          u.push(c);
        }
      };
    }
    return Br++, n.then(Yr, Yr), n;
  }
  function Yr() {
    if (--Br === 0 && wc !== null) {
      Sl !== null && (Sl.status = "fulfilled");
      var l = wc;
      wc = null, Xi = 0, Sl = null;
      for (var n = 0; n < l.length; n++) (0, l[n])();
    }
  }
  function jr(l, n) {
    var u = [], c = {
      status: "pending",
      value: null,
      reason: null,
      then: function(r) {
        u.push(r);
      }
    };
    return l.then(
      function() {
        c.status = "fulfilled", c.value = n;
        for (var r = 0; r < u.length; r++) (0, u[r])(n);
      },
      function(r) {
        for (c.status = "rejected", c.reason = r, r = 0; r < u.length; r++)
          (0, u[r])(void 0);
      }
    ), c;
  }
  var ii = D.S;
  D.S = function(l, n) {
    Ky = vl(), typeof n == "object" && n !== null && typeof n.then == "function" && Rt(l, n), ii !== null && ii(l, n);
  };
  var Ka = S(null);
  function $a() {
    var l = Ka.current;
    return l !== null ? l : Ht.pooledCache;
  }
  function Fo(l, n) {
    n === null ? P(Ka, Ka.current) : P(Ka, n.pool);
  }
  function Gc() {
    var l = $a();
    return l === null ? null : { parent: hl._currentValue, pool: l };
  }
  var Qi = Error(M(460)), Lc = Error(M(474)), Io = Error(M(542)), Xc = { then: function() {
  } };
  function ty(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function ly(l, n, u) {
    switch (u = l[u], u === void 0 ? l.push(n) : u !== n && (n.then(Un, Un), n = u), n.status) {
      case "fulfilled":
        return n.value;
      case "rejected":
        throw l = n.reason, Md(l), l;
      default:
        if (typeof n.status == "string") n.then(Un, Un);
        else {
          if (l = Ht, l !== null && 100 < l.shellSuspendCounter)
            throw Error(M(482));
          l = n, l.status = "pending", l.then(
            function(c) {
              if (n.status === "pending") {
                var r = n;
                r.status = "fulfilled", r.value = c;
              }
            },
            function(c) {
              if (n.status === "pending") {
                var r = n;
                r.status = "rejected", r.reason = c;
              }
            }
          );
        }
        switch (n.status) {
          case "fulfilled":
            return n.value;
          case "rejected":
            throw l = n.reason, Md(l), l;
        }
        throw Zi = n, Qi;
    }
  }
  function Vi(l) {
    try {
      var n = l._init;
      return n(l._payload);
    } catch (u) {
      throw u !== null && typeof u == "object" && typeof u.then == "function" ? (Zi = u, Qi) : u;
    }
  }
  var Zi = null;
  function ay() {
    if (Zi === null) throw Error(M(459));
    var l = Zi;
    return Zi = null, l;
  }
  function Md(l) {
    if (l === Qi || l === Io)
      throw Error(M(483));
  }
  var Ji = null, Qc = 0;
  function qr(l) {
    var n = Qc;
    return Qc += 1, Ji === null && (Ji = []), ly(Ji, l, n);
  }
  function Po(l, n) {
    n = n.props.ref, l.ref = n !== void 0 ? n : null;
  }
  function xr(l, n) {
    throw n.$$typeof === N ? Error(M(525)) : (l = Object.prototype.toString.call(n), Error(
      M(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(n).join(", ") + "}" : l
      )
    ));
  }
  function X0(l) {
    function n(H, z) {
      if (l) {
        var B = H.deletions;
        B === null ? (H.deletions = [z], H.flags |= 16) : B.push(z);
      }
    }
    function u(H, z) {
      if (!l) return null;
      for (; z !== null; )
        n(H, z), z = z.sibling;
      return null;
    }
    function c(H) {
      for (var z = /* @__PURE__ */ new Map(); H !== null; )
        H.key !== null ? z.set(H.key, H) : z.set(H.index, H), H = H.sibling;
      return z;
    }
    function r(H, z) {
      return H = li(H, z), H.index = 0, H.sibling = null, H;
    }
    function s(H, z, B) {
      return H.index = B, l ? (B = H.alternate, B !== null ? (B = B.index, B < z ? (H.flags |= 67108866, z) : B) : (H.flags |= 67108866, z)) : (H.flags |= 1048576, z);
    }
    function m(H) {
      return l && H.alternate === null && (H.flags |= 67108866), H;
    }
    function v(H, z, B, $) {
      return z === null || z.tag !== 6 ? (z = Ko(B, H.mode, $), z.return = H, z) : (z = r(z, B), z.return = H, z);
    }
    function A(H, z, B, $) {
      var Te = B.type;
      return Te === bt ? V(
        H,
        z,
        B.props.children,
        $,
        B.key
      ) : z !== null && (z.elementType === Te || typeof Te == "object" && Te !== null && Te.$$typeof === Ge && Vi(Te) === z.type) ? (z = r(z, B.props), Po(z, B), z.return = H, z) : (z = Od(
        B.type,
        B.key,
        B.props,
        null,
        H.mode,
        $
      ), Po(z, B), z.return = H, z);
    }
    function j(H, z, B, $) {
      return z === null || z.tag !== 4 || z.stateNode.containerInfo !== B.containerInfo || z.stateNode.implementation !== B.implementation ? (z = Rd(B, H.mode, $), z.return = H, z) : (z = r(z, B.children || []), z.return = H, z);
    }
    function V(H, z, B, $, Te) {
      return z === null || z.tag !== 7 ? (z = ai(
        B,
        H.mode,
        $,
        Te
      ), z.return = H, z) : (z = r(z, B), z.return = H, z);
    }
    function k(H, z, B) {
      if (typeof z == "string" && z !== "" || typeof z == "number" || typeof z == "bigint")
        return z = Ko(
          "" + z,
          H.mode,
          B
        ), z.return = H, z;
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case fe:
            return B = Od(
              z.type,
              z.key,
              z.props,
              null,
              H.mode,
              B
            ), Po(B, z), B.return = H, B;
          case Ze:
            return z = Rd(
              z,
              H.mode,
              B
            ), z.return = H, z;
          case Ge:
            return z = Vi(z), k(H, z, B);
        }
        if (wt(z) || ve(z))
          return z = ai(
            z,
            H.mode,
            B,
            null
          ), z.return = H, z;
        if (typeof z.then == "function")
          return k(H, qr(z), B);
        if (z.$$typeof === yt)
          return k(
            H,
            ui(H, z),
            B
          );
        xr(H, z);
      }
      return null;
    }
    function q(H, z, B, $) {
      var Te = z !== null ? z.key : null;
      if (typeof B == "string" && B !== "" || typeof B == "number" || typeof B == "bigint")
        return Te !== null ? null : v(H, z, "" + B, $);
      if (typeof B == "object" && B !== null) {
        switch (B.$$typeof) {
          case fe:
            return B.key === Te ? A(H, z, B, $) : null;
          case Ze:
            return B.key === Te ? j(H, z, B, $) : null;
          case Ge:
            return B = Vi(B), q(H, z, B, $);
        }
        if (wt(B) || ve(B))
          return Te !== null ? null : V(H, z, B, $, null);
        if (typeof B.then == "function")
          return q(
            H,
            z,
            qr(B),
            $
          );
        if (B.$$typeof === yt)
          return q(
            H,
            z,
            ui(H, B),
            $
          );
        xr(H, B);
      }
      return null;
    }
    function X(H, z, B, $, Te) {
      if (typeof $ == "string" && $ !== "" || typeof $ == "number" || typeof $ == "bigint")
        return H = H.get(B) || null, v(z, H, "" + $, Te);
      if (typeof $ == "object" && $ !== null) {
        switch ($.$$typeof) {
          case fe:
            return H = H.get(
              $.key === null ? B : $.key
            ) || null, A(z, H, $, Te);
          case Ze:
            return H = H.get(
              $.key === null ? B : $.key
            ) || null, j(z, H, $, Te);
          case Ge:
            return $ = Vi($), X(
              H,
              z,
              B,
              $,
              Te
            );
        }
        if (wt($) || ve($))
          return H = H.get(B) || null, V(z, H, $, Te, null);
        if (typeof $.then == "function")
          return X(
            H,
            z,
            B,
            qr($),
            Te
          );
        if ($.$$typeof === yt)
          return X(
            H,
            z,
            B,
            ui(z, $),
            Te
          );
        xr(z, $);
      }
      return null;
    }
    function he(H, z, B, $) {
      for (var Te = null, ht = null, ge = z, Ve = z = 0, ke = null; ge !== null && Ve < B.length; Ve++) {
        ge.index > Ve ? (ke = ge, ge = null) : ke = ge.sibling;
        var St = q(
          H,
          ge,
          B[Ve],
          $
        );
        if (St === null) {
          ge === null && (ge = ke);
          break;
        }
        l && ge && St.alternate === null && n(H, ge), z = s(St, z, Ve), ht === null ? Te = St : ht.sibling = St, ht = St, ge = ke;
      }
      if (Ve === B.length)
        return u(H, ge), ct && Sn(H, Ve), Te;
      if (ge === null) {
        for (; Ve < B.length; Ve++)
          ge = k(H, B[Ve], $), ge !== null && (z = s(
            ge,
            z,
            Ve
          ), ht === null ? Te = ge : ht.sibling = ge, ht = ge);
        return ct && Sn(H, Ve), Te;
      }
      for (ge = c(ge); Ve < B.length; Ve++)
        ke = X(
          ge,
          H,
          Ve,
          B[Ve],
          $
        ), ke !== null && (l && ke.alternate !== null && ge.delete(
          ke.key === null ? Ve : ke.key
        ), z = s(
          ke,
          z,
          Ve
        ), ht === null ? Te = ke : ht.sibling = ke, ht = ke);
      return l && ge.forEach(function(Pn) {
        return n(H, Pn);
      }), ct && Sn(H, Ve), Te;
    }
    function Me(H, z, B, $) {
      if (B == null) throw Error(M(151));
      for (var Te = null, ht = null, ge = z, Ve = z = 0, ke = null, St = B.next(); ge !== null && !St.done; Ve++, St = B.next()) {
        ge.index > Ve ? (ke = ge, ge = null) : ke = ge.sibling;
        var Pn = q(H, ge, St.value, $);
        if (Pn === null) {
          ge === null && (ge = ke);
          break;
        }
        l && ge && Pn.alternate === null && n(H, ge), z = s(Pn, z, Ve), ht === null ? Te = Pn : ht.sibling = Pn, ht = Pn, ge = ke;
      }
      if (St.done)
        return u(H, ge), ct && Sn(H, Ve), Te;
      if (ge === null) {
        for (; !St.done; Ve++, St = B.next())
          St = k(H, St.value, $), St !== null && (z = s(St, z, Ve), ht === null ? Te = St : ht.sibling = St, ht = St);
        return ct && Sn(H, Ve), Te;
      }
      for (ge = c(ge); !St.done; Ve++, St = B.next())
        St = X(ge, H, Ve, St.value, $), St !== null && (l && St.alternate !== null && ge.delete(St.key === null ? Ve : St.key), z = s(St, z, Ve), ht === null ? Te = St : ht.sibling = St, ht = St);
      return l && ge.forEach(function(Jg) {
        return n(H, Jg);
      }), ct && Sn(H, Ve), Te;
    }
    function Bt(H, z, B, $) {
      if (typeof B == "object" && B !== null && B.type === bt && B.key === null && (B = B.props.children), typeof B == "object" && B !== null) {
        switch (B.$$typeof) {
          case fe:
            e: {
              for (var Te = B.key; z !== null; ) {
                if (z.key === Te) {
                  if (Te = B.type, Te === bt) {
                    if (z.tag === 7) {
                      u(
                        H,
                        z.sibling
                      ), $ = r(
                        z,
                        B.props.children
                      ), $.return = H, H = $;
                      break e;
                    }
                  } else if (z.elementType === Te || typeof Te == "object" && Te !== null && Te.$$typeof === Ge && Vi(Te) === z.type) {
                    u(
                      H,
                      z.sibling
                    ), $ = r(z, B.props), Po($, B), $.return = H, H = $;
                    break e;
                  }
                  u(H, z);
                  break;
                } else n(H, z);
                z = z.sibling;
              }
              B.type === bt ? ($ = ai(
                B.props.children,
                H.mode,
                $,
                B.key
              ), $.return = H, H = $) : ($ = Od(
                B.type,
                B.key,
                B.props,
                null,
                H.mode,
                $
              ), Po($, B), $.return = H, H = $);
            }
            return m(H);
          case Ze:
            e: {
              for (Te = B.key; z !== null; ) {
                if (z.key === Te)
                  if (z.tag === 4 && z.stateNode.containerInfo === B.containerInfo && z.stateNode.implementation === B.implementation) {
                    u(
                      H,
                      z.sibling
                    ), $ = r(z, B.children || []), $.return = H, H = $;
                    break e;
                  } else {
                    u(H, z);
                    break;
                  }
                else n(H, z);
                z = z.sibling;
              }
              $ = Rd(B, H.mode, $), $.return = H, H = $;
            }
            return m(H);
          case Ge:
            return B = Vi(B), Bt(
              H,
              z,
              B,
              $
            );
        }
        if (wt(B))
          return he(
            H,
            z,
            B,
            $
          );
        if (ve(B)) {
          if (Te = ve(B), typeof Te != "function") throw Error(M(150));
          return B = Te.call(B), Me(
            H,
            z,
            B,
            $
          );
        }
        if (typeof B.then == "function")
          return Bt(
            H,
            z,
            qr(B),
            $
          );
        if (B.$$typeof === yt)
          return Bt(
            H,
            z,
            ui(H, B),
            $
          );
        xr(H, B);
      }
      return typeof B == "string" && B !== "" || typeof B == "number" || typeof B == "bigint" ? (B = "" + B, z !== null && z.tag === 6 ? (u(H, z.sibling), $ = r(z, B), $.return = H, H = $) : (u(H, z), $ = Ko(B, H.mode, $), $.return = H, H = $), m(H)) : u(H, z);
    }
    return function(H, z, B, $) {
      try {
        Qc = 0;
        var Te = Bt(
          H,
          z,
          B,
          $
        );
        return Ji = null, Te;
      } catch (ge) {
        if (ge === Qi || ge === Io) throw ge;
        var ht = cl(29, ge, null, H.mode);
        return ht.lanes = $, ht.return = H, ht;
      } finally {
      }
    };
  }
  var Ki = X0(!0), ny = X0(!1), ci = !1;
  function wr(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Cd(l, n) {
    l = l.updateQueue, n.updateQueue === l && (n.updateQueue = {
      baseState: l.baseState,
      firstBaseUpdate: l.firstBaseUpdate,
      lastBaseUpdate: l.lastBaseUpdate,
      shared: l.shared,
      callbacks: null
    });
  }
  function oi(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function ka(l, n, u) {
    var c = l.updateQueue;
    if (c === null) return null;
    if (c = c.shared, (vt & 2) !== 0) {
      var r = c.pending;
      return r === null ? n.next = n : (n.next = r.next, r.next = n), c.pending = n, n = Dr(l), Ad(l, null, u), n;
    }
    return Va(l, c, n, u), Dr(l);
  }
  function $i(l, n, u) {
    if (n = n.updateQueue, n !== null && (n = n.shared, (u & 4194048) !== 0)) {
      var c = n.lanes;
      c &= l.pendingLanes, u |= c, n.lanes = u, cu(l, u);
    }
  }
  function Ud(l, n) {
    var u = l.updateQueue, c = l.alternate;
    if (c !== null && (c = c.updateQueue, u === c)) {
      var r = null, s = null;
      if (u = u.firstBaseUpdate, u !== null) {
        do {
          var m = {
            lane: u.lane,
            tag: u.tag,
            payload: u.payload,
            callback: null,
            next: null
          };
          s === null ? r = s = m : s = s.next = m, u = u.next;
        } while (u !== null);
        s === null ? r = s = n : s = s.next = n;
      } else r = s = n;
      u = {
        baseState: c.baseState,
        firstBaseUpdate: r,
        lastBaseUpdate: s,
        shared: c.shared,
        callbacks: c.callbacks
      }, l.updateQueue = u;
      return;
    }
    l = u.lastBaseUpdate, l === null ? u.firstBaseUpdate = n : l.next = n, u.lastBaseUpdate = n;
  }
  var uy = !1;
  function ki() {
    if (uy) {
      var l = Sl;
      if (l !== null) throw l;
    }
  }
  function bu(l, n, u, c) {
    uy = !1;
    var r = l.updateQueue;
    ci = !1;
    var s = r.firstBaseUpdate, m = r.lastBaseUpdate, v = r.shared.pending;
    if (v !== null) {
      r.shared.pending = null;
      var A = v, j = A.next;
      A.next = null, m === null ? s = j : m.next = j, m = A;
      var V = l.alternate;
      V !== null && (V = V.updateQueue, v = V.lastBaseUpdate, v !== m && (v === null ? V.firstBaseUpdate = j : v.next = j, V.lastBaseUpdate = A));
    }
    if (s !== null) {
      var k = r.baseState;
      m = 0, V = j = A = null, v = s;
      do {
        var q = v.lane & -536870913, X = q !== v.lane;
        if (X ? (at & q) === q : (c & q) === q) {
          q !== 0 && q === Xi && (uy = !0), V !== null && (V = V.next = {
            lane: 0,
            tag: v.tag,
            payload: v.payload,
            callback: null,
            next: null
          });
          e: {
            var he = l, Me = v;
            q = n;
            var Bt = u;
            switch (Me.tag) {
              case 1:
                if (he = Me.payload, typeof he == "function") {
                  k = he.call(Bt, k, q);
                  break e;
                }
                k = he;
                break e;
              case 3:
                he.flags = he.flags & -65537 | 128;
              case 0:
                if (he = Me.payload, q = typeof he == "function" ? he.call(Bt, k, q) : he, q == null) break e;
                k = w({}, k, q);
                break e;
              case 2:
                ci = !0;
            }
          }
          q = v.callback, q !== null && (l.flags |= 64, X && (l.flags |= 8192), X = r.callbacks, X === null ? r.callbacks = [q] : X.push(q));
        } else
          X = {
            lane: q,
            tag: v.tag,
            payload: v.payload,
            callback: v.callback,
            next: null
          }, V === null ? (j = V = X, A = k) : V = V.next = X, m |= q;
        if (v = v.next, v === null) {
          if (v = r.shared.pending, v === null)
            break;
          X = v, v = X.next, X.next = null, r.lastBaseUpdate = X, r.shared.pending = null;
        }
      } while (!0);
      V === null && (A = k), r.baseState = A, r.firstBaseUpdate = j, r.lastBaseUpdate = V, s === null && (r.shared.lanes = 0), $n |= m, l.lanes = m, l.memoizedState = k;
    }
  }
  function Hd(l, n) {
    if (typeof l != "function")
      throw Error(M(191, l));
    l.call(n);
  }
  function Wi(l, n) {
    var u = l.callbacks;
    if (u !== null)
      for (l.callbacks = null, l = 0; l < u.length; l++)
        Hd(u[l], n);
  }
  var Rl = S(null), Vc = S(0);
  function Q0(l, n) {
    l = Kn, P(Vc, l), P(Rl, n), Kn = l | n.baseLanes;
  }
  function Gr() {
    P(Vc, Kn), P(Rl, Rl.current);
  }
  function ef() {
    Kn = Vc.current, Y(Rl), Y(Vc);
  }
  var ya = S(null), Wa = null;
  function Eu(l) {
    var n = l.alternate;
    P(Ft, Ft.current & 1), P(ya, l), Wa === null && (n === null || Rl.current !== null || n.memoizedState !== null) && (Wa = l);
  }
  function tf(l) {
    P(Ft, Ft.current), P(ya, l), Wa === null && (Wa = l);
  }
  function Nd(l) {
    l.tag === 22 ? (P(Ft, Ft.current), P(ya, l), Wa === null && (Wa = l)) : Xn();
  }
  function Xn() {
    P(Ft, Ft.current), P(ya, ya.current);
  }
  function pa(l) {
    Y(ya), Wa === l && (Wa = null), Y(Ft);
  }
  var Ft = S(0);
  function lf(l) {
    for (var n = l; n !== null; ) {
      if (n.tag === 13) {
        var u = n.memoizedState;
        if (u !== null && (u = u.dehydrated, u === null || On(u) || oc(u)))
          return n;
      } else if (n.tag === 19 && (n.memoizedProps.revealOrder === "forwards" || n.memoizedProps.revealOrder === "backwards" || n.memoizedProps.revealOrder === "unstable_legacy-backwards" || n.memoizedProps.revealOrder === "together")) {
        if ((n.flags & 128) !== 0) return n;
      } else if (n.child !== null) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === l) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === l) return null;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
    return null;
  }
  var Tu = 0, Je = null, zt = null, ml = null, Zc = !1, Jc = !1, fi = !1, Lr = 0, af = 0, Fi = null, V0 = 0;
  function al() {
    throw Error(M(321));
  }
  function ri(l, n) {
    if (n === null) return !1;
    for (var u = 0; u < n.length && u < l.length; u++)
      if (!la(l[u], n[u])) return !1;
    return !0;
  }
  function Xr(l, n, u, c, r, s) {
    return Tu = s, Je = n, n.memoizedState = null, n.updateQueue = null, n.lanes = 0, D.H = l === null || l.memoizedState === null ? I0 : Wd, fi = !1, s = u(c, r), fi = !1, Jc && (s = Z0(
      n,
      u,
      c,
      r
    )), Bd(l), s;
  }
  function Bd(l) {
    D.H = Fr;
    var n = zt !== null && zt.next !== null;
    if (Tu = 0, ml = zt = Je = null, Zc = !1, af = 0, Fi = null, n) throw Error(M(300));
    l === null || yl || (l = l.dependencies, l !== null && xc(l) && (yl = !0));
  }
  function Z0(l, n, u, c) {
    Je = l;
    var r = 0;
    do {
      if (Jc && (Fi = null), af = 0, Jc = !1, 25 <= r) throw Error(M(301));
      if (r += 1, ml = zt = null, l.updateQueue != null) {
        var s = l.updateQueue;
        s.lastEffect = null, s.events = null, s.stores = null, s.memoCache != null && (s.memoCache.index = 0);
      }
      D.H = P0, s = n(u, c);
    } while (Jc);
    return s;
  }
  function l1() {
    var l = D.H, n = l.useState()[0];
    return n = typeof n.then == "function" ? $c(n) : n, l = l.useState()[0], (zt !== null ? zt.memoizedState : null) !== l && (Je.flags |= 1024), n;
  }
  function Yd() {
    var l = Lr !== 0;
    return Lr = 0, l;
  }
  function Kc(l, n, u) {
    n.updateQueue = l.updateQueue, n.flags &= -2053, l.lanes &= ~u;
  }
  function Qr(l) {
    if (Zc) {
      for (l = l.memoizedState; l !== null; ) {
        var n = l.queue;
        n !== null && (n.pending = null), l = l.next;
      }
      Zc = !1;
    }
    Tu = 0, ml = zt = Je = null, Jc = !1, af = Lr = 0, Fi = null;
  }
  function jl() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return ml === null ? Je.memoizedState = ml = l : ml = ml.next = l, ml;
  }
  function fl() {
    if (zt === null) {
      var l = Je.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = zt.next;
    var n = ml === null ? Je.memoizedState : ml.next;
    if (n !== null)
      ml = n, zt = l;
    else {
      if (l === null)
        throw Je.alternate === null ? Error(M(467)) : Error(M(310));
      zt = l, l = {
        memoizedState: zt.memoizedState,
        baseState: zt.baseState,
        baseQueue: zt.baseQueue,
        queue: zt.queue,
        next: null
      }, ml === null ? Je.memoizedState = ml = l : ml = ml.next = l;
    }
    return ml;
  }
  function Vr() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function $c(l) {
    var n = af;
    return af += 1, Fi === null && (Fi = []), l = ly(Fi, l, n), n = Je, (ml === null ? n.memoizedState : ml.next) === null && (n = n.alternate, D.H = n === null || n.memoizedState === null ? I0 : Wd), l;
  }
  function nf(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return $c(l);
      if (l.$$typeof === yt) return W(l);
    }
    throw Error(M(438, String(l)));
  }
  function jd(l) {
    var n = null, u = Je.updateQueue;
    if (u !== null && (n = u.memoCache), n == null) {
      var c = Je.alternate;
      c !== null && (c = c.updateQueue, c !== null && (c = c.memoCache, c != null && (n = {
        data: c.data.map(function(r) {
          return r.slice();
        }),
        index: 0
      })));
    }
    if (n == null && (n = { data: [], index: 0 }), u === null && (u = Vr(), Je.updateQueue = u), u.memoCache = n, u = n.data[n.index], u === void 0)
      for (u = n.data[n.index] = Array(l), c = 0; c < l; c++)
        u[c] = re;
    return n.index++, u;
  }
  function Au(l, n) {
    return typeof n == "function" ? n(l) : n;
  }
  function Ou(l) {
    var n = fl();
    return qd(n, zt, l);
  }
  function qd(l, n, u) {
    var c = l.queue;
    if (c === null) throw Error(M(311));
    c.lastRenderedReducer = u;
    var r = l.baseQueue, s = c.pending;
    if (s !== null) {
      if (r !== null) {
        var m = r.next;
        r.next = s.next, s.next = m;
      }
      n.baseQueue = r = s, c.pending = null;
    }
    if (s = l.baseState, r === null) l.memoizedState = s;
    else {
      n = r.next;
      var v = m = null, A = null, j = n, V = !1;
      do {
        var k = j.lane & -536870913;
        if (k !== j.lane ? (at & k) === k : (Tu & k) === k) {
          var q = j.revertLane;
          if (q === 0)
            A !== null && (A = A.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: j.action,
              hasEagerState: j.hasEagerState,
              eagerState: j.eagerState,
              next: null
            }), k === Xi && (V = !0);
          else if ((Tu & q) === q) {
            j = j.next, q === Xi && (V = !0);
            continue;
          } else
            k = {
              lane: 0,
              revertLane: j.revertLane,
              gesture: null,
              action: j.action,
              hasEagerState: j.hasEagerState,
              eagerState: j.eagerState,
              next: null
            }, A === null ? (v = A = k, m = s) : A = A.next = k, Je.lanes |= q, $n |= q;
          k = j.action, fi && u(s, k), s = j.hasEagerState ? j.eagerState : u(s, k);
        } else
          q = {
            lane: k,
            revertLane: j.revertLane,
            gesture: j.gesture,
            action: j.action,
            hasEagerState: j.hasEagerState,
            eagerState: j.eagerState,
            next: null
          }, A === null ? (v = A = q, m = s) : A = A.next = q, Je.lanes |= k, $n |= k;
        j = j.next;
      } while (j !== null && j !== n);
      if (A === null ? m = s : A.next = v, !la(s, l.memoizedState) && (yl = !0, V && (u = Sl, u !== null)))
        throw u;
      l.memoizedState = s, l.baseState = m, l.baseQueue = A, c.lastRenderedState = s;
    }
    return r === null && (c.lanes = 0), [l.memoizedState, c.dispatch];
  }
  function xd(l) {
    var n = fl(), u = n.queue;
    if (u === null) throw Error(M(311));
    u.lastRenderedReducer = l;
    var c = u.dispatch, r = u.pending, s = n.memoizedState;
    if (r !== null) {
      u.pending = null;
      var m = r = r.next;
      do
        s = l(s, m.action), m = m.next;
      while (m !== r);
      la(s, n.memoizedState) || (yl = !0), n.memoizedState = s, n.baseQueue === null && (n.baseState = s), u.lastRenderedState = s;
    }
    return [s, c];
  }
  function iy(l, n, u) {
    var c = Je, r = fl(), s = ct;
    if (s) {
      if (u === void 0) throw Error(M(407));
      u = u();
    } else u = n();
    var m = !la(
      (zt || r).memoizedState,
      u
    );
    if (m && (r.memoizedState = u, yl = !0), r = r.queue, Qd(wd.bind(null, c, r, l), [
      l
    ]), r.getSnapshot !== n || m || ml !== null && ml.memoizedState.tag & 1) {
      if (c.flags |= 2048, Wc(
        9,
        { destroy: void 0 },
        cy.bind(
          null,
          c,
          r,
          u,
          n
        ),
        null
      ), Ht === null) throw Error(M(349));
      s || (Tu & 127) !== 0 || Zr(c, n, u);
    }
    return u;
  }
  function Zr(l, n, u) {
    l.flags |= 16384, l = { getSnapshot: n, value: u }, n = Je.updateQueue, n === null ? (n = Vr(), Je.updateQueue = n, n.stores = [l]) : (u = n.stores, u === null ? n.stores = [l] : u.push(l));
  }
  function cy(l, n, u, c) {
    n.value = u, n.getSnapshot = c, Gd(n) && Ld(l);
  }
  function wd(l, n, u) {
    return u(function() {
      Gd(n) && Ld(l);
    });
  }
  function Gd(l) {
    var n = l.getSnapshot;
    l = l.value;
    try {
      var u = n();
      return !la(l, u);
    } catch {
      return !0;
    }
  }
  function Ld(l) {
    var n = ti(l, 2);
    n !== null && Ta(n, l, 2);
  }
  function oy(l) {
    var n = jl();
    if (typeof l == "function") {
      var u = l;
      if (l = u(), fi) {
        wa(!0);
        try {
          u();
        } finally {
          wa(!1);
        }
      }
    }
    return n.memoizedState = n.baseState = l, n.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Au,
      lastRenderedState: l
    }, n;
  }
  function ql(l, n, u, c) {
    return l.baseState = u, qd(
      l,
      zt,
      typeof c == "function" ? c : Au
    );
  }
  function J0(l, n, u, c, r) {
    if (Wr(l)) throw Error(M(485));
    if (l = n.action, l !== null) {
      var s = {
        payload: r,
        action: l,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(m) {
          s.listeners.push(m);
        }
      };
      D.T !== null ? u(!0) : s.isTransition = !1, c(s), u = n.pending, u === null ? (s.next = n.pending = s, fy(n, s)) : (s.next = u.next, n.pending = u.next = s);
    }
  }
  function fy(l, n) {
    var u = n.action, c = n.payload, r = l.state;
    if (n.isTransition) {
      var s = D.T, m = {};
      D.T = m;
      try {
        var v = u(r, c), A = D.S;
        A !== null && A(m, v), ry(l, n, v);
      } catch (j) {
        kc(l, n, j);
      } finally {
        s !== null && m.types !== null && (s.types = m.types), D.T = s;
      }
    } else
      try {
        s = u(r, c), ry(l, n, s);
      } catch (j) {
        kc(l, n, j);
      }
  }
  function ry(l, n, u) {
    u !== null && typeof u == "object" && typeof u.then == "function" ? u.then(
      function(c) {
        sy(l, n, c);
      },
      function(c) {
        return kc(l, n, c);
      }
    ) : sy(l, n, u);
  }
  function sy(l, n, u) {
    n.status = "fulfilled", n.value = u, dy(n), l.state = u, n = l.pending, n !== null && (u = n.next, u === n ? l.pending = null : (u = u.next, n.next = u, fy(l, u)));
  }
  function kc(l, n, u) {
    var c = l.pending;
    if (l.pending = null, c !== null) {
      c = c.next;
      do
        n.status = "rejected", n.reason = u, dy(n), n = n.next;
      while (n !== c);
    }
    l.action = null;
  }
  function dy(l) {
    l = l.listeners;
    for (var n = 0; n < l.length; n++) (0, l[n])();
  }
  function Jr(l, n) {
    return n;
  }
  function hy(l, n) {
    if (ct) {
      var u = Ht.formState;
      if (u !== null) {
        e: {
          var c = Je;
          if (ct) {
            if (Gt) {
              t: {
                for (var r = Gt, s = Ol; r.nodeType !== 8; ) {
                  if (!s) {
                    r = null;
                    break t;
                  }
                  if (r = Aa(
                    r.nextSibling
                  ), r === null) {
                    r = null;
                    break t;
                  }
                }
                s = r.data, r = s === "F!" || s === "F" ? r : null;
              }
              if (r) {
                Gt = Aa(
                  r.nextSibling
                ), c = r.data === "F!";
                break e;
              }
            }
            bn(c);
          }
          c = !1;
        }
        c && (n = u[0]);
      }
    }
    return u = jl(), u.memoizedState = u.baseState = n, c = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Jr,
      lastRenderedState: n
    }, u.queue = c, u = $d.bind(
      null,
      Je,
      c
    ), c.dispatch = u, c = oy(!1), s = Ii.bind(
      null,
      Je,
      !1,
      c.queue
    ), c = jl(), r = {
      state: n,
      dispatch: null,
      action: l,
      pending: null
    }, c.queue = r, u = J0.bind(
      null,
      Je,
      r,
      s,
      u
    ), r.dispatch = u, c.memoizedState = l, [n, u, !1];
  }
  function K0(l) {
    var n = fl();
    return Kr(n, zt, l);
  }
  function Kr(l, n, u) {
    if (n = qd(
      l,
      n,
      Jr
    )[0], l = Ou(Au)[0], typeof n == "object" && n !== null && typeof n.then == "function")
      try {
        var c = $c(n);
      } catch (m) {
        throw m === Qi ? Io : m;
      }
    else c = n;
    n = fl();
    var r = n.queue, s = r.dispatch;
    return u !== n.memoizedState && (Je.flags |= 2048, Wc(
      9,
      { destroy: void 0 },
      my.bind(null, r, u),
      null
    )), [c, s, l];
  }
  function my(l, n) {
    l.action = n;
  }
  function yy(l) {
    var n = fl(), u = zt;
    if (u !== null)
      return Kr(n, u, l);
    fl(), n = n.memoizedState, u = fl();
    var c = u.queue.dispatch;
    return u.memoizedState = l, [n, c, !1];
  }
  function Wc(l, n, u, c) {
    return l = { tag: l, create: u, deps: c, inst: n, next: null }, n = Je.updateQueue, n === null && (n = Vr(), Je.updateQueue = n), u = n.lastEffect, u === null ? n.lastEffect = l.next = l : (c = u.next, u.next = l, l.next = c, n.lastEffect = l), l;
  }
  function py() {
    return fl().memoizedState;
  }
  function uf(l, n, u, c) {
    var r = jl();
    Je.flags |= l, r.memoizedState = Wc(
      1 | n,
      { destroy: void 0 },
      u,
      c === void 0 ? null : c
    );
  }
  function cf(l, n, u, c) {
    var r = fl();
    c = c === void 0 ? null : c;
    var s = r.memoizedState.inst;
    zt !== null && c !== null && ri(c, zt.memoizedState.deps) ? r.memoizedState = Wc(n, s, u, c) : (Je.flags |= l, r.memoizedState = Wc(
      1 | n,
      s,
      u,
      c
    ));
  }
  function Xd(l, n) {
    uf(8390656, 8, l, n);
  }
  function Qd(l, n) {
    cf(2048, 8, l, n);
  }
  function gy(l) {
    Je.flags |= 4;
    var n = Je.updateQueue;
    if (n === null)
      n = Vr(), Je.updateQueue = n, n.events = [l];
    else {
      var u = n.events;
      u === null ? n.events = [l] : u.push(l);
    }
  }
  function $r(l) {
    var n = fl().memoizedState;
    return gy({ ref: n, nextImpl: l }), function() {
      if ((vt & 2) !== 0) throw Error(M(440));
      return n.impl.apply(void 0, arguments);
    };
  }
  function Vd(l, n) {
    return cf(4, 2, l, n);
  }
  function vy(l, n) {
    return cf(4, 4, l, n);
  }
  function Zd(l, n) {
    if (typeof n == "function") {
      l = l();
      var u = n(l);
      return function() {
        typeof u == "function" ? u() : n(null);
      };
    }
    if (n != null)
      return l = l(), n.current = l, function() {
        n.current = null;
      };
  }
  function Sy(l, n, u) {
    u = u != null ? u.concat([l]) : null, cf(4, 4, Zd.bind(null, n, l), u);
  }
  function Qn() {
  }
  function Jd(l, n) {
    var u = fl();
    n = n === void 0 ? null : n;
    var c = u.memoizedState;
    return n !== null && ri(n, c[1]) ? c[0] : (u.memoizedState = [l, n], l);
  }
  function $0(l, n) {
    var u = fl();
    n = n === void 0 ? null : n;
    var c = u.memoizedState;
    if (n !== null && ri(n, c[1]))
      return c[0];
    if (c = l(), fi) {
      wa(!0);
      try {
        l();
      } finally {
        wa(!1);
      }
    }
    return u.memoizedState = [c, n], c;
  }
  function kr(l, n, u) {
    return u === void 0 || (Tu & 1073741824) !== 0 && (at & 261930) === 0 ? l.memoizedState = n : (l.memoizedState = u, l = fg(), Je.lanes |= l, $n |= l, u);
  }
  function Ru(l, n, u, c) {
    return la(u, n) ? u : Rl.current !== null ? (l = kr(l, u, c), la(l, n) || (yl = !0), l) : (Tu & 42) === 0 || (Tu & 1073741824) !== 0 && (at & 261930) === 0 ? (yl = !0, l.memoizedState = u) : (l = fg(), Je.lanes |= l, $n |= l, n);
  }
  function Kd(l, n, u, c, r) {
    var s = Z.p;
    Z.p = s !== 0 && 8 > s ? s : 8;
    var m = D.T, v = {};
    D.T = v, Ii(l, !1, n, u);
    try {
      var A = r(), j = D.S;
      if (j !== null && j(v, A), A !== null && typeof A == "object" && typeof A.then == "function") {
        var V = jr(
          A,
          c
        );
        si(
          l,
          n,
          V,
          Ua(l)
        );
      } else
        si(
          l,
          n,
          c,
          Ua(l)
        );
    } catch (k) {
      si(
        l,
        n,
        { then: function() {
        }, status: "rejected", reason: k },
        Ua()
      );
    } finally {
      Z.p = s, m !== null && v.types !== null && (m.types = v.types), D.T = m;
    }
  }
  function k0() {
  }
  function of(l, n, u, c) {
    if (l.tag !== 5) throw Error(M(476));
    var r = ff(l).queue;
    Kd(
      l,
      r,
      n,
      te,
      u === null ? k0 : function() {
        return Ut(l), u(c);
      }
    );
  }
  function ff(l) {
    var n = l.memoizedState;
    if (n !== null) return n;
    n = {
      memoizedState: te,
      baseState: te,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Au,
        lastRenderedState: te
      },
      next: null
    };
    var u = {};
    return n.next = {
      memoizedState: u,
      baseState: u,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Au,
        lastRenderedState: u
      },
      next: null
    }, l.memoizedState = n, l = l.alternate, l !== null && (l.memoizedState = n), n;
  }
  function Ut(l) {
    var n = ff(l);
    n.next === null && (n = l.alternate.memoizedState), si(
      l,
      n.next.queue,
      {},
      Ua()
    );
  }
  function by() {
    return W(Os);
  }
  function W0() {
    return fl().memoizedState;
  }
  function Ey() {
    return fl().memoizedState;
  }
  function zu(l) {
    for (var n = l.return; n !== null; ) {
      switch (n.tag) {
        case 24:
        case 3:
          var u = Ua();
          l = oi(u);
          var c = ka(n, l, u);
          c !== null && (Ta(c, n, u), $i(c, n, u)), n = { cache: Hr() }, l.payload = n;
          return;
      }
      n = n.return;
    }
  }
  function F0(l, n, u) {
    var c = Ua();
    u = {
      lane: c,
      revertLane: 0,
      gesture: null,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Wr(l) ? kd(n, u) : (u = vn(l, n, u, c), u !== null && (Ta(u, l, c), Ty(u, n, c)));
  }
  function $d(l, n, u) {
    var c = Ua();
    si(l, n, u, c);
  }
  function si(l, n, u, c) {
    var r = {
      lane: c,
      revertLane: 0,
      gesture: null,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Wr(l)) kd(n, r);
    else {
      var s = l.alternate;
      if (l.lanes === 0 && (s === null || s.lanes === 0) && (s = n.lastRenderedReducer, s !== null))
        try {
          var m = n.lastRenderedState, v = s(m, u);
          if (r.hasEagerState = !0, r.eagerState = v, la(v, m))
            return Va(l, n, r, 0), Ht === null && Qa(), !1;
        } catch {
        } finally {
        }
      if (u = vn(l, n, r, c), u !== null)
        return Ta(u, l, c), Ty(u, n, c), !0;
    }
    return !1;
  }
  function Ii(l, n, u, c) {
    if (c = {
      lane: 2,
      revertLane: Eh(),
      gesture: null,
      action: c,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Wr(l)) {
      if (n) throw Error(M(479));
    } else
      n = vn(
        l,
        u,
        c,
        2
      ), n !== null && Ta(n, l, 2);
  }
  function Wr(l) {
    var n = l.alternate;
    return l === Je || n !== null && n === Je;
  }
  function kd(l, n) {
    Jc = Zc = !0;
    var u = l.pending;
    u === null ? n.next = n : (n.next = u.next, u.next = n), l.pending = n;
  }
  function Ty(l, n, u) {
    if ((u & 4194048) !== 0) {
      var c = n.lanes;
      c &= l.pendingLanes, u |= c, n.lanes = u, cu(l, u);
    }
  }
  var Fr = {
    readContext: W,
    use: nf,
    useCallback: al,
    useContext: al,
    useEffect: al,
    useImperativeHandle: al,
    useLayoutEffect: al,
    useInsertionEffect: al,
    useMemo: al,
    useReducer: al,
    useRef: al,
    useState: al,
    useDebugValue: al,
    useDeferredValue: al,
    useTransition: al,
    useSyncExternalStore: al,
    useId: al,
    useHostTransitionStatus: al,
    useFormState: al,
    useActionState: al,
    useOptimistic: al,
    useMemoCache: al,
    useCacheRefresh: al
  };
  Fr.useEffectEvent = al;
  var I0 = {
    readContext: W,
    use: nf,
    useCallback: function(l, n) {
      return jl().memoizedState = [
        l,
        n === void 0 ? null : n
      ], l;
    },
    useContext: W,
    useEffect: Xd,
    useImperativeHandle: function(l, n, u) {
      u = u != null ? u.concat([l]) : null, uf(
        4194308,
        4,
        Zd.bind(null, n, l),
        u
      );
    },
    useLayoutEffect: function(l, n) {
      return uf(4194308, 4, l, n);
    },
    useInsertionEffect: function(l, n) {
      uf(4, 2, l, n);
    },
    useMemo: function(l, n) {
      var u = jl();
      n = n === void 0 ? null : n;
      var c = l();
      if (fi) {
        wa(!0);
        try {
          l();
        } finally {
          wa(!1);
        }
      }
      return u.memoizedState = [c, n], c;
    },
    useReducer: function(l, n, u) {
      var c = jl();
      if (u !== void 0) {
        var r = u(n);
        if (fi) {
          wa(!0);
          try {
            u(n);
          } finally {
            wa(!1);
          }
        }
      } else r = n;
      return c.memoizedState = c.baseState = r, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: r
      }, c.queue = l, l = l.dispatch = F0.bind(
        null,
        Je,
        l
      ), [c.memoizedState, l];
    },
    useRef: function(l) {
      var n = jl();
      return l = { current: l }, n.memoizedState = l;
    },
    useState: function(l) {
      l = oy(l);
      var n = l.queue, u = $d.bind(null, Je, n);
      return n.dispatch = u, [l.memoizedState, u];
    },
    useDebugValue: Qn,
    useDeferredValue: function(l, n) {
      var u = jl();
      return kr(u, l, n);
    },
    useTransition: function() {
      var l = oy(!1);
      return l = Kd.bind(
        null,
        Je,
        l.queue,
        !0,
        !1
      ), jl().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, n, u) {
      var c = Je, r = jl();
      if (ct) {
        if (u === void 0)
          throw Error(M(407));
        u = u();
      } else {
        if (u = n(), Ht === null)
          throw Error(M(349));
        (at & 127) !== 0 || Zr(c, n, u);
      }
      r.memoizedState = u;
      var s = { value: u, getSnapshot: n };
      return r.queue = s, Xd(wd.bind(null, c, s, l), [
        l
      ]), c.flags |= 2048, Wc(
        9,
        { destroy: void 0 },
        cy.bind(
          null,
          c,
          s,
          u,
          n
        ),
        null
      ), u;
    },
    useId: function() {
      var l = jl(), n = Ht.identifierPrefix;
      if (ct) {
        var u = wn, c = Da;
        u = (c & ~(1 << 32 - Ul(c) - 1)).toString(32) + u, n = "_" + n + "R_" + u, u = Lr++, 0 < u && (n += "H" + u.toString(32)), n += "_";
      } else
        u = V0++, n = "_" + n + "r_" + u.toString(32) + "_";
      return l.memoizedState = n;
    },
    useHostTransitionStatus: by,
    useFormState: hy,
    useActionState: hy,
    useOptimistic: function(l) {
      var n = jl();
      n.memoizedState = n.baseState = l;
      var u = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return n.queue = u, n = Ii.bind(
        null,
        Je,
        !0,
        u
      ), u.dispatch = n, [l, n];
    },
    useMemoCache: jd,
    useCacheRefresh: function() {
      return jl().memoizedState = zu.bind(
        null,
        Je
      );
    },
    useEffectEvent: function(l) {
      var n = jl(), u = { impl: l };
      return n.memoizedState = u, function() {
        if ((vt & 2) !== 0)
          throw Error(M(440));
        return u.impl.apply(void 0, arguments);
      };
    }
  }, Wd = {
    readContext: W,
    use: nf,
    useCallback: Jd,
    useContext: W,
    useEffect: Qd,
    useImperativeHandle: Sy,
    useInsertionEffect: Vd,
    useLayoutEffect: vy,
    useMemo: $0,
    useReducer: Ou,
    useRef: py,
    useState: function() {
      return Ou(Au);
    },
    useDebugValue: Qn,
    useDeferredValue: function(l, n) {
      var u = fl();
      return Ru(
        u,
        zt.memoizedState,
        l,
        n
      );
    },
    useTransition: function() {
      var l = Ou(Au)[0], n = fl().memoizedState;
      return [
        typeof l == "boolean" ? l : $c(l),
        n
      ];
    },
    useSyncExternalStore: iy,
    useId: W0,
    useHostTransitionStatus: by,
    useFormState: K0,
    useActionState: K0,
    useOptimistic: function(l, n) {
      var u = fl();
      return ql(u, zt, l, n);
    },
    useMemoCache: jd,
    useCacheRefresh: Ey
  };
  Wd.useEffectEvent = $r;
  var P0 = {
    readContext: W,
    use: nf,
    useCallback: Jd,
    useContext: W,
    useEffect: Qd,
    useImperativeHandle: Sy,
    useInsertionEffect: Vd,
    useLayoutEffect: vy,
    useMemo: $0,
    useReducer: xd,
    useRef: py,
    useState: function() {
      return xd(Au);
    },
    useDebugValue: Qn,
    useDeferredValue: function(l, n) {
      var u = fl();
      return zt === null ? kr(u, l, n) : Ru(
        u,
        zt.memoizedState,
        l,
        n
      );
    },
    useTransition: function() {
      var l = xd(Au)[0], n = fl().memoizedState;
      return [
        typeof l == "boolean" ? l : $c(l),
        n
      ];
    },
    useSyncExternalStore: iy,
    useId: W0,
    useHostTransitionStatus: by,
    useFormState: yy,
    useActionState: yy,
    useOptimistic: function(l, n) {
      var u = fl();
      return zt !== null ? ql(u, zt, l, n) : (u.baseState = l, [l, u.queue.dispatch]);
    },
    useMemoCache: jd,
    useCacheRefresh: Ey
  };
  P0.useEffectEvent = $r;
  function Fc(l, n, u, c) {
    n = l.memoizedState, u = u(c, n), u = u == null ? n : w({}, n, u), l.memoizedState = u, l.lanes === 0 && (l.updateQueue.baseState = u);
  }
  var En = {
    enqueueSetState: function(l, n, u) {
      l = l._reactInternals;
      var c = Ua(), r = oi(c);
      r.payload = n, u != null && (r.callback = u), n = ka(l, r, c), n !== null && (Ta(n, l, c), $i(n, l, c));
    },
    enqueueReplaceState: function(l, n, u) {
      l = l._reactInternals;
      var c = Ua(), r = oi(c);
      r.tag = 1, r.payload = n, u != null && (r.callback = u), n = ka(l, r, c), n !== null && (Ta(n, l, c), $i(n, l, c));
    },
    enqueueForceUpdate: function(l, n) {
      l = l._reactInternals;
      var u = Ua(), c = oi(u);
      c.tag = 2, n != null && (c.callback = n), n = ka(l, c, u), n !== null && (Ta(n, l, u), $i(n, l, u));
    }
  };
  function Ay(l, n, u, c, r, s, m) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(c, s, m) : n.prototype && n.prototype.isPureReactComponent ? !yn(u, c) || !yn(r, s) : !0;
  }
  function eg(l, n, u, c) {
    l = n.state, typeof n.componentWillReceiveProps == "function" && n.componentWillReceiveProps(u, c), typeof n.UNSAFE_componentWillReceiveProps == "function" && n.UNSAFE_componentWillReceiveProps(u, c), n.state !== l && En.enqueueReplaceState(n, n.state, null);
  }
  function Pi(l, n) {
    var u = n;
    if ("ref" in n) {
      u = {};
      for (var c in n)
        c !== "ref" && (u[c] = n[c]);
    }
    if (l = l.defaultProps) {
      u === n && (u = w({}, u));
      for (var r in l)
        u[r] === void 0 && (u[r] = l[r]);
    }
    return u;
  }
  function Fd(l) {
    Yc(l);
  }
  function Oy(l) {
    console.error(l);
  }
  function Id(l) {
    Yc(l);
  }
  function rf(l, n) {
    try {
      var u = l.onUncaughtError;
      u(n.value, { componentStack: n.stack });
    } catch (c) {
      setTimeout(function() {
        throw c;
      });
    }
  }
  function Ir(l, n, u) {
    try {
      var c = l.onCaughtError;
      c(u.value, {
        componentStack: u.stack,
        errorBoundary: n.tag === 1 ? n.stateNode : null
      });
    } catch (r) {
      setTimeout(function() {
        throw r;
      });
    }
  }
  function Ry(l, n, u) {
    return u = oi(u), u.tag = 3, u.payload = { element: null }, u.callback = function() {
      rf(l, n);
    }, u;
  }
  function zy(l) {
    return l = oi(l), l.tag = 3, l;
  }
  function Dy(l, n, u, c) {
    var r = u.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var s = c.value;
      l.payload = function() {
        return r(s);
      }, l.callback = function() {
        Ir(n, u, c);
      };
    }
    var m = u.stateNode;
    m !== null && typeof m.componentDidCatch == "function" && (l.callback = function() {
      Ir(n, u, c), typeof r != "function" && (It === null ? It = /* @__PURE__ */ new Set([this]) : It.add(this));
      var v = c.stack;
      this.componentDidCatch(c.value, {
        componentStack: v !== null ? v : ""
      });
    });
  }
  function a1(l, n, u, c, r) {
    if (u.flags |= 32768, c !== null && typeof c == "object" && typeof c.then == "function") {
      if (n = u.alternate, n !== null && Yl(
        n,
        u,
        r,
        !0
      ), u = ya.current, u !== null) {
        switch (u.tag) {
          case 31:
          case 13:
            return Wa === null ? gh() : u.alternate === null && Xt === 0 && (Xt = 3), u.flags &= -257, u.flags |= 65536, u.lanes = r, c === Xc ? u.flags |= 16384 : (n = u.updateQueue, n === null ? u.updateQueue = /* @__PURE__ */ new Set([c]) : n.add(c), ds(l, c, r)), !1;
          case 22:
            return u.flags |= 65536, c === Xc ? u.flags |= 16384 : (n = u.updateQueue, n === null ? (n = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([c])
            }, u.updateQueue = n) : (u = n.retryQueue, u === null ? n.retryQueue = /* @__PURE__ */ new Set([c]) : u.add(c)), ds(l, c, r)), !1;
        }
        throw Error(M(435, u.tag));
      }
      return ds(l, c, r), gh(), !1;
    }
    if (ct)
      return n = ya.current, n !== null ? ((n.flags & 65536) === 0 && (n.flags |= 256), n.flags |= 65536, n.lanes = r, c !== gu && (l = Error(M(422), { cause: c }), Wo(Za(l, u)))) : (c !== gu && (n = Error(M(423), {
        cause: c
      }), Wo(
        Za(n, u)
      )), l = l.current.alternate, l.flags |= 65536, r &= -r, l.lanes |= r, c = Za(c, u), r = Ry(
        l.stateNode,
        c,
        r
      ), Ud(l, r), Xt !== 4 && (Xt = 2)), !1;
    var s = Error(M(520), { cause: c });
    if (s = Za(s, u), os === null ? os = [s] : os.push(s), Xt !== 4 && (Xt = 2), n === null) return !0;
    c = Za(c, u), u = n;
    do {
      switch (u.tag) {
        case 3:
          return u.flags |= 65536, l = r & -r, u.lanes |= l, l = Ry(u.stateNode, c, l), Ud(u, l), !1;
        case 1:
          if (n = u.type, s = u.stateNode, (u.flags & 128) === 0 && (typeof n.getDerivedStateFromError == "function" || s !== null && typeof s.componentDidCatch == "function" && (It === null || !It.has(s))))
            return u.flags |= 65536, r &= -r, u.lanes |= r, r = zy(r), Dy(
              r,
              l,
              u,
              c
            ), Ud(u, r), !1;
      }
      u = u.return;
    } while (u !== null);
    return !1;
  }
  var Pd = Error(M(461)), yl = !1;
  function Kt(l, n, u, c) {
    n.child = l === null ? ny(n, null, u, c) : Ki(
      n,
      l.child,
      u,
      c
    );
  }
  function _y(l, n, u, c, r) {
    u = u.render;
    var s = n.ref;
    if ("ref" in c) {
      var m = {};
      for (var v in c)
        v !== "ref" && (m[v] = c[v]);
    } else m = c;
    return je(n), c = Xr(
      l,
      n,
      u,
      m,
      s,
      r
    ), v = Yd(), l !== null && !yl ? (Kc(l, n, r), Pa(l, n, r)) : (ct && v && $o(n), n.flags |= 1, Kt(l, n, c, r), n.child);
  }
  function My(l, n, u, c, r) {
    if (l === null) {
      var s = u.type;
      return typeof s == "function" && !jc(s) && s.defaultProps === void 0 && u.compare === null ? (n.tag = 15, n.type = s, Cy(
        l,
        n,
        s,
        c,
        r
      )) : (l = Od(
        u.type,
        null,
        c,
        n,
        n.mode,
        r
      ), l.ref = n.ref, l.return = n, n.child = l);
    }
    if (s = l.child, !lh(l, r)) {
      var m = s.memoizedProps;
      if (u = u.compare, u = u !== null ? u : yn, u(m, c) && l.ref === n.ref)
        return Pa(l, n, r);
    }
    return n.flags |= 1, l = li(s, c), l.ref = n.ref, l.return = n, n.child = l;
  }
  function Cy(l, n, u, c, r) {
    if (l !== null) {
      var s = l.memoizedProps;
      if (yn(s, c) && l.ref === n.ref)
        if (yl = !1, n.pendingProps = c = s, lh(l, r))
          (l.flags & 131072) !== 0 && (yl = !0);
        else
          return n.lanes = l.lanes, Pa(l, n, r);
    }
    return eh(
      l,
      n,
      u,
      c,
      r
    );
  }
  function tg(l, n, u, c) {
    var r = c.children, s = l !== null ? l.memoizedState : null;
    if (l === null && n.stateNode === null && (n.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), c.mode === "hidden") {
      if ((n.flags & 128) !== 0) {
        if (s = s !== null ? s.baseLanes | u : u, l !== null) {
          for (c = n.child = l.child, r = 0; c !== null; )
            r = r | c.lanes | c.childLanes, c = c.sibling;
          c = r & ~s;
        } else c = 0, n.child = null;
        return ga(
          l,
          n,
          s,
          u,
          c
        );
      }
      if ((u & 536870912) !== 0)
        n.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && Fo(
          n,
          s !== null ? s.cachePool : null
        ), s !== null ? Q0(n, s) : Gr(), Nd(n);
      else
        return c = n.lanes = 536870912, ga(
          l,
          n,
          s !== null ? s.baseLanes | u : u,
          u,
          c
        );
    } else
      s !== null ? (Fo(n, s.cachePool), Q0(n, s), Xn(), n.memoizedState = null) : (l !== null && Fo(n, null), Gr(), Xn());
    return Kt(l, n, r, u), n.child;
  }
  function ec(l, n) {
    return l !== null && l.tag === 22 || n.stateNode !== null || (n.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), n.sibling;
  }
  function ga(l, n, u, c, r) {
    var s = $a();
    return s = s === null ? null : { parent: hl._currentValue, pool: s }, n.memoizedState = {
      baseLanes: u,
      cachePool: s
    }, l !== null && Fo(n, null), Gr(), Nd(n), l !== null && Yl(l, n, c, !0), n.childLanes = r, null;
  }
  function Pr(l, n) {
    return n = ls(
      { mode: n.mode, children: n.children },
      l.mode
    ), n.ref = l.ref, l.child = n, n.return = l, n;
  }
  function va(l, n, u) {
    return Ki(n, l.child, null, u), l = Pr(n, n.pendingProps), l.flags |= 2, pa(n), n.memoizedState = null, l;
  }
  function lg(l, n, u) {
    var c = n.pendingProps, r = (n.flags & 128) !== 0;
    if (n.flags &= -129, l === null) {
      if (ct) {
        if (c.mode === "hidden")
          return l = Pr(n, c), n.lanes = 536870912, ec(null, l);
        if (tf(n), (l = Gt) ? (l = qg(
          l,
          Ol
        ), l = l !== null && l.data === "&" ? l : null, l !== null && (n.memoizedState = {
          dehydrated: l,
          treeContext: xn !== null ? { id: Da, overflow: wn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, u = km(l), u.return = n, n.child = u, Bl = n, Gt = null)) : l = null, l === null) throw bn(n);
        return n.lanes = 536870912, null;
      }
      return Pr(n, c);
    }
    var s = l.memoizedState;
    if (s !== null) {
      var m = s.dehydrated;
      if (tf(n), r)
        if (n.flags & 256)
          n.flags &= -257, n = va(
            l,
            n,
            u
          );
        else if (n.memoizedState !== null)
          n.child = l.child, n.flags |= 128, n = null;
        else throw Error(M(558));
      else if (yl || Yl(l, n, u, !1), r = (u & l.childLanes) !== 0, yl || r) {
        if (c = Ht, c !== null && (m = Ga(c, u), m !== 0 && m !== s.retryLane))
          throw s.retryLane = m, ti(l, m), Ta(c, l, m), Pd;
        gh(), n = va(
          l,
          n,
          u
        );
      } else
        l = s.treeContext, Gt = Aa(m.nextSibling), Bl = n, ct = !0, pu = null, Ol = !1, l !== null && Mr(n, l), n = Pr(n, c), n.flags |= 4096;
      return n;
    }
    return l = li(l.child, {
      mode: c.mode,
      children: c.children
    }), l.ref = n.ref, n.child = l, l.return = n, l;
  }
  function Fa(l, n) {
    var u = n.ref;
    if (u === null)
      l !== null && l.ref !== null && (n.flags |= 4194816);
    else {
      if (typeof u != "function" && typeof u != "object")
        throw Error(M(284));
      (l === null || l.ref !== u) && (n.flags |= 4194816);
    }
  }
  function eh(l, n, u, c, r) {
    return je(n), u = Xr(
      l,
      n,
      u,
      c,
      void 0,
      r
    ), c = Yd(), l !== null && !yl ? (Kc(l, n, r), Pa(l, n, r)) : (ct && c && $o(n), n.flags |= 1, Kt(l, n, u, r), n.child);
  }
  function tc(l, n, u, c, r, s) {
    return je(n), n.updateQueue = null, u = Z0(
      n,
      c,
      u,
      r
    ), Bd(l), c = Yd(), l !== null && !yl ? (Kc(l, n, s), Pa(l, n, s)) : (ct && c && $o(n), n.flags |= 1, Kt(l, n, u, s), n.child);
  }
  function Uy(l, n, u, c, r) {
    if (je(n), n.stateNode === null) {
      var s = da, m = u.contextType;
      typeof m == "object" && m !== null && (s = W(m)), s = new u(c, s), n.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null, s.updater = En, n.stateNode = s, s._reactInternals = n, s = n.stateNode, s.props = c, s.state = n.memoizedState, s.refs = {}, wr(n), m = u.contextType, s.context = typeof m == "object" && m !== null ? W(m) : da, s.state = n.memoizedState, m = u.getDerivedStateFromProps, typeof m == "function" && (Fc(
        n,
        u,
        m,
        c
      ), s.state = n.memoizedState), typeof u.getDerivedStateFromProps == "function" || typeof s.getSnapshotBeforeUpdate == "function" || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (m = s.state, typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(), m !== s.state && En.enqueueReplaceState(s, s.state, null), bu(n, c, s, r), ki(), s.state = n.memoizedState), typeof s.componentDidMount == "function" && (n.flags |= 4194308), c = !0;
    } else if (l === null) {
      s = n.stateNode;
      var v = n.memoizedProps, A = Pi(u, v);
      s.props = A;
      var j = s.context, V = u.contextType;
      m = da, typeof V == "object" && V !== null && (m = W(V));
      var k = u.getDerivedStateFromProps;
      V = typeof k == "function" || typeof s.getSnapshotBeforeUpdate == "function", v = n.pendingProps !== v, V || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (v || j !== m) && eg(
        n,
        s,
        c,
        m
      ), ci = !1;
      var q = n.memoizedState;
      s.state = q, bu(n, c, s, r), ki(), j = n.memoizedState, v || q !== j || ci ? (typeof k == "function" && (Fc(
        n,
        u,
        k,
        c
      ), j = n.memoizedState), (A = ci || Ay(
        n,
        u,
        A,
        c,
        q,
        j,
        m
      )) ? (V || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (n.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (n.flags |= 4194308), n.memoizedProps = c, n.memoizedState = j), s.props = c, s.state = j, s.context = m, c = A) : (typeof s.componentDidMount == "function" && (n.flags |= 4194308), c = !1);
    } else {
      s = n.stateNode, Cd(l, n), m = n.memoizedProps, V = Pi(u, m), s.props = V, k = n.pendingProps, q = s.context, j = u.contextType, A = da, typeof j == "object" && j !== null && (A = W(j)), v = u.getDerivedStateFromProps, (j = typeof v == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (m !== k || q !== A) && eg(
        n,
        s,
        c,
        A
      ), ci = !1, q = n.memoizedState, s.state = q, bu(n, c, s, r), ki();
      var X = n.memoizedState;
      m !== k || q !== X || ci || l !== null && l.dependencies !== null && xc(l.dependencies) ? (typeof v == "function" && (Fc(
        n,
        u,
        v,
        c
      ), X = n.memoizedState), (V = ci || Ay(
        n,
        u,
        V,
        c,
        q,
        X,
        A
      ) || l !== null && l.dependencies !== null && xc(l.dependencies)) ? (j || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(c, X, A), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(
        c,
        X,
        A
      )), typeof s.componentDidUpdate == "function" && (n.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (n.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || m === l.memoizedProps && q === l.memoizedState || (n.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || m === l.memoizedProps && q === l.memoizedState || (n.flags |= 1024), n.memoizedProps = c, n.memoizedState = X), s.props = c, s.state = X, s.context = A, c = V) : (typeof s.componentDidUpdate != "function" || m === l.memoizedProps && q === l.memoizedState || (n.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || m === l.memoizedProps && q === l.memoizedState || (n.flags |= 1024), c = !1);
    }
    return s = c, Fa(l, n), c = (n.flags & 128) !== 0, s || c ? (s = n.stateNode, u = c && typeof u.getDerivedStateFromError != "function" ? null : s.render(), n.flags |= 1, l !== null && c ? (n.child = Ki(
      n,
      l.child,
      null,
      r
    ), n.child = Ki(
      n,
      null,
      u,
      r
    )) : Kt(l, n, u, r), n.memoizedState = s.state, l = n.child) : l = Pa(
      l,
      n,
      r
    ), l;
  }
  function Vn(l, n, u, c) {
    return Li(), n.flags |= 256, Kt(l, n, u, c), n.child;
  }
  var es = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function ts(l) {
    return { baseLanes: l, cachePool: Gc() };
  }
  function Ia(l, n, u) {
    return l = l !== null ? l.childLanes & ~u : 0, n && (l |= Ea), l;
  }
  function Hy(l, n, u) {
    var c = n.pendingProps, r = !1, s = (n.flags & 128) !== 0, m;
    if ((m = s) || (m = l !== null && l.memoizedState === null ? !1 : (Ft.current & 2) !== 0), m && (r = !0, n.flags &= -129), m = (n.flags & 32) !== 0, n.flags &= -33, l === null) {
      if (ct) {
        if (r ? Eu(n) : Xn(), (l = Gt) ? (l = qg(
          l,
          Ol
        ), l = l !== null && l.data !== "&" ? l : null, l !== null && (n.memoizedState = {
          dehydrated: l,
          treeContext: xn !== null ? { id: Da, overflow: wn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, u = km(l), u.return = n, n.child = u, Bl = n, Gt = null)) : l = null, l === null) throw bn(n);
        return oc(l) ? n.lanes = 32 : n.lanes = 536870912, null;
      }
      var v = c.children;
      return c = c.fallback, r ? (Xn(), r = n.mode, v = ls(
        { mode: "hidden", children: v },
        r
      ), c = ai(
        c,
        r,
        u,
        null
      ), v.return = n, c.return = n, v.sibling = c, n.child = v, c = n.child, c.memoizedState = ts(u), c.childLanes = Ia(
        l,
        m,
        u
      ), n.memoizedState = es, ec(null, c)) : (Eu(n), lc(n, v));
    }
    var A = l.memoizedState;
    if (A !== null && (v = A.dehydrated, v !== null)) {
      if (s)
        n.flags & 256 ? (Eu(n), n.flags &= -257, n = Ic(
          l,
          n,
          u
        )) : n.memoizedState !== null ? (Xn(), n.child = l.child, n.flags |= 128, n = null) : (Xn(), v = c.fallback, r = n.mode, c = ls(
          { mode: "visible", children: c.children },
          r
        ), v = ai(
          v,
          r,
          u,
          null
        ), v.flags |= 2, c.return = n, v.return = n, c.sibling = v, n.child = c, Ki(
          n,
          l.child,
          null,
          u
        ), c = n.child, c.memoizedState = ts(u), c.childLanes = Ia(
          l,
          m,
          u
        ), n.memoizedState = es, n = ec(null, c));
      else if (Eu(n), oc(v)) {
        if (m = v.nextSibling && v.nextSibling.dataset, m) var j = m.dgst;
        m = j, c = Error(M(419)), c.stack = "", c.digest = m, Wo({ value: c, source: null, stack: null }), n = Ic(
          l,
          n,
          u
        );
      } else if (yl || Yl(l, n, u, !1), m = (u & l.childLanes) !== 0, yl || m) {
        if (m = Ht, m !== null && (c = Ga(m, u), c !== 0 && c !== A.retryLane))
          throw A.retryLane = c, ti(l, c), Ta(m, l, c), Pd;
        On(v) || gh(), n = Ic(
          l,
          n,
          u
        );
      } else
        On(v) ? (n.flags |= 192, n.child = l.child, n = null) : (l = A.treeContext, Gt = Aa(
          v.nextSibling
        ), Bl = n, ct = !0, pu = null, Ol = !1, l !== null && Mr(n, l), n = lc(
          n,
          c.children
        ), n.flags |= 4096);
      return n;
    }
    return r ? (Xn(), v = c.fallback, r = n.mode, A = l.child, j = A.sibling, c = li(A, {
      mode: "hidden",
      children: c.children
    }), c.subtreeFlags = A.subtreeFlags & 65011712, j !== null ? v = li(
      j,
      v
    ) : (v = ai(
      v,
      r,
      u,
      null
    ), v.flags |= 2), v.return = n, c.return = n, c.sibling = v, n.child = c, ec(null, c), c = n.child, v = l.child.memoizedState, v === null ? v = ts(u) : (r = v.cachePool, r !== null ? (A = hl._currentValue, r = r.parent !== A ? { parent: A, pool: A } : r) : r = Gc(), v = {
      baseLanes: v.baseLanes | u,
      cachePool: r
    }), c.memoizedState = v, c.childLanes = Ia(
      l,
      m,
      u
    ), n.memoizedState = es, ec(l.child, c)) : (Eu(n), u = l.child, l = u.sibling, u = li(u, {
      mode: "visible",
      children: c.children
    }), u.return = n, u.sibling = null, l !== null && (m = n.deletions, m === null ? (n.deletions = [l], n.flags |= 16) : m.push(l)), n.child = u, n.memoizedState = null, u);
  }
  function lc(l, n) {
    return n = ls(
      { mode: "visible", children: n },
      l.mode
    ), n.return = l, l.child = n;
  }
  function ls(l, n) {
    return l = cl(22, l, null, n), l.lanes = 0, l;
  }
  function Ic(l, n, u) {
    return Ki(n, l.child, null, u), l = lc(
      n,
      n.pendingProps.children
    ), l.flags |= 2, n.memoizedState = null, l;
  }
  function Pc(l, n, u) {
    l.lanes |= n;
    var c = l.alternate;
    c !== null && (c.lanes |= n), _d(l.return, n, u);
  }
  function th(l, n, u, c, r, s) {
    var m = l.memoizedState;
    m === null ? l.memoizedState = {
      isBackwards: n,
      rendering: null,
      renderingStartTime: 0,
      last: c,
      tail: u,
      tailMode: r,
      treeForkCount: s
    } : (m.isBackwards = n, m.rendering = null, m.renderingStartTime = 0, m.last = c, m.tail = u, m.tailMode = r, m.treeForkCount = s);
  }
  function Ny(l, n, u) {
    var c = n.pendingProps, r = c.revealOrder, s = c.tail;
    c = c.children;
    var m = Ft.current, v = (m & 2) !== 0;
    if (v ? (m = m & 1 | 2, n.flags |= 128) : m &= 1, P(Ft, m), Kt(l, n, c, u), c = ct ? dl : 0, !v && l !== null && (l.flags & 128) !== 0)
      e: for (l = n.child; l !== null; ) {
        if (l.tag === 13)
          l.memoizedState !== null && Pc(l, u, n);
        else if (l.tag === 19)
          Pc(l, u, n);
        else if (l.child !== null) {
          l.child.return = l, l = l.child;
          continue;
        }
        if (l === n) break e;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === n)
            break e;
          l = l.return;
        }
        l.sibling.return = l.return, l = l.sibling;
      }
    switch (r) {
      case "forwards":
        for (u = n.child, r = null; u !== null; )
          l = u.alternate, l !== null && lf(l) === null && (r = u), u = u.sibling;
        u = r, u === null ? (r = n.child, n.child = null) : (r = u.sibling, u.sibling = null), th(
          n,
          !1,
          r,
          u,
          s,
          c
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (u = null, r = n.child, n.child = null; r !== null; ) {
          if (l = r.alternate, l !== null && lf(l) === null) {
            n.child = r;
            break;
          }
          l = r.sibling, r.sibling = u, u = r, r = l;
        }
        th(
          n,
          !0,
          u,
          null,
          s,
          c
        );
        break;
      case "together":
        th(
          n,
          !1,
          null,
          null,
          void 0,
          c
        );
        break;
      default:
        n.memoizedState = null;
    }
    return n.child;
  }
  function Pa(l, n, u) {
    if (l !== null && (n.dependencies = l.dependencies), $n |= n.lanes, (u & n.childLanes) === 0)
      if (l !== null) {
        if (Yl(
          l,
          n,
          u,
          !1
        ), (u & n.childLanes) === 0)
          return null;
      } else return null;
    if (l !== null && n.child !== l.child)
      throw Error(M(153));
    if (n.child !== null) {
      for (l = n.child, u = li(l, l.pendingProps), n.child = u, u.return = n; l.sibling !== null; )
        l = l.sibling, u = u.sibling = li(l, l.pendingProps), u.return = n;
      u.sibling = null;
    }
    return n.child;
  }
  function lh(l, n) {
    return (l.lanes & n) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && xc(l)));
  }
  function ah(l, n, u) {
    switch (n.tag) {
      case 3:
        Jt(n, n.stateNode.containerInfo), ma(n, hl, l.memoizedState.cache), Li();
        break;
      case 27:
      case 5:
        qa(n);
        break;
      case 4:
        Jt(n, n.stateNode.containerInfo);
        break;
      case 10:
        ma(
          n,
          n.type,
          n.memoizedProps.value
        );
        break;
      case 31:
        if (n.memoizedState !== null)
          return n.flags |= 128, tf(n), null;
        break;
      case 13:
        var c = n.memoizedState;
        if (c !== null)
          return c.dehydrated !== null ? (Eu(n), n.flags |= 128, null) : (u & n.child.childLanes) !== 0 ? Hy(l, n, u) : (Eu(n), l = Pa(
            l,
            n,
            u
          ), l !== null ? l.sibling : null);
        Eu(n);
        break;
      case 19:
        var r = (l.flags & 128) !== 0;
        if (c = (u & n.childLanes) !== 0, c || (Yl(
          l,
          n,
          u,
          !1
        ), c = (u & n.childLanes) !== 0), r) {
          if (c)
            return Ny(
              l,
              n,
              u
            );
          n.flags |= 128;
        }
        if (r = n.memoizedState, r !== null && (r.rendering = null, r.tail = null, r.lastEffect = null), P(Ft, Ft.current), c) break;
        return null;
      case 22:
        return n.lanes = 0, tg(
          l,
          n,
          u,
          n.pendingProps
        );
      case 24:
        ma(n, hl, l.memoizedState.cache);
    }
    return Pa(l, n, u);
  }
  function By(l, n, u) {
    if (l !== null)
      if (l.memoizedProps !== n.pendingProps)
        yl = !0;
      else {
        if (!lh(l, u) && (n.flags & 128) === 0)
          return yl = !1, ah(
            l,
            n,
            u
          );
        yl = (l.flags & 131072) !== 0;
      }
    else
      yl = !1, ct && (n.flags & 1048576) !== 0 && Fm(n, dl, n.index);
    switch (n.lanes = 0, n.tag) {
      case 16:
        e: {
          var c = n.pendingProps;
          if (l = Vi(n.elementType), n.type = l, typeof l == "function")
            jc(l) ? (c = Pi(l, c), n.tag = 1, n = Uy(
              null,
              n,
              l,
              c,
              u
            )) : (n.tag = 0, n = eh(
              null,
              n,
              l,
              c,
              u
            ));
          else {
            if (l != null) {
              var r = l.$$typeof;
              if (r === Mt) {
                n.tag = 11, n = _y(
                  null,
                  n,
                  l,
                  c,
                  u
                );
                break e;
              } else if (r === De) {
                n.tag = 14, n = My(
                  null,
                  n,
                  l,
                  c,
                  u
                );
                break e;
              }
            }
            throw n = Zt(l) || l, Error(M(306, n, ""));
          }
        }
        return n;
      case 0:
        return eh(
          l,
          n,
          n.type,
          n.pendingProps,
          u
        );
      case 1:
        return c = n.type, r = Pi(
          c,
          n.pendingProps
        ), Uy(
          l,
          n,
          c,
          r,
          u
        );
      case 3:
        e: {
          if (Jt(
            n,
            n.stateNode.containerInfo
          ), l === null) throw Error(M(387));
          c = n.pendingProps;
          var s = n.memoizedState;
          r = s.element, Cd(l, n), bu(n, c, null, u);
          var m = n.memoizedState;
          if (c = m.cache, ma(n, hl, c), c !== s.cache && Su(
            n,
            [hl],
            u,
            !0
          ), ki(), c = m.element, s.isDehydrated)
            if (s = {
              element: c,
              isDehydrated: !1,
              cache: m.cache
            }, n.updateQueue.baseState = s, n.memoizedState = s, n.flags & 256) {
              n = Vn(
                l,
                n,
                c,
                u
              );
              break e;
            } else if (c !== r) {
              r = Za(
                Error(M(424)),
                n
              ), Wo(r), n = Vn(
                l,
                n,
                c,
                u
              );
              break e;
            } else {
              switch (l = n.stateNode.containerInfo, l.nodeType) {
                case 9:
                  l = l.body;
                  break;
                default:
                  l = l.nodeName === "HTML" ? l.ownerDocument.body : l;
              }
              for (Gt = Aa(l.firstChild), Bl = n, ct = !0, pu = null, Ol = !0, u = ny(
                n,
                null,
                c,
                u
              ), n.child = u; u; )
                u.flags = u.flags & -3 | 4096, u = u.sibling;
            }
          else {
            if (Li(), c === r) {
              n = Pa(
                l,
                n,
                u
              );
              break e;
            }
            Kt(l, n, c, u);
          }
          n = n.child;
        }
        return n;
      case 26:
        return Fa(l, n), l === null ? (u = Hf(
          n.type,
          null,
          n.pendingProps,
          null
        )) ? n.memoizedState = u : ct || (u = n.type, l = n.pendingProps, c = cc(
          Xe.current
        ).createElement(u), c[Ct] = n, c[fa] = l, $l(c, u, l), Ot(c), n.stateNode = c) : n.memoizedState = Hf(
          n.type,
          l.memoizedProps,
          n.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return qa(n), l === null && ct && (c = n.stateNode = Cf(
          n.type,
          n.pendingProps,
          Xe.current
        ), Bl = n, Ol = !0, r = Gt, Wn(n.type) ? (Es = r, Gt = Aa(c.firstChild)) : Gt = r), Kt(
          l,
          n,
          n.pendingProps.children,
          u
        ), Fa(l, n), l === null && (n.flags |= 4194304), n.child;
      case 5:
        return l === null && ct && ((r = c = Gt) && (c = i1(
          c,
          n.type,
          n.pendingProps,
          Ol
        ), c !== null ? (n.stateNode = c, Bl = n, Gt = Aa(c.firstChild), Ol = !1, r = !0) : r = !1), r || bn(n)), qa(n), r = n.type, s = n.pendingProps, m = l !== null ? l.memoizedProps : null, c = s.children, _f(r, s) ? c = null : m !== null && _f(r, m) && (n.flags |= 32), n.memoizedState !== null && (r = Xr(
          l,
          n,
          l1,
          null,
          null,
          u
        ), Os._currentValue = r), Fa(l, n), Kt(l, n, c, u), n.child;
      case 6:
        return l === null && ct && ((l = u = Gt) && (u = Ie(
          u,
          n.pendingProps,
          Ol
        ), u !== null ? (n.stateNode = u, Bl = n, Gt = null, l = !0) : l = !1), l || bn(n)), null;
      case 13:
        return Hy(l, n, u);
      case 4:
        return Jt(
          n,
          n.stateNode.containerInfo
        ), c = n.pendingProps, l === null ? n.child = Ki(
          n,
          null,
          c,
          u
        ) : Kt(l, n, c, u), n.child;
      case 11:
        return _y(
          l,
          n,
          n.type,
          n.pendingProps,
          u
        );
      case 7:
        return Kt(
          l,
          n,
          n.pendingProps,
          u
        ), n.child;
      case 8:
        return Kt(
          l,
          n,
          n.pendingProps.children,
          u
        ), n.child;
      case 12:
        return Kt(
          l,
          n,
          n.pendingProps.children,
          u
        ), n.child;
      case 10:
        return c = n.pendingProps, ma(n, n.type, c.value), Kt(l, n, c.children, u), n.child;
      case 9:
        return r = n.type._context, c = n.pendingProps.children, je(n), r = W(r), c = c(r), n.flags |= 1, Kt(l, n, c, u), n.child;
      case 14:
        return My(
          l,
          n,
          n.type,
          n.pendingProps,
          u
        );
      case 15:
        return Cy(
          l,
          n,
          n.type,
          n.pendingProps,
          u
        );
      case 19:
        return Ny(l, n, u);
      case 31:
        return lg(l, n, u);
      case 22:
        return tg(
          l,
          n,
          u,
          n.pendingProps
        );
      case 24:
        return je(n), c = W(hl), l === null ? (r = $a(), r === null && (r = Ht, s = Hr(), r.pooledCache = s, s.refCount++, s !== null && (r.pooledCacheLanes |= u), r = s), n.memoizedState = { parent: c, cache: r }, wr(n), ma(n, hl, r)) : ((l.lanes & u) !== 0 && (Cd(l, n), bu(n, null, null, u), ki()), r = l.memoizedState, s = n.memoizedState, r.parent !== c ? (r = { parent: c, cache: c }, n.memoizedState = r, n.lanes === 0 && (n.memoizedState = n.updateQueue.baseState = r), ma(n, hl, c)) : (c = s.cache, ma(n, hl, c), c !== r.cache && Su(
          n,
          [hl],
          u,
          !0
        ))), Kt(
          l,
          n,
          n.pendingProps.children,
          u
        ), n.child;
      case 29:
        throw n.pendingProps;
    }
    throw Error(M(156, n.tag));
  }
  function Du(l) {
    l.flags |= 4;
  }
  function Yy(l, n, u, c, r) {
    if ((n = (l.mode & 32) !== 0) && (n = !1), n) {
      if (l.flags |= 16777216, (r & 335544128) === r)
        if (l.stateNode.complete) l.flags |= 8192;
        else if (dg()) l.flags |= 8192;
        else
          throw Zi = Xc, Lc;
    } else l.flags &= -16777217;
  }
  function jy(l, n) {
    if (n.type !== "stylesheet" || (n.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !Na(n))
      if (dg()) l.flags |= 8192;
      else
        throw Zi = Xc, Lc;
  }
  function aa(l, n) {
    n !== null && (l.flags |= 4), l.flags & 16384 && (n = l.tag !== 22 ? ea() : 536870912, l.lanes |= n, nl |= n);
  }
  function sf(l, n) {
    if (!ct)
      switch (l.tailMode) {
        case "hidden":
          n = l.tail;
          for (var u = null; n !== null; )
            n.alternate !== null && (u = n), n = n.sibling;
          u === null ? l.tail = null : u.sibling = null;
          break;
        case "collapsed":
          u = l.tail;
          for (var c = null; u !== null; )
            u.alternate !== null && (c = u), u = u.sibling;
          c === null ? n || l.tail === null ? l.tail = null : l.tail.sibling = null : c.sibling = null;
      }
  }
  function Be(l) {
    var n = l.alternate !== null && l.alternate.child === l.child, u = 0, c = 0;
    if (n)
      for (var r = l.child; r !== null; )
        u |= r.lanes | r.childLanes, c |= r.subtreeFlags & 65011712, c |= r.flags & 65011712, r.return = l, r = r.sibling;
    else
      for (r = l.child; r !== null; )
        u |= r.lanes | r.childLanes, c |= r.subtreeFlags, c |= r.flags, r.return = l, r = r.sibling;
    return l.subtreeFlags |= c, l.childLanes = u, n;
  }
  function ag(l, n, u) {
    var c = n.pendingProps;
    switch (zd(n), n.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Be(n), null;
      case 1:
        return Be(n), null;
      case 3:
        return u = n.stateNode, c = null, l !== null && (c = l.memoizedState.cache), n.memoizedState.cache !== c && (n.flags |= 2048), Ln(hl), pt(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (l === null || l.child === null) && (vu(n) ? Du(n) : l === null || l.memoizedState.isDehydrated && (n.flags & 256) === 0 || (n.flags |= 1024, Im())), Be(n), null;
      case 26:
        var r = n.type, s = n.memoizedState;
        return l === null ? (Du(n), s !== null ? (Be(n), jy(n, s)) : (Be(n), Yy(
          n,
          r,
          null,
          c,
          u
        ))) : s ? s !== l.memoizedState ? (Du(n), Be(n), jy(n, s)) : (Be(n), n.flags &= -16777217) : (l = l.memoizedProps, l !== c && Du(n), Be(n), Yy(
          n,
          r,
          l,
          c,
          u
        )), null;
      case 27:
        if (se(n), u = Xe.current, r = n.type, l !== null && n.stateNode != null)
          l.memoizedProps !== c && Du(n);
        else {
          if (!c) {
            if (n.stateNode === null)
              throw Error(M(166));
            return Be(n), null;
          }
          l = I.current, vu(n) ? Cr(n) : (l = Cf(r, c, u), n.stateNode = l, Du(n));
        }
        return Be(n), null;
      case 5:
        if (se(n), r = n.type, l !== null && n.stateNode != null)
          l.memoizedProps !== c && Du(n);
        else {
          if (!c) {
            if (n.stateNode === null)
              throw Error(M(166));
            return Be(n), null;
          }
          if (s = I.current, vu(n))
            Cr(n);
          else {
            var m = cc(
              Xe.current
            );
            switch (s) {
              case 1:
                s = m.createElementNS(
                  "http://www.w3.org/2000/svg",
                  r
                );
                break;
              case 2:
                s = m.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  r
                );
                break;
              default:
                switch (r) {
                  case "svg":
                    s = m.createElementNS(
                      "http://www.w3.org/2000/svg",
                      r
                    );
                    break;
                  case "math":
                    s = m.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      r
                    );
                    break;
                  case "script":
                    s = m.createElement("div"), s.innerHTML = "<script><\/script>", s = s.removeChild(
                      s.firstChild
                    );
                    break;
                  case "select":
                    s = typeof c.is == "string" ? m.createElement("select", {
                      is: c.is
                    }) : m.createElement("select"), c.multiple ? s.multiple = !0 : c.size && (s.size = c.size);
                    break;
                  default:
                    s = typeof c.is == "string" ? m.createElement(r, { is: c.is }) : m.createElement(r);
                }
            }
            s[Ct] = n, s[fa] = c;
            e: for (m = n.child; m !== null; ) {
              if (m.tag === 5 || m.tag === 6)
                s.appendChild(m.stateNode);
              else if (m.tag !== 4 && m.tag !== 27 && m.child !== null) {
                m.child.return = m, m = m.child;
                continue;
              }
              if (m === n) break e;
              for (; m.sibling === null; ) {
                if (m.return === null || m.return === n)
                  break e;
                m = m.return;
              }
              m.sibling.return = m.return, m = m.sibling;
            }
            n.stateNode = s;
            e: switch ($l(s, r, c), r) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                c = !!c.autoFocus;
                break e;
              case "img":
                c = !0;
                break e;
              default:
                c = !1;
            }
            c && Du(n);
          }
        }
        return Be(n), Yy(
          n,
          n.type,
          l === null ? null : l.memoizedProps,
          n.pendingProps,
          u
        ), null;
      case 6:
        if (l && n.stateNode != null)
          l.memoizedProps !== c && Du(n);
        else {
          if (typeof c != "string" && n.stateNode === null)
            throw Error(M(166));
          if (l = Xe.current, vu(n)) {
            if (l = n.stateNode, u = n.memoizedProps, c = null, r = Bl, r !== null)
              switch (r.tag) {
                case 27:
                case 5:
                  c = r.memoizedProps;
              }
            l[Ct] = n, l = !!(l.nodeValue === u || c !== null && c.suppressHydrationWarning === !0 || ip(l.nodeValue, u)), l || bn(n, !0);
          } else
            l = cc(l).createTextNode(
              c
            ), l[Ct] = n, n.stateNode = l;
        }
        return Be(n), null;
      case 31:
        if (u = n.memoizedState, l === null || l.memoizedState !== null) {
          if (c = vu(n), u !== null) {
            if (l === null) {
              if (!c) throw Error(M(318));
              if (l = n.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(M(557));
              l[Ct] = n;
            } else
              Li(), (n.flags & 128) === 0 && (n.memoizedState = null), n.flags |= 4;
            Be(n), l = !1;
          } else
            u = Im(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = u), l = !0;
          if (!l)
            return n.flags & 256 ? (pa(n), n) : (pa(n), null);
          if ((n.flags & 128) !== 0)
            throw Error(M(558));
        }
        return Be(n), null;
      case 13:
        if (c = n.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (r = vu(n), c !== null && c.dehydrated !== null) {
            if (l === null) {
              if (!r) throw Error(M(318));
              if (r = n.memoizedState, r = r !== null ? r.dehydrated : null, !r) throw Error(M(317));
              r[Ct] = n;
            } else
              Li(), (n.flags & 128) === 0 && (n.memoizedState = null), n.flags |= 4;
            Be(n), r = !1;
          } else
            r = Im(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = r), r = !0;
          if (!r)
            return n.flags & 256 ? (pa(n), n) : (pa(n), null);
        }
        return pa(n), (n.flags & 128) !== 0 ? (n.lanes = u, n) : (u = c !== null, l = l !== null && l.memoizedState !== null, u && (c = n.child, r = null, c.alternate !== null && c.alternate.memoizedState !== null && c.alternate.memoizedState.cachePool !== null && (r = c.alternate.memoizedState.cachePool.pool), s = null, c.memoizedState !== null && c.memoizedState.cachePool !== null && (s = c.memoizedState.cachePool.pool), s !== r && (c.flags |= 2048)), u !== l && u && (n.child.flags |= 8192), aa(n, n.updateQueue), Be(n), null);
      case 4:
        return pt(), l === null && Df(n.stateNode.containerInfo), Be(n), null;
      case 10:
        return Ln(n.type), Be(n), null;
      case 19:
        if (Y(Ft), c = n.memoizedState, c === null) return Be(n), null;
        if (r = (n.flags & 128) !== 0, s = c.rendering, s === null)
          if (r) sf(c, !1);
          else {
            if (Xt !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = n.child; l !== null; ) {
                if (s = lf(l), s !== null) {
                  for (n.flags |= 128, sf(c, !1), l = s.updateQueue, n.updateQueue = l, aa(n, l), n.subtreeFlags = 0, l = u, u = n.child; u !== null; )
                    $m(u, l), u = u.sibling;
                  return P(
                    Ft,
                    Ft.current & 1 | 2
                  ), ct && Sn(n, c.treeForkCount), n.child;
                }
                l = l.sibling;
              }
            c.tail !== null && vl() > Tt && (n.flags |= 128, r = !0, sf(c, !1), n.lanes = 4194304);
          }
        else {
          if (!r)
            if (l = lf(s), l !== null) {
              if (n.flags |= 128, r = !0, l = l.updateQueue, n.updateQueue = l, aa(n, l), sf(c, !0), c.tail === null && c.tailMode === "hidden" && !s.alternate && !ct)
                return Be(n), null;
            } else
              2 * vl() - c.renderingStartTime > Tt && u !== 536870912 && (n.flags |= 128, r = !0, sf(c, !1), n.lanes = 4194304);
          c.isBackwards ? (s.sibling = n.child, n.child = s) : (l = c.last, l !== null ? l.sibling = s : n.child = s, c.last = s);
        }
        return c.tail !== null ? (l = c.tail, c.rendering = l, c.tail = l.sibling, c.renderingStartTime = vl(), l.sibling = null, u = Ft.current, P(
          Ft,
          r ? u & 1 | 2 : u & 1
        ), ct && Sn(n, c.treeForkCount), l) : (Be(n), null);
      case 22:
      case 23:
        return pa(n), ef(), c = n.memoizedState !== null, l !== null ? l.memoizedState !== null !== c && (n.flags |= 8192) : c && (n.flags |= 8192), c ? (u & 536870912) !== 0 && (n.flags & 128) === 0 && (Be(n), n.subtreeFlags & 6 && (n.flags |= 8192)) : Be(n), u = n.updateQueue, u !== null && aa(n, u.retryQueue), u = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), c = null, n.memoizedState !== null && n.memoizedState.cachePool !== null && (c = n.memoizedState.cachePool.pool), c !== u && (n.flags |= 2048), l !== null && Y(Ka), null;
      case 24:
        return u = null, l !== null && (u = l.memoizedState.cache), n.memoizedState.cache !== u && (n.flags |= 2048), Ln(hl), Be(n), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(M(156, n.tag));
  }
  function ng(l, n) {
    switch (zd(n), n.tag) {
      case 1:
        return l = n.flags, l & 65536 ? (n.flags = l & -65537 | 128, n) : null;
      case 3:
        return Ln(hl), pt(), l = n.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (n.flags = l & -65537 | 128, n) : null;
      case 26:
      case 27:
      case 5:
        return se(n), null;
      case 31:
        if (n.memoizedState !== null) {
          if (pa(n), n.alternate === null)
            throw Error(M(340));
          Li();
        }
        return l = n.flags, l & 65536 ? (n.flags = l & -65537 | 128, n) : null;
      case 13:
        if (pa(n), l = n.memoizedState, l !== null && l.dehydrated !== null) {
          if (n.alternate === null)
            throw Error(M(340));
          Li();
        }
        return l = n.flags, l & 65536 ? (n.flags = l & -65537 | 128, n) : null;
      case 19:
        return Y(Ft), null;
      case 4:
        return pt(), null;
      case 10:
        return Ln(n.type), null;
      case 22:
      case 23:
        return pa(n), ef(), l !== null && Y(Ka), l = n.flags, l & 65536 ? (n.flags = l & -65537 | 128, n) : null;
      case 24:
        return Ln(hl), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function ug(l, n) {
    switch (zd(n), n.tag) {
      case 3:
        Ln(hl), pt();
        break;
      case 26:
      case 27:
      case 5:
        se(n);
        break;
      case 4:
        pt();
        break;
      case 31:
        n.memoizedState !== null && pa(n);
        break;
      case 13:
        pa(n);
        break;
      case 19:
        Y(Ft);
        break;
      case 10:
        Ln(n.type);
        break;
      case 22:
      case 23:
        pa(n), ef(), l !== null && Y(Ka);
        break;
      case 24:
        Ln(hl);
    }
  }
  function Tn(l, n) {
    try {
      var u = n.updateQueue, c = u !== null ? u.lastEffect : null;
      if (c !== null) {
        var r = c.next;
        u = r;
        do {
          if ((u.tag & l) === l) {
            c = void 0;
            var s = u.create, m = u.inst;
            c = s(), m.destroy = c;
          }
          u = u.next;
        } while (u !== r);
      }
    } catch (v) {
      _t(n, n.return, v);
    }
  }
  function en(l, n, u) {
    try {
      var c = n.updateQueue, r = c !== null ? c.lastEffect : null;
      if (r !== null) {
        var s = r.next;
        c = s;
        do {
          if ((c.tag & l) === l) {
            var m = c.inst, v = m.destroy;
            if (v !== void 0) {
              m.destroy = void 0, r = n;
              var A = u, j = v;
              try {
                j();
              } catch (V) {
                _t(
                  r,
                  A,
                  V
                );
              }
            }
          }
          c = c.next;
        } while (c !== s);
      }
    } catch (V) {
      _t(n, n.return, V);
    }
  }
  function nh(l) {
    var n = l.updateQueue;
    if (n !== null) {
      var u = l.stateNode;
      try {
        Wi(n, u);
      } catch (c) {
        _t(l, l.return, c);
      }
    }
  }
  function ac(l, n, u) {
    u.props = Pi(
      l.type,
      l.memoizedProps
    ), u.state = l.memoizedState;
    try {
      u.componentWillUnmount();
    } catch (c) {
      _t(l, n, c);
    }
  }
  function _u(l, n) {
    try {
      var u = l.ref;
      if (u !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var c = l.stateNode;
            break;
          case 30:
            c = l.stateNode;
            break;
          default:
            c = l.stateNode;
        }
        typeof u == "function" ? l.refCleanup = u(c) : u.current = c;
      }
    } catch (r) {
      _t(l, n, r);
    }
  }
  function Zn(l, n) {
    var u = l.ref, c = l.refCleanup;
    if (u !== null)
      if (typeof c == "function")
        try {
          c();
        } catch (r) {
          _t(l, n, r);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      else if (typeof u == "function")
        try {
          u(null);
        } catch (r) {
          _t(l, n, r);
        }
      else u.current = null;
  }
  function qy(l) {
    var n = l.type, u = l.memoizedProps, c = l.stateNode;
    try {
      e: switch (n) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          u.autoFocus && c.focus();
          break e;
        case "img":
          u.src ? c.src = u.src : u.srcSet && (c.srcset = u.srcSet);
      }
    } catch (r) {
      _t(l, l.return, r);
    }
  }
  function uh(l, n, u) {
    try {
      var c = l.stateNode;
      op(c, l.type, u, n), c[fa] = n;
    } catch (r) {
      _t(l, l.return, r);
    }
  }
  function xy(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && Wn(l.type) || l.tag === 4;
  }
  function df(l) {
    e: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || xy(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && Wn(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue e;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function hf(l, n, u) {
    var c = l.tag;
    if (c === 5 || c === 6)
      l = l.stateNode, n ? (u.nodeType === 9 ? u.body : u.nodeName === "HTML" ? u.ownerDocument.body : u).insertBefore(l, n) : (n = u.nodeType === 9 ? u.body : u.nodeName === "HTML" ? u.ownerDocument.body : u, n.appendChild(l), u = u._reactRootContainer, u != null || n.onclick !== null || (n.onclick = Un));
    else if (c !== 4 && (c === 27 && Wn(l.type) && (u = l.stateNode, n = null), l = l.child, l !== null))
      for (hf(l, n, u), l = l.sibling; l !== null; )
        hf(l, n, u), l = l.sibling;
  }
  function mf(l, n, u) {
    var c = l.tag;
    if (c === 5 || c === 6)
      l = l.stateNode, n ? u.insertBefore(l, n) : u.appendChild(l);
    else if (c !== 4 && (c === 27 && Wn(l.type) && (u = l.stateNode), l = l.child, l !== null))
      for (mf(l, n, u), l = l.sibling; l !== null; )
        mf(l, n, u), l = l.sibling;
  }
  function wy(l) {
    var n = l.stateNode, u = l.memoizedProps;
    try {
      for (var c = l.type, r = n.attributes; r.length; )
        n.removeAttributeNode(r[0]);
      $l(n, c, u), n[Ct] = l, n[fa] = u;
    } catch (s) {
      _t(l, l.return, s);
    }
  }
  var di = !1, bl = !1, ih = !1, Gy = typeof WeakSet == "function" ? WeakSet : Set, xl = null;
  function yf(l, n) {
    if (l = l.containerInfo, zh = Dl, l = xi(l), Ar(l)) {
      if ("selectionStart" in l)
        var u = {
          start: l.selectionStart,
          end: l.selectionEnd
        };
      else
        e: {
          u = (u = l.ownerDocument) && u.defaultView || window;
          var c = u.getSelection && u.getSelection();
          if (c && c.rangeCount !== 0) {
            u = c.anchorNode;
            var r = c.anchorOffset, s = c.focusNode;
            c = c.focusOffset;
            try {
              u.nodeType, s.nodeType;
            } catch {
              u = null;
              break e;
            }
            var m = 0, v = -1, A = -1, j = 0, V = 0, k = l, q = null;
            t: for (; ; ) {
              for (var X; k !== u || r !== 0 && k.nodeType !== 3 || (v = m + r), k !== s || c !== 0 && k.nodeType !== 3 || (A = m + c), k.nodeType === 3 && (m += k.nodeValue.length), (X = k.firstChild) !== null; )
                q = k, k = X;
              for (; ; ) {
                if (k === l) break t;
                if (q === u && ++j === r && (v = m), q === s && ++V === c && (A = m), (X = k.nextSibling) !== null) break;
                k = q, q = k.parentNode;
              }
              k = X;
            }
            u = v === -1 || A === -1 ? null : { start: v, end: A };
          } else u = null;
        }
      u = u || { start: 0, end: 0 };
    } else u = null;
    for (Dh = { focusedElem: l, selectionRange: u }, Dl = !1, xl = n; xl !== null; )
      if (n = xl, l = n.child, (n.subtreeFlags & 1028) !== 0 && l !== null)
        l.return = n, xl = l;
      else
        for (; xl !== null; ) {
          switch (n = xl, s = n.alternate, l = n.flags, n.tag) {
            case 0:
              if ((l & 4) !== 0 && (l = n.updateQueue, l = l !== null ? l.events : null, l !== null))
                for (u = 0; u < l.length; u++)
                  r = l[u], r.ref.impl = r.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((l & 1024) !== 0 && s !== null) {
                l = void 0, u = n, r = s.memoizedProps, s = s.memoizedState, c = u.stateNode;
                try {
                  var he = Pi(
                    u.type,
                    r
                  );
                  l = c.getSnapshotBeforeUpdate(
                    he,
                    s
                  ), c.__reactInternalSnapshotBeforeUpdate = l;
                } catch (Me) {
                  _t(
                    u,
                    u.return,
                    Me
                  );
                }
              }
              break;
            case 3:
              if ((l & 1024) !== 0) {
                if (l = n.stateNode.containerInfo, u = l.nodeType, u === 9)
                  bs(l);
                else if (u === 1)
                  switch (l.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      bs(l);
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
              if ((l & 1024) !== 0) throw Error(M(163));
          }
          if (l = n.sibling, l !== null) {
            l.return = n.return, xl = l;
            break;
          }
          xl = n.return;
        }
  }
  function as(l, n, u) {
    var c = u.flags;
    switch (u.tag) {
      case 0:
      case 11:
      case 15:
        hi(l, u), c & 4 && Tn(5, u);
        break;
      case 1:
        if (hi(l, u), c & 4)
          if (l = u.stateNode, n === null)
            try {
              l.componentDidMount();
            } catch (m) {
              _t(u, u.return, m);
            }
          else {
            var r = Pi(
              u.type,
              n.memoizedProps
            );
            n = n.memoizedState;
            try {
              l.componentDidUpdate(
                r,
                n,
                l.__reactInternalSnapshotBeforeUpdate
              );
            } catch (m) {
              _t(
                u,
                u.return,
                m
              );
            }
          }
        c & 64 && nh(u), c & 512 && _u(u, u.return);
        break;
      case 3:
        if (hi(l, u), c & 64 && (l = u.updateQueue, l !== null)) {
          if (n = null, u.child !== null)
            switch (u.child.tag) {
              case 27:
              case 5:
                n = u.child.stateNode;
                break;
              case 1:
                n = u.child.stateNode;
            }
          try {
            Wi(l, n);
          } catch (m) {
            _t(u, u.return, m);
          }
        }
        break;
      case 27:
        n === null && c & 4 && wy(u);
      case 26:
      case 5:
        hi(l, u), n === null && c & 4 && qy(u), c & 512 && _u(u, u.return);
        break;
      case 12:
        hi(l, u);
        break;
      case 31:
        hi(l, u), c & 4 && ig(l, u);
        break;
      case 13:
        hi(l, u), c & 4 && Qy(l, u), c & 64 && (l = u.memoizedState, l !== null && (l = l.dehydrated, l !== null && (u = tn.bind(
          null,
          u
        ), Mf(l, u))));
        break;
      case 22:
        if (c = u.memoizedState !== null || di, !c) {
          n = n !== null && n.memoizedState !== null || bl, r = di;
          var s = bl;
          di = c, (bl = n) && !s ? Jn(
            l,
            u,
            (u.subtreeFlags & 8772) !== 0
          ) : hi(l, u), di = r, bl = s;
        }
        break;
      case 30:
        break;
      default:
        hi(l, u);
    }
  }
  function Ly(l) {
    var n = l.alternate;
    n !== null && (l.alternate = null, Ly(n)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (n = l.stateNode, n !== null && ld(n)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var Lt = null, Sa = !1;
  function Mu(l, n, u) {
    for (u = u.child; u !== null; )
      Xy(l, n, u), u = u.sibling;
  }
  function Xy(l, n, u) {
    if (Al && typeof Al.onCommitFiberUnmount == "function")
      try {
        Al.onCommitFiberUnmount(sn, u);
      } catch {
      }
    switch (u.tag) {
      case 26:
        bl || Zn(u, n), Mu(
          l,
          n,
          u
        ), u.memoizedState ? u.memoizedState.count-- : u.stateNode && (u = u.stateNode, u.parentNode.removeChild(u));
        break;
      case 27:
        bl || Zn(u, n);
        var c = Lt, r = Sa;
        Wn(u.type) && (Lt = u.stateNode, Sa = !1), Mu(
          l,
          n,
          u
        ), co(u.stateNode), Lt = c, Sa = r;
        break;
      case 5:
        bl || Zn(u, n);
      case 6:
        if (c = Lt, r = Sa, Lt = null, Mu(
          l,
          n,
          u
        ), Lt = c, Sa = r, Lt !== null)
          if (Sa)
            try {
              (Lt.nodeType === 9 ? Lt.body : Lt.nodeName === "HTML" ? Lt.ownerDocument.body : Lt).removeChild(u.stateNode);
            } catch (s) {
              _t(
                u,
                n,
                s
              );
            }
          else
            try {
              Lt.removeChild(u.stateNode);
            } catch (s) {
              _t(
                u,
                n,
                s
              );
            }
        break;
      case 18:
        Lt !== null && (Sa ? (l = Lt, dp(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          u.stateNode
        ), Gf(l)) : dp(Lt, u.stateNode));
        break;
      case 4:
        c = Lt, r = Sa, Lt = u.stateNode.containerInfo, Sa = !0, Mu(
          l,
          n,
          u
        ), Lt = c, Sa = r;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        en(2, u, n), bl || en(4, u, n), Mu(
          l,
          n,
          u
        );
        break;
      case 1:
        bl || (Zn(u, n), c = u.stateNode, typeof c.componentWillUnmount == "function" && ac(
          u,
          n,
          c
        )), Mu(
          l,
          n,
          u
        );
        break;
      case 21:
        Mu(
          l,
          n,
          u
        );
        break;
      case 22:
        bl = (c = bl) || u.memoizedState !== null, Mu(
          l,
          n,
          u
        ), bl = c;
        break;
      default:
        Mu(
          l,
          n,
          u
        );
    }
  }
  function ig(l, n) {
    if (n.memoizedState === null && (l = n.alternate, l !== null && (l = l.memoizedState, l !== null))) {
      l = l.dehydrated;
      try {
        Gf(l);
      } catch (u) {
        _t(n, n.return, u);
      }
    }
  }
  function Qy(l, n) {
    if (n.memoizedState === null && (l = n.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        Gf(l);
      } catch (u) {
        _t(n, n.return, u);
      }
  }
  function ns(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var n = l.stateNode;
        return n === null && (n = l.stateNode = new Gy()), n;
      case 22:
        return l = l.stateNode, n = l._retryCache, n === null && (n = l._retryCache = new Gy()), n;
      default:
        throw Error(M(435, l.tag));
    }
  }
  function us(l, n) {
    var u = ns(l);
    n.forEach(function(c) {
      if (!u.has(c)) {
        u.add(c);
        var r = Dg.bind(null, l, c);
        c.then(r, r);
      }
    });
  }
  function ba(l, n) {
    var u = n.deletions;
    if (u !== null)
      for (var c = 0; c < u.length; c++) {
        var r = u[c], s = l, m = n, v = m;
        e: for (; v !== null; ) {
          switch (v.tag) {
            case 27:
              if (Wn(v.type)) {
                Lt = v.stateNode, Sa = !1;
                break e;
              }
              break;
            case 5:
              Lt = v.stateNode, Sa = !1;
              break e;
            case 3:
            case 4:
              Lt = v.stateNode.containerInfo, Sa = !0;
              break e;
          }
          v = v.return;
        }
        if (Lt === null) throw Error(M(160));
        Xy(s, m, r), Lt = null, Sa = !1, s = r.alternate, s !== null && (s.return = null), r.return = null;
      }
    if (n.subtreeFlags & 13886)
      for (n = n.child; n !== null; )
        ch(n, l), n = n.sibling;
  }
  var $e = null;
  function ch(l, n) {
    var u = l.alternate, c = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ba(n, l), _a(l), c & 4 && (en(3, l, l.return), Tn(3, l), en(5, l, l.return));
        break;
      case 1:
        ba(n, l), _a(l), c & 512 && (bl || u === null || Zn(u, u.return)), c & 64 && di && (l = l.updateQueue, l !== null && (c = l.callbacks, c !== null && (u = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = u === null ? c : u.concat(c))));
        break;
      case 26:
        var r = $e;
        if (ba(n, l), _a(l), c & 512 && (bl || u === null || Zn(u, u.return)), c & 4) {
          var s = u !== null ? u.memoizedState : null;
          if (c = l.memoizedState, u === null)
            if (c === null)
              if (l.stateNode === null) {
                e: {
                  c = l.type, u = l.memoizedProps, r = r.ownerDocument || r;
                  t: switch (c) {
                    case "title":
                      s = r.getElementsByTagName("title")[0], (!s || s[ou] || s[Ct] || s.namespaceURI === "http://www.w3.org/2000/svg" || s.hasAttribute("itemprop")) && (s = r.createElement(c), r.head.insertBefore(
                        s,
                        r.querySelector("head > title")
                      )), $l(s, c, u), s[Ct] = l, Ot(s), c = s;
                      break e;
                    case "link":
                      var m = pp(
                        "link",
                        "href",
                        r
                      ).get(c + (u.href || ""));
                      if (m) {
                        for (var v = 0; v < m.length; v++)
                          if (s = m[v], s.getAttribute("href") === (u.href == null || u.href === "" ? null : u.href) && s.getAttribute("rel") === (u.rel == null ? null : u.rel) && s.getAttribute("title") === (u.title == null ? null : u.title) && s.getAttribute("crossorigin") === (u.crossOrigin == null ? null : u.crossOrigin)) {
                            m.splice(v, 1);
                            break t;
                          }
                      }
                      s = r.createElement(c), $l(s, c, u), r.head.appendChild(s);
                      break;
                    case "meta":
                      if (m = pp(
                        "meta",
                        "content",
                        r
                      ).get(c + (u.content || ""))) {
                        for (v = 0; v < m.length; v++)
                          if (s = m[v], s.getAttribute("content") === (u.content == null ? null : "" + u.content) && s.getAttribute("name") === (u.name == null ? null : u.name) && s.getAttribute("property") === (u.property == null ? null : u.property) && s.getAttribute("http-equiv") === (u.httpEquiv == null ? null : u.httpEquiv) && s.getAttribute("charset") === (u.charSet == null ? null : u.charSet)) {
                            m.splice(v, 1);
                            break t;
                          }
                      }
                      s = r.createElement(c), $l(s, c, u), r.head.appendChild(s);
                      break;
                    default:
                      throw Error(M(468, c));
                  }
                  s[Ct] = l, Ot(s), c = s;
                }
                l.stateNode = c;
              } else
                Hh(
                  r,
                  l.type,
                  l.stateNode
                );
            else
              l.stateNode = yp(
                r,
                c,
                l.memoizedProps
              );
          else
            s !== c ? (s === null ? u.stateNode !== null && (u = u.stateNode, u.parentNode.removeChild(u)) : s.count--, c === null ? Hh(
              r,
              l.type,
              l.stateNode
            ) : yp(
              r,
              c,
              l.memoizedProps
            )) : c === null && l.stateNode !== null && uh(
              l,
              l.memoizedProps,
              u.memoizedProps
            );
        }
        break;
      case 27:
        ba(n, l), _a(l), c & 512 && (bl || u === null || Zn(u, u.return)), u !== null && c & 4 && uh(
          l,
          l.memoizedProps,
          u.memoizedProps
        );
        break;
      case 5:
        if (ba(n, l), _a(l), c & 512 && (bl || u === null || Zn(u, u.return)), l.flags & 32) {
          r = l.stateNode;
          try {
            ru(r, "");
          } catch (he) {
            _t(l, l.return, he);
          }
        }
        c & 4 && l.stateNode != null && (r = l.memoizedProps, uh(
          l,
          r,
          u !== null ? u.memoizedProps : r
        )), c & 1024 && (ih = !0);
        break;
      case 6:
        if (ba(n, l), _a(l), c & 4) {
          if (l.stateNode === null)
            throw Error(M(162));
          c = l.memoizedProps, u = l.stateNode;
          try {
            u.nodeValue = c;
          } catch (he) {
            _t(l, l.return, he);
          }
        }
        break;
      case 3:
        if (Yf = null, r = $e, $e = na(n.containerInfo), ba(n, l), $e = r, _a(l), c & 4 && u !== null && u.memoizedState.isDehydrated)
          try {
            Gf(n.containerInfo);
          } catch (he) {
            _t(l, l.return, he);
          }
        ih && (ih = !1, Vy(l));
        break;
      case 4:
        c = $e, $e = na(
          l.stateNode.containerInfo
        ), ba(n, l), _a(l), $e = c;
        break;
      case 12:
        ba(n, l), _a(l);
        break;
      case 31:
        ba(n, l), _a(l), c & 4 && (c = l.updateQueue, c !== null && (l.updateQueue = null, us(l, c)));
        break;
      case 13:
        ba(n, l), _a(l), l.child.flags & 8192 && l.memoizedState !== null != (u !== null && u.memoizedState !== null) && (kn = vl()), c & 4 && (c = l.updateQueue, c !== null && (l.updateQueue = null, us(l, c)));
        break;
      case 22:
        r = l.memoizedState !== null;
        var A = u !== null && u.memoizedState !== null, j = di, V = bl;
        if (di = j || r, bl = V || A, ba(n, l), bl = V, di = j, _a(l), c & 8192)
          e: for (n = l.stateNode, n._visibility = r ? n._visibility & -2 : n._visibility | 1, r && (u === null || A || di || bl || eo(l)), u = null, n = l; ; ) {
            if (n.tag === 5 || n.tag === 26) {
              if (u === null) {
                A = u = n;
                try {
                  if (s = A.stateNode, r)
                    m = s.style, typeof m.setProperty == "function" ? m.setProperty("display", "none", "important") : m.display = "none";
                  else {
                    v = A.stateNode;
                    var k = A.memoizedProps.style, q = k != null && k.hasOwnProperty("display") ? k.display : null;
                    v.style.display = q == null || typeof q == "boolean" ? "" : ("" + q).trim();
                  }
                } catch (he) {
                  _t(A, A.return, he);
                }
              }
            } else if (n.tag === 6) {
              if (u === null) {
                A = n;
                try {
                  A.stateNode.nodeValue = r ? "" : A.memoizedProps;
                } catch (he) {
                  _t(A, A.return, he);
                }
              }
            } else if (n.tag === 18) {
              if (u === null) {
                A = n;
                try {
                  var X = A.stateNode;
                  r ? pl(X, !0) : pl(A.stateNode, !1);
                } catch (he) {
                  _t(A, A.return, he);
                }
              }
            } else if ((n.tag !== 22 && n.tag !== 23 || n.memoizedState === null || n === l) && n.child !== null) {
              n.child.return = n, n = n.child;
              continue;
            }
            if (n === l) break e;
            for (; n.sibling === null; ) {
              if (n.return === null || n.return === l) break e;
              u === n && (u = null), n = n.return;
            }
            u === n && (u = null), n.sibling.return = n.return, n = n.sibling;
          }
        c & 4 && (c = l.updateQueue, c !== null && (u = c.retryQueue, u !== null && (c.retryQueue = null, us(l, u))));
        break;
      case 19:
        ba(n, l), _a(l), c & 4 && (c = l.updateQueue, c !== null && (l.updateQueue = null, us(l, c)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        ba(n, l), _a(l);
    }
  }
  function _a(l) {
    var n = l.flags;
    if (n & 2) {
      try {
        for (var u, c = l.return; c !== null; ) {
          if (xy(c)) {
            u = c;
            break;
          }
          c = c.return;
        }
        if (u == null) throw Error(M(160));
        switch (u.tag) {
          case 27:
            var r = u.stateNode, s = df(l);
            mf(l, s, r);
            break;
          case 5:
            var m = u.stateNode;
            u.flags & 32 && (ru(m, ""), u.flags &= -33);
            var v = df(l);
            mf(l, v, m);
            break;
          case 3:
          case 4:
            var A = u.stateNode.containerInfo, j = df(l);
            hf(
              l,
              j,
              A
            );
            break;
          default:
            throw Error(M(161));
        }
      } catch (V) {
        _t(l, l.return, V);
      }
      l.flags &= -3;
    }
    n & 4096 && (l.flags &= -4097);
  }
  function Vy(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var n = l;
        Vy(n), n.tag === 5 && n.flags & 1024 && n.stateNode.reset(), l = l.sibling;
      }
  }
  function hi(l, n) {
    if (n.subtreeFlags & 8772)
      for (n = n.child; n !== null; )
        as(l, n.alternate, n), n = n.sibling;
  }
  function eo(l) {
    for (l = l.child; l !== null; ) {
      var n = l;
      switch (n.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          en(4, n, n.return), eo(n);
          break;
        case 1:
          Zn(n, n.return);
          var u = n.stateNode;
          typeof u.componentWillUnmount == "function" && ac(
            n,
            n.return,
            u
          ), eo(n);
          break;
        case 27:
          co(n.stateNode);
        case 26:
        case 5:
          Zn(n, n.return), eo(n);
          break;
        case 22:
          n.memoizedState === null && eo(n);
          break;
        case 30:
          eo(n);
          break;
        default:
          eo(n);
      }
      l = l.sibling;
    }
  }
  function Jn(l, n, u) {
    for (u = u && (n.subtreeFlags & 8772) !== 0, n = n.child; n !== null; ) {
      var c = n.alternate, r = l, s = n, m = s.flags;
      switch (s.tag) {
        case 0:
        case 11:
        case 15:
          Jn(
            r,
            s,
            u
          ), Tn(4, s);
          break;
        case 1:
          if (Jn(
            r,
            s,
            u
          ), c = s, r = c.stateNode, typeof r.componentDidMount == "function")
            try {
              r.componentDidMount();
            } catch (j) {
              _t(c, c.return, j);
            }
          if (c = s, r = c.updateQueue, r !== null) {
            var v = c.stateNode;
            try {
              var A = r.shared.hiddenCallbacks;
              if (A !== null)
                for (r.shared.hiddenCallbacks = null, r = 0; r < A.length; r++)
                  Hd(A[r], v);
            } catch (j) {
              _t(c, c.return, j);
            }
          }
          u && m & 64 && nh(s), _u(s, s.return);
          break;
        case 27:
          wy(s);
        case 26:
        case 5:
          Jn(
            r,
            s,
            u
          ), u && c === null && m & 4 && qy(s), _u(s, s.return);
          break;
        case 12:
          Jn(
            r,
            s,
            u
          );
          break;
        case 31:
          Jn(
            r,
            s,
            u
          ), u && m & 4 && ig(r, s);
          break;
        case 13:
          Jn(
            r,
            s,
            u
          ), u && m & 4 && Qy(r, s);
          break;
        case 22:
          s.memoizedState === null && Jn(
            r,
            s,
            u
          ), _u(s, s.return);
          break;
        case 30:
          break;
        default:
          Jn(
            r,
            s,
            u
          );
      }
      n = n.sibling;
    }
  }
  function oh(l, n) {
    var u = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), l = null, n.memoizedState !== null && n.memoizedState.cachePool !== null && (l = n.memoizedState.cachePool.pool), l !== u && (l != null && l.refCount++, u != null && Nr(u));
  }
  function fh(l, n) {
    l = null, n.alternate !== null && (l = n.alternate.memoizedState.cache), n = n.memoizedState.cache, n !== l && (n.refCount++, l != null && Nr(l));
  }
  function An(l, n, u, c) {
    if (n.subtreeFlags & 10256)
      for (n = n.child; n !== null; )
        pf(
          l,
          n,
          u,
          c
        ), n = n.sibling;
  }
  function pf(l, n, u, c) {
    var r = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        An(
          l,
          n,
          u,
          c
        ), r & 2048 && Tn(9, n);
        break;
      case 1:
        An(
          l,
          n,
          u,
          c
        );
        break;
      case 3:
        An(
          l,
          n,
          u,
          c
        ), r & 2048 && (l = null, n.alternate !== null && (l = n.alternate.memoizedState.cache), n = n.memoizedState.cache, n !== l && (n.refCount++, l != null && Nr(l)));
        break;
      case 12:
        if (r & 2048) {
          An(
            l,
            n,
            u,
            c
          ), l = n.stateNode;
          try {
            var s = n.memoizedProps, m = s.id, v = s.onPostCommit;
            typeof v == "function" && v(
              m,
              n.alternate === null ? "mount" : "update",
              l.passiveEffectDuration,
              -0
            );
          } catch (A) {
            _t(n, n.return, A);
          }
        } else
          An(
            l,
            n,
            u,
            c
          );
        break;
      case 31:
        An(
          l,
          n,
          u,
          c
        );
        break;
      case 13:
        An(
          l,
          n,
          u,
          c
        );
        break;
      case 23:
        break;
      case 22:
        s = n.stateNode, m = n.alternate, n.memoizedState !== null ? s._visibility & 2 ? An(
          l,
          n,
          u,
          c
        ) : is(l, n) : s._visibility & 2 ? An(
          l,
          n,
          u,
          c
        ) : (s._visibility |= 2, gf(
          l,
          n,
          u,
          c,
          (n.subtreeFlags & 10256) !== 0 || !1
        )), r & 2048 && oh(m, n);
        break;
      case 24:
        An(
          l,
          n,
          u,
          c
        ), r & 2048 && fh(n.alternate, n);
        break;
      default:
        An(
          l,
          n,
          u,
          c
        );
    }
  }
  function gf(l, n, u, c, r) {
    for (r = r && ((n.subtreeFlags & 10256) !== 0 || !1), n = n.child; n !== null; ) {
      var s = l, m = n, v = u, A = c, j = m.flags;
      switch (m.tag) {
        case 0:
        case 11:
        case 15:
          gf(
            s,
            m,
            v,
            A,
            r
          ), Tn(8, m);
          break;
        case 23:
          break;
        case 22:
          var V = m.stateNode;
          m.memoizedState !== null ? V._visibility & 2 ? gf(
            s,
            m,
            v,
            A,
            r
          ) : is(
            s,
            m
          ) : (V._visibility |= 2, gf(
            s,
            m,
            v,
            A,
            r
          )), r && j & 2048 && oh(
            m.alternate,
            m
          );
          break;
        case 24:
          gf(
            s,
            m,
            v,
            A,
            r
          ), r && j & 2048 && fh(m.alternate, m);
          break;
        default:
          gf(
            s,
            m,
            v,
            A,
            r
          );
      }
      n = n.sibling;
    }
  }
  function is(l, n) {
    if (n.subtreeFlags & 10256)
      for (n = n.child; n !== null; ) {
        var u = l, c = n, r = c.flags;
        switch (c.tag) {
          case 22:
            is(u, c), r & 2048 && oh(
              c.alternate,
              c
            );
            break;
          case 24:
            is(u, c), r & 2048 && fh(c.alternate, c);
            break;
          default:
            is(u, c);
        }
        n = n.sibling;
      }
  }
  var Ma = 8192;
  function Cu(l, n, u) {
    if (l.subtreeFlags & Ma)
      for (l = l.child; l !== null; )
        cg(
          l,
          n,
          u
        ), l = l.sibling;
  }
  function cg(l, n, u) {
    switch (l.tag) {
      case 26:
        Cu(
          l,
          n,
          u
        ), l.flags & Ma && l.memoizedState !== null && Yu(
          u,
          $e,
          l.memoizedState,
          l.memoizedProps
        );
        break;
      case 5:
        Cu(
          l,
          n,
          u
        );
        break;
      case 3:
      case 4:
        var c = $e;
        $e = na(l.stateNode.containerInfo), Cu(
          l,
          n,
          u
        ), $e = c;
        break;
      case 22:
        l.memoizedState === null && (c = l.alternate, c !== null && c.memoizedState !== null ? (c = Ma, Ma = 16777216, Cu(
          l,
          n,
          u
        ), Ma = c) : Cu(
          l,
          n,
          u
        ));
        break;
      default:
        Cu(
          l,
          n,
          u
        );
    }
  }
  function rh(l) {
    var n = l.alternate;
    if (n !== null && (l = n.child, l !== null)) {
      n.child = null;
      do
        n = l.sibling, l.sibling = null, l = n;
      while (l !== null);
    }
  }
  function vf(l) {
    var n = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (n !== null)
        for (var u = 0; u < n.length; u++) {
          var c = n[u];
          xl = c, sh(
            c,
            l
          );
        }
      rh(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        Zy(l), l = l.sibling;
  }
  function Zy(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        vf(l), l.flags & 2048 && en(9, l, l.return);
        break;
      case 3:
        vf(l);
        break;
      case 12:
        vf(l);
        break;
      case 22:
        var n = l.stateNode;
        l.memoizedState !== null && n._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (n._visibility &= -3, cs(l)) : vf(l);
        break;
      default:
        vf(l);
    }
  }
  function cs(l) {
    var n = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (n !== null)
        for (var u = 0; u < n.length; u++) {
          var c = n[u];
          xl = c, sh(
            c,
            l
          );
        }
      rh(l);
    }
    for (l = l.child; l !== null; ) {
      switch (n = l, n.tag) {
        case 0:
        case 11:
        case 15:
          en(8, n, n.return), cs(n);
          break;
        case 22:
          u = n.stateNode, u._visibility & 2 && (u._visibility &= -3, cs(n));
          break;
        default:
          cs(n);
      }
      l = l.sibling;
    }
  }
  function sh(l, n) {
    for (; xl !== null; ) {
      var u = xl;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          en(8, u, n);
          break;
        case 23:
        case 22:
          if (u.memoizedState !== null && u.memoizedState.cachePool !== null) {
            var c = u.memoizedState.cachePool.pool;
            c != null && c.refCount++;
          }
          break;
        case 24:
          Nr(u.memoizedState.cache);
      }
      if (c = u.child, c !== null) c.return = u, xl = c;
      else
        e: for (u = l; xl !== null; ) {
          c = xl;
          var r = c.sibling, s = c.return;
          if (Ly(c), c === u) {
            xl = null;
            break e;
          }
          if (r !== null) {
            r.return = s, xl = r;
            break e;
          }
          xl = s;
        }
    }
  }
  var og = {
    getCacheForType: function(l) {
      var n = W(hl), u = n.data.get(l);
      return u === void 0 && (u = l(), n.data.set(l, u)), u;
    },
    cacheSignal: function() {
      return W(hl).controller.signal;
    }
  }, Jy = typeof WeakMap == "function" ? WeakMap : Map, vt = 0, Ht = null, ot = null, at = 0, Dt = 0, He = null, Uu = !1, nc = !1, dh = !1, Kn = 0, Xt = 0, $n = 0, to = 0, hh = 0, Ea = 0, nl = 0, os = null, ul = null, mh = !1, kn = 0, Ky = 0, Tt = 1 / 0, Sf = null, It = null, zl = 0, mi = null, uc = null, Hu = 0, Ca = 0, yh = null, ph = null, bf = 0, fs = null;
  function Ua() {
    return (vt & 2) !== 0 && at !== 0 ? at & -at : D.T !== null ? Eh() : ed();
  }
  function fg() {
    if (Ea === 0)
      if ((at & 536870912) === 0 || ct) {
        var l = ae;
        ae <<= 1, (ae & 3932160) === 0 && (ae = 262144), Ea = l;
      } else Ea = 536870912;
    return l = ya.current, l !== null && (l.flags |= 32), Ea;
  }
  function Ta(l, n, u) {
    (l === Ht && (Dt === 2 || Dt === 9) || l.cancelPendingCommit !== null) && (Nu(l, 0), yi(
      l,
      at,
      Ea,
      !1
    )), Ci(l, u), ((vt & 2) === 0 || l !== Ht) && (l === Ht && ((vt & 2) === 0 && (to |= u), Xt === 4 && yi(
      l,
      at,
      Ea,
      !1
    )), Bu(l));
  }
  function rg(l, n, u) {
    if ((vt & 6) !== 0) throw Error(M(327));
    var c = !u && (n & 127) === 0 && (n & l.expiredLanes) === 0 || lt(l, n), r = c ? yg(l, n) : vh(l, n, !0), s = c;
    do {
      if (r === 0) {
        nc && !c && yi(l, n, 0, !1);
        break;
      } else {
        if (u = l.current.alternate, s && !sg(u)) {
          r = vh(l, n, !1), s = !1;
          continue;
        }
        if (r === 2) {
          if (s = n, l.errorRecoveryDisabledLanes & s)
            var m = 0;
          else
            m = l.pendingLanes & -536870913, m = m !== 0 ? m : m & 536870912 ? 536870912 : 0;
          if (m !== 0) {
            n = m;
            e: {
              var v = l;
              r = os;
              var A = v.current.memoizedState.isDehydrated;
              if (A && (Nu(v, m).flags |= 256), m = vh(
                v,
                m,
                !1
              ), m !== 2) {
                if (dh && !A) {
                  v.errorRecoveryDisabledLanes |= s, to |= s, r = 4;
                  break e;
                }
                s = ul, ul = r, s !== null && (ul === null ? ul = s : ul.push.apply(
                  ul,
                  s
                ));
              }
              r = m;
            }
            if (s = !1, r !== 2) continue;
          }
        }
        if (r === 1) {
          Nu(l, 0), yi(l, n, 0, !0);
          break;
        }
        e: {
          switch (c = l, s = r, s) {
            case 0:
            case 1:
              throw Error(M(345));
            case 4:
              if ((n & 4194048) !== n) break;
            case 6:
              yi(
                c,
                n,
                Ea,
                !Uu
              );
              break e;
            case 2:
              ul = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(M(329));
          }
          if ((n & 62914560) === n && (r = kn + 300 - vl(), 10 < r)) {
            if (yi(
              c,
              n,
              Ea,
              !Uu
            ), pe(c, 0, !0) !== 0) break e;
            Hu = n, c.timeoutHandle = Ss(
              rs.bind(
                null,
                c,
                u,
                ul,
                Sf,
                mh,
                n,
                Ea,
                to,
                nl,
                Uu,
                s,
                "Throttled",
                -0,
                0
              ),
              r
            );
            break e;
          }
          rs(
            c,
            u,
            ul,
            Sf,
            mh,
            n,
            Ea,
            to,
            nl,
            Uu,
            s,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Bu(l);
  }
  function rs(l, n, u, c, r, s, m, v, A, j, V, k, q, X) {
    if (l.timeoutHandle = -1, k = n.subtreeFlags, k & 8192 || (k & 16785408) === 16785408) {
      k = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Un
      }, cg(
        n,
        s,
        k
      );
      var he = (s & 62914560) === s ? kn - vl() : (s & 4194048) === s ? Ky - vl() : 0;
      if (he = vp(
        k,
        he
      ), he !== null) {
        Hu = s, l.cancelPendingCommit = he(
          Sg.bind(
            null,
            l,
            n,
            s,
            u,
            c,
            r,
            m,
            v,
            A,
            V,
            k,
            null,
            q,
            X
          )
        ), yi(l, s, m, !j);
        return;
      }
    }
    Sg(
      l,
      n,
      s,
      u,
      c,
      r,
      m,
      v,
      A
    );
  }
  function sg(l) {
    for (var n = l; ; ) {
      var u = n.tag;
      if ((u === 0 || u === 11 || u === 15) && n.flags & 16384 && (u = n.updateQueue, u !== null && (u = u.stores, u !== null)))
        for (var c = 0; c < u.length; c++) {
          var r = u[c], s = r.getSnapshot;
          r = r.value;
          try {
            if (!la(s(), r)) return !1;
          } catch {
            return !1;
          }
        }
      if (u = n.child, n.subtreeFlags & 16384 && u !== null)
        u.return = n, n = u;
      else {
        if (n === l) break;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === l) return !0;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
    }
    return !0;
  }
  function yi(l, n, u, c) {
    n &= ~hh, n &= ~to, l.suspendedLanes |= n, l.pingedLanes &= ~n, c && (l.warmLanes |= n), c = l.expirationTimes;
    for (var r = n; 0 < r; ) {
      var s = 31 - Ul(r), m = 1 << s;
      c[s] = -1, r &= ~m;
    }
    u !== 0 && dr(l, u, n);
  }
  function Ef() {
    return (vt & 6) === 0 ? (gi(0), !1) : !0;
  }
  function $y() {
    if (ot !== null) {
      if (Dt === 0)
        var l = ot.return;
      else
        l = ot, Gn = ni = null, Qr(l), Ji = null, Qc = 0, l = ot;
      for (; l !== null; )
        ug(l.alternate, l), l = l.return;
      ot = null;
    }
  }
  function Nu(l, n) {
    var u = l.timeoutHandle;
    u !== -1 && (l.timeoutHandle = -1, Yg(u)), u = l.cancelPendingCommit, u !== null && (l.cancelPendingCommit = null, u()), Hu = 0, $y(), Ht = l, ot = u = li(l.current, null), at = n, Dt = 0, He = null, Uu = !1, nc = lt(l, n), dh = !1, nl = Ea = hh = to = $n = Xt = 0, ul = os = null, mh = !1, (n & 8) !== 0 && (n |= n & 32);
    var c = l.entangledLanes;
    if (c !== 0)
      for (l = l.entanglements, c &= n; 0 < c; ) {
        var r = 31 - Ul(c), s = 1 << r;
        n |= l[r], c &= ~s;
      }
    return Kn = n, Qa(), u;
  }
  function Tf(l, n) {
    Je = null, D.H = Fr, n === Qi || n === Io ? (n = ay(), Dt = 3) : n === Lc ? (n = ay(), Dt = 4) : Dt = n === Pd ? 8 : n !== null && typeof n == "object" && typeof n.then == "function" ? 6 : 1, He = n, ot === null && (Xt = 1, rf(
      l,
      Za(n, l.current)
    ));
  }
  function dg() {
    var l = ya.current;
    return l === null ? !0 : (at & 4194048) === at ? Wa === null : (at & 62914560) === at || (at & 536870912) !== 0 ? l === Wa : !1;
  }
  function hg() {
    var l = D.H;
    return D.H = Fr, l === null ? Fr : l;
  }
  function mg() {
    var l = D.A;
    return D.A = og, l;
  }
  function gh() {
    Xt = 4, Uu || (at & 4194048) !== at && ya.current !== null || (nc = !0), ($n & 134217727) === 0 && (to & 134217727) === 0 || Ht === null || yi(
      Ht,
      at,
      Ea,
      !1
    );
  }
  function vh(l, n, u) {
    var c = vt;
    vt |= 2;
    var r = hg(), s = mg();
    (Ht !== l || at !== n) && (Sf = null, Nu(l, n)), n = !1;
    var m = Xt;
    e: do
      try {
        if (Dt !== 0 && ot !== null) {
          var v = ot, A = He;
          switch (Dt) {
            case 8:
              $y(), m = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              ya.current === null && (n = !0);
              var j = Dt;
              if (Dt = 0, He = null, lo(l, v, A, j), u && nc) {
                m = 0;
                break e;
              }
              break;
            default:
              j = Dt, Dt = 0, He = null, lo(l, v, A, j);
          }
        }
        n1(), m = Xt;
        break;
      } catch (V) {
        Tf(l, V);
      }
    while (!0);
    return n && l.shellSuspendCounter++, Gn = ni = null, vt = c, D.H = r, D.A = s, ot === null && (Ht = null, at = 0, Qa()), m;
  }
  function n1() {
    for (; ot !== null; ) pg(ot);
  }
  function yg(l, n) {
    var u = vt;
    vt |= 2;
    var c = hg(), r = mg();
    Ht !== l || at !== n ? (Sf = null, Tt = vl() + 500, Nu(l, n)) : nc = lt(
      l,
      n
    );
    e: do
      try {
        if (Dt !== 0 && ot !== null) {
          n = ot;
          var s = He;
          t: switch (Dt) {
            case 1:
              Dt = 0, He = null, lo(l, n, s, 1);
              break;
            case 2:
            case 9:
              if (ty(s)) {
                Dt = 0, He = null, gg(n);
                break;
              }
              n = function() {
                Dt !== 2 && Dt !== 9 || Ht !== l || (Dt = 7), Bu(l);
              }, s.then(n, n);
              break e;
            case 3:
              Dt = 7;
              break e;
            case 4:
              Dt = 5;
              break e;
            case 7:
              ty(s) ? (Dt = 0, He = null, gg(n)) : (Dt = 0, He = null, lo(l, n, s, 7));
              break;
            case 5:
              var m = null;
              switch (ot.tag) {
                case 26:
                  m = ot.memoizedState;
                case 5:
                case 27:
                  var v = ot;
                  if (m ? Na(m) : v.stateNode.complete) {
                    Dt = 0, He = null;
                    var A = v.sibling;
                    if (A !== null) ot = A;
                    else {
                      var j = v.return;
                      j !== null ? (ot = j, ss(j)) : ot = null;
                    }
                    break t;
                  }
              }
              Dt = 0, He = null, lo(l, n, s, 5);
              break;
            case 6:
              Dt = 0, He = null, lo(l, n, s, 6);
              break;
            case 8:
              $y(), Xt = 6;
              break e;
            default:
              throw Error(M(462));
          }
        }
        ic();
        break;
      } catch (V) {
        Tf(l, V);
      }
    while (!0);
    return Gn = ni = null, D.H = c, D.A = r, vt = u, ot !== null ? 0 : (Ht = null, at = 0, Qa(), Xt);
  }
  function ic() {
    for (; ot !== null && !iu(); )
      pg(ot);
  }
  function pg(l) {
    var n = By(l.alternate, l, Kn);
    l.memoizedProps = l.pendingProps, n === null ? ss(l) : ot = n;
  }
  function gg(l) {
    var n = l, u = n.alternate;
    switch (n.tag) {
      case 15:
      case 0:
        n = tc(
          u,
          n,
          n.pendingProps,
          n.type,
          void 0,
          at
        );
        break;
      case 11:
        n = tc(
          u,
          n,
          n.pendingProps,
          n.type.render,
          n.ref,
          at
        );
        break;
      case 5:
        Qr(n);
      default:
        ug(u, n), n = ot = $m(n, Kn), n = By(u, n, Kn);
    }
    l.memoizedProps = l.pendingProps, n === null ? ss(l) : ot = n;
  }
  function lo(l, n, u, c) {
    Gn = ni = null, Qr(n), Ji = null, Qc = 0;
    var r = n.return;
    try {
      if (a1(
        l,
        r,
        n,
        u,
        at
      )) {
        Xt = 1, rf(
          l,
          Za(u, l.current)
        ), ot = null;
        return;
      }
    } catch (s) {
      if (r !== null) throw ot = r, s;
      Xt = 1, rf(
        l,
        Za(u, l.current)
      ), ot = null;
      return;
    }
    n.flags & 32768 ? (ct || c === 1 ? l = !0 : nc || (at & 536870912) !== 0 ? l = !1 : (Uu = l = !0, (c === 2 || c === 9 || c === 3 || c === 6) && (c = ya.current, c !== null && c.tag === 13 && (c.flags |= 16384))), vg(n, l)) : ss(n);
  }
  function ss(l) {
    var n = l;
    do {
      if ((n.flags & 32768) !== 0) {
        vg(
          n,
          Uu
        );
        return;
      }
      l = n.return;
      var u = ag(
        n.alternate,
        n,
        Kn
      );
      if (u !== null) {
        ot = u;
        return;
      }
      if (n = n.sibling, n !== null) {
        ot = n;
        return;
      }
      ot = n = l;
    } while (n !== null);
    Xt === 0 && (Xt = 5);
  }
  function vg(l, n) {
    do {
      var u = ng(l.alternate, l);
      if (u !== null) {
        u.flags &= 32767, ot = u;
        return;
      }
      if (u = l.return, u !== null && (u.flags |= 32768, u.subtreeFlags = 0, u.deletions = null), !n && (l = l.sibling, l !== null)) {
        ot = l;
        return;
      }
      ot = l = u;
    } while (l !== null);
    Xt = 6, ot = null;
  }
  function Sg(l, n, u, c, r, s, m, v, A) {
    l.cancelPendingCommit = null;
    do
      Af();
    while (zl !== 0);
    if ((vt & 6) !== 0) throw Error(M(327));
    if (n !== null) {
      if (n === l.current) throw Error(M(177));
      if (s = n.lanes | n.childLanes, s |= gn, Ho(
        l,
        u,
        s,
        m,
        v,
        A
      ), l === Ht && (ot = Ht = null, at = 0), uc = n, mi = l, Hu = u, Ca = s, yh = r, ph = c, (n.subtreeFlags & 10256) !== 0 || (n.flags & 10256) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, _g(Mn, function() {
        return Og(), null;
      })) : (l.callbackNode = null, l.callbackPriority = 0), c = (n.flags & 13878) !== 0, (n.subtreeFlags & 13878) !== 0 || c) {
        c = D.T, D.T = null, r = Z.p, Z.p = 2, m = vt, vt |= 4;
        try {
          yf(l, n, u);
        } finally {
          vt = m, Z.p = r, D.T = c;
        }
      }
      zl = 1, bg(), Eg(), Tg();
    }
  }
  function bg() {
    if (zl === 1) {
      zl = 0;
      var l = mi, n = uc, u = (n.flags & 13878) !== 0;
      if ((n.subtreeFlags & 13878) !== 0 || u) {
        u = D.T, D.T = null;
        var c = Z.p;
        Z.p = 2;
        var r = vt;
        vt |= 4;
        try {
          ch(n, l);
          var s = Dh, m = xi(l.containerInfo), v = s.focusedElem, A = s.selectionRange;
          if (m !== v && v && v.ownerDocument && Nc(
            v.ownerDocument.documentElement,
            v
          )) {
            if (A !== null && Ar(v)) {
              var j = A.start, V = A.end;
              if (V === void 0 && (V = j), "selectionStart" in v)
                v.selectionStart = j, v.selectionEnd = Math.min(
                  V,
                  v.value.length
                );
              else {
                var k = v.ownerDocument || document, q = k && k.defaultView || window;
                if (q.getSelection) {
                  var X = q.getSelection(), he = v.textContent.length, Me = Math.min(A.start, he), Bt = A.end === void 0 ? Me : Math.min(A.end, he);
                  !X.extend && Me > Bt && (m = Bt, Bt = Me, Me = m);
                  var H = Jm(
                    v,
                    Me
                  ), z = Jm(
                    v,
                    Bt
                  );
                  if (H && z && (X.rangeCount !== 1 || X.anchorNode !== H.node || X.anchorOffset !== H.offset || X.focusNode !== z.node || X.focusOffset !== z.offset)) {
                    var B = k.createRange();
                    B.setStart(H.node, H.offset), X.removeAllRanges(), Me > Bt ? (X.addRange(B), X.extend(z.node, z.offset)) : (B.setEnd(z.node, z.offset), X.addRange(B));
                  }
                }
              }
            }
            for (k = [], X = v; X = X.parentNode; )
              X.nodeType === 1 && k.push({
                element: X,
                left: X.scrollLeft,
                top: X.scrollTop
              });
            for (typeof v.focus == "function" && v.focus(), v = 0; v < k.length; v++) {
              var $ = k[v];
              $.element.scrollLeft = $.left, $.element.scrollTop = $.top;
            }
          }
          Dl = !!zh, Dh = zh = null;
        } finally {
          vt = r, Z.p = c, D.T = u;
        }
      }
      l.current = n, zl = 2;
    }
  }
  function Eg() {
    if (zl === 2) {
      zl = 0;
      var l = mi, n = uc, u = (n.flags & 8772) !== 0;
      if ((n.subtreeFlags & 8772) !== 0 || u) {
        u = D.T, D.T = null;
        var c = Z.p;
        Z.p = 2;
        var r = vt;
        vt |= 4;
        try {
          as(l, n.alternate, n);
        } finally {
          vt = r, Z.p = c, D.T = u;
        }
      }
      zl = 3;
    }
  }
  function Tg() {
    if (zl === 4 || zl === 3) {
      zl = 0, vc();
      var l = mi, n = uc, u = Hu, c = ph;
      (n.subtreeFlags & 10256) !== 0 || (n.flags & 10256) !== 0 ? zl = 5 : (zl = 0, uc = mi = null, Ag(l, l.pendingLanes));
      var r = l.pendingLanes;
      if (r === 0 && (It = null), bm(u), n = n.stateNode, Al && typeof Al.onCommitFiberRoot == "function")
        try {
          Al.onCommitFiberRoot(
            sn,
            n,
            void 0,
            (n.current.flags & 128) === 128
          );
        } catch {
        }
      if (c !== null) {
        n = D.T, r = Z.p, Z.p = 2, D.T = null;
        try {
          for (var s = l.onRecoverableError, m = 0; m < c.length; m++) {
            var v = c[m];
            s(v.value, {
              componentStack: v.stack
            });
          }
        } finally {
          D.T = n, Z.p = r;
        }
      }
      (Hu & 3) !== 0 && Af(), Bu(l), r = l.pendingLanes, (u & 261930) !== 0 && (r & 42) !== 0 ? l === fs ? bf++ : (bf = 0, fs = l) : bf = 0, gi(0);
    }
  }
  function Ag(l, n) {
    (l.pooledCacheLanes &= n) === 0 && (n = l.pooledCache, n != null && (l.pooledCache = null, Nr(n)));
  }
  function Af() {
    return bg(), Eg(), Tg(), Og();
  }
  function Og() {
    if (zl !== 5) return !1;
    var l = mi, n = Ca;
    Ca = 0;
    var u = bm(Hu), c = D.T, r = Z.p;
    try {
      Z.p = 32 > u ? 32 : u, D.T = null, u = yh, yh = null;
      var s = mi, m = Hu;
      if (zl = 0, uc = mi = null, Hu = 0, (vt & 6) !== 0) throw Error(M(331));
      var v = vt;
      if (vt |= 4, Zy(s.current), pf(
        s,
        s.current,
        m,
        u
      ), vt = v, gi(0, !1), Al && typeof Al.onPostCommitFiberRoot == "function")
        try {
          Al.onPostCommitFiberRoot(sn, s);
        } catch {
        }
      return !0;
    } finally {
      Z.p = r, D.T = c, Ag(l, n);
    }
  }
  function Rg(l, n, u) {
    n = Za(u, n), n = Ry(l.stateNode, n, 2), l = ka(l, n, 2), l !== null && (Ci(l, 2), Bu(l));
  }
  function _t(l, n, u) {
    if (l.tag === 3)
      Rg(l, l, u);
    else
      for (; n !== null; ) {
        if (n.tag === 3) {
          Rg(
            n,
            l,
            u
          );
          break;
        } else if (n.tag === 1) {
          var c = n.stateNode;
          if (typeof n.type.getDerivedStateFromError == "function" || typeof c.componentDidCatch == "function" && (It === null || !It.has(c))) {
            l = Za(u, l), u = zy(2), c = ka(n, u, 2), c !== null && (Dy(
              u,
              c,
              n,
              l
            ), Ci(c, 2), Bu(c));
            break;
          }
        }
        n = n.return;
      }
  }
  function ds(l, n, u) {
    var c = l.pingCache;
    if (c === null) {
      c = l.pingCache = new Jy();
      var r = /* @__PURE__ */ new Set();
      c.set(n, r);
    } else
      r = c.get(n), r === void 0 && (r = /* @__PURE__ */ new Set(), c.set(n, r));
    r.has(u) || (dh = !0, r.add(u), l = ky.bind(null, l, n, u), n.then(l, l));
  }
  function ky(l, n, u) {
    var c = l.pingCache;
    c !== null && c.delete(n), l.pingedLanes |= l.suspendedLanes & u, l.warmLanes &= ~u, Ht === l && (at & u) === u && (Xt === 4 || Xt === 3 && (at & 62914560) === at && 300 > vl() - kn ? (vt & 2) === 0 && Nu(l, 0) : hh |= u, nl === at && (nl = 0)), Bu(l);
  }
  function zg(l, n) {
    n === 0 && (n = ea()), l = ti(l, n), l !== null && (Ci(l, n), Bu(l));
  }
  function tn(l) {
    var n = l.memoizedState, u = 0;
    n !== null && (u = n.retryLane), zg(l, u);
  }
  function Dg(l, n) {
    var u = 0;
    switch (l.tag) {
      case 31:
      case 13:
        var c = l.stateNode, r = l.memoizedState;
        r !== null && (u = r.retryLane);
        break;
      case 19:
        c = l.stateNode;
        break;
      case 22:
        c = l.stateNode._retryCache;
        break;
      default:
        throw Error(M(314));
    }
    c !== null && c.delete(n), zg(l, u);
  }
  function _g(l, n) {
    return me(l, n);
  }
  var Of = null, ao = null, Wy = !1, Sh = !1, Fy = !1, pi = 0;
  function Bu(l) {
    l !== ao && l.next === null && (ao === null ? Of = ao = l : ao = ao.next = l), Sh = !0, Wy || (Wy = !0, ms());
  }
  function gi(l, n) {
    if (!Fy && Sh) {
      Fy = !0;
      do
        for (var u = !1, c = Of; c !== null; ) {
          if (l !== 0) {
            var r = c.pendingLanes;
            if (r === 0) var s = 0;
            else {
              var m = c.suspendedLanes, v = c.pingedLanes;
              s = (1 << 31 - Ul(42 | l) + 1) - 1, s &= r & ~(m & ~v), s = s & 201326741 ? s & 201326741 | 1 : s ? s | 2 : 0;
            }
            s !== 0 && (u = !0, no(c, s));
          } else
            s = at, s = pe(
              c,
              c === Ht ? s : 0,
              c.cancelPendingCommit !== null || c.timeoutHandle !== -1
            ), (s & 3) === 0 || lt(c, s) || (u = !0, no(c, s));
          c = c.next;
        }
      while (u);
      Fy = !1;
    }
  }
  function bh() {
    Iy();
  }
  function Iy() {
    Sh = Wy = !1;
    var l = 0;
    pi !== 0 && u1() && (l = pi);
    for (var n = vl(), u = null, c = Of; c !== null; ) {
      var r = c.next, s = Py(c, n);
      s === 0 ? (c.next = null, u === null ? Of = r : u.next = r, r === null && (ao = u)) : (u = c, (l !== 0 || (s & 3) !== 0) && (Sh = !0)), c = r;
    }
    zl !== 0 && zl !== 5 || gi(l), pi !== 0 && (pi = 0);
  }
  function Py(l, n) {
    for (var u = l.suspendedLanes, c = l.pingedLanes, r = l.expirationTimes, s = l.pendingLanes & -62914561; 0 < s; ) {
      var m = 31 - Ul(s), v = 1 << m, A = r[m];
      A === -1 ? ((v & u) === 0 || (v & c) !== 0) && (r[m] = Qe(v, n)) : A <= n && (l.expiredLanes |= v), s &= ~v;
    }
    if (n = Ht, u = at, u = pe(
      l,
      l === n ? u : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), c = l.callbackNode, u === 0 || l === n && (Dt === 2 || Dt === 9) || l.cancelPendingCommit !== null)
      return c !== null && c !== null && _i(c), l.callbackNode = null, l.callbackPriority = 0;
    if ((u & 3) === 0 || lt(l, u)) {
      if (n = u & -u, n === l.callbackPriority) return n;
      switch (c !== null && _i(c), bm(u)) {
        case 2:
        case 8:
          u = Co;
          break;
        case 32:
          u = Mn;
          break;
        case 268435456:
          u = Uo;
          break;
        default:
          u = Mn;
      }
      return c = hs.bind(null, l), u = me(u, c), l.callbackPriority = n, l.callbackNode = u, n;
    }
    return c !== null && c !== null && _i(c), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function hs(l, n) {
    if (zl !== 0 && zl !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var u = l.callbackNode;
    if (Af() && l.callbackNode !== u)
      return null;
    var c = at;
    return c = pe(
      l,
      l === Ht ? c : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), c === 0 ? null : (rg(l, c, n), Py(l, vl()), l.callbackNode != null && l.callbackNode === u ? hs.bind(null, l) : null);
  }
  function no(l, n) {
    if (Af()) return null;
    rg(l, n, !0);
  }
  function ms() {
    jg(function() {
      (vt & 6) !== 0 ? me(
        Mo,
        bh
      ) : Iy();
    });
  }
  function Eh() {
    if (pi === 0) {
      var l = Xi;
      l === 0 && (l = ee, ee <<= 1, (ee & 261888) === 0 && (ee = 256)), pi = l;
    }
    return pi;
  }
  function Mg(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : hn("" + l);
  }
  function uo(l, n) {
    var u = n.ownerDocument.createElement("input");
    return u.name = n.name, u.value = n.value, l.id && u.setAttribute("form", l.id), n.parentNode.insertBefore(u, n), l = new FormData(l), u.parentNode.removeChild(u), l;
  }
  function ys(l, n, u, c, r) {
    if (n === "submit" && u && u.stateNode === r) {
      var s = Mg(
        (r[fa] || null).action
      ), m = c.submitter;
      m && (n = (n = m[fa] || null) ? Mg(n.formAction) : m.getAttribute("formAction"), n !== null && (s = n, m = null));
      var v = new br(
        "action",
        "action",
        null,
        c,
        r
      );
      l.push({
        event: v,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (c.defaultPrevented) {
                if (pi !== 0) {
                  var A = m ? uo(r, m) : new FormData(r);
                  of(
                    u,
                    {
                      pending: !0,
                      data: A,
                      method: r.method,
                      action: s
                    },
                    null,
                    A
                  );
                }
              } else
                typeof s == "function" && (v.preventDefault(), A = m ? uo(r, m) : new FormData(r), of(
                  u,
                  {
                    pending: !0,
                    data: A,
                    method: r.method,
                    action: s
                  },
                  s,
                  A
                ));
            },
            currentTarget: r
          }
        ]
      });
    }
  }
  for (var Th = 0; Th < Jo.length; Th++) {
    var Rf = Jo[Th], ep = Rf.toLowerCase(), tp = Rf[0].toUpperCase() + Rf.slice(1);
    sa(
      ep,
      "on" + tp
    );
  }
  sa(Rr, "onAnimationEnd"), sa(Km, "onAnimationIteration"), sa(Td, "onAnimationStart"), sa("dblclick", "onDoubleClick"), sa("focusin", "onFocus"), sa("focusout", "onBlur"), sa(Bc, "onTransitionRun"), sa(zr, "onTransitionStart"), sa(mu, "onTransitionCancel"), sa(G0, "onTransitionEnd"), fu("onMouseEnter", ["mouseout", "mouseover"]), fu("onMouseLeave", ["mouseout", "mouseover"]), fu("onPointerEnter", ["pointerout", "pointerover"]), fu("onPointerLeave", ["pointerout", "pointerover"]), Ni(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Ni(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Ni("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Ni(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Ni(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Ni(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var zf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Cg = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(zf)
  );
  function Ug(l, n) {
    n = (n & 4) !== 0;
    for (var u = 0; u < l.length; u++) {
      var c = l[u], r = c.event;
      c = c.listeners;
      e: {
        var s = void 0;
        if (n)
          for (var m = c.length - 1; 0 <= m; m--) {
            var v = c[m], A = v.instance, j = v.currentTarget;
            if (v = v.listener, A !== s && r.isPropagationStopped())
              break e;
            s = v, r.currentTarget = j;
            try {
              s(r);
            } catch (V) {
              Yc(V);
            }
            r.currentTarget = null, s = A;
          }
        else
          for (m = 0; m < c.length; m++) {
            if (v = c[m], A = v.instance, j = v.currentTarget, v = v.listener, A !== s && r.isPropagationStopped())
              break e;
            s = v, r.currentTarget = j;
            try {
              s(r);
            } catch (V) {
              Yc(V);
            }
            r.currentTarget = null, s = A;
          }
      }
    }
  }
  function ut(l, n) {
    var u = n[td];
    u === void 0 && (u = n[td] = /* @__PURE__ */ new Set());
    var c = l + "__bubble";
    u.has(c) || (ps(n, l, 2, !1), u.add(c));
  }
  function lp(l, n, u) {
    var c = 0;
    n && (c |= 4), ps(
      u,
      l,
      c,
      n
    );
  }
  var Ah = "_reactListening" + Math.random().toString(36).slice(2);
  function Df(l) {
    if (!l[Ah]) {
      l[Ah] = !0, Ac.forEach(function(u) {
        u !== "selectionchange" && (Cg.has(u) || lp(u, !1, l), lp(u, !0, l));
      });
      var n = l.nodeType === 9 ? l : l.ownerDocument;
      n === null || n[Ah] || (n[Ah] = !0, lp("selectionchange", !1, n));
    }
  }
  function ps(l, n, u, c) {
    switch (Rs(n)) {
      case 2:
        var r = ju;
        break;
      case 8:
        r = qu;
        break;
      default:
        r = kl;
    }
    u = r.bind(
      null,
      n,
      u,
      l
    ), r = void 0, !vr || n !== "touchstart" && n !== "touchmove" && n !== "wheel" || (r = !0), c ? r !== void 0 ? l.addEventListener(n, u, {
      capture: !0,
      passive: r
    }) : l.addEventListener(n, u, !0) : r !== void 0 ? l.addEventListener(n, u, {
      passive: r
    }) : l.addEventListener(n, u, !1);
  }
  function ap(l, n, u, c, r) {
    var s = c;
    if ((n & 1) === 0 && (n & 2) === 0 && c !== null)
      e: for (; ; ) {
        if (c === null) return;
        var m = c.tag;
        if (m === 3 || m === 4) {
          var v = c.stateNode.containerInfo;
          if (v === r) break;
          if (m === 4)
            for (m = c.return; m !== null; ) {
              var A = m.tag;
              if ((A === 3 || A === 4) && m.stateNode.containerInfo === r)
                return;
              m = m.return;
            }
          for (; v !== null; ) {
            if (m = bc(v), m === null) return;
            if (A = m.tag, A === 5 || A === 6 || A === 26 || A === 27) {
              c = s = m;
              continue e;
            }
            v = v.parentNode;
          }
        }
        c = c.return;
      }
    Mm(function() {
      var j = s, V = fd(u), k = [];
      e: {
        var q = yu.get(l);
        if (q !== void 0) {
          var X = br, he = l;
          switch (l) {
            case "keypress":
              if (sd(u) === 0) break e;
            case "keydown":
            case "keyup":
              X = yd;
              break;
            case "focusin":
              he = "focus", X = hd;
              break;
            case "focusout":
              he = "blur", X = hd;
              break;
            case "beforeblur":
            case "afterblur":
              X = hd;
              break;
            case "click":
              if (u.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              X = Lo;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              X = _0;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              X = N0;
              break;
            case Rr:
            case Km:
            case Td:
              X = C0;
              break;
            case G0:
              X = Pv;
              break;
            case "scroll":
            case "scrollend":
              X = Fv;
              break;
            case "wheel":
              X = e1;
              break;
            case "copy":
            case "cut":
            case "paste":
              X = Dc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              X = Bn;
              break;
            case "toggle":
            case "beforetoggle":
              X = xm;
          }
          var Me = (n & 4) !== 0, Bt = !Me && (l === "scroll" || l === "scrollend"), H = Me ? q !== null ? q + "Capture" : null : q;
          Me = [];
          for (var z = j, B; z !== null; ) {
            var $ = z;
            if (B = $.stateNode, $ = $.tag, $ !== 5 && $ !== 26 && $ !== 27 || B === null || H === null || ($ = Hl(z, H), $ != null && Me.push(
              gs(z, $, B)
            )), Bt) break;
            z = z.return;
          }
          0 < Me.length && (q = new X(
            q,
            he,
            null,
            u,
            V
          ), k.push({ event: q, listeners: Me }));
        }
      }
      if ((n & 7) === 0) {
        e: {
          if (q = l === "mouseover" || l === "pointerover", X = l === "mouseout" || l === "pointerout", q && u !== od && (he = u.relatedTarget || u.fromElement) && (bc(he) || he[Ui]))
            break e;
          if ((X || q) && (q = V.window === V ? V : (q = V.ownerDocument) ? q.defaultView || q.parentWindow : window, X ? (he = u.relatedTarget || u.toElement, X = j, he = he ? bc(he) : null, he !== null && (Bt = ce(he), Me = he.tag, he !== Bt || Me !== 5 && Me !== 27 && Me !== 6) && (he = null)) : (X = null, he = j), X !== he)) {
            if (Me = Lo, $ = "onMouseLeave", H = "onMouseEnter", z = "mouse", (l === "pointerout" || l === "pointerover") && (Me = Bn, $ = "onPointerLeave", H = "onPointerEnter", z = "pointer"), Bt = X == null ? q : No(X), B = he == null ? q : No(he), q = new Me(
              $,
              z + "leave",
              X,
              u,
              V
            ), q.target = Bt, q.relatedTarget = B, $ = null, bc(V) === j && (Me = new Me(
              H,
              z + "enter",
              he,
              u,
              V
            ), Me.target = B, Me.relatedTarget = Bt, $ = Me), Bt = $, X && he)
              t: {
                for (Me = Hg, H = X, z = he, B = 0, $ = H; $; $ = Me($))
                  B++;
                $ = 0;
                for (var Te = z; Te; Te = Me(Te))
                  $++;
                for (; 0 < B - $; )
                  H = Me(H), B--;
                for (; 0 < $ - B; )
                  z = Me(z), $--;
                for (; B--; ) {
                  if (H === z || z !== null && H === z.alternate) {
                    Me = H;
                    break t;
                  }
                  H = Me(H), z = Me(z);
                }
                Me = null;
              }
            else Me = null;
            X !== null && Oh(
              k,
              q,
              X,
              Me,
              !1
            ), he !== null && Bt !== null && Oh(
              k,
              Bt,
              he,
              Me,
              !0
            );
          }
        }
        e: {
          if (q = j ? No(j) : window, X = q.nodeName && q.nodeName.toLowerCase(), X === "select" || X === "input" && q.type === "file")
            var ht = Qm;
          else if (hu(q))
            if (vd)
              ht = Hc;
            else {
              ht = x0;
              var ge = q0;
            }
          else
            X = q.nodeName, !X || X.toLowerCase() !== "input" || q.type !== "checkbox" && q.type !== "radio" ? j && _m(j.elementType) && (ht = Qm) : ht = qi;
          if (ht && (ht = ht(l, j))) {
            Xm(
              k,
              ht,
              u,
              V
            );
            break e;
          }
          ge && ge(l, q, j), l === "focusout" && j && q.type === "number" && j.memoizedProps.value != null && Oc(q, "number", q.value);
        }
        switch (ge = j ? No(j) : window, l) {
          case "focusin":
            (hu(ge) || ge.contentEditable === "true") && (wi = ge, Vo = j, pn = null);
            break;
          case "focusout":
            pn = Vo = wi = null;
            break;
          case "mousedown":
            jn = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            jn = !1, Ed(k, u, V);
            break;
          case "selectionchange":
            if (Or) break;
          case "keydown":
          case "keyup":
            Ed(k, u, V);
        }
        var Ve;
        if (Xo)
          e: {
            switch (l) {
              case "compositionstart":
                var ke = "onCompositionStart";
                break e;
              case "compositionend":
                ke = "onCompositionEnd";
                break e;
              case "compositionupdate":
                ke = "onCompositionUpdate";
                break e;
            }
            ke = void 0;
          }
        else
          Mc ? gd(l, u) && (ke = "onCompositionEnd") : l === "keydown" && u.keyCode === 229 && (ke = "onCompositionStart");
        ke && (wm && u.locale !== "ko" && (Mc || ke !== "onCompositionStart" ? ke === "onCompositionEnd" && Mc && (Ve = Um()) : (Pu = V, Cm = "value" in Pu ? Pu.value : Pu.textContent, Mc = !0)), ge = vs(j, ke), 0 < ge.length && (ke = new U0(
          ke,
          l,
          null,
          u,
          V
        ), k.push({ event: ke, listeners: ge }), Ve ? ke.data = Ve : (Ve = Gm(u), Ve !== null && (ke.data = Ve)))), (Ve = ta ? j0(l, u) : t1(l, u)) && (ke = vs(j, "onBeforeInput"), 0 < ke.length && (ge = new U0(
          "onBeforeInput",
          "beforeinput",
          null,
          u,
          V
        ), k.push({
          event: ge,
          listeners: ke
        }), ge.data = Ve)), ys(
          k,
          l,
          j,
          u,
          V
        );
      }
      Ug(k, n);
    });
  }
  function gs(l, n, u) {
    return {
      instance: l,
      listener: n,
      currentTarget: u
    };
  }
  function vs(l, n) {
    for (var u = n + "Capture", c = []; l !== null; ) {
      var r = l, s = r.stateNode;
      if (r = r.tag, r !== 5 && r !== 26 && r !== 27 || s === null || (r = Hl(l, u), r != null && c.unshift(
        gs(l, r, s)
      ), r = Hl(l, n), r != null && c.push(
        gs(l, r, s)
      )), l.tag === 3) return c;
      l = l.return;
    }
    return [];
  }
  function Hg(l) {
    if (l === null) return null;
    do
      l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function Oh(l, n, u, c, r) {
    for (var s = n._reactName, m = []; u !== null && u !== c; ) {
      var v = u, A = v.alternate, j = v.stateNode;
      if (v = v.tag, A !== null && A === c) break;
      v !== 5 && v !== 26 && v !== 27 || j === null || (A = j, r ? (j = Hl(u, s), j != null && m.unshift(
        gs(u, j, A)
      )) : r || (j = Hl(u, s), j != null && m.push(
        gs(u, j, A)
      ))), u = u.return;
    }
    m.length !== 0 && l.push({ event: n, listeners: m });
  }
  var Ng = /\r\n?/g, np = /\u0000|\uFFFD/g;
  function up(l) {
    return (typeof l == "string" ? l : "" + l).replace(Ng, `
`).replace(np, "");
  }
  function ip(l, n) {
    return n = up(n), up(l) === n;
  }
  function Nt(l, n, u, c, r, s) {
    switch (u) {
      case "children":
        typeof c == "string" ? n === "body" || n === "textarea" && c === "" || ru(l, c) : (typeof c == "number" || typeof c == "bigint") && n !== "body" && ru(l, "" + c);
        break;
      case "className":
        ud(l, "class", c);
        break;
      case "tabIndex":
        ud(l, "tabindex", c);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        ud(l, u, c);
        break;
      case "style":
        R0(l, c, s);
        break;
      case "data":
        if (n !== "object") {
          ud(l, "data", c);
          break;
        }
      case "src":
      case "href":
        if (c === "" && (n !== "a" || u !== "href")) {
          l.removeAttribute(u);
          break;
        }
        if (c == null || typeof c == "function" || typeof c == "symbol" || typeof c == "boolean") {
          l.removeAttribute(u);
          break;
        }
        c = hn("" + c), l.setAttribute(u, c);
        break;
      case "action":
      case "formAction":
        if (typeof c == "function") {
          l.setAttribute(
            u,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof s == "function" && (u === "formAction" ? (n !== "input" && Nt(l, n, "name", r.name, r, null), Nt(
            l,
            n,
            "formEncType",
            r.formEncType,
            r,
            null
          ), Nt(
            l,
            n,
            "formMethod",
            r.formMethod,
            r,
            null
          ), Nt(
            l,
            n,
            "formTarget",
            r.formTarget,
            r,
            null
          )) : (Nt(l, n, "encType", r.encType, r, null), Nt(l, n, "method", r.method, r, null), Nt(l, n, "target", r.target, r, null)));
        if (c == null || typeof c == "symbol" || typeof c == "boolean") {
          l.removeAttribute(u);
          break;
        }
        c = hn("" + c), l.setAttribute(u, c);
        break;
      case "onClick":
        c != null && (l.onclick = Un);
        break;
      case "onScroll":
        c != null && ut("scroll", l);
        break;
      case "onScrollEnd":
        c != null && ut("scrollend", l);
        break;
      case "dangerouslySetInnerHTML":
        if (c != null) {
          if (typeof c != "object" || !("__html" in c))
            throw Error(M(61));
          if (u = c.__html, u != null) {
            if (r.children != null) throw Error(M(60));
            l.innerHTML = u;
          }
        }
        break;
      case "multiple":
        l.multiple = c && typeof c != "function" && typeof c != "symbol";
        break;
      case "muted":
        l.muted = c && typeof c != "function" && typeof c != "symbol";
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
        if (c == null || typeof c == "function" || typeof c == "boolean" || typeof c == "symbol") {
          l.removeAttribute("xlink:href");
          break;
        }
        u = hn("" + c), l.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          u
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
        c != null && typeof c != "function" && typeof c != "symbol" ? l.setAttribute(u, "" + c) : l.removeAttribute(u);
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
        c && typeof c != "function" && typeof c != "symbol" ? l.setAttribute(u, "") : l.removeAttribute(u);
        break;
      case "capture":
      case "download":
        c === !0 ? l.setAttribute(u, "") : c !== !1 && c != null && typeof c != "function" && typeof c != "symbol" ? l.setAttribute(u, c) : l.removeAttribute(u);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        c != null && typeof c != "function" && typeof c != "symbol" && !isNaN(c) && 1 <= c ? l.setAttribute(u, c) : l.removeAttribute(u);
        break;
      case "rowSpan":
      case "start":
        c == null || typeof c == "function" || typeof c == "symbol" || isNaN(c) ? l.removeAttribute(u) : l.setAttribute(u, c);
        break;
      case "popover":
        ut("beforetoggle", l), ut("toggle", l), jo(l, "popover", c);
        break;
      case "xlinkActuate":
        Fu(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          c
        );
        break;
      case "xlinkArcrole":
        Fu(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          c
        );
        break;
      case "xlinkRole":
        Fu(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          c
        );
        break;
      case "xlinkShow":
        Fu(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          c
        );
        break;
      case "xlinkTitle":
        Fu(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          c
        );
        break;
      case "xlinkType":
        Fu(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          c
        );
        break;
      case "xmlBase":
        Fu(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          c
        );
        break;
      case "xmlLang":
        Fu(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          c
        );
        break;
      case "xmlSpace":
        Fu(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          c
        );
        break;
      case "is":
        jo(l, "is", c);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < u.length) || u[0] !== "o" && u[0] !== "O" || u[1] !== "n" && u[1] !== "N") && (u = Wv.get(u) || u, jo(l, u, c));
    }
  }
  function cp(l, n, u, c, r, s) {
    switch (u) {
      case "style":
        R0(l, c, s);
        break;
      case "dangerouslySetInnerHTML":
        if (c != null) {
          if (typeof c != "object" || !("__html" in c))
            throw Error(M(61));
          if (u = c.__html, u != null) {
            if (r.children != null) throw Error(M(60));
            l.innerHTML = u;
          }
        }
        break;
      case "children":
        typeof c == "string" ? ru(l, c) : (typeof c == "number" || typeof c == "bigint") && ru(l, "" + c);
        break;
      case "onScroll":
        c != null && ut("scroll", l);
        break;
      case "onScrollEnd":
        c != null && ut("scrollend", l);
        break;
      case "onClick":
        c != null && (l.onclick = Un);
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
        if (!Hi.hasOwnProperty(u))
          e: {
            if (u[0] === "o" && u[1] === "n" && (r = u.endsWith("Capture"), n = u.slice(2, r ? u.length - 7 : void 0), s = l[fa] || null, s = s != null ? s[u] : null, typeof s == "function" && l.removeEventListener(n, s, r), typeof c == "function")) {
              typeof s != "function" && s !== null && (u in l ? l[u] = null : l.hasAttribute(u) && l.removeAttribute(u)), l.addEventListener(n, c, r);
              break e;
            }
            u in l ? l[u] = c : c === !0 ? l.setAttribute(u, "") : jo(l, u, c);
          }
    }
  }
  function $l(l, n, u) {
    switch (n) {
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
        ut("error", l), ut("load", l);
        var c = !1, r = !1, s;
        for (s in u)
          if (u.hasOwnProperty(s)) {
            var m = u[s];
            if (m != null)
              switch (s) {
                case "src":
                  c = !0;
                  break;
                case "srcSet":
                  r = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(M(137, n));
                default:
                  Nt(l, n, s, m, u, null);
              }
          }
        r && Nt(l, n, "srcSet", u.srcSet, u, null), c && Nt(l, n, "src", u.src, u, null);
        return;
      case "input":
        ut("invalid", l);
        var v = s = m = r = null, A = null, j = null;
        for (c in u)
          if (u.hasOwnProperty(c)) {
            var V = u[c];
            if (V != null)
              switch (c) {
                case "name":
                  r = V;
                  break;
                case "type":
                  m = V;
                  break;
                case "checked":
                  A = V;
                  break;
                case "defaultChecked":
                  j = V;
                  break;
                case "value":
                  s = V;
                  break;
                case "defaultValue":
                  v = V;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (V != null)
                    throw Error(M(137, n));
                  break;
                default:
                  Nt(l, n, c, V, u, null);
              }
          }
        yr(
          l,
          s,
          v,
          A,
          j,
          m,
          r,
          !1
        );
        return;
      case "select":
        ut("invalid", l), c = m = s = null;
        for (r in u)
          if (u.hasOwnProperty(r) && (v = u[r], v != null))
            switch (r) {
              case "value":
                s = v;
                break;
              case "defaultValue":
                m = v;
                break;
              case "multiple":
                c = v;
              default:
                Nt(l, n, r, v, u, null);
            }
        n = s, u = m, l.multiple = !!c, n != null ? qo(l, !!c, n, !1) : u != null && qo(l, !!c, u, !0);
        return;
      case "textarea":
        ut("invalid", l), s = r = c = null;
        for (m in u)
          if (u.hasOwnProperty(m) && (v = u[m], v != null))
            switch (m) {
              case "value":
                c = v;
                break;
              case "defaultValue":
                r = v;
                break;
              case "children":
                s = v;
                break;
              case "dangerouslySetInnerHTML":
                if (v != null) throw Error(M(91));
                break;
              default:
                Nt(l, n, m, v, u, null);
            }
        Dm(l, c, r, s);
        return;
      case "option":
        for (A in u)
          if (u.hasOwnProperty(A) && (c = u[A], c != null))
            switch (A) {
              case "selected":
                l.selected = c && typeof c != "function" && typeof c != "symbol";
                break;
              default:
                Nt(l, n, A, c, u, null);
            }
        return;
      case "dialog":
        ut("beforetoggle", l), ut("toggle", l), ut("cancel", l), ut("close", l);
        break;
      case "iframe":
      case "object":
        ut("load", l);
        break;
      case "video":
      case "audio":
        for (c = 0; c < zf.length; c++)
          ut(zf[c], l);
        break;
      case "image":
        ut("error", l), ut("load", l);
        break;
      case "details":
        ut("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        ut("error", l), ut("load", l);
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
        for (j in u)
          if (u.hasOwnProperty(j) && (c = u[j], c != null))
            switch (j) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(M(137, n));
              default:
                Nt(l, n, j, c, u, null);
            }
        return;
      default:
        if (_m(n)) {
          for (V in u)
            u.hasOwnProperty(V) && (c = u[V], c !== void 0 && cp(
              l,
              n,
              V,
              c,
              u,
              void 0
            ));
          return;
        }
    }
    for (v in u)
      u.hasOwnProperty(v) && (c = u[v], c != null && Nt(l, n, v, c, u, null));
  }
  function op(l, n, u, c) {
    switch (n) {
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
        var r = null, s = null, m = null, v = null, A = null, j = null, V = null;
        for (X in u) {
          var k = u[X];
          if (u.hasOwnProperty(X) && k != null)
            switch (X) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                A = k;
              default:
                c.hasOwnProperty(X) || Nt(l, n, X, null, c, k);
            }
        }
        for (var q in c) {
          var X = c[q];
          if (k = u[q], c.hasOwnProperty(q) && (X != null || k != null))
            switch (q) {
              case "type":
                s = X;
                break;
              case "name":
                r = X;
                break;
              case "checked":
                j = X;
                break;
              case "defaultChecked":
                V = X;
                break;
              case "value":
                m = X;
                break;
              case "defaultValue":
                v = X;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (X != null)
                  throw Error(M(137, n));
                break;
              default:
                X !== k && Nt(
                  l,
                  n,
                  q,
                  X,
                  c,
                  k
                );
            }
        }
        mr(
          l,
          m,
          v,
          A,
          j,
          V,
          s,
          r
        );
        return;
      case "select":
        X = m = v = q = null;
        for (s in u)
          if (A = u[s], u.hasOwnProperty(s) && A != null)
            switch (s) {
              case "value":
                break;
              case "multiple":
                X = A;
              default:
                c.hasOwnProperty(s) || Nt(
                  l,
                  n,
                  s,
                  null,
                  c,
                  A
                );
            }
        for (r in c)
          if (s = c[r], A = u[r], c.hasOwnProperty(r) && (s != null || A != null))
            switch (r) {
              case "value":
                q = s;
                break;
              case "defaultValue":
                v = s;
                break;
              case "multiple":
                m = s;
              default:
                s !== A && Nt(
                  l,
                  n,
                  r,
                  s,
                  c,
                  A
                );
            }
        n = v, u = m, c = X, q != null ? qo(l, !!u, q, !1) : !!c != !!u && (n != null ? qo(l, !!u, n, !0) : qo(l, !!u, u ? [] : "", !1));
        return;
      case "textarea":
        X = q = null;
        for (v in u)
          if (r = u[v], u.hasOwnProperty(v) && r != null && !c.hasOwnProperty(v))
            switch (v) {
              case "value":
                break;
              case "children":
                break;
              default:
                Nt(l, n, v, null, c, r);
            }
        for (m in c)
          if (r = c[m], s = u[m], c.hasOwnProperty(m) && (r != null || s != null))
            switch (m) {
              case "value":
                q = r;
                break;
              case "defaultValue":
                X = r;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (r != null) throw Error(M(91));
                break;
              default:
                r !== s && Nt(l, n, m, r, c, s);
            }
        zm(l, q, X);
        return;
      case "option":
        for (var he in u)
          if (q = u[he], u.hasOwnProperty(he) && q != null && !c.hasOwnProperty(he))
            switch (he) {
              case "selected":
                l.selected = !1;
                break;
              default:
                Nt(
                  l,
                  n,
                  he,
                  null,
                  c,
                  q
                );
            }
        for (A in c)
          if (q = c[A], X = u[A], c.hasOwnProperty(A) && q !== X && (q != null || X != null))
            switch (A) {
              case "selected":
                l.selected = q && typeof q != "function" && typeof q != "symbol";
                break;
              default:
                Nt(
                  l,
                  n,
                  A,
                  q,
                  c,
                  X
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
        for (var Me in u)
          q = u[Me], u.hasOwnProperty(Me) && q != null && !c.hasOwnProperty(Me) && Nt(l, n, Me, null, c, q);
        for (j in c)
          if (q = c[j], X = u[j], c.hasOwnProperty(j) && q !== X && (q != null || X != null))
            switch (j) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (q != null)
                  throw Error(M(137, n));
                break;
              default:
                Nt(
                  l,
                  n,
                  j,
                  q,
                  c,
                  X
                );
            }
        return;
      default:
        if (_m(n)) {
          for (var Bt in u)
            q = u[Bt], u.hasOwnProperty(Bt) && q !== void 0 && !c.hasOwnProperty(Bt) && cp(
              l,
              n,
              Bt,
              void 0,
              c,
              q
            );
          for (V in c)
            q = c[V], X = u[V], !c.hasOwnProperty(V) || q === X || q === void 0 && X === void 0 || cp(
              l,
              n,
              V,
              q,
              c,
              X
            );
          return;
        }
    }
    for (var H in u)
      q = u[H], u.hasOwnProperty(H) && q != null && !c.hasOwnProperty(H) && Nt(l, n, H, null, c, q);
    for (k in c)
      q = c[k], X = u[k], !c.hasOwnProperty(k) || q === X || q == null && X == null || Nt(l, n, k, q, c, X);
  }
  function Rh(l) {
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
  function fp() {
    if (typeof performance.getEntriesByType == "function") {
      for (var l = 0, n = 0, u = performance.getEntriesByType("resource"), c = 0; c < u.length; c++) {
        var r = u[c], s = r.transferSize, m = r.initiatorType, v = r.duration;
        if (s && v && Rh(m)) {
          for (m = 0, v = r.responseEnd, c += 1; c < u.length; c++) {
            var A = u[c], j = A.startTime;
            if (j > v) break;
            var V = A.transferSize, k = A.initiatorType;
            V && Rh(k) && (A = A.responseEnd, m += V * (A < v ? 1 : (v - j) / (A - j)));
          }
          if (--c, n += 8 * (s + m) / (r.duration / 1e3), l++, 10 < l) break;
        }
      }
      if (0 < l) return n / l / 1e6;
    }
    return navigator.connection && (l = navigator.connection.downlink, typeof l == "number") ? l : 5;
  }
  var zh = null, Dh = null;
  function cc(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function Bg(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function rp(l, n) {
    if (l === 0)
      switch (n) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return l === 1 && n === "foreignObject" ? 0 : l;
  }
  function _f(l, n) {
    return l === "textarea" || l === "noscript" || typeof n.children == "string" || typeof n.children == "number" || typeof n.children == "bigint" || typeof n.dangerouslySetInnerHTML == "object" && n.dangerouslySetInnerHTML !== null && n.dangerouslySetInnerHTML.__html != null;
  }
  var _h = null;
  function u1() {
    var l = window.event;
    return l && l.type === "popstate" ? l === _h ? !1 : (_h = l, !0) : (_h = null, !1);
  }
  var Ss = typeof setTimeout == "function" ? setTimeout : void 0, Yg = typeof clearTimeout == "function" ? clearTimeout : void 0, io = typeof Promise == "function" ? Promise : void 0, jg = typeof queueMicrotask == "function" ? queueMicrotask : typeof io < "u" ? function(l) {
    return io.resolve(null).then(l).catch(sp);
  } : Ss;
  function sp(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function Wn(l) {
    return l === "head";
  }
  function dp(l, n) {
    var u = n, c = 0;
    do {
      var r = u.nextSibling;
      if (l.removeChild(u), r && r.nodeType === 8)
        if (u = r.data, u === "/$" || u === "/&") {
          if (c === 0) {
            l.removeChild(r), Gf(n);
            return;
          }
          c--;
        } else if (u === "$" || u === "$?" || u === "$~" || u === "$!" || u === "&")
          c++;
        else if (u === "html")
          co(l.ownerDocument.documentElement);
        else if (u === "head") {
          u = l.ownerDocument.head, co(u);
          for (var s = u.firstChild; s; ) {
            var m = s.nextSibling, v = s.nodeName;
            s[ou] || v === "SCRIPT" || v === "STYLE" || v === "LINK" && s.rel.toLowerCase() === "stylesheet" || u.removeChild(s), s = m;
          }
        } else
          u === "body" && co(l.ownerDocument.body);
      u = r;
    } while (u);
    Gf(n);
  }
  function pl(l, n) {
    var u = l;
    l = 0;
    do {
      var c = u.nextSibling;
      if (u.nodeType === 1 ? n ? (u._stashedDisplay = u.style.display, u.style.display = "none") : (u.style.display = u._stashedDisplay || "", u.getAttribute("style") === "" && u.removeAttribute("style")) : u.nodeType === 3 && (n ? (u._stashedText = u.nodeValue, u.nodeValue = "") : u.nodeValue = u._stashedText || ""), c && c.nodeType === 8)
        if (u = c.data, u === "/$") {
          if (l === 0) break;
          l--;
        } else
          u !== "$" && u !== "$?" && u !== "$~" && u !== "$!" || l++;
      u = c;
    } while (u);
  }
  function bs(l) {
    var n = l.firstChild;
    for (n && n.nodeType === 10 && (n = n.nextSibling); n; ) {
      var u = n;
      switch (n = n.nextSibling, u.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          bs(u), ld(u);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (u.rel.toLowerCase() === "stylesheet") continue;
      }
      l.removeChild(u);
    }
  }
  function i1(l, n, u, c) {
    for (; l.nodeType === 1; ) {
      var r = u;
      if (l.nodeName.toLowerCase() !== n.toLowerCase()) {
        if (!c && (l.nodeName !== "INPUT" || l.type !== "hidden"))
          break;
      } else if (c) {
        if (!l[ou])
          switch (n) {
            case "meta":
              if (!l.hasAttribute("itemprop")) break;
              return l;
            case "link":
              if (s = l.getAttribute("rel"), s === "stylesheet" && l.hasAttribute("data-precedence"))
                break;
              if (s !== r.rel || l.getAttribute("href") !== (r.href == null || r.href === "" ? null : r.href) || l.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin) || l.getAttribute("title") !== (r.title == null ? null : r.title))
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (s = l.getAttribute("src"), (s !== (r.src == null ? null : r.src) || l.getAttribute("type") !== (r.type == null ? null : r.type) || l.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin)) && s && l.hasAttribute("async") && !l.hasAttribute("itemprop"))
                break;
              return l;
            default:
              return l;
          }
      } else if (n === "input" && l.type === "hidden") {
        var s = r.name == null ? null : "" + r.name;
        if (r.type === "hidden" && l.getAttribute("name") === s)
          return l;
      } else return l;
      if (l = Aa(l.nextSibling), l === null) break;
    }
    return null;
  }
  function Ie(l, n, u) {
    if (n === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !u || (l = Aa(l.nextSibling), l === null)) return null;
    return l;
  }
  function qg(l, n) {
    for (; l.nodeType !== 8; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !n || (l = Aa(l.nextSibling), l === null)) return null;
    return l;
  }
  function On(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function oc(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState !== "loading";
  }
  function Mf(l, n) {
    var u = l.ownerDocument;
    if (l.data === "$~") l._reactRetry = n;
    else if (l.data !== "$?" || u.readyState !== "loading")
      n();
    else {
      var c = function() {
        n(), u.removeEventListener("DOMContentLoaded", c);
      };
      u.addEventListener("DOMContentLoaded", c), l._reactRetry = c;
    }
  }
  function Aa(l) {
    for (; l != null; l = l.nextSibling) {
      var n = l.nodeType;
      if (n === 1 || n === 3) break;
      if (n === 8) {
        if (n = l.data, n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&" || n === "F!" || n === "F")
          break;
        if (n === "/$" || n === "/&") return null;
      }
    }
    return l;
  }
  var Es = null;
  function Mh(l) {
    l = l.nextSibling;
    for (var n = 0; l; ) {
      if (l.nodeType === 8) {
        var u = l.data;
        if (u === "/$" || u === "/&") {
          if (n === 0)
            return Aa(l.nextSibling);
          n--;
        } else
          u !== "$" && u !== "$!" && u !== "$?" && u !== "$~" && u !== "&" || n++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function Fn(l) {
    l = l.previousSibling;
    for (var n = 0; l; ) {
      if (l.nodeType === 8) {
        var u = l.data;
        if (u === "$" || u === "$!" || u === "$?" || u === "$~" || u === "&") {
          if (n === 0) return l;
          n--;
        } else u !== "/$" && u !== "/&" || n++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function Cf(l, n, u) {
    switch (n = cc(u), l) {
      case "html":
        if (l = n.documentElement, !l) throw Error(M(452));
        return l;
      case "head":
        if (l = n.head, !l) throw Error(M(453));
        return l;
      case "body":
        if (l = n.body, !l) throw Error(M(454));
        return l;
      default:
        throw Error(M(451));
    }
  }
  function co(l) {
    for (var n = l.attributes; n.length; )
      l.removeAttributeNode(n[0]);
    ld(l);
  }
  var Ha = /* @__PURE__ */ new Map(), Ts = /* @__PURE__ */ new Set();
  function na(l) {
    return typeof l.getRootNode == "function" ? l.getRootNode() : l.nodeType === 9 ? l : l.ownerDocument;
  }
  var In = Z.d;
  Z.d = {
    f: c1,
    r: xg,
    D: L,
    C: At,
    L: o1,
    m: hp,
    X: vi,
    S: mp,
    M: fc
  };
  function c1() {
    var l = In.f(), n = Ef();
    return l || n;
  }
  function xg(l) {
    var n = Ec(l);
    n !== null && n.tag === 5 && n.type === "form" ? Ut(n) : In.r(l);
  }
  var Uf = typeof document > "u" ? null : document;
  function El(l, n, u) {
    var c = Uf;
    if (c && typeof n == "string" && n) {
      var r = Xa(n);
      r = 'link[rel="' + l + '"][href="' + r + '"]', typeof u == "string" && (r += '[crossorigin="' + u + '"]'), Ts.has(r) || (Ts.add(r), l = { rel: l, crossOrigin: u, href: n }, c.querySelector(r) === null && (n = c.createElement("link"), $l(n, "link", l), Ot(n), c.head.appendChild(n)));
    }
  }
  function L(l) {
    In.D(l), El("dns-prefetch", l, null);
  }
  function At(l, n) {
    In.C(l, n), El("preconnect", l, n);
  }
  function o1(l, n, u) {
    In.L(l, n, u);
    var c = Uf;
    if (c && l && n) {
      var r = 'link[rel="preload"][as="' + Xa(n) + '"]';
      n === "image" && u && u.imageSrcSet ? (r += '[imagesrcset="' + Xa(
        u.imageSrcSet
      ) + '"]', typeof u.imageSizes == "string" && (r += '[imagesizes="' + Xa(
        u.imageSizes
      ) + '"]')) : r += '[href="' + Xa(l) + '"]';
      var s = r;
      switch (n) {
        case "style":
          s = ln(l);
          break;
        case "script":
          s = oo(l);
      }
      Ha.has(s) || (l = w(
        {
          rel: "preload",
          href: n === "image" && u && u.imageSrcSet ? void 0 : l,
          as: n
        },
        u
      ), Ha.set(s, l), c.querySelector(r) !== null || n === "style" && c.querySelector(rc(s)) || n === "script" && c.querySelector(Bf(s)) || (n = c.createElement("link"), $l(n, "link", l), Ot(n), c.head.appendChild(n)));
    }
  }
  function hp(l, n) {
    In.m(l, n);
    var u = Uf;
    if (u && l) {
      var c = n && typeof n.as == "string" ? n.as : "script", r = 'link[rel="modulepreload"][as="' + Xa(c) + '"][href="' + Xa(l) + '"]', s = r;
      switch (c) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          s = oo(l);
      }
      if (!Ha.has(s) && (l = w({ rel: "modulepreload", href: l }, n), Ha.set(s, l), u.querySelector(r) === null)) {
        switch (c) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (u.querySelector(Bf(s)))
              return;
        }
        c = u.createElement("link"), $l(c, "link", l), Ot(c), u.head.appendChild(c);
      }
    }
  }
  function mp(l, n, u) {
    In.S(l, n, u);
    var c = Uf;
    if (c && l) {
      var r = Tc(c).hoistableStyles, s = ln(l);
      n = n || "default";
      var m = r.get(s);
      if (!m) {
        var v = { loading: 0, preload: null };
        if (m = c.querySelector(
          rc(s)
        ))
          v.loading = 5;
        else {
          l = w(
            { rel: "stylesheet", href: l, "data-precedence": n },
            u
          ), (u = Ha.get(s)) && Ch(l, u);
          var A = m = c.createElement("link");
          Ot(A), $l(A, "link", l), A._p = new Promise(function(j, V) {
            A.onload = j, A.onerror = V;
          }), A.addEventListener("load", function() {
            v.loading |= 1;
          }), A.addEventListener("error", function() {
            v.loading |= 2;
          }), v.loading |= 4, As(m, n, c);
        }
        m = {
          type: "stylesheet",
          instance: m,
          count: 1,
          state: v
        }, r.set(s, m);
      }
    }
  }
  function vi(l, n) {
    In.X(l, n);
    var u = Uf;
    if (u && l) {
      var c = Tc(u).hoistableScripts, r = oo(l), s = c.get(r);
      s || (s = u.querySelector(Bf(r)), s || (l = w({ src: l, async: !0 }, n), (n = Ha.get(r)) && Uh(l, n), s = u.createElement("script"), Ot(s), $l(s, "link", l), u.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, c.set(r, s));
    }
  }
  function fc(l, n) {
    In.M(l, n);
    var u = Uf;
    if (u && l) {
      var c = Tc(u).hoistableScripts, r = oo(l), s = c.get(r);
      s || (s = u.querySelector(Bf(r)), s || (l = w({ src: l, async: !0, type: "module" }, n), (n = Ha.get(r)) && Uh(l, n), s = u.createElement("script"), Ot(s), $l(s, "link", l), u.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, c.set(r, s));
    }
  }
  function Hf(l, n, u, c) {
    var r = (r = Xe.current) ? na(r) : null;
    if (!r) throw Error(M(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof u.precedence == "string" && typeof u.href == "string" ? (n = ln(u.href), u = Tc(
          r
        ).hoistableStyles, c = u.get(n), c || (c = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, u.set(n, c)), c) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (u.rel === "stylesheet" && typeof u.href == "string" && typeof u.precedence == "string") {
          l = ln(u.href);
          var s = Tc(
            r
          ).hoistableStyles, m = s.get(l);
          if (m || (r = r.ownerDocument || r, m = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, s.set(l, m), (s = r.querySelector(
            rc(l)
          )) && !s._p && (m.instance = s, m.state.loading = 5), Ha.has(l) || (u = {
            rel: "preload",
            as: "style",
            href: u.href,
            crossOrigin: u.crossOrigin,
            integrity: u.integrity,
            media: u.media,
            hrefLang: u.hrefLang,
            referrerPolicy: u.referrerPolicy
          }, Ha.set(l, u), s || wg(
            r,
            l,
            u,
            m.state
          ))), n && c === null)
            throw Error(M(528, ""));
          return m;
        }
        if (n && c !== null)
          throw Error(M(529, ""));
        return null;
      case "script":
        return n = u.async, u = u.src, typeof u == "string" && n && typeof n != "function" && typeof n != "symbol" ? (n = oo(u), u = Tc(
          r
        ).hoistableScripts, c = u.get(n), c || (c = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, u.set(n, c)), c) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(M(444, l));
    }
  }
  function ln(l) {
    return 'href="' + Xa(l) + '"';
  }
  function rc(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function Nf(l) {
    return w({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function wg(l, n, u, c) {
    l.querySelector('link[rel="preload"][as="style"][' + n + "]") ? c.loading = 1 : (n = l.createElement("link"), c.preload = n, n.addEventListener("load", function() {
      return c.loading |= 1;
    }), n.addEventListener("error", function() {
      return c.loading |= 2;
    }), $l(n, "link", u), Ot(n), l.head.appendChild(n));
  }
  function oo(l) {
    return '[src="' + Xa(l) + '"]';
  }
  function Bf(l) {
    return "script[async]" + l;
  }
  function yp(l, n, u) {
    if (n.count++, n.instance === null)
      switch (n.type) {
        case "style":
          var c = l.querySelector(
            'style[data-href~="' + Xa(u.href) + '"]'
          );
          if (c)
            return n.instance = c, Ot(c), c;
          var r = w({}, u, {
            "data-href": u.href,
            "data-precedence": u.precedence,
            href: null,
            precedence: null
          });
          return c = (l.ownerDocument || l).createElement(
            "style"
          ), Ot(c), $l(c, "style", r), As(c, u.precedence, l), n.instance = c;
        case "stylesheet":
          r = ln(u.href);
          var s = l.querySelector(
            rc(r)
          );
          if (s)
            return n.state.loading |= 4, n.instance = s, Ot(s), s;
          c = Nf(u), (r = Ha.get(r)) && Ch(c, r), s = (l.ownerDocument || l).createElement("link"), Ot(s);
          var m = s;
          return m._p = new Promise(function(v, A) {
            m.onload = v, m.onerror = A;
          }), $l(s, "link", c), n.state.loading |= 4, As(s, u.precedence, l), n.instance = s;
        case "script":
          return s = oo(u.src), (r = l.querySelector(
            Bf(s)
          )) ? (n.instance = r, Ot(r), r) : (c = u, (r = Ha.get(s)) && (c = w({}, u), Uh(c, r)), l = l.ownerDocument || l, r = l.createElement("script"), Ot(r), $l(r, "link", c), l.head.appendChild(r), n.instance = r);
        case "void":
          return null;
        default:
          throw Error(M(443, n.type));
      }
    else
      n.type === "stylesheet" && (n.state.loading & 4) === 0 && (c = n.instance, n.state.loading |= 4, As(c, u.precedence, l));
    return n.instance;
  }
  function As(l, n, u) {
    for (var c = u.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), r = c.length ? c[c.length - 1] : null, s = r, m = 0; m < c.length; m++) {
      var v = c[m];
      if (v.dataset.precedence === n) s = v;
      else if (s !== r) break;
    }
    s ? s.parentNode.insertBefore(l, s.nextSibling) : (n = u.nodeType === 9 ? u.head : u, n.insertBefore(l, n.firstChild));
  }
  function Ch(l, n) {
    l.crossOrigin == null && (l.crossOrigin = n.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = n.referrerPolicy), l.title == null && (l.title = n.title);
  }
  function Uh(l, n) {
    l.crossOrigin == null && (l.crossOrigin = n.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = n.referrerPolicy), l.integrity == null && (l.integrity = n.integrity);
  }
  var Yf = null;
  function pp(l, n, u) {
    if (Yf === null) {
      var c = /* @__PURE__ */ new Map(), r = Yf = /* @__PURE__ */ new Map();
      r.set(u, c);
    } else
      r = Yf, c = r.get(u), c || (c = /* @__PURE__ */ new Map(), r.set(u, c));
    if (c.has(l)) return c;
    for (c.set(l, null), u = u.getElementsByTagName(l), r = 0; r < u.length; r++) {
      var s = u[r];
      if (!(s[ou] || s[Ct] || l === "link" && s.getAttribute("rel") === "stylesheet") && s.namespaceURI !== "http://www.w3.org/2000/svg") {
        var m = s.getAttribute(n) || "";
        m = l + m;
        var v = c.get(m);
        v ? v.push(s) : c.set(m, [s]);
      }
    }
    return c;
  }
  function Hh(l, n, u) {
    l = l.ownerDocument || l, l.head.insertBefore(
      u,
      n === "title" ? l.querySelector("head > title") : null
    );
  }
  function gp(l, n, u) {
    if (u === 1 || n.itemProp != null) return !1;
    switch (l) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof n.precedence != "string" || typeof n.href != "string" || n.href === "")
          break;
        return !0;
      case "link":
        if (typeof n.rel != "string" || typeof n.href != "string" || n.href === "" || n.onLoad || n.onError)
          break;
        switch (n.rel) {
          case "stylesheet":
            return l = n.disabled, typeof n.precedence == "string" && l == null;
          default:
            return !0;
        }
      case "script":
        if (n.async && typeof n.async != "function" && typeof n.async != "symbol" && !n.onLoad && !n.onError && n.src && typeof n.src == "string")
          return !0;
    }
    return !1;
  }
  function Na(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function Yu(l, n, u, c) {
    if (u.type === "stylesheet" && (typeof c.media != "string" || matchMedia(c.media).matches !== !1) && (u.state.loading & 4) === 0) {
      if (u.instance === null) {
        var r = ln(c.href), s = n.querySelector(
          rc(r)
        );
        if (s) {
          n = s._p, n !== null && typeof n == "object" && typeof n.then == "function" && (l.count++, l = Nh.bind(l), n.then(l, l)), u.state.loading |= 4, u.instance = s, Ot(s);
          return;
        }
        s = n.ownerDocument || n, c = Nf(c), (r = Ha.get(r)) && Ch(c, r), s = s.createElement("link"), Ot(s);
        var m = s;
        m._p = new Promise(function(v, A) {
          m.onload = v, m.onerror = A;
        }), $l(s, "link", c), u.instance = s;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(u, n), (n = u.state.preload) && (u.state.loading & 3) === 0 && (l.count++, u = Nh.bind(l), n.addEventListener("load", u), n.addEventListener("error", u));
    }
  }
  var an = 0;
  function vp(l, n) {
    return l.stylesheets && l.count === 0 && Yh(l, l.stylesheets), 0 < l.count || 0 < l.imgCount ? function(u) {
      var c = setTimeout(function() {
        if (l.stylesheets && Yh(l, l.stylesheets), l.unsuspend) {
          var s = l.unsuspend;
          l.unsuspend = null, s();
        }
      }, 6e4 + n);
      0 < l.imgBytes && an === 0 && (an = 62500 * fp());
      var r = setTimeout(
        function() {
          if (l.waitingForImages = !1, l.count === 0 && (l.stylesheets && Yh(l, l.stylesheets), l.unsuspend)) {
            var s = l.unsuspend;
            l.unsuspend = null, s();
          }
        },
        (l.imgBytes > an ? 50 : 800) + n
      );
      return l.unsuspend = u, function() {
        l.unsuspend = null, clearTimeout(c), clearTimeout(r);
      };
    } : null;
  }
  function Nh() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Yh(this, this.stylesheets);
      else if (this.unsuspend) {
        var l = this.unsuspend;
        this.unsuspend = null, l();
      }
    }
  }
  var Bh = null;
  function Yh(l, n) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Bh = /* @__PURE__ */ new Map(), n.forEach(wl, l), Bh = null, Nh.call(l));
  }
  function wl(l, n) {
    if (!(n.state.loading & 4)) {
      var u = Bh.get(l);
      if (u) var c = u.get(null);
      else {
        u = /* @__PURE__ */ new Map(), Bh.set(l, u);
        for (var r = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), s = 0; s < r.length; s++) {
          var m = r[s];
          (m.nodeName === "LINK" || m.getAttribute("media") !== "not all") && (u.set(m.dataset.precedence, m), c = m);
        }
        c && u.set(null, c);
      }
      r = n.instance, m = r.getAttribute("data-precedence"), s = u.get(m) || c, s === c && u.set(null, r), u.set(m, r), this.count++, c = Nh.bind(this), r.addEventListener("load", c), r.addEventListener("error", c), s ? s.parentNode.insertBefore(r, s.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(r, l.firstChild)), n.state.loading |= 4;
    }
  }
  var Os = {
    $$typeof: yt,
    Provider: null,
    Consumer: null,
    _currentValue: te,
    _currentValue2: te,
    _threadCount: 0
  };
  function Sp(l, n, u, c, r, s, m, v, A) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = dn(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = dn(0), this.hiddenUpdates = dn(null), this.identifierPrefix = c, this.onUncaughtError = r, this.onCaughtError = s, this.onRecoverableError = m, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = A, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function jh(l, n, u, c, r, s, m, v, A, j, V, k) {
    return l = new Sp(
      l,
      n,
      u,
      m,
      A,
      j,
      V,
      k,
      v
    ), n = 1, s === !0 && (n |= 24), s = cl(3, null, null, n), l.current = s, s.stateNode = l, n = Hr(), n.refCount++, l.pooledCache = n, n.refCount++, s.memoizedState = {
      element: c,
      isDehydrated: u,
      cache: n
    }, wr(s), l;
  }
  function fo(l) {
    return l ? (l = da, l) : da;
  }
  function Gg(l, n, u, c, r, s) {
    r = fo(r), c.context === null ? c.context = r : c.pendingContext = r, c = oi(n), c.payload = { element: u }, s = s === void 0 ? null : s, s !== null && (c.callback = s), u = ka(l, c, n), u !== null && (Ta(u, l, n), $i(u, l, n));
  }
  function qh(l, n) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var u = l.retryLane;
      l.retryLane = u !== 0 && u < n ? u : n;
    }
  }
  function bp(l, n) {
    qh(l, n), (l = l.alternate) && qh(l, n);
  }
  function Lg(l) {
    if (l.tag === 13 || l.tag === 31) {
      var n = ti(l, 67108864);
      n !== null && Ta(n, l, 67108864), bp(l, 67108864);
    }
  }
  function ro(l) {
    if (l.tag === 13 || l.tag === 31) {
      var n = Ua();
      n = Ps(n);
      var u = ti(l, n);
      u !== null && Ta(u, l, n), bp(l, n);
    }
  }
  var Dl = !0;
  function ju(l, n, u, c) {
    var r = D.T;
    D.T = null;
    var s = Z.p;
    try {
      Z.p = 2, kl(l, n, u, c);
    } finally {
      Z.p = s, D.T = r;
    }
  }
  function qu(l, n, u, c) {
    var r = D.T;
    D.T = null;
    var s = Z.p;
    try {
      Z.p = 8, kl(l, n, u, c);
    } finally {
      Z.p = s, D.T = r;
    }
  }
  function kl(l, n, u, c) {
    if (Dl) {
      var r = Ep(c);
      if (r === null)
        ap(
          l,
          n,
          c,
          xh,
          u
        ), Si(l, c);
      else if (f1(
        r,
        l,
        n,
        u,
        c
      ))
        c.stopPropagation();
      else if (Si(l, c), n & 4 && -1 < Oa.indexOf(l)) {
        for (; r !== null; ) {
          var s = Ec(r);
          if (s !== null)
            switch (s.tag) {
              case 3:
                if (s = s.stateNode, s.current.memoizedState.isDehydrated) {
                  var m = Ce(s.pendingLanes);
                  if (m !== 0) {
                    var v = s;
                    for (v.pendingLanes |= 2, v.entangledLanes |= 2; m; ) {
                      var A = 1 << 31 - Ul(m);
                      v.entanglements[1] |= A, m &= ~A;
                    }
                    Bu(s), (vt & 6) === 0 && (Tt = vl() + 500, gi(0));
                  }
                }
                break;
              case 31:
              case 13:
                v = ti(s, 2), v !== null && Ta(v, s, 2), Ef(), bp(s, 2);
            }
          if (s = Ep(c), s === null && ap(
            l,
            n,
            c,
            xh,
            u
          ), s === r) break;
          r = s;
        }
        r !== null && c.stopPropagation();
      } else
        ap(
          l,
          n,
          c,
          null,
          u
        );
    }
  }
  function Ep(l) {
    return l = fd(l), jf(l);
  }
  var xh = null;
  function jf(l) {
    if (xh = null, l = bc(l), l !== null) {
      var n = ce(l);
      if (n === null) l = null;
      else {
        var u = n.tag;
        if (u === 13) {
          if (l = we(n), l !== null) return l;
          l = null;
        } else if (u === 31) {
          if (l = F(n), l !== null) return l;
          l = null;
        } else if (u === 3) {
          if (n.stateNode.current.memoizedState.isDehydrated)
            return n.tag === 3 ? n.stateNode.containerInfo : null;
          l = null;
        } else n !== l && (l = null);
      }
    }
    return xh = l, null;
  }
  function Rs(l) {
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
        switch (Fs()) {
          case Mo:
            return 2;
          case Co:
            return 8;
          case Mn:
          case Is:
            return 32;
          case Uo:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var qf = !1, _l = null, Wl = null, ua = null, sc = /* @__PURE__ */ new Map(), Rn = /* @__PURE__ */ new Map(), Pt = [], Oa = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Si(l, n) {
    switch (l) {
      case "focusin":
      case "focusout":
        _l = null;
        break;
      case "dragenter":
      case "dragleave":
        Wl = null;
        break;
      case "mouseover":
      case "mouseout":
        ua = null;
        break;
      case "pointerover":
      case "pointerout":
        sc.delete(n.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Rn.delete(n.pointerId);
    }
  }
  function so(l, n, u, c, r, s) {
    return l === null || l.nativeEvent !== s ? (l = {
      blockedOn: n,
      domEventName: u,
      eventSystemFlags: c,
      nativeEvent: s,
      targetContainers: [r]
    }, n !== null && (n = Ec(n), n !== null && Lg(n)), l) : (l.eventSystemFlags |= c, n = l.targetContainers, r !== null && n.indexOf(r) === -1 && n.push(r), l);
  }
  function f1(l, n, u, c, r) {
    switch (n) {
      case "focusin":
        return _l = so(
          _l,
          l,
          n,
          u,
          c,
          r
        ), !0;
      case "dragenter":
        return Wl = so(
          Wl,
          l,
          n,
          u,
          c,
          r
        ), !0;
      case "mouseover":
        return ua = so(
          ua,
          l,
          n,
          u,
          c,
          r
        ), !0;
      case "pointerover":
        var s = r.pointerId;
        return sc.set(
          s,
          so(
            sc.get(s) || null,
            l,
            n,
            u,
            c,
            r
          )
        ), !0;
      case "gotpointercapture":
        return s = r.pointerId, Rn.set(
          s,
          so(
            Rn.get(s) || null,
            l,
            n,
            u,
            c,
            r
          )
        ), !0;
    }
    return !1;
  }
  function Xg(l) {
    var n = bc(l.target);
    if (n !== null) {
      var u = ce(n);
      if (u !== null) {
        if (n = u.tag, n === 13) {
          if (n = we(u), n !== null) {
            l.blockedOn = n, Em(l.priority, function() {
              ro(u);
            });
            return;
          }
        } else if (n === 31) {
          if (n = F(u), n !== null) {
            l.blockedOn = n, Em(l.priority, function() {
              ro(u);
            });
            return;
          }
        } else if (n === 3 && u.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = u.tag === 3 ? u.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function zs(l) {
    if (l.blockedOn !== null) return !1;
    for (var n = l.targetContainers; 0 < n.length; ) {
      var u = Ep(l.nativeEvent);
      if (u === null) {
        u = l.nativeEvent;
        var c = new u.constructor(
          u.type,
          u
        );
        od = c, u.target.dispatchEvent(c), od = null;
      } else
        return n = Ec(u), n !== null && Lg(n), l.blockedOn = u, !1;
      n.shift();
    }
    return !0;
  }
  function xf(l, n, u) {
    zs(l) && u.delete(n);
  }
  function Qg() {
    qf = !1, _l !== null && zs(_l) && (_l = null), Wl !== null && zs(Wl) && (Wl = null), ua !== null && zs(ua) && (ua = null), sc.forEach(xf), Rn.forEach(xf);
  }
  function xu(l, n) {
    l.blockedOn === n && (l.blockedOn = null, qf || (qf = !0, C.unstable_scheduleCallback(
      C.unstable_NormalPriority,
      Qg
    )));
  }
  var wf = null;
  function Vg(l) {
    wf !== l && (wf = l, C.unstable_scheduleCallback(
      C.unstable_NormalPriority,
      function() {
        wf === l && (wf = null);
        for (var n = 0; n < l.length; n += 3) {
          var u = l[n], c = l[n + 1], r = l[n + 2];
          if (typeof c != "function") {
            if (jf(c || u) === null)
              continue;
            break;
          }
          var s = Ec(u);
          s !== null && (l.splice(n, 3), n -= 3, of(
            s,
            {
              pending: !0,
              data: r,
              method: u.method,
              action: c
            },
            c,
            r
          ));
        }
      }
    ));
  }
  function Gf(l) {
    function n(A) {
      return xu(A, l);
    }
    _l !== null && xu(_l, l), Wl !== null && xu(Wl, l), ua !== null && xu(ua, l), sc.forEach(n), Rn.forEach(n);
    for (var u = 0; u < Pt.length; u++) {
      var c = Pt[u];
      c.blockedOn === l && (c.blockedOn = null);
    }
    for (; 0 < Pt.length && (u = Pt[0], u.blockedOn === null); )
      Xg(u), u.blockedOn === null && Pt.shift();
    if (u = (l.ownerDocument || l).$$reactFormReplay, u != null)
      for (c = 0; c < u.length; c += 3) {
        var r = u[c], s = u[c + 1], m = r[fa] || null;
        if (typeof s == "function")
          m || Vg(u);
        else if (m) {
          var v = null;
          if (s && s.hasAttribute("formAction")) {
            if (r = s, m = s[fa] || null)
              v = m.formAction;
            else if (jf(r) !== null) continue;
          } else v = m.action;
          typeof v == "function" ? u[c + 1] = v : (u.splice(c, 3), c -= 3), Vg(u);
        }
      }
  }
  function Tp() {
    function l(s) {
      s.canIntercept && s.info === "react-transition" && s.intercept({
        handler: function() {
          return new Promise(function(m) {
            return r = m;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function n() {
      r !== null && (r(), r = null), c || setTimeout(u, 20);
    }
    function u() {
      if (!c && !navigation.transition) {
        var s = navigation.currentEntry;
        s && s.url != null && navigation.navigate(s.url, {
          state: s.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var c = !1, r = null;
      return navigation.addEventListener("navigate", l), navigation.addEventListener("navigatesuccess", n), navigation.addEventListener("navigateerror", n), setTimeout(u, 100), function() {
        c = !0, navigation.removeEventListener("navigate", l), navigation.removeEventListener("navigatesuccess", n), navigation.removeEventListener("navigateerror", n), r !== null && (r(), r = null);
      };
    }
  }
  function wh(l) {
    this._internalRoot = l;
  }
  Gh.prototype.render = wh.prototype.render = function(l) {
    var n = this._internalRoot;
    if (n === null) throw Error(M(409));
    var u = n.current, c = Ua();
    Gg(u, c, l, n, null, null);
  }, Gh.prototype.unmount = wh.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var n = l.containerInfo;
      Gg(l.current, 2, null, l, null, null), Ef(), n[Ui] = null;
    }
  };
  function Gh(l) {
    this._internalRoot = l;
  }
  Gh.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var n = ed();
      l = { blockedOn: null, target: l, priority: n };
      for (var u = 0; u < Pt.length && n !== 0 && n < Pt[u].priority; u++) ;
      Pt.splice(u, 0, l), u === 0 && Xg(l);
    }
  };
  var Ap = Q.version;
  if (Ap !== "19.2.6")
    throw Error(
      M(
        527,
        Ap,
        "19.2.6"
      )
    );
  Z.findDOMNode = function(l) {
    var n = l._reactInternals;
    if (n === void 0)
      throw typeof l.render == "function" ? Error(M(188)) : (l = Object.keys(l).join(","), Error(M(268, l)));
    return l = K(n), l = l !== null ? Ae(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var Zg = {
    bundleType: 0,
    version: "19.2.6",
    rendererPackageName: "react-dom",
    currentDispatcherRef: D,
    reconcilerVersion: "19.2.6"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ds = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ds.isDisabled && Ds.supportsFiber)
      try {
        sn = Ds.inject(
          Zg
        ), Al = Ds;
      } catch {
      }
  }
  return g0.createRoot = function(l, n) {
    if (!ie(l)) throw Error(M(299));
    var u = !1, c = "", r = Fd, s = Oy, m = Id;
    return n != null && (n.unstable_strictMode === !0 && (u = !0), n.identifierPrefix !== void 0 && (c = n.identifierPrefix), n.onUncaughtError !== void 0 && (r = n.onUncaughtError), n.onCaughtError !== void 0 && (s = n.onCaughtError), n.onRecoverableError !== void 0 && (m = n.onRecoverableError)), n = jh(
      l,
      1,
      !1,
      null,
      null,
      u,
      c,
      null,
      r,
      s,
      m,
      Tp
    ), l[Ui] = n.current, Df(l), new wh(n);
  }, g0.hydrateRoot = function(l, n, u) {
    if (!ie(l)) throw Error(M(299));
    var c = !1, r = "", s = Fd, m = Oy, v = Id, A = null;
    return u != null && (u.unstable_strictMode === !0 && (c = !0), u.identifierPrefix !== void 0 && (r = u.identifierPrefix), u.onUncaughtError !== void 0 && (s = u.onUncaughtError), u.onCaughtError !== void 0 && (m = u.onCaughtError), u.onRecoverableError !== void 0 && (v = u.onRecoverableError), u.formState !== void 0 && (A = u.formState)), n = jh(
      l,
      1,
      !0,
      n,
      u ?? null,
      c,
      r,
      A,
      s,
      m,
      v,
      Tp
    ), n.context = fo(null), u = n.current, c = Ua(), c = Ps(c), r = oi(c), r.callback = null, ka(u, r, c), u = c, n.current.lanes = u, Ci(n, u), Bu(n), l[Ui] = n.current, Df(l), new Gh(n);
  }, g0.version = "19.2.6", g0;
}
var v0 = {};
/**
 * @license React
 * react-dom-client.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var K2;
function xT() {
  return K2 || (K2 = 1, process.env.NODE_ENV !== "production" && (function() {
    function C(e, t) {
      for (e = e.memoizedState; e !== null && 0 < t; )
        e = e.next, t--;
      return e;
    }
    function Q(e, t, a, i) {
      if (a >= t.length) return i;
      var o = t[a], f = El(e) ? e.slice() : Ie({}, e);
      return f[o] = Q(e[o], t, a + 1, i), f;
    }
    function ne(e, t, a) {
      if (t.length !== a.length)
        console.warn("copyWithRename() expects paths of the same length");
      else {
        for (var i = 0; i < a.length - 1; i++)
          if (t[i] !== a[i]) {
            console.warn(
              "copyWithRename() expects paths to be the same except for the deepest key"
            );
            return;
          }
        return M(e, t, a, 0);
      }
    }
    function M(e, t, a, i) {
      var o = t[i], f = El(e) ? e.slice() : Ie({}, e);
      return i + 1 === t.length ? (f[a[i]] = f[o], El(f) ? f.splice(o, 1) : delete f[o]) : f[o] = M(
        e[o],
        t,
        a,
        i + 1
      ), f;
    }
    function ie(e, t, a) {
      var i = t[a], o = El(e) ? e.slice() : Ie({}, e);
      return a + 1 === t.length ? (El(o) ? o.splice(i, 1) : delete o[i], o) : (o[i] = ie(e[i], t, a + 1), o);
    }
    function ce() {
      return !1;
    }
    function we() {
      return null;
    }
    function F() {
      console.error(
        "Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://react.dev/link/rules-of-hooks"
      );
    }
    function le() {
      console.error(
        "Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."
      );
    }
    function K() {
    }
    function Ae() {
    }
    function w(e) {
      var t = [];
      return e.forEach(function(a) {
        t.push(a);
      }), t.sort().join(", ");
    }
    function N(e, t, a, i) {
      return new t1(e, t, a, i);
    }
    function fe(e, t) {
      e.context === Vf && (Oh(e.current, 2, t, e, null, null), en());
    }
    function Ze(e, t) {
      if (Lu !== null) {
        var a = t.staleFamilies;
        t = t.updatedFamilies, ns(), j0(
          e.current,
          t,
          a
        ), en();
      }
    }
    function bt(e) {
      Lu = e;
    }
    function it(e) {
      return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
    }
    function Fe(e) {
      var t = e, a = e;
      if (e.alternate) for (; t.return; ) t = t.return;
      else {
        e = t;
        do
          t = e, (t.flags & 4098) !== 0 && (a = t.return), e = t.return;
        while (e);
      }
      return t.tag === 3 ? a : null;
    }
    function kt(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
      }
      return null;
    }
    function yt(e) {
      if (e.tag === 31) {
        var t = e.memoizedState;
        if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
      }
      return null;
    }
    function Mt(e) {
      if (Fe(e) !== e)
        throw Error("Unable to find node on an unmounted component.");
    }
    function jt(e) {
      var t = e.alternate;
      if (!t) {
        if (t = Fe(e), t === null)
          throw Error("Unable to find node on an unmounted component.");
        return t !== e ? null : e;
      }
      for (var a = e, i = t; ; ) {
        var o = a.return;
        if (o === null) break;
        var f = o.alternate;
        if (f === null) {
          if (i = o.return, i !== null) {
            a = i;
            continue;
          }
          break;
        }
        if (o.child === f.child) {
          for (f = o.child; f; ) {
            if (f === a) return Mt(o), e;
            if (f === i) return Mt(o), t;
            f = f.sibling;
          }
          throw Error("Unable to find node on an unmounted component.");
        }
        if (a.return !== i.return) a = o, i = f;
        else {
          for (var d = !1, h = o.child; h; ) {
            if (h === a) {
              d = !0, a = o, i = f;
              break;
            }
            if (h === i) {
              d = !0, i = o, a = f;
              break;
            }
            h = h.sibling;
          }
          if (!d) {
            for (h = f.child; h; ) {
              if (h === a) {
                d = !0, a = f, i = o;
                break;
              }
              if (h === i) {
                d = !0, i = f, a = o;
                break;
              }
              h = h.sibling;
            }
            if (!d)
              throw Error(
                "Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue."
              );
          }
        }
        if (a.alternate !== i)
          throw Error(
            "Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue."
          );
      }
      if (a.tag !== 3)
        throw Error("Unable to find node on an unmounted component.");
      return a.stateNode.current === a ? e : t;
    }
    function qt(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e;
      for (e = e.child; e !== null; ) {
        if (t = qt(e), t !== null) return t;
        e = e.sibling;
      }
      return null;
    }
    function De(e) {
      return e === null || typeof e != "object" ? null : (e = xg && e[xg] || e["@@iterator"], typeof e == "function" ? e : null);
    }
    function Ge(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === Uf ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case Mf:
          return "Fragment";
        case Es:
          return "Profiler";
        case Aa:
          return "StrictMode";
        case co:
          return "Suspense";
        case Ha:
          return "SuspenseList";
        case In:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case oc:
            return "Portal";
          case Fn:
            return e.displayName || "Context";
          case Mh:
            return (e._context.displayName || "Context") + ".Consumer";
          case Cf:
            var t = e.render;
            return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case Ts:
            return t = e.displayName || null, t !== null ? t : Ge(e.type) || "Memo";
          case na:
            t = e._payload, e = e._init;
            try {
              return Ge(e(t));
            } catch {
            }
        }
      return null;
    }
    function Ye(e) {
      return typeof e.tag == "number" ? re(e) : typeof e.name == "string" ? e.name : null;
    }
    function re(e) {
      var t = e.type;
      switch (e.tag) {
        case 31:
          return "Activity";
        case 24:
          return "Cache";
        case 9:
          return (t._context.displayName || "Context") + ".Consumer";
        case 10:
          return t.displayName || "Context";
        case 18:
          return "DehydratedFragment";
        case 11:
          return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
        case 7:
          return "Fragment";
        case 26:
        case 27:
        case 5:
          return t;
        case 4:
          return "Portal";
        case 3:
          return "Root";
        case 6:
          return "Text";
        case 16:
          return Ge(t);
        case 8:
          return t === Aa ? "StrictMode" : "Mode";
        case 22:
          return "Offscreen";
        case 12:
          return "Profiler";
        case 21:
          return "Scope";
        case 13:
          return "Suspense";
        case 19:
          return "SuspenseList";
        case 25:
          return "TracingMarker";
        case 1:
        case 0:
        case 14:
        case 15:
          if (typeof t == "function")
            return t.displayName || t.name || null;
          if (typeof t == "string") return t;
          break;
        case 29:
          if (t = e._debugInfo, t != null) {
            for (var a = t.length - 1; 0 <= a; a--)
              if (typeof t[a].name == "string") return t[a].name;
          }
          if (e.return !== null)
            return re(e.return);
      }
      return null;
    }
    function xt(e) {
      return { current: e };
    }
    function ve(e, t) {
      0 > vi ? console.error("Unexpected pop.") : (t !== mp[vi] && console.error("Unexpected Fiber popped."), e.current = hp[vi], hp[vi] = null, mp[vi] = null, vi--);
    }
    function Le(e, t, a) {
      vi++, hp[vi] = e.current, mp[vi] = a, e.current = t;
    }
    function Zt(e) {
      return e === null && console.error(
        "Expected host context to exist. This error is likely caused by a bug in React. Please file an issue."
      ), e;
    }
    function wt(e, t) {
      Le(ln, t, e), Le(Hf, e, e), Le(fc, null, e);
      var a = t.nodeType;
      switch (a) {
        case 9:
        case 11:
          a = a === 9 ? "#document" : "#fragment", t = (t = t.documentElement) && (t = t.namespaceURI) ? sg(t) : zo;
          break;
        default:
          if (a = t.tagName, t = t.namespaceURI)
            t = sg(t), t = yi(
              t,
              a
            );
          else
            switch (a) {
              case "svg":
                t = pm;
                break;
              case "math":
                t = jv;
                break;
              default:
                t = zo;
            }
      }
      a = a.toLowerCase(), a = Rm(null, a), a = {
        context: t,
        ancestorInfo: a
      }, ve(fc, e), Le(fc, a, e);
    }
    function D(e) {
      ve(fc, e), ve(Hf, e), ve(ln, e);
    }
    function Z() {
      return Zt(fc.current);
    }
    function te(e) {
      e.memoizedState !== null && Le(rc, e, e);
      var t = Zt(fc.current), a = e.type, i = yi(t.context, a);
      a = Rm(t.ancestorInfo, a), i = { context: i, ancestorInfo: a }, t !== i && (Le(Hf, e, e), Le(fc, i, e));
    }
    function Se(e) {
      Hf.current === e && (ve(fc, e), ve(Hf, e)), rc.current === e && (ve(rc, e), d0._currentValue = Ws);
    }
    function _e() {
    }
    function S() {
      if (Nf === 0) {
        wg = console.log, oo = console.info, Bf = console.warn, yp = console.error, As = console.group, Ch = console.groupCollapsed, Uh = console.groupEnd;
        var e = {
          configurable: !0,
          enumerable: !0,
          value: _e,
          writable: !0
        };
        Object.defineProperties(console, {
          info: e,
          log: e,
          warn: e,
          error: e,
          group: e,
          groupCollapsed: e,
          groupEnd: e
        });
      }
      Nf++;
    }
    function Y() {
      if (Nf--, Nf === 0) {
        var e = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: Ie({}, e, { value: wg }),
          info: Ie({}, e, { value: oo }),
          warn: Ie({}, e, { value: Bf }),
          error: Ie({}, e, { value: yp }),
          group: Ie({}, e, { value: As }),
          groupCollapsed: Ie({}, e, { value: Ch }),
          groupEnd: Ie({}, e, { value: Uh })
        });
      }
      0 > Nf && console.error(
        "disabledDepth fell below zero. This is a bug in React. Please file an issue."
      );
    }
    function P(e) {
      var t = Error.prepareStackTrace;
      if (Error.prepareStackTrace = void 0, e = e.stack, Error.prepareStackTrace = t, e.startsWith(`Error: react-stack-top-frame
`) && (e = e.slice(29)), t = e.indexOf(`
`), t !== -1 && (e = e.slice(t + 1)), t = e.indexOf("react_stack_bottom_frame"), t !== -1 && (t = e.lastIndexOf(
        `
`,
        t
      )), t !== -1)
        e = e.slice(0, t);
      else return "";
      return e;
    }
    function I(e) {
      if (Yf === void 0)
        try {
          throw Error();
        } catch (a) {
          var t = a.stack.trim().match(/\n( *(at )?)/);
          Yf = t && t[1] || "", pp = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + Yf + e + pp;
    }
    function Ee(e, t) {
      if (!e || Hh) return "";
      var a = gp.get(e);
      if (a !== void 0) return a;
      Hh = !0, a = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var i = null;
      i = L.H, L.H = null, S();
      try {
        var o = {
          DetermineComponentFrameRoot: function() {
            try {
              if (t) {
                var E = function() {
                  throw Error();
                };
                if (Object.defineProperty(E.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(E, []);
                  } catch (ue) {
                    var x = ue;
                  }
                  Reflect.construct(e, [], E);
                } else {
                  try {
                    E.call();
                  } catch (ue) {
                    x = ue;
                  }
                  e.call(E.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (ue) {
                  x = ue;
                }
                (E = e()) && typeof E.catch == "function" && E.catch(function() {
                });
              }
            } catch (ue) {
              if (ue && x && typeof ue.stack == "string")
                return [ue.stack, x.stack];
            }
            return [null, null];
          }
        };
        o.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var f = Object.getOwnPropertyDescriptor(
          o.DetermineComponentFrameRoot,
          "name"
        );
        f && f.configurable && Object.defineProperty(
          o.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var d = o.DetermineComponentFrameRoot(), h = d[0], y = d[1];
        if (h && y) {
          var p = h.split(`
`), R = y.split(`
`);
          for (d = f = 0; f < p.length && !p[f].includes(
            "DetermineComponentFrameRoot"
          ); )
            f++;
          for (; d < R.length && !R[d].includes(
            "DetermineComponentFrameRoot"
          ); )
            d++;
          if (f === p.length || d === R.length)
            for (f = p.length - 1, d = R.length - 1; 1 <= f && 0 <= d && p[f] !== R[d]; )
              d--;
          for (; 1 <= f && 0 <= d; f--, d--)
            if (p[f] !== R[d]) {
              if (f !== 1 || d !== 1)
                do
                  if (f--, d--, 0 > d || p[f] !== R[d]) {
                    var _ = `
` + p[f].replace(
                      " at new ",
                      " at "
                    );
                    return e.displayName && _.includes("<anonymous>") && (_ = _.replace("<anonymous>", e.displayName)), typeof e == "function" && gp.set(e, _), _;
                  }
                while (1 <= f && 0 <= d);
              break;
            }
        }
      } finally {
        Hh = !1, L.H = i, Y(), Error.prepareStackTrace = a;
      }
      return p = (p = e ? e.displayName || e.name : "") ? I(p) : "", typeof e == "function" && gp.set(e, p), p;
    }
    function Xe(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return I(e.type);
        case 16:
          return I("Lazy");
        case 13:
          return e.child !== t && t !== null ? I("Suspense Fallback") : I("Suspense");
        case 19:
          return I("SuspenseList");
        case 0:
        case 15:
          return Ee(e.type, !1);
        case 11:
          return Ee(e.type.render, !1);
        case 1:
          return Ee(e.type, !0);
        case 31:
          return I("Activity");
        default:
          return "";
      }
    }
    function Re(e) {
      try {
        var t = "", a = null;
        do {
          t += Xe(e, a);
          var i = e._debugInfo;
          if (i)
            for (var o = i.length - 1; 0 <= o; o--) {
              var f = i[o];
              if (typeof f.name == "string") {
                var d = t;
                e: {
                  var h = f.name, y = f.env, p = f.debugLocation;
                  if (p != null) {
                    var R = P(p), _ = R.lastIndexOf(`
`), E = _ === -1 ? R : R.slice(_ + 1);
                    if (E.indexOf(h) !== -1) {
                      var x = `
` + E;
                      break e;
                    }
                  }
                  x = I(
                    h + (y ? " [" + y + "]" : "")
                  );
                }
                t = d + x;
              }
            }
          a = e, e = e.return;
        } while (e);
        return t;
      } catch (ue) {
        return `
Error generating stack: ` + ue.message + `
` + ue.stack;
      }
    }
    function Jt(e) {
      return (e = e ? e.displayName || e.name : "") ? I(e) : "";
    }
    function pt() {
      if (Na === null) return null;
      var e = Na._debugOwner;
      return e != null ? Ye(e) : null;
    }
    function qa() {
      if (Na === null) return "";
      var e = Na;
      try {
        var t = "";
        switch (e.tag === 6 && (e = e.return), e.tag) {
          case 26:
          case 27:
          case 5:
            t += I(e.type);
            break;
          case 13:
            t += I("Suspense");
            break;
          case 19:
            t += I("SuspenseList");
            break;
          case 31:
            t += I("Activity");
            break;
          case 30:
          case 0:
          case 15:
          case 1:
            e._debugOwner || t !== "" || (t += Jt(
              e.type
            ));
            break;
          case 11:
            e._debugOwner || t !== "" || (t += Jt(
              e.type.render
            ));
        }
        for (; e; )
          if (typeof e.tag == "number") {
            var a = e;
            e = a._debugOwner;
            var i = a._debugStack;
            if (e && i) {
              var o = P(i);
              o !== "" && (t += `
` + o);
            }
          } else if (e.debugStack != null) {
            var f = e.debugStack;
            (e = e.owner) && f && (t += `
` + P(f));
          } else break;
        var d = t;
      } catch (h) {
        d = `
Error generating stack: ` + h.message + `
` + h.stack;
      }
      return d;
    }
    function se(e, t, a, i, o, f, d) {
      var h = Na;
      zi(e);
      try {
        return e !== null && e._debugTask ? e._debugTask.run(
          t.bind(null, a, i, o, f, d)
        ) : t(a, i, o, f, d);
      } finally {
        zi(h);
      }
      throw Error(
        "runWithFiberInDEV should never be called in production. This is a bug in React."
      );
    }
    function zi(e) {
      L.getCurrentStack = e === null ? null : qa, Yu = !1, Na = e;
    }
    function Di(e) {
      return typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
    }
    function xa(e) {
      try {
        return uu(e), !1;
      } catch {
        return !0;
      }
    }
    function uu(e) {
      return "" + e;
    }
    function gt(e, t) {
      if (xa(e))
        return console.error(
          "The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before using it here.",
          t,
          Di(e)
        ), uu(e);
    }
    function Pl(e, t) {
      if (xa(e))
        return console.error(
          "The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before using it here.",
          t,
          Di(e)
        ), uu(e);
    }
    function gc(e) {
      if (xa(e))
        return console.error(
          "Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before using it here.",
          Di(e)
        ), uu(e);
    }
    function rr(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u") return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled) return !0;
      if (!t.supportsFiber)
        return console.error(
          "The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://react.dev/link/react-devtools"
        ), !0;
      try {
        ro = t.inject(e), Dl = t;
      } catch (a) {
        console.error("React instrumentation encountered an error: %o.", a);
      }
      return !!t.checkDCE;
    }
    function me(e) {
      if (typeof bp == "function" && Lg(e), Dl && typeof Dl.setStrictMode == "function")
        try {
          Dl.setStrictMode(ro, e);
        } catch (t) {
          ju || (ju = !0, console.error(
            "React instrumentation encountered an error: %o",
            t
          ));
        }
    }
    function _i(e) {
      return e >>>= 0, e === 0 ? 32 : 31 - (Ep(e) / xh | 0) | 0;
    }
    function iu(e) {
      var t = e & 42;
      if (t !== 0) return t;
      switch (e & -e) {
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
          return e & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return e & 62914560;
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
          return console.error(
            "Should have found matching lanes. This is a bug in React."
          ), e;
      }
    }
    function vc(e, t, a) {
      var i = e.pendingLanes;
      if (i === 0) return 0;
      var o = 0, f = e.suspendedLanes, d = e.pingedLanes;
      e = e.warmLanes;
      var h = i & 134217727;
      return h !== 0 ? (i = h & ~f, i !== 0 ? o = iu(i) : (d &= h, d !== 0 ? o = iu(d) : a || (a = h & ~e, a !== 0 && (o = iu(a))))) : (h = i & ~f, h !== 0 ? o = iu(h) : d !== 0 ? o = iu(d) : a || (a = i & ~e, a !== 0 && (o = iu(a)))), o === 0 ? 0 : t !== 0 && t !== o && (t & f) === 0 && (f = o & -o, a = t & -t, f >= a || f === 32 && (a & 4194048) !== 0) ? t : o;
    }
    function vl(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function Fs(e, t) {
      switch (e) {
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
          return console.error(
            "Should have found matching lanes. This is a bug in React."
          ), -1;
      }
    }
    function Mo() {
      var e = qf;
      return qf <<= 1, (qf & 62914560) === 0 && (qf = 4194304), e;
    }
    function Co(e) {
      for (var t = [], a = 0; 31 > a; a++) t.push(e);
      return t;
    }
    function Mn(e, t) {
      e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
    }
    function Is(e, t, a, i, o, f) {
      var d = e.pendingLanes;
      e.pendingLanes = a, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= a, e.entangledLanes &= a, e.errorRecoveryDisabledLanes &= a, e.shellSuspendCounter = 0;
      var h = e.entanglements, y = e.expirationTimes, p = e.hiddenUpdates;
      for (a = d & ~a; 0 < a; ) {
        var R = 31 - kl(a), _ = 1 << R;
        h[R] = 0, y[R] = -1;
        var E = p[R];
        if (E !== null)
          for (p[R] = null, R = 0; R < E.length; R++) {
            var x = E[R];
            x !== null && (x.lane &= -536870913);
          }
        a &= ~_;
      }
      i !== 0 && Uo(e, i, 0), f !== 0 && o === 0 && e.tag !== 0 && (e.suspendedLanes |= f & ~(d & ~t));
    }
    function Uo(e, t, a) {
      e.pendingLanes |= t, e.suspendedLanes &= ~t;
      var i = 31 - kl(t);
      e.entangledLanes |= t, e.entanglements[i] = e.entanglements[i] | 1073741824 | a & 261930;
    }
    function sr(e, t) {
      var a = e.entangledLanes |= t;
      for (e = e.entanglements; a; ) {
        var i = 31 - kl(a), o = 1 << i;
        o & t | e[i] & t && (e[i] |= t), a &= ~o;
      }
    }
    function Sc(e, t) {
      var a = t & -t;
      return a = (a & 42) !== 0 ? 1 : sn(a), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a;
    }
    function sn(e) {
      switch (e) {
        case 2:
          e = 1;
          break;
        case 8:
          e = 4;
          break;
        case 32:
          e = 16;
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
          e = 128;
          break;
        case 268435456:
          e = 134217728;
          break;
        default:
          e = 0;
      }
      return e;
    }
    function Al(e, t, a) {
      if (qu)
        for (e = e.pendingUpdatersLaneMap; 0 < a; ) {
          var i = 31 - kl(a), o = 1 << i;
          e[i].add(t), a &= ~o;
        }
    }
    function wa(e, t) {
      if (qu)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; 0 < t; ) {
          var o = 31 - kl(t);
          e = 1 << o, o = a[o], 0 < o.size && (o.forEach(function(f) {
            var d = f.alternate;
            d !== null && i.has(d) || i.add(f);
          }), o.clear()), t &= ~e;
        }
    }
    function Ul(e) {
      return e &= -e, _l < e ? Wl < e ? (e & 134217727) !== 0 ? ua : sc : Wl : _l;
    }
    function Mi() {
      var e = At.p;
      return e !== 0 ? e : (e = window.event, e === void 0 ? ua : zh(e.type));
    }
    function g(e, t) {
      var a = At.p;
      try {
        return At.p = e, t();
      } finally {
        At.p = a;
      }
    }
    function U(e) {
      delete e[Pt], delete e[Oa], delete e[so], delete e[f1], delete e[Xg];
    }
    function ee(e) {
      var t = e[Pt];
      if (t) return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[Si] || a[Pt]) {
          if (a = t.alternate, t.child !== null || a !== null && a.child !== null)
            for (e = ao(e); e !== null; ) {
              if (a = e[Pt])
                return a;
              e = ao(e);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function ae(e) {
      if (e = e[Pt] || e[Si]) {
        var t = e.tag;
        if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
          return e;
      }
      return null;
    }
    function ye(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6)
        return e.stateNode;
      throw Error("getNodeFromInstance: Invalid argument.");
    }
    function Ce(e) {
      var t = e[zs];
      return t || (t = e[zs] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
    }
    function pe(e) {
      e[xf] = !0;
    }
    function lt(e, t) {
      Qe(e, t), Qe(e + "Capture", t);
    }
    function Qe(e, t) {
      xu[e] && console.error(
        "EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.",
        e
      ), xu[e] = t;
      var a = e.toLowerCase();
      for (wf[a] = e, e === "onDoubleClick" && (wf.ondblclick = e), e = 0; e < t.length; e++)
        Qg.add(t[e]);
    }
    function ea(e, t) {
      Vg[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || console.error(
        e === "select" ? "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set `onChange`." : "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."
      ), t.onChange || t.readOnly || t.disabled || t.checked == null || console.error(
        "You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`."
      );
    }
    function dn(e) {
      return an.call(wh, e) ? !0 : an.call(Tp, e) ? !1 : Gf.test(e) ? wh[e] = !0 : (Tp[e] = !0, console.error("Invalid attribute name: `%s`", e), !1);
    }
    function Ci(e, t, a) {
      if (dn(t)) {
        if (!e.hasAttribute(t)) {
          switch (typeof a) {
            case "symbol":
            case "object":
              return a;
            case "function":
              return a;
            case "boolean":
              if (a === !1) return a;
          }
          return a === void 0 ? void 0 : null;
        }
        return e = e.getAttribute(t), e === "" && a === !0 ? !0 : (gt(a, t), e === "" + a ? a : e);
      }
    }
    function Ho(e, t, a) {
      if (dn(t))
        if (a === null) e.removeAttribute(t);
        else {
          switch (typeof a) {
            case "undefined":
            case "function":
            case "symbol":
              e.removeAttribute(t);
              return;
            case "boolean":
              var i = t.toLowerCase().slice(0, 5);
              if (i !== "data-" && i !== "aria-") {
                e.removeAttribute(t);
                return;
              }
          }
          gt(a, t), e.setAttribute(t, "" + a);
        }
    }
    function dr(e, t, a) {
      if (a === null) e.removeAttribute(t);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            e.removeAttribute(t);
            return;
        }
        gt(a, t), e.setAttribute(t, "" + a);
      }
    }
    function cu(e, t, a, i) {
      if (i === null) e.removeAttribute(a);
      else {
        switch (typeof i) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            e.removeAttribute(a);
            return;
        }
        gt(i, a), e.setAttributeNS(t, a, "" + i);
      }
    }
    function Ga(e) {
      switch (typeof e) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return gc(e), e;
        default:
          return "";
      }
    }
    function Ps(e) {
      var t = e.type;
      return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function bm(e, t, a) {
      var i = Object.getOwnPropertyDescriptor(
        e.constructor.prototype,
        t
      );
      if (!e.hasOwnProperty(t) && typeof i < "u" && typeof i.get == "function" && typeof i.set == "function") {
        var o = i.get, f = i.set;
        return Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return o.call(this);
          },
          set: function(d) {
            gc(d), a = "" + d, f.call(this, d);
          }
        }), Object.defineProperty(e, t, {
          enumerable: i.enumerable
        }), {
          getValue: function() {
            return a;
          },
          setValue: function(d) {
            gc(d), a = "" + d;
          },
          stopTracking: function() {
            e._valueTracker = null, delete e[t];
          }
        };
      }
    }
    function ed(e) {
      if (!e._valueTracker) {
        var t = Ps(e) ? "checked" : "value";
        e._valueTracker = bm(
          e,
          t,
          "" + e[t]
        );
      }
    }
    function Em(e) {
      if (!e) return !1;
      var t = e._valueTracker;
      if (!t) return !0;
      var a = t.getValue(), i = "";
      return e && (i = Ps(e) ? e.checked ? "true" : "false" : e.value), e = i, e !== a ? (t.setValue(e), !0) : !1;
    }
    function Cn(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    function Ct(e) {
      return e.replace(
        Gh,
        function(t) {
          return "\\" + t.charCodeAt(0).toString(16) + " ";
        }
      );
    }
    function fa(e, t) {
      t.checked === void 0 || t.defaultChecked === void 0 || Zg || (console.error(
        "%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://react.dev/link/controlled-components",
        pt() || "A component",
        t.type
      ), Zg = !0), t.value === void 0 || t.defaultValue === void 0 || Ap || (console.error(
        "%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://react.dev/link/controlled-components",
        pt() || "A component",
        t.type
      ), Ap = !0);
    }
    function Ui(e, t, a, i, o, f, d, h) {
      e.name = "", d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? (gt(d, "type"), e.type = d) : e.removeAttribute("type"), t != null ? d === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ga(t)) : e.value !== "" + Ga(t) && (e.value = "" + Ga(t)) : d !== "submit" && d !== "reset" || e.removeAttribute("value"), t != null ? Tm(e, d, Ga(t)) : a != null ? Tm(e, d, Ga(a)) : i != null && e.removeAttribute("value"), o == null && f != null && (e.defaultChecked = !!f), o != null && (e.checked = o && typeof o != "function" && typeof o != "symbol"), h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" ? (gt(h, "name"), e.name = "" + Ga(h)) : e.removeAttribute("name");
    }
    function td(e, t, a, i, o, f, d, h) {
      if (f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" && (gt(f, "type"), e.type = f), t != null || a != null) {
        if (!(f !== "submit" && f !== "reset" || t != null)) {
          ed(e);
          return;
        }
        a = a != null ? "" + Ga(a) : "", t = t != null ? "" + Ga(t) : a, h || t === e.value || (e.value = t), e.defaultValue = t;
      }
      i = i ?? o, i = typeof i != "function" && typeof i != "symbol" && !!i, e.checked = h ? e.checked : !!i, e.defaultChecked = !!i, d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" && (gt(d, "name"), e.name = d), ed(e);
    }
    function Tm(e, t, a) {
      t === "number" && Cn(e.ownerDocument) === e || e.defaultValue === "" + a || (e.defaultValue = "" + a);
    }
    function T0(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? bs.Children.forEach(t.children, function(a) {
        a == null || typeof a == "string" || typeof a == "number" || typeof a == "bigint" || l || (l = !0, console.error(
          "Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>."
        ));
      }) : t.dangerouslySetInnerHTML == null || n || (n = !0, console.error(
        "Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected."
      ))), t.selected == null || Ds || (console.error(
        "Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."
      ), Ds = !0);
    }
    function Am() {
      var e = pt();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    function ou(e, t, a, i) {
      if (e = e.options, t) {
        t = {};
        for (var o = 0; o < a.length; o++)
          t["$" + a[o]] = !0;
        for (a = 0; a < e.length; a++)
          o = t.hasOwnProperty("$" + e[a].value), e[a].selected !== o && (e[a].selected = o), o && i && (e[a].defaultSelected = !0);
      } else {
        for (a = "" + Ga(a), t = null, o = 0; o < e.length; o++) {
          if (e[o].value === a) {
            e[o].selected = !0, i && (e[o].defaultSelected = !0);
            return;
          }
          t !== null || e[o].disabled || (t = e[o]);
        }
        t !== null && (t.selected = !0);
      }
    }
    function ld(e, t) {
      for (e = 0; e < c.length; e++) {
        var a = c[e];
        if (t[a] != null) {
          var i = El(t[a]);
          t.multiple && !i ? console.error(
            "The `%s` prop supplied to <select> must be an array if `multiple` is true.%s",
            a,
            Am()
          ) : !t.multiple && i && console.error(
            "The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s",
            a,
            Am()
          );
        }
      }
      t.value === void 0 || t.defaultValue === void 0 || u || (console.error(
        "Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://react.dev/link/controlled-components"
      ), u = !0);
    }
    function bc(e, t) {
      t.value === void 0 || t.defaultValue === void 0 || r || (console.error(
        "%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://react.dev/link/controlled-components",
        pt() || "A component"
      ), r = !0), t.children != null && t.value == null && console.error(
        "Use the `defaultValue` or `value` props instead of setting children on <textarea>."
      );
    }
    function Ec(e, t, a) {
      if (t != null && (t = "" + Ga(t), t !== e.value && (e.value = t), a == null)) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = a != null ? "" + Ga(a) : "";
    }
    function No(e, t, a, i) {
      if (t == null) {
        if (i != null) {
          if (a != null)
            throw Error(
              "If you supply `defaultValue` on a <textarea>, do not pass children."
            );
          if (El(i)) {
            if (1 < i.length)
              throw Error("<textarea> can only have at most one child.");
            i = i[0];
          }
          a = i;
        }
        a == null && (a = ""), t = a;
      }
      a = Ga(t), e.defaultValue = a, i = e.textContent, i === a && i !== "" && i !== null && (e.value = i), ed(e);
    }
    function Tc(e, t) {
      return e.serverProps === void 0 && e.serverTail.length === 0 && e.children.length === 1 && 3 < e.distanceFromLeaf && e.distanceFromLeaf > 15 - t ? Tc(e.children[0], t) : e;
    }
    function Ot(e) {
      return "  " + "  ".repeat(e);
    }
    function Ac(e) {
      return "+ " + "  ".repeat(e);
    }
    function Hi(e) {
      return "- " + "  ".repeat(e);
    }
    function Ni(e) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return e.type;
        case 16:
          return "Lazy";
        case 31:
          return "Activity";
        case 13:
          return "Suspense";
        case 19:
          return "SuspenseList";
        case 0:
        case 15:
          return e = e.type, e.displayName || e.name || null;
        case 11:
          return e = e.type.render, e.displayName || e.name || null;
        case 1:
          return e = e.type, e.displayName || e.name || null;
        default:
          return null;
      }
    }
    function fu(e, t) {
      return s.test(e) ? (e = JSON.stringify(e), e.length > t - 2 ? 8 > t ? '{"..."}' : "{" + e.slice(0, t - 7) + '..."}' : "{" + e + "}") : e.length > t ? 5 > t ? '{"..."}' : e.slice(0, t - 3) + "..." : e;
    }
    function ad(e, t, a) {
      var i = 120 - 2 * a;
      if (t === null)
        return Ac(a) + fu(e, i) + `
`;
      if (typeof t == "string") {
        for (var o = 0; o < t.length && o < e.length && t.charCodeAt(o) === e.charCodeAt(o); o++) ;
        return o > i - 8 && 10 < o && (e = "..." + e.slice(o - 8), t = "..." + t.slice(o - 8)), Ac(a) + fu(e, i) + `
` + Hi(a) + fu(t, i) + `
`;
      }
      return Ot(a) + fu(e, i) + `
`;
    }
    function nd(e) {
      return Object.prototype.toString.call(e).replace(/^\[object (.*)\]$/, function(t, a) {
        return a;
      });
    }
    function Bo(e, t) {
      switch (typeof e) {
        case "string":
          return e = JSON.stringify(e), e.length > t ? 5 > t ? '"..."' : e.slice(0, t - 4) + '..."' : e;
        case "object":
          if (e === null) return "null";
          if (El(e)) return "[...]";
          if (e.$$typeof === On)
            return (t = Ge(e.type)) ? "<" + t + ">" : "<...>";
          var a = nd(e);
          if (a === "Object") {
            a = "", t -= 2;
            for (var i in e)
              if (e.hasOwnProperty(i)) {
                var o = JSON.stringify(i);
                if (o !== '"' + i + '"' && (i = o), t -= i.length - 2, o = Bo(
                  e[i],
                  15 > t ? t : 15
                ), t -= o.length, 0 > t) {
                  a += a === "" ? "..." : ", ...";
                  break;
                }
                a += (a === "" ? "" : ",") + i + ":" + o;
              }
            return "{" + a + "}";
          }
          return a;
        case "function":
          return (t = e.displayName || e.name) ? "function " + t : "function";
        default:
          return String(e);
      }
    }
    function Yo(e, t) {
      return typeof e != "string" || s.test(e) ? "{" + Bo(e, t - 2) + "}" : e.length > t - 2 ? 5 > t ? '"..."' : '"' + e.slice(0, t - 5) + '..."' : '"' + e + '"';
    }
    function jo(e, t, a) {
      var i = 120 - a.length - e.length, o = [], f;
      for (f in t)
        if (t.hasOwnProperty(f) && f !== "children") {
          var d = Yo(
            t[f],
            120 - a.length - f.length - 1
          );
          i -= f.length + d.length + 2, o.push(f + "=" + d);
        }
      return o.length === 0 ? a + "<" + e + `>
` : 0 < i ? a + "<" + e + " " + o.join(" ") + `>
` : a + "<" + e + `
` + a + "  " + o.join(`
` + a + "  ") + `
` + a + `>
`;
    }
    function ud(e, t, a) {
      var i = "", o = Ie({}, t), f;
      for (f in e)
        if (e.hasOwnProperty(f)) {
          delete o[f];
          var d = 120 - 2 * a - f.length - 2, h = Bo(e[f], d);
          t.hasOwnProperty(f) ? (d = Bo(t[f], d), i += Ac(a) + f + ": " + h + `
`, i += Hi(a) + f + ": " + d + `
`) : i += Ac(a) + f + ": " + h + `
`;
        }
      for (var y in o)
        o.hasOwnProperty(y) && (e = Bo(
          o[y],
          120 - 2 * a - y.length - 2
        ), i += Hi(a) + y + ": " + e + `
`);
      return i;
    }
    function Fu(e, t, a, i) {
      var o = "", f = /* @__PURE__ */ new Map();
      for (p in a)
        a.hasOwnProperty(p) && f.set(
          p.toLowerCase(),
          p
        );
      if (f.size === 1 && f.has("children"))
        o += jo(
          e,
          t,
          Ot(i)
        );
      else {
        for (var d in t)
          if (t.hasOwnProperty(d) && d !== "children") {
            var h = 120 - 2 * (i + 1) - d.length - 1, y = f.get(d.toLowerCase());
            if (y !== void 0) {
              f.delete(d.toLowerCase());
              var p = t[d];
              y = a[y];
              var R = Yo(
                p,
                h
              );
              h = Yo(
                y,
                h
              ), typeof p == "object" && p !== null && typeof y == "object" && y !== null && nd(p) === "Object" && nd(y) === "Object" && (2 < Object.keys(p).length || 2 < Object.keys(y).length || -1 < R.indexOf("...") || -1 < h.indexOf("...")) ? o += Ot(i + 1) + d + `={{
` + ud(
                p,
                y,
                i + 2
              ) + Ot(i + 1) + `}}
` : (o += Ac(i + 1) + d + "=" + R + `
`, o += Hi(i + 1) + d + "=" + h + `
`);
            } else
              o += Ot(i + 1) + d + "=" + Yo(t[d], h) + `
`;
          }
        f.forEach(function(_) {
          if (_ !== "children") {
            var E = 120 - 2 * (i + 1) - _.length - 1;
            o += Hi(i + 1) + _ + "=" + Yo(a[_], E) + `
`;
          }
        }), o = o === "" ? Ot(i) + "<" + e + `>
` : Ot(i) + "<" + e + `
` + o + Ot(i) + `>
`;
      }
      return e = a.children, t = t.children, typeof e == "string" || typeof e == "number" || typeof e == "bigint" ? (f = "", (typeof t == "string" || typeof t == "number" || typeof t == "bigint") && (f = "" + t), o += ad(f, "" + e, i + 1)) : (typeof t == "string" || typeof t == "number" || typeof t == "bigint") && (o = e == null ? o + ad("" + t, null, i + 1) : o + ad("" + t, void 0, i + 1)), o;
    }
    function La(e, t) {
      var a = Ni(e);
      if (a === null) {
        for (a = "", e = e.child; e; )
          a += La(e, t), e = e.sibling;
        return a;
      }
      return Ot(t) + "<" + a + `>
`;
    }
    function id(e, t) {
      var a = Tc(e, t);
      if (a !== e && (e.children.length !== 1 || e.children[0] !== a))
        return Ot(t) + `...
` + id(a, t + 1);
      a = "";
      var i = e.fiber._debugInfo;
      if (i)
        for (var o = 0; o < i.length; o++) {
          var f = i[o].name;
          typeof f == "string" && (a += Ot(t) + "<" + f + `>
`, t++);
        }
      if (i = "", o = e.fiber.pendingProps, e.fiber.tag === 6)
        i = ad(o, e.serverProps, t), t++;
      else if (f = Ni(e.fiber), f !== null)
        if (e.serverProps === void 0) {
          i = t;
          var d = 120 - 2 * i - f.length - 2, h = "";
          for (p in o)
            if (o.hasOwnProperty(p) && p !== "children") {
              var y = Yo(o[p], 15);
              if (d -= p.length + y.length + 2, 0 > d) {
                h += " ...";
                break;
              }
              h += " " + p + "=" + y;
            }
          i = Ot(i) + "<" + f + h + `>
`, t++;
        } else
          e.serverProps === null ? (i = jo(
            f,
            o,
            Ac(t)
          ), t++) : typeof e.serverProps == "string" ? console.error(
            "Should not have matched a non HostText fiber to a Text node. This is a bug in React."
          ) : (i = Fu(
            f,
            o,
            e.serverProps,
            t
          ), t++);
      var p = "";
      for (o = e.fiber.child, f = 0; o && f < e.children.length; )
        d = e.children[f], d.fiber === o ? (p += id(d, t), f++) : p += La(o, t), o = o.sibling;
      for (o && 0 < e.children.length && (p += Ot(t) + `...
`), o = e.serverTail, e.serverProps === null && t--, e = 0; e < o.length; e++)
        f = o[e], p = typeof f == "string" ? p + (Hi(t) + fu(f, 120 - 2 * t) + `
`) : p + jo(
          f.type,
          f.props,
          Hi(t)
        );
      return a + i + p;
    }
    function Om(e) {
      try {
        return `

` + id(e, 0);
      } catch {
        return "";
      }
    }
    function cd(e, t, a) {
      for (var i = t, o = null, f = 0; i; )
        i === e && (f = 0), o = {
          fiber: i,
          children: o !== null ? [o] : [],
          serverProps: i === t ? a : i === e ? null : void 0,
          serverTail: [],
          distanceFromLeaf: f
        }, f++, i = i.return;
      return o !== null ? Om(o).replaceAll(/^[+-]/gm, ">") : "";
    }
    function Rm(e, t) {
      var a = Ie({}, e || V), i = { tag: t };
      return v.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), A.indexOf(t) !== -1 && (a.pTagInButtonScope = null), m.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), t === "#document" || t === "html" ? a.containerTagInScope = null : a.containerTagInScope || (a.containerTagInScope = i), e !== null || t !== "#document" && t !== "html" && t !== "body" ? a.implicitRootScope === !0 && (a.implicitRootScope = !1) : a.implicitRootScope = !0, a;
    }
    function hr(e, t, a) {
      switch (t) {
        case "select":
          return e === "hr" || e === "option" || e === "optgroup" || e === "script" || e === "template" || e === "#text";
        case "optgroup":
          return e === "option" || e === "#text";
        case "option":
          return e === "#text";
        case "tr":
          return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
        case "tbody":
        case "thead":
        case "tfoot":
          return e === "tr" || e === "style" || e === "script" || e === "template";
        case "colgroup":
          return e === "col" || e === "template";
        case "table":
          return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
        case "head":
          return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
        case "html":
          if (a) break;
          return e === "head" || e === "body" || e === "frameset";
        case "frameset":
          return e === "frame";
        case "#document":
          if (!a) return e === "html";
      }
      switch (e) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
        case "rp":
        case "rt":
          return j.indexOf(t) === -1;
        case "caption":
        case "col":
        case "colgroup":
        case "frameset":
        case "frame":
        case "tbody":
        case "td":
        case "tfoot":
        case "th":
        case "thead":
        case "tr":
          return t == null;
        case "head":
          return a || t === null;
        case "html":
          return a && t === "#document" || t === null;
        case "body":
          return a && (t === "#document" || t === "html") || t === null;
      }
      return !0;
    }
    function kv(e, t) {
      switch (e) {
        case "address":
        case "article":
        case "aside":
        case "blockquote":
        case "center":
        case "details":
        case "dialog":
        case "dir":
        case "div":
        case "dl":
        case "fieldset":
        case "figcaption":
        case "figure":
        case "footer":
        case "header":
        case "hgroup":
        case "main":
        case "menu":
        case "nav":
        case "ol":
        case "p":
        case "section":
        case "summary":
        case "ul":
        case "pre":
        case "listing":
        case "table":
        case "hr":
        case "xmp":
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return t.pTagInButtonScope;
        case "form":
          return t.formTag || t.pTagInButtonScope;
        case "li":
          return t.listItemTagAutoclosing;
        case "dd":
        case "dt":
          return t.dlItemTagAutoclosing;
        case "button":
          return t.buttonTagInScope;
        case "a":
          return t.aTagInScope;
        case "nobr":
          return t.nobrTagInScope;
      }
      return null;
    }
    function Xa(e, t) {
      for (; e; ) {
        switch (e.tag) {
          case 5:
          case 26:
          case 27:
            if (e.type === t) return e;
        }
        e = e.return;
      }
      return null;
    }
    function mr(e, t) {
      t = t || V;
      var a = t.current;
      if (t = (a = hr(
        e,
        a && a.tag,
        t.implicitRootScope
      ) ? null : a) ? null : kv(e, t), t = a || t, !t) return !0;
      var i = t.tag;
      if (t = String(!!a) + "|" + e + "|" + i, k[t]) return !1;
      k[t] = !0;
      var o = (t = Na) ? Xa(t.return, i) : null, f = t !== null && o !== null ? cd(o, t, null) : "", d = "<" + e + ">";
      return a ? (a = "", i === "table" && e === "tr" && (a += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), console.error(
        `In HTML, %s cannot be a child of <%s>.%s
This will cause a hydration error.%s`,
        d,
        i,
        a,
        f
      )) : console.error(
        `In HTML, %s cannot be a descendant of <%s>.
This will cause a hydration error.%s`,
        d,
        i,
        f
      ), t && (e = t.return, o === null || e === null || o === e && e._debugOwner === t._debugOwner || se(o, function() {
        console.error(
          `<%s> cannot contain a nested %s.
See this log for the ancestor stack trace.`,
          i,
          d
        );
      })), !1;
    }
    function yr(e, t, a) {
      if (a || hr("#text", t, !1))
        return !0;
      if (a = "#text|" + t, k[a]) return !1;
      k[a] = !0;
      var i = (a = Na) ? Xa(a, t) : null;
      return a = a !== null && i !== null ? cd(
        i,
        a,
        a.tag !== 6 ? { children: null } : null
      ) : "", /\S/.test(e) ? console.error(
        `In HTML, text nodes cannot be a child of <%s>.
This will cause a hydration error.%s`,
        t,
        a
      ) : console.error(
        `In HTML, whitespace text nodes cannot be a child of <%s>. Make sure you don't have any extra whitespace between tags on each line of your source code.
This will cause a hydration error.%s`,
        t,
        a
      ), !1;
    }
    function Oc(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === 3) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    function qo(e) {
      return e.replace(H, function(t, a) {
        return a.toUpperCase();
      });
    }
    function zm(e, t, a) {
      var i = t.indexOf("--") === 0;
      i || (-1 < t.indexOf("-") ? B.hasOwnProperty(t) && B[t] || (B[t] = !0, console.error(
        "Unsupported style property %s. Did you mean %s?",
        t,
        qo(t.replace(Bt, "ms-"))
      )) : Me.test(t) ? B.hasOwnProperty(t) && B[t] || (B[t] = !0, console.error(
        "Unsupported vendor-prefixed style property %s. Did you mean %s?",
        t,
        t.charAt(0).toUpperCase() + t.slice(1)
      )) : !z.test(a) || $.hasOwnProperty(a) && $[a] || ($[a] = !0, console.error(
        `Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`,
        t,
        a.replace(z, "")
      )), typeof a == "number" && (isNaN(a) ? Te || (Te = !0, console.error(
        "`NaN` is an invalid value for the `%s` css style property.",
        t
      )) : isFinite(a) || ht || (ht = !0, console.error(
        "`Infinity` is an invalid value for the `%s` css style property.",
        t
      )))), a == null || typeof a == "boolean" || a === "" ? i ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : i ? e.setProperty(t, a) : typeof a != "number" || a === 0 || ge.has(t) ? t === "float" ? e.cssFloat = a : (Pl(a, t), e[t] = ("" + a).trim()) : e[t] = a + "px";
    }
    function Dm(e, t, a) {
      if (t != null && typeof t != "object")
        throw Error(
          "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX."
        );
      if (t && Object.freeze(t), e = e.style, a != null) {
        if (t) {
          var i = {};
          if (a) {
            for (var o in a)
              if (a.hasOwnProperty(o) && !t.hasOwnProperty(o))
                for (var f = q[o] || [o], d = 0; d < f.length; d++)
                  i[f[d]] = o;
          }
          for (var h in t)
            if (t.hasOwnProperty(h) && (!a || a[h] !== t[h]))
              for (o = q[h] || [h], f = 0; f < o.length; f++)
                i[o[f]] = h;
          h = {};
          for (var y in t)
            for (o = q[y] || [y], f = 0; f < o.length; f++)
              h[o[f]] = y;
          y = {};
          for (var p in i)
            if (o = i[p], (f = h[p]) && o !== f && (d = o + "," + f, !y[d])) {
              y[d] = !0, d = console;
              var R = t[o];
              d.error.call(
                d,
                "%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.",
                R == null || typeof R == "boolean" || R === "" ? "Removing" : "Updating",
                o,
                f
              );
            }
        }
        for (var _ in a)
          !a.hasOwnProperty(_) || t != null && t.hasOwnProperty(_) || (_.indexOf("--") === 0 ? e.setProperty(_, "") : _ === "float" ? e.cssFloat = "" : e[_] = "");
        for (var E in t)
          p = t[E], t.hasOwnProperty(E) && a[E] !== p && zm(e, E, p);
      } else
        for (i in t)
          t.hasOwnProperty(i) && zm(e, i, t[i]);
    }
    function ru(e) {
      if (e.indexOf("-") === -1) return !1;
      switch (e) {
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
    function A0(e) {
      return St.get(e) || e;
    }
    function O0(e, t) {
      if (an.call(Lh, t) && Lh[t])
        return !0;
      if (iE.test(t)) {
        if (e = "aria-" + t.slice(4).toLowerCase(), e = Jg.hasOwnProperty(e) ? e : null, e == null)
          return console.error(
            "Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.",
            t
          ), Lh[t] = !0;
        if (t !== e)
          return console.error(
            "Invalid ARIA attribute `%s`. Did you mean `%s`?",
            t,
            e
          ), Lh[t] = !0;
      }
      if (uE.test(t)) {
        if (e = t.toLowerCase(), e = Jg.hasOwnProperty(e) ? e : null, e == null) return Lh[t] = !0, !1;
        t !== e && (console.error(
          "Unknown ARIA attribute `%s`. Did you mean `%s`?",
          t,
          e
        ), Lh[t] = !0);
      }
      return !0;
    }
    function R0(e, t) {
      var a = [], i;
      for (i in t)
        O0(e, i) || a.push(i);
      t = a.map(function(o) {
        return "`" + o + "`";
      }).join(", "), a.length === 1 ? console.error(
        "Invalid aria prop %s on <%s> tag. For details, see https://react.dev/link/invalid-aria-props",
        t,
        e
      ) : 1 < a.length && console.error(
        "Invalid aria props %s on <%s> tag. For details, see https://react.dev/link/invalid-aria-props",
        t,
        e
      );
    }
    function _m(e, t, a, i) {
      if (an.call(nn, t) && nn[t])
        return !0;
      var o = t.toLowerCase();
      if (o === "onfocusin" || o === "onfocusout")
        return console.error(
          "React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."
        ), nn[t] = !0;
      if (typeof a == "function" && (e === "form" && t === "action" || e === "input" && t === "formAction" || e === "button" && t === "formAction"))
        return !0;
      if (i != null) {
        if (e = i.possibleRegistrationNames, i.registrationNameDependencies.hasOwnProperty(t))
          return !0;
        if (i = e.hasOwnProperty(o) ? e[o] : null, i != null)
          return console.error(
            "Invalid event handler property `%s`. Did you mean `%s`?",
            t,
            i
          ), nn[t] = !0;
        if (RS.test(t))
          return console.error(
            "Unknown event handler property `%s`. It will be ignored.",
            t
          ), nn[t] = !0;
      } else if (RS.test(t))
        return cE.test(t) && console.error(
          "Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.",
          t
        ), nn[t] = !0;
      if (oE.test(t) || fE.test(t)) return !0;
      if (o === "innerhtml")
        return console.error(
          "Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."
        ), nn[t] = !0;
      if (o === "aria")
        return console.error(
          "The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."
        ), nn[t] = !0;
      if (o === "is" && a !== null && a !== void 0 && typeof a != "string")
        return console.error(
          "Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.",
          typeof a
        ), nn[t] = !0;
      if (typeof a == "number" && isNaN(a))
        return console.error(
          "Received NaN for the `%s` attribute. If this is expected, cast the value to a string.",
          t
        ), nn[t] = !0;
      if (Pn.hasOwnProperty(o)) {
        if (o = Pn[o], o !== t)
          return console.error(
            "Invalid DOM property `%s`. Did you mean `%s`?",
            t,
            o
          ), nn[t] = !0;
      } else if (t !== o)
        return console.error(
          "React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.",
          t,
          o
        ), nn[t] = !0;
      switch (t) {
        case "dangerouslySetInnerHTML":
        case "children":
        case "style":
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
          return !0;
        case "innerText":
        case "textContent":
          return !0;
      }
      switch (typeof a) {
        case "boolean":
          switch (t) {
            case "autoFocus":
            case "checked":
            case "multiple":
            case "muted":
            case "selected":
            case "contentEditable":
            case "spellCheck":
            case "draggable":
            case "value":
            case "autoReverse":
            case "externalResourcesRequired":
            case "focusable":
            case "preserveAlpha":
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
            case "capture":
            case "download":
            case "inert":
              return !0;
            default:
              return o = t.toLowerCase().slice(0, 5), o === "data-" || o === "aria-" ? !0 : (a ? console.error(
                'Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.',
                a,
                t,
                t,
                a,
                t
              ) : console.error(
                'Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.',
                a,
                t,
                t,
                a,
                t,
                t,
                t
              ), nn[t] = !0);
          }
        case "function":
        case "symbol":
          return nn[t] = !0, !1;
        case "string":
          if (a === "false" || a === "true") {
            switch (t) {
              case "checked":
              case "selected":
              case "multiple":
              case "muted":
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
              case "inert":
                break;
              default:
                return !0;
            }
            console.error(
              "Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?",
              a,
              t,
              a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".',
              t,
              a
            ), nn[t] = !0;
          }
      }
      return !0;
    }
    function Wv(e, t, a) {
      var i = [], o;
      for (o in t)
        _m(e, o, t[o], a) || i.push(o);
      t = i.map(function(f) {
        return "`" + f + "`";
      }).join(", "), i.length === 1 ? console.error(
        "Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://react.dev/link/attribute-behavior ",
        t,
        e
      ) : 1 < i.length && console.error(
        "Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://react.dev/link/attribute-behavior ",
        t,
        e
      );
    }
    function pr(e) {
      return rE.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
    }
    function hn() {
    }
    function Un(e) {
      return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
    }
    function od(e) {
      var t = ae(e);
      if (t && (e = t.stateNode)) {
        var a = e[Oa] || null;
        e: switch (e = t.stateNode, t.type) {
          case "input":
            if (Ui(
              e,
              a.value,
              a.defaultValue,
              a.defaultValue,
              a.checked,
              a.defaultChecked,
              a.type,
              a.name
            ), t = a.name, a.type === "radio" && t != null) {
              for (a = e; a.parentNode; ) a = a.parentNode;
              for (gt(t, "name"), a = a.querySelectorAll(
                'input[name="' + Ct(
                  "" + t
                ) + '"][type="radio"]'
              ), t = 0; t < a.length; t++) {
                var i = a[t];
                if (i !== e && i.form === e.form) {
                  var o = i[Oa] || null;
                  if (!o)
                    throw Error(
                      "ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported."
                    );
                  Ui(
                    i,
                    o.value,
                    o.defaultValue,
                    o.defaultValue,
                    o.checked,
                    o.defaultChecked,
                    o.type,
                    o.name
                  );
                }
              }
              for (t = 0; t < a.length; t++)
                i = a[t], i.form === e.form && Em(i);
            }
            break e;
          case "textarea":
            Ec(e, a.value, a.defaultValue);
            break e;
          case "select":
            t = a.value, t != null && ou(e, !!a.multiple, t, !1);
        }
      }
    }
    function fd(e, t, a) {
      if (r1) return e(t, a);
      r1 = !0;
      try {
        var i = e(t);
        return i;
      } finally {
        if (r1 = !1, (Xh !== null || Qh !== null) && (en(), Xh && (t = Xh, e = Qh, Qh = Xh = null, od(t), e)))
          for (t = 0; t < e.length; t++) od(e[t]);
      }
    }
    function su(e, t) {
      var a = e.stateNode;
      if (a === null) return null;
      var i = a[Oa] || null;
      if (i === null) return null;
      a = i[t];
      e: switch (t) {
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
          (i = !i.disabled) || (e = e.type, i = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !i;
          break e;
        default:
          e = !1;
      }
      if (e) return null;
      if (a && typeof a != "function")
        throw Error(
          "Expected `" + t + "` listener to be a function, instead got a value of `" + typeof a + "` type."
        );
      return a;
    }
    function Rc() {
      if (Kg) return Kg;
      var e, t = d1, a = t.length, i, o = "value" in Lf ? Lf.value : Lf.textContent, f = o.length;
      for (e = 0; e < a && t[e] === o[e]; e++) ;
      var d = a - e;
      for (i = 1; i <= d && t[a - i] === o[f - i]; i++) ;
      return Kg = o.slice(e, 1 < i ? 1 - i : void 0);
    }
    function gr(e) {
      var t = e.keyCode;
      return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
    }
    function xo() {
      return !0;
    }
    function Mm() {
      return !1;
    }
    function Hl(e) {
      function t(a, i, o, f, d) {
        this._reactName = a, this._targetInst = o, this.type = i, this.nativeEvent = f, this.target = d, this.currentTarget = null;
        for (var h in e)
          e.hasOwnProperty(h) && (a = e[h], this[h] = a ? a(f) : f[h]);
        return this.isDefaultPrevented = (f.defaultPrevented != null ? f.defaultPrevented : f.returnValue === !1) ? xo : Mm, this.isPropagationStopped = Mm, this;
      }
      return Ie(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = xo);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = xo);
        },
        persist: function() {
        },
        isPersistent: xo
      }), t;
    }
    function Iu(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : (e = AE[e]) ? !!t[e] : !1;
    }
    function vr() {
      return Iu;
    }
    function wo(e, t) {
      switch (e) {
        case "keyup":
          return YE.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== MS;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function Pu(e) {
      return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
    }
    function Cm(e, t) {
      switch (e) {
        case "compositionend":
          return Pu(t);
        case "keypress":
          return t.which !== US ? null : (NS = !0, HS);
        case "textInput":
          return e = t.data, e === HS && NS ? null : e;
        default:
          return null;
      }
    }
    function rd(e, t) {
      if (Vh)
        return e === "compositionend" || !p1 && wo(e, t) ? (e = Rc(), Kg = d1 = Lf = null, Vh = !1, e) : null;
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
            if (t.char && 1 < t.char.length)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return CS && t.locale !== "ko" ? null : t.data;
        default:
          return null;
      }
    }
    function Um(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!qE[e.type] : t === "textarea";
    }
    function sd(e) {
      if (!dc) return !1;
      e = "on" + e;
      var t = e in document;
      return t || (t = document.createElement("div"), t.setAttribute(e, "return;"), t = typeof t[e] == "function"), t;
    }
    function Sr(e, t, a, i) {
      Xh ? Qh ? Qh.push(i) : Qh = [i] : Xh = i, t = $n(t, "onChange"), 0 < t.length && (a = new $g(
        "onChange",
        "change",
        null,
        a,
        i
      ), e.push({ event: a, listeners: t }));
    }
    function z0(e) {
      Dt(e, 0);
    }
    function Kl(e) {
      var t = ye(e);
      if (Em(t)) return e;
    }
    function Bi(e, t) {
      if (e === "change") return t;
    }
    function br() {
      Mp && (Mp.detachEvent("onpropertychange", Go), Cp = Mp = null);
    }
    function Go(e) {
      if (e.propertyName === "value" && Kl(Cp)) {
        var t = [];
        Sr(
          t,
          Cp,
          e,
          Un(e)
        ), fd(z0, t);
      }
    }
    function Fv(e, t, a) {
      e === "focusin" ? (br(), Mp = t, Cp = a, Mp.attachEvent("onpropertychange", Go)) : e === "focusout" && br();
    }
    function Hm(e) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return Kl(Cp);
    }
    function Nm(e, t) {
      if (e === "click") return Kl(t);
    }
    function Er(e, t) {
      if (e === "input" || e === "change")
        return Kl(t);
    }
    function dd(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    function Lo(e, t) {
      if (un(e, t)) return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length) return !1;
      for (i = 0; i < a.length; i++) {
        var o = a[i];
        if (!an.call(t, o) || !un(e[o], t[o]))
          return !1;
      }
      return !0;
    }
    function D0(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function _0(e, t) {
      var a = D0(e);
      e = 0;
      for (var i; a; ) {
        if (a.nodeType === 3) {
          if (i = e + a.textContent.length, e <= t && i >= t)
            return { node: a, offset: t - e };
          e = i;
        }
        e: {
          for (; a; ) {
            if (a.nextSibling) {
              a = a.nextSibling;
              break e;
            }
            a = a.parentNode;
          }
          a = void 0;
        }
        a = D0(a);
      }
    }
    function M0(e, t) {
      return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? M0(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
    }
    function hd(e) {
      e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
      for (var t = Cn(e.document); t instanceof e.HTMLIFrameElement; ) {
        try {
          var a = typeof t.contentWindow.location.href == "string";
        } catch {
          a = !1;
        }
        if (a) e = t.contentWindow;
        else break;
        t = Cn(e.document);
      }
      return t;
    }
    function Bm(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function C0(e, t, a) {
      var i = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
      v1 || Zh == null || Zh !== Cn(i) || (i = Zh, "selectionStart" in i && Bm(i) ? i = { start: i.selectionStart, end: i.selectionEnd } : (i = (i.ownerDocument && i.ownerDocument.defaultView || window).getSelection(), i = {
        anchorNode: i.anchorNode,
        anchorOffset: i.anchorOffset,
        focusNode: i.focusNode,
        focusOffset: i.focusOffset
      }), Up && Lo(Up, i) || (Up = i, i = $n(g1, "onSelect"), 0 < i.length && (t = new $g(
        "onSelect",
        "select",
        null,
        t,
        a
      ), e.push({ event: t, listeners: i }), t.target = Zh)));
    }
    function zc(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    function Dc(e) {
      if (S1[e]) return S1[e];
      if (!Jh[e]) return e;
      var t = Jh[e], a;
      for (a in t)
        if (t.hasOwnProperty(a) && a in YS)
          return S1[e] = t[a];
      return e;
    }
    function Hn(e, t) {
      GS.set(e, t), lt(t, [e]);
    }
    function U0(e) {
      for (var t = Wg, a = 0; a < e.length; a++) {
        var i = e[a];
        if (typeof i == "object" && i !== null)
          if (El(i) && i.length === 2 && typeof i[0] == "string") {
            if (t !== Wg && t !== O1)
              return T1;
            t = O1;
          } else return T1;
        else {
          if (typeof i == "function" || typeof i == "string" && 50 < i.length || t !== Wg && t !== A1)
            return T1;
          t = A1;
        }
      }
      return t;
    }
    function Ym(e, t, a, i) {
      for (var o in e)
        an.call(e, o) && o[0] !== "_" && du(o, e[o], t, a, i);
    }
    function du(e, t, a, i, o) {
      switch (typeof t) {
        case "object":
          if (t === null) {
            t = "null";
            break;
          } else {
            if (t.$$typeof === On) {
              var f = Ge(t.type) || "…", d = t.key;
              t = t.props;
              var h = Object.keys(t), y = h.length;
              if (d == null && y === 0) {
                t = "<" + f + " />";
                break;
              }
              if (3 > i || y === 1 && h[0] === "children" && d == null) {
                t = "<" + f + " … />";
                break;
              }
              a.push([
                o + "  ".repeat(i) + e,
                "<" + f
              ]), d !== null && du(
                "key",
                d,
                a,
                i + 1,
                o
              ), e = !1;
              for (var p in t)
                p === "children" ? t.children != null && (!El(t.children) || 0 < t.children.length) && (e = !0) : an.call(t, p) && p[0] !== "_" && du(
                  p,
                  t[p],
                  a,
                  i + 1,
                  o
                );
              a.push([
                "",
                e ? ">…</" + f + ">" : "/>"
              ]);
              return;
            }
            if (f = Object.prototype.toString.call(t), f = f.slice(8, f.length - 1), f === "Array") {
              if (p = U0(t), p === A1 || p === Wg) {
                t = JSON.stringify(t);
                break;
              } else if (p === O1) {
                for (a.push([
                  o + "  ".repeat(i) + e,
                  ""
                ]), e = 0; e < t.length; e++)
                  f = t[e], du(
                    f[0],
                    f[1],
                    a,
                    i + 1,
                    o
                  );
                return;
              }
            }
            if (f === "Promise") {
              if (t.status === "fulfilled") {
                if (f = a.length, du(
                  e,
                  t.value,
                  a,
                  i,
                  o
                ), a.length > f) {
                  a = a[f], a[1] = "Promise<" + (a[1] || "Object") + ">";
                  return;
                }
              } else if (t.status === "rejected" && (f = a.length, du(
                e,
                t.reason,
                a,
                i,
                o
              ), a.length > f)) {
                a = a[f], a[1] = "Rejected Promise<" + a[1] + ">";
                return;
              }
              a.push([
                "  ".repeat(i) + e,
                "Promise"
              ]);
              return;
            }
            f === "Object" && (p = Object.getPrototypeOf(t)) && typeof p.constructor == "function" && (f = p.constructor.name), a.push([
              o + "  ".repeat(i) + e,
              f === "Object" ? 3 > i ? "" : "…" : f
            ]), 3 > i && Ym(t, a, i + 1, o);
            return;
          }
        case "function":
          t = t.name === "" ? "() => {}" : t.name + "() {}";
          break;
        case "string":
          t = t === VE ? "…" : JSON.stringify(t);
          break;
        case "undefined":
          t = "undefined";
          break;
        case "boolean":
          t = t ? "true" : "false";
          break;
        default:
          t = String(t);
      }
      a.push([
        o + "  ".repeat(i) + e,
        t
      ]);
    }
    function H0(e, t, a, i) {
      var o = !0;
      for (d in e)
        d in t || (a.push([
          Fg + "  ".repeat(i) + d,
          "…"
        ]), o = !1);
      for (var f in t)
        if (f in e) {
          var d = e[f], h = t[f];
          if (d !== h) {
            if (i === 0 && f === "children")
              o = "  ".repeat(i) + f, a.push(
                [Fg + o, "…"],
                [Ig + o, "…"]
              );
            else {
              if (!(3 <= i)) {
                if (typeof d == "object" && typeof h == "object" && d !== null && h !== null && d.$$typeof === h.$$typeof)
                  if (h.$$typeof === On) {
                    if (d.type === h.type && d.key === h.key) {
                      d = Ge(h.type) || "…", o = "  ".repeat(i) + f, d = "<" + d + " … />", a.push(
                        [Fg + o, d],
                        [Ig + o, d]
                      ), o = !1;
                      continue;
                    }
                  } else {
                    var y = Object.prototype.toString.call(d), p = Object.prototype.toString.call(h);
                    if (y === p && (p === "[object Object]" || p === "[object Array]")) {
                      y = [
                        QS + "  ".repeat(i) + f,
                        p === "[object Array]" ? "Array" : ""
                      ], a.push(y), p = a.length, H0(
                        d,
                        h,
                        a,
                        i + 1
                      ) ? p === a.length && (y[1] = "Referentially unequal but deeply equal objects. Consider memoization.") : o = !1;
                      continue;
                    }
                  }
                else if (typeof d == "function" && typeof h == "function" && d.name === h.name && d.length === h.length && (y = Function.prototype.toString.call(d), p = Function.prototype.toString.call(h), y === p)) {
                  d = h.name === "" ? "() => {}" : h.name + "() {}", a.push([
                    QS + "  ".repeat(i) + f,
                    d + " Referentially unequal function closure. Consider memoization."
                  ]);
                  continue;
                }
              }
              du(f, d, a, i, Fg), du(f, h, a, i, Ig);
            }
            o = !1;
          }
        } else
          a.push([
            Ig + "  ".repeat(i) + f,
            "…"
          ]), o = !1;
      return o;
    }
    function Nn(e) {
      dt = e & 63 ? "Blocking" : e & 64 ? "Gesture" : e & 4194176 ? "Transition" : e & 62914560 ? "Suspense" : e & 2080374784 ? "Idle" : "Other";
    }
    function mn(e, t, a, i) {
      el && (Qf.start = t, Qf.end = a, ho.color = "warning", ho.tooltipText = i, ho.properties = null, (e = e._debugTask) ? e.run(
        performance.measure.bind(
          performance,
          i,
          Qf
        )
      ) : performance.measure(i, Qf));
    }
    function md(e, t, a) {
      mn(e, t, a, "Reconnect");
    }
    function yd(e, t, a, i, o) {
      var f = re(e);
      if (f !== null && el) {
        var d = e.alternate, h = e.actualDuration;
        if (d === null || d.child !== e.child)
          for (var y = e.child; y !== null; y = y.sibling)
            h -= y.actualDuration;
        i = 0.5 > h ? i ? "tertiary-light" : "primary-light" : 10 > h ? i ? "tertiary" : "primary" : 100 > h ? i ? "tertiary-dark" : "primary-dark" : "error";
        var p = e.memoizedProps;
        h = e._debugTask, p !== null && d !== null && d.memoizedProps !== p ? (y = [ZE], p = H0(
          d.memoizedProps,
          p,
          y,
          0
        ), 1 < y.length && (p && !Xf && (d.lanes & o) === 0 && 100 < e.actualDuration ? (Xf = !0, y[0] = JE, ho.color = "warning", ho.tooltipText = VS) : (ho.color = i, ho.tooltipText = f), ho.properties = y, Qf.start = t, Qf.end = a, h != null ? h.run(
          performance.measure.bind(
            performance,
            "​" + f,
            Qf
          )
        ) : performance.measure(
          "​" + f,
          Qf
        ))) : h != null ? h.run(
          console.timeStamp.bind(
            console,
            f,
            t,
            a,
            wu,
            void 0,
            i
          )
        ) : console.timeStamp(
          f,
          t,
          a,
          wu,
          void 0,
          i
        );
      }
    }
    function jm(e, t, a, i) {
      if (el) {
        var o = re(e);
        if (o !== null) {
          for (var f = null, d = [], h = 0; h < i.length; h++) {
            var y = i[h];
            f == null && y.source !== null && (f = y.source._debugTask), y = y.value, d.push([
              "Error",
              typeof y == "object" && y !== null && typeof y.message == "string" ? String(y.message) : String(y)
            ]);
          }
          e.key !== null && du("key", e.key, d, 0, ""), e.memoizedProps !== null && Ym(e.memoizedProps, d, 0, ""), f == null && (f = e._debugTask), e = {
            start: t,
            end: a,
            detail: {
              devtools: {
                color: "error",
                track: wu,
                tooltipText: e.tag === 13 ? "Hydration failed" : "Error boundary caught an error",
                properties: d
              }
            }
          }, f ? f.run(
            performance.measure.bind(performance, "​" + o, e)
          ) : performance.measure("​" + o, e);
        }
      }
    }
    function Bn(e, t, a, i, o) {
      if (o !== null) {
        if (el) {
          var f = re(e);
          if (f !== null) {
            i = [];
            for (var d = 0; d < o.length; d++) {
              var h = o[d].value;
              i.push([
                "Error",
                typeof h == "object" && h !== null && typeof h.message == "string" ? String(h.message) : String(h)
              ]);
            }
            e.key !== null && du("key", e.key, i, 0, ""), e.memoizedProps !== null && Ym(e.memoizedProps, i, 0, ""), t = {
              start: t,
              end: a,
              detail: {
                devtools: {
                  color: "error",
                  track: wu,
                  tooltipText: "A lifecycle or effect errored",
                  properties: i
                }
              }
            }, (e = e._debugTask) ? e.run(
              performance.measure.bind(
                performance,
                "​" + f,
                t
              )
            ) : performance.measure("​" + f, t);
          }
        }
      } else
        f = re(e), f !== null && el && (o = 1 > i ? "secondary-light" : 100 > i ? "secondary" : 500 > i ? "secondary-dark" : "error", (e = e._debugTask) ? e.run(
          console.timeStamp.bind(
            console,
            f,
            t,
            a,
            wu,
            void 0,
            o
          )
        ) : console.timeStamp(
          f,
          t,
          a,
          wu,
          void 0,
          o
        ));
    }
    function Iv(e, t, a, i) {
      if (el && !(t <= e)) {
        var o = (a & 738197653) === a ? "tertiary-dark" : "primary-dark";
        a = (a & 536870912) === a ? "Prepared" : (a & 201326741) === a ? "Hydrated" : "Render", i ? i.run(
          console.timeStamp.bind(
            console,
            a,
            e,
            t,
            dt,
            rt,
            o
          )
        ) : console.timeStamp(
          a,
          e,
          t,
          dt,
          rt,
          o
        );
      }
    }
    function N0(e, t, a, i) {
      !el || t <= e || (a = (a & 738197653) === a ? "tertiary-dark" : "primary-dark", i ? i.run(
        console.timeStamp.bind(
          console,
          "Prewarm",
          e,
          t,
          dt,
          rt,
          a
        )
      ) : console.timeStamp(
        "Prewarm",
        e,
        t,
        dt,
        rt,
        a
      ));
    }
    function B0(e, t, a, i) {
      !el || t <= e || (a = (a & 738197653) === a ? "tertiary-dark" : "primary-dark", i ? i.run(
        console.timeStamp.bind(
          console,
          "Suspended",
          e,
          t,
          dt,
          rt,
          a
        )
      ) : console.timeStamp(
        "Suspended",
        e,
        t,
        dt,
        rt,
        a
      ));
    }
    function Pv(e, t, a, i, o, f) {
      if (el && !(t <= e)) {
        a = [];
        for (var d = 0; d < i.length; d++) {
          var h = i[d].value;
          a.push([
            "Recoverable Error",
            typeof h == "object" && h !== null && typeof h.message == "string" ? String(h.message) : String(h)
          ]);
        }
        e = {
          start: e,
          end: t,
          detail: {
            devtools: {
              color: "primary-dark",
              track: dt,
              trackGroup: rt,
              tooltipText: o ? "Hydration Failed" : "Recovered after Error",
              properties: a
            }
          }
        }, f ? f.run(
          performance.measure.bind(performance, "Recovered", e)
        ) : performance.measure("Recovered", e);
      }
    }
    function qm(e, t, a, i) {
      !el || t <= e || (i ? i.run(
        console.timeStamp.bind(
          console,
          "Errored",
          e,
          t,
          dt,
          rt,
          "error"
        )
      ) : console.timeStamp(
        "Errored",
        e,
        t,
        dt,
        rt,
        "error"
      ));
    }
    function e1(e, t, a, i) {
      !el || t <= e || (i ? i.run(
        console.timeStamp.bind(
          console,
          a,
          e,
          t,
          dt,
          rt,
          "secondary-light"
        )
      ) : console.timeStamp(
        a,
        e,
        t,
        dt,
        rt,
        "secondary-light"
      ));
    }
    function Y0(e, t, a, i, o) {
      if (el && !(t <= e)) {
        for (var f = [], d = 0; d < a.length; d++) {
          var h = a[d].value;
          f.push([
            "Error",
            typeof h == "object" && h !== null && typeof h.message == "string" ? String(h.message) : String(h)
          ]);
        }
        e = {
          start: e,
          end: t,
          detail: {
            devtools: {
              color: "error",
              track: dt,
              trackGroup: rt,
              tooltipText: i ? "Remaining Effects Errored" : "Commit Errored",
              properties: f
            }
          }
        }, o ? o.run(
          performance.measure.bind(performance, "Errored", e)
        ) : performance.measure("Errored", e);
      }
    }
    function xm(e, t, a) {
      !el || t <= e || console.timeStamp(
        "Animating",
        e,
        t,
        dt,
        rt,
        "secondary-dark"
      );
    }
    function pd() {
      for (var e = Kh, t = R1 = Kh = 0; t < e; ) {
        var a = Gu[t];
        Gu[t++] = null;
        var i = Gu[t];
        Gu[t++] = null;
        var o = Gu[t];
        Gu[t++] = null;
        var f = Gu[t];
        if (Gu[t++] = null, i !== null && o !== null) {
          var d = i.pending;
          d === null ? o.next = o : (o.next = d.next, d.next = o), i.pending = o;
        }
        f !== 0 && wm(a, o, f);
      }
    }
    function Xo(e, t, a, i) {
      Gu[Kh++] = e, Gu[Kh++] = t, Gu[Kh++] = a, Gu[Kh++] = i, R1 |= i, e.lanes |= i, e = e.alternate, e !== null && (e.lanes |= i);
    }
    function _c(e, t, a, i) {
      return Xo(e, t, a, i), Tr(e);
    }
    function ta(e, t) {
      return Xo(e, null, null, t), Tr(e);
    }
    function wm(e, t, a) {
      e.lanes |= a;
      var i = e.alternate;
      i !== null && (i.lanes |= a);
      for (var o = !1, f = e.return; f !== null; )
        f.childLanes |= a, i = f.alternate, i !== null && (i.childLanes |= a), f.tag === 22 && (e = f.stateNode, e === null || e._visibility & Hp || (o = !0)), e = f, f = f.return;
      return e.tag === 3 ? (f = e.stateNode, o && t !== null && (o = 31 - kl(a), e = f.hiddenUpdates, i = e[o], i === null ? e[o] = [t] : i.push(t), t.lane = a | 536870912), f) : null;
    }
    function Tr(e) {
      if (u0 > oT)
        throw Vs = u0 = 0, i0 = nS = null, Error(
          "Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops."
        );
      Vs > fT && (Vs = 0, i0 = null, console.error(
        "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
      )), e.alternate === null && (e.flags & 4098) !== 0 && An(e);
      for (var t = e, a = t.return; a !== null; )
        t.alternate === null && (t.flags & 4098) !== 0 && An(e), t = a, a = t.return;
      return t.tag === 3 ? t.stateNode : null;
    }
    function Yi(e) {
      if (Lu === null) return e;
      var t = Lu(e);
      return t === void 0 ? e : t.current;
    }
    function gd(e) {
      if (Lu === null) return e;
      var t = Lu(e);
      return t === void 0 ? e != null && typeof e.render == "function" && (t = Yi(e.render), e.render !== t) ? (t = { $$typeof: Cf, render: t }, e.displayName !== void 0 && (t.displayName = e.displayName), t) : e : t.current;
    }
    function Gm(e, t) {
      if (Lu === null) return !1;
      var a = e.elementType;
      t = t.type;
      var i = !1, o = typeof t == "object" && t !== null ? t.$$typeof : null;
      switch (e.tag) {
        case 1:
          typeof t == "function" && (i = !0);
          break;
        case 0:
          (typeof t == "function" || o === na) && (i = !0);
          break;
        case 11:
          (o === Cf || o === na) && (i = !0);
          break;
        case 14:
        case 15:
          (o === Ts || o === na) && (i = !0);
          break;
        default:
          return !1;
      }
      return !!(i && (e = Lu(a), e !== void 0 && e === Lu(t)));
    }
    function Mc(e) {
      Lu !== null && typeof WeakSet == "function" && ($h === null && ($h = /* @__PURE__ */ new WeakSet()), $h.add(e));
    }
    function j0(e, t, a) {
      do {
        var i = e, o = i.alternate, f = i.child, d = i.sibling, h = i.tag;
        i = i.type;
        var y = null;
        switch (h) {
          case 0:
          case 15:
          case 1:
            y = i;
            break;
          case 11:
            y = i.render;
        }
        if (Lu === null)
          throw Error("Expected resolveFamily to be set during hot reload.");
        var p = !1;
        if (i = !1, y !== null && (y = Lu(y), y !== void 0 && (a.has(y) ? i = !0 : t.has(y) && (h === 1 ? i = !0 : p = !0))), $h !== null && ($h.has(e) || o !== null && $h.has(o)) && (i = !0), i && (e._debugNeedsRemount = !0), (i || p) && (o = ta(e, 2), o !== null && Be(o, e, 2)), f === null || i || j0(
          f,
          t,
          a
        ), d === null) break;
        e = d;
      } while (!0);
    }
    function t1(e, t, a, i) {
      this.tag = e, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = i, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null, this.actualDuration = -0, this.actualStartTime = -1.1, this.treeBaseDuration = this.selfBaseDuration = -0, this._debugTask = this._debugStack = this._debugOwner = this._debugInfo = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, ZS || typeof Object.preventExtensions != "function" || Object.preventExtensions(this);
    }
    function Lm(e) {
      return e = e.prototype, !(!e || !e.isReactComponent);
    }
    function hu(e, t) {
      var a = e.alternate;
      switch (a === null ? (a = N(
        e.tag,
        t,
        e.key,
        e.mode
      ), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugOwner = e._debugOwner, a._debugStack = e._debugStack, a._debugTask = e._debugTask, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null, a.actualDuration = -0, a.actualStartTime = -1.1), a.flags = e.flags & 65011712, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue, t = e.dependencies, a.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext,
        _debugThenableState: t._debugThenableState
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.refCleanup = e.refCleanup, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugInfo = e._debugInfo, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case 0:
        case 15:
          a.type = Yi(e.type);
          break;
        case 1:
          a.type = Yi(e.type);
          break;
        case 11:
          a.type = gd(e.type);
      }
      return a;
    }
    function Xm(e, t) {
      e.flags &= 65011714;
      var a = e.alternate;
      return a === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0) : (e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type, t = a.dependencies, e.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext,
        _debugThenableState: t._debugThenableState
      }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration), e;
    }
    function Cc(e, t, a, i, o, f) {
      var d = 0, h = e;
      if (typeof e == "function")
        Lm(e) && (d = 1), h = Yi(h);
      else if (typeof e == "string")
        d = Z(), d = Ug(e, a, d) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
      else
        e: switch (e) {
          case In:
            return t = N(31, a, t, o), t.elementType = In, t.lanes = f, t;
          case Mf:
            return Uc(
              a.children,
              o,
              f,
              t
            );
          case Aa:
            d = 8, o |= Ba, o |= bi;
            break;
          case Es:
            return e = a, i = o, typeof e.id != "string" && console.error(
              'Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.',
              typeof e.id
            ), t = N(12, e, t, i | Pe), t.elementType = Es, t.lanes = f, t.stateNode = { effectDuration: 0, passiveEffectDuration: 0 }, t;
          case co:
            return t = N(13, a, t, o), t.elementType = co, t.lanes = f, t;
          case Ha:
            return t = N(19, a, t, o), t.elementType = Ha, t.lanes = f, t;
          default:
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case Fn:
                  d = 10;
                  break e;
                case Mh:
                  d = 9;
                  break e;
                case Cf:
                  d = 11, h = gd(h);
                  break e;
                case Ts:
                  d = 14;
                  break e;
                case na:
                  d = 16, h = null;
                  break e;
              }
            h = "", (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (h += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), e === null ? a = "null" : El(e) ? a = "array" : e !== void 0 && e.$$typeof === On ? (a = "<" + (Ge(e.type) || "Unknown") + " />", h = " Did you accidentally export a JSX literal instead of a component?") : a = typeof e, (d = i ? Ye(i) : null) && (h += `

Check the render method of \`` + d + "`."), d = 29, a = Error(
              "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + (a + "." + h)
            ), h = null;
        }
      return t = N(d, a, t, o), t.elementType = e, t.type = h, t.lanes = f, t._debugOwner = i, t;
    }
    function ji(e, t, a) {
      return t = Cc(
        e.type,
        e.key,
        e.props,
        e._owner,
        t,
        a
      ), t._debugOwner = e._owner, t._debugStack = e._debugStack, t._debugTask = e._debugTask, t;
    }
    function Uc(e, t, a, i) {
      return e = N(7, e, i, t), e.lanes = a, e;
    }
    function Qo(e, t, a) {
      return e = N(6, e, null, t), e.lanes = a, e;
    }
    function Qm(e) {
      var t = N(18, null, null, Ne);
      return t.stateNode = e, t;
    }
    function vd(e, t, a) {
      return t = N(
        4,
        e.children !== null ? e.children : [],
        e.key,
        t
      ), t.lanes = a, t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation
      }, t;
    }
    function ra(e, t) {
      if (typeof e == "object" && e !== null) {
        var a = z1.get(e);
        return a !== void 0 ? a : (t = {
          value: e,
          source: t,
          stack: Re(t)
        }, z1.set(e, t), t);
      }
      return {
        value: e,
        source: t,
        stack: Re(t)
      };
    }
    function Yn(e, t) {
      qi(), kh[Wh++] = Np, kh[Wh++] = Pg, Pg = e, Np = t;
    }
    function Vm(e, t, a) {
      qi(), Xu[Qu++] = yo, Xu[Qu++] = po, Xu[Qu++] = Ms, Ms = e;
      var i = yo;
      e = po;
      var o = 32 - kl(i) - 1;
      i &= ~(1 << o), a += 1;
      var f = 32 - kl(t) + o;
      if (30 < f) {
        var d = o - o % 5;
        f = (i & (1 << d) - 1).toString(32), i >>= d, o -= d, yo = 1 << 32 - kl(t) + o | a << o | i, po = f + e;
      } else
        yo = 1 << f | a << o | i, po = e;
    }
    function Sd(e) {
      qi(), e.return !== null && (Yn(e, 1), Vm(e, 1, 0));
    }
    function bd(e) {
      for (; e === Pg; )
        Pg = kh[--Wh], kh[Wh] = null, Np = kh[--Wh], kh[Wh] = null;
      for (; e === Ms; )
        Ms = Xu[--Qu], Xu[Qu] = null, po = Xu[--Qu], Xu[Qu] = null, yo = Xu[--Qu], Xu[Qu] = null;
    }
    function q0() {
      return qi(), Ms !== null ? { id: yo, overflow: po } : null;
    }
    function x0(e, t) {
      qi(), Xu[Qu++] = yo, Xu[Qu++] = po, Xu[Qu++] = Ms, yo = t.id, po = t.overflow, Ms = e;
    }
    function qi() {
      ft || console.error(
        "Expected to be hydrating. This is a bug in React. Please file an issue."
      );
    }
    function Hc(e, t) {
      if (e.return === null) {
        if (eu === null)
          eu = {
            fiber: e,
            children: [],
            serverProps: void 0,
            serverTail: [],
            distanceFromLeaf: t
          };
        else {
          if (eu.fiber !== e)
            throw Error(
              "Saw multiple hydration diff roots in a pass. This is a bug in React."
            );
          eu.distanceFromLeaf > t && (eu.distanceFromLeaf = t);
        }
        return eu;
      }
      var a = Hc(
        e.return,
        t + 1
      ).children;
      return 0 < a.length && a[a.length - 1].fiber === e ? (a = a[a.length - 1], a.distanceFromLeaf > t && (a.distanceFromLeaf = t), a) : (t = {
        fiber: e,
        children: [],
        serverProps: void 0,
        serverTail: [],
        distanceFromLeaf: t
      }, a.push(t), t);
    }
    function w0() {
      ft && console.error(
        "We should not be hydrating here. This is a bug in React. Please file a bug."
      );
    }
    function la(e, t) {
      hc || (e = Hc(e, 0), e.serverProps = null, t !== null && (t = Dg(t), e.serverTail.push(t)));
    }
    function yn(e) {
      var t = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : !1, a = "", i = eu;
      throw i !== null && (eu = null, a = Om(i)), Or(
        ra(
          Error(
            "Hydration failed because the server rendered " + (t ? "text" : "HTML") + ` didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch \`if (typeof window !== 'undefined')\`.
- Variable input such as \`Date.now()\` or \`Math.random()\` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch` + a
          ),
          e
        )
      ), D1;
    }
    function Zm(e) {
      var t = e.stateNode, a = e.type, i = e.memoizedProps;
      switch (t[Pt] = e, t[Oa] = i, Ea(a, i), a) {
        case "dialog":
          He("cancel", t), He("close", t);
          break;
        case "iframe":
        case "object":
        case "embed":
          He("load", t);
          break;
        case "video":
        case "audio":
          for (a = 0; a < c0.length; a++)
            He(c0[a], t);
          break;
        case "source":
          He("error", t);
          break;
        case "img":
        case "image":
        case "link":
          He("error", t), He("load", t);
          break;
        case "details":
          He("toggle", t);
          break;
        case "input":
          ea("input", i), He("invalid", t), fa(t, i), td(
            t,
            i.value,
            i.defaultValue,
            i.checked,
            i.defaultChecked,
            i.type,
            i.name,
            !0
          );
          break;
        case "option":
          T0(t, i);
          break;
        case "select":
          ea("select", i), He("invalid", t), ld(t, i);
          break;
        case "textarea":
          ea("textarea", i), He("invalid", t), bc(t, i), No(
            t,
            i.value,
            i.defaultValue,
            i.children
          );
      }
      a = i.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || i.suppressHydrationWarning === !0 || Ky(t.textContent, a) ? (i.popover != null && (He("beforetoggle", t), He("toggle", t)), i.onScroll != null && He("scroll", t), i.onScrollEnd != null && He("scrollend", t), i.onClick != null && (t.onclick = hn), t = !0) : t = !1, t || yn(e, !0);
    }
    function Jm(e) {
      for (Ra = e.return; Ra; )
        switch (Ra.tag) {
          case 5:
          case 31:
          case 13:
            Vu = !1;
            return;
          case 27:
          case 3:
            Vu = !0;
            return;
          default:
            Ra = Ra.return;
        }
    }
    function Nc(e) {
      if (e !== Ra) return !1;
      if (!ft)
        return Jm(e), ft = !0, !1;
      var t = e.tag, a;
      if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = e.type, a = !(a !== "form" && a !== "button") || Ef(e.type, e.memoizedProps)), a = !a), a && tl) {
        for (a = tl; a; ) {
          var i = Hc(e, 0), o = Dg(a);
          i.serverTail.push(o), a = o.type === "Suspense" ? Of(a) : tn(a.nextSibling);
        }
        yn(e);
      }
      if (Jm(e), t === 13) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e)
          throw Error(
            "Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue."
          );
        tl = Of(e);
      } else if (t === 31) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e)
          throw Error(
            "Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue."
          );
        tl = Of(e);
      } else
        t === 27 ? (t = tl, ic(e.type) ? (e = pS, pS = null, tl = e) : tl = t) : tl = Ra ? tn(e.stateNode.nextSibling) : null;
      return !0;
    }
    function xi() {
      tl = Ra = null, hc = ft = !1;
    }
    function Ar() {
      var e = Zf;
      return e !== null && (rn === null ? rn = e : rn.push.apply(
        rn,
        e
      ), Zf = null), e;
    }
    function Or(e) {
      Zf === null ? Zf = [e] : Zf.push(e);
    }
    function wi() {
      var e = eu;
      if (e !== null) {
        eu = null;
        for (var t = Om(e); 0 < e.children.length; )
          e = e.children[0];
        se(e.fiber, function() {
          console.error(
            `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch \`if (typeof window !== 'undefined')\`.
- Variable input such as \`Date.now()\` or \`Math.random()\` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

%s%s`,
            "https://react.dev/link/hydration-mismatch",
            t
          );
        });
      }
    }
    function Vo() {
      Fh = ev = null, Ih = !1;
    }
    function pn(e, t, a) {
      Le(_1, t._currentValue, e), t._currentValue = a, Le(M1, t._currentRenderer, e), t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== KS && console.error(
        "Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."
      ), t._currentRenderer = KS;
    }
    function jn(e, t) {
      e._currentValue = _1.current;
      var a = M1.current;
      ve(M1, t), e._currentRenderer = a, ve(_1, t);
    }
    function Ed(e, t, a) {
      for (; e !== null; ) {
        var i = e.alternate;
        if ((e.childLanes & t) !== t ? (e.childLanes |= t, i !== null && (i.childLanes |= t)) : i !== null && (i.childLanes & t) !== t && (i.childLanes |= t), e === a) break;
        e = e.return;
      }
      e !== a && console.error(
        "Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue."
      );
    }
    function ei(e, t, a, i) {
      var o = e.child;
      for (o !== null && (o.return = e); o !== null; ) {
        var f = o.dependencies;
        if (f !== null) {
          var d = o.child;
          f = f.firstContext;
          e: for (; f !== null; ) {
            var h = f;
            f = o;
            for (var y = 0; y < t.length; y++)
              if (h.context === t[y]) {
                f.lanes |= a, h = f.alternate, h !== null && (h.lanes |= a), Ed(
                  f.return,
                  a,
                  e
                ), i || (d = null);
                break e;
              }
            f = h.next;
          }
        } else if (o.tag === 18) {
          if (d = o.return, d === null)
            throw Error(
              "We just came from a parent so we must have had a parent. This is a bug in React."
            );
          d.lanes |= a, f = d.alternate, f !== null && (f.lanes |= a), Ed(
            d,
            a,
            e
          ), d = null;
        } else d = o.child;
        if (d !== null) d.return = o;
        else
          for (d = o; d !== null; ) {
            if (d === e) {
              d = null;
              break;
            }
            if (o = d.sibling, o !== null) {
              o.return = d.return, d = o;
              break;
            }
            d = d.return;
          }
        o = d;
      }
    }
    function qn(e, t, a, i) {
      e = null;
      for (var o = t, f = !1; o !== null; ) {
        if (!f) {
          if ((o.flags & 524288) !== 0) f = !0;
          else if ((o.flags & 262144) !== 0) break;
        }
        if (o.tag === 10) {
          var d = o.alternate;
          if (d === null)
            throw Error("Should have a current fiber. This is a bug in React.");
          if (d = d.memoizedProps, d !== null) {
            var h = o.type;
            un(o.pendingProps.value, d.value) || (e !== null ? e.push(h) : e = [h]);
          }
        } else if (o === rc.current) {
          if (d = o.alternate, d === null)
            throw Error("Should have a current fiber. This is a bug in React.");
          d.memoizedState.memoizedState !== o.memoizedState.memoizedState && (e !== null ? e.push(d0) : e = [d0]);
        }
        o = o.return;
      }
      e !== null && ei(
        t,
        e,
        a,
        i
      ), t.flags |= 262144;
    }
    function Zo(e) {
      for (e = e.firstContext; e !== null; ) {
        if (!un(
          e.context._currentValue,
          e.memoizedValue
        ))
          return !0;
        e = e.next;
      }
      return !1;
    }
    function Gi(e) {
      ev = e, Fh = null, e = e.dependencies, e !== null && (e.firstContext = null);
    }
    function Et(e) {
      return Ih && console.error(
        "Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."
      ), Km(ev, e);
    }
    function Rr(e, t) {
      return ev === null && Gi(e), Km(e, t);
    }
    function Km(e, t) {
      var a = t._currentValue;
      if (t = { context: t, memoizedValue: a, next: null }, Fh === null) {
        if (e === null)
          throw Error(
            "Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."
          );
        Fh = t, e.dependencies = {
          lanes: 0,
          firstContext: t,
          _debugThenableState: null
        }, e.flags |= 524288;
      } else Fh = Fh.next = t;
      return a;
    }
    function Td() {
      return {
        controller: new kE(),
        data: /* @__PURE__ */ new Map(),
        refCount: 0
      };
    }
    function Bc(e) {
      e.controller.signal.aborted && console.warn(
        "A cache instance was retained after it was already freed. This likely indicates a bug in React."
      ), e.refCount++;
    }
    function zr(e) {
      e.refCount--, 0 > e.refCount && console.warn(
        "A cache instance was released after it was already freed. This likely indicates a bug in React."
      ), e.refCount === 0 && WE(FE, function() {
        e.controller.abort();
      });
    }
    function mu(e, t, a) {
      (e & 127) !== 0 ? 0 > mc && (mc = Ll(), Yp = tv(t), C1 = t, a != null && (U1 = re(a)), (mt & (Il | au)) !== oa && (gl = !0, Kf = Bp), e = Tf(), t = Nu(), e !== Ph || t !== jp ? Ph = -1.1 : t !== null && (Kf = Bp), Hs = e, jp = t) : (e & 4194048) !== 0 && 0 > Zu && (Zu = Ll(), qp = tv(t), $S = t, a != null && (kS = re(a)), 0 > bo) && (e = Tf(), t = Nu(), (e !== kf || t !== Ns) && (kf = -1.1), $f = e, Ns = t);
    }
    function G0(e) {
      if (0 > mc) {
        mc = Ll(), Yp = e._debugTask != null ? e._debugTask : null, (mt & (Il | au)) !== oa && (Kf = Bp);
        var t = Tf(), a = Nu();
        t !== Ph || a !== jp ? Ph = -1.1 : a !== null && (Kf = Bp), Hs = t, jp = a;
      }
      0 > Zu && (Zu = Ll(), qp = e._debugTask != null ? e._debugTask : null, 0 > bo) && (e = Tf(), t = Nu(), (e !== kf || t !== Ns) && (kf = -1.1), $f = e, Ns = t);
    }
    function yu() {
      var e = Cs;
      return Cs = 0, e;
    }
    function Jo(e) {
      var t = Cs;
      return Cs = e, t;
    }
    function sa(e) {
      var t = Cs;
      return Cs += e, t;
    }
    function Yc() {
      Ue = ze = -1.1;
    }
    function Wt() {
      var e = ze;
      return ze = -1.1, e;
    }
    function Nl(e) {
      0 <= e && (ze = e);
    }
    function gn() {
      var e = rl;
      return rl = -0, e;
    }
    function Qa(e) {
      0 <= e && (rl = e);
    }
    function Va() {
      var e = il;
      return il = null, e;
    }
    function vn() {
      var e = gl;
      return gl = !1, e;
    }
    function ti(e) {
      cn = Ll(), 0 > e.actualStartTime && (e.actualStartTime = cn);
    }
    function Ad(e) {
      if (0 <= cn) {
        var t = Ll() - cn;
        e.actualDuration += t, e.selfBaseDuration = t, cn = -1;
      }
    }
    function Dr(e) {
      if (0 <= cn) {
        var t = Ll() - cn;
        e.actualDuration += t, cn = -1;
      }
    }
    function da() {
      if (0 <= cn) {
        var e = Ll(), t = e - cn;
        cn = -1, Cs += t, rl += t, Ue = e;
      }
    }
    function L0(e) {
      il === null && (il = []), il.push(e), vo === null && (vo = []), vo.push(e);
    }
    function cl() {
      cn = Ll(), 0 > ze && (ze = cn);
    }
    function jc(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function li(e, t) {
      if (wp === null) {
        var a = wp = [];
        N1 = 0, Bs = Jy(), em = {
          status: "pending",
          value: void 0,
          then: function(i) {
            a.push(i);
          }
        };
      }
      return N1++, t.then($m, $m), t;
    }
    function $m() {
      if (--N1 === 0 && (-1 < Zu || (bo = -1.1), wp !== null)) {
        em !== null && (em.status = "fulfilled");
        var e = wp;
        wp = null, Bs = 0, em = null;
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function Od(e, t) {
      var a = [], i = {
        status: "pending",
        value: null,
        reason: null,
        then: function(o) {
          a.push(o);
        }
      };
      return e.then(
        function() {
          i.status = "fulfilled", i.value = t;
          for (var o = 0; o < a.length; o++) (0, a[o])(t);
        },
        function(o) {
          for (i.status = "rejected", i.reason = o, o = 0; o < a.length; o++)
            (0, a[o])(void 0);
        }
      ), i;
    }
    function ai() {
      var e = Ys.current;
      return e !== null ? e : Vt.pooledCache;
    }
    function Ko(e, t) {
      t === null ? Le(Ys, Ys.current, e) : Le(Ys, t.pool, e);
    }
    function km() {
      var e = ai();
      return e === null ? null : { parent: Gl._currentValue, pool: e };
    }
    function Rd() {
      return { didWarnAboutUncachedPromise: !1, thenables: [] };
    }
    function Wm(e) {
      return e = e.status, e === "fulfilled" || e === "rejected";
    }
    function Za(e, t, a) {
      L.actQueue !== null && (L.didUsePromise = !0);
      var i = e.thenables;
      if (a = i[a], a === void 0 ? i.push(t) : a !== t && (e.didWarnAboutUncachedPromise || (e.didWarnAboutUncachedPromise = !0, console.error(
        "A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework."
      )), t.then(hn, hn), t = a), t._debugInfo === void 0) {
        e = performance.now(), i = t.displayName;
        var o = {
          name: typeof i == "string" ? i : "Promise",
          start: e,
          end: e,
          value: t
        };
        t._debugInfo = [{ awaited: o }], t.status !== "fulfilled" && t.status !== "rejected" && (e = function() {
          o.end = performance.now();
        }, t.then(e, e));
      }
      switch (t.status) {
        case "fulfilled":
          return t.value;
        case "rejected":
          throw e = t.reason, _r(e), e;
        default:
          if (typeof t.status == "string")
            t.then(hn, hn);
          else {
            if (e = Vt, e !== null && 100 < e.shellSuspendCounter)
              throw Error(
                "An unknown Component is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server."
              );
            e = t, e.status = "pending", e.then(
              function(f) {
                if (t.status === "pending") {
                  var d = t;
                  d.status = "fulfilled", d.value = f;
                }
              },
              function(f) {
                if (t.status === "pending") {
                  var d = t;
                  d.status = "rejected", d.reason = f;
                }
              }
            );
          }
          switch (t.status) {
            case "fulfilled":
              return t.value;
            case "rejected":
              throw e = t.reason, _r(e), e;
          }
          throw qs = t, Jp = !0, tm;
      }
    }
    function Ja(e) {
      try {
        return lT(e);
      } catch (t) {
        throw t !== null && typeof t == "object" && typeof t.then == "function" ? (qs = t, Jp = !0, tm) : t;
      }
    }
    function qc() {
      if (qs === null)
        throw Error(
          "Expected a suspended thenable. This is a bug in React. Please file an issue."
        );
      var e = qs;
      return qs = null, Jp = !1, e;
    }
    function _r(e) {
      if (e === tm || e === fv)
        throw Error(
          "Hooks are not supported inside an async component. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server."
        );
    }
    function dl(e) {
      var t = et;
      return e != null && (et = t === null ? e : t.concat(e)), t;
    }
    function za() {
      var e = et;
      if (e != null) {
        for (var t = e.length - 1; 0 <= t; t--)
          if (e[t].name != null) {
            var a = e[t].debugTask;
            if (a != null) return a;
          }
      }
      return null;
    }
    function ha(e, t, a) {
      for (var i = Object.keys(e.props), o = 0; o < i.length; o++) {
        var f = i[o];
        if (f !== "children" && f !== "key") {
          t === null && (t = ji(e, a.mode, 0), t._debugInfo = et, t.return = a), se(
            t,
            function(d) {
              console.error(
                "Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.",
                d
              );
            },
            f
          );
          break;
        }
      }
    }
    function xn(e) {
      var t = Kp;
      return Kp += 1, lm === null && (lm = Rd()), Za(lm, e, t);
    }
    function Da(e, t) {
      t = t.props.ref, e.ref = t !== void 0 ? t : null;
    }
    function wn(e, t) {
      throw t.$$typeof === qg ? Error(
        `A React Element from an older version of React was rendered. This is not supported. It can happen if:
- Multiple copies of the "react" package is used.
- A library pre-bundled an old copy of "react" or "react/jsx-runtime".
- A compiler tries to "inline" JSX instead of using the runtime.`
      ) : (e = Object.prototype.toString.call(t), Error(
        "Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead."
      ));
    }
    function Sn(e, t) {
      var a = za();
      a !== null ? a.run(
        wn.bind(null, e, t)
      ) : wn(e, t);
    }
    function Fm(e, t) {
      var a = re(e) || "Component";
      yb[a] || (yb[a] = !0, t = t.displayName || t.name || "Component", e.tag === 3 ? console.error(
        `Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.
  root.render(%s)`,
        t,
        t,
        t
      ) : console.error(
        `Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.
  <%s>{%s}</%s>`,
        t,
        t,
        a,
        t,
        a
      ));
    }
    function $o(e, t) {
      var a = za();
      a !== null ? a.run(
        Fm.bind(null, e, t)
      ) : Fm(e, t);
    }
    function zd(e, t) {
      var a = re(e) || "Component";
      pb[a] || (pb[a] = !0, t = String(t), e.tag === 3 ? console.error(
        `Symbols are not valid as a React child.
  root.render(%s)`,
        t
      ) : console.error(
        `Symbols are not valid as a React child.
  <%s>%s</%s>`,
        a,
        t,
        a
      ));
    }
    function Mr(e, t) {
      var a = za();
      a !== null ? a.run(
        zd.bind(null, e, t)
      ) : zd(e, t);
    }
    function Bl(e) {
      function t(b, T) {
        if (e) {
          var O = b.deletions;
          O === null ? (b.deletions = [T], b.flags |= 16) : O.push(T);
        }
      }
      function a(b, T) {
        if (!e) return null;
        for (; T !== null; )
          t(b, T), T = T.sibling;
        return null;
      }
      function i(b) {
        for (var T = /* @__PURE__ */ new Map(); b !== null; )
          b.key !== null ? T.set(b.key, b) : T.set(b.index, b), b = b.sibling;
        return T;
      }
      function o(b, T) {
        return b = hu(b, T), b.index = 0, b.sibling = null, b;
      }
      function f(b, T, O) {
        return b.index = O, e ? (O = b.alternate, O !== null ? (O = O.index, O < T ? (b.flags |= 67108866, T) : O) : (b.flags |= 67108866, T)) : (b.flags |= 1048576, T);
      }
      function d(b) {
        return e && b.alternate === null && (b.flags |= 67108866), b;
      }
      function h(b, T, O, J) {
        return T === null || T.tag !== 6 ? (T = Qo(
          O,
          b.mode,
          J
        ), T.return = b, T._debugOwner = b, T._debugTask = b._debugTask, T._debugInfo = et, T) : (T = o(T, O), T.return = b, T._debugInfo = et, T);
      }
      function y(b, T, O, J) {
        var oe = O.type;
        return oe === Mf ? (T = R(
          b,
          T,
          O.props.children,
          J,
          O.key
        ), ha(O, T, b), T) : T !== null && (T.elementType === oe || Gm(T, O) || typeof oe == "object" && oe !== null && oe.$$typeof === na && Ja(oe) === T.type) ? (T = o(T, O.props), Da(T, O), T.return = b, T._debugOwner = O._owner, T._debugInfo = et, T) : (T = ji(O, b.mode, J), Da(T, O), T.return = b, T._debugInfo = et, T);
      }
      function p(b, T, O, J) {
        return T === null || T.tag !== 4 || T.stateNode.containerInfo !== O.containerInfo || T.stateNode.implementation !== O.implementation ? (T = vd(O, b.mode, J), T.return = b, T._debugInfo = et, T) : (T = o(T, O.children || []), T.return = b, T._debugInfo = et, T);
      }
      function R(b, T, O, J, oe) {
        return T === null || T.tag !== 7 ? (T = Uc(
          O,
          b.mode,
          J,
          oe
        ), T.return = b, T._debugOwner = b, T._debugTask = b._debugTask, T._debugInfo = et, T) : (T = o(T, O), T.return = b, T._debugInfo = et, T);
      }
      function _(b, T, O) {
        if (typeof T == "string" && T !== "" || typeof T == "number" || typeof T == "bigint")
          return T = Qo(
            "" + T,
            b.mode,
            O
          ), T.return = b, T._debugOwner = b, T._debugTask = b._debugTask, T._debugInfo = et, T;
        if (typeof T == "object" && T !== null) {
          switch (T.$$typeof) {
            case On:
              return O = ji(
                T,
                b.mode,
                O
              ), Da(O, T), O.return = b, b = dl(T._debugInfo), O._debugInfo = et, et = b, O;
            case oc:
              return T = vd(
                T,
                b.mode,
                O
              ), T.return = b, T._debugInfo = et, T;
            case na:
              var J = dl(T._debugInfo);
              return T = Ja(T), b = _(b, T, O), et = J, b;
          }
          if (El(T) || De(T))
            return O = Uc(
              T,
              b.mode,
              O,
              null
            ), O.return = b, O._debugOwner = b, O._debugTask = b._debugTask, b = dl(T._debugInfo), O._debugInfo = et, et = b, O;
          if (typeof T.then == "function")
            return J = dl(T._debugInfo), b = _(
              b,
              xn(T),
              O
            ), et = J, b;
          if (T.$$typeof === Fn)
            return _(
              b,
              Rr(b, T),
              O
            );
          Sn(b, T);
        }
        return typeof T == "function" && $o(b, T), typeof T == "symbol" && Mr(b, T), null;
      }
      function E(b, T, O, J) {
        var oe = T !== null ? T.key : null;
        if (typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint")
          return oe !== null ? null : h(b, T, "" + O, J);
        if (typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case On:
              return O.key === oe ? (oe = dl(O._debugInfo), b = y(
                b,
                T,
                O,
                J
              ), et = oe, b) : null;
            case oc:
              return O.key === oe ? p(b, T, O, J) : null;
            case na:
              return oe = dl(O._debugInfo), O = Ja(O), b = E(
                b,
                T,
                O,
                J
              ), et = oe, b;
          }
          if (El(O) || De(O))
            return oe !== null ? null : (oe = dl(O._debugInfo), b = R(
              b,
              T,
              O,
              J,
              null
            ), et = oe, b);
          if (typeof O.then == "function")
            return oe = dl(O._debugInfo), b = E(
              b,
              T,
              xn(O),
              J
            ), et = oe, b;
          if (O.$$typeof === Fn)
            return E(
              b,
              T,
              Rr(b, O),
              J
            );
          Sn(b, O);
        }
        return typeof O == "function" && $o(b, O), typeof O == "symbol" && Mr(b, O), null;
      }
      function x(b, T, O, J, oe) {
        if (typeof J == "string" && J !== "" || typeof J == "number" || typeof J == "bigint")
          return b = b.get(O) || null, h(T, b, "" + J, oe);
        if (typeof J == "object" && J !== null) {
          switch (J.$$typeof) {
            case On:
              return O = b.get(
                J.key === null ? O : J.key
              ) || null, b = dl(J._debugInfo), T = y(
                T,
                O,
                J,
                oe
              ), et = b, T;
            case oc:
              return b = b.get(
                J.key === null ? O : J.key
              ) || null, p(T, b, J, oe);
            case na:
              var xe = dl(J._debugInfo);
              return J = Ja(J), T = x(
                b,
                T,
                O,
                J,
                oe
              ), et = xe, T;
          }
          if (El(J) || De(J))
            return O = b.get(O) || null, b = dl(J._debugInfo), T = R(
              T,
              O,
              J,
              oe,
              null
            ), et = b, T;
          if (typeof J.then == "function")
            return xe = dl(J._debugInfo), T = x(
              b,
              T,
              O,
              xn(J),
              oe
            ), et = xe, T;
          if (J.$$typeof === Fn)
            return x(
              b,
              T,
              O,
              Rr(T, J),
              oe
            );
          Sn(T, J);
        }
        return typeof J == "function" && $o(T, J), typeof J == "symbol" && Mr(T, J), null;
      }
      function ue(b, T, O, J) {
        if (typeof O != "object" || O === null) return J;
        switch (O.$$typeof) {
          case On:
          case oc:
            Ae(b, T, O);
            var oe = O.key;
            if (typeof oe != "string") break;
            if (J === null) {
              J = /* @__PURE__ */ new Set(), J.add(oe);
              break;
            }
            if (!J.has(oe)) {
              J.add(oe);
              break;
            }
            se(T, function() {
              console.error(
                "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.",
                oe
              );
            });
            break;
          case na:
            O = Ja(O), ue(b, T, O, J);
        }
        return J;
      }
      function de(b, T, O, J) {
        for (var oe = null, xe = null, Oe = null, be = T, We = T = 0, ll = null; be !== null && We < O.length; We++) {
          be.index > We ? (ll = be, be = null) : ll = be.sibling;
          var Cl = E(
            b,
            be,
            O[We],
            J
          );
          if (Cl === null) {
            be === null && (be = ll);
            break;
          }
          oe = ue(
            b,
            Cl,
            O[We],
            oe
          ), e && be && Cl.alternate === null && t(b, be), T = f(Cl, T, We), Oe === null ? xe = Cl : Oe.sibling = Cl, Oe = Cl, be = ll;
        }
        if (We === O.length)
          return a(b, be), ft && Yn(b, We), xe;
        if (be === null) {
          for (; We < O.length; We++)
            be = _(b, O[We], J), be !== null && (oe = ue(
              b,
              be,
              O[We],
              oe
            ), T = f(
              be,
              T,
              We
            ), Oe === null ? xe = be : Oe.sibling = be, Oe = be);
          return ft && Yn(b, We), xe;
        }
        for (be = i(be); We < O.length; We++)
          ll = x(
            be,
            b,
            We,
            O[We],
            J
          ), ll !== null && (oe = ue(
            b,
            ll,
            O[We],
            oe
          ), e && ll.alternate !== null && be.delete(
            ll.key === null ? We : ll.key
          ), T = f(
            ll,
            T,
            We
          ), Oe === null ? xe = ll : Oe.sibling = ll, Oe = ll);
        return e && be.forEach(function(_o) {
          return t(b, _o);
        }), ft && Yn(b, We), xe;
      }
      function $t(b, T, O, J) {
        if (O == null)
          throw Error("An iterable object provided no iterator.");
        for (var oe = null, xe = null, Oe = T, be = T = 0, We = null, ll = null, Cl = O.next(); Oe !== null && !Cl.done; be++, Cl = O.next()) {
          Oe.index > be ? (We = Oe, Oe = null) : We = Oe.sibling;
          var _o = E(b, Oe, Cl.value, J);
          if (_o === null) {
            Oe === null && (Oe = We);
            break;
          }
          ll = ue(
            b,
            _o,
            Cl.value,
            ll
          ), e && Oe && _o.alternate === null && t(b, Oe), T = f(_o, T, be), xe === null ? oe = _o : xe.sibling = _o, xe = _o, Oe = We;
        }
        if (Cl.done)
          return a(b, Oe), ft && Yn(b, be), oe;
        if (Oe === null) {
          for (; !Cl.done; be++, Cl = O.next())
            Oe = _(b, Cl.value, J), Oe !== null && (ll = ue(
              b,
              Oe,
              Cl.value,
              ll
            ), T = f(
              Oe,
              T,
              be
            ), xe === null ? oe = Oe : xe.sibling = Oe, xe = Oe);
          return ft && Yn(b, be), oe;
        }
        for (Oe = i(Oe); !Cl.done; be++, Cl = O.next())
          We = x(
            Oe,
            b,
            be,
            Cl.value,
            J
          ), We !== null && (ll = ue(
            b,
            We,
            Cl.value,
            ll
          ), e && We.alternate !== null && Oe.delete(
            We.key === null ? be : We.key
          ), T = f(
            We,
            T,
            be
          ), xe === null ? oe = We : xe.sibling = We, xe = We);
        return e && Oe.forEach(function(zT) {
          return t(b, zT);
        }), ft && Yn(b, be), oe;
      }
      function st(b, T, O, J) {
        if (typeof O == "object" && O !== null && O.type === Mf && O.key === null && (ha(O, null, b), O = O.props.children), typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case On:
              var oe = dl(O._debugInfo);
              e: {
                for (var xe = O.key; T !== null; ) {
                  if (T.key === xe) {
                    if (xe = O.type, xe === Mf) {
                      if (T.tag === 7) {
                        a(
                          b,
                          T.sibling
                        ), J = o(
                          T,
                          O.props.children
                        ), J.return = b, J._debugOwner = O._owner, J._debugInfo = et, ha(O, J, b), b = J;
                        break e;
                      }
                    } else if (T.elementType === xe || Gm(
                      T,
                      O
                    ) || typeof xe == "object" && xe !== null && xe.$$typeof === na && Ja(xe) === T.type) {
                      a(
                        b,
                        T.sibling
                      ), J = o(T, O.props), Da(J, O), J.return = b, J._debugOwner = O._owner, J._debugInfo = et, b = J;
                      break e;
                    }
                    a(b, T);
                    break;
                  } else t(b, T);
                  T = T.sibling;
                }
                O.type === Mf ? (J = Uc(
                  O.props.children,
                  b.mode,
                  J,
                  O.key
                ), J.return = b, J._debugOwner = b, J._debugTask = b._debugTask, J._debugInfo = et, ha(O, J, b), b = J) : (J = ji(
                  O,
                  b.mode,
                  J
                ), Da(J, O), J.return = b, J._debugInfo = et, b = J);
              }
              return b = d(b), et = oe, b;
            case oc:
              e: {
                for (oe = O, O = oe.key; T !== null; ) {
                  if (T.key === O)
                    if (T.tag === 4 && T.stateNode.containerInfo === oe.containerInfo && T.stateNode.implementation === oe.implementation) {
                      a(
                        b,
                        T.sibling
                      ), J = o(
                        T,
                        oe.children || []
                      ), J.return = b, b = J;
                      break e;
                    } else {
                      a(b, T);
                      break;
                    }
                  else t(b, T);
                  T = T.sibling;
                }
                J = vd(
                  oe,
                  b.mode,
                  J
                ), J.return = b, b = J;
              }
              return d(b);
            case na:
              return oe = dl(O._debugInfo), O = Ja(O), b = st(
                b,
                T,
                O,
                J
              ), et = oe, b;
          }
          if (El(O))
            return oe = dl(O._debugInfo), b = de(
              b,
              T,
              O,
              J
            ), et = oe, b;
          if (De(O)) {
            if (oe = dl(O._debugInfo), xe = De(O), typeof xe != "function")
              throw Error(
                "An object is not an iterable. This error is likely caused by a bug in React. Please file an issue."
              );
            var Oe = xe.call(O);
            return Oe === O ? (b.tag !== 0 || Object.prototype.toString.call(b.type) !== "[object GeneratorFunction]" || Object.prototype.toString.call(Oe) !== "[object Generator]") && (hb || console.error(
              "Using Iterators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. You can also use an Iterable that can iterate multiple times over the same items."
            ), hb = !0) : O.entries !== xe || q1 || (console.error(
              "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
            ), q1 = !0), b = $t(
              b,
              T,
              Oe,
              J
            ), et = oe, b;
          }
          if (typeof O.then == "function")
            return oe = dl(O._debugInfo), b = st(
              b,
              T,
              xn(O),
              J
            ), et = oe, b;
          if (O.$$typeof === Fn)
            return st(
              b,
              T,
              Rr(b, O),
              J
            );
          Sn(b, O);
        }
        return typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint" ? (oe = "" + O, T !== null && T.tag === 6 ? (a(
          b,
          T.sibling
        ), J = o(T, oe), J.return = b, b = J) : (a(b, T), J = Qo(
          oe,
          b.mode,
          J
        ), J.return = b, J._debugOwner = b, J._debugTask = b._debugTask, J._debugInfo = et, b = J), d(b)) : (typeof O == "function" && $o(b, O), typeof O == "symbol" && Mr(b, O), a(b, T));
      }
      return function(b, T, O, J) {
        var oe = et;
        et = null;
        try {
          Kp = 0;
          var xe = st(
            b,
            T,
            O,
            J
          );
          return lm = null, xe;
        } catch (ll) {
          if (ll === tm || ll === fv) throw ll;
          var Oe = N(29, ll, null, b.mode);
          Oe.lanes = J, Oe.return = b;
          var be = Oe._debugInfo = et;
          if (Oe._debugOwner = b._debugOwner, Oe._debugTask = b._debugTask, be != null) {
            for (var We = be.length - 1; 0 <= We; We--)
              if (typeof be[We].stack == "string") {
                Oe._debugOwner = be[We], Oe._debugTask = be[We].debugTask;
                break;
              }
          }
          return Oe;
        } finally {
          et = oe;
        }
      };
    }
    function Gt(e, t) {
      var a = El(e);
      return e = !a && typeof De(e) == "function", a || e ? (a = a ? "array" : "iterable", console.error(
        "A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>",
        a,
        t,
        a
      ), !1) : !0;
    }
    function ct(e) {
      e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null
      };
    }
    function pu(e, t) {
      e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        callbacks: null
      });
    }
    function Ol(e) {
      return {
        lane: e,
        tag: vb,
        payload: null,
        callback: null,
        next: null
      };
    }
    function gu(e, t, a) {
      var i = e.updateQueue;
      if (i === null) return null;
      if (i = i.shared, w1 === i && !Eb) {
        var o = re(e);
        console.error(
          `An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback.

Please update the following component: %s`,
          o
        ), Eb = !0;
      }
      return (mt & Il) !== oa ? (o = i.pending, o === null ? t.next = t : (t.next = o.next, o.next = t), i.pending = t, t = Tr(e), wm(e, null, a), t) : (Xo(e, i, t, a), Tr(e));
    }
    function bn(e, t, a) {
      if (t = t.updateQueue, t !== null && (t = t.shared, (a & 4194048) !== 0)) {
        var i = t.lanes;
        i &= e.pendingLanes, a |= i, t.lanes = a, sr(e, a);
      }
    }
    function Cr(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null && (i = i.updateQueue, a === i)) {
        var o = null, f = null;
        if (a = a.firstBaseUpdate, a !== null) {
          do {
            var d = {
              lane: a.lane,
              tag: a.tag,
              payload: a.payload,
              callback: null,
              next: null
            };
            f === null ? o = f = d : f = f.next = d, a = a.next;
          } while (a !== null);
          f === null ? o = f = t : f = f.next = t;
        } else o = f = t;
        a = {
          baseState: i.baseState,
          firstBaseUpdate: o,
          lastBaseUpdate: f,
          shared: i.shared,
          callbacks: i.callbacks
        }, e.updateQueue = a;
        return;
      }
      e = a.lastBaseUpdate, e === null ? a.firstBaseUpdate = t : e.next = t, a.lastBaseUpdate = t;
    }
    function ko() {
      if (G1) {
        var e = em;
        if (e !== null) throw e;
      }
    }
    function vu(e, t, a, i) {
      G1 = !1;
      var o = e.updateQueue;
      Wf = !1, w1 = o.shared;
      var f = o.firstBaseUpdate, d = o.lastBaseUpdate, h = o.shared.pending;
      if (h !== null) {
        o.shared.pending = null;
        var y = h, p = y.next;
        y.next = null, d === null ? f = p : d.next = p, d = y;
        var R = e.alternate;
        R !== null && (R = R.updateQueue, h = R.lastBaseUpdate, h !== d && (h === null ? R.firstBaseUpdate = p : h.next = p, R.lastBaseUpdate = y));
      }
      if (f !== null) {
        var _ = o.baseState;
        d = 0, R = p = y = null, h = f;
        do {
          var E = h.lane & -536870913, x = E !== h.lane;
          if (x ? (tt & E) === E : (i & E) === E) {
            E !== 0 && E === Bs && (G1 = !0), R !== null && (R = R.next = {
              lane: 0,
              tag: h.tag,
              payload: h.payload,
              callback: null,
              next: null
            });
            e: {
              E = e;
              var ue = h, de = t, $t = a;
              switch (ue.tag) {
                case Sb:
                  if (ue = ue.payload, typeof ue == "function") {
                    Ih = !0;
                    var st = ue.call(
                      $t,
                      _,
                      de
                    );
                    if (E.mode & Ba) {
                      me(!0);
                      try {
                        ue.call($t, _, de);
                      } finally {
                        me(!1);
                      }
                    }
                    Ih = !1, _ = st;
                    break e;
                  }
                  _ = ue;
                  break e;
                case x1:
                  E.flags = E.flags & -65537 | 128;
                case vb:
                  if (st = ue.payload, typeof st == "function") {
                    if (Ih = !0, ue = st.call(
                      $t,
                      _,
                      de
                    ), E.mode & Ba) {
                      me(!0);
                      try {
                        st.call($t, _, de);
                      } finally {
                        me(!1);
                      }
                    }
                    Ih = !1;
                  } else ue = st;
                  if (ue == null) break e;
                  _ = Ie({}, _, ue);
                  break e;
                case bb:
                  Wf = !0;
              }
            }
            E = h.callback, E !== null && (e.flags |= 64, x && (e.flags |= 8192), x = o.callbacks, x === null ? o.callbacks = [E] : x.push(E));
          } else
            x = {
              lane: E,
              tag: h.tag,
              payload: h.payload,
              callback: h.callback,
              next: null
            }, R === null ? (p = R = x, y = _) : R = R.next = x, d |= E;
          if (h = h.next, h === null) {
            if (h = o.shared.pending, h === null)
              break;
            x = h, h = x.next, x.next = null, o.lastBaseUpdate = x, o.shared.pending = null;
          }
        } while (!0);
        R === null && (y = _), o.baseState = y, o.firstBaseUpdate = p, o.lastBaseUpdate = R, f === null && (o.shared.lanes = 0), Pf |= d, e.lanes = d, e.memoizedState = _;
      }
      w1 = null;
    }
    function Li(e, t) {
      if (typeof e != "function")
        throw Error(
          "Invalid argument passed as callback. Expected a function. Instead received: " + e
        );
      e.call(t);
    }
    function Im(e, t) {
      var a = e.shared.hiddenCallbacks;
      if (a !== null)
        for (e.shared.hiddenCallbacks = null, e = 0; e < a.length; e++)
          Li(a[e], t);
    }
    function Wo(e, t) {
      var a = e.callbacks;
      if (a !== null)
        for (e.callbacks = null, e = 0; e < a.length; e++)
          Li(a[e], t);
    }
    function Dd(e, t) {
      var a = pc;
      Le(sv, a, e), Le(am, t, e), pc = a | t.baseLanes;
    }
    function ni(e) {
      Le(sv, pc, e), Le(
        am,
        am.current,
        e
      );
    }
    function Gn(e) {
      pc = sv.current, ve(am, e), ve(sv, e);
    }
    function ma(e) {
      var t = e.alternate;
      Le(
        Ml,
        Ml.current & nm,
        e
      ), Le(tu, e, e), Ju === null && (t === null || am.current !== null || t.memoizedState !== null) && (Ju = e);
    }
    function Ln(e) {
      Le(Ml, Ml.current, e), Le(tu, e, e), Ju === null && (Ju = e);
    }
    function _d(e) {
      e.tag === 22 ? (Le(Ml, Ml.current, e), Le(tu, e, e), Ju === null && (Ju = e)) : Su(e);
    }
    function Su(e) {
      Le(Ml, Ml.current, e), Le(
        tu,
        tu.current,
        e
      );
    }
    function Yl(e) {
      ve(tu, e), Ju === e && (Ju = null), ve(Ml, e);
    }
    function xc(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === 13) {
          var a = t.memoizedState;
          if (a !== null && (a = a.dehydrated, a === null || ds(a) || ky(a)))
            return t;
        } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
          if ((t.flags & 128) !== 0) return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    function je() {
      var e = G;
      $u === null ? $u = [e] : $u.push(e);
    }
    function W() {
      var e = G;
      if ($u !== null && (Ao++, $u[Ao] !== e)) {
        var t = re(qe);
        if (!Tb.has(t) && (Tb.add(t), $u !== null)) {
          for (var a = "", i = 0; i <= Ao; i++) {
            var o = $u[i], f = i === Ao ? e : o;
            for (o = i + 1 + ". " + o; 30 > o.length; )
              o += " ";
            o += f + `
`, a += o;
          }
          console.error(
            `React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`,
            t,
            a
          );
        }
      }
    }
    function ui(e) {
      e == null || El(e) || console.error(
        "%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.",
        G,
        typeof e
      );
    }
    function Ur() {
      var e = re(qe);
      Ob.has(e) || (Ob.add(e), console.error(
        "ReactDOM.useFormState has been renamed to React.useActionState. Please update %s to use React.useActionState.",
        e
      ));
    }
    function ol() {
      throw Error(
        `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
      );
    }
    function Pm(e, t) {
      if (Wp) return !1;
      if (t === null)
        return console.error(
          "%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.",
          G
        ), !1;
      e.length !== t.length && console.error(
        `The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`,
        G,
        "[" + t.join(", ") + "]",
        "[" + e.join(", ") + "]"
      );
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!un(e[a], t[a])) return !1;
      return !0;
    }
    function ey(e, t, a, i, o, f) {
      Eo = f, qe = t, $u = e !== null ? e._debugHookTypes : null, Ao = -1, Wp = e !== null && e.type !== t.type, (Object.prototype.toString.call(a) === "[object AsyncFunction]" || Object.prototype.toString.call(a) === "[object AsyncGeneratorFunction]") && (f = re(qe), L1.has(f) || (L1.add(f), console.error(
        "%s is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.",
        f === null ? "An unknown Component" : "<" + f + ">"
      ))), t.memoizedState = null, t.updateQueue = null, t.lanes = 0, L.H = e !== null && e.memoizedState !== null ? Q1 : $u !== null ? Rb : X1, ws = f = (t.mode & Ba) !== Ne;
      var d = B1(a, i, o);
      if (ws = !1, im && (d = Hr(
        t,
        a,
        i,
        o
      )), f) {
        me(!0);
        try {
          d = Hr(
            t,
            a,
            i,
            o
          );
        } finally {
          me(!1);
        }
      }
      return hl(e, t), d;
    }
    function hl(e, t) {
      t._debugHookTypes = $u, t.dependencies === null ? To !== null && (t.dependencies = {
        lanes: 0,
        firstContext: null,
        _debugThenableState: To
      }) : t.dependencies._debugThenableState = To, L.H = Fp;
      var a = Qt !== null && Qt.next !== null;
      if (Eo = 0, $u = G = Xl = Qt = qe = null, Ao = -1, e !== null && (e.flags & 65011712) !== (t.flags & 65011712) && console.error(
        "Internal React error: Expected static flag was missing. Please notify the React team."
      ), hv = !1, kp = 0, To = null, a)
        throw Error(
          "Rendered fewer hooks than expected. This may be caused by an accidental early return statement."
        );
      e === null || Ql || (e = e.dependencies, e !== null && Zo(e) && (Ql = !0)), Jp ? (Jp = !1, e = !0) : e = !1, e && (t = re(t) || "Unknown", Ab.has(t) || L1.has(t) || (Ab.add(t), console.error(
        "`use` was called from inside a try/catch block. This is not allowed and can lead to unexpected behavior. To handle errors triggered by `use`, wrap your component in a error boundary."
      )));
    }
    function Hr(e, t, a, i) {
      qe = e;
      var o = 0;
      do {
        if (im && (To = null), kp = 0, im = !1, o >= nT)
          throw Error(
            "Too many re-renders. React limits the number of renders to prevent an infinite loop."
          );
        if (o += 1, Wp = !1, Xl = Qt = null, e.updateQueue != null) {
          var f = e.updateQueue;
          f.lastEffect = null, f.events = null, f.stores = null, f.memoCache != null && (f.memoCache.index = 0);
        }
        Ao = -1, L.H = zb, f = B1(t, a, i);
      } while (im);
      return f;
    }
    function Nr() {
      var e = L.H, t = e.useState()[0];
      return t = typeof t.then == "function" ? jr(t) : t, e = e.useState()[0], (Qt !== null ? Qt.memoizedState : null) !== e && (qe.flags |= 1024), t;
    }
    function wc() {
      var e = mv !== 0;
      return mv = 0, e;
    }
    function Br(e, t, a) {
      t.updateQueue = e.updateQueue, t.flags = (t.mode & bi) !== Ne ? t.flags & -402655237 : t.flags & -2053, e.lanes &= ~a;
    }
    function Xi(e) {
      if (hv) {
        for (e = e.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        hv = !1;
      }
      Eo = 0, $u = Xl = Qt = qe = null, Ao = -1, G = null, im = !1, kp = mv = 0, To = null;
    }
    function Sl() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return Xl === null ? qe.memoizedState = Xl = e : Xl = Xl.next = e, Xl;
    }
    function Rt() {
      if (Qt === null) {
        var e = qe.alternate;
        e = e !== null ? e.memoizedState : null;
      } else e = Qt.next;
      var t = Xl === null ? qe.memoizedState : Xl.next;
      if (t !== null)
        Xl = t, Qt = e;
      else {
        if (e === null)
          throw qe.alternate === null ? Error(
            "Update hook called on initial render. This is likely a bug in React. Please file an issue."
          ) : Error("Rendered more hooks than during the previous render.");
        Qt = e, e = {
          memoizedState: Qt.memoizedState,
          baseState: Qt.baseState,
          baseQueue: Qt.baseQueue,
          queue: Qt.queue,
          next: null
        }, Xl === null ? qe.memoizedState = Xl = e : Xl = Xl.next = e;
      }
      return Xl;
    }
    function Yr() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function jr(e) {
      var t = kp;
      return kp += 1, To === null && (To = Rd()), e = Za(To, e, t), t = qe, (Xl === null ? t.memoizedState : Xl.next) === null && (t = t.alternate, L.H = t !== null && t.memoizedState !== null ? Q1 : X1), e;
    }
    function ii(e) {
      if (e !== null && typeof e == "object") {
        if (typeof e.then == "function") return jr(e);
        if (e.$$typeof === Fn) return Et(e);
      }
      throw Error("An unsupported type was passed to use(): " + String(e));
    }
    function Ka(e) {
      var t = null, a = qe.updateQueue;
      if (a !== null && (t = a.memoCache), t == null) {
        var i = qe.alternate;
        i !== null && (i = i.updateQueue, i !== null && (i = i.memoCache, i != null && (t = {
          data: i.data.map(function(o) {
            return o.slice();
          }),
          index: 0
        })));
      }
      if (t == null && (t = { data: [], index: 0 }), a === null && (a = Yr(), qe.updateQueue = a), a.memoCache = t, a = t.data[t.index], a === void 0 || Wp)
        for (a = t.data[t.index] = Array(e), i = 0; i < e; i++)
          a[i] = c1;
      else
        a.length !== e && console.error(
          "Expected a constant size argument for each invocation of useMemoCache. The previous cache was allocated with size %s but size %s was requested.",
          a.length,
          e
        );
      return t.index++, a;
    }
    function $a(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Fo(e, t, a) {
      var i = Sl();
      if (a !== void 0) {
        var o = a(t);
        if (ws) {
          me(!0);
          try {
            a(t);
          } finally {
            me(!1);
          }
        }
      } else o = t;
      return i.memoizedState = i.baseState = o, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: o
      }, i.queue = e, e = e.dispatch = l1.bind(
        null,
        qe,
        e
      ), [i.memoizedState, e];
    }
    function Gc(e) {
      var t = Rt();
      return Qi(t, Qt, e);
    }
    function Qi(e, t, a) {
      var i = e.queue;
      if (i === null)
        throw Error(
          "Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call)"
        );
      i.lastRenderedReducer = a;
      var o = e.baseQueue, f = i.pending;
      if (f !== null) {
        if (o !== null) {
          var d = o.next;
          o.next = f.next, f.next = d;
        }
        t.baseQueue !== o && console.error(
          "Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."
        ), t.baseQueue = o = f, i.pending = null;
      }
      if (f = e.baseState, o === null) e.memoizedState = f;
      else {
        t = o.next;
        var h = d = null, y = null, p = t, R = !1;
        do {
          var _ = p.lane & -536870913;
          if (_ !== p.lane ? (tt & _) === _ : (Eo & _) === _) {
            var E = p.revertLane;
            if (E === 0)
              y !== null && (y = y.next = {
                lane: 0,
                revertLane: 0,
                gesture: null,
                action: p.action,
                hasEagerState: p.hasEagerState,
                eagerState: p.eagerState,
                next: null
              }), _ === Bs && (R = !0);
            else if ((Eo & E) === E) {
              p = p.next, E === Bs && (R = !0);
              continue;
            } else
              _ = {
                lane: 0,
                revertLane: p.revertLane,
                gesture: null,
                action: p.action,
                hasEagerState: p.hasEagerState,
                eagerState: p.eagerState,
                next: null
              }, y === null ? (h = y = _, d = f) : y = y.next = _, qe.lanes |= E, Pf |= E;
            _ = p.action, ws && a(f, _), f = p.hasEagerState ? p.eagerState : a(f, _);
          } else
            E = {
              lane: _,
              revertLane: p.revertLane,
              gesture: p.gesture,
              action: p.action,
              hasEagerState: p.hasEagerState,
              eagerState: p.eagerState,
              next: null
            }, y === null ? (h = y = E, d = f) : y = y.next = E, qe.lanes |= _, Pf |= _;
          p = p.next;
        } while (p !== null && p !== t);
        if (y === null ? d = f : y.next = h, !un(f, e.memoizedState) && (Ql = !0, R && (a = em, a !== null)))
          throw a;
        e.memoizedState = f, e.baseState = d, e.baseQueue = y, i.lastRenderedState = f;
      }
      return o === null && (i.lanes = 0), [e.memoizedState, i.dispatch];
    }
    function Lc(e) {
      var t = Rt(), a = t.queue;
      if (a === null)
        throw Error(
          "Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call)"
        );
      a.lastRenderedReducer = e;
      var i = a.dispatch, o = a.pending, f = t.memoizedState;
      if (o !== null) {
        a.pending = null;
        var d = o = o.next;
        do
          f = e(f, d.action), d = d.next;
        while (d !== o);
        un(f, t.memoizedState) || (Ql = !0), t.memoizedState = f, t.baseQueue === null && (t.baseState = f), a.lastRenderedState = f;
      }
      return [f, i];
    }
    function Io(e, t, a) {
      var i = qe, o = Sl();
      if (ft) {
        if (a === void 0)
          throw Error(
            "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering."
          );
        var f = a();
        um || f === a() || (console.error(
          "The result of getServerSnapshot should be cached to avoid an infinite loop"
        ), um = !0);
      } else {
        if (f = t(), um || (a = t(), un(f, a) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), um = !0)), Vt === null)
          throw Error(
            "Expected a work-in-progress root. This is a bug in React. Please file an issue."
          );
        (tt & 127) !== 0 || ty(i, t, f);
      }
      return o.memoizedState = f, a = { value: f, getSnapshot: t }, o.queue = a, Vc(
        Vi.bind(null, i, a, e),
        [e]
      ), i.flags |= 2048, bu(
        Ku | fn,
        { destroy: void 0 },
        ly.bind(
          null,
          i,
          a,
          f,
          t
        ),
        null
      ), f;
    }
    function Xc(e, t, a) {
      var i = qe, o = Rt(), f = ft;
      if (f) {
        if (a === void 0)
          throw Error(
            "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering."
          );
        a = a();
      } else if (a = t(), !um) {
        var d = t();
        un(a, d) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), um = !0);
      }
      (d = !un(
        (Qt || o).memoizedState,
        a
      )) && (o.memoizedState = a, Ql = !0), o = o.queue;
      var h = Vi.bind(null, i, o, e);
      if (Rl(2048, fn, h, [e]), o.getSnapshot !== t || d || Xl !== null && Xl.memoizedState.tag & Ku) {
        if (i.flags |= 2048, bu(
          Ku | fn,
          { destroy: void 0 },
          ly.bind(
            null,
            i,
            o,
            a,
            t
          ),
          null
        ), Vt === null)
          throw Error(
            "Expected a work-in-progress root. This is a bug in React. Please file an issue."
          );
        f || (Eo & 127) !== 0 || ty(i, t, a);
      }
      return a;
    }
    function ty(e, t, a) {
      e.flags |= 16384, e = { getSnapshot: t, value: a }, t = qe.updateQueue, t === null ? (t = Yr(), qe.updateQueue = t, t.stores = [e]) : (a = t.stores, a === null ? t.stores = [e] : a.push(e));
    }
    function ly(e, t, a, i) {
      t.value = a, t.getSnapshot = i, Zi(t) && ay(e);
    }
    function Vi(e, t, a) {
      return a(function() {
        Zi(t) && (mu(2, "updateSyncExternalStore()", e), ay(e));
      });
    }
    function Zi(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var a = t();
        return !un(e, a);
      } catch {
        return !0;
      }
    }
    function ay(e) {
      var t = ta(e, 2);
      t !== null && Be(t, e, 2);
    }
    function Md(e) {
      var t = Sl();
      if (typeof e == "function") {
        var a = e;
        if (e = a(), ws) {
          me(!0);
          try {
            a();
          } finally {
            me(!1);
          }
        }
      }
      return t.memoizedState = t.baseState = e, t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: $a,
        lastRenderedState: e
      }, t;
    }
    function Ji(e) {
      e = Md(e);
      var t = e.queue, a = Yd.bind(null, qe, t);
      return t.dispatch = a, [e.memoizedState, a];
    }
    function Qc(e) {
      var t = Sl();
      t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = a, t = Qr.bind(
        null,
        qe,
        !0,
        a
      ), a.dispatch = t, [e, t];
    }
    function qr(e, t) {
      var a = Rt();
      return Po(a, Qt, e, t);
    }
    function Po(e, t, a, i) {
      return e.baseState = a, Qi(
        e,
        Qt,
        typeof i == "function" ? i : $a
      );
    }
    function xr(e, t) {
      var a = Rt();
      return Qt !== null ? Po(a, Qt, e, t) : (a.baseState = e, [e, a.queue.dispatch]);
    }
    function X0(e, t, a, i, o) {
      if (jl(e))
        throw Error("Cannot update form state while rendering.");
      if (e = t.action, e !== null) {
        var f = {
          payload: o,
          action: e,
          next: null,
          isTransition: !0,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function(d) {
            f.listeners.push(d);
          }
        };
        L.T !== null ? a(!0) : f.isTransition = !1, i(f), a = t.pending, a === null ? (f.next = t.pending = f, Ki(t, f)) : (f.next = a.next, t.pending = a.next = f);
      }
    }
    function Ki(e, t) {
      var a = t.action, i = t.payload, o = e.state;
      if (t.isTransition) {
        var f = L.T, d = {};
        d._updatedFibers = /* @__PURE__ */ new Set(), L.T = d;
        try {
          var h = a(o, i), y = L.S;
          y !== null && y(d, h), ny(e, t, h);
        } catch (p) {
          wr(e, t, p);
        } finally {
          f !== null && d.types !== null && (f.types !== null && f.types !== d.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), f.types = d.types), L.T = f, f === null && d._updatedFibers && (e = d._updatedFibers.size, d._updatedFibers.clear(), 10 < e && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          ));
        }
      } else
        try {
          d = a(o, i), ny(e, t, d);
        } catch (p) {
          wr(e, t, p);
        }
    }
    function ny(e, t, a) {
      a !== null && typeof a == "object" && typeof a.then == "function" ? (L.asyncTransitions++, a.then(Zc, Zc), a.then(
        function(i) {
          ci(e, t, i);
        },
        function(i) {
          return wr(e, t, i);
        }
      ), t.isTransition || console.error(
        "An async function with useActionState was called outside of a transition. This is likely not what you intended (for example, isPending will not update correctly). Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop."
      )) : ci(e, t, a);
    }
    function ci(e, t, a) {
      t.status = "fulfilled", t.value = a, Cd(t), e.state = a, t = e.pending, t !== null && (a = t.next, a === t ? e.pending = null : (a = a.next, t.next = a, Ki(e, a)));
    }
    function wr(e, t, a) {
      var i = e.pending;
      if (e.pending = null, i !== null) {
        i = i.next;
        do
          t.status = "rejected", t.reason = a, Cd(t), t = t.next;
        while (t !== i);
      }
      e.action = null;
    }
    function Cd(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function oi(e, t) {
      return t;
    }
    function ka(e, t) {
      if (ft) {
        var a = Vt.formState;
        if (a !== null) {
          e: {
            var i = qe;
            if (ft) {
              if (tl) {
                t: {
                  for (var o = tl, f = Vu; o.nodeType !== 8; ) {
                    if (!f) {
                      o = null;
                      break t;
                    }
                    if (o = tn(
                      o.nextSibling
                    ), o === null) {
                      o = null;
                      break t;
                    }
                  }
                  f = o.data, o = f === dS || f === s2 ? o : null;
                }
                if (o) {
                  tl = tn(
                    o.nextSibling
                  ), i = o.data === dS;
                  break e;
                }
              }
              yn(i);
            }
            i = !1;
          }
          i && (t = a[0]);
        }
      }
      return a = Sl(), a.memoizedState = a.baseState = t, i = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: oi,
        lastRenderedState: t
      }, a.queue = i, a = Yd.bind(
        null,
        qe,
        i
      ), i.dispatch = a, i = Md(!1), f = Qr.bind(
        null,
        qe,
        !1,
        i.queue
      ), i = Sl(), o = {
        state: t,
        dispatch: null,
        action: e,
        pending: null
      }, i.queue = o, a = X0.bind(
        null,
        qe,
        o,
        f,
        a
      ), o.dispatch = a, i.memoizedState = e, [t, a, !1];
    }
    function $i(e) {
      var t = Rt();
      return Ud(t, Qt, e);
    }
    function Ud(e, t, a) {
      if (t = Qi(
        e,
        t,
        oi
      )[0], e = Gc($a)[0], typeof t == "object" && t !== null && typeof t.then == "function")
        try {
          var i = jr(t);
        } catch (d) {
          throw d === tm ? fv : d;
        }
      else i = t;
      t = Rt();
      var o = t.queue, f = o.dispatch;
      return a !== t.memoizedState && (qe.flags |= 2048, bu(
        Ku | fn,
        { destroy: void 0 },
        uy.bind(null, o, a),
        null
      )), [i, f, e];
    }
    function uy(e, t) {
      e.action = t;
    }
    function ki(e) {
      var t = Rt(), a = Qt;
      if (a !== null)
        return Ud(t, a, e);
      Rt(), t = t.memoizedState, a = Rt();
      var i = a.queue.dispatch;
      return a.memoizedState = e, [t, i, !1];
    }
    function bu(e, t, a, i) {
      return e = { tag: e, create: a, deps: i, inst: t, next: null }, t = qe.updateQueue, t === null && (t = Yr(), qe.updateQueue = t), a = t.lastEffect, a === null ? t.lastEffect = e.next = e : (i = a.next, a.next = e, e.next = i, t.lastEffect = e), e;
    }
    function Hd(e) {
      var t = Sl();
      return e = { current: e }, t.memoizedState = e;
    }
    function Wi(e, t, a, i) {
      var o = Sl();
      qe.flags |= e, o.memoizedState = bu(
        Ku | t,
        { destroy: void 0 },
        a,
        i === void 0 ? null : i
      );
    }
    function Rl(e, t, a, i) {
      var o = Rt();
      i = i === void 0 ? null : i;
      var f = o.memoizedState.inst;
      Qt !== null && i !== null && Pm(i, Qt.memoizedState.deps) ? o.memoizedState = bu(t, f, a, i) : (qe.flags |= e, o.memoizedState = bu(
        Ku | t,
        f,
        a,
        i
      ));
    }
    function Vc(e, t) {
      (qe.mode & bi) !== Ne ? Wi(276826112, fn, e, t) : Wi(8390656, fn, e, t);
    }
    function Q0(e) {
      qe.flags |= 4;
      var t = qe.updateQueue;
      if (t === null)
        t = Yr(), qe.updateQueue = t, t.events = [e];
      else {
        var a = t.events;
        a === null ? t.events = [e] : a.push(e);
      }
    }
    function Gr(e) {
      var t = Sl(), a = { impl: e };
      return t.memoizedState = a, function() {
        if ((mt & Il) !== oa)
          throw Error(
            "A function wrapped in useEffectEvent can't be called during rendering."
          );
        return a.impl.apply(void 0, arguments);
      };
    }
    function ef(e) {
      var t = Rt().memoizedState;
      return Q0({ ref: t, nextImpl: e }), function() {
        if ((mt & Il) !== oa)
          throw Error(
            "A function wrapped in useEffectEvent can't be called during rendering."
          );
        return t.impl.apply(void 0, arguments);
      };
    }
    function ya(e, t) {
      var a = 4194308;
      return (qe.mode & bi) !== Ne && (a |= 134217728), Wi(a, lu, e, t);
    }
    function Wa(e, t) {
      if (typeof t == "function") {
        e = e();
        var a = t(e);
        return function() {
          typeof a == "function" ? a() : t(null);
        };
      }
      if (t != null)
        return t.hasOwnProperty("current") || console.error(
          "Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.",
          "an object with keys {" + Object.keys(t).join(", ") + "}"
        ), e = e(), t.current = e, function() {
          t.current = null;
        };
    }
    function Eu(e, t, a) {
      typeof t != "function" && console.error(
        "Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.",
        t !== null ? typeof t : "null"
      ), a = a != null ? a.concat([e]) : null;
      var i = 4194308;
      (qe.mode & bi) !== Ne && (i |= 134217728), Wi(
        i,
        lu,
        Wa.bind(null, t, e),
        a
      );
    }
    function tf(e, t, a) {
      typeof t != "function" && console.error(
        "Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.",
        t !== null ? typeof t : "null"
      ), a = a != null ? a.concat([e]) : null, Rl(
        4,
        lu,
        Wa.bind(null, t, e),
        a
      );
    }
    function Nd(e, t) {
      return Sl().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    }
    function Xn(e, t) {
      var a = Rt();
      t = t === void 0 ? null : t;
      var i = a.memoizedState;
      return t !== null && Pm(t, i[1]) ? i[0] : (a.memoizedState = [e, t], e);
    }
    function pa(e, t) {
      var a = Sl();
      t = t === void 0 ? null : t;
      var i = e();
      if (ws) {
        me(!0);
        try {
          e();
        } finally {
          me(!1);
        }
      }
      return a.memoizedState = [i, t], i;
    }
    function Ft(e, t) {
      var a = Rt();
      t = t === void 0 ? null : t;
      var i = a.memoizedState;
      if (t !== null && Pm(t, i[1]))
        return i[0];
      if (i = e(), ws) {
        me(!0);
        try {
          e();
        } finally {
          me(!1);
        }
      }
      return a.memoizedState = [i, t], i;
    }
    function lf(e, t) {
      var a = Sl();
      return zt(a, e, t);
    }
    function Tu(e, t) {
      var a = Rt();
      return ml(
        a,
        Qt.memoizedState,
        e,
        t
      );
    }
    function Je(e, t) {
      var a = Rt();
      return Qt === null ? zt(a, e, t) : ml(
        a,
        Qt.memoizedState,
        e,
        t
      );
    }
    function zt(e, t, a) {
      return a === void 0 || (Eo & 1073741824) !== 0 && (tt & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = a, e = sf(), qe.lanes |= e, Pf |= e, a);
    }
    function ml(e, t, a, i) {
      return un(a, t) ? a : am.current !== null ? (e = zt(e, a, i), un(e, t) || (Ql = !0), e) : (Eo & 42) === 0 || (Eo & 1073741824) !== 0 && (tt & 261930) === 0 ? (Ql = !0, e.memoizedState = a) : (e = sf(), qe.lanes |= e, Pf |= e, t);
    }
    function Zc() {
      L.asyncTransitions--;
    }
    function Jc(e, t, a, i, o) {
      var f = At.p;
      At.p = f !== 0 && f < Wl ? f : Wl;
      var d = L.T, h = {};
      h._updatedFibers = /* @__PURE__ */ new Set(), L.T = h, Qr(e, !1, t, a);
      try {
        var y = o(), p = L.S;
        if (p !== null && p(h, y), y !== null && typeof y == "object" && typeof y.then == "function") {
          L.asyncTransitions++, y.then(Zc, Zc);
          var R = Od(
            y,
            i
          );
          Kc(
            e,
            t,
            R,
            aa(e)
          );
        } else
          Kc(
            e,
            t,
            i,
            aa(e)
          );
      } catch (_) {
        Kc(
          e,
          t,
          { then: function() {
          }, status: "rejected", reason: _ },
          aa(e)
        );
      } finally {
        At.p = f, d !== null && h.types !== null && (d.types !== null && d.types !== h.types && console.error(
          "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
        ), d.types = h.types), L.T = d, d === null && h._updatedFibers && (e = h._updatedFibers.size, h._updatedFibers.clear(), 10 < e && console.warn(
          "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
        ));
      }
    }
    function fi(e, t, a, i) {
      if (e.tag !== 5)
        throw Error(
          "Expected the form instance to be a HostComponent. This is a bug in React."
        );
      var o = Lr(e).queue;
      G0(e), Jc(
        e,
        o,
        t,
        Ws,
        a === null ? K : function() {
          return af(e), a(i);
        }
      );
    }
    function Lr(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: Ws,
        baseState: Ws,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: $a,
          lastRenderedState: Ws
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
          lastRenderedReducer: $a,
          lastRenderedState: a
        },
        next: null
      }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
    }
    function af(e) {
      L.T === null && console.error(
        "requestFormReset was called outside a transition or action. To fix, move to an action, or wrap with startTransition."
      );
      var t = Lr(e);
      t.next === null && (t = e.alternate.memoizedState), Kc(
        e,
        t.next.queue,
        {},
        aa(e)
      );
    }
    function Fi() {
      var e = Md(!1);
      return e = Jc.bind(
        null,
        qe,
        e.queue,
        !0,
        !1
      ), Sl().memoizedState = e, [!1, e];
    }
    function V0() {
      var e = Gc($a)[0], t = Rt().memoizedState;
      return [
        typeof e == "boolean" ? e : jr(e),
        t
      ];
    }
    function al() {
      var e = Lc($a)[0], t = Rt().memoizedState;
      return [
        typeof e == "boolean" ? e : jr(e),
        t
      ];
    }
    function ri() {
      return Et(d0);
    }
    function Xr() {
      var e = Sl(), t = Vt.identifierPrefix;
      if (ft) {
        var a = po, i = yo;
        a = (i & ~(1 << 32 - kl(i) - 1)).toString(32) + a, t = "_" + t + "R_" + a, a = mv++, 0 < a && (t += "H" + a.toString(32)), t += "_";
      } else
        a = aT++, t = "_" + t + "r_" + a.toString(32) + "_";
      return e.memoizedState = t;
    }
    function Bd() {
      return Sl().memoizedState = Z0.bind(
        null,
        qe
      );
    }
    function Z0(e, t) {
      for (var a = e.return; a !== null; ) {
        switch (a.tag) {
          case 24:
          case 3:
            var i = aa(a), o = Ol(i), f = gu(a, o, i);
            f !== null && (mu(i, "refresh()", e), Be(f, a, i), bn(f, a, i)), e = Td(), t != null && f !== null && console.error(
              "The seed argument is not enabled outside experimental channels."
            ), o.payload = { cache: e };
            return;
        }
        a = a.return;
      }
    }
    function l1(e, t, a) {
      var i = arguments;
      typeof i[3] == "function" && console.error(
        "State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect()."
      ), i = aa(e);
      var o = {
        lane: i,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      jl(e) ? fl(t, o) : (o = _c(e, t, o, i), o !== null && (mu(i, "dispatch()", e), Be(o, e, i), Vr(o, t, i)));
    }
    function Yd(e, t, a) {
      var i = arguments;
      typeof i[3] == "function" && console.error(
        "State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect()."
      ), i = aa(e), Kc(e, t, a, i) && mu(i, "setState()", e);
    }
    function Kc(e, t, a, i) {
      var o = {
        lane: i,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (jl(e)) fl(t, o);
      else {
        var f = e.alternate;
        if (e.lanes === 0 && (f === null || f.lanes === 0) && (f = t.lastRenderedReducer, f !== null)) {
          var d = L.H;
          L.H = Ti;
          try {
            var h = t.lastRenderedState, y = f(h, a);
            if (o.hasEagerState = !0, o.eagerState = y, un(y, h))
              return Xo(e, t, o, 0), Vt === null && pd(), !1;
          } catch {
          } finally {
            L.H = d;
          }
        }
        if (a = _c(e, t, o, i), a !== null)
          return Be(a, e, i), Vr(a, t, i), !0;
      }
      return !1;
    }
    function Qr(e, t, a, i) {
      if (L.T === null && Bs === 0 && console.error(
        "An optimistic state update occurred outside a transition or action. To fix, move the update to an action, or wrap with startTransition."
      ), i = {
        lane: 2,
        revertLane: Jy(),
        gesture: null,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null
      }, jl(e)) {
        if (t)
          throw Error("Cannot update optimistic state while rendering.");
        console.error("Cannot call startTransition while rendering.");
      } else
        t = _c(
          e,
          a,
          i,
          2
        ), t !== null && (mu(2, "setOptimistic()", e), Be(t, e, 2));
    }
    function jl(e) {
      var t = e.alternate;
      return e === qe || t !== null && t === qe;
    }
    function fl(e, t) {
      im = hv = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function Vr(e, t, a) {
      if ((a & 4194048) !== 0) {
        var i = t.lanes;
        i &= e.pendingLanes, a |= i, t.lanes = a, sr(e, a);
      }
    }
    function $c(e) {
      if (e !== null && typeof e != "function") {
        var t = String(e);
        qb.has(t) || (qb.add(t), console.error(
          "Expected the last optional `callback` argument to be a function. Instead received: %s.",
          e
        ));
      }
    }
    function nf(e, t, a, i) {
      var o = e.memoizedState, f = a(i, o);
      if (e.mode & Ba) {
        me(!0);
        try {
          f = a(i, o);
        } finally {
          me(!1);
        }
      }
      f === void 0 && (t = Ge(t) || "Component", Nb.has(t) || (Nb.add(t), console.error(
        "%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.",
        t
      ))), o = f == null ? o : Ie({}, o, f), e.memoizedState = o, e.lanes === 0 && (e.updateQueue.baseState = o);
    }
    function jd(e, t, a, i, o, f, d) {
      var h = e.stateNode;
      if (typeof h.shouldComponentUpdate == "function") {
        if (a = h.shouldComponentUpdate(
          i,
          f,
          d
        ), e.mode & Ba) {
          me(!0);
          try {
            a = h.shouldComponentUpdate(
              i,
              f,
              d
            );
          } finally {
            me(!1);
          }
        }
        return a === void 0 && console.error(
          "%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.",
          Ge(t) || "Component"
        ), a;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Lo(a, i) || !Lo(o, f) : !0;
    }
    function Au(e, t, a, i) {
      var o = t.state;
      typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== o && (e = re(e) || "Component", _b.has(e) || (_b.add(e), console.error(
        "%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.",
        e
      )), V1.enqueueReplaceState(
        t,
        t.state,
        null
      ));
    }
    function Ou(e, t) {
      var a = t;
      if ("ref" in t) {
        a = {};
        for (var i in t)
          i !== "ref" && (a[i] = t[i]);
      }
      if (e = e.defaultProps) {
        a === t && (a = Ie({}, a));
        for (var o in e)
          a[o] === void 0 && (a[o] = e[o]);
      }
      return a;
    }
    function qd(e) {
      E1(e), console.warn(
        `%s

%s
`,
        cm ? "An error occurred in the <" + cm + "> component." : "An error occurred in one of your React components.",
        `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries.`
      );
    }
    function xd(e) {
      var t = cm ? "The above error occurred in the <" + cm + "> component." : "The above error occurred in one of your React components.", a = "React will try to recreate this component tree from scratch using the error boundary you provided, " + ((Z1 || "Anonymous") + ".");
      if (typeof e == "object" && e !== null && typeof e.environmentName == "string") {
        var i = e.environmentName;
        e = [
          `%o

%s

%s
`,
          e,
          t,
          a
        ].slice(0), typeof e[0] == "string" ? e.splice(
          0,
          1,
          S2 + " " + e[0],
          b2,
          wv + i + wv,
          E2
        ) : e.splice(
          0,
          0,
          S2,
          b2,
          wv + i + wv,
          E2
        ), e.unshift(console), i = OT.apply(console.error, e), i();
      } else
        console.error(
          `%o

%s

%s
`,
          e,
          t,
          a
        );
    }
    function iy(e) {
      E1(e);
    }
    function Zr(e, t) {
      try {
        cm = t.source ? re(t.source) : null, Z1 = null;
        var a = t.value;
        if (L.actQueue !== null)
          L.thrownErrors.push(a);
        else {
          var i = e.onUncaughtError;
          i(a, { componentStack: t.stack });
        }
      } catch (o) {
        setTimeout(function() {
          throw o;
        });
      }
    }
    function cy(e, t, a) {
      try {
        cm = a.source ? re(a.source) : null, Z1 = re(t);
        var i = e.onCaughtError;
        i(a.value, {
          componentStack: a.stack,
          errorBoundary: t.tag === 1 ? t.stateNode : null
        });
      } catch (o) {
        setTimeout(function() {
          throw o;
        });
      }
    }
    function wd(e, t, a) {
      return a = Ol(a), a.tag = x1, a.payload = { element: null }, a.callback = function() {
        se(t.source, Zr, e, t);
      }, a;
    }
    function Gd(e) {
      return e = Ol(e), e.tag = x1, e;
    }
    function Ld(e, t, a, i) {
      var o = a.type.getDerivedStateFromError;
      if (typeof o == "function") {
        var f = i.value;
        e.payload = function() {
          return o(f);
        }, e.callback = function() {
          Mc(a), se(
            i.source,
            cy,
            t,
            a,
            i
          );
        };
      }
      var d = a.stateNode;
      d !== null && typeof d.componentDidCatch == "function" && (e.callback = function() {
        Mc(a), se(
          i.source,
          cy,
          t,
          a,
          i
        ), typeof o != "function" && (tr === null ? tr = /* @__PURE__ */ new Set([this]) : tr.add(this)), PE(this, i), typeof o == "function" || (a.lanes & 2) === 0 && console.error(
          "%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.",
          re(a) || "Unknown"
        );
      });
    }
    function oy(e, t, a, i, o) {
      if (a.flags |= 32768, qu && pf(e, o), i !== null && typeof i == "object" && typeof i.then == "function") {
        if (t = a.alternate, t !== null && qn(
          t,
          a,
          o,
          !0
        ), ft && (hc = !0), a = tu.current, a !== null) {
          switch (a.tag) {
            case 31:
            case 13:
              return Ju === null ? hf() : a.alternate === null && sl === Ro && (sl = gv), a.flags &= -257, a.flags |= 65536, a.lanes = o, i === rv ? a.flags |= 16384 : (t = a.updateQueue, t === null ? a.updateQueue = /* @__PURE__ */ new Set([i]) : t.add(i), ch(e, i, o)), !1;
            case 22:
              return a.flags |= 65536, i === rv ? a.flags |= 16384 : (t = a.updateQueue, t === null ? (t = {
                transitions: null,
                markerInstances: null,
                retryQueue: /* @__PURE__ */ new Set([i])
              }, a.updateQueue = t) : (a = t.retryQueue, a === null ? t.retryQueue = /* @__PURE__ */ new Set([i]) : a.add(i)), ch(e, i, o)), !1;
          }
          throw Error(
            "Unexpected Suspense handler tag (" + a.tag + "). This is a bug in React."
          );
        }
        return ch(e, i, o), hf(), !1;
      }
      if (ft)
        return hc = !0, t = tu.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = o, i !== D1 && Or(
          ra(
            Error(
              "There was an error while hydrating but React was able to recover by instead client rendering from the nearest Suspense boundary.",
              { cause: i }
            ),
            a
          )
        )) : (i !== D1 && Or(
          ra(
            Error(
              "There was an error while hydrating but React was able to recover by instead client rendering the entire root.",
              { cause: i }
            ),
            a
          )
        ), e = e.current.alternate, e.flags |= 65536, o &= -o, e.lanes |= o, i = ra(i, a), o = wd(
          e.stateNode,
          i,
          o
        ), Cr(e, o), sl !== Ff && (sl = Gs)), !1;
      var f = ra(
        Error(
          "There was an error during concurrent rendering but React was able to recover by instead synchronously rendering the entire root.",
          { cause: i }
        ),
        a
      );
      if (a0 === null ? a0 = [f] : a0.push(f), sl !== Ff && (sl = Gs), t === null) return !0;
      i = ra(i, a), a = t;
      do {
        switch (a.tag) {
          case 3:
            return a.flags |= 65536, e = o & -o, a.lanes |= e, e = wd(
              a.stateNode,
              i,
              e
            ), Cr(a, e), !1;
          case 1:
            if (t = a.type, f = a.stateNode, (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || f !== null && typeof f.componentDidCatch == "function" && (tr === null || !tr.has(f))))
              return a.flags |= 65536, o &= -o, a.lanes |= o, o = Gd(o), Ld(
                o,
                e,
                a,
                i
              ), Cr(a, o), !1;
        }
        a = a.return;
      } while (a !== null);
      return !1;
    }
    function ql(e, t, a, i) {
      t.child = e === null ? gb(t, null, a, i) : xs(
        t,
        e.child,
        a,
        i
      );
    }
    function J0(e, t, a, i, o) {
      a = a.render;
      var f = t.ref;
      if ("ref" in i) {
        var d = {};
        for (var h in i)
          h !== "ref" && (d[h] = i[h]);
      } else d = i;
      return Gi(t), i = ey(
        e,
        t,
        a,
        d,
        f,
        o
      ), h = wc(), e !== null && !Ql ? (Br(e, t, o), Qn(e, t, o)) : (ft && h && Sd(t), t.flags |= 1, ql(e, t, i, o), t.child);
    }
    function fy(e, t, a, i, o) {
      if (e === null) {
        var f = a.type;
        return typeof f == "function" && !Lm(f) && f.defaultProps === void 0 && a.compare === null ? (a = Yi(f), t.tag = 15, t.type = a, uf(t, f), ry(
          e,
          t,
          a,
          i,
          o
        )) : (e = Cc(
          a.type,
          null,
          i,
          t,
          t.mode,
          o
        ), e.ref = t.ref, e.return = t, t.child = e);
      }
      if (f = e.child, !Jd(e, o)) {
        var d = f.memoizedProps;
        if (a = a.compare, a = a !== null ? a : Lo, a(d, i) && e.ref === t.ref)
          return Qn(
            e,
            t,
            o
          );
      }
      return t.flags |= 1, e = hu(f, i), e.ref = t.ref, e.return = t, t.child = e;
    }
    function ry(e, t, a, i, o) {
      if (e !== null) {
        var f = e.memoizedProps;
        if (Lo(f, i) && e.ref === t.ref && t.type === e.type)
          if (Ql = !1, t.pendingProps = i = f, Jd(e, o))
            (e.flags & 131072) !== 0 && (Ql = !0);
          else
            return t.lanes = e.lanes, Qn(e, t, o);
      }
      return my(
        e,
        t,
        a,
        i,
        o
      );
    }
    function sy(e, t, a, i) {
      var o = i.children, f = e !== null ? e.memoizedState : null;
      if (e === null && t.stateNode === null && (t.stateNode = {
        _visibility: Hp,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), i.mode === "hidden") {
        if ((t.flags & 128) !== 0) {
          if (f = f !== null ? f.baseLanes | a : a, e !== null) {
            for (i = t.child = e.child, o = 0; i !== null; )
              o = o | i.lanes | i.childLanes, i = i.sibling;
            i = o & ~f;
          } else i = 0, t.child = null;
          return dy(
            e,
            t,
            f,
            a,
            i
          );
        }
        if ((a & 536870912) !== 0)
          t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Ko(
            t,
            f !== null ? f.cachePool : null
          ), f !== null ? Dd(t, f) : ni(t), _d(t);
        else
          return i = t.lanes = 536870912, dy(
            e,
            t,
            f !== null ? f.baseLanes | a : a,
            a,
            i
          );
      } else
        f !== null ? (Ko(t, f.cachePool), Dd(t, f), Su(t), t.memoizedState = null) : (e !== null && Ko(t, null), ni(t), Su(t));
      return ql(e, t, o, a), t.child;
    }
    function kc(e, t) {
      return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
        _visibility: Hp,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), t.sibling;
    }
    function dy(e, t, a, i, o) {
      var f = ai();
      return f = f === null ? null : {
        parent: Gl._currentValue,
        pool: f
      }, t.memoizedState = {
        baseLanes: a,
        cachePool: f
      }, e !== null && Ko(t, null), ni(t), _d(t), e !== null && qn(e, t, i, !0), t.childLanes = o, null;
    }
    function Jr(e, t) {
      var a = t.hidden;
      return a !== void 0 && console.error(
        `<Activity> doesn't accept a hidden prop. Use mode="hidden" instead.
- <Activity %s>
+ <Activity %s>`,
        a === !0 ? "hidden" : a === !1 ? "hidden={false}" : "hidden={...}",
        a ? 'mode="hidden"' : 'mode="visible"'
      ), t = $r(
        { mode: t.mode, children: t.children },
        e.mode
      ), t.ref = e.ref, e.child = t, t.return = e, t;
    }
    function hy(e, t, a) {
      return xs(t, e.child, null, a), e = Jr(
        t,
        t.pendingProps
      ), e.flags |= 2, Yl(t), t.memoizedState = null, e;
    }
    function K0(e, t, a) {
      var i = t.pendingProps, o = (t.flags & 128) !== 0;
      if (t.flags &= -129, e === null) {
        if (ft) {
          if (i.mode === "hidden")
            return e = Jr(t, i), t.lanes = 536870912, kc(null, e);
          if (Ln(t), (e = tl) ? (a = _t(
            e,
            Vu
          ), a = a !== null && a.data === Js ? a : null, a !== null && (i = {
            dehydrated: a,
            treeContext: q0(),
            retryLane: 536870912,
            hydrationErrors: null
          }, t.memoizedState = i, i = Qm(a), i.return = t, t.child = i, Ra = t, tl = null)) : a = null, a === null)
            throw la(t, e), yn(t);
          return t.lanes = 536870912, null;
        }
        return Jr(t, i);
      }
      var f = e.memoizedState;
      if (f !== null) {
        var d = f.dehydrated;
        if (Ln(t), o)
          if (t.flags & 256)
            t.flags &= -257, t = hy(
              e,
              t,
              a
            );
          else if (t.memoizedState !== null)
            t.child = e.child, t.flags |= 128, t = null;
          else
            throw Error(
              "Client rendering an Activity suspended it again. This is a bug in React."
            );
        else if (w0(), (a & 536870912) !== 0 && df(t), Ql || qn(
          e,
          t,
          a,
          !1
        ), o = (a & e.childLanes) !== 0, Ql || o) {
          if (i = Vt, i !== null && (d = Sc(
            i,
            a
          ), d !== 0 && d !== f.retryLane))
            throw f.retryLane = d, ta(e, d), Be(i, e, d), J1;
          hf(), t = hy(
            e,
            t,
            a
          );
        } else
          e = f.treeContext, tl = tn(
            d.nextSibling
          ), Ra = t, ft = !0, Zf = null, hc = !1, eu = null, Vu = !1, e !== null && x0(t, e), t = Jr(t, i), t.flags |= 4096;
        return t;
      }
      return f = e.child, i = { mode: i.mode, children: i.children }, (a & 536870912) !== 0 && (a & e.lanes) !== 0 && df(t), e = hu(f, i), e.ref = t.ref, t.child = e, e.return = t, e;
    }
    function Kr(e, t) {
      var a = t.ref;
      if (a === null)
        e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof a != "function" && typeof a != "object")
          throw Error(
            "Expected ref to be a function, an object returned by React.createRef(), or undefined/null."
          );
        (e === null || e.ref !== a) && (t.flags |= 4194816);
      }
    }
    function my(e, t, a, i, o) {
      if (a.prototype && typeof a.prototype.render == "function") {
        var f = Ge(a) || "Unknown";
        xb[f] || (console.error(
          "The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.",
          f,
          f
        ), xb[f] = !0);
      }
      return t.mode & Ba && Ei.recordLegacyContextWarning(
        t,
        null
      ), e === null && (uf(t, t.type), a.contextTypes && (f = Ge(a) || "Unknown", Gb[f] || (Gb[f] = !0, console.error(
        "%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with React.useContext() instead. (https://react.dev/link/legacy-context)",
        f
      )))), Gi(t), a = ey(
        e,
        t,
        a,
        i,
        void 0,
        o
      ), i = wc(), e !== null && !Ql ? (Br(e, t, o), Qn(e, t, o)) : (ft && i && Sd(t), t.flags |= 1, ql(e, t, a, o), t.child);
    }
    function yy(e, t, a, i, o, f) {
      return Gi(t), Ao = -1, Wp = e !== null && e.type !== t.type, t.updateQueue = null, a = Hr(
        t,
        i,
        a,
        o
      ), hl(e, t), i = wc(), e !== null && !Ql ? (Br(e, t, f), Qn(e, t, f)) : (ft && i && Sd(t), t.flags |= 1, ql(e, t, a, f), t.child);
    }
    function Wc(e, t, a, i, o) {
      switch (we(t)) {
        case !1:
          var f = t.stateNode, d = new t.type(
            t.memoizedProps,
            f.context
          ).state;
          f.updater.enqueueSetState(f, d, null);
          break;
        case !0:
          t.flags |= 128, t.flags |= 65536, f = Error("Simulated error coming from DevTools");
          var h = o & -o;
          if (t.lanes |= h, d = Vt, d === null)
            throw Error(
              "Expected a work-in-progress root. This is a bug in React. Please file an issue."
            );
          h = Gd(h), Ld(
            h,
            d,
            t,
            ra(f, t)
          ), Cr(t, h);
      }
      if (Gi(t), t.stateNode === null) {
        if (d = Vf, f = a.contextType, "contextType" in a && f !== null && (f === void 0 || f.$$typeof !== Fn) && !jb.has(a) && (jb.add(a), h = f === void 0 ? " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? " However, it is set to a " + typeof f + "." : f.$$typeof === Mh ? " Did you accidentally pass the Context.Consumer instead?" : " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", console.error(
          "%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s",
          Ge(a) || "Component",
          h
        )), typeof f == "object" && f !== null && (d = Et(f)), f = new a(i, d), t.mode & Ba) {
          me(!0);
          try {
            f = new a(i, d);
          } finally {
            me(!1);
          }
        }
        if (d = t.memoizedState = f.state !== null && f.state !== void 0 ? f.state : null, f.updater = V1, t.stateNode = f, f._reactInternals = t, f._reactInternalInstance = Db, typeof a.getDerivedStateFromProps == "function" && d === null && (d = Ge(a) || "Component", Mb.has(d) || (Mb.add(d), console.error(
          "`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.",
          d,
          f.state === null ? "null" : "undefined",
          d
        ))), typeof a.getDerivedStateFromProps == "function" || typeof f.getSnapshotBeforeUpdate == "function") {
          var y = h = d = null;
          if (typeof f.componentWillMount == "function" && f.componentWillMount.__suppressDeprecationWarning !== !0 ? d = "componentWillMount" : typeof f.UNSAFE_componentWillMount == "function" && (d = "UNSAFE_componentWillMount"), typeof f.componentWillReceiveProps == "function" && f.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? h = "componentWillReceiveProps" : typeof f.UNSAFE_componentWillReceiveProps == "function" && (h = "UNSAFE_componentWillReceiveProps"), typeof f.componentWillUpdate == "function" && f.componentWillUpdate.__suppressDeprecationWarning !== !0 ? y = "componentWillUpdate" : typeof f.UNSAFE_componentWillUpdate == "function" && (y = "UNSAFE_componentWillUpdate"), d !== null || h !== null || y !== null) {
            f = Ge(a) || "Component";
            var p = typeof a.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            Ub.has(f) || (Ub.add(f), console.error(
              `Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://react.dev/link/unsafe-component-lifecycles`,
              f,
              p,
              d !== null ? `
  ` + d : "",
              h !== null ? `
  ` + h : "",
              y !== null ? `
  ` + y : ""
            ));
          }
        }
        f = t.stateNode, d = Ge(a) || "Component", f.render || (a.prototype && typeof a.prototype.render == "function" ? console.error(
          "No `render` method found on the %s instance: did you accidentally return an object from the constructor?",
          d
        ) : console.error(
          "No `render` method found on the %s instance: you may have forgotten to define `render`.",
          d
        )), !f.getInitialState || f.getInitialState.isReactClassApproved || f.state || console.error(
          "getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?",
          d
        ), f.getDefaultProps && !f.getDefaultProps.isReactClassApproved && console.error(
          "getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.",
          d
        ), f.contextType && console.error(
          "contextType was defined as an instance property on %s. Use a static property to define contextType instead.",
          d
        ), a.childContextTypes && !Yb.has(a) && (Yb.add(a), console.error(
          "%s uses the legacy childContextTypes API which was removed in React 19. Use React.createContext() instead. (https://react.dev/link/legacy-context)",
          d
        )), a.contextTypes && !Bb.has(a) && (Bb.add(a), console.error(
          "%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with static contextType instead. (https://react.dev/link/legacy-context)",
          d
        )), typeof f.componentShouldUpdate == "function" && console.error(
          "%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.",
          d
        ), a.prototype && a.prototype.isPureReactComponent && typeof f.shouldComponentUpdate < "u" && console.error(
          "%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.",
          Ge(a) || "A pure component"
        ), typeof f.componentDidUnmount == "function" && console.error(
          "%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?",
          d
        ), typeof f.componentDidReceiveProps == "function" && console.error(
          "%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().",
          d
        ), typeof f.componentWillRecieveProps == "function" && console.error(
          "%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?",
          d
        ), typeof f.UNSAFE_componentWillRecieveProps == "function" && console.error(
          "%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?",
          d
        ), h = f.props !== i, f.props !== void 0 && h && console.error(
          "When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.",
          d
        ), f.defaultProps && console.error(
          "Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.",
          d,
          d
        ), typeof f.getSnapshotBeforeUpdate != "function" || typeof f.componentDidUpdate == "function" || Cb.has(a) || (Cb.add(a), console.error(
          "%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.",
          Ge(a)
        )), typeof f.getDerivedStateFromProps == "function" && console.error(
          "%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.",
          d
        ), typeof f.getDerivedStateFromError == "function" && console.error(
          "%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.",
          d
        ), typeof a.getSnapshotBeforeUpdate == "function" && console.error(
          "%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.",
          d
        ), (h = f.state) && (typeof h != "object" || El(h)) && console.error("%s.state: must be set to an object or null", d), typeof f.getChildContext == "function" && typeof a.childContextTypes != "object" && console.error(
          "%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().",
          d
        ), f = t.stateNode, f.props = i, f.state = t.memoizedState, f.refs = {}, ct(t), d = a.contextType, f.context = typeof d == "object" && d !== null ? Et(d) : Vf, f.state === i && (d = Ge(a) || "Component", Hb.has(d) || (Hb.add(d), console.error(
          "%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.",
          d
        ))), t.mode & Ba && Ei.recordLegacyContextWarning(
          t,
          f
        ), Ei.recordUnsafeLifecycleWarnings(
          t,
          f
        ), f.state = t.memoizedState, d = a.getDerivedStateFromProps, typeof d == "function" && (nf(
          t,
          a,
          d,
          i
        ), f.state = t.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof f.getSnapshotBeforeUpdate == "function" || typeof f.UNSAFE_componentWillMount != "function" && typeof f.componentWillMount != "function" || (d = f.state, typeof f.componentWillMount == "function" && f.componentWillMount(), typeof f.UNSAFE_componentWillMount == "function" && f.UNSAFE_componentWillMount(), d !== f.state && (console.error(
          "%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.",
          re(t) || "Component"
        ), V1.enqueueReplaceState(
          f,
          f.state,
          null
        )), vu(t, i, f, o), ko(), f.state = t.memoizedState), typeof f.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & bi) !== Ne && (t.flags |= 134217728), f = !0;
      } else if (e === null) {
        f = t.stateNode;
        var R = t.memoizedProps;
        h = Ou(a, R), f.props = h;
        var _ = f.context;
        y = a.contextType, d = Vf, typeof y == "object" && y !== null && (d = Et(y)), p = a.getDerivedStateFromProps, y = typeof p == "function" || typeof f.getSnapshotBeforeUpdate == "function", R = t.pendingProps !== R, y || typeof f.UNSAFE_componentWillReceiveProps != "function" && typeof f.componentWillReceiveProps != "function" || (R || _ !== d) && Au(
          t,
          f,
          i,
          d
        ), Wf = !1;
        var E = t.memoizedState;
        f.state = E, vu(t, i, f, o), ko(), _ = t.memoizedState, R || E !== _ || Wf ? (typeof p == "function" && (nf(
          t,
          a,
          p,
          i
        ), _ = t.memoizedState), (h = Wf || jd(
          t,
          a,
          h,
          i,
          E,
          _,
          d
        )) ? (y || typeof f.UNSAFE_componentWillMount != "function" && typeof f.componentWillMount != "function" || (typeof f.componentWillMount == "function" && f.componentWillMount(), typeof f.UNSAFE_componentWillMount == "function" && f.UNSAFE_componentWillMount()), typeof f.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & bi) !== Ne && (t.flags |= 134217728)) : (typeof f.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & bi) !== Ne && (t.flags |= 134217728), t.memoizedProps = i, t.memoizedState = _), f.props = i, f.state = _, f.context = d, f = h) : (typeof f.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & bi) !== Ne && (t.flags |= 134217728), f = !1);
      } else {
        f = t.stateNode, pu(e, t), d = t.memoizedProps, y = Ou(a, d), f.props = y, p = t.pendingProps, E = f.context, _ = a.contextType, h = Vf, typeof _ == "object" && _ !== null && (h = Et(_)), R = a.getDerivedStateFromProps, (_ = typeof R == "function" || typeof f.getSnapshotBeforeUpdate == "function") || typeof f.UNSAFE_componentWillReceiveProps != "function" && typeof f.componentWillReceiveProps != "function" || (d !== p || E !== h) && Au(
          t,
          f,
          i,
          h
        ), Wf = !1, E = t.memoizedState, f.state = E, vu(t, i, f, o), ko();
        var x = t.memoizedState;
        d !== p || E !== x || Wf || e !== null && e.dependencies !== null && Zo(e.dependencies) ? (typeof R == "function" && (nf(
          t,
          a,
          R,
          i
        ), x = t.memoizedState), (y = Wf || jd(
          t,
          a,
          y,
          i,
          E,
          x,
          h
        ) || e !== null && e.dependencies !== null && Zo(e.dependencies)) ? (_ || typeof f.UNSAFE_componentWillUpdate != "function" && typeof f.componentWillUpdate != "function" || (typeof f.componentWillUpdate == "function" && f.componentWillUpdate(i, x, h), typeof f.UNSAFE_componentWillUpdate == "function" && f.UNSAFE_componentWillUpdate(
          i,
          x,
          h
        )), typeof f.componentDidUpdate == "function" && (t.flags |= 4), typeof f.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof f.componentDidUpdate != "function" || d === e.memoizedProps && E === e.memoizedState || (t.flags |= 4), typeof f.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && E === e.memoizedState || (t.flags |= 1024), t.memoizedProps = i, t.memoizedState = x), f.props = i, f.state = x, f.context = h, f = y) : (typeof f.componentDidUpdate != "function" || d === e.memoizedProps && E === e.memoizedState || (t.flags |= 4), typeof f.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && E === e.memoizedState || (t.flags |= 1024), f = !1);
      }
      if (h = f, Kr(e, t), d = (t.flags & 128) !== 0, h || d) {
        if (h = t.stateNode, zi(t), d && typeof a.getDerivedStateFromError != "function")
          a = null, cn = -1;
        else if (a = ab(h), t.mode & Ba) {
          me(!0);
          try {
            ab(h);
          } finally {
            me(!1);
          }
        }
        t.flags |= 1, e !== null && d ? (t.child = xs(
          t,
          e.child,
          null,
          o
        ), t.child = xs(
          t,
          null,
          a,
          o
        )) : ql(e, t, a, o), t.memoizedState = h.state, e = t.child;
      } else
        e = Qn(
          e,
          t,
          o
        );
      return o = t.stateNode, f && o.props !== i && (om || console.error(
        "It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.",
        re(t) || "a component"
      ), om = !0), e;
    }
    function py(e, t, a, i) {
      return xi(), t.flags |= 256, ql(e, t, a, i), t.child;
    }
    function uf(e, t) {
      t && t.childContextTypes && console.error(
        `childContextTypes cannot be defined on a function component.
  %s.childContextTypes = ...`,
        t.displayName || t.name || "Component"
      ), typeof t.getDerivedStateFromProps == "function" && (e = Ge(t) || "Unknown", Lb[e] || (console.error(
        "%s: Function components do not support getDerivedStateFromProps.",
        e
      ), Lb[e] = !0)), typeof t.contextType == "object" && t.contextType !== null && (t = Ge(t) || "Unknown", wb[t] || (console.error(
        "%s: Function components do not support contextType.",
        t
      ), wb[t] = !0));
    }
    function cf(e) {
      return { baseLanes: e, cachePool: km() };
    }
    function Xd(e, t, a) {
      return e = e !== null ? e.childLanes & ~a : 0, t && (e |= _n), e;
    }
    function Qd(e, t, a) {
      var i, o = t.pendingProps;
      ce(t) && (t.flags |= 128);
      var f = !1, d = (t.flags & 128) !== 0;
      if ((i = d) || (i = e !== null && e.memoizedState === null ? !1 : (Ml.current & $p) !== 0), i && (f = !0, t.flags &= -129), i = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
        if (ft) {
          if (f ? ma(t) : Su(t), (e = tl) ? (a = _t(
            e,
            Vu
          ), a = a !== null && a.data !== Js ? a : null, a !== null && (i = {
            dehydrated: a,
            treeContext: q0(),
            retryLane: 536870912,
            hydrationErrors: null
          }, t.memoizedState = i, i = Qm(a), i.return = t, t.child = i, Ra = t, tl = null)) : a = null, a === null)
            throw la(t, e), yn(t);
          return ky(a) ? t.lanes = 32 : t.lanes = 536870912, null;
        }
        var h = o.children;
        if (o = o.fallback, f) {
          Su(t);
          var y = t.mode;
          return h = $r(
            { mode: "hidden", children: h },
            y
          ), o = Uc(
            o,
            y,
            a,
            null
          ), h.return = t, o.return = t, h.sibling = o, t.child = h, o = t.child, o.memoizedState = cf(a), o.childLanes = Xd(
            e,
            i,
            a
          ), t.memoizedState = K1, kc(
            null,
            o
          );
        }
        return ma(t), gy(
          t,
          h
        );
      }
      var p = e.memoizedState;
      if (p !== null) {
        var R = p.dehydrated;
        if (R !== null) {
          if (d)
            t.flags & 256 ? (ma(t), t.flags &= -257, t = Vd(
              e,
              t,
              a
            )) : t.memoizedState !== null ? (Su(t), t.child = e.child, t.flags |= 128, t = null) : (Su(t), h = o.fallback, y = t.mode, o = $r(
              {
                mode: "visible",
                children: o.children
              },
              y
            ), h = Uc(
              h,
              y,
              a,
              null
            ), h.flags |= 2, o.return = t, h.return = t, o.sibling = h, t.child = o, xs(
              t,
              e.child,
              null,
              a
            ), o = t.child, o.memoizedState = cf(a), o.childLanes = Xd(
              e,
              i,
              a
            ), t.memoizedState = K1, t = kc(
              null,
              o
            ));
          else if (ma(t), w0(), (a & 536870912) !== 0 && df(t), ky(
            R
          )) {
            if (i = R.nextSibling && R.nextSibling.dataset, i) {
              h = i.dgst;
              var _ = i.msg;
              y = i.stck;
              var E = i.cstck;
            }
            f = _, i = h, o = y, R = E, h = f, y = R, h = Error(h || "The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering."), h.stack = o || "", h.digest = i, i = y === void 0 ? null : y, o = {
              value: h,
              source: null,
              stack: i
            }, typeof i == "string" && z1.set(
              h,
              o
            ), Or(o), t = Vd(
              e,
              t,
              a
            );
          } else if (Ql || qn(
            e,
            t,
            a,
            !1
          ), i = (a & e.childLanes) !== 0, Ql || i) {
            if (i = Vt, i !== null && (o = Sc(
              i,
              a
            ), o !== 0 && o !== p.retryLane))
              throw p.retryLane = o, ta(
                e,
                o
              ), Be(
                i,
                e,
                o
              ), J1;
            ds(
              R
            ) || hf(), t = Vd(
              e,
              t,
              a
            );
          } else
            ds(
              R
            ) ? (t.flags |= 192, t.child = e.child, t = null) : (e = p.treeContext, tl = tn(
              R.nextSibling
            ), Ra = t, ft = !0, Zf = null, hc = !1, eu = null, Vu = !1, e !== null && x0(t, e), t = gy(
              t,
              o.children
            ), t.flags |= 4096);
          return t;
        }
      }
      return f ? (Su(t), h = o.fallback, y = t.mode, E = e.child, R = E.sibling, o = hu(
        E,
        {
          mode: "hidden",
          children: o.children
        }
      ), o.subtreeFlags = E.subtreeFlags & 65011712, R !== null ? h = hu(
        R,
        h
      ) : (h = Uc(
        h,
        y,
        a,
        null
      ), h.flags |= 2), h.return = t, o.return = t, o.sibling = h, t.child = o, kc(null, o), o = t.child, h = e.child.memoizedState, h === null ? h = cf(a) : (y = h.cachePool, y !== null ? (E = Gl._currentValue, y = y.parent !== E ? { parent: E, pool: E } : y) : y = km(), h = {
        baseLanes: h.baseLanes | a,
        cachePool: y
      }), o.memoizedState = h, o.childLanes = Xd(
        e,
        i,
        a
      ), t.memoizedState = K1, kc(
        e.child,
        o
      )) : (p !== null && (a & 62914560) === a && (a & e.lanes) !== 0 && df(t), ma(t), a = e.child, e = a.sibling, a = hu(a, {
        mode: "visible",
        children: o.children
      }), a.return = t, a.sibling = null, e !== null && (i = t.deletions, i === null ? (t.deletions = [e], t.flags |= 16) : i.push(e)), t.child = a, t.memoizedState = null, a);
    }
    function gy(e, t) {
      return t = $r(
        { mode: "visible", children: t },
        e.mode
      ), t.return = e, e.child = t;
    }
    function $r(e, t) {
      return e = N(22, e, null, t), e.lanes = 0, e;
    }
    function Vd(e, t, a) {
      return xs(t, e.child, null, a), e = gy(
        t,
        t.pendingProps.children
      ), e.flags |= 2, t.memoizedState = null, e;
    }
    function vy(e, t, a) {
      e.lanes |= t;
      var i = e.alternate;
      i !== null && (i.lanes |= t), Ed(
        e.return,
        t,
        a
      );
    }
    function Zd(e, t, a, i, o, f) {
      var d = e.memoizedState;
      d === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: o,
        treeForkCount: f
      } : (d.isBackwards = t, d.rendering = null, d.renderingStartTime = 0, d.last = i, d.tail = a, d.tailMode = o, d.treeForkCount = f);
    }
    function Sy(e, t, a) {
      var i = t.pendingProps, o = i.revealOrder, f = i.tail, d = i.children, h = Ml.current;
      if ((i = (h & $p) !== 0) ? (h = h & nm | $p, t.flags |= 128) : h &= nm, Le(Ml, h, t), h = o ?? "null", o !== "forwards" && o !== "unstable_legacy-backwards" && o !== "together" && o !== "independent" && !Xb[h])
        if (Xb[h] = !0, o == null)
          console.error(
            'The default for the <SuspenseList revealOrder="..."> prop is changing. To be future compatible you must explictly specify either "independent" (the current default), "together", "forwards" or "legacy_unstable-backwards".'
          );
        else if (o === "backwards")
          console.error(
            'The rendering order of <SuspenseList revealOrder="backwards"> is changing. To be future compatible you must specify revealOrder="legacy_unstable-backwards" instead.'
          );
        else if (typeof o == "string")
          switch (o.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards":
            case "independent":
              console.error(
                '"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.',
                o,
                o.toLowerCase()
              );
              break;
            case "forward":
            case "backward":
              console.error(
                '"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.',
                o,
                o.toLowerCase()
              );
              break;
            default:
              console.error(
                '"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "independent", "together", "forwards" or "backwards"?',
                o
              );
          }
        else
          console.error(
            '%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "independent", "together", "forwards" or "backwards"?',
            o
          );
      h = f ?? "null", pv[h] || (f == null ? (o === "forwards" || o === "backwards" || o === "unstable_legacy-backwards") && (pv[h] = !0, console.error(
        'The default for the <SuspenseList tail="..."> prop is changing. To be future compatible you must explictly specify either "visible" (the current default), "collapsed" or "hidden".'
      )) : f !== "visible" && f !== "collapsed" && f !== "hidden" ? (pv[h] = !0, console.error(
        '"%s" is not a supported value for tail on <SuspenseList />. Did you mean "visible", "collapsed" or "hidden"?',
        f
      )) : o !== "forwards" && o !== "backwards" && o !== "unstable_legacy-backwards" && (pv[h] = !0, console.error(
        '<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?',
        f
      )));
      e: if ((o === "forwards" || o === "backwards" || o === "unstable_legacy-backwards") && d !== void 0 && d !== null && d !== !1)
        if (El(d)) {
          for (h = 0; h < d.length; h++)
            if (!Gt(
              d[h],
              h
            ))
              break e;
        } else if (h = De(d), typeof h == "function") {
          if (h = h.call(d))
            for (var y = h.next(), p = 0; !y.done; y = h.next()) {
              if (!Gt(y.value, p)) break e;
              p++;
            }
        } else
          console.error(
            'A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?',
            o
          );
      if (ql(e, t, d, a), ft ? (qi(), d = Np) : d = 0, !i && e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13)
            e.memoizedState !== null && vy(e, a, t);
          else if (e.tag === 19)
            vy(e, a, t);
          else if (e.child !== null) {
            e.child.return = e, e = e.child;
            continue;
          }
          if (e === t) break e;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t)
              break e;
            e = e.return;
          }
          e.sibling.return = e.return, e = e.sibling;
        }
      switch (o) {
        case "forwards":
          for (a = t.child, o = null; a !== null; )
            e = a.alternate, e !== null && xc(e) === null && (o = a), a = a.sibling;
          a = o, a === null ? (o = t.child, t.child = null) : (o = a.sibling, a.sibling = null), Zd(
            t,
            !1,
            o,
            a,
            f,
            d
          );
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          for (a = null, o = t.child, t.child = null; o !== null; ) {
            if (e = o.alternate, e !== null && xc(e) === null) {
              t.child = o;
              break;
            }
            e = o.sibling, o.sibling = a, a = o, o = e;
          }
          Zd(
            t,
            !0,
            a,
            null,
            f,
            d
          );
          break;
        case "together":
          Zd(
            t,
            !1,
            null,
            null,
            void 0,
            d
          );
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function Qn(e, t, a) {
      if (e !== null && (t.dependencies = e.dependencies), cn = -1, Pf |= t.lanes, (a & t.childLanes) === 0)
        if (e !== null) {
          if (qn(
            e,
            t,
            a,
            !1
          ), (a & t.childLanes) === 0)
            return null;
        } else return null;
      if (e !== null && t.child !== e.child)
        throw Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        for (e = t.child, a = hu(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null; )
          e = e.sibling, a = a.sibling = hu(e, e.pendingProps), a.return = t;
        a.sibling = null;
      }
      return t.child;
    }
    function Jd(e, t) {
      return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Zo(e)));
    }
    function $0(e, t, a) {
      switch (t.tag) {
        case 3:
          wt(
            t,
            t.stateNode.containerInfo
          ), pn(
            t,
            Gl,
            e.memoizedState.cache
          ), xi();
          break;
        case 27:
        case 5:
          te(t);
          break;
        case 4:
          wt(
            t,
            t.stateNode.containerInfo
          );
          break;
        case 10:
          pn(
            t,
            t.type,
            t.memoizedProps.value
          );
          break;
        case 12:
          (a & t.childLanes) !== 0 && (t.flags |= 4), t.flags |= 2048;
          var i = t.stateNode;
          i.effectDuration = -0, i.passiveEffectDuration = -0;
          break;
        case 31:
          if (t.memoizedState !== null)
            return t.flags |= 128, Ln(t), null;
          break;
        case 13:
          if (i = t.memoizedState, i !== null)
            return i.dehydrated !== null ? (ma(t), t.flags |= 128, null) : (a & t.child.childLanes) !== 0 ? Qd(
              e,
              t,
              a
            ) : (ma(t), e = Qn(
              e,
              t,
              a
            ), e !== null ? e.sibling : null);
          ma(t);
          break;
        case 19:
          var o = (e.flags & 128) !== 0;
          if (i = (a & t.childLanes) !== 0, i || (qn(
            e,
            t,
            a,
            !1
          ), i = (a & t.childLanes) !== 0), o) {
            if (i)
              return Sy(
                e,
                t,
                a
              );
            t.flags |= 128;
          }
          if (o = t.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), Le(
            Ml,
            Ml.current,
            t
          ), i) break;
          return null;
        case 22:
          return t.lanes = 0, sy(
            e,
            t,
            a,
            t.pendingProps
          );
        case 24:
          pn(
            t,
            Gl,
            e.memoizedState.cache
          );
      }
      return Qn(e, t, a);
    }
    function kr(e, t, a) {
      if (t._debugNeedsRemount && e !== null) {
        a = Cc(
          t.type,
          t.key,
          t.pendingProps,
          t._debugOwner || null,
          t.mode,
          t.lanes
        ), a._debugStack = t._debugStack, a._debugTask = t._debugTask;
        var i = t.return;
        if (i === null) throw Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, a._debugInfo = t._debugInfo, t === i.child)
          i.child = a;
        else {
          var o = i.child;
          if (o === null)
            throw Error("Expected parent to have a child.");
          for (; o.sibling !== t; )
            if (o = o.sibling, o === null)
              throw Error("Expected to find the previous sibling.");
          o.sibling = a;
        }
        return t = i.deletions, t === null ? (i.deletions = [e], i.flags |= 16) : t.push(e), a.flags |= 2, a;
      }
      if (e !== null)
        if (e.memoizedProps !== t.pendingProps || t.type !== e.type)
          Ql = !0;
        else {
          if (!Jd(e, a) && (t.flags & 128) === 0)
            return Ql = !1, $0(
              e,
              t,
              a
            );
          Ql = (e.flags & 131072) !== 0;
        }
      else
        Ql = !1, (i = ft) && (qi(), i = (t.flags & 1048576) !== 0), i && (i = t.index, qi(), Vm(t, Np, i));
      switch (t.lanes = 0, t.tag) {
        case 16:
          e: if (i = t.pendingProps, e = Ja(t.elementType), t.type = e, typeof e == "function")
            Lm(e) ? (i = Ou(
              e,
              i
            ), t.tag = 1, t.type = e = Yi(e), t = Wc(
              null,
              t,
              e,
              i,
              a
            )) : (t.tag = 0, uf(t, e), t.type = e = Yi(e), t = my(
              null,
              t,
              e,
              i,
              a
            ));
          else {
            if (e != null) {
              if (o = e.$$typeof, o === Cf) {
                t.tag = 11, t.type = e = gd(e), t = J0(
                  null,
                  t,
                  e,
                  i,
                  a
                );
                break e;
              } else if (o === Ts) {
                t.tag = 14, t = fy(
                  null,
                  t,
                  e,
                  i,
                  a
                );
                break e;
              }
            }
            throw t = "", e !== null && typeof e == "object" && e.$$typeof === na && (t = " Did you wrap a component in React.lazy() more than once?"), a = Ge(e) || e, Error(
              "Element type is invalid. Received a promise that resolves to: " + a + ". Lazy element type must resolve to a class or function." + t
            );
          }
          return t;
        case 0:
          return my(
            e,
            t,
            t.type,
            t.pendingProps,
            a
          );
        case 1:
          return i = t.type, o = Ou(
            i,
            t.pendingProps
          ), Wc(
            e,
            t,
            i,
            o,
            a
          );
        case 3:
          e: {
            if (wt(
              t,
              t.stateNode.containerInfo
            ), e === null)
              throw Error(
                "Should have a current fiber. This is a bug in React."
              );
            i = t.pendingProps;
            var f = t.memoizedState;
            o = f.element, pu(e, t), vu(t, i, null, a);
            var d = t.memoizedState;
            if (i = d.cache, pn(t, Gl, i), i !== f.cache && ei(
              t,
              [Gl],
              a,
              !0
            ), ko(), i = d.element, f.isDehydrated)
              if (f = {
                element: i,
                isDehydrated: !1,
                cache: d.cache
              }, t.updateQueue.baseState = f, t.memoizedState = f, t.flags & 256) {
                t = py(
                  e,
                  t,
                  i,
                  a
                );
                break e;
              } else if (i !== o) {
                o = ra(
                  Error(
                    "This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."
                  ),
                  t
                ), Or(o), t = py(
                  e,
                  t,
                  i,
                  a
                );
                break e;
              } else {
                switch (e = t.stateNode.containerInfo, e.nodeType) {
                  case 9:
                    e = e.body;
                    break;
                  default:
                    e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
                }
                for (tl = tn(e.firstChild), Ra = t, ft = !0, Zf = null, hc = !1, eu = null, Vu = !0, a = gb(
                  t,
                  null,
                  i,
                  a
                ), t.child = a; a; )
                  a.flags = a.flags & -3 | 4096, a = a.sibling;
              }
            else {
              if (xi(), i === o) {
                t = Qn(
                  e,
                  t,
                  a
                );
                break e;
              }
              ql(
                e,
                t,
                i,
                a
              );
            }
            t = t.child;
          }
          return t;
        case 26:
          return Kr(e, t), e === null ? (a = Py(
            t.type,
            null,
            t.pendingProps,
            null
          )) ? t.memoizedState = a : ft || (a = t.type, e = t.pendingProps, i = Zt(
            ln.current
          ), i = rs(
            i
          ).createElement(a), i[Pt] = t, i[Oa] = e, It(i, a, e), pe(i), t.stateNode = i) : t.memoizedState = Py(
            t.type,
            e.memoizedProps,
            t.pendingProps,
            e.memoizedState
          ), null;
        case 27:
          return te(t), e === null && ft && (i = Zt(ln.current), o = Z(), i = t.stateNode = pi(
            t.type,
            t.pendingProps,
            i,
            o,
            !1
          ), hc || (o = Ua(
            i,
            t.type,
            t.pendingProps,
            o
          ), o !== null && (Hc(t, 0).serverProps = o)), Ra = t, Vu = !0, o = tl, ic(t.type) ? (pS = o, tl = tn(
            i.firstChild
          )) : tl = o), ql(
            e,
            t,
            t.pendingProps.children,
            a
          ), Kr(e, t), e === null && (t.flags |= 4194304), t.child;
        case 5:
          return e === null && ft && (f = Z(), i = mr(
            t.type,
            f.ancestorInfo
          ), o = tl, (d = !o) || (d = Og(
            o,
            t.type,
            t.pendingProps,
            Vu
          ), d !== null ? (t.stateNode = d, hc || (f = Ua(
            d,
            t.type,
            t.pendingProps,
            f
          ), f !== null && (Hc(t, 0).serverProps = f)), Ra = t, tl = tn(
            d.firstChild
          ), Vu = !1, f = !0) : f = !1, d = !f), d && (i && la(t, o), yn(t))), te(t), o = t.type, f = t.pendingProps, d = e !== null ? e.memoizedProps : null, i = f.children, Ef(o, f) ? i = null : d !== null && Ef(o, d) && (t.flags |= 32), t.memoizedState !== null && (o = ey(
            e,
            t,
            Nr,
            null,
            null,
            a
          ), d0._currentValue = o), Kr(e, t), ql(
            e,
            t,
            i,
            a
          ), t.child;
        case 6:
          return e === null && ft && (a = t.pendingProps, e = Z(), i = e.ancestorInfo.current, a = i != null ? yr(
            a,
            i.tag,
            e.ancestorInfo.implicitRootScope
          ) : !0, e = tl, (i = !e) || (i = Rg(
            e,
            t.pendingProps,
            Vu
          ), i !== null ? (t.stateNode = i, Ra = t, tl = null, i = !0) : i = !1, i = !i), i && (a && la(t, e), yn(t))), null;
        case 13:
          return Qd(e, t, a);
        case 4:
          return wt(
            t,
            t.stateNode.containerInfo
          ), i = t.pendingProps, e === null ? t.child = xs(
            t,
            null,
            i,
            a
          ) : ql(
            e,
            t,
            i,
            a
          ), t.child;
        case 11:
          return J0(
            e,
            t,
            t.type,
            t.pendingProps,
            a
          );
        case 7:
          return ql(
            e,
            t,
            t.pendingProps,
            a
          ), t.child;
        case 8:
          return ql(
            e,
            t,
            t.pendingProps.children,
            a
          ), t.child;
        case 12:
          return t.flags |= 4, t.flags |= 2048, i = t.stateNode, i.effectDuration = -0, i.passiveEffectDuration = -0, ql(
            e,
            t,
            t.pendingProps.children,
            a
          ), t.child;
        case 10:
          return i = t.type, o = t.pendingProps, f = o.value, "value" in o || Qb || (Qb = !0, console.error(
            "The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"
          )), pn(t, i, f), ql(
            e,
            t,
            o.children,
            a
          ), t.child;
        case 9:
          return o = t.type._context, i = t.pendingProps.children, typeof i != "function" && console.error(
            "A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."
          ), Gi(t), o = Et(o), i = B1(
            i,
            o,
            void 0
          ), t.flags |= 1, ql(
            e,
            t,
            i,
            a
          ), t.child;
        case 14:
          return fy(
            e,
            t,
            t.type,
            t.pendingProps,
            a
          );
        case 15:
          return ry(
            e,
            t,
            t.type,
            t.pendingProps,
            a
          );
        case 19:
          return Sy(
            e,
            t,
            a
          );
        case 31:
          return K0(e, t, a);
        case 22:
          return sy(
            e,
            t,
            a,
            t.pendingProps
          );
        case 24:
          return Gi(t), i = Et(Gl), e === null ? (o = ai(), o === null && (o = Vt, f = Td(), o.pooledCache = f, Bc(f), f !== null && (o.pooledCacheLanes |= a), o = f), t.memoizedState = {
            parent: i,
            cache: o
          }, ct(t), pn(t, Gl, o)) : ((e.lanes & a) !== 0 && (pu(e, t), vu(t, null, null, a), ko()), o = e.memoizedState, f = t.memoizedState, o.parent !== i ? (o = {
            parent: i,
            cache: i
          }, t.memoizedState = o, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = o), pn(t, Gl, i)) : (i = f.cache, pn(t, Gl, i), i !== o.cache && ei(
            t,
            [Gl],
            a,
            !0
          ))), ql(
            e,
            t,
            t.pendingProps.children,
            a
          ), t.child;
        case 29:
          throw t.pendingProps;
      }
      throw Error(
        "Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue."
      );
    }
    function Ru(e) {
      e.flags |= 4;
    }
    function Kd(e, t, a, i, o) {
      if ((t = (e.mode & $E) !== Ne) && (t = !1), t) {
        if (e.flags |= 16777216, (o & 335544128) === o)
          if (e.stateNode.complete) e.flags |= 8192;
          else if (qy()) e.flags |= 8192;
          else
            throw qs = rv, j1;
      } else e.flags &= -16777217;
    }
    function k0(e, t) {
      if (t.type !== "stylesheet" || (t.state.loading & ku) !== ks)
        e.flags &= -16777217;
      else if (e.flags |= 16777216, !ut(t))
        if (qy()) e.flags |= 8192;
        else
          throw qs = rv, j1;
    }
    function of(e, t) {
      t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Mo() : 536870912, e.lanes |= t, Qs |= t);
    }
    function ff(e, t) {
      if (!ft)
        switch (e.tailMode) {
          case "hidden":
            t = e.tail;
            for (var a = null; t !== null; )
              t.alternate !== null && (a = t), t = t.sibling;
            a === null ? e.tail = null : a.sibling = null;
            break;
          case "collapsed":
            a = e.tail;
            for (var i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : i.sibling = null;
        }
    }
    function Ut(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = 0, i = 0;
      if (t)
        if ((e.mode & Pe) !== Ne) {
          for (var o = e.selfBaseDuration, f = e.child; f !== null; )
            a |= f.lanes | f.childLanes, i |= f.subtreeFlags & 65011712, i |= f.flags & 65011712, o += f.treeBaseDuration, f = f.sibling;
          e.treeBaseDuration = o;
        } else
          for (o = e.child; o !== null; )
            a |= o.lanes | o.childLanes, i |= o.subtreeFlags & 65011712, i |= o.flags & 65011712, o.return = e, o = o.sibling;
      else if ((e.mode & Pe) !== Ne) {
        o = e.actualDuration, f = e.selfBaseDuration;
        for (var d = e.child; d !== null; )
          a |= d.lanes | d.childLanes, i |= d.subtreeFlags, i |= d.flags, o += d.actualDuration, f += d.treeBaseDuration, d = d.sibling;
        e.actualDuration = o, e.treeBaseDuration = f;
      } else
        for (o = e.child; o !== null; )
          a |= o.lanes | o.childLanes, i |= o.subtreeFlags, i |= o.flags, o.return = e, o = o.sibling;
      return e.subtreeFlags |= i, e.childLanes = a, t;
    }
    function by(e, t, a) {
      var i = t.pendingProps;
      switch (bd(t), t.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return Ut(t), null;
        case 1:
          return Ut(t), null;
        case 3:
          return a = t.stateNode, i = null, e !== null && (i = e.memoizedState.cache), t.memoizedState.cache !== i && (t.flags |= 2048), jn(Gl, t), D(t), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (e === null || e.child === null) && (Nc(t) ? (wi(), Ru(t)) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ar())), Ut(t), null;
        case 26:
          var o = t.type, f = t.memoizedState;
          return e === null ? (Ru(t), f !== null ? (Ut(t), k0(
            t,
            f
          )) : (Ut(t), Kd(
            t,
            o,
            null,
            i,
            a
          ))) : f ? f !== e.memoizedState ? (Ru(t), Ut(t), k0(
            t,
            f
          )) : (Ut(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== i && Ru(t), Ut(t), Kd(
            t,
            o,
            e,
            i,
            a
          )), null;
        case 27:
          if (Se(t), a = Zt(ln.current), o = t.type, e !== null && t.stateNode != null)
            e.memoizedProps !== i && Ru(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw Error(
                  "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue."
                );
              return Ut(t), null;
            }
            e = Z(), Nc(t) ? Zm(t) : (e = pi(
              o,
              i,
              a,
              e,
              !0
            ), t.stateNode = e, Ru(t));
          }
          return Ut(t), null;
        case 5:
          if (Se(t), o = t.type, e !== null && t.stateNode != null)
            e.memoizedProps !== i && Ru(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw Error(
                  "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue."
                );
              return Ut(t), null;
            }
            var d = Z();
            if (Nc(t))
              Zm(t);
            else {
              switch (f = Zt(ln.current), mr(o, d.ancestorInfo), d = d.context, f = rs(f), d) {
                case pm:
                  f = f.createElementNS(
                    ke,
                    o
                  );
                  break;
                case jv:
                  f = f.createElementNS(
                    Ve,
                    o
                  );
                  break;
                default:
                  switch (o) {
                    case "svg":
                      f = f.createElementNS(
                        ke,
                        o
                      );
                      break;
                    case "math":
                      f = f.createElementNS(
                        Ve,
                        o
                      );
                      break;
                    case "script":
                      f = f.createElement("div"), f.innerHTML = "<script><\/script>", f = f.removeChild(
                        f.firstChild
                      );
                      break;
                    case "select":
                      f = typeof i.is == "string" ? f.createElement("select", {
                        is: i.is
                      }) : f.createElement("select"), i.multiple ? f.multiple = !0 : i.size && (f.size = i.size);
                      break;
                    default:
                      f = typeof i.is == "string" ? f.createElement(o, {
                        is: i.is
                      }) : f.createElement(o), o.indexOf("-") === -1 && (o !== o.toLowerCase() && console.error(
                        "<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.",
                        o
                      ), Object.prototype.toString.call(f) !== "[object HTMLUnknownElement]" || an.call(h2, o) || (h2[o] = !0, console.error(
                        "The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.",
                        o
                      )));
                  }
              }
              f[Pt] = t, f[Oa] = i;
              e: for (d = t.child; d !== null; ) {
                if (d.tag === 5 || d.tag === 6)
                  f.appendChild(d.stateNode);
                else if (d.tag !== 4 && d.tag !== 27 && d.child !== null) {
                  d.child.return = d, d = d.child;
                  continue;
                }
                if (d === t) break e;
                for (; d.sibling === null; ) {
                  if (d.return === null || d.return === t)
                    break e;
                  d = d.return;
                }
                d.sibling.return = d.return, d = d.sibling;
              }
              t.stateNode = f;
              e: switch (It(f, o, i), o) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  i = !!i.autoFocus;
                  break e;
                case "img":
                  i = !0;
                  break e;
                default:
                  i = !1;
              }
              i && Ru(t);
            }
          }
          return Ut(t), Kd(
            t,
            t.type,
            e === null ? null : e.memoizedProps,
            t.pendingProps,
            a
          ), null;
        case 6:
          if (e && t.stateNode != null)
            e.memoizedProps !== i && Ru(t);
          else {
            if (typeof i != "string" && t.stateNode === null)
              throw Error(
                "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue."
              );
            if (e = Zt(ln.current), a = Z(), Nc(t)) {
              if (e = t.stateNode, a = t.memoizedProps, o = !hc, i = null, f = Ra, f !== null)
                switch (f.tag) {
                  case 3:
                    o && (o = _g(
                      e,
                      a,
                      i
                    ), o !== null && (Hc(t, 0).serverProps = o));
                    break;
                  case 27:
                  case 5:
                    i = f.memoizedProps, o && (o = _g(
                      e,
                      a,
                      i
                    ), o !== null && (Hc(
                      t,
                      0
                    ).serverProps = o));
                }
              e[Pt] = t, e = !!(e.nodeValue === a || i !== null && i.suppressHydrationWarning === !0 || Ky(e.nodeValue, a)), e || yn(t, !0);
            } else
              o = a.ancestorInfo.current, o != null && yr(
                i,
                o.tag,
                a.ancestorInfo.implicitRootScope
              ), e = rs(e).createTextNode(
                i
              ), e[Pt] = t, t.stateNode = e;
          }
          return Ut(t), null;
        case 31:
          if (a = t.memoizedState, e === null || e.memoizedState !== null) {
            if (i = Nc(t), a !== null) {
              if (e === null) {
                if (!i)
                  throw Error(
                    "A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React."
                  );
                if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e)
                  throw Error(
                    "Expected to have a hydrated activity instance. This error is likely caused by a bug in React. Please file an issue."
                  );
                e[Pt] = t, Ut(t), (t.mode & Pe) !== Ne && a !== null && (e = t.child, e !== null && (t.treeBaseDuration -= e.treeBaseDuration));
              } else
                wi(), xi(), (t.flags & 128) === 0 && (a = t.memoizedState = null), t.flags |= 4, Ut(t), (t.mode & Pe) !== Ne && a !== null && (e = t.child, e !== null && (t.treeBaseDuration -= e.treeBaseDuration));
              e = !1;
            } else
              a = Ar(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), e = !0;
            if (!e)
              return t.flags & 256 ? (Yl(t), t) : (Yl(t), null);
            if ((t.flags & 128) !== 0)
              throw Error(
                "Client rendering an Activity suspended it again. This is a bug in React."
              );
          }
          return Ut(t), null;
        case 13:
          if (i = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            if (o = i, f = Nc(t), o !== null && o.dehydrated !== null) {
              if (e === null) {
                if (!f)
                  throw Error(
                    "A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React."
                  );
                if (f = t.memoizedState, f = f !== null ? f.dehydrated : null, !f)
                  throw Error(
                    "Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue."
                  );
                f[Pt] = t, Ut(t), (t.mode & Pe) !== Ne && o !== null && (o = t.child, o !== null && (t.treeBaseDuration -= o.treeBaseDuration));
              } else
                wi(), xi(), (t.flags & 128) === 0 && (o = t.memoizedState = null), t.flags |= 4, Ut(t), (t.mode & Pe) !== Ne && o !== null && (o = t.child, o !== null && (t.treeBaseDuration -= o.treeBaseDuration));
              o = !1;
            } else
              o = Ar(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = o), o = !0;
            if (!o)
              return t.flags & 256 ? (Yl(t), t) : (Yl(t), null);
          }
          return Yl(t), (t.flags & 128) !== 0 ? (t.lanes = a, (t.mode & Pe) !== Ne && jc(t), t) : (a = i !== null, e = e !== null && e.memoizedState !== null, a && (i = t.child, o = null, i.alternate !== null && i.alternate.memoizedState !== null && i.alternate.memoizedState.cachePool !== null && (o = i.alternate.memoizedState.cachePool.pool), f = null, i.memoizedState !== null && i.memoizedState.cachePool !== null && (f = i.memoizedState.cachePool.pool), f !== o && (i.flags |= 2048)), a !== e && a && (t.child.flags |= 8192), of(t, t.updateQueue), Ut(t), (t.mode & Pe) !== Ne && a && (e = t.child, e !== null && (t.treeBaseDuration -= e.treeBaseDuration)), null);
        case 4:
          return D(t), e === null && nc(
            t.stateNode.containerInfo
          ), Ut(t), null;
        case 10:
          return jn(t.type, t), Ut(t), null;
        case 19:
          if (ve(Ml, t), i = t.memoizedState, i === null) return Ut(t), null;
          if (o = (t.flags & 128) !== 0, f = i.rendering, f === null)
            if (o) ff(i, !1);
            else {
              if (sl !== Ro || e !== null && (e.flags & 128) !== 0)
                for (e = t.child; e !== null; ) {
                  if (f = xc(e), f !== null) {
                    for (t.flags |= 128, ff(i, !1), e = f.updateQueue, t.updateQueue = e, of(t, e), t.subtreeFlags = 0, e = a, a = t.child; a !== null; )
                      Xm(a, e), a = a.sibling;
                    return Le(
                      Ml,
                      Ml.current & nm | $p,
                      t
                    ), ft && Yn(t, i.treeForkCount), t.child;
                  }
                  e = e.sibling;
                }
              i.tail !== null && wl() > Av && (t.flags |= 128, o = !0, ff(i, !1), t.lanes = 4194304);
            }
          else {
            if (!o)
              if (e = xc(f), e !== null) {
                if (t.flags |= 128, o = !0, e = e.updateQueue, t.updateQueue = e, of(t, e), ff(i, !0), i.tail === null && i.tailMode === "hidden" && !f.alternate && !ft)
                  return Ut(t), null;
              } else
                2 * wl() - i.renderingStartTime > Av && a !== 536870912 && (t.flags |= 128, o = !0, ff(i, !1), t.lanes = 4194304);
            i.isBackwards ? (f.sibling = t.child, t.child = f) : (e = i.last, e !== null ? e.sibling = f : t.child = f, i.last = f);
          }
          return i.tail !== null ? (e = i.tail, i.rendering = e, i.tail = e.sibling, i.renderingStartTime = wl(), e.sibling = null, a = Ml.current, a = o ? a & nm | $p : a & nm, Le(Ml, a, t), ft && Yn(t, i.treeForkCount), e) : (Ut(t), null);
        case 22:
        case 23:
          return Yl(t), Gn(t), i = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== i && (t.flags |= 8192) : i && (t.flags |= 8192), i ? (a & 536870912) !== 0 && (t.flags & 128) === 0 && (Ut(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ut(t), a = t.updateQueue, a !== null && of(t, a.retryQueue), a = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), i = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (i = t.memoizedState.cachePool.pool), i !== a && (t.flags |= 2048), e !== null && ve(Ys, t), null;
        case 24:
          return a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), jn(Gl, t), Ut(t), null;
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(
        "Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue."
      );
    }
    function W0(e, t) {
      switch (bd(t), t.tag) {
        case 1:
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & Pe) !== Ne && jc(t), t) : null;
        case 3:
          return jn(Gl, t), D(t), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
        case 26:
        case 27:
        case 5:
          return Se(t), null;
        case 31:
          if (t.memoizedState !== null) {
            if (Yl(t), t.alternate === null)
              throw Error(
                "Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue."
              );
            xi();
          }
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & Pe) !== Ne && jc(t), t) : null;
        case 13:
          if (Yl(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
            if (t.alternate === null)
              throw Error(
                "Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue."
              );
            xi();
          }
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & Pe) !== Ne && jc(t), t) : null;
        case 19:
          return ve(Ml, t), null;
        case 4:
          return D(t), null;
        case 10:
          return jn(t.type, t), null;
        case 22:
        case 23:
          return Yl(t), Gn(t), e !== null && ve(Ys, t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & Pe) !== Ne && jc(t), t) : null;
        case 24:
          return jn(Gl, t), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function Ey(e, t) {
      switch (bd(t), t.tag) {
        case 3:
          jn(Gl, t), D(t);
          break;
        case 26:
        case 27:
        case 5:
          Se(t);
          break;
        case 4:
          D(t);
          break;
        case 31:
          t.memoizedState !== null && Yl(t);
          break;
        case 13:
          Yl(t);
          break;
        case 19:
          ve(Ml, t);
          break;
        case 10:
          jn(t.type, t);
          break;
        case 22:
        case 23:
          Yl(t), Gn(t), e !== null && ve(Ys, t);
          break;
        case 24:
          jn(Gl, t);
      }
    }
    function zu(e) {
      return (e.mode & Pe) !== Ne;
    }
    function F0(e, t) {
      zu(e) ? (cl(), si(t, e), da()) : si(t, e);
    }
    function $d(e, t, a) {
      zu(e) ? (cl(), Ii(
        a,
        e,
        t
      ), da()) : Ii(
        a,
        e,
        t
      );
    }
    function si(e, t) {
      try {
        var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
        if (i !== null) {
          var o = i.next;
          a = o;
          do {
            if ((a.tag & e) === e && (i = void 0, (e & on) !== dv && (hm = !0), i = se(
              t,
              eT,
              a
            ), (e & on) !== dv && (hm = !1), i !== void 0 && typeof i != "function")) {
              var f = void 0;
              f = (a.tag & lu) !== 0 ? "useLayoutEffect" : (a.tag & on) !== 0 ? "useInsertionEffect" : "useEffect";
              var d = void 0;
              d = i === null ? " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof i.then == "function" ? `

It looks like you wrote ` + f + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + f + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://react.dev/link/hooks-data-fetching` : " You returned: " + i, se(
                t,
                function(h, y) {
                  console.error(
                    "%s must not return anything besides a function, which is used for clean-up.%s",
                    h,
                    y
                  );
                },
                f,
                d
              );
            }
            a = a.next;
          } while (a !== o);
        }
      } catch (h) {
        $e(t, t.return, h);
      }
    }
    function Ii(e, t, a) {
      try {
        var i = t.updateQueue, o = i !== null ? i.lastEffect : null;
        if (o !== null) {
          var f = o.next;
          i = f;
          do {
            if ((i.tag & e) === e) {
              var d = i.inst, h = d.destroy;
              h !== void 0 && (d.destroy = void 0, (e & on) !== dv && (hm = !0), o = t, se(
                o,
                tT,
                o,
                a,
                h
              ), (e & on) !== dv && (hm = !1));
            }
            i = i.next;
          } while (i !== f);
        }
      } catch (y) {
        $e(t, t.return, y);
      }
    }
    function Wr(e, t) {
      zu(e) ? (cl(), si(t, e), da()) : si(t, e);
    }
    function kd(e, t, a) {
      zu(e) ? (cl(), Ii(
        a,
        e,
        t
      ), da()) : Ii(
        a,
        e,
        t
      );
    }
    function Ty(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var a = e.stateNode;
        e.type.defaultProps || "ref" in e.memoizedProps || om || (a.props !== e.memoizedProps && console.error(
          "Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.",
          re(e) || "instance"
        ), a.state !== e.memoizedState && console.error(
          "Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.",
          re(e) || "instance"
        ));
        try {
          se(
            e,
            Wo,
            t,
            a
          );
        } catch (i) {
          $e(e, e.return, i);
        }
      }
    }
    function Fr(e, t, a) {
      return e.getSnapshotBeforeUpdate(t, a);
    }
    function I0(e, t) {
      var a = t.memoizedProps, i = t.memoizedState;
      t = e.stateNode, e.type.defaultProps || "ref" in e.memoizedProps || om || (t.props !== e.memoizedProps && console.error(
        "Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.",
        re(e) || "instance"
      ), t.state !== e.memoizedState && console.error(
        "Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.",
        re(e) || "instance"
      ));
      try {
        var o = Ou(
          e.type,
          a
        ), f = se(
          e,
          Fr,
          t,
          o,
          i
        );
        a = Vb, f !== void 0 || a.has(e.type) || (a.add(e.type), se(e, function() {
          console.error(
            "%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.",
            re(e)
          );
        })), t.__reactInternalSnapshotBeforeUpdate = f;
      } catch (d) {
        $e(e, e.return, d);
      }
    }
    function Wd(e, t, a) {
      a.props = Ou(
        e.type,
        e.memoizedProps
      ), a.state = e.memoizedState, zu(e) ? (cl(), se(
        e,
        fb,
        e,
        t,
        a
      ), da()) : se(
        e,
        fb,
        e,
        t,
        a
      );
    }
    function P0(e) {
      var t = e.ref;
      if (t !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var a = e.stateNode;
            break;
          case 30:
            a = e.stateNode;
            break;
          default:
            a = e.stateNode;
        }
        if (typeof t == "function")
          if (zu(e))
            try {
              cl(), e.refCleanup = t(a);
            } finally {
              da();
            }
          else e.refCleanup = t(a);
        else
          typeof t == "string" ? console.error("String refs are no longer supported.") : t.hasOwnProperty("current") || console.error(
            "Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().",
            re(e)
          ), t.current = a;
      }
    }
    function Fc(e, t) {
      try {
        se(e, P0, e);
      } catch (a) {
        $e(e, t, a);
      }
    }
    function En(e, t) {
      var a = e.ref, i = e.refCleanup;
      if (a !== null)
        if (typeof i == "function")
          try {
            if (zu(e))
              try {
                cl(), se(e, i);
              } finally {
                da(e);
              }
            else se(e, i);
          } catch (o) {
            $e(e, t, o);
          } finally {
            e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
          }
        else if (typeof a == "function")
          try {
            if (zu(e))
              try {
                cl(), se(e, a, null);
              } finally {
                da(e);
              }
            else se(e, a, null);
          } catch (o) {
            $e(e, t, o);
          }
        else a.current = null;
    }
    function Ay(e, t, a, i) {
      var o = e.memoizedProps, f = o.id, d = o.onCommit;
      o = o.onRender, t = t === null ? "mount" : "update", iv && (t = "nested-update"), typeof o == "function" && o(
        f,
        t,
        e.actualDuration,
        e.treeBaseDuration,
        e.actualStartTime,
        a
      ), typeof d == "function" && d(f, t, i, a);
    }
    function eg(e, t, a, i) {
      var o = e.memoizedProps;
      e = o.id, o = o.onPostCommit, t = t === null ? "mount" : "update", iv && (t = "nested-update"), typeof o == "function" && o(
        e,
        t,
        i,
        a
      );
    }
    function Pi(e) {
      var t = e.type, a = e.memoizedProps, i = e.stateNode;
      try {
        se(
          e,
          hg,
          i,
          t,
          a,
          e
        );
      } catch (o) {
        $e(e, e.return, o);
      }
    }
    function Fd(e, t, a) {
      try {
        se(
          e,
          gh,
          e.stateNode,
          e.type,
          a,
          t,
          e
        );
      } catch (i) {
        $e(e, e.return, i);
      }
    }
    function Oy(e) {
      return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && ic(e.type) || e.tag === 4;
    }
    function Id(e) {
      e: for (; ; ) {
        for (; e.sibling === null; ) {
          if (e.return === null || Oy(e.return)) return null;
          e = e.return;
        }
        for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
          if (e.tag === 27 && ic(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
          e.child.return = e, e = e.child;
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function rf(e, t, a) {
      var i = e.tag;
      if (i === 5 || i === 6)
        e = e.stateNode, t ? (yg(a), (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(e, t)) : (yg(a), t = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, t.appendChild(e), a = a._reactRootContainer, a != null || t.onclick !== null || (t.onclick = hn));
      else if (i !== 4 && (i === 27 && ic(e.type) && (a = e.stateNode, t = null), e = e.child, e !== null))
        for (rf(e, t, a), e = e.sibling; e !== null; )
          rf(e, t, a), e = e.sibling;
    }
    function Ir(e, t, a) {
      var i = e.tag;
      if (i === 5 || i === 6)
        e = e.stateNode, t ? a.insertBefore(e, t) : a.appendChild(e);
      else if (i !== 4 && (i === 27 && ic(e.type) && (a = e.stateNode), e = e.child, e !== null))
        for (Ir(e, t, a), e = e.sibling; e !== null; )
          Ir(e, t, a), e = e.sibling;
    }
    function Ry(e) {
      for (var t, a = e.return; a !== null; ) {
        if (Oy(a)) {
          t = a;
          break;
        }
        a = a.return;
      }
      if (t == null)
        throw Error(
          "Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue."
        );
      switch (t.tag) {
        case 27:
          t = t.stateNode, a = Id(e), Ir(
            e,
            a,
            t
          );
          break;
        case 5:
          a = t.stateNode, t.flags & 32 && (vh(a), t.flags &= -33), t = Id(e), Ir(
            e,
            t,
            a
          );
          break;
        case 3:
        case 4:
          t = t.stateNode.containerInfo, a = Id(e), rf(
            e,
            a,
            t
          );
          break;
        default:
          throw Error(
            "Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue."
          );
      }
    }
    function zy(e) {
      var t = e.stateNode, a = e.memoizedProps;
      try {
        se(
          e,
          Bu,
          e.type,
          a,
          t,
          e
        );
      } catch (i) {
        $e(e, e.return, i);
      }
    }
    function Dy(e, t) {
      return t.tag === 31 ? (t = t.memoizedState, e.memoizedState !== null && t === null) : t.tag === 13 ? (e = e.memoizedState, t = t.memoizedState, e !== null && e.dehydrated !== null && (t === null || t.dehydrated === null)) : t.tag === 3 ? e.memoizedState.isDehydrated && (t.flags & 256) === 0 : !1;
    }
    function a1(e, t) {
      if (e = e.containerInfo, hS = Gv, e = hd(e), Bm(e)) {
        if ("selectionStart" in e)
          var a = {
            start: e.selectionStart,
            end: e.selectionEnd
          };
        else
          e: {
            a = (a = e.ownerDocument) && a.defaultView || window;
            var i = a.getSelection && a.getSelection();
            if (i && i.rangeCount !== 0) {
              a = i.anchorNode;
              var o = i.anchorOffset, f = i.focusNode;
              i = i.focusOffset;
              try {
                a.nodeType, f.nodeType;
              } catch {
                a = null;
                break e;
              }
              var d = 0, h = -1, y = -1, p = 0, R = 0, _ = e, E = null;
              t: for (; ; ) {
                for (var x; _ !== a || o !== 0 && _.nodeType !== 3 || (h = d + o), _ !== f || i !== 0 && _.nodeType !== 3 || (y = d + i), _.nodeType === 3 && (d += _.nodeValue.length), (x = _.firstChild) !== null; )
                  E = _, _ = x;
                for (; ; ) {
                  if (_ === e) break t;
                  if (E === a && ++p === o && (h = d), E === f && ++R === i && (y = d), (x = _.nextSibling) !== null) break;
                  _ = E, E = _.parentNode;
                }
                _ = x;
              }
              a = h === -1 || y === -1 ? null : { start: h, end: y };
            } else a = null;
          }
        a = a || { start: 0, end: 0 };
      } else a = null;
      for (mS = {
        focusedElem: e,
        selectionRange: a
      }, Gv = !1, ca = t; ca !== null; )
        if (t = ca, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
          e.return = t, ca = e;
        else
          for (; ca !== null; ) {
            switch (e = t = ca, a = e.alternate, o = e.flags, e.tag) {
              case 0:
                if ((o & 4) !== 0 && (e = e.updateQueue, e = e !== null ? e.events : null, e !== null))
                  for (a = 0; a < e.length; a++)
                    o = e[a], o.ref.impl = o.nextImpl;
                break;
              case 11:
              case 15:
                break;
              case 1:
                (o & 1024) !== 0 && a !== null && I0(e, a);
                break;
              case 3:
                if ((o & 1024) !== 0) {
                  if (e = e.stateNode.containerInfo, a = e.nodeType, a === 9)
                    Af(e);
                  else if (a === 1)
                    switch (e.nodeName) {
                      case "HEAD":
                      case "HTML":
                      case "BODY":
                        Af(e);
                        break;
                      default:
                        e.textContent = "";
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
                if ((o & 1024) !== 0)
                  throw Error(
                    "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue."
                  );
            }
            if (e = t.sibling, e !== null) {
              e.return = t.return, ca = e;
              break;
            }
            ca = t.return;
          }
    }
    function Pd(e, t, a) {
      var i = Wt(), o = gn(), f = Va(), d = vn(), h = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          Fa(e, a), h & 4 && F0(a, lu | Ku);
          break;
        case 1:
          if (Fa(e, a), h & 4)
            if (e = a.stateNode, t === null)
              a.type.defaultProps || "ref" in a.memoizedProps || om || (e.props !== a.memoizedProps && console.error(
                "Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.",
                re(a) || "instance"
              ), e.state !== a.memoizedState && console.error(
                "Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.",
                re(a) || "instance"
              )), zu(a) ? (cl(), se(
                a,
                Y1,
                a,
                e
              ), da()) : se(
                a,
                Y1,
                a,
                e
              );
            else {
              var y = Ou(
                a.type,
                t.memoizedProps
              );
              t = t.memoizedState, a.type.defaultProps || "ref" in a.memoizedProps || om || (e.props !== a.memoizedProps && console.error(
                "Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.",
                re(a) || "instance"
              ), e.state !== a.memoizedState && console.error(
                "Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.",
                re(a) || "instance"
              )), zu(a) ? (cl(), se(
                a,
                ib,
                a,
                e,
                y,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              ), da()) : se(
                a,
                ib,
                a,
                e,
                y,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            }
          h & 64 && Ty(a), h & 512 && Fc(a, a.return);
          break;
        case 3:
          if (t = yu(), Fa(e, a), h & 64 && (h = a.updateQueue, h !== null)) {
            if (y = null, a.child !== null)
              switch (a.child.tag) {
                case 27:
                case 5:
                  y = a.child.stateNode;
                  break;
                case 1:
                  y = a.child.stateNode;
              }
            try {
              se(
                a,
                Wo,
                h,
                y
              );
            } catch (R) {
              $e(a, a.return, R);
            }
          }
          e.effectDuration += Jo(t);
          break;
        case 27:
          t === null && h & 4 && zy(a);
        case 26:
        case 5:
          if (Fa(e, a), t === null) {
            if (h & 4) Pi(a);
            else if (h & 64) {
              e = a.type, t = a.memoizedProps, y = a.stateNode;
              try {
                se(
                  a,
                  mg,
                  y,
                  e,
                  t,
                  a
                );
              } catch (R) {
                $e(
                  a,
                  a.return,
                  R
                );
              }
            }
          }
          h & 512 && Fc(a, a.return);
          break;
        case 12:
          if (h & 4) {
            h = yu(), Fa(e, a), e = a.stateNode, e.effectDuration += sa(h);
            try {
              se(
                a,
                Ay,
                a,
                t,
                Jf,
                e.effectDuration
              );
            } catch (R) {
              $e(a, a.return, R);
            }
          } else Fa(e, a);
          break;
        case 31:
          Fa(e, a), h & 4 && My(e, a);
          break;
        case 13:
          Fa(e, a), h & 4 && Cy(e, a), h & 64 && (e = a.memoizedState, e !== null && (e = e.dehydrated, e !== null && (h = hi.bind(
            null,
            a
          ), zg(e, h))));
          break;
        case 22:
          if (h = a.memoizedState !== null || Oo, !h) {
            t = t !== null && t.memoizedState !== null || Vl, y = Oo;
            var p = Vl;
            Oo = h, (Vl = t) && !p ? (Vn(
              e,
              a,
              (a.subtreeFlags & 8772) !== 0
            ), (a.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && 0.05 < Ue - ze && md(
              a,
              ze,
              Ue
            )) : Fa(e, a), Oo = y, Vl = p;
          }
          break;
        case 30:
          break;
        default:
          Fa(e, a);
      }
      (a.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && ((gl || 0.05 < rl) && Bn(
        a,
        ze,
        Ue,
        rl,
        il
      ), a.alternate === null && a.return !== null && a.return.alternate !== null && 0.05 < Ue - ze && (Dy(
        a.return.alternate,
        a.return
      ) || mn(
        a,
        ze,
        Ue,
        "Mount"
      ))), Nl(i), Qa(o), il = f, gl = d;
    }
    function yl(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, yl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && U(t)), e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
    }
    function Kt(e, t, a) {
      for (a = a.child; a !== null; )
        _y(
          e,
          t,
          a
        ), a = a.sibling;
    }
    function _y(e, t, a) {
      if (Dl && typeof Dl.onCommitFiberUnmount == "function")
        try {
          Dl.onCommitFiberUnmount(ro, a);
        } catch (p) {
          ju || (ju = !0, console.error(
            "React instrumentation encountered an error: %o",
            p
          ));
        }
      var i = Wt(), o = gn(), f = Va(), d = vn();
      switch (a.tag) {
        case 26:
          Vl || En(a, t), Kt(
            e,
            t,
            a
          ), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (e = a.stateNode, e.parentNode.removeChild(e));
          break;
        case 27:
          Vl || En(a, t);
          var h = Zl, y = zn;
          ic(a.type) && (Zl = a.stateNode, zn = !1), Kt(
            e,
            t,
            a
          ), se(
            a,
            gi,
            a.stateNode
          ), Zl = h, zn = y;
          break;
        case 5:
          Vl || En(a, t);
        case 6:
          if (h = Zl, y = zn, Zl = null, Kt(
            e,
            t,
            a
          ), Zl = h, zn = y, Zl !== null)
            if (zn)
              try {
                se(
                  a,
                  gg,
                  Zl,
                  a.stateNode
                );
              } catch (p) {
                $e(
                  a,
                  t,
                  p
                );
              }
            else
              try {
                se(
                  a,
                  pg,
                  Zl,
                  a.stateNode
                );
              } catch (p) {
                $e(
                  a,
                  t,
                  p
                );
              }
          break;
        case 18:
          Zl !== null && (zn ? (e = Zl, lo(
            e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
            a.stateNode
          ), io(e)) : lo(Zl, a.stateNode));
          break;
        case 4:
          h = Zl, y = zn, Zl = a.stateNode.containerInfo, zn = !0, Kt(
            e,
            t,
            a
          ), Zl = h, zn = y;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          Ii(
            on,
            a,
            t
          ), Vl || $d(
            a,
            t,
            lu
          ), Kt(
            e,
            t,
            a
          );
          break;
        case 1:
          Vl || (En(a, t), h = a.stateNode, typeof h.componentWillUnmount == "function" && Wd(
            a,
            t,
            h
          )), Kt(
            e,
            t,
            a
          );
          break;
        case 21:
          Kt(
            e,
            t,
            a
          );
          break;
        case 22:
          Vl = (h = Vl) || a.memoizedState !== null, Kt(
            e,
            t,
            a
          ), Vl = h;
          break;
        default:
          Kt(
            e,
            t,
            a
          );
      }
      (a.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && (gl || 0.05 < rl) && Bn(
        a,
        ze,
        Ue,
        rl,
        il
      ), Nl(i), Qa(o), il = f, gl = d;
    }
    function My(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
        e = e.dehydrated;
        try {
          se(
            t,
            Sh,
            e
          );
        } catch (a) {
          $e(t, t.return, a);
        }
      }
    }
    function Cy(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
        try {
          se(
            t,
            Fy,
            e
          );
        } catch (a) {
          $e(t, t.return, a);
        }
    }
    function tg(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return t === null && (t = e.stateNode = new Zb()), t;
        case 22:
          return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Zb()), t;
        default:
          throw Error(
            "Unexpected Suspense handler tag (" + e.tag + "). This is a bug in React."
          );
      }
    }
    function ec(e, t) {
      var a = tg(e);
      t.forEach(function(i) {
        if (!a.has(i)) {
          if (a.add(i), qu)
            if (fm !== null && rm !== null)
              pf(rm, fm);
            else
              throw Error(
                "Expected finished root and lanes to be set. This is a bug in React."
              );
          var o = eo.bind(null, e, i);
          i.then(o, o);
        }
      });
    }
    function ga(e, t) {
      var a = t.deletions;
      if (a !== null)
        for (var i = 0; i < a.length; i++) {
          var o = e, f = t, d = a[i], h = Wt(), y = f;
          e: for (; y !== null; ) {
            switch (y.tag) {
              case 27:
                if (ic(y.type)) {
                  Zl = y.stateNode, zn = !1;
                  break e;
                }
                break;
              case 5:
                Zl = y.stateNode, zn = !1;
                break e;
              case 3:
              case 4:
                Zl = y.stateNode.containerInfo, zn = !0;
                break e;
            }
            y = y.return;
          }
          if (Zl === null)
            throw Error(
              "Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue."
            );
          _y(o, f, d), Zl = null, zn = !1, (d.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && 0.05 < Ue - ze && mn(
            d,
            ze,
            Ue,
            "Unmount"
          ), Nl(h), o = d, f = o.alternate, f !== null && (f.return = null), o.return = null;
        }
      if (t.subtreeFlags & 13886)
        for (t = t.child; t !== null; )
          Pr(t, e), t = t.sibling;
    }
    function Pr(e, t) {
      var a = Wt(), i = gn(), o = Va(), f = vn(), d = e.alternate, h = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ga(t, e), va(e), h & 4 && (Ii(
            on | Ku,
            e,
            e.return
          ), si(on | Ku, e), $d(
            e,
            e.return,
            lu | Ku
          ));
          break;
        case 1:
          if (ga(t, e), va(e), h & 512 && (Vl || d === null || En(d, d.return)), h & 64 && Oo && (h = e.updateQueue, h !== null && (d = h.callbacks, d !== null))) {
            var y = h.shared.hiddenCallbacks;
            h.shared.hiddenCallbacks = y === null ? d : y.concat(d);
          }
          break;
        case 26:
          if (y = Ai, ga(t, e), va(e), h & 512 && (Vl || d === null || En(d, d.return)), h & 4) {
            var p = d !== null ? d.memoizedState : null;
            if (h = e.memoizedState, d === null)
              if (h === null)
                if (e.stateNode === null) {
                  e: {
                    h = e.type, d = e.memoizedProps, y = y.ownerDocument || y;
                    t: switch (h) {
                      case "title":
                        p = y.getElementsByTagName(
                          "title"
                        )[0], (!p || p[xf] || p[Pt] || p.namespaceURI === ke || p.hasAttribute("itemprop")) && (p = y.createElement(h), y.head.insertBefore(
                          p,
                          y.querySelector(
                            "head > title"
                          )
                        )), It(p, h, d), p[Pt] = e, pe(p), h = p;
                        break e;
                      case "link":
                        var R = zf(
                          "link",
                          "href",
                          y
                        ).get(h + (d.href || ""));
                        if (R) {
                          for (var _ = 0; _ < R.length; _++)
                            if (p = R[_], p.getAttribute("href") === (d.href == null || d.href === "" ? null : d.href) && p.getAttribute("rel") === (d.rel == null ? null : d.rel) && p.getAttribute("title") === (d.title == null ? null : d.title) && p.getAttribute("crossorigin") === (d.crossOrigin == null ? null : d.crossOrigin)) {
                              R.splice(_, 1);
                              break t;
                            }
                        }
                        p = y.createElement(h), It(p, h, d), y.head.appendChild(
                          p
                        );
                        break;
                      case "meta":
                        if (R = zf(
                          "meta",
                          "content",
                          y
                        ).get(h + (d.content || ""))) {
                          for (_ = 0; _ < R.length; _++)
                            if (p = R[_], gt(
                              d.content,
                              "content"
                            ), p.getAttribute("content") === (d.content == null ? null : "" + d.content) && p.getAttribute("name") === (d.name == null ? null : d.name) && p.getAttribute("property") === (d.property == null ? null : d.property) && p.getAttribute("http-equiv") === (d.httpEquiv == null ? null : d.httpEquiv) && p.getAttribute("charset") === (d.charSet == null ? null : d.charSet)) {
                              R.splice(_, 1);
                              break t;
                            }
                        }
                        p = y.createElement(h), It(p, h, d), y.head.appendChild(
                          p
                        );
                        break;
                      default:
                        throw Error(
                          'getNodesForType encountered a type it did not expect: "' + h + '". This is a bug in React.'
                        );
                    }
                    p[Pt] = e, pe(p), h = p;
                  }
                  e.stateNode = h;
                } else
                  Cg(
                    y,
                    e.type,
                    e.stateNode
                  );
              else
                e.stateNode = Th(
                  y,
                  h,
                  e.memoizedProps
                );
            else
              p !== h ? (p === null ? d.stateNode !== null && (d = d.stateNode, d.parentNode.removeChild(d)) : p.count--, h === null ? Cg(
                y,
                e.type,
                e.stateNode
              ) : Th(
                y,
                h,
                e.memoizedProps
              )) : h === null && e.stateNode !== null && Fd(
                e,
                e.memoizedProps,
                d.memoizedProps
              );
          }
          break;
        case 27:
          ga(t, e), va(e), h & 512 && (Vl || d === null || En(d, d.return)), d !== null && h & 4 && Fd(
            e,
            e.memoizedProps,
            d.memoizedProps
          );
          break;
        case 5:
          if (ga(t, e), va(e), h & 512 && (Vl || d === null || En(d, d.return)), e.flags & 32) {
            y = e.stateNode;
            try {
              se(
                e,
                vh,
                y
              );
            } catch (de) {
              $e(e, e.return, de);
            }
          }
          h & 4 && e.stateNode != null && (y = e.memoizedProps, Fd(
            e,
            y,
            d !== null ? d.memoizedProps : y
          )), h & 1024 && ($1 = !0, e.type !== "form" && console.error(
            "Unexpected host component type. Expected a form. This is a bug in React."
          ));
          break;
        case 6:
          if (ga(t, e), va(e), h & 4) {
            if (e.stateNode === null)
              throw Error(
                "This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue."
              );
            h = e.memoizedProps, d = d !== null ? d.memoizedProps : h, y = e.stateNode;
            try {
              se(
                e,
                n1,
                y,
                d,
                h
              );
            } catch (de) {
              $e(e, e.return, de);
            }
          }
          break;
        case 3:
          if (y = yu(), qv = null, p = Ai, Ai = bh(t.containerInfo), ga(t, e), Ai = p, va(e), h & 4 && d !== null && d.memoizedState.isDehydrated)
            try {
              se(
                e,
                Wy,
                t.containerInfo
              );
            } catch (de) {
              $e(e, e.return, de);
            }
          $1 && ($1 = !1, lg(e)), t.effectDuration += Jo(
            y
          );
          break;
        case 4:
          h = Ai, Ai = bh(
            e.stateNode.containerInfo
          ), ga(t, e), va(e), Ai = h;
          break;
        case 12:
          h = yu(), ga(t, e), va(e), e.stateNode.effectDuration += sa(h);
          break;
        case 31:
          ga(t, e), va(e), h & 4 && (h = e.updateQueue, h !== null && (e.updateQueue = null, ec(e, h)));
          break;
        case 13:
          ga(t, e), va(e), e.child.flags & 8192 && e.memoizedState !== null != (d !== null && d.memoizedState !== null) && (Tv = wl()), h & 4 && (h = e.updateQueue, h !== null && (e.updateQueue = null, ec(e, h)));
          break;
        case 22:
          y = e.memoizedState !== null;
          var E = d !== null && d.memoizedState !== null, x = Oo, ue = Vl;
          if (Oo = x || y, Vl = ue || E, ga(t, e), Vl = ue, Oo = x, E && !y && !x && !ue && (e.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && 0.05 < Ue - ze && md(
            e,
            ze,
            Ue
          ), va(e), h & 8192)
            e: for (t = e.stateNode, t._visibility = y ? t._visibility & ~Hp : t._visibility | Hp, !y || d === null || E || Oo || Vl || (tc(e), (e.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && 0.05 < Ue - ze && mn(
              e,
              ze,
              Ue,
              "Disconnect"
            )), d = null, t = e; ; ) {
              if (t.tag === 5 || t.tag === 26) {
                if (d === null) {
                  E = d = t;
                  try {
                    p = E.stateNode, y ? se(
                      E,
                      Sg,
                      p
                    ) : se(
                      E,
                      Tg,
                      E.stateNode,
                      E.memoizedProps
                    );
                  } catch (de) {
                    $e(E, E.return, de);
                  }
                }
              } else if (t.tag === 6) {
                if (d === null) {
                  E = t;
                  try {
                    R = E.stateNode, y ? se(
                      E,
                      bg,
                      R
                    ) : se(
                      E,
                      Ag,
                      R,
                      E.memoizedProps
                    );
                  } catch (de) {
                    $e(E, E.return, de);
                  }
                }
              } else if (t.tag === 18) {
                if (d === null) {
                  E = t;
                  try {
                    _ = E.stateNode, y ? se(
                      E,
                      vg,
                      _
                    ) : se(
                      E,
                      Eg,
                      E.stateNode
                    );
                  } catch (de) {
                    $e(E, E.return, de);
                  }
                }
              } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
                t.child.return = t, t = t.child;
                continue;
              }
              if (t === e) break e;
              for (; t.sibling === null; ) {
                if (t.return === null || t.return === e)
                  break e;
                d === t && (d = null), t = t.return;
              }
              d === t && (d = null), t.sibling.return = t.return, t = t.sibling;
            }
          h & 4 && (h = e.updateQueue, h !== null && (d = h.retryQueue, d !== null && (h.retryQueue = null, ec(e, d))));
          break;
        case 19:
          ga(t, e), va(e), h & 4 && (h = e.updateQueue, h !== null && (e.updateQueue = null, ec(e, h)));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          ga(t, e), va(e);
      }
      (e.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && ((gl || 0.05 < rl) && Bn(
        e,
        ze,
        Ue,
        rl,
        il
      ), e.alternate === null && e.return !== null && e.return.alternate !== null && 0.05 < Ue - ze && (Dy(
        e.return.alternate,
        e.return
      ) || mn(
        e,
        ze,
        Ue,
        "Mount"
      ))), Nl(a), Qa(i), il = o, gl = f;
    }
    function va(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          se(e, Ry, e);
        } catch (a) {
          $e(e, e.return, a);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function lg(e) {
      if (e.subtreeFlags & 1024)
        for (e = e.child; e !== null; ) {
          var t = e;
          lg(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
        }
    }
    function Fa(e, t) {
      if (t.subtreeFlags & 8772)
        for (t = t.child; t !== null; )
          Pd(e, t.alternate, t), t = t.sibling;
    }
    function eh(e) {
      var t = Wt(), a = gn(), i = Va(), o = vn();
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          $d(
            e,
            e.return,
            lu
          ), tc(e);
          break;
        case 1:
          En(e, e.return);
          var f = e.stateNode;
          typeof f.componentWillUnmount == "function" && Wd(
            e,
            e.return,
            f
          ), tc(e);
          break;
        case 27:
          se(
            e,
            gi,
            e.stateNode
          );
        case 26:
        case 5:
          En(e, e.return), tc(e);
          break;
        case 22:
          e.memoizedState === null && tc(e);
          break;
        case 30:
          tc(e);
          break;
        default:
          tc(e);
      }
      (e.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && (gl || 0.05 < rl) && Bn(
        e,
        ze,
        Ue,
        rl,
        il
      ), Nl(t), Qa(a), il = i, gl = o;
    }
    function tc(e) {
      for (e = e.child; e !== null; )
        eh(e), e = e.sibling;
    }
    function Uy(e, t, a, i) {
      var o = Wt(), f = gn(), d = Va(), h = vn(), y = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          Vn(
            e,
            a,
            i
          ), F0(a, lu);
          break;
        case 1:
          if (Vn(
            e,
            a,
            i
          ), t = a.stateNode, typeof t.componentDidMount == "function" && se(
            a,
            Y1,
            a,
            t
          ), t = a.updateQueue, t !== null) {
            e = a.stateNode;
            try {
              se(
                a,
                Im,
                t,
                e
              );
            } catch (p) {
              $e(a, a.return, p);
            }
          }
          i && y & 64 && Ty(a), Fc(a, a.return);
          break;
        case 27:
          zy(a);
        case 26:
        case 5:
          Vn(
            e,
            a,
            i
          ), i && t === null && y & 4 && Pi(a), Fc(a, a.return);
          break;
        case 12:
          if (i && y & 4) {
            y = yu(), Vn(
              e,
              a,
              i
            ), i = a.stateNode, i.effectDuration += sa(y);
            try {
              se(
                a,
                Ay,
                a,
                t,
                Jf,
                i.effectDuration
              );
            } catch (p) {
              $e(a, a.return, p);
            }
          } else
            Vn(
              e,
              a,
              i
            );
          break;
        case 31:
          Vn(
            e,
            a,
            i
          ), i && y & 4 && My(e, a);
          break;
        case 13:
          Vn(
            e,
            a,
            i
          ), i && y & 4 && Cy(e, a);
          break;
        case 22:
          a.memoizedState === null && Vn(
            e,
            a,
            i
          ), Fc(a, a.return);
          break;
        case 30:
          break;
        default:
          Vn(
            e,
            a,
            i
          );
      }
      (a.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && (gl || 0.05 < rl) && Bn(
        a,
        ze,
        Ue,
        rl,
        il
      ), Nl(o), Qa(f), il = d, gl = h;
    }
    function Vn(e, t, a) {
      for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; )
        Uy(
          e,
          t.alternate,
          t,
          a
        ), t = t.sibling;
    }
    function es(e, t) {
      var a = null;
      e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== a && (e != null && Bc(e), a != null && zr(a));
    }
    function ts(e, t) {
      e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (Bc(t), e != null && zr(e));
    }
    function Ia(e, t, a, i, o) {
      if (t.subtreeFlags & 10256 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child))
        for (t = t.child; t !== null; ) {
          var f = t.sibling;
          Hy(
            e,
            t,
            a,
            i,
            f !== null ? f.actualStartTime : o
          ), t = f;
        }
    }
    function Hy(e, t, a, i, o) {
      var f = Wt(), d = gn(), h = Va(), y = vn(), p = Xf, R = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          (t.mode & Pe) !== Ne && 0 < t.actualStartTime && (t.flags & 1) !== 0 && yd(
            t,
            t.actualStartTime,
            o,
            Fl,
            a
          ), Ia(
            e,
            t,
            a,
            i,
            o
          ), R & 2048 && Wr(t, fn | Ku);
          break;
        case 1:
          (t.mode & Pe) !== Ne && 0 < t.actualStartTime && ((t.flags & 128) !== 0 ? jm(
            t,
            t.actualStartTime,
            o,
            []
          ) : (t.flags & 1) !== 0 && yd(
            t,
            t.actualStartTime,
            o,
            Fl,
            a
          )), Ia(
            e,
            t,
            a,
            i,
            o
          );
          break;
        case 3:
          var _ = yu(), E = Fl;
          Fl = t.alternate !== null && t.alternate.memoizedState.isDehydrated && (t.flags & 256) === 0, Ia(
            e,
            t,
            a,
            i,
            o
          ), Fl = E, R & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), i = t.memoizedState.cache, i !== a && (Bc(i), a != null && zr(a))), e.passiveEffectDuration += Jo(
            _
          );
          break;
        case 12:
          if (R & 2048) {
            R = yu(), Ia(
              e,
              t,
              a,
              i,
              o
            ), e = t.stateNode, e.passiveEffectDuration += sa(R);
            try {
              se(
                t,
                eg,
                t,
                t.alternate,
                Jf,
                e.passiveEffectDuration
              );
            } catch (x) {
              $e(t, t.return, x);
            }
          } else
            Ia(
              e,
              t,
              a,
              i,
              o
            );
          break;
        case 31:
          R = Fl, _ = t.alternate !== null ? t.alternate.memoizedState : null, E = t.memoizedState, _ !== null && E === null ? (E = t.deletions, E !== null && 0 < E.length && E[0].tag === 18 ? (Fl = !1, _ = _.hydrationErrors, _ !== null && jm(
            t,
            t.actualStartTime,
            o,
            _
          )) : Fl = !0) : Fl = !1, Ia(
            e,
            t,
            a,
            i,
            o
          ), Fl = R;
          break;
        case 13:
          R = Fl, _ = t.alternate !== null ? t.alternate.memoizedState : null, E = t.memoizedState, _ === null || _.dehydrated === null || E !== null && E.dehydrated !== null ? Fl = !1 : (E = t.deletions, E !== null && 0 < E.length && E[0].tag === 18 ? (Fl = !1, _ = _.hydrationErrors, _ !== null && jm(
            t,
            t.actualStartTime,
            o,
            _
          )) : Fl = !0), Ia(
            e,
            t,
            a,
            i,
            o
          ), Fl = R;
          break;
        case 23:
          break;
        case 22:
          E = t.stateNode, _ = t.alternate, t.memoizedState !== null ? E._visibility & mo ? Ia(
            e,
            t,
            a,
            i,
            o
          ) : Ic(
            e,
            t,
            a,
            i,
            o
          ) : E._visibility & mo ? Ia(
            e,
            t,
            a,
            i,
            o
          ) : (E._visibility |= mo, lc(
            e,
            t,
            a,
            i,
            (t.subtreeFlags & 10256) !== 0 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child),
            o
          ), (t.mode & Pe) === Ne || Fl || (e = t.actualStartTime, 0 <= e && 0.05 < o - e && md(t, e, o), 0 <= ze && 0 <= Ue && 0.05 < Ue - ze && md(
            t,
            ze,
            Ue
          ))), R & 2048 && es(
            _,
            t
          );
          break;
        case 24:
          Ia(
            e,
            t,
            a,
            i,
            o
          ), R & 2048 && ts(t.alternate, t);
          break;
        default:
          Ia(
            e,
            t,
            a,
            i,
            o
          );
      }
      (t.mode & Pe) !== Ne && ((e = !Fl && t.alternate === null && t.return !== null && t.return.alternate !== null) && (a = t.actualStartTime, 0 <= a && 0.05 < o - a && mn(
        t,
        a,
        o,
        "Mount"
      )), 0 <= ze && 0 <= Ue && ((gl || 0.05 < rl) && Bn(
        t,
        ze,
        Ue,
        rl,
        il
      ), e && 0.05 < Ue - ze && mn(
        t,
        ze,
        Ue,
        "Mount"
      ))), Nl(f), Qa(d), il = h, gl = y, Xf = p;
    }
    function lc(e, t, a, i, o, f) {
      for (o = o && ((t.subtreeFlags & 10256) !== 0 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child)), t = t.child; t !== null; ) {
        var d = t.sibling;
        ls(
          e,
          t,
          a,
          i,
          o,
          d !== null ? d.actualStartTime : f
        ), t = d;
      }
    }
    function ls(e, t, a, i, o, f) {
      var d = Wt(), h = gn(), y = Va(), p = vn(), R = Xf;
      o && (t.mode & Pe) !== Ne && 0 < t.actualStartTime && (t.flags & 1) !== 0 && yd(
        t,
        t.actualStartTime,
        f,
        Fl,
        a
      );
      var _ = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          lc(
            e,
            t,
            a,
            i,
            o,
            f
          ), Wr(t, fn);
          break;
        case 23:
          break;
        case 22:
          var E = t.stateNode;
          t.memoizedState !== null ? E._visibility & mo ? lc(
            e,
            t,
            a,
            i,
            o,
            f
          ) : Ic(
            e,
            t,
            a,
            i,
            f
          ) : (E._visibility |= mo, lc(
            e,
            t,
            a,
            i,
            o,
            f
          )), o && _ & 2048 && es(
            t.alternate,
            t
          );
          break;
        case 24:
          lc(
            e,
            t,
            a,
            i,
            o,
            f
          ), o && _ & 2048 && ts(t.alternate, t);
          break;
        default:
          lc(
            e,
            t,
            a,
            i,
            o,
            f
          );
      }
      (t.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && (gl || 0.05 < rl) && Bn(
        t,
        ze,
        Ue,
        rl,
        il
      ), Nl(d), Qa(h), il = y, gl = p, Xf = R;
    }
    function Ic(e, t, a, i, o) {
      if (t.subtreeFlags & 10256 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child))
        for (var f = t.child; f !== null; ) {
          t = f.sibling;
          var d = e, h = a, y = i, p = t !== null ? t.actualStartTime : o, R = Xf;
          (f.mode & Pe) !== Ne && 0 < f.actualStartTime && (f.flags & 1) !== 0 && yd(
            f,
            f.actualStartTime,
            p,
            Fl,
            h
          );
          var _ = f.flags;
          switch (f.tag) {
            case 22:
              Ic(
                d,
                f,
                h,
                y,
                p
              ), _ & 2048 && es(f.alternate, f);
              break;
            case 24:
              Ic(
                d,
                f,
                h,
                y,
                p
              ), _ & 2048 && ts(f.alternate, f);
              break;
            default:
              Ic(
                d,
                f,
                h,
                y,
                p
              );
          }
          Xf = R, f = t;
        }
    }
    function Pc(e, t, a) {
      if (e.subtreeFlags & Ip)
        for (e = e.child; e !== null; )
          th(
            e,
            t,
            a
          ), e = e.sibling;
    }
    function th(e, t, a) {
      switch (e.tag) {
        case 26:
          Pc(
            e,
            t,
            a
          ), e.flags & Ip && e.memoizedState !== null && lp(
            a,
            Ai,
            e.memoizedState,
            e.memoizedProps
          );
          break;
        case 5:
          Pc(
            e,
            t,
            a
          );
          break;
        case 3:
        case 4:
          var i = Ai;
          Ai = bh(
            e.stateNode.containerInfo
          ), Pc(
            e,
            t,
            a
          ), Ai = i;
          break;
        case 22:
          e.memoizedState === null && (i = e.alternate, i !== null && i.memoizedState !== null ? (i = Ip, Ip = 16777216, Pc(
            e,
            t,
            a
          ), Ip = i) : Pc(
            e,
            t,
            a
          ));
          break;
        default:
          Pc(
            e,
            t,
            a
          );
      }
    }
    function Ny(e) {
      var t = e.alternate;
      if (t !== null && (e = t.child, e !== null)) {
        t.child = null;
        do
          t = e.sibling, e.sibling = null, e = t;
        while (e !== null);
      }
    }
    function Pa(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null)
          for (var a = 0; a < t.length; a++) {
            var i = t[a], o = Wt();
            ca = i, Du(
              i,
              e
            ), (i.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && 0.05 < Ue - ze && mn(
              i,
              ze,
              Ue,
              "Unmount"
            ), Nl(o);
          }
        Ny(e);
      }
      if (e.subtreeFlags & 10256)
        for (e = e.child; e !== null; )
          lh(e), e = e.sibling;
    }
    function lh(e) {
      var t = Wt(), a = gn(), i = Va(), o = vn();
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          Pa(e), e.flags & 2048 && kd(
            e,
            e.return,
            fn | Ku
          );
          break;
        case 3:
          var f = yu();
          Pa(e), e.stateNode.passiveEffectDuration += Jo(f);
          break;
        case 12:
          f = yu(), Pa(e), e.stateNode.passiveEffectDuration += sa(f);
          break;
        case 22:
          f = e.stateNode, e.memoizedState !== null && f._visibility & mo && (e.return === null || e.return.tag !== 13) ? (f._visibility &= ~mo, ah(e), (e.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && 0.05 < Ue - ze && mn(
            e,
            ze,
            Ue,
            "Disconnect"
          )) : Pa(e);
          break;
        default:
          Pa(e);
      }
      (e.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && (gl || 0.05 < rl) && Bn(
        e,
        ze,
        Ue,
        rl,
        il
      ), Nl(t), Qa(a), gl = o, il = i;
    }
    function ah(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null)
          for (var a = 0; a < t.length; a++) {
            var i = t[a], o = Wt();
            ca = i, Du(
              i,
              e
            ), (i.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && 0.05 < Ue - ze && mn(
              i,
              ze,
              Ue,
              "Unmount"
            ), Nl(o);
          }
        Ny(e);
      }
      for (e = e.child; e !== null; )
        By(e), e = e.sibling;
    }
    function By(e) {
      var t = Wt(), a = gn(), i = Va(), o = vn();
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          kd(
            e,
            e.return,
            fn
          ), ah(e);
          break;
        case 22:
          var f = e.stateNode;
          f._visibility & mo && (f._visibility &= ~mo, ah(e));
          break;
        default:
          ah(e);
      }
      (e.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && (gl || 0.05 < rl) && Bn(
        e,
        ze,
        Ue,
        rl,
        il
      ), Nl(t), Qa(a), gl = o, il = i;
    }
    function Du(e, t) {
      for (; ca !== null; ) {
        var a = ca, i = a, o = t, f = Wt(), d = gn(), h = Va(), y = vn();
        switch (i.tag) {
          case 0:
          case 11:
          case 15:
            kd(
              i,
              o,
              fn
            );
            break;
          case 23:
          case 22:
            i.memoizedState !== null && i.memoizedState.cachePool !== null && (o = i.memoizedState.cachePool.pool, o != null && Bc(o));
            break;
          case 24:
            zr(i.memoizedState.cache);
        }
        if ((i.mode & Pe) !== Ne && 0 <= ze && 0 <= Ue && (gl || 0.05 < rl) && Bn(
          i,
          ze,
          Ue,
          rl,
          il
        ), Nl(f), Qa(d), gl = y, il = h, i = a.child, i !== null) i.return = a, ca = i;
        else
          e: for (a = e; ca !== null; ) {
            if (i = ca, f = i.sibling, d = i.return, yl(i), i === a) {
              ca = null;
              break e;
            }
            if (f !== null) {
              f.return = d, ca = f;
              break e;
            }
            ca = d;
          }
      }
    }
    function Yy() {
      iT.forEach(function(e) {
        return e();
      });
    }
    function jy() {
      var e = typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0;
      return e || L.actQueue === null || console.error(
        "The current testing environment is not configured to support act(...)"
      ), e;
    }
    function aa(e) {
      if ((mt & Il) !== oa && tt !== 0)
        return tt & -tt;
      var t = L.T;
      return t !== null ? (t._updatedFibers || (t._updatedFibers = /* @__PURE__ */ new Set()), t._updatedFibers.add(e), Jy()) : Mi();
    }
    function sf() {
      if (_n === 0)
        if ((tt & 536870912) === 0 || ft) {
          var e = Rs;
          Rs <<= 1, (Rs & 3932160) === 0 && (Rs = 262144), _n = e;
        } else _n = 536870912;
      return e = tu.current, e !== null && (e.flags |= 32), _n;
    }
    function Be(e, t, a) {
      if (hm && console.error("useInsertionEffect must not schedule updates."), uS && (zv = !0), (e === Vt && (Yt === Ls || Yt === Xs) || e.cancelPendingCommit !== null) && (_u(e, 0), Tn(
        e,
        tt,
        _n,
        !1
      )), Mn(e, a), (mt & Il) !== oa && e === Vt) {
        if (Yu)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              e = nt && re(nt) || "Unknown", i2.has(e) || (i2.add(e), t = re(t) || "Unknown", console.error(
                "Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://react.dev/link/setstate-in-render",
                t,
                e,
                e
              ));
              break;
            case 1:
              u2 || (console.error(
                "Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."
              ), u2 = !0);
          }
      } else
        qu && Al(e, t, a), is(t), e === Vt && ((mt & Il) === oa && (er |= a), sl === Ff && Tn(
          e,
          tt,
          _n,
          !1
        )), Ma(e);
    }
    function ag(e, t, a) {
      if ((mt & (Il | au)) !== oa)
        throw Error("Should not already be working.");
      if (tt !== 0 && nt !== null) {
        var i = nt, o = wl();
        switch (IS) {
          case t0:
          case Ls:
            var f = xp;
            el && ((i = i._debugTask) ? i.run(
              console.timeStamp.bind(
                console,
                "Suspended",
                f,
                o,
                wu,
                void 0,
                "primary-light"
              )
            ) : console.timeStamp(
              "Suspended",
              f,
              o,
              wu,
              void 0,
              "primary-light"
            ));
            break;
          case Xs:
            f = xp, el && ((i = i._debugTask) ? i.run(
              console.timeStamp.bind(
                console,
                "Action",
                f,
                o,
                wu,
                void 0,
                "primary-light"
              )
            ) : console.timeStamp(
              "Action",
              f,
              o,
              wu,
              void 0,
              "primary-light"
            ));
            break;
          default:
            el && (i = o - xp, 3 > i || console.timeStamp(
              "Blocked",
              xp,
              o,
              wu,
              void 0,
              5 > i ? "primary-light" : 10 > i ? "primary" : 100 > i ? "primary-dark" : "error"
            ));
        }
      }
      f = (a = !a && (t & 127) === 0 && (t & e.expiredLanes) === 0 || vl(e, t)) ? di(e, t) : mf(e, t, !0);
      var d = a;
      do {
        if (f === Ro) {
          sm && !a && Tn(e, t, 0, !1), t = Yt, xp = Ll(), IS = t;
          break;
        } else {
          if (i = wl(), o = e.current.alternate, d && !ug(o)) {
            Nn(t), o = ia, f = i, !el || f <= o || (Tl ? Tl.run(
              console.timeStamp.bind(
                console,
                "Teared Render",
                o,
                f,
                dt,
                rt,
                "error"
              )
            ) : console.timeStamp(
              "Teared Render",
              o,
              f,
              dt,
              rt,
              "error"
            )), ac(t, i), f = mf(e, t, !1), d = !1;
            continue;
          }
          if (f === Gs) {
            if (d = t, e.errorRecoveryDisabledLanes & d)
              var h = 0;
            else
              h = e.pendingLanes & -536870913, h = h !== 0 ? h : h & 536870912 ? 536870912 : 0;
            if (h !== 0) {
              Nn(t), qm(
                ia,
                i,
                t,
                Tl
              ), ac(t, i), t = h;
              e: {
                i = e, f = d, d = a0;
                var y = i.current.memoizedState.isDehydrated;
                if (y && (_u(i, h).flags |= 256), h = mf(
                  i,
                  h,
                  !1
                ), h !== Gs) {
                  if (F1 && !y) {
                    i.errorRecoveryDisabledLanes |= f, er |= f, f = Ff;
                    break e;
                  }
                  i = rn, rn = d, i !== null && (rn === null ? rn = i : rn.push.apply(
                    rn,
                    i
                  ));
                }
                f = h;
              }
              if (d = !1, f !== Gs) continue;
              i = wl();
            }
          }
          if (f === e0) {
            Nn(t), qm(
              ia,
              i,
              t,
              Tl
            ), ac(t, i), _u(e, 0), Tn(e, t, 0, !0);
            break;
          }
          e: {
            switch (a = e, f) {
              case Ro:
              case e0:
                throw Error("Root did not complete. This is a bug in React.");
              case Ff:
                if ((t & 4194048) !== t) break;
              case vv:
                Nn(t), N0(
                  ia,
                  i,
                  t,
                  Tl
                ), ac(t, i), o = t, (o & 127) !== 0 ? av = i : (o & 4194048) !== 0 && (nv = i), Tn(
                  a,
                  t,
                  _n,
                  !If
                );
                break e;
              case Gs:
                rn = null;
                break;
              case gv:
              case Jb:
                break;
              default:
                throw Error("Unknown root exit status.");
            }
            if (L.actQueue !== null)
              Lt(
                a,
                o,
                t,
                rn,
                n0,
                Ev,
                _n,
                er,
                Qs,
                f,
                null,
                null,
                ia,
                i
              );
            else {
              if ((t & 62914560) === t && (d = Tv + kb - wl(), 10 < d)) {
                if (Tn(
                  a,
                  t,
                  _n,
                  !If
                ), vc(a, 0, !0) !== 0) break e;
                Oi = t, a.timeoutHandle = m2(
                  ng.bind(
                    null,
                    a,
                    o,
                    rn,
                    n0,
                    Ev,
                    t,
                    _n,
                    er,
                    Qs,
                    If,
                    f,
                    "Throttled",
                    ia,
                    i
                  ),
                  d
                );
                break e;
              }
              ng(
                a,
                o,
                rn,
                n0,
                Ev,
                t,
                _n,
                er,
                Qs,
                If,
                f,
                null,
                ia,
                i
              );
            }
          }
        }
        break;
      } while (!0);
      Ma(e);
    }
    function ng(e, t, a, i, o, f, d, h, y, p, R, _, E, x) {
      e.timeoutHandle = $s;
      var ue = t.subtreeFlags, de = null;
      if ((ue & 8192 || (ue & 16785408) === 16785408) && (de = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: hn
      }, th(t, f, de), ue = (f & 62914560) === f ? Tv - wl() : (f & 4194048) === f ? $b - wl() : 0, ue = Ah(de, ue), ue !== null)) {
        Oi = f, e.cancelPendingCommit = ue(
          Lt.bind(
            null,
            e,
            t,
            f,
            a,
            i,
            o,
            d,
            h,
            y,
            R,
            de,
            de.waitingForViewTransition ? "Waiting for the previous Animation" : 0 < de.count ? 0 < de.imgCount ? "Suspended on CSS and Images" : "Suspended on CSS" : de.imgCount === 1 ? "Suspended on an Image" : 0 < de.imgCount ? "Suspended on Images" : null,
            E,
            x
          )
        ), Tn(
          e,
          f,
          d,
          !p
        );
        return;
      }
      Lt(
        e,
        t,
        f,
        a,
        i,
        o,
        d,
        h,
        y,
        R,
        de,
        _,
        E,
        x
      );
    }
    function ug(e) {
      for (var t = e; ; ) {
        var a = t.tag;
        if ((a === 0 || a === 11 || a === 15) && t.flags & 16384 && (a = t.updateQueue, a !== null && (a = a.stores, a !== null)))
          for (var i = 0; i < a.length; i++) {
            var o = a[i], f = o.getSnapshot;
            o = o.value;
            try {
              if (!un(f(), o)) return !1;
            } catch {
              return !1;
            }
          }
        if (a = t.child, t.subtreeFlags & 16384 && a !== null)
          a.return = t, t = a;
        else {
          if (t === e) break;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e) return !0;
            t = t.return;
          }
          t.sibling.return = t.return, t = t.sibling;
        }
      }
      return !0;
    }
    function Tn(e, t, a, i) {
      t &= ~I1, t &= ~er, e.suspendedLanes |= t, e.pingedLanes &= ~t, i && (e.warmLanes |= t), i = e.expirationTimes;
      for (var o = t; 0 < o; ) {
        var f = 31 - kl(o), d = 1 << f;
        i[f] = -1, o &= ~d;
      }
      a !== 0 && Uo(e, a, t);
    }
    function en() {
      return (mt & (Il | au)) === oa ? (Cu(0), !1) : !0;
    }
    function nh() {
      if (nt !== null) {
        if (Yt === Dn)
          var e = nt.return;
        else
          e = nt, Vo(), Xi(e), lm = null, Kp = 0, e = nt;
        for (; e !== null; )
          Ey(e.alternate, e), e = e.return;
        nt = null;
      }
    }
    function ac(e, t) {
      (e & 127) !== 0 && (Us = t), (e & 4194048) !== 0 && (So = t), (e & 62914560) !== 0 && (WS = t), (e & 2080374784) !== 0 && (FS = t);
    }
    function _u(e, t) {
      el && (console.timeStamp(
        "Blocking Track",
        3e-3,
        3e-3,
        "Blocking",
        rt,
        "primary-light"
      ), console.timeStamp(
        "Transition Track",
        3e-3,
        3e-3,
        "Transition",
        rt,
        "primary-light"
      ), console.timeStamp(
        "Suspense Track",
        3e-3,
        3e-3,
        "Suspense",
        rt,
        "primary-light"
      ), console.timeStamp(
        "Idle Track",
        3e-3,
        3e-3,
        "Idle",
        rt,
        "primary-light"
      ));
      var a = ia;
      if (ia = Ll(), tt !== 0 && 0 < a) {
        if (Nn(tt), sl === gv || sl === Ff)
          N0(
            a,
            ia,
            t,
            Tl
          );
        else {
          var i = ia, o = Tl;
          if (el && !(i <= a)) {
            var f = (t & 738197653) === t ? "tertiary-dark" : "primary-dark", d = (t & 536870912) === t ? "Prewarm" : (t & 201326741) === t ? "Interrupted Hydration" : "Interrupted Render";
            o ? o.run(
              console.timeStamp.bind(
                console,
                d,
                a,
                i,
                dt,
                rt,
                f
              )
            ) : console.timeStamp(
              d,
              a,
              i,
              dt,
              rt,
              f
            );
          }
        }
        ac(tt, ia);
      }
      if (a = Tl, Tl = null, (t & 127) !== 0) {
        Tl = Yp, o = 0 <= mc && mc < Us ? Us : mc, i = 0 <= Hs && Hs < Us ? Us : Hs, f = 0 <= i ? i : 0 <= o ? o : ia, 0 <= av ? (Nn(2), B0(
          av,
          f,
          t,
          a
        )) : uv & 127, a = o;
        var h = i, y = jp, p = 0 < Ph, R = Kf === Bp, _ = Kf === lv;
        if (o = ia, i = Yp, f = C1, d = U1, el) {
          if (dt = "Blocking", 0 < a ? a > o && (a = o) : a = o, 0 < h ? h > a && (h = a) : h = a, y !== null && a > h) {
            var E = p ? "secondary-light" : "warning";
            i ? i.run(
              console.timeStamp.bind(
                console,
                p ? "Consecutive" : "Event: " + y,
                h,
                a,
                dt,
                rt,
                E
              )
            ) : console.timeStamp(
              p ? "Consecutive" : "Event: " + y,
              h,
              a,
              dt,
              rt,
              E
            );
          }
          o > a && (h = R ? "error" : (t & 738197653) === t ? "tertiary-light" : "primary-light", R = _ ? "Promise Resolved" : R ? "Cascading Update" : 5 < o - a ? "Update Blocked" : "Update", _ = [], d != null && _.push(["Component name", d]), f != null && _.push(["Method name", f]), a = {
            start: a,
            end: o,
            detail: {
              devtools: {
                properties: _,
                track: dt,
                trackGroup: rt,
                color: h
              }
            }
          }, i ? i.run(
            performance.measure.bind(
              performance,
              R,
              a
            )
          ) : performance.measure(R, a));
        }
        mc = -1.1, Kf = 0, U1 = C1 = null, av = -1.1, Ph = Hs, Hs = -1.1, Us = Ll();
      }
      if ((t & 4194048) !== 0 && (Tl = qp, o = 0 <= bo && bo < So ? So : bo, a = 0 <= Zu && Zu < So ? So : Zu, i = 0 <= $f && $f < So ? So : $f, f = 0 <= i ? i : 0 <= a ? a : ia, 0 <= nv ? (Nn(256), B0(
        nv,
        f,
        t,
        Tl
      )) : uv & 4194048, _ = i, h = Ns, y = 0 < kf, p = H1 === lv, f = ia, i = qp, d = $S, R = kS, el && (dt = "Transition", 0 < a ? a > f && (a = f) : a = f, 0 < o ? o > a && (o = a) : o = a, 0 < _ ? _ > o && (_ = o) : _ = o, o > _ && h !== null && (E = y ? "secondary-light" : "warning", i ? i.run(
        console.timeStamp.bind(
          console,
          y ? "Consecutive" : "Event: " + h,
          _,
          o,
          dt,
          rt,
          E
        )
      ) : console.timeStamp(
        y ? "Consecutive" : "Event: " + h,
        _,
        o,
        dt,
        rt,
        E
      )), a > o && (i ? i.run(
        console.timeStamp.bind(
          console,
          "Action",
          o,
          a,
          dt,
          rt,
          "primary-dark"
        )
      ) : console.timeStamp(
        "Action",
        o,
        a,
        dt,
        rt,
        "primary-dark"
      )), f > a && (o = p ? "Promise Resolved" : 5 < f - a ? "Update Blocked" : "Update", _ = [], R != null && _.push(["Component name", R]), d != null && _.push(["Method name", d]), a = {
        start: a,
        end: f,
        detail: {
          devtools: {
            properties: _,
            track: dt,
            trackGroup: rt,
            color: "primary-light"
          }
        }
      }, i ? i.run(
        performance.measure.bind(
          performance,
          o,
          a
        )
      ) : performance.measure(o, a))), Zu = bo = -1.1, H1 = 0, nv = -1.1, kf = $f, $f = -1.1, So = Ll()), (t & 62914560) !== 0 && (uv & 62914560) !== 0 && (Nn(4194304), xm(WS, ia)), (t & 2080374784) !== 0 && (uv & 2080374784) !== 0 && (Nn(268435456), xm(FS, ia)), a = e.timeoutHandle, a !== $s && (e.timeoutHandle = $s, ST(a)), a = e.cancelPendingCommit, a !== null && (e.cancelPendingCommit = null, a()), Oi = 0, nh(), Vt = e, nt = a = hu(
        e.current,
        null
      ), tt = t, Yt = Dn, nu = null, If = !1, sm = vl(e, t), F1 = !1, sl = Ro, Qs = _n = I1 = er = Pf = 0, rn = a0 = null, Ev = !1, (t & 8) !== 0 && (t |= t & 32), i = e.entangledLanes, i !== 0)
        for (e = e.entanglements, i &= t; 0 < i; )
          o = 31 - kl(i), f = 1 << o, t |= e[o], i &= ~f;
      return pc = t, pd(), e = XS(), 1e3 < e - LS && (L.recentlyCreatedOwnerStacks = 0, LS = e), Ei.discardPendingWarnings(), a;
    }
    function Zn(e, t) {
      qe = null, L.H = Fp, L.getCurrentStack = null, Yu = !1, Na = null, t === tm || t === fv ? (t = qc(), Yt = t0) : t === j1 ? (t = qc(), Yt = Kb) : Yt = t === J1 ? W1 : t !== null && typeof t == "object" && typeof t.then == "function" ? l0 : Sv, nu = t;
      var a = nt;
      a === null ? (sl = e0, Zr(
        e,
        ra(t, e.current)
      )) : a.mode & Pe && Ad(a);
    }
    function qy() {
      var e = tu.current;
      return e === null ? !0 : (tt & 4194048) === tt ? Ju === null : (tt & 62914560) === tt || (tt & 536870912) !== 0 ? e === Ju : !1;
    }
    function uh() {
      var e = L.H;
      return L.H = Fp, e === null ? Fp : e;
    }
    function xy() {
      var e = L.A;
      return L.A = uT, e;
    }
    function df(e) {
      Tl === null && (Tl = e._debugTask == null ? null : e._debugTask);
    }
    function hf() {
      sl = Ff, If || (tt & 4194048) !== tt && tu.current !== null || (sm = !0), (Pf & 134217727) === 0 && (er & 134217727) === 0 || Vt === null || Tn(
        Vt,
        tt,
        _n,
        !1
      );
    }
    function mf(e, t, a) {
      var i = mt;
      mt |= Il;
      var o = uh(), f = xy();
      if (Vt !== e || tt !== t) {
        if (qu) {
          var d = e.memoizedUpdaters;
          0 < d.size && (pf(e, tt), d.clear()), wa(e, t);
        }
        n0 = null, _u(e, t);
      }
      t = !1, d = sl;
      e: do
        try {
          if (Yt !== Dn && nt !== null) {
            var h = nt, y = nu;
            switch (Yt) {
              case W1:
                nh(), d = vv;
                break e;
              case t0:
              case Ls:
              case Xs:
              case l0:
                tu.current === null && (t = !0);
                var p = Yt;
                if (Yt = Dn, nu = null, yf(e, h, y, p), a && sm) {
                  d = Ro;
                  break e;
                }
                break;
              default:
                p = Yt, Yt = Dn, nu = null, yf(e, h, y, p);
            }
          }
          wy(), d = sl;
          break;
        } catch (R) {
          Zn(e, R);
        }
      while (!0);
      return t && e.shellSuspendCounter++, Vo(), mt = i, L.H = o, L.A = f, nt === null && (Vt = null, tt = 0, pd()), d;
    }
    function wy() {
      for (; nt !== null; ) ih(nt);
    }
    function di(e, t) {
      var a = mt;
      mt |= Il;
      var i = uh(), o = xy();
      if (Vt !== e || tt !== t) {
        if (qu) {
          var f = e.memoizedUpdaters;
          0 < f.size && (pf(e, tt), f.clear()), wa(e, t);
        }
        n0 = null, Av = wl() + Wb, _u(e, t);
      } else
        sm = vl(
          e,
          t
        );
      e: do
        try {
          if (Yt !== Dn && nt !== null)
            t: switch (t = nt, f = nu, Yt) {
              case Sv:
                Yt = Dn, nu = null, yf(
                  e,
                  t,
                  f,
                  Sv
                );
                break;
              case Ls:
              case Xs:
                if (Wm(f)) {
                  Yt = Dn, nu = null, Gy(t);
                  break;
                }
                t = function() {
                  Yt !== Ls && Yt !== Xs || Vt !== e || (Yt = bv), Ma(e);
                }, f.then(t, t);
                break e;
              case t0:
                Yt = bv;
                break e;
              case Kb:
                Yt = k1;
                break e;
              case bv:
                Wm(f) ? (Yt = Dn, nu = null, Gy(t)) : (Yt = Dn, nu = null, yf(
                  e,
                  t,
                  f,
                  bv
                ));
                break;
              case k1:
                var d = null;
                switch (nt.tag) {
                  case 26:
                    d = nt.memoizedState;
                  case 5:
                  case 27:
                    var h = nt;
                    if (d ? ut(d) : h.stateNode.complete) {
                      Yt = Dn, nu = null;
                      var y = h.sibling;
                      if (y !== null) nt = y;
                      else {
                        var p = h.return;
                        p !== null ? (nt = p, as(p)) : nt = null;
                      }
                      break t;
                    }
                    break;
                  default:
                    console.error(
                      "Unexpected type of fiber triggered a suspensey commit. This is a bug in React."
                    );
                }
                Yt = Dn, nu = null, yf(
                  e,
                  t,
                  f,
                  k1
                );
                break;
              case l0:
                Yt = Dn, nu = null, yf(
                  e,
                  t,
                  f,
                  l0
                );
                break;
              case W1:
                nh(), sl = vv;
                break e;
              default:
                throw Error(
                  "Unexpected SuspendedReason. This is a bug in React."
                );
            }
          L.actQueue !== null ? wy() : bl();
          break;
        } catch (R) {
          Zn(e, R);
        }
      while (!0);
      return Vo(), L.H = i, L.A = o, mt = a, nt !== null ? Ro : (Vt = null, tt = 0, pd(), sl);
    }
    function bl() {
      for (; nt !== null && !Bh(); )
        ih(nt);
    }
    function ih(e) {
      var t = e.alternate;
      (e.mode & Pe) !== Ne ? (ti(e), t = se(
        e,
        kr,
        t,
        e,
        pc
      ), Ad(e)) : t = se(
        e,
        kr,
        t,
        e,
        pc
      ), e.memoizedProps = e.pendingProps, t === null ? as(e) : nt = t;
    }
    function Gy(e) {
      var t = se(e, xl, e);
      e.memoizedProps = e.pendingProps, t === null ? as(e) : nt = t;
    }
    function xl(e) {
      var t = e.alternate, a = (e.mode & Pe) !== Ne;
      switch (a && ti(e), e.tag) {
        case 15:
        case 0:
          t = yy(
            t,
            e,
            e.pendingProps,
            e.type,
            void 0,
            tt
          );
          break;
        case 11:
          t = yy(
            t,
            e,
            e.pendingProps,
            e.type.render,
            e.ref,
            tt
          );
          break;
        case 5:
          Xi(e);
        default:
          Ey(t, e), e = nt = Xm(e, pc), t = kr(t, e, pc);
      }
      return a && Ad(e), t;
    }
    function yf(e, t, a, i) {
      Vo(), Xi(t), lm = null, Kp = 0;
      var o = t.return;
      try {
        if (oy(
          e,
          o,
          t,
          a,
          tt
        )) {
          sl = e0, Zr(
            e,
            ra(a, e.current)
          ), nt = null;
          return;
        }
      } catch (f) {
        if (o !== null) throw nt = o, f;
        sl = e0, Zr(
          e,
          ra(a, e.current)
        ), nt = null;
        return;
      }
      t.flags & 32768 ? (ft || i === Sv ? e = !0 : sm || (tt & 536870912) !== 0 ? e = !1 : (If = e = !0, (i === Ls || i === Xs || i === t0 || i === l0) && (i = tu.current, i !== null && i.tag === 13 && (i.flags |= 16384))), Ly(t, e)) : as(t);
    }
    function as(e) {
      var t = e;
      do {
        if ((t.flags & 32768) !== 0) {
          Ly(
            t,
            If
          );
          return;
        }
        var a = t.alternate;
        if (e = t.return, ti(t), a = se(
          t,
          by,
          a,
          t,
          pc
        ), (t.mode & Pe) !== Ne && Dr(t), a !== null) {
          nt = a;
          return;
        }
        if (t = t.sibling, t !== null) {
          nt = t;
          return;
        }
        nt = t = e;
      } while (t !== null);
      sl === Ro && (sl = Jb);
    }
    function Ly(e, t) {
      do {
        var a = W0(e.alternate, e);
        if (a !== null) {
          a.flags &= 32767, nt = a;
          return;
        }
        if ((e.mode & Pe) !== Ne) {
          Dr(e), a = e.actualDuration;
          for (var i = e.child; i !== null; )
            a += i.actualDuration, i = i.sibling;
          e.actualDuration = a;
        }
        if (a = e.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !t && (e = e.sibling, e !== null)) {
          nt = e;
          return;
        }
        nt = e = a;
      } while (e !== null);
      sl = vv, nt = null;
    }
    function Lt(e, t, a, i, o, f, d, h, y, p, R, _, E, x) {
      e.cancelPendingCommit = null;
      do
        ns();
      while (Jl !== lr);
      if (Ei.flushLegacyContextWarning(), Ei.flushPendingUnsafeLifecycleWarnings(), (mt & (Il | au)) !== oa)
        throw Error("Should not already be working.");
      if (Nn(a), p === Gs ? qm(
        E,
        x,
        a,
        Tl
      ) : i !== null ? Pv(
        E,
        x,
        a,
        i,
        t !== null && t.alternate !== null && t.alternate.memoizedState.isDehydrated && (t.flags & 256) !== 0,
        Tl
      ) : Iv(
        E,
        x,
        a,
        Tl
      ), t !== null) {
        if (a === 0 && console.error(
          "finishedLanes should not be empty during a commit. This is a bug in React."
        ), t === e.current)
          throw Error(
            "Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue."
          );
        if (f = t.lanes | t.childLanes, f |= R1, Is(
          e,
          a,
          f,
          d,
          h,
          y
        ), e === Vt && (nt = Vt = null, tt = 0), dm = t, ar = e, Oi = a, tS = f, aS = o, l2 = i, lS = x, a2 = _, Ri = Ov, n2 = null, t.actualDuration !== 0 || (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, gf(fo, function() {
          return r0 = window.event, Ri === Ov && (Ri = eS), us(), null;
        })) : (e.callbackNode = null, e.callbackPriority = 0), vo = null, Jf = Ll(), _ !== null && e1(
          x,
          Jf,
          _,
          Tl
        ), i = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || i) {
          i = L.T, L.T = null, o = At.p, At.p = _l, d = mt, mt |= au;
          try {
            a1(e, t, a);
          } finally {
            mt = d, At.p = o, L.T = i;
          }
        }
        Jl = Ib, Sa(), Mu(), Xy();
      }
    }
    function Sa() {
      if (Jl === Ib) {
        Jl = lr;
        var e = ar, t = dm, a = Oi, i = (t.flags & 13878) !== 0;
        if ((t.subtreeFlags & 13878) !== 0 || i) {
          i = L.T, L.T = null;
          var o = At.p;
          At.p = _l;
          var f = mt;
          mt |= au;
          try {
            fm = a, rm = e, Yc(), Pr(t, e), rm = fm = null, a = mS;
            var d = hd(e.containerInfo), h = a.focusedElem, y = a.selectionRange;
            if (d !== h && h && h.ownerDocument && M0(
              h.ownerDocument.documentElement,
              h
            )) {
              if (y !== null && Bm(h)) {
                var p = y.start, R = y.end;
                if (R === void 0 && (R = p), "selectionStart" in h)
                  h.selectionStart = p, h.selectionEnd = Math.min(
                    R,
                    h.value.length
                  );
                else {
                  var _ = h.ownerDocument || document, E = _ && _.defaultView || window;
                  if (E.getSelection) {
                    var x = E.getSelection(), ue = h.textContent.length, de = Math.min(
                      y.start,
                      ue
                    ), $t = y.end === void 0 ? de : Math.min(y.end, ue);
                    !x.extend && de > $t && (d = $t, $t = de, de = d);
                    var st = _0(
                      h,
                      de
                    ), b = _0(
                      h,
                      $t
                    );
                    if (st && b && (x.rangeCount !== 1 || x.anchorNode !== st.node || x.anchorOffset !== st.offset || x.focusNode !== b.node || x.focusOffset !== b.offset)) {
                      var T = _.createRange();
                      T.setStart(st.node, st.offset), x.removeAllRanges(), de > $t ? (x.addRange(T), x.extend(b.node, b.offset)) : (T.setEnd(b.node, b.offset), x.addRange(T));
                    }
                  }
                }
              }
              for (_ = [], x = h; x = x.parentNode; )
                x.nodeType === 1 && _.push({
                  element: x,
                  left: x.scrollLeft,
                  top: x.scrollTop
                });
              for (typeof h.focus == "function" && h.focus(), h = 0; h < _.length; h++) {
                var O = _[h];
                O.element.scrollLeft = O.left, O.element.scrollTop = O.top;
              }
            }
            Gv = !!hS, mS = hS = null;
          } finally {
            mt = f, At.p = o, L.T = i;
          }
        }
        e.current = t, Jl = Pb;
      }
    }
    function Mu() {
      if (Jl === Pb) {
        Jl = lr;
        var e = n2;
        if (e !== null) {
          Jf = Ll();
          var t = go, a = Jf;
          !el || a <= t || console.timeStamp(
            e,
            t,
            a,
            dt,
            rt,
            "secondary-light"
          );
        }
        e = ar, t = dm, a = Oi;
        var i = (t.flags & 8772) !== 0;
        if ((t.subtreeFlags & 8772) !== 0 || i) {
          i = L.T, L.T = null;
          var o = At.p;
          At.p = _l;
          var f = mt;
          mt |= au;
          try {
            fm = a, rm = e, Yc(), Pd(
              e,
              t.alternate,
              t
            ), rm = fm = null;
          } finally {
            mt = f, At.p = o, L.T = i;
          }
        }
        e = lS, t = a2, go = Ll(), e = t === null ? e : Jf, t = go, a = Ri === P1, i = Tl, vo !== null ? Y0(
          e,
          t,
          vo,
          !1,
          i
        ) : !el || t <= e || (i ? i.run(
          console.timeStamp.bind(
            console,
            a ? "Commit Interrupted View Transition" : "Commit",
            e,
            t,
            dt,
            rt,
            a ? "error" : "secondary-dark"
          )
        ) : console.timeStamp(
          a ? "Commit Interrupted View Transition" : "Commit",
          e,
          t,
          dt,
          rt,
          a ? "error" : "secondary-dark"
        )), Jl = e2;
      }
    }
    function Xy() {
      if (Jl === t2 || Jl === e2) {
        if (Jl === t2) {
          var e = go;
          go = Ll();
          var t = go, a = Ri === P1;
          !el || t <= e || console.timeStamp(
            a ? "Interrupted View Transition" : "Starting Animation",
            e,
            t,
            dt,
            rt,
            a ? " error" : "secondary-light"
          ), Ri !== P1 && (Ri = Fb);
        }
        Jl = lr, Yh(), e = ar;
        var i = dm;
        t = Oi, a = l2;
        var o = i.actualDuration !== 0 || (i.subtreeFlags & 10256) !== 0 || (i.flags & 10256) !== 0;
        o ? Jl = Rv : (Jl = lr, dm = ar = null, Qy(
          e,
          e.pendingLanes
        ), Vs = 0, i0 = null);
        var f = e.pendingLanes;
        if (f === 0 && (tr = null), o || fh(e), f = Ul(t), i = i.stateNode, Dl && typeof Dl.onCommitFiberRoot == "function")
          try {
            var d = (i.current.flags & 128) === 128;
            switch (f) {
              case _l:
                var h = Sp;
                break;
              case Wl:
                h = jh;
                break;
              case ua:
                h = fo;
                break;
              case sc:
                h = qh;
                break;
              default:
                h = fo;
            }
            Dl.onCommitFiberRoot(
              ro,
              i,
              h,
              d
            );
          } catch (_) {
            ju || (ju = !0, console.error(
              "React instrumentation encountered an error: %o",
              _
            ));
          }
        if (qu && e.memoizedUpdaters.clear(), Yy(), a !== null) {
          d = L.T, h = At.p, At.p = _l, L.T = null;
          try {
            var y = e.onRecoverableError;
            for (i = 0; i < a.length; i++) {
              var p = a[i], R = ig(p.stack);
              se(
                p.source,
                y,
                p.value,
                R
              );
            }
          } finally {
            L.T = d, At.p = h;
          }
        }
        (Oi & 3) !== 0 && ns(), Ma(e), f = e.pendingLanes, (t & 261930) !== 0 && (f & 42) !== 0 ? (cv = !0, e === nS ? u0++ : (u0 = 0, nS = e)) : u0 = 0, o || ac(t, go), Cu(0);
      }
    }
    function ig(e) {
      return e = { componentStack: e }, Object.defineProperty(e, "digest", {
        get: function() {
          console.error(
            'You are accessing "digest" from the errorInfo object passed to onRecoverableError. This property is no longer provided as part of errorInfo but can be accessed as a property of the Error instance itself.'
          );
        }
      }), e;
    }
    function Qy(e, t) {
      (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, zr(t)));
    }
    function ns() {
      return Sa(), Mu(), Xy(), us();
    }
    function us() {
      if (Jl !== Rv) return !1;
      var e = ar, t = tS;
      tS = 0;
      var a = Ul(Oi), i = ua > a ? ua : a;
      a = L.T;
      var o = At.p;
      try {
        At.p = i, L.T = null;
        var f = aS;
        aS = null, i = ar;
        var d = Oi;
        if (Jl = lr, dm = ar = null, Oi = 0, (mt & (Il | au)) !== oa)
          throw Error("Cannot flush passive effects while already rendering.");
        Nn(d), uS = !0, zv = !1;
        var h = 0;
        if (vo = null, h = wl(), Ri === Fb)
          xm(
            go,
            h,
            IE
          );
        else {
          var y = go, p = h, R = Ri === eS;
          !el || p <= y || (Tl ? Tl.run(
            console.timeStamp.bind(
              console,
              R ? "Waiting for Paint" : "Waiting",
              y,
              p,
              dt,
              rt,
              "secondary-light"
            )
          ) : console.timeStamp(
            R ? "Waiting for Paint" : "Waiting",
            y,
            p,
            dt,
            rt,
            "secondary-light"
          ));
        }
        y = mt, mt |= au;
        var _ = i.current;
        Yc(), lh(_);
        var E = i.current;
        _ = lS, Yc(), Hy(
          i,
          E,
          d,
          f,
          _
        ), fh(i), mt = y;
        var x = wl();
        if (E = h, _ = Tl, vo !== null ? Y0(
          E,
          x,
          vo,
          !0,
          _
        ) : !el || x <= E || (_ ? _.run(
          console.timeStamp.bind(
            console,
            "Remaining Effects",
            E,
            x,
            dt,
            rt,
            "secondary-dark"
          )
        ) : console.timeStamp(
          "Remaining Effects",
          E,
          x,
          dt,
          rt,
          "secondary-dark"
        )), ac(d, x), Cu(0, !1), zv ? i === i0 ? Vs++ : (Vs = 0, i0 = i) : Vs = 0, zv = uS = !1, Dl && typeof Dl.onPostCommitFiberRoot == "function")
          try {
            Dl.onPostCommitFiberRoot(ro, i);
          } catch (de) {
            ju || (ju = !0, console.error(
              "React instrumentation encountered an error: %o",
              de
            ));
          }
        var ue = i.current.stateNode;
        return ue.effectDuration = 0, ue.passiveEffectDuration = 0, !0;
      } finally {
        At.p = o, L.T = a, Qy(e, t);
      }
    }
    function ba(e, t, a) {
      t = ra(a, t), L0(t), t = wd(e.stateNode, t, 2), e = gu(e, t, 2), e !== null && (Mn(e, 2), Ma(e));
    }
    function $e(e, t, a) {
      if (hm = !1, e.tag === 3)
        ba(e, e, a);
      else {
        for (; t !== null; ) {
          if (t.tag === 3) {
            ba(
              t,
              e,
              a
            );
            return;
          }
          if (t.tag === 1) {
            var i = t.stateNode;
            if (typeof t.type.getDerivedStateFromError == "function" || typeof i.componentDidCatch == "function" && (tr === null || !tr.has(i))) {
              e = ra(a, e), L0(e), a = Gd(2), i = gu(t, a, 2), i !== null && (Ld(
                a,
                i,
                t,
                e
              ), Mn(i, 2), Ma(i));
              return;
            }
          }
          t = t.return;
        }
        console.error(
          `Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Potential causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`,
          a
        );
      }
    }
    function ch(e, t, a) {
      var i = e.pingCache;
      if (i === null) {
        i = e.pingCache = new cT();
        var o = /* @__PURE__ */ new Set();
        i.set(t, o);
      } else
        o = i.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), i.set(t, o));
      o.has(a) || (F1 = !0, o.add(a), i = _a.bind(null, e, t, a), qu && pf(e, a), t.then(i, i));
    }
    function _a(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t), e.pingedLanes |= e.suspendedLanes & a, e.warmLanes &= ~a, (a & 127) !== 0 ? 0 > mc && (Us = mc = Ll(), Yp = tv("Promise Resolved"), Kf = lv) : (a & 4194048) !== 0 && 0 > Zu && (So = Zu = Ll(), qp = tv("Promise Resolved"), H1 = lv), jy() && L.actQueue === null && console.error(
        `A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act`
      ), Vt === e && (tt & a) === a && (sl === Ff || sl === gv && (tt & 62914560) === tt && wl() - Tv < kb ? (mt & Il) === oa && _u(e, 0) : I1 |= a, Qs === tt && (Qs = 0)), Ma(e);
    }
    function Vy(e, t) {
      t === 0 && (t = Mo()), e = ta(e, t), e !== null && (Mn(e, t), Ma(e));
    }
    function hi(e) {
      var t = e.memoizedState, a = 0;
      t !== null && (a = t.retryLane), Vy(e, a);
    }
    function eo(e, t) {
      var a = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var i = e.stateNode, o = e.memoizedState;
          o !== null && (a = o.retryLane);
          break;
        case 19:
          i = e.stateNode;
          break;
        case 22:
          i = e.stateNode._retryCache;
          break;
        default:
          throw Error(
            "Pinged unknown suspense boundary type. This is probably a bug in React."
          );
      }
      i !== null && i.delete(t), Vy(e, a);
    }
    function Jn(e, t, a) {
      if ((t.subtreeFlags & 67117056) !== 0)
        for (t = t.child; t !== null; ) {
          var i = e, o = t, f = o.type === Aa;
          f = a || f, o.tag !== 22 ? o.flags & 67108864 ? f && se(
            o,
            oh,
            i,
            o
          ) : Jn(
            i,
            o,
            f
          ) : o.memoizedState === null && (f && o.flags & 8192 ? se(
            o,
            oh,
            i,
            o
          ) : o.subtreeFlags & 67108864 && se(
            o,
            Jn,
            i,
            o,
            f
          )), t = t.sibling;
        }
    }
    function oh(e, t) {
      me(!0);
      try {
        eh(t), By(t), Uy(e, t.alternate, t, !1), ls(e, t, 0, null, !1, 0);
      } finally {
        me(!1);
      }
    }
    function fh(e) {
      var t = !0;
      e.current.mode & (Ba | bi) || (t = !1), Jn(
        e,
        e.current,
        t
      );
    }
    function An(e) {
      if ((mt & Il) === oa) {
        var t = e.tag;
        if (t === 3 || t === 1 || t === 0 || t === 11 || t === 14 || t === 15) {
          if (t = re(e) || "ReactComponent", Dv !== null) {
            if (Dv.has(t)) return;
            Dv.add(t);
          } else Dv = /* @__PURE__ */ new Set([t]);
          se(e, function() {
            console.error(
              "Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously tries to update the component. Move this work to useEffect instead."
            );
          });
        }
      }
    }
    function pf(e, t) {
      qu && e.memoizedUpdaters.forEach(function(a) {
        Al(e, a, t);
      });
    }
    function gf(e, t) {
      var a = L.actQueue;
      return a !== null ? (a.push(t), rT) : vp(e, t);
    }
    function is(e) {
      jy() && L.actQueue === null && se(e, function() {
        console.error(
          `An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act`,
          re(e)
        );
      });
    }
    function Ma(e) {
      e !== mm && e.next === null && (mm === null ? _v = mm = e : mm = mm.next = e), Mv = !0, L.actQueue !== null ? cS || (cS = !0, og()) : iS || (iS = !0, og());
    }
    function Cu(e, t) {
      if (!oS && Mv) {
        oS = !0;
        do
          for (var a = !1, i = _v; i !== null; ) {
            if (e !== 0) {
              var o = i.pendingLanes;
              if (o === 0) var f = 0;
              else {
                var d = i.suspendedLanes, h = i.pingedLanes;
                f = (1 << 31 - kl(42 | e) + 1) - 1, f &= o & ~(d & ~h), f = f & 201326741 ? f & 201326741 | 1 : f ? f | 2 : 0;
              }
              f !== 0 && (a = !0, cs(i, f));
            } else
              f = tt, f = vc(
                i,
                i === Vt ? f : 0,
                i.cancelPendingCommit !== null || i.timeoutHandle !== $s
              ), (f & 3) === 0 || vl(i, f) || (a = !0, cs(i, f));
            i = i.next;
          }
        while (a);
        oS = !1;
      }
    }
    function cg() {
      r0 = window.event, rh();
    }
    function rh() {
      Mv = cS = iS = !1;
      var e = 0;
      nr !== 0 && $y() && (e = nr);
      for (var t = wl(), a = null, i = _v; i !== null; ) {
        var o = i.next, f = vf(i, t);
        f === 0 ? (i.next = null, a === null ? _v = o : a.next = o, o === null && (mm = a)) : (a = i, (e !== 0 || (f & 3) !== 0) && (Mv = !0)), i = o;
      }
      Jl !== lr && Jl !== Rv || Cu(e), nr !== 0 && (nr = 0);
    }
    function vf(e, t) {
      for (var a = e.suspendedLanes, i = e.pingedLanes, o = e.expirationTimes, f = e.pendingLanes & -62914561; 0 < f; ) {
        var d = 31 - kl(f), h = 1 << d, y = o[d];
        y === -1 ? ((h & a) === 0 || (h & i) !== 0) && (o[d] = Fs(h, t)) : y <= t && (e.expiredLanes |= h), f &= ~h;
      }
      if (t = Vt, a = tt, a = vc(
        e,
        e === t ? a : 0,
        e.cancelPendingCommit !== null || e.timeoutHandle !== $s
      ), i = e.callbackNode, a === 0 || e === t && (Yt === Ls || Yt === Xs) || e.cancelPendingCommit !== null)
        return i !== null && sh(i), e.callbackNode = null, e.callbackPriority = 0;
      if ((a & 3) === 0 || vl(e, a)) {
        if (t = a & -a, t !== e.callbackPriority || L.actQueue !== null && i !== fS)
          sh(i);
        else return t;
        switch (Ul(a)) {
          case _l:
          case Wl:
            a = jh;
            break;
          case ua:
            a = fo;
            break;
          case sc:
            a = qh;
            break;
          default:
            a = fo;
        }
        return i = Zy.bind(null, e), L.actQueue !== null ? (L.actQueue.push(i), a = fS) : a = vp(a, i), e.callbackPriority = t, e.callbackNode = a, t;
      }
      return i !== null && sh(i), e.callbackPriority = 2, e.callbackNode = null, 2;
    }
    function Zy(e, t) {
      if (cv = iv = !1, r0 = window.event, Jl !== lr && Jl !== Rv)
        return e.callbackNode = null, e.callbackPriority = 0, null;
      var a = e.callbackNode;
      if (Ri === Ov && (Ri = eS), ns() && e.callbackNode !== a)
        return null;
      var i = tt;
      return i = vc(
        e,
        e === Vt ? i : 0,
        e.cancelPendingCommit !== null || e.timeoutHandle !== $s
      ), i === 0 ? null : (ag(
        e,
        i,
        t
      ), vf(e, wl()), e.callbackNode != null && e.callbackNode === a ? Zy.bind(null, e) : null);
    }
    function cs(e, t) {
      if (ns()) return null;
      iv = cv, cv = !1, ag(e, t, !0);
    }
    function sh(e) {
      e !== fS && e !== null && Nh(e);
    }
    function og() {
      L.actQueue !== null && L.actQueue.push(function() {
        return rh(), null;
      }), bT(function() {
        (mt & (Il | au)) !== oa ? vp(
          Sp,
          cg
        ) : rh();
      });
    }
    function Jy() {
      if (nr === 0) {
        var e = Bs;
        e === 0 && (e = jf, jf <<= 1, (jf & 261888) === 0 && (jf = 256)), nr = e;
      }
      return nr;
    }
    function vt(e) {
      return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : (gt(e, "action"), pr("" + e));
    }
    function Ht(e, t) {
      var a = t.ownerDocument.createElement("input");
      return a.name = t.name, a.value = t.value, e.id && a.setAttribute("form", e.id), t.parentNode.insertBefore(a, t), e = new FormData(e), a.parentNode.removeChild(a), e;
    }
    function ot(e, t, a, i, o) {
      if (t === "submit" && a && a.stateNode === o) {
        var f = vt(
          (o[Oa] || null).action
        ), d = i.submitter;
        d && (t = (t = d[Oa] || null) ? vt(t.formAction) : d.getAttribute("formAction"), t !== null && (f = t, d = null));
        var h = new $g(
          "action",
          "action",
          null,
          i,
          o
        );
        e.push({
          event: h,
          listeners: [
            {
              instance: null,
              listener: function() {
                if (i.defaultPrevented) {
                  if (nr !== 0) {
                    var y = d ? Ht(
                      o,
                      d
                    ) : new FormData(o), p = {
                      pending: !0,
                      data: y,
                      method: o.method,
                      action: f
                    };
                    Object.freeze(p), fi(
                      a,
                      p,
                      null,
                      y
                    );
                  }
                } else
                  typeof f == "function" && (h.preventDefault(), y = d ? Ht(
                    o,
                    d
                  ) : new FormData(o), p = {
                    pending: !0,
                    data: y,
                    method: o.method,
                    action: f
                  }, Object.freeze(p), fi(
                    a,
                    p,
                    f,
                    y
                  ));
              },
              currentTarget: o
            }
          ]
        });
      }
    }
    function at(e, t, a) {
      e.currentTarget = a;
      try {
        t(e);
      } catch (i) {
        E1(i);
      }
      e.currentTarget = null;
    }
    function Dt(e, t) {
      t = (t & 4) !== 0;
      for (var a = 0; a < e.length; a++) {
        var i = e[a];
        e: {
          var o = void 0, f = i.event;
          if (i = i.listeners, t)
            for (var d = i.length - 1; 0 <= d; d--) {
              var h = i[d], y = h.instance, p = h.currentTarget;
              if (h = h.listener, y !== o && f.isPropagationStopped())
                break e;
              y !== null ? se(
                y,
                at,
                f,
                h,
                p
              ) : at(f, h, p), o = y;
            }
          else
            for (d = 0; d < i.length; d++) {
              if (h = i[d], y = h.instance, p = h.currentTarget, h = h.listener, y !== o && f.isPropagationStopped())
                break e;
              y !== null ? se(
                y,
                at,
                f,
                h,
                p
              ) : at(f, h, p), o = y;
            }
        }
      }
    }
    function He(e, t) {
      rS.has(e) || console.error(
        'Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.',
        e
      );
      var a = t[so];
      a === void 0 && (a = t[so] = /* @__PURE__ */ new Set());
      var i = e + "__bubble";
      a.has(i) || (dh(t, e, 2, !1), a.add(i));
    }
    function Uu(e, t, a) {
      rS.has(e) && !t && console.error(
        'Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.',
        e
      );
      var i = 0;
      t && (i |= 4), dh(
        a,
        e,
        i,
        t
      );
    }
    function nc(e) {
      if (!e[Cv]) {
        e[Cv] = !0, Qg.forEach(function(a) {
          a !== "selectionchange" && (rS.has(a) || Uu(a, !1, e), Uu(a, !0, e));
        });
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[Cv] || (t[Cv] = !0, Uu("selectionchange", !1, t));
      }
    }
    function dh(e, t, a, i) {
      switch (zh(t)) {
        case _l:
          var o = cp;
          break;
        case Wl:
          o = $l;
          break;
        default:
          o = op;
      }
      a = o.bind(
        null,
        t,
        a,
        e
      ), o = void 0, !s1 || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (o = !0), i ? o !== void 0 ? e.addEventListener(t, a, {
        capture: !0,
        passive: o
      }) : e.addEventListener(t, a, !0) : o !== void 0 ? e.addEventListener(t, a, {
        passive: o
      }) : e.addEventListener(
        t,
        a,
        !1
      );
    }
    function Kn(e, t, a, i, o) {
      var f = i;
      if ((t & 1) === 0 && (t & 2) === 0 && i !== null)
        e: for (; ; ) {
          if (i === null) return;
          var d = i.tag;
          if (d === 3 || d === 4) {
            var h = i.stateNode.containerInfo;
            if (h === o) break;
            if (d === 4)
              for (d = i.return; d !== null; ) {
                var y = d.tag;
                if ((y === 3 || y === 4) && d.stateNode.containerInfo === o)
                  return;
                d = d.return;
              }
            for (; h !== null; ) {
              if (d = ee(h), d === null) return;
              if (y = d.tag, y === 5 || y === 6 || y === 26 || y === 27) {
                i = f = d;
                continue e;
              }
              h = h.parentNode;
            }
          }
          i = i.return;
        }
      fd(function() {
        var p = f, R = Un(a), _ = [];
        e: {
          var E = GS.get(e);
          if (E !== void 0) {
            var x = $g, ue = e;
            switch (e) {
              case "keypress":
                if (gr(a) === 0) break e;
              case "keydown":
              case "keyup":
                x = RE;
                break;
              case "focusin":
                ue = "focus", x = y1;
                break;
              case "focusout":
                ue = "blur", x = y1;
                break;
              case "beforeblur":
              case "afterblur":
                x = y1;
                break;
              case "click":
                if (a.button === 2) break e;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                x = zS;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                x = hE;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                x = _E;
                break;
              case jS:
              case qS:
              case xS:
                x = pE;
                break;
              case wS:
                x = CE;
                break;
              case "scroll":
              case "scrollend":
                x = sE;
                break;
              case "wheel":
                x = HE;
                break;
              case "copy":
              case "cut":
              case "paste":
                x = vE;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                x = _S;
                break;
              case "toggle":
              case "beforetoggle":
                x = BE;
            }
            var de = (t & 4) !== 0, $t = !de && (e === "scroll" || e === "scrollend"), st = de ? E !== null ? E + "Capture" : null : E;
            de = [];
            for (var b = p, T; b !== null; ) {
              var O = b;
              if (T = O.stateNode, O = O.tag, O !== 5 && O !== 26 && O !== 27 || T === null || st === null || (O = su(b, st), O != null && de.push(
                Xt(
                  b,
                  O,
                  T
                )
              )), $t) break;
              b = b.return;
            }
            0 < de.length && (E = new x(
              E,
              ue,
              null,
              a,
              R
            ), _.push({
              event: E,
              listeners: de
            }));
          }
        }
        if ((t & 7) === 0) {
          e: {
            if (E = e === "mouseover" || e === "pointerover", x = e === "mouseout" || e === "pointerout", E && a !== Op && (ue = a.relatedTarget || a.fromElement) && (ee(ue) || ue[Si]))
              break e;
            if ((x || E) && (E = R.window === R ? R : (E = R.ownerDocument) ? E.defaultView || E.parentWindow : window, x ? (ue = a.relatedTarget || a.toElement, x = p, ue = ue ? ee(ue) : null, ue !== null && ($t = Fe(ue), de = ue.tag, ue !== $t || de !== 5 && de !== 27 && de !== 6) && (ue = null)) : (x = null, ue = p), x !== ue)) {
              if (de = zS, O = "onMouseLeave", st = "onMouseEnter", b = "mouse", (e === "pointerout" || e === "pointerover") && (de = _S, O = "onPointerLeave", st = "onPointerEnter", b = "pointer"), $t = x == null ? E : ye(x), T = ue == null ? E : ye(ue), E = new de(
                O,
                b + "leave",
                x,
                a,
                R
              ), E.target = $t, E.relatedTarget = T, O = null, ee(R) === p && (de = new de(
                st,
                b + "enter",
                ue,
                a,
                R
              ), de.target = T, de.relatedTarget = $t, O = de), $t = O, x && ue)
                t: {
                  for (de = to, st = x, b = ue, T = 0, O = st; O; O = de(O))
                    T++;
                  O = 0;
                  for (var J = b; J; J = de(J))
                    O++;
                  for (; 0 < T - O; )
                    st = de(st), T--;
                  for (; 0 < O - T; )
                    b = de(b), O--;
                  for (; T--; ) {
                    if (st === b || b !== null && st === b.alternate) {
                      de = st;
                      break t;
                    }
                    st = de(st), b = de(b);
                  }
                  de = null;
                }
              else de = null;
              x !== null && hh(
                _,
                E,
                x,
                de,
                !1
              ), ue !== null && $t !== null && hh(
                _,
                $t,
                ue,
                de,
                !0
              );
            }
          }
          e: {
            if (E = p ? ye(p) : window, x = E.nodeName && E.nodeName.toLowerCase(), x === "select" || x === "input" && E.type === "file")
              var oe = Bi;
            else if (Um(E))
              if (BS)
                oe = Er;
              else {
                oe = Hm;
                var xe = Fv;
              }
            else
              x = E.nodeName, !x || x.toLowerCase() !== "input" || E.type !== "checkbox" && E.type !== "radio" ? p && ru(p.elementType) && (oe = Bi) : oe = Nm;
            if (oe && (oe = oe(e, p))) {
              Sr(
                _,
                oe,
                a,
                R
              );
              break e;
            }
            xe && xe(e, E, p), e === "focusout" && p && E.type === "number" && p.memoizedProps.value != null && Tm(E, "number", E.value);
          }
          switch (xe = p ? ye(p) : window, e) {
            case "focusin":
              (Um(xe) || xe.contentEditable === "true") && (Zh = xe, g1 = p, Up = null);
              break;
            case "focusout":
              Up = g1 = Zh = null;
              break;
            case "mousedown":
              v1 = !0;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              v1 = !1, C0(
                _,
                a,
                R
              );
              break;
            case "selectionchange":
              if (xE) break;
            case "keydown":
            case "keyup":
              C0(
                _,
                a,
                R
              );
          }
          var Oe;
          if (p1)
            e: {
              switch (e) {
                case "compositionstart":
                  var be = "onCompositionStart";
                  break e;
                case "compositionend":
                  be = "onCompositionEnd";
                  break e;
                case "compositionupdate":
                  be = "onCompositionUpdate";
                  break e;
              }
              be = void 0;
            }
          else
            Vh ? wo(e, a) && (be = "onCompositionEnd") : e === "keydown" && a.keyCode === MS && (be = "onCompositionStart");
          be && (CS && a.locale !== "ko" && (Vh || be !== "onCompositionStart" ? be === "onCompositionEnd" && Vh && (Oe = Rc()) : (Lf = R, d1 = "value" in Lf ? Lf.value : Lf.textContent, Vh = !0)), xe = $n(
            p,
            be
          ), 0 < xe.length && (be = new DS(
            be,
            e,
            null,
            a,
            R
          ), _.push({
            event: be,
            listeners: xe
          }), Oe ? be.data = Oe : (Oe = Pu(a), Oe !== null && (be.data = Oe)))), (Oe = jE ? Cm(e, a) : rd(e, a)) && (be = $n(
            p,
            "onBeforeInput"
          ), 0 < be.length && (xe = new bE(
            "onBeforeInput",
            "beforeinput",
            null,
            a,
            R
          ), _.push({
            event: xe,
            listeners: be
          }), xe.data = Oe)), ot(
            _,
            e,
            p,
            a,
            R
          );
        }
        Dt(_, t);
      });
    }
    function Xt(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function $n(e, t) {
      for (var a = t + "Capture", i = []; e !== null; ) {
        var o = e, f = o.stateNode;
        if (o = o.tag, o !== 5 && o !== 26 && o !== 27 || f === null || (o = su(e, a), o != null && i.unshift(
          Xt(e, o, f)
        ), o = su(e, t), o != null && i.push(
          Xt(e, o, f)
        )), e.tag === 3) return i;
        e = e.return;
      }
      return [];
    }
    function to(e) {
      if (e === null) return null;
      do
        e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function hh(e, t, a, i, o) {
      for (var f = t._reactName, d = []; a !== null && a !== i; ) {
        var h = a, y = h.alternate, p = h.stateNode;
        if (h = h.tag, y !== null && y === i) break;
        h !== 5 && h !== 26 && h !== 27 || p === null || (y = p, o ? (p = su(a, f), p != null && d.unshift(
          Xt(a, p, y)
        )) : o || (p = su(a, f), p != null && d.push(
          Xt(a, p, y)
        ))), a = a.return;
      }
      d.length !== 0 && e.push({ event: t, listeners: d });
    }
    function Ea(e, t) {
      R0(e, t), e !== "input" && e !== "textarea" && e !== "select" || t == null || t.value !== null || OS || (OS = !0, e === "select" && t.multiple ? console.error(
        "`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.",
        e
      ) : console.error(
        "`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.",
        e
      ));
      var a = {
        registrationNameDependencies: xu,
        possibleRegistrationNames: wf
      };
      ru(e) || typeof t.is == "string" || Wv(e, t, a), t.contentEditable && !t.suppressContentEditableWarning && t.children != null && console.error(
        "A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."
      );
    }
    function nl(e, t, a, i) {
      t !== a && (a = kn(a), kn(t) !== a && (i[e] = t));
    }
    function os(e, t, a) {
      t.forEach(function(i) {
        a[mi(i)] = i === "style" ? uc(e) : e.getAttribute(i);
      });
    }
    function ul(e, t) {
      t === !1 ? console.error(
        "Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.",
        e,
        e,
        e
      ) : console.error(
        "Expected `%s` listener to be a function, instead got a value of `%s` type.",
        e,
        typeof t
      );
    }
    function mh(e, t) {
      return e = e.namespaceURI === Ve || e.namespaceURI === ke ? e.ownerDocument.createElementNS(
        e.namespaceURI,
        e.tagName
      ) : e.ownerDocument.createElement(e.tagName), e.innerHTML = t, e.innerHTML;
    }
    function kn(e) {
      return xa(e) && (console.error(
        "The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before using it here.",
        Di(e)
      ), uu(e)), (typeof e == "string" ? e : "" + e).replace(sT, `
`).replace(dT, "");
    }
    function Ky(e, t) {
      return t = kn(t), kn(e) === t;
    }
    function Tt(e, t, a, i, o, f) {
      switch (a) {
        case "children":
          typeof i == "string" ? (yr(i, t, !1), t === "body" || t === "textarea" && i === "" || Oc(e, i)) : (typeof i == "number" || typeof i == "bigint") && (yr("" + i, t, !1), t !== "body" && Oc(e, "" + i));
          break;
        case "className":
          dr(e, "class", i);
          break;
        case "tabIndex":
          dr(e, "tabindex", i);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          dr(e, a, i);
          break;
        case "style":
          Dm(e, i, f);
          break;
        case "data":
          if (t !== "object") {
            dr(e, "data", i);
            break;
          }
        case "src":
        case "href":
          if (i === "" && (t !== "a" || a !== "href")) {
            console.error(
              a === "src" ? 'An empty string ("") was passed to the %s attribute. This may cause the browser to download the whole page again over the network. To fix this, either do not render the element at all or pass null to %s instead of an empty string.' : 'An empty string ("") was passed to the %s attribute. To fix this, either do not render the element at all or pass null to %s instead of an empty string.',
              a,
              a
            ), e.removeAttribute(a);
            break;
          }
          if (i == null || typeof i == "function" || typeof i == "symbol" || typeof i == "boolean") {
            e.removeAttribute(a);
            break;
          }
          gt(i, a), i = pr("" + i), e.setAttribute(a, i);
          break;
        case "action":
        case "formAction":
          if (i != null && (t === "form" ? a === "formAction" ? console.error(
            "You can only pass the formAction prop to <input> or <button>. Use the action prop on <form>."
          ) : typeof i == "function" && (o.encType == null && o.method == null || Nv || (Nv = !0, console.error(
            "Cannot specify a encType or method for a form that specifies a function as the action. React provides those automatically. They will get overridden."
          )), o.target == null || Hv || (Hv = !0, console.error(
            "Cannot specify a target for a form that specifies a function as the action. The function will always be executed in the same window."
          ))) : t === "input" || t === "button" ? a === "action" ? console.error(
            "You can only pass the action prop to <form>. Use the formAction prop on <input> or <button>."
          ) : t !== "input" || o.type === "submit" || o.type === "image" || Uv ? t !== "button" || o.type == null || o.type === "submit" || Uv ? typeof i == "function" && (o.name == null || f2 || (f2 = !0, console.error(
            'Cannot specify a "name" prop for a button that specifies a function as a formAction. React needs it to encode which action should be invoked. It will get overridden.'
          )), o.formEncType == null && o.formMethod == null || Nv || (Nv = !0, console.error(
            "Cannot specify a formEncType or formMethod for a button that specifies a function as a formAction. React provides those automatically. They will get overridden."
          )), o.formTarget == null || Hv || (Hv = !0, console.error(
            "Cannot specify a formTarget for a button that specifies a function as a formAction. The function will always be executed in the same window."
          ))) : (Uv = !0, console.error(
            'A button can only specify a formAction along with type="submit" or no type.'
          )) : (Uv = !0, console.error(
            'An input can only specify a formAction along with type="submit" or type="image".'
          )) : console.error(
            a === "action" ? "You can only pass the action prop to <form>." : "You can only pass the formAction prop to <input> or <button>."
          )), typeof i == "function") {
            e.setAttribute(
              a,
              "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
            );
            break;
          } else
            typeof f == "function" && (a === "formAction" ? (t !== "input" && Tt(e, t, "name", o.name, o, null), Tt(
              e,
              t,
              "formEncType",
              o.formEncType,
              o,
              null
            ), Tt(
              e,
              t,
              "formMethod",
              o.formMethod,
              o,
              null
            ), Tt(
              e,
              t,
              "formTarget",
              o.formTarget,
              o,
              null
            )) : (Tt(
              e,
              t,
              "encType",
              o.encType,
              o,
              null
            ), Tt(e, t, "method", o.method, o, null), Tt(
              e,
              t,
              "target",
              o.target,
              o,
              null
            )));
          if (i == null || typeof i == "symbol" || typeof i == "boolean") {
            e.removeAttribute(a);
            break;
          }
          gt(i, a), i = pr("" + i), e.setAttribute(a, i);
          break;
        case "onClick":
          i != null && (typeof i != "function" && ul(a, i), e.onclick = hn);
          break;
        case "onScroll":
          i != null && (typeof i != "function" && ul(a, i), He("scroll", e));
          break;
        case "onScrollEnd":
          i != null && (typeof i != "function" && ul(a, i), He("scrollend", e));
          break;
        case "dangerouslySetInnerHTML":
          if (i != null) {
            if (typeof i != "object" || !("__html" in i))
              throw Error(
                "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
              );
            if (a = i.__html, a != null) {
              if (o.children != null)
                throw Error(
                  "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
                );
              e.innerHTML = a;
            }
          }
          break;
        case "multiple":
          e.multiple = i && typeof i != "function" && typeof i != "symbol";
          break;
        case "muted":
          e.muted = i && typeof i != "function" && typeof i != "symbol";
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
          if (i == null || typeof i == "function" || typeof i == "boolean" || typeof i == "symbol") {
            e.removeAttribute("xlink:href");
            break;
          }
          gt(i, a), a = pr("" + i), e.setAttributeNS(Zs, "xlink:href", a);
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          i != null && typeof i != "function" && typeof i != "symbol" ? (gt(i, a), e.setAttribute(a, "" + i)) : e.removeAttribute(a);
          break;
        case "inert":
          i !== "" || Bv[a] || (Bv[a] = !0, console.error(
            "Received an empty string for a boolean attribute `%s`. This will treat the attribute as if it were false. Either pass `false` to silence this warning, or pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true.",
            a
          ));
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
          i && typeof i != "function" && typeof i != "symbol" ? e.setAttribute(a, "") : e.removeAttribute(a);
          break;
        case "capture":
        case "download":
          i === !0 ? e.setAttribute(a, "") : i !== !1 && i != null && typeof i != "function" && typeof i != "symbol" ? (gt(i, a), e.setAttribute(a, i)) : e.removeAttribute(a);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          i != null && typeof i != "function" && typeof i != "symbol" && !isNaN(i) && 1 <= i ? (gt(i, a), e.setAttribute(a, i)) : e.removeAttribute(a);
          break;
        case "rowSpan":
        case "start":
          i == null || typeof i == "function" || typeof i == "symbol" || isNaN(i) ? e.removeAttribute(a) : (gt(i, a), e.setAttribute(a, i));
          break;
        case "popover":
          He("beforetoggle", e), He("toggle", e), Ho(e, "popover", i);
          break;
        case "xlinkActuate":
          cu(
            e,
            Zs,
            "xlink:actuate",
            i
          );
          break;
        case "xlinkArcrole":
          cu(
            e,
            Zs,
            "xlink:arcrole",
            i
          );
          break;
        case "xlinkRole":
          cu(
            e,
            Zs,
            "xlink:role",
            i
          );
          break;
        case "xlinkShow":
          cu(
            e,
            Zs,
            "xlink:show",
            i
          );
          break;
        case "xlinkTitle":
          cu(
            e,
            Zs,
            "xlink:title",
            i
          );
          break;
        case "xlinkType":
          cu(
            e,
            Zs,
            "xlink:type",
            i
          );
          break;
        case "xmlBase":
          cu(
            e,
            sS,
            "xml:base",
            i
          );
          break;
        case "xmlLang":
          cu(
            e,
            sS,
            "xml:lang",
            i
          );
          break;
        case "xmlSpace":
          cu(
            e,
            sS,
            "xml:space",
            i
          );
          break;
        case "is":
          f != null && console.error(
            'Cannot update the "is" prop after it has been initialized.'
          ), Ho(e, "is", i);
          break;
        case "innerText":
        case "textContent":
          break;
        case "popoverTarget":
          r2 || i == null || typeof i != "object" || (r2 = !0, console.error(
            "The `popoverTarget` prop expects the ID of an Element as a string. Received %s instead.",
            i
          ));
        default:
          !(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N" ? (a = A0(a), Ho(e, a, i)) : xu.hasOwnProperty(a) && i != null && typeof i != "function" && ul(a, i);
      }
    }
    function Sf(e, t, a, i, o, f) {
      switch (a) {
        case "style":
          Dm(e, i, f);
          break;
        case "dangerouslySetInnerHTML":
          if (i != null) {
            if (typeof i != "object" || !("__html" in i))
              throw Error(
                "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
              );
            if (a = i.__html, a != null) {
              if (o.children != null)
                throw Error(
                  "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
                );
              e.innerHTML = a;
            }
          }
          break;
        case "children":
          typeof i == "string" ? Oc(e, i) : (typeof i == "number" || typeof i == "bigint") && Oc(e, "" + i);
          break;
        case "onScroll":
          i != null && (typeof i != "function" && ul(a, i), He("scroll", e));
          break;
        case "onScrollEnd":
          i != null && (typeof i != "function" && ul(a, i), He("scrollend", e));
          break;
        case "onClick":
          i != null && (typeof i != "function" && ul(a, i), e.onclick = hn);
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
          if (xu.hasOwnProperty(a))
            i != null && typeof i != "function" && ul(a, i);
          else
            e: {
              if (a[0] === "o" && a[1] === "n" && (o = a.endsWith("Capture"), t = a.slice(2, o ? a.length - 7 : void 0), f = e[Oa] || null, f = f != null ? f[a] : null, typeof f == "function" && e.removeEventListener(t, f, o), typeof i == "function")) {
                typeof f != "function" && f !== null && (a in e ? e[a] = null : e.hasAttribute(a) && e.removeAttribute(a)), e.addEventListener(t, i, o);
                break e;
              }
              a in e ? e[a] = i : i === !0 ? e.setAttribute(a, "") : Ho(e, a, i);
            }
      }
    }
    function It(e, t, a) {
      switch (Ea(t, a), t) {
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
          He("error", e), He("load", e);
          var i = !1, o = !1, f;
          for (f in a)
            if (a.hasOwnProperty(f)) {
              var d = a[f];
              if (d != null)
                switch (f) {
                  case "src":
                    i = !0;
                    break;
                  case "srcSet":
                    o = !0;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  default:
                    Tt(e, t, f, d, a, null);
                }
            }
          o && Tt(e, t, "srcSet", a.srcSet, a, null), i && Tt(e, t, "src", a.src, a, null);
          return;
        case "input":
          ea("input", a), He("invalid", e);
          var h = f = d = o = null, y = null, p = null;
          for (i in a)
            if (a.hasOwnProperty(i)) {
              var R = a[i];
              if (R != null)
                switch (i) {
                  case "name":
                    o = R;
                    break;
                  case "type":
                    d = R;
                    break;
                  case "checked":
                    y = R;
                    break;
                  case "defaultChecked":
                    p = R;
                    break;
                  case "value":
                    f = R;
                    break;
                  case "defaultValue":
                    h = R;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    if (R != null)
                      throw Error(
                        t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                      );
                    break;
                  default:
                    Tt(e, t, i, R, a, null);
                }
            }
          fa(e, a), td(
            e,
            f,
            h,
            y,
            p,
            d,
            o,
            !1
          );
          return;
        case "select":
          ea("select", a), He("invalid", e), i = d = f = null;
          for (o in a)
            if (a.hasOwnProperty(o) && (h = a[o], h != null))
              switch (o) {
                case "value":
                  f = h;
                  break;
                case "defaultValue":
                  d = h;
                  break;
                case "multiple":
                  i = h;
                default:
                  Tt(
                    e,
                    t,
                    o,
                    h,
                    a,
                    null
                  );
              }
          ld(e, a), t = f, a = d, e.multiple = !!i, t != null ? ou(e, !!i, t, !1) : a != null && ou(e, !!i, a, !0);
          return;
        case "textarea":
          ea("textarea", a), He("invalid", e), f = o = i = null;
          for (d in a)
            if (a.hasOwnProperty(d) && (h = a[d], h != null))
              switch (d) {
                case "value":
                  i = h;
                  break;
                case "defaultValue":
                  o = h;
                  break;
                case "children":
                  f = h;
                  break;
                case "dangerouslySetInnerHTML":
                  if (h != null)
                    throw Error(
                      "`dangerouslySetInnerHTML` does not make sense on <textarea>."
                    );
                  break;
                default:
                  Tt(
                    e,
                    t,
                    d,
                    h,
                    a,
                    null
                  );
              }
          bc(e, a), No(e, i, o, f);
          return;
        case "option":
          T0(e, a);
          for (y in a)
            if (a.hasOwnProperty(y) && (i = a[y], i != null))
              switch (y) {
                case "selected":
                  e.selected = i && typeof i != "function" && typeof i != "symbol";
                  break;
                default:
                  Tt(e, t, y, i, a, null);
              }
          return;
        case "dialog":
          He("beforetoggle", e), He("toggle", e), He("cancel", e), He("close", e);
          break;
        case "iframe":
        case "object":
          He("load", e);
          break;
        case "video":
        case "audio":
          for (i = 0; i < c0.length; i++)
            He(c0[i], e);
          break;
        case "image":
          He("error", e), He("load", e);
          break;
        case "details":
          He("toggle", e);
          break;
        case "embed":
        case "source":
        case "link":
          He("error", e), He("load", e);
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
          for (p in a)
            if (a.hasOwnProperty(p) && (i = a[p], i != null))
              switch (p) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(
                    t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                  );
                default:
                  Tt(e, t, p, i, a, null);
              }
          return;
        default:
          if (ru(t)) {
            for (R in a)
              a.hasOwnProperty(R) && (i = a[R], i !== void 0 && Sf(
                e,
                t,
                R,
                i,
                a,
                void 0
              ));
            return;
          }
      }
      for (h in a)
        a.hasOwnProperty(h) && (i = a[h], i != null && Tt(e, t, h, i, a, null));
    }
    function zl(e, t, a, i) {
      switch (Ea(t, i), t) {
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
          var o = null, f = null, d = null, h = null, y = null, p = null, R = null;
          for (x in a) {
            var _ = a[x];
            if (a.hasOwnProperty(x) && _ != null)
              switch (x) {
                case "checked":
                  break;
                case "value":
                  break;
                case "defaultValue":
                  y = _;
                default:
                  i.hasOwnProperty(x) || Tt(
                    e,
                    t,
                    x,
                    null,
                    i,
                    _
                  );
              }
          }
          for (var E in i) {
            var x = i[E];
            if (_ = a[E], i.hasOwnProperty(E) && (x != null || _ != null))
              switch (E) {
                case "type":
                  f = x;
                  break;
                case "name":
                  o = x;
                  break;
                case "checked":
                  p = x;
                  break;
                case "defaultChecked":
                  R = x;
                  break;
                case "value":
                  d = x;
                  break;
                case "defaultValue":
                  h = x;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (x != null)
                    throw Error(
                      t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  break;
                default:
                  x !== _ && Tt(
                    e,
                    t,
                    E,
                    x,
                    i,
                    _
                  );
              }
          }
          t = a.type === "checkbox" || a.type === "radio" ? a.checked != null : a.value != null, i = i.type === "checkbox" || i.type === "radio" ? i.checked != null : i.value != null, t || !i || o2 || (console.error(
            "A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"
          ), o2 = !0), !t || i || c2 || (console.error(
            "A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"
          ), c2 = !0), Ui(
            e,
            d,
            h,
            y,
            p,
            R,
            f,
            o
          );
          return;
        case "select":
          x = d = h = E = null;
          for (f in a)
            if (y = a[f], a.hasOwnProperty(f) && y != null)
              switch (f) {
                case "value":
                  break;
                case "multiple":
                  x = y;
                default:
                  i.hasOwnProperty(f) || Tt(
                    e,
                    t,
                    f,
                    null,
                    i,
                    y
                  );
              }
          for (o in i)
            if (f = i[o], y = a[o], i.hasOwnProperty(o) && (f != null || y != null))
              switch (o) {
                case "value":
                  E = f;
                  break;
                case "defaultValue":
                  h = f;
                  break;
                case "multiple":
                  d = f;
                default:
                  f !== y && Tt(
                    e,
                    t,
                    o,
                    f,
                    i,
                    y
                  );
              }
          i = h, t = d, a = x, E != null ? ou(e, !!t, E, !1) : !!a != !!t && (i != null ? ou(e, !!t, i, !0) : ou(e, !!t, t ? [] : "", !1));
          return;
        case "textarea":
          x = E = null;
          for (h in a)
            if (o = a[h], a.hasOwnProperty(h) && o != null && !i.hasOwnProperty(h))
              switch (h) {
                case "value":
                  break;
                case "children":
                  break;
                default:
                  Tt(e, t, h, null, i, o);
              }
          for (d in i)
            if (o = i[d], f = a[d], i.hasOwnProperty(d) && (o != null || f != null))
              switch (d) {
                case "value":
                  E = o;
                  break;
                case "defaultValue":
                  x = o;
                  break;
                case "children":
                  break;
                case "dangerouslySetInnerHTML":
                  if (o != null)
                    throw Error(
                      "`dangerouslySetInnerHTML` does not make sense on <textarea>."
                    );
                  break;
                default:
                  o !== f && Tt(e, t, d, o, i, f);
              }
          Ec(e, E, x);
          return;
        case "option":
          for (var ue in a)
            if (E = a[ue], a.hasOwnProperty(ue) && E != null && !i.hasOwnProperty(ue))
              switch (ue) {
                case "selected":
                  e.selected = !1;
                  break;
                default:
                  Tt(
                    e,
                    t,
                    ue,
                    null,
                    i,
                    E
                  );
              }
          for (y in i)
            if (E = i[y], x = a[y], i.hasOwnProperty(y) && E !== x && (E != null || x != null))
              switch (y) {
                case "selected":
                  e.selected = E && typeof E != "function" && typeof E != "symbol";
                  break;
                default:
                  Tt(
                    e,
                    t,
                    y,
                    E,
                    i,
                    x
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
          for (var de in a)
            E = a[de], a.hasOwnProperty(de) && E != null && !i.hasOwnProperty(de) && Tt(
              e,
              t,
              de,
              null,
              i,
              E
            );
          for (p in i)
            if (E = i[p], x = a[p], i.hasOwnProperty(p) && E !== x && (E != null || x != null))
              switch (p) {
                case "children":
                case "dangerouslySetInnerHTML":
                  if (E != null)
                    throw Error(
                      t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  break;
                default:
                  Tt(
                    e,
                    t,
                    p,
                    E,
                    i,
                    x
                  );
              }
          return;
        default:
          if (ru(t)) {
            for (var $t in a)
              E = a[$t], a.hasOwnProperty($t) && E !== void 0 && !i.hasOwnProperty($t) && Sf(
                e,
                t,
                $t,
                void 0,
                i,
                E
              );
            for (R in i)
              E = i[R], x = a[R], !i.hasOwnProperty(R) || E === x || E === void 0 && x === void 0 || Sf(
                e,
                t,
                R,
                E,
                i,
                x
              );
            return;
          }
      }
      for (var st in a)
        E = a[st], a.hasOwnProperty(st) && E != null && !i.hasOwnProperty(st) && Tt(e, t, st, null, i, E);
      for (_ in i)
        E = i[_], x = a[_], !i.hasOwnProperty(_) || E === x || E == null && x == null || Tt(e, t, _, E, i, x);
    }
    function mi(e) {
      switch (e) {
        case "class":
          return "className";
        case "for":
          return "htmlFor";
        default:
          return e;
      }
    }
    function uc(e) {
      var t = {};
      e = e.style;
      for (var a = 0; a < e.length; a++) {
        var i = e[a];
        t[i] = e.getPropertyValue(i);
      }
      return t;
    }
    function Hu(e, t, a) {
      if (t != null && typeof t != "object")
        console.error(
          "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX."
        );
      else {
        var i, o = i = "", f;
        for (f in t)
          if (t.hasOwnProperty(f)) {
            var d = t[f];
            d != null && typeof d != "boolean" && d !== "" && (f.indexOf("--") === 0 ? (Pl(d, f), i += o + f + ":" + ("" + d).trim()) : typeof d != "number" || d === 0 || ge.has(f) ? (Pl(d, f), i += o + f.replace(X, "-$1").toLowerCase().replace(he, "-ms-") + ":" + ("" + d).trim()) : i += o + f.replace(X, "-$1").toLowerCase().replace(he, "-ms-") + ":" + d + "px", o = ";");
          }
        i = i || null, t = e.getAttribute("style"), t !== i && (i = kn(i), kn(t) !== i && (a.style = uc(e)));
      }
    }
    function Ca(e, t, a, i, o, f) {
      if (o.delete(a), e = e.getAttribute(a), e === null)
        switch (typeof i) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            return;
        }
      else if (i != null)
        switch (typeof i) {
          case "function":
          case "symbol":
          case "boolean":
            break;
          default:
            if (gt(i, t), e === "" + i)
              return;
        }
      nl(t, e, i, f);
    }
    function yh(e, t, a, i, o, f) {
      if (o.delete(a), e = e.getAttribute(a), e === null) {
        switch (typeof i) {
          case "function":
          case "symbol":
            return;
        }
        if (!i) return;
      } else
        switch (typeof i) {
          case "function":
          case "symbol":
            break;
          default:
            if (i) return;
        }
      nl(t, e, i, f);
    }
    function ph(e, t, a, i, o, f) {
      if (o.delete(a), e = e.getAttribute(a), e === null)
        switch (typeof i) {
          case "undefined":
          case "function":
          case "symbol":
            return;
        }
      else if (i != null)
        switch (typeof i) {
          case "function":
          case "symbol":
            break;
          default:
            if (gt(i, a), e === "" + i)
              return;
        }
      nl(t, e, i, f);
    }
    function bf(e, t, a, i, o, f) {
      if (o.delete(a), e = e.getAttribute(a), e === null)
        switch (typeof i) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            return;
          default:
            if (isNaN(i)) return;
        }
      else if (i != null)
        switch (typeof i) {
          case "function":
          case "symbol":
          case "boolean":
            break;
          default:
            if (!isNaN(i) && (gt(i, t), e === "" + i))
              return;
        }
      nl(t, e, i, f);
    }
    function fs(e, t, a, i, o, f) {
      if (o.delete(a), e = e.getAttribute(a), e === null)
        switch (typeof i) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            return;
        }
      else if (i != null)
        switch (typeof i) {
          case "function":
          case "symbol":
          case "boolean":
            break;
          default:
            if (gt(i, t), a = pr("" + i), e === a)
              return;
        }
      nl(t, e, i, f);
    }
    function Ua(e, t, a, i) {
      for (var o = {}, f = /* @__PURE__ */ new Set(), d = e.attributes, h = 0; h < d.length; h++)
        switch (d[h].name.toLowerCase()) {
          case "value":
            break;
          case "checked":
            break;
          case "selected":
            break;
          default:
            f.add(d[h].name);
        }
      if (ru(t)) {
        for (var y in a)
          if (a.hasOwnProperty(y)) {
            var p = a[y];
            if (p != null) {
              if (xu.hasOwnProperty(y))
                typeof p != "function" && ul(y, p);
              else if (a.suppressHydrationWarning !== !0)
                switch (y) {
                  case "children":
                    typeof p != "string" && typeof p != "number" || nl(
                      "children",
                      e.textContent,
                      p,
                      o
                    );
                    continue;
                  case "suppressContentEditableWarning":
                  case "suppressHydrationWarning":
                  case "defaultValue":
                  case "defaultChecked":
                  case "innerHTML":
                  case "ref":
                    continue;
                  case "dangerouslySetInnerHTML":
                    d = e.innerHTML, p = p ? p.__html : void 0, p != null && (p = mh(e, p), nl(
                      y,
                      d,
                      p,
                      o
                    ));
                    continue;
                  case "style":
                    f.delete(y), Hu(e, p, o);
                    continue;
                  case "offsetParent":
                  case "offsetTop":
                  case "offsetLeft":
                  case "offsetWidth":
                  case "offsetHeight":
                  case "isContentEditable":
                  case "outerText":
                  case "outerHTML":
                    f.delete(y.toLowerCase()), console.error(
                      "Assignment to read-only property will result in a no-op: `%s`",
                      y
                    );
                    continue;
                  case "className":
                    f.delete("class"), d = Ci(
                      e,
                      "class",
                      p
                    ), nl(
                      "className",
                      d,
                      p,
                      o
                    );
                    continue;
                  default:
                    i.context === zo && t !== "svg" && t !== "math" ? f.delete(y.toLowerCase()) : f.delete(y), d = Ci(
                      e,
                      y,
                      p
                    ), nl(
                      y,
                      d,
                      p,
                      o
                    );
                }
            }
          }
      } else
        for (p in a)
          if (a.hasOwnProperty(p) && (y = a[p], y != null)) {
            if (xu.hasOwnProperty(p))
              typeof y != "function" && ul(p, y);
            else if (a.suppressHydrationWarning !== !0)
              switch (p) {
                case "children":
                  typeof y != "string" && typeof y != "number" || nl(
                    "children",
                    e.textContent,
                    y,
                    o
                  );
                  continue;
                case "suppressContentEditableWarning":
                case "suppressHydrationWarning":
                case "value":
                case "checked":
                case "selected":
                case "defaultValue":
                case "defaultChecked":
                case "innerHTML":
                case "ref":
                  continue;
                case "dangerouslySetInnerHTML":
                  d = e.innerHTML, y = y ? y.__html : void 0, y != null && (y = mh(e, y), d !== y && (o[p] = { __html: d }));
                  continue;
                case "className":
                  Ca(
                    e,
                    p,
                    "class",
                    y,
                    f,
                    o
                  );
                  continue;
                case "tabIndex":
                  Ca(
                    e,
                    p,
                    "tabindex",
                    y,
                    f,
                    o
                  );
                  continue;
                case "style":
                  f.delete(p), Hu(e, y, o);
                  continue;
                case "multiple":
                  f.delete(p), nl(
                    p,
                    e.multiple,
                    y,
                    o
                  );
                  continue;
                case "muted":
                  f.delete(p), nl(
                    p,
                    e.muted,
                    y,
                    o
                  );
                  continue;
                case "autoFocus":
                  f.delete("autofocus"), nl(
                    p,
                    e.autofocus,
                    y,
                    o
                  );
                  continue;
                case "data":
                  if (t !== "object") {
                    f.delete(p), d = e.getAttribute("data"), nl(
                      p,
                      d,
                      y,
                      o
                    );
                    continue;
                  }
                case "src":
                case "href":
                  if (!(y !== "" || t === "a" && p === "href" || t === "object" && p === "data")) {
                    console.error(
                      p === "src" ? 'An empty string ("") was passed to the %s attribute. This may cause the browser to download the whole page again over the network. To fix this, either do not render the element at all or pass null to %s instead of an empty string.' : 'An empty string ("") was passed to the %s attribute. To fix this, either do not render the element at all or pass null to %s instead of an empty string.',
                      p,
                      p
                    );
                    continue;
                  }
                  fs(
                    e,
                    p,
                    p,
                    y,
                    f,
                    o
                  );
                  continue;
                case "action":
                case "formAction":
                  if (d = e.getAttribute(p), typeof y == "function") {
                    f.delete(p.toLowerCase()), p === "formAction" ? (f.delete("name"), f.delete("formenctype"), f.delete("formmethod"), f.delete("formtarget")) : (f.delete("enctype"), f.delete("method"), f.delete("target"));
                    continue;
                  } else if (d === hT) {
                    f.delete(p.toLowerCase()), nl(
                      p,
                      "function",
                      y,
                      o
                    );
                    continue;
                  }
                  fs(
                    e,
                    p,
                    p.toLowerCase(),
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkHref":
                  fs(
                    e,
                    p,
                    "xlink:href",
                    y,
                    f,
                    o
                  );
                  continue;
                case "contentEditable":
                  ph(
                    e,
                    p,
                    "contenteditable",
                    y,
                    f,
                    o
                  );
                  continue;
                case "spellCheck":
                  ph(
                    e,
                    p,
                    "spellcheck",
                    y,
                    f,
                    o
                  );
                  continue;
                case "draggable":
                case "autoReverse":
                case "externalResourcesRequired":
                case "focusable":
                case "preserveAlpha":
                  ph(
                    e,
                    p,
                    p,
                    y,
                    f,
                    o
                  );
                  continue;
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
                  yh(
                    e,
                    p,
                    p.toLowerCase(),
                    y,
                    f,
                    o
                  );
                  continue;
                case "capture":
                case "download":
                  e: {
                    h = e;
                    var R = d = p, _ = o;
                    if (f.delete(R), h = h.getAttribute(R), h === null)
                      switch (typeof y) {
                        case "undefined":
                        case "function":
                        case "symbol":
                          break e;
                        default:
                          if (y === !1) break e;
                      }
                    else if (y != null)
                      switch (typeof y) {
                        case "function":
                        case "symbol":
                          break;
                        case "boolean":
                          if (y === !0 && h === "") break e;
                          break;
                        default:
                          if (gt(y, d), h === "" + y)
                            break e;
                      }
                    nl(
                      d,
                      h,
                      y,
                      _
                    );
                  }
                  continue;
                case "cols":
                case "rows":
                case "size":
                case "span":
                  e: {
                    if (h = e, R = d = p, _ = o, f.delete(R), h = h.getAttribute(R), h === null)
                      switch (typeof y) {
                        case "undefined":
                        case "function":
                        case "symbol":
                        case "boolean":
                          break e;
                        default:
                          if (isNaN(y) || 1 > y) break e;
                      }
                    else if (y != null)
                      switch (typeof y) {
                        case "function":
                        case "symbol":
                        case "boolean":
                          break;
                        default:
                          if (!(isNaN(y) || 1 > y) && (gt(y, d), h === "" + y))
                            break e;
                      }
                    nl(
                      d,
                      h,
                      y,
                      _
                    );
                  }
                  continue;
                case "rowSpan":
                  bf(
                    e,
                    p,
                    "rowspan",
                    y,
                    f,
                    o
                  );
                  continue;
                case "start":
                  bf(
                    e,
                    p,
                    p,
                    y,
                    f,
                    o
                  );
                  continue;
                case "xHeight":
                  Ca(
                    e,
                    p,
                    "x-height",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkActuate":
                  Ca(
                    e,
                    p,
                    "xlink:actuate",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkArcrole":
                  Ca(
                    e,
                    p,
                    "xlink:arcrole",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkRole":
                  Ca(
                    e,
                    p,
                    "xlink:role",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkShow":
                  Ca(
                    e,
                    p,
                    "xlink:show",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkTitle":
                  Ca(
                    e,
                    p,
                    "xlink:title",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkType":
                  Ca(
                    e,
                    p,
                    "xlink:type",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xmlBase":
                  Ca(
                    e,
                    p,
                    "xml:base",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xmlLang":
                  Ca(
                    e,
                    p,
                    "xml:lang",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xmlSpace":
                  Ca(
                    e,
                    p,
                    "xml:space",
                    y,
                    f,
                    o
                  );
                  continue;
                case "inert":
                  y !== "" || Bv[p] || (Bv[p] = !0, console.error(
                    "Received an empty string for a boolean attribute `%s`. This will treat the attribute as if it were false. Either pass `false` to silence this warning, or pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true.",
                    p
                  )), yh(
                    e,
                    p,
                    p,
                    y,
                    f,
                    o
                  );
                  continue;
                default:
                  if (!(2 < p.length) || p[0] !== "o" && p[0] !== "O" || p[1] !== "n" && p[1] !== "N") {
                    h = A0(p), d = !1, i.context === zo && t !== "svg" && t !== "math" ? f.delete(h.toLowerCase()) : (R = p.toLowerCase(), R = Pn.hasOwnProperty(
                      R
                    ) && Pn[R] || null, R !== null && R !== p && (d = !0, f.delete(R)), f.delete(h));
                    e: if (R = e, _ = h, h = y, dn(_))
                      if (R.hasAttribute(_))
                        R = R.getAttribute(
                          _
                        ), gt(
                          h,
                          _
                        ), h = R === "" + h ? h : R;
                      else {
                        switch (typeof h) {
                          case "function":
                          case "symbol":
                            break e;
                          case "boolean":
                            if (R = _.toLowerCase().slice(0, 5), R !== "data-" && R !== "aria-")
                              break e;
                        }
                        h = h === void 0 ? void 0 : null;
                      }
                    else h = void 0;
                    d || nl(
                      p,
                      h,
                      y,
                      o
                    );
                  }
              }
          }
      return 0 < f.size && a.suppressHydrationWarning !== !0 && os(e, f, o), Object.keys(o).length === 0 ? null : o;
    }
    function fg(e, t) {
      switch (e.length) {
        case 0:
          return "";
        case 1:
          return e[0];
        case 2:
          return e[0] + " " + t + " " + e[1];
        default:
          return e.slice(0, -1).join(", ") + ", " + t + " " + e[e.length - 1];
      }
    }
    function Ta(e) {
      switch (e) {
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
    function rg() {
      if (typeof performance.getEntriesByType == "function") {
        for (var e = 0, t = 0, a = performance.getEntriesByType("resource"), i = 0; i < a.length; i++) {
          var o = a[i], f = o.transferSize, d = o.initiatorType, h = o.duration;
          if (f && h && Ta(d)) {
            for (d = 0, h = o.responseEnd, i += 1; i < a.length; i++) {
              var y = a[i], p = y.startTime;
              if (p > h) break;
              var R = y.transferSize, _ = y.initiatorType;
              R && Ta(_) && (y = y.responseEnd, d += R * (y < h ? 1 : (h - p) / (y - p)));
            }
            if (--i, t += 8 * (f + d) / (o.duration / 1e3), e++, 10 < e) break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
    }
    function rs(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function sg(e) {
      switch (e) {
        case ke:
          return pm;
        case Ve:
          return jv;
        default:
          return zo;
      }
    }
    function yi(e, t) {
      if (e === zo)
        switch (t) {
          case "svg":
            return pm;
          case "math":
            return jv;
          default:
            return zo;
        }
      return e === pm && t === "foreignObject" ? zo : e;
    }
    function Ef(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function $y() {
      var e = window.event;
      return e && e.type === "popstate" ? e === yS ? !1 : (yS = e, !0) : (yS = null, !1);
    }
    function Nu() {
      var e = window.event;
      return e && e !== r0 ? e.type : null;
    }
    function Tf() {
      var e = window.event;
      return e && e !== r0 ? e.timeStamp : -1.1;
    }
    function dg(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function hg(e, t, a) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          break;
        case "img":
          a.src ? e.src = a.src : a.srcSet && (e.srcset = a.srcSet);
      }
    }
    function mg() {
    }
    function gh(e, t, a, i) {
      zl(e, t, a, i), e[Oa] = i;
    }
    function vh(e) {
      Oc(e, "");
    }
    function n1(e, t, a) {
      e.nodeValue = a;
    }
    function yg(e) {
      if (!e.__reactWarnedAboutChildrenConflict) {
        var t = e[Oa] || null;
        if (t !== null) {
          var a = ae(e);
          a !== null && (typeof t.children == "string" || typeof t.children == "number" ? (e.__reactWarnedAboutChildrenConflict = !0, se(a, function() {
            console.error(
              'Cannot use a ref on a React element as a container to `createRoot` or `createPortal` if that element also sets "children" text content using React. It should be a leaf with no children. Otherwise it\'s ambiguous which children should be used.'
            );
          })) : t.dangerouslySetInnerHTML != null && (e.__reactWarnedAboutChildrenConflict = !0, se(a, function() {
            console.error(
              'Cannot use a ref on a React element as a container to `createRoot` or `createPortal` if that element also sets "dangerouslySetInnerHTML" using React. It should be a leaf with no children. Otherwise it\'s ambiguous which children should be used.'
            );
          })));
        }
      }
    }
    function ic(e) {
      return e === "head";
    }
    function pg(e, t) {
      e.removeChild(t);
    }
    function gg(e, t) {
      (e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).removeChild(t);
    }
    function lo(e, t) {
      var a = t, i = 0;
      do {
        var o = a.nextSibling;
        if (e.removeChild(a), o && o.nodeType === 8)
          if (a = o.data, a === f0 || a === Yv) {
            if (i === 0) {
              e.removeChild(o), io(t);
              return;
            }
            i--;
          } else if (a === o0 || a === ur || a === Ks || a === ym || a === Js)
            i++;
          else if (a === yT)
            gi(
              e.ownerDocument.documentElement
            );
          else if (a === gT) {
            a = e.ownerDocument.head, gi(a);
            for (var f = a.firstChild; f; ) {
              var d = f.nextSibling, h = f.nodeName;
              f[xf] || h === "SCRIPT" || h === "STYLE" || h === "LINK" && f.rel.toLowerCase() === "stylesheet" || a.removeChild(f), f = d;
            }
          } else
            a === pT && gi(e.ownerDocument.body);
        a = o;
      } while (a);
      io(t);
    }
    function ss(e, t) {
      var a = e;
      e = 0;
      do {
        var i = a.nextSibling;
        if (a.nodeType === 1 ? t ? (a._stashedDisplay = a.style.display, a.style.display = "none") : (a.style.display = a._stashedDisplay || "", a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (t ? (a._stashedText = a.nodeValue, a.nodeValue = "") : a.nodeValue = a._stashedText || ""), i && i.nodeType === 8)
          if (a = i.data, a === f0) {
            if (e === 0) break;
            e--;
          } else
            a !== o0 && a !== ur && a !== Ks && a !== ym || e++;
        a = i;
      } while (a);
    }
    function vg(e) {
      ss(e, !0);
    }
    function Sg(e) {
      e = e.style, typeof e.setProperty == "function" ? e.setProperty("display", "none", "important") : e.display = "none";
    }
    function bg(e) {
      e.nodeValue = "";
    }
    function Eg(e) {
      ss(e, !1);
    }
    function Tg(e, t) {
      t = t[vT], t = t != null && t.hasOwnProperty("display") ? t.display : null, e.style.display = t == null || typeof t == "boolean" ? "" : ("" + t).trim();
    }
    function Ag(e, t) {
      e.nodeValue = t;
    }
    function Af(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
        var a = t;
        switch (t = t.nextSibling, a.nodeName) {
          case "HTML":
          case "HEAD":
          case "BODY":
            Af(a), U(a);
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if (a.rel.toLowerCase() === "stylesheet") continue;
        }
        e.removeChild(a);
      }
    }
    function Og(e, t, a, i) {
      for (; e.nodeType === 1; ) {
        var o = a;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!i && (e.nodeName !== "INPUT" || e.type !== "hidden"))
            break;
        } else if (i) {
          if (!e[xf])
            switch (t) {
              case "meta":
                if (!e.hasAttribute("itemprop")) break;
                return e;
              case "link":
                if (f = e.getAttribute("rel"), f === "stylesheet" && e.hasAttribute("data-precedence"))
                  break;
                if (f !== o.rel || e.getAttribute("href") !== (o.href == null || o.href === "" ? null : o.href) || e.getAttribute("crossorigin") !== (o.crossOrigin == null ? null : o.crossOrigin) || e.getAttribute("title") !== (o.title == null ? null : o.title))
                  break;
                return e;
              case "style":
                if (e.hasAttribute("data-precedence")) break;
                return e;
              case "script":
                if (f = e.getAttribute("src"), (f !== (o.src == null ? null : o.src) || e.getAttribute("type") !== (o.type == null ? null : o.type) || e.getAttribute("crossorigin") !== (o.crossOrigin == null ? null : o.crossOrigin)) && f && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                  break;
                return e;
              default:
                return e;
            }
        } else if (t === "input" && e.type === "hidden") {
          gt(o.name, "name");
          var f = o.name == null ? null : "" + o.name;
          if (o.type === "hidden" && e.getAttribute("name") === f)
            return e;
        } else return e;
        if (e = tn(e.nextSibling), e === null) break;
      }
      return null;
    }
    function Rg(e, t, a) {
      if (t === "") return null;
      for (; e.nodeType !== 3; )
        if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !a || (e = tn(e.nextSibling), e === null)) return null;
      return e;
    }
    function _t(e, t) {
      for (; e.nodeType !== 8; )
        if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = tn(e.nextSibling), e === null)) return null;
      return e;
    }
    function ds(e) {
      return e.data === ur || e.data === Ks;
    }
    function ky(e) {
      return e.data === ym || e.data === ur && e.ownerDocument.readyState !== d2;
    }
    function zg(e, t) {
      var a = e.ownerDocument;
      if (e.data === Ks)
        e._reactRetry = t;
      else if (e.data !== ur || a.readyState !== d2)
        t();
      else {
        var i = function() {
          t(), a.removeEventListener("DOMContentLoaded", i);
        };
        a.addEventListener("DOMContentLoaded", i), e._reactRetry = i;
      }
    }
    function tn(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break;
        if (t === 8) {
          if (t = e.data, t === o0 || t === ym || t === ur || t === Ks || t === Js || t === dS || t === s2)
            break;
          if (t === f0 || t === Yv)
            return null;
        }
      }
      return e;
    }
    function Dg(e) {
      if (e.nodeType === 1) {
        for (var t = e.nodeName.toLowerCase(), a = {}, i = e.attributes, o = 0; o < i.length; o++) {
          var f = i[o];
          a[mi(f.name)] = f.name.toLowerCase() === "style" ? uc(e) : f.value;
        }
        return { type: t, props: a };
      }
      return e.nodeType === 8 ? e.data === Js ? { type: "Activity", props: {} } : { type: "Suspense", props: {} } : e.nodeValue;
    }
    function _g(e, t, a) {
      return a === null || a[mT] !== !0 ? (e.nodeValue === t ? e = null : (t = kn(t), e = kn(e.nodeValue) === t ? null : e.nodeValue), e) : null;
    }
    function Of(e) {
      e = e.nextSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var a = e.data;
          if (a === f0 || a === Yv) {
            if (t === 0)
              return tn(e.nextSibling);
            t--;
          } else
            a !== o0 && a !== ym && a !== ur && a !== Ks && a !== Js || t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function ao(e) {
      e = e.previousSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var a = e.data;
          if (a === o0 || a === ym || a === ur || a === Ks || a === Js) {
            if (t === 0) return e;
            t--;
          } else
            a !== f0 && a !== Yv || t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    function Wy(e) {
      io(e);
    }
    function Sh(e) {
      io(e);
    }
    function Fy(e) {
      io(e);
    }
    function pi(e, t, a, i, o) {
      switch (o && mr(e, i.ancestorInfo), t = rs(a), e) {
        case "html":
          if (e = t.documentElement, !e)
            throw Error(
              "React expected an <html> element (document.documentElement) to exist in the Document but one was not found. React never removes the documentElement for any Document it renders into so the cause is likely in some other script running on this page."
            );
          return e;
        case "head":
          if (e = t.head, !e)
            throw Error(
              "React expected a <head> element (document.head) to exist in the Document but one was not found. React never removes the head for any Document it renders into so the cause is likely in some other script running on this page."
            );
          return e;
        case "body":
          if (e = t.body, !e)
            throw Error(
              "React expected a <body> element (document.body) to exist in the Document but one was not found. React never removes the body for any Document it renders into so the cause is likely in some other script running on this page."
            );
          return e;
        default:
          throw Error(
            "resolveSingletonInstance was called with an element type that is not supported. This is a bug in React."
          );
      }
    }
    function Bu(e, t, a, i) {
      if (!a[Si] && ae(a)) {
        var o = a.tagName.toLowerCase();
        console.error(
          "You are mounting a new %s component when a previous one has not first unmounted. It is an error to render more than one %s component at a time and attributes and children of these components will likely fail in unpredictable ways. Please only render a single instance of <%s> and if you need to mount a new one, ensure any previous ones have unmounted first.",
          o,
          o,
          o
        );
      }
      switch (e) {
        case "html":
        case "head":
        case "body":
          break;
        default:
          console.error(
            "acquireSingletonInstance was called with an element type that is not supported. This is a bug in React."
          );
      }
      for (o = a.attributes; o.length; )
        a.removeAttributeNode(o[0]);
      It(a, e, t), a[Pt] = i, a[Oa] = t;
    }
    function gi(e) {
      for (var t = e.attributes; t.length; )
        e.removeAttributeNode(t[0]);
      U(e);
    }
    function bh(e) {
      return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
    }
    function Iy(e, t, a) {
      var i = gm;
      if (i && typeof t == "string" && t) {
        var o = Ct(t);
        o = 'link[rel="' + e + '"][href="' + o + '"]', typeof a == "string" && (o += '[crossorigin="' + a + '"]'), v2.has(o) || (v2.add(o), e = { rel: e, crossOrigin: a, href: t }, i.querySelector(o) === null && (t = i.createElement("link"), It(t, "link", e), pe(t), i.head.appendChild(t)));
      }
    }
    function Py(e, t, a, i) {
      var o = (o = ln.current) ? bh(o) : null;
      if (!o)
        throw Error(
          '"resourceRoot" was expected to exist. This is a bug in React.'
        );
      switch (e) {
        case "meta":
        case "title":
          return null;
        case "style":
          return typeof a.precedence == "string" && typeof a.href == "string" ? (a = no(a.href), t = Ce(o).hoistableStyles, i = t.get(a), i || (i = {
            type: "style",
            instance: null,
            count: 0,
            state: null
          }, t.set(a, i)), i) : { type: "void", instance: null, count: 0, state: null };
        case "link":
          if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
            e = no(a.href);
            var f = Ce(o).hoistableStyles, d = f.get(e);
            if (!d && (o = o.ownerDocument || o, d = {
              type: "stylesheet",
              instance: null,
              count: 0,
              state: { loading: ks, preload: null }
            }, f.set(e, d), (f = o.querySelector(
              ms(e)
            )) && !f._p && (d.instance = f, d.state.loading = s0 | ku), !Wu.has(e))) {
              var h = {
                rel: "preload",
                as: "style",
                href: a.href,
                crossOrigin: a.crossOrigin,
                integrity: a.integrity,
                media: a.media,
                hrefLang: a.hrefLang,
                referrerPolicy: a.referrerPolicy
              };
              Wu.set(e, h), f || Mg(
                o,
                e,
                h,
                d.state
              );
            }
            if (t && i === null)
              throw a = `

  - ` + hs(t) + `
  + ` + hs(a), Error(
                "Expected <link> not to update to be updated to a stylesheet with precedence. Check the `rel`, `href`, and `precedence` props of this component. Alternatively, check whether two different <link> components render in the same slot or share the same key." + a
              );
            return d;
          }
          if (t && i !== null)
            throw a = `

  - ` + hs(t) + `
  + ` + hs(a), Error(
              "Expected stylesheet with precedence to not be updated to a different kind of <link>. Check the `rel`, `href`, and `precedence` props of this component. Alternatively, check whether two different <link> components render in the same slot or share the same key." + a
            );
          return null;
        case "script":
          return t = a.async, a = a.src, typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (a = uo(a), t = Ce(o).hoistableScripts, i = t.get(a), i || (i = {
            type: "script",
            instance: null,
            count: 0,
            state: null
          }, t.set(a, i)), i) : { type: "void", instance: null, count: 0, state: null };
        default:
          throw Error(
            'getResource encountered a type it did not expect: "' + e + '". this is a bug in React.'
          );
      }
    }
    function hs(e) {
      var t = 0, a = "<link";
      return typeof e.rel == "string" ? (t++, a += ' rel="' + e.rel + '"') : an.call(e, "rel") && (t++, a += ' rel="' + (e.rel === null ? "null" : "invalid type " + typeof e.rel) + '"'), typeof e.href == "string" ? (t++, a += ' href="' + e.href + '"') : an.call(e, "href") && (t++, a += ' href="' + (e.href === null ? "null" : "invalid type " + typeof e.href) + '"'), typeof e.precedence == "string" ? (t++, a += ' precedence="' + e.precedence + '"') : an.call(e, "precedence") && (t++, a += " precedence={" + (e.precedence === null ? "null" : "invalid type " + typeof e.precedence) + "}"), Object.getOwnPropertyNames(e).length > t && (a += " ..."), a + " />";
    }
    function no(e) {
      return 'href="' + Ct(e) + '"';
    }
    function ms(e) {
      return 'link[rel="stylesheet"][' + e + "]";
    }
    function Eh(e) {
      return Ie({}, e, {
        "data-precedence": e.precedence,
        precedence: null
      });
    }
    function Mg(e, t, a, i) {
      e.querySelector(
        'link[rel="preload"][as="style"][' + t + "]"
      ) ? i.loading = s0 : (t = e.createElement("link"), i.preload = t, t.addEventListener("load", function() {
        return i.loading |= s0;
      }), t.addEventListener("error", function() {
        return i.loading |= p2;
      }), It(t, "link", a), pe(t), e.head.appendChild(t));
    }
    function uo(e) {
      return '[src="' + Ct(e) + '"]';
    }
    function ys(e) {
      return "script[async]" + e;
    }
    function Th(e, t, a) {
      if (t.count++, t.instance === null)
        switch (t.type) {
          case "style":
            var i = e.querySelector(
              'style[data-href~="' + Ct(a.href) + '"]'
            );
            if (i)
              return t.instance = i, pe(i), i;
            var o = Ie({}, a, {
              "data-href": a.href,
              "data-precedence": a.precedence,
              href: null,
              precedence: null
            });
            return i = (e.ownerDocument || e).createElement("style"), pe(i), It(i, "style", o), Rf(i, a.precedence, e), t.instance = i;
          case "stylesheet":
            o = no(a.href);
            var f = e.querySelector(
              ms(o)
            );
            if (f)
              return t.state.loading |= ku, t.instance = f, pe(f), f;
            i = Eh(a), (o = Wu.get(o)) && ep(i, o), f = (e.ownerDocument || e).createElement("link"), pe(f);
            var d = f;
            return d._p = new Promise(function(h, y) {
              d.onload = h, d.onerror = y;
            }), It(f, "link", i), t.state.loading |= ku, Rf(f, a.precedence, e), t.instance = f;
          case "script":
            return f = uo(a.src), (o = e.querySelector(
              ys(f)
            )) ? (t.instance = o, pe(o), o) : (i = a, (o = Wu.get(f)) && (i = Ie({}, a), tp(i, o)), e = e.ownerDocument || e, o = e.createElement("script"), pe(o), It(o, "link", i), e.head.appendChild(o), t.instance = o);
          case "void":
            return null;
          default:
            throw Error(
              'acquireResource encountered a resource type it did not expect: "' + t.type + '". this is a bug in React.'
            );
        }
      else
        t.type === "stylesheet" && (t.state.loading & ku) === ks && (i = t.instance, t.state.loading |= ku, Rf(i, a.precedence, e));
      return t.instance;
    }
    function Rf(e, t, a) {
      for (var i = a.querySelectorAll(
        'link[rel="stylesheet"][data-precedence],style[data-precedence]'
      ), o = i.length ? i[i.length - 1] : null, f = o, d = 0; d < i.length; d++) {
        var h = i[d];
        if (h.dataset.precedence === t) f = h;
        else if (f !== o) break;
      }
      f ? f.parentNode.insertBefore(e, f.nextSibling) : (t = a.nodeType === 9 ? a.head : a, t.insertBefore(e, t.firstChild));
    }
    function ep(e, t) {
      e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
    }
    function tp(e, t) {
      e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
    }
    function zf(e, t, a) {
      if (qv === null) {
        var i = /* @__PURE__ */ new Map(), o = qv = /* @__PURE__ */ new Map();
        o.set(a, i);
      } else
        o = qv, i = o.get(a), i || (i = /* @__PURE__ */ new Map(), o.set(a, i));
      if (i.has(e)) return i;
      for (i.set(e, null), a = a.getElementsByTagName(e), o = 0; o < a.length; o++) {
        var f = a[o];
        if (!(f[xf] || f[Pt] || e === "link" && f.getAttribute("rel") === "stylesheet") && f.namespaceURI !== ke) {
          var d = f.getAttribute(t) || "";
          d = e + d;
          var h = i.get(d);
          h ? h.push(f) : i.set(d, [f]);
        }
      }
      return i;
    }
    function Cg(e, t, a) {
      e = e.ownerDocument || e, e.head.insertBefore(
        a,
        t === "title" ? e.querySelector("head > title") : null
      );
    }
    function Ug(e, t, a) {
      var i = !a.ancestorInfo.containerTagInScope;
      if (a.context === pm || t.itemProp != null)
        return !i || t.itemProp == null || e !== "meta" && e !== "title" && e !== "style" && e !== "link" && e !== "script" || console.error(
          "Cannot render a <%s> outside the main document if it has an `itemProp` prop. `itemProp` suggests the tag belongs to an `itemScope` which can appear anywhere in the DOM. If you were intending for React to hoist this <%s> remove the `itemProp` prop. Otherwise, try moving this tag into the <head> or <body> of the Document.",
          e,
          e
        ), !1;
      switch (e) {
        case "meta":
        case "title":
          return !0;
        case "style":
          if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") {
            i && console.error(
              'Cannot render a <style> outside the main document without knowing its precedence and a unique href key. React can hoist and deduplicate <style> tags if you provide a `precedence` prop along with an `href` prop that does not conflict with the `href` values used in any other hoisted <style> or <link rel="stylesheet" ...> tags.  Note that hoisting <style> tags is considered an advanced feature that most will not use directly. Consider moving the <style> tag to the <head> or consider adding a `precedence="default"` and `href="some unique resource identifier"`.'
            );
            break;
          }
          return !0;
        case "link":
          if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) {
            if (t.rel === "stylesheet" && typeof t.precedence == "string") {
              e = t.href;
              var o = t.onError, f = t.disabled;
              a = [], t.onLoad && a.push("`onLoad`"), o && a.push("`onError`"), f != null && a.push("`disabled`"), o = fg(a, "and"), o += a.length === 1 ? " prop" : " props", f = a.length === 1 ? "an " + o : "the " + o, a.length && console.error(
                'React encountered a <link rel="stylesheet" href="%s" ... /> with a `precedence` prop that also included %s. The presence of loading and error handlers indicates an intent to manage the stylesheet loading state from your from your Component code and React will not hoist or deduplicate this stylesheet. If your intent was to have React hoist and deduplciate this stylesheet using the `precedence` prop remove the %s, otherwise remove the `precedence` prop.',
                e,
                f,
                o
              );
            }
            i && (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" ? console.error(
              "Cannot render a <link> outside the main document without a `rel` and `href` prop. Try adding a `rel` and/or `href` prop to this <link> or moving the link into the <head> tag"
            ) : (t.onError || t.onLoad) && console.error(
              "Cannot render a <link> with onLoad or onError listeners outside the main document. Try removing onLoad={...} and onError={...} or moving it into the root <head> tag or somewhere in the <body>."
            ));
            break;
          }
          switch (t.rel) {
            case "stylesheet":
              return e = t.precedence, t = t.disabled, typeof e != "string" && i && console.error(
                'Cannot render a <link rel="stylesheet" /> outside the main document without knowing its precedence. Consider adding precedence="default" or moving it into the root <head> tag.'
              ), typeof e == "string" && t == null;
            default:
              return !0;
          }
        case "script":
          if (e = t.async && typeof t.async != "function" && typeof t.async != "symbol", !e || t.onLoad || t.onError || !t.src || typeof t.src != "string") {
            i && (e ? t.onLoad || t.onError ? console.error(
              "Cannot render a <script> with onLoad or onError listeners outside the main document. Try removing onLoad={...} and onError={...} or moving it into the root <head> tag or somewhere in the <body>."
            ) : console.error(
              "Cannot render a <script> outside the main document without `async={true}` and a non-empty `src` prop. Ensure there is a valid `src` and either make the script async or move it into the root <head> tag or somewhere in the <body>."
            ) : console.error(
              'Cannot render a sync or defer <script> outside the main document without knowing its order. Try adding async="" or moving it into the root <head> tag.'
            ));
            break;
          }
          return !0;
        case "noscript":
        case "template":
          i && console.error(
            "Cannot render <%s> outside the main document. Try moving it into the root <head> tag.",
            e
          );
      }
      return !1;
    }
    function ut(e) {
      return !(e.type === "stylesheet" && (e.state.loading & g2) === ks);
    }
    function lp(e, t, a, i) {
      if (a.type === "stylesheet" && (typeof i.media != "string" || matchMedia(i.media).matches !== !1) && (a.state.loading & ku) === ks) {
        if (a.instance === null) {
          var o = no(i.href), f = t.querySelector(
            ms(o)
          );
          if (f) {
            t = f._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Df.bind(e), t.then(e, e)), a.state.loading |= ku, a.instance = f, pe(f);
            return;
          }
          f = t.ownerDocument || t, i = Eh(i), (o = Wu.get(o)) && ep(i, o), f = f.createElement("link"), pe(f);
          var d = f;
          d._p = new Promise(function(h, y) {
            d.onload = h, d.onerror = y;
          }), It(f, "link", i), a.instance = f;
        }
        e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(a, t), (t = a.state.preload) && (a.state.loading & g2) === ks && (e.count++, a = Df.bind(e), t.addEventListener("load", a), t.addEventListener("error", a));
      }
    }
    function Ah(e, t) {
      return e.stylesheets && e.count === 0 && ps(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(a) {
        var i = setTimeout(function() {
          if (e.stylesheets && ps(e, e.stylesheets), e.unsuspend) {
            var f = e.unsuspend;
            e.unsuspend = null, f();
          }
        }, ET + t);
        0 < e.imgBytes && gS === 0 && (gS = 125 * rg() * AT);
        var o = setTimeout(
          function() {
            if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ps(e, e.stylesheets), e.unsuspend)) {
              var f = e.unsuspend;
              e.unsuspend = null, f();
            }
          },
          (e.imgBytes > gS ? 50 : TT) + t
        );
        return e.unsuspend = a, function() {
          e.unsuspend = null, clearTimeout(i), clearTimeout(o);
        };
      } : null;
    }
    function Df() {
      if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
        if (this.stylesheets)
          ps(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          this.unsuspend = null, e();
        }
      }
    }
    function ps(e, t) {
      e.stylesheets = null, e.unsuspend !== null && (e.count++, xv = /* @__PURE__ */ new Map(), t.forEach(ap, e), xv = null, Df.call(e));
    }
    function ap(e, t) {
      if (!(t.state.loading & ku)) {
        var a = xv.get(e);
        if (a) var i = a.get(vS);
        else {
          a = /* @__PURE__ */ new Map(), xv.set(e, a);
          for (var o = e.querySelectorAll(
            "link[data-precedence],style[data-precedence]"
          ), f = 0; f < o.length; f++) {
            var d = o[f];
            (d.nodeName === "LINK" || d.getAttribute("media") !== "not all") && (a.set(d.dataset.precedence, d), i = d);
          }
          i && a.set(vS, i);
        }
        o = t.instance, d = o.getAttribute("data-precedence"), f = a.get(d) || i, f === i && a.set(vS, o), a.set(d, o), this.count++, i = Df.bind(this), o.addEventListener("load", i), o.addEventListener("error", i), f ? f.parentNode.insertBefore(o, f.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(o, e.firstChild)), t.state.loading |= ku;
      }
    }
    function gs(e, t, a, i, o, f, d, h, y) {
      for (this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = $s, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Co(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Co(0), this.hiddenUpdates = Co(null), this.identifierPrefix = i, this.onUncaughtError = o, this.onCaughtError = f, this.onRecoverableError = d, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = y, this.incompleteTransitions = /* @__PURE__ */ new Map(), this.passiveEffectDuration = this.effectDuration = -0, this.memoizedUpdaters = /* @__PURE__ */ new Set(), e = this.pendingUpdatersLaneMap = [], t = 0; 31 > t; t++) e.push(/* @__PURE__ */ new Set());
      this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
    }
    function vs(e, t, a, i, o, f, d, h, y, p, R, _) {
      return e = new gs(
        e,
        t,
        a,
        d,
        y,
        p,
        R,
        _,
        h
      ), t = KE, f === !0 && (t |= Ba | bi), t |= Pe, f = N(3, null, null, t), e.current = f, f.stateNode = e, t = Td(), Bc(t), e.pooledCache = t, Bc(t), f.memoizedState = {
        element: i,
        isDehydrated: a,
        cache: t
      }, ct(f), e;
    }
    function Hg(e) {
      return e ? (e = Vf, e) : Vf;
    }
    function Oh(e, t, a, i, o, f) {
      if (Dl && typeof Dl.onScheduleFiberRoot == "function")
        try {
          Dl.onScheduleFiberRoot(ro, i, a);
        } catch (d) {
          ju || (ju = !0, console.error(
            "React instrumentation encountered an error: %o",
            d
          ));
        }
      o = Hg(o), i.context === null ? i.context = o : i.pendingContext = o, Yu && Na !== null && !T2 && (T2 = !0, console.error(
        `Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`,
        re(Na) || "Unknown"
      )), i = Ol(t), i.payload = { element: a }, f = f === void 0 ? null : f, f !== null && (typeof f != "function" && console.error(
        "Expected the last optional `callback` argument to be a function. Instead received: %s.",
        f
      ), i.callback = f), a = gu(e, i, t), a !== null && (mu(t, "root.render()", null), Be(a, e, t), bn(a, e, t));
    }
    function Ng(e, t) {
      if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
        var a = e.retryLane;
        e.retryLane = a !== 0 && a < t ? a : t;
      }
    }
    function np(e, t) {
      Ng(e, t), (e = e.alternate) && Ng(e, t);
    }
    function up(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = ta(e, 67108864);
        t !== null && Be(t, e, 67108864), np(e, 67108864);
      }
    }
    function ip(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = aa(e);
        t = sn(t);
        var a = ta(e, t);
        a !== null && Be(a, e, t), np(e, t);
      }
    }
    function Nt() {
      return Na;
    }
    function cp(e, t, a, i) {
      var o = L.T;
      L.T = null;
      var f = At.p;
      try {
        At.p = _l, op(e, t, a, i);
      } finally {
        At.p = f, L.T = o;
      }
    }
    function $l(e, t, a, i) {
      var o = L.T;
      L.T = null;
      var f = At.p;
      try {
        At.p = Wl, op(e, t, a, i);
      } finally {
        At.p = f, L.T = o;
      }
    }
    function op(e, t, a, i) {
      if (Gv) {
        var o = Rh(i);
        if (o === null)
          Kn(
            e,
            t,
            i,
            Lv,
            a
          ), Dh(e, i);
        else if (Bg(
          o,
          e,
          t,
          a,
          i
        ))
          i.stopPropagation();
        else if (Dh(e, i), t & 4 && -1 < RT.indexOf(e)) {
          for (; o !== null; ) {
            var f = ae(o);
            if (f !== null)
              switch (f.tag) {
                case 3:
                  if (f = f.stateNode, f.current.memoizedState.isDehydrated) {
                    var d = iu(f.pendingLanes);
                    if (d !== 0) {
                      var h = f;
                      for (h.pendingLanes |= 2, h.entangledLanes |= 2; d; ) {
                        var y = 1 << 31 - kl(d);
                        h.entanglements[1] |= y, d &= ~y;
                      }
                      Ma(f), (mt & (Il | au)) === oa && (Av = wl() + Wb, Cu(0));
                    }
                  }
                  break;
                case 31:
                case 13:
                  h = ta(f, 2), h !== null && Be(h, f, 2), en(), np(f, 2);
              }
            if (f = Rh(i), f === null && Kn(
              e,
              t,
              i,
              Lv,
              a
            ), f === o) break;
            o = f;
          }
          o !== null && i.stopPropagation();
        } else
          Kn(
            e,
            t,
            i,
            null,
            a
          );
      }
    }
    function Rh(e) {
      return e = Un(e), fp(e);
    }
    function fp(e) {
      if (Lv = null, e = ee(e), e !== null) {
        var t = Fe(e);
        if (t === null) e = null;
        else {
          var a = t.tag;
          if (a === 13) {
            if (e = kt(t), e !== null) return e;
            e = null;
          } else if (a === 31) {
            if (e = yt(t), e !== null) return e;
            e = null;
          } else if (a === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated)
              return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return Lv = e, null;
    }
    function zh(e) {
      switch (e) {
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
          return _l;
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
          return Wl;
        case "message":
          switch (Os()) {
            case Sp:
              return _l;
            case jh:
              return Wl;
            case fo:
            case Gg:
              return ua;
            case qh:
              return sc;
            default:
              return ua;
          }
        default:
          return ua;
      }
    }
    function Dh(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          ir = null;
          break;
        case "dragenter":
        case "dragleave":
          cr = null;
          break;
        case "mouseover":
        case "mouseout":
          or = null;
          break;
        case "pointerover":
        case "pointerout":
          h0.delete(t.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          m0.delete(t.pointerId);
      }
    }
    function cc(e, t, a, i, o, f) {
      return e === null || e.nativeEvent !== f ? (e = {
        blockedOn: t,
        domEventName: a,
        eventSystemFlags: i,
        nativeEvent: f,
        targetContainers: [o]
      }, t !== null && (t = ae(t), t !== null && up(t)), e) : (e.eventSystemFlags |= i, t = e.targetContainers, o !== null && t.indexOf(o) === -1 && t.push(o), e);
    }
    function Bg(e, t, a, i, o) {
      switch (t) {
        case "focusin":
          return ir = cc(
            ir,
            e,
            t,
            a,
            i,
            o
          ), !0;
        case "dragenter":
          return cr = cc(
            cr,
            e,
            t,
            a,
            i,
            o
          ), !0;
        case "mouseover":
          return or = cc(
            or,
            e,
            t,
            a,
            i,
            o
          ), !0;
        case "pointerover":
          var f = o.pointerId;
          return h0.set(
            f,
            cc(
              h0.get(f) || null,
              e,
              t,
              a,
              i,
              o
            )
          ), !0;
        case "gotpointercapture":
          return f = o.pointerId, m0.set(
            f,
            cc(
              m0.get(f) || null,
              e,
              t,
              a,
              i,
              o
            )
          ), !0;
      }
      return !1;
    }
    function rp(e) {
      var t = ee(e.target);
      if (t !== null) {
        var a = Fe(t);
        if (a !== null) {
          if (t = a.tag, t === 13) {
            if (t = kt(a), t !== null) {
              e.blockedOn = t, g(e.priority, function() {
                ip(a);
              });
              return;
            }
          } else if (t === 31) {
            if (t = yt(a), t !== null) {
              e.blockedOn = t, g(e.priority, function() {
                ip(a);
              });
              return;
            }
          } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
            e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
            return;
          }
        }
      }
      e.blockedOn = null;
    }
    function _f(e) {
      if (e.blockedOn !== null) return !1;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var a = Rh(e.nativeEvent);
        if (a === null) {
          a = e.nativeEvent;
          var i = new a.constructor(
            a.type,
            a
          ), o = i;
          Op !== null && console.error(
            "Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."
          ), Op = o, a.target.dispatchEvent(i), Op === null && console.error(
            "Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."
          ), Op = null;
        } else
          return t = ae(a), t !== null && up(t), e.blockedOn = a, !1;
        t.shift();
      }
      return !0;
    }
    function _h(e, t, a) {
      _f(e) && a.delete(t);
    }
    function u1() {
      SS = !1, ir !== null && _f(ir) && (ir = null), cr !== null && _f(cr) && (cr = null), or !== null && _f(or) && (or = null), h0.forEach(_h), m0.forEach(_h);
    }
    function Ss(e, t) {
      e.blockedOn === t && (e.blockedOn = null, SS || (SS = !0, pl.unstable_scheduleCallback(
        pl.unstable_NormalPriority,
        u1
      )));
    }
    function Yg(e) {
      Xv !== e && (Xv = e, pl.unstable_scheduleCallback(
        pl.unstable_NormalPriority,
        function() {
          Xv === e && (Xv = null);
          for (var t = 0; t < e.length; t += 3) {
            var a = e[t], i = e[t + 1], o = e[t + 2];
            if (typeof i != "function") {
              if (fp(i || a) === null)
                continue;
              break;
            }
            var f = ae(a);
            f !== null && (e.splice(t, 3), t -= 3, a = {
              pending: !0,
              data: o,
              method: a.method,
              action: i
            }, Object.freeze(a), fi(
              f,
              a,
              i,
              o
            ));
          }
        }
      ));
    }
    function io(e) {
      function t(y) {
        return Ss(y, e);
      }
      ir !== null && Ss(ir, e), cr !== null && Ss(cr, e), or !== null && Ss(or, e), h0.forEach(t), m0.forEach(t);
      for (var a = 0; a < fr.length; a++) {
        var i = fr[a];
        i.blockedOn === e && (i.blockedOn = null);
      }
      for (; 0 < fr.length && (a = fr[0], a.blockedOn === null); )
        rp(a), a.blockedOn === null && fr.shift();
      if (a = (e.ownerDocument || e).$$reactFormReplay, a != null)
        for (i = 0; i < a.length; i += 3) {
          var o = a[i], f = a[i + 1], d = o[Oa] || null;
          if (typeof f == "function")
            d || Yg(a);
          else if (d) {
            var h = null;
            if (f && f.hasAttribute("formAction")) {
              if (o = f, d = f[Oa] || null)
                h = d.formAction;
              else if (fp(o) !== null) continue;
            } else h = d.action;
            typeof h == "function" ? a[i + 1] = h : (a.splice(i, 3), i -= 3), Yg(a);
          }
        }
    }
    function jg() {
      function e(f) {
        f.canIntercept && f.info === "react-transition" && f.intercept({
          handler: function() {
            return new Promise(function(d) {
              return o = d;
            });
          },
          focusReset: "manual",
          scroll: "manual"
        });
      }
      function t() {
        o !== null && (o(), o = null), i || setTimeout(a, 20);
      }
      function a() {
        if (!i && !navigation.transition) {
          var f = navigation.currentEntry;
          f && f.url != null && navigation.navigate(f.url, {
            state: f.getState(),
            info: "react-transition",
            history: "replace"
          });
        }
      }
      if (typeof navigation == "object") {
        var i = !1, o = null;
        return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(a, 100), function() {
          i = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener(
            "navigatesuccess",
            t
          ), navigation.removeEventListener(
            "navigateerror",
            t
          ), o !== null && (o(), o = null);
        };
      }
    }
    function sp(e) {
      this._internalRoot = e;
    }
    function Wn(e) {
      this._internalRoot = e;
    }
    function dp(e) {
      e[Si] && (e._reactRootContainer ? console.error(
        "You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported."
      ) : console.error(
        "You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."
      ));
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var pl = I2(), bs = Sm(), i1 = P2(), Ie = Object.assign, qg = Symbol.for("react.element"), On = Symbol.for("react.transitional.element"), oc = Symbol.for("react.portal"), Mf = Symbol.for("react.fragment"), Aa = Symbol.for("react.strict_mode"), Es = Symbol.for("react.profiler"), Mh = Symbol.for("react.consumer"), Fn = Symbol.for("react.context"), Cf = Symbol.for("react.forward_ref"), co = Symbol.for("react.suspense"), Ha = Symbol.for("react.suspense_list"), Ts = Symbol.for("react.memo"), na = Symbol.for("react.lazy"), In = Symbol.for("react.activity"), c1 = Symbol.for("react.memo_cache_sentinel"), xg = Symbol.iterator, Uf = Symbol.for("react.client.reference"), El = Array.isArray, L = bs.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, At = i1.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, o1 = Object.freeze({
      pending: !1,
      data: null,
      method: null,
      action: null
    }), hp = [], mp = [], vi = -1, fc = xt(null), Hf = xt(null), ln = xt(null), rc = xt(null), Nf = 0, wg, oo, Bf, yp, As, Ch, Uh;
    _e.__reactDisabledLog = !0;
    var Yf, pp, Hh = !1, gp = new (typeof WeakMap == "function" ? WeakMap : Map)(), Na = null, Yu = !1, an = Object.prototype.hasOwnProperty, vp = pl.unstable_scheduleCallback, Nh = pl.unstable_cancelCallback, Bh = pl.unstable_shouldYield, Yh = pl.unstable_requestPaint, wl = pl.unstable_now, Os = pl.unstable_getCurrentPriorityLevel, Sp = pl.unstable_ImmediatePriority, jh = pl.unstable_UserBlockingPriority, fo = pl.unstable_NormalPriority, Gg = pl.unstable_LowPriority, qh = pl.unstable_IdlePriority, bp = pl.log, Lg = pl.unstable_setDisableYieldValue, ro = null, Dl = null, ju = !1, qu = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u", kl = Math.clz32 ? Math.clz32 : _i, Ep = Math.log, xh = Math.LN2, jf = 256, Rs = 262144, qf = 4194304, _l = 2, Wl = 8, ua = 32, sc = 268435456, Rn = Math.random().toString(36).slice(2), Pt = "__reactFiber$" + Rn, Oa = "__reactProps$" + Rn, Si = "__reactContainer$" + Rn, so = "__reactEvents$" + Rn, f1 = "__reactListeners$" + Rn, Xg = "__reactHandles$" + Rn, zs = "__reactResources$" + Rn, xf = "__reactMarker$" + Rn, Qg = /* @__PURE__ */ new Set(), xu = {}, wf = {}, Vg = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    }, Gf = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ), Tp = {}, wh = {}, Gh = /[\n"\\]/g, Ap = !1, Zg = !1, Ds = !1, l = !1, n = !1, u = !1, c = ["value", "defaultValue"], r = !1, s = /["'&<>\n\t]|^\s|\s$/, m = "address applet area article aside base basefont bgsound blockquote body br button caption center col colgroup dd details dir div dl dt embed fieldset figcaption figure footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html iframe img input isindex li link listing main marquee menu menuitem meta nav noembed noframes noscript object ol p param plaintext pre script section select source style summary table tbody td template textarea tfoot th thead title tr track ul wbr xmp".split(
      " "
    ), v = "applet caption html table td th marquee object template foreignObject desc title".split(
      " "
    ), A = v.concat(["button"]), j = "dd dt li option optgroup p rp rt".split(" "), V = {
      current: null,
      formTag: null,
      aTagInScope: null,
      buttonTagInScope: null,
      nobrTagInScope: null,
      pTagInButtonScope: null,
      listItemTagAutoclosing: null,
      dlItemTagAutoclosing: null,
      containerTagInScope: null,
      implicitRootScope: !1
    }, k = {}, q = {
      animation: "animationDelay animationDirection animationDuration animationFillMode animationIterationCount animationName animationPlayState animationTimingFunction".split(
        " "
      ),
      background: "backgroundAttachment backgroundClip backgroundColor backgroundImage backgroundOrigin backgroundPositionX backgroundPositionY backgroundRepeat backgroundSize".split(
        " "
      ),
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: "borderBottomColor borderBottomStyle borderBottomWidth borderImageOutset borderImageRepeat borderImageSlice borderImageSource borderImageWidth borderLeftColor borderLeftStyle borderLeftWidth borderRightColor borderRightStyle borderRightWidth borderTopColor borderTopStyle borderTopWidth".split(
        " "
      ),
      borderBlockEnd: [
        "borderBlockEndColor",
        "borderBlockEndStyle",
        "borderBlockEndWidth"
      ],
      borderBlockStart: [
        "borderBlockStartColor",
        "borderBlockStartStyle",
        "borderBlockStartWidth"
      ],
      borderBottom: [
        "borderBottomColor",
        "borderBottomStyle",
        "borderBottomWidth"
      ],
      borderColor: [
        "borderBottomColor",
        "borderLeftColor",
        "borderRightColor",
        "borderTopColor"
      ],
      borderImage: [
        "borderImageOutset",
        "borderImageRepeat",
        "borderImageSlice",
        "borderImageSource",
        "borderImageWidth"
      ],
      borderInlineEnd: [
        "borderInlineEndColor",
        "borderInlineEndStyle",
        "borderInlineEndWidth"
      ],
      borderInlineStart: [
        "borderInlineStartColor",
        "borderInlineStartStyle",
        "borderInlineStartWidth"
      ],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: [
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
        "borderTopLeftRadius",
        "borderTopRightRadius"
      ],
      borderRight: [
        "borderRightColor",
        "borderRightStyle",
        "borderRightWidth"
      ],
      borderStyle: [
        "borderBottomStyle",
        "borderLeftStyle",
        "borderRightStyle",
        "borderTopStyle"
      ],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: [
        "borderBottomWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth"
      ],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: "fontFamily fontFeatureSettings fontKerning fontLanguageOverride fontSize fontSizeAdjust fontStretch fontStyle fontVariant fontVariantAlternates fontVariantCaps fontVariantEastAsian fontVariantLigatures fontVariantNumeric fontVariantPosition fontWeight lineHeight".split(
        " "
      ),
      fontVariant: "fontVariantAlternates fontVariantCaps fontVariantEastAsian fontVariantLigatures fontVariantNumeric fontVariantPosition".split(
        " "
      ),
      gap: ["columnGap", "rowGap"],
      grid: "gridAutoColumns gridAutoFlow gridAutoRows gridTemplateAreas gridTemplateColumns gridTemplateRows".split(
        " "
      ),
      gridArea: [
        "gridColumnEnd",
        "gridColumnStart",
        "gridRowEnd",
        "gridRowStart"
      ],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: [
        "gridTemplateAreas",
        "gridTemplateColumns",
        "gridTemplateRows"
      ],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: "maskClip maskComposite maskImage maskMode maskOrigin maskPositionX maskPositionY maskRepeat maskSize".split(
        " "
      ),
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: [
        "textDecorationColor",
        "textDecorationLine",
        "textDecorationStyle"
      ],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: [
        "transitionDelay",
        "transitionDuration",
        "transitionProperty",
        "transitionTimingFunction"
      ],
      wordWrap: ["overflowWrap"]
    }, X = /([A-Z])/g, he = /^ms-/, Me = /^(?:webkit|moz|o)[A-Z]/, Bt = /^-ms-/, H = /-(.)/g, z = /;\s*$/, B = {}, $ = {}, Te = !1, ht = !1, ge = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " "
      )
    ), Ve = "http://www.w3.org/1998/Math/MathML", ke = "http://www.w3.org/2000/svg", St = /* @__PURE__ */ new Map([
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
    ]), Pn = {
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      fetchpriority: "fetchPriority",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      inert: "inert",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      popover: "popover",
      popovertarget: "popoverTarget",
      popovertargetaction: "popoverTargetAction",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      transformorigin: "transformOrigin",
      "transform-origin": "transformOrigin",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, Jg = {
      "aria-current": 0,
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      "aria-hidden": 0,
      "aria-invalid": 0,
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0,
      "aria-braillelabel": 0,
      "aria-brailleroledescription": 0,
      "aria-colindextext": 0,
      "aria-rowindextext": 0
    }, Lh = {}, uE = RegExp(
      "^(aria)-[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ), iE = RegExp(
      "^(aria)[A-Z][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ), OS = !1, nn = {}, RS = /^on./, cE = /^on[^A-Z]/, oE = RegExp(
      "^(aria)-[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ), fE = RegExp(
      "^(aria)[A-Z][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ), rE = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i, Op = null, Xh = null, Qh = null, r1 = !1, dc = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), s1 = !1;
    if (dc)
      try {
        var Rp = {};
        Object.defineProperty(Rp, "passive", {
          get: function() {
            s1 = !0;
          }
        }), window.addEventListener("test", Rp, Rp), window.removeEventListener("test", Rp, Rp);
      } catch {
        s1 = !1;
      }
    var Lf = null, d1 = null, Kg = null, _s = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, $g = Hl(_s), zp = Ie({}, _s, { view: 0, detail: 0 }), sE = Hl(zp), h1, m1, Dp, kg = Ie({}, zp, {
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
      getModifierState: vr,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (e !== Dp && (Dp && e.type === "mousemove" ? (h1 = e.screenX - Dp.screenX, m1 = e.screenY - Dp.screenY) : m1 = h1 = 0, Dp = e), h1);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : m1;
      }
    }), zS = Hl(kg), dE = Ie({}, kg, { dataTransfer: 0 }), hE = Hl(dE), mE = Ie({}, zp, { relatedTarget: 0 }), y1 = Hl(mE), yE = Ie({}, _s, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), pE = Hl(yE), gE = Ie({}, _s, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), vE = Hl(gE), SE = Ie({}, _s, { data: 0 }), DS = Hl(
      SE
    ), bE = DS, EE = {
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
    }, TE = {
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
    }, AE = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    }, OE = Ie({}, zp, {
      key: function(e) {
        if (e.key) {
          var t = EE[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress" ? (e = gr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? TE[e.keyCode] || "Unidentified" : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: vr,
      charCode: function(e) {
        return e.type === "keypress" ? gr(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? gr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), RE = Hl(OE), zE = Ie({}, kg, {
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
    }), _S = Hl(zE), DE = Ie({}, zp, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: vr
    }), _E = Hl(DE), ME = Ie({}, _s, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), CE = Hl(ME), UE = Ie({}, kg, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }), HE = Hl(UE), NE = Ie({}, _s, {
      newState: 0,
      oldState: 0
    }), BE = Hl(NE), YE = [9, 13, 27, 32], MS = 229, p1 = dc && "CompositionEvent" in window, _p = null;
    dc && "documentMode" in document && (_p = document.documentMode);
    var jE = dc && "TextEvent" in window && !_p, CS = dc && (!p1 || _p && 8 < _p && 11 >= _p), US = 32, HS = String.fromCharCode(US), NS = !1, Vh = !1, qE = {
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
    }, Mp = null, Cp = null, BS = !1;
    dc && (BS = sd("input") && (!document.documentMode || 9 < document.documentMode));
    var un = typeof Object.is == "function" ? Object.is : dd, xE = dc && "documentMode" in document && 11 >= document.documentMode, Zh = null, g1 = null, Up = null, v1 = !1, Jh = {
      animationend: zc("Animation", "AnimationEnd"),
      animationiteration: zc("Animation", "AnimationIteration"),
      animationstart: zc("Animation", "AnimationStart"),
      transitionrun: zc("Transition", "TransitionRun"),
      transitionstart: zc("Transition", "TransitionStart"),
      transitioncancel: zc("Transition", "TransitionCancel"),
      transitionend: zc("Transition", "TransitionEnd")
    }, S1 = {}, YS = {};
    dc && (YS = document.createElement("div").style, "AnimationEvent" in window || (delete Jh.animationend.animation, delete Jh.animationiteration.animation, delete Jh.animationstart.animation), "TransitionEvent" in window || delete Jh.transitionend.transition);
    var jS = Dc("animationend"), qS = Dc("animationiteration"), xS = Dc("animationstart"), wE = Dc("transitionrun"), GE = Dc("transitionstart"), LE = Dc("transitioncancel"), wS = Dc("transitionend"), GS = /* @__PURE__ */ new Map(), b1 = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " "
    );
    b1.push("scrollEnd");
    var LS = 0;
    if (typeof performance == "object" && typeof performance.now == "function")
      var XE = performance, XS = function() {
        return XE.now();
      };
    else {
      var QE = Date;
      XS = function() {
        return QE.now();
      };
    }
    var E1 = typeof reportError == "function" ? reportError : function(e) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var t = new window.ErrorEvent("error", {
          bubbles: !0,
          cancelable: !0,
          message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
          error: e
        });
        if (!window.dispatchEvent(t)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", e);
        return;
      }
      console.error(e);
    }, VE = "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.", Wg = 0, T1 = 1, A1 = 2, O1 = 3, Fg = "– ", Ig = "+ ", QS = "  ", el = typeof console < "u" && typeof console.timeStamp == "function" && typeof performance < "u" && typeof performance.measure == "function", wu = "Components ⚛", rt = "Scheduler ⚛", dt = "Blocking", Xf = !1, ho = {
      color: "primary",
      properties: null,
      tooltipText: "",
      track: wu
    }, Qf = {
      start: -0,
      end: -0,
      detail: { devtools: ho }
    }, ZE = ["Changed Props", ""], VS = "This component received deeply equal props. It might benefit from useMemo or the React Compiler in its owner.", JE = ["Changed Props", VS], Hp = 1, mo = 2, Gu = [], Kh = 0, R1 = 0, Vf = {};
    Object.freeze(Vf);
    var Lu = null, $h = null, Ne = 0, KE = 1, Pe = 2, Ba = 8, bi = 16, $E = 32, ZS = !1;
    try {
      var JS = Object.preventExtensions({});
    } catch {
      ZS = !0;
    }
    var z1 = /* @__PURE__ */ new WeakMap(), kh = [], Wh = 0, Pg = null, Np = 0, Xu = [], Qu = 0, Ms = null, yo = 1, po = "", Ra = null, tl = null, ft = !1, hc = !1, eu = null, Zf = null, Vu = !1, D1 = Error(
      "Hydration Mismatch Exception: This is not a real error, and should not leak into userspace. If you're seeing this, it's likely a bug in React."
    ), _1 = xt(null), M1 = xt(null), KS = {}, ev = null, Fh = null, Ih = !1, kE = typeof AbortController < "u" ? AbortController : function() {
      var e = [], t = this.signal = {
        aborted: !1,
        addEventListener: function(a, i) {
          e.push(i);
        }
      };
      this.abort = function() {
        t.aborted = !0, e.forEach(function(a) {
          return a();
        });
      };
    }, WE = pl.unstable_scheduleCallback, FE = pl.unstable_NormalPriority, Gl = {
      $$typeof: Fn,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
      _currentRenderer: null,
      _currentRenderer2: null
    }, Ll = pl.unstable_now, tv = console.createTask ? console.createTask : function() {
      return null;
    }, Bp = 1, lv = 2, ia = -0, Jf = -0, go = -0, vo = null, cn = -1.1, Cs = -0, rl = -0, ze = -1.1, Ue = -1.1, il = null, gl = !1, Us = -0, mc = -1.1, Yp = null, Kf = 0, C1 = null, U1 = null, Hs = -1.1, jp = null, Ph = -1.1, av = -1.1, So = -0, bo = -1.1, Zu = -1.1, H1 = 0, qp = null, $S = null, kS = null, $f = -1.1, Ns = null, kf = -1.1, nv = -1.1, WS = -0, FS = -0, uv = 0, IE = null, IS = 0, xp = -1.1, iv = !1, cv = !1, wp = null, N1 = 0, Bs = 0, em = null, PS = L.S;
    L.S = function(e, t) {
      if ($b = wl(), typeof t == "object" && t !== null && typeof t.then == "function") {
        if (0 > bo && 0 > Zu) {
          bo = Ll();
          var a = Tf(), i = Nu();
          (a !== kf || i !== Ns) && (kf = -1.1), $f = a, Ns = i;
        }
        li(e, t);
      }
      PS !== null && PS(e, t);
    };
    var Ys = xt(null), Ei = {
      recordUnsafeLifecycleWarnings: function() {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function() {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    }, Gp = [], Lp = [], Xp = [], Qp = [], Vp = [], Zp = [], js = /* @__PURE__ */ new Set();
    Ei.recordUnsafeLifecycleWarnings = function(e, t) {
      js.has(e.type) || (typeof t.componentWillMount == "function" && t.componentWillMount.__suppressDeprecationWarning !== !0 && Gp.push(e), e.mode & Ba && typeof t.UNSAFE_componentWillMount == "function" && Lp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && Xp.push(e), e.mode & Ba && typeof t.UNSAFE_componentWillReceiveProps == "function" && Qp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && Vp.push(e), e.mode & Ba && typeof t.UNSAFE_componentWillUpdate == "function" && Zp.push(e));
    }, Ei.flushPendingUnsafeLifecycleWarnings = function() {
      var e = /* @__PURE__ */ new Set();
      0 < Gp.length && (Gp.forEach(function(h) {
        e.add(
          re(h) || "Component"
        ), js.add(h.type);
      }), Gp = []);
      var t = /* @__PURE__ */ new Set();
      0 < Lp.length && (Lp.forEach(function(h) {
        t.add(
          re(h) || "Component"
        ), js.add(h.type);
      }), Lp = []);
      var a = /* @__PURE__ */ new Set();
      0 < Xp.length && (Xp.forEach(function(h) {
        a.add(
          re(h) || "Component"
        ), js.add(h.type);
      }), Xp = []);
      var i = /* @__PURE__ */ new Set();
      0 < Qp.length && (Qp.forEach(
        function(h) {
          i.add(
            re(h) || "Component"
          ), js.add(h.type);
        }
      ), Qp = []);
      var o = /* @__PURE__ */ new Set();
      0 < Vp.length && (Vp.forEach(function(h) {
        o.add(
          re(h) || "Component"
        ), js.add(h.type);
      }), Vp = []);
      var f = /* @__PURE__ */ new Set();
      if (0 < Zp.length && (Zp.forEach(function(h) {
        f.add(
          re(h) || "Component"
        ), js.add(h.type);
      }), Zp = []), 0 < t.size) {
        var d = w(
          t
        );
        console.error(
          `Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`,
          d
        );
      }
      0 < i.size && (d = w(
        i
      ), console.error(
        `Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state

Please update the following components: %s`,
        d
      )), 0 < f.size && (d = w(
        f
      ), console.error(
        `Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`,
        d
      )), 0 < e.size && (d = w(e), console.warn(
        `componentWillMount has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`,
        d
      )), 0 < a.size && (d = w(
        a
      ), console.warn(
        `componentWillReceiveProps has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`,
        d
      )), 0 < o.size && (d = w(o), console.warn(
        `componentWillUpdate has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`,
        d
      ));
    };
    var ov = /* @__PURE__ */ new Map(), eb = /* @__PURE__ */ new Set();
    Ei.recordLegacyContextWarning = function(e, t) {
      for (var a = null, i = e; i !== null; )
        i.mode & Ba && (a = i), i = i.return;
      a === null ? console.error(
        "Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue."
      ) : !eb.has(e.type) && (i = ov.get(a), e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], ov.set(a, i)), i.push(e));
    }, Ei.flushLegacyContextWarning = function() {
      ov.forEach(function(e) {
        if (e.length !== 0) {
          var t = e[0], a = /* @__PURE__ */ new Set();
          e.forEach(function(o) {
            a.add(re(o) || "Component"), eb.add(o.type);
          });
          var i = w(a);
          se(t, function() {
            console.error(
              `Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://react.dev/link/legacy-context`,
              i
            );
          });
        }
      });
    }, Ei.discardPendingWarnings = function() {
      Gp = [], Lp = [], Xp = [], Qp = [], Vp = [], Zp = [], ov = /* @__PURE__ */ new Map();
    };
    var tb = {
      react_stack_bottom_frame: function(e, t, a) {
        var i = Yu;
        Yu = !0;
        try {
          return e(t, a);
        } finally {
          Yu = i;
        }
      }
    }, B1 = tb.react_stack_bottom_frame.bind(tb), lb = {
      react_stack_bottom_frame: function(e) {
        var t = Yu;
        Yu = !0;
        try {
          return e.render();
        } finally {
          Yu = t;
        }
      }
    }, ab = lb.react_stack_bottom_frame.bind(lb), nb = {
      react_stack_bottom_frame: function(e, t) {
        try {
          t.componentDidMount();
        } catch (a) {
          $e(e, e.return, a);
        }
      }
    }, Y1 = nb.react_stack_bottom_frame.bind(
      nb
    ), ub = {
      react_stack_bottom_frame: function(e, t, a, i, o) {
        try {
          t.componentDidUpdate(a, i, o);
        } catch (f) {
          $e(e, e.return, f);
        }
      }
    }, ib = ub.react_stack_bottom_frame.bind(
      ub
    ), cb = {
      react_stack_bottom_frame: function(e, t) {
        var a = t.stack;
        e.componentDidCatch(t.value, {
          componentStack: a !== null ? a : ""
        });
      }
    }, PE = cb.react_stack_bottom_frame.bind(
      cb
    ), ob = {
      react_stack_bottom_frame: function(e, t, a) {
        try {
          a.componentWillUnmount();
        } catch (i) {
          $e(e, t, i);
        }
      }
    }, fb = ob.react_stack_bottom_frame.bind(
      ob
    ), rb = {
      react_stack_bottom_frame: function(e) {
        var t = e.create;
        return e = e.inst, t = t(), e.destroy = t;
      }
    }, eT = rb.react_stack_bottom_frame.bind(rb), sb = {
      react_stack_bottom_frame: function(e, t, a) {
        try {
          a();
        } catch (i) {
          $e(e, t, i);
        }
      }
    }, tT = sb.react_stack_bottom_frame.bind(sb), db = {
      react_stack_bottom_frame: function(e) {
        var t = e._init;
        return t(e._payload);
      }
    }, lT = db.react_stack_bottom_frame.bind(db), tm = Error(
      "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
    ), j1 = Error(
      "Suspense Exception: This is not a real error, and should not leak into userspace. If you're seeing this, it's likely a bug in React."
    ), fv = Error(
      "Suspense Exception: This is not a real error! It's an implementation detail of `useActionState` to interrupt the current render. You must either rethrow it immediately, or move the `useActionState` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary."
    ), rv = {
      then: function() {
        console.error(
          'Internal React error: A listener was unexpectedly attached to a "noop" thenable. This is a bug in React. Please file an issue.'
        );
      }
    }, qs = null, Jp = !1, lm = null, Kp = 0, et = null, q1, hb = q1 = !1, mb = {}, yb = {}, pb = {};
    Ae = function(e, t, a) {
      if (a !== null && typeof a == "object" && a._store && (!a._store.validated && a.key == null || a._store.validated === 2)) {
        if (typeof a._store != "object")
          throw Error(
            "React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue."
          );
        a._store.validated = 1;
        var i = re(e), o = i || "null";
        if (!mb[o]) {
          mb[o] = !0, a = a._owner, e = e._debugOwner;
          var f = "";
          e && typeof e.tag == "number" && (o = re(e)) && (f = `

Check the render method of \`` + o + "`."), f || i && (f = `

Check the top-level render call using <` + i + ">.");
          var d = "";
          a != null && e !== a && (i = null, typeof a.tag == "number" ? i = re(a) : typeof a.name == "string" && (i = a.name), i && (d = " It was passed a child from " + i + ".")), se(t, function() {
            console.error(
              'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
              f,
              d
            );
          });
        }
      }
    };
    var xs = Bl(!0), gb = Bl(!1), vb = 0, Sb = 1, bb = 2, x1 = 3, Wf = !1, Eb = !1, w1 = null, G1 = !1, am = xt(null), sv = xt(0), tu = xt(null), Ju = null, nm = 1, $p = 2, Ml = xt(0), dv = 0, Ku = 1, on = 2, lu = 4, fn = 8, um, Tb = /* @__PURE__ */ new Set(), Ab = /* @__PURE__ */ new Set(), L1 = /* @__PURE__ */ new Set(), Ob = /* @__PURE__ */ new Set(), Eo = 0, qe = null, Qt = null, Xl = null, hv = !1, im = !1, ws = !1, mv = 0, kp = 0, To = null, aT = 0, nT = 25, G = null, $u = null, Ao = -1, Wp = !1, Fp = {
      readContext: Et,
      use: ii,
      useCallback: ol,
      useContext: ol,
      useEffect: ol,
      useImperativeHandle: ol,
      useLayoutEffect: ol,
      useInsertionEffect: ol,
      useMemo: ol,
      useReducer: ol,
      useRef: ol,
      useState: ol,
      useDebugValue: ol,
      useDeferredValue: ol,
      useTransition: ol,
      useSyncExternalStore: ol,
      useId: ol,
      useHostTransitionStatus: ol,
      useFormState: ol,
      useActionState: ol,
      useOptimistic: ol,
      useMemoCache: ol,
      useCacheRefresh: ol
    };
    Fp.useEffectEvent = ol;
    var X1 = null, Rb = null, Q1 = null, zb = null, yc = null, Ti = null, yv = null;
    X1 = {
      readContext: function(e) {
        return Et(e);
      },
      use: ii,
      useCallback: function(e, t) {
        return G = "useCallback", je(), ui(t), Nd(e, t);
      },
      useContext: function(e) {
        return G = "useContext", je(), Et(e);
      },
      useEffect: function(e, t) {
        return G = "useEffect", je(), ui(t), Vc(e, t);
      },
      useImperativeHandle: function(e, t, a) {
        return G = "useImperativeHandle", je(), ui(a), Eu(e, t, a);
      },
      useInsertionEffect: function(e, t) {
        G = "useInsertionEffect", je(), ui(t), Wi(4, on, e, t);
      },
      useLayoutEffect: function(e, t) {
        return G = "useLayoutEffect", je(), ui(t), ya(e, t);
      },
      useMemo: function(e, t) {
        G = "useMemo", je(), ui(t);
        var a = L.H;
        L.H = yc;
        try {
          return pa(e, t);
        } finally {
          L.H = a;
        }
      },
      useReducer: function(e, t, a) {
        G = "useReducer", je();
        var i = L.H;
        L.H = yc;
        try {
          return Fo(e, t, a);
        } finally {
          L.H = i;
        }
      },
      useRef: function(e) {
        return G = "useRef", je(), Hd(e);
      },
      useState: function(e) {
        G = "useState", je();
        var t = L.H;
        L.H = yc;
        try {
          return Ji(e);
        } finally {
          L.H = t;
        }
      },
      useDebugValue: function() {
        G = "useDebugValue", je();
      },
      useDeferredValue: function(e, t) {
        return G = "useDeferredValue", je(), lf(e, t);
      },
      useTransition: function() {
        return G = "useTransition", je(), Fi();
      },
      useSyncExternalStore: function(e, t, a) {
        return G = "useSyncExternalStore", je(), Io(
          e,
          t,
          a
        );
      },
      useId: function() {
        return G = "useId", je(), Xr();
      },
      useFormState: function(e, t) {
        return G = "useFormState", je(), Ur(), ka(e, t);
      },
      useActionState: function(e, t) {
        return G = "useActionState", je(), ka(e, t);
      },
      useOptimistic: function(e) {
        return G = "useOptimistic", je(), Qc(e);
      },
      useHostTransitionStatus: ri,
      useMemoCache: Ka,
      useCacheRefresh: function() {
        return G = "useCacheRefresh", je(), Bd();
      },
      useEffectEvent: function(e) {
        return G = "useEffectEvent", je(), Gr(e);
      }
    }, Rb = {
      readContext: function(e) {
        return Et(e);
      },
      use: ii,
      useCallback: function(e, t) {
        return G = "useCallback", W(), Nd(e, t);
      },
      useContext: function(e) {
        return G = "useContext", W(), Et(e);
      },
      useEffect: function(e, t) {
        return G = "useEffect", W(), Vc(e, t);
      },
      useImperativeHandle: function(e, t, a) {
        return G = "useImperativeHandle", W(), Eu(e, t, a);
      },
      useInsertionEffect: function(e, t) {
        G = "useInsertionEffect", W(), Wi(4, on, e, t);
      },
      useLayoutEffect: function(e, t) {
        return G = "useLayoutEffect", W(), ya(e, t);
      },
      useMemo: function(e, t) {
        G = "useMemo", W();
        var a = L.H;
        L.H = yc;
        try {
          return pa(e, t);
        } finally {
          L.H = a;
        }
      },
      useReducer: function(e, t, a) {
        G = "useReducer", W();
        var i = L.H;
        L.H = yc;
        try {
          return Fo(e, t, a);
        } finally {
          L.H = i;
        }
      },
      useRef: function(e) {
        return G = "useRef", W(), Hd(e);
      },
      useState: function(e) {
        G = "useState", W();
        var t = L.H;
        L.H = yc;
        try {
          return Ji(e);
        } finally {
          L.H = t;
        }
      },
      useDebugValue: function() {
        G = "useDebugValue", W();
      },
      useDeferredValue: function(e, t) {
        return G = "useDeferredValue", W(), lf(e, t);
      },
      useTransition: function() {
        return G = "useTransition", W(), Fi();
      },
      useSyncExternalStore: function(e, t, a) {
        return G = "useSyncExternalStore", W(), Io(
          e,
          t,
          a
        );
      },
      useId: function() {
        return G = "useId", W(), Xr();
      },
      useActionState: function(e, t) {
        return G = "useActionState", W(), ka(e, t);
      },
      useFormState: function(e, t) {
        return G = "useFormState", W(), Ur(), ka(e, t);
      },
      useOptimistic: function(e) {
        return G = "useOptimistic", W(), Qc(e);
      },
      useHostTransitionStatus: ri,
      useMemoCache: Ka,
      useCacheRefresh: function() {
        return G = "useCacheRefresh", W(), Bd();
      },
      useEffectEvent: function(e) {
        return G = "useEffectEvent", W(), Gr(e);
      }
    }, Q1 = {
      readContext: function(e) {
        return Et(e);
      },
      use: ii,
      useCallback: function(e, t) {
        return G = "useCallback", W(), Xn(e, t);
      },
      useContext: function(e) {
        return G = "useContext", W(), Et(e);
      },
      useEffect: function(e, t) {
        G = "useEffect", W(), Rl(2048, fn, e, t);
      },
      useImperativeHandle: function(e, t, a) {
        return G = "useImperativeHandle", W(), tf(e, t, a);
      },
      useInsertionEffect: function(e, t) {
        return G = "useInsertionEffect", W(), Rl(4, on, e, t);
      },
      useLayoutEffect: function(e, t) {
        return G = "useLayoutEffect", W(), Rl(4, lu, e, t);
      },
      useMemo: function(e, t) {
        G = "useMemo", W();
        var a = L.H;
        L.H = Ti;
        try {
          return Ft(e, t);
        } finally {
          L.H = a;
        }
      },
      useReducer: function(e, t, a) {
        G = "useReducer", W();
        var i = L.H;
        L.H = Ti;
        try {
          return Gc(e, t, a);
        } finally {
          L.H = i;
        }
      },
      useRef: function() {
        return G = "useRef", W(), Rt().memoizedState;
      },
      useState: function() {
        G = "useState", W();
        var e = L.H;
        L.H = Ti;
        try {
          return Gc($a);
        } finally {
          L.H = e;
        }
      },
      useDebugValue: function() {
        G = "useDebugValue", W();
      },
      useDeferredValue: function(e, t) {
        return G = "useDeferredValue", W(), Tu(e, t);
      },
      useTransition: function() {
        return G = "useTransition", W(), V0();
      },
      useSyncExternalStore: function(e, t, a) {
        return G = "useSyncExternalStore", W(), Xc(
          e,
          t,
          a
        );
      },
      useId: function() {
        return G = "useId", W(), Rt().memoizedState;
      },
      useFormState: function(e) {
        return G = "useFormState", W(), Ur(), $i(e);
      },
      useActionState: function(e) {
        return G = "useActionState", W(), $i(e);
      },
      useOptimistic: function(e, t) {
        return G = "useOptimistic", W(), qr(e, t);
      },
      useHostTransitionStatus: ri,
      useMemoCache: Ka,
      useCacheRefresh: function() {
        return G = "useCacheRefresh", W(), Rt().memoizedState;
      },
      useEffectEvent: function(e) {
        return G = "useEffectEvent", W(), ef(e);
      }
    }, zb = {
      readContext: function(e) {
        return Et(e);
      },
      use: ii,
      useCallback: function(e, t) {
        return G = "useCallback", W(), Xn(e, t);
      },
      useContext: function(e) {
        return G = "useContext", W(), Et(e);
      },
      useEffect: function(e, t) {
        G = "useEffect", W(), Rl(2048, fn, e, t);
      },
      useImperativeHandle: function(e, t, a) {
        return G = "useImperativeHandle", W(), tf(e, t, a);
      },
      useInsertionEffect: function(e, t) {
        return G = "useInsertionEffect", W(), Rl(4, on, e, t);
      },
      useLayoutEffect: function(e, t) {
        return G = "useLayoutEffect", W(), Rl(4, lu, e, t);
      },
      useMemo: function(e, t) {
        G = "useMemo", W();
        var a = L.H;
        L.H = yv;
        try {
          return Ft(e, t);
        } finally {
          L.H = a;
        }
      },
      useReducer: function(e, t, a) {
        G = "useReducer", W();
        var i = L.H;
        L.H = yv;
        try {
          return Lc(e, t, a);
        } finally {
          L.H = i;
        }
      },
      useRef: function() {
        return G = "useRef", W(), Rt().memoizedState;
      },
      useState: function() {
        G = "useState", W();
        var e = L.H;
        L.H = yv;
        try {
          return Lc($a);
        } finally {
          L.H = e;
        }
      },
      useDebugValue: function() {
        G = "useDebugValue", W();
      },
      useDeferredValue: function(e, t) {
        return G = "useDeferredValue", W(), Je(e, t);
      },
      useTransition: function() {
        return G = "useTransition", W(), al();
      },
      useSyncExternalStore: function(e, t, a) {
        return G = "useSyncExternalStore", W(), Xc(
          e,
          t,
          a
        );
      },
      useId: function() {
        return G = "useId", W(), Rt().memoizedState;
      },
      useFormState: function(e) {
        return G = "useFormState", W(), Ur(), ki(e);
      },
      useActionState: function(e) {
        return G = "useActionState", W(), ki(e);
      },
      useOptimistic: function(e, t) {
        return G = "useOptimistic", W(), xr(e, t);
      },
      useHostTransitionStatus: ri,
      useMemoCache: Ka,
      useCacheRefresh: function() {
        return G = "useCacheRefresh", W(), Rt().memoizedState;
      },
      useEffectEvent: function(e) {
        return G = "useEffectEvent", W(), ef(e);
      }
    }, yc = {
      readContext: function(e) {
        return le(), Et(e);
      },
      use: function(e) {
        return F(), ii(e);
      },
      useCallback: function(e, t) {
        return G = "useCallback", F(), je(), Nd(e, t);
      },
      useContext: function(e) {
        return G = "useContext", F(), je(), Et(e);
      },
      useEffect: function(e, t) {
        return G = "useEffect", F(), je(), Vc(e, t);
      },
      useImperativeHandle: function(e, t, a) {
        return G = "useImperativeHandle", F(), je(), Eu(e, t, a);
      },
      useInsertionEffect: function(e, t) {
        G = "useInsertionEffect", F(), je(), Wi(4, on, e, t);
      },
      useLayoutEffect: function(e, t) {
        return G = "useLayoutEffect", F(), je(), ya(e, t);
      },
      useMemo: function(e, t) {
        G = "useMemo", F(), je();
        var a = L.H;
        L.H = yc;
        try {
          return pa(e, t);
        } finally {
          L.H = a;
        }
      },
      useReducer: function(e, t, a) {
        G = "useReducer", F(), je();
        var i = L.H;
        L.H = yc;
        try {
          return Fo(e, t, a);
        } finally {
          L.H = i;
        }
      },
      useRef: function(e) {
        return G = "useRef", F(), je(), Hd(e);
      },
      useState: function(e) {
        G = "useState", F(), je();
        var t = L.H;
        L.H = yc;
        try {
          return Ji(e);
        } finally {
          L.H = t;
        }
      },
      useDebugValue: function() {
        G = "useDebugValue", F(), je();
      },
      useDeferredValue: function(e, t) {
        return G = "useDeferredValue", F(), je(), lf(e, t);
      },
      useTransition: function() {
        return G = "useTransition", F(), je(), Fi();
      },
      useSyncExternalStore: function(e, t, a) {
        return G = "useSyncExternalStore", F(), je(), Io(
          e,
          t,
          a
        );
      },
      useId: function() {
        return G = "useId", F(), je(), Xr();
      },
      useFormState: function(e, t) {
        return G = "useFormState", F(), je(), ka(e, t);
      },
      useActionState: function(e, t) {
        return G = "useActionState", F(), je(), ka(e, t);
      },
      useOptimistic: function(e) {
        return G = "useOptimistic", F(), je(), Qc(e);
      },
      useMemoCache: function(e) {
        return F(), Ka(e);
      },
      useHostTransitionStatus: ri,
      useCacheRefresh: function() {
        return G = "useCacheRefresh", je(), Bd();
      },
      useEffectEvent: function(e) {
        return G = "useEffectEvent", F(), je(), Gr(e);
      }
    }, Ti = {
      readContext: function(e) {
        return le(), Et(e);
      },
      use: function(e) {
        return F(), ii(e);
      },
      useCallback: function(e, t) {
        return G = "useCallback", F(), W(), Xn(e, t);
      },
      useContext: function(e) {
        return G = "useContext", F(), W(), Et(e);
      },
      useEffect: function(e, t) {
        G = "useEffect", F(), W(), Rl(2048, fn, e, t);
      },
      useImperativeHandle: function(e, t, a) {
        return G = "useImperativeHandle", F(), W(), tf(e, t, a);
      },
      useInsertionEffect: function(e, t) {
        return G = "useInsertionEffect", F(), W(), Rl(4, on, e, t);
      },
      useLayoutEffect: function(e, t) {
        return G = "useLayoutEffect", F(), W(), Rl(4, lu, e, t);
      },
      useMemo: function(e, t) {
        G = "useMemo", F(), W();
        var a = L.H;
        L.H = Ti;
        try {
          return Ft(e, t);
        } finally {
          L.H = a;
        }
      },
      useReducer: function(e, t, a) {
        G = "useReducer", F(), W();
        var i = L.H;
        L.H = Ti;
        try {
          return Gc(e, t, a);
        } finally {
          L.H = i;
        }
      },
      useRef: function() {
        return G = "useRef", F(), W(), Rt().memoizedState;
      },
      useState: function() {
        G = "useState", F(), W();
        var e = L.H;
        L.H = Ti;
        try {
          return Gc($a);
        } finally {
          L.H = e;
        }
      },
      useDebugValue: function() {
        G = "useDebugValue", F(), W();
      },
      useDeferredValue: function(e, t) {
        return G = "useDeferredValue", F(), W(), Tu(e, t);
      },
      useTransition: function() {
        return G = "useTransition", F(), W(), V0();
      },
      useSyncExternalStore: function(e, t, a) {
        return G = "useSyncExternalStore", F(), W(), Xc(
          e,
          t,
          a
        );
      },
      useId: function() {
        return G = "useId", F(), W(), Rt().memoizedState;
      },
      useFormState: function(e) {
        return G = "useFormState", F(), W(), $i(e);
      },
      useActionState: function(e) {
        return G = "useActionState", F(), W(), $i(e);
      },
      useOptimistic: function(e, t) {
        return G = "useOptimistic", F(), W(), qr(e, t);
      },
      useMemoCache: function(e) {
        return F(), Ka(e);
      },
      useHostTransitionStatus: ri,
      useCacheRefresh: function() {
        return G = "useCacheRefresh", W(), Rt().memoizedState;
      },
      useEffectEvent: function(e) {
        return G = "useEffectEvent", F(), W(), ef(e);
      }
    }, yv = {
      readContext: function(e) {
        return le(), Et(e);
      },
      use: function(e) {
        return F(), ii(e);
      },
      useCallback: function(e, t) {
        return G = "useCallback", F(), W(), Xn(e, t);
      },
      useContext: function(e) {
        return G = "useContext", F(), W(), Et(e);
      },
      useEffect: function(e, t) {
        G = "useEffect", F(), W(), Rl(2048, fn, e, t);
      },
      useImperativeHandle: function(e, t, a) {
        return G = "useImperativeHandle", F(), W(), tf(e, t, a);
      },
      useInsertionEffect: function(e, t) {
        return G = "useInsertionEffect", F(), W(), Rl(4, on, e, t);
      },
      useLayoutEffect: function(e, t) {
        return G = "useLayoutEffect", F(), W(), Rl(4, lu, e, t);
      },
      useMemo: function(e, t) {
        G = "useMemo", F(), W();
        var a = L.H;
        L.H = Ti;
        try {
          return Ft(e, t);
        } finally {
          L.H = a;
        }
      },
      useReducer: function(e, t, a) {
        G = "useReducer", F(), W();
        var i = L.H;
        L.H = Ti;
        try {
          return Lc(e, t, a);
        } finally {
          L.H = i;
        }
      },
      useRef: function() {
        return G = "useRef", F(), W(), Rt().memoizedState;
      },
      useState: function() {
        G = "useState", F(), W();
        var e = L.H;
        L.H = Ti;
        try {
          return Lc($a);
        } finally {
          L.H = e;
        }
      },
      useDebugValue: function() {
        G = "useDebugValue", F(), W();
      },
      useDeferredValue: function(e, t) {
        return G = "useDeferredValue", F(), W(), Je(e, t);
      },
      useTransition: function() {
        return G = "useTransition", F(), W(), al();
      },
      useSyncExternalStore: function(e, t, a) {
        return G = "useSyncExternalStore", F(), W(), Xc(
          e,
          t,
          a
        );
      },
      useId: function() {
        return G = "useId", F(), W(), Rt().memoizedState;
      },
      useFormState: function(e) {
        return G = "useFormState", F(), W(), ki(e);
      },
      useActionState: function(e) {
        return G = "useActionState", F(), W(), ki(e);
      },
      useOptimistic: function(e, t) {
        return G = "useOptimistic", F(), W(), xr(e, t);
      },
      useMemoCache: function(e) {
        return F(), Ka(e);
      },
      useHostTransitionStatus: ri,
      useCacheRefresh: function() {
        return G = "useCacheRefresh", W(), Rt().memoizedState;
      },
      useEffectEvent: function(e) {
        return G = "useEffectEvent", F(), W(), ef(e);
      }
    };
    var Db = {}, _b = /* @__PURE__ */ new Set(), Mb = /* @__PURE__ */ new Set(), Cb = /* @__PURE__ */ new Set(), Ub = /* @__PURE__ */ new Set(), Hb = /* @__PURE__ */ new Set(), Nb = /* @__PURE__ */ new Set(), Bb = /* @__PURE__ */ new Set(), Yb = /* @__PURE__ */ new Set(), jb = /* @__PURE__ */ new Set(), qb = /* @__PURE__ */ new Set();
    Object.freeze(Db);
    var V1 = {
      enqueueSetState: function(e, t, a) {
        e = e._reactInternals;
        var i = aa(e), o = Ol(i);
        o.payload = t, a != null && ($c(a), o.callback = a), t = gu(e, o, i), t !== null && (mu(i, "this.setState()", e), Be(t, e, i), bn(t, e, i));
      },
      enqueueReplaceState: function(e, t, a) {
        e = e._reactInternals;
        var i = aa(e), o = Ol(i);
        o.tag = Sb, o.payload = t, a != null && ($c(a), o.callback = a), t = gu(e, o, i), t !== null && (mu(i, "this.replaceState()", e), Be(t, e, i), bn(t, e, i));
      },
      enqueueForceUpdate: function(e, t) {
        e = e._reactInternals;
        var a = aa(e), i = Ol(a);
        i.tag = bb, t != null && ($c(t), i.callback = t), t = gu(e, i, a), t !== null && (mu(a, "this.forceUpdate()", e), Be(t, e, a), bn(t, e, a));
      }
    }, cm = null, Z1 = null, J1 = Error(
      "This is not a real error. It's an implementation detail of React's selective hydration feature. If this leaks into userspace, it's a bug in React. Please file an issue."
    ), Ql = !1, xb = {}, wb = {}, Gb = {}, Lb = {}, om = !1, Xb = {}, pv = {}, K1 = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null
    }, Qb = !1, Vb = null;
    Vb = /* @__PURE__ */ new Set();
    var Oo = !1, Vl = !1, $1 = !1, Zb = typeof WeakSet == "function" ? WeakSet : Set, ca = null, fm = null, rm = null, Zl = null, zn = !1, Ai = null, Fl = !1, Ip = 8192, uT = {
      getCacheForType: function(e) {
        var t = Et(Gl), a = t.data.get(e);
        return a === void 0 && (a = e(), t.data.set(e, a)), a;
      },
      cacheSignal: function() {
        return Et(Gl).controller.signal;
      },
      getOwner: function() {
        return Na;
      }
    };
    if (typeof Symbol == "function" && Symbol.for) {
      var Pp = Symbol.for;
      Pp("selector.component"), Pp("selector.has_pseudo_class"), Pp("selector.role"), Pp("selector.test_id"), Pp("selector.text");
    }
    var iT = [], cT = typeof WeakMap == "function" ? WeakMap : Map, oa = 0, Il = 2, au = 4, Ro = 0, e0 = 1, Gs = 2, gv = 3, Ff = 4, vv = 6, Jb = 5, mt = oa, Vt = null, nt = null, tt = 0, Dn = 0, Sv = 1, Ls = 2, t0 = 3, Kb = 4, k1 = 5, l0 = 6, bv = 7, W1 = 8, Xs = 9, Yt = Dn, nu = null, If = !1, sm = !1, F1 = !1, pc = 0, sl = Ro, Pf = 0, er = 0, I1 = 0, _n = 0, Qs = 0, a0 = null, rn = null, Ev = !1, Tv = 0, $b = 0, kb = 300, Av = 1 / 0, Wb = 500, n0 = null, Tl = null, tr = null, Ov = 0, P1 = 1, eS = 2, Fb = 3, lr = 0, Ib = 1, Pb = 2, e2 = 3, t2 = 4, Rv = 5, Jl = 0, ar = null, dm = null, Oi = 0, tS = 0, lS = -0, aS = null, l2 = null, a2 = null, Ri = Ov, n2 = null, oT = 50, u0 = 0, nS = null, uS = !1, zv = !1, fT = 50, Vs = 0, i0 = null, hm = !1, Dv = null, u2 = !1, i2 = /* @__PURE__ */ new Set(), rT = {}, _v = null, mm = null, iS = !1, cS = !1, Mv = !1, oS = !1, nr = 0, fS = {};
    (function() {
      for (var e = 0; e < b1.length; e++) {
        var t = b1[e], a = t.toLowerCase();
        t = t[0].toUpperCase() + t.slice(1), Hn(a, "on" + t);
      }
      Hn(jS, "onAnimationEnd"), Hn(qS, "onAnimationIteration"), Hn(xS, "onAnimationStart"), Hn("dblclick", "onDoubleClick"), Hn("focusin", "onFocus"), Hn("focusout", "onBlur"), Hn(wE, "onTransitionRun"), Hn(GE, "onTransitionStart"), Hn(LE, "onTransitionCancel"), Hn(wS, "onTransitionEnd");
    })(), Qe("onMouseEnter", ["mouseout", "mouseover"]), Qe("onMouseLeave", ["mouseout", "mouseover"]), Qe("onPointerEnter", ["pointerout", "pointerover"]), Qe("onPointerLeave", ["pointerout", "pointerover"]), lt(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " "
      )
    ), lt(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " "
      )
    ), lt("onBeforeInput", [
      "compositionend",
      "keypress",
      "textInput",
      "paste"
    ]), lt(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" ")
    ), lt(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" ")
    ), lt(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
    );
    var c0 = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " "
    ), rS = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(c0)
    ), Cv = "_reactListening" + Math.random().toString(36).slice(2), c2 = !1, o2 = !1, Uv = !1, f2 = !1, Hv = !1, Nv = !1, r2 = !1, Bv = {}, sT = /\r\n?/g, dT = /\u0000|\uFFFD/g, Zs = "http://www.w3.org/1999/xlink", sS = "http://www.w3.org/XML/1998/namespace", hT = "javascript:throw new Error('React form unexpectedly submitted.')", mT = "suppressHydrationWarning", Js = "&", Yv = "/&", o0 = "$", f0 = "/$", ur = "$?", Ks = "$~", ym = "$!", yT = "html", pT = "body", gT = "head", dS = "F!", s2 = "F", d2 = "loading", vT = "style", zo = 0, pm = 1, jv = 2, hS = null, mS = null, h2 = { dialog: !0, webview: !0 }, yS = null, r0 = void 0, m2 = typeof setTimeout == "function" ? setTimeout : void 0, ST = typeof clearTimeout == "function" ? clearTimeout : void 0, $s = -1, y2 = typeof Promise == "function" ? Promise : void 0, bT = typeof queueMicrotask == "function" ? queueMicrotask : typeof y2 < "u" ? function(e) {
      return y2.resolve(null).then(e).catch(dg);
    } : m2, pS = null, ks = 0, s0 = 1, p2 = 2, g2 = 3, ku = 4, Wu = /* @__PURE__ */ new Map(), v2 = /* @__PURE__ */ new Set(), Do = At.d;
    At.d = {
      f: function() {
        var e = Do.f(), t = en();
        return e || t;
      },
      r: function(e) {
        var t = ae(e);
        t !== null && t.tag === 5 && t.type === "form" ? af(t) : Do.r(e);
      },
      D: function(e) {
        Do.D(e), Iy("dns-prefetch", e, null);
      },
      C: function(e, t) {
        Do.C(e, t), Iy("preconnect", e, t);
      },
      L: function(e, t, a) {
        Do.L(e, t, a);
        var i = gm;
        if (i && e && t) {
          var o = 'link[rel="preload"][as="' + Ct(t) + '"]';
          t === "image" && a && a.imageSrcSet ? (o += '[imagesrcset="' + Ct(
            a.imageSrcSet
          ) + '"]', typeof a.imageSizes == "string" && (o += '[imagesizes="' + Ct(
            a.imageSizes
          ) + '"]')) : o += '[href="' + Ct(e) + '"]';
          var f = o;
          switch (t) {
            case "style":
              f = no(e);
              break;
            case "script":
              f = uo(e);
          }
          Wu.has(f) || (e = Ie(
            {
              rel: "preload",
              href: t === "image" && a && a.imageSrcSet ? void 0 : e,
              as: t
            },
            a
          ), Wu.set(f, e), i.querySelector(o) !== null || t === "style" && i.querySelector(
            ms(f)
          ) || t === "script" && i.querySelector(ys(f)) || (t = i.createElement("link"), It(t, "link", e), pe(t), i.head.appendChild(t)));
        }
      },
      m: function(e, t) {
        Do.m(e, t);
        var a = gm;
        if (a && e) {
          var i = t && typeof t.as == "string" ? t.as : "script", o = 'link[rel="modulepreload"][as="' + Ct(i) + '"][href="' + Ct(e) + '"]', f = o;
          switch (i) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              f = uo(e);
          }
          if (!Wu.has(f) && (e = Ie({ rel: "modulepreload", href: e }, t), Wu.set(f, e), a.querySelector(o) === null)) {
            switch (i) {
              case "audioworklet":
              case "paintworklet":
              case "serviceworker":
              case "sharedworker":
              case "worker":
              case "script":
                if (a.querySelector(ys(f)))
                  return;
            }
            i = a.createElement("link"), It(i, "link", e), pe(i), a.head.appendChild(i);
          }
        }
      },
      X: function(e, t) {
        Do.X(e, t);
        var a = gm;
        if (a && e) {
          var i = Ce(a).hoistableScripts, o = uo(e), f = i.get(o);
          f || (f = a.querySelector(
            ys(o)
          ), f || (e = Ie({ src: e, async: !0 }, t), (t = Wu.get(o)) && tp(e, t), f = a.createElement("script"), pe(f), It(f, "link", e), a.head.appendChild(f)), f = {
            type: "script",
            instance: f,
            count: 1,
            state: null
          }, i.set(o, f));
        }
      },
      S: function(e, t, a) {
        Do.S(e, t, a);
        var i = gm;
        if (i && e) {
          var o = Ce(i).hoistableStyles, f = no(e);
          t = t || "default";
          var d = o.get(f);
          if (!d) {
            var h = { loading: ks, preload: null };
            if (d = i.querySelector(
              ms(f)
            ))
              h.loading = s0 | ku;
            else {
              e = Ie(
                {
                  rel: "stylesheet",
                  href: e,
                  "data-precedence": t
                },
                a
              ), (a = Wu.get(f)) && ep(e, a);
              var y = d = i.createElement("link");
              pe(y), It(y, "link", e), y._p = new Promise(function(p, R) {
                y.onload = p, y.onerror = R;
              }), y.addEventListener("load", function() {
                h.loading |= s0;
              }), y.addEventListener("error", function() {
                h.loading |= p2;
              }), h.loading |= ku, Rf(d, t, i);
            }
            d = {
              type: "stylesheet",
              instance: d,
              count: 1,
              state: h
            }, o.set(f, d);
          }
        }
      },
      M: function(e, t) {
        Do.M(e, t);
        var a = gm;
        if (a && e) {
          var i = Ce(a).hoistableScripts, o = uo(e), f = i.get(o);
          f || (f = a.querySelector(
            ys(o)
          ), f || (e = Ie({ src: e, async: !0, type: "module" }, t), (t = Wu.get(o)) && tp(e, t), f = a.createElement("script"), pe(f), It(f, "link", e), a.head.appendChild(f)), f = {
            type: "script",
            instance: f,
            count: 1,
            state: null
          }, i.set(o, f));
        }
      }
    };
    var gm = typeof document > "u" ? null : document, qv = null, ET = 6e4, TT = 800, AT = 500, gS = 0, vS = null, xv = null, Ws = o1, d0 = {
      $$typeof: Fn,
      Provider: null,
      Consumer: null,
      _currentValue: Ws,
      _currentValue2: Ws,
      _threadCount: 0
    }, S2 = "%c%s%c", b2 = "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px", E2 = "", wv = " ", OT = Function.prototype.bind, T2 = !1, A2 = null, O2 = null, R2 = null, z2 = null, D2 = null, _2 = null, M2 = null, C2 = null, U2 = null, H2 = null;
    A2 = function(e, t, a, i) {
      t = C(e, t), t !== null && (a = Q(t.memoizedState, a, 0, i), t.memoizedState = a, t.baseState = a, e.memoizedProps = Ie({}, e.memoizedProps), a = ta(e, 2), a !== null && Be(a, e, 2));
    }, O2 = function(e, t, a) {
      t = C(e, t), t !== null && (a = ie(t.memoizedState, a, 0), t.memoizedState = a, t.baseState = a, e.memoizedProps = Ie({}, e.memoizedProps), a = ta(e, 2), a !== null && Be(a, e, 2));
    }, R2 = function(e, t, a, i) {
      t = C(e, t), t !== null && (a = ne(t.memoizedState, a, i), t.memoizedState = a, t.baseState = a, e.memoizedProps = Ie({}, e.memoizedProps), a = ta(e, 2), a !== null && Be(a, e, 2));
    }, z2 = function(e, t, a) {
      e.pendingProps = Q(e.memoizedProps, t, 0, a), e.alternate && (e.alternate.pendingProps = e.pendingProps), t = ta(e, 2), t !== null && Be(t, e, 2);
    }, D2 = function(e, t) {
      e.pendingProps = ie(e.memoizedProps, t, 0), e.alternate && (e.alternate.pendingProps = e.pendingProps), t = ta(e, 2), t !== null && Be(t, e, 2);
    }, _2 = function(e, t, a) {
      e.pendingProps = ne(
        e.memoizedProps,
        t,
        a
      ), e.alternate && (e.alternate.pendingProps = e.pendingProps), t = ta(e, 2), t !== null && Be(t, e, 2);
    }, M2 = function(e) {
      var t = ta(e, 2);
      t !== null && Be(t, e, 2);
    }, C2 = function(e) {
      var t = Mo(), a = ta(e, t);
      a !== null && Be(a, e, t);
    }, U2 = function(e) {
      we = e;
    }, H2 = function(e) {
      ce = e;
    };
    var Gv = !0, Lv = null, SS = !1, ir = null, cr = null, or = null, h0 = /* @__PURE__ */ new Map(), m0 = /* @__PURE__ */ new Map(), fr = [], RT = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
      " "
    ), Xv = null;
    if (Wn.prototype.render = sp.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null) throw Error("Cannot update an unmounted root.");
      var a = arguments;
      typeof a[1] == "function" ? console.error(
        "does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect()."
      ) : it(a[1]) ? console.error(
        "You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root."
      ) : typeof a[1] < "u" && console.error(
        "You passed a second argument to root.render(...) but it only accepts one argument."
      ), a = e;
      var i = t.current, o = aa(i);
      Oh(i, o, a, t, null, null);
    }, Wn.prototype.unmount = sp.prototype.unmount = function() {
      var e = arguments;
      if (typeof e[0] == "function" && console.error(
        "does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect()."
      ), e = this._internalRoot, e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        (mt & (Il | au)) !== oa && console.error(
          "Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."
        ), Oh(e.current, 2, null, e, null, null), en(), t[Si] = null;
      }
    }, Wn.prototype.unstable_scheduleHydration = function(e) {
      if (e) {
        var t = Mi();
        e = { blockedOn: null, target: e, priority: t };
        for (var a = 0; a < fr.length && t !== 0 && t < fr[a].priority; a++) ;
        fr.splice(a, 0, e), a === 0 && rp(e);
      }
    }, (function() {
      var e = bs.version;
      if (e !== "19.2.6")
        throw Error(
          `Incompatible React versions: The "react" and "react-dom" packages must have the exact same version. Instead got:
  - react:      ` + (e + `
  - react-dom:  19.2.6
Learn more: https://react.dev/warnings/version-mismatch`)
        );
    })(), typeof Map == "function" && Map.prototype != null && typeof Map.prototype.forEach == "function" && typeof Set == "function" && Set.prototype != null && typeof Set.prototype.clear == "function" && typeof Set.prototype.forEach == "function" || console.error(
      "React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://react.dev/link/react-polyfills"
    ), At.findDOMNode = function(e) {
      var t = e._reactInternals;
      if (t === void 0)
        throw typeof e.render == "function" ? Error("Unable to find node on an unmounted component.") : (e = Object.keys(e).join(","), Error(
          "Argument appears to not be a ReactComponent. Keys: " + e
        ));
      return e = jt(t), e = e !== null ? qt(e) : null, e = e === null ? null : e.stateNode, e;
    }, !(function() {
      var e = {
        bundleType: 1,
        version: "19.2.6",
        rendererPackageName: "react-dom",
        currentDispatcherRef: L,
        reconcilerVersion: "19.2.6"
      };
      return e.overrideHookState = A2, e.overrideHookStateDeletePath = O2, e.overrideHookStateRenamePath = R2, e.overrideProps = z2, e.overridePropsDeletePath = D2, e.overridePropsRenamePath = _2, e.scheduleUpdate = M2, e.scheduleRetry = C2, e.setErrorHandler = U2, e.setSuspenseHandler = H2, e.scheduleRefresh = Ze, e.scheduleRoot = fe, e.setRefreshHandler = bt, e.getCurrentFiber = Nt, rr(e);
    })() && dc && window.top === window.self && (-1 < navigator.userAgent.indexOf("Chrome") && navigator.userAgent.indexOf("Edge") === -1 || -1 < navigator.userAgent.indexOf("Firefox"))) {
      var N2 = window.location.protocol;
      /^(https?|file):$/.test(N2) && console.info(
        "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools" + (N2 === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://react.dev/link/react-devtools-faq` : ""),
        "font-weight:bold"
      );
    }
    v0.createRoot = function(e, t) {
      if (!it(e))
        throw Error("Target container is not a DOM element.");
      dp(e);
      var a = !1, i = "", o = qd, f = xd, d = iy;
      return t != null && (t.hydrate ? console.warn(
        "hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead."
      ) : typeof t == "object" && t !== null && t.$$typeof === On && console.error(
        `You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`
      ), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (i = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (f = t.onCaughtError), t.onRecoverableError !== void 0 && (d = t.onRecoverableError)), t = vs(
        e,
        1,
        !1,
        null,
        null,
        a,
        i,
        null,
        o,
        f,
        d,
        jg
      ), e[Si] = t.current, nc(e), new sp(t);
    }, v0.hydrateRoot = function(e, t, a) {
      if (!it(e))
        throw Error("Target container is not a DOM element.");
      dp(e), t === void 0 && console.error(
        "Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)"
      );
      var i = !1, o = "", f = qd, d = xd, h = iy, y = null;
      return a != null && (a.unstable_strictMode === !0 && (i = !0), a.identifierPrefix !== void 0 && (o = a.identifierPrefix), a.onUncaughtError !== void 0 && (f = a.onUncaughtError), a.onCaughtError !== void 0 && (d = a.onCaughtError), a.onRecoverableError !== void 0 && (h = a.onRecoverableError), a.formState !== void 0 && (y = a.formState)), t = vs(
        e,
        1,
        !0,
        t,
        a ?? null,
        i,
        o,
        y,
        f,
        d,
        h,
        jg
      ), t.context = Hg(null), a = t.current, i = aa(a), i = sn(i), o = Ol(i), o.callback = null, gu(a, o, i), mu(i, "hydrateRoot()", null), a = i, t.current.lanes = a, Mn(t, a), Ma(t), e[Si] = t.current, nc(e), new Wn(t);
    }, v0.version = "19.2.6", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), v0;
}
var $2;
function wT() {
  if ($2) return Zv.exports;
  $2 = 1;
  function C() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("^_^");
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(C);
      } catch (Q) {
        console.error(Q);
      }
    }
  }
  return process.env.NODE_ENV === "production" ? (C(), Zv.exports = qT()) : Zv.exports = xT(), Zv.exports;
}
var cA = wT();
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GT = (C) => C.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), LT = (C) => C.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (Q, ne, M) => M ? M.toUpperCase() : ne.toLowerCase()
), k2 = (C) => {
  const Q = LT(C);
  return Q.charAt(0).toUpperCase() + Q.slice(1);
}, eE = (...C) => C.filter((Q, ne, M) => !!Q && Q.trim() !== "" && M.indexOf(Q) === ne).join(" ").trim(), XT = (C) => {
  for (const Q in C)
    if (Q.startsWith("aria-") || Q === "role" || Q === "title")
      return !0;
};
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var QT = {
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
const VT = vm.forwardRef(
  ({
    color: C = "currentColor",
    size: Q = 24,
    strokeWidth: ne = 2,
    absoluteStrokeWidth: M,
    className: ie = "",
    children: ce,
    iconNode: we,
    ...F
  }, le) => vm.createElement(
    "svg",
    {
      ref: le,
      ...QT,
      width: Q,
      height: Q,
      stroke: C,
      strokeWidth: M ? Number(ne) * 24 / Number(Q) : ne,
      className: eE("lucide", ie),
      ...!ce && !XT(F) && { "aria-hidden": "true" },
      ...F
    },
    [
      ...we.map(([K, Ae]) => vm.createElement(K, Ae)),
      ...Array.isArray(ce) ? ce : [ce]
    ]
  )
);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ZT = (C, Q) => {
  const ne = vm.forwardRef(
    ({ className: M, ...ie }, ce) => vm.createElement(VT, {
      ref: ce,
      iconNode: Q,
      className: eE(
        `lucide-${GT(k2(C))}`,
        `lucide-${C}`,
        M
      ),
      ...ie
    })
  );
  return ne.displayName = k2(C), ne;
};
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const JT = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], oA = ZT("search", JT), KT = [
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
], $T = [
  { canonical: "แชมพู", patterns: [/แชมพู/iu, /SHAMPOO/iu] },
  { canonical: "ครีมนวด", patterns: [/ครีมนวด/iu, /CONDITIONER/iu] },
  { canonical: "ผลิตภัณฑ์ซักผ้า", patterns: [/ผงซักฟอก|น้ำยาซักผ้า/iu, /DETERGENT|LAUNDRY/iu] },
  { canonical: "ปรับผ้านุ่ม", patterns: [/ปรับผ้านุ่ม/iu, /FABRIC\s*SOFTENER/iu] },
  { canonical: "ผลิตภัณฑ์ล้างจาน", patterns: [/ล้างจาน/iu, /DISHWASH/iu] },
  { canonical: "สบู่", patterns: [/สบู่/iu, /SOAP|BODY\s*WASH/iu] },
  { canonical: "ยาสีฟัน", patterns: [/ยาสีฟัน/iu, /TOOTHPASTE/iu] },
  { canonical: "แปรงสีฟัน", patterns: [/แปรงสีฟัน/iu, /TOOTHBRUSH/iu] },
  { canonical: "มีดโกน", patterns: [/มีดโกน|ใบมีดโกน/iu, /RAZOR|BLADES?/iu] },
  { canonical: "สกินแคร์", patterns: [/ครีมบำรุง|เซรั่ม|มอยส์เจอไรเซอร์/iu, /SERUM|CREAM|MOISTURI[ZS]ER/iu] },
  { canonical: "ผ้าอ้อม", patterns: [/ผ้าอ้อม/iu, /DIAPERS?/iu] },
  { canonical: "ยาอม", patterns: [/ยาอม/iu, /LOZENGES?/iu] },
  { canonical: "ยาดม", patterns: [/ยาดม/iu, /INHALER/iu] },
  { canonical: "ผลิตภัณฑ์ระงับกลิ่น", patterns: [/ระงับกลิ่น|โรลออน/iu, /DEODORANT/iu] }
], W2 = {
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
}, tE = ["ขวด", "ชิ้น", "ซอง", "ถุง", "กล่อง", "แพ็ค", "แพค", "ด้าม", "หลอด", "กระปุก", "ชุด"];
function lE(C) {
  return String(C || "").normalize("NFKC").replace(/[×✕]/g, "x").replace(/\s+/g, " ").trim();
}
function kT(C) {
  return C.split(/(?:เมื่อ)?\s*ซื้อ|ลด\s*\d|แถม|ฟรี/iu)[0].trim();
}
function WT(C) {
  var ie, ce;
  const Q = C.toUpperCase(), ne = [...KT].sort((we, F) => F.length - we.length).find((we) => Q.includes(we));
  return ne === "HEAD AND SHOULDERS" || ne === "HEAD & SHOULDERS" ? "H&S" : ne === "ORAL B" ? "ORAL-B" : ne || ((ce = (ie = C.match(/^([A-Z][A-Z0-9&' -]{1,28})(?=\s|$)/)) == null ? void 0 : ie[1]) == null ? void 0 : ce.trim()) || null;
}
function FT(C) {
  var Q;
  return ((Q = $T.find((ne) => ne.patterns.some((M) => M.test(C)))) == null ? void 0 : Q.canonical) || null;
}
function IT(C) {
  const Q = [...C.matchAll(/(\d+(?:[.,]\d+)?)\s*(ML|มล\.?|L|LT|ลิตร|G|GM|กรัม|KG|กก\.?|CM|ซม\.?)(?![A-Zก-๙])/giu)];
  if (!Q.length) return { value: null, unit: null, raw: null };
  const ne = Q[0], M = Number(ne[1].replace(",", ".")), ie = ne[2].toUpperCase().replace(/\.$/, ""), ce = W2[ie] || W2[ne[2]] || ne[2];
  return { value: Number.isFinite(M) && M > 0 ? M : null, unit: ce, raw: ne[0] };
}
function PT(C) {
  const Q = [
    /(?:แพ็ค|แพค|PACK)\s*(?:ละ|X)?\s*(\d{1,3})\s*(?:ชิ้น|ขวด|ซอง|ถุง|ด้าม|หลอด)?/iu,
    /(\d{1,3})\s*(?:ชิ้น|ขวด|ซอง|ถุง|ด้าม|หลอด)\s*\/(?:แพ็ค|แพค|PACK)/iu,
    /(?:^|\s)[Xx]\s*(\d{1,3})(?:\s|$)/u
  ];
  for (const ne of Q) {
    const M = C.match(ne), ie = Number(M == null ? void 0 : M[1]);
    if (M && Number.isInteger(ie) && ie > 0) return { quantity: ie, raw: M[0] };
  }
  return { quantity: 1, raw: null };
}
function eA(C) {
  const Q = tE.find((ne) => new RegExp(ne, "iu").test(C));
  return Q === "แพค" ? "แพ็ค" : Q || "ชิ้น";
}
function F2(C) {
  let Q = 2166136261;
  for (let ne = 0; ne < C.length; ne += 1)
    Q ^= C.charCodeAt(ne), Q = Math.imul(Q, 16777619);
  return (Q >>> 0).toString(36).toUpperCase().padStart(7, "0");
}
function S0(C) {
  return lE(C).toUpperCase().replace(/[^A-Z0-9ก-๙]+/gu, " ").trim();
}
function aE(C) {
  return [
    S0(C.brand),
    S0(C.productType),
    S0(C.variant || ""),
    Number(C.sizeValue).toFixed(3),
    S0(C.sizeUnit),
    S0(C.salesUnit),
    String(C.packQuantity)
  ].join("|");
}
function tA(C, Q, ne, M, ie) {
  let ce = C;
  for (const we of [Q, ne, M, ie].filter((F) => !!F))
    ce = ce.replace(new RegExp(we.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "giu"), " ");
  return ce = ce.replace(new RegExp(`\\b(?:${tE.join("|")})\\b`, "giu"), " ").replace(/\s+/g, " ").trim(), ce || null;
}
function fA(C) {
  const Q = kT(lE(C)), ne = WT(Q), M = FT(Q), ie = IT(Q), ce = PT(Q), we = eA(Q), F = tA(Q, ne, M, ie.raw, ce.raw), le = [
    ...ne ? [] : ["brand_missing"],
    ...M ? [] : ["product_type_missing"],
    ...ie.value ? [] : ["size_missing"],
    ...ie.unit ? [] : ["size_unit_missing"]
  ], K = {
    brand: ne || "",
    productType: M || "",
    variant: F,
    sizeValue: ie.value || 0,
    sizeUnit: ie.unit || "",
    salesUnit: we,
    packQuantity: ce.quantity
  }, Ae = aE(K), w = `SKU-${F2(Ae)}`;
  return {
    id: `sku:${F2(Ae)}`,
    code: w,
    canonicalName: Q || "สินค้าใหม่ที่ยังอ่านชื่อไม่ครบ",
    identityKey: Ae,
    identity: K,
    status: le.length ? "quarantine" : "candidate",
    evidence: Q ? [Q] : [],
    failureReasons: le
  };
}
function rA(C) {
  if (C.failureReasons.length) throw new Error(`sku_evidence_incomplete:${C.failureReasons.join(",")}`);
  return { ...C, status: "active" };
}
const $v = "DEMO-2026-01", TS = ["HFSS", "HFSM"], lA = [
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
function aA(C, Q) {
  const M = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="500"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#eef4ff"/><stop offset="1" stop-color="#fff7ed"/></linearGradient></defs><rect width="640" height="500" rx="30" fill="url(#g)"/><rect x="26" y="26" width="588" height="448" rx="24" fill="#fff" stroke="#c7d2fe" stroke-width="4"/><text x="48" y="90" font-family="Arial" font-size="28" font-weight="700" fill="#1d4ed8">${`${C} ${Q}`.replace(/[&<>"']/g, "")}</text><text x="48" y="390" font-family="Arial" font-size="38" font-weight="800" fill="#059669">PROMOTION</text><text x="48" y="440" font-family="Arial" font-size="25" fill="#334155">Preview fixture</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(M)}`;
}
function nA(C, Q) {
  return Q && C === "HFSM" ? [{
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
function sA(C = "published") {
  const Q = [], ne = [], M = [], ie = [], ce = [];
  return lA.forEach((we, F) => {
    const [le, K, Ae, w, N, fe, Ze, bt] = we, it = { brand: le, productType: K, variant: Ae, sizeValue: w, sizeUnit: N, salesUnit: fe, packQuantity: Ze }, Fe = aE(it), kt = `sku:demo:${F + 1}`, yt = {
      id: kt,
      code: `SKU-DEMO-${String(F + 1).padStart(3, "0")}`,
      canonicalName: `${le} ${K} ${Ae} ${w} ${N}`,
      identityKey: Fe,
      identity: it,
      status: "active",
      evidence: ["preview_fixture"],
      failureReasons: []
    }, Mt = {
      skuId: kt,
      pdfSourcePrice: null,
      centralOverridePrice: { amount: bt, currency: "THB" },
      effectivePrice: { amount: bt, currency: "THB" },
      source: "central_override",
      sourceReference: "preview_fixture",
      updatedAt: "2026-01-01T00:00:00.000Z"
    }, jt = `family:demo:${F + 1}`, qt = {
      id: jt,
      familyKey: `PF-DEMO-${String(F + 1).padStart(3, "0")}`,
      name: F < 3 ? "Hair Care 60–70 ml" : `${le} ${K}`,
      scopeText: F < 3 ? "H&S / Pantene / Rejoice 60–70 ml" : `${le} ${K}`,
      sourceRows: [F + 2],
      tiersByClass: Object.fromEntries(TS.map((Ye) => [Ye, nA(Ye, F === 2)])),
      failureReasons: []
    }, De = `group:demo:${F + 1}`, Ge = TS.map((Ye, re) => ({
      id: `CARD-${$v}-${Ye}-P${String(F + 1).padStart(3, "0")}-C${String(re + 1).padStart(3, "0")}`,
      monthKey: $v,
      page: F + 1,
      sequence: re + 1,
      classId: Ye,
      imageUrl: aA(`${le} ${K} ${w} ${N}`, Ye),
      skuId: kt,
      productGroupId: De,
      promotionFamilyId: jt,
      promotionTiers: qt.tiersByClass[Ye],
      price: Mt,
      status: "ready",
      evidence: { rawText: yt.canonicalName, productText: yt.canonicalName, pageClassText: Ye, confidence: 1, method: "manual", cropBounds: null },
      failureReasons: []
    }));
    if (Q.push(yt), ne.push(Mt), M.push(...Ge), ie.push({ id: De, monthKey: $v, skuId: kt, sku: yt, cardIds: Ge.map((Ye) => Ye.id), classIds: [...TS], promotionFamilyId: jt, price: Mt, status: "ready", failureReasons: [] }), !ce.some((Ye) => Ye.name === qt.name)) ce.push(qt);
    else if (F < 3) {
      const Ye = ce.find((re) => re.name === qt.name);
      Ye && (ie[ie.length - 1].promotionFamilyId = Ye.id, Ge.forEach((re) => {
        re.promotionFamilyId = Ye.id;
      }));
    }
  }), {
    schema: "promo-system-rebuild-v1",
    version: {
      id: "00000000-0000-4000-8000-000000000001",
      monthKey: $v,
      revision: 1,
      status: C,
      previousVersionId: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      createdBy: "preview-fixture",
      publishedAt: C === "published" ? "2026-01-01T00:00:00.000Z" : null,
      source: { pdfName: "preview-fixture.pdf", workbookName: "preview-fixture.xlsx", pdfHash: null, workbookHash: null }
    },
    skus: Q,
    prices: ne,
    cards: M,
    productGroups: ie,
    promotionFamilies: ce,
    warnings: ["preview_fixture_only"]
  };
}
const AS = "promo-new-admin-session-v1";
async function E0(C, Q = {}, ne = {}) {
  const M = new URL("/api/promo-new", window.location.origin);
  M.searchParams.set("action", C), Object.entries(ne).forEach(([we, F]) => {
    F && M.searchParams.set(we, F);
  });
  const ie = await fetch(M, {
    ...Q,
    headers: {
      ...Q.body ? { "Content-Type": "application/json" } : {},
      ...Q.headers
    }
  }), ce = await ie.json().catch(() => ({ ok: !1, error: `http_${ie.status}` }));
  if (!ie.ok || (ce == null ? void 0 : ce.ok) === !1) throw new Error((ce == null ? void 0 : ce.error) || `http_${ie.status}`);
  return ce;
}
function dA() {
  try {
    return JSON.parse(sessionStorage.getItem(AS) || "null");
  } catch {
    return null;
  }
}
function nE(C) {
  C ? sessionStorage.setItem(AS, JSON.stringify(C)) : sessionStorage.removeItem(AS);
}
async function hA(C, Q) {
  const ne = await E0("login", { method: "POST", body: JSON.stringify({ email: C, password: Q }) });
  return nE(ne.session), ne.session;
}
async function mA(C) {
  return await E0("session", { headers: { Authorization: `Bearer ${C.accessToken}` } }), C;
}
async function yA(C) {
  try {
    C && await E0("logout", { method: "POST", headers: { Authorization: `Bearer ${C.accessToken}` } });
  } finally {
    nE(null);
  }
}
async function pA(C, Q) {
  return E0("draft", {
    method: "POST",
    headers: { Authorization: `Bearer ${Q.accessToken}` },
    body: JSON.stringify({ dataset: C })
  });
}
async function gA(C = "") {
  return (await E0("published", {}, { month: C })).data;
}
export {
  iA as R,
  oA as S,
  rA as a,
  sA as b,
  cA as c,
  ZT as d,
  fA as e,
  gA as f,
  hA as g,
  yA as h,
  uA as j,
  dA as l,
  vm as r,
  pA as s,
  mA as v
};
