import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full flex flex-col space-y-1">
        {label && (
          <label className="text-xs font-semibold text-nature-forest dark:text-darknature-highlight tracking-tight">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-nature-muted dark:text-darknature-muted pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={effectiveType}
            className={`w-full text-sm rounded-xl bg-nature-white dark:bg-darknature-card border transition-colors duration-150 outline-none text-nature-text dark:text-darknature-text placeholder-nature-muted/70 dark:placeholder-darknature-muted/70 shadow-none ${
              icon ? 'pl-9' : 'pl-3.5'
            } ${
              isPassword ? 'pr-10 py-2' : 'pr-3.5 py-2'
            } ${
              error
                ? 'border-rose-400 dark:border-rose-600 focus:ring-1 focus:ring-rose-400'
                : 'border-nature-border dark:border-darknature-border focus:border-nature-primary dark:focus:border-darknature-primary focus:ring-1 focus:ring-nature-primary/20'
            } ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-nature-muted hover:text-nature-forest dark:hover:text-darknature-text focus:outline-none transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 stroke-[1.8]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[1.8]" />
              )}
            </button>
          )}
        </div>
        {error && <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</span>}
        {helperText && !error && (
          <span className="text-[11px] text-nature-muted dark:text-darknature-muted">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
