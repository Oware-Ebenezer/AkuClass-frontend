import { Card } from '../../../components/ui/Card';
import { StatTile } from '../../../components/ui/StatTile';
import { ATTENDANCE_BAR, ATTENDANCE_LABEL, ATTENDANCE_ORDER } from '../../../constants/attendance';
import type { AttendanceStatus } from '../../../types';
import type { AttendanceSession } from '../../../types/attendance';
import { formatDate, percent, todayIso } from '../../../utils/format';

const icons: Record<AttendanceStatus, string> = { PRESENT: 'check_circle', ABSENT: 'cancel', LATE: 'schedule', EXCUSED: 'assignment_turned_in' };

export function AttendanceSummary({ session }: { session: AttendanceSession }) {
  const s = session.summary;
  const counts: Record<AttendanceStatus, number> = { PRESENT: s.present, ABSENT: s.absent, LATE: s.late, EXCUSED: s.excused };
  // "Today's Attendance" only when the selected date is today.
  const title = session.date === todayIso() ? "Today's Attendance" : `Attendance on ${formatDate(session.date, { day: 'numeric', month: 'long', year: 'numeric' })}`;

  return (
    <section className="space-y-4" aria-label={title}>
      <h2 className="px-1 text-lg font-semibold">{title} <span className="text-sm font-normal text-charcoal-muted">· {session.class_name}</span></h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {ATTENDANCE_ORDER.map((st) => (
          <StatTile key={st} label={ATTENDANCE_LABEL[st]} icon={icons[st]} value={counts[st]} aside={`${percent(counts[st], s.enrolled)}% of class`} />
        ))}
      </div>
      <Card className="space-y-2 p-4">
        <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-warm-100 p-0.5" role="img" aria-label="Class attendance breakdown">
          {ATTENDANCE_ORDER.map((st) => <div key={st} className={`h-full ${ATTENDANCE_BAR[st]}`} style={{ width: `${percent(counts[st], s.enrolled)}%` }} title={`${ATTENDANCE_LABEL[st]}: ${counts[st]}`} />)}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-charcoal-muted">
          <div className="flex flex-wrap items-center gap-4">
            {ATTENDANCE_ORDER.map((st) => <span key={st} className="inline-flex items-center gap-1"><span className={`size-2 rounded-full ${ATTENDANCE_BAR[st]}`} />{ATTENDANCE_LABEL[st]} ({counts[st]})</span>)}
          </div>
          <span className="font-semibold text-charcoal">{s.enrolled} learners on roll</span>
        </div>
      </Card>
    </section>
  );
}
