import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// These variables would normally come from environment variables
// For demo purposes, we're using placeholders that will be replaced when connecting to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);