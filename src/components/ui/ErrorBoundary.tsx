import React from 'react';

// src/components/ui/ErrorBoundary.tsx
// Component không thể thiếu cho V2 để bắt mọi lỗi React, tránh màn hình trắng (White screen of death)

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // Optionally log to user_error_reports in V2
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center p-6 text-center h-full bg-slate-900 rounded-lg border border-red-500/30">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Đã có lỗi không mong muốn</h2>
          <p className="text-slate-400 mb-6 max-w-sm">
            Tiểu Đệ Matcha xin lỗi Đại Ca! Giao diện này đang gặp sự cố nhỏ. Vui lòng thiết lập lại.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded shadow hover:scale-105 transition-transform"
          >
            Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
