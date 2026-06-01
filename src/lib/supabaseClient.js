import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;
let currentUrl = null;
let currentKey = null;

/**
 * Returns a initialized Supabase client, or creates a new one if URL/Key change.
 * Returns null if credentials are empty or invalid.
 */
export function getSupabaseClient(url, key) {
  if (!url || !key) {
    return null;
  }
  
  if (supabaseInstance && currentUrl === url && currentKey === key) {
    return supabaseInstance;
  }
  
  try {
    // Standard validation
    const parsedUrl = new URL(url);
    if (!parsedUrl.protocol.startsWith('http')) {
      return null;
    }
    
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: false // Turn off for admin tool usage
      }
    });
    currentUrl = url;
    currentKey = key;
    console.log("Supabase Client initialized successfully for:", url);
    return supabaseInstance;
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return null;
  }
}
