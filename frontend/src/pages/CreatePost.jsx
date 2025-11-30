import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // 1. State quản lý dữ liệu form
  const [postData, setPostData] = useState({
    title: '',
    author: '',
    category: '',
    condition: 'Mới',
    price: '',
    location: 'TP.HCM',
    contact: '', 
    description: ''
  });

  // State ảnh xem trước
  const [imagePreview, setImagePreview] = useState('https://via.placeholder.com/400x300?text=Chon+anh+bia');
  
  // State modal thành công
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Xử lý nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn ảnh bằng FileReader (Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  // LOGIC LƯU BÀI ĐĂNG
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newBook = {
      id: Date.now(),
      title: postData.title,
      author: postData.author,
      category: postData.category,
      condition: postData.condition,
      location: postData.location,
      price: parseInt(postData.price).toLocaleString('vi-VN') + 'đ', 
      image: imagePreview, 
      isUserPost: true,
      
      // --- QUAN TRỌNG: Mặc định là Chờ duyệt ---
      approvalStatus: 'pending' // pending (chờ), approved (duyệt), rejected (từ chối)
    };

    const existingBooks = JSON.parse(localStorage.getItem('postedBooks')) || [];
    const updatedBooks = [newBook, ...existingBooks];

    localStorage.setItem('postedBooks', JSON.stringify(updatedBooks));
    
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Chuyển hướng về trang quản lý bài đăng của tôi để xem trạng thái
    navigate('/pages/my-posts'); 
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#fffbe6' }}>
      
      <Navbar />

      <div className="container py-5 flex-grow-1 d-flex justify-content-center">
        <div className="card shadow-sm border-0 p-4" style={{ width: '100%', maxWidth: '1000px', backgroundColor: '#ffffff', borderRadius: '12px' }}>
          
          <h3 className="text-center mb-4 text-brown fw-bold">
            <span role="img" aria-label="books" className="me-2"></span> 
            Đăng bán sách của bạn
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* CỘT TRÁI: ẢNH BÌA */}
              <div className="col-md-4 mb-4 text-center">
                <div 
                  className="border rounded mb-3 d-flex align-items-center justify-content-center bg-light"
                  style={{ height: '300px', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
                <label className="fw-bold text-muted small mb-2 d-block">Ảnh bìa sách</label>
                <input 
                  type="file" 
                  className="form-control" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>

              {/* CỘT PHẢI: FORM NHẬP LIỆU */}
              <div className="col-md-8">
                <div className="mb-3">
                  <label className="fw-bold mb-1 small">Tên sách</label>
                  <input type="text" className="form-control" placeholder="Nhập tên sách..." name="title" value={postData.title} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="fw-bold mb-1 small">Tác giả</label>
                  <input type="text" className="form-control" placeholder="Tên tác giả..." name="author" value={postData.author} onChange={handleChange} required />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="fw-bold mb-1 small">Thể loại</label>
                    <select className="form-select" name="category" value={postData.category} onChange={handleChange} required>
                      <option value="">-- Chọn thể loại --</option>
                      <option value="Văn học">Văn học</option>
                      <option value="Kỹ năng sống">Kỹ năng sống</option>
                      <option value="Thiếu nhi">Thiếu nhi</option>
                      <option value="Truyện tranh">Truyện tranh</option>
                      <option value="Giáo trình">Giáo trình</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="fw-bold mb-1 small">Tình trạng</label>
                    <select className="form-select" name="condition" value={postData.condition} onChange={handleChange}>
                      <option value="Mới">Mới</option>
                      <option value="Cũ nhẹ">Cũ nhẹ</option>
                      <option value="Cũ">Cũ</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="fw-bold mb-1 small">Giá bán (VNĐ)</label>
                  <input type="number" className="form-control" placeholder="VD: 50000" name="price" value={postData.price} onChange={handleChange} required />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="fw-bold mb-1 small">Tỉnh / Thành phố</label>
                    <select className="form-select" name="location" value={postData.location} onChange={handleChange}>
                      <option value="TP.HCM">TP.HCM</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="fw-bold mb-1 small">Thông tin liên hệ</label>
                    <input type="text" className="form-control" placeholder="SĐT hoặc Email..." name="contact" value={postData.contact} onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="fw-bold mb-1 small">Mô tả chi tiết</label>
                  <textarea className="form-control" rows="4" placeholder="Giới thiệu về sách..." name="description" value={postData.description} onChange={handleChange}></textarea>
                </div>

                <div className="text-end">
                  <button type="submit" className="btn btn-custom px-4 py-2 fw-bold shadow-sm">
                    <i className="bi bi-upload me-2"></i> Đăng bài ngay
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL THÀNH CÔNG */}
      {showSuccessModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-body text-center p-4">
                <div className="mb-3 text-success">
                   <i className="bi bi-check-circle-fill" style={{ fontSize: '3.5rem' }}></i>
                </div>
                <h4 className="fw-bold mb-2 text-success">Đăng bài thành công!</h4>
                <p className="text-muted mb-4 small">Bài đăng của bạn đang chờ duyệt.</p>
                <button type="button" className="btn btn-success px-4 py-2 fw-bold rounded-pill shadow-sm w-100" onClick={handleCloseModal}>
                  Xem bài đăng của tôi
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

export default CreatePost;