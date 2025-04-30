import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.config';

const supabaseUrl = env.supabase.url;
const supabaseKey = env.supabase.key;

export const supabaseClient = createClient(supabaseUrl, supabaseKey);
