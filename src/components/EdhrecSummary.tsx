'use client';
import styles from '../app/page.module.css';
import { Edhrec, Card } from '../types';

type Tag = { name?: string; slug?: string; count?: number };

type Props = {
  card?: Card | null;
  baseEdhrecUrl?: string;
  edhrec?: Edhrec | null;
};

export default function EdhrecSummary({ card, baseEdhrecUrl = '', edhrec }: Props) {
  if (!card) return null;

  if (!edhrec)
    return (
      <div className={styles.edhrec} aria-live="polite">
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No deck data available.</p>
      </div>
    );

  const panelTaglinks = edhrec.panels?.taglinks ?? [];

  const avg =
    typeof edhrec.num_decks_average === 'number'
      ? edhrec.num_decks_average
      : typeof edhrec.num_decks_avg === 'number'
        ? edhrec.num_decks_avg
        : undefined;

  return (
    <div className={styles.edhrec}>
      <h3>Deck usage (EDHREC)</h3>
      {(edhrec.deck_count ?? edhrec.decks ?? edhrec.decks_count) != null && (
        <p>Decks: {edhrec.deck_count ?? edhrec.decks ?? edhrec.decks_count}</p>
      )}

      <div className={styles.edhrecSummary}>
        {typeof avg === 'number' && <p>Average decks: {avg}</p>}
        {typeof edhrec?.container?.json_dict?.card?.rank === 'number' && (
          <p>Rank: #{edhrec.container.json_dict.card.rank}</p>
        )}
      </div>

      {panelTaglinks.length > 0 ? (
        <div>
          <h4>Top tags</h4>
          <ul className={styles.edhrecTags}>
            {panelTaglinks.slice(0, 5).map((t: Tag, i: number) => {
              const tagName = (t.name || t.slug || `tag-${i}`)
                .replace(/plus-/g, '+')
                .replace(/minus-/g, '-');
              const tagCount = typeof t.count === 'number' ? t.count : '-';
              const tagSlug = t.slug || tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const tagUrl = `${baseEdhrecUrl}/${tagSlug}`;

              return (
                <li key={i}>
                  <a
                    href={tagUrl}
                    target="_blank"
                    rel="noopener noreferrer"

                  >
                    <span className={styles.tagName}>{tagName}</span>
                    <span className={styles.tagCount}>{tagCount}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
