import { useOnboardingStore } from './useOnboardingStore'
import { cn } from '@/lib/utils'

const PRICE_OPTIONS = [
  { value: 'budget', label: 'Bình dân', desc: 'Dưới 30.000đ — phục vụ đa số', emoji: '🍜' },
  { value: 'mid', label: 'Trung bình', desc: '30.000–70.000đ — cân bằng', emoji: '🍲' },
  { value: 'premium', label: 'Cao cấp', desc: 'Trên 70.000đ — chất lượng là số 1', emoji: '✨' },
]

const AUDIENCE_OPTIONS = [
  { value: 'student', label: 'Học sinh / Sinh viên', desc: '18–25 tuổi, thích trendy, giá rẻ', emoji: '🎒' },
  { value: 'office', label: 'Dân văn phòng', desc: '25–40 tuổi, tiện lợi, nhanh gọn', emoji: '💼' },
  { value: 'family', label: 'Gia đình', desc: 'Mọi lứa tuổi, không gian thoải mái', emoji: '👨‍👩‍👧' },
  { value: 'tourist', label: 'Du khách', desc: 'Người ngoài, muốn thử đặc sản', emoji: '🌍' },
]

export function Step1Positioning() {
  const { data, updateData } = useOnboardingStore()

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">
          Mức giá phục vụ
        </h3>
        <p className="text-sm text-muted-foreground">
          Chọn phân khúc giá chính mà quán của Đại Ca hướng đến.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PRICE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => updateData({ priceRange: opt.value })}
            className={cn(
              'p-4 rounded-xl border-2 text-left transition-all duration-150 hover:shadow-soft',
              data.priceRange === opt.value
                ? 'border-gold bg-gold/5 shadow-sm'
                : 'border-border bg-surface hover:border-primary-lighter'
            )}
          >
            <div className="text-2xl mb-2">{opt.emoji}</div>
            <div className="font-semibold text-foreground">{opt.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
          </button>
        ))}
      </div>

      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">
          Đối tượng khách hàng
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Ai là người đến quán Đại Ca nhiều nhất?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AUDIENCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateData({ targetAudience: opt.value })}
              className={cn(
                'p-4 rounded-xl border-2 text-left transition-all duration-150',
                data.targetAudience === opt.value
                  ? 'border-gold bg-gold/5'
                  : 'border-border bg-surface hover:border-primary-lighter'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{opt.emoji}</span>
                <div>
                  <div className="font-semibold text-foreground text-sm">{opt.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
