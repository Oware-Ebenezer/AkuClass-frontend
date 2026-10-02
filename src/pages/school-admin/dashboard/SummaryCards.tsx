import type { ReactNode } from 'react';
import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/ui/Icon';
import type { DashboardSummary } from '../../../types';
import { percent } from '../../../utils/format';

interface StatCardProps { label: string; icon: string; value: ReactNode; footer: ReactNode; accent?: boolean; }

function StatCard({ label, icon, value, footer, accent }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-charcoal-muted">{label}</span>
        <span className={`flex size-10 items-center justify-center rounded-lg ${accent ? 'bg-orange-pale text-orange-dark' : 'bg-teal-pale text-teal'}`}>
          <Icon name={icon} size={22} />
        </span>
      </div>
      <div className="mt-4 text-4xl leading-[2.75rem] font-bold tracking-tight">{value}</div>
      <div className="mt-1 flex items-center gap-1 text-[11px] text-charcoal-muted">{footer}</div>
      <div className={`absolute inset-x-0 bottom-0 h-1 ${accent ? 'bg-orange' : 'bg-teal/20'}`} />
    </Card>
  );
}

export function SummaryCards({ data }: { data: DashboardSummary }) {
  const a = data.attendanceToday;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Students" icon="school" value={data.students.total.toLocaleString()}
        footer={<><span className="font-semibold text-teal">+{data.students.enrolledThisTerm}</span> enrolled this term</>} />
      <StatCard label="Total Teachers" icon="person_apron" value={data.teachers.total}
        footer={<><span className="font-semibold text-teal">{data.teachers.newThisYear} new</span> this academic year</>} />
      <StatCard accent label="Today's Attendance" icon="calendar_today"
        value={<span className="text-teal">{percent(a.present, a.enrolled)}%</span>}
        footer={<><span className="font-semibold text-charcoal">{a.present} of {a.enrolled}</span> learners present</>} />
      <StatCard label="Active Classes" icon="meeting_room" value={data.classes.total}
        footer={<><span className="font-semibold text-teal">{data.classes.jhs} JHS</span>•<span className="font-semibold text-teal">{data.classes.shs} SHS</span> classes</>} />
    </div>
  );
}
