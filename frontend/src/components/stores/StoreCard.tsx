import React from 'react';
import { NearbyStore } from '../../types';
import {
  Navigation,
  Phone,
  Globe,
  MapPin,
  Star,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';

interface StoreCardProps {
  store: NearbyStore;
  onSelect?: (store: NearbyStore) => void;
  isSelected?: boolean;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  onSelect,
  isSelected,
}) => {
  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`, '_blank');
  };

  return (
    <div
      onClick={() => onSelect && onSelect(store)}
      className={`p-4 rounded-2xl border transition-colors duration-150 cursor-pointer ${
        isSelected
          ? 'bg-nature-mint/40 dark:bg-darknature-mint/30 border-nature-primary dark:border-darknature-highlight'
          : 'bg-nature-white dark:bg-darknature-card border-nature-border dark:border-darknature-border hover:border-nature-primary/50 dark:hover:border-darknature-primary/50'
      }`}
    >
      {/* Header: Name, Distance & Rating */}
      <div className="flex items-start justify-between mb-1.5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-nature-forest dark:text-darknature-highlight">
            {store.category}
          </span>
          <h4 className="text-sm font-bold text-nature-text dark:text-darknature-text tracking-tight mt-0.5">
            {store.name}
          </h4>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-xs font-bold text-nature-forest dark:text-darknature-highlight block">
            {store.distance_km} km
          </span>
          <div className="flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold justify-end">
            <Star className="w-3 h-3 fill-current" />
            <span>{store.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Address & Status */}
      <p className="text-xs text-nature-muted dark:text-darknature-muted flex items-center gap-1.5 mb-2.5 line-clamp-1">
        <MapPin className="w-3 h-3 flex-shrink-0 text-nature-muted" />
        {store.address}
      </p>

      <div className="flex items-center space-x-3 text-[11px] font-medium text-nature-muted dark:text-darknature-muted mb-3">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
            store.open_now
              ? 'bg-nature-mint text-nature-forest dark:bg-darknature-mint dark:text-darknature-highlight'
              : 'bg-nature-offwhite text-nature-muted dark:bg-darknature-sidebar'
          }`}
        >
          <Clock className="w-3 h-3" />
          {store.open_now ? 'Open' : 'Closed'}
        </span>

        {store.phone && (
          <a
            href={`tel:${store.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-nature-text dark:hover:text-darknature-text flex items-center gap-1"
          >
            <Phone className="w-3 h-3" />
            <span>{store.phone}</span>
          </a>
        )}
      </div>

      {/* Category-based suggested items */}
      <div className="p-2.5 rounded-xl bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border mb-3">
        <div className="flex items-center justify-between text-[11px] font-semibold text-nature-forest dark:text-darknature-highlight mb-1.5">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-nature-primary dark:text-darknature-primary" />
            Relevant Shopping Items:
          </span>
          <span className="text-[10px] text-nature-muted dark:text-darknature-muted font-normal">(Category-Based)</span>
        </div>

        {store.suggested_items.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {store.suggested_items.map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border font-medium text-nature-text dark:text-darknature-text"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-nature-muted dark:text-darknature-muted italic">
            General grocery goods available. No specific active list items matched this specialty category.
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-nature-border dark:border-darknature-border">
        {store.website ? (
          <a
            href={store.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold text-nature-muted hover:text-nature-text dark:hover:text-darknature-text flex items-center gap-1"
          >
            <Globe className="w-3 h-3" />
            <span>Website</span>
          </a>
        ) : (
          <span />
        )}

        <Button
          variant="primary"
          size="sm"
          icon={<Navigation className="w-3 h-3" />}
          onClick={handleDirections}
        >
          Navigate
        </Button>
      </div>
    </div>
  );
};
