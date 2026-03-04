'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Card } from '../types';
import styles from '../app/page.module.css';

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
    <div className={styles.cardWrap}>
      {!loaded && <div className={styles.cardSkeleton} aria-hidden="true" />}
      {card.imageUrl ? (
        <a
          href={edhrecUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardImageLink}
          style={loaded ? undefined : { position: 'absolute', visibility: 'hidden' }}
        >
          <Image
            src={card.imageUrl}
            alt={card.name}
            width={240}
            height={340}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            style={{ width: 240, height: 'auto' }}
            onLoad={() => setLoadedUrl(card.imageUrl)}
          />
        </a>
      ) : null}
    </div>
  );
}
