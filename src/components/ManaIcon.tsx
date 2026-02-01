"use client";
import React from "react";

type Props = {
  id: string;
  className?: string;
};

export default function ManaIcon({ id, className }: Props) {
  // simple, compact mana glyphs used in buttons
  if (id === "W") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="4" />
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="12" y1="1.5" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22.5" y2="12" />
          <line x1="4.5" y1="4.5" x2="7.5" y2="7.5" />
          <line x1="16.5" y1="16.5" x2="19.5" y2="19.5" />
          <line x1="4.5" y1="19.5" x2="7.5" y2="16.5" />
          <line x1="16.5" y1="7.5" x2="19.5" y2="4.5" />
        </g>
      </svg>
    );
  }

  if (id === "U") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 2C9.5 6 7 9 7 12a5 5 0 0010 0c0-3-2.5-6-5-10z" />
      </svg>
    );
  }

  if (id === "B") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M7 7c1-2 7-2 8 0 1 2 0 4-1 5 1 1 2 3 2 5 0 2-2 4-6 4s-6-2-6-4c0-2 1-4 2-5-1-1-2-3-1-5z" />
      </svg>
    );
  }

  if (id === "R") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 2s4 4 4 8-3 5-4 8c-1-3-4-4-4-8s4-8 4-8z" />
      </svg>
    );
  }

  if (id === "G") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 2s6 4 4 10-8 8-8 8 0-6 4-10 4-8 4-8z" />
      </svg>
    );
  }

  // C / colorless
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <polygon points="12,3 21,12 12,21 3,12" />
    </svg>
  );
}
