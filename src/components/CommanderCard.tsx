'use client';
import { useRef, useState } from 'react';
import { Card } from '../types';

type Props = {
  card?: Card | null;
  edhrecUrl?: string;
  priority?: boolean;
};

export default function CommanderCard({ card = null, edhrecUrl, priority = false }: Props) {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  const imageUrl = card?.imageUrl ?? null;

  if (imageUrl !== prevUrlRef.current) {
    prevUrlRef.current = imageUrl;
    if (loadedUrl !== null) setLoadedUrl(null);
  }

  const loaded = imageUrl !== null && imageUrl === loadedUrl;

  if (!card) return null;

  return (
    <div className="relative flex flex-col items-center gap-2 w-60 min-h-85">
      {!loaded && (
        <div
          className="w-60 h-85 rounded-[15px] overflow-hidden bg-linear-to-r from-[#f3f3f3] via-edhrec-border to-[#f3f3f3] bg-size-[400%_100%] animate-shimmer shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)] dark:from-[#0b1220] dark:via-[#0f1720] dark:to-[#0b1220]"
          aria-hidden="true"
        />
      )}
      {card.imageUrl ? (
        <a
          href={edhrecUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-60 aspect-240/340"
          style={loaded ? undefined : { position: 'absolute', visibility: 'hidden' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.imageUrl}
            alt={card.name}
            width={240}
            height={340}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className="rounded-[15px]"
            style={{ width: 240, height: 'auto' }}
            onLoad={() => setLoadedUrl(card.imageUrl)}
          />
        </a>
      ) : null}
    </div>
  );
}
