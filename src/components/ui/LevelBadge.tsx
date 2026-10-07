import type { TeacherLevel } from '../../types/teacher';
import { Badge } from './Badge';

const map: Record<TeacherLevel, { tone: 'teal' | 'orange' | 'neutral'; label: string }> = {
  JHS: { tone: 'teal', label: 'JHS' }, SHS: { tone: 'orange', label: 'SHS' }, BOTH: { tone: 'neutral', label: 'JHS & SHS' },
};

export const LevelBadge = ({ level }: { level: TeacherLevel }) => <Badge tone={map[level].tone}>{map[level].label}</Badge>;
