import type { PaginatedResponse } from '../../types/api';
import type { CreateSubjectPayload, SubjectCategory, SubjectDetail, SubjectListItem, SubjectListParams } from '../../types/subject';
import { ApiError } from '../apiClient';
import { classesFixture } from './students';
import { JHS_SUBJECTS, SHS_SUBJECTS, allTeachers, allowed, slug, subjectsFixture } from './teachers';

// Dev-only data. Class allocations and teachers are derived from the teacher fixtures,
// so this screen agrees with the Class Details and Teacher Profile screens.
const META: Record<string, { code: string; category: SubjectCategory }> = {
  'Mathematics': { code: 'MAT', category: 'CORE' }, 'English Language': { code: 'ENG', category: 'CORE' },
  'Integrated Science': { code: 'SCI', category: 'CORE' }, 'Social Studies': { code: 'SOC', category: 'CORE' },
  'ICT': { code: 'ICT', category: 'CORE' }, 'Basic Design & Tech (BDT)': { code: 'BDT', category: 'CORE' },
  'Ghanaian Language (Twi)': { code: 'TWI', category: 'CORE' }, 'French': { code: 'FRE', category: 'CORE' },
  'Religious & Moral Education': { code: 'RME', category: 'CORE' }, 'Creative Arts': { code: 'CRA', category: 'CORE' },
  'Core Mathematics': { code: 'C-MAT', category: 'CORE' }, 'Physics': { code: 'PHY', category: 'SCIENCE' },
  'Chemistry': { code: 'CHE', category: 'SCIENCE' }, 'Biology': { code: 'BIO', category: 'SCIENCE' },
  'Economics': { code: 'ECO', category: 'BUSINESS' }, 'Government': { code: 'GOV', category: 'ARTS' },
  'Literature in English': { code: 'LIT', category: 'ARTS' }, 'Business Management': { code: 'BUS', category: 'BUSINESS' },
  'Elective Mathematics': { code: 'E-MAT', category: 'SCIENCE' },
};
const INACTIVE = new Set(['French', 'Elective Mathematics']);
const created: SubjectListItem[] = [];
const delay = () => new Promise((r) => setTimeout(r, 200));
const sectionOf = (classId: string) => (classId.startsWith('jhs') ? 'JHS' : 'SHS');

async function relations(name: string) {
  const teachers = (await allTeachers()).filter((t) => t.subjects.includes(name));
  const classIds = [...new Set(teachers.flatMap((t) => t.classes.filter((c) => allowed(name, sectionOf(c.id))).map((c) => c.id)))];
  return { teachers, classIds };
}

async function all(): Promise<SubjectListItem[]> {
  const base = await Promise.all(subjectsFixture.map(async (s): Promise<SubjectListItem> => {
    const jhs = JHS_SUBJECTS.includes(s.name);
    const shs = SHS_SUBJECTS.includes(s.name);
    return {
      ...s, ...META[s.name], level: jhs && shs ? 'BOTH' : jhs ? 'JHS' : 'SHS', description: null,
      class_count: (await relations(s.name)).classIds.length, status: INACTIVE.has(s.name) ? 'INACTIVE' : 'ACTIVE',
    };
  }));
  return [...base, ...created];
}

export async function querySubjects(p: SubjectListParams): Promise<PaginatedResponse<SubjectListItem>> {
  await delay();
  const q = p.search?.trim().toLowerCase();
  const rows = (await all()).filter((s) =>
    (!q || [s.name, s.code, s.description ?? ''].some((v) => v.toLowerCase().includes(q))) &&
    (!p.level || s.level === p.level) && (!p.category || s.category === p.category) && (!p.status || s.status === p.status));
  return {
    success: true,
    data: rows.slice((p.page - 1) * p.page_size, p.page * p.page_size),
    pagination: { page: p.page, page_size: p.page_size, total: rows.length, total_pages: Math.max(1, Math.ceil(rows.length / p.page_size)) },
  };
}

export async function subjectDetail(id: string): Promise<SubjectDetail> {
  await delay();
  const s = (await all()).find((x) => x.id === id);
  if (!s) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Subject was not found.');
  const { teachers, classIds } = await relations(s.name);
  return {
    ...s,
    classes: classIds.map((cid) => ({ id: cid, name: classesFixture.find((c) => c.id === cid)?.name ?? cid })),
    teachers: teachers.map((t) => ({ id: t.id, full_name: t.full_name, employee_number: t.employee_number })),
  };
}

export async function addSubject(p: CreateSubjectPayload): Promise<SubjectListItem> {
  await delay();
  const existing = await all();
  if (existing.some((s) => s.name.toLowerCase() === p.name.toLowerCase() || s.code.toLowerCase() === p.code.toLowerCase())) {
    throw new ApiError('conflict', 409, 'CONFLICT', 'A subject with this name or code already exists.');
  }
  const item: SubjectListItem = { id: slug(p.name), ...p, class_count: 0, status: 'ACTIVE' };
  created.push(item);
  return item;
}
