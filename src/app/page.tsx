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

    // EDHREC handled by helper in src/lib/api
    // (keeps fetch logic separated and testable)

    const fetchRandomCard = useCallback(async () => {
        try {
            const cardData = await fetchRandomCommanderCard();
            setCard(cardData);

            // fetch EDHREC for this commander
            setEdhrec(null);
            setEdhrecError(null);
            setEdhrecLoading(true);
            try {
                const edh = await fetchEdhrecByName(cardData.name);
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
                        <p>Loading...</p>
                    )}
                    <button
                        onClick={fetchRandomCard}
                        style={{ marginTop: "20px" }}
                    >
                        Get Another Card
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
