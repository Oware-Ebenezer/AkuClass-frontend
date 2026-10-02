import { Link } from 'react-router-dom';
import { Badge, type BadgeTone } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Icon } from '../../../components/ui/Icon';
import type { Announcement, AnnouncementCategory } from '../../../types';
import { formatDate } from '../../../utils/format';

const categoryStyle: Record<AnnouncementCategory, { label: string; icon: string; tone: BadgeTone; tile: string }> = {
  academics: { label: 'Academics', icon: 'assignment', tone: 'teal', tile: 'bg-teal-pale text-teal' },
  examination: { label: 'Examination', icon: 'history_edu', tone: 'orange', tile: 'bg-orange-pale text-orange-dark' },
  general: { label: 'General', icon: 'groups', tone: 'neutral', tile: 'bg-warm-200 text-charcoal-lighter' },
};

export function AnnouncementsList({ items }: { items: Announcement[] }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Recent Announcements</h2>
          <p className="mt-0.5 text-xs text-charcoal-muted">Circulars, assessment notices, and parent communications</p>
        </div>
        <Link to="/app/announcements" className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:text-teal-dark">
          View All Announcements<Icon name="arrow_forward" size={16} />
        </Link>
      </div>
      <ul className="space-y-2">
        {items.map((a) => {
          const c = categoryStyle[a.category];
          return (
            <li key={a.id} className="flex flex-col justify-between gap-4 rounded-lg bg-warm-100 p-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-start gap-4">
                <span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${c.tile}`}><Icon name={c.icon} /></span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1">
                    <h3 className="truncate text-sm font-bold">{a.title}</h3>
                    <Badge tone={c.tone}>{c.label}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-charcoal-muted">{a.summary}</p>
                  <p className="mt-1.5 text-[11px] text-charcoal-muted">
                    <span className="font-medium text-charcoal">{a.author}</span> • {formatDate(a.publishedAt)} • {a.audience}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 self-end sm:self-center">
                <Button variant="icon" aria-label="Download attachment"><Icon name="download" size={18} /></Button>
                <Button variant="icon" aria-label="View notice"><Icon name="visibility" size={18} /></Button>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
