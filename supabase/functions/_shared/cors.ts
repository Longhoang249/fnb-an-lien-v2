// ═══════════════════════════════════════════════════
// Shared CORS utility for all Edge Functions
// Restricts origins to known domains
// ═══════════════════════════════════════════════════

const ALLOWED_ORIGINS = [
  'https://www.fnbanlien.com',
  'https://fnbanlien.com',
  'https://app.fnbanlien.com',
  'http://localhost:5173',         // Vite dev
  'http://localhost:3000',         // Alt dev
]

export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || ''
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

export function corsResponse(req: Request): Response {
  return new Response('ok', { headers: getCorsHeaders(req) })
}

export function jsonHeaders(req: Request): Record<string, string> {
  return { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
}
