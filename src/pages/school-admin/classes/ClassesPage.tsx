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
import { ACADEMIC_YEARS, DEFAULT_ACADEMIC_YEAR_ID } from '../../../constants/academicYears';
import { useAsync } from '../../../hooks/useAsync';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { getClassCounts, listClasses } from '../../../services/classService';
import type { ClassListParams } from '../../../types/class';
import { ClassFilters, type ClassFilterState } from './ClassFilters';
import { ClassSummaryBand } from './ClassSummaryBand';
import { ClassesTable } from './ClassesTable';

const PAGE_SIZE = 10;
const initialFilters: ClassFilterState = { search: '', school_section: '', status: '', academic_year_id: DEFAULT_ACADEMIC_YEAR_ID };

export default function ClassesPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(filters.search.trim(), 300);

  const params = useMemo<ClassListParams>(() => ({
    page, page_size: PAGE_SIZE, search: search || undefined, school_section: filters.school_section || undefined,
    status: filters.status || undefined, academic_year_id: filters.academic_year_id,
  }), [page, search, filters.school_section, filters.status, filters.academic_year_id]);

  const classes = useAsync(useCallback(() => listClasses(params), [params]));
  const counts = useAsync(useCallback(() => getClassCounts(filters.academic_year_id), [filters.academic_year_id]));

  const hasFilters = Boolean(filters.search || filters.school_section || filters.status);
  const clear = () => { setFilters(initialFilters); setPage(1); };
  const change = (patch: Partial<ClassFilterState>) => { setFilters((f) => ({ ...f, ...patch })); setPage(1); };
  const yearLabel = ACADEMIC_YEARS.find((y) => y.id === filters.academic_year_id)?.label ?? '';

  const { data, error, loading, reload } = classes;
  const rows = data && !error ? data.data : null;

  return (
    <PageContainer
      title="Classes"
      description="Manage JHS and SHS classes, class teachers, and student enrollment."
      actions={<>
        <Button variant="surface"><Icon name="download" size={18} className="text-charcoal-muted" />Export Class List</Button>
        <Button variant="primary"><Icon name="add" />Create Class</Button>
      </>}
    >
      {counts.data && <ClassSummaryBand counts={counts.data} yearLabel={yearLabel} />}
      <ClassFilters value={filters} onChange={change} onClear={clear} />

      <div className="flex flex-wrap items-center gap-2 px-1">
        <span className="text-sm font-semibold">{data && !error ? `${data.pagination.total} classes` : 'Classes'}</span>
        {counts.data && <><Badge tone="teal" dot>JHS: {counts.data.jhs}</Badge><Badge tone="orange" dot>SHS: {counts.data.shs}</Badge></>}
      </div>

      <Card className="overflow-hidden p-0">
        {loading && !data && <LoadingState label="Loading classes…" />}
        {error && <ErrorState title="Unable to load classes" message={`${error.message} Please try again.`} onRetry={reload} />}
        {rows && rows.length === 0 && (
          <EmptyState title="No classes found" message="Try changing your search or filters."
            action={hasFilters ? <Button variant="primary" onClick={clear}>Clear Filters</Button> : undefined} />
        )}
        {rows && rows.length > 0 && data && (
          <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <ClassesTable rows={rows} />
            <div className="border-t border-warm-200">
              <Pagination pagination={data.pagination} onPageChange={setPage} itemLabel="classes" />
            </div>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
