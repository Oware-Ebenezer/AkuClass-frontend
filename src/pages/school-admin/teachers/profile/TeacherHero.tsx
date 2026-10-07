import { AccountStatusBadge } from '../../../../components/ui/AccountStatusBadge';
import { Avatar } from '../../../../components/ui/Avatar';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/ui/Icon';
import type { TeacherDetail } from '../../../../types/teacher';
import { LevelBadge } from '../../../../components/ui/LevelBadge';

export function TeacherHero({ teacher: t }: { teacher: TeacherDetail }) {
  const classTeacherOf = t.classes.filter((c) => c.is_class_teacher).map((c) => c.name).join(', ');
  return (
    <Card className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Avatar name={t.full_name} src={t.photo_url} size={112} shape="rounded" />
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[28px] leading-9 font-bold tracking-tight">{t.full_name}</h1>
            <AccountStatusBadge status={t.status} />
            <LevelBadge level={t.level} />
          </div>
          {classTeacherOf && <p className="flex items-center gap-1 text-sm font-semibold text-orange-dark"><Icon name="supervisor_account" size={18} />Class Teacher • {classTeacherOf}</p>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-charcoal-muted">
            <span className="font-semibold whitespace-nowrap text-charcoal">{t.employee_number}</span>
            <span className="flex items-center gap-1"><Icon name="call" size={16} />{t.phone}</span>
            <span className="flex items-center gap-1"><Icon name="mail" size={16} />{t.email}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="surface"><Icon name="print" size={18} className="text-charcoal-muted" />Print Schedule</Button>
        <Button variant="primary"><Icon name="edit" size={18} />Edit Teacher</Button>
        <Button variant="icon" aria-label="More actions"><Icon name="more_vert" /></Button>
      </div>
    </Card>
  );
}
