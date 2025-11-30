// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- LOGIC PHÂN LOẠI MÀU SẮC ---

  // 1. Khởi tạo Error (Màu đỏ) nếu type gửi đến là 'error'
  const [error, setError] = useState(() => {
    return location.state?.type === 'error' ? location.state.message : '';
  });

  // 2. Khởi tạo Success (Màu xanh) nếu type gửi đến là 'success'
  const [successMsg, setSuccessMsg] = useState(() => {
    return location.state?.type === 'success' ? location.state.message : '';
  });

  // Xóa history state
  useEffect(() => {
    if (location.state) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogin = (e) => {
    e.preventDefault();

    // 1. Tài khoản Admin mặc định
    const defaultUser = {
      email: 'nguyenvana@example.com',
      password: '123456',
      name: 'Nguyễn Văn A (Admin)',
      phone: '0909123456',
      city: 'TP.HCM',
      district: 'Quận 1',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'admin' // Thêm thuộc tính role để phân biệt
    };

    // 2. Tài khoản Đăng ký (Lấy từ localStorage - Mockup)
    const storedUser = JSON.parse(localStorage.getItem('mockUser'));

    // 3. Logic kiểm tra
    const isDefaultAuth = (email === defaultUser.email && password === defaultUser.password);
    const isMockAuth = storedUser && (email === storedUser.email && password === storedUser.password);

    if (isDefaultAuth || isMockAuth) {
      // Đăng nhập thành công -> Lưu cờ
      localStorage.setItem('isLoggedIn', 'true');

      if (isMockAuth) {
        // USER THƯỜNG -> Về trang chủ
        const currentUserData = {
          city: 'Chưa cập nhật',
          district: 'Chưa cập nhật',
          avatar: 'https://i.pravatar.cc/150?img=12',
          role: 'user', // Gán role user
          ...storedUser
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUserData));
        navigate('/');

      } else {
        // ADMIN -> Về trang Admin Dashboard
        localStorage.setItem('currentUser', JSON.stringify(defaultUser));

        // --- SỬA Ở ĐÂY: Chuyển hướng đặc biệt cho Admin ---
        navigate('/pages/admin');
      }

    } else {
      // Đăng nhập thất bại
      setError('Email hoặc mật khẩu không hợp lệ!');
      setSuccessMsg('');
      setPassword('');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setSuccessMsg('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#fffbe6' }}>
      <Navbar />

      <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="card shadow-sm border-0 p-4" style={{ width: '100%', maxWidth: '450px', backgroundColor: '#ffffff', borderRadius: '12px' }}>

          <h3 className="text-center mb-2 text-brown fw-bold">
            <span role="img" aria-label="key">Đăng nhập</span>
          </h3>

          <div style={{ minHeight: '24px' }} className="text-center mb-2">

            {/* THÔNG BÁO LỖI (MÀU ĐỎ - Dùng khi Login sai hoặc bị chặn) */}
            {error && (
              <span className="text-danger small fw-bold">
                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                {error}
              </span>
            )}

            {/* THÔNG BÁO THÀNH CÔNG (MÀU XANH - Dùng khi Đăng ký xong) */}
            {successMsg && (
              <span className="text-success small fw-bold">
                <i className="bi bi-check-circle-fill me-1"></i>
                {successMsg}
              </span>
            )}

          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label className="fw-bold mb-1 small">Email</label>
              <input
                type="email"
                className={`form-control py-2 ${error ? 'is-invalid' : ''}`}
                placeholder="Nhập email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="fw-bold mb-1 small">Mật khẩu</label>
              <input
                type="password"
                className={`form-control py-2 ${error ? 'is-invalid' : ''}`}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input type="checkbox" id="remember" className="form-check-input" />
                <label htmlFor="remember" className="form-check-label small">Ghi nhớ</label>
              </div>
              <a href="#" className="link-custom small">Quên mật khẩu?</a>
            </div>

            <button type="submit" className="btn btn-danger w-100 py-2 mb-3 fw-bold shadow-sm">
              Đăng nhập
            </button>

            <div className="text-center">
              <span className="small">Chưa có tài khoản? </span>
              <Link to="/pages/signup" className="link-custom fw-bold small">Đăng ký ngay</Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;