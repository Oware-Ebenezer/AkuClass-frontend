import { Badge } from '../../../components/ui/Badge';
import { AUDIENCE_LABEL, STATUS_LABEL, STATUS_TONE } from '../../../constants/announcement';
import type { AnnouncementListItem, AnnouncementStatus } from '../../../types/announcement';

export const AnnouncementStatusBadge = ({ status }: { status: AnnouncementStatus }) => <Badge dot tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;

export const AudienceBadge = ({ a }: { a: Pick<AnnouncementListItem, 'audience' | 'class'> }) => (
  <Badge tone={a.audience === 'ENTIRE_SCHOOL' ? 'teal' : 'neutral'}>{a.audience === 'CLASS' && a.class ? `Class: ${a.class.name}` : AUDIENCE_LABEL[a.audience]}</Badge>
);
