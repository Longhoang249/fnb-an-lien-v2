import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp } from '@/lib/supabase/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type AuthMode = 'signin' | 'signup'

const LOGO = (
  <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center shadow-lg shadow-gold/20">
    <span className="font-display font-bold text-3xl text-primary">F</span>
  </div>
)

export default function AuthScreen() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isSignup = mode === 'signup'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      if (isSignup) {
        await signUp({ email, password, fullName })
        setSuccess('Đăng ký thành công! Hãy kiểm tra email để xác thực tài khoản.')
        // Auto sign in after signup
        await signIn({ email, password })
        navigate('/brand-onboarding')
      } else {
        await signIn({ email, password })
        navigate('/home')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'))
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Left panel — brand identity ──────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gold/10" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-gold/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
              <span className="font-display font-bold text-primary text-lg">F</span>
            </div>
            <div>
              <p className="text-xs text-cream/60 tracking-widest uppercase">FnB Ăn Liền</p>
              <p className="text-sm font-display font-semibold text-cream">Marketing AI</p>
            </div>
          </div>

          <h1 className="font-display text-5xl font-bold text-cream leading-tight mb-6">
            Marketing<br />
            <span className="text-gold">trong tích tắc.</span>
          </h1>

          <p className="text-cream/70 text-lg max-w-sm leading-relaxed mb-12">
            Không cần agency. Không cần biết design. Chỉ cần một ly cà phê và ý tưởng — Tiểu Đệ lo phần còn lại.
          </p>

          {/* Feature bullets */}
          <div className="space-y-4">
            {[
              'Tạo content Facebook trong 1 phút',
              'Thiết kế ảnh concept chuyên nghiệp',
              'Xây dựng thương hiệu từ đầu',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-cream/80 text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-cream/40">
          © 2026 FnB Ăn Liền — Vì quán Việt, bởi người Việt
        </p>
      </div>

      {/* ── Right panel — form ──────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            {LOGO}
            <div>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">FnB Ăn Liền</p>
              <p className="text-sm font-display font-semibold text-foreground">V2</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              {isSignup ? 'Tạo tài khoản mới' : 'Chào Đại Ca! 👋'}
            </h2>
            <p className="text-muted-foreground">
              {isSignup ? 'Bắt đầu hành trình marketing của bạn' : 'Đăng nhập để tiếp tục với Tiểu Đệ'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <Input
                label="Họ và tên"
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            )}

            <Input
              label="Email"
              type="email"
              placeholder="quan@vidu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Mật khẩu"
              type="password"
              placeholder={isSignup ? 'Ít nhất 6 ký tự' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              helperText={isSignup ? 'Tối thiểu 6 ký tự' : undefined}
            />

            {!isSignup && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full"
            >
              {isSignup ? 'Đăng ký miễn phí' : 'Đăng nhập'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-amber-rich font-medium hover:underline"
            >
              {isSignup ? 'Đăng nhập ngay' : 'Đăng ký miễn phí'}
            </button>
          </div>

          <p className="mt-8 text-xs text-center text-muted-foreground/60">
            Tiếp tục nghĩa là bạn đồng ý với{' '}
            <span className="underline cursor-pointer">Điều khoản sử dụng</span> và{' '}
            <span className="underline cursor-pointer">Chính sách bảo mật</span>
          </p>
        </div>
      </div>
    </div>
  )
}
