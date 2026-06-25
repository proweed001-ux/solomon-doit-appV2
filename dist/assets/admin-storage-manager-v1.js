(() => {
  'use strict';

  const DEFAULT_URL = 'https://saodmeoilixfdqentofp.supabase.co';
  const DEFAULT_KEY = 'sb_publishable_JThYwAl_-askk_cIaCd75w_TCWK2BTT';
  const BUCKET = 'doit-files';
  const PERF_RETENTION_DAYS = 30;
  const RAW_RETENTION_DAYS = 7;
  const KEEP_REVISIONS_PER_DAY = 3;
  const PREFIXES = ['performance', 'uploads', 'raw', 'parsed', 'team'];
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const selected = new Set();
  let state = { files: [], protected: new Set(), active: null };
  let modalFilter = 'all';

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const num = v => Number(v || 0) || 0;
  const fmtSize = n => {
    n = num(n);
    if (!n) return '—';
    const u = ['B','KB','MB','GB','TB'];
    let i = 0;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return (i ? n.toFixed(2) : Math.round(n)) + ' ' + u[i];
  };
  const fmtDate = v => v ? new Date(v).toLocaleDateString('th-TH', { day:'2-digit', month:'2-digit', year:'numeric' }) : '—';
  const isoDate = v => {
    const s = String(v || '');
    const m = s.match(/(20\d{2}-\d{2}-\d{2})/);
    if (m) return m[1];
    if (s) {
      const d = new Date(s);
      if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    }
    return '';
  };
  const isRaw = p => /\.(xlsx|xlsm|xls|csv)$/i.test(p) || /(^|\/)(uploads|raw|parsed)\//i.test(p);
  const isPerfJson = p => /^performance\//i.test(p) && /\.json$/i.test(p);
  const isSystem = p => /^performance\/(active|index)\.json$/i.test(p);
  const log = v => { const box = $('#storageStatus'); if (box) box.textContent = typeof v === 'string' ? v : JSON.stringify(v, null, 2); };

  function cfg() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem('doit-cloud-cfg') || '{}'); } catch {}
    const url = String($('#sbUrl')?.value || saved.url || DEFAULT_URL).trim().replace(/\/$/, '');
    const key = String($('#sbKey')?.value || saved.key || DEFAULT_KEY).trim();
    return { url, key };
  }
  function auth(extra = {}) { const c = cfg(); return { apikey: c.key, authorization: 'Bearer ' + c.key, ...extra }; }
  async function req(path, options = {}) {
    const c = cfg();
    const res = await fetch(c.url + path, { ...options, headers: { ...auth(options.headers || {}) } });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    if (!res.ok) throw data;
    return data;
  }
  async function readObject(path) {
    return req('/storage/v1/object/' + BUCKET + '/' + encodeURIComponent(path).replace(/%2F/g, '/'));
  }
  async function listPrefix(prefix) {
    try {
      const rows = await req('/storage/v1/object/list/' + BUCKET, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix, limit: 1000, offset: 0, sortBy: { column: 'updated_at', order: 'desc' } })
      });
      return (Array.isArray(rows) ? rows : []).map(x => {
        const name = String(x.name || '');
        const path = name.startsWith(prefix + '/') ? name : prefix.replace(/\/$/, '') + '/' + name;
        const size = num(x.metadata?.size || x.size || 0);
        const created = x.updated_at || x.created_at || x.last_accessed_at || '';
        return { path, name, size, created_at: created, date: isoDate(path) || isoDate(created), raw: x };
      }).filter(f => f.name && !/\/$/.test(f.name));
    } catch (err) {
      return [];
    }
  }
  async function deleteObjects(paths) {
    if (!paths.length) return { deleted: [] };
    return req('/storage/v1/object/' + BUCKET, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefixes: paths })
    });
  }

  function buildProtected(files, active) {
    const p = new Set(['performance/active.json', 'performance/index.json']);
    const add = v => { if (v) p.add(String(v).replace(/^\/+/, '')); };
    add(active?.dataPath); add(active?.currentDataPath); add(active?.latestPath); add(active?.previousDataPath); add(active?.prevDataPath); add(active?.yesterdayDataPath); add(active?.compareDataPath);
    add(active?.current?.dataPath); add(active?.previous?.dataPath);
    (active?.history || []).slice(0, 2).forEach(x => add(x?.dataPath || x?.latestPath || x?.path));
    const latestByDate = new Map();
    files.filter(f => isPerfJson(f.path) && !isSystem(f.path) && f.date).forEach(f => {
      const old = latestByDate.get(f.date);
      if (!old || String(f.created_at || f.path) > String(old.created_at || old.path)) latestByDate.set(f.date, f);
    });
    [...latestByDate.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, PERF_RETENTION_DAYS).forEach(([, f]) => add(f.path));
    return p;
  }
  function classifyFile(f) {
    if (state.protected.has(f.path)) return { label: 'กันลบ', css: 'locked', locked: true, reason: 'active/latest/previous/system' };
    if (isSystem(f.path)) return { label: 'ระบบ', css: 'locked', locked: true, reason: 'system file' };
    if (isPerfJson(f.path)) return { label: 'JSON', css: 'json', locked: false, reason: 'performance json' };
    if (isRaw(f.path)) return { label: 'RAW', css: 'excel', locked: false, reason: 'raw/excel temp' };
    return { label: 'อื่น ๆ', css: 'other', locked: false, reason: 'other' };
  }
  function cleanupCandidates() {
    const now = new Date();
    const perfCutoff = new Date(now); perfCutoff.setDate(now.getDate() - PERF_RETENTION_DAYS);
    const rawCutoff = new Date(now); rawCutoff.setDate(now.getDate() - RAW_RETENTION_DAYS);
    const out = new Map();
    const add = (f, reason) => { if (!state.protected.has(f.path) && !isSystem(f.path)) out.set(f.path, { ...f, cleanupReason: reason }); };
    state.files.forEach(f => {
      const d = f.date ? new Date(f.date) : (f.created_at ? new Date(f.created_at) : null);
      if (isPerfJson(f.path) && d && d < perfCutoff) add(f, `JSON เกิน ${PERF_RETENTION_DAYS} วัน`);
      if (isRaw(f.path) && d && d < rawCutoff) add(f, `ไฟล์ดิบเกิน ${RAW_RETENTION_DAYS} วัน`);
    });
    const byDay = new Map();
    state.files.filter(f => isPerfJson(f.path) && !isSystem(f.path) && f.date).forEach(f => {
      if (!byDay.has(f.date)) byDay.set(f.date, []);
      byDay.get(f.date).push(f);
    });
    byDay.forEach(list => {
      list.sort((a, b) => String(b.created_at || b.path).localeCompare(String(a.created_at || a.path)));
      list.slice(KEEP_REVISIONS_PER_DAY + 1).forEach(f => add(f, `revision เกิน ${KEEP_REVISIONS_PER_DAY} ไฟล์/วัน`));
    });
    return [...out.values()];
  }

  function fileMatches(f, q) {
    q = String(q || '').trim().toLowerCase();
    const c = classifyFile(f);
    const isCandidate = cleanupCandidates().some(x => x.path === f.path);
    const filterOk = modalFilter === 'all'
      || (modalFilter === 'selectable' && !c.locked)
      || (modalFilter === 'protected' && c.locked)
      || (modalFilter === 'json' && isPerfJson(f.path))
      || (modalFilter === 'raw' && isRaw(f.path))
      || (modalFilter === 'cleanup' && isCandidate);
    return filterOk && (!q || f.path.toLowerCase().includes(q) || String(f.name).toLowerCase().includes(q) || String(f.date).includes(q) || c.label.toLowerCase().includes(q));
  }
  function badgeHtml(f) {
    const c = classifyFile(f);
    const cand = cleanupCandidates().find(x => x.path === f.path);
    return [
      `<span class="asBadge ${c.css}">${esc(c.label)}</span>`,
      c.locked ? '<span class="asBadge locked">กันลบ</span>' : '<span class="asBadge free">ลบได้</span>',
      cand ? `<span class="asBadge warn">${esc(cand.cleanupReason)}</span>` : ''
    ].join('');
  }
  function renderInlineSummary() {
    const body = $('#storageFiles');
    if (!body) return;
    const total = state.files.length;
    const can = state.files.filter(f => !classifyFile(f).locked).length;
    const cand = cleanupCandidates().length;
    body.innerHTML = `<tr><td colspan="7" class="muted">โหลดแล้ว ${total.toLocaleString('th-TH')} ไฟล์ · ลบได้ ${can.toLocaleString('th-TH')} ไฟล์ · เข้าเงื่อนไขล้าง ${cand.toLocaleString('th-TH')} ไฟล์ — ใช้ปุ่ม “เลือกไฟล์ในหน้าต่าง” เพื่อจัดการทั้งหมดใน popup เดียว</td></tr>`;
    updateSelected();
  }
  function renderModalList() {
    const list = $('#storageModalList');
    if (!list) return;
    const q = $('#storageModalFilter')?.value || $('#storageFilter')?.value || '';
    const files = state.files.filter(f => fileMatches(f, q));
    const candMap = new Map(cleanupCandidates().map(f => [f.path, f.cleanupReason]));
    list.innerHTML = files.length ? files.map(f => {
      const c = classifyFile(f);
      const checked = selected.has(f.path) ? 'checked' : '';
      const disabled = c.locked ? 'disabled' : '';
      const meta = [fmtDate(f.created_at || f.date), fmtSize(f.size), f.date || '', candMap.get(f.path) || ''].filter(Boolean).join(' · ');
      return `<label class="asItem ${c.locked ? 'lockedItem' : ''}">
        <input class="storagePick" type="checkbox" data-path="${esc(f.path)}" ${checked} ${disabled}>
        <div class="asInfo"><div class="asBadges">${badgeHtml(f)}</div><b>${esc(f.name || f.path.split('/').pop())}</b><small>${esc(meta)}</small><small class="asPath">${esc(f.path)}</small></div>
        <button type="button" class="asIconBtn storageDownload" data-path="${esc(f.path)}">โหลด</button>
      </label>`;
    }).join('') : '<div class="asEmpty">ไม่พบไฟล์ตามเงื่อนไข</div>';
    $$('.storagePick').forEach(x => x.onchange = e => { const p = e.target.dataset.path; if (e.target.checked) selected.add(p); else selected.delete(p); renderInlineSummary(); updateSelected(); });
    $$('.storageDownload').forEach(x => x.onclick = e => { e.preventDefault(); downloadPath(x.dataset.path); });
    $$('.asChip').forEach(btn => btn.classList.toggle('on', btn.dataset.filter === modalFilter));
    updateSelected();
  }
  function renderFiles() { renderInlineSummary(); renderModalList(); }
  function updateSelected() {
    const text = `เลือกแล้ว ${selected.size.toLocaleString('th-TH')} ไฟล์`;
    $('#storageSelectedCount') && ($('#storageSelectedCount').textContent = text);
    $('#storageModalSelectedCount') && ($('#storageModalSelectedCount').textContent = text);
  }

  async function refresh() {
    try {
      log('กำลังโหลด Storage...');
      let active = null;
      try { active = await readObject('performance/active.json'); } catch {}
      const lists = await Promise.all(PREFIXES.map(listPrefix));
      const map = new Map();
      lists.flat().forEach(f => map.set(f.path, f));
      const files = [...map.values()].sort((a, b) => String(b.created_at || b.path).localeCompare(String(a.created_at || a.path)));
      state = { files, active, protected: buildProtected(files, active) };
      selected.clear();
      $('#storageCount').textContent = files.length.toLocaleString('th-TH');
      $('#storageSize').textContent = fmtSize(files.reduce((s, f) => s + num(f.size), 0));
      $('#storageLatest').textContent = fmtDate(files[0]?.created_at || files[0]?.date);
      $('#storageActive').textContent = active?.reportDate || active?.versionId || '—';
      renderFiles();
      log({ ok: true, policy: { performance_json_days: PERF_RETENTION_DAYS, raw_days: RAW_RETENTION_DAYS, keep_revisions_per_day: KEEP_REVISIONS_PER_DAY }, files: files.length, protected: state.protected.size, cleanup_candidates: cleanupCandidates().length, active });
    } catch (err) { log(err); }
  }
  function previewOld() {
    selected.clear();
    cleanupCandidates().forEach(f => selected.add(f.path));
    modalFilter = 'cleanup';
    renderFiles();
    openModal();
    log({ ok: true, dry_run: true, selected_count: selected.size, selected_paths: [...selected].slice(0, 200), note: 'เลือกไฟล์เข้าเงื่อนไขล้างแล้ว ยังไม่ลบจริง ต้องพิมพ์ DELETE ใน popup หรือช่องยืนยัน' });
  }
  async function deleteSelected(action) {
    try {
      const confirmText = String($('#storageModalConfirm')?.value || $('#storageConfirm')?.value || '').trim();
      if (confirmText !== 'DELETE') { log({ ok: false, action, need_confirm: 'พิมพ์ DELETE ก่อนลบ' }); return; }
      const paths = action === 'old' ? cleanupCandidates().map(f => f.path) : [...selected];
      const safe = paths.filter(p => !state.protected.has(p) && !isSystem(p));
      if (!safe.length) { log({ ok: false, action, note: 'ไม่มีไฟล์ที่ลบได้' }); return; }
      log({ ok: true, action, deleting: safe.length, paths: safe.slice(0, 200) });
      const res = await deleteObjects(safe);
      selected.clear();
      $('#storageModalConfirm') && ($('#storageModalConfirm').value = '');
      $('#storageConfirm') && ($('#storageConfirm').value = '');
      log({ ok: true, action, deleted_count: safe.length, result: res });
      await refresh();
      renderModalList();
    } catch (err) { log(err); }
  }
  async function downloadPath(path) {
    try {
      const c = cfg();
      const res = await fetch(`${c.url}/storage/v1/object/${BUCKET}/${encodeURIComponent(path).replace(/%2F/g,'/')}`, { headers: auth() });
      if (!res.ok) throw { error: 'download_failed', detail: await res.text() };
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = path.split('/').pop() || 'file'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    } catch (err) { log(err); }
  }
  function selectVisible() {
    const q = $('#storageModalFilter')?.value || '';
    state.files.filter(f => fileMatches(f, q) && !classifyFile(f).locked).forEach(f => selected.add(f.path));
    renderFiles();
  }
  function openModal() {
    if (!state.files.length) return refresh().then(openModal).catch(log);
    $('#storageModal')?.classList.add('show');
    document.body.classList.add('storageModalOpen');
    renderModalList();
  }
  function closeModal() {
    $('#storageModal')?.classList.remove('show');
    document.body.classList.remove('storageModalOpen');
  }

  function ensurePopup() {
    if (!document.getElementById('storagePopupStyle')) {
      document.head.insertAdjacentHTML('beforeend', `<style id="storagePopupStyle">
        body.storageModalOpen{overflow:hidden}.storageOpenBtn{height:46px;border:0;border-radius:14px;background:#087b34;color:#fff;font-weight:950;padding:0 18px;box-shadow:0 8px 18px #087b3430}.storageInlineTools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0}.storageModalBackdrop{display:none;position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:9999;padding:14px;align-items:center;justify-content:center}.storageModalBackdrop.show{display:flex}.storageModalBox{background:#fff;border-radius:24px;box-shadow:0 24px 90px rgba(0,0,0,.32);width:min(680px,100%);max-height:min(88dvh,900px);display:flex;flex-direction:column;overflow:hidden}.storageModalTop{background:linear-gradient(90deg,#067a34,#078d3d);color:#fff;padding:14px 14px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px}.storageModalTitle b{display:block;font-size:17px}.storageModalTitle small{display:block;opacity:.9;margin-top:2px}.storageCloseBtn{height:38px;border:0;border-radius:14px;background:#ffffff22;color:#fff;font-weight:950;padding:0 14px}.storageModalBody{background:#f8fafc;overflow:auto;flex:1}.storageModalSearch{position:sticky;top:0;background:#f8fafc;padding:10px 12px 8px;z-index:2;border-bottom:1px solid #e5e7eb}.storageModalSearch input{width:100%;height:44px;border:1px solid #d1d5db;border-radius:14px;padding:0 14px;font-weight:800}.asChips{display:flex;gap:6px;overflow-x:auto;padding-top:8px}.asChip{height:32px;border:1px solid #d1d5db;background:#fff;border-radius:999px;padding:0 10px;font-weight:900;color:#374151;white-space:nowrap}.asChip.on{background:#087b34;border-color:#087b34;color:#fff}.storageModalList{padding:10px;display:grid;gap:8px}.asItem{display:grid;grid-template-columns:28px minmax(0,1fr) 58px;gap:8px;align-items:center;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:10px}.asItem.lockedItem{background:#f8fafc;opacity:.82}.asInfo b{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.asInfo small{display:block;color:#6b7280;font-size:11px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.asBadges{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:4px}.asBadge{font-size:10px;border-radius:999px;padding:2px 6px;font-weight:950;background:#e5e7eb;color:#374151}.asBadge.json{background:#dbeafe;color:#1d4ed8}.asBadge.excel{background:#dcfce7;color:#166534}.asBadge.locked{background:#fee2e2;color:#991b1b}.asBadge.free{background:#ecfdf5;color:#047857}.asBadge.warn{background:#ffedd5;color:#9a3412}.asIconBtn{height:34px;border:1px solid #d1d5db;border-radius:12px;background:#fff;font-weight:900}.asEmpty{border:1px dashed #d1d5db;border-radius:16px;color:#6b7280;padding:18px;text-align:center}.storageModalFoot{display:grid;grid-template-columns:minmax(0,1fr) 92px 96px 120px;gap:8px;align-items:center;padding:10px;background:#fff;border-top:1px solid #e5e7eb}.storageFootMeta{color:#374151;font-size:12px;font-weight:900}.storageModalConfirm{height:38px;border:1px solid #d1d5db;border-radius:12px;padding:0 10px;font-weight:900}.asClear,.asPickOld,.asConfirm{height:38px;border:0;border-radius:12px;font-weight:950;padding:0 10px}.asClear{background:#e5e7eb;color:#374151}.asPickOld{background:#dbeafe;color:#1d4ed8}.asConfirm{background:#dc2626;color:#fff}@media(max-width:560px){.storageModalBackdrop{padding:8px}.storageModalBox{border-radius:18px;max-height:92dvh}.storageModalFoot{grid-template-columns:1fr 1fr}.storageFootMeta{grid-column:1/-1}.storageModalConfirm{grid-column:1/-1}.asItem{grid-template-columns:24px minmax(0,1fr) 52px;padding:9px}.asPath{display:none!important}}
      </style>`);
    }
    if (!document.getElementById('storageModal')) {
      document.body.insertAdjacentHTML('beforeend', `<div id="storageModal" class="storageModalBackdrop" role="dialog" aria-modal="true">
        <div class="storageModalBox">
          <div class="storageModalTop"><div class="storageModalTitle"><b>เลือกไฟล์ที่จะล้าง</b><small>ทุกอย่างอยู่ใน popup เดียว เลือก/ค้นหา/preview/ลบ ได้ตรงนี้</small></div><button type="button" class="storageCloseBtn" id="storageModalClose">ปิด</button></div>
          <div class="storageModalBody"><div class="storageModalSearch"><input id="storageModalFilter" placeholder="ค้นหาไฟล์ / วันที่ / JSON / RAW"><div class="asChips"><button class="asChip on" data-filter="all">ทั้งหมด</button><button class="asChip" data-filter="cleanup">เข้าเงื่อนไขล้าง</button><button class="asChip" data-filter="selectable">ลบได้</button><button class="asChip" data-filter="protected">กันลบ</button><button class="asChip" data-filter="json">JSON</button><button class="asChip" data-filter="raw">RAW</button></div></div><div id="storageModalList" class="storageModalList"></div></div>
          <div class="storageModalFoot"><div class="storageFootMeta" id="storageModalSelectedCount">เลือกแล้ว 0 ไฟล์</div><input id="storageModalConfirm" class="storageModalConfirm" placeholder="พิมพ์ DELETE"><button class="asClear" id="storageModalClear">ล้าง</button><button class="asPickOld" id="storageModalPreviewOld">เลือกไฟล์เก่า</button><button class="asConfirm" id="storageModalDeleteSelected">ลบที่เลือก</button></div>
        </div>
      </div>`);
    }
  }
  function improveInlineUi() {
    const tableWrap = $('#storageFiles')?.closest('.tableWrap');
    if (tableWrap) { tableWrap.style.maxHeight = '120px'; tableWrap.style.overflow = 'hidden'; }
    const filter = $('#storageFilter');
    if (filter && !$('#storageOpenModal')) {
      const div = document.createElement('div');
      div.className = 'storageInlineTools';
      div.innerHTML = `<button type="button" id="storageOpenModal" class="storageOpenBtn">เลือกไฟล์ในหน้าต่าง</button><span id="storageSelectedCount" class="muted">เลือกแล้ว 0 ไฟล์</span>`;
      filter.closest('.row')?.after(div);
    }
    const hint = $('#adminStoragePanel .safeBox');
    if (hint) hint.innerHTML = `<b>Auto Cleanup Policy</b><br>JSON Performance เก็บ ${PERF_RETENTION_DAYS} วัน · Excel/Raw เก็บ ${RAW_RETENTION_DAYS} วัน · revision วันเดียวกันเก็บ ${KEEP_REVISIONS_PER_DAY} ไฟล์ล่าสุด · active/latest/previous/index ถูกกันลบ`;
  }
  function init() {
    if (!$('#adminStoragePanel')) return;
    ensurePopup();
    improveInlineUi();
    $('#storageRefresh').onclick = refresh;
    $('#storageOpenModal').onclick = openModal;
    $('#storageModalClose').onclick = closeModal;
    $('#storageModal').onclick = e => { if (e.target.id === 'storageModal') closeModal(); };
    $('#storageFilter').oninput = () => { const mf = $('#storageModalFilter'); if (mf) mf.value = $('#storageFilter').value; renderModalList(); };
    $('#storageModalFilter').oninput = renderModalList;
    $$('.asChip').forEach(btn => btn.onclick = () => { modalFilter = btn.dataset.filter || 'all'; renderModalList(); });
    $('#storageCheckAll').onchange = e => { selected.clear(); if (e.target.checked) selectVisible(); renderFiles(); };
    $('#storagePreviewOld').onclick = previewOld;
    $('#storageModalPreviewOld').onclick = previewOld;
    $('#storageModalClear').onclick = () => { selected.clear(); renderFiles(); log('ล้างรายการที่เลือกแล้ว'); };
    $('#storageDeleteOld').onclick = () => deleteSelected('old');
    $('#storageDeleteSelected').onclick = () => deleteSelected('selected');
    $('#storageModalDeleteSelected').onclick = () => deleteSelected('selected');
    setTimeout(refresh, 400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
