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
      <div className="flex items-center gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || sending}
          placeholder="Message..."
          rows={1}
          className="flex-1 resize-none rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-base text-silver placeholder:text-gray-500 focus:border-white/20 focus:outline-none"
          style={{
            minHeight: '42px',
            maxHeight: '100px',
            fontSize: '16px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = '42px'
            target.style.height = Math.min(target.scrollHeight, 100) + 'px'
          }}
        />

        <button
          type="submit"
          disabled={!message.trim() || sending || disabled}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-deep-blue-700 text-silver transition-colors hover:bg-deep-blue-600 disabled:opacity-40"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  )
}
