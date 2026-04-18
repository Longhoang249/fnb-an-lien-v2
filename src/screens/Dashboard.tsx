import { useEffect } from 'react'
import { useAuth } from '@/lib/authContext'
import { useGamificationStore } from '@/lib/store/gamificationStore'
import { Leaderboard } from '@/components/shared/Leaderboard'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

const ACHIEVEMENTS = [
  { id: 'first_post', emoji: '📝', label: 'Bài viết đầu tiên', xp: 10 },
  { id: 'week_streak', emoji: '🔥', label: '7 ngày liên tiếp', xp: 50 },
  { id: 'content_creator', emoji: '⭐', label: '10 bài viết', xp: 100 },
  { id: 'gold_saver', emoji: '💰', label: 'Tiết kiệm 100 Gold', xp: 75 },
  { id: 'social_star', emoji: '🌟', label: '100 lượt thích', xp: 150 },
  { id: 'early_bird', emoji: '🐦', label: 'Đăng bài trước 8h', xp: 25 },
]

function ProgressBar({ current, max, label }: { current: number; max: number; label: string }) {
  const pct = Math.min((current / max) * 100, 100)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-medium">{current} / {max} XP</span>
      </div>
      <div className="h-2 bg-background rounded-full overflow-hidden border border-border">
        <div
          className="h-full bg-gradient-to-r from-gold to-amber-rich rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function StatCard({ emoji, value, label, color }: { emoji: string; value: string | number; label: string; color: string }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5 text-center shadow-card">
      <div className="text-3xl mb-2">{emoji}</div>
      <div className={cn('font-display text-2xl font-bold', color)}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { profile, fetchProfile } = useGamificationStore()

  useEffect(() => {
    if (user) {
      fetchProfile(user.id)
    }
  }, [user])

  const nextLevelXp = (profile.level + 1) * (profile.level + 1) * 50
  const currentLevelXp = profile.level * profile.level * 50
  const xpInLevel = profile.xp - currentLevelXp
  const xpNeeded = nextLevelXp - currentLevelXp

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">
          Chào Đại Ca! 👋
        </h1>
        <p className="text-muted-foreground">
          Chào mừng quay trở lại với FnB Ăn Liền — Tiểu Đệ luôn sẵn sàng hỗ trợ.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard emoji="💰" value={profile.gold.toLocaleString()} label="Gold" color="text-gold" />
        <StatCard emoji="⚡" value={profile.xp.toLocaleString()} label="XP" color="text-primary" />
        <StatCard emoji="🏆" value={profile.level} label="Cấp bậc" color="text-amber-rich" />
      </div>

      {/* Level progress */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-foreground">Level {profile.level}</h3>
              <p className="text-xs text-muted-foreground">Đang tiến tới Level {profile.level + 1}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-primary">{xpNeeded - xpInLevel} XP</p>
              <p className="text-xs text-muted-foreground">cần thêm</p>
            </div>
          </div>
          <ProgressBar current={xpInLevel} max={xpNeeded} label={`Level ${profile.level} → ${profile.level + 1}`} />
        </CardContent>
      </Card>

      {/* Two column: achievements + leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-card">
          <h3 className="font-display font-bold text-foreground mb-4">Huân chương</h3>
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = profile.achievements.includes(ach.id)
              return (
                <div
                  key={ach.id}
                  className={cn(
                    'p-3 rounded-xl border text-center transition-all',
                    unlocked
                      ? 'bg-gold/10 border-gold/30'
                      : 'bg-background border-border opacity-50'
                  )}
                >
                  <div className="text-2xl mb-1">{ach.emoji}</div>
                  <p className="text-xs font-medium text-foreground">{ach.label}</p>
                  <p className="text-xs text-muted-foreground">+{ach.xp} XP</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <Leaderboard period="week" />
      </div>

      {/* Quick actions */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card">
        <h3 className="font-display font-bold text-foreground mb-4">Bắt đầu ngay</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { emoji: '✍️', label: 'Viết bài mới', desc: 'Content Facebook tự động', to: '/ai-chat' },
            { emoji: '🎨', label: 'Tạo ảnh concept', desc: 'AI thiết kế hình ảnh', to: '/ai-chat' },
            { emoji: '📅', label: 'Lịch content', desc: 'Lên kế hoạch tháng này', to: '/ai-chat' },
          ].map((action) => (
            <button
              key={action.label}
              className="p-4 rounded-xl border-2 border-border bg-background hover:border-gold hover:bg-gold/5 text-left transition-all group"
            >
              <div className="text-2xl mb-2">{action.emoji}</div>
              <p className="font-semibold text-foreground text-sm">{action.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
