import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: 'primary' | 'success' | 'alert';
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({ value, max, variant = 'primary', label, showValue, className }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const gradientClass = variant === 'success' ? 'gradient-success' : variant === 'alert' ? 'gradient-alert' : 'gradient-primary';

  return (
    <div className={cn('space-y-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showValue && <span className="font-mono font-medium">{value}/{max}</span>}
        </div>
      )}
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(gradientClass, 'h-full rounded-full transition-all duration-700 ease-out')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
