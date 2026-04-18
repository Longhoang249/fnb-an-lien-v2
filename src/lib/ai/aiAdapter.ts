// src/lib/ai/aiAdapter.ts
// The central gateway that intercepts ALL requests to Edge Functions/AI APIs
// Ensures retry logic, fallback, timeout handling, and prevents "infinite spinners"

import { logAPICall } from "../monitoring/apiLogger";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const TIMEOUT_MS = 30000; // 30 seconds

export interface AIRequestPayload {
  shopId: string;
  feature: "studio_ai" | "content_writer" | "matcha_chat";
  prompt: string;
  options?: Record<string, any>;
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  retryCount: number;
  responseTimeMs: number;
}

// Utility: Delay for backoff
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Utility: Fetch with timeout
async function fetchWithTimeout(resource: RequestInfo, options: RequestInit & { timeout: number }) {
  const { timeout = 30000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Lỗi Timeout: Không nhận được phản hồi từ AI (Quá 30 giây).");
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Main AI call function that every component MUST use instead of direct fetch.
 */
export async function callAIWithRetry<T = any>(
  endpointUrl: string,
  requestPayload: AIRequestPayload,
  authHeader: string
): Promise<AIResponse<T>> {
  let lastError: Error | null = null;
  const startTime = Date.now();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(requestPayload),
        timeout: TIMEOUT_MS,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Server lỗi (${response.status})`);
      }

      const responseTime = Date.now() - startTime;

      // Log thành công
      await logAPICall({
        shopId: requestPayload.shopId,
        feature: requestPayload.feature,
        status: "success",
        responseTimeMs: responseTime,
      });

      return {
        success: true,
        data: data.data || data,
        retryCount: attempt - 1,
        responseTimeMs: responseTime,
      };
    } catch (err: any) {
      lastError = err;

      // Log lỗi retry
      await logAPICall({
        shopId: requestPayload.shopId,
        feature: requestPayload.feature,
        status: attempt === MAX_RETRIES ? "error" : "retry",
        errorMessage: err.message || "Unknown error",
        responseTimeMs: Date.now() - startTime,
      });

      if (attempt < MAX_RETRIES) {
        // Exponential backoff
        await delay(RETRY_DELAY_MS * Math.pow(2, attempt - 1));
      }
    }
  }

  // Nếu vẫn thất bại sau 3 lần
  const responseTimeMs = Date.now() - startTime;
  console.error("[AI System] All retries failed:", lastError);

  return {
    success: false,
    error: lastError?.message || "Xin lỗi Đại Ca, AI đang bận. Vui lòng thử lại sau vài giây! 🙏",
    retryCount: MAX_RETRIES - 1,
    responseTimeMs,
  };
}
