import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, CheckCircle2, Database, FileSpreadsheet, Layers3, LogOut, Save, Search, ShieldCheck, Trash2, UploadCloud } from 'lucide-react';
import type { PromoDataset, ProductGroup } from '../domain/types';
import { applyPromotionFamilyToCard } from '../domain/grouping';
import { applyPriceToGroup, setCentralPrice } from '../domain/pricing';
import { confirmSkuCandidate } from '../domain/sku-identity';
import { assertReadyForPublishMultiCard as assertReadyForPublish } from './validation-multi-card';
import { nextDraftVersion } from '../domain/versioning';
import type { ImportedCardCandidate, PdfImportProgress, PdfImportResult } from '../import/pdf-importer';
import type { WorkbookParseResult } from '../import/workbook-parser';
import { inspectPromotionWorkbookFile, PROMOTION_WORKBOOK_ACCEPT } from '../import/workbook-file';
import { createDemoDataset } from '../shared/demo-data';
import { fetchPromoMasterData, loadSession, login, logout, publishVersion, saveDraft, saveSession, uploadCardImage, validateSession } from '../shared/api';
import {
  clearPromoTestCache,
  formatCacheSize,
  loadPromoTestCache,
  readPromoTestCacheSummary,
  savePromoTestCache,
  type PromoTestCacheSummary,
} from './test-cache';
import { ManualGroupingWorkbench } from './manual-workbench';
import { GroupingSnapshotSave } from './grouping-snapshot-save';
import { loadPromoSourceDataset } from '../shared/master-api';
import './admin.css';

type Session = NonNullable<ReturnType<typeof loadSession>>;
type MasterData = Awaited<ReturnType<typeof fetchPromoMasterData>>;

const BUILD_ID = __PROMO_BUILD_ID__;
const PROMO_CLASSES = new Set(['HFSS', 'HFSM', 'HFSL', 'HFSXL', 'HFSWS-S', 'HFSWS-L']);

const defaultMonth = () => {
  const date = new Date();
  return `PROMO-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const money = (value: number | null | undefined) => value == null ? '-' : `฿${value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const cacheDate = (value: string) => new Date(value).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
const errorText = (caught: unknown) => String((caught as Error)?.message || caught || 'unknown_error');

function assertWorkbookReady(parsed: WorkbookParseResult): void {
  if (!parsed.families.length) throw new Error('promotion_family_not_found_in_workbook');
  const classIds = parsed.families.flatMap(family => Object.keys(family.tiersByClass));
  const unsupported = [...new Set(classIds.filter(classId => !PROMO_CLASSES.has(classId)))];
  if (unsupported.length) throw new Error(`promotion_workbook_unsupported_class:${unsupported.join(',')}`);
  const tierCount = parsed.families.reduce((total, family) => total + Object.values(family.tiersByClass).reduce((sum, tiers) => sum + tiers.length, 0), 0);
  if (!tierCount) throw new Error('promotion_tiers_not_found_in_workbook');
}

function LoginPage({ onLogin, onDemo, allowDemo }: { onLogin: (session: Session) => void; onDemo: () => void; allowDemo: boolean }) {
  const [adminKey, setAdminKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      onLogin(await login('', adminKey));
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setBusy(false);
    }
  };
  return <main className="login-page"><section className="login-card">
    <div className="eyebrow">PROMO SYSTEM REBUILD</div><h1>หลังบ้านโปรโมชั่นใหม่</h1>
    <p>ใช้รหัสอัปโหลดเดิมเพื่อโหลด Product Master และราคาเดิมก่อนเริ่มอ่าน PDF</p>
    {error && <div className="notice error">เข้าสู่ระบบไม่สำเร็จ: {error}</div>}
    <form onSubmit={submit}>
      <label className="field">รหัสอัปโหลด<input type="password" autoComplete="current-password" value={adminKey} onChange={event => setAdminKey(event.target.value)} required /></label>
      <button className="btn primary" disabled={busy} title={busy ? 'กำลังตรวจสิทธิ์ กรุณารอสักครู่' : ''}>{busy ? 'กำลังตรวจสิทธิ์...' : 'เข้าสู่ระบบ'}</button>
    </form>
    {allowDemo && <><div className="divider">หรือ</div><button className="btn soft" style={{ width: '100%' }} onClick={onDemo}>ดู Preview แบบสาธิต (อ่านอย่างเดียว)</button></>}
    <div className="audit-note"><ShieldCheck size={14} /> โหมด Dry-run โหลด Product Master จริง แต่บล็อก Draft และ Publish</div>
  </section></main>;
}

function GroupEditor({ group, dataset, priceDraft, onPriceDraft, onConfirmSku, onApplyPrice, onApplyCardPromotion }: {
  group: ProductGroup;
  dataset: PromoDataset;
  priceDraft: string;
  onPriceDraft: (value: string) => void;
  onConfirmSku: () => void;
  onApplyPrice: (price: number) => void;
  onApplyCardPromotion: (cardId: string, familyId: string) => void;
}) {
  const cards = dataset.cards.filter(card => group.cardIds.includes(card.id));
  const locked = Boolean(group.manualLocked || group.manualConfirmed);
  return <article className={`group-card ${group.status}`}>
    <div className="group-top">
      <div>
        <div className="thumbs">{cards.map(card => <div className="thumb" key={card.id}>
          {card.imageUrl ? <img src={card.imageUrl} alt={card.id} loading="lazy" /> : <div className="empty">ไม่มีรูป</div>}
          <span>{card.classId}</span>
          <label className="field card-promotion-field">โปรโมชั่นของการ์ด
            <select
              data-testid={`card-promotion-${card.id}`}
              value={card.promotionFamilyId || ''}
              disabled={locked}
              title={locked ? 'กลุ่มล็อกแล้ว ต้องปลดล็อกก่อนเปลี่ยนโปรโมชั่น' : ''}
              onChange={event => onApplyCardPromotion(card.id, event.target.value)}
            >
              <option value="">รอตรวจโปรโมชั่น</option>
              {dataset.promotionFamilies
                .filter(item => Boolean(card.classId && item.tiersByClass[card.classId]))
                .map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            {!card.promotionFamilyId && <small className="promotion-pending">รอตรวจโปรโมชั่น</small>}
          </label>
        </div>)}</div>
        <div className="product-name">{group.sku.canonicalName}</div>
        <div className="tags"><span className="tag">{group.sku.code}</span><span className={`tag ${group.status === 'ready' ? 'good' : group.status === 'blocked' ? 'bad' : 'warn'}`}>{group.status}</span><span className="tag">{group.cardIds.length} การ์ด</span>{locked && <span className="tag good">ล็อกแล้ว</span>}{group.promotionFamilyId && <span className="tag good">Family เดียวกันทุกใบ</span>}{!group.promotionFamilyId && cards.some(card => card.promotionFamilyId) && <span className="tag warn">โปรโมชั่นต่างกันรายใบ</span>}{group.classIds.map(classId => <span className="tag" key={classId}>{classId}</span>)}</div>
        <div className="sku-meta"><span><b>แบรนด์:</b> {group.sku.identity.brand || '-'}</span><span><b>ชนิด:</b> {group.sku.identity.productType || '-'}</span><span><b>ขนาด:</b> {group.sku.identity.sizeValue || '-'} {group.sku.identity.sizeUnit}</span><span><b>หน่วย/Pack:</b> {group.sku.identity.salesUnit} × {group.sku.identity.packQuantity}</span><span><b>Variant:</b> {group.sku.identity.variant || '-'}</span><span><b>ราคา:</b> {money(group.price.effectivePrice?.amount)}</span></div>
        {group.sku.status === 'candidate' && <button className="btn soft" style={{ marginTop: 10 }} onClick={onConfirmSku}>ยืนยันเป็น SKU ใหม่</button>}
        {group.sku.status === 'quarantine' && <div className="failure">ชื่อสินค้ายังไม่พอระบุ Product Master อย่างปลอดภัย</div>}
        {!!group.failureReasons.length && <div className="failure">{group.failureReasons.join(' · ')}</div>}
      </div>
      <div className="group-controls">
        <div className="price-row"><label className="field">ราคากลางต่อชิ้น<input type="number" min="0.01" step="0.01" inputMode="decimal" value={priceDraft} onChange={event => onPriceDraft(event.target.value)} placeholder="0.00" /></label><label className="field">แหล่งราคา<input value={group.price.source === 'central_override' ? 'คุณกรอกเอง' : 'ยังไม่มีราคา'} readOnly /></label></div>
        <div className="price-source">ราคาเริ่มว่างและจะเปลี่ยนเมื่อคุณกรอกเองเท่านั้น</div>
        <div className="tier-preview">{cards.map(card => <div className="tier-line" key={card.id}><b>{card.classId}</b><span>{card.promotionTiers.map(tier => tier.sourceText).join(' / ') || 'รอตรวจโปรโมชั่น'}</span></div>)}</div>
        <div className="control-actions"><button className="btn success" disabled={locked || !(Number(priceDraft) > 0)} title={locked ? 'กลุ่มล็อกแล้ว ต้องปลดล็อกก่อนเปลี่ยนราคา' : !(Number(priceDraft) > 0) ? 'กรอกราคามากกว่า 0' : ''} onClick={() => onApplyPrice(Number(priceDraft))}>บันทึกราคากลาง</button></div>
      </div>
    </div>
  </article>;
}

function AdminApp() {
  const params = new URLSearchParams(location.search);
  const demoFromUrl = params.get('demo') === '1';
  const dryRun = params.get('dryrun') === '1';
  const requestedDatasetId = params.get('dataset') || '';
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
  const [message, setMessage] = useState('เลือก PDF และ CSV/XLSM ของเดือนเดียวกัน ระบบจะตัดกริดภาพและให้คุณจัดกลุ่มเองทั้งหมด');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [previewChecked, setPreviewChecked] = useState(false);
  const [savedVersionId, setSavedVersionId] = useState<string | null>(null);
  const [loadedDatasetId, setLoadedDatasetId] = useState('');

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
    setMessage(`เลือก ${info.label}: ${selected.name} — พร้อมตรวจข้อมูลก่อนเปิด PDF`);
  };

  useEffect(() => {
    if (!session) { setChecking(false); return; }
    validateSession(session).catch(() => {
      saveSession(null);
      setSession(null);
    }).finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!session || !requestedDatasetId || loadedDatasetId === requestedDatasetId) return;
    let cancelled = false;
    setBusy(true);
    loadPromoSourceDataset(requestedDatasetId, session.accessToken)
      .then(result => {
        if (cancelled) return;
        setDataset(result.dataset);
        setQuarantine(result.quarantine);
        setMonthKey(result.dataset.version.monthKey);
        setLoadedDatasetId(requestedDatasetId);
        setMessage(`โหลด Dataset กลาง revision ${result.dataset.sourceDataset?.revision || '-'} · ${result.dataset.cards.length + result.quarantine.length} การ์ด`);
        setError('');
      })
      .catch(caught => { if (!cancelled) setError(`โหลด Dataset กลางไม่สำเร็จ: ${errorText(caught)}`); })
      .finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; };
  }, [session, requestedDatasetId, loadedDatasetId]);

  const loadMasterData = async (): Promise<MasterData> => {
    if (!session) throw new Error('admin_session_required_for_product_master');
    return fetchPromoMasterData(session);
  };

  const startManualGrid = (
    imported: PdfImportResult,
    parsedWorkbook: WorkbookParseResult,
    master: MasterData,
    sourcePdfName: string,
    sourceWorkbookName: string,
    sourceLabel: string,
    extraWarnings: string[] = [],
    artifactMonthKey = monthKey,
  ) => {
    const version = nextDraftVersion(artifactMonthKey, [], session?.user.id || null);
    version.status = 'need_review';
    version.source = { pdfName: sourcePdfName, workbookName: sourceWorkbookName, pdfHash: null, workbookHash: null };
    const unassigned = imported.cards.map(card => ({
      ...card,
      rawText: '',
      productText: '',
      failureReasons: [...new Set([
        ...card.failureReasons.filter(reason => reason !== 'product_text_missing'),
        'manual_grouping_required',
      ])],
    }));
    const next: PromoDataset = {
      schema: 'promo-system-rebuild-v1',
      version,
      skus: master.skus.filter(sku => sku.status === 'active'),
      prices: [],
      cards: [],
      productGroups: [],
      promotionFamilies: parsedWorkbook.families,
      sourceDataset: {
        datasetId: crypto.randomUUID(),
        fingerprint: '0'.repeat(64),
        revision: 0,
        cardIdsHash: '0'.repeat(64),
        persisted: false,
        savedAt: null,
      },
      warnings: [...new Set([
        ...imported.warnings,
        ...parsedWorkbook.warnings,
        ...extraWarnings,
        'pipeline:grid_and_class_only',
        'automatic_product_ocr_disabled',
        'automatic_product_grouping_disabled',
      ])],
    };
    const missingClass = unassigned.filter(card => !card.classId).length;
    setDataset(next);
    setQuarantine(unassigned);
    setPriceDrafts({});
    setProgress(null);
    setMessage(`${sourceLabel}: กริด ${unassigned.length} การ์ด · Product Master ${next.skus.length} กลุ่ม · รอคุณจัดเองทั้งหมด${missingClass ? ` · ไม่มี Class ${missingClass} ใบ` : ''}`);
  };

  const processFiles = async () => {
    if (!pdf || !workbook) return;
    setBusy(true);
    setError('');
    setPreviewChecked(false);
    setSavedVersionId(null);
    try {
      const [{ importPromotionPdf }, { parsePromotionWorkbook }] = await Promise.all([import('../import/pdf-importer'), import('../import/workbook-parser')]);
      setProgress({ phase: 'loading', page: 0.02, pageCount: 1, cards: 0, elapsedMs: 0, message: 'ตรวจ XLSM และโหลด Product Master ก่อนตัดกริด PDF' });
      const [parsedWorkbook, master] = await Promise.all([parsePromotionWorkbook(workbook), loadMasterData()]);
      assertWorkbookReady(parsedWorkbook);
      setProgress({ phase: 'loading', page: 0.05, pageCount: 1, cards: 0, elapsedMs: 0, message: `XLSM พร้อม ${parsedWorkbook.families.length} Family · Product Master ${master.skus.length} รายการ · เริ่มตัดกริด PDF` });
      const imported = await importPromotionPdf(pdf, {
        monthKey,
        enableOcr: ocr,
        extractProductText: false,
        onProgress: setProgress,
      });
      const cacheWarnings = [
        'pipeline:grid_and_class_only',
        'automatic_product_ocr_disabled',
        'automatic_product_grouping_disabled',
      ];
      try {
        const summary = await savePromoTestCache({
          monthKey,
          ocrEnabled: ocr,
          pdf,
          workbook,
          imported,
          parsedWorkbook,
          visualSignatures: {},
        });
        setCacheSummary(summary);
        if (summary.mode === 'source_only') cacheWarnings.push('browser_cache_source_only_storage_quota');
      } catch (caught) {
        cacheWarnings.push(`browser_cache_save_failed:${errorText(caught)}`);
      }
      startManualGrid(
        imported,
        parsedWorkbook,
        master,
        pdf.name,
        workbook.name,
        'ตัดกริดภาพและอ่าน Class แล้ว',
        cacheWarnings,
      );
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
    setProgress({ phase: 'loading', page: 0.05, pageCount: 1, cards: cacheSummary?.cardCount || 0, elapsedMs: 0, message: 'รับคำสั่งแล้ว · กำลังอ่านกริดภาพจาก IndexedDB' });
    try {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      const [cached, master] = await Promise.all([loadPromoTestCache(), loadMasterData()]);
      if (!cached) throw new Error('cache_not_found_on_this_browser');
      setCacheSummary(cached.summary);
      setMonthKey(cached.monthKey);
      setOcr(cached.ocrEnabled);
      setPdf(cached.pdf);
      setWorkbook(cached.workbook);
      if (!cached.imported || !cached.parsedWorkbook) throw new Error('cache_source_only_reprocess_required');
      assertWorkbookReady(cached.parsedWorkbook);
      setProgress({ phase: 'cards', page: 0.8, pageCount: 1, cards: cached.imported.cards.length, elapsedMs: performance.now() - started, message: `โหลดกริดแล้ว · Product Master ${master.skus.length} · เตรียมให้จัดเองทั้งหมด` });
      startManualGrid(
        cached.imported,
        cached.parsedWorkbook,
        master,
        cached.pdf.name,
        cached.workbook.name,
        'โหลดกริดจากแคชแล้ว',
        ['manual_grid_loaded_from_browser_cache', ...cached.warnings],
        cached.monthKey,
      );
    } catch (caught) {
      setProgress(null);
      const code = errorText(caught);
      if (code === 'cache_not_found_on_this_browser') setError('ไม่พบแคชในเบราว์เซอร์นี้ ต้องประมวลผลไฟล์ใหม่หนึ่งครั้ง');
      else if (code === 'cache_source_only_reprocess_required') setError('แคชเก็บเฉพาะไฟล์ต้นฉบับ ไม่มีผลกริด ต้องประมวลผลไฟล์ใหม่');
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
      const nextGroup: ProductGroup = { ...target, sku, failureReasons: target.failureReasons.filter(reason => reason !== 'new_sku_requires_confirmation'), status: 'need_review' };
      const cards = current.cards.map(card => card.productGroupId === groupId ? { ...card, status: 'need_review' as const } : card);
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

  const applyGroupPrice = (groupId: string, amount: number) => setDataset(current => {
    if (!current) return current;
    const group = current.productGroups.find(item => item.id === groupId);
    if (!group) return current;
    if (group.manualLocked || group.manualConfirmed) {
      setError('กลุ่มล็อกแล้ว ต้องปลดล็อกก่อนเปลี่ยนราคา');
      return current;
    }
    try {
      const price = setCentralPrice(group.price, amount);
      const priced = applyPriceToGroup(group, current.cards, price);
      setError('');
      setPreviewChecked(false);
      setSavedVersionId(null);
      return {
        ...current,
        prices: [...current.prices.filter(item => item.skuId !== price.skuId), price],
        cards: priced.cards,
        productGroups: current.productGroups.map(item => item.id === groupId ? {
          ...priced.group,
          manualConfirmed: false,
          manualLocked: false,
        } : item),
      };
    } catch (caught) {
      setError(errorText(caught));
      return current;
    }
  });


  const applyCardPromotion = (groupId: string, cardId: string, familyId: string) => setDataset(current => {
    if (!current) return current;
    const group = current.productGroups.find(item => item.id === groupId);
    const family = familyId ? current.promotionFamilies.find(item => item.id === familyId) : null;
    if (!group || (familyId && !family)) return current;
    try {
      const promoted = applyPromotionFamilyToCard(group, current.cards, cardId, family || null);
      setPreviewChecked(false);
      setSavedVersionId(null);
      setError('');
      return {
        ...current,
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
    if (!dataset || !session || demo || dryRun) return;
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
    if (!dataset || !session || demo || dryRun || !savedVersionId || !previewChecked) return;
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
  if (!session && !demo) return <LoginPage onLogin={value => setSession(value)} onDemo={() => { setDemo(true); setDataset(createDemoDataset('draft')); }} allowDemo={!dryRun} />;
  const ready = dataset?.productGroups.filter(group => group.status === 'ready').length || 0;
  const blocked = dataset?.productGroups.filter(group => group.status === 'blocked').length || 0;
  const publishable = Boolean(dataset && savedVersionId && previewChecked && !busy && !demo && !dryRun && ready === dataset.productGroups.length && blocked === 0 && quarantine.length === 0 && dataset.version.status !== 'published');

  return <div className="admin-shell">
    <header className="admin-hero"><div className="hero-inner"><div className="hero-row"><div><div className="eyebrow">PROMO SYSTEM REBUILD · {demo ? 'DEMO READ-ONLY' : dryRun ? 'FILE DRY-RUN' : 'AUTHENTICATED ADMIN'}</div><h1>จัดโปรโมชั่นเป็นกลุ่ม ไม่ไล่ติ๊กทีละการ์ด</h1><p>นำเข้า PDF + CSV/XLSM แล้วจัด SKU, Product Group, โปรราย Class และราคากลางในหน้าจอเดียว</p></div><div className="hero-actions"><a className="btn ghost" href="/promo-new.html?demo=1">ดูหน้าลูกค้า</a>{session && <button className="btn ghost" onClick={() => logout(session).finally(() => setSession(null))}><LogOut size={16} /> ออกจากระบบ</button>}</div></div></div></header>
    <main className="admin-main">
      {demo && <div className="notice warn">นี่คือข้อมูลสาธิตสำหรับตรวจ UI เท่านั้น ปุ่มบันทึก/Publish ถูกปิด และไม่มีการเชื่อม Production</div>}
      {dryRun && <div className="notice warn" data-testid="dryrun-banner"><b>โหมดทดลอง — ไม่บันทึกฐานข้อมูล</b> · Build {BUILD_ID} · state แยกจากโหมดจริงและไม่โหลดล็อกเดิม</div>}
      {error && <div className="notice error"><AlertTriangle size={15} /> {error}</div>}
      <section className="panel">
        <div className="step-grid">
          <label className="field">เดือนโปรโมชั่น<input value={monthKey} onChange={event => setMonthKey(event.target.value.toUpperCase())} placeholder="เช่น PROMO-2026-08" /></label>
          <label className="field file-drop"><span><UploadCloud size={16} /> เลือก PDF โปรโมชั่น</span><input type="file" accept="application/pdf,.pdf" onChange={event => setPdf(event.target.files?.[0] || null)} /><small>{pdf?.name || 'ยังไม่ได้เลือก'}</small></label>
          <label className="field file-drop"><span><FileSpreadsheet size={16} /> เลือก CSV/XLSX/XLSM</span><input type="file" accept={PROMOTION_WORKBOOK_ACCEPT} onChange={selectWorkbook} /><small>{workbook ? `${workbook.name} · ${inspectPromotionWorkbookFile(workbook).label}` : 'รองรับ .csv, .xlsx, .xlsm และ .xls'}</small></label>
        </div>
        <div className="run-row">
          <label className="field" style={{ flexDirection: 'row', alignItems: 'center' }}><input style={{ width: 18, height: 18 }} type="checkbox" checked={ocr} onChange={event => setOcr(event.target.checked)} /> ตัดกริดการ์ดจากกรอบนอก + ช่องอ้างอิงซ้ายล่าง + ช่องโปรโมชั่นสีแดง และอ่าน Class ของหน้าเท่านั้น</label>
          <button className="btn primary" disabled={busy || !pdf || !workbook || demo || !session} title={demo ? 'โหมดสาธิตไม่รับไฟล์' : !session ? 'เข้าสู่ระบบก่อน' : !pdf || !workbook ? 'เลือก PDF และ CSV/XLSM ให้ครบ' : busy ? 'กำลังประมวลผล' : ''} onClick={processFiles}>{busy ? 'กำลังตัดกริด...' : 'ตัดกริดภาพและเตรียมจัดกลุ่ม'}</button>
        </div>
        <div style={{ marginTop: 12, padding: 12, border: '1px solid #dbe4ef', borderRadius: 12, background: '#f8fafc' }}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <b style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Database size={16} /> ไฟล์ทดสอบล่าสุดในเครื่องนี้</b>
              <small>{cacheSummary ? `${cacheSummary.monthKey} · ${cacheSummary.pdfName} · ${cacheSummary.workbookName} · ${cacheSummary.cardCount || '-'} การ์ด · ${formatCacheSize(cacheSummary.estimatedBytes)} · ${cacheSummary.mode === 'full' ? 'พร้อมจัดกลุ่มใหม่' : 'เก็บเฉพาะไฟล์ ต้องประมวลผลใหม่'} · ${cacheDate(cacheSummary.savedAt)}` : 'ยังไม่มี summary หรือ localStorage ถูกล้าง — ปุ่มตรวจแคชจะตรวจ IndexedDB จริง'}</small>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn soft" disabled={busy || demo || !session} title={demo ? 'โหมดสาธิตไม่ใช้แคช' : !session ? 'เข้าสู่ระบบก่อน' : busy ? 'กำลังทำงาน' : ''} onClick={useCachedRun}><Database size={15} /> {busy ? 'กำลังทำงาน...' : 'ตรวจและจัดกลุ่มจากแคช'}</button>
              <button className="btn soft" disabled={busy || demo} title={demo ? 'โหมดสาธิตไม่มีแคชให้ล้าง' : busy ? 'รอให้งานปัจจุบันเสร็จก่อน' : ''} onClick={clearCachedRun}><Trash2 size={15} /> ล้างแคช</button>
            </div>
          </div>
          <small>แคชรุ่นเก่าที่ตัดกรอบไม่ตรงถูกยกเลิก; แคชรุ่นนี้ใช้เฉพาะ Structural Grid ที่ตรวจจุดอ้างอิงครบและลายนิ้วมือที่ตรวจครบ</small>
        </div>
        <div className="progress"><i style={{ width: progress ? `${Math.max(3, progress.page / Math.max(1, progress.pageCount) * 100)}%` : '0%' }} /></div><div className="progress-meta"><span>{progress?.message || message}</span><span>{progress ? `${progress.cards} การ์ด · ${(progress.elapsedMs / 1000).toFixed(1)} วินาที` : ''}</span></div>
      </section>
      <section className="panel"><div className="summary"><div className="stat"><span>SKU</span><b>{dataset?.skus.length || 0}</b></div><div className="stat"><span>Product Group</span><b>{dataset?.productGroups.length || 0}</b></div><div className="stat"><span>การ์ด</span><b>{dataset?.cards.length || 0}</b></div><div className="stat"><span>พร้อมใช้</span><b>{ready}</b></div><div className="stat"><span>Block/Quarantine</span><b>{blocked + quarantine.length}</b></div></div></section>
      {dataset && <>
        <ManualGroupingWorkbench
          dataset={dataset}
          quarantine={quarantine}
          adminKey={session?.accessToken || ''}
          readOnly={demo || dryRun}
          onDatasetChange={setDataset}
          onQuarantineChange={setQuarantine}
          onMessage={setMessage}
          onError={setError}
          onDirty={() => { setPreviewChecked(false); setSavedVersionId(null); }}
        />
        <GroupingSnapshotSave
          dataset={dataset}
          quarantine={quarantine}
          adminKey={session?.accessToken || ''}
          readOnly={demo || dryRun}
          onMessage={setMessage}
          onError={setError}
          onSaved={snapshot => setDataset(current => current?.sourceDataset ? {
            ...current,
            sourceDataset: {
              ...current.sourceDataset,
              snapshotId: snapshot.snapshotId,
              snapshotRevision: snapshot.revision,
              snapshotSavedAt: snapshot.savedAt,
            },
          } : current)}
        />
      </>}
      <section className="panel"><div className="section-head"><div><h2><Layers3 size={19} /> Product Group</h2><small>PDF ใช้เฉพาะตัดกริดภาพและอ่าน Class; ระบบไม่อ่านชื่อสินค้าและไม่จัด Product Group อัตโนมัติ คุณต้องเลือก Product Master ปลายทางเองทุกการ์ด</small></div><span className="tag">{visibleGroups.length} กลุ่ม</span></div><div className="search-row"><label style={{ position: 'relative' }}><Search size={17} style={{ position: 'absolute', left: 12, top: 14, color: '#64748b' }} /><input style={{ paddingLeft: 38 }} value={search} onChange={event => setSearch(event.target.value)} placeholder="ค้นหาชื่อสินค้า แบรนด์ SKU หรือ Class" /></label><select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">ทุกสถานะ</option><option value="ready">พร้อมใช้</option><option value="need_review">ต้องตรวจ</option><option value="blocked">Block</option></select></div>
        <div className="group-list">{dataset ? visibleGroups.map(group => <GroupEditor
          key={group.id}
          group={group}
          dataset={dataset}
          priceDraft={priceDrafts[group.id] ?? String(group.price.effectivePrice?.amount || '')}
          onPriceDraft={value => setPriceDrafts(current => ({ ...current, [group.id]: value }))}
          onConfirmSku={() => confirmSku(group.id)}
          onApplyPrice={amount => applyGroupPrice(group.id, amount)}
          onApplyCardPromotion={(cardId, familyId) => applyCardPromotion(group.id, cardId, familyId)}
        />) : <div className="empty">เลือกไฟล์แล้วกดประมวลผล หรือกดตรวจและจัดกลุ่มจากแคช</div>}</div>
      </section>
      <div className="footer-actions"><button className="btn soft" disabled={!dataset || busy || (!dryRun && !savedVersionId)} title={!dataset ? 'ยังไม่มี Dataset' : busy ? 'กำลังทำงาน' : !dryRun && !savedVersionId ? 'Draft รุ่นเดิมถูกปิดอยู่' : ''} onClick={validatePreview}><CheckCircle2 size={16} /> {previewChecked ? 'ตรวจความพร้อมผ่าน' : 'ตรวจความพร้อมจริง'}</button><button className="btn primary" disabled={!dataset || !session || demo || dryRun || busy || Boolean(savedVersionId) || dataset.version.status === 'published'} title="Legacy Draft ถูกปิดจนกว่าจะผ่าน revision staging" onClick={save}><Save size={16} /> {savedVersionId ? 'Draft บันทึกแล้ว' : 'บันทึก Draft'}</button><button className="btn dark" disabled={!publishable} title={!publishable ? 'ต้องผ่าน Preview validation และ Legacy Publish ยังถูกปิดใน rebuild' : ''} onClick={publish}>Publish เวอร์ชันนี้</button></div>
    </main>
  </div>;
}

createRoot(document.getElementById('promo-admin-new-root')!).render(<React.StrictMode><AdminApp /></React.StrictMode>);
