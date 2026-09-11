'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface AspectRatioProps extends React.ComponentProps<'div'> {
  ratio?: number
}

function AspectRatio({
  ratio = 16 / 9,
  className,
  children,
  style,
  ...props
}: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${(1 / ratio) * 100}%`,
        ...style,
      }}
      className={cn('overflow-hidden', className)}
      {...props}
    >
      <div className="absolute inset-0 h-full w-full">{children}</div>
    </div>
  )
}

export { AspectRatio }
