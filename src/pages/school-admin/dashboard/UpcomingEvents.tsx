import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/ui/Icon';
import type { SchoolEvent } from '../../../types';
import { formatDate, formatTime } from '../../../utils/format';

const tiles = ['bg-teal', 'bg-orange-dark', 'bg-teal-light', 'bg-charcoal-lighter'];

export function UpcomingEvents({ items }: { items: SchoolEvent[] }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1 text-xl font-bold"><Icon name="event_upcoming" className="text-teal" />Upcoming Events</h2>
        <Link to="/app/timetable" className="text-xs font-semibold text-teal hover:text-teal-dark">Calendar →</Link>
      </div>
      <ul className="space-y-2">
        {items.map((e, i) => (
          <li key={e.id} className="flex items-center gap-4 rounded-lg bg-warm-100 p-2">
            <div className={`flex size-12 shrink-0 flex-col items-center justify-center rounded-lg leading-none text-white ${tiles[i % tiles.length]}`}>
              <span className="text-[11px] font-bold uppercase">{formatDate(e.startsAt, { month: 'short' })}</span>
              <span className="mt-0.5 text-lg font-bold">{formatDate(e.startsAt, { day: '2-digit' })}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xs font-bold">{e.title}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-charcoal-muted">
                <Icon name="schedule" size={14} />{formatTime(e.startsAt)} · {e.location}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
