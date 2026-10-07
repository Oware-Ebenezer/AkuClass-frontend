import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select, type SelectOption } from '../../../components/ui/Select';
import type { AssignmentStatus, DueFilter } from '../../../types/assignment';

export interface AssignmentFilterState { search: string; class_id: string; subject_id: string; status: AssignmentStatus | ''; due: DueFilter | ''; }

const statuses: SelectOption[] = [{ value: '', label: 'All Statuses' }, { value: 'PUBLISHED', label: 'Published' }, { value: 'DRAFT', label: 'Draft' }, { value: 'CLOSED', label: 'Closed' }];
const dues: SelectOption[] = [{ value: '', label: 'All Due Dates' }, { value: 'THIS_WEEK', label: 'This Week' }, { value: 'NEXT_WEEK', label: 'Next Week' }, { value: 'PAST_DUE', label: 'Past Due' }];

interface Props { value: AssignmentFilterState; classOptions: SelectOption[]; subjectOptions: SelectOption[]; onChange: (patch: Partial<AssignmentFilterState>) => void; onClear: () => void; }

export function AssignmentFilters({ value, classOptions, subjectOptions, onChange, onClear }: Props) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 lg:grid-cols-12">
        <Input filled icon="search" aria-label="Search assignments" className="lg:col-span-3" placeholder="Search by title, subject, or class..." value={value.search} onChange={(e) => onChange({ search: e.target.value })} />
        <Select filled aria-label="Class" className="lg:col-span-2" options={[{ value: '', label: 'All Classes' }, ...classOptions]} value={value.class_id} onChange={(e) => onChange({ class_id: e.target.value })} />
        <Select filled aria-label="Subject" className="lg:col-span-2" options={[{ value: '', label: 'All Subjects' }, ...subjectOptions]} value={value.subject_id} onChange={(e) => onChange({ subject_id: e.target.value })} />
        <Select filled aria-label="Status" className="lg:col-span-2" options={statuses} value={value.status} onChange={(e) => onChange({ status: e.target.value as AssignmentStatus | '' })} />
        <Select filled aria-label="Due date" className="lg:col-span-2" options={dues} value={value.due} onChange={(e) => onChange({ due: e.target.value as DueFilter | '' })} />
        <button type="button" onClick={onClear} className="h-10 rounded-lg text-xs font-semibold text-charcoal-lighter hover:bg-warm-100 hover:text-charcoal lg:col-span-1">Clear</button>
      </div>
    </Card>
  );
}
