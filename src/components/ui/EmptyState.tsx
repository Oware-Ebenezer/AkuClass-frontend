import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface EmptyStateProps { title: string; message?: string; icon?: string; action?: ReactNode; }

export const EmptyState = ({ title, message, icon = 'search_off', action }: EmptyStateProps) => {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 py-16 text-center">
      <Icon name={icon} size={32} className="text-charcoal-muted" />
      <h2 className="text-base font-semibold">{title}</h2>
      {message && <p className="text-charcoal-muted">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
