'use client'

import * as React from 'react'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { cn } from '@/lib/utils'

function Menubar({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="menubar"
      className={cn(
        'flex h-9 items-center gap-1 rounded-md border border-[var(--border)] bg-background p-1 shadow-xs',
        className
      )}
      {...props}
    />
  )
}

function MenubarMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menubar-menu" {...props} />
}

function MenubarTrigger({
  className,
  ...props
}: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        'flex cursor-default select-none items-center rounded-sm px-3 py-1 text-xs font-medium outline-none hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = 'start',
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: MenuPrimitive.Popup.Props & Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'sideOffset'>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className="isolate z-50 outline-none"
      >
        <MenuPrimitive.Popup
          data-slot="menubar-content"
          className={cn(
            'bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 min-w-48 overflow-hidden rounded-md border border-[var(--border)] p-1 text-xs shadow-md',
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function MenubarItem({
  className,
  inset,
  ...props
}: MenuPrimitive.Item.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.Item
      data-slot="menubar-item"
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menubar-separator"
      className={cn('-mx-1 my-1 h-px bg-[var(--border)]', className)}
      {...props}
    />
  )
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn('ml-auto text-[10px] tracking-widest text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
}
