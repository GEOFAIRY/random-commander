import { fetchRandomCommanderCards, fetchEdhrecByName } from './api';
import type { Card, Edhrec } from '../types';

export type BufferedEntry = {
  card: Card;
  edhrec: Edhrec | null;
};

const BATCH_SIZE = 10;
const REFILL_THRESHOLD = 3;

let queue: BufferedEntry[] = [];
let filterKey = '';
let refillInFlight: Promise<void> | null = null;

function colorsToKey(colors: string[]): string {
  return [...colors].sort().join(',');
}

export function clearBuffer(): void {
  queue = [];
  filterKey = '';
  refillInFlight = null;
}

async function fetchEdhrec(card: Card): Promise<Edhrec | null> {
  try {
    return await fetchEdhrecByName(card.name, card.faceCount ?? 1);
  } catch {
    return null;
  }
}

export async function refill(colors: string[]): Promise<void> {
  const key = colorsToKey(colors);
  filterKey = key;

  const cards = await fetchRandomCommanderCards(colors, BATCH_SIZE);

  // Discard results if filters changed while fetching
  if (colorsToKey(colors) !== filterKey) return;

  // Add cards to queue immediately with edhrec: null
  const entries: BufferedEntry[] = cards.map((card) => ({ card, edhrec: null }));
  queue.push(...entries);

  // Fire off EDHREC fetches in background — mutate entries in-place as they resolve
  for (const entry of entries) {
    fetchEdhrec(entry.card).then((edhrec) => {
      // Only update if the entry is still in the queue (not yet popped)
      const queueIndex = queue.indexOf(entry);
      if (queueIndex !== -1 && colorsToKey(colors) === filterKey) {
        queue[queueIndex] = { ...entry, edhrec };
      }
    });
  }
}

function triggerBackgroundRefill(colors: string[]): void {
  if (refillInFlight) return;
  refillInFlight = refill(colors).finally(() => {
    refillInFlight = null;
  });
}

export async function popEntry(colors: string[]): Promise<BufferedEntry | null> {
  const key = colorsToKey(colors);

  // If filters changed, the buffer is stale
  if (key !== filterKey) {
    queue = [];
  }

  if (queue.length === 0) {
    await refill(colors);
  }

  const entry = queue.shift() ?? null;

  // Trigger background refill when running low
  if (queue.length < REFILL_THRESHOLD) {
    triggerBackgroundRefill(colors);
  }

  return entry;
}
