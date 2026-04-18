/**
 * AI Adapter — thin wrapper around Supabase Edge Functions for AI calls.
 * Handles request/response, error classification, and optimistic gold flow.
 */

import { supabase } from './supabase/client'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AIRequestPayload {
  shopId?: string
  feature: string
  prompt?: string
  userId?: string
  [key: string]: unknown
}

export interface AIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  errorCode?: string
  goldSpent?: number
}

// ── Error classification ─────────────────────────────────────────────────────

export class AIError extends Error {
  code: string
  statusCode?: number

  constructor(message: string, code: string, statusCode?: number) {
    super(message)
    this.name = 'AIError'
    this.code = code
    this.statusCode = statusCode
  }
}

const ERROR_MAP: Record<number, { code: string; friendly: string }> = {
  400: { code: 'INVALID_REQUEST', friendly: 'Yêu cầu không hợp lệ. Hãy thử lại!' },
  401: { code: 'UNAUTHORIZED', friendly: 'Vui lòng đăng nhập lại.' },
  402: { code: 'INSUFFICIENT_GOLD', friendly: 'Không đủ Gold! Hãy nạp thêm Gold để tiếp tục.' },
  403: { code: 'FORBIDDEN', friendly: 'Bạn không có quyền sử dụng tính năng này.' },
  429: { code: 'RATE_LIMITED', friendly: 'Quá nhiều yêu cầu. Hãy chờ một chút rồi thử lại.' },
  500: { code: 'SERVER_ERROR', friendly: 'Server đang bận. Tiểu Đệ sẽ thử lại ngay!' },
  502: { code: 'BAD_GATEWAY', friendly: 'Kết nối bị gián đoạn. Hãy thử lại.' },
  503: { code: 'SERVICE_UNAVAILABLE', friendly: 'Dịch vụ AI tạm thời không khả dụng.' },
}

// ── Core invoke function ──────────────────────────────────────────────────────

/**
 * Invoke a Supabase Edge Function with retry logic.
 * @param functionName  The Edge Function name (without the /functions/v1/ prefix)
 * @param payload       The request body
 * @param authToken     The user's Supabase auth token
 * @param options       Retry count and gold cost
 */
export async function invokeAIFunction<T = unknown>(
  functionName: string,
  payload: AIRequestPayload,
  authToken: string,
  options: { retries?: number; goldCost?: number } = {}
): Promise<AIResponse<T>> {
  const { retries = 2, goldCost = 5 } = options
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const { data, error } = await supabase.functions.invoke<T>(functionName, {
        body: { ...payload, goldCost },
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (error) {
        // Supabase returns error with status code
        const statusCode = (error as { status?: number }).status ?? 500
        const mapped = ERROR_MAP[statusCode] ?? ERROR_MAP[500]

        // 402 Insufficient Gold — do NOT retry
        if (statusCode === 402) {
          return {
            success: false,
            error: mapped.friendly,
            errorCode: mapped.code,
          }
        }

        throw new AIError(mapped.friendly, mapped.code, statusCode)
      }

      return { success: true, data: data ?? undefined }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))

      // Don't retry on 402
      if (lastError instanceof AIError && lastError.statusCode === 402) {
        return {
          success: false,
          error: lastError.message,
          errorCode: lastError.code,
        }
      }
    }
  }

  // All retries exhausted
  return {
    success: false,
    error: lastError?.message ?? 'Lỗi không xác định. Hãy thử lại sau.',
    errorCode: 'MAX_RETRIES',
  }
}

// ── Feature-specific wrappers ─────────────────────────────────────────────────

export interface ContentRequest {
  feature: 'content_writer' | 'caption_generator' | 'review_replier'
  shopId: string
  userId: string
  prompt: string
  brandDNA?: Record<string, unknown>
}

export interface ImageRequest {
  feature: 'concept_generator' | 'banner_generator'
  shopId: string
  userId: string
  prompt: string
  visualDNA?: Record<string, unknown>
}

export async function generateContent(req: ContentRequest, token: string) {
  return invokeAIFunction<{ content: string }>('content_writer', {
    shopId: req.shopId,
    feature: req.feature,
    prompt: req.prompt,
    userId: req.userId,
    brandDNA: req.brandDNA,
  }, token, { retries: 2, goldCost: 5 })
}

export async function generateImage(req: ImageRequest, token: string) {
  return invokeAIFunction<{ imageUrl: string; prompt: string }>('image_generator', {
    shopId: req.shopId,
    feature: req.feature,
    prompt: req.prompt,
    userId: req.userId,
    visualDNA: req.visualDNA,
  }, token, { retries: 2, goldCost: 10 })
}
