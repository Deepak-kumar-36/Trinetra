import { createClient } from '@supabase/supabase-js';

// Supabase Connection using the provided publishable URL and Anon Key
const supabaseUrl = 'https://ktoyfgxbfmnhdqktyfcj.supabase.co';
const supabaseAnonKey = 'sb_publishable__aRkbsIitW_fCi-Z_G65lg_cn_ws9u3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
