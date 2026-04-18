-- supabase/migrations/v2_telemetry.sql
-- Thêm các bảng Telemetry để theo dõi Health status của hệ thống V2

CREATE TABLE IF NOT EXISTS ai_api_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,         -- 'studio_ai', 'content_writer', 'matcha_chat'
    status TEXT NOT NULL,          -- 'success', 'error', 'retry'
    request_summary TEXT,          -- Tóm tắt request (JSON text)
    error_message TEXT,            -- Lỗi chi tiết (nếu có)
    response_time_ms INTEGER,      -- Thời gian phản hồi
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE ai_api_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can view all logs" ON ai_api_logs FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "System can insert logs" ON ai_api_logs FOR INSERT WITH CHECK (true); -- Authenticated users and Edge Functions

CREATE TABLE IF NOT EXISTS user_error_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    screen TEXT NOT NULL,          -- Màn hình sinh ra lỗi
    description TEXT,              -- Báo cáo của User (với ErrorBoundary)
    context JSONB,                 -- User Agent, Dimension...
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE user_error_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can view all errors" ON user_error_reports FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users can submit errors" ON user_error_reports FOR INSERT WITH CHECK (auth.uid() = shop_id);
