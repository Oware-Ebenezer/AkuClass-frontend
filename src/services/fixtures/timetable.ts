import type { ClassTimetable, Period, TimetableEntry, TimetableEntryPayload } from '../../types/timetable';
import { ApiError } from '../apiClient';
import { queryClasses } from './classes';
import { classSubjects } from './teachers';

// Dev-only data: a generated week for every class. Clashes (a teacher in two classes at the same
// time) are detected here, as the backend would. Edits live in memory.
export const PERIODS: Period[] = [
  { id: 'devotion', label: 'Devotion', kind: 'ASSEMBLY', start: '07:30', end: '08:00' },
  { id: 'p1', label: 'Period 1', kind: 'LESSON', start: '08:00', end: '08:45' },
  { id: 'p2', label: 'Period 2', kind: 'LESSON', start: '08:45', end: '09:30' },
  { id: 'break', label: 'Break', kind: 'BREAK', start: '09:30', end: '10:00' },
  { id: 'p3', label: 'Period 3', kind: 'LESSON', start: '10:00', end: '10:45' },
  { id: 'p4', label: 'Period 4', kind: 'LESSON', start: '10:45', end: '11:30' },
  { id: 'p5', label: 'Period 5', kind: 'LESSON', start: '11:30', end: '12:15' },
  { id: 'lunch', label: 'Lunch', kind: 'BREAK', start: '12:15', end: '13:00' },
  { id: 'p6', label: 'Period 6', kind: 'LESSON', start: '13:00', end: '13:45' },
  { id: 'p7', label: 'Period 7', kind: 'LESSON', start: '13:45', end: '14:30' },
  { id: 'activity', label: 'Co-curricular', kind: 'ACTIVITY', start: '14:30', end: '15:15' },
];
const LESSONS = PERIODS.filter((p) => p.kind === 'LESSON').map((p) => p.id);
const delay = () => new Promise((r) => setTimeout(r, 200));

type Slot = Omit<TimetableEntry, 'conflict'>;
let store: Map<string, Slot[]> | null = null;

async function init() {
  if (store) return store;
  const classes = (await queryClasses({ page: 1, page_size: 100 })).data;
  const pairs = await Promise.all(classes.map((c) => classSubjects(c.id)));
  store = new Map();
  classes.forEach((c, ci) => {
    const list = pairs[ci];
    const slots: Slot[] = [];
    if (list.length) {
      for (let day = 1; day <= 5; day++) {
        LESSONS.forEach((pid, i) => {
          const p = list[((day - 1) * 3 + i * 2 + ci) % list.length];
          slots.push({ id: `tt-${c.id}-${day}-${pid}`, class_id: c.id, class_subject_id: p.id, day, period_id: pid, subject: p.subject, teacher: p.teacher ? { id: p.teacher.id, full_name: p.teacher.full_name } : null, room: null });
        });
      }
    }
    store!.set(c.id, slots);
  });
  return store;
}

async function className(id: string) { return (await queryClasses({ page: 1, page_size: 100 })).data.find((c) => c.id === id); }

function withConflict(s: Slot, all: Map<string, Slot[]>): TimetableEntry {
  let conflict: string | null = null;
  if (s.teacher) {
    for (const [cid, slots] of all) {
      if (cid === s.class_id) continue;
      const other = slots.find((o) => o.day === s.day && o.period_id === s.period_id && o.teacher?.id === s.teacher?.id);
      if (other) { conflict = `${s.teacher.full_name} is also scheduled for ${other.subject.name} in ${other.class_id.toUpperCase().replace(/-/g, ' ')} at this time.`; break; }
    }
  }
  return { ...s, conflict };
}

export async function getTimetable(classId: string): Promise<ClassTimetable> {
  await delay();
  const all = await init();
  const cls = await className(classId);
  if (!cls) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Class was not found.');
  return {
    class: { id: cls.id, name: cls.name, school_section: cls.school_section, student_count: cls.student_count },
    periods: PERIODS, entries: (all.get(classId) ?? []).map((s) => withConflict(s, all)),
  };
}

async function resolve(p: TimetableEntryPayload) {
  const [classId, subjectId, teacherId] = p.class_subject_id.split(':');
  const pair = (await classSubjects(classId)).find((x) => x.subject.id === subjectId && x.teacher?.id === teacherId);
  if (classId !== p.class_id || !pair) throw new ApiError('validation', 422, 'VALIDATION_ERROR', 'Choose one of this class’s subjects.');
  if (!(p.day >= 1 && p.day <= 5) || !LESSONS.includes(p.period_id)) throw new ApiError('validation', 422, 'VALIDATION_ERROR', 'Choose a school day and a lesson period.');
  return pair;
}

export async function addEntry(p: TimetableEntryPayload): Promise<TimetableEntry> {
  await delay();
  const all = await init();
  const pair = await resolve(p);
  const slots = all.get(p.class_id) ?? [];
  if (slots.some((s) => s.day === p.day && s.period_id === p.period_id)) throw new ApiError('conflict', 409, 'CONFLICT', 'This period already has a lesson. Edit or remove it first.');
  const slot: Slot = { id: `tt-${p.class_id}-${p.day}-${p.period_id}-${slots.length}`, class_id: p.class_id, class_subject_id: p.class_subject_id, day: p.day, period_id: p.period_id, subject: pair.subject, teacher: pair.teacher ? { id: pair.teacher.id, full_name: pair.teacher.full_name } : null, room: p.room };
  all.set(p.class_id, [...slots, slot]);
  return withConflict(slot, all);
}

export async function updateEntry(id: string, p: TimetableEntryPayload): Promise<TimetableEntry> {
  await delay();
  const all = await init();
  const pair = await resolve(p);
  const slots = all.get(p.class_id) ?? [];
  const current = slots.find((s) => s.id === id);
  if (!current) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Timetable entry was not found.');
  if (slots.some((s) => s.id !== id && s.day === p.day && s.period_id === p.period_id)) throw new ApiError('conflict', 409, 'CONFLICT', 'That period already has a lesson.');
  const updated: Slot = { ...current, class_subject_id: p.class_subject_id, day: p.day, period_id: p.period_id, subject: pair.subject, teacher: pair.teacher ? { id: pair.teacher.id, full_name: pair.teacher.full_name } : null, room: p.room };
  all.set(p.class_id, slots.map((s) => (s.id === id ? updated : s)));
  return withConflict(updated, all);
}

export async function removeEntry(id: string): Promise<void> {
  await delay();
  const all = await init();
  for (const [cid, slots] of all) if (slots.some((s) => s.id === id)) { all.set(cid, slots.filter((s) => s.id !== id)); return; }
  throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Timetable entry was not found.');
}
