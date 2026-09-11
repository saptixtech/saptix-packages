'use client'

import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'
import { cn } from '@/lib/utils'

function Accordion({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="accordion"
      className={cn('divide-y divide-[var(--border)] border-y border-[var(--border)]', className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: CollapsiblePrimitive.Root.Props) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="accordion-item"
      className={cn('border-b border-[var(--border)] last:border-b-0', className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="accordion-trigger"
      className={cn(
        'focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-panel-open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200" />
    </CollapsiblePrimitive.Trigger>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="accordion-content"
      className={cn('overflow-hidden text-sm data-[ending-style]:animate-accordion-up data-[starting-style]:animate-accordion-down', className)}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </CollapsiblePrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
