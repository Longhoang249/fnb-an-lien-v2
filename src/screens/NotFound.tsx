import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center space-y-4 animate-fade-in">
        <p className="text-8xl font-display font-bold text-primary-lighter leading-none">
          404
        </p>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Trang không tìm thấy
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Tiểu Đệ không tìm thấy trang Đại Ca yêu cầu. Có thể Đại Ca đi lạc đường rồi?
          </p>
        </div>
      </div>

      <Button variant="primary" size="md" onClick={() => navigate('/')}>
        Quay về trang chủ
      </Button>
    </main>
  )
}

export default NotFound
