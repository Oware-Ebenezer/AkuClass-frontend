import { useCallback, useMemo, useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Icon } from '../../../components/ui/Icon';
import { Input } from '../../../components/ui/Input';
import { LoadingState } from '../../../components/ui/LoadingState';
import { Pagination } from '../../../components/ui/Pagination';
import { Select } from '../../../components/ui/Select';
import { ACADEMIC_YEARS, DEFAULT_ACADEMIC_YEAR_ID, DEFAULT_TERM_ID, TERMS } from '../../../constants/academicYears';
import { useAsync } from '../../../hooks/useAsync';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { getClassSubjects, listClasses } from '../../../services/classService';
import { getResultsSummary, listResults } from '../../../services/resultService';
import type { PaginatedResponse } from '../../../types/api';
import type { ClassSubject } from '../../../types/class';
import type { ResultContext, ResultEntryFilter, ResultRow, ResultsSummary } from '../../../types/result';
import { EnterResultModal } from './EnterResultModal';
import { GradeDistribution } from './GradeDistribution';
import { ResultContextBar } from './ResultContextBar';
import { ResultMetrics } from './ResultMetrics';
import { ResultsTable } from './ResultsTable';

const PAGE_SIZE = 10;
const entryOptions = [{ value: '', label: 'All learners' }, { value: 'ENTERED', label: 'Entered' }, { value: 'PENDING', label: 'Not entered' }];

export default function ResultsPage() {
  const [yearId, setYearId] = useState(DEFAULT_ACADEMIC_YEAR_ID);
  const [termId, setTermId] = useState(DEFAULT_TERM_ID);
  const [classId, setClassId] = useState('');
  const [csId, setCsId] = useState('');
  const [search, setSearch] = useState('');
  const [entry, setEntry] = useState<ResultEntryFilter | ''>('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<ResultRow | null>(null);
  const q = useDebouncedValue(search.trim(), 300);

  const classes = useAsync(useCallback(() => listClasses({ page: 1, page_size: 100, academic_year_id: yearId, status: 'ACTIVE' }), [yearId]));
  const classList = classes.data?.data ?? [];
  const activeClassId = classList.find((c) => c.id === classId)?.id ?? classList[0]?.id ?? '';
  const subjects = useAsync(useCallback((): Promise<ClassSubject[]> => (activeClassId ? getClassSubjects(activeClassId) : Promise.resolve([])), [activeClassId]));
  const subjectList = subjects.data ?? [];
  const activeCs = subjectList.find((s) => s.id === csId) ?? subjectList[0];

  const ctx = useMemo<ResultContext | null>(
    () => (activeClassId && activeCs && !subjects.loading ? { academic_year_id: yearId, term_id: termId, class_id: activeClassId, subject_id: activeCs.subject.id } : null),
    [yearId, termId, activeClassId, activeCs, subjects.loading],
  );
  const results = useAsync(useCallback((): Promise<PaginatedResponse<ResultRow> | null> => (ctx ? listResults({ ...ctx, page, page_size: PAGE_SIZE, search: q || undefined, entry: entry || undefined }) : Promise.resolve(null)), [ctx, page, q, entry]));
  const summary = useAsync(useCallback((): Promise<ResultsSummary | null> => (ctx ? getResultsSummary(ctx) : Promise.resolve(null)), [ctx]));

  const reset = (fn: () => void) => { fn(); setPage(1); };
  const clear = () => { setSearch(''); setEntry(''); setPage(1); };
  const saved = () => { setEditing(null); results.reload(); summary.reload(); };

  const { data, error, loading, reload } = results;
  const rows = data && !error ? data.data.map((r, i) => ({ r, n: (data.pagination.page - 1) * data.pagination.page_size + i + 1 })) : null;
  const busy = classes.loading || subjects.loading || (loading && !data);
  const topError = classes.error ?? subjects.error;

  return (
    <PageContainer
      title="Academic Results"
      description="Record and review class assessment and terminal exam scores for each class and subject."
      actions={<>
        <Button variant="surface"><Icon name="download" size={18} className="text-charcoal-muted" />Export Broadsheet</Button>
        <Button variant="surface"><Icon name="publish" size={18} className="text-charcoal-muted" />Publish to Portal</Button>
      </>}
    >
      <ResultContextBar
        yearId={yearId} termId={termId} classId={activeClassId} subjectId={activeCs?.id ?? ''}
        yearOptions={ACADEMIC_YEARS.map((y) => ({ value: y.id, label: y.label }))} termOptions={TERMS.map((t) => ({ value: t.id, label: t.name }))}
        classOptions={classList.map((c) => ({ value: c.id, label: `${c.name} (${c.student_count} students)` }))}
        subjectOptions={subjectList.map((s) => ({ value: s.id, label: `${s.subject.name}${s.teacher ? ` — ${s.teacher.full_name}` : ''}` }))}
        onYear={(v) => reset(() => { setYearId(v); setClassId(''); setCsId(''); })} onTerm={(v) => reset(() => setTermId(v))}
        onClass={(v) => reset(() => { setClassId(v); setCsId(''); })} onSubject={(v) => reset(() => setCsId(v))}
      />

      {summary.data && !summary.error && <><ResultMetrics s={summary.data} /><GradeDistribution s={summary.data} /></>}

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col justify-between gap-3 p-4 md:flex-row md:items-center">
          <Input filled icon="search" aria-label="Search learners" className="w-full md:max-w-md" placeholder="Search learner name or ID..." value={search} onChange={(e) => reset(() => setSearch(e.target.value))} />
          <Select filled aria-label="Entry status" className="w-full md:w-44" options={entryOptions} value={entry} onChange={(e) => reset(() => setEntry(e.target.value as ResultEntryFilter | ''))} />
        </div>
        {busy && !topError && <LoadingState label="Loading results…" />}
        {topError && <ErrorState title="Unable to load this class" message={`${topError.message} Please try again.`} onRetry={classes.error ? classes.reload : subjects.reload} />}
        {!busy && !topError && !activeCs && <EmptyState icon="menu_book" title="No subjects for this class" message="Assign subjects and teachers to the class before entering results." />}
        {error && <ErrorState title="Unable to load results" message={`${error.message} Please try again.`} onRetry={reload} />}
        {rows && rows.length === 0 && <EmptyState title="No learners found" message="Try changing your search or filter." action={<Button variant="primary" onClick={clear}>Clear Filters</Button>} />}
        {rows && rows.length > 0 && data && (
          <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <ResultsTable rows={rows} onEdit={setEditing} />
            <div className="border-t border-warm-200"><Pagination pagination={data.pagination} onPageChange={setPage} itemLabel="learners" /></div>
          </div>
        )}
      </Card>
      <EnterResultModal row={editing} ctx={ctx} subjectName={activeCs?.subject.name ?? ''} onClose={() => setEditing(null)} onSaved={saved} />
    </PageContainer>
  );
}
