# PRD: Phase 5 - Polish, QA & Deployment (Final Phase)

## 1. Mục tiêu (Objective)
Đóng gói dự án mượt mà, tối ưu hóa code, cấu hình Demo Mode và rà soát bug để sẵn sàng lên Vercel.
**Quyền hạn đặc biệt:** AI Agent tự động dọn dẹp các thư mục thừa, tự viết README.md tổng kết rồi ra tín hiệu hoàn tất.

## 2. Tasks Chi tiết

### Task 1: Demo Mode & Khóa Tính Năng
- Cấu hình trạng thái "Demo Mode" mặc định ("Cà Phê Muối SG") cho người dùng Guest (không đăng nhập).
- Khóa toàn bộ các nút bấm Premium/Generate AI bằng bảng Popup yêu cầu login / thông báo liên hệ Long Hoàng.

### Task 2: Tối ưu UI & Performance
- Xóa các logic `console.log()` dư thừa.
- Bundle Optimization: Xem xét tích hợp React.lazy() với các màn hình lớn như: `InfiniteMemoryBoard`, `AIChat` để app khởi động siêu nhanh.
- Kiểm tra PWA / Meta Tags (Cập nhật Tiêu đề tab, Thẻ mô tả SEO chuẩn).

### Task 3: Finalizing Setup
- Chạy npm lint xem có cảnh báo nào không. Khắc phục ngay lập tức nếu có.
- Cập nhật file `README.md` chính của project bằng tiếng Anh, mô tả dự án là bản V2 chạy trên Vite, cách khởi chạy, cài đặt `.env`.

## 3. Lệnh Kết Thúc (Termination Logic)
✨ **CRITICAL INSTRUCTION TRÀNH CHO CLAUDE CODE:** ✨
Bạn đã đi đến cuối hành trình Phase 5! Xin chúc mừng. Lúc này:
1. Thông báo rõ ràng trên Terminal: **"All 5 Phases of fnb-an-lien-v2 have been completely implemented."**
2. Print ra lời chúc cho **Long Hoàng FnB** ngủ ngon!
3. Dừng quá trình tự động.
