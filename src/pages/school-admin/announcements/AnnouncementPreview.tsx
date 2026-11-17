import { useCallback, useState } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Icon } from '../../../components/ui/Icon';
import { LoadingState } from '../../../components/ui/LoadingState';
import { useAsync } from '../../../hooks/useAsync';
import { ApiError } from '../../../services/apiClient';
import { archiveAnnouncement, getAnnouncement, publishAnnouncement } from '../../../services/announcementService';
import type { AnnouncementDetail } from '../../../types/announcement';
import { formatBytes, formatDate, formatTimeOfDay } from '../../../utils/format';
import { AnnouncementStatusBadge, AudienceBadge } from './AnnouncementBadges';

interface Props { id: string | null; version: number; onChanged: () => void; onEdit: (a: AnnouncementDetail) => void; }

export function AnnouncementPreview({ id, version, onChanged, onEdit }: Props) {
  const { data, error, loading, reload } = useAsync(useCallback((): Promise<AnnouncementDetail | null> => (id ? getAnnouncement(id) : Promise.resolve(null)), [id, version]));
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setActionError(null);
    try { await fn(); onChanged(); }
    catch (e) { setActionError(e instanceof ApiError ? e.message : 'Something went wrong. Please try again.'); }
    finally { setBusy(false); }
  };

  if (!id) return <Card><EmptyState icon="campaign" title="No announcement selected" message="Choose an announcement to preview it here." /></Card>;
  if (loading && !data) return <Card><LoadingState label="Loading announcement…" /></Card>;
  if (error) return <Card><ErrorState title="Unable to load this announcement" message={`${error.message} Please try again.`} onRetry={reload} /></Card>;
  if (!data) return null;
  const when = data.published_at ?? data.created_at;

  return (
    <Card className="space-y-4 p-0 lg:sticky lg:top-20">
      <div className="space-y-3 border-b border-warm-200 p-5">
        <div className="flex flex-wrap items-center gap-2"><AnnouncementStatusBadge status={data.status} /><AudienceBadge a={data} /></div>
        <h2 className="text-xl leading-7 font-bold">{data.title}</h2>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-charcoal-muted">
          <span className="flex items-center gap-2"><Avatar name={data.author.full_name} size={24} /><b className="text-charcoal">{data.author.full_name}</b></span>
          <span className="flex items-center gap-1"><Icon name="calendar_today" size={14} />{data.published_at ? 'Published' : 'Drafted'} {formatDate(when)} · {formatTimeOfDay(when)}</span>
        </div>
      </div>
      <div className="max-h-[360px] space-y-4 overflow-y-auto px-5">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.body}</p>
        {data.attachments.length > 0 && (
          <div className="space-y-2 border-t border-warm-200 pt-3">
            <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-charcoal-muted uppercase"><Icon name="attachment" size={16} />Attachments ({data.attachments.length})</div>
            {data.attachments.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-3 rounded-lg bg-warm-100 p-3">
                <div className="flex min-w-0 flex-col"><span className="truncate text-xs font-semibold">{f.name}</span><span className="text-[11px] text-charcoal-muted">{formatBytes(f.size_bytes)}</span></div>
                {f.download_url && <a href={f.download_url} download className="text-xs font-semibold text-teal hover:underline">Download</a>}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-warm-200 bg-warm-100/60 p-4">
        {actionError && <p role="alert" className="mr-auto text-xs text-danger">{actionError}</p>}
        {data.status === 'PUBLISHED' && <Button variant="surface" disabled={busy} onClick={() => run(() => archiveAnnouncement(data.id))}><Icon name="archive" size={18} className="text-charcoal-muted" />Archive</Button>}
        {data.status === 'DRAFT' && <Button variant="primary" disabled={busy} onClick={() => run(() => publishAnnouncement(data.id))}><Icon name="publish" size={18} />{busy ? 'Publishing…' : 'Publish'}</Button>}
        <Button variant="surface" disabled={busy} onClick={() => onEdit(data)}><Icon name="edit_note" size={18} className="text-charcoal-muted" />Edit</Button>
      </div>
    </Card>
  );
}
