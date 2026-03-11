import { useCallback, useSyncExternalStore } from 'react';
import { getHistory, addToHistory, clearHistory, type HistoryEntry } from '../history';

let listeners: Array<() => void> = [];
let cachedSnapshot: HistoryEntry[] = getHistory();
const SERVER_SNAPSHOT: HistoryEntry[] = [];

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function emitChange() {
  cachedSnapshot = getHistory();
  for (const listener of listeners) listener();
}

function getSnapshot(): HistoryEntry[] {
  return cachedSnapshot;
}

function getServerSnapshot(): HistoryEntry[] {
  return SERVER_SNAPSHOT;
}

export function useHistory() {
  const history = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((entry: HistoryEntry) => {
    addToHistory(entry);
    emitChange();
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    emitChange();
  }, []);

  return { history, add, clear } as const;
}
