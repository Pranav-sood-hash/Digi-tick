import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  percentage?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  percentage,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const percent = percentage !== undefined ? percentage : total > 0 ? (current / total) * 100 : 0;
  const isComplete = percent >= 100 && total > 0;

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-medium text-nature-muted dark:text-darknature-muted">
            Shopping Progress:{' '}
            <strong className="text-nature-text dark:text-darknature-text font-semibold">
              {current}/{total} completed
            </strong>
          </span>
          <span
            className={`font-bold ${
              isComplete
                ? 'text-nature-primary dark:text-darknature-highlight'
                : 'text-nature-forest dark:text-darknature-primary'
            }`}
          >
            {Math.round(percent)}%
          </span>
        </div>
      )}
      <div
        className={`w-full bg-nature-border dark:bg-darknature-border rounded-md overflow-hidden ${heightClasses[size]}`}
      >
        <div
          className={`h-full rounded-md transition-all duration-200 ${
            isComplete
              ? 'bg-nature-forest dark:bg-darknature-highlight'
              : 'bg-nature-primary dark:bg-darknature-primary'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  );
};
