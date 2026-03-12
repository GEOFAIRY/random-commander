const STORAGE_KEY = 'edh-history';
const MAX_ENTRIES = 20;

export type HistoryEntry = {
  name: string;
  scryfallId: string;
  imageUri: string;
  colorIdentity: string[];
  partnerName?: string;
  partnerImageUri?: string;
  timestamp: number;
};

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToHistory(entry: HistoryEntry): void {
  const history = getHistory().filter((e) => e.scryfallId !== entry.scryfallId);
  history.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_ENTRIES)));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
