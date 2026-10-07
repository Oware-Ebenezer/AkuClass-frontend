import type { PaginatedResponse } from '../../types/api';
import type {
  AssignmentCategory, AssignmentDetail, AssignmentListItem, AssignmentListParams, AssignmentStatus, CreateAssignmentPayload,
  GradePayload, SubmissionListParams, SubmissionRow,
} from '../../types/assignment';
import { ApiError } from '../apiClient';
import { queryClasses } from './classes';
import { studentsFixture } from './students';
import { querySubjects } from './subjects';
import { classSubjects } from './teachers';

// Dev-only data: 34 assignments built from the class/teacher/subject fixtures, with generated
// submissions. Grading and publish/close changes live in memory.
const CATS: AssignmentCategory[] = ['HOMEWORK', 'CLASSWORK', 'PROJECT', 'CLASS_TEST', 'PRACTICAL'];
const CAT_NAME: Record<AssignmentCategory, string> = { HOMEWORK: 'Homework', CLASSWORK: 'Classwork', PROJECT: 'Project', CLASS_TEST: 'Class Test', PRACTICAL: 'Practical' };
const SCORES = [30, 50, 100];
const DAY = 86_400_000;

interface Base { item: AssignmentListItem; n: number; receivedBase: number; }
const extra: Base[] = [];
const statusOverride = new Map<string, AssignmentStatus>();
const publishedOverride = new Map<string, string>();
const gradeOverride = new Map<string, { score: number; feedback: string | null }>();
const delay = () => new Promise((r) => setTimeout(r, 200));
const dayAt = (off: number, h: number, m = 0) => { const d = new Date(); d.setDate(d.getDate() + off); d.setHours(h, m, 0, 0); return d.toISOString(); };
const roster = (classId: string) => studentsFixture.filter((s) => s.class_id === classId && s.status === 'ACTIVE');
const gradeFor = (pct: number): [string, string] => (pct >= 86 ? ['A', 'Excellent'] : pct >= 80 ? ['A', 'Very Good'] : pct >= 75 ? ['B+', 'Good'] : ['B', 'Satisfactory']);

let cache: Base[] | null = null;
async function load(): Promise<Base[]> {
  if (!cache) {
    const classes = (await queryClasses({ page: 1, page_size: 100 })).data;
    const subjects = (await querySubjects({ page: 1, page_size: 100 })).data;
    const pairs = await Promise.all(classes.map((c) => classSubjects(c.id)));
    const out: Base[] = [];
    for (let round = 0; out.length < 34 && round < 4; round++) {
      classes.forEach((c, ci) => {
        const p = pairs[ci][round % Math.max(pairs[ci].length, 1)];
        if (!p || out.length >= 34) return;
        const n = out.length + 1;
        const status: AssignmentStatus = n % 12 === 0 ? 'DRAFT' : n % 17 === 5 ? 'CLOSED' : 'PUBLISHED';
        const due = status === 'CLOSED' ? dayAt(-(2 + (n % 5)), 23, 59) : status === 'DRAFT' ? dayAt(7 + (n % 7), 23, 59) : dayAt(n % 10, n % 2 ? 23 : 16, n % 2 ? 59 : 0);
        const total = roster(c.id).length;
        out.push({
          n, receivedBase: status === 'DRAFT' ? 0 : status === 'CLOSED' ? total : Math.round(total * (0.4 + ((n * 7) % 55) / 100)),
          item: {
            id: `a-${n}`, title: `${p.subject.name} ${CAT_NAME[CATS[n % 5]]} ${Math.ceil(n / 5)}`, category: CATS[n % 5], status,
            subject: { id: p.subject.id, name: p.subject.name, code: subjects.find((s) => s.id === p.subject.id)?.code ?? '' },
            class: { id: c.id, name: c.name }, teacher: p.teacher ? { id: p.teacher.id, full_name: p.teacher.full_name } : null,
            published_at: status === 'DRAFT' ? null : new Date(new Date(due).getTime() - 7 * DAY).toISOString(), due_at: due,
            max_score: SCORES[n % 3], expected_count: total, received_count: 0,
          },
        });
      });
    }
    cache = out;
  }
  return [...cache, ...extra];
}

const effective = (b: Base) => ({ status: statusOverride.get(b.item.id) ?? b.item.status, published_at: publishedOverride.get(b.item.id) ?? b.item.published_at });

function rowsFor(b: Base): SubmissionRow[] {
  const { status, published_at } = effective(b);
  if (status === 'DRAFT') return [];
  const students = roster(b.item.class.id);
  const num = (id: string) => Number(id.slice(-5));
  const ordered = [...students].sort((x, y) => ((num(x.id) * 31 + b.n * 17) % 101) - ((num(y.id) * 31 + b.n * 17) % 101));
  const received = Math.min(b.receivedBase, ordered.length);
  const gradedCount = status === 'CLOSED' ? received : Math.floor(received * 0.65);
  const due = new Date(b.item.due_at).getTime();
  const pub = new Date(published_at ?? b.item.due_at).getTime();
  return ordered.map((s, i): SubmissionRow => {
    const base = { id: `${b.item.id}:${s.id}`, student_id: s.id, student_number: s.student_number, full_name: s.full_name, photo_url: s.photo_url };
    if (i >= received) return { ...base, status: 'NOT_SUBMITTED', submitted_at: null, score: null, grade: null, remark: null, feedback: null, graded: false };
    const late = i % 9 === 4;
    const submitted_at = new Date(late ? due + (2 + (i % 20)) * 3_600_000 : Math.min(pub + (3 + ((i * 5) % 60)) * 3_600_000, due - 3_600_000)).toISOString();
    const ov = gradeOverride.get(base.id);
    const auto = i < gradedCount ? Math.min(b.item.max_score, Math.round(b.item.max_score * (0.55 + ((num(s.id) * 13 + b.n * 7) % 40) / 100))) : null;
    const score = ov ? ov.score : auto;
    const [grade, remark] = score === null ? [null, null] : gradeFor((score / b.item.max_score) * 100);
    return { ...base, status: late ? 'LATE' : 'SUBMITTED', submitted_at, score, grade, remark, feedback: ov?.feedback ?? null, graded: score !== null };
  });
}

function toItem(b: Base): AssignmentListItem {
  const e = effective(b);
  return { ...b.item, ...e, received_count: rowsFor(b).filter((r) => r.status !== 'NOT_SUBMITTED').length };
}

export async function queryAssignments(p: AssignmentListParams): Promise<PaginatedResponse<AssignmentListItem>> {
  await delay();
  const now = Date.now();
  const mon = new Date(); mon.setHours(0, 0, 0, 0); mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));
  const weekStart = mon.getTime();
  const q = p.search?.trim().toLowerCase();
  const rows = (await load()).map(toItem).filter((a) => {
    const due = new Date(a.due_at).getTime();
    return (!q || [a.title, a.subject.name, a.class.name].some((v) => v.toLowerCase().includes(q))) &&
      (!p.class_id || a.class.id === p.class_id) && (!p.subject_id || a.subject.id === p.subject_id) && (!p.status || a.status === p.status) &&
      (!p.due || (p.due === 'THIS_WEEK' ? due >= weekStart && due < weekStart + 7 * DAY : p.due === 'NEXT_WEEK' ? due >= weekStart + 7 * DAY && due < weekStart + 14 * DAY : due < now));
  }).sort((a, b) => new Date(b.due_at).getTime() - new Date(a.due_at).getTime());
  return {
    success: true, data: rows.slice((p.page - 1) * p.page_size, p.page * p.page_size),
    pagination: { page: p.page, page_size: p.page_size, total: rows.length, total_pages: Math.max(1, Math.ceil(rows.length / p.page_size)) },
  };
}

export async function assignmentDetail(id: string): Promise<AssignmentDetail> {
  await delay();
  const b = (await load()).find((x) => x.item.id === id);
  if (!b) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Assignment was not found.');
  const item = toItem(b);
  const rows = rowsFor(b);
  const received = rows.filter((r) => r.status !== 'NOT_SUBMITTED');
  const graded = received.filter((r) => r.graded);
  const teacher = (await classSubjects(item.class.id)).find((p) => p.teacher?.id === item.teacher?.id)?.teacher ?? null;
  return {
    ...item, teacher, term: 'Term 1', academic_year: '2026/2027',
    instructions: `Complete all exercises set in class for ${item.subject.name}. Show your working clearly and submit before the deadline.`,
    attachments: b.n % 4 === 1 ? [{ id: `${id}-f1`, name: `${item.subject.name.replace(/\W+/g, '_')}_worksheet.pdf`, size_bytes: 1_400_000, content_type: 'application/pdf', download_url: null }] : [],
    summary: {
      expected: item.expected_count, received: received.length, on_time: rows.filter((r) => r.status === 'SUBMITTED').length,
      late: rows.filter((r) => r.status === 'LATE').length, not_submitted: rows.filter((r) => r.status === 'NOT_SUBMITTED').length,
      graded: graded.length, awaiting_review: received.length - graded.length,
      average_score: graded.length ? Math.round((graded.reduce((a, r) => a + (r.score ?? 0), 0) / graded.length) * 10) / 10 : null,
    },
  };
}

export async function querySubmissions(id: string, p: SubmissionListParams): Promise<PaginatedResponse<SubmissionRow>> {
  await delay();
  const b = (await load()).find((x) => x.item.id === id);
  if (!b) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Assignment was not found.');
  const q = p.search?.trim().toLowerCase();
  const rows = rowsFor(b).filter((r) =>
    (!q || r.full_name.toLowerCase().includes(q) || r.student_number.toLowerCase().includes(q)) && (!p.status || r.status === p.status) &&
    (!p.grading || (p.grading === 'GRADED' ? r.graded : r.status !== 'NOT_SUBMITTED' && !r.graded))).sort((a, c) => a.full_name.localeCompare(c.full_name));
  return {
    success: true, data: rows.slice((p.page - 1) * p.page_size, p.page * p.page_size),
    pagination: { page: p.page, page_size: p.page_size, total: rows.length, total_pages: Math.max(1, Math.ceil(rows.length / p.page_size)) },
  };
}

export async function gradeSubmission(submissionId: string, payload: GradePayload): Promise<SubmissionRow> {
  await delay();
  const [aid] = submissionId.split(':');
  const b = (await load()).find((x) => x.item.id === aid);
  const row = b && rowsFor(b).find((r) => r.id === submissionId);
  if (!b || !row) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Submission was not found.');
  if (row.status === 'NOT_SUBMITTED') throw new ApiError('validation', 422, 'VALIDATION_ERROR', 'This learner has not submitted yet.');
  if (!(payload.score >= 0 && payload.score <= b.item.max_score)) throw new ApiError('validation', 422, 'VALIDATION_ERROR', `Score must be between 0 and ${b.item.max_score}.`);
  gradeOverride.set(submissionId, payload);
  return rowsFor(b).find((r) => r.id === submissionId)!;
}

export async function addAssignment(p: CreateAssignmentPayload): Promise<AssignmentListItem> {
  await delay();
  if (!p.title.trim()) throw new ApiError('validation', 422, 'VALIDATION_ERROR', 'A title is required.');
  const [classId, subjectId, teacherId] = p.class_subject_id.split(':');
  const cls = (await queryClasses({ page: 1, page_size: 100 })).data.find((c) => c.id === classId);
  const pair = (await classSubjects(classId)).find((x) => x.subject.id === subjectId && x.teacher?.id === teacherId);
  if (!cls || !pair) throw new ApiError('validation', 422, 'VALIDATION_ERROR', 'Choose a class and one of its subjects.');
  const subject = (await querySubjects({ page: 1, page_size: 100 })).data.find((s) => s.id === subjectId);
  const n = 100 + extra.length + 1;
  const item: AssignmentListItem = {
    id: `a-${n}`, title: p.title.trim(), category: p.category, status: 'DRAFT', subject: { id: subjectId, name: pair.subject.name, code: subject?.code ?? '' },
    class: { id: cls.id, name: cls.name }, teacher: pair.teacher ? { id: pair.teacher.id, full_name: pair.teacher.full_name } : null,
    published_at: null, due_at: p.due_at, max_score: p.max_score, expected_count: roster(cls.id).length, received_count: 0,
  };
  extra.push({ item, n, receivedBase: 0 });
  return item;
}

export async function setStatus(id: string, status: 'PUBLISHED' | 'CLOSED'): Promise<void> {
  await delay();
  const b = (await load()).find((x) => x.item.id === id);
  if (!b) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Assignment was not found.');
  const current = effective(b).status;
  if (status === 'PUBLISHED' && current !== 'DRAFT') throw new ApiError('conflict', 409, 'CONFLICT', 'Only a draft can be published.');
  if (status === 'CLOSED' && current !== 'PUBLISHED') throw new ApiError('conflict', 409, 'CONFLICT', 'Only a published assignment can be closed.');
  statusOverride.set(id, status);
  if (status === 'PUBLISHED') publishedOverride.set(id, new Date().toISOString());
}
