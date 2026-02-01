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
            <h2>{card.name}</h2>
            {card.imageUrl ? (
                <a
                    href={`https://edhrec.com/commanders/${card.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        src={card.imageUrl}
                        alt={card.name}
                        width={200}
                        height={300}
                        loading="eager"
                        fetchPriority="high"
                    />
                </a>
            ) : null}
            <p>{card.type}</p>
            <p>{card.text}</p>
        </div>
    );
}
