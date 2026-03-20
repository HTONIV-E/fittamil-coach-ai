import { AIPlan } from '@/types/fitness';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { GradientButton } from '@/components/shared/GradientButton';
import { Check, X, RefreshCw } from 'lucide-react';

interface MyPlanProps {
  plan: AIPlan;
  onRegenerate: () => void;
}

export function MyPlan({ plan, onRegenerate }: MyPlanProps) {
  return (
    <div className="space-y-5 animate-fade-up">
      {/* Summary */}
      <div className="ft-card">
        <h3 className="font-heading text-xl mb-3">Your Plan</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <PlanStat label="Daily Calories" value={`${plan.dailyCalories} kcal`} />
          <PlanStat label="BMR" value={`${plan.bmr} kcal`} />
          <PlanStat label="TDEE" value={`${plan.tdee} kcal`} />
          <PlanStat label="Water" value={`${plan.dailyWater}ml`} />
          <PlanStat label="Steps Goal" value={`${plan.stepGoal}`} />
          <PlanStat label="Weeks to Goal" value={`${plan.weeksToGoal}w`} />
        </div>
      </div>

      {/* Coach Notes */}
      <div className="ft-card">
        <h3 className="font-heading text-xl mb-2">🤖 Coach Notes</h3>
        <p className="text-sm text-muted-foreground mb-3">{plan.coachNotes.strategy}</p>
        <div className="space-y-1">
          {plan.coachNotes.tips.map((t, i) => (
            <div key={i} className="text-sm flex gap-2">
              <span className="text-ft-cyan">💡</span> {t}
            </div>
          ))}
        </div>
        {plan.coachNotes.warnings.length > 0 && (
          <div className="mt-3 space-y-1">
            {plan.coachNotes.warnings.map((w, i) => (
              <div key={i} className="text-sm flex gap-2 text-ft-amber">
                <span>⚠️</span> {w}
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 text-sm italic text-muted-foreground">"{plan.coachNotes.quote}"</div>
      </div>

      {/* Milestones */}
      <div className="ft-card">
        <h3 className="font-heading text-xl mb-3">🎯 12-Week Milestones</h3>
        <div className="space-y-4">
          {plan.milestones.map((m, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Week {m.week}</span>
                <span className={`text-xs ${m.done ? 'text-ft-emerald' : 'text-muted-foreground'}`}>
                  {m.done ? '✅ Done' : 'In progress'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{m.goal}</p>
              <ProgressBar value={m.done ? 100 : Math.round((Date.now() - new Date(plan.generatedAt).getTime()) / (m.week * 7 * 86400000) * 100)} max={100} />
            </div>
          ))}
        </div>
      </div>

      {/* Do / Avoid */}
      <div className="grid grid-cols-1 gap-4">
        <div className="ft-card">
          <h3 className="font-heading text-lg text-ft-emerald mb-2">✅ Do Eat</h3>
          <div className="space-y-1.5">
            {plan.doEat.map((item, i) => (
              <div key={i} className="text-sm flex gap-2"><Check className="h-4 w-4 text-ft-emerald shrink-0 mt-0.5" /> {item}</div>
            ))}
          </div>
        </div>
        <div className="ft-card">
          <h3 className="font-heading text-lg text-ft-red mb-2">❌ Avoid</h3>
          <div className="space-y-1.5">
            {plan.avoidEat.map((item, i) => (
              <div key={i} className="text-sm flex gap-2"><X className="h-4 w-4 text-ft-red shrink-0 mt-0.5" /> {item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Food Swaps */}
      <div className="ft-card">
        <h3 className="font-heading text-xl mb-3">🔄 Smart Swaps</h3>
        <div className="space-y-3">
          {plan.foodSwaps.map((swap, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-ft-red line-through">{swap.from}</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-ft-emerald">{swap.to}</span>
              <span className="font-mono text-xs text-ft-cyan">-{swap.saved} kcal</span>
            </div>
          ))}
        </div>
      </div>

      <GradientButton onClick={onRegenerate} fullWidth>
        <RefreshCw className="h-4 w-4 mr-2 inline" /> Regenerate Plan
      </GradientButton>
    </div>
  );
}

function PlanStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-mono font-bold">{value}</div>
    </div>
  );
}
