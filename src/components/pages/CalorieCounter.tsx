import { useState } from 'react';
import { TAMIL_FOODS, DailyData, AIPlan } from '@/types/fitness';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Search, Plus, Trash2 } from 'lucide-react';

interface CalorieCounterProps {
  plan: AIPlan;
  daily: DailyData;
  onAddFood: (name: string, calories: number) => void;
  onRemoveFood: (index: number) => void;
}

export function CalorieCounter({ plan, daily, onAddFood, onRemoveFood }: CalorieCounterProps) {
  const [search, setSearch] = useState('');
  const total = daily.foodLog.reduce((s, f) => s + f.calories, 0);

  const filtered = TAMIL_FOODS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-up">
      <ProgressBar value={total} max={plan.dailyCalories}
        label="Daily Calories" showValue
        variant={total > plan.dailyCalories ? 'alert' : 'success'} />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search Tamil foods..."
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Food List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {filtered.map(food => (
          <button key={food.name}
            onClick={() => onAddFood(food.name, food.calories)}
            className="w-full ft-card flex items-center justify-between text-left active:scale-[0.98]">
            <span className="text-sm font-medium">{food.name}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{food.calories} kcal</span>
              <Plus className="h-4 w-4 text-ft-cyan" />
            </div>
          </button>
        ))}
      </div>

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
