"use client";
import styles from "../app/page.module.css";
import { useEffect, useState } from "react";
import { fetchEdhrecByName } from "../lib/api";
import { Edhrec, Card } from "../types";

type Tag = { name?: string; slug?: string; count?: number };

type Props = {
  card: Card;
  baseEdhrecUrl: string;
};

export default function EdhrecSummary({ card, baseEdhrecUrl }: Props) {
  const [edhrec, setEdhrec] = useState<Edhrec | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!card) return;

    setEdhrec(null);
    setError(null);
    setLoading(true);

    (async () => {
      try {
        const edh = await fetchEdhrecByName(card.name, card.faceCount ?? 1);
        if (!mounted) return;
        setEdhrec(edh);
      } catch (err: unknown) {
        console.error("EDHREC fetch error:", err);
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg || "Failed to fetch EDHREC data");
        setEdhrec(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [card]);
  if (loading)
    return (
      <div className={styles.edhrec} aria-live="polite">
        <div className={styles.edhrecSkeleton}>
          <div className={styles.skelLine} />
          <div style={{ display: "flex", gap: 8 }}>
            <div className={styles.skelSmall} />
            <div className={styles.skelSmall} />
          </div>
        </div>
      </div>
    );

  if (error)
    return <p style={{ color: "red" }}>Error loading deck data: {error}</p>;
  if (!edhrec) return null;

  const panelTaglinks = Array.isArray(edhrec?.panels?.taglinks)
    ? edhrec!.panels!.taglinks
    : [];

  const maybeNumDecksAvg = (edhrec as unknown as Record<string, unknown>)[
    "num_decks_avg"
  ];
  const avg =
    typeof edhrec.num_of_decks_average === "number"
      ? edhrec.num_of_decks_average
      : typeof maybeNumDecksAvg === "number"
        ? (maybeNumDecksAvg as number)
        : undefined;

  return (
    <div className={styles.edhrec}>
      <h3>Deck usage (EDHREC)</h3>
      {(edhrec.deck_count || edhrec.decks || edhrec.decks_count) && (
        <p>Decks: {edhrec.deck_count || edhrec.decks || edhrec.decks_count}</p>
      )}

      <div className={styles.edhrecSummary}>
        {typeof avg === "number" && <p>Average decks: {avg}</p>}
        {typeof edhrec?.container?.json_dict?.card?.rank === "number" && (
          <p>Rank: #{edhrec.container.json_dict.card.rank}</p>
        )}
      </div>

      {panelTaglinks.length > 0 ? (
        <div>
          <h4>Top tags</h4>
          <ul className={styles.edhrecTags}>
            {panelTaglinks.slice(0, 5).map((t: Tag, i: number) => {
              const tagName = (t.name || t.slug || `tag-${i}`).replace(/plus-/g, '+').replace(/minus-/g, '-');
              const tagCount = typeof t.count === "number" ? t.count : "-";
              const tagSlug =
                t.slug || tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              const tagUrl = `${baseEdhrecUrl}/${tagSlug}`;

              return (
                <li key={i}>
                  <a
                    href={tagUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.tagLink}
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
