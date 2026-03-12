'use client';
import { useCallback, useEffect, useState } from 'react';
import ManaIcon from './ManaIcon';
import type { ManaId } from './ManaIcon';
import { COLORS } from '../lib/constants';
import type { Filters } from '../types';

type Props = {
  colorFilters: string[];
  handleColorFilterChange: (value: string[]) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onRandom: () => Promise<void> | void;
  randomizing: boolean;
};

const CMC_RANGES = ['0-2', '3-4', '5-6', '7+'] as const;

export default function Controls({
  colorFilters,
  handleColorFilterChange,
  filters,
  onFiltersChange,
  onRandom,
  randomizing,
}: Props) {
  const [typeInput, setTypeInput] = useState('');

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

  const toggleCmcRange = useCallback(
    (range: string) => {
      const newRanges = filters.cmcRanges.includes(range)
        ? filters.cmcRanges.filter((r) => r !== range)
        : [...filters.cmcRanges, range];
      onFiltersChange({ ...filters, cmcRanges: newRanges });
    },
    [filters, onFiltersChange]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const types = typeInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const current = filters.types.join(',');
      const next = types.join(',');
      if (current !== next) {
        onFiltersChange({ ...filters, types });
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeInput]);

  return (
    <div className="flex flex-col items-center w-full gap-4 my-6">
      <div className="flex justify-center items-center w-full gap-7.5 max-md:flex-wrap">
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

      <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 w-full">
        <span className="text-xs text-text-secondary font-medium">CMC:</span>
        {CMC_RANGES.map((range) => {
          const active = filters.cmcRanges.includes(range);
          return (
            <button
              key={range}
              type="button"
              aria-pressed={active}
              onClick={() => toggleCmcRange(range)}
              className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer transition-all duration-150 ${
                active
                  ? 'bg-text-primary text-surface border-text-primary'
                  : 'bg-transparent text-text-secondary border-btn-border hover:border-text-secondary'
              } disabled:opacity-70 disabled:cursor-wait`}
              disabled={randomizing}
            >
              {range}
            </button>
          );
        })}

        <span className="mx-1 text-btn-border">|</span>

        <button
          type="button"
          aria-pressed={filters.partnerOnly}
          onClick={() => onFiltersChange({ ...filters, partnerOnly: !filters.partnerOnly })}
          className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer transition-all duration-150 ${
            filters.partnerOnly
              ? 'bg-text-primary text-surface border-text-primary'
              : 'bg-transparent text-text-secondary border-btn-border hover:border-text-secondary'
          } disabled:opacity-70 disabled:cursor-wait`}
          disabled={randomizing}
        >
          Partners Only
        </button>

        <span className="mx-1 text-btn-border">|</span>

        <span className="text-xs text-text-secondary font-medium">Type:</span>
        <input
          type="text"
          value={typeInput}
          onChange={(e) => setTypeInput(e.target.value)}
          placeholder="e.g. Elf, Dragon, Wizard"
          className="px-2.5 py-1 text-xs rounded-md border border-btn-border bg-transparent text-text-primary placeholder:text-text-secondary/50 outline-none focus:border-text-secondary transition-colors w-44"
          disabled={randomizing}
        />
      </div>
    </div>
  );
}
