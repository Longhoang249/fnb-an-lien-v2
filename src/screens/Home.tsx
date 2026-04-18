import React from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-8">
      {/* ── Brand identity ─────────────────────────────────────────── */}
      <div className="text-center space-y-2 animate-fade-in">
        <p className="text-sm font-medium text-primary tracking-widest uppercase">
          FnB Ăn Liền
        </p>
        <h1 className="font-display text-5xl font-bold text-foreground leading-tight">
          Marketing AI<br />
          <span className="text-gold">cho Chủ Quán</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Trợ lý AI đầu tiên dành riêng cho quán FnB Việt Nam — tạo content trong 1 phút, không cần agency.
        </p>
      </div>

      {/* ── Feature cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl animate-slide-up">
        <Card variant="bordered" className="p-5">
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-base">Content Writer</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CardDescription>
              Tạo bài viết Facebook, caption, biểu ngữ tự động theo phong cách thương hiệu của Đại Ca.
            </CardDescription>
          </CardContent>
        </Card>

        <Card variant="bordered" className="p-5">
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-base">Studio AI</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CardDescription>
              Thiết kế ảnh concept, poster, banner với AI hiểu DNA thị giác thương hiệu.
            </CardDescription>
          </CardContent>
        </Card>

        <Card variant="bordered" className="p-5">
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-base">Menu AI</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CardDescription>
              Quản lý menu, tạo món mới, tối ưu giá và phân loại dễ dàng.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 animate-slide-up">
        <Button variant="primary" size="lg">
          Bắt đầu ngay
        </Button>
        <Button variant="outline" size="lg">
          Khám phá tính năng
        </Button>
      </div>

      {/* ── Footer note ─────────────────────────────────────────────── */}
      <p className="text-xs text-muted-foreground animate-fade-in">
        Phase 1 — Boilerplate Foundation & Infrastructure
      </p>
    </main>
  )
}

export default Home
