import type { PaginatedResponse } from '../types/api';
import type { ResultContext, ResultListParams, ResultRow, ResultsSummary, SaveResultPayload } from '../types/result';
import { toQuery } from '../utils/query';
import { USE_FIXTURES, apiGet, apiGetPage, apiPatch, apiPost } from './apiClient';

const fx = () => import('./fixtures/results');

export async function listResults(params: ResultListParams): Promise<PaginatedResponse<ResultRow>> {
  if (USE_FIXTURES) return (await fx()).queryResults(params);
  return apiGetPage<ResultRow>(`/results${toQuery(params)}`);
}

// NOT IN THE CONTRACT: class averages and the grade spread cannot be built from list counts.
// Placeholder path until the backend decides; the screen still works if it fails.
export async function getResultsSummary(ctx: ResultContext): Promise<ResultsSummary> {
  if (USE_FIXTURES) return (await fx()).resultsSummary(ctx);
  return apiGet<ResultsSummary>(`/results/summary${toQuery(ctx)}`);
}

// Existing result -> PATCH /results/{id}; first entry -> POST /results.
export async function saveResult(ctx: ResultContext, studentId: string, resultId: string | null, payload: SaveResultPayload): Promise<ResultRow> {
  if (USE_FIXTURES) return (await fx()).saveResult(ctx, studentId, payload);
  if (resultId) return apiPatch<ResultRow>(`/results/${encodeURIComponent(resultId)}`, payload);
  return apiPost<ResultRow>('/results', { ...ctx, student_id: studentId, ...payload });
}
