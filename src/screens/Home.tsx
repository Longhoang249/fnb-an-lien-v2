import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/lib/ThemeContext'

const TIPS: Record<string, string[]> = {
  default: [
    "Chăm sóc khách hàng cũ tốn ít chi phí hơn 5 lần so với tìm khách mới. Hãy nhớ xin số để tích điểm!",
    "Review chân thực từ khách là nội dung quảng cáo tốt nhất. Xin feedback sau mỗi lần khách trải nghiệm.",
    "Đăng khoảnh khắc làm việc vui của nhân viên giúp kết nối cảm xúc với khách hàng.",
    "Một câu chào hỏi thân thiện có thể cứu vãn một trải nghiệm tệ vì chờ món lâu.",
  ],
}

interface FeatureCard {
  path: string
  icon: string
  title: string
  sub: string
  bg: string
  iconColor?: string
  badge?: string
  colSpan?: string
}

const CARDS: FeatureCard[] = [
  {
    path: '/brand-onboarding',
    icon: 'fingerprint',
    title: 'Thương hiệu & Bản sắc',
    sub: 'Quản lý DNA, Sứ mệnh & Menu',
    bg: 'var(--card1-bg)',
  },
  {
    path: '/dashboard',
    icon: 'analytics',
    title: 'Phân Tích Thị Trường',
    sub: '4P, SWOT, Đối thủ & Insight',
    bg: 'var(--card2-bg)',
    iconColor: '#fcd34d',
  },
  {
    path: '/ai-chat',
    icon: 'auto_awesome',
    title: 'Trợ Lý AI Content',
    sub: 'Tạo nhanh bài viết, caption 1 click',
    bg: 'var(--card4-bg)',
    iconColor: '#a5b4fc',
    badge: 'HOT',
    colSpan: 'lg:col-span-2',
  },
  {
    path: '/visual-form',
    icon: 'palette',
    title: 'Thiết Kế Visual DNA',
    sub: 'Tạo menu, poster với nhận diện AI',
    bg: 'var(--card3-bg)',
    iconColor: '#fde68a',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const tips = TIPS['default']
  const tipOfTheDay = tips[dayOfYear % tips.length]

  return (
    <div
      className="min-h-full px-4 lg:px-8 pt-4 pb-24 space-y-4 overflow-y-auto"
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      {/* Subtle background decorations */}
      <div className="pointer-events-none fixed -top-20 -right-20 w-72 h-72 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(62,39,35,0.08), transparent 70%)' }} />

      {/* ── ONBOARDING BANNER ── */}
      <div
        onClick={() => navigate('/brand-onboarding')}
        className="relative overflow-hidden rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
        style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
      >
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex-1 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-icons-round text-amber-100 text-lg">card_giftcard</span>
              <span className="font-bold text-sm">Hoàn thành Brand DNA để đội AI hiểu quán bạn!</span>
            </div>
            <p className="text-xs text-white/85 leading-relaxed">
              Định vị Thương hiệu → AI tạo content đúng tone, đúng phong cách quán ngay lập tức.
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate('/brand-onboarding') }}
            className="shrink-0 bg-white text-amber-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-amber-50 transition-colors"
          >
            Làm Ngay
          </button>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border-[20px] border-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 right-20 w-16 h-16 rounded-full border-[8px] border-white/10 pointer-events-none" />
      </div>

      {/* ── DAILY TIP ── */}
      <div
        className="rounded-xl p-3 flex gap-3 items-start border"
        style={{
          background: isDark ? 'rgba(255,184,76,0.06)' : '#fffbeb',
          borderColor: isDark ? 'rgba(255,184,76,0.15)' : '#fde68a',
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: isDark ? 'rgba(255,184,76,0.15)' : '#fef3c7' }}
        >
          <span className="material-icons-round text-amber-500 text-[18px]">lightbulb</span>
        </div>
        <div>
          <p className="text-[11px] font-bold text-amber-600 mb-0.5">Mẹo hay hôm nay</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-sub)' }}>
            {tipOfTheDay}
          </p>
        </div>
      </div>

      {/* ── FEATURE GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {CARDS.map((card) => (
          <div
            key={card.path}
            onClick={() => navigate(card.path)}
            className={`relative overflow-hidden rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-all duration-300 group ${card.colSpan ?? ''}`}
            style={{ background: card.bg }}
          >
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/10 border border-white/10 backdrop-blur-sm">
                <span
                  className="material-icons-round text-xl"
                  style={{ color: card.iconColor ?? 'white' }}
                >
                  {card.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white mb-0.5 leading-tight">{card.title}</h3>
                <p className="text-[10px] text-white/70 leading-tight">{card.sub}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {card.badge && (
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                    {card.badge}
                  </span>
                )}
                <span className="material-icons-round text-lg text-white/40 group-hover:text-white/70 transition-colors">
                  chevron_right
                </span>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border-[20px] border-white/5 opacity-60" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full border-[16px] border-white/5 opacity-40" />
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div>
        <p
          className="text-[11px] font-bold uppercase tracking-wider mb-3"
          style={{ color: 'var(--theme-text-sub)' }}
        >
          Truy cập nhanh
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: 'photo_library', label: 'Bảng Ký Ức', path: '/memory-board' },
            { icon: 'analytics', label: 'Dashboard', path: '/dashboard' },
            { icon: 'palette', label: 'Visual DNA', path: '/visual-form' },
            { icon: 'smart_toy', label: 'Hỏi AI', path: '/ai-chat' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl active:scale-[0.97] transition-transform border"
              style={{
                backgroundColor: 'var(--theme-card)',
                borderColor: 'var(--theme-card-border)',
              }}
            >
              <span
                className="material-icons-round text-2xl"
                style={{ color: 'var(--color-accent)' }}
              >
                {item.icon}
              </span>
              <span
                className="text-[11px] font-semibold text-center"
                style={{ color: 'var(--theme-text-primary)' }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
