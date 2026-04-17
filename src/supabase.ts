import { createClient } from '@supabase/supabase-js';

// Using environment variables if provided, otherwise falling back to the credentials provided by the user
let rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ttbfzdhyqccwhuksmgag.supabase.co';
// Remove trailing slashes which can cause "Failed to fetch" CORS/URL resolution issues
const supabaseUrl = rawUrl.replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_TUpIt9Hzz6da-VnmcHcf1A_4Ib7-HcJ';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

