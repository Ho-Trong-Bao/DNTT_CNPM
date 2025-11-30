import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('isLoggedIn') === 'true';

  if (!isAuth) {
    return (
      <Navigate 
        to="/pages/login" 
        state={{ message: "Vui lòng đăng nhập để sử dụng tính năng này!", type: 'error' }} 
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute;