import { Link } from 'react-router-dom';
import { Badge } from '../../../../components/ui/Badge';
import { Card } from '../../../../components/ui/Card';
import { CardTitle } from '../../../../components/ui/DetailField';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { Table, type Column } from '../../../../components/ui/Table';
import type { TeacherAssignment } from '../../../../types/teacher';

const columns: Column<TeacherAssignment>[] = [
  { key: 'subject', header: 'Subject', className: 'whitespace-nowrap', render: (a) => <span className="font-medium">{a.subject.name}</span> },
  { key: 'class', header: 'Class', className: 'whitespace-nowrap', render: (a) => (
    <div className="flex items-center gap-2"><span className="font-medium">{a.class.name}</span>{a.is_class_teacher && <Badge tone="orange">Class Teacher</Badge>}</div>
  ) },
  { key: 'year', header: 'Academic Year', className: 'whitespace-nowrap', render: (a) => <span className="text-charcoal-lighter">{a.academic_year}</span> },
  { key: 'actions', header: 'Actions', className: 'text-right whitespace-nowrap', render: (a) => (
    <Link to={`/app/classes/${a.class.id}`} className="rounded-md bg-teal-pale px-3 py-1 text-[11px] font-bold text-teal-dark transition-colors hover:bg-teal hover:text-white">View Class</Link>
  ) },
];

export function TeacherAssignmentsCard({ assignments, academicYear }: { assignments: TeacherAssignment[]; academicYear: string }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between gap-2 p-6">
        <CardTitle icon="table_chart">Teaching Assignments</CardTitle>
        <span className="text-xs text-charcoal-muted">Academic Year {academicYear}</span>
      </div>
      {assignments.length === 0 ? <EmptyState icon="table_chart" title="No teaching assignments" message="Subject and class assignments will appear here." /> : (
        <>
          <Table columns={columns} rows={assignments} getRowKey={(a) => a.id} />
          <p className="border-t border-warm-200 px-6 py-3 text-xs text-charcoal-muted">{assignments.length} teaching {assignments.length === 1 ? 'assignment' : 'assignments'} for {academicYear}</p>
        </>
      )}
    </Card>
  );
}
