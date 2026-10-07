import { Link } from 'react-router-dom';
import { Badge } from '../../../../components/ui/Badge';
import { Card } from '../../../../components/ui/Card';
import { CardTitle } from '../../../../components/ui/DetailField';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { Icon } from '../../../../components/ui/Icon';
import type { TeacherClassDetail } from '../../../../types/teacher';

export function TeacherClassesCard({ classes }: { classes: TeacherClassDetail[] }) {
  return (
    <Card className="space-y-4">
      <CardTitle icon="meeting_room">Assigned Classes</CardTitle>
      {classes.length === 0 ? <EmptyState icon="meeting_room" title="No classes assigned" message="Classes will appear here once this teacher is assigned." /> : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {classes.map((c) => (
            <div key={c.id} className="flex flex-col justify-between gap-3 rounded-xl bg-warm-100 p-4">
              <div className="flex items-center justify-between gap-2">
                <Link to={`/app/classes/${c.id}`} className="text-lg font-semibold hover:text-teal">{c.name}</Link>
                {c.is_class_teacher ? <Badge tone="orange">Class Teacher</Badge> : <Badge>Subject Teacher</Badge>}
              </div>
              <p className="text-xs text-charcoal-muted">{c.student_count} students</p>
              <Link to={`/app/attendance?class_id=${encodeURIComponent(c.id)}`} className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:text-teal-dark">View Register<Icon name="arrow_forward" size={16} /></Link>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
