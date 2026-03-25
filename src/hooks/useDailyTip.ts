import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DailyTip {
  tip: string;
  category: 'meals' | 'workout' | 'water' | 'motivation' | 'health';
}

export function useDailyTip(profile: any, dailySummary: string, planSummary: string) {
  const [tip, setTip] = useState<DailyTip | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile?.name) return;

    // Check if we already fetched today's tip
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `ftai_daily_tip_${today}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try { setTip(JSON.parse(cached)); return; } catch { /* ignore */ }
    }

    setLoading(true);
    supabase.functions.invoke('daily-tip', {
      body: { profile, dailySummary, planSummary },
    }).then(({ data, error }) => {
      if (!error && data?.tip) {
        setTip(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
    }).finally(() => setLoading(false));
  }, [profile?.name]);

  return { tip, loading };
}
