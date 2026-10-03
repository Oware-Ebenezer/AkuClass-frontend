import { Icon } from '../../../components/ui/Icon';
import { StatTile } from '../../../components/ui/StatTile';
import type { StudentSummary } from '../../../types/student';

export function StudentSummaryBand({ summary }: { summary: StudentSummary }) {
  const up = summary.attendance_change >= 0;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile label="Total Enrolled" icon="school" value={summary.total.toLocaleString()}
        aside={<span className="rounded-full bg-teal-pale px-2 py-0.5 font-bold text-teal-dark">+{summary.enrolled_this_term} this term</span>} />
      <StatTile label="JHS Population" icon="menu_book" value={summary.jhs.toLocaleString()} aside="JHS 1–3" />
      <StatTile label="SHS Population" icon="domain" value={summary.shs.toLocaleString()} aside="SHS 1–3" />
      <StatTile label="Average Attendance" icon="fact_check" value={`${summary.average_attendance}%`}
        aside={<span className="inline-flex items-center font-semibold text-teal"><Icon name={up ? 'arrow_upward' : 'arrow_downward'} size={16} />{Math.abs(summary.attendance_change)}%</span>} />
    </div>
  );
}
