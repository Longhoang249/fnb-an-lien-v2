// src/lib/ai/useAIWorkflow.ts
import { useState } from 'react';
import { callAIWithRetry, type AIRequestPayload } from './aiAdapter';

/**
 * Hook thống nhất cho mọi tính năng AI (Viết bài, Tạo ảnh, Chat).
 * Xử lý mọi logic quay vòng (loading state, error catching, fallback UI).
 */
export function useAIWorkflow() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeAI = async <T = any>(
    endpointUrl: string,
    payload: AIRequestPayload,
    authHeader: string
  ): Promise<T | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await callAIWithRetry<T>(endpointUrl, payload, authHeader);
      
      if (!response.success) {
         setError(response.error || "Gặp sự cố khi kết nối AI.");
         return null;
      }

      return response.data ?? null;
    } catch (err: any) {
      setError(err.message || "Lỗi hệ thống không xác định.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { executeAI, isGenerating, error, setError };
}
