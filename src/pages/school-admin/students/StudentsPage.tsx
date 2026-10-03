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
import { getClassOptions } from '../../../services/classService';
import { getStudentSummary, listStudents } from '../../../services/studentService';
import type { StudentListParams } from '../../../types/student';
import { StudentFilters, type StudentFilterState } from './StudentFilters';
import { StudentSummaryBand } from './StudentSummaryBand';
import { StudentsTable } from './StudentsTable';

const PAGE_SIZE = 10;
const initialFilters: StudentFilterState = { search: '', school_section: '', class_id: '', status: '', academic_year_id: DEFAULT_ACADEMIC_YEAR_ID };

export default function StudentsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(filters.search.trim(), 300);

  const params = useMemo<StudentListParams>(() => ({
    page, page_size: PAGE_SIZE, search: search || undefined, school_section: filters.school_section || undefined,
    class_id: filters.class_id || undefined, status: filters.status || undefined, academic_year_id: filters.academic_year_id,
  }), [page, search, filters.school_section, filters.class_id, filters.status, filters.academic_year_id]);

  const students = useAsync(useCallback(() => listStudents(params), [params]));
  const summary = useAsync(getStudentSummary);
  const classes = useAsync(useCallback(() => getClassOptions(filters.academic_year_id), [filters.academic_year_id]));

  const classOptions = (classes.data ?? [])
    .filter((c) => !filters.school_section || c.school_section === filters.school_section)
    .map((c) => ({ value: c.id, label: c.name }));
  const hasFilters = Boolean(filters.search || filters.school_section || filters.class_id || filters.status);
  const clear = () => { setFilters(initialFilters); setPage(1); };
  const change = (patch: Partial<StudentFilterState>) => { setFilters((f) => ({ ...f, ...patch })); setPage(1); };

  const { data, error, loading, reload } = students;
  const rows = data && !error ? data.data : null;

  return (
    <PageContainer
      eyebrow={<>Academics<Icon name="chevron_right" size={14} />Enrollment Registry</>}
      title="Students"
      description="Manage student records, enrollment status, and class assignments."
      actions={<>
        <Button variant="surface"><Icon name="file_download" size={18} className="text-charcoal-muted" />Export CSV</Button>
        <Button variant="surface"><Icon name="print" size={18} className="text-charcoal-muted" />Print Rosters</Button>
        <Button variant="primary"><Icon name="person_add" />+ Add Student</Button>
      </>}
    >
      {summary.data && <StudentSummaryBand summary={summary.data} />}
      <StudentFilters value={filters} classOptions={classOptions} onChange={change} onClear={clear} />

      <div className="flex flex-col justify-between gap-2 px-1 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{data && !error ? `${data.pagination.total.toLocaleString()} students` : 'Students'}</span>
          {summary.data && <><Badge tone="teal" dot>JHS: {summary.data.jhs.toLocaleString()}</Badge><Badge tone="orange" dot>SHS: {summary.data.shs.toLocaleString()}</Badge></>}
        </div>
        <div className="flex items-center gap-4 text-xs text-charcoal-muted">
          <span className="flex items-center gap-1"><Icon name="sort" size={16} />Sort: <b className="text-charcoal">Last Name (A-Z)</b></span>
          <span>Show: <b className="text-charcoal">{PAGE_SIZE}</b></span>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        {loading && !data && <LoadingState label="Loading students…" />}
        {error && <ErrorState title="Unable to load students" message={`${error.message} Please try again.`} onRetry={reload} />}
        {rows && rows.length === 0 && (
          <EmptyState title="No students found" message="Try changing your search or filters."
            action={hasFilters ? <Button variant="primary" onClick={clear}>Clear Filters</Button> : undefined} />
        )}
        {rows && rows.length > 0 && data && (
          <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <StudentsTable rows={rows} />
            <div className="border-t border-warm-200">
              <Pagination pagination={data.pagination} onPageChange={setPage} itemLabel="students" />
            </div>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
