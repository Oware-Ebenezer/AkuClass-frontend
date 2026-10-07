import { Icon } from '../../../components/ui/Icon';
import { DAYS } from '../../../constants/timetable';
import type { ClassTimetable, TimetableEntry } from '../../../types/timetable';

interface Props { data: ClassTimetable; onEdit: (entry: TimetableEntry) => void; onAdd: (day: number, periodId: string) => void; }

export function TimetableMatrix({ data, onEdit, onAdd }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] border-collapse text-left">
        <thead>
          <tr className="bg-warm-100">
            <th scope="col" className="sticky left-0 z-10 w-32 bg-warm-100 px-3 py-3 text-[11px] font-bold tracking-wider text-charcoal-lighter uppercase">Day</th>
            {data.periods.map((p) => (
              <th key={p.id} scope="col" className={`px-2 py-3 text-center ${p.kind === 'LESSON' ? 'min-w-[130px]' : 'w-24 bg-warm-200/60'}`}>
                <div className="text-[11px] font-bold tracking-wider text-charcoal uppercase">{p.label}</div>
                <div className="text-[11px] font-normal text-charcoal-muted">{p.start} – {p.end}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYS.map((d) => (
            <tr key={d.value} className="border-b border-warm-200 align-top">
              <th scope="row" className="sticky left-0 z-10 bg-white px-3 py-3 text-left">
                <div className="text-sm font-bold text-teal">{d.label}</div>
                <div className="text-[11px] font-normal text-charcoal-muted">{data.entries.filter((e) => e.day === d.value).length} lessons</div>
              </th>
              {data.periods.map((p) => {
                if (p.kind !== 'LESSON') return <td key={p.id} className="bg-warm-100/60 px-1 py-2 text-center text-[11px] text-charcoal-muted">{p.kind === 'BREAK' ? p.label : ''}</td>;
                const entry = data.entries.find((e) => e.day === d.value && e.period_id === p.id);
                return (
                  <td key={p.id} className="p-1.5">
                    {entry ? (
                      <button type="button" onClick={() => onEdit(entry)} title={entry.conflict ?? undefined}
                        className={`flex min-h-[84px] w-full flex-col justify-between gap-1 rounded-lg p-2.5 text-left shadow-sm transition-colors ${entry.conflict ? 'bg-danger-pale hover:bg-danger-pale/70' : 'bg-white hover:bg-warm-100'}`}>
                        <span className="flex items-start justify-between gap-1">
                          <span className="text-sm font-bold">{entry.subject.name}</span>
                          {entry.conflict && <Icon name="warning" size={16} className="shrink-0 text-danger" />}
                        </span>
                        <span className="flex flex-col text-[11px] text-charcoal-muted">
                          <span className="truncate">{entry.teacher?.full_name ?? 'No teacher'}</span>
                          {entry.room && <span>{entry.room}</span>}
                          {entry.conflict && <span className="font-semibold text-danger">Teacher clash</span>}
                        </span>
                      </button>
                    ) : (
                      <button type="button" onClick={() => onAdd(d.value, p.id)} aria-label={`Add a lesson on ${d.label}, ${p.label}`}
                        className="flex min-h-[84px] w-full items-center justify-center rounded-lg border border-dashed border-warm-300 text-charcoal-muted transition-colors hover:border-teal hover:text-teal">
                        <Icon name="add" size={18} />
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
