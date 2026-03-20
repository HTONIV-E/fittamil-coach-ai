import { useState } from 'react';
import { Menu, Flame } from 'lucide-react';
import { DrawerNav } from './DrawerNav';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  title: string;
  children: React.ReactNode;
  streak?: number;
  profile?: { name: string; gender: string } | null;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function MobileLayout({ title, children, streak = 0, profile, onNavigate, currentPage }: MobileLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="mx-auto flex min-h-screen max-w-mobile flex-col bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-40 flex h-14 items-center justify-between px-4">
        <button onClick={() => setDrawerOpen(true)} className="rounded-lg p-2 hover:bg-muted active:scale-95 transition-transform">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-xl tracking-wide">{title}</h1>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">{dateStr}</span>
          {streak > 0 && (
            <span className="flex items-center gap-0.5 text-ft-amber">
              <Flame className="h-4 w-4" />{streak}
            </span>
          )}
        </div>
      </header>

      {/* Drawer */}
      <DrawerNav
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        profile={profile}
        streak={streak}
        onNavigate={(page) => { onNavigate(page); setDrawerOpen(false); }}
        currentPage={currentPage}
      />

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-8 pt-4">
        {children}
      </main>
    </div>
  );
}
