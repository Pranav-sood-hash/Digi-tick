import React from 'react';
import { ShoppingCategory } from '../../types';
import {
  Apple,
  Milk,
  Croissant,
  Package,
  Coffee,
  Drumstick,
  Cookie,
  Sparkles,
  Home,
  Tag
} from 'lucide-react';

interface BadgeProps {
  category?: ShoppingCategory | string;
  status?: 'active' | 'completed' | 'archived' | 'pending' | string;
  size?: 'sm' | 'md';
  className?: string;
  children?: React.ReactNode;
}

export const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'Produce':
      return <Apple className="w-3 h-3 text-nature-forest dark:text-darknature-highlight" />;
    case 'Dairy & Eggs':
      return <Milk className="w-3 h-3 text-nature-primary dark:text-darknature-primary" />;
    case 'Bakery':
      return <Croissant className="w-3 h-3 text-amber-700 dark:text-amber-400" />;
    case 'Pantry & Staples':
      return <Package className="w-3 h-3 text-emerald-800 dark:text-emerald-300" />;
    case 'Beverages':
      return <Coffee className="w-3 h-3 text-teal-700 dark:text-teal-300" />;
    case 'Meat & Seafood':
      return <Drumstick className="w-3 h-3 text-rose-700 dark:text-rose-400" />;
    case 'Snacks':
      return <Cookie className="w-3 h-3 text-amber-600 dark:text-amber-300" />;
    case 'Personal Care':
      return <Sparkles className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />;
    case 'Household':
      return <Home className="w-3 h-3 text-slate-700 dark:text-slate-300" />;
    default:
      return <Tag className="w-3 h-3 text-nature-muted" />;
  }
};

export const Badge: React.FC<BadgeProps> = ({
  category,
  status,
  size = 'md',
  className = '',
  children,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  let colorClasses =
    'bg-nature-mint text-nature-forest dark:bg-darknature-mint dark:text-darknature-highlight border border-nature-border dark:border-darknature-border';

  if (category) {
    switch (category) {
      case 'Produce':
        colorClasses =
          'bg-nature-mint text-nature-forest dark:bg-darknature-mint dark:text-darknature-highlight border border-nature-fresh/30 dark:border-darknature-border';
        break;
      case 'Dairy & Eggs':
        colorClasses =
          'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40';
        break;
      case 'Bakery':
        colorClasses =
          'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40';
        break;
      case 'Pantry & Staples':
        colorClasses =
          'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700';
        break;
      case 'Beverages':
        colorClasses =
          'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/40';
        break;
      case 'Meat & Seafood':
        colorClasses =
          'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/40';
        break;
      case 'Snacks':
        colorClasses =
          'bg-lime-50 text-lime-800 dark:bg-lime-950/40 dark:text-lime-300 border border-lime-200/50 dark:border-lime-800/40';
        break;
      case 'Personal Care':
        colorClasses =
          'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40';
        break;
      case 'Household':
        colorClasses =
          'bg-nature-offwhite text-nature-text dark:bg-darknature-sidebar dark:text-darknature-text border border-nature-border dark:border-darknature-border';
        break;
      default:
        colorClasses =
          'bg-nature-offwhite text-nature-text dark:bg-darknature-sidebar dark:text-darknature-text border border-nature-border dark:border-darknature-border';
    }
  } else if (status) {
    switch (status) {
      case 'completed':
        colorClasses =
          'bg-nature-mint text-nature-forest dark:bg-darknature-mint dark:text-darknature-highlight border border-nature-primary/30 dark:border-darknature-border font-semibold';
        break;
      case 'active':
        colorClasses =
          'bg-nature-white text-nature-primary dark:bg-darknature-card dark:text-darknature-primary border border-nature-primary/40 dark:border-darknature-primary/40 font-semibold';
        break;
      case 'pending':
        colorClasses =
          'bg-nature-offwhite text-nature-muted dark:bg-darknature-sidebar dark:text-darknature-muted border border-nature-border dark:border-darknature-border';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-lg select-none ${sizeStyles[size]} ${colorClasses} ${className}`}
    >
      {category && getCategoryIcon(category)}
      {children || category || status}
    </span>
  );
};
