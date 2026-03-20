import { useState } from 'react';
import { UserProfile } from '@/types/fitness';
import { GradientButton } from '@/components/shared/GradientButton';
import { SelectCard } from '@/components/shared/SelectCard';
import { Chip } from '@/components/shared/Chip';
import { generatePlan } from '@/hooks/usePlanGenerator';
import { AIPlan } from '@/types/fitness';

interface OnboardingProps {
  onComplete: (profile: UserProfile, plan: AIPlan) => void;
}

const defaultProfile: UserProfile = {
  name: '', age: 25, gender: 'male', weight: 70, targetWeight: 65, height: 170,
  conditions: [], sleepHours: '7-8', stressLevel: 'moderate',
  activityLevel: 'light', fitnessGoal: 'loss', gymAccess: 'no', workoutDays: 5,
  workoutDuration: 30, workoutTime: 'morning', dietType: 'nonveg', favFoods: '',
  waterIntake: 4, riceAtNight: 'sometimes', coffeeCups: '2',
  wakeTime: '06:00', sleepTime: '22:00', occupation: 'office', region: 'chennai',
  motivation: 'health', commitment: 7, familySupport: 'yes', language: 'en',
};

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const set = <K extends keyof UserProfile>(key: K, val: UserProfile[K]) =>
    setProfile(p => ({ ...p, [key]: val }));

  const toggleCondition = (c: string) =>
    setProfile(p => ({
      ...p,
      conditions: c === 'None'
        ? ['None']
        : p.conditions.includes(c)
          ? p.conditions.filter(x => x !== c)
          : [...p.conditions.filter(x => x !== 'None'), c],
    }));

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => Math.max(0, s - 1));

  const handleGenerate = async () => {
    setGenerating(true);
    const steps = [
      'Analysing your profile...',
      'Calculating your Tamil Nadu meal plan...',
      'Building your workout schedule...',
      'Setting your 12-week milestones...',
      'Finalising your personalised coaching...',
    ];
    for (let i = 0; i < steps.length; i++) {
      setGenStep(i);
      await new Promise(r => setTimeout(r, 800));
    }
    const plan = generatePlan(profile);
    onComplete(profile, plan);
  };

  if (generating) {
    const steps = [
      'Analysing your profile...',
      'Calculating your Tamil Nadu meal plan...',
      'Building your workout schedule...',
      'Setting your 12-week milestones...',
      'Finalising your personalised coaching...',
    ];
    return (
      <div className="mx-auto flex min-h-screen max-w-mobile flex-col items-center justify-center bg-background px-6">
        <div className="text-5xl mb-6 animate-pulse-ring">🤖</div>
        <h2 className="font-heading text-2xl text-center mb-2">Coach Tamil is building your plan...</h2>
        <div className="w-full mt-8 space-y-3">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i <= genStep ? 'opacity-100' : 'opacity-20'}`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${i < genStep ? 'bg-ft-emerald text-background' : i === genStep ? 'gradient-primary text-background animate-pulse' : 'bg-muted text-muted-foreground'}`}>
                {i < genStep ? '✓' : i + 1}
              </div>
              <span className="text-sm">{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stepContent = [
    // Step 0: Welcome
    <div key="0" className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
      <div className="text-6xl mb-2">💪</div>
      <h1 className="font-heading text-5xl gradient-text leading-tight">FitTamil AI</h1>
      <p className="text-muted-foreground text-lg">Your personal Tamil Nadu fitness coach</p>
      <div className="flex gap-3">
        <button onClick={() => set('language', 'en')}
          className={`rounded-full px-5 py-2 text-sm border-2 transition-all ${profile.language === 'en' ? 'border-primary bg-primary/10 text-ft-cyan' : 'border-border'}`}>
          English
        </button>
        <button onClick={() => set('language', 'ta')}
          className={`rounded-full px-5 py-2 text-sm border-2 transition-all ${profile.language === 'ta' ? 'border-primary bg-primary/10 text-ft-cyan' : 'border-border'}`}>
          தமிழ்
        </button>
      </div>
      <GradientButton onClick={next} fullWidth className="mt-4">Let's Get Started →</GradientButton>
    </div>,

    // Step 1: Basic Info
    <div key="1" className="space-y-6">
      <StepHeader num={1} title="Tell us about yourself" />
      <InputField label="Name" value={profile.name} onChange={v => set('name', v)} placeholder="Your name" />
      <InputField label="Age" type="number" value={String(profile.age)} onChange={v => set('age', +v)} />
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Gender</label>
        <div className="grid grid-cols-3 gap-3">
          {(['male', 'female', 'other'] as const).map(g => (
            <SelectCard key={g} selected={profile.gender === g} onClick={() => set('gender', g)}
              icon={g === 'male' ? '👨' : g === 'female' ? '👩' : '🧑'}
              label={g.charAt(0).toUpperCase() + g.slice(1)} />
          ))}
        </div>
      </div>
    </div>,

    // Step 2: Body Stats
    <div key="2" className="space-y-6">
      <StepHeader num={2} title="Body measurements" />
      <InputField label="Current Weight (kg)" type="number" value={String(profile.weight)} onChange={v => set('weight', +v)} />
      <InputField label="Target Weight (kg)" type="number" value={String(profile.targetWeight)} onChange={v => set('targetWeight', +v)} />
      <InputField label="Height (cm)" type="number" value={String(profile.height)} onChange={v => set('height', +v)} />
      {profile.weight > 0 && profile.targetWeight > 0 && (
        <div className="ft-card text-center">
          <div className="text-sm text-muted-foreground mb-1">Weight gap to target</div>
          <div className="font-heading text-3xl">
            <span className={profile.weight > profile.targetWeight ? 'text-ft-red' : 'text-ft-emerald'}>
              {Math.abs(profile.weight - profile.targetWeight)}kg
            </span>
            <span className="text-lg text-muted-foreground ml-2">
              to {profile.weight > profile.targetWeight ? 'lose' : 'gain'}
            </span>
          </div>
        </div>
      )}
    </div>,

    // Step 3: Health
    <div key="3" className="space-y-6">
      <StepHeader num={3} title="Health profile" />
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Medical Conditions</label>
        <div className="flex flex-wrap gap-2">
          {['Diabetes', 'High BP', 'Thyroid', 'PCOD', 'Knee pain', 'Back pain', 'Heart condition', 'None'].map(c => (
            <Chip key={c} label={c} selected={profile.conditions.includes(c)} onClick={() => toggleCondition(c)} />
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Sleep Hours</label>
        <div className="grid grid-cols-2 gap-3">
          {['< 6 hrs', '6-7 hrs', '7-8 hrs', '8+ hrs'].map(h => (
            <SelectCard key={h} selected={profile.sleepHours === h} onClick={() => set('sleepHours', h)} label={h} />
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Stress Level</label>
        <div className="grid grid-cols-2 gap-3">
          {['low', 'moderate', 'high', 'very high'].map(s => (
            <SelectCard key={s} selected={profile.stressLevel === s} onClick={() => set('stressLevel', s)}
              label={s.charAt(0).toUpperCase() + s.slice(1)} />
          ))}
        </div>
      </div>
    </div>,

    // Step 4: Fitness
    <div key="4" className="space-y-6">
      <StepHeader num={4} title="Fitness preferences" />
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Activity Level</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'sedentary', label: 'Sedentary', desc: 'Desk job, little exercise' },
            { id: 'light', label: 'Light', desc: 'Light walks, some activity' },
            { id: 'moderate', label: 'Moderate', desc: 'Regular exercise 3-4x' },
            { id: 'active', label: 'Active', desc: 'Daily intense workouts' },
          ].map(a => (
            <SelectCard key={a.id} selected={profile.activityLevel === a.id} onClick={() => set('activityLevel', a.id)}
              label={a.label} description={a.desc} />
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Fitness Goal</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'loss', label: 'Weight Loss', icon: '🔥' },
            { id: 'muscle', label: 'Build Muscle', icon: '💪' },
            { id: 'wellness', label: 'General Wellness', icon: '🧘' },
            { id: 'all', label: 'All-Round', icon: '⭐' },
          ].map(g => (
            <SelectCard key={g.id} selected={profile.fitnessGoal === g.id} onClick={() => set('fitnessGoal', g.id)}
              icon={g.icon} label={g.label} />
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Gym Access</label>
        <div className="grid grid-cols-3 gap-3">
          {[{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }, { id: 'home', label: 'Home Only' }].map(g => (
            <SelectCard key={g.id} selected={profile.gymAccess === g.id} onClick={() => set('gymAccess', g.id)} label={g.label} />
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-3 block">
          Workout Days/Week: <span className="text-ft-cyan font-mono">{profile.workoutDays}</span>
        </label>
        <input type="range" min={3} max={7} value={profile.workoutDays}
          onChange={e => set('workoutDays', +e.target.value)}
          className="w-full accent-[hsl(var(--ft-cyan))]" />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Workout Duration</label>
        <div className="grid grid-cols-4 gap-2">
          {[20, 30, 45, 60].map(d => (
            <SelectCard key={d} selected={profile.workoutDuration === d} onClick={() => set('workoutDuration', d)}
              label={`${d} min`} />
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Preferred Time</label>
        <div className="grid grid-cols-2 gap-3">
          {['morning', 'afternoon', 'evening', 'night'].map(t => (
            <SelectCard key={t} selected={profile.workoutTime === t} onClick={() => set('workoutTime', t)}
              label={t.charAt(0).toUpperCase() + t.slice(1)} />
          ))}
        </div>
      </div>
    </div>,

    // Step 5: Diet
    <div key="5" className="space-y-6">
      <StepHeader num={5} title="Diet & nutrition" />
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Diet Type</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'nonveg', label: 'Non-Veg', icon: '🍗' },
            { id: 'veg', label: 'Vegetarian', icon: '🥬' },
            { id: 'egg', label: 'Eggetarian', icon: '🥚' },
            { id: 'vegan', label: 'Vegan', icon: '🌱' },
          ].map(d => (
            <SelectCard key={d.id} selected={profile.dietType === d.id} onClick={() => set('dietType', d.id)}
              icon={d.icon} label={d.label} />
          ))}
        </div>
      </div>
      <InputField label="Favourite Tamil Foods" value={profile.favFoods} onChange={v => set('favFoods', v)} placeholder="e.g. Dosa, Biryani, Sambar" />
      <div>
        <label className="text-sm text-muted-foreground mb-3 block">
          Water Intake: <span className="text-ft-cyan font-mono">{profile.waterIntake} glasses</span>
        </label>
        <input type="range" min={1} max={15} value={profile.waterIntake}
          onChange={e => set('waterIntake', +e.target.value)}
          className="w-full accent-[hsl(var(--ft-cyan))]" />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Rice at Night?</label>
        <div className="grid grid-cols-3 gap-3">
          {['yes', 'no', 'sometimes'].map(r => (
            <SelectCard key={r} selected={profile.riceAtNight === r} onClick={() => set('riceAtNight', r)}
              label={r.charAt(0).toUpperCase() + r.slice(1)} />
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Filter Coffee/Tea per day</label>
        <div className="grid grid-cols-4 gap-2">
          {['0', '1', '2', '3+'].map(c => (
            <SelectCard key={c} selected={profile.coffeeCups === c} onClick={() => set('coffeeCups', c)} label={c} />
          ))}
        </div>
      </div>
    </div>,

    // Step 6: Lifestyle
    <div key="6" className="space-y-6">
      <StepHeader num={6} title="Lifestyle" />
      <InputField label="Wake Time" type="time" value={profile.wakeTime} onChange={v => set('wakeTime', v)} />
      <InputField label="Sleep Time" type="time" value={profile.sleepTime} onChange={v => set('sleepTime', v)} />
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Occupation</label>
        <div className="flex flex-wrap gap-2">
          {['Office', 'Field', 'Physical', 'Homemaker', 'Student', 'Other'].map(o => (
            <Chip key={o} label={o} selected={profile.occupation === o.toLowerCase()} onClick={() => set('occupation', o.toLowerCase())} />
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Region in Tamil Nadu</label>
        <div className="flex flex-wrap gap-2">
          {['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Other'].map(r => (
            <Chip key={r} label={r} selected={profile.region === r.toLowerCase()} onClick={() => set('region', r.toLowerCase())} />
          ))}
        </div>
      </div>
    </div>,

    // Step 7: Motivation
    <div key="7" className="space-y-6">
      <StepHeader num={7} title="Motivation & commitment" />
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Primary Motivation</label>
        <div className="flex flex-wrap gap-2">
          {['Health', 'Appearance', 'Energy', 'Confidence', 'Medical', 'Sports'].map(m => (
            <Chip key={m} label={m} selected={profile.motivation === m.toLowerCase()} onClick={() => set('motivation', m.toLowerCase())} />
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-3 block">
          Commitment Level: <span className="text-ft-cyan font-mono">{profile.commitment}/10</span>
          <span className="ml-2">
            {profile.commitment <= 3 ? '😔' : profile.commitment <= 5 ? '🙂' : profile.commitment <= 7 ? '💪' : profile.commitment <= 9 ? '🔥' : '🏆'}
          </span>
        </label>
        <input type="range" min={1} max={10} value={profile.commitment}
          onChange={e => set('commitment', +e.target.value)}
          className="w-full accent-[hsl(var(--ft-cyan))]" />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Family Support</label>
        <div className="grid grid-cols-3 gap-3">
          {['yes', 'no', 'sometimes'].map(s => (
            <SelectCard key={s} selected={profile.familySupport === s} onClick={() => set('familySupport', s)}
              label={s.charAt(0).toUpperCase() + s.slice(1)} />
          ))}
        </div>
      </div>
    </div>,

    // Step 8: Review & Generate
    <div key="8" className="space-y-6">
      <StepHeader num={8} title="Review & Generate" />
      <div className="ft-card space-y-3">
        <ReviewRow label="Name" value={profile.name || '—'} />
        <ReviewRow label="Age / Gender" value={`${profile.age} / ${profile.gender}`} />
        <ReviewRow label="Weight" value={`${profile.weight}kg → ${profile.targetWeight}kg`} />
        <ReviewRow label="Height" value={`${profile.height}cm`} />
        <ReviewRow label="Goal" value={profile.fitnessGoal} />
        <ReviewRow label="Diet" value={profile.dietType} />
        <ReviewRow label="Workout" value={`${profile.workoutDays}x/week, ${profile.workoutDuration}min`} />
        <ReviewRow label="Region" value={profile.region} />
      </div>
      <GradientButton onClick={handleGenerate} fullWidth disabled={!profile.name}>
        🤖 Generate My Plan
      </GradientButton>
    </div>,
  ];

  return (
    <div className="mx-auto min-h-screen max-w-mobile bg-background">
      {/* Progress */}
      {step > 0 && (
        <div className="sticky top-0 z-40 glass px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={prev} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
            <span className="text-xs text-muted-foreground font-mono">Step {step} of 8</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${(step / 8) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="px-5 py-6 animate-fade-up" key={step}>
        {stepContent[step]}
      </div>

      {/* Next button for non-first/last steps */}
      {step > 0 && step < 8 && (
        <div className="sticky bottom-0 glass px-5 py-4 safe-bottom">
          <GradientButton onClick={next} fullWidth>Continue →</GradientButton>
        </div>
      )}
    </div>
  );
}

function StepHeader({ num, title }: { num: number; title: string }) {
  return (
    <div className="mb-2">
      <div className="text-xs font-mono text-ft-cyan mb-1">Step {num}</div>
      <h2 className="font-heading text-3xl">{title}</h2>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
      />
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  );
}
