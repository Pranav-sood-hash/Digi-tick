import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

function isValidSupabaseUrl(url: string): boolean {
  if (!url) return false;
  // Ignore template placeholders with square brackets
  if (url.includes('[') || url.includes(']') || url.includes('YOUR-PROJECT-REF')) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidSupabaseKey(key: string): boolean {
  if (!key) return false;
  if (key.includes('[') || key.includes(']') || key.includes('YOUR-ANON-KEY')) {
    return false;
  }
  return key.length > 20;
}

export const isSupabaseConfigured = isValidSupabaseUrl(rawUrl) && isValidSupabaseKey(rawKey);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(rawUrl, rawKey);
  } catch (err) {
    console.warn('Could not initialize Supabase client:', err);
    client = null;
  }
}

export const supabase = client;

