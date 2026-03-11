import { describe, it, expect, beforeEach } from 'vitest';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  clearFavorites,
  type FavoriteEntry,
} from '../favorites';

beforeEach(() => {
  localStorage.clear();
});

const entry: FavoriteEntry = {
  name: 'Atraxa, Praetors Voice',
  scryfallId: 'abc-123',
  imageUri: 'https://cards.scryfall.io/normal/front/a/1/a1.jpg',
  colorIdentity: ['W', 'U', 'B', 'G'],
  timestamp: Date.now(),
};

describe('getFavorites', () => {
  it('returns empty array when no favorites', () => {
    expect(getFavorites()).toEqual([]);
  });

  it('returns empty array on corrupted data', () => {
    localStorage.setItem('edh-favorites', 'not-json');
    expect(getFavorites()).toEqual([]);
  });
});

describe('addFavorite', () => {
  it('adds an entry', () => {
    addFavorite(entry);
    expect(getFavorites()).toHaveLength(1);
    expect(getFavorites()[0]!.name).toBe('Atraxa, Praetors Voice');
  });

  it('puts newest entry first', () => {
    const a = { ...entry, name: 'A', scryfallId: 'a', timestamp: 1 };
    const b = { ...entry, name: 'B', scryfallId: 'b', timestamp: 2 };
    addFavorite(a);
    addFavorite(b);
    expect(getFavorites()[0]!.name).toBe('B');
  });

  it('does not duplicate by scryfallId', () => {
    addFavorite(entry);
    addFavorite({ ...entry, timestamp: 999 });
    expect(getFavorites()).toHaveLength(1);
  });

  it('has no cap on entries', () => {
    for (let i = 0; i < 50; i++) {
      addFavorite({ ...entry, scryfallId: `id-${i}`, timestamp: i });
    }
    expect(getFavorites()).toHaveLength(50);
  });
});

describe('removeFavorite', () => {
  it('removes by scryfallId', () => {
    addFavorite(entry);
    removeFavorite(entry.scryfallId);
    expect(getFavorites()).toEqual([]);
  });

  it('does nothing if not found', () => {
    addFavorite(entry);
    removeFavorite('nonexistent');
    expect(getFavorites()).toHaveLength(1);
  });
});

describe('isFavorite', () => {
  it('returns true when favorited', () => {
    addFavorite(entry);
    expect(isFavorite(entry.scryfallId)).toBe(true);
  });

  it('returns false when not favorited', () => {
    expect(isFavorite('nonexistent')).toBe(false);
  });
});

describe('clearFavorites', () => {
  it('clears all entries', () => {
    addFavorite(entry);
    clearFavorites();
    expect(getFavorites()).toEqual([]);
  });
});
