import type { Subject } from '../types/teacher';
import { USE_FIXTURES, apiGetPage } from './apiClient';

export async function listSubjects(): Promise<Subject[]> {
  if (USE_FIXTURES) return (await import('./fixtures/teachers')).subjectsFixture;
  return (await apiGetPage<Subject>('/subjects?page_size=100')).data;
}
