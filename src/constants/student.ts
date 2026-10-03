import type { AccountStatus } from '../types';
import type { Gender, SchoolSection } from '../types/student';

export const STATUS_LABEL: Record<AccountStatus, string> = { ACTIVE: 'Active', INACTIVE: 'Inactive', SUSPENDED: 'Suspended' };
export const GENDER_LABEL: Record<Gender, string> = { FEMALE: 'Female', MALE: 'Male' };
export const SECTION_LABEL: Record<SchoolSection, string> = { JHS: 'JHS (Junior High School)', SHS: 'SHS (Senior High School)' };

// Presentation threshold only: below this the attendance bar turns orange.
export const ATTENDANCE_TARGET_PERCENT = 90;
