'use client'

import * as React from 'react'
import { Dialog as DrawerPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({ className, ...props }: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/40 duration-150 backdrop-blur-xs',
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DrawerPrimitive.Popup.Props & { showCloseButton?: boolean }) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Popup
        data-slot="drawer-content"
        className={cn(
          'bg-popover text-popover-foreground fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[85vh] flex-col rounded-t-2xl border-t border-[var(--border)] p-6 shadow-2xl duration-200 outline-none animate-in slide-in-from-bottom',
          className
        )}
        {...props}
      >
        <div className="mx-auto -mt-3 mb-4 h-1.5 w-12 rounded-full bg-muted" />
        {children}
        {showCloseButton && (
          <DrawerPrimitive.Close
            data-slot="drawer-close"
            render={<Button variant="ghost" className="absolute top-4 right-4" size="icon-sm" />}
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DrawerPrimitive.Close>
        )}
      </DrawerPrimitive.Popup>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="drawer-header" className={cn('grid gap-1.5 text-center sm:text-left', className)} {...props} />
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="drawer-footer" className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
}

function DrawerDescription({ className, ...props }: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
