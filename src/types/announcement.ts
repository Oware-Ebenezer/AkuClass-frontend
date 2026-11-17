import type { AssignmentAttachment } from './assignment';

// PROPOSED shapes: the contract lists announcement endpoints without bodies or query params.
export type AnnouncementStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AnnouncementAudience = 'ENTIRE_SCHOOL' | 'JHS' | 'SHS' | 'CLASS' | 'STAFF';

export interface AnnouncementListItem {
  id: string;
  title: string;
  status: AnnouncementStatus;
  audience: AnnouncementAudience;
  class: { id: string; name: string } | null; // only for audience CLASS
  author: { id: string; full_name: string };
  created_at: string;
  published_at: string | null;
}

export interface AnnouncementListParams { page: number; page_size: number; search?: string; status?: AnnouncementStatus; audience?: AnnouncementAudience; }

export interface AnnouncementDetail extends AnnouncementListItem { body: string; attachments: AssignmentAttachment[]; }

export interface SaveAnnouncementPayload { title: string; audience: AnnouncementAudience; class_id: string | null; body: string; }
