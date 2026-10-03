import type { ReactNode } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';

interface StatTileProps { label: string; icon: string; value: ReactNode; aside?: ReactNode; }

export function StatTile({ label, icon, value, aside }: StatTileProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-charcoal-lighter uppercase">{label}</span>
        <Icon name={icon} className="text-teal" />
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-[28px] leading-9 font-bold">{value}</span>
        {aside && <span className="text-[11px] text-charcoal-muted">{aside}</span>}
      </div>
    </Card>
  );
}
