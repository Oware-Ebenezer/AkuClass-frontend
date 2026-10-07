import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select, type SelectOption } from '../../../components/ui/Select';
import { CATEGORY_LABEL } from '../../../constants/subject';
import type { SubjectCategory, SubjectLevel, SubjectStatus } from '../../../types/subject';

export interface SubjectFilterState { search: string; level: SubjectLevel | ''; category: SubjectCategory | ''; status: SubjectStatus | ''; }

const levels: SelectOption[] = [{ value: '', label: 'All Levels' }, { value: 'JHS', label: 'JHS Only' }, { value: 'SHS', label: 'SHS Only' }, { value: 'BOTH', label: 'JHS & SHS' }];
const categories: SelectOption[] = [{ value: '', label: 'All Categories' }, ...(Object.keys(CATEGORY_LABEL) as SubjectCategory[]).map((v) => ({ value: v, label: CATEGORY_LABEL[v] }))];
const statuses: SelectOption[] = [{ value: '', label: 'All Statuses' }, { value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }];

interface Props { value: SubjectFilterState; onChange: (patch: Partial<SubjectFilterState>) => void; onClear: () => void; }

export function SubjectFilters({ value, onChange, onClear }: Props) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 lg:grid-cols-12">
        <Input filled icon="search" aria-label="Search subjects" className="lg:col-span-4" placeholder="Search by subject name, code, or description..." value={value.search} onChange={(e) => onChange({ search: e.target.value })} />
        <Select filled aria-label="Level" className="lg:col-span-2" options={levels} value={value.level} onChange={(e) => onChange({ level: e.target.value as SubjectLevel | '' })} />
        <Select filled aria-label="Category" className="lg:col-span-2" options={categories} value={value.category} onChange={(e) => onChange({ category: e.target.value as SubjectCategory | '' })} />
        <Select filled aria-label="Status" className="lg:col-span-2" options={statuses} value={value.status} onChange={(e) => onChange({ status: e.target.value as SubjectStatus | '' })} />
        <button type="button" onClick={onClear} className="h-10 rounded-lg text-xs font-semibold text-charcoal-lighter hover:bg-warm-100 hover:text-charcoal lg:col-span-2">Reset</button>
      </div>
    </Card>
  );
}
