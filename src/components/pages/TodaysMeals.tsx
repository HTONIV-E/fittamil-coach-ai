import { useState } from 'react';
import { AIPlan, DailyData, Meal } from '@/types/fitness';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Check, Plus, X, Edit2, BookOpen } from 'lucide-react';

interface TodaysMealsProps {
  plan: AIPlan;
  daily: DailyData;
  onToggleMeal: (id: string) => void;
  onToggleHabit: (habit: string) => void;
  onAddCustomMeal?: (meal: Meal) => void;
  onRemoveCustomMeal?: (id: string) => void;
  onEditMeal?: (id: string, updates: Partial<Meal>) => void;
  onNavigate?: (page: string, context?: string) => void;
}

export function TodaysMeals({ plan, daily, onToggleMeal, onToggleHabit, onAddCustomMeal, onRemoveCustomMeal, onEditMeal, onNavigate }: TodaysMealsProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMeal, setNewMeal] = useState({ name: '', time: '', calories: 0, foods: '' });
  const [editMeal, setEditMealState] = useState({ name: '', time: '', calories: 0, foods: '' });

  // Use today's weeklyMealPlan instead of base meals
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayIndex = new Date().getDay();
  const todayName = days[(todayIndex + 6) % 7];
  const todayMeals = plan.weeklyMealPlan?.[todayName] || plan.meals;

  const allMeals = [...todayMeals, ...(daily.customMeals || [])];
  const checkedCount = allMeals.filter(m => daily.meals[m.id]).length;
  const caloriesConsumed = allMeals
    .filter(m => daily.meals[m.id])
    .reduce((s, m) => s + m.calories, 0);

  const handleAdd = () => {
    if (!newMeal.name || !newMeal.calories) return;
    const id = `custom-${Date.now()}`;
    onAddCustomMeal?.({ id, name: newMeal.name, time: newMeal.time || '12:00 PM', calories: newMeal.calories, foods: newMeal.foods, done: false });
    setNewMeal({ name: '', time: '', calories: 0, foods: '' });
    setShowAdd(false);
  };

  const startEdit = (meal: Meal) => {
    setEditingId(meal.id);
    setEditMealState({ name: meal.name, time: meal.time, calories: meal.calories, foods: meal.foods });
  };

  const saveEdit = (id: string) => {
    onEditMeal?.(id, editMeal);
    setEditingId(null);
  };

  return (
    <div className="space-y-5 animate-fade-up">
      <ProgressBar value={caloriesConsumed} max={plan.dailyCalories}
        label={`${caloriesConsumed} / ${plan.dailyCalories} kcal`} showValue variant="success" />

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {checkedCount}/{allMeals.length} meals completed
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 text-xs font-medium text-primary">
          <Plus className="h-4 w-4" /> Add Meal
        </button>
      </div>

      {/* Add meal form */}
      {showAdd && (
        <div className="ft-card space-y-3">
          <h4 className="text-sm font-semibold">Add Custom Meal</h4>
          <input placeholder="Meal name (e.g., Evening Snack)" value={newMeal.name}
            onChange={e => setNewMeal(p => ({ ...p, name: e.target.value }))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none" />
          <input placeholder="Foods (e.g., Banana + Peanuts)" value={newMeal.foods}
            onChange={e => setNewMeal(p => ({ ...p, foods: e.target.value }))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none" />
          <div className="flex gap-2">
            <input type="number" placeholder="Calories" value={newMeal.calories || ''}
              onChange={e => setNewMeal(p => ({ ...p, calories: Number(e.target.value) }))}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none" />
            <input type="text" placeholder="Time (e.g., 4:00 PM)" value={newMeal.time}
              onChange={e => setNewMeal(p => ({ ...p, time: e.target.value }))}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 gradient-primary text-background rounded-lg py-2 text-sm font-medium">Add</button>
            <button onClick={() => setShowAdd(false)} className="px-4 border border-border rounded-lg py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Meal list */}
      <div className="space-y-3">
        {allMeals.map(meal => (
          <div key={meal.id} className={`ft-card transition-all ${daily.meals[meal.id] ? 'border-accent/50 bg-accent/5' : ''}`}>
            {editingId === meal.id ? (
              <div className="space-y-2">
                <input value={editMeal.name} onChange={e => setEditMealState(p => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none" />
                <input value={editMeal.foods} onChange={e => setEditMealState(p => ({ ...p, foods: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none" />
                <div className="flex gap-2">
                  <input type="number" value={editMeal.calories} onChange={e => setEditMealState(p => ({ ...p, calories: Number(e.target.value) }))}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none" />
                  <input value={editMeal.time} onChange={e => setEditMealState(p => ({ ...p, time: e.target.value }))}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(meal.id)} className="text-xs text-primary font-medium">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-xs text-muted-foreground">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <button onClick={() => onToggleMeal(meal.id)}
                  className={`mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${daily.meals[meal.id] ? 'border-accent bg-accent' : 'border-border'}`}>
                  {daily.meals[meal.id] && <Check className="h-3.5 w-3.5 text-background" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium">{meal.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{meal.time}</span>
                      <button onClick={() => startEdit(meal)} className="text-muted-foreground hover:text-primary">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      {meal.id.startsWith('custom-') && (
                        <button onClick={() => onRemoveCustomMeal?.(meal.id)} className="text-destructive">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">{meal.foods}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-xs text-ft-cyan">{meal.calories} kcal</span>
                    <button
                      onClick={() => onNavigate?.('recipes', meal.foods?.split(/[+,]/)?.[0]?.trim())}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <BookOpen className="h-3 w-3" /> Recipe
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
