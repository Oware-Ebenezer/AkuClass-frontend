import type { AccountStatus } from './index';

// Field names below are PROPOSED (snake_case like the contract's pagination object).
// The contract does not yet define student response bodies: confirm against /openapi.json.
export type SchoolSection = 'JHS' | 'SHS';
export type Gender = 'FEMALE' | 'MALE';

export interface Student {
  id: string;
  student_number: string;
  full_name: string;
  email: string;
  photo_url: string | null;
  school_section: SchoolSection;
  class_id: string;
  class_name: string;
  gender: Gender;
  attendance_rate: number; // cumulative, NOT today's attendance
  status: AccountStatus;
}

export interface StudentListParams {
  page: number;
  page_size: number;
  search?: string;
  school_section?: SchoolSection;
  class_id?: string;
  status?: AccountStatus;
  academic_year_id?: string;
}

export interface StudentSummary {
  total: number;
  jhs: number;
  shs: number;
  enrolled_this_term: number;
  average_attendance: number;
  attendance_change: number;
}

export interface SchoolClass { id: string; name: string; school_section: SchoolSection; }

export interface StudentResult { id: string; subject: string; score: number; grade: string; remark: string; term: string; }

export interface EnrollmentRecord {
  id: string;
  academic_year: string;
  class_name: string;
  school_section: SchoolSection;
  class_teacher: string;
  period: string;
  is_current: boolean;
}

export interface StudentDetail extends Student {
  date_of_birth: string;
  admission_date: string;
  academic_year: string;
  student_contact: { phone: string; email: string };
  guardian: { name: string; relationship: string; phone: string; email: string; address: string };
  attendance_summary: { rate: number; target_percent: number; present: number; absent: number; late: number; excused: number };
  recent_results: StudentResult[];
  enrollment_history: EnrollmentRecord[];
}
