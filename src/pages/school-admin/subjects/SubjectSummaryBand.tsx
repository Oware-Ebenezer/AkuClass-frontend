import { StatTile } from '../../../components/ui/StatTile';
import type { SubjectCounts } from '../../../services/subjectService';

export function SubjectSummaryBand({ counts }: { counts: SubjectCounts }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile label="Total Subjects" icon="menu_book" value={counts.total} />
      <StatTile label="JHS Only" icon="school" value={counts.jhs} aside="JHS 1–3" />
      <StatTile label="SHS Only" icon="apartment" value={counts.shs} aside="SHS 1–3" />
      <StatTile label="JHS & SHS" icon="swap_horiz" value={counts.both} aside="Taught at both levels" />
    </div>
  );
}
