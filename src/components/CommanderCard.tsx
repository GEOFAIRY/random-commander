"use client";
import Image from "next/image";
import { Card } from "../types";
import styles from "../app/page.module.css";

type Props = {
    card: Card | null;
    edhrecUrl?: string;
};

export default function CommanderCard({ card, edhrecUrl }: Props) {
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
                        loading="eager"
                        fetchPriority="high"
                    />
                </a>
            ) : null}
        </div>
    );
}
