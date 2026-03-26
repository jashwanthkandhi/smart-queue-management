import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { LandingPage } from '@/pages/LandingPage'
import { JoinQueuePage } from '@/pages/JoinQueuePage'
import { LiveStatusPage } from '@/pages/LiveStatusPage'
import { TokenQRPage } from '@/pages/TokenQRPage'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { LoginPage } from '@/pages/LoginPage'
import { AdminLoginPage } from '@/pages/AdminLoginPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ToastProvider } from '@/components/ui/Toast'
import { AuthProvider } from '@/context/AuthContext'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-16">
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />

                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />

                {/* Customer Protected Routes */}
                <Route
                  path="/join"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <JoinQueuePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/status"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <LiveStatusPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/token"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <TokenQRPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
