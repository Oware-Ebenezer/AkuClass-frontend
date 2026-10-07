// PROPOSED shapes: the contract lists assignment endpoints without bodies or query params.
export type AssignmentStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';
export type AssignmentCategory = 'HOMEWORK' | 'CLASSWORK' | 'PROJECT' | 'CLASS_TEST' | 'PRACTICAL';
export type SubmissionStatus = 'SUBMITTED' | 'LATE' | 'NOT_SUBMITTED';
export type DueFilter = 'THIS_WEEK' | 'NEXT_WEEK' | 'PAST_DUE';
export type GradingFilter = 'GRADED' | 'AWAITING';

export interface AssignmentListItem {
  id: string;
  title: string;
  category: AssignmentCategory;
  status: AssignmentStatus;
  subject: { id: string; name: string; code: string };
  class: { id: string; name: string };
  teacher: { id: string; full_name: string } | null;
  published_at: string | null;
  due_at: string;
  max_score: number;
  expected_count: number; // learners on the class roll
  received_count: number; // submitted on time or late
}

export interface AssignmentListParams {
  page: number;
  page_size: number;
  search?: string; // title, subject or class
  class_id?: string;
  subject_id?: string;
  status?: AssignmentStatus;
  due?: DueFilter;
}

export interface AssignmentAttachment { id: string; name: string; size_bytes: number; content_type: string; download_url: string | null; }

export interface AssignmentSummary {
  expected: number;
  received: number;
  on_time: number;
  late: number;
  not_submitted: number;
  graded: number;
  awaiting_review: number;
  average_score: number | null;
}

export interface AssignmentDetail extends Omit<AssignmentListItem, 'teacher'> {
  teacher: { id: string; full_name: string; employee_number: string } | null;
  instructions: string | null;
  term: string;
  academic_year: string;
  attachments: AssignmentAttachment[];
  summary: AssignmentSummary;
}

export interface SubmissionRow {
  id: string;
  student_id: string;
  student_number: string;
  full_name: string;
  photo_url: string | null;
  status: SubmissionStatus;
  submitted_at: string | null;
  score: number | null;
  grade: string | null;
  remark: string | null;
  feedback: string | null;
  graded: boolean;
}

export interface SubmissionListParams { page: number; page_size: number; search?: string; status?: SubmissionStatus; grading?: GradingFilter; }
export interface GradePayload { score: number; feedback: string | null; }
export interface CreateAssignmentPayload {
  title: string;
  class_subject_id: string;
  category: AssignmentCategory;
  max_score: number;
  instructions: string | null;
  due_at: string; // ISO-8601
}
