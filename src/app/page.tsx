"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Card, detectPartnerConstraint } from "../types";
import { fetchRandomCommanderCard, fetchRandomPartnerCard } from "../lib/api";
import CommanderCard from "../components/CommanderCard";
import EdhrecSummary from "../components/EdhrecSummary";
import Controls from "../components/Controls";

const buildEdhrecUrl = (card: Card, partner?: Card | null): string => {
    const buildSlug = (c: Card): string =>
        c.faceCount === 2
            ? c.name
                  .toLowerCase()
                  .replace(/\s*\/\/.*$/g, "")
                  .replace(/[^a-z0-9]+/g, "-")
            : c.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-");

    const slug = buildSlug(card);
    const fullSlug = partner ? `${slug}-${buildSlug(partner)}` : slug;
    return `https://edhrec.com/commanders/${fullSlug}`;
};

const LandingPage = () => {
    const [card, setCard] = useState<Card | null>(null);
    const [partner, setPartner] = useState<Card | null>(null);
    const [colorFilters, setColorFilters] = useState<string[]>([]);

    // Controls now manages color selection + randomizing. Initial load handled here.
    useEffect(() => {
        const fetchCard = async () => {
            try {
                const cardData = await fetchRandomCommanderCard(colorFilters);
                setCard(cardData);
                
                const constraint = detectPartnerConstraint(cardData);
                if (constraint.type !== "none") {
                    const partnerCard = await fetchRandomPartnerCard(colorFilters, constraint, cardData);
                    if (partnerCard) {
                        setPartner(partnerCard);
                    } else {
                        setPartner(null);
                    }
                } else {
                    setPartner(null);
                }
            } catch (err) {
                console.error("Error fetching card on mount:", err);
            }
        };
        fetchCard();
    }, []);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <h1>Random Commander Card</h1>
                    <Controls
                        handleColorFilterChange={(value) => {
                            setColorFilters(value);
                        }}
                        onCard={(card) => {
                            setPartner(null);
                            setCard(card);
                        }}
                        onPartner={(card) => {
                            setPartner(card);
                        }}
                        colorFilters={colorFilters}
                    />

                    {card ? (
                        <div className={styles.content}>
                            <div className={styles.headerRow}>
                                <h2 className={styles.cardTitle}>
                                    {card.name}
                                </h2>
                                <div />
                            </div>
                            <div className={styles.leftColumn}>
                                <CommanderCard card={card} edhrecUrl={buildEdhrecUrl(card, partner)} />
                                {partner && <CommanderCard card={partner} edhrecUrl={buildEdhrecUrl(card, partner)} />}
                            </div>

                            <div className={styles.rightColumn}>
                                <EdhrecSummary card={card} baseEdhrecUrl={buildEdhrecUrl(card, partner)} />
                            </div>
                        </div>
                    ) : (
                        <div className={styles.content}>
                            <div className={styles.leftColumn}>
                                <div
                                    className={styles.cardSkeleton}
                                    aria-hidden="true"
                                />
                            </div>

                            <div className={styles.rightColumn}>
                                <div className={styles.headerRow}>
                                    <div
                                        className={styles.titleSkeleton}
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className={styles.edhrec}>
                                    <div className={styles.edhrecSkeleton}>
                                        <div className={styles.skelLine} />
                                        <div
                                            style={{ display: "flex", gap: 8 }}
                                        >
                                            <div className={styles.skelSmall} />
                                            <div className={styles.skelSmall} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <footer className={styles.siteFooter}>
                <div className="author">
                    <p>
                        Made by{" "}
                        <a href="https://github.com/GEOFAIRY">GEOFAIRY</a>
                    </p>
                </div>
                <div className="repo">
                    Open Source at{" "}
                    <a href="https://github.com/GEOFAIRY/random-commander">
                        GitHub
                    </a>
                </div>
                <div className="credit">
                    <div className="scryfall">
                        <p>
                            Card information and Image provided by{" "}
                            <a href="https://scryfall.com/">Scryfall</a>
                        </p>
                    </div>
                    <div className="edhrec">
                        <p>
                            Deck usage information provided by{" "}
                            <a href="https://edhrec.com">EDHRecs</a>
                        </p>
                    </div>
                </div>
                <div className="contact">
                    <p>
                        Contact at{" "}
                        <a href="mailto:krs19@xtra.co.nz">krs19@xtra.co.nz</a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
