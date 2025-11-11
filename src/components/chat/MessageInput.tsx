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
    <form onSubmit={handleSubmit} className="border-t border-white/5 bg-titanium-900/80 p-4">
      <div className="mx-auto flex max-w-4xl items-end gap-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || sending}
          placeholder="Type your message... (Shift + Enter for new line)"
          rows={1}
          className="input flex-1 resize-none py-3"
          style={{
            minHeight: '48px',
            maxHeight: '200px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = '48px'
            target.style.height = Math.min(target.scrollHeight, 200) + 'px'
          }}
        />

        <button
          type="submit"
          disabled={!message.trim() || sending || disabled}
          className="btn btn-primary h-12 w-12 flex-shrink-0 p-0"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>

      <p className="mx-auto mt-2 max-w-4xl text-center text-xs text-gray-500">
        Press Enter to send • Shift + Enter for new line
      </p>
    </form>
  )
}
