import type { PaginatedResponse } from '../types/api';
import type { AnnouncementDetail, AnnouncementListItem, AnnouncementListParams, SaveAnnouncementPayload } from '../types/announcement';
import { toQuery } from '../utils/query';
import { USE_FIXTURES, apiGet, apiGetPage, apiPatch, apiPost } from './apiClient';

const fx = () => import('./fixtures/announcements');

export async function listAnnouncements(params: AnnouncementListParams): Promise<PaginatedResponse<AnnouncementListItem>> {
  if (USE_FIXTURES) return (await fx()).queryAnnouncements(params);
  return apiGetPage<AnnouncementListItem>(`/announcements${toQuery(params)}`);
}

export async function getAnnouncement(id: string): Promise<AnnouncementDetail> {
  if (USE_FIXTURES) return (await fx()).announcementDetail(id);
  return apiGet<AnnouncementDetail>(`/announcements/${encodeURIComponent(id)}`);
}

// New announcements start as drafts; publishing is a separate call (contract section 22).
export async function saveAnnouncement(id: string | null, payload: SaveAnnouncementPayload): Promise<AnnouncementListItem> {
  if (USE_FIXTURES) return (await fx()).saveAnnouncement(id, payload);
  return id ? apiPatch<AnnouncementListItem>(`/announcements/${encodeURIComponent(id)}`, payload) : apiPost<AnnouncementListItem>('/announcements', payload);
}

export async function publishAnnouncement(id: string): Promise<void> {
  if (USE_FIXTURES) return (await fx()).setStatus(id, 'PUBLISHED');
  await apiPost<unknown>(`/announcements/${encodeURIComponent(id)}/publish`, {});
}

export async function archiveAnnouncement(id: string): Promise<void> {
  if (USE_FIXTURES) return (await fx()).setStatus(id, 'ARCHIVED');
  await apiPost<unknown>(`/announcements/${encodeURIComponent(id)}/archive`, {});
}

export interface AnnouncementCounts { total: number; published: number; draft: number; archived: number; }

// Built only from contract endpoints: each figure is the `pagination.total` of a one-row page.
export async function getAnnouncementCounts(): Promise<AnnouncementCounts> {
  const count = async (status?: AnnouncementListParams['status']) => (await listAnnouncements({ page: 1, page_size: 1, status })).pagination.total;
  const [total, published, draft, archived] = await Promise.all([count(), count('PUBLISHED'), count('DRAFT'), count('ARCHIVED')]);
  return { total, published, draft, archived };
}
