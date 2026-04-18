import type { VisualDNA } from './types'

interface VisualPreviewProps {
  dna: VisualDNA
}

export function VisualPreview({ dna }: VisualPreviewProps) {
  return (
    <div
      className="rounded-xl overflow-hidden border border-border shadow-soft"
      style={{ backgroundColor: dna.colors.background, color: dna.colors.text }}
    >
      {/* Mock post header */}
      <div className="p-4 border-b border-black/10 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full"
          style={{ backgroundColor: dna.colors.primary }}
        />
        <div>
          <div className="text-sm font-semibold" style={{ fontFamily: dna.fonts.heading }}>
            QuanTraSua@VietNam
          </div>
          <div className="text-xs opacity-50">vừa xong</div>
        </div>
      </div>

      {/* Mock image */}
      <div
        className="h-48 flex items-center justify-center"
        style={{ backgroundColor: dna.colors.primary + '20' }}
      >
        <div className="text-center">
          <div
            className="text-6xl mb-2"
            style={{ fontFamily: dna.fonts.heading }}
          >
            🧋
          </div>
          <div
            className="text-sm font-medium px-4"
            style={{ color: dna.colors.primary, fontFamily: dna.fonts.heading }}
          >
            Trà sữa size M — 25.000đ
          </div>
        </div>
      </div>

      {/* Mock content */}
      <div className="p-4 space-y-2">
        <div className="text-sm" style={{ fontFamily: dna.fonts.body }}>
          Hè về rồi! Mùa nắng nóng thế này{' '}
          {dna.emojiFrequency !== 'none' && '☀️'}
          {' '}chắc chắn phải có ly trà sữa mát lạnh nhỉ{' '}
          {dna.emojiFrequency !== 'none' && dna.emojiFrequency !== 'low' && '🧋✨'}
        </div>
        <div
          className="text-xs opacity-60"
          style={{ fontFamily: dna.fonts.body }}
        >
          Xem tất cả bình luận
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: dna.colors.accent }} />
            <div className="text-xs font-medium" style={{ color: dna.colors.primary }}>2.4K</div>
          </div>
          <div className="flex gap-2">
            {['💬', '🔗', '📤'].map((e) => (
              <div key={e} className="w-5 h-5 rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Color swatches */}
      <div className="px-4 pb-3 flex gap-2">
        {[dna.colors.primary, dna.colors.secondary, dna.colors.accent, dna.colors.background].map((c, i) => (
          <div key={i} className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  )
}
