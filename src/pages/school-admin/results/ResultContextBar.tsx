import { Card } from '../../../components/ui/Card';
import { Select, type SelectOption } from '../../../components/ui/Select';

interface Props {
  yearId: string; termId: string; classId: string; subjectId: string;
  yearOptions: SelectOption[]; termOptions: SelectOption[]; classOptions: SelectOption[]; subjectOptions: SelectOption[];
  onYear: (v: string) => void; onTerm: (v: string) => void; onClass: (v: string) => void; onSubject: (v: string) => void;
}

export function ResultContextBar(p: Props) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select filled label="Academic Year" options={p.yearOptions} value={p.yearId} onChange={(e) => p.onYear(e.target.value)} />
        <Select filled label="Term" options={p.termOptions} value={p.termId} onChange={(e) => p.onTerm(e.target.value)} />
        <Select filled label="Class" options={p.classOptions} value={p.classId} onChange={(e) => p.onClass(e.target.value)} />
        <Select filled label="Subject & Teacher" options={p.subjectOptions} value={p.subjectId} onChange={(e) => p.onSubject(e.target.value)} disabled={p.subjectOptions.length === 0} />
      </div>
    </Card>
  );
}
