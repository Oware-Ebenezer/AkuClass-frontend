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
import { getAttendanceSession } from '../../../services/attendanceService';
import { listClasses } from '../../../services/classService';
import type { AttendanceStatus } from '../../../types';
import type { AttendanceRecord } from '../../../types/attendance';
import { formatDate, todayIso } from '../../../utils/format';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceSummary } from './AttendanceSummary';
import { AttendanceTable } from './AttendanceTable';
import { EditRecordModal } from './EditRecordModal';

const PAGE_SIZE = 12;

export default function AttendancePage() {
  const [classId, setClassId] = useState('');
  const [date, setDate] = useState(todayIso);
  const [status, setStatus] = useState<AttendanceStatus | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AttendanceRecord | null>(null);

  const classes = useAsync(useCallback(() => listClasses({ page: 1, page_size: 100, academic_year_id: DEFAULT_ACADEMIC_YEAR_ID, status: 'ACTIVE' }), []));
  const classList = classes.data?.data ?? [];
  const activeClassId = classId || classList[0]?.id || '';
  const session = useAsync(useCallback(() => (activeClassId ? getAttendanceSession({ class_id: activeClassId, date }) : Promise.resolve(null)), [activeClassId, date]));

  const classOptions = classList.map((c) => ({ value: c.id, label: `${c.name} (${c.student_count} students)` }));
  const current = session.data && !session.error ? session.data : null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (current?.records ?? []).filter((r) => (!status || r.status === status) && (!q || r.full_name.toLowerCase().includes(q) || r.student_number.toLowerCase().includes(q)));
  }, [current, status, search]);

  const total_pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, total_pages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const reset = (fn: () => void) => { fn(); setPage(1); };
  const error = classes.error ?? session.error;
  const className = classList.find((c) => c.id === activeClassId)?.name ?? 'this class';

  return (
    <PageContainer
      title="Attendance Register"
      description="View, verify, and manage daily class roll calls, arrival times, and absence excuses."
      actions={<>
        <Button variant="surface"><Icon name="download" size={18} className="text-charcoal-muted" />Export Register</Button>
        <Button variant="surface"><Icon name="print" size={18} className="text-charcoal-muted" />Print Sheet</Button>
        <Button variant="primary"><Icon name="edit_calendar" />+ Take Roll Call</Button>
      </>}
    >
      <AttendanceFilters classOptions={classOptions} classId={activeClassId} date={date} session={current} search={search} status={status}
        onClass={(id) => reset(() => setClassId(id))} onDate={(d) => reset(() => setDate(d))} onSearch={(v) => reset(() => setSearch(v))} onStatus={(s) => reset(() => setStatus(s))} />

      {(classes.loading || session.loading) && !current && !error && <LoadingState label="Loading attendance…" />}
      {error && <ErrorState title="Unable to load attendance" message={`${error.message} Please try again.`} onRetry={classes.error ? classes.reload : session.reload} />}
      {!error && !session.loading && !classes.loading && !current && (
        <Card><EmptyState icon="event_busy" title="No attendance recorded"
          message={`No roll call has been recorded for ${className} on ${formatDate(date, { day: 'numeric', month: 'long', year: 'numeric' })}.`} /></Card>
      )}

      {current && (
        <>
          <AttendanceSummary session={current} />
          <Card className="overflow-hidden p-0">
            {pageRows.length === 0 ? (
              <EmptyState title="No students found" message="Try changing your search or status filter."
                action={<Button variant="primary" onClick={() => { setSearch(''); setStatus(''); setPage(1); }}>Clear Filters</Button>} />
            ) : (
              <div className={session.loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
                <AttendanceTable rows={pageRows} onEdit={setEditing} />
                <div className="border-t border-warm-200">
                  <Pagination pagination={{ page: safePage, page_size: PAGE_SIZE, total: filtered.length, total_pages }} onPageChange={setPage} itemLabel={`students in ${current.class_name}`} />
                </div>
              </div>
            )}
          </Card>
        </>
      )}
      <EditRecordModal record={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); session.reload(); }} />
    </PageContainer>
  );
}
