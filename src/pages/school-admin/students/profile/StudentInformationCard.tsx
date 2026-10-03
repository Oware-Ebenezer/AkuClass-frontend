import type { ReactNode } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/ui/Icon';
import { GENDER_LABEL, SECTION_LABEL, STATUS_LABEL } from '../../../../constants/student';
import type { StudentDetail } from '../../../../types/student';
import { ageFrom, formatDate } from '../../../../utils/format';

export function CardTitle({ icon, children }: { icon: string; children: ReactNode }) {
  return <h2 className="flex items-center gap-1 text-lg font-semibold"><Icon name={icon} size={22} className="text-teal" />{children}</h2>;
}
export function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[11px] font-bold tracking-wider text-charcoal-muted uppercase">{label}</span>
      <span className="text-sm text-charcoal">{children}</span>
    </div>
  );
}

const long = { day: 'numeric', month: 'long', year: 'numeric' } as const;

export function StudentInformationCard({ student: s }: { student: StudentDetail }) {
  return (
    <Card className="space-y-4">
      <CardTitle icon="badge">Student Information</CardTitle>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <Field label="Full Name"><b>{s.full_name}</b></Field>
        <Field label="Student ID"><b className="whitespace-nowrap">{s.student_number}</b></Field>
        <Field label="Date of Birth">{formatDate(s.date_of_birth, long)} <span className="text-xs text-charcoal-muted">(Age {ageFrom(s.date_of_birth)})</span></Field>
        <Field label="Gender">{GENDER_LABEL[s.gender]}</Field>
        <Field label="Admission Date">{formatDate(s.admission_date, long)}</Field>
        <Field label="Current Class"><b className="text-teal">{s.class_name}</b></Field>
        <Field label="Section">{SECTION_LABEL[s.school_section]}</Field>
        <Field label="Enrollment Status">{STATUS_LABEL[s.status]}</Field>
      </div>
    </Card>
  );
}
