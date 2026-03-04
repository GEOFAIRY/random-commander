'use client';
import Image from 'next/image';
import { Card } from '../types';
import styles from '../app/page.module.css';

type Props = {
  card?: Card | null;
  edhrecUrl?: string;
  priority?: boolean;
};

export default function CommanderCard({ card = null, edhrecUrl, priority = false }: Props) {
  if (!card) return null;

  return (
    <div className={styles.cardWrap}>
      {card.imageUrl ? (
        <a
          href={edhrecUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardImageLink}
        >
          <Image
            src={card.imageUrl}
            alt={card.name}
            width={240}
            height={340}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            style={{ width: 240, height: 'auto' }}
          />
        </a>
      ) : null}
    </div>
  );
}
