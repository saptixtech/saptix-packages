'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

function Tabs({ className, orientation = 'horizontal', ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot='tabs'
      data-orientation={orientation}
      className={cn('group/tabs flex gap-3 data-horizontal:flex-col', className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  'group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center rounded-xl p-1 group-data-horizontal/tabs:h-10 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none',
  {
    variants: {
      variant: {
        default: 'bg-muted/70 border border-border/50',
        line: 'gap-1 bg-transparent',
        pills: 'gap-1.5 bg-muted/40 p-1 border border-border/40 rounded-xl',
        underline: 'gap-0 bg-transparent border-b border-border rounded-none p-0 h-auto'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

function TabsList({
  className,
  variant = 'default',
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot='tabs-list'
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, count, children, ...props }: TabsPrimitive.Tab.Props & { count?: number | string }) {
  return (
    <TabsPrimitive.Tab
      data-slot='tabs-trigger'
      className={cn(
        "text-foreground/70 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-2px)] flex-1 items-center justify-center gap-2 rounded-lg border border-transparent px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-all duration-150 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        'group-data-[variant=default]/tabs-list:data-active:bg-background group-data-[variant=default]/tabs-list:data-active:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-xs dark:group-data-[variant=default]/tabs-list:data-active:bg-input/40',
        'group-data-[variant=pills]/tabs-list:bg-transparent group-data-[variant=pills]/tabs-list:text-muted-foreground group-data-[variant=pills]/tabs-list:hover:bg-muted/60 group-data-[variant=pills]/tabs-list:hover:text-foreground group-data-[variant=pills]/tabs-list:rounded-lg group-data-[variant=pills]/tabs-list:data-active:bg-primary group-data-[variant=pills]/tabs-list:data-active:text-primary-foreground group-data-[variant=pills]/tabs-list:data-active:shadow-sm',
        'group-data-[variant=underline]/tabs-list:text-muted-foreground group-data-[variant=underline]/tabs-list:hover:text-foreground group-data-[variant=underline]/tabs-list:bg-transparent group-data-[variant=underline]/tabs-list:rounded-none group-data-[variant=underline]/tabs-list:border-b-2 group-data-[variant=underline]/tabs-list:border-transparent group-data-[variant=underline]/tabs-list:data-active:border-primary group-data-[variant=underline]/tabs-list:data-active:text-primary group-data-[variant=underline]/tabs-list:data-active:bg-transparent group-data-[variant=underline]/tabs-list:py-2.5',
        className
      )}
      {...props}
    >
      {children}
      {count !== undefined && (
        <span className="inline-flex items-center justify-center rounded-full bg-primary-foreground/20 group-data-[variant=pills]/tabs-list:group-data-active/tabs-trigger:bg-white/25 group-data-[variant=pills]/tabs-list:group-data-active/tabs-trigger:text-white px-1.5 py-0.25 text-[10px] font-bold">
          {count}
        </span>
      )}
    </TabsPrimitive.Tab>
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel data-slot='tabs-content' className={cn('flex-1 text-sm outline-none transition-opacity duration-150', className)} {...props} />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
