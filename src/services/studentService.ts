import type { PaginatedResponse } from '../types/api';
import type { Student, StudentDetail, StudentListParams, StudentSummary } from '../types/student';
import { toQuery } from '../utils/query';
import { USE_FIXTURES, apiGet, apiGetPage } from './apiClient';

export async function listStudents(params: StudentListParams): Promise<PaginatedResponse<Student>> {
  if (USE_FIXTURES) return (await import('./fixtures/students')).queryStudents(params);
  return apiGetPage<Student>(`/students${toQuery(params)}`);
}

export async function getStudent(studentId: string): Promise<StudentDetail> {
  if (USE_FIXTURES) return (await import('./fixtures/students')).studentDetail(studentId);
  return apiGet<StudentDetail>(`/students/${encodeURIComponent(studentId)}`);
}

// NOT IN THE CONTRACT: the directory's summary band needs school-wide totals that
// GET /students cannot supply. This path is a placeholder until the backend decides.
export async function getStudentSummary(): Promise<StudentSummary> {
  if (USE_FIXTURES) return (await import('./fixtures/students')).studentSummary();
  return apiGet<StudentSummary>('/students/summary');
}
