export function makeCardId(): string {
  if (typeof crypto === 'undefined' || typeof crypto.randomUUID !== 'function') {
    throw new Error('stable_card_uuid_unavailable');
  }
  return crypto.randomUUID();
}
