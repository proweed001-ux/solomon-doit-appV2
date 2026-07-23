import type { PromoDataset } from '../domain/types';
import { validateDataset, type ValidationResult } from '../domain/validation';

const unique = (values: string[]): string[] => [...new Set(values)];

export function assertReadyForPublishMultiCard(dataset: PromoDataset): ValidationResult {
  const result = validateDataset(dataset);
  if (dataset.productGroups.some(group => group.status !== 'ready')) result.errors.push('not_all_product_groups_ready');
  if (dataset.cards.some(card => card.status !== 'ready')) result.errors.push('not_all_cards_ready');
  result.errors = unique(result.errors);
  result.ok = result.errors.length === 0;
  return result;
}
