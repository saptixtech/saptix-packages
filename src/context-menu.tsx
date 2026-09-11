'use client'

import * as React from 'react'
import { CheckIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContextMenuContextType {
  open: boolean
  setOpen: (open: boolean) => void
  position: { x: number; y: number }
  setPosition: (pos: { x: number; y: number }) => void
}

const ContextMenuContext = React.createContext<ContextMenuContextType | null>(null)

function ContextMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    const handleClose = () => setOpen(false)
    if (open) {
      window.addEventListener('click', handleClose)
      window.addEventListener('contextmenu', handleClose)
    }
    return () => {
      window.removeEventListener('click', handleClose)
      window.removeEventListener('contextmenu', handleClose)
    }
  }, [open])

  return (
    <ContextMenuContext.Provider value={{ open, setOpen, position, setPosition }}>
      <div data-slot="context-menu" className="relative">
        {children}
      </div>
    </ContextMenuContext.Provider>
  )
}

function ContextMenuTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const ctx = React.useContext(ContextMenuContext)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!ctx) return
    ctx.setPosition({ x: e.clientX, y: e.clientY })
    ctx.setOpen(true)
  }

  return (
    <div
      data-slot="context-menu-trigger"
      onContextMenu={handleContextMenu}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
}

function ContextMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const ctx = React.useContext(ContextMenuContext)
  if (!ctx || !ctx.open) return null

  return (
    <div
      data-slot="context-menu-content"
      style={{
        position: 'fixed',
        left: `${ctx.position.x}px`,
        top: `${ctx.position.y}px`,
        zIndex: 50,
      }}
      className={cn(
        'min-w-[8rem] overflow-hidden rounded-md border border-[var(--border)] bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function ContextMenuItem({
  className,
  inset,
  children,
  onClick,
  ...props
}: React.ComponentProps<'div'> & { inset?: boolean }) {
  const ctx = React.useContext(ContextMenuContext)

  return (
    <div
      data-slot="context-menu-item"
      onClick={(e) => {
        onClick?.(e)
        ctx?.setOpen(false)
      }}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'pl-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="context-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-[var(--border)]', className)}
      {...props}
    />
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<'div'> & { inset?: boolean }) {
  return (
    <div
      data-slot="context-menu-label"
      className={cn(
        'px-2 py-1.5 text-xs font-semibold text-foreground',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
}
