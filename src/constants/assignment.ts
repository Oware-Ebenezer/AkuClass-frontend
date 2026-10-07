import type { AssignmentCategory, AssignmentStatus, SubmissionStatus } from '../types/assignment';

export const CATEGORY_LABEL: Record<AssignmentCategory, string> = { HOMEWORK: 'Homework', CLASSWORK: 'Classwork', PROJECT: 'Project', CLASS_TEST: 'Class Test', PRACTICAL: 'Practical' };
export const STATUS_LABEL: Record<AssignmentStatus, string> = { DRAFT: 'Draft', PUBLISHED: 'Published', CLOSED: 'Closed' };
export const STATUS_TONE = { DRAFT: 'neutral', PUBLISHED: 'teal', CLOSED: 'orange' } as const;
export const SUBMISSION_LABEL: Record<SubmissionStatus, string> = { SUBMITTED: 'Submitted', LATE: 'Late', NOT_SUBMITTED: 'Not submitted' };
export const SUBMISSION_TONE = { SUBMITTED: 'teal', LATE: 'orange', NOT_SUBMITTED: 'neutral' } as const;
