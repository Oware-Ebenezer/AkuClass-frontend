import type { Subject, TeacherLevel } from './teacher';

// PROPOSED shapes: the contract lists subject endpoints without bodies or query params.
export type SubjectLevel = TeacherLevel; // JHS | SHS | BOTH
export type SubjectCategory = 'CORE' | 'SCIENCE' | 'BUSINESS' | 'ARTS' | 'HOME_ECONOMICS';
export type SubjectStatus = 'ACTIVE' | 'INACTIVE';

export interface SubjectListItem extends Subject {
  code: string;
  level: SubjectLevel;
  category: SubjectCategory;
  description: string | null;
  class_count: number; // classes the subject is allocated to in the current academic year
  status: SubjectStatus;
}

export interface SubjectListParams {
  page: number;
  page_size: number;
  search?: string; // name, code or description
  level?: SubjectLevel;
  category?: SubjectCategory;
  status?: SubjectStatus;
}

export interface SubjectDetail extends SubjectListItem {
  classes: { id: string; name: string }[];
  teachers: { id: string; full_name: string; employee_number: string }[];
}

export interface CreateSubjectPayload {
  name: string;
  code: string;
  level: SubjectLevel;
  category: SubjectCategory;
  description: string | null;
}
