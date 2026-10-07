import type { PaginatedResponse } from '../types/api';
import type { Teacher, TeacherDetail, TeacherListParams } from '../types/teacher';
import { toQuery } from '../utils/query';
import { USE_FIXTURES, apiGet, apiGetPage } from './apiClient';

export async function listTeachers(params: TeacherListParams): Promise<PaginatedResponse<Teacher>> {
  if (USE_FIXTURES) return (await import('./fixtures/teachers')).queryTeachers(params);
  return apiGetPage<Teacher>(`/teachers${toQuery(params)}`);
}

export interface TeacherCounts { total: number; jhs: number; shs: number; both: number; active: number; inactive: number; suspended: number; }

// Built only from contract endpoints: each figure is the `pagination.total` of a one-row page.
// Interim approach until the backend offers a summary.
export async function getTeacherCounts(academicYearId: string): Promise<TeacherCounts> {
  const base = { page: 1, page_size: 1, academic_year_id: academicYearId };
  const count = async (extra: Partial<TeacherListParams>) => (await listTeachers({ ...base, ...extra })).pagination.total;
  const [total, jhs, shs, both, active, inactive, suspended] = await Promise.all([
    count({}), count({ level: 'JHS' }), count({ level: 'SHS' }), count({ level: 'BOTH' }),
    count({ status: 'ACTIVE' }), count({ status: 'INACTIVE' }), count({ status: 'SUSPENDED' }),
  ]);
  return { total, jhs, shs, both, active, inactive, suspended };
}

export async function getTeacher(teacherId: string): Promise<TeacherDetail> {
  if (USE_FIXTURES) return (await import('./fixtures/teachers')).teacherDetail(teacherId);
  return apiGet<TeacherDetail>(`/teachers/${encodeURIComponent(teacherId)}`);
}
