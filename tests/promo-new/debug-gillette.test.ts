import test from 'node:test';
import assert from 'node:assert/strict';
import type { PromotionFamily, PromotionTier } from '../../src/promo-new/domain/types';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { buildProductScopes, resolveStructuredScope } from '../../src/promo-new/domain/scope-matcher';
import { groupImportedCards } from '../../src/promo-new/domain/grouping';
import { makeCardId } from '../../src/promo-new/import/card-id';

const MONTH = 'PROMO-2026-07';
const CLASS = 'HFSL';
const tier: PromotionTier = { tierNo: 1, type: 'cash_discount', minQuantity: 6, maxQuantity: null, purchaseUnit: 'ชิ้น', discountPercent: 10, freeQuantity: 0, rewardUnit: null, bundlePrice: null, effectivePercent: null, effectivePercentUsage: null, sourceText: 'ซื้อ 6 ลด 10%' };
const family = (id: string, scopeText: string): PromotionFamily => ({ id, familyKey: id.toUpperCase(), name: scopeText, scopeText, sourceRows: [1], tiersByClass: { [CLASS]: [tier] }, failureReasons: [] });
const imported = (text: string, sequence: number): ImportedCardCandidate => ({ cardId: makeCardId(MONTH, CLASS, 1, sequence), monthKey: MONTH, page: 1, sequence, classId: CLASS, imageUrl: '', rawText: text, productText: text, pageClassText: CLASS, confidence: 0.95, evidenceMethod: 'page_ocr', bounds: { x: 0, y: 0, width: 100, height: 100 }, failureReasons: [] });

test('diagnose Gillette scopes', () => {
  const families = [family('blade', 'ยิลเลตต์ ใบมีด ซุปเปอร์ธิน'), family('two', 'ยิลเลตต์ ซุปเปอร์ธิน ทู รุ่นแผง')];
  const cards = [imported('GILLETTE ใบมีด ซุปเปอร์ธิน', 1), imported('GILLETTE ซุปเปอร์ธิน ทู รุ่นแผง', 2)];
  const scopes = buildProductScopes(families);
  const resolutions = cards.map(card => resolveStructuredScope(card, scopes));
  const grouped = groupImportedCards(MONTH, cards, [], [], families);
  console.error('GILLETTE_DIAGNOSTICS', JSON.stringify({ scopes, resolutions, diagnostics: grouped.diagnostics, warnings: grouped.warnings, quarantine: grouped.quarantineCards.map(card => ({ id: card.cardId, reasons: card.failureReasons })) }));
  assert.equal(scopes.length, 2);
});
