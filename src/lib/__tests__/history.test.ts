import { describe, it, expect, beforeEach } from 'vitest';
import { getHistory, addToHistory, clearHistory, type HistoryEntry } from '../history';

beforeEach(() => {
  localStorage.clear();
});

const entry: HistoryEntry = {
  name: 'Atraxa, Praetors Voice',
  scryfallId: 'abc-123',
  imageUri: 'https://cards.scryfall.io/normal/front/a/1/a1.jpg',
  colorIdentity: ['W', 'U', 'B', 'G'],
  timestamp: Date.now(),
};

describe('getHistory', () => {
  it('returns empty array when no history', () => {
    expect(getHistory()).toEqual([]);
  });

  it('returns empty array on corrupted data', () => {
    localStorage.setItem('edh-history', 'not-json');
    expect(getHistory()).toEqual([]);
  });
});

describe('addToHistory', () => {
  it('adds an entry', () => {
    addToHistory(entry);
    const history = getHistory();
    expect(history).toHaveLength(1);
    expect(history[0]!.name).toBe('Atraxa, Praetors Voice');
  });

  it('puts newest entry first', () => {
    const older = { ...entry, name: 'Older', scryfallId: 'old-1', timestamp: 1 };
    const newer = { ...entry, name: 'Newer', scryfallId: 'new-1', timestamp: 2 };
    addToHistory(older);
    addToHistory(newer);
    expect(getHistory()[0]!.name).toBe('Newer');
  });

  it('deduplicates by scryfallId, moving to front', () => {
    addToHistory({ ...entry, timestamp: 1 });
    addToHistory({ ...entry, name: 'Same Card Again', timestamp: 2 });
    const history = getHistory();
    expect(history).toHaveLength(1);
    expect(history[0]!.timestamp).toBe(2);
  });

  it('caps at 20 entries', () => {
    for (let i = 0; i < 25; i++) {
      addToHistory({ ...entry, scryfallId: `id-${i}`, timestamp: i });
    }
    expect(getHistory()).toHaveLength(20);
  });

  it('drops oldest when capped', () => {
    for (let i = 0; i < 25; i++) {
      addToHistory({ ...entry, scryfallId: `id-${i}`, timestamp: i });
    }
    const history = getHistory();
    expect(history.find((e) => e.scryfallId === 'id-0')).toBeUndefined();
    expect(history[history.length - 1]!.scryfallId).toBe('id-5');
  });
});

describe('clearHistory', () => {
  it('clears all entries', () => {
    addToHistory(entry);
    clearHistory();
    expect(getHistory()).toEqual([]);
  });
});
