(() => {
  'use strict';

  if (window.__DOIT_PRO_PRINT_MODE_FIXES__) return;
  window.__DOIT_PRO_PRINT_MODE_FIXES__ = true;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const T = value => String(value ?? '').trim();
  const N = value => Number(String(value ?? '').replace(/,/g, '').replace(/[^0-9.\-]/g, '')) || 0;
  const F = value => N(value).toLocaleString('th-TH');
  const B = value => N(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const E = value => T(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  function ensureStyle() {
    if ($('#proPrintModeFixCss')) return;
    const style = document.createElement('style');
    style.id = 'proPrintModeFixCss';
    style.textContent = `
      .proPrintFix {
        position: fixed;
        inset: 0;
        z-index: 10020;
        overflow: auto;
        background: #e5e7eb;
        color: #111;
        font-family: system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif;
      }
      .proPrintFix .printBar {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        gap: 8px;
        align-items: center;
        padding: 8px 10px;
        background: #fff;
        border-bottom: 1px solid #111;
        font-size: 14px;
        font-weight: 900;
      }
      .proPrintFix .printBar button {
        height: 34px;
        padding: 0 12px;
        border-radius: 8px;
        border: 1px solid #111;
        background: #fff;
        font-weight: 900;
      }
      .proPrintFix .receiptPage {
        width: 194mm;
        min-height: 277mm;
        margin: 8mm auto;
        padding: 8mm;
        box-sizing: border-box;
        background: #fff;
      }
      .proPrintFix.orderPrintFix .receiptPage {
        min-height: auto;
        margin-top: 3mm;
        margin-bottom: 3mm;
        padding-top: 4mm;
        padding-bottom: 4mm;
      }
      .proPrintFix .receiptTop {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: flex-end;
        padding-bottom: 7px;
        margin-bottom: 8px;
        border-bottom: 2px solid #111;
      }
      .proPrintFix .receiptTitle {
        margin: 0;
        font-size: 23px;
        line-height: 1.1;
        font-weight: 950;
      }
      .proPrintFix .docBox {
        font-size: 13px;
        line-height: 1.45;
        text-align: right;
        white-space: nowrap;
      }
      .proPrintFix .metaGrid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px 12px;
        border: 1px solid #111;
        padding: 7px 8px;
        margin-bottom: 9px;
        font-size: 13.5px;
        line-height: 1.35;
      }
      .proPrintFix .receiptTable {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 13.2px;
        line-height: 1.25;
      }
      .proPrintFix .receiptTable th,
      .proPrintFix .receiptTable td {
        border: 1px solid #111;
        padding: 4.6px 5px;
        vertical-align: top;
      }
      .proPrintFix .receiptTable th {
        background: #f3f4f6;
        font-weight: 950;
        text-align: center;
      }
      .proPrintFix .receiptTable th:first-child,
      .proPrintFix .receiptTable td:first-child {
        width: 34px;
        text-align: center;
      }
      .proPrintFix .receiptTable th:nth-child(2),
      .proPrintFix .receiptTable td:nth-child(2) {
        width: auto;
      }
      .proPrintFix .receiptTable th:not(:nth-child(2)),
      .proPrintFix .receiptTable td:not(:nth-child(2)) {
        text-align: right;
      }
      .proPrintFix .receiptTable td:nth-child(2) {
        text-align: left;
        word-break: break-word;
        font-size: 13.8px;
        font-weight: 750;
      }
      .proPrintFix .totalRow td {
        font-weight: 950;
        background: #f9fafb;
      }
      .proPrintFix .noteBox {
        border: 1px solid #777;
        min-height: 28px;
        margin-top: 10px;
        padding: 6px 8px;
        font-size: 13px;
      }
      .proPrintFix .signGrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 38px;
        margin-top: 30px;
      }
      .proPrintFix .signBox {
        border-top: 1px solid #111;
        padding-top: 6px;
        text-align: center;
        font-size: 13px;
      }
      @media print {
        body > *:not(.proPrintFix) { display: none !important; }
        .proPrintFix {
          position: static !important;
          overflow: visible !important;
          background: #fff !important;
        }
        .proPrintFix .printBar { display: none !important; }
        .proPrintFix .receiptPage {
          width: auto !important;
          min-height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .proPrintFix.orderPrintFix .receiptPage {
          padding-top: 4mm !important;
          padding-bottom: 4mm !important;
        }
        .proPrintFix .receiptTable th {
          background: #eee !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function thaiDate(date = new Date()) {
    return date.toLocaleDateString('th-TH', {
      timeZone: 'Asia/Bangkok',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function activeModeLabel() {
    const active = $$('.tab').find(tab => tab.classList.contains('on'));
    return T(active?.textContent);
  }

  function isPickMode(label) {
    return label.includes('ถอดของ Pro');
  }

  function isOrderMode(label) {
    const normalized = label.toLowerCase().replace(/\s+/g, '');
    return normalized.includes('รวมorder') || normalized.includes('รวมออเดอร์');
  }

  function tableHeadsFromDom() {
    const heads = $$('#table thead th').map(th => T(th.innerText || th.textContent)).filter(Boolean);
    return heads[0] === '#' ? heads.slice(1) : heads;
  }

  function isTotalLikeRow(tr, row) {
    if (tr.classList.contains('totalRow')) return true;
    const text = row.join(' ');
    return /^รวมทั้งหมด\b/.test(text) || /^รวมสุทธิ\+?7%\b/.test(text);
  }

  function tableRowsFromDom() {
    return $$('#table tbody tr')
      .map(tr => ({
        tr,
        row: [...tr.children].map(td => {
          const input = td.querySelector('input');
          return input ? T(input.value) : T(td.innerText || td.textContent);
        }),
      }))
      .filter(({ row }) => row.length && row.join('').trim() && !/ไม่มีข้อมูล|โหลดไฟล์|เลือก “ส่งให้ร้าน”/.test(row.join(' ')))
      .filter(({ tr, row }) => !isTotalLikeRow(tr, row))
      .map(({ row }) => row[0] === '#' || /^\d+$/.test(row[0]) ? row.slice(1) : row);
  }

  function orderPrintShape(heads, rows) {
    const find = patterns => heads.findIndex(head => patterns.some(pattern => head.includes(pattern)));
    const itemIndex = find(['สินค้า', 'รายการ']);
    const qtyIndex = find(['จำนวนรวม', 'จำนวน', 'ชิ้น']);
    const vatIndex = find(['รวม VAT', 'สุทธิ+7%', 'สุทธิ +7%', 'VAT']);
    const safeItem = itemIndex >= 0 ? itemIndex : 0;
    const safeQty = qtyIndex >= 0 ? qtyIndex : 1;
    const safeVat = vatIndex >= 0 ? vatIndex : heads.length - 1;
    return {
      heads: ['สินค้า', 'จำนวนรวม', 'สุทธิ+7%'],
      rows: rows.map(row => [row[safeItem] || '', row[safeQty] || '', row[safeVat] || '']),
      total: rows.reduce((sum, row) => sum + N(row[safeVat]), 0),
    };
  }

  function metaRows(title) {
    const dateText = T($('#datesText')?.textContent).replace(/^วันที่:\s*/, '') || 'ทั้งหมด';
    const psText = T($('#psText')?.textContent).replace(/^PS:\s*/, '') || 'ทั้งหมด';
    return [
      ['เอกสาร', title],
      ['วันที่พิมพ์', thaiDate(new Date())],
      ['วันที่', dateText],
      ['PS', psText],
    ];
  }

  function openPrint(title, heads, rows, options = {}) {
    ensureStyle();
    const docNo = 'DOIT-' + Date.now().toString().slice(-8);
    const meta = metaRows(title).map(([key, value]) => `<div contenteditable="true"><b>${E(key)}:</b> ${E(value)}</div>`).join('');
    const headHtml = heads.map(head => `<th>${E(head)}</th>`).join('');
    const bodyHtml = rows.map((row, index) => (
      `<tr><td>${index + 1}</td>${row.map((value, colIndex) => `<td contenteditable="true" class="${colIndex >= 1 ? 'r' : ''}">${E(value)}</td>`).join('')}</tr>`
    )).join('');
    const totalHtml = options.total != null
      ? `<tr class="totalRow"><td colspan="${heads.length}" class="r">รวมสุทธิ+7%</td><td class="r">${E(B(options.total))}</td></tr>`
      : '';

    const overlay = document.createElement('div');
    overlay.className = `printOverlay proPrintFix ${options.printClass || ''}`.trim();
    overlay.innerHTML = `
      <div class="printBar"><b>ตรวจ/แก้ไขก่อนปริ้น — ${E(title)}</b><span><button onclick="this.closest('.printOverlay').remove()">ปิด</button> <button onclick="window.print()">ปริ้น</button></span></div>
      <section class="receiptPage">
        <div class="receiptTop"><h1 class="receiptTitle" contenteditable="true">${E(title)}</h1><div class="docBox"><div contenteditable="true"><b>เลขที่เอกสาร:</b> ${E(docNo)}</div></div></div>
        <div class="metaGrid">${meta}</div>
        <table class="receiptTable"><thead><tr><th>#</th>${headHtml}</tr></thead><tbody>${bodyHtml}${totalHtml}</tbody></table>
        <div class="noteBox" contenteditable="true">หมายเหตุ: </div>
        <div class="signGrid"><div class="signBox" contenteditable="true">ผู้ส่งสินค้า / ผู้จัดทำ</div><div class="signBox" contenteditable="true">ผู้รับสินค้า</div></div>
      </section>`;
    document.body.appendChild(overlay);
  }

  function handlePrint(event) {
    const label = activeModeLabel();
    if (!label || isPickMode(label)) return;

    let heads = tableHeadsFromDom();
    let rows = tableRowsFromDom();
    if (!rows.length) return;

    let total = null;
    let title = label;
    let printClass = '';
    if (isOrderMode(label)) {
      const order = orderPrintShape(heads, rows);
      heads = order.heads;
      rows = order.rows;
      total = order.total;
      title = 'รวมออเดอร์';
      printClass = 'orderPrintFix';
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    openPrint(title, heads, rows, { total, printClass });
  }

  function install() {
    let tries = 0;
    const tick = () => {
      tries += 1;
      const button = $('#prepPrint');
      if (button && button.dataset.printModeFixInstalled !== '1') {
        button.dataset.printModeFixInstalled = '1';
        button.addEventListener('click', handlePrint, true);
      }
      if (tries < 80) setTimeout(tick, 250);
    };
    tick();
  }

  install();
})();
