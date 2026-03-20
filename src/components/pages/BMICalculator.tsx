import { useState } from 'react';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { GradientButton } from '@/components/shared/GradientButton';

interface BMICalculatorProps {
  profile: { weight: number; height: number; age: number };
  onSaveBMI: (bmi: number) => void;
  bmiHistory: { date: string; bmi: number }[];
}

export function BMICalculator({ profile, onSaveBMI, bmiHistory }: BMICalculatorProps) {
  const [weight, setWeight] = useState(profile.weight);
  const [height, setHeight] = useState(profile.height);

  const bmi = weight > 0 && height > 0 ? +(weight / ((height / 100) ** 2)).toFixed(1) : 0;
  const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const categoryColor = bmi < 18.5 ? 'text-ft-amber' : bmi < 25 ? 'text-ft-emerald' : bmi < 30 ? 'text-ft-amber' : 'text-ft-red';
  const idealLow = +(18.5 * (height / 100) ** 2).toFixed(1);
  const idealHigh = +(24.9 * (height / 100) ** 2).toFixed(1);

  const pct = Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100));

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="ft-card space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(+e.target.value)}
            className="w-full mt-1 rounded-xl border border-border bg-card px-4 py-3 font-mono focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Height (cm)</label>
          <input type="number" value={height} onChange={e => setHeight(+e.target.value)}
            className="w-full mt-1 rounded-xl border border-border bg-card px-4 py-3 font-mono focus:border-primary focus:outline-none" />
        </div>
      </div>

      {bmi > 0 && (
        <>
          <div className="ft-card flex flex-col items-center py-6">
            <div className="font-heading text-5xl">{bmi}</div>
            <div className={`text-lg font-semibold mt-1 ${categoryColor}`}>{category}</div>

            {/* BMI Scale */}
            <div className="w-full mt-6 relative h-4 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-ft-amber/60" />
                <div className="flex-1 bg-ft-emerald/60" />
                <div className="flex-1 bg-ft-amber/60" />
                <div className="flex-1 bg-ft-red/60" />
              </div>
              <div className="absolute top-0 h-full w-1 bg-foreground rounded-full transition-all duration-500"
                style={{ left: `${pct}%` }} />
            </div>
            <div className="flex justify-between w-full text-[10px] text-muted-foreground mt-1">
              <span>Under</span><span>Normal</span><span>Over</span><span>Obese</span>
            </div>
          </div>

          <div className="ft-card">
            <div className="text-sm text-muted-foreground mb-1">Ideal Weight Range</div>
            <div className="font-mono text-lg">{idealLow}kg — {idealHigh}kg</div>
          </div>

          <GradientButton onClick={() => onSaveBMI(bmi)} fullWidth>
            Save BMI Reading
          </GradientButton>

          {/* History */}
          {bmiHistory.length > 0 && (
            <div className="ft-card">
              <h3 className="font-heading text-lg mb-3">BMI History</h3>
              <div className="space-y-2">
                {bmiHistory.slice(-5).reverse().map((h, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{h.date}</span>
                    <span className="font-mono">{h.bmi}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
