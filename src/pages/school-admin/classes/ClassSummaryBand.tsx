import { StatTile } from '../../../components/ui/StatTile';
import type { ClassCounts } from '../../../services/classService';

export function ClassSummaryBand({ counts, yearLabel }: { counts: ClassCounts; yearLabel: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile label="Total Classes" icon="meeting_room" value={counts.total} aside={`Academic Year ${yearLabel}`} />
      <StatTile label="JHS Classes" icon="school" value={counts.jhs} aside="JHS 1–3" />
      <StatTile label="SHS Classes" icon="apartment" value={counts.shs} aside="SHS 1–3" />
      <StatTile label="Total Enrolled" icon="groups" value={counts.students.toLocaleString()} aside={`across ${counts.total} classes`} />
    </div>
  );
}
