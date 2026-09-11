'use client'

import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function NavigationMenu({
  className,
  children,
  ...props
}: React.ComponentProps<'nav'>) {
  return (
    <nav
      data-slot="navigation-menu"
      className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
      {...props}
    >
      {children}
    </nav>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
      {...props}
    />
  )
}

function NavigationMenuItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="navigation-menu-item" {...props} />
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      data-slot="navigation-menu-trigger"
      className={cn(
        'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </button>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="navigation-menu-content"
      className={cn(
        'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out md:absolute md:w-auto',
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<'a'>) {
  return (
    <a
      data-slot="navigation-menu-link"
      className={cn(
        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-xs',
        className
      )}
      {...props}
    />
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
}
