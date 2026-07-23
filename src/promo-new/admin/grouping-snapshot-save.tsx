import React, { useEffect, useMemo, useState } from 'react';
import { Database, Save, ShieldCheck } from 'lucide-react';
import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { PromoDataset } from '../domain/types';
import { createManualGroupingSnapshot, type PromoGroupingSnapshot } from '../domain/manual-snapshot';
import { savePromoGroupingSnapshot } from '../shared/master-api';

export function GroupingSnapshotSave({
  dataset,
  quarantine,
  adminKey,
  readOnly,
  onMessage,
  onError,
}: {
  dataset: PromoDataset;
  quarantine: ImportedCardCandidate[];
  adminKey: string;
  readOnly: boolean;
  onMessage: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [savedSignature, setSavedSignature] = useState('');
  const [savedSnapshot, setSavedSnapshot] = useState<PromoGroupingSnapshot | null>(null);
  const signature = useMemo(() => [
    dataset.sourceDataset?.fingerprint || 'unregistered',
    ...dataset.productGroups.map(group => `${group.skuId}:${group.manualConfirmed === true ? 'confirmed' : 'open'}:${group.manualLocked === true ? 'locked' : 'editable'}:${group.cardIds.slice().sort().join(',')}`),
    ...dataset.cards.map(card => `${card.id}:${card.promotionFamilyId || 'pending'}:${card.promotionTiers.map(tier => tier.id || tier.tierNo).join(',')}`),
  ].sort().join('|'), [dataset.productGroups, dataset.cards, dataset.sourceDataset?.fingerprint]);
  useEffect(() => {
    if (savedSignature && savedSignature !== signature) setSavedSignature('');
  }, [signature, savedSignature]);

  const nonMasterGroups = dataset.productGroups.filter(group => !group.skuId.startsWith('MASTER-'));
  const duplicateCards = dataset.cards.length - new Set(dataset.cards.map(card => card.id)).size;
  const unconfirmedGroups = dataset.productGroups.filter(group => (
    group.cardIds.length > 0 && (group.manualConfirmed !== true || group.manualLocked !== true)
  ));
  const pendingPromotions = dataset.cards.filter(card => !card.promotionFamilyId || !card.promotionTiers.length);
  const sourceNotPersisted = !dataset.sourceDataset?.persisted;
  const readyToSave = !readOnly
    && Boolean(adminKey)
    && !sourceNotPersisted
    && dataset.cards.length > 0
    && quarantine.length === 0
    && nonMasterGroups.length === 0
    && duplicateCards === 0
    && unconfirmedGroups.length === 0
    && pendingPromotions.length === 0;

  const save = async () => {
    if (!readyToSave || busy) return;
    if (!window.confirm(`บันทึกการจัดกลุ่ม ${dataset.cards.length} การ์ด จำนวน ${dataset.productGroups.length} กลุ่ม ลงฐานข้อมูลกลางใช่หรือไม่`)) return;
    setBusy(true);
    onError('');
    try {
      const persistedPrevious = dataset.sourceDataset?.snapshotId
        && Number.isInteger(dataset.sourceDataset.snapshotRevision)
        ? {
          snapshotId: dataset.sourceDataset.snapshotId,
          revision: Number(dataset.sourceDataset.snapshotRevision),
        }
        : null;
      const snapshot = createManualGroupingSnapshot(dataset, savedSnapshot || persistedPrevious);
      const result = await savePromoGroupingSnapshot(snapshot, adminKey);
      setSavedSnapshot(result);
      setSavedSignature(signature);
      onMessage(`บันทึก Snapshot revision ${result.revision} แล้ว: ${result.cardCount} การ์ด · ${result.groups.length} กลุ่ม · ${new Date(result.savedAt).toLocaleString('th-TH')}`);
    } catch (error) {
      onError(String((error as Error)?.message || error));
    } finally {
      setBusy(false);
    }
  };

  return <section className="panel grouping-save-panel">
    <div className="grouping-save-copy">
      <div className="grouping-save-icon"><Database size={20} /></div>
      <div>
        <h2>บันทึกการจัดกลุ่มลงฐานกลาง</h2>
        <p>บันทึกได้เมื่อการ์ดครบ ไม่มีรายการรอจัด และทุกกลุ่มผูกกับ Product Master จริง การบันทึกเป็นธุรกรรมเดียวจึงไม่ทิ้งข้อมูลครึ่งชุด</p>
        <div className="grouping-save-status">
          <span>การ์ด {dataset.cards.length}</span>
          <span>กลุ่ม {dataset.productGroups.length}</span>
          <span className={quarantine.length ? 'bad' : 'good'}>รอจัด {quarantine.length}</span>
          <span className={nonMasterGroups.length ? 'bad' : 'good'}>กลุ่มยังไม่บันทึก Master {nonMasterGroups.length}</span>
          <span className={duplicateCards ? 'bad' : 'good'}>การ์ดซ้ำ {duplicateCards}</span>
          <span className={unconfirmedGroups.length ? 'bad' : 'good'}>กลุ่มยังไม่ยืนยัน/ล็อก {unconfirmedGroups.length}</span>
          <span className={pendingPromotions.length ? 'bad' : 'good'}>รอตรวจโปรโมชั่น {pendingPromotions.length}</span>
          <span className={sourceNotPersisted ? 'bad' : 'good'}>Dataset กลาง {sourceNotPersisted ? 'ยังไม่ลงทะเบียน' : `revision ${dataset.sourceDataset?.revision}`}</span>
        </div>
      </div>
    </div>
    <div className="grouping-save-actions">
      {savedSignature === signature && <span className="saved-badge"><ShieldCheck size={15} /> บันทึกชุดนี้แล้ว</span>}
      <button
        data-testid="save-grouping-snapshot"
        className="btn dark"
        disabled={!readyToSave || busy || savedSignature === signature}
        title={!readyToSave ? 'ต้องใช้ Dataset กลาง การ์ดครบ โปรโมชั่นครบ และยืนยันพร้อมล็อกทุกกลุ่ม' : ''}
        onClick={save}
      ><Save size={16} /> {busy ? 'กำลังบันทึก...' : 'บันทึกการจัดกลุ่มทั้งเดือน'}</button>
      {readOnly && <small>โหมด Preview/Dry-run ไม่เขียนฐานข้อมูล</small>}
      {!readOnly && sourceNotPersisted && <small>ต้องโหลด Dataset จากฐานทดสอบที่มี Database Card UUID ก่อน</small>}
      {!readOnly && quarantine.length > 0 && <small>ต้องจัดการ์ดที่เหลือให้หมดก่อน</small>}
      {!readOnly && nonMasterGroups.length > 0 && <small>สร้างหรือเลือก Product Master ให้ครบทุกกลุ่มก่อน</small>}
      {!readOnly && unconfirmedGroups.length > 0 && <small>ต้องกดยืนยันทุกกลุ่มก่อนบันทึกทั้งเดือน</small>}
      {!readOnly && pendingPromotions.length > 0 && <small>ทุกการ์ดต้องเลือกโปรโมชั่นจนไม่เหลือ “รอตรวจโปรโมชั่น”</small>}
    </div>
  </section>;
}
