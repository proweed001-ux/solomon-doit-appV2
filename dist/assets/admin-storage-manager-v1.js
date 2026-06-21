(() => {
  'use strict';

  const DEFAULT_URL = 'https://saodmeoilixfdqentofp.supabase.co';
  const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhb2RtZW9pbGl4ZmRxZW50b2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTIxMzcsImV4cCI6MjA5NTQ2ODEzN30.l74gUatsGTmTlp3l_lWImU4qzyFD1ubA464dkYX7u_Y';
  const BUCKET = 'doit-files';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  let state = null;
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
  const fmtDate = v => v ? new Date(v).toLocaleString('th-TH') : '—';
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
    return !q || String(f.path).toLowerCase().includes(q) || String(f.version?.file_name || '').toLowerCase().includes(q) || String(f.kind).toLowerCase().includes(q);
  }

  function tags(f) {
    return [
      `<span class="pill local">${esc(f.kind)}</span>`,
      f.is_active ? '<span class="pill ready">ACTIVE</span>' : '',
      f.protected ? '<span class="pill fail">กันลบ</span>' : '',
      f.is_latest_protected ? '<span class="pill cloud">ล่าสุด</span>' : '',
    ].join(' ');
  }

  function updateCounts() {
    const total = state?.files?.length || 0;
    const selectable = (state?.files || []).filter(f => !f.protected).length;
    const count = selected.size;
    const text = `เลือกแล้ว ${count.toLocaleString('th-TH')} ไฟล์ / เลือกได้ ${selectable.toLocaleString('th-TH')} จากทั้งหมด ${total.toLocaleString('th-TH')} ไฟล์`;
    const a = $('#storageSelectedCount'), b = $('#storageModalSelectedCount');
    if (a) a.textContent = text;
    if (b) b.textContent = text;
  }

  function renderInlineSummary() {
    const body = $('#storageFiles');
    if (!body) return;
    const total = state?.files?.length || 0;
    const selectable = (state?.files || []).filter(f => !f.protected).length;
    body.innerHTML = `<tr><td colspan="7" class="muted">โหลดแล้ว ${total.toLocaleString('th-TH')} ไฟล์ · เลือกได้ ${selectable.toLocaleString('th-TH')} ไฟล์ — กดปุ่ม “เปิด Pop-up เลือกไฟล์” เพื่อเลือกโดยไม่ต้องเลื่อนหน้ายาว</td></tr>`;
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
      const version = f.version ? `${esc(f.version.file_name || '-')} · rows ${Number(f.version.row_count || 0).toLocaleString('th-TH')} · PS ${Number(f.version.ps_count || 0).toLocaleString('th-TH')}` : 'ไม่มี version';
      return `<label class="storageItem ${f.protected ? 'isProtected' : ''}">
        <input class="storagePick" type="checkbox" data-path="${esc(f.path)}" ${checked} ${disabled}>
        <div class="storageItemBody"><div>${tags(f)}</div><b>${esc(f.path)}</b><small>${version}</small><small>${fmtSize(f.size)} · ${fmtDate(f.created_at)}</small></div>
        <button type="button" class="btn2 storageDownload" data-path="${esc(f.path)}">โหลด</button>
      </label>`;
    }).join('') : '<div class="muted" style="padding:16px">ไม่พบไฟล์ตามคำค้นหา</div>';
    $$('.storagePick').forEach(c => c.onchange = e => {
      const path = e.target.dataset.path;
      if (e.target.checked) selected.add(path); else selected.delete(path);
      renderInlineSummary();
      updateCounts();
    });
    $$('.storageDownload').forEach(btn => btn.onclick = e => { e.preventDefault(); downloadPath(btn.dataset.path); });
    updateCounts();
  }

  function renderFiles() {
    renderInlineSummary();
    renderModalList();
  }

  async function refresh() {
    try {
      log('กำลังเชื่อมคลังไฟล์อัตโนมัติ...');
      const versions = await rest('/rest/v1/doit_versions?select=id,file_name,file_size,storage_path,data_path,row_count,store_count,ps_count,telesale_bill_count,status,is_active,uploaded_at,data_status&order=uploaded_at.desc&limit=200');
      const built = buildFiles(Array.isArray(versions) ? versions : []);
      state = {
        bucket: BUCKET, active: built.active, protected_paths: built.protected_paths, files: built.files, versions,
        summary: { object_count: built.files.length, total_bytes: built.files.reduce((sum, f) => sum + Number(f.size || 0), 0), latest_upload: built.files[0]?.created_at || null },
      };
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
    log({ ok: true, dry_run: true, days, cutoff: cutoff.toISOString(), count: selected.size, selected_paths: [...selected].slice(0, 200), note: 'เลือกไฟล์เก่าให้แล้วใน Pop-up ยังไม่ลบจริง' });
  }

  function selectedPaths() { return [...selected]; }

  function deleteDisabled(action) {
    const paths = action === 'deleteOld' ? (previewOld(), selectedPaths()) : selectedPaths();
    log({ ok: false, action, write_enabled: false, count: paths.length, selected_paths: paths, note: 'ตอนนี้เปิดให้เลือก/preview ก่อนเท่านั้น ยังไม่เปิดลบจริงเพื่อกันพลาด' });
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
        body.storageModalOpen{overflow:hidden}.storageOpenBtn{height:44px;border:0;border-radius:12px;background:#087b34;color:#fff;font-weight:950;padding:0 16px}.storageInlineTools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0}.storageModalBackdrop{display:none;position:fixed;inset:0;background:#0008;z-index:9999;padding:10px}.storageModalBackdrop.show{display:flex}.storageModalBox{background:#fff;border-radius:16px;box-shadow:0 24px 80px #0008;width:min(980px,100%);height:min(92dvh,920px);margin:auto;display:flex;flex-direction:column;overflow:hidden}.storageModalHead{position:sticky;top:0;background:#fff;border-bottom:1px solid #e5e7eb;padding:12px;z-index:2}.storageModalHead h3{margin:0 0 8px}.storageModalToolbar{display:flex;gap:8px;flex-wrap:wrap}.storageModalToolbar input{height:42px;border:1px solid #d1d5db;border-radius:10px;padding:0 10px;flex:1;min-width:180px}.storageModalList{overflow:auto;padding:10px;background:#f8fafc;flex:1}.storageItem{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:10px;margin-bottom:8px}.storageItem.isProtected{background:#fff7f7}.storageItem input{width:22px;height:22px}.storageItemBody b{display:block;word-break:break-all;font-size:13px;margin:5px 0;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.storageItemBody small{display:block;color:#64748b;font-size:12px;line-height:1.45}.storageModalFoot{border-top:1px solid #e5e7eb;background:#fff;padding:10px;display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap}@media(max-width:720px){.storageModalBackdrop{padding:0}.storageModalBox{height:100dvh;border-radius:0}.storageModalToolbar>*{width:100%}.storageItem{grid-template-columns:auto 1fr}.storageItem .storageDownload{grid-column:2}.storageModalFoot>*{width:100%}}
      </style>`);
    }
    if (!document.getElementById('storageModal')) {
      document.body.insertAdjacentHTML('beforeend', `<div id="storageModal" class="storageModalBackdrop" role="dialog" aria-modal="true">
        <div class="storageModalBox">
          <div class="storageModalHead"><h3>เลือกไฟล์ที่จะล้าง</h3><div class="storageModalToolbar"><input id="storageModalFilter" placeholder="ค้นหาไฟล์ / วันที่ / Excel / JSON"><button class="btn2" id="storageModalPreviewOld">เลือกไฟล์เก่าตามวัน</button><button class="btn2" id="storageModalClear">ล้างที่เลือก</button><button class="btn2" id="storageModalClose">ปิด</button></div></div>
          <div id="storageModalList" class="storageModalList"></div>
          <div class="storageModalFoot"><b id="storageModalSelectedCount">เลือกแล้ว 0 ไฟล์</b><button class="btn2 danger" id="storageModalDeleteSelected">ลบไฟล์ที่เลือก</button></div>
        </div>
      </div>`);
    }
  }

  function improveInlineUi() {
    const tableWrap = $('#storageFiles')?.closest('.tableWrap');
    if (tableWrap) {
      tableWrap.style.maxHeight = '180px';
      tableWrap.style.overflow = 'hidden';
    }
    const filter = $('#storageFilter');
    if (filter && !$('#storageOpenModal')) {
      const div = document.createElement('div');
      div.className = 'storageInlineTools';
      div.innerHTML = `<button type="button" id="storageOpenModal" class="storageOpenBtn">เปิด Pop-up เลือกไฟล์</button><span id="storageSelectedCount" class="muted">เลือกแล้ว 0 ไฟล์</span>`;
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
    $('#storageCheckAll').onchange = e => {
      if (e.target.checked) (state?.files || []).filter(f => !f.protected).forEach(f => selected.add(f.path)); else selected.clear();
      renderFiles();
    };
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
