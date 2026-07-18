import { normalizeProductText } from './sku-identity';

export function normalizeProductOcrText(value: unknown): string {
  return normalizeProductText(value)
    .replace(/เฮด\s*แอน(?:ด์|ด)?\s*โช(?:ว์)?\s*เดอ(?:ร์)?/giu, 'H&S')
    .replace(/แซมพู|แชมพ(?=\s|$)/giu, 'แชมพู')
    .replace(/(\d)[Oo](?=\d|\s*(?:ML|มล\.?|บล\.?|G|กรัม))/giu, (_match, digit: string) => `${digit}0`)
    .replace(/(\d)\s*บล\.?\b/giu, '$1 มล.')
    .replace(/(\d)\s*กรับ\b/giu, '$1 กรัม');
}
