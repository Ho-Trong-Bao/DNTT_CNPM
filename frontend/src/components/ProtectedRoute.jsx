/**
 * File: frontend/src/components/ProtectedRoute.jsx
 * Protected Route Component
 */
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth';
import { toast } from 'react-toastify';

function ProtectedRoute({ children, requireAdmin = false }) {
  if (!isAuthenticated()) {
    toast.warning('Vui lòng đăng nhập để tiếp tục!');
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    toast.error('Bạn không có quyền truy cập trang này!');
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;