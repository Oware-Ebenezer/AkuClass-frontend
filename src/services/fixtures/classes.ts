import type { PaginatedResponse } from '../../types/api';
import type { ClassListItem, ClassListParams } from '../../types/class';
import { classesFixture, studentsFixture } from './students';

const TEACHERS = ['Mrs. Adwoa Boateng', 'Mr. Emmanuel Osei', 'Mr. Daniel Ofori', 'Mrs. Grace Appiah', 'Mr. Isaac Mensah', 'Mrs. Akosua Mensah',
  'Mr. Kofi Asare', 'Mrs. Comfort Frimpong', 'Mrs. Ama Owusu', 'Mr. Kwame Boateng', 'Mrs. Efua Darko', 'Mr. Yaw Quaye',
  'Mrs. Esi Tetteh', 'Mr. Samuel Amoah', 'Mrs. Abena Badu', 'Mr. Joseph Danso', 'Mrs. Serwaa Gyamfi', 'Mr. Nii Acheampong',
  'Mrs. Afia Addo', 'Mr. Kwesi Sarpong', 'Mrs. Maame Agyeman', 'Mr. Kwabena Antwi', 'Mrs. Nana Ofori', 'Mr. Kojo Asante'];

// Dev-only data. student_count is derived from the student fixtures so both screens agree.
const all: ClassListItem[] = classesFixture.map((c, i) => ({
  id: c.id, name: c.name, school_section: c.school_section, level: c.name.match(/^(JHS|SHS) \d/)![0],
  student_count: studentsFixture.filter((s) => s.class_id === c.id).length,
  class_teacher: { id: `t-${i + 1}`, full_name: TEACHERS[i % TEACHERS.length] },
  academic_year: '2026/2027', status: 'ACTIVE',
}));

export async function queryClasses(p: ClassListParams): Promise<PaginatedResponse<ClassListItem>> {
  await new Promise((r) => setTimeout(r, 200));
  const q = p.search?.trim().toLowerCase();
  const rows = all.filter((c) =>
    (!q || [c.name, c.level, c.class_teacher?.full_name ?? ''].some((v) => v.toLowerCase().includes(q))) &&
    (!p.school_section || c.school_section === p.school_section) && (!p.status || c.status === p.status));
  return {
    success: true,
    data: rows.slice((p.page - 1) * p.page_size, p.page * p.page_size),
    pagination: { page: p.page, page_size: p.page_size, total: rows.length, total_pages: Math.max(1, Math.ceil(rows.length / p.page_size)) },
  };
}
