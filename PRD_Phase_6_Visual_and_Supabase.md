# PRD: Phase 6 - Visual Overhaul & Supabase Complete Link (Khôi phục linh hồn V1)

## 1. Mục tiêu (Objective)
Đạt được sự hoàn hảo về thị giác (UI/UX) và giải quyết dứt điểm lỗi rớt đăng nhập.
Để làm được việc này, thay vì tự code từ đầu, AI Agent sẽ "Hút DNA" (Copy File) trực tiếp từ bộ móng nguyên thủy của project cũ nằm tại đường dẫn: 
`/Users/hoangvan/Desktop/AI Project/dong-goi-thuong-hieu.nosync`
vào project hiện tại (`fnb-an-lien-v2`).

**Quyền hạn đặc biệt:** AI Agent sử dụng lệnh `cp` / `cat`, hoặc đọc & ghi file tự động (Read/Write) để đè giao diện từ V1 sang V2 mà không cần hỏi lại. Đảm bảo chạy `npm install` bổ sung nếu import báo lỗi.

---

## 2. Tasks Chi tiết (Lệnh Sao Chép Bắt Buộc)

### Task 1: Khắc phục Authentication (Kết nối Real Supabase)
Nguyên nhân lỗi trước đó là do file `.env` trống thông tin.
**Nhiệm vụ:**
Mở file `fnb-an-lien-v2/.env` và ghi đè toàn bộ nội dung bằng thông tin chính xác từ V1 sau:

```env
# Supabase credentials (Inherited from V1)
VITE_SUPABASE_URL=https://ylijvvzlhsmznhbzptav.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaWp2dnpsaHNtem5oYnpwdGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMjk4NzYsImV4cCI6MjA4NzYwNTg3Nn0.d0Ft5XEf1sPe6KKcB091jP09t_914d1AILyRg5xAp_s
```

### Task 2: Restore "Sách Thánh" CSS & Tailwind (Global Tones)
UI của V2 hiện tại đang nhợt nhạt do không có các bảng màu vàng ngọc, kem sữa, và hiệu ứng bóng đổ từ V1.
**Nhiệm vụ:**
1. Đọc và **Copy Toàn bộ nội dung** của: `/Users/hoangvan/Desktop/AI Project/dong-goi-thuong-hieu.nosync/index.css`
2. **Ghi đè (Overwrite)** vào: `fnb-an-lien-v2/src/index.css`.
3. Đọc và **Copy Toàn bộ nội dung** của: `/Users/hoangvan/Desktop/AI Project/dong-goi-thuong-hieu.nosync/tailwind.config.js`
4. Dịch nó sang TypeScript (nếu cần thiết cho Vite) và **Ghi đè** vào: `fnb-an-lien-v2/tailwind.config.ts`. Đảm bảo giữ nguyên khối cấu hình `colors: { primary, cream, gold... }`. Bổ sung cài đặt `npm install -D @tailwindcss/forms @tailwindcss/container-queries`.

### Task 3: Restore Font Chữ và Thẩm Mỹ Màn Hình (Be Vietnam Pro)
Chữ trông rất thô cứng do thiếu link nhúng phông chữ.
**Nhiệm vụ:**
1. Mở `fnb-an-lien-v2/index.html`.
2. Trích xuất các dòng `<link>` import Google Fonts (`Be Vietnam Pro` và `Outfit`) từ tệp `dong-goi-thuong-hieu.nosync/index.html` và chèn vào thẻ `<head>` của dự án hiện hành.

### Task 4: Thay Máu Màn Hình Đăng Nhập (LoginScreen)
Màn hình đăng nhập hiện tại quá đơn điệu.
**Nhiệm vụ:**
1. Xóa nội dung component `src/screens/Auth/index.tsx`.
2. Trích xuất code 34KB siêu xịn từ file gốc `/Users/hoangvan/Desktop/AI Project/dong-goi-thuong-hieu.nosync/screens/LoginScreen.tsx` chèn thẳng vào màn hình mới.
3. Chú ý: Fix các reference đường dẫn ảnh hưởng (ví dụ đổi `lucide-react` imports nếu cần).
4. Sửa định tuyến (Route) để điều hướng về `/brand-onboarding` sau khi đăng nhập thành công nếu cần, duy trì luồng logic hoàn mỹ.

---

## 3. Chuyển giao tự động & Lệnh Kết Thúc
**✨ CRITICAL INSTRUCTION DÀNH CHO CLAUDE CODE ✨**
Sau khi bạn đã hoàn thiện TẤT CẢ 4 Tasks phía trên:
1. Gõ lệnh `npm run build` để kiểm tra có bị rỗng/sai import TypeScript nào do chép file thiếu không.
2. NẾU CÓ LỖI (vd thiếu icon, package cũ `framer-motion`...): Tự cài thêm package đó và fix Type liên quan.
3. Nếu mọi thứ suôn sẻ: Báo cáo với User dòng chữ *"Phase 6: Visual & Supabase Complete. Mời sếp check lại giao diện!"*. Dừng quy trình tự động!
