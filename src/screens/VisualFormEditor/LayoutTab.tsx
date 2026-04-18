import type { LayoutStyle } from './types'
import { cn } from '@/lib/utils'

const LAYOUTS: { value: LayoutStyle; label: string; desc: string; emoji: string }[] = [
  { value: 'minimal', label: 'Minimal Clean', desc: 'Đơn giản, nhiều không gian trắng, tập trung vào sản phẩm', emoji: '◻️' },
  { value: 'bento', label: 'Bento Grid', desc: 'Bố cục ô vuông như hộp cơm, năng động, hiện đại', emoji: '🍱' },
  { value: 'magazine', label: 'Magazine', desc: 'Phong cách tạp chí, typography lớn, bố cục editorial', emoji: '📰' },
  { value: 'bold', label: 'Bold Typography', desc: 'Chữ to, nhấn mạnh, gây ấn tượng mạnh', emoji: '🔤' },
]

interface LayoutTabProps {
  value: LayoutStyle
  onChange: (v: LayoutStyle) => void
}

export function LayoutTab({ value, onChange }: LayoutTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-base font-semibold text-foreground">Phong cách bố cục</h3>
      <p className="text-sm text-muted-foreground">Chọn style hiển thị phù hợp với brand DNA của Đại Ca.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.value}
            type="button"
            onClick={() => onChange(layout.value)}
            className={cn(
              'p-5 rounded-xl border-2 text-left transition-all hover:shadow-soft',
              value === layout.value
                ? 'border-gold bg-gold/5 shadow-sm'
                : 'border-border bg-surface hover:border-primary-lighter'
            )}
          >
            <div className="text-3xl mb-3">{layout.emoji}</div>
            <div className="font-display font-bold text-foreground mb-1">{layout.label}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{layout.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
