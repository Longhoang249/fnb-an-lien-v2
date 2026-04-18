import React, { useState, useEffect } from 'react';

// src/components/ui/LoadingTip.tsx
// Component thay thế cho vòng xoay spinner nhàm chán, giải quyết tâm lý chờ đợi của chủ quán.

const TIPS = [
  "Tip: Post bài vào 11h trưa hoặc 7h tối thường có tỷ lệ chốt đơn cao nhất.",
  "Tip: Giữ hình ảnh chân thật, đừng dùng ảnh mạng. Khách thích thấy 'con người thật' ở quán.",
  "Tip: 80% khách mới đến từ review truyền miệng. Hãy xin review ngay sau khi khách dùng món xong.",
  "Tip: Hình ảnh có tone màu ấm sẽ làm đồ ăn trông ngon miệng hơn.",
  "Tip: Đừng cố bán hàng trong mọi bài viết. Xen kẽ câu chuyện hàng ngày của nhân viên nhé!"
];

export const LoadingTip: React.FC<{ message?: string }> = ({ message = "Đang xử lý..." }) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Đảo tip ngẫu nhiên sau mỗi 4 giây
    const interval = setInterval(() => {
      setTipIndex(Math.floor(Math.random() * TIPS.length));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center animate-pulse">
      {/* Animation thay cho spinner truyền thống có thể tuỳ biến bằng Lottie hoặc CSS ở đây */}
      <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-emerald-400">{message}</h3>
        <p className="text-sm text-slate-400 max-w-md italic transition-opacity duration-500">
          💡 {TIPS[tipIndex]}
        </p>
      </div>
    </div>
  );
};
