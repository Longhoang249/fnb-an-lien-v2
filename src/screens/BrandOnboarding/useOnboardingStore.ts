import { create } from 'zustand'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OnboardingData {
  // Step 1: Tâm lý định vị
  priceRange?: string
  targetAudience?: string
  // Step 2: USP
  usp?: string
  // Step 3: Archetype
  archetype?: string
  // Step 4: Brand info
  shopName?: string
  slogan?: string
  description?: string
}

interface OnboardingStore {
  step: number
  data: OnboardingData
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateData: (updates: Partial<OnboardingData>) => void
  reset: () => void
}

const INITIAL_DATA: OnboardingData = {}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  step: 1,
  data: INITIAL_DATA,
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 5) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  updateData: (updates) => set((s) => ({ data: { ...s.data, ...updates } })),
  reset: () => set({ step: 1, data: INITIAL_DATA }),
}))
