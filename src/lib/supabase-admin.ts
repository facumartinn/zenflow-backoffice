import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dnncbdnpsbgpyazanjtu.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRubmNiZG5wc2JncHlhemFuanR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2NDc4MzksImV4cCI6MjA0ODIyMzgzOX0.qqQSlTA-hth9zEYurydJ10oqKOLQtgudUz65CIW4AMk';

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});