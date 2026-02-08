'use client';

export type ManaId = 'W' | 'U' | 'B' | 'R' | 'G' | 'C';

type Props = {
  id: ManaId;
  className?: string;
};

export default function ManaIcon({ id, className }: Props) {
  // simple, compact mana glyphs used in buttons
  if (id === 'W') {
    return <i className={`ms ms-w ${className}`}></i>;
  }

  if (id === 'U') {
    return <i className={`ms ms-u ${className}`}></i>;
  }

  if (id === 'B') {
    return <i className={`ms ms-b ${className}`}></i>;
  }

  if (id === 'R') {
    return <i className={`ms ms-r ${className}`}></i>;
  }

  if (id === 'G') {
    return <i className={`ms ms-g ${className}`}></i>;
  }

  // C / colorless
  return <i className={`ms ms-c ${className}`}></i>;
}
