import { useCallback, useRef, useState } from 'react';
import { fetchRandomCommanderCard, fetchRandomPartnerCard } from '../../lib/api';
import { popEntry } from '../../lib/commanderBuffer';
import { detectPartnerConstraint } from '../../types';
import type { Card, Edhrec, Filters } from '../../types';

export type RandomizeResult = {
  card: Card;
  partner: Card | null;
  edhrec: Edhrec | null;
};

export function useRandomCommander() {
  const [randomizing, setRandomizing] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const randomize = useCallback(async (colorFilters: string[], filters?: Filters): Promise<RandomizeResult> => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setRandomizing(true);
    try {
      let card: Card | null = null;
      let edhrec: Edhrec | null = null;

      try {
        const entry = await popEntry(colorFilters, filters);
        if (entry) {
          card = entry.card;
          edhrec = entry.edhrec;
        }
      } catch {
        // Buffer failed — fall back to single fetch
      }

      if (!card) {
        card = await fetchRandomCommanderCard(colorFilters, filters, controller.signal);
      }

      let partner: Card | null = null;
      const constraint = detectPartnerConstraint(card);
      if (constraint.type !== 'none') {
        // Don't pass abort signal to partner fetch — it's fast and should always complete.
        // The stale check in the calling useEffect handles cancellation instead.
        const partnerCard = await fetchRandomPartnerCard(colorFilters, filters, constraint, card, 5);
        if (partnerCard) partner = partnerCard;
      }

      return { card, partner, edhrec };
    } finally {
      setRandomizing(false);
    }
  }, []);

  return { randomizing, randomize } as const;
}
