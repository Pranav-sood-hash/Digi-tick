import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { storesApi, listsApi } from '../services/api';
import { NearbyStore, StoreDiscoveryResponse, ShoppingList } from '../types';
import { StoreCard } from '../components/stores/StoreCard';
import { InteractiveMap } from '../components/stores/InteractiveMap';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useToast } from '../context/ToastContext';
import {
  Navigation,
  Compass,
  AlertCircle,
  ShoppingBag,
  RefreshCw,
  Plus,
  Loader2,
  CheckCircle2
} from 'lucide-react';

type LocationStatus = 'idle' | 'detecting' | 'granted' | 'denied' | 'unavailable';

export const NearbyStoresPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialListId = searchParams.get('list_id') || '';
  const { error, success } = useToast();

  const [listsLoading, setListsLoading] = useState(true);
  const [activeLists, setActiveLists] = useState<ShoppingList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>(initialListId);
  const [storesData, setStoresData] = useState<StoreDiscoveryResponse | null>(null);
  const [selectedStore, setSelectedStore] = useState<NearbyStore | null>(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [userCoords, setUserCoords] = useState<{ lat?: number; lng?: number }>({});
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
  const [locationErrorMessage, setLocationErrorMessage] = useState<string>('');
  const [storesLoading, setStoresLoading] = useState(false);

  // 1. Fetch active shopping lists to verify user has unpurchased items
  const loadActiveLists = useCallback(async () => {
    setListsLoading(true);
    try {
      const lists = await listsApi.getLists('active');
      // Only keep lists that have at least 1 pending item
      const listsWithPendingItems = lists.filter(
        (l) => (l.total_items - l.completed_items) > 0
      );
      setActiveLists(listsWithPendingItems);

      // If URL had a list_id, check if it's valid with pending items
      if (initialListId && listsWithPendingItems.some((l) => l.id === initialListId)) {
        setSelectedListId(initialListId);
      } else if (listsWithPendingItems.length > 0) {
        setSelectedListId(listsWithPendingItems[0].id);
      }
    } catch (err: any) {
      error(err.message || 'Failed to check active shopping lists');
    } finally {
      setListsLoading(false);
    }
  }, [initialListId, error]);

  useEffect(() => {
    loadActiveLists();
  }, [loadActiveLists]);

  // Fetch store recommendations
  const fetchStores = useCallback(
    async (params: {
      listId?: string;
      lat?: number;
      lng?: number;
      query?: string;
    }) => {
      setStoresLoading(true);
      try {
        const data = await storesApi.getNearby(params);
        setStoresData(data);
        if (data.stores.length > 0) {
          setSelectedStore(data.stores[0]);
        } else {
          setSelectedStore(null);
        }
      } catch (err: any) {
        error(err.message || 'Failed to locate nearby stores');
      } finally {
        setStoresLoading(false);
      }
    },
    [error]
  );

  // 2. Accurate Current Location Detection
  const detectCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      setLocationErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('detecting');
    setLocationErrorMessage('');

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });
        setLocationStatus('granted');
        setLocationErrorMessage('');

        // Cache coordinates in sessionStorage
        try {
          sessionStorage.setItem(
            'digitick_cached_coords',
            JSON.stringify({ lat, lng, timestamp: Date.now() })
          );
        } catch {}

        success('Current location detected successfully!');
        fetchStores({ listId: selectedListId, lat, lng });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocationStatus('denied');
          setLocationErrorMessage(
            'Location access is required to find nearby stores. Please enable location permission in your browser settings.'
          );
        } else if (err.code === err.POSITION_UNAVAILABLE || err.code === err.TIMEOUT) {
          setLocationStatus('unavailable');
          setLocationErrorMessage(
            'Unable to determine your current location. Please check your device location services and try again.'
          );
        } else {
          setLocationStatus('unavailable');
          setLocationErrorMessage(
            'Unable to determine your current location. Please check your device location services and try again.'
          );
        }
      },
      geoOptions
    );
  }, [selectedListId, fetchStores, success]);

  // When active lists are confirmed, initialize location or load cached
  useEffect(() => {
    if (listsLoading || activeLists.length === 0) return;

    // Check if we have valid cached coordinates (< 5 min old)
    try {
      const cached = sessionStorage.getItem('digitick_cached_coords');
      if (cached) {
        const parsed = JSON.parse(cached);
        const isFresh = Date.now() - parsed.timestamp < 300000;
        if (isFresh && parsed.lat && parsed.lng) {
          setUserCoords({ lat: parsed.lat, lng: parsed.lng });
          setLocationStatus('granted');
          fetchStores({ listId: selectedListId, lat: parsed.lat, lng: parsed.lng });
          return;
        }
      }
    } catch {}

    // Check permission state if Permissions API is available
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            detectCurrentLocation();
          } else if (permissionStatus.state === 'prompt') {
            detectCurrentLocation();
          } else {
            setLocationStatus('denied');
            setLocationErrorMessage(
              'Location access is required to find nearby stores. Please enable location permission in your browser settings.'
            );
          }
        })
        .catch(() => {
          detectCurrentLocation();
        });
    } else {
      detectCurrentLocation();
    }
  }, [listsLoading, activeLists.length, selectedListId, detectCurrentLocation, fetchStores]);

  // When user switches selected list
  const handleListChange = (newListId: string) => {
    setSelectedListId(newListId);
    if (userCoords.lat && userCoords.lng) {
      fetchStores({ listId: newListId, lat: userCoords.lat, lng: userCoords.lng });
    } else if (locationQuery.trim()) {
      fetchStores({ listId: newListId, query: locationQuery.trim() });
    } else {
      fetchStores({ listId: newListId });
    }
  };

  // Manual query search
  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationQuery.trim()) return;
    fetchStores({ listId: selectedListId, query: locationQuery.trim() });
  };

  // ----------------------------------------------------
  // CASE 1: USER HAS NO ACTIVE SHOPPING LIST WITH ITEMS
  // ----------------------------------------------------
  if (!listsLoading && activeLists.length === 0) {
    return (
      <div className="space-y-6 max-w-xl mx-auto animate-fadeIn py-12">
        <div className="p-8 md:p-12 text-center rounded-3xl bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-nature-mint dark:bg-darknature-mint text-nature-forest dark:text-darknature-highlight flex items-center justify-center mx-auto mb-4 border border-nature-border dark:border-darknature-border">
            <ShoppingBag className="w-8 h-8" />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight mb-2">
            Your shopping list is empty!
          </h2>

          <p className="text-xs md:text-sm text-nature-muted dark:text-darknature-muted mb-6 max-w-md mx-auto leading-relaxed">
            Create your shopping list first so Digitick can find nearby stores that match your shopping requirements.
          </p>

          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/lists')}
          >
            Create Shopping List
          </Button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // CASE 2: USER HAS ACTIVE LIST(S)
  // ----------------------------------------------------
  const stores = storesData?.stores || [];

  return (
    <div className="space-y-5 animate-fadeIn pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-1.5 text-nature-forest dark:text-darknature-highlight text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5 text-nature-primary dark:text-darknature-primary" />
            <span>Store Discovery Engine</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
            Nearby Stores & Grocers
          </h2>
          <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
            Locate neighborhood stores intelligently matched against your unpurchased grocery items.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          loading={locationStatus === 'detecting'}
          icon={
            locationStatus === 'detecting' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-nature-primary dark:text-darknature-primary" />
            )
          }
          onClick={detectCurrentLocation}
        >
          {locationStatus === 'detecting' ? 'Detecting...' : 'Refresh My Location'}
        </Button>
      </div>

      {/* Detecting Location Banner */}
      {locationStatus === 'detecting' && (
        <div className="p-3.5 rounded-xl bg-nature-mint dark:bg-darknature-mint border border-nature-border dark:border-darknature-border text-xs text-nature-forest dark:text-darknature-highlight flex items-center space-x-2.5">
          <Loader2 className="w-4 h-4 animate-spin text-nature-primary" />
          <span className="font-semibold">Detecting your location...</span>
        </div>
      )}

      {/* Permission Denied Banner */}
      {locationStatus === 'denied' && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{locationErrorMessage}</span>
          </div>
          <Button variant="outline" size="sm" onClick={detectCurrentLocation}>
            Try Again
          </Button>
        </div>
      )}

      {/* Location Unavailable Banner */}
      {locationStatus === 'unavailable' && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{locationErrorMessage}</span>
          </div>
          <Button variant="outline" size="sm" onClick={detectCurrentLocation}>
            Try Again
          </Button>
        </div>
      )}

      {/* Mandatory Category-Based Suggestions Disclaimer */}
      <DisclaimerBanner
        type="info"
        title="Category-Based Product Suggestions Only"
        message="These suggestions are based on store categories. Actual product availability may vary. Please contact the store to confirm."
      />

      {/* Filter and Location Controls */}
      <div className="p-3.5 rounded-2xl bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Match against shopping list */}
        <div className="flex-1">
          <label className="text-[11px] font-semibold text-nature-forest dark:text-darknature-highlight block mb-1">
            Match Store Recommendations Against:
          </label>
          <select
            value={selectedListId}
            onChange={(e) => handleListChange(e.target.value)}
            className="w-full text-xs font-semibold rounded-lg bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border px-3 py-2 outline-none focus:border-nature-primary text-nature-text dark:text-darknature-text"
          >
            {activeLists.map((l) => {
              const pendingCount = l.total_items - l.completed_items;
              return (
                <option key={l.id} value={l.id}>
                  {l.title} ({pendingCount} pending {pendingCount === 1 ? 'item' : 'items'})
                </option>
              );
            })}
          </select>
        </div>

        {/* Manual Location Search */}
        <form onSubmit={handleManualSearch} className="flex-1 flex items-end gap-2">
          <div className="flex-1">
            <label className="text-[11px] font-semibold text-nature-forest dark:text-darknature-highlight block mb-1">
              Manual Location / Neighborhood:
            </label>
            <Input
              placeholder="e.g. Downtown, Central Market"
              value={locationQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary" size="md">
            Search
          </Button>
        </form>
      </div>

      {/* Interactive Map Canvas */}
      <InteractiveMap
        stores={stores}
        selectedStore={selectedStore}
        onSelectStore={(st) => setSelectedStore(st)}
        userLat={storesData?.user_lat}
        userLng={storesData?.user_lng}
        isLiveGoogleMaps={storesData?.is_live_google_maps}
      />

      {/* Store Cards Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-nature-forest dark:text-darknature-text tracking-tight">
            Matching Stores ({stores.length})
          </h3>
          {locationStatus === 'granted' && userCoords.lat && (
            <span className="text-[11px] font-semibold text-nature-primary dark:text-darknature-highlight flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> GPS Coordinates Active
            </span>
          )}
        </div>

        {storesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-nature-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                isSelected={selectedStore?.id === store.id}
                onSelect={(st) => setSelectedStore(st)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-nature-white dark:bg-darknature-card border border-dashed border-nature-border dark:border-darknature-border text-nature-muted text-xs space-y-2">
            <p className="font-semibold text-nature-text dark:text-darknature-text">
              No matching stores found for the current items.
            </p>
            <p>
              Stores are filtered strictly by your shopping list requirements. Try selecting a different list or expanding your search radius.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
