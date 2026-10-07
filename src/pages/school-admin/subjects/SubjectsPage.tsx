import { useCallback, useMemo, useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Icon } from '../../../components/ui/Icon';
import { LoadingState } from '../../../components/ui/LoadingState';
import { Pagination } from '../../../components/ui/Pagination';
import { useAsync } from '../../../hooks/useAsync';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { getSubjectCounts, listSubjectItems } from '../../../services/subjectService';
import type { SubjectListParams } from '../../../types/subject';
import { AddSubjectModal } from './AddSubjectModal';
import { SubjectDetailsModal } from './SubjectDetailsModal';
import { SubjectFilters, type SubjectFilterState } from './SubjectFilters';
import { SubjectSummaryBand } from './SubjectSummaryBand';
import { SubjectsTable } from './SubjectsTable';

const PAGE_SIZE = 10;
const initialFilters: SubjectFilterState = { search: '', level: '', category: '', status: '' };

export default function SubjectsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const search = useDebouncedValue(filters.search.trim(), 300);

  const params = useMemo<SubjectListParams>(() => ({
    page, page_size: PAGE_SIZE, search: search || undefined, level: filters.level || undefined, category: filters.category || undefined, status: filters.status || undefined,
  }), [page, search, filters.level, filters.category, filters.status]);

  const subjects = useAsync(useCallback(() => listSubjectItems(params), [params]));
  const counts = useAsync(getSubjectCounts);

  const hasFilters = Boolean(filters.search || filters.level || filters.category || filters.status);
  const clear = () => { setFilters(initialFilters); setPage(1); };
  const change = (patch: Partial<SubjectFilterState>) => { setFilters((f) => ({ ...f, ...patch })); setPage(1); };
  const saved = () => { setAdding(false); subjects.reload(); counts.reload(); };

  const { data, error, loading, reload } = subjects;
  const rows = data && !error ? data.data : null;
  const c = counts.data;

  return (
    <PageContainer
      title="Subjects"
      description="Manage curriculum subjects offered by the school, subject codes, school levels, and class allocations."
      actions={<>
        <Button variant="surface"><Icon name="download" size={18} className="text-charcoal-muted" />Export Subject List</Button>
        <Button variant="primary" onClick={() => setAdding(true)}><Icon name="add" />Add Subject</Button>
      </>}
    >
      {c && <SubjectSummaryBand counts={c} />}
      <SubjectFilters value={filters} onChange={change} onClear={clear} />

      <div className="flex flex-wrap items-center gap-2 px-1">
        <span className="text-sm font-semibold">{data && !error ? `${data.pagination.total} subjects` : 'Subjects'}</span>
        {c && <><Badge dot tone="teal">Active: {c.active}</Badge><Badge dot tone="neutral">Inactive: {c.inactive}</Badge></>}
      </div>

      <Card className="overflow-hidden p-0">
        {loading && !data && <LoadingState label="Loading subjects…" />}
        {error && <ErrorState title="Unable to load subjects" message={`${error.message} Please try again.`} onRetry={reload} />}
        {rows && rows.length === 0 && (
          <EmptyState title="No subjects found" message="Try changing your search or filters."
            action={hasFilters ? <Button variant="primary" onClick={clear}>Clear Filters</Button> : undefined} />
        )}
        {rows && rows.length > 0 && data && (
          <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <SubjectsTable rows={rows} onView={setViewId} />
            <div className="border-t border-warm-200"><Pagination pagination={data.pagination} onPageChange={setPage} itemLabel="subjects" /></div>
          </div>
        )}
      </Card>

      <SubjectDetailsModal subjectId={viewId} onClose={() => setViewId(null)} />
      <AddSubjectModal open={adding} onClose={() => setAdding(false)} onSaved={saved} />
    </PageContainer>
  );
}
