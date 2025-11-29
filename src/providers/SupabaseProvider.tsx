'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';
import { Database } from '@/types/supabase';
import { ReactNode } from 'react';

export default function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => 
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  return children;
}