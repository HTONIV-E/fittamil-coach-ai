import { useState } from 'react';
import { ProfileMeta } from '@/types/fitness';
import { Plus } from 'lucide-react';

interface ProfilePickerProps {
  profiles: ProfileMeta[];
  onSelectProfile: (id: number) => void;
  onAddProfile: (name: string, emoji: string) => void;
}

const EMOJI_OPTIONS = ['👨', '👩', '🧑', '👦', '👧', '💪', '🏃', '🧘', '🤸', '👶'];

export function ProfilePicker({ profiles, onSelectProfile, onAddProfile }: ProfilePickerProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🧑');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAddProfile(name.trim(), emoji);
    setName('');
    setEmoji('🧑');
    setAdding(false);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-mobile flex-col items-center justify-center bg-background px-6">
      <h1 className="font-heading text-4xl gradient-text mb-2">FitTamil AI</h1>
      <p className="text-muted-foreground mb-10">Who's working out?</p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {profiles.map(p => (
          <button
            key={p.id}
            onClick={() => onSelectProfile(p.id)}
            className="ft-card flex flex-col items-center gap-3 py-6 hover:border-primary/50 transition-all active:scale-95"
          >
            <span className="text-5xl">{p.emoji}</span>
            <span className="font-medium text-sm">{p.name}</span>
          </button>
        ))}

        {profiles.length < 5 && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="ft-card flex flex-col items-center gap-3 py-6 border-dashed hover:border-primary/50 transition-all active:scale-95"
          >
            <Plus className="h-10 w-10 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Add Profile</span>
          </button>
        )}
      </div>

      {adding && (
        <div className="mt-8 w-full max-w-xs ft-card space-y-4">
          <h3 className="font-heading text-lg">New Profile</h3>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Choose Avatar</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} onClick={() => setEmoji(e)}
                  className={`text-2xl p-1.5 rounded-lg transition-all ${emoji === e ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-muted'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Profile name"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 gradient-primary text-background rounded-lg py-2.5 text-sm font-medium">Create</button>
            <button onClick={() => setAdding(false)} className="px-4 border border-border rounded-lg py-2.5 text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
