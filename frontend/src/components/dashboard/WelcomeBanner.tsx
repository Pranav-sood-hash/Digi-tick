import React from 'react';
import { Calendar, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WelcomeBanner: React.FC = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'there';

  return (
    <div className="bg-nature-white dark:bg-darknature-card rounded-2xl border border-nature-border dark:border-darknature-border p-5 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-nature-forest dark:text-darknature-highlight text-xs font-semibold uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1 bg-nature-mint dark:bg-darknature-mint px-2.5 py-0.5 rounded-md border border-nature-fresh/20 dark:border-darknature-border">
              <Calendar className="w-3 h-3 text-nature-primary dark:text-darknature-primary" />
              <span>{formattedDate}</span>
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
            {getGreeting()}, {firstName}!
          </h2>
          <p className="text-nature-muted dark:text-darknature-muted text-xs md:text-sm mt-1 max-w-xl font-normal leading-relaxed">
            Your household shopping organized simply and sustainably. Digitize paper lists, track pantry essentials, and discover nearby stores.
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-2 p-3 rounded-xl bg-nature-mint/60 dark:bg-darknature-mint/60 border border-nature-fresh/30 dark:border-darknature-border self-start">
          <Leaf className="w-5 h-5 text-nature-primary dark:text-darknature-highlight flex-shrink-0" />
          <div className="text-[11px] text-nature-forest dark:text-darknature-text">
            <span className="font-bold block">Paperless & Simple</span>
            <span className="text-nature-muted dark:text-darknature-muted">Zero waste grocery notes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
