'use client';
import { useCallback, useEffect, useState } from 'react';
import { ApiError, fetchEdhrecByName } from '../lib/api';
import { clearBuffer } from '../lib/commanderBuffer';
import { Card, Edhrec } from '../types';
import { useRandomCommander } from '../lib/hooks/useRandomCommander';
import { useHistory } from '../lib/hooks/useHistory';
import type { HistoryEntry } from '../lib/history';
import CommanderCard from '../components/CommanderCard';
import EdhrecSummary from '../components/EdhrecSummary';
import Controls from '../components/Controls';
import HistoryPanel from '../components/HistoryPanel';
import AdBanner from '../components/AdBanner';
import { buildSlug } from '../lib/constants';
import { useFavorites } from '../lib/hooks/useFavorites';

const buildEdhrecUrl = (card: Card, partner?: Card | null): string => {
  const slug = buildSlug(card);
  const fullSlug = partner ? `${slug}-${buildSlug(partner)}` : slug;
  return `https://edhrec.com/commanders/${fullSlug}`;
};

const skeletonBase =
  'bg-linear-to-r from-[#f3f3f3] via-edhrec-border to-[#f3f3f3] bg-[length:400%_100%] animate-shimmer dark:from-[#0b1220] dark:via-[#0f1720] dark:to-[#0b1220]';

const LandingPage = () => {
  const [card, setCard] = useState<Card | null>(null);
  const [partner, setPartner] = useState<Card | null>(null);
  const [prefetchedEdhrec, setPrefetchedEdhrec] = useState<Edhrec | null>(null);
  const [colorFilters, setColorFilters] = useState<string[]>([]);

  const { randomize } = useRandomCommander();
  const { add: addFavorite, remove: removeFavorite, isFavorite } = useFavorites();
  const { history, add: addHistoryEntry, clear: clearHistoryEntries } = useHistory();
  const [apiError, setApiError] = useState<string | null>(null);

  const applyResult = useCallback(
    (result: { card: Card; partner: Card | null; edhrec: Edhrec | null }) => {
      setCard(result.card);
      setPartner(result.partner);
      setPrefetchedEdhrec(result.edhrec);
      addHistoryEntry({
        name: result.card.name,
        scryfallId: result.card.scryfallId ?? result.card.name,
        imageUri: result.card.imageUrl,
        colorIdentity: result.card.colorIdentity ?? [],
        ...(result.partner?.name && { partnerName: result.partner.name }),
        ...(result.partner?.imageUrl && { partnerImageUri: result.partner.imageUrl }),
        timestamp: Date.now(),
      });
    },
    [addHistoryEntry]
  );

  const fetchNewCard = useCallback(async () => {
    setApiError(null);
    setCard(null);
    setPartner(null);
    setPrefetchedEdhrec(null);
    try {
      applyResult(await randomize(colorFilters));
    } catch (err) {
      console.error('Error fetching card:', err);
      setApiError(err instanceof ApiError ? err.message : String(err));
    }
  }, [randomize, colorFilters, applyResult]);

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

  const handleHistorySelect = useCallback(async (entry: HistoryEntry) => {
    setApiError(null);
    const restoredCard: Card = { name: entry.name, imageUrl: entry.imageUri, type: '', text: '', keywords: [] };
    const restoredPartner = entry.partnerName && entry.partnerImageUri
      ? { name: entry.partnerName, imageUrl: entry.partnerImageUri, type: '', text: '', keywords: [] } as Card
      : null;
    setCard(restoredCard);
    setPartner(restoredPartner);
    setPrefetchedEdhrec(null);

    try {
      const edhrecData = await fetchEdhrecByName(restoredCard.name);
      setPrefetchedEdhrec(edhrecData);
    } catch {
      // EDHREC data is optional
    }
  }, []);

  const handleColorFilterChange = useCallback((value: string[]) => {
    clearBuffer();
    setColorFilters(value);
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-start bg-surface text-text-primary">
      <main className="flex flex-col flex-1 w-full max-w-250 mx-auto items-center justify-start bg-surface-card py-20 px-10 max-sm:py-12 max-sm:px-6">
        <div className="text-center p-5 w-full">
          <h1 className="text-4xl font-bold tracking-tight mb-2 max-sm:text-3xl">Random Commander Card</h1>
          <Controls
            handleColorFilterChange={handleColorFilterChange}
            colorFilters={colorFilters}
            onRandom={fetchNewCard}
            randomizing={!card}
          />

          {apiError ? (
            <div className="text-text-primary mt-3" role="status">
              <strong>Error:</strong> {apiError}
            </div>
          ) : null}

          <div className="flex gap-6 items-start w-full flex-wrap max-md:flex-col max-md:items-center">
            <div className="flex justify-center items-center gap-3 basis-full min-h-7">
              {card ? (
                <>
                  <h2 className="m-0 text-xl font-semibold">{card.name}</h2>
                  <button
                    type="button"
                    onClick={() => {
                      const id = card.scryfallId ?? card.name;
                      if (isFavorite(id)) {
                        removeFavorite(id);
                      } else {
                        addFavorite({
                          name: card.name,
                          scryfallId: id,
                          imageUri: card.imageUrl,
                          colorIdentity: card.colorIdentity ?? [],
                          ...(partner?.name && { partnerName: partner.name }),
                          ...(partner?.imageUrl && { partnerImageUri: partner.imageUrl }),
                          timestamp: Date.now(),
                        });
                      }
                    }}
                    className="p-1 bg-transparent border-none cursor-pointer transition-transform duration-150 hover:scale-110"
                    title={isFavorite(card.scryfallId ?? card.name) ? 'Remove from favorites' : 'Add to favorites'}
                    aria-label={isFavorite(card.scryfallId ?? card.name) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={isFavorite(card.scryfallId ?? card.name) ? '#f59e0b' : 'none'}
                      stroke={isFavorite(card.scryfallId ?? card.name) ? '#f59e0b' : 'currentColor'}
                      strokeWidth={2}
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <div className={`w-[55%] h-6 rounded-md ${skeletonBase}`} aria-hidden="true" />
              )}
            </div>
            <div className="shrink-0 flex flex-row justify-start items-start gap-3">
              {card ? (
                <>
                  <CommanderCard card={card} edhrecUrl={buildEdhrecUrl(card, partner)} priority />
                  {partner && (
                    <CommanderCard card={partner} edhrecUrl={buildEdhrecUrl(card, partner)} />
                  )}
                </>
              ) : (
                <div
                  className={`w-60 h-85 rounded-[15px] overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)] ${skeletonBase}`}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-3 min-h-85">
              {card ? (
                <EdhrecSummary card={card} baseEdhrecUrl={buildEdhrecUrl(card, partner)} edhrec={prefetchedEdhrec} />
              ) : (
                <div className="text-left w-full bg-edhrec-bg text-text-primary p-4 rounded-xl border border-edhrec-border shadow-xs flex-1 min-h-75 overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    <div className={`h-3.5 w-3/5 rounded-md ${skeletonBase}`} />
                    <div className="flex gap-2">
                      <div className={`h-3 w-2/5 rounded-md ${skeletonBase}`} />
                      <div className={`h-3 w-2/5 rounded-md ${skeletonBase}`} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <HistoryPanel
            history={history}
            onSelect={handleHistorySelect}
            onClear={clearHistoryEntries}
          />
        </div>
      </main>
      <div className="w-full max-w-250 mx-auto my-6 px-4">
        <AdBanner />
      </div>
    </div>
  );
};

export default LandingPage;
