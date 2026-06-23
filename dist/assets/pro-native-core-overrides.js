(() => {
  'use strict';

  if (window.__DOIT_PRO_NATIVE_OVERRIDES__) return;
  window.__DOIT_PRO_NATIVE_OVERRIDES__ = true;

  const SEND_SELECTOR = '#table input.jdata[data-map="send"]';
  const T = value => String(value ?? '').trim();
  const N = value => Number(String(value ?? '').replace(/,/g, '').replace(/[^0-9.\-]/g, '')) || 0;
  const F = value => N(value).toLocaleString('th-TH');
  const B = value => N(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const DEV_QR_CONFIG_URL = 'https://saodmeoilixfdqentofp.supabase.co/functions/v1/dev-qr?action=config';
  const DEV_QR_IMAGE_URL = 'https://saodmeoilixfdqentofp.supabase.co/functions/v1/dev-qr?action=image';
  let devQrBusy = false;
  let devQrCache = null;
  let devQrPromise = null;

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

  function normalizeQrConfig(config) {
    if (!config) return null;
    const out = { ...config };
    if (out.enabled !== false) out.enabled = true;
    if (!out.image_url || String(out.image_url).includes('/storage/v1/object/public/doit-files/team/dev-qr.png')) {
      out.image_url = DEV_QR_IMAGE_URL + '&t=' + encodeURIComponent(out.updated_at || Date.now());
    }
    return out;
  }

  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      if (!src) return resolve(false);
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error('developer_qr_image_preload_failed'));
      img.src = src;
    });
  }

  async function loadDeveloperQr() {
    try {
      const response = await fetch(DEV_QR_CONFIG_URL + '&t=' + Date.now(), { cache: 'no-store' });
      if (!response.ok) throw new Error(String(response.status));
      const config = normalizeQrConfig(await response.json());
      localStorage.setItem('doit-dev-qr-config-v1', JSON.stringify(config));
      return config;
    } catch {
      try { return normalizeQrConfig(JSON.parse(localStorage.getItem('doit-dev-qr-config-v1') || 'null')); } catch { return null; }
    }
  }

  async function primeDeveloperQr() {
    if (devQrCache) return devQrCache;
    if (!devQrPromise) {
      devQrPromise = loadDeveloperQr().then(async config => {
        devQrCache = config;
        if (config?.enabled !== false && config?.image_url) {
          try { await preloadImage(config.image_url); } catch {}
        }
        return devQrCache;
      }).catch(error => {
        devQrPromise = null;
        throw error;
      });
    }
    return devQrPromise;
  }

  function ensureDeveloperQrStyle() {
    if (document.querySelector('#doitDevQrStyle')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="doitDevQrStyle">.devQrBlock{margin-top:12px;border:1px solid #bbf7d0;background:linear-gradient(180deg,#f0fdf4,#fff);border-radius:16px;padding:12px;text-align:center}.devQrBlock h3{margin:0 0 4px;color:#064e3b;font-size:17px}.devQrBlock p{margin:0 0 10px;color:#475569;font-weight:800;font-size:13px}.devQrFrame{background:#fff;border:1px solid #d1d5db;border-radius:14px;padding:8px;display:inline-flex;align-items:center;justify-content:center;max-width:100%}.devQrFrame img{width:min(220px,58vw);height:min(220px,58vw);object-fit:contain;display:block}.devQrEmpty{border:1px dashed #86efac;border-radius:14px;background:#f8fafc;color:#64748b;font-weight:900;padding:16px}.devQrUpdated{display:block;color:#64748b;font-size:11px;margin-top:6px}@media(max-width:720px){.devQrBlock{padding:10px}.devQrBlock h3{font-size:15px}.devQrBlock p{font-size:12px}.devQrFrame{padding:7px}.devQrFrame img{width:min(185px,50vw);height:min(185px,50vw)}}</style>`);
  }

  function renderDeveloperQrBlock(block, config) {
    if (!config || config.enabled === false || !config.image_url) {
      block.innerHTML = `<h3>QR Code</h3><p>ยังไม่ได้อัปโหลด QR Code จากหน้า Admin</p><div class="devQrEmpty">เปิดหน้า Admin แล้วอัปโหลด QR Code ใต้ทีมผู้พัฒนา</div>`;
      return;
    }
    const updated = config.updated_at ? `<small class="devQrUpdated">อัปเดต ${escapeHtml(new Date(config.updated_at).toLocaleString('th-TH'))}</small>` : '';
    block.innerHTML = `<h3>${escapeHtml(config.title || 'QR Code')}</h3><p>${escapeHtml(config.note || 'สแกนเพื่อเปิดข้อมูลเพิ่มเติม')}</p><div class="devQrFrame"><img src="${escapeHtml(config.image_url)}" alt="QR Code"></div>${updated}`;
  }

  async function injectDeveloperQr() {
    const body = document.querySelector('.devBody');
    if (!body || devQrBusy) return;
    ensureDeveloperQrStyle();
    let block = document.querySelector('#devQrBlock');
    if (!block) {
      body.insertAdjacentHTML('beforeend', `<div class="devQrBlock" id="devQrBlock"><h3>QR Code</h3><p>ข้อมูลจากฝั่ง Admin</p><div class="devQrEmpty">กำลังโหลด QR Code...</div></div>`);
      block = document.querySelector('#devQrBlock');
    }
    if (devQrCache) {
      renderDeveloperQrBlock(block, devQrCache);
      return;
    }
    devQrBusy = true;
    try {
      renderDeveloperQrBlock(block, await primeDeveloperQr());
    } finally {
      devQrBusy = false;
    }
  }

  function patchDeveloperTeamModal() {
    const original = window.openDevTeamModal;
    if (typeof original === 'function' && !original.__devQrPatched) {
      window.openDevTeamModal = function(...args) {
        const out = original.apply(this, args);
        injectDeveloperQr();
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
    if (event.target?.closest?.('.devTeamBtn')) {
      injectDeveloperQr();
      setTimeout(injectDeveloperQr, 250);
    }
  }, true);

  const observer = new MutationObserver(() => {
    preserveCoreCurrentState();
    refreshSendInputs();
    enhanceOrderTable();
    enhanceTeleBills();
    patchDeveloperTeamModal();
    if (document.querySelector('.devBody') && !document.querySelector('#devQrBlock')) injectDeveloperQr();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const timer = setInterval(() => {
    const ready = preserveCoreCurrentState();
    patchDeveloperTeamModal();
    if (document.querySelector('.devBody') && !document.querySelector('#devQrBlock')) injectDeveloperQr();
    if (ready) clearInterval(timer);
  }, 100);
  setTimeout(() => clearInterval(timer), 10000);

  primeDeveloperQr().catch(() => {});
  refreshSendInputs();
  patchDeveloperTeamModal();

  window.DOIT_NATIVE_CORE_PREVIEW = {
    version: 'phase4-closure-native-current-state',
    mode: 'native-core-file-plus-behavior-bridge',
    production: true,
    stateApiSource: 'closure-native-core',
    fixes: ['closureNativeCurrentState', 'sendNext', 'doneSummary', 'orderTotal', 'teleTotal', 'developerQrPrivateStorage', 'developerQrPreload']
  };
})();
