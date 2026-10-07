import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';
import { ErrorState } from '../../../components/ui/ErrorState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { StatTile } from '../../../components/ui/StatTile';
import { useAsync } from '../../../hooks/useAsync';
import { getClass, getClassSubjects } from '../../../services/classService';
import { ClassHero } from './detail/ClassHero';
import { ClassRosterSection } from './detail/ClassRosterSection';
import { ClassSubjectsSection } from './detail/ClassSubjectsSection';
import { ClassTodayAttendance } from './detail/ClassTodayAttendance';

export default function ClassDetailPage() {
  const { classId = '' } = useParams();
  const cls = useAsync(useCallback(() => getClass(classId), [classId]));
  const subjects = useAsync(useCallback(() => getClassSubjects(classId), [classId]));
  const { data, error, loading, reload } = cls;
  const notFound = error?.kind === 'not_found';
  const list = subjects.data && !subjects.error ? subjects.data : null;
  const teacherCount = list ? new Set(list.flatMap((s) => (s.teacher ? [s.teacher.id] : []))).size : 0;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <Breadcrumb items={[{ label: 'Academics' }, { label: 'Classes', to: '/app/classes' }, { label: data?.name ?? 'Class Details' }]} />
      {loading && !data && <LoadingState label="Loading class…" />}
      {error && (
        <>
          <ErrorState title={notFound ? 'Class not found' : 'Unable to load this class'} message={notFound ? error.message : `${error.message} Please try again.`} onRetry={notFound ? undefined : reload} />
          <Link to="/app/classes" className="mx-auto -mt-12 text-xs font-semibold text-teal hover:text-teal-dark">Back to Classes</Link>
        </>
      )}
      {data && !error && (
        <>
          <ClassHero cls={data} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatTile label="Enrolled Learners" icon="groups" value={data.student_count} aside="students" />
            <StatTile label="Subjects" icon="menu_book" value={list ? list.length : '—'} aside={list ? `${teacherCount} ${teacherCount === 1 ? 'teacher' : 'teachers'}` : undefined} />
            <StatTile label="Attendance Summary" icon="fact_check" value={`${data.attendance_summary.rate}%`} aside={`Cumulative · ${data.academic_year}`} />
          </div>
          <ClassTodayAttendance classId={data.id} />
          <ClassRosterSection classId={data.id} />
          <ClassSubjectsSection subjects={list} error={subjects.error} loading={subjects.loading} onRetry={subjects.reload} />
        </>
      )}
    </div>
  );
}
