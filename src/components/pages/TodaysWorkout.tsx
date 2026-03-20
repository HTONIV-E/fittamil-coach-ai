import { useState } from 'react';
import { AIPlan, DailyData } from '@/types/fitness';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Check, Play, Pause, RotateCcw } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface TodaysWorkoutProps {
  plan: AIPlan;
  daily: DailyData;
  onToggleExercise: (id: string) => void;
  onToggleCore: (id: string) => void;
}

export function TodaysWorkout({ plan, daily, onToggleExercise, onToggleCore }: TodaysWorkoutProps) {
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const exercises = plan.workoutSchedule[dayName] || [];
  const doneCount = Object.values(daily.workout).filter(Boolean).length;
  const totalExercises = exercises.length;
  const pct = totalExercises > 0 ? Math.round((doneCount / totalExercises) * 100) : 0;

  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      intervalRef.current = window.setInterval(() => setTimerSeconds(s => s - 1), 1000);
      return () => clearInterval(intervalRef.current);
    }
    if (timerSeconds === 0) {
      setTimerRunning(false);
      if (navigator.vibrate) navigator.vibrate(200);
    }
  }, [timerRunning, timerSeconds]);

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="ft-card text-center">
        <div className="font-heading text-xl mb-1">{dayName}'s Workout</div>
        <div className="font-mono text-3xl text-ft-cyan">{pct}%</div>
        <ProgressBar value={doneCount} max={totalExercises} className="mt-3" />
      </div>

      <div className="space-y-3">
        {exercises.map(ex => (
          <button key={ex.id} onClick={() => onToggleExercise(ex.id)}
            className={`w-full ft-card flex items-center gap-3 text-left active:scale-[0.98] transition-all ${daily.workout[ex.id] ? 'border-accent/50' : ''}`}>
            <div className={`h-7 w-7 rounded-lg border-2 flex items-center justify-center shrink-0 ${daily.workout[ex.id] ? 'border-accent bg-accent' : 'border-border'}`}>
              {daily.workout[ex.id] && <Check className="h-4 w-4 text-background" />}
            </div>
            <div className="flex-1">
              <div className="font-medium">{ex.name}</div>
              <div className="text-xs text-muted-foreground font-mono">{ex.sets}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Exercise Timer */}
      <div className="ft-card text-center">
        <div className="text-sm text-muted-foreground mb-3">Exercise Timer</div>
        <div className="font-mono text-5xl mb-4">
          {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
        </div>
        <div className="flex justify-center gap-3">
          <button onClick={() => { setTimerActive(true); setTimerRunning(!timerRunning); }}
            className="gradient-primary h-12 w-12 rounded-full flex items-center justify-center active:scale-95">
            {timerRunning ? <Pause className="h-5 w-5 text-background" /> : <Play className="h-5 w-5 text-background" />}
          </button>
          <button onClick={() => { setTimerSeconds(45); setTimerRunning(false); }}
            className="h-12 w-12 rounded-full border border-border flex items-center justify-center active:scale-95">
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-center gap-2 mt-3">
          {[30, 45, 60, 90].map(s => (
            <button key={s} onClick={() => { setTimerSeconds(s); setTimerRunning(false); }}
              className={`px-3 py-1 rounded-full text-xs font-mono ${timerSeconds === s && !timerRunning ? 'gradient-primary text-background' : 'bg-muted'}`}>
              {s}s
            </button>
          ))}
        </div>
      </div>

      {/* Core Exercises */}
      <div>
        <h3 className="font-heading text-xl mb-3">🎯 Core Exercises</h3>
        <div className="space-y-2">
          {plan.coreExercises.map(ex => (
            <button key={ex.id} onClick={() => onToggleCore(ex.id)}
              className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-left text-sm transition-all active:scale-[0.98] ${daily.coreWorkout[ex.id] ? 'bg-accent/10 text-accent' : 'hover:bg-muted'}`}>
              <div className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 ${daily.coreWorkout[ex.id] ? 'border-accent bg-accent' : 'border-border'}`}>
                {daily.coreWorkout[ex.id] && <Check className="h-3 w-3 text-background" />}
              </div>
              <span className="flex-1">{ex.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{ex.sets}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
