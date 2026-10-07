import type { ReactNode } from 'react';
import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/ui/Icon';
import type { ResultsSummary } from '../../../types/result';
import { percent } from '../../../utils/format';

function Metric({ label, icon, value, bar, footer }: { label: string; icon: string; value: ReactNode; bar?: number; footer?: ReactNode }) {
  return (
    <Card className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-charcoal-lighter uppercase">{label}</span>
        <Icon name={icon} className="text-teal" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {bar !== undefined && <div className="h-1.5 overflow-hidden rounded-full bg-warm-100"><div className="h-full rounded-full bg-teal" style={{ width: `${bar}%` }} /></div>}
      {footer && <div className="text-[11px] text-charcoal-muted">{footer}</div>}
    </Card>
  );
}

export function ResultMetrics({ s }: { s: ResultsSummary }) {
  const pending = s.expected - s.entered;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Metric label="Learners" icon="groups" value={s.expected} footer="On the class roll" />
      <Metric label="Results Entered" icon="fact_check" value={<>{s.entered} <span className="text-base font-normal text-charcoal-muted">/ {s.expected}</span></>}
        bar={percent(s.entered, s.expected)} footer={pending > 0 ? `${pending} still to enter` : 'All results entered'} />
      <Metric label="Class Average" icon="trending_up" value={s.average === null ? '—' : `${percent(s.average, s.total_max)}%`} footer={s.average === null ? undefined : `${s.average} out of ${s.total_max}`} />
      <Metric label="Score Range" icon="analytics" value={s.highest === null ? '—' : <span className="text-lg">High {s.highest} · Low {s.lowest}</span>} footer={s.highest === null ? undefined : `Out of ${s.total_max}`} />
    </div>
  );
}
