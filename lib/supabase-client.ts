import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or key is missing. Vector search functionality may not work correctly.');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
