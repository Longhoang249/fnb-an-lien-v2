# PRD: Phase 4 - AI Workflows & Multimodal Capabilities

## 1. Mục tiêu (Objective)
Tạo cốt lõi giá trị của ứng dụng: Giao tiếp với AI thông qua Edge Functions chuyên biệt, phục dựng luồng Pipeline tạo content và ảnh.
**Quyền hạn đặc biệt:** AI Agent toàn quyền tự thiết kế cơ chế adapter cho Backend (Supabase Functions) dựa theo V1, tự động auto-approve các logic state hóc búa, không cần user duyệt.

## 2. Tasks Chi tiết

### Task 1: AI Chat Interface (Giao diện bong bóng chat)
- Xây dựng `src/screens/AIChat.tsx` & `src/components/chat/ChatBubble.tsx`.
- Giao diện có khu vực gõ văn bản, nút bấm "Tạo Ảnh Ngay", "Generate Post".
- Phải có trạng thái Loading mượt mà (Skeleton hoặc Spinner) trong lúc AI suy nghĩ.

### Task 2: Supabase Edge Functions Connector (`aiAdapter.ts`)
- Tạo hàm gọi Edge Function thông qua thư viện `supabase.functions.invoke()`.
- Xây dựng file `src/lib/aiAdapter.ts` để bọc các request gửi lên API.
- Logic quan trọng: Xử lý các mã lỗi (402 Thiếu Gold, 500 Lỗi Server). Bắt buộc phải hiện màn hình báo lỗi thông báo thân thiện (không crash app).

### Task 3: Background Safety & Optimistic Refund
- Triển khai cơ chế Optimistic UI cho tài sản Gold.
- Khi gửi request: TRỪ GOLD TRƯỚC trên thanh Header để tạo cảm giác phản hồi nhanh.
- Nếu Edge Function trả về lỗi (catch error) -> TỰ ĐỘNG HOÀN TRẢ Gold trên Header bằng hàm của Zustand store (đã viết ở Phase 3). Đảm bảo user không mất tài sản oan.

## 3. Chuyển giao tự động (Auto-transition Trigger)
**CRITICAL INSTRUCTION TRÀNH CHO CLAUDE CODE:**
Sau khi tích hợp xong Frontend AI và không có lỗi TypeScript nào xuất hiện, ngay lập tức tiến tới Phase tổng kết. Mở file `PRD_Phase_5.md`, đọc hiểu file đó và hoàn thiện Phase cuối cùng trong process màn hình của bạn!
