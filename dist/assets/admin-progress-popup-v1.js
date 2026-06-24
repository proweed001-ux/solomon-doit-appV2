(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const DEFAULT_URL = 'https://saodmeoilixfdqentofp.supabase.co';
  const DEFAULT_KEY = 'sb_publishable_JThYwAl_-askk_cIaCd75w_TCWK2BTT';
  const BUCKET = 'doit-files';
  let popup, popFill, popTitle, popDetail, popPct, popNote, hideTimer, wb = null, out = null, lastAutoActive = '';

  const T = (v) => String(v ?? '').trim();
  const K = (v) => T(v).replace(/\s+/g, '').toLowerCase();
  const N = (v) => typeof v === 'number' ? (Number.isFinite(v) ? v : 0) : (Number(T(v).replace(/,/g, '').replace(/%/g, '').replace(/[^0-9.\-]/g, '')) || 0);
  const F = (v) => N(v).toLocaleString('th-TH', { maximumFractionDigits: 0 });
  const P = (v) => N(v).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
  const E = (v) => T(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function css() {
    if ($('#adminProgressPopupCss')) return;
    const style = document.createElement('style');
    style.id = 'adminProgressPopupCss';
    style.textContent = `
      .adminPopMask{position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.58);backdrop-filter:blur(8px);display:none;place-items:center;padding:18px}.adminPopMask.on{display:grid}.adminPop{width:min(430px,100%);background:#fff;border-radius:22px;border:1px solid #d1fae5;box-shadow:0 28px 100px rgba(2,6,23,.28);padding:20px;color:#111827;text-align:center}.adminPopIcon{width:62px;height:62px;border-radius:20px;margin:0 auto 12px;display:grid;place-items:center;background:linear-gradient(135deg,#087b34,#22c55e);color:#fff;font-weight:950;font-size:28px}.adminPop h3{margin:0;font-size:20px;letter-spacing:-.03em;color:#064e3b}.adminPop p{margin:8px 0 14px;color:#4b5563;line-height:1.45;word-break:break-word}.adminPopHead{display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:950;color:#087b34;margin-bottom:7px}.adminPopTrack{height:14px;border-radius:999px;background:#e5e7eb;overflow:hidden;border:1px solid #d1d5db}.adminPopFill{height:100%;width:0;background:linear-gradient(90deg,#087b34,#22c55e);transition:width .18s ease}.adminPopNote{margin-top:10px;font-size:12px;color:#6b7280;line-height:1.45}.adminLatestBadge{margin-top:10px;display:inline-block;border-radius:999px;padding:7px 11px;background:#dcfce7;color:#166534;font-size:12px;font-weight:950;border:1px solid #bbf7d0}
      .perfFileRow{margin-top:10px;display:grid;grid-template-columns:170px 1fr;gap:8px;align-items:center;border:1px solid #d1fae5;background:#f0fdf4;border-radius:12px;padding:9px}.perfFileName{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#166534;font-weight:900}.perfWarn{border:1px solid #fed7aa;background:#fff7ed;color:#9a3412;border-radius:10px;padding:8px 10px;margin-top:10px;font-size:12px;font-weight:900;line-height:1.45}.right{text-align:right!important}
    `;
    document.head.appendChild(style);
  }

  function ensurePopup() {
    css();
    if (popup) return;
    popup = document.createElement('div');
    popup.className = 'adminPopMask';
    popup.innerHTML = `<div class="adminPop"><div class="adminPopIcon">⇧</div><h3 id="adminPopTitle">กำลังทำงาน</h3><p id="adminPopDetail">รอสถานะ</p><div class="adminPopHead"><span>สถานะการทำงาน</span><b id="adminPopPct">0%</b></div><div class="adminPopTrack"><div class="adminPopFill" id="adminPopFill"></div></div><div class="adminPopNote" id="adminPopNote">แสดงสถานะจาก action ปุ่มจริง</div></div>`;
    document.body.appendChild(popup);
    popFill = $('#adminPopFill');
    popTitle = $('#adminPopTitle');
    popDetail = $('#adminPopDetail');
    popPct = $('#adminPopPct');
    popNote = $('#adminPopNote');
  }

  function setProgress(value, message, mode = 'work') {
    ensurePopup();
    clearTimeout(hideTimer);
    const n = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
    const text = T(message || 'กำลังทำงาน');
    const bar = $('#bar');
    const pct = $('#pct');
    const status = $('#status');
    if (bar) bar.style.width = n + '%';
    if (pct) pct.textContent = n + '%';
    if (status) status.textContent = text;
    popup.classList.add('on');
    popFill.style.width = n + '%';
    popPct.textContent = n + '%';
    popDetail.textContent = text;
    if (mode === 'error' || /ผิดพลาด|ไม่สำเร็จ|error|fail/i.test(text)) {
      popTitle.textContent = 'ทำงานไม่สำเร็จ';
      popNote.textContent = 'ตรวจข้อความผิดพลาดด้านล่าง';
    } else if (n >= 100 || mode === 'done') {
      popTitle.textContent = 'ทำงานสำเร็จ';
      popNote.textContent = 'เสร็จตาม action ปุ่มจริงแล้ว';
      hideTimer = setTimeout(() => popup.classList.remove('on'), 1800);
    } else if (/อัปโหลด|Supabase|Cloud/i.test(text)) {
      popTitle.textContent = 'กำลังอัปโหลดขึ้น Cloud';
      popNote.textContent = 'กำลังส่ง JSON และตั้ง active';
    } else if (/อ่าน|ตรวจ|แปลง|JSON|Excel/i.test(text)) {
      popTitle.textContent = 'กำลังประมวลผลไฟล์';
      popNote.textContent = 'อ่านไฟล์และสร้าง JSON';
    } else {
      popTitle.textContent = 'กำลังทำงาน';
      popNote.textContent = 'แสดงสถานะจาก action ปุ่มจริง';
    }
  }

  function setStatus(html, cls = 'muted') {
    const box = $('#performanceInlineStatus');
    if (box) {
      box.className = cls;
      box.innerHTML = html;
    }
    const log = $('#performanceInlineLog');
    if (log) log.textContent = T(html).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
  }

  function cfg() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem('doit-cloud-cfg') || '{}'); } catch {}
    const u = T($('#sbUrl')?.value || saved.url || DEFAULT_URL).replace(/\/$/, '');
    const k = T($('#sbKey')?.value || saved.key || DEFAULT_KEY);
    return { u, k };
  }
  const H = (c, x = {}) => ({ apikey: c.k, authorization: 'Bearer ' + c.k, ...x });
  async function put(c, path, blob, type) {
    const url = `${c.u}/storage/v1/object/${BUCKET}/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
    const r = await fetch(url, { method: 'POST', headers: H(c, { 'Content-Type': type, 'x-upsert': 'true' }), body: blob });
    const t = await r.text();
    if (!r.ok) throw Error(t);
    return t;
  }

  function currentFile() { return $('#performanceFile')?.files?.[0] || null; }
  function sheet(name) { return wb?.Sheets?.[name] || null; }
  function rows(name) { const s = sheet(name); return s ? XLSX.utils.sheet_to_json(s, { header: 1, defval: '', raw: false }) : []; }
  function hasSheet(name) { return Boolean(sheet(name)); }
  function findHeader(rs, must) { return rs.findIndex(row => must.every(m => row.some(cell => K(cell).includes(K(m))))); }
  function col(headers, names) { const ks = names.map(K); return headers.findIndex(h => ks.some(k => K(h).includes(k))); }
  function val(row, i) { return i >= 0 ? row[i] : ''; }
  function findKey(obj, names) { const keys = Object.keys(obj || {}), ks = names.map(K); return keys.find(k => ks.some(n => K(k).includes(n) || n.includes(K(k)))) || ''; }
  function objVal(obj, names) { const k = findKey(obj, names); return k ? obj[k] : ''; }
  function objNum(obj, names) { return N(objVal(obj, names)); }
  function adsCode(v) { const m = T(v).match(/AYAADS\d{2}/i); return m ? m[0].toUpperCase() : ''; }
  function msCode(v) { const m = T(v).match(/MS\d{3}/i); return m ? m[0].toUpperCase() : ''; }
  function deriveAds(ps) {
    const m = T(ps).match(/AYAPS(\d{2})/i); if (!m) return '';
    const p = m[1];
    if (p === '01') return 'AYAADS01';
    if (['02', '07'].includes(p)) return 'AYAADS02';
    if (['03', '06'].includes(p)) return 'AYAADS03';
    if (['04', '05'].includes(p)) return 'AYAADS04';
    return 'AYAADS' + p.padStart(2, '0');
  }
  function idx(r) { const t = N(r.target); return t ? (N(r.actual) / t) * 100 : 0; }
  function normalizeHeader(v) { return T(v).replace(/\s+/g, ' '); }
  function sellerFields(header) {
    const seen = {};
    return header.map((v, i) => {
      const base = normalizeHeader(v);
      if (!base) return null;
      seen[base] = (seen[base] || 0) + 1;
      return { name: seen[base] > 1 ? `${base} #${seen[base]}` : base, index: i };
    }).filter(Boolean);
  }

  async function readWorkbook() {
    const f = currentFile();
    if (!f) throw new Error('ยังไม่ได้เลือกไฟล์ Tracking จากปุ่มในกล่อง Performance');
    setProgress(12, 'กำลังอ่านไฟล์ Tracking Excel...');
    wb = XLSX.read(await f.arrayBuffer(), { type: 'array', cellDates: false });
    return wb;
  }

  function parseSellerReportAll() {
    const rs = rows('Seller Report'), h = findHeader(rs, ['Seller code']);
    if (h < 0) return { fields: [], rows: [] };
    const fields = sellerFields(rs[h]), names = fields.map(f => f.name);
    const c = { ads: col(rs[h], ['ADS/DS Name', 'ADS Code', 'ADS']), branch: col(rs[h], ['Branch']), ps: col(rs[h], ['Seller code', 'Seller Code']), name: col(rs[h], ['Sales Name', 'Seller Name']) };
    const outRows = [];
    rs.slice(h + 1).forEach((r, ri) => {
      const ps = T(val(r, c.ps)).toUpperCase();
      if (!/^AYAPS\d+/i.test(ps)) return;
      const obj = {};
      fields.forEach(f => { obj[f.name] = val(r, f.index); });
      const cd = {};
      fields.forEach(f => {
        const n = f.name.replace(/\s+/g, ' ');
        if (/\b[CD]D?\s*[1-7]\b/i.test(n) || /\bCD[1-7]\b/i.test(n) || /\bDC[1-7]\b/i.test(n)) cd[f.name] = obj[f.name];
      });
      outRows.push({ rowNumber: h + 2 + ri, adsCode: adsCode(val(r, c.ads)) || deriveAds(ps), branch: T(val(r, c.branch)), psCode: ps, psName: T(val(r, c.name)) || ps, sellerReport: obj, cd });
    });
    return { fields: names, rows: outRows };
  }

  function parseAds() {
    const rs = rows('Summary v.2'), h = findHeader(rs, ['ADS Code']);
    if (h < 0) return [];
    const head = rs[h], c = { code: col(head, ['ADS Code']), name: col(head, ['ADS Name']), target: col(head, ['เป้าหมายยอดขาย']), actual: col(head, ['ยอดขายใน Doit', 'ยอดขายในDOIT', 'Doit']), dgp: col(head, ['DGP Point', 'DGP']) };
    return rs.slice(h + 1).map(r => {
      const a = adsCode(val(r, c.code));
      if (!a) return null;
      return { adsCode: a, adsName: T(val(r, c.name)) || a, target: N(val(r, c.target)), actual: N(val(r, c.actual)), dgp: N(val(r, c.dgp)), bills: 0, source: 'Summary v.2' };
    }).filter(Boolean);
  }
  function parsePs(sellerAll) {
    return sellerAll.rows.map(sr => {
      const o = sr.sellerReport;
      return { adsCode: sr.adsCode, branch: sr.branch, psCode: sr.psCode, psName: sr.psName, target: objNum(o, ['เป้าหมายยอดขาย']), actual: objNum(o, ['ยอดขายใน Doit', 'ยอดขายในDOIT', 'Doit']), index: objNum(o, ['Index']), dgp: objNum(o, ['DGP Point', 'DGP', 'Golden Point']), bills: objNum(o, ['จำนวนบิลซื้อทั้งหมด', 'บิลซื้อทั้งหมด', 'จำนวนบิลซื้อ']), sellerReportRowNumber: sr.rowNumber, sellerReport: o, cd: sr.cd };
    });
  }
  function mergeAds(ads, ps) {
    const m = new Map();
    ps.forEach(p => {
      if (!p.adsCode) return;
      if (!m.has(p.adsCode)) m.set(p.adsCode, { adsCode: p.adsCode, adsName: p.adsCode, target: 0, actual: 0, dgp: 0, bills: 0, source: 'Seller Report fallback' });
      const a = m.get(p.adsCode);
      a.target += N(p.target); a.actual += N(p.actual); a.dgp += N(p.dgp); a.bills += N(p.bills);
    });
    ads.forEach(a => { const f = m.get(a.adsCode) || {}; m.set(a.adsCode, { ...f, ...a, bills: f.bills || a.bills || 0 }); });
    return [...m.values()].sort((a, b) => a.adsCode.localeCompare(b.adsCode, 'th'));
  }

  function parseMsRoster() {
    const rs = rows(' Sales Person'); if (!rs.length) return [];
    const head = rs[0], c = { code: col(head, ['SlpName', 'SellerCode', 'Code']), name: col(head, ['lastName', 'SellerName', 'Name']), type: col(head, ['U_SellerType', 'SellerType']), job: col(head, ['jobTitle', 'JobTitle']) };
    return rs.slice(1).map(r => {
      const code = T(val(r, c.code)).toUpperCase(), short = msCode(code), job = T(val(r, c.job)), type = T(val(r, c.type));
      if (!short || (!/MS/i.test(type) && !/MS|DS/i.test(job))) return null;
      return { msCode: short, slpCode: code, msName: T(val(r, c.name)) || code, sellerType: type, jobTitle: job };
    }).filter(Boolean);
  }
  function parseMsSbd() {
    const outRows = [];
    rows('MAS SBD').forEach(r => {
      const code = msCode(r[3]); if (!code) return;
      const comp = N(r[27]);
      outRows.push({ msCode: code, plkCode: T(r[2]), storeCount: N(r[9]), stores: { super: N(r[4]), mm: N(r[5]), cvs: N(r[6]), hybrid: N(r[7]), whs: N(r[8]), total: N(r[9]) }, sbdTargetSku: N(r[15]), sbdActualSku: N(r[21]), sbdCompliance: comp && comp <= 1.5 ? comp * 100 : comp, source: 'MAS SBD' });
    });
    return outRows;
  }
  function parseMsNewProduct() {
    const rs = rows('Data MAS New Product'); if (rs.length < 2) return [];
    const head = rs[0], c = { ms: col(head, ['Slsperid']), chain: col(head, ['ChainCode']) }, m = new Map();
    for (let i = 1; i < rs.length; i++) {
      const r = rs[i], code = msCode(val(r, c.ms)); if (!code) continue;
      if (!m.has(code)) m.set(code, { msCode: code, chainCount: 0, chains: new Set(), count1: 0, amount1: 0, count2: 0, amount2: 0, count3: 0, amount3: 0, count4: 0, amount4: 0, count5: 0, amount5: 0, totalCount: 0, totalAmount: 0 });
      const o = m.get(code), ch = T(val(r, c.chain)); if (ch) o.chains.add(ch);
      for (let n = 1; n <= 5; n++) { const cv = N(val(r, col(head, ['Count' + n]))), av = N(val(r, col(head, ['Amount' + n]))); o['count' + n] += cv; o['amount' + n] += av; o.totalCount += cv; o.totalAmount += av; }
    }
    return [...m.values()].map(o => ({ ...o, chainCount: o.chains.size, chains: undefined }));
  }
  function parseMsSbdDetail() {
    const rs = rows('Data MAS SBD'); if (rs.length < 2) return { detail: [], summary: [] };
    const h = rs[0], c = { ms: col(h, ['Slsperid']), cls: col(h, ['Customer_ClassID']), chain: col(h, ['ChainCode']), chainName: col(h, ['ChainDescr']), brand: col(h, ['Invt_ClassID']), sku: col(h, ['Descr']), cnt: col(h, ['CountSBD']), amt: col(h, ['AmountSBD']) }, detail = [], m = new Map();
    for (let i = 1; i < rs.length; i++) {
      const r = rs[i], code = msCode(val(r, c.ms)); if (!code) continue;
      const row = { msCode: code, customerClass: T(val(r, c.cls)), chainCode: T(val(r, c.chain)), chainName: T(val(r, c.chainName)), brand: T(val(r, c.brand)), sku: T(val(r, c.sku)), countSbd: N(val(r, c.cnt)), amountSbd: N(val(r, c.amt)) };
      detail.push(row);
      if (!m.has(code)) m.set(code, { msCode: code, sbdDetailRows: 0, sbdDetailCount: 0, sbdAmount: 0, chains: new Set(), brands: {} });
      const o = m.get(code); o.sbdDetailRows++; o.sbdDetailCount += row.countSbd; o.sbdAmount += row.amountSbd; if (row.chainCode) o.chains.add(row.chainCode); if (row.brand) o.brands[row.brand] = (o.brands[row.brand] || 0) + row.countSbd;
    }
    return { detail, summary: [...m.values()].map(o => ({ ...o, sbdChainCount: o.chains.size, chains: undefined })) };
  }
  function parseMs() {
    const roster = parseMsRoster(), sbd = parseMsSbd(), newp = parseMsNewProduct(), det = parseMsSbdDetail(), m = new Map();
    function ensure(code) { if (!m.has(code)) m.set(code, { msCode: code, msName: code }); return m.get(code); }
    roster.forEach(r => Object.assign(ensure(r.msCode), r)); sbd.forEach(r => Object.assign(ensure(r.msCode), r)); newp.forEach(r => Object.assign(ensure(r.msCode), { newProduct: r })); det.summary.forEach(r => Object.assign(ensure(r.msCode), r));
    return { ms: [...m.values()].sort((a, b) => a.msCode.localeCompare(b.msCode, 'th')), msSbd: sbd, msNewProduct: newp, msSbdDetail: det.detail };
  }

  function preview() {
    const ps = (out?.ps || []).map(r => ({ ...r, indexCalc: idx(r) })).sort((a, b) => b.indexCalc - a.indexCalc);
    $('#performanceAdsCount').textContent = out.ads.length;
    $('#performancePsCount').textContent = out.ps.length;
    $('#performanceMsCount').textContent = (out.ms || []).length;
    $('#performanceSellerFieldCount').textContent = (out.sellerReportFields || []).length;
    $('#performanceActualSum').textContent = F(ps.reduce((s, r) => s + N(r.actual), 0));
    $('#performanceBelow80').textContent = ps.filter(r => r.indexCalc < 80).length;
    $('#performancePreviewRows').innerHTML = ps.slice(0, 12).map((r, i) => `<tr><td>${i + 1}</td><td>${E(r.adsCode)}</td><td>${E(r.psCode)}</td><td>${E(r.psName)}</td><td class="right">${F(r.target)}</td><td class="right">${F(r.actual)}</td><td class="right">${P(r.indexCalc)}</td></tr>`).join('') || '<tr><td colspan="7" class="muted">ไม่มีข้อมูล</td></tr>';
  }

  async function check() {
    try {
      setProgress(5, 'เริ่มตรวจไฟล์ Tracking...');
      await readWorkbook();
      setProgress(55, 'กำลังตรวจชีตที่จำเป็น...');
      const req = ['Summary v.2', 'Seller Report', ' Sales Person', 'MAS SBD', 'Data MAS New Product', 'Data MAS SBD'];
      const lines = req.map(n => (hasSheet(n) ? '✓ ' : '✕ ') + n), ok = ['Summary v.2', 'Seller Report'].every(hasSheet);
      $('#performanceConvertBtn').disabled = !ok;
      setStatus(lines.join('<br>') + (ok ? '<br><b>พร้อมแปลงผลงาน JSON รวม Seller Report ทุกหัวข้อ</b>' : '<br><b>ขาดชีตหลัก ห้ามแปลง</b>'), ok ? 'ok' : 'warn');
      setProgress(ok ? 100 : 100, ok ? 'ตรวจไฟล์ Tracking สำเร็จ พร้อมแปลง JSON' : 'ตรวจไฟล์เสร็จ แต่ขาดชีตหลัก', ok ? 'done' : 'error');
    } catch (e) { setStatus('ตรวจไฟล์ Tracking ไม่สำเร็จ: ' + E(e.message), 'warn'); setProgress(100, 'ตรวจไฟล์ Tracking ไม่สำเร็จ: ' + (e.message || e), 'error'); }
  }

  function convert() {
    try {
      if (!wb) throw new Error('ต้องกด “ตรวจไฟล์ Tracking” ก่อน');
      setProgress(10, 'เริ่มแปลง Seller Report...');
      const sellerAll = parseSellerReportAll();
      setProgress(35, 'กำลังแปลง ADS / PS...');
      const ps = parsePs(sellerAll), ads = mergeAds(parseAds(), ps);
      setProgress(65, 'กำลังแปลง MS / MAS SBD...');
      const msData = parseMs();
      if (!ps.length) throw new Error('ไม่พบข้อมูล PS จาก Seller Report');
      out = { schema: 'performance-json-v5', updatedAt: new Date().toISOString(), updatedAtText: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }), source: 'Excel Tracking: ' + (currentFile()?.name || '-'), mode: 'supabase-storage-performance-json', separatedFromDoitFile: true, sellerReportFields: sellerAll.fields, sellerReportRows: sellerAll.rows, ads, ps, ...msData };
      setProgress(88, 'กำลังสร้าง Preview และบันทึก JSON ในเครื่อง...');
      localStorage.setItem('doit-performance-data-v1', JSON.stringify(out));
      window.DOIT_PERFORMANCE_DATA = out;
      $('#performanceOpenBtn').disabled = false; $('#performanceDownloadBtn').disabled = false; $('#performanceUploadBtn').disabled = false;
      preview();
      setStatus(`✓ แปลงผลงาน JSON สำเร็จ<br>ADS ${ads.length} · PS ${ps.length} · MS ${out.ms.length}<br>Seller Report ${sellerAll.fields.length} หัวข้อ · ${sellerAll.rows.length} แถว<br>ใช้ไฟล์ Tracking แยกจาก DOIT แล้ว ไม่ชนยอด DOIT`, 'ok');
      setProgress(100, `แปลง JSON สำเร็จ ADS ${ads.length} · PS ${ps.length} · MS ${out.ms.length}`, 'done');
    } catch (e) { setStatus('แปลงผลงานไม่สำเร็จ: ' + E(e.message || e), 'warn'); setProgress(100, 'แปลงผลงานไม่สำเร็จ: ' + (e.message || e), 'error'); }
  }

  async function uploadSupabase() {
    try {
      if (!out) convert();
      if (!out) throw new Error('ยังไม่มี JSON สำหรับอัปโหลด');
      const c = cfg(); if (!c.k) throw Error('ยังไม่ได้ใส่ Supabase anon key');
      localStorage.setItem('doit-cloud-cfg', JSON.stringify({ url: c.u, key: c.k }));
      const id = crypto.randomUUID(), day = new Date().toISOString().slice(0, 10), safe = (currentFile()?.name || 'tracking.xlsx').replace(/[^\w.ก-๙-]+/g, '_'), dataPath = `performance/${day}/${id}.json`, activePath = 'performance/active.json';
      const payload = { ...out, versionId: id, sourceFile: safe, dataPath, activePath, publishedAt: new Date().toISOString() };
      const active = { schema: 'performance-active-v1', versionId: id, updatedAt: payload.publishedAt, sourceFile: safe, dataPath, adsCount: out.ads.length, psCount: out.ps.length, msCount: (out.ms || []).length, sellerReportFieldCount: (out.sellerReportFields || []).length, separatedFromDoitFile: true };
      setStatus('กำลังอัปโหลด Performance JSON เข้า Supabase Storage...', 'muted');
      setProgress(15, 'กำลังเตรียมอัปโหลด Performance JSON เข้า Supabase...');
      await put(c, dataPath, new Blob([JSON.stringify(payload)], { type: 'application/json;charset=utf-8' }), 'application/json;charset=utf-8');
      setProgress(70, 'อัปโหลด JSON แล้ว กำลังตั้ง active performance/active.json...');
      await put(c, activePath, new Blob([JSON.stringify(active)], { type: 'application/json;charset=utf-8' }), 'application/json;charset=utf-8');
      localStorage.setItem('doit-performance-active-path', activePath); localStorage.setItem('doit-performance-data-v1', JSON.stringify(payload));
      setStatus(`✓ อัปโหลด Performance JSON เข้า Supabase สำเร็จ<br>✓ ตั้ง active แล้ว: <b>${activePath}</b><br>✓ ADS ${out.ads.length} · PS ${out.ps.length} · MS ${(out.ms || []).length} · Seller Report ${(out.sellerReportFields || []).length} หัวข้อ<br>✓ ไม่แตะไฟล์ DOIT`, 'ok');
      setProgress(100, 'อัปโหลด Performance JSON + ตั้งล่าสุดสำเร็จ', 'done');
    } catch (e) { setStatus('อัปโหลด Supabase ไม่สำเร็จ: ' + E(e.message || e), 'warn'); setProgress(100, 'อัปโหลด Supabase ไม่สำเร็จ: ' + (e.message || e), 'error'); }
  }

  function downloadJson() {
    if (!out) return;
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'performance-data-' + Date.now() + '.json'; a.click(); URL.revokeObjectURL(a.href);
  }

  function injectPerformancePanel() {
    if ($('#performanceInlinePanel')) return;
    const cloud = $('#uploadCloud')?.closest('.card') || document.querySelector('main .card');
    if (!cloud) return;
    cloud.insertAdjacentHTML('afterend', `<section class="card" id="performanceInlinePanel"><h3>แปลงผลงาน Tracking</h3><p class="muted">ใช้ไฟล์ Tracking แยกจากไฟล์ DOIT เพื่อไม่ให้ยอด DOIT เพี้ยน เพิ่มข้อมูล ADS / PS / MS / MAS SBD / Seller Report ทุกหัวข้อ รวม CD/DC1-7 และอัปโหลด JSON เข้า Supabase Storage bucket เดิม</p><div class="perfWarn">ห้ามเลือกไฟล์ Tracking จากปุ่ม “เลือกไฟล์ DOIT” ด้านบน ให้เลือกจากปุ่ม “เลือกไฟล์ Tracking” ในกล่องนี้เท่านั้น</div><div class="perfFileRow"><button class="btn2" id="performanceFileBtn" type="button">เลือกไฟล์ Tracking</button><span class="perfFileName" id="performanceFileName">ยังไม่ได้เลือกไฟล์ Tracking</span><input id="performanceFile" type="file" accept=".xlsx,.xlsm,.xls,.csv" hidden></div><div class="row" style="margin-top:10px"><button class="btn2" id="performanceCheckBtn">ตรวจไฟล์ Tracking</button><button class="btn" id="performanceConvertBtn" disabled>แปลงผลงาน JSON</button><button class="btn" id="performanceUploadBtn" disabled>อัปโหลด Performance JSON + ตั้งล่าสุด</button><button class="btn2" id="performanceDownloadBtn" disabled>ดาวน์โหลด JSON</button><button class="btn2" id="performanceOpenBtn" disabled>เปิดหน้า /performance</button></div><div id="performanceInlineStatus" class="muted" style="margin-top:10px">เลือกไฟล์จากปุ่ม “เลือกไฟล์ Tracking” ในกล่องนี้ แล้วกด “ตรวจไฟล์ Tracking”</div><div class="grid" style="margin-top:12px"><div class="stat"><b>ADS</b><strong id="performanceAdsCount">-</strong></div><div class="stat"><b>PS</b><strong id="performancePsCount">-</strong></div><div class="stat"><b>MS</b><strong id="performanceMsCount">-</strong></div><div class="stat"><b>Seller Report หัวข้อ</b><strong id="performanceSellerFieldCount">-</strong></div><div class="stat"><b>ยอดจริงรวม</b><strong id="performanceActualSum">-</strong></div><div class="stat"><b>PS ต่ำกว่า 80%</b><strong id="performanceBelow80">-</strong></div></div><div class="tableWrap" style="margin-top:10px"><table class="tbl"><thead><tr><th>#</th><th>ADS</th><th>PS</th><th>ชื่อ</th><th class="right">เป้า</th><th class="right">ยอดจริง</th><th class="right">Index</th></tr></thead><tbody id="performancePreviewRows"><tr><td colspan="7" class="muted">ยังไม่มีข้อมูล</td></tr></tbody></table></div><div id="performanceInlineLog" class="statusBox" style="margin-top:10px">พร้อม</div></section>`);
    $('#performanceFileBtn').onclick = () => $('#performanceFile')?.click();
    $('#performanceFile').onchange = () => {
      const f = currentFile(); wb = null; out = null;
      $('#performanceFileName').textContent = f ? f.name : 'ยังไม่ได้เลือกไฟล์ Tracking';
      $('#performanceConvertBtn').disabled = true; $('#performanceUploadBtn').disabled = true; $('#performanceDownloadBtn').disabled = true; $('#performanceOpenBtn').disabled = true;
      setStatus(f ? 'เลือกไฟล์ Tracking แล้ว: ' + E(f.name) : 'ยังไม่ได้เลือกไฟล์ Tracking', 'muted');
      setProgress(0, f ? 'เลือกไฟล์ Tracking แล้ว: ' + f.name : 'ยังไม่ได้เลือกไฟล์ Tracking');
    };
    $('#performanceCheckBtn').onclick = check;
    $('#performanceConvertBtn').onclick = convert;
    $('#performanceUploadBtn').onclick = uploadSupabase;
    $('#performanceDownloadBtn').onclick = downloadJson;
    $('#performanceOpenBtn').onclick = () => { location.href = '/performance'; };
  }

  function autoActive() {
    const el = $('#cloudStatus'); if (!el) return;
    const tx = el.textContent || '', btn = $('#setActive');
    if (btn && /กด.*ตั้งเป็นไฟล์ล่าสุด|บันทึก metadata สำเร็จ|อัปโหลดไฟล์และบันทึก metadata สำเร็จ/.test(tx) && tx !== lastAutoActive) {
      lastAutoActive = tx; setProgress(85, 'กำลังตั้งไฟล์ DOIT เป็นล่าสุดอัตโนมัติ'); setTimeout(() => btn.click(), 250);
    }
  }

  function bind() {
    css(); ensurePopup(); injectPerformancePanel();
    const file = $('#file'); if (file) file.addEventListener('change', () => { const f = file.files && file.files[0]; if (f) setProgress(0, 'เลือกไฟล์ DOIT: ' + f.name); }, true);
    const up = $('#uploadCloud'); if (up) up.addEventListener('click', () => setProgress(6, 'เริ่มอัปโหลดไฟล์ DOIT ขึ้น Cloud'), true);
    const cs = $('#cloudStatus'); if (cs) new MutationObserver(autoActive).observe(cs, { childList: true, subtree: true, characterData: true });
    setTimeout(injectPerformancePanel, 400); setTimeout(autoActive, 600);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
