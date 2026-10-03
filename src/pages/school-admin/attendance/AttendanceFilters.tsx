import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/ui/Icon';
import { Input } from '../../../components/ui/Input';
import { Select, type SelectOption } from '../../../components/ui/Select';
import { ATTENDANCE_BAR, ATTENDANCE_LABEL, ATTENDANCE_ORDER } from '../../../constants/attendance';
import type { AttendanceStatus } from '../../../types';
import type { AttendanceSession } from '../../../types/attendance';
import { formatClock, shiftDate, todayIso } from '../../../utils/format';

interface Props {
  classOptions: SelectOption[];
  classId: string;
  date: string;
  session: AttendanceSession | null;
  search: string;
  status: AttendanceStatus | '';
  onClass: (id: string) => void;
  onDate: (date: string) => void;
  onSearch: (value: string) => void;
  onStatus: (status: AttendanceStatus | '') => void;
}

const navBtn = 'flex size-10 shrink-0 items-center justify-center rounded-lg bg-warm-100 text-charcoal-lighter transition-colors hover:bg-warm-200 disabled:opacity-40';

export function AttendanceFilters({ classOptions, classId, date, session, search, status, onClass, onDate, onSearch, onStatus }: Props) {
  const today = todayIso();
  const chip = (active: boolean) => `inline-flex h-8 items-center gap-1 rounded-full px-3 text-[11px] font-bold whitespace-nowrap transition-colors ${active ? 'bg-teal text-white' : 'bg-warm-100 text-charcoal-lighter hover:bg-warm-200'}`;
  const s = session?.summary;
  const counts: Record<AttendanceStatus, number | undefined> = { PRESENT: s?.present, ABSENT: s?.absent, LATE: s?.late, EXCUSED: s?.excused };

  return (
    <Card className="space-y-4 p-4">
      <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-12">
        <Select filled label="Class" className="lg:col-span-4" options={classOptions} value={classId} onChange={(e) => onClass(e.target.value)} />
        <div className="lg:col-span-5">
          <label htmlFor="roll-date" className="mb-1 block text-xs font-semibold text-charcoal-lighter">Roll Call Date</label>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Previous day" className={navBtn} onClick={() => onDate(shiftDate(date, -1))}><Icon name="chevron_left" /></button>
            <input id="roll-date" type="date" value={date} max={today} onChange={(e) => e.target.value && onDate(e.target.value)}
              className="h-10 min-w-0 flex-1 rounded-lg bg-warm-100 px-3 text-sm focus:bg-white focus:outline-2 focus:outline-teal" />
            <button type="button" aria-label="Next day" className={navBtn} disabled={date >= today} onClick={() => onDate(shiftDate(date, 1))}><Icon name="chevron_right" /></button>
            <button type="button" className="h-10 shrink-0 rounded-lg bg-warm-100 px-3 text-xs font-semibold hover:bg-warm-200" onClick={() => onDate(today)}>Today</button>
          </div>
        </div>
        <div className="lg:col-span-3">
          {session && (
            <div className="flex h-10 items-center gap-2 rounded-lg bg-teal-pale px-3">
              <Icon name="verified" size={18} className="text-teal" />
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-[11px] font-bold text-teal-dark">{session.label} · {formatClock(session.submitted_at.slice(11, 16))}</span>
                {session.recorded_by && <span className="truncate text-xs text-charcoal-lighter">{session.recorded_by.full_name}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <Input filled icon="search" aria-label="Search students" className="max-w-lg flex-1" placeholder="Search student by name or ID..." value={search} onChange={(e) => onSearch(e.target.value)} />
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          <button type="button" className={chip(status === '')} onClick={() => onStatus('')}>All Statuses{s ? ` (${s.enrolled})` : ''}</button>
          {ATTENDANCE_ORDER.map((st) => (
            <button key={st} type="button" className={chip(status === st)} onClick={() => onStatus(st)}>
              <span className={`size-1.5 rounded-full ${status === st ? 'bg-white' : ATTENDANCE_BAR[st]}`} />
              {ATTENDANCE_LABEL[st]}{counts[st] !== undefined ? ` (${counts[st]})` : ''}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
