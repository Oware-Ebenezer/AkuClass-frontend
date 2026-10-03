import { Link } from 'react-router-dom';
import { Badge } from '../../../../components/ui/Badge';
import { Card } from '../../../../components/ui/Card';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { Icon } from '../../../../components/ui/Icon';
import { Table, type Column } from '../../../../components/ui/Table';
import { useSession } from '../../../../context/SessionContext';
import type { StudentResult } from '../../../../types/student';
import { CardTitle } from './StudentInformationCard';

const columns: Column<StudentResult>[] = [
  { key: 'subject', header: 'Subject', render: (r) => <span className="font-medium">{r.subject}</span> },
  { key: 'score', header: 'Score', className: 'text-center', render: (r) => <b>{r.score}%</b> },
  { key: 'grade', header: 'Grade', className: 'text-center', render: (r) => <Badge tone={r.grade.startsWith('A') ? 'teal' : 'neutral'}>{r.grade}</Badge> },
  { key: 'remark', header: 'Remark', render: (r) => <span className="text-xs text-charcoal-muted">{r.remark}</span> },
  { key: 'term', header: 'Term', className: 'text-right whitespace-nowrap', render: (r) => <span className="text-xs text-charcoal-muted">{r.term}</span> },
];

export function ResultsCard({ results }: { results: StudentResult[] }) {
  const { termName } = useSession();
  return (
    <Card className="space-y-2">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
        <div>
          <CardTitle icon="grade">Recent Results</CardTitle>
          <p className="text-xs text-charcoal-muted">{termName} Continuous Assessment &amp; Mid-term Evaluations</p>
        </div>
        <Link to="/app/results" className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:text-teal-dark">
          View Full Results<Icon name="arrow_forward" size={16} />
        </Link>
      </div>
      {results.length === 0 ? <EmptyState icon="grade" title="No results yet" message="Results will appear here once they are entered." />
        : <Table columns={columns} rows={results} getRowKey={(r) => r.id} />}
    </Card>
  );
}
