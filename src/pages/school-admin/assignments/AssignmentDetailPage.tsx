import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';
import { ErrorState } from '../../../components/ui/ErrorState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { useAsync } from '../../../hooks/useAsync';
import { getAssignment } from '../../../services/assignmentService';
import { AssignmentHero } from './detail/AssignmentHero';
import { AttachmentsCard, InstructionsCard, SpecsCard } from './detail/AssignmentInfoCards';
import { AssignmentMetrics } from './detail/AssignmentMetrics';
import { SubmissionsSection } from './detail/SubmissionsSection';

export default function AssignmentDetailPage() {
  const { assignmentId = '' } = useParams();
  const { data, error, loading, reload } = useAsync(useCallback(() => getAssignment(assignmentId), [assignmentId]));
  const notFound = error?.kind === 'not_found';

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <Breadcrumb items={[{ label: 'Academics' }, { label: 'Assignments', to: '/app/assignments' }, { label: data?.title ?? 'Assignment' }]} />
      {loading && !data && <LoadingState label="Loading assignment…" />}
      {error && (
        <>
          <ErrorState title={notFound ? 'Assignment not found' : 'Unable to load this assignment'} message={notFound ? error.message : `${error.message} Please try again.`} onRetry={notFound ? undefined : reload} />
          <Link to="/app/assignments" className="mx-auto -mt-12 text-xs font-semibold text-teal hover:text-teal-dark">Back to Assignments</Link>
        </>
      )}
      {data && !error && (
        <>
          <AssignmentHero a={data} onChanged={reload} />
          <AssignmentMetrics a={data} />
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-5">
              <SpecsCard a={data} />
              <InstructionsCard a={data} />
              <AttachmentsCard a={data} />
            </div>
            <div className="lg:col-span-7"><SubmissionsSection a={data} onGraded={reload} /></div>
          </div>
        </>
      )}
    </div>
  );
}
