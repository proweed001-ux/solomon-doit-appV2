import React, { useEffect, useMemo, useState } from 'react';
import { Database, Save, ShieldCheck } from 'lucide-react';
import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { PromoDataset } from '../domain/types';
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
  const signature = useMemo(() => dataset.productGroups
    .map(group => `${group.skuId}:${group.cardIds.slice().sort().join(',')}`)
    .sort()
    .join('|'), [dataset.productGroups]);
  useEffect(() => {
    if (savedSignature && savedSignature !== signature) setSavedSignature('');
  }, [signature, savedSignature]);

  const nonMasterGroups = dataset.productGroups.filter(group => !group.skuId.startsWith('MASTER-'));
  const duplicateCards = dataset.cards.length - new Set(dataset.cards.map(card => card.id)).size;
  const readyToSave = !readOnly
    && Boolean(adminKey)
    && dataset.cards.length > 0
    && quarantine.length === 0
    && nonMasterGroups.length === 0
    && duplicateCards === 0;

  const save = async () => {
    if (!readyToSave || busy) return;
    if (!window.confirm(`บันทึกการจัดกลุ่ม ${dataset.cards.length} การ์ด จำนวน ${dataset.productGroups.length} กลุ่ม ลงฐานข้อมูลกลางใช่หรือไม่`)) return;
    setBusy(true);
    onError('');
    try {
      const result = await savePromoGroupingSnapshot(dataset, adminKey);
      setSavedSignature(signature);
      onMessage(`บันทึกการจัดกลุ่มลงฐานกลางแล้ว: ${result.cardCount} การ์ด · ${result.groupCount} กลุ่ม · เดือน ${result.promoMonthId}`);
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
        </div>
      </div>
    </div>
    <div className="grouping-save-actions">
      {savedSignature === signature && <span className="saved-badge"><ShieldCheck size={15} /> บันทึกชุดนี้แล้ว</span>}
      <button className="btn dark" disabled={!readyToSave || busy || savedSignature === signature} onClick={save}><Save size={16} /> {busy ? 'กำลังบันทึก...' : 'บันทึกการจัดกลุ่มทั้งเดือน'}</button>
      {readOnly && <small>โหมด Preview/Dry-run ไม่เขียนฐานข้อมูล</small>}
      {!readOnly && quarantine.length > 0 && <small>ต้องจัดการ์ดที่เหลือให้หมดก่อน</small>}
      {!readOnly && nonMasterGroups.length > 0 && <small>สร้างหรือเลือก Product Master ให้ครบทุกกลุ่มก่อน</small>}
    </div>
  </section>;
}
