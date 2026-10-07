import type { AccountStatus } from './index';
import type { SchoolSection } from './student';

// PROPOSED shapes: the contract lists teacher endpoints and says assignments will come later,
// but defines no bodies or query params. `level`, `subjects` and `classes` are assumed to be
// derived by the backend from teacher assignments (class-subjects).
export type TeacherLevel = 'JHS' | 'SHS' | 'BOTH';

export interface TeacherClassRef { id: string; name: string; is_class_teacher: boolean; }

export interface Teacher {
  id: string;
  employee_number: string;
  full_name: string;
  email: string;
  phone: string;
  photo_url: string | null;
  level: TeacherLevel;
  subjects: string[];
  classes: TeacherClassRef[];
  status: AccountStatus;
}

export interface TeacherListParams {
  page: number;
  page_size: number;
  search?: string;
  level?: TeacherLevel;
  subject_id?: string;
  status?: AccountStatus;
  academic_year_id?: string;
}

export interface Subject { id: string; name: string; }

// PROPOSED: `GET /teachers/{id}` is assumed to embed class and assignment detail.
export interface TeacherClassDetail extends TeacherClassRef { school_section: SchoolSection; student_count: number; }

export interface TeacherAssignment {
  id: string;
  subject: { id: string; name: string };
  class: { id: string; name: string };
  is_class_teacher: boolean;
  academic_year: string;
}

export interface TeacherDetail extends Omit<Teacher, 'classes'> {
  classes: TeacherClassDetail[];
  assignments: TeacherAssignment[];
  academic_year: string;
}
