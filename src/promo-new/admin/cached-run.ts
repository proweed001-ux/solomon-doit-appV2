import { PROMO_TEST_PIPELINE_VERSION } from './test-cache';
import { recoverCachedCardClasses } from '../domain/class-recovery';
import type { PdfImportResult } from '../import/pdf-importer';

export interface PreparedCachedRun {
  imported: PdfImportResult;
  visualSignatures: Record<string, string>;
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

function validVisualSignature(value: unknown): value is string {
  if (typeof value !== 'string' || value.length < 64 || value.length % 2 !== 0) return false;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    const digit = code >= 48 && code <= 57;
    const lowerHex = code >= 97 && code <= 102;
    const upperHex = code >= 65 && code <= 70;
    if (!digit && !lowerHex && !upperHex) return false;
  }
  return true;
}

export function visualSignaturesComplete(
  imported: PdfImportResult,
  visualSignatures: Record<string, string> | null,
): visualSignatures is Record<string, string> {
  if (!visualSignatures || imported.cards.length === 0) return false;
  return imported.cards.every(card => validVisualSignature(visualSignatures[card.cardId]));
}

export function prepareCachedRun(
  importedInput: PdfImportResult,
  visualSignaturesInput: Record<string, string>,
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
      `cache:class_recovered_cards:${recovery.changedCards}`,
      `cache:class_recovered_pages:${recovery.recoveredPages}`,
    ],
    changedClasses: recovery.changedCards,
    recoveredPages: recovery.recoveredPages,
  };
}
