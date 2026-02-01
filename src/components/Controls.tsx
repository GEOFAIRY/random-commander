"use client";
import styles from "../app/page.module.css";
import { useState } from "react";
import { fetchRandomCommanderCard } from "../lib/api";
import { Card } from "../types";
import ManaIcon from "./ManaIcon";

type Props = {
    onCard: (card: Card) => void;
    colorFilters: string[];
    handleColorFilterChange: (value: string[]) => void;
};

export default function Controls({
    onCard,
    colorFilters,
    handleColorFilterChange,
}: Props) {
    const [randomizing, setRandomizing] = useState(false);

    const COLORS = [
        { id: "W", title: "White", bg: "#f8f6e8", fg: "#111" },
        { id: "U", title: "Blue", bg: "#dbe8ff", fg: "#0a3b66" },
        { id: "B", title: "Black", bg: "#cfcfcf", fg: "#111" },
        { id: "R", title: "Red", bg: "#ffd9d6", fg: "#7a0900" },
        { id: "G", title: "Green", bg: "#dff6e2", fg: "#0b4d21" },
        { id: "C", title: "Colorless", bg: "#f2f2f2", fg: "#444" },
    ];

    const toggleColor = (id: string) => {
        let newFilters;
        if (id === "C" && !colorFilters.includes(id)) newFilters = ["C"];
        else {
            newFilters = colorFilters.includes(id)
                ? colorFilters.filter((c) => c !== id)
                : [...colorFilters, id];
            newFilters = newFilters.filter((c) => c !== "C");
        }
        handleColorFilterChange(newFilters);
    };

    const handleRandom = async () => {
        setRandomizing(true);
        try {
            const card = await fetchRandomCommanderCard(colorFilters);
            onCard(card);
        } catch (err) {
            console.error("Error fetching card:", err);
        } finally {
            setRandomizing(false);
        }
    };

    return (
        <div className={styles.contentHeader}>
            <div className={styles.colorFilters}>
                {COLORS.map((c) => {
                    const pressed = colorFilters.includes(c.id);
                    return (
                        <button
                            key={c.id}
                            type="button"
                            title={c.title}
                            aria-pressed={pressed}
                            onClick={() => toggleColor(c.id)}
                            className={styles.colorButton}
                            style={
                                {
                                    "--cb-bg": c.bg,
                                    "--cb-fg": c.fg,
                                    background: pressed ? c.bg : "#929292a9",
                                    color: c.fg,
                                    borderColor: pressed ? c.fg : undefined,
                                } as React.CSSProperties
                            }
                            disabled={randomizing}
                        >
                            <span
                                className={styles.manaIcon}
                                aria-hidden="true"
                            >
                                <ManaIcon id={c.id} />
                            </span>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={handleRandom}
                className={styles.randomizeButton}
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
                <span style={{ marginLeft: 8 }}>
                    {randomizing ? "Randomizing…" : "Get Another Card"}
                </span>
            </button>
        </div>
    );
}
