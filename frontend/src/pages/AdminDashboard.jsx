import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- IMPORT CÁC COMPONENT CON ---
import AdminOverview from '../components/admin/AdminOverview';
import AdminUsers from '../components/admin/AdminUsers';
import AdminApproval from '../components/admin/AdminApproval';
import AdminCategories from '../components/admin/AdminCategories';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  // --- STATE QUẢN LÝ MODAL CHI TIẾT SÁCH (Dùng chung cho cả Approval và Overview nếu cần) ---
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  // --- QUẢN LÝ DỮ LIỆU CHUNG (SÁCH) ---
  // Lý do để ở đây: Để AdminApproval có thể cập nhật, và AdminOverview có thể đếm số lượng
  const [allBooks, setAllBooks] = useState(() => {
    const storedBooks = JSON.parse(localStorage.getItem('postedBooks')) || [];
    return storedBooks.map(book => ({
        ...book,
        date: book.date || new Date().toISOString().slice(0, 10),
        poster: book.poster || "Người dùng ẩn danh" 
    }));
  });

  // --- QUẢN LÝ DỮ LIỆU CHUNG (USER) ---
  const [allUsers, setAllUsers] = useState([
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0909123456', date: '2024-09-12', status: 'active' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0987654321', date: '2024-11-02', status: 'locked' },
    { id: 3, name: 'Phạm C', email: 'phamc@example.com', phone: '0912345678', date: '2023-08-20', status: 'active' },
  ]);

  // Hàm cập nhật sách (Truyền xuống AdminApproval)
  const updateBooks = (newBooks) => {
      setAllBooks(newBooks);
      localStorage.setItem('postedBooks', JSON.stringify(newBooks));
  };

  // Hàm xử lý Logout
  const handleLogout = () => { navigate('/'); };

  // Hàm mở Modal xem chi tiết (Truyền xuống AdminApproval)
  const handleView = (book) => {
    setViewData(book);
    setShowViewModal(true);
  };

  // --- LOGIC DUYỆT BÀI TỪ MODAL CHI TIẾT ---
  const handleApproveFromModal = () => {
    const updated = allBooks.map(b => b.id === viewData.id ? { ...b, approvalStatus: 'approved' } : b);
    updateBooks(updated);
    setShowViewModal(false);
  };

  const handleRejectFromModal = () => {
    if(window.confirm("Bạn muốn từ chối bài đăng này?")) {
        const updated = allBooks.map(b => b.id === viewData.id ? { ...b, approvalStatus: 'rejected' } : b);
        updateBooks(updated);
        setShowViewModal(false);
    }
  };

  // Tính toán số liệu cho Overview
  const pendingCount = allBooks.filter(b => b.approvalStatus === 'pending').length;

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#fcf8e3' }}>
      
      {/* --- SIDEBAR --- */}
      <div className="d-flex flex-column p-3 bg-white shadow-sm" style={{ width: '260px', minHeight: '100vh' }}>
        <Link to="/" className="d-flex align-items-center mb-4 text-decoration-none text-brown fw-bold fs-5">
            <i className="bi bi-book-half me-2 fs-4"></i>
            Quản trị Admin
        </Link>
        
        <ul className="nav nav-pills flex-column mb-auto gap-2">
          <li>
            <button 
              className={`nav-link w-100 text-start ${activeTab === 'dashboard' ? 'active bg-custom' : 'text-dark'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <i className="bi bi-grid-fill me-2"></i> Tổng quan
            </button>
          </li>
          <li>
            <button 
                className={`nav-link w-100 text-start ${activeTab === 'users' ? 'active bg-custom' : 'text-dark'}`}
                onClick={() => setActiveTab('users')}
            >
              <i className="bi bi-people-fill me-2"></i> Quản lý người dùng
            </button>
          </li>
          <li>
            <button 
              className={`nav-link w-100 text-start ${activeTab === 'approval' ? 'active bg-custom' : 'text-dark'}`}
              onClick={() => setActiveTab('approval')}
            >
              <i className="bi bi-check-square-fill me-2"></i> Duyệt bài đăng
              {pendingCount > 0 && <span className="badge bg-danger ms-auto float-end">{pendingCount}</span>}
            </button>
          </li>
          <li>
            <button 
                className={`nav-link w-100 text-start ${activeTab === 'categories' ? 'active bg-custom' : 'text-dark'}`}
                onClick={() => setActiveTab('categories')}
            >
              <i className="bi bi-tag-fill me-2"></i> Quản lý thể loại
            </button>
          </li>
          <li>
            <button className="nav-link w-100 text-start text-dark">
              <i className="bi bi-flag-fill me-2"></i> Báo cáo vi phạm
            </button>
          </li>
        </ul>
        
        <hr className="mt-auto" />
        <div className="small text-muted">Admin Panel v1.0</div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow-1 p-4">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-brown fw-bold mb-0">
                {activeTab === 'dashboard' && 'Tổng quan'}
                {activeTab === 'users' && 'Quản lý người dùng'}
                {activeTab === 'approval' && 'Duyệt bài đăng'}
                {activeTab === 'categories' && 'Quản lý thể loại'}
            </h4>
            <div className="d-flex gap-2">
                <button className="btn btn-light border text-muted"><i className="bi bi-gear-fill me-1"></i> Cài đặt</button>
                <button className="btn btn-outline-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-1"></i> Đăng xuất</button>
            </div>
        </div>

        {/* === RENDER NỘI DUNG THEO TAB === */}
        {activeTab === 'dashboard' && (
            <AdminOverview 
                totalUsers={allUsers.length} 
                totalPosts={allBooks.length} 
                pendingCount={pendingCount} 
            />
        )}

        {activeTab === 'users' && (
            <AdminUsers allUsers={allUsers} setAllUsers={setAllUsers} />
        )}

        {activeTab === 'approval' && (
            <AdminApproval 
                allBooks={allBooks} 
                updateBooks={updateBooks} 
                handleView={handleView} 
            />
        )}

        {activeTab === 'categories' && (
            <AdminCategories />
        )}

      </div>

      {/* --- MODAL XEM CHI TIẾT SÁCH (Dùng chung ở cấp cha) --- */}
      {showViewModal && viewData && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title fw-bold text-brown"><i className="bi bi-book me-2"></i> Chi tiết bài đăng</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                  <div className="row">
                    <div className="col-md-5 mb-3 mb-md-0">
                        <div className="border rounded overflow-hidden bg-light d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                            <img src={viewData.image} alt={viewData.title} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        </div>
                    </div>
                    <div className="col-md-7">
                        <h3 className="fw-bold text-brown mb-3">{viewData.title}</h3>
                        <div className="mb-3" style={{ fontSize: '1rem' }}>
                            <p className="mb-1"><span className="text-muted fw-bold me-2">Tác giả:</span> {viewData.author}</p>
                            <p className="mb-1"><span className="text-muted fw-bold me-2">Thể loại:</span> {viewData.category}</p>
                            <p className="mb-1"><span className="text-muted fw-bold me-2">Tình trạng:</span> {viewData.condition}</p>
                            <p className="mb-1"><span className="text-muted fw-bold me-2">Giá:</span> <span className="text-danger fw-bold">{viewData.price}</span></p>
                            <p className="mb-1"><span className="text-muted fw-bold me-2">Khu vực:</span> {viewData.location}</p>
                        </div>
                        <div className="alert alert-light border p-2">
                            <small className="text-muted fw-bold d-block mb-1">Người đăng:</small>
                            <div className="d-flex justify-content-between">
                                <span>{viewData.poster || "Nguyễn Văn A"}</span>
                                <span className="fw-bold text-dark"> — Liên hệ: {viewData.contact || "0909123456"}</span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 bg-light rounded-bottom-4">
                  {viewData.approvalStatus === 'pending' && (
                      <>
                        <button className="btn btn-success fw-bold" onClick={handleApproveFromModal}>Duyệt</button>
                        <button className="btn btn-danger fw-bold" onClick={handleRejectFromModal}>Từ chối</button>
                      </>
                  )}
                  <button className="btn btn-secondary fw-bold" onClick={() => setShowViewModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;