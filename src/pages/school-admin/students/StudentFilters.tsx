import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select, type SelectOption } from '../../../components/ui/Select';
import { ACADEMIC_YEARS } from '../../../constants/academicYears';
import type { AccountStatus } from '../../../types';
import type { SchoolSection } from '../../../types/student';

export interface StudentFilterState {
  search: string;
  school_section: SchoolSection | '';
  class_id: string;
  status: AccountStatus | '';
  academic_year_id: string;
}

interface Props {
  value: StudentFilterState;
  classOptions: SelectOption[];
  onChange: (patch: Partial<StudentFilterState>) => void;
  onClear: () => void;
}

const sections: SelectOption[] = [{ value: '', label: 'All Sections' }, { value: 'JHS', label: 'JHS' }, { value: 'SHS', label: 'SHS' }];
const statuses: SelectOption[] = [{ value: '', label: 'All Statuses' }, { value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }];

export function StudentFilters({ value, classOptions, onChange, onClear }: Props) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 lg:grid-cols-12">
        <Input filled icon="search" aria-label="Search students" className="lg:col-span-3" placeholder="Search by student name or ID..."
          value={value.search} onChange={(e) => onChange({ search: e.target.value })} />
        <Select filled aria-label="Section" className="lg:col-span-2" options={sections} value={value.school_section}
          onChange={(e) => onChange({ school_section: e.target.value as SchoolSection | '', class_id: '' })} />
        <Select filled aria-label="Class" className="lg:col-span-2" options={[{ value: '', label: 'All Classes' }, ...classOptions]} value={value.class_id}
          onChange={(e) => onChange({ class_id: e.target.value })} />
        <Select filled aria-label="Status" className="lg:col-span-2" options={statuses} value={value.status}
          onChange={(e) => onChange({ status: e.target.value as AccountStatus | '' })} />
        <Select filled aria-label="Academic year" className="lg:col-span-2" options={ACADEMIC_YEARS.map((y) => ({ value: y.id, label: y.label }))} value={value.academic_year_id}
          onChange={(e) => onChange({ academic_year_id: e.target.value, class_id: '' })} />
        <button type="button" onClick={onClear} className="h-10 rounded-lg text-xs font-semibold text-charcoal-lighter hover:bg-warm-100 hover:text-charcoal lg:col-span-1">Clear</button>
      </div>
    </Card>
  );
}
