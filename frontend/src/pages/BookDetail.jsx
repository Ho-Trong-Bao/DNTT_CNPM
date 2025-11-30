// src/pages/BookDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookDetail = () => {
    const { id } = useParams();

    // --- 1. CHUẨN BỊ DỮ LIỆU ---
    const mockBooks = [
        { id: 1, title: "Tôi thấy hoa vàng trên cỏ xanh", author: "Nguyễn Nhật Ánh", category: "Văn học", status: "Mới", price: "85.000đ", location: "Hà Nội", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
        { id: 2, title: "Dế Mèn phiêu lưu ký", author: "Tô Hoài", category: "Triết lý", status: "Cũ", price: "45.000đ", location: "TP.HCM", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" },
        { id: 3, title: "Tuổi trẻ đáng giá bao nhiêu", author: "Rosie Nguyễn", category: "Kỹ năng sống", status: "Cũ nhẹ", price: "70.000đ", location: "Đà Nẵng", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
        { id: 4, title: "Không gia đình", author: "Hector Malot", condition: "Cũ", category: "Thiếu nhi", price: "120.000đ", location: "TP. Hồ Chí Minh", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop" },
        { id: 5, title: "Bắt trẻ đồng xanh", author: "J.D. Salinger", condition: "Cũ nhẹ", category: "Văn học", price: "75.000đ", location: "Hà Nội", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
        { id: 6, title: "Đắc nhân tâm", author: "Dale Carnegie", condition: "Mới", category: "Kỹ năng sống", price: "90.000đ", location: "TP. Hồ Chí Minh", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" },
        { id: 7, title: "Nhà giả kim", author: "Paulo Coelho", condition: "Cũ", category: "Văn học", price: "50.000đ", location: "Đà Nẵng", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
    ];

    const storedBooks = JSON.parse(localStorage.getItem('postedBooks')) || [];
    const allBooks = [...storedBooks, ...mockBooks];

    // Tìm sách hiện tại
    const book = allBooks.find(b => b.id.toString() === id);

    // Lọc sách tương tự (Trừ cuốn hiện tại ra) -> Lấy HẾT các cuốn còn lại
    const relatedBooks = allBooks.filter(b => b.id.toString() !== id);

    // --- LOGIC SLIDER (ĐIỀU HƯỚNG TRÁI PHẢI) ---
    const [startIndex, setStartIndex] = useState(0); // Vị trí bắt đầu hiển thị
    const itemsPerPage = 4; // Số sách hiện trên 1 màn hình

    const handleNext = () => {
        // Nếu vẫn còn sách phía sau thì tăng index lên
        if (startIndex + itemsPerPage < relatedBooks.length) {
            setStartIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        // Nếu không phải đang ở đầu thì giảm index xuống
        if (startIndex > 0) {
            setStartIndex(prev => prev - 1);
        }
    };

    // Cắt danh sách để chỉ hiển thị 4 cuốn từ vị trí startIndex
    const visibleBooks = relatedBooks.slice(startIndex, startIndex + itemsPerPage);

    // Cuộn lên đầu khi chuyển trang
    useEffect(() => {
        window.scrollTo(0, 0);

        // Sửa lỗi ESLint: Đặt trong setTimeout để nó chạy bất đồng bộ
        // React sẽ đợi vẽ xong giao diện rồi mới reset slider, mượt hơn và hết lỗi đỏ
        const timer = setTimeout(() => {
            setStartIndex(0);
        }, 0);

        return () => clearTimeout(timer); // Dọn dẹp bộ nhớ
    }, [id]);
    if (!book) return <div className="text-center py-5">Loading...</div>;

    return (
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#fffbe6' }}>
            <Navbar />

            <div className="container py-5 flex-grow-1">

                {/* --- PHẦN 1: CHI TIẾT SẢN PHẨM  --- */}
                <div className="bg-white p-4 rounded-3 shadow-sm mb-5">
                    <div className="row">
                        <div className="col-md-5 mb-4 mb-md-0">
                            <div className="border rounded overflow-hidden d-flex align-items-center justify-content-center bg-light" style={{ height: '400px' }}>
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x600?text=No+Image"; }}
                                />
                            </div>
                        </div>
                        <div className="col-md-7">
                            <h2 className="fw-bold text-brown mb-2">{book.title}</h2>
                            <p className="text-muted mb-4">Tác giả: <span className="fw-bold text-dark">{book.author}</span></p>

                            <div className="mb-4" style={{ fontSize: '1rem' }}>
                                <div className="mb-2"><span className="text-muted me-2">Tình trạng:</span><span className="fw-bold text-dark">{book.condition || book.status}</span></div>
                                <div className="mb-2"><span className="text-muted me-2">Thể loại:</span><span className="fw-bold text-dark">{book.category}</span></div>
                                <div className="mb-2"><span className="text-muted me-2">Khu vực:</span><span className="fw-bold text-dark">{book.location}</span></div>
                            </div>

                            <h3 className="text-danger fw-bold mb-4">{book.price}</h3>
                            <p className="text-dark mb-4">{book.description || "Mô tả sách..."}</p>

                            <div className="d-flex gap-3">
                                <button className="btn btn-custom px-4 py-2 shadow-sm"><i className="bi bi-telephone-fill me-2"></i> Liên hệ</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- PHẦN 2: SÁCH TƯƠNG TỰ (CÓ SLIDER) --- */}
                <div className="mt-5 position-relative">
                    <div className="text-center mb-4">
                        <h4 className="fw-bold text-brown">
                            <span className="me-2">📖</span> Các sách tương tự ({relatedBooks.length})
                        </h4>
                    </div>

                    <div className="d-flex align-items-center">

                        {/* NÚT PREV (TRÁI) */}
                        <button
                            className="btn btn-light rounded-circle shadow me-3 d-none d-md-block"
                            onClick={handlePrev}
                            disabled={startIndex === 0} // Mờ đi nếu đang ở đầu
                            style={{ width: '40px', height: '40px', opacity: startIndex === 0 ? 0.3 : 1 }}
                        >
                            <i className="bi bi-chevron-left text-brown"></i>
                        </button>

                        {/* DANH SÁCH SÁCH */}
                        <div className="row flex-grow-1 g-3">
                            {visibleBooks.map((item) => (
                                <div key={item.id} className="col-lg-3 col-md-4 col-6">
                                    <div className="card h-100 shadow-sm border-0 book-card" style={{ borderRadius: '10px', overflow: 'hidden' }}>

                                        {/* Ảnh bìa */}
                                        <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                            <Link to={`/book/${item.id}`}>
                                                <img src={item.image} className="card-img-top w-100 h-100" style={{ objectFit: 'cover' }} alt={item.title} />
                                            </Link>
                                            {/* Badge Mới (Nếu có) */}
                                            {(item.condition === 'Mới' || item.status === 'Mới') && (
                                                <span className="position-absolute top-0 end-0 badge-orange px-2 py-1 m-2 rounded fw-bold small">
                                                    Mới
                                                </span>
                                            )}
                                        </div>

                                        <div className="card-body p-3 d-flex flex-column">
                                            {/* Tên sách */}
                                            <h6 className="card-title fw-bold text-brown mb-1 text-truncate" title={item.title}>
                                                {item.title}
                                            </h6>

                                            {/* Tác giả */}
                                            <p className="text-muted small mb-2 text-truncate">
                                                <span className="fw-bold text-dark">{item.author}</span>
                                            </p>

                                            {/* --- BỔ SUNG THÔNG TIN CHI TIẾT (Giống trang Search) --- */}
                                            <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                                                <div className="mb-1">
                                                    <span className="text-muted">Thể loại: </span>
                                                    <span className="fw-bold text-dark text-truncate" title={item.category}>{item.category}</span>
                                                </div>
                                                <div className="mb-1">
                                                    <span className="text-muted">Tình trạng: </span>
                                                    <span className={(item.condition || item.status)?.includes("Mới") ? "fw-bold text-danger" : "fw-bold text-dark"}>
                                                        {item.condition || item.status}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-muted"><i className="bi bi-geo-alt-fill text-danger me-1"></i></span>
                                                    <span className="small text-dark">{item.location}</span>
                                                </div>
                                            </div>
                                            {/* ------------------------------------------------------- */}

                                            <div className="mt-auto d-flex justify-content-between align-items-center border-top pt-2">
                                                <span className="fw-bold text-danger small">{item.price}</span>
                                                <Link
                                                    to={`/pages/book/${item.id}`}
                                                    className="btn btn-sm btn-custom px-2 py-1"
                                                    style={{ fontSize: '0.75rem', borderRadius: '4px', textDecoration: 'none', color: 'white' }}
                                                >
                                                    Chi tiết
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* NÚT NEXT (PHẢI) */}
                        <button
                            className="btn btn-light rounded-circle shadow ms-3 d-none d-md-block"
                            onClick={handleNext}
                            disabled={startIndex + itemsPerPage >= relatedBooks.length} // Mờ đi nếu hết sách
                            style={{ width: '40px', height: '40px', opacity: startIndex + itemsPerPage >= relatedBooks.length ? 0.3 : 1 }}
                        >
                            <i className="bi bi-chevron-right text-brown"></i>
                        </button>

                    </div>

                    {/* Nút điều hướng mobile (nằm dưới cùng) */}
                    <div className="d-flex d-md-none justify-content-center gap-3 mt-3">
                        <button className="btn btn-light rounded-circle shadow" onClick={handlePrev} disabled={startIndex === 0}>
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <button className="btn btn-light rounded-circle shadow" onClick={handleNext} disabled={startIndex + itemsPerPage >= relatedBooks.length}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>

                </div>

            </div>
            <Footer />
        </div>
    );
};

export default BookDetail;