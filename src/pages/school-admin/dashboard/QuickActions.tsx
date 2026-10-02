import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/ui/Icon';

const secondary = [
  { icon: 'badge', label: '+ Add Teacher' },
  { icon: 'meeting_room', label: '+ Create Class' },
  { icon: 'fact_check', label: 'Record Attendance' },
  { icon: 'campaign', label: 'Publish Announcement' },
];

export function QuickActions() {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-2 p-4">
      <div className="flex items-center gap-1 text-xs font-bold text-charcoal-muted">
        <Icon name="bolt" className="text-teal" />Quick Actions
      </div>
      <div className="flex flex-1 flex-wrap items-center justify-start gap-2 md:justify-end">
        <Button variant="primary"><Icon name="person_add" />+ Add Student</Button>
        {secondary.map((a) => (
          <Button key={a.label}><Icon name={a.icon} size={18} className="text-teal" />{a.label}</Button>
        ))}
      </div>
    </Card>
  );
}
