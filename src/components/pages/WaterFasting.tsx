import { useState } from 'react';
import { DailyData, AIPlan } from '@/types/fitness';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { GradientButton } from '@/components/shared/GradientButton';
import { Droplets, Plus, Minus } from 'lucide-react';

interface WaterFastingProps {
  plan: AIPlan;
  daily: DailyData;
  glassSize: number;
  onAddWater: () => void;
  onRemoveWater: () => void;
  onToggleAmla: (period: 'morning' | 'noon' | 'evening') => void;
}

export function WaterFasting({ plan, daily, glassSize, onAddWater, onRemoveWater, onToggleAmla }: WaterFastingProps) {
  const targetGlasses = Math.ceil(plan.dailyWater / glassSize);
  const pct = Math.min(100, Math.round((daily.water / targetGlasses) * 100));

  const [fastingType, setFastingType] = useState<string>('16:8');

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Water Progress */}
      <div className="ft-card flex flex-col items-center py-6">
        <ScoreRing score={pct} size={160} strokeWidth={10}>
          <Droplets className="h-6 w-6 text-ft-cyan mb-1" />
          <span className="font-mono text-2xl font-bold">{daily.water}</span>
          <span className="text-xs text-muted-foreground">/ {targetGlasses} glasses</span>
        </ScoreRing>

        <div className="flex items-center gap-4 mt-6">
          <button onClick={onRemoveWater}
            className="h-12 w-12 rounded-full border border-border flex items-center justify-center active:scale-95 hover:bg-muted">
            <Minus className="h-5 w-5" />
          </button>
          <div className="text-center">
            <div className="font-mono text-lg">{glassSize}ml</div>
            <div className="text-xs text-muted-foreground">per glass</div>
          </div>
          <button onClick={onAddWater}
            className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center active:scale-95">
            <Plus className="h-5 w-5 text-background" />
          </button>
        </div>
      </div>

      {/* Water Grid */}
      <div className="ft-card">
        <div className="text-sm text-muted-foreground mb-3">Tap glasses to fill</div>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: targetGlasses }).map((_, i) => (
            <button key={i}
              onClick={i < daily.water ? onRemoveWater : onAddWater}
              className={`aspect-square rounded-lg flex items-center justify-center text-xl transition-all active:scale-95 ${i < daily.water ? 'bg-primary/20 border border-primary/40' : 'bg-muted/50 border border-border'}`}>
              {i < daily.water ? '💧' : '○'}
            </button>
          ))}
        </div>
      </div>

      {/* Amla Water Tracker */}
      <div className="ft-card">
        <h3 className="font-heading text-lg mb-3">🫒 Amla Water</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['morning', 'noon', 'evening'] as const).map(period => (
            <button key={period} onClick={() => onToggleAmla(period)}
              className={`rounded-xl py-3 text-center text-sm font-medium transition-all active:scale-[0.97] border-2 ${daily.amla[period] ? 'border-accent bg-accent/10 text-accent' : 'border-border'}`}>
              <div className="text-lg mb-1">{daily.amla[period] ? '✅' : '🕐'}</div>
              <div className="capitalize">{period}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Fasting Timer */}
      <div className="ft-card">
        <h3 className="font-heading text-lg mb-3">⏱️ Intermittent Fasting</h3>
        <div className="flex gap-2 mb-4">
          {['14:10', '16:8', '18:6', '20:4'].map(t => (
            <button key={t} onClick={() => setFastingType(t)}
              className={`flex-1 rounded-lg py-2 text-center text-sm font-mono transition-all ${fastingType === t ? 'gradient-primary text-background' : 'bg-muted'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Fast for {fastingType.split(':')[0]}h, eat within {fastingType.split(':')[1]}h window
        </div>
      </div>
    </div>
  );
}
