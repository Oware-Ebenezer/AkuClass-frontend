import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useAsync } from '../../hooks/useAsync';
import { getDashboardSummary } from '../../services/dashboardService';
import { QuickActions } from './dashboard/QuickActions';
import { SummaryCards } from './dashboard/SummaryCards';
import { AttendanceOverview } from './dashboard/AttendanceOverview';
import { AnnouncementsList } from './dashboard/AnnouncementsList';
import { UpcomingEvents } from './dashboard/UpcomingEvents';
import { RecentActivity } from './dashboard/RecentActivity';

export default function DashboardPage() {
  const { data, error, loading, reload } = useAsync(getDashboardSummary);

  const actions = data && (
    <>
      {data.term.inSession && (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-pale px-3 py-1.5 text-xs font-semibold">
          <span className="size-2 rounded-full bg-orange" />
          {data.term.name} in Session · Week {data.term.week}
        </span>
      )}
      <Button variant="surface"><Icon name="download" size={18} className="text-charcoal-muted" />Export Report</Button>
      <Button variant="icon" aria-label="Refresh dashboard" onClick={reload}><Icon name="refresh" /></Button>
    </>
  );

  return (
    <PageContainer title="Dashboard" description="Overview of your school's activity and performance." actions={actions}>
      {loading && <LoadingState />}
      {error && <ErrorState message={error.message} onRetry={reload} />}
      {data && (
        <>
          <QuickActions />
          <SummaryCards data={data} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <AttendanceOverview data={data.attendanceToday} />
              <AnnouncementsList items={data.announcements} />
            </div>
            <div className="space-y-6 lg:col-span-4">
              <UpcomingEvents items={data.events} />
              <RecentActivity items={data.activity} />
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
}
