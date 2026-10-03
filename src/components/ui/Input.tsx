import type { InputHTMLAttributes } from 'react';
import { Icon } from './Icon';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; icon?: string; error?: string; filled?: boolean; }

export const Input = ({ label, icon, error, filled = false, id, className = '', ...rest }: InputProps ) => {
  const inputId = id ?? rest.name;
  return (
    <div className={className}>
      {label && <label htmlFor={inputId} className="mb-1 block text-xs font-semibold text-charcoal-lighter">{label}</label>}
      <div className="relative flex items-center">
        {icon && <Icon name={icon} className="pointer-events-none absolute left-3 text-charcoal-muted" />}
        <input
          id={inputId}
          aria-invalid={!!error}
          className={`h-10 w-full rounded-lg border ${filled ? 'bg-warm-100' : 'bg-white'} pr-3 text-sm placeholder:text-charcoal-muted focus:outline-2 focus:outline-teal ${icon ? 'pl-10' : 'pl-3'} ${error ? 'border-danger' : 'border-warm-200'}`}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
