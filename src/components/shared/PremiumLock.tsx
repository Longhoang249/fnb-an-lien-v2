import { Button } from '@/components/ui/Button'

interface PremiumLockProps {
  message?: string
  onLogin?: () => void
}

export function PremiumLock({
  message = 'Tính năng này cần tài khoản Premium. Liên hệ Long Hoàng để biết thêm chi tiết!',
  onLogin,
}: PremiumLockProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center min-h-[300px]">
      <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center">
        <span className="text-4xl">🔒</span>
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="font-display text-xl font-bold text-foreground">Tính năng Premium</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
        <div className="mt-4 p-3 rounded-lg bg-gold/5 border border-gold/20 text-sm text-foreground">
          📞 Liên hệ: <strong>Long Hoàng</strong> để nâng cấp tài khoản
        </div>
      </div>
      {onLogin && (
        <Button variant="primary" onClick={onLogin}>
          Đăng nhập / Đăng ký
        </Button>
      )}
    </div>
  )
}