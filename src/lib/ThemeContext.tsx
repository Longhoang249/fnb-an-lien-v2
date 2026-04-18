import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type AppTheme = 'basic' | 'dark'

interface ThemeContextValue {
  theme: AppTheme
  setTheme: (t: AppTheme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'basic',
  setTheme: () => {},
})

const THEME_KEY = 'fnbanlien-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light') return 'basic'
    return saved && ['basic', 'dark'].includes(saved) ? (saved as AppTheme) : 'basic'
  })

  const setTheme = (t: AppTheme) => {
    setThemeState(t)
    localStorage.setItem(THEME_KEY, t)
  }

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
