import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/ui/Icon';
import type { ActivityItem } from '../../../types';
import { timeAgo } from '../../../utils/format';

function Description({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [before, after] = text.split(highlight);
  return <>{before}<span className="font-medium text-charcoal">{highlight}</span>{after}</>;
}

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="space-y-4">
      <h2 className="flex items-center gap-1 text-xl font-bold"><Icon name="history" className="text-charcoal-muted" />Recent Activity</h2>
      <ol className="relative space-y-4 pl-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-warm-200">
        {items.map((a) => (
          <li key={a.id} className="relative">
            <span className="absolute top-1 -left-6 size-2.5 rounded-full bg-teal ring-4 ring-white" />
            <p className="text-xs font-semibold">{a.title}</p>
            <p className="text-xs text-charcoal-muted"><Description text={a.description} highlight={a.highlight} /></p>
            <span className="text-[11px] text-charcoal-muted">{timeAgo(a.occurredAt)}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
