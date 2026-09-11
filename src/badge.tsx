import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'group/badge focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 inline-flex h-5.5 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-all focus-visible:ring-[3px] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs [a]:hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        destructive:
          'bg-destructive/15 text-destructive border-destructive/20 focus-visible:ring-destructive/20 dark:bg-destructive/25 dark:border-destructive/30 [a]:hover:bg-destructive/25',
        outline: 'border-border text-foreground bg-background/50 [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
        success: 'bg-success/15 text-success border-success/30 dark:bg-success/25 dark:border-success/40 [a]:hover:bg-success/25',
        warning: 'bg-warning/15 text-warning border-warning/30 dark:bg-warning/25 dark:border-warning/40 [a]:hover:bg-warning/25',
        info: 'bg-info/15 text-info border-info/30 dark:bg-info/25 dark:border-info/40 [a]:hover:bg-info/25',
        link: 'text-primary underline-offset-4 hover:underline'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface BadgeProps
  extends useRender.ComponentProps<'span'>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean
}

function Badge({
  className,
  variant = 'default',
  pulse = false,
  children,
  render,
  ...props
}: BadgeProps) {
  const content = (
    <>
      {pulse && (
        <span className="relative flex size-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full size-1.5 bg-current" />
        </span>
      )}
      {children}
    </>
  )

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
        children: content
      },
      props
    ),
    render,
    state: {
      slot: 'badge',
      variant
    }
  })
}

export { Badge, badgeVariants }
