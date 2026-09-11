import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { Input as InputPrimitive } from '@base-ui/react/input'

import { cn } from '@/lib/utils'

const inputVariants = cva(
  'border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 w-full min-w-0 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm',
  {
    variants: {
      size: {
        default: 'h-9',
        sm: 'h-8 text-xs',
        lg: 'h-11 text-base'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {}

function Input({ className, type, size, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot='input'
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  )
}

export { Input }
