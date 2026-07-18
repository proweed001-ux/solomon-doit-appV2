import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, CheckCircle2, Database, FileSpreadsheet, Layers3, LogOut, Save, Search, ShieldCheck, Trash2, UploadCloud } from 'lucide-react';
import type { PromoDataset, ProductGroup } from '../domain/types';
import { autoAssignPromotionFamilies } from '../domain/auto-match';
import { applyPromotionFamily } from '../domain/grouping';
import { applyPriceToGroup, setCentralPrice } from '../domain/pricing';
import { confirmSkuCandidate } from '../domain/sku-identity';
import { assertReadyForPublish } from '../domain/validation';
import { buildCardVisualSignatures } from '../domain/visual-consensus';
import { nextDraftVersion } from '../domain/versioning';
import { enrichCardHeadersFromImages } from '../import/card-header-ocr';
import type { ImportedCardCandidate, PdfImportProgress, PdfImportResult } from '../import/pdf-importer';
import type { WorkbookParseResult } from '../import/workbook-parser';
import { inspectPromotionWorkbookFile, PROMOTION_WORKBOOK_ACCEPT } from '../import/workbook-file';
import { createDemoDataset } from '../shared/demo-data';
import { fetchPromoMasterData, loadSession, login, logout, publishVersion, saveDraft, uploadCardImage, validateSession } from '../shared/api';
import { prepareCachedRun, visualSignaturesComplete } from './cached-run';
import { runGroupingInWorker } from './grouping-client';
import {
  clearPromoTestCache,
  formatCacheSize,
  loadPromoTestCache,
  readPromoTestCacheSummary,
  savePromoTestCache,
  type PromoTestCacheSummary,
} from './test-cache';
import './admin.css';

type Session = NonNullable<ReturnType<typeof loadSession>>;

const BUILD_ID = 'CLEAN-CACHE-20260718-0725';

const defaultMonth = () => {
  const date = new Date();
  return `PROMO-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const money = (value: number | null | undefined) => value == null ? '-' : `฿${value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const cacheDate = (value: string) => new Date(value).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
const errorText = (caught: unknown) => String((caught as Error)?.message || caught || 'unknown_error');

function LoginPage({ onLogin, onDemo }: { onLogin: (session: Session) => void; onDemo: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      onLogin(await login(email, password));
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setBusy(false);
    }
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
  group: ProductGroup;
  dataset: PromoDataset;
  priceDraft: string;
  onPriceDraft: (value: string) => void;
  onConfirmSku: () => void;
  onApply: (familyId: string, price: number) => void;
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
        <div className="sku-meta"><span><b>แบรนด์:</b> {group.sku.identity.brand || '-'}</span><span><b>ชนิด:</b> {group.sku.identity.productType || '-'}</span><span><b>ขนาด:</b> {group.sku.identity.sizeValue || '-'} {group.sku.identity.sizeUnit}</span><span><b>หน่วย/Pack:</b> {group.sku.identity.salesUnit} × {group.sku.identity.packQuantity}</span><span><b>Variant:</b> {group.sku.identity.variant || '-'}</span><span><b>ราคาเดิม:</b> {money(group.price.effectivePrice?.amount)}</span></div>
        {group.sku.status === 'candidate' && <button className="btn soft" style={{ marginTop: 10 }} onClick={onConfirmSku}>ยืนยันเป็น SKU ใหม่</button>}
        {group.sku.status === 'quarantine' && <div className="failure">กลุ่มนี้สร้างจากขอบเขตโปร แต่ยังต้องผูก Product Master ที่แน่นอนก่อนใช้ราคา</div>}
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
  const [cacheSummary, setCacheSummary] = useState<PromoTestCacheSummary | null>(() => readPromoTestCacheSummary());
  const [dataset, setDataset] = useState<PromoDataset | null>(demoFromUrl ? createDemoDataset('draft') : null);
  const [quarantine, setQuarantine] = useState<ImportedCardCandidate[]>([]);
  const [progress, setProgress] = useState<PdfImportProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('เลือก PDF และ CSV/XLSM ของเดือนเดียวกัน หรือกดตรวจแคชในเครื่อง');
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

  const groupArtifacts = async (
    imported: PdfImportResult,
    parsedWorkbook: WorkbookParseResult,
    visualSignatures: Record<string, string>,
    sourcePdfName: string,
    sourceWorkbookName: string,
    extraWarnings: string[] = [],
    sourceLabel = 'ไฟล์ใหม่',
    artifactMonthKey = monthKey,
  ) => {
    let master = { skus: [], prices: [] } as Awaited<ReturnType<typeof fetchPromoMasterData>>;
    let masterWarning = '';
    if (session) {
      try { master = await fetchPromoMasterData(session); }
      catch (caught) { masterWarning = `master_data_unavailable:${errorText(caught)}`; }
    }

    const groupingStarted = performance.now();
    setProgress({ phase: 'cards', page: 0.4, pageCount: 1, cards: imported.cards.length, elapsedMs: 0, message: 'กำลังเปิด Inline Worker จัดกลุ่ม' });
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    const grouped = await runGroupingInWorker({
      monthKey: artifactMonthKey,
      cards: imported.cards,
      existingSkus: master.skus,
      storedPrices: master.prices,
      promotionFamilies: parsedWorkbook.families,
      visualSignatures,
      onProgress: workerMessage => setProgress({ phase: 'cards', page: 0.7, pageCount: 1, cards: imported.cards.length, elapsedMs: performance.now() - groupingStarted, message: workerMessage }),
    });

    setProgress({ phase: 'cards', page: 0.92, pageCount: 1, cards: imported.cards.length, elapsedMs: performance.now() - groupingStarted, message: 'กำลังสร้างผลลัพธ์และ Promotion Family' });
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

    const version = nextDraftVersion(artifactMonthKey, [], session?.user.id || null);
    version.status = 'need_review';
    version.source = { pdfName: sourcePdfName, workbookName: sourceWorkbookName, pdfHash: null, workbookHash: null };
    const next: PromoDataset = {
      schema: 'promo-system-rebuild-v1',
      version,
      skus: grouped.skus,
      prices: grouped.prices,
      cards: grouped.cards,
      productGroups: grouped.groups,
      promotionFamilies: parsedWorkbook.families,
      warnings: [...imported.warnings, ...parsedWorkbook.warnings, ...grouped.warnings, ...extraWarnings, ...(masterWarning ? [masterWarning] : [])],
    };
    const automated = autoAssignPromotionFamilies(next);
    const inheritedPrices = automated.dataset.productGroups.filter(group => group.price.source === 'central_override').length;
    setDataset(automated.dataset);
    setQuarantine(grouped.quarantineCards);
    setPriceDrafts(Object.fromEntries(automated.dataset.productGroups.map(group => [group.id, String(group.price.effectivePrice?.amount || '')])));
    setProgress(null);
    setMessage(`${sourceLabel}: ${automated.dataset.cards.length}/${imported.cards.length} การ์ด · ${automated.dataset.productGroups.length} กลุ่ม · Scope ${grouped.diagnostics.structuredScope} · Class Matrix ${grouped.warnings.find(item => item.startsWith('grouping:class_matrix:'))?.split(':').pop() || 0} · unresolved ${grouped.diagnostics.unresolved} · ราคาเดิม ${inheritedPrices}`);
  };

  const processFiles = async () => {
    if (!pdf || !workbook) return;
    setBusy(true);
    setError('');
    setPreviewChecked(false);
    setSavedVersionId(null);
    try {
      const [{ importPromotionPdf }, { parsePromotionWorkbook }] = await Promise.all([
        import('../import/pdf-importer'),
        import('../import/workbook-parser'),
      ]);
      const parsedWorkbook = await parsePromotionWorkbook(workbook);
      let imported = await importPromotionPdf(pdf, { monthKey, enableOcr: ocr, onProgress: setProgress });
      if (ocr) {
        const headerStarted = performance.now();
        const enriched = await enrichCardHeadersFromImages(imported.cards, (completed, total) => {
          setProgress({ phase: 'cards', page: Math.max(0.05, completed / Math.max(1, total) * 0.25), pageCount: 1, cards: imported.cards.length, elapsedMs: performance.now() - headerStarted, message: `อ่านหัวสินค้า ${completed}/${total}` });
        });
        imported = { ...imported, cards: enriched.cards, warnings: [...new Set([...imported.warnings, ...enriched.warnings])] };
      }
      const visualSignatures = await buildCardVisualSignatures(imported.cards, (completed, total) => {
        setProgress({ phase: 'cards', page: 0.25 + completed / Math.max(1, total) * 0.15, pageCount: 1, cards: imported.cards.length, elapsedMs: 0, message: `สร้างหลักฐานภาพ ${completed}/${total}` });
      });
      const cacheWarnings: string[] = [];
      try {
        const summary = await savePromoTestCache({ monthKey, ocrEnabled: ocr, pdf, workbook, imported, parsedWorkbook, visualSignatures });
        setCacheSummary(summary);
        if (summary.mode === 'source_only') cacheWarnings.push('browser_cache_source_only_storage_quota');
      } catch (caught) {
        cacheWarnings.push(`browser_cache_save_failed:${errorText(caught)}`);
      }
      await groupArtifacts(imported, parsedWorkbook, visualSignatures, pdf.name, workbook.name, cacheWarnings, 'OCR ใหม่และบันทึกแคชแล้ว', monthKey);
    } catch (caught) {
      setProgress(null);
      setError(errorText(caught));
    } finally {
      setBusy(false);
    }
  };

  const useCachedRun = async () => {
    const started = performance.now();
    setBusy(true);
    setError('');
    setPreviewChecked(false);
    setSavedVersionId(null);
    setProgress({ phase: 'loading', page: 0.05, pageCount: 1, cards: cacheSummary?.cardCount || 0, elapsedMs: 0, message: 'รับคำสั่งแล้ว · กำลังอ่าน IndexedDB หนึ่งครั้ง' });
    try {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      const cached = await loadPromoTestCache();
      if (!cached) throw new Error('cache_not_found_on_this_browser');
      setCacheSummary(cached.summary);
      setMonthKey(cached.monthKey);
      setOcr(cached.ocrEnabled);
      setPdf(cached.pdf);
      setWorkbook(cached.workbook);
      if (!cached.imported || !cached.parsedWorkbook || !cached.visualSignatures) {
        throw new Error('cache_source_only_reprocess_required');
      }
      if (!visualSignaturesComplete(cached.imported, cached.visualSignatures)) {
        throw new Error('cache_visual_signatures_incomplete_reprocess_required');
      }

      const prepared = prepareCachedRun(cached.imported, cached.visualSignatures);
      setProgress({ phase: 'cards', page: 0.3, pageCount: 1, cards: prepared.imported.cards.length, elapsedMs: performance.now() - started, message: `โหลดแคชแล้ว · แก้ Class ${prepared.changedClasses} การ์ดใน ${prepared.recoveredPages} หน้า` });
      await groupArtifacts(
        prepared.imported,
        cached.parsedWorkbook,
        prepared.visualSignatures,
        cached.pdf.name,
        cached.workbook.name,
        ['grouping_rerun_from_browser_cache', ...cached.warnings, ...prepared.warnings],
        `จัดกลุ่มใหม่จากแคช · แก้ Class ${prepared.changedClasses} การ์ด`,
        cached.monthKey,
      );
    } catch (caught) {
      setProgress(null);
      const code = errorText(caught);
      if (code === 'cache_not_found_on_this_browser') setError('ไม่พบแคชในเบราว์เซอร์นี้ ต้องกด OCR ใหม่หนึ่งครั้ง');
      else if (code === 'cache_source_only_reprocess_required') setError('แคชเก็บเฉพาะไฟล์ต้นฉบับ ไม่มีผล OCR สำหรับจัดกลุ่ม ต้องกด OCR ใหม่');
      else if (code === 'cache_visual_signatures_incomplete_reprocess_required') setError('แคชเก่าไม่มีลายนิ้วมือภาพครบ ระบบไม่สร้างงานหนักซ่อนอยู่ กรุณากด OCR ใหม่หนึ่งครั้ง');
      else setError(code);
    } finally {
      setBusy(false);
    }
  };

  const clearCachedRun = async () => {
    setBusy(true);
    setError('');
    try {
      await clearPromoTestCache();
      setCacheSummary(null);
      setPdf(null);
      setWorkbook(null);
      setDataset(null);
      setQuarantine([]);
      setProgress(null);
      setPreviewChecked(false);
      setSavedVersionId(null);
      setPriceDrafts({});
      setMessage('ล้างไฟล์และผลประมวลผลที่บันทึกในเบราว์เซอร์แล้ว');
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setBusy(false);
    }
  };

  const confirmSku = (groupId: string) => setDataset(current => {
    if (!current) return current;
    const target = current.productGroups.find(group => group.id === groupId);
    if (!target) return current;
    try {
      const sku = confirmSkuCandidate(target.sku);
      let nextGroup: ProductGroup = { ...target, sku, failureReasons: target.failureReasons.filter(reason => reason !== 'new_sku_requires_confirmation'), status: 'need_review' };
      let cards = current.cards;
      const family = current.promotionFamilies.find(item => item.id === nextGroup.promotionFamilyId);
      if (family) {
        const applied = applyPromotionFamily(nextGroup, cards, family);
        nextGroup = applied.group;
        cards = applied.cards;
      }
      const groups = current.productGroups.map(group => group.id === groupId ? nextGroup : group);
      const skus = current.skus.map(item => item.id === sku.id ? sku : item);
      setPreviewChecked(false);
      setSavedVersionId(null);
      return { ...current, skus, cards, productGroups: groups };
    } catch (caught) {
      setError(errorText(caught));
      return current;
    }
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
      setPreviewChecked(false);
      setSavedVersionId(null);
      return {
        ...current,
        prices: [...current.prices.filter(item => item.skuId !== price.skuId), price],
        cards: promoted.cards,
        productGroups: current.productGroups.map(item => item.id === groupId ? promoted.group : item),
      };
    } catch (caught) {
      setError(errorText(caught));
      return current;
    }
  });

  const visibleGroups = useMemo(() => (dataset?.productGroups || []).filter(group => {
    if (filter !== 'all' && group.status !== filter) return false;
    const haystack = [group.sku.canonicalName, group.sku.code, group.sku.identity.brand, group.sku.identity.productType, ...group.classIds].join(' ').toLowerCase();
    return !search || haystack.includes(search.toLowerCase());
  }), [dataset, search, filter]);

  const save = async () => {
    if (!dataset || !session || demo) return;
    setBusy(true);
    setError('');
    try {
      const draftVersionId = dataset.version.status === 'draft' ? crypto.randomUUID() : dataset.version.id;
      const cards = [];
      for (let index = 0; index < dataset.cards.length; index += 1) {
        const card = dataset.cards[index];
        setMessage(`กำลังอัปโหลดรูป ${index + 1}/${dataset.cards.length}`);
        const imageUrl = card.imageUrl?.startsWith('data:') ? await uploadCardImage(draftVersionId, card.id, card.imageUrl, session) : card.imageUrl;
        cards.push({ ...card, imageUrl });
      }
      const prepared = { ...dataset, cards, version: { ...dataset.version, id: draftVersionId } };
      const result = await saveDraft(prepared, session);
      const versionId = String(result.data.version_id || draftVersionId);
      setDataset({ ...prepared, version: { ...prepared.version, id: versionId, revision: result.data.revision, status: 'draft' } });
      setSavedVersionId(versionId);
      setPreviewChecked(false);
      setMessage(`บันทึก Draft แล้ว revision ${result.data.revision} — รันตรวจความพร้อมก่อน Publish`);
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setBusy(false);
    }
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
    setBusy(true);
    setError('');
    try {
      await publishVersion(savedVersionId, session);
      setDataset({ ...dataset, version: { ...dataset.version, status: 'published', publishedAt: new Date().toISOString() } });
      setMessage(`Published revision ${dataset.version.revision} แล้ว`);
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setBusy(false);
    }
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
      {dryRun && <div className="notice warn">โหมดทดสอบไฟล์จริง · Build {BUILD_ID} · React คุมปุ่มและสถานะเพียงระบบเดียว · ไม่เขียน Production</div>}
      {error && <div className="notice error"><AlertTriangle size={15} /> {error}</div>}
      <section className="panel">
        <div className="step-grid">
          <label className="field">เดือนโปรโมชั่น<input value={monthKey} onChange={event => setMonthKey(event.target.value.toUpperCase())} placeholder="เช่น PROMO-2026-08" /></label>
          <label className="field file-drop"><span><UploadCloud size={16} /> เลือก PDF โปรโมชั่น</span><input type="file" accept="application/pdf,.pdf" onChange={event => setPdf(event.target.files?.[0] || null)} /><small>{pdf?.name || 'ยังไม่ได้เลือก'}</small></label>
          <label className="field file-drop"><span><FileSpreadsheet size={16} /> เลือก CSV/XLSX/XLSM</span><input type="file" accept={PROMOTION_WORKBOOK_ACCEPT} onChange={selectWorkbook} /><small>{workbook ? `${workbook.name} · ${inspectPromotionWorkbookFile(workbook).label}` : 'รองรับ .csv, .xlsx, .xlsm และ .xls'}</small></label>
        </div>
        <div className="run-row">
          <label className="field" style={{ flexDirection: 'row', alignItems: 'center' }}><input style={{ width: 18, height: 18 }} type="checkbox" checked={ocr} onChange={event => setOcr(event.target.checked)} /> เปิด OCR อ่านข้อความจาก PDF — หลักฐานภาพทำงานอัตโนมัติ</label>
          <button className="btn primary" disabled={busy || !pdf || !workbook || demo} onClick={processFiles}>{busy ? 'กำลังประมวลผล...' : 'OCR ใหม่และบันทึกแคช'}</button>
        </div>
        <div style={{ marginTop: 12, padding: 12, border: '1px solid #dbe4ef', borderRadius: 12, background: '#f8fafc' }}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <b style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Database size={16} /> ไฟล์ทดสอบล่าสุดในเครื่องนี้</b>
              <small>{cacheSummary ? `${cacheSummary.monthKey} · ${cacheSummary.pdfName} · ${cacheSummary.workbookName} · ${cacheSummary.cardCount || '-'} การ์ด · ${formatCacheSize(cacheSummary.estimatedBytes)} · ${cacheSummary.mode === 'full' ? 'พร้อมตรวจแคช' : 'เก็บเฉพาะไฟล์ ต้อง OCR ใหม่'} · ${cacheDate(cacheSummary.savedAt)}` : 'ยังไม่มี summary หรือ localStorage ถูกล้าง — ปุ่มตรวจแคชจะตรวจ IndexedDB จริง'}</small>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn soft" disabled={busy || demo} onClick={useCachedRun}><Database size={15} /> {busy ? 'กำลังทำงาน...' : 'ตรวจและจัดกลุ่มจากแคช'}</button>
              <button className="btn soft" disabled={busy || demo} onClick={clearCachedRun}><Trash2 size={15} /> ล้างแคช</button>
            </div>
          </div>
          <small>การกดจากแคชจะไม่ OCR ไม่สร้างลายนิ้วมือใหม่ และไม่อ่าน IndexedDB ซ้ำ</small>
        </div>
        <div className="progress"><i style={{ width: progress ? `${Math.max(3, progress.page / Math.max(1, progress.pageCount) * 100)}%` : '0%' }} /></div><div className="progress-meta"><span>{progress?.message || message}</span><span>{progress ? `${progress.cards} การ์ด · ${(progress.elapsedMs / 1000).toFixed(1)} วินาที` : ''}</span></div>
      </section>
      <section className="panel"><div className="summary"><div className="stat"><span>SKU</span><b>{dataset?.skus.length || 0}</b></div><div className="stat"><span>Product Group</span><b>{dataset?.productGroups.length || 0}</b></div><div className="stat"><span>การ์ด</span><b>{dataset?.cards.length || 0}</b></div><div className="stat"><span>พร้อมใช้</span><b>{ready}</b></div><div className="stat"><span>Block/Quarantine</span><b>{blocked + quarantine.length}</b></div></div></section>
      <section className="panel"><div className="section-head"><div><h2><Layers3 size={19} /> Product Group</h2><small>ขอบเขตสินค้าจาก CSV เป็นหลัก; OCR และภาพใช้ยืนยันข้าม Class โดยไม่เดาเมื่อคะแนนสูสี</small></div><span className="tag">{visibleGroups.length} กลุ่ม</span></div><div className="search-row"><label style={{ position: 'relative' }}><Search size={17} style={{ position: 'absolute', left: 12, top: 14, color: '#64748b' }} /><input style={{ paddingLeft: 38 }} value={search} onChange={event => setSearch(event.target.value)} placeholder="ค้นหาชื่อสินค้า แบรนด์ SKU หรือ Class" /></label><select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">ทุกสถานะ</option><option value="ready">พร้อมใช้</option><option value="need_review">ต้องตรวจ</option><option value="blocked">Block</option></select></div>
        <div className="group-list">{dataset ? visibleGroups.map(group => <GroupEditor key={group.id} group={group} dataset={dataset} priceDraft={priceDrafts[group.id] ?? String(group.price.effectivePrice?.amount || '')} onPriceDraft={value => setPriceDrafts(current => ({ ...current, [group.id]: value }))} onConfirmSku={() => confirmSku(group.id)} onApply={(familyId, amount) => applyGroup(group.id, familyId, amount)} />) : <div className="empty">เลือกไฟล์แล้วกดประมวลผล หรือกดตรวจและจัดกลุ่มจากแคช</div>}</div>
      </section>
      {!!quarantine.length && <section className="panel"><div className="section-head"><div><h2>รายการที่ต้องแก้กลุ่มเฉพาะจุด</h2><small>ไม่มี Product Scope ที่ชนะชัด หรือภาพคล้ายหลายกลุ่ม ระบบจึงไม่เดา</small></div><span className="tag bad">{quarantine.length}</span></div><div className="quarantine">{quarantine.map(card => <article className="quarantine-card" key={card.cardId}><img src={card.imageUrl} alt={card.cardId} /><b>{card.productText || 'อ่านชื่อสินค้าไม่ได้'}</b><div className="failure">{card.failureReasons.join(' · ')}</div></article>)}</div></section>}
      <div className="footer-actions"><button className="btn soft" disabled={!dataset || !savedVersionId || busy} onClick={validatePreview}><CheckCircle2 size={16} /> {previewChecked ? 'ตรวจความพร้อมผ่าน' : 'ตรวจความพร้อมจริง'}</button><button className="btn primary" disabled={!dataset || !session || demo || busy || Boolean(savedVersionId) || dataset.version.status === 'published'} onClick={save}><Save size={16} /> {savedVersionId ? 'Draft บันทึกแล้ว' : 'บันทึก Draft'}</button><button className="btn dark" disabled={!publishable} onClick={publish}>Publish เวอร์ชันนี้</button></div>
    </main>
  </div>;
}

createRoot(document.getElementById('promo-admin-new-root')!).render(<React.StrictMode><AdminApp /></React.StrictMode>);
