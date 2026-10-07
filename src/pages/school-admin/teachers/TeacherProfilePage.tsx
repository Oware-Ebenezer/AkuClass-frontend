import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';
import { ErrorState } from '../../../components/ui/ErrorState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { StatTile } from '../../../components/ui/StatTile';
import { useAsync } from '../../../hooks/useAsync';
import { getTeacher } from '../../../services/teacherService';
import { TeacherAssignmentsCard } from './profile/TeacherAssignmentsCard';
import { TeacherClassesCard } from './profile/TeacherClassesCard';
import { TeacherContactCard } from './profile/TeacherContactCard';
import { TeacherHero } from './profile/TeacherHero';
import { TeacherInfoCard } from './profile/TeacherInfoCard';

export default function TeacherProfilePage() {
  const { teacherId = '' } = useParams();
  const { data, error, loading, reload } = useAsync(useCallback(() => getTeacher(teacherId), [teacherId]));
  const notFound = error?.kind === 'not_found';
  const students = data ? data.classes.reduce((sum, c) => sum + c.student_count, 0) : 0;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <Breadcrumb items={[{ label: 'Academics' }, { label: 'Teachers', to: '/app/teachers' }, { label: 'Teacher Profile' }]} />
      {loading && !data && <LoadingState label="Loading teacher profile…" />}
      {error && (
        <>
          <ErrorState title={notFound ? 'Teacher not found' : 'Unable to load this teacher'} message={notFound ? error.message : `${error.message} Please try again.`} onRetry={notFound ? undefined : reload} />
          <Link to="/app/teachers" className="mx-auto -mt-12 text-xs font-semibold text-teal hover:text-teal-dark">Back to Teachers</Link>
        </>
      )}
      {data && !error && (
        <>
          <TeacherHero teacher={data} />
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-5">
              <TeacherInfoCard teacher={data} />
              <TeacherContactCard teacher={data} />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatTile label="Assigned Classes" icon="groups" value={data.classes.length} aside={data.classes.slice(0, 3).map((c) => c.name).join(', ')} />
                <StatTile label="Students Taught" icon="school" value={students} aside={`across ${data.classes.length} ${data.classes.length === 1 ? 'class' : 'classes'}`} />
              </div>
              <TeacherClassesCard classes={data.classes} />
              <TeacherAssignmentsCard assignments={data.assignments} academicYear={data.academic_year} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
