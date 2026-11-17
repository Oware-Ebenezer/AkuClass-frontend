import type { PaginatedResponse } from '../../types/api';
import type { AnnouncementAudience, AnnouncementDetail, AnnouncementListItem, AnnouncementListParams, AnnouncementStatus, SaveAnnouncementPayload } from '../../types/announcement';
import { ApiError } from '../apiClient';
import { queryClasses } from './classes';

// Dev-only data: 24 announcements (18 published, 4 drafts, 2 archived). Edits live in memory.
const TITLES: [string, AnnouncementAudience][] = [
  ['Mid-Term Examination Schedule and Timetable Guidelines', 'ENTIRE_SCHOOL'], ['BECE Registration and Career Guidance Session', 'JHS'],
  ['PTA General Meeting: Facilities Levy', 'ENTIRE_SCHOOL'], ['SHS 2 Mock Examination Practical Readiness', 'SHS'], ['Parents’ Consultation Day', 'CLASS'],
  ['Inter-House Athletics Schedule', 'ENTIRE_SCHOOL'], ['Staff Meeting: Continuous Assessment Moderation', 'STAFF'], ['Library Books Return Notice', 'ENTIRE_SCHOOL'],
  ['JHS Quiz Competition Registration', 'JHS'], ['SHS Career Talk', 'SHS'], ['Class Trip Permission Slips', 'CLASS'], ['Term Calendar Update', 'ENTIRE_SCHOOL'],
];
const AUTHORS = [{ id: 'u-admin', full_name: 'Ama Mensah' }, { id: 't-1', full_name: 'Mrs. Adwoa Boateng' }, { id: 't-2', full_name: 'Mr. Emmanuel Osei' }];
const DAY = 86_400_000;
interface Rec { item: AnnouncementListItem; body: string; attachments: AnnouncementDetail['attachments']; }
const edits = new Map<string, Partial<Rec['item']> & { body?: string }>();
const extra: Rec[] = [];
const delay = () => new Promise((r) => setTimeout(r, 200));
const bodyFor = (title: string) => `Dear AkuClass Academy community,\n\nThis notice concerns: ${title}.\n\nKey points:\n- Class teachers will share further details.\n- Please read this notice in full.\n\nBy order of the school administration.`;

let cache: Rec[] | null = null;
async function load(): Promise<Rec[]> {
  if (!cache) {
    const classes = (await queryClasses({ page: 1, page_size: 100 })).data;
    cache = Array.from({ length: 24 }, (_, i): Rec => {
      const n = i + 1;
      const [title, audience] = TITLES[i % TITLES.length];
      const status: AnnouncementStatus = n % 6 === 0 ? 'DRAFT' : n === 11 || n === 23 ? 'ARCHIVED' : 'PUBLISHED';
      const created = new Date(Date.now() - (n * 2 + 1) * DAY).toISOString();
      const cls = audience === 'CLASS' ? classes[(n * 5) % classes.length] : null;
      return {
        item: { id: `n-${n}`, title: n > 12 ? `${title} (Update ${Math.ceil(n / 12)})` : title, status, audience, class: cls ? { id: cls.id, name: cls.name } : null, author: AUTHORS[n % 3], created_at: created, published_at: status === 'DRAFT' ? null : created },
        body: bodyFor(title),
        attachments: n % 5 === 1 ? [{ id: `n-${n}-f`, name: 'Circular.pdf', size_bytes: 1_800_000, content_type: 'application/pdf', download_url: null }] : [],
      };
    });
  }
  return [...cache, ...extra];
}
const view = (r: Rec): AnnouncementListItem => ({ ...r.item, ...edits.get(r.item.id), body: undefined } as unknown as AnnouncementListItem);
const clean = (r: Rec): AnnouncementListItem => { const { body: _b, ...rest } = view(r) as AnnouncementListItem & { body?: string }; return rest; };

export async function queryAnnouncements(p: AnnouncementListParams): Promise<PaginatedResponse<AnnouncementListItem>> {
  await delay();
  const q = p.search?.trim().toLowerCase();
  const rows = (await load()).map(clean).filter((a) => (!q || a.title.toLowerCase().includes(q) || a.author.full_name.toLowerCase().includes(q)) && (!p.status || a.status === p.status) && (!p.audience || a.audience === p.audience))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return { success: true, data: rows.slice((p.page - 1) * p.page_size, p.page * p.page_size), pagination: { page: p.page, page_size: p.page_size, total: rows.length, total_pages: Math.max(1, Math.ceil(rows.length / p.page_size)) } };
}

export async function announcementDetail(id: string): Promise<AnnouncementDetail> {
  await delay();
  const r = (await load()).find((x) => x.item.id === id);
  if (!r) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Announcement was not found.');
  return { ...clean(r), body: edits.get(id)?.body ?? r.body, attachments: r.attachments };
}

export async function saveAnnouncement(id: string | null, p: SaveAnnouncementPayload): Promise<AnnouncementListItem> {
  await delay();
  if (!p.title.trim() || !p.body.trim()) throw new ApiError('validation', 422, 'VALIDATION_ERROR', 'A title and message are required.');
  const cls = p.audience === 'CLASS' ? (await queryClasses({ page: 1, page_size: 100 })).data.find((c) => c.id === p.class_id) : null;
  if (p.audience === 'CLASS' && !cls) throw new ApiError('validation', 422, 'VALIDATION_ERROR', 'Choose the class this announcement is for.');
  const klass = cls ? { id: cls.id, name: cls.name } : null;
  if (id) {
    if (!(await load()).some((x) => x.item.id === id)) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Announcement was not found.');
    edits.set(id, { ...edits.get(id), title: p.title.trim(), audience: p.audience, class: klass, body: p.body.trim() });
    return clean((await load()).find((x) => x.item.id === id)!);
  }
  const rec: Rec = { item: { id: `n-${100 + extra.length + 1}`, title: p.title.trim(), status: 'DRAFT', audience: p.audience, class: klass, author: AUTHORS[0], created_at: new Date().toISOString(), published_at: null }, body: p.body.trim(), attachments: [] };
  extra.push(rec);
  return rec.item;
}

export async function setStatus(id: string, status: 'PUBLISHED' | 'ARCHIVED'): Promise<void> {
  await delay();
  const r = (await load()).find((x) => x.item.id === id);
  if (!r) throw new ApiError('not_found', 404, 'RESOURCE_NOT_FOUND', 'Announcement was not found.');
  const current = clean(r).status;
  if (status === 'PUBLISHED' && current !== 'DRAFT') throw new ApiError('conflict', 409, 'CONFLICT', 'Only a draft can be published.');
  if (status === 'ARCHIVED' && current !== 'PUBLISHED') throw new ApiError('conflict', 409, 'CONFLICT', 'Only a published announcement can be archived.');
  edits.set(id, { ...edits.get(id), status, published_at: status === 'PUBLISHED' ? new Date().toISOString() : clean(r).published_at });
}
