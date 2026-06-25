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
    if (state.protected.has(f.path)) return { label: 'กันลบ', locked: true, reason: 'active/latest/previous/system' };
    if (isSystem(f.path)) return { label: 'ระบบ', locked: true, reason: 'system file' };
    if (isPerfJson(f.path)) return { label: 'JSON', locked: false, reason: 'performance json' };
    if (isRaw(f.path)) return { label: 'RAW', locked: false, reason: 'raw/excel temp' };
    return { label: 'อื่น ๆ', locked: false, reason: 'other' };
  }

  function cleanupCandidates(mode = 'retention') {
    const now = new Date();
    const perfCutoff = new Date(now); perfCutoff.setDate(now.getDate() - PERF_RETENTION_DAYS);
    const rawCutoff = new Date(now); rawCutoff.setDate(now.getDate() - RAW_RETENTION_DAYS);
    const out = new Map();
    const add = (f, reason) => { if (!state.protected.has(f.path) && !isSystem(f.path)) out.set(f.path, { ...f, reason }); };
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

  function render() {
    const q = String($('#storageFilter')?.value || '').toLowerCase();
    const body = $('#storageFiles');
    if (!body) return;
    const rows = state.files.filter(f => !q || f.path.toLowerCase().includes(q));
    body.innerHTML = rows.length ? rows.map(f => {
      const c = classifyFile(f);
      const checked = selected.has(f.path) ? 'checked' : '';
      const disabled = c.locked ? 'disabled' : '';
      return `<tr>
        <td><input class="storagePick" type="checkbox" data-path="${esc(f.path)}" ${checked} ${disabled}></td>
        <td>${esc(c.label)}</td>
        <td><span class="mono">${esc(f.path)}</span><div class="muted">${esc(c.reason)}</div></td>
        <td>${esc(fmtSize(f.size))}</td>
        <td>${esc(fmtDate(f.created_at || f.date))}</td>
        <td>${esc(f.date || '—')}</td>
        <td><button class="btn2 storageDownload" data-path="${esc(f.path)}">โหลด</button></td>
      </tr>`;
    }).join('') : '<tr><td colspan="7" class="muted">ไม่พบไฟล์</td></tr>';
    $$('.storagePick').forEach(x => x.onchange = e => { const p = e.target.dataset.path; if (e.target.checked) selected.add(p); else selected.delete(p); updateSelected(); });
    $$('.storageDownload').forEach(x => x.onclick = () => downloadPath(x.dataset.path));
    updateSelected();
  }
  function updateSelected() { const el = $('#storageSelectedCount'); if (el) el.textContent = `เลือกแล้ว ${selected.size.toLocaleString('th-TH')} ไฟล์`; }

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
      render();
      const candidates = cleanupCandidates();
      log({ ok: true, policy: { performance_json_days: PERF_RETENTION_DAYS, raw_days: RAW_RETENTION_DAYS, keep_revisions_per_day: KEEP_REVISIONS_PER_DAY }, files: files.length, protected: state.protected.size, cleanup_candidates: candidates.length, active });
    } catch (err) { log(err); }
  }

  function previewOld() {
    selected.clear();
    cleanupCandidates().forEach(f => selected.add(f.path));
    render();
    log({ ok: true, dry_run: true, selected_count: selected.size, selected_paths: [...selected].slice(0, 200), note: 'ยังไม่ลบจริง ต้องพิมพ์ DELETE แล้วกดลบ' });
  }
  async function deleteSelected(action) {
    try {
      if ($('#storageConfirm')?.value !== 'DELETE') { log({ ok: false, action, need_confirm: 'พิมพ์ DELETE ก่อนลบ' }); return; }
      const paths = action === 'old' ? cleanupCandidates().map(f => f.path) : [...selected];
      const safe = paths.filter(p => !state.protected.has(p) && !isSystem(p));
      if (!safe.length) { log({ ok: false, action, note: 'ไม่มีไฟล์ที่ลบได้' }); return; }
      log({ ok: true, action, deleting: safe.length, paths: safe.slice(0, 200) });
      const res = await deleteObjects(safe);
      log({ ok: true, action, deleted_count: safe.length, result: res });
      selected.clear();
      await refresh();
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
  function improveUi() {
    if (!document.getElementById('storageSelectedCount') && $('#storageFilter')) {
      const s = document.createElement('span');
      s.id = 'storageSelectedCount'; s.className = 'muted'; s.style.marginLeft = '8px'; s.textContent = 'เลือกแล้ว 0 ไฟล์';
      $('#storageFilter').after(s);
    }
    const hint = $('#adminStoragePanel .safeBox');
    if (hint) hint.innerHTML = `<b>Auto Cleanup Policy</b><br>JSON Performance เก็บ ${PERF_RETENTION_DAYS} วัน · Excel/Raw เก็บ ${RAW_RETENTION_DAYS} วัน · revision วันเดียวกันเก็บ ${KEEP_REVISIONS_PER_DAY} ไฟล์ล่าสุด · active/latest/previous/index ถูกกันลบ`;
  }
  function init() {
    if (!$('#adminStoragePanel')) return;
    improveUi();
    $('#storageRefresh').onclick = refresh;
    $('#storagePreviewOld').onclick = previewOld;
    $('#storageDeleteOld').onclick = () => deleteSelected('old');
    $('#storageDeleteSelected').onclick = () => deleteSelected('selected');
    $('#storageFilter').oninput = render;
    $('#storageCheckAll').onchange = e => {
      selected.clear();
      if (e.target.checked) state.files.forEach(f => { const c = classifyFile(f); if (!c.locked) selected.add(f.path); });
      render();
    };
    setTimeout(refresh, 400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
