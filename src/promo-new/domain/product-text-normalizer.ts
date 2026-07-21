import { normalizeProductText } from './sku-identity';

export function normalizeProductOcrText(value: unknown): string {
  return normalizeProductText(value)
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:V\s*A|U\s*A|VA|UA|V4|U4)\.?\b/giu, '$1 มล.')
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:กรับ|กรับ\.|กรับฯ)(?=\s|$)/giu, '$1 กรัม')
    .replace(/(?:เฮ|แฮ|เอต)\s*[ก-๙]{0,5}\s*แอน[ก-๙]{0,5}\s*(?:โช|โซ|โธ|โท)ว์?[ก-๙]{0,8}\s*(?:เดอร์|เตอร์|เสอร์|แตอร์)/giu, 'H&S')
    .replace(/เฮด\s*แอน(?:ด์|ด)?\s*โช(?:ว์)?\s*เดอ(?:ร์)?/giu, 'H&S')
    .replace(/แซมพู|แชมพ(?=\s|$)|แมพู|แหมพมู|แตมเพ|แหมเม|แหเมพ|แมเพ/giu, 'แชมพู')
    .replace(/(\d)[Oo](?=\d|\s*(?:ML|มล\.?|บล\.?|G|กรัม))/giu, (_match, digit: string) => `${digit}0`)
    .replace(/(\d)\s*บล\.?(?=\s|$)/giu, '$1 มล.')
    .replace(/(\d)\s*กรับ(?=\s|$)/giu, '$1 กรัม');
}
