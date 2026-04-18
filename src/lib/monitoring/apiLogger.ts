// src/lib/monitoring/apiLogger.ts
// Lắng nghe và lưu log API call xuống Supabase để Admin Dashboard đọc được

// TODO: Replace this mock implementation with actual Supabase RPC/insert code in V2
export async function logAPICall(data: {
  shopId: string;
  feature: string;
  status: 'success' | 'retry' | 'error';
  errorMessage?: string;
  responseTimeMs: number;
}) {
  try {
    // const { supabase } = useSupabase();
    // await supabase.from('ai_api_logs').insert(data);
    
    // For V2 Migration setup: we just console.warn if running in dev
    if (process.env.NODE_ENV !== 'production') {
      console.log("[Observability] logAPICall:", data);
    }
  } catch (err) {
    // Fail silently in logger to not kill the app
    console.error("Failed to log API call", err);
  }
}
