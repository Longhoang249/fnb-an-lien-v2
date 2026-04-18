import { useOnboardingStore } from './useOnboardingStore'
import { Input } from '@/components/ui/Input'

export function Step4BrandInfo() {
  const { data, updateData } = useOnboardingStore()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">
          Thông tin cơ bản
        </h3>
        <p className="text-sm text-muted-foreground">
          Những thông tin này sẽ xuất hiện trên tất cả content của Đại Ca.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Tên quán"
          placeholder="VD: Trà Sữa Gấu Đen"
          value={data.shopName ?? ''}
          onChange={(e) => updateData({ shopName: e.target.value })}
          helperText="Tên quán sẽ được nhắc tự động trong bài viết"
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Slogan (khẩu hiệu)</label>
          <textarea
            placeholder="VD: Mỗi ly là một trải nghiệm"
            value={data.slogan ?? ''}
            onChange={(e) => updateData({ slogan: e.target.value })}
            rows={2}
            className="flex w-full rounded-lg border border-input-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 hover:border-primary-lighter focus:border-primary resize-none"
          />
          <p className="text-xs text-muted-foreground">Slogan ngắn gọn, dễ nhớ — tối đa 1 câu</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Giới thiệu ngắn <span className="text-muted-foreground font-normal">(tùy chọn)</span>
          </label>
          <textarea
            placeholder="VD: Quán trà sữa gần trường ĐH Bách Khoa, nổi tiếng với topping tự chọn..."
            value={data.description ?? ''}
            onChange={(e) => updateData({ description: e.target.value })}
            rows={3}
            className="flex w-full rounded-lg border border-input-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 hover:border-primary-lighter focus:border-primary resize-none"
          />
          <p className="text-xs text-muted-foreground">AI sẽ dùng thông tin này làm nền tảng khi viết content</p>
        </div>
      </div>
    </div>
  )
}
