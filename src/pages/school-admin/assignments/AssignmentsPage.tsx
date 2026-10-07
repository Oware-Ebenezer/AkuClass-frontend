import { useCallback, useMemo, useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Icon } from '../../../components/ui/Icon';
import { LoadingState } from '../../../components/ui/LoadingState';
import { Pagination } from '../../../components/ui/Pagination';
import { DEFAULT_ACADEMIC_YEAR_ID } from '../../../constants/academicYears';
import { useAsync } from '../../../hooks/useAsync';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { getAssignmentCounts, listAssignments } from '../../../services/assignmentService';
import { listClasses } from '../../../services/classService';
import { listSubjects } from '../../../services/subjectService';
import type { AssignmentListParams } from '../../../types/assignment';
import { AssignmentFilters, type AssignmentFilterState } from './AssignmentFilters';
import { AssignmentSummaryBand } from './AssignmentSummaryBand';
import { AssignmentsTable } from './AssignmentsTable';
import { CreateAssignmentModal } from './CreateAssignmentModal';

const PAGE_SIZE = 10;
const initialFilters: AssignmentFilterState = { search: '', class_id: '', subject_id: '', status: '', due: '' };

export default function AssignmentsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const search = useDebouncedValue(filters.search.trim(), 300);

  const params = useMemo<AssignmentListParams>(() => ({
    page, page_size: PAGE_SIZE, search: search || undefined, class_id: filters.class_id || undefined, subject_id: filters.subject_id || undefined,
    status: filters.status || undefined, due: filters.due || undefined,
  }), [page, search, filters.class_id, filters.subject_id, filters.status, filters.due]);

  const list = useAsync(useCallback(() => listAssignments(params), [params]));
  const counts = useAsync(getAssignmentCounts);
  const classes = useAsync(useCallback(() => listClasses({ page: 1, page_size: 100, academic_year_id: DEFAULT_ACADEMIC_YEAR_ID, status: 'ACTIVE' }), []));
  const subjects = useAsync(listSubjects);

  const hasFilters = Boolean(filters.search || filters.class_id || filters.subject_id || filters.status || filters.due);
  const clear = () => { setFilters(initialFilters); setPage(1); };
  const change = (patch: Partial<AssignmentFilterState>) => { setFilters((f) => ({ ...f, ...patch })); setPage(1); };
  const saved = () => { setCreating(false); list.reload(); counts.reload(); };

  const { data, error, loading, reload } = list;
  const rows = data && !error ? data.data : null;
  const classList = classes.data?.data ?? [];

  return (
    <PageContainer
      title="Assignments"
      description="Create, schedule, monitor submissions, and grade assignments across JHS and SHS classes."
      actions={<>
        <Button variant="surface"><Icon name="file_download" size={18} className="text-charcoal-muted" />Export Task Log</Button>
        <Button variant="primary" onClick={() => setCreating(true)}><Icon name="add" />Create Assignment</Button>
      </>}
    >
      {counts.data && <AssignmentSummaryBand counts={counts.data} />}
      <AssignmentFilters value={filters} classOptions={classList.map((c) => ({ value: c.id, label: c.name }))} subjectOptions={(subjects.data ?? []).map((s) => ({ value: s.id, label: s.name }))} onChange={change} onClear={clear} />
      <div className="px-1 text-sm font-semibold">{data && !error ? `${data.pagination.total} assignments` : 'Assignments'}</div>

      <Card className="overflow-hidden p-0">
        {loading && !data && <LoadingState label="Loading assignments…" />}
        {error && <ErrorState title="Unable to load assignments" message={`${error.message} Please try again.`} onRetry={reload} />}
        {rows && rows.length === 0 && (
          <EmptyState title="No assignments found" message="Try changing your search or filters." action={hasFilters ? <Button variant="primary" onClick={clear}>Clear Filters</Button> : undefined} />
        )}
        {rows && rows.length > 0 && data && (
          <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <AssignmentsTable rows={rows} />
            <div className="border-t border-warm-200"><Pagination pagination={data.pagination} onPageChange={setPage} itemLabel="assignments" /></div>
          </div>
        )}
      </Card>
      <CreateAssignmentModal open={creating} classes={classList} onClose={() => setCreating(false)} onSaved={saved} />
    </PageContainer>
  );
}
