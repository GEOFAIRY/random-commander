import type { Card } from '../types';
import type { ManaId } from '../components/ManaIcon';

export type ColorItem = { id: ManaId; title: string; bg: string; fg: string };

export const COLORS: ReadonlyArray<ColorItem> = [
  { id: 'W', title: 'White', bg: '#f8f6e8', fg: '#111' },
  { id: 'U', title: 'Blue', bg: '#dbe8ff', fg: '#0a3b66' },
  { id: 'B', title: 'Black', bg: '#cfcfcf', fg: '#111' },
  { id: 'R', title: 'Red', bg: '#ffd9d6', fg: '#7a0900' },
  { id: 'G', title: 'Green', bg: '#dff6e2', fg: '#0b4d21' },
  { id: 'C', title: 'Colorless', bg: '#f2f2f2', fg: '#444' },
];

/**
 * Normalize a card name to a URL-safe slug.
 * Strips diacritics, possessives, and special characters.
 * If doubleFaced is true, drops the back face (" // ...").
 */
export function slugify(name: string, doubleFaced = false): string {
  const cleaned = doubleFaced ? name.replace(/\s*\/\/.*$/g, '') : name;
  return cleaned
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\ua789\u02d0\u02d1:]/g, '')
    .replace(/[\u2019\u2018']/g, "'")
    .replace(/'s\b/gi, 's')
    .replace(/'/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function buildSlug(c: Card): string {
  return slugify(c.name, (c.faceCount ?? 1) > 1);
}
