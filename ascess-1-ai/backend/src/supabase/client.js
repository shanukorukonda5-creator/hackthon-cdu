import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';

if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  console.warn('⚠️ Supabase credentials not fully configured in environment variables.');
}

// Public client for standard operations
export const supabasePublic = createClient(
  config.supabase.url || 'https://placeholder.supabase.co',
  config.supabase.anonKey || 'placeholder-anon-key'
);

// Admin client for backend bypass operations (Service Role)
export const supabaseAdmin = createClient(
  config.supabase.url || 'https://placeholder.supabase.co',
  config.supabase.serviceRoleKey || 'placeholder-service-role-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export default supabaseAdmin;
