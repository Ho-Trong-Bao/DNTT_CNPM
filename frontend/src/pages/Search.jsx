import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Search = () => {
    // 1. DỮ LIỆU GIẢ LẬP GỐC (Mock Data) - Đã bổ sung location cho tất cả
    const mockBooks = [
        { id: 1, title: "Bắt trẻ đồng xanh", author: "J.D. Salinger", condition: "Cũ nhẹ", category: "Văn học", price: "75.000đ", location: "Hà Nội", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
        { id: 2, title: "Đắc nhân tâm", author: "Dale Carnegie", condition: "Mới", category: "Kỹ năng sống", price: "90.000đ", location: "TP.HCM", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" },
        { id: 3, title: "Nhà giả kim", author: "Paulo Coelho", condition: "Cũ", category: "Văn học", price: "50.000đ", location: "Đà Nẵng", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
        { id: 4, title: "Không gia đình", author: "Hector Malot", condition: "Cũ", category: "Thiếu nhi", price: "120.000đ", location: "TP.HCM", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop" }
    ];

    // --- SỬA LOGIC LẤY SÁCH TẠI ĐÂY ---
    const storedBooks = JSON.parse(localStorage.getItem('postedBooks')) || [];
    
    // CHỈ LẤY SÁCH ĐÃ ĐƯỢC DUYỆT (approved)
    // Điều này sẽ ngăn sách 'pending' xuất hiện ở trang Tìm kiếm
    const approvedBooks = storedBooks.filter(book => book.approvalStatus === 'approved');
    
    // Gộp: Sách người dùng đăng (đã duyệt) + Sách mẫu
    const allBooks = [...approvedBooks, ...mockBooks];

    // 2. STATE QUẢN LÝ BỘ LỌC
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        location: '',
        priceRange: ''
    });

    // Khởi tạo danh sách hiển thị ban đầu
    const [filteredBooks, setFilteredBooks] = useState(allBooks);

    // Hàm cập nhật state khi nhập liệu
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // 3. HÀM XỬ LÝ TÌM KIẾM
    const handleSearch = (e) => {
        e.preventDefault();
        let result = allBooks;

        if (filters.keyword) {
            const lowerKeyword = filters.keyword.toLowerCase();
            result = result.filter(book => 
                book.title.toLowerCase().includes(lowerKeyword) || 
                book.author.toLowerCase().includes(lowerKeyword)
            );
        }

        if (filters.category && filters.category !== '') {
            result = result.filter(book => book.category === filters.category);
        }

        if (filters.location && filters.location !== '') {
            result = result.filter(book => book.location === filters.location);
        }

        if (filters.priceRange && filters.priceRange !== '') {
            result = result.filter(book => {
                const priceNumber = parseInt(book.price.replace(/\./g, '').replace('đ', ''));
                if (filters.priceRange === 'under50') return priceNumber < 50000;
                if (filters.priceRange === '50to100') return priceNumber >= 50000 && priceNumber <= 100000;
                if (filters.priceRange === 'above100') return priceNumber > 100000;
                return true;
            });
        }

        setFilteredBooks(result);
    };

    return (
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#fffbe6' }}>
            <Navbar />
            <div style={{ backgroundColor: '#faf8ef' }} className="flex-grow-1">
                
                <div className="container py-5">
                    <h3 className="text-center text-brown fw-bold mb-4">
                        <i className="bi bi-search me-2"></i> Tìm kiếm sách quanh bạn
                    </h3>

                    {/* KHUNG TÌM KIẾM */}
                    <div className="bg-white p-4 rounded-3 shadow-sm mb-5">
                        <form className="row g-3" onSubmit={handleSearch}>
                            <div className="col-md-4">
                                <input type="text" name="keyword" className="form-control py-2" placeholder="Từ khóa: tên sách, tác giả..." value={filters.keyword} onChange={handleChange} />
                            </div>
                            <div className="col-md-2">
                                <select className="form-select py-2 text-muted" name="category" value={filters.category} onChange={handleChange}>
                                    <option value="">Tất cả thể loại</option>
                                    <option value="Văn học">Văn học</option>
                                    <option value="Kỹ năng sống">Kỹ năng sống</option>
                                    <option value="Thiếu nhi">Thiếu nhi</option>
                                    <option value="Truyện tranh">Truyện tranh</option>
                                    <option value="Giáo trình">Giáo trình</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <select className="form-select py-2 text-muted" name="location" value={filters.location} onChange={handleChange}>
                                    <option value="">Tất cả khu vực</option>
                                    <option value="TP.HCM">TP.HCM</option>
                                    <option value="Hà Nội">Hà Nội</option>
                                    <option value="Đà Nẵng">Đà Nẵng</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <select className="form-select py-2 text-muted" name="priceRange" value={filters.priceRange} onChange={handleChange}>
                                    <option value="">Tất cả mức giá</option>
                                    <option value="under50">Dưới 50k</option>
                                    <option value="50to100">50k - 100k</option>
                                    <option value="above100">Trên 100k</option>
                                </select>
                            </div>
                            <div className="col-md-1">
                                <button type="submit" className="btn btn-custom w-100 py-2"><i className="bi bi-search"></i></button>
                            </div>
                        </form>
                    </div>

                    {/* KẾT QUẢ TÌM KIẾM */}
                    <div className="text-center mb-4">
                        <h4 className="fw-bold text-brown">
                            <span className="me-2" style={{ color: '#e67e22' }}>📚</span>
                            Kết quả tìm kiếm ({filteredBooks.length})
                        </h4>
                    </div>

                    <div className="row">
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <div key={book.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <div className="card h-100 shadow-sm border-0 book-card" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                        
                                        {/* Ảnh bìa */}
                                        <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                                            <img
                                                src={book.image}
                                                className="card-img-top w-100 h-100"
                                                style={{ objectFit: 'cover' }}
                                                alt={book.title}
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/200x300?text=No+Image"; }}
                                            />
                                            {/* Badge Mới */}
                                            {book.condition === 'Mới' && (
                                                <span className="position-absolute top-0 end-0 badge-orange px-2 py-1 m-2 rounded fw-bold small">
                                                    Mới
                                                </span>
                                            )}
                                        </div>

                                        <div className="card-body p-3 d-flex flex-column">
                                            <h6 className="card-title fw-bold text-brown mb-1 text-truncate" title={book.title}>{book.title}</h6>
                                            <p className="text-muted small mb-2">Tác giả: <span className="fw-bold text-dark">{book.author}</span></p>
                                            
                                            {/* Thông tin chi tiết */}
                                            <div className="mb-2" style={{ fontSize: '0.9rem' }}>
                                                <div className="mb-1">
                                                    <span className="text-muted">Thể loại: </span>
                                                    <span className="fw-bold text-dark ms-2 text-truncate" title={book.category}>{book.category}</span>
                                                </div>
                                                <div className="mb-1">
                                                    <span className="text-muted">Tình trạng: </span>
                                                    <span className={book.condition.includes("Mới") ? "fw-bold text-danger ms-2" : "fw-bold text-dark ms-2"}>
                                                        {book.condition}
                                                    </span>
                                                </div>
                                                <div className="mt-1">
                                                    <span className="text-muted"><i className="bi bi-geo-alt-fill text-danger me-1"></i></span>
                                                    <span className="small text-dark">{book.location}</span>
                                                </div>
                                            </div>

                                            <hr className="my-2" style={{ opacity: 0.1 }} />

                                            <div className="mt-auto d-flex justify-content-between align-items-center">
                                                <span className="fw-bold text-danger" style={{ fontSize: '1.1rem' }}>{book.price}</span>
                                                <Link 
                                                    to={`/pages/book/${book.id}`} 
                                                    className="btn btn-sm btn-custom px-3" 
                                                    style={{ fontSize: '0.8rem', borderRadius: '4px', textDecoration: 'none', color: 'white' }}
                                                >
                                                    Chi tiết
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <div className="text-muted mb-3" style={{ fontSize: '4rem' }}></div>
                                <p className="text-muted fs-5">Không tìm thấy cuốn sách nào phù hợp...</p>
                                <p className="small text-muted">Bạn có thể thử thay đổi bộ lọc hoặc đăng bài tìm sách mới.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Search;