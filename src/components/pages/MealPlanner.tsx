import { useState } from 'react';
import { AIPlan, DailyData, Meal, UserProfile } from '@/types/fitness';
import { Check, BookOpen, RefreshCw, Loader2 } from 'lucide-react';
import { useMealSwap } from '@/hooks/useMealSwap';

interface MealPlannerProps {
  plan: AIPlan;
  daily: DailyData;
  profile: UserProfile;
  onToggleMeal: (id: string) => void;
  onSwapMeal?: (oldId: string, newMeal: Meal) => void;
  onNavigate?: (page: string, context?: string) => void;
}

export function MealPlanner({ plan, daily, profile, onToggleMeal, onSwapMeal, onNavigate }: MealPlannerProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayIndex = new Date().getDay();
  const todayName = days[(todayIndex + 6) % 7];
  const [selectedDay, setSelectedDay] = useState(todayName);
  const [crossedOff, setCrossedOff] = useState<Record<string, boolean>>({});
  const { swaps, loading: swapLoading, swappingMealId, fetchSwaps, clearSwaps } = useMealSwap();

  const isToday = selectedDay === todayName;
  const dayMeals = plan.weeklyMealPlan?.[selectedDay] || plan.meals || [];

  const allMeals = plan.weeklyMealPlan
    ? Object.values(plan.weeklyMealPlan).flat()
    : plan.meals || [];

  const groceryItems = Array.from(
    new Set(
      allMeals.map(m => m.foods).filter(Boolean).join(' + ')
        .split(/[+,]/).map(f => f.trim()).filter(Boolean)
    )
  );

  const toggleGrocery = (item: string) => {
    setCrossedOff(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const totalCalories = dayMeals.reduce((s, m) => s + (m.calories || 0), 0);

  const handleSwapSelect = (mealId: string, swap: any) => {
    const newMealObj: Meal = { id: mealId, name: swap.name, time: swap.time, calories: swap.calories, foods: swap.foods, done: false };
    onSwapMeal?.(mealId, newMealObj);
    clearSwaps();
  };

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {days.map(day => (
          <button key={day} onClick={() => setSelectedDay(day)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedDay === day ? 'gradient-primary text-background'
                : day === todayName ? 'border-2 border-primary/50 text-foreground'
                  : 'border border-border text-muted-foreground'
            }`}>
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="text-center">
        <h3 className="font-heading text-2xl">{selectedDay}</h3>
        {isToday && <span className="text-xs text-ft-cyan font-mono">TODAY</span>}
        <p className="font-mono text-sm text-muted-foreground mt-1">
          Total: <span className="text-ft-cyan">{totalCalories} kcal</span>
        </p>
      </div>

      {dayMeals.length > 0 ? (
        <div className="space-y-3">
          {dayMeals.map((meal, i) => (
            <div key={meal.id || i}>
              <div className={`ft-card transition-all ${isToday && daily.meals[meal.id] ? 'border-accent/50 bg-accent/5' : ''}`}>
                <div className="flex items-start gap-3">
                  {isToday && (
                    <button onClick={() => onToggleMeal(meal.id)}
                      className={`mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${daily.meals[meal.id] ? 'border-accent bg-accent' : 'border-border'}`}>
                      {daily.meals[meal.id] && <Check className="h-3.5 w-3.5 text-background" />}
                    </button>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-medium">{meal.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{meal.time}</span>
                        <button onClick={() => fetchSwaps(meal, profile)}
                          className="text-muted-foreground hover:text-ft-cyan" title="Swap meal">
                          {swapLoading && swappingMealId === meal.id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <RefreshCw className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{meal.foods}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-xs text-ft-cyan">{meal.calories} kcal</span>
                      <button onClick={() => onNavigate?.('recipes', meal.foods?.split(/[+,]/)?.[0]?.trim())}
                        className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <BookOpen className="h-3 w-3" /> Recipe
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {swappingMealId === meal.id && swaps.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">🔄 Swap Suggestions:</div>
                  {swaps.map((swap, si) => (
                    <button key={si} onClick={() => handleSwapSelect(meal.id, swap)}
                      className="w-full ft-card text-left hover:border-ft-cyan/50 transition-colors p-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-medium">{swap.name}</span>
                        <span className="font-mono text-xs text-ft-cyan">{swap.calories} kcal</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{swap.foods}</p>
                      <p className="text-xs text-ft-emerald mt-1">{swap.reason}</p>
                    </button>
                  ))}
                  <button onClick={clearSwaps} className="text-xs text-muted-foreground">Dismiss</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-4xl mb-3">🍽️</p>
          <h3 className="font-heading text-lg mb-1">No meals for {selectedDay}</h3>
          <p className="text-sm text-muted-foreground">Regenerate your plan to get a full weekly plan.</p>
        </div>
      )}

      {groceryItems.length > 0 && (
        <div className="ft-card">
          <h3 className="font-heading text-xl mb-3">🛒 Smart Grocery List</h3>
          <p className="text-xs text-muted-foreground mb-3">Tap items to cross off as you shop</p>
          <div className="space-y-2">
            {groceryItems.map((item, i) => (
              <button key={i} onClick={() => toggleGrocery(item)}
                className={`w-full flex items-center gap-3 text-left text-sm py-1.5 transition-all ${
                  crossedOff[item] ? 'line-through text-muted-foreground/50' : 'text-foreground'
                }`}>
                <div className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 ${
                  crossedOff[item] ? 'border-accent bg-accent' : 'border-border'
                }`}>
                  {crossedOff[item] && <Check className="h-3 w-3 text-background" />}
                </div>
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
