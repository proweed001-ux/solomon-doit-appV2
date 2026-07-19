import { recoverCachedCardClasses } from '../domain/class-recovery';
import type { PdfImportResult } from '../import/pdf-importer';

export interface PreparedCachedRun {
  imported: PdfImportResult;
  visualSignatures: Record<string, string>;
  warnings: string[];
  changedClasses: number;
  recoveredPages: number;
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
    warnings: [
      `cache:class_recovered_cards:${recovery.changedCards}`,
      `cache:class_recovered_pages:${recovery.recoveredPages}`,
    ],
    changedClasses: recovery.changedCards,
    recoveredPages: recovery.recoveredPages,
  };
}
