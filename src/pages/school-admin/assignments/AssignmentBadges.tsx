import { Badge } from '../../../components/ui/Badge';
import { CATEGORY_LABEL, STATUS_LABEL, STATUS_TONE, SUBMISSION_LABEL, SUBMISSION_TONE } from '../../../constants/assignment';
import type { AssignmentCategory, AssignmentStatus, SubmissionStatus } from '../../../types/assignment';

export const AssignmentStatusBadge = ({ status }: { status: AssignmentStatus }) => <Badge dot tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
export const CategoryBadge = ({ category }: { category: AssignmentCategory }) => <Badge>{CATEGORY_LABEL[category]}</Badge>;
export const SubmissionStatusBadge = ({ status }: { status: SubmissionStatus }) => <Badge dot tone={SUBMISSION_TONE[status]}>{SUBMISSION_LABEL[status]}</Badge>;
