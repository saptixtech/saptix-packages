'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastDescription,
  ToastTitle
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div
      data-slot="toaster"
      className="fixed bottom-0 right-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-2 pointer-events-none"
    >
      {toasts.map(function ({ id, title, description, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} onClose={() => dismiss(id)} {...props}>
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </Toast>
        )
      })}
    </div>
  )
}
