const PROXY_TOKEN = 'b8922af21a1f43bb9df0bf747a12e862';
const CLEANUP_URL = 'https://saodmeoilixfdqentofp.supabase.co/functions/v1/cleanup-orphan-doit-20260729?token=c7f1b03d52d64214a6dd0d8a7f9c2e55';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  if (String(req.query?.token || '') !== PROXY_TOKEN) return res.status(401).json({ ok: false, error: 'unauthorized' });
  try {
    const response = await fetch(CLEANUP_URL, { cache: 'no-store' });
    const text = await response.text();
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json; charset=utf-8');
    return res.send(text);
  } catch (error) {
    return res.status(502).json({ ok: false, error: 'cleanup_proxy_failed', detail: String(error?.message || error) });
  }
}
