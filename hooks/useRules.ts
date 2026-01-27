'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type Rule = {
  id: string;
  channel: 'sea' | 'seo' | 'meta';
  name: string;
  description: string | null;
  metric: string;
  operator: string;
  threshold: number;
  action_type: string;
  priority: 'P0' | 'P1' | 'P2';
  is_active: boolean;
};

export function useRules(channel: 'sea' | 'seo' | 'meta') {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRules() {
      setLoading(true);
      setError(null);

      // 🔎 DEBUG PROPRE (tu peux les garder)
      console.log('🔵 useRules → channel:', channel);
      console.log(
        '🔑 SUPABASE URL:',
        process.env.NEXT_PUBLIC_SUPABASE_URL
      );
      console.log(
        '🔑 ANON KEY exists:',
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase
        .from('rules')
        .select('*')
        .eq('channel', channel)
        .order('priority', { ascending: true });

      if (error) {
        console.error('❌ Supabase error:', error);
        setRules([]);
        setError(error.message);
      } else {
        console.log('✅ Rules fetched:', data);
        setRules((data ?? []) as Rule[]);
      }

      setLoading(false);
    }

    fetchRules();
  }, [channel]);

  return { rules, loading, error };
}
