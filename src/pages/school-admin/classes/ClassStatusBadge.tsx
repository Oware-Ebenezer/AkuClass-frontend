import { Badge } from '../../../components/ui/Badge';
import type { ClassStatus } from '../../../types/class';

export const ClassStatusBadge = ({ status }: { status: ClassStatus }) => (
  <Badge dot tone={status === 'ACTIVE' ? 'teal' : 'neutral'}>{status === 'ACTIVE' ? 'Active' : 'Inactive'}</Badge>
);
