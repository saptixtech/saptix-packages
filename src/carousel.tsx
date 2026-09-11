'use client'

import * as React from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type CarouselContextProps = {
  carouselRef: React.RefObject<HTMLDivElement | null>
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }
  return context
}

function Carousel({
  orientation = 'horizontal',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  orientation?: 'horizontal' | 'vertical'
}) {
  const carouselRef = React.useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(true)

  const checkScroll = React.useCallback(() => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollPrev(scrollLeft > 0)
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 5)
  }, [])

  React.useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scrollPrev = React.useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -carouselRef.current.clientWidth * 0.8, behavior: 'smooth' })
    }
  }, [])

  const scrollNext = React.useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.clientWidth * 0.8, behavior: 'smooth' })
    }
  }, [])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        data-slot="carousel"
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef } = useCarousel()

  return (
    <div
      ref={carouselRef}
      data-slot="carousel-content"
      className={cn('flex gap-4 overflow-x-auto scroll-smooth no-scrollbar', className)}
      {...props}
    />
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = 'outline',
  size = 'icon-sm',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn('absolute -left-3 top-1/2 -translate-y-1/2 rounded-full z-10 shadow-md', className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = 'outline',
  size = 'icon-sm',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn('absolute -right-3 top-1/2 -translate-y-1/2 rounded-full z-10 shadow-md', className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRightIcon className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
