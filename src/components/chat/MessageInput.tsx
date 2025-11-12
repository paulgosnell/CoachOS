'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface MessageInputProps {
  onSend: (message: string) => Promise<void>
  disabled?: boolean
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || sending || disabled) return

    setSending(true)
    try {
      await onSend(message.trim())
      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-end gap-3">
        <div className="relative flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || sending}
            placeholder="Message..."
            rows={1}
            className="w-full resize-none rounded-2xl border border-white/10 bg-titanium-800/50 px-4 py-3 pr-12 text-sm text-silver placeholder:text-gray-500 focus:border-white/20 focus:outline-none focus:ring-0"
            style={{
              minHeight: '44px',
              maxHeight: '120px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = '44px'
              target.style.height = Math.min(target.scrollHeight, 120) + 'px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim() || sending || disabled}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-deep-blue-700 text-silver transition-all hover:bg-deep-blue-600 disabled:opacity-50 active:scale-95"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </form>
  )
}
