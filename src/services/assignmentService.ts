import type { PaginatedResponse } from '../types/api';
import type {
  AssignmentDetail, AssignmentListItem, AssignmentListParams, CreateAssignmentPayload, GradePayload, SubmissionListParams, SubmissionRow,
} from '../types/assignment';
import { toQuery } from '../utils/query';
import { USE_FIXTURES, apiGet, apiGetPage, apiPatch, apiPost } from './apiClient';

const fx = () => import('./fixtures/assignments');

export async function listAssignments(params: AssignmentListParams): Promise<PaginatedResponse<AssignmentListItem>> {
  if (USE_FIXTURES) return (await fx()).queryAssignments(params);
  return apiGetPage<AssignmentListItem>(`/assignments${toQuery(params)}`);
}

export async function getAssignment(id: string): Promise<AssignmentDetail> {
  if (USE_FIXTURES) return (await fx()).assignmentDetail(id);
  return apiGet<AssignmentDetail>(`/assignments/${encodeURIComponent(id)}`);
}

export async function listSubmissions(assignmentId: string, params: SubmissionListParams): Promise<PaginatedResponse<SubmissionRow>> {
  if (USE_FIXTURES) return (await fx()).querySubmissions(assignmentId, params);
  return apiGetPage<SubmissionRow>(`/assignments/${encodeURIComponent(assignmentId)}/submissions${toQuery(params)}`);
}

// Grading uses PATCH /submissions/{id}: confirm with the backend that it accepts a teacher's grade.
export async function gradeSubmission(submissionId: string, payload: GradePayload): Promise<SubmissionRow> {
  if (USE_FIXTURES) return (await fx()).gradeSubmission(submissionId, payload);
  return apiPatch<SubmissionRow>(`/submissions/${encodeURIComponent(submissionId)}`, payload);
}

export async function createAssignment(payload: CreateAssignmentPayload): Promise<AssignmentListItem> {
  if (USE_FIXTURES) return (await fx()).addAssignment(payload);
  return apiPost<AssignmentListItem>('/assignments', payload);
}

export async function publishAssignment(id: string): Promise<void> {
  if (USE_FIXTURES) return (await fx()).setStatus(id, 'PUBLISHED');
  await apiPost<unknown>(`/assignments/${encodeURIComponent(id)}/publish`, {});
}

export async function closeAssignment(id: string): Promise<void> {
  if (USE_FIXTURES) return (await fx()).setStatus(id, 'CLOSED');
  await apiPost<unknown>(`/assignments/${encodeURIComponent(id)}/close`, {});
}

export interface AssignmentCounts { total: number; published: number; draft: number; closed: number; dueThisWeek: number; }

// Built only from contract endpoints: each figure is the `pagination.total` of a one-row page.
export async function getAssignmentCounts(): Promise<AssignmentCounts> {
  const count = async (extra: Partial<AssignmentListParams>) => (await listAssignments({ page: 1, page_size: 1, ...extra })).pagination.total;
  const [total, published, draft, closed, dueThisWeek] = await Promise.all([
    count({}), count({ status: 'PUBLISHED' }), count({ status: 'DRAFT' }), count({ status: 'CLOSED' }), count({ status: 'PUBLISHED', due: 'THIS_WEEK' }),
  ]);
  return { total, published, draft, closed, dueThisWeek };
}
