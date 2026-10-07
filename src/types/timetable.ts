// PROPOSED shapes: the contract lists timetable endpoints without bodies.
// Period structure and clash detection (a teacher booked in two places) are backend-owned.
export type PeriodKind = 'LESSON' | 'BREAK' | 'ASSEMBLY' | 'ACTIVITY';

export interface Period { id: string; label: string; kind: PeriodKind; start: string; end: string; } // "HH:mm"

export interface TimetableEntry {
  id: string;
  class_id: string;
  class_subject_id: string;
  day: number; // 1 = Monday ... 5 = Friday
  period_id: string;
  subject: { id: string; name: string };
  teacher: { id: string; full_name: string } | null;
  room: string | null;
  conflict: string | null; // user-safe message when the teacher is double-booked
}

export interface ClassTimetable {
  class: { id: string; name: string; school_section: 'JHS' | 'SHS'; student_count: number };
  periods: Period[];
  entries: TimetableEntry[];
}

export interface TimetableEntryPayload { class_id: string; class_subject_id: string; day: number; period_id: string; room: string | null; }
