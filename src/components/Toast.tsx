'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface ToastProps {
  message: string
  show: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, show, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  if (!show) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-slide-up">
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-titanium-900/95 px-4 py-3 shadow-2xl backdrop-blur-sm">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
        <p className="text-sm font-medium text-silver">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-silver-light transition-colors hover:text-silver"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
