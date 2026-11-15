import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-colors duration-150 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-nature-primary/30 disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-nature-primary hover:bg-nature-forest text-white dark:bg-darknature-primary dark:hover:bg-nature-primary dark:text-darknature-bg border border-transparent shadow-none font-semibold',
    secondary:
      'bg-nature-white dark:bg-darknature-card border border-nature-primary dark:border-darknature-primary text-nature-forest dark:text-darknature-highlight hover:bg-nature-mint dark:hover:bg-darknature-mint shadow-none font-semibold',
    outline:
      'bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border text-nature-text dark:text-darknature-text hover:bg-nature-offwhite dark:hover:bg-darknature-sidebar hover:border-nature-primary/50 shadow-none',
    ghost:
      'bg-transparent hover:bg-nature-offwhite dark:hover:bg-darknature-sidebar text-nature-muted dark:text-darknature-muted hover:text-nature-text dark:hover:text-darknature-text border border-transparent',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-700 dark:hover:bg-rose-800 border border-transparent shadow-none',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
