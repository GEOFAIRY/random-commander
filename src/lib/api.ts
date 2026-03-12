import { Card, Edhrec, Filters, PartnerConstraint, detectPartnerConstraint } from '../types';
import { slugify } from './constants';

export class ApiError extends Error {
  service: 'scryfall' | 'edhrec' | 'unknown';
  status: number | undefined;

  constructor(message: string, service: ApiError['service'] = 'unknown', status?: number) {
    super(message);
    this.name = 'ApiError';
    this.service = service;
    this.status = status;
  }
}

// Minimal Scryfall response typings (only fields used by this app)
type ScryfallImageUris = {
  normal?: string;
  [k: string]: unknown;
};

type ScryfallCardFace = {
  image_uris?: ScryfallImageUris;
  [k: string]: unknown;
};

type ScryfallCard = {
  id: string;
  name: string;
  color_identity?: string[];
  image_uris?: ScryfallImageUris;
  layout?: string;
  card_faces?: ScryfallCardFace[];
  type_line?: string;
  oracle_text?: string;
  keywords?: string[];
  [k: string]: unknown;
};

function mapScryfallToCard(data: ScryfallCard): Card {
  return {
    name: data.name,
    scryfallId: data.id,
    imageUrl:
      data.image_uris?.normal ||
      data.card_faces?.[0]?.image_uris?.normal ||
      '',
    type: data.type_line ?? '',
    text: data.oracle_text ?? '',
    faceCount: data.card_faces ? data.card_faces.length : 1,
    keywords: data.keywords ?? [],
    colorIdentity: data.color_identity ?? [],
  };
}

function buildCmcClause(cmcRanges: string[]): string {
  if (cmcRanges.length === 0) return '';
  const cmcClauses = cmcRanges.map((range) => {
    switch (range) {
      case '0-2': return 'cmc<=2';
      case '3-4': return '(cmc>=3+cmc<=4)';
      case '5-6': return '(cmc>=5+cmc<=6)';
      case '7+': return 'cmc>=7';
      default: return '';
    }
  }).filter(Boolean).join('+OR+');
  return cmcClauses ? `+(${cmcClauses})` : '';
}

function buildCommanderQuery(colors: string[], filters?: Filters): string {
  // Exclude Background enchantments — they're the second half of a pair, not primary commanders
  let query = 'is%3Acommander+legal%3Acommander+-t%3ABackground';
  if (colors.length > 0) {
    query += `+id=${colors.join('')}`;
  }
  if (filters) {
    if (filters.types.length > 0) {
      const typeClauses = filters.types.map((t) => `t:${encodeURIComponent(t.trim())}`).join('+OR+');
      query += `+(${typeClauses})`;
    }
    query += buildCmcClause(filters.cmcRanges);
    if (filters.partnerOnly) {
      query += '+is%3Apartner';
    }
  }
  return query;
}

function isValidPartnerPair(
  mainCard: Card,
  partnerCard: Card,
  constraint: PartnerConstraint
): boolean {
  // Never pair a card with itself
  if (partnerCard.name === mainCard.name) return false;

  const partnerConstraint = detectPartnerConstraint(partnerCard);

  switch (constraint.type) {
    case 'none':
      return false;

    case 'partner':
      return partnerConstraint.type === 'partner';

    case 'partner_with':
      return partnerCard.name === constraint.partnerName;

    case 'partner_designator':
      return (
        partnerConstraint.type === 'partner_designator' &&
        partnerConstraint.designator === constraint.designator
      );

    case 'background':
      return partnerCard.type.includes('Background') && partnerCard.type.includes('Enchantment');

    case 'doctors_companion':
      // Main has Doctor's companion — partner must be a Time Lord Doctor
      return partnerCard.type.includes('Time Lord') && partnerCard.type.includes('Doctor');

    case 'doctor':
      // Main is a Doctor — partner must have Doctor's companion
      return partnerConstraint.type === 'doctors_companion';

    default:
      return false;
  }
}

export async function fetchRandomCommanderCard(
  colors: string[] = [],
  filters?: Filters,
  signal?: AbortSignal
): Promise<Card> {
  const query = buildCommanderQuery(colors, filters);
  const res = await fetch(`https://api.scryfall.com/cards/random?q=${query}`, signal ? { signal } : undefined);
  if (!res.ok) throw new ApiError(`Scryfall response ${res.status}`, 'scryfall', res.status);
  const data = (await res.json()) as ScryfallCard;
  return mapScryfallToCard(data);
}

export async function fetchCardById(id: string, signal?: AbortSignal): Promise<Card> {
  const res = await fetch(`https://api.scryfall.com/cards/${encodeURIComponent(id)}`, signal ? { signal } : undefined);
  if (!res.ok) throw new ApiError(`Scryfall response ${res.status}`, 'scryfall', res.status);
  const data = (await res.json()) as ScryfallCard;
  return mapScryfallToCard(data);
}

const BATCH_DELAY_MS = 75;

export async function fetchRandomCommanderCards(
  colors: string[] = [],
  filters?: Filters,
  count: number = 5,
  signal?: AbortSignal
): Promise<Card[]> {
  // Stagger requests to stay within Scryfall's rate limits (~10 req/s)
  const promises = Array.from({ length: count }, (_, i) =>
    new Promise<Card>((resolve, reject) => {
      const timer = setTimeout(
        () => fetchRandomCommanderCard(colors, filters, signal).then(resolve, reject),
        i * BATCH_DELAY_MS
      );
      signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(signal.reason);
      }, { once: true });
    })
  );
  const results = await Promise.allSettled(promises);
  const cards = results
    .filter((r): r is PromiseFulfilledResult<Card> => r.status === 'fulfilled')
    .map((r) => r.value);
  if (cards.length === 0) {
    throw new ApiError('All batch fetches failed', 'scryfall');
  }
  return cards;
}

export async function fetchRandomPartnerCard(
  colors: string[] = [],
  filters?: Filters,
  constraint?: PartnerConstraint,
  mainCard?: Card,
  maxRetries: number = 5,
  signal?: AbortSignal
): Promise<Card | null> {
  // If no constraint, we can't find a valid partner
  if (!constraint || constraint.type === 'none') {
    return null;
  }

  // For "partner with", fetch the specific named card directly — no retries needed
  if (constraint.type === 'partner_with') {
    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(constraint.partnerName)}`,
        signal ? { signal } : undefined
      );
      if (!res.ok) return null;
      const data = (await res.json()) as ScryfallCard;
      return mapScryfallToCard(data);
    } catch {
      return null;
    }
  }

  // Build the partner search query based on constraint type
  let query = 'legal%3Acommander';
  if (constraint.type === 'partner') {
    // Generic Partner only — exclude designator variants, "Partner with", backgrounds, and Doctor's companion
    query += '+keyword%3Apartner+-o%3A%22Partner+with%22+-o%3A%22Partner%E2%80%94%22+-o%3A%22Choose+a+Background%22+-o%3A%22Doctor%27s+companion%22';
  } else if (constraint.type === 'partner_designator') {
    query += `+o:${encodeURIComponent(`"Partner—${constraint.designator}"`)}`;
  } else if (constraint.type === 'background') {
    query = 't%3ABackground+t%3Aenchantment+t%3Alegendary+legal%3Acommander';
  } else if (constraint.type === 'doctors_companion') {
    query = 't%3A%22Time+Lord%22+t%3A%22Doctor%22+legal%3Acommander';
  } else if (constraint.type === 'doctor') {
    // Doctor → find a Doctor's companion card
    query = 'o%3A%22Doctor%27s+companion%22+legal%3Acommander';
  }
  if (mainCard) {
    query += `+-!${encodeURIComponent(`"${mainCard.name}"`)}`;
  }
  if (colors.length > 0) {
    query += `+id=${colors.join('')}`;
  }

  // For deterministic partner types, a single fetch is sufficient
  // since the query is precise. Skip the retry loop to avoid abort-related failures.
  if (constraint.type === 'background' || constraint.type === 'doctors_companion' || constraint.type === 'doctor') {
    try {
      const res = await fetch(`https://api.scryfall.com/cards/random?q=${query}`, signal ? { signal } : undefined);
      if (!res.ok) return null;
      const data = (await res.json()) as ScryfallCard;
      return mapScryfallToCard(data);
    } catch {
      return null;
    }
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(`https://api.scryfall.com/cards/random?q=${query}`, signal ? { signal } : undefined);
      if (!res.ok) throw new ApiError(`Scryfall response ${res.status}`, 'scryfall', res.status);
      const data = (await res.json()) as ScryfallCard;

      const card = mapScryfallToCard(data);

      // Validate the pair if we have the main card
      if (mainCard && !isValidPartnerPair(mainCard, card, constraint)) {
        // Invalid pair, retry
        lastError = new Error('Invalid partner pair');
        continue;
      }

      return card;
    } catch (err) {
      // Abort signals mean the request was intentionally cancelled — stop retrying
      if (signal?.aborted) return null;
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  // Failed all retries
  console.error(`Failed to find valid partner after ${maxRetries} attempts:`, lastError);
  return null;
}

export async function fetchEdhrecByName(name: string, faceCount = 1, signal?: AbortSignal): Promise<Edhrec> {
  const slug = slugify(name, faceCount > 1);
  const url = `https://json.edhrec.com/pages/commanders/${slug}.json`;
  const res = await fetch(url, signal ? { signal } : undefined);
  if (!res.ok) throw new ApiError(`EDHREC response ${res.status}`, 'edhrec', res.status);
  try {
    const data = (await res.json()) as Edhrec;
    return data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ApiError(`Failed to parse EDHREC response: ${message}`, 'edhrec');
  }
}
