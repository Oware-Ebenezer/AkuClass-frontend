import type { Gender, SchoolSection } from './student';

// PROPOSED shapes: the contract lists class endpoints but not their bodies or query params.
// `class_teacher` is shown by the approved design; the contract has no explicit class-teacher
// concept yet, so it is optional (null = not assigned).
export type ClassStatus = 'ACTIVE' | 'INACTIVE';

export interface ClassListItem {
  id: string;
  name: string;
  school_section: SchoolSection;
  level: string; // e.g. "JHS 2"
  student_count: number;
  class_teacher: { id: string; full_name: string } | null;
  academic_year: string;
  status: ClassStatus;
}

export interface ClassListParams {
  page: number;
  page_size: number;
  search?: string;
  school_section?: SchoolSection;
  status?: ClassStatus;
  academic_year_id?: string;
}

export interface ClassDetail extends ClassListItem {
  attendance_summary: { rate: number }; // cumulative for the academic year, NOT today's attendance
}

// Params for GET /classes/{id}/students: only `search` and `gender` are proposed here.
export interface ClassRosterParams { page: number; page_size: number; search?: string; gender?: Gender; }

export interface ClassSubject {
  id: string;
  subject: { id: string; name: string };
  teacher: { id: string; full_name: string; employee_number: string } | null;
}
