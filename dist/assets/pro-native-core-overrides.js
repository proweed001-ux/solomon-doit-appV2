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
    document.head.insertAdjacentHTML('beforeend', `<style id="doitDevQrStyle">.devQrPerson{margin-bottom:0}.devQrPerson .devInfo{text-align:center}.devQrLogoTop{font-weight:950;font-size:18px;letter-spacing:.5px;color:#0f3f55;line-height:1.05}.devQrLine{width:128px;height:4px;background:linear-gradient(90deg,#0f3f55,#22c55e,#0f3f55);border-radius:999px;margin:5px auto 8px}.devQrPerson .devCode{display:inline-flex;margin:4px auto 8px;background:#e9fff2;color:#087b34;border-color:#86efac}.devQrPerson .devRole{font-size:13px;color:#64748b;font-weight:850}.devQrBrand{font-weight:950;font-size:28px;line-height:1;color:#0f3f55;letter-spacing:1px;margin-top:8px}.devQrScan{font-weight:900;font-size:12px;color:#087b34;margin-top:4px}.devQrPerson .devPhotoFrame{background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden}.devQrPerson .devPhotoFrame img{width:100%;height:100%;object-fit:contain;display:block;background:#fff;padding:7px}.devQrPerson .devQrUpdated{display:block;color:#94a3b8;font-size:10.5px;margin-top:5px}.devQrPerson .devQrEmpty{height:100%;display:flex;align-items:center;justify-content:center;text-align:center;color:#166534;font-weight:950;padding:8px}.devQrPlaceholder{width:100%;height:100%;min-height:120px;display:flex;align-items:center;justify-content:center;border:1px dashed #86efac;border-radius:8px;background:#fff;color:#166534;font-weight:950;text-align:center;padding:8px}@media(max-width:720px){.devQrLogoTop{font-size:13px}.devQrLine{width:96px;height:3px;margin:3px auto 5px}.devQrPerson .devRole{font-size:11px}.devQrBrand{font-size:20px;letter-spacing:.5px;margin-top:5px}.devQrScan{font-size:10px}.devQrPerson .devPhotoFrame img{padding:4px}.devQrPerson .devQrUpdated{font-size:9.5px;margin-top:4px}.devQrPlaceholder{min-height:92px}}</style>`);
  }

  function qrTitleParts(config) {
    return {
      top: escapeHtml(config?.top_text || config?.header || 'CNR SDO HFSAYA'),
      brand: escapeHtml(config?.brand_text || 'AYA DOIT'),
      scan: escapeHtml(config?.bottom_text || 'Scan QR Code'),
      note: escapeHtml(config?.note || 'สแกนเพื่อเปิดข้อมูลเพิ่มเติม')
    };
  }

  function renderDeveloperQrBlock(block, config) {
    block.className = 'devPerson devQrPerson';
    if (!config || config.enabled === false || !config.image_url) {
      block.innerHTML = `<div class="devInfo"><div class="devQrLogoTop">CNR SDO HFSAYA</div><div class="devQrLine"></div><span class="devCode">QR</span><div class="devRole">เว้นพื้นที่ไว้สำหรับอัปโหลด QR Code จากหน้า Admin</div><div class="devQrBrand">AYA DOIT</div><div class="devQrScan">Scan QR Code</div></div><div class="devPhotoFrame"><div class="devQrPlaceholder">รออัปโหลด<br>QR Code</div></div>`;
      return;
    }
    const p = qrTitleParts(config);
    const updated = config.updated_at ? `<small class="devQrUpdated">อัปเดต ${escapeHtml(new Date(config.updated_at).toLocaleString('th-TH'))}</small>` : '';
    block.innerHTML = `<div class="devInfo"><div class="devQrLogoTop">${p.top}</div><div class="devQrLine"></div><span class="devCode">QR</span><div class="devRole">${p.note}</div><div class="devQrBrand">${p.brand}</div><div class="devQrScan">${p.scan}</div>${updated}</div><div class="devPhotoFrame"><img src="${escapeHtml(config.image_url)}" alt="QR Code"></div>`;
  }

  async function injectDeveloperQr() {
    const body = document.querySelector('.devBody');
    if (!body || devQrBusy) return;
    ensureDeveloperQrStyle();
    let block = document.querySelector('#devQrBlock');
    if (!block) {
      body.insertAdjacentHTML('beforeend', `<div class="devPerson devQrPerson" id="devQrBlock"><div class="devInfo"><div class="devQrLogoTop">CNR SDO HFSAYA</div><div class="devQrLine"></div><span class="devCode">QR</span><div class="devRole">กำลังโหลดข้อมูลจากฝั่ง Admin</div><div class="devQrBrand">AYA DOIT</div><div class="devQrScan">Scan QR Code</div></div><div class="devPhotoFrame"><div class="devQrPlaceholder">กำลังโหลด QR</div></div></div>`);
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
    fixes: ['closureNativeCurrentState', 'sendNext', 'doneSummary', 'orderTotal', 'teleTotal', 'developerQrPrivateStorage', 'developerQrPreload', 'developerQrTeamStructure', 'developerQrBrandedLayout']
  };
})();
