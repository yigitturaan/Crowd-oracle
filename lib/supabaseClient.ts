import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Build sırasında hata vermemesi için placeholder değerler kullanılıyor
// Runtime'da environment variable'lar kontrol edilecek
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

