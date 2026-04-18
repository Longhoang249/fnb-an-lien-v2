import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { onAuthStateChange, signOut } from './supabase/auth'
import type { User } from '@supabase/supabase-js'

interface AuthContextValue {
  user: User | null
  sessionActive: boolean
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { getUser } = await import('./supabase/auth')
      const u = await getUser()
      setUser(u)
      setLoading(false)
    }
    init().catch(() => {
      setLoading(false)
    })

    const unsubscribe = onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return unsubscribe
  }, [])

  const logout = async () => {
    await signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, sessionActive: user !== null, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
