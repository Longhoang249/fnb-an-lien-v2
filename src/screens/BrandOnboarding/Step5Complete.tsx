import React from 'react'
import { useOnboardingStore } from './useOnboardingStore'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/authContext'

export function Step5Complete() {
  const { data } = useOnboardingStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [saving, setSaving] = React.useState(false)

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('shop_profiles').upsert({
        user_id: user.id,
        shop_name: data.shopName ?? '',
        slogan: data.slogan ?? '',
        description: data.description ?? '',
        price_range: data.priceRange ?? '',
        target_audience: data.targetAudience ?? '',
        usp: data.usp ?? '',
        archetype: data.archetype ?? '',
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      navigate('/home')
    } catch (err) {
      console.error('Failed to save profile:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <div className="text-6xl">🎉</div>
        <h3 className="font-display text-2xl font-bold text-foreground">
          Chào mừng {data.shopName ?? 'Đại Ca'}!
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Brand DNA của Đại Ca đã được thiết lập. Giờ thì đến lúc tạo những bài viết đầu tiên nào!
        </p>
      </div>

      {/* Summary */}
      <div className="bg-surface rounded-xl border border-border p-5 text-left space-y-3 max-w-sm mx-auto">
        <h4 className="font-semibold text-sm text-foreground">Tóm tắt Brand DNA</h4>
        {data.priceRange && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phân khúc</span>
            <span className="text-foreground font-medium capitalize">{data.priceRange}</span>
          </div>
        )}
        {data.targetAudience && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Đối tượng</span>
            <span className="text-foreground font-medium capitalize">{data.targetAudience}</span>
          </div>
        )}
        {data.usp && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">USP</span>
            <span className="text-foreground font-medium">{data.usp}</span>
          </div>
        )}
        {data.archetype && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Archetype</span>
            <span className="text-foreground font-medium capitalize">{data.archetype}</span>
          </div>
        )}
      </div>

      <Button variant="primary" size="lg" isLoading={saving} onClick={handleSave}>
        Khám phá FnB Ăn Liền
      </Button>
    </div>
  )
}
