import type { PaginatedResponse } from '../types/api';
import type { ClassDetail, ClassListItem, ClassListParams, ClassRosterParams, ClassSubject } from '../types/class';
import type { SchoolClass, Student } from '../types/student';
import { toQuery } from '../utils/query';
import { USE_FIXTURES, apiGet, apiGetPage } from './apiClient';
import { listStudents } from './studentService';

export async function listClasses(params: ClassListParams): Promise<PaginatedResponse<ClassListItem>> {
  if (USE_FIXTURES) return (await import('./fixtures/classes')).queryClasses(params);
  return apiGetPage<ClassListItem>(`/classes${toQuery(params)}`);
}

// Classes are academic-year aware (contract §16).
export async function getClassOptions(academicYearId: string): Promise<SchoolClass[]> {
  if (USE_FIXTURES) return (await import('./fixtures/students')).classesFixture;
  return (await apiGetPage<SchoolClass>(`/classes?page_size=100&academic_year_id=${encodeURIComponent(academicYearId)}`)).data;
}

export interface ClassCounts { total: number; jhs: number; shs: number; students: number; }

// Built only from contract endpoints: each figure is the `pagination.total` of a one-row page.
export async function getClassCounts(academicYearId: string): Promise<ClassCounts> {
  const base = { page: 1, page_size: 1, academic_year_id: academicYearId };
  const [total, jhs, shs, students] = await Promise.all([
    listClasses(base), listClasses({ ...base, school_section: 'JHS' }), listClasses({ ...base, school_section: 'SHS' }), listStudents(base),
  ]);
  return { total: total.pagination.total, jhs: jhs.pagination.total, shs: shs.pagination.total, students: students.pagination.total };
}

export async function getClass(classId: string): Promise<ClassDetail> {
  if (USE_FIXTURES) return (await import('./fixtures/classes')).classDetail(classId);
  return apiGet<ClassDetail>(`/classes/${encodeURIComponent(classId)}`);
}

export async function listClassStudents(classId: string, params: ClassRosterParams): Promise<PaginatedResponse<Student>> {
  if (USE_FIXTURES) return (await import('./fixtures/classes')).queryRoster(classId, params);
  return apiGetPage<Student>(`/classes/${encodeURIComponent(classId)}/students${toQuery(params)}`);
}

export async function getClassSubjects(classId: string): Promise<ClassSubject[]> {
  if (USE_FIXTURES) return (await import('./fixtures/teachers')).classSubjects(classId);
  return (await apiGetPage<ClassSubject>(`/classes/${encodeURIComponent(classId)}/subjects?page_size=100`)).data;
}
