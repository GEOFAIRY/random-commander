"use client";
import styles from "./page.module.css";
import { useEffect, useState, useCallback } from "react";
import { Card, Edhrec } from "../types";
import { fetchRandomCommanderCard, fetchEdhrecByName } from "../lib/api";
import CommanderCard from "../components/CommanderCard";
import EdhrecSummary from "../components/EdhrecSummary";

const LandingPage = () => {
    const [card, setCard] = useState<Card | null>(null);
    const [edhrec, setEdhrec] = useState<Edhrec | null>(null);
    const [edhrecLoading, setEdhrecLoading] = useState(false);
    const [edhrecError, setEdhrecError] = useState<string | null>(null);
    const [randomizing, setRandomizing] = useState(false);

    // EDHREC handled by helper in src/lib/api
    // (keeps fetch logic separated and testable)

    const fetchRandomCard = useCallback(async () => {
        setRandomizing(true);
        try {
            const cardData = await fetchRandomCommanderCard();
            setCard(cardData);

            // fetch EDHREC for this commander
            setEdhrec(null);
            setEdhrecError(null);
            setEdhrecLoading(true);
            try {
                const edh = await fetchEdhrecByName(cardData.name, cardData.faceCount ?? 1);
                setEdhrec(edh);
            } catch (err: unknown) {
                console.error("EDHREC fetch error:", err);
                const msg = err instanceof Error ? err.message : String(err);
                setEdhrecError(msg || "Failed to fetch EDHREC data");
                setEdhrec(null);
            } finally {
                setEdhrecLoading(false);
            }
        } catch (error) {
            console.error("Error fetching card:", error);
        } finally {
            setRandomizing(false);
        }
    }, []);

    useEffect(() => {
        const fetchCard = async () => {
            await fetchRandomCard();
        };
        fetchCard();
    }, [fetchRandomCard]);

    // Safely normalize panel taglinks into a local array for rendering
    const panelTaglinks = Array.isArray(edhrec?.panels?.taglinks)
        ? edhrec!.panels!.taglinks
        : [];

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <h1>Random Commander Card</h1>
                    {card ? (
                        <div>
                            <CommanderCard card={card} />

                            <EdhrecSummary
                                edhrec={edhrec}
                                loading={edhrecLoading}
                                error={edhrecError}
                                panelTaglinks={panelTaglinks}
                                card={card}
                            />
                        </div>
                    ) : (
                        <div>
                          <div className={styles.cardWrap}>
                            <div className={styles.cardSkeleton} aria-hidden="true" />
                          </div>

                          <div className={styles.edhrec}>
                            <div className={styles.edhrecSkeleton}>
                              <div className={styles.skelLine} />
                              <div style={{ display: 'flex', gap: 8 }}>
                                <div className={styles.skelSmall} />
                                <div className={styles.skelSmall} />
                              </div>
                            </div>
                          </div>
                        </div>
                    )}
                    <button
                        onClick={fetchRandomCard}
                        className={styles.randomizeButton}
                        style={{ marginTop: "20px" }}
                        disabled={randomizing}
                        aria-pressed={randomizing}
                        aria-busy={randomizing}
                    >
                        <svg
                            className={randomizing ? styles.spin : styles.icon}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10"></path>
                            <path d="M20.49 15a9 9 0 0 1-14.13 3.36L1 14"></path>
                        </svg>
                        <span style={{ marginLeft: 8 }}>{randomizing ? "Randomizing…" : "Get Another Card"}</span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
