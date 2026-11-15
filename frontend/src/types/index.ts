export type ShoppingCategory =
  | 'Produce'
  | 'Dairy & Eggs'
  | 'Bakery'
  | 'Pantry & Staples'
  | 'Beverages'
  | 'Meat & Seafood'
  | 'Snacks'
  | 'Personal Care'
  | 'Household'
  | 'Other';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  auth_provider?: 'email' | 'google' | string;
  created_at: string;
  updated_at?: string;
}

export interface ShoppingItem {
  id: string;
  list_id: string;
  name: string;
  quantity: number;
  unit: string;
  category: ShoppingCategory;
  notes?: string;
  is_purchased: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ShoppingList {
  id: string;
  user_id: string;
  title: string;
  status: 'active' | 'completed' | 'archived';
  completed_at?: string;
  created_at: string;
  updated_at?: string;
  total_items: number;
  completed_items: number;
  progress_percent: number;
  items?: ShoppingItem[];
}

export interface ExtractedItem {
  name: string;
  quantity: number;
  unit: string;
  category: ShoppingCategory;
  notes?: string;
  confidence?: number;
}

export interface OCRScanResult {
  document_id: string;
  image_url: string;
  raw_text: string;
  items: ExtractedItem[];
  is_simulated: boolean;
  message: string;
}

export interface NearbyStore {
  id: string;
  name: string;
  category: string;
  address: string;
  distance_km: number;
  rating: number;
  open_now: boolean;
  phone?: string;
  website?: string;
  lat: number;
  lng: number;
  supported_categories: string[];
  suggested_items: string[];
}

export interface StoreDiscoveryResponse {
  location_query: string;
  user_lat?: number;
  user_lng?: number;
  stores: NearbyStore[];
  disclaimer: string;
  is_live_google_maps: boolean;
  configured?: boolean;
  message?: string;
}

export interface DashboardStats {
  total_lists: number;
  active_lists: number;
  completed_lists: number;
  total_items_purchased: number;
  completion_rate: number;
}

export interface ActivityItem {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  list_id?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  active_lists: ShoppingList[];
  recently_completed: ShoppingList[];
  recent_activity: ActivityItem[];
}

