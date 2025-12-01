/**
 * File: frontend/src/components/Navbar.jsx
 * Navigation Component
 */
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav } from 'react-bootstrap';
import { isAuthenticated, getCurrentUser, logout, isAdmin } from '../utils/auth';
import { toast } from 'react-toastify';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();

  const handleLogout = () => {
    logout();
    toast.success('Đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <BSNavbar expand="lg" className="navbar-light sticky-top">
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          <img src="/logo.png" alt="Logo" height="40" className="me-2" />
          Sách Cũ Theo Khu Vực
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="navbarNav" />
        
        <BSNavbar.Collapse id="navbarNav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/">
              <i className="bi bi-house-door me-1"></i>Trang chủ
            </Nav.Link>
            
            <Nav.Link as={Link} to="/search">
              <i className="bi bi-search me-1"></i>Tìm sách
            </Nav.Link>
            
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/create-post">
                  <i className="bi bi-pencil-square me-1"></i>Đăng bài
                </Nav.Link>
                
                <Nav.Link as={Link} to="/my-posts">
                  <i className="bi bi-collection me-1"></i>Bài đăng của tôi
                </Nav.Link>
                
                {userIsAdmin && (
                  <Nav.Link as={Link} to="/admin">
                    <i className="bi bi-shield-check me-1"></i>Quản trị
                  </Nav.Link>
                )}
                
                <Nav.Link as={Link} to="/user-info">
                  <i className="bi bi-person-circle me-1"></i>
                  {user?.name || 'Tài khoản'}
                </Nav.Link>
                
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  <i className="bi bi-box-arrow-right me-1"></i>Đăng xuất
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">
                <i className="bi bi-box-arrow-in-right me-1"></i>Đăng nhập
              </Nav.Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;