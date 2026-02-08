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

export function buildSlug(c: Card): string {
  // Keep same behavior as previous implementation: drop trailing "//" face suffix for two-faced cards
  return c.faceCount === 2
    ? c.name
        .toLowerCase()
        .replace(/\s*\/\/.*$/g, '')
        .replace(/[^a-z0-9]+/g, '-')
    : c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
