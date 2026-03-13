'use client';
import { Edhrec, Card } from '../types';

type Tag = { name?: string; slug?: string; count?: number };

type Props = {
  card?: Card | null;
  baseEdhrecUrl?: string;
  edhrec?: Edhrec | null;
};

const panelClasses =
  'text-left w-full bg-edhrec-bg text-text-primary p-4 rounded-xl border border-edhrec-border shadow-xs flex-1 min-h-75 overflow-y-auto';

export default function EdhrecSummary({ card, baseEdhrecUrl = '', edhrec }: Props) {
  if (!card) return null;

  if (!edhrec)
    return (
      <div className={panelClasses} aria-live="polite">
        <p className="text-text-secondary m-0">No deck data available.</p>
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
    <div className={panelClasses}>
      <h3 className="m-0 mb-2">Deck usage (EDHREC)</h3>
      {(edhrec.deck_count ?? edhrec.decks ?? edhrec.decks_count) != null && (
        <p>Decks: {edhrec.deck_count ?? edhrec.decks ?? edhrec.decks_count}</p>
      )}

      <div className="flex gap-3 items-center flex-wrap mb-2">
        {typeof avg === 'number' && (
          <p className="m-0 bg-surface-card px-2.5 py-1.5 rounded-lg border border-edhrec-border font-medium text-text-primary">
            Average decks: {avg}
          </p>
        )}
        {typeof edhrec?.container?.json_dict?.card?.rank === 'number' && (
          <p className="m-0 bg-surface-card px-2.5 py-1.5 rounded-lg border border-edhrec-border font-medium text-text-primary">
            Rank: #{edhrec.container.json_dict.card.rank}
          </p>
        )}
      </div>

      {panelTaglinks.length > 0 ? (
        <div>
          <h4 className="m-0 mb-2">Top tags</h4>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2 mt-2 p-0 list-none max-sm:grid-cols-1">
            {panelTaglinks.slice(0, 5).map((t: Tag, i: number) => {
              const tagName = (t.name || t.slug || `tag-${i}`)
                .replace(/\+(\d+)-\+(\d+)/g, '+$1/+$2')
                .replace(/-(\d+)--(\d+)/g, '-$1/-$2')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());
              const tagCount = typeof t.count === 'number' ? t.count : '-';
              const tagSlug = t.slug || tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const tagUrl = `${baseEdhrecUrl}/${tagSlug}`;

              return (
                <li
                  key={i}
                  className="flex justify-between items-center gap-2 bg-tag-bg px-2.5 py-2 rounded-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <a
                    href={tagUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full justify-between items-center gap-2 text-inherit no-underline font-medium hover:no-underline"
                  >
                    <span className="inline-block">{tagName}</span>
                    <span className="text-sm text-text-secondary bg-transparent">{tagCount}</span>
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
