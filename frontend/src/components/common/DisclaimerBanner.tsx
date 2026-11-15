import React from 'react';
import { Info, AlertCircle } from 'lucide-react';

interface DisclaimerBannerProps {
  type?: 'info' | 'warning';
  title?: string;
  message?: string;
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  type = 'info',
  title = 'Category-Based Product Suggestions',
  message = 'Product suggestions are mapped from store business categories (e.g. Produce, Dairy). Actual in-store stock, specific brands, and real-time inventory cannot be guaranteed by Google Maps. Digitick does not track live merchant inventory.',
  className = '',
}) => {
  return (
    <div
      className={`flex items-start space-x-3 p-3.5 rounded-xl border text-xs leading-relaxed ${
        type === 'warning'
          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200'
          : 'bg-nature-mint dark:bg-darknature-mint border-nature-border dark:border-darknature-border text-nature-forest dark:text-darknature-highlight'
      } ${className}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {type === 'warning' ? (
          <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
        ) : (
          <Info className="w-4 h-4 text-nature-forest dark:text-darknature-highlight" />
        )}
      </div>
      <div>
        {title && <span className="font-bold block mb-0.5">{title}</span>}
        <span className="opacity-95">{message}</span>
      </div>
    </div>
  );
};
