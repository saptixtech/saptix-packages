import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

export interface SliderProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, 'value' | 'defaultValue'> {
  value?: number | number[]
  defaultValue?: number | number[]
  onChange?: (e: any) => void
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, value, defaultValue, onChange, onValueChange, ...props }, ref) => {
  const normValue = typeof value === 'number' ? [value] : value
  const normDefaultValue = typeof defaultValue === 'number' ? [defaultValue] : defaultValue

  const handleValueChange = (newVal: number[]) => {
    if (onValueChange) onValueChange(newVal)
    if (onChange) onChange({ target: { value: newVal[0] } })
  }

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      value={normValue}
      defaultValue={normDefaultValue}
      onValueChange={handleValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary/80 border border-border/40">
        <SliderPrimitive.Range className="absolute h-full bg-primary transition-all" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing hover:scale-110 active:scale-125 shadow-md" />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
