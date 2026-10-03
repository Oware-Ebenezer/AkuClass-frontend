import { Link } from 'react-router-dom';
import { Card } from '../../../../components/ui/Card';
import type { StudentDetail } from '../../../../types/student';
import { CardTitle } from './StudentInformationCard';

export function AttendanceSummaryCard({ student }: { student: StudentDetail }) {
  const a = student.attendance_summary;
  const blocks = [
    { label: 'Present', value: a.present, box: 'bg-teal-pale', text: 'text-teal-dark' },
    { label: 'Absent', value: a.absent, box: 'bg-danger-pale', text: 'text-danger' },
    { label: 'Late', value: a.late, box: 'bg-orange-pale', text: 'text-orange-dark' },
    { label: 'Excused', value: a.excused, box: 'bg-warm-100', text: 'text-charcoal-lighter' },
  ];
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle icon="event_available">Attendance Summary</CardTitle>
        <Link to="/app/attendance" className="text-xs font-semibold text-teal hover:text-teal-dark">History →</Link>
      </div>
      <p className="text-xs text-charcoal-muted">Accumulated record for Academic Year {student.academic_year}</p>
      <div className="space-y-2 rounded-xl bg-warm-100 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="text-4xl leading-[2.75rem] font-bold tracking-tight text-teal">{a.rate}%</span>
            <span className="block text-[11px] font-bold tracking-wider text-charcoal-muted uppercase">Cumulative Attendance Rate</span>
          </div>
          <span className="rounded bg-teal-pale px-2 py-0.5 text-xs font-semibold text-teal-dark">Target: {a.target_percent}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-warm-200" role="img" aria-label={`Cumulative attendance ${a.rate}%`}>
          <div className="h-full rounded-full bg-teal" style={{ width: `${a.rate}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {blocks.map((b) => (
          <div key={b.label} className={`flex flex-col rounded-lg p-3 ${b.box}`}>
            <span className={`text-[11px] font-bold tracking-wider uppercase ${b.text}`}>{b.label}</span>
            <span className={`mt-0.5 text-xl font-bold ${b.text}`}>{b.value}</span>
            <span className="text-xs text-charcoal-lighter">sessions</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
