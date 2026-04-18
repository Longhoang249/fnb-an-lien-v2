// ═══════════════════════════════════════════════════
// Edge Function: Register Shop
// Self-registration — all users get PRO by default
// PATTERN: Always returns 200 with { success, error } in body
// ═══════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders, corsResponse, jsonHeaders } from '../_shared/cors.ts'

// ─── In-memory rate limiter (per isolate) ───────
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 3                      // max 3 registrations/IP/hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT_MAX
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return corsResponse(req)
  }

  const headers = jsonHeaders(req)

  // ─── Rate Limiting ────────────────────────
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('cf-connecting-ip')
    || 'unknown'
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Bạn đã tạo quá nhiều tài khoản. Vui lòng thử lại sau 1 giờ.' }),
      { status: 200, headers },
    )
  }

  // Helper: always return 200 with JSON body
  const fail = (error: string) =>
    new Response(JSON.stringify({ success: false, error }), { status: 200, headers })

  const ok = (data: Record<string, unknown>) =>
    new Response(JSON.stringify({ success: true, ...data }), { status: 200, headers })

  try {
    const body = await req.json()
    const { shopName, email, password, phone } = body

    console.log(`[register-shop] Attempt: ${email}`)

    // ─── Validate ────────────────────────────
    if (!shopName?.trim() || !email?.trim() || !password || !phone?.trim()) {
      return fail('Vui lòng điền đầy đủ: Tên quán, Email, Mật khẩu, SĐT')
    }

    if (password.length < 6) {
      return fail('Mật khẩu phải có ít nhất 6 ký tự')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return fail('Email không hợp lệ')
    }

    // Phone: accept VN formats flexibly
    const cleanPhone = phone.trim().replace(/[\s\-().]/g, '')
    if (!/^(0|\+84)\d{9,10}$/.test(cleanPhone)) {
      return fail('Số điện thoại không hợp lệ. VD: 0912345678 hoặc +84912345678')
    }

    // ─── Admin client ────────────────────────
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // ─── Create auth user ────────────────────
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
      user_metadata: {
        shop_name: shopName.trim(),
        phone: cleanPhone,
        role: 'shop_owner',
      },
    })

    if (authError || !authData.user) {
      console.error('[register-shop] Auth error:', authError?.message)
      const errMsg = authError?.message || ''

      if (errMsg.includes('already') || errMsg.includes('exists') || errMsg.includes('duplicate')) {
        return fail('Email này đã được đăng ký. Bấm "Đăng nhập" để vào tài khoản.')
      }

      return fail(`Không thể tạo tài khoản: ${errMsg || 'Lỗi hệ thống'}`)
    }

    const userId = authData.user.id
    console.log(`[register-shop] ✅ Auth user created: ${userId}`)

    // ─── Generate slug ───────────────────────
    const slug = shopName.trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 30)
      + '-' + Math.random().toString(36).slice(2, 6)

    // ─── Create shop ─────────────────────────
    const { data: shop, error: shopError } = await admin
      .from('shops')
      .insert({
        name: shopName.trim(),
        slug,
        owner_id: userId,
        avatar_url: '☕',
        status: 'active',
        plan: 'pro',
        phone: cleanPhone,
      })
      .select('id')
      .single()

    if (shopError || !shop) {
      console.error('[register-shop] Shop insert error:', shopError?.message)
      // Rollback auth user
      await admin.auth.admin.deleteUser(userId)
      return fail('Không thể tạo quán. Vui lòng thử lại.')
    }

    console.log(`[register-shop] ✅ Shop created: ${shop.id}`)

    // ─── Create profile (upsert) ─────────────
    const { error: profileError } = await admin
      .from('user_profiles')
      .upsert({
        id: userId,
        shop_id: shop.id,
        role: 'owner',
        display_name: shopName.trim(),
      }, { onConflict: 'id' })

    if (profileError) {
      console.error('[register-shop] Profile error (non-fatal):', profileError.message)
    }

    // ─── Create gold wallet (upsert) ──────────
    const { error: goldError } = await admin
      .from('gold_wallets')
      .upsert({
        shop_id: shop.id,
        free_gold: 50,
      }, { onConflict: 'shop_id' })

    if (goldError) {
      console.error('[register-shop] Gold error (non-fatal):', goldError.message)
    }

    // ─── Create daily gold (upsert) ──────────
    const { error: dailyError } = await admin
      .from('daily_gold_usage')
      .upsert({
        shop_id: shop.id,
        gold_used: 0,
        gold_limit: 50,
      }, { onConflict: 'shop_id' })

    if (dailyError) {
      console.error('[register-shop] Daily gold error (non-fatal):', dailyError.message)
    }

    console.log(`[register-shop] ✅ All done for "${shopName}" (${email})`)

    return ok({
      message: 'Tạo tài khoản thành công!',
      shopId: shop.id,
    })

  } catch (err) {
    console.error('[register-shop] Unexpected error:', err)
    return fail('Lỗi hệ thống. Vui lòng thử lại sau.')
  }
})
