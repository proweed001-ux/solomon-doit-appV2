import type { ImportedCardCandidate } from '../import/pdf-importer';
import { PROMO_CLASS_IDS, type PromoClassId } from '../import/class-id';
import type { PromoDataset } from './types';

export interface PageClassAssignmentResult {
  dataset: PromoDataset;
  quarantine: ImportedCardCandidate[];
  changedCards: number;
}

export function assignClassToPage(
  dataset: PromoDataset,
  quarantine: ImportedCardCandidate[],
  page: number,
  classId: PromoClassId,
): PageClassAssignmentResult {
  if (!Number.isInteger(page) || page < 1) throw new Error('เลือกหน้าที่ต้องการแก้ Class');
  if (!PROMO_CLASS_IDS.includes(classId)) throw new Error('Class ที่เลือกไม่ถูกต้อง');

  const pageCards = dataset.cards.filter(card => card.page === page);
  const lockedGroupIds = new Set(dataset.productGroups
    .filter(group => group.manualLocked || group.manualConfirmed)
    .map(group => group.id));
  const lockedCard = pageCards.find(card => card.productGroupId && lockedGroupIds.has(card.productGroupId));
  if (lockedCard) throw new Error('หน้านี้มีการ์ดในกลุ่มที่ล็อกแล้ว ต้องปลดล็อกกลุ่มก่อนแก้ Class');

  const affectedGroupIds = new Set(pageCards.flatMap(card => card.productGroupId ? [card.productGroupId] : []));
  let changedCards = 0;
  const cards = dataset.cards.map(card => {
    if (card.page !== page || card.classId === classId) return card;
    changedCards += 1;
    return {
      ...card,
      classId,
      promotionFamilyId: null,
      promotionTiers: [],
      status: 'need_review' as const,
      failureReasons: [...new Set([
        ...card.failureReasons.filter(reason => reason !== 'class_missing' && !reason.startsWith('promotion_')),
        'promotion_pending_review',
      ])],
    };
  });
  const nextQuarantine = quarantine.map(card => {
    if (card.page !== page || card.classId === classId) return card;
    changedCards += 1;
    return {
      ...card,
      classId,
      failureReasons: card.failureReasons.filter(reason => reason !== 'class_missing'),
    };
  });
  if (!pageCards.length && !quarantine.some(card => card.page === page)) throw new Error(`ไม่พบการ์ดในหน้า ${page}`);

  const groups = dataset.productGroups.map(group => {
    if (!affectedGroupIds.has(group.id)) return group;
    const members = cards.filter(card => card.productGroupId === group.id);
    const families = [...new Set(members.map(card => card.promotionFamilyId).filter((value): value is string => Boolean(value)))];
    return {
      ...group,
      classIds: [...new Set(members.map(card => card.classId).filter(Boolean))].sort(),
      promotionFamilyId: families.length === 1 && members.every(card => card.promotionFamilyId) ? families[0] : null,
      status: 'need_review' as const,
      manualConfirmed: false,
      manualLocked: false,
    };
  });

  return {
    dataset: { ...dataset, cards, productGroups: groups },
    quarantine: nextQuarantine,
    changedCards,
  };
}
