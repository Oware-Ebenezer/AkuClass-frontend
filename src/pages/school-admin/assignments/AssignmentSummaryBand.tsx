import { StatTile } from '../../../components/ui/StatTile';
import type { AssignmentCounts } from '../../../services/assignmentService';

export function AssignmentSummaryBand({ counts }: { counts: AssignmentCounts }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile label="Total Assignments" icon="assignment" value={counts.total} aside={`${counts.closed} closed`} />
      <StatTile label="Published" icon="publish" value={counts.published} />
      <StatTile label="Draft" icon="edit_note" value={counts.draft} aside="Visible to staff only" />
      <StatTile label="Due This Week" icon="event" value={counts.dueThisWeek} aside="Published assignments" />
    </div>
  );
}
