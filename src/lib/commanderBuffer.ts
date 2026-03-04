import { fetchRandomCommanderCards, fetchEdhrecByName } from './api';
import type { Card, Edhrec } from '../types';

export type BufferedEntry = {
  card: Card;
  edhrec: Edhrec | null;
};

const BATCH_SIZE = 5;
const REFILL_THRESHOLD = 3;

let queue: BufferedEntry[] = [];
let filterKey = '';
let refillInFlight: Promise<void> | null = null;
let generation = 0;
let abortController = new AbortController();

function colorsToKey(colors: string[]): string {
  return [...colors].sort().join(',');
}

export function clearBuffer(): void {
  abortController.abort();
  abortController = new AbortController();
  queue = [];
  filterKey = '';
  refillInFlight = null;
  generation++;
}

async function fetchEdhrec(card: Card, signal: AbortSignal): Promise<Edhrec | null> {
  try {
    return await fetchEdhrecByName(card.name, card.faceCount ?? 1, signal);
  } catch {
    return null;
  }
}

async function refill(colors: string[], signal: AbortSignal): Promise<void> {
  const gen = generation;
  filterKey = colorsToKey(colors);

  const cards = await fetchRandomCommanderCards(colors, BATCH_SIZE, signal);

  // Discard results if generation changed (filters changed mid-fetch)
  if (generation !== gen) return;

  // Deduplicate against cards already in queue
  const existingNames = new Set(queue.map((e) => e.card.name));
  const uniqueCards = cards.filter((c) => {
    if (existingNames.has(c.name)) return false;
    existingNames.add(c.name);
    return true;
  });

  // Add cards to queue immediately with edhrec: null
  const entries: BufferedEntry[] = uniqueCards.map((card) => ({ card, edhrec: null }));
  queue.push(...entries);

  // Fire off EDHREC fetches in background — mutate entries in-place as they resolve
  for (const entry of entries) {
    fetchEdhrec(entry.card, signal).then((edhrec) => {
      if (generation !== gen) return;
      const queueIndex = queue.indexOf(entry);
      if (queueIndex !== -1) {
        queue[queueIndex] = { ...entry, edhrec };
      }
    });
  }
}

function triggerBackgroundRefill(colors: string[]): void {
  if (refillInFlight) return;
  const signal = abortController.signal;
  refillInFlight = refill(colors, signal).finally(() => {
    refillInFlight = null;
  });
}

export async function popEntry(colors: string[]): Promise<BufferedEntry | null> {
  const key = colorsToKey(colors);

  // If filters changed, the buffer is stale
  if (key !== filterKey) {
    queue = [];
  }

  const signal = abortController.signal;

  // Only block if the queue is completely empty
  if (queue.length === 0) {
    if (refillInFlight) {
      // A refill is already running — wait for it instead of starting a second one
      await refillInFlight;
    }
    // If still empty after awaiting, start a fresh refill
    if (queue.length === 0) {
      await refill(colors, signal);
    }
  }

  const entry = queue.shift() ?? null;

  // Trigger background refill when running low (never blocks the pop)
  if (queue.length < REFILL_THRESHOLD) {
    triggerBackgroundRefill(colors);
  }

  // If EDHREC data hasn't resolved yet (first card after a fresh refill), fetch inline
  if (entry && !entry.edhrec) {
    entry.edhrec = await fetchEdhrec(entry.card, signal);
  }

  return entry;
}
