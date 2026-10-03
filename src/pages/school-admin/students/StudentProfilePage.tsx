import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../../../components/ui/Icon';
import { ErrorState } from '../../../components/ui/ErrorState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { useAsync } from '../../../hooks/useAsync';
import { getStudent } from '../../../services/studentService';
import { AttendanceSummaryCard } from './profile/AttendanceSummaryCard';
import { ContactCard } from './profile/ContactCard';
import { EnrollmentHistoryCard } from './profile/EnrollmentHistoryCard';
import { ProfileHeader } from './profile/ProfileHeader';
import { ResultsCard } from './profile/ResultsCard';
import { StudentInformationCard } from './profile/StudentInformationCard';

export default function StudentProfilePage() {
  const { studentId = '' } = useParams();
  const { data, error, loading, reload } = useAsync(useCallback(() => getStudent(studentId), [studentId]));
  const notFound = error?.kind === 'not_found';

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-charcoal-muted">
        <span>Academics</span>
        <Icon name="chevron_right" size={16} />
        <Link to="/app/students" className="hover:text-teal">Students</Link>
        <Icon name="chevron_right" size={16} />
        <span className="font-semibold text-charcoal">Student Profile</span>
      </nav>

      {loading && !data && <LoadingState label="Loading student profile…" />}
      {error && (
        <>
          <ErrorState title={notFound ? 'Student not found' : 'Unable to load this student'}
            message={notFound ? error.message : `${error.message} Please try again.`} onRetry={notFound ? undefined : reload} />
          <Link to="/app/students" className="mx-auto -mt-12 text-xs font-semibold text-teal hover:text-teal-dark">Back to Students</Link>
        </>
      )}
      {data && !error && (
        <>
          <ProfileHeader student={data} />
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <StudentInformationCard student={data} />
              <ContactCard student={data} />
              <ResultsCard results={data.recent_results} />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5">
              <AttendanceSummaryCard student={data} />
              <EnrollmentHistoryCard history={data.enrollment_history} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
