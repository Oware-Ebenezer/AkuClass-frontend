import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select, type SelectOption } from '../../../components/ui/Select';
import type { AccountStatus } from '../../../types';
import type { TeacherLevel } from '../../../types/teacher';

export interface TeacherFilterState { search: string; level: TeacherLevel | ''; subject_id: string; status: AccountStatus | ''; }

const levels: SelectOption[] = [{ value: '', label: 'All Levels' }, { value: 'JHS', label: 'JHS Only' }, { value: 'SHS', label: 'SHS Only' }, { value: 'BOTH', label: 'JHS & SHS' }];
const statuses: SelectOption[] = [{ value: '', label: 'All Statuses' }, { value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }, { value: 'SUSPENDED', label: 'Suspended' }];

interface Props { value: TeacherFilterState; subjectOptions: SelectOption[]; onChange: (patch: Partial<TeacherFilterState>) => void; onClear: () => void; }

export function TeacherFilters({ value, subjectOptions, onChange, onClear }: Props) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 lg:grid-cols-12">
        <Input filled icon="search" aria-label="Search teachers" className="lg:col-span-4" placeholder="Search by teacher name, ID, or subject..."
          value={value.search} onChange={(e) => onChange({ search: e.target.value })} />
        <Select filled aria-label="Level" className="lg:col-span-2" options={levels} value={value.level} onChange={(e) => onChange({ level: e.target.value as TeacherLevel | '' })} />
        <Select filled aria-label="Subject" className="lg:col-span-2" options={[{ value: '', label: 'All Subjects' }, ...subjectOptions]} value={value.subject_id} onChange={(e) => onChange({ subject_id: e.target.value })} />
        <Select filled aria-label="Status" className="lg:col-span-2" options={statuses} value={value.status} onChange={(e) => onChange({ status: e.target.value as AccountStatus | '' })} />
        <button type="button" onClick={onClear} className="h-10 rounded-lg text-xs font-semibold text-charcoal-lighter hover:bg-warm-100 hover:text-charcoal lg:col-span-2">Clear Filters</button>
      </div>
    </Card>
  );
}
