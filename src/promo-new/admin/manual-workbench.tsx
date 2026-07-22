import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Lock, Plus, Search, Trash2, Undo2, Unlock, X } from 'lucide-react';
import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { PromoDataset, ProductGroup, Sku } from '../domain/types';
import { assignCardsManually, unassignCardsManually } from '../domain/manual-grouping';
import {
  createManualSku,
  ensureSkuInDataset,
  type ManualProductInput,
} from '../domain/manual-product';
import { createPromoMasterProduct, fetchActivePromoMasterSkus } from '../shared/master-api';
import './manual-workbench.css';

interface ManualGroupingWorkbenchProps {
  dataset: PromoDataset;
  quarantine: ImportedCardCandidate[];
  adminKey: string;
  readOnly: boolean;
  onDatasetChange: (dataset: PromoDataset) => void;
  onQuarantineChange: (cards: ImportedCardCandidate[]) => void;
  onMessage: (message: string) => void;
  onError: (message: string) => void;
  onDirty: () => void;
}

interface Snapshot {
  dataset: PromoDataset;
  quarantine: ImportedCardCandidate[];
  lockedGroupIds: string[];
}

interface CardView {
  id: string;
  imageUrl: string;
  classId: string;
  page: number;
  sequence: number;
  productText: string;
  rawText: string;
  groupId: string;
  groupName: string;
  unassigned: boolean;
}

const SALES_UNITS = ['ชิ้น', 'ขวด', 'แพ็ค', 'กล่อง', 'ลัง', 'ซอง', 'ด้าม', 'ถุง', 'ชุด'];
const SIZE_UNITS = ['มล.', 'กรัม', 'กก.', 'ลิตร', 'ชิ้น', 'ซอง', 'แพ็ค'];
const CLASS_IDS = ['HFSS', 'HFSM', 'HFSL', 'HFSXL', 'HFSWS-S', 'HFSWS-L'];

const emptyForm = (): ManualProductInput => ({
  canonicalName: '',
  brand: '',
  productType: '',
  variant: '',
  sizeValue: 0,
  sizeUnit: '',
  salesUnit: 'ชิ้น',
  packQuantity: 1,
  aliases: [],
});

const clean = (value: unknown): string => String(value || '').replace(/\s+/gu, ' ').trim();
const normalized = (value: string): string => clean(value).toLowerCase().normalize('NFKC').replace(/[^a-z0-9ก-๙]+/gu, '');

function targetParts(value: string): { kind: 'group' | 'sku' | ''; id: string } {
  if (value.startsWith('group:')) return { kind: 'group', id: value.slice(6) };
  if (value.startsWith('sku:')) return { kind: 'sku', id: value.slice(4) };
  return { kind: '', id: '' };
}

function uniqueSkus(skus: Sku[]): Sku[] {
  const byId = new Map<string, Sku>();
  for (const sku of skus) if (sku.status === 'active') byId.set(sku.id, sku);
  return [...byId.values()].sort((left, right) => left.canonicalName.localeCompare(right.canonicalName, 'th'));
}

function groupMemberCounts(group: ProductGroup, dataset: PromoDataset): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const card of dataset.cards.filter(item => group.cardIds.includes(item.id))) {
    const key = card.classId || 'NO-CLASS';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function suggestionScore(card: CardView, targetName: string): number {
  const target = clean(targetName).toLowerCase();
  const haystack = clean(`${card.productText} ${card.rawText} ${card.groupName}`).toLowerCase();
  if (!target || !haystack) return 0;
  if (normalized(haystack).includes(normalized(target))) return 1;
  const tokens = [...new Set(target.split(/[\s/,+()-]+/u).map(token => token.trim()).filter(token => token.length >= 2))];
  if (!tokens.length) return 0;
  const matched = tokens.filter(token => haystack.includes(token)).length;
  return matched / tokens.length;
}

export function ManualGroupingWorkbench({
  dataset,
  quarantine,
  adminKey,
  readOnly,
  onDatasetChange,
  onQuarantineChange,
  onMessage,
  onError,
  onDirty,
}: ManualGroupingWorkbenchProps) {
  const storageKey = `promo-manual-group-locks:${dataset.version.monthKey}`;
  const [masterSkus, setMasterSkus] = useState<Sku[]>([]);
  const [targetValue, setTargetValue] = useState('');
  const [targetLocked, setTargetLocked] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmedLocks, setConfirmedLocks] = useState<Set<string>>(() => new Set());
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [searchText, setSearchText] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'suggested' | 'unassigned' | 'all' | 'target'>('unassigned');
  const [showCreate, setShowCreate] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [form, setForm] = useState<ManualProductInput>(emptyForm());
  const [aliasText, setAliasText] = useState('');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setConfirmedLocks(new Set(Array.isArray(stored) ? stored.map(String) : []));
    } catch {
      setConfirmedLocks(new Set());
    }
  }, [storageKey]);

  useEffect(() => {
    let cancelled = false;
    if (!adminKey) {
      setMasterSkus(dataset.skus.filter(sku => sku.status === 'active'));
      return () => { cancelled = true; };
    }
    fetchActivePromoMasterSkus(adminKey)
      .then(skus => { if (!cancelled) setMasterSkus(skus); })
      .catch(error => { if (!cancelled) onError(String((error as Error)?.message || error)); });
    return () => { cancelled = true; };
  }, [adminKey, dataset.version.monthKey]);

  const persistLocks = (next: Set<string>) => {
    setConfirmedLocks(next);
    try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch { /* storage is optional */ }
  };

  const pushHistory = () => {
    const snapshot: Snapshot = { dataset, quarantine, lockedGroupIds: [...confirmedLocks] };
    setHistory(current => [...current.slice(-19), snapshot]);
  };

  const allMasterSkus = useMemo(
    () => uniqueSkus([...masterSkus, ...dataset.skus]),
    [masterSkus, dataset.skus],
  );
  const groupsById = useMemo(() => new Map(dataset.productGroups.map(group => [group.id, group])), [dataset.productGroups]);
  const skusById = useMemo(() => new Map(allMasterSkus.map(sku => [sku.id, sku])), [allMasterSkus]);
  const target = targetParts(targetValue);
  const targetGroup = target.kind === 'group' ? groupsById.get(target.id) || null : null;
  const targetSku = target.kind === 'sku' ? skusById.get(target.id) || null : targetGroup?.sku || null;
  const targetName = targetSku?.canonicalName || '';
  const targetConfirmed = Boolean(targetGroup && confirmedLocks.has(targetGroup.id));

  const cardViews = useMemo<CardView[]>(() => {
    const assigned = dataset.cards.map(card => {
      const group = card.productGroupId ? groupsById.get(card.productGroupId) : null;
      return {
        id: card.id,
        imageUrl: card.imageUrl || '',
        classId: card.classId || 'NO-CLASS',
        page: card.page,
        sequence: card.sequence,
        productText: card.evidence.productText,
        rawText: card.evidence.rawText,
        groupId: card.productGroupId || '',
        groupName: group?.sku.canonicalName || 'ยังไม่มีกลุ่ม',
        unassigned: false,
      };
    });
    const unresolved = quarantine.map(card => ({
      id: card.cardId,
      imageUrl: card.imageUrl,
      classId: card.classId || 'NO-CLASS',
      page: card.page,
      sequence: card.sequence,
      productText: card.productText,
      rawText: card.rawText,
      groupId: '',
      groupName: 'ยังไม่จัดกลุ่ม',
      unassigned: true,
    }));
    return [...unresolved, ...assigned].sort((left, right) => left.page - right.page || left.sequence - right.sequence);
  }, [dataset.cards, quarantine, groupsById]);

  const visibleCards = useMemo(() => cardViews.filter(card => {
    if (classFilter !== 'all' && card.classId !== classFilter) return false;
    const query = clean(searchText).toLowerCase();
    if (query && !clean(`${card.productText} ${card.rawText} ${card.groupName} ${card.classId} ${card.page}`).toLowerCase().includes(query)) return false;
    if (viewMode === 'unassigned' && !card.unassigned) return false;
    if (viewMode === 'target' && card.groupId !== targetGroup?.id) return false;
    if (viewMode === 'suggested') {
      if (!targetLocked || !targetName) return false;
      if (card.groupId === targetGroup?.id) return true;
      if (suggestionScore(card, targetName) < 0.28) return false;
    }
    return true;
  }), [cardViews, classFilter, searchText, viewMode, targetLocked, targetName, targetGroup?.id]);

  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
  const sourceLocked = (card: CardView) => Boolean(card.groupId && confirmedLocks.has(card.groupId));
  const selectableCards = visibleCards.filter(card => !sourceLocked(card) && card.groupId !== targetGroup?.id);
  const allVisibleSelected = selectableCards.length > 0 && selectableCards.every(card => selected.has(card.id));
  const targetCounts = targetGroup ? groupMemberCounts(targetGroup, dataset) : {};

  const toggleCard = (card: CardView) => {
    if (!targetLocked) return onError('เลือกกลุ่มปลายทางและกดล็อกก่อนเลือกการ์ด');
    if (targetConfirmed) return onError('กลุ่มปลายทางยืนยันแล้ว ต้องปลดล็อกกลุ่มก่อนแก้ไข');
    if (sourceLocked(card)) return onError(`การ์ดอยู่ในกลุ่มที่ยืนยันแล้ว: ${card.groupName}`);
    if (card.groupId === targetGroup?.id) return;
    setSelectedIds(current => current.includes(card.id) ? current.filter(id => id !== card.id) : [...current, card.id]);
    onError('');
  };

  const toggleVisible = () => {
    if (!targetLocked) return onError('ล็อกกลุ่มปลายทางก่อน');
    if (targetConfirmed) return onError('ปลดล็อกกลุ่มปลายทางก่อน');
    setSelectedIds(current => {
      const next = new Set(current);
      selectableCards.forEach(card => allVisibleSelected ? next.delete(card.id) : next.add(card.id));
      return [...next];
    });
  };

  const lockTarget = () => {
    if (!targetValue) return;
    setTargetLocked(true);
    setSelectedIds([]);
    setViewMode('suggested');
    onError('');
  };

  const changeTarget = () => {
    setTargetLocked(false);
    setSelectedIds([]);
    setViewMode('unassigned');
  };

  const assignSelected = () => {
    if (!targetLocked || !targetSku || !selectedIds.length) return;
    if (targetConfirmed) return onError('กลุ่มนี้ยืนยันแล้ว ต้องปลดล็อกก่อนเพิ่มการ์ด');
    try {
      pushHistory();
      let working = dataset;
      if (!working.skus.some(sku => sku.id === targetSku.id)) working = ensureSkuInDataset(working, targetSku);
      const result = assignCardsManually(
        working,
        quarantine,
        selectedIds,
        target.kind === 'sku' ? { skuId: targetSku.id } : { groupId: target.id },
      );
      onDatasetChange(result.dataset);
      onQuarantineChange(result.quarantine);
      onDirty();
      setTargetValue(`group:${result.targetGroupId}`);
      setTargetLocked(true);
      setSelectedIds([]);
      setViewMode('target');
      onMessage(`ย้าย ${result.movedCardIds.length} การ์ดเข้า ${targetSku.canonicalName} แล้ว · ยังไม่จัด ${result.quarantine.length} การ์ด`);
      onError('');
    } catch (error) {
      onError(String((error as Error)?.message || error));
    }
  };

  const removeSelected = () => {
    const assignedIds = selectedIds.filter(id => dataset.cards.some(card => card.id === id));
    if (!assignedIds.length) return onError('เลือกการ์ดที่อยู่ในกลุ่มก่อนนำออก');
    const lockedSource = assignedIds.map(id => dataset.cards.find(card => card.id === id)).find(card => card?.productGroupId && confirmedLocks.has(card.productGroupId));
    if (lockedSource) return onError('มีการ์ดจากกลุ่มที่ยืนยันแล้ว กรุณาปลดล็อกกลุ่มนั้นก่อน');
    try {
      pushHistory();
      const result = unassignCardsManually(dataset, quarantine, assignedIds);
      onDatasetChange(result.dataset);
      onQuarantineChange(result.quarantine);
      onDirty();
      setSelectedIds([]);
      setViewMode('unassigned');
      onMessage(`นำ ${result.removedCardIds.length} การ์ดออกจากกลุ่มแล้ว · รอจัด ${result.quarantine.length} การ์ด`);
      onError('');
    } catch (error) {
      onError(String((error as Error)?.message || error));
    }
  };

  const cleanDuplicateClassFlags = (groupId: string): PromoDataset => ({
    ...dataset,
    cards: dataset.cards.map(card => card.productGroupId === groupId ? {
      ...card,
      failureReasons: card.failureReasons.filter(reason => !reason.startsWith('duplicate_class:')),
      status: 'need_review' as const,
    } : card),
    productGroups: dataset.productGroups.map(group => group.id === groupId ? {
      ...group,
      failureReasons: group.failureReasons.filter(reason => !reason.startsWith('duplicate_class:')),
      status: 'need_review' as const,
    } : group),
  });

  const confirmTargetGroup = () => {
    if (!targetGroup) return onError('ต้องมีการ์ดในกลุ่มก่อนยืนยัน');
    pushHistory();
    onDatasetChange(cleanDuplicateClassFlags(targetGroup.id));
    const next = new Set(confirmedLocks);
    next.add(targetGroup.id);
    persistLocks(next);
    setSelectedIds([]);
    onDirty();
    onMessage(`ยืนยันและล็อกกลุ่ม ${targetGroup.sku.canonicalName} แล้ว (${targetGroup.cardIds.length} การ์ด)`);
    onError('');
  };

  const unlockTargetGroup = () => {
    if (!targetGroup) return;
    pushHistory();
    const next = new Set(confirmedLocks);
    next.delete(targetGroup.id);
    persistLocks(next);
    onDirty();
    onMessage(`ปลดล็อกกลุ่ม ${targetGroup.sku.canonicalName} แล้ว`);
  };

  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    onDatasetChange(previous.dataset);
    onQuarantineChange(previous.quarantine);
    persistLocks(new Set(previous.lockedGroupIds));
    setHistory(current => current.slice(0, -1));
    setSelectedIds([]);
    setTargetLocked(false);
    onDirty();
    onMessage('ย้อนกลับการจัดกลุ่มครั้งล่าสุดแล้ว');
    onError('');
  };

  const createNewMaster = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreateBusy(true);
    onError('');
    try {
      const input: ManualProductInput = {
        ...form,
        aliases: aliasText.split(/[\n,]+/u).map(clean).filter(Boolean),
      };
      let sku: Sku;
      let created = true;
      if (readOnly) {
        sku = createManualSku(input);
      } else {
        const result = await createPromoMasterProduct(input, adminKey);
        sku = createManualSku(input, result.sku.id);
        sku = { ...sku, evidence: [...new Set([...sku.evidence, ...(result.sku.evidence || [])])] };
        created = result.created;
      }
      const nextDataset = ensureSkuInDataset(dataset, sku);
      pushHistory();
      onDatasetChange(nextDataset);
      setMasterSkus(current => uniqueSkus([...current, sku]));
      setTargetValue(`sku:${sku.id}`);
      setTargetLocked(true);
      setViewMode('unassigned');
      setShowCreate(false);
      setForm(emptyForm());
      setAliasText('');
      onDirty();
      onMessage(`${created ? 'สร้าง' : 'เลือกใช้'} Product Master “${sku.canonicalName}” แล้ว · ราคาเริ่มต้นว่าง${readOnly ? ' (เฉพาะ Preview)' : ''}`);
    } catch (error) {
      onError(String((error as Error)?.message || error));
    } finally {
      setCreateBusy(false);
    }
  };

  return <section className="panel manual-workbench">
    <div className="section-head manual-title-row">
      <div>
        <h2>จัดการ์ดเข้ากลุ่มสินค้า</h2>
        <small>Product Master ใช้งาน {allMasterSkus.length} กลุ่ม · เลือกปลายทางแล้วล็อกก่อนติ๊กการ์ด · กลุ่มเดียวมีหลายการ์ดจาก Class เดียวกันได้</small>
      </div>
      <div className="manual-title-actions">
        <button className="btn soft" disabled={!history.length} onClick={undo}><Undo2 size={15} /> ย้อนกลับ</button>
        <button className="btn primary" onClick={() => setShowCreate(true)}><Plus size={15} /> เพิ่มกลุ่มใหม่</button>
      </div>
    </div>

    <div className="manual-stats">
      <div><span>Product Master</span><b>{allMasterSkus.length}</b></div>
      <div><span>กลุ่มเดือนนี้</span><b>{dataset.productGroups.length}</b></div>
      <div><span>จัดแล้ว</span><b>{dataset.cards.length}</b></div>
      <div><span>ยังไม่จัด</span><b>{quarantine.length}</b></div>
      <div><span>ยืนยันแล้ว</span><b>{confirmedLocks.size}</b></div>
    </div>

    <div className="target-picker">
      <label className="field">กลุ่มสินค้าปลายทาง
        <select disabled={targetLocked} value={targetValue} onChange={event => setTargetValue(event.target.value)}>
          <option value="">เลือกกลุ่มสินค้า</option>
          <optgroup label="กลุ่มที่มีการ์ดในเดือนนี้">
            {dataset.productGroups.slice().sort((a, b) => a.sku.canonicalName.localeCompare(b.sku.canonicalName, 'th')).map(group =>
              <option key={group.id} value={`group:${group.id}`}>{confirmedLocks.has(group.id) ? '🔒 ' : ''}{group.sku.canonicalName} · {group.cardIds.length} การ์ด</option>)}
          </optgroup>
          <optgroup label="Product Master ที่ยังไม่มีกลุ่มในเดือนนี้">
            {allMasterSkus.filter(sku => !dataset.productGroups.some(group => group.skuId === sku.id)).map(sku =>
              <option key={sku.id} value={`sku:${sku.id}`}>{sku.canonicalName}</option>)}
          </optgroup>
        </select>
      </label>
      <div className="target-actions">
        <button className="btn primary" disabled={!targetValue || targetLocked} onClick={lockTarget}><Lock size={15} /> ล็อกเป็นปลายทาง</button>
        <button className="btn soft" disabled={!targetLocked} onClick={changeTarget}>เปลี่ยนปลายทาง</button>
        {targetGroup && (targetConfirmed
          ? <button className="btn soft" onClick={unlockTargetGroup}><Unlock size={15} /> ปลดล็อกกลุ่ม</button>
          : <button className="btn success" onClick={confirmTargetGroup}><CheckCircle2 size={15} /> ยืนยันกลุ่ม</button>)}
      </div>
    </div>

    {targetLocked && targetSku && <div className={`target-banner ${targetConfirmed ? 'confirmed' : ''}`}>
      <div><b>{targetConfirmed ? 'กลุ่มยืนยันแล้ว' : 'กำลังจัดเข้า'}: {targetSku.canonicalName}</b><small>{targetGroup ? `${targetGroup.cardIds.length} การ์ด` : 'ยังไม่มีการ์ด'} · ราคายังว่างจนกว่าคุณกรอกเอง</small></div>
      <div className="class-counts">{CLASS_IDS.map(classId => <span key={classId}>{classId}: {targetCounts[classId] || 0}</span>)}</div>
    </div>}

    <div className="manual-toolbar">
      <div className="manual-tabs">
        <button className={viewMode === 'suggested' ? 'active' : ''} onClick={() => setViewMode('suggested')} disabled={!targetLocked}>ระบบแนะนำ</button>
        <button className={viewMode === 'unassigned' ? 'active' : ''} onClick={() => setViewMode('unassigned')}>ยังไม่จัด</button>
        <button className={viewMode === 'target' ? 'active' : ''} onClick={() => setViewMode('target')} disabled={!targetGroup}>ในกลุ่มนี้</button>
        <button className={viewMode === 'all' ? 'active' : ''} onClick={() => setViewMode('all')}>ทั้งหมด</button>
      </div>
      <label className="manual-search"><Search size={16} /><input value={searchText} onChange={event => setSearchText(event.target.value)} placeholder="ค้นหาชื่อ OCR แบรนด์ หน้า หรือกลุ่ม" /></label>
      <select value={classFilter} onChange={event => setClassFilter(event.target.value)}><option value="all">ทุก Class</option>{CLASS_IDS.map(classId => <option key={classId}>{classId}</option>)}</select>
    </div>

    <div className="selection-bar">
      <button className="btn soft" disabled={!targetLocked || !selectableCards.length || targetConfirmed} onClick={toggleVisible}>{allVisibleSelected ? 'ยกเลิกที่แสดง' : `เลือกที่แสดง ${selectableCards.length} ใบ`}</button>
      <span>เลือกแล้ว <b>{selectedIds.length}</b> ใบ</span>
      <button className="btn success" disabled={!targetLocked || !selectedIds.length || targetConfirmed} onClick={assignSelected}>เพิ่ม/ย้ายเข้ากลุ่ม</button>
      <button className="btn danger" disabled={!selectedIds.some(id => dataset.cards.some(card => card.id === id))} onClick={removeSelected}><Trash2 size={15} /> นำออกจากกลุ่ม</button>
    </div>

    <div className="manual-card-grid">
      {visibleCards.map(card => {
        const disabled = !targetLocked || targetConfirmed || sourceLocked(card) || card.groupId === targetGroup?.id;
        return <label className={`manual-card ${selected.has(card.id) ? 'selected' : ''} ${disabled ? 'disabled' : ''}`} key={card.id}>
          <input type="checkbox" checked={selected.has(card.id)} disabled={disabled} onChange={() => toggleCard(card)} />
          {card.imageUrl ? <img src={card.imageUrl} alt={card.id} loading="lazy" /> : <div className="manual-card-empty">ไม่มีรูป</div>}
          <div className="manual-card-body">
            <b>{card.productText || card.groupName || 'อ่านชื่อไม่ได้'}</b>
            <small>{card.classId} · หน้า {card.page} · ใบ {card.sequence}</small>
            <span className={card.unassigned ? 'state-unassigned' : 'state-grouped'}>{card.groupName}</span>
            {sourceLocked(card) && <span className="state-locked">กลุ่มต้นทางล็อกแล้ว</span>}
          </div>
        </label>;
      })}
      {!visibleCards.length && <div className="manual-empty">ไม่พบการ์ดตามตัวกรองนี้</div>}
    </div>

    {showCreate && <div className="manual-modal-backdrop" role="presentation">
      <form className="manual-modal" onSubmit={createNewMaster}>
        <div className="manual-modal-head"><div><h3>สร้างกลุ่มสินค้าใหม่</h3><small>บันทึกเป็น Product Master สำหรับเดือนต่อไป และราคาเริ่มต้นว่าง</small></div><button type="button" className="icon-btn" onClick={() => setShowCreate(false)}><X size={18} /></button></div>
        <div className="manual-form-grid">
          <label className="field wide">ชื่อกลุ่มมาตรฐาน<input value={form.canonicalName} onChange={event => setForm(current => ({ ...current, canonicalName: event.target.value }))} placeholder="เช่น แพนทีน แชมพู 500 มล." required /></label>
          <label className="field">แบรนด์<input value={form.brand} onChange={event => setForm(current => ({ ...current, brand: event.target.value }))} required /></label>
          <label className="field">ประเภทสินค้า<input value={form.productType} onChange={event => setForm(current => ({ ...current, productType: event.target.value }))} placeholder="แชมพู / ครีมนวด / มีดโกน" required /></label>
          <label className="field">รุ่น/สูตร<input value={form.variant} onChange={event => setForm(current => ({ ...current, variant: event.target.value }))} placeholder="เว้นว่างได้" /></label>
          <label className="field">ขนาด<input type="number" min="0" step="0.01" inputMode="decimal" value={form.sizeValue} onChange={event => setForm(current => ({ ...current, sizeValue: Number(event.target.value) }))} /></label>
          <label className="field">หน่วยขนาด<select value={form.sizeUnit} onChange={event => setForm(current => ({ ...current, sizeUnit: event.target.value }))}><option value="">ไม่ระบุ</option>{SIZE_UNITS.map(unit => <option key={unit}>{unit}</option>)}</select></label>
          <label className="field">หน่วยขาย<select value={form.salesUnit} onChange={event => setForm(current => ({ ...current, salesUnit: event.target.value }))}>{SALES_UNITS.map(unit => <option key={unit}>{unit}</option>)}</select></label>
          <label className="field">จำนวนต่อแพ็ก<input type="number" min="1" max="999" step="1" value={form.packQuantity} onChange={event => setForm(current => ({ ...current, packQuantity: Number(event.target.value) }))} /></label>
          <label className="field wide">คำเรียกอื่น/OCR alias<textarea rows={3} value={aliasText} onChange={event => setAliasText(event.target.value)} placeholder="คั่นด้วยจุลภาคหรือขึ้นบรรทัดใหม่" /></label>
        </div>
        <div className="manual-modal-note">ระบบตรวจชื่อซ้ำก่อนสร้าง · โปรโมชั่นต่างกันไม่ต้องสร้างกลุ่มใหม่ · ขนาดหรือแพ็กต่างกันให้สร้างคนละกลุ่ม</div>
        <div className="manual-modal-actions"><button type="button" className="btn soft" onClick={() => setShowCreate(false)}>ยกเลิก</button><button className="btn primary" disabled={createBusy}>{createBusy ? 'กำลังบันทึก...' : readOnly ? 'สร้างเฉพาะ Preview' : 'สร้าง Product Master'}</button></div>
      </form>
    </div>}
  </section>;
}
