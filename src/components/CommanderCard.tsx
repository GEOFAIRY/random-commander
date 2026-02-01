"use client";
import Image from "next/image";
import { Card } from "../types";
import styles from "../app/page.module.css";

type Props = {
  card: Card | null;
};

export default function CommanderCard({ card }: Props) {
  if (!card) return null;

  return (
    <div className={styles.cardWrap}>
      {card.imageUrl ? (
        <a
          href={`https://edhrec.com/commanders/${card.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardImageLink}
        >
          <Image
            src={card.imageUrl}
            alt={card.name}
            width={240}
            height={340}
            loading="eager"
            fetchPriority="high"
          />
        </a>
      ) : null}
    </div>
  );
}
