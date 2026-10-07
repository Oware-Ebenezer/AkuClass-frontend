import { Link } from 'react-router-dom';
import { Avatar } from '../../../../components/ui/Avatar';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { CardTitle } from '../../../../components/ui/DetailField';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { Icon } from '../../../../components/ui/Icon';
import { LoadingState } from '../../../../components/ui/LoadingState';
import type { ClassSubject } from '../../../../types/class';
import type { ApiError } from '../../../../services/apiClient';

interface Props { subjects: ClassSubject[] | null; error: ApiError | null; loading: boolean; onRetry: () => void; }

export function ClassSubjectsSection({ subjects, error, loading, onRetry }: Props) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <CardTitle icon="menu_book">Subjects &amp; Assigned Teachers</CardTitle>
        <Button variant="surface"><Icon name="add_circle" size={18} className="text-charcoal-muted" />Assign Subject</Button>
      </div>
      {loading && !subjects && <LoadingState label="Loading subjects…" />}
      {error && <ErrorState title="Unable to load subjects" message={`${error.message} Please try again.`} onRetry={onRetry} />}
      {subjects && !error && subjects.length === 0 && <EmptyState icon="menu_book" title="No subjects assigned" message="Subjects will appear here once they are assigned to this class." />}
      {subjects && !error && subjects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {subjects.map((s) => (
            <div key={s.id} className="flex flex-col justify-between gap-4 rounded-xl bg-warm-100 p-4">
              <h3 className="text-base font-semibold">{s.subject.name}</h3>
              {s.teacher ? (
                <div className="flex items-center gap-2">
                  <Avatar name={s.teacher.full_name} size={32} />
                  <div className="flex min-w-0 flex-col leading-tight">
                    <Link to={`/app/teachers/${s.teacher.id}`} className="truncate text-xs font-semibold hover:text-teal">{s.teacher.full_name}</Link>
                    <span className="text-[11px] text-charcoal-muted">{s.teacher.employee_number}</span>
                  </div>
                </div>
              ) : <span className="text-xs text-charcoal-muted">No teacher assigned</span>}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
