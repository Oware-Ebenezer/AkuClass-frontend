import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/ui/Icon';
import { Input } from '../../../components/ui/Input';
import { Select, type SelectOption } from '../../../components/ui/Select';
import { ACADEMIC_YEARS } from '../../../constants/academicYears';
import type { ClassStatus } from '../../../types/class';
import type { SchoolSection } from '../../../types/student';

export interface ClassFilterState { search: string; school_section: SchoolSection | ''; status: ClassStatus | ''; academic_year_id: string; }

const sections: SelectOption[] = [{ value: '', label: 'All Sections' }, { value: 'JHS', label: 'JHS' }, { value: 'SHS', label: 'SHS' }];
const statuses: SelectOption[] = [{ value: '', label: 'All Statuses' }, { value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }];

interface Props { value: ClassFilterState; onChange: (patch: Partial<ClassFilterState>) => void; onClear: () => void; }

export function ClassFilters({ value, onChange, onClear }: Props) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 lg:grid-cols-12">
        <Input filled icon="search" aria-label="Search classes" className="lg:col-span-4" placeholder="Search classes, teachers, level..."
          value={value.search} onChange={(e) => onChange({ search: e.target.value })} />
        <Select filled aria-label="Section" className="lg:col-span-2" options={sections} value={value.school_section}
          onChange={(e) => onChange({ school_section: e.target.value as SchoolSection | '' })} />
        <Select filled aria-label="Academic year" className="lg:col-span-2" options={ACADEMIC_YEARS.map((y) => ({ value: y.id, label: y.label }))}
          value={value.academic_year_id} onChange={(e) => onChange({ academic_year_id: e.target.value })} />
        <Select filled aria-label="Status" className="lg:col-span-2" options={statuses} value={value.status}
          onChange={(e) => onChange({ status: e.target.value as ClassStatus | '' })} />
        <button type="button" onClick={onClear} className="flex h-10 items-center justify-center gap-1 rounded-lg text-xs font-semibold text-charcoal-lighter hover:bg-warm-100 hover:text-charcoal lg:col-span-2">
          <Icon name="close" size={16} />Clear Filters
        </button>
      </div>
    </Card>
  );
}
