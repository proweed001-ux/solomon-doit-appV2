export const PROMO_CLASS_IDS = ['HFSS', 'HFSM', 'HFSL', 'HFSXL', 'HFSWS-S', 'HFSWS-L'] as const;
export type PromoClassId = typeof PROMO_CLASS_IDS[number];

export interface ClassTextEvidence {
  classId: PromoClassId | null;
  confidence: number;
  token: string | null;
  method: 'exact' | 'ocr_alias' | 'fuzzy' | 'missing';
  scores: Record<PromoClassId, number>;
  rawText: string;
}

export interface PageClassObservation {
  page: number;
  texts: unknown[];
  headerColor?: [number, number, number] | null;
  hasCards?: boolean;
}

export interface ResolvedPageClass {
  page: number;
  classId: PromoClassId | null;
  confidence: number;
  method: 'exact' | 'ocr_alias' | 'fuzzy' | 'sequence' | 'sequence_override' | 'missing';
  rawText: string;
  token: string | null;
}

const clean = (value: unknown): string => String(value || '')
  .normalize('NFKC')
  .toUpperCase()
  .replace(/[—–−]/gu, '-')
  .replace(/\s+/g, ' ')
  .trim();

const emptyScores = (): Record<PromoClassId, number> => ({
  HFSS: 0,
  HFSM: 0,
  HFSL: 0,
  HFSXL: 0,
  'HFSWS-S': 0,
  'HFSWS-L': 0,
});

const compactClass = (value: unknown): string => clean(value).replace(/[^A-Z0-9]/g, '');

const CANONICAL_COMPACT: Record<PromoClassId, string> = {
  HFSS: 'HFSS',
  HFSM: 'HFSM',
  HFSL: 'HFSL',
  HFSXL: 'HFSXL',
  'HFSWS-S': 'HFSWSS',
  'HFSWS-L': 'HFSWSL',
};

const OCR_ALIASES: Record<PromoClassId, string[]> = {
  HFSS: ['HFSS', 'HFS5'],
  HFSM: ['HFSM', 'HFSWH', 'HFSH', 'HFSN', 'HFSIV', 'HFSRN', 'HFSW'],
  HFSL: ['HFSL', 'HFSI', 'HFS1'],
  HFSXL: ['HFSXL', 'HFSX1', 'HFSXI'],
  'HFSWS-S': ['HFSWSS', 'HFSWS5', 'HFSW5S', 'HFSWHSS', 'HFSWSSS'],
  'HFSWS-L': ['HFSWSL', 'HFSWS1', 'HFSWSI', 'HFSWHSL'],
};

function levenshtein(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

function addScore(scores: Record<PromoClassId, number>, classId: PromoClassId, score: number): void {
  scores[classId] = Math.max(scores[classId], Math.max(0, Math.min(1, score)));
}

function extractTokens(rawText: string): string[] {
  const compact = compactClass(rawText);
  const tokens = new Set<string>();
  for (const match of compact.matchAll(/HFS[A-Z0-9]{1,5}/g)) tokens.add(match[0]);
  if (/^(?:HFS)?(?:S|M|L|XL|WSS|WSL|WH|H|N|IV)$/u.test(compact)) tokens.add(compact.startsWith('HFS') ? compact : `HFS${compact}`);
  const contextual = clean(rawText).match(/(?:CLASS|กลุ่ม|ระดับ|ร้าน)\s*[:=-]?\s*(S|M|L|XL|WS[- ]?S|WS[- ]?L|WH|H|N|IV)\b/u)?.[1];
  if (contextual) tokens.add(`HFS${compactClass(contextual)}`);
  return [...tokens];
}

function scoreToken(token: string, scores: Record<PromoClassId, number>): { token: string; method: 'exact' | 'ocr_alias' | 'fuzzy' } {
  for (const classId of PROMO_CLASS_IDS) {
    if (token === CANONICAL_COMPACT[classId]) {
      addScore(scores, classId, 1);
      return { token, method: 'exact' };
    }
  }
  for (const classId of PROMO_CLASS_IDS) {
    const aliasIndex = OCR_ALIASES[classId].indexOf(token);
    if (aliasIndex >= 0) {
      const score = token === 'HFSW' ? 0.74 : token === 'HFSWH' ? 0.93 : 0.9;
      addScore(scores, classId, score);
      if (token === 'HFSW') {
        addScore(scores, 'HFSWS-S', 0.5);
        addScore(scores, 'HFSWS-L', 0.5);
      }
      return { token, method: 'ocr_alias' };
    }
  }
  for (const classId of PROMO_CLASS_IDS) {
    const canonical = CANONICAL_COMPACT[classId];
    const distance = levenshtein(token, canonical);
    const similarity = 1 - distance / Math.max(token.length, canonical.length);
    if (similarity >= 0.55) addScore(scores, classId, similarity * 0.86);
  }
  return { token, method: 'fuzzy' };
}

export function classifyClassText(values: unknown | unknown[]): ClassTextEvidence {
  const inputs = (Array.isArray(values) ? values : [values]).map(clean).filter(Boolean);
  const rawText = inputs.join(' | ');
  const scores = emptyScores();
  let bestToken: string | null = null;
  let bestTokenMethod: 'exact' | 'ocr_alias' | 'fuzzy' = 'fuzzy';

  for (const input of inputs) {
    for (const token of extractTokens(input)) {
      const before = Math.max(...Object.values(scores));
      const scored = scoreToken(token, scores);
      const after = Math.max(...Object.values(scores));
      if (after > before) {
        bestToken = token;
        bestTokenMethod = scored.method;
      }
    }
  }

  const ranked = PROMO_CLASS_IDS
    .map(classId => ({ classId, score: scores[classId] }))
    .sort((left, right) => right.score - left.score || PROMO_CLASS_IDS.indexOf(left.classId) - PROMO_CLASS_IDS.indexOf(right.classId));
  const best = ranked[0];
  const second = ranked[1];
  const margin = best.score - second.score;
  const accepted = best.score >= 0.72 && (best.score >= 0.9 || margin >= 0.12);
  return {
    classId: accepted ? best.classId : null,
    confidence: Number((accepted ? Math.min(1, best.score * 0.82 + Math.max(0, margin) * 0.35) : best.score).toFixed(3)),
    token: bestToken,
    method: accepted ? bestTokenMethod : best.score > 0 ? 'fuzzy' : 'missing',
    scores,
    rawText,
  };
}

export function normalizeClassId(value: string): string | null {
  return classifyClassText(value).classId;
}

function colorDistance(left?: [number, number, number] | null, right?: [number, number, number] | null): number | null {
  if (!left || !right) return null;
  const distance = Math.sqrt(
    (left[0] - right[0]) ** 2
    + (left[1] - right[1]) ** 2
    + (left[2] - right[2]) ** 2,
  );
  return distance / 441.673;
}

function transitionScore(previous: number, current: number, colorChange: number | null): number {
  const delta = current - previous;
  if (delta < 0) return -24 - Math.abs(delta) * 4;
  let score = delta === 0 ? 1.8 : delta === 1 ? 0.8 : -3.5 * delta;
  if (colorChange != null) {
    if (colorChange <= 0.08) score += delta === 0 ? 2.2 : -1.4;
    else if (colorChange >= 0.18) score += delta === 0 ? -2.8 : delta === 1 ? 2.4 : 0;
  }
  return score;
}

export function resolvePageClassSequence(observations: PageClassObservation[]): ResolvedPageClass[] {
  if (!observations.length) return [];
  const evidence = observations.map(observation => classifyClassText(observation.texts));
  const hasAnchor = evidence.some(item => item.classId && item.confidence >= 0.78);
  if (!hasAnchor) return observations.map((observation, index) => ({
    page: observation.page,
    classId: evidence[index].classId,
    confidence: evidence[index].confidence,
    method: evidence[index].method,
    rawText: evidence[index].rawText,
    token: evidence[index].token,
  }));

  const stateCount = PROMO_CLASS_IDS.length;
  const dp = observations.map(() => Array(stateCount).fill(Number.NEGATIVE_INFINITY));
  const parent = observations.map(() => Array(stateCount).fill(-1));
  for (let state = 0; state < stateCount; state += 1) {
    dp[0][state] = evidence[0].scores[PROMO_CLASS_IDS[state]] * 13 - state * 1.2;
  }
  for (let pageIndex = 1; pageIndex < observations.length; pageIndex += 1) {
    const distance = colorDistance(observations[pageIndex - 1].headerColor, observations[pageIndex].headerColor);
    for (let state = 0; state < stateCount; state += 1) {
      const emission = evidence[pageIndex].scores[PROMO_CLASS_IDS[state]] * 13;
      for (let previous = 0; previous < stateCount; previous += 1) {
        const score = dp[pageIndex - 1][previous] + transitionScore(previous, state, distance) + emission;
        if (score > dp[pageIndex][state]) {
          dp[pageIndex][state] = score;
          parent[pageIndex][state] = previous;
        }
      }
    }
  }

  let state = dp[dp.length - 1].reduce((best, score, index, values) => score > values[best] ? index : best, 0);
  const states = Array(observations.length).fill(0);
  for (let pageIndex = observations.length - 1; pageIndex >= 0; pageIndex -= 1) {
    states[pageIndex] = state;
    state = parent[pageIndex][state] >= 0 ? parent[pageIndex][state] : state;
  }

  return observations.map((observation, index) => {
    const direct = evidence[index];
    const resolved = PROMO_CLASS_IDS[states[index]];
    if (direct.classId === resolved) return {
      page: observation.page,
      classId: resolved,
      confidence: direct.confidence,
      method: direct.method,
      rawText: direct.rawText,
      token: direct.token,
    };
    const previousSame = index > 0 && states[index - 1] === states[index];
    const nextSame = index + 1 < states.length && states[index + 1] === states[index];
    const neighborSupport = previousSame || nextSame;
    const directStrongConflict = Boolean(direct.classId && direct.confidence >= 0.9);
    if (directStrongConflict || (!direct.classId && !neighborSupport && !observation.hasCards)) return {
      page: observation.page,
      classId: direct.classId,
      confidence: direct.confidence,
      method: direct.method,
      rawText: direct.rawText,
      token: direct.token,
    };
    return {
      page: observation.page,
      classId: resolved,
      confidence: Number(Math.max(0.68, Math.min(0.88, (direct.scores[resolved] || 0) * 0.55 + (neighborSupport ? 0.32 : 0.18))).toFixed(3)),
      method: direct.classId ? 'sequence_override' : 'sequence',
      rawText: direct.rawText,
      token: direct.token,
    };
  });
}
