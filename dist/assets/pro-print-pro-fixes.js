(() => {
  'use strict';

  if (window.__DOIT_PRO_PRINT_PRO_FIXES__) return;
  window.__DOIT_PRO_PRINT_PRO_FIXES__ = true;

  const SEP = '\u001f';
  const BILL_ROWS = 12;
  const BILLS_PER_A4 = 2;
  const EDIT_KEY = 'doit-pro-print-price-edits-v1';

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const T = value => String(value ?? '').trim();
  const N = value => Number(String(value ?? '').replace(/,/g, '').replace(/[^0-9.\-]/g, '')) || 0;
  const F = value => N(value).toLocaleString('th-TH');
  const B = value => N(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const M = value => Math.floor(N(value));
  const MF = value => M(value).toLocaleString('th-TH');
  const E = value => T(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const ENC = value => encodeURIComponent(String(value ?? ''));
  const DEC = value => {
    try { return decodeURIComponent(String(value ?? '')); }
    catch { return String(value ?? ''); }
  };

  function activeModeLabel() {
    const active = $$('.tab').find(tab => tab.classList.contains('on'));
    return T(active?.textContent);
  }

  function healthNow() {
    try { return (window.DOIT_CORE_APP?.health && window.DOIT_CORE_APP.health()) || {}; }
    catch { return {}; }
  }

  function singleTextValue(selector, label) {
    const text = T($(selector)?.textContent).replace(new RegExp('^' + label + ':\\s*'), '');
    if (!text || text.includes('ทั้งหมด') || text.includes('เลือก') || text.includes('ยังไม่เลือก')) return '';
    return text;
  }

  function currentPs() {
    return singleTextValue('#psText', 'PS');
  }

  function currentReceivers() {
    const health = healthNow();
    if (Array.isArray(health.receivers) && health.receivers.length) return health.receivers.filter(Boolean);
    const text = singleTextValue('#sendText', 'ส่งให้ร้าน');
    return text ? [text] : [];
  }

  function sameArray(a, b) {
    return JSON.stringify(a || []) === JSON.stringify(b || []);
  }

  function scopeOf(sel) {
    return JSON.stringify({ d: sel?.dates || [], p: sel?.ps || [], c: sel?.orderStores || [] });
  }

  function parseKey(key) {
    const text = String(key);
    if (text.includes(SEP)) {
      const parts = text.split(SEP);
      return { scope: parts[0] || '', store: parts[1] || '', pk: parts.slice(2).join(SEP) };
    }
    const parts = text.split('|');
    if (parts.length >= 10) {
      return {
        legacy: true,
        scope: { d: parts[0] || '', p: parts[1] || '', c: parts[2] || '' },
        store: parts[4] || '',
        pk: parts.slice(5).join('|'),
      };
    }
    return { scope: '', store: '', pk: text };
  }

  function scopeOk(parsed, sel) {
    if (!parsed) return false;
    if (parsed.legacy) {
      return parsed.scope.d === (sel?.dates || []).join(',')
        && parsed.scope.p === (sel?.ps || []).join(',')
        && parsed.scope.c === (sel?.orderStores || []).join(',');
    }
    return parsed.scope === scopeOf(sel || {});
  }

  function getState() {
    const ps = currentPs();
    const receivers = currentReceivers();
    const keys = Object.keys(localStorage).filter(key => key.startsWith('doit-core-unified-v1:'));
    let best = null;
    let bestScore = -Infinity;

    keys.forEach(key => {
      try {
        const state = JSON.parse(localStorage.getItem(key) || '{}');
        const sel = state.sel || {};
        if (ps && !(sel.ps || []).includes(ps)) return;
        const manual = Object.keys(state.send || {}).length + Object.keys(state.add || {}).length + Object.keys(state.pull || {}).length;
        const receiverScore = receivers.length && sameArray(sel.receivers || [], receivers) ? 100000 : 0;
        const psScore = ps ? 1000000 : 0;
        const modeScore = state.mode === 'pick' ? 1000 : 0;
        const score = psScore + receiverScore + modeScore + manual;
        if (score > bestScore) {
          bestScore = score;
          best = state;
        }
      } catch {}
    });

    return best;
  }

  function sourceRows(state) {
    const sel = state?.sel || {};
    const q = T(state?.q).toLowerCase();
    return (window.__doitCoreRows || []).filter(row => !row.isTele
      && (!sel.dates?.length || sel.dates.includes(row.date))
      && (!sel.ps?.length || sel.ps.includes(row.ps))
      && !(sel.orderStores || []).includes(row.store)
      && (!sel.brands?.length || sel.brands.includes(row.brand))
      && (!sel.types?.length || sel.types.includes(row.type))
      && (!q || [row.date, row.inv, row.code, row.sku, row.store, row.ps, row.brand, row.type].join(' ').toLowerCase().includes(q)));
  }

  function poolKey(row) {
    return [row.brand, row.size, row.code || row.sku, row.sku, row.type].join('|');
  }

  function groupRows(rows) {
    const map = new Map();
    rows.forEach(row => {
      const key = poolKey(row);
      let item = map.get(key);
      if (!item) {
        item = { poolKey: key, brand: row.brand, size: row.size, code: row.code, sku: row.sku, type: row.type, qty: 0, rawAmt: 0, netAmt: 0, netUnit: 0 };
        map.set(key, item);
      }
      item.qty += N(row.qty);
      item.rawAmt += N(row.rawAmt);
      item.netAmt += N(row.netAmt);
      item.netUnit = item.qty && item.netAmt ? item.netAmt / item.qty : item.netUnit;
    });
    return [...map.values()].sort((a, b) => T(a.brand).localeCompare(T(b.brand), 'th') || T(a.size).localeCompare(T(b.size), 'th') || T(a.sku).localeCompare(T(b.sku), 'th'));
  }

  function insertedGroups(state) {
    return (state?.ins || []).map(item => ({
      poolKey: T(item.id),
      brand: 'แทรกสินค้า',
      size: 'เพิ่มเอง',
      code: T(item.code) || 'INSERT',
      sku: T(item.name) || 'สินค้าแทรก',
      type: 'INSERT',
      qty: N(item.qty),
      rawAmt: N(item.qty) * N(item.unit),
      netAmt: N(item.qty) * N(item.unit),
      netUnit: N(item.unit),
      inserted: true,
    }));
  }

  function mapVal(map, pk, store, sel) {
    let out = 0;
    Object.entries(map || {}).forEach(([key, value]) => {
      const parsed = parseKey(key);
      if (scopeOk(parsed, sel) && parsed.pk === pk && parsed.store === store) out += N(value);
    });
    return out;
  }

  function keyedStores(state) {
    const sel = state?.sel || {};
    const set = new Set();
    [state?.send, state?.add, state?.pull].forEach(map => Object.keys(map || {}).forEach(key => {
      const parsed = parseKey(key);
      if (scopeOk(parsed, sel) && parsed.store) set.add(parsed.store);
    }));
    return [...set];
  }

  function parseIso(value) {
    const text = T(value);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
    const date = new Date(text + 'T00:00:00+07:00');
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function thaiDate(date = new Date()) {
    return date ? date.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'long', year: 'numeric' }) : '-';
  }

  function prevDay(date) {
    const copy = new Date(date.getTime());
    copy.setDate(copy.getDate() - 1);
    return copy;
  }

  function pickSaleDate(state) {
    let date = parseIso((state?.sel?.dates || [])[0]);
    if (!date) {
      const dates = [...new Set(sourceRows(state).map(row => row.date).filter(Boolean))].sort();
      date = parseIso(dates[0]);
    }
    return date ? thaiDate(prevDay(date)) : '-';
  }

  function rowsForStore(state, store, pool) {
    const out = [];
    pool.forEach(item => {
      const send = mapVal(state.send, item.poolKey, store, state.sel);
      const add = mapVal(state.add, item.poolKey, store, state.sel);
      const pull = mapVal(state.pull, item.poolKey, store, state.sel);
      const qty = send + add - pull;
      if (!qty) return;
      out.push({ code: item.code || '', name: item.sku, qty, unit: N(item.netUnit) * 1.07, poolKey: item.poolKey });
    });
    return out.filter(row => T(row.name) && N(row.qty) > 0);
  }

  function buildBills() {
    const state = getState();
    if (!state) return [];
    const receivers = (state.sel?.receivers || []).filter(Boolean);
    const pool = groupRows(sourceRows(state)).concat(insertedGroups(state));
    const keyed = keyedStores(state);
    const stores = [...receivers.filter(store => keyed.includes(store)), ...keyed.filter(store => !receivers.includes(store))];
    const bills = [];

    stores.forEach((store, storeSeq) => {
      const rows = rowsForStore(state, store, pool);
      if (!rows.length) return;
      const storeTotal = rows.reduce((sum, row) => sum + M(row.qty * row.unit), 0);
      const partCount = Math.ceil(rows.length / BILL_ROWS);
      for (let i = 0; i < rows.length; i += BILL_ROWS) {
        const chunk = rows.slice(i, i + BILL_ROWS);
        const partNo = Math.floor(i / BILL_ROWS) + 1;
        bills.push({ store, rows: chunk, storeTotal, total: storeTotal, state, startNo: i + 1, partNo, partCount, isLastStorePart: partNo === partCount, storeSeq });
      }
    });
    return bills;
  }

  function metaRows(bill) {
    return [['ชื่อร้าน', bill.store || '-'], ['วันที่ขาย', pickSaleDate(bill.state)], ['วันที่ส่ง', thaiDate(new Date())]];
  }

  function blankRows(count) {
    return Array.from({ length: Math.max(0, BILL_ROWS - count) }, () => '<tr class="blankLine"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>').join('');
  }

  function editMap() {
    try { return JSON.parse(localStorage.getItem(EDIT_KEY) || '{}'); }
    catch { return {}; }
  }

  function editScope(state) {
    return scopeOf(state?.sel || {});
  }

  function lineEditKey(bill, row) {
    return [editScope(bill.state), bill.store || '', row.code || '', row.name || ''].join(SEP);
  }

  function getLineEdit(key) {
    return editMap()[key] || null;
  }

  function saveLineEdit(key, qty, unit) {
    if (!key) return;
    const map = editMap();
    map[key] = { qty: N(qty), unit: N(unit), ts: Date.now() };
    localStorage.setItem(EDIT_KEY, JSON.stringify(map));
  }

  function receiptHtml(bill, index) {
    const doc = 'DOIT-' + Date.now().toString().slice(-8) + '-' + (index + 1);
    const ps = bill.state.sel?.ps?.length ? bill.state.sel.ps.join(', ') : 'ทั้งหมด';
    const meta = metaRows(bill).map(([key, value]) => `<div contenteditable="true"><b>${E(key)}:</b> <span>${E(value)}</span></div>`).join('');
    const heads = ['รหัส', 'รายการสินค้า', 'จำนวน', 'ราคา/หน่วย', 'รวมเงิน'];
    const headHtml = heads.map(head => `<th>${E(head)}</th>`).join('');
    const body = bill.rows.map((row, rowIndex) => {
      const key = lineEditKey(bill, row);
      const edit = getLineEdit(key);
      const qty = edit ? N(edit.qty) : N(row.qty);
      const unit = edit ? N(edit.unit) : N(row.unit);
      const values = [row.code, row.name, F(qty), B(unit), MF(qty * unit)];
      return `<tr data-line data-edit-key="${E(ENC(key))}"><td class="c">${(bill.startNo || 1) + rowIndex}</td>${values.map((value, valueIndex) => `<td class="${valueIndex >= 2 ? 'r' : ''} ${valueIndex === 1 ? 'itemName' : ''} ${valueIndex === 2 ? 'rq' : ''} ${valueIndex === 3 ? 'ru' : ''} ${valueIndex === 4 ? 'rt' : ''}" contenteditable="${valueIndex === 4 ? 'false' : 'true'}">${E(value)}</td>`).join('')}</tr>`;
    }).join('');
    const totalLabel = bill.isLastStorePart ? 'รวมทั้งหมด' : `ต่อใบถัดไป (${bill.partNo || 1}/${bill.partCount || 1})`;
    const totalValue = bill.isLastStorePart ? F(bill.storeTotal) : '';
    const foot = `<tr class="totalRow"><td colspan="${heads.length}" class="r" contenteditable="true">${E(totalLabel)}</td><td class="r" data-page-total="${bill.isLastStorePart ? '1' : '0'}">${E(totalValue)}</td></tr>`;
    return `<section class="receiptPage" data-store-seq="${E(bill.storeSeq ?? index)}" data-last-part="${bill.isLastStorePart ? '1' : '0'}"><div class="receiptTop"><div class="titleWrap"><h1 class="receiptTitle" contenteditable="true">บิลสินค้า/ ใบเสร็จ</h1></div><div class="docBox"><div contenteditable="true"><b>เลขที่เอกสาร:</b> ${E(doc)}</div><div contenteditable="true"><b>รหัส PS:</b> ${E(ps)}</div></div></div><div class="metaGrid compactMeta">${meta}</div><table class="receiptTable"><thead><tr><th style="width:24px">#</th>${headHtml}</tr></thead><tbody>${body}${blankRows(bill.rows.length)}${foot}</tbody></table><div class="noteBox" contenteditable="true">หมายเหตุ: </div><div class="signGrid"><div class="signBox" contenteditable="true">ผู้ส่งสินค้า / ผู้จัดทำ</div><div class="signBox" contenteditable="true">ผู้รับสินค้า</div></div></section>`;
  }

  function billPagesHtml(bills) {
    const pages = [];
    for (let i = 0; i < bills.length; i += BILLS_PER_A4) pages.push(bills.slice(i, i + BILLS_PER_A4));
    return pages.map((page, pageIndex) => `<div class="a4Sheet">${page.map((bill, index) => receiptHtml(bill, pageIndex * BILLS_PER_A4 + index)).join('')}${Array.from({ length: BILLS_PER_A4 - page.length }, () => '<section class="receiptPage emptyBill"></section>').join('')}</div>`).join('');
  }

  function recalcReceiptPage(page, persist = false) {
    page.querySelectorAll('tr[data-line]').forEach(row => {
      const qty = N(row.querySelector('.rq')?.textContent);
      const unit = N(row.querySelector('.ru')?.textContent);
      const total = M(qty * unit);
      const totalCell = row.querySelector('.rt');
      if (persist) saveLineEdit(DEC(row.dataset.editKey || ''), qty, unit);
      if (totalCell) totalCell.textContent = F(total);
    });

    const totalEl = page.querySelector('[data-page-total]');
    if (!totalEl) return;
    if (totalEl.getAttribute('data-page-total') === '0') {
      totalEl.textContent = '';
      return;
    }

    const root = page.closest('.printOverlay') || document;
    const seq = page.dataset.storeSeq;
    let total = 0;
    root.querySelectorAll(`.receiptPage[data-store-seq="${seq}"] tr[data-line]`).forEach(row => {
      total += M(N(row.querySelector('.rq')?.textContent) * N(row.querySelector('.ru')?.textContent));
    });
    totalEl.textContent = F(total);
  }

  function openAutoPrint(bills) {
    const overlay = document.createElement('div');
    overlay.className = 'printOverlay printMobileSafeA4';
    overlay.innerHTML = `<div class="printBar"><b>ตรวจ/แก้ไขก่อนปริ้น — A4 มือถือ กันเครื่องปริ้นกินขอบ</b><span><button onclick="this.closest('.printOverlay').remove()">ปิด</button> <button onclick="window.print()">ปริ้น</button></span></div>${billPagesHtml(bills)}`;
    document.body.appendChild(overlay);
    overlay.querySelectorAll('.receiptPage').forEach(page => recalcReceiptPage(page, false));
    overlay.addEventListener('input', event => {
      if (event.target.closest('.receiptTable')) overlay.querySelectorAll('.receiptPage').forEach(page => recalcReceiptPage(page, true));
    });
    overlay.addEventListener('blur', event => {
      if (event.target.closest('.receiptTable')) overlay.querySelectorAll('.receiptPage').forEach(page => recalcReceiptPage(page, true));
    }, true);
  }

  function handlePrepClick(event) {
    const button = event.target.closest('#prepPrint');
    if (!button || !activeModeLabel().includes('ถอดของ Pro')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const bills = buildBills();
    if (!bills.length) {
      alert('ยังไม่ได้กรอกจำนวนส่งให้ร้าน จึงไม่สามารถเตรียมปริ้นได้');
      return;
    }
    openAutoPrint(bills);
  }

  function doneRows() {
    const state = getState();
    if (!state) return [];
    const pool = groupRows(sourceRows(state)).concat(insertedGroups(state));
    const stores = keyedStores(state);
    const rows = [];
    pool.forEach(item => {
      let qty = 0;
      stores.forEach(store => {
        qty += mapVal(state.send, item.poolKey, store, state.sel) + mapVal(state.add, item.poolKey, store, state.sel) - mapVal(state.pull, item.poolKey, store, state.sel);
      });
      if (qty > 0) rows.push({ name: item.sku, qty, total: M(qty * N(item.netUnit) * 1.07) });
    });
    return rows;
  }

  function updateDoneMode() {
    if (!activeModeLabel().includes('จัดแล้ว')) return;
    const table = $('#table');
    const tableCount = $('#tableCount');
    if (!table || !tableCount) return;
    const rows = doneRows();
    const total = rows.reduce((sum, row) => sum + row.total, 0);
    const signature = JSON.stringify(rows.map(row => [row.name, row.qty, row.total]));
    if (table.dataset.proDoneTotalSignature === signature) return;
    table.dataset.proDoneTotalSignature = signature;
    tableCount.textContent = `จัดแล้ว ${F(rows.length)} รายการ · รวมราคาส่งทั้งหมด ${F(total)} บาท`;
    table.innerHTML = `<thead><tr><th>#</th><th>สินค้า</th><th>จำนวนที่ส่งทั้งหมด</th><th>ราคารวมส่ง</th></tr></thead><tbody>${rows.length ? rows.map((row, index) => `<tr><td>${index + 1}</td><td>${E(row.name)}</td><td>${F(row.qty)}</td><td>${F(row.total)}</td></tr>`).join('') : '<tr><td colspan="4" class="empty">ไม่มีข้อมูล</td></tr>'}</tbody>`;
  }

  document.addEventListener('click', handlePrepClick, true);
  const observer = new MutationObserver(() => updateDoneMode());
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  setInterval(updateDoneMode, 600);
})();
