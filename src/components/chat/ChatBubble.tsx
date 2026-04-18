import { cn } from '@/lib/utils'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  imageUrl?: string
}

interface ChatBubbleProps {
  message: Message
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
          isUser ? 'bg-gold text-primary' : 'bg-primary text-cream'
        )}
      >
        {isUser ? 'U' : '🤖'}
      </div>

      {/* Bubble */}
      <div className={cn('max-w-[70%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
            isUser
              ? 'bg-gold text-primary rounded-br-md'
              : 'bg-surface border border-border text-foreground rounded-bl-md'
          )}
        >
          {message.content}
        </div>
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="AI Generated"
            className="mt-2 rounded-xl max-w-full shadow-card"
          />
        )}
        <p className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

export function TypingBubble() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-primary text-cream flex items-center justify-center shrink-0 text-xs font-bold">
        🤖
      </div>
      <div className="bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
