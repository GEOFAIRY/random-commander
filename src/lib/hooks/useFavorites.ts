import { useCallback, useSyncExternalStore } from 'react';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite as checkIsFavorite,
  clearFavorites,
  type FavoriteEntry,
} from '../favorites';

let listeners: Array<() => void> = [];
let cachedSnapshot: FavoriteEntry[] = [];
const SERVER_SNAPSHOT: FavoriteEntry[] = [];

try {
  cachedSnapshot = getFavorites();
} catch {
  // SSR or localStorage unavailable
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function emitChange() {
  cachedSnapshot = getFavorites();
  for (const listener of listeners) listener();
}

function getSnapshot(): FavoriteEntry[] {
  return cachedSnapshot;
}

function getServerSnapshot(): FavoriteEntry[] {
  return SERVER_SNAPSHOT;
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((entry: FavoriteEntry) => {
    addFavorite(entry);
    emitChange();
  }, []);

  const remove = useCallback((scryfallId: string) => {
    removeFavorite(scryfallId);
    emitChange();
  }, []);

  const isFavorite = useCallback((scryfallId: string) => {
    return checkIsFavorite(scryfallId);
  }, []);

  const clear = useCallback(() => {
    clearFavorites();
    emitChange();
  }, []);

  return { favorites, add, remove, isFavorite, clear } as const;
}
