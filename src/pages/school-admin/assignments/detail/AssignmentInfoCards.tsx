import { Card } from '../../../../components/ui/Card';
import { CardTitle, Field } from '../../../../components/ui/DetailField';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { CATEGORY_LABEL } from '../../../../constants/assignment';
import type { AssignmentDetail } from '../../../../types/assignment';
import { formatBytes } from '../../../../utils/format';

export function SpecsCard({ a }: { a: AssignmentDetail }) {
  return (
    <Card className="space-y-4">
      <CardTitle icon="tune">Specifications</CardTitle>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <Field label="Subject">{a.subject.name}</Field>
        <Field label="Class">{a.class.name} ({a.expected_count} learners)</Field>
        <Field label="Teacher">{a.teacher?.full_name ?? '—'}</Field>
        <Field label="Category">{CATEGORY_LABEL[a.category]}</Field>
        <Field label="Academic Term">{a.academic_year} • {a.term}</Field>
        <Field label="Maximum Score"><b>{a.max_score} marks</b></Field>
      </div>
    </Card>
  );
}

export function InstructionsCard({ a }: { a: AssignmentDetail }) {
  return (
    <Card className="space-y-3">
      <CardTitle icon="assignment_turned_in">Instructions</CardTitle>
      {a.instructions ? <p className="text-sm leading-relaxed whitespace-pre-wrap text-charcoal">{a.instructions}</p> : <p className="text-sm text-charcoal-muted">No instructions were added.</p>}
    </Card>
  );
}

export function AttachmentsCard({ a }: { a: AssignmentDetail }) {
  return (
    <Card className="space-y-3">
      <CardTitle icon="attachment">Attachments</CardTitle>
      {a.attachments.length === 0 ? <EmptyState icon="attachment" title="No attachments" /> : (
        <ul className="space-y-2">
          {a.attachments.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-3 rounded-lg bg-warm-100 p-3">
              <div className="flex min-w-0 flex-col"><span className="truncate text-xs font-semibold">{f.name}</span><span className="text-[11px] text-charcoal-muted">{formatBytes(f.size_bytes)}</span></div>
              {f.download_url && <a href={f.download_url} className="text-xs font-semibold text-teal hover:underline" download>Download</a>}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
