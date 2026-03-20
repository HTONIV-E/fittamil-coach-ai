import { AIPlan, DailyData } from '@/types/fitness';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Check } from 'lucide-react';

interface TodaysMealsProps {
  plan: AIPlan;
  daily: DailyData;
  onToggleMeal: (id: string) => void;
  onToggleHabit: (habit: string) => void;
}

export function TodaysMeals({ plan, daily, onToggleMeal, onToggleHabit }: TodaysMealsProps) {
  const checkedCount = Object.values(daily.meals).filter(Boolean).length;
  const caloriesConsumed = plan.meals
    .filter(m => daily.meals[m.id])
    .reduce((s, m) => s + m.calories, 0);

  return (
    <div className="space-y-5 animate-fade-up">
      <ProgressBar value={caloriesConsumed} max={plan.dailyCalories}
        label="Calories" showValue variant="success" />

      <div className="text-sm text-muted-foreground">
        {checkedCount}/{plan.meals.length} meals completed
      </div>

      <div className="space-y-3">
        {plan.meals.map(meal => (
          <button key={meal.id}
            onClick={() => onToggleMeal(meal.id)}
            className={`w-full ft-card flex items-start gap-3 text-left transition-all active:scale-[0.98] ${daily.meals[meal.id] ? 'border-accent/50 bg-accent/5' : ''}`}>
            <div className={`mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${daily.meals[meal.id] ? 'border-accent bg-accent' : 'border-border'}`}>
              {daily.meals[meal.id] && <Check className="h-3.5 w-3.5 text-background" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <span className="font-medium">{meal.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{meal.time}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">{meal.foods}</div>
              <div className="font-mono text-xs text-ft-cyan mt-1">{meal.calories} kcal</div>
            </div>
          </button>
        ))}
      </div>

      {/* Daily Habits */}
      <div className="mt-6">
        <h3 className="font-heading text-xl mb-3">Daily Habits</h3>
        {Object.entries(plan.dailyHabits).map(([period, habits]) => (
          <div key={period} className="mb-4">
            <div className="text-xs font-semibold uppercase text-muted-foreground tracking-widest mb-2 capitalize">{period}</div>
            {habits.map(habit => (
              <button key={habit} onClick={() => onToggleHabit(habit)}
                className={`w-full flex items-center gap-3 py-2 text-left text-sm transition-colors ${daily.habitsDone.includes(habit) ? 'text-accent' : 'text-foreground/70'}`}>
                <div className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 ${daily.habitsDone.includes(habit) ? 'border-accent bg-accent' : 'border-border'}`}>
                  {daily.habitsDone.includes(habit) && <Check className="h-3 w-3 text-background" />}
                </div>
                {habit}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
