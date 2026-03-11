'use client';
import Image from 'next/image';
import { type HistoryEntry } from '../lib/history';

type Props = {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
};

export default function HistoryPanel({ history, onSelect, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="w-full mt-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="m-0 text-sm font-semibold text-text-secondary">Recently Rolled</h3>
        <button
          className="bg-transparent border-none text-text-secondary text-xs cursor-pointer px-1.5 py-0.5 rounded hover:bg-btn-hover"
          onClick={onClear}
          type="button"
        >
          Clear
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {history.map((entry) => (
          <button
            key={entry.scryfallId}
            className="flex-none cursor-pointer rounded-lg border-2 border-transparent bg-transparent p-0 transition-all duration-150 hover:border-btn-border hover:-translate-y-0.5"
            onClick={() => onSelect(entry)}
            type="button"
            title={entry.name}
          >
            <Image
              src={entry.imageUri}
              alt={entry.name}
              width={60}
              height={84}
              className="rounded-md object-cover block"
              loading="lazy"
            />
            <div className="text-[10px] text-text-secondary max-w-15 overflow-hidden text-ellipsis whitespace-nowrap text-center mt-0.5">
              {entry.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
