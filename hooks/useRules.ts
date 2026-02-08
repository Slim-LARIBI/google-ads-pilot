'use client';

import { useCallback, useEffect, useState } from 'react';
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

export type RulePayload = {
  name: string;
  description: string | null;
  metric: string;
  operator: string;
  threshold: number;
  action_type: string;
  priority: 'P0' | 'P1' | 'P2';
};

export function useRules(channel: 'sea' | 'seo' | 'meta') {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('rules')
      .select('*')
      .eq('channel', channel);

    if (error) {
      setError(error.message);
      setRules([]);
    } else {
      setRules((data ?? []) as Rule[]);
    }

    setLoading(false);
  }, [channel]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  async function createRule(payload: RulePayload) {
    setError(null);

    const { error } = await supabase.from('rules').insert({
      channel,
      ...payload,
      is_active: true,
    });

    if (error) {
      setError(error.message);
      return false;
    }

    await fetchRules();
    return true;
  }

  async function updateRule(id: string, payload: RulePayload) {
    setError(null);

    const { error } = await supabase
      .from('rules')
      .update({
        ...payload,
      })
      .eq('id', id);

    if (error) {
      setError(error.message);
      return false;
    }

    await fetchRules();
    return true;
  }

  async function toggleActive(id: string, nextActive: boolean) {
    setError(null);

    const { error } = await supabase
      .from('rules')
      .update({ is_active: nextActive })
      .eq('id', id);

    if (error) {
      setError(error.message);
      return false;
    }

    await fetchRules();
    return true;
  }

  async function deleteRule(id: string) {
    setError(null);

    const { error } = await supabase.from('rules').delete().eq('id', id);

    if (error) {
      setError(error.message);
      return false;
    }

    await fetchRules();
    return true;
  }

  return {
    rules,
    loading,
    error,
    refetch: fetchRules,
    createRule,
    updateRule,
    toggleActive,
    deleteRule,
  };
}