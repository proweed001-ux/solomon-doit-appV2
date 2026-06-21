(() => {
  'use strict';

  const END = 'https://saodmeoilixfdqentofp.supabase.co/functions/v1/admin-storage';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const tokenKey = 'doit-admin-storage-token';
  let state = null;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const fmtSize = n => {
    n = Number(n) || 0;
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
  const token = () => ($('#storageToken')?.value || '').trim();
  const headers = () => ({ 'content-type': 'application/json', 'x-admin-token': token() });

  async function api(path = '', options = {}) {
    const res = await fetch(END + path, { ...options, headers: { ...headers(), ...(options.headers || {}) } });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    if (!res.ok) throw data;
    return data;
  }

  function renderFiles() {
    const q = ($('#storageFilter')?.value || '').trim().toLowerCase();
    const body = $('#storageFiles');
    if (!body) return;
    const files = (state?.files || []).filter(f => !q || String(f.path).toLowerCase().includes(q) || String(f.version?.file_name || '').toLowerCase().includes(q));
    body.innerHTML = files.length ? files.map(f => {
      const tags = [
        f.is_active ? '<span class="pill ready">ACTIVE</span>' : '',
        f.protected ? '<span class="pill fail">PROTECT</span>' : '',
        f.is_latest_protected ? '<span class="pill cloud">LATEST</span>' : '',
      ].join(' ');
      const version = f.version ? `${esc(f.version.file_name || '-')}<br><span class="muted">rows ${Number(f.version.row_count || 0).toLocaleString('th-TH')} / PS ${Number(f.version.ps_count || 0).toLocaleString('th-TH')}</span>` : '<span class="muted">ไม่มี version</span>';
      return `<tr>
        <td><input class="storagePick" type="checkbox" data-path="${esc(f.path)}" ${f.protected ? 'disabled' : ''}></td>
        <td>${tags || '<span class="muted">normal</span>'}</td>
        <td style="word-break:break-all;font-family:ui-monospace,SFMono-Regular,Consolas,monospace">${esc(f.path)}</td>
        <td>${fmtSize(f.size)}</td>
        <td>${fmtDate(f.created_at)}</td>
        <td>${version}</td>
        <td><button class="btn2 storageDownload" data-path="${esc(f.path)}">ดาวน์โหลด</button></td>
      </tr>`;
    }).join('') : '<tr><td colspan="7" class="muted">ไม่พบไฟล์</td></tr>';
    $$('.storageDownload').forEach(btn => btn.onclick = () => signedUrl(btn.dataset.path));
  }

  async function refresh() {
    try {
      log('กำลังโหลด Storage...');
      state = await api('');
      $('#storageCount').textContent = Number(state.summary?.object_count || 0).toLocaleString('th-TH');
      $('#storageSize').textContent = fmtSize(state.summary?.total_bytes || 0);
      $('#storageLatest').textContent = fmtDate(state.summary?.latest_upload);
      $('#storageActive').textContent = state.active?.file_name || '—';
      renderFiles();
      log({ ok: true, summary: state.summary, active: state.active, protected_paths: state.protected_paths });
    } catch (err) {
      log(err);
    }
  }

  async function signedUrl(path) {
    try {
      const out = await api('?action=signed-url&path=' + encodeURIComponent(path));
      window.open(out.url, '_blank');
    } catch (err) { log(err); }
  }

  async function post(action, extra = {}) {
    return api('', { method: 'POST', body: JSON.stringify({ action, ...extra }) });
  }

  function init() {
    if (!$('#adminStoragePanel')) return;
    $('#storageToken').value = localStorage.getItem(tokenKey) || '';
    $('#storageSaveToken').onclick = () => { localStorage.setItem(tokenKey, token()); log('บันทึก token แล้ว'); };
    $('#storageClearToken').onclick = () => { localStorage.removeItem(tokenKey); $('#storageToken').value = ''; log('ล้าง token แล้ว'); };
    $('#storageRefresh').onclick = refresh;
    $('#storageFilter').oninput = renderFiles;
    $('#storageCheckAll').onchange = e => $$('.storagePick:not(:disabled)').forEach(c => c.checked = e.target.checked);
    $('#storagePreviewOld').onclick = async () => {
      try { log(await post('cleanupOld', { days: Number($('#storageDays').value) || 30, dry_run: true })); }
      catch (err) { log(err); }
    };
    $('#storageDeleteOld').onclick = async () => {
      try { log(await post('cleanupOld', { days: Number($('#storageDays').value) || 30, dry_run: false, confirm: $('#storageConfirm').value.trim() })); await refresh(); }
      catch (err) { log(err); }
    };
    $('#storageDeleteSelected').onclick = async () => {
      try {
        const paths = $$('.storagePick:checked').map(c => c.dataset.path);
        log(await post('deleteSelected', { paths, confirm: $('#storageConfirm').value.trim() }));
        await refresh();
      } catch (err) { log(err); }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
