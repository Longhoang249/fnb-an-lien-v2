import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/authContext'

interface ShopProfile {
  id: string
  shopName: string
  slogan: string
  priceRange: string
  targetAudience: string
  usp: string
  archetype: string
  description: string
}

interface ShopContextValue {
  shop: ShopProfile | null
  loading: boolean
  refresh: () => Promise<void>
}

const ShopContext = createContext<ShopContextValue>({
  shop: null,
  loading: true,
  refresh: async () => {},
})

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [shop, setShop] = useState<ShopProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchShop = async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('shop_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!error && data) {
        setShop({
          id: data.id,
          shopName: data.shop_name ?? '',
          slogan: data.slogan ?? '',
          priceRange: data.price_range ?? '',
          targetAudience: data.target_audience ?? '',
          usp: data.usp ?? '',
          archetype: data.archetype ?? '',
          description: data.description ?? '',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchShop() }, [user])

  return (
    <ShopContext.Provider value={{ shop, loading, refresh: fetchShop }}>
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  return useContext(ShopContext)
}
