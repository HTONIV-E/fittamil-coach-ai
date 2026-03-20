import { cn } from '@/lib/utils';

interface SelectCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: string;
  label: string;
  description?: string;
  className?: string;
}

export function SelectCard({ selected, onClick, icon, label, description, className }: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 transition-all active:scale-[0.97]',
        selected
          ? 'border-primary bg-primary/10 shadow-md shadow-primary/10'
          : 'border-border bg-card hover:border-muted-foreground/30',
        className
      )}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span className={cn('font-semibold text-sm', selected && 'text-ft-cyan')}>{label}</span>
      {description && <span className="text-xs text-muted-foreground text-center leading-tight">{description}</span>}
    </button>
  );
}
