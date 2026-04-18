import { create } from 'zustand'

interface DemoShop {
  shopName: string
  slogan: string
  archetype: string
  priceRange: string
  usp: string
}

interface DemoState {
  isDemo: boolean
  demoShop: DemoShop
  enableDemo: () => void
  disableDemo: () => void
}

export const useDemoStore = create<DemoState>((set) => ({
  isDemo: true, // Demo mode ON by default for unauthenticated users
  demoShop: {
    shopName: 'Cà Phê Muối Sài Gòn',
    slogan: 'Mỗi ly là một trải nghiệm',
    archetype: 'sage',
    priceRange: 'mid',
    usp: 'unique_flavor',
  },
  enableDemo: () => set({ isDemo: true }),
  disableDemo: () => set({ isDemo: false }),
}))