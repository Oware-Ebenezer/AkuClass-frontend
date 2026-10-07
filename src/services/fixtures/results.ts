import type { PaginatedResponse } from '../../types/api';
import type { ResultContext, ResultListParams, ResultRow, ResultsSummary, SaveResultPayload } from '../../types/result';
import { ApiError } from '../apiClient';
import { studentsFixture } from './students';

// Dev-only data. Maximums, totals and grades come from the "backend" (this file), never the UI.
const MAX_C = 50;
const MAX_E = 50;
const MAX_T = 100;
const overrides = new Map<string, SaveResultPayload>();
const delay = () => new Promise((r) => setTimeout(r, 200));
const key = (c: ResultContext, sid: string) => [c.academic_year_id, c.term_id, c.class_id, c.subject_id, sid].join('|');
const gradeFor = (pct: number): [string, string] => (pct >= 86 ? ['A', 'Excellent'] : pct >= 80 ? ['A', 'Very Good'] : pct >= 75 ? ['B+', 'Good'] : ['B', 'Satisfactory']);
const REMARK: Record<string, string> = { A: 'Outstanding performance this term.', 'B+': 'Good work; keep building consistency.', B: 'Satisfactory; more practice is recommended.' };

function rowsFor(c: ResultContext): ResultRow[] {
  const seed = [...(c.subject_id + c.term_id)].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 50;
  return studentsFixture.filter((s) => s.class_id === c.class_id && s.status === 'ACTIVE')
    .sort((a, b) => a.full_name.localeCompare(b.full_name))
    .map((s): ResultRow => {
      const num = Number(s.student_number.slice(-5));
      const k = key(c, s.id);
      const ov = overrides.get(k);
      const base = { student_id: s.id, student_number: s.student_number, full_name: s.full_name, photo_url: s.photo_url, continuous_max: MAX_C, exam_max: MAX_E, total_max: MAX_T };
      if (!ov && (num * 7 + seed) % 100 < 10) return { ...base, result_id: null, continuous_score: null, exam_score: null, total: null, grade: null, grade_label: null, remark: null };
      const cs = ov ? ov.continuous_score : Math.min(MAX_C, Math.round(MAX_C * (0.5 + ((num * 3 + seed) % 45) / 100)));
      const es = ov ? ov.exam_score : Math.min(MAX_E, Math.round(MAX_E * (0.45 + ((num * 5 + seed) % 50) / 100)));
      const total = cs + es;
      const [grade, grade_label] = gradeFor((total / MAX_T) * 100);
      return { ...base, result_id: k, continuous_score: cs, exam_score: es, total, grade, grade_label, remark: ov ? ov.remark : REMARK[grade] };
    });
}

export async function queryResults(p: ResultListParams): Promise<PaginatedResponse<ResultRow>> {
  await delay();
  const q = p.search?.trim().toLowerCase();
  const rows = rowsFor(p).filter((r) => (!q || r.full_name.toLowerCase().includes(q) || r.student_number.toLowerCase().includes(q)) &&
    (!p.entry || (p.entry === 'ENTERED' ? r.result_id !== null : r.result_id === null)));
  return {
    success: true, data: rows.slice((p.page - 1) * p.page_size, p.page * p.page_size),
    pagination: { page: p.page, page_size: p.page_size, total: rows.length, total_pages: Math.max(1, Math.ceil(rows.length / p.page_size)) },
  };
}

export async function resultsSummary(c: ResultContext): Promise<ResultsSummary> {
  await delay();
  const rows = rowsFor(c);
  const entered = rows.filter((r) => r.total !== null);
  const totals = entered.map((r) => r.total as number);
  const counts = new Map<string, number>();
  entered.forEach((r) => counts.set(r.grade as string, (counts.get(r.grade as string) ?? 0) + 1));
  return {
    expected: rows.length, entered: entered.length, total_max: MAX_T,
    average: totals.length ? Math.round((totals.reduce((a, b) => a + b, 0) / totals.length) * 10) / 10 : null,
    highest: totals.length ? Math.max(...totals) : null, lowest: totals.length ? Math.min(...totals) : null,
    distribution: ['A', 'B+', 'B'].filter((g) => counts.has(g)).map((g) => ({ grade: g, count: counts.get(g) as number })),
  };
}

export async function saveResult(c: ResultContext, studentId: string, p: SaveResultPayload): Promise<ResultRow> {
  await delay();
  if (!(p.continuous_score >= 0 && p.continuous_score <= MAX_C)) throw new ApiError('validation', 422, 'VALIDATION_ERROR', `Class assessment must be between 0 and ${MAX_C}.`);
  if (!(p.exam_score >= 0 && p.exam_score <= MAX_E)) throw new ApiError('validation', 422, 'VALIDATION_ERROR', `Terminal exam must be between 0 and ${MAX_E}.`);
  overrides.set(key(c, studentId), p);
  const row = rowsFor(c).find((r) => r.student_id === studentId);
  if (!row) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Student was not found.');
  return row;
}
