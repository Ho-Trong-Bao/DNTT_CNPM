/**
 * File: frontend/src/components/ProtectedRoute.js
 * Protected Route Component - Bảo vệ các route yêu cầu đăng nhập
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';
import { toast } from 'react-toastify';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    toast.warning('Vui lòng đăng nhập để tiếp tục!');
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;