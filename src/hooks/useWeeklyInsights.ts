import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WeeklyInsight {
  summary: string;
  score: number;
  strengths: string[];
  improvements: string[];
  tip: string;
  tamilQuote: { ta: string; en: string };
}

export function useWeeklyInsights() {
  const [insights, setInsights] = useState<WeeklyInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = useCallback(async (params: {
    profile: any; weekMeals: Record<string, number>;
    workoutHistory: Record<string, string[]>; streak: number;
    bmiHistory: any[]; plan: any;
  }) => {
    // Cache: only fetch once per week (Sunday)
    const weekKey = `ftai_weekly_${new Date().toISOString().split('T')[0]}`;
    const cached = localStorage.getItem(weekKey);
    if (cached) {
      try { setInsights(JSON.parse(cached)); return; } catch { /* ignore */ }
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('weekly-insights', {
        body: params,
      });
      if (error) throw error;
      if (data?.insights) {
        setInsights(data.insights);
        localStorage.setItem(weekKey, JSON.stringify(data.insights));
      }
    } catch (e) {
      console.error('Weekly insights error:', e);
      toast.error('Could not fetch weekly insights');
    } finally {
      setLoading(false);
    }
  }, []);

  return { insights, loading, fetchInsights };
}
