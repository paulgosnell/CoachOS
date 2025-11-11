import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-deep-blue-800 to-silver-darker">
        <Bot className="h-4 w-4 text-silver" />
      </div>

      {/* Typing Animation */}
      <div className="flex items-center rounded-2xl rounded-bl-md border border-white/5 bg-titanium-900/50 px-4 py-3">
        <div className="flex space-x-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-silver-dark [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-silver-dark [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-silver-dark"></div>
        </div>
      </div>
    </div>
  )
}
