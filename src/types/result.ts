// PROPOSED shapes: the contract lists result endpoints without bodies or query params.
// Weights, maximums, totals and grades are decided by the backend; the UI only displays them.
export type ResultEntryFilter = 'ENTERED' | 'PENDING';

export interface ResultContext { academic_year_id: string; term_id: string; class_id: string; subject_id: string; }
export interface ResultListParams extends ResultContext { page: number; page_size: number; search?: string; entry?: ResultEntryFilter; }

export interface ResultRow {
  student_id: string;
  student_number: string;
  full_name: string;
  photo_url: string | null;
  result_id: string | null; // null = nothing entered yet
  continuous_score: number | null;
  continuous_max: number;
  exam_score: number | null;
  exam_max: number;
  total: number | null;
  total_max: number;
  grade: string | null;
  grade_label: string | null;
  remark: string | null; // teacher's remark
}

export interface ResultsSummary {
  expected: number;
  entered: number;
  average: number | null;
  highest: number | null;
  lowest: number | null;
  total_max: number;
  distribution: { grade: string; count: number }[];
}

export interface SaveResultPayload { continuous_score: number; exam_score: number; remark: string | null; }
