import type { ReactNode } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/ui/Icon';
import type { AssignmentDetail } from '../../../../types/assignment';
import { formatDate, formatTimeOfDay, percent, relativeDay } from '../../../../utils/format';

interface MetricProps { label: string; icon: string; value: ReactNode; bar?: { pct: number; className: string }; footer?: ReactNode; }

function Metric({ label, icon, value, bar, footer }: MetricProps) {
  return (
    <Card className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-charcoal-lighter uppercase">{label}</span>
        <Icon name={icon} className="text-teal" />
      </div>
      <div className="text-xl font-bold">{value}</div>
      {bar && <div className="h-2 overflow-hidden rounded-full bg-warm-100"><div className={`h-full rounded-full ${bar.className}`} style={{ width: `${bar.pct}%` }} /></div>}
      {footer && <div className="text-[11px] text-charcoal-muted">{footer}</div>}
    </Card>
  );
}

export function AssignmentMetrics({ a }: { a: AssignmentDetail }) {
  const s = a.summary;
  const deadlineNote = a.status === 'DRAFT' ? 'Not published' : a.status === 'CLOSED' ? 'Closed' : `${relativeDay(a.due_at)} · ${formatTimeOfDay(a.due_at)}`;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Learners" icon="groups" value={s.expected} footer={`${a.class.name} class roll`} />
      <Metric label="Submissions Received" icon="upload_file" value={<>{s.received} / {s.expected} <span className="text-sm text-teal">({percent(s.received, s.expected)}%)</span></>}
        bar={{ pct: percent(s.received, s.expected), className: 'bg-teal' }} footer={`${s.on_time} on time · ${s.late} late · ${s.not_submitted} not submitted`} />
      <Metric label="Grading Progress" icon="rate_review" value={<>{s.graded} / {s.received} <span className="text-sm text-orange-dark">graded</span></>}
        bar={{ pct: percent(s.graded, s.received), className: 'bg-orange' }}
        footer={<>{s.awaiting_review} awaiting review{s.average_score !== null && <> · Average {s.average_score} / {a.max_score}</>}</>} />
      <Metric label="Deadline" icon="timer" value={<span className="text-base">{formatDate(a.due_at, { day: 'numeric', month: 'short', year: 'numeric' })} • {formatTimeOfDay(a.due_at)}</span>}
        footer={<>{deadlineNote}{a.published_at && <> · Published {formatDate(a.published_at)}</>}</>} />
    </div>
  );
}
