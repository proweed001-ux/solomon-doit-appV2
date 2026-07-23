import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import type { GroupingResult } from '../../src/promo-new/domain/grouping';
import {
  attachMasterMatchAuditEvidence,
  attachMasterMatchAuditEvidenceAsync,
  type MasterMatchAuditProgress,
} from '../../src/promo-new/domain/master-match-audit';

test('async Product Master audit yields every 12 groups and preserves sync evidence', async () => {
  const groups = Array.from({ length: 25 }, (_, index) => ({
    id: `group:${index}`,
    sku: { id: `sku:${index}` },
    cardIds: [`card:${index}`],
  }));
  const cards = Array.from({ length: 25 }, (_, index) => ({
    id: `card:${index}`,
    productGroupId: `group:${index}`,
    evidence: {},
  }));
  const base = {
    groups,
    cards,
    skus: [],
    prices: [],
    quarantineCards: [],
    warnings: [],
    diagnostics: { masterText: 0, structuredScope: 0, visualConsensus: 0, exactIdentity: 0, unresolved: 0 },
  } as unknown as GroupingResult;

  const sync = attachMasterMatchAuditEvidence(base, [], [], [], {});
  const progress: MasterMatchAuditProgress[] = [];
  const asyncResult = await attachMasterMatchAuditEvidenceAsync(base, [], [], [], {}, undefined, update => progress.push(update));

  assert.deepEqual(progress, [
    { processed: 12, total: 25 },
    { processed: 24, total: 25 },
    { processed: 25, total: 25 },
  ]);
  assert.deepEqual(asyncResult.cards, sync.cards);
  assert.ok(asyncResult.cards.every(card => card.evidence.masterMatchMethod === 'new_sku'));
});

test('visual-first grouping Worker awaits chunked Product Master audit and forwards progress', () => {
  const worker = readFileSync('src/promo-new/admin/grouping-worker.ts', 'utf8');
  assert.match(worker, /await attachMasterMatchAuditEvidenceAsync\(/u);
  assert.match(worker, /ตรวจชื่อกับ Product Master \$\{state\.processed\}\/\$\{state\.total\} กลุ่ม/u);
  assert.match(worker, /grouping:mode:visual_first_anchored/u);
});
