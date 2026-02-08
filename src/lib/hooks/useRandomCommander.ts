import { useCallback, useState } from 'react';
import { fetchRandomCommanderCard, fetchRandomPartnerCard } from '../../lib/api';
import { detectPartnerConstraint } from '../../types';
import type { Card } from '../../types';

export function useRandomCommander() {
  const [randomizing, setRandomizing] = useState(false);

  const randomize = useCallback(async (colorFilters: string[]) => {
    setRandomizing(true);
    try {
      const card = await fetchRandomCommanderCard(colorFilters);
      let partner: Card | null = null;

      const constraint = detectPartnerConstraint(card);
      if (constraint.type !== 'none') {
        const partnerCard = await fetchRandomPartnerCard(colorFilters, constraint, card);
        if (partnerCard) partner = partnerCard;
      }

      return { card, partner } as { card: Card; partner: Card | null };
    } finally {
      setRandomizing(false);
    }
  }, []);

  return { randomizing, randomize } as const;
}
