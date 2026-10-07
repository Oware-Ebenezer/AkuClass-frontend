import { Link } from 'react-router-dom';
import { AccountStatusBadge } from '../../../components/ui/AccountStatusBadge';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Icon } from '../../../components/ui/Icon';
import { LevelBadge } from '../../../components/ui/LevelBadge';
import { Table, type Column } from '../../../components/ui/Table';
import type { Teacher } from '../../../types/teacher';

const MAX_CLASSES = 3;
const none = <span className="text-charcoal-muted">—</span>;

const columns: Column<Teacher>[] = [
  {
    key: 'teacher', header: 'Teacher',
    render: (t) => (
      <div className="flex items-center gap-3">
        <Avatar name={t.full_name} src={t.photo_url} size={40} />
        <div className="flex min-w-0 flex-col">
          <Link to={`/app/teachers/${t.id}`} className="font-semibold whitespace-nowrap hover:text-teal">{t.full_name}</Link>
          <span className="max-w-[220px] truncate text-xs text-charcoal-muted">{t.email}</span>
        </div>
      </div>
    ),
  },
  { key: 'id', header: 'Employee ID', className: 'whitespace-nowrap', render: (t) => <span className="text-xs font-semibold text-charcoal-lighter">{t.employee_number}</span> },
  { key: 'phone', header: 'Phone', className: 'whitespace-nowrap', render: (t) => t.phone },
  { key: 'level', header: 'Level', className: 'whitespace-nowrap', render: (t) => <LevelBadge level={t.level} /> },
  {
    key: 'subjects', header: 'Assigned Subjects',
    render: (t) => t.subjects.length === 0 ? none : (
      <div className="flex flex-wrap gap-1">{t.subjects.map((s) => <span key={s} className="rounded bg-warm-100 px-2 py-0.5 text-xs">{s}</span>)}</div>
    ),
  },
  {
    key: 'classes', header: 'Assigned Classes',
    render: (t) => t.classes.length === 0 ? none : (
      <div className="space-y-1">
        {t.classes.slice(0, MAX_CLASSES).map((c) => (
          <div key={c.id} className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-xs font-medium">{c.name}</span>
            {c.is_class_teacher && <Badge tone="orange">Class Teacher</Badge>}
          </div>
        ))}
        {t.classes.length > MAX_CLASSES && <span className="text-xs text-charcoal-muted">+{t.classes.length - MAX_CLASSES} more</span>}
      </div>
    ),
  },
  { key: 'status', header: 'Status', className: 'whitespace-nowrap', render: (t) => <AccountStatusBadge status={t.status} /> },
  {
    key: 'actions', header: 'Actions', className: 'text-right whitespace-nowrap',
    render: (t) => (
      <div className="inline-flex items-center gap-1">
        <Link to={`/app/teachers/${t.id}`} className="rounded-md bg-teal-pale px-3 py-1 text-[11px] font-bold text-teal-dark transition-colors hover:bg-teal hover:text-white">View</Link>
        <button type="button" aria-label={`More actions for ${t.full_name}`} className="rounded p-1 text-charcoal-muted hover:bg-warm-100 hover:text-charcoal"><Icon name="more_vert" size={18} /></button>
      </div>
    ),
  },
];

export const TeachersTable = ({ rows }: { rows: Teacher[] }) => <Table columns={columns} rows={rows} getRowKey={(t) => t.id} />;
