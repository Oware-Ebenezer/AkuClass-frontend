import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'surface' | 'icon';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; }

const styles: Record<Variant, string> = {
  primary: 'h-10 px-4 bg-orange text-charcoal font-semibold shadow-sm hover:bg-orange-light',
  secondary: 'h-10 px-4 bg-warm-100 text-charcoal font-medium hover:bg-warm-200',
  surface: 'h-9 px-3 bg-white text-charcoal font-medium shadow-sm hover:bg-warm-100',
  icon: 'size-9 justify-center bg-white text-charcoal-muted shadow-sm hover:bg-warm-100 hover:text-charcoal',
};

export const Button = ({ variant = 'secondary', className = '', type = 'button', ...rest }: ButtonProps) =>{
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-2 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${styles[variant]} ${className}`}
      {...rest}
    />
  );
}
