import type { EmojiSet, PhotoConfig, ContentTone } from './types'
import { cn } from '@/lib/utils'

interface ContentTabProps {
  emojiSet: EmojiSet
  photoConfig: PhotoConfig
  contentTone: ContentTone
  emojiFrequency: 'none' | 'low' | 'medium' | 'high'
  onChange: (updates: { emojiSet?: EmojiSet; photoConfig?: PhotoConfig; contentTone?: ContentTone; emojiFrequency?: 'none' | 'low' | 'medium' | 'high' }) => void
}

const EMOJI_SETS: { value: EmojiSet; label: string; emojis: string }[] = [
  { value: 'modern', label: 'Modern', emojis: '✨🔥💫🧋' },
  { value: 'classic', label: 'Classic', emojis: '⭐❤️🎉🎊' },
  { value: 'foodie', label: 'Foodie', emojis: '🍜🧋🍰☕' },
  { value: 'vietnamese', label: 'Việt Nam', emojis: '🇻🇳🌴☀️🍃' },
]

const PHOTO_STYLES: { value: PhotoConfig; label: string; desc: string; emoji: string }[] = [
  { value: 'bright', label: 'Sáng rõ', desc: 'Ánh sáng tự nhiên, màu sắc rực rỡ', emoji: '☀️' },
  { value: 'moody', label: 'Moody / Tối', desc: 'Ánh sáng yếu, tone ấm, dramatic', emoji: '🌙' },
  { value: 'natural', label: 'Tự nhiên', desc: 'Không studio, như chụp điện thoại', emoji: '📱' },
  { value: 'studio', label: 'Studio chỉnh chu', desc: 'Background sạch, professional', emoji: '🎬' },
]

const TONES: { value: ContentTone; label: string; desc: string }[] = [
  { value: 'friendly', label: 'Thân thiện', desc: 'Gần gũi, vui vẻ, xưng "mình"' },
  { value: 'professional', label: 'Chuyên nghiệp', desc: 'Nghiêm túc, đáng tin cậy, xưng "chúng tôi"' },
  { value: 'casual', label: 'Casual', desc: 'Thoải mái, như chat với bạn bè' },
  { value: 'premium', label: 'Cao cấp', desc: 'Sang trọng, giọng văn trang nhã' },
]

const FREQ_OPTIONS: { value: 'none' | 'low' | 'medium' | 'high'; label: string; desc: string }[] = [
  { value: 'none', label: 'Không dùng emoji', desc: '0 emoji' },
  { value: 'low', label: 'Ít', desc: '~1-2 bài' },
  { value: 'medium', label: 'Vừa', desc: '~3-5 bài' },
  { value: 'high', label: 'Nhiều', desc: '5+/bài' },
]

export function ContentTab({ emojiSet, photoConfig, contentTone, emojiFrequency, onChange }: ContentTabProps) {
  return (
    <div className="space-y-8">
      {/* Emoji set */}
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-3">Bộ emoji</h3>
        <div className="grid grid-cols-2 gap-3">
          {EMOJI_SETS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onChange({ emojiSet: s.value })}
              className={cn('p-4 rounded-xl border-2 text-center transition-all', emojiSet === s.value ? 'border-gold bg-gold/5' : 'border-border bg-surface hover:border-primary-lighter')}
            >
              <p className="text-2xl mb-1">{s.emojis}</p>
              <p className="text-sm font-medium text-foreground">{s.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Emoji frequency */}
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-3">Tần suất emoji</h3>
        <div className="flex gap-2">
          {FREQ_OPTIONS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange({ emojiFrequency: f.value })}
              className={cn('flex-1 p-3 rounded-xl border-2 text-center transition-all', emojiFrequency === f.value ? 'border-gold bg-gold/5' : 'border-border bg-surface hover:border-primary-lighter')}
            >
              <p className="text-sm font-medium text-foreground">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Photo style */}
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-3">Phong cách chụp ảnh</h3>
        <div className="grid grid-cols-2 gap-3">
          {PHOTO_STYLES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange({ photoConfig: p.value })}
              className={cn('p-4 rounded-xl border-2 text-left transition-all', photoConfig === p.value ? 'border-gold bg-gold/5' : 'border-border bg-surface hover:border-primary-lighter')}
            >
              <p className="text-2xl mb-2">{p.emoji}</p>
              <p className="text-sm font-medium text-foreground">{p.label}</p>
              <p className="text-xs text-muted-foreground">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-3">Giọng văn content</h3>
        <div className="space-y-2">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange({ contentTone: t.value })}
              className={cn('w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3', contentTone === t.value ? 'border-gold bg-gold/5' : 'border-border bg-surface hover:border-primary-lighter')}
            >
              <div className={cn('w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center', contentTone === t.value ? 'border-gold bg-gold' : 'border-border')}>
                {contentTone === t.value && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
