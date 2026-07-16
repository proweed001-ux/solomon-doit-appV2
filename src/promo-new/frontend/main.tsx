import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Gift, Minus, Plus, Search, ShoppingBasket, X } from 'lucide-react';
import type { PromoCard, PromoDataset, PromotionTier } from '../domain/types';
import { calculatePromotion } from '../domain/calculator';
import { createDemoDataset } from '../shared/demo-data';
import { fetchPublished } from '../shared/api';
import './front.css';

const money = (value: number) => value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const tierText = (tier: PromotionTier) => tier.sourceText || (tier.type === 'free_goods'
  ? `ซื้อ ${tier.minQuantity} ${tier.purchaseUnit} ฟรี ${tier.freeQuantity} ${tier.rewardUnit || tier.purchaseUnit}`
  : `ซื้อ ${tier.minQuantity} ${tier.purchaseUnit} ลด ${tier.discountPercent}%`);

function Detail({ card, name, sku, onClose }: { card: PromoCard; name: string; sku: string; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1);
  const price = card.price.effectivePrice?.amount || 0;
  const result = price > 0 ? calculatePromotion(price, quantity, card.promotionTiers) : null;
  return <div className="detail-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="detail-panel" role="dialog" aria-modal="true" aria-label={name}>
    {card.imageUrl && <img src={card.imageUrl} alt={name} />}
    <h2 className="detail-title">{name}</h2><div className="promo-pills"><span className="promo-pill">{sku}</span><span className="promo-pill">{card.classId}</span><span className={`promo-pill ${card.status === 'ready' ? 'ready' : 'review'}`}>{card.status === 'ready' ? 'พร้อมคำนวณ' : 'ต้องตรวจ'}</span></div>
    <div className="detail-metrics"><div className="detail-metric"><span>ราคา/ชิ้น</span><b>{price ? `฿${money(price)}` : '-'}</b></div><div className="detail-metric"><span>จำนวน Tier</span><b>{card.promotionTiers.length}</b></div><div className="detail-metric"><span>Class</span><b>{card.classId}</b></div></div>
    <div className="quantity-row"><button aria-label="ลดจำนวน" onClick={() => setQuantity(value => Math.max(1, value - 1))}><Minus size={20} /></button><input aria-label="จำนวนซื้อ" type="number" min="1" step="1" value={quantity} onChange={event => setQuantity(Math.max(1, Math.floor(Number(event.target.value) || 1)))} /><button aria-label="เพิ่มจำนวน" onClick={() => setQuantity(value => value + 1)}><Plus size={20} /></button></div>
    {card.promotionTiers.map(tier => <div className={`detail-tier ${result?.activeTier?.tierNo === tier.tierNo ? 'active' : ''}`} key={`${tier.tierNo}-${tier.type}`}><span>{tierText(tier)}</span><span className="tier-kind">{tier.type === 'cash_discount' ? 'ลดเงิน' : tier.type === 'free_goods' ? 'ของแถม' : 'ราคาเหมา'}</span></div>)}
    {result?.nextTier && <div className="next-tier">ซื้อเพิ่มอีก {Math.max(0, result.nextTier.minQuantity - result.quantity)} {result.nextTier.purchaseUnit} ถึง Tier ถัดไป</div>}
    {result && <><div className="result-card"><h3><ShoppingBasket size={15} /> สรุปราคา</h3><div className="result-row"><span>ยอดก่อนส่วนลด</span><b>฿{money(result.grossAmount)}</b></div><div className="result-row"><span>ส่วนลดเงินสด</span><b>− ฿{money(result.cashDiscount)}</b></div><div className="result-row total"><span>ยอดสุทธิ</span><b>฿{money(result.netAmount)}</b></div><div className="result-row"><span>ราคาต่อหน่วยซื้อ</span><b>฿{money(result.purchasedUnitPrice)}</b></div>{result.giftQuantity > 0 && <div className="result-row"><span>ราคาต่อหน่วยรวมของแถม</span><b>฿{money(result.effectiveUnitPriceIncludingGifts)}</b></div>}</div>{result.giftQuantity > 0 && <div className="gift-row"><Gift size={16} /> ได้ของแถม {result.giftQuantity} {result.giftUnit} — ไม่ถูกนำไปหักเป็นส่วนลดเงินสด</div>}</>}
    {!result && <div className="next-tier">การ์ดนี้ยังไม่มีราคากลาง จึงยังคำนวณไม่ได้</div>}
    <button className="detail-close" onClick={onClose}><X size={16} /> ปิด</button>
  </section></div>;
}

function CustomerApp() {
  const params = new URLSearchParams(location.search);
  const demo = params.get('demo') === '1';
  const requestedMonth = params.get('month') || '';
  const [dataset, setDataset] = useState<PromoDataset | null>(demo ? createDemoDataset('published') : null);
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState('');
  const [activeClass, setActiveClass] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PromoCard | null>(null);

  useEffect(() => {
    if (demo) return;
    fetchPublished(requestedMonth).then(data => {
      if (data && data.version.status !== 'published') throw new Error('frontend_rejected_non_published_version');
      setDataset(data);
    }).catch(caught => setError(String((caught as Error).message || caught))).finally(() => setLoading(false));
  }, [demo, requestedMonth]);

  const classes = useMemo(() => {
    const counts = new Map<string, number>();
    dataset?.cards.forEach(card => { if (card.classId) counts.set(card.classId, (counts.get(card.classId) || 0) + 1); });
    return [...counts.entries()].sort(([left], [right]) => left.localeCompare(right));
  }, [dataset]);
  useEffect(() => { if (!activeClass && classes.length) setActiveClass(classes[0][0]); }, [classes, activeClass]);
  const skuMap = useMemo(() => new Map(dataset?.skus.map(sku => [sku.id, sku]) || []), [dataset]);
  const cards = useMemo(() => (dataset?.cards || []).filter(card => card.classId === activeClass).filter(card => {
    const sku = card.skuId ? skuMap.get(card.skuId) : null;
    const haystack = [card.id, sku?.canonicalName, sku?.code, ...card.promotionTiers.map(tier => tier.sourceText)].join(' ').toLowerCase();
    return !query || haystack.includes(query.toLowerCase());
  }), [dataset, activeClass, query, skuMap]);
  const selectedSku = selected?.skuId ? skuMap.get(selected.skuId) : null;
  const monthLabel = dataset?.version.monthKey || requestedMonth || '-';
  return <div className="customer-shell"><header className="customer-hero"><div className="customer-hero-inner"><div className="customer-row"><div><div className="eyebrow">โปรโมชัน {demo ? '· PREVIEW DEMO' : ''}</div><h1>คุ้มเวอร์!</h1><div className="customer-sub">เลือกรายการ ปรับจำนวน และดู Tier ที่ถึงทันที</div></div><div className="month-badge"><small>เดือนโปรโมชั่น</small>{monthLabel}</div></div><nav className="class-tabs" aria-label="Class โปรโมชั่น">{classes.map(([classId, count]) => <button className={`class-tab ${activeClass === classId ? 'active' : ''}`} key={classId} onClick={() => setActiveClass(classId)}>{classId}<small>{count}</small></button>)}</nav></div></header>
    <main className="customer-main">{demo && <div className="customer-notice"><div><b>Preview แบบสาธิต</b><span>ข้อมูลนี้ใช้ตรวจหน้าจอและสูตร ยังไม่ใช่ Production</span></div><span>Published fixture</span></div>}{loading && <div className="customer-empty">กำลังโหลดเวอร์ชัน Published...</div>}{error && <div className="customer-error">โหลดโปรโมชั่นไม่สำเร็จ: {error}</div>}{!loading && !error && !dataset && <div className="customer-empty">ยังไม่มีโปรโมชั่น Published</div>}{dataset && <><div className="customer-notice"><div><b>{activeClass || 'ยังไม่มี Class'} · {cards.length} การ์ด</b><span>Frontend อ่านเฉพาะ version สถานะ Published</span></div><span>Revision {dataset.version.revision}</span></div><div className="customer-filter"><label style={{ position: 'relative' }}><Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: '#64748b' }} /><input style={{ paddingLeft: 36, width: '100%' }} value={query} onChange={event => setQuery(event.target.value)} placeholder="ค้นหาชื่อสินค้า เงื่อนไข SKU หรือ Card ID" /></label><button onClick={() => setQuery('')}>ล้าง</button></div><section className="promo-grid">{cards.map(card => {
      const sku = card.skuId ? skuMap.get(card.skuId) : null;
      const ready = card.status === 'ready' && Boolean(card.price.effectivePrice) && card.promotionTiers.length > 0;
      return <button className="promo-card" key={card.id} disabled={!ready} onClick={() => setSelected(card)}>{card.imageUrl ? <img src={card.imageUrl} alt={sku?.canonicalName || card.id} loading="lazy" /> : <div className="customer-empty">ไม่มีรูป</div>}<div className="promo-card-body"><h3>{sku?.canonicalName || card.id}</h3><div className="promo-pills"><span className={`promo-pill ${ready ? 'ready' : 'review'}`}>{ready ? 'พร้อมคำนวณ' : 'ยังไม่พร้อม'}</span><span className="promo-pill">{sku?.code || 'ไม่มี SKU'}</span></div><div className="promo-function">{card.promotionTiers.map(tierText).join(' · ') || 'ยังไม่มี Promotion tiers'}</div><div className="promo-price">ราคา/ชิ้น <b>{card.price.effectivePrice ? `฿${money(card.price.effectivePrice.amount)}` : '-'}</b></div></div></button>;
    })}</section>{!cards.length && <div className="customer-empty">ไม่พบการ์ดใน Class/คำค้นนี้</div>}<div className="published-note">Version {dataset.version.id} · Published {dataset.version.publishedAt || '-'}</div></>}{selected && selectedSku && <Detail card={selected} name={selectedSku.canonicalName} sku={selectedSku.code} onClose={() => setSelected(null)} />}</main>
  </div>;
}

createRoot(document.getElementById('promo-new-root')!).render(<React.StrictMode><CustomerApp /></React.StrictMode>);
