'use client';
import styles from './page.module.css';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../lib/api';
import { clearBuffer } from '../lib/commanderBuffer';
import { Card, Edhrec } from '../types';
import { useRandomCommander } from '../lib/hooks/useRandomCommander';
import CommanderCard from '../components/CommanderCard';
import EdhrecSummary from '../components/EdhrecSummary';
import Controls from '../components/Controls';
import AdBanner from '../components/AdBanner';

import { buildSlug } from '../lib/constants';

const buildEdhrecUrl = (card: Card, partner?: Card | null): string => {
  const slug = buildSlug(card);
  const fullSlug = partner ? `${slug}-${buildSlug(partner)}` : slug;
  return `https://edhrec.com/commanders/${fullSlug}`;
};

const LandingPage = () => {
  const [card, setCard] = useState<Card | null>(null);
  const [partner, setPartner] = useState<Card | null>(null);
  const [prefetchedEdhrec, setPrefetchedEdhrec] = useState<Edhrec | null>(null);
  const [colorFilters, setColorFilters] = useState<string[]>([]);

  const { randomizing, randomize } = useRandomCommander();
  const [apiError, setApiError] = useState<string | null>(null);

  const applyResult = useCallback(
    (result: { card: Card; partner: Card | null; edhrec: Edhrec | null }) => {
      setCard(result.card);
      setPartner(result.partner);
      setPrefetchedEdhrec(result.edhrec);
    },
    []
  );

  const fetchNewCard = useCallback(async () => {
    setApiError(null);
    try {
      applyResult(await randomize(colorFilters));
    } catch (err) {
      console.error('Error fetching card:', err);
      setApiError(err instanceof ApiError ? err.message : String(err));
    }
  }, [randomize, colorFilters, applyResult]);

  // Initial load + re-fetch on filter change
  useEffect(() => {
    let stale = false;
    randomize(colorFilters).then(
      (result) => {
        if (stale) return;
        setApiError(null);
        applyResult(result);
      },
      (err) => {
        if (stale) return;
        console.error('Error fetching card:', err);
        setApiError(err instanceof ApiError ? err.message : String(err));
      }
    );
    return () => { stale = true; };
  }, [randomize, colorFilters, applyResult]);

  const handleColorFilterChange = useCallback((value: string[]) => {
    clearBuffer();
    setColorFilters(value);
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.mainContent}>
          <h1>Random Commander Card</h1>
          <Controls
            handleColorFilterChange={handleColorFilterChange}
            colorFilters={colorFilters}
            onRandom={fetchNewCard}
            randomizing={randomizing}
          />

          {apiError ? (
            <div style={{ color: 'var(--text-primary)', marginTop: 12 }} role="status">
              <strong>Error:</strong> {apiError}
            </div>
          ) : null}

          <div className={styles.content}>
            <div className={styles.headerRow}>
              {card ? (
                <h2 className={styles.cardTitle}>{card.name}</h2>
              ) : (
                <div className={styles.titleSkeleton} aria-hidden="true" />
              )}
            </div>
            <div className={styles.leftColumn}>
              {card ? (
                <>
                  <CommanderCard card={card} edhrecUrl={buildEdhrecUrl(card, partner)} priority />
                  {partner && (
                    <CommanderCard card={partner} edhrecUrl={buildEdhrecUrl(card, partner)} />
                  )}
                </>
              ) : (
                <div className={styles.cardSkeleton} aria-hidden="true" />
              )}
            </div>

            <div className={styles.rightColumn}>
              {card ? (
                <EdhrecSummary card={card} baseEdhrecUrl={buildEdhrecUrl(card, partner)} edhrec={prefetchedEdhrec} />
              ) : (
                <div className={styles.edhrec}>
                  <div className={styles.edhrecSkeleton}>
                    <div className={styles.skelLine} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div className={styles.skelSmall} />
                      <div className={styles.skelSmall} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <div className={styles.adContainer}>
        <AdBanner />
      </div>
      <footer className={styles.siteFooter}>
        <div>
          <p>
            <a href="/about">About</a>
          </p>
        </div>
        <div>
          <p>
            Made by <a href="https://github.com/GEOFAIRY">GEOFAIRY</a>
          </p>
        </div>
        <div>
          Open Source at <a href="https://github.com/GEOFAIRY/random-commander">GitHub</a>
        </div>
        <div>
          <div>
            <p>
              Card information and Image provided by <a href="https://scryfall.com/">Scryfall</a>
            </p>
          </div>
          <div>
            <p>
              Deck usage information provided by <a href="https://edhrec.com">EDHRecs</a>
            </p>
          </div>
        </div>
        <div>
          <p>
            Contact at <a href="mailto:krs19@xtra.co.nz">krs19@xtra.co.nz</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
