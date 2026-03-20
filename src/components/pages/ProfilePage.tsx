import { useState } from 'react';
import { UserProfile } from '@/types/fitness';
import { SelectCard } from '@/components/shared/SelectCard';
import { GradientButton } from '@/components/shared/GradientButton';
import { Sun, Moon, Monitor, Download } from 'lucide-react';

interface ProfilePageProps {
  profile: UserProfile;
  onUpdateProfile: (partial: Partial<UserProfile>) => void;
  theme: 'dark' | 'light' | 'auto';
  onSetTheme: (t: 'dark' | 'light' | 'auto') => void;
  onRegeneratePlan: () => void;
  daily: { mood: string; energy: number };
  onUpdateDaily: (mood: string, energy: number) => void;
}

export function ProfilePage({ profile, onUpdateProfile, theme, onSetTheme, onRegeneratePlan, daily, onUpdateDaily }: ProfilePageProps) {
  const [editWeight, setEditWeight] = useState(String(profile.weight));
  const [editTarget, setEditTarget] = useState(String(profile.targetWeight));
  const [editName, setEditName] = useState(profile.name);

  const handleSaveBasic = () => {
    onUpdateProfile({
      name: editName,
      weight: +editWeight,
      targetWeight: +editTarget,
    });
  };

  const moods = ['😔', '😐', '🙂', '😊', '🤩'];

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Quick Edit */}
      <div className="ft-card space-y-4">
        <h3 className="font-heading text-xl">Quick Edit</h3>
        <div>
          <label className="text-xs text-muted-foreground">Name</label>
          <input value={editName} onChange={e => setEditName(e.target.value)} onBlur={handleSaveBasic}
            className="w-full mt-1 rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Weight (kg)</label>
            <input type="number" value={editWeight} onChange={e => setEditWeight(e.target.value)} onBlur={handleSaveBasic}
              className="w-full mt-1 rounded-lg border border-border bg-card px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Target (kg)</label>
            <input type="number" value={editTarget} onChange={e => setEditTarget(e.target.value)} onBlur={handleSaveBasic}
              className="w-full mt-1 rounded-lg border border-border bg-card px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Check-in */}
      <div className="ft-card">
        <h3 className="font-heading text-xl mb-3">Daily Check-in</h3>
        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-2 block">How are you feeling?</label>
          <div className="flex gap-3 justify-center">
            {moods.map((m, i) => (
              <button key={m} onClick={() => onUpdateDaily(m, daily.energy)}
                className={`text-3xl transition-all ${daily.mood === m ? 'scale-125' : 'opacity-50 hover:opacity-80'} active:scale-110`}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">
            Energy Level: <span className="font-mono text-ft-cyan">{daily.energy}/10</span>
          </label>
          <input type="range" min={1} max={10} value={daily.energy}
            onChange={e => onUpdateDaily(daily.mood, +e.target.value)}
            className="w-full accent-[hsl(var(--ft-cyan))]" />
        </div>
      </div>

      {/* Theme */}
      <div className="ft-card">
        <h3 className="font-heading text-xl mb-3">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          <SelectCard selected={theme === 'dark'} onClick={() => onSetTheme('dark')} icon="🌙" label="Dark" />
          <SelectCard selected={theme === 'light'} onClick={() => onSetTheme('light')} icon="☀️" label="Light" />
          <SelectCard selected={theme === 'auto'} onClick={() => onSetTheme('auto')} icon="🔄" label="Auto" />
        </div>
      </div>

      {/* Profile Info */}
      <div className="ft-card space-y-2">
        <h3 className="font-heading text-xl mb-2">Profile Details</h3>
        <InfoRow label="Gender" value={profile.gender} />
        <InfoRow label="Age" value={String(profile.age)} />
        <InfoRow label="Height" value={`${profile.height}cm`} />
        <InfoRow label="Goal" value={profile.fitnessGoal} />
        <InfoRow label="Diet" value={profile.dietType} />
        <InfoRow label="Activity" value={profile.activityLevel} />
        <InfoRow label="Region" value={profile.region} />
      </div>

      {/* Actions */}
      <GradientButton onClick={onRegeneratePlan} fullWidth>
        🤖 Regenerate AI Plan
      </GradientButton>

      <button onClick={() => {
        const data = localStorage.getItem('ftai_v3');
        if (data) {
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = 'fittamil-data.json'; a.click();
          URL.revokeObjectURL(url);
        }
      }}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <Download className="h-4 w-4" /> Export Data as JSON
      </button>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  );
}
