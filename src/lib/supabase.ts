import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase URL and/or Anon Key are missing. Please check your environment variables.'
  );
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);