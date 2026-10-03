import { Link } from 'react-router-dom';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Icon } from '../../../components/ui/Icon';
import { SectionBadge } from '../../../components/ui/SectionBadge';
import { Table, type Column } from '../../../components/ui/Table';
import type { ClassListItem } from '../../../types/class';

const columns: Column<ClassListItem>[] = [
  { key: 'class', header: 'Class', className: 'whitespace-nowrap', render: (c) => <Link to={`/app/classes/${c.id}`} className="font-semibold hover:text-teal">{c.name}</Link> },
  { key: 'section', header: 'Section', render: (c) => <SectionBadge section={c.school_section} /> },
  { key: 'level', header: 'Level', className: 'whitespace-nowrap', render: (c) => c.level },
  { key: 'students', header: 'Students', className: 'whitespace-nowrap', render: (c) => <><b>{c.student_count}</b> <span className="text-xs text-charcoal-muted">{c.student_count === 1 ? 'student' : 'students'}</span></> },
  {
    key: 'teacher', header: 'Class Teacher', className: 'whitespace-nowrap',
    render: (c) => c.class_teacher
      ? <div className="flex items-center gap-2"><Avatar name={c.class_teacher.full_name} size={28} /><span className="font-medium">{c.class_teacher.full_name}</span></div>
      : <span className="text-charcoal-muted">Not assigned</span>,
  },
  { key: 'year', header: 'Academic Year', className: 'whitespace-nowrap', render: (c) => <span className="text-charcoal-lighter">{c.academic_year}</span> },
  { key: 'status', header: 'Status', className: 'whitespace-nowrap', render: (c) => <Badge dot tone={c.status === 'ACTIVE' ? 'teal' : 'neutral'}>{c.status === 'ACTIVE' ? 'Active' : 'Inactive'}</Badge> },
  {
    key: 'actions', header: 'Actions', className: 'text-right whitespace-nowrap',
    render: (c) => (
      <div className="inline-flex items-center gap-1">
        <Link to={`/app/classes/${c.id}`} className="rounded-md bg-teal-pale px-3 py-1 text-[11px] font-bold text-teal-dark transition-colors hover:bg-teal hover:text-white">View</Link>
        <button type="button" aria-label={`More actions for ${c.name}`} className="rounded p-1 text-charcoal-muted hover:bg-warm-100 hover:text-charcoal"><Icon name="more_vert" size={18} /></button>
      </div>
    ),
  },
];

export const ClassesTable = ({ rows }: { rows: ClassListItem[] }) => <Table columns={columns} rows={rows} getRowKey={(c) => c.id} />;
