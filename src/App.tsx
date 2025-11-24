import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import ToursPage from './pages/ToursPage';
import CouponsPage from './pages/CouponsPage';
import DestinationsPage from './pages/DestinationsPage';
import ExploresPage from './pages/ExplorePage';

// Import trang mới
import LoginPage from './pages/LoginPage';     // Bạn cần tạo file này
import RegisterPage from './pages/RegisterPage'; // Bạn cần tạo file này (code ở bài trước)
import UserManagement from './pages/UserManagement'; // Trang Admin quản lý Partner (code ở bài trước)

// Import Guard
import { AuthGuard } from './components/AuthGuard';

function App() {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (Không cần đăng nhập) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 2. PROTECTED ROUTES (Phải đăng nhập + Check Status) */}
      <Route path="/" element={
          <AuthGuard>
              <AppLayout /> 
          </AuthGuard>
      }>
        <Route index element={<Dashboard />} />
        <Route path="tours" element={<ToursPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="destinations" element={<DestinationsPage />} />
        <Route path="explores" element={<ExploresPage />} />
        
        {/* Trang dành riêng cho Admin (Sidebar sẽ ẩn với Partner, nhưng cần chặn ở đây nữa nếu muốn chặt chẽ) */}
        <Route path="users" element={<UserManagement />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;