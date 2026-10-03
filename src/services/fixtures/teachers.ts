import type { PaginatedResponse } from '../../types/api';
import type { Subject, Teacher, TeacherListParams } from '../../types/teacher';
import { queryClasses } from './classes';

// Dev-only data. The first 24 teachers are the class teachers from the classes fixture, so
// both screens agree; level, subjects and classes are derived from their class assignments.
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const JHS_SUBJECTS = ['Mathematics', 'English Language', 'Integrated Science', 'Social Studies', 'ICT', 'Basic Design & Tech (BDT)', 'Ghanaian Language (Twi)', 'French', 'Religious & Moral Education', 'Creative Arts'];
const SHS_SUBJECTS = ['Core Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government', 'Literature in English', 'Business Management', 'Elective Mathematics'];
export const subjectsFixture: Subject[] = [...new Set([...JHS_SUBJECTS, ...SHS_SUBJECTS])].map((name) => ({ id: slug(name), name }));

const EXTRA = ['Mr. Kwabena Nkrumah', 'Mrs. Rita Opoku', 'Mr. Eric Yeboah', 'Mrs. Gifty Ansah', 'Mr. Michael Adjei', 'Mrs. Patience Larbi',
  'Mr. Francis Bonsu', 'Mrs. Mercy Konadu', 'Mr. Richard Amponsah', 'Mrs. Josephine Dadzie', 'Mr. Stephen Kyei', 'Mrs. Beatrice Ampofo',
  'Mr. Prince Ntim', 'Mrs. Felicia Adu', 'Mr. Collins Mensa', 'Mrs. Hannah Owusu', 'Mr. Albert Tawiah', 'Mrs. Victoria Sackey',
  'Mr. Bernard Okyere', 'Mrs. Dorcas Asamoah', 'Mr. Vincent Kuffour', 'Mrs. Christiana Ayew', 'Mr. Patrick Wiredu', 'Mrs. Lydia Baffoe'];

let cache: Teacher[] | null = null;
async function all(): Promise<Teacher[]> {
  if (cache) return cache;
  const classes = (await queryClasses({ page: 1, page_size: 100 })).data;
  cache = Array.from({ length: 48 }, (_, k) => {
    const own = k < 24 ? classes[k] : undefined;
    const picks = own ? [own, classes[(k * 5 + 3) % 24]] : [classes[(k * 7) % 24], classes[(k * 11 + 5) % 24]];
    const uniq = [...new Map(picks.map((c) => [c.id, c])).values()];
    const sections = [...new Set(uniq.map((c) => c.school_section))];
    const subjects = [...new Set(sections.map((sec) => { const list = sec === 'JHS' ? JHS_SUBJECTS : SHS_SUBJECTS; return list[(k * 3 + (sec === 'SHS' ? 1 : 0)) % list.length]; }))];
    const name = own?.class_teacher?.full_name ?? EXTRA[k - 24];
    const [first, last] = name.replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/, '').split(' ');
    return {
      id: `t-${k + 1}`, employee_number: `AKC-T-${String(101 + k).padStart(4, '0')}`, full_name: name,
      email: `${first[0]}.${last}@akuclass.edu.gh`.toLowerCase(),
      phone: `0${[24, 20, 27, 50][k % 4]} ${100 + ((k * 37) % 900)} ${1000 + ((k * 911) % 9000)}`, photo_url: null,
      level: sections.length > 1 ? 'BOTH' : sections[0], subjects,
      classes: uniq.map((c) => ({ id: c.id, name: c.name, is_class_teacher: c === own })),
      status: k === 30 || k === 41 ? 'INACTIVE' : k === 44 ? 'SUSPENDED' : 'ACTIVE',
    } as Teacher;
  });
  return cache;
}

export async function queryTeachers(p: TeacherListParams): Promise<PaginatedResponse<Teacher>> {
  await new Promise((r) => setTimeout(r, 200));
  const q = p.search?.trim().toLowerCase();
  const subjectName = p.subject_id ? subjectsFixture.find((s) => s.id === p.subject_id)?.name : undefined;
  const rows = (await all()).filter((t) =>
    (!q || [t.full_name, t.employee_number, ...t.subjects].some((v) => v.toLowerCase().includes(q))) &&
    (!p.level || t.level === p.level) && (!p.status || t.status === p.status) && (!subjectName || t.subjects.includes(subjectName)));
  return {
    success: true,
    data: rows.slice((p.page - 1) * p.page_size, p.page * p.page_size),
    pagination: { page: p.page, page_size: p.page_size, total: rows.length, total_pages: Math.max(1, Math.ceil(rows.length / p.page_size)) },
  };
}
