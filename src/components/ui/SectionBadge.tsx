import type { SchoolSection } from '../../types/student';
import { Badge } from './Badge';

export const SectionBadge = ({ section }: { section: SchoolSection }) => (
  <Badge tone={section === 'JHS' ? 'teal' : 'orange'}>{section}</Badge>
);
