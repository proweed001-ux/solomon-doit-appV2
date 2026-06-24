(() => {
  'use strict';

  if (window.__DOIT_ADMIN_PERFORMANCE_INLINE__) return;
  window.__DOIT_ADMIN_PERFORMANCE_INLINE__ = true;

  const $ = s => document.querySelector(s);
  const T = v => String(v ?? '').trim();
  const K = v => T(v).replace(/\s+/g, '').toLowerCase();
  const N = v => {
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
    return Number(T(v).replace(/,/g, '').replace(/%/g, '').replace(/[^0-9.\-]/g, '')) || 0;
  };
  const F = v => N(v).toLocaleString('th-TH', { maximumFractionDigits: 0 });
  const P = v => N(v).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
  const E = v => T(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let performanceWorkbook = null;
  let performanceOutput = null;

  function currentFile() {
    return $('#file')?.files?.[0] || null;
  }

  function logPerformance(message, kind = 'muted') {
    const box = $('#performanceInlineStatus');
    if (box) {
      box.className = kind;
      box.innerHTML = message;
    }
    const log = $('#performanceInlineLog');
    if (log) log.textContent = T(message).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
  }

  function rows(name) {
    return XLSX.utils.sheet_to_json(performanceWorkbook.Sheets[name], { header: 1, defval: '', raw: false });
  }

  function hasSheet(name) {
    return Boolean(performanceWorkbook?.Sheets?.[name]);
  }

  function findHeader(rs, must) {
    return rs.findIndex(row => must.every(m => row.some(cell => K(cell).includes(K(m)))));
  }

  function col(headers, names) {
    const ks = names.map(K);
    return headers.findIndex(h => ks.some(k => K(h).includes(k)));
  }

  function val(row, index) {
    return index >= 0 ? row[index] : '';
  }

  function extractAdsCode(value) {
    const m = T(value).match(/AYAADS\d{2}/i);
    return m ? m[0].toUpperCase() : '';
  }

  function deriveAds(psCode) {
    const m = T(psCode).match(/AYAPS(\d{2})/i);
    if (!m) return '';
    const p = m[1];
    if (p === '01') return 'AYAADS01';
    if (['02', '07'].includes(p)) return 'AYAADS02';
    if (['03', '06'].includes(p)) return 'AYAADS03';
    if (['04', '05'].includes(p)) return 'AYAADS04';
    return 'AYAADS' + p.padStart(2, '0');
  }

  function rowIndex(row) {
    const target = N(row.target);
    return target ? (N(row.actual) / target) * 100 : 0;
  }

  async function readWorkbook() {
    const file = currentFile();
    if (!file) throw new Error('ยังไม่ได้เลือกไฟล์จากช่องเลือกไฟล์ด้านบน');
    const buffer = await file.arrayBuffer();
    performanceWorkbook = XLSX.read(buffer, { type: 'array', cellDates: false });
    return performanceWorkbook;
  }

  async function checkPerformanceFile() {
    await readWorkbook();
    const required = ['Summary v.2', 'Seller Report', 'Target', 'CD'];
    const lines = required.map(name => (hasSheet(name) ? '✓ ' : '✕ ') + name);
    const ok = ['Summary v.2', 'Seller Report'].every(hasSheet);
    $('#performanceConvertBtn').disabled = !ok;
    logPerformance(lines.join('<br>') + (ok ? '<br><b>พร้อมแปลงผลงาน JSON</b>' : '<br><b>ขาดชีตหลัก ห้ามแปลง</b>'), ok ? 'ok' : 'warn');
  }

  function parseAds() {
    const rs = rows('Summary v.2');
    const h = findHeader(rs, ['ADS Code']);
    if (h < 0) return [];
    const head = rs[h];
    const c = {
      code: col(head, ['ADS Code']),
      name: col(head, ['ADS Name']),
      target: col(head, ['เป้าหมายยอดขาย']),
      actual: col(head, ['ยอดขายใน Doit', 'ยอดขายในDOIT', 'Doit']),
      dgp: col(head, ['DGP Point', 'DGP'])
    };
    return rs.slice(h + 1).map(row => {
      const adsCode = extractAdsCode(val(row, c.code));
      if (!adsCode) return null;
      return {
        adsCode,
        adsName: T(val(row, c.name)) || adsCode,
        target: N(val(row, c.target)),
        actual: N(val(row, c.actual)),
        dgp: N(val(row, c.dgp)),
        bills: 0,
        source: 'Summary v.2'
      };
    }).filter(Boolean);
  }

  function parsePs() {
    const rs = rows('Seller Report');
    const h = findHeader(rs, ['Seller code']);
    if (h < 0) return [];
    const head = rs[h];
    const c = {
      ads: col(head, ['ADS/DS Name', 'ADS Code', 'ADS']),
      branch: col(head, ['Branch']),
      ps: col(head, ['Seller code', 'Seller Code']),
      name: col(head, ['Sales Name', 'Seller Name']),
      target: col(head, ['เป้าหมายยอดขาย']),
      actual: col(head, ['ยอดขายใน Doit', 'ยอดขายในDOIT', 'Doit']),
      dgp: col(head, ['DGP Point', 'DGP']),
      bills: col(head, ['จำนวนบิลซื้อทั้งหมด', 'บิลซื้อทั้งหมด', 'บิลซื้อ'])
    };
    return rs.slice(h + 1).map(row => {
      const psCode = T(val(row, c.ps)).toUpperCase();
      if (!/^AYAPS\d+/i.test(psCode)) return null;
      const adsCode = extractAdsCode(val(row, c.ads)) || deriveAds(psCode);
      return {
        adsCode,
        branch: T(val(row, c.branch)),
        psCode,
        psName: T(val(row, c.name)) || psCode,
        target: N(val(row, c.target)),
        actual: N(val(row, c.actual)),
        dgp: N(val(row, c.dgp)),
        bills: N(val(row, c.bills))
      };
    }).filter(Boolean);
  }

  function mergeAds(ads, ps) {
    const fallback = new Map();
    ps.forEach(p => {
      if (!p.adsCode) return;
      if (!fallback.has(p.adsCode)) fallback.set(p.adsCode, { adsCode: p.adsCode, adsName: p.adsCode, target: 0, actual: 0, dgp: 0, bills: 0, source: 'Seller Report fallback' });
      const a = fallback.get(p.adsCode);
      a.target += N(p.target);
      a.actual += N(p.actual);
      a.dgp += N(p.dgp);
      a.bills += N(p.bills);
    });
    const out = new Map([...fallback].map(([k, v]) => [k, v]));
    ads.forEach(a => {
      const f = out.get(a.adsCode) || {};
      out.set(a.adsCode, { ...f, ...a, bills: f.bills || a.bills || 0 });
    });
    return [...out.values()].sort((a, b) => a.adsCode.localeCompare(b.adsCode, 'th'));
  }

  function renderPreview() {
    const ps = (performanceOutput?.ps || []).map(r => ({ ...r, index: rowIndex(r) })).sort((a, b) => b.index - a.index);
    const table = $('#performancePreviewRows');
    if (!table) return;
    $('#performanceAdsCount').textContent = performanceOutput.ads.length;
    $('#performancePsCount').textContent = performanceOutput.ps.length;
    $('#performanceActualSum').textContent = F(ps.reduce((s, r) => s + N(r.actual), 0));
    $('#performanceBelow80').textContent = ps.filter(r => r.index < 80).length;
    table.innerHTML = ps.slice(0, 12).map((r, i) => `<tr><td>${i + 1}</td><td>${E(r.adsCode)}</td><td>${E(r.psCode)}</td><td>${E(r.psName)}</td><td class="right">${F(r.target)}</td><td class="right">${F(r.actual)}</td><td class="right">${P(r.index)}</td></tr>`).join('') || '<tr><td colspan="7" class="muted">ไม่มีข้อมูล</td></tr>';
  }

  function convertPerformance() {
    if (!performanceWorkbook) throw new Error('ต้องกด “ตรวจไฟล์ Tracking” ก่อน');
    const ps = parsePs();
    const ads = mergeAds(parseAds(), ps);
    if (!ps.length) throw new Error('ไม่พบข้อมูล PS จาก Seller Report');
    performanceOutput = {
      updatedAt: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
      source: 'Excel Tracking: ' + (currentFile()?.name || '-'),
      mode: 'admin-inline-localStorage-json-preview',
      ads,
      ps
    };
    localStorage.setItem('doit-performance-data-v1', JSON.stringify(performanceOutput));
    window.DOIT_PERFORMANCE_DATA = performanceOutput;
    $('#performanceOpenBtn').disabled = false;
    $('#performanceDownloadBtn').disabled = false;
    renderPreview();
    logPerformance('✓ แปลงผลงาน JSON สำเร็จ<br>✓ ใช้ไฟล์จากช่องเลือกไฟล์เดียวกับ DOIT<br>✓ บันทึกเข้า localStorage แล้ว เปิดหน้า /performance ได้', 'ok');
  }

  function downloadPerformanceJson() {
    if (!performanceOutput) return;
    const blob = new Blob([JSON.stringify(performanceOutput, null, 2)], { type: 'application/json;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'performance-data-' + Date.now() + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function injectPanel() {
    if ($('#performanceInlinePanel')) return;
    const uploadCard = $('#uploadCloud')?.closest('.card') || document.querySelector('main .card');
    if (!uploadCard) return;
    uploadCard.insertAdjacentHTML('afterend', `<section class="card" id="performanceInlinePanel"><h3>แปลงผลงาน Tracking</h3><p class="muted">ใช้ไฟล์จากปุ่ม <b>เลือกไฟล์</b> ช่องเดียวกับ DOIT ด้านบน แต่แยกปุ่มแปลงคนละงาน ไม่กระทบปุ่มอัปโหลด DOIT เดิม</p><div class="row"><button class="btn2" id="performanceCheckBtn">ตรวจไฟล์ Tracking</button><button class="btn" id="performanceConvertBtn" disabled>แปลงผลงาน JSON</button><button class="btn2" id="performanceDownloadBtn" disabled>ดาวน์โหลด JSON</button><button class="btn2" id="performanceOpenBtn" disabled>เปิดหน้า /performance</button></div><div id="performanceInlineStatus" class="muted" style="margin-top:10px">เลือกไฟล์จากช่องด้านบน แล้วกด “ตรวจไฟล์ Tracking”</div><div class="grid" style="margin-top:12px"><div class="stat"><b>ADS</b><strong id="performanceAdsCount">-</strong></div><div class="stat"><b>PS</b><strong id="performancePsCount">-</strong></div><div class="stat"><b>ยอดจริงรวม</b><strong id="performanceActualSum">-</strong></div><div class="stat"><b>ต่ำกว่า 80%</b><strong id="performanceBelow80">-</strong></div></div><div class="tableWrap" style="margin-top:10px"><table class="tbl"><thead><tr><th>#</th><th>ADS</th><th>PS</th><th>ชื่อ</th><th class="right">เป้า</th><th class="right">ยอดจริง</th><th class="right">Index</th></tr></thead><tbody id="performancePreviewRows"><tr><td colspan="7" class="muted">ยังไม่มีข้อมูล</td></tr></tbody></table></div><div id="performanceInlineLog" class="statusBox" style="margin-top:10px">พร้อม</div></section>`);
    $('#performanceCheckBtn').onclick = () => checkPerformanceFile().catch(err => logPerformance('ตรวจไฟล์ Tracking ไม่สำเร็จ: ' + E(err.message), 'warn'));
    $('#performanceConvertBtn').onclick = () => { try { convertPerformance(); } catch (err) { logPerformance('แปลงผลงานไม่สำเร็จ: ' + E(err.message), 'warn'); } };
    $('#performanceDownloadBtn').onclick = downloadPerformanceJson;
    $('#performanceOpenBtn').onclick = () => { location.href = '/performance'; };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectPanel);
  else injectPanel();
})();
