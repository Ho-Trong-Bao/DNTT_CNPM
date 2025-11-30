// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Home = () => {
  // Dữ liệu giả lập (Đã thêm location)
  const featuredBooks = [
    {
      id: 1,
      title: "Tôi thấy hoa vàng trên cỏ xanh",
      author: "Nguyễn Nhật Ánh",
      category: "Văn học",
      status: "Mới",
      price: "85.000đ",
      location: "Hà Nội", 
      image: "../../public/images/product1.avif"
    },
    {
      id: 2,
      title: "Dế Mèn phiêu lưu ký",
      author: "Tô Hoài",
      category: "Triết lý",
      status: "Cũ",
      price: "45.000đ",
      location: "TP.HCM",
      image: "../../public/images/product2.avif"
    },
    {
      id: 3,
      title: "Tuổi trẻ đáng giá bao nhiêu",
      author: "Rosie Nguyễn",
      category: "Kỹ năng sống",
      status: "Cũ nhẹ",
      price: "70.000đ",
      location: "Đà Nẵng",
      image: "../../public/images/product3.avif"
    }
  ];

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#fffbe6' }}>
      <Navbar />

      {/* --- HERO BANNER --- */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="row">
            <div className="col-md-8 offset-md-2 text-center">
              <h1 className="display-4 fw-bold mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                Khám phá và chia sẻ sách cũ quanh bạn
              </h1>
              <p className="lead mb-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                Kết nối cộng đồng yêu sách, trao đổi tri thức, tiết kiệm chi phí.
              </p>
              <div className="d-flex justify-content-center gap-2">
                <Link to="/pages/search" className="btn btn-custom shadow">
                  <i className="bi bi-search me-2"></i> Tìm sách ngay
                </Link>
                <Link to="/pages/create-posts" className="btn btn-outline-white shadow">
                  <i className="bi bi-pencil-square me-2"></i> Đăng bán sách
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SÁCH NỔI BẬT --- */}
      <div style={{ backgroundColor: '#faf8ef' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h3 className="fw-bold text-brown">
              <span role="img" aria-label="books" className="me-2">📚</span>
              Sách nổi bật
            </h3>
            <p className="text-muted">Những cuốn sách được tìm kiếm nhiều nhất tuần qua</p>
          </div>

          <div className="row">
            {featuredBooks.map((book) => (
              <div key={book.id} className="col-md-4 mb-4">
                <div className="card book-card h-100 shadow-sm">

                  <div className="position-relative">
                    <img src={book.image} className="card-img-top book-img" alt={book.title} />
                    {/* Badge màu cam nếu là sách Mới */}
                    {book.status === 'Mới' && (
                      <span className="position-absolute top-0 end-0 badge-orange px-2 py-1 m-2 rounded fw-bold small">
                        Mới
                      </span>
                    )}
                  </div>

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-brown fw-bold text-truncate" title={book.title}>
                      {book.title}
                    </h5>

                    {/* --- THÔNG TIN CHI TIẾT --- */}
                    <div className="mb-3">
                      <p className="card-text text-muted small mb-1">
                        Tác giả: <span className="fw-bold text-dark">{book.author}</span>
                      </p>

                      <p className="card-text text-muted small mb-1">
                        Thể loại: <span className="fw-bold text-dark">{book.category}</span>
                      </p>

                      <p className="card-text text-muted small mb-1">
                        Tình trạng:
                        <span className={book.status.includes("Mới") ? "fw-bold text-danger ms-1" : "fw-bold text-dark ms-1"}>
                          {book.status}
                        </span>
                      </p>

                      {/* THÊM: Địa chỉ */}
                      <p className="card-text text-muted small mb-0">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        <span className="text-dark">{book.location}</span>
                      </p>
                    </div>
                    {/* ------------------------- */}

                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className="price-tag">{book.price}</span>
                      <Link 
                        to={`/pages/book/${book.id}`}
                        className="btn btn-sm btn-custom px-3" 
                        style={{ fontSize: '0.8rem', borderRadius: '4px', textDecoration: 'none', color: 'white' }}
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- TÌM KIẾM QUANH BẠN --- */}
      <div className="bg-white py-5">
        <div className="container text-center">
          <h3 className="fw-bold text-brown mb-3">
            <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
            Tìm kiếm sách quanh bạn
          </h3>
          <p className="text-muted mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Không cần đi xa, hãy nhập địa chỉ của bạn để tìm những người bán sách cũ gần nhất.
          </p>
          <Link to="/pages/search" className="btn btn-custom px-5 py-3 fw-bold rounded-pill shadow">
            <i className="bi bi-search me-2"></i> Bắt đầu tìm kiếm
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;