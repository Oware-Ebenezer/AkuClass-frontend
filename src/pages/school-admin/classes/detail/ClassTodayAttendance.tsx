import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../../components/ui/Card';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { Icon } from '../../../../components/ui/Icon';
import { LoadingState } from '../../../../components/ui/LoadingState';
import { useAsync } from '../../../../hooks/useAsync';
import { getAttendanceSession } from '../../../../services/attendanceService';
import { todayIso } from '../../../../utils/format';
import { AttendanceSummary } from '../../attendance/AttendanceSummary';

export function ClassTodayAttendance({ classId }: { classId: string }) {
  const { data, error, loading, reload } = useAsync(useCallback(() => getAttendanceSession({ class_id: classId, date: todayIso() }), [classId]));
  const link = (
    <Link to={`/app/attendance?class_id=${encodeURIComponent(classId)}`} className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:text-teal-dark">
      View Register<Icon name="arrow_forward" size={16} />
    </Link>
  );
  if (loading && !data) return <Card><LoadingState label="Loading today's attendance…" /></Card>;
  if (error) return <Card><ErrorState title="Unable to load today's attendance" message={`${error.message} Please try again.`} onRetry={reload} /></Card>;
  if (!data) return <Card><EmptyState icon="event_busy" title="No roll call recorded today" message="Today's attendance will appear here once a roll call is recorded." action={link} /></Card>;
  return (
    <div className="space-y-2">
      <AttendanceSummary session={data} />
      <div className="px-1">{link}</div>
    </div>
  );
}
