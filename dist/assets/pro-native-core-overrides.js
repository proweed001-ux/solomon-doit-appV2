(() => {
  'use strict';

  if (window.__DOIT_PRO_NATIVE_OVERRIDES__) return;
  window.__DOIT_PRO_NATIVE_OVERRIDES__ = true;

  const SEND_SELECTOR = '#table input.jdata[data-map="send"]';
  const STATE_KEY_PREFIX = 'doit-core-unified-v1:';
  const T = value => String(value ?? '').trim();
  const N = value => Number(String(value ?? '').replace(/,/g, '').replace(/[^0-9.\-]/g, '')) || 0;
  const F = value => N(value).toLocaleString('th-TH');
  const B = value => N(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  let activeStateKey = '';
  let activeStateCache = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function rememberState(key, value) {
    const k = String(key || '');
    if (!k.startsWith(STATE_KEY_PREFIX)) return;
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value || '{}') : value;
      if (!parsed || typeof parsed !== 'object') return;
      activeStateKey = k;
      activeStateCache = clone(parsed);
      window.__DOIT_NATIVE_ACTIVE_STATE__ = {
        key: activeStateKey,
        state: clone(activeStateCache),
        updatedAt: Date.now(),
        source: 'localStorage.setItem-active-session'
      };
    } catch {}
  }

  function installActiveStateRecorder() {
    if (window.__DOIT_NATIVE_ACTIVE_STATE_RECORDER__) return;
    window.__DOIT_NATIVE_ACTIVE_STATE_RECORDER__ = true;
    try {
      const proto = Storage.prototype;
      const originalSetItem = proto.setItem;
      proto.setItem = function patchedDoitSetItem(key, value) {
        if (this === localStorage) rememberState(key, value);
        return originalSetItem.apply(this, arguments);
      };
    } catch {
      try {
        const originalSetItem = localStorage.setItem.bind(localStorage);
        localStorage.setItem = function patchedDoitLocalSetItem(key, value) {
          rememberState(key, value);
          return originalSetItem(key, value);
        };
      } catch {}
    }
  }

  function latestRecordedState() {
    if (activeStateCache) return clone(activeStateCache);
    const cached = window.__DOIT_NATIVE_ACTIVE_STATE__?.state;
    return cached ? clone(cached) : null;
  }

  function sendInputs() {
    return [...document.querySelectorAll(SEND_SELECTOR)].filter(input => !input.disabled);
  }

  function refreshSendInputs() {
    sendInputs().forEach((input, index) => {
      input.enterKeyHint = 'next';
      input.tabIndex = 1000 + index;
    });
  }

  function focusSendAt(index) {
    setTimeout(() => {
      requestAnimationFrame(() => {
        refreshSendInputs();
        const inputs = sendInputs();
        const next = inputs[index] || inputs[inputs.length - 1] || inputs[0];
        if (!next) return;
        next.focus({ preventScroll: true });
        next.scrollIntoView({ block: 'center', inline: 'nearest' });
        try { next.select(); } catch {}
      });
    }, 140);
  }

  function nextIndexFor(input) {
    const inputs = sendInputs();
    return Math.max(0, inputs.indexOf(input)) + 1;
  }

  function labelText(selector, label) {
    const raw = T(document.querySelector(selector)?.textContent).replace(new RegExp('^' + label + ':\s*'), '');
    return (!raw || raw.includes('ทั้งหมด') || raw.includes('เลือก') || raw.includes('ยังไม่เลือก')) ? '' : raw;
  }

  function currentPs() {
    return labelText('#psText', 'PS');
  }

  function currentReceivers() {
    try {
      const h = window.DOIT_CORE_APP?.health?.() || {};
      if (Array.isArray(h.receivers) && h.receivers.length) return h.receivers.filter(Boolean);
    } catch {}
    const one = labelText('#sendText', 'ส่งให้ร้าน');
    return one ? [one] : [];
  }

  function sameArray(a, b) {
    return JSON.stringify(a || []) === JSON.stringify(b || []);
  }

  function bestStoredState() {
    const ps = currentPs();
    const receivers = currentReceivers();
    const keys = Object.keys(localStorage).filter(k => k.startsWith(STATE_KEY_PREFIX));
    let best = null;
    let score = -Infinity;
    keys.forEach(key => {
      try {
        const st = JSON.parse(localStorage.getItem(key) || '{}');
        const sel = st.sel || {};
        if (ps && !(sel.ps || []).includes(ps)) return;
        const sendCount = Object.keys(st.send || {}).length;
        const receiverScore = receivers.length && sameArray(sel.receivers || [], receivers) ? 100000 : 0;
        const psScore = ps ? 1000000 : 0;
        const sc = psScore + receiverScore + sendCount;
        if (sc > score) {
          score = sc;
          best = st;
        }
      } catch {}
    });
    return best;
  }

  function currentStateSnapshot() {
    const recorded = latestRecordedState();
    if (recorded) return recorded;
    return clone(bestStoredState() || {});
  }

  function installCurrentStateApi() {
    const app = window.DOIT_CORE_APP;
    if (!app) return false;
    app.currentState = () => currentStateSnapshot();
    app.__nativePreviewStateApi = true;
    app.__nativeStateApiSource = activeStateCache ? 'active-session-state' : 'active-session-state-with-localStorage-fallback';
    return true;
  }

  function renderDoneFromPrintModule() {
    if (window.DOIT_PRO_PRINT_STORE_BILLS?.renderDoneFromCore) {
      window.DOIT_PRO_PRINT_STORE_BILLS.renderDoneFromCore();
    }
  }

  function enhanceOrderTable() {
    const count = T(document.querySelector('#tableCount')?.textContent);
    const table = document.querySelector('#table');
    const body = table?.querySelector('tbody');
    if (!body || !count.includes('รวม order') || body.querySelector('.nativeOrderTotal')) return;
    const rows = [...body.querySelectorAll('tr')].filter(row => !row.classList.contains('totalRow'));
    if (!rows.length) return;
    let qty = 0, raw = 0, net = 0, vat = 0;
    rows.forEach(row => {
      const cells = [...row.children].map(cell => cell.textContent);
      qty += N(cells[2]);
      raw += N(cells[3]);
      net += N(cells[4]);
      vat += N(cells[5]);
    });
    body.insertAdjacentHTML('beforeend', `<tr class="totalRow nativeOrderTotal"><td colspan="2" class="r">รวมทั้งหมด</td><td>${F(qty)}</td><td>${B(raw)}</td><td>${B(net)}</td><td>${B(vat)}</td></tr>`);
  }

  function enhanceTeleBills() {
    document.querySelectorAll('.teleBill tbody').forEach(body => {
      if (body.querySelector('.nativeTeleTotal')) return;
      const rows = [...body.querySelectorAll('tr')];
      if (!rows.length) return;
      let qty = 0, raw = 0, vat = 0;
      rows.forEach(row => {
        const cells = [...row.children].map(cell => cell.textContent);
        qty += N(cells[1]);
        raw += N(cells[2]);
        vat += N(cells[3]);
      });
      body.insertAdjacentHTML('beforeend', `<tr class="totalRow nativeTeleTotal"><td>รวมทั้งหมด</td><td>${F(qty)}</td><td>${B(raw)}</td><td>${B(vat)}</td></tr>`);
    });
  }

  installActiveStateRecorder();

  document.addEventListener('change', event => {
    const input = event.target?.closest?.(SEND_SELECTOR);
    if (!input) return;
    focusSendAt(nextIndexFor(input));
  }, true);

  document.addEventListener('keydown', event => {
    const input = event.target?.closest?.(SEND_SELECTOR);
    if (!input || event.key !== 'Enter') return;
    event.preventDefault();
    event.stopPropagation();
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, true);

  document.addEventListener('focusin', event => {
    if (event.target?.matches?.(SEND_SELECTOR)) refreshSendInputs();
  }, true);

  document.addEventListener('click', event => {
    const tab = event.target?.closest?.('.tab');
    if (!tab) return;
    const text = T(tab.textContent);
    if (text.includes('จัดแล้ว')) setTimeout(renderDoneFromPrintModule, 80);
    if (text.includes('รวม order')) setTimeout(enhanceOrderTable, 80);
  }, true);

  const observer = new MutationObserver(() => {
    installCurrentStateApi();
    refreshSendInputs();
    enhanceOrderTable();
    enhanceTeleBills();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const timer = setInterval(() => {
    if (installCurrentStateApi()) clearInterval(timer);
  }, 100);
  setTimeout(() => clearInterval(timer), 10000);

  refreshSendInputs();

  window.DOIT_NATIVE_CORE_PREVIEW = {
    version: 'phase3-current-state-active-session',
    mode: 'native-core-file-plus-behavior-bridge',
    production: true,
    stateApiSource: 'active-session-state-with-localStorage-fallback',
    fixes: ['currentStateActiveSession', 'sendNext', 'doneSummary', 'orderTotal', 'teleTotal']
  };
})();
