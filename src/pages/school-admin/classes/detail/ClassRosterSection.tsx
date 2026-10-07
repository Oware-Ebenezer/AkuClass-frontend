import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AccountStatusBadge } from '../../../../components/ui/AccountStatusBadge';
import { Avatar } from '../../../../components/ui/Avatar';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { Icon } from '../../../../components/ui/Icon';
import { Input } from '../../../../components/ui/Input';
import { LoadingState } from '../../../../components/ui/LoadingState';
import { Pagination } from '../../../../components/ui/Pagination';
import { Select } from '../../../../components/ui/Select';
import { Table, type Column } from '../../../../components/ui/Table';
import { ATTENDANCE_TARGET_PERCENT, GENDER_LABEL } from '../../../../constants/student';
import { useAsync } from '../../../../hooks/useAsync';
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';
import { listClassStudents } from '../../../../services/classService';
import type { ClassRosterParams } from '../../../../types/class';
import type { Gender, Student } from '../../../../types/student';

const PAGE_SIZE = 10;
type Row = { n: number; s: Student };

const columns: Column<Row>[] = [
  { key: 'n', header: '#', className: 'w-12 text-center', render: (r) => <span className="text-xs text-charcoal-muted">{String(r.n).padStart(2, '0')}</span> },
  { key: 'student', header: 'Student', className: 'whitespace-nowrap', render: (r) => (
    <div className="flex items-center gap-2"><Avatar name={r.s.full_name} src={r.s.photo_url} size={36} /><Link to={`/app/students/${r.s.id}`} className="font-semibold hover:text-teal">{r.s.full_name}</Link></div>
  ) },
  { key: 'id', header: 'Student ID', className: 'whitespace-nowrap', render: (r) => <span className="text-xs font-semibold text-charcoal-lighter">{r.s.student_number}</span> },
  { key: 'gender', header: 'Gender', render: (r) => <span className="text-charcoal-lighter">{GENDER_LABEL[r.s.gender]}</span> },
  { key: 'attendance', header: 'Attendance', className: 'whitespace-nowrap', render: (r) => (
    <span className={`font-bold ${r.s.attendance_rate < ATTENDANCE_TARGET_PERCENT ? 'text-orange-dark' : 'text-teal'}`}>{r.s.attendance_rate.toFixed(1)}%</span>
  ) },
  { key: 'status', header: 'Status', className: 'whitespace-nowrap', render: (r) => <AccountStatusBadge status={r.s.status} /> },
  { key: 'actions', header: 'Actions', className: 'text-right whitespace-nowrap', render: (r) => (
    <div className="inline-flex items-center gap-1">
      <Link to={`/app/students/${r.s.id}`} className="rounded-md bg-teal-pale px-3 py-1 text-[11px] font-bold text-teal-dark transition-colors hover:bg-teal hover:text-white">View Profile</Link>
      <button type="button" aria-label={`More actions for ${r.s.full_name}`} className="rounded p-1 text-charcoal-muted hover:bg-warm-100 hover:text-charcoal"><Icon name="more_vert" size={18} /></button>
    </div>
  ) },
];

const genders = [{ value: '', label: 'All Genders' }, { value: 'FEMALE', label: 'Female' }, { value: 'MALE', label: 'Male' }];

export function ClassRosterSection({ classId }: { classId: string }) {
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [page, setPage] = useState(1);
  const q = useDebouncedValue(search.trim(), 300);
  const params = useMemo<ClassRosterParams>(() => ({ page, page_size: PAGE_SIZE, search: q || undefined, gender: gender || undefined }), [page, q, gender]);
  const { data, error, loading, reload } = useAsync(useCallback(() => listClassStudents(classId, params), [classId, params]));
  const rows: Row[] | null = data && !error ? data.data.map((s, i) => ({ s, n: (data.pagination.page - 1) * data.pagination.page_size + i + 1 })) : null;
  const clear = () => { setSearch(''); setGender(''); setPage(1); };

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col justify-between gap-4 p-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2">
          <Icon name="school" className="text-teal" />
          <h2 className="text-lg font-semibold">Enrolled Students</h2>
          {data && !error && <Badge>{data.pagination.total} students</Badge>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input filled icon="search" aria-label="Search students" className="w-full sm:w-64" placeholder="Search student or ID..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <Select filled aria-label="Gender" className="w-36" options={genders} value={gender} onChange={(e) => { setGender(e.target.value as Gender | ''); setPage(1); }} />
          <Button variant="primary"><Icon name="person_add" size={18} />Add Student</Button>
        </div>
      </div>
      {loading && !data && <LoadingState label="Loading students…" />}
      {error && <ErrorState title="Unable to load students" message={`${error.message} Please try again.`} onRetry={reload} />}
      {rows && rows.length === 0 && <EmptyState title="No students found" message="Try changing your search or filters." action={<Button variant="primary" onClick={clear}>Clear Filters</Button>} />}
      {rows && rows.length > 0 && data && (
        <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <Table columns={columns} rows={rows} getRowKey={(r) => r.s.id} />
          <div className="border-t border-warm-200"><Pagination pagination={data.pagination} onPageChange={setPage} itemLabel="students" /></div>
        </div>
      )}
    </Card>
  );
}
