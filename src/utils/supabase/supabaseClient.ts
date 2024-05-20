import { createClient, SupabaseClient } from "@supabase/supabase-js";


// // Use your own Supabase environment variables
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const supabase = createClient(supabaseUrl, supabaseKey);

// // utils/supabase.js
export async function getSupabaseCredentials() {
    const response = await fetch('https://test-pfe.vercel.app/api/supabase-credentials');
    if (!response.ok) {
      throw new Error('Failed to fetch Supabase credentials');
    }
    return response.json();
  }
  
  export async function getSupabaseClient() {
    const { url, key } = await getSupabaseCredentials();
  
    if (!url || !key) {
      throw new Error('Supabase URL or anonymous key is missing!');
    }
  
    return createClient(url, key);
  }

