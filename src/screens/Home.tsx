import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/authContext'

const TIPS = [
  "Chăm sóc khách hàng cũ tốn ít chi phí hơn 5 lần so với tìm khách mới. Hãy nhớ xin số để tích điểm!",
  "Review chân thực từ khách là nội dung quảng cáo tốt nhất. Xin feedback sau mỗi lần khách trải nghiệm.",
  "Đăng khoảnh khắc làm việc vui của nhân viên giúp kết nối cảm xúc với khách hàng.",
  "Một câu chào hỏi thân thiện có thể cứu vãn một trải nghiệm tệ vì chờ món lâu.",
]

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { } = useAuth()
  
  // Daily tip
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const tipOfTheDay = TIPS[dayOfYear % TIPS.length]

  return (
    <main className="flex-1 px-5 lg:px-8 pt-3 pb-24 overflow-y-auto hide-scrollbar z-10 space-y-5">
      {/* Top Decoration */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full pointer-events-none" />
      <div className="absolute top-10 -left-10 w-32 h-32 bg-gold/10 rounded-full pointer-events-none" />

      {/* ── ONBOARDING REWARD BANNER ── */}
      <div 
        onClick={() => navigate('/brand-onboarding')}
        className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-500/20 shadow-lg cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="relative z-10 flex items-center justify-between gap-4 text-white">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-icons-round text-amber-200 text-lg">card_giftcard</span>
              <span className="font-bold text-sm">Nhận 15 Ngày Dùng Thử PRO!</span>
            </div>
            <p className="text-xs text-white/90 leading-tight">
              Hoàn thành Khảo sát Định vị Thương hiệu (Brand DNA) để hệ thống hiểu quán của bạn và nhận quà tặng.
            </p>
          </div>
          <button 
            className="shrink-0 bg-white text-amber-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs font-bold shadow-sm hover:bg-amber-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              navigate('/brand-onboarding')
            }}
          >
            Làm Ngay
          </button>
        </div>
        {/* Decor */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border-[16px] border-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 right-20 w-16 h-16 rounded-full border-[8px] border-white/10 pointer-events-none" />
      </div>

      {/* ── DAILY TIP ── */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-3 items-start shadows-sm">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
          <span className="material-icons-round text-amber-600 text-[18px]">lightbulb</span>
        </div>
        <div>
          <p className="text-[11px] font-bold text-amber-800 mb-0.5">Mẹo hay của Đại Ca hôm nay</p>
          <p className="text-xs text-amber-900/80 leading-relaxed">{tipOfTheDay}</p>
        </div>
      </div>

      {/* ── SECTION: CORE FEATURES ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BRAND DNA */}
        <div
          onClick={() => navigate('/brand-onboarding')}
          className="text-white shadow-soft group active:scale-[0.98] transition-all duration-300 cursor-pointer relative overflow-hidden rounded-2xl p-4 bg-[#4A332A]"
        >
          <div className="relative z-10 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0 bg-white/10 border border-white/10 text-white`}>
              <span className="material-icons-round text-xl">fingerprint</span>
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold mb-0.5 text-white`}>Thương hiệu & Bản sắc</h3>
              <p className={`text-[10px] text-white/70`}>Quản lý DNA, Sứ mệnh & Menu</p>
            </div>
            <span className="material-icons-round text-lg text-white/40">chevron_right</span>
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border-[20px] border-white/5 opacity-50" />
        </div>

        {/* MARKET ANALYSIS */}
        <div
          onClick={() => navigate('/dashboard')}
          className="text-white shadow-soft group active:scale-[0.98] transition-all duration-300 cursor-pointer relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-teal-600 to-cyan-700"
        >
          <div className="relative z-10 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0 bg-white/10 border border-white/10 text-white`}>
              <span className={`material-icons-round text-xl text-amber-300`}>analytics</span>
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold mb-0.5 text-white`}>Phân Tích Thị Trường</h3>
              <p className={`text-[10px] text-white/70`}>4P, SWOT, Đối thủ & Insight</p>
            </div>
            <span className="material-icons-round text-lg text-white/40">chevron_right</span>
          </div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full border-[16px] border-white/5 opacity-50" />
        </div>

        {/* AI CHAT */}
        <div
          onClick={() => navigate('/ai-chat')}
          className="text-white shadow-soft group active:scale-[0.98] transition-all duration-300 cursor-pointer relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-indigo-600 to-violet-700 md:col-span-2 lg:col-span-1"
        >
          <div className="relative z-10 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0 bg-white/10 border border-white/10 text-white`}>
              <span className={`material-icons-round text-xl text-indigo-300`}>auto_awesome</span>
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold mb-0.5 text-white`}>Trợ Lý AI Content</h3>
              <p className={`text-[10px] text-white/70`}>Tạo nhanh bài viết 1 click</p>
            </div>
            <span className="material-icons-round text-lg text-white/40">chevron_right</span>
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border-[20px] border-white/5 opacity-50" />
        </div>

        {/* VISUAL DNA */}
        <div
          onClick={() => navigate('/visual-form')}
          className="text-white shadow-soft group active:scale-[0.98] transition-all duration-300 cursor-pointer relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-amber-600 to-amber-700"
        >
          <div className="relative z-10 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0 bg-white/10 border border-white/10 text-white`}>
              <span className={`material-icons-round text-xl text-amber-100`}>palette</span>
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold mb-0.5 text-white`}>Thiết Kế Visual DNA</h3>
              <p className={`text-[10px] text-white/70`}>Tạo menu, poster với nhận diện tự động</p>
            </div>
            <span className="material-icons-round text-lg text-white/40">chevron_right</span>
          </div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full border-[16px] border-white/5 opacity-50" />
        </div>
      </div>
    </main>
  )
}

export default Home
