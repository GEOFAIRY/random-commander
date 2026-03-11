'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '../../lib/hooks/useFavorites';
import { fetchCardById } from '../../lib/api';
import { slugify } from '../../lib/constants';
import type { FavoriteEntry } from '../../lib/favorites';
import type { Card } from '../../types';

function buildEdhrecUrlFromEntry(entry: FavoriteEntry): string {
  const slug = slugify(entry.name);
  if (entry.partnerName) {
    return `https://edhrec.com/commanders/${slug}-${slugify(entry.partnerName)}`;
  }
  return `https://edhrec.com/commanders/${slug}`;
}

const btnClasses =
  'px-3 py-1.5 rounded-lg border border-btn-border bg-transparent text-text-primary text-sm cursor-pointer transition-all duration-150 hover:bg-btn-hover';

export default function FavoritesPage() {
  return (
    <Suspense>
      <FavoritesContent />
    </Suspense>
  );
}

function FavoritesContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids');
  const isSharedView = idsParam !== null;

  const { favorites, remove, clear } = useFavorites();

  const [sharedCards, setSharedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!idsParam) return;

    let cancelled = false;
    const controller = new AbortController();

    async function loadSharedCards() {
      setLoading(true);
      try {
        const ids: unknown = JSON.parse(atob(idsParam!));
        if (!Array.isArray(ids)) return;
        const cards = await Promise.all(
          ids.map((id: string) => fetchCardById(id, controller.signal)),
        );
        if (!cancelled) setSharedCards(cards);
      } catch {
        // invalid param or fetch failure
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSharedCards();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [idsParam]);

  function handleShare() {
    const ids = favorites.map((f) => f.scryfallId);
    const encoded = btoa(JSON.stringify(ids));
    const url = `${window.location.origin}/favorites?ids=${encoded}`;
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="flex flex-col min-h-screen items-center bg-surface text-text-primary">
      <main className="w-full max-w-180 mx-auto py-20 px-10 bg-surface-card max-sm:py-12 max-sm:px-6">
        <Link
          href="/"
          className="inline-block mb-6 text-text-secondary no-underline text-sm hover:text-text-primary"
        >
          &larr; Back to Randomizer
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight max-sm:text-2xl max-sm:leading-snug m-0">
            {isSharedView ? 'Shared Favorites' : 'Favorites'}
          </h1>
          {!isSharedView && favorites.length > 0 && (
            <div className="flex gap-2 ml-auto">
              <button type="button" className={btnClasses} onClick={handleShare}>
                Share
              </button>
              <button type="button" className={btnClasses} onClick={clear}>
                Clear All
              </button>
            </div>
          )}
        </div>

        {isSharedView ? (
          loading ? (
            <p className="text-text-secondary">Loading shared favorites...</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
              {sharedCards.map((card) => (
                <a
                  key={card.scryfallId}
                  href={`https://edhrec.com/commanders/${slugify(card.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    width={240}
                    height={340}
                    className="rounded-xl w-full h-auto"
                    loading="lazy"
                  />
                  <p className="text-sm text-center mt-1 text-text-secondary">{card.name}</p>
                </a>
              ))}
            </div>
          )
        ) : favorites.length === 0 ? (
          <p className="text-text-secondary">
            No favorites yet. Use the star button on the randomizer to save commanders you like.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
            {favorites.map((entry) => (
              <div key={entry.scryfallId} className="relative group">
                <button
                  type="button"
                  onClick={() => remove(entry.scryfallId)}
                  className="absolute top-1 right-1 z-10 size-6 rounded-full bg-black/60 text-white border-none cursor-pointer flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  title="Remove from favorites"
                  aria-label={`Remove ${entry.name} from favorites`}
                >
                  &times;
                </button>
                <a
                  href={buildEdhrecUrlFromEntry(entry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Image
                    src={entry.imageUri}
                    alt={entry.name}
                    width={240}
                    height={340}
                    className="rounded-xl w-full h-auto"
                    loading="lazy"
                  />
                  <p className="text-sm text-center mt-1 text-text-secondary">{entry.name}</p>
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
