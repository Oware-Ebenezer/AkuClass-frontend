import type { AnnouncementAudience, AnnouncementStatus } from '../types/announcement';

export const STATUS_LABEL: Record<AnnouncementStatus, string> = { DRAFT: 'Draft', PUBLISHED: 'Published', ARCHIVED: 'Archived' };
export const STATUS_TONE = { DRAFT: 'orange', PUBLISHED: 'teal', ARCHIVED: 'neutral' } as const;
export const AUDIENCE_LABEL: Record<AnnouncementAudience, string> = {
  ENTIRE_SCHOOL: 'Entire School', JHS: 'JHS 1–3', SHS: 'SHS 1–3', CLASS: 'Specific Class', STAFF: 'Staff Only',
};
