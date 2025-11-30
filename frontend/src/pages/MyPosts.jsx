import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const MyPosts = () => {
  // 1. Lấy dữ liệu trực tiếp từ localStorage ngay khi khởi tạo
  const [myBooks, setMyBooks] = useState(() => {
    const storedBooks = JSON.parse(localStorage.getItem('postedBooks'));
    return storedBooks || [];
  });
  
  // --- STATE CHO CHỨC NĂNG XÓA ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // --- STATE CHO CHỨC NĂNG SỬA (MỚI) ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null); // Lưu dữ liệu cuốn sách đang được sửa

  // --- STATE CHO THÔNG BÁO THÀNH CÔNG ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ==========================================
  // LOGIC XÓA (Giữ nguyên)
  // ==========================================
  const confirmDelete = (id) => {
    setBookToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (bookToDelete !== null) {
      const updatedBooks = myBooks.filter(book => book.id !== bookToDelete);
      setMyBooks(updatedBooks);
      localStorage.setItem('postedBooks', JSON.stringify(updatedBooks));
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
  };

  
  // A. Mở Modal Sửa và nạp dữ liệu cũ
  const handleEdit = (book) => {
    setEditData(book); // Copy dữ liệu sách vào form sửa
    setShowEditModal(true);
  };

  // B. Xử lý nhập liệu trong form sửa
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // C. Xử lý thay đổi ảnh trong form sửa (Dùng Base64)
  const handleEditImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // D. Lưu thay đổi
  const handleSaveEdit = (e) => {
    e.preventDefault();

    // Tìm sách cũ và thay thế bằng thông tin mới
    const updatedBooks = myBooks.map(book => {
      if (book.id === editData.id) {
        // Xử lý format giá tiền nếu cần (đảm bảo có chữ 'đ')
        let formattedPrice = editData.price;
        // Nếu người dùng nhập số thuần túy (ví dụ 50000), format lại thành 50.000đ
        // Logic đơn giản: nếu chưa có chữ 'đ' thì format
        if (!editData.price.toString().includes('đ')) {
             formattedPrice = parseInt(editData.price).toLocaleString('vi-VN') + 'đ';
        }

        return { ...editData, price: formattedPrice };
      }
      return book;
    });

    // Cập nhật State và LocalStorage
    setMyBooks(updatedBooks);
    localStorage.setItem('postedBooks', JSON.stringify(updatedBooks));

    // Đóng Modal Sửa, Mở Modal Thành công
    setShowEditModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#fffbe6' }}>
      <Navbar />

      <div style={{ backgroundColor: '#faf8ef' }} className="flex-grow-1">
        <div className="container py-5">
          
          <div className="text-center mb-5">
            <h3 className="fw-bold text-brown">
              <span className="me-2" style={{ color: '#e67e22' }}></span> 
              Bài đăng của tôi
            </h3>
            <p className="text-muted">Quản lý các cuốn sách bạn đang rao bán</p>
          </div>

          {/* DANH SÁCH SÁCH */}
          {myBooks.length > 0 ? (
            <div className="row">
              {myBooks.map((book) => (
                <div key={book.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <div className="card h-100 shadow-sm border-0 book-card" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                    
                    {/* Ảnh bìa */}
                    <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                      <img 
                        src={book.image} 
                        className="card-img-top w-100 h-100" 
                        style={{ objectFit: 'cover', opacity: book.approvalStatus === 'pending' ? 0.7 : 1 }} 
                        alt={book.title} 
                      />
                      
                      {/* Badge trạng thái */}
                      {book.approvalStatus === 'pending' ? (
                         <span className="position-absolute top-0 start-0 bg-warning text-dark px-2 py-1 m-2 rounded fw-bold small shadow-sm">
                           <i className="bi bi-hourglass-split me-1"></i> Chờ duyệt
                         </span>
                      ) : book.approvalStatus === 'approved' ? (
                         <span className="position-absolute top-0 start-0 bg-success text-white px-2 py-1 m-2 rounded fw-bold small shadow-sm">
                           <i className="bi bi-check-circle-fill me-1"></i> Đã duyệt
                         </span>
                      ) : (
                         <span className="position-absolute top-0 start-0 bg-secondary text-white px-2 py-1 m-2 rounded fw-bold small shadow-sm">
                           <i className="bi bi-dash-circle me-1"></i> Nháp
                         </span>
                      )}

                      {/* Badge Mới */}
                      {book.condition === 'Mới' && (
                        <span className="position-absolute top-0 end-0 badge-orange px-2 py-1 m-2 rounded fw-bold small">Mới</span>
                      )}
                    </div>

                    <div className="card-body p-3 d-flex flex-column">
                      <h6 className="card-title fw-bold text-brown mb-1 text-truncate" title={book.title}>{book.title}</h6>
                      <div className="mb-2" style={{ fontSize: '0.9rem' }}>
                        <div className="mb-1"><span className="text-muted">Tình trạng: </span><span className="fw-bold text-dark ms-1">{book.condition}</span></div>
                        <div className="mb-1"><span className="text-muted">Thể loại: </span><span className="fw-bold text-dark ms-1 text-truncate">{book.category}</span></div>
                        <div><span className="text-muted">Khu vực: </span><span className="fw-bold text-dark ms-1">{book.location}</span></div>
                      </div>

                      <div className="mt-auto">
                        <div className="mb-3"><span className="fw-bold text-danger fs-5">{book.price}</span></div>

                        {/* NÚT SỬA & XÓA */}
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-secondary flex-grow-1 fw-bold"
                            onClick={() => handleEdit(book)} // GỌI HÀM SỬA
                          >
                            <i className="bi bi-pencil me-1"></i> Sửa
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger flex-grow-1 fw-bold"
                            onClick={() => confirmDelete(book.id)}
                          >
                            <i className="bi bi-trash me-1"></i> Xóa
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="text-muted mb-3" style={{ fontSize: '4rem' }}>📭</div>
              <h5 className="text-muted">Bạn chưa đăng bán cuốn sách nào.</h5>
              <Link to="/pages/my-posts" className="btn btn-custom mt-3 shadow-sm">
                <i className="bi bi-plus-circle me-2"></i> Đăng bài ngay
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* --- MODAL 1: XÓA --- */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-body text-center p-4">
                <div className="mb-3 text-danger"><i className="bi bi-trash-fill" style={{ fontSize: '3rem' }}></i></div>
                <h5 className="fw-bold mb-2">Xóa bài đăng?</h5>
                <p className="text-muted small mb-4">Hành động này không thể hoàn tác.</p>
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-light w-50 fw-bold rounded-pill" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                  <button className="btn btn-danger w-50 fw-bold rounded-pill" onClick={handleDelete}>Xóa</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: SỬA BÀI VIẾT (GIAO DIỆN CHÍNH BẠN CẦN) --- */}
      {showEditModal && editData && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg"> {/* modal-lg cho rộng rãi */}
            <div className="modal-content border-0 shadow-lg rounded-4">
              
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-brown ms-3 mt-2">✏️ Chỉnh sửa thông tin sách</h5>
                <button type="button" className="btn-close me-2 mt-2" onClick={() => setShowEditModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                <form onSubmit={handleSaveEdit}>
                  <div className="row">
                    
                    {/* Cột Trái: Ảnh Bìa */}
                    <div className="col-md-4 text-center mb-3">
                      <div className="border rounded mb-2 d-flex align-items-center justify-content-center bg-light" style={{ height: '250px', overflow: 'hidden' }}>
                         <img src={editData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <label className="btn btn-sm btn-outline-secondary w-100">
                         Đổi ảnh bìa
                         <input type="file" hidden onChange={handleEditImage} accept="image/*" />
                      </label>
                    </div>

                    {/* Cột Phải: Thông tin sách (Form nhập liệu) */}
                    <div className="col-md-8">
                      <div className="mb-2">
                        <label className="small fw-bold">Tên sách</label>
                        <input type="text" className="form-control" name="title" value={editData.title} onChange={handleEditChange} required />
                      </div>
                      <div className="mb-2">
                        <label className="small fw-bold">Tác giả</label>
                        <input type="text" className="form-control" name="author" value={editData.author} onChange={handleEditChange} required />
                      </div>
                      
                      <div className="row">
                         <div className="col-6 mb-2">
                            <label className="small fw-bold">Giá bán</label>
                            <input type="text" className="form-control" name="price" value={editData.price} onChange={handleEditChange} required />
                         </div>
                         <div className="col-6 mb-2">
                            <label className="small fw-bold">Tình trạng</label>
                            <select className="form-select" name="condition" value={editData.condition} onChange={handleEditChange}>
                               <option value="Mới">Mới</option>
                               <option value="Cũ nhẹ">Cũ nhẹ</option>
                               <option value="Cũ">Cũ</option>
                            </select>
                         </div>
                      </div>

                      <div className="row">
                         <div className="col-6 mb-2">
                            <label className="small fw-bold">Thể loại</label>
                            <select className="form-select" name="category" value={editData.category} onChange={handleEditChange}>
                              <option value="Văn học">Văn học</option>
                              <option value="Kỹ năng sống">Kỹ năng sống</option>
                              <option value="Thiếu nhi">Thiếu nhi</option>
                              <option value="Truyện tranh">Truyện tranh</option>
                              <option value="Giáo trình">Giáo trình</option>
                            </select>
                         </div>
                         <div className="col-6 mb-2">
                            <label className="small fw-bold">Khu vực</label>
                            <select className="form-select" name="location" value={editData.location} onChange={handleEditChange}>
                               <option value="TP.HCM">TP.HCM</option>
                               <option value="Hà Nội">Hà Nội</option>
                               <option value="Đà Nẵng">Đà Nẵng</option>
                               <option value="Khác">Khác</option>
                            </select>
                         </div>
                      </div>

                    </div>
                  </div>

                  <div className="text-end mt-3 border-top pt-3">
                    <button type="button" className="btn btn-light fw-bold me-2 rounded-pill" onClick={() => setShowEditModal(false)}>Hủy bỏ</button>
                    <button type="submit" className="btn btn-custom fw-bold rounded-pill px-4">Lưu thay đổi</button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: THÀNH CÔNG --- */}
      {showSuccessModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1065 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-body text-center p-4">
                <div className="mb-3 text-success">
                    <i className="bi bi-check-circle-fill" style={{ fontSize: '3.5rem' }}></i>
                </div>
                <h4 className="fw-bold mb-2 text-success">Thành công!</h4>
                <p className="text-muted mb-4 small">Thông tin sách đã được cập nhật.</p>
                <button 
                  type="button" 
                  className="btn btn-success px-4 py-2 fw-bold rounded-pill shadow-sm w-100"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyPosts;