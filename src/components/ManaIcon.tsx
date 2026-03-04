'use client';

export type ManaId = 'W' | 'U' | 'B' | 'R' | 'G' | 'C';

type Props = {
  id: ManaId;
  className?: string;
};

export default function ManaIcon({ id, className }: Props) {
  return <i className={`ms ms-${id.toLowerCase()} ${className ?? ''}`}></i>;
}
