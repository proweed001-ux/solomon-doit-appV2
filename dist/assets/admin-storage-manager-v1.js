(() => {
  'use strict';

  const DEFAULT_URL = 'https://saodmeoilixfdqentofp.supabase.co';
  const DEFAULT_KEY = 'sb_publishable_JThYwAl_-askk_cIaCd75w_TCWK2BTT';
  const BUCKET = 'doit-files';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  let state = null;
  let modalFilter = 'all';
  const selected = new Set();

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const fmtSize = n => {
    n = Number(n) || 0;
    if (!n) return '—';
    const units = ['B','KB','MB','GB','TB'];
    let i = 0;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return (i ? n.toFixed(2) : Math.round(n)) + ' ' + units[i];
  };
  const fmtDate = v => v ? new Date(v).toLocaleDateString('th-TH', { day:'2-digit', month:'2-digit', year:'numeric' }) : '—';
  const log = value => {
    const box = $('#storageStatus');
    if (box) box.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  };

  function cloudCfg() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem('doit-cloud-cfg') || '{}'); } catch {}
    const url = String($('#sbUrl')?.value || saved.url || DEFAULT_URL).trim().replace(/\/$/, '');
    const key = String($('#sbKey')?.value || saved.key || DEFAULT_KEY).trim();
    return { url, key };
  }

  function authHeaders(extra = {}) {
    const cfg = cloudCfg();
    return { apikey: cfg.key, authorization: 'Bearer ' + cfg.key, ...extra };
  }

  async function rest(path, options = {}) {
    const cfg = cloudCfg();
    const res = await fetch(cfg.url + path, { ...options, headers: { ...authHeaders(options.headers || {}) } });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    if (!res.ok) throw data;
    return data;
  }

  function pathsOf(v) { return [v?.storage_path, v?.data_path].filter(Boolean); }

  function buildFiles(versions) {
    const active = versions.find(v => v.is_active) || versions[0] || null;
    const latest = versions[0] || null;
    const activePaths = new Set(pathsOf(active));
    const latestPaths = new Set(pathsOf(latest));
    const files = [];
    versions.forEach((v, index) => {
      if (v.storage_path) files.push({
        kind: 'Excel', path: v.storage_path, size: Number(v.file_size || 0), created_at: v.uploaded_at,
        is_active: activePaths.has(v.storage_path), is_latest_protected: latestPaths.has(v.storage_path) || index === 0,
        protected: activePaths.has(v.storage_path) || latestPaths.has(v.storage_path) || index === 0, version: v,
      });
      if (v.data_path) files.push({
        kind: 'JSON', path: v.data_path, size: 0, created_at: v.uploaded_at,
        is_active: activePaths.has(v.data_path), is_latest_protected: latestPaths.has(v.data_path) || index === 0,
        protected: activePaths.has(v.data_path) || latestPaths.has(v.data_path) || index === 0, version: v,
      });
    });
    return { active, files, protected_paths: [...new Set(files.filter(f => f.protected).map(f => f.path))] };
  }

  function fileMatches(f, q) {
    q = String(q || '').trim().toLowerCase();
    const filterOk = modalFilter === 'all'
      || (modalFilter === 'selectable' && !f.protected)
      || (modalFilter === 'protected' && f.protected)
      || (modalFilter === 'excel' && f.kind === 'Excel')
      || (modalFilter === 'json' && f.kind === 'JSON');
    return filterOk && (!q || String(f.path).toLowerCase().includes(q) || String(f.version?.file_name || '').toLowerCase().includes(q) || String(f.kind).toLowerCase().includes(q));
  }

  function badges(f) {
    return [
      `<span class="asBadge ${f.kind === 'Excel' ? 'excel' : 'json'}">${esc(f.kind)}</span>`,
      f.is_active ? '<span class="asBadge active">ใช้งานอยู่</span>' : '',
      f.is_latest_protected ? '<span class="asBadge latest">ล่าสุด</span>' : '',
      f.protected ? '<span class="asBadge locked">กันลบ</span>' : '',
    ].join(' ');
  }

  function updateCounts() {
    const total = state?.files?.length || 0;
    const selectable = (state?.files || []).filter(f => !f.protected).length;
    const count = selected.size;
    $('#storageSelectedCount') && ($('#storageSelectedCount').textContent = `เลือกแล้ว ${count.toLocaleString('th-TH')} ไฟล์ / เลือกได้ ${selectable.toLocaleString('th-TH')} จากทั้งหมด ${total.toLocaleString('th-TH')}`);
    $('#storageModalSelectedCount') && ($('#storageModalSelectedCount').textContent = `เลือกแล้ว ${count.toLocaleString('th-TH')} ไฟล์`);
  }

  function renderInlineSummary() {
    const body = $('#storageFiles');
    if (!body) return;
    const total = state?.files?.length || 0;
    const selectable = (state?.files || []).filter(f => !f.protected).length;
    body.innerHTML = `<tr><td colspan="7" class="muted">โหลดแล้ว ${total.toLocaleString('th-TH')} ไฟล์ · เลือกได้ ${selectable.toLocaleString('th-TH')} ไฟล์ — ใช้ปุ่ม “เลือกไฟล์ในหน้าต่าง” เพื่อจัดการแบบไม่ต้องเลื่อนหน้ายาว</td></tr>`;
    updateCounts();
  }

  function renderModalList() {
    const list = $('#storageModalList');
    if (!list) return;
    const q = $('#storageModalFilter')?.value || $('#storageFilter')?.value || '';
    const files = (state?.files || []).filter(f => fileMatches(f, q));
    list.innerHTML = files.length ? files.map(f => {
      const checked = selected.has(f.path) ? 'checked' : '';
      const disabled = f.protected ? 'disabled' : '';
      const title = f.version?.file_name || f.path.split('/').pop() || f.path;
      const meta = [fmtDate(f.created_at), fmtSize(f.size), f.version?.row_count ? `rows ${Number(f.version.row_count).toLocaleString('th-TH')}` : '', f.version?.ps_count ? `PS ${Number(f.version.ps_count).toLocaleString('th-TH')}` : ''].filter(Boolean).join(' · ');
      return `<label class="asItem ${f.protected ? 'lockedItem' : ''}">
        <input class="storagePick" type="checkbox" data-path="${esc(f.path)}" ${checked} ${disabled}>
        <div class="asInfo"><div class="asBadges">${badges(f)}</div><b>${esc(title)}</b><small>${esc(meta)}</small><small class="asPath">${esc(f.path)}</small></div>
        <button type="button" class="asIconBtn storageDownload" data-path="${esc(f.path)}">โหลด</button>
      </label>`;
    }).join('') : '<div class="asEmpty">ไม่พบไฟล์ตามเงื่อนไข</div>';
    $$('.storagePick').forEach(c => c.onchange = e => {
      const path = e.target.dataset.path;
      if (e.target.checked) selected.add(path); else selected.delete(path);
      renderInlineSummary();
      updateCounts();
    });
    $$('.storageDownload').forEach(btn => btn.onclick = e => { e.preventDefault(); downloadPath(btn.dataset.path); });
    $$('.asChip').forEach(btn => btn.classList.toggle('on', btn.dataset.filter === modalFilter));
    updateCounts();
  }

  function renderFiles() { renderInlineSummary(); renderModalList(); }

  async function refresh() {
    try {
      log('กำลังเชื่อมคลังไฟล์อัตโนมัติ...');
      const versions = await rest('/rest/v1/doit_versions?select=id,file_name,file_size,storage_path,data_path,row_count,store_count,ps_count,telesale_bill_count,status,is_active,uploaded_at,data_status&order=uploaded_at.desc&limit=200');
      const built = buildFiles(Array.isArray(versions) ? versions : []);
      state = { bucket: BUCKET, active: built.active, protected_paths: built.protected_paths, files: built.files, versions,
        summary: { object_count: built.files.length, total_bytes: built.files.reduce((sum, f) => sum + Number(f.size || 0), 0), latest_upload: built.files[0]?.created_at || null } };
      selected.clear();
      $('#storageCount').textContent = Number(state.summary.object_count || 0).toLocaleString('th-TH');
      $('#storageSize').textContent = fmtSize(state.summary.total_bytes || 0) + ' + JSON';
      $('#storageLatest').textContent = fmtDate(state.summary.latest_upload);
      $('#storageActive').textContent = state.active?.file_name || '—';
      renderFiles();
      log({ ok: true, source: 'linked Supabase project / doit_versions', summary: state.summary, active: state.active, protected_paths: state.protected_paths });
    } catch (err) { log(err); }
  }

  async function downloadPath(path) {
    try {
      const cfg = cloudCfg();
      const res = await fetch(`${cfg.url}/storage/v1/object/${BUCKET}/${encodeURI(path)}`, { headers: authHeaders() });
      if (!res.ok) throw { error: 'download_failed', detail: await res.text() };
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = path.split('/').pop() || 'doit-file';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    } catch (err) { log(err); }
  }

  function previewOld() {
    const days = Number($('#storageDays').value) || 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - Math.max(1, days));
    selected.clear();
    (state?.files || []).filter(f => !f.protected && new Date(f.created_at) < cutoff).forEach(f => selected.add(f.path));
    renderFiles();
    openModal();
    log({ ok: true, dry_run: true, days, cutoff: cutoff.toISOString(), count: selected.size, selected_paths: [...selected].slice(0, 200), note: 'เลือกไฟล์เก่าให้แล้วในหน้าต่าง ยังไม่ลบจริง' });
  }

  function selectedPaths() { return [...selected]; }

  function deleteDisabled(action) {
    const paths = action === 'deleteOld' ? (previewOld(), selectedPaths()) : selectedPaths();
    log({ ok: false, action, write_enabled: false, count: paths.length, selected_paths: paths, note: 'ตอนนี้เปิดให้เลือก/preview ก่อนเท่านั้น ยังไม่เปิดลบจริงเพื่อกันพลาด' });
  }

  function selectVisible() {
    const q = $('#storageModalFilter')?.value || '';
    (state?.files || []).filter(f => fileMatches(f, q) && !f.protected).forEach(f => selected.add(f.path));
    renderFiles();
  }

  function openModal() {
    if (!state) return refresh().then(openModal).catch(log);
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
        body.storageModalOpen{overflow:hidden}.storageOpenBtn{height:46px;border:0;border-radius:14px;background:#087b34;color:#fff;font-weight:950;padding:0 18px;box-shadow:0 8px 18px #087b3430}.storageInlineTools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0}.storageModalBackdrop{display:none;position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:9999;padding:14px;align-items:center;justify-content:center}.storageModalBackdrop.show{display:flex}.storageModalBox{background:#fff;border-radius:24px;box-shadow:0 24px 90px rgba(0,0,0,.32);width:min(620px,100%);max-height:min(86dvh,860px);display:flex;flex-direction:column;overflow:hidden}.storageModalTop{background:linear-gradient(90deg,#067a34,#078d3d);color:#fff;padding:14px 14px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px}.storageModalTitle b{display:block;font-size:17px}.storageModalTitle small{display:block;opacity:.9;margin-top:2px}.storageCloseBtn{height:38px;border:0;border-radius:14px;background:#ffffff22;color:#fff;font-weight:950;padding:0 14px}.storageModalBody{background:#f8fafc;overflow:auto;flex:1}.storageModalSearch{position:sticky;top:0;background:#f8fafc;padding:10px 12px 8px;z-index:2;border-bottom:1px solid #e5e7eb}.storageModalSearch input{width:100%;height:44px;border:1px solid #d1d5db;border-radius:14px;padding:0 14px;font-weight:800;background:#fff}.asChips{display:flex;gap:7px;overflow:auto;padding-top:9px}.asChip{height:34px;border:1px solid #d1d5db;background:#fff;color:#334155;border-radius:999px;padding:0 12px;font-weight:900;white-space:nowrap}.asChip.on{background:#087b34;color:#fff;border-color:#087b34}.storageModalList{padding:10px 12px 92px}.asItem{display:grid;grid-template-columns:28px 1fr auto;gap:10px;align-items:center;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:12px;margin-bottom:9px;box-shadow:0 2px 10px rgba(15,23,42,.04)}.asItem.lockedItem{background:#fffafa}.asItem input{width:24px;height:24px;accent-color:#087b34}.asInfo b{display:block;font-size:14px;line-height:1.35;margin:5px 0;color:#0f172a;word-break:break-word}.asInfo small{display:block;color:#64748b;font-size:12px;line-height:1.35}.asPath{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;word-break:break-all}.asBadges{display:flex;gap:5px;flex-wrap:wrap}.asBadge{display:inline-flex;align-items:center;height:22px;border-radius:999px;padding:0 8px;font-size:11px;font-weight:950}.asBadge.excel{background:#fef3c7;color:#92400e}.asBadge.json{background:#e0f2fe;color:#075985}.asBadge.active{background:#dcfce7;color:#166534}.asBadge.latest{background:#dbeafe;color:#1d4ed8}.asBadge.locked{background:#fee2e2;color:#991b1b}.asIconBtn{height:34px;border:1px solid #d1d5db;border-radius:12px;background:#fff;color:#334155;font-weight:900;padding:0 10px}.asEmpty{text-align:center;padding:30px;color:#64748b}.storageModalFoot{position:sticky;bottom:0;background:#fff;border-top:1px solid #e5e7eb;padding:10px 12px;display:grid;grid-template-columns:1fr 1fr 1.15fr;gap:8px}.storageModalFoot button{height:44px;border-radius:14px;font-weight:950}.storageFootMeta{grid-column:1/-1;text-align:center;color:#475569;font-size:13px;font-weight:900}.asClear{border:1px solid #d1d5db;background:#fff;color:#334155}.asPickOld{border:1px solid #d1d5db;background:#fff;color:#111827}.asConfirm{border:0;background:#087b34;color:#fff}@media(max-width:720px){.storageModalBackdrop{padding:0;align-items:flex-end}.storageModalBox{width:100%;height:88dvh;max-height:none;border-radius:22px 22px 0 0}.storageModalTop{padding:16px}.asItem{grid-template-columns:30px 1fr}.asIconBtn{grid-column:2;justify-self:start}.storageModalFoot{grid-template-columns:1fr 1fr 1fr;padding-bottom:calc(10px + env(safe-area-inset-bottom))}}
      </style>`);
    }
    if (!document.getElementById('storageModal')) {
      document.body.insertAdjacentHTML('beforeend', `<div id="storageModal" class="storageModalBackdrop" role="dialog" aria-modal="true">
        <div class="storageModalBox">
          <div class="storageModalTop"><div class="storageModalTitle"><b>เลือกไฟล์ที่จะล้าง</b><small>เลือกเฉพาะไฟล์ที่ไม่ถูกกันลบ</small></div><button type="button" class="storageCloseBtn" id="storageModalClose">ปิด</button></div>
          <div class="storageModalBody"><div class="storageModalSearch"><input id="storageModalFilter" placeholder="ค้นหาไฟล์ / วันที่ / Excel / JSON"><div class="asChips"><button class="asChip on" data-filter="all">ทั้งหมด</button><button class="asChip" data-filter="selectable">ลบได้</button><button class="asChip" data-filter="protected">กันลบ</button><button class="asChip" data-filter="excel">Excel</button><button class="asChip" data-filter="json">JSON</button></div></div><div id="storageModalList" class="storageModalList"></div></div>
          <div class="storageModalFoot"><div class="storageFootMeta" id="storageModalSelectedCount">เลือกแล้ว 0 ไฟล์</div><button class="asClear" id="storageModalClear">ล้าง</button><button class="asPickOld" id="storageModalPreviewOld">เลือกไฟล์เก่า</button><button class="asConfirm" id="storageModalDeleteSelected">ตกลง</button></div>
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
    $('#storageCheckAll').onchange = e => { if (e.target.checked) selectVisible(); else selected.clear(); renderFiles(); };
    $('#storagePreviewOld').onclick = previewOld;
    $('#storageModalPreviewOld').onclick = previewOld;
    $('#storageModalClear').onclick = () => { selected.clear(); renderFiles(); log('ล้างรายการที่เลือกแล้ว'); };
    $('#storageDeleteOld').onclick = () => deleteDisabled('deleteOld');
    $('#storageDeleteSelected').onclick = () => deleteDisabled('deleteSelected');
    $('#storageModalDeleteSelected').onclick = () => deleteDisabled('deleteSelected');
    setTimeout(refresh, 400);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
