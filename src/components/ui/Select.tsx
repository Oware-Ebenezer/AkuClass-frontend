import type { SelectHTMLAttributes } from 'react';
import { Icon } from './Icon';

export interface SelectOption { value: string; label: string; }
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; options: SelectOption[]; error?: string; filled?: boolean; }

export const Select = ({ label, options, error, filled = false, id, className = '', ...rest }: SelectProps) => {
  const selectId = id ?? rest.name;
  return (
    <div className={className}>
      {label && <label htmlFor={selectId} className="mb-1 block text-xs font-semibold text-charcoal-lighter">{label}</label>}
      <div className="relative flex items-center">
        <select
          id={selectId}
          aria-invalid={!!error}
          className={`h-10 w-full appearance-none rounded-lg border ${filled ? 'bg-warm-100' : 'bg-white'} pr-9 pl-3 text-sm focus:outline-2 focus:outline-teal ${error ? 'border-danger' : 'border-warm-200'}`}
          {...rest}
        >
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Icon name="expand_more" className="pointer-events-none absolute right-2 text-charcoal-muted" />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
