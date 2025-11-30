import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const location = useLocation(); 

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? '#e67e22' : '#5d4037', 
      fontWeight: '500',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px' 
    };
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top" style={{ backgroundColor: '#fcf8e3', borderBottom: '1px solid #dcdcdc', zIndex: 1000 }}>
      <div className="container">
        
        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ color: '#5d4037', fontWeight: 'bold', fontSize: '20px' }}>
          <img
            src="/images/logo.png" 
            alt="Logo"
            style={{ height: '40px', width: 'auto', marginRight: '10px' }}
          />
          Sách Cũ Theo Khu Vực
        </Link>

        {/* Nút toggle cho mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* DANH SÁCH MENU */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-lg-4">
            
            {/* 1. Trang chủ */}
            <li className="nav-item">
              <Link className="nav-link" to="/" style={getLinkStyle('/')}>
                <i className="bi bi-house-door"></i> Trang chủ
              </Link>
            </li>

            {/* 2. Tìm sách */}
            <li className="nav-item">
              <Link className="nav-link" to="/pages/search" style={getLinkStyle('/pages/search')}>
                <i className="bi bi-search"></i> Tìm sách
              </Link>
            </li>

            {/* 3. Đăng bài */}
            <li className="nav-item">
              <Link className="nav-link" to="/pages/create-posts" style={getLinkStyle('/pages/create-posts')}>
                <i className="bi bi-pencil-square"></i> Đăng bài
              </Link>
            </li>

             {/* 4. Bài đăng của tôi */}
             <li className="nav-item">
              <Link className="nav-link" to="/pages/my-posts" style={getLinkStyle('/pages/my-posts')}>
                <i className="bi bi-stack"></i> Bài đăng của tôi
              </Link>
            </li>

            {/* 5. Tài khoản (Thay cho Đăng nhập) */}
            <li className="nav-item">
              <Link className="nav-link" to="/user/profile" style={getLinkStyle('/user/profile')}>
                <i className="bi bi-person-circle"></i> Tài khoản
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;