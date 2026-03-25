import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Meal, UserProfile } from '@/types/fitness';
import { toast } from 'sonner';

interface SwapOption {
  name: string;
  time: string;
  calories: number;
  foods: string;
  reason: string;
}

export function useMealSwap() {
  const [swaps, setSwaps] = useState<SwapOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [swappingMealId, setSwappingMealId] = useState<string | null>(null);

  const fetchSwaps = useCallback(async (meal: Meal, profile: UserProfile) => {
    setSwappingMealId(meal.id);
    setLoading(true);
    setSwaps([]);
    try {
      const { data, error } = await supabase.functions.invoke('meal-swap', {
        body: { meal, profile },
      });
      if (error) throw error;
      if (data?.swaps) {
        setSwaps(data.swaps);
      }
    } catch (e) {
      console.error('Meal swap error:', e);
      toast.error('Could not fetch swap suggestions');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSwaps = useCallback(() => {
    setSwaps([]);
    setSwappingMealId(null);
  }, []);

  return { swaps, loading, swappingMealId, fetchSwaps, clearSwaps };
}
