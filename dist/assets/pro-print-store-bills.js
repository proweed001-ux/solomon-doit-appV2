(() => {
  'use strict';

  if (window.__DOIT_PRO_PRINT_STORE_BILLS__) return;
  window.__DOIT_PRO_PRINT_STORE_BILLS__ = true;

  const SEP = '\u001f';
  const BILL_ROWS = 12;
  const BILLS_PER_A4 = 2;
  const EDIT_KEY = 'doit-pro-print-price-edits-v1';

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const T = v => String(v ?? '').trim();
  const N = v => Number(String(v ?? '').replace(/,/g, '').replace(/[^0-9.\-]/g, '')) || 0;
  const F = n => N(n).toLocaleString('th-TH');
  const B = n => N(n).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const E = s => T(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ENC = s => encodeURIComponent(String(s ?? ''));
  const DEC = s => {
    try { return decodeURIComponent(String(s ?? '')); }
    catch { return String(s ?? ''); }
  };

  function parseIso(value) {
    const text = T(value);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
    const d = new Date(text + 'T00:00:00+07:00');
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function thaiDate(d = new Date()) {
    return d ? d.toLocaleDateString('th-TH', {
      timeZone: 'Asia/Bangkok',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) : '-';
  }

  function prevDay(d) {
    const x = new Date(d.getTime());
    x.setDate(x.getDate() - 1);
    return x;
  }

  function scopeOf(sel) {
    return JSON.stringify({
      d: sel?.dates || [],
      p: sel?.ps || [],
      c: sel?.orderStores || [],
    });
  }

  function parseKey(key) {
    const s = String(key);
    if (s.includes(SEP)) {
      const p = s.split(SEP);
      return { scope: p[0] || '', store: p[1] || '', pk: p.slice(2).join(SEP) };
    }
    const p = s.split('|');
    if (p.length >= 10) {
      return {
        legacy: true,
        scope: { d: p[0] || '', p: p[1] || '', c: p[2] || '' },
        store: p[4] || '',
        pk: p.slice(5).join('|'),
      };
    }
    return { scope: '', store: '', pk: s };
  }

  function scopeOk(parsed, sel) {
    if (!parsed) return false;
    if (parsed.legacy) {
      return parsed.scope.d === (sel?.dates || []).join(',')
        && parsed.scope.p === (sel?.ps || []).join(',')
        && parsed.scope.c === (sel?.orderStores || []).join(',');
    }
    return parsed.scope === scopeOf(sel);
  }

  function healthNow() {
    try {
      return (window.DOIT_CORE_APP && window.DOIT_CORE_APP.health && window.DOIT_CORE_APP.health()) || {};
    } catch {
      return {};
    }
  }

  function sameArr(a, b) {
    return JSON.stringify(a || []) === JSON.stringify(b || []);
  }

  function getState() {
    const health = healthNow();
    const currentReceivers = Array.isArray(health.receivers) ? health.receivers.filter(Boolean) : [];
    const keys = Object.keys(localStorage).filter(k => k.startsWith('doit-core-unified-v1:'));
    let best = null;
    let bestScore = -1;

    keys.forEach(key => {
      try {
        const state = JSON.parse(localStorage.getItem(key) || '{}');
        const manual = Object.keys(state.send || {}).length
          + Object.keys(state.add || {}).length
          + Object.keys(state.pull || {}).length;
        const receiverScore = currentReceivers.length && sameArr(state.sel?.receivers || [], currentReceivers) ? 100000 : 0;
        const score = manual + receiverScore;
        if (currentReceivers.length && bestScore >= 100000 && !receiverScore) return;
        if (score > bestScore) {
          bestScore = score;
          best = state;
        }
      } catch {}
    });

    return best;
  }

  function sourceRows(state) {
    const sel = state.sel || {};
    const q = T(state.q).toLowerCase();
    return (window.__doitCoreRows || []).filter(r => !r.isTele
      && (!sel.dates?.length || sel.dates.includes(r.date))
      && (!sel.ps?.length || sel.ps.includes(r.ps))
      && !(sel.orderStores || []).includes(r.store)
      && (!sel.brands?.length || sel.brands.includes(r.brand))
      && (!sel.types?.length || sel.types.includes(r.type))
      && (!q || [r.date, r.inv, r.code, r.sku, r.store, r.ps, r.brand, r.type].join(' ').toLowerCase().includes(q)));
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
        item = {
          poolKey: key,
          brand: row.brand,
          size: row.size,
          code: row.code,
          sku: row.sku,
          type: row.type,
          qty: 0,
          rawAmt: 0,
          netAmt: 0,
          netUnit: 0,
        };
        map.set(key, item);
      }
      item.qty += N(row.qty);
      item.rawAmt += N(row.rawAmt);
      item.netAmt += N(row.netAmt);
      item.netUnit = item.qty && item.netAmt ? item.netAmt / item.qty : item.netUnit;
    });

    return [...map.values()].sort((a, b) => (
      T(a.brand).localeCompare(T(b.brand), 'th')
      || T(a.size).localeCompare(T(b.size), 'th')
      || T(a.sku).localeCompare(T(b.sku), 'th')
    ));
  }

  function insertedGroups(state) {
    return (state.ins || []).map(x => ({
      poolKey: T(x.id),
      brand: 'แทรกสินค้า',
      size: 'เพิ่มเอง',
      code: T(x.code) || 'INSERT',
      sku: T(x.name) || 'สินค้าแทรก',
      type: 'INSERT',
      qty: N(x.qty),
      rawAmt: N(x.qty) * N(x.unit),
      netAmt: N(x.qty) * N(x.unit),
      netUnit: N(x.unit),
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
    const sel = state.sel || {};
    const set = new Set();
    [state.send, state.add, state.pull].forEach(map => Object.keys(map || {}).forEach(key => {
      const parsed = parseKey(key);
      if (scopeOk(parsed, sel) && parsed.store) set.add(parsed.store);
    }));
    return [...set];
  }

  function pickSaleDate(state) {
    let d = parseIso((state.sel?.dates || [])[0]);
    if (!d) {
      const dates = [...new Set(sourceRows(state).map(r => r.date).filter(Boolean))].sort();
      d = parseIso(dates[0]);
    }
    return d ? thaiDate(prevDay(d)) : '-';
  }

  function rowsForStore(state, store, pool) {
    const out = [];
    pool.forEach(item => {
      const send = mapVal(state.send, item.poolKey, store, state.sel);
      const add = mapVal(state.add, item.poolKey, store, state.sel);
      const pull = mapVal(state.pull, item.poolKey, store, state.sel);
      const qty = send + add - pull;
      if (!qty) return;
      out.push({
        code: item.code || '',
        name: item.sku,
        qty,
        unit: N(item.netUnit) * 1.07,
      });
    });
    return out.filter(x => T(x.name) && N(x.qty) > 0);
  }

  function buildBills() {
    const state = getState();
    if (!state) return [];

    const receivers = (state.sel?.receivers || []).filter(Boolean);
    const pool = groupRows(sourceRows(state)).concat(insertedGroups(state));
    const keyed = keyedStores(state);
    const stores = [
      ...receivers.filter(s => keyed.includes(s)),
      ...keyed.filter(s => !receivers.includes(s)),
    ];
    if (!stores.length) return [];

    const bills = [];
    stores.forEach((store, storeSeq) => {
      const rows = rowsForStore(state, store, pool);
      if (!rows.length) return;

      const storeTotal = rows.reduce((s, x) => s + x.qty * x.unit, 0);
      const partCount = Math.ceil(rows.length / BILL_ROWS);

      for (let i = 0; i < rows.length; i += BILL_ROWS) {
        const chunk = rows.slice(i, i + BILL_ROWS);
        const partNo = Math.floor(i / BILL_ROWS) + 1;
        const pageTotal = chunk.reduce((s, x) => s + x.qty * x.unit, 0);
        bills.push({
          store,
          rows: chunk,
          pageTotal,
          storeTotal,
          total: storeTotal,
          state,
          startNo: i + 1,
          partNo,
          partCount,
          isLastStorePart: partNo === partCount,
          storeSeq,
        });
      }
    });

    return bills;
  }

  function metaRows(bill) {
    return [
      ['ชื่อร้าน', bill.store || '-'],
      ['วันที่ขาย', pickSaleDate(bill.state)],
      ['วันที่ส่ง', thaiDate(new Date())],
    ];
  }

  function blankRows(n) {
    return Array.from({ length: Math.max(0, BILL_ROWS - n) }, () => (
      '<tr class="blankLine"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'
    )).join('');
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

  function receiptHtml(bill, idx) {
    const doc = 'DOIT-' + Date.now().toString().slice(-8) + '-' + (idx + 1);
    const title = 'บิลสินค้า/ ใบเสร็จ';
    const heads = ['รหัส', 'รายการสินค้า', 'จำนวน', 'ราคา/หน่วย', 'รวมเงิน'];
    const ps = bill.state.sel?.ps?.length ? bill.state.sel.ps.join(', ') : 'ทั้งหมด';
    const meta = metaRows(bill).map(([k, v]) => (
      `<div contenteditable="true"><b>${E(k)}:</b> <span>${E(v)}</span></div>`
    )).join('');
    const headHtml = heads.map(x => `<th>${E(x)}</th>`).join('');
    const body = bill.rows.map((x, i) => {
      const key = lineEditKey(bill, x);
      const edit = getLineEdit(key);
      const qty = edit ? N(edit.qty) : N(x.qty);
      const unit = edit ? N(edit.unit) : N(x.unit);
      const row = [x.code, x.name, F(qty), B(unit), B(qty * unit)];
      return `<tr data-line data-edit-key="${E(ENC(key))}"><td class="c">${(bill.startNo || 1) + i}</td>${row.map((v, j) => `<td class="${j >= 2 ? 'r' : ''} ${j === 1 ? 'itemName' : ''} ${j === 2 ? 'rq' : ''} ${j === 3 ? 'ru' : ''} ${j === 4 ? 'rt' : ''}" contenteditable="${j === 4 ? 'false' : 'true'}">${E(v)}</td>`).join('')}</tr>`;
    }).join('');
    const totalLabel = bill.isLastStorePart ? 'รวมทั้งหมด' : `ต่อใบถัดไป (${bill.partNo || 1}/${bill.partCount || 1})`;
    const totalValue = bill.isLastStorePart ? B(bill.storeTotal) : '';
    const foot = `<tr class="totalRow"><td colspan="${heads.length}" class="r" contenteditable="true">${E(totalLabel)}</td><td class="r" data-page-total="${bill.isLastStorePart ? '1' : '0'}">${E(totalValue)}</td></tr>`;

    return `<section class="receiptPage" data-store-seq="${E(bill.storeSeq ?? idx)}" data-last-part="${bill.isLastStorePart ? '1' : '0'}"><div class="receiptTop"><div class="titleWrap"><h1 class="receiptTitle" contenteditable="true">${E(title)}</h1></div><div class="docBox"><div contenteditable="true"><b>เลขที่เอกสาร:</b> ${E(doc)}</div><div contenteditable="true"><b>รหัส PS:</b> ${E(ps)}</div></div></div><div class="metaGrid compactMeta">${meta}</div><table class="receiptTable"><thead><tr><th style="width:24px">#</th>${headHtml}</tr></thead><tbody>${body}${blankRows(bill.rows.length)}${foot}</tbody></table><div class="noteBox" contenteditable="true">หมายเหตุ: </div><div class="signGrid"><div class="signBox" contenteditable="true">ผู้ส่งสินค้า / ผู้จัดทำ</div><div class="signBox" contenteditable="true">ผู้รับสินค้า</div></div></section>`;
  }

  function billPagesHtml(bills) {
    const sorted = [...bills].map((bill, i) => ({ ...bill, _srcIndex: i, _itemCount: (bill.rows || []).length }));
    const pages = [];
    for (let i = 0; i < sorted.length; i += BILLS_PER_A4) pages.push(sorted.slice(i, i + BILLS_PER_A4));
    return pages.map((page, pageIndex) => `<div class="a4Sheet">${page.map((bill, i) => receiptHtml(bill, pageIndex * BILLS_PER_A4 + i)).join('')}${Array.from({ length: BILLS_PER_A4 - page.length }, () => '<section class="receiptPage emptyBill"></section>').join('')}</div>`).join('');
  }

  function recalcReceiptPage(page, persist = false) {
    page.querySelectorAll('tr[data-line]').forEach(tr => {
      const qty = N(tr.querySelector('.rq')?.textContent);
      const unit = N(tr.querySelector('.ru')?.textContent);
      const total = qty * unit;
      const totalCell = tr.querySelector('.rt');
      if (persist) saveLineEdit(DEC(tr.dataset.editKey || ''), qty, unit);
      if (totalCell) totalCell.textContent = B(total);
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
    root.querySelectorAll(`.receiptPage[data-store-seq="${seq}"] tr[data-line]`).forEach(tr => {
      total += N(tr.querySelector('.rq')?.textContent) * N(tr.querySelector('.ru')?.textContent);
    });
    totalEl.textContent = B(total);
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

    return overlay;
  }

  function handlePrep(event) {
    const active = $$('.tab').find(tab => tab.classList.contains('on'));
    if (!active || !T(active.textContent).includes('ถอดของ Pro')) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const bills = buildBills();
    if (!bills.length) {
      alert('ยังไม่ได้กรอกจำนวนส่งให้ร้าน จึงไม่สามารถเตรียมปริ้นได้');
      return;
    }
    openAutoPrint(bills);
  }

  function install() {
    let tries = 0;
    const tick = () => {
      tries += 1;
      const btn = $('#prepPrint');
      if (btn && btn.dataset.printStoreBillsInstalled !== '1') {
        btn.dataset.printStoreBillsInstalled = '1';
        btn.addEventListener('click', handlePrep, true);
      }
      if (tries < 80) setTimeout(tick, 250);
    };
    tick();
  }

  install();
})();
