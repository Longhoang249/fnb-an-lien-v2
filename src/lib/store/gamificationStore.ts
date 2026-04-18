import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GamificationProfile {
  xp: number
  gold: number
  level: number
  streak: number
  achievements: string[]
  updatedAt: string
}

interface GamificationState {
  profile: GamificationProfile
  loading: boolean
  error: string | null
  // Actions
  fetchProfile: (userId: string) => Promise<void>
  syncToDb: (userId: string) => Promise<void>
  addXp: (amount: number, userId: string) => void
  deductGold: (amount: number, userId: string) => Promise<boolean>
  addGold: (amount: number, userId: string) => Promise<void>
  addAchievement: (id: string, userId: string) => void
  setLoading: (v: boolean) => void
  setError: (msg: string | null) => void
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function computeLevel(xp: number): number {
  // 0-99 XP = level 1, 100-299 = level 2, 300-599 = level 3, etc.
  // level formula: floor(sqrt(xp / 50)) + 1
  return Math.floor(Math.sqrt(xp / 50)) + 1
}

function xpForNextLevel(level: number): number {
  return level * level * 50
}

const DEFAULT_PROFILE: GamificationProfile = {
  xp: 0,
  gold: 50, // Start with 50 gold for demo
  level: 1,
  streak: 0,
  achievements: [],
  updatedAt: new Date().toISOString(),
}

// ── Store ───────────────────────────────────────────────────────────────────────

export const useGamificationStore = create<GamificationState>((set, get) => ({
  profile: { ...DEFAULT_PROFILE },
  loading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('xp, gold, level, streak, achievements, updated_at')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error // ignore "not found" gracefully
      }

      if (data) {
        set({
          profile: {
            xp: data.xp ?? DEFAULT_PROFILE.xp,
            gold: data.gold ?? DEFAULT_PROFILE.gold,
            level: data.level ?? DEFAULT_PROFILE.level,
            streak: data.streak ?? DEFAULT_PROFILE.streak,
            achievements: data.achievements ?? [],
            updatedAt: data.updated_at ?? new Date().toISOString(),
          },
          loading: false,
        })
      } else {
        // Create default profile in DB
        await supabase.from('profiles').upsert({
          user_id: userId,
          xp: DEFAULT_PROFILE.xp,
          gold: DEFAULT_PROFILE.gold,
          level: DEFAULT_PROFILE.level,
          streak: DEFAULT_PROFILE.streak,
          achievements: [],
        })
        set({ profile: { ...DEFAULT_PROFILE }, loading: false })
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Lỗi tải profile', loading: false })
    }
  },

  syncToDb: async (userId: string) => {
    const { profile } = get()
    try {
      await supabase
        .from('profiles')
        .update({
          xp: profile.xp,
          gold: profile.gold,
          level: profile.level,
          streak: profile.streak,
          achievements: profile.achievements,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
    } catch (err) {
      console.error('syncToDb failed:', err)
    }
  },

  addXp: (amount: number, userId: string) => {
    set((s) => {
      const newXp = s.profile.xp + amount
      const newLevel = computeLevel(newXp)
      const updated = {
        ...s.profile,
        xp: newXp,
        level: newLevel,
        updatedAt: new Date().toISOString(),
      }
      return { profile: updated }
    })
    // Async sync to DB
    get().syncToDb(userId)
  },

  deductGold: async (amount: number, userId: string): Promise<boolean> => {
    const { profile } = get()
    if (profile.gold < amount) {
      set({ error: 'Không đủ Gold!' })
      return false
    }

    // Optimistic deduction
    set((s) => ({
      profile: { ...s.profile, gold: s.profile.gold - amount, updatedAt: new Date().toISOString() },
    }))

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ gold: get().profile.gold, updated_at: new Date().toISOString() })
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (err) {
      // Rollback
      set((s) => ({
        profile: { ...s.profile, gold: s.profile.gold + amount },
        error: err instanceof Error ? err.message : 'Lỗi trừ Gold',
      }))
      return false
    }
  },

  addGold: async (amount: number, userId: string) => {
    set((s) => ({
      profile: { ...s.profile, gold: s.profile.gold + amount, updatedAt: new Date().toISOString() },
    }))
    try {
      await supabase
        .from('profiles')
        .update({ gold: get().profile.gold, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
    } catch (err) {
      console.error('addGold failed:', err)
    }
  },

  addAchievement: (id: string, userId: string) => {
    set((s) => {
      if (s.profile.achievements.includes(id)) return s
      return {
        profile: {
          ...s.profile,
          achievements: [...s.profile.achievements, id],
          updatedAt: new Date().toISOString(),
        },
      }
    })
    get().syncToDb(userId)
  },

  setLoading: (v: boolean) => set({ loading: v }),
  setError: (msg: string | null) => set({ error: msg }),
}))

// Export helper for computing progress
export { computeLevel, xpForNextLevel }
