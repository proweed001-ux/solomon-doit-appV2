import { useEffect, useMemo, useRef, useState } from 'react';
import { UploadCloud, RefreshCw, LogOut } from 'lucide-react';
import {
  clearSession,
  fetchPromoBundle,
  hasSupabaseConfig,
  importPromoBundle,
  publishPromoMonth,
  readSession,
  saveSession,
  signInPromoAdmin,
  updatePromoPrice,
  updateReviewStatus,
} from './promoApi';
import { normalizePromoBundle, type PromoBundle, type PromoSession } from './promoTypes';
import { fmt, money } from './promoCalculator';

export default function PromoAdminPage() {
  const [session, setSession] = useState<PromoSession | null>(() => readSession());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bundle, setBundle] = useState<PromoBundle | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement | null>(null);

  const token = session?.access_token;

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPromoBundle(token);
      setBundle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'โหลดข้อมูลหลังบ้านไม่ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [token]);

  const login = async () => {
    setLoading(true);
    setError('');
    try {
      const next = await signInPromoAdmin(email.trim(), password);
      saveSession(next);
      setSession(next);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เข้าสู่ระบบไม่ได้');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  const importJson = async (file: File) => {
    if (!token) {
      setError('ต้องเข้าสู่ระบบ Admin ก่อนนำเข้าไฟล์');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const raw = JSON.parse(await file.text());
      const normalized = normalizePromoBundle(raw);
      await importPromoBundle(normalized, token);
      await load();
      alert('นำเข้าข้อมูลโปรแล้ว');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'นำเข้า JSON ไม่ได้');
    } finally {
      setLoading(false);
    }
  };

  const missingPrices = useMemo(() => (bundle?.price_by_month || []).filter(row => row.price == null || row.price_status === 'missing' || row.price_status === 'conflict'), [bundle]);
  const pendingReviews = useMemo(() => (bundle?.review_queue || []).filter(row => row.status === 'pending'), [bundle]);
  const draftMonths = useMemo(() => (bundle?.promo_months || []).filter(row => row.status !== 'published'), [bundle]);

  const savePrice = async (priceId: string) => {
    if (!token) return setError('ต้องเข้าสู่ระบบ Admin ก่อนบันทึก');
    const raw = priceDrafts[priceId];
    const value = raw == null || raw.trim() === '' ? null : Number(raw);
    if (value != null && !Number.isFinite(value)) return setError('ราคาต้องเป็นตัวเลข');
    await updatePromoPrice(priceId, value, token);
    await load();
  };

  const markReview = async (reviewId: string, status: 'fixed' | 'ignored') => {
    if (!token) return setError('ต้องเข้าสู่ระบบ Admin ก่อนบันทึก');
    await updateReviewStatus(reviewId, status, token);
    await load();
  };

  const publish = async (monthId: string) => {
    if (!token) return setError('ต้องเข้าสู่ระบบ Admin ก่อน Publish');
    const ok = confirm(`Publish เดือน ${monthId}? ถ้าราคายัง missing หน้าใช้งานจะเห็นว่าไม่มีราคา`);
    if (!ok) return;
    await publishPromoMonth(monthId, token);
    await load();
  };

  return (
    <main className="promo-page promo-admin">
      <section className="promo-hero">
        <div>
          <div className="promo-kicker">Promo Admin</div>
          <h1>หลังบ้านโปรรายเดือน</h1>
          <p>นำเข้า JSON, กรอกราคา, เคลียร์คิวตรวจ และ Publish โปรโดยไม่ต้องแก้โค้ด</p>
        </div>
        <button className="promo-secondary" disabled={loading} onClick={load}><RefreshCw size={16} /> โหลดใหม่</button>
      </section>

      {!hasSupabaseConfig() && (
        <section className="promo-error">
          ยังไม่ได้ตั้งค่า VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ใน Vercel จึงยังบันทึกถาวรไม่ได้
        </section>
      )}
      {error && <section className="promo-error">{error}</section>}

      {!session ? (
        <section className="promo-card-block">
          <h2>เข้าสู่ระบบ Admin</h2>
          <div className="promo-login-grid">
            <label><span>Email</span><input value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@email.com" /></label>
            <label><span>Password</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
            <button className="promo-primary" disabled={loading || !email || !password} onClick={login}>เข้าสู่ระบบ</button>
          </div>
          <p className="promo-note">ต้องสร้างผู้ใช้ใน Supabase Auth และเพิ่ม user_id ลงตาราง promo_admin_users ก่อน จึงจะเขียนข้อมูลได้</p>
        </section>
      ) : (
        <section className="promo-card-block promo-admin-topbar">
          <div>เข้าสู่ระบบแล้ว: <b>{session.user?.email || 'admin'}</b></div>
          <button className="promo-secondary" onClick={logout}><LogOut size={16} /> ออกจากระบบ</button>
        </section>
      )}

      <section className="promo-admin-stats">
        <div><span>เดือน</span><b>{fmt(bundle?.promo_months.length || 0)}</b></div>
        <div><span>การ์ด</span><b>{fmt(bundle?.promo_cards.length || 0)}</b></div>
        <div><span>ราคา missing/conflict</span><b>{fmt(missingPrices.length)}</b></div>
        <div><span>คิวตรวจ pending</span><b>{fmt(pendingReviews.length)}</b></div>
      </section>

      <section className="promo-card-block">
        <h2>นำเข้า JSON รายเดือน</h2>
        <p className="promo-note">ใช้ไฟล์ promo-data-jul26-v1.json หรือไฟล์เดือนใหม่ที่แปลงจาก Excel หลังบ้านแล้ว</p>
        <input ref={inputRef} type="file" className="hidden" accept=".json,application/json" onChange={e => {
          const file = e.target.files?.[0];
          if (file) void importJson(file);
          e.currentTarget.value = '';
        }} />
        <button className="promo-primary" disabled={!session || loading} onClick={() => inputRef.current?.click()}><UploadCloud size={16} /> เลือก JSON แล้วนำเข้า</button>
      </section>

      <section className="promo-card-block">
        <h2>Publish เดือนโปร</h2>
        {draftMonths.length === 0 ? <p className="promo-note">ไม่มีเดือน Draft</p> : draftMonths.map(month => (
          <div className="promo-admin-row" key={month.id}>
            <div><b>{month.label || month.id}</b><small>{month.year_month} · {month.status}</small></div>
            <button className="promo-primary" disabled={!session} onClick={() => publish(month.id)}>Publish</button>
          </div>
        ))}
      </section>

      <section className="promo-card-block">
        <h2>ราคาที่ต้องกรอก</h2>
        {missingPrices.length === 0 ? <p className="promo-note">ไม่มีราคา missing/conflict</p> : missingPrices.slice(0, 120).map(row => (
          <div className="promo-admin-row" key={row.price_id}>
            <div><b>{row.brand || '-'} · {row.product_name || row.sku_id}</b><small>{row.promo_month_id} · {row.price_status} · เดิม ฿{money(row.price)}</small></div>
            <label><span>ราคา</span><input type="number" step="0.01" value={priceDrafts[row.price_id] ?? ''} onChange={e => setPriceDrafts(prev => ({ ...prev, [row.price_id]: e.target.value }))} /></label>
            <button className="promo-secondary" disabled={!session} onClick={() => savePrice(row.price_id)}>บันทึก</button>
          </div>
        ))}
      </section>

      <section className="promo-card-block">
        <h2>REVIEW_QUEUE</h2>
        {pendingReviews.length === 0 ? <p className="promo-note">คิวตรวจหมดแล้ว</p> : pendingReviews.slice(0, 120).map(row => (
          <div className="promo-review-row" key={row.review_id}>
            <div><b>{row.problem_type}</b><small>{row.card_id || '-'} · {row.target_table || '-'}</small><p>{row.raw_text}</p><p className="promo-note">{row.suggestion}</p></div>
            <div className="promo-review-actions">
              <button className="promo-secondary" disabled={!session} onClick={() => markReview(row.review_id, 'fixed')}>แก้แล้ว</button>
              <button className="promo-secondary" disabled={!session} onClick={() => markReview(row.review_id, 'ignored')}>ข้าม</button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
