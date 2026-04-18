import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { AuthProvider } from './lib/authContext'
import { BaseLayout } from './components/layout/BaseLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

// Screens
import Home from './screens/Home'
import AuthScreen from './screens/Auth/index'
import NotFound from './screens/NotFound'
import BrandOnboarding from './screens/BrandOnboarding/index'
import VisualFormEditor from './screens/VisualFormEditor/index'
import Dashboard from './screens/Dashboard'
import AIChat from './screens/AIChat'
import InfiniteMemoryBoard from './screens/InfiniteMemoryBoard'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<AuthScreen />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<BaseLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/brand-onboarding" element={<BrandOnboarding />} />
                <Route path="/visual-form" element={<VisualFormEditor />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ai-chat" element={<AIChat />} />
                <Route path="/memory-board" element={<InfiniteMemoryBoard />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
