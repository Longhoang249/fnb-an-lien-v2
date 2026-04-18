// ═══════════════════════════════════════════════════
// Shared Error Alert Module
// Auto-logs errors to system_errors table (service role)
// Import in any Edge Function for proactive monitoring
// ═══════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

let _admin: ReturnType<typeof createClient> | null = null

function getAdmin() {
  if (!_admin) {
    _admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
  }
  return _admin
}

// ─── Types ──────────────────────────────────────

export interface AlertError {
  function_name: string
  error: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  shopId?: string
  metadata?: Record<string, unknown>
}

// ─── Main: Log Error to DB ──────────────────────

export async function alertError(params: AlertError): Promise<void> {
  try {
    const admin = getAdmin()

    await admin.from('system_errors').insert({
      function_name: params.function_name,
      error_message: params.error.slice(0, 2000), // cap length
      severity: params.severity || 'medium',
      shop_id: params.shopId || null,
      metadata: params.metadata || {},
    })

    console.error(`[ERROR-ALERT] ${params.severity?.toUpperCase() || 'MEDIUM'} | ${params.function_name}: ${params.error.slice(0, 200)}`)
  } catch (e) {
    // Never let error-logging crash the main function
    console.error('[ERROR-ALERT] Failed to log error:', e)
  }
}

// ─── Convenience: Wrap try/catch with auto-alert ─

export function withErrorAlert(functionName: string, shopId?: string) {
  return async (error: unknown, severity: AlertError['severity'] = 'medium', extra?: Record<string, unknown>) => {
    const message = error instanceof Error ? error.message : String(error)
    await alertError({
      function_name: functionName,
      error: message,
      severity,
      shopId,
      metadata: {
        ...extra,
        stack: error instanceof Error ? error.stack?.slice(0, 500) : undefined,
      },
    })
  }
}
