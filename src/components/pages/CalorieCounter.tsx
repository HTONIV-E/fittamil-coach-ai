import { useState, useCallback } from 'react';
import { TAMIL_FOODS, DailyData, AIPlan } from '@/types/fitness';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Search, Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CalorieCounterProps {
  plan: AIPlan;
  daily: DailyData;
  onAddFood: (name: string, calories: number) => void;
  onRemoveFood: (index: number) => void;
}

interface FoodResult {
  name: string;
  calories: number;
  serving?: string;
}

export function CalorieCounter({ plan, daily, onAddFood, onRemoveFood }: CalorieCounterProps) {
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [aiResults, setAiResults] = useState<FoodResult[]>([]);
  const [searched, setSearched] = useState(false);
  const total = daily.foodLog.reduce((s, f) => s + f.calories, 0);

  // Local filter for quick results
  const localFiltered = search.length > 0
    ? TAMIL_FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const searchOnline = useCallback(async () => {
    if (!search.trim() || search.length < 2) return;
    setSearching(true);
    setSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-food', {
        body: { query: search, type: 'food' },
      });
      if (error) throw error;
      setAiResults(data?.results || []);
    } catch (e) {
      console.error('Food search failed:', e);
      toast.error('Search failed, showing local results');
      setAiResults([]);
    } finally {
      setSearching(false);
    }
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') searchOnline();
  };

  const displayFoods = searched && aiResults.length > 0 ? aiResults : localFiltered;

  return (
    <div className="space-y-5 animate-fade-up">
      <ProgressBar value={total} max={plan.dailyCalories}
        label={`${total} / ${plan.dailyCalories} kcal`} showValue
        variant={total > plan.dailyCalories ? 'alert' : 'success'} />

      {/* Search */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text" value={search}
            onChange={e => { setSearch(e.target.value); setSearched(false); setAiResults([]); }}
            onKeyDown={handleKeyDown}
            placeholder="Search any food (press Enter for AI search)..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
          />
        </div>
        {search.length >= 2 && (
          <button onClick={searchOnline} disabled={searching}
            className="w-full gradient-primary text-background rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
            {searching ? <><Loader2 className="h-4 w-4 animate-spin" /> Searching...</> : '🔍 Search Online for Calories'}
          </button>
        )}
      </div>

      {/* Food List */}
      {searching && (
        <div className="text-center py-6 text-muted-foreground text-sm">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Searching nutrition database...
        </div>
      )}

      {!searching && displayFoods.length > 0 && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {searched && <p className="text-xs text-muted-foreground">AI Results — tap to add</p>}
          {displayFoods.map((food, i) => (
            <button key={`${food.name}-${i}`}
              onClick={() => { onAddFood(food.name, food.calories); toast.success(`Added ${food.name}`); }}
              className="w-full ft-card flex items-center justify-between text-left active:scale-[0.98]">
              <div>
                <span className="text-sm font-medium">{food.name}</span>
                {'serving' in food && food.serving && (
                  <span className="text-xs text-muted-foreground ml-2">({food.serving})</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{food.calories} kcal</span>
                <Plus className="h-4 w-4 text-ft-cyan" />
              </div>
            </button>
          ))}
        </div>
      )}

      {!searching && search.length > 0 && displayFoods.length === 0 && !searched && (
        <p className="text-center text-sm text-muted-foreground py-4">No local matches. Press Enter or tap Search Online.</p>
      )}

      {/* Quick Tamil Foods when empty */}
      {!search && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Quick Add — Common Tamil Foods</p>
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {TAMIL_FOODS.slice(0, 10).map(food => (
              <button key={food.name}
                onClick={() => { onAddFood(food.name, food.calories); toast.success(`Added ${food.name}`); }}
                className="w-full ft-card flex items-center justify-between text-left active:scale-[0.98]">
                <span className="text-sm font-medium">{food.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{food.calories} kcal</span>
                  <Plus className="h-4 w-4 text-ft-cyan" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Today's Log */}
      {daily.foodLog.length > 0 && (
        <div>
          <h3 className="font-heading text-xl mb-3">Today's Log</h3>
          <div className="space-y-2">
            {daily.foodLog.map((item, i) => (
              <div key={i} className="ft-card-secondary flex items-center justify-between">
                <div>
                  <span className="text-sm">{item.name}</span>
                  <span className="font-mono text-xs text-muted-foreground ml-2">{item.calories} kcal</span>
                </div>
                <button onClick={() => onRemoveFood(i)} className="text-destructive hover:bg-destructive/10 rounded p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 text-right font-mono text-sm">
            Total: <span className="text-ft-cyan font-bold">{total} kcal</span>
          </div>
        </div>
      )}
    </div>
  );
}
