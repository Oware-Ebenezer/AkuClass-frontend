import { Avatar } from '../../../../components/ui/Avatar';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/ui/Icon';
import type { StudentDetail } from '../../../../types/student';
import { SectionBadge } from '../../../../components/ui/SectionBadge';
import { AccountStatusBadge } from '../../../../components/ui/AccountStatusBadge';

export function ProfileHeader({ student }: { student: StudentDetail }) {
  return (
    <Card className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Avatar name={student.full_name} src={student.photo_url} size={96} shape="rounded" />
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[28px] leading-9 font-bold tracking-tight">{student.full_name}</h1>
            <AccountStatusBadge status={student.status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-charcoal-muted">
            <span>ID: <span className="font-semibold whitespace-nowrap text-charcoal">{student.student_number}</span></span>
            <span aria-hidden>•</span>
            <span className="flex items-center gap-1.5">
              <span className="rounded bg-warm-100 px-2 py-0.5 text-[11px] font-bold text-charcoal">{student.class_name}</span>
              <SectionBadge section={student.school_section} />
            </span>
            <span aria-hidden>•</span>
            <span>Academic Year: <span className="font-medium text-charcoal">{student.academic_year}</span></span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary"><Icon name="edit" size={18} />Edit Student</Button>
        <Button variant="surface">More Actions<Icon name="expand_more" size={18} className="text-charcoal-muted" /></Button>
        <Button variant="icon" aria-label="Print academic record"><Icon name="print" /></Button>
      </div>
    </Card>
  );
}
