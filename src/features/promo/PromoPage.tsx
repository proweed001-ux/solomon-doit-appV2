import { useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { fetchPromoBundle } from './promoApi';
import { calculatePromo, fmt, money } from './promoCalculator';
import type { CardSku, PriceByMonth, PromoBundle, PromoCard } from './promoTypes';

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    ready: 'พร้อมใช้', need_review: 'ต้องตรวจ', inactive: 'ปิด', missing: 'หายไป', changed: 'เปลี่ยน', new: 'ใหม่', repeated: 'ซ้ำ',
    found: 'มีราคา', manual: 'กรอกเอง', conflict: 'ราคาชนกัน', not_found: 'ไม่พบ', matched: 'จับคู่แล้ว', multi_match: 'หลายตัว',
  };
  return map[status] || status;
}

export default function PromoPage() {
  const [bundle, setBundle] = useState<PromoBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [monthId, setMonthId] = useState('');
  const [classId, setClassId] = useState('');
  const [search, setSearch] = useState('');
  const [activeCard, setActiveCard] = useState<PromoCard | null>(null);
  const [activeSkuId, setActiveSkuId] = useState('');
  const [qty, setQty] = useState(1);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const next = await fetchPromoBundle();
      setBundle(next);
      const firstMonth = next.promo_months[0]?.id || '';
      const firstClass = next.promo_classes[0]?.class_id || '';
      setMonthId(current => current || firstMonth);
      setClassId(current => current || firstClass);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'โหลดข้อมูลโปรไม่ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const cards = useMemo(() => {
    if (!bundle) return [];
    const q = search.trim().toLowerCase();
    return bundle.promo_cards
      .filter(card => card.promo_month_id === monthId)
      .filter(card => !classId || card.class_id === classId)
      .filter(card => card.status !== 'inactive')
      .filter(card => !q || `${card.promo_title} ${card.raw_text} ${card.initiative_id}`.toLowerCase().includes(q))
      .sort((a, b) => a.sort_order - b.sort_order || a.card_id.localeCompare(b.card_id));
  }, [bundle, monthId, classId, search]);

  const cardSkus = useMemo(() => {
    if (!bundle || !activeCard) return [];
    return bundle.card_skus
      .filter(row => row.card_id === activeCard.card_id)
      .sort((a, b) => a.sort_order - b.sort_order || a.card_sku_id.localeCompare(b.card_sku_id));
  }, [bundle, activeCard]);

  const selectedCardSku = cardSkus.find(row => row.sku_id === activeSkuId) || cardSkus[0];
  const selectedSku = bundle?.sku_master.find(sku => sku.sku_id === selectedCardSku?.sku_id);
  const selectedPrice: PriceByMonth | undefined = bundle?.price_by_month.find(price => price.promo_month_id === monthId && price.sku_id === selectedCardSku?.sku_id);
  const tiers = bundle?.promo_tiers.filter(tier => tier.card_id === activeCard?.card_id).sort((a, b) => (a.min_qty ?? 0) - (b.min_qty ?? 0)) || [];
  const calc = calculatePromo(qty, selectedPrice?.price ?? null, tiers);

  const openCard = (card: PromoCard) => {
    setActiveCard(card);
    const firstSku = bundle?.card_skus.find(row => row.card_id === card.card_id)?.sku_id || '';
    setActiveSkuId(firstSku);
    setQty(1);
  };

  if (loading) {
    return <main className="promo-page"><div className="promo-card-block">กำลังโหลดโปร...</div></main>;
  }

  return (
    <main className="promo-page">
      <section className="promo-hero">
        <div>
          <div className="promo-kicker">Solomon Promo</div>
          <h1>โปรรายเดือน</h1>
          <p>เลือกเดือน → เลือกคลาส → จิ้มการ์ด → ใส่จำนวน → ระบบคำนวณราคาและส่วนลดจากข้อมูลหลังบ้าน</p>
        </div>
        <button className="promo-secondary" onClick={load}><RefreshCw size={16} /> โหลดใหม่</button>
      </section>

      {error && <div className="promo-error">{error}</div>}
      {!bundle || bundle.promo_months.length === 0 ? (
        <section className="promo-card-block">
          ยังไม่มีข้อมูลโปรในเว็บ ให้เข้าหน้า <b>?view=promo-admin</b> แล้วนำเข้า JSON หรือเชื่อม Supabase ก่อน
        </section>
      ) : (
        <>
          <section className="promo-toolbar">
            <label><span>เดือน</span><select value={monthId} onChange={e => setMonthId(e.target.value)}>{bundle.promo_months.map(month => <option key={month.id} value={month.id}>{month.label || month.id}</option>)}</select></label>
            <label><span>คลาส</span><select value={classId} onChange={e => setClassId(e.target.value)}><option value="">ทั้งหมด</option>{bundle.promo_classes.map(cls => <option key={cls.class_id} value={cls.class_id}>{cls.class_name}</option>)}</select></label>
            <label className="promo-search"><span>ค้นหา</span><div><Search size={15} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="แบรนด์ / SKU / เงื่อนไข" /></div></label>
          </section>

          <section className="promo-class-tabs">
            {bundle.promo_classes.map(cls => (
              <button key={cls.class_id} className={classId === cls.class_id ? 'active' : ''} onClick={() => setClassId(cls.class_id)}>{cls.class_name}</button>
            ))}
          </section>

          <section className="promo-grid">
            {cards.map(card => {
              const skus = bundle.card_skus.filter(row => row.card_id === card.card_id);
              const prices = skus.map(row => bundle.price_by_month.find(price => price.promo_month_id === monthId && price.sku_id === row.sku_id));
              const missingPrices = prices.filter(price => !price || price.price == null || price.price_status === 'missing').length;
              return (
                <button key={card.card_id} className="promo-card" onClick={() => openCard(card)}>
                  {card.image_url ? <img src={card.image_url} alt={card.promo_title} /> : <div className="promo-image-fallback">{card.image_name || card.card_id}</div>}
                  <div className="promo-card-body">
                    <div className="promo-card-title">{card.promo_title}</div>
                    <div className="promo-card-meta">{card.card_id} · SKU {fmt(skus.length)} · {statusLabel(card.status)}</div>
                    {missingPrices > 0 && <div className="promo-warning">ราคา missing {fmt(missingPrices)} รายการ</div>}
                  </div>
                </button>
              );
            })}
          </section>

          {cards.length === 0 && <section className="promo-card-block">ไม่พบการ์ดตามตัวกรอง</section>}
        </>
      )}

      {activeCard && (
        <section className="promo-modal-backdrop" onClick={() => setActiveCard(null)}>
          <div className="promo-modal" onClick={e => e.stopPropagation()}>
            <div className="promo-modal-head">
              <div><b>{activeCard.promo_title}</b><small>{activeCard.card_id}</small></div>
              <button onClick={() => setActiveCard(null)}>ปิด</button>
            </div>
            <p className="promo-raw">{activeCard.raw_text}</p>

            <label className="promo-full-label">
              <span>เลือกสินค้าในโปรนี้</span>
              <select value={activeSkuId} onChange={e => setActiveSkuId(e.target.value)}>
                {cardSkus.map((row: CardSku) => (
                  <option key={row.card_sku_id} value={row.sku_id || row.card_sku_id}>
                    {row.brand_text || selectedSku?.brand || '-'} · {row.product_text || selectedSku?.product_name || 'ไม่พบ SKU'} · {row.size_text || selectedSku?.size_text || ''} · {statusLabel(row.match_status)}
                  </option>
                ))}
              </select>
            </label>

            <div className="promo-calc-grid">
              <label><span>จำนวน</span><input type="number" min="0" step="1" value={qty} onChange={e => setQty(Number(e.target.value))} /></label>
              <div><span>ราคา/ชิ้น</span><b>฿{money(selectedPrice?.price ?? null)}</b><small>{selectedPrice ? statusLabel(selectedPrice.price_status) : 'ไม่พบราคา'}</small></div>
              <div><span>ขั้นที่เข้า</span><b>{calc.tier?.note || 'ยังไม่เข้าเงื่อนไข'}</b></div>
              <div><span>ยอดก่อนลด</span><b>฿{money(calc.gross)}</b></div>
              <div><span>ส่วนลด</span><b>{fmt(calc.discountPercent)}% / ฿{money(calc.discountAmount)}</b></div>
              <div><span>ของแถม</span><b>{fmt(calc.freeQty)}</b></div>
              <div><span>ยอดสุทธิ</span><b>฿{money(calc.net)}</b></div>
              <div><span>ราคาเฉลี่ย</span><b>฿{money(calc.averagePrice)}</b></div>
            </div>

            <div className="promo-tier-list">
              {tiers.map(tier => <span key={tier.tier_id}>{tier.note || `${tier.min_qty} ${tier.unit} ลด ${tier.discount_percent}%`}</span>)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
