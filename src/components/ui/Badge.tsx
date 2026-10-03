import type { ReactNode } from 'react';

export type BadgeTone = 'teal' | 'orange' | 'neutral' | 'danger';
const tones: Record<BadgeTone, string> = {
  teal: 'bg-teal-pale text-teal-dark',
  orange: 'bg-orange-pale text-charcoal',
  neutral: 'bg-warm-200 text-charcoal-lighter',
  danger: 'bg-danger-pale text-danger',
};

interface BadgeProps { tone?: BadgeTone; dot?: boolean; children: ReactNode; }

export function Badge({ tone = 'neutral', dot = false, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tones[tone]}`}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
