import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Table, type Column } from '../../../components/ui/Table';
import { ATTENDANCE_LABEL, ATTENDANCE_TONE } from '../../../constants/attendance';
import { GENDER_LABEL } from '../../../constants/student';
import type { AttendanceRecord } from '../../../types/attendance';
import { formatClock } from '../../../utils/format';

interface Props { rows: AttendanceRecord[]; onEdit: (record: AttendanceRecord) => void; }

export function AttendanceTable({ rows, onEdit }: Props) {
  const columns: Column<AttendanceRecord>[] = [
    { key: 'student', header: 'Student', className: 'whitespace-nowrap', render: (r) => <div className="flex items-center gap-2"><Avatar name={r.full_name} src={r.photo_url} size={32} /><span className="font-semibold">{r.full_name}</span></div> },
    { key: 'id', header: 'Student ID', className: 'whitespace-nowrap', render: (r) => <span className="text-xs font-semibold text-charcoal-lighter">{r.student_number}</span> },
    { key: 'gender', header: 'Gender', render: (r) => <span className="text-charcoal-lighter">{GENDER_LABEL[r.gender]}</span> },
    { key: 'arrival', header: 'Arrival Time', className: 'whitespace-nowrap', render: (r) => r.arrival_time ? <span className="font-semibold">{formatClock(r.arrival_time)}</span> : <span className="text-charcoal-muted">—</span> },
    { key: 'status', header: 'Status', className: 'whitespace-nowrap', render: (r) => <Badge dot tone={ATTENDANCE_TONE[r.status]}>{ATTENDANCE_LABEL[r.status]}</Badge> },
    { key: 'note', header: 'Notes', render: (r) => <span className="text-xs text-charcoal-lighter">{r.note ?? '—'}</span> },
    { key: 'actions', header: 'Actions', className: 'text-right whitespace-nowrap', render: (r) => (
      <button type="button" aria-label={`Edit attendance for ${r.full_name}`} onClick={() => onEdit(r)}
        className="rounded-md bg-warm-100 px-3 py-1 text-[11px] font-bold transition-colors hover:bg-warm-200">Edit</button>
    ) },
  ];
  return <Table columns={columns} rows={rows} getRowKey={(r) => r.id} />;
}
