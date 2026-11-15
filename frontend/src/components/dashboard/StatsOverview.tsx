import React from 'react';
import { CheckSquare, ListOrdered, CheckCircle2, ShoppingBag } from 'lucide-react';
import { DashboardStats } from '../../types';

interface StatsOverviewProps {
  stats: DashboardStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Active Lists',
      value: stats.active_lists,
      icon: ListOrdered,
      color: 'text-nature-forest dark:text-darknature-highlight',
      bg: 'bg-nature-mint dark:bg-darknature-mint',
    },
    {
      label: 'Completed Trips',
      value: stats.completed_lists,
      icon: CheckCircle2,
      color: 'text-nature-primary dark:text-darknature-primary',
      bg: 'bg-nature-mint dark:bg-darknature-mint',
    },
    {
      label: 'Items Purchased',
      value: stats.total_items_purchased,
      icon: ShoppingBag,
      color: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-nature-mint dark:bg-darknature-mint',
    },
    {
      label: 'Total Lists',
      value: stats.total_lists,
      icon: CheckSquare,
      color: 'text-nature-forest dark:text-darknature-text',
      bg: 'bg-nature-mint dark:bg-darknature-mint',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="p-4 rounded-xl bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-nature-muted dark:text-darknature-muted">
                {item.label}
              </span>
              <div className={`p-1.5 rounded-lg ${item.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
            </div>
            <span className="text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
