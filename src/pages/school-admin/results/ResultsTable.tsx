import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Table, type Column } from '../../../components/ui/Table';
import type { ResultRow } from '../../../types/result';

export type IndexedResult = { n: number; r: ResultRow };
const none = <span className="text-charcoal-muted">—</span>;
const score = (v: number | null, max: number) => (v === null ? none : <span className="rounded bg-warm-100 px-2.5 py-1 text-xs font-semibold">{v} / {max}</span>);

export function ResultsTable({ rows, onEdit }: { rows: IndexedResult[]; onEdit: (r: ResultRow) => void }) {
  const columns: Column<IndexedResult>[] = [
    { key: 'n', header: '#', className: 'w-12 text-center', render: ({ n }) => <span className="text-xs text-charcoal-muted">{String(n).padStart(2, '0')}</span> },
    { key: 'student', header: 'Student', className: 'whitespace-nowrap', render: ({ r }) => <div className="flex items-center gap-2"><Avatar name={r.full_name} src={r.photo_url} size={32} /><span className="font-semibold">{r.full_name}</span></div> },
    { key: 'id', header: 'Student ID', className: 'whitespace-nowrap', render: ({ r }) => <span className="text-xs font-semibold text-charcoal-lighter">{r.student_number}</span> },
    { key: 'continuous', header: 'Class Assessment', className: 'whitespace-nowrap text-center', render: ({ r }) => score(r.continuous_score, r.continuous_max) },
    { key: 'exam', header: 'Terminal Exam', className: 'whitespace-nowrap text-center', render: ({ r }) => score(r.exam_score, r.exam_max) },
    { key: 'total', header: 'Total', className: 'whitespace-nowrap text-center', render: ({ r }) => r.total === null ? none : <b>{r.total} / {r.total_max}</b> },
    { key: 'grade', header: 'Grade', className: 'whitespace-nowrap', render: ({ r }) => r.grade ? <Badge tone="teal">{r.grade}{r.grade_label ? ` · ${r.grade_label}` : ''}</Badge> : <Badge>Not entered</Badge> },
    { key: 'remark', header: 'Teacher’s Remark', render: ({ r }) => <span className="block max-w-xs text-xs text-charcoal-lighter">{r.remark ?? '—'}</span> },
    { key: 'actions', header: 'Action', className: 'text-right whitespace-nowrap', render: ({ r }) => (
      <button type="button" aria-label={`${r.result_id ? 'Edit' : 'Enter'} result for ${r.full_name}`} onClick={() => onEdit(r)}
        className={`rounded-md px-3 py-1 text-[11px] font-bold transition-colors ${r.result_id ? 'bg-warm-100 hover:bg-warm-200' : 'bg-orange text-charcoal hover:bg-orange-light'}`}>{r.result_id ? 'Edit' : 'Enter'}</button>
    ) },
  ];
  return <Table columns={columns} rows={rows} getRowKey={({ r }) => r.student_id} />;
}
