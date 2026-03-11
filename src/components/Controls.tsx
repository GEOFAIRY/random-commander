'use client';
import { useCallback } from 'react';
import ManaIcon from './ManaIcon';
import type { ManaId } from './ManaIcon';
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

  return (
    <div className="flex justify-center items-center w-full gap-7.5 my-5 max-md:flex-wrap">
      <div className="flex gap-2 items-center">
        {COLORS.map((c) => {
          const pressed = colorFilters.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              title={c.title}
              aria-pressed={pressed}
              onClick={() => toggleColor(c.id)}
              className={`size-10 inline-flex items-center justify-center rounded-lg border border-btn-border bg-gray-500 font-bold cursor-pointer p-0 transition-all duration-150 ${
                pressed
                  ? '-translate-y-0.5 shadow-lg border-(--cb-fg,currentColor) [background:var(--cb-bg)] text-(--cb-fg,currentColor) [&_svg]:drop-shadow-md'
                  : 'hover:-translate-y-0.5 hover:bg-black/5'
              } disabled:opacity-70 disabled:cursor-wait active:translate-y-px [&_svg]:transition-all [&_svg]:duration-150`}
              style={
                {
                  '--cb-bg': c.bg,
                  '--cb-fg': c.fg,
                } as React.CSSProperties
              }
              disabled={randomizing}
            >
              <span aria-hidden="true">
                <ManaIcon id={c.id} />
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onRandom}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-btn-border bg-transparent text-text-primary cursor-pointer transition-all duration-150 hover:shadow-sm active:translate-y-px disabled:opacity-70 disabled:cursor-wait"
        disabled={randomizing}
        aria-busy={randomizing}
      >
        <svg
          className={`size-4.5 ${randomizing ? 'animate-spin' : 'transition-transform duration-200'}`}
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
        <span>{randomizing ? 'Randomizing\u2026' : 'Get Another Card'}</span>
      </button>
    </div>
  );
}
