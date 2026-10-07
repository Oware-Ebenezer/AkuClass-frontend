import type { PaginatedResponse } from '../types/api';
import type { CreateSubjectPayload, SubjectDetail, SubjectListItem, SubjectListParams } from '../types/subject';
import { USE_FIXTURES, apiGet, apiGetPage, apiPost } from './apiClient';

export interface SubjectCounts { total: number; jhs: number; shs: number; both: number; active: number; inactive: number; }

export async function listSubjectItems(params: SubjectListParams): Promise<PaginatedResponse<SubjectListItem>> {
  if (USE_FIXTURES) return (await import('./fixtures/subjects')).querySubjects(params);
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') query.set(key, String(value)); });
  return apiGetPage<SubjectListItem>(`/subjects?${query.toString()}`);
}

export async function getSubject(subjectId: string): Promise<SubjectDetail> {
  if (USE_FIXTURES) return (await import('./fixtures/subjects')).subjectDetail(subjectId);
  return apiGet<SubjectDetail>(`/subjects/${encodeURIComponent(subjectId)}`);
}

export async function createSubject(payload: CreateSubjectPayload): Promise<SubjectListItem> {
  if (USE_FIXTURES) return (await import('./fixtures/subjects')).addSubject(payload);
  return apiPost<SubjectListItem>('/subjects', payload);
}

export async function getSubjectCounts(): Promise<SubjectCounts> {
  const result = await listSubjectItems({ page: 1, page_size: 100 });
  const rows = result.data;
  return {
    total: result.pagination.total,
    jhs: rows.filter((subject) => subject.level === 'JHS').length,
    shs: rows.filter((subject) => subject.level === 'SHS').length,
    both: rows.filter((subject) => subject.level === 'BOTH').length,
    active: rows.filter((subject) => subject.status === 'ACTIVE').length,
    inactive: rows.filter((subject) => subject.status === 'INACTIVE').length,
  };
}

export async function listSubjects() {
  return (await listSubjectItems({ page: 1, page_size: 100 })).data;
}
