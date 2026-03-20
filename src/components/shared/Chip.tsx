import { cn } from '@/lib/utils';

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export function Chip({ label, selected, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.97]',
        selected
          ? 'gradient-primary text-background shadow-md'
          : 'border border-border bg-card text-foreground hover:border-muted-foreground/40',
        className
      )}
    >
      {label}
    </button>
  );
}
