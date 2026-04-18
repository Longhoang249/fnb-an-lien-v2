import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { ChatBubble, TypingBubble, type Message } from '@/components/chat/ChatBubble'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/authContext'
import { useGamificationStore } from '@/lib/store/gamificationStore'
import { invokeAIFunction } from '@/lib/aiAdapter'

const GOLD_COST_PER_REQUEST = 5

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

const WELCOME_MSG: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Chào Đại Ca! 🍵\n\nTiểu Đệ là trợ lý AI marketing cho quán FnB Việt Nam. Đại Ca cần hỗ trợ gì hôm nay?\n\n• ✍️ Viết bài Facebook\n• 🎨 Tạo ảnh concept\n• 📋 Lên kế hoạch nội dung\n• 💬 Trả lời review khách',
  timestamp: new Date(),
}

const SUGGESTIONS = [
  { emoji: '✍️', label: 'Viết bài Facebook', prompt: 'Viết cho tôi một bài Facebook giới thiệu quán trà sữa của tôi' },
  { emoji: '🎨', label: 'Tạo ảnh concept', prompt: 'Tạo mô tả ảnh concept cho món trà sữa' },
  { emoji: '📋', label: 'Kế hoạch tháng', prompt: 'Lên kế hoạch content cho tháng này' },
  { emoji: '🏷️', label: 'Viết caption', prompt: 'Viết caption ngắn hấp dẫn cho bài đăng Instagram' },
]

function GoldBadge({ amount }: { amount: number }) {
  return (
    <div className="flex items-center gap-1.5 bg-gold/10 border border-gold/30 rounded-full px-3 py-1.5">
      <span className="text-sm">💰</span>
      <span className="text-sm font-semibold text-gold">{amount}</span>
    </div>
  )
}

export default function AIChat() {
  const { user, sessionActive } = useAuth()
  const { profile, deductGold, addXp } = useGamificationStore()
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingGold, setPendingGold] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user) return

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setError(null)

    // Optimistic gold deduction
    const deducted = await deductGold(GOLD_COST_PER_REQUEST, user.id)
    if (!deducted) {
      setIsTyping(false)
      return
    }

    setPendingGold(true)

    try {
      const { data: sessionData } = await import('@/lib/supabase/client').then(m => m.supabase.auth.getSession())
      const token = sessionData?.session?.access_token ?? ''

      const result = await invokeAIFunction('content_writer', {
        feature: 'content_writer',
        prompt: content.trim(),
        userId: user.id,
      }, token, { retries: 2, goldCost: GOLD_COST_PER_REQUEST })

      if (result.success && result.data && typeof result.data === 'object' && 'content' in result.data) {
        const aiMsg: Message = {
          id: generateId(),
          role: 'assistant',
          content: (result.data as { content: string }).content,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMsg])
        addXp(10, user.id)
      } else {
        throw new Error(result.error ?? 'Không nhận được phản hồi từ AI')
      }
    } catch (err) {
      // Rollback gold if needed (handled by deductGold optimistic logic)
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      // Remove the failed user message
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsTyping(false)
      setPendingGold(false)
    }
  }

  const handleSuggestion = (prompt: string) => {
    sendMessage(prompt)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface shrink-0">
        <div>
          <h2 className="font-display font-bold text-foreground">Matcha AI 🍵</h2>
          <p className="text-xs text-muted-foreground">Trợ lý marketing thông minh</p>
        </div>
        <div className="flex items-center gap-3">
          <GoldBadge amount={pendingGold ? Math.max(0, profile.gold - GOLD_COST_PER_REQUEST) : profile.gold} />
          <div className="text-xs text-muted-foreground">
            -{GOLD_COST_PER_REQUEST} gold/request
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Not authenticated notice */}
      {!sessionActive && (
        <div className="mx-6 mt-4 p-3 rounded-lg bg-amber-rich/10 border border-amber-rich/20 text-sm text-amber-rich">
          Vui lòng đăng nhập để sử dụng AI Chat.
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingBubble />}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && !isTyping && (
        <div className="px-6 pb-4 shrink-0">
          <p className="text-xs text-muted-foreground mb-3">Gợi ý nhanh:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSuggestion(s.prompt)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-surface text-sm text-foreground hover:border-gold hover:bg-gold/5 transition-all"
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t border-border bg-surface shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhắn cho Tiểu Đệ..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-input-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors max-h-32"
            style={{ minHeight: '44px', maxHeight: '128px' }}
          />
          <Button
            variant="primary"
            size="md"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping || !sessionActive}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          💡 Nhấn Enter để gửi, Shift+Enter để xuống dòng
        </p>
      </div>
    </div>
  )
}