'use client';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { ApiError } from '../lib/api';
import { Card } from '../types';
import { useRandomCommander } from '../lib/hooks/useRandomCommander';
import CommanderCard from '../components/CommanderCard';
import EdhrecSummary from '../components/EdhrecSummary';
import Controls from '../components/Controls';

import { buildSlug } from '../lib/constants';

const buildEdhrecUrl = (card: Card, partner?: Card | null): string => {
  const slug = buildSlug(card);
  const fullSlug = partner ? `${slug}-${buildSlug(partner)}` : slug;
  return `https://edhrec.com/commanders/${fullSlug}`;
};

const LandingPage = () => {
  const [card, setCard] = useState<Card | null>(null);
  const [partner, setPartner] = useState<Card | null>(null);
  const [colorFilters, setColorFilters] = useState<string[]>([]);

  const { randomizing, randomize } = useRandomCommander();
  const [apiError, setApiError] = useState<string | null>(null);

  // Initial load handled here (delegates to hook)
  useEffect(() => {
    const fetchCard = async () => {
      setApiError(null);
      try {
        const { card: cardData, partner: partnerCard } = await randomize(colorFilters);
        setCard(cardData);
        setPartner(partnerCard);
      } catch (err) {
        console.error('Error fetching card on mount:', err);
        setApiError(err instanceof ApiError ? err.message : String(err));
      }
    };
    fetchCard();
  }, [randomize, colorFilters]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1>Random Commander Card</h1>
          <Controls
            handleColorFilterChange={(value) => {
              setColorFilters(value);
            }}
            colorFilters={colorFilters}
            onRandom={async () => {
              setApiError(null);
              try {
                const { card: cardData, partner: partnerCard } = await randomize(colorFilters);
                setCard(cardData);
                setPartner(partnerCard);
              } catch (err) {
                console.error('Error fetching card:', err);
                setApiError(err instanceof ApiError ? err.message : String(err));
              }
            }}
            randomizing={randomizing}
          />

          {apiError ? (
            <div style={{ color: 'var(--text-primary)', marginTop: 12 }} role="status">
              <strong>Error:</strong> {apiError}
            </div>
          ) : null}

          {card ? (
            <div className={styles.content}>
              <div className={styles.headerRow}>
                <h2 className={styles.cardTitle}>{card.name}</h2>
                <div />
              </div>
              <div className={styles.leftColumn}>
                <CommanderCard card={card} edhrecUrl={buildEdhrecUrl(card, partner)} />
                {partner && (
                  <CommanderCard card={partner} edhrecUrl={buildEdhrecUrl(card, partner)} />
                )}
              </div>

              <div className={styles.rightColumn}>
                <EdhrecSummary card={card} baseEdhrecUrl={buildEdhrecUrl(card, partner)} />
              </div>
            </div>
          ) : (
            <div className={styles.content}>
              <div className={styles.leftColumn}>
                <div className={styles.cardSkeleton} aria-hidden="true" />
              </div>

              <div className={styles.rightColumn}>
                <div className={styles.headerRow}>
                  <div className={styles.titleSkeleton} aria-hidden="true" />
                </div>

                <div className={styles.edhrec}>
                  <div className={styles.edhrecSkeleton}>
                    <div className={styles.skelLine} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div className={styles.skelSmall} />
                      <div className={styles.skelSmall} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className={styles.siteFooter}>
        <div className="author">
          <p>
            Made by <a href="https://github.com/GEOFAIRY">GEOFAIRY</a>
          </p>
        </div>
        <div className="repo">
          Open Source at <a href="https://github.com/GEOFAIRY/random-commander">GitHub</a>
        </div>
        <div className="credit">
          <div className="scryfall">
            <p>
              Card information and Image provided by <a href="https://scryfall.com/">Scryfall</a>
            </p>
          </div>
          <div className="edhrec">
            <p>
              Deck usage information provided by <a href="https://edhrec.com">EDHRecs</a>
            </p>
          </div>
        </div>
        <div className="contact">
          <p>
            Contact at <a href="mailto:krs19@xtra.co.nz">krs19@xtra.co.nz</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
