import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { VisualPreview } from './VisualPreview'
import { ColorsTab } from './ColorsTab'
import { FontsTab } from './FontsTab'
import { LayoutTab } from './LayoutTab'
import { ContentTab } from './ContentTab'
import { DEFAULT_VISUAL_DNA, type VisualDNA } from './types'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/authContext'

const TABS = [
  { id: 'colors', label: 'Màu sắc', icon: '🎨' },
  { id: 'fonts', label: 'Font chữ', icon: '✍️' },
  { id: 'layout', label: 'Bố cục', icon: '📐' },
  { id: 'content', label: 'Content', icon: '✏️' },
]

export default function VisualFormEditor() {
  const { user } = useAuth()
  const [dna, setDna] = useState<VisualDNA>(DEFAULT_VISUAL_DNA)
  const [activeTab, setActiveTab] = useState('colors')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setSaved(false)
    try {
      const { error } = await supabase.from('visual_dna_configs').upsert({
        user_id: user.id,
        config: dna as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save visual DNA:', err)
    } finally {
      setSaving(false)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'colors':
        return <ColorsTab value={dna.colors} onChange={(colors) => setDna((d) => ({ ...d, colors }))} />
      case 'fonts':
        return <FontsTab value={dna.fonts} onChange={(fonts) => setDna((d) => ({ ...d, fonts }))} />
      case 'layout':
        return <LayoutTab value={dna.layoutStyle} onChange={(layoutStyle) => setDna((d) => ({ ...d, layoutStyle }))} />
      case 'content':
        return <ContentTab {...dna} onChange={(u) => setDna((d) => ({ ...d, ...u }))} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
              <span className="font-display font-bold text-primary text-lg">F</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">FnB Ăn Liền</p>
              <p className="text-sm font-display font-semibold text-foreground">Visual DNA Editor</p>
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mt-4 mb-1">
            Thiết kế nhận diện thị giác
          </h1>
          <p className="text-muted-foreground">
            Cấu hình màu sắc, font chữ, bố cục và giọng văn để AI tạo content đúng phong cách của Đại Ca.
          </p>
        </div>

        {/* Desktop layout: tabs + preview */}
        <div className="hidden lg:flex gap-8 items-start">
          {/* Left: tabs */}
          <div className="flex-1 min-w-0">
            {/* Tab nav */}
            <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <Card>
              <CardContent>
                {renderTabContent()}
              </CardContent>
            </Card>

            {/* Save */}
            <div className="mt-4 flex items-center gap-3">
              <Button variant="primary" isLoading={saving} onClick={handleSave}>
                Lưu cấu hình
              </Button>
              {saved && (
                <span className="text-sm text-green-600 font-medium">Đã lưu!</span>
              )}
            </div>
          </div>

          {/* Right: preview */}
          <div className="w-80 shrink-0 sticky top-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Preview thực tế</h3>
              <span className="text-xs text-muted-foreground">Instagram post</span>
            </div>
            <VisualPreview dna={dna} />
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Đây là gợi ý hiển thị. AI sẽ tạo content theo style này.
            </p>
          </div>
        </div>

        {/* Mobile: stacked layout */}
        <div className="lg:hidden space-y-6">
          <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <Card>
            <CardContent>
              {renderTabContent()}
            </CardContent>
          </Card>

          <VisualPreview dna={dna} />

          <div className="flex items-center gap-3">
            <Button variant="primary" isLoading={saving} onClick={handleSave}>
              Lưu cấu hình
            </Button>
            {saved && <span className="text-sm text-green-600 font-medium">Đã lưu!</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
