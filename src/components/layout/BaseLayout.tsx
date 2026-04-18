import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/authContext'

type MenuItem = { id: string; icon: string; label: string; badge?: string }
type MenuSection = { title: string; items: MenuItem[] }

const MENU_SECTIONS: MenuSection[] = [
  {
      title: 'Thương hiệu',
      items: [
          { id: '/home', icon: 'home', label: 'Trang chủ' },
          { id: '/brand-onboarding', icon: 'psychology', label: 'AI Định Vị Thương Hiệu' },
          { id: '/visual-form', icon: 'palette', label: 'Thiết Kế Visual DNA' },
          { id: '/dashboard', icon: 'analytics', label: 'Phân Tích Thị Trường' },
      ],
  },
  {
      title: 'Sáng tạo',
      items: [
          { id: '/ai-chat', icon: 'auto_awesome', label: 'Viết Content AI', badge: 'HOT' },
      ],
  },
  {
      title: 'Khác',
      items: [
          { id: '/memory-board', icon: 'photo_library', label: 'Bảng Ký Ức' },
      ],
  },
]

export function BaseLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] dark:bg-[#0F0F0F]">
      {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
      <aside className={`hidden lg:flex flex-col shrink-0 h-screen sticky top-0 bg-[#1f1f1f] text-white/70 transition-all duration-300 ${collapsed ? 'w-[80px]' : 'w-[260px]'}`}>
        <div className="flex items-center gap-3 px-5 pt-6 pb-4">
          <div className="w-8 h-8 rounded-lg bg-[#FFB84C] flex items-center justify-center shrink-0">
            <span className="text-[#3e2723] font-display font-bold text-sm">F</span>
          </div>
          {!collapsed && (
            <div className="leading-tight truncate flex-1 min-w-0">
              <p className="text-[10px] font-bold text-white/50 tracking-wider uppercase">FnB Ăn Liền</p>
              <p className="text-sm font-display font-bold text-white truncate">Cà Phê Muối SG</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto hide-scrollbar px-3 py-2 space-y-6">
          {MENU_SECTIONS.map((section, idx) => (
            <div key={idx}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-white/30 uppercase">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <NavLink
                    key={item.id}
                    to={item.id}
                    className={({ isActive }) => `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={`material-icons-round text-lg ${location.pathname === item.id ? 'text-[#FFB84C]' : 'opacity-80 group-hover:opacity-100'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="bg-[#FFB84C]/20 text-[#FFB84C] text-[8px] font-bold px-1.5 py-0.5 rounded-sm">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
          >
            <span className="material-icons-round text-lg">
              {collapsed ? 'menu_open' : 'menu'}
            </span>
          </button>
          {!collapsed && user && (
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/50 truncate">Tài khoản</p>
              <button onClick={() => { logout(); navigate('/') }} className="text-xs font-bold text-white/80 hover:text-red-400 truncate text-left transition-colors">
                {user.email} (Thoát)
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Content Area ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 bg-white dark:bg-[#121212] flex items-center justify-between px-4 sticky top-0 z-50">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center shrink-0">
              <span className="text-primary font-display font-bold text-sm">F</span>
            </div>
            <p className="text-sm font-display font-bold">V2</p>
          </div>
          <button className="text-primary p-2">
            <span className="material-icons-round">menu</span>
          </button>
        </header>

        <div className="flex-1 relative overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
