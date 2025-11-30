// src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 1. Import Navbar và Footer
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value 
    });
    setError('');
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    const newUser = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      avatar: 'https://i.pravatar.cc/150?img=12' 
    };

    localStorage.setItem('mockUser', JSON.stringify(newUser));

    navigate('/pages/login', { 
      state: { message: "Đăng ký thành công! Hãy đăng nhập ngay.", type: 'success' } 
    });
  };

  return (
    // 2. Chuyển layout sang flex-column để chứa Navbar - Body - Footer
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#fffbe6' }}>
      
      {/* THANH ĐIỀU HƯỚNG */}
      <Navbar />

      {/* PHẦN THÂN: flex-grow-1 để đẩy Footer xuống đáy */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        
        <div className="card shadow-sm border-0 p-4" style={{ width: '100%', maxWidth: '550px', backgroundColor: '#ffffff', borderRadius: '12px' }}>
          
          <h3 className="text-center mb-4 text-brown fw-bold">
            <span role="img" aria-label="edit" className="me-2">Đăng ký tài khoản</span>
          </h3>
          
          {error && <div className="alert alert-danger py-2 small fw-bold text-center">{error}</div>}

          <form onSubmit={handleSignup}>
            
            <div className="form-group mb-3">
              <label className="fw-bold mb-1 small" htmlFor="name">Họ và tên</label>
              <input 
                type="text" id="name" className="form-control py-2" placeholder="Nhập họ tên của bạn" 
                required onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label className="fw-bold mb-1 small" htmlFor="email">Email</label>
              <input 
                type="email" id="email" className="form-control py-2" placeholder="Nhập địa chỉ email" 
                required onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label className="fw-bold mb-1 small" htmlFor="phone">Số điện thoại</label>
              <input 
                type="tel" id="phone" className="form-control py-2" placeholder="Nhập số điện thoại" 
                required onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label className="fw-bold mb-1 small" htmlFor="password">Mật khẩu</label>
              <input 
                type="password" id="password" className="form-control py-2" placeholder="Tạo mật khẩu" 
                required onChange={handleChange}
              />
            </div>

            <div className="form-group mb-4">
              <label className="fw-bold mb-1 small" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input 
                type="password" id="confirmPassword" className="form-control py-2" placeholder="Nhập lại mật khẩu" 
                required onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-danger w-100 py-2 mb-3 fw-bold shadow-sm">
              Đăng ký
            </button>
          </form>

          <div className="text-center mt-2">
            <span className="text-muted small">Đã có tài khoản? </span>
            <Link to="/pages/login" className="link-custom fw-bold small">Đăng nhập</Link>
          </div>
        </div>
      </div>

      {/* CHÂN TRANG */}
      <Footer />

    </div>
  );
};

export default Signup;