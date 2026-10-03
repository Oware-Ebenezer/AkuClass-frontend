import type { Pagination as PaginationMeta } from '../../types/api';
import { Icon } from './Icon';

interface PaginationProps { pagination: PaginationMeta; onPageChange: (page: number) => void; itemLabel?: string; }

function pageList(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['gap' as const, p] : [p]));
}

export const Pagination = ({ pagination, onPageChange, itemLabel }: PaginationProps) => {
  const { page, page_size, total, total_pages } = pagination;
  const label = itemLabel ? itemLabel : 'items';
  if (total === 0) return null;
  const from = (page - 1) * page_size + 1;
  const to = Math.min(page * page_size, total);
  const btn = 'inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-teal disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav aria-label="Pagination" className="flex flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row">
      <p className="text-xs text-charcoal-muted">Showing {from}–{to} of {total.toLocaleString()} {label}</p>
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Previous page" className={`${btn} hover:bg-warm-100`} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <Icon name="chevron_left" />
        </button>
        {pageList(page, total_pages).map((p, i) =>
          p === 'gap' ? <span key={`gap-${i}`} className="px-1 text-charcoal-muted">…</span> : (
            <button key={p} type="button" aria-current={p === page ? 'page' : undefined} onClick={() => onPageChange(p)}
              className={`${btn} ${p === page ? 'bg-teal text-white' : 'hover:bg-warm-100'}`}>{p}</button>
          ),
        )}
        <button type="button" aria-label="Next page" className={`${btn} hover:bg-warm-100`} disabled={page >= total_pages} onClick={() => onPageChange(page + 1)}>
          <Icon name="chevron_right" />
        </button>
      </div>
    </nav>
  );
}
