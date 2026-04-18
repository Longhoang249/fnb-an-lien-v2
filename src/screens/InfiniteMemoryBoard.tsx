import React, { useState, useRef, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/authContext'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface MemoryCard {
  id: string
  x: number
  y: number
  imageUrl?: string
  caption?: string
  color: string
  width: number
  height: number
  zIndex: number
}

const CARD_COLORS = [
  'bg-yellow-100 border-yellow-300',
  'bg-pink-100 border-pink-300',
  'bg-blue-100 border-blue-300',
  'bg-green-100 border-green-300',
  'bg-purple-100 border-purple-300',
  'bg-orange-100 border-orange-300',
]

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export default function InfiniteMemoryBoard() {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [cards, setCards] = useState<MemoryCard[]>([
    {
      id: 'welcome',
      x: 60,
      y: 60,
      caption: 'Chào mừng đến với Memory Board! 🎉\nKéo thả để sắp xếp kỷ niệm của Đại Ca.',
      color: CARD_COLORS[0],
      width: 220,
      height: 120,
      zIndex: 1,
    },
    {
      id: 'tip',
      x: 320,
      y: 100,
      caption: '📌 Nhấn nút "+ Thêm Ghi Chú"\nđể tạo thẻ mới với ảnh hoặc caption!',
      color: CARD_COLORS[1],
      width: 200,
      height: 100,
      zIndex: 1,
    },
  ])
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [maxZ, setMaxZ] = useState(1)
  const [editingCaption, setEditingCaption] = useState<string | null>(null)

  // Bring to front
  const bringToFront = useCallback((id: string) => {
    setMaxZ((z) => {
      const next = z + 1
      setCards((cs) => cs.map((c) => (c.id === id ? { ...c, zIndex: next } : c)))
      return next
    })
  }, [])

  const handleMouseDown = (e: React.MouseEvent, cardId: string) => {
    e.preventDefault()
    const card = cards.find((c) => c.id === cardId)
    if (!card) return
    bringToFront(cardId)
    setDragging(cardId)
    setDragOffset({ x: e.clientX - card.x, y: e.clientY - card.y })
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return
      setCards((cs) =>
        cs.map((c) =>
          c.id === dragging ? { ...c, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } : c
        )
      )
    },
    [dragging, dragOffset]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const handleAddCard = () => {
    const newCard: MemoryCard = {
      id: generateId(),
      x: 100 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      color: CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)],
      caption: 'Ghi chú mới ✍️',
      width: 200,
      height: 120,
      zIndex: maxZ + 1,
    }
    setMaxZ((z) => z + 1)
    setCards((cs) => [...cs, newCard])
  }

  const handleImageUpload = async (cardId: string, file: File) => {
    if (!user) return
    try {
      const path = `memory/${user.id}/${cardId}_${Date.now()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from('memory-board')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('memory-board').getPublicUrl(path)
      setCards((cs) =>
        cs.map((c) => (c.id === cardId ? { ...c, imageUrl: urlData.publicUrl } : c))
      )
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  const updateCaption = (cardId: string, caption: string) => {
    setCards((cs) => cs.map((c) => (c.id === cardId ? { ...c, caption } : c)))
    setEditingCaption(null)
  }

  const deleteCard = (cardId: string) => {
    setCards((cs) => cs.filter((c) => c.id !== cardId))
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-cream to-background">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 select-none"
        style={{ cursor: dragging ? 'grabbing' : 'default' }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={cn(
              'absolute rounded-2xl shadow-card border-2 p-4 flex flex-col gap-2 transition-shadow',
              card.color,
              dragging === card.id && 'shadow-soft cursor-grabbing'
            )}
            style={{
              left: card.x,
              top: card.y,
              width: card.width,
              minHeight: card.height,
              zIndex: card.zIndex,
            }}
            onMouseDown={(e) => handleMouseDown(e, card.id)}
          >
            {/* Card header: drag handle + delete */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground cursor-grab">⋮⋮ Kéo để di chuyển</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteCard(card.id)
                }}
                className="text-muted-foreground hover:text-destructive text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Image or caption */}
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt="Memory"
                className="w-full h-32 object-cover rounded-lg"
                draggable={false}
              />
            ) : editingCaption === card.id ? (
              <textarea
                autoFocus
                className="w-full text-sm text-foreground bg-transparent border-none resize-none focus:outline-none leading-relaxed"
                defaultValue={card.caption}
                onBlur={(e) => updateCaption(card.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setEditingCaption(null)
                }}
                rows={3}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p
                className="text-sm text-foreground leading-relaxed whitespace-pre-line cursor-text flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditingCaption(card.id)
                }}
              >
                {card.caption}
              </p>
            )}

            {/* Upload image button */}
            <div onClick={(e) => e.stopPropagation()}>
              <label className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                Thêm ảnh
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void handleImageUpload(card.id, file)
                  }}
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-surface border border-border rounded-full px-5 py-3 shadow-soft">
        <Button variant="primary" size="sm" onClick={handleAddCard}>
          + Thêm Ghi Chú
        </Button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{cards.length} thẻ</span>
          <span>·</span>
          <span>Kéo thả để di chuyển</span>
        </div>
      </div>
    </div>
  )
}
