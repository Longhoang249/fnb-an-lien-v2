import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/lib/authContext'

/**
 * Wraps a route that requires authentication.
 * If the user is not logged in, redirects to the auth page.
 * If still loading, renders nothing (avoids flash).
 */
export function ProtectedRoute({ redirectTo = '/' }: { redirectTo?: string }): React.ReactElement {
  const { sessionActive, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!sessionActive) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}