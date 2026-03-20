import { useMemo } from 'react';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { TAMIL_QUOTES, TAMIL_FESTIVALS } from '@/types/fitness';
import type { AIPlan, DailyData } from '@/types/fitness';

interface DashboardProps {
  plan: AIPlan;
  daily: DailyData;
  streak: number;
  profile: { name: string; weight: number; targetWeight: number };
  onNavigate: (page: string) => void;
  onLogWeight: () => void;
}

export function Dashboard({ plan, daily, streak, profile, onNavigate, onLogWeight }: DashboardProps) {
  const mealsScore = Math.round((Object.values(daily.meals).filter(Boolean).length / plan.meals.length) * 30);
  const waterScore = Math.round((daily.water / (plan.dailyWater / 250)) * 25);
  const workoutScore = (() => {
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const exercises = plan.workoutSchedule[dayName] || [];
    if (exercises.length === 0) return 30;
    return Math.round((Object.values(daily.workout).filter(Boolean).length / exercises.length) * 30);
  })();
  const stepScore = Math.round(Math.min(1, daily.steps / plan.stepGoal) * 15);
  const totalScore = Math.min(100, mealsScore + waterScore + workoutScore + stepScore);

  const quote = useMemo(() => TAMIL_QUOTES[Math.floor(Math.random() * TAMIL_QUOTES.length)], []);

  const todayMMDD = `${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  const festival = TAMIL_FESTIVALS.find(f => f.date === todayMMDD);

  const caloriesConsumed = daily.foodLog.reduce((s, f) => s + f.calories, 0);

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Score Ring */}
      <div className="ft-card flex flex-col items-center py-6">
        <ScoreRing score={totalScore} size={180} strokeWidth={12} />
        <div className="mt-3 grid grid-cols-4 gap-4 w-full text-center">
          <MiniStat label="Meals" value={`${mealsScore}/30`} color="text-ft-cyan" />
          <MiniStat label="Water" value={`${waterScore}/25`} color="text-ft-violet" />
          <MiniStat label="Workout" value={`${workoutScore}/30`} color="text-ft-emerald" />
          <MiniStat label="Steps" value={`${stepScore}/15`} color="text-ft-amber" />
        </div>
      </div>

      {/* Tamil Quote */}
      <div className="ft-card text-center">
        <p className="text-lg font-medium mb-1">{quote.ta}</p>
        <p className="text-sm text-muted-foreground italic">{quote.en}</p>
      </div>

      {/* Festival Banner */}
      {festival && (
        <div className="gradient-alert rounded-xl p-4 text-background">
          <div className="font-heading text-xl">🎉 {festival.name}</div>
          <p className="text-sm mt-1 opacity-90">{festival.tip}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="🍽️" label="Meals" value={`${Object.values(daily.meals).filter(Boolean).length}/${plan.meals.length}`}
          onClick={() => onNavigate('meals')} />
        <StatCard icon="💪" label="Exercises" value={`${Object.values(daily.workout).filter(Boolean).length} done`}
          onClick={() => onNavigate('workout')} />
        <StatCard icon="💧" label="Water" value={`${daily.water} glasses`}
          onClick={() => onNavigate('water')} />
        <StatCard icon="🔥" label="Streak" value={`${streak} days`} />
      </div>

      {/* Calorie Progress */}
      <div className="ft-card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Calories</span>
          <span className="font-mono text-sm">{caloriesConsumed} / {plan.dailyCalories} kcal</span>
        </div>
        <ProgressBar value={caloriesConsumed} max={plan.dailyCalories}
          variant={caloriesConsumed > plan.dailyCalories ? 'alert' : 'success'} />
      </div>

      {/* Step Counter */}
      <div className="ft-card flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Steps Today</div>
          <div className="font-mono text-2xl font-bold">{daily.steps.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">/ {plan.stepGoal.toLocaleString()} goal</div>
        </div>
        <ScoreRing score={Math.min(100, Math.round((daily.steps / plan.stepGoal) * 100))} size={80} strokeWidth={6}>
          <span className="text-xs font-mono">{Math.min(100, Math.round((daily.steps / plan.stepGoal) * 100))}%</span>
        </ScoreRing>
      </div>

      {/* Quick Weight Log */}
      <button onClick={onLogWeight}
        className="w-full ft-card flex items-center justify-between group hover:border-primary/50 transition-colors">
        <div>
          <div className="text-sm text-muted-foreground">Quick Weight Log</div>
          <div className="font-mono">{profile.weight}kg → {profile.targetWeight}kg</div>
        </div>
        <span className="text-2xl group-hover:scale-110 transition-transform">⚖️</span>
      </button>

      {/* BMI Card */}
      <div className="ft-card">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground">Current BMI</div>
            <div className="font-heading text-3xl">{plan.currentBMI}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Target BMI</div>
            <div className="font-heading text-3xl text-ft-emerald">{plan.targetBMI}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, onClick }: { icon: string; label: string; value: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="ft-card text-left hover:border-primary/30 transition-colors active:scale-[0.97]">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-mono font-semibold">{value}</div>
    </button>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className={`font-mono text-sm font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
