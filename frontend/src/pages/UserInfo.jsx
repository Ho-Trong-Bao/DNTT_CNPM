// src/pages/UserInfo.jsx
import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State quản lý Modal Đăng xuất
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // 1. State quản lý Modal Thành công (MỚI)
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'Khách',
      email: 'khach@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1'
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  // Logic Đăng xuất
  const handleLogoutClick = () => setShowLogoutModal(true);
  const cancelLogout = () => setShowLogoutModal(false);
  const confirmLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/pages/login');
  };

  // 2. Logic Lưu thay đổi (SỬA LẠI)
  const handleSave = () => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Cập nhật cả mockUser nếu cần
    const mockUser = JSON.parse(localStorage.getItem('mockUser'));
    if (mockUser && mockUser.email === user.email) {
        localStorage.setItem('mockUser', JSON.stringify({...mockUser, ...user}));
    }

    // THAY THẾ ALERT BẰNG MODAL
    setShowSuccessModal(true); 
  };

  // Hàm tắt modal thành công
  const closeSuccessModal = () => setShowSuccessModal(false);

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#fffbe6' }}>
      <Navbar />

      <div className="container py-5 flex-grow-1 d-flex justify-content-center">
        <div className="card shadow-sm border-0 p-4" style={{ width: '100%', maxWidth: '700px', backgroundColor: '#ffffff', borderRadius: '12px' }}>

          <h3 className="text-center mb-4 text-brown fw-bold">
            <i className="bi bi-person-circle me-2"></i> Thông tin tài khoản
          </h3>

          <form>
            {/* AVATAR */}
            <div className="mb-4 d-flex flex-column align-items-center">
              <div
                className="position-relative avatar-container"
                onClick={handleAvatarClick}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={user.avatar || 'https://via.placeholder.com/150'}
                  alt="Avatar"
                  className="rounded-circle shadow-sm"
                  style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #fff' }}
                />
                <div className="avatar-overlay rounded-circle d-flex justify-content-center align-items-center">
                  <i className="bi bi-camera-fill text-white fs-3"></i>
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
              <small className="text-muted mt-2">Chạm vào ảnh để thay đổi</small>
            </div>

            {/* INPUTS */}
            <div className="mb-3">
              <label className="fw-bold mb-1 small">Họ và tên</label>
              <input type="text" className="form-control" name="name" value={user.name || ''} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="fw-bold mb-1 small">Email</label>
              <input type="email" className="form-control" value={user.email || ''} disabled style={{ backgroundColor: '#f9f9f9' }} />
            </div>
            <div className="mb-3">
              <label className="fw-bold mb-1 small">Số điện thoại</label>
              <input type="text" className="form-control" name="phone" value={user.phone || ''} onChange={handleChange} />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold mb-1 small">Tỉnh / Thành</label>
                <select className="form-select" name="city" value={user.city || ''} onChange={handleChange}>
                  <option value="">-- Chọn --</option>
                  <option value="TP.HCM">TP.HCM</option>
                  <option value="HaNoi">Hà Nội</option>
                  <option value="DaNang">Đà Nẵng</option>
                  <option value="Chưa cập nhật">Chưa cập nhật</option>
                </select>
              </div>
              <div className="col-md-6 mb-4">
                <label className="fw-bold mb-1 small">Quận / Huyện</label>
                <input type="text" className="form-control" name="district" value={user.district || ''} onChange={handleChange} />
              </div>
            </div>

            <hr className="my-4" />

            <div className="d-flex justify-content-center gap-3">
              <button type="button" className="btn btn-success px-4 py-2 fw-bold shadow-sm" onClick={handleSave}>
                <i className="bi bi-check-circle-fill me-2"></i> Lưu thay đổi
              </button>
              <button type="button" className="btn btn-danger px-4 py-2 fw-bold shadow-sm" onClick={handleLogoutClick}>
                <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- MODAL 1: ĐĂNG XUẤT (GIỮ NGUYÊN) --- */}
      {showLogoutModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-body text-center p-4">
                  <div className="mb-3 text-warning">
                     <i className="bi bi-exclamation-circle-fill" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h4 className="fw-bold mb-2">Đăng xuất tài khoản?</h4>
                  <p className="text-muted">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?</p>
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <button className="btn btn-light px-4 py-2 fw-bold rounded-pill" onClick={cancelLogout}>Hủy bỏ</button>
                    <button className="btn btn-danger px-4 py-2 fw-bold rounded-pill" onClick={confirmLogout}>Đăng xuất ngay</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- MODAL 2: THÔNG BÁO THÀNH CÔNG (MỚI) --- */}
      {showSuccessModal && (
        <>
          {/* Lớp màn đen mờ */}
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          
          <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-sm"> {/* modal-sm cho nhỏ gọn */}
              <div className="modal-content border-0 shadow-lg rounded-4">
                
                <div className="modal-body text-center p-4">
                  {/* Icon Check màu xanh */}
                  <div className="mb-3 text-success">
                     <i className="bi bi-check-circle-fill" style={{ fontSize: '3.5rem' }}></i>
                  </div>
                  
                  <h4 className="fw-bold mb-2 text-success">Thành công!</h4>
                  <p className="text-muted mb-4">Thông tin tài khoản đã được cập nhật.</p>
                  
                  {/* Nút Đóng */}
                  <button 
                    type="button" 
                    className="btn btn-success px-5 py-2 fw-bold rounded-pill shadow-sm"
                    onClick={closeSuccessModal}
                  >
                    Tuyệt vời
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default UserInfo;