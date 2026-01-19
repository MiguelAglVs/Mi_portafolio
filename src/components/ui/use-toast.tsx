// Este es un hook simple para toasts, puedes usar shadcn/ui o crear uno básico
import { useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null)

  const toastFn = (title: string, description?: string) => {
    setToast({ title, description: description || '' })

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      setToast(null)
    }, 5000)
  }

  return { toast, toast: toastFn }
}