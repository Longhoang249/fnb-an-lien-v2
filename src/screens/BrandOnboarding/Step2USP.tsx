import { useOnboardingStore } from './useOnboardingStore'

const USP_OPTIONS = [
  { value: 'unique_flavor', label: 'Hương vị độc đáo', desc: 'Công thức / nguyên liệu không lặp lại ở quán nào khác', icon: '🧪' },
  { value: 'ambiance', label: 'Không gian đặc biệt', desc: 'Decor, concept, view đẹp — khách đến để check-in', icon: '🏠' },
  { value: 'fast_service', label: 'Phục vụ nhanh chóng', desc: 'Đặt món & nhận hàng siêu tốc, tiện cho dân văn phòng', icon: '⚡' },
  { value: 'healthy', label: 'Healthy / Diet', desc: 'Thực phẩm sạch, ít đường, organic, phù hợp xu hướng', icon: '🥗' },
  { value: 'value', label: 'Giá trị tốt', desc: 'Nhiều topping, size lớn, chất lượng xứng đáng đồng tiền', icon: '💰' },
  { value: 'cultural', label: 'Văn hóa / Truyền thống', desc: 'Giữ gìn hương vị Việt, mang đậm bản sắc địa phương', icon: '🇻🇳' },
]

export function Step2USP() {
  const { data, updateData } = useOnboardingStore()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">
          Điểm bán hàng độc nhất (USP)
        </h3>
        <p className="text-sm text-muted-foreground">
          Điều gì khiến khách chọn quán Đại Ca thay vì quán khác cùng khu vực?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {USP_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => updateData({ usp: opt.value })}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-150 hover:shadow-soft ${
              data.usp === opt.value
                ? 'border-gold bg-gold/5 shadow-sm'
                : 'border-border bg-surface hover:border-primary-lighter'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{opt.icon}</span>
              <div>
                <div className="font-semibold text-foreground text-sm">{opt.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
