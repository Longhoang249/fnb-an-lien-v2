// Supabase Edge Function: content_writer
// Auth: manual JWT decode (same pattern as ai-chat to avoid 401 gateway issues)
// Deploy with: supabase functions deploy content_writer

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ── Manual JWT decode (avoids 401 gateway bug in verify_jwt=true mode) ──
    const authHeader = req.headers.get('Authorization') || ''
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized — missing Bearer token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.slice(7)
    let userId: string | null = null
    let userEmail: string | null = null

    try {
      const parts = token.split('.')
      if (parts.length !== 3) throw new Error('Invalid JWT format')
      const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const padded = payloadB64.padEnd(payloadB64.length + ((4 - (payloadB64.length % 4)) % 4), '=')
      const decoded = new TextDecoder().decode(
        Uint8Array.from(atob(padded), c => c.charCodeAt(0))
      )
      const payload = JSON.parse(decoded)
      userId = payload.sub ?? null
      userEmail = payload.email ?? null

      // Check expiry
      if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
        return new Response(JSON.stringify({ error: 'Token expired — please re-login' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } catch (decodeErr) {
      console.error('[content_writer] JWT decode error:', decodeErr)
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const { prompt, goldCost = 5, feature = 'content_writer' } = body as {
      prompt?: string
      goldCost?: number
      feature?: string
    }

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // TODO: Integrate with Gemini API (similar to ai-chat edge function)
    // For now, return a structured mock response
    const mockContent = `✨ *Bài viết được tạo bởi FnB Ăn Liền AI*\n\n` +
      `📝 *Chủosen: ${userEmail ?? 'Unknown'}*\n\n` +
      `${prompt.trim()}\n\n` +
      `---\n🍵 *Hệ thống Marketing AI cho chủ quán FnB Việt Nam*`

    return new Response(JSON.stringify({
      success: true,
      data: { content: mockContent },
      goldSpent: goldCost,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('[content_writer] Error:', err)
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
