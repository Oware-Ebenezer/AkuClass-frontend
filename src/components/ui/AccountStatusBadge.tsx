import { STATUS_LABEL } from '../../constants/student';
import type { AccountStatus } from '../../types';
import { Badge } from './Badge';

const tone = { ACTIVE: 'teal', INACTIVE: 'neutral', SUSPENDED: 'danger' } as const;

export const AccountStatusBadge = ({ status }: { status: AccountStatus }) => (
  <Badge dot tone={tone[status]}>{STATUS_LABEL[status]}</Badge>
);
