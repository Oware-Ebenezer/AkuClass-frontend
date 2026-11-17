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
import { StatTile } from '../../../components/ui/StatTile';
import { AUDIENCE_LABEL } from '../../../constants/announcement';
import { DEFAULT_ACADEMIC_YEAR_ID } from '../../../constants/academicYears';
import { useAsync } from '../../../hooks/useAsync';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { getAnnouncementCounts, listAnnouncements } from '../../../services/announcementService';
import { listClasses } from '../../../services/classService';
import type { AnnouncementAudience, AnnouncementListParams, AnnouncementStatus } from '../../../types/announcement';
import { AnnouncementFormModal, type FormEditor } from './AnnouncementFormModal';
import { AnnouncementPreview } from './AnnouncementPreview';
import { AnnouncementsTable } from './AnnouncementsTable';

const PAGE_SIZE = 10;
const audienceOptions = [{ value: '', label: 'All Audiences' }, ...(Object.keys(AUDIENCE_LABEL) as AnnouncementAudience[]).map((v) => ({ value: v, label: AUDIENCE_LABEL[v] }))];

export default function AnnouncementsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AnnouncementStatus | ''>('');
  const [audience, setAudience] = useState<AnnouncementAudience | ''>('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [editor, setEditor] = useState<FormEditor | null>(null);
  const q = useDebouncedValue(search.trim(), 300);

  const params = useMemo<AnnouncementListParams>(() => ({ page, page_size: PAGE_SIZE, search: q || undefined, status: status || undefined, audience: audience || undefined }), [page, q, status, audience]);
  const list = useAsync(useCallback(() => listAnnouncements(params), [params]));
  const counts = useAsync(getAnnouncementCounts);
  const classes = useAsync(useCallback(() => listClasses({ page: 1, page_size: 100, academic_year_id: DEFAULT_ACADEMIC_YEAR_ID, status: 'ACTIVE' }), []));

  const reset = (fn: () => void) => { fn(); setPage(1); };
  const clear = () => { setSearch(''); setStatus(''); setAudience(''); setPage(1); };
  const changed = () => { list.reload(); counts.reload(); setVersion((v) => v + 1); };
  const saved = () => { setEditor(null); changed(); };

  const { data, error, loading, reload } = list;
  const rows = data && !error ? data.data : null;
  const activeId = selectedId ?? rows?.[0]?.id ?? null;
  const c = counts.data;
  const tab = (active: boolean) => `rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${active ? 'bg-teal text-white shadow-sm' : 'text-charcoal-lighter hover:text-charcoal'}`;
  const tabs: { value: AnnouncementStatus | ''; label: string; n?: number }[] = [
    { value: '', label: 'All', n: c?.total }, { value: 'PUBLISHED', label: 'Published', n: c?.published }, { value: 'DRAFT', label: 'Drafts', n: c?.draft }, { value: 'ARCHIVED', label: 'Archived', n: c?.archived },
  ];

  return (
    <PageContainer
      title="Announcements"
      description="Write, publish and archive notices for the whole school, a level, a class or staff."
      actions={<>
        <Button variant="surface"><Icon name="download" size={18} className="text-charcoal-muted" />Export Log</Button>
        <Button variant="primary" onClick={() => setEditor({})}><Icon name="add" />Create Announcement</Button>
      </>}
    >
      {c && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Total Announcements" icon="campaign" value={c.total} />
          <StatTile label="Published" icon="publish" value={c.published} aside="Visible now" />
          <StatTile label="Drafts" icon="edit_note" value={c.draft} aside="Not yet visible" />
          <StatTile label="Archived" icon="archive" value={c.archived} />
        </div>
      )}

      <Card className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <Input filled icon="search" aria-label="Search announcements" className="w-full lg:max-w-md" placeholder="Search by title or author..." value={search} onChange={(e) => reset(() => setSearch(e.target.value))} />
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg bg-warm-100 p-1" role="group" aria-label="Status">
            {tabs.map((t) => <button key={t.label} type="button" aria-pressed={status === t.value} className={tab(status === t.value)} onClick={() => reset(() => setStatus(t.value))}>{t.label}{t.n !== undefined ? ` (${t.n})` : ''}</button>)}
          </div>
          <Select filled aria-label="Audience" className="w-44" options={audienceOptions} value={audience} onChange={(e) => reset(() => setAudience(e.target.value as AnnouncementAudience | ''))} />
        </div>
      </Card>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        <Card className="overflow-hidden p-0 xl:col-span-7">
          {loading && !data && <LoadingState label="Loading announcements…" />}
          {error && <ErrorState title="Unable to load announcements" message={`${error.message} Please try again.`} onRetry={reload} />}
          {rows && rows.length === 0 && <EmptyState title="No announcements found" message="Try changing your search or filters." action={<Button variant="primary" onClick={clear}>Clear Filters</Button>} />}
          {rows && rows.length > 0 && data && (
            <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
              <AnnouncementsTable rows={rows} selectedId={activeId} onSelect={setSelectedId} />
              <div className="border-t border-warm-200"><Pagination pagination={data.pagination} onPageChange={setPage} itemLabel="announcements" /></div>
            </div>
          )}
        </Card>
        <div className="xl:col-span-5"><AnnouncementPreview id={activeId} version={version} onChanged={changed} onEdit={(a) => setEditor({ announcement: a })} /></div>
      </div>
      <AnnouncementFormModal editor={editor} classes={classes.data?.data ?? []} onClose={() => setEditor(null)} onSaved={saved} />
    </PageContainer>
  );
}
