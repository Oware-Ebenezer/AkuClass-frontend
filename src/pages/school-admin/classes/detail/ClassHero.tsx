import { Link } from 'react-router-dom';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/ui/Icon';
import { useSession } from '../../../../context/SessionContext';
import type { ClassDetail } from '../../../../types/class';
import { ClassStatusBadge } from '../ClassStatusBadge';

export function ClassHero({ cls }: { cls: ClassDetail }) {
  const { termName } = useSession();
  return (
    <Card className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-[28px] leading-9 font-bold tracking-tight">{cls.name}</h1>
          <ClassStatusBadge status={cls.status} />
          <Badge>{cls.level}</Badge>
        </div>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-charcoal-muted">
          <span className="inline-flex items-center gap-1">
            <Icon name="person" size={18} className="text-teal" />Class Teacher:{' '}
            {cls.class_teacher ? <Link to={`/app/teachers/${cls.class_teacher.id}`} className="font-semibold text-teal hover:underline">{cls.class_teacher.full_name}</Link> : <span>Not assigned</span>}
          </span>
          <span aria-hidden>•</span>
          <span className="inline-flex items-center gap-1"><Icon name="calendar_today" size={18} className="text-teal" />{cls.academic_year} Academic Year ({termName})</span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="surface"><Icon name="print" size={18} className="text-charcoal-muted" />Print Roster</Button>
        <Button variant="surface"><Icon name="download" size={18} className="text-charcoal-muted" />Export Data</Button>
        <Button variant="primary"><Icon name="edit" size={18} />Edit Class</Button>
      </div>
    </Card>
  );
}
