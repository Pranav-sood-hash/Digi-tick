import React from 'react';
import { NearbyStore } from '../../types';
import { MapPin, Compass, Info } from 'lucide-react';

interface InteractiveMapProps {
  stores: NearbyStore[];
  selectedStore: NearbyStore | null;
  onSelectStore: (store: NearbyStore) => void;
  userLat?: number;
  userLng?: number;
  isLiveGoogleMaps?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stores,
  selectedStore,
  onSelectStore,
  userLat = 37.7749,
  userLng = -122.4194,
  isLiveGoogleMaps = false,
}) => {
  return (
    <div className="relative w-full h-[320px] md:h-[420px] bg-nature-offwhite dark:bg-darknature-sidebar rounded-2xl overflow-hidden border border-nature-border dark:border-darknature-border">
      {/* Flat Visual Radar Canvas */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5EAE6_1px,transparent_1px)] dark:bg-[radial-gradient(#304136_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center overflow-hidden">
        {/* Concentric distance rings */}
        <div className="absolute w-[180px] h-[180px] rounded-full border border-nature-border dark:border-darknature-border pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-nature-border dark:border-darknature-border pointer-events-none" />
        <div className="absolute w-[420px] h-[420px] rounded-full border border-nature-border dark:border-darknature-border pointer-events-none" />

        {/* Center: User Location */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-nature-mint dark:bg-darknature-mint border-2 border-nature-primary dark:border-darknature-primary flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-nature-forest dark:bg-darknature-highlight" />
          </div>
          <span className="text-[10px] font-bold text-nature-forest dark:text-darknature-text mt-1 bg-nature-white/90 dark:bg-darknature-card/90 px-2 py-0.5 rounded-md border border-nature-border dark:border-darknature-border">
            You Are Here
          </span>
        </div>

        {/* Store Pins placed relative to distance/index */}
        {stores.map((store, idx) => {
          const angle = (idx * (360 / Math.max(1, stores.length)) * Math.PI) / 180;
          const radius = Math.min(160, Math.max(55, store.distance_km * 80));
          const offsetX = Math.cos(angle) * radius;
          const offsetY = Math.sin(angle) * radius;
          const isSelected = selectedStore?.id === store.id;

          return (
            <div
              key={store.id}
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px)`,
              }}
              className="absolute z-20 transition-all duration-200"
            >
              <button
                onClick={() => onSelectStore(store)}
                className={`flex flex-col items-center cursor-pointer transition-transform duration-150 ${
                  isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-nature-primary text-white border-nature-forest dark:bg-darknature-primary dark:text-darknature-bg'
                      : 'bg-nature-white dark:bg-darknature-card text-nature-forest dark:text-darknature-text border-nature-border dark:border-darknature-border hover:border-nature-primary'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 fill-current" />
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 whitespace-nowrap border ${
                    isSelected
                      ? 'bg-nature-forest text-white border-nature-forest dark:bg-darknature-primary dark:text-darknature-bg'
                      : 'bg-nature-white dark:bg-darknature-card text-nature-text dark:text-darknature-text border-nature-border dark:border-darknature-border'
                  }`}
                >
                  {store.name} ({store.distance_km}km)
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Status & Category Badges */}
      <div className="absolute top-3 left-3 z-30">
        <div className="flex items-center space-x-2 bg-nature-white/95 dark:bg-darknature-card/95 px-3 py-1.5 rounded-xl border border-nature-border dark:border-darknature-border text-xs">
          <Compass className="w-3.5 h-3.5 text-nature-primary dark:text-darknature-primary" />
          <span className="font-semibold text-nature-forest dark:text-darknature-text">
            {stores.length} Nearby Grocery & Household Stores
          </span>
        </div>
      </div>

      {/* Maps Key Status Notification */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between">
        <div className="text-[11px] text-nature-muted dark:text-darknature-muted bg-nature-white/90 dark:bg-darknature-card/90 px-2.5 py-1 rounded-lg border border-nature-border dark:border-darknature-border flex items-center gap-1.5">
          <Info className="w-3 h-3 text-nature-forest dark:text-darknature-highlight" />
          <span>
            {isLiveGoogleMaps
              ? 'Google Maps Places Connected'
              : 'Flat Store Discovery Radar active. Set VITE_GOOGLE_MAPS_API_KEY for live satellite tiles.'}
          </span>
        </div>
      </div>
    </div>
  );
};
