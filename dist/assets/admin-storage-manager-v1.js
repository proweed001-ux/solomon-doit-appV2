(() => {
  'use strict';

  const DEFAULT_URL = 'https://saodmeoilixfdqentofp.supabase.co';
  const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhb2RtZW9pbGl4ZmRxZW50b2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTIxMzcsImV4cCI6MjA5NTQ2ODEzN30.l74gUatsGTmTlp3l_lWImU4qzyFD1ubA464dkYX7u_Y';
  const BUCKET = 'doit-files';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  let state = null;

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

  function pathsOf(v) {
    return [v?.storage_path, v?.data_path].filter(Boolean);
  }

  function buildFiles(versions) {
    const active = versions.find(v => v.is_active) || versions[0] || null;
    const latest = versions[0] || null;
    const activePaths = new Set(pathsOf(active));
    const latestPaths = new Set(pathsOf(latest));
    const files = [];
    versions.forEach((v, index) => {
      if (v.storage_path) files.push({
        kind: 'Excel',
        path: v.storage_path,
        size: Number(v.file_size || 0),
        created_at: v.uploaded_at,
        is_active: activePaths.has(v.storage_path),
        is_latest_protected: latestPaths.has(v.storage_path) || index === 0,
        protected: activePaths.has(v.storage_path) || latestPaths.has(v.storage_path) || index === 0,
        version: v,
      });
      if (v.data_path) files.push({
        kind: 'JSON',
        path: v.data_path,
        size: 0,
        created_at: v.uploaded_at,
        is_active: activePaths.has(v.data_path),
        is_latest_protected: latestPaths.has(v.data_path) || index === 0,
        protected: activePaths.has(v.data_path) || latestPaths.has(v.data_path) || index === 0,
        version: v,
      });
    });
    return { active, files, protected_paths: [...new Set(files.filter(f => f.protected).map(f => f.path))] };
  }

  function renderFiles() {
    const q = ($('#storageFilter')?.value || '').trim().toLowerCase();
    const body = $('#storageFiles');
    if (!body) return;
    const files = (state?.files || []).filter(f => !q || String(f.path).toLowerCase().includes(q) || String(f.version?.file_name || '').toLowerCase().includes(q) || String(f.kind).toLowerCase().includes(q));
    body.innerHTML = files.length ? files.map(f => {
      const tags = [
        `<span class="pill local">${esc(f.kind)}</span>`,
        f.is_active ? '<span class="pill ready">ACTIVE</span>' : '',
        f.protected ? '<span class="pill fail">กันลบ</span>' : '',
        f.is_latest_protected ? '<span class="pill cloud">ล่าสุด</span>' : '',
      ].join(' ');
      const version = f.version ? `${esc(f.version.file_name || '-')}<br><span class="muted">rows ${Number(f.version.row_count || 0).toLocaleString('th-TH')} / PS ${Number(f.version.ps_count || 0).toLocaleString('th-TH')}</span>` : '<span class="muted">ไม่มี version</span>';
      return `<tr>
        <td><input class="storagePick" type="checkbox" data-path="${esc(f.path)}" ${f.protected ? 'disabled' : ''}></td>
        <td>${tags}</td>
        <td style="word-break:break-all;font-family:ui-monospace,SFMono-Regular,Consolas,monospace">${esc(f.path)}</td>
        <td>${fmtSize(f.size)}</td>
        <td>${fmtDate(f.created_at)}</td>
        <td>${version}</td>
        <td><button class="btn2 storageDownload" data-path="${esc(f.path)}">ดาวน์โหลด</button></td>
      </tr>`;
    }).join('') : '<tr><td colspan="7" class="muted">ไม่พบไฟล์</td></tr>';
    $$('.storageDownload').forEach(btn => btn.onclick = () => downloadPath(btn.dataset.path));
  }

  async function refresh() {
    try {
      log('กำลังเชื่อมคลังไฟล์อัตโนมัติ...');
      const versions = await rest('/rest/v1/doit_versions?select=id,file_name,file_size,storage_path,data_path,row_count,store_count,ps_count,telesale_bill_count,status,is_active,uploaded_at,data_status&order=uploaded_at.desc&limit=200');
      const built = buildFiles(Array.isArray(versions) ? versions : []);
      state = {
        bucket: BUCKET,
        active: built.active,
        protected_paths: built.protected_paths,
        files: built.files,
        versions,
        summary: {
          object_count: built.files.length,
          total_bytes: built.files.reduce((sum, f) => sum + Number(f.size || 0), 0),
          latest_upload: built.files[0]?.created_at || null,
        },
      };
      $('#storageCount').textContent = Number(state.summary.object_count || 0).toLocaleString('th-TH');
      $('#storageSize').textContent = fmtSize(state.summary.total_bytes || 0) + ' + JSON';
      $('#storageLatest').textContent = fmtDate(state.summary.latest_upload);
      $('#storageActive').textContent = state.active?.file_name || '—';
      renderFiles();
      log({ ok: true, source: 'linked Supabase project / doit_versions', summary: state.summary, active: state.active, protected_paths: state.protected_paths });
    } catch (err) {
      log(err);
    }
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
    const files = (state?.files || []).filter(f => !f.protected && new Date(f.created_at) < cutoff);
    const paths = new Set(files.map(f => f.path));
    $$('.storagePick').forEach(c => { c.checked = paths.has(c.dataset.path); });
    log({ ok: true, dry_run: true, days, cutoff: cutoff.toISOString(), count: files.length, selected_paths: [...paths].slice(0, 200), note: 'เลือก checkbox ให้แล้ว ยังไม่ลบจริง' });
  }

  function selectedPaths() {
    return $$('.storagePick:checked').map(c => c.dataset.path).filter(Boolean);
  }

  function deleteDisabled(action) {
    const paths = action === 'deleteOld' ? (previewOld(), selectedPaths()) : selectedPaths();
    log({ ok: false, action, write_enabled: false, count: paths.length, selected_paths: paths, note: 'ตอนนี้เปิดให้เลือก/preview ก่อนเท่านั้น ยังไม่เปิดลบจริงเพื่อกันพลาด' });
  }

  function init() {
    if (!$('#adminStoragePanel')) return;
    $('#storageRefresh').onclick = refresh;
    $('#storageFilter').oninput = renderFiles;
    $('#storageCheckAll').onchange = e => $$('.storagePick:not(:disabled)').forEach(c => c.checked = e.target.checked);
    $('#storagePreviewOld').onclick = previewOld;
    $('#storageDeleteOld').onclick = () => deleteDisabled('deleteOld');
    $('#storageDeleteSelected').onclick = () => deleteDisabled('deleteSelected');
    setTimeout(refresh, 400);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
