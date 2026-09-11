'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'default' | 'lg';
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, size = 'default', children, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          'pointer-events-none inline-flex select-none items-center justify-center font-mono font-medium text-muted-foreground shadow-xs',
          'bg-muted/80 border border-border/80 rounded-md',
          {
            'h-4 min-w-[16px] px-1 text-[10px]': size === 'sm',
            'h-5 min-w-[20px] px-1.5 text-[11px]': size === 'default',
            'h-6 min-w-[24px] px-2 text-xs': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </kbd>
    );
  }
);
Kbd.displayName = 'Kbd';

export { Kbd };
