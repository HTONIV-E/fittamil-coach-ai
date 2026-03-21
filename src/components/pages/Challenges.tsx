import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { GradientButton } from '@/components/shared/GradientButton';
import { ProgressBar } from '@/components/shared/ProgressBar';

interface Challenge {
  id: string;
  name: string;
  emoji: string;
  days: number;
  description: string;
}

const CHALLENGES: Challenge[] = [
  { id: 'no-sugar-7', name: '7-Day No Sugar', emoji: '🚫🍬', days: 7, description: 'Eliminate refined sugar for a week. Natural fruits are OK.' },
  { id: 'hydration-7', name: '7-Day Hydration', emoji: '💧', days: 7, description: 'Drink 10+ glasses of water every day for 7 days.' },
  { id: 'consistency-21', name: '21-Day Consistency', emoji: '🔥', days: 21, description: 'Complete 4+ meals from your plan every single day.' },
  { id: 'belly-blast-21', name: '21-Day Belly Blast', emoji: '💪', days: 21, description: 'Do core exercises daily for 21 days straight.' },
  { id: 'transform-30', name: '30-Day Transformation', emoji: '🦋', days: 30, description: 'Follow your full plan: meals + workout + water for 30 days.' },
];

interface ChallengeState {
  active: string | null;
  startDate: string | null;
  daysCompleted: Record<string, boolean>;
  completed: string[];
}

export function Challenges() {
  const [state, setState] = useLocalStorage<ChallengeState>('ftai_challenges', {
    active: null, startDate: null, daysCompleted: {}, completed: [],
  });

  const activeChallenge = CHALLENGES.find(c => c.id === state.active);

  const startChallenge = (id: string) => {
    setState({
      ...state,
      active: id,
      startDate: new Date().toISOString().split('T')[0],
      daysCompleted: {},
    });
  };

  const toggleDay = (day: number) => {
    const key = `day-${day}`;
    const newDays = { ...state.daysCompleted, [key]: !state.daysCompleted[key] };
    const challenge = CHALLENGES.find(c => c.id === state.active);
    
    // Check if completed
    if (challenge) {
      const completedCount = Object.values(newDays).filter(Boolean).length;
      if (completedCount >= challenge.days) {
        setState({
          ...state,
          daysCompleted: newDays,
          completed: [...state.completed, state.active!],
          active: null,
          startDate: null,
        });
        return;
      }
    }
    
    setState({ ...state, daysCompleted: newDays });
  };

  const quitChallenge = () => {
    setState({ ...state, active: null, startDate: null, daysCompleted: {} });
  };

  if (activeChallenge) {
    const completedCount = Object.values(state.daysCompleted).filter(Boolean).length;
    const progress = Math.round((completedCount / activeChallenge.days) * 100);

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="ft-card text-center">
          <div className="text-5xl mb-3">{activeChallenge.emoji}</div>
          <h2 className="font-heading text-2xl">{activeChallenge.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{activeChallenge.description}</p>
          <div className="mt-4">
            <ProgressBar value={completedCount} max={activeChallenge.days} variant="success" showValue label="Progress" />
          </div>
          <div className="font-mono text-sm text-ft-cyan mt-2">
            {completedCount}/{activeChallenge.days} days
          </div>
        </div>

        {/* Day grid */}
        <div className="ft-card">
          <h3 className="font-heading text-lg mb-3">Tap each day as you complete it</h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: activeChallenge.days }, (_, i) => {
              const key = `day-${i}`;
              const done = state.daysCompleted[key];
              return (
                <button
                  key={i}
                  onClick={() => toggleDay(i)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-mono transition-all active:scale-90 ${
                    done
                      ? 'gradient-success text-background font-bold'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Badges for completed challenges */}
        {state.completed.length > 0 && (
          <div className="ft-card">
            <h3 className="font-heading text-lg mb-3">🏅 Badges Earned</h3>
            <div className="flex flex-wrap gap-3">
              {state.completed.map(id => {
                const c = CHALLENGES.find(ch => ch.id === id);
                return c ? (
                  <div key={id} className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-xl">
                      {c.emoji}
                    </div>
                    <span className="text-[10px] text-muted-foreground text-center">{c.name}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        <button onClick={quitChallenge} className="w-full text-center text-sm text-ft-red py-2">
          Quit Challenge
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="text-center mb-2">
        <h2 className="font-heading text-2xl">Choose a Challenge</h2>
        <p className="text-sm text-muted-foreground">Push your limits and earn badges!</p>
      </div>

      {CHALLENGES.map(challenge => (
        <div key={challenge.id} className="ft-card">
          <div className="flex items-start gap-4">
            <div className="text-3xl">{challenge.emoji}</div>
            <div className="flex-1">
              <h3 className="font-medium">{challenge.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono text-xs text-ft-cyan">{challenge.days} days</span>
                {state.completed.includes(challenge.id) && (
                  <span className="text-xs text-ft-emerald font-semibold">✅ Completed</span>
                )}
              </div>
            </div>
          </div>
          {!state.completed.includes(challenge.id) && (
            <GradientButton onClick={() => startChallenge(challenge.id)} fullWidth className="mt-3">
              Start Challenge
            </GradientButton>
          )}
        </div>
      ))}

      {/* Earned badges */}
      {state.completed.length > 0 && (
        <div className="ft-card">
          <h3 className="font-heading text-lg mb-3">🏅 Badges Earned</h3>
          <div className="flex flex-wrap gap-3">
            {state.completed.map(id => {
              const c = CHALLENGES.find(ch => ch.id === id);
              return c ? (
                <div key={id} className="flex flex-col items-center gap-1">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-xl">
                    {c.emoji}
                  </div>
                  <span className="text-[10px] text-muted-foreground text-center">{c.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
