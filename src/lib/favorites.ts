const STORAGE_KEY = 'edh-favorites';

export type FavoriteEntry = {
  name: string;
  scryfallId: string;
  imageUri: string;
  colorIdentity: string[];
  partnerName?: string;
  partnerImageUri?: string;
  timestamp: number;
};

export function getFavorites(): FavoriteEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addFavorite(entry: FavoriteEntry): void {
  const favorites = getFavorites().filter((e) => e.scryfallId !== entry.scryfallId);
  favorites.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function removeFavorite(scryfallId: string): void {
  const favorites = getFavorites().filter((e) => e.scryfallId !== scryfallId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(scryfallId: string): boolean {
  return getFavorites().some((e) => e.scryfallId === scryfallId);
}

export function clearFavorites(): void {
  localStorage.removeItem(STORAGE_KEY);
}
