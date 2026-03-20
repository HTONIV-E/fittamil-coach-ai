import { X, Home, ClipboardList, Utensils, Dumbbell, Droplets, Bot, BarChart3, Calculator, Flame, BookOpen, Zap, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerNavProps {
  open: boolean;
  onClose: () => void;
  profile?: { name: string; gender: string } | null;
  streak: number;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const NAV_SECTIONS = [
  {
    label: '', items: [
      { id: 'dashboard', icon: Home, label: '🏠 Dashboard' },
      { id: 'myplan', icon: ClipboardList, label: '📋 My Plan' },
    ]
  },
  {
    label: 'Nutrition', items: [
      { id: 'meals', icon: Utensils, label: "🍽️ Today's Meals" },
      { id: 'mealplanner', icon: BookOpen, label: '📅 Meal Planner' },
      { id: 'calories', icon: Calculator, label: '🔢 Calorie Counter' },
      { id: 'recipes', icon: Utensils, label: '👨‍🍳 Recipes' },
    ]
  },
  {
    label: 'Training', items: [
      { id: 'workout', icon: Dumbbell, label: "💪 Today's Workout" },
      { id: 'challenges', icon: Zap, label: '🏆 Challenges' },
    ]
  },
  {
    label: 'Wellness', items: [
      { id: 'water', icon: Droplets, label: '💧 Water & Fasting' },
      { id: 'tips', icon: Wind, label: '🧘 Tips & Breathing' },
    ]
  },
  {
    label: '', items: [
      { id: 'coach', icon: Bot, label: '🤖 AI Coach' },
    ]
  },
  {
    label: 'Tracking', items: [
      { id: 'profile', icon: Home, label: '👤 Profile' },
      { id: 'progress', icon: BarChart3, label: '📈 Progress' },
      { id: 'bmi', icon: Calculator, label: '⚖️ BMI Calculator' },
    ]
  },
];

export function DrawerNav({ open, onClose, profile, streak, onNavigate, currentPage }: DrawerNavProps) {
  const avatar = profile?.gender === 'female' ? '👩' : profile?.gender === 'male' ? '👨' : '🧑';

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      )}

      {/* Drawer */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card transform transition-transform duration-300 ease-out',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-full flex-col">
          {/* User header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{avatar}</span>
              <div>
                <div className="font-semibold">{profile?.name || 'FitTamil User'}</div>
                <div className="flex items-center gap-1 text-xs text-ft-amber">
                  <Flame className="h-3 w-3" /> {streak} day streak
                </div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted active:scale-95">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {NAV_SECTIONS.map((section, si) => (
              <div key={si}>
                {section.label && (
                  <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {section.label}
                  </div>
                )}
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors active:scale-[0.98]',
                      currentPage === item.id
                        ? 'bg-primary/10 text-ft-cyan font-medium'
                        : 'text-foreground/80 hover:bg-muted'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className="gradient-text text-center font-heading text-lg">FitTamil AI</div>
          </div>
        </div>
      </div>
    </>
  );
}
