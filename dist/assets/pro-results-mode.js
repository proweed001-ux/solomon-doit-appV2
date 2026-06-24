(() => {
  'use strict';

  if (window.__DOIT_PRO_RESULTS_MODE__) return;
  window.__DOIT_PRO_RESULTS_MODE__ = true;

  const PRO_URL = '/pro.html?t=1028';
  const ROUTE_PATH = '/performance';
  const T = value => String(value ?? '').trim();
  const N = value => Number(value) || 0;
  const money = value => N(value).toLocaleString('th-TH', { maximumFractionDigits: 0 });
  const pct = value => N(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  const mockData = {
    updatedAt: '24/06/2026 15:30',
    source: 'Mock data พร้อมเปลี่ยนเป็น JSON จริงภายหลัง',
    ads: [
      { adsCode: 'AYAADS01', adsName: 'ทีมอยุธยา 1', target: 1775000, actual: 1405279, dgp: 39240, bills: 1288 },
      { adsCode: 'AYAADS02', adsName: 'ทีมอยุธยา 2', target: 1620000, actual: 1507896, dgp: 41880, bills: 1194 },
      { adsCode: 'AYAADS03', adsName: 'ทีมอยุธยา 3', target: 1540000, actual: 1266271, dgp: 33410, bills: 1086 },
      { adsCode: 'AYAADS04', adsName: 'ทีมอยุธยา 4', target: 1380000, actual: 924324, dgp: 22170, bills: 823 }
    ],
    ps: [
      { adsCode: 'AYAADS01', psCode: 'AYAPS011', psName: 'นาย นันทภพ ฐิตานุกูล', target: 333000, actual: 361898, dgp: 3533, bills: 629 },
      { adsCode: 'AYAADS01', psCode: 'AYAPS012', psName: 'PS ตัวอย่าง 012', target: 302000, actual: 279200, dgp: 3180, bills: 522 },
      { adsCode: 'AYAADS01', psCode: 'AYAPS013', psName: 'PS ตัวอย่าง 013', target: 287000, actual: 232300, dgp: 2870, bills: 481 },
      { adsCode: 'AYAADS01', psCode: 'AYAPS014', psName: 'PS ตัวอย่าง 014', target: 301000, actual: 294100, dgp: 3360, bills: 547 },
      { adsCode: 'AYAADS02', psCode: 'AYAPS021', psName: 'PS ตัวอย่าง 021', target: 318000, actual: 328700, dgp: 3740, bills: 603 },
      { adsCode: 'AYAADS02', psCode: 'AYAPS022', psName: 'PS ตัวอย่าง 022', target: 310000, actual: 274600, dgp: 3290, bills: 511 },
      { adsCode: 'AYAADS03', psCode: 'AYAPS031', psName: 'PS ตัวอย่าง 031', target: 298000, actual: 244900, dgp: 3010, bills: 477 },
      { adsCode: 'AYAADS04', psCode: 'AYAPS041', psName: 'PS ตัวอย่าง 041', target: 290000, actual: 188400, dgp: 2150, bills: 354 }
    ]
  };

  function getData() {
    if (window.DOIT_PERFORMANCE_DATA && Array.isArray(window.DOIT_PERFORMANCE_DATA.ps)) return window.DOIT_PERFORMANCE_DATA;
    try {
      const stored = JSON.parse(localStorage.getItem('doit-performance-data-v1') || 'null');
      if (stored && Array.isArray(stored.ps)) return stored;
    } catch {}
    return mockData;
  }

  function withIndex(row) {
    const target = N(row.target);
    return { ...row, index: target ? (N(row.actual) / target) * 100 : 0 };
  }

  function statusFor(index) {
    if (index >= 100) return { text: 'เกินเป้า', cls: 'good' };
    if (index >= 80) return { text: 'ใกล้เป้า', cls: 'warn' };
    return { text: 'ต่ำกว่าเป้า ต้องเร่ง', cls: 'bad' };
  }

  function sumRows(rows, label) {
    const out = rows.reduce((s, r) => {
      s.target += N(r.target);
      s.actual += N(r.actual);
      s.dgp += N(r.dgp);
      s.bills += N(r.bills);
      return s;
    }, { target: 0, actual: 0, dgp: 0, bills: 0 });
    return withIndex({ ...out, label });
  }

  function selectedRows(data, adsCode, psCode) {
    let rows = data.ps.map(withIndex);
    if (adsCode) rows = rows.filter(row => row.adsCode === adsCode);
    if (psCode) rows = rows.filter(row => row.psCode === psCode);
    return rows;
  }

  function injectStyle() {
    if (document.querySelector('#doitResultsModeStyle')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="doitResultsModeStyle">
      .resultsModeBtn{position:absolute;right:154px;top:12px;width:112px;height:42px;border:0;background:linear-gradient(180deg,#22c55e 0%,#0b8f3a 58%,#06652b 100%);color:#fff;border-radius:12px;font-size:17px;font-weight:950;box-shadow:0 3px 0 #03451e,0 6px 10px rgba(3,69,30,.22),inset 0 1px 0 rgba(255,255,255,.48);text-shadow:0 1px 2px rgba(0,0,0,.34);cursor:pointer}.uploadCard h3{padding-right:258px}.resultsPage{position:fixed;inset:0;z-index:16000;background:#f6f7f8;color:#111827;overflow:auto;font-family:system-ui,-apple-system,'Segoe UI',Tahoma,sans-serif}.resultsTopbar{min-height:56px;background:linear-gradient(90deg,#075424,#087b34);color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 14px;position:sticky;top:0;z-index:2}.resultsBack{border:0;background:transparent;color:#fff;font-weight:950;font-size:15px}.resultsTitle{font-weight:950;font-size:18px;text-shadow:0 1px 2px #0005}.resultsWrap{padding:12px;max-width:760px;margin:0 auto}.resultsCard{background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 2px 12px #0f172a14;padding:14px;margin-bottom:12px}.resultsMeta{background:#f0fdf4;border-color:#bbf7d0}.resultsMeta b{display:block;color:#064e3b;font-size:16px}.resultsMeta span{display:block;color:#166534;font-size:12px;line-height:1.55;margin-top:4px}.resultsGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.resultsField{display:grid;gap:5px}.resultsField label{font-size:12px;color:#374151;font-weight:950}.resultsField select{height:42px;border:1px solid #d1d5db;border-radius:10px;background:#fff;padding:0 10px;font-weight:900;color:#111827}.resultsSearchBtn{height:42px;border:0;background:linear-gradient(180deg,#34d66d 0%,#0a9f42 58%,#06722f 100%);color:#fff;border-radius:12px;font-weight:950;box-shadow:0 3px 0 #03451e,0 6px 10px rgba(3,69,30,.22),inset 0 1px 0 rgba(255,255,255,.48);margin-top:10px;width:100%}.resultsPerson{font-weight:950;font-size:17px;color:#064e3b}.resultsSub{font-size:12px;color:#6b7280;margin-top:3px}.resultsStats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.resultsStat{border:1px solid #e5e7eb;border-radius:14px;padding:12px;background:#f8fafc}.resultsStat span{display:block;color:#6b7280;font-weight:850;font-size:12px;margin-bottom:6px}.resultsStat strong{font-size:21px;color:#111827}.resultsBadge{display:inline-flex;align-items:center;min-height:34px;border-radius:999px;padding:0 12px;font-weight:950;margin-top:10px}.resultsBadge.good{background:#dcfce7;color:#166534}.resultsBadge.warn{background:#fef9c3;color:#854d0e}.resultsBadge.bad{background:#fee2e2;color:#b91c1c}.resultsSectionTitle{font-weight:950;color:#111827;margin-bottom:8px}.rankList{display:grid;gap:8px}.rankItem{display:grid;grid-template-columns:34px 1fr auto;gap:8px;align-items:center;border:1px solid #e5e7eb;background:#fff;border-radius:13px;padding:10px}.rankNo{width:30px;height:30px;border-radius:999px;background:#ecfdf5;color:#087b34;display:grid;place-items:center;font-weight:950}.rankName b{display:block;font-size:13px}.rankName span{display:block;font-size:11px;color:#6b7280}.rankPct{font-weight:950}.feedList{display:grid;gap:8px}.feedItem{border-left:4px solid #22c55e;background:#f8fafc;border-radius:10px;padding:9px 10px;font-size:13px;font-weight:800;color:#374151}.feedItem.bad{border-left-color:#ef4444}.feedItem.warn{border-left-color:#f59e0b}@media(max-width:720px){.resultsModeBtn{right:140px;top:10px;width:96px;height:38px;font-size:15.5px}.uploadCard h3{padding-right:226px}.resultsGrid,.resultsStats{grid-template-columns:1fr}.resultsWrap{padding:8px}.rankItem{grid-template-columns:30px 1fr auto}.resultsTitle{font-size:16px}}@media(max-width:390px){.resultsModeBtn{position:static;width:100%;margin:4px 0 8px}.devTeamBtn{position:static!important;width:100%!important;margin-bottom:8px!important}.uploadCard h3{padding-right:0}.uploadCard{display:grid;gap:8px}}
    </style>`);
  }

  function injectButton() {
    injectStyle();
    const card = document.querySelector('.uploadCard');
    if (!card || document.querySelector('#resultsModeBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'resultsModeBtn';
    btn.type = 'button';
    btn.className = 'resultsModeBtn';
    btn.textContent = 'ผลงาน';
    btn.addEventListener('click', () => openResults(true));
    const devBtn = card.querySelector('.devTeamBtn');
    if (devBtn) card.insertBefore(btn, devBtn); else card.prepend(btn);
  }

  function renderOptions(data, adsCode, psCode) {
    const adsOptions = data.ads.map(row => `<option value="${escapeHtml(row.adsCode)}" ${row.adsCode === adsCode ? 'selected' : ''}>${escapeHtml(row.adsCode)}</option>`).join('');
    const psList = data.ps.filter(row => !adsCode || row.adsCode === adsCode);
    const psOptions = psList.map(row => `<option value="${escapeHtml(row.psCode)}" ${row.psCode === psCode ? 'selected' : ''}>${escapeHtml(row.psCode)}</option>`).join('');
    return { adsOptions, psOptions };
  }

  function renderResults() {
    injectStyle();
    const data = getData();
    let page = document.querySelector('#resultsModePage');
    if (!page) {
      page = document.createElement('div');
      page.id = 'resultsModePage';
      page.className = 'resultsPage';
      document.body.appendChild(page);
    }

    const adsCode = page.dataset.adsCode || '';
    const psCode = page.dataset.psCode || '';
    const rows = selectedRows(data, adsCode, psCode);
    const summary = psCode && rows[0] ? rows[0] : sumRows(rows, adsCode || 'ทั้งหมด');
    const status = statusFor(summary.index);
    const ranking = selectedRows(data, adsCode, '').sort((a, b) => b.index - a.index);
    const below80 = data.ps.map(withIndex).filter(row => row.index < 80).length;
    const over100 = data.ps.map(withIndex).filter(row => row.index >= 100);
    const worstAds = data.ads.map(withIndex).sort((a, b) => a.index - b.index)[0];
    const opts = renderOptions(data, adsCode, psCode);

    page.innerHTML = `
      <div class="resultsTopbar"><button class="resultsBack" id="resultsBackBtn">← กลับหน้า Pro</button><div class="resultsTitle">โหมดผลงาน</div><div></div></div>
      <main class="resultsWrap">
        <section class="resultsCard resultsMeta"><b>ข้อมูลล่าสุด</b><span>อัปเดต: ${escapeHtml(data.updatedAt || '-')}</span><span>${escapeHtml(data.source || 'mock data')}</span></section>
        <section class="resultsCard"><div class="resultsSectionTitle">ค้นหาผลงาน</div><div class="resultsGrid"><div class="resultsField"><label>ADS</label><select id="resultsAds"><option value="">ADS: ทั้งหมด</option>${opts.adsOptions}</select></div><div class="resultsField"><label>PS</label><select id="resultsPs"><option value="">PS: ทั้งหมด</option>${opts.psOptions}</select></div></div><button class="resultsSearchBtn" id="resultsSearchBtn">ดูผลงาน</button></section>
        <section class="resultsCard"><div class="resultsPerson">${escapeHtml(psCode || adsCode || 'ผลงานรวมทั้งหมด')}</div><div class="resultsSub">${escapeHtml(psCode ? (summary.psName || '-') : 'สรุปจากข้อมูลจำลองล่าสุด')}</div><div class="resultsStats"><div class="resultsStat"><span>เป้ายอดขาย</span><strong>${money(summary.target)}</strong></div><div class="resultsStat"><span>ยอดขายจริง</span><strong>${money(summary.actual)}</strong></div><div class="resultsStat"><span>Sales Index</span><strong>${pct(summary.index)}</strong></div><div class="resultsStat"><span>DGP</span><strong>${money(summary.dgp)}</strong></div><div class="resultsStat"><span>บิลซื้อ</span><strong>${money(summary.bills)}</strong></div><div class="resultsStat"><span>สถานะผลงาน</span><strong>${escapeHtml(status.text)}</strong></div></div><div class="resultsBadge ${status.cls}">${escapeHtml(status.text)}</div></section>
        <section class="resultsCard"><div class="resultsSectionTitle">อันดับ PS</div><div class="rankList">${ranking.map((row, index) => `<div class="rankItem"><div class="rankNo">${index + 1}</div><div class="rankName"><b>${escapeHtml(row.psCode)} · ${escapeHtml(row.psName)}</b><span>${escapeHtml(row.adsCode)} · ยอด ${money(row.actual)} / เป้า ${money(row.target)}</span></div><div class="rankPct ${statusFor(row.index).cls}">${pct(row.index)}</div></div>`).join('') || '<div class="feedItem warn">ไม่พบข้อมูล PS ตามตัวกรองนี้</div>'}</div></section>
        <section class="resultsCard"><div class="resultsSectionTitle">[เมตริกแบบเรียลไทม์]</div><div class="feedList"><div class="feedItem">อัปเดตล่าสุดจากไฟล์/JSON ล่าสุด: ${escapeHtml(data.updatedAt || '-')}</div><div class="feedItem">PS ที่เกินเป้า: ${escapeHtml(over100.map(row => row.psCode).join(', ') || 'ยังไม่มี')}</div><div class="feedItem bad">ADS ที่ต้องเร่ง: ${escapeHtml(worstAds?.adsCode || '-')} · Index ${pct(worstAds?.index || 0)}</div><div class="feedItem warn">จำนวน PS ต่ำกว่า 80%: ${below80} คน</div></div></section>
      </main>`;

    page.querySelector('#resultsBackBtn')?.addEventListener('click', () => closeResults(true));
    page.querySelector('#resultsAds')?.addEventListener('change', event => {
      page.dataset.adsCode = event.target.value;
      page.dataset.psCode = '';
      renderResults();
    });
    page.querySelector('#resultsPs')?.addEventListener('change', event => {
      page.dataset.psCode = event.target.value;
    });
    page.querySelector('#resultsSearchBtn')?.addEventListener('click', () => {
      page.dataset.adsCode = page.querySelector('#resultsAds')?.value || '';
      page.dataset.psCode = page.querySelector('#resultsPs')?.value || '';
      renderResults();
    });
  }

  function openResults(push) {
    if (push && location.pathname !== ROUTE_PATH) history.pushState({ doitResultsMode: true }, '', ROUTE_PATH);
    renderResults();
  }

  function closeResults(push) {
    document.querySelector('#resultsModePage')?.remove();
    if (push && location.pathname === ROUTE_PATH) history.pushState({ doitResultsMode: false }, '', PRO_URL);
  }

  function syncRoute() {
    if (location.pathname === ROUTE_PATH) openResults(false); else closeResults(false);
  }

  document.addEventListener('click', event => {
    if (event.target?.closest?.('#resultsModeBtn')) openResults(true);
  }, true);

  window.addEventListener('popstate', syncRoute);

  const observer = new MutationObserver(injectButton);
  observer.observe(document.body, { childList: true, subtree: true });
  injectButton();
  syncRoute();

  window.DOIT_RESULTS_MODE = {
    version: 'mock-results-v1',
    route: ROUTE_PATH,
    dataSource: 'window.DOIT_PERFORMANCE_DATA || localStorage doit-performance-data-v1 || mockData'
  };
})();
