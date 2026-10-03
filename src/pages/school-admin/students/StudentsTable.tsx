import { Link } from 'react-router-dom';
import { Avatar } from '../../../components/ui/Avatar';
import { Icon } from '../../../components/ui/Icon';
import { Table, type Column } from '../../../components/ui/Table';
import { ATTENDANCE_TARGET_PERCENT, GENDER_LABEL } from '../../../constants/student';
import type { Student } from '../../../types/student';
import { SectionBadge } from '../../../components/ui/SectionBadge';
import { AccountStatusBadge } from '../../../components/ui/AccountStatusBadge';

const columns: Column<Student>[] = [
  {
    key: 'student', header: 'Student',
    render: (s) => (
      <div className="flex items-center gap-2">
        <Avatar name={s.full_name} src={s.photo_url} size={36} className={s.status === 'INACTIVE' ? 'opacity-70 grayscale' : ''} />
        <div className="flex min-w-0 flex-col">
          <Link to={`/app/students/${s.id}`} className="font-semibold hover:text-teal">{s.full_name}</Link>
          <span className="max-w-[220px] truncate text-xs text-charcoal-muted">{s.email}</span>
        </div>
      </div>
    ),
  },
  { key: 'id', header: 'Student ID', className: 'whitespace-nowrap', render: (s) => <span className="text-xs font-semibold text-charcoal-lighter">{s.student_number}</span> },
  { key: 'section', header: 'Section', render: (s) => <SectionBadge section={s.school_section} /> },
  { key: 'class', header: 'Class', className: 'whitespace-nowrap', render: (s) => s.class_name },
  { key: 'gender', header: 'Gender', render: (s) => <span className="text-charcoal-lighter">{GENDER_LABEL[s.gender]}</span> },
  {
    key: 'attendance', header: 'Attendance', className: 'whitespace-nowrap',
    render: (s) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-warm-100">
          <div className={`h-full rounded-full ${s.attendance_rate < ATTENDANCE_TARGET_PERCENT ? 'bg-orange' : 'bg-teal'}`} style={{ width: `${s.attendance_rate}%` }} />
        </div>
        <span className="text-[11px] font-bold">{s.attendance_rate.toFixed(1)}%</span>
      </div>
    ),
  },
  { key: 'status', header: 'Status', className: 'whitespace-nowrap', render: (s) => <AccountStatusBadge status={s.status} /> },
  {
    key: 'actions', header: 'Actions', className: 'text-right whitespace-nowrap',
    render: (s) => (
      <div className="inline-flex items-center gap-1">
        <Link to={`/app/students/${s.id}`} className="rounded-md bg-teal-pale px-3 py-1 text-[11px] font-bold text-teal-dark transition-colors hover:bg-teal hover:text-white">View</Link>
        <button type="button" aria-label={`More actions for ${s.full_name}`} className="rounded p-1 text-charcoal-muted hover:bg-warm-100 hover:text-charcoal"><Icon name="more_vert" size={18} /></button>
      </div>
    ),
  },
];

export const StudentsTable = ({ rows }: { rows: Student[] }) => <Table columns={columns} rows={rows} getRowKey={(s) => s.id} />;
