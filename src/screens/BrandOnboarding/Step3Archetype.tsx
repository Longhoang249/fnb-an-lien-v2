import { useOnboardingStore } from './useOnboardingStore'
import { cn } from '@/lib/utils'

const ARCHETYPES = [
  { value: 'sage', label: 'Sage (智者)', color: 'bg-blue-500/10 border-blue-300 text-blue-700', selected: 'ring-2 ring-blue-500 bg-blue-50', emoji: '📚', desc: 'Thông thái, đáng tin cậy. Dạy khách về sản phẩm, nguồn gốc, cách thưởng thức.' },
  { value: 'magician', label: 'Magician (魔法师)', color: 'bg-purple-500/10 border-purple-300 text-purple-700', selected: 'ring-2 ring-purple-500 bg-purple-50', emoji: '✨', desc: 'Biến trải nghiệm thành phép màu. Luôn có điều bất ngờ, sáng tạo không ngừng.' },
  { value: 'hero', label: 'Hero (英雄)', color: 'bg-red-500/10 border-red-300 text-red-700', selected: 'ring-2 ring-red-500 bg-red-50', emoji: '🏆', desc: 'Dám chinh phục, không ngại thử thách. Thương hiệu mạnh mẽ, quyết liệt.' },
  { value: 'jester', label: 'Jester (弄臣)', color: 'bg-yellow-500/10 border-yellow-300 text-yellow-700', selected: 'ring-2 ring-yellow-500 bg-yellow-50', emoji: '🎭', desc: 'Vui vẻ, hài hước, không quá nghiêm túc. Thu hút khách trẻ, giới Gen Z.' },
  { value: 'innocent', label: 'Innocent (天真)', color: 'bg-pink-500/10 border-pink-300 text-pink-700', selected: 'ring-2 ring-pink-500 bg-pink-50', emoji: '🌸', desc: 'Thuần khiết, mộng mơ, tin tưởng. Tạo không khí ấm áp, gần gũi.' },
  { value: 'lover', label: 'Lover (恋人)', color: 'bg-rose-500/10 border-rose-300 text-rose-700', selected: 'ring-2 ring-rose-500 bg-rose-50', emoji: '💕', desc: 'Lãng mạn, gợi cảm giác yêu thương. Phù hợp quán cà phê, trà sữa.' },
]

export function Step3Archetype() {
  const { data, updateData } = useOnboardingStore()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">
          Hình mẫu thương hiệu
        </h3>
        <p className="text-sm text-muted-foreground">
          Archetype định hình giọng văn và cách kể chuyện thương hiệu. Đại Ca thuộc về ai?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ARCHETYPES.map((arch) => (
          <button
            key={arch.value}
            type="button"
            onClick={() => updateData({ archetype: arch.value })}
            className={cn(
              'p-4 rounded-xl border-2 text-left transition-all duration-150',
              arch.color,
              data.archetype === arch.value ? arch.selected : 'opacity-80 hover:opacity-100'
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{arch.emoji}</span>
              <div>
                <div className="font-display font-bold text-sm">{arch.label}</div>
                <div className="text-xs mt-1 opacity-80 leading-relaxed">{arch.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
