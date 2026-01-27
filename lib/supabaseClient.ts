import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('✅ SUPABASE CLIENT URL:', url);
console.log('✅ SUPABASE KEY STARTS WITH:', key?.slice(0, 12));

export const supabase = createClient(url, key);
