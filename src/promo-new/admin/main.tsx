import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Layers3, LogOut, Save, Search, ShieldCheck, UploadCloud } from 'lucide-react';
import type { PromoDataset, ProductGroup } from '../domain/types';
import { autoAssignPromotionFamilies } from '../domain/auto-match';
import { applyPromotionFamily, groupImportedCards } from '../domain/grouping';
import { applyPriceToGroup, setCentralPrice } from '../domain/pricing';
import { confirmSkuCandidate } from '../domain/sku-identity';
import { assertReadyForPublish } from '../domain/validation';
import { nextDraftVersion } from '../domain/versioning';
import type { ImportedCardCandidate, PdfImportProgress } from '../import/pdf-importer';
import { inspectPromotionWorkbookFile, PROMOTION_WORKBOOK_ACCEPT } from '../import/workbook-file';
import { createDemoDataset } from '../shared/demo-data';
import { fetchPromoMasterData, loadSession, login, logout, publishVersion, saveDraft, uploadCardImage, validateSession } from '../shared/api';
import './admin.css';

type Session = NonNullable<ReturnType<typeof loadSession>>;

const defaultMonth = () => {
  const date = new Date();
  return `PROMO-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const money = (value: number | null | undefined) => value == null ? '-' : `฿${value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function LoginPage({ onLogin, onDemo }: { onLogin: (session: Session) => void; onDemo: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setError('');
    try { onLogin(await login(email, password)); } catch (caught) { setError(String((caught as Error).message || caught)); } finally { setBusy(false); }
  };
  return <main className="login-page"><section className="login-card">
    <div className="eyebrow">PROMO SYSTEM REBUILD</div><h1>หลังบ้านโปรโมชั่นใหม่</h1>
    <p>ต้องเข้าสู่ระบบก่อนบันทึก SKU ราคา Draft หรือ Publish ข้อมูลทุกอย่างจะผ่าน Backend ที่ตรวจสิทธิ์</p>
    {error && <div className="notice error">เข้าสู่ระบบไม่สำเร็จ: {error}</div>}
    <form onSubmit={submit}>
      <label className="field">อีเมลผู้ดูแล<input type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required /></label>
      <label className="field">รหัสผ่าน<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} minLength={8} required /></label>
      <button className="btn primary" disabled={busy}>{busy ? 'กำลังตรวจสิทธิ์...' : 'เข้าสู่ระบบ'}</button>
    </form>
    <div className="divider">หรือ</div>
    <button className="btn soft" style={{ width: '100%' }} onClick={onDemo}>ดู Preview แบบสาธิต (อ่านอย่างเดียว)</button>
    <div className="audit-note"><ShieldCheck size={14} /> โหมดสาธิตไม่เชื่อมฐานข้อมูล ไม่บันทึก และไม่สามารถ Publish ได้</div>
  </section></main>;
}

function GroupEditor({ group, dataset, priceDraft, onPriceDraft, onConfirmSku, onApply }: {
  group: ProductGroup; dataset: PromoDataset; priceDraft: string; onPriceDraft: (value: string) => void;
  onConfirmSku: () => void; onApply: (familyId: string, price: number) => void;
}) {
  const [familyId, setFamilyId] = useState(group.promotionFamilyId || '');
  useEffect(() => setFamilyId(group.promotionFamilyId || ''), [group.promotionFamilyId]);
  const cards = dataset.cards.filter(card => group.cardIds.includes(card.id));
  const family = dataset.promotionFamilies.find(item => item.id === familyId);
  return <article className={`group-card ${group.status}`}>
    <div className="group-top">
      <div>
        <div className="thumbs">{cards.map(card => <div className="thumb" key={card.id}>{card.imageUrl ? <img src={card.imageUrl} alt={card.id} loading="lazy" /> : <div className="empty">ไม่มีรูป</div>}<span>{card.classId}</span></div>)}</div>
        <div className="product-name">{group.sku.canonicalName}</div>
        <div className="tags"><span className="tag">{group.sku.code}</span><span className={`tag ${group.status === 'ready' ? 'good' : group.status === 'blocked' ? 'bad' : 'warn'}`}>{group.status}</span><span className="tag">{group.cardIds.length} การ์ด</span>{group.promotionFamilyId && <span className="tag good">Family จับแล้ว</span>}{group.classIds.map(classId => <span className="tag" key={classId}>{classId}</span>)}</div>
        <div className="sku-meta"><span><b>แบรนด์:</b> {group.sku.identity.brand || '-'}</span><span><b>ชนิด:</b> {group.sku.identity.productType || '-'}</span><span><b>ขนาด:</b> {group.sku.identity.sizeValue || '-'} {group.sku.identity.sizeUnit}</span><span><b>หน่วย/Pack:</b> {group.sku.identity.salesUnit} × {group.sku.identity.packQuantity}</span><span><b>Variant:</b> {group.sku.identity.variant ? 'รอยืนยันจากภาพ' : '-'}</span><span><b>ราคาเดิม:</b> {money(group.price.effectivePrice?.amount)}</span></div>
        {group.sku.status === 'candidate' && <button className="btn soft" style={{ marginTop: 10 }} onClick={onConfirmSku}>ยืนยันเป็น SKU ใหม่</button>}
        {!!group.failureReasons.length && <div className="failure">{group.failureReasons.join(' · ')}</div>}
      </div>
      <div className="group-controls">
        <label className="field">Promotion Family<select value={familyId} onChange={event => setFamilyId(event.target.value)}><option value="">เลือกจาก CSV/XLSM</option>{dataset.promotionFamilies.map(item => <option key={item.id} value={item.id}>{item.name} · {Object.keys(item.tiersByClass).join(', ')}</option>)}</select></label>
        <div className="price-row"><label className="field">ราคากลางต่อชิ้น<input type="number" min="0.01" step="0.01" inputMode="decimal" value={priceDraft} onChange={event => onPriceDraft(event.target.value)} placeholder="0.00" /></label><label className="field">แหล่งราคา<input value={group.price.source === 'central_override' ? 'ราคากลางถาวร' : group.price.source === 'pdf' ? 'ราคา PDF' : 'ยังไม่มีราคา'} readOnly /></label></div>
        <div className="price-source">ผูกกับ SKU + ขนาด + หน่วย + Pack และใช้ทุก Class ในกลุ่ม</div>
        <div className="tier-preview">{family ? group.classIds.map(classId => <div className="tier-line" key={classId}><b>{classId}</b><span>{family.tiersByClass[classId]?.map(tier => tier.sourceText).join(' / ') || 'ไม่มี Class นี้ — จะ Block'}</span></div>) : <span>เลือก Promotion Family เพื่อดูเงื่อนไขแต่ละ Class</span>}</div>
        <div className="control-actions"><button className="btn success" disabled={!familyId || !(Number(priceDraft) > 0)} onClick={() => onApply(familyId, Number(priceDraft))}>ใช้โปรและราคากับทุก Class</button></div>
      </div>
    </div>
  </article>;
}

function AdminApp() {
  const params = new URLSearchParams(location.search);
  const demoFromUrl = params.get('demo') === '1';
  const dryRun = params.get('dryrun') === '1';
  const [session, setSession] = useState<Session | null>(loadSession());
  const [checking, setChecking] = useState(Boolean(session));
  const [demo, setDemo] = useState(demoFromUrl);
  const [monthKey, setMonthKey] = useState(defaultMonth());
  const [pdf, setPdf] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<File | null>(null);
  const [ocr, setOcr] = useState(true);
  const [dataset, setDataset] = useState<PromoDataset | null>(demoFromUrl ? createDemoDataset('draft') : null);
  const [quarantine, setQuarantine] = useState<ImportedCardCandidate[]>([]);
  const [progress, setProgress] = useState<PdfImportProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('เลือก PDF และ CSV/XLSM ของเดือนเดียวกัน');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [previewChecked, setPreviewChecked] = useState(false);
  const [savedVersionId, setSavedVersionId] = useState<string | null>(null);

  const selectWorkbook = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] || null;
    if (!selected) { setWorkbook(null); return; }
    const info = inspectPromotionWorkbookFile(selected);
    if (info.error) {
      setWorkbook(null);
      setError(info.error);
      event.target.value = '';
      return;
    }
    setWorkbook(selected);
    setError('');
    setMessage(`เลือก ${info.label}: ${selected.name} — พร้อมประมวลผลร่วมกับ PDF`);
  };

  useEffect(() => {
    if (!session) { setChecking(false); return; }
    validateSession(session).catch(() => setSession(null)).finally(() => setChecking(false));
  }, []);

  const processFiles = async () => {
    if (!pdf || !workbook) return;
    setBusy(true); setError(''); setDataset(null); setQuarantine([]); setPreviewChecked(false); setSavedVersionId(null);
    try {
      const [{ importPromotionPdf }, { parsePromotionWorkbook }] = await Promise.all([
        import('../import/pdf-importer'),
        import('../import/workbook-parser'),
      ]);
      let master = { skus: [], prices: [] } as Awaited<ReturnType<typeof fetchPromoMasterData>>;
      let masterWarning = '';
      if (session) {
        try { master = await fetchPromoMasterData(session); }
        catch (caught) { masterWarning = `master_data_unavailable:${String((caught as Error).message || caught)}`; }
      }
      const parsedWorkbook = await parsePromotionWorkbook(workbook);
      const imported = await importPromotionPdf(pdf, { monthKey, enableOcr: ocr, onProgress: setProgress });
      const grouped = groupImportedCards(monthKey, imported.cards, master.skus, master.prices);
      const version = nextDraftVersion(monthKey, [], session?.user.id || null);
      version.status = 'need_review';
      version.source = { pdfName: pdf.name, workbookName: workbook.name, pdfHash: null, workbookHash: null };
      const next: PromoDataset = {
        schema: 'promo-system-rebuild-v1', version, skus: grouped.skus, prices: grouped.prices, cards: grouped.cards,
        productGroups: grouped.groups, promotionFamilies: parsedWorkbook.families,
        warnings: [...imported.warnings, ...parsedWorkbook.warnings, ...grouped.warnings, ...(masterWarning ? [masterWarning] : [])],
      };
      const automated = autoAssignPromotionFamilies(next);
      const inheritedPrices = automated.dataset.productGroups.filter(group => group.price.source === 'central_override').length;
      setDataset(automated.dataset); setQuarantine(grouped.quarantineCards);
      setPriceDrafts(Object.fromEntries(automated.dataset.productGroups.map(group => [group.id, String(group.price.effectivePrice?.amount || '')])));
      setMessage(`ประมวลผล ${automated.dataset.cards.length} การ์ด · ${automated.dataset.productGroups.length} กลุ่ม · Auto Family ${automated.matched} · ราคาเดิม ${inheritedPrices} · ต้องตรวจ Family ${automated.ambiguous + automated.unmatched} · quarantine ${grouped.quarantineCards.length}`);
    } catch (caught) { setError(String((caught as Error).message || caught)); } finally { setBusy(false); }
  };

  const confirmSku = (groupId: string) => setDataset(current => {
    if (!current) return current;
    const target = current.productGroups.find(group => group.id === groupId);
    if (!target) return current;
    try {
      const sku = confirmSkuCandidate(target.sku);
      let nextGroup: ProductGroup = {
        ...target,
        sku,
        failureReasons: target.failureReasons.filter(reason => reason !== 'new_sku_requires_confirmation'),
        status: 'need_review',
      };
      let cards = current.cards;
      const family = current.promotionFamilies.find(item => item.id === nextGroup.promotionFamilyId);
      if (family) {
        const applied = applyPromotionFamily(nextGroup, cards, family);
        nextGroup = applied.group;
        cards = applied.cards;
      }
      const groups = current.productGroups.map(group => group.id === groupId ? nextGroup : group);
      const skus = current.skus.map(item => item.id === sku.id ? sku : item);
      setPreviewChecked(false); setSavedVersionId(null);
      return { ...current, skus, cards, productGroups: groups };
    } catch (caught) { setError(String((caught as Error).message || caught)); return current; }
  });

  const applyGroup = (groupId: string, familyId: string, amount: number) => setDataset(current => {
    if (!current) return current;
    const group = current.productGroups.find(item => item.id === groupId);
    const family = current.promotionFamilies.find(item => item.id === familyId);
    if (!group || !family) return current;
    try {
      const price = setCentralPrice(group.price, amount);
      const priced = applyPriceToGroup(group, current.cards, price);
      const promoted = applyPromotionFamily(priced.group, priced.cards, family);
      if (promoted.blockedClasses.length) setError(`Block: CSV ไม่มี Class ${promoted.blockedClasses.join(', ')} สำหรับ ${group.sku.canonicalName}`);
      else setError('');
      setPreviewChecked(false); setSavedVersionId(null);
      return {
        ...current,
        prices: [...current.prices.filter(item => item.skuId !== price.skuId), price],
        cards: promoted.cards,
        productGroups: current.productGroups.map(item => item.id === groupId ? promoted.group : item),
      };
    } catch (caught) { setError(String((caught as Error).message || caught)); return current; }
  });

  const visibleGroups = useMemo(() => (dataset?.productGroups || []).filter(group => {
    if (filter !== 'all' && group.status !== filter) return false;
    const haystack = [group.sku.canonicalName, group.sku.code, group.sku.identity.brand, group.sku.identity.productType, ...group.classIds].join(' ').toLowerCase();
    return !search || haystack.includes(search.toLowerCase());
  }), [dataset, search, filter]);

  const save = async () => {
    if (!dataset || !session || demo) return;
    setBusy(true); setError('');
    try {
      const draftVersionId = dataset.version.status === 'draft' ? crypto.randomUUID() : dataset.version.id;
      const cards = [];
      for (let index = 0; index < dataset.cards.length; index += 1) {
        const card = dataset.cards[index];
        setMessage(`กำลังอัปโหลดรูป ${index + 1}/${dataset.cards.length}`);
        const imageUrl = card.imageUrl?.startsWith('data:')
          ? await uploadCardImage(draftVersionId, card.id, card.imageUrl, session)
          : card.imageUrl;
        cards.push({ ...card, imageUrl });
      }
      const prepared = { ...dataset, cards, version: { ...dataset.version, id: draftVersionId } };
      const result = await saveDraft(prepared, session);
      const versionId = String(result.data.version_id || draftVersionId);
      setDataset({ ...prepared, version: { ...prepared.version, id: versionId, revision: result.data.revision, status: 'draft' } });
      setSavedVersionId(versionId);
      setPreviewChecked(false);
      setMessage(`บันทึก Draft แล้ว revision ${result.data.revision} — รันตรวจความพร้อมก่อน Publish`);
    } catch (caught) { setError(String((caught as Error).message || caught)); } finally { setBusy(false); }
  };

  const validatePreview = () => {
    if (!dataset) return;
    const result = assertReadyForPublish(dataset);
    const errors = [...result.errors, ...(quarantine.length ? [`quarantine_cards:${quarantine.length}`] : [])];
    if (errors.length) {
      setPreviewChecked(false);
      setError(`ตรวจความพร้อมไม่ผ่าน (${errors.length} จุด): ${errors.slice(0, 10).join(' · ')}`);
      setMessage(`ยัง Publish ไม่ได้: ready ${dataset.productGroups.filter(group => group.status === 'ready').length}/${dataset.productGroups.length} กลุ่ม`);
      return;
    }
    setError('');
    setPreviewChecked(true);
    setMessage(`ตรวจความพร้อมผ่านจริง: ${dataset.cards.length} การ์ด · ${dataset.productGroups.length} กลุ่ม · ไม่มี Quarantine`);
  };

  const publish = async () => {
    if (!dataset || !session || demo || !savedVersionId || !previewChecked) return;
    setBusy(true); setError('');
    try {
      await publishVersion(savedVersionId, session);
      setDataset({ ...dataset, version: { ...dataset.version, status: 'published', publishedAt: new Date().toISOString() } });
      setMessage(`Published revision ${dataset.version.revision} แล้ว`);
    } catch (caught) { setError(String((caught as Error).message || caught)); } finally { setBusy(false); }
  };

  if (checking) return <main className="login-page"><section className="login-card">กำลังตรวจ session...</section></main>;
  if (!session && !demo && !dryRun) return <LoginPage onLogin={value => setSession(value)} onDemo={() => { setDemo(true); setDataset(createDemoDataset('draft')); }} />;
  const ready = dataset?.productGroups.filter(group => group.status === 'ready').length || 0;
  const blocked = dataset?.productGroups.filter(group => group.status === 'blocked').length || 0;
  const publishable = Boolean(dataset && savedVersionId && previewChecked && !busy && !demo && ready === dataset.productGroups.length && blocked === 0 && quarantine.length === 0 && dataset.version.status !== 'published');
  return <div className="admin-shell">
    <header className="admin-hero"><div className="hero-inner"><div className="hero-row"><div><div className="eyebrow">PROMO SYSTEM REBUILD · {demo ? 'DEMO READ-ONLY' : dryRun ? 'FILE DRY-RUN' : 'AUTHENTICATED ADMIN'}</div><h1>จัดโปรโมชั่นเป็นกลุ่ม ไม่ไล่ติ๊กทีละการ์ด</h1><p>นำเข้า PDF + CSV/XLSM แล้วจัด SKU, Product Group, โปรราย Class และราคากลางในหน้าจอเดียว</p></div><div className="hero-actions"><a className="btn ghost" href="/promo-new.html?demo=1">ดูหน้าลูกค้า</a>{session && <button className="btn ghost" onClick={() => logout(session).finally(() => setSession(null))}><LogOut size={16} /> ออกจากระบบ</button>}</div></div></div></header>
    <main className="admin-main">
      {demo && <div className="notice warn">นี่คือข้อมูลสาธิตสำหรับตรวจ UI เท่านั้น ปุ่มบันทึก/Publish ถูกปิด และไม่มีการเชื่อม Production</div>}
      {dryRun && <div className="notice warn">โหมดทดสอบไฟล์จริง: ประมวลผลในหน่วยความจำเท่านั้น ปุ่มบันทึก/Publish ถูกปิด และไม่เขียน Production</div>}
      {error && <div className="notice error"><AlertTriangle size={15} /> {error}</div>}
      <section className="panel"><div className="step-grid">
        <label className="field">เดือนโปรโมชั่น<input value={monthKey} onChange={event => setMonthKey(event.target.value.toUpperCase())} placeholder="เช่น PROMO-2026-08" /></label>
        <label className="field file-drop"><span><UploadCloud size={16} /> เลือก PDF โปรโมชั่น</span><input type="file" accept="application/pdf,.pdf" onChange={event => setPdf(event.target.files?.[0] || null)} /><small>{pdf?.name || 'ยังไม่ได้เลือก'}</small></label>
        <label className="field file-drop"><span><FileSpreadsheet size={16} /> เลือก CSV/XLSX/XLSM</span><input type="file" accept={PROMOTION_WORKBOOK_ACCEPT} onChange={selectWorkbook} /><small>{workbook ? `${workbook.name} · ${inspectPromotionWorkbookFile(workbook).label}` : 'รองรับ .csv, .xlsx, .xlsm และ .xls'}</small></label>
      </div><div className="run-row"><label className="field" style={{ flexDirection: 'row', alignItems: 'center' }}><input style={{ width: 18, height: 18 }} type="checkbox" checked={ocr} onChange={event => setOcr(event.target.checked)} /> OCR เฉพาะเมื่อ PDF ไม่มี text layer</label><button className="btn primary" disabled={busy || !pdf || !workbook || demo} onClick={processFiles}>{busy ? 'กำลังประมวลผล...' : 'ประมวลผลครั้งเดียว'}</button></div>
        <div className="progress"><i style={{ width: progress ? `${Math.max(3, progress.page / Math.max(1, progress.pageCount) * 100)}%` : '0%' }} /></div><div className="progress-meta"><span>{progress?.message || message}</span><span>{progress ? `${progress.cards} การ์ด · ${(progress.elapsedMs / 1000).toFixed(1)} วินาที` : ''}</span></div>
      </section>
      <section className="panel"><div className="summary"><div className="stat"><span>SKU</span><b>{dataset?.skus.length || 0}</b></div><div className="stat"><span>Product Group</span><b>{dataset?.productGroups.length || 0}</b></div><div className="stat"><span>การ์ด</span><b>{dataset?.cards.length || 0}</b></div><div className="stat"><span>พร้อมใช้</span><b>{ready}</b></div><div className="stat"><span>Block/Quarantine</span><b>{blocked + quarantine.length}</b></div></div></section>
      <section className="panel"><div className="section-head"><div><h2><Layers3 size={19} /> Product Group</h2><small>หนึ่งเดือน + หนึ่ง SKU; ระบบจับ Family และราคาเดิมให้อัตโนมัติเมื่อหลักฐานครบ</small></div><span className="tag">{visibleGroups.length} กลุ่ม</span></div><div className="search-row"><label style={{ position: 'relative' }}><Search size={17} style={{ position: 'absolute', left: 12, top: 14, color: '#64748b' }} /><input style={{ paddingLeft: 38 }} value={search} onChange={event => setSearch(event.target.value)} placeholder="ค้นหาชื่อสินค้า แบรนด์ SKU หรือ Class" /></label><select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">ทุกสถานะ</option><option value="ready">พร้อมใช้</option><option value="need_review">ต้องตรวจ</option><option value="blocked">Block</option></select></div>
        <div className="group-list">{dataset ? visibleGroups.map(group => <GroupEditor key={group.id} group={group} dataset={dataset} priceDraft={priceDrafts[group.id] ?? String(group.price.effectivePrice?.amount || '')} onPriceDraft={value => setPriceDrafts(current => ({ ...current, [group.id]: value }))} onConfirmSku={() => confirmSku(group.id)} onApply={(familyId, amount) => applyGroup(group.id, familyId, amount)} />) : <div className="empty">เลือกไฟล์แล้วกดประมวลผล ระบบจะแสดง Product Group ที่นี่</div>}</div>
      </section>
      {!!quarantine.length && <section className="panel"><div className="section-head"><div><h2>รายการที่ต้องแก้กลุ่มเฉพาะจุด</h2><small>ระบบไม่สร้าง SKU ให้เมื่อหลักฐานชื่อ/ชนิด/ขนาด/หน่วยไม่ครบ</small></div><span className="tag bad">{quarantine.length}</span></div><div className="quarantine">{quarantine.map(card => <article className="quarantine-card" key={card.cardId}><img src={card.imageUrl} alt={card.cardId} /><b>{card.productText || 'อ่านชื่อสินค้าไม่ได้'}</b><div className="failure">{card.failureReasons.join(' · ')}</div></article>)}</div></section>}
      <div className="footer-actions"><button className="btn soft" disabled={!dataset || !savedVersionId || busy} onClick={validatePreview}><CheckCircle2 size={16} /> {previewChecked ? 'ตรวจความพร้อมผ่าน' : 'ตรวจความพร้อมจริง'}</button><button className="btn primary" disabled={!dataset || !session || demo || busy || Boolean(savedVersionId) || dataset.version.status === 'published'} onClick={save}><Save size={16} /> {savedVersionId ? 'Draft บันทึกแล้ว' : 'บันทึก Draft'}</button><button className="btn dark" disabled={!publishable} onClick={publish}>Publish เวอร์ชันนี้</button></div>
    </main>
  </div>;
}

createRoot(document.getElementById('promo-admin-new-root')!).render(<React.StrictMode><AdminApp /></React.StrictMode>);
