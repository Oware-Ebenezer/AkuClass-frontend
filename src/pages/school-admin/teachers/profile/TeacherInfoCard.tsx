import { Card } from '../../../../components/ui/Card';
import { CardTitle, Field } from '../../../../components/ui/DetailField';
import { SECTION_LABEL, STATUS_LABEL } from '../../../../constants/student';
import type { TeacherDetail, TeacherLevel } from '../../../../types/teacher';

const LEVEL_LABEL: Record<TeacherLevel, string> = { JHS: SECTION_LABEL.JHS, SHS: SECTION_LABEL.SHS, BOTH: 'JHS & SHS' };

export function TeacherInfoCard({ teacher: t }: { teacher: TeacherDetail }) {
  const classTeacherOf = t.classes.filter((c) => c.is_class_teacher).map((c) => c.name).join(', ');
  return (
    <Card className="space-y-4">
      <CardTitle icon="badge">Teacher Information</CardTitle>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <Field label="Full Name"><b>{t.full_name}</b></Field>
        <Field label="Employee ID"><b className="whitespace-nowrap">{t.employee_number}</b></Field>
        <Field label="Level">{LEVEL_LABEL[t.level]}</Field>
        <Field label="Status">{STATUS_LABEL[t.status]}</Field>
        <Field label="Subjects" className="sm:col-span-2">{t.subjects.length ? t.subjects.join(', ') : '—'}</Field>
        <Field label="Class Teacher Of" className="sm:col-span-2">{classTeacherOf || '—'}</Field>
      </div>
    </Card>
  );
}
