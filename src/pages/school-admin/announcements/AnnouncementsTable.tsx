import { Table, type Column } from '../../../components/ui/Table';
import type { AnnouncementListItem } from '../../../types/announcement';
import { formatDate } from '../../../utils/format';
import { AnnouncementStatusBadge, AudienceBadge } from './AnnouncementBadges';

interface Props { rows: AnnouncementListItem[]; selectedId: string | null; onSelect: (id: string) => void; }

export function AnnouncementsTable({ rows, selectedId, onSelect }: Props) {
  const columns: Column<AnnouncementListItem>[] = [
    { key: 'title', header: 'Announcement', render: (a) => (
      <div className="flex max-w-sm flex-col items-start gap-1"><span className="font-semibold">{a.title}</span><AudienceBadge a={a} /></div>
    ) },
    { key: 'author', header: 'Author & Date', className: 'whitespace-nowrap', render: (a) => (
      <div className="flex flex-col"><span className="text-xs font-medium">{a.author.full_name}</span><span className="text-[11px] text-charcoal-muted">{a.published_at ? formatDate(a.published_at) : `Drafted ${formatDate(a.created_at)}`}</span></div>
    ) },
    { key: 'status', header: 'Status', className: 'whitespace-nowrap', render: (a) => <AnnouncementStatusBadge status={a.status} /> },
    { key: 'actions', header: 'Actions', className: 'text-right whitespace-nowrap', render: (a) => (
      <button type="button" aria-label={`View ${a.title}`} onClick={() => onSelect(a.id)}
        className="rounded-md bg-teal-pale px-3 py-1 text-[11px] font-bold text-teal-dark transition-colors hover:bg-teal hover:text-white">View</button>
    ) },
  ];
  return <Table columns={columns} rows={rows} getRowKey={(a) => a.id} rowClassName={(a) => (a.id === selectedId ? 'bg-teal-pale/50' : '')} />;
}
