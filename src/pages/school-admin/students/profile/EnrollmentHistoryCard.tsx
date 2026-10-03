import { Badge } from '../../../../components/ui/Badge';
import { Card } from '../../../../components/ui/Card';
import type { EnrollmentRecord } from '../../../../types/student';
import { CardTitle } from './StudentInformationCard';

export function EnrollmentHistoryCard({ history }: { history: EnrollmentRecord[] }) {
  return (
    <Card className="space-y-4">
      <CardTitle icon="history_edu">Enrollment History</CardTitle>
      <ol className="space-y-4">
        {history.map((h, i) => (
          <li key={h.id} className="relative pl-6">
            <span className={`absolute top-1 left-0 size-3 rounded-full ${h.is_current ? 'bg-teal' : 'bg-charcoal-muted'}`} />
            {i < history.length - 1 && <span className="absolute top-4 -bottom-4 left-[5px] w-0.5 bg-warm-200" />}
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs ${h.is_current ? 'font-bold' : 'font-semibold text-charcoal-lighter'}`}>{h.academic_year} Academic Year</span>
              <Badge tone={h.is_current ? 'teal' : 'neutral'}>{h.is_current ? 'Current' : 'Completed'}</Badge>
            </div>
            <p className={`mt-0.5 text-sm ${h.is_current ? 'font-medium' : 'text-charcoal-lighter'}`}>{h.class_name}</p>
            <p className="mt-1 text-xs text-charcoal-muted">Class Teacher: {h.class_teacher} • {h.period}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
