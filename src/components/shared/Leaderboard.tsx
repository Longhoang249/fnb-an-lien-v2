import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface LeaderboardEntry {
  rank: number
  shopName: string
  xp: number
  level: number
  avatar: string
}

interface LeaderboardProps {
  period?: 'week' | 'month' | 'all'
}

function Medal({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xl">🥇</span>
  if (rank === 2) return <span className="text-xl">🥈</span>
  if (rank === 3) return <span className="text-xl">🥉</span>
  return <span className="text-sm text-muted-foreground font-medium">{rank}</span>
}

export function Leaderboard({ period = 'week' }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const MOCK_NAMES = ['Quán Mẹ Nấu', 'Trà Sữa Gấu', 'Cà Phê SG', 'Bún Bò Hùng', 'Toast Của Tui', 'Trà Đá Quán', 'MilkTea Pro', 'Cơm Tấm Sài Gòn', 'Phở Hà Nội', 'Nước Ép Fresh']

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('xp, level')
          .order('xp', { ascending: false })
          .limit(10)

        if (error) throw error

        const result: LeaderboardEntry[] = (data ?? []).map((r, i) => ({
          rank: i + 1,
          shopName: MOCK_NAMES[i] ?? `Quán #${i + 1}`,
          xp: r.xp ?? 0,
          level: r.level ?? 1,
          avatar: String.fromCharCode(65 + (i % 26)),
        }))
        setEntries(result)
      } catch {
        // fallback to demo data
        setEntries(
          MOCK_NAMES.map((name, i) => ({
            rank: i + 1,
            shopName: name,
            xp: 500 - i * 40,
            level: Math.floor(Math.sqrt((500 - i * 40) / 50)) + 1,
            avatar: String.fromCharCode(65 + i),
          }))
        )
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [period])

  const periodLabel = period === 'week' ? 'Tuần này' : period === 'month' ? 'Tháng này' : 'Tất cả'

  return (
    <div className="bg-surface rounded-2xl border border-border p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-foreground">Bảng Xếp Hạng</h3>
        <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full border border-border">
          {periodLabel}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-6 h-6 bg-border rounded" />
              <div className="w-8 h-8 bg-border rounded-full" />
              <div className="flex-1 h-4 bg-border rounded" />
              <div className="w-10 h-4 bg-border rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                'flex items-center gap-3 p-2.5 rounded-xl transition-colors',
                entry.rank <= 3 ? 'bg-gold/5' : 'hover:bg-background'
              )}
            >
              <Medal rank={entry.rank} />
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  entry.rank === 1 ? 'bg-gold text-primary' :
                  entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
                  entry.rank === 3 ? 'bg-amber-700 text-white' :
                  'bg-background border border-border text-muted-foreground'
                )}
              >
                {entry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{entry.shopName}</p>
                <p className="text-xs text-muted-foreground">Level {entry.level}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-primary">{entry.xp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
