import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/ui/Icon';
import type { AttendanceToday } from '../../../types';
import { formatDate, percent } from '../../../utils/format';

export function AttendanceOverview({ data }: { data: AttendanceToday }) {
  const segments = [
    { key: 'Present', value: data.present, bar: 'bg-teal', card: 'bg-teal-pale', text: 'text-teal-dark', dot: 'bg-teal' },
    { key: 'Absent', value: data.absent, bar: 'bg-danger', card: 'bg-danger-pale', text: 'text-danger', dot: 'bg-danger' },
    { key: 'Late', value: data.late, bar: 'bg-orange', card: 'bg-orange-pale', text: 'text-orange-dark', dot: 'bg-orange' },
    { key: 'Excused', value: data.excused, bar: 'bg-charcoal-muted', card: 'bg-warm-100', text: 'text-charcoal-lighter', dot: 'bg-charcoal-muted' },
  ];
  const rate = percent(data.present, data.enrolled);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-1 text-xl font-bold"><Icon name="fact_check" className="text-teal" />Today's Attendance</h2>
          <p className="mt-0.5 text-xs text-charcoal-muted">
            {formatDate(data.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link to="/app/attendance" className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:text-teal-dark">
          View Full Attendance Sheet<Icon name="arrow_forward" size={16} />
        </Link>
      </div>

      <div>
        <div className="flex h-3 overflow-hidden rounded-full bg-warm-100" role="img" aria-label={`Today's attendance ${rate}%`}>
          {segments.map((s) => (
            <div key={s.key} className={s.bar} style={{ width: `${percent(s.value, data.enrolled)}%` }} title={`${s.key}: ${s.value}`} />
          ))}
        </div>
        <div className="flex justify-between px-1 pt-1.5 text-[11px] text-charcoal-muted">
          <span>Today's Attendance: {rate}%</span>
          <span>Target: {data.targetPercent}%+</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {segments.map((s) => (
          <div key={s.key} className={`rounded-lg p-4 ${s.card}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold ${s.text}`}>{s.key}</span>
              <span className={`size-2 rounded-full ${s.dot}`} />
            </div>
            <div className={`mt-2 text-xl font-bold ${s.text}`}>{s.value}</div>
            <div className="text-[11px] text-charcoal-lighter">{percent(s.value, data.enrolled)}% of school</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-lg bg-warm-100 p-4 sm:flex-row sm:items-center">
        <span className="flex items-center gap-2 text-xs font-semibold"><Icon name="analytics" className="text-teal" />Today's Attendance by Section</span>
        <div className="flex flex-1 flex-wrap items-center justify-around gap-4 text-xs">
          {([['Junior High School (JHS)', data.jhs, 'bg-teal'], ['Senior High School (SHS)', data.shs, 'bg-orange-dark']] as const).map(([label, d, dot]) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`size-2.5 rounded-full ${dot}`} />
              <span className="text-charcoal-muted">{label}:</span>
              <span className="font-bold">{percent(d.present, d.enrolled)}%</span>
              <span className="font-semibold text-charcoal-lighter">({d.present}/{d.enrolled})</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
