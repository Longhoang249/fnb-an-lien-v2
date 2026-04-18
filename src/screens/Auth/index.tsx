import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client'
import { useDemoStore } from '@/lib/demoMode'

export default function AuthScreen() {
    const navigate = useNavigate()
    const enableDemo = useDemoStore((s) => s.enableDemo)

    // ─── Mode: login | register ─────────────────
    const [mode, setMode] = useState<'login' | 'register'>('login')

    // Login state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [splashDone] = useState(true)

    // SECURITY: Rate limiting
    const [failedAttempts, setFailedAttempts] = useState(0)
    const [lockoutUntil, setLockoutUntil] = useState(0)
    const [lockoutRemaining, setLockoutRemaining] = useState(0)

    // Forgot password
    const [showForgot, setShowForgot] = useState(false)
    const [forgotEmail, setForgotEmail] = useState('')
    const [forgotStatus, setForgotStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
    const [forgotError, setForgotError] = useState('')

    // Register state
    const [regEmail, setRegEmail] = useState('')
    const [regPassword, setRegPassword] = useState('')
    const [regConfirmPw, setRegConfirmPw] = useState('')
    const [regLoading, setRegLoading] = useState(false)
    const [regError, setRegError] = useState('')
    const [regSuccess, setRegSuccess] = useState(false)

    // Countdown timer for lockout
    React.useEffect(() => {
        if (lockoutUntil <= Date.now()) return
        const interval = setInterval(() => {
            const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000)
            if (remaining <= 0) {
                setLockoutRemaining(0)
                clearInterval(interval)
            } else {
                setLockoutRemaining(remaining)
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [lockoutUntil])

    const isLockedOut = lockoutUntil > Date.now()
    const MAX_ATTEMPTS = 5
    const LOCKOUT_DURATION = 60_000

    const handleForgotPassword = async () => {
        const targetEmail = forgotEmail.trim() || email.trim()
        if (!targetEmail) {
            setForgotError('Vui lòng nhập email')
            return
        }
        setForgotStatus('sending')
        setForgotError('')
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
                redirectTo: window.location.origin,
            })
            if (error) throw error
            setForgotStatus('sent')
        } catch (err: any) {
            setForgotStatus('error')
            setForgotError(err.message || 'Không gửi được email')
        }
    }

    const handleLogin = async () => {
        if (isLockedOut) return
        if (!email.trim() || !password.trim()) {
            setError('Vui lòng nhập email và mật khẩu')
            return
        }
        setIsLoading(true)
        setError('')
        try {
            const loginPromise = signIn({ email: email.trim(), password })
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('timeout')), 15000)
            )
            await Promise.race([loginPromise, timeoutPromise])
            setFailedAttempts(0)
            navigate('/brand-onboarding')
        } catch (err: any) {
            const msg = err.message
            const newAttempts = failedAttempts + 1
            setFailedAttempts(newAttempts)

            if (newAttempts >= MAX_ATTEMPTS) {
                const until = Date.now() + LOCKOUT_DURATION
                setLockoutUntil(until)
                setLockoutRemaining(Math.ceil(LOCKOUT_DURATION / 1000))
                setError(`Quá nhiều lần thử. Vui lòng đợi 60 giây.`)
            } else if (msg === 'timeout') {
                setError('Kết nối Supabase quá chậm. Thử tắt VPN hoặc đổi mạng.')
            } else if (msg === 'Invalid login credentials') {
                setError(`Email hoặc mật khẩu không đúng (${newAttempts}/${MAX_ATTEMPTS})`)
            } else {
                setError(msg ?? 'Đã có lỗi xảy ra')
            }
            setIsLoading(false)
        }
    }

    const handleRegister = async () => {
        setRegError('')
        if (!regEmail.trim()) { setRegError('Vui lòng nhập email'); return }
        if (regPassword.length < 6) { setRegError('Mật khẩu phải có ít nhất 6 ký tự'); return }
        if (regPassword !== regConfirmPw) { setRegError('Mật khẩu xác nhận không khớp'); return }

        setRegLoading(true)
        try {
            const { data, error } = await supabase.functions.invoke('register-shop', {
                body: {
                    shopName: 'Cửa hàng của tôi',
                    email: regEmail.trim(),
                    password: regPassword,
                    phone: '0000000000',
                },
            })

            // Network/infrastructure error (function not found, timeout, etc.)
            if (error) {
                throw new Error('Không thể kết nối đến server. Vui lòng thử lại.')
            }

            // Business logic error (validation, duplicate, etc.)
            if (!data?.success) {
                throw new Error(data?.error || 'Đăng ký thất bại')
            }

            // Success!
            setRegSuccess(true)
        } catch (err: any) {
            setRegError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.')
        } finally {
            setRegLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        setError('')
        setRegError('')
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            })
            if (error) throw error
        } catch (err: any) {
            setError(err.message || 'Lỗi đăng nhập Google')
            setRegError(err.message || 'Lỗi đăng ký Google')
            setIsLoading(false)
        }
    }

    const handleEnterDemo = () => {
        enableDemo()
        navigate('/home')
    }

    // ─── Splash ─────────────────────────────────────
    if (!splashDone) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#3E2723] via-[#4E342E] to-[#3E2723] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-amber-500/10 rounded-full" />
                    <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-amber-600/10 rounded-full" />
                </div>
                <div className="relative z-10 flex flex-col items-center animate-fade-in">
                    <img src="/logo-fnbanlien.png" alt="FnBanLien" className="w-24 h-24 rounded-3xl shadow-2xl shadow-amber-500/30 mb-5 object-contain" />
                    <h1 className="text-2xl font-black text-white tracking-tight">fnbanlien</h1>
                    <p className="text-amber-300/60 text-[11px] mt-1 font-medium tracking-widest uppercase">Marketing Platform</p>
                </div>
                <div className="absolute bottom-20 flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-amber-400/60 rounded-full opacity-60" />
                    <div className="w-1.5 h-1.5 bg-amber-400/60 rounded-full opacity-80" />
                    <div className="w-1.5 h-1.5 bg-amber-400/60 rounded-full" />
                </div>
            </div>
        )
    }

    // ─── Registration Success ───────────────────────
    if (regSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#3E2723] via-[#4E342E] to-[#3E2723] flex flex-col items-center justify-center relative overflow-hidden px-8">
                <div className="relative z-10 flex flex-col items-center max-w-xs w-full">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mb-5">
                        <span className="material-icons-round text-emerald-400 text-4xl">check_circle</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Đăng ký thành công! 🎉</h2>
                    <p className="text-sm text-white/60 text-center mb-2">
                        Tài khoản <span className="text-amber-300 font-bold">{regEmail}</span> đã sẵn sàng!
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full mb-6">
                        <div className="flex items-start gap-3">
                            <span className="material-icons-round text-emerald-400 text-lg mt-0.5">rocket_launch</span>
                            <div className="text-xs text-white/50 space-y-1">
                                <p>📎 Tặng bạn <strong className="text-amber-300">50 Gold</strong> dùng thử</p>
                                <p>🎨 Đăng nhập để tạo nội dung marketing AI</p>
                                <p>🚀 Bắt đầu ngay — không cần xác thực!</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setMode('login')
                            setEmail(regEmail)
                            setRegSuccess(false)
                        }}
                        className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
                    >
                        ← Đăng nhập ngay
                    </button>
                </div>
            </div>
        )
    }

    // ─── Main Form ──────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#3E2723] via-[#4E342E] to-[#3E2723] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0" aria-hidden="true">
                <div className="absolute top-20 right-0 w-60 h-60 bg-amber-500/5 rounded-full" />
                <div className="absolute bottom-40 left-0 w-48 h-48 bg-amber-600/5 rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col items-center pt-12 px-8" style={{ minHeight: '520px' }}>
                {/* Logo */}
                <img src="/logo-fnbanlien.png" alt="FnBanLien" className="w-16 h-16 rounded-2xl shadow-xl shadow-amber-500/20 mb-3 object-contain" />
                <h1 className="text-xl font-black text-white">fnbanlien</h1>
                <p className="text-amber-300/50 text-[10px] mt-0.5 font-medium tracking-widest uppercase mb-5">Marketing Platform</p>

                {/* Tab Switcher */}
                <div className="w-full max-w-xs flex bg-white/5 rounded-xl p-1 mb-5">
                    <button
                        onClick={() => { setMode('login'); setError(''); setRegError(''); }}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                            mode === 'login'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-white/40 hover:text-white/60'
                        }`}
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={() => { setMode('register'); setError(''); setRegError(''); }}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                            mode === 'register'
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'text-white/40 hover:text-white/60'
                        }`}
                    >
                        Đăng ký miễn phí
                    </button>
                </div>

                {/* ═══ LOGIN MODE ═══ */}
                {mode === 'login' && (
                    <div className="w-full max-w-xs space-y-3">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full relative flex items-center justify-center gap-3 py-3 bg-white hover:bg-neutral-100 text-neutral-800 rounded-xl text-sm font-bold shadow-lg shadow-black/10 active:scale-[0.98] transition-all disabled:opacity-80"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Đăng nhập bằng Google
                        </button>

                        <div className="flex items-center gap-2 my-2">
                            <div className="h-px bg-white/10 flex-1"></div>
                            <span className="text-[10px] uppercase text-white/30 font-bold">Hoặc</span>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1 block">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="owner@quancafe.vn"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-amber-400/50 transition-colors"
                                autoComplete="email"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1 block">Mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-amber-400/50 transition-colors"
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="space-y-1">
                                <p className="text-xs text-red-400 text-center font-bold">{error}</p>
                                {error.includes('chậm') && (
                                    <button
                                        onClick={handleLogin}
                                        className="w-full text-[10px] text-amber-400/70 underline text-center"
                                    >
                                        Thử lại ngay →
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Quên mật khẩu */}
                        {!showForgot && (
                            <button
                                onClick={() => { setShowForgot(true); setForgotEmail(email); setForgotStatus('idle'); }}
                                className="w-full text-[11px] text-amber-400/60 hover:text-amber-300 text-center transition-colors"
                            >
                                Quên mật khẩu?
                            </button>
                        )}

                        {showForgot && (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 animate-fade-in">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-icons-round text-amber-400 text-lg">mail</span>
                                    <p className="text-xs font-bold text-white/80">Khôi phục mật khẩu</p>
                                </div>

                                {forgotStatus === 'sent' ? (
                                    <div className="text-center space-y-2">
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                            <span className="material-icons-round text-emerald-400 text-2xl">check_circle</span>
                                        </div>
                                        <p className="text-xs text-emerald-400 font-bold">Đã gửi email!</p>
                                        <p className="text-[10px] text-white/40">Kiểm tra hộp thư và làm theo hướng dẫn để đặt lại mật khẩu.</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-[10px] text-white/40">Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu.</p>
                                        <input
                                            type="email"
                                            value={forgotEmail}
                                            onChange={e => setForgotEmail(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleForgotPassword()}
                                            placeholder="Email của bạn..."
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-amber-400/50 transition-colors"
                                        />
                                        {forgotError && (
                                            <p className="text-[10px] text-red-400 font-medium">{forgotError}</p>
                                        )}
                                        <button
                                            onClick={handleForgotPassword}
                                            disabled={forgotStatus === 'sending'}
                                            className="w-full py-2.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {forgotStatus === 'sending' ? (
                                                <><span className="w-3 h-3 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin" /> Đang gửi...</>
                                            ) : (
                                                <><span className="material-icons-round text-sm">send</span> Gửi email khôi phục</>
                                            )}
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => { setShowForgot(false); setForgotStatus('idle'); setForgotError(''); }}
                                    className="w-full text-[10px] text-white/30 hover:text-white/50 transition-colors"
                                >
                                    ← Quay lại đăng nhập
                                </button>
                            </div>
                        )}

                        <button
                            onClick={handleLogin}
                            disabled={isLoading || isLockedOut}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                        >
                            {isLockedOut ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="material-icons-round text-base">lock_clock</span>
                                    Đợi {lockoutRemaining}s...
                                </span>
                            ) : isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Đang đăng nhập...
                                </span>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>

                        {/* Demo Button */}
                        <button
                            onClick={handleEnterDemo}
                            className="w-full py-3 border border-white/15 text-white/70 rounded-xl text-sm font-semibold hover:bg-white/5 hover:text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-icons-round text-base text-amber-400">visibility</span>
                            Xem Demo Miễn Phí
                        </button>
                    </div>
                )}

                {/* ═══ REGISTER MODE ═══ */}
                {mode === 'register' && (
                    <div className="w-full max-w-xs space-y-3">
                        {/* Free tier notice */}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2">
                            <span className="material-icons-round text-emerald-400 text-base mt-0.5">card_giftcard</span>
                            <div>
                                <p className="text-[11px] font-bold text-emerald-300">Tạo tài khoản, nhận ngay 15 ngày trải nghiệm PRO đầy đủ tính năng FnB Ăn Liền.</p>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full relative flex items-center justify-center gap-3 py-3 bg-white hover:bg-neutral-100 text-neutral-800 rounded-xl text-sm font-bold shadow-lg shadow-black/10 active:scale-[0.98] transition-all disabled:opacity-80"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Đăng ký nhanh bằng Google
                        </button>

                        <div className="flex items-center gap-2 my-2">
                            <div className="h-px bg-white/10 flex-1"></div>
                            <span className="text-[10px] uppercase text-white/30 font-bold">Hoặc</span>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1 block">Email * <span className="text-white/20 normal-case">(dùng để đăng nhập)</span></label>
                            <input
                                type="email"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                placeholder="owner@quancafe.vn"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-emerald-400/50 transition-colors"
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1 block">Mật khẩu * <span className="text-white/20 normal-case">(tối thiểu 6 ký tự)</span></label>
                            <input
                                type="password"
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-emerald-400/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1 block">Xác nhận mật khẩu *</label>
                            <input
                                type="password"
                                value={regConfirmPw}
                                onChange={(e) => setRegConfirmPw(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-emerald-400/50 transition-colors"
                            />
                        </div>

                        {regError && (
                            <p className="text-xs text-red-400 text-center font-bold">{regError}</p>
                        )}

                        <button
                            onClick={handleRegister}
                            disabled={regLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                        >
                            {regLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Đang tạo tài khoản...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons-round text-base">person_add</span>
                                    Đăng ký miễn phí
                                </>
                            )}
                        </button>

                        <p className="text-[9px] text-white/25 text-center">
                            Đăng ký xong là dùng được ngay — không cần xác thực email
                        </p>
                    </div>
                )}

                {/* Contact info */}
                <div className="mt-5 space-y-2">
                    <p className="text-[10px] text-white/30 text-center font-medium tracking-wide uppercase">Liên hệ tư vấn</p>
                    <div className="flex items-center justify-center gap-3">
                        <a
                            href="mailto:long2492000@gmail.com"
                            title="Email"
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-amber-500/20 hover:border-amber-400/30 hover:text-amber-300 transition-all active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        </a>
                        <a
                            href="tel:0528442530"
                            title="Điện thoại: 0528442530"
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-green-500/20 hover:border-green-400/30 hover:text-green-300 transition-all active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        </a>
                        <a
                            href="https://www.facebook.com/Long2492"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Facebook"
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-blue-500/20 hover:border-blue-400/30 hover:text-blue-300 transition-all active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        </a>
                        <a
                            href="https://www.tiktok.com/@long.moquancaphe"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="TikTok"
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-pink-500/20 hover:border-pink-400/30 hover:text-pink-300 transition-all active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z" /></svg>
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-[9px] text-white/20 mt-6 text-center">
                    Bằng việc đăng nhập/đăng ký, bạn đồng ý với{' '}
                    <span className="text-amber-400/40 underline">Điều khoản</span> và{' '}
                    <span className="text-amber-400/40 underline">Chính sách bảo mật</span>
                </p>
            </div>
        </div>
    )
}
