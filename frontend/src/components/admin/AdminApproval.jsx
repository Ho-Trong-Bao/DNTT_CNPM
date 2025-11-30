import React, { useState } from 'react';

const AdminApproval = ({ allBooks, updateBooks, handleView }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // --- CÁC HÀNH ĐỘNG ---
    const handleApprove = (id) => {
        const updated = allBooks.map(b => b.id === id ? { ...b, approvalStatus: 'approved' } : b);
        updateBooks(updated);
    };

    const handleReject = (id) => {
        if (window.confirm("Bạn muốn từ chối bài đăng này?")) {
            const updated = allBooks.map(b => b.id === id ? { ...b, approvalStatus: 'rejected' } : b);
            updateBooks(updated);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Xác nhận xóa vĩnh viễn bài này?")) {
            const updated = allBooks.filter(b => b.id !== id);
            updateBooks(updated);
        }
    };

    // --- LOGIC LỌC ---
    const filteredBooks = allBooks.filter(book => {
        const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (book.poster && book.poster.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchStatus = filterStatus === 'all' || book.approvalStatus === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div>
            <div className="bg-white p-3 rounded shadow-sm mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-muted">Trạng thái:</span>
                    <select
                        className="form-select form-select-sm"
                        style={{ width: '150px' }}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Đã từ chối</option>
                    </select>
                </div>
                <div className="input-group" style={{ maxWidth: '400px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm theo tên sách hoặc người đăng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary"><i className="bi bi-search"></i></button>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="py-3 ps-4">ID</th>
                                <th>Tên sách</th>
                                <th>Người đăng</th>
                                <th>Giá</th>
                                <th>Trạng thái</th>
                                <th>Ngày</th>
                                <th className="text-end pe-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.length > 0 ? filteredBooks.map(book => (
                                <tr key={book.id}>
                                    <td className="ps-4 text-muted">#{book.id.toString().slice(-4)}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img src={book.image} alt="" className="rounded me-3 border" style={{ width: '40px', height: '55px', objectFit: 'cover' }} />
                                            <span className="fw-bold text-dark">{book.title}</span>
                                        </div>
                                    </td>
                                    <td>{book.poster}</td>
                                    <td className="fw-bold text-brown">{book.price}</td>
                                    <td>
                                        {book.approvalStatus === 'pending' && <span className="badge bg-warning text-dark">Chờ duyệt</span>}
                                        {book.approvalStatus === 'approved' && <span className="badge bg-success">Đã duyệt</span>}
                                        {book.approvalStatus === 'rejected' && <span className="badge bg-danger">Từ chối</span>}
                                    </td>
                                    <td className="text-muted small">{book.date}</td>
                                    <td className="text-end pe-4">
                                        <button className="btn btn-sm btn-outline-primary me-1" title="Xem" onClick={() => handleView(book)}>
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        {book.approvalStatus === 'pending' && (
                                            <>
                                                <button className="btn btn-sm btn-success me-1" onClick={() => handleApprove(book.id)}><i className="bi bi-check-lg"></i></button>
                                                <button className="btn btn-sm btn-danger me-1" onClick={() => handleReject(book.id)}><i className="bi bi-x-lg"></i></button>
                                            </>
                                        )}
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDelete(book.id)}><i className="bi bi-trash"></i></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                        Không tìm thấy dữ liệu phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminApproval; 