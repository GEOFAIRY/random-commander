import { Card, Edhrec, PartnerConstraint, detectPartnerConstraint } from '../types';
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
  name: string;
  image_uris?: ScryfallImageUris;
  layout?: string;
  card_faces?: ScryfallCardFace[];
  type_line?: string;
  oracle_text?: string;
  keywords?: string[];
  [k: string]: unknown;
};

export function mapScryfallToCard(data: ScryfallCard): Card {
  return {
    name: data.name,
    imageUrl:
      data.image_uris?.normal ||
      data.card_faces?.[0]?.image_uris?.normal ||
      '',
    type: data.type_line ?? '',
    text: data.oracle_text ?? '',
    faceCount: data.card_faces ? data.card_faces.length : 1,
    keywords: data.keywords ?? [],
  };
}

function buildCommanderQuery(colors: string[]): string {
  let query = 'is%3Acommander+legal%3Acommander';
  if (colors.length > 0) {
    query += `+id=${colors.join('')}`;
  }
  return query;
}

function isValidPartnerPair(
  mainCard: Card,
  partnerCard: Card,
  constraint: PartnerConstraint
): boolean {
  const partnerConstraint = detectPartnerConstraint(partnerCard);

  switch (constraint.type) {
    case 'none':
      // Main card has no partner ability, invalid
      return false;

    case 'partner':
      // Both must have "partner" keyword
      return partnerConstraint.type === 'partner';

    case 'partner_with':
      // Partner card must have the exact same "partner with" pointing back to main card
      return (
        partnerConstraint.type === 'partner_with' && partnerConstraint.partnerName === mainCard.name
      );

    case 'partner_designator':
      // Partner card must have the same designator
      return (
        partnerConstraint.type === 'partner_designator' &&
        partnerConstraint.designator === constraint.designator
      );

    case 'background':
      // Partner must be a Background enchantment
      return partnerCard.type.includes('Background') && partnerCard.type.includes('Enchantment');

    case 'doctors_companion':
      // Partner must be a Doctor's companion card
      return partnerConstraint.type === 'doctors_companion';

    default:
      return false;
  }
}

export async function fetchRandomCommanderCard(colors: string[] = []): Promise<Card> {
  const query = buildCommanderQuery(colors);
  const res = await fetch(`https://api.scryfall.com/cards/random?q=${query}`);
  if (!res.ok) throw new ApiError(`Scryfall response ${res.status}`, 'scryfall', res.status);
  const data = (await res.json()) as ScryfallCard;
  return mapScryfallToCard(data);
}

const BATCH_DELAY_MS = 75;

export async function fetchRandomCommanderCards(
  colors: string[] = [],
  count: number = 5
): Promise<Card[]> {
  // Stagger requests to stay within Scryfall's rate limits (~10 req/s)
  const promises = Array.from({ length: count }, (_, i) =>
    new Promise<Card>((resolve, reject) => {
      setTimeout(() => fetchRandomCommanderCard(colors).then(resolve, reject), i * BATCH_DELAY_MS);
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
  constraint?: PartnerConstraint,
  mainCard?: Card,
  maxRetries: number = 5
): Promise<Card | null> {
  // If no constraint, we can't find a valid partner
  if (!constraint || constraint.type === 'none') {
    return null;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      let query = 'is%3Acommander+legal%3Acommander';

      // Build query based on partner constraint
      if (constraint.type === 'partner') {
        // Generic partner - fetch any partner card
        query += '+is%3Apartner+o:%22Partner%22';
      } else if (constraint.type === 'partner_with') {
        // Partner with specific card
        query += `+o:${encodeURIComponent(`"Partner with ${constraint.partnerName}"`)}`;
      } else if (constraint.type === 'partner_designator') {
        // Partner designator - search for cards with the same designator in text
        query += `+o:${encodeURIComponent(`"Partner—${constraint.designator}"`)}`;
      } else if (constraint.type === 'background') {
        // Choose a Background - fetch a Background enchantment
        query = 't%3ABackground+is%3Aenchantment+is%3Alegendary+legal%3Acommander';
      } else if (constraint.type === 'doctors_companion') {
        // Doctor's companion - fetch a Time Lord card with Doctor in type
        query = 'o:%22Doctor%27s+companion%22+legal%3Acommander';
      }

      // Add color filter if provided
      if (colors.length > 0) {
        query += `+id=${colors.join('')}`;
      }

      const res = await fetch(`https://api.scryfall.com/cards/random?q=${query}`);
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
      lastError = err instanceof Error ? err : new Error(String(err));
      // Continue to next attempt
    }
  }

  // Failed all retries
  console.error(`Failed to find valid partner after ${maxRetries} attempts:`, lastError);
  return null;
}

export async function fetchEdhrecByName(name: string, faceCount = 1): Promise<Edhrec> {
  const slug = slugify(name, faceCount > 1);
  const url = `https://json.edhrec.com/pages/commanders/${slug}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new ApiError(`EDHREC response ${res.status}`, 'edhrec', res.status);
  try {
    const data = (await res.json()) as Edhrec;
    return data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ApiError(`Failed to parse EDHREC response: ${message}`, 'edhrec');
  }
}
