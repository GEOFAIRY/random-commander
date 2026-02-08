'use client';
import styles from '../app/page.module.css';
import { useCallback, useMemo } from 'react';
import ManaIcon, { ManaId } from './ManaIcon';
import { COLORS } from '../lib/constants';

type Props = {
  colorFilters: string[];
  handleColorFilterChange: (value: string[]) => void;
  onRandom: () => Promise<void> | void;
  randomizing: boolean;
};

export default function Controls({
  colorFilters,
  handleColorFilterChange,
  onRandom,
  randomizing,
}: Props) {
  // Use centralized COLORS (memoized to stable reference for children)
  const colors = useMemo(() => COLORS, []);

  const toggleColor = useCallback(
    (id: ManaId) => {
      let newFilters: string[] = [];
      if (id === 'C' && !colorFilters.includes(id)) newFilters = ['C'];
      else {
        newFilters = colorFilters.includes(id)
          ? colorFilters.filter((c) => c !== id)
          : [...colorFilters, id];
        newFilters = newFilters.filter((c) => c !== 'C');
      }
      handleColorFilterChange(newFilters);
    },
    [colorFilters, handleColorFilterChange]
  );

  const handleRandom = useCallback(async () => {
    try {
      await onRandom();
    } catch (err) {
      console.error('Error fetching card:', err);
    }
  }, [onRandom]);

  return (
    <div className={styles.contentHeader}>
      <div className={styles.colorFilters}>
        {colors.map((c) => {
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
                  '--cb-bg': c.bg,
                  '--cb-fg': c.fg,
                } as React.CSSProperties
              }
              disabled={randomizing}
            >
              <span className={styles.manaIcon} aria-hidden="true">
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
        <span style={{ marginLeft: 8 }}>{randomizing ? 'Randomizing…' : 'Get Another Card'}</span>
      </button>
    </div>
  );
}
