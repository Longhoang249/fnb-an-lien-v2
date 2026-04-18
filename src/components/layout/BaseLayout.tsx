import React, { type ReactNode } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/authContext'
import { cn } from '@/lib/utils'

function BrandLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-5 select-none">
      <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center shrink-0">
        <span className="text-primary font-display font-bold text-lg">F</span>
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase">FnB Ăn Liền</p>
          <p className="text-sm font-display font-semibold text-foreground">V2</p>
        </div>
      )}
    </div>
  )
}

const NAV_ITEMS = [
  { label: 'Trang chủ', to: '/home', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> },
  { label: 'Brand DNA', to: '/brand-onboarding', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42 3.42" /></svg> },
  { label: 'Visual DNA', to: '/visual-form', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg> },
]

interface BaseLayoutProps {
  children?: ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className={cn('flex flex-col border-r border-border bg-surface transition-all duration-200', sidebarCollapsed ? 'w-16' : 'w-56')}>
        <BrandLogo collapsed={sidebarCollapsed} />

        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', 'hover:bg-surface-hover', isActive ? 'bg-amber-rich/10 text-amber-rich' : 'text-muted-foreground hover:text-foreground', sidebarCollapsed && 'justify-center')}
            >
              {item.icon}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <button onClick={() => setSidebarCollapsed((c) => !c)} className="mx-2 mb-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors">
          <svg className={cn('w-4 h-4 transition-transform', sidebarCollapsed && 'rotate-180')} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          {!sidebarCollapsed && <span>Thu gọn</span>}
        </button>

        <div className="border-t border-border px-3 py-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-primary">{user.email?.charAt(0).toUpperCase() ?? 'U'}</span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{user.email}</p>
                  <button onClick={handleLogout} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Đăng xuất</button>
                </div>
              )}
            </div>
          ) : !sidebarCollapsed && (
            <NavLink to="/" className="text-xs text-muted-foreground hover:text-foreground">Đăng nhập</NavLink>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border bg-surface flex items-center px-6 gap-4 shrink-0">
          <h2 className="font-display font-semibold text-foreground">FnB Ăn Liền V2</h2>
          <div className="flex-1" />
          {user && <span className="text-xs text-muted-foreground">Xin chào, {user.email}</span>}
        </header>
        <div className="flex-1 overflow-y-auto">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  )
}

export { BrandLogo, NAV_ITEMS }
