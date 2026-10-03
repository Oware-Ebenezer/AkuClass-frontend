import type { PaginatedResponse } from '../../types/api';
import type { Gender, SchoolClass, SchoolSection, Student, StudentDetail, StudentListParams, StudentSummary } from '../../types/student';
import { ApiError } from '../apiClient';

// Dev-only data. It stands in for the backend, including filtering and pagination.
const mk = (name: string, school_section: SchoolSection): SchoolClass => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name, school_section });
export const classesFixture: SchoolClass[] = [
  ...[1, 2, 3].flatMap((y) => ['A', 'B', 'C', 'D'].map((l) => mk(`JHS ${y}${l}`, 'JHS'))),
  ...[1, 2, 3].flatMap((y) => ['General Science', 'Business', 'General Arts', 'Home Economics'].map((p) => mk(`SHS ${y} ${p}`, 'SHS'))),
];

const FIRST_F = ['Ama', 'Akosua', 'Abena', 'Adwoa', 'Efua', 'Esi', 'Yaa', 'Afia', 'Akua', 'Maame', 'Serwaa', 'Nana'];
const FIRST_M = ['Kojo', 'Yaw', 'Kwame', 'Kofi', 'Kwabena', 'Daniel', 'Emmanuel', 'Kwesi', 'Nii', 'Samuel', 'Isaac', 'Joseph'];
const LAST = ['Mensah', 'Asare', 'Owusu', 'Boateng', 'Antwi', 'Ofori', 'Asante', 'Appiah', 'Darko', 'Agyeman', 'Quaye', 'Tetteh', 'Amoah', 'Badu', 'Danso', 'Frimpong', 'Gyamfi', 'Acheampong', 'Addo', 'Sarpong'];
const TOTAL = 842;
const SESSIONS = 102;
const AMA = 421;

const presentFor = (n: number) => (n === AMA ? 96 : 83 + ((n * 13) % 20));
const pct = (present: number) => Math.round((present / SESSIONS) * 1000) / 10;

const make = (n: number): Student => {
  const female = n === AMA || n % 2 === 0;
  const gender: Gender = female ? 'FEMALE' : 'MALE';
  const first = n === AMA ? 'Ama' : (female ? FIRST_F : FIRST_M)[(n * 5) % 12];
  const last = n === AMA ? 'Mensah' : LAST[(n * 7) % LAST.length];
  const section: SchoolSection = n <= 426 ? 'JHS' : 'SHS';
  const pool = classesFixture.filter((c) => c.school_section === section);
  const cls = n === AMA ? classesFixture.find((c) => c.name === 'JHS 2A')! : pool[(n * 3) % pool.length];
  return {
    id: `stu-${String(n).padStart(5, '0')}`, student_number: `AKC-2026-${String(n).padStart(5, '0')}`,
    full_name: `${first} ${last}`, email: `${first}.${last}@akuclass.edu.gh`.toLowerCase(), photo_url: null,
    school_section: section, class_id: cls.id, class_name: cls.name, gender,
    attendance_rate: pct(presentFor(n)), status: n % 25 === 0 ? 'INACTIVE' : 'ACTIVE',
  };
};

const all: Student[] = Array.from({ length: TOTAL }, (_, i) => make(i + 1))
  .sort((a, b) => a.full_name.split(' ')[1].localeCompare(b.full_name.split(' ')[1]) || a.full_name.localeCompare(b.full_name));

const delay = () => new Promise((r) => setTimeout(r, 200));

export async function queryStudents(p: StudentListParams): Promise<PaginatedResponse<Student>> {
  await delay();
  const q = p.search?.trim().toLowerCase();
  const rows = all.filter((s) =>
    (!q || s.full_name.toLowerCase().includes(q) || s.student_number.toLowerCase().includes(q)) &&
    (!p.school_section || s.school_section === p.school_section) &&
    (!p.class_id || s.class_id === p.class_id) &&
    (!p.status || s.status === p.status));
  return {
    success: true,
    data: rows.slice((p.page - 1) * p.page_size, p.page * p.page_size),
    pagination: { page: p.page, page_size: p.page_size, total: rows.length, total_pages: Math.max(1, Math.ceil(rows.length / p.page_size)) },
  };
}

export async function studentSummary(): Promise<StudentSummary> {
  await delay();
  const avg = all.reduce((sum, s) => sum + s.attendance_rate, 0) / all.length;
  return {
    total: all.length, jhs: all.filter((s) => s.school_section === 'JHS').length, shs: all.filter((s) => s.school_section === 'SHS').length,
    enrolled_this_term: 18, average_attendance: Math.round(avg * 10) / 10, attendance_change: 1.2,
  };
}

const gradeFor = (score: number): [string, string] =>
  score >= 86 ? ['A', 'Excellent'] : score >= 80 ? ['A', 'Very Good'] : score >= 75 ? ['B+', 'Good'] : ['B', 'Satisfactory'];
const SUBJECTS: [string, number][] = [['English Language', 82], ['Mathematics', 76], ['Integrated Science', 88], ['Social Studies', 79], ['Information & Comm. Tech (ICT)', 85]];

export async function studentDetail(id: string): Promise<StudentDetail> {
  await delay();
  const s = all.find((x) => x.id === id);
  if (!s) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Student was not found.');
  const n = Number(id.replace('stu-', ''));
  const present = presentFor(n);
  const rem = SESSIONS - present;
  const absent = Math.ceil(rem / 2);
  const late = Math.floor(rem / 3);
  const year = Number(s.class_name.match(/\d/)?.[0] ?? 1);
  const label = (cls: string, y: number) => `${s.school_section === 'JHS' ? 'Junior High School' : 'Senior High School'} ${y} (${cls})`;
  return {
    ...s,
    date_of_birth: n === AMA ? '2012-03-14' : `${(s.school_section === 'JHS' ? 2011 : 2008) + (n % 3)}-0${1 + (n % 9)}-1${n % 9}`,
    admission_date: '2025-09-08', academic_year: '2026/2027',
    student_contact: { phone: '024 000 0000', email: s.email },
    guardian: { name: `Kofi ${s.full_name.split(' ')[1]}`, relationship: 'Parent / Guardian', phone: '020 000 0000',
      email: `kofi.${s.full_name.split(' ')[1].toLowerCase()}@example.com`, address: 'House No. B14, Residential Area, Accra' },
    attendance_summary: { rate: pct(present), target_percent: 90, present, absent, late, excused: rem - absent - late },
    recent_results: SUBJECTS.map(([subject, base], i) => {
      const score = n === AMA ? base : Math.min(98, Math.max(55, base + ((n * 3 + i * 5) % 15) - 7));
      const [grade, remark] = gradeFor(score);
      return { id: `r${i}`, subject, score, grade, remark, term: 'Term 1' };
    }),
    enrollment_history: [
      { id: 'h1', academic_year: '2026/2027', class_name: label(s.class_name, year), school_section: s.school_section, class_teacher: 'Mr. Emmanuel Osei', period: 'Started Sep 2026', is_current: true },
      ...(year > 1 ? [{ id: 'h2', academic_year: '2025/2026', class_name: label(s.class_name.replace(/\d/, String(year - 1)), year - 1), school_section: s.school_section, class_teacher: 'Mrs. Grace Appiah', period: 'Sep 2025 – Jul 2026', is_current: false }] : []),
    ],
  };
}
export { all as studentsFixture };
