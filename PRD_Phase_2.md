# PRD: Phase 2 - User Onboarding & Visual DNA

## 1. Mục tiêu (Objective)
Xây dựng luồng Đăng nhập (Auth), tạo quy trình Onboarding thu thập tâm lý kinh doanh (Brand DNA) và form cấu hình nhận diện thương hiệu (Visual DNA) kế thừa chuẩn từ V1.
**Quyền hạn đặc biệt:** AI Agent có toàn quyền tự quyết định cấu trúc code, tự động triển khai và chuyển tiếp sang Phase 3 khi xong.

## 2. Tasks Chi tiết

### Task 1: Authentication & Layout
- Tạo module auth tại `src/lib/supabase/auth.ts` sử dụng Supabase Auth.
- Xây dựng `src/screens/Auth.tsx` (Giao diện đăng nhập/Đăng ký siêu đẹp với tone Gold/Black).
- Tạo `BaseLayout.tsx` (Navbar + Sidebar) để bọc các route được bảo vệ (Protected Routes).

### Task 2: Brand Onboarding Wizard (Luồng 5 bước)
Khởi tạo `src/screens/BrandOnboarding/` bao gồm một flow đa bước (Wizard).
- **Step 1:** Tâm lý định vị (Mức giá, đối tượng khách hàng).
- **Step 2:** Unique Selling Proposition (USP) - Điểm bán hàng độc nhất.
- **Step 3:** Brand Archetype (Hình mẫu thương hiệu - Sage, Magician, Jester...).
- Yêu cầu: Sử dụng React State hoặc Zustand để giữ data giữa các form. Khi Submit -> insert vào bảng `shop_profiles` trong Supabase.

### Task 3: Visual DNA System (Bản thiết kế cốt lõi)
Tạo `src/screens/VisualFormEditor/index.tsx`.
- Flow này có khoảng 7-tabs (Colors, Fonts, Layout Styles, Emojis, Photography style...).
- Đảm bảo giao diện trực quan, có pre-view nhỏ (mockup) bên cạnh mỗi Option.
- Lưu cấu hình này dưới dạng cấu trúc JSON lưu vào Supabase.

## 3. Chuyển giao tự động (Auto-transition Trigger)
**CRITICAL INSTRUCTION TRÀNH CHO CLAUDE CODE:**
Ngay khi các component trên build không còn lỗi, và có thể render màn hình thành công trong CLI, bạn **KHÔNG ĐƯỢC DỪNG LẠI CHỜ DUYỆT**. Hãy ngay lập tức mở file `PRD_Phase_3.md`, đọc nội dung của nó và tự động bắt tay vào làm Phase 3 ngay lập tức.
