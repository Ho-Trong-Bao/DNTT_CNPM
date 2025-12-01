/**
 * File: frontend/src/components/Navbar.js
 * Navigation Bar Component
 */
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav } from 'react-bootstrap';
import { isAuthenticated, logout, getCurrentUser } from '../utils/authUtils';
import { toast } from 'react-toastify';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = isAuthenticated();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    toast.success('Đăng xuất thành công!');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <BSNavbar expand="lg" className="navbar-light sticky-top">
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          <img src="/assets/logo.png" alt="Logo" />
          Sách Cũ Theo Khu Vực
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="navbarNav" />
        
        <BSNavbar.Collapse id="navbarNav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/" className={isActive('/')}>
              <i className="bi bi-house-door me-1"></i>
              Trang chủ
            </Nav.Link>
            
            <Nav.Link as={Link} to="/search" className={isActive('/search')}>
              <i className="bi bi-search me-1"></i>
              Tìm sách
            </Nav.Link>
            
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/post-book" className={isActive('/post-book')}>
                  <i className="bi bi-pencil-square me-1"></i>
                  Đăng bài
                </Nav.Link>
                
                <Nav.Link as={Link} to="/my-posts" className={isActive('/my-posts')}>
                  <i className="bi bi-collection me-1"></i>
                  Bài đăng của tôi
                </Nav.Link>
                
                <Nav.Link as={Link} to="/account" className={isActive('/account')}>
                  <i className="bi bi-person-circle me-1"></i>
                  {user?.name || 'Tài khoản'}
                </Nav.Link>
                
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Đăng xuất
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className={isActive('/login')}>
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Đăng nhập
              </Nav.Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;