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
import { DEFAULT_ACADEMIC_YEAR_ID } from '../../../constants/academicYears';
import { useAsync } from '../../../hooks/useAsync';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { listSubjects } from '../../../services/subjectService';
import { getTeacherCounts, listTeachers } from '../../../services/teacherService';
import type { TeacherListParams } from '../../../types/teacher';
import { TeacherFilters, type TeacherFilterState } from './TeacherFilters';
import { TeacherSummaryBand } from './TeacherSummaryBand';
import { TeachersTable } from './TeachersTable';

const PAGE_SIZE = 10;
const initialFilters: TeacherFilterState = { search: '', level: '', subject_id: '', status: '' };

export default function TeachersPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(filters.search.trim(), 300);

  const params = useMemo<TeacherListParams>(() => ({
    page, page_size: PAGE_SIZE, search: search || undefined, level: filters.level || undefined, subject_id: filters.subject_id || undefined,
    status: filters.status || undefined, academic_year_id: DEFAULT_ACADEMIC_YEAR_ID,
  }), [page, search, filters.level, filters.subject_id, filters.status]);

  const teachers = useAsync(useCallback(() => listTeachers(params), [params]));
  const counts = useAsync(useCallback(() => getTeacherCounts(DEFAULT_ACADEMIC_YEAR_ID), []));
  const subjects = useAsync(listSubjects);

  const hasFilters = Boolean(filters.search || filters.level || filters.subject_id || filters.status);
  const clear = () => { setFilters(initialFilters); setPage(1); };
  const change = (patch: Partial<TeacherFilterState>) => { setFilters((f) => ({ ...f, ...patch })); setPage(1); };

  const { data, error, loading, reload } = teachers;
  const rows = data && !error ? data.data : null;
  const c = counts.data;

  return (
    <PageContainer
      title="Teachers"
      description="Manage teaching staff profiles, subject allocations, class assignments, and active status."
      actions={<>
        <Button variant="surface"><Icon name="file_download" size={18} className="text-charcoal-muted" />Export Staff List</Button>
        <Button variant="primary"><Icon name="person_add" />+ Add Teacher</Button>
      </>}
    >
      {c && <TeacherSummaryBand counts={c} />}
      <TeacherFilters value={filters} subjectOptions={(subjects.data ?? []).map((s) => ({ value: s.id, label: s.name }))} onChange={change} onClear={clear} />

      <div className="flex flex-wrap items-center gap-2 px-1">
        <span className="text-sm font-semibold">{data && !error ? `${data.pagination.total} teachers` : 'Teachers'}</span>
        {c && <><Badge dot tone="teal">Active: {c.active}</Badge><Badge dot tone="neutral">Inactive: {c.inactive}</Badge><Badge dot tone="danger">Suspended: {c.suspended}</Badge></>}
      </div>

      <Card className="overflow-hidden p-0">
        {loading && !data && <LoadingState label="Loading teachers…" />}
        {error && <ErrorState title="Unable to load teachers" message={`${error.message} Please try again.`} onRetry={reload} />}
        {rows && rows.length === 0 && (
          <EmptyState title="No teachers found" message="Try changing your search or filters."
            action={hasFilters ? <Button variant="primary" onClick={clear}>Clear Filters</Button> : undefined} />
        )}
        {rows && rows.length > 0 && data && (
          <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <TeachersTable rows={rows} />
            <div className="border-t border-warm-200">
              <Pagination pagination={data.pagination} onPageChange={setPage} itemLabel="teachers" />
            </div>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
