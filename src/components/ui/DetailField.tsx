import type { ReactNode } from 'react';
import { Icon } from './Icon';

export function CardTitle({ icon, children }: { icon: string; children: ReactNode }) {
  return <h2 className="flex items-center gap-1 text-lg font-semibold"><Icon name={icon} size={22} className="text-teal" />{children}</h2>;
}

export function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[11px] font-bold tracking-wider text-charcoal-muted uppercase">{label}</span>
      <span className="text-sm text-charcoal">{children}</span>
    </div>
  );
}
