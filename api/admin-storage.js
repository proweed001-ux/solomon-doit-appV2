import crypto from 'node:crypto';

const SUPABASE_URL = 'https://saodmeoilixfdqentofp.supabase.co';
const PROJECT_REF = 'saodmeoilixfdqentofp';
const BUCKET = 'doit-files';
const LIST_PREFIXES = ['performance', 'doit', 'uploads', 'raw', 'parsed', 'team'];
const DELETE_PREFIXES = new Set(['performance', 'doit', 'uploads', 'raw', 'parsed']);
const SYSTEM_PATHS = new Set([
  'performance/active.json',
  'performance/index.json',
  'performance/current.min.json',
  'performance/history-index.json',
]);
const SYSTEM_BASENAMES = new Set(['active.json', 'index.json', 'current.min.json', 'history-index.json']);
const MAX_DELETE = 20;
const PAGE_SIZE = 1000;
const MAX_DEPTH = 6;
const MAX_OBJECTS = 20000;
const PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
const ALLOWED_IDS = new Set(['AYAADS01', 'AYAPS062']);

function json(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(status).json(body);
}

function text(value) {
  return String(value ?? '').trim();
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function parseBasic(header) {
  const match = /^Basic\s+(.+)$/i.exec(text(header));
  if (!match) return null;
  try {
    const decoded = Buffer.from(match[1], 'base64').toString('utf8');
    const split = decoded.indexOf(':');
    if (split < 1) return null;
    return { id: decoded.slice(0, split).trim().toUpperCase(), password: decoded.slice(split + 1) };
  } catch {
    return null;
  }
}

function authenticate(req) {
  const credentials = parseBasic(req.headers.authorization);
  if (!credentials || !ALLOWED_IDS.has(credentials.id)) return null;
  const candidate = crypto.createHash('sha256').update(credentials.password, 'utf8').digest('hex');
  return safeEqual(candidate, PASSWORD_HASH) ? credentials.id : null;
}

function sameOriginWrite(req) {
  const origin = text(req.headers.origin);
  if (!origin) return true;
  const host = text(req.headers['x-forwarded-host'] || req.headers.host);
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function decodeJwtPayload(token) {
  try {
    const parts = text(token).split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

function validAnonKey(value) {
  const key = text(value);
  if (key.length < 80 || key.length > 2000) return false;
  const claims = decodeJwtPayload(key);
  return Boolean(claims && claims.iss === 'supabase' && claims.role === 'anon' && claims.ref === PROJECT_REF);
}

function storageHeaders(key, extra = {}) {
  return { apikey: key, authorization: `Bearer ${key}`, ...extra };
}

function storagePath(path) {
  return encodeURIComponent(path).replace(/%2F/gi, '/');
}

function inspectPath(value) {
  const original = text(value);
  if (!original || original.length > 1024 || original.startsWith('/') || original.includes('\\') || original.includes('\0')) {
    return { ok: false, reason: 'invalid_path' };
  }
  let decoded = original;
  try {
    for (let i = 0; i < 2; i += 1) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch {
    return { ok: false, reason: 'invalid_encoding' };
  }
  if (decoded.startsWith('/') || decoded.includes('\\') || decoded.includes('\0')) return { ok: false, reason: 'invalid_path' };
  const segments = decoded.split('/');
  if (segments.length < 2 || segments.some(segment => !segment || segment === '.' || segment === '..')) {
    return { ok: false, reason: 'path_traversal' };
  }
  if (decoded !== original) return { ok: false, reason: 'encoded_path_not_allowed' };
  const prefix = segments[0].toLowerCase();
  if (!LIST_PREFIXES.includes(prefix)) return { ok: false, reason: 'folder_not_allowed' };
  return { ok: true, path: decoded, prefix, deleteFolderAllowed: DELETE_PREFIXES.has(prefix) };
}

function dateFrom(value) {
  const match = text(value).match(/(20\d{2})[-_/](\d{2})[-_/](\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : '';
}

function dateOf(file) {
  return dateFrom(file.path) || dateFrom(file.updated_at) || dateFrom(file.created_at);
}

function isFolderEntry(item) {
  const name = text(item?.name);
  if (!name || name.endsWith('/')) return true;
  const metadata = item?.metadata || null;
  const fileSignal = Boolean(item?.id || item?.updated_at || item?.created_at || item?.size || metadata?.size || metadata?.mimetype || metadata?.cacheControl);
  return !fileSignal && !/\.[A-Za-z0-9]{1,16}$/.test(name);
}

async function storageRequest(key, path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: storageHeaders(key, options.headers || {}),
    cache: 'no-store',
  });
  return response;
}

async function listFolder(key, prefix, depth, output, visited) {
  if (depth > MAX_DEPTH || output.length >= MAX_OBJECTS || visited.has(prefix)) return;
  visited.add(prefix);
  for (let offset = 0; output.length < MAX_OBJECTS; offset += PAGE_SIZE) {
    const response = await storageRequest(key, `/storage/v1/object/list/${BUCKET}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix, limit: PAGE_SIZE, offset, sortBy: { column: 'updated_at', order: 'desc' } }),
    });
    if (!response.ok) throw new Error(`storage_list_${response.status}`);
    const rows = await response.json();
    if (!Array.isArray(rows)) break;
    for (const item of rows) {
      const name = text(item?.name);
      if (!name) continue;
      const path = name.startsWith(`${prefix}/`) ? name : `${prefix}/${name}`;
      const inspected = inspectPath(path);
      if (!inspected.ok) continue;
      if (isFolderEntry(item)) {
        await listFolder(key, inspected.path, depth + 1, output, visited);
      } else {
        output.push({
          path: inspected.path,
          size: Number(item?.metadata?.size || item?.size || 0) || 0,
          created_at: item?.created_at || '',
          updated_at: item?.updated_at || item?.created_at || '',
        });
      }
      if (output.length >= MAX_OBJECTS) break;
    }
    if (rows.length < PAGE_SIZE) break;
  }
}

async function readActive(key) {
  const response = await storageRequest(key, `/storage/v1/object/${BUCKET}/performance/active.json`);
  if (!response.ok) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function collectActivePaths(active) {
  const paths = new Set();
  function walk(value, key = '', depth = 0) {
    if (depth > 8 || value == null) return;
    if (typeof value === 'string') {
      if (/(path|current|latest|previous|prev)/i.test(key)) {
        const inspected = inspectPath(value.replace(/^\/+/, ''));
        if (inspected.ok) paths.add(inspected.path);
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(item => walk(item, key, depth + 1));
      return;
    }
    if (typeof value === 'object') {
      for (const [childKey, child] of Object.entries(value)) walk(child, childKey, depth + 1);
    }
  }
  walk(active);
  return paths;
}

function classifyFiles(files, active, days = 30, now = new Date()) {
  const activePaths = collectActivePaths(active);
  const doitDates = [...new Set(files
    .filter(file => /^(doit|uploads|raw|parsed)\//i.test(file.path))
    .map(dateOf)
    .filter(Boolean))]
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 2);
  const protectedDoitDates = new Set(doitDates);
  const currentMonth = now.toISOString().slice(0, 7);
  const cutoffMs = now.getTime() - Math.max(1, Math.min(3650, Number(days) || 30)) * 86400000;

  return files.map(file => {
    const inspected = inspectPath(file.path);
    const reasons = [];
    const fileDate = dateOf(file);
    const basename = file.path.split('/').pop()?.toLowerCase() || '';
    const timestamp = Date.parse(file.updated_at || file.created_at || fileDate || '');
    const oldEnough = Number.isFinite(timestamp) && timestamp < cutoffMs;
    if (!inspected.ok) reasons.push(inspected.reason);
    if (inspected.ok && !inspected.deleteFolderAllowed) reasons.push('folder_locked');
    if (SYSTEM_PATHS.has(file.path) || SYSTEM_BASENAMES.has(basename)) reasons.push('system_file');
    if (/(^|[-_.])(current|latest|previous|prev)([-_.]|$)/i.test(basename)) reasons.push('reserved_current_path');
    if (activePaths.has(file.path)) reasons.push('active_reference');
    if (/^(doit|uploads|raw|parsed)\//i.test(file.path) && protectedDoitDates.has(fileDate)) reasons.push('latest_two_doit_dates');
    if (/^performance\//i.test(file.path) && fileDate.slice(0, 7) === currentMonth) reasons.push('current_performance_month');
    if (!oldEnough) reasons.push('not_older_than_cutoff');
    return {
      ...file,
      date: fileDate || file.updated_at || file.created_at || '',
      protected: reasons.some(reason => reason !== 'not_older_than_cutoff'),
      oldEnough,
      deletable: reasons.length === 0,
      reasons,
    };
  });
}

async function inventory(key, days, now = new Date()) {
  const files = [];
  const visited = new Set();
  const activePromise = readActive(key);
  for (const prefix of LIST_PREFIXES) await listFolder(key, prefix, 0, files, visited);
  const active = await activePromise;
  const rows = classifyFiles(files, active, days, now).sort((a, b) => String(b.updated_at || b.path).localeCompare(String(a.updated_at || a.path)));
  return {
    rows,
    activeLoaded: Boolean(active),
    truncated: files.length >= MAX_OBJECTS,
    deleteLimit: MAX_DELETE,
  };
}

function validateDeleteSelection(rows, paths, options = {}) {
  if (!options.activeLoaded) return { ok: false, status: 503, error: 'active_guard_unavailable' };
  if (options.truncated) return { ok: false, status: 503, error: 'inventory_truncated' };
  const byPath = new Map(rows.map(file => [file.path, file]));
  for (const path of paths) {
    const file = byPath.get(path);
    if (!file) return { ok: false, status: 404, error: 'file_not_found_in_fresh_inventory', path };
    if (!file.deletable) return { ok: false, status: 409, error: 'protected_file', path, reasons: file.reasons };
  }
  return { ok: true };
}

async function deletePaths(key, paths, days) {
  if (!Array.isArray(paths) || !paths.length) return { status: 400, body: { ok: false, error: 'no_paths' } };
  const uniquePaths = [...new Set(paths.map(text))];
  if (uniquePaths.length > MAX_DELETE) return { status: 400, body: { ok: false, error: 'too_many_paths', count: uniquePaths.length, max: MAX_DELETE } };
  for (const path of uniquePaths) {
    const inspected = inspectPath(path);
    if (!inspected.ok || !inspected.deleteFolderAllowed) {
      return { status: 400, body: { ok: false, error: 'protected_or_invalid_path', path, reason: inspected.reason || 'folder_locked' } };
    }
  }

  const snapshot = await inventory(key, days);
  const validation = validateDeleteSelection(snapshot.rows, uniquePaths, snapshot);
  if (!validation.ok) return { status: validation.status, body: validation };

  const deleted = [];
  const failed = [];
  for (const path of uniquePaths) {
    const response = await storageRequest(key, `/storage/v1/object/${BUCKET}/${storagePath(path)}`, { method: 'DELETE' });
    if (response.ok) deleted.push(path);
    else failed.push({ path, status: response.status });
  }
  const verifiedMissing = [];
  for (const path of deleted) {
    const response = await storageRequest(key, `/storage/v1/object/${BUCKET}/${storagePath(path)}`);
    if (response.status === 404 || response.status === 400) verifiedMissing.push(path);
  }
  return {
    status: failed.length ? 207 : 200,
    body: {
      ok: failed.length === 0 && verifiedMissing.length === deleted.length,
      requestedCount: uniquePaths.length,
      deletedCount: deleted.length,
      verifiedMissingCount: verifiedMissing.length,
      deleted,
      verifiedMissing,
      failed,
    },
  };
}

export default async function handler(req, res) {
  try {
    const action = text(req.query?.action || (req.body && req.body.action) || 'session').toLowerCase();
    const user = authenticate(req);
    if (!user) return json(res, 401, { ok: false, error: 'unauthorized' });
    if (action === 'session' || action === 'login') return json(res, 200, { ok: true, user });
    if (req.method === 'POST' && !sameOriginWrite(req)) return json(res, 403, { ok: false, error: 'cross_origin_write_forbidden' });

    const key = text(req.headers['x-supabase-anon-key']);
    if (!validAnonKey(key)) return json(res, 503, { ok: false, error: 'valid_anon_key_unavailable' });
    const days = Math.max(1, Math.min(3650, Number(req.query?.days || req.body?.days || 30) || 30));

    if (req.method === 'GET' && (action === 'list' || action === 'dry-run')) {
      const result = await inventory(key, days);
      const candidates = result.rows.filter(file => file.deletable);
      return json(res, 200, {
        ok: true,
        dryRun: true,
        bucket: BUCKET,
        days,
        total: result.rows.length,
        candidateCount: candidates.length,
        protectedCount: result.rows.filter(file => file.protected).length,
        deleteLimit: result.deleteLimit,
        activeGuardLoaded: result.activeLoaded,
        truncated: result.truncated,
        files: result.rows,
      });
    }

    if (req.method === 'GET' && action === 'download') {
      const inspected = inspectPath(req.query?.path);
      if (!inspected.ok) return json(res, 400, { ok: false, error: inspected.reason });
      const response = await storageRequest(key, `/storage/v1/object/${BUCKET}/${storagePath(inspected.path)}`);
      if (!response.ok) return json(res, response.status, { ok: false, error: 'download_failed' });
      const body = Buffer.from(await response.arrayBuffer());
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(inspected.path.split('/').pop() || 'file')}`);
      return res.status(200).send(body);
    }

    if (req.method === 'POST' && action === 'delete') {
      const result = await deletePaths(key, req.body?.paths, days);
      return json(res, result.status, result.body);
    }

    return json(res, 405, { ok: false, error: 'method_not_allowed' });
  } catch (error) {
    return json(res, 500, { ok: false, error: 'unexpected_error', detail: String(error?.message || error) });
  }
}

export const _test = {
  authenticate,
  collectActivePaths,
  classifyFiles,
  inspectPath,
  parseBasic,
  validateDeleteSelection,
  validAnonKey,
  MAX_DELETE,
};
