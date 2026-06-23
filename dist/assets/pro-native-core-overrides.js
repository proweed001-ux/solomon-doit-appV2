(() => {
  'use strict';

  if (window.__DOIT_PRO_NATIVE_OVERRIDES__) return;
  window.__DOIT_PRO_NATIVE_OVERRIDES__ = true;

  const SEND_SELECTOR = '#table input.jdata[data-map="send"]';
  const T = value => String(value ?? '').trim();
  const N = value => Number(String(value ?? '').replace(/,/g, '').replace(/[^0-9.\-]/g, '')) || 0;
  const F = value => N(value).toLocaleString('th-TH');
  const B = value => N(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const DEV_QR_URL = 'https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/public/doit-files/team/dev-qr-config.json';

  function preserveCoreCurrentState() {
    const app = window.DOIT_CORE_APP;
    if (!app) return false;
    if (typeof app.currentState !== 'function') {
      app.__nativeStateApiMissing = true;
      return false;
    }
    app.__nativePreviewStateApi = true;
    app.__nativeStateApiSource = 'closure-native-core';
    return true;
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

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  async function loadDeveloperQr() {
    try {
      const response = await fetch(DEV_QR_URL + '?t=' + Date.now(), { cache: 'no-store' });
      if (!response.ok) throw new Error(String(response.status));
      const config = await response.json();
      localStorage.setItem('doit-dev-qr-config-v1', JSON.stringify(config));
      return config;
    } catch {
      try { return JSON.parse(localStorage.getItem('doit-dev-qr-config-v1') || 'null'); } catch { return null; }
    }
  }

  function ensureDeveloperQrStyle() {
    if (document.querySelector('#doitDevQrStyle')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="doitDevQrStyle">.devQrBlock{margin-top:14px;border:1px solid #bbf7d0;background:linear-gradient(180deg,#f0fdf4,#fff);border-radius:16px;padding:14px;text-align:center}.devQrBlock h3{margin:0 0 6px;color:#064e3b;font-size:18px}.devQrBlock p{margin:0 0 12px;color:#475569;font-weight:800}.devQrFrame{background:#fff;border:1px solid #d1d5db;border-radius:18px;padding:12px;display:inline-flex;align-items:center;justify-content:center;max-width:100%}.devQrFrame img{width:min(330px,78vw);height:min(330px,78vw);object-fit:contain;display:block}.devQrUpdated{display:block;color:#64748b;font-size:11px;margin-top:8px}@media(max-width:720px){.devQrBlock{padding:12px}.devQrBlock h3{font-size:16px}.devQrFrame img{width:min(270px,76vw);height:min(270px,76vw)}}</style>`);
  }

  async function injectDeveloperQr() {
    const body = document.querySelector('.devBody');
    if (!body) return;
    document.querySelector('#devQrBlock')?.remove();
    const config = await loadDeveloperQr();
    if (!config || config.enabled === false || !config.image_url) return;
    ensureDeveloperQrStyle();
    const updated = config.updated_at ? `<small class="devQrUpdated">อัปเดต ${escapeHtml(new Date(config.updated_at).toLocaleString('th-TH'))}</small>` : '';
    body.insertAdjacentHTML('beforeend', `<div class="devQrBlock" id="devQrBlock"><h3>${escapeHtml(config.title || 'QR Code')}</h3><p>${escapeHtml(config.note || 'สแกนเพื่อเปิดข้อมูลเพิ่มเติม')}</p><div class="devQrFrame"><img src="${escapeHtml(config.image_url)}" alt="QR Code"></div>${updated}</div>`);
  }

  function patchDeveloperTeamModal() {
    const original = window.openDevTeamModal;
    if (typeof original === 'function' && !original.__devQrPatched) {
      window.openDevTeamModal = function(...args) {
        const out = original.apply(this, args);
        setTimeout(injectDeveloperQr, 250);
        return out;
      };
      window.openDevTeamModal.__devQrPatched = true;
    }
  }

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
    if (tab) {
      const text = T(tab.textContent);
      if (text.includes('จัดแล้ว')) setTimeout(renderDoneFromPrintModule, 80);
      if (text.includes('รวม order')) setTimeout(enhanceOrderTable, 80);
    }
    if (event.target?.closest?.('.devTeamBtn')) setTimeout(injectDeveloperQr, 350);
  }, true);

  const observer = new MutationObserver(() => {
    preserveCoreCurrentState();
    refreshSendInputs();
    enhanceOrderTable();
    enhanceTeleBills();
    patchDeveloperTeamModal();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const timer = setInterval(() => {
    const ready = preserveCoreCurrentState();
    patchDeveloperTeamModal();
    if (ready) clearInterval(timer);
  }, 100);
  setTimeout(() => clearInterval(timer), 10000);

  refreshSendInputs();
  patchDeveloperTeamModal();

  window.DOIT_NATIVE_CORE_PREVIEW = {
    version: 'phase4-closure-native-current-state',
    mode: 'native-core-file-plus-behavior-bridge',
    production: true,
    stateApiSource: 'closure-native-core',
    fixes: ['closureNativeCurrentState', 'sendNext', 'doneSummary', 'orderTotal', 'teleTotal', 'developerQr']
  };
})();
