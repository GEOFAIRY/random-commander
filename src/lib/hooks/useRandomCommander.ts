import { useCallback, useState } from 'react';
import { fetchRandomCommanderCard, fetchRandomPartnerCard } from '../../lib/api';
import { popEntry } from '../../lib/commanderBuffer';
import { detectPartnerConstraint } from '../../types';
import type { Card, Edhrec } from '../../types';

export type RandomizeResult = {
  card: Card;
  partner: Card | null;
  edhrec: Edhrec | null;
};

export function useRandomCommander() {
  const [randomizing, setRandomizing] = useState(false);

  const randomize = useCallback(async (colorFilters: string[]): Promise<RandomizeResult> => {
    setRandomizing(true);
    try {
      let card: Card | null = null;
      let edhrec: Edhrec | null = null;

      try {
        const entry = await popEntry(colorFilters);
        if (entry) {
          card = entry.card;
          edhrec = entry.edhrec;
        }
      } catch {
        // Buffer failed — fall back to single fetch
      }

      if (!card) {
        card = await fetchRandomCommanderCard(colorFilters);
      }

      let partner: Card | null = null;
      const constraint = detectPartnerConstraint(card);
      if (constraint.type !== 'none') {
        const partnerCard = await fetchRandomPartnerCard(colorFilters, constraint, card);
        if (partnerCard) partner = partnerCard;
      }

      return { card, partner, edhrec };
    } finally {
      setRandomizing(false);
    }
  }, []);

  return { randomizing, randomize } as const;
}
