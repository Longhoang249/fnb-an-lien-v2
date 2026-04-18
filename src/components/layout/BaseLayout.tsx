import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/authContext'
import { useTheme, type AppTheme, ThemeProvider } from '@/lib/ThemeContext'

type MenuItem = { id: string; icon: string; label: string; badge?: string }
type MenuSection = { title: string; emoji: string; items: MenuItem[] }

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Thương hiệu',
    emoji: '☕',
    items: [
      { id: '/home', icon: 'home', label: 'Trang chủ' },
      { id: '/brand-onboarding', icon: 'psychology', label: 'AI Định Vị Thương Hiệu' },
      { id: '/visual-form', icon: 'palette', label: 'Thiết Kế Visual DNA' },
      { id: '/dashboard', icon: 'analytics', label: 'Phân Tích Thị Trường' },
    ],
  },
  {
    title: 'Sáng tạo',
    emoji: '✍️',
    items: [
      { id: '/ai-chat', icon: 'auto_awesome', label: 'Viết Content AI', badge: 'HOT' },
    ],
  },
  {
    title: 'Khác',
    emoji: '🤝',
    items: [
      { id: '/memory-board', icon: 'photo_library', label: 'Bảng Ký Ức' },
    ],
  },
]

const THEME_OPTIONS: { key: AppTheme; icon: string; label: string }[] = [
  { key: 'basic', icon: 'light_mode', label: 'Sáng' },
  { key: 'dark', icon: 'dark_mode', label: 'Tối' },
]

function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 h-[100dvh] sticky top-0 transition-all duration-300"
      style={{ width: collapsed ? 72 : 260, backgroundColor: '#1f1f1f' }}
    >
      {/* Header / Logo */}
      <div className="flex items-center gap-2.5 px-4 pt-5 pb-3 overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0">
          F
        </div>
        {!collapsed && (
          <div className="leading-tight min-w-0 flex-1">
            <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">FnB Ăn Liền</p>
            <p className="text-sm font-semibold text-white/90 truncate">Cà Phê Muối SG</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 pb-4 pt-1 space-y-5">
        {MENU_SECTIONS.map((section, sIdx) => (
          <div key={sIdx}>
            {!collapsed && (
              <div className="flex items-center gap-1.5 px-2.5 mb-1.5">
                <span className="text-xs">{section.emoji}</span>
                <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                  {section.title}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.id}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `group w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-all duration-150 ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:bg-white/[0.06] hover:text-white/85'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`material-icons-round text-[18px] shrink-0 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-white/30 group-hover:text-white/50'
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <>
                          <span className="text-[13px] font-medium truncate flex-1">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                                item.badge === 'HOT'
                                  ? 'bg-red-500/20 text-red-400'
                                  : item.badge === 'PRO'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-white/5 space-y-1">
        {/* Theme switcher */}
        <div className={`flex gap-1 px-1 py-1.5 ${collapsed ? 'flex-col items-center' : ''}`}>
          {THEME_OPTIONS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              title={t.label}
              className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-all"
              style={{
                background: theme === t.key ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${theme === t.key ? 'rgba(215,185,0,0.4)' : 'transparent'}`,
              }}
            >
              <span
                className="material-icons-round text-[16px]"
                style={{ color: theme === t.key ? '#D97706' : 'rgba(255,255,255,0.35)' }}
              >
                {t.icon}
              </span>
              {!collapsed && (
                <span
                  className="text-[8px] font-semibold"
                  style={{ color: theme === t.key ? '#D97706' : 'rgba(255,255,255,0.3)' }}
                >
                  {t.label}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-white/50 hover:bg-white/[0.06] hover:text-white/80 transition-all"
        >
          <span className="material-icons-round text-[18px] text-white/30">
            {collapsed ? 'menu_open' : 'menu'}
          </span>
          {!collapsed && <span className="text-[13px] font-medium">Thu gọn</span>}
        </button>

        {/* Logout */}
        {user && (
          <button
            onClick={() => { logout(); navigate('/') }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all text-left"
          >
            <span className="material-icons-round text-[18px]">logout</span>
            {!collapsed && (
              <span className="text-[13px] font-medium truncate">{user.email}</span>
            )}
          </button>
        )}

        <div className="flex items-center gap-2 text-white/20 text-[10px] pt-1 px-1">
          <span className="material-icons-round text-[14px]">info</span>
          {!collapsed && <span>fnbanlien v2.0</span>}
        </div>
      </div>
    </aside>
  )
}

function BaseLayoutInner() {
  const [collapsed, setCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div
      className="flex h-[100dvh] overflow-hidden font-display transition-colors duration-300"
      style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text-primary)' }}
    >
      {/* Desktop Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[260px] lg:hidden flex flex-col" style={{ backgroundColor: '#1f1f1f' }}>
            <Sidebar collapsed={false} setCollapsed={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header */}
        <header
          className="lg:hidden flex h-14 items-center justify-between px-4 shrink-0 border-b z-30 sticky top-0"
          style={{
            backgroundColor: 'var(--theme-header-bg)',
            borderColor: 'var(--theme-card-border)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xs font-bold">
              F
            </div>
            <span className="text-sm font-bold" style={{ color: 'var(--theme-text-primary)' }}>
              FnB Ăn Liền
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl active:scale-90 transition-transform"
            style={{ backgroundColor: 'var(--theme-icon-bg)' }}
          >
            <span className="material-icons-round text-xl" style={{ color: 'var(--theme-text-primary)' }}>
              menu
            </span>
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export function BaseLayout() {
  return (
    <ThemeProvider>
      <BaseLayoutInner />
    </ThemeProvider>
  )
}
