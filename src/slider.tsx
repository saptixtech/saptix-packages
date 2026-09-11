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
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing" />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
