import { useCallback, useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Icon } from '../../../components/ui/Icon';
import { LoadingState } from '../../../components/ui/LoadingState';
import { Select } from '../../../components/ui/Select';
import { DEFAULT_ACADEMIC_YEAR_ID } from '../../../constants/academicYears';
import { useAsync } from '../../../hooks/useAsync';
import { listClasses } from '../../../services/classService';
import { getClassTimetable } from '../../../services/timetableService';
import type { SchoolSection } from '../../../types/student';
import type { ClassTimetable } from '../../../types/timetable';
import { TimetableEntryModal, type EditorState } from './TimetableEntryModal';
import { TimetableMatrix } from './TimetableMatrix';

export default function TimetablePage() {
  const [section, setSection] = useState<SchoolSection>('JHS');
  const [classId, setClassId] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);

  const classes = useAsync(useCallback(() => listClasses({ page: 1, page_size: 100, academic_year_id: DEFAULT_ACADEMIC_YEAR_ID, status: 'ACTIVE' }), []));
  const list = (classes.data?.data ?? []).filter((c) => c.school_section === section);
  const activeClassId = list.find((c) => c.id === classId)?.id ?? list[0]?.id ?? '';
  const tt = useAsync(useCallback((): Promise<ClassTimetable | null> => (activeClassId ? getClassTimetable(activeClassId) : Promise.resolve(null)), [activeClassId]));

  const { data, error, loading, reload } = tt;
  const timetable = data && !error && data.class.id === activeClassId ? data : null;
  const clashes = timetable?.entries.filter((e) => e.conflict) ?? [];
  const saved = () => { setEditor(null); reload(); };
  const seg = (s: SchoolSection) => `rounded-md px-3 py-1 text-xs font-semibold transition-colors ${section === s ? 'bg-white text-teal shadow-sm' : 'text-charcoal-lighter hover:text-charcoal'}`;

  return (
    <PageContainer
      title="Class Timetable"
      description="Weekly lessons, teacher allocations and break routines for each class."
      actions={<>
        <Button variant="surface"><Icon name="schedule" size={18} className="text-charcoal-muted" />Period Structure</Button>
        <Button variant="surface"><Icon name="picture_as_pdf" size={18} className="text-charcoal-muted" />Export Master</Button>
        <Button variant="surface" onClick={() => window.print()}><Icon name="print" size={18} className="text-charcoal-muted" />Print Timetable</Button>
        <Button variant="primary" disabled={!timetable} onClick={() => setEditor({})}><Icon name="add" />Add Timetable Entry</Button>
      </>}
    >
      <Card className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg bg-warm-100 p-1" role="group" aria-label="School section">
            <button type="button" className={seg('JHS')} aria-pressed={section === 'JHS'} onClick={() => { setSection('JHS'); setClassId(''); }}>JHS 1–3</button>
            <button type="button" className={seg('SHS')} aria-pressed={section === 'SHS'} onClick={() => { setSection('SHS'); setClassId(''); }}>SHS 1–3</button>
          </div>
          <Select filled aria-label="Class" className="w-64" options={list.map((c) => ({ value: c.id, label: `${c.name} (${c.student_count} students)` }))} value={activeClassId} onChange={(e) => setClassId(e.target.value)} disabled={list.length === 0} />
        </div>
        {timetable && (
          <div className="flex items-center gap-2 text-xs text-charcoal-muted">
            <span>{timetable.entries.length} lessons</span>
            {clashes.length > 0 && <Badge tone="danger" dot>{clashes.length} {clashes.length === 1 ? 'clash' : 'clashes'}</Badge>}
          </div>
        )}
      </Card>

      {clashes.length > 0 && (
        <div role="alert" className="flex flex-col justify-between gap-3 rounded-xl bg-danger-pale p-4 md:flex-row md:items-center">
          <div className="flex items-start gap-3 text-sm">
            <Icon name="report_problem" className="mt-0.5 shrink-0 text-danger" />
            <div><b className="text-danger">{clashes.length} scheduling {clashes.length === 1 ? 'clash' : 'clashes'} in this timetable.</b> <span className="text-charcoal-lighter">{clashes[0].conflict}</span></div>
          </div>
          <Button variant="primary" onClick={() => setEditor({ entry: clashes[0] })}>Resolve Clash</Button>
        </div>
      )}

      <Card className="overflow-hidden p-0">
        {(classes.loading || (loading && !timetable)) && !classes.error && <LoadingState label="Loading timetable…" />}
        {classes.error && <ErrorState title="Unable to load classes" message={`${classes.error.message} Please try again.`} onRetry={classes.reload} />}
        {error && <ErrorState title="Unable to load this timetable" message={`${error.message} Please try again.`} onRetry={reload} />}
        {!classes.loading && !classes.error && list.length === 0 && <EmptyState icon="meeting_room" title="No classes found" message={`There are no active ${section} classes.`} />}
        {timetable && timetable.entries.length === 0 && <EmptyState icon="calendar_month" title="No lessons scheduled" message="Add lessons once subjects and teachers are assigned to this class." action={<Button variant="primary" onClick={() => setEditor({})}>Add Timetable Entry</Button>} />}
        {timetable && timetable.entries.length > 0 && (
          <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <TimetableMatrix data={timetable} onEdit={(entry) => setEditor({ entry })} onAdd={(day, periodId) => setEditor({ day, periodId })} />
          </div>
        )}
      </Card>
      <TimetableEntryModal editor={editor} classId={activeClassId} periods={timetable?.periods ?? []} onClose={() => setEditor(null)} onSaved={saved} />
    </PageContainer>
  );
}
