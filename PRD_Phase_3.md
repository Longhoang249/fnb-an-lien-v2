# PRD: Phase 3 - Platform Logic, Gamification & Memory Board

## 1. Mục tiêu (Objective)
Tích hợp "linh hồn" của hệ thống Gamification: quản lý Gold (tiền tệ), XP (Kinh nghiệm), Level và Bảng Vinh Danh kỹ thuật số.
**Quyền hạn đặc biệt:** AI Agent được tự động quyết định state management structure (ưu tiên Zustand cho Store), không cần dừng chờ thao tác người dùng.

## 2. Tasks Chi tiết

### Task 1: Gamification & Economy Store (Zustand)
- Cài đặt `zustand`. Tạo `src/lib/store/gamificationStore.ts`.
- Định nghĩa interfaces cho `Profile`: `xp`, `gold`, `level`.
- Viết các action cốt lõi: `addXp(amount)`, `deductGold(amount)`.
- **Luồng xử lý lỗi:** Viết hàm tự động đồng bộ (sync) với Supabase DB. Nếu API call fail, restore lại gold ở frontend.

### Task 2: Dashboard & Leaderboard UI
- Xây dựng `src/screens/Dashboard.tsx`.
- Giao diện có: Thanh Tiến Trình Level (Progress bar mượt mà), số Gold hiện tại.
- Xây dựng component Leaderboard (top những user có XP cao nhất tuần/tháng).

### Task 3: Infinite Memory Board (Bảng Ký Ức Đội Ngũ)
- Khôi phục tính năng từ V1 tên là "InfiniteMemoryBoard" (Canvas kéo thả vô tận).
- Xây dựng không gian để dán các "Memory Note Card" chứa ảnh và caption.
- Tích hợp logic mượt mà, cho phép users upload ảnh (sử dụng Supabase Storage).

## 3. Chuyển giao tự động (Auto-transition Trigger)
**CRITICAL INSTRUCTION TRÀNH CHO CLAUDE CODE:**
Ngay khi các store State hoàn thành, UI Dashboard không có lỗi đỏ, bạn **BẮT BUỘC** phải chuyển ngay sang mở và đọc file `PRD_Phase_4.md`. Xử lý ngay Phase 4 trong process hiện tại. Không dừng lại chờ người dùng nhập lệnh!
