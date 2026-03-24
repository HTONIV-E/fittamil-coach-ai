import { useState } from 'react';
import { ProfileMeta } from '@/types/fitness';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface ProfilePickerProps {
  profiles: ProfileMeta[];
  onSelectProfile: (id: number) => void;
  onAddProfile: (name: string, emoji: string) => void;
  onDeleteProfile?: (id: number) => void;
  onEditProfile?: (id: number, name: string, emoji: string) => void;
}

const EMOJI_OPTIONS = ['👨', '👩', '🧑', '👦', '👧', '💪', '🏃', '🧘', '🤸', '👶'];

export function ProfilePicker({ profiles, onSelectProfile, onAddProfile, onDeleteProfile, onEditProfile }: ProfilePickerProps) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<ProfileMeta | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🧑');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAddProfile(name.trim(), emoji);
    setName('');
    setEmoji('🧑');
    setAdding(false);
  };

  const startEdit = (p: ProfileMeta) => {
    setEditing(p);
    setName(p.name);
    setEmoji(p.emoji);
    setAdding(false);
  };

  const handleEdit = () => {
    if (!editing || !name.trim() || !onEditProfile) return;
    onEditProfile(editing.id, name.trim(), emoji);
    setEditing(null);
    setName('');
    setEmoji('🧑');
  };

  const handleDelete = (id: number) => {
    onDeleteProfile?.(id);
    setConfirmDelete(null);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-mobile flex-col items-center justify-center bg-background px-6">
      <h1 className="font-heading text-4xl gradient-text mb-2">FitTamil AI</h1>
      <p className="text-muted-foreground mb-10">Who's working out?</p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {profiles.map(p => (
          <div key={p.id} className="relative group">
            <button
              onClick={() => onSelectProfile(p.id)}
              className="ft-card w-full flex flex-col items-center gap-3 py-6 hover:border-primary/50 transition-all active:scale-95"
            >
              <span className="text-5xl">{p.emoji}</span>
              <span className="font-medium text-sm">{p.name}</span>
            </button>
            {/* Edit & Delete buttons */}
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEditProfile && (
                <button onClick={(e) => { e.stopPropagation(); startEdit(p); }}
                  className="p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              {onDeleteProfile && profiles.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(p.id); }}
                  className="p-1.5 rounded-md bg-muted/80 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {profiles.length < 5 && !adding && !editing && (
          <button
            onClick={() => { setAdding(true); setEditing(null); setName(''); setEmoji('🧑'); }}
            className="ft-card flex flex-col items-center gap-3 py-6 border-dashed hover:border-primary/50 transition-all active:scale-95"
          >
            <Plus className="h-10 w-10 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Add Profile</span>
          </button>
        )}
      </div>

      {/* Confirm delete dialog */}
      {confirmDelete !== null && (
        <div className="mt-8 w-full max-w-xs ft-card space-y-4">
          <h3 className="font-heading text-lg text-destructive">Delete Profile?</h3>
          <p className="text-sm text-muted-foreground">This will permanently delete all data for this profile.</p>
          <div className="flex gap-2">
            <button onClick={() => handleDelete(confirmDelete)}
              className="flex-1 bg-destructive text-destructive-foreground rounded-lg py-2.5 text-sm font-medium">
              Delete
            </button>
            <button onClick={() => setConfirmDelete(null)}
              className="px-4 border border-border rounded-lg py-2.5 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit form */}
      {(adding || editing) && (
        <div className="mt-8 w-full max-w-xs ft-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg">{editing ? 'Edit Profile' : 'New Profile'}</h3>
            <button onClick={() => { setAdding(false); setEditing(null); }} className="p-1 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
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
            <button onClick={editing ? handleEdit : handleAdd}
              className="flex-1 gradient-primary text-background rounded-lg py-2.5 text-sm font-medium">
              {editing ? 'Save' : 'Create'}
            </button>
            <button onClick={() => { setAdding(false); setEditing(null); }}
              className="px-4 border border-border rounded-lg py-2.5 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
