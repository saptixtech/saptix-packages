'use client'

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date) => void
  disabled?: (date: Date) => boolean
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selected ? new Date(selected.getFullYear(), selected.getMonth(), 1) : new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d))
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const isSameDay = (d1?: Date, d2?: Date) => {
    if (!d1 || !d2) return false
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }

  const isToday = (d: Date) => isSameDay(d, new Date())

  return (
    <div data-slot="calendar" className={cn('p-3 bg-[var(--card)] rounded-xl border border-[var(--border)] w-fit', className)}>
      <div className="flex items-center justify-between pb-3">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">
          {monthNames[month]} {year}
        </h4>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={prevMonth}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={nextMonth}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground pb-1">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((d, index) => {
          if (!d) {
            return <div key={`empty-${index}`} className="h-8 w-8" />
          }
          const isSel = isSameDay(d, selected)
          const isTod = isToday(d)
          const isDisabled = disabled ? disabled(d) : false

          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect?.(d)}
              className={cn(
                'h-8 w-8 rounded-lg font-medium transition-colors flex items-center justify-center',
                isSel && 'bg-primary text-primary-foreground hover:bg-primary/90 font-bold',
                !isSel && isTod && 'border border-primary text-primary font-semibold',
                !isSel && !isTod && 'hover:bg-muted text-[var(--text-primary)]',
                isDisabled && 'opacity-30 pointer-events-none'
              )}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar }
