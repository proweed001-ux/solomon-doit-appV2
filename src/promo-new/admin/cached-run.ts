import { PROMO_TEST_PIPELINE_VERSION } from './test-cache';
import { recoverCachedCardClasses } from '../domain/class-recovery';
import type { VisualProductSignature } from '../domain/visual-product-signatures';
import type { PdfImportResult } from '../import/pdf-importer';

export interface PreparedCachedRun {
  imported: PdfImportResult;
  visualSignatures: Record<string, VisualProductSignature>;
  pipelineVersion: typeof PROMO_TEST_PIPELINE_VERSION;
  warnings: string[];
  changedClasses: number;
  recoveredPages: number;
}

export function currentCachePipelineWarning(): string {
  return `cache:pipeline:${PROMO_TEST_PIPELINE_VERSION}`;
}

function containsFallbackOcrResult(imported: PdfImportResult): boolean {
  return imported.warnings.some(warning => warning.startsWith('adaptive_header_ocr_attempted:'));
}

function validHex(value: unknown): value is string {
  return typeof value === 'string' && value.length >= 64 && value.length % 2 === 0 && /^[0-9a-f]+$/iu.test(value);
}

function validVisualSignature(value: unknown): value is VisualProductSignature {
  if (!value || typeof value !== 'object') return false;
  const signature = value as Partial<VisualProductSignature>;
  return validHex(signature.title)
    && validHex(signature.product)
    && Number.isFinite(signature.quality)
    && Number(signature.quality) > 0;
}

export function visualSignaturesComplete(
  imported: PdfImportResult,
  visualSignatures: Record<string, VisualProductSignature> | null,
): visualSignatures is Record<string, VisualProductSignature> {
  if (!visualSignatures || imported.cards.length === 0) return false;
  return imported.cards.every(card => validVisualSignature(visualSignatures[card.cardId]));
}

export function prepareCachedRun(
  importedInput: PdfImportResult,
  visualSignaturesInput: Record<string, VisualProductSignature>,
): PreparedCachedRun {
  if (containsFallbackOcrResult(importedInput)) {
    throw new Error('cache_reprocess_required_single_pass_ocr');
  }
  const imported: PdfImportResult = {
    ...importedInput,
    cards: importedInput.cards.map(card => ({
      ...card,
      bounds: { ...card.bounds },
      failureReasons: [...card.failureReasons],
    })),
    warnings: [...importedInput.warnings],
  };
  const visualSignatures = { ...visualSignaturesInput };
  const recovery = recoverCachedCardClasses(imported.cards, visualSignatures);
  imported.warnings = [...new Set([...imported.warnings, ...recovery.warnings])];

  return {
    imported,
    visualSignatures,
    pipelineVersion: PROMO_TEST_PIPELINE_VERSION,
    warnings: [
      currentCachePipelineWarning(),
      'cache:ocr_mode:single_pass_only',
      visualSignaturesComplete(imported, visualSignatures)
        ? 'cache:visual_fingerprints_complete'
        : 'cache:visual_fingerprints_missing_rebuild_required',
      `cache:class_recovered_cards:${recovery.changedCards}`,
      `cache:class_recovered_pages:${recovery.recoveredPages}`,
    ],
    changedClasses: recovery.changedCards,
    recoveredPages: recovery.recoveredPages,
  };
}
