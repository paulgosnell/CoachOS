import { User, Bot } from 'lucide-react'
import { AudioPlayer } from '@/components/voice/AudioPlayer'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  showAudio?: boolean
}

export function MessageBubble({ role, content, timestamp, showAudio = false }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-gradient-to-br from-silver to-silver-dark'
            : 'bg-gradient-to-br from-deep-blue-800 to-silver-darker'
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-titanium-900" />
        ) : (
          <Bot className="h-4 w-4 text-silver" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'message-user bg-deep-blue-800 text-silver-light rounded-br-md'
              : 'message-coach bg-titanium-900/50 border border-white/5 text-silver-light rounded-bl-md'
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>

          {/* Audio Player for assistant messages */}
          {!isUser && showAudio && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <AudioPlayer text={content} />
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="mt-1 text-xs text-gray-500">
          {timestamp.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  )
}
