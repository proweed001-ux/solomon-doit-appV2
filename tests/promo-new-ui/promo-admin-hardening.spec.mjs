import { expect, test } from '@playwright/test';

const DATASET_ID = '10000000-0000-4000-8000-000000000001';
const SNAPSHOT_ID = '20000000-0000-4000-8000-000000000001';
const SKU_ONE = 'MASTER-30000000-0000-4000-8000-000000000001';
const SKU_TWO = 'MASTER-30000000-0000-4000-8000-000000000002';
const CARD_ONE = '40000000-0000-4000-8000-000000000001';
const CARD_TWO = '40000000-0000-4000-8000-000000000002';
const CARD_THREE = '40000000-0000-4000-8000-000000000003';
const CARD_FOUR = '40000000-0000-4000-8000-000000000004';
const FINGERPRINT = 'a'.repeat(64);
const CARD_HASH = 'b'.repeat(64);

const tier = (id, sourceText) => ({
  id,
  tierNo: 1,
  type: 'cash_discount',
  minQuantity: 1,
  maxQuantity: null,
  purchaseUnit: 'ขวด',
  discountPercent: 5,
  freeQuantity: 0,
  rewardUnit: null,
  bundlePrice: null,
  effectivePercent: null,
  effectivePercentUsage: null,
  sourceText,
});

const price = skuId => ({
  skuId,
  pdfSourcePrice: null,
  centralOverridePrice: { amount: 20, currency: 'THB' },
  effectivePrice: { amount: 20, currency: 'THB' },
  source: 'central_override',
  sourceReference: 'e2e-test-database',
  updatedAt: '2026-07-23T00:00:00.000Z',
});

const sku = (id, name) => ({
  id,
  code: id.endsWith('1') ? 'MASTER-ONE' : 'MASTER-TWO',
  canonicalName: name,
  identityKey: `${name}|แชมพู||70|มล.|ขวด|1`,
  identity: {
    brand: name,
    productType: 'แชมพู',
    variant: null,
    sizeValue: 70,
    sizeUnit: 'มล.',
    salesUnit: 'ขวด',
    packQuantity: 1,
  },
  status: 'active',
  evidence: ['playwright-test-database'],
  failureReasons: [],
});

const families = [
  { id: 'family:one', familyKey: 'PF-ONE', name: 'โปรหนึ่ง', scopeText: 'โปรหนึ่ง', sourceRows: [1], tiersByClass: { HFSS: [tier('tier:one:s', '1 ขวด ลด 5%')], HFSM: [tier('tier:one:m', '2 ขวด ลด 8%')] }, failureReasons: [] },
  { id: 'family:two', familyKey: 'PF-TWO', name: 'โปรสอง', scopeText: 'โปรสอง', sourceRows: [2], tiersByClass: { HFSS: [tier('tier:two:s', '1 ขวด ลด 10%')], HFSM: [tier('tier:two:m', '2 ขวด ลด 12%')] }, failureReasons: [] },
  { id: 'family:three', familyKey: 'PF-THREE', name: 'โปรสาม', scopeText: 'โปรสาม', sourceRows: [3], tiersByClass: { HFSS: [tier('tier:three:s', '1 ขวด ลด 15%')], HFSM: [tier('tier:three:m', '2 ขวด ลด 18%')] }, failureReasons: [] },
];

function card(id, groupId, skuId, classId, sequence, familyId) {
  const family = families.find(item => item.id === familyId);
  return {
    id,
    monthKey: 'PROMO-2026-07',
    page: 1,
    sequence,
    classId,
    imageUrl: null,
    skuId,
    productGroupId: groupId,
    promotionFamilyId: familyId,
    promotionTiers: family.tiersByClass[classId],
    price: price(skuId),
    status: 'ready',
    evidence: {
      rawText: `การ์ด ${sequence}`,
      productText: `การ์ด ${sequence}`,
      pageClassText: classId,
      confidence: 1,
      method: 'manual',
      cropBounds: null,
    },
    failureReasons: [],
  };
}

function sourceDataset() {
  const skuOne = sku(SKU_ONE, 'Pantene 70 ml');
  const skuTwo = sku(SKU_TWO, 'Rejoice 70 ml');
  const cards = [
    card(CARD_ONE, 'group:one', SKU_ONE, 'HFSS', 1, 'family:one'),
    card(CARD_TWO, 'group:one', SKU_ONE, 'HFSS', 2, 'family:two'),
    card(CARD_THREE, 'group:two', SKU_TWO, 'HFSM', 3, 'family:one'),
    card(CARD_FOUR, 'group:two', SKU_TWO, 'HFSS', 4, 'family:two'),
  ];
  return {
    schema: 'promo-system-rebuild-v1',
    version: {
      id: '50000000-0000-4000-8000-000000000001',
      monthKey: 'PROMO-2026-07',
      revision: 1,
      status: 'draft',
      previousVersionId: null,
      createdAt: '2026-07-23T00:00:00.000Z',
      createdBy: 'playwright',
      publishedAt: null,
      source: {
        pdfName: 'playwright.pdf',
        workbookName: 'playwright.xlsx',
        pdfHash: FINGERPRINT,
        workbookHash: CARD_HASH,
      },
    },
    sourceDataset: {
      datasetId: DATASET_ID,
      fingerprint: FINGERPRINT,
      revision: 1,
      cardIdsHash: CARD_HASH,
      persisted: true,
      savedAt: '2026-07-23T00:00:00.000Z',
    },
    skus: [skuOne, skuTwo],
    prices: [price(SKU_ONE), price(SKU_TWO)],
    cards,
    productGroups: [
      {
        id: 'group:one',
        monthKey: 'PROMO-2026-07',
        skuId: SKU_ONE,
        sku: skuOne,
        cardIds: [CARD_ONE, CARD_TWO],
        classIds: ['HFSS'],
        promotionFamilyId: null,
        price: price(SKU_ONE),
        status: 'ready',
        failureReasons: [],
        manualConfirmed: false,
        manualLocked: false,
      },
      {
        id: 'group:two',
        monthKey: 'PROMO-2026-07',
        skuId: SKU_TWO,
        sku: skuTwo,
        cardIds: [CARD_THREE, CARD_FOUR],
        classIds: ['HFSM', 'HFSS'],
        promotionFamilyId: null,
        price: price(SKU_TWO),
        status: 'ready',
        failureReasons: [],
        manualConfirmed: false,
        manualLocked: false,
      },
    ],
    promotionFamilies: structuredClone(families),
    warnings: ['playwright_test_database'],
  };
}

const session = {
  accessToken: 'playwright-test-key',
  refreshToken: '',
  expiresIn: 0,
  user: { id: 'PLAYWRIGHT', email: null },
};

async function installTestBackend(page) {
  let savedSnapshot = null;
  let writeCount = 0;
  let unlockWriteCount = 0;
  const pristine = sourceDataset();

  await page.addInitScript(value => {
    sessionStorage.setItem('promo-new-admin-session-v1', JSON.stringify(value));
  }, session);

  await page.route('**/api/promo-legacy-auth?**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const action = url.searchParams.get('action');
    const respond = body => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
    if (action === 'session') return respond({ ok: true, user: { id: 'PLAYWRIGHT', role: 'admin' } });
    if (action === 'master-data') {
      return respond({ ok: true, data: { skus: structuredClone(pristine.skus), prices: structuredClone(pristine.prices) } });
    }
    if (action === 'load-source-dataset') {
      return respond({ ok: true, data: { dataset: structuredClone(pristine), quarantine: [] } });
    }
    if (action === 'load-grouping-snapshot') {
      return respond({ ok: true, data: savedSnapshot ? structuredClone(savedSnapshot) : null });
    }
    if (action === 'save-grouping-snapshot') {
      writeCount += 1;
      const { snapshot } = request.postDataJSON();
      const expected = [CARD_ONE, CARD_TWO, CARD_THREE, CARD_FOUR].sort();
      const actual = snapshot.assignments.map(item => item.cardId).sort();
      const invalid = snapshot.groups.some(group => !group.confirmed || !group.locked)
        || snapshot.assignments.some(item => !item.promotionFamilyId || !item.promotionTierKeys.length)
        || JSON.stringify(actual) !== JSON.stringify(expected);
      if (invalid) {
        return route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ ok: false, error: 'snapshot_card_set_mismatch' }),
        });
      }
      savedSnapshot = {
        ...structuredClone(snapshot),
        snapshotId: snapshot.snapshotId || SNAPSHOT_ID,
        revision: (savedSnapshot?.revision || 0) + 1,
        savedAt: '2026-07-23T02:00:00.000Z',
      };
      return respond({ ok: true, data: structuredClone(savedSnapshot) });
    }
    if (action === 'unlock-grouping-group') {
      unlockWriteCount += 1;
      const input = request.postDataJSON();
      if (!savedSnapshot
        || input.datasetId !== DATASET_ID
        || input.snapshotId !== savedSnapshot.snapshotId
        || input.expectedRevision !== savedSnapshot.revision) {
        return route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({ ok: false, error: 'snapshot_revision_conflict' }),
        });
      }
      savedSnapshot = {
        ...savedSnapshot,
        revision: savedSnapshot.revision + 1,
        savedAt: '2026-07-23T02:01:00.000Z',
        groups: savedSnapshot.groups.map(group => group.groupId === input.groupId
          ? { ...group, confirmed: false, locked: false }
          : group),
      };
      return respond({ ok: true, data: structuredClone(savedSnapshot) });
    }
    if (action === 'logout') return respond({ ok: true });
    return route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false, error: 'action_not_found' }),
    });
  });

  return {
    get writeCount() { return writeCount; },
    get unlockWriteCount() { return unlockWriteCount; },
    get savedSnapshot() { return savedSnapshot; },
  };
}

async function openDataset(page, suffix = '') {
  await page.goto(`/promo-admin-new.html?dataset=${DATASET_ID}${suffix}`);
  await expect(page.getByTestId('target-group-select')).toBeVisible();
  await expect(page.getByText('โหลด Dataset กลาง revision 1')).toBeVisible();
}

async function selectTarget(page, groupId = 'group:one') {
  await page.getByTestId('target-group-select').selectOption(`group:${groupId}`);
  await expect(page.getByTestId('target-group-banner')).toBeVisible();
}

test('runtime supports add, remove, undo, bulk confirm, per-card promo, lock, save and reload', async ({ page }) => {
  const backend = await installTestBackend(page);
  await openDataset(page);
  await selectTarget(page);

  const cardThree = page.getByTestId(`manual-card-${CARD_THREE}`).getByRole('checkbox');
  await cardThree.check();
  await page.getByTestId('move-selected').click();
  await expect(page.getByTestId('target-group-banner')).toContainText('3 การ์ด');

  await page.getByTestId(`manual-card-${CARD_THREE}`).getByRole('checkbox').check();
  await page.getByTestId('remove-selected').click();
  await expect(page.getByText('นำ 1 การ์ดออกจากกลุ่มแล้ว')).toBeVisible();
  await page.getByRole('button', { name: 'ย้อนกลับ' }).click();
  await page.getByRole('button', { name: 'ย้อนกลับ' }).click();

  await selectTarget(page);
  await page.getByTestId(`manual-card-${CARD_THREE}`).getByRole('checkbox').check();
  await page.getByTestId(`manual-card-${CARD_FOUR}`).getByRole('checkbox').check();
  await page.getByTestId('move-selected').click();
  await expect(page.getByTestId('bulk-confirm-dialog')).toContainText('2 การ์ด');
  await expect(page.getByTestId('bulk-confirm-dialog')).toContainText('Rejoice 70 ml');
  await expect(page.getByTestId('bulk-confirm-dialog')).toContainText('Pantene 70 ml');
  await page.getByTestId('confirm-bulk-move').click();
  await expect(page.getByTestId('target-group-banner')).toContainText('4 การ์ด');

  await page.getByTestId(`card-promotion-${CARD_THREE}`).selectOption('family:one');
  await page.getByTestId(`card-promotion-${CARD_FOUR}`).selectOption('family:two');
  await expect(page.getByTestId(`card-promotion-${CARD_ONE}`)).toHaveValue('family:one');
  await expect(page.getByTestId(`card-promotion-${CARD_TWO}`)).toHaveValue('family:two');

  await page.getByRole('button', { name: 'ยืนยันกลุ่ม' }).click();
  await expect(page.getByTestId(`card-promotion-${CARD_ONE}`)).toBeDisabled();
  await expect(page.getByTestId(`manual-card-${CARD_ONE}`).getByRole('checkbox')).toBeDisabled();

  await page.getByRole('button', { name: 'ปลดล็อกกลุ่ม' }).click();
  await page.getByTestId(`card-promotion-${CARD_ONE}`).selectOption('family:three');
  await expect(page.getByTestId(`card-promotion-${CARD_TWO}`)).toHaveValue('family:two');
  await page.getByRole('button', { name: 'ยืนยันกลุ่ม' }).click();

  page.once('dialog', dialog => dialog.accept());
  await page.getByTestId('save-grouping-snapshot').click();
  await expect(page.getByText(/บันทึก Snapshot revision 1 แล้ว/u)).toBeVisible();
  expect(backend.writeCount).toBe(1);
  expect(backend.savedSnapshot.assignments).toHaveLength(4);

  await page.getByRole('button', { name: 'ปลดล็อกกลุ่ม' }).click();
  await expect(page.getByTestId(`card-promotion-${CARD_ONE}`)).toBeEnabled();
  expect(backend.unlockWriteCount).toBe(1);
  await page.getByRole('button', { name: 'ยืนยันกลุ่ม' }).click();
  await expect(page.getByTestId('save-grouping-snapshot')).toBeEnabled();
  page.once('dialog', dialog => dialog.accept());
  await page.getByTestId('save-grouping-snapshot').click();
  await expect(page.getByText(/บันทึก Snapshot revision 3 แล้ว/u)).toBeVisible();
  expect(backend.writeCount).toBe(2);

  await page.reload();
  await expect(page.getByTestId('target-group-select')).toBeVisible();
  await expect(page.getByTestId(`card-promotion-${CARD_ONE}`)).toHaveValue('family:three');
  await expect(page.getByTestId(`card-promotion-${CARD_TWO}`)).toHaveValue('family:two');
  await expect(page.getByTestId(`card-promotion-${CARD_ONE}`)).toBeDisabled();
  await selectTarget(page);
  await expect(page.getByTestId('target-group-banner')).toContainText('กลุ่มยืนยันแล้ว');
  await page.getByRole('button', { name: 'ปลดล็อกกลุ่ม' }).click();
  await expect(page.getByTestId(`card-promotion-${CARD_ONE}`)).toBeEnabled();
  expect(backend.unlockWriteCount).toBe(2);
});

test('dry-run mutates only memory and never calls the snapshot Write API', async ({ page }) => {
  const backend = await installTestBackend(page);
  await openDataset(page, '&dryrun=1');
  await expect(page.getByTestId('dryrun-banner')).toContainText('โหมดทดลอง — ไม่บันทึกฐานข้อมูล');
  await selectTarget(page);
  await page.getByTestId(`manual-card-${CARD_THREE}`).getByRole('checkbox').check();
  await page.getByTestId('move-selected').click();
  await expect(page.getByTestId('target-group-banner')).toContainText('3 การ์ด');
  await expect(page.getByTestId('save-grouping-snapshot')).toBeDisabled();
  expect(backend.writeCount).toBe(0);
  expect(backend.unlockWriteCount).toBe(0);
  expect(backend.savedSnapshot).toBeNull();

  await page.goto(`/promo-admin-new.html?dataset=${DATASET_ID}`);
  await expect(page.getByTestId('target-group-select')).toBeVisible();
  await selectTarget(page);
  await expect(page.getByTestId('target-group-banner')).toContainText('2 การ์ด');
  expect(backend.writeCount).toBe(0);
});
