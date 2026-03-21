import { useState, useEffect } from 'react';
import { AIPlan, Meal } from '@/types/fitness';
import { Check } from 'lucide-react';

interface MealPlannerProps {
  plan: AIPlan;
}

export function MealPlanner({ plan }: MealPlannerProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayIndex = new Date().getDay();
  const todayName = days[(todayIndex + 6) % 7]; // JS Sunday=0, we want Monday=0
  const [selectedDay, setSelectedDay] = useState(todayName);
  const [crossedOff, setCrossedOff] = useState<Record<string, boolean>>({});

  const dayMeals = plan.weeklyMealPlan?.[selectedDay] || plan.meals;

  // Build grocery list from all weekly meals
  const groceryItems = Array.from(
    new Set(
      Object.values(plan.weeklyMealPlan || {})
        .flat()
        .map(m => m.foods)
        .join(' + ')
        .split(' + ')
        .map(f => f.trim())
        .filter(Boolean)
    )
  );

  const toggleGrocery = (item: string) => {
    setCrossedOff(prev => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedDay === day
                ? 'gradient-primary text-background'
                : day === todayName
                  ? 'border-2 border-primary/50 text-foreground'
                  : 'border border-border text-muted-foreground'
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Day indicator */}
      <div className="text-center">
        <h3 className="font-heading text-2xl">{selectedDay}</h3>
        {selectedDay === todayName && (
          <span className="text-xs text-ft-cyan font-mono">TODAY</span>
        )}
      </div>

      {/* Meals for selected day */}
      <div className="space-y-3">
        {dayMeals.map((meal, i) => (
          <div key={meal.id || i} className="ft-card">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-medium">{meal.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{meal.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">{meal.foods}</p>
            <span className="font-mono text-xs text-ft-cyan">{meal.calories} kcal</span>
          </div>
        ))}
      </div>

      {/* Grocery List */}
      <div className="ft-card">
        <h3 className="font-heading text-xl mb-3">🛒 Smart Grocery List</h3>
        <p className="text-xs text-muted-foreground mb-3">Tap items to cross off as you shop</p>
        <div className="space-y-2">
          {groceryItems.map((item, i) => (
            <button
              key={i}
              onClick={() => toggleGrocery(item)}
              className={`w-full flex items-center gap-3 text-left text-sm py-1.5 transition-all ${
                crossedOff[item] ? 'line-through text-muted-foreground/50' : 'text-foreground'
              }`}
            >
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
    </div>
  );
}
