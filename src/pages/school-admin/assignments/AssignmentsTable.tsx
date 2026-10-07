import { Link } from 'react-router-dom';
import { Avatar } from '../../../components/ui/Avatar';
import { Icon } from '../../../components/ui/Icon';
import { Table, type Column } from '../../../components/ui/Table';
import type { AssignmentListItem } from '../../../types/assignment';
import { formatDate, formatTimeOfDay, percent, relativeDay } from '../../../utils/format';
import { AssignmentStatusBadge, CategoryBadge } from './AssignmentBadges';

function Deadline({ a }: { a: AssignmentListItem }) {
  const urgent = a.status === 'PUBLISHED' && ['Today', 'Tomorrow'].includes(relativeDay(a.due_at));
  const note = a.status === 'DRAFT' ? 'Not published' : a.status === 'CLOSED' ? 'Closed' : `${relativeDay(a.due_at)} · ${formatTimeOfDay(a.due_at)}`;
  return (
    <div className="flex flex-col">
      <span className="font-semibold">{formatDate(a.due_at)}</span>
      <span className={`text-xs ${urgent ? 'font-semibold text-orange-dark' : 'text-charcoal-muted'}`}>{note}</span>
    </div>
  );
}

function Progress({ a }: { a: AssignmentListItem }) {
  if (a.status === 'DRAFT') return <span className="text-xs text-charcoal-muted">Not published</span>;
  const pct = percent(a.received_count, a.expected_count);
  return (
    <div className="flex w-40 flex-col gap-1">
      <div className="flex justify-between text-[11px]"><b>{a.received_count} / {a.expected_count}</b><b className="text-teal">{pct}%</b></div>
      <div className="h-1.5 overflow-hidden rounded-full bg-warm-100"><div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

const columns: Column<AssignmentListItem>[] = [
  { key: 'title', header: 'Assignment', render: (a) => (
    <div className="flex max-w-sm flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2"><Link to={`/app/assignments/${a.id}`} className="font-semibold hover:text-teal">{a.title}</Link><CategoryBadge category={a.category} /></div>
      <span className="text-xs text-charcoal-muted">{a.published_at ? `Assigned ${formatDate(a.published_at)}` : 'Draft'} · {a.max_score} marks</span>
    </div>
  ) },
  { key: 'subject', header: 'Subject', className: 'whitespace-nowrap', render: (a) => (
    <div className="flex items-center gap-2"><span className="rounded bg-warm-100 px-2 py-0.5 text-[11px] font-bold">{a.subject.code}</span><span className="text-xs font-medium">{a.subject.name}</span></div>
  ) },
  { key: 'class', header: 'Class', className: 'whitespace-nowrap', render: (a) => <span className="rounded-md bg-warm-100 px-2.5 py-1 text-[11px] font-bold">{a.class.name}</span> },
  { key: 'teacher', header: 'Teacher', className: 'whitespace-nowrap', render: (a) => a.teacher ? <div className="flex items-center gap-2"><Avatar name={a.teacher.full_name} size={28} /><span className="text-xs font-medium">{a.teacher.full_name}</span></div> : <span className="text-charcoal-muted">—</span> },
  { key: 'deadline', header: 'Deadline', className: 'whitespace-nowrap', render: (a) => <Deadline a={a} /> },
  { key: 'progress', header: 'Submissions', render: (a) => <Progress a={a} /> },
  { key: 'status', header: 'Status', className: 'whitespace-nowrap', render: (a) => <AssignmentStatusBadge status={a.status} /> },
  { key: 'actions', header: 'Actions', className: 'text-right whitespace-nowrap', render: (a) => (
    <div className="inline-flex items-center gap-1">
      <Link to={`/app/assignments/${a.id}`} className="rounded-md bg-teal-pale px-3 py-1 text-[11px] font-bold text-teal-dark transition-colors hover:bg-teal hover:text-white">View</Link>
      <button type="button" aria-label={`More actions for ${a.title}`} className="rounded p-1 text-charcoal-muted hover:bg-warm-100 hover:text-charcoal"><Icon name="more_vert" size={18} /></button>
    </div>
  ) },
];

export const AssignmentsTable = ({ rows }: { rows: AssignmentListItem[] }) => <Table columns={columns} rows={rows} getRowKey={(a) => a.id} />;
