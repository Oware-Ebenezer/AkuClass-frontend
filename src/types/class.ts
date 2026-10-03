import type { SchoolSection } from './student';

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
