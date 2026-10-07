import { Badge } from '../../../components/ui/Badge';
import { Icon } from '../../../components/ui/Icon';
import { LevelBadge } from '../../../components/ui/LevelBadge';
import { Table, type Column } from '../../../components/ui/Table';
import { CATEGORY_LABEL } from '../../../constants/subject';
import type { SubjectListItem } from '../../../types/subject';

interface Props { rows: SubjectListItem[]; onView: (id: string) => void; }

export function SubjectsTable({ rows, onView }: Props) {
  const columns: Column<SubjectListItem>[] = [
    { key: 'subject', header: 'Subject', render: (s) => (
      <div className="flex flex-col"><span className="font-semibold">{s.name}</span>{s.description && <span className="max-w-xs text-xs text-charcoal-muted">{s.description}</span>}</div>
    ) },
    { key: 'code', header: 'Code', className: 'whitespace-nowrap', render: (s) => <span className="rounded bg-warm-100 px-2 py-1 text-xs font-bold">{s.code}</span> },
    { key: 'level', header: 'School Level', className: 'whitespace-nowrap', render: (s) => <LevelBadge level={s.level} /> },
    { key: 'category', header: 'Category', className: 'whitespace-nowrap', render: (s) => CATEGORY_LABEL[s.category] },
    { key: 'classes', header: 'Class Allocation', className: 'whitespace-nowrap', render: (s) => <><b>{s.class_count}</b> <span className="text-xs text-charcoal-muted">{s.class_count === 1 ? 'class' : 'classes'}</span></> },
    { key: 'status', header: 'Status', className: 'whitespace-nowrap', render: (s) => <Badge dot tone={s.status === 'ACTIVE' ? 'teal' : 'neutral'}>{s.status === 'ACTIVE' ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', header: 'Actions', className: 'text-right whitespace-nowrap', render: (s) => (
      <div className="inline-flex items-center gap-1">
        <button type="button" aria-label={`View ${s.name}`} onClick={() => onView(s.id)} className="rounded-md bg-teal-pale px-3 py-1 text-[11px] font-bold text-teal-dark transition-colors hover:bg-teal hover:text-white">View</button>
        <button type="button" aria-label={`More actions for ${s.name}`} className="rounded p-1 text-charcoal-muted hover:bg-warm-100 hover:text-charcoal"><Icon name="more_vert" size={18} /></button>
      </div>
    ) },
  ];
  return <Table columns={columns} rows={rows} getRowKey={(s) => s.id} />;
}
