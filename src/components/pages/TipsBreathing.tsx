import { useState, useEffect, useRef } from 'react';
import { AIPlan, TAMIL_FESTIVALS } from '@/types/fitness';

interface TipsBreathingProps {
  plan: AIPlan;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'idle';

export function TipsBreathing({ plan }: TipsBreathingProps) {
  const [breathing, setBreathing] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [cycle, setCycle] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalCycles = 5;
  const phases: { name: BreathPhase; duration: number; label: string }[] = [
    { name: 'inhale', duration: 4, label: 'Breathe In' },
    { name: 'hold', duration: 2, label: 'Hold' },
    { name: 'exhale', duration: 6, label: 'Breathe Out' },
  ];

  const startBreathing = () => {
    setBreathing(true);
    setCycle(0);
    runCycle(0);
  };

  const runCycle = async (currentCycle: number) => {
    if (currentCycle >= totalCycles) {
      setBreathing(false);
      setPhase('idle');
      return;
    }
    setCycle(currentCycle + 1);
    for (const p of phases) {
      setPhase(p.name);
      for (let s = p.duration; s > 0; s--) {
        setSeconds(s);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    runCycle(currentCycle + 1);
  };

  const stopBreathing = () => {
    setBreathing(false);
    setPhase('idle');
  };

  const circleScale = phase === 'inhale' ? 'scale-125' : phase === 'exhale' ? 'scale-75' : 'scale-100';

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Tamil Festival Calendar */}
      <div className="ft-card">
        <h3 className="font-heading text-xl mb-3">🎉 Tamil Festival Calendar</h3>
        <div className="space-y-3">
          {TAMIL_FESTIVALS.map((festival, i) => {
            const [month, day] = festival.date.split('-');
            const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return (
              <div key={i} className="flex gap-3 items-start">
                <div className="shrink-0 w-12 text-center">
                  <div className="font-mono text-xs text-ft-cyan">{monthNames[+month]}</div>
                  <div className="font-heading text-xl">{day}</div>
                </div>
                <div className="flex-1 border-l border-border pl-3">
                  <div className="font-medium text-sm">{festival.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{festival.tip}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Food Swaps */}
      {plan.foodSwaps && plan.foodSwaps.length > 0 && (
        <div className="ft-card">
          <h3 className="font-heading text-xl mb-3">🔄 Smart Food Swaps</h3>
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
      )}

      {/* 4-2-6 Breathing */}
      <div className="ft-card">
        <h3 className="font-heading text-xl mb-2 text-center">🧘 4-2-6 Breathing</h3>
        <p className="text-xs text-muted-foreground text-center mb-6">
          Inhale 4s → Hold 2s → Exhale 6s × 5 cycles
        </p>

        <div className="flex flex-col items-center">
          {/* Animated circle */}
          <div className={`h-40 w-40 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ease-in-out ${circleScale} ${
            phase === 'inhale' ? 'border-ft-cyan bg-primary/10'
              : phase === 'hold' ? 'border-ft-violet bg-primary/5'
              : phase === 'exhale' ? 'border-ft-emerald bg-accent/10'
              : 'border-border'
          }`}>
            {breathing ? (
              <div className="text-center">
                <div className="font-heading text-3xl">{seconds}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
                </div>
              </div>
            ) : (
              <span className="text-4xl">🧘</span>
            )}
          </div>

          {/* Cycle counter */}
          {breathing && (
            <div className="mt-4 flex gap-2">
              {Array.from({ length: totalCycles }, (_, i) => (
                <div
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    i < cycle ? 'gradient-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}

          <button
            onClick={breathing ? stopBreathing : startBreathing}
            className={`mt-6 rounded-xl px-8 py-3 text-sm font-medium transition-all active:scale-95 ${
              breathing
                ? 'bg-muted text-foreground'
                : 'gradient-primary text-background'
            }`}
          >
            {breathing ? 'Stop' : 'Start Breathing Exercise'}
          </button>
        </div>
      </div>
    </div>
  );
}
