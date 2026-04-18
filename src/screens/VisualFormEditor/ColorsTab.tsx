import type { ColorPalette } from './types'

const PRESET_PALETTES: { name: string; colors: ColorPalette }[] = [
  {
    name: 'Warm Coffee ☕',
    colors: { primary: '#3e2723', secondary: '#8d6e63', accent: '#ffb300', background: '#fff8e1', text: '#3e2723' },
  },
  {
    name: 'Tropical Fresh 🌴',
    colors: { primary: '#2e7d32', secondary: '#66bb6a', accent: '#ff8f00', background: '#f1f8e9', text: '#1b5e20' },
  },
  {
    name: 'Urban Dark 🌃',
    colors: { primary: '#1a1a2e', secondary: '#4a4e69', accent: '#e94560', background: '#16213e', text: '#f5f5f5' },
  },
  {
    name: 'Soft Pastel 🎀',
    colors: { primary: '#e91e63', secondary: '#f48fb1', accent: '#ff80ab', background: '#fce4ec', text: '#880e4f' },
  },
  {
    name: 'Classic Red 🍷',
    colors: { primary: '#b71c1c', secondary: '#ef5350', accent: '#ffd700', background: '#ffebee', text: '#b71c1c' },
  },
  {
    name: 'Sage Calm 🌿',
    colors: { primary: '#4e6e4e', secondary: '#a3b899', accent: '#d4a373', background: '#f5f5f0', text: '#3a3a3a' },
  },
]

interface ColorsTabProps {
  value: ColorPalette
  onChange: (c: ColorPalette) => void
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg border border-border overflow-hidden shrink-0">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-14 h-14 border-none cursor-pointer p-0"
        />
      </div>
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground font-mono">{value}</p>
      </div>
    </div>
  )
}

export function ColorsTab({ value, onChange }: ColorsTabProps) {
  return (
    <div className="space-y-8">
      {/* Presets */}
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-3">Bảng màu có sẵn</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESET_PALETTES.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => onChange(preset.colors)}
              className="p-3 rounded-xl border-2 border-border bg-surface hover:border-primary-lighter transition-all text-left"
            >
              <div className="flex gap-1.5 mb-2">
                {Object.values(preset.colors).map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                ))}
              </div>
              <p className="text-xs font-medium text-foreground">{preset.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom colors */}
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-3">Tùy chỉnh màu</h3>
        <div className="space-y-4">
          <ColorInput label="Màu chính (Primary)" value={value.primary} onChange={(v) => onChange({ ...value, primary: v })} />
          <ColorInput label="Màu phụ (Secondary)" value={value.secondary} onChange={(v) => onChange({ ...value, secondary: v })} />
          <ColorInput label="Màu nhấn (Accent)" value={value.accent} onChange={(v) => onChange({ ...value, accent: v })} />
          <ColorInput label="Màu nền (Background)" value={value.background} onChange={(v) => onChange({ ...value, background: v })} />
          <ColorInput label="Màu chữ (Text)" value={value.text} onChange={(v) => onChange({ ...value, text: v })} />
        </div>
      </div>
    </div>
  )
}
