import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/ui/Icon';
import type { ResultsSummary } from '../../../types/result';
import { percent } from '../../../utils/format';

const COLORS = ['bg-teal', 'bg-teal-light', 'bg-orange', 'bg-orange-light', 'bg-charcoal-muted'];

export function GradeDistribution({ s }: { s: ResultsSummary }) {
  if (s.entered === 0 || s.distribution.length === 0) return null;
  return (
    <Card className="space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-1 text-sm font-bold"><Icon name="bar_chart" className="text-teal" />Grade Distribution</h2>
        <span className="text-[11px] text-charcoal-muted">Based on {s.entered} entered results</span>
      </div>
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-warm-100" role="img" aria-label="Grade distribution">
        {s.distribution.map((d, i) => <div key={d.grade} className={COLORS[i % COLORS.length]} style={{ width: `${percent(d.count, s.entered)}%` }} title={`Grade ${d.grade}: ${d.count}`} />)}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
        {s.distribution.map((d, i) => (
          <span key={d.grade} className="inline-flex items-center gap-2">
            <span className={`size-3 rounded-full ${COLORS[i % COLORS.length]}`} />
            <b>Grade {d.grade}</b><span className="text-charcoal-muted">{d.count} learners ({percent(d.count, s.entered)}%)</span>
          </span>
        ))}
      </div>
    </Card>
  );
}
