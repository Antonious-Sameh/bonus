import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Footer from '@/components/Footer.jsx';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CustomerProfile from './pages/CustomerProfile';
import LeaderboardPage from './pages/LeaderboardPage';
import SalesReport from './pages/SalesReport'; 
import WhatsAppWidget from "./components/WhatsAppWidget";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          
          <div className="flex-1">
            <Routes>
              {/* توجيه الصفحة الرئيسية لصفحة تسجيل الدخول */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* مسارات الأدمن المحمية */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/leaderboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <LeaderboardPage />
                  </ProtectedRoute>
                }
              />

              {/* صفحة تقارير المبيعات */}
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <SalesReport />
                  </ProtectedRoute>
                }
              />

              {/* مسار العميل - متاح للعميل والأدمن */}
              <Route
                path="/customer/:phone"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <CustomerProfile />
                  </ProtectedRoute>
                }
              />
              
              {/* أي مسار غير معروف يرجع للـ Login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>

          <Footer />
        </div>

        {/* ✅ استدعاء علامة الواتساب هنا بيخليها ثابتة فوق كل الصفحات */}
        <WhatsAppWidget />

        <Toaster position="top-center" toastOptions={{ className: 'font-cairo' }} />
      </Router>
    </AuthProvider>
  );
}

export default App;