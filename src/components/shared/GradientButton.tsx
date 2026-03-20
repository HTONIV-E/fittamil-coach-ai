import React from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'alert';
  fullWidth?: boolean;
}

export function GradientButton({ variant = 'primary', fullWidth, className, children, ...props }: GradientButtonProps) {
  const gradientClass = variant === 'success' ? 'gradient-success' : variant === 'alert' ? 'gradient-alert' : 'gradient-primary';
  return (
    <button
      className={cn(
        gradientClass,
        'rounded-xl px-6 py-3.5 font-semibold text-background transition-all active:scale-[0.97]',
        'shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30',
        'disabled:opacity-50 disabled:pointer-events-none',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
