import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

export interface Crumb { label: string; to?: string; }

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-charcoal-muted">
      {items.map((c, i) => (
        <span key={c.label} className="flex items-center gap-1">
          {i > 0 && <Icon name="chevron_right" size={16} />}
          {c.to ? <Link to={c.to} className="hover:text-teal">{c.label}</Link> : <span className={i === items.length - 1 ? 'font-semibold text-charcoal' : ''}>{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}
