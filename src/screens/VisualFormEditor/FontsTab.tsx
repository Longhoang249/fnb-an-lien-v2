import type { FontConfig } from './types'

const FONT_OPTIONS = [
  { value: 'Be Vietnam Pro', label: 'Be Vietnam Pro', desc: 'Phong cách Việt, hiện đại', family: '"Be Vietnam Pro", sans-serif' },
  { value: 'Playfair Display', label: 'Playfair Display', desc: 'Sang trọng, cổ điển', family: '"Playfair Display", serif' },
  { value: 'Montserrat', label: 'Montserrat', desc: 'Tối giản, thanh lịch', family: '"Montserrat", sans-serif' },
  { value: 'Quicksand', label: 'Quicksand', desc: 'Thân thiện, tròn trịa', family: '"Quicksand", sans-serif' },
  { value: 'Dancing Script', label: 'Dancing Script', desc: 'Chữ viết tay, lãng mạn', family: '"Dancing Script", cursive' },
  { value: 'Space Grotesk', label: 'Space Grotesk', desc: 'Cool, Gen Z', family: '"Space Grotesk", sans-serif' },
]

interface FontsTabProps {
  value: FontConfig
  onChange: (f: FontConfig) => void
}

export function FontsTab({ value, onChange }: FontsTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-3">Font tiêu đề</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font.value}
              type="button"
              onClick={() => onChange({ ...value, heading: font.value })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                value.heading === font.value
                  ? 'border-gold bg-gold/5'
                  : 'border-border bg-surface hover:border-primary-lighter'
              }`}
            >
              <p
                className="text-xl font-bold mb-1"
                style={{ fontFamily: font.family }}
              >
                Tiêu đề mẫu
              </p>
              <p className="text-xs text-muted-foreground">{font.label}</p>
              <p className="text-xs text-muted-foreground">{font.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-3">Font body text</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font.value}
              type="button"
              onClick={() => onChange({ ...value, body: font.value })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                value.body === font.value
                  ? 'border-gold bg-gold/5'
                  : 'border-border bg-surface hover:border-primary-lighter'
              }`}
            >
              <p
                className="text-sm mb-1"
                style={{ fontFamily: font.family }}
              >
                Nội dung body text mẫu. Viết dài để xem flow.
              </p>
              <p className="text-xs text-muted-foreground">{font.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
