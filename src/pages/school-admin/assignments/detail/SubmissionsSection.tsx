import { useCallback, useMemo, useState } from 'react';
import { Avatar } from '../../../../components/ui/Avatar';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { Input } from '../../../../components/ui/Input';
import { LoadingState } from '../../../../components/ui/LoadingState';
import { Pagination } from '../../../../components/ui/Pagination';
import { Select } from '../../../../components/ui/Select';
import { Table, type Column } from '../../../../components/ui/Table';
import { useAsync } from '../../../../hooks/useAsync';
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';
import { listSubmissions } from '../../../../services/assignmentService';
import type { AssignmentDetail, GradingFilter, SubmissionListParams, SubmissionRow, SubmissionStatus } from '../../../../types/assignment';
import { formatDateTime } from '../../../../utils/format';
import { SubmissionStatusBadge } from '../AssignmentBadges';
import { GradeSubmissionModal } from './GradeSubmissionModal';

const PAGE_SIZE = 10;
const none = <span className="text-charcoal-muted">—</span>;

function List({ a, onGraded }: { a: AssignmentDetail; onGraded: () => void }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<SubmissionStatus | ''>('');
  const [grading, setGrading] = useState<GradingFilter | ''>('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<SubmissionRow | null>(null);
  const q = useDebouncedValue(search.trim(), 300);
  const s = a.summary;

  const params = useMemo<SubmissionListParams>(() => ({ page, page_size: PAGE_SIZE, search: q || undefined, status: status || undefined, grading: grading || undefined }), [page, q, status, grading]);
  const { data, error, loading, reload } = useAsync(useCallback(() => listSubmissions(a.id, params), [a.id, params]));
  const rows = data && !error ? data.data : null;
  const clear = () => { setSearch(''); setStatus(''); setGrading(''); setPage(1); };

  const columns: Column<SubmissionRow>[] = [
    { key: 'learner', header: 'Learner', className: 'whitespace-nowrap', render: (r) => <div className="flex items-center gap-2"><Avatar name={r.full_name} src={r.photo_url} size={32} /><span className="font-semibold">{r.full_name}</span></div> },
    { key: 'id', header: 'Student ID', className: 'whitespace-nowrap', render: (r) => <span className="text-xs font-semibold text-charcoal-lighter">{r.student_number}</span> },
    { key: 'status', header: 'Submission', className: 'whitespace-nowrap', render: (r) => <SubmissionStatusBadge status={r.status} /> },
    { key: 'time', header: 'Submitted', className: 'whitespace-nowrap', render: (r) => r.submitted_at ? <span className={`text-xs ${r.status === 'LATE' ? 'font-medium text-orange-dark' : 'text-charcoal-lighter'}`}>{formatDateTime(r.submitted_at)}</span> : none },
    { key: 'score', header: 'Score', className: 'whitespace-nowrap', render: (r) => r.status === 'NOT_SUBMITTED' ? none : r.score === null ? <span className="text-xs italic text-charcoal-muted">Pending</span> : (
      <div className="flex flex-col"><b>{r.score} / {a.max_score}</b>{r.grade && <span className="text-[11px] text-charcoal-muted">{r.grade}{r.remark ? ` · ${r.remark}` : ''}</span>}</div>
    ) },
    { key: 'grading', header: 'Grading', className: 'whitespace-nowrap', render: (r) => r.status === 'NOT_SUBMITTED' ? none : <Badge tone={r.graded ? 'teal' : 'orange'}>{r.graded ? 'Graded' : 'Awaiting'}</Badge> },
    { key: 'actions', header: 'Actions', className: 'text-right whitespace-nowrap', render: (r) => r.status === 'NOT_SUBMITTED' ? none : (
      <button type="button" onClick={() => setSelected(r)} className={`rounded-md px-3 py-1 text-[11px] font-bold transition-colors ${r.graded ? 'bg-warm-100 hover:bg-warm-200' : 'bg-orange text-charcoal hover:bg-orange-light'}`}>{r.graded ? 'Review' : 'Grade'}</button>
    ) },
  ];

  return (
    <Card className="overflow-hidden p-0">
      <div className="space-y-3 p-6">
        <h2 className="text-lg font-semibold">Student Submissions</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
          <Input filled icon="search" aria-label="Search learners" className="md:col-span-6" placeholder="Search learner name or ID..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <Select filled aria-label="Submission status" className="md:col-span-3" value={status} onChange={(e) => { setStatus(e.target.value as SubmissionStatus | ''); setPage(1); }}
            options={[{ value: '', label: `All (${s.expected})` }, { value: 'SUBMITTED', label: `Submitted (${s.on_time})` }, { value: 'LATE', label: `Late (${s.late})` }, { value: 'NOT_SUBMITTED', label: `Not submitted (${s.not_submitted})` }]} />
          <Select filled aria-label="Grading" className="md:col-span-3" value={grading} onChange={(e) => { setGrading(e.target.value as GradingFilter | ''); setPage(1); }}
            options={[{ value: '', label: 'All grading' }, { value: 'GRADED', label: `Graded (${s.graded})` }, { value: 'AWAITING', label: `Awaiting review (${s.awaiting_review})` }]} />
        </div>
      </div>
      {loading && !data && <LoadingState label="Loading submissions…" />}
      {error && <ErrorState title="Unable to load submissions" message={`${error.message} Please try again.`} onRetry={reload} />}
      {rows && rows.length === 0 && <EmptyState title="No learners found" message="Try changing your search or filters." action={<Button variant="primary" onClick={clear}>Clear Filters</Button>} />}
      {rows && rows.length > 0 && data && (
        <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <Table columns={columns} rows={rows} getRowKey={(r) => r.id} />
          <div className="border-t border-warm-200"><Pagination pagination={data.pagination} onPageChange={setPage} itemLabel="learners" /></div>
        </div>
      )}
      <GradeSubmissionModal maxScore={a.max_score} row={selected} onClose={() => setSelected(null)} onSaved={() => { setSelected(null); reload(); onGraded(); }} />
    </Card>
  );
}

export function SubmissionsSection({ a, onGraded }: { a: AssignmentDetail; onGraded: () => void }) {
  if (a.status === 'DRAFT') {
    return <Card><EmptyState icon="inbox" title="Not published yet" message="Learners can submit work once this assignment is published." /></Card>;
  }
  return <List a={a} onGraded={onGraded} />;
}
