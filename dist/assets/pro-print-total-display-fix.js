(() => {
  'use strict';

  if (window.__DOIT_PRO_TOTAL_DISPLAY_FIX__) return;
  window.__DOIT_PRO_TOTAL_DISPLAY_FIX__ = true;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const T = value => String(value ?? '').trim();
  const N = value => Number(String(value ?? '').replace(/,/g, '').replace(/[^0-9.\-]/g, '')) || 0;
  const B = value => N(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const F = value => Math.floor(N(value)).toLocaleString('th-TH');
  const E = value => T(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  function activeModeLabel() {
    const active = $$('.tab').find(tab => tab.classList.contains('on'));
    return T(active?.textContent);
  }

  function fixPrintTotals() {
    const overlay = $('.printOverlay.printMobileSafeA4');
    if (!overlay) return;

    overlay.querySelectorAll('.receiptPage:not(.emptyBill)').forEach(page => {
      page.querySelectorAll('tr[data-line]').forEach(row => {
        const qty = N(row.querySelector('.rq')?.textContent);
        const unit = N(row.querySelector('.ru')?.textContent);
        const totalCell = row.querySelector('.rt');
        if (totalCell) totalCell.textContent = B(qty * unit);
      });
    });

    overlay.querySelectorAll('.receiptPage[data-last-part="1"]').forEach(page => {
      const totalCell = page.querySelector('[data-page-total="1"]');
      if (!totalCell) return;
      const seq = page.dataset.storeSeq;
      let total = 0;
      overlay.querySelectorAll(`.receiptPage[data-store-seq="${seq}"] tr[data-line]`).forEach(row => {
        total += N(row.querySelector('.rq')?.textContent) * N(row.querySelector('.ru')?.textContent);
      });
      totalCell.textContent = F(total);
    });
  }

  function fixDoneModeFromVisibleTable() {
    if (!activeModeLabel().includes('จัดแล้ว')) return;
    const table = $('#table');
    const tableCount = $('#tableCount');
    if (!table || !tableCount) return;

    const heads = [...table.querySelectorAll('thead th')].map(th => T(th.textContent));
    if (heads.includes('ราคารวมส่ง') && tableCount.textContent.includes('รวมราคาส่งทั้งหมด')) return;

    const bodyRows = [...table.querySelectorAll('tbody tr')]
      .map(row => [...row.children].map(cell => T(cell.textContent)))
      .filter(cols => cols.length >= 4 && !cols.join(' ').includes('ไม่มีข้อมูล'));

    if (!bodyRows.length) return;

    const normalized = bodyRows.map((cols, index) => {
      const name = cols[1] || cols[0] || '';
      const qty = cols[2] || '0';
      const totalSource = cols[5] || cols[3] || '0';
      const total = Math.floor(N(totalSource));
      return { no: index + 1, name, qty, total };
    }).filter(row => row.name);

    const totalAll = normalized.reduce((sum, row) => sum + row.total, 0);
    tableCount.textContent = `จัดแล้ว ${normalized.length.toLocaleString('th-TH')} รายการ · รวมราคาส่งทั้งหมด ${totalAll.toLocaleString('th-TH')} บาท`;
    table.innerHTML = `<thead><tr><th>#</th><th>สินค้า</th><th>จำนวนที่ส่งทั้งหมด</th><th>ราคารวมส่ง</th></tr></thead><tbody>${normalized.map(row => `<tr><td>${row.no}</td><td>${E(row.name)}</td><td>${E(row.qty)}</td><td>${row.total.toLocaleString('th-TH')}</td></tr>`).join('')}</tbody>`;
  }

  function runFixesSoon() {
    setTimeout(() => {
      fixPrintTotals();
      fixDoneModeFromVisibleTable();
    }, 0);
  }

  document.addEventListener('input', runFixesSoon, true);
  document.addEventListener('blur', runFixesSoon, true);
  document.addEventListener('click', runFixesSoon, true);

  const observer = new MutationObserver(runFixesSoon);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  setInterval(() => {
    fixPrintTotals();
    fixDoneModeFromVisibleTable();
  }, 700);
})();
